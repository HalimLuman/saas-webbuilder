import { NextRequest, NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { SiteAuthConfig } from "@/lib/types";

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function getSiteAuthConfig(siteId: string): Promise<SiteAuthConfig | null> {
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("sites")
    .select("auth_config")
    .eq("id", siteId)
    .single();
  if (!data?.auth_config) return null;
  return data.auth_config as unknown as SiteAuthConfig;
}

// ─── Supabase handler ─────────────────────────────────────────────────────────

async function handleSupabase(
  cfg: SiteAuthConfig["supabase"],
  body: Record<string, string>
) {
  if (!cfg?.url || !cfg.anonKey) {
    return NextResponse.json({ error: "Supabase credentials not configured" }, { status: 400 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const sbClient = createClient(cfg.url, cfg.anonKey, {
    auth: { persistSession: false },
  });

  const { action, email, password, name, provider } = body;

  if (action === "signup") {
    const { data, error } = await sbClient.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const user = data.user;
    const session = data.session;
    return NextResponse.json({
      user: {
        id: user?.id ?? "",
        email: user?.email ?? email,
        name: (user?.user_metadata?.name as string | undefined) ?? name ?? "",
        avatarUrl: (user?.user_metadata?.avatar_url as string | undefined) ?? null,
      },
      accessToken: session?.access_token ?? null,
      expiresAt: session ? Date.now() + (session.expires_in ?? 3600) * 1000 : null,
      requiresEmailConfirmation: !session,
    });
  }

  if (action === "signin") {
    const { data, error } = await sbClient.auth.signInWithPassword({ email, password });
    if (error) return NextResponse.json({ error: error.message }, { status: 401 });
    const user = data.user;
    const session = data.session;
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email ?? email,
        name: (user.user_metadata?.name as string | undefined) ?? "",
        avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
      },
      accessToken: session.access_token,
      expiresAt: Date.now() + session.expires_in * 1000,
    });
  }

  if (action === "oauth") {
    // Return an OAuth redirect URL that the client can follow
    const { data, error } = await sbClient.auth.signInWithOAuth({
      provider: provider as "google" | "github",
      options: { skipBrowserRedirect: true },
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ redirectUrl: data.url });
  }

  if (action === "signout") {
    // Best-effort — client already cleared localStorage
    return NextResponse.json({ ok: true });
  }

  if (action === "forgot") {
    const { error } = await sbClient.auth.resetPasswordForEmail(email, {
      redirectTo: body.redirectTo || undefined,
    });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  if (action === "reset") {
    const { error } = await sbClient.auth.updateUser({ password: body.password });
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ─── Firebase handler (placeholder — extend as needed) ───────────────────────

async function handleFirebase(
  _cfg: SiteAuthConfig["firebase"],
  body: Record<string, string>
) {
  const { action, email, password } = body;
  // Firebase REST API: https://identitytoolkit.googleapis.com/v1/accounts
  const apiKey = _cfg?.apiKey;
  if (!apiKey) return NextResponse.json({ error: "Firebase API key not configured" }, { status: 400 });

  const endpoint = action === "signup"
    ? `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`
    : `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

  const fbRes = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });
  const fbJson = await fbRes.json();
  if (!fbRes.ok || fbJson.error) {
    return NextResponse.json({ error: fbJson.error?.message ?? "Firebase auth failed" }, { status: 400 });
  }
  return NextResponse.json({
    user: {
      id: fbJson.localId,
      email: fbJson.email,
      name: fbJson.displayName ?? "",
      avatarUrl: fbJson.photoUrl ?? null,
    },
    accessToken: fbJson.idToken,
    expiresAt: Date.now() + Number(fbJson.expiresIn ?? 3600) * 1000,
  });
}

// ─── Custom REST handler ──────────────────────────────────────────────────────

async function handleCustom(
  cfg: SiteAuthConfig["custom"],
  body: Record<string, string>
) {
  const { action, ...rest } = body;
  if (!cfg) return NextResponse.json({ error: "Custom auth URLs not configured" }, { status: 400 });

  const urlMap: Record<string, string | undefined> = {
    signin: cfg.signInUrl,
    signup: cfg.signUpUrl,
    signout: cfg.signOutUrl,
  };
  const url = urlMap[action];
  if (!url) return NextResponse.json({ error: `No URL configured for action: ${action}` }, { status: 400 });

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rest),
  });
  const json = await res.json();
  if (!res.ok) return NextResponse.json({ error: json.error ?? "Auth failed" }, { status: res.status });
  return NextResponse.json(json);
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;

  const body = (await req.json()) as Record<string, unknown>;
  const { action } = body as Record<string, string>;

  let authConfig = await getSiteAuthConfig(siteId);
  if (!authConfig && body.authConfig) {
    authConfig = body.authConfig as SiteAuthConfig;
  }
  if (!authConfig || !authConfig.enabled || authConfig.provider === "none") {
    return NextResponse.json({ error: "Auth not configured for this site" }, { status: 400 });
  }
  if (!action) return NextResponse.json({ error: "Missing action" }, { status: 400 });

  const handlerBody = body as Record<string, string>;
  switch (authConfig.provider) {
    case "supabase":
      return handleSupabase(authConfig.supabase, handlerBody);
    case "firebase":
      return handleFirebase(authConfig.firebase, handlerBody);
    case "custom":
      return handleCustom(authConfig.custom, handlerBody);
    default:
      return NextResponse.json({ error: "Unsupported auth provider" }, { status: 400 });
  }
}
