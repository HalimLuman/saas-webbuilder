"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2, GripVertical, Settings2, MousePointer, Plus, ChevronDown, X, Map, Menu, EyeOff, Lock, Check } from "lucide-react";
import { useEditorStore, findInTree } from "@/store/editor-store";
import type { CanvasElement, ElementType, NavLink, NavActionType } from "@/lib/types";
import { cn, generateId } from "@/lib/utils";
import { useIsPreview } from "@/lib/preview-context";
import { sanitizeHtmlSync } from "@/lib/sanitize";
import { useToast, type ToastType } from "@/components/ui/toast";
import { ElementRuntimeProvider, useElementRuntime } from "@/lib/element-runtime-context";
import { CartRenderer } from "./renderers/cart-renderer";
import { AddToCartRenderer } from "./renderers/add-to-cart-renderer";
import { ProductCardRenderer } from "./renderers/product-card-renderer";
import { ModalRenderer, DrawerRenderer } from "./renderers/modal-renderer";
import { AuthFormRenderer } from "./renderers/auth-form-renderer";
import { CmsListRenderer } from "./renderers/cms-list-renderer";
import { SiteAuthProvider, useSiteAuth } from "@/lib/site-auth-context";
import { useSiteStore } from "@/store/site-store";

// ─── Nested Zone ──────────────────────────────────────────────────────────────

function SelectableNestedItem({
  child,
  parentId,
  isSelected,
  selectElement,
  removeChildElement
}: {
  child: CanvasElement;
  parentId: string;
  isSelected: boolean;
  selectElement: (id: string | null) => void;
  removeChildElement: (parentId: string, childId: string) => void;
}) {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  // Suppress hover ring when a descendant is selected
  const isDescendantSelected = React.useMemo(() => {
    if (!selectedElementId || isSelected) return false;
    return !!findInTree(child.children ?? [], selectedElementId);
  }, [selectedElementId, isSelected, child.children]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: child.id });
  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const isPreview = useIsPreview();
  if (isPreview && child.isHidden) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group rounded-xl transition-all cursor-pointer",
        isSelected && "bg-white shadow-md",
        child.isHidden && "opacity-40",
        isDragging && "z-50 shadow-xl"
      )}
      onClick={(e) => {
        if (child.isLocked) { e.stopPropagation(); return; }
        e.stopPropagation();
        selectElement(child.id);
      }}
    >
      {/* Selection / hover overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none rounded-xl z-10 transition-all duration-150",
          isSelected
            ? "ring-2 ring-indigo-500 ring-inset"
            : isDescendantSelected
              ? "ring-1 ring-gray-100 ring-inset"
              : "ring-1 ring-gray-100 ring-inset group-hover:ring-indigo-300"
        )}
      />

      {/* Hidden badge */}
      {child.isHidden && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-800/70 text-white leading-none">
            <EyeOff className="w-2.5 h-2.5" /> hidden
          </span>
        </div>
      )}

      {/* Lock shield + badge */}
      {child.isLocked && (
        <>
          <div className="absolute inset-0 z-20 cursor-not-allowed" onClick={(e) => e.stopPropagation()} />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-600/80 text-white leading-none">
              <Lock className="w-2.5 h-2.5" /> locked
            </span>
          </div>
        </>
      )}

      {/* Minimal controls — hidden for locked elements */}
      {!child.isLocked && (
        <div className={cn(
          "absolute top-1 right-1 z-20 flex items-center gap-0.5 transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <div
            {...attributes}
            {...listeners}
            className="h-4 w-4 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3 w-3" />
          </div>
          <button
            className="h-4 w-4 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
            onClick={(e) => { e.stopPropagation(); removeChildElement(parentId, child.id); }}
          >
            <X className="h-2.5 w-2.5 text-red-400" />
          </button>
        </div>
      )}

      <CanvasElementRenderer element={child} isNested={true} />
    </div>
  );
}

function NestedZone({ parentId, children, label }: { parentId: string; children: CanvasElement[]; label?: string }) {
  const { selectedElementId, selectElement, removeChildElement } = useEditorStore();
  const { setNodeRef, isOver } = useDroppable({
    id: `nested-zone-${parentId}`,
  });
  const isPreview = useIsPreview();

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[80px] transition-all rounded-xl",
        isOver ? "bg-indigo-50/50 ring-2 ring-indigo-400 ring-inset" : "bg-transparent"
      )}
    >
      <div className="space-y-1">
        <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {children.map((child) => (
            <SelectableNestedItem
              key={child.id}
              child={child}
              parentId={parentId}
              isSelected={selectedElementId === child.id}
              selectElement={selectElement}
              removeChildElement={removeChildElement}
            />
          ))}
        </SortableContext>

        {!isPreview && children.length === 0 && (
          <div className="py-2 text-center border border-dashed border-gray-100 rounded-lg">
            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
              {label || "Drop elements here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sortable Content Item (for SectionContentZone DnD) ──────────────────────

function SortableContentItem({ child, parentId, dark, direction }: {
  child: CanvasElement;
  parentId: string;
  dark?: boolean;
  direction: "column" | "row" | "row-wrap";
}) {
  const { selectedElementId, selectElement, removeChildElement } = useEditorStore();
  const isSelected = selectedElementId === child.id;
  // Suppress our hover ring when any descendant is selected (prevents double-ring)
  const isDescendantSelected = React.useMemo(() => {
    if (!selectedElementId || isSelected) return false;
    return !!findInTree(child.children ?? [], selectedElementId);
  }, [selectedElementId, isSelected, child.children]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: child.id });
  const style: React.CSSProperties = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 };

  const isPreview = useIsPreview();
  if (isPreview && child.isHidden) return null;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group/item rounded-xl transition-all cursor-pointer",
        direction === "column" ? "w-full" : direction === "row-wrap" ? "" : "shrink-0",
        child.isHidden && "opacity-40",
        isDragging && "z-50 shadow-xl"
      )}
      onClick={(e) => {
        if (child.isLocked) { e.stopPropagation(); return; }
        e.stopPropagation();
        selectElement(child.id);
      }}
    >
      {/* Selection / hover overlay — pointer-events-none so it never blocks child clicks */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none rounded-xl z-10 transition-all duration-150",
          isSelected
            ? dark ? "ring-2 ring-white/70 ring-inset" : "ring-2 ring-indigo-400 ring-inset"
            : isDescendantSelected
              ? ""
              : dark
                ? "opacity-0 group-hover/item:opacity-100 ring-1 ring-white/30 ring-inset"
                : "opacity-0 group-hover/item:opacity-100 ring-1 ring-indigo-200 ring-inset"
        )}
      />

      {/* Hidden badge */}
      {child.isHidden && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-800/70 text-white leading-none">
            <EyeOff className="w-2.5 h-2.5" /> hidden
          </span>
        </div>
      )}

      {/* Lock shield + badge */}
      {child.isLocked && (
        <>
          <div className="absolute inset-0 z-20 cursor-not-allowed" onClick={(e) => e.stopPropagation()} />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-600/80 text-white leading-none">
              <Lock className="w-2.5 h-2.5" /> locked
            </span>
          </div>
        </>
      )}

      {/* Minimal controls — hidden for locked elements */}
      {!child.isLocked && (
      <div className={cn(
        "absolute top-1 right-1 z-20 flex items-center gap-0.5 transition-opacity",
        isSelected ? "opacity-100" : "opacity-0 group-hover/item:opacity-100"
      )}>
        <div
          {...attributes}
          {...listeners}
          className="h-4 w-4 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-40 hover:opacity-80"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-3 w-3" />
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); removeChildElement(parentId, child.id); }}
          className="h-4 w-4 flex items-center justify-center opacity-40 hover:opacity-80 transition-opacity"
        >
          <X className="h-2.5 w-2.5 text-red-400" />
        </button>
      </div>
      )}

      <CanvasElementRenderer element={child} isNested={true} />
    </div>
  );
}

// ─── Composable Section Blocks ────────────────────────────────────────────────

const BLOCK_TYPES: Array<{ type: ElementType; label: string; subLabel: string; defaultContent: string; defaultProps?: Record<string, unknown> }> = [
  { type: "heading", label: "H1", subLabel: "Heading", defaultContent: "Your Heading", defaultProps: { level: 1 } },
  { type: "heading", label: "H2", subLabel: "Sub-head", defaultContent: "Sub-heading", defaultProps: { level: 2 } },
  { type: "paragraph", label: "¶", subLabel: "Paragraph", defaultContent: "Your paragraph text." },
  { type: "button", label: "BTN", subLabel: "Button", defaultContent: "Click Me" },
  { type: "badge", label: "◈", subLabel: "Badge", defaultContent: "New" },
  { type: "image", label: "IMG", subLabel: "Image", defaultContent: "" },
  { type: "divider", label: "—", subLabel: "Divider", defaultContent: "" },
  { type: "spacer", label: "↕", subLabel: "Spacer", defaultContent: "" },
  { type: "container", label: "⬜", subLabel: "Row/Box", defaultContent: "", defaultProps: { _childLayout: "row" } },
];

