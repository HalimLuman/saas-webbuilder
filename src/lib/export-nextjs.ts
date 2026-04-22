/**
 * export-nextjs.ts
 * Converts a site's canvas elements into a complete, downloadable Next.js 14 project.
 * Returns Record<filePath, fileContent> – fully self-contained, no server APIs.
 */

// ─── Inline types (avoids import in generated output) ────────────────────────

interface CanvasElement {
  id: string;
  type: string;
  content?: string;
  order: number;
  styles?: Record<string, unknown>;
  props?: Record<string, unknown>;
  children?: CanvasElement[];
  isHidden?: boolean;
}

interface ExportPage {
  id: string;
  name: string;
  slug: string;
  elements: CanvasElement[];
  isHome?: boolean;
}

export interface ExportBackendAction {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  auth?: string;
}

export interface ExportDataSource {
  id: string;
  name: string;
  type: string;
  config: Record<string, unknown>;
  refreshOn?: string;
}

export interface ExportSiteRoute {
  id: string;
  path: string;
  method: string;
  auth: string;
  steps: { type: string; config?: Record<string, unknown>; expression?: string; body?: unknown; status?: number }[];
}

export interface ExportSite {
  name?: string;
  pages: ExportPage[];
  backendActions?: ExportBackendAction[];
  dataSources?: ExportDataSource[];
  siteRoutes?: ExportSiteRoute[];
}

// ─── Style helpers ────────────────────────────────────────────────────────────

function stylesToJSXAttr(styles?: Record<string, unknown>): string {
  if (!styles || Object.keys(styles).length === 0) return "";
  const entries = Object.entries(styles)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `"${k}": ${JSON.stringify(v)}`);
  if (entries.length === 0) return "";
  return `style={{ ${entries.join(", ")} }}`;
}

/** Escape text content for embedding inside JSX */
function escapeJSX(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/{/g, "&#123;")
    .replace(/}/g, "&#125;");
}

// ─── Recursive element → JSX string renderer ─────────────────────────────────

function renderChildren(children: CanvasElement[] | undefined, depth: number): string {
  if (!children || children.length === 0) return "";
  return children
    .filter((c) => !c.isHidden)
    .sort((a, b) => a.order - b.order)
    .map((c) => renderElementCode(c, depth + 1))
    .join("\n");
}

