import React from "react";
import Link from "next/link";
import { ArrowRight, Clock, Tag } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "The latest news, tutorials, and updates from Webperia.",
};

const POSTS = [
  {
    slug: "introducing-ai-site-generator",
    title: "Introducing AI Site Generator: Build a Website in 30 Seconds",
    excerpt: "Today we're launching the most powerful feature in Webperia's history. Describe your website in plain English and our AI will generate a complete, customized site ready to publish.",
    category: "Product",
    readTime: "4 min read",
    date: "Mar 12, 2026",
    gradient: "from-indigo-500 to-violet-600",
    featured: true,
    author: { name: "Alex Chen", initials: "AC", color: "bg-indigo-500" },
  },
  {
    slug: "10-design-tips-high-converting-pages",
    title: "10 Design Tips for High-Converting Landing Pages",
    excerpt: "Learn the proven design principles that top SaaS companies use to turn visitors into customers. From hero sections to CTA buttons, every detail matters.",
    category: "Design",
    readTime: "7 min read",
    date: "Mar 8, 2026",
    gradient: "from-rose-500 to-pink-600",
    featured: false,
    author: { name: "Sarah Kim", initials: "SK", color: "bg-rose-500" },
  },
  {
    slug: "webflow-vs-buildstack-comparison",
    title: "Webperia vs Webflow: Which Is Right for You in 2026?",
    excerpt: "An honest comparison of two of the most popular website builders. We look at pricing, ease of use, features, and performance to help you make the right choice.",
    category: "Comparison",
    readTime: "10 min read",
    date: "Mar 5, 2026",
    gradient: "from-blue-500 to-cyan-600",
    featured: false,
    author: { name: "Marcus Lee", initials: "ML", color: "bg-blue-500" },
  },
  {
    slug: "custom-domains-ssl-guide",
    title: "Complete Guide to Custom Domains and SSL on Webperia",
    excerpt: "Everything you need to know about connecting your own domain, configuring DNS records, and ensuring your site is secured with HTTPS.",
    category: "Tutorial",
    readTime: "6 min read",
    date: "Feb 28, 2026",
    gradient: "from-emerald-500 to-teal-600",
    featured: false,
    author: { name: "Priya Patel", initials: "PP", color: "bg-emerald-500" },
  },
  {
    slug: "cms-api-release",
    title: "CMS API Now Available for All Business Plans",
    excerpt: "Our headless CMS API is now generally available, giving developers programmatic access to all content collections with full CRUD operations and webhooks.",
    category: "Product",
    readTime: "3 min read",
    date: "Feb 20, 2026",
    gradient: "from-amber-500 to-orange-600",
    featured: false,
    author: { name: "Alex Chen", initials: "AC", color: "bg-amber-500" },
  },
  {
    slug: "seo-optimization-guide",
    title: "The Complete SEO Guide for Your Webperia Website",
    excerpt: "Maximize your search engine visibility with this comprehensive guide covering meta tags, structured data, Core Web Vitals, and link building strategies.",
    category: "Tutorial",
    readTime: "12 min read",
    date: "Feb 14, 2026",
    gradient: "from-violet-500 to-purple-600",
    featured: false,
    author: { name: "Sarah Kim", initials: "SK", color: "bg-violet-500" },
  },
];

const CATEGORIES = ["All", "Product", "Design", "Tutorial", "Comparison"];

const CATEGORY_COLORS: Record<string, string> = {
  Product: "bg-indigo-50 text-indigo-700",
  Design: "bg-rose-50 text-rose-700",
  Tutorial: "bg-emerald-50 text-emerald-700",
  Comparison: "bg-blue-50 text-blue-700",
};

export default function BlogPage() {
  const featured = POSTS.find((p) => p.featured);
  const regular = POSTS.filter((p) => !p.featured);

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 border border-gray-200 text-gray-600 text-sm font-medium mb-6">
            <Tag className="h-3.5 w-3.5 text-primary-500" />
            Blog & Updates
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            The Webperia{" "}
            <span className="bg-gradient-to-r from-primary-500 to-purple-600 bg-clip-text text-transparent">
              Blog
            </span>
          </h1>
          <p className="text-xl text-gray-500 max-w-lg mx-auto">
            Product updates, design tips, tutorials, and industry insights.
          </p>
        </div>

        {/* Category pills */}
        <div className="flex items-center justify-center flex-wrap gap-2 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className="px-4 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-500 hover:text-gray-900 hover:border-gray-400 transition-colors first:bg-gray-100 first:text-gray-900 first:border-gray-300"
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured post */}
        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block group mb-12">
            <div className="rounded-3xl overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-all hover:border-gray-300">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className={`h-64 lg:h-auto bg-gradient-to-br ${featured.gradient} relative min-h-[280px]`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/20 text-9xl font-black select-none">AI</div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm")}>
                      Featured
                    </span>
                  </div>
                </div>
                <div className="p-8 lg:p-10 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-4">
                    <span className={cn("text-xs font-semibold px-2.5 py-1 rounded-full", CATEGORY_COLORS[featured.category] ?? "bg-gray-100 text-gray-600")}>
                      {featured.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="h-3 w-3" />
                      {featured.readTime}
                    </div>
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary-600 transition-colors leading-tight">
                    {featured.title}
                  </h2>
                  <p className="text-gray-500 leading-relaxed mb-6">{featured.excerpt}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold", featured.author.color)}>
                        {featured.author.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">{featured.author.name}</p>
                        <p className="text-xs text-gray-400">{featured.date}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-primary-500 text-sm font-medium group-hover:gap-2 transition-all">
                      Read more <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Regular posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {regular.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="group">
              <article className="h-full rounded-2xl border border-gray-200 bg-white hover:shadow-md hover:border-gray-300 transition-all overflow-hidden flex flex-col">
                <div className={`h-44 bg-gradient-to-br ${post.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-white/10 text-7xl font-black select-none uppercase">
                      {post.category.slice(0, 2)}
                    </div>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600")}>
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                      <Clock className="h-3 w-3" />
                      {post.readTime}
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 flex-1">{post.excerpt}</p>
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className={cn("h-6 w-6 rounded-full flex items-center justify-center text-white text-[9px] font-bold", post.author.color)}>
                        {post.author.initials}
                      </div>
                      <span className="text-xs text-gray-400">{post.date}</span>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="mt-20 rounded-3xl bg-gradient-to-br from-primary-50 via-purple-50 to-white border border-primary-100 p-10 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Never miss a post</h2>
          <p className="text-gray-500 mb-6">Get the latest Webperia updates and tutorials in your inbox.</p>
          <div className="flex gap-2 max-w-sm mx-auto">
            <input
              type="email"
              placeholder="you@example.com"
              className="flex-1 h-11 px-4 rounded-xl bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <button className="h-11 px-5 rounded-xl bg-primary-500 text-white font-semibold text-sm hover:bg-primary-600 transition whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

// cn utility needed for this server component
function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
