/**
 * Dynamic Site Route Runner
 * Matches and executes user-defined SiteRoutes stored in sites.site_routes.
 * Called by published sites for custom API endpoints.
 *
 * e.g. POST /api/v1/sites/abc123/run/api/contact
 */

import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteRoute, RouteStep } from "@/lib/types";
import { resolveBindingMap, type ResolverContext } from "@/lib/field-binding-resolver";

type Params = { params: Promise<{ siteId: string; path: string[] }> };

export async function GET(req: NextRequest, { params }: Params) {
  return handleRequest(req, await params, "GET");
}
export async function POST(req: NextRequest, { params }: Params) {
  return handleRequest(req, await params, "POST");
}
export async function PUT(req: NextRequest, { params }: Params) {
  return handleRequest(req, await params, "PUT");
}
export async function PATCH(req: NextRequest, { params }: Params) {
  return handleRequest(req, await params, "PATCH");
}
export async function DELETE(req: NextRequest, { params }: Params) {
  return handleRequest(req, await params, "DELETE");
}

async function handleRequest(
  req: NextRequest,
  params: { siteId: string; path: string[] },
  method: string
) {
  const { siteId, path } = params;
  const routePath = "/" + path.join("/");

  const supabase = await createSupabaseServerClient();
  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id, site_routes, auth_config")
    .eq("id", siteId)
    .single();

  if (siteError || !site) return NextResponse.json({ error: "Site not found" }, { status: 404 });

  const routes = (site.site_routes as SiteRoute[]) ?? [];
  const route = routes.find(
    (r) => r.path === routePath && r.method.toUpperCase() === method.toUpperCase()
  );

  if (!route) return NextResponse.json({ error: "Route not found" }, { status: 404 });

  // Auth check
  let authUser: Record<string, unknown> | null = null;
  const authHeader = req.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.slice(7);
      const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString());
      authUser = payload;
    } catch { /* invalid token */ }
  }

  if (route.auth === "authenticated" && !authUser) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }
  if (route.auth === "api-key") {
    const apiKey = req.headers.get("x-api-key");
    if (!apiKey) return NextResponse.json({ error: "API key required" }, { status: 401 });
    // In production: validate against sites.api_key column
  }

  let body: Record<string, unknown> = {};
  if (method !== "GET" && method !== "DELETE") {
    try { body = await req.json(); } catch { /* empty body */ }
  }

  const urlParams: Record<string, string> = {};
  req.nextUrl.searchParams.forEach((v, k) => { urlParams[k] = v; });

  const ctx: ResolverContext = { formData: body, authUser, urlParams };

  // Execute step pipeline
  let stepResult: unknown = null;
  for (const step of route.steps) {
    stepResult = await executeStep(step, ctx, supabase, siteId, stepResult);

    if (
      step.type === "respond" &&
      typeof step === "object" &&
      "status" in step
    ) {
      return NextResponse.json(step.body, { status: step.status as number });
    }
  }

  return NextResponse.json({ success: true, data: stepResult });
}

// ── Step Executor ─────────────────────────────────────────────────────────────

async function executeStep(
  step: RouteStep,
  ctx: ResolverContext,
  // biome-ignore lint/suspicious/noExplicitAny: Supabase client
  supabase: any,
  siteId: string,
  previousResult: unknown
): Promise<unknown> {
  switch (step.type) {
    case "db.query": {
      const cfg = step.config;
      const selectCols = (cfg.select as string[])?.join(", ") ?? "*";
      let query = supabase.from(cfg.table as string).select(selectCols).eq("site_id", siteId);
      if (cfg.limit) query = query.limit(cfg.limit as number);
      if (cfg.orderBy) {
        for (const o of (cfg.orderBy as { column: string; dir: "asc" | "desc" }[])) {
          query = query.order(o.column, { ascending: o.dir === "asc" });
        }
      }
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      return data;
    }

    case "db.insert": {
      const cfg = step.config;
      const data = resolveBindingMap(
        (cfg.data ?? {}) as Record<string, unknown>,
        ctx
      );
      data.site_id = siteId;
      const { data: rows, error } = await supabase
        .from(cfg.table as string)
        .insert(data)
        .select();
      if (error) throw new Error(error.message);
      return rows;
    }

    case "db.update": {
      const cfg = step.config;
      const data = resolveBindingMap(
        (cfg.data ?? {}) as Record<string, unknown>,
        ctx
      );
      const filter = resolveBindingMap(
        (cfg.filter ?? {}) as Record<string, unknown>,
        ctx
      );
      let query = supabase.from(cfg.table as string).update(data).eq("site_id", siteId);
      for (const [col, val] of Object.entries(filter)) {
        query = query.eq(col, val);
      }
      const { data: rows, error } = await query.select();
      if (error) throw new Error(error.message);
      return rows;
    }

    case "db.delete": {
      const cfg = step.config;
      const filter = resolveBindingMap(
        (cfg.filter ?? {}) as Record<string, unknown>,
        ctx
      );
      let query = supabase.from(cfg.table as string).delete().eq("site_id", siteId);
      for (const [col, val] of Object.entries(filter)) {
        query = query.eq(col, val);
      }
      const { error } = await query;
      if (error) throw new Error(error.message);
      return { deleted: true };
    }

    case "email.send": {
      const cfg = step.config;
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);
      const to = resolveBinding(cfg.to, ctx) as string;
      const { error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL ?? "noreply@buildstack.io",
        to,
        subject: cfg.subject as string,
        html: (cfg.body as string) ?? "<p></p>",
      });
      if (error) throw new Error(error.message);
      return { sent: true };
    }

    case "webhook.call": {
      const cfg = step.config;
      const payload = resolveBindingMap(
        (cfg.payload ?? ctx.formData ?? {}) as Record<string, unknown>,
        ctx
      );
      const res = await fetch(cfg.url as string, {
        method: (cfg.method as string) ?? "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      return { status: res.status, body: await res.text() };
    }

    case "transform": {
      // Execute a simple JS expression with access to previous result
      // biome-ignore lint/security/noEval: user-defined transform (sandboxed per design doc)
      const fn = new Function("result", "ctx", `return (${step.expression})`);
      return fn(previousResult, ctx);
    }

    case "respond":
      // Handled at the call site — just return the body
      return step.body;

    default:
      throw new Error(`Unknown step type`);
  }
}

function resolveBinding(value: unknown, ctx: ResolverContext): unknown {
  if (
    typeof value === "object" &&
    value !== null &&
    "source" in (value as object)
  ) {
    const { resolveFieldBinding } = require("@/lib/field-binding-resolver");
    return resolveFieldBinding(value, ctx);
  }
  return value;
}
