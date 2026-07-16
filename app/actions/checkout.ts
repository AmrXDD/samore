"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { orderSchema, cartItemSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { generateLoiPdf } from "@/lib/loi";
import { makeReference } from "@/lib/utils";
import { sendEmail, EMAIL_INTERNAL_TO } from "@/lib/email/send";
import CourseRegistration from "@/emails/course-registration";
import PaymentPending from "@/emails/payment-pending";
import { formatCurrency } from "@/lib/utils";
import { type ActionState, formToObject, validate } from "@/lib/action-state";

const SIGNED_URL_TTL = 60 * 60 * 24 * 30; // 30 days

/**
 * Cart checkout: creates ONE bank-transfer order for every course in the cart,
 * generates a combined LOI PDF, stores the line items, and returns the payment
 * reference + signed LOI link. Prices are re-read from the database — never
 * trusted from the client.
 */
export async function createOrder(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formToObject(formData);

  if (values.website) return { ok: false, message: "Invalid submission." };

  const limit = await rateLimit("checkout", { max: 6, windowMs: 60_000 });
  if (!limit.allowed) {
    return { ok: false, message: "Too many attempts. Please try again shortly." };
  }

  const parsed = validate(orderSchema, values);
  if (!parsed.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: parsed.errors };
  }
  const input = parsed.data;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error(
      "[SAMORE] Checkout failed: Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in .env.local, then run `npm run check`.",
    );
    return {
      ok: false,
      message:
        "Ordering is not connected yet. Please contact us at SAMORE2021@gmail.com to complete your enrollment.",
    };
  }

  // Parse + validate the cart payload.
  let cart: { courseId: string; quantity: number }[];
  try {
    const raw = JSON.parse(input.items);
    cart = cartItemSchema.array().min(1).parse(raw);
  } catch {
    return { ok: false, message: "Your cart is empty or invalid." };
  }

  const supabase = createAdminClient();

  try {
    // Authoritative course data from the DB.
    const { data: courses, error: coursesErr } = await supabase
      .from("courses")
      .select("id, title, code, price, currency")
      .in(
        "id",
        cart.map((c) => c.courseId),
      )
      .eq("visibility", "published");

    if (coursesErr) throw coursesErr;
    if (!courses || courses.length === 0) {
      return { ok: false, message: "The courses in your cart are no longer available." };
    }

    type Row = { id: string; title: string; code: string | null; price: number; currency: string };
    const byId = new Map<string, Row>((courses as Row[]).map((c) => [c.id, c]));

    const lines = cart
      .filter((c) => byId.has(c.courseId))
      .map((c) => {
        const course = byId.get(c.courseId)!;
        return {
          course_id: course.id,
          title: course.title,
          code: course.code,
          price: course.price,
          quantity: c.quantity,
          lineTotal: course.price * c.quantity,
        };
      });

    if (lines.length === 0) {
      return { ok: false, message: "The courses in your cart are no longer available." };
    }

    const currency = (courses[0] as Row).currency || "USD";
    const total = lines.reduce((s, l) => s + l.lineTotal, 0);
    const paymentRef = makeReference("SAM-PAY");
    const loiRef = makeReference("SAM-LOI");
    const summary =
      lines.length === 1
        ? lines[0].title
        : `${lines.length} courses (${lines.map((l) => l.code ?? l.title).join(", ")})`;

    // Registration row per course (keeps enrollment reporting intact).
    for (const line of lines) {
      await supabase.from("course_registrations").insert({
        course_id: line.course_id,
        customer_name: input.customerName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        company: input.company || null,
        status: "pending",
      });
    }

    const { data: payment, error: payErr } = await supabase
      .from("payments")
      .insert({
        reference: paymentRef,
        course_id: lines.length === 1 ? lines[0].course_id : null,
        customer_name: input.customerName,
        email: input.email.toLowerCase(),
        phone: input.phone,
        company: input.company || null,
        amount: total,
        currency,
        method: "bank_transfer",
        status: "pending",
        admin_notes: input.notes ? `Customer notes: ${input.notes}` : null,
      })
      .select("id")
      .single();
    if (payErr) throw payErr;

    // Line items.
    const { error: itemsErr } = await supabase.from("payment_items").insert(
      lines.map((l) => ({
        payment_id: payment.id,
        course_id: l.course_id,
        title: l.title,
        code: l.code,
        price: l.price,
        quantity: l.quantity,
      })),
    );
    if (itemsErr) throw itemsErr;

    // LOI covering the whole order.
    const pdfBytes = await generateLoiPdf({
      reference: loiRef,
      customerName: input.customerName,
      company: input.company || null,
      email: input.email,
      phone: input.phone,
      subject: `Course enrollment — ${summary}`,
      quantity: `${lines.reduce((s, l) => s + l.quantity, 0)} seat(s)`,
      amount: total,
      currency,
    });

    const pdfPath = `${new Date().getFullYear()}/${loiRef}.pdf`;
    const { error: upErr } = await supabase.storage
      .from("loi")
      .upload(pdfPath, pdfBytes, { contentType: "application/pdf", upsert: true });
    if (upErr) throw upErr;

    const { data: signed } = await supabase.storage
      .from("loi")
      .createSignedUrl(pdfPath, SIGNED_URL_TTL);

    const { data: loi, error: loiErr } = await supabase
      .from("loi")
      .insert({
        reference: loiRef,
        payment_id: payment.id,
        customer_name: input.customerName,
        company: input.company || null,
        email: input.email.toLowerCase(),
        phone: input.phone,
        subject: `Course enrollment — ${summary}`,
        amount: total,
        currency,
        pdf_path: pdfPath,
        pdf_url: signed?.signedUrl ?? null,
      })
      .select("id")
      .single();
    if (loiErr) throw loiErr;

    await supabase.from("payments").update({ loi_id: loi.id }).eq("id", payment.id);

    await supabase.from("activity_logs").insert({
      action: "order.created",
      entity: "payments",
      entity_id: payment.id,
      meta: { reference: paymentRef, total, items: lines.length, email: input.email },
    });

    // Emails are optional — skipped silently when Resend is not configured.
    const amountLabel = formatCurrency(total, currency);
    await Promise.all([
      sendEmail({
        to: input.email,
        subject: `Registration received — ${summary}`,
        react: CourseRegistration({
          customerName: input.customerName,
          courseTitle: summary,
          reference: paymentRef,
          amount: amountLabel,
        }),
      }),
      sendEmail({
        to: EMAIL_INTERNAL_TO,
        subject: `New course order — ${summary} — ${paymentRef}`,
        replyTo: input.email,
        react: PaymentPending({
          customerName: input.customerName,
          reference: paymentRef,
          amount: amountLabel,
          courseTitle: summary,
        }),
      }),
    ]);

    return {
      ok: true,
      message: "Your order has been created.",
      data: {
        reference: paymentRef,
        loiUrl: signed?.signedUrl ?? "",
        amount: amountLabel,
        summary,
      },
    };
  } catch (err) {
    console.error("createOrder failed:", err);
    return {
      ok: false,
      message: "We could not process your order. Please try again or contact us.",
    };
  }
}

