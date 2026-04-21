/**
 * Applies supabase/schema.sql to your Supabase project via the REST API.
 * Run: node scripts/apply-schema.mjs
 */
import { readFileSync } from "fs";
import { createClient } from "@supabase/supabase-js";

const envFile = readFileSync(".env.local", "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const supabaseUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const projectRef = supabaseUrl.replace("https://", "").split(".")[0];
const sql = readFileSync("supabase/schema.sql", "utf8");

// Split into individual statements (split on semicolon + newline combos)
// We send them individually so we can track which fail
const statements = sql
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

console.log(`Applying ${statements.length} SQL statements to project: ${projectRef}\n`);

let succeeded = 0;
let failed = 0;

for (const stmt of statements) {
  // Use Supabase REST pg endpoint
  const res = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
    body: JSON.stringify({ query: stmt + ";" }),
  });

  if (!res.ok) {
    // Try the pg query endpoint instead
    const res2 = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
      },
      body: JSON.stringify({ query: stmt + ";" }),
    });

    if (!res2.ok) {
      const err = await res2.text().catch(() => "unknown error");
      console.warn(`⚠ SKIP: ${stmt.slice(0, 80).replace(/\n/g, " ")}...`);
      console.warn(`  Error: ${err.slice(0, 120)}\n`);
      failed++;
    } else {
      console.log(`✓ ${stmt.slice(0, 80).replace(/\n/g, " ")}...`);
      succeeded++;
    }
  } else {
    console.log(`✓ ${stmt.slice(0, 80).replace(/\n/g, " ")}...`);
    succeeded++;
  }
}

console.log(`\nDone: ${succeeded} succeeded, ${failed} skipped/failed`);
console.log("Note: Some statements may be skipped if objects already exist (IF NOT EXISTS).");
