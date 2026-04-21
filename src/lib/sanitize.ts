/**
 * Sanitizes untrusted HTML to prevent XSS.
 * Uses isomorphic-dompurify which works in both browser and Node.js.
 *
 * NOTE: isomorphic-dompurify depends on jsdom in Node.js, which can fail
 * inside the Next.js App Router SSR sandbox. The guard below prevents any
 * DOMPurify calls from running server-side — sanitization only happens in
 * the browser where a real DOM is available.
 */
import type DOMPurify from "isomorphic-dompurify";

const SVG_CONFIG: DOMPurify.Config = {
  ALLOWED_TAGS: [
    "svg", "path", "circle", "rect", "line", "polyline", "polygon",
    "ellipse", "g", "defs", "use", "symbol", "title", "desc",
    "linearGradient", "radialGradient", "stop", "clipPath", "mask",
    "pattern", "text", "tspan", "textPath",
  ],
  ALLOWED_ATTR: [
    "id", "class", "style", "viewBox", "xmlns", "fill", "stroke",
    "stroke-width", "stroke-linecap", "stroke-linejoin", "d", "points",
    "x", "y", "x1", "y1", "x2", "y2", "cx", "cy", "r", "rx", "ry",
    "width", "height", "transform", "opacity", "clip-path", "mask",
    "href", "gradientUnits", "offset", "stop-color",
    "stop-opacity", "patternUnits", "preserveAspectRatio",
  ],
  FORCE_BODY: false,
};

/** Sanitize an SVG/HTML string. No-op on the server (SSR); runs in browser only. */
export function sanitizeHtml(dirty: string): string {
  if (typeof window === "undefined") return dirty;
  // Dynamic require prevents jsdom from being evaluated during SSR module init.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires, @typescript-eslint/no-explicit-any
  const DOMPurify = require("isomorphic-dompurify") as any;
  return DOMPurify.sanitize(dirty, SVG_CONFIG) as string;
}

// Alias used by canvas.tsx
export const sanitizeHtmlSync = sanitizeHtml;
