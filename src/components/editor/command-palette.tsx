"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Search, Plus, Eye, EyeOff, Undo2, Redo2, Save, Globe, Trash2,
  LayoutTemplate, Type, Image, MousePointer, Layout, Grid,
  Monitor, Tablet, Smartphone, ZoomIn, ZoomOut, Grid3X3,
  ChevronRight, Command, Sparkles, Settings, ArrowRight,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import type { EditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import type { ElementType } from "@/lib/types";

// ─── Command definitions ──────────────────────────────────────────────────────

interface PaletteCommand {
  id: string;
  label: string;
  description?: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "elements" | "actions" | "view" | "navigate" | "ai";
  shortcut?: string;
  action: () => void;
}

function buildCommands(store: EditorStore, onClose: () => void): PaletteCommand[] {
  const {
    undo, redo, undoStack, redoStack, setPreviewMode, isPreviewMode,
    setDeviceMode, addElement, clearCanvas, zoomIn, zoomOut, setZoom,
    toggleGrid, showGrid,
  } = store;

  const addEl = (type: ElementType, label: string) => ({
    id: `add-${type}`,
    label: `Add ${label}`,
    icon: Plus,
    category: "elements" as const,
    action: () => { addElement(type); onClose(); },
  });

  return [
    // ── Elements ──
    addEl("hero", "Hero Section"),
    addEl("features", "Features Section"),
    addEl("cta", "CTA Section"),
    addEl("pricing", "Pricing Table"),
    addEl("testimonials", "Testimonials"),
    addEl("stats", "Stats / Numbers"),
    addEl("faq", "FAQ Section"),
    addEl("newsletter", "Newsletter"),
    addEl("navbar", "Navigation Bar"),
    addEl("footer", "Footer"),
    addEl("heading", "Heading"),
    addEl("paragraph", "Paragraph"),
    addEl("button", "Button"),
    addEl("image", "Image"),
    addEl("video", "Video"),
    addEl("card", "Card"),
    addEl("team", "Team Section"),
    addEl("logos", "Logo Cloud"),
    addEl("form", "Form Wrapper"),
    addEl("accordion", "Accordion"),
    addEl("tabs", "Tabs"),
    addEl("progress", "Progress Bars"),
    addEl("countdown", "Countdown Timer"),
    addEl("social-links", "Social Links"),
    addEl("product-grid", "Product Grid"),
    addEl("map", "Map"),
    addEl("divider", "Divider"),
    addEl("spacer", "Spacer"),
    addEl("container", "Container"),
    addEl("columns", "Columns"),

    // ── Actions ──
    {
      id: "undo",
      label: "Undo",
      description: undoStack.length > 0 ? `${undoStack.length} step${undoStack.length > 1 ? "s" : ""} available` : "Nothing to undo",
      icon: Undo2,
      category: "actions",
      shortcut: "⌘Z",
      action: () => { undo(); onClose(); },
    },
    {
      id: "redo",
      label: "Redo",
      description: redoStack.length > 0 ? `${redoStack.length} step${redoStack.length > 1 ? "s" : ""} available` : "Nothing to redo",
      icon: Redo2,
      category: "actions",
      shortcut: "⌘⇧Z",
      action: () => { redo(); onClose(); },
    },
    {
      id: "toggle-preview",
      label: isPreviewMode ? "Exit Preview Mode" : "Enter Preview Mode",
      description: "See your site as visitors will",
      icon: isPreviewMode ? EyeOff : Eye,
      category: "actions",
      shortcut: "⌘P",
      action: () => { setPreviewMode(!isPreviewMode); onClose(); },
    },
    {
      id: "clear-canvas",
      label: "Clear Canvas",
      description: "Remove all elements from the page",
      icon: Trash2,
      category: "actions",
      action: () => { clearCanvas(); onClose(); },
    },
    {
      id: "toggle-grid",
      label: showGrid ? "Hide Grid Overlay" : "Show Grid Overlay",
      description: "Toggle alignment grid",
      icon: Grid3X3,
      category: "view",
      action: () => { toggleGrid(); onClose(); },
    },

    // ── View ──
    {
      id: "device-desktop",
      label: "Switch to Desktop View",
      icon: Monitor,
      category: "view",
      action: () => { setDeviceMode("desktop"); onClose(); },
    },
    {
      id: "device-large-tablet",
      label: "Switch to Large Tablet View (1024px)",
      icon: Tablet,
      category: "view",
      action: () => { setDeviceMode("large-tablet"); onClose(); },
    },
    {
      id: "device-tablet",
      label: "Switch to Tablet View (768px)",
      icon: Tablet,
      category: "view",
      action: () => { setDeviceMode("tablet"); onClose(); },
    },
    {
      id: "device-mobile",
      label: "Switch to Mobile View (390px)",
      icon: Smartphone,
      category: "view",
      action: () => { setDeviceMode("mobile"); onClose(); },
    },
    {
      id: "device-small-mobile",
      label: "Switch to Small Mobile View (320px)",
      icon: Smartphone,
      category: "view",
      action: () => { setDeviceMode("small-mobile"); onClose(); },
    },
    {
      id: "zoom-in",
      label: "Zoom In",
      icon: ZoomIn,
      category: "view",
      shortcut: "+",
      action: () => { zoomIn(); onClose(); },
    },
    {
      id: "zoom-out",
      label: "Zoom Out",
      icon: ZoomOut,
      category: "view",
      shortcut: "-",
      action: () => { zoomOut(); onClose(); },
    },
    {
      id: "zoom-fit",
      label: "Zoom to 100%",
      icon: ZoomIn,
      category: "view",
      shortcut: "⌘0",
      action: () => { setZoom(100); onClose(); },
    },

    // ── Navigate ──
    {
      id: "nav-dashboard",
      label: "Go to Dashboard",
      icon: Layout,
      category: "navigate",
      action: () => { window.location.href = "/dashboard"; },
    },
    {
      id: "nav-templates",
      label: "Browse Templates",
      icon: LayoutTemplate,
      category: "navigate",
      action: () => { window.location.href = "/dashboard/templates"; },
    },
    {
      id: "nav-settings",
      label: "Site Settings",
      icon: Settings,
      category: "navigate",
      action: () => { onClose(); },
    },
    {
      id: "nav-assets",
      label: "Media Library",
      icon: Image,
      category: "navigate",
      action: () => { window.location.href = "/dashboard/assets"; },
    },
  ];
}

const CATEGORY_LABELS: Record<PaletteCommand["category"], string> = {
  elements: "Add Element",
  actions: "Actions",
  view: "View",
  navigate: "Navigate",
  ai: "AI",
};

const CATEGORY_ICONS: Record<PaletteCommand["category"], React.ComponentType<{ className?: string }>> = {
  elements: Plus,
  actions: Command,
  view: Grid,
  navigate: ArrowRight,
  ai: Sparkles,
};

// ─── Component ─────────────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: Props) {
  const store = useEditorStore();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const commands = buildCommands(store, onClose);

  const filtered = query.trim()
    ? commands.filter((c) =>
        c.label.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands.filter((c) => c.category === "actions" || c.category === "view");

  // Group by category
  const grouped = filtered.reduce<Record<string, PaletteCommand[]>>((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  const flat = Object.values(grouped).flat();

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const scrollIntoView = useCallback((index: number) => {
    const item = listRef.current?.querySelector(`[data-index="${index}"]`);
    item?.scrollIntoView({ block: "nearest" });
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { onClose(); return; }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => {
          const next = Math.min(i + 1, flat.length - 1);
          scrollIntoView(next);
          return next;
        });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => {
          const prev = Math.max(i - 1, 0);
          scrollIntoView(prev);
          return prev;
        });
      }
      if (e.key === "Enter" && flat[selectedIndex]) {
        flat[selectedIndex].action();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, flat, selectedIndex, onClose, scrollIntoView]);

  if (!isOpen) return null;

  let flatIndex = 0;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands, add elements, navigate…"
            className="flex-1 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none"
          />
          <kbd className="text-[10px] text-gray-400 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono">ESC</kbd>
        </div>

        {/* Results */}
        <div ref={listRef} className="max-h-[400px] overflow-y-auto p-2">
          {flat.length === 0 ? (
            <div className="text-center py-10 text-sm text-gray-400">
              No commands match &ldquo;{query}&rdquo;
            </div>
          ) : (
            Object.entries(grouped).map(([category, items]) => {
              const CatIcon = CATEGORY_ICONS[category as PaletteCommand["category"]];
              return (
                <div key={category} className="mb-2">
                  <div className="flex items-center gap-1.5 px-2 py-1 mb-0.5">
                    <CatIcon className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                      {CATEGORY_LABELS[category as PaletteCommand["category"]]}
                    </span>
                  </div>
                  {items.map((cmd) => {
                    const index = flatIndex++;
                    const isSelected = selectedIndex === index;
                    return (
                      <button
                        key={cmd.id}
                        data-index={index}
                        onClick={cmd.action}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors",
                          isSelected ? "bg-indigo-50 text-indigo-900" : "text-gray-700 hover:bg-gray-50"
                        )}
                      >
                        <div className={cn(
                          "h-7 w-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                          isSelected ? "bg-indigo-100" : "bg-gray-100"
                        )}>
                          <cmd.icon className={cn("h-3.5 w-3.5", isSelected ? "text-indigo-600" : "text-gray-500")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{cmd.label}</p>
                          {cmd.description && (
                            <p className="text-xs text-gray-400 truncate">{cmd.description}</p>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <kbd className="text-[10px] text-gray-400 bg-gray-100 border border-gray-200 rounded px-1.5 py-0.5 font-mono shrink-0">
                            {cmd.shortcut}
                          </kbd>
                        )}
                        {isSelected && <ChevronRight className="h-3.5 w-3.5 text-indigo-400 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer hint */}
        <div className="flex items-center gap-4 px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <kbd className="bg-gray-200 rounded px-1 py-0.5 font-mono">↑↓</kbd> navigate
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <kbd className="bg-gray-200 rounded px-1 py-0.5 font-mono">↵</kbd> select
          </span>
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <kbd className="bg-gray-200 rounded px-1 py-0.5 font-mono">ESC</kbd> close
          </span>
          <span className="ml-auto text-[10px] text-gray-400">{flat.length} commands</span>
        </div>
      </div>
    </div>
  );
}
