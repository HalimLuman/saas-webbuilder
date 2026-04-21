"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  X,
  LayoutGrid,
  Palette,
  Type,
  Sparkles,
  MousePointer,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  AlignStartVertical,
  AlignCenterVertical,
  AlignEndVertical,
  AlignStartHorizontal,
  AlignCenterHorizontal,
  AlignEndHorizontal,
  Link2,
  Link2Off,
  FileText,
  Trash2,
  Plus,
  Monitor,
  Tablet,
  Smartphone,
  Code2,
  Copy,
  Check,
  ChevronDown,
  Zap,
  BarChart3,
  Loader2,
  Database,
  RefreshCw,
} from "lucide-react";
import { useEditorStore, findInTree } from "@/store/editor-store";
import { useSiteStore } from "@/store/site-store";
import { cn } from "@/lib/utils";
import type { CanvasElement, ElementStyles, AnimationConfig, HoverStyles, FocusStyles, ActiveStyles, NavLink, NavActionType, BackendAction, DataSource, FormBackendBinding } from "@/lib/types";

// ---------------------------------------------------------------------------
// Small shared primitives
// ---------------------------------------------------------------------------

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] text-gray-500 shrink-0">{children}</span>;
}

function Row({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex items-center justify-between gap-2", className)}>
      {children}
    </div>
  );
}

const inputCls =
  "h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full";

const selectCls =
  "h-6 text-[11px] px-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400";

const textareaCls =
  "w-full text-[11px] px-2 py-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none";

function SegmentedButtons<T extends string>({
  options,
  value,
  onChange,
  renderLabel,
}: {
  options: T[];
  value: T | undefined;
  onChange: (v: T) => void;
  renderLabel: (v: T) => React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-0.5 p-1 rounded-lg bg-gray-100/80 border border-gray-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={cn(
            "h-6 px-3 rounded-md text-[10px] font-bold transition-all duration-200",
            value === opt
              ? "bg-white shadow-sm text-indigo-600 border border-indigo-100/30"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
          )}
        >
          {renderLabel(opt)}
        </button>
      ))}
    </div>
  );
}

function ColorPicker({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <label className="relative h-6 w-6 rounded border border-gray-200 overflow-hidden cursor-pointer shrink-0">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
        />
        <div className="w-full h-full rounded" style={{ backgroundColor: value || "#000000" }} />
      </label>
      <input
        type="text"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder="#000000"
        className="w-20 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
      />
    </div>
  );
}

function DimensionInput({ value, onChange, placeholder = "auto" }: { value?: string; onChange: (v: string) => void; placeholder?: string }) {
  const [unit, setUnit] = useState<"px" | "%" | "auto">("px");
  const numericVal = value ? value.replace("px", "").replace("%", "").replace("auto", "") : "";
  const handleNum = (n: string) => { if (!n) { onChange(""); return; } onChange(unit === "auto" ? "auto" : `${n}${unit}`); };
  const handleUnit = (u: "px" | "%" | "auto") => { setUnit(u); if (u === "auto") { onChange("auto"); } else if (numericVal) { onChange(`${numericVal}${u}`); } };
  return (
    <div className="flex items-center gap-1">
      <input type={unit === "auto" ? "text" : "number"} value={unit === "auto" ? "auto" : numericVal} readOnly={unit === "auto"} onChange={(e) => handleNum(e.target.value)} placeholder={placeholder} className="w-14 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" />
      <select value={unit} onChange={(e) => handleUnit(e.target.value as "px" | "%" | "auto")} className="h-6 text-[10px] px-1 rounded border border-gray-200 bg-white focus:outline-none">
        <option value="px">px</option>
        <option value="%">%</option>
        <option value="auto">auto</option>
      </select>
    </div>
  );
}

