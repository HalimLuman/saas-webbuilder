import { notFound } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/server";
import type { CanvasElement } from "@/lib/types";
import SiteRenderer from "./site-renderer";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ slug: string; pagePath?: string[] }>;
}

export default async function SubdomainSitePage({ params }: Props) {
  const { slug, pagePath } = await params;
  const pageSlug = pagePath ? `/${pagePath.join("/")}` : "/";

  const admin = createSupabaseAdminClient();

  const { data: site, error: siteError } = await admin
    .from("sites")
    .select("id, name, slug, status")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  console.log("[tenant] slug:", slug, "site:", site?.id ?? null, "siteError:", siteError?.message ?? null);

  if (!site) notFound();

  const { data: pages, error: pagesError } = await admin
    .from("pages")
    .select("id, title, slug, is_homepage, content")
    .eq("site_id", site.id)
    .order("sort_order");

  console.log("[tenant] pages count:", pages?.length ?? null, "pagesError:", pagesError?.message ?? null);

  if (!pages) notFound();

  const publishedSite = {
    name: site.name as string,
    pages: pages.map((p) => {
      const content = (p.content ?? {}) as Record<string, unknown>;
      return {
        id: p.id as string,
        name: p.title as string,
        slug: p.slug as string,
        isHome: p.is_homepage as boolean,
        elements: (content.elements as CanvasElement[]) ?? [],
        routeType: content.routeType as string | undefined,
        redirectTo: content.redirectTo as string | undefined,
        is404: content.is404 as boolean | undefined,
        isProtected: content.isProtected as boolean | undefined,
      };
    }),
    authConfig: undefined,
  };

  return (
    <SiteRenderer
      site={publishedSite}
      pageSlug={pageSlug}
      siteId={site.id as string}
    />
  );
}
