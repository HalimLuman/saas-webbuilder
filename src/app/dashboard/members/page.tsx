"use client";

import React, { useState, useEffect, useCallback } from "react";
import { UserPlus, Mail, Clock, Trash2, X, RefreshCw, CheckCircle, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useWorkspaceStore } from "@/store/workspace-store";
import { useUser } from "@/hooks/use-user";

const ROLE_STYLES: Record<string, string> = {
  owner:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  admin:    "bg-blue-50 text-blue-700 border-blue-200",
  designer: "bg-purple-50 text-purple-700 border-purple-200",
  editor:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  viewer:   "bg-gray-50 text-gray-600 border-gray-200",
};

const PERMISSIONS = [
  { action: "Manage billing",        owner: true,  admin: false, designer: false, editor: false, viewer: false },
  { action: "Manage team members",   owner: true,  admin: true,  designer: false, editor: false, viewer: false },
  { action: "Edit layout & design",  owner: true,  admin: true,  designer: true,  editor: false, viewer: false },
  { action: "Edit content & CMS",    owner: true,  admin: true,  designer: true,  editor: true,  viewer: false },
  { action: "Publish / deploy",      owner: true,  admin: true,  designer: true,  editor: false, viewer: false },
  { action: "View site (read-only)", owner: true,  admin: true,  designer: true,  editor: true,  viewer: true  },
  { action: "Delete site",           owner: true,  admin: true,  designer: false, editor: false, viewer: false },
  { action: "Export code",           owner: true,  admin: true,  designer: true,  editor: false, viewer: false },
];

interface Member {
  id: string;
  role: string;
  created_at: string;
  users: { id: string; name: string | null; email: string; avatar_url: string | null } | null;
}

interface Invite {
  id: string;
  email: string;
  role: string;
  status: string;
  created_at: string;
}

function initials(name: string | null | undefined, email: string): string {
  if (name) return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
  return email.slice(0, 2).toUpperCase();
}

