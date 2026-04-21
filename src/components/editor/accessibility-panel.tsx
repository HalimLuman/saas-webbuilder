"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  ShieldCheck, AlertTriangle, AlertCircle, CheckCircle2,
  ChevronDown, RefreshCw, Eye, Contrast, Info,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import type { CanvasElement } from "@/lib/types";

// ---------------------------------------------------------------------------
// A11y issue types
// ---------------------------------------------------------------------------

type Severity = "error" | "warning" | "info";

interface A11yIssue {
  id: string;
  severity: Severity;
  category: string;
  message: string;
  elementId: string;
  elementType: string;
  hint?: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function flattenElements(elements: CanvasElement[]): CanvasElement[] {
  const result: CanvasElement[] = [];
  function walk(els: CanvasElement[]) {
    for (const el of els) {
      result.push(el);
      if (el.children?.length) walk(el.children);
    }
  }
  walk(elements);
  return result;
}

function relativeLuminance(hex: string): number {
  const clean = hex.replace("#", "");
  if (clean.length !== 6) return 0;
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function contrastRatio(fg: string, bg: string): number {
  if (!fg.startsWith("#") || !bg.startsWith("#")) return 0;
  const l1 = relativeLuminance(fg);
  const l2 = relativeLuminance(bg);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const HEADING_LEVELS: Record<string, number> = {
  h1: 1, h2: 2, h3: 3, h4: 4, h5: 5, h6: 6,
};

const GENERIC_LINK_TEXTS = new Set(["click here", "read more", "learn more", "here", "link", "more", "go"]);

function analyzeA11y(elements: CanvasElement[]): A11yIssue[] {
  const flat = flattenElements(elements);
  const issues: A11yIssue[] = [];

  const headings: { level: number; id: string }[] = [];

  for (const el of flat) {
    const type = el.type;
    const props = (el.props || {}) as Record<string, unknown>;

    // ── Images: missing alt text ──────────────────────────────────────────
    if (type === "image") {
      const alt = ((props.alt as string) || (props.altText as string) || "").trim();
      if (!alt) {
        issues.push({
          id: `alt-${el.id}`,
          severity: "error",
          category: "Images",
          message: "Image is missing alt text",
          hint: "Add descriptive alt text in the Content tab → Alt Text field. If decorative, set alt to empty string explicitly.",
          elementId: el.id,
          elementType: el.type,
        });
      }
    }

    // ── Headings: hierarchy ───────────────────────────────────────────────
    if (type === "heading") {
      const levelStr = (props.level as string | number | undefined);
      const level = typeof levelStr === "number"
        ? levelStr
        : HEADING_LEVELS[String(levelStr || "h2")] ?? 2;

      if (headings.length > 0) {
        const prev = headings[headings.length - 1];
        if (level > prev.level + 1) {
          issues.push({
            id: `heading-skip-${el.id}`,
            severity: "warning",
            category: "Headings",
            message: `Heading level skipped (H${prev.level} → H${level})`,
            hint: `Use sequential heading levels. Replace this H${level} with an H${prev.level + 1}.`,
            elementId: el.id,
            elementType: el.type,
          });
        }
      }
      headings.push({ level, id: el.id });
    }

    // ── Multiple H1s ──────────────────────────────────────────────────────
    if (type === "heading") {
      const levelStr = props.level;
      const isH1 = !levelStr || levelStr === "h1" || levelStr === 1;
      if (isH1) {
        const h1Count = flat.filter((e) => {
          const lv = e.props?.level;
          return e.type === "heading" && (!lv || lv === "h1" || lv === 1);
        }).length;
        if (h1Count > 1 && !issues.find((i) => i.id === "multiple-h1")) {
          issues.push({
            id: "multiple-h1",
            severity: "error",
            category: "Headings",
            message: `Multiple H1 headings (${h1Count} found)`,
            hint: "Each page should have exactly one H1. Change the others to H2 or lower.",
            elementId: el.id,
            elementType: el.type,
          });
        }
      }
    }

    // ── No H1 at all ─────────────────────────────────────────────────────
    if (!issues.find((i) => i.id === "no-h1") && flat.length > 0) {
      const hasH1 = flat.some((e) => {
        const lv = e.props?.level;
        return e.type === "heading" && (!lv || lv === "h1" || lv === 1);
      });
      if (!hasH1 && flat.some((e) => e.type === "heading")) {
        issues.push({
          id: "no-h1",
          severity: "warning",
          category: "Headings",
          message: "Page has no H1 heading",
          hint: "Add an H1 heading as the main page title for SEO and screen reader navigation.",
          elementId: flat.find((e) => e.type === "heading")!.id,
          elementType: "heading",
        });
      }
    }

    // ── Buttons: missing label ────────────────────────────────────────────
    if (type === "button") {
      const text = ((el.content || "") + (props.text as string || "")).trim();
      const ariaLabel = (props["aria-label"] as string || "").trim();
      if (!text && !ariaLabel) {
        issues.push({
          id: `btn-label-${el.id}`,
          severity: "error",
          category: "Interactive",
          message: "Button has no visible text or aria-label",
          hint: "Add button text or an aria-label so screen reader users know its purpose.",
          elementId: el.id,
          elementType: el.type,
        });
      }
    }

    // ── Links: generic / empty text ───────────────────────────────────────
    if (type === "button") {
      const text = (el.content || (props.text as string) || "").toLowerCase().trim();
      if (!text) {
        issues.push({
          id: `link-empty-${el.id}`,
          severity: "error",
          category: "Links",
          message: "Link/button has no text content",
          hint: "All interactive elements need visible text or an aria-label.",
          elementId: el.id,
          elementType: el.type,
        });
      } else if (GENERIC_LINK_TEXTS.has(text)) {
        issues.push({
          id: `link-purpose-${el.id}`,
          severity: "warning",
          category: "Links",
          message: `Generic link text "${el.content}"`,
          hint: "Use descriptive text, e.g. 'View pricing plans' instead of 'Click here'.",
          elementId: el.id,
          elementType: el.type,
        });
      }
    }

    // ── Form inputs: missing label ────────────────────────────────────────
    if (type === "input" || type === "textarea" || type === "select") {
      const label = (props.label as string || "").trim();
      const placeholder = (props.placeholder as string || "").trim();
      const ariaLabel = (props["aria-label"] as string || "").trim();
      if (!label && !ariaLabel) {
        issues.push({
          id: `input-label-${el.id}`,
          severity: "error",
          category: "Forms",
          message: `${type.charAt(0).toUpperCase() + type.slice(1)} field has no label`,
          hint: placeholder
            ? `Placeholder "${placeholder}" is not a label. Add a visible label or aria-label so screen readers can identify this field.`
            : "Add a label to this form field in the Content tab → Label.",
          elementId: el.id,
          elementType: el.type,
        });
      }
    }

    // ── Forms: no submit button ───────────────────────────────────────────
    if (type === "form") {
      const hasSubmit = (el.children ?? []).some(
        (c) => c.type === "button" && (
          (c.props?.type === "submit") ||
          !c.props?.type  // default button inside form acts as submit
        )
      );
      if (!hasSubmit) {
        issues.push({
          id: `form-submit-${el.id}`,
          severity: "warning",
          category: "Forms",
          message: "Form has no submit button",
          hint: "Add a button inside this form so keyboard users can submit it.",
          elementId: el.id,
          elementType: el.type,
        });
      }
    }

    // ── Color contrast ───────────────────────────────────────────────────
    const styles = (el.styles || {}) as Record<string, string>;
    const fg = styles.color;
    const bg = styles.backgroundColor;
    if (fg && bg && fg.startsWith("#") && bg.startsWith("#")) {
      const ratio = contrastRatio(fg, bg);
      if (ratio < 3) {
        issues.push({
          id: `contrast-fail-${el.id}`,
          severity: "error",
          category: "Contrast",
          message: `Very low contrast (${ratio.toFixed(1)}:1 — WCAG AA needs 4.5:1)`,
          hint: "Increase contrast between text and background color.",
          elementId: el.id,
          elementType: el.type,
        });
      } else if (ratio < 4.5) {
        issues.push({
          id: `contrast-warn-${el.id}`,
          severity: "warning",
          category: "Contrast",
          message: `Low contrast (${ratio.toFixed(1)}:1 — below WCAG AA 4.5:1)`,
          hint: "Consider increasing contrast for normal-sized text.",
          elementId: el.id,
          elementType: el.type,
        });
      }
    }

    // ── Hidden elements ───────────────────────────────────────────────────
    if (el.isHidden) {
      issues.push({
        id: `hidden-${el.id}`,
        severity: "info",
        category: "Visibility",
        message: `"${el.name || el.type}" is hidden`,
        hint: "If this element should be invisible to screen readers too, verify aria-hidden is set in its properties.",
        elementId: el.id,
        elementType: el.type,
      });
    }
  }

  return issues;
}

// ---------------------------------------------------------------------------
// Score calculation
// ---------------------------------------------------------------------------

function computeScore(issues: A11yIssue[]): number {
  const errors = issues.filter((i) => i.severity === "error").length;
  const warnings = issues.filter((i) => i.severity === "warning").length;
  const penalty = errors * 10 + warnings * 3;
  return Math.max(0, Math.min(100, 100 - penalty));
}

// ---------------------------------------------------------------------------
// UI components
// ---------------------------------------------------------------------------

const SEV_CONFIG: Record<Severity, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string; label: string }> = {
  error: { icon: AlertCircle, color: "text-red-600", bg: "bg-red-50 border-red-100", label: "Error" },
  warning: { icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 border-amber-100", label: "Warning" },
  info: { icon: Info, color: "text-blue-500", bg: "bg-blue-50 border-blue-100", label: "Info" },
};

function ScoreRing({ score }: { score: number }) {
  const color = score >= 90 ? "#10B981" : score >= 70 ? "#F59E0B" : "#EF4444";
  const r = 28;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;
  return (
    <div className="relative flex items-center justify-center w-[72px] h-[72px]">
      <svg width={72} height={72} className="absolute inset-0 -rotate-90">
        <circle cx={36} cy={36} r={r} fill="none" stroke="#E5E7EB" strokeWidth={6} />
        <circle
          cx={36} cy={36} r={r} fill="none"
          stroke={color} strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
      </svg>
      <span className="relative text-base font-bold" style={{ color }}>{score}</span>
    </div>
  );
}

function IssueItem({ issue, onSelect }: { issue: A11yIssue; onSelect: () => void }) {
  const [open, setOpen] = useState(false);
  const { icon: Icon, color, bg } = SEV_CONFIG[issue.severity];
  return (
    <div className={cn("rounded-lg border overflow-hidden", bg)}>
      <button
        type="button"
        className="w-full flex items-start gap-2 px-3 py-2.5 text-left hover:opacity-90 transition-opacity"
        onClick={() => setOpen((o) => !o)}
      >
        <Icon className={cn("w-3.5 h-3.5 shrink-0 mt-0.5", color)} />
        <div className="flex-1 min-w-0">
          <p className="text-[11px] font-medium text-gray-800 leading-tight">{issue.message}</p>
          <p className="text-[10px] text-gray-500 mt-0.5">{issue.category} · {issue.elementType}</p>
        </div>
        <ChevronDown className={cn("w-3 h-3 text-gray-400 shrink-0 transition-transform mt-0.5", open && "rotate-180")} />
      </button>
      {open && (
        <div className="px-3 pb-2.5 space-y-1.5 border-t border-white/50">
          {issue.hint && <p className="text-[10px] text-gray-600 leading-relaxed">{issue.hint}</p>}
          <button
            type="button"
            onClick={onSelect}
            className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium hover:underline"
          >
            Select element →
          </button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main panel
// ---------------------------------------------------------------------------

export default function AccessibilityPanel() {
  const { elements, selectElement } = useEditorStore();
  const [filter, setFilter] = useState<"all" | Severity>("all");
  // Incrementing this forces a re-analysis even if elements reference hasn't changed
  const [refreshKey, setRefreshKey] = useState(0);

  const issues = useMemo(
    () => analyzeA11y(elements),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [elements, refreshKey]
  );
  const score = useMemo(() => computeScore(issues), [issues]);

  const filtered = filter === "all" ? issues : issues.filter((i) => i.severity === filter);

  const errorCount = issues.filter((i) => i.severity === "error").length;
  const warnCount = issues.filter((i) => i.severity === "warning").length;
  const infoCount = issues.filter((i) => i.severity === "info").length;

  const categories = Array.from(new Set(filtered.map((i) => i.category)));

  const handleRefresh = useCallback(() => setRefreshKey((k) => k + 1), []);

  const scoreLabel = score >= 90 ? "Excellent" : score >= 70 ? "Needs work" : "Poor";

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-indigo-500" />
          <span className="text-xs font-semibold text-gray-800">Accessibility Checker</span>
          <span className="ml-auto text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">WCAG 2.1 AA</span>
        </div>

        {/* Score */}
        <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <ScoreRing score={score} />
          <div className="space-y-1">
            <p className="text-[11px] font-semibold text-gray-700">{scoreLabel} accessibility</p>
            <div className="flex flex-col gap-0.5">
              {errorCount > 0 && (
                <span className="text-[10px] text-red-600 font-medium">{errorCount} error{errorCount !== 1 ? "s" : ""}</span>
              )}
              {warnCount > 0 && (
                <span className="text-[10px] text-amber-600">{warnCount} warning{warnCount !== 1 ? "s" : ""}</span>
              )}
              {infoCount > 0 && (
                <span className="text-[10px] text-blue-500">{infoCount} info</span>
              )}
              {issues.length === 0 && (
                <span className="text-[10px] text-emerald-600 font-medium">No issues found!</span>
              )}
            </div>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 mt-2">
          {([
            { id: "all", label: `All (${issues.length})` },
            { id: "error", label: `Errors (${errorCount})` },
            { id: "warning", label: `Warnings (${warnCount})` },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setFilter(id)}
              className={cn(
                "flex-1 py-1 text-[10px] font-medium rounded border transition-colors",
                filter === id
                  ? id === "error" ? "bg-red-600 text-white border-red-600"
                    : id === "warning" ? "bg-amber-500 text-white border-amber-500"
                    : "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-500 border-gray-200 hover:border-gray-300"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Issue list */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 gap-2 text-gray-400">
            <CheckCircle2 className="w-6 h-6 opacity-40" />
            <span className="text-[11px]">
              {filter === "all" ? "No accessibility issues found!" : `No ${filter}s found`}
            </span>
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat}>
              <div className="flex items-center gap-2 mb-1.5">
                <Contrast className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{cat}</span>
              </div>
              <div className="space-y-1.5">
                {filtered.filter((i) => i.category === cat).map((issue) => (
                  <IssueItem
                    key={issue.id}
                    issue={issue}
                    onSelect={() => selectElement(issue.elementId)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-gray-100 bg-gray-50/50">
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400">
            Scans {flattenElements(elements).length} elements
          </span>
          <button
            type="button"
            className="flex items-center gap-1 text-[10px] text-indigo-600 hover:text-indigo-800 font-medium"
            onClick={handleRefresh}
          >
            <RefreshCw className="w-3 h-3" />
            Refresh
          </button>
        </div>
        <p className="text-[9px] text-gray-300 mt-0.5">
          Based on WCAG 2.1 AA guidelines
        </p>
      </div>
    </div>
  );
}
