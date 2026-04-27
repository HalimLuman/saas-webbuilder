"use client";

/**
 * BackendPanel — unified backend configuration panel.
 *
 * Three tabs:
 *   Auth       — enable auth, pick provider, credentials, sign-in methods, page routing
 *   Database   — live CRUD collections + data browser + API key
 *   Schema     — SQL schema designer (generates copy-paste SQL for Supabase)
 */

import React, { useState, useEffect, useCallback } from "react";
import {
  Shield, Database, Table2, Key, Plus, Trash2,
  ChevronDown, ChevronRight, Check, Eye, EyeOff,
  Copy, RefreshCw, Loader2, AlertCircle, Save,
  Pencil, X, Info, Columns3, Zap, Globe, BarChart3,
} from "lucide-react";
import type { BackendAction, BackendActionType, DataSource, SiteRoute } from "@/lib/types";
import { nanoid } from "nanoid";
import { useSiteStore } from "@/store/site-store";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import { generateId } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { SiteAuthConfig, SiteAuthProvider } from "@/lib/types";
import type { SchemaTable, SchemaColumn, SchemaColumnType, SchemaRLSPolicy, SiteSchema } from "@/lib/types";
import { generateSchemaSQL, generateTableSQL, COLUMN_TYPES, RLS_POLICIES } from "@/lib/sql-generator";

// ─────────────────────────────────────────────────────────────────────────────
// Shared primitives
// ─────────────────────────────────────────────────────────────────────────────

function fieldLabel(text: string) {
  return (
    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">{text}</p>
  );
}

function inputCls(extra = "") {
  return cn(
    "w-full px-2.5 py-2 text-[12px] border border-gray-200 rounded-xl bg-white",
    "focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-300 transition-all",
    extra
  );
}

function PanelSection({
  title, children, defaultOpen = true,
}: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/60 transition-colors"
      >
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{title}</span>
        {open
          ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          : <ChevronRight className="w-3.5 h-3.5 text-gray-400" />}
      </button>
      {open && <div className="px-4 pb-4 flex flex-col gap-3">{children}</div>}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={cn(
        "relative w-9 h-5 rounded-full transition-colors shrink-0",
        checked ? "bg-indigo-500" : "bg-gray-300"
      )}
    >
      <div className={cn(
        "absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all",
        checked ? "left-[18px]" : "left-0.5"
      )} />
    </button>
  );
}

