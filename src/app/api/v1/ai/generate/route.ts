import { NextRequest, NextResponse } from "next/server";
import { GeneratedSection, GeneratedPage, GeneratedSite } from "@/lib/ai-site-mapper";

// AI Site Generator endpoint
// Uses Claude (Anthropic API) to generate a full site structure from a text prompt.
// Falls back to a rich mock response when ANTHROPIC_API_KEY is not configured.


function buildMockSite(prompt: string, style: string): GeneratedSite {
  const isLower = prompt.toLowerCase();
  
  // 1. Smarter Name Extraction
  let siteName = "";
  const nameMatch = prompt.match(/called\s+["']?([^"'.!?,]+)["']?/i) || 
                    prompt.match(/named\s+["']?([^"'.!?,]+)["']?/i) ||
                    prompt.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)\s+(?:shop|store|agency|business|studio)/);
  
  if (nameMatch) {
    siteName = nameMatch[1].trim();
  } else {
    const isSaaS     = isLower.includes("saas") || isLower.includes("software") || isLower.includes("app") || isLower.includes("platform");
    const isPortfolio = isLower.includes("portfolio") || isLower.includes("designer") || isLower.includes("freelance");
    const isEcom      = isLower.includes("shop") || isLower.includes("store") || isLower.includes("product") || isLower.includes("ecommerce");
    const isAgency    = isLower.includes("agency") || isLower.includes("studio") || isLower.includes("consulting");

    siteName = isPortfolio ? "Creative Portfolio"
      : isEcom ? "Online Store"
      : isAgency ? "Agency Studio"
      : isSaaS ? "SaaS Platform"
      : "Professional Website";
  }

  // 2. Style Detection from Prompt
  let finalStyle = style;
  if (isLower.includes("black") || isLower.includes("dark") || isLower.includes("night")) {
    finalStyle = "dark";
  } else if (isLower.includes("bold") || isLower.includes("impactful")) {
    finalStyle = "bold";
  } else if (isLower.includes("playful") || isLower.includes("fun")) {
    finalStyle = "playful";
  } else if (isLower.includes("minimal") || isLower.includes("clean") || isLower.includes("simple")) {
    finalStyle = "minimal";
  }

  const styleColors = {
    modern:   { primary: "#6366f1", secondary: "#a5b4fc", background: "#ffffff", text: "#111827" },
    bold:     { primary: "#dc2626", secondary: "#fca5a5", background: "#0f172a", text: "#f8fafc" },
    dark:     { primary: "#8b5cf6", secondary: "#c4b5fd", background: "#0f0f0f", text: "#f9fafb" },
    playful:  { primary: "#f59e0b", secondary: "#fcd34d", background: "#fffbeb", text: "#1c1917" },
    minimal:  { primary: "#374151", secondary: "#9ca3af", background: "#f9fafb", text: "#111827" },
    gradient: { primary: "#6366f1", secondary: "#ec4899", background: "#ffffff", text: "#111827" },
  };

  const colors = styleColors[finalStyle as keyof typeof styleColors] ?? styleColors.modern;

  // 3. Multi-page detection
  const requestedPages: string[] = ["Home"];
  if (isLower.includes("about")) requestedPages.push("About");
  if (isLower.includes("contact")) requestedPages.push("Contact");
  if (isLower.includes("pricing")) requestedPages.push("Pricing");
  if (isLower.includes("services")) requestedPages.push("Services");
  if (isLower.includes("blog")) requestedPages.push("Blog");

  const buildSections = (pageName: string): GeneratedSection[] => {
    const p = pageName.toLowerCase();
    const isSweet = isLower.includes("sweet") || isLower.includes("baklava") || isLower.includes("dessert");

    if (p === "about") {
      return [
        { type: "hero", content: { 
            headline: isSweet ? `The Heritage of ${siteName}` : `About ${siteName}`, 
            subheadline: isSweet ? "Crafting traditional sweets with recipes passed down through generations." : "Our story, our mission, and the people behind the magic.", 
            ctaText: "Read Our Story" 
        } },
        { type: "features", content: { 
            headline: "Our Traditional Process", 
            features: isSweet 
              ? [
                  { title: "Hand-crafted", desc: "Every piece is made by hand using traditional techniques." }, 
                  { title: "Premium Ingredients", desc: "We source the finest pistachios and honey for authentic flavor." }
                ]
              : [{ title: "Quality", desc: "We never compromise on the details." }, { title: "Innovation", desc: "Pushing boundaries in everything we do." }] 
        } }
      ];
    }
    if (p === "contact") {
      return [
        { type: "hero", content: { headline: isSweet ? "Visit Our Shop" : "Get in Touch", subheadline: isSweet ? "Come taste our fresh baklava and sweets in person." : "Have questions? We'd love to hear from you.", ctaText: "Find Our Location" } },
        { type: "faq", content: { headline: "Ordering Information", items: isSweet ? [{ q: "Do you ship internationally?", a: "Yes, we ship our fresh sweets worldwide in vacuum-sealed packaging." }] : [{ q: "Where are you located?", a: "We are based in the heart of the city." }] } }
      ];
    }
    
    // Default / Home
    return [
      {
        type: "hero",
        content: {
          headline: isSweet ? `Experience ${siteName}` : `Welcome to ${siteName}`,
          subheadline: isSweet ? "The finest traditional baklava and Mediterranean sweets, baked fresh daily with love." : prompt.slice(0, 120),
          ctaText: isSweet ? "Order Now" : "Get Started",
        },
      },
      { type: "logos", content: { headline: "Featured In" } },
      { type: "features", content: { 
          headline: isSweet ? "Our Specialties" : "Why Choose Us", 
          features: isSweet
            ? [
                { title: "Pistachio Baklava", desc: "Layers of thin pastry and high-quality Antep pistachios." },
                { title: "Daily Fresh", desc: "Baked every morning to ensure the perfect crunch and flavor." }
              ]
            : [{ title: "Excellence", desc: "Premium quality in every detail." }, { title: "Service", desc: "Dedicated support for all our clients." }] 
      } },
      { type: "testimonials", content: { headline: "What Our Customers Say", testimonials: [{ name: "Alex Rivera", quote: isSweet ? "The best baklava I've ever had outside of Turkey! Simply incredible." : "Absolute game changer. Highly recommend." }] } },
      { type: "newsletter", content: { headline: "Join the Sweet Life", subheadline: "Subscribe for new flavors and special offers." } }
    ];
  };

  const pages: GeneratedPage[] = requestedPages.map(name => ({
    name,
    slug: name === "Home" ? "/" : `/${name.toLowerCase()}`,
    sections: buildSections(name)
  }));

  return {
    name: siteName,
    description: prompt.slice(0, 200),
    pages,
    colorPalette: colors,
    typography: {
      heading: finalStyle === "playful" ? "Poppins" : finalStyle === "bold" ? "Syne" : "Inter",
      body: "Inter",
    },
    meta: {
      title: `${siteName} — Professional Website`,
      description: prompt.slice(0, 160),
    },
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, style = "modern", colorPalette } = body;

    if (!prompt?.trim()) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Check plan — free users have 0 AI credits
    const { createSupabaseServerClient } = await import("@/lib/supabase/server");
    const supabase = await createSupabaseServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { data: profile } = await supabase
      .from("users")
      .select("plan, ai_credits_used, ai_credits_limit")
      .eq("id", user.id)
      .single();
    const plan = profile?.plan ?? "free";
    const AI_LIMITS: Record<string, number> = { free: 0, pro: 50, business: 500, enterprise: 99999 };
    const creditLimit = profile?.ai_credits_limit ?? AI_LIMITS[plan] ?? 0;
    if (creditLimit === 0) {
      return NextResponse.json(
        { error: "AI generation is not available on the free plan. Upgrade to Pro to access AI features." },
        { status: 403 }
      );
    }
    const creditsUsed = profile?.ai_credits_used ?? 0;
    if (creditsUsed >= creditLimit) {
      return NextResponse.json(
        { error: `You've used all ${creditLimit} AI credits for this month. Upgrade or wait for next month's reset.` },
        { status: 403 }
      );
    }

    const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY ?? "";
    const hasRealAI = ANTHROPIC_KEY.startsWith("sk-ant-");

    if (hasRealAI) {
      // Real Claude integration via direct API fetch
      const systemPrompt = `You are an expert web designer and copywriter. Generate a complete website structure as JSON based on the user's description.

Return a JSON object with this exact structure:
{
  "name": "Site name",
  "description": "Brief description",
  "pages": [
    {
      "name": "Page name",
      "slug": "/slug",
      "sections": [array of section objects with type and content]
    }
  ],
  "colorPalette": { "primary": "#hex", "secondary": "#hex", "background": "#hex", "text": "#hex" },
  "typography": { "heading": "Font name", "body": "Font name" },
  "meta": { "title": "Main site title", "description": "Meta description" }
}

Style preference: ${style}. Generate compelling, specific copy — not placeholder text. Make it feel real and professional.`;

      const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": ANTHROPIC_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 4096,
          system: systemPrompt,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (anthropicRes.ok) {
        const data = await anthropicRes.json() as { content: Array<{ type: string; text: string }> };
        const text = data.content[0]?.type === "text" ? data.content[0].text : "";
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const site = JSON.parse(jsonMatch[0]) as GeneratedSite;
          return NextResponse.json({ site, generated: true, model: "claude-sonnet-4-6" });
        }
      }
    }

    // Mock response
    const site = buildMockSite(prompt, style);
    return NextResponse.json({
      site,
      generated: true,
      mock: !hasRealAI,
      model: hasRealAI ? "claude-sonnet-4-6" : "mock",
      message: !hasRealAI ? "Add ANTHROPIC_API_KEY to enable real AI generation" : undefined,
    });
  } catch (err) {
    console.error("AI generate error:", err);
    return NextResponse.json({ error: "Failed to generate site" }, { status: 500 });
  }
}
