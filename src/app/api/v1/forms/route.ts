import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { resolveWorkspace } from "@/lib/workspace";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();
  const ws = await resolveWorkspace(req, user.id);

  let query = admin
    .from("forms")
    .select("id, name, status, site_id, team_id, created_at, updated_at, sites(name)")
    .order("created_at", { ascending: false });

  if (ws) {
    query = query.eq("team_id", ws.teamId);
  } else {
    query = query.eq("owner_id", user.id);
  }

  const { data: forms, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formIds = (forms ?? []).map((f) => f.id);
  let submissionCounts: Record<string, number> = {};
  let lastSubmissions: Record<string, string | null> = {};

  if (formIds.length > 0) {
    const { data: subs } = await admin
      .from("form_submissions")
      .select("form_ref, created_at")
      .in("form_ref", formIds)
      .order("created_at", { ascending: false });

    (subs ?? []).forEach((s) => {
      const key = s.form_ref as string;
      submissionCounts[key] = (submissionCounts[key] ?? 0) + 1;
      if (!lastSubmissions[key]) lastSubmissions[key] = s.created_at;
    });
  }

  const result = (forms ?? []).map((f) => ({
    ...f,
    siteName: (f.sites as unknown as { name: string } | null)?.name ?? null,
    submissions: submissionCounts[f.id] ?? 0,
    lastSubmission: lastSubmissions[f.id] ?? null,
  }));

  return NextResponse.json({ forms: result, total: result.length });
}

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { name, site_id, fields } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "name is required" }, { status: 400 });

    const admin = createSupabaseAdminClient();
    const ws = await resolveWorkspace(req, user.id);

    const { data, error } = await admin.from("forms").insert({
      name,
      owner_id: user.id,
      team_id: ws?.teamId ?? null,
      site_id: site_id ?? null,
      fields: fields ?? [],
      status: "active",
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ form: data }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const formId = searchParams.get("formId");
  if (!formId) return NextResponse.json({ error: "formId is required" }, { status: 400 });

  const admin = createSupabaseAdminClient();
  const { error } = await admin.from("forms").delete().eq("id", formId).eq("owner_id", user.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
