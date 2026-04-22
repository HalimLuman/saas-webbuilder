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
  
  if (navLinks && raw.type === "navbar") {
    props = { ...props, navLinks };
  }

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

// =============================================================================
// SaaS TEMPLATES
// =============================================================================

// ─── 1. Pulse — saas-pulse · FREE ─────────────────────────────────────────────
const pulsePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass",       0, "Navbar",       { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-product",       1, "Hero",         { props: { accentColor: "#6366F1" } }),
      blockEl("sb-logos",              2, "Trusted By"),
      blockEl("sb-features-cards",     3, "Features",     { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-alternating",4,"Feature Deep-Dive",{ props: { accentColor: "#6366F1" } }),
      blockEl("sb-testimonials-grid",  5, "Testimonials"),
      blockEl("sb-pricing-minimal",    6, "Pricing",      { props: { accentColor: "#6366F1" } }),
      blockEl("sb-cta-gradient",       7, "CTA",          { props: { accentColor: "#6366F1", title: "Ready to launch?", subtitle: "Start building in minutes." } }),
      blockEl("sb-footer-corporate",   8, "Footer",       { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-glass",          0, "Navbar",          { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-editorial",        1, "Hero",            { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-bold-grid",    2, "Feature Grid",    { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-alternating",  3, "Feature Deep-Dive",{ props: { accentColor: "#6366F1" } }),
      blockEl("sb-content-comparison",    4, "Comparison"),
      blockEl("sb-cta-dark",             5, "CTA",             { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-corporate",      6, "Footer",          { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-glass",          0, "Navbar",      { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-editorial",        1, "Hero",        { props: { accentColor: "#6366F1" } }),
      blockEl("sb-pricing-table",         2, "Plans",       { props: { accentColor: "#6366F1" } }),
      blockEl("sb-pricing-comparison-table",3,"Comparison", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-faq",                   4, "FAQ"),
      blockEl("sb-cta-split",             5, "CTA",         { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-corporate",      6, "Footer",      { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",       { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-blog-featured",    1, "Featured Post"),
      blockEl("sb-blog-grid",        2, "Latest Posts"),
      blockEl("sb-cta-newsletter",   3, "Newsletter",   { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-corporate", 4, "Footer",       { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",   { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-editorial",   1, "Hero",     { props: { accentColor: "#6366F1" } }),
      blockEl("sb-contact-map",      2, "Contact",  { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-corporate", 3, "Footer",   { props: { brandName: "Pulse" } }),
    ],
  },
];

// ─── 2. Orion — saas-orion · PRO ──────────────────────────────────────────────
const orionPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",           { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-abstract-ambient",  1, "Hero",             { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-dark",             2, "Trusted By"),
      blockEl("sb-interactive-tabs-features",3,"Product Tour",    { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-stats-dark-cards",       4, "Stats",            { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-testimonials-wall",      5, "Testimonials"),
      blockEl("sb-saas-integration-logos", 6, "Integrations"),
      blockEl("sb-pricing-dark-cards",     7, "Pricing",          { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-cta-dark",              8, "CTA",              { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",           9, "Footer",           { props: { brandName: "Orion" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",         { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-product",          1, "Hero",           { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-dashboard-overview",    2, "Dashboard",      { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-steps",        3, "Feature Tour",   { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-saas-api-preview",      4, "API Demo",       { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-saas-integration-logos",5, "Integrations"),
      blockEl("sb-cta-dark",             6, "CTA",            { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",          7, "Footer",         { props: { brandName: "Orion" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-dark-gradient",    0, "Navbar",      { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-editorial",          1, "Hero",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-pricing-dark",            2, "Plans",       { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-pricing-comparison-table",3, "Comparison",  { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-content-feature-list",    4, "Volume Info"),
      blockEl("sb-faq-dark",               5, "FAQ",         { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-cta-split",              6, "Talk to Sales",{ props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",            7, "Footer",      { props: { brandName: "Orion" } }),
    ],
  },
  {
    name: "Customers", slug: "/customers",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",        { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-editorial",        1, "Hero",          { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-portfolio-dark-cards",  2, "Case Studies"),
      blockEl("sb-testimonials-wall",     3, "Testimonials"),
      blockEl("sb-logos-dark",            4, "Logo Wall"),
      blockEl("sb-cta-dark",             5, "CTA",           { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",          6, "Footer",        { props: { brandName: "Orion" } }),
    ],
  },
  {
    name: "Company", slug: "/company",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",   { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-editorial",        1, "Hero",     { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-grid",             2, "Team"),
      blockEl("sb-features-cards",        3, "Values",   { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-blog-grid",             4, "Open Roles"),
      blockEl("sb-logos-badges",          5, "Press"),
      blockEl("sb-footer-dark",          6, "Footer",   { props: { brandName: "Orion" } }),
    ],
  },
  {
    name: "Sign In", slug: "/sign-in",
    elements: [
      blockEl("sb-auth-split", 0, "Sign In", { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
    ],
  },
  {
    name: "Sign Up", slug: "/sign-up",
    elements: [
      blockEl("sb-auth-minimal", 0, "Create Account", { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
    ],
  },
];

// ─── 3. Vertex — saas-vertex · PRO ────────────────────────────────────────────
const vertexPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-pill",           0, "Navbar",       { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-hero-feature-stack",    1, "Hero",         { props: { accentColor: "#10B981" } }),
      blockEl("sb-logos",                 2, "Trusted By"),
      blockEl("sb-features-cards",        3, "Features",     { props: { accentColor: "#10B981" } }),
      blockEl("sb-saas-api-preview",      4, "Code Demo",    { props: { accentColor: "#10B981" } }),
      blockEl("sb-stats-dark-cards",      5, "Stats",        { props: { accentColor: "#10B981" } }),
      blockEl("sb-testimonials-grid",     6, "Testimonials"),
      blockEl("sb-pricing-dark-cards",    7, "Pricing",      { props: { accentColor: "#10B981" } }),
      blockEl("sb-saas-integration-logos",8, "Integrations"),
      blockEl("sb-cta-dark",             9, "CTA",          { props: { accentColor: "#10B981", title: "Start building in 60 seconds" } }),
      blockEl("sb-footer-dark",         10, "Footer",        { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Docs", slug: "/docs",
    elements: [
      blockEl("sb-navbar-pill",       0, "Navbar",      { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-dashboard-overview",1, "Docs Layout", { props: { accentColor: "#10B981" } }),
      blockEl("sb-cta-dark",         2, "Sign Up CTA", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",      3, "Footer",      { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-pill",            0, "Navbar",     { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-hero-editorial",         1, "Hero",       { props: { accentColor: "#10B981" } }),
      blockEl("sb-pricing-dark",           2, "Plans",      { props: { accentColor: "#10B981" } }),
      blockEl("sb-content-feature-list",   3, "Usage Info"),
      blockEl("sb-faq-dark",              4, "FAQ",        { props: { accentColor: "#10B981" } }),
      blockEl("sb-cta-dark",             5, "CTA",        { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",          6, "Footer",     { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Integrations", slug: "/integrations",
    elements: [
      blockEl("sb-navbar-pill",            0, "Navbar",        { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-hero-editorial",         1, "Hero",          { props: { accentColor: "#10B981" } }),
      blockEl("sb-saas-integration-logos", 2, "All Integrations"),
      blockEl("sb-cta-split",             3, "Request CTA",  { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",           4, "Footer",       { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-pill",      0, "Navbar",       { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-blog-featured",    1, "Featured Post"),
      blockEl("sb-blog-grid",        2, "All Posts"),
      blockEl("sb-cta-newsletter",   3, "Newsletter",   { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",      4, "Footer",       { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Sign In", slug: "/sign-in",
    elements: [
      blockEl("sb-auth-split", 0, "Sign In", { props: { accentColor: "#10B981", brandName: "Vertex" } }),
    ],
  },
];

// ─── 4. Flux — saas-flux · FREE ───────────────────────────────────────────────
const fluxPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar",      { props: { brandName: "Flux" } }),
      blockEl("sb-hero-editorial-classic",1,"Hero",        { props: { accentColor: "#64748B" } }),
      blockEl("sb-logos",               2, "Trusted By"),
      blockEl("sb-features-checklist",  3, "Features",    { props: { accentColor: "#64748B" } }),
      blockEl("sb-testimonials-grid",   4, "Testimonials"),
      blockEl("sb-pricing-minimal",     5, "Pricing",     { props: { accentColor: "#64748B" } }),
      blockEl("sb-cta-simple",          6, "CTA",         { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",      7, "Footer",      { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar",         { props: { brandName: "Flux" } }),
      blockEl("sb-hero-editorial",       1, "Hero",           { props: { accentColor: "#64748B" } }),
      blockEl("sb-features-alternating", 2, "Feature Details",{ props: { accentColor: "#64748B" } }),
      blockEl("sb-cta-simple",           3, "CTA",            { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",       4, "Footer",         { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-minimal", 0, "Navbar",  { props: { brandName: "Flux" } }),
      blockEl("sb-pricing-table",  1, "Plans",   { props: { accentColor: "#64748B" } }),
      blockEl("sb-faq",            2, "FAQ"),
      blockEl("sb-footer-minimal", 3, "Footer",  { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar",  { props: { brandName: "Flux" } }),
      blockEl("sb-hero-editorial",       1, "Hero",    { props: { accentColor: "#64748B" } }),
      blockEl("sb-team-grid",            2, "Team"),
      blockEl("sb-features-cards",       3, "Values",  { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",       4, "Footer",  { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-minimal",  0, "Navbar",   { props: { brandName: "Flux" } }),
      blockEl("sb-contact-split",   1, "Contact",  { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",  2, "Footer",   { props: { brandName: "Flux" } }),
    ],
  },
];

// =============================================================================
// AGENCY TEMPLATES
// =============================================================================

// ─── 5. Prism — agency-prism · FREE ───────────────────────────────────────────
const prismPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-bold",       0, "Navbar",          { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-cinematic",    1, "Hero",            { props: { accentColor: "#F97316" } }),
      blockEl("sb-features-cards",   2, "Services Preview", { props: { accentColor: "#F97316" } }),
      blockEl("sb-portfolio-bento",  3, "Featured Work",    { props: { accentColor: "#F97316" } }),
      blockEl("sb-logos",            4, "Clients"),
      blockEl("sb-cta-split",        5, "About Teaser",     { props: { accentColor: "#F97316" } }),
      blockEl("sb-testimonials-grid",6, "Testimonials"),
      blockEl("sb-cta-gradient",     7, "CTA",             { props: { accentColor: "#F97316", title: "Start a project" } }),
      blockEl("sb-footer-corporate", 8, "Footer",          { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-bold",       0, "Navbar",       { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",    1, "Hero",         { props: { accentColor: "#F97316" } }),
      blockEl("sb-features-cards",   2, "Services",     { props: { accentColor: "#F97316" } }),
      blockEl("sb-features-steps",   3, "Process",      { props: { accentColor: "#F97316" } }),
      blockEl("sb-team-horizontal",  4, "Team"),
      blockEl("sb-cta-gradient",     5, "CTA",          { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate", 6, "Footer",       { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-bold",      0, "Navbar",      { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",   1, "Hero",        { props: { accentColor: "#F97316" } }),
      blockEl("sb-portfolio-grid",   2, "Projects"),
      blockEl("sb-cta-gradient",    3, "CTA",         { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate",4, "Footer",      { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-bold",       0, "Navbar",    { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",    1, "Hero",      { props: { accentColor: "#F97316" } }),
      blockEl("sb-content-feature-list",2,"Mission"),
      blockEl("sb-team-grid",         3, "Team"),
      blockEl("sb-features-alternating",4,"Culture",  { props: { accentColor: "#F97316" } }),
      blockEl("sb-cta-gradient",      5, "CTA",       { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate",  6, "Footer",    { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-bold",      0, "Navbar",   { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",   1, "Hero",     { props: { accentColor: "#F97316" } }),
      blockEl("sb-contact-map",      2, "Contact",  { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate", 3, "Footer",   { props: { brandName: "Prism" } }),
    ],
  },
];

// ─── 6. Atlas — agency-atlas · PRO ────────────────────────────────────────────
const atlasPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-corporate",    0, "Navbar",          { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-enterprise",     1, "Hero",            { props: { accentColor: "#18181B" } }),
      blockEl("sb-logos",               2, "Clients"),
      blockEl("sb-features-dark-bento", 3, "Services",        { props: { accentColor: "#18181B" } }),
      blockEl("sb-portfolio-case-study",4, "Case Study"),
      blockEl("sb-stats-bold",          5, "Stats",           { props: { accentColor: "#18181B" } }),
      blockEl("sb-team-horizontal",     6, "Team"),
      blockEl("sb-blog-minimal-list",   7, "Blog Preview"),
      blockEl("sb-cta-dark",           8, "CTA",             { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-dark",        9, "Footer",          { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-corporate",      0, "Navbar",     { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-editorial",        1, "Hero",       { props: { accentColor: "#18181B" } }),
      blockEl("sb-features-cards",        2, "Categories", { props: { accentColor: "#18181B" } }),
      blockEl("sb-features-alternating",  3, "Detail",     { props: { accentColor: "#18181B" } }),
      blockEl("sb-content-steps-guide",   4, "Process"),
      blockEl("sb-cta-dark",             5, "CTA",         { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-dark",          6, "Footer",      { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-corporate",    0, "Navbar",     { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-editorial",      1, "Hero",       { props: { accentColor: "#18181B" } }),
      blockEl("sb-portfolio-grid",      2, "Case Studies"),
      blockEl("sb-portfolio-case-study",3, "Featured"),
      blockEl("sb-cta-dark",           4, "CTA",        { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-dark",        5, "Footer",     { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar",       { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-blog-featured",    1, "Featured"),
      blockEl("sb-blog-grid",        2, "Articles"),
      blockEl("sb-cta-newsletter",   3, "Newsletter",   { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-dark",      4, "Footer",       { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Team", slug: "/team",
    elements: [
      blockEl("sb-navbar-corporate",   0, "Navbar",    { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-editorial",     1, "Hero",      { props: { accentColor: "#18181B" } }),
      blockEl("sb-team-grid",          2, "Leadership"),
      blockEl("sb-interactive-tabs-features",3,"Departments",{ props: { accentColor: "#18181B" } }),
      blockEl("sb-features-alternating",4,"Culture"),
      blockEl("sb-team-hiring",        5, "Open Roles"),
      blockEl("sb-footer-dark",        6, "Footer",    { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar",   { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-contact-map",      1, "Contact",  { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-dark",      2, "Footer",   { props: { brandName: "Atlas" } }),
    ],
  },
];

// ─── 7. Cipher — agency-cipher · PRO ──────────────────────────────────────────
const cipherPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark",         0, "Navbar",         { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-cinematic",      1, "Hero",           { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-logos-animated-marquee",2,"Capabilities"),
      blockEl("sb-portfolio-dark-cards",3, "Projects",       { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-split",           4, "Studio Teaser",  { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-testimonials-wall",   5, "Testimonials"),
      blockEl("sb-cta-dark",           6, "CTA",            { props: { accentColor: "#7C3AED", title: "Begin a project" } }),
      blockEl("sb-footer-dark",        7, "Footer",         { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-dark",    0, "Navbar",  { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-editorial", 1, "Hero",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-portfolio-grid", 2, "Projects"),
      blockEl("sb-cta-dark",      3, "CTA",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",   4, "Footer",  { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Studio", slug: "/studio",
    elements: [
      blockEl("sb-navbar-dark",     0, "Navbar",  { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-editorial",  1, "Hero",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-dark",       2, "Team",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-logos-badges",    3, "Awards"),
      blockEl("sb-features-steps",  4, "Process", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",     5, "Footer",  { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-dark",          0, "Navbar",   { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-editorial",       1, "Hero",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-dark-bento",  2, "Services", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-steps",       3, "Process",  { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-dark",            4, "CTA",      { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",         5, "Footer",   { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Journal", slug: "/journal",
    elements: [
      blockEl("sb-navbar-dark",      0, "Navbar",  { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-blog-featured",    1, "Featured"),
      blockEl("sb-blog-minimal-list",2, "Articles"),
      blockEl("sb-footer-dark",      3, "Footer",  { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-dark",   0, "Navbar",   { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-contact-split", 1, "Contact",  { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",   2, "Footer",   { props: { brandName: "Cipher" } }),
    ],
  },
];

// ─── 8. Signal — agency-signal · FREE ─────────────────────────────────────────
const signalPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass",      0, "Navbar",         { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-editorial-classic",1,"Hero",        { props: { accentColor: "#EF4444" } }),
      blockEl("sb-logos",             2, "Clients"),
      blockEl("sb-features-cards",    3, "Services",       { props: { accentColor: "#EF4444" } }),
      blockEl("sb-stats-bold",        4, "Results",        { props: { accentColor: "#EF4444" } }),
      blockEl("sb-portfolio-bento",   5, "Case Studies",   { props: { accentColor: "#EF4444" } }),
      blockEl("sb-testimonials-grid", 6, "Testimonials"),
      blockEl("sb-cta-gradient",      7, "CTA",            { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",  8, "Footer",         { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-glass",         0, "Navbar",   { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-editorial",       1, "Hero",     { props: { accentColor: "#EF4444" } }),
      blockEl("sb-features-cards",       2, "Services", { props: { accentColor: "#EF4444" } }),
      blockEl("sb-features-steps",       3, "Process",  { props: { accentColor: "#EF4444" } }),
      blockEl("sb-saas-integration-logos",4,"Tools"),
      blockEl("sb-cta-gradient",         5, "CTA",      { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",     6, "Footer",   { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "Results", slug: "/results",
    elements: [
      blockEl("sb-navbar-glass",      0, "Navbar",        { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-editorial",    1, "Hero",          { props: { accentColor: "#EF4444" } }),
      blockEl("sb-stats-bold",        2, "Stats Dashboard",{ props: { accentColor: "#EF4444" } }),
      blockEl("sb-portfolio-grid",    3, "Case Studies"),
      blockEl("sb-testimonials-wall", 4, "Testimonials"),
      blockEl("sb-cta-gradient",      5, "CTA",           { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",  6, "Footer",        { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",         { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-editorial",   1, "Hero",           { props: { accentColor: "#EF4444" } }),
      blockEl("sb-team-grid",        2, "Team"),
      blockEl("sb-features-cards",   3, "Values",         { props: { accentColor: "#EF4444" } }),
      blockEl("sb-logos-badges",     4, "Certifications"),
      blockEl("sb-footer-corporate", 5, "Footer",         { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",   { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-contact-split",    1, "Contact",  { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate", 2, "Footer",   { props: { brandName: "Signal" } }),
    ],
  },
];

// =============================================================================
// PORTFOLIO TEMPLATES
// =============================================================================

// ─── 9. Canvas — portfolio-canvas · FREE ──────────────────────────────────────
const canvasPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar",     { props: { brandName: "Canvas" } }),
      blockEl("sb-hero-editorial",       1, "Hero"),
      blockEl("sb-portfolio-bento",      2, "Featured Projects"),
      blockEl("sb-cta-split-image",      3, "About Teaser"),
      blockEl("sb-features-checklist",   4, "Services"),
      blockEl("sb-testimonials-grid",    5, "Testimonials"),
      blockEl("sb-cta-simple",           6, "CTA",        { props: { title: "Let's work together" } }),
      blockEl("sb-footer-minimal",       7, "Footer",     { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-minimal", 0, "Navbar",    { props: { brandName: "Canvas" } }),
      blockEl("sb-hero-editorial", 1, "Hero"),
      blockEl("sb-portfolio-grid", 2, "Projects"),
      blockEl("sb-footer-minimal", 3, "Footer",    { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-minimal",      0, "Navbar"),
      blockEl("sb-hero-editorial",      1, "Bio",         { props: { title: "About Me" } }),
      blockEl("sb-features-checklist",  2, "Skills"),
      blockEl("sb-content-steps-guide", 3, "Experience"),
      blockEl("sb-testimonials-grid",   4, "Testimonials"),
      blockEl("sb-footer-minimal",      5, "Footer",      { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-minimal",      0, "Navbar"),
      blockEl("sb-hero-editorial",      1, "Hero"),
      blockEl("sb-features-alternating",2, "Services"),
      blockEl("sb-pricing-minimal",     3, "Pricing"),
      blockEl("sb-cta-simple",          4, "CTA"),
      blockEl("sb-footer-minimal",      5, "Footer", { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-minimal",    0, "Navbar"),
      blockEl("sb-contact-split",     1, "Contact"),
      blockEl("sb-content-feature-list",2,"Social Links"),
      blockEl("sb-footer-minimal",    3, "Footer", { props: { brandName: "Canvas" } }),
    ],
  },
];

// ─── 10. Folio — portfolio-folio · PRO ────────────────────────────────────────
const folioPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-pill",         0, "Navbar",        { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-hero-feature-stack",  1, "Hero",          { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-portfolio-dark-cards",2, "Projects",      { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-features-dark-bento", 3, "Skills",        { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-content-steps-guide", 4, "Experience"),
      blockEl("sb-blog-minimal-list",   5, "Writing"),
      blockEl("sb-cta-dark",           6, "CTA",           { props: { accentColor: "#06B6D4", title: "Get in touch" } }),
      blockEl("sb-footer-dark",        7, "Footer",        { props: { brandName: "Folio" } }),
    ],
  },
  {
    name: "Projects", slug: "/projects",
    elements: [
      blockEl("sb-navbar-pill",     0, "Navbar",   { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-hero-editorial",  1, "Hero",     { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-portfolio-grid",  2, "All Projects"),
      blockEl("sb-footer-dark",     3, "Footer",   { props: { brandName: "Folio" } }),
    ],
  },
  {
    name: "Experience", slug: "/experience",
    elements: [
      blockEl("sb-navbar-pill",         0, "Navbar",     { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-content-steps-guide", 1, "Timeline"),
      blockEl("sb-features-dark-bento", 2, "Skills",     { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-logos-badges",        3, "Certifications"),
      blockEl("sb-footer-dark",         4, "Footer",     { props: { brandName: "Folio" } }),
    ],
  },
  {
    name: "Writing", slug: "/writing",
    elements: [
      blockEl("sb-navbar-pill",   0, "Navbar",  { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-blog-grid",     1, "Articles"),
      blockEl("sb-footer-dark",   2, "Footer",  { props: { brandName: "Folio" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-pill",          0, "Navbar",       { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-contact-split",        1, "Contact",      { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-content-feature-list", 2, "Social Links"),
      blockEl("sb-footer-dark",          3, "Footer",       { props: { brandName: "Folio" } }),
    ],
  },
];

// =============================================================================
// BLOG TEMPLATES
// =============================================================================

// ─── 11. Ink — blog-ink · FREE ────────────────────────────────────────────────
const inkPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-blog",     0, "Navbar",       { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-blog-featured",   1, "Featured Story"),
      blockEl("sb-content-feature-list",2,"Categories"),
      blockEl("sb-blog-grid",       3, "Latest Posts"),
      blockEl("sb-cta-newsletter",  4, "Newsletter",   { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-minimal",  5, "Footer",       { props: { brandName: "Ink" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-blog",      0, "Navbar",     { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-hero-editorial",   1, "Hero",       { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-blog-list",        2, "All Posts"),
      blockEl("sb-blog-minimal-list",3, "More Posts"),
      blockEl("sb-footer-minimal",   4, "Footer",     { props: { brandName: "Ink" } }),
    ],
  },
  {
    name: "Article", slug: "/blog/article",
    elements: [
      blockEl("sb-navbar-blog",         0, "Navbar",       { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-blog-featured",       1, "Article Header"),
      blockEl("sb-content-rich-text",   2, "Article Body"),
      blockEl("sb-content-blockquote",  3, "Pull Quote",   { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-blog-author",         4, "Author Bio"),
      blockEl("sb-blog-related",        5, "Related"),
      blockEl("sb-cta-newsletter",      6, "Newsletter",   { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-minimal",      7, "Footer",       { props: { brandName: "Ink" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-blog",     0, "Navbar",     { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-hero-editorial",  1, "Mission",    { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-team-grid",       2, "Team"),
      blockEl("sb-footer-minimal",  3, "Footer",     { props: { brandName: "Ink" } }),
    ],
  },
  {
    name: "Newsletter", slug: "/newsletter",
    elements: [
      blockEl("sb-navbar-blog",        0, "Navbar",      { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-hero-editorial-classic",1,"Hero",      { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-features-checklist", 2, "Benefits",   { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-cta-newsletter",     3, "Subscribe",  { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-minimal",     4, "Footer",     { props: { brandName: "Ink" } }),
    ],
  },
];

// ─── 12. Dispatch — blog-dispatch · PRO ───────────────────────────────────────
const dispatchPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar",       { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-blog-featured",     1, "Latest Issue"),
      blockEl("sb-blog-grid",         2, "Past Issues"),
      blockEl("sb-team-horizontal",   3, "Authors"),
      blockEl("sb-features-cards",    4, "Topics",       { props: { accentColor: "#475569" } }),
      blockEl("sb-cta-newsletter",    5, "Subscribe",    { props: { accentColor: "#475569" } }),
      blockEl("sb-footer-dark",       6, "Footer",       { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Issues", slug: "/issues",
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar",  { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-blog-grid",         1, "Archive"),
      blockEl("sb-footer-dark",       2, "Footer",  { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Article", slug: "/issues/article",
    elements: [
      blockEl("sb-navbar-corporate",   0, "Navbar",      { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-blog-featured",      1, "Article Header"),
      blockEl("sb-content-rich-text",  2, "Article Body"),
      blockEl("sb-blog-author",        3, "Author"),
      blockEl("sb-blog-minimal-list",  4, "Related"),
      blockEl("sb-cta-gradient",       5, "Subscribe CTA",{ props: { accentColor: "#475569" } }),
      blockEl("sb-footer-dark",        6, "Footer",       { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Authors", slug: "/authors",
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar",    { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-team-grid",         1, "All Authors"),
      blockEl("sb-footer-dark",       2, "Footer",    { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Topics", slug: "/topics",
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar",     { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-features-cards",    1, "Topics",     { props: { accentColor: "#475569" } }),
      blockEl("sb-blog-grid",         2, "Posts"),
      blockEl("sb-footer-dark",       3, "Footer",     { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Subscribe", slug: "/subscribe",
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar",    { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-hero-editorial-classic",1,"Hero",   { props: { accentColor: "#475569" } }),
      blockEl("sb-pricing-table",     2, "Plans",     { props: { accentColor: "#475569" } }),
      blockEl("sb-faq",               3, "FAQ"),
      blockEl("sb-footer-dark",       4, "Footer",    { props: { brandName: "Dispatch" } }),
    ],
  },
];

// =============================================================================
// E-COMMERCE TEMPLATES
// =============================================================================

// ─── 13. Crate — ecommerce-crate · FREE ───────────────────────────────────────
const cratePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar",    { props: { accentColor: "#10B981", brandName: "Crate" } }),
      blockEl("sb-ecommerce-hero",             1, "Hero",      { props: { accentColor: "#10B981" } }),
      blockEl("sb-features-cards",             2, "Categories",{ props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-featured-products",3, "Products",  { props: { accentColor: "#10B981" } }),
      blockEl("sb-features-checklist",         4, "Value Props",{ props: { accentColor: "#10B981" } }),
      blockEl("sb-testimonials-grid",          5, "Reviews"),
      blockEl("sb-cta-newsletter",             6, "Newsletter",{ props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-corporate",           7, "Footer",    { props: { brandName: "Crate" } }),
    ],
  },
  {
    name: "Shop", slug: "/shop",
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar",    { props: { accentColor: "#10B981", brandName: "Crate" } }),
      blockEl("sb-ecommerce-featured-products",1, "All Products",{ props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-corporate",           2, "Footer",    { props: { brandName: "Crate" } }),
    ],
  },
  {
    name: "Product", slug: "/shop/product",
    elements: [
      blockEl("sb-navbar-ecommerce",         0, "Navbar",         { props: { accentColor: "#10B981", brandName: "Crate" } }),
      blockEl("sb-ecommerce-product-detail", 1, "Product Detail", { props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-reviews",        2, "Reviews"),
      blockEl("sb-ecommerce-upsell",         3, "Related",        { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-corporate",         4, "Footer",         { props: { brandName: "Crate" } }),
    ],
  },
  {
    name: "Cart", slug: "/cart",
    elements: [
      blockEl("sb-navbar-ecommerce",       0, "Navbar",  { props: { accentColor: "#10B981", brandName: "Crate" } }),
      blockEl("sb-ecommerce-cart-checkout",1, "Cart",    { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-minimal",         2, "Footer"),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-ecommerce",  0, "Navbar",      { props: { accentColor: "#10B981", brandName: "Crate" } }),
      blockEl("sb-hero-organic",      1, "Brand Story", { props: { accentColor: "#10B981" } }),
      blockEl("sb-features-cards",    2, "Values",      { props: { accentColor: "#10B981" } }),
      blockEl("sb-team-grid",         3, "Team"),
      blockEl("sb-footer-corporate",  4, "Footer",      { props: { brandName: "Crate" } }),
    ],
  },
];

// ─── 14. Luxe — ecommerce-luxe · PRO ──────────────────────────────────────────
const luxePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark",              0, "Navbar",      { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-hero-cinematic",           1, "Hero",        { props: { accentColor: "#1C1917" } }),
      blockEl("sb-portfolio-bento",          2, "Collections", { props: { accentColor: "#1C1917" } }),
      blockEl("sb-features-alternating",     3, "Spotlight",   { props: { accentColor: "#1C1917" } }),
      blockEl("sb-features-checklist",       4, "Brand Values"),
      blockEl("sb-cta-newsletter",           5, "Newsletter",  { props: { accentColor: "#1C1917" } }),
      blockEl("sb-footer-dark",             6, "Footer",      { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Collection", slug: "/collection",
    elements: [
      blockEl("sb-navbar-dark",              0, "Navbar",     { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-hero-cinematic",           1, "Hero",       { props: { accentColor: "#1C1917" } }),
      blockEl("sb-ecommerce-featured-products",2,"Products"), 
      blockEl("sb-footer-dark",             3, "Footer",     { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Product", slug: "/collection/product",
    elements: [
      blockEl("sb-navbar-dark",             0, "Navbar",         { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-ecommerce-product-detail",1, "Product Detail"),
      blockEl("sb-content-feature-list",    2, "Styling Notes"),
      blockEl("sb-ecommerce-upsell",        3, "Related"),
      blockEl("sb-footer-dark",            4, "Footer",         { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Lookbook", slug: "/lookbook",
    elements: [
      blockEl("sb-navbar-dark",      0, "Navbar",    { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-portfolio-grid",   1, "Lookbook"),
      blockEl("sb-footer-dark",      2, "Footer",    { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-dark",          0, "Navbar",       { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-hero-editorial",       1, "Brand Story",  { props: { accentColor: "#1C1917" } }),
      blockEl("sb-features-alternating", 2, "Our Craft",    { props: { accentColor: "#1C1917" } }),
      blockEl("sb-footer-dark",          3, "Footer",       { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-dark",   0, "Navbar",   { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-contact-split", 1, "Contact"),
      blockEl("sb-contact-map",   2, "Stockists"),
      blockEl("sb-footer-dark",   3, "Footer",   { props: { brandName: "Luxe" } }),
    ],
  },
];

// ─── 15. Market — ecommerce-market · BIZ ──────────────────────────────────────
const marketPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar",     { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-ecommerce-hero",             1, "Hero",       { props: { accentColor: "#2563EB" } }),
      blockEl("sb-features-cards",             2, "Categories", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-featured-products",3, "Featured",   { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-upsell",           4, "Deals",      { props: { accentColor: "#2563EB" } }),
      blockEl("sb-logos",                      5, "Brands"),
      blockEl("sb-cta-newsletter",             6, "Newsletter", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-corporate",           7, "Footer",     { props: { brandName: "Market" } }),
    ],
  },
  {
    name: "Category", slug: "/category",
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar",   { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-hero-editorial",             1, "Hero",     { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-featured-products",2, "Products", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-corporate",           3, "Footer",   { props: { brandName: "Market" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-ecommerce",         0, "Navbar",   { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-ecommerce-product-detail", 1, "Product",  { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-reviews",        2, "Reviews"),
      blockEl("sb-faq",                      3, "Q&A"),
      blockEl("sb-ecommerce-upsell",         4, "Related",  { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-corporate",         5, "Footer",   { props: { brandName: "Market" } }),
    ],
  },
  {
    name: "Cart", slug: "/cart",
    elements: [
      blockEl("sb-navbar-ecommerce",       0, "Navbar", { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-ecommerce-cart-checkout",1, "Cart",   { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-minimal",         2, "Footer"),
    ],
  },
  {
    name: "Seller", slug: "/seller",
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar",          { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-hero-editorial",             1, "Seller Profile",  { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-featured-products",2, "Seller Products", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-reviews",          3, "Seller Reviews"),
      blockEl("sb-footer-corporate",           4, "Footer",          { props: { brandName: "Market" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-ecommerce",  0, "Navbar",     { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-hero-editorial",    1, "Mission",    { props: { accentColor: "#2563EB" } }),
      blockEl("sb-stats-light",       2, "Stats"),
      blockEl("sb-cta-split",         3, "Seller CTA", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-corporate",  4, "Footer",     { props: { brandName: "Market" } }),
    ],
  },
];

// =============================================================================
// STARTUP TEMPLATES
// =============================================================================

// ─── 16. Launch — startup-launch · FREE ───────────────────────────────────────
const launchPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-announcement",   0, "Announcement",  { props: { accentColor: "#D946EF" } }),
      blockEl("sb-landing-waitlist",       1, "Waitlist Hero", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-interactive-countdown", 2, "Countdown",     { props: { accentColor: "#D946EF" } }),
      blockEl("sb-logos",                  3, "Social Proof"),
      blockEl("sb-features-steps",         4, "How It Works", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-cards",         5, "Features",     { props: { accentColor: "#D946EF" } }),
      blockEl("sb-testimonials-grid",      6, "Testimonials"),
      blockEl("sb-pricing-minimal",        7, "Early Pricing", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-content-steps-guide",    8, "Roadmap"),
      blockEl("sb-cta-dark",              9, "Final CTA",    { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",        10,"Footer",        { props: { brandName: "Launch" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-announcement",  0, "Navbar",       { props: { accentColor: "#D946EF" } }),
      blockEl("sb-hero-editorial",       1, "Hero",         { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-dark-bento",  2, "Feature Grid", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-alternating", 3, "Deep Dive",    { props: { accentColor: "#D946EF" } }),
      blockEl("sb-cta-dark",            4, "CTA",          { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",      5, "Footer",       { props: { brandName: "Launch" } }),
    ],
  },
  {
    name: "Roadmap", slug: "/roadmap",
    elements: [
      blockEl("sb-navbar-announcement",    0, "Navbar",    { props: { accentColor: "#D946EF" } }),
      blockEl("sb-hero-editorial",         1, "Hero",      { props: { accentColor: "#D946EF" } }),
      blockEl("sb-content-steps-guide",    2, "Timeline"),
      blockEl("sb-blog-grid",              3, "Feature Requests"),
      blockEl("sb-cta-dark",              4, "CTA",       { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",        5, "Footer",    { props: { brandName: "Launch" } }),
    ],
  },
];

// ─── 17. Ignite — startup-ignite · FREE ───────────────────────────────────────
const ignitePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-pill",           0, "Navbar",     { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-hero-mobile-showcase",  1, "Hero",       { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-cards",        2, "Features",   { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-alternating",  3, "Screenshots",{ props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-stats-light",           4, "Stats"),
      blockEl("sb-testimonials-grid",     5, "Reviews"),
      blockEl("sb-pricing-minimal",       6, "Plans",      { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-cta-gradient",          7, "Download",   { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-corporate",      8, "Footer",     { props: { brandName: "Ignite" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-pill",           0, "Navbar",       { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-hero-mobile-showcase",  1, "Hero",         { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-alternating",  2, "Walkthrough",  { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-cta-gradient",          3, "CTA",          { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-corporate",      4, "Footer",       { props: { brandName: "Ignite" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-pill",           0, "Navbar",     { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-pricing-table",         1, "Plans",      { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-pricing-comparison-table",2,"Comparison",{ props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-faq",                   3, "FAQ"),
      blockEl("sb-footer-corporate",      4, "Footer",     { props: { brandName: "Ignite" } }),
    ],
  },
  {
    name: "FAQ", slug: "/faq",
    elements: [
      blockEl("sb-navbar-pill",   0, "Navbar",  { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-hero-editorial",1, "Hero",    { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-faq",           2, "FAQ"),
      blockEl("sb-cta-simple",    3, "Support CTA",{ props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-corporate",4,"Footer", { props: { brandName: "Ignite" } }),
    ],
  },
];

// ─── 18. Boost — startup-boost · PRO ──────────────────────────────────────────
const boostPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass",          0, "Navbar",      { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-hero-product",          1, "Hero",        { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-logos",                 2, "Customers"),
      blockEl("sb-dashboard-overview",    3, "Product",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-stats-light",           4, "Metrics"),
      blockEl("sb-testimonials-wall",     5, "Testimonials"),
      blockEl("sb-blog-minimal-list",     6, "Blog Preview"),
      blockEl("sb-team-horizontal",       7, "Team"),
      blockEl("sb-pricing-minimal",       8, "Pricing",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-gradient",          9, "CTA",         { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-corporate",     10, "Footer",      { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-glass",           0, "Navbar",     { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-hero-product",           1, "Hero",       { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-interactive-tabs-features",2,"Feature Tour",{ props: { accentColor: "#7C3AED" } }),
      blockEl("sb-saas-integration-logos", 3, "Integrations"),
      blockEl("sb-features-checklist",     4, "Security",   { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-gradient",           5, "CTA",        { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-corporate",       6, "Footer",     { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-glass",            0, "Navbar",     { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-pricing-table",           1, "Plans",      { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-pricing-comparison-table",2, "Comparison", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-content-feature-list",    3, "Volume Info"),
      blockEl("sb-faq",                     4, "FAQ"),
      blockEl("sb-cta-split",              5, "CTA",        { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-corporate",        6, "Footer",     { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",    { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-blog-featured",    1, "Featured"),
      blockEl("sb-blog-grid",        2, "All Posts"),
      blockEl("sb-cta-newsletter",   3, "Newsletter",{ props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-corporate", 4, "Footer",    { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Team", slug: "/team",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",    { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-hero-editorial",   1, "Hero",      { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-grid",        2, "Leadership"),
      blockEl("sb-features-cards",   3, "Values",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-hiring",      4, "Open Roles",{ props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-corporate", 5, "Footer",    { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",   { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-contact-map",      1, "Contact",  { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-corporate", 2, "Footer",   { props: { brandName: "Boost" } }),
    ],
  },
];

// =============================================================================
// RESTAURANT TEMPLATES
// =============================================================================

// ─── 19. Savor — restaurant-savor · FREE ──────────────────────────────────────
const savorPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass",       0, "Navbar",       { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-hero-cinematic",     1, "Hero",         { props: { accentColor: "#D97706" } }),
      blockEl("sb-cta-split",          2, "About Teaser", { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-cards",     3, "Menu Highlights",{ props: { accentColor: "#D97706" } }),
      blockEl("sb-logos-badges",       4, "Press"),
      blockEl("sb-testimonials-grid",  5, "Reviews"),
      blockEl("sb-cta-gradient",       6, "Reserve CTA",  { props: { accentColor: "#D97706", title: "Book a Table" } }),
      blockEl("sb-footer-corporate",   7, "Footer",       { props: { brandName: "Savor" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-glass",            0, "Navbar",      { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-hero-editorial",          1, "Menu Header", { props: { accentColor: "#D97706" } }),
      blockEl("sb-interactive-tabs-features",2,"Categories", { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-cards",          3, "Dishes",      { props: { accentColor: "#D97706" } }),
      blockEl("sb-content-feature-list",    4, "Allergen Info"),
      blockEl("sb-cta-gradient",            5, "Reserve CTA", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",        6, "Footer",      { props: { brandName: "Savor" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-glass",         0, "Navbar",    { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-features-alternating", 1, "Chef Story",{ props: { accentColor: "#D97706" } }),
      blockEl("sb-features-alternating", 2, "Philosophy",{ props: { accentColor: "#D97706" } }),
      blockEl("sb-team-grid",            3, "Team"),
      blockEl("sb-logos-badges",         4, "Awards"),
      blockEl("sb-footer-corporate",     5, "Footer",    { props: { brandName: "Savor" } }),
    ],
  },
  {
    name: "Reservations", slug: "/reservations",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",      { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-contact-split",    1, "Reservations",{ props: { accentColor: "#D97706" } }),
      blockEl("sb-contact-map",      2, "Location",    { props: { accentColor: "#D97706" } }),
      blockEl("sb-cta-simple",       3, "Private CTA", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate", 4, "Footer",      { props: { brandName: "Savor" } }),
    ],
  },
];

// ─── 20. Brew — restaurant-brew · FREE ────────────────────────────────────────
const brewPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",     0, "Navbar",       { props: { brandName: "Brew" } }),
      blockEl("sb-hero-organic",       1, "Hero"),
      blockEl("sb-features-cards",     2, "Seasonal Menu",{ props: { accentColor: "#92400E" } }),
      blockEl("sb-features-cards",     3, "Our Values",   { props: { accentColor: "#92400E" } }),
      blockEl("sb-cta-split",          4, "Our Story",    { props: { accentColor: "#92400E" } }),
      blockEl("sb-testimonials-grid",  5, "Reviews"),
      blockEl("sb-cta-simple",         6, "Visit CTA",    { props: { accentColor: "#92400E" } }),
      blockEl("sb-footer-corporate",   7, "Footer",       { props: { brandName: "Brew" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-minimal",          0, "Navbar",     { props: { brandName: "Brew" } }),
      blockEl("sb-interactive-tabs-features",1,"Menu Sections",{ props: { accentColor: "#92400E" } }),
      blockEl("sb-features-cards",          2, "Items",      { props: { accentColor: "#92400E" } }),
      blockEl("sb-footer-corporate",        3, "Footer",     { props: { brandName: "Brew" } }),
    ],
  },
  {
    name: "Our Story", slug: "/our-story",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-features-alternating", 1, "Origin",      { props: { accentColor: "#92400E" } }),
      blockEl("sb-features-alternating", 2, "Sourcing",    { props: { accentColor: "#92400E" } }),
      blockEl("sb-features-cards",       3, "Community",   { props: { accentColor: "#92400E" } }),
      blockEl("sb-footer-corporate",     4, "Footer",      { props: { brandName: "Brew" } }),
    ],
  },
  {
    name: "Find Us", slug: "/find-us",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-contact-map",          1, "Location"),
      blockEl("sb-content-feature-list", 2, "Hours"),
      blockEl("sb-contact-split",        3, "Contact"),
      blockEl("sb-footer-corporate",     4, "Footer",      { props: { brandName: "Brew" } }),
    ],
  },
];

// =============================================================================
// HEALTH & WELLNESS TEMPLATES
// =============================================================================

// ─── 21. Thrive — health-thrive · FREE ────────────────────────────────────────
const thrivePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar",     { props: { accentColor: "#14B8A6", brandName: "Thrive" } }),
      blockEl("sb-hero-editorial-classic",1,"Hero",       { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-features-cards",       2, "Services",  { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-features-steps",       3, "Process",   { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-testimonials-grid",    4, "Testimonials"),
      blockEl("sb-stats-light",          5, "Stats",     { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-blog-minimal-list",    6, "Articles"),
      blockEl("sb-cta-gradient",         7, "Booking CTA",{ props: { accentColor: "#14B8A6", title: "Book a Free Call" } }),
      blockEl("sb-footer-minimal",       8, "Footer",    { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar",    { props: { accentColor: "#14B8A6", brandName: "Thrive" } }),
      blockEl("sb-hero-editorial",       1, "Hero",      { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-features-cards",       2, "Services",  { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-pricing-table",        3, "Packages",  { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-faq",                  4, "FAQ"),
      blockEl("sb-cta-gradient",         5, "Booking",   { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-minimal",       6, "Footer",    { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-hero-editorial",       1, "Bio",        { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-features-checklist",   2, "Credentials"),
      blockEl("sb-features-alternating", 3, "Philosophy", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-testimonials-grid",    4, "Client Wins"),
      blockEl("sb-footer-minimal",       5, "Footer",     { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-minimal",  0, "Navbar"),
      blockEl("sb-blog-grid",       1, "Articles"),
      blockEl("sb-cta-newsletter",  2, "Newsletter", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-minimal",  3, "Footer",     { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-minimal",  0, "Navbar"),
      blockEl("sb-hero-editorial",  1, "Booking",    { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-contact-split",   2, "Book a Session",{ props: { accentColor: "#14B8A6" } }),
      blockEl("sb-faq-centered",    3, "FAQ"),
      blockEl("sb-footer-minimal",  4, "Footer",     { props: { brandName: "Thrive" } }),
    ],
  },
];

// ─── 22. Revive — health-revive · PRO ─────────────────────────────────────────
const revivePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-bold",       0, "Navbar",     { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-hero-cinematic",    1, "Hero",       { props: { accentColor: "#EF4444" } }),
      blockEl("sb-features-cards",   2, "Classes",    { props: { accentColor: "#EF4444" } }),
      blockEl("sb-stats-bold",        3, "Stats",      { props: { accentColor: "#EF4444" } }),
      blockEl("sb-features-alternating",4,"Trainer Spotlight",{ props: { accentColor: "#EF4444" } }),
      blockEl("sb-pricing-minimal",   5, "Membership", { props: { accentColor: "#EF4444" } }),
      blockEl("sb-testimonials-grid", 6, "Testimonials"),
      blockEl("sb-cta-dark",         7, "CTA",        { props: { accentColor: "#EF4444", title: "Claim your free class" } }),
      blockEl("sb-footer-corporate", 8, "Footer",     { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Classes", slug: "/classes",
    elements: [
      blockEl("sb-navbar-bold",       0, "Navbar",         { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-hero-editorial",    1, "Hero",           { props: { accentColor: "#EF4444" } }),
      blockEl("sb-content-steps-guide",2,"Schedule"),
      blockEl("sb-features-cards",   3, "Class Details",  { props: { accentColor: "#EF4444" } }),
      blockEl("sb-cta-dark",         4, "CTA",            { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate", 5, "Footer",         { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Trainers", slug: "/trainers",
    elements: [
      blockEl("sb-navbar-bold",      0, "Navbar",   { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-hero-editorial",   1, "Hero",     { props: { accentColor: "#EF4444" } }),
      blockEl("sb-team-grid",        2, "Trainers"),
      blockEl("sb-footer-corporate", 3, "Footer",   { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Membership", slug: "/membership",
    elements: [
      blockEl("sb-navbar-bold",            0, "Navbar",        { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-pricing-table",          1, "Plans",         { props: { accentColor: "#EF4444" } }),
      blockEl("sb-pricing-comparison-table",2,"Comparison",   { props: { accentColor: "#EF4444" } }),
      blockEl("sb-faq",                    3, "FAQ"),
      blockEl("sb-cta-dark",              4, "CTA",           { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",       5, "Footer",        { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-bold",      0, "Navbar"),
      blockEl("sb-contact-map",      1, "Location",  { props: { accentColor: "#EF4444" } }),
      blockEl("sb-contact-split",    2, "Contact",   { props: { accentColor: "#EF4444" } }),
      blockEl("sb-content-feature-list",3,"Hours"),
      blockEl("sb-footer-corporate", 4, "Footer",    { props: { brandName: "Revive" } }),
    ],
  },
];

// =============================================================================
// CORPORATE TEMPLATES
// =============================================================================

// ─── 23. Summit — corp-summit · PRO ───────────────────────────────────────────
const summitPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-corporate",    0, "Navbar",        { props: { accentColor: "#1D4ED8", brandName: "Summit" } }),
      blockEl("sb-hero-enterprise",     1, "Hero",          { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-logos",               2, "Customers"),
      blockEl("sb-features-dark-bento", 3, "Solutions",     { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-dashboard-overview",  4, "Platform",      { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-stats-light",         5, "Stats"),
      blockEl("sb-portfolio-case-study",6, "Case Studies"),
      blockEl("sb-logos-badges",        7, "Trust Badges"),
      blockEl("sb-cta-split",          8, "CTA",           { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-corporate",   9, "Footer",        { props: { brandName: "Summit" } }),
    ],
  },
  {
    name: "Solutions", slug: "/solutions",
    elements: [
      blockEl("sb-navbar-corporate",     0, "Navbar",     { props: { accentColor: "#1D4ED8", brandName: "Summit" } }),
      blockEl("sb-hero-editorial",       1, "Hero",       { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-features-cards",       2, "Solutions",  { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-features-alternating", 3, "Detail",     { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-cta-split",           4, "CTA",        { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-corporate",     5, "Footer",     { props: { brandName: "Summit" } }),
    ],
  },
  {
    name: "Platform", slug: "/platform",
    elements: [
      blockEl("sb-navbar-corporate",     0, "Navbar",        { props: { accentColor: "#1D4ED8", brandName: "Summit" } }),
      blockEl("sb-hero-product",         1, "Hero",          { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-features-alternating", 2, "Architecture",  { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-interactive-tabs-features",3,"Capabilities",{ props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-features-checklist",   4, "Security",      { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-saas-integration-logos",5,"Integrations"),
      blockEl("sb-cta-split",           6, "CTA",           { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-corporate",     7, "Footer",        { props: { brandName: "Summit" } }),
    ],
  },
  {
    name: "Company", slug: "/company",
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar",    { props: { accentColor: "#1D4ED8", brandName: "Summit" } }),
      blockEl("sb-hero-editorial",    1, "Mission",   { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-team-grid",         2, "Leadership"),
      blockEl("sb-logos-badges",      3, "Press"),
      blockEl("sb-team-hiring",       4, "Careers",   { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-corporate",  5, "Footer",    { props: { brandName: "Summit" } }),
    ],
  },
  {
    name: "Customers", slug: "/customers",
    elements: [
      blockEl("sb-navbar-corporate",    0, "Navbar",       { props: { accentColor: "#1D4ED8", brandName: "Summit" } }),
      blockEl("sb-hero-editorial",      1, "Hero",         { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-portfolio-grid",      2, "Case Studies"),
      blockEl("sb-testimonials-wall",   3, "Testimonials"),
      blockEl("sb-logos",               4, "All Customers"),
      blockEl("sb-footer-corporate",    5, "Footer",       { props: { brandName: "Summit" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-corporate",  0, "Navbar",   { props: { accentColor: "#1D4ED8", brandName: "Summit" } }),
      blockEl("sb-contact-map",       1, "Contact",  { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-corporate",  2, "Footer",   { props: { brandName: "Summit" } }),
    ],
  },
];

// ─── 24. Meridian — corp-meridian · BIZ ───────────────────────────────────────
const meridianCorpPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",      { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-abstract-ambient",  1, "Hero",        { props: { accentColor: "#0F172A" } }),
      blockEl("sb-logos-dark",             2, "Customers"),
      blockEl("sb-features-dark-bento",    3, "Product",     { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-dashboard-overview",     4, "Architecture",{ props: { accentColor: "#3B82F6" } }),
      blockEl("sb-stats-dark-cards",       5, "Stats",       { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-dark",             6, "Partners"),
      blockEl("sb-testimonials-wall",      7, "Testimonials"),
      blockEl("sb-cta-enterprise-dark",    8, "CTA",         { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",           9, "Footer",      { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Platform", slug: "/platform",
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",     { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-product",           1, "Hero",       { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-alternating",   2, "Components", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-saas-api-preview",       3, "API",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-checklist",     4, "SLA",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-cta-dark",              5, "CTA",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",           6, "Footer",     { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Solutions", slug: "/solutions",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",     { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-editorial",        1, "Hero",       { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-dark-bento",   2, "Industries", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-portfolio-case-study",  3, "Case Studies"),
      blockEl("sb-footer-dark",          4, "Footer",     { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Partners", slug: "/partners",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",       { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-editorial",        1, "Partner Program",{ props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-dark",            2, "Partners"),
      blockEl("sb-pricing-dark",          3, "Tiers",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-contact-split",         4, "Apply",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",          5, "Footer",       { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Company", slug: "/company",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",      { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-editorial",        1, "Mission",     { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-dark",             2, "Leadership",  { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-badges",          3, "Compliance"),
      blockEl("sb-logos-badges",          4, "Press"),
      blockEl("sb-footer-dark",          5, "Footer",      { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",   { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-contact-dark",          1, "Contact",  { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-horizontal",       2, "Sales Team"),
      blockEl("sb-footer-dark",          3, "Footer",   { props: { brandName: "Meridian" } }),
    ],
  },
];

// =============================================================================
// SITE_TEMPLATES EXPORT
// =============================================================================

export const SITE_TEMPLATES: SiteTemplate[] = [
  // ── SaaS ──────────────────────────────────────────────────────────────────
  {
    id: "saas-pulse",
    name: "Pulse",
    category: "saas",
    description: "Clean SaaS landing with indigo glass navbar, product hero, alternating features, and pricing.",
    longDescription: "Pulse is a light-mode, conversion-focused SaaS template designed for early-stage products. Features a glass navbar, bold product hero, logo cloud, feature grid, alternating feature rows, testimonials, pricing preview, and a gradient CTA. Five pages: Home, Features, Pricing, Blog, Contact.",
    tier: "free",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    accentHex: "#6366F1",
    tags: ["SaaS", "Glass", "Light Mode", "Pricing", "Indigo"],
    features: ["5 pages", "Glass navbar", "Product hero", "Feature alternating", "Testimonials", "Pricing", "Blog"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#6366F1,#8B5CF6)" },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.22, cols: 3 },
      { type: "testimonials", heightRatio: 0.12, cols: 3 },
      { type: "pricing",      heightRatio: 0.14, cols: 3 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#6366F1,#8B5CF6)", dark: true },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: pulsePages,
  },
  {
    id: "saas-orion",
    name: "Orion",
    category: "saas",
    description: "Dark-mode SaaS for AI and analytics platforms — ambient hero, tabs, testimonial wall, and dark pricing.",
    longDescription: "Orion is a full dark-mode SaaS template targeting technical and enterprise buyers. Features a dark gradient navbar, ambient hero with animated particles, tabbed product tour, stats, testimonial wall, integration grid, dark pricing, and auth pages. Seven pages: Home, Product, Pricing, Customers, Company, Sign In, Sign Up.",
    tier: "pro",
    gradient: "from-blue-600 via-blue-700 to-indigo-900",
    accentHex: "#3B82F6",
    tags: ["SaaS", "Dark Mode", "AI", "Analytics", "Enterprise"],
    features: ["7 pages", "Dark navbar", "Ambient hero", "Product tour", "Stats", "Testimonial wall", "Auth pages"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#0a0020,#0d1545)", dark: true },
      { type: "features",     heightRatio: 0.22, dark: true, cols: 3 },
      { type: "testimonials", heightRatio: 0.12, dark: true },
      { type: "pricing",      heightRatio: 0.14, dark: true, cols: 3 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#1D4ED8,#3B82F6)", dark: true },
      { type: "footer",       heightRatio: 0.03, dark: true },
    ],
    pages: orionPages,
  },
  {
    id: "saas-vertex",
    name: "Vertex",
    category: "saas",
    description: "Developer-tool SaaS with pill navbar, terminal hero, code demo, and dark pricing.",
    longDescription: "Vertex is built for developer tools, APIs, and infrastructure products. Features a pill navbar, feature-stack hero with terminal/code aesthetic, API preview, dark stats, engineer-focused testimonials, integration grid, and dark pricing. Six pages: Home, Docs, Pricing, Integrations, Blog, Sign In.",
    tier: "pro",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    accentHex: "#10B981",
    tags: ["Developer", "API", "Dark Mode", "Code", "Infrastructure"],
    features: ["6 pages", "Pill navbar", "Code demo", "API preview", "Dark pricing", "Integrations", "Blog"],
    preview: [
      { type: "navbar",   heightRatio: 0.06, dark: true },
      { type: "hero",     heightRatio: 0.26, bg: "linear-gradient(135deg,#064E3B,#065F46)", dark: true },
      { type: "features", heightRatio: 0.22, dark: true, cols: 3 },
      { type: "stats",    heightRatio: 0.09, dark: true },
      { type: "pricing",  heightRatio: 0.14, dark: true, cols: 3 },
      { type: "cta",      heightRatio: 0.08, bg: "linear-gradient(135deg,#10B981,#059669)", dark: true },
      { type: "footer",   heightRatio: 0.03, dark: true },
    ],
    pages: vertexPages,
  },
  {
    id: "saas-flux",
    name: "Flux",
    category: "saas",
    description: "Pure light-mode B2B SaaS with minimal navbar, checklist features, and clean pricing.",
    longDescription: "Flux is a distraction-free, professional SaaS template for B2B buyers who value clarity. Features a minimal navbar, left-aligned classic hero, logo cloud, checklist features, testimonials, pricing, and a simple CTA. Five pages: Home, Features, Pricing, About, Contact.",
    tier: "free",
    gradient: "from-slate-500 via-slate-600 to-slate-800",
    accentHex: "#64748B",
    tags: ["SaaS", "Minimal", "B2B", "Light Mode", "Clean"],
    features: ["5 pages", "Minimal navbar", "Checklist features", "Clean pricing", "Testimonials", "About page"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.22 },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.18, cols: 2 },
      { type: "testimonials", heightRatio: 0.12, cols: 3 },
      { type: "pricing",      heightRatio: 0.14, cols: 3 },
      { type: "cta",          heightRatio: 0.08 },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: fluxPages,
  },

  // ── Agency ─────────────────────────────────────────────────────────────────
  {
    id: "agency-prism",
    name: "Prism",
    category: "agency",
    description: "Bold orange creative agency with cinematic hero, portfolio bento, and process steps.",
    longDescription: "Prism is an energetic creative agency template with a bold navbar, full-bleed cinematic hero, services preview, portfolio bento grid, client logos, testimonials, and a gradient CTA. Five pages: Home, Services, Work, About, Contact.",
    tier: "free",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    accentHex: "#F97316",
    tags: ["Agency", "Bold", "Orange", "Portfolio", "Creative"],
    features: ["5 pages", "Bold navbar", "Cinematic hero", "Portfolio bento", "Services", "Process steps"],
    preview: [
      { type: "navbar",    heightRatio: 0.06 },
      { type: "hero",      heightRatio: 0.28, bg: "linear-gradient(135deg,#1a0005,#3b0010)", dark: true },
      { type: "services",  heightRatio: 0.18, cols: 3 },
      { type: "portfolio", heightRatio: 0.20, cols: 2 },
      { type: "logos",     heightRatio: 0.06 },
      { type: "cta",       heightRatio: 0.10, bg: "linear-gradient(135deg,#F97316,#EF4444)", dark: true },
      { type: "footer",    heightRatio: 0.03 },
    ],
    pages: prismPages,
  },
  {
    id: "agency-atlas",
    name: "Atlas",
    category: "agency",
    description: "Sophisticated dark corporate agency with bento services, case studies, team, and blog.",
    longDescription: "Atlas is a premium corporate agency template for full-service agencies working with enterprise clients. Features corporate navbar, enterprise hero, dark bento services, case study callout, team strip, blog preview, and team hiring. Six pages: Home, Services, Work, Blog, Team, Contact.",
    tier: "pro",
    gradient: "from-zinc-700 via-zinc-800 to-zinc-950",
    accentHex: "#18181B",
    tags: ["Agency", "Corporate", "Dark", "Case Studies", "Enterprise"],
    features: ["6 pages", "Corporate navbar", "Dark bento", "Case studies", "Blog", "Team hiring"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#09090b,#27272a)", dark: true },
      { type: "services",     heightRatio: 0.22, dark: true, cols: 3 },
      { type: "portfolio",    heightRatio: 0.18, cols: 3 },
      { type: "testimonials", heightRatio: 0.12, dark: true },
      { type: "footer",       heightRatio: 0.04, dark: true },
    ],
    pages: atlasPages,
  },
  {
    id: "agency-cipher",
    name: "Cipher",
    category: "agency",
    description: "Cinematic dark-mode boutique studio with violet neon, marquee, and portfolio showcase.",
    longDescription: "Cipher is an immersive dark-mode studio template for high-end creative agencies. Features a dark minimal navbar, full-screen cinematic hero, animated marquee, dark portfolio grid, journal blog, and a studio profile. Six pages: Home, Work, Studio, Services, Journal, Contact.",
    tier: "pro",
    gradient: "from-purple-800 via-violet-900 to-black",
    accentHex: "#7C3AED",
    tags: ["Agency", "Dark Mode", "Cinematic", "Violet", "Boutique"],
    features: ["6 pages", "Cinematic hero", "Animated marquee", "Dark portfolio", "Journal", "Studio page"],
    preview: [
      { type: "navbar",    heightRatio: 0.06, dark: true },
      { type: "hero",      heightRatio: 0.30, bg: "linear-gradient(135deg,#0a0014,#1a0040)", dark: true },
      { type: "portfolio", heightRatio: 0.28, dark: true, cols: 3 },
      { type: "cta",       heightRatio: 0.10, dark: true },
      { type: "footer",    heightRatio: 0.04, dark: true },
    ],
    pages: cipherPages,
  },
  {
    id: "agency-signal",
    name: "Signal",
    category: "agency",
    description: "Performance marketing agency with bold stats, case studies, and red/orange gradient CTA.",
    longDescription: "Signal is a results-focused template for growth and performance marketing agencies. Features a glass navbar, stat-overlay hero, services cards, bold metrics, portfolio bento, and CMO-level testimonials. Five pages: Home, Services, Results, About, Contact.",
    tier: "free",
    gradient: "from-red-500 via-orange-500 to-amber-500",
    accentHex: "#EF4444",
    tags: ["Agency", "Performance", "Marketing", "Stats", "Results"],
    features: ["5 pages", "Glass navbar", "Stat hero", "Bold metrics", "Case studies", "Certifications"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#FEF3C7,#FDE68A)" },
      { type: "services",     heightRatio: 0.18, cols: 3 },
      { type: "stats",        heightRatio: 0.10, bg: "linear-gradient(135deg,#EF4444,#F97316)", dark: true },
      { type: "portfolio",    heightRatio: 0.20, cols: 2 },
      { type: "testimonials", heightRatio: 0.12, cols: 3 },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: signalPages,
  },

  // ── Portfolio ──────────────────────────────────────────────────────────────
  {
    id: "portfolio-canvas",
    name: "Canvas",
    category: "portfolio",
    description: "Light typography-forward portfolio for designers with work grid, services, and contact.",
    longDescription: "Canvas is an editorial, refined personal portfolio template for designers and illustrators. Features a minimal navbar, editorial hero, featured project bento, services checklist, testimonials, and a minimal footer. Five pages: Home, Work, About, Services, Contact.",
    tier: "free",
    gradient: "from-gray-700 via-gray-800 to-gray-900",
    accentHex: "#374151",
    tags: ["Portfolio", "Minimal", "Designer", "Light Mode", "Creative"],
    features: ["5 pages", "Minimal navbar", "Portfolio bento", "Services list", "Testimonials", "Skills"],
    preview: [
      { type: "navbar",    heightRatio: 0.06 },
      { type: "hero",      heightRatio: 0.20 },
      { type: "portfolio", heightRatio: 0.28, cols: 2 },
      { type: "services",  heightRatio: 0.14, cols: 2 },
      { type: "cta",       heightRatio: 0.08 },
      { type: "footer",    heightRatio: 0.02 },
    ],
    pages: canvasPages,
  },
  {
    id: "portfolio-folio",
    name: "Folio",
    category: "portfolio",
    description: "Dark developer portfolio with terminal hero, skills bento, experience timeline, and writing.",
    longDescription: "Folio is a technical dark-mode portfolio for software engineers and developers. Features a pill navbar, terminal-style hero, dark project cards, skills bento, experience timeline, writing/blog, and social links. Five pages: Home, Projects, Experience, Writing, Contact.",
    tier: "pro",
    gradient: "from-cyan-500 via-sky-600 to-blue-700",
    accentHex: "#06B6D4",
    tags: ["Portfolio", "Developer", "Dark Mode", "Technical", "Blog"],
    features: ["5 pages", "Pill navbar", "Terminal hero", "Dark projects", "Skills bento", "Experience", "Writing"],
    preview: [
      { type: "navbar",    heightRatio: 0.06, dark: true },
      { type: "hero",      heightRatio: 0.26, bg: "linear-gradient(135deg,#0a1628,#0c2340)", dark: true },
      { type: "portfolio", heightRatio: 0.24, dark: true, cols: 2 },
      { type: "features",  heightRatio: 0.18, dark: true, cols: 3 },
      { type: "blog",      heightRatio: 0.14, dark: true },
      { type: "footer",    heightRatio: 0.03, dark: true },
    ],
    pages: folioPages,
  },

  // ── Blog ───────────────────────────────────────────────────────────────────
  {
    id: "blog-ink",
    name: "Ink",
    category: "blog",
    description: "Editorial amber blog with featured story, category nav, article page, and newsletter.",
    longDescription: "Ink is a writer-first editorial blog template with a dedicated blog navbar, large featured story, category navigation, article grid, full article page with pull quotes and author bio, newsletter subscription, and an about page. Five pages: Home, Blog, Article, About, Newsletter.",
    tier: "free",
    gradient: "from-amber-400 via-orange-400 to-orange-500",
    accentHex: "#F59E0B",
    tags: ["Blog", "Editorial", "Newsletter", "Amber", "Writer"],
    features: ["5 pages", "Blog navbar", "Featured story", "Article page", "Pull quotes", "Author bio", "Newsletter"],
    preview: [
      { type: "navbar",  heightRatio: 0.06 },
      { type: "hero",    heightRatio: 0.22, bg: "linear-gradient(135deg,#F59E0B,#D97706)" },
      { type: "blog",    heightRatio: 0.32, cols: 3 },
      { type: "cta",     heightRatio: 0.10, bg: "linear-gradient(135deg,#78350F,#451A03)", dark: true },
      { type: "footer",  heightRatio: 0.02 },
    ],
    pages: inkPages,
  },
  {
    id: "blog-dispatch",
    name: "Dispatch",
    category: "blog",
    description: "Magazine-style publication with issues, article page, author grid, topics, and paywall subscribe.",
    longDescription: "Dispatch is a professional editorial publication template for newsletter companies and media brands. Features a corporate navbar, featured issue hero, issue grid, author spotlights, topic browser, and a subscriber pricing page. Six pages: Home, Issues, Article, Authors, Topics, Subscribe.",
    tier: "pro",
    gradient: "from-slate-600 via-slate-700 to-slate-900",
    accentHex: "#475569",
    tags: ["Blog", "Publication", "Magazine", "Newsletter", "Paywall"],
    features: ["6 pages", "Corporate navbar", "Issue archive", "Article page", "Author grid", "Subscribe pricing"],
    preview: [
      { type: "navbar",  heightRatio: 0.06 },
      { type: "hero",    heightRatio: 0.22 },
      { type: "blog",    heightRatio: 0.32, cols: 3 },
      { type: "team",    heightRatio: 0.12 },
      { type: "cta",     heightRatio: 0.10, bg: "linear-gradient(135deg,#1e293b,#0f172a)", dark: true },
      { type: "footer",  heightRatio: 0.03, dark: true },
    ],
    pages: dispatchPages,
  },

  // ── E-Commerce ─────────────────────────────────────────────────────────────
  {
    id: "ecommerce-crate",
    name: "Crate",
    category: "ecommerce",
    description: "Clean emerald e-commerce with product grid, product detail, cart checkout, and brand story.",
    longDescription: "Crate is a friction-free small store template. Features an e-commerce navbar, product hero, category cards, featured products, value checklist, reviews, newsletter, full product detail with reviews and upsells, cart checkout, and an about page. Five pages: Home, Shop, Product, Cart, About.",
    tier: "free",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    accentHex: "#10B981",
    tags: ["E-Commerce", "Shop", "Emerald", "Product", "Cart"],
    features: ["5 pages", "E-commerce navbar", "Product grid", "Product detail", "Reviews", "Cart checkout"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#10B981,#0D9488)" },
      { type: "grid",         heightRatio: 0.26, cols: 4 },
      { type: "testimonials", heightRatio: 0.12, cols: 3 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#065F46,#134E4A)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: cratePages,
  },
  {
    id: "ecommerce-luxe",
    name: "Luxe",
    category: "ecommerce",
    description: "High-end fashion/lifestyle brand with cinematic hero, editorial product showcase, and lookbook.",
    longDescription: "Luxe is a luxury brand template for fashion, artisan goods, and premium lifestyle products. Features a centered dark navbar, full-screen cinematic hero, collection bento, editorial alternating product showcases, lookbook grid, brand story, and stockist map. Six pages: Home, Collection, Product, Lookbook, About, Contact.",
    tier: "pro",
    gradient: "from-stone-700 via-stone-800 to-stone-950",
    accentHex: "#1C1917",
    tags: ["E-Commerce", "Luxury", "Fashion", "Dark", "Editorial"],
    features: ["6 pages", "Dark navbar", "Cinematic hero", "Lookbook", "Editorial layout", "Stockist map"],
    preview: [
      { type: "navbar",    heightRatio: 0.06, dark: true },
      { type: "hero",      heightRatio: 0.34, bg: "linear-gradient(135deg,#0c0a09,#1c1917)", dark: true },
      { type: "portfolio", heightRatio: 0.24, dark: true, cols: 2 },
      { type: "image-text",heightRatio: 0.20, dark: true },
      { type: "cta",       heightRatio: 0.08, dark: true },
      { type: "footer",    heightRatio: 0.03, dark: true },
    ],
    pages: luxePages,
  },
  {
    id: "ecommerce-market",
    name: "Market",
    category: "ecommerce",
    description: "Multi-category marketplace with deals, seller profiles, product Q&A, and full checkout.",
    longDescription: "Market is a multi-vendor marketplace template for large product catalogs. Features a prominent search navbar, hero banner, category grid, featured and deals sections, full product detail with Q&A, seller profiles, and checkout. Six pages: Home, Category, Product, Cart, Seller, About.",
    tier: "business",
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    accentHex: "#2563EB",
    tags: ["E-Commerce", "Marketplace", "Multi-vendor", "Blue", "Enterprise"],
    features: ["6 pages", "Search navbar", "Category grid", "Q&A", "Seller profiles", "Full checkout"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.22, bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)" },
      { type: "grid",         heightRatio: 0.28, cols: 4 },
      { type: "logos",        heightRatio: 0.06 },
      { type: "testimonials", heightRatio: 0.10, cols: 3 },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: marketPages,
  },

  // ── Startup ────────────────────────────────────────────────────────────────
  {
    id: "startup-launch",
    name: "Launch",
    category: "startup",
    description: "Pre-launch waitlist page with countdown, roadmap, early pricing, and announcement bar.",
    longDescription: "Launch has everything you need to capture early users before going live — announcement bar, waitlist hero, live countdown, social proof, how-it-works steps, feature cards, beta testimonials, early-bird pricing, and a public roadmap. Three pages: Home, Features, Roadmap.",
    tier: "free",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    accentHex: "#D946EF",
    tags: ["Startup", "Waitlist", "Pre-launch", "Countdown", "Roadmap"],
    features: ["3 pages", "Announcement bar", "Waitlist form", "Countdown", "Early pricing", "Roadmap"],
    preview: [
      { type: "navbar",   heightRatio: 0.05, bg: "linear-gradient(90deg,#7C3AED,#DB2777)", dark: true },
      { type: "hero",     heightRatio: 0.28, bg: "linear-gradient(135deg,#1a0025,#2d0042)", dark: true },
      { type: "features", heightRatio: 0.18, cols: 3 },
      { type: "logos",    heightRatio: 0.06 },
      { type: "cta",      heightRatio: 0.12, bg: "linear-gradient(135deg,#7C3AED,#EC4899)", dark: true },
      { type: "footer",   heightRatio: 0.03, dark: true },
    ],
    pages: launchPages,
  },
  {
    id: "startup-ignite",
    name: "Ignite",
    category: "startup",
    description: "Mobile app landing with device showcase hero, app store badges, and interactive features.",
    longDescription: "Ignite is a high-converting mobile app landing site with a large phone mockup hero, feature cards, alternating app screenshots, stats, app-store-style reviews, pricing toggle, and an app download CTA. Four pages: Home, Features, Pricing, FAQ.",
    tier: "free",
    gradient: "from-purple-500 via-violet-600 to-indigo-700",
    accentHex: "#8B5CF6",
    tags: ["Mobile App", "Startup", "Purple", "Download", "FAQ"],
    features: ["4 pages", "Mobile showcase hero", "App screenshots", "Stats", "FAQ search", "Pricing toggle"],
    preview: [
      { type: "navbar",   heightRatio: 0.06, dark: true },
      { type: "hero",     heightRatio: 0.28, bg: "linear-gradient(135deg,#1e0040,#2d0066)", dark: true },
      { type: "features", heightRatio: 0.22, cols: 3 },
      { type: "stats",    heightRatio: 0.08 },
      { type: "pricing",  heightRatio: 0.14, cols: 3 },
      { type: "cta",      heightRatio: 0.08, bg: "linear-gradient(135deg,#7C3AED,#4F46E5)", dark: true },
      { type: "footer",   heightRatio: 0.03 },
    ],
    pages: ignitePages,
  },
  {
    id: "startup-boost",
    name: "Boost",
    category: "startup",
    description: "Investor-grade scale-up template with dashboard preview, testimonial wall, blog, and team.",
    longDescription: "Boost is designed for funded startups needing to impress enterprise buyers. Features a glass navbar, bold stat claims hero, enterprise logo cloud, product dashboard preview, animated metrics, testimonial wall, blog, team strip, and two-tier CTA. Six pages: Home, Product, Pricing, Blog, Team, Contact.",
    tier: "pro",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    accentHex: "#7C3AED",
    tags: ["Startup", "Scale-up", "Violet", "Dashboard", "Investor"],
    features: ["6 pages", "Glass navbar", "Dashboard preview", "Testimonial wall", "Blog", "Team & hiring"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#3B0764,#1E1B4B)" },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.20, cols: 3 },
      { type: "stats",        heightRatio: 0.08 },
      { type: "testimonials", heightRatio: 0.14, dark: true },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#7C3AED,#4F46E5)", dark: true },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: boostPages,
  },

  // ── Restaurant ─────────────────────────────────────────────────────────────
  {
    id: "restaurant-savor",
    name: "Savor",
    category: "restaurant",
    description: "Upscale fine dining with cinematic hero, tabbed menu, chef story, and reservation form.",
    longDescription: "Savor is a photography-forward fine dining template. Features a glass navbar, full-screen cinematic hero, menu highlights, press logos, diner reviews, a reservation gradient CTA, tabbed menu with allergen info, chef story, and a contact reservation form. Four pages: Home, Menu, About, Reservations.",
    tier: "free",
    gradient: "from-amber-700 via-orange-800 to-red-900",
    accentHex: "#D97706",
    tags: ["Restaurant", "Fine Dining", "Amber", "Reservations", "Cinematic"],
    features: ["4 pages", "Cinematic hero", "Tabbed menu", "Chef story", "Press logos", "Reservation form"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.32, bg: "linear-gradient(135deg,#3D1F00,#1C1007)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "logos",        heightRatio: 0.06 },
      { type: "testimonials", heightRatio: 0.16 },
      { type: "cta",          heightRatio: 0.10, bg: "linear-gradient(135deg,#92400E,#78350F)", dark: true },
      { type: "footer",       heightRatio: 0.04 },
    ],
    pages: savorPages,
  },
  {
    id: "restaurant-brew",
    name: "Brew",
    category: "restaurant",
    description: "Warm cozy café with organic hero, seasonal menu tabs, founder story, and location map.",
    longDescription: "Brew is a warm, community-focused café template with an organic photography hero, seasonal specials cards, values section, founder story, customer reviews, tabbed menu, sourcing philosophy, and location map. Four pages: Home, Menu, Our Story, Find Us.",
    tier: "free",
    gradient: "from-amber-800 via-orange-900 to-stone-900",
    accentHex: "#92400E",
    tags: ["Restaurant", "Café", "Cozy", "Organic", "Community"],
    features: ["4 pages", "Organic hero", "Tabbed menu", "Founder story", "Values", "Location map"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#451A03,#78350F)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "testimonials", heightRatio: 0.14 },
      { type: "cta",          heightRatio: 0.08 },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: brewPages,
  },

  // ── Health & Wellness ──────────────────────────────────────────────────────
  {
    id: "health-thrive",
    name: "Thrive",
    category: "health",
    description: "Teal wellness coaching site with services, booking form, blog articles, and credentials.",
    longDescription: "Thrive is a warm, approachable wellness coach template. Features a minimal navbar, classic editorial hero, services grid, process steps, client testimonials, stats, blog preview, and a booking contact page. Five pages: Home, Services, About, Blog, Book.",
    tier: "free",
    gradient: "from-teal-400 via-cyan-500 to-sky-500",
    accentHex: "#14B8A6",
    tags: ["Health", "Wellness", "Coach", "Teal", "Booking"],
    features: ["5 pages", "Minimal navbar", "Services grid", "Booking form", "Blog", "Testimonials"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#CCFBF1,#99F6E4)" },
      { type: "services",     heightRatio: 0.22, cols: 3 },
      { type: "testimonials", heightRatio: 0.14, cols: 3 },
      { type: "stats",        heightRatio: 0.08 },
      { type: "cta",          heightRatio: 0.10, bg: "linear-gradient(135deg,#0F766E,#0E7490)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: thrivePages,
  },
  {
    id: "health-revive",
    name: "Revive",
    category: "health",
    description: "High-energy fitness studio with dark cinematic hero, class schedule, trainer grid, and membership.",
    longDescription: "Revive is built for gyms, CrossFit boxes, and yoga studios. Features a bold dark navbar, full-bleed cinematic action hero, class type cards, bold stats, trainer spotlight, membership pricing, member testimonials, and a gym contact page. Five pages: Home, Classes, Trainers, Membership, Contact.",
    tier: "pro",
    gradient: "from-red-600 via-orange-600 to-amber-500",
    accentHex: "#EF4444",
    tags: ["Health", "Fitness", "Gym", "Dark", "Energy"],
    features: ["5 pages", "Bold dark navbar", "Cinematic hero", "Class schedule", "Trainer grid", "Membership pricing"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.30, bg: "linear-gradient(135deg,#1a0000,#3b0000)", dark: true },
      { type: "services",     heightRatio: 0.18, cols: 4 },
      { type: "stats",        heightRatio: 0.10, bg: "linear-gradient(135deg,#EF4444,#F97316)", dark: true },
      { type: "testimonials", heightRatio: 0.12 },
      { type: "cta",          heightRatio: 0.08, dark: true },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: revivePages,
  },

  // ── Corporate ──────────────────────────────────────────────────────────────
  {
    id: "corp-summit",
    name: "Summit",
    category: "corporate",
    description: "Enterprise B2B platform site with navy blue, trust badges, solutions grid, and demo CTA.",
    longDescription: "Summit is an authoritative enterprise corporate template for B2B platforms targeting Fortune 500 buyers. Features corporate mega-menu navbar, enterprise hero, logo cloud, solutions bento, platform dashboard, stats, case studies, trust badges, and a dual-CTA. Six pages: Home, Solutions, Platform, Company, Customers, Contact.",
    tier: "pro",
    gradient: "from-blue-700 via-blue-800 to-indigo-900",
    accentHex: "#1D4ED8",
    tags: ["Corporate", "Enterprise", "B2B", "Navy", "Trust"],
    features: ["6 pages", "Corporate navbar", "Enterprise hero", "Solutions grid", "Platform preview", "Trust badges", "Case studies"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.22, cols: 3 },
      { type: "stats",        heightRatio: 0.08 },
      { type: "portfolio",    heightRatio: 0.18, cols: 2 },
      { type: "cta",          heightRatio: 0.10, bg: "linear-gradient(135deg,#1D4ED8,#1e40af)", dark: true },
      { type: "footer",       heightRatio: 0.04 },
    ],
    pages: summitPages,
  },
  {
    id: "corp-meridian",
    name: "Meridian",
    category: "corporate",
    description: "Dark enterprise infrastructure/fintech platform — network globe hero, SLA checklist, partner tiers.",
    longDescription: "Meridian is a credibility-first dark corporate template for infrastructure, fintech, and cybersecurity companies. Features a dark gradient navbar, ambient network hero, dark logo wall, product pillar bento, architecture dashboard, uptime stats, partner tiers, compliance badges, and a regional sales contact. Six pages: Home, Platform, Solutions, Partners, Company, Contact.",
    tier: "business",
    gradient: "from-slate-800 via-slate-900 to-black",
    accentHex: "#0F172A",
    tags: ["Corporate", "Enterprise", "Dark", "Infrastructure", "Fintech"],
    features: ["6 pages", "Dark enterprise navbar", "Ambient hero", "SLA checklist", "Partner tiers", "Compliance badges"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#020617,#0f172a)", dark: true },
      { type: "features",     heightRatio: 0.22, dark: true, cols: 4 },
      { type: "stats",        heightRatio: 0.09, dark: true },
      { type: "testimonials", heightRatio: 0.12, dark: true },
      { type: "cta",          heightRatio: 0.08, dark: true },
      { type: "footer",       heightRatio: 0.04, dark: true },
    ],
    pages: meridianCorpPages,
  },
];

export const TEMPLATE_CATEGORIES = [
  { id: "all",        label: "All Templates" },
  { id: "saas",       label: "SaaS" },
  { id: "agency",     label: "Agency" },
  { id: "portfolio",  label: "Portfolio" },
  { id: "blog",       label: "Blog" },
  { id: "ecommerce",  label: "E-Commerce" },
  { id: "startup",    label: "Startup" },
  { id: "restaurant", label: "Restaurant" },
  { id: "health",     label: "Health & Wellness" },
  { id: "corporate",  label: "Corporate" },
] as const;
