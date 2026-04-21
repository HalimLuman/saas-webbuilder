"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { SiteAuthProvider } from "@/lib/site-auth-context";
import { PreviewContext } from "@/lib/preview-context";

// canvas.tsx → sanitize.ts → isomorphic-dompurify → jsdom crashes the Next.js
// SSR sandbox. Load the canvas only in the browser where a real DOM exists.
const CanvasElementRenderer = dynamic(
  () => import("@/components/editor/canvas").then((m) => m.CanvasElementRenderer),
  { ssr: false }
);
import type { CanvasElement, SiteAuthConfig, Site, Deployment } from "@/lib/types";

interface PublishedSite {
    name?: string;
    pages: { id: string; name: string; slug: string; elements: CanvasElement[]; isHome?: boolean; routeType?: string; redirectTo?: string; is404?: boolean; isProtected?: boolean }[];
    authConfig?: SiteAuthConfig;
}

export default function PublishedPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const siteId = params.siteId as string;
    const requestedSlug = searchParams.get("page") ?? "/";
    const deployId = searchParams.get("deployId");

    const [site, setSite] = useState<PublishedSite | null>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        try {
            if (deployId) {
                // If a specific deployment is requested, we need to load it from the site store
                const rawStore = localStorage.getItem("site-store-v2");
                if (rawStore) {
                    const parsed = JSON.parse(rawStore);
                    const theSite = parsed?.state?.sites?.find((s: Site) => s.id === siteId);
                    if (theSite && theSite.deployments) {
                        const deployment = theSite.deployments.find((d: Deployment) => d.id === deployId);
                        if (deployment && deployment.versionData) {
                            setSite(JSON.parse(deployment.versionData));
                            setLoaded(true);
                            return;
                        }
                    }
                }
            }

            // Default: load the latest published snapshot
            const siteRaw = localStorage.getItem(`published-site-${siteId}`);
            if (siteRaw) {
                setSite(JSON.parse(siteRaw));
            }
        } catch { /* ignore */ }
        setLoaded(true);
    }, [siteId, deployId]);

    if (!loaded) return null;

    if (!site) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-500 text-sm gap-2">
                <div className="text-3xl mb-2">🚀</div>
                <p className="font-semibold text-lg text-gray-800">No Published Content Found</p>
                <p className="text-center max-w-sm">Open the editor, add content, then click <strong>Publish</strong> in the editor toolbar to see your site here.</p>
            </div>
        );
    }

    const pages = site.pages ?? [];
    const currentPage =
        pages.find((p) => p.slug === requestedSlug) ??
        pages.find((p) => p.isHome) ??
        pages[0];

    const authConfig = site.authConfig;

    // Session check
    const isAuthenticated = (() => {
        try {
            const raw = localStorage.getItem(`bs_site_auth_${siteId}`);
            if (!raw) return false;
            const parsed = JSON.parse(raw);
            return parsed?.accessToken && (!parsed.expiresAt || Date.now() < parsed.expiresAt);
        } catch {
            return false;
        }
    })();

    const publishedUrl = (slug: string) => {
        const p = pages.find((pg) => pg.slug === slug);
        if (!p) return null;
        let url = p.isHome ? `/published/${siteId}` : `/published/${siteId}?page=${encodeURIComponent(slug)}`;
        if (deployId) {
            url += (url.includes('?') ? '&' : '?') + `deployId=${deployId}`;
        }
        return url;
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const anchor = (e.target as HTMLElement).closest("a");
        if (!anchor) return;
        const href = anchor.getAttribute("href");
        if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
        const normalised = href.startsWith("/") ? href : `/${href}`;
        const matchedPage = pages.find((p) => p.slug === normalised);
        if (matchedPage) {
            e.preventDefault();
            const dest = publishedUrl(matchedPage.slug);
            if (dest) router.push(dest);
        }
    };

    if (!currentPage) {
        const notFoundPage = pages.find((p) => p.is404);
        if (notFoundPage) {
            const sorted404 = [...(notFoundPage.elements ?? [])].sort((a, b) => a.order - b.order);
            return (
                <PreviewContext.Provider value={true}>
                    <SiteAuthProvider siteId={siteId} authConfig={authConfig}>
                        <div className="min-h-screen bg-white" onClick={handleClick}>
                            {sorted404.map((el) => (
                                <CanvasElementRenderer key={el.id} element={el} />
                            ))}
                        </div>
                    </SiteAuthProvider>
                </PreviewContext.Provider>
            );
        }
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
                Page not found on this published site.
            </div>
        );
    }

    if (currentPage.redirectTo) {
        const dest = publishedUrl(currentPage.redirectTo);
        if (dest && currentPage.slug !== currentPage.redirectTo) {
            router.replace(dest);
            return null;
        }
    }

    const isPrivate = currentPage.isProtected || currentPage.routeType === "private";
    if (isPrivate && !isAuthenticated) {
        const signInSlug = authConfig?.signInPageSlug || "/login";
        if (currentPage.slug !== signInSlug) {
            const dest = publishedUrl(signInSlug);
            if (dest) {
                router.replace(dest);
                return null;
            }
            return (
                <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 p-8 text-center">
                    <div className="text-4xl">🔒</div>
                    <h1 className="text-2xl font-bold text-gray-800">Private Page</h1>
                    <p className="text-gray-500 max-w-sm">
                        This published page is private.
                    </p>
                </div>
            );
        }
    }

    if (currentPage.routeType === "auth-only" && isAuthenticated) {
        const afterSignInSlug = authConfig?.redirectAfterSignIn ?? "/";
        const dest = publishedUrl(afterSignInSlug) ?? `/published/${siteId}`;
        if (currentPage.slug !== afterSignInSlug) {
            router.replace(dest);
            return null;
        }
    }

    const sorted = [...(currentPage.elements ?? [])].sort((a, b) => a.order - b.order);

    return (
        <PreviewContext.Provider value={true}>
            <SiteAuthProvider siteId={siteId} authConfig={authConfig}>
                <div className="min-h-screen bg-white" onClick={handleClick}>
                    {sorted.map((el) => (
                        <CanvasElementRenderer key={el.id} element={el} />
                    ))}
                </div>
            </SiteAuthProvider>
        </PreviewContext.Provider>
    );
}