function InfoBox({ children, color = "blue" }: { children: React.ReactNode; color?: "blue" | "amber" }) {
  const cls = color === "amber"
    ? "bg-amber-50 border-amber-200 text-amber-800"
    : "bg-blue-50 border-blue-200 text-blue-800";
  return (
    <div className={cn("flex gap-2 p-3 rounded-xl border text-[11px] leading-relaxed", cls)}>
      <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
      <span>{children}</span>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1 — AUTH
// ─────────────────────────────────────────────────────────────────────────────

const AUTH_PROVIDERS: { id: SiteAuthProvider; label: string; icon: string; desc: string }[] = [
  { id: "supabase", label: "Supabase",    icon: "⚡", desc: "Easiest — use your Supabase project" },
  { id: "firebase", label: "Firebase",    icon: "🔥", desc: "Google Firebase Authentication" },
  { id: "custom",   label: "Custom REST", icon: "🔧", desc: "Bring your own auth endpoints" },
];

const SIGN_IN_METHODS = [
  { id: "email"       as const, label: "Email + Password" },
  { id: "google"      as const, label: "Google OAuth" },
  { id: "github"      as const, label: "GitHub OAuth" },
  { id: "magic-link"  as const, label: "Magic Link (passwordless)" },
];

function MaskedInput({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      {fieldLabel(label)}
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls("pr-8")}
        />
        <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
          {show ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
}

function AuthTab({ siteId }: { siteId: string }) {
  const getSiteById = useSiteStore((s) => s.getSiteById);
  const updateSite  = useSiteStore((s) => s.updateSite);
  const site        = getSiteById(siteId);
  const sitePages   = site?.pages?.map((p) => ({ name: p.name, slug: p.slug })) ?? [];

  const [cfg,   setCfg]   = useState<SiteAuthConfig>(() => site?.authConfig ?? { provider: "none", enabled: false, allowedProviders: ["email"] });
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (site?.authConfig) setCfg(site.authConfig); }, [site?.authConfig]);

  const update = (partial: Partial<SiteAuthConfig>) => { setCfg((prev) => ({ ...prev, ...partial })); setSaved(false); };
  const toggleMethod = (id: NonNullable<SiteAuthConfig["allowedProviders"]>[number]) => {
    const curr = cfg.allowedProviders ?? [];
    update({ allowedProviders: curr.includes(id) ? curr.filter((p) => p !== id) : [...curr, id] });
  };

  function save() {
    updateSite(siteId, { authConfig: cfg });
    fetch(`/api/v1/sites/${siteId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ auth_config: cfg }),
    }).catch(console.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      {/* Enable toggle */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div>
          <p className="text-[12px] font-semibold text-gray-800">Enable Authentication</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Let visitors sign in / sign up</p>
        </div>
        <Toggle checked={cfg.enabled} onChange={() => update({ enabled: !cfg.enabled, provider: !cfg.enabled && cfg.provider === "none" ? "supabase" : cfg.provider })} />
      </div>

      {cfg.enabled && (
        <>
          {/* Provider */}
          <PanelSection title="Provider">
            <div className="flex flex-col gap-2">
              {AUTH_PROVIDERS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => update({ provider: p.id })}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border text-left transition-all",
                    cfg.provider === p.id
                      ? "border-indigo-300 bg-indigo-50 shadow-sm shadow-indigo-100"
                      : "border-gray-100 bg-gray-50 hover:border-gray-200 hover:bg-white"
                  )}
                >
                  <span className="text-xl leading-none shrink-0">{p.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-bold text-gray-800">{p.label}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{p.desc}</p>
                  </div>
                  {cfg.provider === p.id && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                </button>
              ))}
            </div>
          </PanelSection>

          {/* Credentials */}
          {cfg.provider === "supabase" && (
            <PanelSection title="Supabase Credentials">
              <InfoBox color="amber">
                Use your <strong>Project URL</strong> and <strong>anon public key</strong> from Supabase → Project Settings → API.
              </InfoBox>
              <div>
                {fieldLabel("Project URL")}
                <input value={cfg.supabase?.url ?? ""} onChange={(e) => update({ supabase: { ...cfg.supabase, url: e.target.value, anonKey: cfg.supabase?.anonKey ?? "" } })} placeholder="https://xxxx.supabase.co" className={inputCls()} />
              </div>
              <MaskedInput label="Anon Public Key" value={cfg.supabase?.anonKey ?? ""} onChange={(v) => update({ supabase: { url: cfg.supabase?.url ?? "", anonKey: v } })} placeholder="eyJhbGciOiJIUzI1NiIs..." />
            </PanelSection>
          )}

          {cfg.provider === "firebase" && (
            <PanelSection title="Firebase Credentials">
              {(["apiKey", "authDomain", "projectId"] as const).map((field) => (
                <div key={field}>
                  {fieldLabel(field.replace(/([A-Z])/g, " $1"))}
                  <input value={cfg.firebase?.[field] ?? ""} onChange={(e) => update({ firebase: { apiKey: "", authDomain: "", projectId: "", ...cfg.firebase, [field]: e.target.value } })} placeholder={field === "apiKey" ? "AIzaSy..." : field === "authDomain" ? "app.firebaseapp.com" : "your-project-id"} className={inputCls()} />
                </div>
              ))}
            </PanelSection>
          )}

          {cfg.provider === "custom" && (
            <PanelSection title="Custom REST Endpoints">
              <InfoBox>Each URL must accept <code className="bg-blue-100 px-1 rounded">POST</code> and return <code className="bg-blue-100 px-1 rounded">{"{ user, accessToken, expiresAt }"}</code>.</InfoBox>
              {(["signInUrl", "signUpUrl", "signOutUrl", "sessionUrl"] as const).map((field) => (
                <div key={field}>
                  {fieldLabel(field.replace(/([A-Z])/g, " $1").replace("Url", " URL"))}
                  <input value={cfg.custom?.[field] ?? ""} onChange={(e) => update({ custom: { signInUrl: "", signUpUrl: "", signOutUrl: "", sessionUrl: "", ...cfg.custom, [field]: e.target.value } })} placeholder="https://api.example.com/auth/..." className={inputCls()} />
                </div>
              ))}
            </PanelSection>
          )}

          {/* Sign-in methods */}
          <PanelSection title="Sign-In Methods">
            <div className="flex flex-col gap-1.5">
              {SIGN_IN_METHODS.map((opt) => {
                const active = (cfg.allowedProviders ?? []).includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    onClick={() => toggleMethod(opt.id)}
                    className={cn(
                      "flex items-center justify-between px-3 py-2.5 rounded-xl border transition-all",
                      active ? "border-indigo-200 bg-indigo-50/60" : "border-gray-100 bg-gray-50 hover:bg-white hover:border-gray-200"
                    )}
                  >
                    <span className={cn("text-[12px] font-medium", active ? "text-indigo-700" : "text-gray-600")}>{opt.label}</span>
                    <div className={cn("w-4 h-4 rounded-md border-2 flex items-center justify-center transition-all", active ? "bg-indigo-600 border-indigo-600" : "border-gray-300")}>
                      {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>
          </PanelSection>

          {/* Auth pages */}
          <PanelSection title="Auth Pages">
            {(["signInPageSlug", "signUpPageSlug"] as const).map((field) => (
              <div key={field}>
                {fieldLabel(field === "signInPageSlug" ? "Sign-In Page" : "Sign-Up Page")}
                <select value={cfg[field] ?? ""} onChange={(e) => update({ [field]: e.target.value })} className={inputCls("cursor-pointer")}>
                  <option value="">— none —</option>
                  {sitePages.map((p) => <option key={p.slug} value={p.slug}>{p.name} ({p.slug})</option>)}
                </select>
                <p className="text-[10px] text-gray-400 mt-1">{field === "signInPageSlug" ? "Private pages redirect here when not signed in" : "Optional — link sign-in ↔ sign-up forms"}</p>
              </div>
            ))}
          </PanelSection>

          {/* Post-auth redirects */}
          <PanelSection title="Post-Auth Redirects" defaultOpen={false}>
            {(["redirectAfterSignIn", "redirectAfterSignOut"] as const).map((field) => (
              <div key={field}>
                {fieldLabel(field === "redirectAfterSignIn" ? "After Sign-In" : "After Sign-Out")}
                <select value={cfg[field] ?? ""} onChange={(e) => update({ [field]: e.target.value })} className={inputCls("cursor-pointer")}>
                  <option value="">— none —</option>
                  {sitePages.map((p) => <option key={p.slug} value={p.slug}>{p.name} ({p.slug})</option>)}
                </select>
              </div>
            ))}
          </PanelSection>
        </>
      )}

      {/* Save */}
      <div className="px-4 py-3 border-t border-gray-100 mt-auto shrink-0">
        <button
          onClick={save}
          className={cn(
            "w-full py-2.5 rounded-xl font-bold text-[12px] text-white flex items-center justify-center gap-2 transition-all",
            saved ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700"
          )}
        >
          {saved ? <><Check className="w-3.5 h-3.5" /> Saved!</> : "Save Auth Settings"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2 — DATABASE
// ─────────────────────────────────────────────────────────────────────────────

type FieldType = "text" | "number" | "boolean" | "date" | "email" | "url" | "select" | "richtext";

interface CollectionField { name: string; type: FieldType; required: boolean; options?: string[] }
interface Collection { id: string; name: string; slug: string; description: string; fields: CollectionField[]; itemCount: number; publishedCount: number; draftCount: number }
interface CmsItem { id: string; data: Record<string, unknown>; status: string; created_at: string; updated_at: string }

const FIELD_TYPES: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" }, { value: "number", label: "Number" },
  { value: "boolean", label: "Boolean" }, { value: "date", label: "Date" },
  { value: "email", label: "Email" }, { value: "url", label: "URL" },
  { value: "select", label: "Select" }, { value: "richtext", label: "Rich Text" },
];

function renderVal(val: unknown, type: FieldType): React.ReactNode {
  if (val === undefined || val === null || val === "") return <span className="text-gray-300 italic text-[10px]">—</span>;
  if (type === "boolean") return <span className={cn("text-[10px] font-semibold", val ? "text-emerald-600" : "text-red-500")}>{val ? "true" : "false"}</span>;
  if (type === "date") return <span className="text-[11px] text-gray-600" suppressHydrationWarning>{new Date(String(val)).toLocaleDateString()}</span>;
  const s = String(val);
  return <span className="text-[11px] text-gray-700 truncate max-w-[110px] block" title={s}>{s}</span>;
}

function FieldValueInput({ field, value, onChange }: { field: CollectionField; value: unknown; onChange: (v: unknown) => void }) {
  const cls = inputCls();
  if (field.type === "boolean") {
    return (
      <button type="button" onClick={() => onChange(!value)} className="flex items-center gap-2 text-[12px] font-medium text-gray-700">
        <div className={cn("w-9 h-5 rounded-full transition-colors flex items-center px-0.5", value ? "bg-indigo-500" : "bg-gray-300")}>
          <div className={cn("w-4 h-4 rounded-full bg-white shadow transition-transform", value ? "translate-x-4" : "translate-x-0")} />
        </div>
        {value ? "true" : "false"}
      </button>
    );
  }
  if (field.type === "select" && field.options?.length) {
    return <select value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cls}>
      <option value="">— select —</option>
      {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>;
  }
  if (field.type === "richtext") return <textarea rows={3} value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} className={cn(cls, "resize-none")} />;
  return <input type={field.type === "number" ? "number" : field.type === "date" ? "date" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"} value={String(value ?? "")} onChange={(e) => onChange(field.type === "number" ? parseFloat(e.target.value) || 0 : e.target.value)} className={cls} />;
}

function NewFieldRow({ onAdd }: { onAdd: (f: CollectionField) => void }) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FieldType>("text");
  const [required, setReq] = useState(false);
  const [opts, setOpts] = useState("");
  function commit() {
    const n = name.trim().toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    if (!n) return;
    const f: CollectionField = { name: n, type, required };
    if (type === "select" && opts.trim()) f.options = opts.split(",").map((o) => o.trim()).filter(Boolean);
    onAdd(f); setName(""); setType("text"); setReq(false); setOpts("");
  }
  return (
    <div className="flex flex-col gap-2 p-3 rounded-xl border border-dashed border-indigo-200 bg-indigo-50/30">
      <div className="flex gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && commit()} placeholder="field_name" className={inputCls("flex-1")} />
        <select value={type} onChange={(e) => setType(e.target.value as FieldType)} className={inputCls("w-28")}>
          {FIELD_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
      </div>
      {type === "select" && <input value={opts} onChange={(e) => setOpts(e.target.value)} placeholder="Option A, Option B" className={inputCls()} />}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-[11px] text-gray-600 cursor-pointer select-none">
          <input type="checkbox" checked={required} onChange={(e) => setReq(e.target.checked)} className="w-3 h-3 accent-indigo-600" /> Required
        </label>
        <button onClick={commit} className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-3 h-3" /> Add field
        </button>
      </div>
    </div>
  );
}

function ItemModal({ collection, item, siteId, onClose, onSaved }: { collection: Collection; item?: CmsItem; siteId: string; onClose: () => void; onSaved: (i: CmsItem) => void }) {
  const [data, setData]     = useState<Record<string, unknown>>(() => item?.data ?? {});
  const [status, setStatus] = useState<"published" | "draft">(item?.status as "published" | "draft" ?? "published");
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState<string | null>(null);

  async function save() {
    setSaving(true); setErr(null);
    try {
      const url    = item ? `/api/v1/sites/${siteId}/db/${collection.slug}/${item.id}` : `/api/v1/sites/${siteId}/db/${collection.slug}`;
      const method = item ? "PUT" : "POST";
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ data, status }) });
      const json   = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Save failed");
      onSaved(json.item);
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Save failed"); } finally { setSaving(false); }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-[13px] font-bold text-gray-900">{item ? "Edit record" : `Add to ${collection.name}`}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {collection.fields.length === 0
            ? <p className="text-[12px] text-gray-400 text-center py-6">No fields defined yet.</p>
            : collection.fields.map((f) => (
              <div key={f.name}>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                  {f.name}{f.required && <span className="text-red-400 ml-0.5">*</span>}
                  <span className="ml-1 font-normal text-gray-300">({f.type})</span>
                </p>
                <FieldValueInput field={f} value={data[f.name]} onChange={(v) => setData((p) => ({ ...p, [f.name]: v }))} />
              </div>
            ))
          }
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">Status</p>
            <div className="flex gap-2">
              {(["published", "draft"] as const).map((s) => (
                <button key={s} onClick={() => setStatus(s)} className={cn("flex-1 py-2 rounded-xl text-[11px] font-semibold border transition-all", status === s ? s === "published" ? "bg-emerald-500 border-emerald-500 text-white" : "bg-amber-500 border-amber-500 text-white" : "border-gray-200 text-gray-500 hover:bg-gray-50")}>
                  {s}
                </button>
              ))}
            </div>
          </div>
          {err && <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-[11px] text-red-600"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{err}</div>}
        </div>
        <div className="flex items-center justify-end gap-2 px-5 py-3 border-t border-gray-100">
          <button onClick={onClose} className="px-3 py-2 rounded-xl border border-gray-200 text-[11px] font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={save} disabled={saving} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-[11px] font-semibold transition-colors disabled:opacity-50">
            {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CollectionView({ collection, siteId, onBack, onDeleted }: { collection: Collection; siteId: string; onBack: () => void; onDeleted: () => void }) {
  const [items, setItems]     = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [page, setPage]       = useState(1);
  const [total, setTotal]     = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [status, setStatus]   = useState<"all" | "published" | "draft">("all");
  const [editing, setEditing] = useState<CmsItem | "new" | null>(null);
  const [deleting, setDel]    = useState<string | null>(null);
  const [showDeleteCollectionConfirm, setShowDeleteCollectionConfirm] = useState(false);
  const limit = 20;

  const load = useCallback(async (p = 1, s = status) => {
    setLoading(true); setError(null);
    try {
      const res  = await fetch(`/api/v1/sites/${siteId}/db/${collection.slug}?status=${s}&page=${p}&limit=${limit}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setItems(json.items ?? []); setTotal(json.total ?? 0); setHasMore(json.hasMore ?? false); setPage(p);
    } catch (e: unknown) { setError(e instanceof Error ? e.message : "Load failed"); } finally { setLoading(false); }
  }, [siteId, collection.slug, status]);

  useEffect(() => { load(1, status); }, [load, status]);

  async function del(id: string) {
    setDel(id);
    await fetch(`/api/v1/sites/${siteId}/db/${collection.slug}/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
    setTotal((t) => t - 1);
    setDel(null);
  }

  async function deleteCollection() {
    await fetch(`/api/v1/cms/collections?collectionId=${collection.id}`, { method: "DELETE" });
    onDeleted();
  }

  function onSaved(saved: CmsItem) {
    if (editing === "new") { setItems((p) => [saved, ...p]); setTotal((t) => t + 1); }
    else { setItems((p) => p.map((i) => i.id === saved.id ? saved : i)); }
    setEditing(null);
  }

  const visCols = collection.fields.slice(0, 4);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Sub-header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 shrink-0">
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors"><ChevronRight className="w-4 h-4 rotate-180" /></button>
        <Table2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-gray-900 truncate">{collection.name}</p>
          <p className="text-[10px] text-gray-400">/{collection.slug} · {total} records</p>
        </div>
        <button onClick={() => setShowDeleteCollectionConfirm(true)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100 shrink-0">
        <div className="flex gap-1 flex-1">
          {(["all", "published", "draft"] as const).map((s) => (
            <button key={s} onClick={() => setStatus(s)} className={cn("px-2 py-1 text-[10px] font-semibold rounded-lg transition-all", status === s ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100")}>{s}</button>
          ))}
        </div>
        <button onClick={() => load(page)} className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all"><RefreshCw className="w-3 h-3" /></button>
        <button onClick={() => setEditing("new")} className="flex items-center gap-1 px-2.5 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] font-semibold hover:bg-indigo-700 transition-colors">
          <Plus className="w-3 h-3" /> New
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="flex items-center justify-center h-24 gap-2 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-[12px]">Loading…</span></div>
        ) : error ? (
          <div className="flex items-center gap-2 m-4 p-3 bg-red-50 rounded-xl text-[11px] text-red-600"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-center px-4">
            <Database className="w-8 h-8 text-gray-200" />
            <p className="text-[12px] font-medium text-gray-500">No records yet</p>
            <button onClick={() => setEditing("new")} className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-[11px] font-semibold hover:bg-indigo-700 transition-colors"><Plus className="w-3 h-3" />Add first record</button>
          </div>
        ) : (
          <table className="w-full text-[11px]">
            <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 z-10">
              <tr>
                <th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase w-6">#</th>
                {visCols.map((f) => <th key={f.name} className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase">{f.name}</th>)}
                <th className="px-3 py-2 text-left text-[9px] font-bold text-gray-400 uppercase">Status</th>
                <th className="w-14 px-3 py-2" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr key={item.id} className="border-b border-gray-50 hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-3 py-2.5 text-gray-400 text-[10px] tabular-nums">{(page - 1) * limit + idx + 1}</td>
                  {visCols.map((f) => <td key={f.name} className="px-3 py-2.5">{renderVal(item.data[f.name], f.type)}</td>)}
                  <td className="px-3 py-2.5">
                    <span className={cn("text-[9px] font-bold px-1.5 py-0.5 rounded-full", item.status === "published" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}>{item.status}</span>
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditing(item)} className="p-1 text-gray-400 hover:text-indigo-600 rounded transition-colors"><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => del(item.id)} disabled={deleting === item.id} className="p-1 text-gray-400 hover:text-red-500 rounded transition-colors">{deleting === item.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {(page > 1 || hasMore) && (
        <div className="flex items-center justify-between px-4 py-2 border-t border-gray-100 text-[11px] shrink-0">
          <button disabled={page <= 1} onClick={() => load(page - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-gray-600">← Prev</button>
          <span className="text-gray-400">Page {page}</span>
          <button disabled={!hasMore} onClick={() => load(page + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 text-gray-600">Next →</button>
        </div>
      )}

      {editing !== null && <ItemModal collection={collection} item={editing === "new" ? undefined : editing} siteId={siteId} onClose={() => setEditing(null)} onSaved={onSaved} />}

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

function CreateCollection({ siteId, onCreated, onCancel }: { siteId: string; onCreated: (c: Collection) => void; onCancel: () => void }) {
  const [name, setName]     = useState("");
  const [desc, setDesc]     = useState("");
  const [fields, setFields] = useState<CollectionField[]>([]);
  const [saving, setSaving] = useState(false);
  const [err, setErr]       = useState<string | null>(null);

  async function create() {
    if (!name.trim()) { setErr("Name is required"); return; }
    setSaving(true); setErr(null);
    try {
      const res  = await fetch("/api/v1/cms/collections", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: name.trim(), description: desc.trim(), fields, site_id: siteId }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Create failed");
      onCreated(json.collection);
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Create failed"); } finally { setSaving(false); }
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 shrink-0">
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><ChevronRight className="w-4 h-4 rotate-180" /></button>
        <p className="text-[12px] font-bold text-gray-900">New collection</p>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          {fieldLabel("Name *")}
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Products" className={inputCls()} />
        </div>
        <div>
          {fieldLabel("Description")}
          <input value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="Optional description" className={inputCls()} />
        </div>
        <div>
          {fieldLabel("Fields")}
          {fields.length > 0 && (
            <div className="flex flex-col gap-1.5 mb-3">
              {fields.map((f, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-[11px] font-semibold text-gray-700 flex-1">{f.name}</span>
                  <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-md">{f.type}</span>
                  {f.required && <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded-md">req</span>}
                  <button onClick={() => setFields((p) => p.filter((_, j) => j !== i))} className="text-gray-400 hover:text-red-500 transition-colors"><X className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          )}
          <NewFieldRow onAdd={(f) => setFields((p) => [...p, f])} />
        </div>
        {err && <div className="flex items-center gap-2 p-3 bg-red-50 rounded-xl text-[11px] text-red-600"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{err}</div>}
      </div>
      <div className="flex gap-2 px-4 py-3 border-t border-gray-100 shrink-0">
        <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={create} disabled={saving} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 text-white text-[12px] font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
          {saving ? "Creating…" : "Create"}
        </button>
      </div>
    </div>
  );
}

type DbView = "list" | "new" | { collection: Collection };

function DatabaseTab({ siteId }: { siteId: string }) {
  const [subTab, setSubTab] = useState<"data" | "apikey">("data");
  const [view, setView]     = useState<DbView>("list");
  const [refreshKey, setRK] = useState(0);

  // collections list
  const [collections, setCols] = useState<Collection[]>([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    if (view !== "list" && view !== "new") return;
    setLoading(true);
    fetch(`/api/v1/cms/collections?siteId=${siteId}`)
      .then((r) => r.json())
      .then((d) => { setCols(d.collections ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [siteId, refreshKey, view]);

  // API key
  const [apiKey,   setApiKey]   = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [copied,   setCopied]   = useState(false);
  const [rotating, setRotating] = useState(false);
  const [showRotateConfirm, setShowRotateConfirm] = useState(false);

  useEffect(() => {
    fetch(`/api/v1/sites/${siteId}/api-key`).then((r) => r.json()).then((d) => setApiKey(d.apiKey)).catch(() => {});
  }, [siteId]);

  async function rotate() {
    setShowRotateConfirm(false);
    setRotating(true);
    const res  = await fetch(`/api/v1/sites/${siteId}/api-key`, { method: "POST" });
    const json = await res.json();
    setApiKey(json.apiKey); setRevealed(true); setRotating(false);
  }

  function copy(text: string) { navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }

  const masked   = apiKey ? apiKey.slice(0, 10) + "•".repeat(Math.max(0, apiKey.length - 14)) + apiKey.slice(-4) : "loading…";
  const baseUrl  = typeof window !== "undefined" ? window.location.origin : "https://yourapp.com";

  // Collection drilldown or create form
  if (typeof view === "object") {
    return <CollectionView collection={view.collection} siteId={siteId} onBack={() => { setView("list"); setRK((k) => k + 1); }} onDeleted={() => { setView("list"); setRK((k) => k + 1); }} />;
  }
  if (view === "new") {
    return <CreateCollection siteId={siteId} onCreated={(c) => { setView({ collection: c }); setRK((k) => k + 1); }} onCancel={() => setView("list")} />;
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Sub-tab bar */}
      <div className="flex gap-1 px-3 py-2 border-b border-gray-100 shrink-0">
        <button onClick={() => setSubTab("data")} className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all", subTab === "data" ? "bg-indigo-600 text-white" : "text-gray-500 hover:bg-gray-100")}>
          <Table2 className="w-3 h-3" /> Collections
        </button>
        <button onClick={() => setSubTab("apikey")} className={cn("flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold transition-all", subTab === "apikey" ? "bg-gray-900 text-white" : "text-gray-500 hover:bg-gray-100")}>
          <Key className="w-3 h-3" /> API Key
        </button>
      </div>

      {subTab === "data" ? (
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center h-24 gap-2 text-gray-400"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-[12px]">Loading…</span></div>
          ) : collections.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 gap-3 text-center px-4">
              <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center"><Database className="w-5 h-5 text-gray-400" /></div>
              <div><p className="text-[12px] font-semibold text-gray-600">No collections yet</p><p className="text-[10px] text-gray-400 mt-1">Create a collection to store data for your site</p></div>
              <button onClick={() => setView("new")} className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 text-white rounded-xl text-[11px] font-semibold hover:bg-indigo-700 transition-colors"><Plus className="w-3.5 h-3.5" />New collection</button>
            </div>
          ) : (
            <>
              {collections.map((col) => (
                <button key={col.id} onClick={() => setView({ collection: col })} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl border border-gray-100 bg-white hover:border-indigo-200 hover:bg-indigo-50/20 transition-all text-left group">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center shrink-0"><Table2 className="w-4 h-4 text-indigo-500" /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold text-gray-800 truncate">{col.name}</p>
                    <p className="text-[10px] text-gray-400">/{col.slug} · {col.fields.length} fields · {col.itemCount} records</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">{col.publishedCount} pub</span>
                    {col.draftCount > 0 && <span className="text-[9px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full">{col.draftCount} draft</span>}
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                </button>
              ))}
              <button onClick={() => setView("new")} className="w-full flex items-center justify-center gap-1.5 py-3 rounded-xl border border-dashed border-gray-200 text-[11px] font-semibold text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/20 transition-all">
                <Plus className="w-3.5 h-3.5" /> New collection
              </button>
            </>
          )}
        </div>
      ) : (
        /* API Key sub-tab */
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          <div className="p-4 rounded-2xl border border-gray-100 bg-gray-50 space-y-3">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-500" />
              <span className="text-[12px] font-bold text-gray-800 flex-1">Site API Key</span>
              <span className="text-[9px] font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5">
              <code className="flex-1 text-[11px] font-mono text-gray-700 truncate">{revealed ? (apiKey ?? "") : masked}</code>
              <button onClick={() => setRevealed((r) => !r)} className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">{revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}</button>
              <button onClick={() => copy(apiKey ?? "")} className="text-gray-400 hover:text-indigo-600 transition-colors shrink-0">{copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}</button>
            </div>
            <button onClick={() => setShowRotateConfirm(true)} disabled={rotating} className="flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-50">
              {rotating ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />}
              {rotating ? "Regenerating…" : "Regenerate key"}
            </button>
            <p className="text-[10px] text-gray-400 leading-relaxed">Include as an <code className="bg-gray-100 px-1 rounded">X-API-Key</code> header when calling your site's CRUD endpoints.</p>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Endpoint reference</p>
            <div className="p-3 rounded-xl bg-gray-900 space-y-0.5 font-mono text-[10px] text-emerald-400">
              {[["GET", "List"], ["POST", "Create"], ["GET", "Read"], ["PUT", "Update"], ["PATCH", "Patch"], ["DELETE", "Delete"]].map(([method, label], i) => (
                <p key={i}><span className={cn("mr-2 font-bold", method === "GET" ? "text-blue-400" : method === "POST" ? "text-green-400" : method === "DELETE" ? "text-red-400" : "text-yellow-400")}>{method.padEnd(6)}</span>{`/api/v1/sites/{id}/db/{col}${i >= 2 ? "/{itemId}" : ""}`}<span className="text-gray-500 ml-2">{"// "}{label}</span></p>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quick example</p>
            <div className="relative">
              <pre className="text-[10px] bg-gray-900 text-emerald-300 p-3 rounded-xl overflow-x-auto leading-relaxed font-mono whitespace-pre-wrap break-all">{`fetch("${baseUrl}/api/v1/sites/${siteId}/db/products", {\n  headers: { "X-API-Key": "${apiKey ?? "sk_live_…"}" }\n})`}</pre>
              <button onClick={() => copy(`fetch("${baseUrl}/api/v1/sites/${siteId}/db/products", {\n  headers: { "X-API-Key": "${apiKey ?? ""}" }\n})`)} className="absolute top-2 right-2 text-gray-500 hover:text-white transition-colors"><Copy className="w-3 h-3" /></button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showRotateConfirm}
        title="Regenerate API key?"
        description="Your existing API key will stop working immediately. All integrations using the old key will break."
        confirmLabel="Regenerate"
        variant="warning"
        onConfirm={rotate}
        onCancel={() => setShowRotateConfirm(false)}
      />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3 — SCHEMA
// ─────────────────────────────────────────────────────────────────────────────

function makeCol(o: Partial<SchemaColumn> = {}): SchemaColumn {
  return { id: generateId(), name: "column_name", type: "text", isPrimary: false, isNotNull: false, isUnique: false, defaultValue: "", ...o };
}
function makeTable(): SchemaTable {
  return { id: generateId(), name: "new_table", enableRls: true, rlsPolicy: "owner_only", addTimestamps: true, columns: [makeCol({ name: "id", type: "uuid", isPrimary: true, isNotNull: true })] };
}

function SchemaCheckbox({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" onClick={onChange} className="flex items-center gap-1.5">
      <div className={cn("w-3.5 h-3.5 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition-colors", checked ? "bg-indigo-600 border-indigo-600" : "border-gray-300")}>
        {checked && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
      </div>
      <span className="text-[11px] text-gray-700">{label}</span>
    </button>
  );
}

function ColumnRow({ col, tableNames, onChange, onRemove, canRemove }: { col: SchemaColumn; tableNames: string[]; onChange: (u: Partial<SchemaColumn>) => void; onRemove: () => void; canRemove: boolean }) {
  const [open, setOpen] = useState(false);
  const cls = inputCls();
  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <div className="flex items-center gap-1.5 px-2.5 py-2 bg-gray-50">
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-gray-400 shrink-0">{open ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}</button>
        <input value={col.name} onChange={(e) => onChange({ name: e.target.value })} className={cn(cls, "flex-1 min-w-0 bg-transparent border-none shadow-none focus:ring-0 px-1 py-0.5 text-[12px] font-medium")} placeholder="column_name" />
        <select value={col.type} onChange={(e) => onChange({ type: e.target.value as SchemaColumnType })} className={cn(cls, "w-24 py-0.5 text-[11px]")}>
          {COLUMN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        {col.isPrimary && <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded shrink-0">PK</span>}
        {canRemove && <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="w-3 h-3" /></button>}
      </div>
      {open && (
        <div className="px-3 py-2.5 border-t border-gray-100 flex flex-col gap-2">
          <div className="flex flex-wrap gap-3">
            {!col.isPrimary && <SchemaCheckbox checked={!!col.isNotNull} onChange={() => onChange({ isNotNull: !col.isNotNull })} label="NOT NULL" />}
            {!col.isPrimary && <SchemaCheckbox checked={!!col.isUnique}  onChange={() => onChange({ isUnique:  !col.isUnique  })} label="UNIQUE" />}
            <SchemaCheckbox checked={!!col.isPrimary} onChange={() => onChange({ isPrimary: !col.isPrimary })} label="Primary Key" />
          </div>
          {col.type === "varchar" && (
            <div className="flex items-center gap-2"><span className="text-[11px] text-gray-500 shrink-0">Max length:</span><input type="number" min={1} value={col.varcharLength ?? 255} onChange={(e) => onChange({ varcharLength: Number(e.target.value) })} className={cn(cls, "w-20 py-1")} /></div>
          )}
          {!col.isPrimary && (
            <div className="flex items-center gap-2"><span className="text-[11px] text-gray-500 shrink-0">Default:</span><input value={col.defaultValue ?? ""} onChange={(e) => onChange({ defaultValue: e.target.value })} placeholder="false, 0, 'pending'" className={cn(cls, "flex-1 py-1")} /></div>
          )}
          {!col.isPrimary && tableNames.length > 0 && (
            <div className="flex items-center gap-2"><span className="text-[11px] text-gray-500 shrink-0">References:</span>
              <select value={col.references ?? ""} onChange={(e) => onChange({ references: e.target.value || undefined })} className={cn(cls, "flex-1 py-1")}>
                <option value="">— none —</option>
                {tableNames.map((t) => <option key={t} value={`${t}.id`}>{t}.id</option>)}
              </select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TableCard({ table, allTableNames, onChange, onRemove }: { table: SchemaTable; allTableNames: string[]; onChange: (t: SchemaTable) => void; onRemove: () => void }) {
  const [open, setOpen]       = useState(true);
  const [sqlOpen, setSqlOpen] = useState(false);
  const [copied, setCopied]   = useState(false);
  const others = allTableNames.filter((n) => n !== table.name);

  function copySQL() { navigator.clipboard.writeText(generateTableSQL(table)).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <div className={cn("flex items-center gap-2 px-3 py-2.5 bg-gray-50", open ? "border-b border-gray-100" : "")}>
        <button type="button" onClick={() => setOpen((o) => !o)} className="text-gray-500 shrink-0">{open ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}</button>
        <Table2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
        <input value={table.name} onChange={(e) => onChange({ ...table, name: e.target.value })} className="flex-1 bg-transparent border-none outline-none text-[13px] font-bold text-gray-900 placeholder:text-gray-400" placeholder="table_name" />
        <button type="button" onClick={copySQL} className={cn("text-[11px] shrink-0 transition-colors", copied ? "text-emerald-500" : "text-gray-400 hover:text-gray-600")}>{copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}</button>
        <button type="button" onClick={onRemove} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
      {open && (
        <div className="p-3 flex flex-col gap-3">
          {/* Columns */}
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <Columns3 className="w-3 h-3 text-gray-400" />
              <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Columns</span>
            </div>
            <div className="flex flex-col gap-1.5">
              {table.columns.map((col) => (
                <ColumnRow key={col.id} col={col} tableNames={others} onChange={(u) => onChange({ ...table, columns: table.columns.map((c) => c.id === col.id ? { ...c, ...u } : c) })} onRemove={() => onChange({ ...table, columns: table.columns.filter((c) => c.id !== col.id) })} canRemove={table.columns.length > 1} />
              ))}
              <button type="button" onClick={() => onChange({ ...table, columns: [...table.columns, makeCol()] })} className="flex items-center gap-1.5 px-3 py-2 border border-dashed border-indigo-200 rounded-xl bg-indigo-50/40 text-indigo-600 text-[11px] font-semibold hover:bg-indigo-50 transition-colors">
                <Plus className="w-3 h-3" /> Add Column
              </button>
            </div>
          </div>

          {/* Options */}
          <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
            <SchemaCheckbox checked={!!table.addTimestamps} onChange={() => onChange({ ...table, addTimestamps: !table.addTimestamps })} label="Auto created_at / updated_at" />
            <SchemaCheckbox checked={!!table.enableRls} onChange={() => onChange({ ...table, enableRls: !table.enableRls })} label="Enable Row Level Security" />
            {table.enableRls && (
              <div className="flex items-center gap-2 pl-5">
                <span className="text-[11px] text-gray-500 shrink-0">Policy:</span>
                <select value={table.rlsPolicy ?? "none"} onChange={(e) => onChange({ ...table, rlsPolicy: e.target.value as SchemaRLSPolicy })} className={cn(inputCls(), "flex-1 py-1 text-[11px]")}>
                  {RLS_POLICIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
            )}
          </div>

          {/* SQL preview */}
          <div className="border-t border-gray-100 pt-3">
            <button type="button" onClick={() => setSqlOpen((o) => !o)} className="flex items-center gap-1.5 text-[11px] text-gray-400 hover:text-gray-600 font-semibold transition-colors">
              {sqlOpen ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />} Preview SQL
            </button>
            {sqlOpen && <pre className="mt-2 p-3 bg-gray-900 text-emerald-300 text-[10px] rounded-xl font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all">{generateTableSQL(table)}</pre>}
          </div>
        </div>
      )}
    </div>
  );
}

function SchemaTab({ siteId }: { siteId: string }) {
  const getSiteById = useSiteStore((s) => s.getSiteById);
  const updateSite  = useSiteStore((s) => s.updateSite);
  const site        = getSiteById(siteId);

  const [schema, setSchema]     = useState<SiteSchema>(() => site?.schema ?? { tables: [] });
  const [saved, setSaved]       = useState(false);
  const [fullSql, setFullSql]   = useState(false);
  const [copied, setCopied]     = useState(false);

  const tableNames = schema.tables.map((t) => t.name);
  const fullSQL    = generateSchemaSQL(schema);

  function save() {
    updateSite(siteId, { schema });
    fetch(`/api/v1/sites/${siteId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ schema_config: schema }) }).catch(console.error);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  function copyAll() { navigator.clipboard.writeText(fullSQL).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); }); }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
        <InfoBox>
          Design your tables → copy the SQL → paste into <strong>Supabase → SQL Editor → Run</strong>. Schema is live instantly.
        </InfoBox>

        {schema.tables.length === 0 && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
            <Database className="w-8 h-8 text-gray-200" />
            <p className="text-[12px] text-gray-400">No tables yet. Add one below.</p>
          </div>
        )}

        {schema.tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            allTableNames={tableNames}
            onChange={(updated) => { setSchema((prev) => ({ tables: prev.tables.map((t) => t.id === table.id ? updated : t) })); setSaved(false); }}
            onRemove={() => { setSchema((prev) => ({ tables: prev.tables.filter((t) => t.id !== table.id) })); setSaved(false); }}
          />
        ))}

        <button onClick={() => { setSchema((prev) => ({ tables: [...prev.tables, makeTable()] })); setSaved(false); }} className="w-full flex items-center justify-center gap-1.5 py-3 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 text-indigo-600 text-[12px] font-bold hover:bg-indigo-50 transition-colors">
          <Plus className="w-3.5 h-3.5" /> Add Table
        </button>

        {schema.tables.length > 0 && (
          <div>
            <button type="button" onClick={() => setFullSql((o) => !o)} className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl border border-gray-200 text-[12px] font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              <span className="flex items-center gap-1.5">{fullSql ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />} Full SQL Preview</span>
              <button type="button" onClick={(e) => { e.stopPropagation(); copyAll(); }} className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-bold transition-all", copied ? "bg-emerald-50 text-emerald-600" : "bg-gray-100 text-gray-600 hover:bg-indigo-50 hover:text-indigo-600")}>
                {copied ? <><Check className="w-3 h-3" /> Copied!</> : <><Copy className="w-3 h-3" /> Copy All</>}
              </button>
            </button>
            {fullSql && <pre className="mt-2 p-4 bg-gray-900 text-emerald-300 text-[10px] rounded-2xl font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-all max-h-64 overflow-y-auto">{fullSQL}</pre>}
          </div>
        )}
      </div>

      {/* Save */}
      <div className="px-4 py-3 border-t border-gray-100 shrink-0">
        <button onClick={save} className={cn("w-full py-2.5 rounded-xl font-bold text-[12px] text-white flex items-center justify-center gap-2 transition-all", saved ? "bg-emerald-500" : "bg-indigo-600 hover:bg-indigo-700")}>
          {saved ? <><Check className="w-3.5 h-3.5" /> Schema Saved</> : <><RefreshCw className="w-3.5 h-3.5" /> Save Schema</>}
        </button>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">Saves the schema definition — not the data itself.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT — BackendPanel
