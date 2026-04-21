import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import { sendTeamInviteEmail } from "@/lib/email";

type Params = { params: Promise<{ workspaceId: string }> };

async function getMyRole(admin: ReturnType<typeof createSupabaseAdminClient>, workspaceId: string, userId: string) {
  // Check owner first (via teams.owner_id)
  const { data: team } = await admin
    .from("teams")
    .select("owner_id")
    .eq("id", workspaceId)
    .single();
  if (team?.owner_id === userId) return "owner";

  const { data: m } = await admin
    .from("team_members")
    .select("role")
    .eq("team_id", workspaceId)
    .eq("user_id", userId)
    .single();
  return m?.role ?? null;
}

/** GET /api/v1/workspaces/[workspaceId]/members */
export async function GET(_req: NextRequest, { params }: Params) {
  const { workspaceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const myRole = await getMyRole(admin, workspaceId, user.id);
  if (!myRole) return NextResponse.json({ error: "Not a member of this workspace" }, { status: 403 });

  const { data: members } = await admin
    .from("team_members")
    .select("id, role, created_at, users!team_members_user_id_fkey(id, name, email, avatar_url)")
    .eq("team_id", workspaceId)
    .order("created_at", { ascending: true });

  const { data: invites } = await admin
    .from("team_invites")
    .select("id, email, role, status, created_at")
    .eq("team_id", workspaceId)
    .eq("status", "pending");

  return NextResponse.json({ members: members ?? [], invites: invites ?? [], myRole });
}

/** POST /api/v1/workspaces/[workspaceId]/members — invite by email */
export async function POST(req: NextRequest, { params }: Params) {
  const { workspaceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const myRole = await getMyRole(admin, workspaceId, user.id);
  if (!["owner", "admin"].includes(myRole ?? "")) {
    return NextResponse.json({ error: "Only owners and admins can invite members" }, { status: 403 });
  }

  const { email, role } = await req.json();
  if (!email || !role) return NextResponse.json({ error: "email and role are required" }, { status: 400 });

  const { data: invite, error } = await admin.from("team_invites").insert({
    team_id: workspaceId,
    email,
    role,
    invited_by: user.id,
    owner_id: user.id,
    status: "pending",
  }).select().single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    team_id: workspaceId,
    action_type: "team",
    description: `Invited ${email} as ${role}`,
    metadata: { workspaceId, email, role },
  });

  try {
    const { data: inviter } = await supabase.from("users").select("name, email").eq("id", user.id).single();
    const inviterName = inviter?.name ?? inviter?.email ?? "A team member";
    await sendTeamInviteEmail(email, inviterName, role, invite.id);
  } catch { /* non-blocking */ }

  return NextResponse.json({ invite }, { status: 201 });
}

/** PATCH /api/v1/workspaces/[workspaceId]/members — change role */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { workspaceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const myRole = await getMyRole(admin, workspaceId, user.id);
  if (!["owner", "admin"].includes(myRole ?? "")) {
    return NextResponse.json({ error: "Only owners and admins can change roles" }, { status: 403 });
  }

  const { memberId, role } = await req.json();
  if (!memberId || !role) return NextResponse.json({ error: "memberId and role are required" }, { status: 400 });

  const { data: memberRow } = await admin
    .from("team_members")
    .select("role, user_id")
    .eq("id", memberId)
    .single();
  if (memberRow?.role === "owner") {
    return NextResponse.json({ error: "Cannot change the owner's role" }, { status: 400 });
  }

  const { error } = await admin.from("team_members").update({ role }).eq("id", memberId).eq("team_id", workspaceId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    action_type: "team",
    description: `Changed member role to ${role}`,
    metadata: { workspaceId, memberId, newRole: role },
  });

  return NextResponse.json({ success: true });
}

/** DELETE /api/v1/workspaces/[workspaceId]/members?memberId=... or ?inviteId=... */
export async function DELETE(req: NextRequest, { params }: Params) {
  const { workspaceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const myRole = await getMyRole(admin, workspaceId, user.id);

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  const inviteId = searchParams.get("inviteId");

  if (inviteId) {
    if (!["owner", "admin"].includes(myRole ?? "")) {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }
    await admin.from("team_invites").delete().eq("id", inviteId).eq("team_id", workspaceId);
    return NextResponse.json({ success: true });
  }

  if (memberId) {
    const { data: row } = await admin
      .from("team_members")
      .select("role, user_id")
      .eq("id", memberId)
      .single();

    const isSelf = row?.user_id === user.id;
    const canManage = ["owner", "admin"].includes(myRole ?? "");
    if (!isSelf && !canManage) return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    if (row?.role === "owner") return NextResponse.json({ error: "Cannot remove the owner" }, { status: 400 });

    await admin.from("team_members").delete().eq("id", memberId).eq("team_id", workspaceId);

    await logActivity({
      user_id: user.id,
      owner_id: user.id,
      action_type: "team",
      description: isSelf ? "Left the workspace" : "Removed a member from workspace",
      metadata: { workspaceId, memberId },
    });

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "memberId or inviteId required" }, { status: 400 });
}
