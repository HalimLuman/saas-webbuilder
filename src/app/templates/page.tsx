"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { SITE_TEMPLATES } from "@/lib/site-templates";
import { TemplateGallery } from "@/components/templates/shared";
import type { SiteTemplate } from "@/lib/site-templates";

export default function TemplatesPage() {
  const router = useRouter();

  const handleUse = (t: SiteTemplate) => {
    router.push(`/editor/new?template=${t.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-14 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <Sparkles className="h-3.5 w-3.5" /> {SITE_TEMPLATES.length} production-ready templates
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Start with a{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              great template
            </span>
          </h1>
          <p className="text-lg text-gray-500 max-w-xl mx-auto">
            Every template is built with real section blocks — navbars, heroes, footers and more.
            Fully responsive and editable in the visual editor.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <TemplateGallery onUse={handleUse} useLabel="Use Template" />
      </div>
    </div>
  );
}
