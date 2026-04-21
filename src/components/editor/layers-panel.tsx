"use client";

import React, { useState, useRef, useMemo } from "react";
import {
  Eye, EyeOff, Trash2, ChevronRight, Layout, Type, Image,
  MousePointer, Minus, LayoutTemplate, Lock, Unlock, Copy,
  GripVertical, Layers as LayersIcon, List, ArrowUp, ArrowDown,
  Layers,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import type { CanvasElement } from "@/lib/types";
import { cn } from "@/lib/utils";

// ─── Type → icon map ──────────────────────────────────────────────────────────

const TYPE_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  hero: Layout, features: Layout, cta: Layout, pricing: Layout,
  testimonials: Layout, testimonial: Layout, stats: Layout, faq: Layout,
  newsletter: Layout, accordion: Layout, tabs: Layout, progress: Layout,
  countdown: Layout, "social-links": Layout, "product-grid": Layout,
  "product-card": Layout, logos: Layout, team: Layout, form: Layout,
  heading: Type, paragraph: Type, "rich-text": Type, badge: Type,
  button: MousePointer, image: Image, video: Image, gallery: Image, icon: Image,
  divider: Minus, spacer: Minus,
  container: Layout, columns: Layout, grid: Layout,
  navbar: LayoutTemplate, footer: LayoutTemplate,
  card: Layout, map: Layout, breadcrumbs: Layout, pagination: Layout,
};

// ─── Layer item ────────────────────────────────────────────────────────────────

