"use client";

import React, { useState } from "react";
import { User, Bell, Shield, Puzzle, Globe, Save, Upload, Eye, EyeOff, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TABS = [
  { id: "general", label: "General", icon: Globe },
  { id: "profile", label: "Profile", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "security", label: "Security", icon: Shield },
  { id: "integrations", label: "Integrations", icon: Puzzle },
];


export default function SettingsPage() {
  const [tab, setTab] = useState("general");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your account preferences and integrations</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <nav className="w-48 shrink-0 space-y-0.5">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left",
                tab === t.id ? "bg-indigo-50 text-indigo-700" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              <t.icon className={cn("h-4 w-4", tab === t.id ? "text-indigo-600" : "text-gray-400")} />
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-5">

          {/* ── General ── */}
          {tab === "general" && <ComingSoon feature="General Settings" />}

          {/* ── Profile ── */}
          {tab === "profile" && (
            <>
              <Section title="Profile">
                <div className="flex items-center gap-4 mb-2">
                  <div className="h-16 w-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xl">JD</div>
                  <Button variant="outline" size="sm">
                    <Upload className="h-3.5 w-3.5 mr-1.5" /> Upload Photo
                  </Button>
                </div>
                <Field label="Full name">
                  <input defaultValue="John Doe" className={inputCls} />
                </Field>
                <Field label="Email">
                  <input defaultValue="john@company.com" className={inputCls} readOnly />
                  <p className="text-xs text-gray-400 mt-1">Managed by your auth provider</p>
                </Field>
                <Field label="Bio">
                  <textarea rows={3} defaultValue="Building great products." className={inputCls + " resize-none"} />
                </Field>
                <Field label="Website">
                  <input defaultValue="https://johndoe.com" className={inputCls} />
                </Field>
              </Section>
              <Button onClick={() => toast.success("Profile saved")} className="gap-2">
                <Save className="h-4 w-4" /> Save Profile
              </Button>
            </>
          )}

          {/* ── Notifications ── */}
          {tab === "notifications" && <ComingSoon feature="Email Notifications" />}

          {/* ── Security ── */}
          {tab === "security" && (
            <>
              <Section title="Change Password">
                <Field label="Current password">
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} className={inputCls + " pr-10"} placeholder="••••••••••" />
                    <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowPassword((v) => !v)}>
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </Field>
                <Field label="New password">
                  <input type="password" className={inputCls} placeholder="••••••••••" />
                </Field>
                <Field label="Confirm new password">
                  <input type="password" className={inputCls} placeholder="••••••••••" />
                </Field>
                <Button onClick={() => toast.success("Password updated")} className="gap-2">
                  <Shield className="h-4 w-4" /> Update Password
                </Button>
              </Section>

              <ComingSoon feature="Two-Factor Authentication" />
              <ComingSoon feature="Active Sessions" />
            </>
          )}

          {/* ── Integrations ── */}
          {tab === "integrations" && <ComingSoon feature="Integrations" />}
        </div>
      </div>
    </div>
  );
}

function ComingSoon({ feature }: { feature: string }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-10 flex flex-col items-center justify-center text-center gap-3">
      <div className="h-11 w-11 rounded-2xl bg-amber-50 flex items-center justify-center">
        <Clock className="h-5 w-5 text-amber-500" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{feature} — Coming Soon</p>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">This feature is under development and will be available in a future update.</p>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <h2 className="text-sm font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      {children}
    </div>
  );
}

const inputCls = "w-full h-9 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all";
