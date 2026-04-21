"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  ArrowLeft, Plus, Search, ChevronLeft, ChevronRight,
  Pencil, Trash2, FileText, Settings, X, Save, RefreshCw,
  CheckCircle2, Circle, Database, AlertCircle,
  GripVertical, Star, Hash, Link2, Image, ToggleLeft,
  AlignLeft, AlignJustify, Type, Phone, Palette, Tag,
  CalendarDays, Mail, ListFilter, Binary, Copy, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FieldDef {
  key: string;
  label: string;
  type: "text" | "textarea" | "richtext" | "number" | "boolean" | "url" | "image" | "date" | "email"
  | "select" | "multiselect" | "color" | "rating" | "phone" | "tags" | "slug";
  required?: boolean;
  description?: string;
  placeholder?: string;
  options?: string[];     // for select / multiselect
  defaultValue?: unknown;
  min?: number;           // for number / rating
  max?: number;
}

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  fields: FieldDef[];
  site_id: string | null;
  itemCount: number;
  publishedCount: number;
  draftCount: number;
}

interface CmsItem {
  id: string;
  data: Record<string, unknown>;
  status: "published" | "draft";
  created_at: string;
  updated_at: string;
}

type StatusFilter = "all" | "published" | "draft";

interface FieldTypeMeta {
  value: FieldDef["type"];
  label: string;
  icon: React.ElementType;
  description: string;
  group: "text" | "number" | "media" | "choice" | "special";
}

const FIELD_TYPES: FieldTypeMeta[] = [
  // Text
  { value: "text", label: "Short Text", icon: Type, description: "Single line text", group: "text" },
  { value: "textarea", label: "Long Text", icon: AlignLeft, description: "Multi-line plain text", group: "text" },
  { value: "richtext", label: "Rich Text", icon: AlignJustify, description: "Formatted text with markup", group: "text" },
  { value: "email", label: "Email", icon: Mail, description: "Validated email address", group: "text" },
  { value: "url", label: "URL", icon: Link2, description: "Web address / link", group: "text" },
  { value: "phone", label: "Phone", icon: Phone, description: "Phone number", group: "text" },
  { value: "slug", label: "Slug", icon: Hash, description: "URL-safe identifier", group: "text" },
  // Number
  { value: "number", label: "Number", icon: Binary, description: "Integer or decimal value", group: "number" },
  { value: "rating", label: "Rating", icon: Star, description: "Star rating (1–5)", group: "number" },
  // Media
  { value: "image", label: "Image URL", icon: Image, description: "URL pointing to an image", group: "media" },
  { value: "color", label: "Color", icon: Palette, description: "Hex color picker", group: "media" },
  // Choice
  { value: "boolean", label: "True / False", icon: ToggleLeft, description: "Boolean toggle", group: "choice" },
  { value: "select", label: "Select", icon: ListFilter, description: "Single option from a list", group: "choice" },
  { value: "multiselect", label: "Multi-select", icon: ListFilter, description: "Multiple options from a list", group: "choice" },
  { value: "tags", label: "Tags", icon: Tag, description: "Comma-separated tag list", group: "choice" },
  // Special
  { value: "date", label: "Date", icon: CalendarDays, description: "Date picker", group: "special" },
];

const FIELD_GROUP_LABELS: Record<string, string> = {
  text: "Text", number: "Number", media: "Media & Color", choice: "Choice", special: "Special",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "1 day ago";
  if (d < 30) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getItemTitle(item: CmsItem, fields: FieldDef[]) {
  // Try schema title fields first
  for (const f of fields) {
    if (["title", "name", "heading", "label"].includes(f.key) && item.data[f.key])
      return String(item.data[f.key]);
  }
  // Try common field names
  for (const k of ["title", "name", "heading", "label", "subject"]) {
    if (item.data[k]) return String(item.data[k]);
  }
  // First non-empty string field
  for (const v of Object.values(item.data)) {
    if (typeof v === "string" && v) return v.slice(0, 60);
  }
  return `Item ${item.id.slice(0, 8)}`;
}

function getItemPreview(item: CmsItem, fields: FieldDef[]) {
  const title = getItemTitle(item, fields);
  for (const k of Object.keys(item.data)) {
    const v = item.data[k];
    if (typeof v === "string" && v !== title && v.length > 0) return v.slice(0, 80);
  }
  return null;
}

// ── Tags sub-component (needs its own state) ──────────────────────────────────

function TagsInput({ value, onChange }: { value: unknown; onChange: (v: unknown) => void }) {
  const tags: string[] = typeof value === "string"
    ? value.split(",").map((t) => t.trim()).filter(Boolean)
    : Array.isArray(value) ? (value as string[]) : [];
  const [draft, setDraft] = React.useState("");

  const addTag = (raw: string) => {
    const tag = raw.trim();
    if (tag && !tags.includes(tag)) onChange([...tags, tag].join(", "));
    setDraft("");
  };

  const removeTag = (tag: string) => onChange(tags.filter((t) => t !== tag).join(", "));

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5 min-h-[38px] p-2 rounded-xl border border-gray-200 bg-gray-50">
        {tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-700 text-xs font-medium">
            {tag}
            <button type="button" onClick={() => removeTag(tag)} className="hover:text-indigo-900">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(draft); }
            if (e.key === "Backspace" && !draft && tags.length) removeTag(tags[tags.length - 1]);
          }}
          placeholder={tags.length === 0 ? "Add tags, press Enter…" : "Add more…"}
          className="flex-1 min-w-[80px] bg-transparent text-sm text-gray-900 placeholder:text-gray-400 outline-none"
        />
      </div>
    </div>
  );
}

