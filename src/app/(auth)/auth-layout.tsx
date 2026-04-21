import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

const FEATURES = [
  "Drag-and-drop visual editor",
  "Publish with one click",
  "Custom domains & SSL included",
  "Team collaboration built in",
];

interface AuthLayoutProps {
  children: React.ReactNode;
  heading: string;
  subheading: string;
}

export function AuthLayout({ children, heading, subheading }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      {/* ── Left brand panel (desktop only) ─────────────────────────────── */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[480px] shrink-0 flex-col bg-[#09090f] relative overflow-hidden">
        {/* Ambient blobs */}
        <div className="absolute -top-32 -left-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-16 w-80 h-80 bg-purple-700/15 rounded-full blur-3xl pointer-events-none" />
        {/* Dot-grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.06]"
          style={{
            backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10 flex flex-col h-full p-10 xl:p-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 w-fit">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">BuildStack</span>
          </Link>

          {/* Middle copy */}
          <div className="flex-1 flex flex-col justify-center">
            <div className="max-w-xs">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-3 py-1 mb-6">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                <span className="text-indigo-300 text-xs font-medium">No credit card required</span>
              </div>

              <h2 className="text-3xl xl:text-4xl font-bold text-white leading-[1.2] mb-5">
                Build beautiful websites in minutes
              </h2>
              <p className="text-white/45 text-sm leading-relaxed mb-10">
                The visual website builder for teams who move fast. Design, publish, and iterate — all in one place.
              </p>

              <ul className="space-y-3.5">
                {FEATURES.map((feat) => (
                  <li key={feat} className="flex items-center gap-3">
                    <span className="h-5 w-5 rounded-full bg-indigo-500/15 border border-indigo-500/25 flex items-center justify-center shrink-0">
                      <svg className="h-2.5 w-2.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className="text-white/65 text-sm">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <p className="text-white/20 text-xs">© {new Date().getFullYear()} BuildStack. All rights reserved.</p>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Mobile top-bar */}
        <div className="lg:hidden flex items-center justify-center pt-8 pb-2">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">BuildStack</span>
          </Link>
        </div>

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-5 sm:px-8 py-10">
          <div className="w-full max-w-[400px]">
            <div className="mb-8">
              <h1 className="text-[1.6rem] font-bold text-gray-900 leading-tight mb-1.5">{heading}</h1>
              <p className="text-gray-500 text-sm">{subheading}</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
