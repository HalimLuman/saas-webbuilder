import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: {
    default: "Webperia - Build Stunning Websites with AI",
    template: "%s | Webperia",
  },
  description:
    "The most powerful website builder with AI-assisted design, drag-and-drop editor, and one-click deployment. Build your next website in minutes.",
  keywords: [
    "website builder",
    "drag and drop",
    "AI website",
    "no-code",
    "SaaS",
    "web design",
  ],
  authors: [{ name: "Webperia Team" }],
  creator: "Webperia",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://webperia.com",
    title: "Webperia - Build Stunning Websites with AI",
    description:
      "The most powerful website builder with AI-assisted design, drag-and-drop editor, and one-click deployment.",
    siteName: "Webperia",
  },
  twitter: {
    card: "summary_large_image",
    title: "Webperia - Build Stunning Websites with AI",
    description:
      "The most powerful website builder with AI-assisted design, drag-and-drop editor, and one-click deployment.",
    creator: "@webperia",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
        <ToastProvider>
          {children}
          <Toaster richColors position="top-right" />
        </ToastProvider>
      </body>
    </html>
  );
}
