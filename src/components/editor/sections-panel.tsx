"use client";

import React, { useState, useMemo } from "react";
import {
  Search, X, LayoutTemplate, Plus, Check, ChevronDown, Layers,
  Sparkles, SlidersHorizontal,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { SECTION_BLOCKS, SECTION_CATEGORIES, DESIGN_STYLES } from "@/lib/section-blocks";
import { cn } from "@/lib/utils";

// ── Category accent colors ────────────────────────────────────────────────────
const CATEGORY_COLOR: Record<string, { bg: string; text: string; dot: string; emoji: string }> = {
  all:          { bg: "bg-gray-100",    text: "text-gray-700",   dot: "bg-gray-400",   emoji: "✦"  },
  hero:         { bg: "bg-violet-100",  text: "text-violet-700", dot: "bg-violet-500", emoji: "⚡" },
  features:     { bg: "bg-indigo-100",  text: "text-indigo-700", dot: "bg-indigo-500", emoji: "◈"  },
  services:     { bg: "bg-sky-100",     text: "text-sky-700",    dot: "bg-sky-500",    emoji: "🛠" },
  cta:          { bg: "bg-pink-100",    text: "text-pink-700",   dot: "bg-pink-500",   emoji: "🎯" },
  testimonials: { bg: "bg-amber-100",   text: "text-amber-700",  dot: "bg-amber-500",  emoji: "💬" },
  pricing:      { bg: "bg-emerald-100", text: "text-emerald-700",dot: "bg-emerald-500",emoji: "💎" },
  content:      { bg: "bg-cyan-100",    text: "text-cyan-700",   dot: "bg-cyan-500",   emoji: "📄" },
  stats:        { bg: "bg-teal-100",    text: "text-teal-700",   dot: "bg-teal-500",   emoji: "📊" },
  auth:         { bg: "bg-red-100",     text: "text-red-700",    dot: "bg-red-500",    emoji: "🔐" },
  team:         { bg: "bg-yellow-100",  text: "text-yellow-700", dot: "bg-yellow-500", emoji: "👥" },
  faq:          { bg: "bg-slate-100",   text: "text-slate-700",  dot: "bg-slate-400",  emoji: "❓" },
  "logo-cloud": { bg: "bg-stone-100",   text: "text-stone-700",  dot: "bg-stone-400",  emoji: "☁️" },
  contact:      { bg: "bg-teal-100",    text: "text-teal-700",   dot: "bg-teal-500",   emoji: "✉️" },
  navbar:       { bg: "bg-gray-100",    text: "text-gray-600",   dot: "bg-gray-400",   emoji: "☰"  },
  sidebar:      { bg: "bg-gray-100",    text: "text-gray-600",   dot: "bg-gray-400",   emoji: "▣"  },
  footer:       { bg: "bg-gray-100",    text: "text-gray-600",   dot: "bg-gray-400",   emoji: "▬"  },
  blog:         { bg: "bg-orange-100",  text: "text-orange-700", dot: "bg-orange-500", emoji: "✍️" },
  portfolio:    { bg: "bg-violet-100",  text: "text-violet-700", dot: "bg-violet-500", emoji: "🖼"  },
  ecommerce:    { bg: "bg-emerald-100", text: "text-emerald-700",dot: "bg-emerald-500",emoji: "🛒" },
  dashboard:    { bg: "bg-blue-100",    text: "text-blue-700",   dot: "bg-blue-500",   emoji: "⬛" },
  saas:         { bg: "bg-indigo-100",  text: "text-indigo-700", dot: "bg-indigo-500", emoji: "🚀" },
  utility:      { bg: "bg-gray-100",    text: "text-gray-600",   dot: "bg-gray-400",   emoji: "⚙️" },
  interactive:  { bg: "bg-purple-100",  text: "text-purple-700", dot: "bg-purple-500", emoji: "✨" },
  landing:      { bg: "bg-rose-100",    text: "text-rose-700",   dot: "bg-rose-500",   emoji: "🏠" },
};

// ── Style definitions ─────────────────────────────────────────────────────────
const STYLE_META: Record<string, { dot: string; label: string; desc: string }> = {
  all:       { dot: "bg-gray-300",    label: "Any Style",      desc: "All design styles" },
  minimal:   { dot: "bg-gray-500",    label: "Minimal",        desc: "Clean & spacious" },
  modern:    { dot: "bg-blue-500",    label: "Modern",         desc: "Sleek & polished" },
  dark:      { dot: "bg-gray-800",    label: "Dark",           desc: "Dark backgrounds" },
  glass:     { dot: "bg-cyan-400",    label: "Glassmorphism",  desc: "Frosted glass effect" },
  bold:      { dot: "bg-orange-500",  label: "Bold",           desc: "Strong & impactful" },
  corporate: { dot: "bg-blue-800",    label: "Corporate",      desc: "Professional look" },
  playful:   { dot: "bg-purple-500",  label: "Playful",        desc: "Fun & colorful" },
  creative:  { dot: "bg-pink-500",    label: "Creative",       desc: "Artistic & unique" },
};

// ── Block Card ───────────────────────────────────────────────────────────────
type BlockType = (typeof SECTION_BLOCKS)[number];

function BlockCard({
  block,
  isAdded,
  onAdd,
}: {
  block: BlockType;
  isAdded: boolean;
  onAdd: (id: string) => void;
}) {
  const cat   = CATEGORY_COLOR[block.category] ?? CATEGORY_COLOR.all;
  const style = STYLE_META[block.designStyle ?? "modern"] ?? STYLE_META.all;

  return (
    <div
      onClick={() => onAdd(block.id)}
      className={cn(
        "group relative flex items-start gap-3 px-3 py-3 rounded-2xl border transition-all duration-150 cursor-pointer",
        isAdded
          ? "border-emerald-200 bg-emerald-50/60 shadow-sm"
          : "border-gray-100 bg-white hover:border-indigo-200 hover:shadow-md hover:shadow-indigo-50/60 hover:bg-indigo-50/10"
      )}
    >
      {/* Category icon */}
      <div className={cn(
        "w-9 h-9 rounded-xl shrink-0 flex items-center justify-center text-[15px] leading-none mt-0.5 transition-transform duration-150",
        cat.bg,
        "group-hover:scale-110"
      )}>
        {cat.emoji}
      </div>

      {/* Text content */}
      <div className="flex-1 min-w-0 pr-7">
        <p className="text-[11.5px] font-bold text-gray-800 leading-snug truncate mb-0.5">
          {block.name}
        </p>
        <p className="text-[10px] text-gray-400 leading-relaxed line-clamp-2">
          {block.description}
        </p>

        {/* Tags row */}
        <div className="flex items-center gap-1 mt-2 flex-wrap">
          <span className={cn("inline-flex items-center text-[9px] font-bold px-1.5 py-0.5 rounded-md leading-none", cat.bg, cat.text)}>
            {block.category}
          </span>
          <span className="inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 leading-none">
            <span className={cn("w-1.5 h-1.5 rounded-full", style.dot)} />
            {block.designStyle ?? "modern"}
          </span>
        </div>
      </div>

      {/* Add / check button */}
      <button
        onClick={(e) => { e.stopPropagation(); onAdd(block.id); }}
        aria-label={isAdded ? "Added" : "Add block"}
        className={cn(
          "absolute top-3 right-3 w-6 h-6 rounded-lg flex items-center justify-center transition-all duration-150 shrink-0",
          isAdded
            ? "bg-emerald-500 text-white scale-100 opacity-100"
            : "bg-indigo-100 text-indigo-600 opacity-0 group-hover:opacity-100 hover:bg-indigo-600 hover:text-white"
        )}
      >
        {isAdded ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3" />}
      </button>
    </div>
  );
}

// ── Picker drawer ─────────────────────────────────────────────────────────────

function CategoryPicker({
  active,
  onPick,
}: {
  active: string;
  onPick: (id: string) => void;
}) {
  const cats = SECTION_CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="border-b border-indigo-100/70 bg-indigo-50/40 px-3 py-3 shrink-0">
      <p className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.16em] mb-3 px-0.5">
        Category
      </p>
      <div className="max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
        {/* All button */}
        <button
          onClick={() => onPick("all")}
          className={cn(
            "w-full flex items-center gap-2 px-3 py-2 rounded-xl border text-left mb-2 transition-all duration-100",
            active === "all"
              ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
              : "bg-white border-gray-100 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50"
          )}
        >
          <span className="text-[13px]">✦</span>
          <span className="text-[10px] font-bold">All categories</span>
        </button>
        <div className="grid grid-cols-3 gap-1.5">
          {cats.map((cat) => {
            const meta = CATEGORY_COLOR[cat.id];
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onPick(cat.id)}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border transition-all duration-100",
                  isActive
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                    : "bg-white border-gray-100 text-gray-600 hover:border-indigo-200 hover:bg-indigo-50"
                )}
              >
                <span className="text-[14px] leading-none">{meta?.emoji}</span>
                <span className="text-[8.5px] font-bold leading-tight text-center line-clamp-1">{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StylePicker({
  active,
  onPick,
}: {
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="border-b border-gray-200 bg-gray-50/60 px-3 py-3 shrink-0">
      <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.16em] mb-3 px-0.5">
        Design Style
      </p>
      <div className="grid grid-cols-2 gap-1.5">
        {DESIGN_STYLES.map((st) => {
          const meta = STYLE_META[st.id];
          const isActive = active === st.id;
          return (
            <button
              key={st.id}
              onClick={() => onPick(st.id)}
              className={cn(
                "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-all duration-100",
                isActive
                  ? "bg-gray-900 border-gray-900 text-white shadow-sm"
                  : "bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-100"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full shrink-0", meta?.dot)} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-[10px] font-bold leading-none truncate">{meta?.label}</p>
                <p className={cn("text-[9px] leading-none mt-0.5 truncate", isActive ? "text-gray-400" : "text-gray-400")}>
                  {meta?.desc}
                </p>
              </div>
              {isActive && <Check className="w-3 h-3 shrink-0 text-indigo-400" />}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Main panel ───────────────────────────────────────────────────────────────
export default function SectionsPanel() {
  const { addElementFromDrag } = useEditorStore();

  const [search,      setSearch]      = useState("");
  const [category,    setCategory]    = useState("all");
  const [styleFilter, setStyleFilter] = useState("all");
  const [addedId,     setAddedId]     = useState<string | null>(null);
  const [openPicker,  setOpenPicker]  = useState<"category" | "style" | null>(null);

  function togglePicker(picker: "category" | "style") {
    setOpenPicker((prev) => (prev === picker ? null : picker));
  }

  function pickCategory(id: string) { setCategory(id); setOpenPicker(null); }
  function pickStyle(id: string)    { setStyleFilter(id); setOpenPicker(null); }

  function resetAll() {
    setSearch(""); setCategory("all"); setStyleFilter("all"); setOpenPicker(null);
  }

  const filtered = useMemo(() => {
    return SECTION_BLOCKS.filter((b) => {
      if (category    !== "all" && b.category    !== category) return false;
      if (styleFilter !== "all" && (b.designStyle ?? "modern") !== styleFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!b.name.toLowerCase().includes(q) && !b.description.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [search, category, styleFilter]);

  const grouped = useMemo<Map<string, BlockType[]> | null>(() => {
    if (category !== "all" || search || styleFilter !== "all") return null;
    const map = new Map<string, BlockType[]>();
    for (const cat of SECTION_CATEGORIES) {
      if (cat.id === "all") continue;
      const blocks = filtered.filter((b) => b.category === cat.id);
      if (blocks.length > 0) map.set(cat.id, blocks);
    }
    return map;
  }, [filtered, category, search, styleFilter]);

  function handleAdd(id: string) {
    const block = SECTION_BLOCKS.find((b) => b.id === id);
    if (!block) return;
    addElementFromDrag(block.element);
    setAddedId(id);
    setTimeout(() => setAddedId(null), 1500);
  }

  const hasFilters      = !!(search || category !== "all" || styleFilter !== "all");
  const activeCatMeta   = CATEGORY_COLOR[category];
  const activeCatLabel  = SECTION_CATEGORIES.find((c) => c.id === category)?.label ?? "All";
  const activeStyleMeta = STYLE_META[styleFilter];

  return (
    <div className="flex flex-col h-full overflow-hidden bg-gray-50/50">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3 border-b border-gray-100 bg-white shrink-0 space-y-3">

        {/* Title row */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-sm shadow-indigo-200/60 shrink-0">
            <LayoutTemplate className="w-3.5 h-3.5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-[13px] font-bold text-gray-900 leading-none">Section Blocks</h2>
            <p className="text-[10px] text-gray-400 mt-0.5 leading-none tabular-nums">
              {filtered.length} of {SECTION_BLOCKS.length} blocks
            </p>
          </div>
          {hasFilters && (
            <button
              onClick={resetAll}
              className="flex items-center gap-1 text-[10px] font-semibold text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50/60 transition-all"
            >
              <X className="w-3 h-3" />
              Reset
            </button>
          )}
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sections…"
            className="w-full pl-9 pr-8 py-2 text-[12px] rounded-xl border border-gray-200 bg-gray-50 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/20 focus:border-indigo-300 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="w-2.5 h-2.5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Filter trigger buttons */}
        <div className="flex gap-2">

          {/* Category button */}
          <button
            onClick={() => togglePicker("category")}
            className={cn(
              "flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold transition-all",
              openPicker === "category"
                ? "border-indigo-400 bg-indigo-600 text-white shadow-sm"
                : category !== "all"
                  ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm"
            )}
          >
            <span className="text-[13px] leading-none shrink-0">{activeCatMeta?.emoji ?? "✦"}</span>
            <span className="flex-1 text-left truncate">
              {category === "all" ? "Category" : activeCatLabel}
            </span>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 shrink-0 transition-transform duration-200",
              openPicker === "category" ? "rotate-180" : ""
            )} />
          </button>

          {/* Style button */}
          <button
            onClick={() => togglePicker("style")}
            className={cn(
              "flex-1 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-semibold transition-all",
              openPicker === "style"
                ? "border-gray-800 bg-gray-900 text-white shadow-sm"
                : styleFilter !== "all"
                  ? "border-gray-700 bg-gray-900 text-white"
                  : "border-gray-200 bg-gray-50 text-gray-600 hover:bg-white hover:border-gray-300 hover:shadow-sm"
            )}
          >
            <SlidersHorizontal className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left truncate">
              {styleFilter === "all" ? "Style" : activeStyleMeta?.label}
            </span>
            <ChevronDown className={cn(
              "w-3.5 h-3.5 shrink-0 transition-transform duration-200",
              openPicker === "style" ? "rotate-180" : ""
            )} />
          </button>

        </div>
      </div>

      {/* ── Category picker ───────────────────────────────────────── */}
      {openPicker === "category" && (
        <CategoryPicker active={category} onPick={pickCategory} />
      )}

      {/* ── Style picker ──────────────────────────────────────────── */}
      {openPicker === "style" && (
        <StylePicker active={styleFilter} onPick={pickStyle} />
      )}

      {/* ── Block list ───────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3">

        {filtered.length === 0 ? (

          /* Empty state */
          <div className="flex flex-col items-center justify-center h-40 gap-3 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
              <Layers className="w-5 h-5 text-gray-300" />
            </div>
            <div>
              <p className="text-[12px] font-semibold text-gray-600">No blocks found</p>
              <p className="text-[10px] text-gray-400 mt-1 leading-relaxed">
                Try a different search or adjust your filters
              </p>
            </div>
            {hasFilters && (
              <button
                onClick={resetAll}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>

        ) : grouped ? (

          /* Grouped browse view */
          <div className="space-y-6">
            {Array.from(grouped.entries()).map(([catId, blocks]) => {
              const meta     = CATEGORY_COLOR[catId] ?? CATEGORY_COLOR.all;
              const catLabel = SECTION_CATEGORIES.find((c) => c.id === catId)?.label ?? catId;
              return (
                <div key={catId}>
                  {/* Category heading */}
                  <div className="flex items-center gap-2 mb-2.5 px-0.5">
                    <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center text-[11px]", meta.bg)}>
                      {meta.emoji}
                    </div>
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{catLabel}</span>
                    <div className="flex-1 h-px bg-gray-100 ml-1" />
                    <span className="text-[9px] font-bold text-gray-400 tabular-nums bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {blocks.length}
                    </span>
                  </div>
                  <div className="space-y-1.5">
                    {blocks.map((block) => (
                      <BlockCard
                        key={block.id}
                        block={block}
                        isAdded={addedId === block.id}
                        onAdd={handleAdd}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

        ) : (

          /* Flat filtered view */
          <div className="space-y-1.5">
            {/* Result count banner */}
            {hasFilters && (
              <div className="flex items-center gap-2 px-3 py-2 mb-3 rounded-xl bg-indigo-50/60 border border-indigo-100/80">
                <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                <span className="text-[10px] font-semibold text-indigo-700">
                  {filtered.length} block{filtered.length !== 1 ? "s" : ""} match your filters
                </span>
              </div>
            )}
            {filtered.map((block) => (
              <BlockCard
                key={block.id}
                block={block}
                isAdded={addedId === block.id}
                onAdd={handleAdd}
              />
            ))}
          </div>

        )}
      </div>
    </div>
  );
}
