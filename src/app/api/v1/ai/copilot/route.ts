import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/lib/logger";
import { rateLimit, rateLimitResponse } from "@/lib/rate-limit";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  // Edge-compatible Supabase auth using request cookies
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => req.cookies.getAll(),
        setAll: () => {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Rate limit: 20 requests/minute per user
  const rl = rateLimit(`ai:${user.id}`, 20, 60_000);
  if (!rl.success) {
    return NextResponse.json(rateLimitResponse(rl.reset), { status: 429 });
  }

  const body = await req.json();
  const { message, context } = body;

  if (!message) return NextResponse.json({ error: "message is required" }, { status: 400 });

  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  // Production guard for missing API key
  if (!ANTHROPIC_API_KEY || ANTHROPIC_API_KEY === "sk-ant-placeholder") {
    if (process.env.NODE_ENV === "production") {
      logger.error("AI copilot: ANTHROPIC_API_KEY is not configured in production");
      return NextResponse.json({ error: "AI service not configured" }, { status: 503 });
    }
    return streamMockResponse(message, context); // dev only
  }

  // ── Real Anthropic streaming ──────────────────────────────────────────────
  const systemPrompt = `You are the BuildStack AI Copilot — a context-aware assistant embedded inside a professional website builder.

You have full context of the user's editor state:
- Current page: ${context?.currentPage ?? "Home"}
- Selected element: ${context?.selectedElement ? JSON.stringify(context.selectedElement) : "none"}
- Design tokens: ${JSON.stringify(context?.designTokens ?? {})}
- Site name: ${context?.siteName ?? "unknown"}

You can:
- Add, remove, or modify elements on the canvas
- Rewrite page copy for a target audience
- Suggest layout improvements and design fixes
- Generate CMS schema
- Fix responsive/mobile issues
- Write code components

Respond conversationally and concisely. When describing changes to make, be specific.
If the user asks you to make a change, describe exactly what you would do.`;

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      messages: [{ role: "user", content: message }],
    }),
  });

  if (!anthropicRes.ok) {
    const err = await anthropicRes.text();
    return NextResponse.json({ error: "AI service error", detail: err }, { status: 502 });
  }

  // Pass through the SSE stream
  return new NextResponse(anthropicRes.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}

// ── Mock streaming response (no API key) ─────────────────────────────────────
function streamMockResponse(message: string, _context: unknown) {
  const responses: Record<string, string> = {
    testimonial: "I'll add a testimonials section after your current content. It will include a 3-column grid with star ratings, quote text, author name, and company. I'll style it using your site's design tokens (indigo accents) for a cohesive look.",
    hero: "I'll update your hero section with a darker background — switching from white to a deep navy (#0f172a) with adjusted text colors for contrast. The CTA button will become more prominent with your indigo accent color.",
    pricing: "I'll insert a pricing table section with 3 tiers (Free, Pro, Business). Each card includes a feature list with checkmarks, the price, and a CTA button. The Pro plan will be highlighted as recommended.",
    mobile: "I found 3 layout issues on mobile: (1) Your hero text is 56px — I'll reduce it to 36px on screens < 768px. (2) The features grid is 4 columns — I'll switch to 1 column on mobile. (3) The navbar links are cut off — I'll enable the hamburger menu.",
    default: `Got it! I'll help you with "${message}". Let me analyze your current page structure and apply the changes. In a production environment with a connected API key, I would stream real AI-generated suggestions here. For now, here's what I'd do: review your element tree, identify the best placement, and implement the requested change while maintaining your design system's consistency.`,
  };

  const key = Object.keys(responses).find((k) => message.toLowerCase().includes(k)) ?? "default";
  const text = responses[key];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const words = text.split(" ");
      for (const word of words) {
        const chunk = `data: ${JSON.stringify({ type: "content_block_delta", delta: { type: "text_delta", text: word + " " } })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, 30));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "message_stop" })}\n\n`));
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
}
