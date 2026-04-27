import { SECTION_BLOCKS } from "./section-blocks";
import { generateId } from "./utils";
import type { CanvasElement, Page, DesignTokens } from "./types";

export interface GeneratedSection {
  type: string;
  content: Record<string, any>;
}

export interface GeneratedPage {
  name: string;
  slug: string;
  sections: GeneratedSection[];
}

export interface GeneratedSite {
  name: string;
  description: string;
  pages: GeneratedPage[];
  colorPalette: { primary: string; secondary: string; background: string; text: string };
  typography: { heading: string; body: string };
  meta: { title: string; description: string };
}

type ContentPatch = {
  match?: string;
  type?: string;
  nth?: number;
  content?: string;
  styles?: Record<string, unknown>;
  props?: Record<string, unknown>;
};

function applyPatches(root: any, patches: ContentPatch[]): any {
  const counts = new Map<string, number>();
  function walk(node: any): any {
    const t = node.type;
    const n = counts.get(t) ?? 0;
    counts.set(t, n + 1);
    const patch = patches.find(p =>
      p.match !== undefined ? p.match === node.content : (p.type === t && p.nth === n)
    );
    const out: any = patch ? {
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

function cloneWithIds(el: any, order: number): CanvasElement {
  return {
    ...el,
    id: generateId(),
    order,
    children: el.children?.map((c: any, i: number) => cloneWithIds(c, i)),
  };
}

export function mapAiSiteToCanvas(site: GeneratedSite, style: string = "modern"): { pages: Page[], designTokens: Partial<DesignTokens> } {
  // Detect actual style from site data if possible (e.g. background color), but fallback to parameter
  const finalStyle = (site.colorPalette.background === "#0f0f0f" || site.colorPalette.background === "#0f172a" || site.colorPalette.background === "#000000") ? "dark" : style;

  const pages: Page[] = site.pages.map((gp, pageIdx) => {
    const elements: CanvasElement[] = [];
    let currentOrder = 0;

    // 1. Add Navbar
    const navbarId = finalStyle === "dark" ? "sb-navbar-dark" : finalStyle === "minimal" ? "sb-navbar-minimal" : finalStyle === "bold" ? "sb-navbar-bold" : "sb-navbar-saas";
    const navbarBlock = SECTION_BLOCKS.find(b => b.id === navbarId);
    if (navbarBlock) {
      elements.push(cloneWithIds({
        ...navbarBlock.element,
        props: {
          ...navbarBlock.element.props,
          brandName: site.name,
          accentColor: site.colorPalette.primary,
        }
      }, currentOrder++));
    }

    // 2. Map AI Sections for this page
    for (const section of gp.sections) {
      let blockId = "";
      const patches: ContentPatch[] = [];

      switch (section.type) {
        case "hero":
          blockId = finalStyle === "dark" ? "sb-hero-masterpiece" : finalStyle === "playful" ? "sb-hero-playful" : finalStyle === "bold" ? "sb-hero-feature-stack" : "sb-hero-product";
          patches.push(
            { type: "heading", nth: 0, content: section.content.headline as string },
            { type: "paragraph", nth: 0, content: section.content.subheadline as string },
            { type: "button", nth: 0, content: (section.content.ctaText || "Get Started") as string },
          );
          if (section.content.badge) {
            patches.push({ type: "badge", nth: 0, content: section.content.badge as string });
          }
          break;

        case "logos":
          blockId = finalStyle === "dark" ? "sb-logos-dark" : "sb-logos";
          if (section.content.headline) {
            patches.push({ type: "heading", nth: 0, content: section.content.headline as string });
          }
          break;

        case "features":
          blockId = finalStyle === "dark" ? "sb-features-bento-master" : "sb-features-cards";
          if (section.content.headline) {
            patches.push({ type: "heading", nth: 0, content: section.content.headline as string });
          }
          if (section.content.subheadline) {
            patches.push({ type: "paragraph", nth: 0, content: section.content.subheadline as string });
          }
          if (Array.isArray(section.content.features)) {
            section.content.features.slice(0, 3).forEach((f: any, i: number) => {
              patches.push(
                { type: "heading", nth: i + 1, content: f.title },
                { type: "paragraph", nth: i + 1, content: f.desc }
              );
            });
          }
          break;

        case "testimonials":
          blockId = "sb-testimonials-wall";
          if (section.content.headline) {
            patches.push({ type: "heading", nth: 0, content: section.content.headline as string });
          }
          if (Array.isArray(section.content.testimonials)) {
            section.content.testimonials.slice(0, 3).forEach((t: any, i: number) => {
              patches.push(
                { type: "paragraph", nth: i * 2 + 1, content: t.quote },
                { type: "heading", nth: i + 1, content: t.name },
              );
            });
          }
          break;

        case "pricing":
          blockId = "sb-pricing-professional";
          if (section.content.headline) {
            patches.push({ type: "heading", nth: 0, content: section.content.headline as string });
          }
          break;

        case "faq":
          blockId = "sb-faq-two-col";
          if (section.content.headline) {
            patches.push({ type: "heading", nth: 0, content: section.content.headline as string });
          }
          break;

        case "newsletter":
          blockId = finalStyle === "dark" ? "sb-cta-masterpiece" : "sb-cta-newsletter";
          if (section.content.headline) {
            patches.push({ type: "heading", nth: 0, content: section.content.headline as string });
          }
          if (section.content.subheadline) {
            patches.push({ type: "paragraph", nth: 0, content: section.content.subheadline as string });
          }
          break;
        
        case "stats":
          blockId = "sb-stats-minimal-row";
          if (Array.isArray(section.content.stats)) {
            section.content.stats.slice(0, 4).forEach((s: any, i: number) => {
              patches.push(
                { type: "heading", nth: i, content: s.value },
                { type: "paragraph", nth: i, content: s.label }
              );
            });
          }
          break;
      }

      if (blockId) {
        const block = SECTION_BLOCKS.find(b => b.id === blockId);
        if (block) {
          let el = JSON.parse(JSON.stringify(block.element));
          el = applyPatches(el, patches);
          elements.push(cloneWithIds(el, currentOrder++));
        }
      }
    }

    // 3. Add Footer
    const footerId = finalStyle === "dark" ? "sb-footer-dark" : "sb-footer-minimal";
    const footerBlock = SECTION_BLOCKS.find(b => b.id === footerId);
    if (footerBlock) {
      elements.push(cloneWithIds({
        ...footerBlock.element,
        props: {
          ...footerBlock.element.props,
          brandName: site.name,
        }
      }, currentOrder++));
    }

    return {
      id: `page-${gp.name.toLowerCase()}-${generateId()}`,
      name: gp.name,
      slug: gp.slug,
      isHome: gp.slug === "/",
      elements: elements,
      seo: {
        title: `${gp.name} | ${site.name}`,
        description: site.meta.description,
      }
    };
  });

  const designTokens: Partial<DesignTokens> = {
    colors: {
      primary: site.colorPalette.primary,
      secondary: site.colorPalette.secondary,
      background: site.colorPalette.background,
      text: site.colorPalette.text,
      accent: site.colorPalette.primary,
      surface: site.colorPalette.background === "#ffffff" ? "#f9fafb" : site.colorPalette.background,
      textMuted: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    typography: {
      fontHeading: site.typography.heading,
      fontBody: site.typography.body,
      fontMono: "monospace",
      sizeBase: 16,
      scaleRatio: 1.25,
    }
  };

  return { pages, designTokens };
}
