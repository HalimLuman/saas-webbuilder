/**
 * Applies supabase/schema.sql to your Supabase project.
 * Run: node scripts/apply-schema.cjs
 */
const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

// Parse .env.local
const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8");
const env = Object.fromEntries(
  envFile
    .split("\n")
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const idx = l.indexOf("=");
      return [l.slice(0, idx).trim(), l.slice(idx + 1).trim()];
    })
);

const projectUrl = env["NEXT_PUBLIC_SUPABASE_URL"];
const serviceRoleKey = env["SUPABASE_SERVICE_ROLE_KEY"];

if (!projectUrl || !serviceRoleKey) {
  console.error("Missing env vars");
  process.exit(1);
}

const projectRef = projectUrl.replace("https://", "").split(".")[0];

// Supabase connection pooler — service role JWT as password
const connectionString = `postgresql://postgres.${projectRef}:${serviceRoleKey}@aws-0-eu-central-1.pooler.supabase.com:6543/postgres`;

async function main() {
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log(`Connecting to Supabase project: ${projectRef}...`);
    await client.connect();
    console.log("Connected!\n");

    const sql = fs.readFileSync(path.join(__dirname, "../supabase/schema.sql"), "utf8");

    // Run the whole schema as a single transaction
    await client.query("BEGIN");

    try {
      await client.query(sql);
      await client.query("COMMIT");
      console.log("✓ Schema applied successfully!");
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    }
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
