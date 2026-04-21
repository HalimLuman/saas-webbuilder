import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient, createSupabaseAdminClient } from "@/lib/supabase/server";
import { logActivity } from "@/lib/activity";
import logger from "@/lib/logger";

const log = logger.child({ module: "publish" });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ siteId: string }> }
) {
  const { siteId } = await params;
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: site, error: siteError } = await supabase
    .from("sites")
    .select("id, name, status, slug")
    .eq("id", siteId)
    .single();

  if (siteError || !site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  // Plan-based publish limit: free users may only have 1 published site
  const PUBLISH_LIMITS: Record<string, number> = {
    free: 1, pro: 10, business: 999, enterprise: 999,
  };
  const { data: profile } = await supabase.from("users").select("plan").eq("id", user.id).single();
  const plan = (profile?.plan ?? "free") as string;
  const publishLimit = PUBLISH_LIMITS[plan] ?? PUBLISH_LIMITS.free;

  if (site.status !== "published") {
    // Count other already-published sites (not counting this one, which is being published now)
    const { count: publishedCount } = await supabase
      .from("sites")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", user.id)
      .eq("status", "published")
      .neq("id", siteId);
    if ((publishedCount ?? 0) >= publishLimit) {
      return NextResponse.json(
        { error: `Publish limit reached. Your ${plan} plan allows up to ${publishLimit} published site${publishLimit === 1 ? "" : "s"}. Upgrade to publish more.` },
        { status: 403 }
      );
    }
  }

  // Parse the snapshot sent by the toolbar so we can persist page elements to DB
  const body = await req.json().catch(() => ({}));
  const snapshotPages: Array<{
    id: string;
    slug: string;
    name: string;
    elements?: unknown[];
    isHome?: boolean;
    routeType?: string;
    redirectTo?: string;
    is404?: boolean;
    isProtected?: boolean;
  }> = body.pages ?? [];

  // Persist each page's content (elements + route metadata) to Supabase so that
  // the subdomain renderer can read it without relying on localStorage.
  if (snapshotPages.length > 0) {
    const admin = createSupabaseAdminClient();
    for (const page of snapshotPages) {
      await admin
        .from("pages")
        .update({
          content: {
            elements: page.elements ?? [],
            routeType: page.routeType,
            redirectTo: page.redirectTo,
            is404: page.is404,
            isProtected: page.isProtected,
          },
          title: page.name,
          is_homepage: page.isHome ?? false,
          updated_at: new Date().toISOString(),
        })
        .eq("site_id", siteId)
        .eq("slug", page.slug);
    }
  }

  // Mark site as published
  await supabase
    .from("sites")
    .update({
      status: "published",
      published_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", siteId);

  // Create deployment record
  const { data: deployment, error: deploymentError } = await supabase
    .from("deployments")
    .insert({ site_id: siteId, status: "building" })
    .select()
    .single();

  if (deploymentError || !deployment) {
    log.error({ siteId, err: deploymentError }, "Failed to create deployment record");
    return NextResponse.json({ error: "Failed to create deployment record" }, { status: 500 });
  }

  const deploymentId = deployment.id;
  let vercelDeploymentId: string | null = null;
  let deploymentUrl: string | null = null;

  // Build the built-in subdomain URL
  const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const builtInUrl = site.slug
    ? `${site.slug}.${ROOT_DOMAIN}`
    : null;

  // Trigger Vercel deployment if configured
  const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
  const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

  if (VERCEL_TOKEN && site.slug) {
    try {
      const vercelRes = await fetch(
        `https://api.vercel.com/v13/deployments${VERCEL_TEAM_ID ? `?teamId=${VERCEL_TEAM_ID}` : ""}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${VERCEL_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: `buildstack-${site.slug}`,
            project: site.slug,
            target: "production",
            meta: { siteId, siteName: site.name, triggeredBy: user.id },
            files: [],
            source: "api",
          }),
        }
      );

      if (vercelRes.ok) {
        const vercelData = await vercelRes.json();
        vercelDeploymentId = vercelData.id;
        deploymentUrl = vercelData.url ? `https://${vercelData.url}` : null;
        await supabase
          .from("deployments")
          .update({ vercel_deployment_id: vercelDeploymentId, url: deploymentUrl, status: "building" })
          .eq("id", deploymentId);
        log.info({ siteId, vercelDeploymentId }, "Vercel deployment triggered");
      } else {
        const errText = await vercelRes.text();
        log.error({ siteId, status: vercelRes.status, body: errText }, "Vercel deployment failed");
        let errMsg = `Vercel returned HTTP ${vercelRes.status}.`;
        try {
          const errJson = JSON.parse(errText);
          if (errJson.error?.message) errMsg = errJson.error.message;
          else if (errJson.message) errMsg = errJson.message;
        } catch { /* not JSON */ }
        const now = new Date().toISOString();
        await supabase
          .from("deployments")
          .update({ status: "failed", finished_at: now })
          .eq("id", deploymentId);
        await supabase
          .from("deployments")
          .update({ error_message: errMsg } as never)
          .eq("id", deploymentId);
      }
    } catch (err) {
      log.error({ err, siteId }, "Error triggering Vercel deployment");
      const errMsg =
        err instanceof Error ? err.message : "Unexpected error while contacting Vercel.";
      const now = new Date().toISOString();
      await supabase
        .from("deployments")
        .update({ status: "failed", finished_at: now })
        .eq("id", deploymentId);
      await supabase
        .from("deployments")
        .update({ error_message: errMsg } as never)
        .eq("id", deploymentId);
    }
  } else {
    // No Vercel — built-in subdomain hosting
    const now = new Date().toISOString();
    await supabase
      .from("deployments")
      .update({ status: "success", finished_at: now, url: builtInUrl })
      .eq("id", deploymentId);
    log.info({ siteId, builtInUrl }, "Published via built-in subdomain hosting");
  }

  // Log activity
  await logActivity({
    user_id: user.id,
    owner_id: user.id,
    site_id: siteId,
    action_type: "publish",
    description: `Published site "${site.name}"`,
    metadata: { deploymentId, vercelDeploymentId },
  });

  return NextResponse.json(
    {
      data: {
        deploy_id: deploymentId,
        site_id: siteId,
        status: vercelDeploymentId ? "building" : "success",
        url: deploymentUrl ?? builtInUrl,
        vercel_deployment_id: vercelDeploymentId,
        started_at: new Date().toISOString(),
        estimated_seconds: vercelDeploymentId ? 45 : null,
      },
    },
    { status: 202 }
  );
}
