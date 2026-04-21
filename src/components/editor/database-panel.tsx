"use client";

/**
 * DatabasePanel
 *
 * Live backend management panel inside the editor.
 *
 * Tabs:
 *   Collections  — define tables (name + typed fields), browse / edit rows
 *   API Key      — view / rotate the site's API key + usage examples
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Database, Plus, Trash2, ChevronDown, ChevronRight,
  RefreshCw, Copy, Check, Eye, EyeOff, Pencil, X,
  Save, Table2, Key, Loader2, AlertCircle, ToggleLeft,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

// ── Types ─────────────────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "boolean" | "date" | "email" | "url" | "select" | "richtext";

interface CollectionField {
  name:     string;
  type:     FieldType;
  required: boolean;
  options?: string[];   // for select type
}

interface Collection {
  id:             string;
  name:           string;
  slug:           string;
  description:    string;
  fields:         CollectionField[];
  itemCount:      number;
  publishedCount: number;
  draftCount:     number;
}

interface CmsItem {
  id:         string;
  data:       Record<string, unknown>;
  status:     "published" | "draft";
  created_at: string;
  updated_at: string;
}

const FIELD_TYPES: { value: FieldType; label: string; icon: string }[] = [
  { value: "text",     label: "Text",     icon: "Aa" },
  { value: "number",   label: "Number",   icon: "##" },
  { value: "boolean",  label: "Boolean",  icon: "✓" },
  { value: "date",     label: "Date",     icon: "📅" },
  { value: "email",    label: "Email",    icon: "@" },
  { value: "url",      label: "URL",      icon: "🔗" },
  { value: "select",   label: "Select",   icon: "▾" },
  { value: "richtext", label: "Rich Text",icon: "¶" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function inputCls(extra = "") {
  return cn(
    "w-full px-2.5 py-1.5 text-[12px] border border-gray-200 rounded-lg bg-white",
    "focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-300 transition-colors",
    extra
  );
}

function btn(variant: "primary" | "ghost" | "danger" | "outline", extra = "") {
  const base = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all disabled:opacity-50";
  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700",
    ghost:   "text-gray-500 hover:text-gray-700 hover:bg-gray-100",
    danger:  "text-red-500 hover:text-red-600 hover:bg-red-50",
    outline: "border border-gray-200 text-gray-600 hover:border-gray-300 bg-white",
  };
  return cn(base, variants[variant], extra);
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none",
      status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
    )}>
      {status}
    </span>
  );
}

// ── Field value renderer ──────────────────────────────────────────────────────
function renderFieldValue(val: unknown, type: FieldType): React.ReactNode {
  if (val === undefined || val === null || val === "") return <span className="text-gray-300 italic text-[10px]">—</span>;
  if (type === "boolean") return <span className={cn("text-[10px] font-semibold", val ? "text-green-600" : "text-red-500")}>{val ? "true" : "false"}</span>;
  if (type === "date") return <span className="text-[11px] text-gray-600" suppressHydrationWarning>{new Date(String(val)).toLocaleDateString()}</span>;
  const str = String(val);
  return <span className="text-[11px] text-gray-700 truncate max-w-[120px]" title={str}>{str}</span>;
}

// ── Field input ───────────────────────────────────────────────────────────────
function FieldInput({ field, value, onChange }: {
  field: CollectionField;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const cls = inputCls();
  if (field.type === "boolean") {
    return (
      <button type="button" onClick={() => onChange(!value)} className="flex items-center gap-1.5 text-[11px] font-medium text-gray-700">
        <div className={cn("w-8 h-4 rounded-full transition-colors flex items-center px-0.5", value ? "bg-indigo-500" : "bg-gray-300")}>
          <div className={cn("w-3 h-3 rounded-full bg-white shadow transition-transform", value ? "translate-x-4" : "translate-x-0")} />
        </div>
        {value ? "true" : "false"}
      </button>
    );
  }
  if (field.type === "select" && field.options?.length) {
    return (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cls}>
        <option value="">— select —</option>
        {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    );
  }
  if (field.type === "richtext") {
    return <textarea rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cn(cls, "resize-none")} />;
  }
  return (
    <input
      type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
      value={String(value ?? "")}
      onChange={(e) => onChange(field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)}
      className={cls}
    />
  );
}

// ── New field row ─────────────────────────────────────────────────────────────
function NewFieldRow({ onAdd }: { onAdd: (f: CollectionField) => void }) {
  const [name, setName]         = useState("");
  const [type, setType]         = useState<FieldType>("text");
  const [required, setRequired] = useState(false);
  const [options, setOptions]   = useState("");

  function commit() {
    const trimmed = name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (!trimmed) return;
    const field: CollectionField = { name: trimmed, type, required };
    if (type === "select" && options.trim()) {
      field.options = options.split(",").map((o) => o.trim()).filter(Boolean);
    }
    onAdd(field);
    setName(""); setType("text"); setRequired(false); setOptions("");
  }

  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30">
      <div className="flex gap-2">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && commit()}
          placeholder="field_name"
          className={inputCls("flex-1")}
        />
        <select value={type} onChange={(e) => setType(e.target.value as FieldType)} className={inputCls("w-28")}>
          {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      {type === "select" && (
        <input
          value={options}
          onChange={(e) => setOptions(e.target.value)}
          placeholder="Opt A, Opt B, Opt C  (comma separated)"
          className={inputCls()}
        />
      )}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer">
          <input type="checkbox" checked={required} onChange={(e) => setRequired(e.target.checked)} className="w-3 h-3 accent-indigo-600" />
          Required
        </label>
        <button onClick={commit} className={btn("primary", "text-[10px] py-1")}>
          <Plus className="w-3 h-3" /> Add field
        </button>
      </div>
    </div>
  );
}

// ── Item form modal ───────────────────────────────────────────────────────────
function ItemFormModal({ collection, item, siteId, onClose, onSaved }: {
  collection: Collection;
  item?: CmsItem;
  siteId: string;
  onClose: () => void;
  onSaved: (item: CmsItem) => void;
}) {
  const [data,   setData]   = useState<Record<string, unknown>>(() => item?.data ?? {});
  const [status, setStatus] = useState<"published" | "draft">(item?.status ?? "published");
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  async function save() {
    setSaving(true); setError(null);
    try {
      const url    = item
        ? `/api/v1/sites/${siteId}/db/${collection.slug}/${item.id}`
        : `/api/v1/sites/${siteId}/db/${collection.slug}`;
      const method = item ? "PUT" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      onSaved(json.item);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Table2 className="w-4 h-4 text-indigo-500" />
            <h3 className="text-[13px] font-bold text-gray-900">
              {item ? "Edit item" : `Add to ${collection.name}`}
            </h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fields */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {collection.fields.length === 0 ? (
            <p className="text-[12px] text-gray-400 text-center py-4">No fields defined yet.</p>
          ) : collection.fields.map((field) => (
            <div key={field.name}>
              <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">
                {field.name}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
                <span className="ml-1 text-gray-400 normal-case font-normal">({field.type})</span>
              </label>
              <FieldInput
                field={field}
                value={data[field.name]}
                onChange={(v) => setData((prev) => ({ ...prev, [field.name]: v }))}
              />
            </div>
          ))}

          {/* Status */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Status</label>
            <div className="flex gap-2">
              {(["published", "draft"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatus(s)}
                  className={cn(
                    "flex-1 py-1.5 rounded-lg text-[11px] font-semibold border transition-all",
                    status === s
                      ? s === "published" ? "bg-green-500 border-green-500 text-white" : "bg-amber-500 border-amber-500 text-white"
                      : "border-gray-200 text-gray-500 hover:bg-gray-50"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-[11px] text-red-600">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button onClick={onClose} className={btn("outline")}>Cancel</button>
          <button onClick={save} disabled={saving} className={btn("primary")}>
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {saving ? "Saving…" : "Save item"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Collection detail view ────────────────────────────────────────────────────
function CollectionView({ collection, siteId, onBack, onDeleted }: {
  collection: Collection;
  siteId: string;
  onBack: () => void;
  onDeleted: () => void;
}) {
  const [items,    setItems]    = useState<CmsItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);
  const [page,     setPage]     = useState(1);
  const [total,    setTotal]    = useState(0);
  const [hasMore,  setHasMore]  = useState(false);
  const [status,   setStatus]   = useState<"all" | "published" | "draft">("all");
  const [editing,  setEditing]  = useState<CmsItem | "new" | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showDeleteCollectionConfirm, setShowDeleteCollectionConfirm] = useState(false);

  const limit = 20;

  const load = useCallback(async (p = 1, s = status) => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`/api/v1/sites/${siteId}/db/${collection.slug}?status=${s}&page=${p}&limit=${limit}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setItems(json.items ?? []);
      setTotal(json.total ?? 0);
      setHasMore(json.hasMore ?? false);
      setPage(p);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Load failed");
    } finally {
      setLoading(false);
    }
  }, [siteId, collection.slug, status]);

  useEffect(() => { load(1, status); }, [load, status]);

  async function deleteItem(id: string) {
    setDeleting(id);
    await fetch(`/api/v1/sites/${siteId}/db/${collection.slug}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setTotal((t) => t - 1);
    setDeleting(null);
  }

  async function deleteCollection() {
    await fetch(`/api/v1/cms/collections?collectionId=${collection.id}`, { method: "DELETE" });
    onDeleted();
  }

  function handleSaved(saved: CmsItem) {
    if (editing === "new") {
      setItems((prev) => [saved, ...prev]);
      setTotal((t) => t + 1);
    } else {
      setItems((prev) => prev.map((i) => i.id === saved.id ? saved : i));
    }
    setEditing(null);
  }

  const visibleFields = collection.fields.slice(0, 4); // show max 4 cols in table

  return (
    <div className="flex flex-col h-full">
      {/* Subheader */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <Table2 className="w-4 h-4 text-indigo-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 truncate">{collection.name}</p>
          <p className="text-[10px] text-gray-400">/{collection.slug} · {total} records</p>
        </div>
        <button onClick={() => setShowDeleteCollectionConfirm(true)} className={btn("danger", "text-[10px] py-1 px-2")}>
          <Trash2 className="w-3 h-3" />
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 shrink-0">
        <div className="flex gap-1 flex-1">
          {(["all", "published", "draft"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={cn(
              "px-2 py-1 text-[10px] font-semibold rounded-lg transition-all",
              status === s ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100"
            )}>{s}</button>
          ))}
        </div>
        <button onClick={() => load(page)} className={btn("ghost", "p-1.5")} title="Refresh">
          <RefreshCw className="w-3 h-3" />
        </button>
        <button onClick={() => setEditing("new")} className={btn("primary", "py-1 text-[10px]")}>
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-24 gap-2 text-gray-400">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-[12px]">Loading…</span>
          </div>
        ) : error ? (
          <div className="flex items-center gap-2 m-4 p-3 bg-red-50 rounded-xl text-[11px] text-red-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-center px-4">
            <Database className="w-8 h-8 text-gray-300" />
            <p className="text-[12px] font-medium text-gray-500">No records yet</p>
            <button onClick={() => setEditing("new")} className={btn("primary", "text-[11px]")}>
              <Plus className="w-3 h-3" /> Add first record
            </button>
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 z-10">
              <tr>
                <th className="text-left px-3 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider w-8">#</th>
                {visibleFields.map((f) => (
                  <th key={f.name} className="text-left px-3 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                    {f.name}
                  </th>
                ))}
                <th className="text-left px-3 py-2 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="w-16 px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-3 py-2.5 text-gray-400 text-[10px] tabular-nums">
                    {(page - 1) * limit + idx + 1}
                  </td>
                  {visibleFields.map((f) => (
                    <td key={f.name} className="px-3 py-2.5">
                      {renderFieldValue(item.data[f.name], f.type)}
                    </td>
                  ))}
                  <td className="px-3 py-2.5"><StatusBadge status={item.status} /></td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditing(item)} className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors">
                        <Pencil className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteItem(item.id)}
                        disabled={deleting === item.id}
                        className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors"
                      >
                        {deleting === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 text-[11px] shrink-0">
          <button disabled={page <= 1} onClick={() => load(page - 1)} className={btn("outline", "py-1")}>← Prev</button>
          <span className="text-gray-400">Page {page}</span>
          <button disabled={!hasMore} onClick={() => load(page + 1)} className={btn("outline", "py-1")}>Next →</button>
        </div>
      )}

      {/* Item form modal */}
      {editing !== null && (
        <ItemFormModal
          collection={collection}
          item={editing === "new" ? undefined : editing}
          siteId={siteId}
          onClose={() => setEditing(null)}
          onSaved={handleSaved}
        />
      )}

      <ConfirmDialog
        open={showDeleteCollectionConfirm}
        title={`Delete "${collection.name}"?`}
        description="This will permanently delete the collection and all its data. This cannot be undone."
        confirmLabel="Delete Collection"
        onConfirm={() => { setShowDeleteCollectionConfirm(false); deleteCollection(); }}
        onCancel={() => setShowDeleteCollectionConfirm(false)}
      />
    </div>
  );
}

// ── Create collection form ────────────────────────────────────────────────────
function CreateCollectionForm({ siteId, onCreated, onCancel }: {
  siteId: string;
  onCreated: (c: Collection) => void;
  onCancel: () => void;
}) {
  const [name,   setName]   = useState("");
  const [desc,   setDesc]   = useState("");
  const [fields, setFields] = useState<CollectionField[]>([]);
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState<string | null>(null);

  function removeField(idx: number) {
    setFields((prev) => prev.filter((_, i) => i !== idx));
  }

  async function create() {
    if (!name.trim()) { setError("Collection name is required"); return; }
    setSaving(true); setError(null);
    try {
      const res  = await fetch("/api/v1/cms/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: desc.trim(), fields, site_id: siteId }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Create failed");
      onCreated(json.collection);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Create failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 shrink-0">
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <ChevronRight className="w-4 h-4 rotate-180" />
        </button>
        <h3 className="text-[13px] font-bold text-gray-900">New collection</h3>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Products" className={inputCls()} />
        </div>
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional description" className={inputCls()} />
        </div>

        {/* Fields */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Fields</label>
          {fields.length > 0 && (
            <div className="space-y-1.5 mb-3">
              {fields.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-700 flex-1">{f.name}</span>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">{f.type}</span>
                  {f.required && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">req</span>}
                  <button onClick={() => removeField(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
          <NewFieldRow onAdd={(f) => setFields((prev) => [...prev, f])} />
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-[11px] text-red-600">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
          </div>
        )}
      </div>

      <div className="flex gap-2 px-4 py-3 border-t border-gray-100 shrink-0">
        <button onClick={onCancel} className={btn("outline", "flex-1 justify-center")}>Cancel</button>
        <button onClick={create} disabled={saving} className={btn("primary", "flex-1 justify-center")}>
          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
          {saving ? "Creating…" : "Create"}
        </button>
      </div>
    </div>
  );
}

// ── Collections list ──────────────────────────────────────────────────────────
function CollectionsList({ siteId, onSelect, onNew, onRefresh }: {
  siteId: string;
  onSelect: (c: Collection) => void;
  onNew:    () => void;
  onRefresh: () => void;
}) {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/v1/cms/collections?siteId=${siteId}`)
      .then((r) => r.json())
      .then((d) => { setCollections(d.collections ?? []); setLoading(false); })
      .catch(() => { setError("Failed to load"); setLoading(false); });
  }, [siteId]);

  if (loading) return (
    <div className="flex items-center justify-center h-24 gap-2 text-gray-400">
      <Loader2 className="w-4 h-4 animate-spin" />
      <span className="text-[12px]">Loading…</span>
    </div>
  );

  if (error) return (
    <div className="flex items-center gap-2 m-4 p-3 bg-red-50 rounded-xl text-[11px] text-red-600">
      <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {error}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
      {collections.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 gap-3 text-center px-4">
          <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Database className="w-5 h-5 text-gray-400" />
          </div>
          <div>
            <p className="text-[12px] font-semibold text-gray-600">No collections yet</p>
            <p className="text-[10px] text-gray-400 mt-1">Create a collection to start storing data for your site</p>
          </div>
          <button onClick={onNew} className={btn("primary")}>
            <Plus className="w-3.5 h-3.5" /> New collection
          </button>
        </div>
      ) : (
        <>
          {collections.map((col) => (
            <button
              key={col.id}
              onClick={() => onSelect(col)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/20 transition-all text-left group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0">
                <Table2 className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-800 truncate">{col.name}</p>
                <p className="text-[10px] text-gray-400">
                  /{col.slug} · {col.fields.length} field{col.fields.length !== 1 ? "s" : ""} · {col.itemCount} record{col.itemCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex flex-col items-end gap-1 shrink-0">
                <span className="text-[9px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">{col.publishedCount} pub</span>
                {col.draftCount > 0 && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">{col.draftCount} draft</span>}
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
            </button>
          ))}
          <button onClick={onNew} className={cn(btn("outline", "w-full justify-center py-2.5"), "border-dashed hover:border-indigo-300 hover:text-indigo-600")}>
            <Plus className="w-3.5 h-3.5" /> New collection
          </button>
        </>
      )}
    </div>
  );
}

// ── API Key tab ───────────────────────────────────────────────────────────────
function ApiKeyTab({ siteId }: { siteId: string }) {
  const [apiKey,    setApiKey]    = useState<string | null>(null);
  const [loading,   setLoading]   = useState(true);
  const [rotating,  setRotating]  = useState(false);
  const [revealed,  setRevealed]  = useState(false);
  const [copied,    setCopied]    = useState(false);
  const [showRotateConfirm, setShowRotateConfirm] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/sites/${siteId}/api-key`)
      .then((r) => r.json())
      .then((d) => { setApiKey(d.apiKey); setLoading(false); })
      .catch(() => setLoading(false));
  }, [siteId]);

  async function rotate() {
    setShowRotateConfirm(false);
    setRotating(true);
    const res  = await fetch(`/api/v1/sites/${siteId}/api-key`, { method: "POST" });
    const json = await res.json();
    setApiKey(json.apiKey);
    setRevealed(true);
    setRotating(false);
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const maskedKey = apiKey ? apiKey.slice(0, 10) + "•".repeat(Math.max(0, apiKey.length - 14)) + apiKey.slice(-4) : "";
  const displayKey = revealed ? (apiKey ?? "") : maskedKey;

  if (loading) return (
    <div className="flex items-center justify-center h-24 gap-2 text-gray-400">
      <Loader2 className="w-4 h-4 animate-spin" />
    </div>
  );

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://yourapp.com";
  const exampleFetch = `fetch("${baseUrl}/api/v1/sites/${siteId}/db/products", {
  headers: {
    "X-API-Key": "${apiKey ?? "sk_live_…"}"
  }
})`;
  const examplePost = `fetch("${baseUrl}/api/v1/sites/${siteId}/db/products", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": "${apiKey ?? "sk_live_…"}"
  },
  body: JSON.stringify({
    data: { name: "Widget", price: 29 },
    status: "published"
  })
})`;

  return (
    <>
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
      {/* Key display */}
      <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 space-y-3">
        <div className="flex items-center gap-2">
          <Key className="w-4 h-4 text-indigo-500" />
          <span className="text-[12px] font-bold text-gray-800">Site API Key</span>
          <span className="ml-auto text-[9px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Active</span>
        </div>

        <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
          <code className="flex-1 text-[11px] font-mono text-gray-700 truncate">{displayKey}</code>
          <button onClick={() => setRevealed((r) => !r)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            {revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          <button onClick={() => copy(apiKey ?? "")} className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0">
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <button onClick={() => setShowRotateConfirm(true)} disabled={rotating} className={btn("danger", "text-[10px] py-1")}>
          {rotating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
          {rotating ? "Regenerating…" : "Regenerate key"}
        </button>

        <p className="text-[10px] text-gray-400 leading-relaxed">
          Keep this key secret. Include it as an <code className="bg-gray-100 px-1 rounded">X-API-Key</code> header in requests from your published site.
        </p>
      </div>

      {/* Usage examples */}
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Usage examples</p>

        <div>
          <p className="text-[10px] font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
            <span className="bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded text-[9px] font-bold">GET</span>
            List records
          </p>
          <div className="relative">
            <pre className="text-[10px] bg-gray-900 text-green-300 p-3 rounded-xl overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all">{exampleFetch}</pre>
            <button onClick={() => copy(exampleFetch)} className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors">
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-semibold text-gray-600 mb-1.5 flex items-center gap-1">
            <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded text-[9px] font-bold">POST</span>
            Create record
          </p>
          <div className="relative">
            <pre className="text-[10px] bg-gray-900 text-green-300 p-3 rounded-xl overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all">{examplePost}</pre>
            <button onClick={() => copy(examplePost)} className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors">
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-100">
          <p className="text-[10px] font-bold text-indigo-700 mb-1">Full endpoint reference</p>
          <div className="space-y-0.5 font-mono text-[10px] text-indigo-600">
            <p>GET    /api/v1/sites/{"{siteId}"}/db/{"{collection}"}</p>
            <p>POST   /api/v1/sites/{"{siteId}"}/db/{"{collection}"}</p>
            <p>GET    /api/v1/sites/{"{siteId}"}/db/{"{collection}"}/{"{id}"}</p>
            <p>PUT    /api/v1/sites/{"{siteId}"}/db/{"{collection}"}/{"{id}"}</p>
            <p>PATCH  /api/v1/sites/{"{siteId}"}/db/{"{collection}"}/{"{id}"}</p>
            <p>DELETE /api/v1/sites/{"{siteId}"}/db/{"{collection}"}/{"{id}"}</p>
          </div>
        </div>
      </div>
    </div>

      <ConfirmDialog
        open={showRotateConfirm}
        title="Regenerate API key?"
        description="Your existing API key will stop working immediately. All integrations using the old key will break."
        confirmLabel="Regenerate"
        variant="warning"
        onConfirm={rotate}
        onCancel={() => setShowRotateConfirm(false)}
      />
    </>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────
type View = "list" | "new" | { collection: Collection };

export default function DatabasePanel() {
  const siteId = useEditorStore((s) => s.siteId);
  const [activeTab, setActiveTab] = useState<"collections" | "api">("collections");
  const [view,      setView]      = useState<View>("list");
  const [refreshKey, setRefreshKey] = useState(0);

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-4 gap-2">
        <Database className="w-8 h-8 text-gray-300" />
        <p className="text-[12px] text-gray-400">No site loaded</p>
      </div>
    );
  }

  function handleCollectionCreated(col: Collection) {
    setView({ collection: col });
    setRefreshKey((k) => k + 1);
  }

  function handleCollectionDeleted() {
    setView("list");
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">

      {/* Header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-sm shadow-emerald-200/60 shrink-0">
            <Database className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <h2 className="text-[13px] font-bold text-gray-900 leading-none">Database</h2>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none">Live CRUD backend</p>
          </div>
        </div>

        {/* Tabs */}
        {view === "list" && (
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
            {(["collections", "api"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={cn(
                  "flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all",
                  activeTab === t ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
                )}
              >
                {t === "collections" ? <Table2 className="w-3 h-3" /> : <Key className="w-3 h-3" />}
                {t === "collections" ? "Collections" : "API Key"}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Body */}
      {view === "list" ? (
        activeTab === "collections" ? (
          <CollectionsList
            key={refreshKey}
            siteId={siteId}
            onSelect={(col) => setView({ collection: col })}
            onNew={() => setView("new")}
            onRefresh={() => setRefreshKey((k) => k + 1)}
          />
        ) : (
          <ApiKeyTab siteId={siteId} />
        )
      ) : view === "new" ? (
        <CreateCollectionForm
          siteId={siteId}
          onCreated={handleCollectionCreated}
          onCancel={() => setView("list")}
        />
      ) : (
        <CollectionView
          collection={view.collection}
          siteId={siteId}
          onBack={() => setView("list")}
          onDeleted={handleCollectionDeleted}
        />
      )}
    </div>
  );
}
