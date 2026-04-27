"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Bell, Search, ChevronRight, LogOut, Settings, Menu } from "lucide-react";
import Sidebar from "@/components/dashboard/sidebar";
import { useUser } from "@/hooks/use-user";
import { StoreHydrator } from "@/components/store-hydrator";

// ---------------------------------------------------------------------------
// Breadcrumb helpers
// ---------------------------------------------------------------------------

/**
 * Converts a URL segment into a human-readable label.
 * e.g. "my-sites" → "My Sites"
 */
function segmentToLabel(segment: string): string {
  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Builds a breadcrumb trail from the current pathname.
 * e.g. /dashboard/sites/new → ["Dashboard", "Sites", "New"]
 */
function useBreadcrumbs(): { label: string; href: string }[] {
  const pathname = usePathname();
  return useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return segments.map((seg, idx) => ({
      label: segmentToLabel(seg),
      href:  "/" + segments.slice(0, idx + 1).join("/"),
    }));
  }, [pathname]);
}

// ---------------------------------------------------------------------------
// TopHeader
// ---------------------------------------------------------------------------

function UserMenu() {
  const { user, profile } = useUser();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSignOut = useCallback(async () => {
    // POST to the server-side sign-out route so HTTP-only session cookies
    // are properly expired. A client-only signOut() cannot touch those cookies.
    await fetch("/api/v1/auth/signout", { method: "POST" });
    window.location.replace("/login");
  }, []);

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : user?.email?.slice(0, 2).toUpperCase() ?? "??";

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-dark text-xs font-bold ring-2 ring-white shadow-sm hover:ring-primary-200 transition-all"
        title={profile?.name ?? user?.email ?? "User"}
      >
        {profile?.avatar_url ? (
          <Image src={profile.avatar_url} alt={initials} width={32} height={32} unoptimized className="h-8 w-8 rounded-full object-cover" />
        ) : (
          initials
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl border border-gray-100 shadow-xl z-50 py-1 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">{profile?.name ?? "User"}</p>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            <span className="inline-block mt-1 text-[10px] font-medium text-primary bg-primary-50 border border-primary-100 px-2 py-0.5 rounded-full capitalize">
              {profile?.plan ?? "free"}
            </span>
          </div>
          <Link
            href="/dashboard/settings"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Settings className="h-3.5 w-3.5 text-gray-400" />
            Settings
          </Link>
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

function TopHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const breadcrumbs = useBreadcrumbs();

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-6 shrink-0 gap-3">

      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Left: breadcrumb */}
      <nav className="flex items-center gap-1 min-w-0 text-sm flex-1" aria-label="Breadcrumb">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          return (
            <React.Fragment key={crumb.href}>
              {idx > 0 && (
                <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
              )}
              <span
                className={
                  isLast
                    ? "font-semibold text-gray-900 truncate"
                    : "text-gray-400 hover:text-gray-600 transition-colors truncate"
                }
              >
                {crumb.label}
              </span>
            </React.Fragment>
          );
        })}
      </nav>

      {/* Right: search + bell + user */}
      <div className="flex items-center gap-3 shrink-0">

        {/* Search bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            placeholder="Search..."
            className="h-8 w-48 lg:w-64 pl-8 pr-3 rounded-lg bg-gray-50 border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent focus:bg-white transition-all"
          />
        </div>

        {/* Activity logs */}
        <Link
          href="/dashboard/logs"
          className="relative h-8 w-8 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
          aria-label="Activity Logs"
        >
          <Bell className="h-4 w-4" />
        </Link>

        <UserMenu />
      </div>
    </header>
  );
}

// ---------------------------------------------------------------------------
// DashboardLayout
// ---------------------------------------------------------------------------

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <StoreHydrator />
      <div className="flex h-screen bg-gray-50 overflow-hidden">

        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* Right panel: header + scrollable content */}
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopHeader onMenuClick={() => setSidebarOpen(true)} />

          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}
