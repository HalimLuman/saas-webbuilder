"use client";

/**
 * Shared template UI components used across:
 *  - /templates (public marketing page)
 *  - /dashboard/templates
 *  - /dashboard/sites/new (template picker step)
 *
 * All three surfaces use the same TemplateThumbnail, TemplateCard,
 * TemplatePreviewModal, and TemplateGallery.
 */

import React, { useState, useMemo } from "react";
import {
  Eye, ArrowRight, X, Check, Star, Search, Globe, Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, generateId } from "@/lib/utils";
import { SITE_TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/site-templates";
import type { SiteTemplate } from "@/lib/site-templates";
import { CanvasElementRenderer } from "@/components/editor/canvas";
import { SECTION_BLOCKS } from "@/lib/section-blocks";
import type { CanvasElement } from "@/lib/types";

// ─── Live preview helpers ──────────────────────────────────────────────────────

/**
 * Hydrate the first N elements from a template's home page into full
 * CanvasElements so CanvasElementRenderer can render them.
 */
function getPreviewElements(template: SiteTemplate, maxBlocks = 4): CanvasElement[] {
  const homePage = template.pages.find((p) => p.isHome) ?? template.pages[0];
  const results: CanvasElement[] = [];

  for (const rawEl of homePage.elements.slice(0, maxBlocks)) {
    const blockName = rawEl.name ?? "";
    const match = SECTION_BLOCKS.find(
      (b) =>
        b.name === blockName ||
        b.id.includes(blockName.toLowerCase().replace(/\s+/g, "-")),
    );

    const element: CanvasElement = {
      id: generateId(),
      type: rawEl.type,
      content: rawEl.content ?? "",
      name: rawEl.name,
      order: rawEl.order,
      styles: (rawEl.styles ?? {}) as CanvasElement["styles"],
      props: rawEl.props,
      children: match
        ? (match.element.children as CanvasElement[] | undefined)
        : (rawEl.children as CanvasElement[] | undefined),
    };
    results.push(element);
  }
  return results;
}

// ─── Thumbnail (card size — scale 0.22) ───────────────────────────────────────

export function TemplateThumbnail({ template }: { template: SiteTemplate }) {
  const elements = useMemo(() => getPreviewElements(template, 3), [template]);

  return (
    <div className="h-full overflow-hidden relative bg-white">
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{ width: `${100 / 0.22}%`, transform: "scale(0.22)" }}
      >
        {elements.map((el) => (
          <CanvasElementRenderer key={el.id} element={el} />
        ))}
      </div>
      {/* Subtle accent tint */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${template.accentHex}40, transparent)` }}
      />
      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-white/80 to-transparent pointer-events-none" />
    </div>
  );
}

// ─── Preview (modal size — scale 0.38) ────────────────────────────────────────

function TemplatePreview({ template }: { template: SiteTemplate }) {
  const elements = useMemo(() => getPreviewElements(template, 5), [template]);

  return (
    <div className="h-full overflow-hidden relative bg-white">
      <div
        className="absolute top-0 left-0 origin-top-left pointer-events-none"
        style={{ width: `${100 / 0.38}%`, transform: "scale(0.38)" }}
      >
        {elements.map((el) => (
          <CanvasElementRenderer key={el.id} element={el} />
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-white/95 to-transparent pointer-events-none" />
    </div>
  );
}

// ─── Card ──────────────────────────────────────────────────────────────────────

interface TemplateCardProps {
  template: SiteTemplate;
  /** Called when the user clicks the "Use" / "Select" action button */
  onUse: () => void;
  /** Called when the user opens the preview modal. Omit to hide Preview button. */
  onPreview?: () => void;
  /** When true renders a selected ring + checkmark instead of hover overlay */
  selected?: boolean;
  /** Label for the action button. Defaults to "Use" */
  useLabel?: string;
}

export function TemplateCard({
  template,
  onUse,
  onPreview,
  selected = false,
  useLabel = "Use",
}: TemplateCardProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className={cn(
        "group bg-white rounded-2xl border-2 overflow-hidden transition-all cursor-pointer",
        selected
          ? "border-indigo-500 shadow-md shadow-indigo-100"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md",
      )}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onUse}
    >
      {/* Thumbnail */}
      <div className="h-44 relative overflow-hidden bg-gray-50">
        <TemplateThumbnail template={template} />

        {/* Tier badge — top left */}
        <div className={cn(
          "absolute top-2 left-2 text-[9px] font-bold px-1.5 py-0.5 rounded border bg-white z-10",
          template.tier === "free" ? "text-emerald-700 border-emerald-200" : "text-amber-700 border-amber-200",
        )}>
          {template.tier.toUpperCase()}
        </div>

        {/* Selected checkmark — top right */}
        {selected && (
          <div className="absolute top-2 right-2 h-6 w-6 rounded-full bg-indigo-500 flex items-center justify-center shadow-sm z-10">
            <Check className="h-3.5 w-3.5 text-white" />
          </div>
        )}

        {/* Hover overlay (only when not selected) */}
        {!selected && hovered && (
          <div
            className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 z-10"
            onClick={(e) => e.stopPropagation()}
          >
            {onPreview && (
              <button
                onClick={(e) => { e.stopPropagation(); onPreview(); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white text-gray-800 text-xs font-medium hover:bg-gray-50 transition-colors shadow"
              >
                <Eye className="h-3 w-3" /> Preview
              </button>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); onUse(); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500 text-white text-xs font-medium hover:bg-indigo-600 transition-colors shadow"
            >
              <ArrowRight className="h-3 w-3" /> {useLabel}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-gray-100">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate leading-tight">{template.name}</p>
            <p className="text-[11px] text-gray-400 capitalize truncate mt-0.5">{template.category.replace(/-/g, " ")}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0 mt-0.5">
            <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
            <span className="text-xs text-gray-500">{template.pages.length}p</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Preview modal ─────────────────────────────────────────────────────────────

interface TemplatePreviewModalProps {
  template: SiteTemplate;
  onClose: () => void;
  /** Called when the user clicks the primary action in the modal */
  onUse: () => void;
  /** Label for the action button. Defaults to "Use This Template" */
  useLabel?: string;
}

export function TemplatePreviewModal({
  template,
  onClose,
  onUse,
  useLabel = "Use This Template",
}: TemplatePreviewModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2.5 mb-0.5">
              <h3 className="text-lg font-bold text-gray-900">{template.name}</h3>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full border",
                template.tier === "free"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-amber-50 text-amber-700 border-amber-200",
              )}>
                {template.tier.toUpperCase()}
              </span>
            </div>
            <p className="text-sm text-gray-500">
              {template.category} · {template.pages.length} pages · {template.preview.length} sections
            </p>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Browser chrome + live preview */}
        <div className="mx-4 mt-4 rounded-xl overflow-hidden border border-gray-200 shadow-inner">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
            </div>
            <div className="flex-1 h-5 bg-white rounded-md border border-gray-200 flex items-center px-2">
              <span className="text-[10px] text-gray-400 truncate">
                https://{template.name.toLowerCase().replace(/\s+/g, "-")}.buildstack.app
              </span>
            </div>
          </div>
          <div className="h-96">
            <TemplatePreview template={template} />
          </div>
        </div>

        {/* Pages + features */}
        <div className="px-6 pt-4 pb-2 flex gap-6">
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 mb-2">Pages included</p>
            <div className="flex flex-wrap gap-1.5">
              {template.pages.map((p) => (
                <span key={p.slug} className="text-[11px] bg-gray-50 border border-gray-200 text-gray-600 px-2 py-0.5 rounded font-medium">
                  {p.name}
                </span>
              ))}
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-500 mb-2">What&apos;s included</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1">
              {template.features.map((f) => (
                <div key={f} className="flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span className="text-xs text-gray-600">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className="flex items-center gap-1.5 flex-wrap px-6 pb-2">
          {template.tags.map((tag) => (
            <span key={tag} className="px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 text-[10px] font-medium">
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={onUse} className="gap-2">
            {useLabel} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Gallery (sidebar + grid) ──────────────────────────────────────────────────

interface TemplateGalleryProps {
  /** Called when the user confirms "Use Template" (from card or modal) */
  onUse: (template: SiteTemplate) => void;
  /** Label for the use action. Defaults to "Use" */
  useLabel?: string;
  /**
   * When provided, the gallery operates in "select" mode:
   * clicking a card calls onSelect instead of onUse,
   * and the card with this id shows a selected ring.
   */
  selectedId?: string | null;
  onSelect?: (template: SiteTemplate) => void;
  /** Show a "Start from blank" button in the sidebar */
  onBlank?: () => void;
  /** Extra content rendered below the grid */
  footer?: React.ReactNode;
}

export function TemplateGallery({
  onUse,
  useLabel = "Use",
  selectedId,
  onSelect,
  onBlank,
  footer,
}: TemplateGalleryProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [preview, setPreview] = useState<SiteTemplate | null>(null);

  const selectMode = onSelect !== undefined;

  const filtered = SITE_TEMPLATES.filter((t) => {
    const matchCat = activeCategory === "all" || t.category === activeCategory;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="flex gap-6 min-h-0">
        {/* Sidebar */}
        <aside className="w-52 shrink-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="search"
              placeholder="Search templates…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-gray-200 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-2">Category</p>
          <nav className="space-y-0.5">
            {TEMPLATE_CATEGORIES.map((cat) => {
              const count = cat.id === "all"
                ? SITE_TEMPLATES.length
                : SITE_TEMPLATES.filter((t) => t.category === cat.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left",
                    activeCategory === cat.id
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <span>{cat.label}</span>
                  <span className={cn(
                    "text-[10px] rounded-full px-1.5 font-medium tabular-nums",
                    activeCategory === cat.id ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400",
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>

          {onBlank && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <button
                onClick={onBlank}
                className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors border border-dashed border-gray-200"
              >
                <Layers className="h-3.5 w-3.5 shrink-0" />
                Start from blank
              </button>
            </div>
          )}
        </aside>

        {/* Grid */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-500">
              <span className="font-semibold text-gray-900">{filtered.length}</span> templates
              {activeCategory !== "all" && ` in ${TEMPLATE_CATEGORIES.find((c) => c.id === activeCategory)?.label}`}
            </p>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24 text-gray-400">
              <Globe className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p className="text-sm font-medium">No templates match your search</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((t) => (
                <TemplateCard
                  key={t.id}
                  template={t}
                  selected={selectMode ? selectedId === t.id : false}
                  onPreview={() => setPreview(t)}
                  onUse={() => {
                    if (selectMode) {
                      onSelect!(t);
                    } else {
                      onUse(t);
                    }
                  }}
                  useLabel={selectMode ? "Select" : useLabel}
                />
              ))}
            </div>
          )}

          {footer}
        </div>
      </div>

      {preview && (
        <TemplatePreviewModal
          template={preview}
          onClose={() => setPreview(null)}
          onUse={() => {
            if (selectMode) {
              onSelect!(preview);
            } else {
              onUse(preview);
            }
            setPreview(null);
          }}
          useLabel={selectMode ? "Select Template" : useLabel}
        />
      )}
    </>
  );
}