// ─────────────────────────────────────────────────────────────────────────────

type MainTab = "auth" | "database" | "schema" | "actions" | "routes" | "sources";

const TABS: { id: MainTab; label: string; icon: React.ReactNode; activeIcon: React.ReactNode; activeBg: string; activeText: string; dotColor: string }[] = [
  {
    id: "auth",
    label: "Auth",
    icon:       <Shield className="w-4 h-4" />,
    activeIcon: <Shield className="w-4 h-4" />,
    activeBg:   "bg-indigo-50",
    activeText: "text-indigo-600",
    dotColor:   "bg-indigo-500",
  },
  {
    id: "database",
    label: "Database",
    icon:       <Database className="w-4 h-4" />,
    activeIcon: <Database className="w-4 h-4" />,
    activeBg:   "bg-emerald-50",
    activeText: "text-emerald-600",
    dotColor:   "bg-emerald-500",
  },
  {
    id: "schema",
    label: "Schema",
    icon:       <Table2 className="w-4 h-4" />,
    activeIcon: <Table2 className="w-4 h-4" />,
    activeBg:   "bg-violet-50",
    activeText: "text-violet-600",
    dotColor:   "bg-violet-500",
  },
  {
    id: "actions",
    label: "Actions",
    icon:       <Zap className="w-4 h-4" />,
    activeIcon: <Zap className="w-4 h-4" />,
    activeBg:   "bg-amber-50",
    activeText: "text-amber-600",
    dotColor:   "bg-amber-500",
  },
  {
    id: "routes",
    label: "Routes",
    icon:       <Globe className="w-4 h-4" />,
    activeIcon: <Globe className="w-4 h-4" />,
    activeBg:   "bg-sky-50",
    activeText: "text-sky-600",
    dotColor:   "bg-sky-500",
  },
  {
    id: "sources",
    label: "Data",
    icon:       <BarChart3 className="w-4 h-4" />,
    activeIcon: <BarChart3 className="w-4 h-4" />,
    activeBg:   "bg-rose-50",
    activeText: "text-rose-600",
    dotColor:   "bg-rose-500",
  },
];

