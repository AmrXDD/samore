"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { contactSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { sendEmail, EMAIL_INTERNAL_TO } from "@/lib/email/send";
import ContactNotification from "@/emails/contact-notification";
import {
  type ActionState,
  formToObject,
  validate,
} from "@/lib/action-state";

export async function submitContact(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formToObject(formData);

  // Honeypot: bots fill hidden "website" field.
  if (values.website) {
    return { ok: true, message: "Thank you. Your message has been received." };
  }

  const limit = await rateLimit("contact", { max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return {
      ok: false,
      message: "Too many submissions. Please try again in a minute.",
    };
  }

  const result = validate(contactSchema, values);
  if (!result.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: result.errors };
  }

  const input = result.data;

  try {
    const supabase = createAdminClient();
    const { error } = await supabase.from("contact_messages").insert({
      name: input.name,
      company: input.company || null,
      phone: input.phone || null,
      email: input.email,
      message: input.message,
      inquiry_type: input.inquiryType,
      status: "new",
    });
    if (error) throw error;

    await supabase.from("activity_logs").insert({
      action: "contact.created",
      entity: "contact_messages",
      meta: { email: input.email, inquiry_type: input.inquiryType },
    });

    await sendEmail({
      to: EMAIL_INTERNAL_TO,
      subject: `New inquiry — ${input.inquiryType} — ${input.name}`,
      replyTo: input.email,
      react: ContactNotification({
        name: input.name,
        email: input.email,
        company: input.company || null,
        phone: input.phone || null,
        inquiryType: input.inquiryType,
        message: input.message,
      }),
    });

    return {
      ok: true,
      message: "Thank you. Your message has been received — we will be in touch shortly.",
    };
  } catch (err) {
    console.error("submitContact failed:", err);
    return {
      ok: false,
      message: "Something went wrong. Please email us directly at SAMORE2021@gmail.com.",
    };
  }
}
