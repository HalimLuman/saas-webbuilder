"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { PreviewContext } from "@/lib/preview-context";
import { CanvasElementRenderer } from "@/components/editor/canvas";
import { SiteAuthProvider } from "@/lib/site-auth-context";
import { useEditorStore } from "@/store/editor-store";
import type { CanvasElement, DeviceMode, SiteAuthConfig } from "@/lib/types";

interface PreviewPage {
  id: string;
  name: string;
  slug: string;
  elements: CanvasElement[];
  isHome?: boolean;
  isProtected?: boolean;
  routeType?: "public" | "private" | "auth-only";
  redirectTo?: string;
  is404?: boolean;
}

interface PreviewSite {
  name?: string;
  pages: PreviewPage[];
  authConfig?: SiteAuthConfig;
}

function getDeviceModeFromWidth(width: number): DeviceMode {
  if (width <= 340) return "small-mobile";
  if (width <= 480) return "mobile";
  if (width <= 768) return "tablet";
  if (width <= 1024) return "large-tablet";
  return "desktop";
}

export default function PreviewPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const siteId = params.siteId as string;
  const setDeviceMode = useEditorStore((s) => s.setDeviceMode);

  // Sync store deviceMode with actual browser viewport so responsive overrides apply
  useEffect(() => {
    const update = () => setDeviceMode(getDeviceModeFromWidth(window.innerWidth));
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [setDeviceMode]);

  // ?page=/about selects a page by slug; default is home
  const requestedSlug = searchParams.get("page") ?? "/";

  const [site, setSite] = useState<PreviewSite | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const siteRaw = localStorage.getItem(`preview-site-${siteId}`);
      if (siteRaw) {
        setSite(JSON.parse(siteRaw));
        setLoaded(true);
        // Fire-and-forget page view tracking
        fetch("/api/v1/analytics/track", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            siteId,
            pagePath: requestedSlug,
            referrer: document.referrer || null,
          }),
        }).catch(() => {}); // silently ignore tracking failures
        return;
      }
      // Fallback: legacy single-page preview
      const legacyRaw = localStorage.getItem(`preview-${siteId}`);
      if (legacyRaw) {
        const elements: CanvasElement[] = JSON.parse(legacyRaw);
        setSite({ pages: [{ id: "home", name: "Home", slug: "/", elements, isHome: true }] });
      }
    } catch { /* ignore */ }
    setLoaded(true);
  }, [siteId]);

  if (!loaded) return null;

  const pages = site?.pages ?? [];
  const currentPage =
    pages.find((p) => p.slug === requestedSlug) ??
    pages.find((p) => p.isHome) ??
    pages[0];

  const authConfig = site?.authConfig;

  // ── Session check (synchronous from localStorage) ────────────────────────────
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

  // ── Helper: build a preview URL for a slug ───────────────────────────────────
  const previewUrl = (slug: string) => {
    const p = pages.find((pg) => pg.slug === slug);
    if (!p) return null;
    return p.isHome ? `/preview/${siteId}` : `/preview/${siteId}?page=${encodeURIComponent(slug)}`;
  };

  const previewNavigate = (slug: string) => {
    const url = previewUrl(slug);
    if (url) router.push(url);
  };

  // ── Intercept relative link clicks ───────────────────────────────────────────
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.startsWith("#")) return;
    const normalised = href.startsWith("/") ? href : `/${href}`;
    const matchedPage = pages.find((p) => p.slug === normalised);
    if (matchedPage) {
      e.preventDefault();
      const dest = matchedPage.isHome ? `/preview/${siteId}` : `/preview/${siteId}?page=${encodeURIComponent(matchedPage.slug)}`;
      router.push(dest);
    }
  };

  // ── 404 handler ───────────────────────────────────────────────────────────────
  if (!currentPage) {
    const notFoundPage = pages.find((p) => p.is404);
    if (notFoundPage) {
      const sorted404 = [...(notFoundPage.elements ?? [])].sort((a, b) => a.order - b.order);
      return (
        <SiteAuthProvider siteId={siteId} authConfig={authConfig} navigate={previewNavigate}>
          <PreviewContext.Provider value={true}>
            <div className="min-h-screen bg-white" onClick={handleClick}>
              {sorted404.map((el) => (
                <CanvasElementRenderer key={el.id} element={el} />
              ))}
            </div>
          </PreviewContext.Provider>
        </SiteAuthProvider>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        No preview available. Open the editor and click Preview.
      </div>
    );
  }

  // ── Redirect rule ─────────────────────────────────────────────────────────────
  // When a page has redirectTo set, visitors are immediately sent there.
  if (currentPage.redirectTo) {
    const dest = previewUrl(currentPage.redirectTo);
    if (dest && currentPage.slug !== currentPage.redirectTo) {
      router.replace(dest);
      return null;
    }
  }

  // ── Route guard — private pages ───────────────────────────────────────────────
  // isProtected (legacy) or routeType === "private" requires a valid session.
  const isPrivate = currentPage.isProtected || currentPage.routeType === "private";
  if (isPrivate && !isAuthenticated) {
    const signInSlug = authConfig?.signInPageSlug || "/login";
    if (currentPage.slug !== signInSlug) {
      const dest = previewUrl(signInSlug);
      if (dest) {
        router.replace(dest);
        return null;
      }
      // No sign-in page configured — show inline auth wall
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 gap-4 p-8 text-center">
          <div className="text-4xl">🔒</div>
          <h1 className="text-2xl font-bold text-gray-800">Private Page</h1>
          <p className="text-gray-500 max-w-sm">
            You must be signed in to view this page. Configure a sign-in page in the editor&apos;s Auth panel.
          </p>
        </div>
      );
    }
  }

  // ── Route guard — auth-only pages (guest-only, e.g. sign-in/sign-up) ─────────
  // If the visitor is already authenticated, redirect them away.
  const authOnlyRedirectSlug = authConfig?.redirectIfAuthenticated ?? authConfig?.redirectAfterSignIn ?? "/";
  if (currentPage.routeType === "auth-only" && isAuthenticated) {
    const dest = previewUrl(authOnlyRedirectSlug) ?? `/preview/${siteId}`;
    if (currentPage.slug !== authOnlyRedirectSlug) {
      router.replace(dest);
      return null;
    }
  }

  // Also guard the designated sign-in/sign-up pages even if routeType isn't explicitly set
  const isSignInOrUp = authConfig && (
    currentPage.slug === authConfig.signInPageSlug ||
    currentPage.slug === authConfig.signUpPageSlug
  );
  if (isSignInOrUp && isAuthenticated) {
    const dest = previewUrl(authOnlyRedirectSlug) ?? `/preview/${siteId}`;
    if (currentPage.slug !== authOnlyRedirectSlug) {
      router.replace(dest);
      return null;
    }
  }

  const sorted = [...(currentPage.elements ?? [])].sort((a, b) => a.order - b.order);

  return (
    <SiteAuthProvider siteId={siteId} authConfig={authConfig} navigate={previewNavigate}>
    <PreviewContext.Provider value={true}>
      <div className="min-h-screen bg-white" onClick={handleClick}>
        {sorted.map((el) => (
          <CanvasElementRenderer key={el.id} element={el} />
        ))}
      </div>
    </PreviewContext.Provider>
    </SiteAuthProvider>
  );
}
