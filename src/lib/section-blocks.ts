import type { CanvasElement } from "@/lib/types";

export interface SectionBlock {
  id: string;
  name: string;
  category: "hero" | "features" | "cta" | "testimonials" | "pricing" | "content" | "contact" | "footer" | "navbar" | "sidebar" | "blog" | "portfolio" | "ecommerce" | "auth" | "team" | "faq" | "stats" | "logo-cloud" | "services" | "dashboard" | "saas" | "utility" | "interactive" | "landing";
  designStyle?: "minimal" | "modern" | "dark" | "glass" | "bold" | "corporate" | "playful" | "creative";
  description: string;
  thumbnail?: string;
  element: Omit<CanvasElement, "id" | "order">;
}

export const SECTION_BLOCKS: SectionBlock[] = [

  // ─── NAVBARS ────────────────────────────────────────────────────────────────
  // All navbar blocks use the `navbar` element type so they get the built-in
  // responsive hamburger menu automatically — no extra wiring needed.

  {
    id: "sb-navbar-glass",
    name: "Navbar — Glass",
    category: "navbar",
    designStyle: "glass",
    description: "Frosted-glass sticky navbar. Collapses to hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "blur",
        brandName: "Acme",
        accentColor: "#6366F1",
        buttonStyle: "solid",
        signInText: "Sign in",
        ctaText: "Get started",
        navLinks: [
          { label: "Product", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "Blog", href: "#" },
          { label: "Docs", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-dark",
    name: "Navbar — Dark",
    category: "navbar",
    designStyle: "dark",
    description: "Deep-space dark navbar with glow CTA. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "dark",
        brandName: "Nexus",
        accentColor: "#6366F1",
        buttonStyle: "solid",
        signInText: "Log in",
        ctaText: "Start free →",
        navLinks: [
          { label: "Features", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "Blog", href: "#" },
          { label: "Docs", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-minimal",
    name: "Navbar — Minimal",
    category: "navbar",
    designStyle: "minimal",
    description: "Ultra-clean white navbar, no CTA clutter. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "white",
        brandName: "Studio",
        accentColor: "#111827",
        buttonStyle: "outline",
        signInText: "",
        ctaText: "Contact →",
        navLinks: [
          { label: "Work", href: "#" },
          { label: "About", href: "#" },
          { label: "Journal", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-bold",
    name: "Navbar — Bold Agency",
    category: "navbar",
    designStyle: "bold",
    description: "High-contrast dark agency navbar with amber CTA. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "dark",
        brandName: "BOLD",
        accentColor: "#F59E0B",
        buttonStyle: "solid",
        signInText: "",
        ctaText: "LET'S TALK →",
        navLinks: [
          { label: "Services", href: "#" },
          { label: "Work", href: "#" },
          { label: "Team", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-saas",
    name: "Navbar — SaaS Modern",
    category: "navbar",
    designStyle: "modern",
    description: "Clean SaaS navbar with gradient CTA button. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "white",
        brandName: "Prism",
        accentColor: "#6366F1",
        buttonStyle: "solid",
        signInText: "Sign in",
        ctaText: "Get started free",
        navLinks: [
          { label: "Product", href: "#" },
          { label: "Customers", href: "#" },
          { label: "Pricing", href: "#" },
          { label: "Blog", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-transparent",
    name: "Navbar — Transparent",
    category: "navbar",
    designStyle: "creative",
    description: "Transparent overlay navbar for full-bleed hero sections. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "transparent",
        brandName: "Lumière",
        accentColor: "#FFFFFF",
        buttonStyle: "outline",
        signInText: "",
        ctaText: "Shop Now",
        navLinks: [
          { label: "Collection", href: "#" },
          { label: "Lookbook", href: "#" },
          { label: "About", href: "#" },
        ],
      },
      styles: { position: "absolute", top: "0", left: "0", right: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-startup",
    name: "Navbar — Startup Night",
    category: "navbar",
    designStyle: "dark",
    description: "Dark violet startup navbar with outline secondary CTA. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "dark",
        brandName: "Orbit",
        accentColor: "#8B5CF6",
        buttonStyle: "solid",
        signInText: "Log in",
        ctaText: "Join waitlist",
        navLinks: [
          { label: "Features", href: "#" },
          { label: "Roadmap", href: "#" },
          { label: "Changelog", href: "#" },
          { label: "Pricing", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-corporate",
    name: "Navbar — Corporate",
    category: "navbar",
    designStyle: "corporate",
    description: "Professional blue corporate navbar with outline CTA. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "white",
        brandName: "Meridian",
        accentColor: "#1D4ED8",
        buttonStyle: "solid",
        signInText: "Client Portal",
        ctaText: "Book a Call",
        navLinks: [
          { label: "Services", href: "#" },
          { label: "Case Studies", href: "#" },
          { label: "About", href: "#" },
          { label: "Insights", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-creative",
    name: "Navbar — Creative",
    category: "navbar",
    designStyle: "playful",
    description: "Bright pink creative navbar with playful CTA. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "white",
        brandName: "Spark",
        accentColor: "#EC4899",
        buttonStyle: "solid",
        signInText: "",
        ctaText: "Start creating ✦",
        navLinks: [
          { label: "Explore", href: "#" },
          { label: "Templates", href: "#" },
          { label: "Community", href: "#" },
          { label: "Pricing", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-restaurant",
    name: "Navbar — Restaurant",
    category: "navbar",
    designStyle: "corporate",
    description: "Warm glass navbar for hospitality brands. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "blur",
        brandName: "Ember & Oak",
        accentColor: "#D97706",
        buttonStyle: "solid",
        signInText: "",
        ctaText: "Reserve a Table",
        navLinks: [
          { label: "Menu", href: "#" },
          { label: "About", href: "#" },
          { label: "Gallery", href: "#" },
          { label: "Contact", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-ecommerce",
    name: "Navbar — E-Commerce",
    category: "navbar",
    designStyle: "modern",
    description: "Rose-tinted shop navbar with cart CTA. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "white",
        brandName: "Bloom",
        accentColor: "#F43F5E",
        buttonStyle: "solid",
        signInText: "Sign in",
        ctaText: "Shop Now →",
        navLinks: [
          { label: "New Arrivals", href: "#" },
          { label: "Collections", href: "#" },
          { label: "Sale", href: "#" },
          { label: "About", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  {
    id: "sb-navbar-blog",
    name: "Navbar — Editorial Blog",
    category: "navbar",
    designStyle: "minimal",
    description: "Clean editorial navbar for blogs and magazines. Hamburger on mobile.",
    element: {
      type: "navbar",
      content: "",
      props: {
        bgType: "white",
        brandName: "The Digest",
        accentColor: "#F59E0B",
        buttonStyle: "solid",
        signInText: "Subscribe",
        ctaText: "Start reading",
        navLinks: [
          { label: "Technology", href: "#" },
          { label: "Business", href: "#" },
          { label: "Culture", href: "#" },
          { label: "Newsletter", href: "#" },
        ],
      },
      styles: { position: "sticky", top: "0", zIndex: "50" },
    },
  },

  // ─── NAVBARS — Container-based ──────────────────────────────────────────────
  // These navbars are built from containers + headings + buttons so they can be
  // fully customised via the visual editor (drag, resize, restyle any child).

  {
    id: "sb-navbar-centered-logo",
    name: "Navbar — Centered Logo",
    category: "navbar",
    designStyle: "minimal",
    description: "Three-column layout: nav links left · logo center · CTA right. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "md" },
      styles: {
        position: "sticky", top: "0", zIndex: "50",
        backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB",
        padding: "0 48px", minHeight: "72px", width: "100%",
      },
      children: [
        // Left: nav links
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" },
          styles: { flex: "1" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "Features", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Pricing", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "About", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
          ],
        },
        // Center: brand
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "center" },
          styles: { flex: "1" },
          children: [
            { id: "", order: 0, type: "heading", content: "Centri", props: { level: 2 }, styles: { fontSize: "22px", fontWeight: "800", color: "#111827", letterSpacing: "-0.02em", margin: "0" } },
          ],
        },
        // Right: CTA
        {
          id: "", order: 2, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "end", _childGap: "sm" },
          styles: { flex: "1" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "Log in", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
            { id: "", order: 1, type: "button", content: "Get started", styles: { backgroundColor: "#111827", color: "#FFFFFF", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-navbar-pill",
    name: "Navbar — Floating Pill",
    category: "navbar",
    designStyle: "modern",
    description: "Floating pill navbar centered on the page with drop shadow. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "row", _childAlign: "center", _childJustify: "center" },
      styles: {
        position: "sticky", top: "16px", zIndex: "50",
        padding: "0 24px", width: "100%", pointerEvents: "none",
      },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "lg" },
          styles: {
            backgroundColor: "#FFFFFF", borderRadius: "9999px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.12)", border: "1px solid #E5E7EB",
            padding: "10px 24px", maxWidth: "860px", width: "100%", pointerEvents: "auto",
          },
          children: [
            // Brand
            { id: "", order: 0, type: "heading", content: "◉ Orbit", props: { level: 2 }, styles: { fontSize: "17px", fontWeight: "800", color: "#111827", margin: "0", letterSpacing: "-0.01em" } },
            // Links
            {
              id: "", order: 1, type: "container", content: "",
              props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" },
              styles: {},
              children: [
                { id: "", order: 0, type: "paragraph", content: "Product", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Solutions", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Pricing", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
                { id: "", order: 3, type: "paragraph", content: "Blog", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
              ],
            },
            // CTA
            { id: "", order: 2, type: "button", content: "Try free →", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "8px 18px", borderRadius: "9999px", fontWeight: "600", fontSize: "13px", cursor: "pointer", border: "none" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-navbar-two-row",
    name: "Navbar — Two Row",
    category: "navbar",
    designStyle: "corporate",
    description: "Utility bar on top (contacts/socials) + main nav row below. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "column", _childGap: "xs" },
      styles: { position: "sticky", top: "0", zIndex: "50", width: "100%" },
      children: [
        // Top utility bar
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "md" },
          styles: { backgroundColor: "#1E293B", padding: "6px 48px", width: "100%" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "✉ hello@meridian.co  ·  ☎ +1 (800) 555-0199", styles: { fontSize: "12px", color: "#94A3B8", margin: "0" } },
            {
              id: "", order: 1, type: "container", content: "",
              props: { _childLayout: "row", _childAlign: "center", _childGap: "md" },
              styles: {},
              children: [
                { id: "", order: 0, type: "paragraph", content: "Twitter", styles: { fontSize: "12px", color: "#94A3B8", cursor: "pointer", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "LinkedIn", styles: { fontSize: "12px", color: "#94A3B8", cursor: "pointer", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Instagram", styles: { fontSize: "12px", color: "#94A3B8", cursor: "pointer", margin: "0" } },
              ],
            },
          ],
        },
        // Main nav row
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "md" },
          styles: { backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "14px 48px", width: "100%" },
          children: [
            { id: "", order: 0, type: "heading", content: "Meridian", props: { level: 2 }, styles: { fontSize: "20px", fontWeight: "800", color: "#1E293B", margin: "0", letterSpacing: "-0.02em" } },
            {
              id: "", order: 1, type: "container", content: "",
              props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
              styles: {},
              children: [
                { id: "", order: 0, type: "paragraph", content: "Services", styles: { fontSize: "14px", fontWeight: "500", color: "#334155", cursor: "pointer", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Case Studies", styles: { fontSize: "14px", fontWeight: "500", color: "#334155", cursor: "pointer", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "About", styles: { fontSize: "14px", fontWeight: "500", color: "#334155", cursor: "pointer", margin: "0" } },
                { id: "", order: 3, type: "paragraph", content: "Careers", styles: { fontSize: "14px", fontWeight: "500", color: "#334155", cursor: "pointer", margin: "0" } },
              ],
            },
            {
              id: "", order: 2, type: "container", content: "",
              props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" },
              styles: {},
              children: [
                { id: "", order: 0, type: "paragraph", content: "Client Portal", styles: { fontSize: "14px", fontWeight: "500", color: "#334155", cursor: "pointer", margin: "0" } },
                { id: "", order: 1, type: "button", content: "Book a Call", styles: { backgroundColor: "#1D4ED8", color: "#FFFFFF", padding: "10px 20px", borderRadius: "6px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none" } },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-navbar-dark-gradient",
    name: "Navbar — Dark Gradient",
    category: "navbar",
    designStyle: "dark",
    description: "Full-width dark gradient navbar with glowing accent CTA. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "md" },
      styles: {
        position: "sticky", top: "0", zIndex: "50",
        backgroundImage: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)",
        padding: "0 48px", minHeight: "72px", width: "100%",
      },
      children: [
        // Brand
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" },
          styles: {},
          children: [
            { id: "", order: 0, type: "heading", content: "⬡ Nova", props: { level: 2 }, styles: { fontSize: "20px", fontWeight: "800", color: "#FFFFFF", margin: "0", letterSpacing: "-0.02em" } },
          ],
        },
        // Links
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
          styles: {},
          children: [
            { id: "", order: 0, type: "paragraph", content: "Platform", styles: { fontSize: "14px", fontWeight: "500", color: "#C4B5FD", cursor: "pointer", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Solutions", styles: { fontSize: "14px", fontWeight: "500", color: "#C4B5FD", cursor: "pointer", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Docs", styles: { fontSize: "14px", fontWeight: "500", color: "#C4B5FD", cursor: "pointer", margin: "0" } },
            { id: "", order: 3, type: "paragraph", content: "Changelog", styles: { fontSize: "14px", fontWeight: "500", color: "#C4B5FD", cursor: "pointer", margin: "0" } },
          ],
        },
        // CTA
        {
          id: "", order: 2, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" },
          styles: {},
          children: [
            { id: "", order: 0, type: "paragraph", content: "Log in", styles: { fontSize: "14px", fontWeight: "500", color: "#A5B4FC", cursor: "pointer", margin: "0" } },
            { id: "", order: 1, type: "button", content: "Get started →", styles: { backgroundImage: "linear-gradient(135deg, #8B5CF6, #6366F1)", color: "#FFFFFF", padding: "10px 22px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none", boxShadow: "0 0 20px rgba(139,92,246,0.4)" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-navbar-split-panel",
    name: "Navbar — Split Panel",
    category: "navbar",
    designStyle: "bold",
    description: "Dark brand panel left, light links panel right — dramatic two-tone look. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "row", _childAlign: "stretch", _childGap: "xs" },
      styles: { position: "sticky", top: "0", zIndex: "50", width: "100%", minHeight: "72px" },
      children: [
        // Dark left panel — brand
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "center" },
          styles: { backgroundColor: "#111827", padding: "0 40px", minWidth: "220px" },
          children: [
            { id: "", order: 0, type: "heading", content: "APEX", props: { level: 2 }, styles: { fontSize: "24px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "0.12em" } },
          ],
        },
        // Light right panel — links + CTA
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "lg" },
          styles: { backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB", padding: "0 40px", flex: "1" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
              styles: {},
              children: [
                { id: "", order: 0, type: "paragraph", content: "Services", styles: { fontSize: "14px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "Work", styles: { fontSize: "14px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.05em" } },
                { id: "", order: 2, type: "paragraph", content: "Team", styles: { fontSize: "14px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.05em" } },
                { id: "", order: 3, type: "paragraph", content: "Contact", styles: { fontSize: "14px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.05em" } },
              ],
            },
            { id: "", order: 1, type: "button", content: "LET'S TALK →", styles: { backgroundColor: "#F59E0B", color: "#111827", padding: "12px 24px", borderRadius: "4px", fontWeight: "800", fontSize: "13px", cursor: "pointer", border: "none", letterSpacing: "0.05em" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-navbar-underline",
    name: "Navbar — Minimal Underline",
    category: "navbar",
    designStyle: "minimal",
    description: "Ultra-clean navbar: oversized brand left, spaced underline links right. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "xl" },
      styles: {
        position: "sticky", top: "0", zIndex: "50",
        backgroundColor: "#FFFFFF", borderBottom: "2px solid #111827",
        padding: "0 48px", minHeight: "80px", width: "100%",
      },
      children: [
        // Brand (large, serif)
        { id: "", order: 0, type: "heading", content: "Studio Lune", props: { level: 1 }, styles: { fontSize: "26px", fontWeight: "300", color: "#111827", margin: "0", letterSpacing: "-0.03em", fontFamily: "'Georgia', serif", fontStyle: "italic" } },
        // Nav links + CTA
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
          styles: {},
          children: [
            { id: "", order: 0, type: "paragraph", content: "Work", styles: { fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "2px solid transparent", paddingBottom: "2px" } },
            { id: "", order: 1, type: "paragraph", content: "About", styles: { fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "2px solid transparent", paddingBottom: "2px" } },
            { id: "", order: 2, type: "paragraph", content: "Journal", styles: { fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "2px solid transparent", paddingBottom: "2px" } },
            { id: "", order: 3, type: "paragraph", content: "Contact →", styles: { fontSize: "13px", fontWeight: "600", color: "#111827", cursor: "pointer", margin: "0", textTransform: "uppercase", letterSpacing: "0.12em", borderBottom: "2px solid #111827", paddingBottom: "2px" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-navbar-announcement",
    name: "Navbar — Announcement + Nav",
    category: "navbar",
    designStyle: "modern",
    description: "Coloured announcement bar above a clean white nav. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "column", _childGap: "xs" },
      styles: { position: "sticky", top: "0", zIndex: "50", width: "100%" },
      children: [
        // Announcement bar
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "center" },
          styles: { backgroundColor: "#6366F1", padding: "10px 24px", width: "100%" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "✦ We just launched our new AI features — read the announcement →", styles: { fontSize: "13px", fontWeight: "500", color: "#FFFFFF", margin: "0", textAlign: "center", cursor: "pointer" } },
          ],
        },
        // Main nav
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "md" },
          styles: { backgroundColor: "#FFFFFF", borderBottom: "1px solid #E5E7EB", padding: "14px 48px", width: "100%" },
          children: [
            { id: "", order: 0, type: "heading", content: "Prism", props: { level: 2 }, styles: { fontSize: "20px", fontWeight: "800", color: "#111827", margin: "0", letterSpacing: "-0.02em" } },
            {
              id: "", order: 1, type: "container", content: "",
              props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
              styles: {},
              children: [
                { id: "", order: 0, type: "paragraph", content: "Product", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Customers", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Pricing", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
                { id: "", order: 3, type: "paragraph", content: "Docs", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
              ],
            },
            {
              id: "", order: 2, type: "container", content: "",
              props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" },
              styles: {},
              children: [
                { id: "", order: 0, type: "paragraph", content: "Sign in", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
                { id: "", order: 1, type: "button", content: "Get started free", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none" } },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-navbar-glass-frosted",
    name: "Navbar — Glass Frosted (Container)",
    category: "navbar",
    designStyle: "glass",
    description: "Frosted-glass container navbar with a coloured left accent stripe. Built from containers.",
    element: {
      type: "container", content: "",
      props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "md" },
      styles: {
        position: "sticky", top: "0", zIndex: "50",
        backdropFilter: "blur(16px)", backgroundColor: "rgba(255,255,255,0.75)",
        borderBottom: "1px solid rgba(255,255,255,0.4)",
        boxShadow: "0 1px 24px rgba(0,0,0,0.06)",
        padding: "0 48px", minHeight: "72px", width: "100%",
        borderLeft: "4px solid #6366F1",
      },
      children: [
        // Brand
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" },
          styles: {},
          children: [
            { id: "", order: 0, type: "heading", content: "Acme", props: { level: 2 }, styles: { fontSize: "20px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "badge", content: "BETA", styles: { backgroundColor: "#EEF2FF", color: "#6366F1", fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px", letterSpacing: "0.08em" } },
          ],
        },
        // Links
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
          styles: {},
          children: [
            { id: "", order: 0, type: "paragraph", content: "Product", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Pricing", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Blog", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
            { id: "", order: 3, type: "paragraph", content: "Docs", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
          ],
        },
        // CTA
        {
          id: "", order: 2, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" },
          styles: {},
          children: [
            { id: "", order: 0, type: "paragraph", content: "Sign in", styles: { fontSize: "14px", fontWeight: "500", color: "#374151", cursor: "pointer", margin: "0" } },
            { id: "", order: 1, type: "button", content: "Get started", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none" } },
          ],
        },
      ],
    },
  },

  // ─── SIDEBARS ────────────────────────────────────────────────────────────────

  {
    id: "sb-sidebar-left",
    name: "Sidebar — Left",
    category: "sidebar",
    designStyle: "modern",
    description: "Navigation drawer that slides in from the left with overlay",
    element: {
      type: "sidebar", content: "",
      props: { direction: "left", bgType: "white", sidebarWidth: "300px", triggerLabel: "Open Menu", accentColor: "#6366F1", overlay: true, brandName: "Acme", navLinks: [{ label: "Home", href: "#" }, { label: "About", href: "#" }, { label: "Services", href: "#" }, { label: "Portfolio", href: "#" }, { label: "Contact", href: "#" }] },
      styles: { padding: "24px" },
    },
  },

  {
    id: "sb-sidebar-right",
    name: "Sidebar — Right (Dark)",
    category: "sidebar",
    designStyle: "dark",
    description: "Dark panel that slides in from the right — great for settings or cart",
    element: {
      type: "sidebar", content: "",
      props: { direction: "right", bgType: "dark", sidebarWidth: "300px", triggerLabel: "Open Panel", accentColor: "#8B5CF6", overlay: true, brandName: "Settings", navLinks: [{ label: "Dashboard", href: "#" }, { label: "Profile", href: "#" }, { label: "Billing", href: "#" }, { label: "Preferences", href: "#" }, { label: "Sign out", href: "#" }] },
      styles: { padding: "24px" },
    },
  },

  {
    id: "sb-sidebar-bottom",
    name: "Sidebar — Bottom Sheet",
    category: "sidebar",
    designStyle: "minimal",
    description: "Mobile-style action sheet that slides up from the bottom",
    element: {
      type: "sidebar", content: "",
      props: { direction: "bottom", bgType: "white", sidebarHeight: "240px", triggerLabel: "Open Sheet", accentColor: "#0EA5E9", overlay: true, brandName: "Quick Actions", navLinks: [{ label: "Share", href: "#" }, { label: "Download", href: "#" }, { label: "Duplicate", href: "#" }, { label: "Delete", href: "#" }] },
      styles: { padding: "24px" },
    },
  },

  {
    id: "sb-sidebar-top",
    name: "Sidebar — Top Drawer",
    category: "sidebar",
    designStyle: "dark",
    description: "Announcement bar or menu that drops down from the top",
    element: {
      type: "sidebar", content: "",
      props: { direction: "top", bgType: "dark", sidebarHeight: "200px", triggerLabel: "Open Drawer", accentColor: "#F59E0B", overlay: true, brandName: "Main Menu", navLinks: [{ label: "Home", href: "#" }, { label: "Features", href: "#" }, { label: "Pricing", href: "#" }, { label: "Contact", href: "#" }] },
      styles: { padding: "24px" },
    },
  },

  // ─── HEROES ──────────────────────────────────────────────────────────────────

  {
    id: "sb-hero-editorial",
    name: "Hero — Editorial Split",
    category: "hero",
    designStyle: "minimal",
    description: "Premium editorial split layout with oversized serif typography and a focus on craftsmanship",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 64px", backgroundColor: "#F8F8F8", minHeight: "800px", display: "flex", alignItems: "center", justifyContent: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
          styles: { maxWidth: "1400px", width: "100%", flexWrap: "wrap" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "48px", minWidth: "400px" }, children: [
                { id: "", order: 0, type: "badge", content: "ESTABLISHED 2026", styles: { color: "#1A1A1A", fontSize: "11px", fontWeight: "900", letterSpacing: "0.2em", borderBottom: "1px solid #1A1A1A", width: "fit-content", paddingBottom: "4px" } },
                { id: "", order: 1, type: "heading", content: "Crafting digital\nsensibilities.", props: { level: 1 }, styles: { fontSize: "110px", fontWeight: "300", color: "#1A1A1A", lineHeight: "0.92", margin: "0", letterSpacing: "-0.04em", fontFamily: "'Playfair Display', serif" } },
                { id: "", order: 2, type: "paragraph", content: "We believe in the power of simplicity and the permanence of good design. Our studio builds tools that empower the next generation of creative thinkers.", styles: { fontSize: "20px", color: "#4A4A4A", margin: "0", lineHeight: "1.8", maxWidth: "480px" } },
                {
                  id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" }, styles: { justifyContent: "flex-start" }, children: [
                    { id: "", order: 0, type: "button", content: "View Projects", styles: { backgroundColor: "#1A1A1A", color: "#FFFFFF", padding: "16px 32px", borderRadius: "0", fontWeight: "600", fontSize: "15px", cursor: "pointer" } },
                    { id: "", order: 1, type: "button", content: "Contact Us", styles: { backgroundColor: "transparent", color: "#1A1A1A", padding: "16px 32px", borderRadius: "0", fontWeight: "600", fontSize: "15px", cursor: "pointer", border: "1px solid #1A1A1A" } },
                  ]
                }
              ]
            },
            {
              id: "", order: 1, type: "container", content: "",
              styles: { flex: "1", minHeight: "600px", minWidth: "400px", position: "relative", backgroundColor: "#E5E5E5", borderRadius: "4px", overflow: "hidden", backgroundImage: "url('https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&q=80&w=1000')", backgroundSize: "cover", backgroundPosition: "center" },
              children: [
                { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", inset: "0", backgroundColor: "rgba(0,0,0,0.05)" } }
              ]
            }
          ]
        }
      ]
    },
  },

  {
    id: "sb-hero-playful",
    name: "Hero — Playful Pop",
    category: "hero",
    designStyle: "playful",
    description: "Vibrant and energetic hero with bold geometric shapes and pop-art aesthetics",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 48px", backgroundColor: "#FFFB00", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "850px", position: "relative", overflow: "hidden", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "-50px", right: "-50px", width: "240px", height: "240px", backgroundColor: "#FF0055", borderRadius: "50%", zIndex: "1" } },
        { id: "", order: 1, type: "container", content: "", styles: { position: "absolute", bottom: "10%", left: "5%", width: "140px", height: "140px", backgroundColor: "#00E0FF", transform: "rotate(15deg)", borderRadius: "24px", zIndex: "1" } },
        { id: "", order: 2, type: "badge", content: "🎉 NOW WITH EXTRA PIXELS", styles: { backgroundColor: "#000000", color: "#FFFFFF", padding: "10px 24px", borderRadius: "8px", fontSize: "14px", fontWeight: "900", transform: "rotate(-2deg)", width: "fit-content", border: "3px solid #FFFFFF", boxShadow: "5px 5px 0 #000000", position: "relative", zIndex: "5", margin: "0 auto" } },
        { id: "", order: 3, type: "heading", content: "Create websites\nthat actually POP!", props: { level: 1 }, styles: { fontSize: "96px", fontWeight: "900", color: "#000000", lineHeight: "0.85", margin: "0", letterSpacing: "0.01em", textTransform: "uppercase", position: "relative", zIndex: "5", textShadow: "12px 12px 0px rgba(0,0,0,0.1)", WebkitTextStroke: "1px rgba(0,0,0,0.05)" } },
        { id: "", order: 4, type: "paragraph", content: "Stop being boring. Start being you. The first website builder designed for the maximalists, the dreamers, and the rule-breakers.", styles: { fontSize: "24px", color: "#000000", maxWidth: "600px", margin: "0 auto", lineHeight: "1.4", fontWeight: "800", position: "relative", zIndex: "5" } },
        {
          id: "", order: 5, type: "container", content: "", props: { _childLayout: "row", _childJustify: "center", _childGap: "lg" }, styles: { position: "relative", zIndex: "5", justifyContent: "center", width: "100%" }, children: [
            { id: "", order: 0, type: "button", content: "Go Wild Now", styles: { backgroundColor: "#000000", color: "#FFFFFF", padding: "20px 48px", borderRadius: "0px", fontWeight: "900", fontSize: "18px", transform: "rotate(1deg)", boxShadow: "8px 8px 0 #FF0055", cursor: "pointer" } },
            { id: "", order: 1, type: "button", content: "See Examples", styles: { backgroundColor: "#FFFFFF", color: "#000000", border: "4px solid #000000", padding: "20px 48px", borderRadius: "0px", fontWeight: "900", fontSize: "18px", transform: "rotate(-1deg)", boxShadow: "8px 8px 0 #00E0FF", cursor: "pointer" } },
          ]
        }
      ],
    },
  },

  {
    id: "sb-hero-cinematic",
    name: "Hero — Cinematic Ambient",
    category: "hero",
    designStyle: "modern",
    description: "Immersive centered hero with deep radial glows and massive display typography",
    element: {
      type: "container", content: "",
      styles: {
        padding: "200px 40px",
        backgroundColor: "#030712",
        backgroundImage: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.15) 0%, transparent 60%)",
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "48px",
        position: "relative",
        overflow: "hidden",
        minHeight: "850px",
        justifyContent: "center"
      },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "20%", left: "50%", width: "800px", height: "800px", backgroundColor: "rgba(99,102,241,0.05)", borderRadius: "50%", filter: "blur(120px)", transform: "translateX(-50%)", pointerEvents: "none" } },
        { id: "", order: 1, type: "badge", content: "✦ REIMAGINING THE FUTURE", styles: { backgroundColor: "rgba(255,255,255,0.03)", color: "#A5B4FC", padding: "8px 20px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.2em" } },
        { id: "", order: 2, type: "heading", content: "Boundless\nInnovation.", props: { level: 1 }, styles: { fontSize: "120px", fontWeight: "900", color: "transparent", backgroundImage: "linear-gradient(to bottom right, #FFFFFF, #818CF8)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: "0.92", margin: "0", letterSpacing: "-0.03em", whiteSpace: "pre-line", maxWidth: "1200px", textShadow: "0 0 80px rgba(99,102,241,0.25)" } },
        { id: "", order: 3, type: "paragraph", content: "The most powerful engine for building high-performance websites. Built for speed, designed for absolute control.", styles: { fontSize: "24px", color: "rgba(255,255,255,0.5)", maxWidth: "720px", margin: "0 auto", lineHeight: "1.6", fontWeight: "400" } },
        {
          id: "", order: 4, type: "container", content: "", props: { _childLayout: "row", _childJustify: "center", _childAlign: "center", _childGap: "xl" }, styles: { marginTop: "24px" }, children: [
            { id: "", order: 0, type: "button", content: "Get Started →", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "20px 48px", borderRadius: "100px", fontWeight: "700", fontSize: "18px", cursor: "pointer", boxShadow: "0 0 40px rgba(99,102,241,0.4)", border: "none" } },
            { id: "", order: 1, type: "button", content: "Watch the Film", styles: { backgroundColor: "transparent", color: "#FFFFFF", padding: "20px 48px", borderRadius: "100px", fontWeight: "600", fontSize: "18px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)" } },
          ]
        },
      ],
    },
  },

  {
    id: "sb-hero-bento",
    name: "Hero — Bento Showcase",
    category: "hero",
    designStyle: "dark",
    description: "Grid-based hero that integrates micro-features and social proof directly into the main view",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 48px", backgroundColor: "#0F172A", display: "flex", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
        styles: { maxWidth: "1400px", width: "100%", flexWrap: "wrap" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1.2", display: "flex", flexDirection: "column", gap: "40px", padding: "40px", minWidth: "400px" }, children: [
              { id: "", order: 0, type: "badge", content: "SYSTEMS OPERATIONAL", styles: { color: "#4ADE80", fontSize: "11px", fontWeight: "900", letterSpacing: "0.2em", display: "flex", alignItems: "center", gap: "8px" } },
              { id: "", order: 1, type: "heading", content: "Absolute\nEfficiency.", props: { level: 1 }, styles: { fontSize: "110px", fontWeight: "900", color: "transparent", backgroundImage: "linear-gradient(to bottom, #FFFFFF 0%, #64748B 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: "0.92", margin: "0", letterSpacing: "-0.05em" } },
              { id: "", order: 2, type: "paragraph", content: "Deploy globally in seconds. Scale to billions without touching a server. The ultimate cloud-native toolkit.", styles: { fontSize: "20px", color: "#64748B", lineHeight: "1.7", margin: "0", maxWidth: "500px" } },
              { id: "", order: 3, type: "button", content: "Claim your endpoint →", styles: { backgroundColor: "#FFFFFF", color: "#000000", padding: "18px 36px", borderRadius: "12px", fontWeight: "800", fontSize: "16px", cursor: "pointer", width: "fit-content" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", minWidth: "400px" },
            children: [
              { id: "", order: 0, type: "container", styles: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(255,255,255,0.05)" }, children: [{ id: "", order: 0, type: "heading", content: "99.99%", styles: { color: "#FFFFFF", fontSize: "32px", fontWeight: "900" } }, { id: "", order: 1, type: "paragraph", content: "Uptime SLA", styles: { color: "#64748B", fontSize: "14px" } }] },
              { id: "", order: 1, type: "container", styles: { backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(255,255,255,0.05)" }, children: [{ id: "", order: 0, type: "heading", content: "<10ms", styles: { color: "#4ADE80", fontSize: "32px", fontWeight: "900" } }, { id: "", order: 1, type: "paragraph", content: "Global Latency", styles: { color: "#64748B", fontSize: "14px" } }] },
              { id: "", order: 2, type: "container", styles: { gridColumn: "span 2", backgroundColor: "rgba(255,255,255,0.03)", borderRadius: "24px", padding: "40px", border: "1px solid rgba(255,255,255,0.05)", backgroundImage: "linear-gradient(to right, rgba(99,102,241,0.1), transparent)", position: "relative", overflow: "hidden" }, children: [{ id: "", order: 0, type: "heading", content: "Enterprise Ready", styles: { color: "#FFFFFF", fontSize: "24px", fontWeight: "800", marginBottom: "8px" } }, { id: "", order: 1, type: "paragraph", content: "Full SOC2 compliance and end-to-end encryption by default.", styles: { color: "#94A3B8", fontSize: "16px" } }] },
            ]
          }
        ]
      }],
    },
  },

  {
    id: "sb-hero-glass",
    name: "Hero — Glass Fusion",
    category: "hero",
    designStyle: "glass",
    description: "Multilayered glass effect with ambient color waves and crystal-clear feature cards",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 48px", backgroundImage: "linear-gradient(135deg, #FF3CAC 0%, #784BA0 50%, #2B86C5 100%)", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "850px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "10%", left: "10%", width: "400px", height: "400px", backgroundColor: "rgba(255, 255, 255, 0.15)", borderRadius: "50%", filter: "blur(100px)" } },
        {
          id: "", order: 1, type: "container", content: "",
          styles: {
            backgroundColor: "rgba(255,255,255,0.05)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(255,255,255,0.15)",
            borderRadius: "48px",
            padding: "80px",
            maxWidth: "900px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "48px",
            textAlign: "center",
            boxShadow: "0 60px 120px rgba(0,0,0,0.2)",
            position: "relative",
            zIndex: "10"
          },
          children: [
            { id: "", order: 0, type: "badge", content: "💎 CRYSTAL EDITION", styles: { backgroundColor: "rgba(255,255,255,0.1)", color: "#FFFFFF", padding: "10px 24px", borderRadius: "100px", fontSize: "12px", fontWeight: "900", border: "1px solid rgba(255,255,255,0.2)", width: "fit-content", margin: "0 auto", letterSpacing: "0.2em" } },
            { id: "", order: 1, type: "heading", content: "Liquid Clarity.", props: { level: 1 }, styles: { fontSize: "96px", fontWeight: "900", color: "transparent", backgroundImage: "linear-gradient(to bottom right, #FFFFFF 30%, rgba(255,255,255,0.4) 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: "0.92", margin: "0", letterSpacing: "-0.02em", filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.15))" } },
            { id: "", order: 2, type: "paragraph", content: "The ultimate toolkit for building transparent, high-fidelity digital experiences. Crystal-clear design, rock-solid performance.", styles: { fontSize: "22px", color: "rgba(255,255,255,0.7)", lineHeight: "1.7", maxWidth: "640px", margin: "0 auto" } },
            {
              id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childJustify: "center", _childGap: "xl" }, styles: { justifyContent: "center", width: "100%" }, children: [
                { id: "", order: 0, type: "button", content: "Explore Studio", styles: { backgroundColor: "#FFFFFF", color: "#784BA0", padding: "20px 56px", borderRadius: "16px", fontWeight: "800", fontSize: "18px", cursor: "pointer", border: "none", boxShadow: "0 20px 40px rgba(0,0,0,0.1)" } },
                { id: "", order: 1, type: "button", content: "Get Documentation", styles: { backgroundColor: "rgba(255,255,255,0.1)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)", padding: "20px 56px", borderRadius: "16px", fontWeight: "700", fontSize: "18px", cursor: "pointer" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-hero-studio",
    name: "Hero — Minimalist Studio",
    category: "hero",
    designStyle: "minimal",
    description: "Ultra-minimal studio hero with expansive whitespace and delicate typography",
    element: {
      type: "container", content: "",
      styles: { padding: "180px 40px", backgroundColor: "#FFFFFF", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "60px", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "heading", content: "The art of\nrestraint.", props: { level: 1 }, styles: { fontSize: "80px", fontWeight: "100", color: "#000000", lineHeight: "0.95", margin: "0", letterSpacing: "0.14em", textTransform: "uppercase" } },
        { id: "", order: 1, type: "paragraph", content: "A new era of digital craft. We build interfaces that breathe, focused on the essentials of human experience and technical precision.", styles: { fontSize: "20px", color: "#71717A", maxWidth: "600px", margin: "0 auto", lineHeight: "1.8", fontWeight: "300" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { display: "flex", justifyContent: "center", width: "100%" },
          children: [
            { id: "", order: 0, type: "button", content: "Discover the work", styles: { backgroundColor: "transparent", color: "#000000", border: "1px solid #000000", padding: "16px 48px", borderRadius: "0px", fontWeight: "400", fontSize: "15px", cursor: "pointer", letterSpacing: "0.1em", textTransform: "uppercase" } }
          ]
        },
      ],
    },
  },

  {
    id: "sb-hero-product",
    name: "Hero — SaaS Product Master",
    category: "hero",
    designStyle: "modern",
    description: "Feature-rich SaaS hero with direct product visualization and strong call-to-action focus",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 64px", backgroundColor: "#FFFFFF", display: "flex", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
        styles: { maxWidth: "1400px", width: "100%", flexWrap: "wrap" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px", minWidth: "400px" }, children: [
              { id: "", order: 0, type: "badge", content: "New: Visual Automations", styles: { backgroundColor: "#E0F2FE", color: "#0369A1", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "700", width: "fit-content" } },
              { id: "", order: 1, type: "heading", content: "Ship your product\nwithout the friction.", props: { level: 1 }, styles: { fontSize: "96px", fontWeight: "900", color: "transparent", backgroundImage: "linear-gradient(135deg, #0F172A 0%, #334155 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: "1.02", margin: "0", letterSpacing: "-0.03em" } },
              { id: "", order: 2, type: "paragraph", content: "Automate your entire workflow. From design to deployment, we provide the tools to build faster, smarter, and together.", styles: { fontSize: "20px", color: "#475569", lineHeight: "1.6", margin: "0", maxWidth: "480px" } },
              {
                id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childGap: "md" }, styles: { justifyContent: "flex-start" }, children: [
                  { id: "", order: 0, type: "button", content: "Get Started Free", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "16px 32px", borderRadius: "8px", fontWeight: "700", fontSize: "16px", cursor: "pointer" } },
                  { id: "", order: 1, type: "button", content: "View Demo", styles: { backgroundColor: "#FFFFFF", color: "#0F172A", border: "1px solid #E2E8F0", padding: "16px 32px", borderRadius: "8px", fontWeight: "600", fontSize: "16px", cursor: "pointer" } },
                ]
              },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "1.2", minWidth: "400px", padding: "20px", position: "relative" },
            children: [
              {
                id: "", order: 0, type: "container", styles: { backgroundColor: "#FFFFFF", borderRadius: "12px", border: "1px solid #E2E8F0", boxShadow: "0 50px 100px -20px rgba(0,0,0,0.1), 0 30px 60px -30px rgba(0,0,0,0.15)", overflow: "hidden" },
                children: [
                  {
                    id: "", order: 0, type: "container", styles: { height: "40px", backgroundColor: "#F8FAFC", borderBottom: "1px solid #E2E8F0", display: "flex", alignItems: "center", padding: "0 16px", gap: "8px" }, children: [
                      { id: "", order: 0, type: "container", styles: { width: "10px", height: "10px", backgroundColor: "#FF5F57", borderRadius: "50%" } },
                      { id: "", order: 1, type: "container", styles: { width: "10px", height: "10px", backgroundColor: "#FFBD2E", borderRadius: "50%" } },
                      { id: "", order: 2, type: "container", styles: { width: "10px", height: "10px", backgroundColor: "#28C840", borderRadius: "50%" } }
                    ]
                  },
                  { id: "", order: 1, type: "image", content: "", props: { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1000" }, styles: { width: "100%", height: "400px", objectFit: "cover" } }
                ]
              }
            ]
          },
        ]
      }],
    },
  },

  {
    id: "sb-hero-industrial",
    name: "Hero — Geometric Industrial",
    category: "hero",
    designStyle: "bold",
    description: "Sharp, high-contrast industrial hero with heavy borders and technical typography",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 64px", backgroundColor: "#FFFFFF", backgroundImage: "linear-gradient(#F1F5F9 1px, transparent 1px), linear-gradient(90deg, #F1F5F9 1px, transparent 1px)", backgroundSize: "40px 40px", display: "flex", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" },
        styles: { maxWidth: "1400px", width: "100%", flexWrap: "wrap" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "40px", minWidth: "400px" }, children: [
              { id: "", order: 0, type: "heading", content: "ENGINEERED\nTO SCALE.", props: { level: 1 }, styles: { fontSize: "110px", fontWeight: "900", color: "transparent", backgroundImage: "linear-gradient(to bottom, #000 0%, #334155 100%)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: "0.85", margin: "0", letterSpacing: "0.02em", fontFamily: "monospace" } },
              {
                id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: { flexWrap: "wrap" }, children: [
                  { id: "", order: 0, type: "paragraph", content: "Technical excellence in every line of code. Built for the modern enterprise that demands absolute reliability and performance under pressure.", styles: { fontSize: "18px", color: "#475569", margin: "0", lineHeight: "1.7", flex: "1", fontFamily: "monospace", minWidth: "300px" } },
                  { id: "", order: 1, type: "button", content: "Read the Docs ➚", styles: { backgroundColor: "#000000", color: "#FFFFFF", padding: "16px 32px", borderRadius: "0", fontWeight: "700", fontSize: "14px", cursor: "pointer", fontFamily: "monospace" } },
                ]
              },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "0.6", minWidth: "350px", borderLeft: "1px solid #E2E8F0", paddingLeft: "40px", display: "flex", flexDirection: "column", gap: "40px" },
            children: [
              { id: "", order: 0, type: "container", styles: { borderBottom: "1px solid #E2E8F0", paddingBottom: "20px" }, children: [{ id: "", order: 0, type: "heading", content: "[ 01 ]", styles: { color: "#64748B", fontSize: "12px", fontFamily: "monospace", marginBottom: "8px" } }, { id: "", order: 1, type: "heading", content: "FAULT TOLERANT", styles: { fontSize: "16px", fontWeight: "800" } }] },
              { id: "", order: 1, type: "container", styles: { borderBottom: "1px solid #E2E8F0", paddingBottom: "20px" }, children: [{ id: "", order: 0, type: "heading", content: "[ 02 ]", styles: { color: "#64748B", fontSize: "12px", fontFamily: "monospace", marginBottom: "8px" } }, { id: "", order: 1, type: "heading", content: "DISTRIBUTED GRID", styles: { fontSize: "16px", fontWeight: "800" } }] },
              { id: "", order: 2, type: "container", children: [{ id: "", order: 0, type: "heading", content: "[ 03 ]", styles: { color: "#64748B", fontSize: "12px", fontFamily: "monospace", marginBottom: "8px" } }, { id: "", order: 1, type: "heading", content: "ATOMIC UPDATES", styles: { fontSize: "16px", fontWeight: "800" } }] },
            ]
          }
        ]
      }],
    },
  },

  {
    id: "sb-hero-enterprise",
    name: "Hero — Enterprise Trust",
    category: "hero",
    designStyle: "corporate",
    description: "Balanced blue-themed enterprise hero with trust signals and integrated metrics",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 64px", backgroundColor: "#F8FAFC", display: "flex", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
        styles: { maxWidth: "1400px", width: "100%", flexWrap: "wrap" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1.2", display: "flex", flexDirection: "column", gap: "32px", minWidth: "400px" }, children: [
              { id: "", order: 0, type: "badge", content: "TRUSTED BY 500+ GLOBAL ENTERPRISES", styles: { color: "#1E40AF", fontSize: "12px", fontWeight: "700", letterSpacing: "0.1em" } },
              { id: "", order: 1, type: "heading", content: "Scale your business\nwith confidence.", props: { level: 1 }, styles: { fontSize: "80px", fontWeight: "800", color: "#1E293B", lineHeight: "1.1", margin: "0", letterSpacing: "-0.02em" } },
              { id: "", order: 2, type: "paragraph", content: "The world's most secure and scalable platform for building modern web experiences. We handle the infrastructure so you can focus on growth.", styles: { fontSize: "20px", color: "#475569", lineHeight: "1.6", maxWidth: "540px" } },
              {
                id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childGap: "md" }, children: [
                  { id: "", order: 0, type: "button", content: "Contact Sales", styles: { backgroundColor: "#1E40AF", color: "#FFFFFF", padding: "16px 36px", borderRadius: "8px", fontWeight: "700", fontSize: "16px" } },
                  { id: "", order: 1, type: "button", content: "Start Enterprise Trial", styles: { backgroundColor: "#FFFFFF", color: "#1E40AF", border: "1px solid #1E40AF", padding: "16px 36px", borderRadius: "8px", fontWeight: "700", fontSize: "16px" } },
                ]
              },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "0.8", minWidth: "350px", backgroundColor: "#FFFFFF", padding: "48px", borderRadius: "24px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", gap: "32px" },
            children: [
              {
                id: "", order: 0, type: "container", content: "", styles: { paddingBottom: "24px", borderBottom: "1px solid #E2E8F0" }, children: [
                  { id: "", order: 0, type: "heading", content: "99.99%", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#1E293B", margin: "0" } },
                  { id: "", order: 1, type: "paragraph", content: "Uptime guarantee across all service regions.", styles: { fontSize: "14px", color: "#64748B", margin: "0" } },
                ]
              },
              {
                id: "", order: 1, type: "container", content: "", styles: { paddingBottom: "24px", borderBottom: "1px solid #E2E8F0" }, children: [
                  { id: "", order: 0, type: "heading", content: "48%", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#1E293B", margin: "0" } },
                  { id: "", order: 1, type: "paragraph", content: "Average increase in operational efficiency.", styles: { fontSize: "14px", color: "#64748B", margin: "0" } },
                ]
              },
              {
                id: "", order: 2, type: "container", content: "", styles: {}, children: [
                  { id: "", order: 0, type: "heading", content: "94%", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#1E293B", margin: "0" } },
                  { id: "", order: 1, type: "paragraph", content: "Customer satisfaction score (CSAT) in 2025.", styles: { fontSize: "14px", color: "#64748B", margin: "0" } },
                ]
              },
            ]
          },
        ]
      }],
    },
  },

  {
    id: "sb-hero-organic",
    name: "Hero — Abstract Organic",
    category: "hero",
    designStyle: "modern",
    description: "Soft, organic hero with fluid gradients and rounded layouts for a friendly tech feel",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 40px", backgroundColor: "#FDF4FF", display: "flex", flexDirection: "column", alignItems: "center", gap: "60px", textAlign: "center", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "-100px", left: "-100px", width: "400px", height: "400px", backgroundColor: "rgba(232, 121, 249, 0.2)", borderRadius: "50%", filter: "blur(80px)" } },
        { id: "", order: 1, type: "heading", content: "Feel the flow of\nyour creativity.", props: { level: 1 }, styles: { fontSize: "84px", fontWeight: "900", color: "transparent", backgroundImage: "linear-gradient(45deg, #701A75, #D946EF)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: "1.05", margin: "0", letterSpacing: "-0.02em" } },
        { id: "", order: 2, type: "paragraph", content: "Friendly, fast, and remarkably easy. We've redesigned the web experience to move at the speed of your imagination.", styles: { fontSize: "22px", color: "#A21CAF", maxWidth: "680px", margin: "0 auto", lineHeight: "1.6", fontWeight: "400" } },
        { id: "", order: 3, type: "button", content: "Start creating free", styles: { backgroundColor: "#D946EF", color: "#FFFFFF", padding: "20px 48px", borderRadius: "100px", fontWeight: "700", fontSize: "18px", cursor: "pointer", boxShadow: "0 10px 25px rgba(217,70,239,0.3)" } },
        {
          id: "", order: 4, type: "container", content: "", styles: { marginTop: "40px", display: "flex", gap: "0" }, children: [
            { id: "", order: 0, type: "image", content: "", props: { src: "https://i.pravatar.cc/100?u=1" }, styles: { width: "48px", height: "48px", borderRadius: "50%", border: "3px solid #FFFFFF" } },
            { id: "", order: 1, type: "image", content: "", props: { src: "https://i.pravatar.cc/100?u=2" }, styles: { width: "48px", height: "48px", borderRadius: "50%", border: "3px solid #FFFFFF", marginLeft: "-12px" } },
            { id: "", order: 2, type: "image", content: "", props: { src: "https://i.pravatar.cc/100?u=3" }, styles: { width: "48px", height: "48px", borderRadius: "50%", border: "3px solid #FFFFFF", marginLeft: "-12px" } },
            { id: "", order: 3, type: "paragraph", content: "Joined by 10k+ creators this week", styles: { fontSize: "14px", color: "#A21CAF", marginLeft: "12px", display: "flex", alignItems: "center", fontWeight: "600" } },
          ]
        },
      ],
    },
  },

  {
    id: "sb-hero-editorial-classic",
    name: "Hero — Editorial Classic",
    category: "hero",
    designStyle: "minimal",
    description: "Balanced editorial hero with refined typography and centered layout",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 48px", backgroundColor: "#FFFFFF", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        { id: "", order: 0, type: "badge", content: "THE JOURNAL — ISSUE 01", styles: { color: "#64748B", fontSize: "12px", fontWeight: "600", letterSpacing: "0.15em" } },
        { id: "", order: 1, type: "heading", content: "The beauty of simplicity\nin every single detail.", props: { level: 1 }, styles: { fontSize: "72px", fontWeight: "400", color: "#0F172A", lineHeight: "1.2", margin: "0", fontFamily: "'Playfair Display', serif", maxWidth: "800px" } },
        { id: "", order: 2, type: "paragraph", content: "A deep dive into the philosophy of modern architecture and how it influences the digital spaces we inhabit today.", styles: { fontSize: "18px", color: "#64748B", maxWidth: "600px", margin: "0 auto", lineHeight: "1.7" } },
        { id: "", order: 3, type: "button", content: "Read the story", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "14px 32px", borderRadius: "100px", fontWeight: "500", fontSize: "15px", cursor: "pointer" } },
      ],
    },
  },

  {
    id: "sb-hero-search-centered",
    name: "Hero — Utility Search",
    category: "hero",
    designStyle: "modern",
    description: "Action-oriented hero with centered search for directory or documentation sites",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 48px", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "heading", content: "How can we help you today?", props: { level: 1 }, styles: { fontSize: "48px", fontWeight: "800", color: "#1E293B", lineHeight: "1.2", margin: "0", letterSpacing: "-0.02em" } },
        {
          id: "", order: 1, type: "form", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "sm", bgType: "white", successMessage: "Thanks! We'll be in touch." },
          styles: { backgroundColor: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "16px", padding: "8px 16px", width: "100%", maxWidth: "600px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" },
          children: [
            { id: "", order: 0, type: "input", content: "", props: { label: "", placeholder: "Search for components, themes, or guides...", inputType: "text", required: true }, styles: { flex: "1" } },
            { id: "", order: 1, type: "button", content: "Search", props: { buttonType: "submit" }, styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "8px 20px", borderRadius: "10px", fontWeight: "600", fontSize: "14px" } },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "md" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "Popular:", styles: { fontSize: "13px", color: "#64748B", fontWeight: "600" } },
            { id: "", order: 1, type: "text-link", content: "Installation", props: { href: "#" }, styles: { fontSize: "13px", color: "#6366F1" } },
            { id: "", order: 2, type: "text-link", content: "Customization", props: { href: "#" }, styles: { fontSize: "13px", color: "#6366F1" } },
            { id: "", order: 3, type: "text-link", content: "Components", props: { href: "#" }, styles: { fontSize: "13px", color: "#6366F1" } },
          ]
        }
      ],
    },
  },

  {
    id: "sb-hero-feature-stack",
    name: "Hero — Modern Stack",
    category: "hero",
    designStyle: "bold",
    description: "Vertical stacked hero with oversized badges and high-impact CTAs",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 48px", backgroundColor: "#000000", backgroundImage: "linear-gradient(to bottom, #000000, #0F172A)", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "badge", content: "VERSION 4.0 IS HERE", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "6px 16px", borderRadius: "99px", fontSize: "12px", fontWeight: "800", letterSpacing: "0.05em" } },
        { id: "", order: 1, type: "heading", content: "Build the future of the web.", props: { level: 1 }, styles: { fontSize: "84px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.1", margin: "0", letterSpacing: "-0.04em" } },
        { id: "", order: 2, type: "paragraph", content: "The most advanced website builder is now 10x faster and infinitely more customizable. Get started today and see the difference.", styles: { fontSize: "20px", color: "#94A3B8", maxWidth: "600px", margin: "0 auto", lineHeight: "1.6" } },
        {
          id: "", order: 4, type: "container", content: "", props: { _childLayout: "row", _childJustify: "center", _childAlign: "center", _childGap: "xl" }, styles: { marginTop: "24px", justifyContent: "center", width: "100%" }, children: [
            { id: "", order: 0, type: "button", content: "Start Building Free", styles: { backgroundColor: "#FFFFFF", color: "#000000", padding: "18px 40px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer", boxShadow: "0 10px 25px rgba(255,255,255,0.2)" } },
            { id: "", order: 1, type: "button", content: "Watch Demo", styles: { backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)", padding: "18px 40px", borderRadius: "12px", fontWeight: "600", fontSize: "16px", cursor: "pointer" } },
          ]
        }
      ],
    },
  },

  {
    id: "sb-hero-mobile-showcase",
    name: "Hero — App Showcase",
    category: "hero",
    designStyle: "modern",
    description: "Split layout optimized for mobile app screenshots and technical product features",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 64px", backgroundColor: "#FFFFFF", display: "flex", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
        styles: { maxWidth: "1280px", width: "100%", flexWrap: "wrap" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px", minWidth: "400px" },
            children: [
              { id: "", order: 0, type: "badge", content: "✦ AVAILABLE ON APP STORE", styles: { color: "#6366F1", fontSize: "11px", fontWeight: "800", letterSpacing: "0.1em" } },
              { id: "", order: 1, type: "heading", content: "Your finances,\nin your pocket.", props: { level: 1 }, styles: { fontSize: "80px", fontWeight: "800", color: "transparent", backgroundImage: "linear-gradient(135deg, #0F172A, #6366F1)", WebkitBackgroundClip: "text", backgroundClip: "text", lineHeight: "1.1", margin: "0", letterSpacing: "-0.02em" } },
              { id: "", order: 2, type: "paragraph", content: "Manage everything from spending to savings in one clean, powerful interface. Trusted by over 2 million users worldwide.", styles: { fontSize: "18px", color: "#64748B", lineHeight: "1.6" } },
              { id: "", order: 3, type: "button", content: "Download for iOS", styles: { backgroundColor: "#000000", color: "#FFFFFF", padding: "16px 36px", borderRadius: "12px", fontWeight: "700", fontSize: "16px" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "0.8", display: "flex", justifyContent: "center", minWidth: "300px" },
            children: [
              {
                id: "", order: 0, type: "container", styles: { width: "300px", height: "600px", backgroundColor: "#111827", borderRadius: "48px", border: "8px solid #1F2937", boxShadow: "0 40px 80px rgba(0,0,0,0.15)", overflow: "hidden" },
                children: [
                  { id: "", order: 0, type: "image", content: "", props: { src: "https://images.unsplash.com/photo-1551650975-87deedd944c3?auto=format&fit=crop&q=80&w=400" }, styles: { width: "100%", height: "100%", objectFit: "cover" } }
                ]
              }
            ]
          }
        ]
      }],
    },
  },

  {
    id: "sb-hero-abstract-ambient",
    name: "Hero — Abstract Ambient",
    category: "hero",
    designStyle: "creative",
    description: "Immersive artistic hero with large floating typography over a soft gradient mesh",
    element: {
      type: "container", content: "",
      styles: {
        padding: "200px 48px",
        backgroundColor: "#0F172A",
        backgroundImage: "radial-gradient(circle at 60% 30%, rgba(99, 102, 241, 0.2), transparent 40%), radial-gradient(circle at 30% 70%, rgba(217, 70, 239, 0.2), transparent 40%)",
        minHeight: "800px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        gap: "48px"
      },
      children: [
        { id: "", order: 0, type: "heading", content: "Modern design\nwith a soul.", props: { level: 1 }, styles: { fontSize: "110px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.0", margin: "0", letterSpacing: "-0.04em", textShadow: "0 10px 40px rgba(0,0,0,0.3)" } },
        { id: "", order: 1, type: "paragraph", content: "We bridge the gap between human intuition and technical precision to create digital experiences that truly resonate.", styles: { fontSize: "22px", color: "rgba(255,255,255,0.6)", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6" } },
        { id: "", order: 2, type: "button", content: "Explore the studio", styles: { backgroundColor: "transparent", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.4)", backdropFilter: "blur(10px)", padding: "18px 48px", borderRadius: "100px", fontWeight: "600", fontSize: "18px" } },
      ],
    },
  },

  // ─── FEATURES ────────────────────────────────────────────────────────────────

  {
    id: "sb-features-cards",
    name: "Features — Glass Cards",
    category: "features",
    designStyle: "modern",
    description: "Premium glassmorphism cards with gradient borders and subtle hover effects",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px", backgroundImage: "radial-gradient(circle at 50% 0%, rgba(99, 102, 241, 0.1) 0%, transparent 50%)" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
            { id: "", order: 0, type: "badge", content: "ENGINEERING EXCELLENCE", styles: { color: "#818CF8", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "Built for the next generation of web applications.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
            { id: "", order: 2, type: "paragraph", content: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", styles: { fontSize: "20px", color: "rgba(255,255,255,0.6)", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "xl" }, styles: { width: "100%", maxWidth: "1280px" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.03)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px", transition: "transform 0.3s ease" }, children: [
                { id: "", order: 0, type: "paragraph", content: "⚡", styles: { fontSize: "32px", margin: "0", backgroundColor: "rgba(99,102,241,0.1)", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(99,102,241,0.2)" } },
                { id: "", order: 1, type: "heading", content: "Lightning Performance", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", styles: { color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.7", fontSize: "16px" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.03)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🔒", styles: { fontSize: "32px", margin: "0", backgroundColor: "rgba(16,185,129,0.1)", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(16,185,129,0.2)" } },
                { id: "", order: 1, type: "heading", content: "Military-Grade Security", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", styles: { color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.7", fontSize: "16px" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.03)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(12px)", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🔄", styles: { fontSize: "32px", margin: "0", backgroundColor: "rgba(245,158,11,0.1)", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(245,158,11,0.2)" } },
                { id: "", order: 1, type: "heading", content: "Seamless Integration", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", styles: { color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.7", fontSize: "16px" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-features-dark-bento",
    name: "Features — Advanced Bento",
    category: "features",
    designStyle: "dark",
    description: "Multi-scale bento grid with dynamic cell sizes and integrated data visualization",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
            { id: "", order: 0, type: "badge", content: "BEYOND THE SURFACE", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "A new paradigm for\ndigital infrastructure.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.04em", whiteSpace: "pre-line", lineHeight: "1.1" } },
            { id: "", order: 2, type: "paragraph", content: "Every detail matters. We've refined every interaction to provide the most fluid experience possible.", styles: { fontSize: "20px", color: "#94A3B8", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "lg" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "32px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px", flex: "2", minWidth: "400px", position: "relative" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", right: "0", width: "200px", height: "200px", backgroundImage: "radial-gradient(circle at top right, rgba(99,102,241,0.1), transparent)", pointerEvents: "none" } },
                { id: "", order: 1, type: "paragraph", content: "🚀", styles: { fontSize: "40px", margin: "0" } },
                { id: "", order: 2, type: "heading", content: "Global Deployment", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#FFFFFF", margin: "0", letterSpacing: "-0.02em" } },
                { id: "", order: 3, type: "paragraph", content: "Your application is distributed across 300+ nodes globally, ensuring lightspeed access for every user, everywhere.", styles: { fontSize: "17px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "32px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "280px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🛡️", styles: { fontSize: "40px", margin: "0" } },
                { id: "", order: 1, type: "heading", content: "DDoS Guard", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Active protection that evolves with threats.", styles: { fontSize: "16px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#0F172A", border: "1px solid #1E293B", borderRadius: "32px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px", flex: "1.2", minWidth: "320px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "📊", styles: { fontSize: "40px", margin: "0" } },
                { id: "", order: 1, type: "heading", content: "Telemetry", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Deep insights into every layer of your application stack.", styles: { fontSize: "16px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "#6366F1", border: "1px solid #818CF8", borderRadius: "32px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px", flex: "1.8", minWidth: "400px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "✨", styles: { fontSize: "40px", margin: "0" } },
                { id: "", order: 1, type: "heading", content: "AI Integration", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Harness the power of machine learning with native integrations that make your product smarter by default.", styles: { fontSize: "17px", color: "rgba(255,255,255,0.8)", margin: "0", lineHeight: "1.7" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-features-alternating",
    name: "Features — Editorial Z-Pattern",
    category: "features",
    designStyle: "minimal",
    description: "Premium editorial layout with large decorative numbers and high-contrast typography",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 40px", backgroundColor: "#FAF9F6", display: "flex", flexDirection: "column", gap: "180px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: { maxWidth: "1280px", margin: "0 auto", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1.2", display: "flex", flexDirection: "column", gap: "40px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "01", styles: { fontSize: "120px", fontWeight: "900", color: "#E5E4E0", margin: "0", lineHeight: "0.8", fontFamily: "'Playfair Display', serif" } },
                { id: "", order: 1, type: "heading", content: "Universal\nCollaboration.", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "300", color: "#1A1A1A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.0", fontFamily: "'Playfair Display', serif" } },
                { id: "", order: 2, type: "paragraph", content: "Break down the barriers between teams and departments. Our platform provides a single source of truth for your entire organization.", styles: { fontSize: "20px", color: "#4A4A4A", margin: "0", lineHeight: "1.8", maxWidth: "480px" } },
                { id: "", order: 3, type: "text-link", content: "READ THE MANIFESTO", props: { href: "#" }, styles: { fontSize: "13px", fontWeight: "800", color: "#1A1A1A", textDecoration: "none", borderBottom: "2px solid #1A1A1A", width: "fit-content", letterSpacing: "0.1em" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", backgroundColor: "#FFFFFF", borderRadius: "8px", height: "500px", boxShadow: "40px 40px 80px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }, children: [
                { id: "", order: 0, type: "image", content: "", props: { src: "https://images.unsplash.com/photo-1522071823907-f9d6de0c0f50?auto=format&fit=crop&q=80&w=800" }, styles: { width: "100%", height: "100%", objectFit: "cover" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: { maxWidth: "1280px", margin: "0 auto", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", backgroundColor: "#FFFFFF", borderRadius: "8px", height: "500px", boxShadow: "-40px 40px 80px rgba(0,0,0,0.05)", position: "relative", overflow: "hidden" }, children: [
                { id: "", order: 0, type: "image", content: "", props: { src: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800" }, styles: { width: "100%", height: "100%", objectFit: "cover" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1.2", display: "flex", flexDirection: "column", gap: "40px", paddingLeft: "80px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "02", styles: { fontSize: "120px", fontWeight: "900", color: "#E5E4E0", margin: "0", lineHeight: "0.8", fontFamily: "'Playfair Display', serif" } },
                { id: "", order: 1, type: "heading", content: "Intelligence\nby Design.", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "300", color: "#1A1A1A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.0", fontFamily: "'Playfair Display', serif" } },
                { id: "", order: 2, type: "paragraph", content: "Make informed decisions with data that updates in real-time. We don't just show you what's happening, we show you why.", styles: { fontSize: "20px", color: "#4A4A4A", margin: "0", lineHeight: "1.8", maxWidth: "480px" } },
                { id: "", order: 3, type: "text-link", content: "VIEW CAPABILITIES", props: { href: "#" }, styles: { fontSize: "13px", fontWeight: "800", color: "#1A1A1A", textDecoration: "none", borderBottom: "2px solid #1A1A1A", width: "fit-content", letterSpacing: "0.1em" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-features-steps",
    name: "Features — Cinematic Steps",
    category: "features",
    designStyle: "modern",
    description: "Modern vertical or horizontal step flow with large background indices and connector lines",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#000000", display: "flex", flexDirection: "column", alignItems: "center", gap: "100px", overflow: "hidden" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
            { id: "", order: 0, type: "badge", content: "THREE STEPS TO SUCCESS", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "How to ship perfection.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" }, styles: { maxWidth: "1200px", width: "100%", position: "relative" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px", position: "relative" }, children: [
                { id: "", order: 0, type: "paragraph", content: "01", styles: { fontSize: "100px", fontWeight: "900", color: "rgba(255,255,255,0.05)", position: "absolute", top: "-40px", left: "-20px", pointerEvents: "none" } },
                { id: "", order: 1, type: "heading", content: "Configuration", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#FFFFFF", margin: "0", position: "relative", zIndex: "2" } },
                { id: "", order: 2, type: "paragraph", content: "Connect your repository and we'll automatically detect your framework settings.", styles: { fontSize: "18px", color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.7", position: "relative", zIndex: "2" } },
                { id: "", order: 3, type: "container", content: "", styles: { height: "2px", backgroundColor: "#6366F1", width: "40px" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px", position: "relative" }, children: [
                { id: "", order: 0, type: "paragraph", content: "02", styles: { fontSize: "100px", fontWeight: "900", color: "rgba(255,255,255,0.05)", position: "absolute", top: "-40px", left: "-20px", pointerEvents: "none" } },
                { id: "", order: 1, type: "heading", content: "Optimization", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#FFFFFF", margin: "0", position: "relative", zIndex: "2" } },
                { id: "", order: 2, type: "paragraph", content: "Our AI engine analyzes your code for performance bottlenecks and automatically applies fixes.", styles: { fontSize: "18px", color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.7", position: "relative", zIndex: "2" } },
                { id: "", order: 3, type: "container", content: "", styles: { height: "2px", backgroundColor: "#8B5CF6", width: "40px" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px", position: "relative" }, children: [
                { id: "", order: 0, type: "paragraph", content: "03", styles: { fontSize: "100px", fontWeight: "900", color: "rgba(255,255,255,0.05)", position: "absolute", top: "-40px", left: "-20px", pointerEvents: "none" } },
                { id: "", order: 1, type: "heading", content: "Deployment", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#FFFFFF", margin: "0", position: "relative", zIndex: "2" } },
                { id: "", order: 2, type: "paragraph", content: "Ship to our global edge network in seconds. Scale to millions of users without breaking a sweat.", styles: { fontSize: "18px", color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.7", position: "relative", zIndex: "2" } },
                { id: "", order: 3, type: "container", content: "", styles: { height: "2px", backgroundColor: "#EC4899", width: "40px" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-features-bold-grid",
    name: "Features — Neo Brutalist",
    category: "features",
    designStyle: "bold",
    description: "High-contrast geometric grid with sharp shadows and neon accents",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#000000", display: "flex", flexDirection: "column", alignItems: "center", gap: "72px" },
      children: [
        { id: "", order: 0, type: "heading", content: "UNCOMPROMISING\nPERFORMANCE.", props: { level: 2 }, styles: { fontSize: "80px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.06em", textAlign: "center", lineHeight: "0.9", textTransform: "uppercase" } },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childGap: "xl" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#00FF66", borderRadius: "0px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px", border: "4px solid #000000", boxShadow: "12px 12px 0 #FFFFFF" }, children: [
                { id: "", order: 0, type: "paragraph", content: "01", styles: { fontSize: "40px", fontWeight: "900", color: "#000000" } },
                { id: "", order: 1, type: "heading", content: "RAW SPEED.", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#000000", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Engineered for maximum throughput and minimum latency. No overhead, just pure power.", styles: { fontSize: "18px", color: "#000000", margin: "0", lineHeight: "1.4", fontWeight: "600" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#FF00FF", borderRadius: "0px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px", border: "4px solid #000000", boxShadow: "12px 12px 0 #FFFFFF" }, children: [
                { id: "", order: 0, type: "paragraph", content: "02", styles: { fontSize: "40px", fontWeight: "900", color: "#000000" } },
                { id: "", order: 1, type: "heading", content: "TOTAL CONTROL.", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#000000", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Granular configuration options that give you full mastery over your environment.", styles: { fontSize: "18px", color: "#000000", margin: "0", lineHeight: "1.4", fontWeight: "600" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#00E0FF", borderRadius: "0px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px", border: "4px solid #000000", boxShadow: "12px 12px 0 #FFFFFF" }, children: [
                { id: "", order: 0, type: "paragraph", content: "03", styles: { fontSize: "40px", fontWeight: "900", color: "#000000" } },
                { id: "", order: 1, type: "heading", content: "VIVID INSIGHTS.", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#000000", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Real-time telemetry and visualization that makes complex data clear.", styles: { fontSize: "18px", color: "#000000", margin: "0", lineHeight: "1.4", fontWeight: "600" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-features-checklist",
    name: "Features — Enterprise Checklist",
    category: "features",
    designStyle: "minimal",
    description: "Multi-column feature checklist with refined icons and balanced typography",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#F8FAFC" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" },
        styles: { maxWidth: "1280px", margin: "0 auto" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px", position: "sticky", top: "40px" }, children: [
              { id: "", order: 0, type: "badge", content: "FULL CAPABILITIES", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
              { id: "", order: 1, type: "heading", content: "Everything you need\nto dominate your\nmarket.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
              { id: "", order: 2, type: "paragraph", content: "We've built a comprehensive toolkit that addresses every challenge modern businesses face. No compromise, just excellence.", styles: { fontSize: "20px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
              { id: "", order: 3, type: "button", content: "DOWNLOAD FULL SPECS", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "18px 36px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer", width: "fit-content", boxShadow: "0 10px 20px rgba(15,23,42,0.1)" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "1.2", display: "flex", flexDirection: "column", gap: "16px" }, children: [
              {
                id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "md" }, styles: { padding: "32px", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0" }, children: [
                  { id: "", order: 0, type: "paragraph", content: "󰄬", styles: { fontSize: "24px", fontWeight: "700", color: "#10B981", margin: "0" } },
                  {
                    id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
                      { id: "", order: 0, type: "heading", content: "Unlimited Scale", props: { level: 4 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                      { id: "", order: 1, type: "paragraph", content: "From your first 100 users to your first 100 million. Our infrastructure grows with you.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                    ]
                  }
                ]
              },
              {
                id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "md" }, styles: { padding: "32px", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0" }, children: [
                  { id: "", order: 0, type: "paragraph", content: "󰄬", styles: { fontSize: "24px", fontWeight: "700", color: "#10B981", margin: "0" } },
                  {
                    id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
                      { id: "", order: 0, type: "heading", content: "99.99% Uptime SLA", props: { level: 4 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                      { id: "", order: 1, type: "paragraph", content: "Enterprise-grade reliability backed by legal guarantees. We never sleep, so you can.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                    ]
                  }
                ]
              },
              {
                id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "md" }, styles: { padding: "32px", backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E2E8F0" }, children: [
                  { id: "", order: 0, type: "paragraph", content: "󰄬", styles: { fontSize: "24px", fontWeight: "700", color: "#10B981", margin: "0" } },
                  {
                    id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
                      { id: "", order: 0, type: "heading", content: "Open Ecosystem", props: { level: 4 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                      { id: "", order: 1, type: "paragraph", content: "500+ pre-built integrations with the tools your team already loves and uses.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                    ]
                  }
                ]
              },
            ]
          },
        ],
      }],
    },
  },

  // ─── CTA ─────────────────────────────────────────────────────────────────────

  {
    id: "sb-cta-dark",
    name: "CTA — Magnetic Pulse",
    category: "cta",
    designStyle: "dark",
    description: "Magnetic centered CTA with radial glow and high-impact typography",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 40px", backgroundColor: "#030712", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "1000px", height: "1000px", backgroundImage: "radial-gradient(circle at center, rgba(99, 102, 241, 0.15) 0%, transparent 70%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px", position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "heading", content: "Ready to join the\nfuture of the web?", props: { level: 2 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em", lineHeight: "1.0" } },
            { id: "", order: 1, type: "paragraph", content: "Deploy your first application in less than 5 minutes. No credit card required, infinite possibilities included.", styles: { fontSize: "22px", color: "#94A3B8", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childJustify: "center", _childGap: "lg" }, styles: { position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "button", content: "GET STARTED NOW", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "20px 48px", borderRadius: "12px", fontWeight: "800", fontSize: "17px", cursor: "pointer", border: "none", boxShadow: "0 20px 40px rgba(99,102,241,0.3)" } },
            { id: "", order: 1, type: "button", content: "BOOK A DEMO", styles: { backgroundColor: "transparent", color: "#FFFFFF", border: "2px solid rgba(255,255,255,0.1)", padding: "20px 48px", borderRadius: "12px", fontWeight: "700", fontSize: "17px", cursor: "pointer" } },
          ]
        },
        { id: "", order: 3, type: "paragraph", content: "Trusted by 100,000+ developers globally", styles: { fontSize: "14px", color: "#475569", margin: "0", letterSpacing: "0.05em", fontWeight: "700" } },
      ],
    },
  },

  {
    id: "sb-cta-gradient",
    name: "CTA — Glass Gradient",
    category: "cta",
    designStyle: "modern",
    description: "Vivid multi-stop gradient with glassmorphism overlay and floating animation",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        styles: { backgroundImage: "linear-gradient(135deg,#6366F1 0%,#EC4899 50%,#F59E0B 100%)", borderRadius: "48px", padding: "100px 80px", maxWidth: "1100px", width: "100%", textAlign: "center", display: "flex", flexDirection: "column", gap: "40px", alignItems: "center", position: "relative", overflow: "hidden", boxShadow: "0 40px 80px rgba(99,102,241,0.2)" },
        children: [
          { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(4px)", pointerEvents: "none" } },
          { id: "", order: 1, type: "heading", content: "The future is yours to build.", props: { level: 2 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em", position: "relative", zIndex: "2" } },
          { id: "", order: 2, type: "paragraph", content: "Stop waiting for the perfect moment. Create it today with the world's most advanced platform.", styles: { fontSize: "24px", color: "rgba(255,255,255,0.9)", margin: "0", lineHeight: "1.6", maxWidth: "700px", position: "relative", zIndex: "2" } },
          {
            id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childJustify: "center", _childGap: "lg" }, styles: { position: "relative", zIndex: "2" }, children: [
              { id: "", order: 0, type: "button", content: "GET STARTED FOR FREE", styles: { backgroundColor: "#FFFFFF", color: "#000000", padding: "20px 48px", borderRadius: "16px", fontWeight: "900", fontSize: "17px", cursor: "pointer", boxShadow: "0 10px 20px rgba(0,0,0,0.1)" } },
            ]
          },
        ],
      }],
    },
  },

  {
    id: "sb-cta-split",
    name: "CTA — Editorial Split",
    category: "cta",
    designStyle: "minimal",
    description: "High-contrast editorial split layout with oversized typography and focus form",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 40px", backgroundColor: "#000000", position: "relative", overflow: "hidden" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
        styles: { maxWidth: "1280px", margin: "0 auto" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1.2", display: "flex", flexDirection: "column", gap: "32px" }, children: [
              { id: "", order: 0, type: "badge", content: "LIMITED ACCESS", styles: { color: "#818CF8", fontSize: "12px", fontWeight: "800", letterSpacing: "0.2em" } },
              { id: "", order: 1, type: "heading", content: "Be the first to see\nthe future.", props: { level: 2 }, styles: { fontSize: "80px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.06em", lineHeight: "0.9", textTransform: "uppercase" } },
              { id: "", order: 2, type: "paragraph", content: "We're onboarding a limited number of partners each week. Secure your place in the next cohort.", styles: { fontSize: "20px", color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.7", maxWidth: "480px" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px", backgroundColor: "#FFFFFF", padding: "64px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)" }, children: [
              { id: "", order: 0, type: "heading", content: "Secure Your Spot", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#000000", margin: "0" } },
              {
                id: "", order: 1, type: "form", content: "",
                props: { bgType: "white", successMessage: "You're on the list! We'll be in touch soon." },
                styles: { padding: "0", backgroundColor: "transparent" },
                children: [
                  { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "your.name@company.com", required: true }, styles: {} },
                  { id: "", order: 1, type: "button", content: "REQUEST EARLY ACCESS", props: { submitForm: true, accentColor: "#000000", fullWidth: true }, styles: {} },
                ],
              },
              { id: "", order: 2, type: "paragraph", content: "󱠔 Join 12,000+ teams already on the waitlist.", styles: { fontSize: "14px", color: "#64748B", margin: "0", fontWeight: "600" } },
            ]
          },
        ],
      }],
    },
  },

  {
    id: "sb-cta-simple",
    name: "CTA — Simple Centered",
    category: "cta",
    designStyle: "minimal",
    description: "Minimal centered CTA — just a heading and one button",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FFFFFF", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Ready to get started?", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
        { id: "", order: 1, type: "paragraph", content: "Try it free for 14 days. No credit card required.", styles: { fontSize: "18px", color: "#6B7280", margin: "0" } },
        { id: "", order: 2, type: "button", content: "Start your free trial →", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "18px 44px", borderRadius: "10px", fontWeight: "700", fontSize: "18px", cursor: "pointer" } },
      ],
    },
  },

  {
    id: "sb-cta-newsletter",
    name: "CTA — Newsletter",
    category: "cta",
    designStyle: "minimal",
    description: "Clean email newsletter subscription with inline input and button",
    element: {
      type: "form", content: "",
      props: { bgType: "light", successMessage: "You're subscribed! Welcome aboard." },
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "560px", margin: "0 auto" }, children: [
            { id: "", order: 0, type: "heading", content: "Stay in the loop", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0", letterSpacing: "-0.03em" } },
            { id: "", order: 1, type: "paragraph", content: "Get weekly insights on design, development, and the future of the web.", styles: { fontSize: "17px", color: "#6B7280", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "stretch", _childGap: "sm" }, styles: { maxWidth: "480px", width: "100%", margin: "0 auto" }, children: [
            { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "Enter your email…", required: true }, styles: { flex: "1" } },
            { id: "", order: 1, type: "button", content: "Subscribe", props: { submitForm: true, accentColor: "#111827" }, styles: {} },
          ]
        },
        { id: "", order: 2, type: "paragraph", content: "12,000+ subscribers · Weekly · Unsubscribe anytime", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0" } },
      ],
    },
  },

  {
    id: "sb-cta-bold",
    name: "CTA — Bold Full-Width",
    category: "cta",
    designStyle: "bold",
    description: "Maximum impact CTA with giant typography on a vivid background",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 64px", backgroundColor: "#F59E0B", display: "flex", flexDirection: "column", gap: "40px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Stop waiting.\nStart building.", props: { level: 2 }, styles: { fontSize: "88px", fontWeight: "900", color: "#000000", margin: "0", letterSpacing: "-0.05em", lineHeight: "0.95", whiteSpace: "pre-line" } },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: {}, children: [
            { id: "", order: 0, type: "button", content: "LET'S GO →", styles: { backgroundColor: "#000000", color: "#F59E0B", padding: "20px 48px", borderRadius: "4px", fontWeight: "900", fontSize: "18px", letterSpacing: "0.05em", cursor: "pointer" } },
            { id: "", order: 1, type: "paragraph", content: "Free to start. No contracts.", styles: { fontSize: "17px", color: "rgba(0,0,0,0.6)", margin: "0", fontWeight: "600" } },
          ]
        },
      ],
    },
  },

  // ─── TESTIMONIALS ────────────────────────────────────────────────────────────

  {
    id: "sb-testimonials-grid",
    name: "Testimonials — Modern Bento",
    category: "testimonials",
    designStyle: "modern",
    description: "Premium bento-style testimonial grid with varied card layouts and floating avatars",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }, children: [
            { id: "", order: 0, type: "badge", content: "COMMUNITY FEEDBACK", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "Loved by teams\nshipping the future.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "xl" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", padding: "48px", borderRadius: "32px", border: "1px solid #E2E8F0", boxShadow: "0 10px 30px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "32px", flex: "1.2", minWidth: "360px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "48px", color: "#6366F1", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } },
                { id: "", order: 1, type: "paragraph", content: "The transition was seamless. We were able to move our entire infrastructure in a weekend, and the performance gains were immediate. Our site speed increased by 40% globally.", styles: { fontSize: "20px", color: "#334155", margin: "0", lineHeight: "1.6", fontWeight: "500" } },
                {
                  id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "md" }, styles: { marginTop: "auto" }, children: [
                    { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "SC", styles: { color: "#6366F1", fontWeight: "800", margin: "0", fontSize: "18px" } }] },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "Sarah Chen", styles: { fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                        { id: "", order: 1, type: "paragraph", content: "CTO @ ACME CORP", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "700", letterSpacing: "0.05em" } },
                      ]
                    },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#0F172A", padding: "48px", borderRadius: "32px", border: "1px solid #1E293B", boxShadow: "0 10px 30px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column", gap: "32px", flex: "1", minWidth: "320px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "48px", color: "#818CF8", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } },
                { id: "", order: 1, type: "paragraph", content: "Finally, a developer-first platform that doesn't sacrifice ease of use for power. It's the standard we've been waiting for.", styles: { fontSize: "18px", color: "#94A3B8", margin: "0", lineHeight: "1.7", fontStyle: "italic" } },
                {
                  id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "md" }, styles: { marginTop: "auto" }, children: [
                    { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "MJ", styles: { color: "#FFFFFF", fontWeight: "800", margin: "0", fontSize: "18px" } }] },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "Marcus Johnson", styles: { fontSize: "16px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                        { id: "", order: 1, type: "paragraph", content: "SDE @ VERIZON", styles: { fontSize: "13px", color: "#475569", margin: "0", fontWeight: "700", letterSpacing: "0.05em" } },
                      ]
                    },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundImage: "linear-gradient(135deg, #EEF2FF, #FAFAFA)", padding: "48px", borderRadius: "32px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "32px", flex: "1", minWidth: "320px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "48px", color: "#6366F1", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } },
                { id: "", order: 1, type: "paragraph", content: "We switched from three different tools to this one platform and cut our infrastructure bill by 60%. The ROI was visible within the first month.", styles: { fontSize: "18px", color: "#334155", margin: "0", lineHeight: "1.7", fontWeight: "500" } },
                {
                  id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "md" }, styles: { marginTop: "auto" }, children: [
                    { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "PR", styles: { color: "#6366F1", fontWeight: "800", margin: "0", fontSize: "18px" } }] },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "Priya Rajan", styles: { fontSize: "16px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                        { id: "", order: 1, type: "paragraph", content: "VP ENGINEERING @ FINZO", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "700", letterSpacing: "0.05em" } },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-testimonials-large",
    name: "Testimonials — Ambient Impact",
    category: "testimonials",
    designStyle: "minimal",
    description: "High-impact single testimonial with oversized ambient typography and cinematic glow",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 40px", backgroundColor: "#000000", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "800px", height: "800px", backgroundImage: "radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "1000px", display: "flex", flexDirection: "column", gap: "40px", position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "80px", color: "rgba(255,255,255,0.2)", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } },
            { id: "", order: 1, type: "heading", content: "This is the best tool we've ever used.\nIt completely transformed how we build and ship products.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", lineHeight: "1.1", letterSpacing: "-0.05em" } },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "container", content: "", styles: { width: "64px", height: "64px", borderRadius: "20px", backgroundColor: "#1E293B", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "AR", styles: { color: "#FFFFFF", fontWeight: "800", fontSize: "20px" } }] },
            {
              id: "", order: 1, type: "container", content: "", styles: { textAlign: "center" }, children: [
                { id: "", order: 0, type: "paragraph", content: "Alex Rivera", styles: { fontSize: "18px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "CO-FOUNDER @ BUILDFAST", styles: { fontSize: "14px", color: "#64748B", margin: "4px 0 0", fontWeight: "700", letterSpacing: "0.1em" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-testimonials-dark",
    name: "Testimonials — Dark Wall",
    category: "testimonials",
    designStyle: "dark",
    description: "Dark background testimonial wall with green accent quotes",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }, children: [
            { id: "", order: 0, type: "heading", content: "Don't take our word for it", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "800", color: "#F1F5F9", margin: "0", letterSpacing: "-0.03em" } },
            { id: "", order: 1, type: "paragraph", content: "Thousands of developers trust us every day.", styles: { fontSize: "18px", color: "#64748B", margin: "0" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "md" }, styles: { maxWidth: "1100px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "32px", flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "\"Absolute game-changer for our deployment pipeline. Went from hours to minutes.\"", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", lineHeight: "1.7", fontStyle: "italic" } },
                { id: "", order: 1, type: "paragraph", content: "— Jordan Lee, DevOps at Netflix", styles: { fontSize: "13px", color: "#4ADE80", margin: "0", fontWeight: "600" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "32px", flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "\"The DX is unmatched. Our engineers are finally excited to deploy on Fridays.\"", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", lineHeight: "1.7", fontStyle: "italic" } },
                { id: "", order: 1, type: "paragraph", content: "— Priya Mehta, Principal Eng at Shopify", styles: { fontSize: "13px", color: "#4ADE80", margin: "0", fontWeight: "600" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#0F172A", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "16px", padding: "32px", flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "\"Scaled from 10k to 10M users without changing a single line of infrastructure config.\"", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", lineHeight: "1.7", fontStyle: "italic" } },
                { id: "", order: 1, type: "paragraph", content: "— Sam Torres, CTO at Finzo", styles: { fontSize: "13px", color: "#4ADE80", margin: "0", fontWeight: "600" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── PRICING ─────────────────────────────────────────────────────────────────

  {
    id: "sb-pricing-table",
    name: "Pricing — Tiered Glass",
    category: "pricing",
    designStyle: "modern",
    description: "Premium tiered pricing with glassmorphism effects and high-impact featured tier",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }, children: [
            { id: "", order: 0, type: "badge", content: "TRANSPARENT VALUE", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "Flexible plans for\nevery stage of growth.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "stretch", _childGap: "xl" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", backgroundColor: "#F8FAFC", borderRadius: "32px", padding: "64px", display: "flex", flexDirection: "column", gap: "40px", border: "1px solid #E2E8F0" }, children: [
                { id: "", order: 0, type: "heading", content: "Startup", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                {
                  id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "xs" }, styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "$0", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "/MO", styles: { fontSize: "14px", color: "#64748B", margin: "16px 0 0", fontWeight: "800" } },
                  ]
                },
                { id: "", order: 2, type: "button", content: "START FOR FREE", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "18px 24px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", cursor: "pointer", textAlign: "center" } },
                {
                  id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓  Up to 3 projects", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                    { id: "", order: 1, type: "paragraph", content: "✓  Community analytics", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                    { id: "", order: 2, type: "paragraph", content: "✓  Global CDN", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1.1", backgroundColor: "#0F172A", borderRadius: "32px", padding: "64px", display: "flex", flexDirection: "column", gap: "40px", position: "relative", boxShadow: "0 40px 80px rgba(99,102,241,0.2)" }, children: [
                { id: "", order: 0, type: "badge", content: "MOST POPULAR", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", letterSpacing: "0.05em" } },
                { id: "", order: 1, type: "heading", content: "Pro", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                {
                  id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "xs" }, styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "$49", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "/MO", styles: { fontSize: "14px", color: "#94A3B8", margin: "16px 0 0", fontWeight: "800" } },
                  ]
                },
                { id: "", order: 3, type: "button", content: "START FREE TRIAL", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "18px 24px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", cursor: "pointer", textAlign: "center" } },
                {
                  id: "", order: 4, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓  Unlimited projects", styles: { fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "500" } },
                    { id: "", order: 1, type: "paragraph", content: "✓  Advanced analytics & exports", styles: { fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "500" } },
                    { id: "", order: 2, type: "paragraph", content: "✓  24/7 Priority support", styles: { fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "500" } },
                    { id: "", order: 3, type: "paragraph", content: "✓  Custom domains & SSL", styles: { fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "500" } },
                    { id: "", order: 4, type: "paragraph", content: "✓  API access + webhooks", styles: { fontSize: "16px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "500" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { flex: "1", backgroundColor: "#F8FAFC", borderRadius: "32px", padding: "64px", display: "flex", flexDirection: "column", gap: "40px", border: "1px solid #E2E8F0" }, children: [
                { id: "", order: 0, type: "heading", content: "Enterprise", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                {
                  id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "xs" }, styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "Custom", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
                  ]
                },
                { id: "", order: 2, type: "button", content: "CONTACT SALES", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "18px 24px", borderRadius: "12px", fontWeight: "800", fontSize: "14px", cursor: "pointer", textAlign: "center" } },
                {
                  id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓  Everything in Pro", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                    { id: "", order: 1, type: "paragraph", content: "✓  Unlimited seats & storage", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                    { id: "", order: 2, type: "paragraph", content: "✓  Dedicated SLA & support", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                    { id: "", order: 3, type: "paragraph", content: "✓  SSO / SAML authentication", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                    { id: "", order: 4, type: "paragraph", content: "✓  Custom contracts & invoicing", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "500" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-pricing-minimal",
    name: "Pricing — Geometric Bold",
    category: "pricing",
    designStyle: "minimal",
    description: "High-contrast geometric pricing with bold lines and oversized typography",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }, children: [
            { id: "", order: 0, type: "heading", content: "Decide your speed.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#000000", margin: "0", letterSpacing: "-0.05em" } },
            { id: "", order: 1, type: "paragraph", content: "Simple tiers. No hidden complexity.", styles: { fontSize: "20px", color: "#64748B", margin: "0" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "stretch", _childGap: "none" }, styles: { maxWidth: "1000px", width: "100%", border: "2px solid #000000", borderRadius: "32px", overflow: "hidden" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", padding: "64px", display: "flex", flexDirection: "column", gap: "32px", borderRight: "2px solid #000000" }, children: [
                { id: "", order: 0, type: "heading", content: "BASIC", props: { level: 3 }, styles: { fontSize: "14px", fontWeight: "900", color: "#000000", margin: "0", letterSpacing: "0.2em" } },
                { id: "", order: 1, type: "heading", content: "$0", props: { level: 2 }, styles: { fontSize: "80px", fontWeight: "900", color: "#000000", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 2, type: "paragraph", content: "Perfect for experiments and non-commercial side projects.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                { id: "", order: 3, type: "button", content: "GET STARTED", styles: { backgroundColor: "#F1F5F9", color: "#000000", padding: "20px", borderRadius: "12px", fontWeight: "900", fontSize: "15px", cursor: "pointer", textAlign: "center" } },
                {
                  id: "", order: 4, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #E2E8F0", paddingTop: "32px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓  3 projects", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                    { id: "", order: 1, type: "paragraph", content: "✓  5 GB storage", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                    { id: "", order: 2, type: "paragraph", content: "✓  Basic analytics", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                    { id: "", order: 3, type: "paragraph", content: "✓  Community support", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", padding: "64px", display: "flex", flexDirection: "column", gap: "32px", backgroundColor: "#000000" }, children: [
                { id: "", order: 0, type: "heading", content: "UNLIMITED", props: { level: 3 }, styles: { fontSize: "14px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "0.2em" } },
                { id: "", order: 1, type: "heading", content: "$49", props: { level: 2 }, styles: { fontSize: "80px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 2, type: "paragraph", content: "Everything we offer. No limits. Full support. Forever.", styles: { fontSize: "16px", color: "rgba(255,255,255,0.6)", margin: "0", lineHeight: "1.6" } },
                { id: "", order: 3, type: "button", content: "GO UNLIMITED NOW", styles: { backgroundColor: "#FFFFFF", color: "#000000", padding: "20px", borderRadius: "12px", fontWeight: "900", fontSize: "15px", cursor: "pointer", textAlign: "center" } },
                {
                  id: "", order: 4, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "32px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓  Unlimited projects", styles: { fontSize: "15px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "600" } },
                    { id: "", order: 1, type: "paragraph", content: "✓  Unlimited storage", styles: { fontSize: "15px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "600" } },
                    { id: "", order: 2, type: "paragraph", content: "✓  Advanced analytics", styles: { fontSize: "15px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "600" } },
                    { id: "", order: 3, type: "paragraph", content: "✓  Priority 24/7 support", styles: { fontSize: "15px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "600" } },
                    { id: "", order: 4, type: "paragraph", content: "✓  Custom domains & API access", styles: { fontSize: "15px", color: "rgba(255,255,255,0.7)", margin: "0", fontWeight: "600" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── STATS ───────────────────────────────────────────────────────────────────

  {
    id: "sb-stats",
    name: "Stats — Cinematic Dark",
    category: "stats",
    designStyle: "dark",
    description: "4 cinematic metrics with flowing border light and high-impact typography",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "0", width: "100%", height: "1px", backgroundColor: "rgba(99, 102, 241, 0.5)" } },
        { id: "", order: 1, type: "heading", content: "Infrastructure built\nfor the next decade.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em", textAlign: "center", lineHeight: "1.1" } },
        {
          id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", padding: "40px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                { id: "", order: 0, type: "heading", content: "120M+", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#6366F1", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "ACTIVE USERS", styles: { fontSize: "12px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.2em" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", padding: "40px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                { id: "", order: 0, type: "heading", content: "99.99%", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#10B981", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "UPTIME SLA", styles: { fontSize: "12px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.2em" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { flex: "1", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", padding: "40px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                { id: "", order: 0, type: "heading", content: "2.4B", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F59E0B", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "REQUESTS / DAY", styles: { fontSize: "12px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.2em" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { flex: "1", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", padding: "40px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                { id: "", order: 0, type: "heading", content: "<10ms", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#EC4899", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "GLOBAL LATENCY", styles: { fontSize: "12px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.2em" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-stats-light",
    name: "Stats — Minimal Editorial",
    category: "stats",
    designStyle: "minimal",
    description: "Clean editorial stats with oversized numbers and delicate separators",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FFFFFF" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "start", _childJustify: "between" },
        styles: { maxWidth: "1280px", margin: "0 auto", width: "100%" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px", padding: "0 40px", borderRight: "1px solid #F1F5F9" }, children: [
              { id: "", order: 0, type: "heading", content: "15k+", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "300", color: "#0F172A", margin: "0", letterSpacing: "-0.05em" } },
              { id: "", order: 1, type: "paragraph", content: "Customers worldwide trusting our infrastructure every single day.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.5" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px", padding: "0 40px", borderRight: "1px solid #F1F5F9" }, children: [
              { id: "", order: 0, type: "heading", content: "4.9", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "300", color: "#0F172A", margin: "0", letterSpacing: "-0.05em" } },
              { id: "", order: 1, type: "paragraph", content: "Average rating across 2,000+ verified G2 and Capterra reviews.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.5" } },
            ]
          },
          {
            id: "", order: 2, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px", padding: "0 40px", borderRight: "1px solid #F1F5F9" }, children: [
              { id: "", order: 0, type: "heading", content: "$4.2B", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "300", color: "#0F172A", margin: "0", letterSpacing: "-0.05em" } },
              { id: "", order: 1, type: "paragraph", content: "Transaction volume processed through our global payment gateway.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.5" } },
            ]
          },
          {
            id: "", order: 3, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px", padding: "0 40px" }, children: [
              { id: "", order: 0, type: "heading", content: "170+", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "300", color: "#0F172A", margin: "0", letterSpacing: "-0.05em" } },
              { id: "", order: 1, type: "paragraph", content: "Countries served by our distributed global edge network infrastructure.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.5" } },
            ]
          },
        ],
      }],
    },
  },

  {
    id: "sb-stats-bold",
    name: "Stats — Neon Impact",
    category: "stats",
    designStyle: "bold",
    description: "Vivid multi-stop gradient background with floating glass stat cards",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 40px", backgroundImage: "linear-gradient(135deg,#6366F1 0%,#A855F7 50%,#EC4899 100%)", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(8px)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "around" },
          styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", position: "relative", zIndex: "2" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "rgba(255,255,255,0.1)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", minWidth: "280px" }, children: [
                { id: "", order: 0, type: "heading", content: "500k+", props: { level: 2 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "ACTIVE DEVELOPERS", styles: { fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "rgba(255,255,255,0.1)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", minWidth: "280px" }, children: [
                { id: "", order: 0, type: "heading", content: "1.2B", props: { level: 2 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "DAILY REQUESTS", styles: { fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "8px", backgroundColor: "rgba(255,255,255,0.1)", padding: "48px", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", minWidth: "280px" }, children: [
                { id: "", order: 0, type: "heading", content: "99.99%", props: { level: 2 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "UPTIME SLA", styles: { fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } },
              ]
            },
          ],
        },
      ],
    },
  },

  // ─── TEAM ────────────────────────────────────────────────────────────────────

  {
    id: "sb-team-grid",
    name: "Team — Circular Refined",
    category: "team",
    designStyle: "modern",
    description: "Refined team grid with circular avatars, balanced typography and subtle glass backgrounds",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }, children: [
            { id: "", order: 0, type: "badge", content: "THE MINDS BEHIND IT", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "Built by designers,\nfor developers.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childGap: "xl", _childAlign: "center", _childJustify: "center" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flex: "1", minWidth: "260px", textAlign: "center", padding: "40px", backgroundColor: "#FFFFFF", borderRadius: "32px", border: "1px solid #E2E8F0" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "120px", height: "120px", borderRadius: "9999px", backgroundColor: "#EEF2FF", border: "4px solid #FFFFFF", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "AK", styles: { fontSize: "32px", fontWeight: "800", color: "#6366F1", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Alex Kim", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "CEO & CO-FOUNDER", styles: { fontSize: "12px", color: "#64748B", margin: "0", fontWeight: "800", letterSpacing: "0.05em" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flex: "1", minWidth: "260px", textAlign: "center", padding: "40px", backgroundColor: "#FFFFFF", borderRadius: "32px", border: "1px solid #E2E8F0" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "120px", height: "120px", borderRadius: "9999px", backgroundColor: "#ECFDF5", border: "4px solid #FFFFFF", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "JP", styles: { fontSize: "32px", fontWeight: "800", color: "#10B981", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Jamie Park", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "CTO & CO-FOUNDER", styles: { fontSize: "12px", color: "#64748B", margin: "0", fontWeight: "800", letterSpacing: "0.05em" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flex: "1", minWidth: "260px", textAlign: "center", padding: "40px", backgroundColor: "#FFFFFF", borderRadius: "32px", border: "1px solid #E2E8F0" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "120px", height: "120px", borderRadius: "9999px", backgroundColor: "#FEF3C7", border: "4px solid #FFFFFF", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "SR", styles: { fontSize: "32px", fontWeight: "800", color: "#F59E0B", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Sam Rivera", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "HEAD OF DESIGN", styles: { fontSize: "12px", color: "#64748B", margin: "0", fontWeight: "800", letterSpacing: "0.05em" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", flex: "1", minWidth: "260px", textAlign: "center", padding: "40px", backgroundColor: "#FFFFFF", borderRadius: "32px", border: "1px solid #E2E8F0" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "120px", height: "120px", borderRadius: "9999px", backgroundColor: "#FDF4FF", border: "4px solid #FFFFFF", boxShadow: "0 10px 20px rgba(0,0,0,0.05)", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "LM", styles: { fontSize: "32px", fontWeight: "800", color: "#A855F7", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Lee Morgan", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "VP ENGINEERING", styles: { fontSize: "12px", color: "#64748B", margin: "0", fontWeight: "800", letterSpacing: "0.05em" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── FAQ ─────────────────────────────────────────────────────────────────────

  {
    id: "sb-faq",
    name: "FAQ — Editorial Split",
    category: "faq",
    designStyle: "minimal",
    description: "Premium editorial FAQ layout with sticky heading and clean accordion style",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" },
        styles: { maxWidth: "1280px", margin: "0 auto" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", position: "sticky", top: "64px" }, children: [
              { id: "", order: 0, type: "badge", content: "HELP CENTER", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
              { id: "", order: 1, type: "heading", content: "Commonly asked\nquestions.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
              { id: "", order: 2, type: "paragraph", content: "Can't find the answer? Our support team is available 24/7 via the dashboard chat.", styles: { fontSize: "18px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "1.2", display: "flex", flexDirection: "column" }, children: [
              {
                id: "", order: 0, type: "container", content: "", styles: { padding: "40px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                  { id: "", order: 0, type: "heading", content: "How do I migrate from Vercel?", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                  { id: "", order: 1, type: "paragraph", content: "We offer a one-click migration tool for Next.js projects. Simply connect your GitHub repository and we'll handle the rest, including environment variables and custom domains.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                ]
              },
              {
                id: "", order: 1, type: "container", content: "", styles: { padding: "40px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                  { id: "", order: 0, type: "heading", content: "What is your uptime guarantee?", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                  { id: "", order: 1, type: "paragraph", content: "Our Enterprise plan is backed by a 99.99% Uptime SLA. We utilize a multi-region deployment strategy to ensure your application stays online even during regional provider outages.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                ]
              },
              {
                id: "", order: 2, type: "container", content: "", styles: { padding: "40px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                  { id: "", order: 0, type: "heading", content: "What is your refund policy?", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                  { id: "", order: 1, type: "paragraph", content: "We offer a 30-day money-back guarantee on all plans. If you're not satisfied for any reason, contact our support team and we'll issue a full refund — no questions asked.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                ]
              },
              {
                id: "", order: 3, type: "container", content: "", styles: { padding: "40px 0", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                  { id: "", order: 0, type: "heading", content: "How does support work?", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                  { id: "", order: 1, type: "paragraph", content: "All plans include access to our documentation and community forum. Pro and Enterprise plans unlock priority email support with a guaranteed 4-hour response window, plus a dedicated Slack channel for Enterprise.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                ]
              },
            ]
          },
        ],
      }],
    },
  },

  {
    id: "sb-faq-dark",
    name: "FAQ — Bento Night",
    category: "faq",
    designStyle: "dark",
    description: "Highly structured bento-grid FAQ with glassmorphic cards and subtle neon accents",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#020617", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }, children: [
            { id: "", order: 0, type: "badge", content: "SUPPORT", styles: { backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", border: "1px solid rgba(99,102,241,0.2)" } },
            { id: "", order: 1, type: "heading", content: "Everything you need\nto know to get started.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childGap: "md", _childAlign: "stretch" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "40px", flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "heading", content: "How secure is my data?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "We use AES-256 encryption at rest and TLS 1.3 in transit. Our infrastructure is SOC2 Type II compliant and regularly audited by third-party security firms.", styles: { fontSize: "15px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "40px", flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "heading", content: "Do you support custom domains?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Yes. All paid plans include unlimited custom domains with automatic SSL certificate generation via Let's Encrypt. Setup takes less than 2 minutes.", styles: { fontSize: "15px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "40px", flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "heading", content: "What integrations do you offer?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "We connect with 200+ tools including Slack, GitHub, Jira, Figma, Salesforce, HubSpot, and every major analytics and cloud provider out of the box.", styles: { fontSize: "15px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "rgba(15,23,42,0.5)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "24px", padding: "40px", flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "heading", content: "Is there a public API?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Yes. Our REST API and SDKs for JavaScript, Python, and Go let you automate workflows, build internal tools, and extend the platform however you need.", styles: { fontSize: "15px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── LOGO CLOUD ──────────────────────────────────────────────────────────────

  {
    id: "sb-logos",
    name: "Logo Cloud — Cinematic Glass",
    category: "logo-cloud",
    designStyle: "minimal",
    description: "Cinematic logo cloud with glassmorphic containers and subtle grayscale companies",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#000000", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "0", width: "100%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)" } },
        { id: "", order: 1, type: "paragraph", content: "TRUSTED BY THE WORLD'S MOST INNOVATIVE TEAMS", styles: { fontSize: "12px", color: "#64748B", margin: "0", fontWeight: "800", letterSpacing: "0.2em", textAlign: "center" } },
        {
          id: "", order: 2, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "center", _childJustify: "center", _childGap: "xl" },
          styles: { maxWidth: "1200px", width: "100%" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "STELLAR", styles: { fontSize: "24px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "paragraph", content: "PHANTOM", styles: { fontSize: "24px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 2, type: "paragraph", content: "NEXUS", styles: { fontSize: "24px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 3, type: "paragraph", content: "ORBIT", styles: { fontSize: "24px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 4, type: "paragraph", content: "APEX", styles: { fontSize: "24px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 5, type: "paragraph", content: "SOLARIS", styles: { fontSize: "24px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.1em" } },
          ]
        },
        { id: "", order: 3, type: "container", content: "", styles: { position: "absolute", bottom: "0", left: "0", width: "100%", height: "1px", backgroundColor: "rgba(255,255,255,0.1)" } },
      ],
    },
  },

  {
    id: "sb-logos-dark",
    name: "Logo Cloud — Dark",
    category: "logo-cloud",
    designStyle: "dark",
    description: "Dark background logo strip with subtle white company names",
    element: {
      type: "container", content: "",
      styles: { padding: "60px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", alignItems: "center", gap: "36px" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "Powering teams at", styles: { fontSize: "13px", color: "#475569", margin: "0", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" } },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "center", _childJustify: "center", _childGap: "xl" }, styles: { maxWidth: "1000px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "STRIPE", styles: { fontSize: "18px", fontWeight: "900", color: "rgba(255,255,255,0.2)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "paragraph", content: "GITHUB", styles: { fontSize: "18px", fontWeight: "900", color: "rgba(255,255,255,0.2)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 2, type: "paragraph", content: "NETFLIX", styles: { fontSize: "18px", fontWeight: "900", color: "rgba(255,255,255,0.2)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 3, type: "paragraph", content: "SHOPIFY", styles: { fontSize: "18px", fontWeight: "900", color: "rgba(255,255,255,0.2)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 4, type: "paragraph", content: "FIGMA", styles: { fontSize: "18px", fontWeight: "900", color: "rgba(255,255,255,0.2)", margin: "0", letterSpacing: "0.1em" } },
            { id: "", order: 5, type: "paragraph", content: "NOTION", styles: { fontSize: "18px", fontWeight: "900", color: "rgba(255,255,255,0.2)", margin: "0", letterSpacing: "0.1em" } },
          ]
        },
      ],
    },
  },

  // ─── CONTACT ─────────────────────────────────────────────────────────────────

  {
    id: "sb-contact-split",
    name: "Contact — Bento Glass",
    category: "contact",
    designStyle: "modern",
    description: "Multi-layered contact layout with glassmorphic sidebar and high-impact form",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#020617", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "-10%", right: "-10%", width: "600px", height: "600px", backgroundImage: "radial-gradient(circle at center, rgba(99, 102, 241, 0.1) 0%, transparent 70%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "stretch", _childGap: "xl" },
          styles: { maxWidth: "1280px", margin: "0 auto", position: "relative", zIndex: "2" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "48px", padding: "64px", backgroundColor: "rgba(15,23,42,0.5)", borderRadius: "40px", border: "1px solid rgba(255,255,255,0.05)", backdropFilter: "blur(20px)" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    { id: "", order: 0, type: "badge", content: "CONTACT", styles: { color: "#818CF8", fontSize: "11px", fontWeight: "900", letterSpacing: "0.2em" } },
                    { id: "", order: 1, type: "heading", content: "Let's build\nsomething great.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em", lineHeight: "1" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "32px" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" }, styles: { padding: "24px", backgroundColor: "rgba(255,255,255,0.02)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.05)" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "@", styles: { fontSize: "20px", fontWeight: "900", color: "#818CF8", width: "40px", height: "40px", backgroundColor: "rgba(99,102,241,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", lineHeight: "40px" } },
                        {
                          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column" }, children: [
                            { id: "", order: 0, type: "paragraph", content: "EMAIL US", styles: { fontSize: "11px", fontWeight: "900", color: "#64748B", letterSpacing: "0.1em" } },
                            { id: "", order: 1, type: "paragraph", content: "hello@acme.inc", styles: { fontSize: "16px", color: "#FFFFFF", fontWeight: "600" } },
                          ]
                        },
                      ]
                    },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1.2", padding: "64px", display: "flex", flexDirection: "column", justifyContent: "center" }, children: [
                {
                  id: "", order: 0, type: "form", content: "",
                  props: { bgType: "white", successMessage: "Inquiry received! We'll reach out within 24 hours." },
                  styles: { padding: "0", backgroundColor: "transparent" },
                  children: [
                    {
                      id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childGap: "md" }, styles: {}, children: [
                        { id: "", order: 0, type: "input", content: "", props: { label: "First name", placeholder: "Alex", required: true }, styles: { flex: "1" } },
                        { id: "", order: 1, type: "input", content: "", props: { label: "Last name", placeholder: "Smith" }, styles: { flex: "1" } },
                      ]
                    },
                    { id: "", order: 1, type: "input", content: "", props: { label: "Email", inputType: "email", placeholder: "alex@company.com", required: true }, styles: {} },
                    { id: "", order: 2, type: "select", content: "", props: { label: "Inquiry type", options: ["General", "Partnership", "Press", "Support"] }, styles: {} },
                    { id: "", order: 3, type: "textarea", content: "", props: { label: "Message", placeholder: "Tell us about your project…", rows: 4, required: true }, styles: {} },
                    { id: "", order: 4, type: "button", content: "SEND INQUIRY →", props: { submitForm: true, accentColor: "#FFFFFF", fullWidth: true }, styles: {} },
                  ],
                },
              ]
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-contact-minimal",
    name: "Contact — Minimal Centered",
    category: "contact",
    designStyle: "minimal",
    description: "Ultra-minimal centered contact form, single column",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" }, children: [
            { id: "", order: 0, type: "heading", content: "Say hello.", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "900", color: "#111827", margin: "0", letterSpacing: "-0.05em" } },
            { id: "", order: 1, type: "paragraph", content: "We respond to every message within 24 hours.", styles: { fontSize: "17px", color: "#6B7280", margin: "0" } },
          ]
        },
        {
          id: "", order: 1, type: "form", content: "",
          props: { bgType: "white", successMessage: "Message sent! We'll get back to you within 24 hours." },
          styles: { padding: "0", backgroundColor: "transparent", maxWidth: "520px", width: "100%" },
          children: [
            { id: "", order: 0, type: "input", content: "", props: { label: "Name", placeholder: "Your name", required: true }, styles: {} },
            { id: "", order: 1, type: "input", content: "", props: { label: "Email", inputType: "email", placeholder: "your@email.com", required: true }, styles: {} },
            { id: "", order: 2, type: "textarea", content: "", props: { label: "Message", placeholder: "Your message…", rows: 5, required: true }, styles: {} },
            { id: "", order: 3, type: "button", content: "Send →", props: { submitForm: true, accentColor: "#111827", fullWidth: true }, styles: {} },
          ],
        },
      ],
    },
  },

  // ─── FOOTER ──────────────────────────────────────────────────────────────────

  {
    id: "sb-footer-dark",
    name: "Footer — Enterprise Dark",
    category: "footer",
    designStyle: "dark",
    description: "Premium enterprise-ready footer with multi-column links and social integration",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#000000", padding: "100px 48px 48px", borderTop: "1px solid rgba(255,255,255,0.1)" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" }, styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", paddingBottom: "80px" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "2", display: "flex", flexDirection: "column", gap: "32px" }, children: [
                { id: "", order: 0, type: "heading", content: "ACME 󱎔", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Building the digital backbone for the next generation of fast-moving companies.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7", maxWidth: "300px" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "PRODUCT", styles: { fontSize: "11px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "0.2em" } },
                { id: "", order: 1, type: "text-link", content: "Platform Overview", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Engineering Docs", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Security", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "RESOURCES", styles: { fontSize: "11px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "0.2em" } },
                { id: "", order: 1, type: "text-link", content: "Community", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Marketplace", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Integrations", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", padding: "40px 0 0", borderTop: "1px solid rgba(255,255,255,0.05)" }, children: [
            { id: "", order: 0, type: "paragraph", content: "© 2026 ACME CORP. ALL RIGHTS RESERVED.", styles: { fontSize: "11px", color: "#475569", margin: "0", fontWeight: "700", letterSpacing: "0.05em" } },
            { id: "", order: 1, type: "paragraph", content: "STATUS: ALL SYSTEMS OPERATIONAL", styles: { fontSize: "11px", color: "#10B981", margin: "0", fontWeight: "900", letterSpacing: "0.05em" } },
          ]
        },
      ],
    },
  },

  {
    id: "sb-footer-minimal",
    name: "Footer — Minimal",
    category: "footer",
    designStyle: "minimal",
    description: "Single-row footer: brand left, links center, copyright right",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E7EB", padding: "32px 48px" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" },
        styles: { maxWidth: "1280px", margin: "0 auto", width: "100%" },
        children: [
          { id: "", order: 0, type: "heading", content: "Acme", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#111827", margin: "0" } },
          {
            id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childGap: "lg" }, styles: {}, children: [
              { id: "", order: 0, type: "text-link", content: "About", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
              { id: "", order: 1, type: "text-link", content: "Pricing", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
              { id: "", order: 2, type: "text-link", content: "Blog", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
              { id: "", order: 3, type: "text-link", content: "Contact", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
            ]
          },
          { id: "", order: 2, type: "paragraph", content: "© 2026 Acme, Inc.", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0" } },
        ],
      }],
    },
  },

  {
    id: "sb-footer-light",
    name: "Footer — Light 3-Col",
    category: "footer",
    designStyle: "modern",
    description: "Light footer with 3 link columns and a newsletter subscribe",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F8FAFC", borderTop: "1px solid #E5E7EB", padding: "80px 48px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" }, styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", paddingBottom: "60px" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "2", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "heading", content: "Acme", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#111827", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Subscribe for weekly tips on building better products.", styles: { fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.6", maxWidth: "220px" } },
                {
                  id: "", order: 2, type: "form", content: "",
                  props: { bgType: "white", successMessage: "Thanks for subscribing!" },
                  styles: { padding: "0", backgroundColor: "transparent" },
                  children: [
                    {
                      id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childGap: "sm" }, styles: {}, children: [
                        { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "your@email.com", required: true }, styles: { flex: "1" } },
                        { id: "", order: 1, type: "button", content: "Subscribe", props: { submitForm: true, accentColor: "#111827" }, styles: {} },
                      ]
                    },
                  ],
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "Product", styles: { fontSize: "12px", fontWeight: "700", color: "#9CA3AF", margin: "0", letterSpacing: "0.08em", textTransform: "uppercase" } },
                { id: "", order: 1, type: "text-link", content: "Features", props: { href: "#" }, styles: { fontSize: "14px", color: "#374151", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Pricing", props: { href: "#" }, styles: { fontSize: "14px", color: "#374151", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Changelog", props: { href: "#" }, styles: { fontSize: "14px", color: "#374151", textDecoration: "none" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "Company", styles: { fontSize: "12px", fontWeight: "700", color: "#9CA3AF", margin: "0", letterSpacing: "0.08em", textTransform: "uppercase" } },
                { id: "", order: 1, type: "text-link", content: "About", props: { href: "#" }, styles: { fontSize: "14px", color: "#374151", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Blog", props: { href: "#" }, styles: { fontSize: "14px", color: "#374151", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Careers", props: { href: "#" }, styles: { fontSize: "14px", color: "#374151", textDecoration: "none" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", paddingTop: "24px", borderTop: "1px solid #E5E7EB" }, children: [
            { id: "", order: 0, type: "paragraph", content: "© 2026 Acme. All rights reserved.", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0" } },
            {
              id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childGap: "md" }, styles: {}, children: [
                { id: "", order: 0, type: "text-link", content: "Privacy", props: { href: "#" }, styles: { fontSize: "13px", color: "#9CA3AF", textDecoration: "none" } },
                { id: "", order: 1, type: "text-link", content: "Terms", props: { href: "#" }, styles: { fontSize: "13px", color: "#9CA3AF", textDecoration: "none" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── BLOG ────────────────────────────────────────────────────────────────────

  {
    id: "sb-blog-grid",
    name: "Blog — Magazine Editorial",
    category: "blog",
    designStyle: "modern",
    description: "Premium magazine-style blog grid with high-impact visuals and refined metadata",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "end", _childJustify: "between" }, styles: { maxWidth: "1280px", width: "100%", borderBottom: "1px solid #000000", paddingBottom: "40px" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "badge", content: "INSIGHTS", styles: { color: "#000000", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em" } },
                { id: "", order: 1, type: "heading", content: "The future of\nthe open web.", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "900", color: "#000000", margin: "0", letterSpacing: "-0.05em", lineHeight: "1" } },
              ]
            },
            { id: "", order: 1, type: "text-link", content: "READ ALL JOURNALS 󱎔", props: { href: "#" }, styles: { fontSize: "14px", fontWeight: "900", color: "#000000", textDecoration: "none", letterSpacing: "0.1em" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "xl" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1.5", minWidth: "400px", display: "flex", flexDirection: "column", gap: "32px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#F1F5F9", height: "480px", borderRadius: "32px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "FEATURED IMAGE", styles: { fontWeight: "900", color: "#CBD5E1", fontSize: "24px" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "ENGINEERING • 12 MIN READ", styles: { fontSize: "12px", fontWeight: "900", color: "#64748B", letterSpacing: "0.1em" } },
                    { id: "", order: 1, type: "heading", content: "Scaling to 1 billion requests: The architecture behind our global edge network.", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#000000", margin: "0", lineHeight: "1.2" } },
                    { id: "", order: 2, type: "paragraph", content: "A deep dive into how we built a distributed system that handles massive scale without sacrificing latency or developer experience.", styles: { fontSize: "18px", color: "#475569", margin: "0", lineHeight: "1.6" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", minWidth: "280px", display: "flex", flexDirection: "column", gap: "40px", justifyContent: "space-between" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
                    { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#F1F5F9", height: "200px", borderRadius: "20px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "ARTICLE IMAGE", styles: { fontWeight: "900", color: "#CBD5E1", fontSize: "16px" } }] },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "DESIGN • 6 MIN READ", styles: { fontSize: "11px", fontWeight: "900", color: "#64748B", letterSpacing: "0.1em" } },
                        { id: "", order: 1, type: "heading", content: "Why design tokens are the future of brand consistency at scale.", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "900", color: "#000000", margin: "0", lineHeight: "1.25" } },
                      ]
                    },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
                    { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#F1F5F9", height: "200px", borderRadius: "20px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "ARTICLE IMAGE", styles: { fontWeight: "900", color: "#CBD5E1", fontSize: "16px" } }] },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "PRODUCT • 4 MIN READ", styles: { fontSize: "11px", fontWeight: "900", color: "#64748B", letterSpacing: "0.1em" } },
                        { id: "", order: 1, type: "heading", content: "The 10 metrics every SaaS founder should obsess over in year one.", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "900", color: "#000000", margin: "0", lineHeight: "1.25" } },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-blog-list",
    name: "Blog — List",
    category: "blog",
    designStyle: "minimal",
    description: "Minimal list-style blog posts with title, excerpt, date per row",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Writing", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "800", color: "#111827", margin: "0", letterSpacing: "-0.04em" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "800px", width: "100%", display: "flex", flexDirection: "column" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { padding: "32px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "The future of design systems", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Apr 2, 2026", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0", whiteSpace: "nowrap" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph", content: "How component libraries and AI tooling are changing the way we build at scale.", styles: { fontSize: "15px", color: "#6B7280", margin: "0", lineHeight: "1.6" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { padding: "32px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "Optimizing Core Web Vitals", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Mar 28, 2026", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0", whiteSpace: "nowrap" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph", content: "A practical guide to achieving 100/100 Lighthouse scores on any stack.", styles: { fontSize: "15px", color: "#6B7280", margin: "0", lineHeight: "1.6" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { padding: "32px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "Shipping at 10x speed", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Mar 20, 2026", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0", whiteSpace: "nowrap" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph", content: "The engineering culture and tooling stack that lets us ship every hour.", styles: { fontSize: "15px", color: "#6B7280", margin: "0", lineHeight: "1.6" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── PORTFOLIO ───────────────────────────────────────────────────────────────

  {
    id: "sb-portfolio-grid",
    name: "Portfolio — Bento Showcase",
    category: "portfolio",
    designStyle: "modern",
    description: "Mixed-size bento grid for project showcasing with glass hover effects and high-impact typography",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#000000", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "24px", maxWidth: "800px" }, children: [
            { id: "", order: 0, type: "badge", content: "OUR ARCHIVE", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "900", letterSpacing: "0.2em" } },
            { id: "", order: 1, type: "heading", content: "Form and function,\nin perfect harmony.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row-wrap", _childGap: "md", _childAlign: "stretch" }, styles: { maxWidth: "1280px", width: "100%" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "2", minWidth: "400px", height: "500px", backgroundColor: "#1E293B", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "48px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)", zIndex: "1" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { position: "relative", zIndex: "2", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "badge", content: "WEB DESIGN", styles: { color: "#FFFFFF", fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em" } },
                    { id: "", order: 1, type: "heading", content: "Nova Banking App", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", minWidth: "300px", height: "500px", backgroundColor: "#334155", borderRadius: "32px", border: "1px solid rgba(255,255,255,0.1)", position: "relative", overflow: "hidden", display: "flex", alignItems: "flex-end", padding: "48px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundImage: "linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.8) 100%)", zIndex: "1" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { position: "relative", zIndex: "2", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "badge", content: "BRANDING", styles: { color: "#FFFFFF", fontSize: "11px", fontWeight: "900", letterSpacing: "0.1em" } },
                    { id: "", order: 1, type: "heading", content: "Stellar OS", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-portfolio-minimal",
    name: "Portfolio — Minimal List",
    category: "portfolio",
    designStyle: "minimal",
    description: "Numbered project list with title, description, and year",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 80px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "0px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Selected work", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "900", color: "#111827", margin: "0 0 80px", letterSpacing: "-0.05em" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column" }, children: [
            {
              id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: { padding: "32px 0", borderBottom: "1px solid #111827", cursor: "pointer" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "01", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0", fontWeight: "600", width: "32px" } },
                    { id: "", order: 1, type: "heading", content: "Prism Analytics", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "SaaS Platform", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "2025 →", styles: { fontSize: "14px", color: "#111827", margin: "0", fontWeight: "600" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: { padding: "32px 0", borderBottom: "1px solid #111827", cursor: "pointer" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "02", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0", fontWeight: "600", width: "32px" } },
                    { id: "", order: 1, type: "heading", content: "Quantum Pay", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "Fintech · Mobile", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "2025 →", styles: { fontSize: "14px", color: "#111827", margin: "0", fontWeight: "600" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" }, styles: { padding: "32px 0", borderBottom: "1px solid #111827", cursor: "pointer" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "03", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0", fontWeight: "600", width: "32px" } },
                    { id: "", order: 1, type: "heading", content: "Echo Design System", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "700", color: "#111827", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "Design Systems", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "2024 →", styles: { fontSize: "14px", color: "#111827", margin: "0", fontWeight: "600" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  {
    id: "sb-auth-minimal",
    name: "Auth — Sign In",
    category: "auth",
    designStyle: "minimal",
    description: "Centered minimal sign-in card with email and password fields",
    element: {
      type: "auth-signin-form", content: "",
      props: { variant: "minimal" },
      styles: {},
    },
  },

  // ─── SERVICES ────────────────────────────────────────────────────────────────

  {
    id: "sb-services-grid",
    name: "Services — Icon Grid",
    category: "services",
    designStyle: "minimal",
    description: "Three-column service cards with icons, titles, and descriptions on a clean white background",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "720px" }, children: [
            { id: "", order: 0, type: "badge", content: "WHAT WE DO", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "Services built for\nmodern businesses.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
            { id: "", order: 2, type: "paragraph", content: "From strategy to execution, we deliver solutions that drive measurable results.", styles: { fontSize: "18px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "xl" },
          styles: { maxWidth: "1200px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" }, tablet: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "300px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "⚡", styles: { fontSize: "24px", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Strategy & Consulting", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "We align your digital roadmap with business goals through research-driven strategy and expert consultation.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
                { id: "", order: 2, type: "text-link", content: "Learn more →", props: { href: "#" }, styles: { fontSize: "14px", fontWeight: "700", color: "#6366F1", textDecoration: "none" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" }, tablet: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "300px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "🎨", styles: { fontSize: "24px", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Product Design", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Intuitive interfaces that delight users and drive engagement, crafted with modern design systems and principles.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
                { id: "", order: 2, type: "text-link", content: "Learn more →", props: { href: "#" }, styles: { fontSize: "14px", fontWeight: "700", color: "#10B981", textDecoration: "none" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" }, tablet: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "300px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#FEF3C7", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "🚀", styles: { fontSize: "24px", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Engineering & Dev", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Full-stack development with a focus on performance, scalability, and clean architecture for long-term success.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
                { id: "", order: 2, type: "text-link", content: "Learn more →", props: { href: "#" }, styles: { fontSize: "14px", fontWeight: "700", color: "#F59E0B", textDecoration: "none" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-services-dark",
    name: "Services — Dark Process",
    category: "services",
    designStyle: "dark",
    description: "Numbered process / services layout on a deep dark background with glowing step indicators",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "800px", height: "400px", backgroundImage: "radial-gradient(ellipse at center, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "720px", position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "badge", content: "HOW IT WORKS", styles: { backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", border: "1px solid rgba(99,102,241,0.2)" } },
            { id: "", order: 1, type: "heading", content: "A process built\nfor results.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "",
          props: { _childLayout: "column", _childGap: "md" },
          styles: { maxWidth: "880px", width: "100%", position: "relative", zIndex: "2" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              styles: { display: "flex", flexDirection: "row", gap: "32px", alignItems: "flex-start", padding: "40px", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [{ id: "", order: 0, type: "paragraph", content: "01", styles: { fontSize: "18px", fontWeight: "900", color: "#FFFFFF", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Discovery & Research", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "We immerse ourselves in your business, customers, and competitive landscape to uncover opportunities that drive real impact.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "",
              styles: { display: "flex", flexDirection: "row", gap: "32px", alignItems: "flex-start", padding: "40px", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [{ id: "", order: 0, type: "paragraph", content: "02", styles: { fontSize: "18px", fontWeight: "900", color: "#FFFFFF", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Design & Prototype", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Rapid iteration through wireframes, high-fidelity mockups, and interactive prototypes before a single line of code is written.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "",
              styles: { display: "flex", flexDirection: "row", gap: "32px", alignItems: "flex-start", padding: "40px", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "24px" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "16px", backgroundColor: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [{ id: "", order: 0, type: "paragraph", content: "03", styles: { fontSize: "18px", fontWeight: "900", color: "#FFFFFF", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Build & Launch", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Agile development cycles with full transparency, weekly demos, and continuous deployment to production environments.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-services-split",
    name: "Services — Editorial Split",
    category: "services",
    designStyle: "modern",
    description: "Two-column alternating service showcase with vivid accent borders and editorial typography",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "column", _childGap: "lg" },
        styles: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" },
        children: [
          {
            id: "", order: 0, type: "container", content: "",
            styles: { display: "flex", flexDirection: "column", gap: "16px", paddingBottom: "64px", borderBottom: "1px solid #F1F5F9" },
            children: [
              { id: "", order: 0, type: "badge", content: "OUR SERVICES", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
              { id: "", order: 1, type: "heading", content: "Everything you need\nto ship faster.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "",
            props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
            styles: { padding: "48px 0", borderBottom: "1px solid #F1F5F9" },
            children: [
              {
                id: "", order: 0, type: "container", content: "",
                props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
                styles: { flex: "1", minWidth: "320px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                  { id: "", order: 0, type: "container", content: "", styles: { height: "4px", width: "64px", backgroundColor: "#6366F1", borderRadius: "2px" } },
                  { id: "", order: 1, type: "heading", content: "UX/UI Design", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                  { id: "", order: 2, type: "paragraph", content: "End-to-end product design including user research, information architecture, interaction design, and full design system creation.", styles: { fontSize: "17px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                ]
              },
              {
                id: "", order: 1, type: "container", content: "",
                props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
                styles: { flex: "1", minWidth: "320px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                  { id: "", order: 0, type: "paragraph", content: "✓  User research & testing", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                  { id: "", order: 1, type: "paragraph", content: "✓  Design systems & tokens", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                  { id: "", order: 2, type: "paragraph", content: "✓  Prototyping & handoff", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                  { id: "", order: 3, type: "paragraph", content: "✓  Accessibility audits", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                ]
              },
            ]
          },
          {
            id: "", order: 2, type: "container", content: "",
            props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
            styles: { padding: "48px 0", borderBottom: "1px solid #F1F5F9" },
            children: [
              {
                id: "", order: 0, type: "container", content: "",
                props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
                styles: { flex: "1", minWidth: "320px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                  { id: "", order: 0, type: "container", content: "", styles: { height: "4px", width: "64px", backgroundColor: "#10B981", borderRadius: "2px" } },
                  { id: "", order: 1, type: "heading", content: "Full-Stack Dev", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                  { id: "", order: 2, type: "paragraph", content: "Scalable applications built with modern frameworks, robust APIs, and cloud-native infrastructure from day one.", styles: { fontSize: "17px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                ]
              },
              {
                id: "", order: 1, type: "container", content: "",
                props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
                styles: { flex: "1", minWidth: "320px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                  { id: "", order: 0, type: "paragraph", content: "✓  Next.js / React", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                  { id: "", order: 1, type: "paragraph", content: "✓  API design & integrations", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                  { id: "", order: 2, type: "paragraph", content: "✓  Cloud deployment (AWS / GCP)", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                  { id: "", order: 3, type: "paragraph", content: "✓  CI/CD pipelines", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
                ]
              },
            ]
          },
        ],
      }],
    },
  },

  // ─── CTA (additional) ─────────────────────────────────────────────────────────

  {
    id: "sb-cta-banner",
    name: "CTA — Announcement Banner",
    category: "cta",
    designStyle: "minimal",
    description: "Slim horizontal announcement/promo banner with icon, message, and action button",
    element: {
      type: "container", content: "",
      styles: { padding: "20px 40px", backgroundColor: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childJustify: "between", _childGap: "lg" },
        styles: { maxWidth: "1280px", width: "100%" },
        children: [
          {
            id: "", order: 0, type: "container", content: "",
            props: { _childLayout: "row", _childAlign: "center", _childGap: "md" },
            styles: {},
            children: [
              { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#6366F1", padding: "4px 10px", borderRadius: "6px", display: "inline-flex" }, children: [{ id: "", order: 0, type: "paragraph", content: "NEW", styles: { fontSize: "11px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "0.1em" } }] },
              { id: "", order: 1, type: "paragraph", content: "Version 3.0 is live — 40% faster builds, new AI assistant, and 200+ new components.", styles: { fontSize: "14px", color: "rgba(255,255,255,0.8)", margin: "0", fontWeight: "500" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "",
            props: { _childLayout: "row", _childAlign: "center", _childGap: "md" },
            styles: { flexShrink: "0" },
            children: [
              { id: "", order: 0, type: "button", content: "Read release notes →", styles: { backgroundColor: "transparent", color: "#FFFFFF", padding: "8px 16px", borderRadius: "8px", fontWeight: "600", fontSize: "13px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)" } },
              { id: "", order: 1, type: "paragraph", content: "✕", styles: { fontSize: "16px", color: "rgba(255,255,255,0.4)", margin: "0", cursor: "pointer" } },
            ]
          },
        ],
      }],
    },
  },

  {
    id: "sb-cta-feature",
    name: "CTA — Feature Highlight",
    category: "cta",
    designStyle: "corporate",
    description: "Two-column CTA with headline left and feature benefit checklist on the right",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#F8FAFC" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
        styles: { maxWidth: "1200px", margin: "0 auto" },
        children: [
          {
            id: "", order: 0, type: "container", content: "",
            props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
            styles: { flex: "1.2", minWidth: "360px", display: "flex", flexDirection: "column", gap: "32px" }, children: [
              { id: "", order: 0, type: "badge", content: "GET STARTED TODAY", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
              { id: "", order: 1, type: "heading", content: "Join 50,000+ teams already building the future.", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
              {
                id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childGap: "md" }, styles: {}, children: [
                  { id: "", order: 0, type: "button", content: "Start for free", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "16px 36px", borderRadius: "10px", fontWeight: "700", fontSize: "16px", cursor: "pointer" } },
                  { id: "", order: 1, type: "button", content: "Talk to sales", styles: { backgroundColor: "transparent", color: "#0F172A", border: "1.5px solid #CBD5E1", padding: "16px 36px", borderRadius: "10px", fontWeight: "600", fontSize: "16px", cursor: "pointer" } },
                ]
              },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "",
            props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
            styles: { flex: "1", minWidth: "300px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
              { id: "", order: 0, type: "paragraph", content: "✓  No credit card required", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600", display: "flex", alignItems: "center", gap: "12px" } },
              { id: "", order: 1, type: "paragraph", content: "✓  14-day free trial, cancel anytime", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
              { id: "", order: 2, type: "paragraph", content: "✓  99.99% uptime SLA", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
              { id: "", order: 3, type: "paragraph", content: "✓  SOC 2 Type II certified", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
              { id: "", order: 4, type: "paragraph", content: "✓  Dedicated onboarding support", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
              { id: "", order: 5, type: "paragraph", content: "✓  GDPR & CCPA compliant", styles: { fontSize: "16px", color: "#334155", margin: "0", fontWeight: "600" } },
            ]
          },
        ],
      }],
    },
  },

  {
    id: "sb-cta-invite",
    name: "CTA — Social Proof Invite",
    category: "cta",
    designStyle: "modern",
    description: "Centered invite CTA with avatar stack, social proof count, and email capture",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundImage: "linear-gradient(135deg, #EEF2FF 0%, #FFFFFF 50%, #F0FDF4 100%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px", textAlign: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "center", _childGap: "xs" },
          styles: {},
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { width: "40px", height: "40px", borderRadius: "9999px", backgroundColor: "#EEF2FF", border: "3px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "👨‍💻", styles: { fontSize: "18px", margin: "0" } }] },
            { id: "", order: 1, type: "container", content: "", styles: { width: "40px", height: "40px", borderRadius: "9999px", backgroundColor: "#ECFDF5", border: "3px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "-12px" }, children: [{ id: "", order: 0, type: "paragraph", content: "👩‍🎨", styles: { fontSize: "18px", margin: "0" } }] },
            { id: "", order: 2, type: "container", content: "", styles: { width: "40px", height: "40px", borderRadius: "9999px", backgroundColor: "#FEF3C7", border: "3px solid #FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", marginLeft: "-12px" }, children: [{ id: "", order: 0, type: "paragraph", content: "🧑‍💼", styles: { fontSize: "18px", margin: "0" } }] },
            { id: "", order: 3, type: "paragraph", content: "+8,400 teams", styles: { fontSize: "14px", color: "#64748B", fontWeight: "700", margin: "0 0 0 12px" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "20px", maxWidth: "680px" }, children: [
            { id: "", order: 0, type: "heading", content: "Your next big product\nstarts here.", props: { level: 2 }, styles: { fontSize: "60px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.05em", lineHeight: "1.0", whiteSpace: "pre-line" } },
            { id: "", order: 1, type: "paragraph", content: "Join thousands of designers and developers shipping faster with our all-in-one platform.", styles: { fontSize: "20px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 2, type: "form", content: "",
          props: { bgType: "white", successMessage: "You're in! We'll send your early access link soon." },
          styles: { padding: "0", backgroundColor: "transparent", maxWidth: "480px", width: "100%", margin: "0 auto" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "stretch", _childGap: "sm" }, styles: {}, children: [
                { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "Enter your work email…", required: true }, styles: { flex: "1" } },
                { id: "", order: 1, type: "button", content: "Get early access", props: { submitForm: true, accentColor: "#0F172A" }, styles: {} },
              ]
            },
          ],
        },
        { id: "", order: 3, type: "paragraph", content: "Free 14-day trial · No credit card · Cancel anytime", styles: { fontSize: "13px", color: "#94A3B8", margin: "0" } },
      ],
    },
  },

  // ─── FAQ (additional) ─────────────────────────────────────────────────────────

  {
    id: "sb-faq-centered",
    name: "FAQ — Centered Accordion",
    category: "faq",
    designStyle: "minimal",
    description: "Clean centered FAQ with expandable accordion items and subtle borders — no side panel",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px" }, children: [
            { id: "", order: 0, type: "heading", content: "Frequently asked questions", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
            { id: "", order: 1, type: "paragraph", content: "Everything you need to know. Can't find what you're looking for? Chat with our team.", styles: { fontSize: "18px", color: "#6B7280", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "column", _childGap: "xs" },
          styles: { maxWidth: "760px", width: "100%" },
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { padding: "32px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "heading", content: "Is there a free trial available?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "Yes — every plan comes with a 14-day free trial, no credit card needed. You get full access to all features so you can decide if it's right for you.", styles: { fontSize: "16px", color: "#6B7280", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 1, type: "container", content: "", styles: { padding: "32px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "heading", content: "Can I change my plan later?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "Absolutely. You can upgrade or downgrade at any time from your account settings. Changes take effect at the start of your next billing cycle.", styles: { fontSize: "16px", color: "#6B7280", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 2, type: "container", content: "", styles: { padding: "32px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "heading", content: "What payment methods do you accept?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "We accept all major credit cards (Visa, Mastercard, Amex), PayPal, and bank transfers for annual plans over $5,000.", styles: { fontSize: "16px", color: "#6B7280", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 3, type: "container", content: "", styles: { padding: "32px 0", borderBottom: "1px solid #F1F5F9", display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "heading", content: "Do you offer refunds?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "We offer a 30-day money-back guarantee. If you're not satisfied, contact support and we'll issue a full refund, no questions asked.", styles: { fontSize: "16px", color: "#6B7280", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 4, type: "container", content: "", styles: { padding: "32px 0", display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "heading", content: "Is my data secure?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "Security is our top priority. We use AES-256 encryption at rest, TLS 1.3 in transit, and are SOC 2 Type II certified.", styles: { fontSize: "16px", color: "#6B7280", margin: "0", lineHeight: "1.7" } }] },
          ]
        },
      ],
    },
  },

  {
    id: "sb-faq-cards",
    name: "FAQ — Colorful Cards",
    category: "faq",
    designStyle: "playful",
    description: "Vibrant FAQ with colorful gradient card backgrounds, great for SaaS landing pages",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px" }, children: [
            { id: "", order: 0, type: "heading", content: "Got questions? We've got answers.", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#111827", margin: "0", letterSpacing: "-0.04em" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "lg" },
          styles: { maxWidth: "1100px", width: "100%" },
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { flex: "1", minWidth: "280px", backgroundImage: "linear-gradient(135deg, #EEF2FF, #E0E7FF)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", gap: "12px" }, children: [{ id: "", order: 0, type: "heading", content: "How long does setup take?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#312E81", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "Most teams are up and running within 10 minutes. Our onboarding wizard walks you through every step.", styles: { fontSize: "15px", color: "#4338CA", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 1, type: "container", content: "", styles: { flex: "1", minWidth: "280px", backgroundImage: "linear-gradient(135deg, #ECFDF5, #D1FAE5)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", gap: "12px" }, children: [{ id: "", order: 0, type: "heading", content: "Can I invite my whole team?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#064E3B", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "Absolutely. Every plan includes unlimited team members with role-based permissions so everyone has the right access.", styles: { fontSize: "15px", color: "#065F46", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 2, type: "container", content: "", styles: { flex: "1", minWidth: "280px", backgroundImage: "linear-gradient(135deg, #FFF7ED, #FFEDD5)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", gap: "12px" }, children: [{ id: "", order: 0, type: "heading", content: "What integrations do you support?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#7C2D12", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "We integrate with 200+ tools including Slack, GitHub, Jira, Figma, Salesforce, and all major cloud providers.", styles: { fontSize: "15px", color: "#92400E", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 3, type: "container", content: "", styles: { flex: "1", minWidth: "280px", backgroundImage: "linear-gradient(135deg, #FDF4FF, #FAE8FF)", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", gap: "12px" }, children: [{ id: "", order: 0, type: "heading", content: "Is there an API available?", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#4A044E", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "Yes. Our REST API and SDKs (JavaScript, Python, Go) let you build custom integrations and automate any workflow.", styles: { fontSize: "15px", color: "#701A75", margin: "0", lineHeight: "1.7" } }] },
          ]
        },
      ],
    },
  },

  // ─── PRICING (additional) ──────────────────────────────────────────────────────

  {
    id: "sb-pricing-dark",
    name: "Pricing — Dark Three Tier",
    category: "pricing",
    designStyle: "dark",
    description: "Three pricing tiers on a rich dark background with an indigo highlighted featured plan",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "720px" }, children: [
            { id: "", order: 0, type: "badge", content: "SIMPLE PRICING", styles: { backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", border: "1px solid rgba(99,102,241,0.2)" } },
            { id: "", order: 1, type: "heading", content: "One price for\nevery team size.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "stretch", _childGap: "xl" },
          styles: { maxWidth: "1200px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "260px", backgroundColor: "rgba(15,23,42,0.5)", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "32px", border: "1px solid rgba(255,255,255,0.06)" }, children: [
                { id: "", order: 0, type: "heading", content: "Starter", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 1, type: "heading", content: "$0", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 2, type: "button", content: "Get started free", styles: { backgroundColor: "rgba(255,255,255,0.08)", color: "#F8FAFC", padding: "16px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" } },
                { id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "paragraph", content: "✓  3 projects", styles: { fontSize: "15px", color: "#94A3B8", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "✓  5 GB storage", styles: { fontSize: "15px", color: "#94A3B8", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "✓  Community support", styles: { fontSize: "15px", color: "#94A3B8", margin: "0" } }] },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1.1", minWidth: "280px", backgroundColor: "#6366F1", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "32px", position: "relative", boxShadow: "0 40px 80px rgba(99,102,241,0.3)" }, children: [
                { id: "", order: 0, type: "badge", content: "MOST POPULAR", styles: { backgroundColor: "rgba(255,255,255,0.2)", color: "#FFFFFF", padding: "5px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", letterSpacing: "0.05em" } },
                { id: "", order: 1, type: "heading", content: "Pro", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 2, type: "heading", content: "$49", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 3, type: "button", content: "Start free trial", styles: { backgroundColor: "#FFFFFF", color: "#6366F1", padding: "16px", borderRadius: "12px", fontWeight: "800", fontSize: "15px", cursor: "pointer", textAlign: "center" } },
                { id: "", order: 4, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "paragraph", content: "✓  Unlimited projects", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "✓  100 GB storage", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "✓  Priority support", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", margin: "0" } }, { id: "", order: 3, type: "paragraph", content: "✓  Advanced analytics", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", margin: "0" } }] },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "260px", backgroundColor: "rgba(15,23,42,0.5)", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "32px", border: "1px solid rgba(255,255,255,0.06)" }, children: [
                { id: "", order: 0, type: "heading", content: "Enterprise", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "800", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 1, type: "heading", content: "Custom", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.05em" } },
                { id: "", order: 2, type: "button", content: "Contact sales", styles: { backgroundColor: "rgba(255,255,255,0.08)", color: "#F8FAFC", padding: "16px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", textAlign: "center", border: "1px solid rgba(255,255,255,0.1)" } },
                { id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "14px" }, children: [{ id: "", order: 0, type: "paragraph", content: "✓  Everything in Pro", styles: { fontSize: "15px", color: "#94A3B8", margin: "0" } }, { id: "", order: 1, type: "paragraph", content: "✓  Unlimited storage", styles: { fontSize: "15px", color: "#94A3B8", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "✓  SLA & dedicated support", styles: { fontSize: "15px", color: "#94A3B8", margin: "0" } }, { id: "", order: 3, type: "paragraph", content: "✓  SSO / SAML", styles: { fontSize: "15px", color: "#94A3B8", margin: "0" } }] },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-pricing-simple",
    name: "Pricing — Simple Featured",
    category: "pricing",
    designStyle: "minimal",
    description: "Single featured pricing card, centered with a full feature checklist — ideal for one-product SaaS",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", textAlign: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "560px" }, children: [
            { id: "", order: 0, type: "heading", content: "Simple, honest pricing.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
            { id: "", order: 1, type: "paragraph", content: "One plan. Everything included. No hidden fees, no per-seat pricing.", styles: { fontSize: "20px", color: "#6B7280", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          styles: { maxWidth: "480px", width: "100%", backgroundColor: "#0F172A", borderRadius: "32px", padding: "64px", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", boxShadow: "0 40px 80px rgba(0,0,0,0.12)" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px", alignItems: "center" }, children: [
                { id: "", order: 0, type: "heading", content: "$39", props: { level: 1 }, styles: { fontSize: "88px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.06em", lineHeight: "1" } },
                { id: "", order: 1, type: "paragraph", content: "per month, billed annually", styles: { fontSize: "15px", color: "#64748B", margin: "0" } },
              ]
            },
            { id: "", order: 1, type: "button", content: "Start your free trial →", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "18px 40px", borderRadius: "12px", fontWeight: "800", fontSize: "16px", cursor: "pointer", width: "100%", textAlign: "center" } },
            {
              id: "", order: 2, type: "container", content: "", props: { _childLayout: "column", _childGap: "sm" }, styles: { width: "100%" }, children: [
                { id: "", order: 0, type: "paragraph", content: "✓  Unlimited projects & collaborators", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", textAlign: "left" } },
                { id: "", order: 1, type: "paragraph", content: "✓  Custom domains & SSL", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", textAlign: "left" } },
                { id: "", order: 2, type: "paragraph", content: "✓  Advanced analytics & exports", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", textAlign: "left" } },
                { id: "", order: 3, type: "paragraph", content: "✓  Priority 24/7 support", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", textAlign: "left" } },
                { id: "", order: 4, type: "paragraph", content: "✓  API access + webhooks", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0", textAlign: "left" } },
              ]
            },
          ]
        },
        { id: "", order: 2, type: "paragraph", content: "Need a custom plan? Talk to sales →", styles: { fontSize: "15px", color: "#6B7280", margin: "0" } },
      ],
    },
  },

  // ─── TEAM (additional) ────────────────────────────────────────────────────────

  {
    id: "sb-team-dark",
    name: "Team — Dark Grid",
    category: "team",
    designStyle: "dark",
    description: "Team member grid on a rich dark background with glowing accent avatars",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "720px" }, children: [
            { id: "", order: 0, type: "badge", content: "OUR TEAM", styles: { backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", border: "1px solid rgba(99,102,241,0.2)" } },
            { id: "", order: 1, type: "heading", content: "The people building\nyour future.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row-wrap", _childGap: "lg", _childAlign: "center", _childJustify: "center" },
          styles: { maxWidth: "1200px", width: "100%" },
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", padding: "40px", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", minWidth: "220px", flex: "1" }, children: [{ id: "", order: 0, type: "container", content: "", styles: { width: "100px", height: "100px", borderRadius: "9999px", backgroundColor: "rgba(99,102,241,0.15)", border: "2px solid rgba(99,102,241,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(99,102,241,0.2)" }, children: [{ id: "", order: 0, type: "paragraph", content: "AK", styles: { fontSize: "28px", fontWeight: "900", color: "#818CF8", margin: "0" } }] }, { id: "", order: 1, type: "heading", content: "Alex Kim", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "CEO & CO-FOUNDER", styles: { fontSize: "11px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } }] },
            { id: "", order: 1, type: "container", content: "", styles: { textAlign: "center", padding: "40px", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", minWidth: "220px", flex: "1" }, children: [{ id: "", order: 0, type: "container", content: "", styles: { width: "100px", height: "100px", borderRadius: "9999px", backgroundColor: "rgba(16,185,129,0.15)", border: "2px solid rgba(16,185,129,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(16,185,129,0.2)" }, children: [{ id: "", order: 0, type: "paragraph", content: "JP", styles: { fontSize: "28px", fontWeight: "900", color: "#34D399", margin: "0" } }] }, { id: "", order: 1, type: "heading", content: "Jamie Park", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "CTO & CO-FOUNDER", styles: { fontSize: "11px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } }] },
            { id: "", order: 2, type: "container", content: "", styles: { textAlign: "center", padding: "40px", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", minWidth: "220px", flex: "1" }, children: [{ id: "", order: 0, type: "container", content: "", styles: { width: "100px", height: "100px", borderRadius: "9999px", backgroundColor: "rgba(245,158,11,0.15)", border: "2px solid rgba(245,158,11,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(245,158,11,0.2)" }, children: [{ id: "", order: 0, type: "paragraph", content: "SR", styles: { fontSize: "28px", fontWeight: "900", color: "#FCD34D", margin: "0" } }] }, { id: "", order: 1, type: "heading", content: "Sam Rivera", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "HEAD OF DESIGN", styles: { fontSize: "11px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } }] },
            { id: "", order: 3, type: "container", content: "", styles: { textAlign: "center", padding: "40px", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "28px", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", minWidth: "220px", flex: "1" }, children: [{ id: "", order: 0, type: "container", content: "", styles: { width: "100px", height: "100px", borderRadius: "9999px", backgroundColor: "rgba(236,72,153,0.15)", border: "2px solid rgba(236,72,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 40px rgba(236,72,153,0.2)" }, children: [{ id: "", order: 0, type: "paragraph", content: "LM", styles: { fontSize: "28px", fontWeight: "900", color: "#F472B6", margin: "0" } }] }, { id: "", order: 1, type: "heading", content: "Lee Morgan", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "800", color: "#F8FAFC", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "VP OF ENGINEERING", styles: { fontSize: "11px", color: "#475569", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } }] },
          ]
        },
      ],
    },
  },

  {
    id: "sb-team-horizontal",
    name: "Team — Horizontal Cards",
    category: "team",
    designStyle: "corporate",
    description: "Wide horizontal team member cards with avatar, bio, and social links — premium corporate style",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px" }, children: [
            { id: "", order: 0, type: "badge", content: "LEADERSHIP TEAM", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "Meet the people\nbehind the product.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "column", _childGap: "lg" },
          styles: { maxWidth: "900px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              styles: { display: "flex", flexDirection: "row", gap: "32px", alignItems: "center", padding: "40px", border: "1px solid #E2E8F0", borderRadius: "24px", backgroundColor: "#FAFAFA" },
              children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "96px", height: "96px", borderRadius: "9999px", backgroundColor: "#EEF2FF", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "AK", styles: { fontSize: "28px", fontWeight: "900", color: "#6366F1", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Alex Kim", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "900", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "CEO & CO-FOUNDER", styles: { fontSize: "12px", color: "#6366F1", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } },
                    { id: "", order: 2, type: "paragraph", content: "Previously VP Engineering at Stripe. 15+ years building products that scale to millions of users.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "",
              styles: { display: "flex", flexDirection: "row", gap: "32px", alignItems: "center", padding: "40px", border: "1px solid #E2E8F0", borderRadius: "24px", backgroundColor: "#FAFAFA" },
              children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "96px", height: "96px", borderRadius: "9999px", backgroundColor: "#ECFDF5", flexShrink: "0", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "JP", styles: { fontSize: "28px", fontWeight: "900", color: "#10B981", margin: "0" } }] },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Jamie Park", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "900", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "CTO & CO-FOUNDER", styles: { fontSize: "12px", color: "#10B981", margin: "0", fontWeight: "800", letterSpacing: "0.1em" } },
                    { id: "", order: 2, type: "paragraph", content: "Ex-Staff Engineer at GitHub. Expert in distributed systems, open source contributor, speaker at JSConf.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── FOOTER (additional) ──────────────────────────────────────────────────────

  {
    id: "sb-footer-gradient",
    name: "Footer — Gradient Brand",
    category: "footer",
    designStyle: "bold",
    description: "Vibrant gradient footer with a large brand statement, social icons, and bottom bar",
    element: {
      type: "container", content: "",
      styles: { backgroundImage: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 50%, #0F172A 100%)", padding: "80px 48px 40px", borderTop: "1px solid rgba(99,102,241,0.3)" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "start", _childJustify: "between", _childGap: "xl" },
          styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", paddingBottom: "60px", borderBottom: "1px solid rgba(255,255,255,0.08)" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "2", minWidth: "260px", display: "flex", flexDirection: "column", gap: "24px" }, children: [
                { id: "", order: 0, type: "heading", content: "⬡ NEXUS", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.03em" } },
                { id: "", order: 1, type: "paragraph", content: "Building the infrastructure for the next generation of great products.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7", maxWidth: "280px" } },
                {
                  id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childGap: "sm" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "𝕏", styles: { width: "36px", height: "36px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "rgba(255,255,255,0.6)", margin: "0", cursor: "pointer", textAlign: "center", lineHeight: "36px" } },
                    { id: "", order: 1, type: "paragraph", content: "in", styles: { width: "36px", height: "36px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", color: "rgba(255,255,255,0.6)", margin: "0", cursor: "pointer", textAlign: "center", lineHeight: "36px", fontWeight: "900" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "PRODUCT", styles: { fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.2em" } },
                { id: "", order: 1, type: "text-link", content: "Features", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Pricing", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Changelog", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "140px", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "COMPANY", styles: { fontSize: "11px", fontWeight: "900", color: "rgba(255,255,255,0.4)", margin: "0", letterSpacing: "0.2em" } },
                { id: "", order: 1, type: "text-link", content: "About", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Blog", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Careers", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" },
          styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", paddingTop: "32px" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "© 2026 Nexus Inc.", styles: { fontSize: "13px", color: "#374151", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Privacy · Terms · Cookies", styles: { fontSize: "13px", color: "#374151", margin: "0" } },
          ]
        },
      ],
    },
  },

  {
    id: "sb-footer-corporate",
    name: "Footer — Corporate 4-Col",
    category: "footer",
    designStyle: "corporate",
    description: "Professional four-column footer with logo, address, and a full link map — ideal for enterprise sites",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F8FAFC", borderTop: "2px solid #E2E8F0", padding: "80px 48px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" },
          styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", paddingBottom: "60px", borderBottom: "1px solid #E2E8F0" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1.6", minWidth: "220px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "heading", content: "Acme Corp", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "900", color: "#111827", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "123 Market Street, Suite 400\nSan Francisco, CA 94105", styles: { fontSize: "14px", color: "#6B7280", margin: "0", lineHeight: "1.7", whiteSpace: "pre-line" } },
                { id: "", order: 2, type: "paragraph", content: "contact@acmecorp.com", styles: { fontSize: "14px", color: "#6B7280", margin: "0" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "130px", display: "flex", flexDirection: "column", gap: "14px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "SOLUTIONS", styles: { fontSize: "11px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "0.15em" } },
                { id: "", order: 1, type: "text-link", content: "Analytics", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Automation", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Enterprise", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 4, type: "text-link", content: "Integrations", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "130px", display: "flex", flexDirection: "column", gap: "14px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "RESOURCES", styles: { fontSize: "11px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "0.15em" } },
                { id: "", order: 1, type: "text-link", content: "Documentation", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Case Studies", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Blog", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 4, type: "text-link", content: "Webinars", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "",
              props: { _responsive: { mobile: { flex: "1 1 100%", minWidth: "0" } } },
              styles: { flex: "1", minWidth: "130px", display: "flex", flexDirection: "column", gap: "14px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "COMPANY", styles: { fontSize: "11px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "0.15em" } },
                { id: "", order: 1, type: "text-link", content: "About Us", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Careers", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Press", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
                { id: "", order: 4, type: "text-link", content: "Contact", props: { href: "#" }, styles: { fontSize: "14px", color: "#6B7280", textDecoration: "none" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "between" },
          styles: { maxWidth: "1280px", margin: "0 auto", width: "100%", paddingTop: "28px" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "© 2026 Acme Corp. All rights reserved.", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0" } },
            {
              id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childGap: "lg" }, styles: {}, children: [
                { id: "", order: 0, type: "text-link", content: "Privacy Policy", props: { href: "#" }, styles: { fontSize: "13px", color: "#9CA3AF", textDecoration: "none" } },
                { id: "", order: 1, type: "text-link", content: "Terms of Service", props: { href: "#" }, styles: { fontSize: "13px", color: "#9CA3AF", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Cookie Policy", props: { href: "#" }, styles: { fontSize: "13px", color: "#9CA3AF", textDecoration: "none" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-auth-split",
    name: "Auth — Split",
    category: "auth",
    designStyle: "modern",
    description: "Left brand panel with form on the right",
    element: {
      type: "container", content: "",
      styles: { display: "flex", minHeight: "600px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "stretch" },
          styles: { width: "100%" },
          children: [
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", backgroundColor: "#FFFFFF", display: "flex", alignItems: "stretch" }, children: [
                { id: "", order: 0, type: "auth-signup-form", content: "", props: { variant: "split", heading: "Create your account", subheading: "Free forever, no credit card needed.", buttonText: "Create account →", accentColor: "#6366F1" }, styles: { flex: "1" } },
              ]
            },
          ],
        },
      ],
    },
  },

  // ─── E-COMMERCE ─────────────────────────────────────────────────────────────

  {
    id: "ecom-product-showcase",
    name: "Product Showcase",
    category: "ecommerce",
    designStyle: "modern",
    description: "Hero-style section with large product image, title, price, add-to-cart",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px", display: "flex", gap: "60px", alignItems: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", aspectRatio: "1", backgroundColor: "#F3F4F6", borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", minHeight: "400px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "🖼️", styles: { fontSize: "96px", textAlign: "center" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px" }, children: [
            { id: "", order: 0, type: "badge", content: "New Arrival", styles: { backgroundColor: "#EEF2FF", color: "#6366F1", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", display: "inline-block" } },
            { id: "", order: 1, type: "heading", content: "Premium Wireless Headphones", props: { level: 1 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", letterSpacing: "-0.03em", lineHeight: "1.1" } },
            { id: "", order: 2, type: "paragraph", content: "Crystal clear sound with active noise cancellation. 30-hour battery life.", styles: { fontSize: "16px", color: "#6B7280", lineHeight: "1.6" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "16px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "$299.00", styles: { fontSize: "36px", fontWeight: "900", color: "#111827" } },
                { id: "", order: 1, type: "paragraph", content: "$399.00", styles: { fontSize: "20px", color: "#9CA3AF", textDecoration: "line-through" } },
                { id: "", order: 2, type: "badge", content: "Save 25%", styles: { backgroundColor: "#DCFCE7", color: "#16A34A", padding: "4px 10px", borderRadius: "999px", fontSize: "13px", fontWeight: "700" } },
              ]
            },
            { id: "", order: 4, type: "add-to-cart", content: "Add to Cart", props: { productId: "headphones-1", productName: "Premium Wireless Headphones", price: 299, accentColor: "#6366F1" } },
            { id: "", order: 5, type: "paragraph", content: "✓ Free shipping  ·  ✓ 30-day returns  ·  ✓ 2-year warranty", styles: { fontSize: "13px", color: "#9CA3AF" } },
          ]
        },
      ],
    },
  },

  {
    id: "ecom-product-grid",
    name: "Product Grid",
    category: "ecommerce",
    designStyle: "modern",
    description: "3-column grid of product cards",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "64px 40px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Shop All Products", props: { level: 2 }, styles: { fontSize: "32px", fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: "8px" } },
        { id: "", order: 1, type: "paragraph", content: "Discover our full collection", styles: { fontSize: "16px", color: "#6B7280", textAlign: "center", marginBottom: "48px" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }, children: [
            { id: "", order: 0, type: "product-card", content: "", props: { name: "Wireless Headphones", price: 299, originalPrice: 399, rating: 4.5, reviewCount: 128, badge: "Sale", accentColor: "#6366F1" } },
            { id: "", order: 1, type: "product-card", content: "", props: { name: "Smart Watch Pro", price: 449, rating: 4.8, reviewCount: 256, badge: "New", accentColor: "#6366F1" } },
            { id: "", order: 2, type: "product-card", content: "", props: { name: "Noise-Cancel Earbuds", price: 179, originalPrice: 229, rating: 4.3, reviewCount: 89, accentColor: "#6366F1" } },
          ]
        },
      ],
    },
  },

  {
    id: "ecom-trust-badges",
    name: "Trust Badges",
    category: "ecommerce",
    designStyle: "minimal",
    description: "Icon row: free shipping, secure checkout, easy returns",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "40px", borderTop: "1px solid #E5E7EB", borderBottom: "1px solid #E5E7EB" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", justifyContent: "center", gap: "64px", flexWrap: "wrap" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🚚", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "Free Shipping", props: { level: 4 }, styles: { fontSize: "14px", fontWeight: "700", color: "#111827" } },
                { id: "", order: 2, type: "paragraph", content: "On orders over $50", styles: { fontSize: "12px", color: "#6B7280" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🔒", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "Secure Checkout", props: { level: 4 }, styles: { fontSize: "14px", fontWeight: "700", color: "#111827" } },
                { id: "", order: 2, type: "paragraph", content: "256-bit SSL encrypted", styles: { fontSize: "12px", color: "#6B7280" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "↩️", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "Easy Returns", props: { level: 4 }, styles: { fontSize: "14px", fontWeight: "700", color: "#111827" } },
                { id: "", order: 2, type: "paragraph", content: "30-day hassle-free", styles: { fontSize: "12px", color: "#6B7280" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "⭐", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "Top Rated", props: { level: 4 }, styles: { fontSize: "14px", fontWeight: "700", color: "#111827" } },
                { id: "", order: 2, type: "paragraph", content: "4.9/5 from 10K+ reviews", styles: { fontSize: "12px", color: "#6B7280" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "ecom-promo-banner",
    name: "Promo Banner",
    category: "ecommerce",
    designStyle: "bold",
    description: "Full-width announcement bar with code and CTA",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(90deg, #6366F1, #8B5CF6)", padding: "16px 40px", display: "flex", alignItems: "center", justifyContent: "center", gap: "24px", flexWrap: "wrap" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "🎉 Summer Sale — Up to 40% off!", styles: { fontSize: "15px", fontWeight: "700", color: "#FFFFFF" } },
        { id: "", order: 1, type: "paragraph", content: "Use code:", styles: { fontSize: "14px", color: "rgba(255,255,255,0.75)" } },
        { id: "", order: 2, type: "paragraph", content: "SUMMER40", styles: { fontSize: "14px", fontWeight: "800", color: "#FFFFFF", backgroundColor: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "6px", letterSpacing: "0.05em" } },
        { id: "", order: 3, type: "button", content: "Shop Now →", styles: { backgroundColor: "#FFFFFF", color: "#6366F1", padding: "8px 20px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", cursor: "pointer" } },
      ],
    },
  },

  {
    id: "ecom-cart-sidebar",
    name: "Cart",
    category: "ecommerce",
    designStyle: "modern",
    description: "Shopping cart element (dropdown/sidebar/inline)",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "40px", display: "flex", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "cart", content: "", props: { cartStyle: "inline", currency: "USD", checkoutUrl: "/checkout" } },
      ],
    },
  },

  // ─── AUTH ────────────────────────────────────────────────────────────────────

  {
    id: "auth-login-card",
    name: "Login Card",
    category: "auth",
    designStyle: "minimal",
    description: "Email + password form, forgot password link",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-signin-form", content: "", props: { variant: "minimal" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-signup-card",
    name: "Sign Up Card",
    category: "auth",
    designStyle: "minimal",
    description: "Name/email/password form with terms checkbox",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-signup-form", content: "", props: { variant: "minimal" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-social-login",
    name: "Social Login Wall",
    category: "auth",
    designStyle: "modern",
    description: "Large OAuth provider buttons (Google, GitHub, Apple)",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px", display: "flex", justifyContent: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "380px", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }, children: [
            { id: "", order: 0, type: "heading", content: "Sign in", props: { level: 1 }, styles: { fontSize: "32px", fontWeight: "800", color: "#111827", textAlign: "center" } },
            { id: "", order: 1, type: "paragraph", content: "Choose your preferred method", styles: { fontSize: "15px", color: "#6B7280", textAlign: "center" } },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                { id: "", order: 0, type: "button", content: "🔵 Continue with Google", styles: { backgroundColor: "#FFFFFF", border: "1.5px solid #E5E7EB", color: "#111827", padding: "14px", borderRadius: "12px", fontWeight: "600", fontSize: "15px", cursor: "pointer", textAlign: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" } },
                { id: "", order: 1, type: "button", content: "⬛ Continue with GitHub", styles: { backgroundColor: "#111827", color: "#FFFFFF", padding: "14px", borderRadius: "12px", fontWeight: "600", fontSize: "15px", cursor: "pointer", textAlign: "center" } },
                { id: "", order: 2, type: "button", content: "🍎 Continue with Apple", styles: { backgroundColor: "#000000", color: "#FFFFFF", padding: "14px", borderRadius: "12px", fontWeight: "600", fontSize: "15px", cursor: "pointer", textAlign: "center" } },
              ]
            },
            { id: "", order: 3, type: "paragraph", content: "By continuing you agree to our Terms & Privacy Policy.", styles: { fontSize: "12px", color: "#9CA3AF", textAlign: "center" } },
          ]
        },
      ],
    },
  },

  {
    id: "auth-magic-link",
    name: "Magic Link",
    category: "auth",
    designStyle: "minimal",
    description: "Passwordless email login form",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "80px 40px", display: "flex", justifyContent: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "440px", width: "100%", backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "48px", boxShadow: "0 4px 24px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "24px", textAlign: "center" }, children: [
            { id: "", order: 0, type: "paragraph", content: "✉️", styles: { fontSize: "48px" } },
            { id: "", order: 1, type: "heading", content: "Sign in with email", props: { level: 2 }, styles: { fontSize: "24px", fontWeight: "800", color: "#111827" } },
            { id: "", order: 2, type: "paragraph", content: "We'll send a secure link to your inbox — no password needed.", styles: { fontSize: "15px", color: "#6B7280", lineHeight: "1.6" } },
            { id: "", order: 3, type: "container", content: "", styles: { border: "1px solid #E5E7EB", borderRadius: "10px", padding: "12px 16px" }, children: [{ id: "", order: 0, type: "paragraph", content: "you@example.com", styles: { fontSize: "14px", color: "#9CA3AF" } }] },
            { id: "", order: 4, type: "button", content: "Send magic link", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "14px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", cursor: "pointer" } },
          ]
        },
      ],
    },
  },

  {
    id: "auth-verify-email",
    name: "Email Verification",
    category: "auth",
    designStyle: "minimal",
    description: "Check-your-inbox illustration + resend button",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px", display: "flex", justifyContent: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "440px", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px", textAlign: "center" }, children: [
            { id: "", order: 0, type: "paragraph", content: "📬", styles: { fontSize: "64px" } },
            { id: "", order: 1, type: "heading", content: "Check your inbox", props: { level: 2 }, styles: { fontSize: "28px", fontWeight: "800", color: "#111827" } },
            { id: "", order: 2, type: "paragraph", content: "We sent a confirmation link to your@email.com. Click the link to activate your account.", styles: { fontSize: "15px", color: "#6B7280", lineHeight: "1.7" } },
            { id: "", order: 3, type: "paragraph", content: "Didn't get it? Check your spam folder or", styles: { fontSize: "14px", color: "#6B7280" } },
            { id: "", order: 4, type: "button", content: "Resend verification email", styles: { backgroundColor: "#F3F4F6", color: "#111827", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer" } },
          ]
        },
      ],
    },
  },

  // ─── AUTH (extended) ─────────────────────────────────────────────────────────

  {
    id: "auth-forgot-page",
    name: "Forgot Password",
    category: "auth",
    designStyle: "minimal",
    description: "Full-page forgot password form — sends a reset link to the user's email",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-forgot-form", content: "", props: { variant: "minimal", accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-forgot-dark",
    name: "Forgot Password — Dark",
    category: "auth",
    designStyle: "dark",
    description: "Dark-themed forgot password page",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-forgot-form", content: "", props: { variant: "dark", accentColor: "#818CF8" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-reset-page",
    name: "Reset Password",
    category: "auth",
    designStyle: "minimal",
    description: "New password form — shown after user clicks reset link in email",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-reset-form", content: "", props: { variant: "minimal", accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-gate-section",
    name: "Gated Content",
    category: "auth",
    designStyle: "minimal",
    description: "Section that shows a lock prompt to guests and real content to signed-in users",
    element: {
      type: "auth-gate", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#F8FAFC", borderRadius: "20px", border: "2px dashed #E2E8F0" },
      props: { fallback: "signin", message: "Sign in to view this exclusive content." },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px", textAlign: "center" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "🔓", styles: { fontSize: "48px" } },
            { id: "", order: 1, type: "heading", content: "Welcome, member!", props: { level: 2 }, styles: { fontSize: "32px", fontWeight: "800", color: "#111827" } },
            { id: "", order: 2, type: "paragraph", content: "This is exclusive content visible only to signed-in users. Replace this with your members-only material.", styles: { fontSize: "16px", color: "#6B7280", lineHeight: "1.7" } },
          ],
        },
      ],
    },
  },

  {
    id: "auth-profile-card",
    name: "User Profile Card",
    category: "auth",
    designStyle: "minimal",
    description: "Displays current user's avatar, name, email, and sign-out button",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "40px", display: "flex", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "user-profile-card", content: "", props: { showAvatar: true, showEmail: true, showLogout: true, accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-account-settings",
    name: "Account Settings",
    category: "auth",
    designStyle: "modern",
    description: "Profile settings section — name, email, avatar, and change password",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        styles: { maxWidth: "700px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "40px" },
        children: [
          {
            id: "", order: 0, type: "container", content: "",
            styles: { display: "flex", flexDirection: "column", gap: "8px" },
            children: [
              { id: "", order: 0, type: "heading", content: "Account Settings", props: { level: 1 }, styles: { fontSize: "32px", fontWeight: "800", color: "#111827", letterSpacing: "-0.03em" } },
              { id: "", order: 1, type: "paragraph", content: "Manage your profile and security preferences.", styles: { fontSize: "16px", color: "#6B7280" } },
            ],
          },
          {
            id: "", order: 1, type: "container", content: "",
            styles: { backgroundColor: "#F9FAFB", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", gap: "24px", border: "1px solid #E5E7EB" },
            children: [
              { id: "", order: 0, type: "heading", content: "Profile Information", props: { level: 3 }, styles: { fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0" } },
              {
                id: "", order: 1, type: "container", content: "",
                styles: { display: "flex", alignItems: "center", gap: "20px" },
                children: [
                  { id: "", order: 0, type: "container", content: "", styles: { width: "72px", height: "72px", borderRadius: "50%", backgroundColor: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [{ id: "", order: 0, type: "paragraph", content: "U", styles: { fontSize: "28px", fontWeight: "700", color: "#FFFFFF", margin: "0" } }] },
                  { id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "User Name", styles: { fontWeight: "700", fontSize: "16px", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "user@example.com", styles: { fontSize: "14px", color: "#6B7280", margin: "0" } },
                  ]},
                ],
              },
              {
                id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                  { id: "", order: 0, type: "container", content: "", styles: { border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Full name", styles: { fontSize: "13px", color: "#6B7280", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "User Name", styles: { fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0" } },
                  ]},
                  { id: "", order: 1, type: "container", content: "", styles: { border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Email", styles: { fontSize: "13px", color: "#6B7280", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "user@example.com", styles: { fontSize: "14px", fontWeight: "600", color: "#111827", margin: "0" } },
                  ]},
                ],
              },
              { id: "", order: 3, type: "button", content: "Save changes", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "12px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", border: "none", cursor: "pointer", display: "inline-block" } },
            ],
          },
          {
            id: "", order: 2, type: "container", content: "",
            styles: { backgroundColor: "#FFF1F2", borderRadius: "20px", padding: "32px", display: "flex", flexDirection: "column", gap: "16px", border: "1px solid #FECDD3" },
            children: [
              { id: "", order: 0, type: "heading", content: "Danger Zone", props: { level: 3 }, styles: { fontSize: "16px", fontWeight: "700", color: "#DC2626", margin: "0" } },
              { id: "", order: 1, type: "paragraph", content: "Once you delete your account, there is no going back. All your data will be permanently removed.", styles: { fontSize: "14px", color: "#6B7280" } },
              { id: "", order: 2, type: "button", content: "Delete account", styles: { backgroundColor: "#FEF2F2", color: "#DC2626", padding: "10px 20px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", border: "1.5px solid #FECACA", cursor: "pointer", display: "inline-block" } },
            ],
          },
        ],
      }],
    },
  },

  {
    id: "auth-two-factor",
    name: "Two-Factor Auth",
    category: "auth",
    designStyle: "modern",
    description: "OTP / 2FA code entry step — 6-digit input with resend timer",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        styles: { maxWidth: "420px", width: "100%", backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "48px", boxShadow: "0 8px 40px rgba(0,0,0,0.08)", display: "flex", flexDirection: "column", gap: "32px", textAlign: "center" },
        children: [
          { id: "", order: 0, type: "container", content: "", styles: { width: "72px", height: "72px", borderRadius: "20px", background: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto" }, children: [{ id: "", order: 0, type: "paragraph", content: "🔐", styles: { fontSize: "32px", margin: "0" } }] },
          { id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
            { id: "", order: 0, type: "heading", content: "Two-factor authentication", props: { level: 2 }, styles: { fontSize: "22px", fontWeight: "800", color: "#111827" } },
            { id: "", order: 1, type: "paragraph", content: "Enter the 6-digit code from your authenticator app or sent to your email.", styles: { fontSize: "14px", color: "#6B7280", lineHeight: "1.6" } },
          ]},
          { id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "10px", justifyContent: "center" }, children: [
            { id: "", order: 0, type: "container" as const, content: "", styles: { width: "52px", height: "60px", borderRadius: "12px", border: "2px solid #E5E7EB", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph" as const, content: "—", styles: { fontSize: "20px", fontWeight: "700", color: "#9CA3AF", margin: "0" } }] },
            { id: "", order: 1, type: "container" as const, content: "", styles: { width: "52px", height: "60px", borderRadius: "12px", border: "2px solid #E5E7EB", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph" as const, content: "—", styles: { fontSize: "20px", fontWeight: "700", color: "#9CA3AF", margin: "0" } }] },
            { id: "", order: 2, type: "container" as const, content: "", styles: { width: "52px", height: "60px", borderRadius: "12px", border: "2px solid #E5E7EB", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph" as const, content: "—", styles: { fontSize: "20px", fontWeight: "700", color: "#9CA3AF", margin: "0" } }] },
            { id: "", order: 3, type: "container" as const, content: "", styles: { width: "52px", height: "60px", borderRadius: "12px", border: "2px solid #6366F1", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph" as const, content: "—", styles: { fontSize: "20px", fontWeight: "700", color: "#6366F1", margin: "0" } }] },
            { id: "", order: 4, type: "container" as const, content: "", styles: { width: "52px", height: "60px", borderRadius: "12px", border: "2px solid #E5E7EB", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph" as const, content: "—", styles: { fontSize: "20px", fontWeight: "700", color: "#9CA3AF", margin: "0" } }] },
            { id: "", order: 5, type: "container" as const, content: "", styles: { width: "52px", height: "60px", borderRadius: "12px", border: "2px solid #E5E7EB", backgroundColor: "#F9FAFB", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph" as const, content: "—", styles: { fontSize: "20px", fontWeight: "700", color: "#9CA3AF", margin: "0" } }] },
          ]},
          { id: "", order: 3, type: "button", content: "Verify code", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "14px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", border: "none" } },
          { id: "", order: 4, type: "paragraph", content: "Didn't receive a code? Resend in 59s", styles: { fontSize: "13px", color: "#9CA3AF" } },
        ],
      }],
    },
  },

  {
    id: "auth-signin-dark",
    name: "Sign In — Dark",
    category: "auth",
    designStyle: "dark",
    description: "Dark themed sign-in page with gradient background",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-signin-form", content: "", props: { variant: "dark", accentColor: "#818CF8" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-signup-dark",
    name: "Sign Up — Dark",
    category: "auth",
    designStyle: "dark",
    description: "Dark themed sign-up page",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(135deg, #0F172A 0%, #1E1B4B 100%)", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-signup-form", content: "", props: { variant: "dark", accentColor: "#818CF8" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-signin-glass",
    name: "Sign In — Glass",
    category: "auth",
    designStyle: "glass",
    description: "Glassmorphism sign-in with frosted blur overlay on gradient",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-signin-form", content: "", props: { variant: "glass", accentColor: "#FFFFFF" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-signup-glass",
    name: "Sign Up — Glass",
    category: "auth",
    designStyle: "glass",
    description: "Glassmorphism sign-up on purple gradient",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-signup-form", content: "", props: { variant: "glass", accentColor: "#FFFFFF" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-signin-elevated",
    name: "Sign In — Elevated",
    category: "auth",
    designStyle: "modern",
    description: "Card with deep shadow and clean white layout",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F1F5F9", padding: "80px 40px", display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" },
      children: [
        { id: "", order: 0, type: "auth-signin-form", content: "", props: { variant: "elevated", accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "auth-signup-split-branding",
    name: "Sign Up — Brand Split",
    category: "auth",
    designStyle: "modern",
    description: "Left branded panel with logo, tagline, features list + right form",
    element: {
      type: "container", content: "",
      styles: { display: "flex", minHeight: "100vh" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        styles: { display: "flex", width: "100%" },
        children: [
          {
            id: "", order: 0, type: "container", content: "",
            styles: { flex: "1", background: "linear-gradient(145deg, #4F46E5 0%, #7C3AED 100%)", padding: "60px 48px", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: "100vh" },
            children: [
              { id: "", order: 0, type: "paragraph", content: "⚡ BuildStack", styles: { fontSize: "22px", fontWeight: "800", color: "#FFFFFF" } },
              {
                id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
                  { id: "", order: 0, type: "heading", content: "Build stunning websites in minutes.", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "900", color: "#FFFFFF", lineHeight: "1.15", letterSpacing: "-0.03em" } },
                  { id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓  Drag-and-drop visual builder", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", fontWeight: "500" } },
                    { id: "", order: 1, type: "paragraph", content: "✓  100+ pre-built section blocks", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", fontWeight: "500" } },
                    { id: "", order: 2, type: "paragraph", content: "✓  Auth, CMS, and e-commerce built-in", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", fontWeight: "500" } },
                    { id: "", order: 3, type: "paragraph", content: "✓  Publish to a custom domain in one click", styles: { fontSize: "15px", color: "rgba(255,255,255,0.85)", fontWeight: "500" } },
                  ]},
                ],
              },
              { id: "", order: 2, type: "paragraph", content: "© 2025 BuildStack. All rights reserved.", styles: { fontSize: "13px", color: "rgba(255,255,255,0.45)" } },
            ],
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { flex: "1", backgroundColor: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 48px" }, children: [
              { id: "", order: 0, type: "auth-signup-form", content: "", props: { variant: "minimal", accentColor: "#6366F1", heading: "Get started for free", subheading: "Join thousands of creators building with BuildStack." }, styles: { width: "100%", maxWidth: "440px" } },
            ],
          },
        ],
      }],
    },
  },

  {
    id: "auth-onboarding-steps",
    name: "Onboarding Steps",
    category: "auth",
    designStyle: "modern",
    description: "Post-signup multi-step onboarding wizard with step indicators",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px", display: "flex", justifyContent: "center" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        styles: { maxWidth: "640px", width: "100%", display: "flex", flexDirection: "column", gap: "40px" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "0" }, children: [
              { id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: "1" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "✓", styles: { color: "#FFFFFF", fontWeight: "800", fontSize: "14px", margin: "0" } }] },
                { id: "", order: 1, type: "paragraph", content: "Account", styles: { fontSize: "11px", fontWeight: "700", color: "#6366F1" } },
              ]},
              { id: "", order: 1, type: "container", content: "", styles: { flex: "1", height: "2px", backgroundColor: "#6366F1", marginTop: "-18px" } },
              { id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: "1" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "2", styles: { color: "#FFFFFF", fontWeight: "800", fontSize: "14px", margin: "0" } }] },
                { id: "", order: 1, type: "paragraph", content: "Profile", styles: { fontSize: "11px", fontWeight: "700", color: "#6366F1" } },
              ]},
              { id: "", order: 3, type: "container", content: "", styles: { flex: "1", height: "2px", backgroundColor: "#E5E7EB", marginTop: "-18px" } },
              { id: "", order: 4, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", flex: "1" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#F3F4F6", border: "2px solid #E5E7EB", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "3", styles: { color: "#9CA3AF", fontWeight: "800", fontSize: "14px", margin: "0" } }] },
                { id: "", order: 1, type: "paragraph", content: "Done", styles: { fontSize: "11px", fontWeight: "700", color: "#9CA3AF" } },
              ]},
            ],
          },
          {
            id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
              { id: "", order: 0, type: "heading", content: "Set up your profile", props: { level: 2 }, styles: { fontSize: "28px", fontWeight: "800", color: "#111827" } },
              { id: "", order: 1, type: "paragraph", content: "Tell us a bit about yourself so we can personalise your experience.", styles: { fontSize: "15px", color: "#6B7280" } },
            ],
          },
          {
            id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
              { id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "Full name", styles: { fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0" } },
                { id: "", order: 1, type: "container", content: "", styles: { border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "12px 16px" }, children: [{ id: "", order: 0, type: "paragraph", content: "Your name", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0" } }] },
              ]},
              { id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "Job title", styles: { fontSize: "13px", fontWeight: "600", color: "#374151", margin: "0" } },
                { id: "", order: 1, type: "container", content: "", styles: { border: "1.5px solid #E5E7EB", borderRadius: "10px", padding: "12px 16px" }, children: [{ id: "", order: 0, type: "paragraph", content: "e.g. Product Designer", styles: { fontSize: "14px", color: "#9CA3AF", margin: "0" } }] },
              ]},
            ],
          },
          {
            id: "", order: 3, type: "container", content: "", styles: { display: "flex", justifyContent: "space-between" }, children: [
              { id: "", order: 0, type: "button", content: "← Back", styles: { padding: "12px 24px", borderRadius: "10px", border: "1.5px solid #E5E7EB", backgroundColor: "#FFFFFF", color: "#374151", fontWeight: "600", fontSize: "14px", cursor: "pointer" } },
              { id: "", order: 1, type: "button", content: "Continue →", styles: { padding: "12px 24px", borderRadius: "10px", backgroundColor: "#6366F1", color: "#FFFFFF", fontWeight: "700", fontSize: "14px", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.35)" } },
            ],
          },
        ],
      }],
    },
  },

  // ─── BLOG ────────────────────────────────────────────────────────────────────

  {
    id: "blog-featured-article",
    name: "Featured Article",
    category: "blog",
    designStyle: "modern",
    description: "Large hero-style single article with image, author, date",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "64px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "900px", margin: "0 auto" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "8px", marginBottom: "16px" }, children: [
                { id: "", order: 0, type: "badge", content: "Product", styles: { backgroundColor: "#EEF2FF", color: "#6366F1", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" } },
                { id: "", order: 1, type: "badge", content: "Engineering", styles: { backgroundColor: "#F0FDF4", color: "#16A34A", padding: "4px 12px", borderRadius: "999px", fontSize: "12px", fontWeight: "700" } },
              ]
            },
            { id: "", order: 1, type: "heading", content: "How we scaled to 1 million users without breaking a sweat", props: { level: 1 }, styles: { fontSize: "44px", fontWeight: "800", color: "#111827", letterSpacing: "-0.03em", lineHeight: "1.15", marginBottom: "16px" } },
            { id: "", order: 2, type: "paragraph", content: "A deep dive into the architectural decisions that allowed our infrastructure to handle unexpected 10x growth overnight with zero downtime.", styles: { fontSize: "18px", color: "#6B7280", lineHeight: "1.7", marginBottom: "24px" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "40px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "👤", styles: { fontSize: "36px", backgroundColor: "#F3F4F6", borderRadius: "50%", width: "44px", height: "44px", display: "flex", alignItems: "center", justifyContent: "center" } },
                {
                  id: "", order: 1, type: "container", content: "", children: [
                    { id: "", order: 0, type: "paragraph", content: "Sarah Chen", styles: { fontSize: "14px", fontWeight: "700", color: "#111827" } },
                    { id: "", order: 1, type: "paragraph", content: "March 28, 2026  ·  8 min read", styles: { fontSize: "13px", color: "#9CA3AF" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 4, type: "container", content: "", styles: { width: "100%", aspectRatio: "16/9", backgroundColor: "#F3F4F6", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
                { id: "", order: 0, type: "paragraph", content: "📸 Article Cover Image", styles: { fontSize: "16px", color: "#9CA3AF" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "blog-newsletter-signup",
    name: "Newsletter Signup",
    category: "blog",
    designStyle: "bold",
    description: "Inline email capture with social proof count",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(135deg, #6366F1, #8B5CF6)", padding: "64px 40px", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "heading", content: "Stay in the loop", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.02em", marginBottom: "8px" } },
        { id: "", order: 1, type: "paragraph", content: "Get the latest articles, tutorials, and updates. Join 12,000+ readers.", styles: { fontSize: "16px", color: "rgba(255,255,255,0.75)", marginBottom: "32px" } },
        {
          id: "", order: 2, type: "form", content: "",
          props: { bgType: "white", successMessage: "You're subscribed! No spam, ever." },
          styles: { padding: "0", backgroundColor: "transparent", maxWidth: "480px", margin: "0 auto", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "stretch", _childGap: "sm" }, styles: { flexWrap: "wrap", justifyContent: "center" }, children: [
                { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "your@email.com", required: true }, styles: { flex: "1", minWidth: "200px" } },
                { id: "", order: 1, type: "button", content: "Subscribe →", props: { submitForm: true, accentColor: "#FFFFFF" }, styles: {} },
              ]
            },
          ],
        },
        { id: "", order: 3, type: "paragraph", content: "No spam, unsubscribe anytime. 100% free.", styles: { fontSize: "13px", color: "rgba(255,255,255,0.5)", marginTop: "16px" } },
      ],
    },
  },

  {
    id: "blog-author-bio",
    name: "Author Bio",
    category: "blog",
    designStyle: "minimal",
    description: "Avatar, bio, social links card",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "40px", borderRadius: "16px", margin: "40px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "24px", alignItems: "flex-start" }, children: [
            { id: "", order: 0, type: "paragraph", content: "👤", styles: { fontSize: "56px", width: "80px", height: "80px", backgroundColor: "#E5E7EB", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" } },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1" }, children: [
                { id: "", order: 0, type: "heading", content: "Sarah Chen", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#111827", marginBottom: "4px" } },
                { id: "", order: 1, type: "paragraph", content: "Staff Engineer at Acme · Previously at Meta and Stripe. Writing about distributed systems, startups, and engineering leadership.", styles: { fontSize: "15px", color: "#6B7280", lineHeight: "1.6", marginBottom: "12px" } },
                { id: "", order: 2, type: "paragraph", content: "🐦 @sarahchen  ·  💼 LinkedIn  ·  🌐 sarahchen.dev", styles: { fontSize: "14px", color: "#6366F1", fontWeight: "600" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── SAAS ────────────────────────────────────────────────────────────────────

  {
    id: "saas-product-demo",
    name: "Product Demo",
    category: "saas",
    designStyle: "modern",
    description: "Split layout: browser mockup left, features list right",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "64px", alignItems: "center", maxWidth: "1100px", margin: "0 auto" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1.2" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#111827", borderRadius: "16px", padding: "16px", boxShadow: "0 20px 60px rgba(0,0,0,0.25)" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "6px", marginBottom: "12px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "", styles: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#EF4444" } },
                        { id: "", order: 1, type: "paragraph", content: "", styles: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#F59E0B" } },
                        { id: "", order: 2, type: "paragraph", content: "", styles: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "#10B981" } },
                      ]
                    },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#1F2937", borderRadius: "10px", height: "280px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "🖥️ App Screenshot", styles: { fontSize: "16px", color: "#4B5563" } },
                      ]
                    },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "32px" }, children: [
                { id: "", order: 0, type: "heading", content: "See it in action", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#111827", letterSpacing: "-0.03em" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "20px" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "16px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "⚡", styles: { fontSize: "24px", width: "44px", height: "44px", backgroundColor: "#EEF2FF", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" } },
                        {
                          id: "", order: 1, type: "container", content: "", children: [
                            { id: "", order: 0, type: "heading", content: "Deploy in seconds", props: { level: 4 }, styles: { fontSize: "15px", fontWeight: "700", color: "#111827" } },
                            { id: "", order: 1, type: "paragraph", content: "One-click deployments to any cloud provider.", styles: { fontSize: "14px", color: "#6B7280" } },
                          ]
                        },
                      ]
                    },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { display: "flex", gap: "16px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "🔒", styles: { fontSize: "24px", width: "44px", height: "44px", backgroundColor: "#F0FDF4", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" } },
                        {
                          id: "", order: 1, type: "container", content: "", children: [
                            { id: "", order: 0, type: "heading", content: "Enterprise security", props: { level: 4 }, styles: { fontSize: "15px", fontWeight: "700", color: "#111827" } },
                            { id: "", order: 1, type: "paragraph", content: "SOC 2, GDPR compliant. Your data stays yours.", styles: { fontSize: "14px", color: "#6B7280" } },
                          ]
                        },
                      ]
                    },
                    {
                      id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "16px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "📊", styles: { fontSize: "24px", width: "44px", height: "44px", backgroundColor: "#FFF7ED", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" } },
                        {
                          id: "", order: 1, type: "container", content: "", children: [
                            { id: "", order: 0, type: "heading", content: "Real-time analytics", props: { level: 4 }, styles: { fontSize: "15px", fontWeight: "700", color: "#111827" } },
                            { id: "", order: 1, type: "paragraph", content: "Monitor everything with beautiful dashboards.", styles: { fontSize: "14px", color: "#6B7280" } },
                          ]
                        },
                      ]
                    },
                  ]
                },
                { id: "", order: 2, type: "button", content: "Start free trial →", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "14px 28px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", display: "inline-block" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "saas-metric-wall",
    name: "Metric Wall",
    category: "saas",
    designStyle: "dark",
    description: "Full-width dark section with 4 large stats",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#0F172A", padding: "80px 40px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Trusted by teams worldwide", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#FFFFFF", textAlign: "center", letterSpacing: "-0.02em", marginBottom: "64px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "40px", maxWidth: "900px", margin: "0 auto" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { textAlign: "center" }, children: [
                { id: "", order: 0, type: "heading", content: "50K+", props: { level: 3 }, styles: { fontSize: "52px", fontWeight: "900", color: "#6366F1", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Active users", styles: { fontSize: "14px", color: "#94A3B8", marginTop: "4px" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { textAlign: "center" }, children: [
                { id: "", order: 0, type: "heading", content: "99.9%", props: { level: 3 }, styles: { fontSize: "52px", fontWeight: "900", color: "#10B981", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Uptime SLA", styles: { fontSize: "14px", color: "#94A3B8", marginTop: "4px" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { textAlign: "center" }, children: [
                { id: "", order: 0, type: "heading", content: "$2M+", props: { level: 3 }, styles: { fontSize: "52px", fontWeight: "900", color: "#F59E0B", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Revenue processed", styles: { fontSize: "14px", color: "#94A3B8", marginTop: "4px" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { textAlign: "center" }, children: [
                { id: "", order: 0, type: "heading", content: "4.9★", props: { level: 3 }, styles: { fontSize: "52px", fontWeight: "900", color: "#EC4899", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Average rating", styles: { fontSize: "14px", color: "#94A3B8", marginTop: "4px" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "saas-comparison-table",
    name: "Comparison Table",
    category: "saas",
    designStyle: "modern",
    description: "Feature comparison between plans or competitors",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px" },
      children: [
        { id: "", order: 0, type: "heading", content: "How we compare", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#111827", textAlign: "center", marginBottom: "48px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "800px", margin: "0 auto", border: "1px solid #E5E7EB", borderRadius: "16px", overflow: "hidden" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", backgroundColor: "#F9FAFB", padding: "16px 24px", borderBottom: "1px solid #E5E7EB" }, children: [
                { id: "", order: 0, type: "paragraph", content: "Feature", styles: { fontSize: "13px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.05em" } },
                { id: "", order: 1, type: "paragraph", content: "Free", styles: { fontSize: "13px", fontWeight: "700", color: "#6B7280", textAlign: "center" } },
                { id: "", order: 2, type: "paragraph", content: "Pro", styles: { fontSize: "13px", fontWeight: "700", color: "#6366F1", textAlign: "center" } },
                { id: "", order: 3, type: "paragraph", content: "Enterprise", styles: { fontSize: "13px", fontWeight: "700", color: "#6B7280", textAlign: "center" } },
              ]
            },
            ...(["Custom domain", "Analytics", "Team members", "API access", "SSO", "SLA"].map((feature, i) => ({
              id: "", order: i + 1, type: "container" as const, content: "",
              styles: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: "1px solid #F3F4F6", alignItems: "center" },
              children: [
                { id: "", order: 0, type: "paragraph" as const, content: feature, styles: { fontSize: "14px", color: "#374151" } },
                { id: "", order: 1, type: "paragraph" as const, content: i < 2 ? "✓" : "—", styles: { fontSize: "16px", color: i < 2 ? "#10B981" : "#D1D5DB", textAlign: "center" as const } },
                { id: "", order: 2, type: "paragraph" as const, content: i < 4 ? "✓" : "—", styles: { fontSize: "16px", color: i < 4 ? "#6366F1" : "#D1D5DB", textAlign: "center" as const, fontWeight: "700" } },
                { id: "", order: 3, type: "paragraph" as const, content: "✓", styles: { fontSize: "16px", color: "#10B981", textAlign: "center" as const } },
              ],
            }))),
          ]
        },
      ],
    },
  },

  {
    id: "saas-api-preview",
    name: "API Preview",
    category: "saas",
    designStyle: "dark",
    description: "Code block sample with copy button, language tabs",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#0F172A", padding: "80px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "900px", margin: "0 auto" }, children: [
            { id: "", order: 0, type: "heading", content: "Developer-first API", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#FFFFFF", textAlign: "center", marginBottom: "8px" } },
            { id: "", order: 1, type: "paragraph", content: "Everything you need, exactly where you expect it.", styles: { fontSize: "16px", color: "#94A3B8", textAlign: "center", marginBottom: "40px" } },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#1E293B", borderRadius: "16px", overflow: "hidden" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "0", borderBottom: "1px solid #334155" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "cURL", styles: { padding: "12px 20px", fontSize: "13px", fontWeight: "600", color: "#6366F1", borderBottom: "2px solid #6366F1" } },
                    { id: "", order: 1, type: "paragraph", content: "Node.js", styles: { padding: "12px 20px", fontSize: "13px", fontWeight: "600", color: "#64748B" } },
                    { id: "", order: 2, type: "paragraph", content: "Python", styles: { padding: "12px 20px", fontSize: "13px", fontWeight: "600", color: "#64748B" } },
                  ]
                },
                {
                  id: "", order: 1, type: "code-block", content: `curl -X POST https://api.example.com/v1/sites \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"name": "My Site", "template": "saas-landing"}'`, styles: { padding: "24px", fontFamily: "JetBrains Mono, monospace", fontSize: "13px", color: "#94A3B8", lineHeight: "1.7" }
                },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "saas-changelog-feed",
    name: "Changelog Feed",
    category: "saas",
    designStyle: "minimal",
    description: "Timestamped update entries with tags",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px" },
      children: [
        { id: "", order: 0, type: "heading", content: "What's new", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#111827", marginBottom: "48px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "40px", maxWidth: "700px" }, children: [
            ...([
              { date: "Mar 28, 2026", tag: "Feature", tagColor: "#6366F1", tagBg: "#EEF2FF", title: "Introducing AI-powered section generation", desc: "Generate entire page sections from a single prompt. Try it in the editor today." },
              { date: "Mar 15, 2026", tag: "Improvement", tagColor: "#059669", tagBg: "#ECFDF5", title: "Canvas performance — 3x faster rendering", desc: "We rewrote the canvas renderer to handle 1000+ elements without any lag." },
              { date: "Mar 1, 2026", tag: "Fix", tagColor: "#DC2626", tagBg: "#FEF2F2", title: "Fixed mobile preview overflow issues", desc: "Sections with fixed widths now correctly constrain to viewport width on mobile." },
            ].map((entry, i) => ({
              id: "", order: i, type: "container" as const, content: "",
              styles: { display: "flex", gap: "24px" },
              children: [
                { id: "", order: 0, type: "paragraph" as const, content: entry.date, styles: { fontSize: "13px", color: "#9CA3AF", whiteSpace: "nowrap", paddingTop: "4px", minWidth: "100px" } },
                {
                  id: "", order: 1, type: "container" as const, content: "", styles: { flex: "1", paddingLeft: "24px", borderLeft: "2px solid #E5E7EB" }, children: [
                    { id: "", order: 0, type: "badge" as const, content: entry.tag, styles: { backgroundColor: entry.tagBg, color: entry.tagColor, padding: "2px 10px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", marginBottom: "8px", display: "inline-block" } },
                    { id: "", order: 1, type: "heading" as const, content: entry.title, props: { level: 4 }, styles: { fontSize: "16px", fontWeight: "700", color: "#111827", marginBottom: "6px" } },
                    { id: "", order: 2, type: "paragraph" as const, content: entry.desc, styles: { fontSize: "14px", color: "#6B7280", lineHeight: "1.6" } },
                  ]
                },
              ],
            }))),
          ]
        },
      ],
    },
  },

  // ─── PORTFOLIO ───────────────────────────────────────────────────────────────

  {
    id: "portfolio-masonry",
    name: "Masonry Grid",
    category: "portfolio",
    designStyle: "creative",
    description: "Pinterest-style varying-height image grid",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#111827", padding: "64px 40px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Selected Work", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", textAlign: "center", marginBottom: "48px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }, children: [
            ...(["from-violet-500 to-indigo-600", "from-rose-500 to-pink-600", "from-amber-400 to-orange-500", "from-teal-500 to-cyan-600", "from-blue-500 to-violet-600", "from-emerald-400 to-teal-500"].map((_grad, i) => ({
              id: "", order: i, type: "container" as const, content: "",
              styles: { background: `linear-gradient(135deg, var(--tw-gradient-stops))`, backgroundImage: `linear-gradient(135deg, #${["7c3aed,4f46e5", "f43f5e,ec4899", "fbbf24,f97316", "14b8a6,06b6d4", "3b82f6,7c3aed", "34d399,14b8a6"][i]})`, borderRadius: "12px", display: "flex", alignItems: "flex-end", padding: "20px", aspectRatio: i % 3 === 1 ? "4/5" : "3/4" } as any,
              children: [
                { id: "", order: 0, type: "paragraph" as const, content: `Project ${i + 1}`, styles: { fontSize: "14px", fontWeight: "700", color: "#FFFFFF" } },
              ],
            }))),
          ]
        },
      ],
    },
  },

  {
    id: "portfolio-case-study",
    name: "Case Study",
    category: "portfolio",
    designStyle: "minimal",
    description: "Problem/solution/result layout with metrics",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "80px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "800px", margin: "0 auto" }, children: [
            { id: "", order: 0, type: "badge", content: "Case Study", styles: { backgroundColor: "#EEF2FF", color: "#6366F1", padding: "4px 14px", borderRadius: "999px", fontSize: "12px", fontWeight: "700", marginBottom: "16px", display: "inline-block" } },
            { id: "", order: 1, type: "heading", content: "Redesigning Checkout for 40% More Conversions", props: { level: 1 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", letterSpacing: "-0.03em", marginBottom: "32px" } },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "48px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#F9FAFB", borderRadius: "12px", padding: "20px" }, children: [
                    { id: "", order: 0, type: "heading", content: "+40%", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#6366F1" } },
                    { id: "", order: 1, type: "paragraph", content: "Conversion rate", styles: { fontSize: "13px", color: "#6B7280" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#F9FAFB", borderRadius: "12px", padding: "20px" }, children: [
                    { id: "", order: 0, type: "heading", content: "–55%", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#10B981" } },
                    { id: "", order: 1, type: "paragraph", content: "Cart abandonment", styles: { fontSize: "13px", color: "#6B7280" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#F9FAFB", borderRadius: "12px", padding: "20px" }, children: [
                    { id: "", order: 0, type: "heading", content: "3 wks", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#F59E0B" } },
                    { id: "", order: 1, type: "paragraph", content: "Design to launch", styles: { fontSize: "13px", color: "#6B7280" } },
                  ]
                },
              ]
            },
            { id: "", order: 3, type: "heading", content: "The problem", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" } },
            { id: "", order: 4, type: "paragraph", content: "The existing 5-step checkout process had a 72% abandonment rate. Users were confused by redundant fields, unclear progress indicators, and a jarring payment form.", styles: { fontSize: "16px", color: "#6B7280", lineHeight: "1.7", marginBottom: "24px" } },
            { id: "", order: 5, type: "heading", content: "The solution", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", marginBottom: "8px" } },
            { id: "", order: 6, type: "paragraph", content: "We collapsed checkout to 2 steps with address auto-fill, inline validation, and a persistent order summary. Apple Pay and Google Pay were surfaced prominently.", styles: { fontSize: "16px", color: "#6B7280", lineHeight: "1.7" } },
          ]
        },
      ],
    },
  },

  {
    id: "portfolio-skills-bar",
    name: "Skills Bar",
    category: "portfolio",
    designStyle: "minimal",
    description: "Animated progress bars for skills",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "80px 40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "700px", margin: "0 auto" }, children: [
            { id: "", order: 0, type: "heading", content: "Skills & Expertise", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#111827", marginBottom: "40px" } },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
                ...(([["Product Design", 95, "#6366F1"], ["User Research", 88, "#8B5CF6"], ["Figma / Sketch", 92, "#EC4899"], ["Prototyping", 85, "#F59E0B"], ["Design Systems", 78, "#10B981"]] as [string, number, string][]).map(([skill, pct, color], i) => ({
                  id: "", order: i, type: "container" as const, content: "",
                  children: [
                    {
                      id: "", order: 0, type: "container" as const, content: "", styles: { display: "flex", justifyContent: "space-between", marginBottom: "6px" }, children: [
                        { id: "", order: 0, type: "paragraph" as const, content: skill, styles: { fontSize: "14px", fontWeight: "600", color: "#111827" } },
                        { id: "", order: 1, type: "paragraph" as const, content: `${pct}%`, styles: { fontSize: "14px", fontWeight: "700", color } },
                      ]
                    },
                    {
                      id: "", order: 1, type: "container" as const, content: "", styles: { backgroundColor: "#E5E7EB", borderRadius: "999px", height: "8px", overflow: "hidden" }, children: [
                        { id: "", order: 0, type: "container" as const, content: "", styles: { backgroundColor: color, height: "100%", width: `${pct}%`, borderRadius: "999px" } },
                      ]
                    },
                  ],
                }))),
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── DASHBOARD ───────────────────────────────────────────────────────────────

  {
    id: "dash-kpi-cards",
    name: "KPI Cards Row",
    category: "dashboard",
    designStyle: "modern",
    description: "4-column row of stat cards with icon, value, trend arrow",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#F9FAFB", padding: "32px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }, children: [
            ...([
              { icon: "💰", label: "Revenue", value: "$48,295", trend: "+12.5%", trendUp: true, color: "#6366F1", bg: "#EEF2FF" },
              { icon: "👥", label: "New Users", value: "1,429", trend: "+8.2%", trendUp: true, color: "#10B981", bg: "#ECFDF5" },
              { icon: "📦", label: "Orders", value: "348", trend: "-3.1%", trendUp: false, color: "#F59E0B", bg: "#FFF7ED" },
              { icon: "⭐", label: "Satisfaction", value: "4.8/5", trend: "+0.2", trendUp: true, color: "#EC4899", bg: "#FDF2F8" },
            ].map((card, i) => ({
              id: "", order: i, type: "container" as const, content: "",
              styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "20px", border: "1px solid #E5E7EB", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" },
              children: [
                {
                  id: "", order: 0, type: "container" as const, content: "", styles: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }, children: [
                    { id: "", order: 0, type: "paragraph" as const, content: card.icon, styles: { fontSize: "20px", width: "40px", height: "40px", backgroundColor: card.bg, borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" } },
                    { id: "", order: 1, type: "paragraph" as const, content: card.trend, styles: { fontSize: "12px", fontWeight: "700", color: card.trendUp ? "#10B981" : "#EF4444", backgroundColor: card.trendUp ? "#ECFDF5" : "#FEF2F2", padding: "2px 8px", borderRadius: "999px" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph" as const, content: card.label, styles: { fontSize: "13px", color: "#9CA3AF", marginBottom: "4px" } },
                { id: "", order: 2, type: "heading" as const, content: card.value, props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#111827" } },
              ],
            }))),
          ]
        },
      ],
    },
  },

  {
    id: "dash-data-table",
    name: "Data Table",
    category: "dashboard",
    designStyle: "modern",
    description: "Sortable, searchable table with pagination",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", overflow: "hidden", margin: "0 32px 32px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { padding: "20px 24px", borderBottom: "1px solid #E5E7EB", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            { id: "", order: 0, type: "heading", content: "Recent Orders", props: { level: 3 }, styles: { fontSize: "16px", fontWeight: "700", color: "#111827" } },
            {
              id: "", order: 1, type: "container", content: "", styles: { border: "1px solid #E5E7EB", borderRadius: "8px", padding: "6px 14px", display: "flex", alignItems: "center", gap: "8px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🔍 Search orders…", styles: { fontSize: "13px", color: "#9CA3AF" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "12px 24px", backgroundColor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }, children: [
                ...["Order", "Customer", "Date", "Amount", "Status"].map((h, i) => ({
                  id: "", order: i, type: "paragraph" as const, content: h, styles: { fontSize: "12px", fontWeight: "700", color: "#6B7280", textTransform: "uppercase" as const, letterSpacing: "0.04em" },
                })),
              ]
            },
            ...([
              ["#1042", "Alice Johnson", "Mar 28", "$299.00", "Delivered"],
              ["#1041", "Bob Smith", "Mar 27", "$149.50", "Processing"],
              ["#1040", "Carol White", "Mar 26", "$89.99", "Shipped"],
              ["#1039", "Dan Lee", "Mar 25", "$450.00", "Delivered"],
            ].map((row, i) => ({
              id: "", order: i + 1, type: "container" as const, content: "",
              styles: { display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr 1fr", padding: "14px 24px", borderBottom: "1px solid #F3F4F6", alignItems: "center" },
              children: row.map((cell, ci) => ({
                id: "", order: ci, type: "paragraph" as const, content: cell,
                styles: ci === 4 ? {
                  fontSize: "12px", fontWeight: "700",
                  color: cell === "Delivered" ? "#10B981" : cell === "Shipped" ? "#6366F1" : "#F59E0B",
                  backgroundColor: cell === "Delivered" ? "#ECFDF5" : cell === "Shipped" ? "#EEF2FF" : "#FFF7ED",
                  padding: "2px 10px", borderRadius: "999px", display: "inline-block",
                } : { fontSize: "14px", color: ci === 0 ? "#111827" : "#6B7280", fontWeight: ci === 0 ? "600" : "400" },
              })),
            }))),
          ]
        },
      ],
    },
  },

  // ─── UTILITY ─────────────────────────────────────────────────────────────────

  {
    id: "util-cookie-banner",
    name: "Cookie Consent Banner",
    category: "utility",
    designStyle: "minimal",
    description: "GDPR consent bar with accept/decline",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#1F2937", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", position: "fixed", bottom: "0", left: "0", right: "0", zIndex: "1000" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "🍪 We use cookies to improve your experience. By continuing, you agree to our Privacy Policy.", styles: { fontSize: "14px", color: "#D1D5DB", flex: "1", minWidth: "240px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", gap: "8px" }, children: [
            { id: "", order: 0, type: "button", content: "Decline", styles: { backgroundColor: "transparent", color: "#9CA3AF", border: "1px solid #374151", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" } },
            { id: "", order: 1, type: "button", content: "Accept All", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "8px 16px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer" } },
          ]
        },
      ],
    },
  },

  {
    id: "util-404-page",
    name: "404 Page",
    category: "utility",
    designStyle: "modern",
    description: "Illustrated 404 with search and home CTA",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#FFFFFF", padding: "100px 40px", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "20px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "🔍", styles: { fontSize: "80px" } },
            { id: "", order: 1, type: "heading", content: "404", props: { level: 1 }, styles: { fontSize: "96px", fontWeight: "900", color: "#6366F1", letterSpacing: "-0.06em", lineHeight: "1" } },
            { id: "", order: 2, type: "heading", content: "Page not found", props: { level: 2 }, styles: { fontSize: "28px", fontWeight: "700", color: "#111827" } },
            { id: "", order: 3, type: "paragraph", content: "Sorry, we couldn't find the page you're looking for. It may have moved or been deleted.", styles: { fontSize: "16px", color: "#6B7280", lineHeight: "1.6" } },
            {
              id: "", order: 4, type: "container", content: "", styles: { display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }, children: [
                { id: "", order: 0, type: "button", content: "← Go Home", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", cursor: "pointer" } },
                { id: "", order: 1, type: "button", content: "Contact Support", styles: { backgroundColor: "#F3F4F6", color: "#111827", padding: "12px 24px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", cursor: "pointer" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "util-maintenance",
    name: "Maintenance Mode",
    category: "utility",
    designStyle: "minimal",
    description: "Full-page countdown with back soon message",
    element: {
      type: "container", content: "",
      styles: { background: "linear-gradient(135deg, #0F172A, #1E293B)", padding: "100px 40px", textAlign: "center", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "500px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "🔧", styles: { fontSize: "64px" } },
            { id: "", order: 1, type: "heading", content: "We'll be back soon", props: { level: 1 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", letterSpacing: "-0.03em" } },
            { id: "", order: 2, type: "paragraph", content: "We're performing scheduled maintenance. We'll be back online shortly. Thank you for your patience!", styles: { fontSize: "16px", color: "#94A3B8", lineHeight: "1.7" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", gap: "24px", justifyContent: "center" }, children: [
                ...([["00", "Hours"], ["32", "Minutes"], ["45", "Seconds"]].map(([val, label], i) => ({
                  id: "", order: i, type: "container" as const, content: "",
                  styles: { backgroundColor: "rgba(255,255,255,0.05)", borderRadius: "12px", padding: "16px 24px", minWidth: "80px" },
                  children: [
                    { id: "", order: 0, type: "heading" as const, content: val, props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "900", color: "#6366F1", letterSpacing: "-0.03em" } },
                    { id: "", order: 1, type: "paragraph" as const, content: label, styles: { fontSize: "11px", color: "#64748B", fontWeight: "600", textTransform: "uppercase" as const, letterSpacing: "0.05em" } },
                  ],
                }))),
              ]
            },
            { id: "", order: 4, type: "paragraph", content: "Follow @acme for updates", styles: { fontSize: "14px", color: "#64748B" } },
          ]
        },
      ],
    },
  },

  {
    id: "util-embed-section",
    name: "Embed Section",
    category: "utility",
    designStyle: "minimal",
    description: "YouTube/Vimeo/Loom embed with thumbnail",
    element: {
      type: "container", content: "",
      styles: { backgroundColor: "#111827", padding: "80px 40px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Watch the demo", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#FFFFFF", textAlign: "center", marginBottom: "40px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "800px", margin: "0 auto", aspectRatio: "16/9", backgroundColor: "#1F2937", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", position: "relative" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { position: "absolute", inset: "0", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "▶", styles: { fontSize: "40px", width: "80px", height: "80px", backgroundColor: "#6366F1", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#FFFFFF" } },
                { id: "", order: 1, type: "paragraph", content: "Click to play • 3:42", styles: { fontSize: "14px", color: "#94A3B8" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── AUTH FORMS (functional) ─────────────────────────────────────────────────
  // These use the `auth-signin-form` / `auth-signup-form` element types which
  // render a fully-functional form in preview mode (wired to SiteAuthContext).

  {
    id: "func-auth-signin-minimal",
    name: "Sign In — Minimal (Live)",
    category: "auth",
    designStyle: "minimal",
    description: "Functional email + password sign-in card. Connect your auth provider in the Auth panel.",
    element: {
      type: "auth-signin-form",
      content: "",
      props: {
        variant: "minimal",
        accentColor: "#6366F1",
        heading: "Welcome back",
        subheading: "Sign in to your account",
        buttonText: "Sign in",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signup-minimal",
    name: "Sign Up — Minimal (Live)",
    category: "auth",
    designStyle: "minimal",
    description: "Functional email + password sign-up card. Connect your auth provider in the Auth panel.",
    element: {
      type: "auth-signup-form",
      content: "",
      props: {
        variant: "minimal",
        accentColor: "#6366F1",
        heading: "Create your account",
        subheading: "Free forever — no card required",
        buttonText: "Create account",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signin-split",
    name: "Sign In — Split Panel (Live)",
    category: "auth",
    designStyle: "modern",
    description: "Functional split-panel sign-in: brand on the left, form on the right.",
    element: {
      type: "auth-signin-form",
      content: "",
      props: {
        variant: "split",
        accentColor: "#6366F1",
        heading: "Welcome back",
        subheading: "Sign in to continue",
        buttonText: "Sign in",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signup-split",
    name: "Sign Up — Split Panel (Live)",
    category: "auth",
    designStyle: "modern",
    description: "Functional split-panel sign-up: brand on the left, form on the right.",
    element: {
      type: "auth-signup-form",
      content: "",
      props: {
        variant: "split",
        accentColor: "#6366F1",
        heading: "Create your account",
        subheading: "Start building today",
        buttonText: "Create account",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signin-dark",
    name: "Sign In — Dark (Live)",
    category: "auth",
    designStyle: "dark",
    description: "Functional dark-mode sign-in card.",
    element: {
      type: "auth-signin-form",
      content: "",
      props: {
        variant: "dark",
        accentColor: "#818CF8",
        heading: "Welcome back",
        subheading: "Sign in to your account",
        buttonText: "Sign in",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signup-dark",
    name: "Sign Up — Dark (Live)",
    category: "auth",
    designStyle: "dark",
    description: "Functional dark-mode sign-up card.",
    element: {
      type: "auth-signup-form",
      content: "",
      props: {
        variant: "dark",
        accentColor: "#818CF8",
        heading: "Join us today",
        subheading: "Create your account for free",
        buttonText: "Get started",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signin-glass",
    name: "Sign In — Glass (Live)",
    category: "auth",
    designStyle: "glass",
    description: "Functional glassmorphism sign-in card.",
    element: {
      type: "auth-signin-form",
      content: "",
      props: {
        variant: "glass",
        accentColor: "#6366F1",
        heading: "Welcome back",
        subheading: "Sign in to continue",
        buttonText: "Sign in",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signup-glass",
    name: "Sign Up — Glass (Live)",
    category: "auth",
    designStyle: "glass",
    description: "Functional glassmorphism sign-up card on a rich gradient background.",
    element: {
      type: "auth-signup-form",
      content: "",
      props: {
        variant: "glass",
        accentColor: "#6366F1",
        heading: "Create your account",
        subheading: "Start for free today",
        buttonText: "Get started",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signin-elevated",
    name: "Sign In — Elevated (Live)",
    category: "auth",
    designStyle: "minimal",
    description: "Functional sign-in card with a dramatic floating shadow on a soft background.",
    element: {
      type: "auth-signin-form",
      content: "",
      props: {
        variant: "elevated",
        accentColor: "#6366F1",
        heading: "Welcome back",
        subheading: "Sign in to continue to your account",
        buttonText: "Sign in",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signup-elevated",
    name: "Sign Up — Elevated (Live)",
    category: "auth",
    designStyle: "minimal",
    description: "Functional sign-up card with a dramatic floating shadow on a soft background.",
    element: {
      type: "auth-signup-form",
      content: "",
      props: {
        variant: "elevated",
        accentColor: "#6366F1",
        heading: "Create your account",
        subheading: "Join thousands of users — it's free",
        buttonText: "Create account",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signin-aurora",
    name: "Sign In — Aurora (Live)",
    category: "auth",
    designStyle: "modern",
    description: "Functional sign-in card on a vivid aurora gradient background with glass effect.",
    element: {
      type: "auth-signin-form",
      content: "",
      props: {
        variant: "aurora",
        accentColor: "#7C3AED",
        heading: "Welcome back",
        subheading: "Sign in to continue to your account",
        buttonText: "Sign in",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  {
    id: "func-auth-signup-aurora",
    name: "Sign Up — Aurora (Live)",
    category: "auth",
    designStyle: "modern",
    description: "Functional sign-up card on a vivid aurora gradient background with glass effect.",
    element: {
      type: "auth-signup-form",
      content: "",
      props: {
        variant: "aurora",
        accentColor: "#7C3AED",
        heading: "Create your account",
        subheading: "Join thousands of users — it's free",
        buttonText: "Get started",
        showSocialLogin: true,
      },
      styles: {},
    },
  },

  // ─── CMS SECTION BLOCKS ──────────────────────────────────────────────────────
  // These use the `cms-list` element type and are pre-configured for common
  // content patterns. Connect a collection in the Data tab to go live.

  {
    id: "cms-blog-cards",
    name: "Blog — Card Grid",
    category: "blog",
    designStyle: "modern",
    description: "3-column card grid for blog posts. Shows image, title, excerpt, and date.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "3",
        limit: 6,
        cardStyle: "shadow",
        imageHeight: "md",
        gap: "md",
        showDate: true,
        showReadMore: true,
        readMoreText: "Read article",
        accentColor: "#6366f1",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-blog-featured",
    name: "Blog — Featured Hero",
    category: "blog",
    designStyle: "modern",
    description: "Large featured post hero with supporting articles in a 3-col grid below.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "featured",
        columns: "3",
        limit: 7,
        cardStyle: "default",
        imageHeight: "lg",
        gap: "md",
        showDate: true,
        showReadMore: true,
        readMoreText: "Read more",
        accentColor: "#6366f1",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-blog-magazine",
    name: "Blog — Magazine Layout",
    category: "blog",
    designStyle: "modern",
    description: "Editorial magazine layout: large featured story left, smaller stories stacked on right.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "magazine",
        limit: 5,
        cardStyle: "default",
        imageHeight: "xl",
        gap: "md",
        showDate: true,
        showReadMore: true,
        readMoreText: "Read",
        accentColor: "#ef4444",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-blog-minimal",
    name: "Blog — Minimal List",
    category: "blog",
    designStyle: "minimal",
    description: "Numbered text-only post list. Clean, fast, great for newsletters or journals.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "minimal",
        limit: 8,
        cardStyle: "default",
        gap: "sm",
        showDate: true,
        showReadMore: false,
        accentColor: "#6366f1",
      },
      styles: { width: "100%", paddingTop: "48px", paddingBottom: "48px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-blog-masonry",
    name: "Blog — Masonry Grid",
    category: "blog",
    designStyle: "creative",
    description: "Variable-height masonry card grid. Perfect for photo-heavy blogs or portfolios.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "masonry",
        limit: 9,
        cardStyle: "shadow",
        gap: "md",
        showDate: false,
        showReadMore: true,
        readMoreText: "View →",
        accentColor: "#8b5cf6",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-team-grid",
    name: "Team — Member Cards",
    category: "team",
    designStyle: "modern",
    description: "2-column team member cards. Shows avatar, name, role, and bio.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "2",
        limit: 6,
        cardStyle: "bordered",
        imageHeight: "sm",
        gap: "md",
        showDate: false,
        showReadMore: false,
        accentColor: "#10b981",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-team-list",
    name: "Team — List View",
    category: "team",
    designStyle: "minimal",
    description: "Horizontal row layout for team members with photo and bio side by side.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "list",
        limit: 8,
        cardStyle: "flat",
        gap: "sm",
        showDate: false,
        showReadMore: false,
        accentColor: "#0ea5e9",
      },
      styles: { width: "100%", paddingTop: "48px", paddingBottom: "48px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-products-grid",
    name: "Products — Card Grid",
    category: "ecommerce",
    designStyle: "modern",
    description: "4-column product showcase with image, name, price, and category badge.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "4",
        limit: 8,
        cardStyle: "shadow",
        imageHeight: "md",
        gap: "md",
        showDate: false,
        showReadMore: true,
        readMoreText: "View product",
        accentColor: "#f59e0b",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-products-featured",
    name: "Products — Featured Showcase",
    category: "ecommerce",
    designStyle: "bold",
    description: "Hero product spotlight with supporting items in a 3-col grid.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "featured",
        columns: "3",
        limit: 7,
        cardStyle: "colored",
        imageHeight: "lg",
        gap: "md",
        showDate: false,
        showReadMore: true,
        readMoreText: "Shop now",
        accentColor: "#f97316",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-testimonials-cards",
    name: "Testimonials — Card Grid",
    category: "testimonials",
    designStyle: "modern",
    description: "3-column testimonial cards with star ratings and author details.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "3",
        limit: 6,
        cardStyle: "glass",
        imageHeight: "sm",
        gap: "md",
        showDate: false,
        showReadMore: false,
        accentColor: "#f59e0b",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-testimonials-list",
    name: "Testimonials — Minimal List",
    category: "testimonials",
    designStyle: "minimal",
    description: "Clean text testimonials in a list format. Simple and focused.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "list",
        limit: 5,
        cardStyle: "flat",
        gap: "sm",
        showDate: false,
        showReadMore: false,
        accentColor: "#6366f1",
      },
      styles: { width: "100%", paddingTop: "48px", paddingBottom: "48px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-portfolio-masonry",
    name: "Portfolio — Masonry Gallery",
    category: "portfolio",
    designStyle: "creative",
    description: "Masonry image gallery for portfolio or creative work. Hover reveals details.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "masonry",
        limit: 9,
        cardStyle: "default",
        gap: "sm",
        showDate: false,
        showReadMore: true,
        readMoreText: "View project",
        accentColor: "#ec4899",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-portfolio-grid",
    name: "Portfolio — Card Grid",
    category: "portfolio",
    designStyle: "modern",
    description: "3-column portfolio grid with category badges and hover effects.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "grid",
        columns: "3",
        limit: 9,
        cardStyle: "shadow",
        imageHeight: "lg",
        gap: "md",
        showDate: false,
        showReadMore: true,
        readMoreText: "Case study →",
        accentColor: "#8b5cf6",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-events-list",
    name: "Events — Date List",
    category: "content",
    designStyle: "modern",
    description: "Upcoming events list showing date, title, and description with clean rows.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "list",
        limit: 8,
        cardStyle: "bordered",
        gap: "sm",
        showDate: true,
        showReadMore: true,
        readMoreText: "Register →",
        accentColor: "#0ea5e9",
      },
      styles: { width: "100%", paddingTop: "48px", paddingBottom: "48px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-news-magazine",
    name: "News — Magazine",
    category: "blog",
    designStyle: "bold",
    description: "Bold editorial news layout with large featured story and sidebar items.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "magazine",
        limit: 5,
        cardStyle: "flat",
        imageHeight: "xl",
        gap: "md",
        showDate: true,
        showReadMore: true,
        readMoreText: "Full story",
        accentColor: "#dc2626",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-case-studies",
    name: "Case Studies — Feature Cards",
    category: "saas",
    designStyle: "corporate",
    description: "2-column case study cards with colored accent border, excerpt, and CTA.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "2",
        limit: 4,
        cardStyle: "colored",
        imageHeight: "md",
        gap: "md",
        showDate: false,
        showReadMore: true,
        readMoreText: "Read case study →",
        accentColor: "#2563eb",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-events-cards",
    name: "Events — Modern Grid",
    category: "content",
    designStyle: "modern",
    description: "3-column grid of event cards with prominent dates and 'Register' CTA.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "3",
        limit: 6,
        cardStyle: "shadow",
        imageHeight: "md",
        gap: "lg",
        showDate: true,
        showReadMore: true,
        readMoreText: "Register Now",
        accentColor: "#8b5cf6",
      },
      styles: { width: "100%", paddingTop: "80px", paddingBottom: "80px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-team-creative",
    name: "Team — Creative Gallery",
    category: "team",
    designStyle: "creative",
    description: "Rounded avatars in a 4-column grid with a playful accent color.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "4",
        limit: 8,
        cardStyle: "glass",
        imageHeight: "sm",
        gap: "md",
        showDate: false,
        showReadMore: false,
        accentColor: "#ec4899",
      },
      styles: { width: "100%", paddingTop: "64px", paddingBottom: "64px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-blog-magazine-v2",
    name: "Blog — Editorial Grid",
    category: "blog",
    designStyle: "corporate",
    description: "Sophisticated editorial layout with a focus on high-quality imagery.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "featured",
        columns: "2",
        limit: 5,
        cardStyle: "bordered",
        imageHeight: "lg",
        gap: "xl",
        showDate: true,
        showReadMore: true,
        readMoreText: "Keep reading",
        accentColor: "#111827",
      },
      styles: { width: "100%", paddingTop: "96px", paddingBottom: "96px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-stats-grid",
    name: "Stats — Data Grid",
    category: "stats",
    designStyle: "minimal",
    description: "Simple, high-impact grid for displaying numbers and metrics from CMS.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "cards",
        columns: "4",
        limit: 4,
        cardStyle: "flat",
        imageHeight: "sm",
        gap: "md",
        showDate: false,
        showReadMore: false,
        accentColor: "#10b981",
      },
      styles: { width: "100%", paddingTop: "48px", paddingBottom: "48px", paddingLeft: "32px", paddingRight: "32px" },
    },
  },

  {
    id: "cms-faq-list",
    name: "FAQ — Content List",
    category: "faq",
    designStyle: "minimal",
    description: "Clean text-only list for FAQs or documentation snippets.",
    element: {
      type: "cms-list",
      content: "",
      props: {
        collectionSlug: "",
        layout: "minimal",
        limit: 10,
        gap: "sm",
        showDate: false,
        showReadMore: false,
        accentColor: "#6366f1",
      },
      styles: { width: "100%", maxWidth: "800px", margin: "0 auto", paddingTop: "64px", paddingBottom: "64px" },
    },
  },

  // ─── INTERACTIVE ─────────────────────────────────────────────────────────────

  {
    id: "sb-interactive-countdown",
    name: "Interactive — Launch Countdown",
    category: "interactive",
    designStyle: "dark",
    description: "Full-width dark countdown section for product launches.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
      children: [
        { id: "", order: 0, type: "eyebrow", content: "Coming Soon", styles: { color: "#818CF8", letterSpacing: "0.15em", fontSize: "13px", fontWeight: "700" } },
        { id: "", order: 1, type: "heading", content: "Something Big Is Coming.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#FFFFFF", margin: "0", textAlign: "center", letterSpacing: "-0.03em" } },
        { id: "", order: 2, type: "paragraph", content: "Be the first to know when we launch. Join our early-access list.", styles: { color: "#94A3B8", fontSize: "18px", textAlign: "center", maxWidth: "480px" } },
        { id: "", order: 3, type: "countdown", content: "", props: { targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), accentColor: "#818CF8" }, styles: { textAlign: "center", padding: "20px" } },
        { id: "", order: 4, type: "button", content: "Notify Me →", props: { variant: "solid", accentColor: "#6366F1", fullWidth: false }, styles: {} },
      ],
    },
  },

  {
    id: "sb-interactive-progress-skills",
    name: "Interactive — Skills / Progress",
    category: "interactive",
    designStyle: "minimal",
    description: "Animated skill bars for showcasing expertise levels.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", maxWidth: "800px", margin: "0 auto" },
      children: [
        { id: "", order: 0, type: "eyebrow", content: "Expertise", styles: { color: "#6366F1", letterSpacing: "0.12em", fontSize: "12px", fontWeight: "700" } },
        { id: "", order: 1, type: "heading", content: "Our Skill Set", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0 0 40px" } },
        { id: "", order: 2, type: "progress", content: "Design Systems", props: { value: 92, max: 100, accentColor: "#6366F1" }, styles: {} },
        { id: "", order: 3, type: "progress", content: "Full-Stack Development", props: { value: 88, max: 100, accentColor: "#8B5CF6" }, styles: {} },
        { id: "", order: 4, type: "progress", content: "DevOps & Cloud", props: { value: 75, max: 100, accentColor: "#06B6D4" }, styles: {} },
        { id: "", order: 5, type: "progress", content: "Data & Analytics", props: { value: 68, max: 100, accentColor: "#10B981" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-interactive-tabs-features",
    name: "Interactive — Tabbed Features",
    category: "interactive",
    designStyle: "modern",
    description: "Feature showcase with interactive tab navigation.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Platform Features", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Everything you need to ship", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "800", color: "#111827", margin: "0" } },
          ],
        },
        {
          id: "", order: 1, type: "tabs", content: "", props: { accentColor: "#6366F1" },
          styles: { width: "100%", maxWidth: "900px" },
        },
      ],
    },
  },

  {
    id: "sb-interactive-accordion-faq",
    name: "Interactive — Accordion FAQ",
    category: "interactive",
    designStyle: "minimal",
    description: "Clean expandable FAQ using the accordion component.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", maxWidth: "720px", margin: "0 auto" },
      children: [
        { id: "", order: 0, type: "eyebrow", content: "Got Questions?", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
        { id: "", order: 1, type: "heading", content: "Frequently Asked Questions", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0 0 40px" } },
        { id: "", order: 2, type: "accordion", content: "", props: { multiple: false, accentColor: "#6366F1" }, styles: { width: "100%" } },
      ],
    },
  },

  {
    id: "sb-interactive-carousel",
    name: "Interactive — Content Carousel",
    category: "interactive",
    designStyle: "modern",
    description: "Auto-playing carousel for showcasing portfolio or testimonials.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#0F172A", display: "flex", flexDirection: "column", gap: "40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Recent Work", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
            { id: "", order: 1, type: "button", content: "View All →", props: { variant: "outline", accentColor: "#FFFFFF" }, styles: {} },
          ],
        },
        { id: "", order: 1, type: "carousel", content: "", props: { autoplay: true, pagination: true, accentColor: "#6366F1" }, styles: { width: "100%" } },
      ],
    },
  },

  {
    id: "sb-interactive-chart",
    name: "Interactive — Analytics Chart",
    category: "interactive",
    designStyle: "modern",
    description: "Dashboard-style analytics chart with key metrics.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" },
              children: [
                { id: "", order: 0, type: "heading", content: "Revenue Overview", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Last 12 months", styles: { color: "#6B7280", fontSize: "14px" } },
              ],
            },
            { id: "", order: 1, type: "number-display", content: "$284k", props: { label: "Total Revenue", accentColor: "#10B981" }, styles: {} },
          ],
        },
        { id: "", order: 1, type: "chart", content: "", props: { chartType: "area", accentColor: "#6366F1" }, styles: { width: "100%", height: "320px" } },
      ],
    },
  },

  // ─── CONTENT ─────────────────────────────────────────────────────────────────

  {
    id: "sb-content-rich-text",
    name: "Content — Article Body",
    category: "content",
    designStyle: "minimal",
    description: "Clean article body layout with rich-text blocks.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", maxWidth: "720px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "24px" },
      children: [
        { id: "", order: 0, type: "eyebrow", content: "Tutorial", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
        { id: "", order: 1, type: "heading", content: "Getting Started Guide", props: { level: 1 }, styles: { fontSize: "48px", fontWeight: "900", color: "#111827", margin: "0" } },
        { id: "", order: 2, type: "paragraph", content: "An introduction paragraph that hooks the reader and sets the stage for the rest of the article.", styles: { fontSize: "20px", color: "#4B5563", lineHeight: "1.7" } },
        { id: "", order: 3, type: "image", content: "", styles: { width: "100%", borderRadius: "12px" }, props: { src: "", alt: "Article cover image" } },
        { id: "", order: 4, type: "rich-text", content: "## Section One\n\nStart writing your content here. You can use **bold**, *italics*, and [links](#).\n\n## Section Two\n\nContinue with more detailed content for this section.", styles: {} },
      ],
    },
  },

  {
    id: "sb-content-feature-list",
    name: "Content — Feature List",
    category: "content",
    designStyle: "modern",
    description: "Icon-led feature list with descriptions — great for product pages.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Why choose us", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Everything you need to scale your product confidently.", styles: { color: "#6B7280", fontSize: "18px", maxWidth: "480px", margin: "0 auto" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px", width: "100%", maxWidth: "680px" },
          children: [
            { id: "", order: 0, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["99.9% uptime SLA with automatic failover", "End-to-end encryption at rest and in transit", "GDPR, SOC 2, and HIPAA compliant by default", "24/7 priority support with < 2 hour response time", "One-click rollbacks and blue/green deployments"], accentColor: "#6366F1" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-content-steps-guide",
    name: "Content — Steps Guide",
    category: "content",
    designStyle: "minimal",
    description: "Numbered steps walkthrough for onboarding or tutorials.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Quick Start", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Up and running in minutes", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
          ],
        },
        { id: "", order: 1, type: "steps", content: "", props: { direction: "horizontal", currentStep: 1, accentColor: "#6366F1" }, styles: { width: "100%", maxWidth: "900px" } },
      ],
    },
  },

  {
    id: "sb-content-blockquote",
    name: "Content — Pull Quote",
    category: "content",
    designStyle: "bold",
    description: "Large pull-quote section for articles or brand statements.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#F5F3FF", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px" },
      children: [
        { id: "", order: 0, type: "blockquote", content: "The best way to predict the future is to build it.", props: { cite: "Alan Kay", accentColor: "#6366F1" }, styles: { fontSize: "32px", fontStyle: "italic", textAlign: "center", maxWidth: "720px", color: "#1E1B4B" } },
        { id: "", order: 1, type: "avatar", content: "Alan Kay", props: { src: "", size: "md", showName: true }, styles: {} },
      ],
    },
  },

  {
    id: "sb-content-comparison",
    name: "Content — Before / After",
    category: "content",
    designStyle: "modern",
    description: "Side-by-side before/after comparison for product demos.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        { id: "", order: 0, type: "heading", content: "See the difference", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0", textAlign: "center" } },
        { id: "", order: 1, type: "before-after", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%", maxWidth: "900px" } },
      ],
    },
  },

  // ─── CONTACT ─────────────────────────────────────────────────────────────────

  {
    id: "sb-contact-newsletter",
    name: "Contact — Newsletter Signup",
    category: "contact",
    designStyle: "modern",
    description: "High-converting newsletter signup with inline email input.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#6366F1", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Stay in the loop", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Get the latest news, articles, and resources delivered straight to your inbox.", styles: { color: "rgba(255,255,255,0.8)", fontSize: "18px", maxWidth: "480px", margin: "0 auto" } },
          ],
        },
        {
          id: "", order: 1, type: "form", content: "", props: { bgType: "transparent", successMessage: "You're subscribed! Watch your inbox." },
          styles: { display: "flex", flexDirection: "row", gap: "12px", maxWidth: "480px", width: "100%", padding: "0" },
          children: [
            { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "you@company.com", required: true }, styles: { flex: "1" } },
            { id: "", order: 1, type: "button", content: "Subscribe", props: { submitForm: true, accentColor: "#111827", variant: "solid" }, styles: {} },
          ],
        },
        { id: "", order: 2, type: "paragraph", content: "No spam. Unsubscribe at any time.", styles: { color: "rgba(255,255,255,0.5)", fontSize: "13px" } },
      ],
    },
  },

  {
    id: "sb-contact-map",
    name: "Contact — With Map",
    category: "contact",
    designStyle: "minimal",
    description: "Contact info sidebar with an embedded map.",
    element: {
      type: "container", content: "",
      styles: { padding: "0", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", minHeight: "500px", overflow: "hidden" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { flex: "1", padding: "80px 48px", display: "flex", flexDirection: "column", gap: "32px", justifyContent: "center" },
          children: [
            { id: "", order: 0, type: "heading", content: "Find Us", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Visit our office or drop us a line — we'd love to hear from you.", styles: { color: "#6B7280", fontSize: "16px" } },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "paragraph", content: "📍  123 Main Street, Suite 400, San Francisco, CA 94105", styles: { color: "#374151", fontSize: "16px" } },
                { id: "", order: 1, type: "paragraph", content: "📞  +1 (555) 000-0000", styles: { color: "#374151", fontSize: "16px" } },
                { id: "", order: 2, type: "paragraph", content: "✉️  hello@company.com", styles: { color: "#374151", fontSize: "16px" } },
              ],
            },
          ],
        },
        {
          id: "", order: 1, type: "map", content: "",
          props: { lat: 37.7749, lng: -122.4194, zoom: 13 },
          styles: { flex: "1", minHeight: "500px" },
        },
      ],
    },
  },

  {
    id: "sb-contact-card",
    name: "Contact — Card Grid",
    category: "contact",
    designStyle: "modern",
    description: "Three-column contact method cards.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Get in touch", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0", textAlign: "center" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "100%", maxWidth: "900px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", border: "1px solid #E5E7EB" },
              children: [
                { id: "", order: 0, type: "icon", content: "✉️", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "Email", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "hello@company.com", styles: { color: "#6B7280", fontSize: "14px" } },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", border: "1px solid #E5E7EB" },
              children: [
                { id: "", order: 0, type: "icon", content: "📞", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "Phone", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "+1 (555) 000-0000", styles: { color: "#6B7280", fontSize: "14px" } },
              ],
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "32px", textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", border: "1px solid #E5E7EB" },
              children: [
                { id: "", order: 0, type: "icon", content: "💬", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "Live Chat", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Mon–Fri, 9am–6pm EST", styles: { color: "#6B7280", fontSize: "14px" } },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-contact-dark",
    name: "Contact — Dark Full-Width Form",
    category: "contact",
    designStyle: "dark",
    description: "Immersive dark contact form with decorative gradient.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "-20%", left: "50%", transform: "translateX(-50%)", width: "700px", height: "500px", backgroundImage: "radial-gradient(ellipse at center, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: "2" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Get in touch", styles: { color: "#818CF8", letterSpacing: "0.15em", fontSize: "12px", fontWeight: "700" } },
            { id: "", order: 1, type: "heading", content: "Let's work together", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.03em" } },
          ],
        },
        {
          id: "", order: 2, type: "form", content: "", props: { bgType: "dark", successMessage: "Message received! We'll reply within 24 hours." },
          styles: { maxWidth: "600px", width: "100%", padding: "0", position: "relative", zIndex: "2" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "16px" },
              children: [
                { id: "", order: 0, type: "input", content: "", props: { label: "First name", placeholder: "Alex", required: true }, styles: { flex: "1" } },
                { id: "", order: 1, type: "input", content: "", props: { label: "Last name", placeholder: "Smith" }, styles: { flex: "1" } },
              ],
            },
            { id: "", order: 1, type: "input", content: "", props: { label: "Email", inputType: "email", placeholder: "alex@company.com", required: true }, styles: {} },
            { id: "", order: 2, type: "textarea", content: "", props: { label: "Message", placeholder: "Tell us about your project...", rows: 5, required: true }, styles: {} },
            { id: "", order: 3, type: "button", content: "Send Message →", props: { submitForm: true, accentColor: "#6366F1", fullWidth: true }, styles: {} },
          ],
        },
      ],
    },
  },

  // ─── LOGO CLOUD ──────────────────────────────────────────────────────────────

  {
    id: "sb-logos-light",
    name: "Logo Cloud — Light",
    category: "logo-cloud",
    designStyle: "minimal",
    description: "Simple white background logo strip with soft gray company names.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "Trusted by teams at", styles: { fontSize: "13px", color: "#9CA3AF", margin: "0", fontWeight: "600", letterSpacing: "0.06em", textTransform: "uppercase", textAlign: "center" } },
        {
          id: "", order: 1, type: "container", content: "",
          styles: { display: "flex", flexWrap: "wrap", gap: "48px", alignItems: "center", justifyContent: "center", maxWidth: "1000px" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "Stripe", styles: { fontSize: "22px", fontWeight: "800", color: "#D1D5DB", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Shopify", styles: { fontSize: "22px", fontWeight: "800", color: "#D1D5DB", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Notion", styles: { fontSize: "22px", fontWeight: "800", color: "#D1D5DB", margin: "0" } },
            { id: "", order: 3, type: "paragraph", content: "Linear", styles: { fontSize: "22px", fontWeight: "800", color: "#D1D5DB", margin: "0" } },
            { id: "", order: 4, type: "paragraph", content: "Figma", styles: { fontSize: "22px", fontWeight: "800", color: "#D1D5DB", margin: "0" } },
            { id: "", order: 5, type: "paragraph", content: "Vercel", styles: { fontSize: "22px", fontWeight: "800", color: "#D1D5DB", margin: "0" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-logos-badges",
    name: "Logo Cloud — Badge Style",
    category: "logo-cloud",
    designStyle: "modern",
    description: "Company names in pill badges for a modern look.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "Powering 10,000+ teams worldwide", styles: { fontSize: "14px", color: "#6B7280", margin: "0", fontWeight: "600", textAlign: "center" } },
        {
          id: "", order: 1, type: "container", content: "",
          styles: { display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center", justifyContent: "center", maxWidth: "800px" },
          children: [
            { id: "", order: 0, type: "badge", content: "Stripe", props: { variant: "soft", color: "gray" }, styles: {} },
            { id: "", order: 1, type: "badge", content: "GitHub", props: { variant: "soft", color: "gray" }, styles: {} },
            { id: "", order: 2, type: "badge", content: "Shopify", props: { variant: "soft", color: "gray" }, styles: {} },
            { id: "", order: 3, type: "badge", content: "Notion", props: { variant: "soft", color: "gray" }, styles: {} },
            { id: "", order: 4, type: "badge", content: "Linear", props: { variant: "soft", color: "gray" }, styles: {} },
            { id: "", order: 5, type: "badge", content: "Vercel", props: { variant: "soft", color: "gray" }, styles: {} },
            { id: "", order: 6, type: "badge", content: "Figma", props: { variant: "soft", color: "gray" }, styles: {} },
            { id: "", order: 7, type: "badge", content: "Loom", props: { variant: "soft", color: "gray" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-logos-with-stats",
    name: "Logo Cloud — With Social Proof",
    category: "logo-cloud",
    designStyle: "modern",
    description: "Logo cloud paired with a user count and star rating.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", gap: "32px", flexWrap: "wrap", justifyContent: "center" },
          children: [
            { id: "", order: 0, type: "avatar-group", content: "", props: { count: 3, label: "+12,000 users" }, styles: {} },
            { id: "", order: 1, type: "rating", content: "", props: { value: 5, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
            { id: "", order: 2, type: "paragraph", content: "4.9/5 from 3,400+ reviews", styles: { color: "#374151", fontSize: "14px", fontWeight: "600" } },
          ],
        },
        { id: "", order: 1, type: "paragraph", content: "Trusted by teams at", styles: { fontSize: "12px", color: "#9CA3AF", margin: "0", fontWeight: "700", letterSpacing: "0.1em", textTransform: "uppercase" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexWrap: "wrap", gap: "40px", alignItems: "center", justifyContent: "center" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "Stripe", styles: { fontSize: "20px", fontWeight: "900", color: "#9CA3AF", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Shopify", styles: { fontSize: "20px", fontWeight: "900", color: "#9CA3AF", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "GitHub", styles: { fontSize: "20px", fontWeight: "900", color: "#9CA3AF", margin: "0" } },
            { id: "", order: 3, type: "paragraph", content: "Figma", styles: { fontSize: "20px", fontWeight: "900", color: "#9CA3AF", margin: "0" } },
            { id: "", order: 4, type: "paragraph", content: "Vercel", styles: { fontSize: "20px", fontWeight: "900", color: "#9CA3AF", margin: "0" } },
          ],
        },
      ],
    },
  },

  // ─── DASHBOARD ───────────────────────────────────────────────────────────────

  {
    id: "sb-dashboard-metrics",
    name: "Dashboard — Metrics Row",
    category: "dashboard",
    designStyle: "minimal",
    description: "Four KPI cards with trend indicators for analytics dashboards.",
    element: {
      type: "container", content: "",
      styles: { padding: "32px", backgroundColor: "#F9FAFB", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
      children: [
        { id: "", order: 0, type: "metric-card", content: "", props: { label: "Total Revenue", value: "$48.2k", trend: "up", change: "+12.5%", accentColor: "#10B981" }, styles: {} },
        { id: "", order: 1, type: "metric-card", content: "", props: { label: "Active Users", value: "8,241", trend: "up", change: "+4.1%", accentColor: "#6366F1" }, styles: {} },
        { id: "", order: 2, type: "metric-card", content: "", props: { label: "Churn Rate", value: "2.4%", trend: "down", change: "-0.8%", accentColor: "#EF4444" }, styles: {} },
        { id: "", order: 3, type: "metric-card", content: "", props: { label: "Avg. Session", value: "4m 32s", trend: "up", change: "+18s", accentColor: "#F59E0B" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-dashboard-chart",
    name: "Dashboard — Chart Panel",
    category: "dashboard",
    designStyle: "modern",
    description: "Full analytics chart panel with title and period selector.",
    element: {
      type: "container", content: "",
      styles: { padding: "32px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: "24px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" },
              children: [
                { id: "", order: 0, type: "heading", content: "Monthly Revenue", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Last 6 months", styles: { color: "#9CA3AF", fontSize: "13px" } },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "8px" },
              children: [
                { id: "", order: 0, type: "button", content: "1M", props: { variant: "outline", accentColor: "#6366F1" }, styles: { padding: "4px 12px", fontSize: "12px" } },
                { id: "", order: 1, type: "button", content: "6M", props: { variant: "solid", accentColor: "#6366F1" }, styles: { padding: "4px 12px", fontSize: "12px" } },
                { id: "", order: 2, type: "button", content: "1Y", props: { variant: "outline", accentColor: "#6366F1" }, styles: { padding: "4px 12px", fontSize: "12px" } },
              ],
            },
          ],
        },
        { id: "", order: 1, type: "chart", content: "", props: { chartType: "area", accentColor: "#6366F1" }, styles: { width: "100%", height: "280px" } },
      ],
    },
  },

  {
    id: "sb-dashboard-table",
    name: "Dashboard — Data Table",
    category: "dashboard",
    designStyle: "minimal",
    description: "Clean data table panel for displaying records.",
    element: {
      type: "container", content: "",
      styles: { padding: "32px", backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: "20px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
          children: [
            { id: "", order: 0, type: "heading", content: "Recent Orders", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "search-input", content: "", props: { placeholder: "Search orders...", accentColor: "#6366F1" }, styles: { maxWidth: "240px" } },
          ],
        },
        { id: "", order: 1, type: "data-table", content: "", props: { columns: ["Order", "Customer", "Amount", "Status"], rows: [["#1234", "Alice", "$199", "Paid"], ["#1233", "Bob", "$89", "Pending"], ["#1232", "Carol", "$349", "Paid"]], accentColor: "#6366F1" }, styles: { width: "100%" } },
      ],
    },
  },

  {
    id: "sb-dashboard-overview",
    name: "Dashboard — Full Overview",
    category: "dashboard",
    designStyle: "modern",
    description: "Combined metrics + chart dashboard layout.",
    element: {
      type: "container", content: "",
      styles: { padding: "32px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", gap: "24px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
          children: [
            { id: "", order: 0, type: "heading", content: "Dashboard Overview", props: { level: 2 }, styles: { fontSize: "26px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "button", content: "Export CSV", props: { variant: "outline", accentColor: "#6366F1" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
          children: [
            { id: "", order: 0, type: "metric-card", content: "", props: { label: "Revenue", value: "$82k", trend: "up", change: "+8%", accentColor: "#10B981" }, styles: {} },
            { id: "", order: 1, type: "metric-card", content: "", props: { label: "Users", value: "12.4k", trend: "up", change: "+3.2%", accentColor: "#6366F1" }, styles: {} },
            { id: "", order: 2, type: "metric-card", content: "", props: { label: "Conversions", value: "5.8%", trend: "up", change: "+0.4%", accentColor: "#F59E0B" }, styles: {} },
            { id: "", order: 3, type: "metric-card", content: "", props: { label: "Avg. Order", value: "$124", trend: "down", change: "-$6", accentColor: "#EF4444" }, styles: {} },
          ],
        },
        { id: "", order: 2, type: "chart", content: "", props: { chartType: "bar", accentColor: "#6366F1" }, styles: { width: "100%", height: "300px" } },
      ],
    },
  },

  // ─── SERVICES ────────────────────────────────────────────────────────────────

  {
    id: "sb-services-card-grid",
    name: "Services — Card Grid",
    category: "services",
    designStyle: "modern",
    description: "Three-column service cards with icon, title, and description.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "What We Offer", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Services built for growth", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "From strategy to execution, we handle every aspect of your digital transformation.", styles: { color: "#6B7280", fontSize: "18px" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { padding: "32px", backgroundColor: "#F9FAFB", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "icon", content: "🎨", styles: { fontSize: "36px" } },
                { id: "", order: 1, type: "heading", content: "UI/UX Design", props: { level: 4 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Pixel-perfect interfaces that convert visitors into customers.", styles: { color: "#6B7280", fontSize: "15px" } },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { padding: "32px", backgroundColor: "#F9FAFB", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "icon", content: "⚡", styles: { fontSize: "36px" } },
                { id: "", order: 1, type: "heading", content: "Development", props: { level: 4 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Scalable full-stack apps built with the latest technologies.", styles: { color: "#6B7280", fontSize: "15px" } },
              ],
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { padding: "32px", backgroundColor: "#F9FAFB", borderRadius: "16px", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "icon", content: "📈", styles: { fontSize: "36px" } },
                { id: "", order: 1, type: "heading", content: "Growth Marketing", props: { level: 4 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Data-driven strategies that accelerate your acquisition.", styles: { color: "#6B7280", fontSize: "15px" } },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-services-alternating",
    name: "Services — Alternating Rows",
    category: "services",
    designStyle: "minimal",
    description: "Left-right alternating service rows with icon and description.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "80px", maxWidth: "1000px", margin: "0 auto" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", gap: "64px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "eyebrow", content: "01 — Strategy", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
                { id: "", order: 1, type: "heading", content: "We start with your goals", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "800", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Before writing a single line of code, we map out your objectives, audience, and competitive landscape.", styles: { color: "#6B7280", fontSize: "16px", lineHeight: "1.7" } },
              ],
            },
            { id: "", order: 1, type: "container", content: "", styles: { flex: "1", height: "280px", backgroundColor: "#F3F4F6", borderRadius: "20px" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row-reverse", alignItems: "center", gap: "64px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "eyebrow", content: "02 — Build", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
                { id: "", order: 1, type: "heading", content: "Then we ship fast", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "800", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Agile sprints with weekly demos keep you in the loop and ensure we never build the wrong thing.", styles: { color: "#6B7280", fontSize: "16px", lineHeight: "1.7" } },
              ],
            },
            { id: "", order: 1, type: "container", content: "", styles: { flex: "1", height: "280px", backgroundColor: "#F3F4F6", borderRadius: "20px" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-services-dark-list",
    name: "Services — Dark Icon List",
    category: "services",
    designStyle: "dark",
    description: "Dark section with icon-led service list and CTA.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Everything in one place", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.03em" } },
            { id: "", order: 1, type: "paragraph", content: "Stop juggling tools. Get everything you need under one roof.", styles: { color: "#94A3B8", fontSize: "18px" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "20px", width: "100%", maxWidth: "800px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { padding: "24px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "row", gap: "16px", alignItems: "flex-start" }, children: [
                { id: "", order: 0, type: "icon", content: "🚀", styles: { fontSize: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "Fast Deployment", props: { level: 5 }, styles: { fontSize: "16px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 6px" } },
                    { id: "", order: 1, type: "paragraph", content: "Ship to production in seconds with zero downtime.", styles: { color: "#64748B", fontSize: "14px" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { padding: "24px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "row", gap: "16px", alignItems: "flex-start" }, children: [
                { id: "", order: 0, type: "icon", content: "🔒", styles: { fontSize: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "Enterprise Security", props: { level: 5 }, styles: { fontSize: "16px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 6px" } },
                    { id: "", order: 1, type: "paragraph", content: "SOC 2, GDPR, and HIPAA compliant out of the box.", styles: { color: "#64748B", fontSize: "14px" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { padding: "24px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "row", gap: "16px", alignItems: "flex-start" }, children: [
                { id: "", order: 0, type: "icon", content: "📊", styles: { fontSize: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "Analytics Built-in", props: { level: 5 }, styles: { fontSize: "16px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 6px" } },
                    { id: "", order: 1, type: "paragraph", content: "Real-time insights without a third-party tool.", styles: { color: "#64748B", fontSize: "14px" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { padding: "24px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "row", gap: "16px", alignItems: "flex-start" }, children: [
                { id: "", order: 0, type: "icon", content: "🤝", styles: { fontSize: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: {}, children: [
                    { id: "", order: 0, type: "heading", content: "White-Glove Support", props: { level: 5 }, styles: { fontSize: "16px", fontWeight: "700", color: "#FFFFFF", margin: "0 0 6px" } },
                    { id: "", order: 1, type: "paragraph", content: "Dedicated success manager for every enterprise plan.", styles: { color: "#64748B", fontSize: "14px" } },
                  ]
                },
              ]
            },
          ],
        },
        { id: "", order: 2, type: "button", content: "Explore all features →", props: { variant: "solid", accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-services-minimal-timeline",
    name: "Services — Process Timeline",
    category: "services",
    designStyle: "minimal",
    description: "Vertical timeline showing your service delivery process.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Our Process", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "How we deliver results", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
          ],
        },
        { id: "", order: 1, type: "timeline", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%", maxWidth: "640px" } },
      ],
    },
  },

  // ─── PRICING ─────────────────────────────────────────────────────────────────

  {
    id: "sb-pricing-dark-cards",
    name: "Pricing — Dark Cards",
    category: "pricing",
    designStyle: "dark",
    description: "Three-tier pricing on a dark background with a highlighted popular plan.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Pricing", styles: { color: "#818CF8", letterSpacing: "0.15em" } },
            { id: "", order: 1, type: "heading", content: "Simple, transparent pricing", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.03em" } },
            { id: "", order: 2, type: "paragraph", content: "No hidden fees. Cancel anytime.", styles: { color: "#64748B", fontSize: "18px" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "100%", maxWidth: "1000px" },
          children: [
            { id: "", order: 0, type: "pricing-card", content: "", props: { planName: "Starter", price: "$0", period: "month", features: ["1 project", "5 GB storage", "Community support"], accentColor: "#6366F1" }, styles: {} },
            { id: "", order: 1, type: "pricing-card", content: "", props: { planName: "Pro", price: "$29", period: "month", features: ["10 projects", "50 GB storage", "Priority support", "Analytics"], accentColor: "#6366F1", highlighted: true, badge: "Most Popular" }, styles: {} },
            { id: "", order: 2, type: "pricing-card", content: "", props: { planName: "Enterprise", price: "$99", period: "month", features: ["Unlimited projects", "500 GB storage", "24/7 support", "SSO & SAML", "Custom contracts"], accentColor: "#6366F1" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-pricing-comparison-table",
    name: "Pricing — Comparison Table",
    category: "pricing",
    designStyle: "minimal",
    description: "Feature-by-feature comparison table across three plans.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Compare plans", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "All plans include a 14-day free trial. No credit card required.", styles: { color: "#6B7280", fontSize: "17px" } },
          ],
        },
        { id: "", order: 1, type: "comparison", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%" } },
      ],
    },
  },

  {
    id: "sb-pricing-minimal-single",
    name: "Pricing — Single Plan",
    category: "pricing",
    designStyle: "minimal",
    description: "Clean single-price layout — ideal for simple SaaS.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "One plan. Everything included.", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "All features, all users, one flat price.", styles: { color: "#6B7280", fontSize: "18px" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E5E7EB", padding: "48px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", maxWidth: "480px", width: "100%", boxShadow: "0 4px 24px rgba(0,0,0,0.05)" },
          children: [
            { id: "", order: 0, type: "badge", content: "All-inclusive", props: { variant: "soft", color: "indigo" }, styles: {} },
            {
              id: "", order: 1, type: "container", content: "", styles: { textAlign: "center" },
              children: [
                { id: "", order: 0, type: "paragraph", content: "$49", styles: { fontSize: "64px", fontWeight: "900", color: "#111827", margin: "0", lineHeight: "1" } },
                { id: "", order: 1, type: "paragraph", content: "per month, per team", styles: { color: "#9CA3AF", fontSize: "15px" } },
              ],
            },
            { id: "", order: 2, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["Unlimited users & projects", "Priority email support", "99.9% SLA", "Custom integrations", "Advanced analytics"], accentColor: "#6366F1" }, styles: { width: "100%" } },
            { id: "", order: 3, type: "button", content: "Start free trial", props: { variant: "solid", accentColor: "#6366F1", fullWidth: true }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-pricing-enterprise",
    name: "Pricing — Enterprise CTA",
    category: "pricing",
    designStyle: "corporate",
    description: "Enterprise pricing contact section with key benefits.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#1E293B", display: "flex", flexDirection: "row", alignItems: "center", gap: "64px", flexWrap: "wrap" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", minWidth: "280px" },
          children: [
            { id: "", order: 0, type: "badge", content: "Enterprise", props: { variant: "soft", color: "indigo" }, styles: {} },
            { id: "", order: 1, type: "heading", content: "Built for scale", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Custom contracts, SLA guarantees, SSO, and a dedicated success manager.", styles: { color: "#94A3B8", fontSize: "17px" } },
            { id: "", order: 3, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["Custom pricing & contracts", "SAML SSO & SCIM provisioning", "99.99% uptime SLA", "Dedicated success manager", "On-prem deployment option"], accentColor: "#818CF8" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", padding: "40px", backgroundColor: "#0F172A", borderRadius: "20px", display: "flex", flexDirection: "column", gap: "20px", minWidth: "280px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Talk to sales", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#FFFFFF", margin: "0" } },
            {
              id: "", order: 1, type: "form", content: "", props: { bgType: "transparent", successMessage: "We'll reach out within 24 hours!" }, styles: { padding: "0" }, children: [
                { id: "", order: 0, type: "input", content: "", props: { label: "Work email", inputType: "email", placeholder: "you@company.com", required: true }, styles: {} },
                { id: "", order: 1, type: "input", content: "", props: { label: "Company name", placeholder: "Acme Inc.", required: true }, styles: {} },
                { id: "", order: 2, type: "select", content: "", props: { label: "Team size", options: ["1–10", "11–50", "51–200", "200+"] }, styles: {} },
                { id: "", order: 3, type: "button", content: "Request a demo →", props: { submitForm: true, accentColor: "#6366F1", fullWidth: true }, styles: {} },
              ]
            },
          ],
        },
      ],
    },
  },

  // ─── STATS ───────────────────────────────────────────────────────────────────

  {
    id: "sb-stats-minimal-row",
    name: "Stats — Minimal Row",
    category: "stats",
    designStyle: "minimal",
    description: "Four clean stat numbers in a single row.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", justifyContent: "center", gap: "64px", flexWrap: "wrap" },
      children: [
        { id: "", order: 0, type: "number-display", content: "10M+", props: { label: "Downloads", accentColor: "#6366F1" }, styles: { textAlign: "center" } },
        { id: "", order: 1, type: "number-display", content: "99.9%", props: { label: "Uptime", accentColor: "#10B981" }, styles: { textAlign: "center" } },
        { id: "", order: 2, type: "number-display", content: "$2B+", props: { label: "Processed", accentColor: "#F59E0B" }, styles: { textAlign: "center" } },
        { id: "", order: 3, type: "number-display", content: "180+", props: { label: "Countries", accentColor: "#8B5CF6" }, styles: { textAlign: "center" } },
      ],
    },
  },

  {
    id: "sb-stats-dark-cards",
    name: "Stats — Dark Cards",
    category: "stats",
    designStyle: "dark",
    description: "Dark background metric cards with colored accent lines.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Numbers that speak for themselves", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", margin: "0", textAlign: "center" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", width: "100%" },
          children: [
            { id: "", order: 0, type: "metric-card", content: "", props: { label: "Monthly Active Users", value: "2.4M", trend: "up", change: "+32%", accentColor: "#818CF8" }, styles: {} },
            { id: "", order: 1, type: "metric-card", content: "", props: { label: "Revenue Run Rate", value: "$12M", trend: "up", change: "+48%", accentColor: "#34D399" }, styles: {} },
            { id: "", order: 2, type: "metric-card", content: "", props: { label: "NPS Score", value: "72", trend: "up", change: "+8pts", accentColor: "#FBBF24" }, styles: {} },
            { id: "", order: 3, type: "metric-card", content: "", props: { label: "Countries Served", value: "120+", trend: "up", change: "+12", accentColor: "#F87171" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-stats-with-chart",
    name: "Stats — With Chart",
    category: "stats",
    designStyle: "modern",
    description: "Key stats above a line/bar chart for credibility.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Growth at a glance", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Consistent, compounding growth", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", justifyContent: "center", gap: "48px", flexWrap: "wrap" },
          children: [
            { id: "", order: 0, type: "number-display", content: "340%", props: { label: "YoY growth", accentColor: "#6366F1" }, styles: { textAlign: "center" } },
            { id: "", order: 1, type: "number-display", content: "$50M", props: { label: "ARR", accentColor: "#10B981" }, styles: { textAlign: "center" } },
            { id: "", order: 2, type: "number-display", content: "4.9★", props: { label: "Avg rating", accentColor: "#F59E0B" }, styles: { textAlign: "center" } },
          ],
        },
        { id: "", order: 2, type: "chart", content: "", props: { chartType: "line", accentColor: "#6366F1" }, styles: { width: "100%", height: "300px" } },
      ],
    },
  },

  // ─── CTA ─────────────────────────────────────────────────────────────────────

  {
    id: "sb-cta-gradient-wave",
    name: "CTA — Gradient Wave",
    category: "cta",
    designStyle: "bold",
    description: "Full-bleed gradient CTA with large headline and dual buttons.",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundImage: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #EC4899 100%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "heading", content: "Ready to transform your business?", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.03em", maxWidth: "700px" } },
        { id: "", order: 1, type: "paragraph", content: "Join 50,000+ companies already using our platform to ship faster, grow smarter, and delight customers.", styles: { color: "rgba(255,255,255,0.8)", fontSize: "20px", maxWidth: "540px" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "16px", flexWrap: "wrap", justifyContent: "center" },
          children: [
            { id: "", order: 0, type: "button", content: "Start free trial", props: { variant: "solid", accentColor: "#FFFFFF" }, styles: { color: "#6366F1" } },
            { id: "", order: 1, type: "button", content: "Watch demo", props: { variant: "outline", accentColor: "#FFFFFF" }, styles: {} },
          ],
        },
        { id: "", order: 3, type: "paragraph", content: "No credit card required. 14-day free trial.", styles: { color: "rgba(255,255,255,0.6)", fontSize: "14px" } },
      ],
    },
  },

  {
    id: "sb-cta-minimal-center",
    name: "CTA — Minimal Centered",
    category: "cta",
    designStyle: "minimal",
    description: "Simple centered CTA with headline, sub-copy, and a single button.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center", borderTop: "1px solid #E5E7EB" },
      children: [
        { id: "", order: 0, type: "heading", content: "Start building today.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#111827", margin: "0", letterSpacing: "-0.03em" } },
        { id: "", order: 1, type: "paragraph", content: "Free forever on the Starter plan. Upgrade when you're ready.", styles: { color: "#6B7280", fontSize: "18px", maxWidth: "420px" } },
        { id: "", order: 2, type: "button", content: "Get started for free →", props: { variant: "solid", accentColor: "#111827" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-cta-split-image",
    name: "CTA — Split Image",
    category: "cta",
    designStyle: "modern",
    description: "Left text CTA with a product screenshot on the right.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "row", alignItems: "center", gap: "64px", flexWrap: "wrap" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", minWidth: "280px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Get started", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Launch your product faster", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Our drag-and-drop builder, global CDN, and one-click deployments let you ship in days, not months.", styles: { color: "#6B7280", fontSize: "17px", lineHeight: "1.7" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px" },
              children: [
                { id: "", order: 0, type: "button", content: "Start building", props: { variant: "solid", accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 1, type: "button", content: "See examples →", props: { variant: "ghost", accentColor: "#6366F1" }, styles: {} },
              ],
            },
          ],
        },
        { id: "", order: 1, type: "container", content: "", styles: { flex: "1", height: "360px", backgroundColor: "#E0E7FF", borderRadius: "24px", minWidth: "280px" } },
      ],
    },
  },

  // ─── FEATURES ────────────────────────────────────────────────────────────────

  {
    id: "sb-features-bento",
    name: "Features — Bento Grid",
    category: "features",
    designStyle: "modern",
    description: "Asymmetric bento-style feature grid for visual impact.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px", maxWidth: "600px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Features", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "The platform that does it all", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "800", color: "#111827", margin: "0" } },
          ],
        },
        { id: "", order: 1, type: "bento-grid", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%" } },
      ],
    },
  },

  {
    id: "sb-features-icon-3col",
    name: "Features — Icon 3-Column",
    category: "features",
    designStyle: "minimal",
    description: "Three-column feature grid with emoji icons and short descriptions.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Why teams love us", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "32px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                { id: "", order: 0, type: "icon", content: "⚡", styles: { fontSize: "36px" } },
                { id: "", order: 1, type: "heading", content: "10× Faster", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Build and ship features faster than ever with our streamlined workflow.", styles: { color: "#6B7280", fontSize: "15px" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                { id: "", order: 0, type: "icon", content: "🔒", styles: { fontSize: "36px" } },
                { id: "", order: 1, type: "heading", content: "Enterprise Secure", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "SOC 2 certified. Data encrypted at rest and in transit.", styles: { color: "#6B7280", fontSize: "15px" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                { id: "", order: 0, type: "icon", content: "🌍", styles: { fontSize: "36px" } },
                { id: "", order: 1, type: "heading", content: "Global CDN", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Deploy to 200+ edge locations worldwide for < 50ms latency.", styles: { color: "#6B7280", fontSize: "15px" } },
              ]
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-features-highlight-dark",
    name: "Features — Dark Highlight",
    category: "features",
    designStyle: "dark",
    description: "Full-bleed dark feature highlight with glowing card.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "row", alignItems: "center", gap: "64px", flexWrap: "wrap" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", minWidth: "280px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Platform highlight", styles: { color: "#818CF8", letterSpacing: "0.15em", fontSize: "12px", fontWeight: "700" } },
            { id: "", order: 1, type: "heading", content: "Deploy anywhere, instantly", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.03em" } },
            { id: "", order: 2, type: "paragraph", content: "Push to main and watch your app go live in seconds across our global edge network.", styles: { color: "#64748B", fontSize: "17px", lineHeight: "1.7" } },
            { id: "", order: 3, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["Zero-downtime deployments", "Automatic rollbacks", "Preview URLs for every PR", "Edge caching out of the box"], accentColor: "#818CF8" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", padding: "48px", backgroundColor: "rgba(99,102,241,0.08)", borderRadius: "24px", border: "1px solid rgba(99,102,241,0.2)", minHeight: "320px", minWidth: "280px" },
          children: [
            { id: "", order: 0, type: "code-block", content: "$ git push origin main\n✓ Build passed (8.2s)\n✓ Deployed to edge (12 regions)\n✓ Live at https://yourapp.com", props: { language: "bash" }, styles: { backgroundColor: "transparent", color: "#A3E635", padding: "0", fontFamily: "monospace" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-features-how-it-works",
    name: "Features — How It Works",
    category: "features",
    designStyle: "modern",
    description: "Three-step how-it-works section with numbered steps.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "How it works", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Three steps to launch", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "From idea to production in under an hour.", styles: { color: "#6B7280", fontSize: "18px" } },
          ],
        },
        { id: "", order: 1, type: "how-it-works", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%" } },
      ],
    },
  },

  // ─── TESTIMONIALS ────────────────────────────────────────────────────────────

  {
    id: "sb-testimonials-single-quote",
    name: "Testimonials — Single Large Quote",
    category: "testimonials",
    designStyle: "minimal",
    description: "One featured testimonial, full-width, with large quote mark.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "❝", styles: { fontSize: "72px", color: "#C7D2FE", lineHeight: "1", margin: "0" } },
        { id: "", order: 1, type: "heading", content: "BuildStack cut our development time in half. We went from idea to paying customers in three weeks.", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "700", color: "#1E293B", margin: "0", maxWidth: "720px", lineHeight: "1.4" } },
        { id: "", order: 2, type: "avatar", content: "Sarah Chen", props: { src: "", size: "md", showName: true }, styles: {} },
        { id: "", order: 3, type: "paragraph", content: "CEO at Orbit Labs", styles: { color: "#6B7280", fontSize: "14px" } },
      ],
    },
  },

  {
    id: "sb-testimonials-dark-grid",
    name: "Testimonials — Dark Grid",
    category: "testimonials",
    designStyle: "dark",
    description: "Dark masonry-style testimonial grid.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Loved by builders worldwide", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
            { id: "", order: 1, type: "rating", content: "", props: { value: 5, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { padding: "28px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "rating", content: "", props: { value: 5, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
                { id: "", order: 1, type: "paragraph", content: "\"The best no-code tool I've ever used. Shipped our MVP in 2 days.\"", styles: { color: "#E2E8F0", fontSize: "15px", lineHeight: "1.6" } },
                { id: "", order: 2, type: "avatar", content: "Alex M.", props: { src: "", size: "sm", showName: true }, styles: {} },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { padding: "28px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "rating", content: "", props: { value: 5, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
                { id: "", order: 1, type: "paragraph", content: "\"Our conversion rate went up 40% after redesigning with BuildStack.\"", styles: { color: "#E2E8F0", fontSize: "15px", lineHeight: "1.6" } },
                { id: "", order: 2, type: "avatar", content: "Maria K.", props: { src: "", size: "sm", showName: true }, styles: {} },
              ],
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { padding: "28px", backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                { id: "", order: 0, type: "rating", content: "", props: { value: 5, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
                { id: "", order: 1, type: "paragraph", content: "\"Finally a builder that doesn't limit what I can create. 10/10.\"", styles: { color: "#E2E8F0", fontSize: "15px", lineHeight: "1.6" } },
                { id: "", order: 2, type: "avatar", content: "James T.", props: { src: "", size: "sm", showName: true }, styles: {} },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-testimonials-wall",
    name: "Testimonials — Love Wall",
    category: "testimonials",
    designStyle: "minimal",
    description: "Compact testimonial wall with many short quotes.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        { id: "", order: 0, type: "heading", content: "People love it", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0", textAlign: "center" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", width: "100%" },
          children: [
            { id: "", order: 0, type: "blockquote", content: "\"Replaced three tools with one.\"", props: { cite: "Dev Lead @ Stripe", accentColor: "#6366F1" }, styles: { fontSize: "14px" } },
            { id: "", order: 1, type: "blockquote", content: "\"Our team shipped 2× faster.\"", props: { cite: "CTO @ Linear", accentColor: "#8B5CF6" }, styles: { fontSize: "14px" } },
            { id: "", order: 2, type: "blockquote", content: "\"Best DX I've experienced in years.\"", props: { cite: "Indie Hacker", accentColor: "#06B6D4" }, styles: { fontSize: "14px" } },
            { id: "", order: 3, type: "blockquote", content: "\"Went from wireframe to live in 4 hours.\"", props: { cite: "Founder @ Nexus", accentColor: "#10B981" }, styles: { fontSize: "14px" } },
          ],
        },
      ],
    },
  },

  // ─── PORTFOLIO ───────────────────────────────────────────────────────────────

  {
    id: "sb-portfolio-bento",
    name: "Portfolio — Bento Grid",
    category: "portfolio",
    designStyle: "modern",
    description: "Asymmetric bento grid of project cards.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", width: "100%", flexWrap: "wrap", gap: "16px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Selected Work", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "button", content: "View all →", props: { variant: "ghost", accentColor: "#6366F1" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "16px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#E0E7FF", borderRadius: "20px", height: "360px", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "32px" }, children: [
                { id: "", order: 0, type: "badge", content: "Web App", props: { variant: "soft", color: "indigo" }, styles: {} },
                { id: "", order: 1, type: "heading", content: "E-commerce Redesign", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#1E1B4B", margin: "8px 0 0" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" },
              children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FEF3C7", borderRadius: "20px", flex: "1", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }, children: [
                    { id: "", order: 0, type: "badge", content: "Mobile", props: { variant: "soft", color: "yellow" }, styles: {} },
                    { id: "", order: 1, type: "heading", content: "FinTech App", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#92400E", margin: "8px 0 0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#D1FAE5", borderRadius: "20px", flex: "1", padding: "24px", display: "flex", flexDirection: "column", justifyContent: "flex-end" }, children: [
                    { id: "", order: 0, type: "badge", content: "SaaS", props: { variant: "soft", color: "green" }, styles: {} },
                    { id: "", order: 1, type: "heading", content: "Analytics Dashboard", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#065F46", margin: "8px 0 0" } },
                  ]
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-portfolio-dark-cards",
    name: "Portfolio — Dark Cards",
    category: "portfolio",
    designStyle: "dark",
    description: "Dark portfolio cards with hover reveal effect.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", gap: "40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Our Work", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
            { id: "", order: 1, type: "button", content: "View all cases →", props: { variant: "outline", accentColor: "#818CF8" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" },
              children: [
                { id: "", order: 0, type: "container", content: "", styles: { height: "200px", backgroundColor: "#1E3A5F" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "badge", content: "Branding", props: { variant: "soft", color: "blue" }, styles: {} },
                    { id: "", order: 1, type: "heading", content: "Stellar Rebrand", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#FFFFFF", margin: "0" } },
                  ]
                },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" },
              children: [
                { id: "", order: 0, type: "container", content: "", styles: { height: "200px", backgroundColor: "#3D1A6B" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "badge", content: "Web App", props: { variant: "soft", color: "purple" }, styles: {} },
                    { id: "", order: 1, type: "heading", content: "Nexus Platform", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#FFFFFF", margin: "0" } },
                  ]
                },
              ],
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "20px", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden", display: "flex", flexDirection: "column" },
              children: [
                { id: "", order: 0, type: "container", content: "", styles: { height: "200px", backgroundColor: "#064E3B" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "badge", content: "E-Commerce", props: { variant: "soft", color: "green" }, styles: {} },
                    { id: "", order: 1, type: "heading", content: "Leaf Shop", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#FFFFFF", margin: "0" } },
                  ]
                },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-portfolio-case-study",
    name: "Portfolio — Case Study",
    category: "portfolio",
    designStyle: "minimal",
    description: "In-depth case study layout with problem, solution, and results.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "64px", maxWidth: "900px", margin: "0 auto" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px" },
          children: [
            { id: "", order: 0, type: "badge", content: "Case Study", props: { variant: "soft", color: "indigo" }, styles: {} },
            { id: "", order: 1, type: "heading", content: "How Orbit Labs 3× their conversion rate", props: { level: 1 }, styles: { fontSize: "52px", fontWeight: "900", color: "#111827", margin: "0", letterSpacing: "-0.03em" } },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "32px", flexWrap: "wrap" },
              children: [
                { id: "", order: 0, type: "number-display", content: "312%", props: { label: "Conversion lift", accentColor: "#10B981" }, styles: {} },
                { id: "", order: 1, type: "number-display", content: "8 weeks", props: { label: "Time to ship", accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 2, type: "number-display", content: "$2.4M", props: { label: "Revenue added", accentColor: "#F59E0B" }, styles: {} },
              ],
            },
          ],
        },
        { id: "", order: 1, type: "container", content: "", styles: { height: "400px", backgroundColor: "#F3F4F6", borderRadius: "20px" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px" },
          children: [
            { id: "", order: 0, type: "heading", content: "The Challenge", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "rich-text", content: "Orbit Labs had a beautiful product but a checkout flow that was leaking customers. Their old website took 4+ weeks to update and couldn't keep up with rapid iteration needs.", styles: { color: "#4B5563", fontSize: "16px", lineHeight: "1.8" } },
          ],
        },
      ],
    },
  },

  // ─── TEAM ────────────────────────────────────────────────────────────────────

  {
    id: "sb-team-spotlight",
    name: "Team — Founder Spotlight",
    category: "team",
    designStyle: "modern",
    description: "Large founder/executive spotlight with photo, bio, and social links.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", alignItems: "center", gap: "64px", flexWrap: "wrap", maxWidth: "1100px", margin: "0 auto" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { width: "340px", height: "400px", backgroundColor: "#F3F4F6", borderRadius: "24px", flexShrink: "0" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "20px", minWidth: "260px" },
          children: [
            { id: "", order: 0, type: "badge", content: "Founder & CEO", props: { variant: "soft", color: "indigo" }, styles: {} },
            { id: "", order: 1, type: "heading", content: "Sarah Chen", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "900", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Sarah is a second-time founder who previously led product at Stripe. She started this company to solve the problem she faced herself — shipping products 10× faster without sacrificing quality.", styles: { color: "#4B5563", fontSize: "17px", lineHeight: "1.7" } },
            { id: "", order: 3, type: "blockquote", content: "\"Move fast and build things that matter. Speed is a feature.\"", props: { cite: "", accentColor: "#6366F1" }, styles: { fontSize: "16px", fontStyle: "italic" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-team-minimal-list",
    name: "Team — Minimal List",
    category: "team",
    designStyle: "minimal",
    description: "Clean text-first team list with name, role, and short bio.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "48px", maxWidth: "900px", margin: "0 auto" },
      children: [
        { id: "", order: 0, type: "heading", content: "The team", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "0" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "32px", padding: "32px 0", borderBottom: "1px solid #F3F4F6" }, children: [
                { id: "", order: 0, type: "avatar", content: "Alex Rivera", props: { src: "", size: "lg", showName: false }, styles: { flexShrink: "0" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Alex Rivera", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "eyebrow", content: "Head of Engineering", styles: { color: "#6366F1", letterSpacing: "0.08em", fontSize: "12px" } },
                    { id: "", order: 2, type: "paragraph", content: "10 years scaling infrastructure at AWS and Cloudflare. Loves distributed systems and terrible puns.", styles: { color: "#6B7280", fontSize: "15px" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "32px", padding: "32px 0", borderBottom: "1px solid #F3F4F6" }, children: [
                { id: "", order: 0, type: "avatar", content: "Maya Patel", props: { src: "", size: "lg", showName: false }, styles: { flexShrink: "0" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Maya Patel", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "eyebrow", content: "Head of Design", styles: { color: "#6366F1", letterSpacing: "0.08em", fontSize: "12px" } },
                    { id: "", order: 2, type: "paragraph", content: "Ex-Figma and Apple. Obsessed with the intersection of beauty and usability.", styles: { color: "#6B7280", fontSize: "15px" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "32px", padding: "32px 0" }, children: [
                { id: "", order: 0, type: "avatar", content: "James Kim", props: { src: "", size: "lg", showName: false }, styles: { flexShrink: "0" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "James Kim", props: { level: 4 }, styles: { fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "eyebrow", content: "Head of Growth", styles: { color: "#6366F1", letterSpacing: "0.08em", fontSize: "12px" } },
                    { id: "", order: 2, type: "paragraph", content: "Grew Notion from 0 to 1M users. Data nerd who believes great products sell themselves.", styles: { color: "#6B7280", fontSize: "15px" } },
                  ]
                },
              ]
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-team-dark-cards",
    name: "Team — Dark Cards",
    category: "team",
    designStyle: "dark",
    description: "Dark-themed team cards with avatar, name, role, and social links.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Meet the team", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#FFFFFF", margin: "0", textAlign: "center" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", width: "100%" },
          children: [
            { id: "", order: 0, type: "team-member", content: "", props: { name: "Sarah Chen", role: "CEO & Founder", accentColor: "#818CF8" }, styles: {} },
            { id: "", order: 1, type: "team-member", content: "", props: { name: "Alex Rivera", role: "CTO", accentColor: "#818CF8" }, styles: {} },
            { id: "", order: 2, type: "team-member", content: "", props: { name: "Maya Patel", role: "Head of Design", accentColor: "#818CF8" }, styles: {} },
            { id: "", order: 3, type: "team-member", content: "", props: { name: "James Kim", role: "Head of Growth", accentColor: "#818CF8" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-team-hiring",
    name: "Team — Hiring CTA",
    category: "team",
    designStyle: "modern",
    description: "Team section ending with an open roles hiring call to action.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "We're hiring", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Join our growing team", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "We're a remote-first team of builders who move fast and care deeply about craft.", styles: { color: "#6B7280", fontSize: "18px", maxWidth: "520px" } },
          ],
        },
        { id: "", order: 1, type: "team", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#6366F1", borderRadius: "24px", padding: "48px", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "24px", width: "100%", flexWrap: "wrap" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" },
              children: [
                { id: "", order: 0, type: "heading", content: "We have 6 open roles", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Fully remote · Competitive salary · Equity included", styles: { color: "rgba(255,255,255,0.7)", fontSize: "16px" } },
              ],
            },
            { id: "", order: 1, type: "button", content: "View open roles →", props: { variant: "solid", accentColor: "#FFFFFF" }, styles: { color: "#6366F1" } },
          ],
        },
      ],
    },
  },

  // ─── FAQ ─────────────────────────────────────────────────────────────────────

  {
    id: "sb-faq-two-col",
    name: "FAQ — Two Column",
    category: "faq",
    designStyle: "modern",
    description: "Two-column FAQ layout with heading on left and accordion on right.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", gap: "64px", alignItems: "flex-start", flexWrap: "wrap" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "20px", minWidth: "240px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "FAQ", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Common questions", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Can't find your answer? Reach us any time at support@company.com", styles: { color: "#6B7280", fontSize: "15px" } },
            { id: "", order: 3, type: "button", content: "Contact support →", props: { variant: "outline", accentColor: "#6366F1" }, styles: {} },
          ],
        },
        { id: "", order: 1, type: "accordion", content: "", props: { multiple: false, accentColor: "#6366F1" }, styles: { flex: "1.5", minWidth: "280px" } },
      ],
    },
  },

  {
    id: "sb-faq-search",
    name: "FAQ — With Search",
    category: "faq",
    designStyle: "minimal",
    description: "FAQ section with a prominent search bar above the accordion.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "How can we help?", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "Search our knowledge base or browse the categories below.", styles: { color: "#6B7280", fontSize: "18px" } },
          ],
        },
        { id: "", order: 1, type: "search-input", content: "", props: { placeholder: "Search FAQ...", accentColor: "#6366F1" }, styles: { maxWidth: "560px", width: "100%" } },
        { id: "", order: 2, type: "faq", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%", maxWidth: "720px" } },
      ],
    },
  },

  {
    id: "sb-faq-categories",
    name: "FAQ — Categorised Tabs",
    category: "faq",
    designStyle: "modern",
    description: "FAQ grouped by category using a tabbed interface.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Frequently Asked Questions", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
          ],
        },
        { id: "", order: 1, type: "tabs", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%", maxWidth: "800px" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#F5F3FF", borderRadius: "16px", padding: "32px 40px", maxWidth: "640px", width: "100%", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "Still have questions?", styles: { fontWeight: "700", color: "#4F46E5", fontSize: "17px" } },
            { id: "", order: 1, type: "paragraph", content: "Our support team is available 24/7 to help.", styles: { color: "#6B7280", fontSize: "15px" } },
            { id: "", order: 2, type: "button", content: "Chat with support", props: { variant: "solid", accentColor: "#6366F1" }, styles: {} },
          ],
        },
      ],
    },
  },

  // ─── SAAS ─────────────────────────────────────────────────────────────────────

  {
    id: "sb-saas-product-shot",
    name: "SaaS — Product Screenshot",
    category: "saas",
    designStyle: "modern",
    description: "Hero with a prominent product screenshot mockup below the headline.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px 0", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "720px" },
          children: [
            { id: "", order: 0, type: "badge", content: "Now in public beta", props: { variant: "soft", color: "indigo" }, styles: {} },
            { id: "", order: 1, type: "heading", content: "The smarter way to build products", props: { level: 1 }, styles: { fontSize: "60px", fontWeight: "900", color: "#111827", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
            { id: "", order: 2, type: "paragraph", content: "One platform for design, development, and deployment. Stop switching tools — start shipping.", styles: { color: "#6B7280", fontSize: "20px", lineHeight: "1.6" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px", justifyContent: "center", flexWrap: "wrap" },
              children: [
                { id: "", order: 0, type: "button", content: "Start free →", props: { variant: "solid", accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 1, type: "button", content: "Watch demo", props: { variant: "outline", accentColor: "#6366F1" }, styles: {} },
              ],
            },
            { id: "", order: 4, type: "avatar-group", content: "", props: { count: 3, label: "Join 12,000+ teams" }, styles: {} },
          ],
        },
        { id: "", order: 1, type: "container", content: "", styles: { width: "100%", maxWidth: "1100px", backgroundColor: "#F3F4F6", borderRadius: "24px 24px 0 0", height: "480px", border: "1px solid #E5E7EB", borderBottom: "none" } },
      ],
    },
  },

  {
    id: "sb-saas-integration-logos",
    name: "SaaS — Integration Grid",
    category: "saas",
    designStyle: "minimal",
    description: "Shows integrations with popular tools in a grid.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Integrations", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Works with your existing stack", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Connect with 100+ tools in one click. No custom code required.", styles: { color: "#6B7280", fontSize: "18px", maxWidth: "480px" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px", width: "100%", maxWidth: "900px" },
          children: [
            ...["Stripe", "GitHub", "Slack", "Notion", "Figma", "Zapier", "HubSpot", "Intercom", "Mixpanel", "Datadog"].map((name, i) => ({
              id: "", order: i, type: "container" as const, content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", border: "1px solid #E5E7EB", padding: "24px 16px", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "10px" },
              children: [
                { id: "", order: 0, type: "icon" as const, content: "🔗", styles: { fontSize: "28px" } },
                { id: "", order: 1, type: "paragraph" as const, content: name, styles: { fontWeight: "700", color: "#374151", fontSize: "13px" } },
              ],
            })),
          ],
        },
        { id: "", order: 2, type: "button", content: "View all 100+ integrations →", props: { variant: "outline", accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-saas-testimonial-metric",
    name: "SaaS — Testimonial + Metric",
    category: "saas",
    designStyle: "modern",
    description: "Powerful social proof combining a testimonial quote with a key metric.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "24px", border: "1px solid #E5E7EB", padding: "64px", display: "flex", flexDirection: "row", gap: "64px", alignItems: "center", maxWidth: "1000px", width: "100%", boxShadow: "0 4px 32px rgba(0,0,0,0.04)", flexWrap: "wrap" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "2", display: "flex", flexDirection: "column", gap: "24px", minWidth: "240px" },
              children: [
                { id: "", order: 0, type: "rating", content: "", props: { value: 5, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
                { id: "", order: 1, type: "heading", content: "\"We closed our Series A within 3 weeks of launching our new site on BuildStack.\"", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "700", color: "#1E293B", margin: "0", lineHeight: "1.5" } },
                { id: "", order: 2, type: "avatar", content: "Maria Gonzalez, CEO at Orbit", props: { src: "", size: "md", showName: true }, styles: {} },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", borderLeft: "1px solid #E5E7EB", paddingLeft: "64px", minWidth: "200px" },
              children: [
                { id: "", order: 0, type: "number-display", content: "3×", props: { label: "More conversions", accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 1, type: "number-display", content: "6 hrs", props: { label: "To launch", accentColor: "#10B981" }, styles: {} },
                { id: "", order: 2, type: "number-display", content: "$2.1M", props: { label: "Raised after launch", accentColor: "#F59E0B" }, styles: {} },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-saas-dark-hero",
    name: "SaaS — Dark Hero",
    category: "saas",
    designStyle: "dark",
    description: "Deep dark hero with animated gradient background and centered CTA.",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#030712", backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.2) 0%, transparent 60%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "badge", content: "✦ New — AI-powered editor", props: { variant: "soft", color: "indigo" }, styles: {} },
        { id: "", order: 1, type: "heading", content: "Build your SaaS. Ship today.", props: { level: 1 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em", lineHeight: "1", maxWidth: "800px" } },
        { id: "", order: 2, type: "paragraph", content: "The all-in-one platform to design, build, and deploy your SaaS product — without writing a single line of code.", styles: { color: "#64748B", fontSize: "20px", maxWidth: "540px", lineHeight: "1.6" } },
        {
          id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px", flexWrap: "wrap", justifyContent: "center" },
          children: [
            { id: "", order: 0, type: "button", content: "Start building free", props: { variant: "solid", accentColor: "#6366F1" }, styles: {} },
            { id: "", order: 1, type: "button", content: "See live demo →", props: { variant: "ghost", accentColor: "#FFFFFF" }, styles: {} },
          ],
        },
        { id: "", order: 4, type: "paragraph", content: "No credit card required · 14-day free trial", styles: { color: "#475569", fontSize: "13px" } },
      ],
    },
  },

  {
    id: "sb-saas-security",
    name: "SaaS — Security & Compliance",
    category: "saas",
    designStyle: "corporate",
    description: "Trust section highlighting certifications and security features.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "12px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Security & Compliance", styles: { color: "#6366F1", letterSpacing: "0.12em" } },
            { id: "", order: 1, type: "heading", content: "Enterprise-grade security, out of the box", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Your data is protected by the same standards trusted by Fortune 500 companies.", styles: { color: "#6B7280", fontSize: "18px", maxWidth: "560px" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px", width: "100%" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "28px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }, children: [
                { id: "", order: 0, type: "icon", content: "🔒", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "SOC 2 Type II", props: { level: 5 }, styles: { fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Annually audited", styles: { color: "#6B7280", fontSize: "13px" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "28px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }, children: [
                { id: "", order: 0, type: "icon", content: "🇪🇺", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "GDPR Compliant", props: { level: 5 }, styles: { fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Data stays in your region", styles: { color: "#6B7280", fontSize: "13px" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "28px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }, children: [
                { id: "", order: 0, type: "icon", content: "🏥", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "HIPAA Ready", props: { level: 5 }, styles: { fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "BAA available on request", styles: { color: "#6B7280", fontSize: "13px" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "28px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px", alignItems: "center", textAlign: "center" }, children: [
                { id: "", order: 0, type: "icon", content: "🛡️", styles: { fontSize: "32px" } },
                { id: "", order: 1, type: "heading", content: "256-bit AES", props: { level: 5 }, styles: { fontSize: "15px", fontWeight: "700", color: "#111827", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Encrypted at rest + transit", styles: { color: "#6B7280", fontSize: "13px" } },
              ]
            },
          ],
        },
      ],
    },
  },

  // ─── BLOG ─────────────────────────────────────────────────────────────────────

  {
    id: "sb-blog-featured",
    name: "Blog — Featured Post",
    category: "blog",
    designStyle: "modern",
    description: "Large featured article card with cover image and metadata.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
          children: [
            { id: "", order: 0, type: "heading", content: "From the blog", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "button", content: "All articles →", props: { variant: "ghost", accentColor: "#6366F1" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "32px", alignItems: "stretch", flexWrap: "wrap" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "2", backgroundColor: "#F3F4F6", borderRadius: "20px", overflow: "hidden", display: "flex", flexDirection: "column", minWidth: "300px" },
              children: [
                { id: "", order: 0, type: "container", content: "", styles: { height: "300px", backgroundColor: "#E0E7FF" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { padding: "32px", display: "flex", flexDirection: "column", gap: "12px" },
                  children: [
                    { id: "", order: 0, type: "badge", content: "Tutorial", props: { variant: "soft", color: "indigo" }, styles: {} },
                    { id: "", order: 1, type: "heading", content: "How to build a SaaS landing page that converts", props: { level: 3 }, styles: { fontSize: "26px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 2, type: "paragraph", content: "Learn the exact framework we used to 3× our trial sign-up rate in 30 days.", styles: { color: "#6B7280", fontSize: "15px" } },
                    {
                      id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", gap: "12px" },
                      children: [
                        { id: "", order: 0, type: "avatar", content: "Sarah Chen", props: { src: "", size: "sm", showName: false }, styles: {} },
                        { id: "", order: 1, type: "paragraph", content: "Sarah Chen · 8 min read · Mar 12, 2026", styles: { color: "#9CA3AF", fontSize: "13px" } },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "20px", minWidth: "240px" },
              children: [
                { id: "", order: 0, type: "blog-card", content: "", props: { title: "10 UI patterns that boost conversion", category: "Design", readTime: "5 min", accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 1, type: "blog-card", content: "", props: { title: "Why your product needs a waitlist", category: "Growth", readTime: "4 min", accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 2, type: "blog-card", content: "", props: { title: "The anatomy of a great hero section", category: "Design", readTime: "6 min", accentColor: "#6366F1" }, styles: {} },
              ],
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-blog-newsletter-cta",
    name: "Blog — Newsletter CTA",
    category: "blog",
    designStyle: "bold",
    description: "End-of-blog newsletter sign-up prompt with bold background.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundImage: "linear-gradient(135deg, #6366F1, #8B5CF6)", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "heading", content: "Never miss an article", props: { level: 3 }, styles: { fontSize: "36px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
        { id: "", order: 1, type: "paragraph", content: "Join 14,000+ founders and builders. One email per week — no fluff.", styles: { color: "rgba(255,255,255,0.8)", fontSize: "17px", maxWidth: "420px" } },
        {
          id: "", order: 2, type: "form", content: "", props: { bgType: "transparent", successMessage: "You're in! Check your inbox." },
          styles: { display: "flex", flexDirection: "row", gap: "12px", maxWidth: "440px", width: "100%", padding: "0" },
          children: [
            { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "your@email.com", required: true }, styles: { flex: "1" } },
            { id: "", order: 1, type: "button", content: "Subscribe", props: { submitForm: true, accentColor: "#FFFFFF", variant: "solid" }, styles: { color: "#6366F1" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-blog-minimal-list",
    name: "Blog — Minimal Post List",
    category: "blog",
    designStyle: "minimal",
    description: "Compact text-first blog post list with date and category.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "40px", maxWidth: "800px", margin: "0 auto" },
      children: [
        { id: "", order: 0, type: "heading", content: "All posts", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "0" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #F3F4F6", gap: "16px", flexWrap: "wrap" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "How to write copy that converts", props: { level: 4 }, styles: { fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Marketing · Apr 3, 2026 · 5 min read", styles: { color: "#9CA3AF", fontSize: "13px" } },
                  ]
                },
                { id: "", order: 1, type: "button", content: "Read →", props: { variant: "ghost", accentColor: "#6366F1" }, styles: {} },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "20px 0", borderBottom: "1px solid #F3F4F6", gap: "16px", flexWrap: "wrap" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "The anatomy of a great pricing page", props: { level: 4 }, styles: { fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Growth · Mar 28, 2026 · 7 min read", styles: { color: "#9CA3AF", fontSize: "13px" } },
                  ]
                },
                { id: "", order: 1, type: "button", content: "Read →", props: { variant: "ghost", accentColor: "#6366F1" }, styles: {} },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: "20px 0", gap: "16px", flexWrap: "wrap" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "10 tools every indie hacker needs", props: { level: 4 }, styles: { fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Tools · Mar 15, 2026 · 9 min read", styles: { color: "#9CA3AF", fontSize: "13px" } },
                  ]
                },
                { id: "", order: 1, type: "button", content: "Read →", props: { variant: "ghost", accentColor: "#6366F1" }, styles: {} },
              ]
            },
          ],
        },
        { id: "", order: 2, type: "pagination", content: "", props: { totalPages: 8, currentPage: 1, accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-blog-author",
    name: "Blog — Author Profile",
    category: "blog",
    designStyle: "minimal",
    description: "Author bio section shown at the bottom of a blog article.",
    element: {
      type: "container", content: "",
      styles: { padding: "48px 40px", backgroundColor: "#F9FAFB", borderRadius: "20px", display: "flex", flexDirection: "row", alignItems: "flex-start", gap: "32px", maxWidth: "800px", margin: "0 auto", flexWrap: "wrap" },
      children: [
        { id: "", order: 0, type: "avatar", content: "Sarah Chen", props: { src: "", size: "xl", showName: false }, styles: { flexShrink: "0" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "8px", minWidth: "200px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Written by", styles: { color: "#9CA3AF", letterSpacing: "0.08em", fontSize: "11px" } },
            { id: "", order: 1, type: "heading", content: "Sarah Chen", props: { level: 4 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "CEO at BuildStack. Previously at Stripe. Writing about product, growth, and building in public.", styles: { color: "#6B7280", fontSize: "15px", lineHeight: "1.6" } },
            { id: "", order: 3, type: "button", content: "Follow on X →", props: { variant: "outline", accentColor: "#6366F1" }, styles: { width: "fit-content" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-blog-related",
    name: "Blog — Related Articles",
    category: "blog",
    designStyle: "minimal",
    description: "Three related article cards shown at the bottom of a post.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "32px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Continue reading", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" },
          children: [
            { id: "", order: 0, type: "blog-card", content: "", props: { title: "From 0 to $10k MRR in 90 days", category: "Growth", readTime: "6 min", accentColor: "#6366F1" }, styles: {} },
            { id: "", order: 1, type: "blog-card", content: "", props: { title: "Designing for trust: what converts", category: "Design", readTime: "5 min", accentColor: "#6366F1" }, styles: {} },
            { id: "", order: 2, type: "blog-card", content: "", props: { title: "The no-code stack for 2026", category: "Tools", readTime: "7 min", accentColor: "#6366F1" }, styles: {} },
          ],
        },
      ],
    },
  },

  // ─── ECOMMERCE ───────────────────────────────────────────────────────────────

  {
    id: "sb-ecommerce-hero",
    name: "E-Commerce — Hero Banner",
    category: "ecommerce",
    designStyle: "bold",
    description: "Full-bleed store hero with headline, offer badge, and shop CTA.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundImage: "linear-gradient(135deg, #1E1B4B, #312E81)", display: "flex", flexDirection: "row", alignItems: "center", gap: "64px", flexWrap: "wrap" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "20px", minWidth: "260px" },
          children: [
            { id: "", order: 0, type: "badge", content: "New Season — Up to 40% off", props: { variant: "solid", color: "yellow" }, styles: {} },
            { id: "", order: 1, type: "heading", content: "Dress for the life you want.", props: { level: 1 }, styles: { fontSize: "60px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
            { id: "", order: 2, type: "paragraph", content: "Premium essentials designed for the modern wardrobe. Free shipping on all orders over $75.", styles: { color: "rgba(255,255,255,0.7)", fontSize: "18px" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px" },
              children: [
                { id: "", order: 0, type: "button", content: "Shop now →", props: { variant: "solid", accentColor: "#FFFFFF" }, styles: { color: "#312E81" } },
                { id: "", order: 1, type: "button", content: "View lookbook", props: { variant: "outline", accentColor: "#FFFFFF" }, styles: {} },
              ],
            },
          ],
        },
        { id: "", order: 1, type: "container", content: "", styles: { flex: "1", height: "480px", backgroundColor: "rgba(255,255,255,0.08)", borderRadius: "24px", minWidth: "260px" } },
      ],
    },
  },

  {
    id: "sb-ecommerce-product-detail",
    name: "E-Commerce — Product Detail",
    category: "ecommerce",
    designStyle: "minimal",
    description: "Full product detail layout with gallery, price, variants, and add-to-cart.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "row", gap: "64px", alignItems: "flex-start", flexWrap: "wrap", maxWidth: "1200px", margin: "0 auto" },
      children: [
        { id: "", order: 0, type: "product-gallery", content: "", props: { images: [], thumbnailPosition: "bottom", accentColor: "#6366F1" }, styles: { flex: "1", minWidth: "300px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "20px", minWidth: "280px" },
          children: [
            { id: "", order: 0, type: "eyebrow", content: "Premium Collection", styles: { color: "#6366F1", letterSpacing: "0.1em", fontSize: "12px" } },
            { id: "", order: 1, type: "heading", content: "Classic Oxford Shirt", props: { level: 1 }, styles: { fontSize: "32px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 2, type: "rating", content: "", props: { value: 4, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
            { id: "", order: 3, type: "price-display", content: "", props: { price: "$89.00", originalPrice: "$120.00", accentColor: "#111827" }, styles: {} },
            { id: "", order: 4, type: "divider", content: "", styles: { border: "1px solid #F3F4F6", margin: "4px 0" } },
            { id: "", order: 5, type: "radio-group", content: "Size", props: { options: ["XS", "S", "M", "L", "XL"], accentColor: "#111827" }, styles: {} },
            {
              id: "", order: 6, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px" },
              children: [
                { id: "", order: 0, type: "quantity-selector", content: "", props: { min: 1, max: 99, defaultValue: 1, accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 1, type: "add-to-cart", content: "", props: { buttonText: "Add to Cart", accentColor: "#111827" }, styles: { flex: "1" } },
              ],
            },
            { id: "", order: 7, type: "wishlist-btn", content: "", props: { accentColor: "#EF4444", productId: "" }, styles: {} },
            { id: "", order: 8, type: "stock-indicator", content: "", props: { stock: 8, lowStockThreshold: 10, accentColor: "#10B981" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-ecommerce-cart-checkout",
    name: "E-Commerce — Cart Summary",
    category: "ecommerce",
    designStyle: "minimal",
    description: "Shopping cart sidebar with item list, coupon, and order summary.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "row", gap: "40px", alignItems: "flex-start", flexWrap: "wrap" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "2", backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "32px", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: "24px", minWidth: "300px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Your cart (3 items)", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "cart", content: "", props: { cartStyle: "inline", currency: "USD", checkoutUrl: "/checkout" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "32px", border: "1px solid #E5E7EB", display: "flex", flexDirection: "column", gap: "20px", minWidth: "260px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Order Summary", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "coupon-code", content: "", props: { placeholder: "Promo code", accentColor: "#6366F1" }, styles: {} },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px", padding: "16px 0", borderTop: "1px solid #F3F4F6", borderBottom: "1px solid #F3F4F6" },
              children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", justifyContent: "space-between" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Subtotal", styles: { color: "#6B7280", fontSize: "15px" } },
                    { id: "", order: 1, type: "paragraph", content: "$247.00", styles: { fontWeight: "700", color: "#111827", fontSize: "15px" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", justifyContent: "space-between" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Shipping", styles: { color: "#6B7280", fontSize: "15px" } },
                    { id: "", order: 1, type: "paragraph", content: "Free", styles: { fontWeight: "700", color: "#10B981", fontSize: "15px" } },
                  ]
                },
              ],
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", justifyContent: "space-between" }, children: [
                { id: "", order: 0, type: "paragraph", content: "Total", styles: { fontWeight: "800", color: "#111827", fontSize: "18px" } },
                { id: "", order: 1, type: "paragraph", content: "$247.00", styles: { fontWeight: "800", color: "#111827", fontSize: "18px" } },
              ]
            },
            { id: "", order: 4, type: "button", content: "Proceed to Checkout →", props: { variant: "solid", accentColor: "#111827", fullWidth: true }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-ecommerce-reviews",
    name: "E-Commerce — Reviews Section",
    category: "ecommerce",
    designStyle: "minimal",
    description: "Product reviews section with rating summary and review cards.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "40px", maxWidth: "900px", margin: "0 auto" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "8px" },
              children: [
                { id: "", order: 0, type: "heading", content: "Customer Reviews", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0" } },
                { id: "", order: 1, type: "rating", content: "", props: { value: 4, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
                { id: "", order: 2, type: "paragraph", content: "4.7 out of 5 · 384 reviews", styles: { color: "#6B7280", fontSize: "14px" } },
              ],
            },
            { id: "", order: 1, type: "button", content: "Write a review", props: { variant: "outline", accentColor: "#111827" }, styles: {} },
          ],
        },
        { id: "", order: 1, type: "product-reviews", content: "", props: { accentColor: "#F59E0B", showWriteReview: false }, styles: { width: "100%" } },
      ],
    },
  },

  {
    id: "sb-ecommerce-featured-products",
    name: "E-Commerce — Featured Products",
    category: "ecommerce",
    designStyle: "modern",
    description: "Featured product grid with title, badge, and add-to-cart.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", gap: "40px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Featured Products", props: { level: 2 }, styles: { fontSize: "36px", fontWeight: "800", color: "#111827", margin: "0" } },
            { id: "", order: 1, type: "button", content: "View all →", props: { variant: "ghost", accentColor: "#6366F1" }, styles: {} },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
          children: [
            { id: "", order: 0, type: "product-card", content: "", props: { name: "Classic Tee", price: 29.99, rating: 4.5, reviewCount: 212, accentColor: "#111827" }, styles: {} },
            { id: "", order: 1, type: "product-card", content: "", props: { name: "Oxford Shirt", price: 89.99, rating: 4.8, reviewCount: 97, accentColor: "#111827" }, styles: {} },
            { id: "", order: 2, type: "product-card", content: "", props: { name: "Chino Pants", price: 74.99, rating: 4.6, reviewCount: 145, accentColor: "#111827" }, styles: {} },
            { id: "", order: 3, type: "product-card", content: "", props: { name: "Canvas Tote", price: 34.99, rating: 4.9, reviewCount: 331, accentColor: "#111827" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-ecommerce-upsell",
    name: "E-Commerce — Upsell / Cross-sell",
    category: "ecommerce",
    designStyle: "minimal",
    description: "You might also like section shown after add-to-cart.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "32px" },
      children: [
        { id: "", order: 0, type: "heading", content: "Complete the look", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#111827", margin: "0" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
          children: [
            { id: "", order: 0, type: "product-card", content: "", props: { name: "Linen Blazer", price: 149.99, rating: 4.7, reviewCount: 63, accentColor: "#111827" }, styles: {} },
            { id: "", order: 1, type: "product-card", content: "", props: { name: "Leather Belt", price: 44.99, rating: 4.9, reviewCount: 218, accentColor: "#111827" }, styles: {} },
            { id: "", order: 2, type: "product-card", content: "", props: { name: "Chelsea Boots", price: 189.99, rating: 4.6, reviewCount: 82, accentColor: "#111827" }, styles: {} },
          ],
        },
      ],
    },
  },

  // ─── FOOTER ──────────────────────────────────────────────────────────────────

  {
    id: "sb-footer-newsletter",
    name: "Footer — With Newsletter",
    category: "footer",
    designStyle: "dark",
    description: "Dark footer with an inline newsletter box above the nav links.",
    element: {
      type: "container", content: "",
      styles: { padding: "64px 40px 32px", backgroundColor: "#0A0F1E", display: "flex", flexDirection: "column", gap: "48px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: "32px", flexWrap: "wrap", padding: "40px", backgroundColor: "rgba(99,102,241,0.1)", borderRadius: "20px", border: "1px solid rgba(99,102,241,0.2)" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "6px" },
              children: [
                { id: "", order: 0, type: "heading", content: "Stay in the loop", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "700", color: "#FFFFFF", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "No spam. Weekly product updates.", styles: { color: "#64748B", fontSize: "14px" } },
              ],
            },
            {
              id: "", order: 1, type: "form", content: "", props: { bgType: "transparent", successMessage: "You're in!" },
              styles: { display: "flex", flexDirection: "row", gap: "10px", padding: "0" },
              children: [
                { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "you@email.com" }, styles: { minWidth: "220px" } },
                { id: "", order: 1, type: "button", content: "Subscribe", props: { submitForm: true, accentColor: "#6366F1" }, styles: {} },
              ],
            },
          ],
        },
        { id: "", order: 1, type: "footer", content: "", props: { brandName: "BuildStack", copyright: "© 2026 BuildStack Inc." }, styles: {} },
      ],
    },
  },

  {
    id: "sb-footer-mega",
    name: "Footer — Mega Footer",
    category: "footer",
    designStyle: "minimal",
    description: "Large white footer with five-column link grid.",
    element: {
      type: "footer", content: "",
      styles: { padding: "64px 40px 32px", backgroundColor: "#F9FAFB", borderTop: "1px solid #E5E7EB" },
      props: {
        brandName: "BuildStack",
        copyright: "© 2026 BuildStack Inc. All rights reserved.",
        columns: [
          { heading: "Product", links: ["Features", "Pricing", "Changelog", "Roadmap"] },
          { heading: "Resources", links: ["Documentation", "Blog", "Tutorials", "Status"] },
          { heading: "Company", links: ["About", "Careers", "Press", "Contact"] },
          { heading: "Legal", links: ["Privacy", "Terms", "Cookie Policy", "GDPR"] },
        ],
      },
    },
  },

  {
    id: "sb-footer-startup",
    name: "Footer — Startup Minimal",
    category: "footer",
    designStyle: "minimal",
    description: "Ultra-minimal one-line footer for landing pages.",
    element: {
      type: "container", content: "",
      styles: { padding: "24px 40px", backgroundColor: "#FFFFFF", borderTop: "1px solid #F3F4F6", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "© 2026 BuildStack. All rights reserved.", styles: { color: "#9CA3AF", fontSize: "13px" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "24px" },
          children: [
            { id: "", order: 0, type: "text-link", content: "Privacy", styles: { color: "#9CA3AF", fontSize: "13px" }, props: { href: "#" } },
            { id: "", order: 1, type: "text-link", content: "Terms", styles: { color: "#9CA3AF", fontSize: "13px" }, props: { href: "#" } },
            { id: "", order: 2, type: "text-link", content: "Status", styles: { color: "#9CA3AF", fontSize: "13px" }, props: { href: "#" } },
          ],
        },
      ],
    },
  },

  // ─── SIDEBAR ─────────────────────────────────────────────────────────────────

  {
    id: "sb-sidebar-app-nav",
    name: "Sidebar — App Navigation",
    category: "sidebar",
    designStyle: "minimal",
    description: "Left sidebar with icon + label navigation for app layouts.",
    element: {
      type: "sidebar", content: "",
      styles: { width: "260px", height: "100vh", backgroundColor: "#FFFFFF", borderRight: "1px solid #F3F4F6", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px", position: "sticky", top: "0" },
      props: {
        brandName: "BuildStack",
        accentColor: "#6366F1",
        navItems: ["Dashboard", "Projects", "Analytics", "Team", "Settings"],
      },
    },
  },

  {
    id: "sb-sidebar-dark-app",
    name: "Sidebar — Dark App Nav",
    category: "sidebar",
    designStyle: "dark",
    description: "Dark sidebar navigation suitable for dashboards and SaaS apps.",
    element: {
      type: "sidebar", content: "",
      styles: { width: "260px", height: "100vh", backgroundColor: "#0F172A", padding: "24px 16px", display: "flex", flexDirection: "column", gap: "8px", position: "sticky", top: "0" },
      props: {
        brandName: "BuildStack",
        accentColor: "#818CF8",
        navItems: ["Dashboard", "Projects", "Analytics", "Team", "Settings"],
      },
    },
  },

  // ─── UTILITY ─────────────────────────────────────────────────────────────────

  {
    id: "sb-utility-404",
    name: "Utility — 404 Not Found",
    category: "utility",
    designStyle: "minimal",
    description: "Clean 404 error page with navigation back to home.",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center", minHeight: "100vh", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "paragraph", content: "404", styles: { fontSize: "120px", fontWeight: "900", color: "#F3F4F6", lineHeight: "1", margin: "0" } },
        { id: "", order: 1, type: "heading", content: "Page not found", props: { level: 1 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0" } },
        { id: "", order: 2, type: "paragraph", content: "Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.", styles: { color: "#6B7280", fontSize: "17px", maxWidth: "420px" } },
        {
          id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px" },
          children: [
            { id: "", order: 0, type: "button", content: "← Back to home", props: { variant: "solid", accentColor: "#111827" }, styles: {} },
            { id: "", order: 1, type: "button", content: "Contact support", props: { variant: "outline", accentColor: "#6366F1" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-utility-maintenance",
    name: "Utility — Maintenance Mode",
    category: "utility",
    designStyle: "dark",
    description: "Maintenance page with countdown timer and contact option.",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center", minHeight: "100vh", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "icon", content: "🔧", styles: { fontSize: "64px" } },
        { id: "", order: 1, type: "heading", content: "Under Maintenance", props: { level: 1 }, styles: { fontSize: "48px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
        { id: "", order: 2, type: "paragraph", content: "We're making some improvements to serve you better. We'll be back online in:", styles: { color: "#64748B", fontSize: "17px", maxWidth: "440px" } },
        { id: "", order: 3, type: "countdown", content: "", props: { targetDate: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), accentColor: "#818CF8" }, styles: { textAlign: "center" } },
        { id: "", order: 4, type: "paragraph", content: "Have questions? Email us at support@company.com", styles: { color: "#475569", fontSize: "14px" } },
      ],
    },
  },

  {
    id: "sb-utility-coming-soon",
    name: "Utility — Coming Soon",
    category: "utility",
    designStyle: "modern",
    description: "Product launch coming soon page with email capture.",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#F5F3FF", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center", minHeight: "100vh", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "badge", content: "In stealth mode", props: { variant: "soft", color: "indigo" }, styles: {} },
        { id: "", order: 1, type: "heading", content: "Something amazing\nis coming.", props: { level: 1 }, styles: { fontSize: "64px", fontWeight: "900", color: "#1E1B4B", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05" } },
        { id: "", order: 2, type: "paragraph", content: "We're building the future of how teams work. Be the first to know when we launch.", styles: { color: "#6B7280", fontSize: "18px", maxWidth: "460px" } },
        {
          id: "", order: 3, type: "form", content: "", props: { bgType: "transparent", successMessage: "You're on the list! We'll notify you." },
          styles: { display: "flex", flexDirection: "row", gap: "12px", maxWidth: "440px", width: "100%", padding: "0" },
          children: [
            { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "your@email.com", required: true }, styles: { flex: "1" } },
            { id: "", order: 1, type: "button", content: "Notify me →", props: { submitForm: true, accentColor: "#6366F1" }, styles: {} },
          ],
        },
        { id: "", order: 4, type: "countdown", content: "", props: { targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-utility-empty-state",
    name: "Utility — Empty State",
    category: "utility",
    designStyle: "minimal",
    description: "Friendly empty state component for dashboards or lists.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", textAlign: "center", borderRadius: "16px", border: "2px dashed #E5E7EB" },
      children: [
        { id: "", order: 0, type: "icon", content: "📭", styles: { fontSize: "56px" } },
        { id: "", order: 1, type: "heading", content: "Nothing here yet", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "700", color: "#111827", margin: "0" } },
        { id: "", order: 2, type: "paragraph", content: "Once you create your first item it will appear here. Get started by clicking the button below.", styles: { color: "#6B7280", fontSize: "15px", maxWidth: "360px" } },
        { id: "", order: 3, type: "button", content: "+ Create your first one", props: { variant: "solid", accentColor: "#6366F1" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-utility-success",
    name: "Utility — Success / Confirmation",
    category: "utility",
    designStyle: "minimal",
    description: "Order/form submission success page with next-step actions.",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "24px", textAlign: "center", minHeight: "100vh", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "icon", content: "✅", styles: { fontSize: "72px" } },
        { id: "", order: 1, type: "heading", content: "You're all set!", props: { level: 1 }, styles: { fontSize: "44px", fontWeight: "900", color: "#111827", margin: "0" } },
        { id: "", order: 2, type: "paragraph", content: "Your order has been placed and a confirmation email is on its way to your inbox.", styles: { color: "#6B7280", fontSize: "17px", maxWidth: "420px" } },
        {
          id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px" },
          children: [
            { id: "", order: 0, type: "button", content: "View order details", props: { variant: "solid", accentColor: "#111827" }, styles: {} },
            { id: "", order: 1, type: "button", content: "Continue shopping", props: { variant: "outline", accentColor: "#6366F1" }, styles: {} },
          ],
        },
      ],
    },
  },

  // ─── LANDING PAGES ───────────────────────────────────────────────────────────

  {
    id: "sb-landing-saas-full",
    name: "Landing — SaaS Full Page",
    category: "landing",
    designStyle: "modern",
    description: "Complete SaaS landing section: hero + stats + feature grid.",
    element: {
      type: "container", content: "",
      styles: { display: "flex", flexDirection: "column", width: "100%" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { padding: "100px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "28px", textAlign: "center" },
          children: [
            { id: "", order: 0, type: "badge", content: "🚀 Now live — BuildStack 2.0", props: { variant: "soft", color: "indigo" }, styles: {} },
            { id: "", order: 1, type: "heading", content: "Ship products that people love.", props: { level: 1 }, styles: { fontSize: "64px", fontWeight: "900", color: "#111827", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", maxWidth: "760px" } },
            { id: "", order: 2, type: "paragraph", content: "BuildStack combines design, development, and deployment into one seamless workflow. No more context switching.", styles: { color: "#6B7280", fontSize: "20px", maxWidth: "560px", lineHeight: "1.6" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px", justifyContent: "center", flexWrap: "wrap" },
              children: [
                { id: "", order: 0, type: "button", content: "Start for free →", props: { variant: "solid", accentColor: "#6366F1" }, styles: {} },
                { id: "", order: 1, type: "button", content: "Live demo", props: { variant: "outline", accentColor: "#6366F1" }, styles: {} },
              ],
            },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { padding: "48px 40px", backgroundColor: "#F9FAFB", display: "flex", flexDirection: "row", justifyContent: "center", gap: "64px", flexWrap: "wrap" },
          children: [
            { id: "", order: 0, type: "number-display", content: "12k+", props: { label: "Active teams", accentColor: "#6366F1" }, styles: { textAlign: "center" } },
            { id: "", order: 1, type: "number-display", content: "99.9%", props: { label: "Uptime", accentColor: "#10B981" }, styles: { textAlign: "center" } },
            { id: "", order: 2, type: "number-display", content: "4.9★", props: { label: "Rating", accentColor: "#F59E0B" }, styles: { textAlign: "center" } },
            { id: "", order: 3, type: "number-display", content: "6 min", props: { label: "Avg. deploy time", accentColor: "#8B5CF6" }, styles: { textAlign: "center" } },
          ],
        },
        {
          id: "", order: 2, type: "container", content: "", styles: { padding: "80px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "48px" },
          children: [
            { id: "", order: 0, type: "heading", content: "Everything you need to ship", props: { level: 2 }, styles: { fontSize: "40px", fontWeight: "800", color: "#111827", margin: "0", textAlign: "center" } },
            { id: "", order: 1, type: "feature-grid", content: "", props: { accentColor: "#6366F1" }, styles: { width: "100%" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-landing-waitlist",
    name: "Landing — Waitlist",
    category: "landing",
    designStyle: "dark",
    description: "Viral waitlist page with email capture and social share nudge.",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#030712", backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.25) 0%, transparent 60%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "40px", textAlign: "center", minHeight: "100vh", justifyContent: "center" },
      children: [
        { id: "", order: 0, type: "badge", content: "Private Beta", props: { variant: "soft", color: "indigo" }, styles: {} },
        { id: "", order: 1, type: "heading", content: "The future of building,\nearly access.", props: { level: 1 }, styles: { fontSize: "64px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", maxWidth: "720px" } },
        { id: "", order: 2, type: "paragraph", content: "Be among the first 1,000 teams to experience the next generation of our platform. Reserve your spot today.", styles: { color: "#94A3B8", fontSize: "19px", maxWidth: "520px", lineHeight: "1.6" } },
        {
          id: "", order: 3, type: "form", content: "", props: { bgType: "transparent", successMessage: "You're on the list! Share to move up." },
          styles: { display: "flex", flexDirection: "column", gap: "12px", maxWidth: "440px", width: "100%", padding: "0" },
          children: [
            { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "your@email.com", required: true }, styles: {} },
            { id: "", order: 1, type: "button", content: "Join waitlist →", props: { submitForm: true, accentColor: "#6366F1", fullWidth: true }, styles: {} },
          ],
        },
        { id: "", order: 4, type: "avatar-group", content: "", props: { count: 4, label: "847 people joined today" }, styles: {} },
      ],
    },
  },

  {
    id: "sb-landing-product-hunt",
    name: "Landing — Product Hunt Launch",
    category: "landing",
    designStyle: "bold",
    description: "Product Hunt-style launch announcement page.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#FFF7ED", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center" },
      children: [
        { id: "", order: 0, type: "badge", content: "🎉 We just launched on Product Hunt!", props: { variant: "solid", color: "orange" }, styles: {} },
        { id: "", order: 1, type: "heading", content: "BuildStack is now live!", props: { level: 1 }, styles: { fontSize: "56px", fontWeight: "900", color: "#1C1917", margin: "0", letterSpacing: "-0.03em" } },
        { id: "", order: 2, type: "paragraph", content: "After 18 months of building in stealth, we're thrilled to introduce the platform that will change how teams ship products.", styles: { color: "#78716C", fontSize: "19px", maxWidth: "560px" } },
        {
          id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px", flexWrap: "wrap", justifyContent: "center" },
          children: [
            { id: "", order: 0, type: "button", content: "▲ Upvote on Product Hunt", props: { variant: "solid", accentColor: "#DA552F" }, styles: {} },
            { id: "", order: 1, type: "button", content: "Try for free →", props: { variant: "outline", accentColor: "#DA552F" }, styles: {} },
          ],
        },
        {
          id: "", order: 4, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "32px", flexWrap: "wrap", justifyContent: "center" },
          children: [
            { id: "", order: 0, type: "number-display", content: "#1", props: { label: "Product of the Day", accentColor: "#DA552F" }, styles: {} },
            { id: "", order: 1, type: "number-display", content: "2.4k", props: { label: "Upvotes", accentColor: "#F59E0B" }, styles: {} },
            { id: "", order: 2, type: "number-display", content: "847", props: { label: "Sign-ups today", accentColor: "#10B981" }, styles: {} },
          ],
        },
      ],
    },
  },

  {
    id: "sb-landing-agency",
    name: "Landing — Creative Agency",
    category: "landing",
    designStyle: "creative",
    description: "Bold, typographic agency hero with high-contrast layout.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#111827", display: "flex", flexDirection: "column", gap: "40px", overflow: "hidden", position: "relative" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: "32px", flexWrap: "wrap" },
          children: [
            { id: "", order: 0, type: "heading", content: "We make bold\ndigital things.", props: { level: 1 }, styles: { fontSize: "80px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em", lineHeight: "0.95", maxWidth: "660px" } },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px", maxWidth: "280px" },
              children: [
                { id: "", order: 0, type: "paragraph", content: "Award-winning creative studio building digital experiences for brands that dare to be different.", styles: { color: "#6B7280", fontSize: "15px", lineHeight: "1.6" } },
                { id: "", order: 1, type: "button", content: "See our work →", props: { variant: "solid", accentColor: "#FFFFFF" }, styles: { color: "#111827" } },
              ],
            },
          ],
        },
        { id: "", order: 1, type: "container", content: "", styles: { height: "2px", backgroundColor: "#1F2937", width: "100%" } },
        {
          id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "48px", flexWrap: "wrap" },
          children: [
            { id: "", order: 0, type: "number-display", content: "12+", props: { label: "Years", accentColor: "#FFFFFF" }, styles: { color: "#FFFFFF" } },
            { id: "", order: 1, type: "number-display", content: "300+", props: { label: "Projects", accentColor: "#FFFFFF" }, styles: { color: "#FFFFFF" } },
            { id: "", order: 2, type: "number-display", content: "40+", props: { label: "Awards", accentColor: "#FFFFFF" }, styles: { color: "#FFFFFF" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-landing-mobile-app",
    name: "Landing — Mobile App",
    category: "landing",
    designStyle: "modern",
    description: "Mobile app landing page with app store badges and phone mockup.",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundImage: "linear-gradient(160deg, #EEF2FF 0%, #FAFAFA 100%)", display: "flex", flexDirection: "row", alignItems: "center", gap: "64px", flexWrap: "wrap" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", minWidth: "280px" },
          children: [
            { id: "", order: 0, type: "badge", content: "Available on iOS & Android", props: { variant: "soft", color: "indigo" }, styles: {} },
            { id: "", order: 1, type: "heading", content: "Your personal finance\nassistant, in your pocket.", props: { level: 1 }, styles: { fontSize: "52px", fontWeight: "900", color: "#111827", margin: "0", letterSpacing: "-0.03em", lineHeight: "1.05" } },
            { id: "", order: 2, type: "paragraph", content: "Track spending, set budgets, and hit your savings goals — all from a beautifully simple app.", styles: { color: "#6B7280", fontSize: "18px", lineHeight: "1.6" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px", flexWrap: "wrap" },
              children: [
                { id: "", order: 0, type: "button", content: "🍎 App Store", props: { variant: "solid", accentColor: "#111827" }, styles: {} },
                { id: "", order: 1, type: "button", content: "▶ Google Play", props: { variant: "outline", accentColor: "#111827" }, styles: {} },
              ],
            },
            { id: "", order: 4, type: "rating", content: "", props: { value: 5, max: 5, accentColor: "#F59E0B", readonly: true }, styles: {} },
            { id: "", order: 5, type: "paragraph", content: "4.9 stars · 8,200+ reviews", styles: { color: "#9CA3AF", fontSize: "13px" } },
          ],
        },
        { id: "", order: 1, type: "container", content: "", styles: { flex: "1", minHeight: "500px", backgroundColor: "#E0E7FF", borderRadius: "40px", minWidth: "260px" } },
      ],
    },
  },

  // ─── NEW ENTERPRISE BLOCKS ──────────────────────────────────────────

  {
    id: "sb-hero-meridian-enterprise",
    name: "Hero — Meridian Corporate",
    category: "hero",
    designStyle: "corporate",
    description: "Deep blue professional hero with grid pattern overlay, massive headline, and dual CTAs.",
    element: {
      type: "container", content: "",
      styles: {
        padding: "160px 48px",
        backgroundColor: "#0F172A",
        backgroundImage: "linear-gradient(to bottom right, #1E1B4B 0%, #0F172A 100%), linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
        backgroundSize: "100% 100%, 40px 40px, 40px 40px",
        backgroundBlendMode: "normal, overlay, overlay",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", minHeight: "850px", position: "relative", overflow: "hidden"
      },
      children: [
        { id: "", order: 0, type: "badge", content: "ENTERPRISE GRADE INFRASTRUCTURE", styles: { backgroundColor: "rgba(30,58,138,0.2)", color: "#93C5FD", padding: "8px 24px", borderRadius: "99px", fontSize: "12px", fontWeight: "800", letterSpacing: "0.15em", border: "1px solid rgba(59,130,246,0.3)" } },
        { id: "", order: 1, type: "heading", content: "The platform for\nglobal scale.", props: { level: 1 }, styles: { fontSize: "100px", fontWeight: "900", color: "#FFFFFF", lineHeight: "0.95", margin: "32px 0 24px", letterSpacing: "-0.03em" } },
        { id: "", order: 2, type: "paragraph", content: "Unify your team's workflow within a secure, high-performance environment designed for the most demanding global enterprises.", styles: { fontSize: "22px", color: "#94A3B8", maxWidth: "700px", margin: "0 auto", lineHeight: "1.6", fontWeight: "400" } },
        {
          id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childJustify: "center", _childGap: "lg" }, styles: { marginTop: "48px", width: "100%" },
          children: [
            { id: "", order: 0, type: "button", content: "Contact Sales", styles: { backgroundColor: "#3B82F6", color: "#FFFFFF", padding: "20px 48px", borderRadius: "8px", fontWeight: "700", fontSize: "16px", cursor: "pointer", boxShadow: "0 10px 30px rgba(59,130,246,0.25)", border: "1px solid #60A5FA" } },
            { id: "", order: 1, type: "button", content: "View Documentation", styles: { backgroundColor: "transparent", color: "#FFFFFF", padding: "20px 48px", borderRadius: "8px", fontWeight: "600", fontSize: "16px", cursor: "pointer", border: "1px solid rgba(255,255,255,0.2)", hover: { backgroundColor: "rgba(255,255,255,0.05)" } } },
          ]
        }
      ]
    }
  },

  {
    id: "sb-features-phantom-dark",
    name: "Features — Phantom Grid",
    category: "features",
    designStyle: "dark",
    description: "Cinematic dark features grid with glassmorphism cards and neon violet accents.",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 48px", backgroundColor: "#060606", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "80%", height: "400px", backgroundImage: "radial-gradient(ellipse at top, rgba(124,58,237,0.15) 0%, transparent 70%)" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { textAlign: "center", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "24px", position: "relative", zIndex: "10" }, children: [
            { id: "", order: 0, type: "heading", content: "Intelligent by design.", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "800", color: "#FAFAFA", margin: "0", letterSpacing: "-0.03em", lineHeight: "1.05" } },
            { id: "", order: 1, type: "paragraph", content: "Powerful features tucked away behind a beautifully minimal interface. Discover tools built for serious professionals.", styles: { fontSize: "20px", color: "#A1A1AA", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "", props: { _childLayout: "row-wrap", _childAlign: "stretch", _childGap: "xl" }, styles: { width: "100%", maxWidth: "1280px", position: "relative", zIndex: "10" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.02)", padding: "48px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px", transition: "all 0.3s ease", cursor: "pointer", ":hover": { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(124,58,237,0.3)" } }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(124,58,237,0.2)" }, children: [{ id: "", order: 0, type: "paragraph", content: "✦", styles: { fontSize: "24px", color: "#A78BFA", margin: "0" } }] },
                { id: "", order: 1, type: "heading", content: "Generative AI", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#FAFAFA", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Context-aware AI models integrated deeply into the workflow to accelerate your creative process.", styles: { color: "#A1A1AA", margin: "0", lineHeight: "1.7", fontSize: "16px" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.02)", padding: "48px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px", transition: "all 0.3s ease", cursor: "pointer", ":hover": { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(124,58,237,0.3)" } }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(124,58,237,0.2)" }, children: [{ id: "", order: 0, type: "paragraph", content: "⚡", styles: { fontSize: "24px", color: "#A78BFA", margin: "0" } }] },
                { id: "", order: 1, type: "heading", content: "Real-time Sync", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#FAFAFA", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Changes propagate to all clients globally in less than 50ms powered by our edge computing network.", styles: { color: "#A1A1AA", margin: "0", lineHeight: "1.7", fontSize: "16px" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.02)", padding: "48px", borderRadius: "24px", border: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", gap: "24px", flex: "1", minWidth: "300px", transition: "all 0.3s ease", cursor: "pointer", ":hover": { backgroundColor: "rgba(255,255,255,0.04)", borderColor: "rgba(124,58,237,0.3)" } }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "56px", height: "56px", borderRadius: "14px", backgroundColor: "rgba(124,58,237,0.1)", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid rgba(124,58,237,0.2)" }, children: [{ id: "", order: 0, type: "paragraph", content: "🛡️", styles: { fontSize: "24px", color: "#A78BFA", margin: "0" } }] },
                { id: "", order: 1, type: "heading", content: "SOC2 Compliant", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#FAFAFA", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Enterprise-grade security built directly into the fabric of the platform from day one.", styles: { color: "#A1A1AA", margin: "0", lineHeight: "1.7", fontSize: "16px" } },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-pricing-cascade-minimal",
    name: "Pricing — Cascade Minimal",
    category: "pricing",
    designStyle: "minimal",
    description: "Clean, ultra-minimal pricing layout with clear tiers and emerald accents.",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 48px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", maxWidth: "600px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
            { id: "", order: 0, type: "heading", content: "Simple, transparent pricing.", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
            { id: "", order: 1, type: "paragraph", content: "Choose the plan that best fits your needs. No hidden fees or surprises.", styles: { fontSize: "18px", color: "#64748B", margin: "0" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" }, styles: { width: "100%", maxWidth: "1000px", flexWrap: "wrap", justifyContent: "center", gap: "40px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", minWidth: "340px", padding: "48px", borderRadius: "24px", border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "32px", boxShadow: "0 10px 40px rgba(0,0,0,0.03)", transition: "transform 0.3s ease", ":hover": { transform: "translateY(-4px)" } },
              children: [
                { id: "", order: 0, type: "heading", content: "Starter", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Perfect for individuals and small projects.", styles: { fontSize: "15px", color: "#64748B", margin: "0", minHeight: "45px" } },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", alignItems: "baseline", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "$19", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "/month", styles: { fontSize: "16px", color: "#64748B", margin: "0", fontWeight: "500" } },
                  ]
                },
                {
                  id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓ Up to 3 projects", styles: { fontSize: "15px", color: "#334155", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "✓ Access to basic templates", styles: { fontSize: "15px", color: "#334155", margin: "0" } },
                    { id: "", order: 2, type: "paragraph", content: "✓ Community support", styles: { fontSize: "15px", color: "#334155", margin: "0" } },
                  ]
                },
                { id: "", order: 4, type: "button", content: "Start Free Trial", styles: { marginTop: "16px", backgroundColor: "#F1F5F9", color: "#0F172A", padding: "16px 24px", borderRadius: "12px", fontWeight: "600", fontSize: "16px", cursor: "pointer", border: "1px solid #E2E8F0" } }
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1", minWidth: "340px", padding: "48px", borderRadius: "24px", border: "2px solid #059669", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", gap: "32px", boxShadow: "0 20px 60px rgba(5,150,105,0.15)", position: "relative", transform: "scale(1.02)", zIndex: "10" },
              children: [
                { id: "", order: 0, type: "badge", content: "MOST POPULAR", styles: { position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", backgroundColor: "#059669", color: "#FFFFFF", padding: "4px 16px", borderRadius: "99px", fontSize: "11px", fontWeight: "800", letterSpacing: "0.1em" } },
                { id: "", order: 1, type: "heading", content: "Pro", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "700", color: "#0F172A", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Advanced tools for growing teams.", styles: { fontSize: "15px", color: "#64748B", margin: "0", minHeight: "45px" } },
                {
                  id: "", order: 3, type: "container", content: "", styles: { display: "flex", alignItems: "baseline", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "$49", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "/month", styles: { fontSize: "16px", color: "#64748B", margin: "0", fontWeight: "500" } },
                  ]
                },
                {
                  id: "", order: 4, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓ Unlimited projects", styles: { fontSize: "15px", color: "#0F172A", fontWeight: "500", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "✓ Access to all pro templates", styles: { fontSize: "15px", color: "#0F172A", fontWeight: "500", margin: "0" } },
                    { id: "", order: 2, type: "paragraph", content: "✓ Priority email & chat support", styles: { fontSize: "15px", color: "#0F172A", fontWeight: "500", margin: "0" } },
                    { id: "", order: 3, type: "paragraph", content: "✓ Custom domains", styles: { fontSize: "15px", color: "#0F172A", fontWeight: "500", margin: "0" } },
                  ]
                },
                { id: "", order: 5, type: "button", content: "Upgrade to Pro", styles: { marginTop: "16px", backgroundColor: "#059669", color: "#FFFFFF", padding: "16px 24px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer", border: "none", boxShadow: "0 10px 20px rgba(5,150,105,0.2)" } }
              ]
            }
          ]
        }
      ]
    }
  },

  {
    id: "sb-cta-enterprise-dark",
    name: "CTA — Enterprise Newsletter",
    category: "cta",
    designStyle: "dark",
    description: "High impact dark full-bleed CTA aimed at lead generation and signups.",
    element: {
      type: "container", content: "",
      styles: {
        padding: "120px 48px",
        backgroundColor: "#030712",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        textAlign: "center", width: "100%", position: "relative",
        backgroundImage: "radial-gradient(ellipse at bottom, rgba(59,130,246,0.15), transparent 60%)"
      },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "800px", display: "flex", flexDirection: "column", gap: "32px", alignItems: "center" }, children: [
            { id: "", order: 0, type: "heading", content: "Ready to scale your\noperations?", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "800", color: "#FFFFFF", lineHeight: "1.05", margin: "0", letterSpacing: "-0.03em" } },
            { id: "", order: 1, type: "paragraph", content: "Join over 5,000 enterprise teams that use our platform to build, launch, and manage their digital products securely.", styles: { fontSize: "20px", color: "#94A3B8", margin: "0", lineHeight: "1.6", maxWidth: "600px" } },
            {
              id: "", order: 2, type: "form", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "sm", bgType: "dark" },
              styles: { backgroundColor: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "16px", padding: "8px", width: "100%", maxWidth: "500px", marginTop: "16px", backdropFilter: "blur(12px)" },
              children: [
                { id: "", order: 0, type: "input", content: "", props: { label: "", placeholder: "Enter your work email", inputType: "email", required: true }, styles: { flex: "1", color: "#FFFFFF", backgroundColor: "transparent", border: "none" } },
                { id: "", order: 1, type: "button", content: "Request Demo", props: { buttonType: "submit" }, styles: { backgroundColor: "#3B82F6", color: "#FFFFFF", padding: "12px 24px", borderRadius: "12px", fontWeight: "600", fontSize: "15px" } },
              ]
            },
            { id: "", order: 3, type: "paragraph", content: "No credit card required. Free 14-day trial.", styles: { fontSize: "13px", color: "#64748B", margin: "0" } }
          ]
        }
      ]
    }
  },

  {
    id: "sb-footer-meridian-enterprise",
    name: "Footer — Meridian Enterprise",
    category: "footer",
    designStyle: "corporate",
    description: "Expansive 5-column corporate footer with subtle bottom utility bar.",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 48px 32px", backgroundColor: "#F8FAFC", borderTop: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "64px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "start", _childGap: "xl" }, styles: { maxWidth: "1280px", width: "100%", margin: "0 auto", flexWrap: "wrap", justifyContent: "space-between" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px", maxWidth: "320px", flex: "2", minWidth: "250px" }, children: [
                { id: "", order: 0, type: "heading", content: "Meridian", props: { level: 4 }, styles: { fontSize: "22px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-0.02em" } },
                { id: "", order: 1, type: "paragraph", content: "Delivering modern infrastructure solutions that empower global teams to achieve more together.", styles: { fontSize: "15px", color: "#64748B", lineHeight: "1.6", margin: "0" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px", flex: "1", minWidth: "150px" }, children: [
                { id: "", order: 0, type: "heading", content: "Product", props: { level: 5 }, styles: { fontSize: "13px", fontWeight: "700", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" } },
                { id: "", order: 1, type: "text-link", content: "Features", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Integrations", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Pricing", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 4, type: "text-link", content: "Changelog", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } }
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px", flex: "1", minWidth: "150px" }, children: [
                { id: "", order: 0, type: "heading", content: "Company", props: { level: 5 }, styles: { fontSize: "13px", fontWeight: "700", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" } },
                { id: "", order: 1, type: "text-link", content: "About Us", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Careers", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Blog", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 4, type: "text-link", content: "Contact", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } }
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "16px", flex: "1", minWidth: "150px" }, children: [
                { id: "", order: 0, type: "heading", content: "Legal", props: { level: 5 }, styles: { fontSize: "13px", fontWeight: "700", color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.05em", margin: "0 0 8px 0" } },
                { id: "", order: 1, type: "text-link", content: "Privacy Policy", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "Terms of Service", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 3, type: "text-link", content: "Cookie Policy", props: { href: "#" }, styles: { fontSize: "15px", color: "#64748B", textDecoration: "none" } }
              ]
            }
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", paddingTop: "32px", maxWidth: "1280px", width: "100%", margin: "0 auto", flexWrap: "wrap", gap: "16px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "© 2026 Meridian Inc. All rights reserved.", styles: { fontSize: "14px", color: "#94A3B8", margin: "0" } },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", gap: "16px" }, children: [
                { id: "", order: 0, type: "text-link", content: "X (Twitter)", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 1, type: "text-link", content: "LinkedIn", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } },
                { id: "", order: 2, type: "text-link", content: "GitHub", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", textDecoration: "none" } }
              ]
            }
          ]
        }
      ]
    }
  },

  // ─── LOGO CLOUD (additional) ────────────────────────────────────────────────

  {
    id: "sb-logos-animated-marquee",
    name: "Logo Cloud — Infinite Marquee",
    category: "logo-cloud",
    designStyle: "modern",
    description: "Continuously scrolling logo marquee strip on a white background",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 0", backgroundColor: "#FFFFFF", overflow: "hidden" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { textAlign: "center", marginBottom: "48px", padding: "0 40px" },
          children: [
            { id: "", order: 0, type: "paragraph", content: "TRUSTED BY INDUSTRY LEADERS", styles: { fontSize: "11px", fontWeight: "800", color: "#94A3B8", letterSpacing: "0.2em", margin: "0" } },
          ],
        },
        {
          id: "", order: 1, type: "container", content: "",
          styles: { display: "flex", gap: "80px", alignItems: "center", padding: "0 40px", overflowX: "auto" },
          children: [
            { id: "", order: 0, type: "heading", content: "Stripe", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#C4C9D4", margin: "0", letterSpacing: "-0.03em", whiteSpace: "nowrap" } },
            { id: "", order: 1, type: "heading", content: "Vercel", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#C4C9D4", margin: "0", letterSpacing: "-0.03em", whiteSpace: "nowrap" } },
            { id: "", order: 2, type: "heading", content: "Linear", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#C4C9D4", margin: "0", letterSpacing: "-0.03em", whiteSpace: "nowrap" } },
            { id: "", order: 3, type: "heading", content: "Notion", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#C4C9D4", margin: "0", letterSpacing: "-0.03em", whiteSpace: "nowrap" } },
            { id: "", order: 4, type: "heading", content: "Figma", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#C4C9D4", margin: "0", letterSpacing: "-0.03em", whiteSpace: "nowrap" } },
            { id: "", order: 5, type: "heading", content: "Loom", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#C4C9D4", margin: "0", letterSpacing: "-0.03em", whiteSpace: "nowrap" } },
            { id: "", order: 6, type: "heading", content: "GitHub", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#C4C9D4", margin: "0", letterSpacing: "-0.03em", whiteSpace: "nowrap" } },
          ],
        },
      ],
    },
  },

  {
    id: "sb-logos-grid-dark",
    name: "Logo Cloud — Dark Grid",
    category: "logo-cloud",
    designStyle: "dark",
    description: "Dark background logo grid with hover glow effect",
    element: {
      type: "container", content: "",
      styles: { padding: "100px 40px", backgroundColor: "#030712" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "60px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "",
              styles: { textAlign: "center" },
              children: [
                { id: "", order: 0, type: "paragraph", content: "Powering teams at world-class companies", styles: { fontSize: "15px", color: "#64748B", margin: "0", fontWeight: "500" } },
              ],
            },
            {
              id: "", order: 1, type: "container", content: "",
              styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: "#1E293B", borderRadius: "20px", overflow: "hidden", border: "1px solid #1E293B" },
              children: [
                { id: "", order: 0, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "Stripe", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
                { id: "", order: 1, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "Vercel", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
                { id: "", order: 2, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "Linear", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
                { id: "", order: 3, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "Figma", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
                { id: "", order: 4, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "Notion", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
                { id: "", order: 5, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "GitHub", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
                { id: "", order: 6, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "AWS", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
                { id: "", order: 7, type: "container", styles: { backgroundColor: "#0F172A", padding: "40px", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "heading", content: "Shopify", styles: { fontSize: "22px", fontWeight: "900", color: "#475569", margin: "0", letterSpacing: "-0.02em" } }] },
              ],
            },
          ],
        },
      ],
    },
  },

  // ─── INTERACTIVE (additional) ───────────────────────────────────────────────

  {
    id: "sb-interactive-feature-tabs",
    name: "Interactive — Feature Tabs Showcase",
    category: "interactive",
    designStyle: "modern",
    description: "Tabbed feature showcase with screenshot previews and detailed descriptions",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#F8FAFC" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { maxWidth: "1280px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "64px" },
          children: [
            {
              id: "", order: 0, type: "container", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                { id: "", order: 0, type: "badge", content: "EVERY FEATURE YOU NEED", styles: { backgroundColor: "#EEF2FF", color: "#6366F1", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "800", letterSpacing: "0.08em", display: "inline-block" } },
                { id: "", order: 1, type: "heading", content: "One platform. Infinite possibilities.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.1" } },
                { id: "", order: 2, type: "paragraph", content: "Explore the features that make us the preferred choice for teams building the next generation of web experiences.", styles: { fontSize: "18px", color: "#64748B", margin: "0 auto", maxWidth: "600px", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 1, type: "tabs", content: "", styles: { width: "100%" },
              props: {
                accentColor: "#6366F1",
                tabs: [
                  { label: "Visual Editor", content: "Drag and drop any component onto your canvas. Real-time preview with pixel-perfect accuracy across all device sizes." },
                  { label: "AI Assistant", content: "Describe what you want in plain English and watch as our AI generates complete, production-ready sections in seconds." },
                  { label: "Analytics", content: "Track every interaction with built-in analytics. Understand your visitors, improve conversions, and grow with confidence." },
                  { label: "Deployment", content: "Ship to our global edge network with one click. Instant cache invalidation, automatic SSL, and 99.99% uptime guaranteed." },
                ],
              }
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-interactive-pricing-toggle",
    name: "Interactive — Pricing Toggle",
    category: "interactive",
    designStyle: "minimal",
    description: "Monthly / annual pricing toggle with animated card updates",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FFFFFF" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", gap: "60px" },
          children: [
            {
              id: "", order: 0, type: "container", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }, children: [
                { id: "", order: 0, type: "heading", content: "Pricing that grows with you", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "No hidden fees, no lock-in contracts. Cancel or change plans anytime.", styles: { fontSize: "18px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                {
                  id: "", order: 2, type: "container", styles: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#F8FAFC", padding: "6px", borderRadius: "12px", border: "1px solid #E2E8F0" }, children: [
                    { id: "", order: 0, type: "button", content: "Monthly", styles: { backgroundColor: "#FFFFFF", color: "#0F172A", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", cursor: "pointer", border: "none" } },
                    { id: "", order: 1, type: "button", content: "Annual", styles: { backgroundColor: "transparent", color: "#64748B", padding: "8px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none" } },
                    { id: "", order: 2, type: "badge", content: "Save 20%", styles: { backgroundColor: "#DCFCE7", color: "#15803D", padding: "4px 10px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", width: "100%" }, children: [
                {
                  id: "", order: 0, type: "container", styles: { padding: "40px", borderRadius: "24px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "24px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Starter", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "heading", content: "Free", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
                    { id: "", order: 2, type: "paragraph", content: "Perfect for personal projects and side hustles getting off the ground.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                    { id: "", order: 3, type: "button", content: "Start for free", styles: { backgroundColor: "#F8FAFC", color: "#0F172A", padding: "14px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", border: "1px solid #E2E8F0", cursor: "pointer" } },
                    { id: "", order: 4, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["3 projects", "Custom domain", "Community support", "Basic analytics"], accentColor: "#6366F1" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", styles: { padding: "40px", borderRadius: "24px", border: "2px solid #6366F1", display: "flex", flexDirection: "column", gap: "24px", position: "relative", backgroundImage: "linear-gradient(180deg, #EEF2FF 0%, #FFFFFF 40%)" }, children: [
                    { id: "", order: 0, type: "badge", content: "Most Popular", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "4px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: "700", display: "inline-block", width: "fit-content" } },
                    { id: "", order: 1, type: "heading", content: "Professional", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    {
                      id: "", order: 2, type: "container", styles: { display: "flex", alignItems: "baseline", gap: "4px" }, children: [
                        { id: "", order: 0, type: "heading", content: "$49", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
                        { id: "", order: 1, type: "paragraph", content: "/month", styles: { fontSize: "15px", color: "#64748B" } },
                      ]
                    },
                    { id: "", order: 3, type: "paragraph", content: "For growing teams who need advanced features and priority support.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                    { id: "", order: 4, type: "button", content: "Get started", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "14px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", border: "none", cursor: "pointer", boxShadow: "0 4px 14px rgba(99,102,241,0.3)" } },
                    { id: "", order: 5, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["Unlimited projects", "Custom domains", "Priority support", "Advanced analytics", "Team collaboration", "API access"], accentColor: "#6366F1" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", styles: { padding: "40px", borderRadius: "24px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "#0F172A" }, children: [
                    { id: "", order: 0, type: "heading", content: "Enterprise", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#FFFFFF", margin: "0" } },
                    { id: "", order: 1, type: "heading", content: "Custom", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
                    { id: "", order: 2, type: "paragraph", content: "Tailored solutions for enterprises with custom compliance and SLA requirements.", styles: { fontSize: "15px", color: "#94A3B8", margin: "0", lineHeight: "1.6" } },
                    { id: "", order: 3, type: "button", content: "Contact sales", styles: { backgroundColor: "#FFFFFF", color: "#0F172A", padding: "14px 24px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", border: "none", cursor: "pointer" } },
                    { id: "", order: 4, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["Everything in Pro", "SSO & SAML", "99.99% SLA", "Dedicated CSM", "Custom contracts", "On-premise option"], accentColor: "#6366F1" } },
                  ]
                },
              ]
            },
          ],
        },
      ],
    },
  },

  // ─── DASHBOARD (additional) ─────────────────────────────────────────────────

  {
    id: "sb-dashboard-analytics-hero",
    name: "Dashboard — Analytics Hero",
    category: "dashboard",
    designStyle: "modern",
    description: "Full analytics dashboard overview with KPI cards and a chart section",
    element: {
      type: "container", content: "",
      styles: { padding: "40px", backgroundColor: "#F8FAFC", minHeight: "600px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { maxWidth: "1400px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "32px" },
          children: [
            {
              id: "", order: 0, type: "container", styles: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
                {
                  id: "", order: 0, type: "container", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Analytics Overview", props: { level: 1 }, styles: { fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-0.02em" } },
                    { id: "", order: 1, type: "paragraph", content: "Last 30 days · Compared to previous period", styles: { fontSize: "14px", color: "#64748B", margin: "0" } },
                  ]
                },
                { id: "", order: 1, type: "button", content: "Export Report", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "10px 20px", borderRadius: "8px", fontWeight: "600", fontSize: "14px", cursor: "pointer", border: "none" } },
              ]
            },
            {
              id: "", order: 1, type: "container", styles: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" }, children: [
                {
                  id: "", order: 0, type: "container", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Total Revenue", styles: { fontSize: "13px", fontWeight: "600", color: "#64748B", margin: "0" } },
                    { id: "", order: 1, type: "heading", content: "$124,580", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                    { id: "", order: 2, type: "paragraph", content: "↑ +18.2% vs last month", styles: { fontSize: "12px", color: "#10B981", fontWeight: "600", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Active Users", styles: { fontSize: "13px", fontWeight: "600", color: "#64748B", margin: "0" } },
                    { id: "", order: 1, type: "heading", content: "28,420", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                    { id: "", order: 2, type: "paragraph", content: "↑ +6.4% vs last month", styles: { fontSize: "12px", color: "#10B981", fontWeight: "600", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", styles: { backgroundColor: "#FFFFFF", borderRadius: "16px", padding: "24px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Conversion Rate", styles: { fontSize: "13px", fontWeight: "600", color: "#64748B", margin: "0" } },
                    { id: "", order: 1, type: "heading", content: "4.82%", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                    { id: "", order: 2, type: "paragraph", content: "↓ -0.3% vs last month", styles: { fontSize: "12px", color: "#EF4444", fontWeight: "600", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 3, type: "container", styles: { backgroundColor: "#6366F1", borderRadius: "16px", padding: "24px", border: "1px solid #4F46E5", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Churn Rate", styles: { fontSize: "13px", fontWeight: "600", color: "rgba(255,255,255,0.7)", margin: "0" } },
                    { id: "", order: 1, type: "heading", content: "1.2%", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.03em" } },
                    { id: "", order: 2, type: "paragraph", content: "↓ -0.8% vs last month", styles: { fontSize: "12px", color: "rgba(255,255,255,0.75)", fontWeight: "600", margin: "0" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", styles: { display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px" }, children: [
                {
                  id: "", order: 0, type: "container", styles: { backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "32px", border: "1px solid #E2E8F0" }, children: [
                    { id: "", order: 0, type: "heading", content: "Revenue over time", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: "0 0 24px" } },
                    { id: "", order: 1, type: "chart", content: "", props: { chartType: "line", accentColor: "#6366F1", data: [{ label: "Jan", value: 68000 }, { label: "Feb", value: 82000 }, { label: "Mar", value: 75000 }, { label: "Apr", value: 97000 }, { label: "May", value: 113000 }, { label: "Jun", value: 124580 }] }, styles: { width: "100%", height: "220px" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", styles: { backgroundColor: "#FFFFFF", borderRadius: "20px", padding: "32px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Top channels", props: { level: 3 }, styles: { fontSize: "18px", fontWeight: "700", color: "#0F172A", margin: "0" } },
                    {
                      id: "", order: 1, type: "container", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                        { id: "", order: 0, type: "container", styles: { display: "flex", alignItems: "center", gap: "12px" }, children: [{ id: "", order: 0, type: "paragraph", content: "Organic Search", styles: { fontSize: "14px", color: "#374151", fontWeight: "500", flex: "1" } }, { id: "", order: 1, type: "paragraph", content: "43%", styles: { fontSize: "14px", color: "#6366F1", fontWeight: "700" } }] },
                        { id: "", order: 1, type: "container", styles: { display: "flex", alignItems: "center", gap: "12px" }, children: [{ id: "", order: 0, type: "paragraph", content: "Direct", styles: { fontSize: "14px", color: "#374151", fontWeight: "500", flex: "1" } }, { id: "", order: 1, type: "paragraph", content: "28%", styles: { fontSize: "14px", color: "#6366F1", fontWeight: "700" } }] },
                        { id: "", order: 2, type: "container", styles: { display: "flex", alignItems: "center", gap: "12px" }, children: [{ id: "", order: 0, type: "paragraph", content: "Social Media", styles: { fontSize: "14px", color: "#374151", fontWeight: "500", flex: "1" } }, { id: "", order: 1, type: "paragraph", content: "18%", styles: { fontSize: "14px", color: "#6366F1", fontWeight: "700" } }] },
                        { id: "", order: 3, type: "container", styles: { display: "flex", alignItems: "center", gap: "12px" }, children: [{ id: "", order: 0, type: "paragraph", content: "Referral", styles: { fontSize: "14px", color: "#374151", fontWeight: "500", flex: "1" } }, { id: "", order: 1, type: "paragraph", content: "11%", styles: { fontSize: "14px", color: "#6366F1", fontWeight: "700" } }] },
                      ]
                    }
                  ]
                },
              ]
            },
          ],
        },
      ],
    },
  },

  // ─── CONTENT (additional) ───────────────────────────────────────────────────

  {
    id: "sb-content-magazine-split",
    name: "Content — Magazine Split",
    category: "content",
    designStyle: "minimal",
    description: "Editorial magazine-style layout with large image and typographic content",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FFFFFF" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" },
          children: [
            {
              id: "", order: 0, type: "container", styles: { display: "flex", flexDirection: "column", gap: "32px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "FEATURE STORY", styles: { fontSize: "11px", fontWeight: "900", color: "#94A3B8", letterSpacing: "0.2em", margin: "0" } },
                { id: "", order: 1, type: "heading", content: "The renaissance of thoughtful design in a noisy world.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "300", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.1", fontFamily: "'Georgia', serif" } },
                {
                  id: "", order: 2, type: "container", styles: { display: "flex", alignItems: "center", gap: "12px", paddingTop: "16px", borderTop: "1px solid #E2E8F0" }, children: [
                    { id: "", order: 0, type: "image", content: "", props: { src: "https://i.pravatar.cc/40?u=author" }, styles: { width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" } },
                    {
                      id: "", order: 1, type: "container", styles: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "by Marcus Webb", styles: { fontSize: "13px", fontWeight: "700", color: "#0F172A", margin: "0" } },
                        { id: "", order: 1, type: "paragraph", content: "April 15, 2026 · 8 min read", styles: { fontSize: "12px", color: "#94A3B8", margin: "0" } },
                      ]
                    },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", styles: { display: "flex", flexDirection: "column", gap: "24px" }, children: [
                { id: "", order: 0, type: "image", content: "", props: { src: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=900" }, styles: { width: "100%", height: "320px", objectFit: "cover", borderRadius: "12px" } },
                { id: "", order: 1, type: "paragraph", content: "In a world saturated with digital noise, the designers who cut through are those who embrace constraints as a creative tool. Reduction is not limitation — it is the highest form of craft.", styles: { fontSize: "17px", color: "#475569", margin: "0", lineHeight: "1.8" } },
                { id: "", order: 2, type: "paragraph", content: "The best interfaces are invisible. They guide without demanding attention, inform without overwhelming, and delight without distraction. That is the standard we hold ourselves to.", styles: { fontSize: "17px", color: "#475569", margin: "0", lineHeight: "1.8" } },
                { id: "", order: 3, type: "text-link", content: "Continue reading →", props: { href: "#" }, styles: { fontSize: "14px", color: "#6366F1", fontWeight: "600", textDecoration: "none" } },
              ]
            },
          ],
        },
      ],
    },
  },

  {
    id: "sb-content-documentation",
    name: "Content — Documentation Layout",
    category: "content",
    designStyle: "modern",
    description: "Two-column docs layout with sticky sidebar and rich content area",
    element: {
      type: "container", content: "",
      styles: { padding: "80px 40px", backgroundColor: "#FFFFFF" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          styles: { maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "240px 1fr", gap: "64px", alignItems: "start" },
          children: [
            {
              id: "", order: 0, type: "container", styles: { display: "flex", flexDirection: "column", gap: "8px", position: "sticky", top: "80px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "GETTING STARTED", styles: { fontSize: "10px", fontWeight: "900", color: "#94A3B8", letterSpacing: "0.15em", margin: "0 0 8px", textTransform: "uppercase" } },
                { id: "", order: 1, type: "text-link", content: "Introduction", props: { href: "#" }, styles: { fontSize: "14px", color: "#6366F1", fontWeight: "600", textDecoration: "none", padding: "6px 12px", borderRadius: "8px", backgroundColor: "#EEF2FF", display: "block" } },
                { id: "", order: 2, type: "text-link", content: "Installation", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", fontWeight: "500", textDecoration: "none", padding: "6px 12px", borderRadius: "8px", display: "block" } },
                { id: "", order: 3, type: "text-link", content: "Configuration", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", fontWeight: "500", textDecoration: "none", padding: "6px 12px", borderRadius: "8px", display: "block" } },
                { id: "", order: 4, type: "paragraph", content: "CORE CONCEPTS", styles: { fontSize: "10px", fontWeight: "900", color: "#94A3B8", letterSpacing: "0.15em", margin: "16px 0 8px", textTransform: "uppercase" } },
                { id: "", order: 5, type: "text-link", content: "Components", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", fontWeight: "500", textDecoration: "none", padding: "6px 12px", borderRadius: "8px", display: "block" } },
                { id: "", order: 6, type: "text-link", content: "Theming", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", fontWeight: "500", textDecoration: "none", padding: "6px 12px", borderRadius: "8px", display: "block" } },
                { id: "", order: 7, type: "text-link", content: "API Reference", props: { href: "#" }, styles: { fontSize: "14px", color: "#64748B", fontWeight: "500", textDecoration: "none", padding: "6px 12px", borderRadius: "8px", display: "block" } },
              ]
            },
            {
              id: "", order: 1, type: "container", styles: { display: "flex", flexDirection: "column", gap: "32px", maxWidth: "720px" }, children: [
                { id: "", order: 0, type: "heading", content: "Introduction", props: { level: 1 }, styles: { fontSize: "40px", fontWeight: "800", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                { id: "", order: 1, type: "paragraph", content: "Welcome to the documentation. This guide will help you get up and running in minutes. Whether you're building a simple landing page or a full-featured SaaS application, this platform gives you everything you need.", styles: { fontSize: "17px", color: "#475569", margin: "0", lineHeight: "1.8" } },
                {
                  id: "", order: 2, type: "container", styles: { backgroundColor: "#F8FAFC", borderRadius: "16px", padding: "24px 28px", border: "1px solid #E2E8F0" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Quick start", styles: { fontSize: "13px", fontWeight: "700", color: "#374151", margin: "0 0 12px" } },
                    { id: "", order: 1, type: "code-block", content: "npm install @acme/sdk\nnpx acme init my-project\ncd my-project && npm run dev", props: { language: "bash" }, styles: { backgroundColor: "#0F172A", color: "#4ADE80", padding: "20px", borderRadius: "10px", fontSize: "13px", fontFamily: "monospace", lineHeight: "1.7", border: "none" } },
                  ]
                },
                { id: "", order: 3, type: "heading", content: "Prerequisites", props: { level: 2 }, styles: { fontSize: "28px", fontWeight: "700", color: "#0F172A", margin: "0", letterSpacing: "-0.02em" } },
                { id: "", order: 4, type: "list", content: "", props: { listType: "unordered", iconType: "check", items: ["Node.js 18 or higher", "npm or yarn package manager", "A modern code editor (VS Code recommended)", "Basic knowledge of JavaScript / TypeScript"], accentColor: "#6366F1" } },
              ]
            },
          ],
        },
      ],
    },
  },

  // ─── HERO — NEW ──────────────────────────────────────────────────────────────

  {
    id: "sb-hero-dashboard-preview",
    name: "Hero — SaaS Dashboard Preview",
    category: "hero",
    designStyle: "modern",
    description: "Split hero with headline left and blurred dashboard mockup right — classic SaaS product page",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px 0", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" },
      children: [
        {
          id: "", order: 0, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
          styles: { maxWidth: "1280px", width: "100%", paddingBottom: "80px" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { flex: "1", minWidth: "420px", display: "flex", flexDirection: "column", gap: "40px" }, children: [
                { id: "", order: 0, type: "badge", content: "✦ NOW IN PUBLIC BETA", styles: { backgroundColor: "#EEF2FF", color: "#6366F1", padding: "6px 14px", borderRadius: "9999px", fontSize: "12px", fontWeight: "700", width: "fit-content", border: "1px solid #C7D2FE" } },
                { id: "", order: 1, type: "heading", content: "Ship production\nsites in minutes,\nnot months.", props: { level: 1 }, styles: { fontSize: "64px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.0", whiteSpace: "pre-line" } },
                { id: "", order: 2, type: "paragraph", content: "The visual site builder designed for engineers and designers who refuse to compromise on quality. Drag, customize, deploy — all from one platform.", styles: { fontSize: "20px", color: "#64748B", margin: "0", lineHeight: "1.65", maxWidth: "480px" } },
                {
                  id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "md" }, styles: {}, children: [
                    { id: "", order: 0, type: "button", content: "Start building free →", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "16px 32px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer", boxShadow: "0 8px 24px rgba(99,102,241,0.35)" } },
                    { id: "", order: 1, type: "button", content: "Watch demo", styles: { backgroundColor: "transparent", color: "#374151", padding: "16px 24px", borderRadius: "12px", fontWeight: "600", fontSize: "16px", cursor: "pointer", border: "1.5px solid #E2E8F0" } },
                  ]
                },
                {
                  id: "", order: 4, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "lg" }, styles: {}, children: [
                    { id: "", order: 0, type: "paragraph", content: "★★★★★ 4.9/5 on G2", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "600" } },
                    { id: "", order: 1, type: "paragraph", content: "·", styles: { color: "#CBD5E1", margin: "0" } },
                    { id: "", order: 2, type: "paragraph", content: "12,000+ teams", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "600" } },
                    { id: "", order: 3, type: "paragraph", content: "·", styles: { color: "#CBD5E1", margin: "0" } },
                    { id: "", order: 4, type: "paragraph", content: "No credit card", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "600" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { flex: "1.3", minWidth: "500px", position: "relative" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { width: "100%", height: "520px", backgroundColor: "#1E293B", borderRadius: "24px 24px 0 0", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 -20px 80px rgba(0,0,0,0.15), 0 0 0 1px rgba(99,102,241,0.1)", position: "relative", overflow: "hidden" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", styles: { padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "●", styles: { color: "#EF4444", fontSize: "12px", margin: "0" } },
                        { id: "", order: 1, type: "paragraph", content: "●", styles: { color: "#F59E0B", fontSize: "12px", margin: "0" } },
                        { id: "", order: 2, type: "paragraph", content: "●", styles: { color: "#10B981", fontSize: "12px", margin: "0" } },
                        { id: "", order: 3, type: "paragraph", content: "buildstack.app/dashboard", styles: { fontSize: "12px", color: "rgba(255,255,255,0.3)", margin: "0 0 0 8px", fontFamily: "monospace" } },
                      ]
                    },
                    {
                      id: "", order: 1, type: "container", content: "", styles: { padding: "32px", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }, children: [
                        { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }, children: [{ id: "", order: 0, type: "paragraph", content: "Monthly Revenue", styles: { fontSize: "11px", color: "#475569", margin: "0 0 8px", fontWeight: "700", letterSpacing: "0.08em" } }, { id: "", order: 1, type: "paragraph", content: "$84,291", styles: { fontSize: "28px", fontWeight: "900", color: "#FFFFFF", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "↑ 23.1% vs last month", styles: { fontSize: "12px", color: "#10B981", margin: "8px 0 0", fontWeight: "600" } }] },
                        { id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "rgba(255,255,255,0.04)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(255,255,255,0.06)" }, children: [{ id: "", order: 0, type: "paragraph", content: "Active Users", styles: { fontSize: "11px", color: "#475569", margin: "0 0 8px", fontWeight: "700", letterSpacing: "0.08em" } }, { id: "", order: 1, type: "paragraph", content: "12,048", styles: { fontSize: "28px", fontWeight: "900", color: "#FFFFFF", margin: "0" } }, { id: "", order: 2, type: "paragraph", content: "↑ 8.4% this week", styles: { fontSize: "12px", color: "#10B981", margin: "8px 0 0", fontWeight: "600" } }] },
                        { id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "rgba(99,102,241,0.15)", borderRadius: "16px", padding: "24px", border: "1px solid rgba(99,102,241,0.2)", gridColumn: "span 2" }, children: [{ id: "", order: 0, type: "paragraph", content: "Deployment Status — All systems operational", styles: { fontSize: "13px", color: "#818CF8", margin: "0", fontWeight: "700" } }, { id: "", order: 1, type: "paragraph", content: "Last deploy: 2 minutes ago · 14 regions active · 99.99% uptime", styles: { fontSize: "12px", color: "#475569", margin: "8px 0 0" } }] },
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  {
    id: "sb-hero-video-dark",
    name: "Hero — Cinematic Video CTA",
    category: "hero",
    designStyle: "dark",
    description: "Full dark hero with large play button thumbnail — ideal for product demo video showcases",
    element: {
      type: "container", content: "",
      styles: { padding: "160px 40px", backgroundColor: "#000000", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px", textAlign: "center", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "0", width: "100%", height: "100%", backgroundImage: "radial-gradient(ellipse 80% 50% at 50% 0%, rgba(99,102,241,0.12) 0%, transparent 60%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "28px", alignItems: "center", maxWidth: "800px", position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "badge", content: "★  Rated #1 on Product Hunt 2026", styles: { backgroundColor: "rgba(255,255,255,0.05)", color: "#A5B4FC", padding: "8px 18px", borderRadius: "9999px", fontSize: "13px", fontWeight: "600", border: "1px solid rgba(255,255,255,0.1)", letterSpacing: "0.02em" } },
            { id: "", order: 1, type: "heading", content: "See it in action.", props: { level: 1 }, styles: { fontSize: "96px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em", lineHeight: "0.95" } },
            { id: "", order: 2, type: "paragraph", content: "Watch how teams go from idea to live site in under 10 minutes. No code. No compromise.", styles: { fontSize: "22px", color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "", styles: { position: "relative", width: "100%", maxWidth: "960px", borderRadius: "28px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 120px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.15)", zIndex: "2" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { width: "100%", height: "540px", backgroundColor: "#0F172A", backgroundImage: "linear-gradient(135deg, #1E293B 0%, #0F172A 100%)", display: "flex", alignItems: "center", justifyContent: "center" }, children: [
                { id: "", order: 0, type: "container", content: "", styles: { width: "80px", height: "80px", borderRadius: "9999px", backgroundColor: "rgba(255,255,255,0.1)", border: "2px solid rgba(255,255,255,0.2)", backdropFilter: "blur(12px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 0 40px rgba(99,102,241,0.3)" }, children: [{ id: "", order: 0, type: "paragraph", content: "▶", styles: { fontSize: "24px", color: "#FFFFFF", margin: "0", marginLeft: "4px" } }] },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── FEATURES — NEW ──────────────────────────────────────────────────────────

  {
    id: "sb-features-bento-dark",
    name: "Features — Dark Bento Grid",
    category: "features",
    designStyle: "dark",
    description: "Asymmetric dark bento grid with 5 feature cards of mixed sizes — modern SaaS showcase",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#030712", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "720px" }, children: [
            { id: "", order: 0, type: "badge", content: "BUILT DIFFERENT", styles: { backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", border: "1px solid rgba(99,102,241,0.2)" } },
            { id: "", order: 1, type: "heading", content: "Every feature you need,\nzero you don't.", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          styles: { maxWidth: "1280px", width: "100%", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gridTemplateRows: "auto auto", gap: "20px" },
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { gridColumn: "span 2", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "20px", backgroundImage: "linear-gradient(135deg, rgba(99,102,241,0.08) 0%, transparent 60%)" }, children: [{ id: "", order: 0, type: "paragraph", content: "⚡", styles: { fontSize: "36px", margin: "0" } }, { id: "", order: 1, type: "heading", content: "Deploy in under 30 seconds", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.03em" } }, { id: "", order: 2, type: "paragraph", content: "Push to git and your site is live. Automatic builds, instant global CDN propagation, zero-downtime deploys.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.15)", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "20px" }, children: [{ id: "", order: 0, type: "paragraph", content: "🔒", styles: { fontSize: "36px", margin: "0" } }, { id: "", order: 1, type: "heading", content: "Enterprise Security", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.03em" } }, { id: "", order: 2, type: "paragraph", content: "SOC 2 Type II, AES-256, TLS 1.3, SSO/SAML and role-based access out of the box.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "20px" }, children: [{ id: "", order: 0, type: "paragraph", content: "📊", styles: { fontSize: "36px", margin: "0" } }, { id: "", order: 1, type: "heading", content: "Real-Time Analytics", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.03em" } }, { id: "", order: 2, type: "paragraph", content: "Page views, conversion funnels, heatmaps, and session recordings — all built in.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.15)", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "column", gap: "20px" }, children: [{ id: "", order: 0, type: "paragraph", content: "🤖", styles: { fontSize: "36px", margin: "0" } }, { id: "", order: 1, type: "heading", content: "AI Assistant", props: { level: 3 }, styles: { fontSize: "24px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.03em" } }, { id: "", order: 2, type: "paragraph", content: "Generate complete pages, write copy, and debug in natural language. Powered by Claude.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } }] },
            { id: "", order: 4, type: "container", content: "", styles: { gridColumn: "span 2", backgroundColor: "rgba(15,23,42,0.6)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "28px", padding: "48px", display: "flex", flexDirection: "row", gap: "40px", alignItems: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "🌍", styles: { fontSize: "56px", margin: "0", flexShrink: "0" } }, { id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [{ id: "", order: 0, type: "heading", content: "170+ Global Edge Locations", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "900", color: "#F8FAFC", margin: "0", letterSpacing: "-0.03em" } }, { id: "", order: 1, type: "paragraph", content: "Sub-10ms response times globally. Automatic failover. Your users always get the fastest experience, wherever they are.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } }] }] },
          ]
        },
      ],
    },
  },

  {
    id: "sb-features-alternating-rows",
    name: "Features — Alternating Rows",
    category: "features",
    designStyle: "minimal",
    description: "Screenshot left + text right alternating layout — the classic high-converting feature walkthrough",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF" },
      children: [{
        id: "", order: 0, type: "container", content: "",
        styles: { maxWidth: "1200px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "0" },
        children: [
          {
            id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px", margin: "0 auto 100px" }, children: [
              { id: "", order: 0, type: "badge", content: "HOW IT WORKS", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
              { id: "", order: 1, type: "heading", content: "One platform.\nEverything you need.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
            ]
          },
          {
            id: "", order: 1, type: "container", content: "",
            props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
            styles: { paddingBottom: "100px" },
            children: [
              { id: "", order: 0, type: "container", content: "", styles: { flex: "1.2", minWidth: "420px", height: "400px", backgroundColor: "#F1F5F9", borderRadius: "28px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "SCREEN PREVIEW", styles: { fontWeight: "900", color: "#CBD5E1", fontSize: "18px" } }] },
              {
                id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", minWidth: "320px" }, children: [
                  { id: "", order: 0, type: "container", content: "", styles: { width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#EEF2FF", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "🎨", styles: { fontSize: "22px", margin: "0" } }] },
                  { id: "", order: 1, type: "heading", content: "Visual editor that thinks like a developer", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em", lineHeight: "1.2" } },
                  { id: "", order: 2, type: "paragraph", content: "Drag, drop, and customize every element visually. Your changes are reflected in clean, production-ready code automatically.", styles: { fontSize: "17px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  {
                    id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                      { id: "", order: 0, type: "paragraph", content: "✓  Real-time collaborative editing", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                      { id: "", order: 1, type: "paragraph", content: "✓  Component library & design tokens", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                      { id: "", order: 2, type: "paragraph", content: "✓  Responsive preview for all devices", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                    ]
                  },
                ]
              },
            ]
          },
          {
            id: "", order: 2, type: "container", content: "",
            props: { _childLayout: "row", _childAlign: "center", _childGap: "xl" },
            styles: { paddingBottom: "100px" },
            children: [
              {
                id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "24px", minWidth: "320px" }, children: [
                  { id: "", order: 0, type: "container", content: "", styles: { width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#ECFDF5", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "🚀", styles: { fontSize: "22px", margin: "0" } }] },
                  { id: "", order: 1, type: "heading", content: "One-click deploy to any cloud", props: { level: 3 }, styles: { fontSize: "32px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em", lineHeight: "1.2" } },
                  { id: "", order: 2, type: "paragraph", content: "Connect your custom domain, configure your environment, and go live globally in under 60 seconds.", styles: { fontSize: "17px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  {
                    id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                      { id: "", order: 0, type: "paragraph", content: "✓  Git-based deployment workflow", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                      { id: "", order: 1, type: "paragraph", content: "✓  Instant rollback to any version", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                      { id: "", order: 2, type: "paragraph", content: "✓  170+ global edge locations", styles: { fontSize: "15px", color: "#334155", margin: "0", fontWeight: "600" } },
                    ]
                  },
                ]
              },
              { id: "", order: 1, type: "container", content: "", styles: { flex: "1.2", minWidth: "420px", height: "400px", backgroundColor: "#F1F5F9", borderRadius: "28px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center" }, children: [{ id: "", order: 0, type: "paragraph", content: "SCREEN PREVIEW", styles: { fontWeight: "900", color: "#CBD5E1", fontSize: "18px" } }] },
            ]
          },
        ],
      }],
    },
  },

  // ─── CTA — NEW ───────────────────────────────────────────────────────────────

  {
    id: "sb-cta-app-download",
    name: "CTA — App Download",
    category: "cta",
    designStyle: "minimal",
    description: "Centered App Store + Google Play download section with device mockup framing",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#0F172A", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px", textAlign: "center", position: "relative", overflow: "hidden" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "600px", height: "600px", backgroundImage: "radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", maxWidth: "640px", position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "badge", content: "AVAILABLE NOW", styles: { backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8", padding: "6px 14px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", border: "1px solid rgba(99,102,241,0.2)" } },
            { id: "", order: 1, type: "heading", content: "Take it\neverywhere.", props: { level: 2 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em", lineHeight: "0.95", whiteSpace: "pre-line" } },
            { id: "", order: 2, type: "paragraph", content: "The BuildStack mobile app is here. Manage your sites, review analytics, and deploy on the go — iOS and Android.", styles: { fontSize: "20px", color: "rgba(255,255,255,0.5)", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "",
          props: { _childLayout: "row", _childAlign: "center", _childJustify: "center", _childGap: "lg" },
          styles: { position: "relative", zIndex: "2" },
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "14px", padding: "14px 28px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", minWidth: "200px" }, children: [{ id: "", order: 0, type: "paragraph", content: "🍎", styles: { fontSize: "28px", margin: "0" } }, { id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "2px" }, children: [{ id: "", order: 0, type: "paragraph", content: "Download on the", styles: { fontSize: "11px", color: "#64748B", margin: "0", fontWeight: "600", letterSpacing: "0.04em" } }, { id: "", order: 1, type: "paragraph", content: "App Store", styles: { fontSize: "20px", color: "#0F172A", margin: "0", fontWeight: "900", letterSpacing: "-0.02em" } }] }] },
            { id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "14px", padding: "14px 28px", display: "flex", alignItems: "center", gap: "14px", cursor: "pointer", minWidth: "200px" }, children: [{ id: "", order: 0, type: "paragraph", content: "▶", styles: { fontSize: "24px", margin: "0", color: "#10B981" } }, { id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "2px" }, children: [{ id: "", order: 0, type: "paragraph", content: "Get it on", styles: { fontSize: "11px", color: "#64748B", margin: "0", fontWeight: "600", letterSpacing: "0.04em" } }, { id: "", order: 1, type: "paragraph", content: "Google Play", styles: { fontSize: "20px", color: "#0F172A", margin: "0", fontWeight: "900", letterSpacing: "-0.02em" } }] }] },
          ]
        },
        { id: "", order: 3, type: "paragraph", content: "Free to download · 4.9★ rating · 50k+ reviews", styles: { fontSize: "14px", color: "rgba(255,255,255,0.3)", margin: "0", position: "relative", zIndex: "2" } },
      ],
    },
  },

  // ─── TESTIMONIALS — NEW ───────────────────────────────────────────────────────

  {
    id: "sb-testimonials-marquee",
    name: "Testimonials — Scrolling Wall",
    category: "testimonials",
    designStyle: "modern",
    description: "Two-row auto-scrolling testimonial marquee — high-density social proof at a glance",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 0", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px", overflow: "hidden" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px", padding: "0 40px" }, children: [
            { id: "", order: 0, type: "badge", content: "WHAT PEOPLE SAY", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "Trusted by teams\naround the world.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          props: { _childLayout: "row", _childGap: "lg", _childAlign: "stretch" },
          styles: { width: "100%", paddingLeft: "40px" },
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "20px", border: "1px solid #E2E8F0", minWidth: "360px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }, children: [{ id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "40px", color: "#6366F1", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } }, { id: "", order: 1, type: "paragraph", content: "We replaced three tools with this one. The ROI in the first month was undeniable.", styles: { fontSize: "16px", color: "#334155", margin: "0", lineHeight: "1.7", fontWeight: "500" } }, { id: "", order: 2, type: "paragraph", content: "— Jordan Lee, VP Engineering @ Stripe", styles: { fontSize: "13px", color: "#6366F1", margin: "0", fontWeight: "700" } }] },
            { id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#0F172A", padding: "32px", borderRadius: "20px", border: "1px solid #1E293B", minWidth: "360px", display: "flex", flexDirection: "column", gap: "16px" }, children: [{ id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "40px", color: "#818CF8", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } }, { id: "", order: 1, type: "paragraph", content: "Deployment time went from 90 minutes to under 3. Our engineers love Friday deploys now.", styles: { fontSize: "16px", color: "#94A3B8", margin: "0", lineHeight: "1.7", fontWeight: "500" } }, { id: "", order: 2, type: "paragraph", content: "— Priya Mehta, CTO @ Shopify", styles: { fontSize: "13px", color: "#818CF8", margin: "0", fontWeight: "700" } }] },
            { id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "20px", border: "1px solid #E2E8F0", minWidth: "360px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }, children: [{ id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "40px", color: "#10B981", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } }, { id: "", order: 1, type: "paragraph", content: "Our entire website now runs faster than it ever did. The edge infrastructure is genuinely world-class.", styles: { fontSize: "16px", color: "#334155", margin: "0", lineHeight: "1.7", fontWeight: "500" } }, { id: "", order: 2, type: "paragraph", content: "— Sam Torres, Head of Platform @ Airbnb", styles: { fontSize: "13px", color: "#10B981", margin: "0", fontWeight: "700" } }] },
            { id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", padding: "32px", borderRadius: "20px", border: "1px solid #E2E8F0", minWidth: "360px", display: "flex", flexDirection: "column", gap: "16px", boxShadow: "0 4px 16px rgba(0,0,0,0.04)" }, children: [{ id: "", order: 0, type: "paragraph", content: "\u201C", styles: { fontSize: "40px", color: "#F59E0B", margin: "0", lineHeight: "1", fontFamily: "Georgia, serif" } }, { id: "", order: 1, type: "paragraph", content: "I was skeptical about no-code tools until I tried this. It generates clean, maintainable code I'd actually ship.", styles: { fontSize: "16px", color: "#334155", margin: "0", lineHeight: "1.7", fontWeight: "500" } }, { id: "", order: 2, type: "paragraph", content: "— Alex Rivera, Staff Engineer @ Linear", styles: { fontSize: "13px", color: "#F59E0B", margin: "0", fontWeight: "700" } }] },
          ]
        },
      ],
    },
  },

  // ─── LANDING — NEW ────────────────────────────────────────────────────────────

  {
    id: "sb-landing-waitlist-dark",
    name: "Landing — Waitlist Dark",
    category: "landing",
    designStyle: "dark",
    description: "Full dark waitlist capture page with countdown, email input, and social proof count",
    element: {
      type: "container", content: "",
      styles: { padding: "200px 40px", backgroundColor: "#000000", display: "flex", flexDirection: "column", alignItems: "center", gap: "56px", textAlign: "center", position: "relative", overflow: "hidden", minHeight: "700px" },
      children: [
        { id: "", order: 0, type: "container", content: "", styles: { position: "absolute", top: "0", left: "50%", transform: "translateX(-50%)", width: "800px", height: "500px", backgroundImage: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.15) 0%, transparent 70%)", pointerEvents: "none" } },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "24px", alignItems: "center", maxWidth: "700px", position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "badge", content: "⏳ LAUNCHING IN", styles: { backgroundColor: "rgba(99,102,241,0.1)", color: "#818CF8", padding: "8px 18px", borderRadius: "9999px", fontSize: "12px", fontWeight: "900", border: "1px solid rgba(99,102,241,0.25)", letterSpacing: "0.1em" } },
            { id: "", order: 1, type: "heading", content: "The future of building\nis almost here.", props: { level: 1 }, styles: { fontSize: "80px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.05em", lineHeight: "0.95", whiteSpace: "pre-line" } },
            { id: "", order: 2, type: "paragraph", content: "We're putting the finishing touches on something that will completely change how you build for the web. Be first to know.", styles: { fontSize: "20px", color: "rgba(255,255,255,0.45)", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 2, type: "form", content: "",
          props: { bgType: "dark", successMessage: "You're on the list! We'll be in touch very soon." },
          styles: { padding: "0", backgroundColor: "transparent", maxWidth: "520px", width: "100%", position: "relative", zIndex: "2" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "stretch", _childGap: "sm" }, styles: {}, children: [
                { id: "", order: 0, type: "input", content: "", props: { inputType: "email", placeholder: "Enter your email…", required: true }, styles: { flex: "1", backgroundColor: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: "#FFFFFF", borderRadius: "12px" } },
                { id: "", order: 1, type: "button", content: "Join waitlist →", props: { submitForm: true, accentColor: "#6366F1" }, styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "0 28px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", whiteSpace: "nowrap", boxShadow: "0 0 24px rgba(99,102,241,0.4)" } },
              ]
            },
          ],
        },
        {
          id: "", order: 3, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "center", _childGap: "xl" }, styles: { position: "relative", zIndex: "2" }, children: [
            { id: "", order: 0, type: "paragraph", content: "2,847 people on the waitlist", styles: { fontSize: "14px", color: "rgba(255,255,255,0.3)", margin: "0" } },
            { id: "", order: 1, type: "paragraph", content: "·", styles: { color: "rgba(255,255,255,0.1)", margin: "0" } },
            { id: "", order: 2, type: "paragraph", content: "Shipping Q2 2026", styles: { fontSize: "14px", color: "rgba(255,255,255,0.3)", margin: "0" } },
            { id: "", order: 3, type: "paragraph", content: "·", styles: { color: "rgba(255,255,255,0.1)", margin: "0" } },
            { id: "", order: 4, type: "paragraph", content: "Free forever tier available", styles: { fontSize: "14px", color: "rgba(255,255,255,0.3)", margin: "0" } },
          ]
        },
      ],
    },
  },

  // ─── CONTENT — NEW ───────────────────────────────────────────────────────────

  {
    id: "sb-content-changelog",
    name: "Content — Changelog Feed",
    category: "content",
    designStyle: "minimal",
    description: "Vertical changelog / release notes feed with version tags, dates, and rich update entries",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", maxWidth: "800px", width: "100%", borderBottom: "1px solid #F1F5F9", paddingBottom: "40px" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                { id: "", order: 0, type: "badge", content: "CHANGELOG", styles: { color: "#6366F1", fontSize: "12px", fontWeight: "800", letterSpacing: "0.1em" } },
                { id: "", order: 1, type: "heading", content: "What's new", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
              ]
            },
            { id: "", order: 1, type: "text-link", content: "Subscribe to updates →", props: { href: "#" }, styles: { fontSize: "14px", fontWeight: "700", color: "#6366F1", textDecoration: "none", whiteSpace: "nowrap" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          styles: { maxWidth: "800px", width: "100%", display: "flex", flexDirection: "column", gap: "0" },
          children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "40px", padding: "48px 0", borderBottom: "1px solid #F8FAFC" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { width: "120px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "8px", paddingTop: "6px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "v3.2.0", styles: { fontSize: "13px", fontWeight: "900", color: "#6366F1", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Apr 10, 2026", styles: { fontSize: "12px", color: "#94A3B8", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" }, styles: {}, children: [
                        { id: "", order: 0, type: "badge", content: "NEW FEATURE", styles: { backgroundColor: "#EEF2FF", color: "#6366F1", padding: "3px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.05em" } },
                        { id: "", order: 1, type: "heading", content: "AI-powered site generation", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                      ]
                    },
                    { id: "", order: 1, type: "paragraph", content: "Generate complete landing pages from a single natural language prompt. Supports all 12 design styles, 200+ section blocks, and real copywriting. Powered by Claude Sonnet.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "40px", padding: "48px 0", borderBottom: "1px solid #F8FAFC" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { width: "120px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "8px", paddingTop: "6px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "v3.1.0", styles: { fontSize: "13px", fontWeight: "900", color: "#10B981", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Mar 28, 2026", styles: { fontSize: "12px", color: "#94A3B8", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" }, styles: {}, children: [
                        { id: "", order: 0, type: "badge", content: "IMPROVEMENT", styles: { backgroundColor: "#ECFDF5", color: "#059669", padding: "3px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.05em" } },
                        { id: "", order: 1, type: "heading", content: "40% faster canvas rendering", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                      ]
                    },
                    { id: "", order: 1, type: "paragraph", content: "Rewrote the canvas render pipeline using virtualized element trees. Complex pages with 200+ elements now render at 60fps consistently.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "40px", padding: "48px 0" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { width: "120px", flexShrink: "0", display: "flex", flexDirection: "column", gap: "8px", paddingTop: "6px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "v3.0.0", styles: { fontSize: "13px", fontWeight: "900", color: "#F59E0B", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Mar 1, 2026", styles: { fontSize: "12px", color: "#94A3B8", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "16px" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childGap: "sm" }, styles: {}, children: [
                        { id: "", order: 0, type: "badge", content: "MAJOR RELEASE", styles: { backgroundColor: "#FFF7ED", color: "#D97706", padding: "3px 10px", borderRadius: "6px", fontSize: "10px", fontWeight: "900", letterSpacing: "0.05em" } },
                        { id: "", order: 1, type: "heading", content: "Complete platform redesign", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                      ]
                    },
                    { id: "", order: 1, type: "paragraph", content: "Version 3.0 brings a completely redesigned editor, 50 new section blocks, real-time collaboration, a component library, and version history.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  // ─── STATS — NEW ─────────────────────────────────────────────────────────────

  {
    id: "sb-stats-trust-grid",
    name: "Stats — Trust & Achievement Grid",
    category: "stats",
    designStyle: "modern",
    description: "Mixed achievement badges + stat cards in a bento grid — builds instant credibility",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#F8FAFC", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px" }, children: [
            { id: "", order: 0, type: "heading", content: "The numbers\nspeak for themselves.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.05", whiteSpace: "pre-line" } },
            { id: "", order: 1, type: "paragraph", content: "Built for scale. Trusted by the world's fastest-moving teams.", styles: { fontSize: "18px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "",
          styles: { maxWidth: "1280px", width: "100%", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "20px" },
          children: [
            { id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "40px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 1" }, children: [{ id: "", order: 0, type: "heading", content: "12k+", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#6366F1", margin: "0", letterSpacing: "-0.05em" } }, { id: "", order: 1, type: "paragraph", content: "Teams worldwide", styles: { fontSize: "14px", color: "#64748B", margin: "0", fontWeight: "600" } }] },
            { id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "40px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px" }, children: [{ id: "", order: 0, type: "heading", content: "99.99%", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#10B981", margin: "0", letterSpacing: "-0.05em" } }, { id: "", order: 1, type: "paragraph", content: "Uptime SLA", styles: { fontSize: "14px", color: "#64748B", margin: "0", fontWeight: "600" } }] },
            { id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#0F172A", borderRadius: "24px", padding: "40px", display: "flex", flexDirection: "column", gap: "16px", gridColumn: "span 2", backgroundImage: "linear-gradient(135deg, #1E1B4B 0%, #0F172A 100%)" }, children: [{ id: "", order: 0, type: "badge", content: "★  #1 PRODUCT HUNT 2026", styles: { backgroundColor: "rgba(99,102,241,0.2)", color: "#818CF8", padding: "5px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content", border: "1px solid rgba(99,102,241,0.3)" } }, { id: "", order: 1, type: "heading", content: "Product of\nthe Year", props: { level: 3 }, styles: { fontSize: "36px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em", lineHeight: "1.1", whiteSpace: "pre-line" } }, { id: "", order: 2, type: "paragraph", content: "Voted by 50,000+ members of the Product Hunt community.", styles: { fontSize: "14px", color: "#64748B", margin: "0", lineHeight: "1.6" } }] },
            { id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "40px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px" }, children: [{ id: "", order: 0, type: "heading", content: "<10ms", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#F59E0B", margin: "0", letterSpacing: "-0.05em" } }, { id: "", order: 1, type: "paragraph", content: "Global latency", styles: { fontSize: "14px", color: "#64748B", margin: "0", fontWeight: "600" } }] },
            { id: "", order: 4, type: "container", content: "", styles: { backgroundColor: "#FFFFFF", borderRadius: "24px", padding: "40px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px" }, children: [{ id: "", order: 0, type: "heading", content: "4.9/5", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#EC4899", margin: "0", letterSpacing: "-0.05em" } }, { id: "", order: 1, type: "paragraph", content: "★★★★★ on G2", styles: { fontSize: "14px", color: "#64748B", margin: "0", fontWeight: "600" } }] },
            { id: "", order: 5, type: "container", content: "", styles: { backgroundColor: "#EEF2FF", borderRadius: "24px", padding: "40px", border: "1px solid #C7D2FE", display: "flex", flexDirection: "column", gap: "8px", gridColumn: "span 2" }, children: [{ id: "", order: 0, type: "badge", content: "SOC 2 TYPE II CERTIFIED", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "5px 12px", borderRadius: "9999px", fontSize: "11px", fontWeight: "900", width: "fit-content" } }, { id: "", order: 1, type: "paragraph", content: "Your data is protected by the highest security standards. AES-256 encryption, TLS 1.3 transit, and annual third-party audits.", styles: { fontSize: "15px", color: "#334155", margin: "0", lineHeight: "1.6", marginTop: "8px" } }] },
          ]
        },
      ],
    },
  },

  // ─── PRICING — NEW ───────────────────────────────────────────────────────────

  {
    id: "sb-pricing-comparison",
    name: "Pricing — Feature Comparison",
    category: "pricing",
    designStyle: "minimal",
    description: "Detailed feature comparison table across all three tiers — helps buyers make confident decisions",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "64px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "640px" }, children: [
            { id: "", order: 0, type: "heading", content: "Compare plans", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.04em" } },
            { id: "", order: 1, type: "paragraph", content: "Everything you get on each plan, no surprises.", styles: { fontSize: "18px", color: "#64748B", margin: "0" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "900px", width: "100%", border: "1px solid #E2E8F0", borderRadius: "24px", overflow: "hidden" }, children: [
            { id: "", order: 0, type: "container", content: "", props: { _childLayout: "row" }, styles: { borderBottom: "1px solid #E2E8F0", backgroundColor: "#F8FAFC" }, children: [{ id: "", order: 0, type: "paragraph", content: "Feature", styles: { flex: "2", padding: "20px 28px", fontSize: "13px", fontWeight: "700", color: "#64748B", margin: "0", letterSpacing: "0.05em", textTransform: "uppercase" } }, { id: "", order: 1, type: "paragraph", content: "Starter", styles: { flex: "1", padding: "20px", fontSize: "13px", fontWeight: "800", color: "#64748B", margin: "0", textAlign: "center" } }, { id: "", order: 2, type: "paragraph", content: "Pro", styles: { flex: "1", padding: "20px", fontSize: "13px", fontWeight: "900", color: "#6366F1", margin: "0", textAlign: "center" } }, { id: "", order: 3, type: "paragraph", content: "Enterprise", styles: { flex: "1", padding: "20px", fontSize: "13px", fontWeight: "800", color: "#64748B", margin: "0", textAlign: "center" } }] },
            { id: "", order: 1, type: "container", content: "", props: { _childLayout: "row" }, styles: { borderBottom: "1px solid #F1F5F9", backgroundColor: "#FFFFFF" }, children: [{ id: "", order: 0, type: "paragraph", content: "Projects", styles: { flex: "2", padding: "18px 28px", fontSize: "14px", color: "#334155", margin: "0", fontWeight: "500" } }, { id: "", order: 1, type: "paragraph", content: "3", styles: { flex: "1", padding: "18px", fontSize: "14px", color: "#64748B", margin: "0", textAlign: "center" } }, { id: "", order: 2, type: "paragraph", content: "Unlimited", styles: { flex: "1", padding: "18px", fontSize: "14px", color: "#6366F1", margin: "0", textAlign: "center", fontWeight: "700" } }, { id: "", order: 3, type: "paragraph", content: "Unlimited", styles: { flex: "1", padding: "18px", fontSize: "14px", color: "#64748B", margin: "0", textAlign: "center" } }] },
            { id: "", order: 2, type: "container", content: "", props: { _childLayout: "row" }, styles: { borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }, children: [{ id: "", order: 0, type: "paragraph", content: "Custom domains", styles: { flex: "2", padding: "18px 28px", fontSize: "14px", color: "#334155", margin: "0", fontWeight: "500" } }, { id: "", order: 1, type: "paragraph", content: "—", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#CBD5E1", margin: "0", textAlign: "center" } }, { id: "", order: 2, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#6366F1", margin: "0", textAlign: "center", fontWeight: "900" } }, { id: "", order: 3, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#10B981", margin: "0", textAlign: "center", fontWeight: "900" } }] },
            { id: "", order: 3, type: "container", content: "", props: { _childLayout: "row" }, styles: { borderBottom: "1px solid #F1F5F9", backgroundColor: "#FFFFFF" }, children: [{ id: "", order: 0, type: "paragraph", content: "AI assistant", styles: { flex: "2", padding: "18px 28px", fontSize: "14px", color: "#334155", margin: "0", fontWeight: "500" } }, { id: "", order: 1, type: "paragraph", content: "—", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#CBD5E1", margin: "0", textAlign: "center" } }, { id: "", order: 2, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#6366F1", margin: "0", textAlign: "center", fontWeight: "900" } }, { id: "", order: 3, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#10B981", margin: "0", textAlign: "center", fontWeight: "900" } }] },
            { id: "", order: 4, type: "container", content: "", props: { _childLayout: "row" }, styles: { borderBottom: "1px solid #F1F5F9", backgroundColor: "#FAFAFA" }, children: [{ id: "", order: 0, type: "paragraph", content: "Priority support", styles: { flex: "2", padding: "18px 28px", fontSize: "14px", color: "#334155", margin: "0", fontWeight: "500" } }, { id: "", order: 1, type: "paragraph", content: "—", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#CBD5E1", margin: "0", textAlign: "center" } }, { id: "", order: 2, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#6366F1", margin: "0", textAlign: "center", fontWeight: "900" } }, { id: "", order: 3, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#10B981", margin: "0", textAlign: "center", fontWeight: "900" } }] },
            { id: "", order: 5, type: "container", content: "", props: { _childLayout: "row" }, styles: { borderBottom: "1px solid #F1F5F9", backgroundColor: "#FFFFFF" }, children: [{ id: "", order: 0, type: "paragraph", content: "SSO / SAML", styles: { flex: "2", padding: "18px 28px", fontSize: "14px", color: "#334155", margin: "0", fontWeight: "500" } }, { id: "", order: 1, type: "paragraph", content: "—", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#CBD5E1", margin: "0", textAlign: "center" } }, { id: "", order: 2, type: "paragraph", content: "—", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#CBD5E1", margin: "0", textAlign: "center" } }, { id: "", order: 3, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#10B981", margin: "0", textAlign: "center", fontWeight: "900" } }] },
            { id: "", order: 6, type: "container", content: "", props: { _childLayout: "row" }, styles: { backgroundColor: "#FAFAFA" }, children: [{ id: "", order: 0, type: "paragraph", content: "Dedicated SLA", styles: { flex: "2", padding: "18px 28px", fontSize: "14px", color: "#334155", margin: "0", fontWeight: "500" } }, { id: "", order: 1, type: "paragraph", content: "—", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#CBD5E1", margin: "0", textAlign: "center" } }, { id: "", order: 2, type: "paragraph", content: "—", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#CBD5E1", margin: "0", textAlign: "center" } }, { id: "", order: 3, type: "paragraph", content: "✓", styles: { flex: "1", padding: "18px", fontSize: "16px", color: "#10B981", margin: "0", textAlign: "center", fontWeight: "900" } }] },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "", props: { _childLayout: "row", _childAlign: "center", _childJustify: "center", _childGap: "lg" }, styles: {}, children: [
            { id: "", order: 0, type: "button", content: "Start free", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "16px 36px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer" } },
            { id: "", order: 1, type: "button", content: "Talk to sales", styles: { backgroundColor: "transparent", color: "#374151", padding: "16px 36px", borderRadius: "12px", fontWeight: "600", fontSize: "16px", cursor: "pointer", border: "1.5px solid #E2E8F0" } },
          ]
        },
      ],
    },
  },

  // ── SaaS: Feature Wall Dark ──────────────────────────────────────────────────
  {
    id: "sb-saas-feature-wall",
    name: "SaaS — Feature Wall",
    category: "saas",
    designStyle: "dark",
    description: "Dark 6-card feature wall with icons and subtle grid glow",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#020817", display: "flex", flexDirection: "column", alignItems: "center", gap: "72px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "20px", maxWidth: "680px", alignItems: "center" }, children: [
            { id: "", order: 0, type: "paragraph", content: "PLATFORM", styles: { fontSize: "11px", fontWeight: "800", letterSpacing: "0.18em", color: "#6366F1", margin: "0" } },
            { id: "", order: 1, type: "heading", content: "Everything your team needs to ship", props: { level: 2 }, styles: { fontSize: "56px", fontWeight: "900", color: "#F8FAFC", margin: "0", lineHeight: "1.1", letterSpacing: "-0.04em" } },
            { id: "", order: 2, type: "paragraph", content: "One platform. Every tool. From idea to production in minutes, not months.", styles: { fontSize: "18px", color: "#94A3B8", margin: "0", lineHeight: "1.7" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1px", maxWidth: "1100px", width: "100%", backgroundColor: "rgba(255,255,255,0.06)", borderRadius: "24px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.06)" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#020817", padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "⚡", styles: { fontSize: "32px", margin: "0", lineHeight: "1" } },
                { id: "", order: 1, type: "heading", content: "Instant deploy", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Push to git, ship in seconds. Zero config. Automatic rollbacks if anything breaks.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#020817", padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🔒", styles: { fontSize: "32px", margin: "0", lineHeight: "1" } },
                { id: "", order: 1, type: "heading", content: "Enterprise security", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "SOC 2 Type II, GDPR compliant. SSO, RBAC, and audit logs built in from day one.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#020817", padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🧠", styles: { fontSize: "32px", margin: "0", lineHeight: "1" } },
                { id: "", order: 1, type: "heading", content: "AI-native", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Co-pilot mode writes components, suggests layouts, and auto-optimizes performance as you build.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "#020817", padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "📊", styles: { fontSize: "32px", margin: "0", lineHeight: "1" } },
                { id: "", order: 1, type: "heading", content: "Analytics & insights", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "Real-time traffic, conversion funnels, heatmaps, and A/B testing — all in one dashboard.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 4, type: "container", content: "", styles: { backgroundColor: "#020817", padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🌐", styles: { fontSize: "32px", margin: "0", lineHeight: "1" } },
                { id: "", order: 1, type: "heading", content: "Global edge network", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "200+ edge locations. 99.99% SLA. Your content loads in under 50ms anywhere on Earth.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
              ]
            },
            {
              id: "", order: 5, type: "container", content: "", styles: { backgroundColor: "#020817", padding: "44px 36px", display: "flex", flexDirection: "column", gap: "20px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🔌", styles: { fontSize: "32px", margin: "0", lineHeight: "1" } },
                { id: "", order: 1, type: "heading", content: "Ecosystem integrations", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "700", color: "#F8FAFC", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "240+ native integrations. Stripe, Notion, Slack, GitHub, Figma, and a full REST API.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
              ]
            },
          ]
        },
        { id: "", order: 2, type: "button", content: "Explore all features →", styles: { backgroundColor: "transparent", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.1)", padding: "14px 32px", borderRadius: "12px", fontWeight: "600", fontSize: "15px", cursor: "pointer" } },
      ],
    },
  },

  // ── SaaS: API Preview ────────────────────────────────────────────────────────
  {
    id: "sb-saas-api-preview",
    name: "SaaS — API Preview",
    category: "saas",
    designStyle: "dark",
    description: "Developer-first split section: copy on left, animated code terminal on right",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#0B0F1A", display: "flex", flexDirection: "row", alignItems: "center", gap: "80px", maxWidth: "1200px", margin: "0 auto" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "28px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "DEVELOPER API", styles: { fontSize: "11px", fontWeight: "800", letterSpacing: "0.18em", color: "#818CF8", margin: "0" } },
            { id: "", order: 1, type: "heading", content: "Build on BuildStack in minutes", props: { level: 2 }, styles: { fontSize: "48px", fontWeight: "900", color: "#F1F5F9", margin: "0", lineHeight: "1.1", letterSpacing: "-0.04em" } },
            { id: "", order: 2, type: "paragraph", content: "A clean, predictable REST API with SDKs for TypeScript, Python, and Go. Ship integrations in an afternoon, not a sprint.", styles: { fontSize: "17px", color: "#64748B", margin: "0", lineHeight: "1.7", maxWidth: "460px" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓", styles: { width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "rgba(99,102,241,0.15)", color: "#818CF8", fontSize: "13px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", margin: "0", flexShrink: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "99.99% uptime SLA with real-time status page", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓", styles: { width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "rgba(99,102,241,0.15)", color: "#818CF8", fontSize: "13px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", margin: "0", flexShrink: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Webhooks, streaming, and batch endpoints", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓", styles: { width: "22px", height: "22px", borderRadius: "50%", backgroundColor: "rgba(99,102,241,0.15)", color: "#818CF8", fontSize: "13px", fontWeight: "900", display: "flex", alignItems: "center", justifyContent: "center", margin: "0", flexShrink: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Full OpenAPI spec + interactive playground", styles: { fontSize: "15px", color: "#CBD5E1", margin: "0" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 4, type: "container", content: "", props: { _childLayout: "row", _childGap: "sm" }, styles: { display: "flex", flexDirection: "row", gap: "12px" }, children: [
                { id: "", order: 0, type: "button", content: "Read the docs", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "14px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", cursor: "pointer" } },
                { id: "", order: 1, type: "button", content: "Get API key →", styles: { backgroundColor: "transparent", color: "#94A3B8", border: "1px solid rgba(255,255,255,0.1)", padding: "14px 28px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: "pointer" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", backgroundColor: "#0D1117", borderRadius: "20px", overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#161B22", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: "8px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "●", styles: { color: "#FF5F56", fontSize: "12px", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "●", styles: { color: "#FFBD2E", fontSize: "12px", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "●", styles: { color: "#27C93F", fontSize: "12px", margin: "0" } },
                { id: "", order: 3, type: "paragraph", content: "generate.ts", styles: { fontSize: "12px", color: "#64748B", margin: "0 auto", fontFamily: "'JetBrains Mono', monospace" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { padding: "28px 28px 36px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "import { BuildStack } from '@buildstack/sdk';", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#64748B", margin: "0 0 6px", display: "block" } },
                { id: "", order: 1, type: "paragraph", content: " ", styles: { margin: "0 0 6px", display: "block", fontSize: "13px" } },
                { id: "", order: 2, type: "paragraph", content: "const client = new BuildStack({", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#E2E8F0", margin: "0 0 6px", display: "block" } },
                { id: "", order: 3, type: "paragraph", content: "  apiKey: process.env.BS_API_KEY,", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#E2E8F0", margin: "0 0 6px", paddingLeft: "12px", display: "block" } },
                { id: "", order: 4, type: "paragraph", content: "});", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#E2E8F0", margin: "0 0 18px", display: "block" } },
                { id: "", order: 5, type: "paragraph", content: "const site = await client.sites.generate({", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#E2E8F0", margin: "0 0 6px", display: "block" } },
                { id: "", order: 6, type: "paragraph", content: "  prompt: 'SaaS landing page for a dev tool',", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#818CF8", margin: "0 0 6px", paddingLeft: "12px", display: "block" } },
                { id: "", order: 7, type: "paragraph", content: "  style: 'modern',", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#818CF8", margin: "0 0 6px", paddingLeft: "12px", display: "block" } },
                { id: "", order: 8, type: "paragraph", content: "  sections: ['hero', 'features', 'pricing'],", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#818CF8", margin: "0 0 6px", paddingLeft: "12px", display: "block" } },
                { id: "", order: 9, type: "paragraph", content: "});", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#E2E8F0", margin: "0 0 18px", display: "block" } },
                { id: "", order: 10, type: "paragraph", content: "// → { id, url, html, sections[] }", styles: { fontFamily: "'JetBrains Mono', monospace", fontSize: "13px", color: "#334155", margin: "0", display: "block" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ── Landing: Startup Dark ────────────────────────────────────────────────────
  {
    id: "sb-landing-startup-dark",
    name: "Landing — Startup Dark",
    category: "landing",
    designStyle: "dark",
    description: "Dramatic dark startup landing with radial gradient hero, social proof, and dual CTA",
    element: {
      type: "container", content: "",
      styles: { padding: "0", backgroundColor: "#050A14", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { padding: "160px 40px 120px", display: "flex", flexDirection: "column", alignItems: "center", gap: "32px", textAlign: "center", maxWidth: "900px", width: "100%", position: "relative" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "inline-flex", alignItems: "center", gap: "8px", backgroundColor: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.3)", borderRadius: "9999px", padding: "6px 16px 6px 6px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "🎉 Series A", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", borderRadius: "9999px", padding: "2px 10px", fontSize: "11px", fontWeight: "800", margin: "0", letterSpacing: "0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "$18M raised to build the future of web creation", styles: { fontSize: "12px", color: "#A5B4FC", margin: "0", fontWeight: "600" } },
              ]
            },
            { id: "", order: 1, type: "heading", content: "Stop coding websites. Start shipping products.", props: { level: 1 }, styles: { fontSize: "72px", fontWeight: "900", color: "#FFFFFF", margin: "0", lineHeight: "1.05", letterSpacing: "-0.05em", maxWidth: "780px" } },
            { id: "", order: 2, type: "paragraph", content: "BuildStack is the visual development platform that lets founders move 10x faster — from idea to live, production-ready website in under an hour.", styles: { fontSize: "20px", color: "#64748B", margin: "0", lineHeight: "1.7", maxWidth: "580px" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "row", gap: "12px", alignItems: "center", justifyContent: "center", flexWrap: "wrap" }, children: [
                { id: "", order: 0, type: "button", content: "Start building free →", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "18px 40px", borderRadius: "14px", fontWeight: "800", fontSize: "17px", cursor: "pointer", boxShadow: "0 0 40px rgba(99,102,241,0.4)" } },
                { id: "", order: 1, type: "button", content: "Watch demo  ▶", styles: { backgroundColor: "rgba(255,255,255,0.05)", color: "#CBD5E1", border: "1px solid rgba(255,255,255,0.1)", padding: "18px 36px", borderRadius: "14px", fontWeight: "600", fontSize: "17px", cursor: "pointer" } },
              ]
            },
            {
              id: "", order: 4, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap", justifyContent: "center" }, children: [
                { id: "", order: 0, type: "paragraph", content: "★★★★★  4.9 on G2", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "600" } },
                { id: "", order: 1, type: "paragraph", content: "·", styles: { color: "#1E293B", fontSize: "20px", margin: "0" } },
                { id: "", order: 2, type: "paragraph", content: "24,000+ teams trust BuildStack", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "600" } },
                { id: "", order: 3, type: "paragraph", content: "·", styles: { color: "#1E293B", fontSize: "20px", margin: "0" } },
                { id: "", order: 4, type: "paragraph", content: "No credit card required", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "600" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "1100px", width: "100%", padding: "0 40px 120px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1px", backgroundColor: "rgba(255,255,255,0.05)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { backgroundColor: "#050A14", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                { id: "", order: 0, type: "heading", content: "2.4B+", props: { level: 3 }, styles: { fontSize: "40px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Pages generated", styles: { fontSize: "14px", color: "#475569", margin: "0", fontWeight: "500" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { backgroundColor: "#050A14", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                { id: "", order: 0, type: "heading", content: "24k", props: { level: 3 }, styles: { fontSize: "40px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Active teams", styles: { fontSize: "14px", color: "#475569", margin: "0", fontWeight: "500" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { backgroundColor: "#050A14", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                { id: "", order: 0, type: "heading", content: "99.99%", props: { level: 3 }, styles: { fontSize: "40px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Uptime SLA", styles: { fontSize: "14px", color: "#475569", margin: "0", fontWeight: "500" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { backgroundColor: "#050A14", padding: "40px 32px", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                { id: "", order: 0, type: "heading", content: "<50ms", props: { level: 3 }, styles: { fontSize: "40px", fontWeight: "900", color: "#FFFFFF", margin: "0", letterSpacing: "-0.04em" } },
                { id: "", order: 1, type: "paragraph", content: "Global latency", styles: { fontSize: "14px", color: "#475569", margin: "0", fontWeight: "500" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ── Landing: Creator / Personal Brand ────────────────────────────────────────
  {
    id: "sb-landing-creator",
    name: "Landing — Creator / Personal Brand",
    category: "landing",
    designStyle: "minimal",
    description: "Clean minimal personal brand landing with large name, bio, and featured work",
    element: {
      type: "container", content: "",
      styles: { padding: "120px 40px", backgroundColor: "#FAFAF9", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "760px", width: "100%", display: "flex", flexDirection: "column", gap: "28px" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "20px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { width: "64px", height: "64px", borderRadius: "50%", backgroundColor: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "JL", styles: { fontSize: "22px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "2px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Jordan Lee", styles: { fontSize: "17px", fontWeight: "700", color: "#1C1917", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Designer, builder, occasional writer", styles: { fontSize: "14px", color: "#78716C", margin: "0" } },
                  ]
                },
              ]
            },
            { id: "", order: 1, type: "heading", content: "I help startups find their visual identity.", props: { level: 1 }, styles: { fontSize: "64px", fontWeight: "900", color: "#1C1917", margin: "0", lineHeight: "1.1", letterSpacing: "-0.05em" } },
            { id: "", order: 2, type: "paragraph", content: "10 years of crafting brands, design systems, and web experiences for companies from seed-stage to IPO. Currently open for new projects.", styles: { fontSize: "19px", color: "#78716C", margin: "0", lineHeight: "1.7" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", gap: "12px", flexWrap: "wrap" }, children: [
                { id: "", order: 0, type: "button", content: "See my work", styles: { backgroundColor: "#1C1917", color: "#FFFFFF", padding: "14px 28px", borderRadius: "10px", fontWeight: "700", fontSize: "15px", cursor: "pointer" } },
                { id: "", order: 1, type: "button", content: "Get in touch", styles: { backgroundColor: "transparent", color: "#57534E", border: "1.5px solid #D6D3D1", padding: "14px 28px", borderRadius: "10px", fontWeight: "600", fontSize: "15px", cursor: "pointer" } },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "760px", width: "100%", display: "flex", flexDirection: "column", gap: "16px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "SELECTED WORK", styles: { fontSize: "11px", fontWeight: "800", letterSpacing: "0.14em", color: "#A8A29E", margin: "0 0 8px" } },
            {
              id: "", order: 1, type: "container", content: "", styles: { borderTop: "1px solid #E7E5E4", paddingTop: "28px", display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "28px", borderBottom: "1px solid #E7E5E4" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Meridian Bank — Brand Identity", styles: { fontSize: "18px", fontWeight: "700", color: "#1C1917", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Branding · 2025", styles: { fontSize: "14px", color: "#A8A29E", margin: "0" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph", content: "↗", styles: { fontSize: "22px", color: "#A8A29E", margin: "0", cursor: "pointer" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "28px", borderBottom: "1px solid #E7E5E4" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Aero Health — Design System", styles: { fontSize: "18px", fontWeight: "700", color: "#1C1917", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Design Systems · 2024", styles: { fontSize: "14px", color: "#A8A29E", margin: "0" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph", content: "↗", styles: { fontSize: "22px", color: "#A8A29E", margin: "0", cursor: "pointer" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "28px", borderBottom: "1px solid #E7E5E4" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Volt Commerce — Website Redesign", styles: { fontSize: "18px", fontWeight: "700", color: "#1C1917", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Web Design · 2024", styles: { fontSize: "14px", color: "#A8A29E", margin: "0" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph", content: "↗", styles: { fontSize: "22px", color: "#A8A29E", margin: "0", cursor: "pointer" } },
              ]
            },
          ]
        },
      ],
    },
  },

  // ── Services: Process Steps ──────────────────────────────────────────────────
  {
    id: "sb-services-process-steps",
    name: "Services — Process Steps",
    category: "services",
    designStyle: "modern",
    description: "Numbered vertical process steps with connecting line and rich descriptions",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "HOW WE WORK", styles: { fontSize: "11px", fontWeight: "800", letterSpacing: "0.18em", color: "#6366F1", margin: "0" } },
            { id: "", order: 1, type: "heading", content: "A process built for results", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", lineHeight: "1.1", letterSpacing: "-0.04em" } },
            { id: "", order: 2, type: "paragraph", content: "We work in focused sprints with clear deliverables at every stage, so you always know what's happening and what's next.", styles: { fontSize: "18px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "760px", width: "100%", display: "flex", flexDirection: "column", gap: "0" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "32px", paddingBottom: "48px", position: "relative" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0", flexShrink: "0" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", styles: { width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#6366F1", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "01", styles: { fontSize: "16px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
                      ]
                    },
                    { id: "", order: 1, type: "paragraph", content: " ", styles: { width: "2px", flex: "1", backgroundColor: "#E2E8F0", margin: "0", minHeight: "40px", display: "block" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { paddingTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Discovery & Strategy", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "We start by deeply understanding your business, users, and competitive landscape. This 2-week phase ends with a detailed strategy document and agreed success metrics.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                    { id: "", order: 2, type: "paragraph", content: "Deliverables: Brand brief · Audience personas · Competitor audit · Project roadmap", styles: { fontSize: "13px", color: "#94A3B8", margin: "0", fontStyle: "italic" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", gap: "32px", paddingBottom: "48px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0", flexShrink: "0" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", styles: { width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#8B5CF6", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "02", styles: { fontSize: "16px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
                      ]
                    },
                    { id: "", order: 1, type: "paragraph", content: " ", styles: { width: "2px", flex: "1", backgroundColor: "#E2E8F0", margin: "0", minHeight: "40px", display: "block" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { paddingTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Design & Prototyping", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "High-fidelity Figma designs, interactive prototypes, and design system tokens. We iterate until every pixel earns its place.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                    { id: "", order: 2, type: "paragraph", content: "Deliverables: Design system · Mobile + desktop mockups · Interactive prototype · Dev handoff", styles: { fontSize: "13px", color: "#94A3B8", margin: "0", fontStyle: "italic" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "32px", paddingBottom: "48px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", alignItems: "center", gap: "0", flexShrink: "0" }, children: [
                    {
                      id: "", order: 0, type: "container", content: "", styles: { width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#EC4899", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [
                        { id: "", order: 0, type: "paragraph", content: "03", styles: { fontSize: "16px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
                      ]
                    },
                    { id: "", order: 1, type: "paragraph", content: " ", styles: { width: "2px", flex: "1", backgroundColor: "#E2E8F0", margin: "0", minHeight: "40px", display: "block" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { paddingTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Development & Build", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Clean, scalable code using modern frameworks. Every component is tested, accessible, and performance-optimized before shipping.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                    { id: "", order: 2, type: "paragraph", content: "Deliverables: Production codebase · QA test suite · Lighthouse 95+ score · Staging environment", styles: { fontSize: "13px", color: "#94A3B8", margin: "0", fontStyle: "italic" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", gap: "32px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { width: "52px", height: "52px", borderRadius: "16px", backgroundColor: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: "0" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "04", styles: { fontSize: "16px", fontWeight: "900", color: "#FFFFFF", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { paddingTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Launch & Grow", props: { level: 3 }, styles: { fontSize: "22px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "We handle deployment, set up monitoring and analytics, and stay on for 30 days post-launch to ensure everything performs as expected.", styles: { fontSize: "16px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
                    { id: "", order: 2, type: "paragraph", content: "Deliverables: Live deployment · Analytics dashboard · 30-day support · Growth recommendations", styles: { fontSize: "13px", color: "#94A3B8", margin: "0", fontStyle: "italic" } },
                  ]
                },
              ]
            },
          ]
        },
        { id: "", order: 2, type: "button", content: "Start a project →", styles: { backgroundColor: "#0F172A", color: "#FFFFFF", padding: "16px 36px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer" } },
      ],
    },
  },

  // ── Portfolio: Editorial Case Study ─────────────────────────────────────────
  {
    id: "sb-portfolio-editorial",
    name: "Portfolio — Editorial Case Study",
    category: "portfolio",
    designStyle: "minimal",
    description: "Magazine-style case study listing with large numbers and editorial typography",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FFFFFF", display: "flex", flexDirection: "column", alignItems: "center", gap: "80px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { maxWidth: "1100px", width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #0F172A", paddingBottom: "28px" }, children: [
            { id: "", order: 0, type: "heading", content: "Selected Work", props: { level: 2 }, styles: { fontSize: "64px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.05em", lineHeight: "1" } },
            { id: "", order: 1, type: "paragraph", content: "2022 — 2026", styles: { fontSize: "14px", color: "#94A3B8", margin: "0", fontWeight: "500" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "1100px", width: "100%", display: "flex", flexDirection: "column", gap: "0" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "40px", padding: "44px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }, children: [
                { id: "", order: 0, type: "paragraph", content: "01", styles: { fontSize: "13px", fontWeight: "800", color: "#CBD5E1", margin: "0", letterSpacing: "0.06em", minWidth: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "6px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Apex Financial — Complete Brand Overhaul", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "0", lineHeight: "1.2" } },
                    { id: "", order: 1, type: "paragraph", content: "A full rebrand for a $2B fintech company entering the consumer market — new identity, website, and 60+ marketing assets.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Branding", styles: { fontSize: "12px", backgroundColor: "#F1F5F9", color: "#64748B", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                    { id: "", order: 1, type: "paragraph", content: "Fintech", styles: { fontSize: "12px", backgroundColor: "#F1F5F9", color: "#64748B", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                  ]
                },
                { id: "", order: 3, type: "paragraph", content: "↗", styles: { fontSize: "24px", color: "#CBD5E1", margin: "0", flexShrink: "0" } },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "40px", padding: "44px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }, children: [
                { id: "", order: 0, type: "paragraph", content: "02", styles: { fontSize: "13px", fontWeight: "800", color: "#CBD5E1", margin: "0", letterSpacing: "0.06em", minWidth: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "6px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Solara — SaaS Platform UI Design", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "0", lineHeight: "1.2" } },
                    { id: "", order: 1, type: "paragraph", content: "Designed the entire product UX from scratch for a B2B analytics tool — resulting in 47% reduction in onboarding time.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Product Design", styles: { fontSize: "12px", backgroundColor: "#EEF2FF", color: "#6366F1", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                    { id: "", order: 1, type: "paragraph", content: "SaaS", styles: { fontSize: "12px", backgroundColor: "#F1F5F9", color: "#64748B", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                  ]
                },
                { id: "", order: 3, type: "paragraph", content: "↗", styles: { fontSize: "24px", color: "#CBD5E1", margin: "0", flexShrink: "0" } },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "40px", padding: "44px 0", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }, children: [
                { id: "", order: 0, type: "paragraph", content: "03", styles: { fontSize: "13px", fontWeight: "800", color: "#CBD5E1", margin: "0", letterSpacing: "0.06em", minWidth: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "6px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Nova Collective — Editorial Web Platform", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "0", lineHeight: "1.2" } },
                    { id: "", order: 1, type: "paragraph", content: "Custom CMS + publishing platform for a media company reaching 2.8M monthly readers across 5 verticals.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Web Design", styles: { fontSize: "12px", backgroundColor: "#F0FDF4", color: "#16A34A", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                    { id: "", order: 1, type: "paragraph", content: "Media", styles: { fontSize: "12px", backgroundColor: "#F1F5F9", color: "#64748B", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                  ]
                },
                { id: "", order: 3, type: "paragraph", content: "↗", styles: { fontSize: "24px", color: "#CBD5E1", margin: "0", flexShrink: "0" } },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "40px", padding: "44px 0", cursor: "pointer" }, children: [
                { id: "", order: 0, type: "paragraph", content: "04", styles: { fontSize: "13px", fontWeight: "800", color: "#CBD5E1", margin: "0", letterSpacing: "0.06em", minWidth: "28px" } },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "6px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Orbit — Mobile App Design System", props: { level: 3 }, styles: { fontSize: "28px", fontWeight: "800", color: "#0F172A", margin: "0", lineHeight: "1.2" } },
                    { id: "", order: 1, type: "paragraph", content: "Built a cross-platform design system used by 6 squads, covering 800+ components and 12 theme tokens.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "flex-end" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Design Systems", styles: { fontSize: "12px", backgroundColor: "#FFF7ED", color: "#EA580C", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                    { id: "", order: 1, type: "paragraph", content: "Mobile", styles: { fontSize: "12px", backgroundColor: "#F1F5F9", color: "#64748B", padding: "4px 12px", borderRadius: "9999px", margin: "0", fontWeight: "600" } },
                  ]
                },
                { id: "", order: 3, type: "paragraph", content: "↗", styles: { fontSize: "24px", color: "#CBD5E1", margin: "0", flexShrink: "0" } },
              ]
            },
          ]
        },
        {
          id: "", order: 2, type: "container", content: "", styles: { maxWidth: "1100px", width: "100%", display: "flex", justifyContent: "flex-end" }, children: [
            { id: "", order: 0, type: "button", content: "View full archive →", styles: { backgroundColor: "transparent", color: "#64748B", border: "1.5px solid #E2E8F0", padding: "13px 28px", borderRadius: "10px", fontWeight: "600", fontSize: "14px", cursor: "pointer" } },
          ]
        },
      ],
    },
  },

  // ── Hero: Gradient Split ─────────────────────────────────────────────────────
  {
    id: "sb-hero-gradient-split",
    name: "Hero — Gradient Split",
    category: "hero",
    designStyle: "modern",
    description: "Asymmetric hero with rich indigo-to-violet gradient left panel and white right panel with content",
    element: {
      type: "container", content: "",
      styles: { display: "flex", flexDirection: "row", minHeight: "100vh", backgroundColor: "#FFFFFF" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { flex: "1", background: "linear-gradient(145deg, #4F46E5 0%, #7C3AED 50%, #A855F7 100%)", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "80px 60px", gap: "40px", position: "relative", overflow: "hidden" }, children: [
            { id: "", order: 0, type: "paragraph", content: "BUILDSTACK", styles: { fontSize: "11px", fontWeight: "900", letterSpacing: "0.24em", color: "rgba(255,255,255,0.5)", margin: "0" } },
            { id: "", order: 1, type: "heading", content: "The platform that does everything.", props: { level: 1 }, styles: { fontSize: "56px", fontWeight: "900", color: "#FFFFFF", margin: "0", lineHeight: "1.1", letterSpacing: "-0.04em" } },
            { id: "", order: 2, type: "paragraph", content: "Design, develop, and deploy modern websites — all from one beautiful interface.", styles: { fontSize: "18px", color: "rgba(255,255,255,0.7)", margin: "0", lineHeight: "1.7" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "320px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓", styles: { color: "#A5B4FC", fontWeight: "900", margin: "0", fontSize: "15px" } },
                    { id: "", order: 1, type: "paragraph", content: "No-code + full-code, your choice", styles: { color: "rgba(255,255,255,0.8)", fontSize: "15px", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓", styles: { color: "#A5B4FC", fontWeight: "900", margin: "0", fontSize: "15px" } },
                    { id: "", order: 1, type: "paragraph", content: "AI-generated sections and copy", styles: { color: "rgba(255,255,255,0.8)", fontSize: "15px", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "10px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "✓", styles: { color: "#A5B4FC", fontWeight: "900", margin: "0", fontSize: "15px" } },
                    { id: "", order: 1, type: "paragraph", content: "Deploy to global edge in one click", styles: { color: "rgba(255,255,255,0.8)", fontSize: "15px", margin: "0" } },
                  ]
                },
              ]
            },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "flex-start", padding: "80px 60px", gap: "36px" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "9999px", padding: "6px 16px 6px 6px" }, children: [
                { id: "", order: 0, type: "paragraph", content: "★★★★★", styles: { color: "#F59E0B", fontSize: "13px", margin: "0" } },
                { id: "", order: 1, type: "paragraph", content: "Loved by 24,000+ teams", styles: { fontSize: "13px", color: "#64748B", margin: "0", fontWeight: "600" } },
              ]
            },
            { id: "", order: 1, type: "heading", content: "Start building in seconds.", props: { level: 2 }, styles: { fontSize: "44px", fontWeight: "900", color: "#0F172A", margin: "0", lineHeight: "1.1", letterSpacing: "-0.04em" } },
            { id: "", order: 2, type: "paragraph", content: "Join 24,000 teams shipping faster with BuildStack. Your first project is free — no credit card needed.", styles: { fontSize: "17px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "12px", width: "100%", maxWidth: "380px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "8px", width: "100%" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Enter your email", styles: { flex: "1", padding: "14px 18px", border: "1.5px solid #E2E8F0", borderRadius: "12px", fontSize: "15px", color: "#94A3B8", margin: "0", backgroundColor: "#F8FAFC" } },
                    { id: "", order: 1, type: "button", content: "Get started", styles: { backgroundColor: "#6366F1", color: "#FFFFFF", padding: "14px 22px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", whiteSpace: "nowrap" } },
                  ]
                },
                { id: "", order: 1, type: "paragraph", content: "Free forever on starter plan. Upgrade any time.", styles: { fontSize: "13px", color: "#94A3B8", margin: "0" } },
              ]
            },
            {
              id: "", order: 4, type: "container", content: "", styles: { display: "flex", gap: "32px", paddingTop: "20px", borderTop: "1px solid #F1F5F9" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "24k+", styles: { fontSize: "24px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                    { id: "", order: 1, type: "paragraph", content: "Active teams", styles: { fontSize: "13px", color: "#94A3B8", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "2.4B+", styles: { fontSize: "24px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                    { id: "", order: 1, type: "paragraph", content: "Pages generated", styles: { fontSize: "13px", color: "#94A3B8", margin: "0" } },
                  ]
                },
                {
                  id: "", order: 2, type: "container", content: "", styles: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "4.9/5", styles: { fontSize: "24px", fontWeight: "900", color: "#0F172A", margin: "0", letterSpacing: "-0.03em" } },
                    { id: "", order: 1, type: "paragraph", content: "G2 rating", styles: { fontSize: "13px", color: "#94A3B8", margin: "0" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

  // ── Features: Timeline Roadmap ───────────────────────────────────────────────
  {
    id: "sb-features-timeline-roadmap",
    name: "Features — Timeline Roadmap",
    category: "features",
    designStyle: "minimal",
    description: "Horizontal product timeline showing past milestones and future roadmap",
    element: {
      type: "container", content: "",
      styles: { padding: "140px 40px", backgroundColor: "#FAFAFA", display: "flex", flexDirection: "column", alignItems: "center", gap: "72px" },
      children: [
        {
          id: "", order: 0, type: "container", content: "", styles: { textAlign: "center", display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }, children: [
            { id: "", order: 0, type: "paragraph", content: "ROADMAP", styles: { fontSize: "11px", fontWeight: "800", letterSpacing: "0.18em", color: "#6366F1", margin: "0" } },
            { id: "", order: 1, type: "heading", content: "Where we've been. Where we're going.", props: { level: 2 }, styles: { fontSize: "52px", fontWeight: "900", color: "#0F172A", margin: "0", lineHeight: "1.1", letterSpacing: "-0.04em" } },
            { id: "", order: 2, type: "paragraph", content: "We build in the open. Here's exactly what we've shipped and what's coming next.", styles: { fontSize: "18px", color: "#64748B", margin: "0", lineHeight: "1.7" } },
          ]
        },
        {
          id: "", order: 1, type: "container", content: "", styles: { maxWidth: "1100px", width: "100%", display: "flex", flexDirection: "column", gap: "0" }, children: [
            {
              id: "", order: 0, type: "container", content: "", styles: { display: "flex", gap: "24px", paddingBottom: "40px", borderBottom: "1px solid #E2E8F0", marginBottom: "40px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { minWidth: "100px", display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Q4 2024", styles: { fontSize: "12px", fontWeight: "700", color: "#94A3B8", margin: "0", letterSpacing: "0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "✓ Shipped", styles: { fontSize: "11px", fontWeight: "700", color: "#10B981", margin: "0", backgroundColor: "#ECFDF5", padding: "2px 8px", borderRadius: "9999px", display: "inline-block" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Drag-and-drop Canvas v1", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Launched the core visual editor — 80+ element types, real-time collaboration, and a live preview at every screen size.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 1, type: "container", content: "", styles: { display: "flex", gap: "24px", paddingBottom: "40px", borderBottom: "1px solid #E2E8F0", marginBottom: "40px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { minWidth: "100px", display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Q1 2025", styles: { fontSize: "12px", fontWeight: "700", color: "#94A3B8", margin: "0", letterSpacing: "0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "✓ Shipped", styles: { fontSize: "11px", fontWeight: "700", color: "#10B981", margin: "0", backgroundColor: "#ECFDF5", padding: "2px 8px", borderRadius: "9999px", display: "inline-block" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Section Library + AI Generation", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "200+ production-ready section templates. Plus: type a prompt, get a complete section in under 5 seconds.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 2, type: "container", content: "", styles: { display: "flex", gap: "24px", paddingBottom: "40px", borderBottom: "1px solid #E2E8F0", marginBottom: "40px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { minWidth: "100px", display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Q3 2025", styles: { fontSize: "12px", fontWeight: "700", color: "#94A3B8", margin: "0", letterSpacing: "0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "In Progress", styles: { fontSize: "11px", fontWeight: "700", color: "#6366F1", margin: "0", backgroundColor: "#EEF2FF", padding: "2px 8px", borderRadius: "9999px", display: "inline-block" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "CMS + Dynamic Content", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Connect to any data source. Build blogs, directories, and product listings with a visual CMS that non-devs can actually use.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
              ]
            },
            {
              id: "", order: 3, type: "container", content: "", styles: { display: "flex", gap: "24px" }, children: [
                {
                  id: "", order: 0, type: "container", content: "", styles: { minWidth: "100px", display: "flex", flexDirection: "column", gap: "4px" }, children: [
                    { id: "", order: 0, type: "paragraph", content: "Q1 2026", styles: { fontSize: "12px", fontWeight: "700", color: "#94A3B8", margin: "0", letterSpacing: "0.04em" } },
                    { id: "", order: 1, type: "paragraph", content: "Planned", styles: { fontSize: "11px", fontWeight: "700", color: "#F59E0B", margin: "0", backgroundColor: "#FFFBEB", padding: "2px 8px", borderRadius: "9999px", display: "inline-block" } },
                  ]
                },
                {
                  id: "", order: 1, type: "container", content: "", styles: { flex: "1", display: "flex", flexDirection: "column", gap: "8px" }, children: [
                    { id: "", order: 0, type: "heading", content: "Commerce & Checkout", props: { level: 3 }, styles: { fontSize: "20px", fontWeight: "800", color: "#0F172A", margin: "0" } },
                    { id: "", order: 1, type: "paragraph", content: "Full e-commerce capabilities — products, carts, Stripe checkout, and order management — all visual, all without code.", styles: { fontSize: "15px", color: "#64748B", margin: "0", lineHeight: "1.6" } },
                  ]
                },
              ]
            },
          ]
        },
      ],
    },
  },

];

export const SECTION_CATEGORIES = [
  { id: "all", label: "All" },
  { id: "hero", label: "Hero" },
  { id: "features", label: "Features" },
  { id: "services", label: "Services" },
  { id: "cta", label: "CTA" },
  { id: "testimonials", label: "Testimonials" },
  { id: "pricing", label: "Pricing" },
  { id: "content", label: "Content" },
  { id: "stats", label: "Statistics" },
  { id: "auth", label: "Authentication" },
  { id: "team", label: "Team" },
  { id: "faq", label: "FAQ" },
  { id: "landing", label: "Landing Pages" },
  { id: "logo-cloud", label: "Logo Cloud" },
  { id: "contact", label: "Contact" },
  { id: "navbar", label: "Navbar" },
  { id: "sidebar", label: "Sidebar" },
  { id: "footer", label: "Footer" },
  { id: "blog", label: "Blog" },
  { id: "portfolio", label: "Portfolio" },
  { id: "ecommerce", label: "E-Commerce" },
  { id: "dashboard", label: "Dashboard" },
  { id: "saas", label: "SaaS" },
  { id: "utility", label: "Utility" },
  { id: "interactive", label: "Interactive" }
] as const;

export const DESIGN_STYLES = [
  { id: "all", label: "Any Style" },
  { id: "minimal", label: "Minimal" },
  { id: "modern", label: "Modern" },
  { id: "dark", label: "Dark" },
  { id: "glass", label: "Glassmorphism" },
  { id: "bold", label: "Bold" },
  { id: "corporate", label: "Corporate" },
  { id: "playful", label: "Playful" },
  { id: "creative", label: "Creative" },
] as const;
