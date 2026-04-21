"use client";

/**
 * SchemaPanel
 *
 * Visual SQL schema designer in the editor sidebar.
 *
 * Users can:
 *  • Create tables with any number of columns
 *  • Pick column types, toggle PK / NOT NULL / UNIQUE / timestamps
 *  • Set default values and foreign-key references
 *  • Choose an RLS policy per table
 *  • Preview the generated SQL with syntax highlighting
 *  • Copy the SQL with one click — paste it into Supabase's SQL editor
 *
 * Schema is persisted to `site.schema` in the site store and also PATCHed to
 * the Supabase `sites.schema_config` column.
 */

import React, { useState, useCallback } from "react";
import {
  Plus, Trash2, ChevronDown, ChevronRight, Copy, Check,
  Database, Table2, Columns3, RefreshCw,
} from "lucide-react";
import { useSiteStore } from "@/store/site-store";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import type { SchemaTable, SchemaColumn, SchemaColumnType, SchemaRLSPolicy, SiteSchema } from "@/lib/types";
import { generateSchemaSQL, generateTableSQL, COLUMN_TYPES, RLS_POLICIES } from "@/lib/sql-generator";

// ─── Small helpers ─────────────────────────────────────────────────────────────

function makeColumn(overrides: Partial<SchemaColumn> = {}): SchemaColumn {
  return {
    id: generateId(),
    name: "column_name",
    type: "text",
    isPrimary: false,
    isNotNull: false,
    isUnique: false,
    defaultValue: "",
    ...overrides,
  };
}

function makeTable(): SchemaTable {
  return {
    id: generateId(),
    name: "new_table",
    enableRls: true,
    rlsPolicy: "owner_only",
    addTimestamps: true,
    columns: [
      makeColumn({ name: "id", type: "uuid", isPrimary: true, isNotNull: true }),
    ],
  };
}

// ─── Compact checkbox ─────────────────────────────────────────────────────────

function Checkbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onChange}
      style={{
        display: "flex", alignItems: "center", gap: "5px",
        background: "none", border: "none", cursor: "pointer", padding: 0,
      }}
    >
      <div style={{
        width: "14px", height: "14px", borderRadius: "3px", flexShrink: 0,
        border: `2px solid ${checked ? "#6366F1" : "#D1D5DB"}`,
        backgroundColor: checked ? "#6366F1" : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {checked && <Check size={9} color="#fff" strokeWidth={3} />}
      </div>
      <span style={{ fontSize: "11px", color: "#374151" }}>{label}</span>
    </button>
  );
}

// ─── Column row ───────────────────────────────────────────────────────────────