// ── Field input component ──────────────────────────────────────────────────────

function FieldInput({
  fieldDef,
  value,
  onChange,
}: {
  fieldDef: FieldDef;
  value: unknown;
  onChange: (v: unknown) => void;
}) {
  const cls = "w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 transition-colors";
  const placeholder = fieldDef.placeholder || `Enter ${fieldDef.label.toLowerCase()}…`;

  // ── Boolean ──
  if (fieldDef.type === "boolean") {
    return (
      <button type="button" onClick={() => onChange(!value)}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all w-full justify-start",
          value ? "border-indigo-200 bg-indigo-50 text-indigo-700" : "border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100"
        )}>
        <div className={cn("w-9 h-5 rounded-full transition-colors relative shrink-0", value ? "bg-indigo-500" : "bg-gray-300")}>
          <span className={cn("absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all", value ? "left-4" : "left-0.5")} />
        </div>
        <span>{value ? "True" : "False"}</span>
      </button>
    );
  }

  // ── Rating ──
  if (fieldDef.type === "rating") {
    const current = Number(value) || 0;
    const max = fieldDef.max || 5;
    return (
      <div className="flex items-center gap-1.5">
        {Array.from({ length: max }, (_, i) => i + 1).map((i) => (
          <button key={i} type="button" onClick={() => onChange(current === i ? 0 : i)}
            className="transition-transform hover:scale-110 active:scale-95">
            <Star className={cn("h-6 w-6 transition-colors",
              i <= current ? "text-amber-400 fill-amber-400" : "text-gray-200 hover:text-amber-200")} />
          </button>
        ))}
        {current > 0 && (
          <span className="text-xs text-gray-500 ml-1">{current}/{max}</span>
        )}
      </div>
    );
  }

  // ── Color ──
  if (fieldDef.type === "color") {
    const hex = String(value ?? "#6366f1");
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          <input type="color" value={hex} onChange={(e) => onChange(e.target.value)}
            className="h-10 w-10 rounded-xl border border-gray-200 cursor-pointer p-0.5 bg-white" />
        </div>
        <input type="text" value={hex} onChange={(e) => onChange(e.target.value)}
          placeholder="#000000"
          className={cn(cls, "flex-1 font-mono")} />
        <div className="h-10 w-10 rounded-xl border border-gray-200 shrink-0" style={{ backgroundColor: hex }} />
      </div>
    );
  }

  // ── Select ──
  if (fieldDef.type === "select") {
    const options = fieldDef.options ?? [];
    return (
      <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}
        className={cls}>
        <option value="">{placeholder}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    );
  }

  // ── Multi-select ──
  if (fieldDef.type === "multiselect") {
    const options = fieldDef.options ?? [];
    const selected: string[] = Array.isArray(value) ? (value as string[]) : [];
    const toggle = (opt: string) => {
      if (selected.includes(opt)) onChange(selected.filter((s) => s !== opt));
      else onChange([...selected, opt]);
    };
    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button key={opt} type="button" onClick={() => toggle(opt)}
              className={cn(
                "px-3 py-1.5 rounded-xl text-sm font-medium border transition-all",
                active ? "bg-indigo-600 border-indigo-600 text-white" : "bg-gray-50 border-gray-200 text-gray-600 hover:border-indigo-300 hover:bg-indigo-50"
              )}>
              {active && <CheckCircle2 className="h-3.5 w-3.5 inline mr-1.5 -mt-0.5" />}
              {opt}
            </button>
          );
        })}
        {options.length === 0 && <p className="text-xs text-gray-400 italic">No options configured — edit schema to add options.</p>}
      </div>
    );
  }

  // ── Tags ──
  if (fieldDef.type === "tags") {
    return <TagsInput value={value} onChange={onChange} />;
  }

  // ── Slug (auto-format on blur) ──
  if (fieldDef.type === "slug") {
    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">/</span>
        <input type="text" value={String(value ?? "")}
          onChange={(e) => onChange(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))}
          placeholder="url-slug"
          className={cn(cls, "pl-6 font-mono")} />
      </div>
    );
  }

  // ── Textarea / Richtext ──
  if (fieldDef.type === "textarea" || fieldDef.type === "richtext") {
    return (
      <textarea rows={fieldDef.type === "richtext" ? 6 : 4}
        value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} className={cn(cls, "resize-none leading-relaxed")} />
    );
  }

  // ── Number ──
  if (fieldDef.type === "number") {
    return (
      <input type="number"
        min={fieldDef.min} max={fieldDef.max}
        value={String(value ?? "")}
        onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
        placeholder="0" className={cls} />
    );
  }

  // ── Image URL with preview ──
  if (fieldDef.type === "image") {
    const url = String(value ?? "");
    return (
      <div className="space-y-2">
        <input type="url" value={url} onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg" className={cls} />
        {url && (
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-100 h-36">
            <img src={url} alt="Preview" className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
          </div>
        )}
      </div>
    );
  }

  // ── Default (text / email / url / phone / date) ──
  return (
    <input
      type={
        fieldDef.type === "date" ? "date"
          : fieldDef.type === "email" ? "email"
            : fieldDef.type === "url" ? "url"
              : fieldDef.type === "phone" ? "tel"
                : "text"
      }
      value={String(value ?? "")}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={cls}
    />
  );
}

