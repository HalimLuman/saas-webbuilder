import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Webperia — Build Stunning Websites with AI";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1133 50%, #0f0f0f 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "linear-gradient(135deg, #6366f1, #9333ea)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
              <path d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span style={{ fontSize: 52, fontWeight: 800, color: "white", letterSpacing: "-2px" }}>
            Build<span style={{ color: "#818cf8" }}>Stack</span>
          </span>
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.6)", textAlign: "center", maxWidth: 700 }}>
          Build stunning websites with AI — in minutes, not days
        </div>

        {/* Feature pills */}
        <div style={{ display: "flex", gap: 12, marginTop: 40 }}>
          {["AI Site Generator", "Drag & Drop Editor", "One-Click Deploy", "Custom Domains"].map((f) => (
            <div
              key={f}
              style={{
                padding: "8px 16px",
                borderRadius: 999,
                background: "rgba(99, 102, 241, 0.15)",
                border: "1px solid rgba(99, 102, 241, 0.3)",
                color: "#a5b4fc",
                fontSize: 16,
                fontWeight: 500,
              }}
            >
              {f}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
