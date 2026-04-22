import React from "react";
import Link from "next/link";
import { ArrowRight, Check, Zap, MousePointer, Wand2, Globe } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/marketing/hero";
import Features from "@/components/marketing/features";
import Testimonials from "@/components/marketing/testimonials";
import PricingPreview from "@/components/marketing/pricing-preview";
import { Button } from "@/components/ui/button";

const howItWorksSteps = [
  {
    number: "01",
    icon: MousePointer,
    title: "Choose a template or use AI",
    description:
      "Start with one of our 120+ professionally designed templates, or let our AI generate a custom website from your description.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    number: "02",
    icon: Wand2,
    title: "Customize everything",
    description:
      "Drag, drop, and customize every element with our intuitive visual editor. Change colors, fonts, layout — no code needed.",
    gradient: "from-primary-500 to-purple-600",
  },
  {
    number: "03",
    icon: Globe,
    title: "Publish instantly",
    description:
      "Deploy to your custom domain with one click. Your site is served from 200+ edge locations worldwide for blazing-fast performance.",
    gradient: "from-green-500 to-emerald-500",
  },
];

export default function HomePage() {
  return (
    <div className="bg-white min-h-screen">
      <Navbar />
      <Hero />
      <Features />

      {/* How It Works */}
      <section className="py-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-30" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-sm font-medium mb-6">
              <Zap className="h-3.5 w-3.5 text-primary-500" />
              How It Works
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
              Launch in{" "}
              <span className="gradient-text">3 simple steps</span>
            </h2>
            <p className="text-xl text-gray-500 max-w-xl mx-auto">
              From idea to live website in under an hour. Really.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            {howItWorksSteps.map((step) => (
              <div key={step.number} className="relative text-center">
                {/* Step number */}
                <div className="relative inline-flex mb-6">
                  <div className={`h-20 w-20 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center shadow-2xl`}>
                    <step.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white border border-gray-200 shadow-sm flex items-center justify-center">
                    <span className="text-gray-500 text-[10px] font-bold">{step.number}</span>
                  </div>
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <PricingPreview />

      {/* CTA Banner */}
      <section className="py-32 bg-gray-900 relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 via-purple-600/20 to-transparent" />
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-medium mb-8">
            <Zap className="h-3.5 w-3.5" />
            Get started today
          </div>

          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to build your
            <br />
            <span className="gradient-text">next website?</span>
          </h2>

          <p className="text-xl text-white/50 mb-10 max-w-xl mx-auto">
            Join 10,000+ teams who&apos;ve already switched to Webperia.
            Start for free, no credit card required.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button size="xl" className="bg-white text-gray-900 hover:bg-white/90 font-semibold shadow-2xl min-w-[220px]" asChild>
              <Link href="/signup">
                Start Building Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="xl" variant="outline-dark" asChild>
              <Link href="/templates">Browse Templates</Link>
            </Button>
          </div>

          {/* Feature list */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-white/40">
            {[
              "Free forever plan",
              "No credit card required",
              "Cancel anytime",
              "GDPR compliant",
            ].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
