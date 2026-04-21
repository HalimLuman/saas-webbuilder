import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import type { DataSource, DbQueryConfig } from "@/lib/types";

type Params = { params: Promise<{ siteId: string; sourceId: string }> };

/** GET /api/v1/sites/[siteId]/data/[sourceId] — fetch source definition */
export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  const { siteId, sourceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: site, error } = await supabase
    .from("sites")
    .select("id, data_sources")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const sources = (site.data_sources as DataSource[]) ?? [];
  const source = sources.find((s) => s.id === sourceId);
  if (!source) return NextResponse.json({ error: "Data source not found" }, { status: 404 });

  return NextResponse.json({ data: source });
}

/** PUT /api/v1/sites/[siteId]/data/[sourceId] — update data source */
export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, sourceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: site, error } = await supabase
    .from("sites")
    .select("id, data_sources")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json();
  const sources = (site.data_sources as DataSource[]) ?? [];
  const idx = sources.findIndex((s) => s.id === sourceId);
  if (idx === -1) return NextResponse.json({ error: "Data source not found" }, { status: 404 });

  sources[idx] = { ...sources[idx], ...body, id: sourceId };

  const { error: updateError } = await supabase
    .from("sites")
    .update({ data_sources: sources, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: sources[idx] });
}

/** DELETE /api/v1/sites/[siteId]/data/[sourceId] — delete data source */
export async function DELETE(
  _req: NextRequest,
  { params }: Params
) {
  const { siteId, sourceId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: site, error } = await supabase
    .from("sites")
    .select("id, data_sources")
    .eq("id", siteId)
    .eq("owner_id", user.id)
    .single();

  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const updated = ((site.data_sources as DataSource[]) ?? []).filter((s) => s.id !== sourceId);

  const { error: updateError } = await supabase
    .from("sites")
    .update({ data_sources: updated, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: { id: sourceId, deleted: true } });
}

/** POST /api/v1/sites/[siteId]/data/[sourceId] — EXECUTE a data source query */
export async function POST(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, sourceId } = await params;
  const supabase = await createSupabaseServerClient();

  // Published site data fetches don't require platform auth
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id, data_sources")
    .eq("id", siteId)
    .single();

  if (siteError || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const sources = (site.data_sources as DataSource[]) ?? [];
  const source = sources.find((s) => s.id === sourceId);
  if (!source) return NextResponse.json({ error: "Data source not found" }, { status: 404 });

  let overrides: Record<string, unknown> = {};
  try { overrides = await req.json(); } catch { /* empty body */ }

  try {
    const result = await executeDataSource(source, siteId, supabase, overrides);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Query failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ── Data Source Executor ──────────────────────────────────────────────────────

async function executeDataSource(
  source: DataSource,
  siteId: string,
  // biome-ignore lint/suspicious/noExplicitAny: Supabase client
  supabase: any,
  overrides: Record<string, unknown>
): Promise<unknown> {
  if (source.type === "db.query") {
    const cfg = { ...source.config, ...overrides } as DbQueryConfig & Record<string, unknown>;
    const table = cfg.table as string;
    const selectCols = (cfg.select as string[])?.join(", ") ?? "*";
    let query = supabase.from(table).select(selectCols).eq("site_id", siteId);

    if (cfg.limit) query = query.limit(cfg.limit as number);
    if (cfg.offset && typeof cfg.offset === "number") query = query.range(cfg.offset, cfg.offset + ((cfg.limit as number) ?? 50) - 1);
    if (cfg.orderBy) {
      for (const o of cfg.orderBy as { column: string; dir: "asc" | "desc" }[]) {
        query = query.order(o.column, { ascending: o.dir === "asc" });
      }
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);
    return data;
  }

  if (source.type === "auth.profile") {
    // Return auth user profile — the frontend resolves this client-side
    return null;
  }

  if (source.type === "cms.collection") {
    const cfg = { ...source.config, ...overrides } as Record<string, unknown>;
    const slug = (cfg.slug as string) || (cfg.collection as string) || "";
    if (!slug) throw new Error("cms.collection: missing slug");

    const limit = (cfg.limit as number) || 20;
    const status = (cfg.status as string) || "published";
    const page = (cfg.page as number) || 1;
    const offset = (page - 1) * limit;

    // Use admin client to look up collection by slug (no site_id dependency
    // since sites may only exist locally in Zustand, not in Supabase)
    const admin = createSupabaseAdminClient();
    const { data: collection } = await admin
      .from("cms_collections")
      .select("id, name, slug")
      .eq("slug", slug)
      .maybeSingle();

    if (!collection) throw new Error(`Collection "${slug}" not found`);

    let itemsQuery = admin
      .from("cms_items")
      .select("id, data, status, created_at, updated_at")
      .eq("collection_id", collection.id);

    if (status !== "all") itemsQuery = itemsQuery.eq("status", status);
    itemsQuery = itemsQuery.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

    const { data: items, error: itemsErr } = await itemsQuery;
    if (itemsErr) throw new Error(itemsErr.message);

    return { collection, items: items ?? [], total: (items ?? []).length };
  }

  throw new Error(`Unsupported data source type: ${source.type}`);
}
