"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Plus, Search, Globe, Pencil, ExternalLink, MoreHorizontal,
  Copy, Archive, BarChart2, Settings, CheckCircle2,
  Clock, Grid3X3, List, Send, RefreshCw, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

const PLAN_SITE_LIMITS: Record<string, number> = {
  free: 2, pro: 10, business: 999, enterprise: 999,
};

// Gradient palette for sites without a stored gradient
const GRADIENTS = [
  "from-indigo-500 to-purple-600",
  "from-pink-500 to-rose-600",
  "from-teal-500 to-cyan-600",
  "from-amber-500 to-orange-600",
  "from-green-500 to-emerald-600",
  "from-blue-500 to-sky-600",
];

function siteGradient(id: string) {
  const idx = id.charCodeAt(id.length - 1) % GRADIENTS.length;
  return GRADIENTS[idx];
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  if (status === "published") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
        <CheckCircle2 className="h-3 w-3" /> Published
      </span>
    );
  }
  if (status === "draft") {
    return (
      <span className="flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
        <Clock className="h-3 w-3" /> Draft
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-200 px-2 py-0.5 rounded-full">
      <Archive className="h-3 w-3" /> Archived
    </span>
  );
}

interface ApiSite {
  id: string;
  name: string;
  slug: string;
  status: "draft" | "published" | "archived";
  domain: string | null;
  custom_domain: string | null;
  team_id: string | null;
  owner_id: string;
  updated_at: string;
  created_at: string;
}

// ─── Site card (grid view) ────────────────────────────────────────────────────