/**
 * Step 2 of checkout: attach the uploaded bank-transfer receipt to the payment
 * and move it to "submitted" (pending verification).
 */
export async function uploadReceipt(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const reference = String(formData.get("reference") || "").trim();
  const file = formData.get("receipt");

  if (!reference) return { ok: false, message: "Missing payment reference." };
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Please choose your receipt file." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, message: "File too large (max 10MB)." };
  }
  const allowed = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
  if (!allowed.includes(file.type)) {
    return { ok: false, message: "Upload a PNG, JPG, WEBP or PDF." };
  }

  const supabase = createAdminClient();

  try {
    const { data: payment, error: payErr } = await supabase
      .from("payments")
      .select("id, status, email, customer_name, amount, currency, reference, course_id")
      .eq("reference", reference)
      .single();
    if (payErr || !payment) {
      return { ok: false, message: "Payment reference not found." };
    }

    const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
    const path = `${new Date().getFullYear()}/${reference}-${Date.now()}.${ext}`;
    const bytes = new Uint8Array(await file.arrayBuffer());

    const { error: upErr } = await supabase.storage
      .from("receipts")
      .upload(path, bytes, { contentType: file.type, upsert: true });
    if (upErr) throw upErr;

    const { data: signed } = await supabase.storage
      .from("receipts")
      .createSignedUrl(path, SIGNED_URL_TTL);

    await supabase.from("payment_receipts").insert({
      payment_id: payment.id,
      file_path: path,
      file_url: signed?.signedUrl ?? "",
    });

    await supabase
      .from("payments")
      .update({ status: "submitted", receipt_url: signed?.signedUrl ?? null })
      .eq("id", payment.id);

    await supabase.from("activity_logs").insert({
      action: "payment.receipt_uploaded",
      entity: "payments",
      entity_id: payment.id,
      meta: { reference },
    });

    return {
      ok: true,
      message: "Receipt uploaded. Your payment is now pending verification.",
    };
  } catch (err) {
    console.error("uploadReceipt failed:", err);
    return { ok: false, message: "Upload failed. Please try again." };
  }
}
