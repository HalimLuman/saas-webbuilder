"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Plus, FileText, Users, ShoppingBag, MessageSquare, Settings,
  PenSquare, Eye, Database, FolderOpen, Trash2, X, RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useWorkspaceStore } from "@/store/workspace-store";

interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  site_id: string | null;
  itemCount: number;
  publishedCount: number;
  draftCount: number;
  created_at: string;
  updated_at: string;
}

const ICON_MAP: Record<string, { icon: React.ElementType; iconColor: string; iconBg: string }> = {
  default:     { icon: Database,      iconColor: "text-indigo-600", iconBg: "bg-indigo-100" },
  blog:        { icon: FileText,      iconColor: "text-blue-600",   iconBg: "bg-blue-100" },
  team:        { icon: Users,         iconColor: "text-green-600",  iconBg: "bg-green-100" },
  product:     { icon: ShoppingBag,   iconColor: "text-purple-600", iconBg: "bg-purple-100" },
  testimonial: { icon: MessageSquare, iconColor: "text-orange-600", iconBg: "bg-orange-100" },
};

function getIconConfig(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("blog") || lower.includes("post") || lower.includes("article")) return ICON_MAP.blog;
  if (lower.includes("team") || lower.includes("member") || lower.includes("people")) return ICON_MAP.team;
  if (lower.includes("product") || lower.includes("catalog")) return ICON_MAP.product;
  if (lower.includes("testimonial") || lower.includes("review")) return ICON_MAP.testimonial;
  return ICON_MAP.default;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d === 1) return "1 day ago";
  if (d < 7) return `${d} days ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function CMSPage() {
  const router = useRouter();
  const wfetch = useWorkspaceFetch();
  const { activeWorkspaceId } = useWorkspaceStore();
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: string; name: string } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await wfetch("/api/v1/cms/collections");
      const json = await res.json();
      setCollections(json.collections ?? []);
    } catch {
      toast.error("Failed to load collections");
    } finally {
      setLoading(false);
    }
  }, [wfetch]);

  useEffect(() => { load(); }, [load, activeWorkspaceId]);

  const createCollection = async () => {
    if (!newName.trim()) return;
    setCreating(true);
    try {
      const res = await wfetch("/api/v1/cms/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, description: newDesc }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`Collection "${newName}" created`);
      setShowNew(false);
      setNewName("");
      setNewDesc("");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setCreating(false);
    }
  };

  const deleteCollection = async (id: string, name: string) => {
    try {
      const res = await wfetch(`/api/v1/cms/collections?collectionId=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`"${name}" deleted`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const total     = collections.reduce((s, c) => s + c.itemCount, 0);
  const published = collections.reduce((s, c) => s + c.publishedCount, 0);
  const drafts    = collections.reduce((s, c) => s + c.draftCount, 0);

  const stats = [
    { label: "Total Collections", value: String(collections.length), icon: Database,   color: "text-indigo-600", bg: "bg-indigo-50",  border: "border-indigo-100" },
    { label: "Total Items",        value: String(total),              icon: FolderOpen, color: "text-blue-600",   bg: "bg-blue-50",    border: "border-blue-100" },
    { label: "Published",          value: String(published),          icon: Eye,        color: "text-green-600",  bg: "bg-green-50",   border: "border-green-100" },
    { label: "Drafts",             value: String(drafts),             icon: FileText,   color: "text-yellow-600", bg: "bg-yellow-50",  border: "border-yellow-100" },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your content collections and structured data</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
          <Button onClick={() => setShowNew(true)}>
            <Plus className="mr-2 h-4 w-4" /> New Collection
          </Button>
        </div>
      </div>

      {/* New collection inline form */}
      {showNew && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">New Collection</h3>
          <div className="flex gap-3">
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && createCollection()}
              placeholder="e.g. Blog Posts"
              className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
            <input
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Description (optional)"
              className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Button size="sm" onClick={createCollection} disabled={creating}>
              {creating ? "Creating…" : "Create"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setShowNew(false); setNewName(""); setNewDesc(""); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className={cn("rounded-xl p-5 bg-white border flex items-center gap-4", stat.border)}>
            <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", stat.bg)}>
              <stat.icon className={cn("h-5 w-5", stat.color)} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{loading ? "—" : stat.value}</div>
              <div className="text-xs text-gray-500">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-11 w-11 rounded-xl bg-gray-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-100 rounded w-32" />
                  <div className="h-3 bg-gray-100 rounded w-48" />
                </div>
              </div>
              <div className="h-3 bg-gray-100 rounded w-24 mb-6" />
              <div className="border-t border-gray-100 pt-4 flex gap-2">
                <div className="h-8 bg-gray-100 rounded flex-1" />
                <div className="h-8 bg-gray-100 rounded flex-1" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Collections grid */}
      {!loading && collections.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {collections.map((collection) => {
            const { icon: Icon, iconColor, iconBg } = getIconConfig(collection.name);
            return (
              <div key={collection.id} className="bg-white rounded-2xl border border-gray-200 p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 group">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center flex-shrink-0", iconBg)}>
                      <Icon className={cn("h-5 w-5", iconColor)} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-base">{collection.name}</h3>
                      <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{collection.description || "No description"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => router.push(`/dashboard/cms/${collection.id}?panel=schema`)}
                      className="h-8 w-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
                      title="Edit schema"
                    >
                      <Settings className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({ id: collection.id, name: collection.name })}
                      className="h-8 w-8 rounded-lg hover:bg-red-50 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-sm font-medium text-gray-700">{collection.itemCount} items</span>
                  <span className="text-gray-300">·</span>
                  <Badge variant="published" className="text-xs">{collection.publishedCount} published</Badge>
                  {collection.draftCount > 0 && (
                    <Badge variant="draft" className="text-xs">{collection.draftCount} drafts</Badge>
                  )}
                </div>

                <p className="text-xs text-gray-400 mb-5" suppressHydrationWarning>Last updated {timeAgo(collection.updated_at)}</p>

                <div className="border-t border-gray-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm" variant="outline" className="flex-1 h-8 text-xs"
                      onClick={() => router.push(`/dashboard/cms/${collection.id}?action=add`)}
                    >
                      <Plus className="h-3.5 w-3.5 mr-1.5" /> Add Item
                    </Button>
                    <Button
                      size="sm" className="flex-1 h-8 text-xs"
                      onClick={() => router.push(`/dashboard/cms/${collection.id}`)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1.5" /> View Items
                    </Button>
                    <button
                      onClick={() => router.push(`/dashboard/cms/${collection.id}?panel=schema`)}
                      className="h-8 w-8 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center justify-center transition-colors"
                      title="Edit schema"
                    >
                      <PenSquare className="h-3.5 w-3.5 text-gray-500" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Create new card */}
          <button
            onClick={() => setShowNew(true)}
            className="bg-white rounded-2xl border-2 border-dashed border-gray-200 p-6 hover:border-indigo-300 hover:bg-indigo-50/20 transition-all duration-200 flex flex-col items-center justify-center gap-3 min-h-[220px] group"
          >
            <div className="h-12 w-12 rounded-xl bg-gray-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
              <Plus className="h-6 w-6 text-gray-400 group-hover:text-indigo-500 transition-colors" />
            </div>
            <div className="text-center">
              <p className="font-medium text-gray-700 group-hover:text-gray-900 text-sm">New Collection</p>
              <p className="text-xs text-gray-400 mt-0.5">Define a new content schema</p>
            </div>
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && collections.length === 0 && (
        <div className="text-center py-24 bg-white rounded-2xl border border-gray-200">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Database className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No collections yet</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            Create your first collection to start organizing your content with a structured schema.
          </p>
          <Button onClick={() => setShowNew(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create your first collection
          </Button>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteConfirm}
        title={`Delete "${deleteConfirm?.name}"?`}
        description="This will permanently delete the collection and all its items. This cannot be undone."
        confirmLabel="Delete Collection"
        onConfirm={() => {
          if (deleteConfirm) deleteCollection(deleteConfirm.id, deleteConfirm.name);
          setDeleteConfirm(null);
        }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </div>
  );
}
