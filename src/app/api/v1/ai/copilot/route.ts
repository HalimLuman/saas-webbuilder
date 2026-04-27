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
        setAll: () => { },
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
  const systemPrompt = `You are the Webperia AI Copilot — a context-aware assistant embedded inside a professional website builder.

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

  const tools = [
    {
      name: "add_element",
      description: "Inserts a new element or fully-formed tree (e.g. sections, containers, components) into the canvas.",
      input_schema: {
        type: "object",
        properties: {
          elementData: {
            type: "object",
            description: "The CanvasElement payload representing the element to add.",
            properties: {
              type: { type: "string" },
              content: { type: "string" },
              styles: { type: "object" },
              props: { type: "object" },
              children: { type: "array" }
            },
            required: ["type"]
          }
        },
        required: ["elementData"]
      }
    },
    {
      name: "add_child_element",
      description: "Adds a new element inside an existing container by its parent ID.",
      input_schema: {
        type: "object",
        properties: {
          parentId: { type: "string", description: "The ID of the parent container to add the child into" },
          childData: {
            type: "object",
            description: "The CanvasElement payload representing the element to add.",
            properties: {
              type: { type: "string" },
              content: { type: "string" },
              styles: { type: "object" },
              props: { type: "object" },
              children: { type: "array" }
            },
            required: ["type"]
          }
        },
        required: ["parentId", "childData"]
      }
    },
    {
      name: "update_styles",
      description: "Modifies CSS properties of an existing element by its ID.",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string", description: "The ID of the element to update" },
          styles: { type: "object", description: "CSS styles mapping (e.g. { backgroundColor: '#000000', color: '#ffffff' })" }
        },
        required: ["elementId", "styles"]
      }
    },
    {
      name: "update_content",
      description: "Modifies the text content of an existing element by its ID.",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string", description: "The ID of the element to update" },
          content: { type: "string", description: "The new text content" }
        },
        required: ["elementId", "content"]
      }
    },
    {
      name: "remove_element",
      description: "Deletes an element from the canvas by its ID.",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string", description: "The ID of the element to remove" }
        },
        required: ["elementId"]
      }
    },
    {
      name: "update_props",
      description: "Modifies element-specific properties (like layout configurations, custom properties) of an existing element by its ID.",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string", description: "The ID of the element to update" },
          props: { type: "object", description: "Properties mapping (e.g. { _childLayout: 'two-col', _flexAlign: 'center' })" }
        },
        required: ["elementId", "props"]
      }
    },
    {
      name: "update_descendants_styles",
      description: "Modifies CSS properties of all child elements under a specific parent element, optionally filtered by element type.",
      input_schema: {
        type: "object",
        properties: {
          parentId: { type: "string", description: "The ID of the parent element whose children will be updated" },
          styles: { type: "object", description: "CSS styles mapping (e.g. { color: '#ff0000' }) to apply to descendants" },
          targetType: { type: "string", description: "Optional. If provided, only descendants of this ElementType (e.g. 'paragraph', 'heading') will be updated." }
        },
        required: ["parentId", "styles"]
      }
    },
    {
      name: "move_element",
      description: "Moves an element relative to another target element.",
      input_schema: {
        type: "object",
        properties: {
          activeId: { type: "string", description: "The ID of the element to move" },
          targetId: { type: "string", description: "The ID of the target element" },
          placement: { type: "string", enum: ["before", "after", "inside"], description: "Where to place the active element relative to the target" }
        },
        required: ["activeId", "targetId", "placement"]
      }
    },
    {
      name: "duplicate_element",
      description: "Duplicates an element by its ID.",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string", description: "The ID of the element to duplicate" }
        },
        required: ["elementId"]
      }
    },
    {
      name: "wrap_in_container",
      description: "Wraps an existing element in a new container.",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string", description: "The ID of the element to wrap" }
        },
        required: ["elementId"]
      }
    },
    {
      name: "apply_visual_preset",
      description: "Applies a complex visual theme (like Glassmorphism, Neumorphism, or Minimalist) to an element and its children.",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string" },
          preset: { enum: ["glassmorphism", "outline_minimal", "soft_surface"] },
          intensity: { type: "string", enum: ["subtle", "medium", "strong"] }
        },
        required: ["elementId", "preset"]
      }
    },
    {
      name: "batch_update_elements",
      description: "Updates multiple elements at once. Use this for layout-wide changes.",
      input_schema: {
        type: "object",
        properties: {
          updates: {
            type: "array",
            items: {
              type: "object",
              properties: {
                elementId: { type: "string" },
                styles: { type: "object" },
                content: { type: "string" }
              }
            }
          }
        },
        required: ["updates"]
      }
    },
    {
      name: "update_responsive_styles",
      description: "Modifies CSS properties of an existing element specifically for a certain breakpoint (mobile, tablet, etc).",
      input_schema: {
        type: "object",
        properties: {
          elementId: { type: "string", description: "The ID of the element to update" },
          breakpoint: { enum: ["large-tablet", "tablet", "mobile", "small-mobile"], description: "The responsive breakpoint to target" },
          styles: { type: "object", description: "CSS styles mapping to apply at this breakpoint" }
        },
        required: ["elementId", "breakpoint", "styles"]
      }
    }
  ];

  const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": ANTHROPIC_API_KEY,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-haiku-20240307",
      max_tokens: 1024,
      stream: true,
      system: systemPrompt,
      tools: tools,
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
  const msgLower = message.toLowerCase();

  // IDs are exactly 7 lowercase alphanumeric characters (e.g. 10ni5or)
  const idMatch = msgLower.match(/\b[a-z0-9]{7}\b/);
  const targetId = idMatch ? idMatch[0] : null;

  let toolName = "add_element";
  let toolPayload: any = null;
  let text = "";

  const isUpdate = targetId && (msgLower.includes("update") || msgLower.includes("change") || msgLower.includes("should") || msgLower.includes("make"));
  const isApplyPreset = targetId && (msgLower.includes("glassmorphism") || msgLower.includes("neumorphism") || msgLower.includes("minimalist") || msgLower.includes("preset"));
  const isResponsiveUpdate = targetId && (msgLower.includes("mobile") || msgLower.includes("tablet"));
  const isAddChild = targetId && msgLower.includes("add") && (msgLower.includes("inside") || msgLower.includes("to"));
  const isBatchUpdate = msgLower.includes("batch") || msgLower.includes("multiple");
  const isTestimonial = msgLower.includes("testimonial");
  const isHero = msgLower.includes("hero");
  const isServices = msgLower.includes("services");

  if (isAddChild) {
    toolName = "add_child_element";
    const elType = msgLower.includes("card") || msgLower.includes("container") ? "container" : msgLower.includes("button") ? "button" : msgLower.includes("heading") ? "heading" : "paragraph";
    toolPayload = { 
      parentId: targetId, 
      childData: { type: elType, content: `New ${elType}`, styles: { padding: "16px", backgroundColor: "#ffffff", borderRadius: "8px" } } 
    };
    text = `I'll add a new ${elType} inside element ${targetId}.`;
  } else if (isApplyPreset) {
    toolName = "apply_visual_preset";
    const preset = msgLower.includes("glassmorphism") ? "glassmorphism" : msgLower.includes("minimalist") ? "outline_minimal" : "soft_surface";
    toolPayload = { elementId: targetId, preset, intensity: "medium" };
    text = `I'll apply the ${preset} preset to element ${targetId}.`;
  } else if (isResponsiveUpdate) {
    toolName = "update_responsive_styles";
    const breakpoint = msgLower.includes("mobile") ? "mobile" : "tablet";
    toolPayload = { elementId: targetId, breakpoint, styles: { padding: "16px", fontSize: "14px" } };
    text = `I'll update the ${breakpoint} responsive styles for element ${targetId}.`;
  } else if (isBatchUpdate) {
    toolName = "batch_update_elements";
    toolPayload = { updates: [{ elementId: targetId || "10ni5or", styles: { backgroundColor: "#f3f4f6" } }] };
    text = `I'll batch update the elements for you.`;
  } else if (isUpdate) {
    // Dynamic update mock logic
    // If they explicitly asked to change content (e.g. "change text to 'hello'")
    const hasQuote = message.match(/["'](.*?)["']/);
    const wantsContentChange = msgLower.includes("text") && !msgLower.includes("color") && !msgLower.includes("background");

    if (wantsContentChange && hasQuote) {
      toolName = "update_content";
      toolPayload = { elementId: targetId, content: hasQuote[1] };
      text = `I'll update the text content of element ${targetId} for you.`;
    } else {
      const styles: any = {};
      const colorsRegex = /(black|white|red|blue|green|yellow|purple|indigo|pink|transparent|#[a-f0-9]{3,6})/;

      const bgMatch = msgLower.match(new RegExp(`(?:background|bg).*?${colorsRegex.source}`));
      const textMatch = msgLower.match(new RegExp(`(?:color|text).*?${colorsRegex.source}`));

      const resolveColor = (c: string) => c === "black" ? "#000000" : c === "white" ? "#ffffff" : c;

      if (bgMatch) styles.backgroundColor = resolveColor(bgMatch[1]);
      if (textMatch) styles.color = resolveColor(textMatch[1]);

      const fontSizeMatch = msgLower.match(/font size.*?(\d+(px|rem|em))/i) || msgLower.match(/(\d+(px|rem|em)).*?font size/i);
      if (fontSizeMatch) styles.fontSize = fontSizeMatch[1];
      
      const paddingMatch = msgLower.match(/padding.*?(\d+(px|rem|em))/i) || msgLower.match(/(\d+(px|rem|em)).*?padding/i);
      if (paddingMatch) styles.padding = paddingMatch[1];

      if (Object.keys(styles).length === 0) {
        // Fallback simple match
        const anyColor = msgLower.match(colorsRegex);
        if (anyColor) {
           const resolvedAnyColor = resolveColor(anyColor[1]);
           if (msgLower.includes("background") || msgLower.includes("bg")) styles.backgroundColor = resolvedAnyColor;
           else if (msgLower.includes("color") || msgLower.includes("text")) styles.color = resolvedAnyColor;
           else styles.backgroundColor = resolvedAnyColor;
        } else {
           // No color mentioned at all, maybe some random change like bold
           if (msgLower.includes("bold")) styles.fontWeight = "bold";
           if (msgLower.includes("center")) styles.textAlign = "center";
        }
      }

      if (msgLower.includes("inside") || msgLower.includes("under") || msgLower.includes("children")) {
        toolName = "update_descendants_styles";
        let targetType;
        if (msgLower.includes("paragraph") || msgLower.includes("text")) targetType = "paragraph";
        else if (msgLower.includes("heading") || msgLower.includes("title")) targetType = "heading";
        else if (msgLower.includes("button")) targetType = "button";

        toolPayload = { parentId: targetId, styles, targetType };
        text = `I'll update the styles for ${targetType ? targetType + 's' : 'all elements'} inside ${targetId}.`;
      } else {
        toolName = "update_styles";
        toolPayload = { elementId: targetId, styles };
        text = `I'll update the styles for element ${targetId}.`;
      }
    }
  } else if (isTestimonial) {
    text = "I'll add a testimonials section right now.";
    toolPayload = {
      elementData: {
        type: "container",
        props: { _childLayout: "column" },
        styles: { padding: "40px", backgroundColor: "#f9fafb" },
        children: [
          { type: "heading", content: "What Our Customers Say", styles: { fontSize: "32px", textAlign: "center", marginBottom: "32px" } },
          {
            type: "container", props: { _childLayout: "three-col" }, styles: { gap: "24px" },
            children: [
              { type: "container", props: { _childLayout: "column" }, styles: { padding: "24px", backgroundColor: "white", borderRadius: "8px", boxShadow: "md" }, children: [{ type: "paragraph", content: "\"Amazing product!\"" }, { type: "paragraph", content: "- Jane Doe", styles: { fontWeight: "bold", marginTop: "16px" } }] },
              { type: "container", props: { _childLayout: "column" }, styles: { padding: "24px", backgroundColor: "white", borderRadius: "8px", boxShadow: "md" }, children: [{ type: "paragraph", content: "\"Changed my life!\"" }, { type: "paragraph", content: "- John Smith", styles: { fontWeight: "bold", marginTop: "16px" } }] },
              { type: "container", props: { _childLayout: "column" }, styles: { padding: "24px", backgroundColor: "white", borderRadius: "8px", boxShadow: "md" }, children: [{ type: "paragraph", content: "\"Highly recommend!\"" }, { type: "paragraph", content: "- Alice Johnson", styles: { fontWeight: "bold", marginTop: "16px" } }] }
            ]
          }
        ]
      }
    };
  } else if (isHero) {
    text = "I'll add a hero section with a dark background.";
    toolPayload = {
      elementData: {
        type: "container",
        props: { _childLayout: "column", _flexAlign: "center", _flexJustify: "center" },
        styles: { padding: "80px 24px", backgroundColor: "#0f172a", color: "white", textAlign: "center" },
        children: [
          { type: "heading", content: "Build Faster with Webperia", styles: { fontSize: "48px", fontWeight: "bold", marginBottom: "24px" } },
          { type: "paragraph", content: "The ultimate AI-powered website builder.", styles: { fontSize: "20px", color: "#94a3b8", marginBottom: "32px" } },
          { type: "button", content: "Get Started", styles: { backgroundColor: "#6366f1", padding: "12px 32px", borderRadius: "8px", color: "white", fontWeight: "bold" } }
        ]
      }
    };
  } else if (isServices) {
    text = "I'll add a services section with a 2x2 grid, a dark background, and white cards as you requested.";
    toolPayload = {
      elementData: {
        type: "container",
        props: { _childLayout: "column", _flexAlign: "center", _flexJustify: "center" },
        styles: { padding: "80px 24px", backgroundColor: "#0f172a", color: "white" },
        children: [
          { type: "heading", content: "Our Services", styles: { fontSize: "40px", fontWeight: "bold", marginBottom: "48px", textAlign: "center" } },
          {
            type: "container", props: { _childLayout: "two-col" }, styles: { gap: "32px", maxWidth: "900px" },
            children: [
              { type: "container", props: { _childLayout: "column" }, styles: { padding: "32px", backgroundColor: "white", color: "#111827", borderRadius: "12px", boxShadow: "lg" }, children: [{ type: "heading", content: "Web Design", styles: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" } }, { type: "paragraph", content: "Custom websites tailored to your brand identity with stunning visuals." }] },
              { type: "container", props: { _childLayout: "column" }, styles: { padding: "32px", backgroundColor: "white", color: "#111827", borderRadius: "12px", boxShadow: "lg" }, children: [{ type: "heading", content: "SEO Optimization", styles: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" } }, { type: "paragraph", content: "Rank higher on search engines and attract more organic traffic." }] },
            ]
          },
          {
            type: "container", props: { _childLayout: "two-col" }, styles: { gap: "32px", maxWidth: "900px", marginTop: "32px" },
            children: [
              { type: "container", props: { _childLayout: "column" }, styles: { padding: "32px", backgroundColor: "white", color: "#111827", borderRadius: "12px", boxShadow: "lg" }, children: [{ type: "heading", content: "Marketing Strategy", styles: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" } }, { type: "paragraph", content: "Data-driven marketing campaigns that convert visitors into customers." }] },
              { type: "container", props: { _childLayout: "column" }, styles: { padding: "32px", backgroundColor: "white", color: "#111827", borderRadius: "12px", boxShadow: "lg" }, children: [{ type: "heading", content: "Brand Identity", styles: { fontSize: "24px", fontWeight: "bold", marginBottom: "16px" } }, { type: "paragraph", content: "Establish a strong, recognizable brand that resonates with your audience." }] },
            ]
          }
        ]
      }
    };
  } else {
    text = `Got it! I'll help you with "${message}". (This is a text-only mock response)`;
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 1. Stream the text block
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content_block_start", index: 0, content_block: { type: "text", text: "" } })}\n\n`));
      const words = text.split(" ");
      for (const word of words) {
        const chunk = `data: ${JSON.stringify({ type: "content_block_delta", index: 0, delta: { type: "text_delta", text: word + " " } })}\n\n`;
        controller.enqueue(encoder.encode(chunk));
        await new Promise((r) => setTimeout(r, 30));
      }
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content_block_stop", index: 0 })}\n\n`));

      // 2. Stream the tool call block if present
      if (toolPayload) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content_block_start", index: 1, content_block: { type: "tool_use", id: "toolu_mock_123", name: toolName } })}\n\n`));
        const jsonStr = JSON.stringify(toolPayload);
        // stream json in chunks to simulate real streaming
        const chunkSize = 50;
        for (let i = 0; i < jsonStr.length; i += chunkSize) {
          const chunk = jsonStr.slice(i, i + chunkSize);
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content_block_delta", index: 1, delta: { type: "input_json_delta", partial_json: chunk } })}\n\n`));
          await new Promise((r) => setTimeout(r, 20));
        }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "content_block_stop", index: 1 })}\n\n`));
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
