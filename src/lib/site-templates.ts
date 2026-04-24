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
      blockEl("sb-navbar-glass-frosted",  0, "Navbar",         { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-dashboard-preview",1, "Hero",           { props: { accentColor: "#6366F1" } }),
      blockEl("sb-logos",                 2, "Trusted By"),
      blockEl("sb-features-bento",        3, "Features",       { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-how-it-works", 4, "How It Works",  { props: { accentColor: "#6366F1" } }),
      blockEl("sb-testimonials-marquee",  5, "Testimonials"),
      blockEl("sb-pricing-minimal",       6, "Pricing",        { props: { accentColor: "#6366F1" } }),
      blockEl("sb-cta-gradient-wave",     7, "CTA",            { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-newsletter",     8, "Footer",         { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-glass-frosted",    0, "Navbar",          { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-editorial",          1, "Hero",            { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-bento",          2, "Feature Grid",    { props: { accentColor: "#6366F1" } }),
      blockEl("sb-features-alternating",    3, "Feature Deep-Dive",{ props: { accentColor: "#6366F1" } }),
      blockEl("sb-content-comparison",      4, "Comparison"),
      blockEl("sb-cta-dark",               5, "CTA",             { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-newsletter",       6, "Footer",          { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-glass-frosted",    0, "Navbar",      { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-editorial",          1, "Hero",        { props: { accentColor: "#6366F1" } }),
      blockEl("sb-interactive-pricing-toggle",2,"Plans",     { props: { accentColor: "#6366F1" } }),
      blockEl("sb-pricing-comparison-table",3, "Comparison", { props: { accentColor: "#6366F1" } }),
      blockEl("sb-faq-two-col",             4, "FAQ"),
      blockEl("sb-cta-split",               5, "CTA",        { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-newsletter",       6, "Footer",     { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar",       { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-blog-featured",        1, "Featured Post"),
      blockEl("sb-blog-grid",            2, "Latest Posts"),
      blockEl("sb-cta-newsletter",       3, "Newsletter",   { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-newsletter",    4, "Footer",       { props: { brandName: "Pulse" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar",   { props: { accentColor: "#6366F1", brandName: "Pulse" } }),
      blockEl("sb-hero-editorial",       1, "Hero",     { props: { accentColor: "#6366F1" } }),
      blockEl("sb-contact-map",          2, "Contact",  { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-newsletter",    3, "Footer",   { props: { brandName: "Pulse" } }),
    ],
  },
];

// ─── 2. Orion — saas-orion · PRO ──────────────────────────────────────────────
const orionPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",         { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-video-dark",       1, "Hero",           { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-dark",            2, "Trusted By"),
      blockEl("sb-saas-feature-wall",     3, "Feature Wall",   { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-stats-dark-cards",      4, "Stats",          { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-testimonials-dark-grid",5, "Testimonials"),
      blockEl("sb-saas-integration-logos",6, "Integrations"),
      blockEl("sb-pricing-dark-cards",    7, "Pricing",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-cta-dark",              8, "CTA",            { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",           9, "Footer",         { props: { brandName: "Orion" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",         { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-product",          1, "Hero",           { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-dashboard-overview",    2, "Dashboard",      { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-highlight-dark",3,"Features",       { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-saas-api-preview",      4, "API Demo",       { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-saas-integration-logos",5, "Integrations"),
      blockEl("sb-cta-dark",              6, "CTA",            { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",           7, "Footer",         { props: { brandName: "Orion" } }),
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
      blockEl("sb-cta-dark",              5, "CTA",           { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",           6, "Footer",        { props: { brandName: "Orion" } }),
    ],
  },
  {
    name: "Company", slug: "/company",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",    { props: { accentColor: "#3B82F6", brandName: "Orion" } }),
      blockEl("sb-hero-editorial",        1, "Hero",      { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-dark-cards",       2, "Team"),
      blockEl("sb-features-cards",        3, "Values",    { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-hiring",           4, "Open Roles",{ props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-badges",          5, "Press"),
      blockEl("sb-footer-dark",           6, "Footer",    { props: { brandName: "Orion" } }),
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
      blockEl("sb-navbar-split-panel",    0, "Navbar",       { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-hero-gradient-split",   1, "Hero",         { props: { accentColor: "#10B981" } }),
      blockEl("sb-logos",                 2, "Trusted By"),
      blockEl("sb-features-bento-dark",   3, "Features",     { props: { accentColor: "#10B981" } }),
      blockEl("sb-saas-api-preview",      4, "Code Demo",    { props: { accentColor: "#10B981" } }),
      blockEl("sb-features-timeline-roadmap",5,"Roadmap",   { props: { accentColor: "#10B981" } }),
      blockEl("sb-stats-minimal-row",     6, "Stats"),
      blockEl("sb-testimonials-grid",     7, "Testimonials"),
      blockEl("sb-pricing-dark-cards",    8, "Pricing",      { props: { accentColor: "#10B981" } }),
      blockEl("sb-saas-integration-logos",9, "Integrations"),
      blockEl("sb-cta-dark",             10, "CTA",          { props: { accentColor: "#10B981", title: "Start building in 60 seconds" } }),
      blockEl("sb-footer-dark",          11, "Footer",       { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Docs", slug: "/docs",
    elements: [
      blockEl("sb-navbar-split-panel",    0, "Navbar",      { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-content-documentation",1, "Docs Layout"),
      blockEl("sb-cta-dark",             2, "Sign Up CTA", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",          3, "Footer",      { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-split-panel",     0, "Navbar",     { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-hero-editorial",         1, "Hero",       { props: { accentColor: "#10B981" } }),
      blockEl("sb-interactive-pricing-toggle",2,"Plans",   { props: { accentColor: "#10B981" } }),
      blockEl("sb-content-feature-list",   3, "Usage Info"),
      blockEl("sb-faq-dark",              4, "FAQ",        { props: { accentColor: "#10B981" } }),
      blockEl("sb-cta-dark",             5, "CTA",        { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",          6, "Footer",     { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Integrations", slug: "/integrations",
    elements: [
      blockEl("sb-navbar-split-panel",     0, "Navbar",        { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-hero-editorial",         1, "Hero",          { props: { accentColor: "#10B981" } }),
      blockEl("sb-saas-integration-logos", 2, "All Integrations"),
      blockEl("sb-cta-split",             3, "Request CTA",   { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",           4, "Footer",        { props: { brandName: "Vertex" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-split-panel", 0, "Navbar",       { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-blog-featured",      1, "Featured Post"),
      blockEl("sb-blog-grid",          2, "All Posts"),
      blockEl("sb-cta-newsletter",     3, "Newsletter",   { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-dark",        4, "Footer",       { props: { brandName: "Vertex" } }),
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
      blockEl("sb-navbar-centered-logo",  0, "Navbar",      { props: { brandName: "Flux" } }),
      blockEl("sb-hero-glass",            1, "Hero",        { props: { accentColor: "#64748B" } }),
      blockEl("sb-logos",                 2, "Trusted By"),
      blockEl("sb-features-icon-3col",    3, "Features",    { props: { accentColor: "#64748B" } }),
      blockEl("sb-testimonials-single-quote",4,"Testimonial"),
      blockEl("sb-pricing-minimal",       5, "Pricing",     { props: { accentColor: "#64748B" } }),
      blockEl("sb-cta-simple",            6, "CTA",         { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",        7, "Footer",      { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-centered-logo",  0, "Navbar",          { props: { brandName: "Flux" } }),
      blockEl("sb-hero-editorial",        1, "Hero",            { props: { accentColor: "#64748B" } }),
      blockEl("sb-features-alternating",  2, "Feature Details", { props: { accentColor: "#64748B" } }),
      blockEl("sb-features-checklist",    3, "Summary",         { props: { accentColor: "#64748B" } }),
      blockEl("sb-cta-simple",            4, "CTA",             { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",        5, "Footer",          { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-centered-logo", 0, "Navbar",  { props: { brandName: "Flux" } }),
      blockEl("sb-pricing-table",        1, "Plans",   { props: { accentColor: "#64748B" } }),
      blockEl("sb-faq",                  2, "FAQ"),
      blockEl("sb-footer-minimal",       3, "Footer",  { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-centered-logo", 0, "Navbar",  { props: { brandName: "Flux" } }),
      blockEl("sb-hero-editorial",       1, "Hero",    { props: { accentColor: "#64748B" } }),
      blockEl("sb-team-grid",            2, "Team"),
      blockEl("sb-features-cards",       3, "Values",  { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",       4, "Footer",  { props: { brandName: "Flux" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-centered-logo", 0, "Navbar",   { props: { brandName: "Flux" } }),
      blockEl("sb-contact-split",        1, "Contact",  { props: { accentColor: "#64748B" } }),
      blockEl("sb-footer-minimal",       2, "Footer",   { props: { brandName: "Flux" } }),
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
      blockEl("sb-navbar-underline",   0, "Navbar",          { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-studio",        1, "Hero",            { props: { accentColor: "#F97316" } }),
      blockEl("sb-services-card-grid", 2, "Services",        { props: { accentColor: "#F97316" } }),
      blockEl("sb-portfolio-bento",    3, "Featured Work",   { props: { accentColor: "#F97316" } }),
      blockEl("sb-logos",              4, "Clients"),
      blockEl("sb-testimonials-grid",  5, "Testimonials"),
      blockEl("sb-cta-gradient",       6, "CTA",             { props: { accentColor: "#F97316", title: "Start a project" } }),
      blockEl("sb-footer-corporate",   7, "Footer",          { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-underline",    0, "Navbar",       { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",      1, "Hero",         { props: { accentColor: "#F97316" } }),
      blockEl("sb-services-alternating",2, "Services",    { props: { accentColor: "#F97316" } }),
      blockEl("sb-services-process-steps",3,"Process",    { props: { accentColor: "#F97316" } }),
      blockEl("sb-team-horizontal",     4, "Team"),
      blockEl("sb-cta-gradient",        5, "CTA",          { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate",    6, "Footer",       { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-underline",  0, "Navbar",      { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",    1, "Hero",        { props: { accentColor: "#F97316" } }),
      blockEl("sb-portfolio-editorial",2,"Projects"),
      blockEl("sb-cta-gradient",      3, "CTA",         { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate",  4, "Footer",      { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-underline",      0, "Navbar",    { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",        1, "Hero",      { props: { accentColor: "#F97316" } }),
      blockEl("sb-content-feature-list",  2, "Mission"),
      blockEl("sb-team-spotlight",        3, "Team"),
      blockEl("sb-features-alternating",  4, "Culture",   { props: { accentColor: "#F97316" } }),
      blockEl("sb-cta-gradient",          5, "CTA",       { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate",      6, "Footer",    { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-underline",  0, "Navbar",   { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",    1, "Hero",     { props: { accentColor: "#F97316" } }),
      blockEl("sb-contact-map",       2, "Contact",  { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate",  3, "Footer",   { props: { brandName: "Prism" } }),
    ],
  },
];

// ─── 6. Atlas — agency-atlas · PRO ────────────────────────────────────────────
const atlasPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-corporate",       0, "Navbar",          { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-meridian-enterprise",1,"Hero",            { props: { accentColor: "#18181B" } }),
      blockEl("sb-logos",                  2, "Clients"),
      blockEl("sb-features-dark-bento",    3, "Services",        { props: { accentColor: "#18181B" } }),
      blockEl("sb-portfolio-case-study",   4, "Case Study"),
      blockEl("sb-stats-bold",             5, "Stats",           { props: { accentColor: "#18181B" } }),
      blockEl("sb-team-spotlight",         6, "Team"),
      blockEl("sb-blog-minimal-list",      7, "Blog Preview"),
      blockEl("sb-cta-dark",               8, "CTA",             { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-mega",            9, "Footer",          { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-corporate",      0, "Navbar",     { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-editorial",        1, "Hero",       { props: { accentColor: "#18181B" } }),
      blockEl("sb-services-dark-list",    2, "Services",   { props: { accentColor: "#18181B" } }),
      blockEl("sb-services-process-steps",3, "Process",    { props: { accentColor: "#18181B" } }),
      blockEl("sb-cta-dark",              4, "CTA",        { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-mega",           5, "Footer",     { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-corporate",    0, "Navbar",     { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-editorial",      1, "Hero",       { props: { accentColor: "#18181B" } }),
      blockEl("sb-portfolio-editorial", 2, "Case Studies"),
      blockEl("sb-portfolio-case-study",3, "Featured"),
      blockEl("sb-cta-dark",            4, "CTA",        { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-mega",         5, "Footer",     { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar",       { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-blog-featured",    1, "Featured"),
      blockEl("sb-blog-grid",        2, "Articles"),
      blockEl("sb-cta-newsletter",   3, "Newsletter",   { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-mega",      4, "Footer",       { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Team", slug: "/team",
    elements: [
      blockEl("sb-navbar-corporate",        0, "Navbar",      { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-hero-editorial",          1, "Hero",        { props: { accentColor: "#18181B" } }),
      blockEl("sb-team-grid",               2, "Leadership"),
      blockEl("sb-features-alternating",    3, "Culture"),
      blockEl("sb-team-hiring",             4, "Open Roles"),
      blockEl("sb-footer-mega",             5, "Footer",      { props: { brandName: "Atlas" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-corporate", 0, "Navbar",   { props: { accentColor: "#18181B", brandName: "Atlas" } }),
      blockEl("sb-contact-map",      1, "Contact",  { props: { accentColor: "#18181B" } }),
      blockEl("sb-footer-mega",      2, "Footer",   { props: { brandName: "Atlas" } }),
    ],
  },
];

// ─── 7. Cipher — agency-cipher · PRO ──────────────────────────────────────────
const cipherPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark",           0, "Navbar",        { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-bento",            1, "Hero",          { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-logos-animated-marquee",2, "Capabilities"),
      blockEl("sb-portfolio-dark-cards",  3, "Projects",      { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-highlight-dark",4,"Studio Edge",   { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-testimonials-wall",     5, "Testimonials"),
      blockEl("sb-cta-dark",              6, "CTA",           { props: { accentColor: "#7C3AED", title: "Begin a project" } }),
      blockEl("sb-footer-dark",           7, "Footer",        { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-dark",        0, "Navbar",  { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-editorial",     1, "Hero",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-portfolio-editorial",2, "Projects"),
      blockEl("sb-cta-dark",           3, "CTA",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",        4, "Footer",  { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Studio", slug: "/studio",
    elements: [
      blockEl("sb-navbar-dark",      0, "Navbar",  { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-editorial",   1, "Hero",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-dark-cards",  2, "Team",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-logos-badges",     3, "Awards"),
      blockEl("sb-features-steps",   4, "Process", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",      5, "Footer",  { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-dark",          0, "Navbar",   { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-editorial",       1, "Hero",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-services-dark-list",   2, "Services", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-features-steps",       3, "Process",  { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-dark",             4, "CTA",      { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",          5, "Footer",   { props: { brandName: "Cipher" } }),
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
      blockEl("sb-navbar-dark",    0, "Navbar",   { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-contact-split",  1, "Contact",  { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",    2, "Footer",   { props: { brandName: "Cipher" } }),
    ],
  },
];

// ─── 8. Signal — agency-signal · FREE ─────────────────────────────────────────
const signalPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-saas",       0, "Navbar",         { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-industrial",   1, "Hero",           { props: { accentColor: "#EF4444" } }),
      blockEl("sb-logos",             2, "Clients"),
      blockEl("sb-services-card-grid",3, "Services",       { props: { accentColor: "#EF4444" } }),
      blockEl("sb-stats-with-chart",  4, "Results",        { props: { accentColor: "#EF4444" } }),
      blockEl("sb-portfolio-bento",   5, "Case Studies",   { props: { accentColor: "#EF4444" } }),
      blockEl("sb-testimonials-grid", 6, "Testimonials"),
      blockEl("sb-cta-gradient",      7, "CTA",            { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",  8, "Footer",         { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-saas",           0, "Navbar",   { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-editorial",        1, "Hero",     { props: { accentColor: "#EF4444" } }),
      blockEl("sb-services-alternating",  2, "Services", { props: { accentColor: "#EF4444" } }),
      blockEl("sb-services-minimal-timeline",3,"Process",{ props: { accentColor: "#EF4444" } }),
      blockEl("sb-saas-integration-logos",4, "Tools"),
      blockEl("sb-cta-gradient",          5, "CTA",      { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",      6, "Footer",   { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "Results", slug: "/results",
    elements: [
      blockEl("sb-navbar-saas",        0, "Navbar",         { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-editorial",     1, "Hero",           { props: { accentColor: "#EF4444" } }),
      blockEl("sb-stats-with-chart",   2, "Stats Dashboard",{ props: { accentColor: "#EF4444" } }),
      blockEl("sb-portfolio-grid",     3, "Case Studies"),
      blockEl("sb-testimonials-wall",  4, "Testimonials"),
      blockEl("sb-cta-gradient",       5, "CTA",            { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",   6, "Footer",         { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-saas",      0, "Navbar",          { props: { accentColor: "#EF4444", brandName: "Signal" } }),
      blockEl("sb-hero-editorial",   1, "Hero",            { props: { accentColor: "#EF4444" } }),
      blockEl("sb-team-spotlight",   2, "Team"),
      blockEl("sb-features-cards",   3, "Values",          { props: { accentColor: "#EF4444" } }),
      blockEl("sb-logos-badges",     4, "Certifications"),
      blockEl("sb-footer-corporate", 5, "Footer",          { props: { brandName: "Signal" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-saas",      0, "Navbar",   { props: { accentColor: "#EF4444", brandName: "Signal" } }),
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
      blockEl("sb-navbar-creative",      0, "Navbar",            { props: { brandName: "Canvas" } }),
      blockEl("sb-hero-playful",         1, "Hero"),
      blockEl("sb-portfolio-bento",      2, "Featured Projects"),
      blockEl("sb-cta-split-image",      3, "About Teaser"),
      blockEl("sb-services-minimal-timeline",4,"Services"),
      blockEl("sb-testimonials-single-quote",5,"Testimonial"),
      blockEl("sb-cta-simple",           6, "CTA",               { props: { title: "Let's work together" } }),
      blockEl("sb-footer-minimal",       7, "Footer",            { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "Work", slug: "/work",
    elements: [
      blockEl("sb-navbar-creative",   0, "Navbar",    { props: { brandName: "Canvas" } }),
      blockEl("sb-hero-editorial",    1, "Hero"),
      blockEl("sb-portfolio-editorial",2,"Projects"),
      blockEl("sb-footer-minimal",    3, "Footer",    { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-creative",     0, "Navbar"),
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
      blockEl("sb-navbar-creative",    0, "Navbar"),
      blockEl("sb-hero-editorial",     1, "Hero"),
      blockEl("sb-services-alternating",2,"Services"),
      blockEl("sb-pricing-minimal",    3, "Pricing"),
      blockEl("sb-cta-simple",         4, "CTA"),
      blockEl("sb-footer-minimal",     5, "Footer", { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-creative",       0, "Navbar"),
      blockEl("sb-contact-split",         1, "Contact"),
      blockEl("sb-content-feature-list",  2, "Social Links"),
      blockEl("sb-footer-minimal",        3, "Footer", { props: { brandName: "Canvas" } }),
    ],
  },
];

// ─── 10. Folio — portfolio-folio · PRO ────────────────────────────────────────
const folioPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-pill",         0, "Navbar",         { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-hero-feature-stack",  1, "Hero",           { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-portfolio-dark-cards",2, "Projects",       { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-features-dark-bento", 3, "Skills",         { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-team-spotlight",      4, "Spotlight"),
      blockEl("sb-blog-minimal-list",   5, "Writing"),
      blockEl("sb-cta-dark",            6, "CTA",            { props: { accentColor: "#06B6D4", title: "Get in touch" } }),
      blockEl("sb-footer-dark",         7, "Footer",         { props: { brandName: "Folio" } }),
    ],
  },
  {
    name: "Projects", slug: "/projects",
    elements: [
      blockEl("sb-navbar-pill",       0, "Navbar",      { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-hero-editorial",    1, "Hero",        { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-portfolio-editorial",2,"All Projects"),
      blockEl("sb-footer-dark",       3, "Footer",      { props: { brandName: "Folio" } }),
    ],
  },
  {
    name: "Experience", slug: "/experience",
    elements: [
      blockEl("sb-navbar-pill",          0, "Navbar",      { props: { accentColor: "#06B6D4", brandName: "Folio" } }),
      blockEl("sb-content-steps-guide",  1, "Timeline"),
      blockEl("sb-features-dark-bento",  2, "Skills",      { props: { accentColor: "#06B6D4" } }),
      blockEl("sb-logos-badges",         3, "Certifications"),
      blockEl("sb-footer-dark",          4, "Footer",      { props: { brandName: "Folio" } }),
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
      blockEl("sb-navbar-blog",         0, "Navbar",         { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-blog-featured",       1, "Featured Story"),
      blockEl("sb-content-magazine-split",2,"Top Stories"),
      blockEl("sb-blog-grid",           3, "Latest Posts"),
      blockEl("sb-cta-newsletter",      4, "Newsletter",     { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-minimal",      5, "Footer",         { props: { brandName: "Ink" } }),
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
      blockEl("sb-navbar-blog",         0, "Navbar",        { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-blog-featured",       1, "Article Header"),
      blockEl("sb-content-rich-text",   2, "Article Body"),
      blockEl("sb-content-blockquote",  3, "Pull Quote",    { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-blog-author",         4, "Author Bio"),
      blockEl("sb-blog-related",        5, "Related"),
      blockEl("sb-cta-newsletter",      6, "Newsletter",    { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-minimal",      7, "Footer",        { props: { brandName: "Ink" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-blog",     0, "Navbar",   { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-hero-editorial",  1, "Mission",  { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-team-grid",       2, "Team"),
      blockEl("sb-footer-minimal",  3, "Footer",   { props: { brandName: "Ink" } }),
    ],
  },
  {
    name: "Newsletter", slug: "/newsletter",
    elements: [
      blockEl("sb-navbar-blog",           0, "Navbar",    { props: { accentColor: "#F59E0B", brandName: "Ink" } }),
      blockEl("sb-hero-editorial-classic",1, "Hero",      { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-features-checklist",    2, "Benefits",  { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-cta-newsletter",        3, "Subscribe", { props: { accentColor: "#F59E0B" } }),
      blockEl("sb-footer-minimal",        4, "Footer",    { props: { brandName: "Ink" } }),
    ],
  },
];

// ─── 12. Dispatch — blog-dispatch · PRO ───────────────────────────────────────
const dispatchPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-two-row",       0, "Navbar",       { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-content-magazine-split",1,"Latest Issue"),
      blockEl("sb-blog-grid",            2, "Past Issues"),
      blockEl("sb-team-horizontal",      3, "Authors"),
      blockEl("sb-features-cards",       4, "Topics",       { props: { accentColor: "#475569" } }),
      blockEl("sb-cta-newsletter",       5, "Subscribe",    { props: { accentColor: "#475569" } }),
      blockEl("sb-footer-newsletter",    6, "Footer",       { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Issues", slug: "/issues",
    elements: [
      blockEl("sb-navbar-two-row",   0, "Navbar",  { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-blog-grid",        1, "Archive"),
      blockEl("sb-footer-newsletter",2, "Footer",  { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Article", slug: "/issues/article",
    elements: [
      blockEl("sb-navbar-two-row",      0, "Navbar",       { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-blog-featured",       1, "Article Header"),
      blockEl("sb-content-rich-text",   2, "Article Body"),
      blockEl("sb-blog-author",         3, "Author"),
      blockEl("sb-blog-minimal-list",   4, "Related"),
      blockEl("sb-cta-gradient",        5, "Subscribe CTA",{ props: { accentColor: "#475569" } }),
      blockEl("sb-footer-newsletter",   6, "Footer",       { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Authors", slug: "/authors",
    elements: [
      blockEl("sb-navbar-two-row",   0, "Navbar",      { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-team-grid",        1, "All Authors"),
      blockEl("sb-footer-newsletter",2, "Footer",      { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Topics", slug: "/topics",
    elements: [
      blockEl("sb-navbar-two-row",   0, "Navbar",     { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-features-cards",   1, "Topics",     { props: { accentColor: "#475569" } }),
      blockEl("sb-blog-grid",        2, "Posts"),
      blockEl("sb-footer-newsletter",3, "Footer",     { props: { brandName: "Dispatch" } }),
    ],
  },
  {
    name: "Subscribe", slug: "/subscribe",
    elements: [
      blockEl("sb-navbar-two-row",        0, "Navbar",  { props: { accentColor: "#475569", brandName: "Dispatch" } }),
      blockEl("sb-hero-editorial-classic",1, "Hero",    { props: { accentColor: "#475569" } }),
      blockEl("sb-interactive-pricing-toggle",2,"Plans",{ props: { accentColor: "#475569" } }),
      blockEl("sb-faq-two-col",           3, "FAQ"),
      blockEl("sb-footer-newsletter",     4, "Footer",  { props: { brandName: "Dispatch" } }),
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
      blockEl("sb-navbar-ecommerce",           0, "Navbar",     { props: { accentColor: "#10B981", brandName: "Crate" } }),
      blockEl("sb-ecommerce-hero",             1, "Hero",       { props: { accentColor: "#10B981" } }),
      blockEl("sb-features-cards",             2, "Categories", { props: { accentColor: "#10B981" } }),
      blockEl("sb-ecommerce-featured-products",3, "Products",   { props: { accentColor: "#10B981" } }),
      blockEl("sb-stats-minimal-row",          4, "Value Props"),
      blockEl("sb-testimonials-marquee",       5, "Reviews"),
      blockEl("sb-cta-newsletter",             6, "Newsletter", { props: { accentColor: "#10B981" } }),
      blockEl("sb-footer-newsletter",          7, "Footer",     { props: { brandName: "Crate" } }),
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
      blockEl("sb-footer-newsletter",        4, "Footer",         { props: { brandName: "Crate" } }),
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
      blockEl("sb-footer-newsletter", 4, "Footer",      { props: { brandName: "Crate" } }),
    ],
  },
];

// ─── 14. Luxe — ecommerce-luxe · PRO ──────────────────────────────────────────
const luxePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-centered-logo",     0, "Navbar",      { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-hero-cinematic",           1, "Hero",        { props: { accentColor: "#1C1917" } }),
      blockEl("sb-portfolio-bento",          2, "Collections", { props: { accentColor: "#1C1917" } }),
      blockEl("sb-features-alternating",     3, "Spotlight",   { props: { accentColor: "#1C1917" } }),
      blockEl("sb-testimonials-single-quote",4, "Press Quote"),
      blockEl("sb-cta-newsletter",           5, "Newsletter",  { props: { accentColor: "#1C1917" } }),
      blockEl("sb-footer-gradient",          6, "Footer",      { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Collection", slug: "/collection",
    elements: [
      blockEl("sb-navbar-centered-logo",          0, "Navbar",    { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-hero-cinematic",                1, "Hero",      { props: { accentColor: "#1C1917" } }),
      blockEl("sb-ecommerce-featured-products",   2, "Products"),
      blockEl("sb-footer-gradient",               3, "Footer",    { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Product", slug: "/collection/product",
    elements: [
      blockEl("sb-navbar-centered-logo",   0, "Navbar",         { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-ecommerce-product-detail",1,"Product Detail"),
      blockEl("sb-content-feature-list",   2, "Styling Notes"),
      blockEl("sb-ecommerce-upsell",       3, "Related"),
      blockEl("sb-footer-gradient",        4, "Footer",          { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Lookbook", slug: "/lookbook",
    elements: [
      blockEl("sb-navbar-centered-logo", 0, "Navbar",    { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-portfolio-editorial",  1, "Lookbook"),
      blockEl("sb-footer-gradient",      2, "Footer",    { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-centered-logo",  0, "Navbar",      { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-hero-editorial",        1, "Brand Story", { props: { accentColor: "#1C1917" } }),
      blockEl("sb-features-alternating",  2, "Our Craft",   { props: { accentColor: "#1C1917" } }),
      blockEl("sb-footer-gradient",       3, "Footer",      { props: { brandName: "Luxe" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-centered-logo", 0, "Navbar",    { props: { accentColor: "#1C1917", brandName: "Luxe" } }),
      blockEl("sb-contact-split",        1, "Contact"),
      blockEl("sb-contact-map",          2, "Stockists"),
      blockEl("sb-footer-gradient",      3, "Footer",    { props: { brandName: "Luxe" } }),
    ],
  },
];

// ─── 15. Market — ecommerce-market · BIZ ──────────────────────────────────────
const marketPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar",     { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-hero-search-centered",       1, "Hero",       { props: { accentColor: "#2563EB" } }),
      blockEl("sb-features-cards",             2, "Categories", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-featured-products",3, "Featured",   { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-upsell",           4, "Deals",      { props: { accentColor: "#2563EB" } }),
      blockEl("sb-logos",                      5, "Brands"),
      blockEl("sb-testimonials-marquee",       6, "Reviews"),
      blockEl("sb-cta-newsletter",             7, "Newsletter", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-mega",                8, "Footer",     { props: { brandName: "Market" } }),
    ],
  },
  {
    name: "Category", slug: "/category",
    elements: [
      blockEl("sb-navbar-ecommerce",           0, "Navbar",   { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-hero-editorial",             1, "Hero",     { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-featured-products",2, "Products", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-mega",                3, "Footer",   { props: { brandName: "Market" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-ecommerce",         0, "Navbar",   { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-ecommerce-product-detail", 1, "Product",  { props: { accentColor: "#2563EB" } }),
      blockEl("sb-ecommerce-reviews",        2, "Reviews"),
      blockEl("sb-faq-two-col",              3, "Q&A"),
      blockEl("sb-ecommerce-upsell",         4, "Related",  { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-mega",              5, "Footer",   { props: { brandName: "Market" } }),
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
      blockEl("sb-footer-mega",                4, "Footer",          { props: { brandName: "Market" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-ecommerce",  0, "Navbar",     { props: { accentColor: "#2563EB", brandName: "Market" } }),
      blockEl("sb-hero-editorial",    1, "Mission",    { props: { accentColor: "#2563EB" } }),
      blockEl("sb-stats-minimal-row", 2, "Stats"),
      blockEl("sb-cta-split",         3, "Seller CTA", { props: { accentColor: "#2563EB" } }),
      blockEl("sb-footer-mega",       4, "Footer",     { props: { brandName: "Market" } }),
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
      blockEl("sb-navbar-announcement",     0, "Announcement",  { props: { accentColor: "#D946EF" } }),
      blockEl("sb-landing-waitlist-dark",   1, "Waitlist Hero", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-interactive-countdown",   2, "Countdown",     { props: { accentColor: "#D946EF" } }),
      blockEl("sb-logos",                   3, "Social Proof"),
      blockEl("sb-features-how-it-works",   4, "How It Works",  { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-bento-dark",     5, "Features",      { props: { accentColor: "#D946EF" } }),
      blockEl("sb-testimonials-grid",       6, "Testimonials"),
      blockEl("sb-interactive-pricing-toggle",7,"Early Pricing",{ props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-timeline-roadmap",8,"Roadmap",       { props: { accentColor: "#D946EF" } }),
      blockEl("sb-cta-dark",               9, "Final CTA",     { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",        10, "Footer",         { props: { brandName: "Launch" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-announcement",    0, "Navbar",       { props: { accentColor: "#D946EF" } }),
      blockEl("sb-hero-editorial",         1, "Hero",         { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-bento-dark",    2, "Feature Grid", { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-alternating",   3, "Deep Dive",    { props: { accentColor: "#D946EF" } }),
      blockEl("sb-cta-dark",              4, "CTA",          { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",        5, "Footer",       { props: { brandName: "Launch" } }),
    ],
  },
  {
    name: "Roadmap", slug: "/roadmap",
    elements: [
      blockEl("sb-navbar-announcement",     0, "Navbar",           { props: { accentColor: "#D946EF" } }),
      blockEl("sb-hero-editorial",          1, "Hero",             { props: { accentColor: "#D946EF" } }),
      blockEl("sb-features-timeline-roadmap",2,"Release Timeline"),
      blockEl("sb-content-changelog",       3, "Changelog"),
      blockEl("sb-cta-dark",              4, "CTA",              { props: { accentColor: "#D946EF" } }),
      blockEl("sb-footer-startup",        5, "Footer",           { props: { brandName: "Launch" } }),
    ],
  },
];

// ─── 17. Ignite — startup-ignite · FREE ───────────────────────────────────────
const ignitePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-startup",        0, "Navbar",     { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-hero-playful",          1, "Hero",       { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-icon-3col",    2, "Features",   { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-how-it-works", 3, "How It Works",{ props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-stats-minimal-row",     4, "Stats"),
      blockEl("sb-testimonials-marquee",  5, "Reviews"),
      blockEl("sb-pricing-minimal",       6, "Plans",      { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-cta-app-download",      7, "Download"),
      blockEl("sb-footer-startup",        8, "Footer",     { props: { brandName: "Ignite" } }),
    ],
  },
  {
    name: "Features", slug: "/features",
    elements: [
      blockEl("sb-navbar-startup",        0, "Navbar",       { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-hero-editorial",        1, "Hero",         { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-features-alternating",  2, "Walkthrough",  { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-cta-app-download",      3, "Download CTA"),
      blockEl("sb-footer-startup",        4, "Footer",       { props: { brandName: "Ignite" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-startup",            0, "Navbar",     { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-interactive-pricing-toggle",1, "Plans",      { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-pricing-comparison-table",  2, "Comparison", { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-faq-two-col",               3, "FAQ"),
      blockEl("sb-footer-startup",            4, "Footer",     { props: { brandName: "Ignite" } }),
    ],
  },
  {
    name: "FAQ", slug: "/faq",
    elements: [
      blockEl("sb-navbar-startup",  0, "Navbar",     { props: { accentColor: "#8B5CF6", brandName: "Ignite" } }),
      blockEl("sb-hero-editorial",  1, "Hero",       { props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-faq-two-col",     2, "FAQ"),
      blockEl("sb-cta-simple",      3, "Support CTA",{ props: { accentColor: "#8B5CF6" } }),
      blockEl("sb-footer-startup",  4, "Footer",     { props: { brandName: "Ignite" } }),
    ],
  },
];

// ─── 18. Boost — startup-boost · PRO ──────────────────────────────────────────
const boostPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass-frosted",    0, "Navbar",      { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-hero-dashboard-preview",  1, "Hero",        { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-logos",                   2, "Customers"),
      blockEl("sb-dashboard-analytics-hero",3, "Analytics",   { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-stats-with-chart",        4, "Metrics",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-testimonials-wall",       5, "Testimonials"),
      blockEl("sb-blog-minimal-list",       6, "Blog Preview"),
      blockEl("sb-team-horizontal",         7, "Team"),
      blockEl("sb-interactive-pricing-toggle",8,"Pricing",    { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-gradient-wave",       9, "CTA",         { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-newsletter",      10, "Footer",      { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Product", slug: "/product",
    elements: [
      blockEl("sb-navbar-glass-frosted",    0, "Navbar",       { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-hero-product",            1, "Hero",         { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-saas-feature-wall",       2, "Feature Wall", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-saas-integration-logos",  3, "Integrations"),
      blockEl("sb-features-checklist",      4, "Security",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-cta-gradient-wave",       5, "CTA",          { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-newsletter",       6, "Footer",       { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Pricing", slug: "/pricing",
    elements: [
      blockEl("sb-navbar-glass-frosted",      0, "Navbar",     { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-interactive-pricing-toggle",1, "Plans",      { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-pricing-comparison-table",  2, "Comparison", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-faq-two-col",               3, "FAQ"),
      blockEl("sb-cta-split",                4, "CTA",        { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-newsletter",         5, "Footer",     { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar",     { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-blog-featured",        1, "Featured"),
      blockEl("sb-blog-grid",            2, "All Posts"),
      blockEl("sb-cta-newsletter",       3, "Newsletter", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-newsletter",    4, "Footer",     { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Team", slug: "/team",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar",     { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-hero-editorial",       1, "Hero",       { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-dark-cards",      2, "Leadership"),
      blockEl("sb-features-cards",       3, "Values",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-team-hiring",          4, "Open Roles", { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-newsletter",    5, "Footer",     { props: { brandName: "Boost" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-glass-frosted", 0, "Navbar",   { props: { accentColor: "#7C3AED", brandName: "Boost" } }),
      blockEl("sb-contact-map",          1, "Contact",  { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-newsletter",    2, "Footer",   { props: { brandName: "Boost" } }),
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
      blockEl("sb-navbar-restaurant",   0, "Navbar",          { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-hero-cinematic",      1, "Hero",            { props: { accentColor: "#D97706" } }),
      blockEl("sb-cta-split",           2, "About Teaser",    { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-cards",      3, "Menu Highlights", { props: { accentColor: "#D97706" } }),
      blockEl("sb-logos-badges",        4, "Press"),
      blockEl("sb-testimonials-grid",   5, "Reviews"),
      blockEl("sb-cta-gradient",        6, "Reserve CTA",     { props: { accentColor: "#D97706", title: "Book a Table" } }),
      blockEl("sb-footer-gradient",     7, "Footer",          { props: { brandName: "Savor" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-restaurant",         0, "Navbar",      { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-hero-editorial",            1, "Menu Header", { props: { accentColor: "#D97706" } }),
      blockEl("sb-interactive-tabs-features", 2, "Categories",  { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-cards",            3, "Dishes",      { props: { accentColor: "#D97706" } }),
      blockEl("sb-content-feature-list",      4, "Allergen Info"),
      blockEl("sb-cta-gradient",              5, "Reserve CTA", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-gradient",           6, "Footer",      { props: { brandName: "Savor" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-restaurant",     0, "Navbar",     { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-features-alternating",  1, "Chef Story", { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-alternating",  2, "Philosophy", { props: { accentColor: "#D97706" } }),
      blockEl("sb-team-spotlight",        3, "Team"),
      blockEl("sb-logos-badges",          4, "Awards"),
      blockEl("sb-footer-gradient",       5, "Footer",     { props: { brandName: "Savor" } }),
    ],
  },
  {
    name: "Reservations", slug: "/reservations",
    elements: [
      blockEl("sb-navbar-glass",     0, "Navbar",      { props: { accentColor: "#D97706", brandName: "Savor" } }),
      blockEl("sb-contact-split",    1, "Reservations",{ props: { accentColor: "#D97706" } }),
      blockEl("sb-contact-map",      2, "Location",    { props: { accentColor: "#D97706" } }),
      blockEl("sb-cta-simple",        3, "Private CTA", { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-gradient",   4, "Footer",      { props: { brandName: "Savor" } }),
    ],
  },
];

// ─── 20. Brew — restaurant-brew · FREE ────────────────────────────────────────
const brewPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",          0, "Navbar",       { props: { brandName: "Brew" } }),
      blockEl("sb-hero-organic",            1, "Hero"),
      blockEl("sb-features-cards",          2, "Seasonal Menu",{ props: { accentColor: "#92400E" } }),
      blockEl("sb-testimonials-single-quote",3,"Guest Review"),
      blockEl("sb-cta-split",               4, "Our Story",    { props: { accentColor: "#92400E" } }),
      blockEl("sb-testimonials-grid",       5, "Reviews"),
      blockEl("sb-cta-simple",              6, "Visit CTA",    { props: { accentColor: "#92400E" } }),
      blockEl("sb-footer-minimal",          7, "Footer",       { props: { brandName: "Brew" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-minimal",            0, "Navbar",       { props: { brandName: "Brew" } }),
      blockEl("sb-interactive-tabs-features", 1, "Menu Sections",{ props: { accentColor: "#92400E" } }),
      blockEl("sb-features-cards",            2, "Items",        { props: { accentColor: "#92400E" } }),
      blockEl("sb-footer-minimal",            3, "Footer",       { props: { brandName: "Brew" } }),
    ],
  },
  {
    name: "Our Story", slug: "/our-story",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-features-alternating", 1, "Origin",    { props: { accentColor: "#92400E" } }),
      blockEl("sb-features-alternating", 2, "Sourcing",  { props: { accentColor: "#92400E" } }),
      blockEl("sb-features-cards",       3, "Community", { props: { accentColor: "#92400E" } }),
      blockEl("sb-footer-minimal",       4, "Footer",    { props: { brandName: "Brew" } }),
    ],
  },
  {
    name: "Find Us", slug: "/find-us",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-contact-map",          1, "Location"),
      blockEl("sb-content-feature-list", 2, "Hours"),
      blockEl("sb-contact-split",        3, "Contact"),
      blockEl("sb-footer-minimal",       4, "Footer",    { props: { brandName: "Brew" } }),
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
      blockEl("sb-navbar-transparent",    0, "Navbar",      { props: { accentColor: "#14B8A6", brandName: "Thrive" } }),
      blockEl("sb-hero-editorial-classic",1, "Hero",        { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-features-icon-3col",    2, "Services",    { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-services-process-steps",3, "Process",     { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-testimonials-single-quote",4,"Client Win"),
      blockEl("sb-stats-minimal-row",     5, "Stats"),
      blockEl("sb-blog-minimal-list",     6, "Articles"),
      blockEl("sb-cta-gradient-wave",     7, "Booking CTA", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-newsletter",     8, "Footer",      { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-transparent",    0, "Navbar",    { props: { accentColor: "#14B8A6", brandName: "Thrive" } }),
      blockEl("sb-hero-editorial",        1, "Hero",      { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-services-alternating",  2, "Services",  { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-pricing-table",         3, "Packages",  { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-faq-two-col",           4, "FAQ"),
      blockEl("sb-cta-gradient-wave",     5, "Booking",   { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-newsletter",     6, "Footer",    { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-transparent",    0, "Navbar"),
      blockEl("sb-hero-editorial",        1, "Bio",        { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-features-checklist",    2, "Credentials"),
      blockEl("sb-features-alternating",  3, "Philosophy", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-testimonials-grid",     4, "Client Wins"),
      blockEl("sb-footer-newsletter",     5, "Footer",     { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "Blog", slug: "/blog",
    elements: [
      blockEl("sb-navbar-transparent", 0, "Navbar"),
      blockEl("sb-blog-grid",          1, "Articles"),
      blockEl("sb-cta-newsletter",     2, "Newsletter", { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-footer-newsletter",  3, "Footer",     { props: { brandName: "Thrive" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-transparent", 0, "Navbar"),
      blockEl("sb-hero-editorial",     1, "Booking",       { props: { accentColor: "#14B8A6" } }),
      blockEl("sb-contact-split",      2, "Book a Session",{ props: { accentColor: "#14B8A6" } }),
      blockEl("sb-faq-two-col",        3, "FAQ"),
      blockEl("sb-footer-newsletter",  4, "Footer",        { props: { brandName: "Thrive" } }),
    ],
  },
];

// ─── 22. Revive — health-revive · PRO ─────────────────────────────────────────
const revivePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-bold",           0, "Navbar",     { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-hero-industrial",       1, "Hero",       { props: { accentColor: "#EF4444" } }),
      blockEl("sb-features-cards",        2, "Classes",    { props: { accentColor: "#EF4444" } }),
      blockEl("sb-stats-bold",            3, "Stats",      { props: { accentColor: "#EF4444" } }),
      blockEl("sb-team-spotlight",        4, "Trainers"),
      blockEl("sb-interactive-pricing-toggle",5,"Membership",{ props: { accentColor: "#EF4444" } }),
      blockEl("sb-testimonials-dark-grid",6, "Testimonials"),
      blockEl("sb-cta-bold",              7, "CTA",        { props: { accentColor: "#EF4444", title: "Claim your free class" } }),
      blockEl("sb-footer-corporate",      8, "Footer",     { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Classes", slug: "/classes",
    elements: [
      blockEl("sb-navbar-bold",            0, "Navbar",       { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-hero-editorial",         1, "Hero",         { props: { accentColor: "#EF4444" } }),
      blockEl("sb-services-process-steps", 2, "Schedule"),
      blockEl("sb-features-cards",         3, "Class Details",{ props: { accentColor: "#EF4444" } }),
      blockEl("sb-cta-bold",               4, "CTA",          { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",       5, "Footer",       { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Trainers", slug: "/trainers",
    elements: [
      blockEl("sb-navbar-bold",    0, "Navbar",    { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-hero-editorial", 1, "Hero",      { props: { accentColor: "#EF4444" } }),
      blockEl("sb-team-grid",      2, "Trainers"),
      blockEl("sb-footer-corporate",3,"Footer",   { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Membership", slug: "/membership",
    elements: [
      blockEl("sb-navbar-bold",               0, "Navbar",    { props: { accentColor: "#EF4444", brandName: "Revive" } }),
      blockEl("sb-interactive-pricing-toggle",1, "Plans",     { props: { accentColor: "#EF4444" } }),
      blockEl("sb-pricing-comparison-table",  2, "Comparison",{ props: { accentColor: "#EF4444" } }),
      blockEl("sb-faq-two-col",               3, "FAQ"),
      blockEl("sb-cta-bold",                  4, "CTA",       { props: { accentColor: "#EF4444" } }),
      blockEl("sb-footer-corporate",          5, "Footer",    { props: { brandName: "Revive" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-bold",           0, "Navbar"),
      blockEl("sb-contact-map",           1, "Location",  { props: { accentColor: "#EF4444" } }),
      blockEl("sb-contact-split",         2, "Contact",   { props: { accentColor: "#EF4444" } }),
      blockEl("sb-content-feature-list",  3, "Hours"),
      blockEl("sb-footer-corporate",      4, "Footer",    { props: { brandName: "Revive" } }),
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
      blockEl("sb-stats-trust-grid",    5, "Trust",         { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-portfolio-case-study",6, "Case Studies"),
      blockEl("sb-logos-badges",        7, "Trust Badges"),
      blockEl("sb-cta-split",           8, "CTA",           { props: { accentColor: "#1D4ED8" } }),
      blockEl("sb-footer-corporate",    9, "Footer",        { props: { brandName: "Summit" } }),
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
      blockEl("sb-navbar-dark-gradient",    0, "Navbar",       { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-meridian-enterprise",1, "Hero",         { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-dark",              2, "Customers"),
      blockEl("sb-saas-feature-wall",       3, "Capabilities", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-dashboard-analytics-hero",4, "Platform",     { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-stats-dark-cards",        5, "Stats",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-dark",              6, "Partners"),
      blockEl("sb-testimonials-wall",       7, "Testimonials"),
      blockEl("sb-cta-enterprise-dark",     8, "CTA",          { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise",9,"Footer",      { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Platform", slug: "/platform",
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",      { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-product",           1, "Hero",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-bento-dark",    2, "Architecture",{ props: { accentColor: "#3B82F6" } }),
      blockEl("sb-saas-api-preview",       3, "API",         { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-checklist",     4, "SLA",         { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-cta-enterprise-dark",    5, "CTA",         { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise",6,"Footer",    { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Solutions", slug: "/solutions",
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",      { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-editorial",         1, "Hero",        { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-dark-bento",    2, "Industries",  { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-portfolio-case-study",   3, "Case Studies"),
      blockEl("sb-stats-trust-grid",       4, "Trust"),
      blockEl("sb-footer-meridian-enterprise",5,"Footer",    { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Partners", slug: "/partners",
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",        { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-editorial",         1, "Partner Program",{ props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-dark",             2, "Partners"),
      blockEl("sb-pricing-dark",           3, "Tiers",          { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-contact-split",          4, "Apply",          { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-meridian-enterprise",5,"Footer",       { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Company", slug: "/company",
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",     { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-hero-editorial",         1, "Mission",    { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-dark-cards",        2, "Leadership", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-logos-badges",           3, "Compliance"),
      blockEl("sb-logos-badges",           4, "Press"),
      blockEl("sb-footer-meridian-enterprise",5,"Footer",   { props: { brandName: "Meridian" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-dark-gradient",   0, "Navbar",    { props: { accentColor: "#0F172A", brandName: "Meridian" } }),
      blockEl("sb-contact-dark",           1, "Contact",   { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-team-horizontal",        2, "Sales Team"),
      blockEl("sb-footer-meridian-enterprise",3,"Footer",  { props: { brandName: "Meridian" } }),
    ],
  },
];

// =============================================================================
// RESTAURANT NEW TEMPLATES (from TEMPLATES.md)
// =============================================================================

// ─── Ember — restaurant-ember · FREE ──────────────────────────────────────────
// Dark, warm, atmospheric — cinematic hero + magazine split + large pull quotes
const emberPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-restaurant",   0, "Navbar",           { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-cinematic",      1, "Hero",             { props: { accentColor: "#C2410C" } }),
      blockEl("sb-content-magazine-split",2,"Story",           { props: { accentColor: "#C2410C" } }),
      blockEl("sb-features-bold-grid",  3, "Signature Dishes", { props: { accentColor: "#C2410C" } }),
      blockEl("sb-logos-badges",        4, "Press"),
      blockEl("sb-portfolio-bento",     5, "Gallery"),
      blockEl("sb-testimonials-large",  6, "Reviews"),
      blockEl("sb-cta-gradient",        7, "Reserve",          { props: { accentColor: "#C2410C", title: "Reserve Your Evening" } }),
      blockEl("sb-footer-gradient",     8, "Footer",           { props: { brandName: "Ember" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-restaurant",        0, "Navbar",      { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-editorial-classic",   1, "Menu Header", { props: { accentColor: "#C2410C" } }),
      blockEl("sb-interactive-tabs-features",2, "Categories",  { props: { accentColor: "#C2410C" } }),
      blockEl("sb-features-bold-grid",       3, "Dishes",      { props: { accentColor: "#C2410C" } }),
      blockEl("sb-content-feature-list",     4, "Allergen Info"),
      blockEl("sb-cta-simple",               5, "Reserve",     { props: { accentColor: "#C2410C" } }),
      blockEl("sb-footer-gradient",          6, "Footer",      { props: { brandName: "Ember" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-restaurant",   0, "Navbar",      { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-studio",         1, "Chef Hero",   { props: { accentColor: "#C2410C" } }),
      blockEl("sb-content-magazine-split",2,"Philosophy", { props: { accentColor: "#C2410C" } }),
      blockEl("sb-logos-badges",        3, "Awards"),
      blockEl("sb-team-spotlight",      4, "Team"),
      blockEl("sb-cta-simple",          5, "Reserve",     { props: { accentColor: "#C2410C" } }),
      blockEl("sb-footer-gradient",     6, "Footer",      { props: { brandName: "Ember" } }),
    ],
  },
  {
    name: "Gallery", slug: "/gallery",
    elements: [
      blockEl("sb-navbar-restaurant",  0, "Navbar",         { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-portfolio-editorial",1, "Photo Gallery"),
      blockEl("sb-portfolio-bento",    2, "More Photos"),
      blockEl("sb-footer-gradient",    3, "Footer",         { props: { brandName: "Ember" } }),
    ],
  },
  {
    name: "Reservations", slug: "/reservations",
    elements: [
      blockEl("sb-navbar-restaurant",  0, "Navbar",       { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-contact-split",      1, "Reservations", { props: { accentColor: "#C2410C" } }),
      blockEl("sb-contact-map",        2, "Location"),
      blockEl("sb-features-checklist", 3, "Policies"),
      blockEl("sb-cta-banner",         4, "Gift Vouchers",{ props: { accentColor: "#C2410C" } }),
      blockEl("sb-footer-gradient",    5, "Footer",       { props: { brandName: "Ember" } }),
    ],
  },
  {
    name: "Private Dining", slug: "/private-dining",
    elements: [
      blockEl("sb-navbar-restaurant",   0, "Navbar",        { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-bento",          1, "Private Rooms", { props: { accentColor: "#C2410C" } }),
      blockEl("sb-features-cards",      2, "Event Types",   { props: { accentColor: "#C2410C" } }),
      blockEl("sb-content-feature-list",3, "Menus"),
      blockEl("sb-contact-split",       4, "Enquiry",       { props: { accentColor: "#C2410C" } }),
      blockEl("sb-footer-gradient",     5, "Footer",        { props: { brandName: "Ember" } }),
    ],
  },
];

// ─── Grove — restaurant-grove · FREE ──────────────────────────────────────────
// Bright, airy café — classic editorial hero + testimonial marquee + stats trust row
const grovePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",         0, "Navbar",     { props: { brandName: "Grove" } }),
      blockEl("sb-hero-editorial-classic", 1, "Hero",       { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-cards",         2, "Seasonal",   { props: { accentColor: "#78716C" } }),
      blockEl("sb-stats-light",            3, "By the Numbers"),
      blockEl("sb-content-magazine-split", 4, "Our Story",  { props: { accentColor: "#78716C" } }),
      blockEl("sb-testimonials-marquee",   5, "Reviews"),
      blockEl("sb-features-icon-3col",     6, "Values",     { props: { accentColor: "#78716C" } }),
      blockEl("sb-cta-newsletter",         7, "Newsletter", { props: { accentColor: "#78716C" } }),
      blockEl("sb-footer-minimal",         8, "Footer",     { props: { brandName: "Grove" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-minimal",           0, "Navbar",        { props: { brandName: "Grove" } }),
      blockEl("sb-hero-glass",               1, "Today's Menu",  { props: { accentColor: "#78716C" } }),
      blockEl("sb-interactive-tabs-features",2, "Menu Sections", { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-cards",           3, "Items",         { props: { accentColor: "#78716C" } }),
      blockEl("sb-content-feature-list",     4, "Allergen Key"),
      blockEl("sb-cta-minimal-center",       5, "Order Online",  { props: { accentColor: "#78716C" } }),
      blockEl("sb-footer-minimal",           6, "Footer",        { props: { brandName: "Grove" } }),
    ],
  },
  {
    name: "Our Story", slug: "/our-story",
    elements: [
      blockEl("sb-navbar-minimal",          0, "Navbar"),
      blockEl("sb-hero-editorial-classic",  1, "Founder Story",  { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-alternating-rows",2,"Sourcing",       { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-cards",          3, "Community",      { props: { accentColor: "#78716C" } }),
      blockEl("sb-team-minimal-list",       4, "The Team"),
      blockEl("sb-footer-minimal",          5, "Footer",         { props: { brandName: "Grove" } }),
    ],
  },
  {
    name: "Events", slug: "/events",
    elements: [
      blockEl("sb-navbar-minimal",     0, "Navbar"),
      blockEl("sb-hero-playful",       1, "What's On",    { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-steps",     2, "Upcoming",     { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-cards",     3, "Private Hire", { props: { accentColor: "#78716C" } }),
      blockEl("sb-contact-minimal",    4, "Enquiry",      { props: { accentColor: "#78716C" } }),
      blockEl("sb-footer-minimal",     5, "Footer",       { props: { brandName: "Grove" } }),
    ],
  },
  {
    name: "Find Us", slug: "/find-us",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-contact-map",          1, "Map"),
      blockEl("sb-logos-with-stats",     2, "Hours & Info"),
      blockEl("sb-contact-split",        3, "Contact",   { props: { accentColor: "#78716C" } }),
      blockEl("sb-footer-minimal",       4, "Footer",    { props: { brandName: "Grove" } }),
    ],
  },
];

// ─── Lumière — restaurant-lumiere · PRO ───────────────────────────────────────
// All-black fine dining — video dark hero + phantom features + wall testimonials
const lumierePages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark",          0, "Navbar",      { props: { accentColor: "#C9A84C", brandName: "Lumière" } }),
      blockEl("sb-hero-video-dark",      1, "Hero",        { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-features-phantom-dark",2, "Experience",  { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-logos-grid-dark",      3, "Recognition"),
      blockEl("sb-testimonials-wall",    4, "Testimonials"),
      blockEl("sb-cta-dark",             5, "Reserve",     { props: { accentColor: "#C9A84C", title: "Reserve Your Table" } }),
      blockEl("sb-footer-dark",          6, "Footer",      { props: { brandName: "Lumière" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-dark",              0, "Navbar",       { props: { accentColor: "#C9A84C", brandName: "Lumière" } }),
      blockEl("sb-saas-dark-hero",           1, "Seasonal Menu",{ props: { accentColor: "#C9A84C" } }),
      blockEl("sb-interactive-tabs-features",2, "Courses",      { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-content-feature-list",     3, "Menu Details"),
      blockEl("sb-footer-dark",              4, "Footer",       { props: { brandName: "Lumière" } }),
    ],
  },
  {
    name: "Chef & Team", slug: "/chef-team",
    elements: [
      blockEl("sb-navbar-dark",          0, "Navbar",      { props: { accentColor: "#C9A84C", brandName: "Lumière" } }),
      blockEl("sb-hero-abstract-ambient",1, "Chef",        { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-content-magazine-split",2,"Chef Story",  { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-team-dark-cards",      3, "Kitchen Team"),
      blockEl("sb-footer-dark",          4, "Footer",      { props: { brandName: "Lumière" } }),
    ],
  },
  {
    name: "Wine", slug: "/wine",
    elements: [
      blockEl("sb-navbar-dark",          0, "Navbar",        { props: { accentColor: "#C9A84C", brandName: "Lumière" } }),
      blockEl("sb-hero-product",         1, "Wine Programme",{ props: { accentColor: "#C9A84C" } }),
      blockEl("sb-features-highlight-dark",2,"Sommelier",   { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-content-feature-list", 3, "Wine List"),
      blockEl("sb-cta-dark",             4, "Pairing CTA",  { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-footer-dark",          5, "Footer",       { props: { brandName: "Lumière" } }),
    ],
  },
  {
    name: "Reservations", slug: "/reservations",
    elements: [
      blockEl("sb-navbar-dark",         0, "Navbar",         { props: { accentColor: "#C9A84C", brandName: "Lumière" } }),
      blockEl("sb-contact-dark",        1, "Reservations",   { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-features-checklist",  2, "What to Expect"),
      blockEl("sb-footer-dark",         3, "Footer",         { props: { brandName: "Lumière" } }),
    ],
  },
  {
    name: "Private Events", slug: "/private-events",
    elements: [
      blockEl("sb-navbar-dark",         0, "Navbar",         { props: { accentColor: "#C9A84C", brandName: "Lumière" } }),
      blockEl("sb-hero-bento",          1, "Private Room",   { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-features-dark-bento", 2, "Event Packages", { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-content-feature-list",3, "Menu Options"),
      blockEl("sb-contact-dark",        4, "Enquiry",        { props: { accentColor: "#C9A84C" } }),
      blockEl("sb-footer-dark",         5, "Footer",         { props: { brandName: "Lumière" } }),
    ],
  },
];

// =============================================================================
// HOTEL TEMPLATES
// =============================================================================

// ─── Haven — hotel-haven · FREE ───────────────────────────────────────────────
// Split-panel teal hero + wall testimonials + checklist amenities
const havenPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",        { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-hero-gradient-split",  1, "Hero",          { props: { accentColor: "#0F766E" } }),
      blockEl("sb-stats-light",          2, "Property Stats"),
      blockEl("sb-features-cards",       3, "Room Previews", { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-icon-3col",   4, "Facilities",    { props: { accentColor: "#0F766E" } }),
      blockEl("sb-testimonials-wall",    5, "Guest Reviews"),
      blockEl("sb-logos-badges",         6, "Awards"),
      blockEl("sb-cta-newsletter",       7, "Exclusive Offers",{ props: { accentColor: "#0F766E" } }),
      blockEl("sb-footer-newsletter",    8, "Footer",        { props: { brandName: "Haven" } }),
    ],
  },
  {
    name: "Rooms", slug: "/rooms",
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",      { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-hero-product",         1, "Room Types",  { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-alternating-rows",2,"Room Detail",{ props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-checklist",   3, "All Amenities"),
      blockEl("sb-cta-simple",           4, "Book Now",    { props: { accentColor: "#0F766E" } }),
      blockEl("sb-footer-newsletter",    5, "Footer",      { props: { brandName: "Haven" } }),
    ],
  },
  {
    name: "Facilities", slug: "/facilities",
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",        { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-services-card-grid",   1, "Facilities",    { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-bold-grid",   2, "Family",        { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-checklist",   3, "Business"),
      blockEl("sb-footer-newsletter",    4, "Footer",        { props: { brandName: "Haven" } }),
    ],
  },
  {
    name: "Dining", slug: "/dining",
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",   { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-hero-cinematic",       1, "Dining",   { props: { accentColor: "#0F766E" } }),
      blockEl("sb-services-alternating", 2, "Venues",   { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-cards",       3, "Menus",    { props: { accentColor: "#0F766E" } }),
      blockEl("sb-cta-simple",           4, "Reserve",  { props: { accentColor: "#0F766E" } }),
      blockEl("sb-footer-newsletter",    5, "Footer",   { props: { brandName: "Haven" } }),
    ],
  },
  {
    name: "Location", slug: "/location",
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",       { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-contact-map",          1, "Map"),
      blockEl("sb-features-steps",       2, "Getting Here"),
      blockEl("sb-features-cards",       3, "Things to Do", { props: { accentColor: "#0F766E" } }),
      blockEl("sb-footer-newsletter",    4, "Footer",       { props: { brandName: "Haven" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",     { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-contact-split",        1, "Book",       { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-checklist",   2, "Guarantee"),
      blockEl("sb-pricing-minimal",      3, "Packages",   { props: { accentColor: "#0F766E" } }),
      blockEl("sb-footer-newsletter",    4, "Footer",     { props: { brandName: "Haven" } }),
    ],
  },
];

// ─── Grand — hotel-grand · PRO ────────────────────────────────────────────────
// Ambient/immersive navy hero + dark bento rooms + wall testimonials + mega footer
const grandPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",         { props: { accentColor: "#B8963E", brandName: "Grand" } }),
      blockEl("sb-hero-abstract-ambient", 1, "Hero"),
      blockEl("sb-features-dark-bento",   2, "Room Categories",{ props: { accentColor: "#B8963E" } }),
      blockEl("sb-logos-badges",          3, "Awards"),
      blockEl("sb-content-magazine-split",4, "Dining",         { props: { accentColor: "#B8963E" } }),
      blockEl("sb-content-magazine-split",5, "Wellness"),
      blockEl("sb-testimonials-wall",     6, "Guest Stories"),
      blockEl("sb-saas-integration-logos",7, "Partnerships"),
      blockEl("sb-cta-gradient-wave",     8, "Begin Your Stay",{ props: { accentColor: "#B8963E", title: "Begin Your Stay" } }),
      blockEl("sb-footer-mega",           9, "Footer",         { props: { brandName: "Grand" } }),
    ],
  },
  {
    name: "Rooms & Suites", slug: "/rooms",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",          { props: { accentColor: "#B8963E", brandName: "Grand" } }),
      blockEl("sb-hero-video-dark",       1, "Rooms",           { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-dark-bento",   2, "Suite Categories",{ props: { accentColor: "#B8963E" } }),
      blockEl("sb-portfolio-case-study",  3, "Grand Suite"),
      blockEl("sb-features-checklist",    4, "All Amenities"),
      blockEl("sb-cta-gradient-wave",     5, "Book",            { props: { accentColor: "#B8963E" } }),
      blockEl("sb-footer-mega",           6, "Footer",          { props: { brandName: "Grand" } }),
    ],
  },
  {
    name: "Dining", slug: "/dining",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",   { props: { accentColor: "#B8963E", brandName: "Grand" } }),
      blockEl("sb-hero-cinematic",        1, "Dining",   { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-alternating",  2, "Venues",   { props: { accentColor: "#B8963E" } }),
      blockEl("sb-interactive-accordion-faq",3,"Menus",  { props: { accentColor: "#B8963E" } }),
      blockEl("sb-team-spotlight",        4, "Chef"),
      blockEl("sb-cta-gradient-wave",     5, "Reserve",  { props: { accentColor: "#B8963E" } }),
      blockEl("sb-footer-mega",           6, "Footer",   { props: { brandName: "Grand" } }),
    ],
  },
  {
    name: "Wellness", slug: "/wellness",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",       { props: { accentColor: "#B8963E", brandName: "Grand" } }),
      blockEl("sb-hero-bento",            1, "Spa & Wellness",{ props: { accentColor: "#B8963E" } }),
      blockEl("sb-services-alternating",  2, "Treatments",   { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-bold-grid",    3, "Thermal",      { props: { accentColor: "#B8963E" } }),
      blockEl("sb-pricing-dark-cards",    4, "Day Packages", { props: { accentColor: "#B8963E" } }),
      blockEl("sb-cta-gradient-wave",     5, "Book",         { props: { accentColor: "#B8963E" } }),
      blockEl("sb-footer-mega",           6, "Footer",       { props: { brandName: "Grand" } }),
    ],
  },
  {
    name: "Experiences", slug: "/experiences",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",      { props: { accentColor: "#B8963E", brandName: "Grand" } }),
      blockEl("sb-hero-product",          1, "Experiences", { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-dark-bento",   2, "Signature",   { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-alternating",  3, "Packages",    { props: { accentColor: "#B8963E" } }),
      blockEl("sb-cta-gradient-wave",     4, "Concierge",   { props: { accentColor: "#B8963E" } }),
      blockEl("sb-footer-mega",           5, "Footer",      { props: { brandName: "Grand" } }),
    ],
  },
  {
    name: "Meetings", slug: "/meetings",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",        { props: { accentColor: "#B8963E", brandName: "Grand" } }),
      blockEl("sb-hero-enterprise",       1, "Meetings",       { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-dark-bento",   2, "Event Spaces",  { props: { accentColor: "#B8963E" } }),
      blockEl("sb-stats-dark-cards",      3, "Capacity Stats", { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-checklist",    4, "AV & Services"),
      blockEl("sb-contact-split",         5, "Enquiry",        { props: { accentColor: "#B8963E" } }),
      blockEl("sb-footer-mega",           6, "Footer",         { props: { brandName: "Grand" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",     { props: { accentColor: "#B8963E", brandName: "Grand" } }),
      blockEl("sb-contact-dark",          1, "Book",       { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-cards",        2, "Offers",     { props: { accentColor: "#B8963E" } }),
      blockEl("sb-features-checklist",    3, "Assurance"),
      blockEl("sb-footer-mega",           4, "Footer",     { props: { brandName: "Grand" } }),
    ],
  },
];

// ─── Villa — hotel-villa · FREE ───────────────────────────────────────────────
// Warm personal — classic editorial hero + magazine split host welcome + single quote review
const villaPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",         0, "Navbar",        { props: { brandName: "Villa" } }),
      blockEl("sb-hero-editorial-classic", 1, "Hero",          { props: { accentColor: "#854D0E" } }),
      blockEl("sb-content-magazine-split", 2, "Host Welcome",  { props: { accentColor: "#854D0E" } }),
      blockEl("sb-features-cards",         3, "Rooms",         { props: { accentColor: "#854D0E" } }),
      blockEl("sb-features-icon-3col",     4, "Highlights",    { props: { accentColor: "#854D0E" } }),
      blockEl("sb-testimonials-single-quote",5,"Guest Story"),
      blockEl("sb-features-cards",         6, "Packages",      { props: { accentColor: "#854D0E" } }),
      blockEl("sb-footer-light",           7, "Footer",        { props: { brandName: "Villa" } }),
    ],
  },
  {
    name: "Rooms", slug: "/rooms",
    elements: [
      blockEl("sb-navbar-minimal",          0, "Navbar"),
      blockEl("sb-hero-organic",            1, "Rooms",          { props: { accentColor: "#854D0E" } }),
      blockEl("sb-features-alternating-rows",2,"Room Detail",   { props: { accentColor: "#854D0E" } }),
      blockEl("sb-features-checklist",      3, "What's Included"),
      blockEl("sb-cta-minimal-center",      4, "Book",          { props: { accentColor: "#854D0E" } }),
      blockEl("sb-footer-light",            5, "Footer",        { props: { brandName: "Villa" } }),
    ],
  },
  {
    name: "Dining & Breakfast", slug: "/dining",
    elements: [
      blockEl("sb-navbar-minimal",         0, "Navbar"),
      blockEl("sb-hero-editorial-classic", 1, "Breakfast",       { props: { accentColor: "#854D0E" } }),
      blockEl("sb-features-bold-grid",     2, "Breakfast Menu",  { props: { accentColor: "#854D0E" } }),
      blockEl("sb-content-magazine-split", 3, "Evening Options", { props: { accentColor: "#854D0E" } }),
      blockEl("sb-content-feature-list",   4, "Dietary Needs"),
      blockEl("sb-footer-light",           5, "Footer",          { props: { brandName: "Villa" } }),
    ],
  },
  {
    name: "Location", slug: "/location",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-contact-map",          1, "Map"),
      blockEl("sb-features-steps",       2, "Getting Here"),
      blockEl("sb-features-cards",       3, "Things to Do",  { props: { accentColor: "#854D0E" } }),
      blockEl("sb-footer-light",         4, "Footer",        { props: { brandName: "Villa" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-minimal",      0, "Navbar"),
      blockEl("sb-contact-split",       1, "Book Direct",    { props: { accentColor: "#854D0E" } }),
      blockEl("sb-features-checklist",  2, "Benefits"),
      blockEl("sb-cta-banner",          3, "Gift Vouchers",  { props: { accentColor: "#854D0E" } }),
      blockEl("sb-footer-light",        4, "Footer",         { props: { brandName: "Villa" } }),
    ],
  },
];

// =============================================================================
// ECOMMERCE ADDITIONAL TEMPLATE
// =============================================================================

// ─── Shop — ecommerce-shop · FREE ─────────────────────────────────────────────
// Bold ecommerce hero + stats trust row + bold grid categories + marquee reviews
const shopPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-ecommerce",            0, "Navbar",      { props: { accentColor: "#16A34A", brandName: "Shop" } }),
      blockEl("sb-ecommerce-hero",              1, "Hero",        { props: { accentColor: "#16A34A" } }),
      blockEl("sb-features-bold-grid",          2, "Categories",  { props: { accentColor: "#16A34A" } }),
      blockEl("sb-ecommerce-featured-products", 3, "Bestsellers", { props: { accentColor: "#16A34A" } }),
      blockEl("sb-stats-minimal-row",           4, "Trust Points"),
      blockEl("sb-content-magazine-split",      5, "New Collection",{ props: { accentColor: "#16A34A" } }),
      blockEl("sb-testimonials-marquee",        6, "Reviews"),
      blockEl("sb-cta-newsletter",              7, "Newsletter",  { props: { accentColor: "#16A34A" } }),
      blockEl("sb-footer-newsletter",           8, "Footer",      { props: { brandName: "Shop" } }),
    ],
  },
  {
    name: "Shop", slug: "/shop",
    elements: [
      blockEl("sb-navbar-ecommerce",            0, "Navbar",       { props: { accentColor: "#16A34A", brandName: "Shop" } }),
      blockEl("sb-hero-search-centered",        1, "Category",     { props: { accentColor: "#16A34A" } }),
      blockEl("sb-ecommerce-featured-products", 2, "All Products", { props: { accentColor: "#16A34A" } }),
      blockEl("sb-footer-newsletter",           3, "Footer",       { props: { brandName: "Shop" } }),
    ],
  },
  {
    name: "Product", slug: "/shop/product",
    elements: [
      blockEl("sb-navbar-ecommerce",         0, "Navbar",         { props: { accentColor: "#16A34A", brandName: "Shop" } }),
      blockEl("sb-ecommerce-product-detail", 1, "Product Detail", { props: { accentColor: "#16A34A" } }),
      blockEl("sb-ecommerce-reviews",        2, "Reviews"),
      blockEl("sb-ecommerce-upsell",         3, "Related",        { props: { accentColor: "#16A34A" } }),
      blockEl("sb-footer-newsletter",        4, "Footer",         { props: { brandName: "Shop" } }),
    ],
  },
  {
    name: "Cart", slug: "/cart",
    elements: [
      blockEl("sb-navbar-ecommerce",       0, "Navbar", { props: { accentColor: "#16A34A", brandName: "Shop" } }),
      blockEl("sb-ecommerce-cart-checkout",1, "Cart",   { props: { accentColor: "#16A34A" } }),
      blockEl("sb-footer-minimal",         2, "Footer"),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-ecommerce",       0, "Navbar",      { props: { accentColor: "#16A34A", brandName: "Shop" } }),
      blockEl("sb-hero-organic",           1, "Brand Story", { props: { accentColor: "#16A34A" } }),
      blockEl("sb-features-alternating",   2, "Our Craft",   { props: { accentColor: "#16A34A" } }),
      blockEl("sb-logos-badges",           3, "Certifications"),
      blockEl("sb-team-grid",              4, "Team"),
      blockEl("sb-cta-gradient",           5, "Shop",        { props: { accentColor: "#16A34A" } }),
      blockEl("sb-footer-newsletter",      6, "Footer",      { props: { brandName: "Shop" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-ecommerce",    0, "Navbar",   { props: { accentColor: "#16A34A", brandName: "Shop" } }),
      blockEl("sb-faq-two-col",         1, "FAQ"),
      blockEl("sb-contact-split",       2, "Contact",  { props: { accentColor: "#16A34A" } }),
      blockEl("sb-footer-newsletter",   3, "Footer",   { props: { brandName: "Shop" } }),
    ],
  },
];

// =============================================================================
// EVENTS & VENUES TEMPLATE
// =============================================================================

// ─── Gather — events-gather · FREE ────────────────────────────────────────────
// Studio hero + magazine split overview + pricing packages + wedding testimonial wall
const gatherPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-glass",          0, "Navbar",      { props: { accentColor: "#D97706", brandName: "Gather" } }),
      blockEl("sb-hero-studio",           1, "Hero",        { props: { accentColor: "#D97706" } }),
      blockEl("sb-content-magazine-split",2, "The Venue",  { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-cards",        3, "Event Types", { props: { accentColor: "#D97706" } }),
      blockEl("sb-portfolio-bento",       4, "Gallery"),
      blockEl("sb-stats-light",           5, "By the Numbers"),
      blockEl("sb-testimonials-grid",     6, "What Clients Say"),
      blockEl("sb-logos-badges",          7, "Awards"),
      blockEl("sb-cta-gradient",          8, "Enquire",     { props: { accentColor: "#D97706", title: "Planning an Event? Let's Talk." } }),
      blockEl("sb-footer-corporate",      9, "Footer",      { props: { brandName: "Gather" } }),
    ],
  },
  {
    name: "Venue & Spaces", slug: "/spaces",
    elements: [
      blockEl("sb-navbar-glass",          0, "Navbar",    { props: { accentColor: "#D97706", brandName: "Gather" } }),
      blockEl("sb-hero-bento",            1, "Our Spaces",{ props: { accentColor: "#D97706" } }),
      blockEl("sb-services-alternating",  2, "Indoor",    { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-alternating",  3, "Outdoor",   { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-checklist",    4, "Facilities"),
      blockEl("sb-cta-gradient",          5, "Enquire",   { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",      6, "Footer",    { props: { brandName: "Gather" } }),
    ],
  },
  {
    name: "Weddings", slug: "/weddings",
    elements: [
      blockEl("sb-navbar-glass",          0, "Navbar",        { props: { accentColor: "#D97706", brandName: "Gather" } }),
      blockEl("sb-hero-cinematic",        1, "Weddings",      { props: { accentColor: "#D97706" } }),
      blockEl("sb-pricing-table",         2, "Packages",      { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-checklist",    3, "What's Included"),
      blockEl("sb-portfolio-editorial",   4, "Real Weddings"),
      blockEl("sb-testimonials-wall",     5, "Couples"),
      blockEl("sb-faq-two-col",           6, "FAQ"),
      blockEl("sb-cta-gradient",          7, "Book Your Date",{ props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",      8, "Footer",        { props: { brandName: "Gather" } }),
    ],
  },
  {
    name: "Corporate Events", slug: "/corporate",
    elements: [
      blockEl("sb-navbar-glass",          0, "Navbar",       { props: { accentColor: "#D97706", brandName: "Gather" } }),
      blockEl("sb-hero-enterprise",       1, "Corporate",    { props: { accentColor: "#D97706" } }),
      blockEl("sb-services-card-grid",    2, "Services",     { props: { accentColor: "#D97706" } }),
      blockEl("sb-stats-light",           3, "Capacity Info"),
      blockEl("sb-features-alternating",  4, "Catering",     { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-bold-grid",    5, "Tech & AV",    { props: { accentColor: "#D97706" } }),
      blockEl("sb-contact-split",         6, "Enquiry",      { props: { accentColor: "#D97706" } }),
      blockEl("sb-footer-corporate",      7, "Footer",       { props: { brandName: "Gather" } }),
    ],
  },
  {
    name: "Contact & Enquiry", slug: "/contact",
    elements: [
      blockEl("sb-navbar-glass",         0, "Navbar",       { props: { accentColor: "#D97706", brandName: "Gather" } }),
      blockEl("sb-contact-map",          1, "Find Us"),
      blockEl("sb-contact-split",        2, "Enquiry",      { props: { accentColor: "#D97706" } }),
      blockEl("sb-features-steps",       3, "Getting Here"),
      blockEl("sb-footer-corporate",     4, "Footer",       { props: { brandName: "Gather" } }),
    ],
  },
];

// =============================================================================
// LOCAL BUSINESS TEMPLATE
// =============================================================================

// ─── LocalPro — local-pro · FREE ──────────────────────────────────────────────
// Industrial hero + services card grid + stats trust row + map + credentials
const localProPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-saas",          0, "Navbar",        { props: { accentColor: "#0369A1", brandName: "LocalPro" } }),
      blockEl("sb-hero-industrial",      1, "Hero",          { props: { accentColor: "#0369A1" } }),
      blockEl("sb-stats-light",          2, "Trust Numbers"),
      blockEl("sb-services-card-grid",   3, "Services",      { props: { accentColor: "#0369A1" } }),
      blockEl("sb-features-alternating", 4, "Why Choose Us", { props: { accentColor: "#0369A1" } }),
      blockEl("sb-testimonials-grid",    5, "Reviews"),
      blockEl("sb-contact-map",          6, "Service Area"),
      blockEl("sb-logos-badges",         7, "Credentials"),
      blockEl("sb-cta-bold",             8, "Get a Quote",   { props: { accentColor: "#0369A1", title: "Get Your Free Quote Today" } }),
      blockEl("sb-footer-corporate",     9, "Footer",        { props: { brandName: "LocalPro" } }),
    ],
  },
  {
    name: "Services", slug: "/services",
    elements: [
      blockEl("sb-navbar-saas",          0, "Navbar",         { props: { accentColor: "#0369A1", brandName: "LocalPro" } }),
      blockEl("sb-hero-enterprise",      1, "Our Services",   { props: { accentColor: "#0369A1" } }),
      blockEl("sb-services-alternating", 2, "Service Detail", { props: { accentColor: "#0369A1" } }),
      blockEl("sb-faq-two-col",          3, "FAQ"),
      blockEl("sb-cta-gradient",         4, "Get a Quote", { props: { accentColor: "#0369A1" } }),
      blockEl("sb-footer-corporate",     5, "Footer",      { props: { brandName: "LocalPro" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-saas",          0, "Navbar",         { props: { accentColor: "#0369A1", brandName: "LocalPro" } }),
      blockEl("sb-hero-feature-stack",   1, "Our Story",      { props: { accentColor: "#0369A1" } }),
      blockEl("sb-stats-dark-cards",     2, "By the Numbers"),
      blockEl("sb-team-minimal-list",    3, "Our Team"),
      blockEl("sb-testimonials-marquee", 4, "What Clients Say"),
      blockEl("sb-footer-corporate",     5, "Footer",         { props: { brandName: "LocalPro" } }),
    ],
  },
  {
    name: "Contact & Quote", slug: "/contact",
    elements: [
      blockEl("sb-navbar-saas",          0, "Navbar",           { props: { accentColor: "#0369A1", brandName: "LocalPro" } }),
      blockEl("sb-contact-split",        1, "Get a Quote",      { props: { accentColor: "#0369A1" } }),
      blockEl("sb-contact-map",          2, "Service Area"),
      blockEl("sb-content-feature-list", 3, "Emergency Contact"),
      blockEl("sb-footer-corporate",     4, "Footer",           { props: { brandName: "LocalPro" } }),
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
    description: "Frosted-glass SaaS with dashboard preview hero, bento features, marquee testimonials, and newsletter footer.",
    longDescription: "Pulse is a light-mode, conversion-focused SaaS template for early-stage products. Pairs a frosted glass navbar with a dashboard preview hero, bento feature grid, how-it-works steps, scrolling testimonial marquee, pricing toggle, gradient-wave CTA, and a newsletter footer. Five pages: Home, Features, Pricing, Blog, Contact.",
    tier: "free",
    gradient: "from-indigo-500 via-violet-500 to-purple-600",
    accentHex: "#6366F1",
    tags: ["SaaS", "Frosted Glass", "Dashboard", "Bento", "Indigo"],
    features: ["5 pages", "Frosted glass navbar", "Dashboard preview hero", "Bento features", "Pricing toggle", "Marquee testimonials", "Newsletter footer"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#6366F1,#8B5CF6)" },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.22, cols: 3 },
      { type: "testimonials", heightRatio: 0.10 },
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
    description: "Dark SaaS for AI platforms — cinematic video hero, feature wall, dark grid testimonials, and auth pages.",
    longDescription: "Orion is a full dark-mode SaaS template targeting technical and enterprise buyers. Features a dark gradient navbar, video-dark cinematic hero, feature wall, dark stats, dark testimonials grid, integration grid, dark pricing cards, and auth pages. Seven pages: Home, Product, Pricing, Customers, Company, Sign In, Sign Up.",
    tier: "pro",
    gradient: "from-blue-600 via-blue-700 to-indigo-900",
    accentHex: "#3B82F6",
    tags: ["SaaS", "Dark Mode", "AI", "Video Hero", "Enterprise"],
    features: ["7 pages", "Dark gradient navbar", "Video hero", "Feature wall", "Dark testimonials", "Auth pages"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#0a0020,#0d1545)", dark: true },
      { type: "features",     heightRatio: 0.22, dark: true, cols: 3 },
      { type: "testimonials", heightRatio: 0.12, dark: true, cols: 3 },
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
    description: "Developer-tool SaaS with split-panel navbar, gradient-split hero, dark bento, roadmap timeline, and pricing toggle.",
    longDescription: "Vertex is built for developer tools, APIs, and infrastructure products. Features a split-panel navbar, gradient-split hero, dark bento features, API preview, roadmap timeline, stats row, testimonials, pricing toggle, integration grid, and dark footer. Six pages: Home, Docs, Pricing, Integrations, Blog, Sign In.",
    tier: "pro",
    gradient: "from-emerald-500 via-teal-500 to-green-600",
    accentHex: "#10B981",
    tags: ["Developer", "API", "Split Panel", "Gradient Hero", "Roadmap"],
    features: ["6 pages", "Split-panel navbar", "Gradient-split hero", "Dark bento", "Roadmap timeline", "Pricing toggle", "Docs page"],
    preview: [
      { type: "navbar",   heightRatio: 0.06, dark: true },
      { type: "hero",     heightRatio: 0.26, bg: "linear-gradient(135deg,#064E3B,#065F46)", dark: true },
      { type: "features", heightRatio: 0.22, dark: true, cols: 3 },
      { type: "stats",    heightRatio: 0.07 },
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
    description: "Light B2B SaaS with centered-logo navbar, glass hero, icon features, and single testimonial quote.",
    longDescription: "Flux is a distraction-free, professional SaaS template for B2B buyers who value clarity. Features a centered-logo navbar, glass hero, icon-based 3-col features, single testimonial quote, clean pricing, and a simple CTA. Five pages: Home, Features, Pricing, About, Contact.",
    tier: "free",
    gradient: "from-slate-500 via-slate-600 to-slate-800",
    accentHex: "#64748B",
    tags: ["SaaS", "Minimal", "Glass Hero", "B2B", "Clean"],
    features: ["5 pages", "Centered-logo navbar", "Glass hero", "Icon features", "Single testimonial", "Clean pricing"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.22, bg: "linear-gradient(135deg,#F1F5F9,#E2E8F0)" },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "testimonials", heightRatio: 0.10 },
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
    description: "Orange creative agency with underline navbar, studio hero, editorial portfolio, and process steps.",
    longDescription: "Prism is an energetic creative agency template built for bold visual studios. Features an underline navbar, studio-style hero, services card grid, editorial portfolio showcase, client logos, testimonials, and a gradient CTA. Five pages: Home, Services, Work, About, Contact.",
    tier: "free",
    gradient: "from-orange-500 via-red-500 to-rose-600",
    accentHex: "#F97316",
    tags: ["Agency", "Underline Nav", "Studio Hero", "Portfolio", "Creative"],
    features: ["5 pages", "Underline navbar", "Studio hero", "Editorial portfolio", "Services grid", "Process steps"],
    preview: [
      { type: "navbar",    heightRatio: 0.06 },
      { type: "hero",      heightRatio: 0.28, bg: "linear-gradient(135deg,#18050a,#3b0010)", dark: true },
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
    description: "Dark corporate agency with Meridian enterprise hero, dark services list, editorial portfolio, and mega footer.",
    longDescription: "Atlas is a premium corporate agency template for full-service agencies targeting enterprise clients. Features a corporate navbar, Meridian enterprise hero, dark bento services, editorial portfolio, case study callout, team spotlight, blog preview, and a mega footer. Six pages: Home, Services, Work, Blog, Team, Contact.",
    tier: "pro",
    gradient: "from-zinc-700 via-zinc-800 to-zinc-950",
    accentHex: "#18181B",
    tags: ["Agency", "Corporate", "Enterprise Hero", "Dark", "Mega Footer"],
    features: ["6 pages", "Corporate navbar", "Enterprise hero", "Dark services list", "Editorial portfolio", "Mega footer"],
    preview: [
      { type: "navbar",    heightRatio: 0.06 },
      { type: "hero",      heightRatio: 0.28, bg: "linear-gradient(135deg,#09090b,#27272a)", dark: true },
      { type: "services",  heightRatio: 0.22, dark: true, cols: 3 },
      { type: "portfolio", heightRatio: 0.18, cols: 3 },
      { type: "cta",       heightRatio: 0.10, dark: true },
      { type: "footer",    heightRatio: 0.04, dark: true },
    ],
    pages: atlasPages,
  },
  {
    id: "agency-cipher",
    name: "Cipher",
    category: "agency",
    description: "Dark boutique studio with bento hero, animated marquee, highlight features, and editorial portfolio.",
    longDescription: "Cipher is an immersive dark-mode studio template for high-end creative agencies. Features a dark minimal navbar, bento-style hero, animated marquee, dark portfolio cards, highlight features, journal blog, and a studio profile. Six pages: Home, Work, Studio, Services, Journal, Contact.",
    tier: "pro",
    gradient: "from-purple-800 via-violet-900 to-black",
    accentHex: "#7C3AED",
    tags: ["Agency", "Dark Mode", "Bento Hero", "Violet", "Boutique"],
    features: ["6 pages", "Bento hero", "Animated marquee", "Dark portfolio", "Highlight features", "Studio page"],
    preview: [
      { type: "navbar",    heightRatio: 0.06, dark: true },
      { type: "hero",      heightRatio: 0.30, bg: "linear-gradient(135deg,#0a0014,#1a0040)", dark: true },
      { type: "portfolio", heightRatio: 0.26, dark: true, cols: 3 },
      { type: "features",  heightRatio: 0.12, dark: true, cols: 3 },
      { type: "cta",       heightRatio: 0.08, dark: true },
      { type: "footer",    heightRatio: 0.04, dark: true },
    ],
    pages: cipherPages,
  },
  {
    id: "agency-signal",
    name: "Signal",
    category: "agency",
    description: "Performance marketing agency with SaaS navbar, industrial hero, stats chart, and alternating services.",
    longDescription: "Signal is a results-focused template for growth and performance marketing agencies. Features a SaaS navbar, industrial-style hero, services card grid, stats with chart, portfolio bento, and CMO-level testimonials. Five pages: Home, Services, Results, About, Contact.",
    tier: "free",
    gradient: "from-red-500 via-orange-500 to-amber-500",
    accentHex: "#EF4444",
    tags: ["Agency", "SaaS Nav", "Industrial Hero", "Stats Chart", "Performance"],
    features: ["5 pages", "SaaS navbar", "Industrial hero", "Stats with chart", "Services alternating", "Case studies"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#27100a,#3d1505)", dark: true },
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
    description: "Creative portfolio with creative navbar, playful hero, editorial work grid, and timeline services.",
    longDescription: "Canvas is an editorial personal portfolio template for designers and illustrators. Features a creative navbar, playful hero, featured project bento, editorial portfolio showcase, timeline services, single testimonial quote, and a minimal footer. Five pages: Home, Work, About, Services, Contact.",
    tier: "free",
    gradient: "from-gray-700 via-gray-800 to-gray-900",
    accentHex: "#374151",
    tags: ["Portfolio", "Creative Nav", "Playful Hero", "Editorial", "Designer"],
    features: ["5 pages", "Creative navbar", "Playful hero", "Editorial portfolio", "Timeline services", "Quote testimonial"],
    preview: [
      { type: "navbar",    heightRatio: 0.06 },
      { type: "hero",      heightRatio: 0.22, bg: "linear-gradient(135deg,#F3F4F6,#E5E7EB)" },
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
    description: "Dark developer portfolio with feature-stack hero, skills bento, team spotlight, and writing.",
    longDescription: "Folio is a technical dark-mode portfolio for software engineers and developers. Features a pill navbar, feature-stack hero, dark project cards, skills bento, team spotlight section, writing/blog, and social links. Five pages: Home, Projects, Experience, Writing, Contact.",
    tier: "pro",
    gradient: "from-cyan-500 via-sky-600 to-blue-700",
    accentHex: "#06B6D4",
    tags: ["Portfolio", "Developer", "Feature-Stack Hero", "Dark Mode", "Technical"],
    features: ["5 pages", "Pill navbar", "Feature-stack hero", "Dark projects", "Team spotlight", "Writing"],
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
    description: "Editorial amber blog with magazine split layout, featured story, article page, and newsletter.",
    longDescription: "Ink is a writer-first editorial blog template with a dedicated blog navbar, large featured story, magazine-split top stories, article grid, full article page with pull quotes and author bio, newsletter subscription, and an about page. Five pages: Home, Blog, Article, About, Newsletter.",
    tier: "free",
    gradient: "from-amber-400 via-orange-400 to-orange-500",
    accentHex: "#F59E0B",
    tags: ["Blog", "Magazine Split", "Editorial", "Newsletter", "Amber"],
    features: ["5 pages", "Blog navbar", "Magazine split", "Featured story", "Article page", "Pull quotes", "Newsletter"],
    preview: [
      { type: "navbar",  heightRatio: 0.06 },
      { type: "hero",    heightRatio: 0.20, bg: "linear-gradient(135deg,#F59E0B,#D97706)" },
      { type: "blog",    heightRatio: 0.34, cols: 3 },
      { type: "cta",     heightRatio: 0.10, bg: "linear-gradient(135deg,#78350F,#451A03)", dark: true },
      { type: "footer",  heightRatio: 0.02 },
    ],
    pages: inkPages,
  },
  {
    id: "blog-dispatch",
    name: "Dispatch",
    category: "blog",
    description: "Magazine-style publication with two-row navbar, magazine-split lead, issues archive, and pricing subscribe.",
    longDescription: "Dispatch is a professional editorial publication template for newsletter companies and media brands. Features a two-row navbar, magazine-split lead section, issue grid, author spotlights, topic browser, pricing toggle subscribe, and a newsletter footer. Six pages: Home, Issues, Article, Authors, Topics, Subscribe.",
    tier: "pro",
    gradient: "from-slate-600 via-slate-700 to-slate-900",
    accentHex: "#475569",
    tags: ["Blog", "Two-Row Nav", "Magazine", "Publication", "Newsletter"],
    features: ["6 pages", "Two-row navbar", "Magazine split", "Issue archive", "Article page", "Pricing toggle subscribe"],
    preview: [
      { type: "navbar",  heightRatio: 0.07 },
      { type: "blog",    heightRatio: 0.36, cols: 3 },
      { type: "team",    heightRatio: 0.12 },
      { type: "cta",     heightRatio: 0.10, bg: "linear-gradient(135deg,#1e293b,#0f172a)", dark: true },
      { type: "footer",  heightRatio: 0.03 },
    ],
    pages: dispatchPages,
  },

  // ── E-Commerce ─────────────────────────────────────────────────────────────
  {
    id: "ecommerce-crate",
    name: "Crate",
    category: "ecommerce",
    description: "Emerald e-commerce with stats value props, marquee reviews, product detail, cart, and newsletter footer.",
    longDescription: "Crate is a friction-free small store template. Features an e-commerce navbar, product hero, category cards, featured products, stats value props, scrolling review marquee, full product detail with upsells, cart checkout, and a newsletter footer. Five pages: Home, Shop, Product, Cart, About.",
    tier: "free",
    gradient: "from-emerald-500 via-teal-500 to-cyan-600",
    accentHex: "#10B981",
    tags: ["E-Commerce", "Shop", "Emerald", "Marquee Reviews", "Newsletter Footer"],
    features: ["5 pages", "E-commerce navbar", "Stats row", "Marquee reviews", "Product detail", "Cart checkout"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#10B981,#0D9488)" },
      { type: "grid",         heightRatio: 0.26, cols: 4 },
      { type: "testimonials", heightRatio: 0.10 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#065F46,#134E4A)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: cratePages,
  },
  {
    id: "ecommerce-luxe",
    name: "Luxe",
    category: "ecommerce",
    description: "Luxury fashion brand with centered-logo navbar, cinematic hero, editorial portfolio, and gradient footer.",
    longDescription: "Luxe is a luxury brand template for fashion, artisan goods, and premium lifestyle products. Features a centered-logo navbar, full-screen cinematic hero, collection bento, editorial alternating product showcases, editorial lookbook, brand story, stockist map, and a gradient footer. Six pages: Home, Collection, Product, Lookbook, About, Contact.",
    tier: "pro",
    gradient: "from-stone-700 via-stone-800 to-stone-950",
    accentHex: "#1C1917",
    tags: ["E-Commerce", "Luxury", "Centered Logo", "Fashion", "Gradient Footer"],
    features: ["6 pages", "Centered-logo navbar", "Cinematic hero", "Editorial lookbook", "Quote testimonial", "Gradient footer"],
    preview: [
      { type: "navbar",     heightRatio: 0.06, dark: true },
      { type: "hero",       heightRatio: 0.34, bg: "linear-gradient(135deg,#0c0a09,#1c1917)", dark: true },
      { type: "portfolio",  heightRatio: 0.24, dark: true, cols: 2 },
      { type: "image-text", heightRatio: 0.18, dark: true },
      { type: "cta",        heightRatio: 0.08, dark: true },
      { type: "footer",     heightRatio: 0.03, dark: true },
    ],
    pages: luxePages,
  },
  {
    id: "ecommerce-market",
    name: "Market",
    category: "ecommerce",
    description: "Multi-vendor marketplace with search-centered hero, marquee reviews, mega footer, and full checkout.",
    longDescription: "Market is a multi-vendor marketplace template for large product catalogs. Features an e-commerce navbar, search-centered hero, category grid, featured and deals sections, marquee reviews, full product detail with FAQ, seller profiles, and a mega footer. Six pages: Home, Category, Product, Cart, Seller, About.",
    tier: "business",
    gradient: "from-blue-500 via-blue-600 to-indigo-700",
    accentHex: "#2563EB",
    tags: ["E-Commerce", "Marketplace", "Search Hero", "Multi-vendor", "Mega Footer"],
    features: ["6 pages", "Search-centered hero", "Marquee reviews", "FAQ product page", "Seller profiles", "Mega footer"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.20, bg: "linear-gradient(135deg,#DBEAFE,#BFDBFE)" },
      { type: "grid",         heightRatio: 0.28, cols: 4 },
      { type: "logos",        heightRatio: 0.06 },
      { type: "testimonials", heightRatio: 0.10 },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: marketPages,
  },

  // ── Startup ────────────────────────────────────────────────────────────────
  {
    id: "startup-launch",
    name: "Launch",
    category: "startup",
    description: "Pre-launch with dark waitlist hero, bento features, roadmap timeline, changelog, and pricing toggle.",
    longDescription: "Launch captures early users before going live — announcement bar, dark waitlist hero, live countdown, how-it-works steps, dark bento features, beta testimonials, pricing toggle, roadmap timeline, and changelog page. Three pages: Home, Features, Roadmap.",
    tier: "free",
    gradient: "from-fuchsia-500 via-pink-500 to-rose-500",
    accentHex: "#D946EF",
    tags: ["Startup", "Dark Waitlist", "Countdown", "Roadmap Timeline", "Changelog"],
    features: ["3 pages", "Announcement bar", "Dark waitlist hero", "Countdown", "Pricing toggle", "Roadmap timeline", "Changelog"],
    preview: [
      { type: "navbar",   heightRatio: 0.05, bg: "linear-gradient(90deg,#7C3AED,#DB2777)", dark: true },
      { type: "hero",     heightRatio: 0.28, bg: "linear-gradient(135deg,#1a0025,#2d0042)", dark: true },
      { type: "features", heightRatio: 0.18, dark: true, cols: 3 },
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
    description: "Mobile app landing with startup navbar, playful hero, icon features, marquee reviews, and app download CTA.",
    longDescription: "Ignite is a high-converting mobile app landing site with a startup navbar, playful hero, icon-based 3-col features, how-it-works steps, stats row, marquee reviews, pricing toggle, and an app download CTA. Four pages: Home, Features, Pricing, FAQ.",
    tier: "free",
    gradient: "from-purple-500 via-violet-600 to-indigo-700",
    accentHex: "#8B5CF6",
    tags: ["Mobile App", "Startup Nav", "Playful Hero", "App Download", "Marquee"],
    features: ["4 pages", "Startup navbar", "Playful hero", "Icon features", "Marquee reviews", "App download CTA"],
    preview: [
      { type: "navbar",   heightRatio: 0.06 },
      { type: "hero",     heightRatio: 0.28, bg: "linear-gradient(135deg,#2e0060,#4c1d95)" },
      { type: "features", heightRatio: 0.22, cols: 3 },
      { type: "stats",    heightRatio: 0.07 },
      { type: "pricing",  heightRatio: 0.14, cols: 3 },
      { type: "cta",      heightRatio: 0.08, bg: "linear-gradient(135deg,#7C3AED,#4F46E5)", dark: true },
      { type: "footer",   heightRatio: 0.03, dark: true },
    ],
    pages: ignitePages,
  },
  {
    id: "startup-boost",
    name: "Boost",
    category: "startup",
    description: "Scale-up template with frosted-glass navbar, dashboard preview hero, analytics section, and gradient-wave CTA.",
    longDescription: "Boost is designed for funded startups needing to impress enterprise buyers. Features a frosted glass navbar, dashboard preview hero, analytics hero section, stats with chart, testimonial wall, blog, team dark cards, pricing toggle, and a gradient-wave CTA. Six pages: Home, Product, Pricing, Blog, Team, Contact.",
    tier: "pro",
    gradient: "from-violet-600 via-purple-600 to-indigo-700",
    accentHex: "#7C3AED",
    tags: ["Startup", "Frosted Glass", "Dashboard Hero", "Analytics", "Scale-up"],
    features: ["6 pages", "Frosted glass navbar", "Dashboard preview", "Analytics section", "Stats chart", "Pricing toggle"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#3B0764,#1E1B4B)" },
      { type: "logos",        heightRatio: 0.07 },
      { type: "features",     heightRatio: 0.20, cols: 3 },
      { type: "stats",        heightRatio: 0.09 },
      { type: "testimonials", heightRatio: 0.14, dark: true },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#7C3AED,#4F46E5)", dark: true },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: boostPages,
  },

  // ── Restaurant (TEMPLATES.md) ─────────────────────────────────────────────
  {
    id: "restaurant-ember",
    name: "Ember",
    category: "restaurant",
    description: "Warm dark restaurant with cinematic hero, signature dishes, masonry gallery, and reservation CTA.",
    longDescription: "Ember is a photography-forward template for casual-upscale restaurants and gastropubs. Features a restaurant navbar, full-screen cinematic hero, alternating story section, signature dish cards, press logos, portfolio gallery, testimonials, and a gradient reservation CTA. Six pages: Home, Menu, About, Gallery, Reservations, Private Dining.",
    tier: "free",
    gradient: "from-orange-700 via-red-800 to-stone-900",
    accentHex: "#C2410C",
    tags: ["Restaurant", "Cinematic Hero", "Gallery", "Warm Dark", "Reservations"],
    features: ["6 pages", "Restaurant navbar", "Cinematic hero", "Signature dishes", "Gallery", "Reservation form"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.32, bg: "linear-gradient(135deg,#1A0F0A,#3D1505)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 4 },
      { type: "portfolio",    heightRatio: 0.22, cols: 2 },
      { type: "testimonials", heightRatio: 0.12 },
      { type: "cta",          heightRatio: 0.10, bg: "linear-gradient(135deg,#C2410C,#92400E)", dark: true },
      { type: "footer",       heightRatio: 0.04 },
    ],
    pages: emberPages,
  },
  {
    id: "restaurant-grove",
    name: "Grove",
    category: "restaurant",
    description: "Community café with organic hero, values strip, founder story, and newsletter footer.",
    longDescription: "Grove is a warm, community-focused café template for cafés, coffee shops, and neighbourhood eateries. Features a minimal navbar, organic photography hero, seasonal specials, icon values strip, alternating story section, testimonials, newsletter sign-up, and tabbed menu. Five pages: Home, Menu, Our Story, Events, Find Us.",
    tier: "free",
    gradient: "from-stone-500 via-stone-600 to-stone-800",
    accentHex: "#78716C",
    tags: ["Restaurant", "Café", "Organic Hero", "Community", "Newsletter"],
    features: ["5 pages", "Minimal navbar", "Organic hero", "Values strip", "Founder story", "Events page"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.26, bg: "linear-gradient(135deg,#FAFAF7,#F5F0EB)" },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "testimonials", heightRatio: 0.14, cols: 3 },
      { type: "cta",          heightRatio: 0.09, bg: "linear-gradient(135deg,#57534E,#44403C)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: grovePages,
  },
  {
    id: "restaurant-lumiere",
    name: "Lumière",
    category: "restaurant",
    description: "Fine dining with dark gold navbar, cinematic hero, editorial features, dark testimonials, and dark footer.",
    longDescription: "Lumière is a pure luxury fine dining template for tasting menu restaurants and private members clubs. Features a dark minimal navbar with gold accents, cinematic hero, alternating experience sections, dark logo cloud, dark testimonials grid, and a dark footer. Six pages: Home, Menu, Chef & Team, Wine, Reservations, Private Events.",
    tier: "pro",
    gradient: "from-stone-900 via-yellow-900 to-black",
    accentHex: "#C9A84C",
    tags: ["Restaurant", "Fine Dining", "Dark Mode", "Gold", "Luxury"],
    features: ["6 pages", "Dark navbar", "Cinematic hero", "Dark testimonials", "Chef page", "Wine page"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.34, bg: "linear-gradient(135deg,#0a0604,#1C1917)", dark: true },
      { type: "features",     heightRatio: 0.18, dark: true, cols: 2 },
      { type: "logos",        heightRatio: 0.06, dark: true },
      { type: "testimonials", heightRatio: 0.14, dark: true },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#1C1917,#2D2013)", dark: true },
      { type: "footer",       heightRatio: 0.04, dark: true },
    ],
    pages: lumierePages,
  },

  // ── Hotel & Hospitality ────────────────────────────────────────────────────
  {
    id: "hotel-haven",
    name: "Haven",
    category: "hotel",
    description: "Modern teal hotel with glass navbar, cinematic hero, room previews, facilities, and booking page.",
    longDescription: "Haven is a clean, conversion-focused hotel template for independent hotels, eco-resorts, and guesthouses. Features a glass navbar, cinematic hero, property intro, room preview cards, facilities strip, guest reviews, award badges, and a newsletter CTA. Six pages: Home, Rooms, Facilities, Dining, Location, Book.",
    tier: "free",
    gradient: "from-teal-600 via-emerald-700 to-cyan-800",
    accentHex: "#0F766E",
    tags: ["Hotel", "Glass Navbar", "Cinematic", "Teal", "Booking"],
    features: ["6 pages", "Glass navbar", "Cinematic hero", "Room previews", "Facilities page", "Booking page"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.30, bg: "linear-gradient(135deg,#042F2E,#134E4A)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "logos",        heightRatio: 0.06 },
      { type: "testimonials", heightRatio: 0.14 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#0F766E,#0E7490)", dark: true },
      { type: "footer",       heightRatio: 0.03 },
    ],
    pages: havenPages,
  },
  {
    id: "hotel-grand",
    name: "Grand",
    category: "hotel",
    description: "Luxury navy hotel with corporate navbar, cinematic hero, dining, wellness, and meetings pages.",
    longDescription: "Grand is a 4–5 star hotel template conveying heritage and exceptional service. Features a corporate navbar, cinematic hero, welcome narrative, room previews, award logos, dining and wellness sections, concierge experiences, case study suite highlight, and a mega footer. Seven pages: Home, Rooms & Suites, Dining, Wellness, Experiences, Meetings, Book.",
    tier: "pro",
    gradient: "from-indigo-900 via-blue-950 to-black",
    accentHex: "#1E1B4B",
    tags: ["Hotel", "Luxury", "Corporate Navbar", "Navy", "Mega Footer"],
    features: ["7 pages", "Corporate navbar", "Cinematic hero", "Suite highlight", "Wellness page", "Meetings page"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.30, bg: "linear-gradient(135deg,#0f0c29,#1E1B4B)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "logos",        heightRatio: 0.06 },
      { type: "testimonials", heightRatio: 0.14 },
      { type: "cta",          heightRatio: 0.10, bg: "linear-gradient(135deg,#1E1B4B,#312E81)", dark: true },
      { type: "footer",       heightRatio: 0.04 },
    ],
    pages: grandPages,
  },
  {
    id: "hotel-villa",
    name: "Villa",
    category: "hotel",
    description: "Warm B&B with organic hero, host welcome, room cards, and curated local recommendations.",
    longDescription: "Villa is an intimate, story-driven template for B&Bs, boutique guesthouses, and country villas. Features a minimal navbar, organic photography hero, host welcome section, room preview cards, property highlights, location lifestyle, guest reviews, packages, and a breakfast dining page. Five pages: Home, Rooms, Dining & Breakfast, Location, Book.",
    tier: "free",
    gradient: "from-amber-700 via-orange-800 to-stone-800",
    accentHex: "#854D0E",
    tags: ["Hotel", "B&B", "Organic Hero", "Warm", "Boutique"],
    features: ["5 pages", "Minimal navbar", "Organic hero", "Host welcome", "Breakfast page", "Local guide"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#451A03,#78350F)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "testimonials", heightRatio: 0.14 },
      { type: "cta",          heightRatio: 0.08 },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: villaPages,
  },

  // ── E-Commerce (additional) ────────────────────────────────────────────────
  {
    id: "ecommerce-shop",
    name: "Shop",
    category: "ecommerce",
    description: "Emerald general store with ecommerce hero, category tiles, featured products, and marquee reviews.",
    longDescription: "Shop is a clean, conversion-optimised template for independent retail stores and D2C brands. Features an e-commerce navbar, product hero, category cards, featured product grid, icon trust points, alternating collection highlight, marquee reviews, newsletter CTA, and a full product detail with upsells. Six pages: Home, Shop, Product, Cart, About, Contact.",
    tier: "free",
    gradient: "from-green-600 via-emerald-600 to-teal-700",
    accentHex: "#16A34A",
    tags: ["E-Commerce", "Shop", "Green", "Marquee Reviews", "Product Detail"],
    features: ["6 pages", "E-commerce navbar", "Category tiles", "Product grid", "Marquee reviews", "Cart checkout"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#14532D,#166534)" },
      { type: "grid",         heightRatio: 0.26, cols: 4 },
      { type: "testimonials", heightRatio: 0.10 },
      { type: "cta",          heightRatio: 0.08, bg: "linear-gradient(135deg,#15803D,#166534)", dark: true },
      { type: "footer",       heightRatio: 0.02 },
    ],
    pages: shopPages,
  },

  // ── Events & Venues ────────────────────────────────────────────────────────
  {
    id: "events-gather",
    name: "Gather",
    category: "events",
    description: "Event venue with glass navbar, cinematic hero, gallery, weddings page, corporate events, and enquiry.",
    longDescription: "Gather is an elegant events venue template for wedding venues, conference centres, and party venues. Features a glass navbar, cinematic hero, venue intro, event type cards, portfolio gallery, testimonials, award badges, weddings page with packages, corporate events page, and a contact enquiry form. Five pages: Home, Venue & Spaces, Weddings, Corporate Events, Contact & Enquiry.",
    tier: "free",
    gradient: "from-amber-600 via-orange-700 to-yellow-900",
    accentHex: "#D97706",
    tags: ["Events", "Venue", "Wedding", "Corporate", "Gallery"],
    features: ["5 pages", "Glass navbar", "Cinematic hero", "Wedding packages", "Corporate page", "Enquiry form"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.30, bg: "linear-gradient(135deg,#1C1007,#3D2800)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "portfolio",    heightRatio: 0.20, cols: 2 },
      { type: "testimonials", heightRatio: 0.12 },
      { type: "cta",          heightRatio: 0.10, bg: "linear-gradient(135deg,#D97706,#B45309)", dark: true },
      { type: "footer",       heightRatio: 0.04 },
    ],
    pages: gatherPages,
  },

  // ── Local Business ─────────────────────────────────────────────────────────
  {
    id: "local-pro",
    name: "LocalPro",
    category: "local",
    description: "Universal local business template with glass navbar, trust bar, services, reviews, and quote CTA.",
    longDescription: "LocalPro is the adaptable template for any local service business — plumbers, electricians, landscapers, cleaners, mechanics, and tradespeople. Features a glass navbar, enterprise hero, icon trust bar, service cards, alternating why-choose-us, Google review cards, service area map, credentials, and a gradient quote CTA. Four pages: Home, Services, About, Contact & Quote.",
    tier: "free",
    gradient: "from-sky-600 via-blue-700 to-cyan-800",
    accentHex: "#0369A1",
    tags: ["Local Business", "Services", "Tradespeople", "Sky Blue", "Reviews"],
    features: ["4 pages", "Glass navbar", "Enterprise hero", "Trust bar", "Service area map", "Quote form"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.24, bg: "linear-gradient(135deg,#0c4a6e,#0369A1)" },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "testimonials", heightRatio: 0.14 },
      { type: "logos",        heightRatio: 0.07 },
      { type: "cta",          heightRatio: 0.10, bg: "linear-gradient(135deg,#0369A1,#0284C7)", dark: true },
      { type: "footer",       heightRatio: 0.04 },
    ],
    pages: localProPages,
  },

  // ── Restaurant (existing) ──────────────────────────────────────────────────
  {
    id: "restaurant-savor",
    name: "Savor",
    category: "restaurant",
    description: "Fine dining with restaurant navbar, cinematic hero, team spotlight, tabbed menu, and gradient footer.",
    longDescription: "Savor is a photography-forward fine dining template. Features a dedicated restaurant navbar, full-screen cinematic hero, menu highlights, press logos, reviews, a reservation gradient CTA, tabbed menu with allergen info, team spotlight, and a gradient footer. Four pages: Home, Menu, About, Reservations.",
    tier: "free",
    gradient: "from-amber-700 via-orange-800 to-red-900",
    accentHex: "#D97706",
    tags: ["Restaurant", "Restaurant Nav", "Cinematic", "Gradient Footer", "Reservations"],
    features: ["4 pages", "Restaurant navbar", "Cinematic hero", "Team spotlight", "Tabbed menu", "Gradient footer"],
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
    description: "Cozy café with organic hero, single testimonial quote, tabbed menu, sourcing story, and minimal footer.",
    longDescription: "Brew is a warm, community-focused café template with a minimal navbar, organic photography hero, seasonal specials cards, featured guest review quote, founder story, customer reviews, tabbed menu, sourcing philosophy, and location map. Four pages: Home, Menu, Our Story, Find Us.",
    tier: "free",
    gradient: "from-amber-800 via-orange-900 to-stone-900",
    accentHex: "#92400E",
    tags: ["Restaurant", "Café", "Organic Hero", "Quote Testimonial", "Community"],
    features: ["4 pages", "Organic hero", "Guest review quote", "Tabbed menu", "Founder story", "Location map"],
    preview: [
      { type: "navbar",       heightRatio: 0.06 },
      { type: "hero",         heightRatio: 0.28, bg: "linear-gradient(135deg,#451A03,#78350F)", dark: true },
      { type: "features",     heightRatio: 0.18, cols: 3 },
      { type: "testimonials", heightRatio: 0.12 },
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
    description: "Teal wellness coaching with transparent navbar, icon services, process steps, and newsletter footer.",
    longDescription: "Thrive is a warm, approachable wellness coach template. Features a transparent navbar, classic editorial hero, icon-based 3-col services, process steps, single testimonial quote, stats row, blog preview, gradient-wave booking CTA, and a newsletter footer. Five pages: Home, Services, About, Blog, Book.",
    tier: "free",
    gradient: "from-teal-400 via-cyan-500 to-sky-500",
    accentHex: "#14B8A6",
    tags: ["Health", "Transparent Nav", "Icon Services", "Process Steps", "Newsletter Footer"],
    features: ["5 pages", "Transparent navbar", "Icon services", "Process steps", "Quote testimonial", "Gradient-wave CTA"],
    preview: [
      { type: "navbar",   heightRatio: 0.06 },
      { type: "hero",     heightRatio: 0.24, bg: "linear-gradient(135deg,#CCFBF1,#99F6E4)" },
      { type: "services", heightRatio: 0.22, cols: 3 },
      { type: "stats",    heightRatio: 0.08 },
      { type: "cta",      heightRatio: 0.10, bg: "linear-gradient(135deg,#0F766E,#0E7490)", dark: true },
      { type: "footer",   heightRatio: 0.02 },
    ],
    pages: thrivePages,
  },
  {
    id: "health-revive",
    name: "Revive",
    category: "health",
    description: "High-energy fitness studio with industrial hero, trainer spotlight, dark testimonials grid, and pricing toggle.",
    longDescription: "Revive is built for gyms, CrossFit boxes, and yoga studios. Features a bold navbar, industrial action hero, class type cards, bold stats, trainer spotlight, pricing toggle membership, dark testimonials grid, and a bold CTA. Five pages: Home, Classes, Trainers, Membership, Contact.",
    tier: "pro",
    gradient: "from-red-600 via-orange-600 to-amber-500",
    accentHex: "#EF4444",
    tags: ["Health", "Fitness", "Industrial Hero", "Dark Testimonials", "Pricing Toggle"],
    features: ["5 pages", "Bold navbar", "Industrial hero", "Trainer spotlight", "Dark testimonials", "Pricing toggle"],
    preview: [
      { type: "navbar",       heightRatio: 0.06, dark: true },
      { type: "hero",         heightRatio: 0.30, bg: "linear-gradient(135deg,#1a0000,#3b0000)", dark: true },
      { type: "services",     heightRatio: 0.18, cols: 4 },
      { type: "stats",        heightRatio: 0.10, bg: "linear-gradient(135deg,#EF4444,#F97316)", dark: true },
      { type: "testimonials", heightRatio: 0.12, dark: true },
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
    description: "Enterprise B2B platform with navy blue, trust grid, solutions bento, case studies, and dual CTA.",
    longDescription: "Summit is an authoritative enterprise corporate template for B2B platforms targeting Fortune 500 buyers. Features a corporate navbar, enterprise hero, logo cloud, solutions bento, platform dashboard, trust grid, case studies, trust badges, and a dual-CTA. Six pages: Home, Solutions, Platform, Company, Customers, Contact.",
    tier: "pro",
    gradient: "from-blue-700 via-blue-800 to-indigo-900",
    accentHex: "#1D4ED8",
    tags: ["Corporate", "Enterprise", "B2B", "Navy", "Trust Grid"],
    features: ["6 pages", "Corporate navbar", "Enterprise hero", "Trust grid", "Solutions bento", "Case studies", "Trust badges"],
    preview: [
      { type: "navbar",    heightRatio: 0.06 },
      { type: "hero",      heightRatio: 0.26, bg: "linear-gradient(135deg,#1e3a8a,#1d4ed8)" },
      { type: "logos",     heightRatio: 0.07 },
      { type: "features",  heightRatio: 0.22, cols: 3 },
      { type: "stats",     heightRatio: 0.09 },
      { type: "portfolio", heightRatio: 0.18, cols: 2 },
      { type: "cta",       heightRatio: 0.10, bg: "linear-gradient(135deg,#1D4ED8,#1e40af)", dark: true },
      { type: "footer",    heightRatio: 0.04 },
    ],
    pages: summitPages,
  },
  {
    id: "corp-meridian",
    name: "Meridian",
    category: "corporate",
    description: "Dark enterprise fintech platform with Meridian enterprise hero, feature wall, analytics hero, and enterprise footer.",
    longDescription: "Meridian is a credibility-first dark corporate template for infrastructure, fintech, and cybersecurity companies. Features a dark gradient navbar, Meridian enterprise hero, feature wall, analytics hero section, dark stats, partner tiers, trust grid, compliance badges, and a branded enterprise footer. Six pages: Home, Platform, Solutions, Partners, Company, Contact.",
    tier: "business",
    gradient: "from-slate-800 via-slate-900 to-black",
    accentHex: "#0F172A",
    tags: ["Corporate", "Enterprise", "Dark", "Fintech", "Feature Wall"],
    features: ["6 pages", "Dark gradient navbar", "Meridian hero", "Feature wall", "Analytics section", "Enterprise footer"],
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
  { id: "hotel",      label: "Hotel & Hospitality" },
  { id: "health",     label: "Health & Wellness" },
  { id: "corporate",  label: "Corporate" },
  { id: "events",     label: "Events & Venues" },
  { id: "local",      label: "Local Business" },
] as const;
