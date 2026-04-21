"use client";

import React, { useState } from "react";
import {
  Palette, Type, Move, Circle, Square, ChevronDown, ChevronRight, RotateCcw,
} from "lucide-react";
import { useEditorStore } from "@/store/editor-store";
import { cn } from "@/lib/utils";
import type { DesignTokens } from "@/lib/types";

// ─── Primitives ───────────────────────────────────────────────────────────────

const inputCls =
  "h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full";

function TokenColorSwatch({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="text-[11px] text-gray-600 shrink-0 w-24 leading-none">{label}</span>
      <div className="flex items-center gap-1.5 flex-1 min-w-0">
        <label className="relative h-6 w-6 rounded border border-gray-200 overflow-hidden cursor-pointer shrink-0 shadow-sm">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
          />
          <div className="w-full h-full rounded" style={{ backgroundColor: value }} />
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 min-w-0 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
        />
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 transition-colors"
      >
        <Icon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
        <span className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider flex-1 text-left">
          {title}
        </span>
        {open ? (
          <ChevronDown className="h-3 w-3 text-gray-400" />
        ) : (
          <ChevronRight className="h-3 w-3 text-gray-400" />
        )}
      </button>
      {open && <div className="px-3 pb-3 space-y-2">{children}</div>}
    </div>
  );
}

// ─── Color palette presets ────────────────────────────────────────────────────

const PALETTE_PRESETS: { name: string; colors: Partial<DesignTokens["colors"]> }[] = [
  {
    name: "Indigo",
    colors: { primary: "#6366F1", secondary: "#8B5CF6", accent: "#EC4899" },
  },
  {
    name: "Blue",
    colors: { primary: "#3B82F6", secondary: "#06B6D4", accent: "#F59E0B" },
  },
  {
    name: "Green",
    colors: { primary: "#10B981", secondary: "#059669", accent: "#6366F1" },
  },
  {
    name: "Rose",
    colors: { primary: "#F43F5E", secondary: "#EC4899", accent: "#8B5CF6" },
  },
  {
    name: "Orange",
    colors: { primary: "#F97316", secondary: "#EF4444", accent: "#06B6D4" },
  },
  {
    name: "Slate",
    colors: { primary: "#334155", secondary: "#475569", accent: "#6366F1" },
  },
];

const FONT_OPTIONS = [
  "Inter", "Roboto", "Poppins", "Montserrat", "Lato", "Open Sans",
  "Nunito", "Raleway", "Playfair Display", "Merriweather", "Source Serif 4",
  "DM Sans", "Plus Jakarta Sans", "Space Grotesk",
];

const MONO_FONT_OPTIONS = [
  "JetBrains Mono", "Fira Code", "Source Code Pro", "IBM Plex Mono", "Roboto Mono",
];

