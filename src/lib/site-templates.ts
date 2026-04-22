import type { CanvasElement, Page, TemplateCategory } from "./types";
import { generateId } from "./utils";
import { SECTION_BLOCKS } from "./section-blocks";

export type RawElement = {
  type: CanvasElement["type"];
  content?: string;
  name?: string;
  props?: Record<string, unknown>;
  styles?: Record<string, unknown>;
  order: number;
  children?: RawElement[];
};

export interface TemplatePage {
  name: string;
  slug: string;
  isHome?: boolean;
  elements: RawElement[];
}

export type PreviewBlockType =
  | "navbar" | "hero" | "hero-split" | "features" | "stats"
  | "testimonials" | "pricing" | "logos" | "cta" | "footer"
  | "text-block" | "form" | "grid" | "image-text" | "blog" | "team" | "portfolio" | "faq" | "services";

export interface PreviewBlock {
  type: PreviewBlockType;
  heightRatio: number;
  bg?: string;
  dark?: boolean;
  cols?: 2 | 3 | 4;
}

export interface SiteTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  longDescription: string;
  tier: "free" | "pro" | "business";
  gradient: string;
  accentHex: string;
  tags: string[];
  features: string[];
  preview: PreviewBlock[];
  pages: TemplatePage[];
}

// ─── Clone helpers ─────────────────────────────────────────────────────────────

function cloneWithIds(raw: RawElement, fallbackOrder: number, navLinks?: { label: string; href: string }[]): CanvasElement {
  let props = raw.props ? { ...raw.props } : undefined;
  
  // Auto-inject main navigation
  if (navLinks && raw.type === "navbar") {
    props = { ...props, navLinks };
  }

  // Auto-wire inner links matching page names
  if (navLinks && (raw.type === "text-link" || raw.type === "button") && props?.href === "#") {
    const matched = navLinks.find(
      (n) => n.label.toLowerCase() === (raw.content || "").toLowerCase()
    );
    props = { ...props, href: matched ? matched.href : navLinks[0].href };
  }

  return {
    id: generateId(),
    type: raw.type,
    content: raw.content,
    name: raw.name,
    props: props,
    styles: raw.styles as CanvasElement["styles"],
    order: raw.order ?? fallbackOrder,
    children: raw.children?.map((c, i) => cloneWithIds(c, i, navLinks)),
  };
}

export function instantiateTemplate(pages: TemplatePage[]): Page[] {
  const navLinks = pages.map((p) => ({ label: p.name, href: p.slug }));

  return pages.map((tmplPage, pageIndex) => ({
    id: `page-${generateId()}`,
    name: tmplPage.name,
    slug: tmplPage.slug,
    isHome: tmplPage.isHome ?? pageIndex === 0,
    elements: tmplPage.elements.map((el, i) => cloneWithIds(el, i, navLinks)),
  }));
}

// ─── Section block helper ─────────────────────────────────────────────────────
// Pull a section block element by ID and attach an order + optional name.
// The element is cast to RawElement — cloneWithIds handles nested children fine.

