"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Sparkles, Wand2, ArrowRight, Send, RotateCcw,
  ChevronDown, Check, Loader2, Globe, Palette,
  LayoutTemplate, Zap, Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSiteStore } from "@/store/site-store";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";

// ─── Prompt examples by category ─────────────────────────────────────────────

const PROMPT_CATEGORIES = [
  {
    label: "SaaS & Tech",
    color: "from-indigo-500 to-violet-600",
    prompts: [
      "A SaaS landing page for a project management app with a dark theme, pricing table, feature comparison, and testimonials",
      "A developer tool website for an API monitoring service with code examples, status dashboard preview, and pricing",
      "An AI startup landing page with animated gradient hero, demo video placeholder, and investor CTA section",
    ],
  },
  {
    label: "Portfolio",
    color: "from-gray-700 to-gray-900",
    prompts: [
      "A minimal portfolio for a UX designer with case studies grid, about section, process diagram, and contact form",
      "A creative developer portfolio with animated hero, GitHub stats, blog section, and dark/light toggle",
    ],
  },
  {
    label: "Business",
    color: "from-blue-500 to-cyan-600",
    prompts: [
      "A professional services agency site with hero slider, services grid, team bios, client logos, and contact form",
      "A consulting firm website with results statistics, service pillars, team section, and calendar booking",
    ],
  },
  {
    label: "E-Commerce",
    color: "from-emerald-500 to-teal-600",
    prompts: [
      "An online boutique landing page with featured products grid, promotional banner, newsletter signup, and Instagram feed",
      "A product launch page for a physical product with 360 viewer placeholder, specs, pre-order form, and FAQ",
    ],
  },
];

const STYLE_OPTIONS = [
  { id: "modern", label: "Modern", description: "Clean, minimal, lots of whitespace" },
  { id: "bold", label: "Bold", description: "Strong colors, large type, impactful" },
  { id: "dark", label: "Dark", description: "Dark background, premium feel" },
  { id: "playful", label: "Playful", description: "Rounded, colorful, friendly" },
];

const COLOR_PALETTES = [
  { id: "indigo", name: "Indigo", from: "#6366f1", to: "#8b5cf6" },
  { id: "blue", name: "Ocean", from: "#3b82f6", to: "#06b6d4" },
  { id: "emerald", name: "Forest", from: "#10b981", to: "#14b8a6" },
  { id: "orange", name: "Sunset", from: "#f97316", to: "#ef4444" },
  { id: "rose", name: "Rose", from: "#f43f5e", to: "#ec4899" },
  { id: "slate", name: "Slate", from: "#475569", to: "#1e293b" },
];

// ─── Streaming output display ─────────────────────────────────────────────────

