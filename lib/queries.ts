import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import type {
  BankSettings,
  Course,
  CourseCategory,
  ContactMessage,
  DashboardStats,
  HeroContent,
  Loi,
  Payment,
  ActivityLog,
  SteelPrice,
  OilPrice,
} from "@/types";

/** True when the Supabase server credentials are present. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

/** Returns an admin client, or null if Supabase env is not configured. */
function safeClient() {
  try {
    return createAdminClient();
  } catch {
    console.warn(
      "[SAMORE] Supabase is not configured — set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in .env.local, then run `npm run check`. " +
        "Courses, checkout and LOI are disabled until then.",
    );
    return null;
  }
}

export async function getHero(): Promise<HeroContent | null> {
  const supabase = safeClient();
  if (!supabase) return null;
  const { data } = await supabase.from("hero").select("*").limit(1).maybeSingle();
  return (data as HeroContent) ?? null;
}

export async function getBankSettings(): Promise<BankSettings | null> {
  const supabase = safeClient();
  if (!supabase) return null;
  const { data } = await supabase.from("bank_settings").select("*").limit(1).maybeSingle();
  return (data as BankSettings) ?? null;
}

export async function getCompanySetting(): Promise<Record<string, unknown> | null> {
  const supabase = safeClient();
  if (!supabase) return null;
  const { data } = await supabase.from("settings").select("value").eq("key", "company").maybeSingle();
  return (data?.value as Record<string, unknown>) ?? null;
}

export async function getPublishedCourses(): Promise<Course[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("courses")
    .select("*, category:course_categories(*)")
    .eq("visibility", "published")
    .order("created_at", { ascending: false });
  return (data as Course[]) ?? [];
}

export async function getCourseBySlug(slug: string): Promise<Course | null> {
  const supabase = safeClient();
  if (!supabase) return null;
  const { data } = await supabase
    .from("courses")
    .select("*, category:course_categories(*)")
    .eq("slug", slug)
    .eq("visibility", "published")
    .maybeSingle();
  return (data as Course) ?? null;
}

export async function getCategories(): Promise<CourseCategory[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("course_categories")
    .select("*")
    .order("name");
  return (data as CourseCategory[]) ?? [];
}

/* ───────────────── Trade prices (Steel / Oil) ───────────────── */

export async function getSteelPrices(activeOnly = true): Promise<SteelPrice[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  let q = supabase.from("steel_prices").select("*");
  if (activeOnly) q = q.eq("is_active", true);
  const { data } = await q
    .order("table_group", { ascending: true })
    .order("sort_order", { ascending: true });
  return (data as SteelPrice[]) ?? [];
}

export async function getOilPrices(activeOnly = true): Promise<OilPrice[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  let q = supabase.from("oil_prices").select("*");
  if (activeOnly) q = q.eq("is_active", true);
  const { data } = await q.order("sort_order", { ascending: true });
  return (data as OilPrice[]) ?? [];
}

/* ───────────────── Admin dashboard queries ───────────────── */

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = safeClient();
  const empty: DashboardStats = {
    total_sales: 0,
    total_courses: 0,
    total_emails: 0,
    total_loi: 0,
    pending_payments: 0,
    approved_payments: 0,
    total_customers: 0,
    total_messages: 0,
  };
  if (!supabase) return empty;

  const { data } = await supabase.rpc("dashboard_stats");
  if (data) return data as DashboardStats;
  return empty;
}

export async function getRecentPayments(limit = 8): Promise<Payment[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("payments")
    .select("*, course:courses(title), items:payment_items(*)")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as Payment[]) ?? [];
}

export async function getAllPayments(): Promise<Payment[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("payments")
    .select("*, course:courses(title), items:payment_items(*)")
    .order("created_at", { ascending: false });
  return (data as Payment[]) ?? [];
}

export async function getAllCourses(): Promise<Course[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("courses")
    .select("*, category:course_categories(*)")
    .order("created_at", { ascending: false });
  return (data as Course[]) ?? [];
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as ContactMessage[]) ?? [];
}

export async function getNewsletter(): Promise<{ id: string; email: string; created_at: string }[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("newsletter")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as { id: string; email: string; created_at: string }[]) ?? [];
}

export async function getLois(): Promise<Loi[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase.from("loi").select("*").order("created_at", { ascending: false });
  return (data as Loi[]) ?? [];
}

export async function getUsers() {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  return (data as import("@/types").Profile[]) ?? [];
}

export async function getActivity(limit = 12): Promise<ActivityLog[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase
    .from("activity_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);
  return (data as ActivityLog[]) ?? [];
}

export async function getMonthlyRevenue(): Promise<{ month: string; revenue: number; orders: number }[]> {
  const supabase = safeClient();
  if (!supabase) return [];
  const { data } = await supabase.rpc("monthly_revenue");
  return (data as { month: string; revenue: number; orders: number }[]) ?? [];
}
