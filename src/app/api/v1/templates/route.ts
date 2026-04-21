
import { NextRequest, NextResponse } from "next/server";

const TEMPLATES = [
  // SaaS
  { id: "t1", name: "SaaS Landing", category: "saas", tier: "free", description: "Modern SaaS landing with hero, features, pricing, and testimonials.", pages: 6, preview_color: "#6366f1", tags: ["saas", "startup", "modern"] },
  { id: "t2", name: "AI Product", category: "saas", tier: "pro", description: "Cutting-edge AI product page with animated demo section.", pages: 5, preview_color: "#8b5cf6", tags: ["ai", "saas", "dark"] },
  { id: "t3", name: "DevTools", category: "saas", tier: "free", description: "Developer tool with docs, changelog, and API reference.", pages: 8, preview_color: "#0ea5e9", tags: ["developer", "docs", "saas"] },

  // Agency
  { id: "t4", name: "Creative Agency", category: "agency", tier: "free", description: "Bold agency site with full-bleed portfolio and case studies.", pages: 6, preview_color: "#ec4899", tags: ["agency", "creative", "portfolio"] },
  { id: "t5", name: "Design Studio", category: "agency", tier: "pro", description: "Minimal design studio with motion-heavy hero.", pages: 5, preview_color: "#f97316", tags: ["design", "studio", "minimal"] },

  // Portfolio
  { id: "t6", name: "Photographer", category: "portfolio", tier: "free", description: "Full-screen photo portfolio with masonry gallery.", pages: 5, preview_color: "#64748b", tags: ["photography", "gallery", "portfolio"] },
  { id: "t7", name: "Developer CV", category: "portfolio", tier: "free", description: "Single-page developer resume with skills and projects.", pages: 1, preview_color: "#10b981", tags: ["resume", "cv", "developer"] },
  { id: "t8", name: "Artist Portfolio", category: "portfolio", tier: "pro", description: "Gallery-first artist portfolio with lightbox and shop.", pages: 6, preview_color: "#a855f7", tags: ["art", "gallery", "creative"] },

  // Blog
  { id: "t9", name: "Personal Blog", category: "blog", tier: "free", description: "Clean minimal blog with newsletter signup.", pages: 5, preview_color: "#f59e0b", tags: ["blog", "minimal", "writing"] },
  { id: "t10", name: "Tech Magazine", category: "blog", tier: "pro", description: "Magazine-style layout with categories, tags, and featured posts.", pages: 7, preview_color: "#ef4444", tags: ["magazine", "tech", "news"] },

  // E-Commerce
  { id: "t11", name: "Fashion Store", category: "ecommerce", tier: "business", description: "Premium fashion e-commerce with product collections and lookbook.", pages: 8, preview_color: "#e11d48", tags: ["fashion", "shop", "ecommerce"] },
  { id: "t12", name: "Digital Products", category: "ecommerce", tier: "pro", description: "Sell digital products, templates, or courses.", pages: 6, preview_color: "#7c3aed", tags: ["digital", "downloads", "ecommerce"] },

  // Restaurant
  { id: "t13", name: "Restaurant", category: "restaurant", tier: "free", description: "Elegant restaurant with menu, reservations, and gallery.", pages: 5, preview_color: "#b45309", tags: ["restaurant", "food", "menu"] },
  { id: "t14", name: "Café", category: "restaurant", tier: "free", description: "Cozy café with daily specials and loyalty program.", pages: 4, preview_color: "#92400e", tags: ["cafe", "coffee", "food"] },

  // Health
  { id: "t15", name: "Fitness Studio", category: "health", tier: "free", description: "Gym site with class schedule, trainers, and membership plans.", pages: 6, preview_color: "#16a34a", tags: ["fitness", "gym", "health"] },
  { id: "t16", name: "Wellness Coach", category: "health", tier: "pro", description: "Personal wellness coach with booking and blog.", pages: 5, preview_color: "#0d9488", tags: ["wellness", "coaching", "health"] },

  // Education
  { id: "t17", name: "Online Course", category: "education", tier: "business", description: "Course landing with curriculum, instructor bio, and enrollment.", pages: 5, preview_color: "#2563eb", tags: ["course", "education", "learning"] },
  { id: "t18", name: "Tutoring", category: "education", tier: "free", description: "Tutoring service with subject cards and booking calendar.", pages: 5, preview_color: "#4f46e5", tags: ["tutoring", "education", "kids"] },

  // Real Estate
  { id: "t19", name: "Real Estate Agent", category: "realestate", tier: "pro", description: "Agent profile with property listings, virtual tours, and CMA.", pages: 6, preview_color: "#0369a1", tags: ["realestate", "property", "agent"] },

  // Tech
  { id: "t20", name: "Startup Launch", category: "saas", tier: "free", description: "Waitlist page with countdown, early access signup, and social proof.", pages: 2, preview_color: "#7c3aed", tags: ["launch", "waitlist", "startup"] },

  // Nonprofit
  { id: "t21", name: "Nonprofit", category: "nonprofit", tier: "free", description: "Cause-driven site with donation form, impact stats, and volunteer signup.", pages: 6, preview_color: "#dc2626", tags: ["nonprofit", "charity", "donation"] },

  // Event
  { id: "t22", name: "Conference", category: "event", tier: "pro", description: "Conference site with agenda, speakers, and ticket purchase.", pages: 7, preview_color: "#0891b2", tags: ["conference", "event", "speakers"] },

  // Resume
  { id: "t23", name: "Link in Bio", category: "resume", tier: "free", description: "Single-page link hub with social profiles and recent content.", pages: 1, preview_color: "#db2777", tags: ["linktree", "bio", "social"] },
];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const tier = searchParams.get("tier");
  const q = searchParams.get("q")?.toLowerCase();

  let templates = TEMPLATES;
  if (category) templates = templates.filter((t) => t.category === category);
  if (tier) templates = templates.filter((t) => t.tier === tier);
  if (q) templates = templates.filter((t) =>
    t.name.toLowerCase().includes(q) ||
    t.description.toLowerCase().includes(q) ||
    t.tags.some((tag) => tag.includes(q))
  );

  return NextResponse.json({ data: templates, meta: { total: templates.length } });
}
