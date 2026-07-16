import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

/** Returns the current auth user and profile, or nulls if signed out. */
export async function getSessionProfile(): Promise<{
  userId: string | null;
  profile: Profile | null;
}> {
  // Supabase not configured yet — treat as signed out (no crash).
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { userId: null, profile: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { userId: null, profile: null };

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { userId: user.id, profile: (profile as Profile) ?? null };
}

/** Guard for admin server components / actions. Redirects if not an admin. */
export async function requireAdmin(): Promise<Profile> {
  const { userId, profile } = await getSessionProfile();

  if (!userId) redirect("/login");
  if (!profile || profile.role !== "admin") redirect("/login?error=forbidden");

  return profile;
}
