"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe, FileText, RefreshCw, Rocket, AlertTriangle,
  Save, Trash2, ExternalLink, Check, Copy, Plus, X,
  Pencil, Home, CheckCircle2, XCircle, Loader2, Clock,
  ChevronLeft, ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteStore } from "@/store/site-store";
import type { Site } from "@/lib/types";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useWorkspaceStore } from "@/store/workspace-store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Redirect {
  id: string;
  from: string;
  to: string;
  type: "301" | "302";
}

interface DbDeployment {
  id: string;
  site_id: string;
  status: "building" | "success" | "failed";
  url: string | null;
  vercel_deployment_id: string | null;
  created_at: string;
  finished_at: string | null;
  error_message?: string | null;
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

const TABS = [
  { id: "general", label: "General" },
  { id: "domains", label: "Domains" },
  { id: "pages", label: "Pages" },
  { id: "redirects", label: "Redirects" },
  { id: "deployments", label: "Deployments" },
  { id: "danger", label: "Danger Zone" },
] as const;

type TabId = (typeof TABS)[number]["id"];

// ─── Layout primitives ────────────────────────────────────────────────────────

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-sm font-semibold text-gray-900">{title}</h2>
      <p className="text-sm text-gray-500 mt-0.5">{description}</p>
    </div>
  );
}

/** Vercel-style setting row: label+description on left, control on right */
function SettingRow({
  label,
  description,
  children,
  border = true,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-start gap-4 py-5", border && "border-b border-gray-100")}>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5 max-w-sm">{description}</p>}
      </div>
      <div className="sm:w-72 shrink-0">{children}</div>
    </div>
  );
}

function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("bg-white rounded-xl border border-gray-200 overflow-hidden", className)}>
      {children}
    </div>
  );
}

function CardBody({ children }: { children: React.ReactNode }) {
  return <div className="px-5">{children}</div>;
}

function CardFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-5 py-3 bg-gray-50 border-t border-gray-100 flex justify-end">
      {children}
    </div>
  );
}

function SaveButton({ saving, onClick }: { saving: boolean; onClick: () => void }) {
  return (
    <Button size="sm" onClick={onClick} disabled={saving} className="gap-1.5 text-xs bg-gray-900 hover:bg-gray-800 text-white">
      {saving
        ? <><div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
        : <><Save className="h-3.5 w-3.5" />Save</>}
    </Button>
  );
}

// ─── General tab ──────────────────────────────────────────────────────────────

