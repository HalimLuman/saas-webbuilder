/**
 * sql-generator.ts
 *
 * Pure functions: SiteSchema → SQL strings ready to paste into Supabase (or any
 * Postgres-compatible database).
 *
 * Generates:
 *  • CREATE TABLE statements with columns, PKs, NOT NULL, UNIQUE, DEFAULT, FK refs
 *  • Optional created_at / updated_at auto-columns
 *  • ALTER TABLE ENABLE ROW LEVEL SECURITY
 *  • CREATE POLICY statements for common access patterns
 */

import type { SchemaTable, SchemaColumn, SchemaColumnType, SchemaRLSPolicy, SiteSchema } from "./types";

// ─── Column type → Postgres type ─────────────────────────────────────────────

function pgType(col: SchemaColumn): string {
  switch (col.type) {
    case "text":       return "TEXT";
    case "varchar":    return col.varcharLength ? `VARCHAR(${col.varcharLength})` : "VARCHAR(255)";
    case "integer":    return "INTEGER";
    case "bigint":     return "BIGINT";
    case "numeric":    return "NUMERIC";
    case "boolean":    return "BOOLEAN";
    case "date":       return "DATE";
    case "timestamptz":return "TIMESTAMPTZ";
    case "uuid":       return "UUID";
    case "jsonb":      return "JSONB";
    default:           return "TEXT";
  }
}

// ─── Single column definition line ───────────────────────────────────────────

function columnDef(col: SchemaColumn): string {
  const parts: string[] = [`  "${col.name}"`, pgType(col)];

  if (col.isPrimary) {
    // UUID PKs get a default gen_random_uuid()
    if (col.type === "uuid") {
      parts.push("DEFAULT gen_random_uuid()");
    } else if (col.type === "bigint" || col.type === "integer") {
      // Use GENERATED ALWAYS for serial-like behaviour
      return `  "${col.name}" ${pgType(col)} GENERATED ALWAYS AS IDENTITY PRIMARY KEY`;
    }
    parts.push("PRIMARY KEY");
  }

  if (!col.isPrimary) {
    if (col.isNotNull) parts.push("NOT NULL");
    if (col.isUnique)  parts.push("UNIQUE");
    if (col.defaultValue !== undefined && col.defaultValue !== "") {
      parts.push(`DEFAULT ${col.defaultValue}`);
    }
  }

  return parts.join(" ");
}

// ─── Foreign key constraints ──────────────────────────────────────────────────

function foreignKeyConstraints(table: SchemaTable): string[] {
  return table.columns
    .filter(col => col.references)
    .map(col => {
      const [refTable, refCol] = (col.references as string).split(".");
      return `  CONSTRAINT "fk_${table.name}_${col.name}" FOREIGN KEY ("${col.name}") REFERENCES "${refTable}"("${refCol ?? "id"}")`;
    });
}

// ─── Timestamp columns ────────────────────────────────────────────────────────

const TIMESTAMP_COLS = [
  `  "created_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL`,
  `  "updated_at" TIMESTAMPTZ DEFAULT NOW() NOT NULL`,
];

// ─── RLS policies ────────────────────────────────────────────────────────────

