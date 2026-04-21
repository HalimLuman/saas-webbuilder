"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, FileText, TrendingUp, BarChart2, Eye, Pencil, ChevronDown, ChevronUp, Globe, Clock, Trash2, X, RefreshCw } from "lucide-react";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useWorkspaceStore } from "@/store/workspace-store";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Submission {
  id: string;
  data: Record<string, unknown>;
  created_at: string;
}

interface Form {
  id: string;
  name: string;
  status: "active" | "paused";
  site_id: string | null;
  siteName: string | null;
  submissions: number;
  lastSubmission: string | null;
  created_at: string;
}

function CompletionBar({ value }: { value: number }) {
  const color = value >= 80 ? "bg-emerald-500" : value >= 60 ? "bg-amber-500" : "bg-red-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-700 w-8 text-right">{value}%</span>
    </div>
  );
}

function timeAgo(iso: string | null): string {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "1 day ago";
  return `${d} days ago`;
}

export default function FormsPage() {
  const wfetch = useWorkspaceFetch();
  const { activeWorkspaceId } = useWorkspaceStore();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<Record<string, Submission[]>>({});
  const [loadingSubs, setLoadingSubs] = useState<string | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wfetch("/api/v1/forms");
      const json = await res.json();
      setForms(json.forms ?? []);
    } catch {
      toast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  }, [wfetch]);

  useEffect(() => { load(); }, [load, activeWorkspaceId]);

  const toggleExpand = async (formId: string) => {
    if (expanded === formId) { setExpanded(null); return; }
    setExpanded(formId);
    if (!submissions[formId]) {
      setLoadingSubs(formId);
      try {
        const res = await wfetch(`/api/v1/forms/${formId}`);
        const json = await res.json();
        setSubmissions((prev) => ({ ...prev, [formId]: json.submissions ?? [] }));
      } catch {
        toast.error("Failed to load submissions");
      } finally {
        setLoadingSubs(null);
      }
    }
  };

  const createForm = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await wfetch("/api/v1/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`Form "${newName}" created`);
      setShowNew(false);
      setNewName("");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const deleteForm = async (formId: string, name: string) => {
    try {
      const res = await wfetch(`/api/v1/forms?formId=${formId}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`"${name}" deleted`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const total = forms.reduce((s, f) => s + f.submissions, 0);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forms</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading ? "Loading…" : `${forms.length} form${forms.length !== 1 ? "s" : ""} across your sites`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
          <Button className="gap-2" onClick={() => setShowNew(true)}>
            <Plus className="h-4 w-4" /> Create Form
          </Button>
        </div>
      </div>

      {/* New form inline panel */}
      {showNew && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-6">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">New Form</h3>
          <div className="flex gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createForm()}
              placeholder="e.g. Contact Form"
              className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <Button size="sm" onClick={createForm} disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setShowNew(false); setNewName(""); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "Active Forms",            value: loading ? "—" : String(forms.filter((f) => f.status === "active").length), icon: FileText,  color: "text-indigo-600 bg-indigo-50" },
          { label: "Total Submissions",        value: loading ? "—" : total.toLocaleString(),                                   icon: TrendingUp, color: "text-emerald-600 bg-emerald-50" },
          { label: "Avg Completion Rate",      value: "—",                                                                     icon: BarChart2,  color: "text-amber-600 bg-amber-50" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
              <s.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-black text-gray-900" suppressHydrationWarning>{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
              <div className="h-8 w-8 rounded-lg bg-gray-100" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Forms table */}
      {!loading && forms.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="hidden sm:grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            <span>Form</span>
            <span className="text-center">Submissions</span>
            <span className="w-28">Completion</span>
            <span className="text-center">Last Submission</span>
            <span className="text-center">Status</span>
            <span />
          </div>

          {forms.map((form) => (
            <React.Fragment key={form.id}>
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto_auto] gap-4 items-center px-5 py-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-indigo-50 flex items-center justify-center shrink-0">
                    <FileText className="h-4 w-4 text-indigo-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{form.name}</p>
                    {form.siteName && (
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Globe className="h-3 w-3" /> {form.siteName}
                      </div>
                    )}
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-900 text-center" suppressHydrationWarning>{form.submissions.toLocaleString()}</span>
                <div className="w-28"><CompletionBar value={75} /></div>
                <div className="flex items-center gap-1 text-xs text-gray-400 text-center" suppressHydrationWarning>
                  <Clock className="h-3 w-3" /> {timeAgo(form.lastSubmission)}
                </div>
                <span className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full border text-center",
                  form.status === "active" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-gray-500 bg-gray-50 border-gray-200"
                )}>
                  {form.status === "active" ? "Active" : "Paused"}
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="h-7 text-xs gap-1" onClick={() => toggleExpand(form.id)}>
                    <Eye className="h-3 w-3" /> Submissions
                    {expanded === form.id ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                  </Button>
                  <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={() => toast.info("Form editor coming soon")}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    className="h-7 w-7 p-0 text-red-600 border-red-200 hover:bg-red-50"
                    onClick={() => setDeleteConfirm({ id: form.id, name: form.name })}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Expanded submissions */}
              {expanded === form.id && (
                <div className="border-b border-gray-100 bg-gray-50">
                  <div className="px-5 py-3">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Recent Submissions</p>
                    {loadingSubs === form.id && (
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, i) => (
                          <div key={i} className="bg-white rounded-xl border border-gray-100 px-4 py-3 animate-pulse">
                            <div className="h-3 bg-gray-100 rounded w-48 mb-1" />
                            <div className="h-3 bg-gray-100 rounded w-64" />
                          </div>
                        ))}
                      </div>
                    )}
                    {!loadingSubs && (submissions[form.id] ?? []).length === 0 && (
                      <p className="text-sm text-gray-400 text-center py-4">No submissions yet.</p>
                    )}
                    <div className="space-y-2">
                      {(submissions[form.id] ?? []).map((sub) => {
                        const d = sub.data as Record<string, string>;
                        return (
                          <div key={sub.id} className="bg-white rounded-xl border border-gray-100 px-4 py-3 text-sm">
                            <div className="flex items-center justify-between gap-3 mb-1">
                              <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                                {d.name && <span className="font-medium text-gray-700">{d.name}</span>}
                                {d.email && <span>{d.email}</span>}
                              </div>
                              <span className="text-xs text-gray-400 shrink-0" suppressHydrationWarning>{timeAgo(sub.created_at)}</span>
                            </div>
                            {d.message && <p className="text-xs text-gray-600">{d.message}</p>}
                            {!d.name && !d.email && !d.message && (
                              <p className="text-xs text-gray-500 font-mono">{JSON.stringify(d)}</p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && forms.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <FileText className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="text-sm font-medium text-gray-500 mb-1">No forms yet</p>
          <p className="text-xs text-gray-400 mb-4">Create a form to start collecting submissions from your visitors.</p>
          <Button onClick={() => setShowNew(true)}>
            <Plus className="h-4 w-4 mr-2" /> Create Form
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title={`Delete "${deleteConfirm?.name}"?`}
        description="All submissions will be permanently lost. This cannot be undone."
        confirmLabel="Delete Form"
        onConfirm={() => {
          if (deleteConfirm) deleteForm(deleteConfirm.id, deleteConfirm.name);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
