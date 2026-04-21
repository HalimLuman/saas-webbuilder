import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";

type Params = { params: Promise<{ siteId: string; pageId: string }> };

// ── GET — fetch a single page ─────────────────────────────────────────────────
export async function GET(_req: NextRequest, { params }: Params) {
  const { siteId, pageId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Verify the site belongs to the user
  const { data: site } = await admin
    .from("sites").select("id").eq("id", siteId).eq("owner_id", user.id).single();
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: page, error } = await admin
    .from("pages").select("*").eq("id", pageId).eq("site_id", siteId).single();
  if (error || !page) return NextResponse.json({ error: "Page not found" }, { status: 404 });

  return NextResponse.json({ page });
}

// ── PUT — save page content (elements + SEO meta) ─────────────────────────────
// This is called by the editor auto-save every 2 seconds.
export async function PUT(req: NextRequest, { params }: Params) {
  const { siteId, pageId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  // Verify site ownership
  const { data: site } = await admin
    .from("sites").select("id").eq("id", siteId).eq("owner_id", user.id).single();
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { content, meta, title, slug } = body as {
    content?: unknown;
    meta?: unknown;
    title?: string;
    slug?: string;
  };

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (content !== undefined) updates.content = content;
  if (meta    !== undefined) updates.meta    = meta;
  if (title   !== undefined) updates.title   = title;
  if (slug    !== undefined) updates.slug    = slug;

  const { data: page, error } = await admin
    .from("pages")
    .update(updates)
    .eq("id", pageId)
    .eq("site_id", siteId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Snapshot into page_versions (best-effort)
  if (content !== undefined) {
    admin.from("page_versions").insert({
      page_id:    pageId,
      content:    content,
      created_by: user.id,
    }).then(() => {/* ignore */}, () => {/* ignore */});
  }

  return NextResponse.json({ page });
}

// ── DELETE — remove a page ────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: Params) {
  const { siteId, pageId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const admin = createSupabaseAdminClient();

  const { data: site } = await admin
    .from("sites").select("id").eq("id", siteId).eq("owner_id", user.id).single();
  if (!site) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Prevent deleting the last page
  const { count } = await admin
    .from("pages").select("id", { count: "exact", head: true }).eq("site_id", siteId);
  if ((count ?? 0) <= 1) {
    return NextResponse.json({ error: "Cannot delete the last page" }, { status: 400 });
  }

  const { error } = await admin
    .from("pages").delete().eq("id", pageId).eq("site_id", siteId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ deleted: true });
}
