import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { BackendAction } from "@/lib/types";
import { resolveBindingMap, type ResolverContext } from "@/lib/field-binding-resolver";
import { Resend } from "resend";

type Params = { params: Promise<{ siteId: string; actionId: string }> };

async function loadSite(siteId: string, userId: string) {
  const supabase = await createSupabaseServerClient();
  const { data: site, error } = await supabase
    .from("sites")
    .select("id, backend_actions, auth_config")
    .eq("id", siteId)
    .eq("owner_id", userId)
    .single();
  return { site, error, supabase };
}

/** GET /api/v1/sites/[siteId]/actions/[actionId] — fetch single action */
export async function GET(
  _req: NextRequest,
  { params }: Params
) {
  const { siteId, actionId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { site, error } = await loadSite(siteId, user.id);
  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const actions = (site.backend_actions as BackendAction[]) ?? [];
  const action = actions.find((a) => a.id === actionId);
  if (!action) return NextResponse.json({ error: "Action not found" }, { status: 404 });

  return NextResponse.json({ data: action });
}

/** PUT /api/v1/sites/[siteId]/actions/[actionId] — update action */
export async function PUT(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, actionId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { site, error, supabase: sb } = await loadSite(siteId, user.id);
  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const body = await req.json();
  const actions = (site.backend_actions as BackendAction[]) ?? [];
  const idx = actions.findIndex((a) => a.id === actionId);
  if (idx === -1) return NextResponse.json({ error: "Action not found" }, { status: 404 });

  actions[idx] = { ...actions[idx], ...body, id: actionId };

  const { error: updateError } = await sb
    .from("sites")
    .update({ backend_actions: actions, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: actions[idx] });
}

/** DELETE /api/v1/sites/[siteId]/actions/[actionId] — delete action */
export async function DELETE(
  _req: NextRequest,
  { params }: Params
) {
  const { siteId, actionId } = await params;
  const supabase = await createSupabaseServerClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { site, error, supabase: sb } = await loadSite(siteId, user.id);
  if (error || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const actions = (site.backend_actions as BackendAction[]) ?? [];
  const updated = actions.filter((a) => a.id !== actionId);

  const { error: updateError } = await sb
    .from("sites")
    .update({ backend_actions: updated, updated_at: new Date().toISOString() })
    .eq("id", siteId);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ data: { id: actionId, deleted: true } });
}

