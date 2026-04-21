import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const PLAN_LIMITS: Record<string, { sites: number; publishedSites: number; aiCredits: number }> = {
  free:       { sites: 2,   publishedSites: 1,  aiCredits: 0 },
  pro:        { sites: 10,  publishedSites: 10, aiCredits: 50 },
  business:   { sites: 999, publishedSites: 999, aiCredits: 500 },
  enterprise: { sites: 999, publishedSites: 999, aiCredits: 99999 },
};

export async function GET(_req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("users")
    .select("id, name, email, avatar_url, plan, ai_credits_used, ai_credits_limit, stripe_customer_id, created_at")
    .eq("id", user.id)
    .single();

  if (profileError || !profile) {
    return NextResponse.json({ error: "User profile not found" }, { status: 404 });
  }

  const { count: siteCount } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id);

  const { count: publishedCount } = await supabase
    .from("sites")
    .select("id", { count: "exact", head: true })
    .eq("owner_id", user.id)
    .eq("status", "published");

  const limits = PLAN_LIMITS[profile.plan ?? "free"] ?? PLAN_LIMITS.free;

  return NextResponse.json({
    id: profile.id,
    name: profile.name ?? user.email?.split("@")[0] ?? "User",
    email: profile.email ?? user.email,
    avatarUrl: profile.avatar_url ?? null,
    plan: profile.plan ?? "free",
    planLabel: (profile.plan ?? "free").charAt(0).toUpperCase() + (profile.plan ?? "free").slice(1),
    aiCredits: {
      used: profile.ai_credits_used ?? 0,
      limit: profile.ai_credits_limit ?? limits.aiCredits,
      resetDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    },
    sites: {
      count: siteCount ?? 0,
      limit: limits.sites,
      publishedCount: publishedCount ?? 0,
      publishedLimit: limits.publishedSites,
    },
    createdAt: profile.created_at,
    preferences: {
      theme: "system",
      emailNotifications: true,
      marketingEmails: false,
    },
  });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, email } = body;

    const updates: Record<string, string> = {};
    if (name) updates.name = name;
    if (email) updates.email = email;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updates)
      .eq("id", user.id)
      .select("id, name, email")
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: data });
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }
}
