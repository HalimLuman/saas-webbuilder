"use client";

import React, { useState, useMemo } from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Search, Square, Type, Image, MousePointer, Navigation, Layout, ShoppingCart,
  Code, ChevronDown, ChevronRight, Grid3X3, Minus, ArrowUpDown, AlignLeft, Quote,
  Terminal, Tag, BookOpen, Video, Music, UserCircle, GalleryHorizontal, MonitorPlay,
  Link, CheckSquare, ToggleLeft, Star, Menu, LayoutTemplate, Layers, CreditCard,
  Zap, MessageSquare, DollarSign, Users, Clock, BarChart3, HelpCircle, BookMarked,
  ShoppingBag, PanelRight, Package, Braces, Activity, Map, Timer, GanttChart,
  SidebarOpen, AlignJustify, FormInput, Sparkles, ListOrdered, StretchVertical,
  LayoutGrid, Grid2X2, PanelLeft, AlertCircle, Keyboard, Hash, Shapes,
  SlidersHorizontal, Calendar, Upload, KeyRound, Heart, Megaphone, Grip, Table,
  Rows3, Columns3, Heading1, Heading2, Heading3, Database, LayoutList,
  ImagePlus, LogIn, Shield, Lock, Rss, TrendingUp, RefreshCw, Percent, PieChart,
  FlipHorizontal, ChevronUp, Inbox, Send, Globe, Phone, Mail,
  Award, Briefcase, Cpu, Lightbulb, Target, Rocket, Puzzle,
  Play, Film, BookmarkCheck, ListChecks, BarChart2, ArrowRight,
  UserCheck, Building2, Palette, Gauge, Repeat2, QrCode, X,
  Bell, Wand2, Smartphone, Tags, BadgeCheck, Copy, MousePointerClick,
  LayoutDashboard, Newspaper, Flame, CircleUserRound, ScanLine,
  NotepadText, PanelTopOpen, Captions,
} from "lucide-react";
import type { DraggableElement } from "@/lib/types";
import { cn } from "@/lib/utils";

// ── Icon map ──────────────────────────────────────────────────────────────────

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Square, Grid3X3, AlignJustify, StretchVertical, Minus, ArrowUpDown, Layers,
  Type, Heading1, Heading2, Heading3, AlignLeft, BookOpen, Quote, Terminal,
  Tag, BookMarked, AlertCircle, Keyboard, Hash, Link, Image, Video, Music,
  Star, UserCircle, GalleryHorizontal, Sparkles, MonitorPlay, Shapes, Users,
  MousePointer, FormInput, CheckSquare, ToggleLeft, SlidersHorizontal, Calendar,
  Upload, Search, KeyRound, ChevronDown, Menu, LayoutTemplate, ListOrdered,
  ChevronRight, SidebarOpen, CreditCard, Zap, MessageSquare, DollarSign, Clock,
  BarChart3, HelpCircle, ShoppingBag, PanelRight, Package, Braces, Activity,
  Map, Timer, GanttChart, Navigation, Layout, ShoppingCart, Code, LayoutGrid,
  Grid2X2, PanelLeft, Heart, Megaphone, Grip, Table, Rows3, Columns3,
  Database, LayoutList, ImagePlus, LogIn, Shield, Lock, Rss, TrendingUp, RefreshCw,
  Percent, PieChart, FlipHorizontal, ChevronUp, Inbox, Send, Globe, Phone,
  Mail, Award, Briefcase, Cpu, Lightbulb, Target, Rocket, Puzzle, Play, Film,
  BookmarkCheck, ListChecks, BarChart2, ArrowRight, UserCheck, Building2,
  Palette, Gauge, Repeat2, QrCode,
  Bell, Wand2, Smartphone, Tags, BadgeCheck, Copy, MousePointerClick,
  LayoutDashboard, Newspaper, Flame, CircleUserRound, ScanLine,
  NotepadText, PanelTopOpen, Captions,
};

// ── Types ─────────────────────────────────────────────────────────────────────

interface PanelElement {
  id: string;
  type: string;
  label: string;
  icon: string;
  defaultContent?: string;
  defaultStyles?: Record<string, string>;
  defaultProps?: Record<string, unknown>;
  description?: string;
}

interface Category {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  iconColor: string;
  accentBorder: string;
  elements: PanelElement[];
}

// ── Category definitions ──────────────────────────────────────────────────────

