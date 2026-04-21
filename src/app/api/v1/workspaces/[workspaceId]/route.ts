import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";

type Params = { params: Promise<{ workspaceId: string }> };

/** PATCH /api/v1/workspaces/[workspaceId] — rename (owner only) */
export async function PATCH(req: NextRequest, { params }: Params) {
  const { workspaceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name } = await req.json();
  if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { data, error } = await admin
    .from("teams")
    .update({ name: name.trim() })
    .eq("id", workspaceId)
    .eq("owner_id", user.id)
    .select()
    .single();

  if (error || !data) return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });

  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    action_type: "team",
    description: `Renamed workspace to "${name.trim()}"`,
    metadata: { workspaceId },
  });

  return NextResponse.json({ workspace: data });
}

/** DELETE /api/v1/workspaces/[workspaceId] — owner only; default workspace is protected */
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { workspaceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  const { data: team } = await admin
    .from("teams")
    .select("id, name")
    .eq("id", workspaceId)
    .eq("owner_id", user.id)
    .single();

  if (!team) return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });

  // The default workspace is the user's oldest owned workspace — protect it.
  const { data: oldest } = await admin
    .from("teams")
    .select("id")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .single();

  if (oldest?.id === workspaceId) {
    return NextResponse.json({ error: "Your default workspace cannot be deleted." }, { status: 403 });
  }

  await admin.from("team_members").delete().eq("team_id", workspaceId);
  await admin.from("team_invites").delete().eq("team_id", workspaceId);
  await admin.from("teams").delete().eq("id", workspaceId);

  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    action_type: "team",
    description: `Deleted workspace "${team.name}"`,
    metadata: { workspaceId },
  });

  return NextResponse.json({ success: true });
}