function InlineElementRenderer({ element }: { element: CanvasElement }) {
  const isPreview = useIsPreview();
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const s = (element.styles || {}) as React.CSSProperties;
  const p = (element.props || {}) as Record<string, unknown>;
  const rawLevel = p.level;
  const level = typeof rawLevel === "string"
    ? (parseInt((rawLevel as string).replace(/\D/g, ""), 10) || 1)
    : ((rawLevel as number) || 1);
  const accentColor = (p.accentColor as string) || "#6366f1";
  const variant = (p.variant as string) || "solid";

  switch (element.type) {
    case "heading": {
      const Tag = (`h${Math.min(level, 6)}`) as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = {
        1: "text-5xl md:text-6xl font-extrabold tracking-[-0.04em] leading-[1.05]",
        2: "text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1]",
        3: "text-3xl font-bold tracking-[-0.02em] leading-[1.15]",
        4: "text-2xl font-semibold tracking-[-0.01em]",
        5: "text-xl font-semibold tracking-tight",
        6: "text-lg font-semibold"
      };
      return <Tag style={s} className={cn(sizes[level] || "text-base font-semibold", "text-gray-950 text-balance")}>{element.content || "Heading"}</Tag>;
    }
    case "paragraph":
      return <p style={s} className="text-base md:text-lg text-gray-500 leading-[1.75] font-normal text-pretty">{element.content || "Paragraph text."}</p>;
    case "button": {
      const btnHref = (p.href as string) || "";
      const btnTarget = (p.openInNewTab as boolean) ? "_blank" : (p.target as string) || "_self";
      const btnSolid: React.CSSProperties = { backgroundColor: accentColor, color: "#fff", boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 4px 12px ${accentColor}40`, ...s };
      const btnOutline: React.CSSProperties = { border: `1.5px solid ${accentColor}`, color: accentColor, background: "transparent", ...s };
      const btnStyle = variant === "solid" ? btnSolid : btnOutline;
      const btnCls = cn(
        "inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold",
        "transition-all duration-200 hover:-translate-y-px active:translate-y-0 active:scale-[0.98] cursor-pointer",
        variant === "solid" ? "hover:brightness-110 hover:shadow-lg" : "hover:bg-current/5"
      );
      if (isPreview && btnHref) {
        return <a href={btnHref} target={btnTarget} rel="noopener noreferrer" style={btnStyle} className={btnCls}>{element.content || "Click Me"}</a>;
      }
      return <button style={btnStyle} className={btnCls}>{element.content || "Click Me"}</button>;
    }
    case "badge":
      return (
        <span style={{ backgroundColor: `${accentColor}12`, color: accentColor, border: `1px solid ${accentColor}25`, ...s }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold tracking-[0.06em] uppercase">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: accentColor }} />
          {element.content || "Badge"}
        </span>
      );
    case "image": {
      return (p.src as string) ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={p.src as string} alt={(p.alt as string) || ""} style={s} className="rounded-lg max-h-48 object-cover w-full" />
      ) : isPreview ? null : (
        <div className="w-full h-24 rounded-lg bg-white/10 border-2 border-dashed border-white/20 flex items-center justify-center">
          <span className="text-2xl opacity-50">🖼️</span>
        </div>
      );
    }
    case "divider":
      return <hr style={s} className="border-current opacity-20 w-full" />;
    case "spacer":
      return <div style={{ height: (p.height as number) || 24, ...s }} />;
    case "container": {
      const childLayout = (p._childLayout as string) || "row";
      const cAlign = (p._childAlign as string) || "start";
      const cJustify = (p._childJustify as string) || "start";
      const cGap = (p._childGap as string) || "md";
      const cGapCls = cGap === "xs" ? "gap-1" : cGap === "sm" ? "gap-2" : cGap === "lg" ? "gap-6" : cGap === "xl" ? "gap-8" : "gap-4";
      const cAlignCls = cAlign === "center" ? "items-center" : cAlign === "end" ? "items-end" : "items-start";
      const cJustifyCls = cJustify === "center" ? "justify-center" : cJustify === "end" ? "justify-end" : cJustify === "between" ? "justify-between" : cJustify === "around" ? "justify-around" : cJustify === "evenly" ? "justify-evenly" : "justify-start";
      const dirCls = childLayout === "row" ? cn("flex flex-wrap", cGapCls, cAlignCls, cJustifyCls) : cn("flex flex-col", cGapCls, cAlignCls);
      // On tablet/mobile, remove minWidth so flex children can wrap and stack
      const inlineResponsiveOverride: React.CSSProperties = (deviceMode !== "desktop" && s.minWidth)
        ? { minWidth: "0", ...(s.flex !== undefined ? { flex: "1 1 100%", width: "100%" } : { width: "100%" }) }
        : {};
      return (
        <div style={{ ...s, ...inlineResponsiveOverride }} className={cn(s.width ? undefined : "w-full", "rounded-lg", dirCls)}>
          <SectionContentZone parentId={element.id} children={element.children || []} parentProps={element.props} />
        </div>
      );
    }
    default:
      return <CanvasElementRenderer element={element} isNested={true} />;
  }
}

function SectionContentZone({
  parentId,
  children,
  direction: directionProp,
  dark = false,
  align,
  className,
  parentProps: parentPropsDirect,
  parentStyles,
}: {
  parentId: string;
  children: CanvasElement[];
  direction?: string;
  dark?: boolean;
  align?: string;
  className?: string;
  parentProps?: Record<string, unknown>;
  parentStyles?: React.CSSProperties;
}) {
  const { elements, updateElementProps, addChildElement, deviceMode, updateElementResponsiveStyles } = useEditorStore();
  const isPreview = useIsPreview();
  const [showPicker, setShowPicker] = useState(false);

  const { setNodeRef: setDropRef, isOver } = useDroppable({
    id: `nested-zone-${parentId}`,
  });

  // In preview mode the editor store is empty, so we fall back to props passed directly from the parent element
  const liveParent = findInTree(elements, parentId);
  const resolvedProps = (liveParent?.props ?? parentPropsDirect ?? {}) as Record<string, unknown>;

  // Viewport-specific overrides stored in _responsive (same bag as style overrides)
  const responsive = (resolvedProps._responsive as Record<string, any>) || {};
  const bpKey = deviceMode !== "desktop" ? deviceMode : null;
  const bpProps = bpKey ? (responsive[bpKey] || {}) : {};

  // Fall through: viewport override → base prop → prop passed down → default
  const direction = (bpProps._childLayout as string) || (resolvedProps._childLayout as string) || directionProp || "column";
  const childAlignProp = (bpProps._childAlign as string) || (resolvedProps._childAlign as string) || "start";
  const childJustifyProp = (bpProps._childJustify as string) || (resolvedProps._childJustify as string) || "start";
  const childGapProp = (bpProps._childGap as string) || (resolvedProps._childGap as string) || "md";

  const gapCls = childGapProp === "xs" ? "gap-1" : childGapProp === "sm" ? "gap-2" : childGapProp === "lg" ? "gap-6" : childGapProp === "xl" ? "gap-8" : "gap-4";
  const alignItemsCls = childAlignProp === "center" ? "items-center" : childAlignProp === "end" ? "items-end" : childAlignProp === "stretch" ? "items-stretch" : "items-start";
  const justifyCls = childJustifyProp === "center" ? "justify-center" : childJustifyProp === "end" ? "justify-end" : childJustifyProp === "between" ? "justify-between" : childJustifyProp === "around" ? "justify-around" : childJustifyProp === "evenly" ? "justify-evenly" : "justify-start";

  // Write to viewport-specific override when in tablet/mobile; base otherwise
  const setDir = (dir: string) => {
    if (bpKey) {
      updateElementResponsiveStyles(parentId, bpKey, { _childLayout: dir } as any);
    } else {
      updateElementProps(parentId, { _childLayout: dir });
    }
  };

  const toolbarBtnCls = "px-2 py-0.5 rounded text-[10px] font-medium transition border";

  const activeDir = (d: string) =>
    d === direction
      ? dark
        ? "bg-white/20 border-white/30 text-white"
        : "bg-indigo-500 border-indigo-500 text-white"
      : dark
        ? "bg-white/5 border-white/10 text-white/50 hover:bg-white/10"
        : "bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100";

  const isMobileView = deviceMode === "mobile" || deviceMode === "small-mobile";
  const isTabletView = deviceMode === "tablet" || deviceMode === "large-tablet";

  // Auto-stack rows:  mobile/small-mobile → column (fully stacked)
  //                   tablet/large-tablet  → row-wrap (wraps when narrow)
  //                   desktop              → row (unchanged)
  const resolvedDirection: "column" | "row" | "row-wrap" =
    direction === "row"
      ? isMobileView
        ? "column"
        : isTabletView
          ? "row-wrap"
          : "row"
      : direction === "wrap" || direction === "row-wrap"
        ? "row-wrap"
        : "column";

  const containerCls = resolvedDirection === "column"
    ? cn("flex flex-col", gapCls, alignItemsCls, justifyCls)
    : resolvedDirection === "row-wrap"
      ? cn("flex flex-wrap", gapCls, alignItemsCls, align === "center" ? "justify-center" : justifyCls)
      : cn("flex flex-row", gapCls, alignItemsCls, align === "center" ? "justify-center" : justifyCls);

  // CSS overrides from parentStyles (set via LayoutTab) applied inline so they take
  // precedence over the Tailwind classes above.
  const innerFlexStyle: React.CSSProperties | undefined =
    (parentStyles?.alignItems || parentStyles?.justifyContent || parentStyles?.flexDirection || parentStyles?.gap)
      ? {
          alignItems: parentStyles?.alignItems || undefined,
          justifyContent: parentStyles?.justifyContent || undefined,
          flexDirection: parentStyles?.flexDirection || undefined,
          gap: parentStyles?.gap || undefined,
        }
      : undefined;

  return (
    <div
      ref={setDropRef}
      data-zone
      className={cn(
        "relative group/zone transition-all",
        isPreview ? "" : "min-h-[80px] rounded-xl",
        isOver ? "ring-2 ring-indigo-400 ring-offset-2 bg-indigo-50/20" : "",
        className
      )}
    >
      {/* Children */}
      {isPreview ? (
        <div className={containerCls} style={innerFlexStyle}>
          {children.map((child) => (
            <CanvasElementRenderer key={child.id} element={child} isNested={true} />
          ))}
        </div>
      ) : (
        <SortableContext items={children.map(c => c.id)} strategy={verticalListSortingStrategy}>
          <div className={containerCls} style={innerFlexStyle}>
            {children.map((child) => (
              <SortableContentItem
                key={child.id}
                child={child}
                parentId={parentId}
                dark={dark}
                direction={resolvedDirection}
              />
            ))}
          </div>
        </SortableContext>
      )}

      {!isPreview && children.length === 0 && (
        <div className={cn(
          "py-2 text-center border border-dashed rounded-lg",
          dark ? "border-white/20 text-white/40" : "border-gray-100 text-gray-400"
        )}>
          <p className="text-[10px] font-medium uppercase tracking-wider">Drop elements here</p>
        </div>
      )}

      {/* Add block button (editor only) — absolutely positioned so it doesn't affect layout */}
      {!isPreview && (
        <div data-zone-btn className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-0 pointer-events-none transition-opacity">
          <button
            onClick={() => setShowPicker(!showPicker)}
            className={cn(
              "flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium transition whitespace-nowrap",
              dark
                ? "bg-white/10 text-white/50 hover:text-white hover:bg-white/20"
                : "bg-black/5 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50"
            )}
          >
            <Plus className="h-2.5 w-2.5" />
            Add block
          </button>

          {showPicker && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowPicker(false)} />
              <div className={cn(
                "absolute bottom-full mb-1 left-1/2 -translate-x-1/2 z-50 rounded-xl shadow-xl border p-2.5 w-56",
                dark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
              )}>
                <div className="grid grid-cols-3 gap-1">
                  {BLOCK_TYPES.map((bt, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        addChildElement(parentId, {
                          type: bt.type,
                          content: bt.defaultContent,
                          styles: {},
                          props: bt.defaultProps || {},
                        });
                        setShowPicker(false);
                      }}
                      className={cn(
                        "flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-center transition",
                        dark
                          ? "hover:bg-white/10 text-white/70 hover:text-white"
                          : "hover:bg-gray-50 text-gray-500 hover:text-gray-700"
                      )}
                    >
                      <span className="text-sm leading-none">{bt.label}</span>
                      <span className="text-[9px] leading-none opacity-50">{bt.subLabel}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Renderers ────────────────────────────────────────────────────────────────

// Keys stored in _responsive that are layout props, not CSS styles — strip them before applying as inline styles
const LAYOUT_PROP_KEYS = new Set(["_childLayout", "_childAlign", "_childJustify", "_childGap"]);

function pickStyleOverrides(overrides: Record<string, any>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const k in overrides) {
    if (!LAYOUT_PROP_KEYS.has(k)) out[k] = overrides[k];
  }
  return out;
}

// ─── Interactive Form Helper Components ──────────────────────────────────────

function InteractiveCheckbox({ element, accent, s, isNested }: { element: CanvasElement; accent: string; s: React.CSSProperties; isNested: boolean }) {
  const [checked, setChecked] = useState(!!element.props?.defaultChecked);
  return (
    <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
      <label className="flex items-center gap-2.5 cursor-pointer group w-fit" onClick={() => setChecked(!checked)}>
        <div className="h-4 w-4 rounded border-2 flex items-center justify-center transition-colors"
          style={{ borderColor: checked ? accent : "#d1d5db", backgroundColor: checked ? accent : "white" }}>
          {checked && <span className="text-white text-[9px] font-bold">✓</span>}
        </div>
        <span className="text-sm text-gray-700 select-none">{element.content || (element.props?.label as string) || "Checkbox label"}</span>
      </label>
    </div>
  );
}

function InteractiveRadioGroup({ element, options, accent, s, isNested }: { element: CanvasElement; options: string[]; accent: string; s: React.CSSProperties; isNested: boolean }) {
  const [selected, setSelected] = useState(0);
  return (
    <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
      <div className="space-y-2">
        {(element.props?.label as string) && <p className="text-xs font-medium text-gray-700 mb-2">{element.props?.label as string}</p>}
        {options.map((opt, i) => (
          <label key={i} className="flex items-center gap-2.5 cursor-pointer" onClick={() => setSelected(i)}>
            <div className={cn("h-4 w-4 rounded-full border-2 flex items-center justify-center transition-colors")}
              style={{ borderColor: i === selected ? accent : "#d1d5db" }}>
              {i === selected && <div className="h-2 w-2 rounded-full" style={{ backgroundColor: accent }} />}
            </div>
            <span className="text-sm text-gray-700">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function InteractiveToggle({ element, accent, s, isNested }: { element: CanvasElement; accent: string; s: React.CSSProperties; isNested: boolean }) {
  const [on, setOn] = useState(element.props?.defaultChecked !== false);
  return (
    <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
      <label className="flex items-center gap-3 cursor-pointer w-fit" onClick={() => setOn(!on)}>
        <div className="relative h-6 w-11 rounded-full transition-colors duration-200" style={{ backgroundColor: on ? accent : "#d1d5db" }}>
          <div className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200", on ? "translate-x-5" : "translate-x-0.5")} />
        </div>
        <span className="text-sm text-gray-700">{element.content || (element.props?.label as string) || "Enable feature"}</span>
      </label>
    </div>
  );
}

function InteractiveSlider({ element, accent, min, max, defaultValue, s, isNested }: { element: CanvasElement; accent: string; min: number; max: number; defaultValue: number; s: React.CSSProperties; isNested: boolean }) {
  const [value, setValue] = useState(defaultValue);
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
      <div className="space-y-2">
        {(element.props?.label as string) && (
          <div className="flex items-center justify-between">
            <label className="text-xs font-medium text-gray-700">{element.props?.label as string}</label>
            <span className="text-xs font-semibold text-gray-600">{value}</span>
          </div>
        )}
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ background: `linear-gradient(to right, ${accent} 0%, ${accent} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)` }}
        />
        <div className="flex justify-between">
          <span className="text-[10px] text-gray-400">{min}</span>
          <span className="text-[10px] text-gray-400">{max}</span>
        </div>
      </div>
    </div>
  );
}

function InteractiveOTP({ length, accent, s, isNested, element }: { length: number; accent: string; s: React.CSSProperties; isNested: boolean; element: CanvasElement }) {
  const [values, setValues] = useState<string[]>(Array(length).fill(""));
  const refs = React.useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(i: number, val: string) {
    const next = [...values];
    next[i] = val.slice(-1);
    setValues(next);
    if (val && i < length - 1) refs.current[i + 1]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !values[i] && i > 0) refs.current[i - 1]?.focus();
  }

  return (
    <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
      <div className="flex items-center gap-2 justify-center">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            ref={(el) => { refs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={values[i]}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            className="h-12 w-10 rounded-lg border-2 text-center text-sm font-bold text-gray-700 outline-none transition-colors"
            style={{ borderColor: values[i] ? accent : "#e5e7eb", color: values[i] ? accent : undefined }}
          />
        ))}
      </div>
      {(element.props?.helperText as string) && <p className="text-xs text-center text-gray-400 mt-2">{element.props?.helperText as string}</p>}
    </div>
  );
}

function TextLinkElement({ element, isNested, isPreview, s }: { element: CanvasElement; isNested: boolean; isPreview: boolean; s: React.CSSProperties }) {
  const [hovered, setHovered] = React.useState(false);
  const tlHref = (element.props?.href as string) || "#";
  const tlTarget = (element.props?.openInNewTab as boolean) ? "_blank" : (element.props?.target as string) || "_self";
  const tlHoverColor = (element.props?.hoverColor as string) || "";
  const tlStyle: React.CSSProperties = {
    color: (hovered && tlHoverColor) ? tlHoverColor : (s.color || "#6366f1"),
    fontFamily: s.fontFamily, fontSize: s.fontSize || "0.875rem",
    fontWeight: s.fontWeight || "500", fontStyle: s.fontStyle,
    textDecoration: s.textDecoration ?? "none",
    textDecorationColor: s.textDecorationColor, textDecorationStyle: s.textDecorationStyle,
    textDecorationThickness: s.textDecorationThickness, textUnderlineOffset: s.textUnderlineOffset || "2px",
    textTransform: s.textTransform, letterSpacing: s.letterSpacing,
    lineHeight: s.lineHeight, padding: s.padding, margin: s.margin,
    transition: "color 0.15s", cursor: "pointer", display: "inline",
  };
  const content = element.content || (element.props?.label as string) || "Learn more →";
  if (isPreview) {
    return (
      <Link href={tlHref} target={tlHref !== "#" ? tlTarget : undefined}
        rel={tlTarget === "_blank" ? "noopener noreferrer" : undefined}
        style={tlStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
        {content}
      </Link>
    );
  }
  return (
    <a href={undefined} onClick={(e) => e.preventDefault()}
      style={tlStyle} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {content}
    </a>
  );
}

function NavbarElement({ element, isPreview, s }: { element: CanvasElement; isPreview: boolean; s: React.CSSProperties }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [userMenuOpen, setUserMenuOpen] = React.useState(false);
  const { addToast } = useToast();
  const deviceMode = useEditorStore((s) => s.deviceMode);
  // Auth state for the site visitor (preview / published mode only)
  const { user: siteUser, signOut: siteSignOut, authConfig: siteAuthConfig } = useSiteAuth();

  const navBgType = (element.props?.bgType as string) || "white";
  const navAccent = (element.props?.accentColor as string) || "#111827";
  const navBtnStyle = (element.props?.buttonStyle as string) || "solid";
  const rawNavLinks = (element.props?.navLinks as Array<string | NavLink>) || [];
  const allNavLinks: NavLink[] = rawNavLinks.map((l) => typeof l === "string" ? { label: l, href: "#" } : l);
  const navLinks: NavLink[] = isPreview
    ? allNavLinks.filter((l) => {
        if (!l.showWhen || l.showWhen === "always") return true;
        if (l.showWhen === "authenticated") return !!siteUser;
        if (l.showWhen === "unauthenticated") return !siteUser;
        return true;
      })
    : allNavLinks;
  const navDark = navBgType === "dark";
  const navBgCls = navBgType === "dark" 
    ? "bg-gray-950 border-gray-800 shadow-[0_1px_0_rgba(255,255,255,0.05)]" 
    : navBgType === "transparent" 
    ? "bg-transparent border-transparent" 
    : "bg-white/70 backdrop-blur-xl border-gray-100/80 shadow-[0_1px_2px_rgba(0,0,0,0.03)]";
  const navLinkCls = navDark 
    ? "text-gray-400 hover:text-white" 
    : "text-gray-500 hover:text-gray-950 hover:bg-gray-50/80 px-3 py-1.5 rounded-lg transition-all duration-200";
  const forceHamburger = !!(element.props?.hamburgerMenu);

  // In preview mode (real browser) track actual window width so the hamburger
  // responds to real resizes. In editor mode use the deviceMode from the store.
  // Breakpoint: ≤1024 px (large-tablet) → hamburger; >1024 px → full nav.
  const [windowWidth, setWindowWidth] = React.useState(1280);
  React.useEffect(() => {
    // Set actual width after mount to avoid SSR/client mismatch
    setWindowWidth(window.innerWidth);
    if (!isPreview) return;
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, [isPreview]);

  const isMobileCanvas = deviceMode === "mobile" || deviceMode === "small-mobile";
  const isTabletCanvas = deviceMode === "tablet" || deviceMode === "large-tablet";
  const isCompact = isPreview ? windowWidth <= 1024 : (isMobileCanvas || isTabletCanvas);
  const showHamburger = forceHamburger || isCompact;

  const brandName = element.props?.brandName as string;
  const ctaText = element.props?.ctaText as string;
  const signInText = element.props?.signInText as string;

  const hasChildren = element.children && element.children.length > 0;
  const isSmart = !!(brandName || navLinks.length > 0 || ctaText || signInText);

  const handleAction = (link: NavLink) => {
    if (!isPreview) return;
    if (link.actionType === "activity") {
      addToast(`Triggered activity: ${link.actionValue || link.label}`, "info");
    } else if (link.actionType === "scroll") {
      const target = document.querySelector(link.actionValue || "");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      } else {
        addToast(`Target ${link.actionValue} not found`, "warning");
      }
    }
  };

  const navButtons = (
    <div className="flex flex-col items-stretch gap-3">
      {signInText && (() => {
        const signInSlug = (element.props?.signInHref as string) || siteAuthConfig?.signInPageSlug;
        return isPreview && signInSlug ? (
          <a href={signInSlug} className={cn("px-4 py-2 text-[14px] font-semibold text-center transition-all", navLinkCls)}>
            {signInText}
          </a>
        ) : (
          <button className={cn("px-4 py-2 text-[14px] font-semibold text-center transition-all", navLinkCls)}>
            {signInText}
          </button>
        );
      })()}
      {ctaText && (
        isPreview && (element.props?.ctaHref as string) ? (
          <a
            href={element.props?.ctaHref as string}
            className={cn("px-5 py-2.5 rounded-xl text-[14px] font-bold text-center transition-all shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]", navBtnStyle === "outline" ? (navDark ? "border border-white/20 text-white hover:bg-white/10" : "border border-gray-200 text-gray-950 hover:bg-gray-50") : "text-white hover:brightness-110 hover:shadow-lg")}
            style={navBtnStyle !== "outline" ? { backgroundColor: navAccent, boxShadow: `0 8px 24px -6px ${navAccent}60` } : {}}
          >
            {ctaText}
          </a>
        ) : (
          <button
            className={cn("px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]", navBtnStyle === "outline" ? (navDark ? "border border-white/20 text-white hover:bg-white/10" : "border border-gray-200 text-gray-950 hover:bg-gray-50") : "text-white hover:brightness-110 hover:shadow-lg")}
            style={navBtnStyle !== "outline" ? { backgroundColor: navAccent, boxShadow: `0 8px 24px -6px ${navAccent}60` } : {}}>
            {ctaText}
          </button>
        )
      )}
    </div>
  );

  const navButtonsInline = (
    <div className="flex items-center gap-3">
      {/* If a visitor is signed in, show their avatar + dropdown instead of sign-in btn */}
      {isPreview && siteUser ? (
        <div className="relative">
          <button
            onClick={(e) => { e.stopPropagation(); setUserMenuOpen(o => !o); }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all hover:bg-gray-50"
            style={{ border: `1px solid ${navDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)"}` }}
          >
            {siteUser.avatarUrl ? (
              <img src={siteUser.avatarUrl} alt={siteUser.name || siteUser.email} className="h-7 w-7 rounded-full object-cover ring-2 ring-white/10" />
            ) : (
              <div
                className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm"
                style={{ backgroundColor: navAccent }}
              >
                {(siteUser.name || siteUser.email).charAt(0).toUpperCase()}
              </div>
            )}
            <span className={cn("text-[13px] font-semibold max-w-[100px] truncate tracking-tight", navDark ? "text-white" : "text-gray-900")}>
              {siteUser.name || siteUser.email.split("@")[0]}
            </span>
            <ChevronDown className={cn("h-3.5 w-3.5 opacity-40", navDark ? "text-white" : "text-gray-600")} />
          </button>
          {userMenuOpen && (
            <div
              className={cn("absolute right-0 top-[calc(100%+8px)] w-48 rounded-2xl border shadow-xl py-1.5 z-[200]", navDark ? "bg-gray-950 border-gray-800" : "bg-white border-gray-100/80")}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn("px-4 py-2.5 border-b text-[11px] font-bold uppercase tracking-wider", navDark ? "text-gray-500 border-gray-800" : "text-gray-400 border-gray-100")}>
                Account
              </div>
              <div className={cn("px-4 py-2 text-[12px] truncate", navDark ? "text-gray-300" : "text-gray-600")}>
                {siteUser.email}
              </div>
              <div className="h-px bg-gray-100 my-1 mx-2" />
              <button
                onClick={() => { siteSignOut(); setUserMenuOpen(false); }}
                className={cn("w-[calc(100%-16px)] mx-2 text-left px-3 py-2 text-[13px] font-semibold rounded-lg transition-colors mt-1", navDark ? "text-red-400 hover:bg-red-950/40" : "text-red-600 hover:bg-red-50")}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      ) : (
        <>
          {signInText && (() => {
            const signInSlug = (element.props?.signInHref as string) || siteAuthConfig?.signInPageSlug;
            return isPreview && signInSlug ? (
              <a href={signInSlug} className={cn("px-4 py-2 text-[14px] font-semibold transition-all", navLinkCls)}>
                {signInText}
              </a>
            ) : (
              <button className={cn("px-4 py-2 text-[14px] font-semibold transition-all", navLinkCls)}>
                {signInText}
              </button>
            );
          })()}
          {ctaText && (
            isPreview && (element.props?.ctaHref as string) ? (
              <a
                href={element.props?.ctaHref as string}
                className={cn("px-5 py-2.5 rounded-xl text-[14px] font-bold text-center transition-all shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]", navBtnStyle === "outline" ? (navDark ? "border border-white/20 text-white hover:bg-white/10" : "border border-gray-200 text-gray-950 hover:bg-gray-50") : "text-white hover:brightness-110 hover:shadow-lg")}
                style={navBtnStyle !== "outline" ? { backgroundColor: navAccent, boxShadow: `0 8px 24px -6px ${navAccent}60` } : {}}
              >
                {ctaText}
              </a>
            ) : (
              <button
                className={cn("px-5 py-2.5 rounded-xl text-[14px] font-bold transition-all shadow-[0_2px_10px_-2px_rgba(0,0,0,0.1)]", navBtnStyle === "outline" ? (navDark ? "border border-white/20 text-white" : "border border-gray-200 text-gray-950") : "text-white hover:brightness-110 hover:shadow-lg")}
                style={navBtnStyle !== "outline" ? { backgroundColor: navAccent, boxShadow: `0 8px 24px -6px ${navAccent}60` } : {}}>
                {ctaText}
              </button>
            )
          )}
        </>
      )}
    </div>
  );

  return (
    <div style={s} className={cn("w-full px-8 py-4 border-b relative z-50", navBgCls)}>
      {hasChildren || !isSmart ? (
        <div className="max-w-7xl mx-auto">
          <SectionContentZone
            parentId={element.id}
            children={element.children || []}
            parentProps={element.props}
          />
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between max-w-5xl mx-auto">
            {/* Brand */}
            <div className="flex items-center gap-2">
              {(element.props?.logoSrc as string) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={element.props?.logoSrc as string}
                  alt={brandName || "Logo"}
                  className="h-8 w-auto shrink-0 object-contain"
                />
              ) : (
                <div className="h-8 w-8 rounded-xl shrink-0" style={{ background: `linear-gradient(135deg, ${navAccent}, ${navAccent}aa)` }} />
              )}
              {brandName && (
                <span className={cn("font-bold text-lg tracking-tight", navDark ? "text-white" : "text-gray-900")}>
                  {brandName}
                </span>
              )}
            </div>

            {/* Desktop nav links — hidden when canvas is compact */}
            {!showHamburger && navLinks.length > 0 && (
              <div className="flex items-center gap-8 text-[13px] font-semibold">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={isPreview && (link.actionType === "url" || !link.actionType) ? (link.href || "#") : undefined}
                    onClick={(e) => {
                      if (!isPreview) { e.preventDefault(); return; }
                      if (link.actionType && link.actionType !== "url") { e.preventDefault(); handleAction(link); }
                    }}
                    className={cn("cursor-pointer transition-colors duration-200", navLinkCls)}
                  >{link.label}</a>
                ))}
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Desktop CTA buttons — hidden when compact */}
              {!showHamburger && (signInText || ctaText) && navButtonsInline}

              {/* Hamburger — shown when compact or forced */}
              {showHamburger && (
                <button
                  className={cn("p-2 rounded-xl border shadow-sm transition-colors flex items-center justify-center", navDark ? "border-gray-700 bg-gray-800 hover:bg-gray-700" : "border-gray-200 bg-white hover:bg-gray-50")}
                  onClick={(e) => { e.stopPropagation(); setIsMenuOpen(!isMenuOpen); }}
                >
                  {isMenuOpen
                    ? <X className={cn("h-5 w-5", navDark ? "text-gray-300" : "text-gray-600")} />
                    : <Menu className={cn("h-5 w-5", navDark ? "text-gray-300" : "text-gray-600")} />}
                </button>
              )}
            </div>
          </div>

          {/* Mobile dropdown */}
          {isMenuOpen && showHamburger && (
            <div className={cn("absolute top-[100%] left-0 w-full p-6 border-b shadow-2xl z-[100]", navBgCls)}>
              <div className="flex flex-col gap-4">
                {navLinks.map((link, i) => (
                  <a
                    key={i}
                    href={isPreview && (link.actionType === "url" || !link.actionType) ? (link.href || "#") : undefined}
                    onClick={(e) => {
                      if (!isPreview) { e.preventDefault(); return; }
                      if (link.actionType && link.actionType !== "url") { e.preventDefault(); handleAction(link); }
                      setIsMenuOpen(false);
                    }}
                    className={cn("text-base font-bold transition py-1 border-b last:border-0", navDark ? "border-gray-800" : "border-gray-100", navLinkCls)}
                  >{link.label}</a>
                ))}
                {(signInText || ctaText) && (
                  <div className="pt-2">
                    {navButtons}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function SidebarElement({ element, isPreview, s }: { element: CanvasElement; isPreview: boolean; s: React.CSSProperties }) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<number | null>(null);

  const direction = (element.props?.direction as string) || "left";
  const bgType = (element.props?.bgType as string) || "white";
  const withOverlay = element.props?.overlay !== false;
  const sidebarW = (element.props?.sidebarWidth as string) || "300px";
  const sidebarH = (element.props?.sidebarHeight as string) || "260px";
  const triggerLabel = (element.props?.triggerLabel as string) || "Open Menu";
  const accentColor = (element.props?.accentColor as string) || "#6366f1";
  const brandName = (element.props?.brandName as string) || "Brand";
  const navLinks = (element.props?.navLinks as Array<{ label: string; href: string }>) || [
    { label: "Home", href: "#" },
    { label: "About", href: "#" },
    { label: "Services", href: "#" },
    { label: "Portfolio", href: "#" },
    { label: "Contact", href: "#" },
  ];

  const isDark = bgType === "dark";
  const sidebarBg = isDark ? "#0F172A" : "#FFFFFF";
  const sidebarText = isDark ? "#F1F5F9" : "#111827";
  const sidebarMuted = isDark ? "#64748B" : "#9CA3AF";
  const sidebarBorder = isDark ? "rgba(255,255,255,0.08)" : "#F0F2F5";
  const hoverBg = isDark ? "rgba(255,255,255,0.06)" : "#F8F9FF";
  const isHorizontal = direction === "left" || direction === "right";

  // Derive a lighter accent for badges/pills
  const accentLight = accentColor + "18";

  const getSlideTransform = (open: boolean): string => {
    if (open) return "translate(0,0)";
    if (direction === "left") return "translateX(-105%)";
    if (direction === "right") return "translateX(105%)";
    if (direction === "top") return "translateY(-105%)";
    return "translateY(105%)";
  };

  const shadowMap: Record<string, string> = {
    left: "8px 0 48px rgba(0,0,0,0.18)",
    right: "-8px 0 48px rgba(0,0,0,0.18)",
    top: "0 8px 48px rgba(0,0,0,0.18)",
    bottom: "0 -8px 48px rgba(0,0,0,0.18)",
  };

  // Brand initial letter for the avatar
  const brandInitial = brandName.charAt(0).toUpperCase();

  const panelContent = (extraStyle: React.CSSProperties) => (
    <div style={{
      backgroundColor: sidebarBg,
      boxShadow: shadowMap[direction],
      display: "flex",
      flexDirection: isHorizontal ? "column" : "row",
      overflow: "hidden",
      ...extraStyle,
    }}>
      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: isHorizontal ? "20px 20px 16px" : "16px 20px",
        borderBottom: isHorizontal ? `1px solid ${sidebarBorder}` : "none",
        borderRight: !isHorizontal ? `1px solid ${sidebarBorder}` : "none",
        flexShrink: 0,
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {(element.props?.logoSrc as string) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={element.props?.logoSrc as string}
              alt={brandName || "Logo"}
              style={{ height: "34px", width: "auto", objectFit: "contain", flexShrink: 0 }}
            />
          ) : (
            <div style={{
              width: "34px", height: "34px", borderRadius: "10px",
              backgroundColor: accentColor, color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "15px", fontWeight: "700", flexShrink: 0,
            }}>{brandInitial}</div>
          )}
          <span style={{ fontSize: "16px", fontWeight: "700", color: sidebarText, letterSpacing: "-0.01em" }}>{brandName}</span>
        </div>
        {/* Close button */}
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6",
            border: "none", cursor: "pointer", color: sidebarMuted,
            width: "30px", height: "30px", borderRadius: "8px",
            fontSize: "14px", display: "flex", alignItems: "center", justifyContent: "center",
            transition: "background 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.12)" : "#E5E7EB"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = isDark ? "rgba(255,255,255,0.06)" : "#F3F4F6"; }}
        >✕</button>
      </div>

      {/* Nav links */}
      <nav style={{
        display: "flex",
        flexDirection: isHorizontal ? "column" : "row",
        gap: "2px",
        padding: isHorizontal ? "12px 12px" : "12px",
        flex: 1,
        overflowY: isHorizontal ? "auto" : "hidden",
        overflowX: !isHorizontal ? "auto" : "hidden",
        alignItems: !isHorizontal ? "center" : "stretch",
      }}>
        {navLinks.map((link, i) => (
          <a
            key={i}
            href={isPreview ? link.href : undefined}
            onClick={(e) => { if (!isPreview) { e.preventDefault(); } else { setIsOpen(false); } }}
            style={{
              color: hoveredLink === i ? accentColor : sidebarText,
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: "500",
              padding: isHorizontal ? "10px 14px" : "8px 16px",
              borderRadius: "8px",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              whiteSpace: "nowrap",
              backgroundColor: hoveredLink === i ? hoverBg : "transparent",
              borderLeft: isHorizontal ? `3px solid ${hoveredLink === i ? accentColor : "transparent"}` : "none",
            }}
            onMouseEnter={() => setHoveredLink(i)}
            onMouseLeave={() => setHoveredLink(null)}
          >
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              backgroundColor: hoveredLink === i ? accentColor : sidebarMuted,
              flexShrink: 0, transition: "background 0.15s",
              display: isHorizontal ? "block" : "none",
            }} />
            {link.label}
          </a>
        ))}
      </nav>

      {/* Footer CTA — only shown in horizontal (tall) layout */}
      {isHorizontal && (
        <div style={{ padding: "16px 20px", borderTop: `1px solid ${sidebarBorder}`, flexShrink: 0 }}>
          <button
            style={{
              width: "100%", padding: "11px 16px",
              backgroundColor: accentColor, color: "#fff",
              border: "none", borderRadius: "10px",
              fontSize: "14px", fontWeight: "600", cursor: "pointer",
              letterSpacing: "0.01em",
              boxShadow: `0 4px 14px ${accentColor}40`,
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = "0.88"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = "1"; }}
          >Get Started →</button>
          <p style={{ fontSize: "12px", color: sidebarMuted, textAlign: "center", margin: "10px 0 0", lineHeight: 1.4 }}>
            No credit card required
          </p>
        </div>
      )}
    </div>
  );

  // Hamburger icon SVG
  const hamburgerIcon = (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0 }}>
      <rect y="2" width="16" height="2" rx="1" fill="currentColor" />
      <rect y="7" width="11" height="2" rx="1" fill="currentColor" />
      <rect y="12" width="16" height="2" rx="1" fill="currentColor" />
    </svg>
  );

  const triggerBtn = (
    <button
      onClick={() => setIsOpen(true)}
      style={{
        backgroundColor: accentColor, color: "#fff",
        padding: "10px 18px", borderRadius: "10px", border: "none",
        fontSize: "14px", fontWeight: "600", cursor: "pointer",
        display: "inline-flex", alignItems: "center", gap: "8px",
        boxShadow: `0 4px 16px ${accentColor}40`,
        letterSpacing: "0.01em",
        transition: "transform 0.15s, box-shadow 0.15s",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${accentColor}55`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 16px ${accentColor}40`;
      }}
    >
      {hamburgerIcon}
      {triggerLabel}
    </button>
  );

  // Direction label badge for editor context
  const directionBadge = !isPreview && (
    <div style={{
      fontSize: "11px", fontWeight: "500", color: accentColor,
      backgroundColor: accentLight, padding: "3px 8px", borderRadius: "20px",
      display: "inline-flex", alignItems: "center", gap: "4px",
    }}>
      <span style={{ fontSize: "10px" }}>▶</span>
      slides {direction}
    </div>
  );

  // Editor view: show trigger + open panel side-by-side for content visibility
  if (!isPreview) {
    return (
      <div style={{ ...s, display: "flex", flexDirection: isHorizontal ? "row" : "column", gap: "16px", alignItems: "flex-start" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-start" }}>
          {triggerBtn}
          {directionBadge}
        </div>
        {panelContent({
          width: isHorizontal ? sidebarW : "100%",
          minHeight: isHorizontal ? "340px" : undefined,
          height: isHorizontal ? undefined : sidebarH,
          border: `1px solid ${sidebarBorder}`,
          borderRadius: "14px",
          overflow: "hidden",
        })}
      </div>
    );
  }

  // Preview: fixed overlay drawer with smooth animation
  return (
    <div style={s}>
      {triggerBtn}
      {/* Backdrop overlay */}
      <div
        onClick={() => setIsOpen(false)}
        style={{
          position: "fixed", inset: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
          zIndex: 199,
          opacity: withOverlay && isOpen ? 1 : 0,
          pointerEvents: withOverlay && isOpen ? "auto" : "none",
          transition: "opacity 0.3s ease",
        }}
      />
      {/* Drawer panel */}
      {panelContent({
        position: "fixed",
        zIndex: 200,
        ...(isHorizontal
          ? { top: 0, bottom: 0, width: sidebarW, [direction]: 0 }
          : { left: 0, right: 0, height: sidebarH, [direction]: 0 }),
        transform: getSlideTransform(isOpen),
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
      })}
    </div>
  );
}

// ── DataTableElement — live collection viewer ────────────────────────────────
function DataTableElement({ element, isPreview, s }: { element: CanvasElement; isPreview: boolean; s: React.CSSProperties }) {
  const dtAccent       = (element.props?.accentColor    as string)   || "#6366f1";
  const collectionSlug = (element.props?.collectionSlug as string)   || "";
  const dtSiteId       = (element.props?.siteId         as string)   || "";
  const dtLimit        = (element.props?.limit          as number)   || 20;
  const dtStatus       = (element.props?.status         as string)   || "published";
  const dtTitle        = (element.props?.title          as string)   || "";

  type DtItem = { id: string; data: Record<string, unknown>; status: string; created_at: string };
  const [items,   setItems]   = React.useState<DtItem[]>([]);
  const [columns, setColumns] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [page,    setPage]    = React.useState(1);
  const [hasMore, setHasMore] = React.useState(false);

  React.useEffect(() => {
    if (!isPreview || !collectionSlug || !dtSiteId) return;
    setLoading(true);
    fetch(`/api/v1/sites/${dtSiteId}/db/${collectionSlug}?status=${dtStatus}&limit=${dtLimit}&page=${page}`)
      .then((r) => r.json())
      .then((json) => {
        const fetched: DtItem[] = json.items ?? [];
        setItems(fetched);
        setHasMore(json.hasMore ?? false);
        // Derive columns from collection fields or first item keys
        const fields = json.collection?.fields as Array<{ name: string }> | undefined;
        if (fields?.length) {
          setColumns(fields.map((f) => f.name));
        } else if (fetched.length > 0) {
          setColumns(Object.keys(fetched[0].data));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isPreview, collectionSlug, dtSiteId, dtLimit, dtStatus, page]);

  // Editor placeholder
  if (!isPreview) {
    const placeholderCols = collectionSlug
      ? [`${collectionSlug} fields…`]
      : ["Column 1", "Column 2", "Column 3", "Status"];
    return (
      <div style={s} className="w-full py-6 px-4">
        {dtTitle && <p className="text-sm font-bold text-gray-800 mb-3">{dtTitle}</p>}
        <div className="rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/30 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-indigo-100 bg-indigo-50/50">
            <span className="text-[11px] font-semibold text-indigo-600">
              {collectionSlug ? `Collection: ${collectionSlug}` : "⚠ No collection linked"}
            </span>
            <span className="text-[9px] text-indigo-400 font-medium">Live data in preview</span>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ backgroundColor: `${dtAccent}08` }}>
                {placeholderCols.map((col, i) => (
                  <th key={i} className="px-4 py-3 text-left text-[10px] font-bold text-gray-400 uppercase tracking-wider">{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3].map((r) => (
                <tr key={r} className="border-t border-gray-50">
                  {placeholderCols.map((_, j) => (
                    <td key={j} className="px-4 py-3">
                      <div className="h-3 bg-gray-100 rounded-full w-3/4 animate-pulse" />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div style={s} className="w-full py-6 px-4">
      {dtTitle && <p className="text-sm font-bold text-gray-800 mb-3">{dtTitle}</p>}
      <div className="rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-gray-400">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Loading…</span>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-1">
            <span className="text-2xl">📭</span>
            <span className="text-sm">No records found</span>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100" style={{ backgroundColor: `${dtAccent}08` }}>
                {columns.map((col) => (
                  <th key={col} className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col}</th>
                ))}
                <th className="px-5 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={item.id} className={cn("border-b border-gray-50", i % 2 === 0 ? "bg-white" : "bg-gray-50/50")}>
                  {columns.map((col) => (
                    <td key={col} className="px-5 py-3.5 text-gray-700 max-w-[180px] truncate">{String(item.data[col] ?? "")}</td>
                  ))}
                  <td className="px-5 py-3.5">
                    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full", item.status === "published" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700")}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {(page > 1 || hasMore) && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">← Prev</button>
            <span>Page {page}</span>
            <button disabled={!hasMore} onClick={() => setPage((p) => p + 1)} className="px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}

function FormElement({ element, isPreview, s }: { element: CanvasElement; isPreview: boolean; s: React.CSSProperties }) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState<"idle" | "success" | "error">("idle");
  const formRef = React.useRef<HTMLFormElement>(null);
  const updateElement = useEditorStore((s) => s.updateElement);
  const runtime = useElementRuntime?.();

  const cfBgType = (element.props?.bgType as string) || "light";
  const cfDark = cfBgType === "dark";
  const cfBgCls = cfBgType === "dark" ? "bg-gray-900 text-white" : cfBgType === "white" ? "bg-white" : "bg-gray-50";
  const toastPos = (element.props?.toastPosition as import("@/components/ui/toast").ToastPosition) || "bottom-right";
  const formErrorMsg = (element.props?.errorMessage as string) || "Something went wrong. Please try again.";
  const toastErrorType = (element.props?.toastErrorType as ToastType) || "error";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isPreview) {
      addToast("Form submissions work in Preview mode. Click Preview to test.", "info", 4000, toastPos);
      return;
    }

    // ── Client-side validation ───────────────────────────────────────────────
    if (formRef.current) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const els = Array.from(formRef.current.elements) as HTMLInputElement[];
      const validationErrors: string[] = [];

      for (const el of els) {
        if (el.tagName === "BUTTON" || el.disabled) continue;
        const customMsg = (el as HTMLElement).dataset.errorMessage || "";
        const label =
          el.labels?.[0]?.textContent?.trim() ||
          el.placeholder ||
          el.name ||
          "A required field";

        if (el.required && !el.value.trim()) {
          validationErrors.push(customMsg || `${label} is required.`);
        } else if (el.type === "email" && el.value.trim() && !emailRe.test(el.value.trim())) {
          validationErrors.push(customMsg || `${label} must be a valid email address.`);
        } else if (el.minLength > 0 && el.value.trim().length < el.minLength) {
          validationErrors.push(customMsg || `${label} must be at least ${el.minLength} characters.`);
        } else if (el.maxLength > 0 && el.maxLength < 524288 && el.value.trim().length > el.maxLength) {
          validationErrors.push(customMsg || `${label} must be at most ${el.maxLength} characters.`);
        } else if (el.pattern && el.value.trim() && !new RegExp(el.pattern).test(el.value.trim())) {
          validationErrors.push(customMsg || `${label} format is invalid.`);
        }
      }

      if (validationErrors.length > 0) {
        const msg = validationErrors.length === 1
          ? validationErrors[0]
          : `${validationErrors[0]} (+${validationErrors.length - 1} more issue${validationErrors.length > 2 ? "s" : ""})`;
        addToast(msg, "warning", 4000, toastPos);
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const fd = new FormData(e.currentTarget);
      const data: Record<string, string> = {};
      fd.forEach((val, key) => { data[key] = val as string; });

      const formId         = element.props?.formId          as string | undefined;
      const collectionSlug = element.props?.collectionSlug  as string | undefined;
      const formSiteId     = element.props?.siteId          as string | undefined;

      // v2: backendBinding takes priority over legacy props
      const backendBinding = element.backendBinding as { actionId?: string; toastOnSuccess?: string; toastOnError?: string; redirectOnSuccess?: string } | undefined;
      if (backendBinding?.actionId && formSiteId) {
        const res = await fetch(`/api/v1/sites/${formSiteId}/actions/${backendBinding.actionId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.error ?? "Action failed");
        const successMsg = backendBinding.toastOnSuccess || (element.props?.successMessage as string) || "Submitted!";
        addToast(successMsg, "success", 4000, toastPos);
        setSubmitStatus("success");
        runtime?.emit("form:success", { elementId: element.id, data });
        if (formRef.current) formRef.current.reset();
        const redirectTo = backendBinding.redirectOnSuccess ?? (element.props?.redirectUrl as string);
        if (redirectTo && redirectTo !== "#") {
          setTimeout(() => { window.location.href = redirectTo; }, 1500);
        }
      } else if (collectionSlug && formSiteId) {
        // Write directly to the live database collection
        const res = await fetch(`/api/v1/sites/${formSiteId}/db/${collectionSlug}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data, status: "published" }),
        });
        if (!res.ok) { const j = await res.json(); throw new Error(j.error ?? "Submission failed"); }
      } else if (formId) {
        const res = await fetch(`/api/v1/forms/${formId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Submission failed");
      } else {
        const key = `form-submissions-${element.id}`;
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        existing.push({ data, submitted_at: new Date().toISOString() });
        localStorage.setItem(key, JSON.stringify(existing));
      }

      if (!backendBinding?.actionId) {
        // Legacy success path (backendBinding handles its own toast above)
        const successMsg = (element.props?.successMessage as string) || "Form submitted successfully!";
        addToast(successMsg, "success", 4000, toastPos);
        setSubmitStatus("success");
        runtime?.emit("form:success", { elementId: element.id, data });
        if (formRef.current) formRef.current.reset();
        const successAction = element.props?.successAction as string | undefined;
        const redirectUrl = element.props?.redirectUrl as string;
        if (successAction === "redirect" && redirectUrl && redirectUrl !== "#") {
          setTimeout(() => { window.location.href = redirectUrl; }, 1500);
        }
      }
    } catch (err) {
      const backendBinding2 = element.backendBinding as { toastOnError?: string } | undefined;
      const errMsg = backendBinding2?.toastOnError || formErrorMsg;
      addToast(errMsg, toastErrorType, 4000, toastPos);
      setSubmitStatus("error");
      runtime?.emit("form:error", { elementId: element.id });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formId = element.props?.formId as string | undefined;
  const [cfForms, setCfForms] = React.useState<{ id: string; name: string }[] | null>(null);
  const [cfPickerOpen, setCfPickerOpen] = React.useState(false);
  const [cfCreating, setCfCreating] = React.useState(false);
  const [cfNewName, setCfNewName] = React.useState("");
  const siteId = useEditorStore((s) => s.siteId);

  const loadForms = React.useCallback(() => {
    fetch("/api/v1/forms")
      .then((r) => r.json())
      .then((d) => setCfForms(d.forms ?? []))
      .catch(() => setCfForms([]));
  }, []);

  React.useEffect(() => {
    if (cfPickerOpen && cfForms === null) loadForms();
  }, [cfPickerOpen, cfForms, loadForms]);

  const cfCreateAndConnect = async () => {
    const name = cfNewName.trim() || "Contact Form";
    setCfCreating(true);
    try {
      const res = await fetch("/api/v1/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, site_id: siteId }),
      });
      if (res.ok) {
        const { form } = await res.json();
        updateElement(element.id, { props: { ...element.props, formId: form.id } });
        setCfForms((prev) => [form, ...(prev ?? [])]);
        setCfPickerOpen(false);
        setCfNewName("");
      }
    } catch { /* ignore */ } finally {
      setCfCreating(false);
    }
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} noValidate style={s} className={cn("w-full py-16 px-8 relative", cfBgCls)} data-submitting={isSubmitting ? "true" : undefined}>
      {!isPreview && (
        <div className="absolute top-3 right-3 z-20">
          {formId ? (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-100 border border-green-200 text-green-700 text-[10px] font-semibold">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
              Form connected
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setCfPickerOpen((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-[10px] font-semibold hover:bg-amber-100 transition"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Connect form
              </button>
              {cfPickerOpen && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-xl border border-gray-200 shadow-xl p-3 space-y-3 z-30">
                  {cfForms === null ? (
                    <p className="text-[11px] text-gray-400">Loading…</p>
                  ) : cfForms.length > 0 ? (
                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Select existing</p>
                      <div className="max-h-36 overflow-y-auto space-y-1">
                        {cfForms.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                              updateElement(element.id, { props: { ...element.props, formId: f.id } });
                              setCfPickerOpen(false);
                            }}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 text-[11px] font-medium text-gray-700 transition"
                          >
                            {f.name}
                          </button>
                        ))}
                      </div>
                      <hr className="border-gray-100" />
                    </div>
                  ) : null}
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide">Create new</p>
                    <input
                      value={cfNewName}
                      onChange={(e) => setCfNewName(e.target.value)}
                      placeholder="Form name"
                      className="w-full h-7 px-2.5 rounded-lg border border-gray-200 text-[11px] focus:outline-none focus:border-indigo-400"
                    />
                    <button
                      type="button"
                      onClick={cfCreateAndConnect}
                      disabled={cfCreating}
                      className="w-full py-1.5 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
                    >
                      {cfCreating ? "Creating…" : "Create & connect"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <div className="max-w-lg mx-auto">
        <SectionContentZone parentId={element.id} children={element.children || []} dark={cfDark} parentProps={element.props} />
      </div>
    </form>
  );
}


export const CanvasElementRenderer = React.memo(function CanvasElementRenderer({ element, isNested = false }: { element: CanvasElement; isNested?: boolean }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isPreview = useIsPreview();
  const runtime = useElementRuntime?.();

  // Fire interaction actions (preview mode only)
  const handleInteractionClick = React.useCallback((e: React.MouseEvent) => {
    if (!isPreview || !element.interactions?.length) return;
    const clickActions = element.interactions.filter((i) => i.trigger === "click");
    for (const interaction of clickActions) {
      for (const action of interaction.actions) {
        // Evaluate optional condition expression
        if (action.condition) {
          try {
            // biome-ignore lint/security/noEval: user-authored condition, only runs in preview
            const passes = new Function("return (" + action.condition + ")")();
            if (!passes) continue;
          } catch { continue; }
        }

        const executeAction = async () => {
          switch (action.type) {
            case "openModal": {
              const targetId = (action.config?.targetId as string) ?? "";
              runtime?.emit("modal:open", { targetId });
              break;
            }
            case "toggleElement": {
              const targetId = (action.config?.targetId as string) ?? "";
              const current = runtime?.getState(targetId + ":open");
              if (current) { runtime?.emit("modal:close", { targetId }); }
              else { runtime?.emit("modal:open", { targetId }); }
              break;
            }
            case "navigate": {
              const url = (action.config?.url as string) ?? (action.config?.href as string) ?? "";
              if (url) { window.location.href = url; }
              break;
            }
            case "scrollTo": {
              const targetId = (action.config?.targetId as string) ?? "";
              const el = document.getElementById(targetId);
              if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
              break;
            }
            case "showToast": {
              const msg = (action.config?.message as string) ?? "";
              const type = (action.config?.type as "success" | "error" | "info" | "warning") ?? "info";
              runtime?.emit("toast:show", { message: msg, type });
              break;
            }
            case "copyClipboard": {
              const text = (action.config?.text as string) ?? "";
              if (text) { await navigator.clipboard.writeText(text); }
              break;
            }
            case "runJS": {
              const code = (action.config?.code as string) ?? "";
              if (code) {
                try {
                  // biome-ignore lint/security/noEval: user-authored script, preview only
                  new Function("runtime", code)(runtime);
                } catch { /* swallow */ }
              }
              break;
            }
            case "callWebhook": {
              const url = (action.config?.url as string) ?? "";
              const method = (action.config?.method as string) ?? "POST";
              if (url) {
                fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(action.config?.payload ?? {}) })
                  .catch(() => {});
              }
              break;
            }
            case "runBackendAction":
            case "db.insert":
            case "db.update":
            case "db.delete":
            case "auth.signup":
            case "auth.login":
            case "auth.logout":
            case "email.send":
            case "cart.addItem":
            case "cart.removeItem":
            case "order.create":
            case "lemonsqueezy.checkout": {
              const siteId = (action.config?.siteId as string) ?? "";
              const actionId = action.type === "runBackendAction"
                ? (action.config?.actionId as string)
                : undefined;
              if (siteId && actionId) {
                const res = await fetch(`/api/v1/sites/${siteId}/actions/${actionId}`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify(action.config?.payload ?? {}),
                });
                const json = await res.json();
                if (json.success) {
                  runtime?.emit("action:success", { actionId, data: json.data });
                } else {
                  runtime?.emit("action:error", { actionId, error: json.error });
                }
              }
              break;
            }
            default:
              break;
          }
        };

        if (action.delay) {
          setTimeout(() => { executeAction(); }, action.delay);
        } else {
          executeAction();
        }
      }
    }
  }, [isPreview, runtime, element.interactions]);

  // Merge responsive overrides based on current device mode (strip non-CSS layout keys)
  const responsiveOverrides = element.props?._responsive as Record<string, any> | undefined;
  const rawBpOverrides = (deviceMode !== "desktop" && responsiveOverrides)
    ? (responsiveOverrides[deviceMode] || {})
    : {};
  const bpOverrides = pickStyleOverrides(rawBpOverrides);
  let s = { ...(element.styles || {}), ...bpOverrides } as React.CSSProperties;
  const p = (element.props || {}) as any;

  // ── Auto-responsive scaling for section blocks ────────────────────────────
  // Applied only when no explicit _responsive override exists for that property.
  const isMobileView = deviceMode === "mobile" || deviceMode === "small-mobile";
  const isTabletView = deviceMode === "tablet" || deviceMode === "large-tablet";

  // Scale down large section-level vertical padding (hero/feature sections)
  if ((isMobileView || isTabletView) && !rawBpOverrides.padding && typeof s.padding === "string") {
    const parts = s.padding.trim().split(/\s+/).map(v => parseFloat(v));
    const vPad = parts[0] ?? 0;
    const hPad = parts[1] ?? vPad;
    if (vPad > 60) {
      const nV = isMobileView ? Math.max(32, Math.round(vPad * 0.4)) : Math.max(48, Math.round(vPad * 0.6));
      const nH = isMobileView ? Math.max(16, Math.round(hPad * 0.35)) : Math.max(24, Math.round(hPad * 0.5));
      s = { ...s, padding: `${nV}px ${nH}px` };
    }
  }

  // Scale down very large display font sizes (hero headings)
  if ((isMobileView || isTabletView) && !rawBpOverrides.fontSize && typeof s.fontSize === "string" && s.fontSize.endsWith("px")) {
    const fs = parseFloat(s.fontSize);
    if (fs > 60) {
      s = { ...s, fontSize: isMobileView ? `${Math.max(32, Math.round(fs * 0.38))}px` : `${Math.max(48, Math.round(fs * 0.6))}px` };
    } else if (isMobileView && fs > 36) {
      s = { ...s, fontSize: `${Math.max(22, Math.round(fs * 0.55))}px` };
    }
  }

  // Remove fixed minHeight caps on mobile so content flows naturally
  if (isMobileView && !rawBpOverrides.minHeight && typeof s.minHeight === "string" && s.minHeight.endsWith("px") && parseFloat(s.minHeight) > 400) {
    s = { ...s, minHeight: "auto" };
  }
  // ─────────────────────────────────────────────────────────────────────────

  switch (element.type) {

    // ── Badge ──
    case "badge":
      return (
        <div className={cn("flex", isNested ? "px-2 py-1" : "px-8 py-4")}>
          <span
            style={s}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold tracking-[0.07em] uppercase border"
            ref={undefined}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: (s.color as string) || "#6366F1" }} />
            {element.content || "New"}
          </span>
        </div>
      );

    // ── Icon ──
    case "icon":
      return (
        <div className={cn("flex", isNested ? "p-2" : "px-8 py-4 justify-center")}>
          <div style={s} className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center text-3xl shadow-sm border border-indigo-100/60 ring-1 ring-black/5">
            {element.content || "✨"}
          </div>
        </div>
      );

    // ── Typography ──
    case "heading": {
      const rawLevel = element.props?.level;
      const headingLevel = typeof rawLevel === "string"
        ? (parseInt(rawLevel.replace(/\D/g, ""), 10) || 2)
        : ((rawLevel as number) || 2);
      const HeadingTag = `h${Math.min(Math.max(headingLevel, 1), 6)}` as keyof JSX.IntrinsicElements;
      const isMobileCanvas = deviceMode === "mobile" || deviceMode === "small-mobile";
      const headingSizes: Record<number, string> = isNested ? {
        1: "text-2xl font-extrabold tracking-tight",
        2: "text-xl font-bold tracking-tight",
        3: "text-lg font-bold",
        4: "text-base font-semibold",
        5: "text-sm font-semibold",
        6: "text-xs font-semibold"
      } : {
        1: isMobileCanvas
          ? "text-3xl font-extrabold tracking-[-0.03em] leading-[1.1]"
          : "text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-[-0.04em] leading-[1.05]",
        2: isMobileCanvas
          ? "text-2xl font-bold tracking-[-0.02em] leading-tight"
          : "text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1]",
        3: isMobileCanvas
          ? "text-xl font-bold tracking-tight"
          : "text-3xl font-bold tracking-[-0.02em] leading-[1.15]",
        4: "text-2xl font-semibold tracking-[-0.01em]",
        5: "text-xl font-semibold tracking-tight",
        6: "text-lg font-semibold",
      };
      return (
        <div className={cn("w-full", isNested ? "p-2" : "px-8 py-4")} data-element-type="heading">
          <HeadingTag
            style={s}
            className={cn(headingSizes[headingLevel] || headingSizes[2], "text-gray-950 text-balance", !isPreview && "focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded")}
            contentEditable={!isPreview}
            suppressContentEditableWarning
            onBlur={!isPreview ? (e) => updateElement(element.id, { content: (e.currentTarget as HTMLElement).innerText }) : undefined}
          >
            {element.content || "Your Heading Here"}
          </HeadingTag>
        </div>
      );
    }

    case "paragraph":
      return (
        <div className={cn("w-full text-gray-500 font-normal leading-[1.75]", isNested ? "p-2 text-[15px]" : "px-8 py-2 text-base md:text-lg")}>
          <p
            style={s}
            contentEditable={!isPreview}
            suppressContentEditableWarning
            className={cn("text-pretty", !isPreview ? "focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded" : undefined)}
            onBlur={!isPreview ? (e) => updateElement(element.id, { content: e.currentTarget.innerText }) : undefined}
          >
            {element.content || "This is a paragraph. Click to edit the text content."}
          </p>
        </div>
      );

    case "rich-text":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="prose prose-sm max-w-none text-gray-500 leading-relaxed font-normal hover:prose-a:text-indigo-600">
            <p>{element.content || "Rich text content. Supports **bold**, *italic*, and more."}</p>
          </div>
        </div>
      );

    case "list": {
      const listType = (element.props?.listType as string) || "unordered";
      const iconType = (element.props?.iconType as string) || "check";
      const listItems = (element.props?.items as string[]) || ["First item", "Second item", "Third item"];
      const ListTag = listType === "ordered" ? "ol" : "ul";
      const accent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full text-gray-600", isNested ? "p-2 text-sm" : "px-8 py-4 text-base")}>
          <ListTag className={cn("space-y-2", listType === "ordered" && "list-decimal list-inside")}>
            {listItems.map((item, i) => (
              <li key={i} className={cn("flex items-start gap-2.5", listType === "ordered" ? "block" : "flex")}>
                {listType === "unordered" && (
                  <span className="shrink-0 font-bold mt-0.5" style={{ color: accent, fontSize: "14px" }}>
                    {iconType === "check" ? "✓" : iconType === "chevron" ? "›" : "•"}
                  </span>
                )}
                <span>{item}</span>
              </li>
            ))}
          </ListTag>
        </div>
      );
    }

    // ── Button ──
    case "button": {
      const topBtnHref = (element.props?.href as string) || "";
      const topBtnTarget = (element.props?.openInNewTab as boolean) ? "_blank" : (element.props?.target as string) || "_self";
      const topBtnIsSubmit = !!(element.props?.submitForm);
      const topBtnAccent = (element.props?.accentColor as string) || "#6366f1";
      const topBtnVariant = (element.props?.variant as string) || "solid";
      const topBtnFullWidth = !!(element.props?.fullWidth);
      const topBtnStyle: React.CSSProperties = topBtnVariant === "outline"
        ? { border: `1.5px solid ${topBtnAccent}`, color: topBtnAccent, background: "transparent", ...s }
        : {
            backgroundColor: topBtnAccent,
            color: "#fff",
            boxShadow: `0 1px 3px rgba(0,0,0,0.12), 0 4px 16px ${topBtnAccent}45`,
            ...s,
          };
      const topBtnCls = cn(
        isNested ? "px-4 py-2 rounded-lg text-[13px]" : "px-6 py-3.5 rounded-xl text-[14px]",
        "inline-flex items-center justify-center gap-2 font-semibold tracking-[-0.01em]",
        "transition-all duration-200 hover:-translate-y-px hover:brightness-110 hover:shadow-lg active:translate-y-0 active:scale-[0.98] cursor-pointer",
        topBtnFullWidth && "w-full"
      );
      if (topBtnIsSubmit) {
        return (
          <div className={cn("flex", isNested ? "p-2" : "px-8 py-4", topBtnFullWidth && "w-full")}>
            <button type="submit" style={topBtnStyle} className={topBtnCls}>{element.content || "Submit"}</button>
          </div>
        );
      }
      return (
        <div className={cn("flex", isNested ? "p-2" : "px-8 py-4", topBtnFullWidth && "w-full")}>
          {isPreview && topBtnHref
            ? <a href={topBtnHref} target={topBtnTarget} rel="noopener noreferrer" style={topBtnStyle} className={topBtnCls}>{element.content || "Click Me"}</a>
            : <button style={topBtnStyle} className={topBtnCls}>{element.content || "Click Me"}</button>
          }
        </div>
      );
    }

    // ── Button Group ──
    case "button-group": {
      const bgAccent = (element.props?.accentColor as string) || "#6366f1";
      const bgButtons = (element.props?.buttons as Array<{ label: string; href?: string; variant?: string }>) || [
        { label: "Get Started", variant: "solid" },
        { label: "Learn More", variant: "outline" }
      ];
      return (
        <div style={s} className={cn("flex flex-wrap gap-3", isNested ? "p-2" : "px-8 py-4")}>
          {bgButtons.map((btn, i) => {
            const btnStyle = btn.variant === "outline" ? { border: `1.5px solid ${bgAccent}`, color: bgAccent } : { backgroundColor: bgAccent, color: "#fff" };
            const btnCls = cn(
              isNested ? "px-4 py-2 rounded-lg text-xs" : "px-6 py-3 rounded-xl text-sm",
              "font-semibold transition-all shadow-sm hover:opacity-90 active:scale-[0.98] cursor-pointer"
            );
            return (
              <button key={i} style={btnStyle} className={btnCls}>{btn.label}</button>
            );
          })}
        </div>
      );
    }

    // ── Media ──
    case "logo": {
      const logoSrc = element.props?.src as string;
      const logoAlt = (element.props?.alt as string) || "Logo";
      const logoHeight = (element.props?.height as string) || "40px";
      const logoAccent = (element.props?.accentColor as string) || "#6366f1";
      const logoShape = (element.props?.shape as string) || "rounded";
      const shapeClass = logoShape === "circle" ? "rounded-full" : logoShape === "square" ? "rounded-none" : "rounded-xl";
      return (
        <div style={s} className="inline-flex items-center">
          {logoSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={logoSrc}
              alt={logoAlt}
              style={{ height: logoHeight, width: "auto", display: "block", objectFit: "contain" }}
            />
          ) : (
            <div
              className={cn("flex items-center justify-center shrink-0 border-2 border-dashed border-gray-300 text-gray-400 text-xs font-semibold", shapeClass)}
              style={{ height: logoHeight, minWidth: logoHeight, background: `${logoAccent}15`, color: logoAccent }}
            >
              Logo
            </div>
          )}
        </div>
      );
    }

    case "image":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          {(element.props?.src as string) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={element.props?.src as string}
              alt={(element.props?.alt as string) || ""}
              className="w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="w-full aspect-video rounded-2xl bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
              <span className="text-3xl">🖼️</span>
            </div>
          )}
          {(element.props?.caption as string) && (
            <p className="text-xs text-gray-400 text-center mt-2">{element.props?.caption as string}</p>
          )}
        </div>
      );

    case "video":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="w-full aspect-video rounded-2xl bg-gray-900 flex items-center justify-center shadow-lg">
            <span className="text-4xl text-white/50">▶️</span>
          </div>
        </div>
      );

    case "gallery": {
      const gradients = ["from-pink-200 to-rose-300", "from-sky-200 to-blue-300", "from-emerald-200 to-teal-300", "from-amber-200 to-orange-300", "from-violet-200 to-purple-300", "from-cyan-200 to-teal-300"];
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`aspect-square rounded-xl bg-gradient-to-br ${gradients[i - 1]} border border-gray-100 shadow-sm`} />
            ))}
          </div>
        </div>
      );
    }

    // ── Layout ──

    // ── Section (blank structural container) ──
    case "section": {
      const secBgType = (element.props?.bgType as string) || "white";
      const secAccent = (element.props?.accentColor as string) || "#6366f1";
      const secPadding = (element.props?.padding as string) || "md";
      const secMaxWidth = (element.props?.maxWidth as string) || "xl";
      const secAlign = (element.props?.contentAlign as string) || "left";
      const secDark = secBgType === "dark" || secBgType === "dark-gradient";

      const bgCls = secBgType === "dark" ? "bg-gray-900"
        : secBgType === "dark-gradient" ? "bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900"
          : secBgType === "light" ? "bg-gray-50"
            : secBgType === "branded" ? ""
              : "bg-white";
      const paddingCls = secPadding === "none" ? "" : secPadding === "sm" ? "py-8 px-6" : secPadding === "lg" ? "py-24 px-10" : secPadding === "xl" ? "py-32 px-10" : "py-16 px-8";
      const maxWidthMap: Record<string, string> = { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl", xl: "max-w-7xl", full: "w-full", none: "w-full" };
      const maxWidthCls = maxWidthMap[secMaxWidth] || "max-w-7xl";
      const mobileWidthOverride: React.CSSProperties = (isMobileView || isTabletView) && typeof s.width === "string" && !s.width.endsWith("%")
        ? { maxWidth: s.width, width: "100%" }
        : {};
      const containerStyle: React.CSSProperties = {
        ...s,
        ...(secBgType === "branded" ? { background: `linear-gradient(135deg, ${secAccent}ee, ${secAccent}88)` } : {}),
        ...mobileWidthOverride,
      };

      return (
        <div style={containerStyle} className={cn("w-full", bgCls)}>
          <div className={cn(paddingCls, maxWidthCls !== "w-full" ? "mx-auto" : "", maxWidthCls)}>
            <SectionContentZone
              parentId={element.id}
              children={element.children || []}
              dark={secDark || secBgType === "branded"}
              align={secAlign === "center" ? "center" : undefined}
              parentProps={element.props}
            />
          </div>
        </div>
      );
    }

    // ── Two-Column layout ──
    case "two-col": {
      const twoBgType = (element.props?.bgType as string) || "white";
      const twoAccent = (element.props?.accentColor as string) || "#6366f1";
      const twoRatio = (element.props?.colRatio as string) || "1:1";
      const twoGap = (element.props?.gap as string) || "md";
      const twoVertAlign = (element.props?.vertAlign as string) || "start";
      const twoJustify = (element.props?.justifyContent as string) || "normal";
      const twoPadding = (element.props?.padding as string) || "md";
      const twoDark = twoBgType === "dark";

      const bgCls = twoBgType === "dark" ? "bg-gray-900" : twoBgType === "light" ? "bg-gray-50" : twoBgType === "branded" ? "" : "bg-white";
      const paddingCls = twoPadding === "none" ? "" : twoPadding === "sm" ? "py-8 px-6" : twoPadding === "lg" ? "py-24 px-10" : "py-16 px-8";
      const gapCls = twoGap === "sm" ? "gap-4" : twoGap === "lg" ? "gap-16" : twoGap === "xl" ? "gap-24" : "gap-8";
      const alignCls = twoVertAlign === "center" ? "items-center" : twoVertAlign === "end" ? "items-end" : "items-start";
      const justifyCls = twoJustify === "center" ? "justify-center" : twoJustify === "end" ? "justify-end" : twoJustify === "between" ? "justify-between" : twoJustify === "around" ? "justify-around" : twoJustify === "evenly" ? "justify-evenly" : "";

      const ratioMap: Record<string, [string, string]> = {
        "1:1": ["flex-1", "flex-1"],
        "1:2": ["w-1/3", "w-2/3"],
        "2:1": ["w-2/3", "w-1/3"],
        "1:3": ["w-1/4", "w-3/4"],
        "3:1": ["w-3/4", "w-1/4"],
        "2:3": ["w-2/5", "w-3/5"],
        "3:2": ["w-3/5", "w-2/5"],
      };
      const [col1Cls, col2Cls] = ratioMap[twoRatio] || ["flex-1", "flex-1"];

      const containerStyle: React.CSSProperties = { ...s, ...(twoBgType === "branded" ? { background: `linear-gradient(135deg, ${twoAccent}ee, ${twoAccent}88)` } : {}) };

      const col1 = element.children?.[0];
      const col2 = element.children?.[1];

      const emptyColCls = isPreview ? "min-h-32" : cn(
        "min-h-32 rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-medium p-4 text-center",
        twoDark ? "border-white/20 text-white/40" : "border-gray-200 text-gray-400"
      );

      return (
        <div style={containerStyle} className={cn("w-full", bgCls)}>
          <div className={cn("max-w-7xl mx-auto flex", paddingCls, gapCls, alignCls, justifyCls)}>
            <div className={col1Cls}>
              {col1 ? (
                <SectionContentZone parentId={col1.id} children={col1.children || []} dark={twoDark} parentProps={col1.props} />
              ) : (
                <div className={emptyColCls}>{!isPreview && "Column 1"}</div>
              )}
            </div>
            <div className={col2Cls}>
              {col2 ? (
                <SectionContentZone parentId={col2.id} children={col2.children || []} dark={twoDark} parentProps={col2.props} />
              ) : (
                <div className={emptyColCls}>{!isPreview && "Column 2"}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Three-Column layout ──
    case "three-col": {
      const threeBgType = (element.props?.bgType as string) || "white";
      const threeAccent = (element.props?.accentColor as string) || "#6366f1";
      const threeGap = (element.props?.gap as string) || "md";
      const threeVertAlign = (element.props?.vertAlign as string) || "start";
      const threeJustify = (element.props?.justifyContent as string) || "normal";
      const threePadding = (element.props?.padding as string) || "md";
      const threeDark = threeBgType === "dark";

      const bgCls = threeBgType === "dark" ? "bg-gray-900" : threeBgType === "light" ? "bg-gray-50" : threeBgType === "branded" ? "" : "bg-white";
      const paddingCls = threePadding === "none" ? "" : threePadding === "sm" ? "py-8 px-6" : threePadding === "lg" ? "py-24 px-10" : "py-16 px-8";
      const gapCls = threeGap === "sm" ? "gap-4" : threeGap === "lg" ? "gap-12" : "gap-8";
      const alignCls = threeVertAlign === "center" ? "items-center" : threeVertAlign === "end" ? "items-end" : "items-start";
      const justifyCls = threeJustify === "center" ? "justify-center" : threeJustify === "end" ? "justify-end" : threeJustify === "between" ? "justify-between" : threeJustify === "around" ? "justify-around" : threeJustify === "evenly" ? "justify-evenly" : "";
      const containerStyle: React.CSSProperties = { ...s, ...(threeBgType === "branded" ? { background: `linear-gradient(135deg, ${threeAccent}ee, ${threeAccent}88)` } : {}) };

      const cols = [element.children?.[0], element.children?.[1], element.children?.[2]];
      const emptyColCls = isPreview ? "min-h-28" : cn("min-h-28 rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-medium", threeDark ? "border-white/20 text-white/40" : "border-gray-200 text-gray-400");

      return (
        <div style={containerStyle} className={cn("w-full", bgCls)}>
          <div className={cn("max-w-7xl mx-auto flex", paddingCls, gapCls, alignCls, justifyCls)}>
            {cols.map((col, i) => (
              <div key={i} className="flex-1">
                {col ? (
                  <SectionContentZone parentId={col?.id || "empty"} children={col?.children || []} dark={threeDark} parentProps={col?.props} />
                ) : (
                  <div className={emptyColCls}>{!isPreview && `Column ${i + 1}`}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── Four-Column layout ──
    case "four-col": {
      const fourBgType = (element.props?.bgType as string) || "white";
      const fourAccent = (element.props?.accentColor as string) || "#6366f1";
      const fourGap = (element.props?.gap as string) || "md";
      const fourVertAlign = (element.props?.vertAlign as string) || "start";
      const fourJustify = (element.props?.justifyContent as string) || "normal";
      const fourPadding = (element.props?.padding as string) || "md";
      const fourDark = fourBgType === "dark";

      const bgCls = fourBgType === "dark" ? "bg-gray-900" : fourBgType === "light" ? "bg-gray-50" : fourBgType === "branded" ? "" : "bg-white";
      const paddingCls = fourPadding === "none" ? "" : fourPadding === "sm" ? "py-8 px-6" : fourPadding === "lg" ? "py-24 px-10" : "py-16 px-8";
      const gapCls = fourGap === "sm" ? "gap-4" : fourGap === "lg" ? "gap-12" : "gap-8";
      const alignCls = fourVertAlign === "center" ? "items-center" : fourVertAlign === "end" ? "items-end" : "items-start";
      const justifyCls = fourJustify === "center" ? "justify-center" : fourJustify === "end" ? "justify-end" : fourJustify === "between" ? "justify-between" : fourJustify === "around" ? "justify-around" : fourJustify === "evenly" ? "justify-evenly" : "";
      const containerStyle: React.CSSProperties = { ...s, ...(fourBgType === "branded" ? { background: `linear-gradient(135deg, ${fourAccent}ee, ${fourAccent}88)` } : {}) };

      const cols = [element.children?.[0], element.children?.[1], element.children?.[2], element.children?.[3]];
      const emptyColCls = isPreview ? "min-h-28" : cn("min-h-28 rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-medium", fourDark ? "border-white/20 text-white/40" : "border-gray-200 text-gray-400");

      return (
        <div style={containerStyle} className={cn("w-full", bgCls)}>
          <div className={cn("max-w-7xl mx-auto flex", paddingCls, gapCls, alignCls, justifyCls)}>
            {cols.map((col, i) => (
              <div key={i} className="flex-1">
                {col ? (
                  <SectionContentZone parentId={col?.id || "empty"} children={col?.children || []} dark={fourDark} parentProps={col?.props} />
                ) : (
                  <div className={emptyColCls}>{!isPreview && `Column ${i + 1}`}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // ── Sidebar Left layout ──
    case "sidebar-left": {
      const slBgType = (element.props?.bgType as string) || "white";
      const slAccent = (element.props?.accentColor as string) || "#6366f1";
      const slGap = (element.props?.gap as string) || "md";
      const slPadding = (element.props?.padding as string) || "md";
      const slVertAlign = (element.props?.vertAlign as string) || "start";
      const slDark = slBgType === "dark";

      const bgCls = slBgType === "dark" ? "bg-gray-900" : slBgType === "light" ? "bg-gray-50" : slBgType === "branded" ? "" : "bg-white";
      const paddingCls = slPadding === "none" ? "" : slPadding === "sm" ? "py-8 px-6" : slPadding === "lg" ? "py-24 px-10" : "py-16 px-8";
      const gapCls = slGap === "sm" ? "gap-4" : slGap === "lg" ? "gap-12" : "gap-8";
      const alignCls = slVertAlign === "center" ? "items-center" : slVertAlign === "end" ? "items-end" : "items-start";
      const containerStyle: React.CSSProperties = { ...s, ...(slBgType === "branded" ? { background: `linear-gradient(135deg, ${slAccent}ee, ${slAccent}88)` } : {}) };

      const sidebar = element.children?.[0];
      const content = element.children?.[1];
      const emptyColCls = isPreview ? "min-h-32" : cn("min-h-32 rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-medium p-4 text-center", slDark ? "border-white/20 text-white/40" : "border-gray-200 text-gray-400");

      return (
        <div style={containerStyle} className={cn("w-full", bgCls)}>
          <div className={cn("max-w-7xl mx-auto flex", paddingCls, gapCls, alignCls)}>
            <div className="w-64 shrink-0">
              {sidebar ? (
                <SectionContentZone parentId={sidebar.id} children={sidebar.children || []} dark={slDark} parentProps={sidebar.props} />
              ) : (
                <div className={emptyColCls}>{!isPreview && "Sidebar"}</div>
              )}
            </div>
            <div className="flex-1">
              {content ? (
                <SectionContentZone parentId={content.id} children={content.children || []} dark={slDark} parentProps={content.props} />
              ) : (
                <div className={emptyColCls}>{!isPreview && "Main Content"}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Sidebar Right layout ──
    case "sidebar-right": {
      const srBgType = (element.props?.bgType as string) || "white";
      const srAccent = (element.props?.accentColor as string) || "#6366f1";
      const srGap = (element.props?.gap as string) || "md";
      const srPadding = (element.props?.padding as string) || "md";
      const srVertAlign = (element.props?.vertAlign as string) || "start";
      const srDark = srBgType === "dark";

      const bgCls = srBgType === "dark" ? "bg-gray-900" : srBgType === "light" ? "bg-gray-50" : srBgType === "branded" ? "" : "bg-white";
      const paddingCls = srPadding === "none" ? "" : srPadding === "sm" ? "py-8 px-6" : srPadding === "lg" ? "py-24 px-10" : "py-16 px-8";
      const gapCls = srGap === "sm" ? "gap-4" : srGap === "lg" ? "gap-12" : "gap-8";
      const alignCls = srVertAlign === "center" ? "items-center" : srVertAlign === "end" ? "items-end" : "items-start";
      const containerStyle: React.CSSProperties = { ...s, ...(srBgType === "branded" ? { background: `linear-gradient(135deg, ${srAccent}ee, ${srAccent}88)` } : {}) };

      const content = element.children?.[0];
      const sidebar = element.children?.[1];
      const emptyColCls = isPreview ? "min-h-32" : cn("min-h-32 rounded-xl border-2 border-dashed flex items-center justify-center text-xs font-medium p-4 text-center", srDark ? "border-white/20 text-white/40" : "border-gray-200 text-gray-400");

      return (
        <div style={containerStyle} className={cn("w-full", bgCls)}>
          <div className={cn("max-w-7xl mx-auto flex", paddingCls, gapCls, alignCls)}>
            <div className="flex-1">
              {content ? (
                <SectionContentZone parentId={content.id} children={content.children || []} dark={srDark} parentProps={content.props} />
              ) : (
                <div className={emptyColCls}>{!isPreview && "Main Content"}</div>
              )}
            </div>
            <div className="w-64 shrink-0">
              {sidebar ? (
                <SectionContentZone parentId={sidebar.id} children={sidebar.children || []} dark={srDark} parentProps={sidebar.props} />
              ) : (
                <div className={emptyColCls}>{!isPreview && "Sidebar"}</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    case "divider":
      return (
        <div className={cn("w-full", isNested ? "px-2 tracking-tight" : "px-8 py-4")}>
          <hr style={s} className="border-gray-200 w-full" />
        </div>
      );

    case "spacer":
      return <div style={{ height: s.height || (isNested ? 16 : 40), ...s }} className="w-full" />;

    case "container": {
      // Non-desktop: remove minWidth so flex children can wrap.
      // Mobile/small-mobile: additionally force flex:1 containers to full-width so they stack
      // cleanly even when minWidth isn't set (e.g. two-column layouts with just flex:"1").
      const isMobileView = deviceMode === "mobile" || deviceMode === "small-mobile";
      const containerResponsive: React.CSSProperties =
        deviceMode === "desktop" ? {} :
        s.minWidth
          ? { minWidth: "0", ...(s.flex !== undefined ? { flex: "1 1 100%", width: "100%" } : { width: "100%" }) }
          : (isMobileView && s.flex !== undefined)
            ? { flex: "1 1 100%", width: "100%" }
            : {};
      const containerStyle = { ...s, ...containerResponsive };
      return (
        <div
          style={containerStyle}
          className={cn(containerStyle.width ? undefined : "w-full", s.padding ? undefined : (isNested ? "p-1" : "px-8 py-6"))}
          data-section-root={!isNested ? "true" : undefined}
          data-element-type="container"
        >
          <SectionContentZone
            parentId={element.id}
            children={element.children || []}
            parentProps={element.props}
            parentStyles={s}
          />
        </div>
      );
    }

    case "columns":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <SectionContentZone
            parentId={element.id}
            children={element.children || []}
            direction="row"
            parentProps={element.props}
            parentStyles={s}
          />
        </div>
      );

    case "grid": {
      const cols = Number(element.props?.columns) || 3;
      const rows = Number(element.props?.rows) || 0;
      const gap = (element.props?.gap as string) || (s.gap as string) || "1rem";
      
      const gridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: `repeat(${cols}, 1fr)`,
        gridTemplateRows: rows > 0 ? `repeat(${rows}, 1fr)` : undefined,
        gap: gap,
        ...s,
      };
      return (
        <div style={gridStyle} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          {(element.children || []).map((child) => (
            <CanvasElementRenderer key={child.id} element={child} isNested />
          ))}
        </div>
      );
    }

    // ── Content blocks ──
    // ── Card (generic content card with icon, title, body, optional image) ──
    case "card": {
      const cardCardStyle = (element.props?.cardStyle as string) || "bordered";
      const cardAccent = (element.props?.accentColor as string) || "#6366f1";
      const cardLayout = (element.props?.layout as string) || "vertical";
      const cardHasImage = !!(element.props?.imageUrl as string);
      const cardCls = cardCardStyle === "flat" ? "rounded-3xl overflow-hidden bg-gray-50/50"
        : cardCardStyle === "shadowed" ? "rounded-3xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-300 border border-gray-100/50"
        : cardCardStyle === "filled" ? "rounded-3xl overflow-hidden border"
        : "rounded-3xl border border-gray-200/60 bg-white shadow-sm hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] hover:border-gray-300/60 transition-all duration-300 overflow-hidden";
      const cardContainerStyle = cardCardStyle === "filled" ? { backgroundColor: `${cardAccent}05`, borderColor: `${cardAccent}20` } : {};
      const iconBg = { backgroundColor: `${cardAccent}12`, border: `1px solid ${cardAccent}20`, color: cardAccent };
      return (
        <div style={s} className="mx-8 my-4 relative group">
          <div className={cardCls} style={cardContainerStyle}>
            {cardHasImage && (
              <div className="relative overflow-hidden w-full h-48 md:h-56">
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
                <img src={element.props?.imageUrl as string} alt={(element.props?.imageAlt as string) || ""} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
            )}
            {!cardHasImage && cardLayout !== "horizontal" && (
              <div className="h-1.5 w-full opacity-80" style={{ background: `linear-gradient(90deg, ${cardAccent}, ${cardAccent}40)` }} />
            )}
            <div className="p-8 md:p-10">
              {cardLayout === "horizontal" ? (
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  <div className="h-14 w-14 rounded-[1.25rem] flex items-center justify-center text-2xl shrink-0 shadow-sm" style={iconBg}>
                    {(element.props?.icon as string) || "✦"}
                  </div>
                  <div className="flex-1 min-w-0 pt-1">
                    <h3 className="text-[18px] font-bold text-gray-900 mb-2 tracking-tight">{(element.props?.title as string) || "Card Title"}</h3>
                    <p className="text-[15px] text-gray-500 leading-[1.6]">{(element.props?.description as string) || "Card description goes here."}</p>
                    {(element.props?.cta as string) && (
                      <button className="mt-5 text-[14px] font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg text-white inline-flex items-center gap-2" style={{ backgroundColor: cardAccent }}>
                        {element.props?.cta as string} <span>→</span>
                      </button>
                    )}
                  </div>
                </div>
              ) : (
                <>
                  <div className="h-14 w-14 rounded-[1.25rem] flex items-center justify-center text-2xl mb-6 shadow-sm" style={iconBg}>
                    {(element.props?.icon as string) || "✦"}
                  </div>
                  <h3 className="text-[20px] font-bold text-gray-900 mb-3 tracking-[-0.01em]">{(element.props?.title as string) || "Card Title"}</h3>
                  <p className="text-[15px] text-gray-500 leading-[1.65] mb-6">{(element.props?.description as string) || "Card description goes here. Add your content and customize the styling."}</p>
                  {(element.props?.cta as string) && (
                    <button className="text-[14px] font-bold px-5 py-2.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg text-white inline-flex items-center gap-2" style={{ backgroundColor: cardAccent }}>
                      {element.props?.cta as string} <span>→</span>
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Single Testimonial (blockquote style — distinct from testimonials grid) ──
    case "testimonial": {
      const singleTestAccent = (element.props?.accentColor as string) || "#f59e0b";
      const singleTestBgType = (element.props?.bgType as string) || "light";
      const singleTestDark = singleTestBgType === "dark";
      const singleTestBgCls = singleTestDark ? "bg-gray-950" : singleTestBgType === "white" ? "bg-white" : "bg-gray-50";
      const stars = (element.props?.stars as number) || 5;
      return (
        <div style={s} className={cn("w-full py-24 px-8 relative", singleTestBgCls)}>
          {singleTestDark && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950 opacity-80" />}
          <div className="max-w-4xl mx-auto relative z-10 hidden md:block">
            <div className="absolute -top-12 -left-8 text-[120px] leading-none opacity-10 select-none font-serif" style={{ color: singleTestAccent }}>"</div>
          </div>
          <div className="max-w-3xl mx-auto relative z-10 text-center">
            {/* Stars */}
            <div className="flex gap-1.5 justify-center mb-10">
              {Array.from({ length: Math.min(stars, 5) }).map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" className="w-6 h-6 drop-shadow-sm" fill={singleTestAccent}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <blockquote className="relative">
              <p className={cn("text-2xl md:text-[2rem] font-bold leading-[1.4] tracking-[-0.02em] mb-12 text-balance", singleTestDark ? "text-white" : "text-gray-900")}>
                "{(element.props?.quote as string) || "This product completely transformed how our team works. The ROI was visible within the first month."}"
              </p>
              <footer className="flex flex-col items-center justify-center gap-4">
                <div
                  className="h-16 w-16 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0 ring-4 ring-offset-4 shadow-xl"
                  style={{ background: `linear-gradient(135deg, ${singleTestAccent}, ${singleTestAccent}aa)`, ringColor: `${singleTestAccent}30`, ringOffsetColor: singleTestDark ? "rgb(3 7 18)" : singleTestBgType === "white" ? "#fff" : "#f9fafb" } as React.CSSProperties}
                >
                  {((element.props?.authorName as string) || "JD").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <p className={cn("text-[17px] font-bold tracking-tight mb-1", singleTestDark ? "text-white" : "text-gray-900")}>{(element.props?.authorName as string) || "Jane Doe"}</p>
                  <p className={cn("text-[14px] font-medium", singleTestDark ? "text-gray-400" : "text-gray-500")}>
                    {(element.props?.authorTitle as string) || "CEO, Company Inc."}
                    {(element.props?.company as string) && (
                      <span className="ml-2 font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: `${singleTestAccent}15`, color: singleTestDark ? singleTestAccent : singleTestAccent }}>
                        {element.props?.company as string}
                      </span>
                    )}
                  </p>
                </div>
              </footer>
            </blockquote>
          </div>
        </div>
      );
    }

    case "team": {
      const members = (element.props?.members as Array<{ name: string; title: string; bio?: string; avatarUrl?: string; social?: { twitter?: string; linkedin?: string } }>) || [
        { name: "Alex Johnson", title: "CEO & Co-founder" },
        { name: "Sarah Chen", title: "Chief Technology Officer" },
        { name: "Marcus Lee", title: "Head of Design" },
      ];
      const teamGradients = ["135deg, #818CF8, #6366F1", "135deg, #C084FC, #A855F7", "135deg, #FB923C, #F97316", "135deg, #34D399, #10B981"];
      const teamCols = (element.props?.columns as number) || 3;
      const teamAvatarStyle = (element.props?.avatarStyle as string) || "circle";
      const teamBgType = (element.props?.bgType as string) || "white";
      const teamAccent = (element.props?.accentColor as string) || "";
      const teamDark = teamBgType === "dark";
      const teamBgCls = teamBgType === "dark" ? "bg-gray-950" : teamBgType === "light" ? "bg-gray-50" : "bg-white";
      const teamColCls = teamCols === 2 ? "grid-cols-2" : teamCols === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3";
      const teamAvatarCls = teamAvatarStyle === "circle" ? "rounded-full" : teamAvatarStyle === "square" ? "rounded-none" : "rounded-2xl";
      return (
        <div style={s} className={cn("w-full py-20 px-8", teamBgCls)}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <h2 className={cn("text-4xl font-bold tracking-[-0.03em] mb-3", teamDark ? "text-white" : "text-gray-950")}>
                {(element.props?.headline as string) || "Meet our team"}
              </h2>
              <p className={cn("text-lg max-w-xl mx-auto leading-relaxed", teamDark ? "text-gray-400" : "text-gray-500")}>
                {(element.props?.subheadline as string) || "The talented people building great products"}
              </p>
            </div>
            <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${teamCols}, 1fr)` }}>
              {members.map((m, i) => (
                <div key={i} className="text-center group">
                  {m.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={m.avatarUrl} alt={m.name} className={cn("h-24 w-24 object-cover mx-auto mb-5 shadow-xl ring-4 ring-white", teamAvatarCls)} />
                  ) : (
                    <div
                      className={cn("h-24 w-24 flex items-center justify-center text-2xl font-bold text-white mx-auto mb-5 shadow-xl ring-4", teamAvatarCls, teamDark ? "ring-gray-800" : "ring-white")}
                      style={{ background: `linear-gradient(${teamAccent ? `135deg, ${teamAccent}dd, ${teamAccent}88` : teamGradients[i % teamGradients.length]})` }}
                    >
                      {(m.name || "").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                    </div>
                  )}
                  <p className={cn("text-[16px] font-semibold tracking-tight", teamDark ? "text-white" : "text-gray-900")}>{m.name}</p>
                  <p className={cn("text-[14px] mt-1", teamDark ? "text-gray-400" : "text-gray-500")}>{m.title}</p>
                  {m.bio && <p className={cn("text-[13px] mt-2 leading-relaxed max-w-[200px] mx-auto", teamDark ? "text-gray-500" : "text-gray-400")}>{m.bio}</p>}
                  {(m.social?.twitter || m.social?.linkedin) && (
                    <div className="flex items-center justify-center gap-2 mt-3">
                      {m.social.twitter && (
                        <a href={`https://twitter.com/${m.social.twitter.replace("@", "")}`}
                          className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition hover:opacity-80", teamDark ? "border-gray-700 text-gray-400 hover:border-gray-600" : "border-gray-200 text-gray-500 hover:border-gray-300")}>𝕏</a>
                      )}
                      {m.social.linkedin && (
                        <a href={`https://${m.social.linkedin}`}
                          className={cn("text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition hover:opacity-80", teamDark ? "border-gray-700 text-gray-400 hover:border-gray-600" : "border-gray-200 text-gray-500 hover:border-gray-300")}>in</a>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "logos": {
      const rawLogos = (element.props?.logos as Array<string | { name: string; imageUrl?: string; url?: string }>) || ["Stripe", "Notion", "Figma", "Linear", "Vercel", "GitHub"];
      const logoList = rawLogos.map((l) => typeof l === "string" ? { name: l } : l);
      const logosGrayscale = element.props?.grayscale !== false;
      const logosBgType = (element.props?.bgType as string) || "white";
      const logosDark = logosBgType === "dark";
      const logosBgCls = logosBgType === "dark" ? "bg-gray-950" : logosBgType === "light" ? "bg-gray-50" : "bg-white";
      const logosLabel = (element.props?.label as string) || "Trusted by leading companies worldwide";
      return (
        <div style={s} className={cn("w-full py-14 px-8", logosBgCls)}>
          <p className={cn("text-center text-[11px] font-semibold uppercase tracking-[0.12em] mb-10", logosDark ? "text-gray-500" : "text-gray-400")}>
            {logosLabel}
          </p>
          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {logoList.map((l, i) => (
                l.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={i} src={l.imageUrl} alt={l.name}
                    className={cn("h-7 object-contain", logosGrayscale ? "grayscale opacity-40 hover:opacity-70 transition-opacity duration-200" : "opacity-80 hover:opacity-100 transition-opacity duration-200")}
                  />
                ) : (
                  <div key={i} className={cn("text-[15px] font-bold tracking-[-0.01em] transition-opacity duration-200", logosDark ? "text-gray-500 hover:text-gray-300" : "text-gray-300 hover:text-gray-500")}>
                    {l.name}
                  </div>
                )
              ))}
            </div>
          </div>
        </div>
      );
    }

    case "form":
      return <FormElement element={element} isPreview={isPreview} s={s} />;

    // ── Navigation / Footer ──
    case "navbar":
      return <NavbarElement element={element} isPreview={isPreview} s={s} />;

    case "sidebar":
      return <SidebarElement element={element} isPreview={isPreview} s={s} />;

    case "footer": {
      const footerBgType = (element.props?.bgType as string) || "dark";
      const footerAccent = (element.props?.accentColor as string) || "#6366f1";
      const rawFooterCols = (element.props?.footerColumns as Array<{ title?: string; heading?: string; links: Array<string | { label: string; href: string }> }>) || [];
      const defaultFooterCols = [
        { title: "Product", links: [{ label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Templates", href: "#" }, { label: "Changelog", href: "#" }] },
        { title: "Company", links: [{ label: "About", href: "#" }, { label: "Blog", href: "#" }, { label: "Careers", href: "#" }, { label: "Press", href: "#" }] },
        { title: "Resources", links: [{ label: "Docs", href: "#" }, { label: "Tutorials", href: "#" }, { label: "Support", href: "#" }, { label: "Status", href: "#" }] },
        { title: "Legal", links: [{ label: "Privacy", href: "#" }, { label: "Terms", href: "#" }, { label: "Cookies", href: "#" }, { label: "License", href: "#" }] },
      ];
      const footerCols = rawFooterCols.length > 0 ? rawFooterCols : defaultFooterCols;
      const footerDark = footerBgType === "dark";
      const footerBgCls = footerBgType === "dark" 
        ? "bg-gray-950 text-white shadow-[0_-1px_0_rgba(255,255,255,0.05)]" 
        : footerBgType === "light" 
        ? "bg-gray-50/50 text-gray-900" 
        : "bg-white text-gray-900 shadow-[0_-1px_0_rgba(0,0,0,0.03)]";
      return (
        <div style={s} className={cn("w-full py-20 px-8 border-t border-gray-100", footerBgCls)}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-12 mb-16">
              <div className="col-span-2 md:col-span-1">
                <div className="flex items-center gap-2.5 mb-5">
                  {(element.props?.logoSrc as string) ? (
                    <img
                      src={element.props?.logoSrc as string}
                      alt={(element.props?.brandName as string) || "Logo"}
                      className="h-7 w-auto object-contain shrink-0"
                    />
                  ) : (
                    <div className="h-7 w-7 rounded-lg shrink-0" style={{ background: `linear-gradient(135deg, ${footerAccent}, ${footerAccent}88)` }} />
                  )}
                  <span className="font-bold text-[18px] tracking-tight">{(element.props?.brandName as string) || "Your Brand"}</span>
                </div>
                <p className={cn("text-[14px] leading-relaxed", footerDark ? "text-gray-400" : "text-gray-500")}>
                  Building future-ready experiences with modern design and powerful technology.
                </p>
                <div className="flex items-center gap-3 mt-6">
                  {["𝕏", "in", "fb"].map((social) => (
                    <div key={social} className={cn("h-8 w-8 rounded-full flex items-center justify-center text-[12px] font-bold border cursor-pointer transition-all hover:scale-110", footerDark ? "border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white" : "border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-900")}>
                      {social}
                    </div>
                  ))}
                </div>
              </div>
              <div className="col-span-2 md:col-span-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerCols.map((col, ci) => {
                  const colTitle = col.title || (col as { heading?: string }).heading || "";
                  return (
                    <div key={ci}>
                      <p className="text-[11px] font-bold uppercase tracking-[0.12em] mb-6 text-gray-400">{colTitle}</p>
                      <ul className="space-y-3.5">
                        {(col.links || []).map((link, li) => {
                          const linkLabel = typeof link === "string" ? link : link.label;
                          const linkHref = typeof link === "string" ? "#" : (link.href || "#");
                          return (
                            <li key={li}>
                              <a
                                href={isPreview ? linkHref : undefined}
                                onClick={isPreview ? undefined : (e) => e.preventDefault()}
                                className={cn("text-[15px] cursor-pointer transition-colors duration-200", footerDark ? "text-gray-500 hover:text-white" : "text-gray-500 hover:text-gray-950")}
                              >{linkLabel}</a>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── E-Commerce ──
    case "product-grid": {
      const products = (element.props?.products as Array<{ name: string; price: string; description?: string; imageUrl?: string; badge?: string; rating?: number }>) || [
        { name: "Premium Headphones", price: "$299", description: "Experience studio-quality sound with active noise cancellation." },
        { name: "Wireless Earbuds", price: "$149", description: "Compact design with 24-hour battery life and water resistance." },
        { name: "Smart Speaker", price: "$199", description: "Room-filling sound with integrated voice assistant." },
      ];
      const pgGradients = ["from-blue-100 to-indigo-200", "from-rose-100 to-pink-200", "from-emerald-100 to-teal-200"];
      const pgCols = (element.props?.columns as number) || 3;
      const pgCardStyle = (element.props?.cardStyle as string) || "bordered";
      const pgAccent = (element.props?.accentColor as string) || "#111827";
      const pgBgType = (element.props?.bgType as string) || "white";
      const pgBgCls = pgBgType === "light" ? "bg-gray-50/50" : "bg-white";
      const pgColCls = pgCols === 2 ? "grid-cols-2" : pgCols === 4 ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
      return (
        <div style={s} className={cn("w-full py-24 px-8", pgBgCls)}>
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold tracking-[-0.03em] text-gray-950 mb-4">
                {(element.props?.headline as string) || "Featured Products"}
              </h2>
              <p className="text-lg text-gray-500">{(element.props?.subheadline as string) || "Discover our latest collection of premium gear."}</p>
            </div>
            <div className="grid gap-8" style={{ gridTemplateColumns: `repeat(${pgCols}, 1fr)` }}>
              {products.map((prod, i) => (
                <div key={i} className={cn("group rounded-2xl overflow-hidden transition-all duration-300", pgCardStyle === "minimal" ? "" : "border border-gray-100/80 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_48px_rgba(0,0,0,0.08)]")}>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    {prod.imageUrl ? (
                      <img src={prod.imageUrl} alt={prod.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    ) : (
                      <div className={`h-full w-full bg-gradient-to-br ${pgGradients[i % pgGradients.length]}`} />
                    )}
                    {prod.badge && (
                      <span className="absolute top-4 right-4 text-[10px] font-bold px-3 py-1 rounded-full bg-white shadow-xl text-gray-900 uppercase tracking-wider">{prod.badge}</span>
                    )}
                  </div>
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-2">
                       <p className="font-bold text-[18px] text-gray-950 tracking-tight">{prod.name}</p>
                       <span className="text-[18px] font-black text-gray-950">{prod.price}</span>
                    </div>
                    {prod.description && <p className="text-[14px] text-gray-500 mb-4 line-clamp-2 leading-relaxed">{prod.description}</p>}
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((n) => <span key={n} className="text-sm" style={{ color: n <= (prod.rating || 5) ? "#f59e0b" : "#e5e7eb" }}>★</span>)}
                      </div>
                      <button className="px-5 py-2 rounded-xl text-white text-[13px] font-bold transition-all hover:brightness-110 active:scale-95"
                        style={{ backgroundColor: pgAccent, boxShadow: `0 4px 12px ${pgAccent}40` }}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Timeline ──
    case "timeline": {
      const defaultTlItems = [
        { title: "Company Founded", description: "Design-led software for modern teams.", date: "Jan 2022", icon: "💎" },
        { title: "Successful Launch", description: "Reached #1 on Product Hunt within 2 hours.", date: "Jun 2022", icon: "🚀" },
        { title: "Global Expansion", description: "Opened offices across 12 countries.", date: "Mar 2023", icon: "🌍" },
      ];
      const rawTlItems = (element.props?.items as Array<{ title: string; description: string; date: string; icon?: string }>) || [];
      const tlItems = rawTlItems.length > 0 ? rawTlItems : defaultTlItems;
      const tlAccent = (element.props?.accentColor as string) || "#6366f1";
      const tlBgType = (element.props?.bgType as string) || "white";
      const tlDark = tlBgType === "dark";
      const tlBgCls = tlDark ? "bg-gray-950" : tlBgType === "light" ? "bg-gray-50/50" : "bg-white";
      return (
        <div style={s} className={cn("w-full py-24 px-8", tlBgCls)}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-20">
              <h2 className={cn("text-4xl font-bold tracking-[-0.03em] mb-4", tlDark ? "text-white" : "text-gray-950")}>
                {(element.props?.headline as string) || "The Journey So Far"}
              </h2>
              <p className={cn("text-lg", tlDark ? "text-gray-400" : "text-gray-500")}>{(element.props?.subheadline as string) || "Building the world's best design tools."}</p>
            </div>
            <div className="relative">
              {/* Center line with gradient */}
              <div className="absolute left-1/2 -ms-[1px] top-0 bottom-0 w-[2px]" 
                style={{ background: `linear-gradient(to bottom, transparent, ${tlAccent}40 15%, ${tlAccent}40 85%, transparent)` }} />
              
              <div className="space-y-16">
                {tlItems.map((item, i) => (
                  <div key={i} className={cn("relative flex items-center gap-10 md:gap-20", i % 2 === 0 ? "flex-row" : "flex-row-reverse")}>
                    <div className={cn("w-1/2 hidden md:block", i % 2 === 0 ? "text-right" : "text-left")}>
                      <span className="text-[13px] font-bold uppercase tracking-[0.15em] mb-2 block" style={{ color: tlAccent }}>
                        {item.date}
                      </span>
                      <h3 className={cn("text-xl font-bold mb-3 tracking-tight", tlDark ? "text-white" : "text-gray-950")}>{item.title}</h3>
                      <p className={cn("text-sm leading-[1.65]", tlDark ? "text-gray-400" : "text-gray-500")}>{item.description}</p>
                    </div>
                    {/* Visual dot indicator */}
                    <div className="absolute left-1/2 -ms-[20px] h-10 w-10 rounded-2xl flex items-center justify-center text-lg z-10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] border-white/50 border"
                      style={{ backgroundColor: "white", outline: `4px solid ${tlBgType === "white" ? "#fff" : "transparent"}` }}>
                      <div className="h-6 w-6 rounded-lg flex items-center justify-center text-sm" style={{ backgroundColor: `${tlAccent}12`, color: tlAccent }}>
                        {item.icon || "•"}
                      </div>
                    </div>
                    <div className="flex-1 md:w-1/2 pl-12 md:pl-0">
                      <div className="md:hidden">
                        <span className="text-[12px] font-bold uppercase tracking-widest mb-1 block" style={{ color: tlAccent }}>{item.date}</span>
                        <h3 className={cn("text-lg font-bold mb-1", tlDark ? "text-white" : "text-gray-950")}>{item.title}</h3>
                        <p className={cn("text-sm leading-relaxed", tlDark ? "text-gray-400" : "text-gray-500")}>{item.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── Steps ──
    case "steps": {
      const defaultStepsItems = [
        { number: 1, title: "Create", description: "Design your workspace with our powerful visual editor." },
        { number: 2, title: "Collaborate", description: "Invite your team and iterate in real-time." },
        { number: 3, title: "Deploy", description: "Go live on your custom domain with a single click." },
      ];
      const rawStepsItems = (element.props?.steps as Array<{ number?: number; title: string; description: string }>) || [];
      const stepsItems = rawStepsItems.length > 0 ? rawStepsItems : defaultStepsItems;
      const stepsAccent = (element.props?.accentColor as string) || "#6366f1";
      const stepsLayout = (element.props?.layout as string) || "horizontal";
      const stepsBgType = (element.props?.bgType as string) || "white";
      const stepsDark = stepsBgType === "dark";
      const stepsBgCls = stepsDark ? "bg-gray-950" : stepsBgType === "light" ? "bg-gray-50/50" : "bg-white";
      return (
        <div style={s} className={cn("w-full py-24 md:py-32 px-8 overflow-hidden", stepsBgCls)}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20 md:mb-28 max-w-2xl mx-auto">
              <h2 className={cn("text-4xl md:text-5xl font-bold tracking-[-0.03em] mb-6 leading-tight", stepsDark ? "text-white" : "text-gray-950")}>
                {(element.props?.headline as string) || "Get started in minutes"}
              </h2>
              <p className={cn("text-lg md:text-xl", stepsDark ? "text-gray-400" : "text-gray-500")}>{(element.props?.subheadline as string) || "A simple, streamlined process to go from zero to one with zero friction."}</p>
            </div>
            <div className={cn(stepsLayout === "horizontal" ? "grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16 relative" : "flex flex-col gap-16 max-w-3xl mx-auto relative")}>
              
              {/* Connector Lines */}
              {stepsLayout === "horizontal" ? (
                <div className="absolute top-10 left-[16.666%] w-[66.666%] h-[2px] hidden md:block" 
                  style={{ background: `linear-gradient(90deg, transparent, ${stepsAccent}40 20%, ${stepsAccent}40 80%, transparent)` }} />
              ) : (
                <div className="absolute top-10 bottom-10 left-10 w-[2px] hidden md:block" 
                  style={{ background: `linear-gradient(to bottom, transparent, ${stepsAccent}40 10%, ${stepsAccent}40 90%, transparent)` }} />
              )}

              {stepsItems.map((step, i) => (
                <div key={i} className={cn("relative group", stepsLayout === "vertical" && "flex items-start gap-12")}>
                  <div className={cn("h-20 w-20 rounded-[1.5rem] flex items-center justify-center font-black text-white text-[24px] shrink-0 shadow-lg transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-2 relative z-10", stepsLayout === "horizontal" && "mx-auto mb-8")}
                    style={{ backgroundColor: stepsAccent, boxShadow: `0 12px 32px -8px ${stepsAccent}80` }}>
                    <div className="absolute inset-0 rounded-[1.5rem] ring-2 ring-inset ring-white/20 pointer-events-none" />
                    {step.number ?? i + 1}
                  </div>
                  <div className={cn(stepsLayout === "horizontal" ? "text-center" : "flex-1 pt-2")}>
                    <h3 className={cn("text-2xl font-bold mb-4 tracking-[-0.01em]", stepsDark ? "text-white" : "text-gray-900")}>{step.title}</h3>
                    <p className={cn("text-[16px] leading-[1.7] max-w-sm mx-auto", stepsDark ? "text-gray-400" : "text-gray-500", stepsLayout === "vertical" && "mx-0")}>{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Banner ──
    case "banner": {
      const bannerBgType = (element.props?.bgType as string) || "warning";
      const bannerAccent = (element.props?.accentColor as string) || "#f59e0b";
      const bannerColors: Record<string, { bg: string; text: string; border: string; icon: string }> = {
        warning: { bg: "#FFFBEB", text: "#92400E", border: "#FEF3C7", icon: "✨" },
        info: { bg: "#EFF6FF", text: "#1E40AF", border: "#DBEAFE", icon: "ℹ️" },
        success: { bg: "#F0FDF4", text: "#166534", border: "#DCFCE7", icon: "✓" },
        error: { bg: "#FEF2F2", text: "#991B1B", border: "#FEE2E2", icon: "✕" },
        brand: { bg: `${bannerAccent}08`, text: bannerAccent, border: `${bannerAccent}15`, icon: "📢" },
      };
      const bStyle = bannerColors[bannerBgType] || bannerColors.warning;
      return (
        <div style={{ backgroundColor: bStyle.bg, borderColor: bStyle.border, ...s }} className="w-full px-6 py-2.5 border-b flex items-center justify-center gap-6 animate-fade-in relative">
          <div className="flex items-center gap-3">
            <span className="text-[12px] flex items-center justify-center h-5 w-5 rounded-full bg-white/50 font-bold border border-current/10" style={{ color: bStyle.text }}>{bStyle.icon}</span>
            <p className="text-[13px] font-semibold tracking-tight" style={{ color: bStyle.text }}>
              {(element.props?.message as string) || "New product updates available. Check the latest features."}
            </p>
          </div>
          {(element.props?.ctaText as string) && (
            <a href={(element.props?.ctaUrl as string) || "#"} className="text-[13px] font-bold underline decoration-2 underline-offset-2 hover:opacity-70 transition-opacity" style={{ color: bStyle.text }}>
              {element.props?.ctaText as string}
            </a>
          )}
          {element.props?.closeable !== false && (
            <button className="absolute right-4 h-6 w-6 rounded-lg flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: bStyle.text }}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      );
    }

    // ── Hero Split ──
    case "hero-split": {
      const hsBgType = (element.props?.bgType as string) || "light";
      const hsAccent = (element.props?.accentColor as string) || "#6366f1";
      const hsLayout = (element.props?.layout as string) || "image-right";
      const hsDark = hsBgType === "dark";
      const hsBgCls = hsDark ? "bg-gray-950" : hsBgType === "white" ? "bg-white" : "bg-gray-50/50";
      const hsTextCls = hsDark ? "text-white" : "text-gray-950";
      const hsSubCls = hsDark ? "text-gray-400" : "text-gray-500";
      const textCol = (
        <div className="flex flex-col justify-center gap-8 z-10 relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold tracking-tight w-fit border backdrop-blur-md" 
            style={{ backgroundColor: `${hsAccent}12`, color: hsAccent, borderColor: `${hsAccent}30` }}>
            <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: hsAccent }} />
            {(element.props?.badge as string) || "Featured Edition"}
          </div>
          <h1 className={cn("text-5xl md:text-[4rem] lg:text-[4.5rem] font-extrabold leading-[1.05] tracking-[-0.04em] text-balance", hsTextCls)}>
            {(element.props?.headline as string) || "The fastest way to build stunning products"}
          </h1>
          <p className={cn("text-lg md:text-xl leading-[1.6] opacity-90 text-pretty max-w-2xl", hsSubCls)}>
            {(element.props?.subheadline as string) || "Connect with your audience using a platform built for high-performance teams and creative professionals."}
          </p>
          <div className="flex gap-4 flex-wrap pt-4">
            <button className="px-8 py-4 rounded-xl font-bold text-white text-[15px] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl" 
              style={{ backgroundColor: hsAccent, boxShadow: `0 12px 32px -4px ${hsAccent}60` }}>
              {(element.props?.ctaText as string) || "Get Started Free"}
            </button>
            <button className={cn("px-8 py-4 rounded-xl font-bold text-[15px] border transition-all hover:-translate-y-0.5", hsDark ? "border-gray-800 bg-gray-900/50 text-white hover:bg-gray-800 hover:border-gray-700 shadow-lg" : "border-gray-200 bg-white shadow-sm text-gray-950 hover:bg-gray-50 hover:shadow-md")}>
              {(element.props?.ctaSecondaryText as string) || "Watch Demo"}
            </button>
          </div>
        </div>
      );
      const imageCol = (
        <div className="relative group perspective-1000 w-full">
          <div className="absolute -inset-4 bg-gradient-to-tr from-accent-50/20 to-accent-50/0 rounded-[3rem] blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-700" style={{ color: hsAccent }} />
          <div className={cn("relative rounded-[24px] overflow-hidden shadow-[0_32px_80px_-16px_rgba(0,0,0,0.15)] md:aspect-[4/3] flex items-center justify-center border animate-float", hsDark ? "border-gray-800 bg-gray-900/50 backdrop-blur-sm" : "border-gray-200/50 bg-white backdrop-blur-sm")}>
            {(element.props?.imageUrl as string) ? (
              <img src={element.props?.imageUrl as string} alt="" className="w-full h-full object-cover rounded-[24px]" />
            ) : (
              <div className="text-center p-12">
                <div className="text-6xl mb-4 grayscale opacity-20 drop-shadow-xl hover:scale-110 transition-transform">📸</div>
                <p className="text-sm font-bold uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-opacity" style={{ color: hsAccent }}>Interface Preview</p>
              </div>
            )}
            <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>
      );
      return (
        <div style={s} className={cn("w-full py-24 md:py-32 px-8 overflow-hidden relative", hsBgCls)}>
          {hsDark && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950 opacity-80" />}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
            {hsLayout === "image-left" ? <>{imageCol}{textCol}</> : <>{textCol}{imageCol}</>}
          </div>
        </div>
      );
    }

    // ── Pricing Card (single card) ──
    case "pricing-card": {
      const pcAccent = (element.props?.accentColor as string) || "#6366f1";
      const pcHighlighted = element.props?.isHighlighted === true;
      const rawPcFeatures = element.props?.features;
      const pcFeatures: string[] = typeof rawPcFeatures === "string"
        ? rawPcFeatures.split("\n").map((f: string) => f.trim()).filter(Boolean)
        : Array.isArray(rawPcFeatures)
          ? (rawPcFeatures as string[])
          : ["Advanced automation", "Unlimited team members", "API access & webhooks", "24/7 Priority support"];
      const pcBgType = (element.props?.bgType as string) || "white";
      const pcDark = pcBgType === "dark";
      return (
        <div style={s} className="mx-8 my-4 w-full md:w-auto relative group z-10">
          <div className={cn("rounded-3xl p-10 relative transition-all duration-300 w-full sm:w-[380px]", pcHighlighted ? "text-white shadow-2xl scale-[1.02] border border-white/20" : pcDark ? "bg-gray-950 border border-gray-800" : "bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] backdrop-blur-xl")}
            style={pcHighlighted ? { background: `linear-gradient(145deg, ${pcAccent} 0%, ${pcAccent}dd 100%)`, boxShadow: `0 32px 80px -12px ${pcAccent}60` } : {}}>
            
            {pcHighlighted && (
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-50 pointer-events-none" />
            )}

            {pcHighlighted && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 text-[10px] font-black uppercase tracking-[0.2em] px-5 py-1.5 rounded-full bg-white text-gray-950 shadow-2xl border border-gray-100">
                Most Popular
              </div>
            )}
            <p className={cn("text-[13px] font-bold uppercase tracking-[0.1em] mb-4 opacity-80", pcHighlighted ? "text-white" : pcDark ? "text-gray-400" : "text-gray-500")}>
              {(element.props?.planName as string) || "Enterprise"}
            </p>
            <div className="flex items-baseline gap-1.5 mb-2">
              <span className={cn("text-[3.5rem] font-bold tracking-tight leading-none", pcHighlighted || pcDark ? "text-white" : "text-gray-950")}>
                {(element.props?.price as string) || "$99"}
              </span>
              <span className={cn("text-[16px] font-medium opacity-60", pcHighlighted ? "text-white" : "text-gray-500")}>
                {(element.props?.period as string) || "/mo"}
              </span>
            </div>
            <p className={cn("text-[14px] mb-10 leading-relaxed font-medium", pcHighlighted ? "text-white/80" : pcDark ? "text-gray-400" : "text-gray-500")}>
              {(element.props?.description as string) || "Powering the world's most innovative organizations with enterprise-grade security."}
            </p>
            <div className={cn("h-px w-full mb-8", pcHighlighted ? "bg-white/20" : pcDark ? "bg-gray-800" : "bg-gray-100")} />
            
            <ul className="space-y-4 mb-10 min-h-[220px]">
              {pcFeatures.map((f, i) => (
                <li key={i} className={cn("flex items-start gap-4 text-[15px] font-medium leading-normal", pcHighlighted ? "text-white" : pcDark ? "text-gray-300" : "text-gray-700")}>
                  <div className="h-5 w-5 rounded-full flex items-center justify-center text-[10px] shrink-0 border mt-0.5"
                    style={{ backgroundColor: pcHighlighted ? "rgba(255,255,255,0.15)" : `${pcAccent}08`, borderColor: pcHighlighted ? "rgba(255,255,255,0.2)" : `${pcAccent}15`, color: pcHighlighted ? "white" : pcAccent }}>✓</div>
                  {f}
                </li>
              ))}
            </ul>
            <button className={cn("w-full py-4 rounded-xl text-[15px] font-bold transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg", pcHighlighted ? "bg-white hover:bg-gray-50" : "hover:brightness-110")}
              style={pcHighlighted ? { color: pcAccent } : { backgroundColor: pcAccent, color: "white", boxShadow: `0 8px 24px -6px ${pcAccent}60` }}>
              {(element.props?.ctaText as string) || "Select Plan"}
            </button>
          </div>
        </div>
      );
    }

    // ── Feature Highlight (large single-feature spotlight) ──
    case "feature-highlight": {
      const fhAccent = (element.props?.accentColor as string) || "#6366f1";
      const fhBgType = (element.props?.bgType as string) || "white";
      const fhLayout = (element.props?.layout as string) || "image-right";
      const fhDark = fhBgType === "dark";
      const fhBgCls = fhDark ? "bg-gray-950" : fhBgType === "light" ? "bg-gray-50/50" : "bg-white";
      const rawFhFeatures = element.props?.features;
      const fhFeatures: string[] = Array.isArray(rawFhFeatures)
        ? (rawFhFeatures as Array<string | { text: string }>).map((f) => typeof f === "string" ? f : f.text)
        : ["Real-time collaborative editing", "Global edge infrastructure", "Zero-config deployments", "Bank-grade security standards"];
      const textCol = (
        <div className="flex flex-col justify-center gap-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold tracking-tight w-fit border shadow-sm backdrop-blur-md" 
            style={{ backgroundColor: `${fhAccent}0A`, color: fhAccent, borderColor: `${fhAccent}30` }}>
            <span className="flex h-2 w-2 rounded-full" style={{ backgroundColor: fhAccent }} />
            {(element.props?.label as string) || "The Core Power"}
          </div>
          <h2 className={cn("text-4xl md:text-[3.25rem] md:leading-[1.1] font-extrabold tracking-[-0.03em] text-balance", fhDark ? "text-white" : "text-gray-950")}>
            {(element.props?.headline as string) || "Everything you need, nothing you don't"}
          </h2>
          <p className={cn("text-[17px] md:text-xl leading-[1.65] text-pretty max-w-xl", fhDark ? "text-gray-400" : "text-gray-500")}>
            {(element.props?.description as string) || "A streamlined, powerful feature set built for modern teams who care about quality, speed, and exceptional craft."}
          </p>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-8 mt-2">
            {fhFeatures.map((f, i) => (
              <li key={i} className={cn("flex items-start gap-3.5 text-[15px] font-medium", fhDark ? "text-gray-300" : "text-gray-700")}>
                <div className="h-6 w-6 rounded-lg flex items-center justify-center shrink-0 border mt-0.5" style={{ backgroundColor: `${fhAccent}12`, borderColor: `${fhAccent}20`, color: fhAccent }}>
                  <Check className="h-3.5 w-3.5" />
                </div>
                {f}
              </li>
            ))}
          </ul>
          {(element.props?.ctaText as string) && (
            <button className="w-fit px-8 py-4 rounded-xl font-bold text-[15px] text-white transition-all hover:-translate-y-0.5 shadow-xl mt-6 hover:shadow-2xl" 
              style={{ backgroundColor: fhAccent, boxShadow: `0 12px 32px -4px ${fhAccent}60` }}>
              {element.props?.ctaText as string}
            </button>
          )}
        </div>
      );
      const imageCol = (
        <div className="relative group perspective-1000 w-full mt-8 lg:mt-0">
          <div className="absolute -inset-1 bg-gradient-to-tr from-accent-50/20 to-accent-50/0 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700" style={{ color: fhAccent }} />
          <div className={cn("relative rounded-[24px] overflow-hidden shadow-[0_24px_60px_-12px_rgba(0,0,0,0.1)] aspect-video md:aspect-[4/3] border animate-float", fhDark ? "border-gray-800 bg-gray-900/40 backdrop-blur-xl" : "border-gray-200/60 bg-white backdrop-blur-xl")}
            style={{ background: fhDark ? `radial-gradient(circle at top right, ${fhAccent}15, transparent 50%), rgba(17,24,39,0.8)` : `radial-gradient(circle at top right, ${fhAccent}0A, transparent 50%), rgba(255,255,255,0.9)` }}>
            {(element.props?.imageUrl as string) ? (
              <img src={element.props?.imageUrl as string} alt="" className="w-full h-full object-cover rounded-[24px] transition-transform duration-700 group-hover:scale-[1.03]" />
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-40">
                <div className="text-7xl mb-6 drop-shadow-2xl hover:scale-110 transition-transform">✨</div>
                <p className="text-xs font-black uppercase tracking-[0.2em]" style={{ color: fhAccent }}>Module Visual</p>
              </div>
            )}
            <div className="absolute inset-0 rounded-[24px] ring-1 ring-inset ring-white/10 pointer-events-none" />
          </div>
        </div>
      );
      return (
        <div style={s} className={cn("w-full py-24 md:py-32 px-8 relative overflow-hidden", fhBgCls)}>
          {fhDark && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-gray-950 opacity-90" />}
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">
            {fhLayout === "image-left" ? <>{imageCol}{textCol}</> : <>{textCol}{imageCol}</>}
          </div>
        </div>
      );
    }

    // ── Image Gallery ──
    case "image-gallery": {
      const igImages = (element.props?.images as Array<{ src: string; alt?: string }>) || [];
      const igColumns = (element.props?.columns as number) || 3;
      const igStyle = (element.props?.style as string) || "grid";
      const igGapRaw = element.props?.gap;
      const igGapMap: Record<string, string> = { sm: "8px", md: "16px", lg: "24px" };
      const igGap = typeof igGapRaw === "string" ? (igGapMap[igGapRaw] || "16px") : typeof igGapRaw === "number" ? `${igGapRaw * 4}px` : "16px";
      const igColCls = igColumns === 2 ? "grid-cols-2" : igColumns === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-2 md:grid-cols-3";
      const placeholders = ["from-pink-200 to-rose-300", "from-sky-200 to-blue-300", "from-emerald-200 to-teal-300", "from-amber-200 to-orange-300", "from-violet-200 to-purple-300", "from-cyan-200 to-teal-300"];
      return (
        <div style={s} className="w-full px-8 py-8">
          <div className={cn("grid", igColCls)} style={{ gap: igGap }}>
            {igImages.length > 0
              ? igImages.map((img, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <div key={i} className={cn("overflow-hidden", igStyle === "masonry" ? "" : "aspect-square", "rounded-xl")}>
                  <img src={img.src} alt={img.alt || ""} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>
              ))
              : Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={cn("aspect-square rounded-xl bg-gradient-to-br", placeholders[i % placeholders.length])} />
              ))
            }
          </div>
        </div>
      );
    }

    // ── Video Embed ──
    case "video-embed": {
      const veAccent = (element.props?.accentColor as string) || "#6366f1";
      const veAspect = (element.props?.aspectRatio as string) || "16/9";
      const veProvider = (element.props?.provider as string) || "youtube";
      const vePoster = element.props?.poster as string;
      const veCaption = element.props?.caption as string;
      return (
        <div style={s} className="w-full px-8 py-6">
          <div className="w-full rounded-2xl overflow-hidden shadow-xl" style={{ aspectRatio: veAspect, background: "#0f0f0f", position: "relative" }}>
            {vePoster ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={vePoster} alt="Video thumbnail" className="w-full h-full object-cover" />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center" style={{ background: "linear-gradient(135deg, #111 0%, #1a1a2e 100%)" }}>
                <div className="text-center text-white/30">
                  <p className="text-sm font-semibold uppercase tracking-widest">{veProvider}</p>
                </div>
              </div>
            )}
            {/* Play button overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-16 w-16 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-sm" style={{ backgroundColor: `${veAccent}dd` }}>
                <span className="text-white text-2xl ml-1">▶</span>
              </div>
            </div>
          </div>
          {veCaption && <p className="text-xs text-gray-400 text-center mt-2">{veCaption}</p>}
        </div>
      );
    }

    // ── Profile Card ──
    case "profile-card": {
      const prAccent = (element.props?.accentColor as string) || "#6366f1";
      const prName = (element.props?.name as string) || "Alex Johnson";
      const prRole = (element.props?.role as string) || "Lead Designer";
      const prBio = (element.props?.bio as string) || "Passionate about creating beautiful, user-centered experiences that delight and inspire.";
      const prAvatar = element.props?.avatarUrl as string;
      const prSocial = (element.props?.social as Record<string, string>) || {};
      return (
        <div style={s} className="mx-8 my-4 max-w-sm">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md overflow-hidden">
            {/* Top accent bar */}
            <div className="h-24 w-full relative" style={{ background: `linear-gradient(135deg, ${prAccent} 0%, ${prAccent}88 100%)` }}>
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                {prAvatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={prAvatar} alt={prName} className="h-20 w-20 rounded-full border-4 border-white object-cover shadow-lg" />
                ) : (
                  <div className="h-20 w-20 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold text-white shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${prAccent}cc, ${prAccent}88)` }}>
                    {prName.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                  </div>
                )}
              </div>
            </div>
            <div className="pt-14 pb-6 px-6 text-center">
              <h3 className="font-bold text-gray-900 text-lg">{prName}</h3>
              <p className="text-sm font-medium mt-0.5" style={{ color: prAccent }}>{prRole}</p>
              <p className="text-sm text-gray-500 mt-3 leading-relaxed">{prBio}</p>
              {Object.keys(prSocial).length > 0 && (
                <div className="flex items-center justify-center gap-3 mt-4">
                  {Object.entries(prSocial).map(([platform, url]) => (
                    <a key={platform} href={url as string} className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border transition hover:scale-110"
                      style={{ borderColor: `${prAccent}30`, color: prAccent }}>
                      {platform[0].toUpperCase()}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Comparison Table ──
    case "comparison-table": {
      const rawCtCols = element.props?.columns;
      const defaultCtColumns = ["Starter", "Pro", "Business"];
      const ctColumnLabels: string[] = Array.isArray(rawCtCols)
        ? (rawCtCols as Array<string | { label: string }>).map((c) => typeof c === "string" ? c : c.label)
        : defaultCtColumns;
      const rawCtRows = element.props?.rows;
      const defaultCtRows = [
        { feature: "Websites", values: "2, 10, Unlimited" },
        { feature: "Storage", values: "1 GB, 20 GB, 100 GB" },
        { feature: "Custom Domain", values: "—, ✓, ✓" },
        { feature: "AI Credits", values: "—, 500/mo, 2,000/mo" },
        { feature: "Code Export", values: "—, ✓, ✓" },
        { feature: "Team Members", values: "1, 5, Unlimited" },
      ];
      const ctRows: Array<{ feature: string; values: string[] }> = Array.isArray(rawCtRows) && (rawCtRows as unknown[]).length > 0
        ? (rawCtRows as Array<{ feature: string; values: string | string[] }>).map((r) => ({
          feature: r.feature,
          values: typeof r.values === "string" ? r.values.split(",").map((v: string) => v.trim()) : r.values,
        }))
        : defaultCtRows.map((r) => ({ feature: r.feature, values: (typeof r.values === "string" ? r.values : "").split(",").map((v) => v.trim()) }));
      const ctAccent = (element.props?.accentColor as string) || "#6366f1";
      const ctBgType = (element.props?.bgType as string) || "white";
      const ctDark = ctBgType === "dark";
      const ctBgCls = ctDark ? "bg-gray-900" : "bg-white";
      const ctHeaderCols = ["Feature", ...ctColumnLabels];
      return (
        <div style={s} className={cn("w-full py-16 px-8", ctBgCls)}>
          <div className="max-w-4xl mx-auto">
            {(element.props?.headline as string) && (
              <h2 className={cn("text-3xl font-bold text-center mb-10", ctDark ? "text-white" : "text-gray-900")}>{element.props?.headline as string}</h2>
            )}
            <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: ctDark ? "#374151" : "#e5e7eb" }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: ctDark ? "#1f2937" : `${ctAccent}08` }}>
                    {ctHeaderCols.map((col, i) => (
                      <th key={i} className={cn("px-5 py-4 text-left font-semibold", ctDark ? "text-white" : "text-gray-900", i > 0 && "text-center")}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ctRows.map((row, i) => (
                    <tr key={i} className={ctDark ? "border-t border-gray-700" : "border-t border-gray-100"}>
                      <td className={cn("px-5 py-3.5 font-medium", ctDark ? "text-gray-300" : "text-gray-700")}>{row.feature}</td>
                      {row.values.map((val, j) => (
                        <td key={j} className="px-5 py-3.5 text-center">
                          <span className={ctDark ? "text-gray-300" : "text-gray-600"}>{val}</span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
    }

    // ── Before / After ──
    case "before-after": {
      const baAccent = (element.props?.accentColor as string) || "#6366f1";
      const baBeforeLabel = (element.props?.beforeLabel as string) || "Before";
      const baAfterLabel = (element.props?.afterLabel as string) || "After";
      const rawBefore = element.props?.beforeItems;
      const rawAfter = element.props?.afterItems;
      const baBeforeItems: string[] = Array.isArray(rawBefore)
        ? (rawBefore as Array<string | { text: string }>).map((i) => typeof i === "string" ? i : i.text)
        : ["Manual processes", "Scattered data", "Slow iteration", "High costs"];
      const baAfterItems: string[] = Array.isArray(rawAfter)
        ? (rawAfter as Array<string | { text: string }>).map((i) => typeof i === "string" ? i : i.text)
        : ["Automated workflows", "Unified dashboard", "Ship 10x faster", "Reduced costs by 40%"];
      return (
        <div style={s} className="w-full py-16 px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            {(element.props?.headline as string) && (
              <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">{element.props?.headline as string}</h2>
            )}
            <div className="grid grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-gray-200 shadow-lg">
              {/* Before */}
              <div className="bg-gray-50 p-7 border-r border-gray-200">
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-7 w-7 rounded-full bg-gray-300 flex items-center justify-center"><X className="h-4 w-4 text-white" /></div>
                  <span className="font-bold text-gray-600 uppercase text-xs tracking-widest">{baBeforeLabel}</span>
                </div>
                <ul className="space-y-3">
                  {baBeforeItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className="h-1.5 w-1.5 rounded-full bg-gray-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              {/* After */}
              <div className="p-7" style={{ backgroundColor: `${baAccent}05` }}>
                <div className="flex items-center gap-2 mb-5">
                  <div className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: baAccent }}>✓</div>
                  <span className="font-bold uppercase text-xs tracking-widest" style={{ color: baAccent }}>{baAfterLabel}</span>
                </div>
                <ul className="space-y-3">
                  {baAfterItems.map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
                      <span className="h-1.5 w-1.5 rounded-full shrink-0" style={{ backgroundColor: baAccent }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // ── Metric Card ──
    case "metric-card": {
      const mcAccent = (element.props?.accentColor as string) || "#6366f1";
      const mcValue = (element.props?.value as string) || "24.5K";
      const mcLabel = (element.props?.label as string) || "Monthly Active Users";
      const mcChange = (element.props?.change as string) || "+12.3%";
      const mcTrend = (element.props?.trend as string) || "up";
      const trendColor = mcTrend === "up" ? "#10b981" : mcTrend === "down" ? "#ef4444" : "#6b7280";
      const trendIcon = mcTrend === "up" ? "↑" : mcTrend === "down" ? "↓" : "→";
      // Sparkline placeholder dots
      const sparklineHeights = [40, 55, 45, 70, 60, 80, 75, 90];
      return (
        <div style={s} className="mx-8 my-4 max-w-xs">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-md p-6">
            <div className="flex items-start justify-between mb-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{mcLabel}</p>
              <div className="h-8 w-8 rounded-xl flex items-center justify-center text-sm" style={{ backgroundColor: `${mcAccent}15` }}>📈</div>
            </div>
            <p className="text-4xl font-black text-gray-900 mb-1">{mcValue}</p>
            <div className="flex items-center gap-1.5 mb-5">
              <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${trendColor}15`, color: trendColor }}>
                {trendIcon} {mcChange}
              </span>
              <span className="text-xs text-gray-400">vs last month</span>
            </div>
            {/* Sparkline */}
            <div className="flex items-end gap-1 h-10">
              {sparklineHeights.map((h, i) => (
                <div key={i} className="flex-1 rounded-sm transition-all" style={{ height: `${h}%`, backgroundColor: i === sparklineHeights.length - 1 ? mcAccent : `${mcAccent}40` }} />
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── CTA Banner (inline strip) ──
    case "cta-banner": {
      const cbAccent = (element.props?.accentColor as string) || "#6366f1";
      const cbBgType = (element.props?.bgType as string) || "branded";
      const cbLayout = (element.props?.layout as string) || "split";
      const cbDark = cbBgType === "dark";
      const cbBgCls = cbDark ? "bg-gray-900" : "";
      const cbContainerStyle: React.CSSProperties = { ...s, ...(cbBgType === "branded" ? { background: `linear-gradient(90deg, ${cbAccent} 0%, ${cbAccent}cc 100%)` } : {}) };
      return (
        <div style={cbContainerStyle} className={cn("w-full py-5 px-8", cbBgCls)}>
          <div className={cn("max-w-4xl mx-auto flex items-center", cbLayout === "split" ? "justify-between gap-6" : "flex-col text-center gap-4")}>
            <div>
              <h3 className={cn("font-bold text-lg", cbDark || cbBgType === "branded" ? "text-white" : "text-gray-900")}>
                {(element.props?.headline as string) || "Ready to transform your workflow?"}
              </h3>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button className={cn("px-5 py-2.5 rounded-xl text-sm font-bold transition hover:opacity-90")}
                style={cbBgType === "branded" ? { backgroundColor: "white", color: cbAccent } : { backgroundColor: cbAccent, color: "white" }}>
                {(element.props?.ctaText as string) || "Get Started"}
              </button>
              {(element.props?.secondaryCtaText as string) && (
                <button className={cn("px-5 py-2.5 rounded-xl text-sm font-medium border transition", cbBgType === "branded" ? "border-white/30 text-white hover:bg-white/10" : cbDark ? "border-gray-600 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50")}>
                  {element.props?.secondaryCtaText as string}
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Nav Announcement ──
    case "nav-announcement": {
      const naAccent = (element.props?.accentColor as string) || "#6366f1";
      const naBgType = (element.props?.bgType as string) || "info";
      const naBgColors: Record<string, string> = {
        info: "#eff6ff",
        warning: "#fffbeb",
        success: "#f0fdf4",
        brand: `${naAccent}15`,
      };
      const naTextColors: Record<string, string> = {
        info: "#1e40af",
        warning: "#92400e",
        success: "#166534",
        brand: naAccent,
      };
      const naBg = naBgColors[naBgType] || naBgColors.info;
      const naText = naTextColors[naBgType] || naTextColors.info;
      return (
        <div style={{ backgroundColor: naBg, ...s }} className="w-full py-2 px-6 flex items-center justify-center gap-3">
          <span className="text-sm font-medium text-center" style={{ color: naText }}>
            {(element.props?.message as string) || "🎉 New feature just launched! Check it out →"}
          </span>
          {(element.props?.ctaText as string) && (
            <a
              href={isPreview ? ((element.props?.ctaHref as string) || "#") : undefined}
              onClick={isPreview ? undefined : (e) => e.preventDefault()}
              className="text-sm font-bold underline shrink-0"
              style={{ color: naText }}
            >
              {element.props?.ctaText as string}
            </a>
          )}
          {element.props?.closeable !== false && (
            <button className="h-5 w-5 rounded flex items-center justify-center ml-2 opacity-60 hover:opacity-100 transition shrink-0" style={{ color: naText }}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      );
    }

    // ── Cookie Banner ──
    case "cookie-banner": {
      const ckAccent = (element.props?.accentColor as string) || "#6366f1";
      const ckBgType = (element.props?.bgType as string) || "dark";
      const ckPosition = (element.props?.position as string) || "bottom";
      const ckDark = ckBgType === "dark";
      const ckBgCls = ckDark ? "bg-gray-900" : "bg-white border border-gray-200";
      return (
        <div style={s} className={cn("w-full px-6 py-4", ckBgCls)}>
          <div className="max-w-4xl mx-auto flex items-center gap-6 flex-wrap md:flex-nowrap">
            <div className="flex items-start gap-3 flex-1">
              <span className="text-2xl shrink-0">🍪</span>
              <p className={cn("text-sm leading-relaxed", ckDark ? "text-gray-300" : "text-gray-600")}>
                {(element.props?.message as string) || "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies."}
                {" "}<a href={isPreview ? ((element.props?.privacyUrl as string) || "#") : undefined} onClick={isPreview ? undefined : (e) => e.preventDefault()} className="underline text-xs" style={{ color: ckAccent }}>Learn more</a>
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button className={cn("px-4 py-2 rounded-lg text-sm font-medium border transition", ckDark ? "border-gray-600 text-gray-400 hover:bg-gray-800" : "border-gray-200 text-gray-500 hover:bg-gray-50")}>
                {(element.props?.declineText as string) || "Decline"}
              </button>
              <button className="px-4 py-2 rounded-lg text-sm font-bold text-white transition hover:opacity-90" style={{ backgroundColor: ckAccent }}>
                {(element.props?.acceptText as string) || "Accept All"}
              </button>
            </div>
          </div>
        </div>
      );
    }

    // ── Layout: Flex Row / Flex Col ──
    case "flex-row":
    case "flex-col": {
      const isRow = element.type === "flex-row";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <SectionContentZone
            parentId={element.id}
            children={element.children || []}
            direction={isRow ? "row" : "column"}
            parentProps={element.props}
          />
        </div>
      );
    }

    // ── Typography: Blockquote ──
    case "blockquote": {
      const bqAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "py-2 px-3" : "px-8 py-4")}>
          <blockquote className="border-l-4 pl-4 py-1" style={{ borderColor: bqAccent }}>
            <p className="text-gray-700 italic text-sm leading-relaxed">{element.content || (element.props?.text as string) || "An inspiring quote goes here."}</p>
            {(element.props?.cite as string) && <cite className="text-xs text-gray-400 not-italic mt-1 block">— {element.props?.cite as string}</cite>}
          </blockquote>
        </div>
      );
    }

    // ── Typography: Code Block ──
    case "code-block": {
      const cbLang = (element.props?.language as string) || "javascript";
      return (
        <div style={s} className={cn("w-full", isNested ? "py-2 px-3" : "px-8 py-4")}>
          <div className="rounded-xl bg-gray-900 overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-2 bg-gray-800">
              <div className="h-3 w-3 rounded-full bg-red-500/70" />
              <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
              <div className="h-3 w-3 rounded-full bg-green-500/70" />
              <span className="ml-2 text-[10px] text-gray-500 font-mono">{cbLang}</span>
            </div>
            <pre className="p-4 text-xs text-green-400 font-mono overflow-x-auto leading-relaxed">
              <code>{element.content || (element.props?.code as string) || `// Your ${cbLang} code here\nconsole.log("Hello, World!");`}</code>
            </pre>
          </div>
        </div>
      );
    }

    // ── Typography: Eyebrow ──
    case "eyebrow": {
      const ewAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "py-1 px-3" : "px-8 py-2")}>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: ewAccent }}>
            {element.content || "Eyebrow Label"}
          </span>
        </div>
      );
    }

    // ── Typography: Alert ──
    case "alert": {
      const alType = (element.props?.alertType as string) || "info";
      const alColors: Record<string, { bg: string; border: string; text: string; icon: string }> = {
        info: { bg: "#eff6ff", border: "#93c5fd", text: "#1e40af", icon: "ℹ️" },
        success: { bg: "#f0fdf4", border: "#86efac", text: "#166534", icon: "✅" },
        warning: { bg: "#fffbeb", border: "#fcd34d", text: "#92400e", icon: "⚠️" },
        error: { bg: "#fef2f2", border: "#fca5a5", text: "#991b1b", icon: "❌" },
      };
      const alStyle = alColors[alType] || alColors.info;
      return (
        <div style={s} className={cn("w-full", isNested ? "py-2 px-3" : "px-8 py-3")}>
          <div className="flex items-start gap-3 rounded-xl border p-4" style={{ backgroundColor: alStyle.bg, borderColor: alStyle.border }}>
            <span className="text-base shrink-0">{alStyle.icon}</span>
            <div className="flex-1">
              {(element.props?.title as string) && <p className="text-sm font-semibold mb-0.5" style={{ color: alStyle.text }}>{element.props?.title as string}</p>}
              <p className="text-sm leading-relaxed" style={{ color: alStyle.text }}>{element.content || (element.props?.message as string) || "This is an informational alert message."}</p>
            </div>
          </div>
        </div>
      );
    }

    // ── Typography: Kbd ──
    case "kbd":
      return (
        <div style={s} className={cn("w-full", isNested ? "py-1 px-3" : "px-8 py-2")}>
          <kbd className="inline-flex items-center gap-1 px-2 py-1 rounded-md border border-gray-300 bg-gray-100 text-xs font-mono font-semibold text-gray-700 shadow-sm">
            {element.content || "⌘ K"}
          </kbd>
        </div>
      );

    // ── Typography: Number Display ──
    case "number-display": {
      const ndAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "py-2 px-3" : "px-8 py-4")}>
          <div className="text-center">
            <span className="text-5xl font-black" style={{ color: ndAccent }}>{element.content || (element.props?.value as string) || "10K+"}</span>
            {(element.props?.label as string) && <p className="text-sm text-gray-500 mt-1">{element.props?.label as string}</p>}
          </div>
        </div>
      );
    }

    // ── Typography: Text Link ──
    case "text-link":
      return <TextLinkElement element={element} isNested={isNested} isPreview={isPreview} s={s} />;

    // ── Media: Embed ──
    case "embed": {
      const embedUrl = (element.props?.url as string) || "";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="w-full rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden" style={{ aspectRatio: "16/9" }}>
            {embedUrl ? (
              <iframe src={embedUrl} className="w-full h-full" frameBorder="0" allowFullScreen title="Embed" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-gray-400">
                <span className="text-3xl">📎</span>
                <p className="text-xs font-medium">Embed — paste URL in props</p>
              </div>
            )}
          </div>
        </div>
      );
    }

    // ── Media: Audio ──
    case "audio":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-lg shrink-0">♪</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">{element.content || (element.props?.title as string) || "Audio Track"}</p>
              <div className="mt-2 h-1.5 rounded-full bg-gray-200 w-full overflow-hidden">
                <div className="h-full w-1/3 rounded-full bg-indigo-400" />
              </div>
            </div>
            <span className="text-xs text-gray-400 shrink-0">0:00</span>
          </div>
        </div>
      );

    // ── Media: Avatar ──
    case "avatar": {
      const avSrc = element.props?.src as string;
      const avName = (element.props?.name as string) || element.content || "User";
      const avSize = (element.props?.size as string) || "md";
      const avSizeCls = avSize === "sm" ? "h-8 w-8 text-sm" : avSize === "lg" ? "h-16 w-16 text-2xl" : "h-12 w-12 text-lg";
      const avAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="flex items-center gap-3">
            {avSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avSrc} alt={avName} className={cn("rounded-full object-cover", avSizeCls)} />
            ) : (
              <div className={cn("rounded-full flex items-center justify-center font-bold text-white", avSizeCls)} style={{ backgroundColor: avAccent }}>
                {avName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            )}
            {(element.props?.showName !== false) && <span className="text-sm font-medium text-gray-700">{avName}</span>}
          </div>
        </div>
      );
    }

    // ── Media: Avatar Group ──
    case "avatar-group": {
      const agAccent = (element.props?.accentColor as string) || "#6366f1";
      const agCount = (element.props?.count as number) || 5;
      const agColors = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="flex items-center">
            <div className="flex -space-x-3">
              {Array.from({ length: Math.min(agCount, 5) }).map((_, i) => (
                <div key={i} className="h-10 w-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: agColors[i % agColors.length] }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
              {agCount > 5 && (
                <div className="h-10 w-10 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                  +{agCount - 5}
                </div>
              )}
            </div>
            {(element.props?.label as string) && <span className="ml-3 text-sm text-gray-500">{element.props?.label as string}</span>}
          </div>
        </div>
      );
    }

    // ── Media: Lottie ──
    case "lottie":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 p-8 gap-2">
            <span className="text-4xl">🎞️</span>
            <p className="text-sm font-medium text-gray-500">Lottie Animation</p>
            {(element.props?.src as string) && <p className="text-xs text-gray-400 truncate max-w-xs">{element.props?.src as string}</p>}
          </div>
        </div>
      );

    // ── Media: SVG ──
    case "svg":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          {(element.props?.markup as string) ? (
            <div dangerouslySetInnerHTML={{ __html: sanitizeHtmlSync(element.props?.markup as string ?? "") }} />
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 gap-2">
              <span className="text-3xl">◈</span>
              <p className="text-xs font-medium text-gray-500">SVG — paste markup in props</p>
            </div>
          )}
        </div>
      );

    // ── Forms: Input ──
    case "input": {
      const inputName = ((element.props?.label as string) || element.id).toLowerCase().replace(/\s+/g, "_");
      const inputRequired = !!(element.props?.required);
      const inputMin = (element.props?.minLength as number) || undefined;
      const inputMax = (element.props?.maxLength as number) || undefined;
      const inputPattern = (element.props?.pattern as string) || undefined;
      const inputMin2 = (element.props?.min as string) || undefined;
      const inputMax2 = (element.props?.max as string) || undefined;
      const inputErrorMsg = (element.props?.errorMessage as string) || undefined;
      const labelText = element.props?.label as string;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="space-y-1">
            {labelText && (
              <label className="text-xs font-medium text-gray-700 block">
                {labelText}{inputRequired && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            <input
              name={inputName}
              type={(element.props?.inputType as string) || "text"}
              placeholder={(element.props?.placeholder as string) || "Enter text..."}
              required={inputRequired}
              minLength={inputMin}
              maxLength={inputMax}
              pattern={inputPattern}
              min={inputMin2}
              max={inputMax2}
              data-error-message={inputErrorMsg}
              className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
            />
            {(element.props?.helperText as string) && <p className="text-[10px] text-gray-400">{element.props?.helperText as string}</p>}
          </div>
        </div>
      );
    }

    // ── Forms: Textarea ──
    case "textarea": {
      const taName = ((element.props?.label as string) || element.id).toLowerCase().replace(/\s+/g, "_");
      const taRequired = !!(element.props?.required);
      const taMin = (element.props?.minLength as number) || undefined;
      const taMax = (element.props?.maxLength as number) || undefined;
      const taErrorMsg = (element.props?.errorMessage as string) || undefined;
      const taLabel = element.props?.label as string;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="space-y-1">
            {taLabel && (
              <label className="text-xs font-medium text-gray-700 block">
                {taLabel}{taRequired && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            <textarea
              name={taName}
              placeholder={(element.props?.placeholder as string) || "Enter your message..."}
              rows={(element.props?.rows as number) || 4}
              required={taRequired}
              minLength={taMin}
              maxLength={taMax}
              data-error-message={taErrorMsg}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors resize-none"
            />
          </div>
        </div>
      );
    }

    // ── Forms: Select ──
    case "select": {
      const selOptions = (element.props?.options as string[]) || ["Option 1", "Option 2", "Option 3"];
      const selName = ((element.props?.label as string) || element.id).toLowerCase().replace(/\s+/g, "_");
      const selRequired = !!(element.props?.required);
      const selErrorMsg = (element.props?.errorMessage as string) || undefined;
      const selLabel = element.props?.label as string;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="space-y-1">
            {selLabel && (
              <label className="text-xs font-medium text-gray-700 block">
                {selLabel}{selRequired && <span className="text-red-500 ml-0.5">*</span>}
              </label>
            )}
            <select name={selName} required={selRequired} data-error-message={selErrorMsg} className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors">
              {(element.props?.placeholder as string) && <option value="">{element.props?.placeholder as string}</option>}
              {selOptions.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
      );
    }

    // ── Forms: Multi-Select ──
    case "multi-select": {
      const msOptions = (element.props?.options as string[]) || ["React", "Vue", "Angular"];
      const msAccent2 = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="space-y-1">
            {(element.props?.label as string) && <label className="text-xs font-medium text-gray-700 block">{element.props?.label as string}</label>}
            <div className="w-full min-h-[40px] rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 flex items-center flex-wrap gap-1.5 cursor-pointer focus-within:ring-2 focus-within:ring-indigo-400">
              {msOptions.slice(0, 2).map((opt, i) => (
                <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: `${msAccent2}15`, color: msAccent2 }}>
                  {opt} <span className="opacity-60 cursor-pointer hover:opacity-100">×</span>
                </span>
              ))}
              <input type="text" placeholder={msOptions.length > 2 ? `+${msOptions.length - 2} more...` : "Type to select..."} className="flex-1 min-w-[60px] text-xs bg-transparent outline-none text-gray-500" />
            </div>
          </div>
        </div>
      );
    }

    // ── Forms: Checkbox ──
    case "checkbox": {
      const cbxAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <InteractiveCheckbox element={element} accent={cbxAccent} s={s} isNested={isNested} />
      );
    }

    // ── Forms: Radio Group ──
    case "radio-group": {
      const rgOptions = (element.props?.options as string[]) || ["Option A", "Option B", "Option C"];
      const rgAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <InteractiveRadioGroup element={element} options={rgOptions} accent={rgAccent} s={s} isNested={isNested} />
      );
    }

    // ── Forms: Toggle ──
    case "toggle": {
      const togAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <InteractiveToggle element={element} accent={togAccent} s={s} isNested={isNested} />
      );
    }

    // ── Forms: Slider ──
    case "slider": {
      const slAccent = (element.props?.accentColor as string) || "#6366f1";
      const slMin = (element.props?.min as number) ?? 0;
      const slMax = (element.props?.max as number) ?? 100;
      const slDefault = (element.props?.defaultValue as number) ?? 50;
      return (
        <InteractiveSlider element={element} accent={slAccent} min={slMin} max={slMax} defaultValue={slDefault} s={s} isNested={isNested} />
      );
    }

    // ── Forms: Date Picker ──
    case "date-picker": {
      const dpName = ((element.props?.label as string) || element.id).toLowerCase().replace(/\s+/g, "_");
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="space-y-1">
            {(element.props?.label as string) && <label className="text-xs font-medium text-gray-700 block">{element.props?.label as string}</label>}
            <input
              type="date"
              name={dpName}
              className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:bg-white transition-colors"
            />
          </div>
        </div>
      );
    }

    // ── Forms: File Upload ──
    case "file-upload":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <label className="block">
            {(element.props?.label as string) && <span className="text-xs font-medium text-gray-700 mb-1 block">{element.props?.label as string}</span>}
            <div className="w-full rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 flex flex-col items-center gap-2 hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors cursor-pointer">
              <span className="text-2xl">📁</span>
              <p className="text-sm font-medium text-gray-600">{(element.props?.placeholder as string) || "Click to upload or drag & drop"}</p>
              <p className="text-xs text-gray-400">{(element.props?.accept as string) || "PNG, JPG, PDF up to 10MB"}</p>
              <input type="file" accept={element.props?.accept as string} multiple={!!element.props?.multiple} className="sr-only" />
            </div>
          </label>
        </div>
      );

    // ── Forms: Search Input ──
    case "search-input": {
      const siAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-gray-400 text-sm pointer-events-none">🔍</span>
            <input
              type="search"
              placeholder={(element.props?.placeholder as string) || "Search..."}
              className="w-full h-10 rounded-lg border border-gray-200 bg-gray-50 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-colors"
              style={{ "--tw-ring-color": siAccent } as React.CSSProperties}
            />
            <button className="absolute right-2 px-2 py-1 rounded-md text-white text-xs font-semibold transition hover:opacity-90" style={{ backgroundColor: siAccent }}>
              {(element.props?.buttonText as string) || "Search"}
            </button>
          </div>
        </div>
      );
    }

    // ── Forms: OTP Input ──
    case "otp-input": {
      const otpLen = (element.props?.length as number) || 6;
      const otpAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <InteractiveOTP length={otpLen} accent={otpAccent} s={s} isNested={isNested} element={element} />
      );
    }

    // ── Navigation: Mobile Menu ──
    case "mobile-menu": {
      const mmAccent = (element.props?.accentColor as string) || "#6366f1";
      const rawMmLinks = (element.props?.links as Array<string | { label: string; href: string }>) || ["Home", "Features", "Pricing", "About", "Contact"];
      const mmLinks = rawMmLinks.map((l) => typeof l === "string" ? { label: l, href: "#" } : l);
      const mmCtaHref = (element.props?.ctaHref as string) || "";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-lg overflow-hidden max-w-xs">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <span className="font-bold text-sm" style={{ color: mmAccent }}>{(element.props?.brandName as string) || "YourBrand"}</span>
              <span className="text-xl text-gray-400">✕</span>
            </div>
            <nav className="py-2">
              {mmLinks.map((link, i) => (
                <a
                  key={i}
                  href={isPreview ? (link.href || "#") : undefined}
                  onClick={isPreview ? undefined : (e) => e.preventDefault()}
                  className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                >{link.label}</a>
              ))}
            </nav>
            <div className="px-4 pb-4">
              {isPreview && mmCtaHref ? (
                <a href={mmCtaHref} className="block w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center" style={{ backgroundColor: mmAccent }}>
                  {(element.props?.ctaText as string) || "Get Started"}
                </a>
              ) : (
                <button className="w-full py-2.5 rounded-xl text-sm font-semibold text-white" style={{ backgroundColor: mmAccent }}>
                  {(element.props?.ctaText as string) || "Get Started"}
                </button>
              )}
            </div>
          </div>
        </div>
      );
    }

    // ── Navigation: Mega Menu ──
    case "mega-menu": {
      const mgAccent = (element.props?.accentColor as string) || "#6366f1";
      const mgCategories = (element.props?.categories as Array<{ title: string; items: string[] }>) || [
        { title: "Products", items: ["Analytics", "Automation", "Integrations"] },
        { title: "Solutions", items: ["Startups", "Enterprise", "Agency"] },
        { title: "Resources", items: ["Docs", "Blog", "Changelog"] },
      ];
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden">
            <div className="grid" style={{ gridTemplateColumns: `repeat(${mgCategories.length}, 1fr)` }}>
              {mgCategories.map((cat, i) => (
                <div key={i} className={cn("p-5", i < mgCategories.length - 1 && "border-r border-gray-100")}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-3" style={{ color: mgAccent }}>{cat.title}</p>
                  {cat.items.map((item, j) => (
                    <a key={j} href="#" className="block py-1.5 text-sm text-gray-600 hover:text-indigo-600 transition-colors">{item}</a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Navigation: Dropdown Menu ──
    case "dropdown-menu": {
      const dmAccent = (element.props?.accentColor as string) || "#6366f1";
      const dmLabel = (element.props?.label as string) || "Options";
      const dmItems = (element.props?.items as string[]) || ["Profile", "Settings", "Sign out"];
      return (
        <div style={s} className={cn("w-full relative", isNested ? "p-2" : "px-8 py-4")}>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 bg-white text-sm font-medium hover:bg-gray-50 transition shadow-sm">
            {dmLabel}
            <span className="text-xs opacity-50">▼</span>
          </button>
          {!isPreview && (
            <div className="absolute top-full left-0 mt-2 w-48 rounded-xl border border-gray-100 bg-white shadow-xl overflow-hidden z-10 transition-opacity ml-2 sm:ml-8">
              {dmItems.map((item, i) => (
                <a key={i} href="#" className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-indigo-600 transition-colors pointer-events-none">
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      );
    }

    // ── Sections: Bento Grid ──
    case "bento-grid": {
      const bgAccent = (element.props?.accentColor as string) || "#6366f1";
      const bgCells = (element.props?.cells as Array<{ title: string; description?: string; span?: string; rowSpan?: string }>) || [
        { title: "Fast Deployment", description: "Ship in seconds.", span: "2", rowSpan: "1" },
        { title: "Analytics", description: "Real-time insights.", span: "1", rowSpan: "2" },
        { title: "Security", description: "Enterprise-grade.", span: "1", rowSpan: "1" },
        { title: "Global CDN", description: "200+ edge locations.", span: "1", rowSpan: "1" },
      ];
      const bgGap = (element.props?.gap as string) || "16px";
      return (
        <div style={s} className="w-full py-16 px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            {(element.props?.heading as string) && <h2 className="text-3xl font-bold text-gray-900 mb-3">{element.props?.heading as string}</h2>}
            {(element.props?.subheading as string) && <p className="text-gray-500 mb-8">{element.props?.subheading as string}</p>}
            <div className="grid grid-cols-3 auto-rows-[160px]" style={{ gap: bgGap }}>
              {bgCells.map((cell, i) => (
                <div key={i}
                  className="rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-gray-100 p-5 flex flex-col justify-end hover:shadow-md transition-shadow"
                  style={{
                    gridColumn: `span ${cell.span || 1}`,
                    gridRow: `span ${cell.rowSpan || 1}`,
                    background: i === 0 ? `linear-gradient(135deg, ${bgAccent}15, ${bgAccent}05)` : undefined,
                    borderColor: i === 0 ? `${bgAccent}30` : undefined,
                  }}>
                  <h3 className="font-semibold text-gray-900 text-sm">{cell.title}</h3>
                  {cell.description && <p className="text-xs text-gray-500 mt-0.5">{cell.description}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Sections: How It Works ──
    case "how-it-works": {
      const hiwAccent = (element.props?.accentColor as string) || "#6366f1";
      const hiwSteps = (element.props?.steps as Array<{ number: string; title: string; description: string }>) || [
        { number: "01", title: "Sign Up", description: "Create your free account in seconds." },
        { number: "02", title: "Build", description: "Drag and drop to build your site." },
        { number: "03", title: "Publish", description: "Go live instantly with one click." },
      ];
      const hiwCols = (element.props?.columns as string) || "3";
      const colCls = hiwCols === "2" ? "grid-cols-2" : hiwCols === "4" ? "grid-cols-4" : "grid-cols-3";
      return (
        <div style={s} className="w-full py-16 px-8 bg-gray-50">
          <div className="max-w-4xl mx-auto text-center">
            {(element.props?.eyebrow as string) && <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: hiwAccent }}>{element.props?.eyebrow as string}</p>}
            {(element.props?.heading as string) && <h2 className="text-3xl font-bold text-gray-900 mb-3">{element.props?.heading as string}</h2>}
            {(element.props?.subheading as string) && <p className="text-gray-500 mb-10">{element.props?.subheading as string}</p>}
            <div className={cn("grid gap-8", colCls)}>
              {hiwSteps.map((step, i) => (
                <div key={i} className="relative text-center">
                  {i < hiwSteps.length - 1 && (
                    <div className="hidden md:block absolute top-7 left-full w-full h-0.5 -translate-y-px z-0" style={{ backgroundColor: `${hiwAccent}25` }} />
                  )}
                  <div className="h-14 w-14 rounded-2xl mx-auto mb-4 flex items-center justify-center text-lg font-black text-white relative z-10" style={{ backgroundColor: hiwAccent }}>
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Sections: Blog Grid ──
    case "blog-grid": {
      const blgAccent = (element.props?.accentColor as string) || "#6366f1";
      const blgPosts = (element.props?.posts as Array<{ title: string; excerpt?: string; category?: string; author?: string; date?: string; href?: string }>) || [
        { title: "Getting Started with Webperia", excerpt: "Everything you need to know to launch your first production site in minutes.", category: "Tutorial", author: "Sarah Chen", date: "Mar 2026" },
        { title: "Design Principles for Non-Designers", excerpt: "Simple frameworks that help engineers and founders create clean, professional interfaces.", category: "Design", author: "Tom R.", date: "Mar 2026" },
        { title: "Boost Your Core Web Vitals", excerpt: "Practical performance tips that will improve your SEO rankings and user experience.", category: "Performance", author: "Alex J.", date: "Feb 2026" },
      ];
      const blgCols = (element.props?.columns as string) || "3";
      const blgColCls = blgCols === "2" ? "grid-cols-2" : blgCols === "4" ? "grid-cols-2 lg:grid-cols-4" : "grid-cols-3";
      const blgImgGradients = [`linear-gradient(135deg, ${blgAccent}25, ${blgAccent}08)`, `linear-gradient(135deg, #7c3aed25, #7c3aed08)`, `linear-gradient(135deg, #05966925, #05966908)`];
      return (
        <div style={s} className="w-full py-20 px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            {(element.props?.eyebrow as string) && <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: blgAccent }}>{element.props?.eyebrow as string}</p>}
            {(element.props?.heading as string) && <h2 className="text-4xl font-extrabold text-gray-900 mb-10 tracking-tight">{element.props?.heading as string}</h2>}
            <div className={cn("grid gap-7", blgColCls)}>
              {blgPosts.slice(0, parseInt(blgCols, 10) || blgPosts.length).map((post, i) => (
                <article key={i} className="group rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 bg-white">
                  <div className="h-48 relative overflow-hidden" style={{ background: blgImgGradients[i % blgImgGradients.length] }}>
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                      <span className="text-6xl">📝</span>
                    </div>
                  </div>
                  <div className="p-6">
                    {post.category && <span className="text-[11px] font-700 uppercase tracking-wider px-2.5 py-1 rounded-full mb-3 inline-block font-bold" style={{ backgroundColor: `${blgAccent}12`, color: blgAccent }}>{post.category}</span>}
                    <h3 className="font-bold text-gray-900 text-base leading-snug mb-2 group-hover:text-indigo-600 transition-colors">{post.title}</h3>
                    {post.excerpt && <p className="text-sm text-gray-500 leading-relaxed mb-4">{post.excerpt}</p>}
                    <div className="flex items-center gap-2 text-xs text-gray-400 pt-3 border-t border-gray-50">
                      {post.author && <span className="font-medium text-gray-600">{post.author}</span>}
                      {post.author && post.date && <span>·</span>}
                      {post.date && <span>{post.date}</span>}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Sections: Portfolio Grid ──
    case "portfolio-grid": {
      const pgItems = (element.props?.items as Array<{ title: string; category?: string; image?: string; href?: string }>) || [
        { title: "Brand Identity", category: "Branding" },
        { title: "E-Commerce Store", category: "Web Design" },
        { title: "Mobile App", category: "UI/UX" },
      ];
      const pgAccent = (element.props?.accentColor as string) || "#6366f1";
      const pgCols = (element.props?.columns as string) || "3";
      const pgColCls = pgCols === "2" ? "grid-cols-2" : pgCols === "4" ? "grid-cols-4" : "grid-cols-3";
      const gradients = ["from-blue-200 to-indigo-300", "from-purple-200 to-pink-300", "from-emerald-200 to-teal-300", "from-amber-200 to-orange-300"];
      return (
        <div style={s} className="w-full py-16 px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            {(element.props?.heading as string) && <h2 className="text-3xl font-bold text-gray-900 mb-8">{element.props?.heading as string}</h2>}
            <div className={cn("grid gap-5", pgColCls)}>
              {pgItems.map((item, i) => (
                <div key={i} className="group relative rounded-2xl overflow-hidden aspect-[4/3]">
                  {item.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className={cn("w-full h-full bg-gradient-to-br", gradients[i % gradients.length])} />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="font-semibold text-sm">{item.title}</p>
                      {item.category && <p className="text-xs opacity-75">{item.category}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Sections: Announcement ──
    case "announcement": {
      const annAccent = (element.props?.backgroundColor as string) || (element.props?.accentColor as string) || "#6366f1";
      const annText = (element.props?.textColor as string) || "#FFFFFF";
      const annSticky = element.props?.sticky !== false;
      return (
        <div style={{ backgroundColor: annAccent, color: annText, ...s }} className="w-full px-6 py-2.5 flex items-center justify-center gap-3">
          <p className="text-sm font-medium text-center" style={{ color: annText }}>
            {(element.props?.text as string) || "🎉 We just launched v2.0!"}
          </p>
          {(element.props?.ctaLabel as string) && (
            <a href={String(element.props?.ctaHref || "#")} className="text-sm font-bold underline shrink-0" style={{ color: annText }}>
              {element.props?.ctaLabel as string}
            </a>
          )}
          {!!element.props?.dismissible && (
            <button className="h-5 w-5 rounded flex items-center justify-center opacity-60 hover:opacity-100 transition shrink-0" style={{ color: annText }}>
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      );
    }

    // ── E-Commerce: Add to Cart ──
    case "add-to-cart":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <AddToCartRenderer element={element} />
        </div>
      );

    // ── E-Commerce: Cart ──
    case "cart":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <CartRenderer element={element} />
        </div>
      );

    // ── E-Commerce: Price Display ──
    case "price-display": {
      const pdAccent = (element.props?.accentColor as string) || "#111827";
      const pdPrice = (element.props?.price as string) || "$29.99";
      const pdOriginal = element.props?.originalPrice as string;
      const pdBadge = element.props?.badge as string;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="flex items-baseline gap-3 flex-wrap">
            <span className="text-3xl font-black" style={{ color: pdAccent }}>{pdPrice}</span>
            {pdOriginal && <span className="text-lg text-gray-400 line-through">{pdOriginal}</span>}
            {pdBadge && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">{pdBadge}</span>}
          </div>
          {(element.props?.perUnit as string) && <p className="text-xs text-gray-500 mt-0.5">{element.props?.perUnit as string}</p>}
        </div>
      );
    }

    // ── E-Commerce: Product Gallery ──
    case "product-gallery": {
      const pgGradients2 = ["from-blue-100 to-indigo-200", "from-purple-100 to-pink-200", "from-amber-100 to-orange-200", "from-emerald-100 to-teal-200"];
      const pgImgs = (element.props?.images as string[]) || [];
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="flex gap-3">
            {/* Main image */}
            <div className="flex-1 rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-gray-100 to-gray-200">
              {pgImgs[0] ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={pgImgs[0]} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <div className={cn("w-full h-full bg-gradient-to-br", pgGradients2[0])} />
              )}
            </div>
            {/* Thumbnails */}
            <div className="flex flex-col gap-2 w-16">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className={cn("flex-1 rounded-lg overflow-hidden border-2 cursor-pointer transition-colors", i === 0 ? "border-indigo-400" : "border-gray-100 hover:border-gray-300")}>
                  {pgImgs[i + 1] ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pgImgs[i + 1]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className={cn("w-full h-full bg-gradient-to-br", pgGradients2[(i + 1) % pgGradients2.length])} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── E-Commerce: Wishlist Button ──
    case "wishlist-btn": {
      const wlAccent = (element.props?.accentColor as string) || "#ef4444";
      const wlActive = element.props?.active === true;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <button className="flex items-center gap-2 px-4 py-2 rounded-xl border transition-colors" style={wlActive ? { backgroundColor: `${wlAccent}15`, borderColor: `${wlAccent}40`, color: wlAccent } : { borderColor: "#e5e7eb", color: "#6b7280" }}>
            <span className="text-base">{wlActive ? "♥" : "♡"}</span>
            <span className="text-sm font-medium">{(element.props?.label as string) || (wlActive ? "Saved" : "Save to Wishlist")}</span>
          </button>
        </div>
      );
    }

    // ── E-Commerce: Stock Indicator ──
    case "stock-indicator": {
      const siStock = (element.props?.stock as number) ?? 12;
      const siLow = siStock <= (element.props?.lowThreshold as number || 5);
      const siOut = siStock === 0;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="flex items-center gap-2">
            <div className={cn("h-2 w-2 rounded-full", siOut ? "bg-red-500" : siLow ? "bg-yellow-500" : "bg-green-500")} />
            <span className={cn("text-sm font-medium", siOut ? "text-red-600" : siLow ? "text-yellow-600" : "text-green-600")}>
              {siOut ? "Out of stock" : siLow ? `Only ${siStock} left` : `In stock (${siStock} available)`}
            </span>
          </div>
        </div>
      );
    }

    // ── E-Commerce: Coupon Code ──
    case "coupon-code": {
      const ccCode = (element.props?.code as string) || "SAVE20";
      const ccAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="flex items-center gap-0 rounded-xl border border-dashed overflow-hidden" style={{ borderColor: ccAccent }}>
            <div className="flex-1 px-4 py-3 bg-gray-50">
              <p className="text-[10px] text-gray-500 font-medium">{(element.props?.label as string) || "Coupon code"}</p>
              <p className="text-sm font-black font-mono tracking-widest" style={{ color: ccAccent }}>{ccCode}</p>
            </div>
            <button className="px-4 py-3 text-sm font-bold text-white transition hover:opacity-90 shrink-0" style={{ backgroundColor: ccAccent }}>
              Copy
            </button>
          </div>
        </div>
      );
    }

    // ── E-Commerce: Product Reviews ──
    case "product-reviews": {
      const prAccent2 = (element.props?.accentColor as string) || "#f59e0b";
      const prAvg = (element.props?.averageRating as number) || 4.8;
      const prTotal = (element.props?.totalReviews as number) || 128;
      const prReviews = (element.props?.reviews as Array<{ name: string; rating: number; comment: string; date?: string }>) || [
        { name: "Sarah J.", rating: 5, comment: "Absolutely love this product! Exceeded my expectations." },
        { name: "Mike C.", rating: 4, comment: "Great quality, fast shipping. Would recommend." },
      ];
      return (
        <div style={s} className="w-full py-12 px-8 bg-white">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center gap-6 mb-8">
              <div className="text-center">
                <p className="text-5xl font-black text-gray-900">{prAvg}</p>
                <div className="flex gap-0.5 my-1">
                  {[1, 2, 3, 4, 5].map(n => <span key={n} className="text-lg" style={{ color: n <= Math.round(prAvg) ? prAccent2 : "#d1d5db" }}>★</span>)}
                </div>
                <p className="text-xs text-gray-400">{prTotal} reviews</p>
              </div>
            </div>
            <div className="space-y-4">
              {prReviews.map((rev, i) => (
                <div key={i} className="rounded-xl border border-gray-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-900">{rev.name}</span>
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map(n => <span key={n} className="text-sm" style={{ color: n <= rev.rating ? prAccent2 : "#d1d5db" }}>★</span>)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Advanced: Data Table ──
    case "data-table":
      return <DataTableElement element={element} isPreview={isPreview} s={s} />;

    // ── Advanced: Feature Grid ──
    case "feature-grid": {
      const fgAccent = (element.props?.accentColor as string) || "#6366f1";
      const fgFeatures = (element.props?.features as Array<{ icon: string; title: string; description: string }>) || [
        { icon: "⚡", title: "Blazing Fast", description: "Deploy globally in under 30 seconds with our edge network." },
        { icon: "🔒", title: "Secure by Default", description: "End-to-end encryption and SOC 2 Type II certification." },
        { icon: "🌍", title: "Global CDN", description: "Serve from 200+ edge locations for sub-50ms response times." },
        { icon: "📊", title: "Real-time Analytics", description: "Live dashboards with actionable insights out of the box." },
      ];
      const fgCols = (element.props?.columns as string) || "4";
      const fgColCls = fgCols === "2" ? "grid-cols-2" : fgCols === "3" ? "grid-cols-3" : "grid-cols-2 md:grid-cols-4";
      const fgBgType = (element.props?.bgType as string) || "light";
      const fgDark = fgBgType === "dark";
      return (
        <div style={s} className={cn("w-full py-20 px-8", fgDark ? "bg-gray-950" : "bg-gray-50/80")}>
          <div className="max-w-5xl mx-auto">
            {(element.props?.headline as string) && (
              <h2 className={cn("text-4xl font-800 text-center mb-3 tracking-tight font-extrabold", fgDark ? "text-white" : "text-gray-900")}>
                {element.props?.headline as string}
              </h2>
            )}
            {(element.props?.subheadline as string) && (
              <p className={cn("text-center mb-12 max-w-xl mx-auto", fgDark ? "text-gray-400" : "text-gray-500")}>
                {element.props?.subheadline as string}
              </p>
            )}
            {!(element.props?.headline as string) && <div className="mb-12" />}
            <div className={cn("grid gap-5", fgColCls)}>
              {fgFeatures.map((f, i) => (
                <div key={i} className={cn("rounded-2xl border p-6 transition-shadow hover:shadow-md", fgDark ? "bg-gray-900 border-gray-800" : "bg-white border-gray-100 shadow-sm")}>
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center text-2xl mb-4" style={{ backgroundColor: `${fgAccent}18` }}>{f.icon}</div>
                  <h3 className={cn("font-semibold text-base mb-2", fgDark ? "text-white" : "text-gray-900")}>{f.title}</h3>
                  <p className={cn("text-sm leading-relaxed", fgDark ? "text-gray-400" : "text-gray-500")}>{f.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Sections: Blog Card / Portfolio Item / Team Member (single card variants) ──
    case "blog-card": {
      const bcAccent = (element.props?.accentColor as string) || "#6366f1";
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <article className="rounded-2xl border border-gray-100 overflow-hidden max-w-sm hover:shadow-md transition-shadow">
            <div className="h-40 w-full bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${bcAccent}15, ${bcAccent}05)` }} />
            <div className="p-5">
              {(element.props?.category as string) && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full mb-3 inline-block" style={{ backgroundColor: `${bcAccent}15`, color: bcAccent }}>{element.props?.category as string}</span>}
              <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-2">{element.content || (element.props?.title as string) || "Blog Post Title"}</h3>
              {(element.props?.excerpt as string) && <p className="text-xs text-gray-500 leading-relaxed">{element.props?.excerpt as string}</p>}
            </div>
          </article>
        </div>
      );
    }

    case "portfolio-item": {
      const piGradients = ["from-blue-200 to-indigo-300", "from-purple-200 to-pink-300", "from-emerald-200 to-teal-300"];
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] max-w-sm group">
            {(element.props?.image as string) ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={element.props?.image as string} alt={element.content || ""} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <div className={cn("w-full h-full bg-gradient-to-br", piGradients[0])} />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end p-4">
              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="font-semibold text-sm">{element.content || (element.props?.title as string) || "Project Title"}</p>
                {(element.props?.category as string) && <p className="text-xs opacity-75">{element.props?.category as string}</p>}
              </div>
            </div>
          </div>
        </div>
      );
    }

    case "team-member": {
      const tmAccent = (element.props?.accentColor as string) || "#6366f1";
      const tmName = (element.props?.name as string) || element.content || "Team Member";
      const tmRole = (element.props?.role as string) || "Role";
      const tmAvatar = element.props?.avatarUrl as string;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <div className="flex flex-col items-center text-center max-w-[160px] mx-auto">
            {tmAvatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={tmAvatar} alt={tmName} className="h-20 w-20 rounded-full object-cover mb-3 shadow-md" />
            ) : (
              <div className="h-20 w-20 rounded-full mb-3 flex items-center justify-center text-2xl font-bold text-white shadow-md" style={{ background: `linear-gradient(135deg, ${tmAccent}, ${tmAccent}88)` }}>
                {tmName.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
            )}
            <p className="font-semibold text-gray-900 text-sm">{tmName}</p>
            <p className="text-xs mt-0.5" style={{ color: tmAccent }}>{tmRole}</p>
          </div>
        </div>
      );
    }

    // ── Advanced: Comparison ──
    case "comparison": {
      const cmpAccent = (element.props?.accentColor as string) || "#6366f1";
      const cmpBefore = (element.props?.before as string) || "Without Us";
      const cmpAfter = (element.props?.after as string) || "With Us";
      const cmpItems = (element.props?.items as Array<{ label: string; before: string; after: string }>) || [
        { label: "Time to ship", before: "2 weeks", after: "1 day" },
        { label: "Cost", before: "$5,000/mo", after: "$49/mo" },
        { label: "Team needed", before: "5 engineers", after: "1 person" },
      ];
      return (
        <div style={s} className="w-full py-10 px-8">
          <div className="max-w-2xl mx-auto">
            <div className="grid grid-cols-3 text-center mb-4">
              <div />
              <div className="text-xs font-semibold text-gray-400 uppercase tracking-widest">{cmpBefore}</div>
              <div className="text-xs font-bold uppercase tracking-widest" style={{ color: cmpAccent }}>{cmpAfter}</div>
            </div>
            <div className="rounded-2xl border border-gray-100 overflow-hidden divide-y divide-gray-50">
              {cmpItems.map((item, i) => (
                <div key={i} className="grid grid-cols-3 text-center items-center py-3">
                  <div className="text-xs font-medium text-gray-600 text-left px-5">{item.label}</div>
                  <div className="text-sm text-gray-400 line-through">{item.before}</div>
                  <div className="text-sm font-semibold" style={{ color: cmpAccent }}>{item.after}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── Advanced: Rating ──
    case "rating": {
      const ratAccent = (element.props?.accentColor as string) || "#f59e0b";
      const ratValue = (element.props?.value as number) || 4;
      const ratMax = (element.props?.max as number) || 5;
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-3")}>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: ratMax }).map((_, i) => (
                <span key={i} className="text-xl cursor-pointer transition-transform hover:scale-110" style={{ color: i < ratValue ? ratAccent : "#e5e7eb" }}>★</span>
              ))}
            </div>
            {(element.props?.showValue !== false) && <span className="text-sm font-semibold text-gray-700">{ratValue}/{ratMax}</span>}
            {(element.props?.label as string) && <span className="text-xs text-gray-400">{element.props?.label as string}</span>}
          </div>
        </div>
      );
    }

    // ── Accordion / FAQ ──
    case "accordion":
    case "faq": {
      const faqItems = (element.props?.items as Array<{ question: string; answer: string }>) || [
        { question: "What is this product?", answer: "A powerful tool that helps you do more in less time." },
        { question: "How do I get started?", answer: "Simply sign up and follow the onboarding flow — it takes under 2 minutes." },
        { question: "Is there a free trial?", answer: "Yes! We offer a 14-day free trial with no credit card required." },
      ];
      return <AccordionRenderer element={element} items={faqItems} s={s} />;
    }

    // ── Tabs ──
    case "tabs": {
      const tabItems = (element.props?.tabs as Array<{ label: string; content: string }>) || [
        { label: "Overview", content: "This is the overview content. Describe your product or feature here." },
        { label: "Features", content: "List all the amazing features your product offers." },
        { label: "Pricing", content: "Choose the plan that works best for you and your team." },
      ];
      return <TabsRenderer element={element} tabs={tabItems} s={s} />;
    }

    // ── Advanced: Chart ──
    case "chart":
      return <ChartRenderer element={element} s={s} />;

    // ── Advanced: Countdown Timer ──
    case "countdown":
      return <CountdownRenderer element={element} s={s} />;

    // ── Advanced: Progress Bar ──
    case "progress": {
      const progValue = Math.min(Math.max((element.props?.value as number) ?? 65, 0), 100);
      const progMax = (element.props?.max as number) || 100;
      const progPct = Math.round((progValue / progMax) * 100);
      const progAccent = (element.props?.accentColor as string) || "#6366f1";
      const progLabel = (element.props?.label as string) || element.content || "";
      const progH = (element.props?.height as string) || "8px";
      const progValPos = (element.props?.valuePosition as string) || "right";
      const progFmt = (element.props?.valueFormat as string) || "percentage";
      const progValStr = progFmt === "fraction" ? `${progValue}/${progMax}` : progFmt === "value" ? String(progValue) : `${progPct}%`;
      const progMulti = element.props?.bars as Array<{ label: string; value: number; color?: string }>;
      const renderBar = (val: number, color: string, lbl: string, key: number) => {
        const pct = Math.round((val / progMax) * 100);
        const valStr = progFmt === "fraction" ? `${val}/${progMax}` : progFmt === "value" ? String(val) : `${pct}%`;
        return (
          <div key={key} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              {lbl && <span className="text-sm font-medium text-gray-700">{lbl}</span>}
              {element.props?.showValue !== false && <span className="text-sm font-semibold" style={{ color }}>{valStr}</span>}
            </div>
            <div className="w-full rounded-full bg-gray-100 overflow-hidden" style={{ height: progH }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
            </div>
          </div>
        );
      };
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-5")}>
          {progMulti ? (
            <div className="flex flex-col gap-4">
              {progMulti.map((b, i) => renderBar(b.value, b.color || progAccent, b.label, i))}
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                {progLabel && <span className="text-sm font-medium text-gray-700">{progLabel}</span>}
                {element.props?.showValue !== false && progValPos !== "inside" && (
                  <span className="text-sm font-semibold" style={{ color: progAccent }}>{progValStr}</span>
                )}
              </div>
              <div className="w-full rounded-full bg-gray-100 overflow-hidden" style={{ height: progH }}>
                <div className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2" style={{ width: `${progPct}%`, backgroundColor: progAccent }}>
                  {progValPos === "inside" && progPct > 15 && (
                    <span className="text-white text-xs font-bold">{progValStr}</span>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── Advanced: Carousel / Slider ──
    case "carousel":
      return <CarouselRenderer element={element} s={s} />;

    // ── Advanced: Map ──
    case "map": {
      const mapLat = (element.props?.lat as number) || 48.8566;
      const mapLng = (element.props?.lng as number) || 2.3522;
      const mapZoom = (element.props?.zoom as number) || 13;
      const mapH = (element.props?.height as string) || "400px";
      const mapTitle = (element.props?.title as string) || "";
      const mapAddress = (element.props?.address as string) || "";
      const mapProvider = (element.props?.provider as string) || "openstreetmap";
      const delta = 0.03 / mapZoom * 13;
      const bboxStr = `${mapLng - delta},${mapLat - delta},${mapLng + delta},${mapLat + delta}`;
      const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bboxStr}&layer=mapnik&marker=${mapLat},${mapLng}`;
      return (
        <div style={s} className="w-full overflow-hidden">
          {(mapTitle || mapAddress) && (
            <div className="px-4 py-3 border-b border-gray-100 bg-white flex items-center gap-2">
              <span className="text-base">📍</span>
              <div>
                {mapTitle && <p className="text-sm font-semibold text-gray-800">{mapTitle}</p>}
                {mapAddress && <p className="text-xs text-gray-500">{mapAddress}</p>}
              </div>
            </div>
          )}
          {mapProvider === "openstreetmap" ? (
            <iframe
              src={osmUrl}
              width="100%"
              style={{ height: mapH, border: "none", display: "block" }}
              title="Map"
              loading="lazy"
            />
          ) : (
            /* Placeholder for Google Maps / other providers that need API key */
            <div
              className="w-full relative overflow-hidden bg-gray-100 flex flex-col items-center justify-center gap-3"
              style={{ height: mapH }}
            >
              <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
              <div className="relative flex flex-col items-center gap-2 text-center px-6">
                <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center shadow-lg text-white text-xl">📍</div>
                <p className="text-sm font-semibold text-gray-700">{mapTitle || "Map Location"}</p>
                {mapAddress && <p className="text-xs text-gray-400">{mapAddress}</p>}
                <p className="text-xs text-gray-400 mt-1">{mapLat.toFixed(4)}, {mapLng.toFixed(4)} · zoom {mapZoom}</p>
              </div>
            </div>
          )}
        </div>
      );
    }

    // ── E-Commerce: Product Card ──
    case "product-card":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <ProductCardRenderer element={element} />
        </div>
      );

    // ── Overlay: Modal ──
    case "modal":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <ModalRenderer element={element} />
        </div>
      );

    // ── Overlay: Drawer ──
    case "drawer":
      return (
        <div style={s} className={cn("w-full", isNested ? "p-2" : "px-8 py-4")}>
          <DrawerRenderer element={element} />
        </div>
      );

    // ── Auth Forms (functional) ──
    case "auth-signin-form":
    case "auth-signup-form":
    case "auth-forgot-form":
    case "auth-reset-form":
      return (
        <div style={s} className={cn("w-full", isNested ? "" : "")}>
          <AuthFormRenderer element={element} />
        </div>
      );

    // ── Auth Gate ──
    case "auth-gate":
      return (
        <div style={s} className="w-full">
          <AuthGateRenderer element={element} />
        </div>
      );

    // ── User Profile Card ──
    case "user-profile-card":
      return (
        <div style={s} className="w-full">
          <UserProfileCardRenderer element={element} />
        </div>
      );

    // ── Logout Button ──
    case "logout-button":
      return (
        <div style={s}>
          <LogoutButtonRenderer element={element} />
        </div>
      );

    // ── CMS List ──
    case "cms-list":
      return (
        <div style={s} className="w-full">
          <CmsListRenderer element={element} />
        </div>
      );

    // ── Default fallback ──
    default:
      return (
        <div className="px-8 py-6">
          <div className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 p-6 text-center">
            <p className="text-sm font-medium text-gray-500 capitalize">{element.type}</p>
            <p className="text-xs text-gray-400 mt-1">This element type is ready for customization</p>
          </div>
        </div>
      );
  }
});

// ─── Accordion (stateful, needs its own component) ─────────────────────────────

function AccordionRenderer({
  element,
  items,
  s,
}: {
  element: CanvasElement;
  items: Array<{ question: string; answer: string }>;
  s: React.CSSProperties;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  return (
    <div style={s} className="w-full py-16 px-8 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
          {(element.props?.headline as string) || "Common Questions"}
        </h2>
        <p className="text-gray-500 text-center mb-8 text-sm">
          {(element.props?.subheadline as string) || "Everything you need to know"}
        </p>
        <div className="space-y-2">
          {items.map((item, i) => (
            <div key={i} className="rounded-xl border border-gray-200 overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-gray-900 text-sm">{item.question}</span>
                <ChevronDown className={cn("h-4 w-4 text-gray-400 transition-transform shrink-0 ml-3", openIndex === i && "rotate-180")} />
              </button>
              {openIndex === i && (
                <div className="px-4 pb-4">
                  <p className="text-sm text-gray-500 leading-relaxed">{item.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Tabs (stateful, needs its own component) ──────────────────────────────────

function TabsRenderer({
  element,
  tabs,
  s,
}: {
  element: CanvasElement;
  tabs: Array<{ label: string; content: string }>;
  s: React.CSSProperties;
}) {
  const [activeTab, setActiveTab] = useState(0);
  return (
    <div style={s} className="w-full py-12 px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        {(element.props?.headline as string) && (
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">{element.props?.headline as string}</h2>
        )}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
          {tabs.map((tab, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(i)}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all",
                activeTab === i
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6 min-h-[100px]">
          <p className="text-gray-600 text-sm leading-relaxed">{tabs[activeTab]?.content}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Chart Renderer (uses Recharts) ──────────────────────────────────────────

function ChartRenderer({ element, s }: { element: CanvasElement; s: React.CSSProperties }) {
  const chartType = (element.props?.chartType as string) || "bar";
  const accent = (element.props?.accentColor as string) || "#6366f1";
  const title = (element.props?.title as string) || "";
  const legendLabel = (element.props?.legendLabel as string) || "Value";
  const showGrid = element.props?.showGrid !== false;
  const showLegend = element.props?.showLegend !== false;
  const showTooltip = element.props?.showTooltip !== false;
  const curved = element.props?.curved !== false;
  const h = parseInt((element.props?.height as string) || "300", 10) || 300;

  const data: Array<{ label: string; value: number }> = (element.props?.data as Array<{ label: string; value: number }>) || [
    { label: "Jan", value: 42 }, { label: "Feb", value: 68 }, { label: "Mar", value: 53 },
    { label: "Apr", value: 91 }, { label: "May", value: 74 }, { label: "Jun", value: 85 },
    { label: "Jul", value: 60 },
  ];

  const rechartData = data.map((d) => ({ name: d.label, [legendLabel]: d.value }));
  const PIE_COLORS = [accent, "#818cf8", "#a78bfa", "#c084fc", "#e879f9", "#fb7185", "#fbbf24"];

  return (
    <div style={s} className="w-full px-4 py-5">
      {title && <p className="text-sm font-semibold text-gray-700 mb-3 px-2">{title}</p>}
      <ResponsiveContainer width="100%" height={h}>
        {chartType === "pie" ? (
          <PieChart>
            {showTooltip && <Tooltip />}
            {showLegend && <Legend />}
            <Pie data={rechartData} dataKey={legendLabel} nameKey="name" cx="50%" cy="50%" outerRadius={h / 2 - 30} label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
              {rechartData.map((_, i) => (
                <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : chartType === "area" ? (
          <AreaChart data={rechartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={32} />
            {showTooltip && <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
            <Area type={curved ? "monotone" : "linear"} dataKey={legendLabel} stroke={accent} fill={`${accent}22`} strokeWidth={2} dot={{ fill: accent, strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
          </AreaChart>
        ) : chartType === "line" ? (
          <LineChart data={rechartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={32} />
            {showTooltip && <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
            <Line type={curved ? "monotone" : "linear"} dataKey={legendLabel} stroke={accent} strokeWidth={2.5} dot={{ fill: accent, strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
          </LineChart>
        ) : (
          <BarChart data={rechartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />}
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={32} />
            {showTooltip && <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #e5e7eb", fontSize: 12 }} cursor={{ fill: `${accent}10` }} />}
            {showLegend && <Legend wrapperStyle={{ fontSize: 12 }} />}
            <Bar dataKey={legendLabel} fill={accent} radius={[4, 4, 0, 0]} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}

// ─── Countdown Renderer (live ticking) ───────────────────────────────────────

function CountdownRenderer({ element, s }: { element: CanvasElement; s: React.CSSProperties }) {
  const accent = (element.props?.accentColor as string) || "#6366f1";
  const cdStyle = (element.props?.style as string) || "boxes";
  const cdSize = (element.props?.size as string) || "lg";
  const title = (element.props?.title as string) || "";
  const expiredMsg = (element.props?.expiredMessage as string) || "Time's up!";
  const showLabels = element.props?.labels !== false;
  const showDays = element.props?.showDays !== false;
  const showHours = element.props?.showHours !== false;
  const showMinutes = element.props?.showMinutes !== false;
  const showSeconds = element.props?.showSeconds !== false;

  // Parse target — default to 12 days from now if not set
  const targetMs = useMemo(() => {
    const raw = element.props?.targetDate as string;
    if (raw) { const t = new Date(raw).getTime(); if (!isNaN(t)) return t; }
    return Date.now() + 12 * 24 * 60 * 60 * 1000;
  }, [element.props?.targetDate]);

  const calc = () => {
    const diff = Math.max(targetMs - Date.now(), 0);
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
      expired: diff === 0,
    };
  };

  const [time, setTime] = useState(calc);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setTime(calc());
    intervalRef.current = setInterval(() => setTime(calc()), 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetMs]);

  const sizeMap = {
    sm: { box: "52px", num: "20px", lbl: "9px", sep: "18px", gap: "8px" },
    md: { box: "68px", num: "26px", lbl: "10px", sep: "24px", gap: "12px" },
    lg: { box: "88px", num: "36px", lbl: "11px", sep: "32px", gap: "16px" },
  };
  const sz = sizeMap[cdSize as keyof typeof sizeMap] || sizeMap.lg;

  const units = [
    { key: "days", show: showDays, value: time.days, label: "Days" },
    { key: "hours", show: showHours, value: time.hours, label: "Hours" },
    { key: "minutes", show: showMinutes, value: time.minutes, label: "Mins" },
    { key: "seconds", show: showSeconds, value: time.seconds, label: "Secs" },
  ].filter((u) => u.show);

  const fmt = (n: number) => String(n).padStart(2, "0");

  if (time.expired) {
    return (
      <div style={s} className="w-full flex items-center justify-center py-8 px-6">
        <p className="text-xl font-bold" style={{ color: accent }}>{expiredMsg}</p>
      </div>
    );
  }

  return (
    <div style={s} className="w-full flex flex-col items-center gap-3 py-8 px-6">
      {title && <p className="text-sm font-semibold text-gray-700">{title}</p>}
      <div className="flex items-center" style={{ gap: sz.gap }}>
        {units.map((u, i) => (
          <React.Fragment key={u.key}>
            {cdStyle === "boxes" ? (
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="flex items-center justify-center rounded-xl font-extrabold text-white tabular-nums shadow-sm"
                  style={{ width: sz.box, height: sz.box, backgroundColor: accent, fontSize: sz.num }}
                >
                  {fmt(u.value)}
                </div>
                {showLabels && (
                  <span className="font-semibold text-gray-400 uppercase tracking-widest" style={{ fontSize: sz.lbl }}>
                    {u.label}
                  </span>
                )}
              </div>
            ) : cdStyle === "minimal" ? (
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-extrabold text-gray-900 tabular-nums" style={{ fontSize: sz.num }}>{fmt(u.value)}</span>
                {showLabels && <span className="font-medium text-gray-400 uppercase tracking-widest" style={{ fontSize: sz.lbl }}>{u.label}</span>}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-0.5">
                <span className="font-extrabold tabular-nums" style={{ fontSize: sz.num, color: accent }}>{fmt(u.value)}</span>
                {showLabels && <span className="font-medium text-gray-400" style={{ fontSize: sz.lbl }}>{u.label}</span>}
              </div>
            )}
            {i < units.length - 1 && (
              <span
                className="font-bold text-gray-300 tabular-nums"
                style={{ fontSize: sz.sep, marginBottom: showLabels ? "18px" : "0" }}
              >
                :
              </span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// ─── Carousel Renderer (interactive slides) ───────────────────────────────────

function CarouselRenderer({ element, s }: { element: CanvasElement; s: React.CSSProperties }) {
  const slides = (element.props?.slides as Array<{ image?: string; title?: string; description?: string; color?: string; cta?: string }>) || [
    { title: "Slide One", description: "Your first slide content goes here.", color: "#6366f1" },
    { title: "Slide Two", description: "Add images, text, or any content.", color: "#8b5cf6" },
    { title: "Slide Three", description: "Fully customizable carousel slides.", color: "#a855f7" },
  ];
  const nav = (element.props?.navigation as string) || "both";
  const dotStyle = (element.props?.dotStyle as string) || "dot";
  const effect = (element.props?.effect as string) || "slide";
  const accent = (element.props?.accentColor as string) || "#6366f1";
  const autoplay = element.props?.autoplay === true;
  const autoplayDelay = (element.props?.autoplayDelay as number) || 3000;
  const slideH = (element.props?.height as string) || "240px";

  const [idx, setIdx] = useState(0);
  const total = slides.length;

  const prev = useCallback(() => setIdx((i) => (i - 1 + total) % total), [total]);
  const next = useCallback(() => setIdx((i) => (i + 1) % total), [total]);

  useEffect(() => {
    if (!autoplay) return;
    const t = setInterval(next, autoplayDelay);
    return () => clearInterval(t);
  }, [autoplay, autoplayDelay, next]);

  const slide = slides[idx];

  return (
    <div style={s} className="w-full select-none">
      <div className="relative w-full overflow-hidden rounded-2xl" style={{ height: slideH }}>
        {/* Slides strip — slide effect */}
        {effect === "fade" ? (
          slides.map((sl, i) => (
            <div
              key={i}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-16 py-12 text-center transition-opacity duration-500"
              style={{
                opacity: i === idx ? 1 : 0,
                pointerEvents: i === idx ? "auto" : "none",
                backgroundColor: sl.color || accent,
                backgroundImage: sl.image ? `url(${sl.image})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!sl.image && <>
                {sl.title && <h3 className="text-white text-2xl font-extrabold tracking-tight drop-shadow">{sl.title}</h3>}
                {sl.description && <p className="text-white/80 text-sm max-w-xs leading-relaxed">{sl.description}</p>}
                {sl.cta && <button className="mt-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/40 transition-colors">{sl.cta}</button>}
              </>}
            </div>
          ))
        ) : (
          <div
            className="flex h-full transition-transform duration-400 ease-out"
            style={{ transform: `translateX(-${idx * 100}%)`, width: `${total * 100}%` }}
          >
            {slides.map((sl, i) => (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-3 px-16 py-12 text-center h-full"
                style={{ width: `${100 / total}%`, backgroundColor: sl.color || accent, backgroundImage: sl.image ? `url(${sl.image})` : undefined, backgroundSize: "cover", backgroundPosition: "center" }}
              >
                {!sl.image && <>
                  {sl.title && <h3 className="text-white text-2xl font-extrabold tracking-tight drop-shadow">{sl.title}</h3>}
                  {sl.description && <p className="text-white/80 text-sm max-w-xs leading-relaxed">{sl.description}</p>}
                  {sl.cta && <button className="mt-2 bg-white/20 hover:bg-white/30 text-white text-sm font-semibold px-5 py-2 rounded-full border border-white/40 transition-colors">{sl.cta}</button>}
                </>}
              </div>
            ))}
          </div>
        )}

        {/* Arrow navigation */}
        {(nav === "arrows" || nav === "both") && (
          <>
            <button
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all text-lg font-bold z-10"
            >
              ‹
            </button>
            <button
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 shadow-md flex items-center justify-center text-gray-700 hover:bg-white hover:scale-110 transition-all text-lg font-bold z-10"
            >
              ›
            </button>
          </>
        )}

        {/* Slide counter */}
        <div className="absolute top-3 right-3 bg-black/40 text-white text-xs font-medium px-2 py-0.5 rounded-full z-10">
          {idx + 1} / {total}
        </div>
      </div>

      {/* Dot / bar navigation */}
      {(nav === "dots" || nav === "both") && (
        <div className="flex justify-center gap-2 mt-3">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setIdx(i)}
              className="rounded-full transition-all duration-300"
              style={{
                width: dotStyle === "bar" ? (i === idx ? "28px" : "8px") : "8px",
                height: "8px",
                backgroundColor: i === idx ? accent : "#d1d5db",
              }}
            />
          ))}
        </div>
      )}

      {/* Swipe hint for touch */}
      {nav === "none" && (
        <p className="text-center text-xs text-gray-400 mt-2">Swipe or use arrows to navigate</p>
      )}
    </div>
  );
}

// ─── Sortable Element Wrapper ─────────────────────────────────────────────────

const SortableCanvasElement = React.memo(function SortableCanvasElement({ element }: { element: CanvasElement }) {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const elements = useEditorStore((s) => s.elements);
  const selectElement = useEditorStore((s) => s.selectElement);
  const removeElement = useEditorStore((s) => s.removeElement);
  const isPreview = useIsPreview();
  const isSelected = selectedElementId === element.id;

  // Suppress parent hover ring when any descendant of this element is selected
  const isDescendantSelected = React.useMemo(() => {
    if (!selectedElementId || isSelected) return false;
    // Check if selectedElementId lives somewhere inside this element's children tree
    return !!findInTree(element.children ?? [], selectedElementId);
  }, [selectedElementId, isSelected, element.children]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: element.id });

  // In preview mode hidden elements are fully invisible — must be after all hooks
  if (isPreview && element.isHidden) return null;

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  if (isPreview) {
    return <CanvasElementRenderer element={element} />;
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group transition-all duration-150",
        element.isHidden && "opacity-40",
        isDragging && "z-50 shadow-2xl rounded-lg"
      )}
      onClick={(e) => {
        // Locked elements cannot be selected via canvas click
        if (element.isLocked) { e.stopPropagation(); return; }
        e.stopPropagation();
        selectElement(element.id);
      }}
    >
      {/* Selection / hover overlay — pointer-events-none so it never blocks child clicks */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none rounded-[inherit] z-[100] transition-all duration-150",
          isSelected
            ? "ring-2 ring-indigo-500 ring-inset"
            : isDescendantSelected
              ? ""
              : "opacity-0 group-hover:opacity-100 ring-1 ring-indigo-200 ring-inset"
        )}
      />

      {/* Hidden badge */}
      {element.isHidden && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 z-[201] pointer-events-none">
          <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-800/70 text-white leading-none">
            <EyeOff className="w-2.5 h-2.5" /> hidden
          </span>
        </div>
      )}

      {/* Lock badge + block-interaction shield */}
      {element.isLocked && (
        <>
          <div className="absolute inset-0 z-[199] cursor-not-allowed" onClick={(e) => e.stopPropagation()} />
          <div className="absolute top-1 left-1/2 -translate-x-1/2 z-[201] pointer-events-none">
            <span className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-amber-600/80 text-white leading-none">
              <Lock className="w-2.5 h-2.5" /> locked
            </span>
          </div>
        </>
      )}

      {/* Minimal controls — hidden for locked elements */}
      {!element.isLocked && (
        <div className={cn(
          "absolute top-1.5 right-1.5 z-[200] flex items-center gap-1 transition-opacity",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}>
          <div
            {...attributes}
            {...listeners}
            className="h-5 w-5 flex items-center justify-center cursor-grab active:cursor-grabbing opacity-40 hover:opacity-70"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="h-3.5 w-3.5" />
          </div>
          <button
            className="h-5 w-5 flex items-center justify-center opacity-40 hover:opacity-70 transition-opacity"
            onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
          >
            <Trash2 className="h-3 w-3 text-red-400" />
          </button>
        </div>
      )}

      <CanvasElementRenderer element={element} />
    </div>
  );
});

// ─── Drop Zone ────────────────────────────────────────────────────────────────

function DropZone() {
  const { isOver, setNodeRef } = useDroppable({ id: "canvas-drop-zone" });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "m-4 min-h-20 rounded-2xl border-2 border-dashed flex items-center justify-center gap-2 transition-all",
        isOver
          ? "border-indigo-400 bg-indigo-50 text-indigo-500"
          : "border-gray-200 bg-gray-50/50 text-gray-400"
      )}
    >
      <Plus className="h-4 w-4" />
      <p className="text-sm font-medium">
        {isOver ? "Release to drop element" : "Drag an element from the left panel"}
      </p>
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyCanvasState() {
  return (
    <div className="flex flex-col items-center justify-center py-32 px-8 text-center select-none">
      <div className="relative mb-8">
        <div className="h-20 w-20 rounded-3xl bg-gradient-to-br from-indigo-50 to-violet-100 flex items-center justify-center shadow-sm border border-indigo-100/60">
          <MousePointer className="h-8 w-8 text-indigo-400" />
        </div>
        <div className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-indigo-500 flex items-center justify-center">
          <span className="text-white text-[10px] font-bold">+</span>
        </div>
      </div>
      <h3 className="text-xl font-700 text-gray-800 mb-2 font-semibold tracking-tight">Your canvas is empty</h3>
      <p className="text-gray-400 text-sm max-w-[260px] leading-relaxed mb-8">
        Open the <span className="font-semibold text-gray-600">Sections</span> panel on the left and drag a block to get started.
      </p>
      <div className="grid grid-cols-3 gap-2 w-full max-w-[300px]">
        {[
          { label: "Hero", color: "bg-indigo-50 text-indigo-600 border-indigo-100" },
          { label: "Features", color: "bg-violet-50 text-violet-600 border-violet-100" },
          { label: "Pricing", color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
          { label: "Testimonials", color: "bg-amber-50 text-amber-600 border-amber-100" },
          { label: "CTA", color: "bg-rose-50 text-rose-600 border-rose-100" },
          { label: "Footer", color: "bg-gray-50 text-gray-500 border-gray-100" },
        ].map((el) => (
          <span key={el.label} className={`px-3 py-2 rounded-xl border text-xs font-semibold ${el.color}`}>{el.label}</span>
        ))}
      </div>
    </div>
  );
}

// ─── Auth Gate Renderer ───────────────────────────────────────────────────────

function AuthGateRenderer({ element }: { element: CanvasElement }) {
  const { user: siteUser } = useSiteAuth();
  const isPreview = useIsPreview();
  const message = (element.props?.message as string) || "Sign in to view this content.";
  const accentColor = (element.props?.accentColor as string) || "#6366F1";

  if (isPreview && !siteUser) {
    return (
      <div style={{ padding: "64px 40px", textAlign: "center", backgroundColor: "#F8FAFC", borderRadius: "20px", border: "2px dashed #E2E8F0", ...element.styles as React.CSSProperties }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔒</div>
        <p style={{ fontSize: "18px", fontWeight: "700", color: "#1E293B", marginBottom: "8px" }}>{message}</p>
        <p style={{ fontSize: "14px", color: "#64748B", marginBottom: "24px" }}>You need to be signed in to see this content.</p>
        <a href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "12px 24px", backgroundColor: accentColor, color: "#FFFFFF", borderRadius: "10px", fontWeight: "600", fontSize: "14px", textDecoration: "none" }}>
          Sign in
        </a>
      </div>
    );
  }

  // Editor mode or authenticated — show placeholder
  if (!isPreview) {
    return (
      <div style={{ padding: "48px 40px", textAlign: "center", backgroundColor: "#F8FAFC", borderRadius: "20px", border: "2px dashed #E2E8F0", ...element.styles as React.CSSProperties }}>
        <div style={{ fontSize: "32px", marginBottom: "12px" }}>🔐</div>
        <p style={{ fontSize: "15px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>Auth Gate</p>
        <p style={{ fontSize: "12px", color: "#9CA3AF" }}>Protected content — visible to signed-in users only in preview.</p>
      </div>
    );
  }

  // Authenticated — render children if any, otherwise a placeholder
  return (
    <div style={{ ...(element.styles as React.CSSProperties) }}>
      {element.children && element.children.length > 0
        ? element.children.map((child) => <CanvasElementRenderer key={child.id} element={child} />)
        : <div style={{ padding: "32px", textAlign: "center", color: "#64748B" }}>Gated content (visible when signed in)</div>
      }
    </div>
  );
}

// ─── User Profile Card Renderer ───────────────────────────────────────────────

function UserProfileCardRenderer({ element }: { element: CanvasElement }) {
  const { user: siteUser, signOut } = useSiteAuth();
  const isPreview = useIsPreview();
  const accentColor = (element.props?.accentColor as string) || "#6366F1";
  const showLogout = element.props?.showLogout !== false;

  const name = (isPreview && siteUser) ? (siteUser.name || siteUser.email) : "John Doe";
  const email = (isPreview && siteUser) ? siteUser.email : "user@example.com";
  const initials = name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "16px 20px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: "320px", ...(element.styles as React.CSSProperties) }}>
      <div style={{ width: "44px", height: "44px", borderRadius: "50%", backgroundColor: accentColor, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF", fontWeight: "700", fontSize: "16px", flexShrink: 0 }}>
        {initials}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: "14px", fontWeight: "700", color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</p>
        <p style={{ fontSize: "12px", color: "#64748B", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{email}</p>
      </div>
      {showLogout && (
        <button
          onClick={() => isPreview && signOut()}
          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #FCA5A5", backgroundColor: "#FFF1F2", color: "#EF4444", fontSize: "12px", fontWeight: "600", cursor: "pointer", flexShrink: 0 }}
        >
          Sign out
        </button>
      )}
    </div>
  );
}

// ─── Logout Button Renderer ───────────────────────────────────────────────────

function LogoutButtonRenderer({ element }: { element: CanvasElement }) {
  const { signOut } = useSiteAuth() as { signOut: () => Promise<void> };
  const isPreview = useIsPreview();
  const label = element.content || "Sign out";

  return (
    <button
      onClick={() => isPreview && signOut()}
      style={{ ...(element.styles as React.CSSProperties), cursor: "pointer" }}
    >
      {label}
    </button>
  );
}

// ─── Main Canvas ──────────────────────────────────────────────────────────────

export default function Canvas() {
  const elements = useEditorStore((s) => s.elements);
  const selectElement = useEditorStore((s) => s.selectElement);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const isPreviewMode = useEditorStore((s) => s.isPreviewMode);
  const zoom = useEditorStore((s) => s.zoom);
  const showGrid = useEditorStore((s) => s.showGrid);
  const siteId = useEditorStore((s) => s.siteId);

  const getSiteById = useSiteStore((s) => s.getSiteById);
  const sortedElements = useMemo(() => [...elements].sort((a, b) => a.order - b.order), [elements]);

  const site = siteId ? getSiteById(siteId) : undefined;
  const authConfig = site?.authConfig;

  const deviceWidth = { desktop: "100%", "large-tablet": "1024px", tablet: "768px", mobile: "390px", "small-mobile": "320px" }[deviceMode];
  const handleCanvasClick = useCallback(() => selectElement(null), [selectElement]);

  const gridOverlayStyle = showGrid ? {
    backgroundImage: `
      linear-gradient(to right, #e2e8f0 1px, transparent 1px),
      linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
    `,
    backgroundSize: "20px 20px"
  } : {
    backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)",
    backgroundSize: "20px 20px"
  };

  return (
    <SiteAuthProvider siteId={siteId ?? "preview"} authConfig={authConfig}>
    <ElementRuntimeProvider>
    <div
      className="flex-1 overflow-auto editor-canvas flex items-start justify-center py-8 px-4 bg-[#f8fafc] relative"
      style={gridOverlayStyle}
      onClick={handleCanvasClick}
    >
      <div
        className="bg-white shadow-2xl min-h-[600px] transition-all duration-300 rounded-lg overflow-hidden"
        style={{ width: deviceWidth, zoom: zoom / 100 }}
      >
        <SortableContext
          items={sortedElements.map((el) => el.id)}
          strategy={verticalListSortingStrategy}
        >
          {sortedElements.map((element) => (
            <SortableCanvasElement key={element.id} element={element} />
          ))}
        </SortableContext>

        {!isPreviewMode && <DropZone />}
        {sortedElements.length === 0 && !isPreviewMode && <EmptyCanvasState />}
      </div>

    </div>
    </ElementRuntimeProvider>
    </SiteAuthProvider>
  );
}
