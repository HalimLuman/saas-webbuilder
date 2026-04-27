import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { resolveWorkspace } from "@/lib/workspace";
import { logActivity } from "@/lib/activity";

export async function GET(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.toLowerCase();
  const status = searchParams.get("status");

  const admin = createSupabaseAdminClient();
  const ws = await resolveWorkspace(req, user.id);

  let query = admin.from("sites").select("*").order("updated_at", { ascending: false });

  if (ws) {
    // Workspace context — show all sites belonging to this workspace
    query = query.eq("team_id", ws.teamId);
  } else {
    // No workspace header — fall back to personal sites
    query = query.eq("owner_id", user.id);
  }

  if (status) query = query.eq("status", status as "draft" | "published" | "archived");

  const { data: sites, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const filtered = q
    ? sites?.filter((s) => s.name.toLowerCase().includes(q) || s.slug.toLowerCase().includes(q))
    : sites;

  return NextResponse.json({ data: filtered ?? [], meta: { total: filtered?.length ?? 0 } });
}

const SITE_LIMITS: Record<string, number> = {
  free: 2, pro: 10, business: 999, enterprise: 999,
};

export async function POST(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { name, template_id, pages, design_tokens } = body;
  if (!name) return NextResponse.json({ error: "name is required" }, { status: 400 });

  // Plan-based site creation limit
  const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single();
  const plan = (profile?.plan ?? "free") as string;
  const siteLimit = SITE_LIMITS[plan] ?? SITE_LIMITS.free;
  const { count: siteCount } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .in("status", ["draft", "published"]);
  if ((siteCount ?? 0) >= siteLimit) {
    return NextResponse.json(
      { error: `Site limit reached. Your ${plan} plan allows up to ${siteLimit} site${siteLimit === 1 ? "" : "s"}. Upgrade to create more.` },
      { status: 403 }
    );
  }

  const admin = createSupabaseAdminClient();
  const ws = await resolveWorkspace(req, user.id);

  const slug = name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const { data: site, error } = await admin
    .from("sites")
    .insert({
      owner_id: user.id,
      team_id: ws?.teamId ?? null,
      name,
      slug: `${slug}-${Date.now()}`,
      status: "draft",
      design_tokens: design_tokens ?? { primaryColor: "#6366f1", fontFamily: "Inter" },
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (pages && Array.isArray(pages)) {
    // Insert provided pages
    for (const page of pages) {
      await admin.from("pages").insert({
        site_id: site.id,
        title: page.name,
        slug: page.slug,
        is_homepage: page.isHome ?? false,
        sort_order: 0,
        content: { children: page.elements },
        meta: page.seo ?? { title: page.name, description: "" },
      });
    }
  } else {
    // Insert default empty home page
    await admin.from("pages").insert({
      site_id: site.id,
      title: "Home",
      slug: "/",
      is_homepage: true,
      sort_order: 0,
      content: { children: [] },
      meta: { title: name, description: "" },
    });
  }

  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    team_id: ws?.teamId ?? undefined,
    action_type: "create",
    description: `Created site "${name}"`,
    site_id: site.id,
    metadata: { siteName: name, siteId: site.id },
  });

  return NextResponse.json({ data: { ...site, template_id: template_id ?? null } }, { status: 201 });
}
