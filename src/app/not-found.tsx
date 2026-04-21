import React from "react";
import Link from "next/link";
import { Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0F0F0F] flex flex-col items-center justify-center px-4 text-center">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12 group">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="text-white font-bold text-xl tracking-tight">
          Build<span className="text-indigo-400">Stack</span>
        </span>
      </Link>

      {/* 404 */}
      <div className="text-[120px] font-black text-white/5 leading-none select-none mb-4">
        404
      </div>

      <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
      <p className="text-white/50 text-lg mb-10 max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium transition-colors border border-white/10"
        >
          Go Home
        </Link>
        <Link
          href="/dashboard"
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
