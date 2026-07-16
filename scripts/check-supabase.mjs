#!/usr/bin/env node
/**
 * SAMORE — setup checker.
 *
 *   npm run check
 *
 * Verifies, in order: .env.local exists → variables are filled → Supabase is
 * reachable → schema.sql was applied → seed-data.sql was applied (courses +
 * bank details) → storage buckets exist → an admin user exists.
 * Prints exactly what is missing and how to fix it.
 */

import { readFileSync, existsSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

const G = "\x1b[32m", R = "\x1b[31m", Y = "\x1b[33m", D = "\x1b[2m", B = "\x1b[1m", X = "\x1b[0m";
const ok = (m) => console.log(`${G}  PASS${X}  ${m}`);
const bad = (m, fix) => {
  console.log(`${R}  FAIL${X}  ${m}`);
  if (fix) console.log(`${Y}        → ${fix}${X}`);
};
const warn = (m, fix) => {
  console.log(`${Y}  WARN${X}  ${m}`);
  if (fix) console.log(`${D}        → ${fix}${X}`);
};

console.log(`\n${B}SAMORE — setup check${X}\n${D}${"─".repeat(52)}${X}`);

/* 1. .env.local ------------------------------------------------------- */
if (!existsSync(".env.local")) {
  bad(".env.local not found", "Copy .env.example to .env.local, then fill in your Supabase values.");
  process.exit(1);
}
ok(".env.local found");

const env = {};
for (const line of readFileSync(".env.local", "utf8").split("\n")) {
  const t = line.trim();
  if (!t || t.startsWith("#")) continue;
  const i = t.indexOf("=");
  if (i > 0) env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
}

/* 2. Variables -------------------------------------------------------- */
const required = [
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
];
const missing = required.filter((k) => !env[k]);
if (missing.length) {
  bad(`Empty variable(s): ${missing.join(", ")}`,
      "Supabase dashboard → your project → Settings → API. Paste the values into .env.local.");
  console.log(`\n${R}Stopping — the site cannot reach the database without these.${X}\n`);
  process.exit(1);
}
ok("All 4 required variables are set");

if (!/^https:\/\/.+\.supabase\.co/.test(env.NEXT_PUBLIC_SUPABASE_URL)) {
  warn(`NEXT_PUBLIC_SUPABASE_URL looks unusual: ${env.NEXT_PUBLIC_SUPABASE_URL}`,
       'It should look like https://abcdefgh.supabase.co');
}

/* 3. Connection ------------------------------------------------------- */
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

let failures = 0;

const { error: connErr } = await supabase.from("services").select("slug").limit(1);
if (connErr) {
  if (/relation .* does not exist|schema cache/i.test(connErr.message)) {
    bad("Connected, but the tables do not exist",
        "Run sql/schema.sql in the Supabase SQL editor.");
    failures++;
  } else {
    bad(`Cannot reach Supabase: ${connErr.message}`,
        "Check NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are from the SAME project.");
    console.log("");
    process.exit(1);
  }
} else {
  ok("Connected to Supabase and schema.sql is applied");
}

/* 4. Courses ---------------------------------------------------------- */
const { data: courses, error: cErr } = await supabase
  .from("courses")
  .select("id, code, visibility");

if (cErr) {
  bad(`Cannot read courses: ${cErr.message}`, "Run sql/schema.sql.");
  failures++;
} else {
  const published = courses.filter((c) => c.visibility === "published");
  if (courses.length === 0) {
    bad("0 courses in the database — /courses will show 'No courses available.'",
        "Run sql/seed-data.sql in the Supabase SQL editor (adds all 22 courses).");
    failures++;
  } else if (published.length === 0) {
    bad(`${courses.length} courses exist but NONE are published`,
        "Run sql/seed-data.sql, or publish them in Admin → Courses.");
    failures++;
  } else {
    ok(`${published.length} published course(s) — /courses will list them`);
    if (published.length !== 22) {
      warn(`Expected 22 courses from the catalogue, found ${published.length}`,
           "Re-run sql/seed-data.sql to load the full catalogue.");
    }
  }
}

/* 5. payment_items (cart support) ------------------------------------- */
const { error: piErr } = await supabase.from("payment_items").select("id").limit(1);
if (piErr) {
  bad("payment_items table missing — checkout will fail",
      "Run sql/seed-data.sql (it creates this table).");
  failures++;
} else {
  ok("payment_items table present (cart checkout ready)");
}

/* 6. Bank details ----------------------------------------------------- */
const { data: bank } = await supabase.from("bank_settings").select("*").limit(1).maybeSingle();
if (!bank || !bank.iban) {
  bad("Bank transfer details are not set — checkout cannot show payment info",
      "Run sql/seed-data.sql, or set them in Admin → Settings → Bank Details.");
  failures++;
} else {
  ok(`Bank details set (${bank.bank_name ?? "?"} · ${bank.currency})`);
}

/* 7. Storage buckets -------------------------------------------------- */
const { data: buckets, error: bErr } = await supabase.storage.listBuckets();
if (bErr) {
  bad(`Cannot list storage buckets: ${bErr.message}`, "Run sql/schema.sql.");
  failures++;
} else {
  const names = buckets.map((b) => b.name);
  for (const need of ["loi", "receipts"]) {
    if (names.includes(need)) ok(`Storage bucket "${need}" exists`);
    else {
      bad(`Storage bucket "${need}" missing — ${need === "loi" ? "LOI generation" : "receipt upload"} will fail`,
          "Run sql/schema.sql, or create the bucket (private) in Supabase → Storage.");
      failures++;
    }
  }
}

/* 8. Admin user ------------------------------------------------------- */
const { data: admins } = await supabase.from("profiles").select("email, role").eq("role", "admin");
if (!admins || admins.length === 0) {
  bad("No admin user — you cannot log in at /login",
      "Run sql/schema.sql then sql/set-admin-credentials.sql.");
  failures++;
} else {
  ok(`Admin login ready: ${admins.map((a) => a.email).join(", ")}`);
}

/* Summary ------------------------------------------------------------- */
console.log(`${D}${"─".repeat(52)}${X}`);
if (failures === 0) {
  console.log(`${G}${B}Everything is configured. Run: npm run build && npm run start${X}\n`);
} else {
  console.log(`${R}${B}${failures} problem(s) found — fix the arrows above, then re-run: npm run check${X}\n`);
  process.exit(1);
}