/** POST /api/v1/sites/[siteId]/actions/[actionId] — EXECUTE a backend action */
export async function POST(
  req: NextRequest,
  { params }: Params
) {
  const { siteId, actionId } = await params;
  const supabase = await createSupabaseServerClient();

  // Load site without requiring platform auth (published sites call this as end-users)
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id, backend_actions, auth_config")
    .eq("id", siteId)
    .single();

  if (siteError || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const actions = (site.backend_actions as BackendAction[]) ?? [];
  const action = actions.find((a) => a.id === actionId);
  if (!action) return NextResponse.json({ error: "Action not found" }, { status: 404 });

  // Parse request body and URL params
  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* empty body */ }

  const urlParams: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => { urlParams[k] = v; });

  // Resolve auth user from request header token (end-user, not platform user)
  let authUser: Record<string, unknown> | null = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ") && (site.auth_config as Record<string, unknown>)?.enabled) {
    // In a real implementation, validate the JWT against the site's Supabase project
    // For now we pass through any decoded payload if available
    try {
      const token = authHeader.slice(7);
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
      authUser = payload;
    } catch { /* invalid token */ }
  }

  // Check auth requirement
  if (action.auth === "authenticated" && !authUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  const ctx: ResolverContext = {
    formData: body as Record<string, unknown>,
    authUser,
    urlParams,
  };

  try {
    const result = await executeAction(action, ctx, supabase, siteId);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Action execution failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ── Action Executor ───────────────────────────────────────────────────────────

async function executeAction(
  action: BackendAction,
  ctx: ResolverContext,
  // biome-ignore lint/suspicious/noExplicitAny: Supabase client typing
  supabase: any,
  siteId: string
): Promise<unknown> {
  const config = action.config;

  switch (action.type) {
    case "db.insert": {
      const table = config.table as string;
      const dataTemplate = (config.data ?? {}) as Record<string, unknown>;
      const data = resolveBindingMap(dataTemplate, ctx);
      // Always inject site_id for row-level isolation
      data.site_id = siteId;
      const returning = (config.returning as string[]) ?? [];
      const query = supabase.from(table).insert(data);
      const { data: rows, error } = returning.length
        ? await query.select(returning.join(", "))
        : await query;
      if (error) throw new Error(error.message);
      return rows;
    }

    case "db.update": {
      const table = config.table as string;
      const dataTemplate = (config.data ?? {}) as Record<string, unknown>;
      const filterTemplate = (config.filter ?? {}) as Record<string, unknown>;
      const data = resolveBindingMap(dataTemplate, ctx);
      const filter = resolveBindingMap(filterTemplate, ctx);
      let query = supabase.from(table).update(data).eq("site_id", siteId);
      for (const [col, val] of Object.entries(filter)) {
        query = query.eq(col, val);
      }
      const { data: rows, error } = await query.select();
      if (error) throw new Error(error.message);
      return rows;
    }

    case "db.delete": {
      const table = config.table as string;
      const filterTemplate = (config.filter ?? {}) as Record<string, unknown>;
      const filter = resolveBindingMap(filterTemplate, ctx);
      let query = supabase.from(table).delete().eq("site_id", siteId);
      for (const [col, val] of Object.entries(filter)) {
        query = query.eq(col, val);
      }
      const { error } = await query;
      if (error) throw new Error(error.message);
      return { deleted: true };
    }

    case "db.query": {
      const table = config.table as string;
      const select = (config.select as string[])?.join(", ") ?? "*";
      let query = supabase.from(table).select(select).eq("site_id", siteId);
      if (config.limit) query = query.limit(config.limit as number);
      if (config.orderBy) {
        const ob = config.orderBy as { column: string; dir: "asc" | "desc" }[];
        for (const o of ob) query = query.order(o.column, { ascending: o.dir === "asc" });
      }
      const { data: rows, error } = await query;
      if (error) throw new Error(error.message);
      return rows;
    }

    case "email.send": {
      const resendKey = process.env.RESEND_API_KEY;
      if (!resendKey) throw new Error("RESEND_API_KEY not configured");
      const resend = new Resend(resendKey);
      const to = resolveFieldBinding(config.to as Parameters<typeof resolveFieldBinding>[0], ctx) as string;
      const subject = config.subject as string;
      const html = (config.body as string) ?? "<p>No content</p>";
      const { error } = await resend.emails.send({
        from: (process.env.RESEND_FROM_EMAIL as string) ?? "noreply@buildstack.io",
        to,
        subject,
        html,
      });
      if (error) throw new Error(error.message);
      return { sent: true };
    }

    case "webhook.call": {
      const url = config.url as string;
      const method = (config.method as string) ?? "POST";
      const payloadTemplate = (config.payload ?? ctx.formData ?? {}) as Record<string, unknown>;
      const payload = resolveBindingMap(payloadTemplate, ctx);
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const responseBody = await res.text();
      return { status: res.status, body: responseBody };
    }

    case "lemonsqueezy.checkout": {
      const lsKey = process.env.LEMONSQUEEZY_API_KEY;
      const storeId = process.env.LEMONSQUEEZY_STORE_ID ?? "";
      if (!lsKey) throw new Error("LEMONSQUEEZY_API_KEY not configured");
      const { lemonSqueezySetup, createCheckout } = await import("@lemonsqueezy/lemonsqueezy.js");
      lemonSqueezySetup({ apiKey: lsKey });
      const variantId = config.variantId as string;
      if (!variantId) throw new Error("variantId is required in action config");
      const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "";
      const { data: checkout, error } = await createCheckout(storeId, variantId, {
        checkoutData: { custom: { siteId } },
        productOptions: {
          redirectUrl: (config.successUrl as string) ?? `${appUrl}/success`,
        },
      });
      if (error) throw error;
      return { url: checkout?.data?.attributes?.url, checkoutId: checkout?.data?.id };
    }

    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

// Resolve a single FieldBinding inline (re-exported from util for convenience)
function resolveFieldBinding(
  binding: { source: string; [key: string]: unknown },
  ctx: ResolverContext
): unknown {
  // biome-ignore lint/suspicious/noExplicitAny: casting for switch
  const { resolveFieldBinding: resolve } = require("@/lib/field-binding-resolver");
  return resolve(binding, ctx);
}