const categories: Category[] = [

  // ── 1. Layout & Structure ───────────────────────────────────────────────────
  {
    id: "layout",
    label: "Layout",
    icon: Square,
    color: "bg-slate-100",
    iconColor: "text-slate-600",
    accentBorder: "border-slate-400",
    elements: [
      {
        id: "section-blank",
        type: "section",
        label: "Section",
        icon: "Square",
        description: "Full-width page section wrapper",
        defaultStyles: {
          padding: "96px 40px",
          backgroundColor: "#FFFFFF",
          width: "100%",
        },
      },
      {
        id: "container-block",
        type: "container",
        label: "Container",
        icon: "Layers",
        description: "Centered max-width content wrapper",
        defaultStyles: {
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
        },
      },
      {
        id: "flex-row-block",
        type: "flex-row",
        label: "Flex Row",
        icon: "Rows3",
        description: "Horizontal flex row container",
        defaultStyles: {
          display: "flex",
          alignItems: "center",
          gap: "24px",
          flexWrap: "wrap",
        },
        defaultProps: { gap: "24px", alignItems: "center", justifyContent: "flex-start", wrap: true },
      },
      {
        id: "flex-col-block",
        type: "flex-col",
        label: "Flex Column",
        icon: "Columns3",
        description: "Vertical flex column container",
        defaultStyles: {
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        },
        defaultProps: { gap: "24px", alignItems: "stretch" },
      },
      {
        id: "grid-block",
        type: "grid",
        label: "Grid",
        icon: "Grid3X3",
        description: "Responsive CSS grid layout",
        defaultStyles: {
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "32px",
          width: "100%",
        },
        defaultProps: { columns: "3", gap: "32px" },
      },
      {
        id: "two-col-layout",
        type: "two-col",
        label: "2 Columns",
        icon: "Grid2X2",
        description: "Two equal-width columns",
        defaultStyles: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" },
        defaultProps: { ratio: "1:1", gap: "40px" },
      },
      {
        id: "three-col-layout",
        type: "three-col",
        label: "3 Columns",
        icon: "Grid3X3",
        description: "Three equal-width columns",
        defaultStyles: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "32px" },
        defaultProps: { gap: "32px" },
      },
      {
        id: "four-col-layout",
        type: "four-col",
        label: "4 Columns",
        icon: "LayoutGrid",
        description: "Four equal-width columns",
        defaultStyles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px" },
        defaultProps: { gap: "24px" },
      },
      {
        id: "sidebar-left-layout",
        type: "sidebar-left",
        label: "Sidebar Left",
        icon: "PanelLeft",
        description: "Left sidebar + main content area",
        defaultStyles: { display: "grid", gridTemplateColumns: "280px 1fr", gap: "40px", alignItems: "start" },
        defaultProps: { sidebarWidth: "280px", gap: "40px" },
      },
      {
        id: "sidebar-right-layout",
        type: "sidebar-right",
        label: "Sidebar Right",
        icon: "PanelRight",
        description: "Main content area + right sidebar",
        defaultStyles: { display: "grid", gridTemplateColumns: "1fr 280px", gap: "40px", alignItems: "start" },
        defaultProps: { sidebarWidth: "280px", gap: "40px" },
      },
      {
        id: "divider-elem",
        type: "divider",
        label: "Divider",
        icon: "Minus",
        description: "Horizontal rule separator",
        defaultStyles: {
          border: "none",
          borderTop: "1px solid #E2E8F0",
          margin: "40px 0",
          width: "100%",
        },
        defaultProps: { style: "solid", color: "#E2E8F0", thickness: "1px" },
      },
      {
        id: "spacer-elem",
        type: "spacer",
        label: "Spacer",
        icon: "ArrowUpDown",
        description: "Vertical whitespace block",
        defaultStyles: { height: "64px", width: "100%" },
        defaultProps: { height: "64px", mobileHeight: "32px", responsive: true },
      },
    ],
  },

  // ── 2. Typography ───────────────────────────────────────────────────────────
  {
    id: "typography",
    label: "Typography",
    icon: Type,
    color: "bg-violet-100",
    iconColor: "text-violet-600",
    accentBorder: "border-violet-400",
    elements: [
      {
        id: "heading-elem",
        type: "heading",
        label: "Heading",
        icon: "Heading1",
        description: "H1–H6 display heading",
        defaultContent: "Build something remarkable",
        defaultStyles: {
          fontSize: "48px",
          fontWeight: "800",
          color: "#0F172A",
          letterSpacing: "-0.03em",
          lineHeight: "1.15",
          margin: "0 0 16px",
        },
        defaultProps: { level: 2 },
      },
      {
        id: "paragraph-elem",
        type: "paragraph",
        label: "Paragraph",
        icon: "Type",
        description: "Body text paragraph",
        defaultContent: "Streamline your workflow with tools designed for modern teams. From planning to deployment, every step is optimized for speed and clarity.",
        defaultStyles: {
          fontSize: "17px",
          color: "#475569",
          lineHeight: "1.8",
          margin: "0 0 16px",
          maxWidth: "680px",
        },
      },
      {
        id: "rich-text-elem",
        type: "rich-text",
        label: "Rich Text",
        icon: "AlignLeft",
        description: "Markdown-powered rich content",
        defaultContent: "Format your content with **bold text**, *italics*, `inline code`, and [hyperlinks](https://example.com).\n\nUse multiple paragraphs to tell your story.",
        defaultStyles: {
          fontSize: "17px",
          color: "#374151",
          lineHeight: "1.8",
          maxWidth: "720px",
        },
      },
      {
        id: "list-elem",
        type: "list",
        label: "List",
        icon: "ListOrdered",
        description: "Bulleted or numbered list",
        defaultStyles: { color: "#374151", fontSize: "16px", lineHeight: "1.8" },
        defaultProps: {
          listType: "unordered",
          iconType: "check",
          items: [
            "Lightning-fast performance at any scale",
            "Enterprise-grade security built in",
            "Seamless integrations with 500+ tools",
            "24/7 dedicated support team",
          ],
          accentColor: "#6366f1",
        },
      },
      {
        id: "blockquote-elem",
        type: "blockquote",
        label: "Blockquote",
        icon: "Quote",
        description: "Styled pull quote with attribution",
        defaultContent: "Great design is not just what it looks like — it's how it makes you feel.",
        defaultStyles: {
          fontSize: "22px",
          fontStyle: "italic",
          color: "#1E293B",
          lineHeight: "1.6",
          paddingLeft: "24px",
          borderLeft: "4px solid #6366F1",
          margin: "32px 0",
        },
        defaultProps: { cite: "Steve Jobs, Apple", accentColor: "#6366f1" },
      },
      {
        id: "code-block-elem",
        type: "code-block",
        label: "Code Block",
        icon: "Terminal",
        description: "Syntax-highlighted code snippet",
        defaultContent: `// Deploy to production in one command
const deployment = await builder.deploy({
  project: "my-site",
  env: "production",
  regions: ["us-east", "eu-west", "ap-south"],
});

console.log(\`Deployed to \${deployment.url}\`);`,
        defaultStyles: {
          backgroundColor: "#0F172A",
          color: "#4ADE80",
          padding: "28px 32px",
          borderRadius: "16px",
          fontSize: "14px",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineHeight: "1.7",
          border: "1px solid #1E293B",
        },
        defaultProps: { language: "typescript" },
      },
      {
        id: "badge-elem",
        type: "badge",
        label: "Badge",
        icon: "Tag",
        description: "Status label or announcement pill",
        defaultContent: "New Feature",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "#EEF2FF",
          color: "#6366F1",
          padding: "6px 14px",
          borderRadius: "9999px",
          fontSize: "12px",
          fontWeight: "700",
          letterSpacing: "0.02em",
        },
        defaultProps: { variant: "soft", color: "indigo" },
      },
      {
        id: "eyebrow-elem",
        type: "eyebrow",
        label: "Eyebrow",
        icon: "Minus",
        description: "Small label above a heading",
        defaultContent: "Trusted by 10,000+ teams worldwide",
        defaultStyles: {
          fontSize: "12px",
          fontWeight: "700",
          color: "#6366F1",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          display: "block",
          marginBottom: "12px",
        },
        defaultProps: { accentColor: "#6366f1" },
      },
      {
        id: "alert-elem",
        type: "alert",
        label: "Alert",
        icon: "AlertCircle",
        description: "Contextual notification banner",
        defaultContent: "Your free trial expires in 3 days. Upgrade to keep access to all features.",
        defaultStyles: {
          padding: "16px 20px",
          borderRadius: "12px",
          fontSize: "14px",
          lineHeight: "1.6",
        },
        defaultProps: { alertType: "warning", title: "Heads up" },
      },
      {
        id: "kbd-elem",
        type: "kbd",
        label: "Keyboard Key",
        icon: "Keyboard",
        description: "Keyboard shortcut display",
        defaultContent: "⌘ K",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          padding: "4px 10px",
          borderRadius: "6px",
          backgroundColor: "#F8FAFC",
          border: "1px solid #E2E8F0",
          borderBottom: "3px solid #CBD5E1",
          fontSize: "13px",
          fontWeight: "600",
          fontFamily: "monospace",
          color: "#334155",
        },
      },
      {
        id: "number-display",
        type: "number-display",
        label: "Number Stat",
        icon: "Hash",
        description: "Big metric number with label",
        defaultContent: "99.9%",
        defaultStyles: {
          fontSize: "56px",
          fontWeight: "900",
          color: "#0F172A",
          letterSpacing: "-0.04em",
          lineHeight: "1",
        },
        defaultProps: { label: "Uptime SLA", accentColor: "#6366f1" },
      },
      {
        id: "text-link-elem",
        type: "text-link",
        label: "Text Link",
        icon: "Link",
        description: "Inline text hyperlink",
        defaultContent: "Read the full documentation →",
        defaultStyles: {
          color: "#6366F1",
          textDecoration: "none",
          fontWeight: "500",
          fontSize: "15px",
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
        },
        defaultProps: { href: "#", hoverUnderline: true },
      },
      {
        id: "gradient-text-elem",
        type: "gradient-text",
        label: "Gradient Text",
        icon: "Wand2",
        description: "Heading with vivid gradient fill",
        defaultContent: "Build the future.",
        defaultStyles: {
          fontSize: "64px",
          fontWeight: "900",
          letterSpacing: "-0.04em",
          lineHeight: "1.1",
          backgroundImage: "linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          display: "inline-block",
          margin: "0",
        },
        defaultProps: { gradientFrom: "#6366F1", gradientTo: "#EC4899" },
      },
      {
        id: "marquee-elem",
        type: "marquee",
        label: "Marquee",
        icon: "Repeat2",
        description: "Infinitely scrolling ticker text",
        defaultStyles: {
          overflow: "hidden",
          whiteSpace: "nowrap",
          padding: "20px 0",
          backgroundColor: "#0F172A",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
        },
        defaultProps: {
          speed: 30,
          items: ["⚡ Lightning Fast", "🔒 Enterprise Secure", "🌍 Global CDN", "🚀 One-Click Deploy", "📊 Real-Time Analytics", "🤖 AI-Powered"],
          separator: "  ·  ",
          color: "#94A3B8",
          fontSize: "14px",
          fontWeight: "600",
        },
      },
      {
        id: "highlight-text-elem",
        type: "highlight-text",
        label: "Highlight Text",
        icon: "Captions",
        description: "Text with colored marker highlight",
        defaultContent: "the most powerful platform",
        defaultStyles: {
          fontSize: "inherit",
          fontWeight: "inherit",
          color: "inherit",
          backgroundColor: "#FEF9C3",
          borderRadius: "4px",
          padding: "2px 6px",
          display: "inline",
        },
        defaultProps: { highlightColor: "#FEF9C3", textColor: "#713F12" },
      },
      {
        id: "code-block-elem",
        type: "code-block",
        label: "Code Block",
        icon: "Terminal",
        description: "Syntax-highlighted code snippet",
        defaultContent: `const response = await fetch('/api/generate', {\n  method: 'POST',\n  body: JSON.stringify({ prompt }),\n});\nconst { html } = await response.json();`,
        defaultStyles: {
          backgroundColor: "#0D1117",
          borderRadius: "16px",
          padding: "28px 32px",
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          fontSize: "14px",
          lineHeight: "1.8",
          color: "#E2E8F0",
          border: "1px solid rgba(255,255,255,0.08)",
          maxWidth: "640px",
          overflowX: "auto",
          whiteSpace: "pre",
          display: "block",
        },
        defaultProps: { language: "typescript", showCopyButton: true, showLineNumbers: true },
      },
      {
        id: "kbd-shortcut-elem",
        type: "kbd-shortcut",
        label: "Keyboard Shortcut",
        icon: "Keyboard",
        description: "Keyboard key badge or shortcut combo",
        defaultContent: "⌘ K",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#F1F5F9",
          border: "1px solid #CBD5E1",
          borderBottom: "2px solid #94A3B8",
          borderRadius: "8px",
          padding: "4px 10px",
          fontSize: "13px",
          fontWeight: "600",
          fontFamily: "'JetBrains Mono', monospace",
          color: "#374151",
          letterSpacing: "0.02em",
          userSelect: "none",
        },
        defaultProps: { keys: ["⌘", "K"] },
      },
      {
        id: "inline-label-elem",
        type: "inline-label",
        label: "Inline Label",
        icon: "Tag",
        description: "Small colored badge / category pill",
        defaultContent: "New Feature",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: "#EEF2FF",
          color: "#4F46E5",
          borderRadius: "9999px",
          padding: "4px 12px",
          fontSize: "12px",
          fontWeight: "700",
          letterSpacing: "0.04em",
          border: "1px solid #C7D2FE",
        },
        defaultProps: { dot: true, dotColor: "#6366F1", variant: "indigo" },
      },
    ],
  },

  // ── 3. Media ────────────────────────────────────────────────────────────────
  {
    id: "media",
    label: "Media",
    icon: Image,
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accentBorder: "border-emerald-400",
    elements: [
      {
        id: "logo-elem",
        type: "logo",
        label: "Logo",
        icon: "ImagePlus",
        description: "Brand logo for navbar or footer",
        defaultStyles: { height: "40px", width: "auto", display: "block" },
        defaultProps: { src: "", alt: "Brand logo", height: "40px", shape: "rounded", accentColor: "#6366f1" },
      },
      {
        id: "image-elem",
        type: "image",
        label: "Image",
        icon: "Image",
        description: "Responsive image with caption",
        defaultStyles: {
          width: "100%",
          height: "auto",
          borderRadius: "16px",
          objectFit: "cover",
          display: "block",
          boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
        },
        defaultProps: {
          src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200",
          alt: "Colorful abstract illustration",
          caption: "",
        },
      },
      {
        id: "video-elem",
        type: "video",
        label: "Video",
        icon: "Video",
        description: "Self-hosted video player",
        defaultStyles: {
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.12)",
          display: "block",
        },
        defaultProps: { src: "", autoplay: false, controls: true, loop: false },
      },
      {
        id: "embed-elem",
        type: "embed",
        label: "Embed",
        icon: "MonitorPlay",
        description: "YouTube / Vimeo / iframe embed",
        defaultStyles: {
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
        },
        defaultProps: { url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", aspectRatio: "16/9" },
      },
      {
        id: "audio-elem",
        type: "audio",
        label: "Audio",
        icon: "Music",
        description: "Audio player with controls",
        defaultContent: "Episode 42: The Future of Design Systems",
        defaultStyles: {
          width: "100%",
          padding: "20px",
          backgroundColor: "#F8FAFC",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
        },
        defaultProps: { src: "", autoplay: false },
      },
      {
        id: "icon-elem",
        type: "icon",
        label: "Icon",
        icon: "Sparkles",
        description: "Decorative icon or emoji",
        defaultContent: "⚡",
        defaultStyles: {
          fontSize: "40px",
          width: "72px",
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#EEF2FF",
          borderRadius: "20px",
          border: "1px solid #C7D2FE",
        },
      },
      {
        id: "svg-elem",
        type: "svg",
        label: "SVG",
        icon: "Shapes",
        description: "Inline SVG graphic",
        defaultStyles: {
          width: "64px",
          height: "64px",
          color: "#6366F1",
          display: "block",
        },
        defaultProps: { fill: "currentColor" },
      },
      {
        id: "lottie-elem",
        type: "lottie",
        label: "Lottie",
        icon: "Activity",
        description: "Lottie JSON animation",
        defaultStyles: { width: "100%", maxWidth: "480px", margin: "0 auto", display: "block" },
        defaultProps: { loop: true, autoplay: true },
      },
      {
        id: "avatar-elem",
        type: "avatar",
        label: "Avatar",
        icon: "UserCircle",
        description: "User avatar with name",
        defaultContent: "Sarah Chen",
        defaultStyles: { display: "inline-flex", alignItems: "center", gap: "12px" },
        defaultProps: {
          src: "https://i.pravatar.cc/80?u=sarah",
          size: "md",
          showName: true,
          subtitle: "Head of Design",
        },
      },
      {
        id: "avatar-group-elem",
        type: "avatar-group",
        label: "Avatar Group",
        icon: "Users",
        description: "Stacked avatar row with count",
        defaultStyles: { display: "inline-flex", alignItems: "center", gap: "8px" },
        defaultProps: {
          count: 5,
          label: "+2,400 joined this week",
          size: "sm",
        },
      },
      {
        id: "gallery-elem",
        type: "gallery",
        label: "Gallery",
        icon: "GalleryHorizontal",
        description: "Masonry or grid photo gallery",
        defaultStyles: { width: "100%", borderRadius: "12px", overflow: "hidden" },
        defaultProps: { images: [], columns: 3, gap: 16 },
      },
    ],
  },

  // ── 4. UI Components ────────────────────────────────────────────────────────
  {
    id: "components",
    label: "Components",
    icon: Layers,
    color: "bg-indigo-100",
    iconColor: "text-indigo-600",
    accentBorder: "border-indigo-400",
    elements: [
      {
        id: "button-elem",
        type: "button",
        label: "Button",
        icon: "MousePointer",
        description: "Primary action button",
        defaultContent: "Get Started Free →",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
          backgroundColor: "#6366F1",
          color: "#FFFFFF",
          padding: "14px 28px",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "15px",
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 14px rgba(99,102,241,0.35)",
          letterSpacing: "-0.01em",
        },
        defaultProps: { variant: "solid", accentColor: "#6366f1", fullWidth: false },
      },
      {
        id: "button-group-elem",
        type: "button-group",
        label: "Button Group",
        icon: "ToggleLeft",
        description: "Linked segmented button cluster",
        defaultStyles: { display: "inline-flex", gap: "0" },
        defaultProps: { accentColor: "#6366f1" },
      },
      {
        id: "accordion-elem",
        type: "accordion",
        label: "Accordion",
        icon: "AlignJustify",
        description: "Collapsible FAQ-style panels",
        defaultStyles: { width: "100%", maxWidth: "720px" },
        defaultProps: {
          multiple: false,
          accentColor: "#6366f1",
          items: [
            { question: "How does pricing work?", answer: "We offer flexible monthly and annual plans. Annual billing saves you 20% compared to monthly." },
            { question: "Can I cancel anytime?", answer: "Absolutely. There are no lock-in contracts. Cancel from your dashboard with one click." },
            { question: "Do you offer a free trial?", answer: "Yes! Every plan comes with a 14-day free trial, no credit card required." },
          ],
        },
      },
      {
        id: "tabs-elem",
        type: "tabs",
        label: "Tabs",
        icon: "LayoutTemplate",
        description: "Tabbed content switcher",
        defaultStyles: { width: "100%" },
        defaultProps: {
          accentColor: "#6366f1",
          tabs: [
            { label: "Overview", content: "Get a complete overview of all features and capabilities." },
            { label: "Features", content: "Deep dive into the powerful features that set us apart." },
            { label: "Pricing", content: "Simple, transparent pricing with no hidden fees." },
          ],
        },
      },
      {
        id: "steps-elem",
        type: "steps",
        label: "Steps",
        icon: "ListOrdered",
        description: "Multi-step progress indicator",
        defaultStyles: { width: "100%" },
        defaultProps: {
          direction: "horizontal",
          currentStep: 2,
          steps: ["Account Setup", "Choose Plan", "Customize", "Launch"],
        },
      },
      {
        id: "timeline-elem",
        type: "timeline",
        label: "Timeline",
        icon: "Clock",
        description: "Vertical chronological timeline",
        defaultStyles: { width: "100%", maxWidth: "600px" },
        defaultProps: {
          accentColor: "#6366f1",
          items: [
            { date: "Jan 2022", title: "Company Founded", description: "Started with a small team of 5 engineers." },
            { date: "Mar 2023", title: "Series A Funding", description: "Raised $12M to accelerate growth." },
            { date: "Sep 2024", title: "1M Users", description: "Reached one million active users worldwide." },
            { date: "2026", title: "Enterprise Launch", description: "Released enterprise tier for Fortune 500 companies." },
          ],
        },
      },
      {
        id: "progress-elem",
        type: "progress",
        label: "Progress Bar",
        icon: "BarChart3",
        description: "Animated progress / loading bar",
        defaultContent: "Project Completion",
        defaultStyles: { width: "100%", maxWidth: "480px" },
        defaultProps: { value: 72, max: 100, accentColor: "#6366f1", showLabel: true },
      },
      {
        id: "carousel-elem",
        type: "carousel",
        label: "Carousel",
        icon: "GalleryHorizontal",
        description: "Auto-playing image/content slider",
        defaultStyles: { width: "100%", overflow: "hidden", borderRadius: "16px" },
        defaultProps: { autoplay: true, pagination: true, interval: 4000 },
      },
      {
        id: "countdown-elem",
        type: "countdown",
        label: "Countdown",
        icon: "Timer",
        description: "Live countdown to an event",
        defaultStyles: {
          textAlign: "center",
          padding: "40px",
          backgroundColor: "#0F172A",
          borderRadius: "24px",
          color: "#FFFFFF",
        },
        defaultProps: { targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
      },
      {
        id: "chart-elem",
        type: "chart",
        label: "Chart",
        icon: "BarChart3",
        description: "Data visualization chart",
        defaultStyles: {
          width: "100%",
          height: "320px",
          backgroundColor: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          padding: "24px",
        },
        defaultProps: {
          chartType: "bar",
          accentColor: "#6366f1",
          data: [
            { label: "Jan", value: 42 },
            { label: "Feb", value: 68 },
            { label: "Mar", value: 55 },
            { label: "Apr", value: 89 },
            { label: "May", value: 74 },
            { label: "Jun", value: 110 },
          ],
        },
      },
      {
        id: "map-elem",
        type: "map",
        label: "Map",
        icon: "Map",
        description: "Interactive embedded map",
        defaultStyles: {
          width: "100%",
          height: "420px",
          borderRadius: "16px",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        },
        defaultProps: { lat: 37.7749, lng: -122.4194, zoom: 13 },
      },
      {
        id: "rating-elem",
        type: "rating",
        label: "Star Rating",
        icon: "Star",
        description: "5-star rating widget",
        defaultStyles: { display: "inline-flex", alignItems: "center", gap: "4px" },
        defaultProps: { value: 4.8, max: 5, accentColor: "#F59E0B", readonly: false, showValue: true },
      },
      {
        id: "feature-card-elem",
        type: "feature-card",
        label: "Feature Card",
        icon: "Zap",
        description: "Icon + title + description card",
        defaultStyles: {
          padding: "36px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "380px",
        },
        defaultProps: {
          icon: "⚡",
          iconBg: "#EEF2FF",
          title: "Lightning Performance",
          description: "Sub-10ms response times globally with our edge-first architecture built for demanding workloads.",
          accentColor: "#6366F1",
          linkText: "Learn more →",
        },
      },
      {
        id: "social-proof-elem",
        type: "social-proof",
        label: "Social Proof",
        icon: "Users",
        description: "Avatar stack + member count",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "12px",
          padding: "10px 18px",
          backgroundColor: "#F8FAFC",
          borderRadius: "9999px",
          border: "1px solid #E2E8F0",
        },
        defaultProps: {
          count: 4,
          label: "Join 12,000+ developers",
          sublabel: "No credit card required",
          accentColor: "#6366F1",
        },
      },
      {
        id: "testimonial-card-elem",
        type: "testimonial-card",
        label: "Testimonial Card",
        icon: "MessageSquare",
        description: "Single quote + author card",
        defaultStyles: {
          padding: "40px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 8px 32px rgba(0,0,0,0.05)",
          maxWidth: "480px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        },
        defaultProps: {
          quote: "Switching to this platform cut our deployment time from 2 hours to under 3 minutes. It's the best engineering decision we made this year.",
          authorName: "Sarah Chen",
          authorRole: "CTO @ Acme Corp",
          rating: 5,
          accentColor: "#6366F1",
        },
      },
      {
        id: "toast-elem",
        type: "toast",
        label: "Toast",
        icon: "Bell",
        description: "Notification / feedback toast",
        defaultStyles: {
          padding: "16px 20px",
          backgroundColor: "#0F172A",
          borderRadius: "14px",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          display: "inline-flex",
          alignItems: "center",
          gap: "14px",
          maxWidth: "380px",
        },
        defaultProps: {
          title: "Deployment successful",
          message: "Your site is live at acme.buildstack.app",
          type: "success",
          accentColor: "#10B981",
          dismissible: true,
        },
      },
      {
        id: "tooltip-elem",
        type: "tooltip",
        label: "Tooltip",
        icon: "HelpCircle",
        description: "Hover-triggered info tooltip",
        defaultStyles: {
          display: "inline-block",
          position: "relative",
        },
        defaultProps: {
          content: "This feature is available on Pro and Enterprise plans.",
          position: "top",
          accentColor: "#0F172A",
          triggerText: "Hover me",
        },
      },
      {
        id: "tag-cloud-elem",
        type: "tag-cloud",
        label: "Tag Cloud",
        icon: "Tags",
        description: "Group of keyword / tech tags",
        defaultStyles: {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        },
        defaultProps: {
          tags: ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "Vercel", "React", "Node.js"],
          variant: "outline",
          accentColor: "#6366F1",
        },
      },
      {
        id: "copy-btn-elem",
        type: "copy-btn",
        label: "Copy Button",
        icon: "Copy",
        description: "Click-to-copy code or text",
        defaultContent: "npm install @buildstack/cli",
        defaultStyles: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "12px",
          padding: "14px 18px",
          backgroundColor: "#0F172A",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,0.08)",
          fontSize: "14px",
          fontFamily: "'JetBrains Mono', monospace",
          color: "#94A3B8",
          maxWidth: "400px",
        },
        defaultProps: { accentColor: "#6366F1", successMessage: "Copied!" },
      },
      {
        id: "notification-badge-elem",
        type: "notification-badge",
        label: "Notification Badge",
        icon: "Bell",
        description: "Icon with unread count bubble",
        defaultStyles: {
          position: "relative",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: "44px",
          height: "44px",
          backgroundColor: "#F8FAFC",
          borderRadius: "12px",
          border: "1px solid #E2E8F0",
          cursor: "pointer",
        },
        defaultProps: { count: 3, accentColor: "#EF4444", iconColor: "#374151" },
      },
      {
        id: "scroll-progress-elem",
        type: "scroll-progress",
        label: "Scroll Progress",
        icon: "TrendingUp",
        description: "Page scroll progress bar",
        defaultStyles: {
          position: "fixed",
          top: "0",
          left: "0",
          height: "3px",
          backgroundColor: "#6366F1",
          zIndex: "9999",
          transition: "width 0.1s ease",
        },
        defaultProps: { accentColor: "#6366F1", height: "3px" },
      },
      {
        id: "comparison-table-elem",
        type: "comparison-table",
        label: "Comparison Table",
        icon: "Table",
        description: "Feature comparison vs competitors",
        defaultStyles: {
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
        },
        defaultProps: {
          accentColor: "#6366F1",
          ourName: "Webperia",
          competitors: ["Competitor A", "Competitor B"],
          features: [
            { name: "Unlimited Projects", us: true, a: false, b: false },
            { name: "Custom Domains", us: true, a: true, b: false },
            { name: "AI Assistant", us: true, a: false, b: false },
            { name: "Priority Support", us: true, a: true, b: true },
            { name: "White-label", us: true, a: false, b: false },
          ],
        },
      },
      {
        id: "alert-elem",
        type: "alert",
        label: "Alert Banner",
        icon: "AlertCircle",
        description: "Info / success / warning / error alert",
        defaultContent: "Your site was published successfully.",
        defaultStyles: {
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
          padding: "16px 20px",
          borderRadius: "14px",
          backgroundColor: "#ECFDF5",
          border: "1px solid #6EE7B7",
          maxWidth: "520px",
          width: "100%",
        },
        defaultProps: { variant: "success", icon: "✓", dismissible: true, accentColor: "#10B981" },
      },
      {
        id: "accordion-item-elem",
        type: "accordion-item",
        label: "Accordion Item",
        icon: "ChevronDown",
        description: "Expandable question / answer row",
        defaultStyles: {
          width: "100%",
          maxWidth: "640px",
          borderBottom: "1px solid #E2E8F0",
          overflow: "hidden",
        },
        defaultProps: {
          question: "How does the 14-day free trial work?",
          answer: "Your trial starts immediately — no credit card required. You get full access to all Pro features for 14 days. After the trial, you can choose a plan or your account reverts to the free tier.",
          defaultOpen: false,
          accentColor: "#6366F1",
        },
      },
      {
        id: "progress-bar-elem",
        type: "progress-bar",
        label: "Progress Bar",
        icon: "Activity",
        description: "Labeled skill / progress bar",
        defaultStyles: {
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          width: "100%",
          maxWidth: "420px",
        },
        defaultProps: {
          label: "TypeScript",
          value: 92,
          showPercent: true,
          accentColor: "#6366F1",
          trackColor: "#E0E7FF",
          height: "8px",
          borderRadius: "9999px",
        },
      },
    ],
  },

  // ── 5. Forms ────────────────────────────────────────────────────────────────
  {
    id: "forms",
    label: "Forms",
    icon: FormInput,
    color: "bg-rose-100",
    iconColor: "text-rose-600",
    accentBorder: "border-rose-400",
    elements: [
      {
        id: "form-wrapper",
        type: "form",
        label: "Form Wrapper",
        icon: "Layout",
        description: "Submittable form container",
        defaultStyles: {
          width: "100%",
          maxWidth: "560px",
          padding: "48px",
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          boxShadow: "0 8px 40px rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        },
        defaultProps: { bgType: "white", successMessage: "You're in! We'll be in touch soon." },
      },
      {
        id: "input-elem",
        type: "input",
        label: "Text Input",
        icon: "Type",
        description: "Single-line text field",
        defaultStyles: {
          width: "100%",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1.5px solid #E2E8F0",
          fontSize: "15px",
          color: "#1E293B",
          backgroundColor: "#F8FAFC",
          outline: "none",
        },
        defaultProps: { inputType: "text", placeholder: "Enter your full name", label: "Full Name", required: true },
      },
      {
        id: "textarea-elem",
        type: "textarea",
        label: "Textarea",
        icon: "AlignJustify",
        description: "Multi-line message field",
        defaultStyles: {
          width: "100%",
          padding: "14px 16px",
          borderRadius: "10px",
          border: "1.5px solid #E2E8F0",
          fontSize: "15px",
          color: "#1E293B",
          backgroundColor: "#F8FAFC",
          resize: "vertical",
          minHeight: "120px",
        },
        defaultProps: { placeholder: "Tell us more about your project…", rows: 5, label: "Message", required: true },
      },
      {
        id: "select-elem",
        type: "select",
        label: "Select",
        icon: "ChevronDown",
        description: "Dropdown select field",
        defaultStyles: {
          width: "100%",
          padding: "12px 16px",
          borderRadius: "10px",
          border: "1.5px solid #E2E8F0",
          fontSize: "15px",
          backgroundColor: "#F8FAFC",
          color: "#1E293B",
        },
        defaultProps: { options: ["Starter — Free", "Professional — $49/mo", "Enterprise — Custom"], label: "Choose your plan" },
      },
      {
        id: "multi-select-elem",
        type: "multi-select",
        label: "Multi Select",
        icon: "Layers",
        description: "Multiple-selection field",
        defaultStyles: { width: "100%" },
        defaultProps: { options: ["Design", "Engineering", "Marketing", "Sales", "Operations"], label: "Areas of interest", accentColor: "#6366f1" },
      },
      {
        id: "checkbox-elem",
        type: "checkbox",
        label: "Checkbox",
        icon: "CheckSquare",
        description: "Checkbox with label",
        defaultContent: "I agree to the Terms of Service and Privacy Policy",
        defaultStyles: { display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "#374151", cursor: "pointer" },
        defaultProps: { checked: false, accentColor: "#6366f1" },
      },
      {
        id: "radio-elem",
        type: "radio-group",
        label: "Radio Group",
        icon: "CheckSquare",
        description: "Single-choice option group",
        defaultContent: "Select your billing cycle",
        defaultStyles: { display: "flex", flexDirection: "column", gap: "12px" },
        defaultProps: { options: ["Monthly billing", "Annual billing — save 20%"], accentColor: "#6366f1" },
      },
      {
        id: "toggle-elem",
        type: "toggle",
        label: "Toggle / Switch",
        icon: "ToggleLeft",
        description: "On/off toggle switch",
        defaultContent: "Enable email notifications",
        defaultStyles: { display: "flex", alignItems: "center", gap: "12px", fontSize: "15px", color: "#374151" },
        defaultProps: { checked: true, accentColor: "#6366f1" },
      },
      {
        id: "date-picker-elem",
        type: "date-picker",
        label: "Date Picker",
        icon: "Calendar",
        description: "Calendar date picker",
        defaultStyles: { width: "100%", maxWidth: "280px" },
        defaultProps: { label: "Select a date", accentColor: "#6366f1" },
      },
      {
        id: "upload-elem",
        type: "file-upload",
        label: "File Upload",
        icon: "Upload",
        description: "Drag & drop file upload zone",
        defaultStyles: {
          width: "100%",
          padding: "40px",
          borderRadius: "16px",
          border: "2px dashed #C7D2FE",
          backgroundColor: "#EEF2FF",
          textAlign: "center",
          cursor: "pointer",
        },
        defaultProps: { label: "Drop files here or click to browse", accept: "image/*,.pdf", maxSize: "10MB" },
      },
      {
        id: "slider-elem",
        type: "slider",
        label: "Range Slider",
        icon: "SlidersHorizontal",
        description: "Numeric range input slider",
        defaultStyles: { width: "100%", maxWidth: "400px" },
        defaultProps: { min: 0, max: 100, defaultValue: 65, accentColor: "#6366f1", showValue: true, label: "Budget ($k)" },
      },
      {
        id: "search-input-elem",
        type: "search-input",
        label: "Search Input",
        icon: "Search",
        description: "Live search with suggestions",
        defaultStyles: {
          width: "100%",
          maxWidth: "480px",
          padding: "14px 20px 14px 48px",
          borderRadius: "12px",
          border: "1.5px solid #E2E8F0",
          fontSize: "15px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        },
        defaultProps: { placeholder: "Search anything…", accentColor: "#6366f1" },
      },
      {
        id: "otp-input-elem",
        type: "otp-input",
        label: "OTP / PIN Input",
        icon: "KeyRound",
        description: "6-digit one-time passcode",
        defaultStyles: { display: "flex", gap: "12px" },
        defaultProps: { length: 6, accentColor: "#6366f1" },
      },
    ],
  },

  // ── 6. Navigation ───────────────────────────────────────────────────────────
  {
    id: "navigation",
    label: "Navigation",
    icon: Navigation,
    color: "bg-sky-100",
    iconColor: "text-sky-600",
    accentBorder: "border-sky-400",
    elements: [
      {
        id: "footer-elem",
        type: "footer",
        label: "Footer",
        icon: "ArrowUpDown",
        description: "Full-width site footer",
        defaultStyles: {
          width: "100%",
          padding: "64px 40px 40px",
          backgroundColor: "#0F172A",
          color: "#94A3B8",
          borderTop: "1px solid #1E293B",
        },
        defaultProps: {
          brandName: "Acme Inc.",
          tagline: "Building the digital backbone for modern companies.",
          copyright: "© 2026 Acme Inc. All rights reserved.",
          links: [
            { label: "Product", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Blog", href: "#" },
            { label: "Careers", href: "#" },
          ],
        },
      },
      {
        id: "breadcrumbs-elem",
        type: "breadcrumbs",
        label: "Breadcrumbs",
        icon: "ChevronRight",
        description: "Page location breadcrumb trail",
        defaultStyles: {
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "14px",
          color: "#64748B",
          padding: "12px 0",
        },
        defaultProps: { items: ["Home", "Products", "Enterprise Plan"], separator: "/" },
      },
      {
        id: "pagination-elem",
        type: "pagination",
        label: "Pagination",
        icon: "Rows3",
        description: "Page navigation controls",
        defaultStyles: { display: "flex", alignItems: "center", gap: "4px" },
        defaultProps: { totalPages: 8, currentPage: 3, accentColor: "#6366f1", showEdge: true },
      },
      {
        id: "mobile-menu-elem",
        type: "mobile-menu",
        label: "Mobile Menu",
        icon: "Menu",
        description: "Responsive hamburger nav menu",
        defaultStyles: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px" },
        defaultProps: {
          brandName: "Acme",
          accentColor: "#6366f1",
          links: [{ label: "Product", href: "#" }, { label: "Pricing", href: "#" }, { label: "Blog", href: "#" }],
        },
      },
      {
        id: "dropdown-menu-elem",
        type: "dropdown-menu",
        label: "Dropdown Menu",
        icon: "ChevronDown",
        description: "Contextual action dropdown",
        defaultStyles: { position: "relative", display: "inline-block" },
        defaultProps: {
          label: "My Account",
          items: ["View Profile", "Account Settings", "Team & Billing", "—", "Sign out"],
        },
      },
      {
        id: "navbar-elem",
        type: "navbar",
        label: "Navbar",
        icon: "Navigation",
        description: "Sticky responsive navbar",
        defaultStyles: {
          width: "100%",
          position: "sticky",
          top: "0",
          zIndex: "50",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "0 1px 0 rgba(0,0,0,0.05)",
        },
        defaultProps: {
          brandName: "Acme",
          accentColor: "#6366f1",
          bgType: "white",
          ctaText: "Get started free",
          navLinks: [
            { label: "Product", href: "#" },
            { label: "Pricing", href: "#" },
            { label: "Blog", href: "#" },
          ],
        },
      },
      {
        id: "mega-menu-elem",
        type: "mega-menu",
        label: "Mega Menu",
        icon: "LayoutGrid",
        description: "Multi-column dropdown menu",
        defaultStyles: {
          width: "100%",
          backgroundColor: "#FFFFFF",
          borderBottom: "1px solid #E2E8F0",
        },
        defaultProps: {
          brandName: "Acme",
          accentColor: "#6366f1",
          columns: [
            { title: "Product", links: ["Features", "Integrations", "Changelog", "Roadmap"] },
            { title: "Resources", links: ["Documentation", "Blog", "Guides", "Status"] },
            { title: "Company", links: ["About", "Careers", "Press", "Contact"] },
          ],
        },
      },
    ],
  },

  // ── 7. Commerce & Advanced ──────────────────────────────────────────────────
  {
    id: "commerce",
    label: "Commerce",
    icon: ShoppingCart,
    color: "bg-amber-100",
    iconColor: "text-amber-600",
    accentBorder: "border-amber-400",
    elements: [
      {
        id: "product-card",
        type: "product-card",
        label: "Product Card",
        icon: "ShoppingBag",
        description: "E-commerce product tile",
        defaultStyles: {
          width: "100%",
          maxWidth: "320px",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
        },
        defaultProps: {
          name: "Merino Wool Jacket",
          price: 189.00,
          originalPrice: 249.00,
          rating: 4.7,
          reviewCount: 312,
          badge: "Sale",
          accentColor: "#6366F1",
        },
      },
      {
        id: "price-display",
        type: "price-display",
        label: "Price",
        icon: "DollarSign",
        description: "Price with optional strike-through",
        defaultStyles: {
          display: "flex",
          alignItems: "baseline",
          gap: "10px",
        },
        defaultProps: { price: "$49.00", originalPrice: "$89.00", accentColor: "#111827" },
      },
      {
        id: "add-to-cart",
        type: "add-to-cart",
        label: "Add to Cart",
        icon: "ShoppingCart",
        description: "Add-to-cart action button",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          backgroundColor: "#111827",
          color: "#FFFFFF",
          padding: "14px 28px",
          borderRadius: "10px",
          fontWeight: "600",
          fontSize: "15px",
          cursor: "pointer",
          border: "none",
          width: "100%",
          justifyContent: "center",
        },
        defaultProps: { buttonText: "Add to Cart", accentColor: "#111827" },
      },
      {
        id: "pricing-card",
        type: "pricing-card",
        label: "Pricing Card",
        icon: "CreditCard",
        description: "SaaS pricing tier card",
        defaultStyles: {
          width: "100%",
          maxWidth: "360px",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          padding: "40px 36px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
        },
        defaultProps: {
          planName: "Professional",
          price: "$49",
          period: "per month",
          description: "Perfect for growing teams who need advanced features.",
          features: [
            "Unlimited projects",
            "Custom domains",
            "Priority support",
            "Analytics dashboard",
            "API access",
          ],
          accentColor: "#6366f1",
          highlighted: true,
          badge: "Most Popular",
        },
      },
      {
        id: "metric-card",
        type: "metric-card",
        label: "Metric Card",
        icon: "Activity",
        description: "KPI metric with trend indicator",
        defaultStyles: {
          width: "100%",
          maxWidth: "280px",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          padding: "28px",
          backgroundColor: "#FFFFFF",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        },
        defaultProps: {
          label: "Monthly Revenue",
          value: "$84.2k",
          trend: "up",
          change: "+23.1%",
          period: "vs last month",
          accentColor: "#10B981",
        },
      },
      {
        id: "data-table",
        type: "data-table",
        label: "Data Table",
        icon: "Table",
        description: "Sortable data grid with rows",
        defaultStyles: {
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
        },
        defaultProps: {
          columns: ["Customer", "Plan", "Status", "MRR"],
          rows: [
            ["Acme Corp", "Enterprise", "Active", "$1,299"],
            ["TechFlow", "Pro", "Active", "$299"],
            ["Startup Labs", "Starter", "Trial", "$49"],
          ],
          accentColor: "#6366f1",
        },
      },
      {
        id: "cart-elem",
        type: "cart",
        label: "Cart",
        icon: "ShoppingCart",
        description: "Shopping cart with dropdown",
        defaultStyles: {},
        defaultProps: { cartStyle: "dropdown", currency: "USD", checkoutUrl: "/checkout" },
      },
      {
        id: "wishlist-btn-elem",
        type: "wishlist-btn",
        label: "Wishlist Button",
        icon: "Heart",
        description: "Save to wishlist heart button",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "10px 20px",
          borderRadius: "10px",
          border: "1.5px solid #E2E8F0",
          fontSize: "14px",
          fontWeight: "500",
          color: "#374151",
          cursor: "pointer",
          backgroundColor: "#FFFFFF",
        },
        defaultProps: { accentColor: "#EF4444", productId: "" },
      },
      {
        id: "stock-indicator-elem",
        type: "stock-indicator",
        label: "Stock Status",
        icon: "Package",
        description: "Inventory availability badge",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          fontSize: "13px",
          fontWeight: "600",
        },
        defaultProps: { stock: 8, lowStockThreshold: 10, accentColor: "#10B981" },
      },
      {
        id: "coupon-code-elem",
        type: "coupon-code",
        label: "Coupon Code",
        icon: "Percent",
        description: "Promo / discount code input",
        defaultStyles: {
          display: "flex",
          gap: "8px",
          width: "100%",
          maxWidth: "380px",
        },
        defaultProps: { placeholder: "Enter promo code", accentColor: "#6366f1", buttonText: "Apply" },
      },
      {
        id: "product-reviews-elem",
        type: "product-reviews",
        label: "Product Reviews",
        icon: "Star",
        description: "Customer reviews with star ratings",
        defaultStyles: { width: "100%", maxWidth: "640px" },
        defaultProps: { accentColor: "#F59E0B", showWriteReview: true, averageRating: 4.8, totalReviews: 342 },
      },
      {
        id: "product-gallery-elem",
        type: "product-gallery",
        label: "Product Gallery",
        icon: "GalleryHorizontal",
        description: "Product image gallery with thumbnails",
        defaultStyles: { width: "100%" },
        defaultProps: { images: [], thumbnailPosition: "bottom", accentColor: "#6366f1" },
      },
      {
        id: "quantity-selector-elem",
        type: "quantity-selector",
        label: "Quantity",
        icon: "RefreshCw",
        description: "Product quantity stepper",
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          border: "1.5px solid #E2E8F0",
          borderRadius: "10px",
          overflow: "hidden",
        },
        defaultProps: { min: 1, max: 99, defaultValue: 1, accentColor: "#6366f1" },
      },
      {
        id: "product-specs-elem",
        type: "product-specs",
        label: "Product Specs",
        icon: "NotepadText",
        description: "Spec / details table for products",
        defaultStyles: {
          width: "100%",
          borderRadius: "16px",
          overflow: "hidden",
          border: "1px solid #E2E8F0",
        },
        defaultProps: {
          specs: [
            { label: "Material", value: "100% Merino Wool" },
            { label: "Weight", value: "320g / m²" },
            { label: "Fit", value: "Regular fit" },
            { label: "Care", value: "Machine wash cold" },
            { label: "Origin", value: "Made in Portugal" },
          ],
        },
      },
      {
        id: "size-selector-elem",
        type: "size-selector",
        label: "Size Selector",
        icon: "ScanLine",
        description: "Clickable size variant picker",
        defaultStyles: {
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
        },
        defaultProps: {
          sizes: ["XS", "S", "M", "L", "XL", "2XL"],
          accentColor: "#111827",
          label: "Select Size",
        },
      },
      {
        id: "order-summary-elem",
        type: "order-summary",
        label: "Order Summary",
        icon: "Briefcase",
        description: "Cart totals + checkout button",
        defaultStyles: {
          padding: "32px",
          backgroundColor: "#F8FAFC",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          maxWidth: "380px",
          width: "100%",
        },
        defaultProps: {
          items: [
            { name: "Merino Wool Jacket", qty: 1, price: "$189.00" },
            { name: "Canvas Tote Bag", qty: 2, price: "$48.00" },
          ],
          subtotal: "$237.00",
          shipping: "Free",
          total: "$237.00",
          accentColor: "#111827",
        },
      },
    ],
  },

  // ── 8. CMS ─────────────────────────────────────────────────────────────────
  {
    id: "cms",
    label: "CMS",
    icon: Database,
    color: "bg-teal-100",
    iconColor: "text-teal-600",
    accentBorder: "border-teal-400",
    elements: [
      {
        id: "cms-list",
        type: "cms-list",
        label: "CMS List",
        icon: "LayoutList",
        description: "Dynamic collection item list",
        defaultStyles: {
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
        },
        defaultProps: { collectionSlug: "", layout: "cards", limit: 6, titleField: "", imageField: "", descriptionField: "", showFields: [] },
      },
      {
        id: "cms-item-elem",
        type: "cms-item",
        label: "CMS Item",
        icon: "BookmarkCheck",
        description: "Single CMS collection item",
        defaultStyles: {
          width: "100%",
          padding: "32px",
          borderRadius: "16px",
          border: "1px solid #E2E8F0",
          backgroundColor: "#FFFFFF",
        },
        defaultProps: { collectionSlug: "", itemId: "", showFields: [] },
      },
    ],
  },

  // ── 9. Content Blocks ───────────────────────────────────────────────────────
  {
    id: "content-blocks",
    label: "Content Blocks",
    icon: LayoutDashboard,
    color: "bg-orange-100",
    iconColor: "text-orange-600",
    accentBorder: "border-orange-400",
    elements: [
      {
        id: "blog-card-elem",
        type: "blog-card",
        label: "Blog Card",
        icon: "Newspaper",
        description: "Article card with image + meta + title",
        defaultStyles: {
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          boxShadow: "0 4px 16px rgba(0,0,0,0.05)",
          maxWidth: "380px",
          display: "flex",
          flexDirection: "column",
        },
        defaultProps: {
          title: "The architecture behind 1 billion daily requests",
          excerpt: "A deep dive into how we built a distributed system that handles massive scale without sacrificing latency.",
          category: "Engineering",
          readTime: "8 min read",
          date: "Apr 2, 2026",
          accentColor: "#6366F1",
        },
      },
      {
        id: "team-card-elem",
        type: "team-card",
        label: "Team Card",
        icon: "CircleUserRound",
        description: "Member card with avatar + role + bio",
        defaultStyles: {
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          padding: "36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
          maxWidth: "280px",
        },
        defaultProps: {
          name: "Alex Kim",
          role: "CEO & Co-Founder",
          bio: "Previously VP Engineering at Stripe. 15+ years building products that scale.",
          initials: "AK",
          accentColor: "#6366F1",
          socialLinks: [{ type: "twitter", href: "#" }, { type: "linkedin", href: "#" }],
        },
      },
      {
        id: "profile-card-elem",
        type: "profile-card",
        label: "Profile Card",
        icon: "CircleUserRound",
        description: "Full bio profile with social links",
        defaultStyles: {
          backgroundColor: "#0F172A",
          borderRadius: "24px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "340px",
          border: "1px solid rgba(255,255,255,0.06)",
        },
        defaultProps: {
          name: "Jamie Park",
          username: "@jamiepark",
          role: "Full-Stack Engineer",
          bio: "Open-source contributor. Ex-GitHub. Building in public.",
          initials: "JP",
          avatarColor: "#10B981",
          followers: "12.4k",
          following: "348",
          accentColor: "#10B981",
        },
      },
      {
        id: "service-card-elem",
        type: "service-card",
        label: "Service Card",
        icon: "Briefcase",
        description: "Agency service offering card",
        defaultStyles: {
          backgroundColor: "#F8FAFC",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          maxWidth: "360px",
        },
        defaultProps: {
          icon: "🎨",
          iconBg: "#EEF2FF",
          title: "Product Design",
          description: "End-to-end UX/UI design, from research and wireframes to polished design systems.",
          features: ["User Research", "Design Systems", "Prototyping"],
          linkText: "Explore →",
          accentColor: "#6366F1",
        },
      },
      {
        id: "changelog-item-elem",
        type: "changelog-item",
        label: "Changelog Item",
        icon: "BadgeCheck",
        description: "Version update entry with tag",
        defaultStyles: {
          display: "flex",
          flexDirection: "row",
          gap: "24px",
          padding: "32px 0",
          borderBottom: "1px solid #F1F5F9",
          maxWidth: "720px",
          width: "100%",
        },
        defaultProps: {
          version: "v3.2.0",
          date: "Apr 10, 2026",
          title: "AI-powered site generation",
          description: "Generate complete landing pages from a single prompt. Supports 50+ section types and all design styles.",
          type: "feature",
          accentColor: "#6366F1",
        },
      },
      {
        id: "stat-card-elem",
        type: "stat-card",
        label: "Stat Card",
        icon: "BarChart2",
        description: "Standalone metric with icon + label",
        defaultStyles: {
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          padding: "32px",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "240px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
        },
        defaultProps: {
          icon: "📈",
          iconBg: "#ECFDF5",
          value: "2.4B",
          label: "Requests per day",
          trend: "+18% this week",
          accentColor: "#10B981",
        },
      },
      {
        id: "app-download-elem",
        type: "app-download",
        label: "App Download",
        icon: "Smartphone",
        description: "App Store + Play Store buttons",
        defaultStyles: {
          display: "flex",
          flexWrap: "wrap",
          gap: "12px",
          alignItems: "center",
        },
        defaultProps: {
          appStoreUrl: "#",
          playStoreUrl: "#",
          variant: "dark",
          accentColor: "#111827",
        },
      },
      {
        id: "video-play-elem",
        type: "video-play",
        label: "Video Play Button",
        icon: "Play",
        description: "Thumbnail with centered play button",
        defaultStyles: {
          width: "100%",
          borderRadius: "20px",
          overflow: "hidden",
          position: "relative",
          cursor: "pointer",
          aspectRatio: "16/9",
          backgroundColor: "#0F172A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        defaultProps: {
          videoUrl: "",
          thumbnailUrl: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&q=80&w=1200",
          accentColor: "#6366F1",
          buttonSize: "lg",
        },
      },
      {
        id: "breadcrumbs-bar-elem",
        type: "breadcrumbs-bar",
        label: "Breadcrumbs Bar",
        icon: "PanelTopOpen",
        description: "Full-width page path breadcrumb",
        defaultStyles: {
          width: "100%",
          padding: "12px 40px",
          backgroundColor: "#F8FAFC",
          borderBottom: "1px solid #E2E8F0",
          display: "flex",
          alignItems: "center",
        },
        defaultProps: {
          items: [{ label: "Home", href: "#" }, { label: "Blog", href: "#" }, { label: "Engineering" }],
          separator: "/",
          accentColor: "#6366F1",
        },
      },
      {
        id: "timeline-item-elem",
        type: "timeline-item",
        label: "Timeline Item",
        icon: "GanttChart",
        description: "Vertical timeline event with icon + connector",
        defaultStyles: {
          display: "flex",
          flexDirection: "row",
          gap: "20px",
          position: "relative",
          paddingBottom: "40px",
          maxWidth: "600px",
          width: "100%",
        },
        defaultProps: {
          date: "Q2 2026",
          title: "Global Infrastructure Launch",
          description: "Expanded to 12 data centers across 6 continents, reducing average latency to under 10ms for 99% of users.",
          icon: "🚀",
          accentColor: "#6366F1",
          status: "completed",
        },
      },
      {
        id: "pricing-card-elem",
        type: "pricing-card",
        label: "Pricing Card",
        icon: "CreditCard",
        description: "Standalone pricing tier with features list",
        defaultStyles: {
          backgroundColor: "#FFFFFF",
          borderRadius: "24px",
          border: "1px solid #E2E8F0",
          padding: "40px 36px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxWidth: "320px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.06)",
        },
        defaultProps: {
          name: "Pro",
          price: "$49",
          period: "/month",
          description: "For teams shipping fast and scaling confidently.",
          features: [
            "Unlimited projects",
            "Custom domains",
            "AI site generation",
            "Priority support",
            "Analytics dashboard",
          ],
          ctaText: "Start free trial",
          popular: true,
          accentColor: "#6366F1",
        },
      },
      {
        id: "event-card-elem",
        type: "event-card",
        label: "Event Card",
        icon: "Calendar",
        description: "Upcoming event with date + location",
        defaultStyles: {
          backgroundColor: "#FFFFFF",
          borderRadius: "20px",
          border: "1px solid #E2E8F0",
          overflow: "hidden",
          maxWidth: "360px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.04)",
          display: "flex",
          flexDirection: "column",
        },
        defaultProps: {
          month: "MAY",
          day: "21",
          title: "Webperia Developer Summit",
          location: "San Francisco, CA",
          type: "In Person",
          accentColor: "#6366F1",
          registrationUrl: "#",
        },
      },
    ],
  },

  // ── 10. Pre-built Sections ──────────────────────────────────────────────────
  {
    id: "sections",
    label: "Sections",
    icon: Layout,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
    accentBorder: "border-purple-400",
    elements: [
      {
        id: "hero-section-elem",
        type: "hero",
        label: "Hero",
        icon: "Rocket",
        description: "Full hero with headline & CTA",
        defaultStyles: {
          padding: "120px 40px",
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
          color: "#FFFFFF",
          textAlign: "center",
          minHeight: "600px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        },
        defaultContent: "Build something people love",
      },
      {
        id: "hero-split-elem",
        type: "hero-split",
        label: "Hero Split",
        icon: "FlipHorizontal",
        description: "Text left, visual right",
        defaultStyles: {
          padding: "96px 40px",
          backgroundColor: "#FFFFFF",
          display: "flex",
          gap: "64px",
          alignItems: "center",
        },
      },
      {
        id: "feature-grid-elem",
        type: "feature-grid",
        label: "Feature Grid",
        icon: "Grid3X3",
        description: "3-column icon + text feature grid",
        defaultStyles: {
          padding: "96px 40px",
          backgroundColor: "#F8FAFC",
        },
      },
      {
        id: "feature-highlight-elem",
        type: "feature-highlight",
        label: "Feature Highlight",
        icon: "Lightbulb",
        description: "Single feature with screenshot",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#FFFFFF" },
      },
      {
        id: "bento-grid-elem",
        type: "bento-grid",
        label: "Bento Grid",
        icon: "Grip",
        description: "Asymmetric bento showcase",
        defaultStyles: {
          padding: "96px 40px",
          backgroundColor: "#0F172A",
        },
      },
      {
        id: "testimonials-section-elem",
        type: "testimonials",
        label: "Testimonials",
        icon: "MessageSquare",
        description: "Customer quotes with avatars",
        defaultStyles: {
          padding: "96px 40px",
          backgroundColor: "#F8FAFC",
        },
      },
      {
        id: "stats-section-elem",
        type: "stats",
        label: "Stats",
        icon: "BarChart3",
        description: "Key metrics with labels",
        defaultStyles: { padding: "80px 40px", backgroundColor: "#FFFFFF" },
      },
      {
        id: "pricing-section-elem",
        type: "pricing",
        label: "Pricing Table",
        icon: "CreditCard",
        description: "Tiered pricing cards",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#FFFFFF" },
      },
      {
        id: "logos-section-elem",
        type: "logos",
        label: "Logo Cloud",
        icon: "Building2",
        description: "Trusted-by logo strip",
        defaultStyles: {
          padding: "56px 40px",
          backgroundColor: "#FFFFFF",
          borderTop: "1px solid #F1F5F9",
          borderBottom: "1px solid #F1F5F9",
        },
      },
      {
        id: "faq-section-elem",
        type: "faq",
        label: "FAQ",
        icon: "HelpCircle",
        description: "Accordion FAQ section",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#FFFFFF" },
      },
      {
        id: "team-section-elem",
        type: "team",
        label: "Team",
        icon: "Users",
        description: "Team grid with photos & roles",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#F8FAFC" },
      },
      {
        id: "timeline-section-elem",
        type: "timeline",
        label: "Timeline",
        icon: "Clock",
        description: "Company milestones timeline",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#FFFFFF" },
      },
      {
        id: "how-it-works-elem",
        type: "how-it-works",
        label: "How It Works",
        icon: "Puzzle",
        description: "Step-by-step explainer",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#F8FAFC" },
      },
      {
        id: "blog-grid-elem",
        type: "blog-grid",
        label: "Blog Grid",
        icon: "BookOpen",
        description: "Blog post cards grid",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#FFFFFF" },
      },
      {
        id: "portfolio-grid-elem",
        type: "portfolio-grid",
        label: "Portfolio",
        icon: "GalleryHorizontal",
        description: "Work showcase with filters",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#FFFFFF" },
      },
      {
        id: "comparison-elem",
        type: "comparison",
        label: "Comparison",
        icon: "Table",
        description: "Feature comparison table",
        defaultStyles: { padding: "96px 40px", backgroundColor: "#F8FAFC" },
      },
      {
        id: "cta-section-elem",
        type: "cta",
        label: "CTA Section",
        icon: "Megaphone",
        description: "Full-width call-to-action",
        defaultStyles: {
          padding: "96px 40px",
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
          color: "#FFFFFF",
          textAlign: "center",
        },
        defaultContent: "Ready to build something great?",
      },
      {
        id: "announcement-elem",
        type: "announcement",
        label: "Announcement",
        icon: "Rss",
        description: "Top-of-page dismissible banner",
        defaultContent: "🎉 Introducing AI-powered site generation — try it free →",
        defaultStyles: {
          backgroundColor: "#6366F1",
          color: "#FFFFFF",
          padding: "12px 24px",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "500",
          width: "100%",
        },
      },
      {
        id: "cookie-banner-elem",
        type: "cookie-banner",
        label: "Cookie Banner",
        icon: "AlertCircle",
        description: "GDPR cookie consent bar",
        defaultStyles: {
          position: "fixed",
          bottom: "0",
          left: "0",
          right: "0",
          backgroundColor: "#0F172A",
          color: "#F8FAFC",
          padding: "20px 40px",
          zIndex: "100",
        },
      },
    ],
  },

  // ── 11. Auth ────────────────────────────────────────────────────────────────
  {
    id: "auth",
    label: "Auth",
    icon: Shield,
    color: "bg-red-100",
    iconColor: "text-red-600",
    accentBorder: "border-red-400",
    elements: [
      {
        id: "auth-signin-elem",
        type: "auth-signin-form",
        label: "Sign In Form",
        icon: "LogIn",
        description: "Functional sign-in — 6 variants",
        defaultProps: {
          variant: "minimal",
          accentColor: "#6366F1",
          heading: "Welcome back",
          subheading: "Sign in to continue to your account",
          buttonText: "Sign in",
          showSocialLogin: true,
        },
        defaultStyles: {},
      },
      {
        id: "auth-signup-elem",
        type: "auth-signup-form",
        label: "Sign Up Form",
        icon: "UserCheck",
        description: "Functional sign-up — 6 variants",
        defaultProps: {
          variant: "minimal",
          accentColor: "#6366F1",
          heading: "Create your account",
          subheading: "Join thousands of users — it's free",
          buttonText: "Create account",
          showSocialLogin: true,
        },
        defaultStyles: {},
      },
      {
        id: "auth-gate-elem",
        type: "auth-gate",
        label: "Auth Gate",
        icon: "Lock",
        description: "Protect content behind auth",
        defaultStyles: {
          padding: "64px 40px",
          textAlign: "center",
          backgroundColor: "#F8FAFC",
          borderRadius: "20px",
          border: "2px dashed #E2E8F0",
        },
        defaultProps: { fallback: "signin", message: "Sign in to view this exclusive content." },
      },
      {
        id: "auth-forgot-elem",
        type: "auth-forgot-form",
        label: "Forgot Password",
        icon: "KeyRound",
        description: "Forgot password form — sends reset email",
        defaultProps: {
          variant: "minimal",
          accentColor: "#6366F1",
          heading: "Forgot your password?",
          subheading: "Enter your email and we'll send a reset link.",
          buttonText: "Send reset link",
        },
        defaultStyles: {},
      },
      {
        id: "auth-reset-elem",
        type: "auth-reset-form",
        label: "Reset Password",
        icon: "RefreshCw",
        description: "New password form — used after clicking reset link",
        defaultProps: {
          variant: "minimal",
          accentColor: "#6366F1",
          heading: "Set new password",
          subheading: "Choose a strong password for your account.",
          buttonText: "Update password",
        },
        defaultStyles: {},
      },
      {
        id: "auth-user-profile-elem",
        type: "user-profile-card",
        label: "User Profile",
        icon: "CircleUserRound",
        description: "Displays signed-in user's avatar, name, and email",
        defaultProps: {
          showAvatar: true,
          showEmail: true,
          showLogout: true,
          accentColor: "#6366F1",
        },
        defaultStyles: {},
      },
      {
        id: "auth-logout-btn-elem",
        type: "logout-button",
        label: "Logout Button",
        icon: "LogIn",
        description: "Button that signs the user out",
        defaultContent: "Sign out",
        defaultProps: { accentColor: "#EF4444", variant: "outline" },
        defaultStyles: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "10px 20px",
          borderRadius: "10px",
          fontSize: "14px",
          fontWeight: "600",
          cursor: "pointer",
          border: "1.5px solid #FCA5A5",
          color: "#EF4444",
          backgroundColor: "#FFF1F2",
        },
      },
    ],
  },
];

