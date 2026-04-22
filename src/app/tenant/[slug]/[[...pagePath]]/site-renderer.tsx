"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { SiteAuthProvider } from "@/lib/site-auth-context";
import { PreviewContext } from "@/lib/preview-context";
import type { CanvasElement, SiteAuthConfig } from "@/lib/types";

const CanvasElementRenderer = dynamic(
  () => import("@/components/editor/canvas").then((m) => m.CanvasElementRenderer),
  { ssr: false }
);

interface PublishedPage {
  id: string;
  name: string;
  slug: string;
  isHome?: boolean;
  elements: CanvasElement[];
  routeType?: string;
  redirectTo?: string;
  is404?: boolean;
  isProtected?: boolean;
}

interface PublishedSite {
  name: string;
  pages: PublishedPage[];
  authConfig?: SiteAuthConfig;
}

interface Props {
  site: PublishedSite;
  pageSlug: string;
  siteId: string;
}

export default function SiteRenderer({ site, pageSlug, siteId }: Props) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(`bs_site_auth_${siteId}`);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed?.accessToken && (!parsed.expiresAt || Date.now() < parsed.expiresAt)) {
        setIsAuthenticated(true);
      }
    } catch { /* ignore */ }
  }, [siteId]);

  const pages = site.pages ?? [];

  const currentPage =
    pages.find((p) => p.slug === pageSlug) ??
    pages.find((p) => p.isHome) ??
    pages[0];

  const authConfig = site.authConfig;

  // On the subdomain, hrefs are just path slugs — no translation needed.
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (e.target as HTMLElement).closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href");
    if (
      !href ||
      href.startsWith("http") ||
      href.startsWith("mailto:") ||
      href.startsWith("tel:") ||
      href.startsWith("#")
    )
      return;
    const normalised = href.startsWith("/") ? href : `/${href}`;
    const matchedPage = pages.find((p) => p.slug === normalised);
    if (matchedPage) {
      e.preventDefault();
      router.push(matchedPage.slug);
    }
  };

  if (!currentPage) {
    const notFoundPage = pages.find((p) => p.is404);
    if (notFoundPage) {
      const sorted = [...(notFoundPage.elements ?? [])].sort((a, b) => a.order - b.order);
      return (
        <PreviewContext.Provider value={true}>
          <SiteAuthProvider siteId={siteId} authConfig={authConfig} navigate={router.push}>
            <div className="min-h-screen bg-white" onClick={handleClick}>
              {sorted.map((el) => (
                <CanvasElementRenderer key={el.id} element={el} />
              ))}
            </div>
          </SiteAuthProvider>
        </PreviewContext.Provider>
      );
    }
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 text-sm">
        Page not found.
      </div>
    );
  }

  if (currentPage.redirectTo && currentPage.slug !== currentPage.redirectTo) {
    router.replace(currentPage.redirectTo);
    return null;
  }

  const isPrivate = currentPage.isProtected || currentPage.routeType === "private";
  if (isPrivate && !isAuthenticated) {
    const signInSlug = authConfig?.signInPageSlug ?? "/login";
    if (currentPage.slug !== signInSlug) {
      router.replace(signInSlug);
      return null;
    }
  }

  if (currentPage.routeType === "auth-only" && isAuthenticated) {
    const dest = authConfig?.redirectIfAuthenticated ?? authConfig?.redirectAfterSignIn ?? "/";
    if (currentPage.slug !== dest) {
      router.replace(dest);
      return null;
    }
  }

  // Also guard the designated sign-in/sign-up pages even if routeType isn't set
  const isSignInOrUp = authConfig && (
    currentPage.slug === authConfig.signInPageSlug ||
    currentPage.slug === authConfig.signUpPageSlug
  );
  if (isSignInOrUp && isAuthenticated) {
    const dest = authConfig.redirectIfAuthenticated ?? authConfig.redirectAfterSignIn ?? "/";
    if (currentPage.slug !== dest) {
      router.replace(dest);
      return null;
    }
  }

  const sorted = [...(currentPage.elements ?? [])].sort((a, b) => a.order - b.order);

  return (
    <PreviewContext.Provider value={true}>
      <SiteAuthProvider siteId={siteId} authConfig={authConfig} navigate={router.push}>
        <div className="min-h-screen bg-white" onClick={handleClick}>
          {sorted.map((el) => (
            <CanvasElementRenderer key={el.id} element={el} />
          ))}
        </div>
      </SiteAuthProvider>
    </PreviewContext.Provider>
  );
}