function GeneralTab({ siteId, site, onSaved }: {
  siteId: string;
  site: Site;
  onSaved: (name: string, description: string) => void;
}) {
  const wfetch = useWorkspaceFetch();
  const [name, setName] = useState(site.name);
  const [description, setDescription] = useState(site.description ?? "");
  const [saving, setSaving] = useState(false);

  const save = async () => {
    if (!name.trim()) { toast.error("Name cannot be empty"); return; }
    setSaving(true);
    try {
      const res = await wfetch(`/api/v1/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description }),
      });
      if (!res.ok) throw new Error();
      onSaved(name.trim(), description);
      toast.success("Saved");
    } catch { toast.error("Failed to save"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="General" description="Basic information about your site." />

      <Card>
        <CardBody>
          <SettingRow label="Site Name" description="Displayed in the dashboard and used as the default page title.">
            <Input value={name} onChange={e => setName(e.target.value)} className="text-sm" />
          </SettingRow>
          <SettingRow label="Description" description="A short summary of your site." border={false}>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Optional description…"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </SettingRow>
        </CardBody>
        <CardFooter><SaveButton saving={saving} onClick={save} /></CardFooter>
      </Card>

      {/* Status — read-only */}
      <Card>
        <CardBody>
          <SettingRow label="Status" description="Current publish state of this site." border={false}>
            <div className="flex items-center gap-2 mt-1">
              <span className={cn(
                "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border",
                site.status === "published"
                  ? "text-green-700 bg-green-50 border-green-200"
                  : "text-amber-700 bg-amber-50 border-amber-200"
              )}>
                <span className={cn("h-1.5 w-1.5 rounded-full", site.status === "published" ? "bg-green-500 animate-pulse" : "bg-amber-400")} />
                {site.status === "published" ? "Published" : "Draft"}
              </span>
              {site.publishedAt && (
                <span className="text-xs text-gray-400" suppressHydrationWarning>
                  {new Date(site.publishedAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </SettingRow>
        </CardBody>
      </Card>
    </div>
  );
}

// ─── Domains tab ──────────────────────────────────────────────────────────────

function DomainsTab({ siteId, site, onSaved }: {
  siteId: string;
  site: Site;
  onSaved: (customDomain: string) => void;
}) {
  const wfetch = useWorkspaceFetch();
  const [customDomain, setCustomDomain] = useState(site.customDomain ?? "");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const subdomain = `${site.name.toLowerCase().replace(/\s+/g, "-")}.buildstack.site`;

  const copy = () => {
    navigator.clipboard.writeText(subdomain);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await wfetch(`/api/v1/sites/${siteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_domain: customDomain.trim() || null }),
      });
      if (!res.ok) throw new Error();
      onSaved(customDomain.trim());
      toast.success("Domain saved");
    } catch { toast.error("Failed to save domain"); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Domains" description="Manage the domains this site is served on." />

      {/* Subdomain */}
      <Card>
        <div className="px-5 py-3 border-b border-gray-100 flex items-center gap-2">
          <Check className="h-3.5 w-3.5 text-green-500" />
          <span className="text-xs font-semibold text-gray-700">Webperia Subdomain</span>
          <span className="ml-auto text-[10px] font-medium text-green-700 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Active</span>
        </div>
        <CardBody>
          <SettingRow label={subdomain} description="Your default buildstack.site subdomain." border={false}>
            <div className="flex gap-2">
              <button onClick={copy} className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3" />}
                {copied ? "Copied" : "Copy"}
              </button>
              {site.status === "published" && (
                <Link href={`/published/${siteId}`} target="_blank" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-800 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors">
                  <ArrowUpRight className="h-3 w-3" /> Visit
                </Link>
              )}
            </div>
          </SettingRow>
        </CardBody>
      </Card>

      {/* Custom domain */}
      <Card>
        <div className="px-5 py-3 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-700">Custom Domain</span>
        </div>
        <CardBody>
          <SettingRow label="Domain" description="Point your CNAME to cname.buildstack.site to connect a custom domain.">
            <Input
              value={customDomain}
              onChange={e => setCustomDomain(e.target.value)}
              placeholder="www.yourdomain.com"
              className="font-mono text-sm"
            />
          </SettingRow>
          {customDomain && (
            <SettingRow label="DNS Record" description="Add this record to your DNS provider." border={false}>
              <div className="rounded-lg border border-gray-200 overflow-hidden text-xs font-mono">
                <div className="grid grid-cols-3 gap-2 px-3 py-1.5 bg-gray-50 text-[10px] font-sans font-semibold uppercase tracking-wide text-gray-400">
                  <span>Type</span><span>Name</span><span>Value</span>
                </div>
                <div className="grid grid-cols-3 gap-2 px-3 py-2 text-gray-700">
                  <span>CNAME</span>
                  <span className="truncate">{customDomain.replace(/^www\./, "@")}</span>
                  <span className="truncate">cname.buildstack.site</span>
                </div>
              </div>
            </SettingRow>
          )}
        </CardBody>
        <CardFooter><SaveButton saving={saving} onClick={save} /></CardFooter>
      </Card>
    </div>
  );
}

// ─── Pages tab ────────────────────────────────────────────────────────────────

