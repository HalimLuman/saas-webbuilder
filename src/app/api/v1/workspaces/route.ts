import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";

/** GET /api/v1/workspaces — all workspaces the current user belongs to */
export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Workspaces owned by the user
  const { data: ownedTeams } = await admin
    .from("teams")
    .select("id, name, owner_id, created_by, created_at")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true });

  // Workspaces where user is a member (not owner)
  const { data: memberships } = await admin
    .from("team_members")
    .select("role, teams(id, name, owner_id, created_by, created_at)")
    .eq("user_id", user.id)
    .neq("role", "owner");

  // Member counts per workspace
  const allTeamIds = [
    ...(ownedTeams ?? []).map((t) => t.id),
    ...(memberships ?? []).flatMap((m) => {
      const t = m.teams as unknown as { id: string } | null;
      return t ? [t.id] : [];
    }),
  ];

  let memberCounts: Record<string, number> = {};
  if (allTeamIds.length > 0) {
    const { data: counts } = await admin
      .from("team_members")
      .select("team_id")
      .in("team_id", allTeamIds);
    (counts ?? []).forEach((r) => {
      memberCounts[r.team_id] = (memberCounts[r.team_id] ?? 0) + 1;
    });
  }

  // Auto-create "My Workspace" for users with no workspaces at all
  // (fallback for existing accounts that predate the trigger)
  let owned = (ownedTeams ?? []).map((t) => ({
    ...t,
    myRole: "owner",
    memberCount: memberCounts[t.id] ?? 1,
  }));

  const member = (memberships ?? [])
    .map((m) => {
      const t = m.teams as unknown as { id: string; name: string; owner_id: string; created_by: string; created_at: string } | null;
      if (!t) return null;
      return { ...t, myRole: m.role, memberCount: memberCounts[t.id] ?? 1 };
    })
    .filter(Boolean);

  if (owned.length === 0 && member.length === 0) {
    const { data: newTeam } = await admin
      .from("teams")
      .insert({ name: "My Workspace", created_by: user.id, owner_id: user.id })
      .select()
      .single();
    if (newTeam) {
      await admin.from("team_members").insert({ team_id: newTeam.id, user_id: user.id, role: "owner" });
      owned = [{ ...newTeam, myRole: "owner", memberCount: 1 }];
    }
  }

  // Mark the oldest owned workspace as the default — it cannot be deleted.
  const ownedWithDefault = owned.map((w, i) => ({ ...w, isDefault: i === 0 }));

  return NextResponse.json({ workspaces: [...ownedWithDefault, ...member] });
}

/** POST /api/v1/workspaces — create a new workspace (paid plans only) */
export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();

  const { data: profile } = await admin.from("users").select("plan").eq("id", user.id).single();
  if (!profile || profile.plan === "free") {
    return NextResponse.json({ error: "Upgrade to a paid plan to create additional workspaces." }, { status: 403 });
  }

  const { data: team, error } = await admin
    .from("teams")
    .insert({ name: name.trim(), created_by: user.id, owner_id: user.id })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  await admin.from("team_members").insert({
    team_id: team.id,
    user_id: user.id,
    role: "owner",
  });

  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    action_type: "team",
    team_id: team.id,
    description: `Created workspace "${name.trim()}"`,
    metadata: { workspaceId: team.id, workspaceName: name.trim() },
  });

  return NextResponse.json({ workspace: { ...team, myRole: "owner", memberCount: 1 } }, { status: 201 });
}
