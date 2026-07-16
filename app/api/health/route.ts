import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Deployment diagnostics: reports what the RUNNING app is actually connected
 * to. Safe to expose — it never returns keys or personal data, only whether
 * each variable is present and whether the database has the expected rows.
 *
 * Visit:  https://your-domain.com/api/health
 */
export const dynamic = "force-dynamic";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

  // The project ref is public (it lives in the URL) — safe to show.
  const ref = url.match(/https:\/\/([a-z0-9]+)\.supabase\.co/)?.[1] ?? null;

  const report: Record<string, unknown> = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "(not set)",
    supabaseProjectRef: ref ?? "(not set / malformed)",
    vars: {
      NEXT_PUBLIC_SUPABASE_URL: url ? "set" : "MISSING",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: anon ? `set (${anon.length} chars)` : "MISSING",
      SUPABASE_SERVICE_ROLE_KEY: service ? `set (${service.length} chars)` : "MISSING",
    },
    // Whitespace pasted into Vercel silently invalidates a key.
    whitespaceProblem:
      url !== url.trim() || anon !== anon.trim() || service !== service.trim()
        ? "YES — a variable has leading/trailing whitespace. Re-paste it in Vercel."
        : "no",
  };

  if (!url || !anon || !service) {
    report.verdict =
      "MISSING VARIABLES — add them in Vercel → Settings → Environment Variables, then REDEPLOY.";
    return NextResponse.json(report, { status: 200 });
  }

  // Does the anon key actually belong to this project?
  try {
    const anonClient = createClient(url.trim(), anon.trim());
    const { error } = await anonClient.auth.getSession();
    report.anonKeyValid = error ? `NO — ${error.message}` : "yes";
  } catch (e) {
    report.anonKeyValid = `NO — ${e instanceof Error ? e.message : "unknown"}`;
  }

  // Does the service key work, and is the data seeded?
  try {
    const admin = createClient(url.trim(), service.trim(), {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { count: courseCount, error: cErr } = await admin
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("visibility", "published");

    const { data: admins, error: aErr } = await admin
      .from("profiles")
      .select("id")
      .eq("role", "admin");

    if (cErr || aErr) {
      report.database = `ERROR — ${(cErr ?? aErr)?.message}`;
      report.verdict =
        "Connected, but the schema is missing. Run sql/schema.sql + sql/seed-data.sql in THIS project.";
    } else {
      report.publishedCourses = courseCount ?? 0;
      report.adminUsers = admins?.length ?? 0;
      report.verdict =
        (admins?.length ?? 0) === 0
          ? `Connected to project "${ref}" — but it has NO admin user. You fixed a DIFFERENT project. Run promote-admin.sql in project "${ref}".`
          : (courseCount ?? 0) === 0
            ? `Connected to project "${ref}" with ${admins?.length} admin(s), but 0 published courses. Run sql/seed-data.sql in project "${ref}".`
            : `OK — connected to project "${ref}" with ${courseCount} courses and ${admins?.length} admin(s). Login should work.`;
    }
  } catch (e) {
    report.database = `ERROR — ${e instanceof Error ? e.message : "unknown"}`;
  }

  return NextResponse.json(report, { status: 200 });
}
