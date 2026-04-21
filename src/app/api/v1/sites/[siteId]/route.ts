import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: site, error } = await supabase
    .from("sites")
    .select("*, pages(*)")
    .eq("id", siteId)
    .single();

  if (error || !site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  return NextResponse.json({ data: site });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const { data, error } = await supabase
    .from("sites")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", siteId)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (body.name || body.status || body.custom_domain) {
    const desc = body.name
      ? `Renamed site to "${body.name}"`
      : body.status
      ? `Set site "${data.name}" status to ${body.status}`
      : `Updated domain for "${data.name}"`;
    await logActivity({
      user_id: user.id,
      owner_id: user.id,
      team_id: data.team_id ?? undefined,
      action_type: "edit",
      description: desc,
      site_id: siteId,
      metadata: { siteId, siteName: data.name },
    });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: site } = await supabase.from("sites").select("name, team_id").eq("id", siteId).single();

  const { error } = await supabase
    .from("sites")
    .delete()
    .eq("id", siteId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    team_id: site?.team_id ?? undefined,
    action_type: "delete",
    description: `Deleted site "${site?.name ?? siteId}"`,
    site_id: siteId,
    metadata: { siteId, siteName: site?.name },
  });

  return NextResponse.json({ data: { id: siteId, deleted: true } });
}
