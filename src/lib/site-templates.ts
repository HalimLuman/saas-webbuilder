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

// ─── Content-patch system ─────────────────────────────────────────────────────
// Each patch matches either by exact content string (match) or by element type
// + DFS occurrence index (type + nth), then applies content / style / prop
// overrides to that node. applyPatches deep-clones before walking.

type ContentPatch = {
  match?: string;
  type?: string;
  nth?: number;
  content?: string;
  styles?: Record<string, unknown>;
  props?: Record<string, unknown>;
};

function applyPatches(root: RawElement, patches: ContentPatch[]): RawElement {
  const counts = new Map<string, number>();
  function walk(node: RawElement): RawElement {
    const t = node.type;
    const n = counts.get(t) ?? 0;
    counts.set(t, n + 1);
    const patch = patches.find(p => {
      if (p.match !== undefined && node.content !== undefined) {
        return p.match.replace(/\r\n/g, "\n").trim() === node.content.replace(/\r\n/g, "\n").trim();
      }
      return p.type === t && p.nth === n;
    });
    const out: RawElement = patch ? {
      ...node,
      ...(patch.content !== undefined ? { content: patch.content } : {}),
      styles: patch.styles ? { ...(node.styles as Record<string, unknown>), ...patch.styles } : node.styles,
      props:  patch.props  ? { ...(node.props  ?? {}),                    ...patch.props  } : node.props,
    } : { ...node };
    if (out.children) out.children = out.children.map(walk);
    return out;
  }
  return walk(JSON.parse(JSON.stringify(root)));
}

// ─── Hero patch helpers ───────────────────────────────────────────────────────

function ph_editorial(badge: string, heading: string, body: string, btn1 = "Learn more", btn2 = "Contact us", bgImage?: string): ContentPatch[] {
  const p: ContentPatch[] = [
    { match: "EST. 2026", content: badge },
    { match: "Crafting digital\nmasterpieces.", content: heading },
    { match: "We partner with visionary brands to build digital experiences that define industries and captivate audiences globally.", content: body },
    { match: "Our Portfolio", content: btn1 },
    { match: "Contact Studio", content: btn2 },
  ];
  if (bgImage) p.push({ type: "container", nth: 4, styles: { backgroundImage: `url('${bgImage}')`, backgroundSize: "cover", backgroundPosition: "center" } });
  return p;
}

function ph_editorialClassic(badge: string, heading: string, body: string, btn = "Read the Monograph"): ContentPatch[] {
  return [
    { match: "ISSUE 04 // 2026", content: badge },
    { match: "The quiet power of\nintentional design.", content: heading },
    { match: "A deep exploration into the philosophy of modern architecture and how it defines the digital landscapes we inhabit every day.", content: body },
    { match: "Read the Monograph", content: btn },
  ];
}

function ph_cinematic(badge: string, heading: string, body: string, btn1 = "Get started", btn2 = "Learn more", bgGlow?: string): ContentPatch[] {
  const p: ContentPatch[] = [
    { match: "✦ PROTOCOL ACTIVE", content: badge },
    { match: "Engineering\nSentience.", content: heading },
    { match: "The next evolution of cloud infrastructure is here. Sub-millisecond latency, planetary scale, and absolute security by default.", content: body },
    { match: "Initialize System →", content: btn1 },
  ];
  if (bgGlow) p.push({ type: "container", nth: 0, styles: { backgroundImage: `radial-gradient(circle at 50% 100%, ${bgGlow}, transparent 50%)` } });
  return p;
}

function ph_studio(heading: string, body: string, btn = "Start Project ➚"): ContentPatch[] {
  return [
    { match: "FORM\nFOLLOWS\nFUNCTION.", content: heading },
    { match: "A new standard for digital architecture. We build tools that prioritize clarity, speed, and the raw beauty of the web.", content: body },
    { match: "Start Project ➚", content: btn },
  ];
}

function ph_videoDark(badge: string, heading: string, body: string): ContentPatch[] {
  return [
    { match: "★  Rated #1 on Product Hunt 2026", content: badge },
    { match: "See it in action.", content: heading },
    { match: "Watch how teams go from idea to live site in under 10 minutes. No code. No compromise.", content: body },
  ];
}

function ph_abstractAmbient(heading: string, body: string, btn = "Enter the Studio"): ContentPatch[] {
  return [
    { match: "Design with a soul.", content: heading },
    { match: "Bridging the gap between human intuition and digital precision. We create spaces that resonate beyond the screen.", content: body },
    { match: "Enter the Studio", content: btn },
  ];
}

function ph_industrial(heading: string, body: string, btn: string, tag1: string, tag2: string, tag3: string): ContentPatch[] {
  return [
    { match: "SPEC-001\nINFINITE\nSCALABILITY.", content: heading },
    { match: "A high-performance framework built for developers who demand absolute precision. Open-source, distributed, and atomic by design.", content: body },
    { match: "View Documentation ➚", content: btn },
    { match: "< 5MS WORLDWIDE", content: tag1 },
    { match: "10M OPS / SEC", content: tag2 },
    { match: "99.9999% SLA", content: tag3 },
  ];
}

function ph_glass(badge: string, heading: string, body: string, btn1: string): ContentPatch[] {
  return [
    { match: "💎 PREMIUM EDITION", content: badge },
    { match: "Pure. Precise.\nLimitless.", content: heading },
    { match: "Experience the next level of digital elegance. Our platform combines cutting-edge performance with a design language that breathes.", content: body },
    { match: "Enter the Studio", content: btn1 },
  ];
}

function ph_enterprise(badge: string, heading: string, body: string, btn1: string, btn2: string): ContentPatch[] {
  return [
    { match: "TRUSTED BY 500+ GLOBAL ENTERPRISES", content: badge },
    { match: "Scale your business\nwith confidence.", content: heading },
    { match: "The world's most secure and scalable platform for building modern web experiences. We handle the infrastructure so you can focus on growth.", content: body },
    { match: "Contact Sales", content: btn1 },
    { match: "Start Enterprise Trial", content: btn2 },
  ];
}

function ph_playful(badge: string, heading: string, body: string, btn1: string, btn2: string): ContentPatch[] {
  return [
    { match: "🚀 JUST LAUNCHED v2.0", content: badge },
    { match: "Make some\nreal noise.", content: heading },
    { match: "Ditch the boring. The world's first maximalist website builder is here to help you break every rule in the book.", content: body },
    { match: "Start Disrupting", content: btn1 },
    { match: "See the Chaos", content: btn2 },
  ];
}

function ph_featureStack(badge: string, heading: string, body: string, btn1: string, btn2: string): ContentPatch[] {
  return [
    { match: "VERSION 4.0 IS HERE", content: badge },
    { match: "Build the future of the web.", content: heading },
    { match: "The most advanced website builder is now 10x faster and infinitely more customizable. Get started today and see the difference.", content: body },
    { match: "Start Building Free", content: btn1 },
    { match: "Watch Demo", content: btn2 },
  ];
}

function ph_organic(heading: string, body: string, btn: string, social?: string): ContentPatch[] {
  const p: ContentPatch[] = [
    { match: "Move at the speed\nof your ideas.", content: heading },
    { match: "Friendly, fast, and remarkably easy. We've redesigned the entire creation experience to flow as naturally as your own imagination.", content: body },
    { match: "Start Creating - It's Free", content: btn },
  ];
  if (social) p.push({ match: "Loved by 12,000+ creators world-wide.", content: social });
  return p;
}

function ph_bento(badge: string, heading: string, body: string, btn: string, s1v: string, s1l: string, s2v: string, s2l: string, wHead: string, wPara: string): ContentPatch[] {
  return [
    { match: "● ALL SYSTEMS NOMINAL", content: badge },
    { match: "The OS for\nmodern teams.", content: heading },
    { match: "Connect your entire stack, automate your workflows, and scale your business with the most advanced operating system ever built.", content: body },
    { match: "Start Trial", content: btn },
    { match: "99.99%", content: s1v },
    { match: "Uptime Guaranteed", content: s1l },
    { match: "<12ms", content: s2v },
    { match: "Global Latency", content: s2l },
    { match: "Trust by the Best", content: wHead },
    { match: "+ 2,400 companies", content: wPara },
  ];
}

function ph_gradientSplit(brand: string, lHead: string, lBody: string, c1: string, c2: string, c3: string, rHead: string, rBody: string, rBtn: string, rNote: string): ContentPatch[] {
  return [
    { match: "BUILDSTACK", content: brand },
    { match: "The platform that does everything.", content: lHead },
    { match: "Design, develop, and deploy modern websites — all from one beautiful interface.", content: lBody },
    { match: "No-code + full-code, your choice", content: c1 },
    { match: "AI-generated sections and copy", content: c2 },
    { match: "Deploy to global edge in one click", content: c3 },
    { match: "Loved by 24,000+ teams", content: "5-star rated by guests" },
    { match: "Start building in seconds.", content: rHead },
    { match: "Join 24,000 teams shipping faster with Webperia. Your first project is free — no credit card needed.", content: rBody },
    { match: "Get started", content: rBtn },
    { match: "Free forever on starter plan. Upgrade any time.", content: rNote },
  ];
}

function ph_dashboardPreview(badge: string, heading: string, body: string, btn1: string, btn2: string): ContentPatch[] {
  return [
    { match: "✦ NOW IN PUBLIC BETA", content: badge },
    { match: "Ship production\nsites in minutes,\nnot months.", content: heading },
    { match: "The visual site builder designed for engineers and designers who refuse to compromise on quality. Drag, customize, deploy — all from one platform.", content: body },
    { match: "Start building free →", content: btn1 },
    { match: "Watch demo", content: btn2 },
  ];
}

function ph_meridianEnterprise(badge: string, heading: string, body: string, btn1: string, btn2: string): ContentPatch[] {
  return [
    { match: "ENTERPRISE GRADE INFRASTRUCTURE", content: badge },
    { match: "The platform for\nglobal scale.", content: heading },
    { match: "Unify your team's workflow within a secure, high-performance environment designed for the most demanding global enterprises.", content: body },
    { match: "Contact Sales", content: btn1 },
    { match: "View Documentation", content: btn2 },
  ];
}

function ph_ecommerceHero(badge: string, heading: string, body: string, btn1: string, btn2: string): ContentPatch[] {
  return [
    { match: "New Season — Up to 40% off", content: badge },
    { match: "Dress for the life you want.", content: heading },
    { match: "Premium essentials designed for the modern wardrobe. Free shipping on all orders over $75.", content: body },
    { match: "Shop now →", content: btn1 },
    { match: "View lookbook", content: btn2 },
  ];
}

function ph_searchCentered(heading: string, placeholder: string, tag1: string, tag2: string, tag3: string): ContentPatch[] {
  return [
    { match: "How can we help you today?", content: heading },
    { match: "Search for components, themes, or guides...", content: placeholder },
    { match: "Installation", content: tag1 },
    { match: "Customization", content: tag2 },
    { match: "Components", content: tag3 },
  ];
}

