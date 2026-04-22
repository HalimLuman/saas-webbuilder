"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2, Github, AlertCircle, CheckCircle2 } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { AuthLayout } from "../auth-layout";

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px bg-gray-200" />
      <span className="text-gray-400 text-xs font-medium">or continue with email</span>
      <div className="flex-1 h-px bg-gray-200" />
    </div>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState<"credentials" | "unconfirmed" | "other" | null>(null);
  const [resendSent, setResendSent] = useState(false);

  const supabase = createSupabaseBrowserClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setErrorType(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      if (
        error.message.toLowerCase().includes("email not confirmed") ||
        error.message.toLowerCase().includes("email_not_confirmed")
      ) {
        setErrorType("unconfirmed");
        setError("Your email hasn't been confirmed yet. Check your inbox for the confirmation link.");
      } else if (
        error.message.toLowerCase().includes("invalid login credentials") ||
        error.message.toLowerCase().includes("invalid_credentials")
      ) {
        setErrorType("credentials");
        setError("Incorrect email or password. Double-check and try again.");
      } else {
        setErrorType("other");
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    router.push(next);
    router.refresh();
  }

  async function handleResendConfirmation() {
    setResendSent(false);
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (!error) setResendSent(true);
  }

  async function handleOAuth(provider: "google" | "github") {
    setOauthLoading(provider);
    setError("");
    setErrorType(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${next}` },
    });
    if (error) {
      setError(error.message);
      setErrorType("other");
      setOauthLoading(null);
    }
  }

  return (
    <div>
      {/* OAuth */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => handleOAuth("google")}
          disabled={!!oauthLoading}
          className="flex items-center justify-center gap-2.5 h-11 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
        >
          {oauthLoading === "google" ? <Loader2 className="h-4 w-4 animate-spin" /> : <GoogleIcon />}
          Google
        </button>
        <button
          onClick={() => handleOAuth("github")}
          disabled={!!oauthLoading}
          className="flex items-center justify-center gap-2.5 h-11 rounded-lg border border-gray-200 bg-white text-gray-700 text-sm font-medium hover:bg-gray-50 hover:border-gray-300 transition-all disabled:opacity-50"
        >
          {oauthLoading === "github" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4 text-gray-800" />}
          GitHub
        </button>
      </div>

      <Divider />

      {/* Error banner */}
      {error && (
        <div className={`mb-5 px-4 py-3 rounded-xl text-sm flex items-start gap-2.5 ${
          errorType === "unconfirmed"
            ? "bg-amber-50 border border-amber-200 text-amber-800"
            : "bg-red-50 border border-red-200 text-red-700"
        }`}>
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p>{error}</p>
            {errorType === "unconfirmed" && (
              <div className="mt-2">
                {resendSent ? (
                  <span className="flex items-center gap-1 text-green-600 text-xs">
                    <CheckCircle2 className="h-3 w-3 shrink-0" /> Confirmation email resent!
                  </span>
                ) : (
                  <button
                    onClick={handleResendConfirmation}
                    className="text-xs underline hover:no-underline text-amber-700"
                  >
                    Resend confirmation email
                  </button>
                )}
              </div>
            )}
            {errorType === "credentials" && (
              <p className="mt-1 text-xs opacity-75">
                New here?{" "}
                <Link href="/signup" className="underline hover:no-underline">Create an account</Link>
              </p>
            )}
          </div>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handlePasswordLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full h-11 px-3.5 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Link
              href="/reset-password"
              className="text-xs text-indigo-600 hover:text-indigo-500 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="w-full h-11 px-3.5 pr-10 rounded-lg border border-gray-200 bg-white text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-indigo-600 hover:text-indigo-500 font-semibold transition-colors">
          Sign up free
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthLayout heading="Welcome back" subheading="Sign in to your Webperia account">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
