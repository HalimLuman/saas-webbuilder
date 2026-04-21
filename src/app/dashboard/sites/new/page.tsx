"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Sparkles, LayoutTemplate, Globe,
  Check, Loader2, Wand2, ChevronRight, Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useSiteStore } from "@/store/site-store";
import { useWorkspaceFetch } from "@/hooks/use-workspace-fetch";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { SITE_TEMPLATES, instantiateTemplate, type SiteTemplate } from "@/lib/site-templates";
import { TemplateGallery, TemplateThumbnail } from "@/components/templates/shared";

const PLAN_SITE_LIMITS: Record<string, number> = {
  free: 2, pro: 10, business: 999, enterprise: 999,
};

// ─── Types ────────────────────────────────────────────────────────────────────

type Step = "method" | "template" | "details" | "generating";
type Method = "template" | "ai" | "blank";

const AI_SUGGESTIONS = [
  "A SaaS landing page for a project management tool with pricing and testimonials",
  "A portfolio site for a freelance designer with case studies and contact form",
  "An agency website for a digital marketing firm with services and team sections",
  "A personal blog about technology trends with a newsletter signup",
];

const STEPS: { id: Step; label: string }[] = [
  { id: "method", label: "Choose Method" },
  { id: "template", label: "Pick Template" },
  { id: "details", label: "Site Details" },
];

// ─── Step indicator ───────────────────────────────────────────────────────────