function blockEl(id: string, order: number, name?: string, overrides?: { props?: Record<string, unknown>; styles?: Record<string, unknown> }): RawElement {
  const block = SECTION_BLOCKS.find((b) => b.id === id);
  if (!block) throw new Error(`Section block "${id}" not found`);
  return { 
    ...(block.element as unknown as RawElement), 
    order, 
    name: name ?? block.name,
    props: overrides?.props ? { ...(block.element.props || {}), ...overrides.props } : block.element.props,
    styles: overrides?.styles ? { ...(block.element.styles || {}), ...overrides.styles } : block.element.styles as Record<string, unknown>,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1 — SaaS "Launchify"  (glass/indigo, 5 pages)
// Navbar: sb-navbar-glass (glass, indigo)  ·  Footer: sb-footer-dark
// ─────────────────────────────────────────────────────────────────────────────

const launchifyPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass",       0, "Navbar", { props: { accentColor: "#6366F1", brandName: "Launchify" } }),
      blockEl("sb-hero-glass",         1, "Hero", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-logos",              2, "Trusted By"),
      blockEl("sb-features-cards",     3, "Features", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-stats-light",        4, "Stats"),
      blockEl("sb-testimonials-grid",  5, "Testimonials"),
      blockEl("sb-pricing-table",      6, "Pricing", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-cta-dark",           7, "CTA", { props: { accentColor: "#6366F1", title: "Ready to launch?", subtitle: "Join 10,000+ teams who use Launchify to build faster." } }),
      blockEl("sb-footer-dark",        8, "Footer"),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-glass",         0, "Navbar", { props: { accentColor: "#6366F1", brandName: "Launchify" } }),
      blockEl("sb-hero-feature-stack",   1, "Hero", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-dark-bento",  2, "Features Grid", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-alternating", 3, "Feature Details", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-steps",       4, "How It Works", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-cta-simple",           5, "CTA", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-dark",          6, "Footer"),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-glass",       0, "Navbar", { props: { accentColor: "#6366F1", brandName: "Launchify" } }),
      blockEl("sb-pricing-table",      1, "Pricing Table", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-checklist", 2, "Feature Comparison", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-faq",                3, "FAQ"),
      blockEl("sb-cta-dark",           4, "CTA", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-dark",        5, "Footer"),
    ],
  },
  {
    name: "Customers", slug: "/customers",
    elements: [
      blockEl("sb-navbar-glass",         0, "Navbar", { props: { accentColor: "#6366F1", brandName: "Launchify" } }),
      blockEl("sb-hero-studio",          1, "Hero", { props: { title: "Loved by teams worldwide", subtitle: "See how companies are using Launchify." } }),
      blockEl("sb-logos",                2, "Logo Cloud"),
      blockEl("sb-portfolio-case-study", 3, "Case Studies"),
      blockEl("sb-testimonials-grid",    4, "Testimonials"),
      blockEl("sb-cta-dark",             5, "CTA", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-dark",          6, "Footer"),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-glass",      0, "Navbar", { props: { accentColor: "#6366F1", brandName: "Launchify" } }),
      blockEl("sb-blog-featured",     1, "Featured Post"),
      blockEl("sb-blog-grid",         2, "Latest Posts"),
      blockEl("sb-cta-newsletter",    3, "Newsletter"),
      blockEl("sb-footer-dark",       4, "Footer"),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-glass",  0, "Navbar", { props: { accentColor: "#6366F1", brandName: "Launchify" } }),
      blockEl("sb-hero-bento",    1, "Hero", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-stats-light",   2, "Stats"),
      blockEl("sb-team-grid",     3, "Team"),
      blockEl("sb-cta-gradient",  4, "CTA", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-dark",   5, "Footer"),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-glass",  0, "Navbar", { props: { accentColor: "#6366F1", brandName: "Launchify" } }),
      blockEl("sb-contact-split", 1, "Contact", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-faq-centered",  2, "FAQ"),
      blockEl("sb-footer-dark",   3, "Footer"),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2 — Portfolio "Studio"  (minimal/mono, 5 pages)
// Navbar: sb-navbar-underline (Studio Lune, minimal serif)  ·  Footer: sb-footer-minimal
// ─────────────────────────────────────────────────────────────────────────────

const studioPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-underline",       0, "Navbar", { props: { brandName: "Studio Lune" } }),
      blockEl("sb-hero-editorial-classic", 1, "Hero", { props: { title: "Crafting digital experiences.", subtitle: "Independent design studio based in London." } }),
      blockEl("sb-portfolio-grid",         2, "Selected Work", { props: { cols: 2 } }),
      blockEl("sb-stats-light",            3, "Stats"),
      blockEl("sb-services-split",         4, "Services", { styles: { backgroundColor: "#F9FAFB" } }),
      blockEl("sb-cta-simple",             5, "CTA", { props: { title: "Have a project in mind?", buttonText: "Get in touch" } }),
      blockEl("sb-footer-minimal",         6, "Footer", { props: { brandName: "Studio Lune" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-underline",  0, "Navbar", { props: { brandName: "Studio Lune" } }),
      blockEl("sb-hero-editorial",    1, "Hero", { props: { title: "Selected Projects", subtitle: "A curated collection of our best work." } }),
      blockEl("sb-portfolio-grid",    2, "All Projects", { props: { cols: 3 } }),
      blockEl("sb-portfolio-minimal", 3, "Project List"),
      blockEl("sb-footer-minimal",    4, "Footer", { props: { brandName: "Studio Lune" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-underline",     0, "Navbar", { props: { brandName: "Studio Lune" } }),
      blockEl("sb-hero-studio",          1, "Hero", { props: { title: "What we do", subtitle: "Strategic design and digital development." } }),
      blockEl("sb-services-grid",        2, "Expertise"),
      blockEl("sb-services-alternating", 3, "Process"),
      blockEl("sb-portfolio-case-study", 4, "Featured Case Study"),
      blockEl("sb-footer-minimal",       5, "Footer", { props: { brandName: "Studio Lune" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-underline",      0, "Navbar", { props: { brandName: "Studio Lune" } }),
      blockEl("sb-hero-studio",           1, "Hero", { props: { title: "About the studio", subtitle: "We build brands that stand out." } }),
      blockEl("sb-team-horizontal",       2, "About Us"),
      blockEl("sb-stats-light",           3, "Studio Stats", { styles: { backgroundColor: "#F9FAFB" } }),
      blockEl("sb-content-feature-list",  4, "Core Values"),
      blockEl("sb-testimonials-large",    5, "Testimonials"),
      blockEl("sb-footer-minimal",        6, "Footer", { props: { brandName: "Studio Lune" } }),
    ],
  },
  {
    name: "Journal", slug: "/journal",
    elements: [
      blockEl("sb-navbar-underline",  0, "Navbar", { props: { brandName: "Studio Lune" } }),
      blockEl("sb-hero-editorial",    1, "Hero", { props: { title: "Studio Journal", subtitle: "Thoughts on design, tech, and culture." } }),
      blockEl("sb-blog-featured",     2, "Featured"),
      blockEl("sb-blog-list",         3, "All Posts"),
      blockEl("sb-blog-minimal-list", 4, "More Posts"),
      blockEl("sb-footer-minimal",    5, "Footer", { props: { brandName: "Studio Lune" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-underline", 0, "Navbar", { props: { brandName: "Studio Lune" } }),
      blockEl("sb-contact-minimal",  1, "Get in Touch"),
      blockEl("sb-faq-centered",     2, "FAQ"),
      blockEl("sb-footer-minimal",   3, "Footer", { props: { brandName: "Studio Lune" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — Agency "Apex Creative"  (bold/dark, 5 pages)
// Navbar: sb-navbar-split-panel (APEX, dark+amber)  ·  Footer: sb-footer-gradient
// ─────────────────────────────────────────────────────────────────────────────

const apexPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-split-panel",  0, "Navbar", { props: { brandName: "APEX", accentColor: "#F97316" } }),
      blockEl("sb-hero-cinematic",      1, "Hero", { props: { accentColor: "#F97316" } }),
      blockEl("sb-logos-dark",          2, "Clients"),
      blockEl("sb-services-dark",       3, "Services", { props: { accentColor: "#F97316" } }),
      blockEl("sb-stats-bold",          4, "Stats", { props: { accentColor: "#F97316" } }),
      blockEl("sb-testimonials-dark",   5, "Testimonials"),
      blockEl("sb-cta-bold",            6, "CTA", { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-gradient",     7, "Footer", { props: { brandName: "APEX" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-split-panel",   0, "Navbar", { props: { brandName: "APEX", accentColor: "#F97316" } }),
      blockEl("sb-hero-industrial",      1, "Hero", { props: { accentColor: "#F97316" } }),
      blockEl("sb-services-grid",        2, "All Services", { props: { accentColor: "#F97316" } }),
      blockEl("sb-services-dark",        3, "Service Detail", { props: { accentColor: "#F97316" } }),
      blockEl("sb-services-alternating", 4, "Our Process", { props: { accentColor: "#F97316" } }),
      blockEl("sb-cta-banner",           5, "CTA", { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-gradient",      6, "Footer", { props: { brandName: "APEX" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-split-panel",   0, "Navbar", { props: { brandName: "APEX", accentColor: "#F97316" } }),
      blockEl("sb-portfolio-bento",      1, "Selected Work", { props: { accentColor: "#F97316" } }),
      blockEl("sb-portfolio-dark-cards", 2, "All Projects"),
      blockEl("sb-portfolio-minimal",    3, "Project List"),
      blockEl("sb-cta-feature",          4, "Start a Project", { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-gradient",      5, "Footer", { props: { brandName: "APEX" } }),
    ],
  },
  {
    name: "Team", slug: "/team",
    elements: [
      blockEl("sb-navbar-split-panel", 0, "Navbar", { props: { brandName: "APEX", accentColor: "#F97316" } }),
      blockEl("sb-team-dark",          1, "Leadership", { props: { accentColor: "#F97316" } }),
      blockEl("sb-team-dark-cards",    2, "The Team"),
      blockEl("sb-stats-bold",         3, "Company Stats", { props: { accentColor: "#F97316" } }),
      blockEl("sb-cta-invite",         4, "Join Us", { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-gradient",    5, "Footer", { props: { brandName: "APEX" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-split-panel", 0, "Navbar", { props: { brandName: "APEX", accentColor: "#F97316" } }),
      blockEl("sb-contact-split",      1, "Contact", { props: { accentColor: "#F97316" } }),
      blockEl("sb-faq-dark",           2, "FAQ", { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-gradient",    3, "Footer", { props: { brandName: "APEX" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 4 — Blog "Editorial"  (minimal/amber, 5 pages)
// Navbar: sb-navbar-blog (The Digest, amber)  ·  Footer: sb-footer-newsletter
// ─────────────────────────────────────────────────────────────────────────────

const editorialPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-blog",            0, "Navbar", { props: { brandName: "The Digest", accentColor: "#F59E0B" } }),
      blockEl("sb-hero-editorial-classic", 1, "Hero", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-blog-featured",          2, "Featured Post"),
      blockEl("sb-blog-grid",              3, "Latest Posts"),
      blockEl("sb-cta-newsletter",         4, "Newsletter", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-newsletter",      5, "Footer", { props: { brandName: "The Digest" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-blog",       0, "Navbar", { props: { brandName: "The Digest", accentColor: "#F59E0B" } }),
      blockEl("sb-hero-editorial",    1, "Hero", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-blog-list",         2, "All Posts"),
      blockEl("sb-blog-minimal-list", 3, "More Posts"),
      blockEl("sb-cta-newsletter",    4, "Newsletter", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-newsletter", 5, "Footer", { props: { brandName: "The Digest" } }),
    ],
  },
  {
    name: "Article", slug: "/blog/article",
    elements: [
      blockEl("sb-navbar-blog",        0, "Navbar", { props: { brandName: "The Digest", accentColor: "#F59E0B" } }),
      blockEl("sb-content-rich-text",  1, "Article Body"),
      blockEl("sb-content-blockquote", 2, "Pull Quote", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-blog-author",        3, "Author Bio"),
      blockEl("sb-blog-related",       4, "Related Posts"),
      blockEl("sb-footer-newsletter",  5, "Footer", { props: { brandName: "The Digest" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-blog",       0, "Navbar", { props: { brandName: "The Digest", accentColor: "#F59E0B" } }),
      blockEl("sb-hero-studio",       1, "Hero", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-team-horizontal",   2, "The Team"),
      blockEl("sb-stats-light",       3, "By the Numbers", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-cta-newsletter",    4, "Newsletter", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-newsletter", 5, "Footer", { props: { brandName: "The Digest" } }),
    ],
  },
  {
    name: "Newsletter", slug: "/newsletter",
    elements: [
      blockEl("sb-navbar-blog",       0, "Navbar", { props: { brandName: "The Digest", accentColor: "#F59E0B" } }),
      blockEl("sb-hero-editorial",    1, "Hero", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-cta-newsletter",    2, "Subscribe", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-blog-grid",         3, "Recent Issues"),
      blockEl("sb-footer-newsletter", 4, "Footer", { props: { brandName: "The Digest" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 5 — Startup "Nexus"  (dark/violet, 5 pages)
// Navbar: sb-navbar-startup (Orbit, violet/dark)  ·  Footer: sb-footer-startup
// ─────────────────────────────────────────────────────────────────────────────

const nexusPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-startup",         0, "Navbar", { props: { brandName: "Orbit", accentColor: "#7C3AED" } }),
      blockEl("sb-hero-abstract-ambient",  1, "Hero", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-dark-bento",    2, "Features", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-logos-dark",             3, "Integrations"),
      blockEl("sb-stats-dark-cards",       4, "Stats", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-testimonials-dark",      5, "Testimonials"),
      blockEl("sb-cta-gradient",           6, "CTA", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-startup",         7, "Footer", { props: { brandName: "Orbit" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-startup",            0, "Navbar", { props: { brandName: "Orbit", accentColor: "#7C3AED" } }),
      blockEl("sb-hero-feature-stack",        1, "Hero", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-bento",            2, "Feature Grid", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-interactive-tabs-features", 3, "Feature Tour", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-alternating",      4, "Deep Dive", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-how-it-works",     5, "How It Works", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-dark",                  6, "CTA", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-startup",            7, "Footer", { props: { brandName: "Orbit" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-startup",           0, "Navbar", { props: { brandName: "Orbit", accentColor: "#7C3AED" } }),
      blockEl("sb-pricing-dark",             1, "Pricing", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-pricing-comparison-table", 2, "Compare Plans", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-faq-dark",                 3, "FAQ", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-dark",                 4, "CTA", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-startup",           5, "Footer", { props: { brandName: "Orbit" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-startup",  0, "Navbar", { props: { brandName: "Orbit", accentColor: "#7C3AED" } }),
      blockEl("sb-blog-featured",   1, "Featured Post", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-blog-grid",       2, "All Posts", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-startup",  3, "Footer", { props: { brandName: "Orbit" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-startup",        0, "Navbar", { props: { brandName: "Orbit", accentColor: "#7C3AED" } }),
      blockEl("sb-hero-abstract-ambient", 1, "Hero", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-dark",             2, "Team", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-stats-dark-cards",      3, "Stats", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-invite",            4, "CTA", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-startup",        5, "Footer", { props: { brandName: "Orbit" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 6 — Restaurant "Ember & Oak"  (warm/glass, 4 pages)
// Navbar: sb-navbar-restaurant (Ember & Oak, amber)  ·  Footer: sb-footer-corporate
// ─────────────────────────────────────────────────────────────────────────────

const emberPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-restaurant",   0, "Navbar", { props: { brandName: "Ember & Oak", accentColor: "#D97706" } }),
      blockEl("sb-hero-organic",        1, "Hero", { props: { accentColor: "#D97706" } }),
      blockEl("sb-stats-light",         2, "Our Story", { props: { accentColor: "#D97706" } }),
      blockEl("sb-testimonials-large",  3, "Guest Reviews", { props: { accentColor: "#D97706" } }),
      blockEl("sb-cta-split",           4, "Reserve a Table", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",    5, "Footer", { props: { brandName: "Ember & Oak" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-restaurant",      0, "Navbar", { props: { brandName: "Ember & Oak", accentColor: "#D97706" } }),
      blockEl("sb-hero-editorial-classic", 1, "Menu Header", { props: { accentColor: "#D97706", subtitle: "Our seasonal offerings" } }),
      blockEl("sb-services-grid",          2, "Menu Sections", { props: { accentColor: "#D97706" } }),
      blockEl("sb-services-split",         3, "Chef's Selection", { props: { accentColor: "#D97706" } }),
      blockEl("sb-faq-centered",           4, "Dietary Info & FAQ", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",       5, "Footer", { props: { brandName: "Ember & Oak" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-restaurant",  0, "Navbar", { props: { brandName: "Ember & Oak", accentColor: "#D97706" } }),
      blockEl("sb-hero-studio",        1, "Our Story", { props: { accentColor: "#D97706" } }),
      blockEl("sb-team-grid",          2, "Our Team", { props: { accentColor: "#D97706" } }),
      blockEl("sb-testimonials-grid",  3, "Guest Reviews", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",   4, "Footer", { props: { brandName: "Ember & Oak" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-restaurant", 0, "Navbar", { props: { brandName: "Ember & Oak", accentColor: "#D97706" } }),
      blockEl("sb-contact-split",     1, "Reservations & Contact", { props: { accentColor: "#D97706" } }),
      blockEl("sb-faq-centered",      2, "FAQ", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",  3, "Footer", { props: { brandName: "Ember & Oak" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 7 — Wellness "Serenity"  (minimal/teal, 4 pages)
// Navbar: sb-navbar-minimal (Studio, mono)  ·  Footer: sb-footer-minimal
// ─────────────────────────────────────────────────────────────────────────────

const serenityPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",         0, "Navbar", { props: { brandName: "Serenity", accentColor: "#14B8A6" } }),
      blockEl("sb-hero-editorial-classic", 1, "Hero", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-services-grid",          2, "Services", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-testimonials-grid",      3, "Testimonials", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-stats-light",            4, "Stats", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-cta-simple",             5, "CTA", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-minimal",         6, "Footer", { props: { brandName: "Serenity" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-minimal",    0, "Navbar", { props: { brandName: "Serenity", accentColor: "#14B8A6" } }),
      blockEl("sb-hero-editorial",    1, "Hero", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-services-split",    2, "Service Details", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-features-checklist",3, "What's Included", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-faq-cards",         4, "FAQ", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-cta-banner",        5, "CTA", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-minimal",    6, "Footer", { props: { brandName: "Serenity" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar", { props: { brandName: "Serenity", accentColor: "#14B8A6" } }),
      blockEl("sb-hero-studio",          1, "Hero", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-team-horizontal",      2, "About Me", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-content-feature-list", 3, "My Approach", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-minimal",       4, "Footer", { props: { brandName: "Serenity" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-minimal",  0, "Navbar", { props: { brandName: "Serenity", accentColor: "#14B8A6" } }),
      blockEl("sb-contact-minimal", 1, "Book a Session", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-faq-centered",    2, "FAQ", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-minimal",  3, "Footer", { props: { brandName: "Serenity" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 8 — E-Commerce "Bloom"  (rose/modern, 4 pages)
// Navbar: sb-navbar-ecommerce (Bloom, rose)  ·  Footer: sb-footer-newsletter
// ─────────────────────────────────────────────────────────────────────────────

const bloomPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar", { props: { brandName: "Bloom", accentColor: "#F43F5E" } }),
      blockEl("sb-ecommerce-hero",             1, "Hero", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-ecommerce-featured-products",2, "Featured Products", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-stats-light",                3, "Stats"),
      blockEl("sb-testimonials-grid",          4, "Reviews", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-cta-banner",                 5, "CTA", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-footer-newsletter",          6, "Footer", { props: { brandName: "Bloom" } }),
    ],
  },
  {
    name: "Shop", slug: "/shop",
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar", { props: { brandName: "Bloom", accentColor: "#F43F5E" } }),
      blockEl("sb-hero-search-centered",       1, "Browse", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-ecommerce-featured-products",2, "All Products", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-ecommerce-upsell",           3, "Recommended", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-footer-newsletter",          4, "Footer", { props: { brandName: "Bloom" } }),
    ],
  },
  {
    name: "Product", slug: "/shop/product",
    elements: [
      blockEl("sb-navbar-ecommerce",         0, "Navbar", { props: { brandName: "Bloom", accentColor: "#F43F5E" } }),
      blockEl("sb-ecommerce-product-detail", 1, "Product", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-ecommerce-reviews",        2, "Reviews", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-ecommerce-upsell",         3, "You May Also Like", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-footer-newsletter",        4, "Footer", { props: { brandName: "Bloom" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-ecommerce",  0, "Navbar", { props: { brandName: "Bloom", accentColor: "#F43F5E" } }),
      blockEl("sb-hero-organic",      1, "Our Story", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-team-grid",         2, "Our Team", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-cta-newsletter",    3, "Stay in Touch", { props: { accentColor: "#F43F5E" } }),
      blockEl("sb-footer-newsletter", 4, "Footer", { props: { brandName: "Bloom" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 9 — Blog "The Chronicle"  (editorial/publication, 6 pages)
// ─────────────────────────────────────────────────────────────────────────────

const chroniclePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-blog",           0, "Navbar", { props: { brandName: "The Chronicle", accentColor: "#475569" } }),
      blockEl("sb-hero-editorial-classic",1, "Hero", { props: { accentColor: "#475569" } }),
      blockEl("sb-blog-featured",         2, "Featured Post"),
      blockEl("sb-blog-grid",             3, "Latest Posts"),
      blockEl("sb-cta-newsletter",        4, "Newsletter", { props: { accentColor: "#475569" } }),
      blockEl("sb-footer-newsletter",     5, "Footer", { props: { brandName: "The Chronicle" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-blog",       0, "Navbar", { props: { brandName: "The Chronicle", accentColor: "#475569" } }),
      blockEl("sb-hero-editorial",    1, "Hero", { props: { accentColor: "#475569" } }),
      blockEl("sb-blog-list",         2, "All Posts"),
      blockEl("sb-blog-minimal-list", 3, "More Posts"),
      blockEl("sb-cta-newsletter",    4, "Newsletter", { props: { accentColor: "#475569" } }),
      blockEl("sb-footer-newsletter", 5, "Footer", { props: { brandName: "The Chronicle" } }),
    ],
  },
  {
    name: "Article", slug: "/blog/article",
    elements: [
      blockEl("sb-navbar-blog",         0, "Navbar", { props: { brandName: "The Chronicle", accentColor: "#475569" } }),
      blockEl("sb-content-rich-text",   1, "Article Body"),
      blockEl("sb-content-blockquote",  2, "Pull Quote", { props: { accentColor: "#475569" } }),
      blockEl("sb-blog-author",         3, "Author Bio"),
      blockEl("sb-blog-related",        4, "Related Posts"),
      blockEl("sb-footer-newsletter",   5, "Footer", { props: { brandName: "The Chronicle" } }),
    ],
  },
  {
    name: "Authors", slug: "/authors",
    elements: [
      blockEl("sb-navbar-blog",         0, "Navbar", { props: { brandName: "The Chronicle", accentColor: "#475569" } }),
      blockEl("sb-team-minimal-list",   1, "All Authors"),
      blockEl("sb-team-horizontal",     2, "Featured Author"),
      blockEl("sb-footer-newsletter",   3, "Footer", { props: { brandName: "The Chronicle" } }),
    ],
  },
  {
    name: "Topics", slug: "/topics",
    elements: [
      blockEl("sb-navbar-blog",           0, "Navbar", { props: { brandName: "The Chronicle", accentColor: "#475569" } }),
      blockEl("sb-hero-search-centered",  1, "Search & Browse", { props: { accentColor: "#475569" } }),
      blockEl("sb-blog-grid",             2, "Posts by Topic"),
      blockEl("sb-blog-newsletter-cta",   3, "Newsletter CTA", { props: { accentColor: "#475569" } }),
      blockEl("sb-footer-newsletter",     4, "Footer", { props: { brandName: "The Chronicle" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-blog",         0, "Navbar", { props: { brandName: "The Chronicle", accentColor: "#475569" } }),
      blockEl("sb-hero-studio",         1, "Hero", { props: { accentColor: "#475569" } }),
      blockEl("sb-team-grid",           2, "Editorial Team"),
      blockEl("sb-stats-light",         3, "By the Numbers"),
      blockEl("sb-cta-newsletter",      4, "Join Us", { props: { accentColor: "#475569" } }),
      blockEl("sb-footer-newsletter",   5, "Footer", { props: { brandName: "The Chronicle" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 10 — SaaS App "AppForge"  (saas/dashboard, 6 pages)
// ─────────────────────────────────────────────────────────────────────────────

const appforgePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-saas",          0, "Navbar", { props: { brandName: "AppForge", accentColor: "#0EA5E9" } }),
      blockEl("sb-hero-glass",           1, "Hero", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-saas-product-shot",    2, "Product Screenshot"),
      blockEl("sb-logos",                3, "Trusted By"),
      blockEl("sb-features-alternating", 4, "Features", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-saas-testimonial-metric",5,"Social Proof"),
      blockEl("sb-pricing-simple",       6, "Pricing", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-cta-dark",             7, "CTA", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-footer-dark",          8, "Footer", { props: { brandName: "AppForge" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-saas",             0, "Navbar", { props: { brandName: "AppForge", accentColor: "#0EA5E9" } }),
      blockEl("sb-hero-feature-stack",      1, "Hero", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-features-dark-bento",     2, "Feature Grid", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-features-alternating",    3, "Deep Dive", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-features-how-it-works",   4, "How It Works", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-saas-integration-logos",  5, "Integrations"),
      blockEl("sb-saas-security",           6, "Security", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-cta-simple",              7, "CTA", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-footer-dark",             8, "Footer", { props: { brandName: "AppForge" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-saas",              0, "Navbar", { props: { brandName: "AppForge", accentColor: "#0EA5E9" } }),
      blockEl("sb-pricing-table",            1, "Plans", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-pricing-comparison-table", 2, "Compare Plans", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-logos",                    3, "Trusted By"),
      blockEl("sb-faq",                      4, "FAQ"),
      blockEl("sb-cta-dark",                 5, "CTA", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-footer-dark",              6, "Footer", { props: { brandName: "AppForge" } }),
    ],
  },
  {
    name: "Dashboard", slug: "/dashboard",
    elements: [
      blockEl("sb-sidebar-app-nav",    0, "App Navigation", { props: { accentColor: "#0EA5E9", brandName: "AppForge" } }),
      blockEl("sb-dashboard-overview", 1, "Overview", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-dashboard-metrics",  2, "Metrics", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-dashboard-chart",    3, "Analytics Chart", { props: { accentColor: "#0EA5E9" } }),
      blockEl("sb-dashboard-table",    4, "Data Table"),
    ],
  },
  {
    name: "Sign In", slug: "/sign-in",
    elements: [
      blockEl("sb-auth-split", 0, "Sign In", { props: { accentColor: "#0EA5E9", brandName: "AppForge" } }),
    ],
  },
  {
    name: "Sign Up", slug: "/sign-up",
    elements: [
      blockEl("sb-auth-minimal", 0, "Create Account", { props: { accentColor: "#0EA5E9", brandName: "AppForge" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 11 — E-Commerce "Storefront"  (ecommerce/full, 5 pages)
// ─────────────────────────────────────────────────────────────────────────────

const storefrontPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-ecommerce",          0, "Navbar", { props: { brandName: "Storefront", accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-hero",            1, "Hero", { props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-featured-products",2,"Featured Products", { props: { accentColor: "#10B981" } }),
      blockEl("sb-logos-badges",              3, "Press & Certifications"),
      blockEl("sb-testimonials-grid",         4, "Customer Reviews", { props: { accentColor: "#10B981" } }),
      blockEl("sb-cta-newsletter",            5, "Newsletter", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-newsletter",         6, "Footer", { props: { brandName: "Storefront" } }),
    ],
  },
  {
    name: "Shop", slug: "/shop",
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar", { props: { brandName: "Storefront", accentColor: "#10B981" } }),
      blockEl("sb-hero-search-centered",       1, "Search", { props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-featured-products",2, "All Products", { props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-upsell",           3, "Recommended", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-newsletter",          4, "Footer", { props: { brandName: "Storefront" } }),
    ],
  },
  {
    name: "Product", slug: "/shop/product",
    elements: [
      blockEl("sb-navbar-ecommerce",        0, "Navbar", { props: { brandName: "Storefront", accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-product-detail",1, "Product Detail", { props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-reviews",       2, "Reviews", { props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-upsell",        3, "You May Also Like", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-newsletter",       4, "Footer", { props: { brandName: "Storefront" } }),
    ],
  },
  {
    name: "Cart", slug: "/cart",
    elements: [
      blockEl("sb-navbar-ecommerce",       0, "Navbar", { props: { brandName: "Storefront", accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-cart-checkout",1, "Cart & Checkout", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-minimal",         2, "Footer"),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-ecommerce",  0, "Navbar", { props: { brandName: "Storefront", accentColor: "#10B981" } }),
      blockEl("sb-hero-organic",      1, "Our Story", { props: { accentColor: "#10B981" } }),
      blockEl("sb-team-grid",         2, "Our Team", { props: { accentColor: "#10B981" } }),
      blockEl("sb-stats-light",       3, "By the Numbers"),
      blockEl("sb-cta-newsletter",    4, "Stay in Touch", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-newsletter", 5, "Footer", { props: { brandName: "Storefront" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 12 — Mobile App "Momentum"  (startup/app, 5 pages)
// ─────────────────────────────────────────────────────────────────────────────

const momentumPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-startup",          0, "Navbar", { props: { brandName: "Momentum", accentColor: "#8B5CF6" } }),
      blockEl("sb-hero-mobile-showcase",    1, "Hero", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-landing-mobile-app",      2, "App Highlights", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-alternating",    3, "Features", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-stats-light",             4, "Stats"),
      blockEl("sb-testimonials-grid",       5, "Reviews", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-pricing-simple",          6, "Plans", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-cta-gradient",            7, "Download CTA", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-startup",          8, "Footer", { props: { brandName: "Momentum" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-startup",         0, "Navbar", { props: { brandName: "Momentum", accentColor: "#8B5CF6" } }),
      blockEl("sb-hero-feature-stack",     1, "Hero", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-bento",         2, "Feature Grid", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-interactive-tabs-features",3,"Interactive Features", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-alternating",   4, "Details", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-how-it-works",  5, "How It Works", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-cta-gradient-wave",      6, "CTA", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-startup",         7, "Footer", { props: { brandName: "Momentum" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-startup",           0, "Navbar", { props: { brandName: "Momentum", accentColor: "#8B5CF6" } }),
      blockEl("sb-pricing-dark",             1, "Pricing", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-pricing-comparison-table", 2, "Compare Plans", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-faq-two-col",              3, "FAQ"),
      blockEl("sb-cta-invite",               4, "CTA", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-startup",           5, "Footer", { props: { brandName: "Momentum" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-startup",   0, "Navbar", { props: { brandName: "Momentum", accentColor: "#8B5CF6" } }),
      blockEl("sb-blog-featured",    1, "Featured Post"),
      blockEl("sb-blog-grid",        2, "All Posts"),
      blockEl("sb-footer-startup",   3, "Footer", { props: { brandName: "Momentum" } }),
    ],
  },
  {
    name: "FAQ", slug: "/faq",
    elements: [
      blockEl("sb-navbar-startup",       0, "Navbar", { props: { brandName: "Momentum", accentColor: "#8B5CF6" } }),
      blockEl("sb-hero-search-centered", 1, "Search Help", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-faq-search",           2, "FAQ Search", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-faq-categories",       3, "By Category"),
      blockEl("sb-contact-card",         4, "Still Need Help?", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-startup",       5, "Footer", { props: { brandName: "Momentum" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 13 — Agency "Orbit"  (agency/corporate, 6 pages)
// ─────────────────────────────────────────────────────────────────────────────

const orbitPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-corporate",     0, "Navbar", { props: { brandName: "Orbit Agency", accentColor: "#1D4ED8" } }),
      blockEl("sb-hero-enterprise",      1, "Hero", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-logos-with-stats",     2, "Clients & Stats"),
      blockEl("sb-services-alternating", 3, "Services", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-portfolio-case-study", 4, "Case Studies"),
      blockEl("sb-testimonials-wall",    5, "Testimonials"),
      blockEl("sb-cta-split",            6, "CTA", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-mega",          7, "Footer", { props: { brandName: "Orbit Agency" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-corporate",          0, "Navbar", { props: { brandName: "Orbit Agency", accentColor: "#1D4ED8" } }),
      blockEl("sb-hero-industrial",           1, "Hero", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-services-grid",             2, "All Services", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-services-alternating",      3, "Service Detail", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-services-minimal-timeline", 4, "Our Process", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-cta-banner",                5, "CTA", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-mega",               6, "Footer", { props: { brandName: "Orbit Agency" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-corporate",     0, "Navbar", { props: { brandName: "Orbit Agency", accentColor: "#1D4ED8" } }),
      blockEl("sb-portfolio-case-study", 1, "Case Studies"),
      blockEl("sb-portfolio-bento",      2, "Selected Work", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-portfolio-dark-cards", 3, "More Projects"),
      blockEl("sb-cta-feature",          4, "Start a Project", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-mega",          5, "Footer", { props: { brandName: "Orbit Agency" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-corporate",   0, "Navbar", { props: { brandName: "Orbit Agency", accentColor: "#1D4ED8" } }),
      blockEl("sb-blog-featured",      1, "Featured Article"),
      blockEl("sb-blog-grid",          2, "All Articles"),
      blockEl("sb-blog-newsletter-cta",3, "Newsletter", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-mega",        4, "Footer", { props: { brandName: "Orbit Agency" } }),
    ],
  },
  {
    name: "Team", slug: "/team",
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar", { props: { brandName: "Orbit Agency", accentColor: "#1D4ED8" } }),
      blockEl("sb-team-spotlight",    1, "Leadership", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-team-dark-cards",   2, "The Team"),
      blockEl("sb-team-hiring",       3, "We're Hiring", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-stats-dark-cards",  4, "Company Stats"),
      blockEl("sb-cta-invite",        5, "Join Us", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-mega",       6, "Footer", { props: { brandName: "Orbit Agency" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar", { props: { brandName: "Orbit Agency", accentColor: "#1D4ED8" } }),
      blockEl("sb-contact-map",      1, "Location & Form", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-contact-dark",     2, "Get in Touch", { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-faq-two-col",      3, "FAQ"),
      blockEl("sb-footer-mega",      4, "Footer", { props: { brandName: "Orbit Agency" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 14 — Startup Launch "LaunchKit"  (startup/waitlist, 4 pages)
// ─────────────────────────────────────────────────────────────────────────────

const launchkitPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-announcement",    0, "Announcement Bar", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-landing-waitlist",       1, "Waitlist Hero", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-interactive-countdown",  2, "Launch Countdown", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-landing-product-hunt",   3, "Product Hunt Launch"),
      blockEl("sb-features-icon-3col",     4, "Key Features", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-logos-badges",           5, "Early Backers"),
      blockEl("sb-testimonials-single-quote",6,"Social Proof"),
      blockEl("sb-cta-gradient",           7, "Final CTA", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",         8, "Footer", { props: { brandName: "LaunchKit" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-announcement",      0, "Navbar", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-hero-bento",               1, "Hero", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-bento",           2, "Feature Bento", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-interactive-tabs-features",3, "Feature Tour", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-content-comparison",       4, "Before & After"),
      blockEl("sb-content-steps-guide",      5, "Getting Started"),
      blockEl("sb-cta-dark",                 6, "CTA", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",           7, "Footer", { props: { brandName: "LaunchKit" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-announcement",   0, "Navbar", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-pricing-minimal",       1, "Pricing", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-pricing-minimal-single",2, "Lifetime Deal", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-faq-cards",             3, "FAQ"),
      blockEl("sb-cta-invite",            4, "CTA", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",        5, "Footer", { props: { brandName: "LaunchKit" } }),
    ],
  },
  {
    name: "Roadmap", slug: "/roadmap",
    elements: [
      blockEl("sb-navbar-announcement",  0, "Navbar", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-hero-editorial",       1, "Hero", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-content-steps-guide",  2, "What We're Building"),
      blockEl("sb-features-checklist",   3, "Shipped Features", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-interactive-progress-skills",4,"Progress", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-cta-newsletter",       5, "Stay Updated", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",       6, "Footer", { props: { brandName: "LaunchKit" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 15 — Full SaaS "Launchpad"  (saas/dark/full, 7 pages)
// ─────────────────────────────────────────────────────────────────────────────

const launchpadPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass-frosted",     0, "Navbar", { props: { brandName: "Launchpad", accentColor: "#4F46E5" } }),
      blockEl("sb-landing-saas-full",        1, "Full Hero", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-logos-with-stats",         2, "Social Proof"),
      blockEl("sb-saas-product-shot",        3, "Product Screenshot"),
      blockEl("sb-features-dark-bento",      4, "Features", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-saas-integration-logos",   5, "Integrations"),
      blockEl("sb-testimonials-dark-grid",   6, "Testimonials"),
      blockEl("sb-pricing-dark-cards",       7, "Pricing", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-saas-security",            8, "Security & Trust", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-cta-gradient-wave",        9, "CTA", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-footer-dark",             10, "Footer", { props: { brandName: "Launchpad" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-glass-frosted",     0, "Navbar", { props: { brandName: "Launchpad", accentColor: "#4F46E5" } }),
      blockEl("sb-saas-dark-hero",           1, "Product Hero", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-saas-product-shot",        2, "Screenshots"),
      blockEl("sb-features-alternating",     3, "Feature Walkthrough", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-interactive-tabs-features",4, "Interactive Demo", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-interactive-carousel",     5, "Gallery"),
      blockEl("sb-cta-split-image",          6, "CTA", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-footer-dark",              7, "Footer", { props: { brandName: "Launchpad" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-glass-frosted",     0, "Navbar", { props: { brandName: "Launchpad", accentColor: "#4F46E5" } }),
      blockEl("sb-pricing-enterprise",       1, "Enterprise Pricing", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-pricing-comparison-table", 2, "Full Comparison", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-logos",                    3, "Enterprise Customers"),
      blockEl("sb-faq-search",               4, "FAQ", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-cta-dark",                 5, "CTA", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-footer-dark",              6, "Footer", { props: { brandName: "Launchpad" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-glass-frosted",  0, "Navbar", { props: { brandName: "Launchpad", accentColor: "#4F46E5" } }),
      blockEl("sb-blog-featured",         1, "Featured Post"),
      blockEl("sb-blog-grid",             2, "All Posts"),
      blockEl("sb-blog-newsletter-cta",   3, "Newsletter", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-footer-dark",           4, "Footer", { props: { brandName: "Launchpad" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-glass-frosted",   0, "Navbar", { props: { brandName: "Launchpad", accentColor: "#4F46E5" } }),
      blockEl("sb-hero-abstract-ambient",  1, "Hero", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-stats-with-chart",       2, "Traction", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-team-dark",              3, "Team", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-team-hiring",            4, "Open Roles", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-cta-gradient",           5, "CTA", { props: { accentColor: "#4F46E5" } }),
      blockEl("sb-footer-dark",            6, "Footer", { props: { brandName: "Launchpad" } }),
    ],
  },
  {
    name: "Sign In", slug: "/sign-in",
    elements: [
      blockEl("sb-auth-split", 0, "Sign In", { props: { accentColor: "#4F46E5", brandName: "Launchpad" } }),
    ],
  },
  {
    name: "Sign Up", slug: "/sign-up",
    elements: [
      blockEl("sb-auth-split", 0, "Create Account", { props: { accentColor: "#4F46E5", brandName: "Launchpad" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEW TEMPLATE 1 — Meridian (Corporate, 6 pages)
// ─────────────────────────────────────────────────────────────────────────────

const meridianPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar", { props: { brandName: "Meridian", accentColor: "#3B82F6" } }),
      blockEl("sb-hero-meridian-enterprise", 1, "Hero", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-with-stats", 2, "Trust Logos"),
      blockEl("sb-features-cards", 3, "Core Offerings", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-testimonials-wall", 4, "Global Reviews"),
      blockEl("sb-cta-enterprise-dark", 5, "CTA", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise", 6, "Footer", { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Platform", slug: "/platform",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar", { props: { brandName: "Meridian", accentColor: "#3B82F6" } }),
      blockEl("sb-hero-abstract-ambient", 1, "Platform Hero", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-bento", 2, "Architecture", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-interactive-tabs-features", 3, "Capabilities", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise", 4, "Footer", { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Solutions", slug: "/solutions",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar", { props: { brandName: "Meridian", accentColor: "#3B82F6" } }),
      blockEl("sb-hero-industrial", 1, "Solutions Matrix", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-services-grid", 2, "Enterprise Solutions", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-cta-enterprise-dark", 3, "Talk to Sales", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise", 4, "Footer", { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Customers", slug: "/customers",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar", { props: { brandName: "Meridian", accentColor: "#3B82F6" } }),
      blockEl("sb-hero-bento", 1, "Success Stories", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-portfolio-case-study", 2, "Featured Case Study"),
      blockEl("sb-testimonials-grid", 3, "Testimonials", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise", 4, "Footer", { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Company", slug: "/company",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar", { props: { brandName: "Meridian", accentColor: "#3B82F6" } }),
      blockEl("sb-hero-editorial", 1, "Our Mission", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-spotlight", 2, "Leadership", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-stats-light", 3, "Global Impact"),
      blockEl("sb-team-hiring", 4, "Careers", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise", 5, "Footer", { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar", { props: { brandName: "Meridian", accentColor: "#3B82F6" } }),
      blockEl("sb-contact-dark", 1, "Enterprise Sales", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-contact-map", 2, "Global Offices", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise", 3, "Footer", { props: { brandName: "Meridian" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEW TEMPLATE 2 — Phantom (Dark Agency, 6 pages)
// ─────────────────────────────────────────────────────────────────────────────

const phantomPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar", { props: { brandName: "Phantom", accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-hero-cinematic", 1, "Hero", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-phantom-dark", 2, "Philosophy", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-portfolio-dark-cards", 3, "Selected Work", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-testimonials-dark-grid", 4, "Client Feedback"),
      blockEl("sb-footer-dark", 5, "Footer", { props: { brandName: "Phantom" } }),
    ],
  },
  {
    name: "Expertise", slug: "/expertise",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar", { props: { brandName: "Phantom", accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-hero-abstract-ambient", 1, "Domains", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-services-dark", 2, "Services Grid"),
      blockEl("sb-content-steps-guide", 3, "Process", { props: { accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-footer-dark", 4, "Footer", { props: { brandName: "Phantom" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar", { props: { brandName: "Phantom", accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-portfolio-case-study", 1, "Featured Work", { props: { dark: true } }),
      blockEl("sb-portfolio-bento", 2, "Archive", { props: { accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-footer-dark", 3, "Footer", { props: { brandName: "Phantom" } }),
    ],
  },
  {
    name: "Studio", slug: "/studio",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar", { props: { brandName: "Phantom", accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-hero-studio", 1, "Culture", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-dark", 2, "Visionaries", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-stats-dark-cards", 3, "Milestones"),
      blockEl("sb-footer-dark", 4, "Footer", { props: { brandName: "Phantom" } }),
    ],
  },
  {
    name: "Journal", slug: "/journal",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar", { props: { brandName: "Phantom", accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-blog-featured", 1, "Latest Thoughts", { props: { dark: true } }),
      blockEl("sb-blog-grid", 2, "Archive", { props: { dark: true } }),
      blockEl("sb-footer-dark", 3, "Footer", { props: { brandName: "Phantom" } }),
    ],
  },
  {
    name: "Engage", slug: "/engage",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar", { props: { brandName: "Phantom", accentColor: "#7C3AED", dark: true } }),
      blockEl("sb-contact-dark", 1, "Start a Dialogue", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark", 2, "Footer", { props: { brandName: "Phantom" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// NEW TEMPLATE 3 — Cascade (Minimal SaaS, 6 pages)
// ─────────────────────────────────────────────────────────────────────────────

const cascadePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-startup", 0, "Navbar", { props: { brandName: "Cascade", accentColor: "#059669" } }),
      blockEl("sb-hero-product", 1, "Product Hero", { props: { accentColor: "#059669" } }),
      blockEl("sb-logos", 2, "Integrations"),
      blockEl("sb-features-icon-3col", 3, "Features Overview", { props: { accentColor: "#059669" } }),
      blockEl("sb-testimonials-wall", 4, "Wall of Love"),
      blockEl("sb-pricing-cascade-minimal", 5, "Simple Pricing", { props: { accentColor: "#059669" } }),
      blockEl("sb-cta-feature", 6, "Get Started CTA", { props: { accentColor: "#059669" } }),
      blockEl("sb-footer-startup", 7, "Footer", { props: { brandName: "Cascade" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-startup", 0, "Navbar", { props: { brandName: "Cascade", accentColor: "#059669" } }),
      blockEl("sb-hero-mobile-showcase", 1, "App Showcase", { props: { accentColor: "#059669" } }),
      blockEl("sb-features-alternating", 2, "Deep Dive", { props: { accentColor: "#059669" } }),
      blockEl("sb-interactive-tabs-features", 3, "Interactive Demo", { props: { accentColor: "#059669" } }),
      blockEl("sb-cta-split-image", 4, "CTA", { props: { accentColor: "#059669" } }),
      blockEl("sb-footer-startup", 5, "Footer", { props: { brandName: "Cascade" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-startup", 0, "Navbar", { props: { brandName: "Cascade", accentColor: "#059669" } }),
      blockEl("sb-pricing-cascade-minimal", 1, "Plans", { props: { accentColor: "#059669" } }),
      blockEl("sb-pricing-comparison-table", 2, "Comparison", { props: { accentColor: "#059669" } }),
      blockEl("sb-faq-cards", 3, "FAQ", { props: { accentColor: "#059669" } }),
      blockEl("sb-footer-startup", 4, "Footer", { props: { brandName: "Cascade" } }),
    ],
  },
  {
    name: "Resources", slug: "/resources",
    elements: [
      blockEl("sb-navbar-startup", 0, "Navbar", { props: { brandName: "Cascade", accentColor: "#059669" } }),
      blockEl("sb-hero-search-centered", 1, "Help Center", { props: { accentColor: "#059669" } }),
      blockEl("sb-blog-grid", 2, "Guides & Tutorials"),
      blockEl("sb-footer-startup", 3, "Footer", { props: { brandName: "Cascade" } }),
    ],
  },
  {
    name: "Login", slug: "/login",
    elements: [
      blockEl("sb-auth-split", 0, "Sign In", { props: { accentColor: "#059669", brandName: "Cascade" } }),
    ],
  },
  {
    name: "Sign Up", slug: "/signup",
    elements: [
      blockEl("sb-auth-split", 0, "Register", { props: { accentColor: "#059669", brandName: "Cascade" } }),
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// SITE_TEMPLATES export
// ─────────────────────────────────────────────────────────────────────────────

export const SITE_TEMPLATES: SiteTemplate[] = [
  {
    id: "saas-launchify",
    name: "Launchify",
    category: "saas",
    description: "High-converting SaaS site with glass navbar, blog, customer showcase, pricing, and team pages.",
    longDescription: "A polished SaaS landing page system with a frosted-glass navbar, gradient hero, logo cloud, bento feature grid, stats, testimonials, pricing table, customer case studies, blog, and a dark CTA section. Seven pages: Home, Features, Pricing, Customers, Blog, About, Contact.",
    tier: "free",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    accentHex: "#6366F1",
    tags: ["SaaS", "Glass", "Pricing", "Indigo", "Modern"],
    features: ["7 pages", "Glass navbar", "Pricing table", "Testimonials", "Case studies", "Blog", "Team page", "Contact form"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#6366F1,#8B5CF6)" },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.22, cols: 3 },
      { type: "stats",        heightRatio: 0.08 },
      { type: "testimonials", heightRatio: 0.12, cols: 3 },
      { type: "pricing",      heightRatio: 0.14, cols: 3 },
      { type: "cta",          heightRatio: 0.08, dark: true },
      { type: "footer",       heightRatio: 0.03, dark: true },
    ],
    pages: launchifyPages,
  },

  {
    id: "portfolio-studio",
    name: "Studio",
    category: "portfolio",
    description: "Ultra-minimal portfolio for designers and creative professionals — with services, blog, and jobs.",
    longDescription: "A clean, typography-first portfolio for studios with a minimal white navbar, editorial hero, portfolio grids, services page, team section, journal/blog, and a quiet footer. Six pages: Home, Work, Services, About, Journal, Contact.",
    tier: "free",
    gradient: "from-gray-700 via-gray-800 to-gray-900",
    accentHex: "#111827",
    tags: ["Portfolio", "Minimal", "Designer", "Creative", "White"],
    features: ["6 pages", "Minimal navbar", "Portfolio grid", "Services page", "About & team", "Journal", "Contact"],
    preview: [
      { type: "navbar",    heightRatio: 0.06 },
      { type: "hero",      heightRatio: 0.22 },
      { type: "portfolio", heightRatio: 0.28, cols: 3 },
      { type: "stats",     heightRatio: 0.07 },
      { type: "cta",       heightRatio: 0.08 },
      { type: "footer",    heightRatio: 0.02 },
    ],
    pages: studioPages,
  },

  {
    id: "agency-apex",
    name: "Apex Creative",
    category: "agency",
    description: "Bold, high-contrast agency site with cinematic hero and dark sections.",
    longDescription: "A jaw-dropping agency site with a bold colorblock navbar, cinematic full-bleed hero, dark services grid, team showcase, and a gradient footer. Five pages: Home, Services, Work, Team, Contact.",
    tier: "free",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    accentHex: "#F97316",
    tags: ["Agency", "Bold", "Dark", "Portfolio", "Services"],
    features: ["5 pages", "Bold navbar", "Cinematic hero", "Services dark", "Team showcase", "Portfolio"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#1a0005,#3b0010)", dark: true },
      { type: "logos",        heightRatio: 0.06, dark: true },
      { type: "services",     heightRatio: 0.22, dark: true, cols: 3 },
      { type: "stats",        heightRatio: 0.08, dark: true },
      { type: "testimonials", heightRatio: 0.12 },
      { type: "cta",          heightRatio: 0.08, dark: true },
      { type: "footer",       heightRatio: 0.03, dark: true },
    ],
    pages: apexPages,
  },

  {
    id: "blog-editorial",
    name: "Editorial",
    category: "blog",
    description: "Clean editorial blog with article pages, author bios, newsletters, and topic discovery.",
    longDescription: "A refined editorial publication with a minimal navbar, large classic hero, blog post grid, dedicated article page with rich text and pull quotes, team about page, and newsletter subscription. Five pages: Home, Blog, Article, About, Newsletter.",
    tier: "free",
    gradient: "from-amber-400 via-orange-400 to-orange-500",
    accentHex: "#F59E0B",
    tags: ["Blog", "Editorial", "Minimal", "Newsletter", "Magazine"],
    features: ["5 pages", "Minimal navbar", "Blog grid", "Article page", "Rich text", "Newsletter", "Author bio"],
    preview: [
      { type: "navbar",  heightRatio: 0.06 },
      { type: "hero",    heightRatio: 0.22, bg: "linear-gradient(135deg,#F59E0B,#D97706)" },
      { type: "blog",    heightRatio: 0.30, cols: 3 },
      { type: "cta",     heightRatio: 0.10, bg: "linear-gradient(135deg,#1C1007,#3B1F00)", dark: true },
      { type: "footer",  heightRatio: 0.02 },
    ],
    pages: editorialPages,
  },

  {
    id: "startup-nexus",
    name: "Nexus",
    category: "startup",
    description: "Dark-mode startup with glowing bento features, blog, interactive tabs, usage pricing, and investor stats.",
    longDescription: "A high-impact dark mode startup site featuring a deep-space navbar, ambient hero, bento feature grid, logo cloud, blog with featured posts, stats section, interactive feature tour, and a gradient CTA. Five pages: Home, Features, Pricing, Blog, About.",
    tier: "free",
    gradient: "from-violet-600 via-indigo-700 to-blue-800",
    accentHex: "#7C3AED",
    tags: ["Startup", "Dark", "Bento", "Pricing", "Industrial", "Blog"],
    features: ["5 pages", "Dark navbar", "Ambient hero", "Bento features", "Interactive tour", "Dark pricing", "Blog"],
    preview: [
      { type: "navbar",   heightRatio: 0.06, dark: true },
      { type: "hero",     heightRatio: 0.28, bg: "linear-gradient(135deg,#0a0014,#1a0040)", dark: true },
      { type: "features", heightRatio: 0.24, dark: true, cols: 3 },
      { type: "logos",    heightRatio: 0.06, dark: true },
      { type: "stats",    heightRatio: 0.09, dark: true },
      { type: "cta",      heightRatio: 0.10, bg: "linear-gradient(135deg,#4F46E5,#7C3AED)", dark: true },
      { type: "footer",   heightRatio: 0.03, dark: true },
    ],
    pages: nexusPages,
  },

  {
    id: "restaurant-ember",
    name: "Ember & Oak",
    category: "restaurant",
    description: "Upscale restaurant with a warm organic hero, review showcase, and reservation CTA.",
    longDescription: "An elegant restaurant website with a glass navbar, organic hero section, press logo cloud, large testimonials, a split CTA for reservations, and a corporate footer. Four pages: Home, Menu, About, Contact.",
    tier: "free",
    gradient: "from-amber-700 via-orange-700 to-red-800",
    accentHex: "#D97706",
    tags: ["Restaurant", "Warm", "Organic", "Reservations", "Fine Dining"],
    features: ["4 pages", "Glass navbar", "Organic hero", "Reviews", "Menu page", "Reservation form"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.30, bg: "linear-gradient(135deg,#3D1F00,#1C1007)", dark: true },
      { type: "logos",        heightRatio: 0.07 },
      { type: "testimonials", heightRatio: 0.18 },
      { type: "cta",          heightRatio: 0.12, bg: "linear-gradient(135deg,#92400E,#451A03)", dark: true },
      { type: "footer",       heightRatio: 0.04 },
    ],
    pages: emberPages,
  },

  {
    id: "health-serenity",
    name: "Serenity",
    category: "health",
    description: "Friendly wellness coach site with playful hero, services, and booking form.",
    longDescription: "A warm, approachable wellness coach site featuring a minimal navbar, playful hero, services grid, testimonials, stats, and a booking contact page. Four pages: Home, Services, About, Book.",
    tier: "free",
    gradient: "from-teal-400 via-cyan-500 to-sky-500",
    accentHex: "#14B8A6",
    tags: ["Health", "Wellness", "Coach", "Booking", "Minimal"],
    features: ["4 pages", "Minimal navbar", "Playful hero", "Services", "Testimonials", "Booking form"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#14B8A6,#06B6D4)" },
      { type: "services",     heightRatio: 0.22, cols: 3 },
      { type: "testimonials", heightRatio: 0.14, cols: 3 },
      { type: "stats",        heightRatio: 0.08 },
      { type: "cta",          heightRatio: 0.09, bg: "linear-gradient(135deg,#0F766E,#0E7490)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: serenityPages,
  },

  {
    id: "blog-chronicle",
    name: "The Chronicle",
    category: "blog",
    description: "Full-featured editorial publication with article pages, authors, topics, and newsletter.",
    longDescription: "A complete blog / online publication with a dedicated navbar, featured post hero, full article page with rich text and pull quotes, author bios, topic browsing with search, and a newsletter-focused footer. Six pages: Home, Blog, Article, Authors, Topics, About.",
    tier: "free",
    gradient: "from-slate-600 via-slate-700 to-slate-900",
    accentHex: "#475569",
    tags: ["Blog", "Publication", "Editorial", "CMS", "Newsletter", "Authors"],
    features: ["6 pages", "Blog navbar", "Article page", "Author bios", "Topic search", "Rich text", "Newsletter"],
    preview: [
      { type: "navbar",  heightRatio: 0.06 },
      { type: "hero",    heightRatio: 0.20 },
      { type: "blog",    heightRatio: 0.34, cols: 3 },
      { type: "cta",     heightRatio: 0.10, bg: "linear-gradient(135deg,#1e293b,#0f172a)", dark: true },
      { type: "footer",  heightRatio: 0.03 },
    ],
    pages: chroniclePages,
  },

  {
    id: "saas-appforge",
    name: "AppForge",
    category: "saas",
    description: "Complete SaaS site with marketing pages, app dashboard, and auth flows.",
    longDescription: "A production-ready SaaS template combining a marketing site (homepage, features, pricing) with a live app dashboard (metrics, charts, data table, sidebar nav) and auth screens. Six pages: Home, Features, Pricing, Dashboard, Sign In, Sign Up.",
    tier: "pro",
    gradient: "from-sky-500 via-blue-600 to-indigo-700",
    accentHex: "#0EA5E9",
    tags: ["SaaS", "Dashboard", "Auth", "Analytics", "Dark", "App"],
    features: ["6 pages", "App sidebar", "Dashboard charts", "Metrics cards", "Data table", "Auth screens", "Pricing comparison"],
    preview: [
      { type: "navbar",   heightRatio: 0.06 },
      { type: "hero",     heightRatio: 0.26, bg: "linear-gradient(135deg,#0EA5E9,#6366F1)" },
      { type: "features", heightRatio: 0.20, cols: 3 },
      { type: "stats",    heightRatio: 0.08 },
      { type: "pricing",  heightRatio: 0.14, cols: 3 },
      { type: "cta",      heightRatio: 0.08, dark: true },
      { type: "footer",   heightRatio: 0.03, dark: true },
    ],
    pages: appforgePages,
  },

  {
    id: "ecommerce-storefront",
    name: "Storefront",
    category: "ecommerce",
    description: "Complete shop with product listing, product detail, cart & checkout, and brand story.",
    longDescription: "A full e-commerce suite with a dedicated shop navbar, product hero, featured products grid, individual product detail with reviews and upsells, cart & checkout flow, and a brand story about page. Five pages: Home, Shop, Product, Cart, About.",
    tier: "pro",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    accentHex: "#10B981",
    tags: ["E-Commerce", "Shop", "Product", "Cart", "Checkout", "Reviews"],
    features: ["5 pages", "Shop navbar", "Product detail", "Cart & checkout", "Reviews", "Upsell section", "Newsletter"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#10B981,#0D9488)" },
      { type: "grid",         heightRatio: 0.26, cols: 3 },
      { type: "logos",        heightRatio: 0.06 },
      { type: "testimonials", heightRatio: 0.12, cols: 3 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#065F46,#134E4A)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: storefrontPages,
  },

  {
    id: "startup-momentum",
    name: "Momentum",
    category: "startup",
    description: "Mobile app landing with showcase hero, interactive feature tour, pricing, blog, and help center.",
    longDescription: "A high-converting mobile app launch site with a device showcase hero, app highlights, interactive tab tour, dark pricing table, full blog, and a searchable FAQ help center. Five pages: Home, Features, Pricing, Blog, FAQ.",
    tier: "free",
    gradient: "from-purple-500 via-violet-600 to-indigo-700",
    accentHex: "#8B5CF6",
    tags: ["Mobile App", "Startup", "Dark", "Interactive", "FAQ", "Blog"],
    features: ["5 pages", "Mobile showcase hero", "Interactive features", "App highlights", "Help center", "FAQ search", "Blog"],
    preview: [
      { type: "navbar",   heightRatio: 0.06, dark: true },
      { type: "hero",     heightRatio: 0.28, bg: "linear-gradient(135deg,#1e0040,#2d0066)", dark: true },
      { type: "features", heightRatio: 0.22, cols: 3, dark: true },
      { type: "stats",    heightRatio: 0.08 },
      { type: "pricing",  heightRatio: 0.14, dark: true, cols: 3 },
      { type: "cta",      heightRatio: 0.08, bg: "linear-gradient(135deg,#7C3AED,#4F46E5)", dark: true },
      { type: "footer",   heightRatio: 0.03, dark: true },
    ],
    pages: momentumPages,
  },

  {
    id: "agency-orbit",
    name: "Orbit Agency",
    category: "agency",
    description: "Full corporate agency with services, case studies, blog, team, and contact map.",
    longDescription: "A comprehensive agency website for studios and consultancies — corporate navbar, enterprise hero, client logos with stats, services, bento case studies, testimonial wall, full blog, team spotlight with hiring, and a map contact page. Six pages: Home, Services, Work, Blog, Team, Contact.",
    tier: "pro",
    gradient: "from-zinc-700 via-zinc-800 to-zinc-950",
    accentHex: "#18181B",
    tags: ["Agency", "Corporate", "Case Studies", "Blog", "Team", "Map"],
    features: ["6 pages", "Corporate navbar", "Enterprise hero", "Case studies", "Blog", "Team hiring", "Map contact", "Mega footer"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#18181b,#3f3f46)", dark: true },
      { type: "logos",        heightRatio: 0.07 },
      { type: "services",     heightRatio: 0.22, cols: 3 },
      { type: "portfolio",    heightRatio: 0.20, cols: 3 },
      { type: "testimonials", heightRatio: 0.12, dark: true },
      { type: "footer",       heightRatio: 0.04, dark: true },
    ],
    pages: orbitPages,
  },

  {
    id: "startup-launchkit",
    name: "LaunchKit",
    category: "startup",
    description: "Waitlist + Product Hunt launch with countdown, roadmap, and minimal pricing.",
    longDescription: "Everything you need to launch a product — announcement bar, waitlist hero, live countdown, Product Hunt badge section, minimal pricing with lifetime deal option, interactive feature tour, before/after comparison, and a public roadmap page. Four pages: Home, Features, Pricing, Roadmap.",
    tier: "free",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    accentHex: "#D946EF",
    tags: ["Launch", "Waitlist", "Product Hunt", "Countdown", "Roadmap", "Startup"],
    features: ["4 pages", "Announcement bar", "Waitlist form", "Countdown timer", "Roadmap", "Minimal pricing", "Feature comparison"],
    preview: [
      { type: "navbar",   heightRatio: 0.05, bg: "linear-gradient(90deg,#7C3AED,#DB2777)", dark: true },
      { type: "hero",     heightRatio: 0.28, bg: "linear-gradient(135deg,#1a0025,#2d0042)", dark: true },
      { type: "features", heightRatio: 0.18, cols: 3 },
      { type: "logos",    heightRatio: 0.06 },
      { type: "cta",      heightRatio: 0.12, bg: "linear-gradient(135deg,#7C3AED,#EC4899)", dark: true },
      { type: "footer",   heightRatio: 0.03, dark: true },
    ],
    pages: launchkitPages,
  },

  {
    id: "saas-launchpad",
    name: "Launchpad",
    category: "saas",
    description: "Full-scale SaaS with frosted navbar, enterprise pricing, dashboard, blog, and auth.",
    longDescription: "The most complete SaaS template — frosted glass navbar, full-bleed SaaS hero, product screenshots, dark bento features, integration logos, dark testimonial grid, enterprise pricing comparison, security trust section, team with open roles, blog, and dual auth pages. Seven pages: Home, Product, Pricing, Blog, About, Sign In, Sign Up.",
    tier: "pro",
    gradient: "from-indigo-600 via-blue-700 to-cyan-700",
    accentHex: "#4F46E5",
    tags: ["SaaS", "Enterprise", "Full Stack", "Dark", "Auth", "Dashboard", "Blog"],
    features: ["7 pages", "Frosted navbar", "Enterprise pricing", "Product gallery", "Security section", "Blog", "Auth screens", "Team & hiring"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#0a0020,#0d1545)", dark: true },
      { type: "logos",        heightRatio: 0.06, dark: true },
      { type: "features",     heightRatio: 0.22, dark: true, cols: 3 },
      { type: "testimonials", heightRatio: 0.12, dark: true, cols: 3 },
      { type: "pricing",      heightRatio: 0.14, dark: true, cols: 3 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#4F46E5,#06B6D4)", dark: true },
      { type: "footer",       heightRatio: 0.03, dark: true },
    ],
    pages: launchpadPages,
  },

  {
    id: "ecommerce-bloom",
    name: "Bloom",
    category: "ecommerce",
    description: "Modern lifestyle e-commerce with product hero, feature checklist, and newsletter.",
    longDescription: "A clean product-forward e-commerce site with a SaaS-style navbar, product showcase hero, feature checklist, stats, reviews, and a newsletter footer. Three pages: Home, Products, About.",
    tier: "pro",
    gradient: "from-rose-400 via-pink-500 to-fuchsia-500",
    accentHex: "#F43F5E",
    tags: ["E-Commerce", "Shop", "Rose", "Product", "Newsletter"],
    features: ["3 pages", "Product hero", "Feature checklist", "Reviews", "Product grid", "Newsletter"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#F43F5E,#BE185D)" },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "stats",        heightRatio: 0.07 },
      { type: "testimonials", heightRatio: 0.12, cols: 3 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#BE185D,#9D174D)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: bloomPages,
  },
  {
    id: "corp-meridian",
    name: "Meridian",
    category: "agency",
    description: "Enterprise-grade scalable corporate template with deep blue aesthetic.",
    longDescription: "Meridian provides a robust, compliant aesthetic designed for global teams, infrastructure startups, and demanding enterprises. Six pages: Home, Platform, Solutions, Customers, Company, Contact.",
    tier: "pro",
    gradient: "from-blue-600 via-blue-700 to-indigo-900",
    accentHex: "#3B82F6",
    tags: ["Enterprise", "Corporate", "Infrastructure", "B2B"],
    features: ["6 pages", "Enterprise hero", "Grid architectures", "Sales contact"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28, dark: true },
      { type: "features",     heightRatio: 0.22 },
      { type: "cta",          heightRatio: 0.12, dark: true },
      { type: "footer",       heightRatio: 0.05 },
    ],
    pages: meridianPages,
  },
  {
    id: "agency-phantom",
    name: "Phantom",
    category: "agency",
    description: "Cinematic, high-contrast dark mode agency experience with violet neon.",
    longDescription: "Immersive dark mode studio template crafted for high-end digital agencies and creative visionaries. Six pages: Home, Expertise, Work, Studio, Journal, Engage.",
    tier: "pro",
    gradient: "from-purple-800 via-violet-900 to-black",
    accentHex: "#7C3AED",
    tags: ["Dark Mode", "Agency", "Cinematic", "Creative"],
    features: ["6 pages", "Phantom grid features", "Cinematic hero", "Dark portfolio"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.28, dark: true },
      { type: "portfolio",    heightRatio: 0.30, dark: true },
      { type: "footer",       heightRatio: 0.05, dark: true },
    ],
    pages: phantomPages,
  },
  {
    id: "saas-cascade",
    name: "Cascade",
    category: "saas",
    description: "Clean, minimal SaaS aesthetic focused on product visualization.",
    longDescription: "An ultra-minimalist SaaS template that strips away distractions to prioritize product UI and simple pricing tiers. Six pages: Home, Product, Pricing, Resources, Login, Sign Up.",
    tier: "free",
    gradient: "from-emerald-400 via-emerald-500 to-emerald-600",
    accentHex: "#059669",
    tags: ["SaaS", "Minimal", "Clean", "Light"],
    features: ["6 pages", "Minimal pricing", "Product hero", "Auth flows"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28 },
      { type: "pricing",      heightRatio: 0.18 },
      { type: "footer",       heightRatio: 0.05 },
    ],
    pages: cascadePages,
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: "all",        label: "All Templates" },
  { id: "saas",       label: "SaaS" },
  { id: "portfolio",  label: "Portfolio" },
  { id: "agency",     label: "Agency" },
  { id: "blog",       label: "Blog" },
  { id: "ecommerce",  label: "E-Commerce" },
  { id: "restaurant", label: "Restaurant" },
  { id: "health",     label: "Health & Wellness" },
  { id: "startup",    label: "Startup" },
] as const;
