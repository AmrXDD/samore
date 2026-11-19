/**
 * Minimal RFC 4180 CSV utilities (no dependencies).
 * - Fields containing commas, quotes or newlines are quoted on output.
 * - Values that would be interpreted as formulas by Excel/Sheets
 *   (=, +, -, @ followed by non-numeric text) are prefixed with a quote
 *   to prevent CSV/formula injection when an admin opens an export.
 */

function escapeField(value: unknown): string {
  if (value === null || value === undefined) return "";
  let s =
    typeof value === "object" ? JSON.stringify(value) : String(value);
  if (/^[=+\-@\t\r]/.test(s) && !/^[-+]?\d+(\.\d+)?$/.test(s)) s = `'${s}`;
  if (/[",\r\n]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(columns: string[], rows: Record<string, unknown>[]): string {
  const lines = [columns.map(escapeField).join(",")];
  for (const row of rows) lines.push(columns.map((c) => escapeField(row[c])).join(","));
  // BOM so Excel opens UTF-8 (Arabic, accents) correctly.
  return "﻿" + lines.join("\r\n") + "\r\n";
}

/** Parse CSV text into an array of rows (array of strings). */
export function parseCsv(text: string): string[][] {
  const src = text.replace(/^﻿/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inQuotes) {
      if (ch === '"') {
        if (src[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
      continue;
    }
    if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && src[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field !== "" || row.length) {
    row.push(field);
    rows.push(row);
  }
  // Drop fully blank lines.
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** Parse CSV into objects keyed by (trimmed, lower-cased) header names. */
export function parseCsvObjects(text: string): {
  headers: string[];
  records: Record<string, string>[];
} {
  const rows = parseCsv(text);
  if (!rows.length) return { headers: [], records: [] };
  const headers = rows[0].map((h) => h.trim().toLowerCase());
  const records = rows.slice(1).map((r) => {
    const obj: Record<string, string> = {};
    headers.forEach((h, i) => {
      if (h) obj[h] = r[i] ?? "";
    });
    return obj;
  });
  return { headers, records };
}