function LayerItem({
  element,
  depth = 0,
  onDragStart,
}: {
  element: CanvasElement;
  depth?: number;
  onDragStart?: (id: string) => void;
}) {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const selectElement = useEditorStore((s) => s.selectElement);
  const removeElement = useEditorStore((s) => s.removeElement);
  const duplicateElement = useEditorStore((s) => s.duplicateElement);
  const toggleElementLock = useEditorStore((s) => s.toggleElementLock);
  const toggleElementVisibility = useEditorStore((s) => s.toggleElementVisibility);
  const updateElementName = useEditorStore((s) => s.updateElementName);
  const moveElement = useEditorStore((s) => s.moveElement);

  const isSelected = selectedElementId === element.id;
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState(false);
  const [nameValue, setNameValue] = useState(element.name || element.type);
  const [dragPlacement, setDragPlacement] = useState<"before" | "after" | "inside" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasChildren = (element.children?.length ?? 0) > 0;

  const Icon = TYPE_ICONS[element.type] || Layout;
  const displayName = element.name || element.type;

  function commitName() {
    const trimmed = nameValue.trim();
    if (trimmed && trimmed !== element.type) {
      updateElementName(element.id, trimmed);
    } else {
      setNameValue(element.name || element.type);
    }
    setEditing(false);
  }

  return (
    <div>
      <div
        draggable={!element.isLocked}
        onDragStart={(e) => {
          if (element.isLocked) { e.preventDefault(); return; }
          e.stopPropagation();
          e.dataTransfer.setData("application/vnd.layer.id", element.id);
          e.dataTransfer.effectAllowed = "move";
        }}
        onDragOver={(e) => {
          if (element.isLocked) return;
          e.preventDefault();
          e.stopPropagation();
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const h = rect.height;
          
          let placement: "before" | "after" | "inside" = "inside";
          const canNest = ["container", "columns", "grid", "two-col", "three-col", "four-col", "sidebar-left", "sidebar-right", "hero", "features", "cta", "pricing", "testimonials", "accordion", "tabs", "card", "navbar", "footer"].includes(element.type);
          
          if (canNest) {
            if (y < h * 0.25) placement = "before";
            else if (y > h * 0.75) placement = "after";
            else placement = "inside";
          } else {
            if (y < h * 0.5) placement = "before";
            else placement = "after";
          }
          
          setDragPlacement(placement);
        }}
        onDragLeave={(e) => {
          e.stopPropagation();
          setDragPlacement(null);
        }}
        onDrop={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragPlacement(null);
          if (element.isLocked) return;
          const draggedId = e.dataTransfer.getData("application/vnd.layer.id");
          if (draggedId && draggedId !== element.id && dragPlacement && moveElement) {
            moveElement(draggedId, element.id, dragPlacement);
          }
        }}
        className={cn(
          "group flex items-center gap-1.5 pr-1 py-[5px] rounded-lg cursor-pointer select-none transition-colors relative",
          isSelected ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700",
          element.isHidden && "opacity-40",
          element.isLocked && "cursor-not-allowed",
          dragPlacement === "inside" && "ring-2 ring-indigo-400 bg-indigo-50/50"
        )}
        style={{ paddingLeft: `${6 + Math.min(depth, 5) * 10}px` }}
        onClick={() => !element.isLocked && selectElement(element.id)}
        onDoubleClick={() => {
          if (element.isLocked) return;
          setEditing(true);
          setTimeout(() => inputRef.current?.focus(), 30);
        }}
      >
        {dragPlacement === "before" && <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full -translate-y-0.5 z-10" />}
        {dragPlacement === "after" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500 rounded-full translate-y-0.5 z-10" />}

        {/* Expand arrow */}
        <button
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
          className={cn("h-4 w-4 flex items-center justify-center shrink-0 rounded transition-transform", !hasChildren && "opacity-0 pointer-events-none", expanded && "rotate-90")}
        >
          <ChevronRight className="h-2.5 w-2.5 text-gray-400" />
        </button>

        {/* Type icon */}
        <Icon className={cn("h-3.5 w-3.5 shrink-0", isSelected ? "text-indigo-500" : "text-gray-400")} />

        {/* Name — takes all remaining space, truncates cleanly */}
        {editing ? (
          <input
            ref={inputRef}
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            onBlur={commitName}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitName();
              if (e.key === "Escape") { setNameValue(element.name || element.type); setEditing(false); }
            }}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 min-w-0 text-[11px] bg-white border border-indigo-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-400"
          />
        ) : (
          <span
            className="flex-1 min-w-0 text-[11px] font-medium capitalize leading-none"
            style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
            title={displayName}
          >
            {displayName}
          </span>
        )}

        {/* Persistent state badges — always visible, minimal width */}
        <div className="flex items-center gap-0.5 shrink-0 ml-1">
          {element.isHidden && (
            <span title="Hidden" className="flex items-center justify-center w-4 h-4">
              <EyeOff className="h-2.5 w-2.5 text-gray-400" />
            </span>
          )}
          {element.isLocked && (
            <span title="Locked" className="flex items-center justify-center w-4 h-4">
              <Lock className="h-2.5 w-2.5 text-amber-400" />
            </span>
          )}
        </div>

        {/* Action buttons — only on hover/select, collapsed into icon-only row */}
        <div className={cn(
          "flex items-center shrink-0 transition-all duration-100 overflow-hidden",
          isSelected || element.isHidden || element.isLocked
            ? "w-auto gap-0.5 opacity-100"
            : "w-0 gap-0 opacity-0 group-hover:w-auto group-hover:gap-0.5 group-hover:opacity-100"
        )}>
          <button
            title={element.isHidden ? "Show" : "Hide"}
            onClick={(e) => { e.stopPropagation(); toggleElementVisibility(element.id); }}
            className={cn("h-5 w-5 rounded flex items-center justify-center transition-colors",
              element.isHidden ? "bg-gray-100 text-gray-600" : "hover:bg-gray-100")}
          >
            {element.isHidden
              ? <EyeOff className="h-3 w-3" />
              : <Eye className="h-3 w-3 text-gray-400" />}
          </button>
          <button
            title={element.isLocked ? "Unlock" : "Lock"}
            onClick={(e) => { e.stopPropagation(); toggleElementLock(element.id); }}
            className={cn("h-5 w-5 rounded flex items-center justify-center transition-colors",
              element.isLocked ? "bg-amber-50" : "hover:bg-gray-100")}
          >
            {element.isLocked
              ? <Lock className="h-3 w-3 text-amber-500" />
              : <Unlock className="h-3 w-3 text-gray-400" />}
          </button>
          <button
            title="Duplicate"
            onClick={(e) => { e.stopPropagation(); duplicateElement(element.id); }}
            className="h-5 w-5 rounded flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <Copy className="h-3 w-3 text-gray-400" />
          </button>
          <button
            title="Delete"
            onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
            className="h-5 w-5 rounded flex items-center justify-center hover:bg-red-50 transition-colors"
          >
            <Trash2 className="h-3 w-3 text-gray-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="border-l border-gray-100 ml-5">
          {element.children!.map((child) => (
            <LayerItem key={child.id} element={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page Outline ─────────────────────────────────────────────────────────────

interface HeadingEntry { id: string; level: number; text: string; elementId: string }

const LEVEL_LABELS: Record<string, number> = { h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6 };

function extractHeadings(elements: CanvasElement[]): HeadingEntry[] {
  const result: HeadingEntry[] = [];
  function walk(els: CanvasElement[]) {
    for (const el of els) {
      if (el.type === "heading") {
        const level = LEVEL_LABELS[(el.props?.level as string) || "h2"] ?? 2;
        result.push({ id: el.id, level, text: el.content || `Heading ${level}`, elementId: el.id });
      }
      // Also extract from section blocks that have headline props
      if (el.props?.headline && typeof el.props.headline === "string" && ["hero", "features", "cta", "testimonials", "pricing", "faq", "newsletter", "stats", "team", "logos"].includes(el.type)) {
        result.push({ id: `outline-${el.id}`, level: 2, text: el.props.headline as string, elementId: el.id });
      }
      if (el.children?.length) walk(el.children);
    }
  }
  walk(elements);
  return result;
}

function PageOutline({ elements }: { elements: CanvasElement[] }) {
  const selectElement = useEditorStore((s) => s.selectElement);
  const headings = useMemo(() => extractHeadings(elements), [elements]);

  if (headings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
        <List className="w-6 h-6 opacity-40" />
        <span className="text-[11px]">No headings found</span>
        <span className="text-[10px] text-gray-300">Add Heading elements to build the outline</span>
      </div>
    );
  }

  // Validate heading hierarchy
  const issues: Set<string> = new Set();
  for (let i = 1; i < headings.length; i++) {
    if (headings[i].level > headings[i - 1].level + 1) {
      issues.add(headings[i].id);
    }
  }
  const hasH1 = headings.some((h) => h.level === 1);
  const multiH1 = headings.filter((h) => h.level === 1).length > 1;

  return (
    <div className="px-3 py-3 space-y-0.5">
      {!hasH1 && (
        <div className="mb-3 p-2 bg-amber-50 border border-amber-100 rounded-lg text-[10px] text-amber-700">
          ⚠ No H1 heading found. Every page should have exactly one H1.
        </div>
      )}
      {multiH1 && (
        <div className="mb-3 p-2 bg-red-50 border border-red-100 rounded-lg text-[10px] text-red-700">
          ✕ Multiple H1 headings detected. Use only one H1 per page.
        </div>
      )}
      {headings.map((h) => (
        <button
          key={h.id}
          onClick={() => selectElement(h.elementId)}
          className={cn(
            "w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-gray-50 transition-colors",
            issues.has(h.id) && "border border-amber-200 bg-amber-50"
          )}
          style={{ paddingLeft: `${8 + (h.level - 1) * 12}px` }}
        >
          <span className={cn(
            "text-[9px] font-bold shrink-0 px-1 py-0.5 rounded",
            h.level === 1 ? "bg-indigo-100 text-indigo-700"
              : h.level === 2 ? "bg-purple-100 text-purple-700"
              : h.level === 3 ? "bg-blue-100 text-blue-700"
              : "bg-gray-100 text-gray-500"
          )}>H{h.level}</span>
          <span className="text-[11px] text-gray-700 truncate">{h.text}</span>
          {issues.has(h.id) && <span className="text-[9px] text-amber-600 ml-auto shrink-0">⚠ skip</span>}
        </button>
      ))}
      <div className="pt-3 border-t border-gray-100 mt-2">
        <p className="text-[9px] text-gray-400">
          {headings.length} heading{headings.length !== 1 ? "s" : ""} · click to select element
        </p>
      </div>
    </div>
  );
}

// ─── Z-Index Manager ──────────────────────────────────────────────────────────

function flattenForZIndex(elements: CanvasElement[]): { el: CanvasElement; depth: number }[] {
  const result: { el: CanvasElement; depth: number }[] = [];
  function walk(els: CanvasElement[], d: number) {
    for (const el of els) {
      result.push({ el, depth: d });
      if (el.children?.length) walk(el.children, d + 1);
    }
  }
  walk(elements, 0);
  return result;
}

function ZIndexManager({ elements }: { elements: CanvasElement[] }) {
  const selectElement = useEditorStore((s) => s.selectElement);
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const updateElementStyles = useEditorStore((s) => s.updateElementStyles);

  // Only show elements that have an explicit z-index OR are selected
  const allFlat = useMemo(() => flattenForZIndex(elements), [elements]);

  const withZ = useMemo(() =>
    allFlat
      .map(({ el }) => ({
        id: el.id,
        name: el.name || el.type,
        zIndex: parseInt((el.styles?.zIndex as string) || "0") || 0,
        isHidden: el.isHidden,
        isLocked: el.isLocked,
      }))
      .sort((a, b) => b.zIndex - a.zIndex),
    [allFlat]
  );

  function setZ(id: string, val: number) {
    updateElementStyles(id, { zIndex: String(val) });
  }

  if (withZ.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
        <Layers className="w-6 h-6 opacity-40" />
        <span className="text-[11px]">No elements on canvas</span>
      </div>
    );
  }

  return (
    <div className="px-3 py-3 space-y-1">
      <p className="text-[9px] text-gray-400 uppercase tracking-wider mb-2 px-1">
        Higher z-index = in front · click to select
      </p>
      {withZ.map((item, idx) => (
        <div
          key={item.id}
          onClick={() => selectElement(item.id)}
          className={cn(
            "flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-colors group",
            selectedElementId === item.id ? "bg-indigo-50 text-indigo-700" : "hover:bg-gray-50 text-gray-700"
          )}
        >
          {/* Visual depth indicator */}
          <div
            className={cn(
              "w-2 h-2 rounded-sm shrink-0",
              idx === 0 ? "bg-indigo-500" : idx === 1 ? "bg-purple-400" : idx === 2 ? "bg-blue-400" : "bg-gray-300"
            )}
          />
          <span className="flex-1 min-w-0 text-[11px] font-medium capitalize truncate">{item.name}</span>
          {item.isHidden && <Eye className="h-3 w-3 text-gray-300 shrink-0" />}
          {item.isLocked && <Lock className="h-3 w-3 text-amber-400 shrink-0" />}

          {/* Z-index stepper */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              title="Raise z-index"
              onClick={(e) => { e.stopPropagation(); setZ(item.id, item.zIndex + 1); }}
              className="h-5 w-5 rounded flex items-center justify-center hover:bg-indigo-100 text-indigo-600 transition-colors"
            >
              <ArrowUp className="h-3 w-3" />
            </button>
            <button
              title="Lower z-index"
              onClick={(e) => { e.stopPropagation(); setZ(item.id, item.zIndex - 1); }}
              className="h-5 w-5 rounded flex items-center justify-center hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowDown className="h-3 w-3" />
            </button>
          </div>

          {/* Z-index badge */}
          <span className={cn(
            "text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0",
            item.zIndex > 0 ? "bg-indigo-100 text-indigo-700"
              : item.zIndex < 0 ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-500"
          )}>
            {item.zIndex}
          </span>
        </div>
      ))}

      <div className="pt-3 border-t border-gray-100 mt-2">
        <p className="text-[9px] text-gray-400">
          {withZ.length} element{withZ.length !== 1 ? "s" : ""} · use Ctrl+[ / Ctrl+] to adjust
        </p>
      </div>
    </div>
  );
}

// ─── Main panel ───────────────────────────────────────────────────────────────

export default function LayersPanel() {
  const elements = useEditorStore((s) => s.elements);
  const moveElement = useEditorStore((s) => s.moveElement);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"layers" | "outline" | "zindex">("layers");
  const sortedElements = [...elements].sort((a, b) => a.order - b.order);

  const filtered = search
    ? sortedElements.filter((el) =>
        (el.name || el.type).toLowerCase().includes(search.toLowerCase()) ||
        el.type.toLowerCase().includes(search.toLowerCase())
      )
    : sortedElements;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          {/* View toggle */}
          <div className="flex items-center gap-0.5 p-0.5 bg-gray-100 rounded-lg">
            <button
              onClick={() => setView("layers")}
              className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors", view === "layers" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              <LayersIcon className="h-3 w-3" /> Layers
            </button>
            <button
              onClick={() => setView("outline")}
              className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors", view === "outline" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700")}
            >
              <List className="h-3 w-3" /> Outline
            </button>
            <button
              onClick={() => setView("zindex")}
              className={cn("flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-medium transition-colors", view === "zindex" ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700")}
              title="Z-index manager"
            >
              <Layers className="h-3 w-3" /> Z
            </button>
          </div>
          <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
            {elements.length}
          </span>
        </div>
        {view === "layers" && (
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter layers…"
              className="w-full h-6 pl-2 pr-2 text-[11px] rounded border border-gray-200 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-indigo-400 placeholder-gray-400"
            />
          </div>
        )}
      </div>

      {view === "outline" ? (
        <div className="flex-1 overflow-y-auto">
          <PageOutline elements={sortedElements} />
        </div>
      ) : view === "zindex" ? (
        <div className="flex-1 overflow-y-auto">
          <ZIndexManager elements={sortedElements} />
        </div>
      ) : (
        <>
          {/* Legend */}
          <div className="flex items-center gap-3 px-3 py-1.5 border-b border-gray-100 bg-gray-50/50">
            <span className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Eye className="h-2.5 w-2.5" /> Visibility
            </span>
            <span className="text-[9px] text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <Lock className="h-2.5 w-2.5" /> Lock
            </span>
            <span className="text-[9px] text-gray-400 uppercase tracking-wider ml-auto">
              Dbl-click to rename
            </span>
          </div>

          {/* Layer list */}
          <div 
            className="flex-1 overflow-y-auto p-2 space-y-0.5"
            onDragOver={(e) => {
              e.preventDefault();
            }}
            onDrop={(e) => {
              e.preventDefault();
              const draggedId = e.dataTransfer.getData("application/vnd.layer.id");
              if (draggedId && moveElement) {
                moveElement(draggedId, null, "after");
              }
            }}
          >
            {filtered.length === 0 ? (
              <div className="text-center py-10">
                {elements.length === 0 ? (
                  <>
                    <LayersIcon className="h-8 w-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No elements yet</p>
                    <p className="text-[11px] text-gray-300 mt-0.5">Add elements from the panel</p>
                  </>
                ) : (
                  <p className="text-xs text-gray-400">No layers match &ldquo;{search}&rdquo;</p>
                )}
              </div>
            ) : (
              filtered.map((element) => (
                <LayerItem key={element.id} element={element} />
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}