function ColumnRow({
  col, tableNames, onChange, onRemove, canRemove,
}: {
  col: SchemaColumn;
  tableNames: string[];
  onChange: (updates: Partial<SchemaColumn>) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const [open, setOpen] = useState(false);

  const inputStyle: React.CSSProperties = {
    padding: "5px 8px", border: "1px solid #E5E7EB", borderRadius: "6px",
    fontSize: "12px", backgroundColor: "#FAFAFA", outline: "none",
  };

  return (
    <div style={{ border: "1px solid #F3F4F6", borderRadius: "8px", overflow: "hidden" }}>
      {/* Compact header row */}
      <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "6px 8px", backgroundColor: "#FAFAFA" }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#9CA3AF", flexShrink: 0 }}
        >
          {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>

        {/* Column name */}
        <input
          value={col.name}
          onChange={e => onChange({ name: e.target.value })}
          style={{ ...inputStyle, flex: 1, minWidth: 0 }}
          placeholder="column_name"
        />

        {/* Type selector */}
        <select
          value={col.type}
          onChange={e => onChange({ type: e.target.value as SchemaColumnType })}
          style={{ ...inputStyle, flexShrink: 0 }}
        >
          {COLUMN_TYPES.map(t => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        {/* PK badge */}
        {col.isPrimary && (
          <span style={{ fontSize: "9px", fontWeight: 700, color: "#6366F1", backgroundColor: "#EEF2FF", padding: "2px 5px", borderRadius: "4px", flexShrink: 0 }}>PK</span>
        )}

        {/* Remove */}
        {canRemove && (
          <button
            type="button"
            onClick={onRemove}
            style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#EF4444", flexShrink: 0 }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>

      {/* Expanded options */}
      {open && (
        <div style={{ padding: "8px 10px", borderTop: "1px solid #F3F4F6", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {!col.isPrimary && <Checkbox checked={!!col.isNotNull} onChange={() => onChange({ isNotNull: !col.isNotNull })} label="NOT NULL" />}
            {!col.isPrimary && <Checkbox checked={!!col.isUnique}  onChange={() => onChange({ isUnique:  !col.isUnique  })} label="UNIQUE" />}
            <Checkbox checked={!!col.isPrimary} onChange={() => onChange({ isPrimary: !col.isPrimary })} label="Primary Key" />
          </div>

          {col.type === "varchar" && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#6B7280" }}>Max length:</span>
              <input
                type="number"
                min={1}
                value={col.varcharLength ?? 255}
                onChange={e => onChange({ varcharLength: Number(e.target.value) })}
                style={{ ...inputStyle, width: "70px" }}
              />
            </div>
          )}

          {!col.isPrimary && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#6B7280", flexShrink: 0 }}>Default:</span>
              <input
                value={col.defaultValue ?? ""}
                onChange={e => onChange({ defaultValue: e.target.value })}
                placeholder="e.g. false, 0, 'pending', NOW()"
                style={{ ...inputStyle, flex: 1 }}
              />
            </div>
          )}

          {!col.isPrimary && tableNames.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#6B7280", flexShrink: 0 }}>References:</span>
              <select
                value={col.references ?? ""}
                onChange={e => onChange({ references: e.target.value || undefined })}
                style={{ ...inputStyle, flex: 1 }}
              >
                <option value="">— none —</option>
                {tableNames.map(t => (
                  <option key={t} value={`${t}.id`}>{t}.id</option>
                ))}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Table card ───────────────────────────────────────────────────────────────

function TableCard({
  table, allTableNames, onChange, onRemove,
}: {
  table: SchemaTable;
  allTableNames: string[];
  onChange: (t: SchemaTable) => void;
  onRemove: () => void;
}) {
  const [open, setOpen] = useState(true);
  const [sqlOpen, setSqlOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const otherTableNames = allTableNames.filter(n => n !== table.name);

  const updateColumn = (id: string, updates: Partial<SchemaColumn>) => {
    onChange({
      ...table,
      columns: table.columns.map(c => c.id === id ? { ...c, ...updates } : c),
    });
  };

  const addColumn = () => {
    onChange({ ...table, columns: [...table.columns, makeColumn()] });
  };

  const removeColumn = (id: string) => {
    onChange({ ...table, columns: table.columns.filter(c => c.id !== id) });
  };

  const copyTableSQL = () => {
    navigator.clipboard.writeText(generateTableSQL(table)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const previewSQL = generateTableSQL(table);

  return (
    <div style={{ border: "1px solid #E5E7EB", borderRadius: "12px", overflow: "hidden", backgroundColor: "#FFFFFF" }}>
      {/* Table header */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "10px 12px", backgroundColor: "#F9FAFB", borderBottom: open ? "1px solid #F3F4F6" : "none" }}>
        <button
          type="button"
          onClick={() => setOpen(o => !o)}
          style={{ background: "none", border: "none", cursor: "pointer", padding: 0, color: "#6B7280" }}
        >
          {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
        <Table2 size={14} color="#6366F1" style={{ flexShrink: 0 }} />
        <input
          value={table.name}
          onChange={e => onChange({ ...table, name: e.target.value })}
          style={{
            flex: 1, background: "none", border: "none", outline: "none",
            fontSize: "13px", fontWeight: 700, color: "#111827",
          }}
          placeholder="table_name"
        />
        <button
          type="button"
          onClick={copyTableSQL}
          title="Copy SQL for this table"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: copied ? "#10B981" : "#9CA3AF" }}
        >
          {copied ? <Check size={13} /> : <Copy size={13} />}
        </button>
        <button
          type="button"
          onClick={onRemove}
          style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#EF4444" }}
        >
          <Trash2 size={13} />
        </button>
      </div>

      {open && (
        <div style={{ padding: "10px 12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          {/* Columns */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "2px" }}>
              <Columns3 size={11} color="#9CA3AF" />
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>Columns</span>
            </div>
            {table.columns.map(col => (
              <ColumnRow
                key={col.id}
                col={col}
                tableNames={otherTableNames}
                onChange={updates => updateColumn(col.id, updates)}
                onRemove={() => removeColumn(col.id)}
                canRemove={table.columns.length > 1}
              />
            ))}
            <button
              type="button"
              onClick={addColumn}
              style={{
                display: "flex", alignItems: "center", gap: "5px", padding: "6px 8px",
                border: "1px dashed #C7D2FE", borderRadius: "7px", backgroundColor: "#EEF2FF",
                color: "#6366F1", fontSize: "12px", fontWeight: 600, cursor: "pointer",
              }}
            >
              <Plus size={11} /> Add Column
            </button>
          </div>

          {/* Table options */}
          <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "8px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <Checkbox
              checked={!!table.addTimestamps}
              onChange={() => onChange({ ...table, addTimestamps: !table.addTimestamps })}
              label="Auto-add created_at / updated_at"
            />
            <Checkbox
              checked={!!table.enableRls}
              onChange={() => onChange({ ...table, enableRls: !table.enableRls })}
              label="Enable Row Level Security (RLS)"
            />
            {table.enableRls && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", paddingLeft: "18px" }}>
                <span style={{ fontSize: "11px", color: "#6B7280", flexShrink: 0 }}>Policy:</span>
                <select
                  value={table.rlsPolicy ?? "none"}
                  onChange={e => onChange({ ...table, rlsPolicy: e.target.value as SchemaRLSPolicy })}
                  style={{ flex: 1, padding: "5px 8px", border: "1px solid #E5E7EB", borderRadius: "6px", fontSize: "12px", backgroundColor: "#FAFAFA", outline: "none" }}
                >
                  {RLS_POLICIES.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}
            {table.enableRls && table.rlsPolicy && table.rlsPolicy !== "none" && (
              <p style={{ margin: 0, fontSize: "11px", color: "#9CA3AF", paddingLeft: "18px", lineHeight: "1.4" }}>
                {RLS_POLICIES.find(p => p.value === table.rlsPolicy)?.description}
              </p>
            )}
          </div>

          {/* SQL preview for this table */}
          <div style={{ borderTop: "1px solid #F3F4F6", paddingTop: "8px" }}>
            <button
              type="button"
              onClick={() => setSqlOpen(o => !o)}
              style={{ display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              {sqlOpen ? <ChevronDown size={11} color="#9CA3AF" /> : <ChevronRight size={11} color="#9CA3AF" />}
              <span style={{ fontSize: "11px", color: "#9CA3AF", fontWeight: 600 }}>Preview SQL</span>
            </button>
            {sqlOpen && (
              <pre style={{
                marginTop: "6px", padding: "10px", borderRadius: "8px",
                backgroundColor: "#0F172A", color: "#E2E8F0",
                fontSize: "11px", lineHeight: "1.6", overflowX: "auto",
                fontFamily: "JetBrains Mono, Menlo, monospace",
                whiteSpace: "pre-wrap", wordBreak: "break-all",
              }}>
                {previewSQL}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function SchemaPanel() {
  const siteId = useEditorStore(s => s.siteId);
  const getSiteById = useSiteStore(s => s.getSiteById);
  const updateSite = useSiteStore(s => s.updateSite);

  const site = siteId ? getSiteById(siteId) : undefined;

  const [schema, setSchema] = useState<SiteSchema>(() => site?.schema ?? { tables: [] });
  const [saved, setSaved] = useState(false);
  const [fullSqlOpen, setFullSqlOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const tableNames = schema.tables.map(t => t.name);

  const updateTable = useCallback((id: string, updated: SchemaTable) => {
    setSchema(prev => ({ tables: prev.tables.map(t => t.id === id ? updated : t) }));
    setSaved(false);
  }, []);

  const addTable = () => {
    setSchema(prev => ({ tables: [...prev.tables, makeTable()] }));
    setSaved(false);
  };

  const removeTable = (id: string) => {
    setSchema(prev => ({ tables: prev.tables.filter(t => t.id !== id) }));
    setSaved(false);
  };

  const save = () => {
    if (!siteId) return;
    updateSite(siteId, { schema });
    fetch(`/api/v1/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ schema_config: schema }),
    }).catch(console.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const fullSQL = generateSchemaSQL(schema);

  const copyAll = () => {
    navigator.clipboard.writeText(fullSQL).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (!siteId) {
    return (
      <div style={{ padding: "24px 16px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
        No site loaded
      </div>
    );
  }

  return (
    <div style={{ height: "100%", overflowY: "auto", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "14px 16px", borderBottom: "1px solid #F3F4F6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Database size={15} color="#6366F1" />
          <span style={{ fontSize: "13px", fontWeight: 700, color: "#111827" }}>Schema Designer</span>
        </div>
        <span style={{ fontSize: "11px", color: "#9CA3AF" }}>{schema.tables.length} table{schema.tables.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Supabase hint */}
      <div style={{ margin: "12px 16px 0", padding: "10px 12px", backgroundColor: "#EFF6FF", borderRadius: "10px", border: "1px solid #BFDBFE", fontSize: "11px", color: "#1E40AF", lineHeight: "1.6" }}>
        <strong>How it works:</strong> Design your tables here → copy the SQL → paste into <strong>Supabase → SQL Editor → Run</strong>. Your schema is live instantly.
      </div>

      {/* Tables */}
      <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        {schema.tables.length === 0 && (
          <div style={{ textAlign: "center", padding: "32px 16px", color: "#9CA3AF", fontSize: "13px" }}>
            No tables yet. Click "Add Table" to start.
          </div>
        )}

        {schema.tables.map(table => (
          <TableCard
            key={table.id}
            table={table}
            allTableNames={tableNames}
            onChange={updated => updateTable(table.id, updated)}
            onRemove={() => removeTable(table.id)}
          />
        ))}

        <button
          onClick={addTable}
          style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            padding: "10px", borderRadius: "10px", border: "1px dashed #C7D2FE",
            backgroundColor: "#EEF2FF", color: "#6366F1", fontWeight: 700, fontSize: "13px",
            cursor: "pointer",
          }}
        >
          <Plus size={14} /> Add Table
        </button>
      </div>

      {/* Full SQL preview */}
      {schema.tables.length > 0 && (
        <div style={{ padding: "0 16px 12px" }}>
          <button
            type="button"
            onClick={() => setFullSqlOpen(o => !o)}
            style={{
              width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "8px 10px", borderRadius: "8px", border: "1px solid #E5E7EB",
              background: "none", cursor: "pointer", fontSize: "12px", fontWeight: 600, color: "#374151",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "5px" }}>
              {fullSqlOpen ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
              Full SQL Preview
            </span>
            <button
              type="button"
              onClick={e => { e.stopPropagation(); copyAll(); }}
              style={{
                display: "flex", alignItems: "center", gap: "4px", padding: "3px 8px",
                borderRadius: "6px", border: "none",
                backgroundColor: copied ? "#DCFCE7" : "#EEF2FF",
                color: copied ? "#16A34A" : "#6366F1",
                fontSize: "11px", fontWeight: 700, cursor: "pointer",
              }}
            >
              {copied ? <><Check size={11} /> Copied!</> : <><Copy size={11} /> Copy All SQL</>}
            </button>
          </button>

          {fullSqlOpen && (
            <pre style={{
              marginTop: "8px", padding: "14px", borderRadius: "10px",
              backgroundColor: "#0F172A", color: "#E2E8F0",
              fontSize: "11px", lineHeight: "1.7", overflowX: "auto",
              fontFamily: "JetBrains Mono, Menlo, monospace",
              whiteSpace: "pre-wrap", wordBreak: "break-all",
              maxHeight: "400px", overflowY: "auto",
            }}>
              {fullSQL}
            </pre>
          )}
        </div>
      )}

      {/* Save */}
      <div style={{ padding: "12px 16px", borderTop: "1px solid #F3F4F6" }}>
        <button
          onClick={save}
          style={{
            width: "100%", padding: "10px", borderRadius: "10px", border: "none", cursor: "pointer",
            backgroundColor: saved ? "#10B981" : "#6366F1",
            color: "#FFFFFF", fontWeight: 700, fontSize: "13px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
            transition: "background 0.2s",
          }}
        >
          {saved
            ? <><Check size={14} /> Schema Saved</>
            : <><RefreshCw size={14} /> Save Schema</>}
        </button>
        <p style={{ margin: "6px 0 0", fontSize: "11px", color: "#9CA3AF", textAlign: "center" }}>
          Saving stores your schema definition — not the data.
        </p>
      </div>
    </div>
  );
}
