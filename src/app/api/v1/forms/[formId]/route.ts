import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

// GET /api/v1/forms/[formId] — fetch submissions for a form
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { formId } = await params;
  const admin = createSupabaseAdminClient();

  // Verify ownership
  const { data: form } = await admin.from("forms").select("id, owner_id").eq("id", formId).single();
  if (!form || form.owner_id !== user.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { data: submissions, error } = await admin
    .from("form_submissions")
    .select("id, data, created_at")
    .eq("form_ref", formId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submissions: submissions ?? [] });
}

// POST /api/v1/forms/[formId] — record a new submission (public endpoint)
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ formId: string }> }
) {
  const { formId } = await params;

  try {
    const data = await req.json();
    const admin = createSupabaseAdminClient();

    // Verify form exists and is active
    const { data: form } = await admin.from("forms").select("id, status").eq("id", formId).single();
    if (!form) return NextResponse.json({ error: "Form not found" }, { status: 404 });
    if (form.status !== "active") return NextResponse.json({ error: "Form is not active" }, { status: 400 });

    const { error } = await admin.from("form_submissions").insert({ form_ref: formId, form_id: formId, data });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