// ── Draggable element tile ─────────────────────────────────────────────────────

function DraggableElementTile({
  element,
  iconColor,
  tileColor,
}: {
  element: PanelElement;
  iconColor: string;
  tileColor: string;
}) {
  const draggablePayload = {
    id: element.id,
    type: element.type as DraggableElement["type"],
    label: element.label,
    icon: element.icon,
    defaultContent: element.defaultContent,
    defaultStyles: element.defaultStyles as DraggableElement["defaultStyles"],
    defaultProps: element.defaultProps,
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `draggable-${element.id}`,
    data: { type: "element", element: draggablePayload },
  });

  const Icon = iconMap[element.icon] ?? Square;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      title={element.description || element.label}
      className={cn(
        "group relative flex flex-col items-center gap-2 p-3 rounded-xl cursor-grab active:cursor-grabbing select-none transition-all duration-150 border",
        isDragging
          ? "opacity-40 scale-95 border-indigo-200 bg-indigo-50/50 shadow-sm"
          : "border-transparent hover:border-gray-200 hover:bg-white hover:shadow-md hover:shadow-gray-100/80 bg-gray-50/60"
      )}
      style={{ minHeight: "70px" }}
    >
      {/* Icon */}
      <div className={cn(
        "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-150 group-hover:scale-110",
        tileColor
      )}>
        <Icon className={cn("h-4 w-4", iconColor)} />
      </div>

      {/* Label */}
      <span className="text-[10px] font-semibold text-gray-700 text-center leading-tight line-clamp-2 w-full px-0.5">
        {element.label}
      </span>

      {/* Drag handle dots */}
      <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-100 flex flex-col gap-0.5">
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        <div className="w-1 h-1 rounded-full bg-gray-300" />
        <div className="w-1 h-1 rounded-full bg-gray-300" />
      </div>
    </div>
  );
}

