"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { newsletterSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { type ActionState, formToObject, validate } from "@/lib/action-state";

export async function subscribeNewsletter(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const values = formToObject(formData);

  if (values.website) {
    return { ok: true, message: "Subscribed." };
  }

  const limit = await rateLimit("newsletter", { max: 5, windowMs: 60_000 });
  if (!limit.allowed) {
    return { ok: false, message: "Too many attempts. Please try again shortly." };
  }

  const result = validate(newsletterSchema, values);
  if (!result.success) {
    return { ok: false, message: "Enter a valid email.", errors: result.errors };
  }

  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from("newsletter")
      .upsert({ email: result.data.email.toLowerCase() }, { onConflict: "email" });
    if (error) throw error;

    return { ok: true, message: "You're subscribed. Thank you." };
  } catch (err) {
    console.error("subscribeNewsletter failed:", err);
    return { ok: false, message: "Subscription failed. Please try again." };
  }
}