// ── Schema editor (right panel) ────────────────────────────────────────────────

const FIELD_TYPE_ICONS: Record<string, React.ElementType> = {
  text: Type, textarea: AlignLeft, richtext: AlignJustify, email: Mail, url: Link2,
  phone: Phone, slug: Hash, number: Binary, rating: Star, image: Image, color: Palette,
  boolean: ToggleLeft, select: ListFilter, multiselect: ListFilter, tags: Tag, date: CalendarDays,
};

function SchemaPanel({
  collection,
  onClose,
  onSave,
}: {
  collection: Collection;
  onClose: () => void;
  onSave: (fields: FieldDef[]) => Promise<void>;
}) {
  const [fields, setFields] = useState<FieldDef[]>(collection.fields ?? []);
  const [saving, setSaving] = useState(false);
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const [addingField, setAddingField] = useState(false);
  const [newField, setNewField] = useState<Partial<FieldDef>>({ type: "text" });
  const [newFieldOptionsText, setNewFieldOptionsText] = useState("");
  const [pickerOpen, setPickerOpen] = useState(false);

  const addField = () => {
    if (!newField.key?.trim()) return;
    const key = newField.key.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (fields.find((f) => f.key === key)) { toast.error("A field with this key already exists"); return; }
    const options = ["select", "multiselect"].includes(newField.type ?? "")
      ? newFieldOptionsText.split(",").map((s) => s.trim()).filter(Boolean)
      : undefined;
    setFields((prev) => [...prev, {
      key,
      label: newField.label?.trim() || key,
      type: newField.type ?? "text",
      required: newField.required ?? false,
      description: newField.description?.trim() || undefined,
      placeholder: newField.placeholder?.trim() || undefined,
      options,
    }]);
    setNewField({ type: "text" });
    setNewFieldOptionsText("");
    setAddingField(false);
    setPickerOpen(false);
  };

  const removeField = (key: string) => { setFields((p) => p.filter((f) => f.key !== key)); if (expandedKey === key) setExpandedKey(null); };

  const updateField = (key: string, patch: Partial<FieldDef>) =>
    setFields((p) => p.map((f) => f.key === key ? { ...f, ...patch } : f));

  const save = async () => { setSaving(true); try { await onSave(fields); } finally { setSaving(false); } };

  const groupedTypes = Object.entries(
    FIELD_TYPES.reduce<Record<string, FieldTypeMeta[]>>((acc, t) => {
      if (!acc[t.group]) acc[t.group] = [];
      acc[t.group].push(t);
      return acc;
    }, {})
  );

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-bold text-gray-900">Schema Fields</h2>
          <p className="text-xs text-gray-500 mt-0.5">{fields.length} field{fields.length !== 1 ? "s" : ""} — define your content structure</p>
        </div>
        <button onClick={onClose} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Field list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {fields.length === 0 && !addingField && (
          <div className="text-center py-12 text-gray-400">
            <Database className="h-10 w-10 mx-auto mb-3 opacity-20" />
            <p className="text-sm font-medium">No fields yet</p>
            <p className="text-xs mt-1 text-gray-400">Add your first field below to define the content structure</p>
          </div>
        )}

        {fields.map((field) => {
          const FieldIcon = FIELD_TYPE_ICONS[field.type] ?? Type;
          const typeMeta = FIELD_TYPES.find((t) => t.value === field.type);
          const isExpanded = expandedKey === field.key;
          return (
            <div key={field.key} className={cn("rounded-xl border transition-all", isExpanded ? "border-indigo-200 bg-indigo-50/30" : "border-gray-100 bg-gray-50")}>
              {/* Collapsed row */}
              <div className="flex items-center gap-3 p-3 group">
                <GripVertical className="h-4 w-4 text-gray-300 flex-shrink-0 cursor-grab" />
                <div className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center shrink-0">
                  <FieldIcon className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpandedKey(isExpanded ? null : field.key)}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-800 truncate">{field.label}</span>
                    {field.required && <span className="text-[10px] text-red-500 font-bold bg-red-50 px-1.5 py-0.5 rounded">required</span>}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <code className="text-[10px] text-gray-500 font-mono bg-gray-200 px-1.5 py-0.5 rounded">{field.key}</code>
                    <span className="text-[10px] text-gray-400">{typeMeta?.label ?? field.type}</span>
                    {field.description && <span className="text-[10px] text-gray-400 truncate max-w-[120px]">· {field.description}</span>}
                  </div>
                </div>
                <button onClick={() => setExpandedKey(isExpanded ? null : field.key)}
                  className="h-6 w-6 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors text-gray-400 shrink-0">
                  <ChevronRight className={cn("h-3.5 w-3.5 transition-transform", isExpanded && "rotate-90")} />
                </button>
                <button onClick={() => removeField(field.key)}
                  className="h-6 w-6 rounded-lg hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shrink-0">
                  <Trash2 className="h-3.5 w-3.5 text-red-400" />
                </button>
              </div>

              {/* Expanded editor */}
              {isExpanded && (
                <div className="px-4 pb-4 space-y-3 border-t border-indigo-100 pt-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Label</label>
                      <input value={field.label} onChange={(e) => updateField(field.key, { label: e.target.value })}
                        className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Type</label>
                      <select value={field.type} onChange={(e) => updateField(field.key, { type: e.target.value as FieldDef["type"] })}
                        className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400">
                        {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Placeholder</label>
                    <input value={field.placeholder ?? ""} onChange={(e) => updateField(field.key, { placeholder: e.target.value || undefined })}
                      placeholder="Hint shown inside the input"
                      className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Description / Help text</label>
                    <input value={field.description ?? ""} onChange={(e) => updateField(field.key, { description: e.target.value || undefined })}
                      placeholder="Shown below the input to guide editors"
                      className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                  </div>
                  {["select", "multiselect"].includes(field.type) && (
                    <div>
                      <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Options (comma-separated)</label>
                      <input
                        value={(field.options ?? []).join(", ")}
                        onChange={(e) => updateField(field.key, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })}
                        placeholder="Option A, Option B, Option C"
                        className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      {(field.options ?? []).length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {(field.options ?? []).map((o) => (
                            <span key={o} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">{o}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {field.type === "number" && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Min</label>
                        <input type="number" value={field.min ?? ""} onChange={(e) => updateField(field.key, { min: e.target.value ? Number(e.target.value) : undefined })}
                          className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Max</label>
                        <input type="number" value={field.max ?? ""} onChange={(e) => updateField(field.key, { max: e.target.value ? Number(e.target.value) : undefined })}
                          className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                      </div>
                    </div>
                  )}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={field.required ?? false}
                      onChange={(e) => updateField(field.key, { required: e.target.checked })}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                    <span className="text-sm text-gray-700 font-medium">Required field</span>
                  </label>
                </div>
              )}
            </div>
          );
        })}

        {/* Add field */}
        {addingField ? (
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold text-indigo-700">New Field</p>
              <button onClick={() => { setAddingField(false); setPickerOpen(false); setNewField({ type: "text" }); setNewFieldOptionsText(""); }}
                className="h-6 w-6 rounded-lg hover:bg-indigo-200 flex items-center justify-center transition-colors">
                <X className="h-3.5 w-3.5 text-indigo-500" />
              </button>
            </div>

            {/* Field type picker */}
            {pickerOpen ? (
              <div className="space-y-3 bg-white rounded-xl p-3 border border-indigo-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Pick a field type</p>
                {groupedTypes.map(([group, types]) => (
                  <div key={group}>
                    <p className="text-[10px] text-gray-400 font-semibold mb-1.5 uppercase tracking-wide">{FIELD_GROUP_LABELS[group] ?? group}</p>
                    <div className="grid grid-cols-2 gap-1">
                      {(types as FieldTypeMeta[]).map((t) => {
                        const Icon = t.icon;
                        const isActive = newField.type === t.value;
                        return (
                          <button key={t.value} type="button"
                            onClick={() => { setNewField((p) => ({ ...p, type: t.value })); setPickerOpen(false); }}
                            className={cn(
                              "flex items-center gap-2 px-2.5 py-2 rounded-lg border text-left transition-all",
                              isActive ? "border-indigo-400 bg-indigo-600 text-white" : "border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50"
                            )}>
                            <Icon className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-white" : "text-gray-500")} />
                            <div className="min-w-0">
                              <p className={cn("text-[11px] font-semibold leading-none", isActive ? "text-white" : "text-gray-700")}>{t.label}</p>
                              <p className={cn("text-[9px] mt-0.5 leading-none truncate", isActive ? "text-indigo-200" : "text-gray-400")}>{t.description}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Field Type</label>
                <button type="button" onClick={() => setPickerOpen(true)}
                  className="mt-1 w-full flex items-center gap-2.5 h-9 px-3 rounded-lg border border-indigo-200 bg-white text-sm text-left hover:border-indigo-400 transition-colors">
                  {(() => {
                    const meta = FIELD_TYPES.find((t) => t.value === newField.type);
                    const Icon = meta?.icon ?? Type;
                    return (
                      <>
                        <Icon className="h-4 w-4 text-indigo-500 shrink-0" />
                        <span className="flex-1 font-medium text-gray-700">{meta?.label ?? "Short Text"}</span>
                        <span className="text-[10px] text-gray-400">{meta?.description}</span>
                        <ChevronRight className="h-3.5 w-3.5 text-gray-400 rotate-90" />
                      </>
                    );
                  })()}
                </button>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Label</label>
                <input value={newField.label ?? ""} autoFocus
                  onChange={(e) => setNewField((p) => ({
                    ...p, label: e.target.value,
                    key: e.target.value.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, ""),
                  }))}
                  placeholder="e.g. Post Title"
                  className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Key</label>
                <input value={newField.key ?? ""}
                  onChange={(e) => setNewField((p) => ({ ...p, key: e.target.value }))}
                  placeholder="post_title"
                  className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-indigo-400" />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Placeholder (optional)</label>
              <input value={newField.placeholder ?? ""}
                onChange={(e) => setNewField((p) => ({ ...p, placeholder: e.target.value }))}
                placeholder="Hint text inside the input"
                className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Help text (optional)</label>
              <input value={newField.description ?? ""}
                onChange={(e) => setNewField((p) => ({ ...p, description: e.target.value }))}
                placeholder="Guidance for editors"
                className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>

            {["select", "multiselect"].includes(newField.type ?? "") && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Options (comma-separated)</label>
                <input value={newFieldOptionsText}
                  onChange={(e) => setNewFieldOptionsText(e.target.value)}
                  placeholder="Option A, Option B, Option C"
                  className="mt-1 w-full h-8 px-2.5 rounded-lg border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400" />
                {newFieldOptionsText && (
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {newFieldOptionsText.split(",").map((s) => s.trim()).filter(Boolean).map((opt) => (
                      <span key={opt} className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 font-medium">{opt}</span>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={newField.required ?? false}
                  onChange={(e) => setNewField((p) => ({ ...p, required: e.target.checked }))}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600" />
                <span className="text-sm text-gray-700">Required</span>
              </label>
              <Button size="sm" onClick={addField} disabled={!newField.key?.trim()} className="h-8 text-xs px-4">
                Add Field
              </Button>
            </div>
          </div>
        ) : (
          <button onClick={() => setAddingField(true)}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 text-gray-400 hover:text-indigo-500 text-sm font-medium transition-all">
            <Plus className="h-4 w-4" /> Add Field
          </button>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100">
        <Button onClick={save} disabled={saving} className="w-full">
          {saving ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Saving…</> : <><Save className="h-4 w-4 mr-2" />Save Schema</>}
        </Button>
      </div>
    </div>
  );
}

// ── Item editor (right panel) ──────────────────────────────────────────────────

function ItemPanel({
  collection,
  item,
  onClose,
  onSave,
}: {
  collection: Collection;
  item: CmsItem | null;
  onClose: () => void;
  onSave: (data: Record<string, unknown>, status: "published" | "draft") => Promise<void>;
}) {
  const isNew = !item;
  const [formData, setFormData] = useState<Record<string, unknown>>(item?.data ?? {});
  const [status, setStatus] = useState<"published" | "draft">(item?.status ?? "draft");
  const [saving, setSaving] = useState(false);

  // If schema has fields, use them; otherwise use keys from existing data
  const fields: FieldDef[] = collection.fields?.length > 0
    ? collection.fields
    : Object.keys(formData).map((k) => ({ key: k, label: k, type: "text" as const }));

  // Dynamic add-field for schemaless collections
  const [newKey, setNewKey] = useState("");
  const isSchemaless = !collection.fields?.length;

  const setField = (key: string, value: unknown) => setFormData((p) => ({ ...p, [key]: value }));

  const addDynamicField = () => {
    const k = newKey.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (!k || formData[k] !== undefined) return;
    setFormData((p) => ({ ...p, [k]: "" }));
    setNewKey("");
  };

  const removeDynamicField = (key: string) => {
    setFormData((p) => {
      const next = { ...p };
      delete next[key];
      return next;
    });
  };

  const save = async () => {
    setSaving(true);
    try { await onSave(formData, status); } finally { setSaving(false); }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div>
          <h2 className="text-sm font-bold text-gray-900">{isNew ? "New Item" : "Edit Item"}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{collection.name}</p>
        </div>
        <button onClick={onClose} className="h-7 w-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
          <X className="h-4 w-4 text-gray-400" />
        </button>
      </div>

      {/* Status toggle */}
      <div className="px-5 py-3 border-b border-gray-100 bg-gray-50/50">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-gray-500">Status</span>
          <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg">
            {(["draft", "published"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "px-3 py-1 rounded-md text-xs font-semibold transition-all capitalize",
                  status === s
                    ? s === "published" ? "bg-emerald-500 text-white shadow-sm" : "bg-white text-gray-700 shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {isSchemaless && Object.keys(formData).length === 0 && (
          <div className="text-center py-6 text-gray-400">
            <AlertCircle className="h-7 w-7 mx-auto mb-2 opacity-40" />
            <p className="text-sm">No schema defined</p>
            <p className="text-xs mt-1">Add fields below or define a schema first</p>
          </div>
        )}

        {/* Schema-based fields */}
        {fields.map((field) => {
          const FieldIcon = FIELD_TYPE_ICONS[field.type] ?? Type;
          return (
            <div key={field.key}>
              <div className="flex items-center justify-between mb-1.5">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
                  <FieldIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  {field.label}
                  {field.required && <span className="text-red-400">*</span>}
                </label>
                <code className="text-[10px] text-gray-400 font-mono bg-gray-100 px-1.5 py-0.5 rounded">{field.key}</code>
              </div>
              <FieldInput fieldDef={field} value={formData[field.key]} onChange={(v) => setField(field.key, v)} />
              {field.description && (
                <p className="text-[11px] text-gray-400 mt-1.5 leading-snug">{field.description}</p>
              )}
            </div>
          );
        })}

        {/* Dynamic fields for schemaless */}
        {isSchemaless && Object.keys(formData).length > 0 && (
          <>
            {Object.keys(formData).map((key) => (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-semibold text-gray-700 font-mono">{key}</label>
                  <button onClick={() => removeDynamicField(key)} className="text-[10px] text-red-400 hover:text-red-600">remove</button>
                </div>
                <FieldInput
                  fieldDef={{ key, label: key, type: "text" }}
                  value={formData[key]}
                  onChange={(v) => setField(key, v)}
                />
              </div>
            ))}
          </>
        )}

        {/* Add dynamic field */}
        {isSchemaless && (
          <div className="flex gap-2">
            <input
              value={newKey}
              onChange={(e) => setNewKey(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addDynamicField()}
              placeholder="field_name"
              className="flex-1 h-8 px-2.5 rounded-lg border border-dashed border-gray-200 bg-gray-50 text-xs font-mono text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <Button size="sm" variant="outline" onClick={addDynamicField} className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Field
            </Button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-gray-100 flex gap-2">
        <Button onClick={save} disabled={saving} className="flex-1">
          {saving ? <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Saving…</> : <><Save className="h-4 w-4 mr-2" />{isNew ? "Create Item" : "Save Changes"}</>}
        </Button>
        <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
      </div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function CollectionItemsPage({
  params,
}: {
  params: { collectionId: string };
}) {
  const collectionId = params.collectionId;

  const [collection, setCollection] = useState<Collection | null>(null);
  const [items, setItems] = useState<CmsItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingItems, setLoadingItems] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const limit = 20;

  const [panel, setPanel] = useState<"add" | "edit" | "schema" | null>(null);
  const [editingItem, setEditingItem] = useState<CmsItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; title: string } | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const searchRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load collection metadata
  const loadCollection = useCallback(async () => {
    try {
      const res = await fetch(`/api/v1/cms/collections/${collectionId}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCollection(json.collection);
    } catch (e) {
      toast.error((e as Error).message);
    }
  }, [collectionId]);

  // Load items
  const loadItems = useCallback(async (p = 1, q = "", sf = statusFilter) => {
    setLoadingItems(true);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(limit) });
      if (sf !== "all") params.set("status", sf);
      if (q) params.set("q", q);
      const res = await fetch(`/api/v1/cms/collections/${collectionId}/items?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setItems(json.items ?? []);
      setTotal(json.total ?? 0);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setLoadingItems(false);
      setLoading(false);
    }
  }, [collectionId, statusFilter]);

  useEffect(() => {
    loadCollection();
    loadItems(1, "", "all");
    // Auto-open panel from URL query params
    const sp = new URLSearchParams(window.location.search);
    const action = sp.get("action");
    const panelParam = sp.get("panel");
    if (action === "add") { setPanel("add"); setEditingItem(null); }
    else if (panelParam === "schema") setPanel("schema");
  }, [collectionId]);

  // Debounced search
  useEffect(() => {
    if (searchRef.current) clearTimeout(searchRef.current);
    searchRef.current = setTimeout(() => {
      setPage(1);
      loadItems(1, search, statusFilter);
    }, 300);
    return () => { if (searchRef.current) clearTimeout(searchRef.current); };
  }, [search]);

  const handleStatusFilter = (sf: StatusFilter) => {
    setStatusFilter(sf);
    setPage(1);
    setSelectedIds(new Set());
    loadItems(1, search, sf);
  };

  const handlePage = (p: number) => {
    setPage(p);
    loadItems(p, search, statusFilter);
  };

  // Save item (create or update)
  const saveItem = async (data: Record<string, unknown>, status: "published" | "draft") => {
    if (!editingItem && panel === "add") {
      const res = await fetch(`/api/v1/cms/collections/${collectionId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, status }),
      });
      if (!res.ok) { toast.error((await res.json()).error); return; }
      toast.success("Item created");
    } else if (editingItem) {
      const res = await fetch(`/api/v1/cms/collections/${collectionId}/items/${editingItem.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, status }),
      });
      if (!res.ok) { toast.error((await res.json()).error); return; }
      toast.success("Item saved");
    }
    setPanel(null);
    setEditingItem(null);
    await loadCollection();
    await loadItems(page, search, statusFilter);
  };

  // Quick status toggle
  const toggleStatus = async (item: CmsItem) => {
    const newStatus = item.status === "published" ? "draft" : "published";
    const res = await fetch(`/api/v1/cms/collections/${collectionId}/items/${item.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    if (!res.ok) { toast.error((await res.json()).error); return; }
    toast.success(newStatus === "published" ? "Published" : "Moved to draft");
    await loadCollection();
    await loadItems(page, search, statusFilter);
  };

  // Delete item
  const deleteItem = async (id: string) => {
    const res = await fetch(`/api/v1/cms/collections/${collectionId}/items/${id}`, { method: "DELETE" });
    if (!res.ok) { toast.error((await res.json()).error); return; }
    toast.success("Item deleted");
    setSelectedIds((p) => { const n = new Set(p); n.delete(id); return n; });
    await loadCollection();
    await loadItems(page, search, statusFilter);
  };

  // Bulk delete
  const bulkDelete = async () => {
    const ids = [...selectedIds];
    await Promise.all(ids.map((id) =>
      fetch(`/api/v1/cms/collections/${collectionId}/items/${id}`, { method: "DELETE" })
    ));
    toast.success(`${ids.length} items deleted`);
    setSelectedIds(new Set());
    await loadCollection();
    await loadItems(page, search, statusFilter);
  };

  // Save schema
  const saveSchema = async (fields: FieldDef[]) => {
    const res = await fetch(`/api/v1/cms/collections/${collectionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields }),
    });
    if (!res.ok) { toast.error((await res.json()).error); return; }
    toast.success("Schema saved");
    setPanel(null);
    await loadCollection();
  };

  const openEdit = (item: CmsItem) => {
    setEditingItem(item);
    setPanel("edit");
  };

  const openAdd = () => {
    setEditingItem(null);
    setPanel("add");
  };

  const totalPages = Math.ceil(total / limit);
  const allSelected = items.length > 0 && selectedIds.size === items.length;

  const toggleAll = () =>
    setSelectedIds(allSelected ? new Set() : new Set(items.map((i) => i.id)));

  if (loading) {
    return (
      <div className="p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-9 w-9 rounded-lg bg-gray-100 animate-pulse" />
          <div className="h-9 w-9 rounded-lg bg-gray-100 animate-pulse" />
          <div className="flex-1 space-y-1.5">
            <div className="h-5 bg-gray-100 rounded w-40 animate-pulse" />
            <div className="h-3.5 bg-gray-100 rounded w-24 animate-pulse" />
          </div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-4 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (!collection) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[50vh]">
        <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
        <p className="text-lg font-semibold text-gray-900">Collection not found</p>
        <Link href="/dashboard/cms" className="mt-4 text-sm text-indigo-600 hover:underline">← Back to CMS</Link>
      </div>
    );
  }

  return (
    <div className="flex h-full min-h-screen">
      {/* Main content */}
      <div className={cn("flex-1 p-6 lg:p-8 min-w-0 transition-all duration-300", panel && "lg:mr-[420px]")}>
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link href="/dashboard/cms">
              <button className="h-9 w-9 rounded-xl border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors">
                <ArrowLeft className="h-4 w-4 text-gray-600" />
              </button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                <FileText className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">{collection.name}</h1>
                <p className="text-xs text-gray-500 mt-0.5">
                  {collection.itemCount} item{collection.itemCount !== 1 ? "s" : ""}
                  <span className="mx-1.5 text-gray-300">·</span>
                  <span className="text-emerald-600">{collection.publishedCount} published</span>
                  {collection.draftCount > 0 && (
                    <><span className="mx-1.5 text-gray-300">·</span>
                      <span className="text-amber-600">{collection.draftCount} drafts</span></>
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline" size="sm"
              onClick={() => {
                navigator.clipboard.writeText(collection.slug);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
                toast.success("Slug copied to clipboard");
              }}
              className="gap-2 h-9"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              <span className="hidden sm:inline">Copy Slug</span>
            </Button>
            <Button
              variant="outline" size="sm"
              onClick={() => setPanel(panel === "schema" ? null : "schema")}
              className={cn("gap-2 h-9", panel === "schema" && "border-indigo-300 bg-indigo-50 text-indigo-700")}
            >
              <Settings className="h-4 w-4" /> Schema
            </Button>
            <Button onClick={openAdd} className="gap-2 h-9">
              <Plus className="h-4 w-4" /> New Item
            </Button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              placeholder="Search items…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 h-9 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder:text-gray-400"
            />
          </div>

          <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1">
            {(["all", "published", "draft"] as StatusFilter[]).map((sf) => (
              <button
                key={sf}
                onClick={() => handleStatusFilter(sf)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all capitalize",
                  statusFilter === sf
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-400 hover:text-gray-700"
                )}
              >
                {sf}
              </button>
            ))}
          </div>

          {loadingItems && <RefreshCw className="h-4 w-4 text-gray-400 animate-spin flex-shrink-0" />}
        </div>

        {/* Bulk actions */}
        {selectedIds.size > 0 && (
          <div className="flex items-center gap-3 mb-4 px-4 py-2.5 bg-indigo-50 border border-indigo-200 rounded-xl">
            <span className="text-sm font-medium text-indigo-700">{selectedIds.size} selected</span>
            <button
              onClick={bulkDelete}
              className="flex items-center gap-1.5 text-sm font-medium text-red-600 hover:text-red-700 ml-auto"
            >
              <Trash2 className="h-4 w-4" /> Delete selected
            </button>
            <button onClick={() => setSelectedIds(new Set())} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Items table */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {items.length === 0 && !loadingItems ? (
            <div className="py-16 text-center">
              <FileText className="h-10 w-10 mx-auto text-gray-200 mb-3" />
              <p className="text-sm font-medium text-gray-500">
                {search || statusFilter !== "all" ? "No items match your filters" : "No items yet"}
              </p>
              <p className="text-xs text-gray-400 mt-1 mb-5">
                {search || statusFilter !== "all"
                  ? "Try adjusting your search or filter"
                  : "Add your first item to get started"}
              </p>
              {!search && statusFilter === "all" && (
                <Button onClick={openAdd} size="sm">
                  <Plus className="h-4 w-4 mr-2" /> Add First Item
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="w-10 px-4 py-3">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={toggleAll}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide w-12"></th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Item</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                    <th className="px-4 py-3 text-left text-[11px] font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Updated</th>
                    <th className="px-4 py-3 text-right text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {items.map((item) => {
                    const title = getItemTitle(item, collection.fields ?? []);
                    const preview = getItemPreview(item, collection.fields ?? []);
                    return (
                      <tr
                        key={item.id}
                        className={cn(
                          "hover:bg-gray-50/50 transition-colors group",
                          selectedIds.has(item.id) && "bg-indigo-50/30"
                        )}
                      >
                        <td className="px-4 py-3.5">
                          <input
                            type="checkbox"
                            checked={selectedIds.has(item.id)}
                            onChange={() => setSelectedIds((p) => {
                              const n = new Set(p);
                              n.has(item.id) ? n.delete(item.id) : n.add(item.id);
                              return n;
                            })}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                        </td>
                        <td className="px-4 py-3.5">
                          {(() => {
                            // 1. Try to find an explicit image field first
                            const imgField = collection.fields?.find(f => f.type === "image")?.key;
                            let imgUrl = imgField ? String(item.data[imgField] || "") : null;

                            // 2. Fallback to common image field names if not found or empty
                            if (!imgUrl) {
                              for (const k of ["image", "thumbnail", "photo", "pic", "cover", "picture", "avatar"]) {
                                if (item.data[k] && typeof item.data[k] === "string" && String(item.data[k]).startsWith("http")) {
                                  imgUrl = String(item.data[k]);
                                  break;
                                }
                              }
                            }

                            if (!imgUrl) return <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center"><Image className="h-4 w-4 text-gray-300" /></div>;

                            return (
                              <div className="h-10 w-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                <img src={imgUrl} className="h-full w-full object-cover"
                                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = ""; (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                              </div>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-3.5">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-xs">{title}</p>
                          {preview && <p className="text-xs text-gray-400 truncate max-w-xs mt-0.5">{preview}</p>}
                        </td>
                        <td className="px-4 py-3.5">
                          <button
                            onClick={() => toggleStatus(item)}
                            className={cn(
                              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all",
                              item.status === "published"
                                ? "text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100"
                                : "text-amber-700 bg-amber-50 border-amber-200 hover:bg-amber-100"
                            )}
                            title="Click to toggle status"
                          >
                            <span className={cn("h-1.5 w-1.5 rounded-full", item.status === "published" ? "bg-emerald-500" : "bg-amber-400")} />
                            {item.status}
                          </button>
                        </td>
                        <td className="px-4 py-3.5 hidden sm:table-cell">
                          <span className="text-xs text-gray-400" suppressHydrationWarning>{timeAgo(item.updated_at)}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEdit(item)}
                              className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                              title="Edit"
                            >
                              <Pencil className="h-3.5 w-3.5 text-gray-400" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ id: item.id, title })}
                              className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                              title="Delete"
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3.5 border-t border-gray-100 bg-gray-50/40">
              <p className="text-xs text-gray-500">
                {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total} items
              </p>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handlePage(page - 1)}
                  disabled={page === 1}
                  className="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center disabled:opacity-40 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4 text-gray-500" />
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const p = totalPages <= 5 ? i + 1 : Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePage(p)}
                      className={cn(
                        "h-8 w-8 rounded-lg text-xs font-semibold transition-colors",
                        p === page
                          ? "bg-indigo-600 text-white shadow-sm"
                          : "border border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => handlePage(page + 1)}
                  disabled={page >= totalPages}
                  className="h-8 w-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center disabled:opacity-40 transition-colors"
                >
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right panel */}
      {panel && (
        <>
          {/* Overlay on mobile */}
          <div
            className="fixed inset-0 bg-black/20 z-30 lg:hidden"
            onClick={() => { setPanel(null); setEditingItem(null); }}
          />
          <div className="fixed right-0 top-0 bottom-0 w-full max-w-[420px] bg-white border-l border-gray-200 z-40 shadow-xl flex flex-col">
            {panel === "schema" && (
              <SchemaPanel
                collection={collection}
                onClose={() => setPanel(null)}
                onSave={saveSchema}
              />
            )}
            {(panel === "add" || panel === "edit") && (
              <ItemPanel
                collection={collection}
                item={panel === "edit" ? editingItem : null}
                onClose={() => { setPanel(null); setEditingItem(null); }}
                onSave={saveItem}
              />
            )}
          </div>
        </>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title={`Delete "${deleteConfirm?.title}"?`}
        description="This item will be permanently deleted and cannot be recovered."
        confirmLabel="Delete Item"
        onConfirm={() => {
          if (deleteConfirm) deleteItem(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