function SpacingGrid({ values, onChange, label }: { values: { top?: string; right?: string; bottom?: string; left?: string }; onChange: (side: "top" | "right" | "bottom" | "left", v: string) => void; label: string }) {
  const [linked, setLinked] = useState(false);
  const parse = (v?: string) => (v ? parseInt(v) || "" : "");
  const handleChange = (side: "top" | "right" | "bottom" | "left", raw: string) => {
    const val = raw ? `${raw}px` : "";
    if (linked) { (["top", "right", "bottom", "left"] as const).forEach((s) => onChange(s, val)); } else { onChange(side, val); }
  };
  const sides = [{ key: "top" as const, label: "T" }, { key: "right" as const, label: "R" }, { key: "bottom" as const, label: "B" }, { key: "left" as const, label: "L" }];
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-medium text-gray-600">{label}</span>
        <button onClick={() => setLinked(!linked)} className={cn("h-5 w-5 rounded flex items-center justify-center transition-colors", linked ? "bg-indigo-100 text-indigo-600" : "bg-gray-100 text-gray-400")} title={linked ? "Unlink sides" : "Link all sides"}>
          {linked ? <Link2 className="h-3 w-3" /> : <Link2Off className="h-3 w-3" />}
        </button>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {sides.map(({ key, label: sideLabel }) => (
          <div key={key} className="flex flex-col items-center gap-0.5">
            <span className="text-[9px] text-gray-400">{sideLabel}</span>
            <input type="number" value={parse(values[key]) as number | ""} onChange={(e) => handleChange(key, e.target.value)} placeholder="0" className="w-full h-6 text-[11px] px-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 text-center" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Tab definitions
// ---------------------------------------------------------------------------

type TabId = "content" | "layout" | "style" | "typography" | "effects" | "interactions" | "code" | "submission" | "data";

const TABS: { id: TabId; icon: React.ComponentType<{ className?: string }>; label: string; showFor?: (type: string) => boolean }[] = [
  { id: "content",      icon: FileText,     label: "Content" },
  { id: "layout",       icon: LayoutGrid,   label: "Layout" },
  { id: "style",        icon: Palette,      label: "Style" },
  { id: "typography",   icon: Type,         label: "Typo" },
  { id: "effects",      icon: Sparkles,     label: "Effects" },
  { id: "interactions", icon: MousePointer, label: "Actions" },
  { id: "code",         icon: Code2,        label: "Code" },
  {
    id: "submission",
    icon: Zap,
    label: "Submit",
    showFor: (type) => type === "form",
  },
  {
    id: "data",
    icon: BarChart3,
    label: "Data",
    showFor: (type) => ["data-table","cms-list","product-card","number-display","chart","paragraph","heading","badge","image"].includes(type),
  },
];

function TabSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-50 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50/50 transition-colors group"
      >
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.08em] group-hover:text-gray-600 transition-colors">
          {title}
        </span>
        <div className={cn(
          "h-5 w-5 rounded-md flex items-center justify-center transition-all duration-300",
          open ? "bg-indigo-50 text-indigo-500 rotate-180" : "text-gray-300 group-hover:text-gray-400"
        )}>
          <ChevronDown className="h-3 w-3" />
        </div>
      </button>
      {open && (
        <div className="px-4 pb-5 space-y-3.5 animate-in fade-in slide-in-from-top-1 duration-200">
          {children}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Content Tab — prop editors per element type
// ---------------------------------------------------------------------------

function PropInput({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-medium text-gray-500">{label}</span>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || label} className={inputCls} />
    </div>
  );
}

// A URL input that also shows the site's pages as one-click chips
function PageLinkInput({ label, value, onChange, placeholder }: { label: string; value?: string; onChange: (v: string) => void; placeholder?: string }) {
  const siteId = useEditorStore((s) => s.siteId);
  const getSiteById = useSiteStore((s) => s.getSiteById);
  const pages = (siteId ? getSiteById(siteId)?.pages : undefined) ?? [];

  return (
    <div className="space-y-1.5">
      <span className="text-[10px] font-medium text-gray-500">{label}</span>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder || "/page or https://..."} className={inputCls} />
      {pages.length > 0 && (
        <div className="flex flex-wrap gap-1 pt-0.5">
          {pages.map((page) => (
            <button
              key={page.id}
              type="button"
              onClick={() => onChange(page.slug)}
              title={`Link to ${page.name} (${page.slug})`}
              className={cn(
                "flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border transition-all",
                value === page.slug
                  ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                  : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
              )}
            >
              <FileText className="h-2.5 w-2.5" />
              {page.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PropTextarea({ label, value, onChange, rows = 2 }: { label: string; value?: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <div className="space-y-1">
      <span className="text-[10px] font-medium text-gray-500">{label}</span>
      <textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows} className={textareaCls} />
    </div>
  );
}

interface Feature { icon: string; title: string; description: string; imageUrl?: string; badge?: string }
interface Testimonial { quote: string; name: string; title: string; avatarUrl?: string; company?: string; rating?: number }
interface Stat { value: string; label: string; description?: string; icon?: string }
interface FaqItem { question: string; answer: string; category?: string }
interface TeamMember { name: string; title: string; bio?: string; avatarUrl?: string; social?: { twitter?: string; linkedin?: string } }
interface Product { name: string; price: string; description?: string; imageUrl?: string; badge?: string; rating?: number }
interface Plan { name: string; price: string; period: string; description: string; features: string; isHighlighted: boolean; ctaText: string }
interface FooterLink { label: string; href: string }
interface FooterColumn { title: string; links: FooterLink[] }
interface LogoItem { name: string; imageUrl?: string; url?: string }
interface TimelineItem { date: string; title: string; description: string; icon: string }
interface Step { number: number; title: string; description: string }
interface GalleryImage { src: string; alt: string }
interface ComparisonColumn { label: string; isHighlighted: boolean }
interface ComparisonRow { feature: string; values: string }
interface BeforeAfterItem { text: string }
interface SimpleTextItem { text: string }

function ListEditor<T extends object>({
  items,
  onChange,
  renderItem,
  newItem,
  addLabel,
}: {
  items: T[];
  onChange: (items: T[]) => void;
  renderItem: (item: T, index: number, update: (updates: Partial<T>) => void, remove: () => void) => React.ReactNode;
  newItem: T;
  addLabel: string;
}) {
  return (
    <div className="space-y-2">
      {(items || []).map((item, i) => (
        <div key={i} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          {renderItem(
            item,
            i,
            (updates) => onChange(items.map((it, idx) => (idx === i ? { ...it, ...updates } : it))),
            () => onChange(items.filter((_, idx) => idx !== i))
          )}
        </div>
      ))}
      <button
        onClick={() => onChange([...(items || []), newItem])}
        className="w-full py-1.5 text-[11px] text-indigo-500 border border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors flex items-center justify-center gap-1"
      >
        <Plus className="h-3 w-3" />
        {addLabel}
      </button>
    </div>
  );
}

function ItemHeader({ label, onDelete }: { label: string; onDelete: () => void }) {
  return (
    <div className="flex items-center justify-between mb-1">
      <span className="text-[10px] font-semibold text-gray-500">{label}</span>
      <button onClick={onDelete} className="text-red-400 hover:text-red-600 transition-colors">
        <Trash2 className="h-3 w-3" />
      </button>
    </div>
  );
}

function FormConnectionPanel({ p, updateProps }: { p: Record<string, unknown>; updateProps: (v: Record<string, unknown>) => void }) {
  const cfFormId = p.formId as string | undefined;
  const [cfForms, setCfForms] = React.useState<{ id: string; name: string }[] | null>(null);
  const [cfCreating, setCfCreating] = React.useState(false);
  const [cfNewName, setCfNewName] = React.useState("");
  const cfSiteId = useEditorStore((s) => s.siteId);

  React.useEffect(() => {
    fetch("/api/v1/forms")
      .then((r) => r.json())
      .then((d) => setCfForms(d.forms ?? []))
      .catch(() => setCfForms([]));
  }, []);

  const cfConnectedForm = cfForms?.find((f) => f.id === cfFormId);

  const cfCreateAndConnect = async () => {
    const name = cfNewName.trim() || (p.headline as string) || "Contact Form";
    setCfCreating(true);
    try {
      const res = await fetch("/api/v1/forms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, site_id: cfSiteId }),
      });
      if (res.ok) {
        const { form } = await res.json();
        updateProps({ formId: form.id });
        setCfForms((prev) => [form, ...(prev ?? [])]);
        setCfNewName("");
      }
    } catch { /* ignore */ } finally {
      setCfCreating(false);
    }
  };

  return (
    <>
      <TabSection title="Form connection">
        {cfFormId && cfConnectedForm ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-green-50 border border-green-200">
              <span className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
              <span className="text-[11px] font-semibold text-green-700 flex-1 truncate">{cfConnectedForm.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <a href="/dashboard/forms" target="_blank" className="text-[11px] font-medium text-indigo-600 hover:underline">View submissions →</a>
              <button onClick={() => updateProps({ formId: undefined })} className="text-[11px] text-gray-400 hover:text-red-500 transition">Disconnect</button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {cfForms === null ? (
              <p className="text-[11px] text-gray-400">Loading forms…</p>
            ) : cfForms.length > 0 ? (
              <div className="space-y-1.5">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Select existing form</p>
                <div className="max-h-40 overflow-y-auto space-y-1">
                  {cfForms.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => updateProps({ formId: f.id })}
                      className="w-full text-left px-3 py-2 rounded-lg border border-gray-100 hover:border-indigo-300 hover:bg-indigo-50 text-[11px] font-medium text-gray-700 transition"
                    >
                      {f.name}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="space-y-1.5">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">Create new form</p>
              <input
                value={cfNewName}
                onChange={(e) => setCfNewName(e.target.value)}
                placeholder={(p.headline as string) || "Contact Form"}
                className="w-full h-8 px-2.5 rounded-lg border border-gray-200 text-[11px] focus:outline-none focus:border-indigo-400"
              />
              <button
                onClick={cfCreateAndConnect}
                disabled={cfCreating}
                className="w-full py-2 rounded-lg text-[11px] font-semibold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
              >
                {cfCreating ? "Creating…" : "Create & connect"}
              </button>
            </div>
          </div>
        )}
      </TabSection>
      <TabSection title="Settings">
        <PropInput label="Success message" value={p.successMessage as string} onChange={(v) => updateProps({ successMessage: v })} placeholder="Form submitted successfully!" />
        <PropInput label="Error message" value={p.errorMessage as string} onChange={(v) => updateProps({ errorMessage: v })} placeholder="Something went wrong. Please try again." />
        <Row>
          <FieldLabel>Error type</FieldLabel>
          <select value={(p.toastErrorType as string) || "error"} onChange={(e) => updateProps({ toastErrorType: e.target.value })} className={cn(selectCls, "w-28")}>
            <option value="error">Error (red)</option>
            <option value="warning">Warning (yellow)</option>
            <option value="info">Info (blue)</option>
          </select>
        </Row>
        <Row>
          <FieldLabel>Toast position</FieldLabel>
          <select value={(p.toastPosition as string) || "bottom-right"} onChange={(e) => updateProps({ toastPosition: e.target.value })} className={cn(selectCls, "w-36")}>
            <option value="top-left">Top left</option>
            <option value="top-center">Top center</option>
            <option value="top-right">Top right</option>
            <option value="bottom-left">Bottom left</option>
            <option value="bottom-center">Bottom center</option>
            <option value="bottom-right">Bottom right</option>
          </select>
        </Row>
        <PageLinkInput label="Redirect URL" value={p.redirectUrl as string} onChange={(v) => updateProps({ redirectUrl: v })} placeholder="/thank-you or https://..." />
      </TabSection>
      <TabSection title="Appearance" defaultOpen={false}>
        <Row>
          <FieldLabel>Background</FieldLabel>
          <select value={(p.bgType as string) || "light"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
            <option value="light">Light gray</option>
            <option value="white">White</option>
            <option value="dark">Dark</option>
          </select>
        </Row>
      </TabSection>
    </>
  );
}

function ContentTab({
  element,
  updateProps,
  updateLayoutProp,
  effectiveProps,
}: {
  element: CanvasElement;
  updateProps: (props: Record<string, unknown>) => void;
  updateLayoutProp: (key: string, value: string) => void;
  effectiveProps: Record<string, unknown>;
}) {
  // Use effectiveProps for display (shows viewport-merged values), p for non-layout props
  const p = element.props || {};
  const updateElementContent = useEditorStore((s) => s.updateElementContent);
  // These are used only in case "navbar" but must be called unconditionally (Rules of Hooks)
  const nbSiteId = useEditorStore((s) => s.siteId);
  const nbGetSite = useSiteStore((s) => s.getSiteById);

  switch (element.type) {
    case "heading":
    case "paragraph":
    case "button":
    case "rich-text":
      return (
        <div className="px-4 py-3 space-y-3">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Text Content</p>
            <textarea
              value={element.content || ""}
              onChange={(e) => updateElementContent(element.id, e.target.value)}
              rows={element.type === "paragraph" || element.type === "rich-text" ? 5 : 2}
              placeholder="Enter text..."
              className={textareaCls}
            />
          </div>
          {element.type === "button" && (
            <>
              <PageLinkInput label="Link URL" value={p.href as string} onChange={(v) => updateProps({ href: v })} placeholder="https://... or #section" />
              <Row>
                <FieldLabel>Open in new tab</FieldLabel>
                <SegmentedButtons options={["false", "true"]} value={String(!!p.openInNewTab)} onChange={(v) => updateProps({ openInNewTab: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
              </Row>
              <Row>
                <FieldLabel>Variant</FieldLabel>
                <select value={(p.variant as string) || "solid"} onChange={(e) => updateProps({ variant: e.target.value })} className={cn(selectCls, "w-28")}>
                  <option value="solid">Solid</option>
                  <option value="outline">Outline</option>
                  <option value="ghost">Ghost</option>
                </select>
              </Row>
              <Row>
                <FieldLabel>Size</FieldLabel>
                <SegmentedButtons options={["sm", "md", "lg"]} value={(p.size as string) || "md"} onChange={(v) => updateProps({ size: v })} renderLabel={(v) => v} />
              </Row>
              <Row>
                <FieldLabel>Color</FieldLabel>
                <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
              </Row>
            </>
          )}
          {element.type === "heading" && (
            <Row>
              <FieldLabel>Level</FieldLabel>
              <SegmentedButtons options={["1", "2", "3", "4"]} value={String((p.level as number) || 1)} onChange={(v) => updateProps({ level: parseInt(v) })} renderLabel={(v) => `H${v}`} />
            </Row>
          )}
        </div>
      );

    case "hero":
      return (
        <>
          <TabSection title="Text">
            <PropInput label="Badge text" value={p.badge as string} onChange={(v) => updateProps({ badge: v })} placeholder="New · Just launched" />
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Your big headline" />
            <PropTextarea label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} />
            <PropInput label="Subtext (below buttons)" value={p.subtext as string} onChange={(v) => updateProps({ subtext: v })} placeholder="No credit card required" />
          </TabSection>
          <TabSection title="Buttons">
            <PropInput label="Primary button" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Get Started Free" />
            <PropInput label="Secondary button" value={p.ctaSecondaryText as string} onChange={(v) => updateProps({ ctaSecondaryText: v })} placeholder="Watch Demo" />
          </TabSection>
          <TabSection title="Image" defaultOpen={false}>
            <PropInput label="Image URL (optional)" value={p.imageUrl as string} onChange={(v) => updateProps({ imageUrl: v })} placeholder="https://..." />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <select value={(p.layout as string) || "centered"} onChange={(e) => updateProps({ layout: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="centered">Centered</option>
                <option value="left">Left aligned</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "dark-gradient"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="dark-gradient">Dark Gradient</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="white">White</option>
                <option value="branded">Branded</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Button style</FieldLabel>
              <select value={(p.buttonStyle as string) || "solid"} onChange={(e) => updateProps({ buttonStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="solid">Solid</option>
                <option value="outline">Outline</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "container":
      return (
        <>
          <TabSection title="Layout">
            <Row>
              <FieldLabel>Direction</FieldLabel>
              <SegmentedButtons
                options={["column", "row", "row-wrap"] as const}
                value={(effectiveProps._childLayout as string) || "column"}
                onChange={(v) => updateLayoutProp("_childLayout", v)}
                renderLabel={(v) => v === "column" ? "↕ Col" : v === "row" ? "↔ Row" : "↔ Wrap"}
              />
            </Row>
            <Row>
              <FieldLabel>Align items</FieldLabel>
              <select value={(effectiveProps._childAlign as string) || "start"} onChange={(e) => updateLayoutProp("_childAlign", e.target.value)} className={cn(selectCls, "w-28")}>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Justify</FieldLabel>
              <select value={(effectiveProps._childJustify as string) || "start"} onChange={(e) => updateLayoutProp("_childJustify", e.target.value)} className={cn(selectCls, "w-28")}>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space between</option>
                <option value="around">Space around</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Gap</FieldLabel>
              <select value={(effectiveProps._childGap as string) || "md"} onChange={(e) => updateLayoutProp("_childGap", e.target.value)} className={cn(selectCls, "w-24")}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">X-Large</option>
              </select>
            </Row>
          </TabSection>
        </>
      );

    case "section":
      return (
        <>
          <TabSection title="Layout">
            <Row>
              <FieldLabel>Max width</FieldLabel>
              <select value={(p.maxWidth as string) || "xl"} onChange={(e) => updateProps({ maxWidth: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="none">Full width</option>
                <option value="sm">Small (672px)</option>
                <option value="md">Medium (896px)</option>
                <option value="lg">Large (1152px)</option>
                <option value="xl">X-Large (1280px)</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Padding</FieldLabel>
              <select value={(p.padding as string) || "md"} onChange={(e) => updateProps({ padding: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">X-Large</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Content align</FieldLabel>
              <SegmentedButtons options={["left", "center"] as const} value={(p.contentAlign as string) || "left"} onChange={(v) => updateProps({ contentAlign: v })} renderLabel={(v) => v === "left" ? "Left" : "Center"} />
            </Row>
            <Row>
              <FieldLabel>Direction</FieldLabel>
              <SegmentedButtons
                options={["column", "row", "wrap"] as const}
                value={(effectiveProps._childLayout as string) || "column"}
                onChange={(v) => updateLayoutProp("_childLayout", v)}
                renderLabel={(v) => v === "column" ? "↕ Col" : v === "row" ? "↔ Row" : "↔ Wrap"}
              />
            </Row>
            <Row>
              <FieldLabel>Align items</FieldLabel>
              <select value={(effectiveProps._childAlign as string) || "start"} onChange={(e) => updateLayoutProp("_childAlign", e.target.value)} className={cn(selectCls, "w-28")}>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Justify content</FieldLabel>
              <select value={(effectiveProps._childJustify as string) || "start"} onChange={(e) => updateLayoutProp("_childJustify", e.target.value)} className={cn(selectCls, "w-28")}>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space between</option>
                <option value="around">Space around</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Gap between items</FieldLabel>
              <select value={(effectiveProps._childGap as string) || "md"} onChange={(e) => updateLayoutProp("_childGap", e.target.value)} className={cn(selectCls, "w-24")}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">X-Large</option>
              </select>
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-32")}>
                <option value="white">White</option>
                <option value="light">Light gray</option>
                <option value="dark">Dark</option>
                <option value="dark-gradient">Dark gradient</option>
                <option value="branded">Branded</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "two-col":
      return (
        <>
          <TabSection title="Columns">
            <Row>
              <FieldLabel>Column ratio</FieldLabel>
              <select value={(p.colRatio as string) || "1:1"} onChange={(e) => updateProps({ colRatio: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="1:1">Equal (1:1)</option>
                <option value="1:2">1 : 2</option>
                <option value="2:1">2 : 1</option>
                <option value="1:3">1 : 3</option>
                <option value="3:1">3 : 1</option>
                <option value="2:3">2 : 3</option>
                <option value="3:2">3 : 2</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Gap</FieldLabel>
              <select value={(p.gap as string) || "md"} onChange={(e) => updateProps({ gap: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">X-Large</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Vertical align</FieldLabel>
              <select value={(p.vertAlign as string) || "start"} onChange={(e) => updateProps({ vertAlign: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="start">Top</option>
                <option value="center">Center</option>
                <option value="end">Bottom</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Justify columns</FieldLabel>
              <select value={(p.justifyContent as string) || "normal"} onChange={(e) => updateProps({ justifyContent: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="normal">Default</option>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space between</option>
                <option value="around">Space around</option>
                <option value="evenly">Space evenly</option>
              </select>
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Padding</FieldLabel>
              <select value={(p.padding as string) || "md"} onChange={(e) => updateProps({ padding: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="white">White</option>
                <option value="light">Light gray</option>
                <option value="dark">Dark</option>
                <option value="branded">Branded</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "three-col":
    case "four-col":
      return (
        <>
          <TabSection title="Columns">
            <Row>
              <FieldLabel>Gap</FieldLabel>
              <select value={(p.gap as string) || "md"} onChange={(e) => updateProps({ gap: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Vertical align</FieldLabel>
              <select value={(p.vertAlign as string) || "start"} onChange={(e) => updateProps({ vertAlign: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="start">Top</option>
                <option value="center">Center</option>
                <option value="end">Bottom</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Justify columns</FieldLabel>
              <select value={(p.justifyContent as string) || "normal"} onChange={(e) => updateProps({ justifyContent: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="normal">Default</option>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space between</option>
                <option value="around">Space around</option>
                <option value="evenly">Space evenly</option>
              </select>
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Padding</FieldLabel>
              <select value={(p.padding as string) || "md"} onChange={(e) => updateProps({ padding: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="white">White</option>
                <option value="light">Light gray</option>
                <option value="dark">Dark</option>
                <option value="branded">Branded</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "sidebar-left":
    case "sidebar-right":
      return (
        <>
          <TabSection title="Layout">
            <Row>
              <FieldLabel>Sidebar width</FieldLabel>
              <span className={cn(selectCls, "w-28 flex items-center text-gray-400")}>Fixed (256px)</span>
            </Row>
            <Row>
              <FieldLabel>Gap</FieldLabel>
              <select value={(p.gap as string) || "md"} onChange={(e) => updateProps({ gap: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Vertical align</FieldLabel>
              <select value={(p.vertAlign as string) || "start"} onChange={(e) => updateProps({ vertAlign: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="start">Top</option>
                <option value="center">Center</option>
                <option value="end">Bottom</option>
              </select>
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Padding</FieldLabel>
              <select value={(p.padding as string) || "md"} onChange={(e) => updateProps({ padding: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="none">None</option>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="white">White</option>
                <option value="light">Light gray</option>
                <option value="dark">Dark</option>
                <option value="branded">Branded</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "cta":
      return (
        <>
          <TabSection title="Text">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
            <PropTextarea label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} />
          </TabSection>
          <TabSection title="Buttons">
            <PropInput label="Primary button" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Get Started" />
            <PropInput label="Secondary button" value={p.ctaSecondaryText as string} onChange={(v) => updateProps({ ctaSecondaryText: v })} placeholder="Learn More" />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "dark"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="dark">Dark</option>
                <option value="gradient">Dark Gradient</option>
                <option value="light">Light</option>
                <option value="white">White</option>
                <option value="branded">Branded</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <select value={(p.layout as string) || "centered"} onChange={(e) => updateProps({ layout: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="centered">Centered</option>
                <option value="left">Left aligned</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Button style</FieldLabel>
              <select value={(p.buttonStyle as string) || "solid"} onChange={(e) => updateProps({ buttonStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="solid">Solid</option>
                <option value="outline">Outline</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "features": {
      const features = (p.features as Feature[]) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
            <PropTextarea label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} />
          </TabSection>
          <TabSection title="Feature items">
            <ListEditor<Feature>
              items={features}
              onChange={(items) => updateProps({ features: items })}
              newItem={{ icon: "⭐", title: "New Feature", description: "Describe this feature" }}
              addLabel="Add feature"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Feature ${i + 1}`} onDelete={remove} />
                  <div className="flex gap-2">
                    <input value={item.icon} onChange={(e) => update({ icon: e.target.value })} placeholder="⭐" className="w-10 h-6 text-center text-[13px] rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                    <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" className={cn(inputCls, "flex-1")} />
                  </div>
                  <textarea value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder="Description" rows={2} className={textareaCls} />
                  <input value={item.imageUrl || ""} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="https://... (optional image)" className={inputCls} />
                  <input value={item.badge || ""} onChange={(e) => update({ badge: e.target.value })} placeholder="Badge: New · Popular (optional)" className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={String((p.columns as number) || 3)} onChange={(v) => updateProps({ columns: parseInt(v) })} renderLabel={(v) => v} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "light"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="light">Light gray</option>
                <option value="white">White</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Card style</FieldLabel>
              <select value={(p.cardStyle as string) || "bordered"} onChange={(e) => updateProps({ cardStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="bordered">Bordered</option>
                <option value="shadowed">Shadowed</option>
                <option value="filled">Filled</option>
                <option value="flat">Flat</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <select value={(p.layout as string) || "centered"} onChange={(e) => updateProps({ layout: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="centered">Centered</option>
                <option value="left">Left</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "testimonials": {
      const testimonials = (p.testimonials as Testimonial[]) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
            <PropInput label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} />
          </TabSection>
          <TabSection title="Testimonials">
            <ListEditor<Testimonial>
              items={testimonials}
              onChange={(items) => updateProps({ testimonials: items })}
              newItem={{ quote: "This product is amazing!", name: "Jane Doe", title: "CEO, Company" }}
              addLabel="Add testimonial"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Testimonial ${i + 1}`} onDelete={remove} />
                  <PropTextarea label="Quote" value={item.quote} onChange={(v) => update({ quote: v })} rows={2} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Name" className={inputCls} />
                    <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" className={inputCls} />
                  </div>
                  <input value={item.avatarUrl || ""} onChange={(e) => update({ avatarUrl: e.target.value })} placeholder="Avatar URL (optional)" className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.company || ""} onChange={(e) => update({ company: e.target.value })} placeholder="Company (optional)" className={inputCls} />
                    <input type="number" min={1} max={5} value={item.rating ?? 5} onChange={(e) => update({ rating: parseInt(e.target.value) || 5 })} placeholder="Rating 1-5" className={inputCls} />
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["1", "2", "3"]} value={String((p.columns as number) || 3)} onChange={(v) => updateProps({ columns: parseInt(v) })} renderLabel={(v) => v} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "light"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="light">Light gray</option>
                <option value="white">White</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Card style</FieldLabel>
              <select value={(p.cardStyle as string) || "bordered"} onChange={(e) => updateProps({ cardStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="bordered">Bordered</option>
                <option value="filled">Filled</option>
                <option value="minimal">Minimal</option>
                <option value="dark">Dark card</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Star/accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "testimonial":
      return (
        <>
          <TabSection title="Content">
            <PropTextarea label="Quote" value={p.quote as string} onChange={(v) => updateProps({ quote: v })} rows={3} />
            <PropInput label="Author name" value={p.name as string} onChange={(v) => updateProps({ name: v })} />
            <PropInput label="Author title" value={p.authorTitle as string} onChange={(v) => updateProps({ authorTitle: v })} />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Card style</FieldLabel>
              <select value={(p.cardStyle as string) || "filled"} onChange={(e) => updateProps({ cardStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="filled">Filled</option>
                <option value="bordered">Bordered</option>
                <option value="shadowed">Shadowed</option>
                <option value="minimal">Minimal</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Star/accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "stats": {
      const stats = (p.stats as Stat[]) || [
        { value: "10K+", label: "Active users" },
        { value: "98%", label: "Uptime SLA" },
        { value: "200+", label: "Edge locations" },
        { value: "4.9★", label: "Average rating" },
      ];
      return (
        <>
          <TabSection title="Stats">
            <PropInput label="Headline (optional)" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Our numbers" />
            <ListEditor<Stat>
              items={stats}
              onChange={(items) => updateProps({ stats: items })}
              newItem={{ value: "100+", label: "New stat" }}
              addLabel="Add stat"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Stat ${i + 1}`} onDelete={remove} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.value} onChange={(e) => update({ value: e.target.value })} placeholder="10K+" className={inputCls} />
                    <input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Label" className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.icon || ""} onChange={(e) => update({ icon: e.target.value })} placeholder="Icon emoji (opt.)" className={inputCls} />
                    <input value={item.description || ""} onChange={(e) => update({ description: e.target.value })} placeholder="Sub-description (opt.)" className={inputCls} />
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="white">White</option>
                <option value="dark">Dark</option>
                <option value="gradient">Dark Gradient</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <select value={(p.layout as string) || "grid"} onChange={(e) => updateProps({ layout: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="grid">Grid</option>
                <option value="divided">Divided</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Value color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "faq": {
      const faqs = (p.faqs as FaqItem[]) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
          </TabSection>
          <TabSection title="Questions">
            <ListEditor<FaqItem>
              items={faqs}
              onChange={(items) => updateProps({ faqs: items })}
              newItem={{ question: "New question?", answer: "Answer goes here." }}
              addLabel="Add question"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Q${i + 1}`} onDelete={remove} />
                  <input value={item.question} onChange={(e) => update({ question: e.target.value })} placeholder="Question?" className={inputCls} />
                  <textarea value={item.answer} onChange={(e) => update({ answer: e.target.value })} placeholder="Answer" rows={2} className={textareaCls} />
                  <input value={item.category || ""} onChange={(e) => update({ category: e.target.value })} placeholder="Category (optional, e.g. Billing)" className={inputCls} />
                </>
              )}
            />
          </TabSection>
        </>
      );
    }

    case "newsletter":
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
            <PropTextarea label="Description" value={p.description as string} onChange={(v) => updateProps({ description: v })} />
            <PropInput label="Button text" value={p.buttonText as string} onChange={(v) => updateProps({ buttonText: v })} placeholder="Subscribe" />
            <PropInput label="Placeholder text" value={p.placeholder as string} onChange={(v) => updateProps({ placeholder: v })} placeholder="Enter your email" />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "gradient"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="gradient">Purple gradient</option>
                <option value="branded">Branded</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="white">White</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <select value={(p.layout as string) || "centered"} onChange={(e) => updateProps({ layout: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="centered">Centered</option>
                <option value="left">Left</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "navbar": {
      const rawNavLinks = (p.navLinks as (string | NavLink)[]) || ["Features", "Pricing", "About", "Blog"];
      const navLinksList: NavLink[] = rawNavLinks.map((l) => typeof l === "string" ? { label: l, href: "#" } : l);
      const nbPages = (nbSiteId ? nbGetSite(nbSiteId)?.pages : undefined) ?? [];
      return (
        <>
          <TabSection title="Brand">
            <PropInput label="Brand name" value={p.brandName as string} onChange={(v) => updateProps({ brandName: v })} placeholder="Your Brand" />
            <PropInput label="Logo URL" value={p.logoSrc as string} onChange={(v) => updateProps({ logoSrc: v })} placeholder="https://... (leave blank for color square)" />
          </TabSection>
          <TabSection title="Navigation links">
            {nbPages.length > 0 && (
              <button
                type="button"
                onClick={() => updateProps({ navLinks: nbPages.map((pg) => ({ label: pg.name, href: pg.slug })) })}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-all mb-2"
              >
                <FileText className="h-3 w-3" />
                Sync links from your pages
              </button>
            )}
            <ListEditor<NavLink>
              items={navLinksList}
              onChange={(items) => updateProps({ navLinks: items })}
              newItem={{ label: "New Link", href: "#" }}
              addLabel="Add link"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Link ${i + 1}`} onDelete={remove} />
                  <input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Label" className={cn(inputCls, "mb-1.5")} />
                  <div className="space-y-1.5">
                    <div className="flex gap-1.5">
                      <select 
                        value={item.actionType || "url"} 
                        onChange={(e) => update({ actionType: e.target.value as NavActionType })}
                        className={cn(selectCls, "w-24")}
                      >
                        <option value="url">Link/URL</option>
                        <option value="activity">Activity</option>
                        <option value="scroll">Scroll to</option>
                      </select>
                      {item.actionType === "activity" ? (
                        <input 
                          value={item.actionValue || ""} 
                          onChange={(e) => update({ actionValue: e.target.value })} 
                          placeholder="Activity name (e.g. login)" 
                          className={inputCls} 
                        />
                      ) : item.actionType === "scroll" ? (
                        <input 
                          value={item.actionValue || ""} 
                          onChange={(e) => update({ actionValue: e.target.value })} 
                          placeholder="#section-id" 
                          className={inputCls} 
                        />
                      ) : (
                        <input 
                          value={item.href} 
                          onChange={(e) => update({ href: e.target.value })} 
                          placeholder="/page or #section" 
                          className={inputCls} 
                        />
                      )}
                    </div>
                    {item.actionType === "url" && nbPages.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {nbPages.map((pg) => (
                          <button
                            key={pg.id}
                            type="button"
                            onClick={() => update({ href: pg.slug })}
                            className={cn(
                              "flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium border transition-all",
                              item.href === pg.slug
                                ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                                : "bg-gray-50 text-gray-400 border-gray-200 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200"
                            )}
                          >
                            <FileText className="h-2.5 w-2.5" />
                            {pg.name}
                          </button>
                        ))}
                      </div>
                    )}
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="text-[10px] text-gray-400 shrink-0">Show when</span>
                      <select
                        value={item.showWhen ?? "always"}
                        onChange={(e) => update({ showWhen: e.target.value as NavLink["showWhen"] })}
                        className={cn(selectCls, "flex-1")}
                      >
                        <option value="always">Always</option>
                        <option value="authenticated">Signed in only</option>
                        <option value="unauthenticated">Signed out only</option>
                      </select>
                    </div>
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Buttons">
            <PropInput label="Sign in text" value={p.signInText as string} onChange={(v) => updateProps({ signInText: v })} placeholder="Sign In" />
            <PageLinkInput label="Sign in URL" value={p.signInHref as string} onChange={(v) => updateProps({ signInHref: v })} placeholder="/login or https://..." />
            <PropInput label="CTA text" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Get Started" />
            <PageLinkInput label="CTA URL" value={p.ctaHref as string} onChange={(v) => updateProps({ ctaHref: v })} placeholder="/signup or https://..." />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="white">White</option>
                <option value="dark">Dark</option>
                <option value="transparent">Transparent</option>
                <option value="blur">Frosted glass</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Button style</FieldLabel>
              <select value={(p.buttonStyle as string) || "solid"} onChange={(e) => updateProps({ buttonStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="solid">Solid</option>
                <option value="outline">Outline</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Hamburger menu</FieldLabel>
              <input type="checkbox" checked={!!(p.hamburgerMenu)} onChange={(e) => updateProps({ hamburgerMenu: e.target.checked })} className="rounded" />
            </Row>
            <Row>
              <FieldLabel>Brand/CTA color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "footer": {
      const footerCols = (p.footerColumns as FooterColumn[]) || [];
      return (
        <>
          <TabSection title="Brand">
            <PropInput label="Brand name" value={p.brandName as string} onChange={(v) => updateProps({ brandName: v })} placeholder="Your Brand" />
            <PropInput label="Logo URL" value={p.logoSrc as string} onChange={(v) => updateProps({ logoSrc: v })} placeholder="https://... (leave blank for color square)" />
            <PropInput label="Copyright text" value={p.copyright as string} onChange={(v) => updateProps({ copyright: v })} placeholder="© 2025 Your Company" />
          </TabSection>
          <TabSection title="Footer columns">
            <ListEditor<FooterColumn>
              items={footerCols}
              onChange={(items) => updateProps({ footerColumns: items })}
              newItem={{ title: "Column", links: [] }}
              addLabel="Add column"
              renderItem={(col, ci, updateCol, removeCol) => (
                <>
                  <ItemHeader label={`Column ${ci + 1}`} onDelete={removeCol} />
                  <input value={col.title} onChange={(e) => updateCol({ title: e.target.value })} placeholder="Column title" className={inputCls} />
                  <div className="ml-2 mt-1 space-y-1">
                    {(col.links || []).map((link, li) => (
                      <div key={li} className="flex gap-1 items-center">
                        <input value={link.label} onChange={(e) => { const nl = [...col.links]; nl[li] = { ...nl[li], label: e.target.value }; updateCol({ links: nl }); }} placeholder="Label" className={cn(inputCls, "flex-1")} />
                        <input value={link.href} onChange={(e) => { const nl = [...col.links]; nl[li] = { ...nl[li], href: e.target.value }; updateCol({ links: nl }); }} placeholder="#" className={cn(inputCls, "flex-1")} />
                        <button onClick={() => updateCol({ links: col.links.filter((_, idx) => idx !== li) })} className="text-red-400 hover:text-red-600 shrink-0"><Trash2 className="h-3 w-3" /></button>
                      </div>
                    ))}
                    <button onClick={() => updateCol({ links: [...(col.links || []), { label: "Link", href: "#" }] })} className="w-full py-1 text-[10px] text-indigo-400 border border-dashed border-indigo-200 rounded hover:bg-indigo-50 flex items-center justify-center gap-1">
                      <Plus className="h-2.5 w-2.5" /> Add link
                    </button>
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "dark"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="white">White</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Brand color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "team": {
      const members = (p.members as TeamMember[]) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
            <PropInput label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} />
          </TabSection>
          <TabSection title="Members">
            <ListEditor<TeamMember>
              items={members}
              onChange={(items) => updateProps({ members: items })}
              newItem={{ name: "New Member", title: "Role" }}
              addLabel="Add member"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Member ${i + 1}`} onDelete={remove} />
                  <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Full Name" className={inputCls} />
                  <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Job Title" className={inputCls} />
                  <textarea value={item.bio || ""} onChange={(e) => update({ bio: e.target.value })} placeholder="Short bio..." rows={2} className={textareaCls} />
                  <input value={item.avatarUrl || ""} onChange={(e) => update({ avatarUrl: e.target.value })} placeholder="Avatar URL (https://...)" className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.social?.twitter || ""} onChange={(e) => update({ social: { ...item.social, twitter: e.target.value } })} placeholder="@twitter" className={inputCls} />
                    <input value={item.social?.linkedin || ""} onChange={(e) => update({ social: { ...item.social, linkedin: e.target.value } })} placeholder="linkedin.com/in/..." className={inputCls} />
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={String((p.columns as number) || 3)} onChange={(v) => updateProps({ columns: parseInt(v) })} renderLabel={(v) => v} />
            </Row>
            <Row>
              <FieldLabel>Avatar shape</FieldLabel>
              <select value={(p.avatarStyle as string) || "rounded"} onChange={(e) => updateProps({ avatarStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Avatar color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "logos": {
      const rawLogos = (p.logos as (string | LogoItem)[]) || ["Acme", "Globex", "Initech", "Umbrella"];
      const logoItems: LogoItem[] = rawLogos.map((l) => typeof l === "string" ? { name: l } : l);
      return (
        <>
        <TabSection title="Logos">
          <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Trusted by teams at" />
          <ListEditor<LogoItem>
            items={logoItems}
            onChange={(items) => updateProps({ logos: items })}
            newItem={{ name: "New Logo" }}
            addLabel="Add logo"
            renderItem={(item, i, update, remove) => (
              <>
                <ItemHeader label={`Logo ${i + 1}`} onDelete={remove} />
                <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Company name" className={inputCls} />
                <input value={item.imageUrl || ""} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="Logo image URL (optional)" className={inputCls} />
              </>
            )}
          />
        </TabSection>
        <TabSection title="Appearance" defaultOpen={false}>
          <Row>
            <FieldLabel>Background</FieldLabel>
            <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
              <option value="white">White</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Row>
          <Row>
            <FieldLabel>Logo color</FieldLabel>
            <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
          </Row>
          <Row>
            <FieldLabel>Grayscale</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(p.grayscale !== false)} onChange={(v) => updateProps({ grayscale: v === "true" })} renderLabel={(v) => v === "true" ? "Gray" : "Color"} />
          </Row>
        </TabSection>
        </>
      );
    }

    case "card":
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Icon (emoji)" value={p.icon as string} onChange={(v) => updateProps({ icon: v })} placeholder="✨" />
            <PropInput label="Title" value={p.title as string} onChange={(v) => updateProps({ title: v })} />
            <PropTextarea label="Description" value={p.description as string} onChange={(v) => updateProps({ description: v })} />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Card style</FieldLabel>
              <select value={(p.cardStyle as string) || "bordered"} onChange={(e) => updateProps({ cardStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="bordered">Bordered</option>
                <option value="shadowed">Shadowed</option>
                <option value="filled">Filled</option>
                <option value="flat">Flat</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <select value={(p.layout as string) || "vertical"} onChange={(e) => updateProps({ layout: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "form":
      return <FormConnectionPanel p={p} updateProps={updateProps} />;

    case "product-grid": {
      const products = (p.products as Product[]) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
          </TabSection>
          <TabSection title="Products">
            <ListEditor<Product>
              items={products}
              onChange={(items) => updateProps({ products: items })}
              newItem={{ name: "New Product", price: "$0" }}
              addLabel="Add product"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Product ${i + 1}`} onDelete={remove} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Product name" className={inputCls} />
                    <input value={item.price} onChange={(e) => update({ price: e.target.value })} placeholder="$49" className={inputCls} />
                  </div>
                  <textarea value={item.description || ""} onChange={(e) => update({ description: e.target.value })} placeholder="Product description..." rows={2} className={textareaCls} />
                  <input value={item.imageUrl || ""} onChange={(e) => update({ imageUrl: e.target.value })} placeholder="Image URL (https://...)" className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.badge || ""} onChange={(e) => update({ badge: e.target.value })} placeholder="Badge: New · Sale" className={inputCls} />
                    <input type="number" min={1} max={5} value={item.rating ?? ""} onChange={(e) => update({ rating: parseFloat(e.target.value) || undefined })} placeholder="Rating 1-5" className={inputCls} />
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={String((p.columns as number) || 3)} onChange={(v) => updateProps({ columns: parseInt(v) })} renderLabel={(v) => v} />
            </Row>
            <Row>
              <FieldLabel>Card style</FieldLabel>
              <select value={(p.cardStyle as string) || "bordered"} onChange={(e) => updateProps({ cardStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="bordered">Bordered</option>
                <option value="minimal">Minimal</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Button color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "accordion": {
      const items = (p.items as FaqItem[]) || [];
      return (
        <TabSection title="Accordion items">
          <ListEditor<FaqItem>
            items={items}
            onChange={(newItems) => updateProps({ items: newItems })}
            newItem={{ question: "New section", answer: "Section content goes here." }}
            addLabel="Add section"
            renderItem={(item, i, update, remove) => (
              <>
                <ItemHeader label={`Item ${i + 1}`} onDelete={remove} />
                <input value={item.question} onChange={(e) => update({ question: e.target.value })} placeholder="Section title" className={inputCls} />
                <textarea value={item.answer} onChange={(e) => update({ answer: e.target.value })} placeholder="Content" rows={2} className={textareaCls} />
              </>
            )}
          />
        </TabSection>
      );
    }

    case "tabs": {
      const tabItems = (p.tabs as Array<{ label: string; content: string }>) || [];
      return (
        <TabSection title="Tabs">
          <ListEditor<{ label: string; content: string }>
            items={tabItems}
            onChange={(items) => updateProps({ tabs: items })}
            newItem={{ label: "New Tab", content: "Tab content goes here." }}
            addLabel="Add tab"
            renderItem={(item, i, update, remove) => (
              <>
                <ItemHeader label={`Tab ${i + 1}`} onDelete={remove} />
                <input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Tab label" className={inputCls} />
                <textarea value={item.content} onChange={(e) => update({ content: e.target.value })} placeholder="Tab content" rows={2} className={textareaCls} />
              </>
            )}
          />
        </TabSection>
      );
    }

    case "countdown":
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Launching soon" />
            <PropInput label="Target date" value={p.targetDate as string} onChange={(v) => updateProps({ targetDate: v })} placeholder="2025-12-31" />
            <PropInput label="Subtext" value={p.subtext as string} onChange={(v) => updateProps({ subtext: v })} placeholder="Get ready for something amazing" />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "dark-gradient"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="dark-gradient">Dark Gradient</option>
                <option value="dark">Dark</option>
                <option value="branded">Branded</option>
                <option value="light">Light</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Unit shape</FieldLabel>
              <select value={(p.unitStyle as string) || "rounded"} onChange={(e) => updateProps({ unitStyle: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="rounded">Rounded</option>
                <option value="circle">Circle</option>
                <option value="square">Square</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "progress": {
      const bars = (p.bars as Array<{ label: string; value: number; color?: string }>) || [];
      return (
        <TabSection title="Progress bars">
          <ListEditor<{ label: string; value: number; color?: string }>
            items={bars}
            onChange={(items) => updateProps({ bars: items })}
            newItem={{ label: "New skill", value: 75 }}
            addLabel="Add progress bar"
            renderItem={(item, i, update, remove) => (
              <>
                <ItemHeader label={`Bar ${i + 1}`} onDelete={remove} />
                <div className="grid grid-cols-2 gap-2">
                  <input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Label" className={inputCls} />
                  <input type="number" min={0} max={100} value={item.value} onChange={(e) => update({ value: parseInt(e.target.value) || 0 })} placeholder="75" className={inputCls} />
                </div>
              </>
            )}
          />
        </TabSection>
      );
    }

    case "social-links": {
      const links = (p.links as Array<{ platform: string; url: string }>) || [];
      return (
        <TabSection title="Social links">
          <ListEditor<{ platform: string; url: string }>
            items={links}
            onChange={(items) => updateProps({ links: items })}
            newItem={{ platform: "twitter", url: "https://twitter.com/" }}
            addLabel="Add link"
            renderItem={(item, i, update, remove) => (
              <>
                <ItemHeader label={`Link ${i + 1}`} onDelete={remove} />
                <select value={item.platform} onChange={(e) => update({ platform: e.target.value })} className={cn(selectCls, "w-full h-6")}>
                  {["twitter", "instagram", "linkedin", "github", "facebook", "youtube", "tiktok", "discord"].map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <input value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://..." className={inputCls} />
              </>
            )}
          />
        </TabSection>
      );
    }

    case "logo":
      return (
        <TabSection title="Logo">
          <PropInput label="Logo URL" value={p.src as string} onChange={(v) => updateProps({ src: v })} placeholder="https://... (PNG, SVG, WebP)" />
          <PropInput label="Alt text" value={p.alt as string} onChange={(v) => updateProps({ alt: v })} placeholder="Company name" />
          <PropInput label="Height" value={p.height as string} onChange={(v) => updateProps({ height: v })} placeholder="40px" />
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-gray-500 font-medium shrink-0">Shape</span>
            <select
              value={(p.shape as string) || "rounded"}
              onChange={(e) => updateProps({ shape: e.target.value })}
              className={cn(selectCls, "flex-1")}
            >
              <option value="rounded">Rounded</option>
              <option value="circle">Circle</option>
              <option value="square">Square</option>
            </select>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-gray-500 font-medium shrink-0">Fallback color</span>
            <ColorPicker value={(p.accentColor as string) || "#6366f1"} onChange={(v) => updateProps({ accentColor: v })} />
          </div>
        </TabSection>
      );

    case "image":
      return (
        <TabSection title="Image">
          <PropInput label="Image URL" value={p.src as string} onChange={(v) => updateProps({ src: v })} placeholder="https://..." />
          <PropInput label="Alt text" value={p.alt as string} onChange={(v) => updateProps({ alt: v })} placeholder="Descriptive alt text" />
          <PropInput label="Caption" value={p.caption as string} onChange={(v) => updateProps({ caption: v })} />
        </TabSection>
      );

    case "video":
      return (
        <TabSection title="Video">
          <PropInput label="Video URL" value={p.src as string} onChange={(v) => updateProps({ src: v })} placeholder="https://youtube.com/watch?v=..." />
        </TabSection>
      );

    case "map":
      return (
        <TabSection title="Map">
          <PropInput label="Location / Address" value={p.location as string} onChange={(v) => updateProps({ location: v })} placeholder="New York, NY" />
          <PropInput label="Embed URL" value={p.embedUrl as string} onChange={(v) => updateProps({ embedUrl: v })} placeholder="Google Maps embed URL" />
        </TabSection>
      );

    case "pricing": {
      const plans = (p.plans as Plan[]) || [];
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Simple, transparent pricing" />
          </TabSection>
          <TabSection title="Plans">
            <ListEditor<Plan>
              items={plans}
              onChange={(items) => updateProps({ plans: items })}
              newItem={{ name: "New Plan", price: "$0", period: "/mo", description: "Plan description", features: "Feature 1, Feature 2", isHighlighted: false, ctaText: "Get Started" }}
              addLabel="Add plan"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Plan ${i + 1}`} onDelete={remove} />
                  <div className="grid grid-cols-3 gap-2">
                    <input value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="Plan name" className={inputCls} />
                    <input value={item.price} onChange={(e) => update({ price: e.target.value })} placeholder="$29" className={inputCls} />
                    <input value={item.period} onChange={(e) => update({ period: e.target.value })} placeholder="/mo" className={inputCls} />
                  </div>
                  <input value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder="Plan description" className={inputCls} />
                  <textarea value={item.features} onChange={(e) => update({ features: e.target.value })} placeholder="Feature 1, Feature 2, Feature 3 (comma-separated)" rows={2} className={textareaCls} />
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <input value={item.ctaText} onChange={(e) => update({ ctaText: e.target.value })} placeholder="Get Started" className={inputCls} />
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-gray-500">Popular</span>
                      <SegmentedButtons options={["true", "false"]} value={String(!!item.isHighlighted)} onChange={(v) => update({ isHighlighted: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
                    </div>
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Highlight color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "hero-split":
      return (
        <>
          <TabSection title="Text">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="The Smart Way to Build" />
            <PropTextarea label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} rows={2} />
          </TabSection>
          <TabSection title="Buttons">
            <PropInput label="Primary CTA" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Get Started" />
            <PropInput label="Secondary CTA" value={p.ctaSecondaryText as string} onChange={(v) => updateProps({ ctaSecondaryText: v })} placeholder="Learn More" />
          </TabSection>
          <TabSection title="Image">
            <PropInput label="Image URL" value={p.imageUrl as string} onChange={(v) => updateProps({ imageUrl: v })} placeholder="https://..." />
            <PropInput label="Image Alt" value={p.imageAlt as string} onChange={(v) => updateProps({ imageAlt: v })} placeholder="Screenshot of product" />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <SegmentedButtons options={["image-right", "image-left"]} value={(p.layout as string) || "image-right"} onChange={(v) => updateProps({ layout: v })} renderLabel={(v) => v === "image-right" ? "Img Right" : "Img Left"} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "light"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="light">Light</option>
                <option value="white">White</option>
                <option value="dark">Dark</option>
                <option value="branded">Branded</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "timeline": {
      const tlItems = (p.items as TimelineItem[]) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Our Journey" />
            <PropInput label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} placeholder="Key milestones" />
          </TabSection>
          <TabSection title="Timeline items">
            <ListEditor<TimelineItem>
              items={tlItems}
              onChange={(items) => updateProps({ items })}
              newItem={{ date: "2024", title: "New milestone", description: "Description", icon: "🚀" }}
              addLabel="Add milestone"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Milestone ${i + 1}`} onDelete={remove} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={item.date} onChange={(e) => update({ date: e.target.value })} placeholder="Date (e.g. Jan 2024)" className={inputCls} />
                    <input value={item.icon} onChange={(e) => update({ icon: e.target.value })} placeholder="Icon emoji" className={inputCls} />
                  </div>
                  <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" className={inputCls} />
                  <textarea value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder="Description" rows={2} className={textareaCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "steps": {
      const stepsItems = (p.steps as Step[]) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="How it works" />
            <PropInput label="Subheadline" value={p.subheadline as string} onChange={(v) => updateProps({ subheadline: v })} placeholder="Simple 3-step process" />
          </TabSection>
          <TabSection title="Steps">
            <ListEditor<Step>
              items={stepsItems}
              onChange={(items) => updateProps({ steps: items })}
              newItem={{ number: stepsItems.length + 1, title: "New Step", description: "Step description" }}
              addLabel="Add step"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Step ${i + 1}`} onDelete={remove} />
                  <div className="grid grid-cols-3 gap-2">
                    <input type="number" value={item.number} onChange={(e) => update({ number: parseInt(e.target.value) || i + 1 })} placeholder="#" className={inputCls} />
                    <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" className={cn(inputCls, "col-span-2")} />
                  </div>
                  <textarea value={item.description} onChange={(e) => update({ description: e.target.value })} placeholder="Description" rows={2} className={textareaCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <SegmentedButtons options={["horizontal", "vertical"]} value={(p.layout as string) || "horizontal"} onChange={(v) => updateProps({ layout: v })} renderLabel={(v) => v === "horizontal" ? "H" : "V"} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "banner":
      return (
        <>
          <TabSection title="Content">
            <PropTextarea label="Message" value={p.message as string} onChange={(v) => updateProps({ message: v })} rows={2} />
            <PropInput label="CTA text (optional)" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Learn more" />
            <Row>
              <FieldLabel>Closeable</FieldLabel>
              <SegmentedButtons options={["true", "false"]} value={String(p.closeable !== false)} onChange={(v) => updateProps({ closeable: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Style</FieldLabel>
              <select value={(p.bgType as string) || "warning"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="warning">Warning</option>
                <option value="info">Info</option>
                <option value="success">Success</option>
                <option value="error">Error</option>
                <option value="brand">Brand</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "pricing-card":
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Plan name" value={p.planName as string} onChange={(v) => updateProps({ planName: v })} placeholder="Pro Plan" />
            <div className="grid grid-cols-2 gap-2">
              <PropInput label="Price" value={p.price as string} onChange={(v) => updateProps({ price: v })} placeholder="$29" />
              <PropInput label="Period" value={p.period as string} onChange={(v) => updateProps({ period: v })} placeholder="/month" />
            </div>
            <PropInput label="Description" value={p.description as string} onChange={(v) => updateProps({ description: v })} placeholder="Perfect for growing teams" />
            <PropTextarea label="Features (one per line)" value={p.features as string} onChange={(v) => updateProps({ features: v })} rows={4} />
            <PropInput label="CTA text" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Get Started" />
            <Row>
              <FieldLabel>Most Popular</FieldLabel>
              <SegmentedButtons options={["true", "false"]} value={String(!!p.isHighlighted)} onChange={(v) => updateProps({ isHighlighted: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
          </TabSection>
        </>
      );

    case "feature-highlight": {
      const fhFeatures = (p.features as SimpleTextItem[]) || [];
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Everything you need" />
            <PropTextarea label="Description" value={p.description as string} onChange={(v) => updateProps({ description: v })} rows={3} />
            <PropInput label="Image URL (optional)" value={p.imageUrl as string} onChange={(v) => updateProps({ imageUrl: v })} placeholder="https://..." />
          </TabSection>
          <TabSection title="Feature list">
            <ListEditor<SimpleTextItem>
              items={fhFeatures}
              onChange={(items) => updateProps({ features: items })}
              newItem={{ text: "New feature" }}
              addLabel="Add feature"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Item ${i + 1}`} onDelete={remove} />
                  <input value={item.text} onChange={(e) => update({ text: e.target.value })} placeholder="Feature description" className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <SegmentedButtons options={["image-right", "image-left"]} value={(p.layout as string) || "image-right"} onChange={(v) => updateProps({ layout: v })} renderLabel={(v) => v === "image-right" ? "Img Right" : "Img Left"} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "image-gallery": {
      const galleryImages = (p.images as GalleryImage[]) || [];
      return (
        <>
          <TabSection title="Images">
            <ListEditor<GalleryImage>
              items={galleryImages}
              onChange={(items) => updateProps({ images: items })}
              newItem={{ src: "", alt: "" }}
              addLabel="Add image"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Image ${i + 1}`} onDelete={remove} />
                  <input value={item.src} onChange={(e) => update({ src: e.target.value })} placeholder="Image URL (https://...)" className={inputCls} />
                  <input value={item.alt} onChange={(e) => update({ alt: e.target.value })} placeholder="Alt text" className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={String((p.columns as number) || 3)} onChange={(v) => updateProps({ columns: parseInt(v) })} renderLabel={(v) => v} />
            </Row>
            <Row>
              <FieldLabel>Gap</FieldLabel>
              <SegmentedButtons options={["sm", "md", "lg"]} value={(p.gap as string) || "md"} onChange={(v) => updateProps({ gap: v })} renderLabel={(v) => v.toUpperCase()} />
            </Row>
            <Row>
              <FieldLabel>Style</FieldLabel>
              <SegmentedButtons options={["grid", "masonry"]} value={(p.style as string) || "grid"} onChange={(v) => updateProps({ style: v })} renderLabel={(v) => v === "grid" ? "Grid" : "Masonry"} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "video-embed":
      return (
        <>
          <TabSection title="Video">
            <PropInput label="URL" value={p.url as string} onChange={(v) => updateProps({ url: v })} placeholder="YouTube or Vimeo URL" />
            <PropInput label="Poster image (optional)" value={p.poster as string} onChange={(v) => updateProps({ poster: v })} placeholder="Thumbnail URL" />
            <PropInput label="Caption (optional)" value={p.caption as string} onChange={(v) => updateProps({ caption: v })} placeholder="Video caption text" />
            <Row>
              <FieldLabel>Provider</FieldLabel>
              <select value={(p.provider as string) || "youtube"} onChange={(e) => updateProps({ provider: e.target.value })} className={cn(selectCls, "w-28")}>
                <option value="youtube">YouTube</option>
                <option value="vimeo">Vimeo</option>
                <option value="custom">Custom</option>
              </select>
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Aspect ratio</FieldLabel>
              <SegmentedButtons options={["16/9", "4/3", "1/1"]} value={(p.aspectRatio as string) || "16/9"} onChange={(v) => updateProps({ aspectRatio: v })} renderLabel={(v) => v} />
            </Row>
          </TabSection>
        </>
      );

    case "profile-card":
      return (
        <>
          <TabSection title="Profile">
            <PropInput label="Name" value={p.name as string} onChange={(v) => updateProps({ name: v })} placeholder="Alex Johnson" />
            <PropInput label="Role" value={p.role as string} onChange={(v) => updateProps({ role: v })} placeholder="Lead Designer" />
            <PropTextarea label="Bio" value={p.bio as string} onChange={(v) => updateProps({ bio: v })} rows={3} />
            <PropInput label="Avatar URL (optional)" value={p.avatarUrl as string} onChange={(v) => updateProps({ avatarUrl: v })} placeholder="https://..." />
          </TabSection>
          <TabSection title="Social links">
            <PropInput label="Twitter" value={(p.social as Record<string,string>)?.twitter || ""} onChange={(v) => updateProps({ social: { ...(p.social as Record<string,string> || {}), twitter: v } })} placeholder="@handle" />
            <PropInput label="LinkedIn" value={(p.social as Record<string,string>)?.linkedin || ""} onChange={(v) => updateProps({ social: { ...(p.social as Record<string,string> || {}), linkedin: v } })} placeholder="linkedin.com/in/..." />
            <PropInput label="GitHub" value={(p.social as Record<string,string>)?.github || ""} onChange={(v) => updateProps({ social: { ...(p.social as Record<string,string> || {}), github: v } })} placeholder="github.com/..." />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
          </TabSection>
        </>
      );

    case "comparison-table": {
      const ctCols = (p.columns as ComparisonColumn[]) || [];
      const ctRows = (p.rows as ComparisonRow[]) || [];
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Compare plans" />
          </TabSection>
          <TabSection title="Columns">
            <ListEditor<ComparisonColumn>
              items={ctCols}
              onChange={(items) => updateProps({ columns: items })}
              newItem={{ label: "Column", isHighlighted: false }}
              addLabel="Add column"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Col ${i + 1}`} onDelete={remove} />
                  <div className="flex gap-2 items-center">
                    <input value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="Column label" className={cn(inputCls, "flex-1")} />
                    <SegmentedButtons options={["true", "false"]} value={String(!!item.isHighlighted)} onChange={(v) => update({ isHighlighted: v === "true" })} renderLabel={(v) => v === "true" ? "★" : "—"} />
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Rows">
            <ListEditor<ComparisonRow>
              items={ctRows}
              onChange={(items) => updateProps({ rows: items })}
              newItem={{ feature: "Feature", values: "" }}
              addLabel="Add row"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Row ${i + 1}`} onDelete={remove} />
                  <input value={item.feature} onChange={(e) => update({ feature: e.target.value })} placeholder="Feature name" className={inputCls} />
                  <input value={item.values} onChange={(e) => update({ values: e.target.value })} placeholder="val1, val2, val3 (comma-sep, per column)" className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "white"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="white">White</option>
                <option value="dark">Dark</option>
              </select>
            </Row>
          </TabSection>
        </>
      );
    }

    case "before-after": {
      const beforeItems = (p.beforeItems as BeforeAfterItem[]) || [];
      const afterItems = (p.afterItems as BeforeAfterItem[]) || [];
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Before vs After" />
            <div className="grid grid-cols-2 gap-2">
              <PropInput label="Before label" value={p.beforeLabel as string} onChange={(v) => updateProps({ beforeLabel: v })} placeholder="Before" />
              <PropInput label="After label" value={p.afterLabel as string} onChange={(v) => updateProps({ afterLabel: v })} placeholder="After" />
            </div>
          </TabSection>
          <TabSection title="Before items">
            <ListEditor<BeforeAfterItem>
              items={beforeItems}
              onChange={(items) => updateProps({ beforeItems: items })}
              newItem={{ text: "Old problem" }}
              addLabel="Add before item"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Before ${i + 1}`} onDelete={remove} />
                  <input value={item.text} onChange={(e) => update({ text: e.target.value })} placeholder="Issue / old way" className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="After items">
            <ListEditor<BeforeAfterItem>
              items={afterItems}
              onChange={(items) => updateProps({ afterItems: items })}
              newItem={{ text: "New solution" }}
              addLabel="Add after item"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`After ${i + 1}`} onDelete={remove} />
                  <input value={item.text} onChange={(e) => update({ text: e.target.value })} placeholder="Benefit / new way" className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );
    }

    case "metric-card":
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Value" value={p.value as string} onChange={(v) => updateProps({ value: v })} placeholder="98.2%" />
            <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Uptime" />
            <PropInput label="Change" value={p.change as string} onChange={(v) => updateProps({ change: v })} placeholder="+2.4%" />
            <Row>
              <FieldLabel>Trend</FieldLabel>
              <select value={(p.trend as string) || "up"} onChange={(e) => updateProps({ trend: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="up">Up</option>
                <option value="down">Down</option>
                <option value="neutral">Neutral</option>
              </select>
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "cta-banner":
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} placeholder="Ready to transform your workflow?" />
            <PropInput label="CTA text" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Get Started" />
            <PropInput label="Secondary CTA (optional)" value={p.secondaryCtaText as string} onChange={(v) => updateProps({ secondaryCtaText: v })} placeholder="Learn more" />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Layout</FieldLabel>
              <SegmentedButtons options={["split", "centered"]} value={(p.layout as string) || "split"} onChange={(v) => updateProps({ layout: v })} renderLabel={(v) => v === "split" ? "Split" : "Center"} />
            </Row>
            <Row>
              <FieldLabel>Background</FieldLabel>
              <select value={(p.bgType as string) || "branded"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="branded">Branded</option>
                <option value="dark">Dark</option>
                <option value="light">Light</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Accent color</FieldLabel>
              <ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} />
            </Row>
          </TabSection>
        </>
      );

    case "nav-announcement":
      return (
        <>
          <TabSection title="Content">
            <PropInput label="Message" value={p.message as string} onChange={(v) => updateProps({ message: v })} placeholder="New feature just launched!" />
            <PropInput label="CTA text (optional)" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Learn more" />
            <Row>
              <FieldLabel>Closeable</FieldLabel>
              <SegmentedButtons options={["true", "false"]} value={String(p.closeable !== false)} onChange={(v) => updateProps({ closeable: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
            </Row>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Style</FieldLabel>
              <select value={(p.bgType as string) || "info"} onChange={(e) => updateProps({ bgType: e.target.value })} className={cn(selectCls, "w-24")}>
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="success">Success</option>
                <option value="brand">Brand</option>
              </select>
            </Row>
          </TabSection>
        </>
      );

    case "cookie-banner":
      return (
        <>
          <TabSection title="Content">
            <PropTextarea label="Message" value={p.message as string} onChange={(v) => updateProps({ message: v })} rows={3} />
            <div className="grid grid-cols-2 gap-2">
              <PropInput label="Accept text" value={p.acceptText as string} onChange={(v) => updateProps({ acceptText: v })} placeholder="Accept all" />
              <PropInput label="Decline text" value={p.declineText as string} onChange={(v) => updateProps({ declineText: v })} placeholder="Decline" />
            </div>
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Theme</FieldLabel>
              <SegmentedButtons options={["dark", "light"]} value={(p.bgType as string) || "dark"} onChange={(v) => updateProps({ bgType: v })} renderLabel={(v) => v === "dark" ? "Dark" : "Light"} />
            </Row>
            <Row>
              <FieldLabel>Position</FieldLabel>
              <SegmentedButtons options={["bottom", "top"]} value={(p.position as string) || "bottom"} onChange={(v) => updateProps({ position: v })} renderLabel={(v) => v === "bottom" ? "Bottom" : "Top"} />
            </Row>
          </TabSection>
        </>
      );

    // ── Typography elements ──
    case "blockquote":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropTextarea label="Quote text" value={element.content || (p.text as string)} onChange={(v) => updateElementContent(element.id, v)} rows={3} />
          <PropInput label="Citation / Author" value={p.cite as string} onChange={(v) => updateProps({ cite: v })} placeholder="— Author Name" />
          <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "code-block":
      return (
        <div className="px-4 py-3 space-y-2">
          <Row>
            <FieldLabel>Language</FieldLabel>
            <select value={(p.language as string) || "javascript"} onChange={(e) => updateProps({ language: e.target.value })} className={cn(selectCls, "w-28")}>
              {["javascript", "typescript", "python", "html", "css", "bash", "json", "sql"].map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </Row>
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Code</p>
            <textarea value={element.content || (p.code as string) || ""} onChange={(e) => updateElementContent(element.id, e.target.value)} rows={6} placeholder="// Your code here" className="w-full rounded-lg border border-gray-200 bg-gray-900 px-3 py-2 text-xs text-green-400 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none" />
          </div>
        </div>
      );

    case "eyebrow":
      return (
        <div className="px-4 py-3 space-y-2">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Label Text</p>
            <input value={element.content || ""} onChange={(e) => updateElementContent(element.id, e.target.value)} placeholder="Featured · New · Category" className={cn(inputCls, "h-8")} />
          </div>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "alert":
      return (
        <div className="px-4 py-3 space-y-2">
          <Row>
            <FieldLabel>Type</FieldLabel>
            <select value={(p.alertType as string) || "info"} onChange={(e) => updateProps({ alertType: e.target.value })} className={cn(selectCls, "w-28")}>
              <option value="info">Info</option>
              <option value="success">Success</option>
              <option value="warning">Warning</option>
              <option value="error">Error</option>
            </select>
          </Row>
          <PropInput label="Title (optional)" value={p.title as string} onChange={(v) => updateProps({ title: v })} placeholder="Heads up!" />
          <PropTextarea label="Message" value={element.content || (p.message as string)} onChange={(v) => updateElementContent(element.id, v)} rows={3} />
          <Row>
            <FieldLabel>Dismissible</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(p.dismissible !== false)} onChange={(v) => updateProps({ dismissible: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
        </div>
      );

    case "kbd":
      return (
        <div className="px-4 py-3 space-y-2">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Key(s)</p>
            <input value={element.content || ""} onChange={(e) => updateElementContent(element.id, e.target.value)} placeholder="⌘ K  or  Ctrl + C" className={cn(inputCls, "h-8")} />
          </div>
        </div>
      );

    case "number-display":
      return (
        <div className="px-4 py-3 space-y-2">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Value</p>
            <input value={element.content || (p.value as string) || ""} onChange={(e) => updateElementContent(element.id, e.target.value)} placeholder="10K+" className={cn(inputCls, "h-8")} />
          </div>
          <PropInput label="Label below" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Monthly active users" />
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "text-link":
      return (
        <div className="px-4 py-3 space-y-2">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Link Text</p>
            <input value={element.content || (p.label as string) || ""} onChange={(e) => updateElementContent(element.id, e.target.value)} placeholder="Learn more →" className={cn(inputCls, "h-8")} />
          </div>
          <PageLinkInput label="URL" value={p.href as string} onChange={(v) => updateProps({ href: v })} placeholder="https://... or #section" />
          <Row>
            <FieldLabel>Open in new tab</FieldLabel>
            <SegmentedButtons options={["false", "true"]} value={String(!!p.openInNewTab)} onChange={(v) => updateProps({ openInNewTab: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
        </div>
      );

    // ── Media elements ──
    case "embed":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Embed URL" value={p.url as string} onChange={(v) => updateProps({ url: v })} placeholder="https://..." />
          <Row>
            <FieldLabel>Aspect ratio</FieldLabel>
            <select value={(p.aspectRatio as string) || "16/9"} onChange={(e) => updateProps({ aspectRatio: e.target.value })} className={cn(selectCls, "w-24")}>
              <option value="16/9">16:9</option>
              <option value="4/3">4:3</option>
              <option value="1/1">1:1</option>
              <option value="9/16">9:16</option>
            </select>
          </Row>
        </div>
      );

    case "audio":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Audio URL" value={p.src as string} onChange={(v) => updateProps({ src: v })} placeholder="https://...mp3" />
          <PropInput label="Track title" value={element.content || (p.title as string)} onChange={(v) => updateElementContent(element.id, v)} placeholder="Track name" />
          <Row>
            <FieldLabel>Autoplay</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.autoplay)} onChange={(v) => updateProps({ autoplay: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
        </div>
      );

    case "avatar":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Name" value={element.content || (p.name as string)} onChange={(v) => updateElementContent(element.id, v)} placeholder="User Name" />
          <PropInput label="Image URL" value={p.src as string} onChange={(v) => updateProps({ src: v })} placeholder="https://..." />
          <Row>
            <FieldLabel>Size</FieldLabel>
            <SegmentedButtons options={["sm", "md", "lg"]} value={(p.size as string) || "md"} onChange={(v) => updateProps({ size: v })} renderLabel={(v) => v} />
          </Row>
          <Row>
            <FieldLabel>Show name</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(p.showName !== false)} onChange={(v) => updateProps({ showName: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "avatar-group":
      return (
        <div className="px-4 py-3 space-y-2">
          <Row>
            <FieldLabel>Count</FieldLabel>
            <input type="number" min={1} max={20} value={(p.count as number) || 5} onChange={(e) => updateProps({ count: parseInt(e.target.value) || 5 })} className={cn(inputCls, "w-20")} />
          </Row>
          <PropInput label="Label text" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="and 12 others joined" />
        </div>
      );

    case "svg":
      return (
        <div className="px-4 py-3 space-y-2">
          <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">SVG Markup</p>
          <textarea value={(p.markup as string) || ""} onChange={(e) => updateProps({ markup: e.target.value })} rows={6} placeholder="<svg>...</svg>" className={textareaCls} />
        </div>
      );

    // ── Form elements ──
    case "input":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Email address" />
          <PropInput label="Placeholder" value={p.placeholder as string} onChange={(v) => updateProps({ placeholder: v })} placeholder="Enter your email..." />
          <PropInput label="Helper text" value={p.helperText as string} onChange={(v) => updateProps({ helperText: v })} placeholder="We'll never share your email." />
          <PropInput label="Error message" value={p.errorMessage as string} onChange={(v) => updateProps({ errorMessage: v })} placeholder="Custom validation error..." />
          <Row>
            <FieldLabel>Input type</FieldLabel>
            <select value={(p.inputType as string) || "text"} onChange={(e) => updateProps({ inputType: e.target.value })} className={cn(selectCls, "w-28")}>
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="password">Password</option>
              <option value="number">Number</option>
              <option value="tel">Phone</option>
              <option value="url">URL</option>
              <option value="date">Date</option>
            </select>
          </Row>
          <Row>
            <FieldLabel>Required</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.required)} onChange={(v) => updateProps({ required: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
          <Row>
            <FieldLabel>Min length</FieldLabel>
            <input type="number" min={0} value={(p.minLength as number) || ""} onChange={(e) => updateProps({ minLength: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="—" className={cn(inputCls, "w-20")} />
          </Row>
          <Row>
            <FieldLabel>Max length</FieldLabel>
            <input type="number" min={0} value={(p.maxLength as number) || ""} onChange={(e) => updateProps({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="—" className={cn(inputCls, "w-20")} />
          </Row>
          <PropInput label="Pattern (regex)" value={p.pattern as string} onChange={(v) => updateProps({ pattern: v })} placeholder="^[A-Za-z]+$" />
          {((p.inputType as string) === "number" || (p.inputType as string) === "date") && (
            <>
              <PropInput label="Min" value={p.min as string} onChange={(v) => updateProps({ min: v })} placeholder="0" />
              <PropInput label="Max" value={p.max as string} onChange={(v) => updateProps({ max: v })} placeholder="100" />
            </>
          )}
        </div>
      );

    case "textarea":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Message" />
          <PropInput label="Placeholder" value={p.placeholder as string} onChange={(v) => updateProps({ placeholder: v })} placeholder="Enter your message..." />
          <PropInput label="Error message" value={p.errorMessage as string} onChange={(v) => updateProps({ errorMessage: v })} placeholder="Custom validation error..." />
          <Row>
            <FieldLabel>Rows</FieldLabel>
            <input type="number" min={2} max={20} value={(p.rows as number) || 4} onChange={(e) => updateProps({ rows: parseInt(e.target.value) || 4 })} className={cn(inputCls, "w-20")} />
          </Row>
          <Row>
            <FieldLabel>Required</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.required)} onChange={(v) => updateProps({ required: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
          <Row>
            <FieldLabel>Min length</FieldLabel>
            <input type="number" min={0} value={(p.minLength as number) || ""} onChange={(e) => updateProps({ minLength: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="—" className={cn(inputCls, "w-20")} />
          </Row>
          <Row>
            <FieldLabel>Max length</FieldLabel>
            <input type="number" min={0} value={(p.maxLength as number) || ""} onChange={(e) => updateProps({ maxLength: e.target.value ? parseInt(e.target.value) : undefined })} placeholder="—" className={cn(inputCls, "w-20")} />
          </Row>
        </div>
      );

    case "select":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Country" />
          <PropInput label="Placeholder option" value={p.placeholder as string} onChange={(v) => updateProps({ placeholder: v })} placeholder="Select an option..." />
          <PropInput label="Error message" value={p.errorMessage as string} onChange={(v) => updateProps({ errorMessage: v })} placeholder="Custom validation error..." />
          <Row>
            <FieldLabel>Required</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.required)} onChange={(v) => updateProps({ required: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Options (one per line)</p>
            <textarea
              value={((p.options as string[]) || []).join("\n")}
              onChange={(e) => updateProps({ options: e.target.value.split("\n").filter(Boolean) })}
              rows={4}
              placeholder={"Option 1\nOption 2\nOption 3"}
              className={textareaCls}
            />
          </div>
        </div>
      );

    case "multi-select":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Technologies" />
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Options (one per line)</p>
            <textarea
              value={((p.options as string[]) || []).join("\n")}
              onChange={(e) => updateProps({ options: e.target.value.split("\n").filter(Boolean) })}
              rows={4}
              placeholder={"React\nVue\nAngular"}
              className={textareaCls}
            />
          </div>
          <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "checkbox":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label text" value={element.content || (p.label as string)} onChange={(v) => updateElementContent(element.id, v)} placeholder="I agree to the terms" />
          <Row>
            <FieldLabel>Default checked</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.defaultChecked)} onChange={(v) => updateProps({ defaultChecked: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "radio-group":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Group label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Choose an option" />
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Options (one per line)</p>
            <textarea
              value={((p.options as string[]) || []).join("\n")}
              onChange={(e) => updateProps({ options: e.target.value.split("\n").filter(Boolean) })}
              rows={4}
              placeholder={"Option A\nOption B\nOption C"}
              className={textareaCls}
            />
          </div>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "toggle":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label text" value={element.content || (p.label as string)} onChange={(v) => updateElementContent(element.id, v)} placeholder="Enable notifications" />
          <Row>
            <FieldLabel>Default on</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(p.defaultChecked !== false)} onChange={(v) => updateProps({ defaultChecked: v === "true" })} renderLabel={(v) => v === "true" ? "On" : "Off"} />
          </Row>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "slider":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Volume" />
          <div className="grid grid-cols-3 gap-2">
            <div><p className="text-[10px] text-gray-500 mb-1">Min</p><input type="number" value={(p.min as number) ?? 0} onChange={(e) => updateProps({ min: parseInt(e.target.value) })} className={inputCls} /></div>
            <div><p className="text-[10px] text-gray-500 mb-1">Max</p><input type="number" value={(p.max as number) ?? 100} onChange={(e) => updateProps({ max: parseInt(e.target.value) })} className={inputCls} /></div>
            <div><p className="text-[10px] text-gray-500 mb-1">Default</p><input type="number" value={(p.defaultValue as number) ?? 50} onChange={(e) => updateProps({ defaultValue: parseInt(e.target.value) })} className={inputCls} /></div>
          </div>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "date-picker":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Select date" />
          <PropInput label="Helper text" value={p.helperText as string} onChange={(v) => updateProps({ helperText: v })} placeholder="YYYY-MM-DD" />
        </div>
      );

    case "file-upload":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} />
          <PropInput label="Description" value={p.placeholder as string} onChange={(v) => updateProps({ placeholder: v })} placeholder="Click to upload or drag & drop" />
          <PropInput label="Accepted files" value={p.accept as string} onChange={(v) => updateProps({ accept: v })} placeholder="PNG, JPG, PDF up to 10MB" />
          <Row>
            <FieldLabel>Multiple files</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.multiple)} onChange={(v) => updateProps({ multiple: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
        </div>
      );

    case "search-input":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Placeholder" value={p.placeholder as string} onChange={(v) => updateProps({ placeholder: v })} placeholder="Search..." />
          <PropInput label="Button text" value={p.buttonText as string} onChange={(v) => updateProps({ buttonText: v })} placeholder="Search" />
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "otp-input":
      return (
        <div className="px-4 py-3 space-y-2">
          <Row>
            <FieldLabel>Number of digits</FieldLabel>
            <SegmentedButtons options={["4", "6", "8"]} value={String((p.length as number) || 6)} onChange={(v) => updateProps({ length: parseInt(v) })} renderLabel={(v) => v} />
          </Row>
          <PropInput label="Helper text" value={p.helperText as string} onChange={(v) => updateProps({ helperText: v })} placeholder="Enter the 6-digit code" />
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    // ── Navigation ──
    case "mobile-menu": {
      const mmLinks = (p.links as string[]) || [];
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Brand name" value={p.brandName as string} onChange={(v) => updateProps({ brandName: v })} placeholder="YourBrand" />
          <PropInput label="CTA text" value={p.ctaText as string} onChange={(v) => updateProps({ ctaText: v })} placeholder="Get Started" />
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Links (one per line)</p>
            <textarea value={mmLinks.join("\n")} onChange={(e) => updateProps({ links: e.target.value.split("\n").filter(Boolean) })} rows={4} placeholder={"Home\nFeatures\nPricing\nAbout"} className={textareaCls} />
          </div>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );
    }

    case "mega-menu": {
      const mgCats = (p.categories as Array<{ title: string; items: string[] }>) || [];
      return (
        <div className="px-4 py-3 space-y-2">
          <TabSection title="Categories">
            <ListEditor<{ title: string; items: string[] }>
              items={mgCats}
              onChange={(items) => updateProps({ categories: items })}
              newItem={{ title: "New Category", items: ["Item 1", "Item 2"] }}
              addLabel="Add category"
              renderItem={(cat, i, update, remove) => (
                <>
                  <ItemHeader label={`Category ${i + 1}`} onDelete={remove} />
                  <input value={cat.title} onChange={(e) => update({ title: e.target.value })} placeholder="Category name" className={inputCls} />
                  <textarea value={(cat.items || []).join("\n")} onChange={(e) => update({ items: e.target.value.split("\n").filter(Boolean) })} rows={3} placeholder={"Item 1\nItem 2"} className={textareaCls} />
                </>
              )}
            />
          </TabSection>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );
    }

    // ── Section blocks ──
    case "bento-grid": {
      const bgCells = (p.cells as Array<{ title: string; description?: string; span?: string; rowSpan?: string }>) || [];
      return (
        <>
          <TabSection title="Text">
            <PropInput label="Heading" value={p.heading as string} onChange={(v) => updateProps({ heading: v })} />
            <PropInput label="Subheading" value={p.subheading as string} onChange={(v) => updateProps({ subheading: v })} />
          </TabSection>
          <TabSection title="Cells">
            <ListEditor<{ title: string; description?: string; span?: string; rowSpan?: string }>
              items={bgCells}
              onChange={(items) => updateProps({ cells: items })}
              newItem={{ title: "New Cell", description: "Description", span: "1", rowSpan: "1" }}
              addLabel="Add cell"
              renderItem={(cell, i, update, remove) => (
                <>
                  <ItemHeader label={`Cell ${i + 1}`} onDelete={remove} />
                  <input value={cell.title} onChange={(e) => update({ title: e.target.value })} placeholder="Cell title" className={inputCls} />
                  <input value={cell.description || ""} onChange={(e) => update({ description: e.target.value })} placeholder="Description" className={inputCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <div><p className="text-[10px] text-gray-500 mb-1">Col span</p>
                      <select value={cell.span || "1"} onChange={(e) => update({ span: e.target.value })} className={cn(selectCls, "w-full")}>{["1","2","3"].map(v => <option key={v} value={v}>{v}</option>)}</select>
                    </div>
                    <div><p className="text-[10px] text-gray-500 mb-1">Row span</p>
                      <select value={cell.rowSpan || "1"} onChange={(e) => update({ rowSpan: e.target.value })} className={cn(selectCls, "w-full")}>{["1","2","3"].map(v => <option key={v} value={v}>{v}</option>)}</select>
                    </div>
                  </div>
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <PropInput label="Gap" value={p.gap as string} onChange={(v) => updateProps({ gap: v })} placeholder="16px" />
            <PropInput label="Cell border radius" value={p.cellRadius as string} onChange={(v) => updateProps({ cellRadius: v })} placeholder="16px" />
            <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
          </TabSection>
        </>
      );
    }

    case "how-it-works": {
      const hiwSteps = (p.steps as Array<{ number: string; title: string; description: string }>) || [];
      return (
        <>
          <TabSection title="Text">
            <PropInput label="Eyebrow" value={p.eyebrow as string} onChange={(v) => updateProps({ eyebrow: v })} placeholder="Simple process" />
            <PropInput label="Heading" value={p.heading as string} onChange={(v) => updateProps({ heading: v })} />
            <PropInput label="Subheading" value={p.subheading as string} onChange={(v) => updateProps({ subheading: v })} />
          </TabSection>
          <TabSection title="Steps">
            <ListEditor<{ number: string; title: string; description: string }>
              items={hiwSteps}
              onChange={(items) => updateProps({ steps: items })}
              newItem={{ number: "04", title: "New Step", description: "Step description" }}
              addLabel="Add step"
              renderItem={(step, i, update, remove) => (
                <>
                  <ItemHeader label={`Step ${i + 1}`} onDelete={remove} />
                  <div className="grid grid-cols-3 gap-2">
                    <input value={step.number} onChange={(e) => update({ number: e.target.value })} placeholder="01" className={inputCls} />
                    <input value={step.title} onChange={(e) => update({ title: e.target.value })} placeholder="Step title" className={cn(inputCls, "col-span-2")} />
                  </div>
                  <textarea value={step.description} onChange={(e) => update({ description: e.target.value })} rows={2} className={textareaCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={(p.columns as string) || "3"} onChange={(v) => updateProps({ columns: v })} renderLabel={(v) => v} />
            </Row>
            <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
          </TabSection>
        </>
      );
    }

    case "blog-grid": {
      const blgPosts = (p.posts as Array<{ title: string; excerpt?: string; category?: string; author?: string; date?: string; href?: string }>) || [];
      return (
        <>
          <TabSection title="Text">
            <PropInput label="Eyebrow" value={p.eyebrow as string} onChange={(v) => updateProps({ eyebrow: v })} placeholder="Blog" />
            <PropInput label="Heading" value={p.heading as string} onChange={(v) => updateProps({ heading: v })} />
          </TabSection>
          <TabSection title="Posts">
            <ListEditor<{ title: string; excerpt?: string; category?: string; author?: string; date?: string; href?: string }>
              items={blgPosts}
              onChange={(items) => updateProps({ posts: items })}
              newItem={{ title: "New Post", excerpt: "Post excerpt...", category: "Category", author: "Author", date: "2026", href: "#" }}
              addLabel="Add post"
              renderItem={(post, i, update, remove) => (
                <>
                  <ItemHeader label={`Post ${i + 1}`} onDelete={remove} />
                  <input value={post.title} onChange={(e) => update({ title: e.target.value })} placeholder="Post title" className={inputCls} />
                  <textarea value={post.excerpt || ""} onChange={(e) => update({ excerpt: e.target.value })} rows={2} placeholder="Excerpt..." className={textareaCls} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={post.category || ""} onChange={(e) => update({ category: e.target.value })} placeholder="Category" className={inputCls} />
                    <input value={post.date || ""} onChange={(e) => update({ date: e.target.value })} placeholder="Mar 2026" className={inputCls} />
                  </div>
                  <input value={post.href || ""} onChange={(e) => update({ href: e.target.value })} placeholder="https://..." className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={(p.columns as string) || "3"} onChange={(v) => updateProps({ columns: v })} renderLabel={(v) => v} />
            </Row>
            <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
          </TabSection>
        </>
      );
    }

    case "portfolio-grid": {
      const pgItems = (p.items as Array<{ title: string; category?: string; image?: string; href?: string }>) || [];
      return (
        <>
          <TabSection title="Text">
            <PropInput label="Heading" value={p.heading as string} onChange={(v) => updateProps({ heading: v })} />
          </TabSection>
          <TabSection title="Projects">
            <ListEditor<{ title: string; category?: string; image?: string; href?: string }>
              items={pgItems}
              onChange={(items) => updateProps({ items })}
              newItem={{ title: "New Project", category: "Category", image: "", href: "#" }}
              addLabel="Add project"
              renderItem={(item, i, update, remove) => (
                <>
                  <ItemHeader label={`Project ${i + 1}`} onDelete={remove} />
                  <input value={item.title} onChange={(e) => update({ title: e.target.value })} placeholder="Project title" className={inputCls} />
                  <input value={item.category || ""} onChange={(e) => update({ category: e.target.value })} placeholder="Category" className={inputCls} />
                  <input value={item.image || ""} onChange={(e) => update({ image: e.target.value })} placeholder="Image URL" className={inputCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={(p.columns as string) || "3"} onChange={(v) => updateProps({ columns: v })} renderLabel={(v) => v} />
            </Row>
            <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
          </TabSection>
        </>
      );
    }

    case "announcement":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Text" value={p.text as string} onChange={(v) => updateProps({ text: v })} placeholder="🎉 We just launched v2.0!" />
          <PropInput label="CTA label" value={p.ctaLabel as string} onChange={(v) => updateProps({ ctaLabel: v })} placeholder="Read more →" />
          <PropInput label="CTA link" value={p.ctaHref as string} onChange={(v) => updateProps({ ctaHref: v })} placeholder="#" />
          <Row>
            <FieldLabel>Dismissible</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.dismissible)} onChange={(v) => updateProps({ dismissible: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
          <Row><FieldLabel>Background color</FieldLabel><ColorPicker value={(p.backgroundColor as string) || "#6366f1"} onChange={(v) => updateProps({ backgroundColor: v })} /></Row>
          <Row><FieldLabel>Text color</FieldLabel><ColorPicker value={(p.textColor as string) || "#ffffff"} onChange={(v) => updateProps({ textColor: v })} /></Row>
        </div>
      );

    case "blog-card":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Title" value={element.content || (p.title as string)} onChange={(v) => updateElementContent(element.id, v)} placeholder="Post title" />
          <PropTextarea label="Excerpt" value={p.excerpt as string} onChange={(v) => updateProps({ excerpt: v })} rows={2} />
          <PropInput label="Category" value={p.category as string} onChange={(v) => updateProps({ category: v })} placeholder="Tutorial" />
          <PropInput label="Author" value={p.author as string} onChange={(v) => updateProps({ author: v })} placeholder="Author name" />
          <PropInput label="Date" value={p.date as string} onChange={(v) => updateProps({ date: v })} placeholder="Mar 2026" />
          <PropInput label="Link URL" value={p.href as string} onChange={(v) => updateProps({ href: v })} placeholder="#" />
          <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "portfolio-item":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Title" value={element.content || (p.title as string)} onChange={(v) => updateElementContent(element.id, v)} placeholder="Project title" />
          <PropInput label="Category" value={p.category as string} onChange={(v) => updateProps({ category: v })} placeholder="Branding" />
          <PropInput label="Image URL" value={p.image as string} onChange={(v) => updateProps({ image: v })} placeholder="https://..." />
          <PropInput label="Link URL" value={p.href as string} onChange={(v) => updateProps({ href: v })} placeholder="#" />
        </div>
      );

    case "team-member":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Name" value={element.content || (p.name as string)} onChange={(v) => updateElementContent(element.id, v)} placeholder="Alex Morgan" />
          <PropInput label="Role / Title" value={p.role as string} onChange={(v) => updateProps({ role: v })} placeholder="CEO & Co-founder" />
          <PropTextarea label="Bio" value={p.bio as string} onChange={(v) => updateProps({ bio: v })} rows={2} />
          <PropInput label="Avatar URL" value={p.avatarUrl as string} onChange={(v) => updateProps({ avatarUrl: v })} placeholder="https://..." />
          <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    // ── E-Commerce ──
    case "add-to-cart":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Button text" value={p.buttonText as string} onChange={(v) => updateProps({ buttonText: v })} placeholder="Add to Cart" />
          <Row><FieldLabel>Button color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "price-display":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Price" value={p.price as string} onChange={(v) => updateProps({ price: v })} placeholder="$29.99" />
          <PropInput label="Original price (strikethrough)" value={p.originalPrice as string} onChange={(v) => updateProps({ originalPrice: v })} placeholder="$49.99" />
          <PropInput label="Badge (e.g. Save 40%)" value={p.badge as string} onChange={(v) => updateProps({ badge: v })} placeholder="Save 40%" />
          <PropInput label="Per unit text" value={p.perUnit as string} onChange={(v) => updateProps({ perUnit: v })} placeholder="per month" />
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "wishlist-btn":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Label text" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Save to Wishlist" />
          <Row>
            <FieldLabel>Active (saved)</FieldLabel>
            <SegmentedButtons options={["true", "false"]} value={String(!!p.active)} onChange={(v) => updateProps({ active: v === "true" })} renderLabel={(v) => v === "true" ? "Yes" : "No"} />
          </Row>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={(p.accentColor as string) || "#ef4444"} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "stock-indicator":
      return (
        <div className="px-4 py-3 space-y-2">
          <Row>
            <FieldLabel>Stock count</FieldLabel>
            <input type="number" min={0} value={(p.stock as number) ?? 12} onChange={(e) => updateProps({ stock: parseInt(e.target.value) })} className={cn(inputCls, "w-24")} />
          </Row>
          <Row>
            <FieldLabel>Low stock threshold</FieldLabel>
            <input type="number" min={1} value={(p.lowThreshold as number) || 5} onChange={(e) => updateProps({ lowThreshold: parseInt(e.target.value) })} className={cn(inputCls, "w-24")} />
          </Row>
        </div>
      );

    case "coupon-code":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Coupon code" value={p.code as string} onChange={(v) => updateProps({ code: v })} placeholder="SAVE20" />
          <PropInput label="Label text" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="Use coupon code" />
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "product-reviews": {
      const prRevs = (p.reviews as Array<{ name: string; rating: number; comment: string; date?: string }>) || [];
      return (
        <>
          <TabSection title="Summary">
            <Row>
              <FieldLabel>Average rating</FieldLabel>
              <input type="number" min={1} max={5} step={0.1} value={(p.averageRating as number) || 4.8} onChange={(e) => updateProps({ averageRating: parseFloat(e.target.value) })} className={cn(inputCls, "w-20")} />
            </Row>
            <Row>
              <FieldLabel>Total reviews</FieldLabel>
              <input type="number" min={0} value={(p.totalReviews as number) || 128} onChange={(e) => updateProps({ totalReviews: parseInt(e.target.value) })} className={cn(inputCls, "w-24")} />
            </Row>
          </TabSection>
          <TabSection title="Reviews">
            <ListEditor<{ name: string; rating: number; comment: string }>
              items={prRevs}
              onChange={(items) => updateProps({ reviews: items })}
              newItem={{ name: "Customer", rating: 5, comment: "Great product!" }}
              addLabel="Add review"
              renderItem={(rev, i, update, remove) => (
                <>
                  <ItemHeader label={`Review ${i + 1}`} onDelete={remove} />
                  <div className="grid grid-cols-2 gap-2">
                    <input value={rev.name} onChange={(e) => update({ name: e.target.value })} placeholder="Reviewer name" className={inputCls} />
                    <input type="number" min={1} max={5} value={rev.rating} onChange={(e) => update({ rating: parseInt(e.target.value) || 5 })} placeholder="Rating 1-5" className={inputCls} />
                  </div>
                  <textarea value={rev.comment} onChange={(e) => update({ comment: e.target.value })} rows={2} placeholder="Review text..." className={textareaCls} />
                </>
              )}
            />
          </TabSection>
          <Row><FieldLabel>Star color</FieldLabel><ColorPicker value={(p.accentColor as string) || "#f59e0b"} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </>
      );
    }

    // ── Advanced ──
    case "data-table": {
      const dtCols = (p.columns as string[]) || ["Name", "Status", "Date", "Amount"];
      const dtRows = (p.rows as string[][]) || [];
      return (
        <>
          <TabSection title="Columns">
            <div>
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Column headers (one per line)</p>
              <textarea value={dtCols.join("\n")} onChange={(e) => updateProps({ columns: e.target.value.split("\n").filter(Boolean) })} rows={4} placeholder={"Name\nStatus\nDate\nAmount"} className={textareaCls} />
            </div>
          </TabSection>
          <TabSection title="Rows" defaultOpen={false}>
            <p className="text-[10px] text-gray-400 mb-2">Each line = one row. Separate cells with | character.</p>
            <textarea
              value={dtRows.map((r: string[]) => r.join(" | ")).join("\n")}
              onChange={(e) => updateProps({ rows: e.target.value.split("\n").filter(Boolean).map((r: string) => r.split("|").map((c: string) => c.trim())) })}
              rows={5}
              placeholder={"Alice | Active | Mar 15 | $1,200\nBob | Pending | Mar 14 | $850"}
              className={textareaCls}
            />
          </TabSection>
          <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </>
      );
    }

    case "feature-grid": {
      const fgFeatures = (p.features as Array<{ icon: string; title: string; description: string }>) || [];
      return (
        <>
          <TabSection title="Section">
            <PropInput label="Headline" value={p.headline as string} onChange={(v) => updateProps({ headline: v })} />
          </TabSection>
          <TabSection title="Features">
            <ListEditor<{ icon: string; title: string; description: string }>
              items={fgFeatures}
              onChange={(items) => updateProps({ features: items })}
              newItem={{ icon: "⭐", title: "Feature", description: "Description" }}
              addLabel="Add feature"
              renderItem={(f, i, update, remove) => (
                <>
                  <ItemHeader label={`Feature ${i + 1}`} onDelete={remove} />
                  <div className="flex gap-2">
                    <input value={f.icon} onChange={(e) => update({ icon: e.target.value })} placeholder="⭐" className="w-10 h-6 text-center text-sm rounded border border-gray-200 bg-white focus:outline-none" />
                    <input value={f.title} onChange={(e) => update({ title: e.target.value })} placeholder="Title" className={cn(inputCls, "flex-1")} />
                  </div>
                  <textarea value={f.description} onChange={(e) => update({ description: e.target.value })} rows={2} placeholder="Description" className={textareaCls} />
                </>
              )}
            />
          </TabSection>
          <TabSection title="Appearance" defaultOpen={false}>
            <Row>
              <FieldLabel>Columns</FieldLabel>
              <SegmentedButtons options={["2", "3", "4"]} value={(p.columns as string) || "4"} onChange={(v) => updateProps({ columns: v })} renderLabel={(v) => v} />
            </Row>
            <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
          </TabSection>
        </>
      );
    }

    case "comparison":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Before label" value={p.before as string} onChange={(v) => updateProps({ before: v })} placeholder="Without Us" />
          <PropInput label="After label" value={p.after as string} onChange={(v) => updateProps({ after: v })} placeholder="With Us" />
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Comparison rows</p>
            <p className="text-[10px] text-gray-400 mb-1.5">Format: Label | Before value | After value (one per line)</p>
            <textarea
              value={((p.items as Array<{ label: string; before: string; after: string }>) || []).map(i => `${i.label} | ${i.before} | ${i.after}`).join("\n")}
              onChange={(e) => {
                const items = e.target.value.split("\n").filter(Boolean).map(line => {
                  const parts = line.split("|").map(s => s.trim());
                  return { label: parts[0] || "", before: parts[1] || "", after: parts[2] || "" };
                });
                updateProps({ items });
              }}
              rows={4}
              placeholder={"Speed | 2 weeks | 1 day\nCost | $5,000/mo | $49/mo"}
              className={textareaCls}
            />
          </div>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "rating":
      return (
        <div className="px-4 py-3 space-y-2">
          <Row>
            <FieldLabel>Rating value</FieldLabel>
            <input type="number" min={0} max={10} step={0.5} value={(p.value as number) || 4} onChange={(e) => updateProps({ value: parseFloat(e.target.value) })} className={cn(inputCls, "w-20")} />
          </Row>
          <Row>
            <FieldLabel>Max stars</FieldLabel>
            <SegmentedButtons options={["5", "10"]} value={String((p.max as number) || 5)} onChange={(v) => updateProps({ max: parseInt(v) })} renderLabel={(v) => v} />
          </Row>
          <PropInput label="Label" value={p.label as string} onChange={(v) => updateProps({ label: v })} placeholder="(128 reviews)" />
          <Row><FieldLabel>Star color</FieldLabel><ColorPicker value={(p.accentColor as string) || "#f59e0b"} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "flex-row":
    case "flex-col":
      return (
        <>
          <TabSection title="Layout">
            <Row>
              <FieldLabel>Direction</FieldLabel>
              <SegmentedButtons
                options={["column", "row", "row-wrap"] as const}
                value={(effectiveProps._childLayout as string) || (element.type === "flex-row" ? "row" : "column")}
                onChange={(v) => updateLayoutProp("_childLayout", v)}
                renderLabel={(v) => v === "column" ? "↕ Col" : v === "row" ? "↔ Row" : "↔ Wrap"}
              />
            </Row>
            <Row>
              <FieldLabel>Align items</FieldLabel>
              <select value={(effectiveProps._childAlign as string) || "start"} onChange={(e) => updateLayoutProp("_childAlign", e.target.value)} className={cn(selectCls, "w-28")}>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="stretch">Stretch</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Justify</FieldLabel>
              <select value={(effectiveProps._childJustify as string) || "start"} onChange={(e) => updateLayoutProp("_childJustify", e.target.value)} className={cn(selectCls, "w-28")}>
                <option value="start">Start</option>
                <option value="center">Center</option>
                <option value="end">End</option>
                <option value="between">Space between</option>
                <option value="around">Space around</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Gap</FieldLabel>
              <select value={(effectiveProps._childGap as string) || "md"} onChange={(e) => updateLayoutProp("_childGap", e.target.value)} className={cn(selectCls, "w-24")}>
                <option value="sm">Small</option>
                <option value="md">Medium</option>
                <option value="lg">Large</option>
                <option value="xl">X-Large</option>
              </select>
            </Row>
          </TabSection>
        </>
      );

    case "product-card":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Product name" value={p.name as string} onChange={(v) => updateProps({ name: v })} placeholder="Product Alpha" />
          <PropInput label="Price" value={p.price as string} onChange={(v) => updateProps({ price: v })} placeholder="$49" />
          <PropTextarea label="Description" value={p.description as string} onChange={(v) => updateProps({ description: v })} rows={2} />
          <PropInput label="Image URL" value={p.imageUrl as string} onChange={(v) => updateProps({ imageUrl: v })} placeholder="https://..." />
          <PropInput label="Badge" value={p.badge as string} onChange={(v) => updateProps({ badge: v })} placeholder="New · Sale" />
          <Row>
            <FieldLabel>Rating (1-5)</FieldLabel>
            <input type="number" min={1} max={5} step={0.5} value={(p.rating as number) || 5} onChange={(e) => updateProps({ rating: parseFloat(e.target.value) })} className={cn(inputCls, "w-20")} />
          </Row>
          <Row><FieldLabel>Button color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    case "profile-card":
      return (
        <div className="px-4 py-3 space-y-2">
          <PropInput label="Name" value={p.name as string} onChange={(v) => updateProps({ name: v })} placeholder="Alex Johnson" />
          <PropInput label="Role / Title" value={p.role as string} onChange={(v) => updateProps({ role: v })} placeholder="Lead Designer" />
          <PropTextarea label="Bio" value={p.bio as string} onChange={(v) => updateProps({ bio: v })} rows={2} />
          <PropInput label="Avatar URL" value={p.avatarUrl as string} onChange={(v) => updateProps({ avatarUrl: v })} placeholder="https://..." />
          <Row><FieldLabel>Accent color</FieldLabel><ColorPicker value={p.accentColor as string} onChange={(v) => updateProps({ accentColor: v })} /></Row>
        </div>
      );

    default:
      return (
        <div className="flex flex-col items-center justify-center py-8 text-center px-4">
          <FileText className="h-7 w-7 text-gray-200 mb-2" />
          <p className="text-xs text-gray-400">No content properties for this element type.</p>
          <p className="text-[10px] text-gray-300 mt-1">Use the Style and Layout tabs to customize appearance.</p>
        </div>
      );
  }
}

// ---------------------------------------------------------------------------
// Layout tab
// ---------------------------------------------------------------------------

// ─── Box Model Visualizer ─────────────────────────────────────────────────────

function BoxModelVisualizer({ styles, updateStyle }: { styles: ElementStyles; updateStyle: (k: string, v: string) => void }) {
  const [activeZone, setActiveZone] = useState<"margin" | "border" | "padding" | "content" | null>(null);

  const getVal = (prop: string) => (styles as Record<string, string>)[prop] || "";
  const mt = getVal("marginTop"); const mr = getVal("marginRight"); const mb = getVal("marginBottom"); const ml = getVal("marginLeft");
  const pt = getVal("paddingTop"); const pr = getVal("paddingRight"); const pb = getVal("paddingBottom"); const pl = getVal("paddingLeft");
  const bt = getVal("borderTopWidth"); const br = getVal("borderRightWidth"); const bb = getVal("borderBottomWidth"); const bl = getVal("borderLeftWidth");
  const bw = getVal("borderWidth");

  const zoneColors = {
    margin: "bg-amber-100/80 hover:bg-amber-100",
    border: "bg-yellow-100/80 hover:bg-yellow-100",
    padding: "bg-green-100/80 hover:bg-green-100",
    content: "bg-blue-100/80 hover:bg-blue-100",
  };

  function SpacingInputRow({ label, top, right, bottom, left, prefix }: {
    label: string; top: string; right: string; bottom: string; left: string;
    prefix: "margin" | "padding" | "border";
  }) {
    const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const propName = (side: string) => prefix === "border"
      ? `border${cap(side)}Width`
      : `${prefix}${cap(side)}`;

    return (
      <div>
        <p className="text-[10px] font-semibold text-gray-500 mb-1.5">{label}</p>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: "T", val: top, side: "top" },
            { label: "R", val: right, side: "right" },
            { label: "B", val: bottom, side: "bottom" },
            { label: "L", val: left, side: "left" },
          ].map(({ label: l, val, side }) => (
            <div key={side} className="flex flex-col items-center gap-0.5">
              <span className="text-[9px] text-gray-400 uppercase">{l}</span>
              <input
                value={val}
                onChange={(e) => updateStyle(propName(side), e.target.value)}
                placeholder="0"
                className="w-full h-6 text-[10px] text-center rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-3">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Box Model</p>

      {/* Visual diagram */}
      <div
        className={cn("relative rounded-lg p-3 mb-3 transition-colors cursor-pointer", zoneColors.margin)}
        title="Margin"
        onClick={() => setActiveZone(activeZone === "margin" ? null : "margin")}
      >
        <span className="absolute top-1 left-1.5 text-[8px] font-bold text-amber-600 uppercase">margin</span>
        <div className={cn("relative rounded-lg p-2 transition-colors", zoneColors.border)}>
          <span className="absolute top-0.5 left-1.5 text-[8px] font-bold text-yellow-600 uppercase">border</span>
          <div className={cn("relative rounded-md p-2 transition-colors", zoneColors.padding)}>
            <span className="absolute top-0.5 left-1.5 text-[8px] font-bold text-green-600 uppercase">padding</span>
            <div className={cn("flex items-center justify-center h-8 rounded transition-colors", zoneColors.content)}>
              <span className="text-[9px] font-bold text-blue-600 uppercase">content</span>
            </div>
          </div>
        </div>
      </div>

      {/* Editable inputs below */}
      <div className="space-y-3">
        <SpacingInputRow label="Margin" top={mt} right={mr} bottom={mb} left={ml} prefix="margin" />
        <SpacingInputRow label="Padding" top={pt} right={pr} bottom={pb} left={pl} prefix="padding" />
        <SpacingInputRow label="Border Width" top={bt || bw} right={br || bw} bottom={bb || bw} left={bl || bw} prefix="border" />
      </div>
    </div>
  );
}

function LayoutTab({ styles, updateStyle }: { styles: ElementStyles; updateStyle: (k: string, v: string) => void }) {
  const displayOptions = ["flex", "grid", "block", "none"] as const;
  const directionOptions = ["row", "column"] as const;
  const positionOptions = ["static", "relative", "absolute", "fixed", "sticky"] as const;
  return (
    <>
      <TabSection title="Display">
        <Row>
          <FieldLabel>Display</FieldLabel>
          <SegmentedButtons options={[...displayOptions]} value={styles.display as (typeof displayOptions)[number] | undefined} onChange={(v) => updateStyle("display", v)} renderLabel={(v) => v} />
        </Row>
        {styles.display === "flex" && (
          <Row>
            <FieldLabel>Direction</FieldLabel>
            <SegmentedButtons options={[...directionOptions]} value={styles.flexDirection as (typeof directionOptions)[number] | undefined} onChange={(v) => updateStyle("flexDirection", v)} renderLabel={(v) => v} />
          </Row>
        )}
        <Row>
          <FieldLabel>Align Items</FieldLabel>
          <select value={styles.alignItems || ""} onChange={(e) => updateStyle("alignItems", e.target.value)} className={cn(selectCls, "w-32")}>
            <option value="">—</option>
            <option value="flex-start">Start</option>
            <option value="center">Center</option>
            <option value="flex-end">End</option>
            <option value="stretch">Stretch</option>
            <option value="baseline">Baseline</option>
          </select>
        </Row>
        <Row>
          <FieldLabel>Justify</FieldLabel>
          <select value={styles.justifyContent || ""} onChange={(e) => updateStyle("justifyContent", e.target.value)} className={cn(selectCls, "w-32")}>
            <option value="">—</option>
            <option value="flex-start">Start</option>
            <option value="center">Center</option>
            <option value="flex-end">End</option>
            <option value="space-between">Space Between</option>
            <option value="space-around">Space Around</option>
            <option value="space-evenly">Space Evenly</option>
          </select>
        </Row>
        <Row>
          <FieldLabel>Gap</FieldLabel>
          <input type="text" value={styles.gap || ""} onChange={(e) => updateStyle("gap", e.target.value)} placeholder="16px" className={cn(inputCls, "w-24")} />
        </Row>
      </TabSection>
      <TabSection title="Size">
        <Row><FieldLabel>Width</FieldLabel><DimensionInput value={styles.width} onChange={(v) => updateStyle("width", v)} /></Row>
        <Row><FieldLabel>Height</FieldLabel><DimensionInput value={styles.height} onChange={(v) => updateStyle("height", v)} /></Row>
      </TabSection>
      <TabSection title="Box Model" defaultOpen={false}>
        <BoxModelVisualizer styles={styles} updateStyle={updateStyle} />
      </TabSection>
      <TabSection title="Position" defaultOpen={false}>
        <Row>
          <FieldLabel>Position</FieldLabel>
          <select value={(styles as Record<string, string>)["position"] || "static"} onChange={(e) => updateStyle("position", e.target.value)} className={cn(selectCls, "w-28")}>
            {positionOptions.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </Row>
        <Row>
          <FieldLabel>Z-index</FieldLabel>
          <input type="number" value={(styles as Record<string, string>)["zIndex"] || ""} onChange={(e) => updateStyle("zIndex", e.target.value)} placeholder="auto" className={cn(inputCls, "w-20")} />
        </Row>
      </TabSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Style tab
// ---------------------------------------------------------------------------

function parseShadow(shadow: string) {
  if (!shadow || shadow === "none") return { x: 0, y: 4, blur: 6, spread: 0, color: "rgba(0,0,0,0.1)", inset: false };
  const inset = shadow.startsWith("inset ");
  const parts = (inset ? shadow.slice(6) : shadow).trim().split(/\s+/);
  const colorMatch = shadow.match(/rgba?\([^)]+\)|#[0-9a-fA-F]{3,8}/);
  return {
    inset,
    x: parseInt(parts[0]) || 0,
    y: parseInt(parts[1]) || 0,
    blur: parseInt(parts[2]) || 0,
    spread: parseInt(parts[3]) || 0,
    color: colorMatch?.[0] || "rgba(0,0,0,0.1)",
  };
}

function buildShadow(s: ReturnType<typeof parseShadow>) {
  return `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${s.color}`;
}

function StyleTab({ styles, updateStyle }: { styles: ElementStyles; updateStyle: (k: string, v: string) => void }) {
  const shadowPresets: Record<string, string> = { none: "none", sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.07)", lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.1)" };
  const [perCorner, setPerCorner] = useState(false);
  const [bgMode, setBgMode] = useState<"solid" | "gradient">(styles.backgroundImage ? "gradient" : "solid");
  const activeShadow = Object.entries(shadowPresets).find(([, v]) => v === styles.boxShadow)?.[0] ?? "custom";
  const shadow = parseShadow(styles.boxShadow || "");

  function updateShadow(updates: Partial<ReturnType<typeof parseShadow>>) {
    const next = { ...shadow, ...updates };
    updateStyle("boxShadow", buildShadow(next));
  }

  // Parse gradient
  const gradMatch = styles.backgroundImage?.match(/linear-gradient\(([^,]+),\s*([^,]+),\s*([^)]+)\)/);
  const gradDir = gradMatch?.[1]?.trim() || "to bottom";
  const gradColor1 = gradMatch?.[2]?.trim() || "#6366F1";
  const gradColor2 = gradMatch?.[3]?.trim() || "#8B5CF6";

  function updateGradient(dir: string, c1: string, c2: string) {
    updateStyle("backgroundImage", `linear-gradient(${dir}, ${c1}, ${c2})`);
  }

  return (
    <>
      <TabSection title="Size">
        <Row>
          <FieldLabel>Width</FieldLabel>
          <input type="text" value={styles.width || ""} onChange={(e) => updateStyle("width", e.target.value)} placeholder="auto" className={cn(inputCls, "w-24")} />
        </Row>
        <Row>
          <FieldLabel>Min W</FieldLabel>
          <input type="text" value={styles.minWidth || ""} onChange={(e) => updateStyle("minWidth", e.target.value)} placeholder="0" className={cn(inputCls, "w-24")} />
        </Row>
        <Row>
          <FieldLabel>Max W</FieldLabel>
          <input type="text" value={styles.maxWidth || ""} onChange={(e) => updateStyle("maxWidth", e.target.value)} placeholder="none" className={cn(inputCls, "w-24")} />
        </Row>
        <Row>
          <FieldLabel>Height</FieldLabel>
          <input type="text" value={styles.height || ""} onChange={(e) => updateStyle("height", e.target.value)} placeholder="auto" className={cn(inputCls, "w-24")} />
        </Row>
        <Row>
          <FieldLabel>Min H</FieldLabel>
          <input type="text" value={styles.minHeight || ""} onChange={(e) => updateStyle("minHeight", e.target.value)} placeholder="0" className={cn(inputCls, "w-24")} />
        </Row>
        <Row>
          <FieldLabel>Padding</FieldLabel>
          <input type="text" value={styles.padding || ""} onChange={(e) => updateStyle("padding", e.target.value)} placeholder="0" className={cn(inputCls, "w-24")} />
        </Row>
        <Row>
          <FieldLabel>Margin</FieldLabel>
          <input type="text" value={styles.margin || ""} onChange={(e) => updateStyle("margin", e.target.value)} placeholder="0" className={cn(inputCls, "w-24")} />
        </Row>
      </TabSection>
      <TabSection title="Background">
        <div className="flex gap-1 mb-2">
          {(["solid", "gradient"] as const).map((m) => (
            <button key={m} onClick={() => { setBgMode(m); if (m === "solid") updateStyle("backgroundImage", ""); }} className={cn("flex-1 py-1 text-[10px] font-medium rounded border transition-colors", bgMode === m ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-500 border-gray-200 hover:border-indigo-300")}>{m.charAt(0).toUpperCase() + m.slice(1)}</button>
          ))}
        </div>
        {bgMode === "solid" ? (
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={styles.backgroundColor} onChange={(v) => updateStyle("backgroundColor", v)} /></Row>
        ) : (
          <div className="space-y-2">
            <Row>
              <FieldLabel>Direction</FieldLabel>
              <select value={gradDir} onChange={(e) => updateGradient(e.target.value, gradColor1, gradColor2)} className={cn(selectCls, "w-32")}>
                <option value="to bottom">↓ Top to Bottom</option>
                <option value="to right">→ Left to Right</option>
                <option value="to bottom right">↘ Diagonal</option>
                <option value="to top right">↗ Diagonal</option>
                <option value="135deg">135°</option>
                <option value="45deg">45°</option>
              </select>
            </Row>
            <Row><FieldLabel>Color 1</FieldLabel><ColorPicker value={gradColor1} onChange={(v) => updateGradient(gradDir, v, gradColor2)} /></Row>
            <Row><FieldLabel>Color 2</FieldLabel><ColorPicker value={gradColor2} onChange={(v) => updateGradient(gradDir, gradColor1, v)} /></Row>
            <div className="h-8 rounded-lg border border-gray-200" style={{ backgroundImage: styles.backgroundImage || undefined }} />
          </div>
        )}
      </TabSection>
      <TabSection title="Border">
        <Row>
          <FieldLabel>Width</FieldLabel>
          <input type="number" value={styles.border ? parseInt(styles.border.split(" ")[0]) || "" : ""} onChange={(e) => { const w = e.target.value; const rest = styles.border?.split(" ").slice(1).join(" ") || "solid #E5E7EB"; updateStyle("border", w ? `${w}px ${rest}` : ""); }} placeholder="0" className={cn(inputCls, "w-16")} />
        </Row>
        <Row>
          <FieldLabel>Style</FieldLabel>
          <select value={styles.border?.split(" ")[1] || "solid"} onChange={(e) => { const parts = (styles.border || "1px solid #E5E7EB").split(" "); parts[1] = e.target.value; updateStyle("border", parts.join(" ")); }} className={cn(selectCls, "w-24")}>
            <option value="solid">Solid</option><option value="dashed">Dashed</option><option value="dotted">Dotted</option><option value="double">Double</option>
          </select>
        </Row>
        <Row>
          <FieldLabel>Color</FieldLabel>
          <ColorPicker value={styles.border?.split(" ")[2] || "#E5E7EB"} onChange={(v) => { const parts = (styles.border || "1px solid #E5E7EB").split(" "); parts[2] = v; updateStyle("border", parts.join(" ")); }} />
        </Row>
      </TabSection>
      <TabSection title="Border Radius">
        <div className="flex items-center justify-between mb-2">
          <FieldLabel>Per corner</FieldLabel>
          <button onClick={() => setPerCorner(!perCorner)} className={cn("text-[10px] px-2 py-0.5 rounded font-medium transition-colors", perCorner ? "bg-indigo-100 text-indigo-700" : "bg-gray-100 text-gray-500")}>{perCorner ? "On" : "Off"}</button>
        </div>
        {perCorner ? (
          <div className="grid grid-cols-2 gap-2">
            {([ ["TL", "borderTopLeftRadius"], ["TR", "borderTopRightRadius"], ["BL", "borderBottomLeftRadius"], ["BR", "borderBottomRightRadius"] ] as const).map(([label, key]) => (
              <div key={key} className="flex items-center gap-1">
                <span className="text-[10px] text-gray-400 w-5 shrink-0">{label}</span>
                <input type="number" value={(styles as Record<string, string>)[key] ? parseInt((styles as Record<string, string>)[key]) : ""} onChange={(e) => updateStyle(key, e.target.value ? `${e.target.value}px` : "")} placeholder="0" className="w-full h-6 text-[11px] px-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" />
              </div>
            ))}
          </div>
        ) : (
          <Row><FieldLabel>Radius</FieldLabel><input type="number" value={styles.borderRadius ? parseInt(styles.borderRadius) || "" : ""} onChange={(e) => updateStyle("borderRadius", e.target.value ? `${e.target.value}px` : "")} placeholder="0" className={cn(inputCls, "w-20")} /></Row>
        )}
      </TabSection>
      <TabSection title="Shadow" defaultOpen={false}>
        <div className="flex flex-wrap gap-1 mb-3">
          {Object.keys(shadowPresets).map((key) => (
            <button key={key} onClick={() => updateStyle("boxShadow", shadowPresets[key])} className={cn("px-2 py-0.5 rounded text-[10px] font-medium border transition-colors", activeShadow === key ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300")}>{key}</button>
          ))}
        </div>
        <div className="space-y-2 p-2.5 bg-gray-50 rounded-lg border border-gray-100">
          <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Shadow Builder</div>
          <Row><FieldLabel>X Offset</FieldLabel><div className="flex items-center gap-1 flex-1 justify-end"><input type="range" min={-50} max={50} value={shadow.x} onChange={(e) => updateShadow({ x: parseInt(e.target.value) })} className="w-20 accent-indigo-500" /><span className="text-[10px] text-gray-500 w-8 text-right">{shadow.x}px</span></div></Row>
          <Row><FieldLabel>Y Offset</FieldLabel><div className="flex items-center gap-1 flex-1 justify-end"><input type="range" min={-50} max={50} value={shadow.y} onChange={(e) => updateShadow({ y: parseInt(e.target.value) })} className="w-20 accent-indigo-500" /><span className="text-[10px] text-gray-500 w-8 text-right">{shadow.y}px</span></div></Row>
          <Row><FieldLabel>Blur</FieldLabel><div className="flex items-center gap-1 flex-1 justify-end"><input type="range" min={0} max={100} value={shadow.blur} onChange={(e) => updateShadow({ blur: parseInt(e.target.value) })} className="w-20 accent-indigo-500" /><span className="text-[10px] text-gray-500 w-8 text-right">{shadow.blur}px</span></div></Row>
          <Row><FieldLabel>Spread</FieldLabel><div className="flex items-center gap-1 flex-1 justify-end"><input type="range" min={-20} max={50} value={shadow.spread} onChange={(e) => updateShadow({ spread: parseInt(e.target.value) })} className="w-20 accent-indigo-500" /><span className="text-[10px] text-gray-500 w-8 text-right">{shadow.spread}px</span></div></Row>
          <Row><FieldLabel>Color</FieldLabel><ColorPicker value={shadow.color} onChange={(v) => updateShadow({ color: v })} /></Row>
          <Row><FieldLabel>Inset</FieldLabel><input type="checkbox" checked={shadow.inset} onChange={(e) => updateShadow({ inset: e.target.checked })} className="rounded" /></Row>
        </div>
      </TabSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Typography tab
// ---------------------------------------------------------------------------

const TEXT_TYPES = ["heading", "paragraph", "button", "rich-text", "text-link"];
const fontFamilies = ["Inter", "Roboto", "Poppins", "Playfair Display", "Montserrat", "Lato", "Open Sans", "Nunito", "Raleway", "Source Sans 3"];
const alignOptions = [{ icon: AlignLeft, value: "left" }, { icon: AlignCenter, value: "center" }, { icon: AlignRight, value: "right" }, { icon: AlignJustify, value: "justify" }];

function TypographyTab({ elementType, styles, updateStyle, element, updateProps }: { elementType: string; styles: ElementStyles; updateStyle: (k: string, v: string) => void; element?: CanvasElement; updateProps?: (p: Record<string, unknown>) => void }) {
  if (!TEXT_TYPES.includes(elementType)) {
    return <div className="flex flex-col items-center justify-center py-10 text-center px-4"><Type className="h-8 w-8 text-gray-200 mb-3" /><p className="text-xs text-gray-400">Select a text element to edit typography.</p></div>;
  }
  const isLink = elementType === "text-link";
  const decType = (styles.textDecoration as string) ?? (isLink ? "underline" : "none");
  const showUnderlineOptions = decType === "underline" || decType === "";
  return (
    <>
      <TabSection title="Font">
        <Row><FieldLabel>Family</FieldLabel><select value={(styles as Record<string, string>)["fontFamily"] || "Inter"} onChange={(e) => updateStyle("fontFamily", e.target.value)} className={cn(selectCls, "w-36")}>{fontFamilies.map((f) => <option key={f} value={f}>{f}</option>)}</select></Row>
        <Row><FieldLabel>Size</FieldLabel><div className="flex items-center gap-1"><input type="number" value={styles.fontSize ? parseInt(styles.fontSize) || "" : ""} onChange={(e) => updateStyle("fontSize", e.target.value ? `${e.target.value}px` : "")} placeholder="16" className="w-14 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" /><span className="text-[10px] text-gray-400">px</span></div></Row>
        <Row><FieldLabel>Weight</FieldLabel><select value={styles.fontWeight || "400"} onChange={(e) => updateStyle("fontWeight", e.target.value)} className={cn(selectCls, "w-28")}>{[100,200,300,400,500,600,700,800,900].map((w) => <option key={w} value={String(w)}>{w}</option>)}</select></Row>
        <Row><FieldLabel>Style</FieldLabel><SegmentedButtons options={["normal","italic"]} value={styles.fontStyle || "normal"} onChange={(v) => updateStyle("fontStyle", v)} renderLabel={(v) => v === "italic" ? "Italic" : "Normal"} /></Row>
        <Row><FieldLabel>Line Height</FieldLabel><input type="number" step="0.1" value={styles.lineHeight || ""} onChange={(e) => updateStyle("lineHeight", e.target.value)} placeholder="1.5" className={cn(inputCls, "w-20")} /></Row>
        <Row><FieldLabel>Letter Spacing</FieldLabel><input type="number" step="0.01" value={styles.letterSpacing ? parseFloat(styles.letterSpacing) || "" : ""} onChange={(e) => updateStyle("letterSpacing", e.target.value ? `${e.target.value}em` : "")} placeholder="0" className={cn(inputCls, "w-20")} /></Row>
      </TabSection>
      <TabSection title="Color & Align">
        <Row><FieldLabel>Color</FieldLabel><ColorPicker value={styles.color} onChange={(v) => updateStyle("color", v)} /></Row>
        {isLink && updateProps && (
          <Row>
            <FieldLabel>Hover color</FieldLabel>
            <ColorPicker value={(element?.props?.hoverColor as string) || ""} onChange={(v) => updateProps({ hoverColor: v })} />
          </Row>
        )}
        {!isLink && (
          <Row>
            <FieldLabel>Align</FieldLabel>
            <div className="flex items-center gap-0.5 p-0.5 rounded bg-gray-100">
              {alignOptions.map(({ icon: Icon, value }) => (
                <button key={value} onClick={() => updateStyle("textAlign", value)} className={cn("h-6 w-6 rounded flex items-center justify-center transition-all", styles.textAlign === value ? "bg-white shadow-sm text-gray-900" : "text-gray-400 hover:text-gray-600")}>
                  <Icon className="h-3 w-3" />
                </button>
              ))}
            </div>
          </Row>
        )}
      </TabSection>
      <TabSection title="Decoration" defaultOpen={isLink}>
        <Row><FieldLabel>Transform</FieldLabel><select value={(styles.textTransform as string) || "none"} onChange={(e) => updateStyle("textTransform", e.target.value)} className={cn(selectCls, "w-32")}><option value="none">None</option><option value="uppercase">Uppercase</option><option value="lowercase">Lowercase</option><option value="capitalize">Capitalize</option></select></Row>
        <Row>
          <FieldLabel>Decoration</FieldLabel>
          <select value={decType} onChange={(e) => updateStyle("textDecoration", e.target.value)} className={cn(selectCls, "w-32")}>
            <option value="none">None</option>
            <option value="underline">Underline</option>
            {isLink && <option value="overline">Overline</option>}
            <option value="line-through">Line-through</option>
          </select>
        </Row>
        {isLink && (
          <>
            <Row>
              <FieldLabel>Dec. style</FieldLabel>
              <select value={(styles.textDecorationStyle as string) || "solid"} onChange={(e) => updateStyle("textDecorationStyle", e.target.value)} className={cn(selectCls, "w-28")}>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
                <option value="dotted">Dotted</option>
                <option value="double">Double</option>
                <option value="wavy">Wavy</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Dec. color</FieldLabel>
              <ColorPicker value={styles.textDecorationColor || styles.color || "#6366f1"} onChange={(v) => updateStyle("textDecorationColor", v)} />
            </Row>
            {showUnderlineOptions && (
              <>
                <Row>
                  <FieldLabel>Offset</FieldLabel>
                  <div className="flex items-center gap-1">
                    <input type="number" value={styles.textUnderlineOffset ? parseInt(styles.textUnderlineOffset) || "" : "2"} onChange={(e) => updateStyle("textUnderlineOffset", e.target.value ? `${e.target.value}px` : "")} placeholder="2" className="w-14 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                    <span className="text-[10px] text-gray-400">px</span>
                  </div>
                </Row>
                <Row>
                  <FieldLabel>Thickness</FieldLabel>
                  <div className="flex items-center gap-1">
                    <input type="number" value={styles.textDecorationThickness ? parseInt(styles.textDecorationThickness) || "" : ""} onChange={(e) => updateStyle("textDecorationThickness", e.target.value ? `${e.target.value}px` : "")} placeholder="auto" className="w-14 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" />
                    <span className="text-[10px] text-gray-400">px</span>
                  </div>
                </Row>
              </>
            )}
          </>
        )}
      </TabSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Effects tab (opacity / blend / filters / animation)
// ---------------------------------------------------------------------------

const ANIMATION_PRESETS: { id: AnimationConfig["preset"]; label: string }[] = [
  { id: "none", label: "None" },
  { id: "fadeIn", label: "Fade In" },
  { id: "fadeUp", label: "Fade Up" },
  { id: "fadeDown", label: "Fade Down" },
  { id: "fadeLeft", label: "Fade Left" },
  { id: "fadeRight", label: "Fade Right" },
  { id: "scaleIn", label: "Scale In" },
  { id: "slideUp", label: "Slide Up" },
  { id: "slideDown", label: "Slide Down" },
];

function EffectsTab({
  styles,
  updateStyle,
  animation,
  updateAnimation,
}: {
  styles: ElementStyles;
  updateStyle: (k: string, v: string) => void;
  animation?: Partial<AnimationConfig>;
  updateAnimation: (a: Partial<AnimationConfig>) => void;
}) {
  const opacityVal = styles.opacity !== undefined ? Math.round(parseFloat(styles.opacity) * 100) : 100;
  const anim = animation || {};

  return (
    <>
      <TabSection title="Visibility">
        <Row>
          <FieldLabel>Opacity</FieldLabel>
          <div className="flex items-center gap-2 flex-1 justify-end">
            <input type="range" min={0} max={100} value={opacityVal} onChange={(e) => updateStyle("opacity", String(parseInt(e.target.value) / 100))} className="w-24 accent-indigo-500" />
            <span className="text-[11px] text-gray-500 w-8 text-right">{opacityVal}%</span>
          </div>
        </Row>
        <Row>
          <FieldLabel>Blend Mode</FieldLabel>
          <select value={(styles as Record<string, string>)["mixBlendMode"] || "normal"} onChange={(e) => updateStyle("mixBlendMode", e.target.value)} className={cn(selectCls, "w-32")}>
            {["normal","multiply","screen","overlay","darken","lighten","color-dodge","color-burn","difference","exclusion"].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        </Row>
      </TabSection>
      <TabSection title="Filters">
        <Row><FieldLabel>Blur</FieldLabel><div className="flex items-center gap-1"><input type="number" value={(styles as Record<string, string>)["filter"]?.match(/blur\((\d+)/)?.[1] || ""} onChange={(e) => updateStyle("filter", e.target.value ? `blur(${e.target.value}px)` : "")} placeholder="0" className="w-14 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" /><span className="text-[10px] text-gray-400">px</span></div></Row>
        <Row><FieldLabel>Backdrop Blur</FieldLabel><div className="flex items-center gap-1"><input type="number" value={(styles as Record<string, string>)["backdropFilter"]?.match(/blur\((\d+)/)?.[1] || ""} onChange={(e) => updateStyle("backdropFilter", e.target.value ? `blur(${e.target.value}px)` : "")} placeholder="0" className="w-14 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400" /><span className="text-[10px] text-gray-400">px</span></div></Row>
      </TabSection>

      <TabSection title="Animation">
        <div>
          <span className="text-[10px] font-medium text-gray-500 mb-2 block">Preset</span>
          <div className="grid grid-cols-3 gap-1">
            {ANIMATION_PRESETS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => updateAnimation({ preset: id })}
                className={cn(
                  "py-1.5 px-1 rounded-lg border text-[10px] font-medium transition-all text-center leading-tight",
                  (anim.preset ?? "none") === id
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        {(anim.preset ?? "none") !== "none" && (
          <>
            <Row>
              <FieldLabel>Trigger</FieldLabel>
              <select
                value={anim.trigger ?? "scroll"}
                onChange={(e) => updateAnimation({ trigger: e.target.value as AnimationConfig["trigger"] })}
                className={cn(selectCls, "w-28")}
              >
                <option value="scroll">On scroll</option>
                <option value="load">On load</option>
                <option value="hover">On hover</option>
              </select>
            </Row>
            <Row>
              <FieldLabel>Duration</FieldLabel>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <input
                  type="range" min={100} max={2000} step={50}
                  value={anim.duration ?? 600}
                  onChange={(e) => updateAnimation({ duration: parseInt(e.target.value) })}
                  className="w-20 accent-indigo-500"
                />
                <span className="text-[11px] text-gray-500 w-12 text-right">{anim.duration ?? 600}ms</span>
              </div>
            </Row>
            <Row>
              <FieldLabel>Delay</FieldLabel>
              <div className="flex items-center gap-2 flex-1 justify-end">
                <input
                  type="range" min={0} max={1000} step={50}
                  value={anim.delay ?? 0}
                  onChange={(e) => updateAnimation({ delay: parseInt(e.target.value) })}
                  className="w-20 accent-indigo-500"
                />
                <span className="text-[11px] text-gray-500 w-12 text-right">{anim.delay ?? 0}ms</span>
              </div>
            </Row>
            <Row>
              <FieldLabel>Easing</FieldLabel>
              <select
                value={anim.easing ?? "ease-out"}
                onChange={(e) => updateAnimation({ easing: e.target.value as AnimationConfig["easing"] })}
                className={cn(selectCls, "w-32")}
              >
                <option value="ease">Ease</option>
                <option value="ease-in">Ease In</option>
                <option value="ease-out">Ease Out</option>
                <option value="ease-in-out">Ease In Out</option>
                <option value="spring">Spring</option>
              </select>
            </Row>
          </>
        )}
      </TabSection>

      <TabSection title="Transform" defaultOpen={false}>
        <div className="space-y-2">
          {[
            { label: "Rotate", unit: "deg", field: "rotate", min: -180, max: 180, extract: (t: string) => t.match(/rotate\((-?[\d.]+)deg\)/)?.[1] || "0" },
            { label: "Scale X", unit: "", field: "scaleX", min: 0, max: 3, step: 0.01, extract: (t: string) => t.match(/scaleX\(([\d.]+)\)/)?.[1] || "1" },
            { label: "Scale Y", unit: "", field: "scaleY", min: 0, max: 3, step: 0.01, extract: (t: string) => t.match(/scaleY\(([\d.]+)\)/)?.[1] || "1" },
            { label: "Translate X", unit: "px", field: "translateX", min: -500, max: 500, extract: (t: string) => t.match(/translateX\((-?[\d.]+)px\)/)?.[1] || "0" },
            { label: "Translate Y", unit: "px", field: "translateY", min: -500, max: 500, extract: (t: string) => t.match(/translateY\((-?[\d.]+)px\)/)?.[1] || "0" },
          ].map(({ label, unit, field, min, max, step, extract }) => {
            const current = styles.transform || "";
            const val = parseFloat(extract(current));
            const defaultVal = field.startsWith("scale") ? 1 : 0;
            return (
              <Row key={field}>
                <FieldLabel>{label}</FieldLabel>
                <div className="flex items-center gap-1 flex-1 justify-end">
                  <input
                    type="range" min={min} max={max} step={step || 1}
                    value={val}
                    onChange={(e) => {
                      const v = parseFloat(e.target.value);
                      const removePattern = new RegExp(`\\s*${field}\\([^)]+\\)`, "g");
                      const base = (styles.transform || "").replace(removePattern, "").trim();
                      const suffix = unit ? `${v}${unit}` : String(v);
                      const addition = v === defaultVal ? "" : `${field}(${suffix})`;
                      updateStyle("transform", [base, addition].filter(Boolean).join(" "));
                    }}
                    className="w-20 accent-indigo-500"
                  />
                  <span className="text-[10px] text-gray-500 w-10 text-right">{val}{unit}</span>
                </div>
              </Row>
            );
          })}
          <button onClick={() => updateStyle("transform", "")} className="text-[10px] text-red-400 hover:text-red-600">Reset transform</button>
        </div>
      </TabSection>

      <TabSection title="Transition" defaultOpen={false}>
        <Row>
          <FieldLabel>Property</FieldLabel>
          <select
            value={(styles.transition || "").split(" ")[0] || "all"}
            onChange={(e) => {
              const parts = (styles.transition || "all 300ms ease").split(" ");
              parts[0] = e.target.value;
              updateStyle("transition", parts.join(" "));
            }}
            className={cn(selectCls, "w-32")}
          >
            <option value="all">all</option>
            <option value="opacity">opacity</option>
            <option value="transform">transform</option>
            <option value="background-color">background-color</option>
            <option value="color">color</option>
            <option value="border-color">border-color</option>
            <option value="box-shadow">box-shadow</option>
          </select>
        </Row>
        <Row>
          <FieldLabel>Duration</FieldLabel>
          <div className="flex items-center gap-1 flex-1 justify-end">
            <input
              type="range" min={0} max={2000} step={50}
              value={parseInt((styles.transition || "").match(/(\d+)ms/)?.[1] || "300")}
              onChange={(e) => {
                const parts = (styles.transition || "all 300ms ease").split(" ");
                parts[1] = `${e.target.value}ms`;
                updateStyle("transition", parts.join(" "));
              }}
              className="w-20 accent-indigo-500"
            />
            <span className="text-[10px] text-gray-500 w-12 text-right">
              {parseInt((styles.transition || "").match(/(\d+)ms/)?.[1] || "300")}ms
            </span>
          </div>
        </Row>
        <Row>
          <FieldLabel>Easing</FieldLabel>
          <select
            value={(styles.transition || "").split(" ")[2] || "ease"}
            onChange={(e) => {
              const parts = (styles.transition || "all 300ms ease").split(" ");
              parts[2] = e.target.value;
              updateStyle("transition", parts.join(" "));
            }}
            className={cn(selectCls, "w-28")}
          >
            <option value="ease">ease</option>
            <option value="ease-in">ease-in</option>
            <option value="ease-out">ease-out</option>
            <option value="ease-in-out">ease-in-out</option>
            <option value="linear">linear</option>
          </select>
        </Row>
        <Row>
          <FieldLabel>Cursor</FieldLabel>
          <select
            value={styles.cursor || "default"}
            onChange={(e) => updateStyle("cursor", e.target.value)}
            className={cn(selectCls, "w-28")}
          >
            {["default","pointer","grab","grabbing","crosshair","text","not-allowed","wait","zoom-in","zoom-out"].map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Row>
      </TabSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Interactions tab (hover styles + responsive + cursor)
// ---------------------------------------------------------------------------

const TRANSFORM_PRESETS = [
  { label: "None", value: "" },
  { label: "Scale Up", value: "scale(1.05)" },
  { label: "Scale Down", value: "scale(0.95)" },
  { label: "Lift", value: "translateY(-4px)" },
  { label: "Push", value: "translateY(2px)" },
  { label: "Rotate CW", value: "rotate(3deg)" },
];

const SHADOW_HOVER_PRESETS = [
  { label: "None", value: "none" },
  { label: "Sm", value: "0 2px 8px rgba(0,0,0,0.12)" },
  { label: "Md", value: "0 4px 16px rgba(0,0,0,0.14)" },
  { label: "Lg", value: "0 8px 32px rgba(0,0,0,0.16)" },
  { label: "Glow", value: "0 0 20px rgba(99,102,241,0.4)" },
];

type Breakpoint = "large-tablet" | "tablet" | "mobile" | "small-mobile";
type ResponsiveStyles = { "large-tablet"?: Partial<ElementStyles>; tablet?: Partial<ElementStyles>; mobile?: Partial<ElementStyles>; "small-mobile"?: Partial<ElementStyles> };

function PseudoStateSection({
  title,
  pseudoStyles,
  updatePseudoStyles,
  baseStyles,
  updateBaseStyle,
}: {
  title: string;
  pseudoStyles: Partial<HoverStyles>;
  updatePseudoStyles: (s: Partial<HoverStyles>) => void;
  baseStyles: ElementStyles;
  updateBaseStyle: (k: string, v: string) => void;
}) {
  return (
    <TabSection title={title}>
      <Row>
        <FieldLabel>Text color</FieldLabel>
        <ColorPicker value={pseudoStyles.color} onChange={(v) => updatePseudoStyles({ color: v })} />
      </Row>
      <Row>
        <FieldLabel>Background</FieldLabel>
        <ColorPicker value={pseudoStyles.backgroundColor} onChange={(v) => updatePseudoStyles({ backgroundColor: v })} />
      </Row>
      <Row>
        <FieldLabel>Border color</FieldLabel>
        <ColorPicker value={pseudoStyles.borderColor} onChange={(v) => updatePseudoStyles({ borderColor: v })} />
      </Row>
      <Row>
        <FieldLabel>Box shadow</FieldLabel>
        <ColorPicker value={pseudoStyles.boxShadow} onChange={(v) => updatePseudoStyles({ boxShadow: v })} />
      </Row>
      <div>
        <span className="text-[10px] font-medium text-gray-500 mb-1.5 block">Transform</span>
        <div className="flex flex-wrap gap-1">
          {TRANSFORM_PRESETS.map(({ label, value }) => (
            <button
              key={label}
              onClick={() => updatePseudoStyles({ transform: value })}
              className={cn(
                "px-2 py-0.5 rounded border text-[10px] font-medium transition-colors",
                (pseudoStyles.transform ?? "") === value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <Row>
        <FieldLabel>Opacity</FieldLabel>
        <div className="flex items-center gap-2 flex-1 justify-end">
          <input
            type="range" min={0} max={100}
            value={pseudoStyles.opacity !== undefined ? Math.round(parseFloat(pseudoStyles.opacity) * 100) : 100}
            onChange={(e) => updatePseudoStyles({ opacity: String(parseInt(e.target.value) / 100) })}
            className="w-20 accent-indigo-500"
          />
          <span className="text-[11px] text-gray-500 w-8 text-right">
            {pseudoStyles.opacity !== undefined ? Math.round(parseFloat(pseudoStyles.opacity) * 100) : 100}%
          </span>
        </div>
      </Row>
    </TabSection>
  );
}

function InteractionsTab({
  styles,
  updateStyle,
  hoverStyles,
  updateHoverStyles,
  focusStyles,
  updateFocusStyles,
  activeStyles,
  updateActiveStyles,
  responsiveStyles,
  updateResponsiveStyles,
}: {
  styles: ElementStyles;
  updateStyle: (k: string, v: string) => void;
  hoverStyles?: Partial<HoverStyles>;
  updateHoverStyles: (h: Partial<HoverStyles>) => void;
  focusStyles?: Partial<HoverStyles>;
  updateFocusStyles: (f: Partial<HoverStyles>) => void;
  activeStyles?: Partial<HoverStyles>;
  updateActiveStyles: (a: Partial<HoverStyles>) => void;
  responsiveStyles: ResponsiveStyles;
  updateResponsiveStyles: (bp: Breakpoint, styles: Partial<ElementStyles>) => void;
}) {
  const [clickAction, setClickAction] = useState("none");
  const [pseudoTab, setPseudoTab] = useState<"hover" | "focus" | "active">("hover");
  const hover = hoverStyles || {};

  return (
    <>
      {/* ── Pseudo-State Editor ── */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center gap-1 p-0.5 bg-gray-100 rounded-lg mb-3">
          {([
            { id: "hover" as const, label: ":hover" },
            { id: "focus" as const, label: ":focus" },
            { id: "active" as const, label: ":active" },
          ]).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setPseudoTab(id)}
              className={cn(
                "flex-1 py-1 rounded-md text-[10px] font-bold transition-all font-mono",
                pseudoTab === id ? "bg-white text-indigo-600 shadow-sm" : "text-gray-400 hover:text-gray-600"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {pseudoTab === "hover" && (
        <PseudoStateSection
          title="Hover Styles (:hover)"
          pseudoStyles={hover}
          updatePseudoStyles={updateHoverStyles}
          baseStyles={styles}
          updateBaseStyle={updateStyle}
        />
      )}
      {pseudoTab === "focus" && (
        <PseudoStateSection
          title="Focus Styles (:focus)"
          pseudoStyles={focusStyles || {}}
          updatePseudoStyles={updateFocusStyles}
          baseStyles={styles}
          updateBaseStyle={updateStyle}
        />
      )}
      {pseudoTab === "active" && (
        <PseudoStateSection
          title="Active Styles (:active)"
          pseudoStyles={activeStyles || {}}
          updatePseudoStyles={updateActiveStyles}
          baseStyles={styles}
          updateBaseStyle={updateStyle}
        />
      )}

      <div className="px-4 pb-2">
        <Row>
          <FieldLabel>Transition</FieldLabel>
          <select
            value={(styles as Record<string, string>)["transition"] || "all 0.2s ease"}
            onChange={(e) => updateStyle("transition", e.target.value)}
            className={cn(selectCls, "w-36")}
          >
            <option value="none">None</option>
            <option value="all 0.15s ease">Fast (150ms)</option>
            <option value="all 0.2s ease">Normal (200ms)</option>
            <option value="all 0.3s ease">Slow (300ms)</option>
            <option value="all 0.5s ease">Slower (500ms)</option>
            <option value="all 0.3s spring(1,100,10,0)">Spring</option>
          </select>
        </Row>
      </div>

      {/* ── Click Action ── */}
      <TabSection title="Click Action" defaultOpen={false}>
        <Row>
          <FieldLabel>Action</FieldLabel>
          <select value={clickAction} onChange={(e) => setClickAction(e.target.value)} className={cn(selectCls, "w-36")}>
            <option value="none">None</option>
            <option value="navigate">Navigate to page</option>
            <option value="external">External link</option>
            <option value="scroll">Scroll to element</option>
            <option value="modal">Open modal</option>
          </select>
        </Row>
        {clickAction !== "none" && (
          <Row>
            <FieldLabel>Target</FieldLabel>
            <input
              type="text"
              placeholder={clickAction === "external" ? "https://..." : clickAction === "scroll" ? "#section-id" : "/page"}
              className={cn(inputCls, "w-36")}
            />
          </Row>
        )}
      </TabSection>

      {/* ── Cursor ── */}
      <TabSection title="Cursor" defaultOpen={false}>
        <Row>
          <FieldLabel>Cursor</FieldLabel>
          <select value={(styles as Record<string, string>)["cursor"] || "default"} onChange={(e) => updateStyle("cursor", e.target.value)} className={cn(selectCls, "w-32")}>
            <option value="default">Default</option>
            <option value="pointer">Pointer</option>
            <option value="grab">Grab</option>
            <option value="not-allowed">Not Allowed</option>
            <option value="text">Text</option>
            <option value="crosshair">Crosshair</option>
            <option value="zoom-in">Zoom In</option>
            <option value="move">Move</option>
          </select>
        </Row>
      </TabSection>
    </>
  );
}

// ---------------------------------------------------------------------------
// Code Tab — full-page HTML / CSS / JS IDE
// ---------------------------------------------------------------------------

const IDE_FONT = '"JetBrains Mono", "Fira Code", Consolas, "Courier New", monospace';
const IDE_LINE_H = 19;

const BP_WIDTHS: Record<string, number> = {
  "large-tablet": 1024,
  "tablet": 768,
  "mobile": 390,
  "small-mobile": 320,
};

// ── Page code generators ────────────────────────────────────────────────────

function getHtmlTag(type: string): string {
  const map: Record<string, string> = {
    heading: "h2", paragraph: "p", button: "button", image: "img",
    hero: "section", features: "section", "feature-grid": "section",
    pricing: "section", testimonials: "section", cta: "section",
    "blog-grid": "section", team: "section", faq: "section",
    navbar: "nav", footer: "footer", header: "header", main: "main",
    aside: "aside", section: "section", link: "a",
    form: "form", input: "input", textarea: "textarea", select: "select",
    blockquote: "blockquote", "code-block": "pre",
    "ordered-list": "ol", "unordered-list": "ul", "list-item": "li",
  };
  return map[type] || "div";
}

function elementToHtml(el: CanvasElement, depth: number): string {
  const pad = "  ".repeat(depth);
  const tag = getHtmlTag(el.type);
  const cls = `el-${el.id.slice(0, 8)}`;
  const nameAttr = el.name ? ` data-name="${el.name}"` : "";

  if (tag === "img") {
    return `${pad}<img class="${cls}" src="${(el.props?.src as string) || ""}" alt="${(el.props?.alt as string) || ""}" />`;
  }
  if (tag === "input") {
    return `${pad}<input class="${cls}" type="${(el.props?.type as string) || "text"}" placeholder="${(el.props?.placeholder as string) || ""}"${nameAttr} />`;
  }

  if (el.children?.length) {
    const kids = el.children
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((c) => elementToHtml(c, depth + 1))
      .join("\n");
    return `${pad}<${tag} class="${cls}"${nameAttr}>\n${kids}\n${pad}</${tag}>`;
  }

  const text = el.content ? el.content : "";
  return `${pad}<${tag} class="${cls}"${nameAttr}>${text}</${tag}>`;
}

function buildPageHtml(elements: CanvasElement[], title: string, css: string, js: string): string {
  const sorted = [...elements].sort((a, b) => a.order - b.order);
  const body = sorted.map((el) => elementToHtml(el, 2)).join("\n");
  const cssBlock = css.trim()
    ? `\n  <style>\n${css.trim().split("\n").map((l) => `    ${l}`).join("\n")}\n  </style>`
    : "";
  const jsBlock = js.trim()
    ? `\n  <script>\n${js.trim().split("\n").map((l) => `    ${l}`).join("\n")}\n  </script>`
    : "";
  return [
    `<!DOCTYPE html>`,
    `<html lang="en">`,
    `<head>`,
    `  <meta charset="UTF-8" />`,
    `  <meta name="viewport" content="width=device-width, initial-scale=1.0" />`,
    `  <title>${title}</title>${cssBlock}`,
    `</head>`,
    `<body>`,
    body,
    `${jsBlock}`,
    `</body>`,
    `</html>`,
  ].join("\n");
}

function collectElCss(el: CanvasElement): string {
  const cls = `.el-${el.id.slice(0, 8)}`;
  const props = Object.entries(el.styles || {})
    .filter(([, v]) => v !== undefined && v !== "")
    .map(([k, v]) => `  ${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${v};`);
  let out = props.length ? `${cls} {\n${props.join("\n")}\n}\n` : "";
  if (el.children?.length) out += el.children.map(collectElCss).join("");
  return out;
}

function collectBpCss(el: CanvasElement, bp: string): string {
  const cls = `.el-${el.id.slice(0, 8)}`;
  const overrides = ((el.props?._responsive as Record<string, Record<string, unknown>>)?.[bp]) || {};
  const props = Object.entries(overrides)
    .filter(([k, v]) => !k.startsWith("_") && v !== undefined && v !== "")
    .map(([k, v]) => `  ${k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}: ${v};`);
  let out = props.length ? `${cls} {\n${props.join("\n")}\n}\n` : "";
  if (el.children?.length) out += el.children.map((c) => collectBpCss(c, bp)).join("");
  return out;
}

function buildPageCss(elements: CanvasElement[], customCSS: string, bp?: string): string {
  const parts: string[] = [];

  if (!bp) {
    // Desktop: full element styles
    const elCss = elements.map(collectElCss).join("").trim();
    if (elCss) parts.push(`/* Elements */\n${elCss}`);
  } else {
    // Breakpoint: base styles + media-query overrides
    const baseCss = elements.map(collectElCss).join("").trim();
    const bpCss   = elements.map((el) => collectBpCss(el, bp)).join("").trim();
    if (baseCss) parts.push(`/* Base */\n${baseCss}`);
    if (bpCss) parts.push(`/* ${BP_WIDTHS[bp]}px overrides */\n@media (max-width: ${BP_WIDTHS[bp]}px) {\n${bpCss}}`);
  }

  if (customCSS.trim()) parts.push(`/* Custom */\n${customCSS.trim()}`);
  return parts.join("\n\n");
}

// ── Mini IDE ────────────────────────────────────────────────────────────────

function MiniIDE({
  value,
  onChange,
  readOnly = false,
}: {
  value: string;
  onChange: (v: string) => void;
  readOnly?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef   = useRef<HTMLDivElement>(null);
  const lineCount   = Math.max(value.split("\n").length, 10);

  const syncScroll = () => {
    if (textareaRef.current && gutterRef.current)
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const ta = e.currentTarget;
    const s = ta.selectionStart, en = ta.selectionEnd;
    const next = value.substring(0, s) + "  " + value.substring(en);
    onChange(next);
    requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = s + 2; });
  };

  return (
    <div className="flex overflow-hidden rounded-md" style={{ background: "#16161e", border: "1px solid #2a2a3d", minHeight: 220, maxHeight: 420 }}>
      <div
        ref={gutterRef}
        className="select-none shrink-0 overflow-hidden"
        style={{ width: 32, paddingTop: 10, background: "#16161e", borderRight: "1px solid #2a2a3d" }}
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i} style={{ height: IDE_LINE_H, lineHeight: `${IDE_LINE_H}px`, fontSize: 10, color: "#3b3b5c", textAlign: "right", paddingRight: 6, fontFamily: IDE_FONT }}>
            {i + 1}
          </div>
        ))}
      </div>
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        spellCheck={false}
        readOnly={readOnly}
        style={{
          flex: 1,
          resize: "none",
          background: "transparent",
          color: readOnly ? "#585b80" : "#c0caf5",
          fontSize: 11,
          lineHeight: `${IDE_LINE_H}px`,
          padding: "10px 10px 10px 8px",
          outline: "none",
          border: "none",
          fontFamily: IDE_FONT,
          caretColor: "#bb9af7",
          tabSize: 2,
        }}
      />
    </div>
  );
}

// ── Code Tab ────────────────────────────────────────────────────────────────

function CodeTab({
  element,
}: {
  element: CanvasElement;
  updateProps: (props: Record<string, unknown>) => void;
  updateStyles: (styles: Partial<ElementStyles>) => void;
  updateContent: (content: string) => void;
  updateChildren: (children: CanvasElement[]) => void;
}) {
  const elements                = useEditorStore((s) => s.elements);
  const siteName                = useEditorStore((s) => s.siteName);
  const deviceMode              = useEditorStore((s) => s.deviceMode);
  const pageCustomCSS           = useEditorStore((s) => s.pageCustomCSS);
  const pageCustomJS            = useEditorStore((s) => s.pageCustomJS);
  const pageCustomHTML          = useEditorStore((s) => s.pageCustomHTML);
  const pageResponsiveCSS       = useEditorStore((s) => s.pageResponsiveCSS);
  const updatePageCustomCSS     = useEditorStore((s) => s.updatePageCustomCSS);
  const updatePageCustomJS      = useEditorStore((s) => s.updatePageCustomJS);
  const updatePageCustomHTML    = useEditorStore((s) => s.updatePageCustomHTML);
  const updatePageResponsiveCSS = useEditorStore((s) => s.updatePageResponsiveCSS);

  type FileLang = "html" | "css" | "js";
  const [file,  setFile]  = useState<FileLang>("html");
  const [saved, setSaved] = useState(false);

  const bp = deviceMode !== "desktop" ? deviceMode : null;

  // ── Seed helpers ─────────────────────────────────────────────────────────
  // CSS: if there's already saved custom CSS for this viewport, show it as-is
  // (user's own override). Otherwise show the auto-generated element CSS so
  // there's always real content to read and edit from.
  const getInitialCss = () => {
    const stored = bp ? (pageResponsiveCSS[bp] ?? "") : pageCustomCSS;
    if (stored.trim()) return stored;
    return buildPageCss(elements, "", bp ?? undefined);
  };

  const getInitialHtml = () => {
    if (pageCustomHTML.trim()) return pageCustomHTML;
    return buildPageHtml(elements, siteName, pageCustomCSS, pageCustomJS);
  };

  const [htmlVal, setHtmlVal] = useState<string>(getInitialHtml);
  const [cssVal,  setCssVal]  = useState<string>(getInitialCss);
  const [jsVal,   setJsVal]   = useState<string>(() => pageCustomJS);

  // Use refs so handleSave always reads the latest values (no stale closure)
  const htmlRef = useRef(htmlVal);
  const cssRef  = useRef(cssVal);
  const jsRef   = useRef(jsVal);
  const fileRef = useRef(file);
  const bpRef   = useRef(bp);

  useEffect(() => { htmlRef.current = htmlVal; }, [htmlVal]);
  useEffect(() => { cssRef.current  = cssVal;  }, [cssVal]);
  useEffect(() => { jsRef.current   = jsVal;   }, [jsVal]);
  useEffect(() => { fileRef.current = file;    }, [file]);
  useEffect(() => { bpRef.current   = bp;      }, [bp]);

  // Re-seed CSS when the active breakpoint changes (user switched viewport)
  const prevBpRef = useRef(bp);
  useEffect(() => {
    if (prevBpRef.current === bp) return;
    prevBpRef.current = bp;
    const stored = bp ? (pageResponsiveCSS[bp] ?? "") : pageCustomCSS;
    setCssVal(stored.trim() ? stored : buildPageCss(elements, "", bp ?? undefined));
  });

  // Re-seed HTML when switching to the HTML tab so it reflects latest canvas state
  const prevFileRef = useRef(file);
  useEffect(() => {
    if (prevFileRef.current === file) return;
    prevFileRef.current = file;
    if (file === "html" && !pageCustomHTML.trim()) {
      setHtmlVal(buildPageHtml(elements, siteName, pageCustomCSS, pageCustomJS));
    }
  });

  // ── Save ─────────────────────────────────────────────────────────────────
  const triggerSaved = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const handleSave = () => {
    const f  = fileRef.current;
    const bp = bpRef.current;
    if (f === "html") {
      updatePageCustomHTML(htmlRef.current);
      // Also offer a download
      const blob = new Blob([htmlRef.current], { type: "text/html" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "index.html";
      a.click();
      URL.revokeObjectURL(a.href);
    } else if (f === "css") {
      if (bp) updatePageResponsiveCSS(bp, cssRef.current);
      else    updatePageCustomCSS(cssRef.current);
    } else {
      updatePageCustomJS(jsRef.current);
    }
    triggerSaved();
  };

  // Ctrl/Cmd + S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  const value    = file === "html" ? htmlVal : file === "css" ? cssVal : jsVal;
  const onChange = file === "html" ? setHtmlVal : file === "css" ? setCssVal : setJsVal;

  const fileColors: Record<FileLang, string> = { html: "#f7768e", css: "#7aa2f7", js: "#e0af68" };
  const fileNames:  Record<FileLang, string> = {
    html: "index.html",
    css:  bp ? `styles.${bp}.css` : "styles.css",
    js:   "script.js",
  };

  const saveLabel = saved
    ? "✓ Saved"
    : file === "html"
      ? "Save + Download"
      : file === "css" && bp
        ? `Save (${BP_WIDTHS[bp]}px)`
        : "Save";

  return (
    <div className="flex flex-col h-full" style={{ background: "#13131a" }}>

      {/* ── Tab bar ── */}
      <div className="flex items-center gap-1 px-3 py-2 shrink-0" style={{ borderBottom: "1px solid #1e1e2d" }}>
        {(["html", "css", "js"] as FileLang[]).map((f) => (
          <button
            key={f}
            onClick={() => setFile(f)}
            className="px-2.5 py-0.5 rounded text-[10px] font-semibold transition-all uppercase"
            style={{
              fontFamily: IDE_FONT,
              background: file === f ? "#1e1e2d" : "transparent",
              color:      file === f ? fileColors[f] : "#3b3b5c",
              border:     `1px solid ${file === f ? "#3b3b5c" : "transparent"}`,
            }}
          >
            {f}
          </button>
        ))}

        {/* Viewport badge on CSS tab */}
        {file === "css" && bp && (
          <span className="ml-1 px-1.5 py-0.5 rounded" style={{ fontSize: 9, background: "#1a2535", color: "#7aa2f7", fontFamily: IDE_FONT }}>
            {BP_WIDTHS[bp]}px
          </span>
        )}

        <span className="ml-auto" style={{ fontSize: 9, color: "#2e2e45", fontFamily: IDE_FONT }}>
          {fileNames[file]}
        </span>
        <button
          onClick={() => navigator.clipboard.writeText(value)}
          title="Copy"
          className="ml-2 h-5 w-5 flex items-center justify-center rounded transition-colors"
          style={{ color: "#3b3b5c" }}
        >
          <Copy className="h-3 w-3" />
        </button>
      </div>

      {/* ── Editor ── */}
      <div className="flex-1 overflow-hidden px-2 pt-2 pb-1">
        <MiniIDE key={`${file}-${bp ?? "desktop"}`} value={value} onChange={onChange} />
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-3 py-2 shrink-0" style={{ borderTop: "1px solid #1e1e2d" }}>
        <span style={{ fontSize: 9, color: "#2e2e45", fontFamily: IDE_FONT }}>Ctrl+S to save</span>
        <button
          onClick={handleSave}
          className="px-4 py-1 rounded text-[11px] font-bold transition-all"
          style={{
            fontFamily: IDE_FONT,
            background: saved ? "#1a3a2a" : "#1e1e2d",
            color:      saved ? "#9ece6a" : "#c0caf5",
            border:     `1px solid ${saved ? "#2a5a3a" : "#3b3b5c"}`,
          }}
        >
          {saveLabel}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main export
// ---------------------------------------------------------------------------

export default function PropertiesPanel() {
  const selectedElementId = useEditorStore((s) => s.selectedElementId);
  const elements = useEditorStore((s) => s.elements);
  const siteId = useEditorStore((s) => s.siteId);
  const updateElementStyles = useEditorStore((s) => s.updateElementStyles);
  const updateElementContent = useEditorStore((s) => s.updateElementContent);
  const updateElementProps = useEditorStore((s) => s.updateElementProps);
  const updateElementAnimation = useEditorStore((s) => s.updateElementAnimation);
  const updateElementHoverStyles = useEditorStore((s) => s.updateElementHoverStyles);
  const updateElementFocusStyles = useEditorStore((s) => s.updateElementFocusStyles);
  const updateElementActiveStyles = useEditorStore((s) => s.updateElementActiveStyles);
  const updateElement = useEditorStore((s) => s.updateElement);
  const updateElementResponsiveStyles = useEditorStore((s) => s.updateElementResponsiveStyles);
  const clearElementResponsiveStyles = useEditorStore((s) => s.clearElementResponsiveStyles);
  const selectElement = useEditorStore((s) => s.selectElement);
  const deviceMode = useEditorStore((s) => s.deviceMode);
  const setDeviceMode = useEditorStore((s) => s.setDeviceMode);
  const [activeTab, setActiveTab] = useState<TabId>("content");

  const selectedElement = selectedElementId ? findInTree(elements, selectedElementId) : undefined;

  if (!selectedElement) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center p-6">
        <div className="h-12 w-12 rounded-xl bg-gray-50 flex items-center justify-center mb-3">
          <MousePointer className="h-6 w-6 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">Select an element</p>
        <p className="text-xs text-gray-400">Click on any element in the canvas to edit its properties</p>
      </div>
    );
  }

  // Responsive styles stored in element.props._responsive
  const responsiveStyles: ResponsiveStyles = (selectedElement.props?._responsive as ResponsiveStyles) || {};

  // Active viewport (mirrors canvas deviceMode)
  const activeViewport = deviceMode;
  const bpKey: Breakpoint | null = activeViewport === "desktop" ? null : activeViewport as Breakpoint;
  // _responsive stores both CSS overrides and layout props (_childLayout etc.) — strip non-CSS keys for styles
  const LAYOUT_PROP_KEYS_SET = new Set(["_childLayout", "_childAlign", "_childJustify", "_childGap"]);
  const rawBpOverrides: Record<string, unknown> = bpKey ? ((selectedElement.props?._responsive as any)?.[bpKey] || {}) : {};
  const bpOverrides: Partial<ElementStyles> = Object.fromEntries(
    Object.entries(rawBpOverrides).filter(([k]) => !LAYOUT_PROP_KEYS_SET.has(k))
  ) as Partial<ElementStyles>;

  // Display styles: base merged with breakpoint overrides (so panel shows effective value)
  const styles: ElementStyles = bpKey
    ? { ...(selectedElement.styles || {}), ...bpOverrides }
    : (selectedElement.styles || {});

  // Route style updates — pass only the delta; store merges atomically
  const updateStyle = (key: string, value: string) => {
    if (bpKey) {
      updateElementResponsiveStyles(selectedElement.id, bpKey, { [key]: value });
    } else {
      updateElementStyles(selectedElement.id, { [key]: value } as Partial<ElementStyles>);
    }
  };

  const updateStyleBatch = (overrides: Partial<ElementStyles>) => {
    if (bpKey) {
      updateElementResponsiveStyles(selectedElement.id, bpKey, overrides);
    } else {
      updateElementStyles(selectedElement.id, overrides);
    }
  };

  const clearBreakpointOverrides = (bp: Breakpoint) => {
    clearElementResponsiveStyles(selectedElement.id, bp);
  };

  // Viewport-aware layout prop updater (_childLayout, _childAlign, _childJustify, _childGap)
  const updateLayoutProp = (key: string, value: string) => {
    if (bpKey) {
      updateElementResponsiveStyles(selectedElement.id, bpKey, { [key]: value });
    } else {
      updateElementProps(selectedElement.id, { [key]: value });
    }
  };

  // Effective props: base props merged with viewport layout overrides
  const bpLayoutOverrides = Object.fromEntries(
    Object.entries(rawBpOverrides).filter(([k]) => LAYOUT_PROP_KEYS_SET.has(k))
  );
  const effectiveProps: Record<string, unknown> = bpKey
    ? { ...(selectedElement.props || {}), ...bpLayoutOverrides }
    : (selectedElement.props || {});

  // Used by InteractionsTab — pass delta only, store merges atomically
  const updateResponsiveStyles = (bp: Breakpoint, overrides: Partial<ElementStyles>) => {
    if (Object.keys(overrides).length === 0) {
      clearElementResponsiveStyles(selectedElement.id, bp);
    } else {
      updateElementResponsiveStyles(selectedElement.id, bp, overrides);
    }
  };

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Element header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-900 capitalize truncate">
            {(selectedElement.name || selectedElement.type).replace(/-/g, " ")}
          </p>
          <p className="text-[10px] text-gray-400 font-mono truncate">{selectedElement.id}</p>
        </div>
        <button onClick={() => selectElement(null)} className="h-6 w-6 rounded hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0 ml-2">
          <X className="h-3.5 w-3.5 text-gray-500" />
        </button>
      </div>

      {/* Viewport switcher */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 shrink-0 bg-gray-50/50">
        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Viewport</span>
        {([
          { mode: "desktop",      Icon: Monitor,    label: "Desktop (full width)",  size: "" },
          { mode: "large-tablet", Icon: Tablet,     label: "Large Tablet (1024px)", size: "1024" },
          { mode: "tablet",       Icon: Tablet,     label: "Tablet (768px)",        size: "768" },
          { mode: "mobile",       Icon: Smartphone, label: "Mobile (390px)",        size: "390" },
          { mode: "small-mobile", Icon: Smartphone, label: "Small Mobile (320px)",  size: "320" },
        ] as const).map(({ mode, Icon, label, size }) => (
          <button
            key={mode}
            title={label}
            onClick={() => setDeviceMode(mode)}
            className={cn(
              "h-6 flex items-center gap-0.5 px-1 rounded transition-colors",
              activeViewport === mode
                ? "bg-indigo-600 text-white"
                : "text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            )}
          >
            <Icon className="w-3 h-3 shrink-0" />
            {size && <span className="text-[9px] font-semibold tabular-nums leading-none">{size}</span>}
          </button>
        ))}
        {bpKey && (
          <div className="ml-auto flex items-center gap-1">
            <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
              {{ "large-tablet": "1024px", tablet: "768px", mobile: "390px", "small-mobile": "320px" }[bpKey]}
            </span>
            {Object.keys(bpOverrides).length > 0 && (
              <button
                title="Clear overrides for this viewport"
                onClick={() => clearBreakpointOverrides(bpKey)}
                className="h-5 w-5 rounded flex items-center justify-center text-red-400 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Alignment toolbar */}
      <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-100 shrink-0 bg-gray-50/50">
        <span className="text-[9px] font-semibold text-gray-400 uppercase tracking-wide mr-1">Align</span>
        {[
          { icon: AlignLeft,          title: "Text left",              overrides: { textAlign: "left" as const } },
          { icon: AlignCenter,        title: "Text center",            overrides: { textAlign: "center" as const, marginLeft: "auto", marginRight: "auto" } },
          { icon: AlignRight,         title: "Text right",             overrides: { textAlign: "right" as const } },
          { icon: AlignJustify,       title: "Text justify",           overrides: { textAlign: "justify" as const } },
          { icon: AlignStartVertical, title: "Align left in container",overrides: { alignSelf: "flex-start" as const, marginLeft: "0", marginRight: "auto" } },
          { icon: AlignCenterVertical,title: "Center in container",    overrides: { alignSelf: "center" as const, marginLeft: "auto", marginRight: "auto" } },
          { icon: AlignEndVertical,   title: "Align right in container",overrides: { alignSelf: "flex-end" as const, marginLeft: "auto", marginRight: "0" } },
        ].map(({ icon: Icon, title, overrides }) => (
          <button
            key={title}
            onClick={() => updateStyleBatch(overrides)}
            title={title}
            className="h-6 w-6 rounded flex items-center justify-center text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            <Icon className="w-3.5 h-3.5" />
          </button>
        ))}
        <div className="w-px h-4 bg-gray-200 mx-1" />
        <button
          title="Center on page (margin auto)"
          onClick={() => updateStyleBatch({ marginLeft: "auto", marginRight: "auto", display: "block" })}
          className="h-6 px-2 text-[9px] font-semibold text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
        >
          Center
        </button>
      </div>

      {/* Tab bar */}
      <div className="px-3 py-2.5 shrink-0 border-b border-gray-100">
        <div className="grid grid-cols-4 gap-0.5 p-1 bg-gray-100/80 rounded-xl">
          {TABS.filter((t) => !t.showFor || t.showFor(selectedElement.type)).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              title={label}
              className={cn(
                "relative flex flex-col items-center justify-center gap-1 py-2 rounded-lg transition-all duration-150 select-none",
                activeTab === id
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-gray-400 hover:text-gray-600 hover:bg-white/60"
              )}
            >
              <Icon className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-[9px] font-semibold leading-none tracking-tight truncate w-full text-center px-0.5">
                {label}
              </span>
              {activeTab === id && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-0.5 rounded-full bg-indigo-500 opacity-70" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Quick content edit shown when on non-content tabs for text elements */}
      {["heading", "paragraph", "button", "rich-text"].includes(selectedElement.type) && activeTab !== "content" && (
        <div className="px-4 py-2 border-b border-gray-100 shrink-0">
          <textarea
            value={selectedElement.content || ""}
            onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
            rows={1}
            placeholder="Text content..."
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-2 py-1.5 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-indigo-400 resize-none"
          />
        </div>
      )}

      {/* Scrollable tab content */}
      <div className={cn("flex-1", activeTab === "code" ? "overflow-hidden" : "overflow-y-auto")}>
        {activeTab === "content" && (
          <ContentTab
            element={selectedElement}
            updateProps={(props) => updateElementProps(selectedElement.id, props)}
            updateLayoutProp={updateLayoutProp}
            effectiveProps={effectiveProps}
          />
        )}
        {activeTab === "layout" && <LayoutTab styles={styles} updateStyle={updateStyle} />}
        {activeTab === "style" && <StyleTab styles={styles} updateStyle={updateStyle} />}
        {activeTab === "typography" && <TypographyTab elementType={selectedElement.type} styles={styles} updateStyle={updateStyle} element={selectedElement} updateProps={(props) => updateElementProps(selectedElement.id, props)} />}
        {activeTab === "effects" && (
          <EffectsTab
            styles={styles}
            updateStyle={updateStyle}
            animation={selectedElement.animation}
            updateAnimation={(a) => updateElementAnimation(selectedElement.id, a)}
          />
        )}
        {activeTab === "interactions" && (
          <InteractionsTab
            styles={styles}
            updateStyle={updateStyle}
            hoverStyles={selectedElement.hoverStyles}
            updateHoverStyles={(h) => updateElementHoverStyles(selectedElement.id, h)}
            focusStyles={selectedElement.focusStyles}
            updateFocusStyles={(f) => updateElementFocusStyles(selectedElement.id, f)}
            activeStyles={selectedElement.activeStyles}
            updateActiveStyles={(a) => updateElementActiveStyles(selectedElement.id, a)}
            responsiveStyles={responsiveStyles}
            updateResponsiveStyles={updateResponsiveStyles}
          />
        )}
        {activeTab === "code" && (
          <CodeTab
            element={selectedElement}
            updateProps={(props) => updateElementProps(selectedElement.id, props)}
            updateStyles={(s) => updateElementStyles(selectedElement.id, s as Partial<ElementStyles>)}
            updateContent={(c) => updateElementContent(selectedElement.id, c)}
            updateChildren={(children) => updateElement(selectedElement.id, { children })}
          />
        )}
        {activeTab === "submission" && selectedElement.type === "form" && (
          <FormSubmissionTab
            element={selectedElement}
            siteId={siteId ?? ""}
            updateElement={(updates) => updateElement(selectedElement.id, updates)}
          />
        )}
        {activeTab === "data" && selectedElement.type === "cms-list" && (
          <CmsConfigTab
            element={selectedElement}
            siteId={siteId ?? ""}
            updateElement={(updates) => updateElement(selectedElement.id, updates)}
          />
        )}
        {activeTab === "data" && selectedElement.type !== "cms-list" && (
          <DataBindingTab
            element={selectedElement}
            siteId={siteId ?? ""}
            updateElement={(updates) => updateElement(selectedElement.id, updates)}
          />
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FormSubmissionTab — bind a form element to a backend action
// ─────────────────────────────────────────────────────────────────────────────

function FormSubmissionTab({
  element,
  siteId,
  updateElement,
}: {
  element: CanvasElement;
  siteId: string;
  updateElement: (updates: Partial<CanvasElement>) => void;
}) {
  const [actions, setActions] = useState<BackendAction[]>([]);
  const [loading, setLoading] = useState(true);

  const binding = element.backendBinding as FormBackendBinding | undefined;

  const load = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/actions`);
      const json = await res.json();
      setActions(json.data ?? []);
    } finally { setLoading(false); }
  }, [siteId]);

  useEffect(() => { load(); }, [load]);

  const setBinding = (patch: Partial<FormBackendBinding>) => {
    const current = (binding ?? { actionId: "", fieldMappings: [] }) as FormBackendBinding;
    updateElement({ backendBinding: { ...current, ...patch } });
  };

  if (loading) return <div className="flex items-center justify-center h-20"><Loader2 className="w-4 h-4 animate-spin text-gray-300" /></div>;

  return (
    <div className="flex flex-col gap-4 p-3">
      <div>
        <FieldLabel>Backend Action</FieldLabel>
        <div className="mt-1">
          <select
            className={cn(selectCls, "w-full h-7")}
            value={binding?.actionId ?? ""}
            onChange={(e) => setBinding({ actionId: e.target.value })}
          >
            <option value="">— None (no backend) —</option>
            {actions.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
          {actions.length === 0 && (
            <p className="text-[10px] text-gray-400 mt-1">No actions defined. Create one in the Backend panel → Actions tab.</p>
          )}
        </div>
      </div>

      {binding?.actionId && (
        <>
          <div>
            <FieldLabel>On Success</FieldLabel>
            <div className="mt-1 flex flex-col gap-1.5">
              <input
                className={cn(inputCls)}
                placeholder="Toast message (e.g. Submitted!)"
                value={binding.toastOnSuccess ?? ""}
                onChange={(e) => setBinding({ toastOnSuccess: e.target.value })}
              />
              <input
                className={cn(inputCls)}
                placeholder="Redirect to page slug (e.g. /thank-you)"
                value={binding.redirectOnSuccess ?? ""}
                onChange={(e) => setBinding({ redirectOnSuccess: e.target.value })}
              />
            </div>
          </div>

          <div>
            <FieldLabel>On Error</FieldLabel>
            <div className="mt-1">
              <input
                className={cn(inputCls)}
                placeholder="Error toast message"
                value={binding.toastOnError ?? ""}
                onChange={(e) => setBinding({ toastOnError: e.target.value })}
              />
            </div>
          </div>
        </>
      )}

      <div className="bg-amber-50 border border-amber-100 rounded-xl p-3">
        <p className="text-[10px] text-amber-700 font-semibold mb-1">How it works</p>
        <p className="text-[10px] text-amber-600">When a user submits this form, the selected action runs on the server. Form field values are automatically mapped to action parameters by name.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DataBindingTab — bind element content to a data source
// ─────────────────────────────────────────────────────────────────────────────

function DataBindingTab({
  element,
  siteId,
  updateElement,
}: {
  element: CanvasElement;
  siteId: string;
  updateElement: (updates: Partial<CanvasElement>) => void;
}) {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  const binding = element.dataBinding;

  const load = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v1/sites/${siteId}/data`);
      const json = await res.json();
      setSources(json.data ?? []);
    } finally { setLoading(false); }
  }, [siteId]);

  useEffect(() => { load(); }, [load]);

  const setDbinding = (patch: Partial<NonNullable<CanvasElement["dataBinding"]>>) => {
    const current = binding ?? { sourceId: "", path: "" };
    updateElement({ dataBinding: { ...current, ...patch } });
  };

  const clearBinding = () => updateElement({ dataBinding: undefined });

  if (loading) return <div className="flex items-center justify-center h-20"><Loader2 className="w-4 h-4 animate-spin text-gray-300" /></div>;

  return (
    <div className="flex flex-col gap-4 p-3">
      <div>
        <FieldLabel>Data Source</FieldLabel>
        <div className="mt-1">
          <select
            className={cn(selectCls, "w-full h-7")}
            value={binding?.sourceId ?? ""}
            onChange={(e) => {
              if (!e.target.value) { clearBinding(); return; }
              setDbinding({ sourceId: e.target.value });
            }}
          >
            <option value="">— None —</option>
            {sources.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {sources.length === 0 && (
            <p className="text-[10px] text-gray-400 mt-1">No data sources. Create one in Backend panel → Data tab.</p>
          )}
        </div>
      </div>

      {binding?.sourceId && (
        <>
          <div>
            <FieldLabel>Data Path</FieldLabel>
            <div className="mt-1">
              <input
                className={cn(inputCls)}
                placeholder="e.g. rows[0].title or rows"
                value={binding.path ?? ""}
                onChange={(e) => setDbinding({ path: e.target.value })}
              />
              <p className="text-[10px] text-gray-400 mt-1">Dot-path into the query result.</p>
            </div>
          </div>

          <div>
            <FieldLabel>Fallback (while loading)</FieldLabel>
            <div className="mt-1">
              <input
                className={cn(inputCls)}
                placeholder="Loading..."
                value={binding.fallback ?? ""}
                onChange={(e) => setDbinding({ fallback: e.target.value })}
              />
            </div>
          </div>

          <button
            onClick={clearBinding}
            className="text-[11px] text-red-500 hover:text-red-600 text-left"
          >
            Remove binding
          </button>
        </>
      )}

      <div className="bg-rose-50 border border-rose-100 rounded-xl p-3">
        <p className="text-[10px] text-rose-700 font-semibold mb-1">Live Data Binding</p>
        <p className="text-[10px] text-rose-600">This element will fetch data from the selected source when the published site loads.</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CmsConfigTab — configure a cms-list element (collection, layout, fields)
// ─────────────────────────────────────────────────────────────────────────────

interface CmsCollectionInfo { id: string; name: string; slug: string }

function CmsConfigTab({
  element,
  siteId,
  updateElement,
}: {
  element: CanvasElement;
  siteId: string;
  updateElement: (updates: Partial<CanvasElement>) => void;
}) {
  const [collections, setCollections] = useState<CmsCollectionInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [sampleFields, setSampleFields] = useState<string[]>([]);

  const p = (element.props || {}) as Record<string, unknown>;
  const setProps = (patch: Record<string, unknown>) =>
    updateElement({ props: { ...p, ...patch } });

  const collectionSlug = (p.collectionSlug as string) || "";
  const layout = (p.layout as string) || "cards";
  const limit = Number(p.limit) || 6;
  const titleField = (p.titleField as string) || "";
  const imageField = (p.imageField as string) || "";
  const descriptionField = (p.descriptionField as string) || "";

  const load = useCallback(async () => {
    if (!siteId) return;
    setLoading(true);
    try {
      // Show all user collections (site-specific + global); site_id filter is optional
      const res = await fetch(`/api/v1/cms/collections`);
      const json = await res.json();
      setCollections(json.collections ?? []);
    } finally { setLoading(false); }
  }, [siteId]);

  useEffect(() => { load(); }, [load]);

  // Load sample fields when collection changes
  useEffect(() => {
    if (!siteId || !collectionSlug) { setSampleFields([]); return; }
    fetch(`/api/v1/sites/${siteId}/db/${collectionSlug}?status=published&limit=1`)
      .then((r) => r.json())
      .then((json) => {
        const first = json.items?.[0];
        if (first?.data) setSampleFields(Object.keys(first.data));
        else setSampleFields([]);
      })
      .catch(() => setSampleFields([]));
  }, [siteId, collectionSlug]);

  const cardStyle        = (p.cardStyle as string) || "default";
  const columns          = (p.columns as string) || "3";
  const imageHeight      = (p.imageHeight as string) || "md";
  const showDate         = (p.showDate as boolean) ?? false;
  const showReadMore     = (p.showReadMore as boolean) ?? false;
  const readMoreText     = (p.readMoreText as string) || "Read more";
  const gap              = (p.gap as string) || "md";
  const accentColor      = (p.accentColor as string) || "#6366f1";
  const dateField        = (p.dateField as string) || "";
  const badgeField       = (p.badgeField as string) || "";
  const ratingField      = (p.ratingField as string) || "";

  if (loading) return <div className="flex items-center justify-center h-20"><Loader2 className="w-4 h-4 animate-spin text-gray-300" /></div>;

  return (
    <div className="flex flex-col gap-0 p-0">

      {/* ── Collection ── */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-1.5">
          <FieldLabel>Collection</FieldLabel>
          <button onClick={load} className="text-gray-300 hover:text-gray-500 transition-colors">
            <RefreshCw className="w-3 h-3" />
          </button>
        </div>
        <select className={cn(selectCls, "w-full h-7")} value={collectionSlug}
          onChange={(e) => setProps({ collectionSlug: e.target.value })}>
          <option value="">— Select collection —</option>
          {collections.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
        {collections.length === 0 && (
          <p className="text-[10px] text-gray-400 mt-1">No collections. Create one in Dashboard → CMS.</p>
        )}
      </div>

      {/* ── Layout ── */}
      <div className="p-3 border-b border-gray-100 space-y-2">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Layout</p>

        <div>
          <FieldLabel>Style</FieldLabel>
          <select className={cn(selectCls, "w-full h-7 mt-1")} value={layout}
            onChange={(e) => setProps({ layout: e.target.value })}>
            <option value="cards">Cards</option>
            <option value="grid">Grid</option>
            <option value="list">List (rows)</option>
            <option value="featured">Featured (hero + grid)</option>
            <option value="magazine">Magazine (editorial)</option>
            <option value="minimal">Minimal (text list)</option>
            <option value="masonry">Masonry</option>
            <option value="table">Table</option>
          </select>
        </div>

        {["cards", "grid", "featured", "masonry"].includes(layout) && (
          <div>
            <FieldLabel>Columns</FieldLabel>
            <div className="flex gap-1 mt-1">
              {["2", "3", "4"].map((c) => (
                <button key={c} onClick={() => setProps({ columns: c })}
                  className={cn("flex-1 h-7 rounded-lg text-xs font-semibold border transition-all",
                    columns === c ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        )}

        <div>
          <FieldLabel>Gap</FieldLabel>
          <div className="flex gap-1 mt-1">
            {[["sm","Tight"], ["md","Normal"], ["lg","Loose"]].map(([v, l]) => (
              <button key={v} onClick={() => setProps({ gap: v })}
                className={cn("flex-1 h-7 rounded-lg text-xs font-semibold border transition-all",
                  gap === v ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                )}>
                {l}
              </button>
            ))}
          </div>
        </div>

        <div>
          <FieldLabel>Max items</FieldLabel>
          <input type="number" min={1} max={100} value={limit}
            onChange={(e) => setProps({ limit: parseInt(e.target.value) || 6 })}
            className={cn(inputCls, "mt-1")} />
        </div>
      </div>

      {/* ── Card Design ── */}
      {layout !== "table" && layout !== "minimal" && (
        <div className="p-3 border-b border-gray-100 space-y-2">
          <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Card Design</p>

          <div>
            <FieldLabel>Card style</FieldLabel>
            <select className={cn(selectCls, "w-full h-7 mt-1")} value={cardStyle}
              onChange={(e) => setProps({ cardStyle: e.target.value })}>
              <option value="default">Default (border)</option>
              <option value="shadow">Shadow</option>
              <option value="glass">Glassmorphism</option>
              <option value="flat">Flat</option>
              <option value="bordered">Bordered</option>
              <option value="colored">Colored accent</option>
            </select>
          </div>

          {["cards", "grid", "featured", "masonry"].includes(layout) && (
            <div>
              <FieldLabel>Image height</FieldLabel>
              <div className="flex gap-1 mt-1">
                {[["sm","S"], ["md","M"], ["lg","L"], ["xl","XL"]].map(([v, l]) => (
                  <button key={v} onClick={() => setProps({ imageHeight: v })}
                    className={cn("flex-1 h-7 rounded-lg text-xs font-semibold border transition-all",
                      imageHeight === v ? "bg-indigo-600 border-indigo-600 text-white" : "border-gray-200 text-gray-500 hover:border-gray-300"
                    )}>
                    {l}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <FieldLabel>Accent color</FieldLabel>
            <div className="flex items-center gap-2 mt-1">
              <input type="color" value={accentColor}
                onChange={(e) => setProps({ accentColor: e.target.value })}
                className="h-7 w-10 rounded-lg border border-gray-200 cursor-pointer bg-white p-0.5" />
              <input type="text" value={accentColor}
                onChange={(e) => setProps({ accentColor: e.target.value })}
                className={cn(inputCls, "flex-1 font-mono text-xs")} />
            </div>
          </div>
        </div>
      )}

      {/* ── Content Options ── */}
      <div className="p-3 border-b border-gray-100 space-y-2">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Content</p>

        <div className="flex items-center justify-between">
          <FieldLabel>Show date</FieldLabel>
          <button onClick={() => setProps({ showDate: !showDate })}
            className={cn("w-8 h-4 rounded-full transition-colors relative shrink-0",
              showDate ? "bg-indigo-600" : "bg-gray-200"
            )}>
            <span className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all",
              showDate ? "left-4" : "left-0.5")} />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <FieldLabel>Show read more</FieldLabel>
          <button onClick={() => setProps({ showReadMore: !showReadMore })}
            className={cn("w-8 h-4 rounded-full transition-colors relative shrink-0",
              showReadMore ? "bg-indigo-600" : "bg-gray-200"
            )}>
            <span className={cn("absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all",
              showReadMore ? "left-4" : "left-0.5")} />
          </button>
        </div>

        {showReadMore && (
          <div>
            <FieldLabel>Read more text</FieldLabel>
            <input type="text" value={readMoreText}
              onChange={(e) => setProps({ readMoreText: e.target.value })}
              className={cn(inputCls, "mt-1")} placeholder="Read more" />
          </div>
        )}
      </div>

      {/* ── Field Mapping ── */}
      <div className="p-3 space-y-2">
        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Field Mapping</p>
        {sampleFields.length === 0 && (
          <p className="text-[10px] text-gray-400">Select a collection with published items to map fields.</p>
        )}
        {sampleFields.length > 0 && (
          <>
            {[
              { key: "titleField",       label: "Title field",       val: titleField },
              { key: "imageField",       label: "Image field",       val: imageField },
              { key: "descriptionField", label: "Description field", val: descriptionField },
              { key: "dateField",        label: "Date field",        val: dateField },
              { key: "badgeField",       label: "Badge / tag field", val: badgeField },
              { key: "ratingField",      label: "Rating field",      val: ratingField },
            ].map(({ key, label, val }) => (
              <div key={key}>
                <FieldLabel>{label}</FieldLabel>
                <select className={cn(selectCls, "w-full h-7 mt-1")} value={val as string}
                  onChange={(e) => setProps({ [key]: e.target.value })}>
                  <option value="">— Auto detect —</option>
                  {sampleFields.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
            ))}
          </>
        )}
      </div>

      <div className="px-3 pb-3">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Database className="w-3 h-3 text-indigo-500" />
            <p className="text-[10px] text-indigo-700 font-semibold">CMS Live Data</p>
          </div>
          <p className="text-[10px] text-indigo-600">Only published items are shown. Changes update in real time.</p>
        </div>
      </div>
    </div>
  );
}