function ph_fineDining(badge: string, heading: string, body: string, btn1 = "Reserve a Table", btn2 = "View Menu"): ContentPatch[] {
  return [
    { match: "EST. 2026", content: badge },
    { match: "Crafting digital\nmasterpieces.", content: heading },
    { match: "We partner with visionary brands to build digital experiences that define industries and captivate audiences globally.", content: body },
    { match: "Our Portfolio", content: btn1 },
    { match: "Contact Studio", content: btn2 },
  ];
}

function ph_luxuryHotel(badge: string, heading: string, body: string, btn1 = "Book a Suite", btn2 = "Explore Wellness"): ContentPatch[] {
  return [
    { match: "✦ PROTOCOL ACTIVE", content: badge },
    { match: "Engineering\nSentience.", content: heading },
    { match: "The next evolution of cloud infrastructure is here. Sub-millisecond latency, planetary scale, and absolute security by default.", content: body },
    { match: "Initialize System →", content: btn1 },
  ];
}

function ph_productDesigner(badge: string, heading: string, body: string, btn1 = "View Case Studies", btn2 = "Let's Talk"): ContentPatch[] {
  return [
    { match: "VERSION 5.0 LIVE", content: badge },
    { match: "THE FUTURE.\nUNFILTERED.", content: heading },
    { match: "The wait is over. Experience the most powerful engine ever built for the digital frontier. No limits. No compromises.", content: body },
    { match: "Join the Protocol", content: btn1 },
  ];
}

function ph_horology(badge: string, heading: string, body: string, btn1 = "Shop Collection", btn2 = "Our Heritage"): ContentPatch[] {
  return [
    { match: "✦ PROTOCOL ACTIVE", content: badge },
    { match: "Engineering\nSentience.", content: heading },
    { match: "The next evolution of cloud infrastructure is here. Sub-millisecond latency, planetary scale, and absolute security by default.", content: body },
    { match: "Initialize System →", content: btn1 },
  ];
}

function ph_cyberSecurity(badge: string, heading: string, body: string, btn1 = "Get Protected", btn2 = "View Threat Report"): ContentPatch[] {
  return [
    { match: "★  Rated #1 on Product Hunt 2026", content: badge },
    { match: "See it in action.", content: heading },
    { match: "Watch how teams go from idea to live site in under 10 minutes. No code. No compromise.", content: body },
  ];
}

// ─── Section block helper ─────────────────────────────────────────────────────

function blockEl(id: string, order: number, name?: string, overrides?: { props?: Record<string, unknown>; styles?: Record<string, unknown>; patches?: ContentPatch[] }): RawElement {
  const block = SECTION_BLOCKS.find((b) => b.id === id);
  if (!block) throw new Error(`Section block "${id}" not found`);
  let el: RawElement = {
    ...(block.element as unknown as RawElement),
    order,
    name: name ?? block.name,
    props: overrides?.props ? { ...(block.element.props || {}), ...overrides.props } : block.element.props,
    styles: overrides?.styles ? { ...(block.element.styles || {}), ...overrides.styles } : block.element.styles as Record<string, unknown>,
  };
  if (overrides?.patches?.length) el = applyPatches(el, overrides.patches);
  return el;
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
      blockEl("sb-hero-dashboard-preview",1, "Hero",           { props: { accentColor: "#6366F1" }, patches: ph_dashboardPreview("✦ AUTOMATE EVERYTHING", "Ship faster.\nMeasure better.\nGrow smarter.", "The all-in-one platform for fast-growing teams. Pulse connects your workflows, analytics, and collaboration in one place.", "Start free — no card needed →", "See how it works") }),
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
      blockEl("sb-hero-editorial",          1, "Hero",            { props: { accentColor: "#6366F1" }, patches: ph_editorial("PULSE FEATURES", "Every tool your\nteam actually needs.", "From automated workflows to real-time analytics — Pulse gives your team the edge to move faster and smarter.", "Explore all features", "Talk to sales") }),
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
      blockEl("sb-hero-editorial",          1, "Hero",        { props: { accentColor: "#6366F1" }, patches: ph_editorial("PULSE PRICING", "Simple plans.\nPowerful results.", "One flat rate, every feature included. Start free and scale confidently — no hidden fees, ever.", "View all plans", "Talk to sales") }),
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
      blockEl("sb-contact-split",        1, "Contact",  { props: { accentColor: "#6366F1" } }),
      blockEl("sb-footer-newsletter",    2, "Footer",   { props: { brandName: "Pulse" } }),
    ],
  },
];

// ─── 2. Orion — saas-orion · PRO ──────────────────────────────────────────────
const orionPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",         { props: { accentColor: "#3B82F6", brandName: "ORION.SHIELD" } }),
      blockEl("sb-hero-video-dark",       1, "Hero",           { props: { accentColor: "#3B82F6" }, patches: ph_cyberSecurity("★  ADVANCED THREAT PROTECTION", "AI-Driven\nSecurity.", "Real-time autonomous threat detection for modern infrastructure. Protect your assets with the power of predictive AI."), styles: { borderTop: "4px solid #3B82F6" } }),
      blockEl("sb-logos-dark",            2, "Trusted By"),
      blockEl("sb-saas-feature-wall",     3, "Security Layers",   { props: { accentColor: "#3B82F6" }, patches: [
        { match: "FEATURED CAPABILITIES", content: "DEFENSE LAYERS" },
        { match: "Global Scale", content: "Zero-Trust Mesh" },
        { match: "Enterprise Security", content: "Predictive AI" },
        { match: "Team Collaboration", content: "SOC Automation" }
      ]}),
      blockEl("sb-stats-dark-cards",      4, "Detection Rates", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-testimonials-dark-grid",5, "CISOs"),
      blockEl("sb-cta-dark",              6, "Protect Now",     { props: { accentColor: "#3B82F6", title: "Secure your infrastructure today" } }),
      blockEl("sb-footer-dark",           7, "Footer",         { props: { brandName: "ORION.SHIELD" } }),
    ],
  },
  {
    name: "Solutions", slug: "/solutions",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",         { props: { accentColor: "#3B82F6", brandName: "ORION.SHIELD" } }),
      blockEl("sb-hero-product",          1, "Threat Intel",   { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-dashboard-overview",    2, "Network Map",    { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-features-highlight-dark",3,"Infrastructure", { props: { accentColor: "#3B82F6" } }),
      blockEl("sb-footer-dark",           4, "Footer",         { props: { brandName: "ORION.SHIELD" } }),
    ],
  },
  {
    name: "Company", slug: "/company",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",    { props: { accentColor: "#3B82F6", brandName: "ORION.SHIELD" } }),
      blockEl("sb-hero-editorial",        1, "Hero",      { props: { accentColor: "#3B82F6" }, patches: [
        { match: "ABOUT ORION", content: "SECURITY FIRST" },
        { match: "Built by builders,\nfor builders.", content: "Guardian of\nDigital Assets." }
      ]}),
      blockEl("sb-team-dark-cards",       2, "Team"),
      blockEl("sb-footer-dark",           3, "Footer",    { props: { brandName: "ORION.SHIELD" } }),
    ],
  },
  {
    name: "Sign In", slug: "/sign-in",
    elements: [
      blockEl("sb-auth-split", 0, "Sign In", { props: { accentColor: "#3B82F6", brandName: "ORION.SHIELD" } }),
    ],
  },
  {
    name: "Sign Up", slug: "/sign-up",
    elements: [
      blockEl("sb-auth-minimal", 0, "Create Account", { props: { accentColor: "#3B82F6", brandName: "ORION.SHIELD" } }),
    ],
  },
];