function renderElementCode(el: CanvasElement, depth = 0): string {
  if (el.isHidden) return "";

  const s = stylesToJSXAttr(el.styles);
  const p = el.props ?? {};
  const children = el.children ?? [];
  const childrenCode = renderChildren(children, depth);
  const content = el.content ? escapeJSX(el.content) : "";
  const styleAttr = s ? ` ${s}` : "";

  switch (el.type) {
    // ── Layout ──────────────────────────────────────────────────────────────
    case "section":
      return `<section${styleAttr} className="w-full py-16 px-8 bg-white">
${childrenCode || "  {/* empty section */}"}
</section>`;

    case "container":
      return `<div${styleAttr} className="max-w-7xl mx-auto px-8">
${childrenCode || "  {/* empty container */}"}
</div>`;

    case "two-col": {
      const col0 = renderChildren(children[0]?.children, depth);
      const col1 = renderChildren(children[1]?.children, depth);
      return `<div${styleAttr} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
  <div className="flex-1">${col0 || ""}</div>
  <div className="flex-1">${col1 || ""}</div>
</div>`;
    }

    case "three-col": {
      const c0 = renderChildren(children[0]?.children, depth);
      const c1 = renderChildren(children[1]?.children, depth);
      const c2 = renderChildren(children[2]?.children, depth);
      return `<div${styleAttr} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
  <div className="flex-1">${c0 || ""}</div>
  <div className="flex-1">${c1 || ""}</div>
  <div className="flex-1">${c2 || ""}</div>
</div>`;
    }

    case "four-col": {
      const fc0 = renderChildren(children[0]?.children, depth);
      const fc1 = renderChildren(children[1]?.children, depth);
      const fc2 = renderChildren(children[2]?.children, depth);
      const fc3 = renderChildren(children[3]?.children, depth);
      return `<div${styleAttr} className="flex gap-6 max-w-7xl mx-auto px-8 py-16">
  <div className="flex-1">${fc0 || ""}</div>
  <div className="flex-1">${fc1 || ""}</div>
  <div className="flex-1">${fc2 || ""}</div>
  <div className="flex-1">${fc3 || ""}</div>
</div>`;
    }

    case "sidebar-left": {
      const sidebar = renderChildren(children[0]?.children, depth);
      const main = renderChildren(children[1]?.children, depth);
      return `<div${styleAttr} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
  <aside className="w-64 shrink-0">${sidebar || ""}</aside>
  <div className="flex-1">${main || ""}</div>
</div>`;
    }

    case "sidebar-right": {
      const main2 = renderChildren(children[0]?.children, depth);
      const sidebar2 = renderChildren(children[1]?.children, depth);
      return `<div${styleAttr} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
  <div className="flex-1">${main2 || ""}</div>
  <aside className="w-64 shrink-0">${sidebar2 || ""}</aside>
</div>`;
    }

    case "flex-row":
      return `<div${styleAttr} className="flex flex-row flex-wrap gap-4 items-center">
${childrenCode || ""}
</div>`;

    case "flex-col":
      return `<div${styleAttr} className="flex flex-col gap-4">
${childrenCode || ""}
</div>`;

    case "grid":
      return `<div${styleAttr} className="grid gap-4">
${childrenCode || ""}
</div>`;

    case "columns":
      return `<div${styleAttr} className="flex flex-wrap gap-4">
${childrenCode || ""}
</div>`;

    // ── Typography ───────────────────────────────────────────────────────────
    case "heading": {
      const level = Number(p.level ?? 1);
      const tag = `h${Math.min(Math.max(level, 1), 6)}`;
      const sizeMap: Record<number, string> = {
        1: "text-5xl font-extrabold",
        2: "text-4xl font-bold",
        3: "text-3xl font-bold",
        4: "text-2xl font-semibold",
        5: "text-xl font-semibold",
        6: "text-lg font-semibold",
      };
      const cls = sizeMap[level] ?? "text-5xl font-extrabold";
      return `<${tag}${styleAttr} className="${cls} text-gray-900 leading-tight">${content || "Heading"}</${tag}>`;
    }

    case "paragraph":
      return `<p${styleAttr} className="text-base text-gray-600 leading-relaxed">${content || ""}</p>`;

    case "rich-text":
      return `<div${styleAttr} className="prose prose-gray max-w-none"><p>${content || ""}</p></div>`;

    case "blockquote":
      return `<blockquote${styleAttr} className="border-l-4 border-indigo-300 pl-4 italic text-gray-600 my-4">${content || ""}</blockquote>`;

    case "code-block":
    case "code":
      return `<pre${styleAttr} className="bg-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto text-sm font-mono"><code>${content || ""}</code></pre>`;

    case "badge":
      return `<span${styleAttr} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">${content || "Badge"}</span>`;

    case "eyebrow":
      return `<p${styleAttr} className="text-xs font-semibold uppercase tracking-widest text-indigo-600">${content || ""}</p>`;

    case "alert": {
      const variant = String(p.variant ?? "info");
      const alertCls =
        variant === "error"
          ? "bg-red-50 border border-red-200 text-red-800"
          : variant === "warning"
          ? "bg-yellow-50 border border-yellow-200 text-yellow-800"
          : variant === "success"
          ? "bg-green-50 border border-green-200 text-green-800"
          : "bg-blue-50 border border-blue-200 text-blue-800";
      return `<div${styleAttr} className="rounded-xl px-4 py-3 text-sm ${alertCls}">${content || ""}</div>`;
    }

    case "kbd":
      return `<kbd${styleAttr} className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">${content || ""}</kbd>`;

    case "number-display":
      return `<div${styleAttr} className="text-6xl font-black text-indigo-600 tabular-nums">${content || "0"}</div>`;

    case "text-link":
      return `<a href="${escapeJSX(String(p.href ?? "#"))}"${styleAttr} className="text-indigo-600 underline underline-offset-2 hover:opacity-80 transition">${content || "Link"}</a>`;

    // ── Media ────────────────────────────────────────────────────────────────
    case "image":
      return `<img src="${escapeJSX(String(p.src ?? ""))}" alt="${escapeJSX(String(p.alt ?? ""))}"${styleAttr} className="rounded-2xl object-cover w-full" />`;

    case "video":
    case "video-embed": {
      const src = String(p.src ?? p.url ?? "");
      if (src) {
        return `<div${styleAttr} className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-900">
  <iframe src="${escapeJSX(src)}" className="w-full h-full" frameBorder="0" allowFullScreen />
</div>`;
      }
      return `<div${styleAttr} className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center">
  <span className="text-white/60 text-sm">Video embed</span>
</div>`;
    }

    case "embed":
      return `<div${styleAttr} className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-100 flex items-center justify-center">
  <span className="text-gray-400 text-sm">Embed</span>
</div>`;

    case "audio":
      return `<audio${styleAttr} controls className="w-full" src="${escapeJSX(String(p.src ?? ""))}"></audio>`;

    case "icon": {
      const iconName = String(p.name ?? p.icon ?? "Star");
      return `<span${styleAttr} className="inline-flex items-center justify-center text-gray-700" aria-label="${escapeJSX(iconName)}">
  {/* Icon: ${iconName} */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="1.5" /></svg>
</span>`;
    }

    case "avatar": {
      const avatarSrc = String(p.src ?? p.image ?? "");
      const avatarAlt = String(p.alt ?? p.name ?? "Avatar");
      if (avatarSrc) {
        return `<img src="${escapeJSX(avatarSrc)}" alt="${escapeJSX(avatarAlt)}"${styleAttr} className="rounded-full object-cover w-10 h-10" />`;
      }
      return `<div${styleAttr} className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">${escapeJSX(avatarAlt.charAt(0).toUpperCase())}</div>`;
    }

    case "avatar-group":
      return `<div${styleAttr} className="flex -space-x-3">
${childrenCode || `  <div className="w-10 h-10 rounded-full bg-indigo-100 ring-2 ring-white" />`}
</div>`;

    case "gallery":
    case "image-gallery": {
      const imgs = Array.isArray(p.images) ? (p.images as string[]) : [];
      if (imgs.length > 0) {
        const imgTags = imgs
          .map((src) => `  <img src="${escapeJSX(src)}" alt="" className="rounded-xl object-cover w-full aspect-square" />`)
          .join("\n");
        return `<div${styleAttr} className="grid grid-cols-3 gap-4">
${imgTags}
</div>`;
      }
      return `<div${styleAttr} className="grid grid-cols-3 gap-4">
  <div className="aspect-square rounded-xl bg-gray-100" />
  <div className="aspect-square rounded-xl bg-gray-100" />
  <div className="aspect-square rounded-xl bg-gray-100" />
</div>`;
    }

    case "svg":
      return `<div${styleAttr} className="inline-flex items-center justify-center">${content || '<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" />'}</div>`;

    case "lottie":
      return `<div${styleAttr} className="w-full aspect-square bg-gray-50 rounded-xl flex items-center justify-center">
  <span className="text-gray-400 text-sm">Lottie Animation</span>
</div>`;

    // ── Forms & Inputs ───────────────────────────────────────────────────────
    case "button": {
      const href = String(p.href ?? p.url ?? "#");
      const variant = String(p.variant ?? "primary");
      const btnCls =
        variant === "outline"
          ? "inline-flex items-center px-6 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
          : variant === "ghost"
          ? "inline-flex items-center px-6 py-3 rounded-xl text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
          : variant === "destructive"
          ? "inline-flex items-center px-6 py-3 rounded-xl bg-red-600 text-white font-semibold text-sm hover:opacity-90 transition"
          : "inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition";
      return `<a href="${escapeJSX(href)}"${styleAttr} className="${btnCls}">${content || "Button"}</a>`;
    }

    case "form": {
      const action = String(p.action ?? "#");
      return `<form${styleAttr} action="${escapeJSX(action)}" method="POST" className="flex flex-col gap-4">
${childrenCode || `  <input type="text" placeholder="Your name" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
  <input type="email" placeholder="Email address" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
  <textarea placeholder="Your message" rows={4} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
  <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition">Send Message</button>`}
</form>`;
    }

    case "input": {
      const inputType = String(p.type ?? "text");
      const placeholder = String(p.placeholder ?? "");
      const label = String(p.label ?? "");
      return `<div${styleAttr} className="flex flex-col gap-1.5">
${label ? `  <label className="text-sm font-medium text-gray-700">${escapeJSX(label)}</label>` : ""}
  <input type="${escapeJSX(inputType)}" placeholder="${escapeJSX(placeholder)}" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
</div>`;
    }

    case "textarea": {
      const taPlaceholder = String(p.placeholder ?? "");
      const taLabel = String(p.label ?? "");
      const taRows = Number(p.rows ?? 4);
      return `<div${styleAttr} className="flex flex-col gap-1.5">
${taLabel ? `  <label className="text-sm font-medium text-gray-700">${escapeJSX(taLabel)}</label>` : ""}
  <textarea placeholder="${escapeJSX(taPlaceholder)}" rows={${taRows}} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm resize-none" />
</div>`;
    }

    case "select": {
      const selectLabel = String(p.label ?? "");
      const selectOptions = Array.isArray(p.options) ? (p.options as string[]) : [];
      return `<div${styleAttr} className="flex flex-col gap-1.5">
${selectLabel ? `  <label className="text-sm font-medium text-gray-700">${escapeJSX(selectLabel)}</label>` : ""}
  <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm bg-white">
    <option value="">Select an option</option>
${selectOptions.map((o) => `    <option value="${escapeJSX(o)}">${escapeJSX(o)}</option>`).join("\n")}
  </select>
</div>`;
    }

    case "checkbox": {
      const cbLabel = String(p.label ?? "I agree");
      return `<label${styleAttr} className="flex items-center gap-3 cursor-pointer">
  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
  <span className="text-sm text-gray-700">${escapeJSX(cbLabel)}</span>
</label>`;
    }

    case "radio-group": {
      const rgOptions = Array.isArray(p.options) ? (p.options as string[]) : ["Option 1", "Option 2"];
      const rgLabel = String(p.label ?? "");
      return `<div${styleAttr} className="flex flex-col gap-2">
${rgLabel ? `  <p className="text-sm font-medium text-gray-700">${escapeJSX(rgLabel)}</p>` : ""}
${rgOptions.map((o) => `  <label className="flex items-center gap-3 cursor-pointer"><input type="radio" className="w-4 h-4 border-gray-300 text-indigo-600 focus:ring-indigo-500" /><span className="text-sm text-gray-700">${escapeJSX(o)}</span></label>`).join("\n")}
</div>`;
    }

    case "toggle":
      return `<label${styleAttr} className="flex items-center gap-3 cursor-pointer">
  <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors">
    <span className="inline-block h-4 w-4 rounded-full bg-white translate-x-1 transition-transform" />
  </div>
  <span className="text-sm text-gray-700">${escapeJSX(String(p.label ?? "Toggle"))}</span>
</label>`;

    case "slider":
      return `<div${styleAttr} className="flex flex-col gap-2">
  ${p.label ? `<label className="text-sm font-medium text-gray-700">${escapeJSX(String(p.label))}</label>` : ""}
  <input type="range" min="${escapeJSX(String(p.min ?? 0))}" max="${escapeJSX(String(p.max ?? 100))}" defaultValue="${escapeJSX(String(p.defaultValue ?? 50))}" className="w-full accent-indigo-600" />
</div>`;

    case "rating": {
      const stars = Number(p.max ?? 5);
      const filled = Number(p.value ?? 0);
      const starArr = Array.from({ length: stars }, (_, i) =>
        `<span className="${i < filled ? "text-yellow-400" : "text-gray-300"}">★</span>`
      );
      return `<div${styleAttr} className="flex items-center gap-0.5 text-2xl">${starArr.join("")}</div>`;
    }

    case "date-picker":
      return `<input type="date"${styleAttr} className="px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />`;

    case "file-upload":
      return `<label${styleAttr} className="flex flex-col items-center justify-center gap-2 w-full h-32 rounded-xl border-2 border-dashed border-gray-300 hover:border-indigo-400 cursor-pointer transition-colors bg-gray-50">
  <span className="text-gray-400 text-sm">Click to upload or drag &amp; drop</span>
  <input type="file" className="hidden" />
</label>`;

    case "search-input":
      return `<div${styleAttr} className="relative">
  <input type="search" placeholder="${escapeJSX(String(p.placeholder ?? "Search…"))}" className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
  <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
</div>`;

    case "otp-input": {
      const otpLength = Number(p.length ?? 6);
      const boxes = Array.from({ length: otpLength }, () =>
        `<input type="text" maxLength={1} className="w-12 h-12 text-center text-lg font-bold border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500" />`
      );
      return `<div${styleAttr} className="flex items-center gap-3">${boxes.join("\n")}</div>`;
    }

    case "multi-select":
      return `<div${styleAttr} className="flex flex-wrap gap-2 p-3 rounded-xl border border-gray-200 min-h-[48px]">
  <span className="text-xs text-gray-400">Multi-select</span>
</div>`;

    // ── Navigation ───────────────────────────────────────────────────────────
    case "navbar": {
      const brand = String(p.brand ?? p.siteName ?? "Brand");
      const navLinks = Array.isArray(p.links) ? (p.links as Array<{ label: string; href: string }>) : [];
      const linksHtml = navLinks
        .map((l) => `<a href="${escapeJSX(l.href ?? "#")}" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">${escapeJSX(l.label ?? "")}</a>`)
        .join("\n      ");
      return `<nav${styleAttr} className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <a href="/" className="text-lg font-bold text-gray-900">${escapeJSX(brand)}</a>
    <div className="hidden md:flex items-center gap-8">
      ${linksHtml || '<a href="#" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">Home</a>'}
    </div>
  </div>
</nav>`;
    }

    case "footer": {
      const footerBrand = String(p.brand ?? p.siteName ?? "Brand");
      const footerCopy = String(p.copyright ?? `© ${new Date().getFullYear()} ${footerBrand}. All rights reserved.`);
      return `<footer${styleAttr} className="w-full bg-gray-900 text-gray-400 py-12 px-8">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
    <p className="text-sm font-semibold text-white">${escapeJSX(footerBrand)}</p>
    <p className="text-xs">${escapeJSX(footerCopy)}</p>
  </div>
</footer>`;
    }

    case "breadcrumbs": {
      const crumbs = Array.isArray(p.items) ? (p.items as Array<{ label: string; href: string }>) : [];
      const crumbHtml = crumbs
        .map((c, i) =>
          i < crumbs.length - 1
            ? `<a href="${escapeJSX(c.href ?? "#")}" className="text-indigo-600 hover:underline text-sm">${escapeJSX(c.label ?? "")}</a><span className="text-gray-400 text-sm mx-1">/</span>`
            : `<span className="text-gray-600 text-sm">${escapeJSX(c.label ?? "")}</span>`
        )
        .join("");
      return `<nav${styleAttr} className="flex items-center gap-1">${crumbHtml || `<a href="/" className="text-indigo-600 text-sm">Home</a><span className="text-gray-400 text-sm mx-1">/</span><span className="text-gray-600 text-sm">Page</span>`}</nav>`;
    }

    case "pagination":
      return `<nav${styleAttr} className="flex items-center gap-2">
  <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40" disabled>Previous</button>
  <button className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold">1</button>
  <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">2</button>
  <button className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50">Next</button>
</nav>`;

    case "tabs": {
      const tabItems = Array.isArray(p.items)
        ? (p.items as Array<{ label: string; content?: string }>)
        : [{ label: "Tab 1" }, { label: "Tab 2" }];
      const tabBtns = tabItems.map((t, i) =>
        `<button className="${i === 0 ? "px-4 py-2 text-sm font-semibold text-indigo-600 border-b-2 border-indigo-600" : "px-4 py-2 text-sm text-gray-600 hover:text-gray-900"}">${escapeJSX(t.label ?? "Tab")}</button>`
      );
      return `<div${styleAttr}>
  <div className="flex border-b border-gray-200">${tabBtns.join("\n  ")}</div>
  <div className="pt-4">${childrenCode || `<p className="text-gray-600">Tab content</p>`}</div>
</div>`;
    }

    case "accordion": {
      const accItems = Array.isArray(p.items)
        ? (p.items as Array<{ question: string; answer: string }>)
        : [{ question: "Question?", answer: "Answer." }];
      const accHtml = accItems.map((item) => `<details className="border-b border-gray-200 py-4">
  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors">${escapeJSX(item.question ?? "")}</summary>
  <p className="mt-3 text-gray-600 text-sm leading-relaxed">${escapeJSX(item.answer ?? "")}</p>
</details>`);
      return `<div${styleAttr} className="divide-y divide-gray-100">
${accHtml.join("\n")}
</div>`;
    }

    case "steps": {
      const stepItems = Array.isArray(p.steps)
        ? (p.steps as Array<{ title: string; description?: string }>)
        : [{ title: "Step 1" }, { title: "Step 2" }, { title: "Step 3" }];
      const stepsHtml = stepItems.map((st, i) => `  <div className="flex items-start gap-4">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold">${i + 1}</div>
    <div><p className="font-semibold text-gray-900">${escapeJSX(st.title ?? "")}</p>${st.description ? `<p className="text-sm text-gray-600 mt-1">${escapeJSX(st.description)}</p>` : ""}</div>
  </div>`);
      return `<div${styleAttr} className="flex flex-col gap-6">
${stepsHtml.join("\n")}
</div>`;
    }

    case "mobile-menu":
    case "mega-menu":
      return `<div${styleAttr} className="w-full bg-white border-b border-gray-100 p-4">
${childrenCode || `  <nav className="flex flex-col gap-2"><a href="/" className="text-sm text-gray-700">Home</a></nav>`}
</div>`;

    // ── Pre-built sections ───────────────────────────────────────────────────
    case "hero":
    case "hero-split": {
      const heroTitle = String(p.title ?? el.content ?? "Build Something Amazing");
      const heroSub = String(p.subtitle ?? p.description ?? "Start creating your next great project today.");
      const heroCta = String(p.cta ?? p.ctaText ?? "Get Started");
      const heroCtaHref = String(p.ctaHref ?? p.ctaUrl ?? "#");
      const heroImg = String(p.image ?? p.backgroundImage ?? "");
      const isSplit = el.type === "hero-split";
      if (isSplit) {
        return `<section${styleAttr} className="w-full py-20 px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
    <div className="flex-1 space-y-6">
      <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">${escapeJSX(heroTitle)}</h1>
      <p className="text-xl text-gray-600 leading-relaxed">${escapeJSX(heroSub)}</p>
      <div className="flex flex-wrap gap-4">
        <a href="${escapeJSX(heroCtaHref)}" className="inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90 transition">${escapeJSX(heroCta)}</a>
      </div>
    </div>
    <div className="flex-1">${heroImg ? `<img src="${escapeJSX(heroImg)}" alt="Hero" className="w-full rounded-2xl object-cover shadow-2xl" />` : `<div className="w-full aspect-video rounded-2xl bg-indigo-100 flex items-center justify-center"><span className="text-indigo-400 text-lg">Hero Image</span></div>`}</div>
  </div>
</section>`;
      }
      return `<section${styleAttr} className="w-full py-24 px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
  <div className="max-w-4xl mx-auto space-y-6">
    <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">${escapeJSX(heroTitle)}</h1>
    <p className="text-xl text-gray-600 leading-relaxed">${escapeJSX(heroSub)}</p>
    <div className="flex flex-wrap gap-4 justify-center">
      <a href="${escapeJSX(heroCtaHref)}" className="inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90 transition">${escapeJSX(heroCta)}</a>
    </div>
  </div>
</section>`;
    }

    case "feature-grid":
    case "features": {
      const feats = Array.isArray(p.features)
        ? (p.features as Array<{ title: string; description: string; icon?: string }>)
        : [
            { title: "Fast", description: "Blazing fast performance out of the box." },
            { title: "Secure", description: "Enterprise-grade security built in." },
            { title: "Scalable", description: "Grows with your business." },
          ];
      const featsHtml = feats.map((f) => `  <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
    </div>
    <h3 className="font-bold text-gray-900 mb-2">${escapeJSX(f.title ?? "")}</h3>
    <p className="text-sm text-gray-600 leading-relaxed">${escapeJSX(f.description ?? "")}</p>
  </div>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
${featsHtml.join("\n")}
    </div>
  </div>
</section>`;
    }

    case "feature-highlight": {
      const fhTitle = String(p.title ?? "Feature Highlight");
      const fhDesc = String(p.description ?? "Discover what makes us different.");
      const fhImg = String(p.image ?? "");
      const fhRight = Boolean(p.imageRight ?? false);
      const fhImgEl = fhImg
        ? `<img src="${escapeJSX(fhImg)}" alt="${escapeJSX(fhTitle)}" className="w-full rounded-2xl object-cover shadow-xl" />`
        : `<div className="w-full aspect-video rounded-2xl bg-indigo-100 flex items-center justify-center"><span className="text-indigo-400">Feature Image</span></div>`;
      const textCol = `<div className="flex-1 space-y-4">
    <h2 className="text-4xl font-bold text-gray-900">${escapeJSX(fhTitle)}</h2>
    <p className="text-lg text-gray-600 leading-relaxed">${escapeJSX(fhDesc)}</p>
  </div>`;
      const imgCol = `<div className="flex-1">${fhImgEl}</div>`;
      return `<section${styleAttr} className="w-full py-20 px-8 bg-white">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
    ${fhRight ? `${textCol}\n    ${imgCol}` : `${imgCol}\n    ${textCol}`}
  </div>
</section>`;
    }

    case "bento-grid": {
      const bentoItems = Array.isArray(p.items)
        ? (p.items as Array<{ title: string; description?: string; span?: number }>)
        : [{ title: "Feature A" }, { title: "Feature B" }, { title: "Feature C" }];
      const bentoHtml = bentoItems.map((bi) => `  <div className="${bi.span === 2 ? "col-span-2 " : ""}p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
    <h3 className="font-bold text-gray-900">${escapeJSX(bi.title ?? "")}</h3>
    ${bi.description ? `<p className="text-sm text-gray-600 mt-2">${escapeJSX(bi.description)}</p>` : ""}
  </div>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
${bentoHtml.join("\n")}
  </div>
</section>`;
    }

    case "testimonials":
    case "testimonial": {
      const tItems = Array.isArray(p.testimonials)
        ? (p.testimonials as Array<{ quote: string; author: string; role?: string; avatar?: string }>)
        : [
            { quote: String(p.quote ?? el.content ?? "Amazing product, highly recommend!"), author: String(p.author ?? "John Doe"), role: String(p.role ?? "CEO") },
          ];
      const tHtml = tItems.map((t) => `  <div className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
    <p className="text-gray-700 leading-relaxed mb-6 italic">&ldquo;${escapeJSX(t.quote ?? "")}&rdquo;</p>
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-sm">${escapeJSX((t.author ?? "?").charAt(0).toUpperCase())}</div>
      <div><p className="font-semibold text-gray-900 text-sm">${escapeJSX(t.author ?? "")}</p>${t.role ? `<p className="text-xs text-gray-500">${escapeJSX(t.role)}</p>` : ""}</div>
    </div>
  </div>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${tHtml.join("\n")}
  </div>
</section>`;
    }

    case "pricing": {
      const plans = Array.isArray(p.plans)
        ? (p.plans as Array<{ name: string; price: string; features: string[]; highlighted?: boolean; cta?: string }>)
        : [
            { name: "Free", price: "$0", features: ["5 projects", "1GB storage", "Community support"], cta: "Get Started" },
            { name: "Pro", price: "$19/mo", features: ["Unlimited projects", "50GB storage", "Priority support"], highlighted: true, cta: "Start Free Trial" },
            { name: "Enterprise", price: "Custom", features: ["Everything in Pro", "Custom integrations", "Dedicated support"], cta: "Contact Us" },
          ];
      const plansHtml = plans.map((plan) => {
        const feats = Array.isArray(plan.features) ? plan.features : [];
        return `  <div className="${plan.highlighted ? "relative p-8 rounded-2xl bg-indigo-600 text-white shadow-2xl scale-105" : "p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"}">
    ${plan.highlighted ? '<div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full uppercase tracking-wider">Most Popular</div>' : ""}
    <h3 className="text-xl font-bold mb-2">${escapeJSX(plan.name ?? "")}</h3>
    <p className="text-3xl font-extrabold mb-6">${escapeJSX(plan.price ?? "")}</p>
    <ul className="space-y-3 mb-8">
      ${feats.map((f) => `<li className="flex items-center gap-2 text-sm"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ${plan.highlighted ? "text-indigo-200" : "text-green-500"} shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>${escapeJSX(f)}</li>`).join("\n      ")}
    </ul>
    <a href="#" className="${plan.highlighted ? "block text-center px-6 py-3 rounded-xl bg-white text-indigo-600 font-semibold text-sm hover:opacity-90 transition" : "block text-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition"}">${escapeJSX(plan.cta ?? "Get Started")}</a>
  </div>`;
      });
      return `<section${styleAttr} className="w-full py-20 px-8 bg-white">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
${plansHtml.join("\n")}
  </div>
</section>`;
    }

    case "pricing-card": {
      const planFeats = Array.isArray(p.features) ? (p.features as string[]) : [];
      return `<div${styleAttr} className="p-8 rounded-2xl bg-white border border-gray-100 shadow-sm">
  <h3 className="text-xl font-bold text-gray-900 mb-2">${escapeJSX(String(p.name ?? "Plan"))}</h3>
  <p className="text-3xl font-extrabold text-indigo-600 mb-6">${escapeJSX(String(p.price ?? "$0/mo"))}</p>
  <ul className="space-y-2 mb-6">
${planFeats.map((f) => `    <li className="flex items-center gap-2 text-sm text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>${escapeJSX(f)}</li>`).join("\n")}
  </ul>
  <a href="${escapeJSX(String(p.href ?? "#"))}" className="block text-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition">${escapeJSX(String(p.cta ?? "Get Started"))}</a>
</div>`;
    }

    case "stats": {
      const statItems = Array.isArray(p.stats)
        ? (p.stats as Array<{ value: string; label: string }>)
        : [
            { value: "10K+", label: "Happy customers" },
            { value: "99.9%", label: "Uptime SLA" },
            { value: "50ms", label: "Avg response time" },
          ];
      const statsHtml = statItems.map((st) => `  <div className="text-center">
    <p className="text-5xl font-extrabold text-indigo-600 mb-2">${escapeJSX(st.value ?? "0")}</p>
    <p className="text-sm text-gray-600">${escapeJSX(st.label ?? "")}</p>
  </div>`);
      return `<section${styleAttr} className="w-full py-16 px-8 bg-white">
  <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
${statsHtml.join("\n")}
  </div>
</section>`;
    }

    case "logos": {
      const logoList = Array.isArray(p.logos)
        ? (p.logos as Array<{ src: string; alt?: string }>)
        : [];
      const logosHtml = logoList.length > 0
        ? logoList.map((l) => `  <img src="${escapeJSX(l.src ?? "")}" alt="${escapeJSX(l.alt ?? "")}" className="h-8 object-contain grayscale hover:grayscale-0 transition opacity-60 hover:opacity-100" />`).join("\n")
        : `  <p className="text-sm text-gray-400 col-span-full text-center">Logo strip</p>`;
      return `<section${styleAttr} className="w-full py-12 px-8 bg-gray-50">
  <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-10">
${logosHtml}
  </div>
</section>`;
    }

    case "faq": {
      const faqItems = Array.isArray(p.items)
        ? (p.items as Array<{ question: string; answer: string }>)
        : [{ question: "How does it work?", answer: "It's simple and intuitive." }];
      const faqHtml = faqItems.map((item) => `<details className="border-b border-gray-200 py-5">
  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors select-none">${escapeJSX(item.question ?? "")}</summary>
  <p className="mt-3 text-gray-600 text-sm leading-relaxed">${escapeJSX(item.answer ?? "")}</p>
</details>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-white">
  <div className="max-w-3xl mx-auto">
    <div className="divide-y divide-gray-100">
${faqHtml.join("\n")}
    </div>
  </div>
</section>`;
    }

    case "team": {
      const teamMembers = Array.isArray(p.members)
        ? (p.members as Array<{ name: string; role: string; avatar?: string }>)
        : [{ name: "Alex Smith", role: "CEO & Co-founder" }];
      const membersHtml = teamMembers.map((m) => `  <div className="text-center">
    <div className="w-24 h-24 rounded-full bg-indigo-100 mx-auto mb-4 overflow-hidden flex items-center justify-center text-3xl font-bold text-indigo-600">${m.avatar ? `<img src="${escapeJSX(m.avatar)}" alt="${escapeJSX(m.name ?? "")}" className="w-full h-full object-cover" />` : escapeJSX((m.name ?? "?").charAt(0).toUpperCase())}</div>
    <p className="font-semibold text-gray-900">${escapeJSX(m.name ?? "")}</p>
    <p className="text-sm text-gray-500">${escapeJSX(m.role ?? "")}</p>
  </div>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
${membersHtml.join("\n")}
  </div>
</section>`;
    }

    case "team-member": {
      const tmSrc = String(p.avatar ?? p.image ?? "");
      return `<div${styleAttr} className="text-center">
  ${tmSrc ? `<img src="${escapeJSX(tmSrc)}" alt="${escapeJSX(String(p.name ?? ""))}" className="w-24 h-24 rounded-full object-cover mx-auto mb-4" />` : `<div className="w-24 h-24 rounded-full bg-indigo-100 mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-indigo-600">${escapeJSX((String(p.name ?? "?")).charAt(0).toUpperCase())}</div>`}
  <p className="font-semibold text-gray-900">${escapeJSX(String(p.name ?? "Team Member"))}</p>
  <p className="text-sm text-gray-500">${escapeJSX(String(p.role ?? p.title ?? ""))}</p>
</div>`;
    }

    case "timeline": {
      const tlItems = Array.isArray(p.items)
        ? (p.items as Array<{ year?: string; title: string; description?: string }>)
        : [{ year: "2024", title: "Company founded", description: "Started with a mission to change the world." }];
      const tlHtml = tlItems.map((item) => `  <div className="relative pl-8 pb-8 border-l-2 border-indigo-200 last:border-0">
    <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-indigo-600 border-2 border-white"></div>
    ${item.year ? `<p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">${escapeJSX(item.year)}</p>` : ""}
    <h3 className="font-bold text-gray-900 mb-1">${escapeJSX(item.title ?? "")}</h3>
    ${item.description ? `<p className="text-sm text-gray-600">${escapeJSX(item.description)}</p>` : ""}
  </div>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-white">
  <div className="max-w-2xl mx-auto">
${tlHtml.join("\n")}
  </div>
</section>`;
    }

    case "how-it-works": {
      const howSteps = Array.isArray(p.steps)
        ? (p.steps as Array<{ title: string; description: string }>)
        : [
            { title: "Sign Up", description: "Create your free account in seconds." },
            { title: "Customize", description: "Build your site with our visual editor." },
            { title: "Publish", description: "Go live with one click." },
          ];
      const howHtml = howSteps.map((st, i) => `  <div className="text-center space-y-3">
    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto">${i + 1}</div>
    <h3 className="font-bold text-gray-900">${escapeJSX(st.title ?? "")}</h3>
    <p className="text-sm text-gray-600">${escapeJSX(st.description ?? "")}</p>
  </div>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-gray-50">
  <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
${howHtml.join("\n")}
  </div>
</section>`;
    }

    case "cta":
    case "cta-banner": {
      const ctaTitle = String(p.title ?? el.content ?? "Ready to get started?");
      const ctaSub = String(p.subtitle ?? p.description ?? "Join thousands of satisfied customers.");
      const ctaBtn = String(p.cta ?? p.buttonText ?? "Get Started Free");
      const ctaHref = String(p.href ?? p.buttonHref ?? "#");
      return `<section${styleAttr} className="w-full py-20 px-8 bg-indigo-600 text-white text-center">
  <div className="max-w-3xl mx-auto space-y-6">
    <h2 className="text-4xl font-extrabold">${escapeJSX(ctaTitle)}</h2>
    <p className="text-lg text-indigo-100">${escapeJSX(ctaSub)}</p>
    <a href="${escapeJSX(ctaHref)}" className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:opacity-90 transition">${escapeJSX(ctaBtn)}</a>
  </div>
</section>`;
    }

    case "newsletter": {
      const nlTitle = String(p.title ?? "Stay in the loop");
      const nlDesc = String(p.description ?? "Get the latest news and updates delivered to your inbox.");
      const nlPlaceholder = String(p.placeholder ?? "Enter your email");
      const nlBtn = String(p.buttonText ?? "Subscribe");
      return `<section${styleAttr} className="w-full py-16 px-8 bg-gray-50">
  <div className="max-w-xl mx-auto text-center space-y-4">
    <h2 className="text-2xl font-bold text-gray-900">${escapeJSX(nlTitle)}</h2>
    <p className="text-gray-600">${escapeJSX(nlDesc)}</p>
    <form className="flex gap-3">
      <input type="email" placeholder="${escapeJSX(nlPlaceholder)}" className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
      <button type="submit" className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition whitespace-nowrap">${escapeJSX(nlBtn)}</button>
    </form>
  </div>
</section>`;
    }

    case "blog-grid": {
      const blogPosts = Array.isArray(p.posts)
        ? (p.posts as Array<{ title: string; excerpt?: string; image?: string; date?: string; author?: string; href?: string }>)
        : [
            { title: "Getting Started", excerpt: "Learn the basics and get up and running quickly.", date: "Jan 1, 2025" },
            { title: "Advanced Tips", excerpt: "Take your skills to the next level.", date: "Jan 15, 2025" },
            { title: "Best Practices", excerpt: "Industry best practices and recommendations.", date: "Feb 1, 2025" },
          ];
      const postsHtml = blogPosts.map((post) => `  <article className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
    ${post.image ? `<img src="${escapeJSX(post.image)}" alt="${escapeJSX(post.title ?? "")}" className="w-full h-48 object-cover" />` : `<div className="w-full h-48 bg-indigo-50 flex items-center justify-center"><span className="text-indigo-300 text-sm">Post image</span></div>`}
    <div className="p-6">
      ${post.date ? `<p className="text-xs text-gray-400 mb-2">${escapeJSX(post.date)}</p>` : ""}
      <h3 className="font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors"><a href="${escapeJSX(post.href ?? "#")}">${escapeJSX(post.title ?? "")}</a></h3>
      ${post.excerpt ? `<p className="text-sm text-gray-600 leading-relaxed">${escapeJSX(post.excerpt)}</p>` : ""}
    </div>
  </article>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
${postsHtml.join("\n")}
  </div>
</section>`;
    }

    case "blog-card": {
      const bcImg = String(p.image ?? "");
      return `<article${styleAttr} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
  ${bcImg ? `<img src="${escapeJSX(bcImg)}" alt="${escapeJSX(String(p.title ?? ""))}" className="w-full h-48 object-cover" />` : `<div className="w-full h-48 bg-indigo-50" />`}
  <div className="p-6">
    ${p.date ? `<p className="text-xs text-gray-400 mb-2">${escapeJSX(String(p.date))}</p>` : ""}
    <h3 className="font-bold text-gray-900 mb-2">${escapeJSX(String(p.title ?? "Post Title"))}</h3>
    ${p.excerpt ? `<p className="text-sm text-gray-600">${escapeJSX(String(p.excerpt))}</p>` : ""}
  </div>
</article>`;
    }

    case "portfolio-grid": {
      const portItems = Array.isArray(p.items)
        ? (p.items as Array<{ title: string; image?: string; category?: string; href?: string }>)
        : [{ title: "Project Alpha" }, { title: "Project Beta" }, { title: "Project Gamma" }];
      const portHtml = portItems.map((item) => `  <div className="group relative overflow-hidden rounded-2xl aspect-square">
    ${item.image ? `<img src="${escapeJSX(item.image)}" alt="${escapeJSX(item.title ?? "")}" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />` : `<div className="w-full h-full bg-indigo-100" />`}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
      <div><p className="font-bold text-white">${escapeJSX(item.title ?? "")}</p>${item.category ? `<p className="text-xs text-white/70">${escapeJSX(item.category)}</p>` : ""}</div>
    </div>
  </div>`);
      return `<section${styleAttr} className="w-full py-20 px-8 bg-white">
  <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
${portHtml.join("\n")}
  </div>
</section>`;
    }

    case "portfolio-item": {
      const piImg = String(p.image ?? "");
      return `<div${styleAttr} className="group relative overflow-hidden rounded-2xl aspect-square">
  ${piImg ? `<img src="${escapeJSX(piImg)}" alt="${escapeJSX(String(p.title ?? ""))}" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />` : `<div className="w-full h-full bg-indigo-100" />`}
  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
    <p className="font-bold text-white">${escapeJSX(String(p.title ?? "Project"))}</p>
  </div>
</div>`;
    }

    case "comparison":
    case "comparison-table": {
      const rows = Array.isArray(p.rows)
        ? (p.rows as Array<{ feature: string; a: string | boolean; b: string | boolean }>)
        : [{ feature: "Feature A", a: true, b: false }];
      const thead = `<thead><tr className="text-left text-sm font-semibold text-gray-900 border-b border-gray-200"><th className="py-3 pr-8">Feature</th><th className="py-3 pr-8">${escapeJSX(String(p.columnA ?? "Basic"))}</th><th className="py-3">${escapeJSX(String(p.columnB ?? "Pro"))}</th></tr></thead>`;
      const tbody = `<tbody>${rows.map((r) => `<tr className="border-b border-gray-100 text-sm"><td className="py-3 pr-8 text-gray-700">${escapeJSX(r.feature ?? "")}</td><td className="py-3 pr-8">${r.a === true ? "✅" : r.a === false ? "❌" : escapeJSX(String(r.a ?? ""))}</td><td className="py-3">${r.b === true ? "✅" : r.b === false ? "❌" : escapeJSX(String(r.b ?? ""))}</td></tr>`).join("")}</tbody>`;
      return `<div${styleAttr} className="w-full overflow-x-auto rounded-2xl border border-gray-100 shadow-sm"><table className="w-full bg-white"><caption className="sr-only">Comparison table</caption>${thead}${tbody}</table></div>`;
    }

    case "before-after": {
      const baLabel1 = String(p.beforeLabel ?? "Before");
      const baLabel2 = String(p.afterLabel ?? "After");
      const baImg1 = String(p.before ?? p.beforeImage ?? "");
      const baImg2 = String(p.after ?? p.afterImage ?? "");
      return `<div${styleAttr} className="grid grid-cols-2 gap-4 rounded-2xl overflow-hidden">
  <div>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">${escapeJSX(baLabel1)}</p>
    ${baImg1 ? `<img src="${escapeJSX(baImg1)}" alt="Before" className="w-full rounded-xl object-cover" />` : `<div className="w-full aspect-video bg-gray-100 rounded-xl" />`}
  </div>
  <div>
    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">${escapeJSX(baLabel2)}</p>
    ${baImg2 ? `<img src="${escapeJSX(baImg2)}" alt="After" className="w-full rounded-xl object-cover" />` : `<div className="w-full aspect-video bg-indigo-50 rounded-xl" />`}
  </div>
</div>`;
    }

    case "metric-card": {
      const change = String(p.change ?? "");
      const isPos = change.startsWith("+") || (Number(change) > 0);
      return `<div${styleAttr} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm">
  <p className="text-sm text-gray-500 mb-1">${escapeJSX(String(p.label ?? "Metric"))}</p>
  <p className="text-3xl font-extrabold text-gray-900">${escapeJSX(String(p.value ?? "0"))}</p>
  ${change ? `<p className="text-xs mt-2 ${isPos ? "text-green-600" : "text-red-500"}">${escapeJSX(change)}</p>` : ""}
</div>`;
    }

    case "announcement":
    case "nav-announcement": {
      return `<div${styleAttr} className="w-full bg-indigo-600 text-white text-center py-2 px-4 text-sm font-medium">
  ${content || escapeJSX(String(p.text ?? "🎉 New feature available — Learn more"))}
</div>`;
    }

    case "cookie-banner":
      return `<div${styleAttr} className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 z-50">
  <p className="text-sm text-gray-300">${content || "We use cookies to improve your experience."}</p>
  <div className="flex gap-3 shrink-0">
    <button className="px-4 py-2 text-sm text-gray-300 hover:text-white transition">Decline</button>
    <button className="px-4 py-2 text-sm font-semibold bg-indigo-600 rounded-lg hover:opacity-90 transition">Accept All</button>
  </div>
</div>`;

    // ── Cards ────────────────────────────────────────────────────────────────
    case "card":
    case "profile-card": {
      const cardImg = String(p.image ?? p.avatar ?? "");
      return `<div${styleAttr} className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
  ${cardImg ? `<img src="${escapeJSX(cardImg)}" alt="" className="w-full h-48 object-cover rounded-xl mb-4" />` : ""}
  ${p.title ?? p.name ? `<h3 className="font-bold text-gray-900 mb-2">${escapeJSX(String(p.title ?? p.name ?? ""))}</h3>` : ""}
  ${p.description ?? p.bio ? `<p className="text-sm text-gray-600">${escapeJSX(String(p.description ?? p.bio ?? ""))}</p>` : ""}
  ${childrenCode}
  ${!p.title && !p.description && !cardImg && !childrenCode ? `<p className="text-sm text-gray-600">${content || "Card content"}</p>` : ""}
</div>`;
    }

    // ── E-Commerce ───────────────────────────────────────────────────────────
    case "product-card": {
      const pcImg = String(p.image ?? "");
      return `<div${styleAttr} className="rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
  ${pcImg ? `<img src="${escapeJSX(pcImg)}" alt="${escapeJSX(String(p.name ?? ""))}" className="w-full h-56 object-cover" />` : `<div className="w-full h-56 bg-gray-50 flex items-center justify-center"><span className="text-gray-300 text-sm">Product image</span></div>`}
  <div className="p-5">
    <h3 className="font-bold text-gray-900 mb-1">${escapeJSX(String(p.name ?? p.title ?? "Product Name"))}</h3>
    ${p.description ? `<p className="text-sm text-gray-600 mb-3">${escapeJSX(String(p.description))}</p>` : ""}
    <div className="flex items-center justify-between">
      <p className="text-xl font-extrabold text-indigo-600">${escapeJSX(String(p.price ?? "$0.00"))}</p>
      <button className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:opacity-90 transition">Add to Cart</button>
    </div>
  </div>
</div>`;
    }

    case "price-display":
      return `<div${styleAttr} className="flex items-baseline gap-2">
  ${p.originalPrice ? `<span className="text-lg text-gray-400 line-through">${escapeJSX(String(p.originalPrice))}</span>` : ""}
  <span className="text-4xl font-extrabold text-gray-900">${escapeJSX(String(p.price ?? "$0.00"))}</span>
  ${p.period ? `<span className="text-sm text-gray-500">${escapeJSX(String(p.period))}</span>` : ""}
</div>`;

    case "add-to-cart":
      return `<button${styleAttr} className="w-full px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition flex items-center justify-center gap-2">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
  ${content || "Add to Cart"}
</button>`;

    case "product-gallery": {
      const pgImgs = Array.isArray(p.images) ? (p.images as string[]) : [];
      return `<div${styleAttr} className="flex flex-col gap-4">
  <div className="w-full aspect-square rounded-2xl bg-gray-100 overflow-hidden">
    ${pgImgs[0] ? `<img src="${escapeJSX(pgImgs[0])}" alt="Product" className="w-full h-full object-cover" />` : `<div className="w-full h-full flex items-center justify-center text-gray-400">Main Image</div>`}
  </div>
  ${pgImgs.length > 1 ? `<div className="flex gap-3">${pgImgs.slice(1).map((src) => `<img src="${escapeJSX(src)}" alt="" className="w-20 h-20 rounded-xl object-cover cursor-pointer border-2 border-transparent hover:border-indigo-400" />`).join("")}</div>` : ""}
</div>`;
    }

    case "wishlist-btn":
      return `<button${styleAttr} className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition" aria-label="Add to wishlist">
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
</button>`;

    case "stock-indicator": {
      const inStock = p.inStock !== false;
      const qty = Number(p.quantity ?? 0);
      const isLow = qty > 0 && qty <= 5;
      return `<div${styleAttr} className="flex items-center gap-2">
  <div className="w-2 h-2 rounded-full ${inStock ? (isLow ? "bg-yellow-400" : "bg-green-500") : "bg-red-500"}"></div>
  <span className="text-sm text-gray-600">${inStock ? (isLow ? `Only ${qty} left` : "In Stock") : "Out of Stock"}</span>
</div>`;
    }

    case "coupon-code": {
      const code = String(p.code ?? "SAVE10");
      return `<div${styleAttr} className="flex items-center gap-3 p-4 rounded-xl bg-indigo-50 border border-indigo-200">
  <code className="font-mono font-bold text-indigo-700 flex-1">${escapeJSX(code)}</code>
  <button className="text-xs text-indigo-600 font-semibold hover:underline">Copy</button>
</div>`;
    }

    case "product-reviews": {
      const avgRating = Number(p.rating ?? 4.5);
      const reviewCount = Number(p.count ?? 0);
      return `<div${styleAttr} className="flex items-center gap-3">
  <div className="flex text-yellow-400 text-lg">${"★".repeat(Math.round(avgRating))}${"☆".repeat(5 - Math.round(avgRating))}</div>
  <span className="font-bold text-gray-900">${avgRating}</span>
  ${reviewCount ? `<span className="text-sm text-gray-500">(${reviewCount} reviews)</span>` : ""}
</div>`;
    }

    case "product-grid": {
      const pgCols = Number(p.columns ?? 3);
      return `<div${styleAttr} className="grid grid-cols-1 md:grid-cols-${pgCols} gap-6">
${childrenCode || `  <div className="rounded-2xl bg-white border border-gray-100 p-4 text-center text-sm text-gray-400">Product</div>`.repeat(pgCols)}
</div>`;
    }

    // ── Advanced ─────────────────────────────────────────────────────────────
    case "chart":
      return `<div${styleAttr} className="w-full aspect-video rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
  <p className="text-gray-400 text-sm">{/* Chart: add Recharts or similar */}</p>
</div>`;

    case "data-table": {
      const cols = Array.isArray(p.columns) ? (p.columns as string[]) : ["Column A", "Column B", "Column C"];
      const dtRows = Array.isArray(p.data) ? (p.data as string[][]) : [["—", "—", "—"]];
      const thead2 = `<thead className="bg-gray-50"><tr>${cols.map((c) => `<th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">${escapeJSX(c)}</th>`).join("")}</tr></thead>`;
      const tbody2 = `<tbody className="divide-y divide-gray-100">${dtRows.map((row) => `<tr className="hover:bg-gray-50">${row.map((cell) => `<td className="px-4 py-3 text-sm text-gray-700">${escapeJSX(cell)}</td>`).join("")}</tr>`).join("")}</tbody>`;
      return `<div${styleAttr} className="w-full overflow-x-auto rounded-2xl border border-gray-100 shadow-sm"><table className="w-full bg-white"><caption className="sr-only">Data table</caption>${thead2}${tbody2}</table></div>`;
    }

    case "map":
      return `<div${styleAttr} className="w-full aspect-video rounded-2xl bg-indigo-50 flex items-center justify-center border border-indigo-100">
  <p className="text-indigo-400 text-sm">{/* Map embed — add your provider here */}</p>
</div>`;

    case "countdown": {
      return `<div${styleAttr} className="flex items-center gap-4">
  {["Days","Hours","Min","Sec"].map((unit, i) => (
    <div key={unit} className="text-center">
      <div className="text-4xl font-extrabold text-gray-900 tabular-nums">00</div>
      <div className="text-xs text-gray-500 uppercase tracking-wider">{unit}</div>
    </div>
  ))}
</div>`;
    }

    case "progress": {
      const pVal = Number(p.value ?? 75);
      const pMax = Number(p.max ?? 100);
      const pPct = Math.round((pVal / pMax) * 100);
      return `<div${styleAttr} className="flex flex-col gap-1.5">
  ${p.label ? `<div className="flex justify-between text-sm"><span className="text-gray-700">${escapeJSX(String(p.label))}</span><span className="font-semibold text-gray-900">${pPct}%</span></div>` : ""}
  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
    <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: "${pPct}%" }}></div>
  </div>
</div>`;
    }

    case "carousel":
      return `<div${styleAttr} className="relative w-full overflow-hidden rounded-2xl">
  <div className="flex gap-4">
${childrenCode || "    <div className=\"min-w-full bg-gray-100 aspect-video rounded-2xl flex items-center justify-center text-gray-400\">Slide 1</div>"}
  </div>
  <button className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">←</button>
  <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow flex items-center justify-center">→</button>
</div>`;

    case "modal":
      return `{/* Modal — ${el.type} is interactive and not rendered statically */}`;

    case "tooltip":
      return `<span${styleAttr} className="relative group inline-block">
  ${childrenCode || `<span className="underline decoration-dashed text-gray-700">${content || "Hover me"}</span>`}
  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs rounded-lg bg-gray-900 text-white whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
    ${escapeJSX(String(p.content ?? p.tooltip ?? "Tooltip text"))}
  </span>
</span>`;

    case "social-links": {
      const socialNetworks = Array.isArray(p.links)
        ? (p.links as Array<{ platform: string; url: string }>)
        : [{ platform: "Twitter", url: "#" }, { platform: "GitHub", url: "#" }];
      return `<div${styleAttr} className="flex items-center gap-3">
${socialNetworks.map((sn) => `  <a href="${escapeJSX(sn.url ?? "#")}" className="text-gray-400 hover:text-gray-700 transition-colors" aria-label="${escapeJSX(sn.platform ?? "Social")}">${escapeJSX(sn.platform ?? "")}</a>`).join("\n")}
</div>`;
    }

    case "share-buttons":
      return `<div${styleAttr} className="flex items-center gap-2">
  <span className="text-sm text-gray-500 mr-2">Share:</span>
  <button className="px-3 py-1.5 text-xs rounded-lg bg-blue-500 text-white hover:opacity-90 transition">Twitter</button>
  <button className="px-3 py-1.5 text-xs rounded-lg bg-blue-700 text-white hover:opacity-90 transition">Facebook</button>
  <button className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 text-white hover:opacity-90 transition">LinkedIn</button>
</div>`;

    case "banner":
      return `<div${styleAttr} className="w-full py-4 px-8 bg-indigo-50 border border-indigo-100 text-indigo-800 text-sm text-center font-medium rounded-xl">
  ${content || escapeJSX(String(p.text ?? "Banner message"))}
</div>`;

    case "divider":
      return `<hr${styleAttr} className="border-gray-200 my-8" />`;

    case "spacer":
      return `<div style={{ height: "${escapeJSX(String(p?.height ?? "48px"))}" }} />`;

    default:
      // Generic fallback — render children if any, otherwise a placeholder comment
      if (childrenCode) {
        return `<div${styleAttr} className="w-full py-16 px-8">
${childrenCode}
</div>`;
      }
      return `{/* ${el.type} section */}`;
  }
}

// ─── Page component (Page.tsx) ────────────────────────────────────────────────

function generatePageComponent(): string {
  return `"use client";
import React from "react";
import type { CanvasElement } from "@/lib/types";

function renderElement(element: CanvasElement): React.ReactNode {
  if (element.isHidden) return null;

  const s = element.styles && Object.keys(element.styles).length > 0
    ? element.styles as React.CSSProperties
    : undefined;
  const p = element.props ?? {};
  const children = (element.children ?? [])
    .filter(c => !c.isHidden)
    .sort((a, b) => a.order - b.order);
  const content = element.content ?? "";

  const renderChildren = (els?: CanvasElement[]) =>
    (els ?? []).filter(c => !c.isHidden).sort((a, b) => a.order - b.order).map(c => (
      <React.Fragment key={c.id}>{renderElement(c)}</React.Fragment>
    ));

  switch (element.type) {
    case "section":
      return <section style={s} className="w-full py-16 px-8 bg-white">{renderChildren(children)}</section>;
    case "container":
      return <div style={s} className="max-w-7xl mx-auto px-8">{renderChildren(children)}</div>;
    case "two-col":
      return (
        <div style={s} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
          <div className="flex-1">{renderChildren(children[0]?.children)}</div>
          <div className="flex-1">{renderChildren(children[1]?.children)}</div>
        </div>
      );
    case "three-col":
      return (
        <div style={s} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
          <div className="flex-1">{renderChildren(children[0]?.children)}</div>
          <div className="flex-1">{renderChildren(children[1]?.children)}</div>
          <div className="flex-1">{renderChildren(children[2]?.children)}</div>
        </div>
      );
    case "four-col":
      return (
        <div style={s} className="flex gap-6 max-w-7xl mx-auto px-8 py-16">
          <div className="flex-1">{renderChildren(children[0]?.children)}</div>
          <div className="flex-1">{renderChildren(children[1]?.children)}</div>
          <div className="flex-1">{renderChildren(children[2]?.children)}</div>
          <div className="flex-1">{renderChildren(children[3]?.children)}</div>
        </div>
      );
    case "sidebar-left":
      return (
        <div style={s} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
          <aside className="w-64 shrink-0">{renderChildren(children[0]?.children)}</aside>
          <div className="flex-1">{renderChildren(children[1]?.children)}</div>
        </div>
      );
    case "sidebar-right":
      return (
        <div style={s} className="flex gap-8 max-w-7xl mx-auto px-8 py-16">
          <div className="flex-1">{renderChildren(children[0]?.children)}</div>
          <aside className="w-64 shrink-0">{renderChildren(children[1]?.children)}</aside>
        </div>
      );
    case "flex-row":
      return <div style={s} className="flex flex-row flex-wrap gap-4 items-center">{renderChildren(children)}</div>;
    case "flex-col":
      return <div style={s} className="flex flex-col gap-4">{renderChildren(children)}</div>;
    case "grid":
      return <div style={s} className="grid gap-4">{renderChildren(children)}</div>;
    case "columns":
      return <div style={s} className="flex flex-wrap gap-4">{renderChildren(children)}</div>;

    case "heading": {
      const level = Number(p.level ?? 1);
      const Tag = (\`h\${Math.min(Math.max(level, 1), 6)}\`) as keyof JSX.IntrinsicElements;
      const sizes: Record<number, string> = { 1: "text-5xl font-extrabold", 2: "text-4xl font-bold", 3: "text-3xl font-bold", 4: "text-2xl font-semibold", 5: "text-xl font-semibold", 6: "text-lg font-semibold" };
      return <Tag style={s} className={\`\${sizes[level] ?? "text-5xl font-extrabold"} text-gray-900 leading-tight\`}>{content || "Heading"}</Tag>;
    }
    case "paragraph":
      return <p style={s} className="text-base text-gray-600 leading-relaxed">{content}</p>;
    case "rich-text":
      return <div style={s} className="prose prose-gray max-w-none" dangerouslySetInnerHTML={{ __html: content }} />;
    case "blockquote":
      return <blockquote style={s} className="border-l-4 border-indigo-300 pl-4 italic text-gray-600 my-4">{content}</blockquote>;
    case "code-block":
    case "code":
      return <pre style={s} className="bg-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto text-sm font-mono"><code>{content}</code></pre>;
    case "badge":
      return <span style={s} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">{content || "Badge"}</span>;
    case "eyebrow":
      return <p style={s} className="text-xs font-semibold uppercase tracking-widest text-indigo-600">{content}</p>;
    case "text-link":
      return <a href={String(p.href ?? "#")} style={s} className="text-indigo-600 underline underline-offset-2 hover:opacity-80 transition">{content || "Link"}</a>;

    case "image":
      return <img src={String(p.src ?? "")} alt={String(p.alt ?? "")} style={s} className="rounded-2xl object-cover w-full" />;
    case "video":
    case "video-embed": {
      const src = String(p.src ?? p.url ?? "");
      return src
        ? <div style={s} className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-900"><iframe src={src} className="w-full h-full" frameBorder={0} allowFullScreen /></div>
        : <div style={s} className="w-full aspect-video bg-gray-900 rounded-2xl flex items-center justify-center"><span className="text-white/60 text-sm">Video embed</span></div>;
    }
    case "audio":
      return <audio style={s} controls className="w-full" src={String(p.src ?? "")} />;

    case "divider":
      return <hr style={s} className="border-gray-200 my-8" />;
    case "spacer":
      return <div style={{ height: String(p.height ?? "48px") }} />;

    case "button": {
      const variant = String(p.variant ?? "primary");
      const btnCls = variant === "outline"
        ? "inline-flex items-center px-6 py-3 rounded-xl border-2 border-indigo-600 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
        : variant === "ghost"
        ? "inline-flex items-center px-6 py-3 rounded-xl text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition"
        : "inline-flex items-center px-6 py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:opacity-90 transition";
      return <a href={String(p.href ?? "#")} style={s} className={btnCls}>{content || "Button"}</a>;
    }

    case "navbar": {
      const links = Array.isArray(p.links) ? p.links as { label: string; href: string }[] : [];
      return (
        <nav style={s} className="w-full sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <a href="/" className="text-lg font-bold text-gray-900">{String(p.brand ?? p.siteName ?? "Brand")}</a>
            <div className="hidden md:flex items-center gap-8">
              {links.length > 0 ? links.map((l, i) => <a key={i} href={l.href ?? "#"} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">{l.label}</a>) : <a href="#" className="text-sm text-gray-600">Home</a>}
            </div>
          </div>
        </nav>
      );
    }

    case "footer": {
      return (
        <footer style={s} className="w-full bg-gray-900 text-gray-400 py-12 px-8">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm font-semibold text-white">{String(p.brand ?? p.siteName ?? "Brand")}</p>
            <p className="text-xs">{String(p.copyright ?? \`© \${new Date().getFullYear()} All rights reserved.\`)}</p>
          </div>
        </footer>
      );
    }

    case "hero":
    case "hero-split": {
      const title = String(p.title ?? content ?? "Build Something Amazing");
      const sub = String(p.subtitle ?? p.description ?? "Start creating today.");
      const cta = String(p.cta ?? p.ctaText ?? "Get Started");
      const href = String(p.ctaHref ?? p.ctaUrl ?? "#");
      const img = String(p.image ?? p.backgroundImage ?? "");
      if (element.type === "hero-split") {
        return (
          <section style={s} className="w-full py-20 px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-12">
              <div className="flex-1 space-y-6">
                <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">{title}</h1>
                <p className="text-xl text-gray-600 leading-relaxed">{sub}</p>
                <a href={href} className="inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90 transition">{cta}</a>
              </div>
              <div className="flex-1">
                {img ? <img src={img} alt="Hero" className="w-full rounded-2xl object-cover shadow-2xl" /> : <div className="w-full aspect-video rounded-2xl bg-indigo-100 flex items-center justify-center"><span className="text-indigo-400">Hero Image</span></div>}
              </div>
            </div>
          </section>
        );
      }
      return (
        <section style={s} className="w-full py-24 px-8 bg-gradient-to-br from-indigo-50 via-white to-purple-50 text-center">
          <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-6xl font-extrabold text-gray-900 leading-tight">{title}</h1>
            <p className="text-xl text-gray-600 leading-relaxed">{sub}</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href={href} className="inline-flex items-center px-8 py-4 rounded-xl bg-indigo-600 text-white font-semibold hover:opacity-90 transition">{cta}</a>
            </div>
          </div>
        </section>
      );
    }

    case "cta":
    case "cta-banner": {
      const ctaTitle = String(p.title ?? content ?? "Ready to get started?");
      const ctaSub = String(p.subtitle ?? p.description ?? "Join thousands of satisfied customers.");
      const ctaBtn = String(p.cta ?? p.buttonText ?? "Get Started Free");
      const ctaHref = String(p.href ?? p.buttonHref ?? "#");
      return (
        <section style={s} className="w-full py-20 px-8 bg-indigo-600 text-white text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <h2 className="text-4xl font-extrabold">{ctaTitle}</h2>
            <p className="text-lg text-indigo-100">{ctaSub}</p>
            <a href={ctaHref} className="inline-flex items-center px-8 py-4 rounded-xl bg-white text-indigo-600 font-bold hover:opacity-90 transition">{ctaBtn}</a>
          </div>
        </section>
      );
    }

    default:
      if (children.length > 0) {
        return <div style={s} className="w-full py-16 px-8">{renderChildren(children)}</div>;
      }
      return null;
  }
}

export default function Page({ elements }: { elements: CanvasElement[] }) {
  const sorted = [...elements]
    .filter(el => !el.isHidden)
    .sort((a, b) => a.order - b.order);
  return (
    <div className="min-h-screen bg-white">
      {sorted.map(el => (
        <React.Fragment key={el.id}>{renderElement(el)}</React.Fragment>
      ))}
    </div>
  );
}
`;
}

// ─── Types file for generated project ────────────────────────────────────────

function generateTypesFile(): string {
  return `export interface CanvasElement {
  id: string;
  type: string;
  content?: string;
  order: number;
  styles?: Record<string, unknown>;
  props?: Record<string, unknown>;
  children?: CanvasElement[];
  isHidden?: boolean;
  name?: string;
}
`;
}

// ─── Static files ─────────────────────────────────────────────────────────────

function generatePackageJson(siteName: string): string {
  const name = siteName
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "") || "my-site";
  return JSON.stringify(
    {
      name,
      version: "0.1.0",
      private: true,
      scripts: {
        dev: "next dev",
        build: "next build",
        start: "next start",
        lint: "next lint",
      },
      dependencies: {
        next: "14.2.29",
        react: "^18",
        "react-dom": "^18",
        tailwindcss: "^3.4.0",
        clsx: "^2.1.0",
        "tailwind-merge": "^2.2.0",
        "lucide-react": "^0.363.0",
        "@tailwindcss/typography": "^0.5.13",
      },
      devDependencies: {
        typescript: "^5",
        "@types/node": "^20",
        "@types/react": "^18",
        "@types/react-dom": "^18",
        autoprefixer: "^10.0.1",
        postcss: "^8",
        eslint: "^8",
        "eslint-config-next": "14.2.29",
      },
    },
    null,
    2
  );
}

function generateNextConfig(): string {
  return `import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
`;
}

function generateTailwindConfig(): string {
  return `import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [typography],
};

export default config;
`;
}

function generateTsConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "ES2017",
        lib: ["dom", "dom.iterable", "esnext"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "bundler",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [{ name: "next" }],
        paths: {
          "@/*": ["./src/*"],
        },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2
  );
}

function generatePostcssConfig(): string {
  return `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`;
}

function generateGlobalsCss(): string {
  return `@tailwind base;
@tailwind components;
@tailwind utilities;

html {
  scroll-behavior: smooth;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
}

/* Utility helpers */
.container-centered {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

.section-padding {
  @apply py-16 px-8;
}

.text-balance {
  text-wrap: balance;
}

/* Smooth transitions for interactive elements */
* {
  @apply transition-colors duration-150;
}

a, button {
  transition: opacity 0.15s ease, background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
`;
}

function generateRootLayout(siteName: string): string {
  return `import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: ${JSON.stringify(siteName || "My Site")},
  description: "Built with the visual website builder",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
`;
}

// ─── Page file generators ─────────────────────────────────────────────────────

function generateHomePageFile(elements: CanvasElement[]): string {
  const elementsJson = JSON.stringify(elements, null, 2);
  return `import Page from "@/components/site/Page";
import type { CanvasElement } from "@/lib/types";

const elements: CanvasElement[] = ${elementsJson};

export default function HomePage() {
  return <Page elements={elements} />;
}
`;
}

function generateSlugPageFile(slug: string, elements: CanvasElement[], allSlugs: string[]): string {
  const elementsJson = JSON.stringify(elements, null, 2);
  const cleanSlug = slug.replace(/^\//, "");
  const allCleanSlugs = allSlugs.map((s) => s.replace(/^\//, ""));
  return `import Page from "@/components/site/Page";
import type { CanvasElement } from "@/lib/types";
import { notFound } from "next/navigation";

const PAGE_SLUG = ${JSON.stringify(cleanSlug)};

const elements: CanvasElement[] = ${elementsJson};

export function generateStaticParams() {
  return ${JSON.stringify(allCleanSlugs.map((s) => ({ slug: s })))};
}

export default function SlugPage({ params }: { params: { slug: string } }) {
  if (params.slug !== PAGE_SLUG) notFound();
  return <Page elements={elements} />;
}
`;
}

function generateDynamicSlugPage(pages: ExportPage[]): string {
  // For multi-page: generate a single [slug]/page.tsx that handles all pages
  const nonHomePages = pages.filter((p) => !p.isHome);
  const pagesData = nonHomePages.map((p) => ({
    slug: p.slug.replace(/^\//, ""),
    name: p.name,
    elements: p.elements,
  }));

  return `import Page from "@/components/site/Page";
import type { CanvasElement } from "@/lib/types";
import { notFound } from "next/navigation";

interface PageData {
  slug: string;
  name: string;
  elements: CanvasElement[];
}

const PAGES: PageData[] = ${JSON.stringify(pagesData, null, 2)};

export function generateStaticParams() {
  return PAGES.map((page) => ({ slug: page.slug }));
}

export default function SlugPage({ params }: { params: { slug: string } }) {
  const page = PAGES.find((p) => p.slug === params.slug);
  if (!page) notFound();
  return <Page elements={page.elements} />;
}
`;
}

function generateReadme(siteName: string): string {
  return `# ${siteName || "My Site"}

This Next.js project was exported from the visual website builder.

## Getting Started

Install dependencies:

\`\`\`bash
npm install
\`\`\`

Run the development server:

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Build for Production

\`\`\`bash
npm run build
npm start
\`\`\`

## Deploy

Deploy easily to [Vercel](https://vercel.com):

\`\`\`bash
npx vercel
\`\`\`

Or any other Next.js-compatible host.

## Project Structure

\`\`\`
src/
  app/
    layout.tsx       # Root layout with Inter font
    page.tsx         # Home page
    [slug]/
      page.tsx       # Dynamic pages (if multiple pages)
    globals.css      # Tailwind + global styles
  components/
    site/
      Page.tsx       # Page renderer component
  lib/
    types.ts         # CanvasElement type
\`\`\`
`;
}

// ─── Main export function ─────────────────────────────────────────────────────

export function generateNextjsProject(site: ExportSite): Record<string, string> {
  const siteName = site.name || "My Site";
  const pages = site.pages ?? [];
  const backendActions = site.backendActions ?? [];
  const siteRoutes = site.siteRoutes ?? [];

  // Identify home page
  let homePage = pages.find((p) => p.isHome);
  if (!homePage && pages.length > 0) {
    homePage = pages.find((p) => p.slug === "/" || p.slug === "") ?? pages[0];
  }
  const nonHomePages = pages.filter((p) => p !== homePage);

  const files: Record<string, string> = {};

  // ── Config files ───────────────────────────────────────────────────────────
  files["package.json"] = generatePackageJson(siteName);
  files["next.config.ts"] = generateNextConfig();
  files["tailwind.config.ts"] = generateTailwindConfig();
  files["tsconfig.json"] = generateTsConfig();
  files["postcss.config.js"] = generatePostcssConfig();
  files["README.md"] = generateReadme(siteName);

  // ── App files ──────────────────────────────────────────────────────────────
  files["src/app/globals.css"] = generateGlobalsCss();
  files["src/app/layout.tsx"] = generateRootLayout(siteName);

  // ── Home page ──────────────────────────────────────────────────────────────
  const homeElements = homePage?.elements ?? [];
  files["src/app/page.tsx"] = generateHomePageFile(homeElements);

  // ── Non-home pages ─────────────────────────────────────────────────────────
  if (nonHomePages.length === 1) {
    // Single extra page — generate dedicated route
    const p = nonHomePages[0];
    const cleanSlug = p.slug.replace(/^\//, "");
    files[`src/app/${cleanSlug}/page.tsx`] = generateSlugPageFile(
      cleanSlug,
      p.elements,
      [cleanSlug]
    );
  } else if (nonHomePages.length > 1) {
    // Multiple extra pages — use a single [slug] route with all data
    files["src/app/[slug]/page.tsx"] = generateDynamicSlugPage(nonHomePages);
  }

  // ── Components ─────────────────────────────────────────────────────────────
  files["src/components/site/Page.tsx"] = generatePageComponent();

  // ── Types ──────────────────────────────────────────────────────────────────
  files["src/lib/types.ts"] = generateTypesFile();

  // ── v2: Backend — lib/db.ts, lib/actions.ts ─────────────────────────────────
  files["src/lib/db.ts"] = generateDbClient();
  if (backendActions.length > 0) {
    files["src/lib/actions.ts"] = generateServerActions(backendActions);
  }

  // ── v2: Custom API Route Handlers ──────────────────────────────────────────
  for (const route of siteRoutes) {
    const cleanPath = route.path.replace(/^\//, "").replace(/\//g, "_");
    const fileName = `src/app/api/${cleanPath}/route.ts`;
    files[fileName] = generateRouteHandler(route);
  }

  // ── .gitignore ─────────────────────────────────────────────────────────────
  files[".gitignore"] = `# Dependencies
node_modules/
.pnp
.pnp.js

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
*.pem
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts
`;

  return files;
}

// ─── v2: Supabase DB client ───────────────────────────────────────────────────

function generateDbClient(): string {
  return `import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Server-side client using service role (for server actions)
export function createServerClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? supabaseAnonKey
  );
}
`;
}

// ─── v2: Server Actions generator ────────────────────────────────────────────

function generateServerActions(actions: ExportBackendAction[]): string {
  const actionFns = actions.map((action) => {
    const fnName = toCamelCase(action.name);
    const config = action.config as Record<string, unknown>;
    const table = (config.table as string) ?? "records";
    const auth = action.auth ?? "public";

    if (action.type === "db.insert") {
      const dataKeys = Object.keys((config.data as Record<string, unknown>) ?? {});
      const fieldGets = dataKeys.length
        ? dataKeys.map((k) => `    ${k}: formData.get("${k}") as string,`).join("\n")
        : `    // TODO: map form fields to ${table} columns`;
      return `
export async function ${fnName}(formData: FormData) {
  "use server";
  const supabase = createServerClient();
  ${auth !== "public" ? `// Requires authentication — validate session before proceeding\n  ` : ""}const { error } = await supabase.from("${table}").insert({
${fieldGets}
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}`;
    }

    if (action.type === "db.query") {
      const select = (config.select as string[])?.join(", ") ?? "*";
      return `
export async function ${fnName}() {
  "use server";
  const supabase = createServerClient();
  const { data, error } = await supabase.from("${table}").select("${select}");
  if (error) return { success: false, error: error.message, data: [] };
  return { success: true, data };
}`;
    }

    if (action.type === "email.send") {
      return `
export async function ${fnName}(formData: FormData) {
  "use server";
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);
  const to = formData.get("email") as string;
  const { error } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "noreply@example.com",
    to,
    subject: ${JSON.stringify((config.subject as string) ?? "")},
    html: ${JSON.stringify((config.body as string) ?? "<p>Hello</p>")},
  });
  if (error) return { success: false, error: error.message };
  return { success: true };
}`;
    }

    // Generic fallback
    return `
export async function ${fnName}(formData: FormData) {
  "use server";
  // TODO: implement ${action.type} action — "${action.name}"
  console.log("Action called:", Object.fromEntries(formData));
  return { success: true };
}`;
  });

  return `/**
 * lib/actions.ts — Generated Server Actions
 * Auto-generated by Webperia v2. Do not edit manually.
 */
"use server";

import { createServerClient } from "./db";

${actionFns.join("\n")}
`;
}

// ─── v2: Custom route handler generator ──────────────────────────────────────

function generateRouteHandler(route: ExportSiteRoute): string {
  const method = route.method.toUpperCase();
  const auth = route.auth;

  const stepsCode = route.steps.map((step) => {
    if (step.type === "db.query") {
      const cfg = (step.config ?? {}) as Record<string, unknown>;
      const table = cfg.table as string;
      const select = (cfg.select as string[])?.join(", ") ?? "*";
      return `  const { data: queryResult, error: queryError } = await supabase.from("${table}").select("${select}");
  if (queryError) return NextResponse.json({ error: queryError.message }, { status: 500 });
  result = queryResult;`;
    }
    if (step.type === "db.insert") {
      const cfg = (step.config ?? {}) as Record<string, unknown>;
      const table = cfg.table as string;
      return `  const { data: insertResult, error: insertError } = await supabase.from("${table}").insert(body).select();
  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });
  result = insertResult;`;
    }
    if (step.type === "respond") {
      return `  return NextResponse.json(${JSON.stringify(step.body)}, { status: ${step.status ?? 200} });`;
    }
    return `  // TODO: implement step type "${step.type}"`;
  }).join("\n");

  const authGuard = auth === "authenticated"
    ? `  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
`
    : "";

  return `/**
 * ${route.path} — Generated Route Handler
 * Method: ${method} | Auth: ${auth}
 * Auto-generated by Webperia v2.
 */

import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/db";

export async function ${method}(req: NextRequest) {
  const supabase = createServerClient();
${authGuard}
  let body: Record<string, unknown> = {};
  ${method !== "GET" && method !== "DELETE" ? `try { body = await req.json(); } catch { /* empty */ }` : ""}

  let result: unknown = null;
${stepsCode}

  return NextResponse.json({ success: true, data: result });
}
`;
}

// ─── Utility ──────────────────────────────────────────────────────────────────

function toCamelCase(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+(.)/g, (_, c: string) => c.toUpperCase())
    .replace(/^(.)/, (c: string) => c.toLowerCase());
}
