"use client";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import {
  DndContext, DragEndEvent, DragStartEvent,
  PointerSensor, useSensor, useSensors, DragOverlay,
  closestCenter, MeasuringStrategy,
  type CollisionDetection,
} from "@dnd-kit/core";
import {
  Layers, LayoutDashboard, FileText, Sparkles,
  ChevronLeft, ChevronRight, X, Plus, ChevronDown,
  Search, Globe, Clock, LayoutTemplate, ShieldCheck, Lock, Unlock, Server,
  Route, AlertCircle, LogIn, CornerDownRight,
} from "lucide-react";
import EditorToolbar from "@/components/editor/toolbar";
import dynamic from "next/dynamic";

// Canvas is always needed — static import for fastest initial render
import Canvas from "@/components/editor/canvas";

// Panels are conditionally shown — lazy load to reduce initial bundle
const ElementsPanel = dynamic(() => import("@/components/editor/elements-panel"), { ssr: false });
const PropertiesPanel = dynamic(() => import("@/components/editor/properties-panel"), { ssr: false });
const LayersPanel = dynamic(() => import("@/components/editor/layers-panel"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/editor/command-palette"), { ssr: false });
const BackendPanel   = dynamic(() => import("@/components/editor/backend-panel"),   { ssr: false });
const HistoryPanel = dynamic(() => import("@/components/editor/history-panel"), { ssr: false });
const SectionsPanel = dynamic(() => import("@/components/editor/sections-panel"), { ssr: false });
const AccessibilityPanel = dynamic(() => import("@/components/editor/accessibility-panel"), { ssr: false });
const FindReplace = dynamic(() => import("@/components/editor/find-replace"), { ssr: false });
import { useEditorStore, findInTree } from "@/store/editor-store";
import { useSiteStore } from "@/store/site-store";
import { cn } from "@/lib/utils";
import { PreviewContext } from "@/lib/preview-context";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import type { DraggableElement, PageRouteType } from "@/lib/types";

type LeftTab = "elements" | "pages" | "layers" | "sections" | "history" | "a11y" | "backend";

export default function EditorPage() {
  const params = useParams();
  const siteId = params.siteId as string;

  const {
    setSiteId, setSiteName, loadElements, addElementFromDrag, reorderElements,
    addChildElement, elements, siteName, undo, redo, saveState, selectedElementId, removeElement,
    duplicateElement, copyElement, pasteElement,
    setDeviceMode,
    zoomIn, zoomOut, setZoom, toggleGrid,
    wrapInContainer, toggleElementLock, toggleElementVisibility,
    setIsSaving, isPreviewMode, currentPageId, setCurrentPageId,
  } = useEditorStore();

  const getSiteById = useSiteStore((s) => s.getSiteById);
  const updateSite = useSiteStore((s) => s.updateSite);

  const [leftTab, setLeftTab] = useState<LeftTab>("elements");
  // Start panels open (consistent SSR default); narrow viewports collapse them after mount
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [rightPanelOpen, setRightPanelOpen] = useState(true);
  useEffect(() => {
    setLeftPanelOpen(window.innerWidth >= 768);
    setRightPanelOpen(window.innerWidth >= 1024);
  }, []);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiMessages, setAiMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [activeDraggable, setActiveDraggable] = useState<DraggableElement | null>(null);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [findReplaceOpen, setFindReplaceOpen] = useState(false);
  const [renamingPageId, setRenamingPageId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletePageConfirm, setDeletePageConfirm] = useState<{ id: string; name: string } | null>(null);
  const [expandedRoutePageId, setExpandedRoutePageId] = useState<string | null>(null);
  const [draftRoutes, setDraftRoutes] = useState<Record<string, { slug: string; routeGroup: string; routeType: PageRouteType; redirectTo: string; is404: boolean }>>({});

  // ── Helpers ─────────────────────────────────────────────────────────────────

  // Persist current canvas elements into the given page ID within the site store
  const saveCurrentPageElements = useCallback((targetPageId: string) => {
    const currentElements = useEditorStore.getState().elements;
    const site = getSiteById(siteId);
    if (!site) return;
    const pages = [...(site.pages ?? [])];
    const idx = pages.findIndex((p) => p.id === targetPageId);
    if (idx >= 0) {
      pages[idx] = { ...pages[idx], elements: currentElements };
      updateSite(siteId, { pages });
    }
  }, [getSiteById, siteId, updateSite]);

  // Switch to a different page (auto-saves current first)
  const switchToPage = useCallback((pageId: string) => {
    const cpId = useEditorStore.getState().currentPageId;
    if (cpId) saveCurrentPageElements(cpId);
    const site = getSiteById(siteId);
    const page = site?.pages?.find((p) => p.id === pageId);
    if (!page) return;
    loadElements(page.elements ?? []);
    setCurrentPageId(pageId);
  }, [getSiteById, siteId, loadElements, setCurrentPageId, saveCurrentPageElements]);

  // Add a new page
  const addPage = useCallback(() => {
    const cpId = useEditorStore.getState().currentPageId;
    if (cpId) saveCurrentPageElements(cpId);
    const site = getSiteById(siteId);
    if (!site) return;
    const pageNum = (site.pages?.length ?? 0) + 1;
    const newPage = {
      id: `page-${Date.now()}`,
      name: `Page ${pageNum}`,
      slug: `/page-${pageNum}`,
      elements: [],
      isHome: false,
    };
    const pages = [...(site.pages ?? []), newPage];
    updateSite(siteId, { pages });
    loadElements([]);
    setCurrentPageId(newPage.id);
  }, [getSiteById, siteId, updateSite, loadElements, setCurrentPageId, saveCurrentPageElements]);

  // Delete a page
  const deletePage = useCallback((pageId: string) => {
    const site = getSiteById(siteId);
    if (!site || (site.pages?.length ?? 0) <= 1) return; // can't delete last page
    const pages = (site.pages ?? []).filter((p) => p.id !== pageId);
    updateSite(siteId, { pages });
    // If deleting the active page, switch to the first remaining page
    if (useEditorStore.getState().currentPageId === pageId) {
      const next = pages[0];
      loadElements(next.elements ?? []);
      setCurrentPageId(next.id);
    }
  }, [getSiteById, siteId, updateSite, loadElements, setCurrentPageId]);

  // Generic field updater — merges any Page fields for a given page id
  const updatePageFields = useCallback((pageId: string, fields: Partial<import("@/lib/types").Page>) => {
    const site = getSiteById(siteId);
    if (!site) return;
    const pages = (site.pages ?? []).map((p) => p.id === pageId ? { ...p, ...fields } : p);
    updateSite(siteId, { pages });
  }, [getSiteById, siteId, updateSite]);

  // Commit an inline rename (only updates name; slug stays independent)
  const commitRename = useCallback((pageId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    updatePageFields(pageId, { name: trimmed });
    setRenamingPageId(null);
  }, [updatePageFields]);

  // Load site data
  useEffect(() => {
    // The editor lives outside the dashboard layout, so the Zustand persist
    // store may not have been rehydrated yet on a hard refresh. Rehydrating
    // here is safe to call multiple times — it's a no-op if already done.
    useSiteStore.persist.rehydrate();

    setSiteId(siteId);
    // Read from getState() so we see the just-rehydrated data synchronously.
    const site = useSiteStore.getState().getSiteById(siteId);
    if (site) {
      setSiteName(site.name);
      const homePage = site.pages?.find((p) => p.isHome) ?? site.pages?.[0];
      if (homePage) {
        // Always call loadElements — even with an empty array — so any stale
        // store state (e.g. defaultElements from a previous session) is cleared.
        loadElements(homePage.elements ?? []);
        setCurrentPageId(homePage.id);
      } else {
        try {
          const raw = localStorage.getItem(`editor-elements-${siteId}`);
          loadElements(raw ? JSON.parse(raw) : []);
        } catch {
          loadElements([]);
        }
      }
    } else {
      try {
        const raw = localStorage.getItem(`editor-elements-${siteId}`);
        loadElements(raw ? JSON.parse(raw) : []);
      } catch {
        loadElements([]);
      }
    }
  }, [siteId, setSiteId, setSiteName, loadElements, setCurrentPageId]);

  // ── Keyboard shortcuts ──────────────────────────────────────────────────────
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const isMac = navigator.platform.toUpperCase().includes("MAC");
    const ctrl = isMac ? e.metaKey : e.ctrlKey;
    const target = e.target as HTMLElement;
    const inInput = target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;

    // Command palette — works everywhere
    if (ctrl && e.key === "k") { e.preventDefault(); setCommandPaletteOpen(true); return; }
    // Find & Replace — works everywhere
    if (ctrl && e.key === "f") { e.preventDefault(); setFindReplaceOpen((v) => !v); return; }

    if (inInput) return;

    // Undo / Redo
    if (ctrl && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
    if (ctrl && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); redo(); }

    // Save — persist to site store
    if (ctrl && e.key === "s") {
      e.preventDefault();
      const { elements: currentElements, currentPageId: cpId } = useEditorStore.getState();
      setIsSaving(true);
      const site = getSiteById(siteId);
      if (site) {
        const pages = site.pages?.length ? [...site.pages] : [];
        const targetIdx = cpId ? pages.findIndex((p) => p.id === cpId) : pages.findIndex((p) => p.isHome);
        if (targetIdx >= 0) {
          pages[targetIdx] = { ...pages[targetIdx], elements: currentElements };
        } else if (pages.length > 0) {
          pages[0] = { ...pages[0], elements: currentElements };
        } else {
          pages.push({ id: `page-home`, name: "Home", slug: "/", elements: currentElements, isHome: true });
        }
        updateSite(siteId, { pages });
      } else {
        localStorage.setItem(`editor-elements-${siteId}`, JSON.stringify(currentElements));
      }
      setIsSaving(false);
    }

    // Delete
    if ((e.key === "Delete" || e.key === "Backspace") && selectedElementId) {
      e.preventDefault(); removeElement(selectedElementId);
    }

    // Duplicate
    if (ctrl && e.key === "d" && selectedElementId) { e.preventDefault(); duplicateElement(selectedElementId); }

    // Copy / Paste
    if (ctrl && e.key === "c" && selectedElementId) { e.preventDefault(); copyElement(selectedElementId); }
    if (ctrl && e.key === "v") { e.preventDefault(); pasteElement(); }

    // Zoom
    if (ctrl && (e.key === "=" || e.key === "+")) { e.preventDefault(); zoomIn(); }
    if (ctrl && e.key === "-") { e.preventDefault(); zoomOut(); }
    if (ctrl && e.key === "0") { e.preventDefault(); setZoom(100); }

    // Toggle panels
    if (ctrl && e.key === "\\") { e.preventDefault(); setLeftPanelOpen((v) => !v); }
    if (ctrl && e.key === ".") { e.preventDefault(); setRightPanelOpen((v) => !v); }
    // Ctrl+/ — toggle both panels (focus canvas)
    if (ctrl && e.key === "/") {
      e.preventDefault();
      setLeftPanelOpen((v) => !v);
      setRightPanelOpen((v) => !v);
    }

    // Preview — open in new tab
    if (ctrl && e.key === "p") {
      e.preventDefault();
      const els = useEditorStore.getState().elements;
      localStorage.setItem(`preview-${siteId}`, JSON.stringify(els));
      window.open(`/preview/${siteId}`, "_blank");
    }

    // Wrap in container
    if (ctrl && e.key === "g" && selectedElementId) { e.preventDefault(); wrapInContainer(selectedElementId); }

    // Lock / Visibility
    if (ctrl && e.key === "l" && selectedElementId) { e.preventDefault(); toggleElementLock(selectedElementId); }
    if (ctrl && e.key === "h" && selectedElementId) { e.preventDefault(); toggleElementVisibility(selectedElementId); }

    // Grid
    if (e.key === "g" && !ctrl) { toggleGrid(); }

    // Z-index: Ctrl+] raise, Ctrl+[ lower
    if (ctrl && e.key === "]" && selectedElementId) {
      e.preventDefault();
      const el = findInTree(elements, selectedElementId);
      if (el) {
        const current = parseInt((el.styles?.zIndex as string) || "0") || 0;
        useEditorStore.getState().updateElementStyles(selectedElementId, { zIndex: String(current + 1) });
      }
    }
    if (ctrl && e.key === "[" && selectedElementId) {
      e.preventDefault();
      const el = findInTree(elements, selectedElementId);
      if (el) {
        const current = parseInt((el.styles?.zIndex as string) || "0") || 0;
        useEditorStore.getState().updateElementStyles(selectedElementId, { zIndex: String(current - 1) });
      }
    }

    // Arrow key nudge (1px; Shift+Arrow = 10px)
    if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key) && selectedElementId) {
      e.preventDefault();
      const amount = e.shiftKey ? 10 : 1;
      const el = findInTree(elements, selectedElementId);
      if (el) {
        const styles = el.styles || {};
        const pos = (styles.position as string) || "static";
        // Auto-switch to relative if not positioned
        const newPos = pos === "static" ? "relative" : pos;
        const dir = e.key === "ArrowUp" ? "top" : e.key === "ArrowDown" ? "bottom"
          : e.key === "ArrowLeft" ? "left" : "right";
        const current = parseInt((styles as Record<string, string>)[dir] || "0") || 0;
        useEditorStore.getState().updateElementStyles(selectedElementId, {
          position: newPos as React.CSSProperties["position"],
          [dir]: `${current + (e.key === "ArrowUp" || e.key === "ArrowLeft" ? -amount : amount)}px`,
        });
      }
    }

    // Device shortcuts
    if (e.key === "1" && ctrl) { e.preventDefault(); setDeviceMode("desktop"); }
    if (e.key === "2" && ctrl) { e.preventDefault(); setDeviceMode("tablet"); }
    if (e.key === "3" && ctrl) { e.preventDefault(); setDeviceMode("mobile"); }
  }, [
    undo, redo, saveState, selectedElementId, removeElement, duplicateElement,
    copyElement, pasteElement, zoomIn, zoomOut, setZoom, toggleGrid,
    setDeviceMode, siteId, wrapInContainer, toggleElementLock, toggleElementVisibility,
    elements, setIsSaving, getSiteById, updateSite,
  ]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // ── DnD ─────────────────────────────────────────────────────────────────────
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  // Custom collision detection: prioritize nested droppable zones over sortable items.
  // We explicitly iterate all registered droppable containers and find the
  // smallest (most specific) nested-zone-* that contains the pointer.
  // This avoids issues with pointerWithin missing nested zones inside SortableContext wrappers.
  const collisionDetectionStrategy: CollisionDetection = useCallback(
    (args) => {
      // Panel drags: ONLY accept drops on explicit named zones.
      if (args.active.data.current?.type === "element") {
        const { droppableContainers, droppableRects, pointerCoordinates } = args;
        if (!pointerCoordinates) return [];

        let bestId: string | null = null;
        let smallestArea = Infinity;

        for (const container of droppableContainers) {
          const id = container.id.toString();
          if (!id.startsWith("nested-zone-") && id !== "canvas-drop-zone") continue;

          const rect = droppableRects.get(container.id);
          if (!rect) continue;

          if (
            pointerCoordinates.x >= rect.left &&
            pointerCoordinates.x <= rect.right &&
            pointerCoordinates.y >= rect.top &&
            pointerCoordinates.y <= rect.bottom
          ) {
            const area = rect.width * rect.height;
            if (area < smallestArea) {
              smallestArea = area;
              bestId = id;
            }
          }
        }

        if (bestId) {
          const container = droppableContainers.find(c => c.id.toString() === bestId)!;
          return [{ id: container.id, data: { droppableContainer: container, value: 0 } }];
        }
        return [];
      }

      // Canvas sortable reordering: standard closest-center
      return closestCenter(args);
    },
    []
  );

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.type === "element") {
      setActiveDraggable(event.active.data.current.element as DraggableElement);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveDraggable(null);
    if (!over) return;

    const overId = over.id.toString();
    const activeId = active.id.toString();

    // 1. Dropping from Elements Panel
    if (activeId.startsWith("draggable-")) {
      const elementData = active.data.current?.element as DraggableElement;
      if (!elementData) return;

      // Drop into a specific nested zone
      if (overId.startsWith("nested-zone-")) {
        const parentId = overId.replace("nested-zone-", "");
        addChildElement(parentId, { 
          type: elementData.type, 
          content: elementData.defaultContent, 
          styles: elementData.defaultStyles 
        });
      } 
      // Drop into main canvas
      else if (overId === "canvas-drop-zone") {
        addElementFromDrag({ 
          type: elementData.type, 
          content: elementData.defaultContent, 
          styles: elementData.defaultStyles 
        });
      }
      return;
    }

    // 2. Reordering on Canvas (Top Level or Nested)
    if (activeId !== overId) {
      const activeExists = findInTree(elements, activeId);
      const overExists = findInTree(elements, overId);
      if (activeExists && overExists) {
        reorderElements(activeId, overId);
      }
    }
  };

  const leftTabConfig = [
    { id: "elements" as LeftTab, icon: LayoutDashboard, label: "Elements" },
    { id: "sections" as LeftTab, icon: LayoutTemplate, label: "Sections" },
    { id: "layers" as LeftTab, icon: Layers, label: "Layers" },
    { id: "pages" as LeftTab, icon: FileText, label: "Pages" },
    { id: "history" as LeftTab, icon: Clock, label: "History" },
    { id: "a11y" as LeftTab, icon: ShieldCheck, label: "Accessibility" },
    { id: "backend"  as LeftTab, icon: Server,     label: "Backend" },
  ];

  const sendAiMessage = async (msg: string) => {
    setAiMessages((prev) => [...prev, { role: "user", content: msg }]);
    setAiPrompt("");
    setAiLoading(true);
    try {
      const res = await fetch("/api/v1/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, context: { siteName, currentPage: "Home" } }),
      });
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      setAiMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const lines = decoder.decode(value).split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.delta?.text) {
              reply += data.delta.text;
              setAiMessages((prev) => { const next = [...prev]; next[next.length - 1] = { role: "assistant", content: reply }; return next; });
            }
          } catch { /* ignore parse errors */ }
        }
      }
    } catch {
      setAiMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Please try again." }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <EditorToolbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />

      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetectionStrategy}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        measuring={{ droppable: { strategy: MeasuringStrategy.WhileDragging } }}
      >
        <div className="flex flex-1 overflow-hidden">

          {/* ── Left Sidebar (Activity Bar) ── */}
          <div className="w-12 md:w-16 bg-white border-r border-gray-100 flex flex-col items-center py-3 md:py-4 gap-3 md:gap-4 z-20 shadow-[1px_0_0_0_rgba(0,0,0,0.02)] shrink-0">
            {leftTabConfig.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  if (leftTab === tab.id && leftPanelOpen) {
                    setLeftPanelOpen(false);
                  } else {
                    setLeftTab(tab.id);
                    setLeftPanelOpen(true);
                  }
                }}
                title={tab.label}
                className={cn(
                  "h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-200 group relative",
                  leftTab === tab.id && leftPanelOpen
                    ? "bg-indigo-50 text-indigo-600 shadow-sm"
                    : "text-gray-400 hover:text-gray-600 hover:bg-gray-50 outline-none"
                )}
              >
                <tab.icon className={cn("h-5 w-5 transition-transform duration-200", leftTab === tab.id && leftPanelOpen && "scale-110")} />
                {leftTab === tab.id && leftPanelOpen && (
                  <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full" />
                )}

                {/* Simple Tooltip on Hover */}
                <div className="absolute left-14 px-2 py-1 bg-gray-900 text-white text-[10px] font-medium rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-xl">
                  {tab.label}
                </div>
              </button>
            ))}

            <div className="mt-auto">
              <button
                onClick={() => setLeftPanelOpen(!leftPanelOpen)}
                className="h-10 w-10 rounded-xl flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-50 transition-colors"
                title={leftPanelOpen ? "Close Panel" : "Open Panel"}
              >
                {leftPanelOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* ── Side Panel Content ── */}
          {/* Mobile: fixed overlay; Desktop: inline panel */}
          {leftPanelOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-30 md:hidden"
              onClick={() => setLeftPanelOpen(false)}
              aria-hidden="true"
            />
          )}
          <div className={cn(
            "bg-white border-r border-gray-100 flex flex-col transition-all duration-300 ease-in-out shrink-0 overflow-hidden shadow-[4px_0_12px_rgba(0,0,0,0.02)]",
            "fixed md:relative inset-y-0 left-12 md:left-auto z-40 md:z-auto",
            leftPanelOpen ? "w-72 translate-x-0" : "w-0 -translate-x-full md:translate-x-0"
          )}>
            <div className="flex items-center justify-between px-4 py-4 shrink-0 border-b border-gray-50 bg-white/50 backdrop-blur-sm">
              <h2 className="text-sm font-bold text-gray-800 capitalize tracking-tight flex items-center gap-2">
                {leftTab === "elements" && <LayoutDashboard className="h-3.5 w-3.5 text-indigo-500" />}
                {leftTab === "sections" && <LayoutTemplate className="h-3.5 w-3.5 text-indigo-500" />}
                {leftTab === "layers" && <Layers className="h-3.5 w-3.5 text-indigo-500" />}
                {leftTab === "pages" && <FileText className="h-3.5 w-3.5 text-indigo-500" />}
                {leftTab === "history" && <Clock className="h-3.5 w-3.5 text-indigo-500" />}
                {leftTab === "a11y" && <ShieldCheck className="h-3.5 w-3.5 text-indigo-500" />}
                {leftTab === "backend"  && <Server     className="h-3.5 w-3.5 text-violet-500" />}
                {leftTab}
              </h2>
              <button
                onClick={() => setLeftPanelOpen(false)}
                className="h-6 w-6 flex items-center justify-center text-gray-300 hover:text-gray-500 hover:bg-gray-100 rounded-md transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="flex-1 overflow-hidden">
              {leftTab === "elements" && <ElementsPanel />}
              {leftTab === "sections" && <SectionsPanel />}
              {leftTab === "layers" && <LayersPanel />}
              {leftTab === "history" && <HistoryPanel />}
              {leftTab === "a11y" && <AccessibilityPanel />}
              {leftTab === "backend"  && <BackendPanel />}
              {leftTab === "pages" && (() => {
                const sitePages = getSiteById(siteId)?.pages ?? [];

                // Route type display config
                const routeTypeMeta: Record<PageRouteType, { label: string; icon: React.ReactNode; rowCls: string; badgeCls: string }> = {
                  "public":    { label: "Public",    icon: <Globe className="h-3 w-3" />,       rowCls: "border-transparent", badgeCls: "bg-emerald-50 text-emerald-700 border-emerald-200" },
                  "private":   { label: "Private",   icon: <Lock className="h-3 w-3" />,        rowCls: "border-amber-100",   badgeCls: "bg-amber-50 text-amber-700 border-amber-200" },
                  "auth-only": { label: "Auth only", icon: <LogIn className="h-3 w-3" />,       rowCls: "border-blue-100",    badgeCls: "bg-blue-50 text-blue-700 border-blue-200" },
                };

                // Derive a compact display path (with route group prefix if set)
                const displaySlug = (page: (typeof sitePages)[number]) => {
                  const group = page.routeGroup ? `${page.routeGroup}/` : "";
                  return group + page.slug;
                };

                return (
                  <div className="flex flex-col h-full bg-white overflow-y-auto">
                    {/* Header */}
                    <div className="flex items-center gap-2 px-3 pt-3 pb-2">
                      <Route className="h-3.5 w-3.5 text-indigo-400" />
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Route Manager</span>
                    </div>

                    <div className="px-3 pb-3 space-y-1.5">
                      {sitePages.map((page) => {
                        const isActive = page.id === currentPageId;
                        const isRenaming = renamingPageId === page.id;
                        const isExpanded = expandedRoutePageId === page.id;
                        const routeType: PageRouteType = page.routeType ?? (page.isProtected ? "private" : "public");
                        const meta = routeTypeMeta[routeType];

                        return (
                          <div
                            key={page.id}
                            className={cn(
                              "rounded-xl border overflow-hidden transition-all",
                              isActive ? "border-indigo-200 shadow-sm" : meta.rowCls,
                              isExpanded ? "shadow-md" : ""
                            )}
                          >
                            {/* ── Row ── */}
                            <div className={cn(
                              "flex items-center gap-2 px-2.5 py-2 text-xs",
                              isActive ? "bg-indigo-50" : "bg-white hover:bg-gray-50/70"
                            )}>
                              {/* Expand/collapse */}
                              <button
                                onClick={() => {
                                  if (isExpanded) {
                                    setExpandedRoutePageId(null);
                                  } else {
                                    setExpandedRoutePageId(page.id);
                                    setDraftRoutes(prev => ({
                                      ...prev,
                                      [page.id]: {
                                        slug: page.slug,
                                        routeGroup: page.routeGroup ?? "",
                                        routeType: page.routeType ?? (page.isProtected ? "private" : "public"),
                                        redirectTo: page.redirectTo ?? "",
                                        is404: page.is404 ?? false,
                                      },
                                    }));
                                  }
                                }}
                                className="h-4 w-4 flex items-center justify-center shrink-0 text-gray-400 hover:text-gray-600"
                              >
                                <ChevronDown className={cn("h-3 w-3 transition-transform", isExpanded ? "rotate-0" : "-rotate-90")} />
                              </button>

                              {/* Page name — click to switch */}
                              <button
                                onClick={() => !isActive && switchToPage(page.id)}
                                className="flex items-center gap-1.5 flex-1 min-w-0 text-left"
                              >
                                {isRenaming ? (
                                  <input
                                    autoFocus
                                    value={renameValue}
                                    onChange={(e) => setRenameValue(e.target.value)}
                                    onBlur={() => commitRename(page.id, renameValue)}
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") commitRename(page.id, renameValue);
                                      if (e.key === "Escape") setRenamingPageId(null);
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-1 min-w-0 bg-white border border-indigo-300 rounded px-1.5 py-0.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                                  />
                                ) : (
                                  <span className={cn("font-semibold truncate max-w-[80px]", isActive ? "text-indigo-700" : "text-gray-800")}>
                                    {page.name}
                                  </span>
                                )}
                                {/* Slug pill */}
                                {!isRenaming && (
                                  <span className="font-mono text-[10px] text-gray-400 truncate">{displaySlug(page)}</span>
                                )}
                              </button>

                              {/* Route type badge */}
                              <span className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[10px] font-bold shrink-0", meta.badgeCls)}>
                                {meta.icon}{meta.label}
                              </span>

                              {/* Badges */}
                              {page.isHome && <span className="text-[9px] font-bold uppercase tracking-wider text-indigo-400 shrink-0">HOME</span>}
                              {page.is404   && <span className="text-[9px] font-bold uppercase tracking-wider text-red-400 shrink-0">404</span>}
                              {page.redirectTo && <CornerDownRight className="h-3 w-3 text-violet-400 shrink-0" />}

                              {/* Actions */}
                              <div className="hidden group-hover:flex items-center gap-0.5 shrink-0">
                                <button
                                  title="Rename"
                                  onClick={(e) => { e.stopPropagation(); setRenameValue(page.name); setRenamingPageId(page.id); }}
                                  className="h-5 w-5 flex items-center justify-center rounded hover:bg-gray-200 text-gray-400 hover:text-gray-600"
                                >
                                  <Globe className="h-3 w-3" />
                                </button>
                                {sitePages.length > 1 && (
                                  <button
                                    title="Delete page"
                                    onClick={(e) => { e.stopPropagation(); deletePage(page.id); }}
                                    className="h-5 w-5 flex items-center justify-center rounded hover:bg-red-50 text-gray-400 hover:text-red-500"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* ── Expanded route editor ── */}
                            {isExpanded && (() => {
                              const draft = draftRoutes[page.id] ?? {
                                slug: page.slug, routeGroup: page.routeGroup ?? "",
                                routeType: routeType, redirectTo: page.redirectTo ?? "", is404: page.is404 ?? false,
                              };
                              const setDraft = (patch: Partial<typeof draft>) =>
                                setDraftRoutes(prev => ({ ...prev, [page.id]: { ...draft, ...patch } }));

                              return (
                              <div className="border-t border-gray-100 bg-gray-50/60 px-3 py-3 space-y-3">

                                {/* Slug */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Path / Slug</label>
                                  <div className="flex items-center gap-1">
                                    <span className="text-xs text-gray-400 font-mono shrink-0">/</span>
                                    <input
                                      value={draft.slug.replace(/^\//, "")}
                                      onChange={(e) => {
                                        const raw = e.target.value.replace(/\s+/g, "-").toLowerCase();
                                        setDraft({ slug: page.isHome ? "/" : `/${raw}` });
                                      }}
                                      disabled={page.isHome}
                                      placeholder="dashboard"
                                      className="flex-1 min-w-0 bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400 disabled:opacity-40 disabled:cursor-not-allowed"
                                    />
                                  </div>
                                  <p className="text-[10px] text-gray-400">Supports dynamic segments: <code className="bg-gray-100 px-1 rounded">[id]</code>, <code className="bg-gray-100 px-1 rounded">[slug]</code></p>
                                </div>

                                {/* Route group */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Route Group</label>
                                  <input
                                    value={draft.routeGroup}
                                    onChange={(e) => setDraft({ routeGroup: e.target.value })}
                                    placeholder="e.g. (auth), (app), (marketing)"
                                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                  />
                                  <p className="text-[10px] text-gray-400">Cosmetic grouping only — does not affect the URL.</p>
                                </div>

                                {/* Route type */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Access Control</label>
                                  <div className="grid grid-cols-3 gap-1">
                                    {(["public", "private", "auth-only"] as PageRouteType[]).map((type) => {
                                      const m = routeTypeMeta[type];
                                      const active = draft.routeType === type;
                                      return (
                                        <button
                                          key={type}
                                          onClick={() => setDraft({ routeType: type })}
                                          className={cn(
                                            "flex flex-col items-center gap-1 px-2 py-2 rounded-lg border text-[10px] font-bold transition-all",
                                            active ? cn(m.badgeCls, "shadow-sm") : "border-gray-200 text-gray-500 hover:border-gray-300 bg-white"
                                          )}
                                        >
                                          {m.icon}
                                          {m.label}
                                        </button>
                                      );
                                    })}
                                  </div>
                                  <div className="text-[10px] text-gray-400 leading-relaxed pt-0.5">
                                    {draft.routeType === "public"    && "Everyone can visit this page."}
                                    {draft.routeType === "private"   && "Requires sign-in. Guests are redirected to the sign-in page."}
                                    {draft.routeType === "auth-only" && "Guests only. Signed-in visitors are sent to the post-login page (e.g. sign-in, sign-up)."}
                                  </div>
                                </div>

                                {/* Redirect */}
                                <div className="space-y-1">
                                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                                    <CornerDownRight className="h-3 w-3" /> Redirect To
                                  </label>
                                  <select
                                    value={draft.redirectTo}
                                    onChange={(e) => setDraft({ redirectTo: e.target.value })}
                                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-400"
                                  >
                                    <option value="">— none (render page normally) —</option>
                                    {sitePages.filter(p => p.id !== page.id).map(p => (
                                      <option key={p.slug} value={p.slug}>{p.name} ({p.slug})</option>
                                    ))}
                                  </select>
                                  {draft.redirectTo && (
                                    <p className="text-[10px] text-violet-500 font-medium">
                                      This page instantly redirects visitors → <code>{draft.redirectTo}</code>
                                    </p>
                                  )}
                                </div>

                                {/* 404 toggle */}
                                <button
                                  onClick={() => setDraft({ is404: !draft.is404 })}
                                  className={cn(
                                    "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg border text-xs font-semibold transition-all",
                                    draft.is404
                                      ? "border-red-200 bg-red-50 text-red-600"
                                      : "border-gray-200 bg-white text-gray-500 hover:border-gray-300"
                                  )}
                                >
                                  <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                                  {draft.is404 ? "This is the 404 page ✓" : "Use as 404 / Not Found page"}
                                </button>

                                {/* ── Action buttons ── */}
                                <div className="flex items-center gap-2 pt-1">
                                  <button
                                    onClick={() => {
                                      updatePageFields(page.id, {
                                        slug: draft.slug,
                                        routeGroup: draft.routeGroup || undefined,
                                        routeType: draft.routeType,
                                        isProtected: draft.routeType === "private",
                                        redirectTo: draft.redirectTo || undefined,
                                        is404: draft.is404,
                                      });
                                      setExpandedRoutePageId(null);
                                    }}
                                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                                  >
                                    Apply Changes
                                  </button>
                                  {sitePages.length > 1 && (
                                    <button
                                      onClick={() => setDeletePageConfirm({ id: page.id, name: page.name })}
                                      className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition-colors"
                                    >
                                      <X className="h-3.5 w-3.5" />
                                      Delete Route
                                    </button>
                                  )}
                                </div>

                              </div>
                              );
                            })()}
                          </div>
                        );
                      })}

                      <button
                        onClick={addPage}
                        className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs text-indigo-600 bg-indigo-50/30 border border-dashed border-indigo-200 hover:bg-indigo-50 transition-all font-semibold"
                      >
                        <Plus className="h-3.5 w-3.5" />
                        Add Page
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>


          {/* ── Canvas ── */}
          <div className="flex-1 overflow-hidden flex flex-col">
            <PreviewContext.Provider value={isPreviewMode}>
              <Canvas />
            </PreviewContext.Provider>
          </div>

          {/* ── Right Panel ── */}
          {rightPanelOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-30 lg:hidden"
              onClick={() => setRightPanelOpen(false)}
              aria-hidden="true"
            />
          )}
          <div className={cn(
            "bg-white border-l border-gray-100 flex flex-col transition-all duration-200 shrink-0",
            "fixed lg:relative inset-y-0 right-0 z-40 lg:z-auto",
            rightPanelOpen ? "w-72 translate-x-0" : "w-0 translate-x-full lg:w-12 lg:translate-x-0"
          )}>
            <div className="flex items-center justify-between border-b border-gray-100 px-3 py-2.5 min-h-[44px]">
              {rightPanelOpen ? (
                <>
                  <span className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Properties</span>
                  <button onClick={() => setRightPanelOpen(false)} className="text-gray-300 hover:text-gray-500 transition-colors">
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </>
              ) : (
                <button onClick={() => setRightPanelOpen(true)} className="h-8 w-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors mx-auto" title="Open Properties">
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            {rightPanelOpen && (
              <div className="flex-1 overflow-hidden">
                <PropertiesPanel />
              </div>
            )}
          </div>
        </div>

        {/* Drag overlay */}
        <DragOverlay>
          {activeDraggable && (
            <div className="px-3 py-2 rounded-lg bg-white border border-indigo-200 shadow-xl text-xs font-medium text-indigo-700 flex items-center gap-2 pointer-events-none">
              <div className="h-5 w-5 rounded bg-indigo-100 flex items-center justify-center">
                <LayoutDashboard className="h-3 w-3 text-indigo-500" />
              </div>
              {activeDraggable.label}
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {/* ── Command Palette ── */}
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />

      {/* ── Find & Replace ── */}
      <FindReplace isOpen={findReplaceOpen} onClose={() => setFindReplaceOpen(false)} />

      {/* ── AI Copilot FAB ── */}
      <button
        onClick={() => setShowAIAssistant(!showAIAssistant)}
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-xl hover:shadow-2xl hover:shadow-indigo-500/40 transition-all flex items-center justify-center z-50 hover:scale-110"
        title="AI Copilot (press / for commands)"
      >
        <Sparkles className="h-5 w-5" />
      </button>

      {/* ── AI Copilot Panel ── */}
      {showAIAssistant && (
        <div className="fixed bottom-20 right-4 sm:right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 flex flex-col w-[calc(100vw-2rem)] sm:w-[340px] max-h-[60vh] sm:max-h-[520px]">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">AI Copilot</span>
              <span className="text-[10px] bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded-full font-medium">Beta</span>
            </div>
            <button onClick={() => setShowAIAssistant(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
            {aiMessages.length === 0 && (
              <div className="space-y-2">
                <p className="text-xs text-gray-500 mb-3">Try a command:</p>
                {["Add a testimonials section", "Make the hero dark", "Add a pricing table", "Fix mobile layout"].map((s) => (
                  <button key={s} onClick={() => setAiPrompt(s)} className="w-full text-left text-xs px-3 py-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors">
                    {s}
                  </button>
                ))}
              </div>
            )}
            {aiMessages.map((msg, i) => (
              <div key={i} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                <div className={cn("max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed", msg.role === "user" ? "bg-indigo-500 text-white rounded-br-none" : "bg-gray-100 text-gray-800 rounded-bl-none")}>
                  {msg.content}
                </div>
              </div>
            ))}
            {aiLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-xl rounded-bl-none px-3 py-2 flex items-center gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-1.5 w-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 shrink-0">
            <div className="flex gap-2">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (aiPrompt.trim() && !aiLoading) sendAiMessage(aiPrompt.trim());
                  }
                }}
                placeholder="Ask AI… (Enter to send)"
                rows={2}
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-xs text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
              />
              <button
                disabled={aiLoading || !aiPrompt.trim()}
                onClick={() => { if (aiPrompt.trim() && !aiLoading) sendAiMessage(aiPrompt.trim()); }}
                className="shrink-0 px-3 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deletePageConfirm}
        title={`Delete "${deletePageConfirm?.name}"?`}
        description="This page and all its content will be permanently removed. This cannot be undone."
        confirmLabel="Delete Page"
        onConfirm={() => {
          if (deletePageConfirm) {
            deletePage(deletePageConfirm.id);
            setExpandedRoutePageId(null);
          }
          setDeletePageConfirm(null);
        }}
        onCancel={() => setDeletePageConfirm(null)}
      />
    </div>
  );
}
