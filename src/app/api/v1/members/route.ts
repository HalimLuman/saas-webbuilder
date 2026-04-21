import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";

export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Get the current user's profile
  const { data: profile } = await admin
    .from("users")
    .select("id, name, email, avatar_url, created_at")
    .eq("id", user.id)
    .single();

  // Get team members if the user belongs to a team
  const { data: teamMemberships } = await admin
    .from("team_members")
    .select(`
      id, role, created_at,
      teams (id, name),
      users!team_members_user_id_fkey (id, name, email, avatar_url)
    `)
    .eq("user_id", user.id)
    .limit(1);

  let members: unknown[] = [];
  let invites: unknown[] = [];

  if (teamMemberships && teamMemberships.length > 0) {
    const teamId = (teamMemberships[0].teams as unknown as { id: string } | null)?.id;
    if (teamId) {
      const { data: allMembers } = await admin
        .from("team_members")
        .select(`
          id, role, created_at,
          users!team_members_user_id_fkey (id, name, email, avatar_url)
        `)
        .eq("team_id", teamId);
      members = allMembers ?? [];

      const { data: pendingInvites } = await admin
        .from("team_invites")
        .select("id, email, role, status, created_at, expires_at")
        .eq("owner_id", user.id)
        .eq("status", "pending");
      invites = pendingInvites ?? [];
    }
  }

  // Get direct invites (solo workspace model)
  const { data: directInvites } = await admin
    .from("team_invites")
    .select("id, email, role, status, created_at, expires_at")
    .eq("owner_id", user.id)
    .eq("status", "pending");

  return NextResponse.json({
    currentUser: profile,
    members,
    invites: invites.length > 0 ? invites : (directInvites ?? []),
  });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get("memberId");
  if (!memberId) return NextResponse.json({ error: "memberId is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("team_members").delete().eq("id", memberId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await logActivity({ user_id: user.id, owner_id: user.id, action_type: "team", description: "Removed a team member" });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { memberId, role } = await req.json();
    if (!memberId || !role) return NextResponse.json({ error: "memberId and role are required" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const { error } = await admin.from("team_members").update({ role }).eq("id", memberId);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await logActivity({ user_id: user.id, owner_id: user.id, action_type: "team", description: `Updated team member role to ${role}` });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
