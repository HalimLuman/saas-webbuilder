"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { LayoutTemplate } from "lucide-react";
import { useSiteStore } from "@/store/site-store";
import { toast } from "sonner";
import { instantiateTemplate } from "@/lib/site-templates";
import { generateId } from "@/lib/utils";
import { TemplateGallery } from "@/components/templates/shared";
import type { SiteTemplate } from "@/lib/site-templates";

export default function DashboardTemplatesPage() {
  const router = useRouter();
  const addSite = useSiteStore((s) => s.addSite);

  const handleUse = (template: SiteTemplate) => {
    const pages = instantiateTemplate(template.pages);
    const siteId = generateId();
    addSite({
      id: siteId,
      name: template.name,
      template: template.id,
      status: "draft",
      pages,
    });
    toast.success(`"${template.name}" template applied!`, {
      description: "Opening editor…",
      duration: 3000,
    });
    router.push(`/editor/${siteId}`);
  };

  const handleBlank = () => {
    const siteId = generateId();
    addSite({
      id: siteId,
      name: "Untitled Site",
      template: undefined,
      status: "draft",
      pages: [{
        id: `page-${generateId()}`,
        name: "Home",
        slug: "/",
        isHome: true,
        elements: [],
      }],
    });
    router.push(`/editor/${siteId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center gap-4">
        <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
          <LayoutTemplate className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-lg font-bold text-gray-900">Templates</h1>
          <p className="text-sm text-gray-500">Choose a template to start your site</p>
        </div>
      </div>

      <div className="p-6">
        <TemplateGallery onUse={handleUse} useLabel="Use" onBlank={handleBlank} />
      </div>
    </div>
  );
}
