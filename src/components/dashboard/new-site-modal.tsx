"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, LayoutTemplate, ArrowRight, Check, Wand2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteStore } from "@/store/site-store";

const quickTemplates = [
  { id: "saas-launch", name: "SaaS Landing", emoji: "⚡", color: "from-primary-500 to-purple-600" },
  { id: "dev-portfolio", name: "Portfolio", emoji: "💻", color: "from-blue-600 to-cyan-500" },
  { id: "tech-blog", name: "Blog", emoji: "✍️", color: "from-gray-800 to-gray-600" },
  { id: "creative-agency", name: "Agency", emoji: "🎨", color: "from-pink-500 to-orange-500" },
  { id: "restaurant-deluxe", name: "Restaurant", emoji: "🍽️", color: "from-amber-600 to-red-500" },
  { id: "digital-agency", name: "Startup", emoji: "🚀", color: "from-green-500 to-teal-500" },
];

interface NewSiteModalProps {
  open: boolean;
  onClose: () => void;
}

export default function NewSiteModal({ open, onClose }: NewSiteModalProps) {
  const router = useRouter();
  const addSite = useSiteStore((s) => s.addSite);
  const [step, setStep] = useState<"choose" | "template" | "ai">("choose");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [siteName, setSiteName] = useState("");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!siteName.trim()) return;
    setIsCreating(true);

    await new Promise((r) => setTimeout(r, 1200));

    const site = addSite({
      name: siteName,
      description: aiPrompt || undefined,
      status: "draft",
      template: selectedTemplate || undefined,
      pages: [
        {
          id: `page-${Date.now()}`,
          name: "Home",
          slug: "/",
          elements: [],
          isHome: true,
        },
      ],
    });

    setIsCreating(false);
    onClose();
    router.push(`/editor/${site.id}`);
  };

  const handleClose = () => {
    setStep("choose");
    setSelectedTemplate(null);
    setSiteName("");
    setAiPrompt("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Create new site</DialogTitle>
          <DialogDescription>
            {step === "choose" && "How would you like to start?"}
            {step === "template" && "Choose a starting template"}
            {step === "ai" && "Describe your website"}
          </DialogDescription>
        </DialogHeader>

        {step === "choose" && (
          <div className="grid grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => setStep("template")}
              className="group p-6 rounded-xl border-2 border-gray-100 hover:border-primary-200 hover:bg-primary-50/50 transition-all text-left"
            >
              <div className="h-12 w-12 rounded-xl bg-primary-100 flex items-center justify-center mb-4 group-hover:bg-primary-200 transition-colors">
                <LayoutTemplate className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">Use a Template</h3>
              <p className="text-sm text-gray-500">
                Start with a professionally designed template and customize it.
              </p>
            </button>

            <button
              onClick={() => setStep("ai")}
              className="group p-6 rounded-xl border-2 border-gray-100 hover:border-purple-200 hover:bg-purple-50/50 transition-all text-left"
            >
              <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary-100 to-purple-100 flex items-center justify-center mb-4 group-hover:from-primary-200 group-hover:to-purple-200 transition-colors">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">AI Generate</h3>
              <p className="text-sm text-gray-500">
                Describe your website and let AI build it for you in seconds.
              </p>
            </button>
          </div>
        )}

        {step === "template" && (
          <div className="space-y-4 pt-2">
            <div className="grid grid-cols-3 gap-3">
              {quickTemplates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(t.id)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-center ${
                    selectedTemplate === t.id
                      ? "border-primary-500 bg-primary-50"
                      : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {selectedTemplate === t.id && (
                    <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary-500 flex items-center justify-center">
                      <Check className="h-2.5 w-2.5 text-white" />
                    </div>
                  )}
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center text-xl mx-auto mb-2`}>
                    {t.emoji}
                  </div>
                  <span className="text-xs font-medium text-gray-700">{t.name}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <Label>Site name</Label>
              <Input
                placeholder="My Awesome Site"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep("choose")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!siteName.trim() || isCreating}
                className="flex-1"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <>
                    Create Site
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "ai" && (
          <div className="space-y-4 pt-2">
            <div className="p-4 rounded-xl bg-gradient-to-br from-primary-50 to-purple-50 border border-primary-100">
              <div className="flex items-center gap-2 mb-2">
                <Wand2 className="h-4 w-4 text-primary-600" />
                <span className="text-sm font-medium text-primary-700">AI Site Generator</span>
              </div>
              <p className="text-xs text-primary-600">
                Our AI will create a complete, customized website based on your description.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Site name</Label>
              <Input
                placeholder="My Company Website"
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Describe your website</Label>
              <textarea
                placeholder="E.g., A modern SaaS landing page for a project management tool targeting small businesses. Should have a clean design with a hero section, features, pricing, and a CTA..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                rows={4}
                className="flex w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 resize-none"
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("choose")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleCreate}
                disabled={!siteName.trim() || !aiPrompt.trim() || isCreating}
                className="flex-1 bg-gradient-to-r from-primary-500 to-purple-600 hover:brightness-110"
              >
                {isCreating ? (
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-4 w-4 animate-pulse" />
                    Generating...
                  </div>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate with AI
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
