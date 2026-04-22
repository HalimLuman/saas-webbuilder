"use client";

import React from "react";
import Link from "next/link";
import {
  Zap, ChevronLeft, Monitor, Tablet, Smartphone,
  Undo2, Redo2, Eye, Globe, Save, Check, Loader2,
  ZoomIn, ZoomOut, Grid3X3, Command, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/store/editor-store";
import { useSiteStore } from "@/store/site-store";
import { cn, generateId } from "@/lib/utils";
import type { DeviceMode } from "@/lib/types";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";

const deviceButtons: { mode: DeviceMode; icon: React.ElementType; label: string; size: string }[] = [
  { mode: "desktop", icon: Monitor, label: "Desktop", size: "" },
  { mode: "large-tablet", icon: Tablet, label: "Large Tablet", size: "1024" },
  { mode: "tablet", icon: Tablet, label: "Tablet", size: "768" },
  { mode: "mobile", icon: Smartphone, label: "Mobile", size: "390" },
  { mode: "small-mobile", icon: Smartphone, label: "Small Mobile", size: "320" },
];

interface ToolbarProps {
  onOpenCommandPalette?: () => void;
}

export default function EditorToolbar({ onOpenCommandPalette }: ToolbarProps) {
  const {
    siteName, setSiteName, siteId, deviceMode, setDeviceMode,
    isSaving, lastSaved, elements, currentPageId,
    undo, redo, undoStack, redoStack, setIsSaving,
    zoom, zoomIn, zoomOut, setZoom, showGrid, toggleGrid,
  } = useEditorStore();

  const updateSite = useSiteStore((s) => s.updateSite);
  const getSiteById = useSiteStore((s) => s.getSiteById);
  const { profile } = useUser();
  const isPaidPlan = profile?.plan && profile.plan !== "free";

  const [editingName, setEditingName] = React.useState(false);
  const [nameValue, setNameValue] = React.useState(siteName);
  const [isPublishing, setIsPublishing] = React.useState(false);
  const [published, setPublished] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const handlePreview = () => {
    // Save all pages so preview has up-to-date content for every page
    const currentSiteId = siteId ?? "draft";
    const site = getSiteById(currentSiteId);
    if (site) {
      // Flush current page's elements into the site before opening preview
      const pages = site.pages?.length ? [...site.pages] : [];
      const targetIdx = currentPageId ? pages.findIndex((p) => p.id === currentPageId) : pages.findIndex((p) => p.isHome);
      if (targetIdx >= 0) pages[targetIdx] = { ...pages[targetIdx], elements };
      updateSite(currentSiteId, { pages });
      localStorage.setItem(`preview-site-${currentSiteId}`, JSON.stringify({ ...site, pages }));
    } else {
      localStorage.setItem(`preview-${currentSiteId}`, JSON.stringify(elements));
    }
    window.open(`/preview/${currentSiteId}`, "_blank");
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const currentSiteId = siteId ?? "draft";
      const site = getSiteById(currentSiteId);

      // Build pages array with current page elements flushed in
      const pages = site?.pages?.length ? [...site.pages] : [];
      const targetIdx = currentPageId
        ? pages.findIndex((p) => p.id === currentPageId)
        : pages.findIndex((p) => p.isHome);
      if (targetIdx >= 0) {
        pages[targetIdx] = { ...pages[targetIdx], elements };
      } else if (pages.length === 0) {
        pages.push({ id: `page-${generateId()}`, name: "Home", slug: "/", elements, isHome: true });
      }

      const exportSite = {
        name: siteName,
        pages: pages.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          elements: p.elements ?? [],
          isHome: p.isHome,
        })),
      };

      // Dynamic imports to keep this out of the initial bundle
      const [{ default: JSZip }, { generateNextjsProject }] = await Promise.all([
        import("jszip"),
        import("@/lib/export-nextjs"),
      ]);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const projectFiles = generateNextjsProject(exportSite as any);

      const zip = new JSZip();
      for (const [filePath, content] of Object.entries(projectFiles)) {
        zip.file(filePath, content);
      }

      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${siteName || "my-site"}-nextjs.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success("Next.js project exported!", {
        description: "Unzip and run `npm install && npm run dev` to get started.",
        duration: 5000,
      });
    } catch (err) {
      console.error("Export failed:", err);
      toast.error("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    const currentSiteId = siteId ?? "draft";
    const site = getSiteById(currentSiteId);

    if (site) {
      const pages = site.pages?.length ? [...site.pages] : [];
      const targetIdx = currentPageId ? pages.findIndex((p) => p.id === currentPageId) : pages.findIndex((p) => p.isHome);
      if (targetIdx >= 0) {
        pages[targetIdx] = { ...pages[targetIdx], elements };
      } else if (pages.length > 0) {
        pages[0] = { ...pages[0], elements };
      } else {
        pages.push({ id: `page-${generateId()}`, name: "Home", slug: "/", elements, isHome: true });
      }
      updateSite(currentSiteId, { pages });
    } else {
      localStorage.setItem(`editor-elements-${currentSiteId}`, JSON.stringify(elements));
    }

    setIsSaving(false);
    toast.success("Changes saved");
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    try {
      const currentSiteId = siteId ?? "draft";
      const site = getSiteById(currentSiteId);

      // Flush current page elements into a full site snapshot and save to localStorage.
      // This is what /published/[siteId] reads to render the live site.
      const pages = site?.pages?.length ? [...site.pages] : [];
      const targetIdx = currentPageId
        ? pages.findIndex((p) => p.id === currentPageId)
        : pages.findIndex((p) => p.isHome);
      if (targetIdx >= 0) {
        pages[targetIdx] = { ...pages[targetIdx], elements };
      } else if (pages.length === 0) {
        pages.push({ id: `page-${generateId()}`, name: "Home", slug: "/", elements, isHome: true });
      }
      const snapshot = { ...(site ?? {}), name: siteName, pages };
      localStorage.setItem(`published-site-${currentSiteId}`, JSON.stringify(snapshot));

      // Also persist the elements into the site store so the dashboard stays in sync
      if (site) updateSite(currentSiteId, { pages });

      const res = await fetch(`/api/v1/sites/${currentSiteId}/publish`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Send the full snapshot so the API can persist elements to the DB.
        // The subdomain renderer reads from DB, not localStorage.
        body: JSON.stringify({ pages }),
      });
      if (res.ok) {
        const resData = await res.json().catch(() => ({}));
        const siteSlug = site?.slug;
        const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
        const protocol = rootDomain.includes("localhost") ? "http" : "https";
        const liveUrl = resData.data?.url
          ?? (siteSlug ? `${protocol}://${siteSlug}.${rootDomain}` : null);
        setPublished(true);
        updateSite(currentSiteId, { status: "published", publishedAt: new Date() });
        toast.success("Site published!", {
          description: liveUrl ? `Live at ${liveUrl}` : "Your changes are now live.",
          duration: 5000,
          action: liveUrl ? { label: "Open", onClick: () => window.open(liveUrl, "_blank") } : undefined,
        });
        setTimeout(() => setPublished(false), 5000);
      } else {
        toast.error("Publish failed. Please try again.");
      }
    } catch {
      toast.success("Site published! (mock mode)", { description: "Add API keys to enable real deployment." });
      setPublished(true);
      setTimeout(() => setPublished(false), 5000);
    } finally {
      setIsPublishing(false);
    }
  };

  const handleNameSubmit = () => {
    setSiteName(nameValue);
    setEditingName(false);
  };

  const zoomOptions = [50, 75, 100, 125, 150, 200];

  return (
    <div className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-3 shrink-0 z-40 gap-2">

      {/* Left */}
      <div className="flex items-center gap-2 min-w-0">
        <Button variant="ghost" size="icon-sm" asChild className="text-gray-500 hover:text-gray-700 shrink-0">
          <Link href="/dashboard">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>

        <div className="h-4 w-px bg-gray-200 shrink-0" />

        <Link href="/" className="flex items-center gap-1.5 shrink-0">
          <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Zap className="h-3 w-3 text-white" />
          </div>
        </Link>

        <div className="h-4 w-px bg-gray-200 shrink-0" />

        {/* Site name */}
        {editingName ? (
          <input
            autoFocus
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={handleNameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleNameSubmit();
              if (e.key === "Escape") { setNameValue(siteName); setEditingName(false); }
            }}
            className="text-sm font-medium text-gray-900 bg-gray-50 border border-indigo-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36"
          />
        ) : (
          <button
            onClick={() => setEditingName(true)}
            className="text-sm font-medium text-gray-900 hover:bg-gray-50 px-2 py-1 rounded transition-colors max-w-[140px] truncate"
            title="Click to rename"
          >
            {siteName}
          </button>
        )}

        {/* Save status */}
        {isSaving ? (
          <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
            <Loader2 className="h-3 w-3 animate-spin" />
            Saving…
          </div>
        ) : lastSaved ? (
          <div className="flex items-center gap-1 text-xs text-gray-400 shrink-0">
            <Check className="h-3 w-3 text-green-500" />
            Saved
          </div>
        ) : null}

        {/* Cmd+K button */}
        <button
          onClick={onOpenCommandPalette}
          title="Command Palette (Cmd+K)"
          className="hidden lg:flex items-center gap-1.5 h-7 px-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors text-xs font-medium shrink-0"
        >
          <Command className="h-3 w-3" />
          <span>⌘K</span>
        </button>
      </div>

      {/* Center — device + zoom */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Device switcher */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-gray-100">
          {deviceButtons.map(({ mode, icon: Icon, label, size }) => (
            <button
              key={mode}
              title={`${label}${size ? ` — ${size}px` : ""}`}
              onClick={() => setDeviceMode(mode)}
              className={cn(
                "flex items-center gap-1 h-7 px-1.5 rounded-md transition-all",
                deviceMode === mode ? "bg-white text-gray-900 shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" />
              {size && <span className="text-[10px] font-semibold tabular-nums leading-none">{size}</span>}
            </button>
          ))}
        </div>

        {/* Zoom controls */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-gray-100">
          <button
            onClick={zoomOut}
            disabled={zoom <= 25}
            title="Zoom out (-)"
            className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <select
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="h-7 w-14 text-center text-[11px] font-medium text-gray-700 bg-transparent focus:outline-none cursor-pointer"
          >
            {zoomOptions.map((z) => (
              <option key={z} value={z}>{z}%</option>
            ))}
          </select>
          <button
            onClick={zoomIn}
            disabled={zoom >= 200}
            title="Zoom in (+)"
            className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-30 transition-all"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Grid overlay toggle */}
        <button
          onClick={toggleGrid}
          title="Toggle grid overlay (G)"
          className={cn(
            "h-7 w-7 rounded-md flex items-center justify-center transition-all",
            showGrid ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400 hover:text-gray-600"
          )}
        >
          <Grid3X3 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 shrink-0">
        {/* Undo/Redo */}
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-gray-100">
          <button
            onClick={undo}
            disabled={undoStack.length === 0}
            title="Undo (⌘Z)"
            className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Undo2 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={redoStack.length === 0}
            title="Redo (⌘⇧Z)"
            className="h-7 w-7 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            <Redo2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200" />

        <Button
          variant="ghost" size="sm"
          onClick={handlePreview}
          className="gap-1.5 text-xs text-gray-600"
          title="Open preview in new tab (⌘P)"
        >
          <Eye className="h-3.5 w-3.5" />
          Preview
        </Button>

        <Button
          variant="ghost" size="sm"
          onClick={() => {
            if (!isPaidPlan) {
              toast.error("Code export is a paid feature", { description: "Upgrade to Pro or higher to export your project." });
              return;
            }
            handleExport();
          }}
          disabled={isExporting}
          className="gap-1.5 text-xs text-gray-600"
          title={isPaidPlan ? "Export as Next.js project" : "Upgrade to export"}
        >
          {isExporting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Download className="h-3.5 w-3.5" />}
          Export
        </Button>

        <Button
          variant="outline" size="sm"
          onClick={handleSave}
          disabled={isSaving}
          className="gap-1.5 text-xs"
        >
          <Save className="h-3.5 w-3.5" />
          Save
        </Button>

        <Button
          size="sm"
          className={cn("gap-1.5 text-xs transition-all", published ? "bg-green-500 hover:bg-green-600" : "bg-indigo-500 hover:bg-indigo-600")}
          onClick={handlePublish}
          disabled={isPublishing}
        >
          {isPublishing ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : published ? <Check className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
          {isPublishing ? "Publishing…" : published ? "Published!" : "Publish"}
        </Button>
      </div>
    </div>
  );
}