function SiteCard({ site, onStatusChange, onDuplicate }: {
  site: ApiSite;
  onStatusChange: (id: string, status: ApiSite["status"]) => void;
  onDuplicate: (id: string) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const gradient = siteGradient(site.id);
  const domain = site.custom_domain ?? site.domain;

  return (
    <div className="group relative bg-white rounded-2xl border border-gray-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-200">
      {/* Thumbnail */}
      <div className={`h-40 bg-gradient-to-br ${gradient} relative rounded-t-2xl overflow-hidden`}>
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <Globe className="h-20 w-20 text-white" />
        </div>
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
          <Link href={`/editor/${site.id}`}>
            <Button size="sm" className="h-8 bg-white text-gray-900 hover:bg-gray-50 shadow-md text-xs">
              <Pencil className="h-3.5 w-3.5 mr-1.5" /> Edit
            </Button>
          </Link>
          {site.status === "published" && domain && (
            <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
              <Button size="sm" className="h-8 bg-white text-gray-900 hover:bg-gray-50 shadow-md text-xs">
                <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Visit
              </Button>
            </a>
          )}
        </div>
        {/* Status pill */}
        <div className="absolute top-3 left-3">
          <StatusBadge status={site.status} />
        </div>
      </div>

      {/* Menu — positioned outside thumbnail so dropdown isn't clipped by overflow-hidden */}
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="h-7 w-7 rounded-lg bg-white/90 backdrop-blur flex items-center justify-center text-gray-500 hover:text-gray-800 opacity-0 group-hover:opacity-100 transition-all shadow-sm"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
        {menuOpen && (
          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-xl z-[9999] py-1">
            <Link
              href={`/editor/${site.id}`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5 opacity-60" /> Edit Site
            </Link>
            <Link
              href={`/dashboard/sites/${site.id}/settings`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-3.5 w-3.5 opacity-60" /> Site Settings
            </Link>
            <Link
              href={`/dashboard/sites/${site.id}/analytics`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <BarChart2 className="h-3.5 w-3.5 opacity-60" /> Analytics
            </Link>
            <button
              onClick={() => { onDuplicate(site.id); setMenuOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Copy className="h-3.5 w-3.5 opacity-60" /> Clone Site
            </button>
            <div className="border-t border-gray-100 my-1" />
            {site.status !== "published" && (
              <button
                onClick={() => { onStatusChange(site.id, "published"); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors"
              >
                <Send className="h-3.5 w-3.5" /> Publish
              </button>
            )}
            {site.status === "published" && (
              <button
                onClick={() => { onStatusChange(site.id, "draft"); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-amber-700 hover:bg-amber-50 transition-colors"
              >
                <Clock className="h-3.5 w-3.5" /> Unpublish
              </button>
            )}
            {site.status !== "archived" && (
              <button
                onClick={() => { onStatusChange(site.id, "archived"); setMenuOpen(false); }}
                className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Archive className="h-3.5 w-3.5 opacity-60" /> Archive
              </button>
            )}
            <div className="border-t border-gray-100 my-1" />
            <Link
              href={`/dashboard/sites/${site.id}/settings`}
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-3.5 w-3.5 opacity-60" /> Settings
            </Link>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <Link href={`/dashboard/sites/${site.id}`} className="font-semibold text-gray-900 text-sm truncate mb-1 hover:text-indigo-600 transition-colors block">
          {site.name}
        </Link>
        <p className="text-xs text-gray-400 truncate mb-3">
          {domain ?? "No domain connected"}
        </p>
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span className="truncate">{site.slug}</span>
          <span suppressHydrationWarning>Updated {new Date(site.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Site row (list view) ─────────────────────────────────────────────────────

function SiteRow({ site }: { site: ApiSite }) {
  const gradient = siteGradient(site.id);
  const domain = site.custom_domain ?? site.domain;

  return (
    <div className="flex items-center gap-4 px-4 py-3 bg-white rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/20 transition-all">
      <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${gradient} shrink-0 flex items-center justify-center`}>
        <Globe className="h-5 w-5 text-white/70" />
      </div>
      <div className="flex-1 min-w-0">
        <Link href={`/dashboard/sites/${site.id}`} className="text-sm font-semibold text-gray-900 truncate hover:text-indigo-600 transition-colors">
          {site.name}
        </Link>
        <p className="text-xs text-gray-400 truncate">{domain ?? "No domain"}</p>
      </div>
      <StatusBadge status={site.status} />
      <span className="text-xs text-gray-400 hidden lg:block w-32 text-right" suppressHydrationWarning>
        {new Date(site.updated_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
      </span>
      <div className="flex items-center gap-2 ml-2">
        <Link href={`/editor/${site.id}`}>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Pencil className="h-3 w-3 mr-1" /> Edit
          </Button>
        </Link>
        {site.status === "published" && domain && (
          <a href={`https://${domain}`} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm" className="h-7 text-xs">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        )}
        <Link href={`/dashboard/sites/${site.id}/settings`}>
          <Button variant="outline" size="sm" className="h-7 text-xs">
            <Settings className="h-3 w-3" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SitesPage() {
  const wfetch = useWorkspaceFetch();
  const { activeWorkspaceId } = useWorkspaceStore();
  const { profile } = useUser();
  const [sites, setSites] = useState<ApiSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "archived">("all");

  const siteLimit = PLAN_SITE_LIMITS[profile?.plan ?? "free"] ?? 2;
  const activeSiteCount = sites.filter((s) => s.status !== "archived").length;
  const atLimit = !loading && activeSiteCount >= siteLimit;

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wfetch("/api/v1/sites");
      const json = await res.json();
      setSites(json.data ?? []);
    } catch {
      toast.error("Failed to load sites");
    } finally {
      setLoading(false);
    }
  }, [wfetch]);

  useEffect(() => { load(); }, [load, activeWorkspaceId]);

  const handleDuplicate = async (id: string) => {
    try {
      const res = await wfetch(`/api/v1/sites/${id}/duplicate`, { method: "POST" });
      const { site } = await res.json();
      if (site) setSites((prev) => [...prev, site]);
      toast.success("Site duplicated!");
    } catch {
      toast.error("Failed to duplicate site");
    }
  };

  const handleStatusChange = async (id: string, status: ApiSite["status"]) => {
    try {
      await wfetch(`/api/v1/sites/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      setSites((prev) => prev.map((s) => s.id === id ? { ...s, status } : s));
      toast.success(status === "published" ? "Site published!" : status === "draft" ? "Site unpublished" : "Site archived");
    } catch {
      toast.error("Failed to update site status");
    }
  };

  const filtered = sites.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Sites</h1>
          <p className="text-sm text-gray-500 mt-0.5">{loading ? "Loading…" : `${sites.length} site${sites.length !== 1 ? "s" : ""}`}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
          {atLimit ? (
            <div className="flex items-center gap-2">
              <Button className="gap-2 opacity-50 cursor-not-allowed" disabled>
                <Plus className="h-4 w-4" /> New Site
              </Button>
              <Link href="/dashboard/billing">
                <Button variant="outline" size="sm" className="gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                  Upgrade plan
                </Button>
              </Link>
            </div>
          ) : (
            <Link href="/dashboard/sites/new">
              <Button className="gap-2">
                <Plus className="h-4 w-4" /> New Site
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="search"
            placeholder="Search sites..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
          />
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
          {(["all", "published", "draft", "archived"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={cn("px-3 py-1 rounded-md text-xs font-medium transition-colors capitalize",
                filter === f ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 ml-auto">
          <button onClick={() => setView("grid")} className={cn("p-1.5 rounded-md transition-colors", view === "grid" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600")}>
            <Grid3X3 className="h-3.5 w-3.5" />
          </button>
          <button onClick={() => setView("list")} className={cn("p-1.5 rounded-md transition-colors", view === "list" ? "bg-white shadow-sm text-gray-800" : "text-gray-400 hover:text-gray-600")}>
            <List className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
              <div className="h-40 bg-gray-100" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Sites */}
      {!loading && filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-sm font-medium">No sites found</p>
          {search && (
            <button onClick={() => setSearch("")} className="text-xs text-indigo-500 mt-2 hover:underline">Clear search</button>
          )}
        </div>
      ) : !loading && view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((site) => (
            <SiteCard key={site.id} site={site} onStatusChange={handleStatusChange} onDuplicate={handleDuplicate} />
          ))}
          {atLimit ? (
            <Link href="/dashboard/billing" className="group bg-amber-50 rounded-2xl border-2 border-dashed border-amber-200 hover:border-amber-300 hover:bg-amber-100/40 transition-all flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-10 w-10 rounded-full bg-amber-100 group-hover:bg-amber-200 flex items-center justify-center transition-colors">
                <ArrowRight className="h-5 w-5 text-amber-500" />
              </div>
              <span className="text-sm font-medium text-amber-600">Plan limit reached</span>
              <span className="text-xs text-amber-500 group-hover:underline">Upgrade to add more sites</span>
            </Link>
          ) : (
            <Link href="/dashboard/sites/new" className="group bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all flex flex-col items-center justify-center py-16 gap-3">
              <div className="h-10 w-10 rounded-full bg-gray-200 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                <Plus className="h-5 w-5 text-gray-400 group-hover:text-indigo-600" />
              </div>
              <span className="text-sm font-medium text-gray-400 group-hover:text-indigo-600 transition-colors">New Site</span>
            </Link>
          )}
        </div>
      ) : !loading ? (
        <div className="space-y-2">
          {filtered.map((site) => <SiteRow key={site.id} site={site} />)}
        </div>
      ) : null}
    </div>
  );
}