export default function MembersPage() {
  const { activeWorkspaceId } = useWorkspaceStore();
  const { user } = useUser();

  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState("editor");
  const [inviting, setInviting] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [myRole, setMyRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const canManage = myRole === "owner" || myRole === "admin";

  const load = useCallback(async () => {
    if (!activeWorkspaceId) { setLoading(false); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/workspaces/${activeWorkspaceId}/members`);
      if (!res.ok) throw new Error((await res.json()).error);
      const json = await res.json();
      setMembers(json.members ?? []);
      setInvites(json.invites ?? []);
      setMyRole(json.myRole ?? null);
    } catch {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  }, [activeWorkspaceId]);

  useEffect(() => { load(); }, [load]);

  const sendInvite = async () => {
    if (!inviteEmail.trim() || !activeWorkspaceId) return;
    setInviting(true);
    try {
      const res = await fetch(`/api/v1/workspaces/${activeWorkspaceId}/members`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`Invite sent to ${inviteEmail}`);
      setShowInvite(false);
      setInviteEmail("");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setInviting(false);
    }
  };

  const changeRole = async (memberId: string, newRole: string) => {
    if (!activeWorkspaceId) return;
    try {
      const res = await fetch(`/api/v1/workspaces/${activeWorkspaceId}/members`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role: newRole }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Role updated");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const removeMember = async (memberId: string, label: string) => {
    if (!activeWorkspaceId) return;
    try {
      const res = await fetch(
        `/api/v1/workspaces/${activeWorkspaceId}/members?memberId=${memberId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success(`${label} removed from workspace`);
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  const cancelInvite = async (inviteId: string) => {
    if (!activeWorkspaceId) return;
    try {
      const res = await fetch(
        `/api/v1/workspaces/${activeWorkspaceId}/members?inviteId=${inviteId}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error((await res.json()).error);
      toast.success("Invite cancelled");
      await load();
    } catch (e) {
      toast.error((e as Error).message);
    }
  };

  // No workspace selected
  if (!activeWorkspaceId) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center">
            <Building2 className="h-8 w-8 text-gray-300" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">No workspace selected</p>
            <p className="text-xs text-gray-400 mt-1">Select a workspace from the sidebar to manage its members.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
          <p className="text-sm text-gray-500 mt-1">
            {loading
              ? "Loading…"
              : `${members.length} member${members.length !== 1 ? "s" : ""}${invites.length > 0 ? ` · ${invites.length} pending invite${invites.length !== 1 ? "s" : ""}` : ""}`}
            {myRole && (
              <span className={`ml-2 text-xs font-medium px-1.5 py-0.5 rounded-full border ${ROLE_STYLES[myRole] ?? ROLE_STYLES.viewer}`}>
                You: {myRole.charAt(0).toUpperCase() + myRole.slice(1)}
              </span>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          </Button>
          {canManage && (
            <Button className="gap-2" onClick={() => setShowInvite(true)}>
              <UserPlus className="h-4 w-4" /> Invite Member
            </Button>
          )}
        </div>
      </div>

      {/* Invite panel */}
      {showInvite && canManage && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Invite a team member</h3>
          <div className="flex gap-3">
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendInvite()}
              placeholder="colleague@company.com"
              className="flex-1 h-9 px-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-9 px-3 rounded-lg border border-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {["admin", "designer", "editor", "viewer"].map((r) => (
                <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
            <Button size="sm" onClick={sendInvite} disabled={inviting}>
              {inviting ? "Sending…" : "Send Invite"}
            </Button>
            <Button variant="outline" size="sm" onClick={() => { setShowInvite(false); setInviteEmail(""); }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-gray-50 animate-pulse">
              <div className="h-9 w-9 rounded-full bg-gray-100 shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-gray-100 rounded w-32" />
                <div className="h-3 bg-gray-100 rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active members */}
      {!loading && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Active Members</h2>
          </div>
          {members.length === 0 ? (
            <div className="px-5 py-6 text-center text-sm text-gray-400">
              No members found. Invite someone to collaborate.
            </div>
          ) : (
            members.map((m) => {
              const u = m.users;
              if (!u) return null;
              const isSelf = u.id === user?.id;
              const isOwner = m.role === "owner";
              return (
                <div key={m.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                      {initials(u.name, u.email)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900">{u.name ?? u.email}</p>
                      {isSelf && (
                        <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">you</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">{u.email}</p>
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_STYLES[m.role] ?? ROLE_STYLES.viewer}`}>
                    {m.role.charAt(0).toUpperCase() + m.role.slice(1)}
                  </span>
                  {/* Role controls — owner/admin only, can't change owner */}
                  {canManage && !isOwner && !isSelf && (
                    <div className="flex items-center gap-1 shrink-0">
                      <select
                        value={m.role}
                        onChange={(e) => changeRole(m.id, e.target.value)}
                        className="h-7 px-2 rounded-lg border border-gray-200 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      >
                        {["admin", "designer", "editor", "viewer"].map((r) => (
                          <option key={r} value={r}>{r.charAt(0).toUpperCase() + r.slice(1)}</option>
                        ))}
                      </select>
                      <Button
                        variant="outline" size="sm"
                        className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => removeMember(m.id, u.name ?? u.email)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {/* Self-leave (non-owner) */}
                  {isSelf && !isOwner && (
                    <Button
                      variant="outline" size="sm"
                      className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                      onClick={() => removeMember(m.id, "You")}
                    >
                      Leave
                    </Button>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Pending invites */}
      {!loading && invites.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-50">
            <h2 className="text-sm font-semibold text-gray-900">Pending Invites</h2>
          </div>
          {invites.map((inv) => (
            <div key={inv.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-gray-50 last:border-0">
              <div className="h-9 w-9 rounded-full bg-amber-50 border-2 border-dashed border-amber-200 flex items-center justify-center shrink-0">
                <Mail className="h-4 w-4 text-amber-500" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{inv.email}</p>
                <p className="text-xs text-gray-400" suppressHydrationWarning>Invited {new Date(inv.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${ROLE_STYLES[inv.role] ?? ROLE_STYLES.viewer}`}>
                {inv.role.charAt(0).toUpperCase() + inv.role.slice(1)}
              </span>
              <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                <Clock className="h-3 w-3" /> Pending
              </span>
              {canManage && (
                <Button
                  variant="outline" size="sm"
                  className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50 shrink-0"
                  onClick={() => cancelInvite(inv.id)}
                >
                  Cancel
                </Button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Role permissions table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-3 border-b border-gray-50">
          <h2 className="text-sm font-semibold text-gray-900">Role Permissions</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left bg-gray-50">
                <th className="px-5 py-2.5 font-semibold text-gray-500 w-48">Permission</th>
                {["Owner", "Admin", "Designer", "Editor", "Viewer"].map((r) => (
                  <th key={r} className="px-4 py-2.5 font-semibold text-gray-500 text-center">
                    <span className={`px-1.5 py-0.5 rounded-full border text-[10px] ${ROLE_STYLES[r.toLowerCase()]}`}>{r}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((p) => (
                <tr key={p.action} className="border-t border-gray-50 hover:bg-gray-50/50">
                  <td className="px-5 py-2.5 text-gray-700">{p.action}</td>
                  {(["owner", "admin", "designer", "editor", "viewer"] as const).map((role) => (
                    <td key={role} className="px-4 py-2.5 text-center">
                      {p[role] ? (
                        <CheckCircle className="h-3.5 w-3.5 text-indigo-500 mx-auto" />
                      ) : (
                        <X className="h-3.5 w-3.5 text-gray-200 mx-auto" />
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
