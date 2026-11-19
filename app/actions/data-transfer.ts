"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { getDataset, type ColumnDef } from "@/lib/data-transfer";
import { parseCsvObjects } from "@/lib/csv";
import { slugify } from "@/lib/utils";
import type { ActionState } from "@/lib/action-state";

const MAX_BYTES = 5 * 1024 * 1024;
const MAX_ROWS = 5000;
const CHUNK = 500;
const MAX_REPORTED_ERRORS = 15;

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type Row = Record<string, unknown>;

/** Convert one CSV cell to the column's type. Throws a readable message on bad input. */
function coerce(col: ColumnDef, raw: string): unknown {
  // Undo the formula-injection guard added on export ('=SUM → =SUM).
  let v = raw.trim();
  if (/^'[=+\-@]/.test(v)) v = v.slice(1);

  if (v === "") {
    if (col.required) throw new Error(`"${col.name}" is required`);
    return col.default ?? null;
  }

  switch (col.type) {
    case "number": {
      const n = Number(v.replace(/,/g, ""));
      if (!Number.isFinite(n)) throw new Error(`"${col.name}" must be a number (got "${v}")`);
      return n;
    }
    case "int": {
      const n = Number(v);
      if (!Number.isInteger(n)) throw new Error(`"${col.name}" must be a whole number (got "${v}")`);
      return n;
    }
    case "bool": {
      const s = v.toLowerCase();
      if (["true", "yes", "y", "1"].includes(s)) return true;
      if (["false", "no", "n", "0"].includes(s)) return false;
      throw new Error(`"${col.name}" must be true/false (got "${v}")`);
    }
    case "uuid":
      if (!UUID_RE.test(v)) throw new Error(`"${col.name}" is not a valid id (got "${v}")`);
      return v.toLowerCase();
    case "enum": {
      const s = v.toLowerCase();
      if (!col.values?.includes(s)) {
        throw new Error(`"${col.name}" must be one of ${col.values?.join(", ")} (got "${v}")`);
      }
      return s;
    }
    default:
      return v;
  }
}

/**
 * Import a CSV into a dataset. Rows are matched by `id`, then by the
 * dataset's natural key (slug / email); unmatched rows are created.
 * Only columns present in the file are written, so a CSV with just
 * `id,price` updates prices and leaves everything else untouched.
 * The whole file is validated before anything is written.
 */
export async function importCsv(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const admin = await requireAdmin();

  const dataset = getDataset(String(formData.get("dataset") ?? ""));
  if (!dataset || !dataset.importable) {
    return { ok: false, message: "This dataset can't be imported." };
  }

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, message: "Choose a CSV file to import." };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, message: "File is too large (max 5 MB)." };
  }

  const { headers, records } = parseCsvObjects(await file.text());
  if (!records.length) return { ok: false, message: "The file has no data rows." };
  if (records.length > MAX_ROWS) {
    return { ok: false, message: `Too many rows (${records.length}). Max is ${MAX_ROWS} per import.` };
  }

  const known = new Set(dataset.columns.map((c) => c.name));
  const writable = dataset.columns.filter((c) => !c.readOnly && headers.includes(c.name));
  const unknown = headers.filter((h) => h && !known.has(h));
  if (!writable.some((c) => c.name !== "id")) {
    return {
      ok: false,
      message: `No recognised columns. Expected some of: ${dataset.columns
        .filter((c) => !c.readOnly)
        .map((c) => c.name)
        .join(", ")}`,
    };
  }

  const matchOn = dataset.matchOn;
  const autoSlug = matchOn === "slug" && !dataset.columns.find((c) => c.name === "slug")?.required;
  const errors: string[] = [];
  const byId: Row[] = [];
  const byKey: Row[] = [];
  const fresh: Row[] = [];
  const seen = new Set<string>();

  records.forEach((rec, i) => {
    const line = i + 2; // +1 header, +1 for 1-based
    const row: Row = {};
    try {
      for (const col of writable) row[col.name] = coerce(col, rec[col.name] ?? "");
    } catch (e) {
      errors.push(`Row ${line}: ${(e as Error).message}`);
      return;
    }

    const isNew = !row.id;
    if (isNew) delete row.id;

    // Columns required for creating a row must be in the file.
    if (isNew && !(matchOn && row[matchOn])) {
      const missing = dataset.columns.filter(
        (c) => c.required && !headers.includes(c.name) && !(autoSlug && c.name === "slug"),
      );
      if (missing.length) {
        errors.push(`Row ${line}: new rows need ${missing.map((c) => `"${c.name}"`).join(", ")}`);
        return;
      }
    }

    if (autoSlug && !row.slug) {
      const source = String(row.title ?? row.name ?? "");
      if (isNew || source) {
        const s = slugify(source);
        if (!s) {
          errors.push(`Row ${line}: can't build a slug from "${source}" — add a slug column`);
          return;
        }
        row.slug = s;
      } else delete row.slug;
    }
    if (matchOn === "email" && typeof row.email === "string") row.email = row.email.toLowerCase();

    const dedupeKey = row.id ? `id:${row.id}` : matchOn && row[matchOn] ? `${matchOn}:${row[matchOn]}` : null;
    if (dedupeKey) {
      if (seen.has(dedupeKey)) {
        errors.push(`Row ${line}: duplicate ${dedupeKey.replace(":", " ")} in file`);
        return;
      }
      seen.add(dedupeKey);
    }

    if (row.id) byId.push(row);
    else if (matchOn && row[matchOn]) byKey.push(row);
    else fresh.push(row);
  });

  if (errors.length) {
    const shown = errors.slice(0, MAX_REPORTED_ERRORS);
    const more = errors.length - shown.length;
    return {
      ok: false,
      message: `Nothing was imported — fix these and try again:\n${shown.join("\n")}${
        more > 0 ? `\n…and ${more} more` : ""
      }`,
    };
  }

  const supabase = createAdminClient();
  let written = 0;

  async function run(rows: Row[], op: (chunk: Row[]) => PromiseLike<{ error: { message: string } | null }>) {
    for (let i = 0; i < rows.length; i += CHUNK) {
      const chunk = rows.slice(i, i + CHUNK);
      const { error } = await op(chunk);
      if (error) throw new Error(error.message);
      written += chunk.length;
    }
  }

  try {
    await run(byId, (c) => supabase.from(dataset.table).upsert(c, { onConflict: "id" }));
    if (matchOn) {
      await run(byKey, (c) => supabase.from(dataset.table).upsert(c, { onConflict: matchOn }));
    }
    await run(fresh, (c) => supabase.from(dataset.table).insert(c));
  } catch (e) {
    return {
      ok: false,
      message: `Import stopped after ${written} row(s): ${(e as Error).message}`,
    };
  } finally {
    if (written > 0) {
      await supabase.from("activity_logs").insert({
        actor: admin.email,
        action: "csv_import",
        entity: dataset.table,
        meta: { rows: written, file: file.name },
      });
      revalidatePath("/", "layout");
    }
  }

  const note = unknown.length ? ` Ignored unknown column(s): ${unknown.join(", ")}.` : "";
  return {
    ok: true,
    message: `Imported ${written} ${dataset.label.toLowerCase()} row(s).${note}`,
    data: { rows: written },
  };
}
