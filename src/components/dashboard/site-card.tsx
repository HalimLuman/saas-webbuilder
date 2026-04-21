"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Edit3,
  Settings,
  Globe,
  Copy,
  ExternalLink,
  Clock,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import type { Site } from "@/lib/types";
import { formatRelativeTime } from "@/lib/utils";

const siteGradients = [
  "from-[#6366F1] to-[#8B5CF6]",
  "from-[#0EA5E9] to-[#6366F1]",
  "from-[#10B981] to-[#0EA5E9]",
  "from-[#F59E0B] to-[#EF4444]",
  "from-[#EC4899] to-[#8B5CF6]",
  "from-[#14B8A6] to-[#0EA5E9]",
];

const siteEmojis: Record<string, string> = {
  "saas-launch": "⚡",
  "dev-portfolio": "💻",
  "tech-blog": "✍️",
  "creative-agency": "🎨",
};

interface SiteCardProps {
  site: Site;
  gradientIndex?: number;
  onDuplicate?: (id: string) => void;
}

export default function SiteCard({
  site,
  gradientIndex = 0,
  onDuplicate,
}: SiteCardProps) {
  const router = useRouter();
  const gradient = siteGradients[gradientIndex % siteGradients.length];

  return (
    <div className="group rounded-2xl overflow-hidden border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200">
      {/* Thumbnail */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient} overflow-hidden`}>
        {/* Mock preview */}
        <div className="absolute inset-0 p-4 flex flex-col opacity-60">
          <div className="bg-white/20 rounded-lg px-3 py-1.5 flex items-center gap-1.5 mb-3">
            <div className="h-1.5 w-1.5 rounded-full bg-white/50" />
            <div className="flex-1 bg-white/20 h-1.5 rounded mx-1" />
          </div>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-3xl mb-2">
              {siteEmojis[site.template || ""] || "🌐"}
            </div>
            <div className="bg-white/30 h-2 w-16 rounded mb-1.5" />
            <div className="bg-white/20 h-1.5 w-24 rounded mb-1" />
            <div className="bg-white/15 h-1.5 w-20 rounded" />
          </div>
        </div>

        {/* Status badge overlay */}
        <div className="absolute top-3 left-3">
          <Badge
            variant={site.status === "published" ? "published" : site.status === "draft" ? "draft" : "archived"}
            className="text-[10px] shadow-sm"
          >
            {site.status === "published" && "● "}
            {site.status.charAt(0).toUpperCase() + site.status.slice(1)}
          </Badge>
        </div>

        {/* Kebab menu */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-8 w-8 rounded-lg bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-colors">
                <MoreHorizontal className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem
                className="gap-2"
                onClick={() => router.push(`/editor/${site.id}`)}
              >
                <Edit3 className="h-4 w-4 text-gray-400" />
                Edit Site
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2" asChild>
                <Link href={`/dashboard/sites/${site.id}/settings`}>
                  <Settings className="h-4 w-4 text-gray-400" />
                  Settings
                </Link>
              </DropdownMenuItem>
              {site.status === "published" && (
                <DropdownMenuItem className="gap-2">
                  <ExternalLink className="h-4 w-4 text-gray-400" />
                  View Live Site
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                className="gap-2"
                onClick={() => onDuplicate?.(site.id)}
              >
                <Copy className="h-4 w-4 text-gray-400" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2" asChild>
                <Link href={`/dashboard/sites/${site.id}/settings`}>
                  <Settings className="h-4 w-4 text-gray-400" />
                  Site Settings
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Edit button overlay */}
        <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => router.push(`/editor/${site.id}`)}
            className="px-5 py-2 rounded-xl bg-white text-gray-900 text-sm font-medium shadow-lg hover:bg-white/95 transition-colors flex items-center gap-2"
          >
            <Edit3 className="h-3.5 w-3.5" />
            Open Editor
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm truncate pr-2">{site.name}</h3>
        </div>
        {site.description && (
          <p className="text-gray-500 text-xs mb-2 line-clamp-1">{site.description}</p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock className="h-3 w-3" />
          <span>Edited {formatRelativeTime(new Date(site.updatedAt))}</span>
          <span className="mx-1">·</span>
          <span>{site.pages.length} page{site.pages.length !== 1 ? "s" : ""}</span>
        </div>
        {site.domain && (
          <div className="flex items-center gap-1.5 text-xs text-primary-500 mt-1.5">
            <Globe className="h-3 w-3" />
            <span className="truncate">{site.domain}</span>
          </div>
        )}
      </div>
    </div>
  );
}