function StreamingOutput({ text, isStreaming }: { text: string; isStreaming: boolean }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [text]);

  if (!text && !isStreaming) return null;

  return (
    <div className="mt-6 bg-gray-900 rounded-2xl border border-gray-700 overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-gray-700/70">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/70" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
          <div className="h-3 w-3 rounded-full bg-green-500/70" />
        </div>
        <span className="text-gray-400 text-xs ml-1">AI output</span>
        {isStreaming && (
          <div className="ml-auto flex items-center gap-1.5 text-green-400 text-xs">
            <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            Generating…
          </div>
        )}
      </div>
      <div
        ref={ref}
        className="p-4 overflow-y-auto max-h-64 font-mono text-xs text-green-300 leading-relaxed whitespace-pre-wrap"
      >
        {text}
        {isStreaming && <span className="animate-pulse">▊</span>}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const router = useRouter();
  const { addSite } = useSiteStore();
  const wfetch = useWorkspaceFetch();
  const { profile } = useUser();
  const isPaidPlan = profile?.plan && profile.plan !== "free";

  const [prompt, setPrompt] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("modern");
  const [selectedPalette, setSelectedPalette] = useState("indigo");
  const [isGenerating, setIsGenerating] = useState(false);
  const [streamOutput, setStreamOutput] = useState("");
  const [phase, setPhase] = useState<"idle" | "streaming" | "done">("idle");
  const [activeCategoryIdx, setActiveCategoryIdx] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    if (!isPaidPlan) {
      toast.error("AI generation is a paid feature", { description: "Upgrade to Pro or higher to use AI site generation." });
      return;
    }

    setIsGenerating(true);
    setPhase("streaming");
    setStreamOutput("");

    const fullPrompt = `Generate a detailed website plan for the following description:\n\n"${prompt}"\n\nStyle preference: ${STYLE_OPTIONS.find((s) => s.id === selectedStyle)?.label}\nColor palette: ${COLOR_PALETTES.find((c) => c.id === selectedPalette)?.name}\n\nPlease describe:\n1. Page sections and layout structure\n2. Color scheme and typography choices\n3. Key content blocks and components\n4. Interactions and animations\n5. SEO and conversion optimization suggestions`;

    try {
      const response = await fetch("/api/v1/ai/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: fullPrompt,
          context: { mode: "site-generator", style: selectedStyle, palette: selectedPalette },
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let output = "";

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          try {
            const data = JSON.parse(line.slice(6));
            if (data.delta?.text) {
              output += data.delta.text;
              setStreamOutput(output);
            }
          } catch { }
        }
      }
      setPhase("done");
    } catch {
      toast.error("Generation failed. Please try again.");
      setPhase("idle");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCreateSite = async () => {
    setIsGenerating(true);
    let siteName = "AI Generated Site";

    try {
      // Call the structured generate API to get a proper site name
      const res = await fetch("/api/v1/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, style: selectedStyle, colorPalette: selectedPalette }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.site?.name) siteName = data.site.name;
      }
    } catch {
      // fallback to prompt-derived name
      siteName = prompt.split(" ").slice(0, 5).join(" ") || "AI Generated Site";
    } finally {
      setIsGenerating(false);
    }

    // Create the site on the server
    let newSiteId: string;
    try {
      const res = await wfetch("/api/v1/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: siteName }),
      });
      if (!res.ok) throw new Error("Failed to create site on server");
      const { data } = await res.json();
      newSiteId = data.id;
    } catch (err: any) {
      console.error("Server site creation failed:", err);
      // Fallback to local only if server fails, but warn user
      toast.error("Cloud sync failed. Site will be local-only.");
      const tempSite = addSite({
        name: siteName,
        description: prompt,
        status: "draft",
        pages: [{ id: "page-home", name: "Home", slug: "/", elements: [], isHome: true }],
      });
      newSiteId = tempSite.id;
    }

    // Ensure it's in the store with the real ID if we got one
    if (!newSiteId.startsWith("site-")) {
      addSite({
        id: newSiteId,
        name: siteName,
        description: prompt,
        status: "draft",
        pages: [{ id: "page-home", name: "Home", slug: "/", elements: [], isHome: true }],
      });
    }

    toast.success("Site created! Opening editor…");
    router.push(`/editor/${newSiteId}`);
  };

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">AI Site Generator</h1>
          <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">Beta</span>
        </div>
        <p className="text-gray-500 text-sm ml-12">
          Describe your website in plain English. Our AI will generate a complete site plan and open it in the editor.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Prompt textarea */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Describe your website
            </label>
            <textarea
              ref={textareaRef}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. A SaaS landing page for a project management tool targeting small teams, with a dark hero, pricing table, and testimonials…"
              rows={5}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && e.metaKey && prompt.trim()) handleGenerate();
              }}
            />
            <div className="flex items-center justify-between mt-2">
              <p className="text-xs text-gray-400">{prompt.length} chars · Press ⌘Enter to generate</p>
              <button
                onClick={() => { setPrompt(""); setStreamOutput(""); setPhase("idle"); }}
                className="text-xs text-gray-400 hover:text-gray-600 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                Clear
              </button>
            </div>
          </div>

          {/* Example prompts */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Example prompts</p>
              <div className="flex gap-1">
                {PROMPT_CATEGORIES.map((cat, idx) => (
                  <button
                    key={cat.label}
                    onClick={() => setActiveCategoryIdx(idx)}
                    className={cn(
                      "px-2.5 py-1 rounded-lg text-xs font-medium transition-colors",
                      idx === activeCategoryIdx
                        ? "bg-gray-900 text-white"
                        : "bg-gray-100 text-gray-500 hover:text-gray-700"
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              {PROMPT_CATEGORIES[activeCategoryIdx].prompts.map((p) => (
                <button
                  key={p}
                  onClick={() => {
                    setPrompt(p);
                    textareaRef.current?.focus();
                  }}
                  className={cn(
                    "w-full text-left text-xs p-3 rounded-xl border transition-colors leading-relaxed",
                    prompt === p
                      ? "bg-primary-50 border-primary-200 text-primary-800"
                      : "bg-gray-50 border-gray-100 text-gray-600 hover:border-gray-200 hover:bg-gray-100"
                  )}
                >
                  {prompt === p && <Check className="h-3 w-3 inline mr-1.5 text-primary-600" />}
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <Button
            size="lg"
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="w-full gap-3 bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 shadow-lg shadow-primary-500/25 h-12 text-base"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Generating your site…
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Generate with AI
                <span className="text-white/60 text-sm">⌘↵</span>
              </>
            )}
          </Button>

          {/* Streaming output */}
          <StreamingOutput text={streamOutput} isStreaming={isGenerating} />

          {/* Post-generation CTA */}
          {phase === "done" && (
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-5">
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-xl bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-green-900 mb-1">Site plan generated!</h3>
                  <p className="text-sm text-green-700 mb-4">
                    Your AI-powered site plan is ready. Click below to create the site and open it in the visual editor.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleCreateSite}
                      className="gap-2 bg-green-600 hover:bg-green-700 shadow-sm"
                    >
                      <Globe className="h-4 w-4" />
                      Create & Open Editor
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setStreamOutput(""); setPhase("idle"); }}
                      className="gap-2 border-green-200 text-green-700"
                    >
                      <RotateCcw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: options sidebar */}
        <div className="space-y-4">
          {/* Style */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <LayoutTemplate className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Style</p>
            </div>
            <div className="space-y-1.5">
              {STYLE_OPTIONS.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  className={cn(
                    "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all text-sm",
                    selectedStyle === style.id
                      ? "bg-primary-50 border border-primary-200 text-primary-800"
                      : "bg-gray-50 border border-transparent text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {selectedStyle === style.id
                    ? <Check className="h-3.5 w-3.5 text-primary-600 shrink-0" />
                    : <div className="h-3.5 w-3.5 rounded-full border-2 border-gray-300 shrink-0" />
                  }
                  <div>
                    <div className="font-medium text-xs leading-tight">{style.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{style.description}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Color palette */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <Palette className="h-4 w-4 text-gray-400" />
              <p className="text-sm font-semibold text-gray-900">Color palette</p>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {COLOR_PALETTES.map((palette) => (
                <button
                  key={palette.id}
                  onClick={() => setSelectedPalette(palette.id)}
                  className={cn(
                    "relative flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition-all",
                    selectedPalette === palette.id
                      ? "border-gray-900"
                      : "border-transparent hover:border-gray-200"
                  )}
                >
                  <div
                    className="h-8 w-8 rounded-lg shadow-sm"
                    style={{ background: `linear-gradient(135deg, ${palette.from}, ${palette.to})` }}
                  />
                  <span className="text-[10px] text-gray-600 font-medium">{palette.name}</span>
                  {selectedPalette === palette.id && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gray-900 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Credits info */}
          <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-4">
            <div className="flex items-start gap-2.5">
              <Zap className="h-4 w-4 text-primary-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-semibold text-primary-800 mb-1">AI Credits</p>
                <p className="text-[11px] text-primary-600 leading-relaxed">
                  Each generation uses 1 AI credit. You have <strong>153 credits</strong> remaining this month.
                </p>
                <Link href="/dashboard/billing" className="text-[11px] text-primary-500 hover:underline mt-1 block">
                  Upgrade for unlimited credits →
                </Link>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-2">
              <Info className="h-3.5 w-3.5 text-gray-400" />
              <p className="text-xs font-semibold text-gray-600">Tips for better results</p>
            </div>
            <ul className="space-y-1.5 text-[11px] text-gray-500">
              <li className="flex items-start gap-1.5">
                <span className="text-primary-400 mt-0.5">•</span>
                Mention your target audience
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary-400 mt-0.5">•</span>
                Describe specific sections you want
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary-400 mt-0.5">•</span>
                Include conversion goals (signups, sales…)
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-primary-400 mt-0.5">•</span>
                Mention competitor sites you like
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