const RADIUS_PRESETS = [
  { name: "None", values: { sm: "0px", md: "0px", lg: "0px", xl: "0px", full: "0px" } },
  { name: "Sm", values: { sm: "2px", md: "4px", lg: "6px", xl: "8px", full: "9999px" } },
  { name: "Md", values: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" } },
  { name: "Lg", values: { sm: "6px", md: "12px", lg: "16px", xl: "24px", full: "9999px" } },
  { name: "Xl", values: { sm: "8px", md: "16px", lg: "24px", xl: "32px", full: "9999px" } },
  { name: "Full", values: { sm: "9999px", md: "9999px", lg: "9999px", xl: "9999px", full: "9999px" } },
];

// ─── Main component ───────────────────────────────────────────────────────────

export default function DesignTokensPanel() {
  const { designTokens, updateDesignTokens } = useEditorStore();
  const { colors, typography, spacing, borderRadius, shadows } = designTokens;

  const updateColors = (patch: Partial<DesignTokens["colors"]>) =>
    updateDesignTokens({ colors: { ...colors, ...patch } });

  const updateTypography = (patch: Partial<DesignTokens["typography"]>) =>
    updateDesignTokens({ typography: { ...typography, ...patch } });

  const updateBorderRadius = (patch: Partial<DesignTokens["borderRadius"]>) =>
    updateDesignTokens({ borderRadius: { ...borderRadius, ...patch } });

  const updateShadows = (patch: Partial<DesignTokens["shadows"]>) =>
    updateDesignTokens({ shadows: { ...shadows, ...patch } });

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-gray-100 shrink-0">
        <div className="flex items-center gap-2">
          <Palette className="h-3.5 w-3.5 text-indigo-500" />
          <p className="text-xs font-semibold text-gray-700">Design Tokens</p>
          <button
            onClick={() => updateDesignTokens({
              colors: {
                primary: "#6366F1", secondary: "#8B5CF6", accent: "#EC4899",
                background: "#FFFFFF", surface: "#F9FAFB", text: "#111827",
                textMuted: "#6B7280", border: "#E5E7EB",
                success: "#10B981", warning: "#F59E0B", error: "#EF4444",
              },
              typography: { fontHeading: "Inter", fontBody: "Inter", fontMono: "JetBrains Mono", sizeBase: 16, scaleRatio: 1.25 },
              spacing: { base: 8 },
              borderRadius: { sm: "4px", md: "8px", lg: "12px", xl: "16px", full: "9999px" },
              shadows: {
                sm: "0 1px 2px rgba(0,0,0,0.05)", md: "0 4px 6px rgba(0,0,0,0.07)",
                lg: "0 10px 15px rgba(0,0,0,0.1)", xl: "0 20px 25px rgba(0,0,0,0.1)",
              },
            })}
            title="Reset to defaults"
            className="ml-auto h-5 w-5 rounded flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>
        <p className="text-[10px] text-gray-400 mt-1">Global design system for your site</p>
      </div>

      <div className="flex-1 overflow-y-auto">

        {/* ── Color Palette ── */}
        <Section title="Colors" icon={Palette}>
          {/* Quick palette presets */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1.5">Quick palettes</p>
            <div className="flex flex-wrap gap-1.5">
              {PALETTE_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateColors(preset.colors)}
                  title={preset.name}
                  className="flex items-center gap-1 px-2 py-1 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors bg-white"
                >
                  <div className="flex gap-0.5">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.colors.primary }} />
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.colors.secondary }} />
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: preset.colors.accent }} />
                  </div>
                  <span className="text-[10px] text-gray-500">{preset.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-1">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Brand</p>
            <TokenColorSwatch label="Primary" value={colors.primary} onChange={(v) => updateColors({ primary: v })} />
            <TokenColorSwatch label="Secondary" value={colors.secondary} onChange={(v) => updateColors({ secondary: v })} />
            <TokenColorSwatch label="Accent" value={colors.accent} onChange={(v) => updateColors({ accent: v })} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Surfaces</p>
            <TokenColorSwatch label="Background" value={colors.background} onChange={(v) => updateColors({ background: v })} />
            <TokenColorSwatch label="Surface" value={colors.surface} onChange={(v) => updateColors({ surface: v })} />
            <TokenColorSwatch label="Border" value={colors.border} onChange={(v) => updateColors({ border: v })} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Text</p>
            <TokenColorSwatch label="Text" value={colors.text} onChange={(v) => updateColors({ text: v })} />
            <TokenColorSwatch label="Text Muted" value={colors.textMuted} onChange={(v) => updateColors({ textMuted: v })} />
          </div>

          <div className="space-y-2">
            <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">Semantic</p>
            <TokenColorSwatch label="Success" value={colors.success} onChange={(v) => updateColors({ success: v })} />
            <TokenColorSwatch label="Warning" value={colors.warning} onChange={(v) => updateColors({ warning: v })} />
            <TokenColorSwatch label="Error" value={colors.error} onChange={(v) => updateColors({ error: v })} />
          </div>
        </Section>

        {/* ── Typography ── */}
        <Section title="Typography" icon={Type}>
          <div className="space-y-2">
            <div className="space-y-1">
              <span className="text-[10px] font-medium text-gray-500">Heading font</span>
              <select
                value={typography.fontHeading}
                onChange={(e) => updateTypography({ fontHeading: e.target.value })}
                className="h-6 text-[11px] px-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full"
              >
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-medium text-gray-500">Body font</span>
              <select
                value={typography.fontBody}
                onChange={(e) => updateTypography({ fontBody: e.target.value })}
                className="h-6 text-[11px] px-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full"
              >
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-medium text-gray-500">Mono font</span>
              <select
                value={typography.fontMono}
                onChange={(e) => updateTypography({ fontMono: e.target.value })}
                className="h-6 text-[11px] px-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 w-full"
              >
                {MONO_FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-600 shrink-0">Base size</span>
              <div className="flex items-center gap-1">
                <input
                  type="number"
                  value={typography.sizeBase}
                  onChange={(e) => updateTypography({ sizeBase: parseInt(e.target.value) || 16 })}
                  min={12} max={24}
                  className="w-16 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
                <span className="text-[10px] text-gray-400">px</span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] text-gray-600 shrink-0">Scale ratio</span>
              <select
                value={typography.scaleRatio}
                onChange={(e) => updateTypography({ scaleRatio: parseFloat(e.target.value) })}
                className="w-28 h-6 text-[11px] px-1.5 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              >
                <option value={1.067}>Minor Second (1.067)</option>
                <option value={1.125}>Major Second (1.125)</option>
                <option value={1.2}>Minor Third (1.200)</option>
                <option value={1.25}>Major Third (1.250)</option>
                <option value={1.333}>Perfect Fourth (1.333)</option>
                <option value={1.414}>Augmented Fourth (1.414)</option>
                <option value={1.5}>Perfect Fifth (1.500)</option>
                <option value={1.618}>Golden Ratio (1.618)</option>
              </select>
            </div>
            {/* Type scale preview */}
            <div className="mt-2 p-2 bg-gray-50 rounded-lg space-y-1">
              {["xs", "sm", "md", "lg", "xl", "2xl"].map((size, i) => {
                const px = Math.round(typography.sizeBase * Math.pow(typography.scaleRatio, i - 1));
                return (
                  <div key={size} className="flex items-baseline justify-between gap-2">
                    <span className="text-[9px] text-gray-400 font-mono w-6 shrink-0">{size}</span>
                    <span className="flex-1 truncate text-gray-700 leading-none" style={{ fontSize: `${Math.min(px, 24)}px` }}>
                      Aa
                    </span>
                    <span className="text-[9px] text-gray-400 font-mono shrink-0">{px}px</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Section>

        {/* ── Spacing ── */}
        <Section title="Spacing" icon={Move} defaultOpen={false}>
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-gray-600 shrink-0">Base unit</span>
            <div className="flex items-center gap-1">
              <input
                type="number"
                value={spacing.base}
                onChange={(e) => updateDesignTokens({ spacing: { base: parseInt(e.target.value) || 8 } })}
                min={4} max={16}
                className="w-16 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400"
              />
              <span className="text-[10px] text-gray-400">px</span>
            </div>
          </div>
          {/* Spacing scale preview */}
          <div className="mt-1 space-y-1">
            {[1, 2, 3, 4, 6, 8, 12, 16].map((multiplier) => (
              <div key={multiplier} className="flex items-center gap-2">
                <span className="text-[9px] text-gray-400 font-mono w-6 shrink-0">{multiplier}×</span>
                <div
                  className="h-2 bg-indigo-200 rounded-full"
                  style={{ width: `${Math.min(spacing.base * multiplier * 2, 180)}px` }}
                />
                <span className="text-[9px] text-gray-400 font-mono">{spacing.base * multiplier}px</span>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Border Radius ── */}
        <Section title="Border Radius" icon={Circle} defaultOpen={false}>
          {/* Presets */}
          <div>
            <p className="text-[10px] text-gray-400 mb-1.5">Presets</p>
            <div className="flex gap-1.5 flex-wrap">
              {RADIUS_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  onClick={() => updateBorderRadius(preset.values)}
                  className={cn(
                    "px-2 py-1 border text-[10px] font-medium transition-colors text-gray-600 bg-white hover:border-indigo-300",
                    preset.name === "None" ? "rounded" :
                    preset.name === "Full" ? "rounded-full" :
                    "rounded-lg"
                  )}
                  style={{ borderRadius: preset.values.md }}
                >
                  {preset.name}
                </button>
              ))}
            </div>
          </div>
          {/* Individual values */}
          <div className="space-y-2">
            {(["sm", "md", "lg", "xl", "full"] as const).map((key) => (
              <div key={key} className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-gray-600 shrink-0 w-8">{key}</span>
                <div className="flex items-center gap-1.5 flex-1">
                  <div
                    className="h-5 w-5 border-2 border-indigo-300 shrink-0"
                    style={{ borderRadius: borderRadius[key] }}
                  />
                  <input
                    type="text"
                    value={borderRadius[key]}
                    onChange={(e) => updateBorderRadius({ [key]: e.target.value })}
                    className="flex-1 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Shadows ── */}
        <Section title="Shadows" icon={Square} defaultOpen={false}>
          <div className="space-y-3">
            {(["sm", "md", "lg", "xl"] as const).map((key) => (
              <div key={key} className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-gray-600 shrink-0 w-5">{key}</span>
                  <div
                    className="h-5 w-8 bg-white rounded shrink-0 border border-gray-100"
                    style={{ boxShadow: shadows[key] }}
                  />
                  <input
                    type="text"
                    value={shadows[key]}
                    onChange={(e) => updateShadows({ [key]: e.target.value })}
                    className="flex-1 h-6 text-[11px] px-2 rounded border border-gray-200 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-400 font-mono"
                    placeholder="0 4px 6px rgba(0,0,0,0.1)"
                  />
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* ── CSS Variables Export ── */}
        <Section title="CSS Variables" icon={Palette} defaultOpen={false}>
          <div className="bg-gray-900 rounded-lg p-3 overflow-x-auto">
            <pre className="text-[10px] text-gray-300 leading-relaxed font-mono whitespace-pre-wrap">
{`:root {
  --color-primary: ${colors.primary};
  --color-secondary: ${colors.secondary};
  --color-accent: ${colors.accent};
  --color-bg: ${colors.background};
  --color-surface: ${colors.surface};
  --color-text: ${colors.text};
  --color-text-muted: ${colors.textMuted};
  --color-border: ${colors.border};
  --color-success: ${colors.success};
  --color-warning: ${colors.warning};
  --color-error: ${colors.error};
  --font-heading: "${typography.fontHeading}";
  --font-body: "${typography.fontBody}";
  --font-mono: "${typography.fontMono}";
  --text-base: ${typography.sizeBase}px;
  --space-unit: ${spacing.base}px;
  --radius-sm: ${borderRadius.sm};
  --radius-md: ${borderRadius.md};
  --radius-lg: ${borderRadius.lg};
  --radius-xl: ${borderRadius.xl};
  --shadow-sm: ${shadows.sm};
  --shadow-md: ${shadows.md};
  --shadow-lg: ${shadows.lg};
}`}
            </pre>
          </div>
          <button
            onClick={() => {
              const css = `:root {\n  --color-primary: ${colors.primary};\n  --color-secondary: ${colors.secondary};\n  --color-accent: ${colors.accent};\n  --color-bg: ${colors.background};\n  --color-surface: ${colors.surface};\n  --color-text: ${colors.text};\n  --color-text-muted: ${colors.textMuted};\n  --color-border: ${colors.border};\n  --font-heading: "${typography.fontHeading}";\n  --font-body: "${typography.fontBody}";\n  --text-base: ${typography.sizeBase}px;\n  --space-unit: ${spacing.base}px;\n  --radius-md: ${borderRadius.md};\n}`;
              navigator.clipboard.writeText(css);
            }}
            className="w-full mt-2 py-1.5 text-[11px] text-indigo-500 border border-dashed border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors font-medium"
          >
            Copy CSS Variables
          </button>
        </Section>

      </div>
    </div>
  );
}
