"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { loiSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { generateLoiPdf } from "@/lib/loi";
import { makeReference } from "@/lib/utils";
import { sendEmail, EMAIL_INTERNAL_TO } from "@/lib/email/send";
import LoiReady from "@/emails/loi-ready";
import { type ActionState, formToObject, validate } from "@/lib/action-state";

const SIGNED_URL_TTL = 60 * 60 * 24 * 30; // 30 days

/**
 * Generates a Purchase Letter of Intent (steel / oil trading), stores the PDF,
 * records it, emails the buyer + internal inbox, and returns a download link.
 */
export async function generatePurchaseLoi(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formToObject(formData);

  if (values.website) return { ok: false, message: "Invalid submission." };

  const limit = await rateLimit("loi", { max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return { ok: false, message: "Too many attempts. Please try again shortly." };
  }

  const result = validate(loiSchema, values);
  if (!result.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: result.errors };
  }

  const input = result.data;
  const reference = makeReference("SAM-LOI");
  const subject = `Purchase order for ${input.quantity} ton of ${input.product}`;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "[SAMORE] LOI failed: Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in .env.local, then run `npm run check`.",
    );
    return {
      ok: false,
      message:
        "The document service is not connected yet. Please contact us at SAMORE2021@gmail.com and we will issue your LOI directly.",
    };
  }

  try {
    const supabase = createAdminClient();

    const pdfBytes = await generateLoiPdf({
      reference,
      customerName: input.customerName,
      company: input.company,
      email: input.email,
      phone: input.phone,
      subject,
      product: input.product,
      quantity: `${input.quantity} ton`,
      monthlyDelivery: input.monthlyDelivery || null,
      port: input.port || null,
      country: input.country || null,
    });

    const pdfPath = `${new Date().getFullYear()}/${reference}.pdf`;
    const { error: uploadErr } = await supabase.storage
      .from("loi")
      .upload(pdfPath, pdfBytes, { contentType: "application/pdf", upsert: true });
    if (uploadErr) throw uploadErr;

    const { data: signed } = await supabase.storage
      .from("loi")
      .createSignedUrl(pdfPath, SIGNED_URL_TTL);

    const { error: loiErr } = await supabase.from("loi").insert({
      reference,
      customer_name: input.customerName,
      company: input.company,
      email: input.email.toLowerCase(),
      phone: input.phone,
      subject,
      quantity: `${input.quantity} ton`,
      currency: "USD",
      pdf_path: pdfPath,
      pdf_url: signed?.signedUrl ?? null,
    });
    if (loiErr) throw loiErr;

    // Also capture the inquiry as a contact message for follow-up.
    await supabase.from("contact_messages").insert({
      name: input.customerName,
      company: input.company,
      phone: input.phone,
      email: input.email.toLowerCase(),
      inquiry_type: input.commodity === "Oil" ? "Oil Trading" : "Steel Trading",
      message:
        `Purchase LOI ${reference}\n` +
        `Product: ${input.product}\nQuantity: ${input.quantity} ton\n` +
        `Monthly delivery: ${input.monthlyDelivery || "—"}\n` +
        `Port: ${input.port || "—"}\nCountry: ${input.country || "—"}\n` +
        `Notes: ${input.notes || "—"}`,
      status: "new",
    });

    await supabase.from("activity_logs").insert({
      action: "loi.purchase_created",
      entity: "loi",
      meta: { reference, product: input.product, quantity: input.quantity },
    });

    await Promise.all([
      signed?.signedUrl
        ? sendEmail({
            to: input.email,
            subject: `Your Purchase Letter of Intent — ${reference}`,
            react: LoiReady({
              customerName: input.customerName,
              reference,
              subject,
              downloadUrl: signed.signedUrl,
            }),
          })
        : Promise.resolve({ ok: true as const }),
      sendEmail({
        to: EMAIL_INTERNAL_TO,
        subject: `New Purchase LOI — ${input.product} — ${reference}`,
        react: LoiReady({
          customerName: input.customerName,
          reference,
          subject,
          downloadUrl: signed?.signedUrl ?? "",
        }),
        replyTo: input.email,
      }),
    ]);

    return {
      ok: true,
      message: "Your Letter of Intent has been generated.",
      data: { reference, loiUrl: signed?.signedUrl ?? "", subject },
    };
  } catch (err) {
    console.error("generatePurchaseLoi failed:", err);
    return {
      ok: false,
      message:
        "We could not generate the LOI right now. Please try again or email SAMORE2021@gmail.com.",
    };
  }
}
