"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Globe, LayoutTemplate, Database, FileText,
  BarChart2, Users, ScrollText, Settings, CreditCard, Zap, Plus,
  ChevronDown, Check, Sparkles, Link2, X, Building2, Loader2, Trash2, ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { useWorkspaceStore, type Workspace } from "@/store/workspace-store";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  exact?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

// ---------------------------------------------------------------------------
// Navigation data
// ---------------------------------------------------------------------------

const navSections: NavSection[] = [
  {
    title: "Main",
    items: [
      { icon: LayoutDashboard, label: "Overview", href: "/dashboard", exact: true },
      { icon: Globe, label: "My Sites", href: "/dashboard/sites" },
      { icon: Sparkles, label: "AI Generate", href: "/dashboard/generate" },
      { icon: LayoutTemplate, label: "Templates", href: "/dashboard/templates" },
    ],
  },
  {
    title: "Content",
    items: [
      { icon: Database, label: "CMS", href: "/dashboard/cms" },
      { icon: FileText, label: "Forms", href: "/dashboard/forms" },
      { icon: BarChart2, label: "Analytics", href: "/dashboard/analytics" },
    ],
  },
  {
    title: "Team",
    items: [
      { icon: Users, label: "Members", href: "/dashboard/members" },
      { icon: ScrollText, label: "Logs", href: "/dashboard/logs" },
    ],
  },
  {
    title: "Account",
    items: [
      { icon: Link2, label: "Domains", href: "/dashboard/domains" },
      { icon: Settings, label: "Settings", href: "/dashboard/settings" },
      { icon: CreditCard, label: "Billing", href: "/dashboard/billing" },
    ],
  },
];

const ROLE_COLORS: Record<string, string> = {
  owner: "bg-primary-100 text-primary-dark",
  admin: "bg-blue-100 text-blue-700",
  designer: "bg-purple-100 text-purple-700",
  editor: "bg-emerald-100 text-emerald-700",
  viewer: "bg-gray-100 text-gray-600",
};

// ---------------------------------------------------------------------------
// CreateWorkspaceModal
// ---------------------------------------------------------------------------

function CreateWorkspaceModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (id: string) => void;
}) {
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) { setName(""); setTimeout(() => inputRef.current?.focus(), 50); }
  }, [open]);

  const submit = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCreating(true);
    try {
      const res = await fetch("/api/v1/workspaces", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const json = await res.json();
      if (!res.ok) { toast.error(json.error ?? "Failed to create workspace"); return; }
      toast.success(`Workspace "${trimmed}" created`);
      onCreated(json.workspace.id);
      onClose();
    } catch {
      toast.error("Failed to create workspace");
    } finally {
      setCreating(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary-100 flex items-center justify-center">
              <Building2 className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">New Workspace</p>
              <p className="text-xs text-gray-400">Create a shared workspace for your team</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="h-7 w-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="px-5 py-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Workspace name</label>
            <input
              ref={inputRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") onClose(); }}
              placeholder="e.g. Acme Corp, My Projects…"
              className="w-full h-9 px-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
          </div>
        </div>
        <div className="flex items-center gap-2 px-5 pb-5">
          <button
            onClick={onClose}
            className="flex-1 h-9 rounded-xl border border-gray-200 text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={creating || !name.trim()}
            className="flex-1 h-9 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {creating ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Plus className="h-3.5 w-3.5" />}
            {creating ? "Creating…" : "Create Workspace"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// WorkspaceSwitcher
// ---------------------------------------------------------------------------

function WorkspaceSwitcher() {
  const { activeWorkspaceId, setActiveWorkspace } = useWorkspaceStore();
  const { profile } = useUser();
  const [open, setOpen] = useState(false);
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Workspace | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/v1/workspaces");
      if (!res.ok) return;
      const json = await res.json();
      const list: Workspace[] = json.workspaces ?? [];
      setWorkspaces(list);
      if (list.length > 0) {
        const currentActive = useWorkspaceStore.getState().activeWorkspaceId;
        const stillExists = list.find((w) => w.id === currentActive);
        if (!currentActive || !stillExists) {
          useWorkspaceStore.getState().setActiveWorkspace(list[0].id);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const active = workspaces.find((w) => w.id === activeWorkspaceId) ?? workspaces[0];

  const select = (ws: Workspace) => {
    setActiveWorkspace(ws.id);
    setOpen(false);
    router.refresh();
  };

  const handleCreated = async (newId: string) => {
    await load();
    setActiveWorkspace(newId);
    router.refresh();
  };

  const deleteWorkspace = async (ws: Workspace) => {
    try {
      const res = await fetch(`/api/v1/workspaces/${ws.id}`, { method: "DELETE" });
      if (!res.ok) { toast.error((await res.json()).error ?? "Failed to delete"); return; }
      if (activeWorkspaceId === ws.id) {
        const remaining = workspaces.filter((w) => w.id !== ws.id);
        setActiveWorkspace(remaining[0]?.id ?? null);
      }
      toast.success(`"${ws.name}" deleted`);
      await load();
    } catch {
      toast.error("Failed to delete workspace");
    }
  };

  return (
    <>
      <div className="relative px-3 py-2" ref={dropdownRef}>
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          aria-haspopup="listbox"
          aria-expanded={open}
        >
          <div className="h-6 w-6 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
            <Building2 className="h-3.5 w-3.5 text-primary" />
          </div>
          <div className="flex-1 text-left min-w-0">
            {loading ? (
              <span className="text-sm text-gray-400">Loading…</span>
            ) : active ? (
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-sm font-medium text-gray-800 truncate">{active.name}</span>
                <span className={cn("text-[9px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 capitalize", ROLE_COLORS[active.myRole ?? "viewer"])}>
                  {active.myRole}
                </span>
              </div>
            ) : (
              <span className="text-sm text-gray-400">No workspace</span>
            )}
          </div>
          <ChevronDown className={cn("h-3.5 w-3.5 text-gray-400 transition-transform duration-200 shrink-0", open && "rotate-180")} />
        </button>

        {open && (
          <div className="absolute left-0 right-0 top-full mt-1 z-50 bg-white rounded-xl border border-gray-100 shadow-xl overflow-hidden">
            <p className="px-3 pt-2.5 pb-1.5 text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Workspaces</p>

            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-4 w-4 animate-spin text-gray-300" />
                </div>
              ) : (
                workspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className={cn(
                      "group flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 transition-colors",
                      active?.id === ws.id && "bg-primary-50/60"
                    )}
                  >
                    <button className="flex items-center gap-2.5 flex-1 min-w-0 text-left" onClick={() => select(ws)}>
                      <div className="h-6 w-6 rounded-md bg-primary-100 flex items-center justify-center shrink-0">
                        <Building2 className="h-3 w-3 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm text-gray-700 font-medium truncate">{ws.name}</span>
                          <span className={cn("text-[9px] font-semibold px-1 py-0.5 rounded-full shrink-0 capitalize", ROLE_COLORS[ws.myRole ?? "viewer"])}>
                            {ws.myRole}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-400">{ws.memberCount ?? 1} member{(ws.memberCount ?? 1) !== 1 ? "s" : ""}</p>
                      </div>
                      {active?.id === ws.id && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                    </button>
                    {ws.myRole === "owner" && !ws.isDefault && (
                      <button
                        onClick={(e) => { e.stopPropagation(); setDeleteConfirm(ws); setOpen(false); }}
                        className="h-6 w-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all shrink-0"
                        title="Delete workspace"
                      >
                        <Trash2 className="h-3 w-3 text-red-400" />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="border-t border-gray-100 p-2">
              {profile?.plan === "free" || !profile?.plan ? (
                <Link
                  href="/dashboard/billing"
                  onClick={() => setOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-600 hover:bg-amber-50 rounded-lg transition-colors font-medium"
                >
                  <div className="h-5 w-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                    <ArrowRight className="h-2.5 w-2.5 text-amber-500" />
                  </div>
                  Upgrade plan for more workspaces
                </Link>
              ) : (
                <button
                  onClick={() => { setOpen(false); setShowCreateModal(true); }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-primary-50 rounded-lg transition-colors font-medium"
                >
                  <div className="h-5 w-5 rounded-full border-2 border-primary-200 flex items-center justify-center shrink-0">
                    <Plus className="h-2.5 w-2.5 text-primary" />
                  </div>
                  <span className="text-xs">New workspace</span>
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <CreateWorkspaceModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handleCreated}
      />

      <ConfirmDialog
        open={!!deleteConfirm}
        title={`Delete "${deleteConfirm?.name}"?`}
        description="This will permanently delete the workspace and remove all members. This cannot be undone."
        confirmLabel="Delete Workspace"
        onConfirm={() => { if (deleteConfirm) deleteWorkspace(deleteConfirm); setDeleteConfirm(null); }}
        onCancel={() => setDeleteConfirm(null)}
      />
    </>
  );
}

// ---------------------------------------------------------------------------
// NavLink
// ---------------------------------------------------------------------------

function NavLink({ item, pathname, onClick }: { item: NavItem; pathname: string; onClick?: () => void }) {
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + "/");

  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
        isActive ? "bg-primary-50 text-primary-dark" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <item.icon className={cn("h-4 w-4 shrink-0 transition-colors", isActive ? "text-primary" : "text-gray-400")} />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

// ---------------------------------------------------------------------------
// Sidebar
// ---------------------------------------------------------------------------

export default function Sidebar({ open = false, onClose }: { open?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const { user, profile } = useUser();

  const userName = profile?.name ?? user?.email?.split("@")[0] ?? "User";
  const userEmail = user?.email ?? "";
  const userInitials = (profile?.name ?? userEmail)
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const sidebarContent = (
    <aside className="w-64 bg-white flex flex-col h-full">
      {/* Logo */}
      <div className="h-14 flex items-center justify-between px-5 border-b border-gray-100 shrink-0">
        <Link href="/" className="flex items-center">
          <Image src="/webperia-logo-wobg.png" alt="Webperia" width={120} height={32} className="h-8 w-auto object-contain" />
        </Link>
        {onClose && (
          <button onClick={onClose} className="md:hidden h-7 w-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Workspace Switcher */}
      <div className="border-b border-gray-100">
        <WorkspaceSwitcher />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        {navSections.map((section) => (
          <div key={section.title}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} onClick={onClose} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom: User info */}
      <div className="shrink-0 border-t border-gray-100 p-3 space-y-2">
        <Button asChild size="sm" className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-600 hover:to-accent text-white text-xs h-8 shadow-sm">
          <Link href="/pricing">
            <Zap className="h-3 w-3 mr-1.5" />
            Upgrade to Pro
          </Link>
        </Button>
        <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition-colors cursor-default">
          <Avatar className="h-7 w-7 shrink-0">
            <AvatarImage src={profile?.avatar_url ?? ""} alt={userName} />
            <AvatarFallback className="text-[10px]">{userInitials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate leading-tight">{userName}</p>
            <p className="text-[10px] text-gray-400 truncate leading-tight">{userEmail}</p>
          </div>
          <Badge variant="draft" className="text-[9px] px-1.5 py-0 h-4 shrink-0 capitalize">
            {profile?.plan ?? "free"}
          </Badge>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      <div className="hidden md:flex shrink-0 border-r border-gray-100 h-full">{sidebarContent}</div>
      <div
        className={cn("fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300", open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={cn("fixed inset-y-0 left-0 z-50 md:hidden border-r border-gray-100 shadow-2xl transition-transform duration-300", open ? "translate-x-0" : "-translate-x-full")}>
        {sidebarContent}
      </div>
    </>
  );
}
