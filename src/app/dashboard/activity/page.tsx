"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Rocket, Pencil, UserPlus, AlertCircle, CreditCard, Globe, Download, Filter, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ActivityType = "publish" | "edit" | "team" | "billing" | "deploy_failed" | "create";

interface Activity {
  id: string;
  action_type: ActivityType;
  description: string;
  site_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  users: { id: string; name: string | null; email: string; avatar_url: string | null } | null;
}

const TYPE_CONFIG: Record<ActivityType, { icon: React.ElementType; bg: string; color: string; label: string }> = {
  publish:        { icon: Rocket,       bg: "bg-emerald-100", color: "text-emerald-600", label: "Deploys" },
  edit:           { icon: Pencil,       bg: "bg-blue-100",    color: "text-blue-600",    label: "Edits" },
  create:         { icon: Pencil,       bg: "bg-blue-100",    color: "text-blue-600",    label: "Edits" },
  team:           { icon: UserPlus,     bg: "bg-purple-100",  color: "text-purple-600",  label: "Team" },
  billing:        { icon: CreditCard,   bg: "bg-amber-100",   color: "text-amber-600",   label: "Billing" },
  deploy_failed:  { icon: AlertCircle,  bg: "bg-red-100",     color: "text-red-600",     label: "Deploys" },
};

const FILTERS = ["All", "Deploys", "Edits", "Team", "Billing"] as const;
type Filter = typeof FILTERS[number];

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function initials(name: string | null | undefined, email: string): string {
  if (name) return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  return email.slice(0, 2).toUpperCase();
}

export default function ActivityPage() {
  const [filter, setFilter] = useState<Filter>("All");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/activity?filter=${filter}&limit=50`);
      const json = await res.json();
      setActivities(json.activities ?? []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Activity Log</h1>
          <p className="text-sm text-gray-500 mt-1">All team actions across your workspace</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-3.5 w-3.5" /> Export
          </Button>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
              filter === f ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-start gap-4 pl-14 py-3 animate-pulse">
              <div className="absolute left-0 h-10 w-10 rounded-xl bg-gray-100" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-100 rounded w-48" />
                <div className="h-3 bg-gray-100 rounded w-64" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Timeline */}
      {!loading && activities.length > 0 && (
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-1">
            {activities.map((activity) => {
              const cfg = TYPE_CONFIG[activity.action_type] ?? TYPE_CONFIG.edit;
              const user = activity.users;
              const userName = user?.name ?? user?.email ?? "System";
              const userInitials = initials(user?.name, user?.email ?? "SY");
              return (
                <div key={activity.id} className="relative flex items-start gap-4 pl-14 py-3 hover:bg-gray-50/50 rounded-xl transition-colors group">
                  <div className={`absolute left-0 h-10 w-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0 border-2 border-white`}>
                    <cfg.icon className={`h-4 w-4 ${cfg.color}`} />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-[9px] bg-indigo-100 text-indigo-700">{userInitials}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold text-gray-800">{userName}</span>
                          {activity.site_id && (
                            <span className="flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                              <Globe className="h-2.5 w-2.5" />
                              {(activity.metadata?.siteName as string) ?? "Site"}
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{activity.description}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0 mt-0.5" suppressHydrationWarning>{timeAgo(activity.created_at)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {!loading && activities.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <Filter className="h-8 w-8 mx-auto mb-3 opacity-30" />
          <p className="text-sm font-medium text-gray-500 mb-1">No activity yet</p>
          <p className="text-xs">Actions like publishing sites, inviting members, and editing pages will appear here.</p>
        </div>
      )}
    </div>
  );
}