function StepIndicator({ currentStep }: { currentStep: Step }) {
  const visibleSteps = STEPS.filter((s) => s.id !== "generating");
  const currentIdx = visibleSteps.findIndex((s) => s.id === currentStep);
  return (
    <div className="flex items-center gap-2">
      {visibleSteps.map((step, idx) => {
        const isDone = idx < currentIdx;
        const isActive = idx === currentIdx;
        return (
          <React.Fragment key={step.id}>
            {idx > 0 && <div className={cn("h-px w-12 transition-colors", isDone ? "bg-primary-400" : "bg-gray-200")} />}
            <div className="flex items-center gap-1.5">
              <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold transition-all", isDone ? "bg-primary-500 text-white" : isActive ? "bg-primary-100 text-primary-600 ring-2 ring-primary-500" : "bg-gray-100 text-gray-400")}>
                {isDone ? <Check className="h-3 w-3" /> : idx + 1}
              </div>
              <span className={cn("text-xs font-medium hidden sm:block", isActive ? "text-gray-900" : "text-gray-400")}>{step.label}</span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function NewSitePage() {
  const router = useRouter();
  const { addSite } = useSiteStore();
  const wfetch = useWorkspaceFetch();
  const { profile } = useUser();

  const [siteCount, setSiteCount] = useState<number | null>(null);
  const [step, setStep] = useState<Step>("method");
  const [method, setMethod] = useState<Method>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [siteName, setSiteName] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [generatingPhase, setGeneratingPhase] = useState(0);

  useEffect(() => {
    wfetch("/api/v1/sites").then((r) => r.json()).then((j) => {
      const active = (j.data ?? []).filter((s: { status: string }) => s.status !== "archived");
      setSiteCount(active.length);
    }).catch(() => setSiteCount(0));
  }, [wfetch]);

  const selectedTemplateData = SITE_TEMPLATES.find((t) => t.id === selectedTemplate) ?? null;

  const generatingMessages = [
    "Analyzing your prompt with AI…",
    "Selecting optimal layout and sections…",
    "Generating color palette and typography…",
    "Building page structure and content…",
    "Finalizing and optimizing…",
  ];

  const handleMethodNext = () => {
    if (method === "blank") setStep("details");
    else if (method === "template") setStep("template");
    else setStep("details");
  };

  const handleTemplateNext = () => {
    if (selectedTemplate || method === "ai") setStep("details");
  };

  const handleCreate = async () => {
    if (!siteName.trim()) { toast.error("Please enter a site name"); return; }

    const resolvedPages = (() => {
      if (method === "template" && selectedTemplateData) {
        return instantiateTemplate(selectedTemplateData.pages);
      }
      return [{ id: `page-home`, name: "Home", slug: "/", elements: [], isHome: true }];
    })();

    setIsCreating(true);
    setStep("generating");

    for (let i = 0; i < generatingMessages.length - 1; i++) {
      setGeneratingPhase(i);
      await new Promise((r) => setTimeout(r, 900 + Math.random() * 400));
    }

    let siteId: string;
    try {
      const res = await wfetch("/api/v1/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: siteName.trim(), template_id: selectedTemplate ?? null }),
      });
      const json = await res.json();
      if (!res.ok) {
        toast.error(json.error ?? "Failed to create site");
        setIsCreating(false);
        setStep("details");
        return;
      }
      siteId = json.data.id;
    } catch {
      toast.error("Network error. Please try again.");
      setIsCreating(false);
      setStep("details");
      return;
    }

    setGeneratingPhase(generatingMessages.length - 1);
    await new Promise((r) => setTimeout(r, 500));

    addSite({
      id: siteId,
      name: siteName.trim(),
      description: siteDescription.trim() || undefined,
      template: selectedTemplate || undefined,
      status: "draft",
      pages: resolvedPages,
    });

    toast.success("Site created! Opening editor…");
    router.push(`/editor/${siteId}`);
  };

  // ── Plan limit wall ────────────────────────────────────────────────────────
  const siteLimit = PLAN_SITE_LIMITS[profile?.plan ?? "free"] ?? 2;
  const atLimit = siteCount !== null && siteCount >= siteLimit;

  if (atLimit) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white border-b border-gray-100 px-6 h-14 flex items-center shrink-0">
          <Link href="/dashboard/sites" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back to Sites
          </Link>
        </header>
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 w-full max-w-md text-center">
            <div className="h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <Lock className="h-7 w-7 text-amber-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Site limit reached</h2>
            <p className="text-gray-500 text-sm mb-2">
              Your <span className="font-semibold capitalize">{profile?.plan ?? "free"}</span> plan allows up to{" "}
              <span className="font-semibold">{siteLimit === 999 ? "unlimited" : siteLimit}</span> site{siteLimit !== 1 ? "s" : ""}.
            </p>
            <p className="text-gray-400 text-sm mb-8">Upgrade your plan to create more sites.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" asChild>
                <Link href="/dashboard/sites"><ArrowLeft className="h-4 w-4 mr-1.5" /> Back to Sites</Link>
              </Button>
              <Button className="bg-indigo-600 hover:bg-indigo-700" asChild>
                <Link href="/dashboard/billing"><ArrowRight className="h-4 w-4 mr-1.5" /> Upgrade Plan</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Generating screen ──────────────────────────────────────────────────────
  if (step === "generating") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-10 w-full max-w-md text-center">
          <div className="relative inline-flex mb-8">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/30">
              <Sparkles className="h-9 w-9 text-white animate-pulse" />
            </div>
            <div className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-white border-2 border-primary-300 flex items-center justify-center">
              <Loader2 className="h-3 w-3 text-primary-500 animate-spin" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Building your site</h2>
          <p className="text-gray-500 text-sm mb-8">{method === "ai" ? "AI is generating your custom website…" : "Setting up your new site…"}</p>
          <div className="space-y-2.5 mb-8 text-left">
            {generatingMessages.map((msg, i) => (
              <div key={i} className={cn("flex items-center gap-3 text-sm transition-all", i <= generatingPhase ? "opacity-100" : "opacity-20")}>
                <div className={cn("h-5 w-5 rounded-full flex items-center justify-center shrink-0", i < generatingPhase ? "bg-green-100" : i === generatingPhase ? "bg-primary-100" : "bg-gray-100")}>
                  {i < generatingPhase ? <Check className="h-2.5 w-2.5 text-green-600" /> : i === generatingPhase ? <Loader2 className="h-2.5 w-2.5 text-primary-500 animate-spin" /> : <div className="h-1.5 w-1.5 rounded-full bg-gray-300" />}
                </div>
                <span className={i === generatingPhase ? "text-gray-900 font-medium" : i < generatingPhase ? "text-gray-500 line-through" : "text-gray-400"}>{msg}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${((generatingPhase + 1) / generatingMessages.length) * 100}%` }} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-100 px-6 h-14 flex items-center justify-between shrink-0">
        <Link href="/dashboard/sites" className="flex items-center gap-2 text-gray-500 hover:text-gray-800 text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to Sites
        </Link>
        <StepIndicator currentStep={step} />
        <div className="w-32" />
      </header>

      <div className="flex-1 flex items-start justify-center p-6 pt-10">
        <div className={cn("w-full transition-all", step === "template" ? "max-w-5xl" : "max-w-3xl")}>

          {/* ── Step 1: Choose method ──────────────────────────────────── */}
          {step === "method" && (
            <div>
              <div className="text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create a new site</h1>
                <p className="text-gray-500">Choose how you want to start building.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {([
                  { id: "template" as Method, icon: LayoutTemplate, iconBg: "bg-blue-100", iconColor: "text-blue-600", title: "Start from template", description: "Choose from professionally designed, full-page templates ready for production with minimal edits.", badge: null },
                  { id: "ai" as Method, icon: Wand2, iconBg: "bg-gradient-to-br from-primary-100 to-purple-100", iconColor: "text-primary-600", title: "Generate with AI", description: "Describe your site in plain English and let our AI build it for you.", badge: "Popular" },
                  { id: "blank" as Method, icon: Globe, iconBg: "bg-gray-100", iconColor: "text-gray-600", title: "Start from scratch", description: "Begin with a blank canvas and full creative freedom.", badge: null },
                ] as const).map((option) => {
                  const Icon = option.icon;
                  const isSelected = method === option.id;
                  return (
                    <button key={option.id} onClick={() => setMethod(option.id)}
                      className={cn("relative text-left p-6 rounded-2xl border-2 transition-all", isSelected ? "border-primary-500 bg-primary-50/50 shadow-sm shadow-primary-100" : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm")}
                    >
                      {option.badge && <span className="absolute top-3 right-3 text-[10px] font-semibold bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full">{option.badge}</span>}
                      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center mb-4", option.iconBg)}>
                        <Icon className={cn("h-5 w-5", option.iconColor)} />
                      </div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{option.title}</h3>
                        {isSelected && <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center"><Check className="h-3 w-3 text-white" /></div>}
                      </div>
                      <p className="text-sm text-gray-500 leading-relaxed">{option.description}</p>
                    </button>
                  );
                })}
              </div>
              {method === "ai" && (
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 rounded-2xl border border-primary-100 p-5 mb-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-4 w-4 text-primary-500" />
                    <p className="text-sm font-medium text-primary-700">Quick start with a suggestion</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AI_SUGGESTIONS.map((s) => (
                      <button key={s} onClick={() => setAiPrompt(s)}
                        className={cn("text-left text-xs p-3 rounded-xl border transition-colors leading-relaxed", aiPrompt === s ? "bg-primary-100 border-primary-300 text-primary-800" : "bg-white border-gray-200 text-gray-600 hover:border-primary-200 hover:bg-primary-50/50")}
                      >
                        {aiPrompt === s && <Check className="h-3 w-3 inline mr-1 text-primary-600" />}{s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end">
                <Button size="lg" onClick={handleMethodNext} className="gap-2 min-w-[140px]">Continue <ChevronRight className="h-4 w-4" /></Button>
              </div>
            </div>
          )}

          {/* ── Step 2: Template picker ────────────────────────────────── */}
          {step === "template" && (
            <div>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">Choose a template</h1>
                <p className="text-gray-500 text-sm">Complete, production-ready sites. Customize everything in the editor.</p>
              </div>

              <TemplateGallery
                onUse={() => {}}
                selectedId={selectedTemplate}
                onSelect={(t) => setSelectedTemplate(t.id === selectedTemplate ? null : t.id)}
              />

              <div className="flex items-center justify-between mt-6">
                <Button variant="ghost" onClick={() => setStep("method")} className="gap-2 text-gray-500">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button size="lg" onClick={handleTemplateNext} disabled={!selectedTemplate} className="gap-2 min-w-[140px]">
                  Continue <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          {/* ── Step 3: Site details ───────────────────────────────────── */}
          {step === "details" && (
            <div>
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Name your site</h1>
                <p className="text-gray-500">You can change these settings anytime from site settings.</p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 space-y-5">
                {method === "ai" && (
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-primary-500" /> Describe your site</Label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="e.g. A SaaS landing page for a project management tool targeting small teams, with pricing, features, and a testimonials section."
                      rows={3}
                      className="flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 resize-none"
                    />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="site-name">Site Name <span className="text-red-400">*</span></Label>
                  <Input id="site-name" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="My Awesome Site" className="h-10" onKeyDown={(e) => { if (e.key === "Enter" && siteName.trim()) handleCreate(); }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="site-desc">Description <span className="text-gray-400 font-normal">(optional)</span></Label>
                  <Input id="site-desc" value={siteDescription} onChange={(e) => setSiteDescription(e.target.value)} placeholder="A brief description of your website" className="h-10" />
                </div>
                {siteName && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-gray-50 border border-gray-200">
                    <Globe className="h-4 w-4 text-gray-400 shrink-0" />
                    <span className="text-sm text-gray-500">Your site will be at:</span>
                    <code className="text-sm font-medium text-gray-800">{siteName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}.buildstack.site</code>
                  </div>
                )}
              </div>

              {/* Template summary */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 mb-6">
                {method === "ai" ? (
                  <div className="h-8 w-8 rounded-lg bg-primary-100 flex items-center justify-center"><Wand2 className="h-4 w-4 text-primary-600" /></div>
                ) : method === "template" && selectedTemplateData ? (
                  <div className="h-8 w-8 rounded-lg overflow-hidden shrink-0">
                    <div className="w-full h-full" style={{ width: "200%", height: "200%", transform: "scale(0.5)", transformOrigin: "top left" }}>
                      <TemplateThumbnail template={selectedTemplateData} />
                    </div>
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-lg bg-gray-200 flex items-center justify-center"><Globe className="h-4 w-4 text-gray-500" /></div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-700">{method === "ai" ? "AI-generated site" : method === "template" && selectedTemplateData ? selectedTemplateData.name : "Blank site"}</p>
                  <p className="text-[11px] text-gray-400">
                    {method === "ai" ? "Built from your description" : method === "template" && selectedTemplateData ? `${selectedTemplateData.pages.length} pages included` : "Start with a blank canvas"}
                  </p>
                </div>
                <button onClick={() => setStep(method === "template" ? "template" : "method")} className="text-xs text-primary-500 hover:underline shrink-0">Change</button>
              </div>

              <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => setStep(method === "template" ? "template" : "method")} className="gap-2 text-gray-500">
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
                <Button size="lg" onClick={handleCreate} disabled={!siteName.trim() || isCreating} className="gap-2 min-w-[180px] bg-gradient-to-r from-primary-500 to-purple-600 hover:from-primary-600 hover:to-purple-700 shadow-lg shadow-primary-500/25">
                  {isCreating ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</> : <>{method === "ai" ? <Sparkles className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}{method === "ai" ? "Generate with AI" : "Create Site"}</>}
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
