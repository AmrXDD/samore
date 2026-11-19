import { NextResponse } from "next/server";
import { getSessionProfile } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDataset } from "@/lib/data-transfer";
import { toCsv } from "@/lib/csv";

export const dynamic = "force-dynamic";

const PAGE = 1000;

/** GET /api/admin/export/<dataset> — downloads the dataset as CSV (admins only). */
export async function GET(_req: Request, { params }: { params: Promise<{ dataset: string }> }) {
  const { profile } = await getSessionProfile();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { dataset: key } = await params;
  const dataset = getDataset(key);
  if (!dataset) return NextResponse.json({ error: "Unknown dataset" }, { status: 404 });

  const supabase = createAdminClient();
  const columns = dataset.columns.map((c) => c.name);
  const rows: Record<string, unknown>[] = [];

  // Page through results — Supabase caps a single select at 1000 rows.
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from(dataset.table)
      .select(columns.join(","))
      .order(dataset.orderBy.column, { ascending: dataset.orderBy.ascending })
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    rows.push(...((data ?? []) as unknown as Record<string, unknown>[]));
    if (!data || data.length < PAGE) break;
  }

  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(toCsv(columns, rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="samore-${dataset.key}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