export default function BackendPanel() {
  const siteId = useEditorStore((s) => s.siteId);
  const [tab, setTab] = useState<MainTab>("auth");

  if (!siteId) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-center px-4 gap-2">
        <Database className="w-8 h-8 text-gray-200" />
        <p className="text-[12px] text-gray-400">No site loaded</p>
      </div>
    );
  }

  const activeTab = TABS.find((t) => t.id === tab)!;

  return (
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* Panel header */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 shrink-0">
        {/* Title row */}
        <div className="flex items-center gap-2.5 mb-3">
          <div className={cn(
            "w-7 h-7 rounded-lg flex items-center justify-center shadow-sm shrink-0 transition-all duration-300",
            activeTab.activeBg,
          )}>
            <span className={activeTab.activeText}>{activeTab.activeIcon}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold text-gray-900 leading-none">Backend</h2>
            <p className={cn("text-[10px] mt-0.5 leading-none font-medium transition-colors duration-200", activeTab.activeText)}>
              {activeTab.label}
            </p>
          </div>
        </div>

        {/* 3 × 2 icon-grid tab switcher */}
        <div className="grid grid-cols-3 gap-1.5">
          {TABS.map((t) => {
            const isActive = tab === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border transition-all duration-150 select-none",
                  isActive
                    ? cn(t.activeBg, "border-transparent shadow-sm", t.activeText)
                    : "bg-gray-50 border-transparent text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                )}
              >
                {/* Active indicator dot */}
                {isActive && (
                  <span className={cn("absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full", t.dotColor)} />
                )}
                <span className="transition-transform duration-150"
                  style={{ transform: isActive ? "scale(1.1)" : "scale(1)" }}>
                  {t.icon}
                </span>
                <span className="text-[9px] font-semibold leading-none tracking-wide">{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab body */}
      {tab === "auth"     && <AuthTab         siteId={siteId} />}
      {tab === "database" && <DatabaseTab     siteId={siteId} />}
      {tab === "schema"   && <SchemaTab       siteId={siteId} />}
      {tab === "actions"  && <ActionsTab      siteId={siteId} />}
      {tab === "routes"   && <RoutesTab       siteId={siteId} />}
      {tab === "sources"  && <DataSourcesTab  siteId={siteId} />}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ActionsTab — Backend Action Registry
// ─────────────────────────────────────────────────────────────────────────────

const ACTION_TYPES: BackendActionType[] = [
  "db.insert","db.update","db.delete","db.query",
  "auth.signup","auth.login","auth.logout",
  "email.send","webhook.call",
  "cart.addItem","cart.removeItem",
  "order.create","order.update",
  "lemonsqueezy.checkout","custom.function",
];

const ACTION_TYPE_LABELS: Record<BackendActionType, string> = {
  "db.insert": "DB Insert",
  "db.update": "DB Update",
  "db.delete": "DB Delete",
  "db.query": "DB Query",
  "auth.signup": "Auth Signup",
  "auth.login": "Auth Login",
  "auth.logout": "Auth Logout",
  "email.send": "Send Email",
  "webhook.call": "Call Webhook",
  "cart.addItem": "Cart Add Item",
  "cart.removeItem": "Cart Remove Item",
  "order.create": "Create Order",
  "order.update": "Update Order",
  "lemonsqueezy.checkout": "Lemon Squeezy Checkout",
  "custom.function": "Custom Function",
};

function ActionsTab({ siteId }: { siteId: string }) {
  const [actions, setActions] = useState<BackendAction[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<BackendAction | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/actions`);
      const json = await res.json();
      setActions(json.data ?? []);
    } finally {
      setLoading(false);
    }
  }, [siteId]);

  useEffect(() => { load(); }, [load]);

  const startNew = () => setEditing({
    id: nanoid(),
    name: "",
    type: "db.insert",
    config: {},
    auth: "public",
  });

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    setError(null);
    try {
      const isNew = !actions.find((a) => a.id === editing.id);
      const url = isNew
        ? `/api/v1/sites/${siteId}/actions`
        : `/api/v1/sites/${siteId}/actions/${editing.id}`;
      const method = isNew ? "POST" : "PUT";
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    await fetch(`/api/v1/sites/${siteId}/actions/${id}`, { method: "DELETE" });
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>;

  if (editing) return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-bold text-gray-700">
          {actions.find((a) => a.id === editing.id) ? "Edit Action" : "New Action"}
        </h3>
        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>

      <div>
        {fieldLabel("Name")}
        <input className={inputCls()} value={editing.name} placeholder="Submit Contact Form"
          onChange={(e) => setEditing((p) => p ? { ...p, name: e.target.value } : p)} />
      </div>

      <div>
        {fieldLabel("Action Type")}
        <select className={inputCls()} value={editing.type}
          onChange={(e) => setEditing((p) => p ? { ...p, type: e.target.value as BackendActionType } : p)}>
          {ACTION_TYPES.map((t) => <option key={t} value={t}>{ACTION_TYPE_LABELS[t]}</option>)}
        </select>
      </div>

      <div>
        {fieldLabel("Access Control")}
        <select className={inputCls()} value={editing.auth ?? "public"}
          onChange={(e) => setEditing((p) => p ? { ...p, auth: e.target.value as BackendAction["auth"] } : p)}>
          <option value="public">Public — anyone can trigger</option>
          <option value="authenticated">Authenticated — requires login</option>
          <option value="role:admin">Admin only</option>
        </select>
      </div>

      {/* Config JSON editor */}
      <div>
        {fieldLabel("Config (JSON)")}
        <textarea className={inputCls("font-mono text-[11px] min-h-[120px]")}
          value={JSON.stringify(editing.config ?? {}, null, 2)}
          onChange={(e) => {
            try {
              setEditing((p) => p ? { ...p, config: JSON.parse(e.target.value) } : p);
            } catch { /* ignore parse errors while typing */ }
          }}
        />
        <p className="text-[10px] text-gray-400 mt-1">Field bindings: {"{ source: 'formField', field: 'email' }"}</p>
      </div>

      {error && <div className="flex items-center gap-2 text-[11px] text-red-600 bg-red-50 rounded-lg px-3 py-2"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</div>}

      <div className="flex gap-2 mt-auto">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 text-[12px] rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={save} disabled={saving || !editing.name}
          className="flex-1 py-2 text-[12px] rounded-xl bg-amber-500 text-white font-semibold hover:bg-amber-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
          Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <button onClick={startNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 text-white text-[12px] font-semibold hover:bg-amber-600 transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Backend Action
        </button>
      </div>

      {actions.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center px-6 py-8">
          <Zap className="w-8 h-8 text-gray-200" />
          <p className="text-[12px] text-gray-400">No backend actions yet.</p>
          <p className="text-[10px] text-gray-400">Create actions to wire form submissions, DB writes, emails and more.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {actions.map((action) => (
            <div key={action.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
                <Zap className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-800 truncate">{action.name}</p>
                <p className="text-[10px] text-gray-400">{ACTION_TYPE_LABELS[action.type]} · {action.auth ?? "public"}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(action)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500">
                  <Pencil className="w-3 h-3" />
                </button>
                <button onClick={() => remove(action.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RoutesTab — Custom API Route Builder
// ─────────────────────────────────────────────────────────────────────────────

const HTTP_METHODS = ["GET","POST","PUT","PATCH","DELETE"] as const;

function RoutesTab({ siteId }: { siteId: string }) {
  const [routes, setRoutes] = useState<SiteRoute[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<SiteRoute | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/routes`);
      const json = await res.json();
      setRoutes(json.data ?? []);
    } finally { setLoading(false); }
  }, [siteId]);

  useEffect(() => { load(); }, [load]);

  const startNew = () => setEditing({ id: nanoid(), path: "/api/", method: "POST", auth: "public", steps: [] });

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      const isNew = !routes.find((r) => r.id === editing.id);
      const res = await fetch(`/api/v1/sites/${siteId}/routes`, {
        method: isNew ? "POST" : "DELETE",
        headers: { "Content-Type": "application/json" },
        body: isNew ? JSON.stringify(editing) : JSON.stringify({ routeId: editing.id }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      if (!isNew) {
        // Re-create with updated data
        const res2 = await fetch(`/api/v1/sites/${siteId}/routes`, {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing),
        });
        if (!res2.ok) throw new Error((await res2.json()).error);
      }
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    await fetch(`/api/v1/sites/${siteId}/routes?routeId=${id}`, { method: "DELETE" });
    setRoutes((p) => p.filter((r) => r.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>;

  if (editing) return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-bold text-gray-700">{routes.find((r) => r.id === editing.id) ? "Edit Route" : "New Route"}</h3>
        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>

      <div className="flex gap-2">
        <div className="w-24">
          {fieldLabel("Method")}
          <select className={inputCls()} value={editing.method}
            onChange={(e) => setEditing((p) => p ? { ...p, method: e.target.value as SiteRoute["method"] } : p)}>
            {HTTP_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <div className="flex-1">
          {fieldLabel("Path")}
          <input className={inputCls("font-mono")} value={editing.path} placeholder="/api/contact"
            onChange={(e) => setEditing((p) => p ? { ...p, path: e.target.value } : p)} />
        </div>
      </div>

      <div>
        {fieldLabel("Access Control")}
        <select className={inputCls()} value={editing.auth}
          onChange={(e) => setEditing((p) => p ? { ...p, auth: e.target.value as SiteRoute["auth"] } : p)}>
          <option value="public">Public</option>
          <option value="authenticated">Authenticated</option>
          <option value="api-key">API Key</option>
        </select>
      </div>

      <div>
        {fieldLabel("Steps (JSON)")}
        <textarea className={inputCls("font-mono text-[11px] min-h-[140px]")}
          value={JSON.stringify(editing.steps ?? [], null, 2)}
          onChange={(e) => {
            try { setEditing((p) => p ? { ...p, steps: JSON.parse(e.target.value) } : p); } catch { /* ignore */ }
          }}
        />
        <p className="text-[10px] text-gray-400 mt-1">Each step: {"{ type: 'db.insert', config: { table: '...', data: {} } }"}</p>
      </div>

      {error && <div className="flex items-center gap-2 text-[11px] text-red-600 bg-red-50 rounded-lg px-3 py-2"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</div>}

      <div className="flex gap-2 mt-auto">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 text-[12px] rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={save} disabled={saving}
          className="flex-1 py-2 text-[12px] rounded-xl bg-sky-500 text-white font-semibold hover:bg-sky-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <button onClick={startNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-sky-500 text-white text-[12px] font-semibold hover:bg-sky-600 transition-colors">
          <Plus className="w-3.5 h-3.5" /> New API Route
        </button>
      </div>

      {routes.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center px-6 py-8">
          <Globe className="w-8 h-8 text-gray-200" />
          <p className="text-[12px] text-gray-400">No custom routes yet.</p>
          <p className="text-[10px] text-gray-400">Define custom API endpoints that your published site can call.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {routes.map((route) => (
            <div key={route.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group">
              <span className={cn("text-[10px] font-bold px-1.5 py-0.5 rounded font-mono shrink-0",
                route.method === "GET" ? "bg-emerald-100 text-emerald-700" :
                route.method === "POST" ? "bg-blue-100 text-blue-700" :
                route.method === "DELETE" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"
              )}>{route.method}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-mono text-gray-800 truncate">{route.path}</p>
                <p className="text-[10px] text-gray-400">{route.steps.length} step{route.steps.length !== 1 ? "s" : ""} · {route.auth}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(route)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => remove(route.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CmsCollectionConfigEditor — UI for cms.collection data source config
// ─────────────────────────────────────────────────────────────────────────────

function CmsCollectionConfigEditor({
  siteId,
  config,
  onChange,
}: {
  siteId: string;
  config: Record<string, unknown>;
  onChange: (cfg: Record<string, unknown>) => void;
}) {
  const [collections, setCollections] = useState<{ id: string; name: string; slug: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/cms/collections`)
      .then((r) => r.json())
      .then((json) => setCollections(json.collections ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [siteId]);

  const slug = (config.slug as string) || "";
  const limit = Number(config.limit) || 20;
  const status = (config.status as string) || "published";

  const set = (patch: Record<string, unknown>) => onChange({ ...config, ...patch });

  return (
    <div className="flex flex-col gap-3">
      <div>
        {fieldLabel("Collection")}
        {loading
          ? <div className="flex items-center gap-2 py-2"><Loader2 className="w-3.5 h-3.5 animate-spin text-gray-300" /><span className="text-[11px] text-gray-400">Loading…</span></div>
          : (
            <select className={inputCls()} value={slug} onChange={(e) => set({ slug: e.target.value })}>
              <option value="">— Select collection —</option>
              {collections.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
            </select>
          )
        }
        {!loading && collections.length === 0 && (
          <p className="text-[10px] text-gray-400 mt-1">No collections. Create one in Dashboard → CMS.</p>
        )}
      </div>
      <div>
        {fieldLabel("Status filter")}
        <select className={inputCls()} value={status} onChange={(e) => set({ status: e.target.value })}>
          <option value="published">Published only</option>
          <option value="draft">Drafts only</option>
          <option value="all">All items</option>
        </select>
      </div>
      <div>
        {fieldLabel("Max items")}
        <input type="number" min={1} max={100} className={inputCls()} value={limit}
          onChange={(e) => set({ limit: parseInt(e.target.value) || 20 })} />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DataSourcesTab — Named query registry for data binding
// ─────────────────────────────────────────────────────────────────────────────

function DataSourcesTab({ siteId }: { siteId: string }) {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<DataSource | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/data`);
      const json = await res.json();
      setSources(json.data ?? []);
    } finally { setLoading(false); }
  }, [siteId]);

  useEffect(() => { load(); }, [load]);

  const startNew = () => setEditing({ id: nanoid(), name: "", type: "db.query", config: { table: "", select: ["*"] }, refreshOn: "pageLoad" });

  const save = async () => {
    if (!editing) return;
    setSaving(true); setError(null);
    try {
      const isNew = !sources.find((s) => s.id === editing.id);
      const url = isNew ? `/api/v1/sites/${siteId}/data` : `/api/v1/sites/${siteId}/data/${editing.id}`;
      const res = await fetch(url, { method: isNew ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editing) });
      if (!res.ok) throw new Error((await res.json()).error);
      setEditing(null);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    await fetch(`/api/v1/sites/${siteId}/data/${id}`, { method: "DELETE" });
    setSources((p) => p.filter((s) => s.id !== id));
  };

  if (loading) return <div className="flex items-center justify-center h-32"><Loader2 className="w-5 h-5 animate-spin text-gray-300" /></div>;

  if (editing) return (
    <div className="flex flex-col gap-3 p-4 overflow-y-auto h-full">
      <div className="flex items-center justify-between">
        <h3 className="text-[12px] font-bold text-gray-700">{sources.find((s) => s.id === editing.id) ? "Edit Data Source" : "New Data Source"}</h3>
        <button onClick={() => setEditing(null)} className="text-gray-400 hover:text-gray-600"><X className="w-4 h-4" /></button>
      </div>

      <div>
        {fieldLabel("Name")}
        <input className={inputCls()} value={editing.name} placeholder="Recent Blog Posts"
          onChange={(e) => setEditing((p) => p ? { ...p, name: e.target.value } : p)} />
      </div>

      <div>
        {fieldLabel("Source Type")}
        <select className={inputCls()} value={editing.type}
          onChange={(e) => setEditing((p) => p ? { ...p, type: e.target.value as DataSource["type"] } : p)}>
          <option value="db.query">Database Query</option>
          <option value="cms.collection">CMS Collection</option>
          <option value="api.get">External API (GET)</option>
          <option value="auth.profile">Auth User Profile</option>
        </select>
      </div>

      <div>
        {fieldLabel("Refresh")}
        <select className={inputCls()} value={editing.refreshOn ?? "pageLoad"}
          onChange={(e) => setEditing((p) => p ? { ...p, refreshOn: e.target.value as DataSource["refreshOn"] } : p)}>
          <option value="pageLoad">On Page Load</option>
          <option value="interval">On Interval</option>
          <option value="event">On Event</option>
        </select>
      </div>

      {editing.refreshOn === "interval" && (
        <div>
          {fieldLabel("Interval (seconds)")}
          <input type="number" className={inputCls()} value={editing.refreshInterval ?? 30}
            onChange={(e) => setEditing((p) => p ? { ...p, refreshInterval: Number(e.target.value) } : p)} />
        </div>
      )}

      {/* CMS Collection config */}
      {editing.type === "cms.collection" && (
        <CmsCollectionConfigEditor
          siteId={siteId}
          config={editing.config}
          onChange={(cfg) => setEditing((p) => p ? { ...p, config: cfg } : p)}
        />
      )}

      {/* db.query / api.get config — raw JSON */}
      {editing.type !== "cms.collection" && editing.type !== "auth.profile" && (
        <div>
          {fieldLabel("Config (JSON)")}
          <textarea className={inputCls("font-mono text-[11px] min-h-[120px]")}
            value={JSON.stringify(editing.config ?? {}, null, 2)}
            onChange={(e) => {
              try { setEditing((p) => p ? { ...p, config: JSON.parse(e.target.value) } : p); } catch { /* ignore */ }
            }}
          />
          <p className="text-[10px] text-gray-400 mt-1">{"{ table: 'posts', select: ['id','title'], limit: 10 }"}</p>
        </div>
      )}

      {error && <div className="flex items-center gap-2 text-[11px] text-red-600 bg-red-50 rounded-lg px-3 py-2"><AlertCircle className="w-3.5 h-3.5 shrink-0" />{error}</div>}

      <div className="flex gap-2 mt-auto">
        <button onClick={() => setEditing(null)} className="flex-1 py-2 text-[12px] rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50">Cancel</button>
        <button onClick={save} disabled={saving || !editing.name}
          className="flex-1 py-2 text-[12px] rounded-xl bg-rose-500 text-white font-semibold hover:bg-rose-600 disabled:opacity-50 flex items-center justify-center gap-2">
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="p-4 pb-2">
        <button onClick={startNew}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-rose-500 text-white text-[12px] font-semibold hover:bg-rose-600 transition-colors">
          <Plus className="w-3.5 h-3.5" /> New Data Source
        </button>
      </div>

      {sources.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 gap-2 text-center px-6 py-8">
          <BarChart3 className="w-8 h-8 text-gray-200" />
          <p className="text-[12px] text-gray-400">No data sources yet.</p>
          <p className="text-[10px] text-gray-400">Create named queries to bind live data to elements on the canvas.</p>
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-gray-100">
          {sources.map((source) => (
            <div key={source.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group">
              <div className="w-7 h-7 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                <BarChart3 className="w-3.5 h-3.5 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-semibold text-gray-800 truncate">{source.name}</p>
                <p className="text-[10px] text-gray-400">{source.type} · {source.refreshOn ?? "pageLoad"}</p>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => setEditing(source)} className="p-1.5 rounded-lg hover:bg-gray-200 text-gray-500"><Pencil className="w-3 h-3" /></button>
                <button onClick={() => remove(source.id)} className="p-1.5 rounded-lg hover:bg-red-100 text-red-500"><Trash2 className="w-3 h-3" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
