"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { loginSchema, changePasswordSchema } from "@/lib/validations";
import { rateLimit } from "@/lib/rate-limit";
import { type ActionState, formToObject, validate } from "@/lib/action-state";

export async function login(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const limit = await rateLimit("login", { max: 8, windowMs: 60_000 });
  if (!limit.allowed) {
    return { ok: false, message: "Too many attempts. Please wait a minute." };
  }

  const result = validate(loginSchema, formToObject(formData));
  if (!result.success) {
    return { ok: false, message: "Enter your email and password.", errors: result.errors };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error || !data.user) {
    return { ok: false, message: "Invalid email or password." };
  }

  // Only admins may access the panel.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    await supabase.auth.signOut();
    return { ok: false, message: "This account is not authorized." };
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function changePassword(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const result = validate(changePasswordSchema, formToObject(formData));
  if (!result.success) {
    return { ok: false, message: "Please fix the highlighted fields.", errors: result.errors };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Your session has expired. Please sign in again." };

  const { error } = await supabase.auth.updateUser({ password: result.data.password });
  if (error) return { ok: false, message: error.message };

  // Clear the forced-change flag via service role (RLS-safe).
  const admin = createAdminClient();
  await admin
    .from("profiles")
    .update({ must_change_password: false })
    .eq("id", user.id);

  await admin.from("activity_logs").insert({
    actor: user.email,
    action: "auth.password_changed",
    entity: "profiles",
    entity_id: user.id,
  });

  revalidatePath("/admin", "layout");
  return { ok: true, message: "Password updated." };
}