// ── Category section ──────────────────────────────────────────────────────────

function CategorySection({
  category,
  search,
  isOpen,
  onToggle,
}: {
  category: Category;
  search: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const filtered = useMemo(() => {
    if (!search) return category.elements;
    const q = search.toLowerCase();
    return category.elements.filter(
      (el) =>
        el.label.toLowerCase().includes(q) ||
        el.type.toLowerCase().includes(q) ||
        (el.description || "").toLowerCase().includes(q)
    );
  }, [category.elements, search]);

  if (filtered.length === 0) return null;

  const CatIcon = category.icon;

  return (
    <div className="mb-0.5">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-150 group",
          isOpen
            ? "bg-white shadow-sm shadow-gray-100/80 border border-gray-100"
            : "hover:bg-white hover:shadow-sm hover:shadow-gray-100/60 hover:border hover:border-gray-100 border border-transparent"
        )}
      >
        {/* Accent bar */}
        <div className={cn(
          "w-0.5 h-4 rounded-full shrink-0 transition-opacity",
          category.accentBorder.replace("border-", "bg-"),
          isOpen ? "opacity-100" : "opacity-40 group-hover:opacity-70"
        )} />

        {/* Category icon */}
        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center shrink-0", category.color)}>
          <CatIcon className={cn("h-3 w-3", category.iconColor)} />
        </div>

        {/* Label */}
        <span className={cn(
          "flex-1 text-left text-[11px] font-bold tracking-wide uppercase transition-colors",
          isOpen ? "text-gray-800" : "text-gray-500 group-hover:text-gray-700"
        )}>
          {category.label}
        </span>

        {/* Count */}
        <span className={cn(
          "text-[9px] font-bold px-1.5 py-0.5 rounded-full leading-none tabular-nums transition-colors",
          isOpen ? "bg-gray-100 text-gray-600" : "bg-gray-100/70 text-gray-400"
        )}>
          {filtered.length}
        </span>

        {/* Chevron */}
        <ChevronDown className={cn(
          "h-3 w-3 text-gray-400 transition-transform duration-200 shrink-0",
          isOpen ? "rotate-180 text-gray-600" : ""
        )} />
      </button>

      {isOpen && (
        <div className="grid grid-cols-3 gap-1.5 px-2 pb-2 pt-1.5">
          {filtered.map((el) => (
            <DraggableElementTile
              key={el.id}
              element={el}
              iconColor={category.iconColor}
              tileColor={category.color}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main panel ────────────────────────────────────────────────────────────────

export default function ElementsPanel() {
  const [search, setSearch] = useState("");
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(
    () => Object.fromEntries(categories.map((c) => [c.id, c.id === "layout" || c.id === "typography"]))
  );

  const toggleCategory = (id: string) =>
    setOpenCategories((prev) => ({ ...prev, [id]: !prev[id] }));

  const expandAll   = () => setOpenCategories(Object.fromEntries(categories.map((c) => [c.id, true])));
  const collapseAll = () => setOpenCategories(Object.fromEntries(categories.map((c) => [c.id, false])));

  const totalElements = categories.reduce((acc, c) => acc + c.elements.length, 0);

  const visibleCount = useMemo(() => {
    if (!search) return totalElements;
    const q = search.toLowerCase();
    return categories.reduce((acc, c) => acc + c.elements.filter(
      (el) => el.label.toLowerCase().includes(q) || el.type.toLowerCase().includes(q) || (el.description || "").toLowerCase().includes(q)
    ).length, 0);
  }, [search, totalElements]);

  const hasResults  = visibleCount > 0;
  const isSearching = search.length > 0;

  return (
    <div className="h-full flex flex-col bg-gray-50/50">

      {/* ── Header ───────────────────────────────────────────────── */}
      <div className="px-3 pt-3 pb-2.5 border-b border-gray-100 bg-white shrink-0 space-y-2.5">

        {/* Title row */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shrink-0">
            <Layers className="h-3 w-3 text-white" />
          </div>
          <span className="text-[12px] font-bold text-gray-900 flex-1">Elements</span>
          <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full tabular-nums">
            {isSearching ? `${visibleCount} / ` : ""}{totalElements}
          </span>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search elements…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 rounded-xl bg-gray-50 border border-gray-200 text-[12px] text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400/30 focus:border-indigo-300 focus:bg-white transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="h-2.5 w-2.5 text-gray-500" />
            </button>
          )}
        </div>

        {/* Expand / collapse */}
        {!isSearching && (
          <div className="flex gap-1.5">
            <button onClick={expandAll} className="flex-1 text-[10px] font-semibold text-gray-500 hover:text-indigo-600 py-1 rounded-lg hover:bg-indigo-50 transition-colors">
              Expand all
            </button>
            <div className="w-px bg-gray-200" />
            <button onClick={collapseAll} className="flex-1 text-[10px] font-semibold text-gray-500 hover:text-gray-700 py-1 rounded-lg hover:bg-gray-100 transition-colors">
              Collapse all
            </button>
          </div>
        )}
      </div>

      {/* ── Element list ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-0.5">
        {hasResults ? (
          categories.map((cat) => (
            <CategorySection
              key={cat.id}
              category={cat}
              search={search}
              isOpen={isSearching ? true : (openCategories[cat.id] ?? false)}
              onToggle={() => toggleCategory(cat.id)}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-14 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Search className="h-5 w-5 text-gray-300" />
            </div>
            <p className="text-[12px] font-semibold text-gray-600 mb-1">No elements found</p>
            <p className="text-[10px] text-gray-400 leading-relaxed">Try a different keyword</p>
            <button onClick={() => setSearch("")} className="mt-3 text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