function PagesTab({ siteId, site }: { siteId: string; site: Site }) {
  const pages = site.pages ?? [];

  return (
    <div className="space-y-6">
      <SectionHeader title="Pages" description="All pages in this site. Manage content and structure in the editor." />

      <div className="flex justify-end">
        <Button size="sm" asChild className="gap-1.5 text-xs bg-gray-900 hover:bg-gray-800 text-white">
          <Link href={`/editor/${siteId}`}><Plus className="h-3.5 w-3.5" />Add Page in Editor</Link>
        </Button>
      </div>

      {pages.length === 0 ? (
        <Card>
          <div className="py-16 text-center">
            <FileText className="h-8 w-8 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">No pages yet</p>
            <p className="text-xs text-gray-400 mt-1 mb-4">Open the editor to create your first page.</p>
            <Button size="sm" variant="outline" asChild><Link href={`/editor/${siteId}`}>Open Editor</Link></Button>
          </div>
        </Card>
      ) : (
        <Card>
          {pages.map((page, i) => (
            <div key={page.id} className={cn("flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50 transition-colors", i > 0 && "border-t border-gray-100")}>
              <div className="h-7 w-7 rounded-md bg-gray-100 flex items-center justify-center shrink-0">
                {page.isHome ? <Home className="h-3.5 w-3.5 text-gray-500" /> : <FileText className="h-3.5 w-3.5 text-gray-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-900">{page.name}</span>
                  {page.isHome && (
                    <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full">Home</span>
                  )}
                </div>
                <span className="text-xs text-gray-400 font-mono">{page.slug ?? "/"}</span>
              </div>
              <Link href={`/editor/${siteId}`} className="text-xs text-gray-400 hover:text-indigo-600 transition-colors flex items-center gap-1">
                <Pencil className="h-3 w-3" />Edit
              </Link>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── Redirects tab ────────────────────────────────────────────────────────────

function RedirectsTab({ siteId }: { siteId: string }) {
  const { getSiteById, updateSite } = useSiteStore();
  const site = getSiteById(siteId);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [redirects, setRedirects] = useState<Redirect[]>((site as any)?.redirects ?? []);
  const [showAdd, setShowAdd] = useState(false);
  const [newFrom, setNewFrom] = useState("");
  const [newTo, setNewTo] = useState("");
  const [newType, setNewType] = useState<"301" | "302">("301");

  const persist = (next: Redirect[]) => {
    setRedirects(next);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    updateSite(siteId, { redirects: next } as any);
  };

  const add = () => {
    if (!newFrom.trim() || !newTo.trim()) { toast.error("Both source and destination are required"); return; }
    if (!newFrom.startsWith("/")) { toast.error("Source must start with /"); return; }
    persist([...redirects, { id: crypto.randomUUID(), from: newFrom.trim(), to: newTo.trim(), type: newType }]);
    setNewFrom(""); setNewTo(""); setNewType("301"); setShowAdd(false);
    toast.success("Redirect added");
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Redirects" description="Redirect visitors from old URLs to new ones. 301 is permanent, 302 is temporary." />

      <div className="flex justify-end">
        <Button size="sm" onClick={() => setShowAdd(v => !v)} className="gap-1.5 text-xs bg-gray-900 hover:bg-gray-800 text-white">
          <Plus className="h-3.5 w-3.5" />Add Redirect
        </Button>
      </div>

      {showAdd && (
        <Card>
          <CardBody>
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Source</Label>
                  <Input value={newFrom} onChange={e => setNewFrom(e.target.value)} placeholder="/old-page" className="font-mono text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-600 mb-1 block">Destination</Label>
                  <Input value={newTo} onChange={e => setNewTo(e.target.value)} placeholder="/new-page" className="font-mono text-sm" />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5 text-xs text-gray-600">
                  Type:
                  {(["301", "302"] as const).map(t => (
                    <button key={t} onClick={() => setNewType(t)} className={cn(
                      "px-2.5 py-1 rounded-md border text-xs font-mono transition-colors",
                      newType === t ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                    )}>{t}</button>
                  ))}
                </div>
                <div className="ml-auto flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowAdd(false)}>Cancel</Button>
                  <Button size="sm" onClick={add} className="bg-gray-900 hover:bg-gray-800 text-white">Add</Button>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      {redirects.length === 0 && !showAdd ? (
        <Card>
          <div className="py-16 text-center">
            <RefreshCw className="h-7 w-7 text-gray-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-gray-700">No redirects</p>
            <p className="text-xs text-gray-400 mt-1">Redirects help preserve SEO when URLs change.</p>
          </div>
        </Card>
      ) : redirects.length > 0 && (
        <Card>
          <div className="grid grid-cols-[1fr_1fr_56px_36px] gap-3 px-5 py-2 bg-gray-50 border-b border-gray-100 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
            <span>Source</span><span>Destination</span><span>Type</span><span />
          </div>
          {redirects.map((r, i) => (
            <div key={r.id} className={cn("grid grid-cols-[1fr_1fr_56px_36px] gap-3 items-center px-5 py-3", i > 0 && "border-t border-gray-100")}>
              <code className="text-sm text-gray-800 font-mono truncate">{r.from}</code>
              <code className="text-sm text-gray-500 font-mono truncate">{r.to}</code>
              <span className={cn("text-xs font-mono font-medium px-2 py-0.5 rounded border w-fit", r.type === "301" ? "text-indigo-700 bg-indigo-50 border-indigo-200" : "text-amber-700 bg-amber-50 border-amber-200")}>{r.type}</span>
              <button onClick={() => persist(redirects.filter(x => x.id !== r.id))} className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded hover:bg-red-50">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── Deployments tab ──────────────────────────────────────────────────────────

const DEPLOY_STATUS = {
  success: { icon: CheckCircle2, iconClass: "text-green-500", badge: "text-green-700 bg-green-50 border-green-200", label: "Published" },
  building: { icon: Loader2,      iconClass: "text-blue-500 animate-spin", badge: "text-blue-700 bg-blue-50 border-blue-200", label: "Building" },
  failed:   { icon: XCircle,      iconClass: "text-red-400", badge: "text-red-700 bg-red-50 border-red-200", label: "Failed" },
};

/** Returns a human-readable context message for a deployment row. */
function deployNote(d: DbDeployment): string | null {
  if (d.error_message) return d.error_message;
  if (d.status === "success" && !d.vercel_deployment_id)
    return "Published via built-in hosting. Connect Vercel to get an external URL.";
  if (d.status === "failed")
    return "Deployment failed. Check your Vercel project settings or server logs.";
  if (d.status === "building" && !d.vercel_deployment_id)
    return "Resolving… no external host configured. Refresh in a moment.";
  return null;
}

function DeploymentsTab({ siteId, site }: { siteId: string; site: Site }) {
  const [deployments, setDeployments] = useState<DbDeployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [publishing, setPublishing] = useState(false);
  // Track latest deployments in a ref so the poll interval can read it
  // without being listed as a dep (which would restart the interval on every fetch).
  const deploymentsRef = useRef<DbDeployment[]>([]);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    if (!silent) setError(null);
    try {
      const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
      const headers: HeadersInit = workspaceId ? { "x-workspace-id": workspaceId } : {};
      const res = await fetch(`/api/v1/sites/${siteId}/deployments`, { headers });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      const data: DbDeployment[] = json.data ?? [];
      deploymentsRef.current = data;
      setDeployments(data);
    } catch (e: unknown) {
      if (!silent) setError(e instanceof Error ? e.message : "Failed to load");
    } finally {
      if (!silent) setLoading(false);
    }
  }, [siteId]);

  // Initial load — only re-runs if siteId changes (load is stable).
  useEffect(() => { load(); }, [load]);

  // Polling — mounted once per siteId. Reads deploymentsRef so it never
  // needs deployments state as a dep, which would restart the interval
  // every time a fetch completed.
  useEffect(() => {
    const interval = setInterval(() => {
      // Only poll if there's a building deployment that has a vercel ID to check.
      // Ones without a vercel_deployment_id will be resolved by the API itself.
      const needsPoll = deploymentsRef.current.some(
        d => d.status === "building" && d.vercel_deployment_id
      );
      if (needsPoll) load(true);
    }, 5000);
    return () => clearInterval(interval);
  }, [siteId, load]);

  const handlePublish = async () => {
    setPublishing(true);
    toast.loading("Publishing…", { id: "pub" });
    try {
      const workspaceId = useWorkspaceStore.getState().activeWorkspaceId;
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(workspaceId ? { "x-workspace-id": workspaceId } : {}),
      };
      const res = await fetch(`/api/v1/sites/${siteId}/publish`, { method: "POST", headers });
      if (!res.ok) throw new Error();
      toast.success("Published!", { id: "pub" });
      useSiteStore.getState().updateSite(siteId, { status: "published", publishedAt: new Date() });
      // Do NOT overwrite published-site-${siteId} here — that snapshot is
      // written by the editor toolbar which has access to the live canvas
      // elements. Overwriting it with the site store object (which only has
      // metadata) would blank out all page content.
      await load();
    } catch { toast.error("Publish failed", { id: "pub" }); }
    finally { setPublishing(false); }
  };

  const latest = deployments[0];

  return (
    <div className="space-y-6">
      <SectionHeader title="Deployments" description="Every time you publish, a new deployment is created." />

      {/* Current production status */}
      <Card>
        <div className="px-5 py-3 border-b border-gray-100">
          <span className="text-xs font-semibold text-gray-700">Production Deployment</span>
        </div>
        <div className="px-5 py-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className={cn("h-2 w-2 rounded-full", site.status === "published" ? "bg-green-500 animate-pulse" : "bg-amber-400")} />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {site.status === "published" ? "Live" : "Not published"}
              </p>
              {latest && (
                <p className="text-xs text-gray-400 font-mono mt-0.5" suppressHydrationWarning>
                  {latest.id.slice(0, 8)} · {new Date(latest.created_at).toLocaleString()}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {site.status === "published" && (
              <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
                <Link href={`/published/${siteId}`} target="_blank" rel="noopener noreferrer">
                  <Globe className="h-3.5 w-3.5" />View Live<ArrowUpRight className="h-3 w-3 opacity-60" />
                </Link>
              </Button>
            )}
            <Button size="sm" onClick={handlePublish} disabled={publishing} className="gap-1.5 text-xs bg-gray-900 hover:bg-gray-800 text-white">
              {publishing
                ? <><div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />Publishing…</>
                : <><Rocket className="h-3.5 w-3.5" />{site.status === "published" ? "Redeploy" : "Publish Now"}</>}
            </Button>
          </div>
        </div>
      </Card>

      {/* Deployment list */}
      <div>
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Deployment History</p>
        {loading ? (
          <Card>
            <div className="py-14 flex flex-col items-center gap-2">
              <div className="h-5 w-5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
              <p className="text-xs text-gray-400">Loading deployments…</p>
            </div>
          </Card>
        ) : error ? (
          <Card>
            <div className="py-10 text-center">
              <XCircle className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-600">{error}</p>
              <Button onClick={() => load()} className="text-xs text-indigo-600 hover:underline mt-2">Retry</Button>
            </div>
          </Card>
        ) : deployments.length === 0 ? (
          <Card>
            <div className="py-14 text-center">
              <Rocket className="h-7 w-7 text-gray-300 mx-auto mb-3" />
              <p className="text-sm font-medium text-gray-700">No deployments yet</p>
              <p className="text-xs text-gray-400 mt-1">Click "Publish Now" to create your first deployment.</p>
            </div>
          </Card>
        ) : (
          <Card>
            {deployments.map((d, i) => {
              const cfg = DEPLOY_STATUS[d.status] ?? DEPLOY_STATUS.building;
              const Icon = cfg.icon;
              const note = deployNote(d);
              const durationMs =
                d.finished_at && d.created_at
                  ? new Date(d.finished_at).getTime() - new Date(d.created_at).getTime()
                  : null;
              const durationSec = durationMs !== null ? Math.round(durationMs / 1000) : null;

              return (
                <div key={d.id} className={cn("flex items-start gap-4 px-5 py-4", i > 0 && "border-t border-gray-100")}>
                  <Icon className={cn("h-4 w-4 mt-0.5 shrink-0", cfg.iconClass)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900 font-mono">{d.id.slice(0, 8)}</span>
                      {i === 0 && <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-full">Latest</span>}
                      <span className={cn("text-[10px] font-medium px-1.5 py-0.5 rounded-full border", cfg.badge)}>{cfg.label}</span>
                      {!d.vercel_deployment_id && (
                        <span className="text-[10px] font-medium text-gray-400 bg-gray-100 border border-gray-200 px-1.5 py-0.5 rounded-full">
                          Built-in hosting
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                      <span className="flex items-center gap-1" suppressHydrationWarning>
                        <Clock className="h-3 w-3" />{new Date(d.created_at).toLocaleString()}
                      </span>
                      {durationSec !== null && (
                        <span>{durationSec}s</span>
                      )}
                      {d.url && (
                        <a href={d.url} target="_blank" rel="noopener noreferrer" className="font-mono hover:text-indigo-600 flex items-center gap-1 truncate max-w-[200px]">
                          {d.url}<ExternalLink className="h-2.5 w-2.5 shrink-0" />
                        </a>
                      )}
                    </div>
                    {note && (
                      <p className={cn(
                        "mt-1.5 text-[11px] leading-relaxed",
                        d.status === "failed" ? "text-red-600" : "text-gray-400"
                      )}>
                        {note}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/published/${siteId}`}
                    target="_blank"
                    className="text-xs text-gray-400 hover:text-indigo-600 transition-colors shrink-0 flex items-center gap-1"
                  >
                    <Globe className="h-3.5 w-3.5" />Visit
                  </Link>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Danger Zone tab ──────────────────────────────────────────────────────────

function DangerTab({ siteId, siteName }: { siteId: string; siteName: string }) {
  const wfetch = useWorkspaceFetch();
  const router = useRouter();
  const { deleteSite } = useSiteStore();
  const [confirm, setConfirm] = useState("");
  const [deleting, setDeleting] = useState(false);

  const del = async () => {
    if (confirm !== siteName) { toast.error("Name doesn't match"); return; }
    setDeleting(true);
    try {
      const res = await wfetch(`/api/v1/sites/${siteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      deleteSite(siteId);
      router.push("/dashboard/sites");
      toast.success("Site deleted");
    } catch { toast.error("Failed to delete site"); setDeleting(false); }
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="Danger Zone" description="These actions are permanent and cannot be undone." />

      <div className="rounded-xl border border-red-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-100 bg-red-50/50 flex items-start gap-3">
          <AlertTriangle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-red-800">Delete this site</p>
            <p className="text-xs text-red-600 mt-0.5">
              Permanently deletes all pages, assets, deployments, and CMS data for this site.
            </p>
          </div>
        </div>
        <div className="px-5 py-4 space-y-3 bg-white">
          <Label className="text-xs font-medium text-gray-700 block">
            Type <code className="font-mono bg-gray-100 px-1 rounded">{siteName}</code> to confirm
          </Label>
          <Input
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            placeholder={siteName}
            className="max-w-xs font-mono text-sm border-red-200 focus-visible:ring-red-400"
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={del}
            disabled={confirm !== siteName || deleting}
            className="gap-1.5"
          >
            {deleting
              ? <><div className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />Deleting…</>
              : <><Trash2 className="h-3.5 w-3.5" />Delete Site</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SiteSettingsPage() {
  const params = useParams();
  const siteId = params.siteId as string;
  const { getSiteById, updateSite } = useSiteStore();
  const site = getSiteById(siteId);
  const [tab, setTab] = useState<TabId>("general");

  if (!site) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-gray-500 mb-3">Site not found</p>
          <Button size="sm" variant="outline" asChild>
            <Link href="/dashboard/sites">Back to Sites</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 lg:px-8">
          <div className="flex items-center gap-4 h-14">
            <Link href="/dashboard/sites" className="text-gray-400 hover:text-gray-700 transition-colors">
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-sm font-semibold text-gray-900 truncate">{site.name}</span>
              <span className={cn(
                "inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0",
                site.status === "published"
                  ? "text-green-700 bg-green-50 border-green-200"
                  : "text-amber-700 bg-amber-50 border-amber-200"
              )}>
                <span className={cn("h-1 w-1 rounded-full", site.status === "published" ? "bg-green-500 animate-pulse" : "bg-amber-400")} />
                {site.status === "published" ? "Live" : "Draft"}
              </span>
            </div>
            <div className="ml-auto flex items-center gap-2 shrink-0">
              {site.status === "published" && (
                <Button size="sm" variant="outline" asChild className="gap-1.5 text-xs">
                  <Link href={`/published/${siteId}`} target="_blank" rel="noopener noreferrer">
                    <Globe className="h-3.5 w-3.5" />View Live
                  </Link>
                </Button>
              )}
              <Button size="sm" asChild className="gap-1.5 text-xs bg-gray-900 hover:bg-gray-800 text-white">
                <Link href={`/editor/${siteId}`}>
                  <Pencil className="h-3.5 w-3.5" />Edit
                </Link>
              </Button>
            </div>
          </div>

          {/* Tab bar */}
          <div className="flex items-center gap-0 -mb-px overflow-x-auto no-scrollbar">
            {TABS.map(t => {
              const isDanger = t.id === "danger";
              const isActive = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "px-4 py-2.5 text-sm font-medium border-b-2 whitespace-nowrap transition-colors",
                    isActive && !isDanger && "border-gray-900 text-gray-900",
                    isActive && isDanger && "border-red-500 text-red-600",
                    !isActive && !isDanger && "border-transparent text-gray-500 hover:text-gray-800 hover:border-gray-300",
                    !isActive && isDanger && "border-transparent text-red-400 hover:text-red-600",
                  )}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        {tab === "general" && (
          <GeneralTab
            siteId={siteId}
            site={site}
            onSaved={(name, description) => updateSite(siteId, { name, description })}
          />
        )}
        {tab === "domains" && (
          <DomainsTab
            siteId={siteId}
            site={site}
            onSaved={customDomain => updateSite(siteId, { customDomain })}
          />
        )}
        {tab === "pages" && <PagesTab siteId={siteId} site={site} />}
        {tab === "redirects" && <RedirectsTab siteId={siteId} />}
        {tab === "deployments" && <DeploymentsTab siteId={siteId} site={site} />}
        {tab === "danger" && <DangerTab siteId={siteId} siteName={site.name} />}
      </div>
    </div>
  );
}
