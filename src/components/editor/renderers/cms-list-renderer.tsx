"use client";

import React, { useEffect, useState } from "react";
import { Database, RefreshCw, ArrowRight, Calendar, Star } from "lucide-react";
import type { CanvasElement } from "@/lib/types";
import { useIsPreview } from "@/lib/preview-context";
import { cn } from "@/lib/utils";

interface CmsItem {
  id: string;
  data: Record<string, unknown>;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CmsCollection {
  id: string;
  name: string;
  slug: string;
  fields?: any[];
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function isImageUrl(str: string) {
  if (!str || typeof str !== "string") return false;
  // Common image extensions
  if (/\.(png|jpe?g|gif|webp|svg|avif)(\?|$)/i.test(str)) return true;
  // Data URLs
  if (str.startsWith("data:image")) return true;
  // Common image hosting services
  if (/images\.unsplash\.com|source\.unsplash\.com|images\.pexels\.com|pixabay\.com|res\.cloudinary\.com/i.test(str)) return true;
  // If it's a URL and we're in an image field, we'll try to render it anyway
  return false;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch { return ""; }
}

function FieldValue({ value, fieldType }: { value: unknown; fieldType?: string }) {
  if (value === null || value === undefined) return null;
  if (typeof value === "boolean") return <span>{value ? "Yes" : "No"}</span>;
  if (typeof value === "object") return <span className="font-mono text-xs">{JSON.stringify(value)}</span>;
  const str = String(value);
  if (fieldType === "image" || isImageUrl(str)) {
    return (
      <div className="relative group/img-val">
        <img src={str} alt="" className="w-full h-32 object-cover rounded-lg border border-gray-100"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      </div>
    );
  }
  return <span className="break-words">{str}</span>;
}

// ── Card style classes ────────────────────────────────────────────────────────

function getCardClasses(cardStyle: string, accentColor: string) {
  switch (cardStyle) {
    case "shadow": return "bg-white rounded-2xl shadow-lg shadow-black/8 hover:shadow-xl hover:shadow-black/12 transition-all duration-300";
    case "glass": return "bg-white/70 backdrop-blur-md border border-white/60 rounded-2xl shadow-md hover:bg-white/80 transition-all duration-300";
    case "flat": return "bg-gray-50 rounded-2xl hover:bg-gray-100 transition-all duration-200";
    case "bordered": return "bg-white rounded-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-200";
    case "colored": return "bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-300 overflow-hidden";
    default: return "bg-white rounded-2xl border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all duration-200";
  }
}

function getImageHeightClass(imageHeight: string) {
  switch (imageHeight) {
    case "sm": return "h-36";
    case "lg": return "h-60";
    case "xl": return "h-80";
    default: return "h-48"; // md
  }
}

function getGapClass(gap: string) {
  switch (gap) {
    case "sm": return "gap-3";
    case "lg": return "gap-8";
    default: return "gap-5"; // md
  }
}

function getColsClass(columns: string | number, layout: string) {
  const c = String(columns);
  if (layout === "grid" || layout === "cards") {
    switch (c) {
      case "2": return "grid-cols-1 sm:grid-cols-2";
      case "4": return "grid-cols-2 lg:grid-cols-4";
      default: return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
    }
  }
  return "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ItemImage({ src, alt, height, cardStyle, accentColor }: {
  src: string; alt: string; height: string; cardStyle: string; accentColor: string;
}) {
  const hClass = getImageHeightClass(height);
  return (
    <div className={cn("w-full overflow-hidden bg-gray-100 relative group-hover:opacity-95 transition-opacity", hClass,
      cardStyle === "colored" ? "" : "rounded-t-2xl"
    )}>
      {cardStyle === "colored" && (
        <div className="absolute top-0 left-0 right-0 h-1" style={{ backgroundColor: accentColor }} />
      )}
      <img src={src} alt={alt} className="w-full h-full object-cover"
        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
    </div>
  );
}

function RatingDisplay({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} className={cn("h-3.5 w-3.5", i <= value ? "text-amber-400 fill-amber-400" : "text-gray-200")} />
      ))}
    </div>
  );
}

function DateBadge({ iso, accentColor }: { iso: string; accentColor: string }) {
  return (
    <div className="flex items-center gap-1 text-xs text-gray-400">
      <Calendar className="h-3 w-3" />
      <span suppressHydrationWarning>{formatDate(iso)}</span>
    </div>
  );
}

