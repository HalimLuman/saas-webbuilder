import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { resolveWorkspace } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const filter = searchParams.get("filter") ?? "All";
  const limit = parseInt(searchParams.get("limit") ?? "50", 10);
  const offset = parseInt(searchParams.get("offset") ?? "0", 10);

  const admin = createSupabaseAdminClient();
  const ws = await resolveWorkspace(req, user.id);

  let query = admin
    .from("activity_logs")
    .select(`id, action_type, description, site_id, metadata, created_at,
      users!activity_logs_user_id_fkey(id, name, email, avatar_url)`)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (ws) {
    query = query.eq("team_id", ws.teamId);
  } else {
    query = query.eq("owner_id", user.id);
  }

  const typeMap: Record<string, string[]> = {
    Deploys: ["publish", "deploy_failed"],
    Edits: ["edit", "create", "delete"],
    Team: ["team"],
    Billing: ["billing"],
  };

  if (filter !== "All" && typeMap[filter]) {
    query = query.in("action_type", typeMap[filter]);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ activities: data ?? [] });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { action_type, description, site_id, metadata } = body;

    if (!action_type || !description) {
      return NextResponse.json({ error: "action_type and description are required" }, { status: 400 });
    }

    const admin = createSupabaseAdminClient();
    const ws = await resolveWorkspace(req, user.id);

    const { data, error } = await admin.from("activity_logs").insert({
      user_id: user.id,
      owner_id: user.id,
      team_id: ws?.teamId ?? null,
      action_type,
      description,
      site_id: site_id ?? null,
      metadata: metadata ?? {},
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ activity: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