function rlsPolicies(table: SchemaTable): string[] {
  const t = `"${table.name}"`;
  const policy = table.rlsPolicy ?? "none";
  const lines: string[] = [];

  if (!table.enableRls || policy === "none") return lines;

  lines.push(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`);
  lines.push("");

  switch (policy as SchemaRLSPolicy) {
    case "public_read":
      lines.push(`CREATE POLICY "Allow public read on ${table.name}"`);
      lines.push(`  ON ${t} FOR SELECT USING (true);`);
      lines.push("");
      lines.push(`CREATE POLICY "Allow authenticated insert on ${table.name}"`);
      lines.push(`  ON ${t} FOR INSERT WITH CHECK (auth.role() = 'authenticated');`);
      break;

    case "public_all":
      lines.push(`CREATE POLICY "Allow all on ${table.name}"`);
      lines.push(`  ON ${t} USING (true) WITH CHECK (true);`);
      break;

    case "authenticated_read":
      lines.push(`CREATE POLICY "Allow authenticated read on ${table.name}"`);
      lines.push(`  ON ${t} FOR SELECT USING (auth.role() = 'authenticated');`);
      break;

    case "authenticated_all":
      lines.push(`CREATE POLICY "Allow authenticated all on ${table.name}"`);
      lines.push(`  ON ${t} USING (auth.role() = 'authenticated') WITH CHECK (auth.role() = 'authenticated');`);
      break;

    case "owner_only": {
      // Assumes the table has a "user_id" column that references auth.users
      const ownerCol = table.columns.find(c => c.name === "user_id") ? "user_id" : "owner_id";
      lines.push(`-- Requires a "${ownerCol}" column of type UUID referencing auth.users(id)`);
      lines.push(`CREATE POLICY "Allow owner read on ${table.name}"`);
      lines.push(`  ON ${t} FOR SELECT USING (auth.uid() = "${ownerCol}");`);
      lines.push("");
      lines.push(`CREATE POLICY "Allow owner insert on ${table.name}"`);
      lines.push(`  ON ${t} FOR INSERT WITH CHECK (auth.uid() = "${ownerCol}");`);
      lines.push("");
      lines.push(`CREATE POLICY "Allow owner update on ${table.name}"`);
      lines.push(`  ON ${t} FOR UPDATE USING (auth.uid() = "${ownerCol}");`);
      lines.push("");
      lines.push(`CREATE POLICY "Allow owner delete on ${table.name}"`);
      lines.push(`  ON ${t} FOR DELETE USING (auth.uid() = "${ownerCol}");`);
      break;
    }
  }

  return lines;
}

// ─── Single table SQL ─────────────────────────────────────────────────────────

export function generateTableSQL(table: SchemaTable): string {
  const colDefs = table.columns.map(columnDef);
  const fkConstraints = foreignKeyConstraints(table);

  if (table.addTimestamps) {
    colDefs.push(...TIMESTAMP_COLS);
  }

  const allDefs = [...colDefs, ...fkConstraints];
  const body = allDefs.join(",\n");

  const createTable = [
    `CREATE TABLE IF NOT EXISTS "${table.name}" (`,
    body,
    `);`,
  ].join("\n");

  const policies = rlsPolicies(table);

  // updated_at trigger (only when addTimestamps is true)
  const triggerSQL = table.addTimestamps ? [
    ``,
    `-- Auto-update "updated_at" on row change`,
    `CREATE OR REPLACE FUNCTION update_updated_at_column()`,
    `RETURNS TRIGGER AS $$`,
    `BEGIN`,
    `  NEW.updated_at = NOW();`,
    `  RETURN NEW;`,
    `END;`,
    `$$ language 'plpgsql';`,
    ``,
    `CREATE TRIGGER "trg_${table.name}_updated_at"`,
    `  BEFORE UPDATE ON "${table.name}"`,
    `  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();`,
  ] : [];

  return [
    createTable,
    ...(policies.length ? ["", ...policies] : []),
    ...triggerSQL,
  ].join("\n");
}

// ─── Full schema SQL ──────────────────────────────────────────────────────────

export function generateSchemaSQL(schema: SiteSchema): string {
  if (!schema.tables.length) return "-- No tables defined yet.";

  const sections = schema.tables.map((table) => {
    const header = `-- ─── Table: ${table.name} ${"─".repeat(Math.max(0, 50 - table.name.length))}`;
    return [header, "", generateTableSQL(table)].join("\n");
  });

  return [
    "-- Generated by Webperia Schema Designer",
    "-- Paste this SQL into the Supabase SQL Editor and click Run.",
    "",
    ...sections,
  ].join("\n\n");
}

// ─── Helpers for the UI ───────────────────────────────────────────────────────

export const COLUMN_TYPES: Array<{ value: SchemaColumnType; label: string; description: string }> = [
  { value: "text",        label: "Text",        description: "Unlimited text (TEXT)" },
  { value: "varchar",     label: "Varchar",     description: "Short text with optional length limit" },
  { value: "integer",     label: "Integer",     description: "Whole number (32-bit)" },
  { value: "bigint",      label: "Big Integer", description: "Large whole number (64-bit)" },
  { value: "numeric",     label: "Numeric",     description: "Precise decimal number" },
  { value: "boolean",     label: "Boolean",     description: "True / False" },
  { value: "date",        label: "Date",        description: "Calendar date (YYYY-MM-DD)" },
  { value: "timestamptz", label: "Timestamp",   description: "Date + time with timezone" },
  { value: "uuid",        label: "UUID",        description: "Universally unique identifier" },
  { value: "jsonb",       label: "JSONB",       description: "Binary JSON — fast querying" },
];

export const RLS_POLICIES: Array<{ value: SchemaRLSPolicy; label: string; description: string }> = [
  { value: "none",              label: "None",                   description: "No RLS policies generated" },
  { value: "public_read",       label: "Public read",            description: "Anyone can read; only authenticated can insert" },
  { value: "public_all",        label: "Public read + write",    description: "Anyone can read and write (open table)" },
  { value: "authenticated_read",label: "Signed-in read",         description: "Only signed-in users can read" },
  { value: "authenticated_all", label: "Signed-in read + write", description: "Only signed-in users can read and write" },
  { value: "owner_only",        label: "Owner only",             description: "Each row is owned by the user who created it (requires user_id column)" },
];
