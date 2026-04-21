import { NextRequest, NextResponse } from "next/server";

// AI Site Generator endpoint
// Uses Claude (Anthropic API) to generate a full site structure from a text prompt.
// Falls back to a rich mock response when ANTHROPIC_API_KEY is not configured.

interface GeneratedSection {
  type: string;
  content: Record<string, unknown>;
}

interface GeneratedSite {
  name: string;
  description: string;
  sections: GeneratedSection[];
  colorPalette: { primary: string; secondary: string; background: string; text: string };
  typography: { heading: string; body: string };
  meta: { title: string; description: string };
}

function buildMockSite(prompt: string, style: string): GeneratedSite {
  const isLower = prompt.toLowerCase();
  const isSaaS     = isLower.includes("saas") || isLower.includes("software") || isLower.includes("app") || isLower.includes("platform");
  const isPortfolio = isLower.includes("portfolio") || isLower.includes("designer") || isLower.includes("freelance");
  const isEcom      = isLower.includes("shop") || isLower.includes("store") || isLower.includes("product") || isLower.includes("ecommerce");
  const isAgency    = isLower.includes("agency") || isLower.includes("studio") || isLower.includes("consulting");

  const siteName = isPortfolio ? "Creative Portfolio"
    : isEcom ? "Online Store"
    : isAgency ? "Agency Studio"
    : isSaaS ? "SaaS Platform"
    : "Professional Website";

  const styleColors = {
    modern:   { primary: "#6366f1", secondary: "#a5b4fc", background: "#ffffff", text: "#111827" },
    bold:     { primary: "#dc2626", secondary: "#fca5a5", background: "#0f172a", text: "#f8fafc" },
    dark:     { primary: "#8b5cf6", secondary: "#c4b5fd", background: "#0f0f0f", text: "#f9fafb" },
    playful:  { primary: "#f59e0b", secondary: "#fcd34d", background: "#fffbeb", text: "#1c1917" },
    minimal:  { primary: "#374151", secondary: "#9ca3af", background: "#f9fafb", text: "#111827" },
    gradient: { primary: "#6366f1", secondary: "#ec4899", background: "#ffffff", text: "#111827" },
  };

  const colors = styleColors[style as keyof typeof styleColors] ?? styleColors.modern;

  const sections: GeneratedSection[] = [
    {
      type: "hero",
      content: {
        headline: isPortfolio ? "Crafting Digital Experiences" : isSaaS ? "The Smarter Way to Work" : isEcom ? "Shop Our Collection" : "Built for Growth",
        subheadline: `${prompt.slice(0, 120)}${prompt.length > 120 ? "..." : ""}`,
        ctaText: isEcom ? "Shop Now" : "Get Started Free",
        ctaSecondary: "Learn More",
        badge: isPortfolio ? "Available for projects" : isSaaS ? "Trusted by 10,000+ teams" : null,
      },
    },
    {
      type: "logos",
      content: {
        headline: "Trusted by leading companies",
        logos: ["Acme Corp", "TechVentures", "StartupCo", "Enterprise Ltd", "Innovation Inc"],
      },
    },
    {
      type: "features",
      content: {
        headline: isPortfolio ? "What I Do" : "Everything You Need",
        subheadline: "Powerful features designed to help you succeed",
        features: isPortfolio
          ? [
              { icon: "✦", title: "UI/UX Design", desc: "Beautiful, intuitive interfaces that users love" },
              { icon: "⬡", title: "Web Development", desc: "Fast, accessible websites built with modern tech" },
              { icon: "◈", title: "Brand Identity", desc: "Cohesive visual systems that tell your story" },
            ]
          : isSaaS
          ? [
              { icon: "⚡", title: "Lightning Fast", desc: "Optimized for speed with sub-second load times" },
              { icon: "🔒", title: "Enterprise Security", desc: "SOC 2 compliant with end-to-end encryption" },
              { icon: "📊", title: "Advanced Analytics", desc: "Real-time insights to drive better decisions" },
              { icon: "🔗", title: "100+ Integrations", desc: "Connect to the tools your team already uses" },
              { icon: "🤖", title: "AI-Powered", desc: "Intelligent automation that learns from your workflow" },
              { icon: "🌐", title: "Global CDN", desc: "Deployed to 200+ edge locations worldwide" },
            ]
          : [
              { icon: "◆", title: "Feature One", desc: "A compelling benefit that solves a real problem" },
              { icon: "●", title: "Feature Two", desc: "Another reason why customers choose you" },
              { icon: "▲", title: "Feature Three", desc: "The advantage that sets you apart from competitors" },
            ],
      },
    },
    ...(isSaaS || !isPortfolio
      ? [{
          type: "stats",
          content: {
            stats: isSaaS
              ? [{ value: "10,000+", label: "Active Users" }, { value: "99.9%", label: "Uptime SLA" }, { value: "2.5x", label: "Avg ROI" }, { value: "< 2s", label: "Load Time" }]
              : [{ value: "500+", label: "Projects" }, { value: "98%", label: "Satisfaction" }, { value: "12+", label: "Years" }, { value: "50+", label: "Countries" }],
          },
        }]
      : []),
    {
      type: "testimonials",
      content: {
        headline: "Loved by customers",
        testimonials: [
          { name: "Sarah Chen", role: "CEO, TechStartup", quote: "This completely transformed how we work. I can't imagine going back.", avatar: "SC" },
          { name: "Marcus Lee", role: "Product Lead, Agency", quote: "The best investment we've made. Results were visible within the first week.", avatar: "ML" },
          { name: "Priya Patel", role: "Founder, Studio", quote: "Incredibly intuitive. Our team adopted it immediately with zero training.", avatar: "PP" },
        ],
      },
    },
    ...(isSaaS
      ? [{
          type: "pricing",
          content: {
            headline: "Simple, transparent pricing",
            tiers: [
              { name: "Starter", price: "$0", period: "/month", features: ["5 projects", "1 user", "Basic analytics", "Email support"], cta: "Get started", highlighted: false },
              { name: "Pro", price: "$29", period: "/month", features: ["Unlimited projects", "5 users", "Advanced analytics", "Priority support", "API access"], cta: "Start free trial", highlighted: true },
              { name: "Business", price: "$99", period: "/month", features: ["Everything in Pro", "Unlimited users", "Custom integrations", "SSO", "Dedicated support"], cta: "Contact sales", highlighted: false },
            ],
          },
        }]
      : []),
    {
      type: "faq",
      content: {
        headline: "Frequently Asked Questions",
        items: [
          { q: "How do I get started?", a: "Sign up for a free account and you'll be up and running in minutes. No credit card required." },
          { q: "Can I cancel at any time?", a: "Yes, you can cancel your subscription at any time with no questions asked." },
          { q: "Is there a free trial?", a: "We offer a 14-day free trial on all paid plans so you can evaluate before committing." },
          { q: "Do you offer discounts for annual plans?", a: "Yes, annual plans come with a 20% discount compared to monthly billing." },
        ],
      },
    },
    {
      type: "newsletter",
      content: {
        headline: "Stay in the loop",
        subheadline: "Get the latest updates delivered to your inbox.",
        placeholder: "Enter your email",
        ctaText: "Subscribe",
      },
    },
  ];

  return {
    name: siteName,
    description: prompt.slice(0, 200),
    sections,
    colorPalette: colors,
    typography: {
      heading: style === "playful" ? "Poppins" : style === "bold" ? "Syne" : "Inter",
      body: "Inter",
    },
    meta: {
      title: `${siteName} — ${isPortfolio ? "Portfolio" : isSaaS ? "SaaS Platform" : "Website"}`,
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
  "sections": [array of section objects with type and content],
  "colorPalette": { "primary": "#hex", "secondary": "#hex", "background": "#hex", "text": "#hex" },
  "typography": { "heading": "Font name", "body": "Font name" },
  "meta": { "title": "Page title", "description": "Meta description" }
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