// ─── 3. Vertex — saas-vertex · PRO ────────────────────────────────────────────
const vertexPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-split-panel",    0, "Navbar",       { props: { accentColor: "#10B981", brandName: "Vertex" } }),
      blockEl("sb-hero-gradient-split",   1, "Hero",         { props: { accentColor: "#10B981" }, patches: ph_gradientSplit("VERTEX", "The API platform\nthat scales with you.", "Ship developer tools, webhooks, and APIs at any scale. Connect everything. Deploy everywhere.", "Full REST + GraphQL API out of the box", "Auto-versioning and built-in rate limiting", "99.99% uptime SLA guaranteed", "Start shipping in minutes.", "Join 24,000 engineering teams using Vertex. First million API calls free — no credit card needed.", "Start for free", "Free up to 1M requests. Upgrade when you need more.") }),
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
      blockEl("sb-hero-editorial",         1, "Hero",       { props: { accentColor: "#10B981" }, patches: ph_editorial("VERTEX PRICING", "Pay for what\nyou actually use.", "Transparent, usage-based pricing for APIs and developer tools. Start free — upgrade when you need more.", "View all plans", "Get in touch") }),
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
      blockEl("sb-hero-editorial",         1, "Hero",          { props: { accentColor: "#10B981" }, patches: ph_editorial("500+ INTEGRATIONS", "Connect your\nentire stack.", "Native integrations with the tools your team already uses. Webhook support, SDKs, and open APIs.", "Browse integrations", "Request an integration") }),
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
      blockEl("sb-hero-glass",            1, "Hero",        { props: { accentColor: "#64748B" }, patches: ph_glass("💼 BUILT FOR B2B TEAMS", "Clarity drives\ngrowth.", "A focused, professional platform for growing B2B businesses. Everything your team needs — nothing you don't.", "Start free trial") }),
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
      blockEl("sb-hero-editorial",        1, "Hero",            { props: { accentColor: "#64748B" }, patches: ph_editorial("FLUX FEATURES", "Everything your\nteam needs.", "A complete feature set designed for professional B2B workflows. Built-in collaboration, reporting, and integrations.", "See all features", "Book a demo") }),
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
      blockEl("sb-hero-editorial",       1, "Hero",    { props: { accentColor: "#64748B" }, patches: ph_editorial("ABOUT FLUX", "Built for how\nbusinesses work.", "We believe great B2B software should be simple without being simplistic. Flux was built to reflect how modern teams actually operate.", "Our story", "Contact us") }),
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
      blockEl("sb-hero-studio",        1, "Hero",            { props: { accentColor: "#F97316" }, patches: ph_studio("Creative work\nthat actually works.", "Brand design, websites, and campaigns crafted for ambitious businesses ready to grow. We turn bold ideas into measurable results.", "See our work") }),
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
      blockEl("sb-hero-editorial",      1, "Hero",         { props: { accentColor: "#F97316" }, patches: ph_editorial("PRISM SERVICES", "Design that\ndrives results.", "Brand identity, web design, and campaigns crafted to convert attention into action. Services for every stage of growth.", "See all services", "Start a project") }),
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
      blockEl("sb-hero-editorial",    1, "Hero",        { props: { accentColor: "#F97316" }, patches: ph_editorial("SELECTED PROJECTS", "Work we're\nproud of.", "Client partnerships across branding, digital, and campaigns. Every project starts with a conversation.", "Browse all work", "Start a project", "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200") }),
      blockEl("sb-portfolio-editorial",2,"Projects"),
      blockEl("sb-cta-gradient",      3, "CTA",         { props: { accentColor: "#F97316" } }),
      blockEl("sb-footer-corporate",  4, "Footer",      { props: { brandName: "Prism" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-underline",      0, "Navbar",    { props: { accentColor: "#F97316", brandName: "Prism" } }),
      blockEl("sb-hero-editorial",        1, "Hero",      { props: { accentColor: "#F97316" }, patches: ph_editorial("OUR STUDIO", "People behind\nthe pixels.", "A tight-knit team of designers, strategists, and developers obsessed with making brands matter.", "Meet the team", "Get in touch") }),
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
      blockEl("sb-hero-editorial",    1, "Hero",     { props: { accentColor: "#F97316" }, patches: ph_editorial("LET'S TALK", "Ready to start\na project?", "Drop us a message and we'll be back within 24 hours. We'd love to hear about your project.", "Send a message", "See our work") }),
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
      blockEl("sb-hero-meridian-enterprise",1,"Hero",            { props: { accentColor: "#18181B" }, patches: ph_meridianEnterprise("FULL-SERVICE CORPORATE AGENCY", "The agency built\nfor enterprise.", "Strategy, branding, digital, and campaigns for the world's most demanding organisations. Atlas delivers where others don't.", "Start a brief", "View our work") }),
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
      blockEl("sb-hero-editorial",        1, "Hero",       { props: { accentColor: "#18181B" }, patches: ph_editorial("ATLAS SERVICES", "Enterprise services\nthat deliver.", "From brand strategy to full digital transformation — Atlas brings senior expertise to every engagement.", "Explore services", "Start a brief") }),
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
      blockEl("sb-hero-editorial",      1, "Hero",       { props: { accentColor: "#18181B" }, patches: ph_editorial("ATLAS WORK", "Case studies that\nspeak for themselves.", "Enterprise campaigns, brand overhauls, and digital transformations — browse our full body of client work.", "Browse all work", "Start a project", "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200") }),
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
      blockEl("sb-hero-editorial",          1, "Hero",        { props: { accentColor: "#18181B" }, patches: ph_editorial("ATLAS TEAM", "The people who\nmake it happen.", "Senior strategists, creatives, and engineers working together. Small enough to care, large enough to deliver.", "Meet the team", "Join Atlas") }),
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
      blockEl("sb-hero-bento",            1, "Hero",          { props: { accentColor: "#7C3AED" }, patches: ph_bento("STUDIO: OPEN FOR PROJECTS", "Art meets\nPrecision.", "We build dark, immersive digital experiences for brands that demand extraordinary. Boutique. Intentional. Unforgettable.", "Begin a project →", "12+", "Years of craft", "100%", "Client retention", "Award-Winning Studio", "Recognised for excellence in branding, film, and immersive digital experience design.") }),
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
      blockEl("sb-hero-editorial",     1, "Hero",    { props: { accentColor: "#7C3AED" }, patches: ph_editorial("CIPHER WORK", "Projects that\nleave a mark.", "Selected work across brand identity, motion design, and immersive digital experiences.", "View all projects", "Start a project", "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200") }),
      blockEl("sb-portfolio-editorial",2, "Projects"),
      blockEl("sb-cta-dark",           3, "CTA",     { props: { accentColor: "#7C3AED" } }),
      blockEl("sb-footer-dark",        4, "Footer",  { props: { brandName: "Cipher" } }),
    ],
  },
  {
    name: "Studio", slug: "/studio",
    elements: [
      blockEl("sb-navbar-dark",      0, "Navbar",  { props: { accentColor: "#7C3AED", brandName: "Cipher" } }),
      blockEl("sb-hero-editorial",   1, "Hero",    { props: { accentColor: "#7C3AED" }, patches: ph_editorial("THE STUDIO", "Where dark\ndesign lives.", "A boutique creative studio built for brands that refuse to be ordinary. Intentional. Immersive. Unforgettable.", "About us", "Begin a project") }),
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
      blockEl("sb-hero-editorial",       1, "Hero",     { props: { accentColor: "#7C3AED" }, patches: ph_editorial("CIPHER SERVICES", "Services built\nfor ambition.", "Branding, web, motion, and campaign design for brands ready to go further than their competitors.", "See services", "Begin a project") }),
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
      blockEl("sb-hero-industrial",   1, "Hero",           { props: { accentColor: "#EF4444" }, patches: ph_industrial("RESULTS\nNOT PROMISES.", "Performance marketing and growth strategy for brands ready to break through. Every campaign measured. Every dollar accountable.", "See Our Results ➚", "PAID MEDIA", "SEO & CONTENT", "CONVERSION RATE") }),
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
      blockEl("sb-hero-editorial",        1, "Hero",     { props: { accentColor: "#EF4444" }, patches: ph_editorial("SIGNAL SERVICES", "Growth services\nthat compound.", "Paid media, content, SEO, and CRO — all under one roof. We build the engine, you scale.", "See all services", "Get a quote") }),
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
      blockEl("sb-hero-editorial",     1, "Hero",           { props: { accentColor: "#EF4444" }, patches: ph_editorial("CLIENT RESULTS", "Numbers that\ntell the story.", "Real results from real clients across e-commerce, SaaS, and consumer brands. Measured. Verified. Repeatable.", "See case studies", "Work with us") }),
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
      blockEl("sb-hero-editorial",   1, "Hero",            { props: { accentColor: "#EF4444" }, patches: ph_editorial("ABOUT SIGNAL", "Obsessed with\nyour growth.", "A performance marketing agency built on accountability. We don't guess — we measure, optimise, and scale.", "Meet the team", "Get in touch") }),
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
      blockEl("sb-hero-playful",         1, "Hero",       { patches: ph_playful("🎨 DESIGN & ILLUSTRATION", "Work that speaks\nfor itself.", "A creative portfolio packed with bold design, illustration, and digital art. Available for freelance and full-time.", "See my work", "Let's collaborate") }),
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
      blockEl("sb-hero-editorial",    1, "Hero",       { patches: ph_editorial("SELECTED PROJECTS", "Projects worth\ntalking about.", "Brand identities, illustrations, web design, and campaigns. Take a look at what we've been building.", "Browse all work", "Get in touch", "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=1200") }),
      blockEl("sb-portfolio-editorial",2,"Projects"),
      blockEl("sb-footer-minimal",    3, "Footer",    { props: { brandName: "Canvas" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-creative",     0, "Navbar"),
      blockEl("sb-hero-editorial",      1, "Bio",         { patches: ph_editorial("ABOUT ME", "Designer.\nCreator.\nCollaborator.", "I've been making things people love for 7+ years — brand identities, illustrations, websites, and campaigns. Let's make something together.", "My work", "Say hello") }),
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
      blockEl("sb-hero-editorial",     1, "Hero",       { patches: ph_editorial("CREATIVE SERVICES", "Creative services\nfor brave brands.", "Brand identity, illustration, web design, and digital campaigns — tailored to your vision and budget.", "See services", "Get a quote") }),
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
    name: "Works", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-pill",         0, "Navbar",         { props: { accentColor: "#1E293B", brandName: "FOLIO / 26" } }),
      blockEl("sb-hero-feature-stack",  1, "Hero",           { props: { accentColor: "#1E293B" }, patches: ph_productDesigner("SENIOR PRODUCT DESIGNER", "Interfaces with\nPurpose.", "Specializing in complex systems, design operations, and user-centric product strategy for global SaaS leaders.", "Selected Works", "Get in touch") }),
      blockEl("sb-portfolio-dark-cards",2, "Selected Works", { props: { accentColor: "#1E293B" }, patches: [
        { match: "FEATURED PROJECTS", content: "CASE STUDIES" },
        { match: "Fintech App", content: "Solaris Design System" },
        { match: "Healthcare Platform", content: "Lumina Analytics" }
      ]}),
      blockEl("sb-features-dark-bento", 3, "Expertise",      { props: { accentColor: "#1E293B" }, patches: [
        { match: "FEATURED CAPABILITIES", content: "CORE EXPERTISE" },
        { match: "Global Scale", content: "Product Strategy" },
        { match: "Enterprise Security", content: "Design Systems" },
        { match: "Team Collaboration", content: "Prototyping" }
      ]}),
      blockEl("sb-logos",               4, "Trusted By"),
      blockEl("sb-cta-dark",            5, "CTA",            { props: { accentColor: "#1E293B", title: "Let's build something meaningful" } }),
      blockEl("sb-footer-dark",         6, "Footer",         { props: { brandName: "FOLIO / 26" } }),
    ],
  },
  {
    name: "About", slug: "/about",
    elements: [
      blockEl("sb-navbar-pill",       0, "Navbar",      { props: { accentColor: "#1E293B", brandName: "FOLIO / 26" } }),
      blockEl("sb-hero-editorial",    1, "Philosophy",  { props: { accentColor: "#1E293B" }, patches: [
        { match: "ALL PROJECTS", content: "PHILOSOPHY" },
        { match: "Every project,\nstory by story.", content: "Simplicity,\nThen Rigor." }
      ]}),
      blockEl("sb-content-steps-guide", 2, "The Process"),
      blockEl("sb-team-spotlight",      3, "The Designer"),
      blockEl("sb-footer-dark",         4, "Footer",      { props: { brandName: "FOLIO / 26" } }),
    ],
  },
  {
    name: "Contact", slug: "/contact",
    elements: [
      blockEl("sb-navbar-pill",          0, "Navbar",       { props: { accentColor: "#1E293B", brandName: "FOLIO / 26" } }),
      blockEl("sb-contact-split",        1, "Inquiry",      { props: { accentColor: "#1E293B" } }),
      blockEl("sb-footer-dark",          2, "Footer",       { props: { brandName: "FOLIO / 26" } }),
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
      blockEl("sb-hero-editorial",   1, "Hero",       { props: { accentColor: "#F59E0B" }, patches: ph_editorial("THE INK ARCHIVE", "All stories,\none place.", "Ideas, essays, and guides worth reading. Curated writing on design, culture, and the making of things.", "Browse articles", "Subscribe") }),
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
      blockEl("sb-navbar-centered-logo",     0, "Navbar",      { props: { accentColor: "#1E293B", brandName: "HOROLOGE" } }),
      blockEl("sb-hero-cinematic",           1, "Hero",        { props: { accentColor: "#1E293B" }, patches: ph_horology("THE HERITAGE COLLECTION", "Mechanical\nArtistry.", "Masterpieces of precision engineering and timeless design. Crafted for those who appreciate the finer details of time.", "View Collection", "The Craft") }),
      blockEl("sb-portfolio-bento",          2, "Collections", { props: { accentColor: "#1E293B" }, patches: [
        { match: "FEATURED WORK", content: "THE SERIES" },
        { match: "Design System", content: "Vanguard GMT" },
        { match: "Mobile App", content: "Chronos Limited" }
      ]}),
      blockEl("sb-features-alternating",     3, "Technical Excellence",   { props: { accentColor: "#1E293B" } }),
      blockEl("sb-testimonials-single-quote",4, "Press Quote"),
      blockEl("sb-footer-gradient",          5, "Footer",      { props: { brandName: "HOROLOGE" } }),
    ],
  },
  {
    name: "Collections", slug: "/collections",
    elements: [
      blockEl("sb-navbar-centered-logo",          0, "Navbar",    { props: { accentColor: "#1E293B", brandName: "HOROLOGE" } }),
      blockEl("sb-ecommerce-featured-products",   1, "The Archive"),
      blockEl("sb-footer-gradient",               2, "Footer",    { props: { brandName: "HOROLOGE" } }),
    ],
  },
  {
    name: "The Craft", slug: "/craft",
    elements: [
      blockEl("sb-navbar-centered-logo",  0, "Navbar",      { props: { accentColor: "#1E293B", brandName: "HOROLOGE" } }),
      blockEl("sb-hero-editorial",        1, "Our Legacy",  { props: { accentColor: "#1E293B" } }),
      blockEl("sb-features-alternating",  2, "Precision Engineering", { props: { accentColor: "#1E293B" } }),
      blockEl("sb-footer-gradient",       3, "Footer",      { props: { brandName: "HOROLOGE" } }),
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
      blockEl("sb-navbar-restaurant",   0, "Navbar",          { props: { accentColor: "#450A0A", brandName: "SAVOR" } }),
      blockEl("sb-hero-editorial",           1, "Hero",            { props: { accentColor: "#450A0A" }, patches: ph_fineDining("MICHELIN STARRED GASTRONOMY", "Artistry on\na Plate.", "Experience a symphony of flavours crafted with precision and passion. An immersive culinary journey in the heart of the city.", "Reserve a Table", "Explore Menu") }),
      blockEl("sb-services-card-grid",  2, "The Experience",  { props: { accentColor: "#450A0A" }, patches: [
        { match: "OUR SERVICES", content: "THE EXPERIENCE" },
        { match: "Brand Identity", content: "Tasting Menu" },
        { match: "We create unique and memorable brand identities that resonate with your audience.", content: "An 11-course journey through seasonal ingredients and avant-garde techniques." },
        { match: "Web Design", content: "Wine Pairing" },
        { match: "Our team designs beautiful and functional websites that are optimized for performance.", content: "Curated selections from our private cellar, spanning the world's finest regions." }
      ]}),
      blockEl("sb-portfolio-bento",    3, "The Gallery",     { props: { accentColor: "#450A0A" } }),
      blockEl("sb-logos-badges",        4, "Recognition"),
      blockEl("sb-testimonials-grid",   5, "Guest Notes"),
      blockEl("sb-cta-gradient",        6, "Reservation",     { props: { accentColor: "#450A0A", title: "Join us for an evening of excellence" } }),
      blockEl("sb-footer-gradient",     7, "Footer",          { props: { brandName: "SAVOR" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-restaurant",         0, "Navbar",      { props: { accentColor: "#450A0A", brandName: "SAVOR" } }),
      blockEl("sb-hero-editorial",            1, "Menu Header", { props: { accentColor: "#450A0A" }, patches: ph_editorial("THE AUTUMN MENU", "Seasonal\nMasterpieces.", "Our menus change with the seasons, honouring the finest local and imported ingredients at their absolute peak. All dietary requirements catered for.", "Download PDF Menu", "Reserve a Table") }),
      blockEl("sb-interactive-tabs-features", 2, "Menu Categories",  { props: { accentColor: "#450A0A" } }),
      blockEl("sb-features-cards",            3, "Signature Dishes", { props: { accentColor: "#450A0A" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "CHEF'S SIGNATURES" },
        { match: "Built for the next generation of web applications.", content: "Dishes that define who we are — available every service as a constant in a menu that evolves." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Each signature is the result of months of development, sourcing, and refinement before it ever reaches the pass." },
        { match: "Lightning Performance", content: "Aged Duck Magret" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Slow-rendered for 48 hours, finished over charcoal. Served with cherry jus, celeriac purée, and pickled walnut." },
        { match: "Military-Grade Security", content: "Hand-Dived Scallops" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Day-boat scallops with cauliflower velouté, crispy capers, and a brown butter emulsion." },
        { match: "Seamless Integration", content: "Dark Chocolate Sphere" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "A showpiece dessert — dark Valrhona chocolate with salted caramel, passion fruit, and hazelnut praline." },
      ]}),
      blockEl("sb-content-feature-list",      4, "Dietary & Allergens"),
      blockEl("sb-cta-gradient",              5, "Reserve Now", { props: { accentColor: "#450A0A" } }),
      blockEl("sb-footer-gradient",           6, "Footer",      { props: { brandName: "SAVOR" } }),
    ],
  },
  {
    name: "The Chef", slug: "/chef",
    elements: [
      blockEl("sb-navbar-restaurant",     0, "Navbar",        { props: { accentColor: "#450A0A", brandName: "SAVOR" } }),
      blockEl("sb-team-spotlight",        1, "Executive Chef"),
      blockEl("sb-features-alternating",  2, "Our Philosophy", { props: { accentColor: "#450A0A" }, patches: [
        { match: "Universal\nCollaboration.", content: "Produce drives\nevery decision." },
        { match: "Break down the barriers between teams and departments. Our platform provides a single source of truth for your entire organization.", content: "Every week we visit our growers, fishers, and foragers in person. The relationship with our suppliers is the foundation of everything we cook." },
        { match: "READ THE MANIFESTO", content: "OUR SUPPLIERS" },
        { match: "Intelligence\nby Design.", content: "Technique in\nservice of taste." },
        { match: "Make informed decisions with data that updates in real-time. We don't just show you what's happening, we show you why.", content: "Classical training meets fearless creativity. We respect tradition but are never bound by it — always asking what this dish can become." },
        { match: "VIEW CAPABILITIES", content: "THE TASTING MENU" },
      ]}),
      blockEl("sb-logos-badges",          3, "Awards"),
      blockEl("sb-footer-gradient",       4, "Footer",        { props: { brandName: "SAVOR" } }),
    ],
  },
  {
    name: "Reservations", slug: "/reservations",
    elements: [
      blockEl("sb-navbar-restaurant",0, "Navbar",      { props: { accentColor: "#450A0A", brandName: "SAVOR" } }),
      blockEl("sb-contact-split",    1, "Booking",     { props: { accentColor: "#450A0A" } }),
      blockEl("sb-contact-map",      2, "Location",    { props: { accentColor: "#450A0A" } }),
      blockEl("sb-footer-gradient",   3, "Footer",      { props: { brandName: "SAVOR" } }),
    ],
  },
];

// ─── 20. Brew — restaurant-brew · FREE ────────────────────────────────────────
const brewPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",          0, "Navbar",       { props: { brandName: "BREW & CO" } }),
      blockEl("sb-hero-organic",            1, "Hero",         { patches: ph_organic("Small Batch.\nBig Soul.", "Artisan coffee roasted in-house daily. We work directly with ethical farms and believe every cup should tell the story of where it came from.", "Shop the Roast") }),
      blockEl("sb-features-cards",          2, "Origins",      { props: { accentColor: "#92400E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "THIS WEEK'S ORIGINS" },
        { match: "Built for the next generation of web applications.", content: "Single-origin coffees roasted fresh each morning. Traceable, seasonal, and extraordinary." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "We work directly with farmers in Ethiopia, Colombia, and Sumatra to source the finest micro-lot coffees available." },
        { match: "Lightning Performance", content: "Ethiopia Yirgacheffe" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Bright, floral, and complex. Notes of jasmine, stone fruit, and a clean citrus finish. Light roast." },
        { match: "Military-Grade Security", content: "Colombia Huila" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Balanced and smooth with notes of caramel, hazelnut, and dark chocolate. A timeless classic." },
        { match: "Seamless Integration", content: "Sumatra Mandheling" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Full-bodied and earthy with a velvety texture. Low acidity, long finish, and deeply satisfying." },
      ]}),
      blockEl("sb-testimonials-single-quote",3,"Guest Review"),
      blockEl("sb-cta-split",               4, "The Roastery",  { props: { accentColor: "#92400E" } }),
      blockEl("sb-footer-minimal",          5, "Footer",        { props: { brandName: "BREW & CO" } }),
    ],
  },
  {
    name: "The Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-minimal",            0, "Navbar",          { props: { brandName: "BREW & CO" } }),
      blockEl("sb-interactive-tabs-features", 1, "Barista Selection",{ props: { accentColor: "#92400E" } }),
      blockEl("sb-features-cards",            2, "Food & Pastries", { props: { accentColor: "#92400E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "MADE IN-HOUSE DAILY" },
        { match: "Built for the next generation of web applications.", content: "Our kitchen bakes fresh every morning. Croissants, sourdough, seasonal tarts, and more." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "All pastries and bread made from scratch using organic flour, free-range eggs, and local dairy." },
        { match: "Lightning Performance", content: "Seasonal Croissants" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Buttery, flaky, and filled with seasonal fruit compote or our daily special cream." },
        { match: "Military-Grade Security", content: "Sourdough Toasts" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "House-baked sourdough with cultured butter, smashed avocado, or smoked salmon." },
        { match: "Seamless Integration", content: "Granola & Yoghurt" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Housemade granola with seasonal fruit, organic yoghurt, and a drizzle of local honey." },
      ]}),
      blockEl("sb-footer-minimal",            3, "Footer",          { props: { brandName: "BREW & CO" } }),
    ],
  },
  {
    name: "Our Story", slug: "/our-story",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-features-alternating", 1, "Ethical Sourcing", { props: { accentColor: "#92400E" }, patches: [
        { match: "Universal\nCollaboration.", content: "Sourced from\nthe source." },
        { match: "Break down the barriers between teams and departments. Our platform provides a single source of truth for your entire organization.", content: "We visit every farm we work with. Our relationships with growers in Ethiopia, Colombia, and Sumatra are built on trust, transparency, and fair prices — always above the market rate." },
        { match: "READ THE MANIFESTO", content: "OUR SOURCING PLEDGE" },
        { match: "Intelligence\nby Design.", content: "Roasted with\nprecision." },
        { match: "Make informed decisions with data that updates in real-time. We don't just show you what's happening, we show you why.", content: "Every batch is roasted to order in our in-house roastery. We roast light, letting the origin shine rather than the profile. Each roast is logged, tasted, and adjusted to the gram." },
        { match: "VIEW CAPABILITIES", content: "SHOP COFFEE BEANS" },
      ]}),
      blockEl("sb-features-alternating", 2, "The Craft", { props: { accentColor: "#92400E" }, patches: [
        { match: "Universal\nCollaboration.", content: "The art of\nthe pour." },
        { match: "Break down the barriers between teams and departments. Our platform provides a single source of truth for your entire organization.", content: "Our baristas train for months before serving a guest. Every extraction is calibrated, every pour deliberate. We believe great coffee is worth taking seriously — and tasting seriously." },
        { match: "READ THE MANIFESTO", content: "BARISTA TRAINING" },
        { match: "Intelligence\nby Design.", content: "Community\nat heart." },
        { match: "Make informed decisions with data that updates in real-time. We don't just show you what's happening, we show you why.", content: "Brew & Co started as a coffee cart outside the community garden in 2017. The neighbourhood made us who we are, and we try to give back every single day." },
        { match: "VIEW CAPABILITIES", content: "OUR FULL STORY" },
      ]}),
      blockEl("sb-footer-minimal",       3, "Footer", { props: { brandName: "BREW & CO" } }),
    ],
  },
  {
    name: "Visit", slug: "/visit",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-contact-map",          1, "The Lab"),
      blockEl("sb-content-feature-list", 2, "Roasting Hours"),
      blockEl("sb-footer-minimal",       3, "Footer", { props: { brandName: "BREW & CO" } }),
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
      blockEl("sb-hero-meridian-enterprise",1, "Hero",         { props: { accentColor: "#3B82F6" }, patches: [
        { match: "TRUSTED BY 500+ GLOBAL ENTERPRISES", content: "INVESTING IN THE FUTURE OF TECHNOLOGY" },
        { match: "Scale your business\nwith confidence.", content: "Backing the next\nglobal giants." },
        { match: "The world's most secure and scalable platform for building modern web experiences. We handle the infrastructure so you can focus on growth.", content: "A global venture capital firm partnering with visionary founders to build category-defining companies from seed to scale." },
      ], styles: { backgroundImage: "linear-gradient(135deg, #020617 0%, #0F172A 100%)" } }),
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
      blockEl("sb-navbar-restaurant",      0, "Navbar",           { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-cinematic",         1, "Hero",             { props: { accentColor: "#C2410C" }, patches: ph_cinematic("✦ OPEN NIGHTLY FROM 5PM", "Where Fire\nMeets Flavour.", "Hand-crafted dishes cooked over our signature open flame. Locally sourced, seasonally inspired, and worth every minute of the wait.", "Reserve Your Table →") }),
      blockEl("sb-content-magazine-split", 2, "Story",            { props: { accentColor: "#C2410C" }, patches: [
        { match: "FEATURE STORY", content: "THE EMBER STORY" },
        { match: "The renaissance of thoughtful design in a noisy world.", content: "Born from the belief that great food starts with great fire." },
        { match: "by Marcus Webb", content: "by Marco Rossi, Head Chef" },
        { match: "April 15, 2026 · 8 min read", content: "Est. 2018 · Wood-fired kitchen" },
        { match: "In a world saturated with digital noise, the designers who cut through are those who embrace constraints as a creative tool. Reduction is not limitation - it is the highest form of craft.", content: "We opened Ember in 2018 with a wood-fired oven, a handful of recipes, and a belief that cooking with fire is the oldest and most honest form of craft. Nothing has changed." },
        { match: "The best interfaces are invisible. They guide without demanding attention, inform without overwhelming, and delight without distraction. That is the standard we hold ourselves to.", content: "Every ingredient on our menu has a story. We work with the same farms, fishers, and foragers season after season, building the relationships that make the food better." },
        { match: "Continue reading →", content: "Our full story →" },
      ]}),
      blockEl("sb-features-bold-grid",     3, "Signature Dishes", { props: { accentColor: "#C2410C" } }),
      blockEl("sb-logos-badges",           4, "Press"),
      blockEl("sb-portfolio-bento",        5, "Gallery"),
      blockEl("sb-testimonials-large",     6, "Reviews"),
      blockEl("sb-cta-gradient",           7, "Reserve",          { props: { accentColor: "#C2410C", title: "Reserve Your Evening" } }),
      blockEl("sb-footer-gradient",        8, "Footer",           { props: { brandName: "Ember" } }),
    ],
  },
  {
    name: "Menu", slug: "/menu",
    elements: [
      blockEl("sb-navbar-restaurant",        0, "Navbar",      { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-editorial-classic",   1, "Menu Header", { props: { accentColor: "#C2410C" }, patches: ph_editorialClassic("THE EMBER MENU", "Smoke, fire,\nand flavour.", "Every dish begins over live fire. Our menu celebrates bold flavours, seasonal produce, and the ancient art of cooking with flame. Updated weekly.", "Browse the Dishes") }),
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
      blockEl("sb-navbar-restaurant",      0, "Navbar",      { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-studio",            1, "Chef Hero",   { props: { accentColor: "#C2410C" }, patches: ph_studio("THE PASSION\nBEHIND THE FLAME.", "Head Chef Marco Rossi and his kitchen team have spent a lifetime mastering the art of fire and flavour. Every plate tells a story of craft and dedication.", "Meet the Full Team") }),
      blockEl("sb-content-magazine-split", 2, "Philosophy",  { props: { accentColor: "#C2410C" }, patches: [
        { match: "FEATURE STORY", content: "OUR PHILOSOPHY" },
        { match: "The renaissance of thoughtful design in a noisy world.", content: "The fire is the chef. We just guide it." },
        { match: "by Marcus Webb", content: "by Marco Rossi" },
        { match: "April 15, 2026 · 8 min read", content: "Head Chef & Founder" },
        { match: "In a world saturated with digital noise, the designers who cut through are those who embrace constraints as a creative tool. Reduction is not limitation - it is the highest form of craft.", content: "Open fire is not a technique — it is a philosophy. When you cook with flame, you surrender control and learn to listen. The ingredients tell you when they are ready." },
        { match: "The best interfaces are invisible. They guide without demanding attention, inform without overwhelming, and delight without distraction. That is the standard we hold ourselves to.", content: "We source every ingredient within 80 miles. Not because it is fashionable, but because the food genuinely tastes better when it travels less. Freshness is the first seasoning." },
        { match: "Continue reading →", content: "Read more →" },
      ]}),
      blockEl("sb-logos-badges",           3, "Awards"),
      blockEl("sb-team-spotlight",         4, "Team"),
      blockEl("sb-cta-simple",             5, "Reserve",     { props: { accentColor: "#C2410C" } }),
      blockEl("sb-footer-gradient",        6, "Footer",      { props: { brandName: "Ember" } }),
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
      blockEl("sb-cta-banner",         4, "Gift Vouchers", { props: { accentColor: "#C2410C" } }),
      blockEl("sb-footer-gradient",    5, "Footer",        { props: { brandName: "Ember" } }),
    ],
  },
  {
    name: "Private Dining", slug: "/private-dining",
    elements: [
      blockEl("sb-navbar-restaurant",   0, "Navbar",        { props: { accentColor: "#C2410C", brandName: "Ember" } }),
      blockEl("sb-hero-bento",          1, "Private Rooms", { props: { accentColor: "#C2410C" }, patches: ph_bento("✦ PRIVATE DINING & EVENTS", "Your evening,\nyour way.", "Create an unforgettable event in our exclusive private dining spaces. Bespoke menus, curated wines, and flawless service for every occasion.", "Enquire Now", "Up to", "30 guests", "Min. notice", "48 hours", "Fully Private Space", "Dedicated team, bespoke menu design, and optional wine pairing from our sommelier.") }),
      blockEl("sb-features-cards",      2, "Event Types",   { props: { accentColor: "#C2410C" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "OCCASIONS WE LOVE" },
        { match: "Built for the next generation of web applications.", content: "Whether an intimate dinner or a celebration for thirty, our private dining team handles every last detail." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Every private event is designed from scratch around you — the menu, the drinks, the atmosphere, all tailored to the occasion." },
        { match: "Lightning Performance", content: "Corporate Dinners" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Impress clients and reward your team with a memorable evening around the open fire kitchen." },
        { match: "Military-Grade Security", content: "Celebrations & Parties" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Birthdays, anniversaries, engagements — let us host your most important moments with the care they deserve." },
        { match: "Seamless Integration", content: "Private Tastings" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "A guided journey through our seasonal menu with paired wines from our hand-picked cellar selection." },
      ]}),
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
      blockEl("sb-hero-editorial-classic", 1, "Hero",       { props: { accentColor: "#78716C" }, patches: ph_editorialClassic("GROVE CAFÉ • OPEN DAILY 7AM–5PM", "Good food,\ngrown near here.", "Fresh, seasonal dishes made from locally sourced produce. We work with farmers we know by name and cook food worth sharing.", "Explore the Menu") }),
      blockEl("sb-features-cards",         2, "Seasonal",   { props: { accentColor: "#78716C" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "ON THE MENU TODAY" },
        { match: "Built for the next generation of web applications.", content: "What's fresh, seasonal, and worth getting out of bed for." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "We update our menu daily based on what our farmers bring us each morning. Breakfast through late lunch, seven days a week." },
        { match: "Lightning Performance", content: "Weekend Brunch" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Sourdough stacks, smashed avo, soft eggs, and the best flat white you'll find on the high street." },
        { match: "Military-Grade Security", content: "All-day Bowls" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Wholesome grain bowls, seasonal salads, and warming soups — all made in-house from scratch every morning." },
        { match: "Seamless Integration", content: "Drinks & Bakes" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Single-origin espresso, housemade lemonade, and daily-baked pastries from our kitchen bench." },
      ]}),
      blockEl("sb-stats-light",            3, "By the Numbers"),
      blockEl("sb-content-magazine-split", 4, "Our Story",  { props: { accentColor: "#78716C" }, patches: [
        { match: "FEATURE STORY", content: "THE GROVE STORY" },
        { match: "The renaissance of thoughtful design in a noisy world.", content: "A café that started as a corner stall and became the heart of a neighbourhood." },
        { match: "by Marcus Webb", content: "by Sarah Chen, Founder" },
        { match: "April 15, 2026 · 8 min read", content: "Est. 2019 · Locally rooted" },
        { match: "In a world saturated with digital noise, the designers who cut through are those who embrace constraints as a creative tool. Reduction is not limitation - it is the highest form of craft.", content: "Grove started with a single fold-out table, a hand-grinder, and a dream to do one thing well. Sarah Chen opened the doors in 2019 with no menu board — just whatever was fresh that week." },
        { match: "The best interfaces are invisible. They guide without demanding attention, inform without overwhelming, and delight without distraction. That is the standard we hold ourselves to.", content: "Five years on, Grove has grown into a full café and community kitchen — but the ethos hasn't changed. Every ingredient is local, every dish is made to order, and the coffee is always exceptional." },
        { match: "Continue reading →", content: "Read our story →" },
      ]}),
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
      blockEl("sb-hero-glass",               1, "Today's Menu",  { props: { accentColor: "#78716C" }, patches: ph_glass("🌿 FRESH TODAY", "Food worth\ntalking about.", "Seasonal, locally sourced, and made fresh every morning. Our menu changes with what's available — so every visit brings something new.", "See Today's Menu") }),
      blockEl("sb-interactive-tabs-features",2, "Menu Sections", { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-cards",           3, "Items",         { props: { accentColor: "#78716C" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "THIS WEEK'S FAVOURITES" },
        { match: "Built for the next generation of web applications.", content: "Our most-ordered dishes right now." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "From sunrise to afternoon close, these are the dishes our regulars keep coming back for." },
        { match: "Lightning Performance", content: "Mushroom & Truffle Toast" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Wild mushrooms, truffle oil, soft herbs on toasted sourdough. A Grove staple since day one." },
        { match: "Military-Grade Security", content: "Seasonal Grain Bowl" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Roasted autumn vegetables, ancient grains, tahini dressing, and a soft poached egg." },
        { match: "Seamless Integration", content: "Filter Coffee & Pastry" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Our house-roasted filter with a fresh-baked croissant or muffin from the morning batch." },
      ]}),
      blockEl("sb-content-feature-list",     4, "Allergen Key"),
      blockEl("sb-cta-minimal-center",       5, "Order Online",  { props: { accentColor: "#78716C" } }),
      blockEl("sb-footer-minimal",           6, "Footer",        { props: { brandName: "Grove" } }),
    ],
  },
  {
    name: "Our Story", slug: "/our-story",
    elements: [
      blockEl("sb-navbar-minimal",          0, "Navbar"),
      blockEl("sb-hero-editorial-classic",  1, "Founder Story",  { props: { accentColor: "#78716C" }, patches: ph_editorialClassic("OUR ROOTS", "Built on community,\ngrown with love.", "Grove was born from a simple belief — that a neighbourhood café should be a gathering place, not just a coffee stop. We've been part of this community since 2019.", "Meet the Team") }),
      blockEl("sb-features-alternating-rows",2,"Sourcing",       { props: { accentColor: "#78716C" }, patches: [
        { match: "HOW IT WORKS", content: "HOW WE SOURCE" },
        { match: "One platform.\nEverything you need.", content: "From farm\nto your table." },
        { match: "Visual editor that thinks like a developer", content: "We know every farm by name" },
        { match: "Drag, drop, and customize every element visually. Your changes are reflected in clean, production-ready code automatically.", content: "Every ingredient on our menu comes from within 50 miles. We visit our producers, understand their methods, and build lasting relationships rooted in quality and trust." },
        { match: "✓  Real-time collaborative editing", content: "✓  Weekly farm deliveries" },
        { match: "✓  Component library & design tokens", content: "✓  Zero food waste policy" },
        { match: "✓  Responsive preview for all devices", content: "✓  Seasonal menu rotations" },
        { match: "One-click deploy to any cloud", content: "Sustainability in everything we do" },
        { match: "Connect your custom domain, configure your environment, and go live globally in under 60 seconds.", content: "Compostable packaging, carbon-neutral delivery, and kitchen scraps turned into compost for our growers. Doing better isn't hard — it just takes care." },
        { match: "✓  Git-based deployment workflow", content: "✓  Compostable packaging" },
        { match: "✓  Instant rollback to any version", content: "✓  Carbon-neutral supplier chain" },
        { match: "✓  170+ global edge locations", content: "✓  Kitchen-to-compost programme" },
      ]}),
      blockEl("sb-features-cards",          3, "Community",      { props: { accentColor: "#78716C" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "COMMUNITY ROOTS" },
        { match: "Built for the next generation of web applications.", content: "We're more than a café." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Grove is a space for the community to gather, create, and connect. Here's how we give back." },
        { match: "Lightning Performance", content: "Local Farmers Market" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Every Saturday morning we host a pop-up market with our favourite local producers right outside the door." },
        { match: "Military-Grade Security", content: "Community Table" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "One large shared table, no bookings, open to everyone. A space to work, read, or just sit with a good coffee." },
        { match: "Seamless Integration", content: "Pay It Forward" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Buy a coffee or meal for a neighbour who needs it. Our wall board tracks every one waiting to be claimed." },
      ]}),
      blockEl("sb-team-minimal-list",       4, "The Team"),
      blockEl("sb-footer-minimal",          5, "Footer",         { props: { brandName: "Grove" } }),
    ],
  },
  {
    name: "Events", slug: "/events",
    elements: [
      blockEl("sb-navbar-minimal",     0, "Navbar"),
      blockEl("sb-hero-playful",       1, "What's On",    { props: { accentColor: "#78716C" }, patches: ph_playful("🌿 THIS WEEK AT GROVE", "Something's\nalways on.", "Morning yoga, evening markets, live music, and community workshops. Grove is more than a café — come see what's happening this week.", "See All Events", "Private Hire") }),
      blockEl("sb-features-steps",     2, "Upcoming",     { props: { accentColor: "#78716C" } }),
      blockEl("sb-features-cards",     3, "Private Hire", { props: { accentColor: "#78716C" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "HIRE THE SPACE" },
        { match: "Built for the next generation of web applications.", content: "Grove is yours to hire." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Whether it's a birthday breakfast, a team away-day, or an evening pop-up, our space is available for private hire seven days a week." },
        { match: "Lightning Performance", content: "Morning Buyouts" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Book the whole café before opening hours for a team breakfast, product launch, or private workshop session." },
        { match: "Military-Grade Security", content: "Evening Events" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Transform Grove into an intimate evening venue — drinks, canapes, and a bespoke menu for up to 60 guests." },
        { match: "Seamless Integration", content: "Pop-up Partnerships" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Partner with us to run a one-night pop-up concept — we provide the space, kitchen, and front-of-house team." },
      ]}),
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
      blockEl("sb-hero-video-dark",      1, "Hero",        { props: { accentColor: "#C9A84C" }, patches: ph_videoDark("★  MICHELIN STARRED 2024 & 2025", "Fine dining\nreborn.", "Step inside a world where flavour, theatre, and artistry converge. Lumière offers an evening unlike any other in the city.") }),
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
      blockEl("sb-navbar-dark",           0, "Navbar",     { props: { accentColor: "#C9A84C", brandName: "Lumière" } }),
      blockEl("sb-hero-abstract-ambient", 1, "Chef",       { props: { accentColor: "#C9A84C" }, patches: ph_abstractAmbient("Chef Laurent Moreau.", "Twenty years in the finest kitchens of Paris and Tokyo, and a singular vision — that every plate should move you. Lumière is his life's work.", "Meet the Team →") }),
      blockEl("sb-content-magazine-split",2, "Chef Story", { props: { accentColor: "#C9A84C" }, patches: [
        { match: "FEATURE STORY", content: "CHEF'S STORY" },
        { match: "The renaissance of thoughtful design in a noisy world.", content: "A life spent chasing perfection on the plate." },
        { match: "by Marcus Webb", content: "by Laurent Moreau" },
        { match: "April 15, 2026 · 8 min read", content: "Head Chef & Owner" },
        { match: "In a world saturated with digital noise, the designers who cut through are those who embrace constraints as a creative tool. Reduction is not limitation - it is the highest form of craft.", content: "I learned to cook in Lyon, trained in Paris, and found my philosophy in Tokyo. The Japanese taught me that restraint is not poverty — it is generosity of the highest kind." },
        { match: "The best interfaces are invisible. They guide without demanding attention, inform without overwhelming, and delight without distraction. That is the standard we hold ourselves to.", content: "Lumière exists to prove that fine dining can be emotional, not just excellent. Every element on the plate — the flavour, the temperature, the texture — is designed to create a memory." },
        { match: "Continue reading →", content: "Read more →" },
      ]}),
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
      blockEl("sb-hero-bento",          1, "Private Room",   { props: { accentColor: "#C9A84C" }, patches: ph_bento("✦ PRIVATE DINING AT LUMIÈRE", "Your night,\ncurated.", "Host an event that will never be forgotten. Our private dining room accommodates up to twenty guests for a fully bespoke tasting experience.", "Enquire Now", "Up to", "20 guests", "Min. notice", "2 weeks", "Fully Private Experience", "Bespoke menu, paired wines, and exclusive access to Chef Moreau's private cellar.") }),
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
      blockEl("sb-hero-gradient-split",  1, "Hero",          { props: { accentColor: "#0F766E" }, patches: ph_gradientSplit("HAVEN", "Your sanctuary\nawaits.", "A boutique coastal retreat where thoughtful hospitality meets natural beauty. Every room is designed for rest, every meal is made with care.", "Breakfast included daily", "Free cancellation policy", "Private beach access", "Check availability.", "Book direct for our best rates — no booking fees, flexible cancellation, and a complimentary welcome gift on arrival.", "Check Availability", "Best rate guaranteed when you book direct.") }),
      blockEl("sb-stats-light",          2, "Property Stats"),
      blockEl("sb-features-cards",       3, "Room Previews", { props: { accentColor: "#0F766E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "OUR ROOMS" },
        { match: "Built for the next generation of web applications.", content: "Every room is a retreat in itself." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "From ocean-view suites to cosy garden rooms, each space has been designed with comfort, calm, and character in mind." },
        { match: "Lightning Performance", content: "Ocean Suite" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Floor-to-ceiling windows, private balcony, king bed and soaking tub with uninterrupted sea views." },
        { match: "Military-Grade Security", content: "Coastal Deluxe" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Generous queen room with natural timber, soft linen, and a private terrace steps from the beach path." },
        { match: "Seamless Integration", content: "Garden Room" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Quiet and light-filled with direct garden access, perfect for families or guests wanting extra space and privacy." },
      ]}),
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
      blockEl("sb-features-alternating-rows",2,"Room Detail",{ props: { accentColor: "#0F766E" }, patches: [
        { match: "HOW IT WORKS", content: "ROOM DETAILS" },
        { match: "One platform.\nEverything you need.", content: "Designed for\ndeep rest." },
        { match: "Visual editor that thinks like a developer", content: "Ocean Suites — wake up to the sea" },
        { match: "Drag, drop, and customize every element visually. Your changes are reflected in clean, production-ready code automatically.", content: "Each Ocean Suite features a king bed dressed in natural linen, a freestanding soaking tub, and a private balcony facing the water. Available on floors two and three." },
        { match: "✓  Real-time collaborative editing", content: "✓  Floor-to-ceiling sea-facing windows" },
        { match: "✓  Component library & design tokens", content: "✓  Private balcony with day beds" },
        { match: "✓  Responsive preview for all devices", content: "✓  Nespresso, minibar & welcome hamper" },
        { match: "One-click deploy to any cloud", content: "Garden Rooms — your own private hideaway" },
        { match: "Connect your custom domain, configure your environment, and go live globally in under 60 seconds.", content: "Ground-floor rooms with direct garden access and a private terrace. Ideal for families and guests travelling with pets. All rooms include a king or twin configuration." },
        { match: "✓  Git-based deployment workflow", content: "✓  Direct garden & pool access" },
        { match: "✓  Instant rollback to any version", content: "✓  Pet-friendly on request" },
        { match: "✓  170+ global edge locations", content: "✓  Roll-away bed available" },
      ]}),
      blockEl("sb-features-checklist",   3, "All Amenities"),
      blockEl("sb-cta-simple",           4, "Book Now",    { props: { accentColor: "#0F766E" } }),
      blockEl("sb-footer-newsletter",    5, "Footer",      { props: { brandName: "Haven" } }),
    ],
  },
  {
    name: "Facilities", slug: "/facilities",
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",        { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-services-card-grid",   1, "Facilities",    { props: { accentColor: "#0F766E" }, patches: [
        { match: "What We Offer", content: "Hotel Facilities" },
        { match: "Services built for growth", content: "Everything you need, all in one place." },
        { match: "From strategy to execution, we handle every aspect of your digital transformation.", content: "From the spa and pool to our private beach and restaurant, Haven is designed so you never need to leave — unless you want to." },
        { match: "UI/UX Design", content: "Infinity Pool & Spa" },
        { match: "Pixel-perfect interfaces that convert visitors into customers.", content: "A heated infinity pool overlooking the ocean, plus a six-treatment spa with sauna, steam room, and full body menu." },
        { match: "Development", content: "Private Beach" },
        { match: "Scalable full-stack apps built with the latest technologies.", content: "Direct access to a quiet stretch of coast reserved for Haven guests. Sun loungers, towels, and beach bar service included." },
        { match: "Growth Marketing", content: "Waterfront Restaurant" },
        { match: "Data-driven strategies that accelerate your acquisition.", content: "Fresh seafood, local produce, and an all-day menu served from breakfast to late evening beside the water." },
      ]}),
      blockEl("sb-features-bold-grid",   2, "Family",        { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-checklist",   3, "Business"),
      blockEl("sb-footer-newsletter",    4, "Footer",        { props: { brandName: "Haven" } }),
    ],
  },
  {
    name: "Dining", slug: "/dining",
    elements: [
      blockEl("sb-navbar-transparent",   0, "Navbar",   { props: { accentColor: "#0F766E", brandName: "Haven" } }),
      blockEl("sb-hero-cinematic",       1, "Dining",   { props: { accentColor: "#0F766E" }, patches: ph_cinematic("🌊 OCEANFRONT DINING", "Food as good\nas the view.", "Freshly caught seafood, locally grown produce, and a menu that changes with the seasons. Breakfast through dinner, every day.", "Make a Reservation →") }),
      blockEl("sb-services-alternating", 2, "Venues",   { props: { accentColor: "#0F766E" } }),
      blockEl("sb-features-cards",       3, "Menus",    { props: { accentColor: "#0F766E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "OUR MENUS" },
        { match: "Built for the next generation of web applications.", content: "Something delicious at every hour." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Our kitchen is open from early morning to late evening with menus that make the most of the local catch and season." },
        { match: "Lightning Performance", content: "Sunrise Breakfast" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Served 7–10:30am daily. Hot dishes, cold buffet, fresh-pressed juices, and pour-over coffee from our local roaster." },
        { match: "Military-Grade Security", content: "Seafood Lunch" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Grilled whole fish, shellfish platters, and cold lobster rolls served poolside or at your beachfront table." },
        { match: "Seamless Integration", content: "Evening à la Carte" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "A full dinner service from 6pm featuring the best of the local catch, seasonal vegetables, and a carefully chosen cellar." },
      ]}),
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
      blockEl("sb-features-cards",       3, "Things to Do", { props: { accentColor: "#0F766E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "EXPLORE THE AREA" },
        { match: "Built for the next generation of web applications.", content: "The best of the coastline on your doorstep." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Haven sits at the heart of a stretch of coast that's been undiscovered by mass tourism. Here's what to do nearby." },
        { match: "Lightning Performance", content: "Coastal Walks" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Miles of cliff-top paths and hidden coves right from our front door. We'll pack you a picnic for the day." },
        { match: "Military-Grade Security", content: "Water Sports" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Kayaking, paddleboarding, and sailing hire all available through our concierge. Equipment on the beach from 8am." },
        { match: "Seamless Integration", content: "Local Villages" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Three charming fishing villages within 15 minutes, each with their own markets, galleries, and independent restaurants." },
      ]}),
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
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",         { props: { accentColor: "#0F172A", brandName: "THE GRAND" } }),
      blockEl("sb-hero-cinematic",        1, "Hero",           { props: { accentColor: "#0F172A" }, patches: ph_luxuryHotel("A WORLD CLASS SANCTUARY", "Redefining\nLuxury.", "Discover a new standard of excellence in the heart of the city. A sanctuary of sophisticated design and unparalleled service.", "Book Your Stay", "Explore Suites"), styles: { backgroundImage: "radial-gradient(circle at 50% 100%, rgba(202, 138, 4, 0.15), transparent 50%), radial-gradient(circle at 0% 0%, rgba(15, 23, 42, 1), transparent 40%)" } }),
      blockEl("sb-features-dark-bento",   2, "Accommodation",  { props: { accentColor: "#0F172A" }, patches: [
        { match: "FEATURED CAPABILITIES", content: "ACCOMMODATIONS" },
        { match: "Global Scale", content: "The Royal Penthouse" },
        { match: "Enterprise Security", content: "Executive Suites" },
        { match: "Team Collaboration", content: "Garden Villas" }
      ]}),
      blockEl("sb-logos-badges",          3, "Awards"),
      blockEl("sb-content-magazine-split",4, "Fine Dining",    { props: { accentColor: "#0F172A" }, patches: [
        { match: "THE LATEST ISSUE", content: "MICHELIN DINING" },
        { match: "Building the future of the web, one component at a time.", content: "A culinary journey led by world-renowned chefs. Savour the extraordinary." }
      ]}),
      blockEl("sb-content-magazine-split",5, "Wellness",       { patches: [
        { match: "THE LATEST ISSUE", content: "ADVANCED WELLNESS" },
        { match: "Building the future of the web, one component at a time.", content: "Holistic treatments designed to restore balance and vitality. Your path to rejuvenation." }
      ]}),
      blockEl("sb-testimonials-wall",     6, "Guest Stories"),
      blockEl("sb-footer-mega",           7, "Footer",         { props: { brandName: "THE GRAND" } }),
    ],
  },
  {
    name: "Suites", slug: "/suites",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",          { props: { accentColor: "#0F172A", brandName: "THE GRAND" } }),
      blockEl("sb-hero-video-dark",       1, "The Collection",  { props: { accentColor: "#0F172A" }, patches: ph_videoDark("THE GRAND COLLECTION", "Suites unlike\nany other.", "Each suite at The Grand is a world of its own — handcrafted interiors, private terraces, and 24-hour butler service on request.") }),
      blockEl("sb-features-dark-bento",   2, "Suite Details",   { props: { accentColor: "#0F172A" }, patches: [
        { match: "FEATURED CAPABILITIES", content: "THE COLLECTION" },
        { match: "Global Scale", content: "The Presidential Suite" },
        { match: "Enterprise Security", content: "The Royal Penthouse" },
        { match: "Team Collaboration", content: "Grand Signature Suites" },
      ]}),
      blockEl("sb-portfolio-case-study",  3, "The Presidential"),
      blockEl("sb-cta-gradient-wave",     4, "Book Now",        { props: { accentColor: "#0F172A" } }),
      blockEl("sb-footer-mega",           5, "Footer",          { props: { brandName: "THE GRAND" } }),
    ],
  },
  {
    name: "Gastronomy", slug: "/gastronomy",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",      { props: { accentColor: "#0F172A", brandName: "THE GRAND" } }),
      blockEl("sb-hero-cinematic",        1, "Dining",      { props: { accentColor: "#0F172A" }, patches: ph_cinematic("✦ CHEF'S TABLE & FINE DINING", "A culinary\nmasterpiece.", "Three distinct dining venues, each with their own story. From casual poolside bites to a Michelin-level tasting menu — your table awaits.", "Reserve Your Table →") }),
      blockEl("sb-features-alternating",  2, "Venues",      { props: { accentColor: "#0F172A" } }),
      blockEl("sb-team-spotlight",        3, "Executive Chef"),
      blockEl("sb-cta-gradient-wave",     4, "Reservations",{ props: { accentColor: "#0F172A" } }),
      blockEl("sb-footer-mega",           5, "Footer",      { props: { brandName: "THE GRAND" } }),
    ],
  },
  {
    name: "Wellness", slug: "/wellness",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",        { props: { accentColor: "#0F172A", brandName: "THE GRAND" } }),
      blockEl("sb-hero-bento",            1, "Spa & Wellness", { props: { accentColor: "#0F172A" }, patches: ph_bento("✦ THE GRAND SPA", "Your path to\nrejuvenation.", "A sanctuary of stillness in the heart of the city. Seven treatment rooms, an infinity pool, and a full wellness programme await your arrival.", "Book Treatment", "50+", "treatments", "City-view", "infinity pool", "Award-Winning Spa", "Voted Best City Spa three years running by Condé Nast Traveller.") }),
      blockEl("sb-services-alternating",  2, "Treatments",    { props: { accentColor: "#0F172A" } }),
      blockEl("sb-pricing-dark-cards",    3, "Day Packages",  { props: { accentColor: "#0F172A" } }),
      blockEl("sb-footer-mega",           4, "Footer",        { props: { brandName: "THE GRAND" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-dark-gradient",  0, "Navbar",     { props: { accentColor: "#0F172A", brandName: "THE GRAND" } }),
      blockEl("sb-contact-dark",          1, "Book",       { props: { accentColor: "#0F172A" } }),
      blockEl("sb-features-cards",        2, "Offers",     { props: { accentColor: "#0F172A" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "EXCLUSIVE PACKAGES" },
        { match: "Built for the next generation of web applications.", content: "Tailor your stay at The Grand." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Our curated packages are designed to make every stay more extraordinary. Book direct for exclusive pricing and added amenities." },
        { match: "Lightning Performance", content: "Honeymoon Escape" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Champagne on arrival, couples spa treatment, and a private candlelit dinner on your suite terrace." },
        { match: "Military-Grade Security", content: "Corporate Retreat" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Private meeting rooms, AV equipment, full-board arrangement, and a dedicated concierge for your executive team." },
        { match: "Seamless Integration", content: "Weekend Escape" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Two nights in our signature suite, breakfast each morning, afternoon tea, and a sunset terrace dinner for two." },
      ]}),
      blockEl("sb-footer-mega",           3, "Footer",     { props: { brandName: "THE GRAND" } }),
    ],
  },
];

// ─── Villa — hotel-villa · FREE ───────────────────────────────────────────────
// Warm personal — classic editorial hero + magazine split host welcome + single quote review
const villaPages: TemplatePage[] = [
  {
    name: "Home", slug: "/", isHome: true,
    elements: [
      blockEl("sb-navbar-minimal",         0, "Navbar",        { props: { brandName: "Villa Rosa" } }),
      blockEl("sb-hero-editorial-classic", 1, "Hero",          { props: { accentColor: "#854D0E" }, patches: ph_editorialClassic("VILLA ROSA • OPEN YEAR ROUND", "A home away\nfrom home.", "Set in rolling Tuscan countryside, Villa Rosa is a small, family-run guesthouse offering five beautifully restored rooms, home-cooked breakfasts, and warm Italian hospitality.", "View the Rooms") }),
      blockEl("sb-content-magazine-split", 2, "Host Welcome",  { props: { accentColor: "#854D0E" }, patches: [
        { match: "FEATURE STORY", content: "A NOTE FROM YOUR HOST" },
        { match: "The renaissance of thoughtful design in a noisy world.", content: "Welcome to Villa Rosa — we've been waiting for you." },
        { match: "by Marcus Webb", content: "by Elena Russo, Host" },
        { match: "April 15, 2026 · 8 min read", content: "Est. 1987 · Family run" },
        { match: "In a world saturated with digital noise, the designers who cut through are those who embrace constraints as a creative tool. Reduction is not limitation - it is the highest form of craft.", content: "My grandmother bought this farmhouse in 1987 and turned it into a guesthouse with the simple idea that every guest should feel like family. That is still the only rule here." },
        { match: "The best interfaces are invisible. They guide without demanding attention, inform without overwhelming, and delight without distraction. That is the standard we hold ourselves to.", content: "We have five rooms, a kitchen garden, and an olive grove that has been producing oil for forty years. Breakfast is made each morning from what's in season. We hope you'll stay long enough to feel at home." },
        { match: "Continue reading →", content: "Our full story →" },
      ]}),
      blockEl("sb-features-cards",         3, "Rooms",         { props: { accentColor: "#854D0E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "OUR ROOMS" },
        { match: "Built for the next generation of web applications.", content: "Five rooms, each with their own character." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Restored stone walls, handmade furniture, and views of the Tuscan hills. All rooms include homemade breakfast." },
        { match: "Lightning Performance", content: "The Garden Room" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Ground floor with direct access to the kitchen garden. A private terrace, king bed, and stone-flagged floors." },
        { match: "Military-Grade Security", content: "The Tower Suite" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Our highest room with 360° countryside views. A wraparound balcony, freestanding bath, and oak-beamed ceilings." },
        { match: "Seamless Integration", content: "The Olive Room" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Nestled among the olive trees with a private courtyard entrance, a daybed, and an outdoor rain shower." },
      ]}),
      blockEl("sb-features-icon-3col",     4, "Highlights",    { props: { accentColor: "#854D0E" } }),
      blockEl("sb-testimonials-single-quote",5,"Guest Story"),
      blockEl("sb-features-cards",         6, "Packages",      { props: { accentColor: "#854D0E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "STAY PACKAGES" },
        { match: "Built for the next generation of web applications.", content: "A little more, for a little extra." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Extend your stay into a full experience with one of our curated packages, each designed around the best of the region." },
        { match: "Lightning Performance", content: "Tasting & Cellars" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Three nights plus a private guided tour of two nearby wineries, with a curated tasting dinner on your last evening." },
        { match: "Military-Grade Security", content: "Slow Food Weekend" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Two nights, a Saturday market walk with Elena, a cooking lesson, and lunch in the kitchen garden made from your finds." },
        { match: "Seamless Integration", content: "Truffle Season" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "November and December only. Join a morning truffle hunt with our local forager, followed by a truffle lunch at the villa." },
      ]}),
      blockEl("sb-footer-light",           7, "Footer",        { props: { brandName: "Villa Rosa" } }),
    ],
  },
  {
    name: "Rooms", slug: "/rooms",
    elements: [
      blockEl("sb-navbar-minimal",          0, "Navbar"),
      blockEl("sb-hero-organic",            1, "Rooms",          { props: { accentColor: "#854D0E" }, patches: ph_organic("Five rooms,\neach its own story.", "From the Tower Suite's wraparound balcony to the Garden Room's private terrace, every room at Villa Rosa has been designed to make your stay feel like a discovery.", "Explore All Rooms", "Loved by guests from over 40 countries.") }),
      blockEl("sb-features-alternating-rows",2,"Room Detail",   { props: { accentColor: "#854D0E" }, patches: [
        { match: "HOW IT WORKS", content: "THE ROOMS" },
        { match: "One platform.\nEverything you need.", content: "Restored with\ncare and love." },
        { match: "Visual editor that thinks like a developer", content: "The Tower Suite — our most special room" },
        { match: "Drag, drop, and customize every element visually. Your changes are reflected in clean, production-ready code automatically.", content: "The highest room in the farmhouse, with 360° views of the countryside from a private wraparound balcony. A freestanding copper bath, oak-beamed ceilings, and a king bed dressed in white linen." },
        { match: "✓  Real-time collaborative editing", content: "✓  Wraparound private balcony" },
        { match: "✓  Component library & design tokens", content: "✓  Freestanding copper soaking bath" },
        { match: "✓  Responsive preview for all devices", content: "✓  360° countryside views" },
        { match: "One-click deploy to any cloud", content: "The Garden Room — private and grounded" },
        { match: "Connect your custom domain, configure your environment, and go live globally in under 60 seconds.", content: "Ground-floor room opening directly onto the kitchen garden through original stone arches. A king bed, stone-flagged floors, and your own private terrace shaded by a fig tree." },
        { match: "✓  Git-based deployment workflow", content: "✓  Direct garden access" },
        { match: "✓  Instant rollback to any version", content: "✓  Private shaded terrace" },
        { match: "✓  170+ global edge locations", content: "✓  Stone-flagged original floors" },
      ]}),
      blockEl("sb-features-checklist",      3, "What's Included"),
      blockEl("sb-cta-minimal-center",      4, "Book",          { props: { accentColor: "#854D0E" } }),
      blockEl("sb-footer-light",            5, "Footer",        { props: { brandName: "Villa Rosa" } }),
    ],
  },
  {
    name: "Dining & Breakfast", slug: "/dining",
    elements: [
      blockEl("sb-navbar-minimal",         0, "Navbar"),
      blockEl("sb-hero-editorial-classic", 1, "Breakfast",       { props: { accentColor: "#854D0E" }, patches: ph_editorialClassic("BREAKFAST AT VILLA ROSA", "The morning\ntable is set.", "A long Italian breakfast served from 8 until 10:30 every morning. Fresh pastries, eggs from our hens, seasonal fruit, and espresso from our vintage Gaggia.", "See What's Included") }),
      blockEl("sb-features-bold-grid",     2, "Breakfast Menu",  { props: { accentColor: "#854D0E" } }),
      blockEl("sb-content-magazine-split", 3, "Evening Options", { props: { accentColor: "#854D0E" }, patches: [
        { match: "FEATURE STORY", content: "EVENING DINING" },
        { match: "The renaissance of thoughtful design in a noisy world.", content: "Dinner at the villa — by arrangement." },
        { match: "by Marcus Webb", content: "by Elena Russo" },
        { match: "April 15, 2026 · 8 min read", content: "Host & Cook" },
        { match: "In a world saturated with digital noise, the designers who cut through are those who embrace constraints as a creative tool. Reduction is not limitation - it is the highest form of craft.", content: "Two or three evenings a week, depending on the season, we open the dining room for a shared meal. The menu is whatever we harvested that day, cooked simply and served with our house olive oil and local wine." },
        { match: "The best interfaces are invisible. They guide without demanding attention, inform without overwhelming, and delight without distraction. That is the standard we hold ourselves to.", content: "There is no printed menu and no choice — you eat what we've made, alongside the other guests at one long table. It is the most popular thing we do, and bookings always fill up fast." },
        { match: "Continue reading →", content: "Ask about dinner →" },
      ]}),
      blockEl("sb-content-feature-list",   4, "Dietary Needs"),
      blockEl("sb-footer-light",           5, "Footer",          { props: { brandName: "Villa Rosa" } }),
    ],
  },
  {
    name: "Location", slug: "/location",
    elements: [
      blockEl("sb-navbar-minimal",       0, "Navbar"),
      blockEl("sb-contact-map",          1, "Map"),
      blockEl("sb-features-steps",       2, "Getting Here"),
      blockEl("sb-features-cards",       3, "Things to Do",  { props: { accentColor: "#854D0E" }, patches: [
        { match: "ENGINEERING EXCELLENCE", content: "EXPLORE TUSCANY" },
        { match: "Built for the next generation of web applications.", content: "The best of the region on your doorstep." },
        { match: "A comprehensive suite of tools designed to help you build, deploy, and scale with absolute confidence.", content: "Villa Rosa sits in the heart of Chianti wine country, surrounded by medieval hilltowns, olive groves, and some of Italy's finest tables." },
        { match: "Lightning Performance", content: "Wine Country" },
        { match: "Optimized for speed at every layer. Your users won't just see the difference, they'll feel it.", content: "Over thirty wineries within 20 minutes. We can arrange private tastings and cellar tours with our favourite producers." },
        { match: "Military-Grade Security", content: "Medieval Hilltowns" },
        { match: "Advanced encryption and compliance protocols that keep your data safe and your mind at ease.", content: "Greve, Radda, and Castellina in Chianti are each within 15 minutes — cobblestone streets, weekly markets, and authentic trattorias." },
        { match: "Seamless Integration", content: "Truffle & Olive Farms" },
        { match: "Connect with your favorite tools in seconds. Our open API allows for infinite customization.", content: "Visit a working olive mill, join a truffle hunt in autumn, or spend a morning learning to press our own estate oil." },
      ]}),
      blockEl("sb-footer-light",         4, "Footer",        { props: { brandName: "Villa Rosa" } }),
    ],
  },
  {
    name: "Book", slug: "/book",
    elements: [
      blockEl("sb-navbar-minimal",      0, "Navbar"),
      blockEl("sb-contact-split",       1, "Book Direct",    { props: { accentColor: "#854D0E" } }),
      blockEl("sb-features-checklist",  2, "Benefits"),
      blockEl("sb-cta-banner",          3, "Gift Vouchers",  { props: { accentColor: "#854D0E" } }),
      blockEl("sb-footer-light",        4, "Footer",         { props: { brandName: "Villa Rosa" } }),
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
