"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollText, RefreshCw, Globe, Users, FileEdit, Zap, CreditCard,
  Database, ChevronLeft, ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";

const FILTERS = ["All", "Deploys", "Edits", "Team", "Billing"] as const;
type Filter = (typeof FILTERS)[number];

const TYPE_META: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  publish:        { icon: Zap,      color: "text-emerald-600 bg-emerald-50",  label: "Deploy"  },
  deploy_failed:  { icon: Zap,      color: "text-red-600 bg-red-50",          label: "Failed"  },
  edit:           { icon: FileEdit, color: "text-blue-600 bg-blue-50",        label: "Edit"    },
  create:         { icon: FileEdit, color: "text-indigo-600 bg-indigo-50",    label: "Create"  },
  delete:         { icon: FileEdit, color: "text-red-500 bg-red-50",          label: "Delete"  },
  team:           { icon: Users,    color: "text-purple-600 bg-purple-50",    label: "Team"    },
  billing:        { icon: CreditCard, color: "text-amber-600 bg-amber-50",    label: "Billing" },
  site:           { icon: Globe,    color: "text-sky-600 bg-sky-50",          label: "Site"    },
  cms:            { icon: Database, color: "text-teal-600 bg-teal-50",        label: "CMS"     },
};

function typeMeta(type: string) {
  return TYPE_META[type] ?? { icon: ScrollText, color: "text-gray-500 bg-gray-100", label: type };
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)   return "just now";
  if (mins < 60)  return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)   return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)   return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

interface Activity {
  id: string;
  action_type: string;
  description: string;
  site_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  users: { id: string; name: string | null; email: string; avatar_url: string | null } | null;
}

const PAGE_SIZE = 20;

export default function LogsPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const wfetch = useWorkspaceFetch();
  const [filter, setFilter] = useState<Filter>("All");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const load = useCallback(async (f: Filter, p: number) => {
    setLoading(true);
    try {
      const limit = PAGE_SIZE + 1; // fetch one extra to detect next page
      const offset = p * PAGE_SIZE;
      const params = new URLSearchParams({ filter: f, limit: String(limit), offset: String(offset) });
      const res = await wfetch(`/api/v1/activity?${params}`);
      if (!res.ok) throw new Error();
      const json = await res.json();
      const rows: Activity[] = json.activities ?? [];
      setHasMore(rows.length > PAGE_SIZE);
      setActivities(rows.slice(0, PAGE_SIZE));
    } catch {
      setActivities([]);
    } finally {
      setLoading(false);
    }
  }, [wfetch]);

  useEffect(() => {
    setPage(0);
    load(filter, 0);
  }, [filter, load]);

  const changePage = (next: number) => {
    setPage(next);
    load(filter, next);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-sm text-gray-500 mt-1">
            All workspace actions recorded in real time
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => load(filter, page)} disabled={loading}>
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-gray-100/80 rounded-xl p-1 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
              filter === f
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Log list */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="divide-y divide-gray-50">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-start gap-4 px-5 py-4 animate-pulse">
                <div className="h-8 w-8 rounded-xl bg-gray-100 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-48" />
                  <div className="h-3 bg-gray-100 rounded w-64" />
                </div>
                <div className="h-3 bg-gray-100 rounded w-16 mt-0.5" />
              </div>
            ))}
          </div>
        ) : activities.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
            <div className="h-12 w-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <ScrollText className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">No activity yet</p>
              <p className="text-xs text-gray-400 mt-1">Actions in your workspace will appear here.</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {activities.map((a) => {
              const meta = typeMeta(a.action_type);
              const Icon = meta.icon;
              const actor = a.users?.name ?? a.users?.email ?? "Unknown";
              return (
                <div key={a.id} className="flex items-start gap-4 px-5 py-4 hover:bg-gray-50/50 transition-colors">
                  <div className={cn("h-8 w-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5", meta.color)}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-800 leading-snug">{a.description}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-gray-400">{actor}</span>
                      {Boolean(a.metadata?.workspaceName) && (
                        <>
                          <span className="text-gray-200">·</span>
                          <span className="text-xs text-gray-400">{String(a.metadata.workspaceName)}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 shrink-0">
                    <span className="text-[10px] font-medium text-gray-400" suppressHydrationWarning>{timeAgo(a.created_at)}</span>
                    <span className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-full",
                      meta.color
                    )}>
                      {meta.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {!loading && (page > 0 || hasMore) && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
            <Button
              variant="outline" size="sm"
              onClick={() => changePage(page - 1)}
              disabled={page === 0}
              className="gap-1.5 text-xs"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Previous
            </Button>
            <span className="text-xs text-gray-400">Page {page + 1}</span>
            <Button
              variant="outline" size="sm"
              onClick={() => changePage(page + 1)}
              disabled={!hasMore}
              className="gap-1.5 text-xs"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