function ReadMoreLink({ text, accentColor }: { text: string; accentColor: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-xs font-semibold mt-2 transition-colors"
      style={{ color: accentColor }}>
      {text} <ArrowRight className="h-3 w-3" />
    </span>
  );
}

// ── Main renderer ─────────────────────────────────────────────────────────────

export function CmsListRenderer({ element }: { element: CanvasElement }) {
  const isPreview = useIsPreview();
  const [items, setItems] = useState<CmsItem[]>([]);
  const [collection, setCollection] = useState<CmsCollection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const p = element.props as Record<string, unknown>;
  const collectionSlug = (p?.collectionSlug as string) || "";
  const layout = (p?.layout as string) || "cards";
  const limit = Number(p?.limit) || 6;
  const titleField = (p?.titleField as string) || "";
  const imageField = (p?.imageField as string) || "";
  const descriptionField = (p?.descriptionField as string) || "";
  const dateField = (p?.dateField as string) || "";
  const ratingField = (p?.ratingField as string) || "";
  const showFields = (p?.showFields as string[]) || [];
  const cardStyle = (p?.cardStyle as string) || "default";
  const columns = (p?.columns as string) || "3";
  const imageHeight = (p?.imageHeight as string) || "md";
  const showDate = (p?.showDate as boolean) ?? false;
  const showReadMore = (p?.showReadMore as boolean) ?? false;
  const readMoreText = (p?.readMoreText as string) || "Read more";
  const gap = (p?.gap as string) || "md";
  const accentColor = (p?.accentColor as string) || "#6366f1";
  const badgeField = (p?.badgeField as string) || "";
  const paddingX = (p?.paddingX as string) || "px-6";
  const paddingY = (p?.paddingY as string) || "py-6";

  useEffect(() => {
    if (!collectionSlug) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ slug: collectionSlug, status: "published", limit: String(limit) });
    fetch(`/api/v1/cms/items?${params}`)
      .then((res) => {
        if (!res.ok) return res.json().then((j) => { throw new Error(j.error || `HTTP ${res.status}`); });
        return res.json();
      })
      .then((json) => {
        if (cancelled) return;
        setItems(json.items ?? []);
        setCollection(json.collection ?? null);
      })
      .catch((e) => { if (cancelled) return; setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [collectionSlug, limit]);

  // Editor placeholder
  if (!collectionSlug) {
    return (
      <div className="w-full px-8 py-10">
        <div className="rounded-2xl border-2 border-dashed border-indigo-200 bg-indigo-50/40 p-10 flex flex-col items-center gap-3 text-center">
          <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
            <Database className="h-7 w-7 text-indigo-500" />
          </div>
          <p className="text-sm font-bold text-gray-800">CMS List Block</p>
          <p className="text-xs text-gray-500 max-w-xs leading-relaxed">
            Select a collection in the <strong>Data</strong> tab to display live CMS content here.
          </p>
          <div className="flex gap-2 mt-1 flex-wrap justify-center">
            {["Blog Posts", "Team Members", "Products"].map((t) => (
              <span key={t} className="text-[10px] bg-white border border-indigo-100 text-indigo-500 px-2 py-1 rounded-full font-medium">{t}</span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full px-8 py-10 flex items-center justify-center gap-2 text-gray-400">
        <RefreshCw className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading {collectionSlug}…</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-8 py-6">
        <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-center">
          <p className="text-xs text-red-600 font-semibold">Failed to load "{collectionSlug}"</p>
          <p className="text-xs text-red-400 mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full px-8 py-10">
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <Database className="h-8 w-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">No published items in "{collection?.name || collectionSlug}"</p>
          {!isPreview && <p className="text-xs text-gray-400 mt-1">Publish items in the CMS dashboard to display them here.</p>}
        </div>
      </div>
    );
  }

  // ── Data extraction helpers ───────────────────────────────────────────────

  const getTitle = (item: CmsItem) => {
    if (titleField && item.data[titleField] !== undefined) return String(item.data[titleField]);
    for (const k of ["title", "name", "heading", "label"]) {
      if (item.data[k] !== undefined) return String(item.data[k]);
    }
    return `Item ${item.id.slice(0, 6)}`;
  };

  const getImage = (item: CmsItem): string | null => {
    if (imageField && item.data[imageField]) return String(item.data[imageField]);
    for (const k of ["image", "thumbnail", "photo", "cover", "picture", "avatar"]) {
      if (item.data[k]) {
        const v = String(item.data[k]);
        if (isImageUrl(v)) return v;
      }
    }
    return null;
  };

  const getDescription = (item: CmsItem): string | null => {
    if (descriptionField && item.data[descriptionField]) return String(item.data[descriptionField]);
    for (const k of ["description", "body", "content", "excerpt", "summary", "text", "bio"]) {
      if (item.data[k]) return String(item.data[k]);
    }
    return null;
  };

  const getDate = (item: CmsItem): string | null => {
    if (dateField && item.data[dateField]) return String(item.data[dateField]);
    for (const k of ["date", "published_at", "created_date", "publishedAt"]) {
      if (item.data[k]) return String(item.data[k]);
    }
    return showDate ? item.created_at : null;
  };

  const getRating = (item: CmsItem): number | null => {
    if (ratingField && item.data[ratingField]) {
      const n = Number(item.data[ratingField]);
      if (!isNaN(n)) return Math.min(5, Math.max(0, n));
    }
    return null;
  };

  const getBadge = (item: CmsItem): string | null => {
    if (badgeField && item.data[badgeField]) return String(item.data[badgeField]);
    if (item.data["category"]) return String(item.data["category"]);
    if (item.data["tag"]) return String(item.data["tag"]);
    return null;
  };

  const fieldsToShow = showFields.length > 0
    ? showFields
    : items.length > 0 ? Object.keys(items[0].data).slice(0, 4) : [];

  const autoSkip = new Set(["title", "name", "heading", "label", "description", "body", "content",
    "excerpt", "summary", "text", "bio", "image", "thumbnail", "photo", "cover", "picture", "avatar",
    "date", "published_at", "created_date", "publishedAt", "category", "tag",
    ...(titleField ? [titleField] : []),
    ...(imageField ? [imageField] : []),
    ...(descriptionField ? [descriptionField] : []),
    ...(dateField ? [dateField] : []),
    ...(badgeField ? [badgeField] : []),
    ...(ratingField ? [ratingField] : []),
  ]);

  const extraFields = fieldsToShow.filter((f) => showFields.length > 0 || !autoSkip.has(f.toLowerCase()));

  const cardClasses = getCardClasses(cardStyle, accentColor);
  const gapClass = getGapClass(gap);
  const colsClass = getColsClass(columns, layout);

  // ── Shared card body ──────────────────────────────────────────────────────

  function CardBody({ item, compact = false }: { item: CmsItem; compact?: boolean }) {
    const title = getTitle(item);
    const desc = getDescription(item);
    const date = getDate(item);
    const rating = getRating(item);
    const badge = getBadge(item);

    return (
      <div className={cn("p-4", compact && "p-3")}>
        {badge && (
          <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
            {badge}
          </span>
        )}
        <p className={cn("font-bold text-gray-900 leading-snug", compact ? "text-sm" : "text-base")}>{title}</p>
        {rating !== null && <div className="mt-1"><RatingDisplay value={rating} /></div>}
        {desc && (
          <p className={cn("text-gray-500 mt-1.5 leading-relaxed", compact ? "text-xs line-clamp-2" : "text-sm line-clamp-3")}>{desc}</p>
        )}
        {date && showDate && (
          <div className="mt-2"><DateBadge iso={date} accentColor={accentColor} /></div>
        )}
        {extraFields.slice(0, 3).map((field) => {
          const val = item.data[field];
          if (val === undefined || val === null) return null;
          const valStr = String(val);
          if (isImageUrl(valStr)) return null;
          return (
            <div key={field} className="flex items-start gap-2 mt-1.5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider w-16 shrink-0 truncate mt-0.5">{field.replace(/_/g, " ")}</span>
              <span className="text-xs text-gray-600 flex-1 min-w-0">
                <FieldValue
                  value={val}
                  fieldType={collection?.fields?.find((f: any) => f.key === field)?.type}
                />
              </span>
            </div>
          );
        })}
        {showReadMore && (
          <ReadMoreLink text={readMoreText} accentColor={accentColor} />
        )}
      </div>
    );
  }

  // ── MINIMAL layout ─────────────────────────────────────────────────────────

  if (layout === "minimal") {
    return (
      <div className={cn("w-full", paddingX, paddingY)}>
        <div className={cn("divide-y divide-gray-100")}>
          {items.map((item, idx) => {
            const title = getTitle(item);
            const desc = getDescription(item);
            const date = getDate(item);
            const badge = getBadge(item);
            return (
              <div key={item.id} className="flex items-start gap-4 py-4 group cursor-pointer">
                <span className="text-xs font-bold text-gray-300 w-5 shrink-0 mt-0.5 tabular-nums">{String(idx + 1).padStart(2, "0")}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors leading-snug">{title}</p>
                    {badge && (
                      <span className="text-[10px] font-bold uppercase shrink-0 px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
                        {badge}
                      </span>
                    )}
                  </div>
                  {desc && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{desc}</p>}
                  {date && showDate && <div className="mt-1"><DateBadge iso={date} accentColor={accentColor} /></div>}
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 shrink-0 mt-0.5 transition-colors" />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── FEATURED layout ─────────────────────────────────────────────────────────
  // First item spans full width as a hero; rest appear in a 3-col grid below.

  if (layout === "featured") {
    const [hero, ...rest] = items;
    const heroImg = getImage(hero);
    const heroDesc = getDescription(hero);
    const heroBadge = getBadge(hero);
    const heroDate = getDate(hero);
    return (
      <div className={cn("w-full", paddingX, paddingY, "space-y-6")}>
        {/* Hero */}
        <div className={cn("group cursor-pointer overflow-hidden", cardClasses)}>
          <div className="sm:flex">
            {heroImg && (
              <div className={cn("sm:w-1/2 overflow-hidden bg-gray-100 sm:rounded-l-2xl", getImageHeightClass("xl"), "sm:h-auto")}>
                <img src={heroImg} alt={getTitle(hero)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center">
              {heroBadge && (
                <span className="inline-block text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-full mb-3 w-fit"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                  {heroBadge}
                </span>
              )}
              <p className="text-2xl font-bold text-gray-900 leading-tight mb-3">{getTitle(hero)}</p>
              {heroDesc && <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 mb-4">{heroDesc}</p>}
              {heroDate && showDate && <DateBadge iso={heroDate} accentColor={accentColor} />}
              {showReadMore && (
                <div className="mt-4">
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90"
                    style={{ backgroundColor: accentColor }}>
                    {readMoreText} <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Rest in grid */}
        {rest.length > 0 && (
          <div className={cn("grid", gapClass, colsClass)}>
            {rest.map((item) => {
              const img = getImage(item);
              return (
                <div key={item.id} className={cn("group cursor-pointer overflow-hidden", cardClasses)}>
                  {img && <ItemImage src={img} alt={getTitle(item)} height={imageHeight} cardStyle={cardStyle} accentColor={accentColor} />}
                  <CardBody item={item} compact />
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── MAGAZINE layout ────────────────────────────────────────────────────────
  // Large item on left, stack of smaller items on right.

  if (layout === "magazine") {
    const [main, ...sidebar] = items;
    const mainImg = getImage(main);
    return (
      <div className={cn("w-full", paddingX, paddingY)}>
        <div className={cn("grid grid-cols-1 lg:grid-cols-5", gapClass)}>
          {/* Main */}
          <div className={cn("lg:col-span-3 group cursor-pointer overflow-hidden", cardClasses)}>
            {mainImg && (
              <div className={cn("w-full overflow-hidden bg-gray-100 rounded-t-2xl", getImageHeightClass("xl"))}>
                <img src={mainImg} alt={getTitle(main)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
              </div>
            )}
            <div className="p-5">
              {getBadge(main) && (
                <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                  {getBadge(main)}
                </span>
              )}
              <p className="text-xl font-bold text-gray-900 leading-snug mb-2">{getTitle(main)}</p>
              {getDescription(main) && (
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">{getDescription(main)}</p>
              )}
              {showDate && getDate(main) && <div className="mt-2"><DateBadge iso={getDate(main)!} accentColor={accentColor} /></div>}
              {showReadMore && <ReadMoreLink text={readMoreText} accentColor={accentColor} />}
            </div>
          </div>

          {/* Sidebar stack */}
          <div className={cn("lg:col-span-2 flex flex-col", gapClass)}>
            {sidebar.slice(0, 4).map((item) => {
              const img = getImage(item);
              return (
                <div key={item.id} className={cn("group cursor-pointer overflow-hidden flex gap-3 p-3", cardClasses)}>
                  {img && (
                    <div className="w-20 h-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <img src={img} alt={getTitle(item)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    {getBadge(item) && (
                      <span className="text-[10px] font-bold uppercase tracking-wide"
                        style={{ color: accentColor }}>{getBadge(item)}</span>
                    )}
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mt-0.5">{getTitle(item)}</p>
                    {showDate && getDate(item) && <div className="mt-1"><DateBadge iso={getDate(item)!} accentColor={accentColor} /></div>}
                    {showReadMore && <ReadMoreLink text={readMoreText} accentColor={accentColor} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // ── LIST layout ────────────────────────────────────────────────────────────

  if (layout === "list") {
    return (
      <div className={cn("w-full", paddingX, paddingY)}>
        <div className={cn("flex flex-col", gapClass)}>
          {items.map((item) => {
            const img = getImage(item);
            const desc = getDescription(item);
            const date = getDate(item);
            const badge = getBadge(item);
            const rating = getRating(item);
            return (
              <div key={item.id} className={cn("group cursor-pointer flex items-start gap-4 overflow-hidden", cardClasses, "p-4")}>
                {img && (
                  <div className="w-24 h-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <img src={img} alt={getTitle(item)} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  {badge && (
                    <span className="text-[10px] font-bold uppercase tracking-wide"
                      style={{ color: accentColor }}>{badge}</span>
                  )}
                  <p className="text-sm font-bold text-gray-900 truncate mt-0.5">{getTitle(item)}</p>
                  {rating !== null && <div className="mt-0.5"><RatingDisplay value={rating} /></div>}
                  {desc && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{desc}</p>}
                  {date && showDate && <div className="mt-1.5"><DateBadge iso={date} accentColor={accentColor} /></div>}
                  {showReadMore && <ReadMoreLink text={readMoreText} accentColor={accentColor} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── TABLE layout ────────────────────────────────────────────────────────────

  if (layout === "table") {
    return (
      <div className={cn("w-full", paddingX, paddingY, "overflow-x-auto")}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-100">
              {fieldsToShow.map((field) => (
                <th key={field} className="text-left py-3 px-4 text-[11px] font-bold text-gray-400 uppercase tracking-wider capitalize">
                  {field.replace(/_/g, " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                {fieldsToShow.map((field) => (
                  <td key={field} className="py-3 px-4 text-gray-700">
                    <FieldValue
                      value={item.data[field]}
                      fieldType={collection?.fields?.find((f: any) => f.key === field)?.type}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // ── MASONRY layout ─────────────────────────────────────────────────────────
  // Uses CSS column-count for a masonry-like visual.

  if (layout === "masonry") {
    return (
      <div className={cn("w-full", paddingX, paddingY)}>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-0">
          {items.map((item) => {
            const img = getImage(item);
            const desc = getDescription(item);
            const date = getDate(item);
            const badge = getBadge(item);
            return (
              <div key={item.id} className={cn("group cursor-pointer overflow-hidden break-inside-avoid mb-5", cardClasses)}>
                {img && (
                  <div className="w-full overflow-hidden bg-gray-100 rounded-t-2xl">
                    <img src={img} alt={getTitle(item)} className="w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                  </div>
                )}
                <div className="p-4">
                  {badge && (
                    <span className="inline-block text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full mb-2"
                      style={{ backgroundColor: `${accentColor}18`, color: accentColor }}>
                      {badge}
                    </span>
                  )}
                  <p className="text-sm font-bold text-gray-900 leading-snug">{getTitle(item)}</p>
                  {desc && <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{desc}</p>}
                  {date && showDate && <div className="mt-2"><DateBadge iso={date} accentColor={accentColor} /></div>}
                  {showReadMore && <ReadMoreLink text={readMoreText} accentColor={accentColor} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── CARDS / GRID layout (default) ──────────────────────────────────────────

  return (
    <div className={cn("w-full", paddingX, paddingY)}>
      <div className={cn("grid", gapClass, colsClass)}>
        {items.map((item) => {
          const img = getImage(item);
          return (
            <div key={item.id} className={cn("group cursor-pointer overflow-hidden", cardClasses)}>
              {img && <ItemImage src={img} alt={getTitle(item)} height={imageHeight} cardStyle={cardStyle} accentColor={accentColor} />}
              <CardBody item={item} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
