import type { DraggableElement } from "@/lib/types";

export const draggableElements: DraggableElement[] = [
  // ── Layout ───────────────────────────────────────────────────────────────────
  {
    id: "hero-section",
    type: "hero",
    label: "Hero Section",
    icon: "Layout",
    defaultContent: "Hero Section",
    defaultStyles: {
      padding: "120px 40px",
      background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 50%, #A78BFA 100%)",
      color: "#FFFFFF",
      textAlign: "center",
    },
  },
  {
    id: "features-section",
    type: "features",
    label: "Features Grid",
    icon: "Grid3X3",
    defaultContent: "Features",
    defaultStyles: {
      padding: "96px 40px",
      backgroundColor: "#F8FAFC",
    },
  },
  {
    id: "cta-section",
    type: "cta",
    label: "CTA Section",
    icon: "Megaphone",
    defaultContent: "Ready to get started?",
    defaultStyles: {
      padding: "96px 40px",
      background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
      color: "#FFFFFF",
      textAlign: "center",
    },
  },
  {
    id: "columns-2",
    type: "columns",
    label: "2 Columns",
    icon: "Columns",
    defaultStyles: {
      display: "flex",
      gap: "32px",
      padding: "48px 40px",
      alignItems: "flex-start",
    },
  },

  // ── Typography ───────────────────────────────────────────────────────────────
  {
    id: "heading-h1",
    type: "heading",
    label: "Heading H1",
    icon: "Heading1",
    defaultContent: "Build products users love",
    defaultStyles: {
      fontSize: "56px",
      fontWeight: "800",
      color: "#0F172A",
      margin: "0",
      padding: "8px 0",
      letterSpacing: "-0.03em",
      lineHeight: "1.1",
    },
  },
  {
    id: "heading-h2",
    type: "heading",
    label: "Heading H2",
    icon: "Heading2",
    defaultContent: "Everything you need to ship faster",
    defaultStyles: {
      fontSize: "40px",
      fontWeight: "700",
      color: "#0F172A",
      margin: "0",
      padding: "8px 0",
      letterSpacing: "-0.02em",
      lineHeight: "1.2",
    },
  },
  {
    id: "paragraph",
    type: "paragraph",
    label: "Paragraph",
    icon: "Type",
    defaultContent:
      "Streamline your workflow with tools designed for modern teams. From planning to deployment, every step is optimized for speed and clarity.",
    defaultStyles: {
      fontSize: "17px",
      color: "#475569",
      lineHeight: "1.75",
      padding: "8px 0",
      maxWidth: "680px",
    },
  },

  // ── Media ────────────────────────────────────────────────────────────────────
  {
    id: "image",
    type: "image",
    label: "Image",
    icon: "Image",
    defaultStyles: {
      width: "100%",
      borderRadius: "16px",
      boxShadow: "0 20px 60px rgba(0,0,0,0.1)",
    },
  },
  {
    id: "video",
    type: "video",
    label: "Video Embed",
    icon: "Video",
    defaultStyles: {
      width: "100%",
      borderRadius: "16px",
      overflow: "hidden",
    },
  },
  {
    id: "divider",
    type: "divider",
    label: "Divider",
    icon: "Minus",
    defaultStyles: {
      border: "none",
      borderTop: "1px solid #E2E8F0",
      margin: "32px 0",
    },
  },
  {
    id: "spacer",
    type: "spacer",
    label: "Spacer",
    icon: "ArrowUpDown",
    defaultStyles: {
      height: "64px",
    },
  },

  // ── Interactive ───────────────────────────────────────────────────────────────
  {
    id: "button-primary",
    type: "button",
    label: "Button",
    icon: "MousePointer",
    defaultContent: "Get Started Free →",
    defaultStyles: {
      backgroundColor: "#6366F1",
      color: "#FFFFFF",
      padding: "14px 28px",
      borderRadius: "10px",
      fontWeight: "600",
      fontSize: "15px",
      border: "none",
      boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
      cursor: "pointer",
    },
  },
  {
    id: "form",
    type: "form",
    label: "Contact Form",
    icon: "FormInput",
    defaultStyles: {
      padding: "40px",
      backgroundColor: "#FFFFFF",
      borderRadius: "20px",
      border: "1px solid #E2E8F0",
      boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
    },
  },

  // ── Sections / Blocks ────────────────────────────────────────────────────────
  {
    id: "card",
    type: "card",
    label: "Card",
    icon: "CreditCard",
    defaultStyles: {
      padding: "28px",
      backgroundColor: "#FFFFFF",
      borderRadius: "16px",
      border: "1px solid #E2E8F0",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    },
  },
  {
    id: "testimonial",
    type: "testimonial",
    label: "Testimonial",
    icon: "Quote",
    defaultStyles: {
      padding: "36px",
      backgroundColor: "#FAFAFA",
      borderRadius: "20px",
      border: "1px solid #F1F5F9",
    },
  },
  {
    id: "pricing",
    type: "pricing",
    label: "Pricing Table",
    icon: "DollarSign",
    defaultStyles: {
      padding: "80px 40px",
      backgroundColor: "#FFFFFF",
    },
  },
  {
    id: "sidebar-elem",
    type: "sidebar",
    label: "Sidebar / Drawer",
    icon: "PanelLeft",
    defaultStyles: {
      padding: "32px",
    },
  },
  {
    id: "footer-elem",
    type: "footer",
    label: "Footer",
    icon: "LayoutTemplate",
    defaultStyles: {
      padding: "56px 40px 32px",
      backgroundColor: "#0F172A",
      color: "#94A3B8",
    },
  },

  // ── Phase 4 Interactive Elements ──────────────────────────────────────────────
  {
    id: "modal-elem",
    type: "modal",
    label: "Modal",
    icon: "Layers",
    defaultContent: "Modal Content",
    defaultProps: { title: "Confirm Action", size: "md" },
    defaultStyles: {},
  },
  {
    id: "drawer-elem",
    type: "drawer",
    label: "Drawer",
    icon: "PanelRight",
    defaultContent: "Drawer Content",
    defaultProps: { title: "Settings", side: "right" },
    defaultStyles: {},
  },
  {
    id: "cart-elem",
    type: "cart",
    label: "Cart",
    icon: "ShoppingCart",
    defaultContent: "",
    defaultProps: { cartStyle: "dropdown", currency: "USD", checkoutUrl: "/checkout" },
    defaultStyles: {},
  },
  {
    id: "add-to-cart-elem",
    type: "add-to-cart",
    label: "Add to Cart",
    icon: "ShoppingBag",
    defaultContent: "Add to Cart",
    defaultProps: { accentColor: "#6366F1", label: "Add to Cart" },
    defaultStyles: {},
  },
  {
    id: "product-card-elem",
    type: "product-card",
    label: "Product Card",
    icon: "Package",
    defaultContent: "",
    defaultProps: {
      name: "Premium Wireless Headphones",
      price: 149.99,
      rating: 4.8,
      reviewCount: 342,
      accentColor: "#6366F1",
    },
    defaultStyles: {},
  },
  {
    id: "countdown-elem",
    type: "countdown",
    label: "Countdown Timer",
    icon: "Timer",
    defaultContent: "",
    defaultProps: { targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() },
    defaultStyles: { textAlign: "center", padding: "32px" },
  },
];

export const elementGroups = [
  {
    label: "Sections",
    elements: ["hero-section", "features-section", "cta-section", "columns-2"],
  },
  {
    label: "Typography",
    elements: ["heading-h1", "heading-h2", "paragraph"],
  },
  {
    label: "Media",
    elements: ["image", "video", "divider", "spacer"],
  },
  {
    label: "Interactive",
    elements: ["button-primary", "form", "modal-elem", "drawer-elem"],
  },
  {
    label: "E-Commerce",
    elements: ["cart-elem", "add-to-cart-elem", "product-card-elem"],
  },
  {
    label: "Components",
    elements: ["card", "testimonial", "pricing", "sidebar-elem", "footer-elem"],
  },
];
