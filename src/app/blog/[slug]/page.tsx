import React from "react";
import Link from "next/link";
import { ArrowLeft, Clock, Tag, Share2, Twitter, Linkedin, Link2 } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const POSTS: Record<string, {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  date: string;
  gradient: string;
  author: { name: string; initials: string; color: string; role: string };
  content: { type: "h2" | "h3" | "p" | "ul" | "blockquote" | "code"; text: string; items?: string[] }[];
}> = {
  "introducing-ai-site-generator": {
    slug: "introducing-ai-site-generator",
    title: "Introducing AI Site Generator: Build a Website in 30 Seconds",
    excerpt: "Today we're launching the most powerful feature in Webperia's history. Describe your website in plain English and our AI will generate a complete, customized site ready to publish.",
    category: "Product",
    readTime: "4 min read",
    date: "Mar 12, 2026",
    gradient: "from-indigo-500 to-violet-600",
    author: { name: "Alex Chen", initials: "AC", color: "bg-indigo-500", role: "Co-founder & CEO" },
    content: [
      { type: "p", text: "Building a website used to take days. With today's launch of AI Site Generator, it takes 30 seconds." },
      { type: "p", text: "We've spent the last year training our AI on thousands of high-performing websites across every industry. The result is a system that doesn't just generate placeholder content — it understands design principles, conversion optimization, and your specific business context." },
      { type: "h2", text: "How It Works" },
      { type: "p", text: "Just describe what you want in plain English. Something like 'A modern SaaS landing page for a project management tool targeting remote teams' is enough to generate a complete, publish-ready website." },
      { type: "ul", text: "", items: [
        "Describe your website in 1–3 sentences",
        "Choose your style: Modern, Bold, Dark, or Playful",
        "Select a color palette",
        "Click Generate — your site is ready in under 30 seconds",
      ]},
      { type: "h2", text: "What Gets Generated" },
      { type: "p", text: "The AI doesn't just drop in placeholder text. It generates contextually relevant copy, selects appropriate section layouts, and even suggests images based on your industry. Every generated site includes:" },
      { type: "ul", text: "", items: [
        "A hero section with headline, subheading, and primary CTA",
        "Features section tailored to your product category",
        "Social proof (testimonials, logos, or stats) appropriate for your audience",
        "Pricing section if relevant to your use case",
        "Contact or conversion section",
        "Fully mobile-responsive layout",
      ]},
      { type: "h2", text: "Edit Anything" },
      { type: "p", text: "Every AI-generated site opens directly in our visual editor. Every element is fully editable — drag to reorder, click to change copy, swap colors, and add or remove sections as you see fit." },
      { type: "blockquote", text: "The AI gives you a strong starting point. You take it from there. Most users publish with fewer than 5 edits." },
      { type: "h2", text: "Available Today" },
      { type: "p", text: "AI Site Generator is available to all Pro and Business plan users starting today. Free plan users get 3 AI generations per month. Head to your dashboard and click 'AI Generate' to try it now." },
    ],
  },
  "10-design-tips-high-converting-pages": {
    slug: "10-design-tips-high-converting-pages",
    title: "10 Design Tips for High-Converting Landing Pages",
    excerpt: "Learn the proven design principles that top SaaS companies use to turn visitors into customers. From hero sections to CTA buttons, every detail matters.",
    category: "Design",
    readTime: "7 min read",
    date: "Mar 8, 2026",
    gradient: "from-rose-500 to-pink-600",
    author: { name: "Sarah Kim", initials: "SK", color: "bg-rose-500", role: "Head of Design" },
    content: [
      { type: "p", text: "Landing pages with strong design convert at 3–5x the rate of average pages. Here are the 10 principles we've seen make the biggest difference." },
      { type: "h2", text: "1. Lead With the Value Proposition" },
      { type: "p", text: "Your headline has 3 seconds to communicate exactly what you do and who it's for. Avoid clever wordplay — clarity converts better than creativity every time." },
      { type: "h2", text: "2. Single Primary CTA" },
      { type: "p", text: "Every page should have one primary action you want visitors to take. Multiple CTAs dilute attention. If you have secondary actions, make them visually subordinate." },
      { type: "h2", text: "3. Social Proof Above the Fold" },
      { type: "p", text: "Trust signals — customer logos, review counts, user stats — should appear within the first screen. Don't make visitors scroll to find evidence that others trust you." },
      { type: "h2", text: "4. Use Real Numbers" },
      { type: "p", text: "\"Trusted by thousands\" is meaningless. \"Trusted by 12,847 founders\" is compelling. Specificity builds credibility." },
      { type: "ul", text: "", items: [
        "User counts with exact figures",
        "Revenue numbers if impressive",
        "Time saved (e.g., '2.5 hours/week saved on average')",
        "Customer satisfaction scores",
      ]},
      { type: "h2", text: "5. Visual Hierarchy Guides the Eye" },
      { type: "p", text: "Size, weight, color, and spacing should direct the visitor's eye from headline → subheading → CTA. If everything is bold, nothing is bold." },
      { type: "h2", text: "6. Mobile-First, Always" },
      { type: "p", text: "Over 60% of web traffic is mobile. Design for the small screen first, then enhance for desktop. Button tap targets should be at least 44×44px." },
      { type: "h2", text: "7. Fast Load Times" },
      { type: "p", text: "Each additional second of load time reduces conversion by ~7%. Optimize images, minimize JavaScript, and use a CDN." },
      { type: "h2", text: "8. Eliminate Friction From Forms" },
      { type: "p", text: "Every field you remove increases completion rates. For initial signups, ask only for email. Collect more information after the user has experienced value." },
      { type: "h2", text: "9. Answer Objections Proactively" },
      { type: "p", text: "FAQ sections, pricing transparency, and risk-reduction copy (free trial, no credit card, cancel anytime) address the doubts that stop people from signing up." },
      { type: "h2", text: "10. Test Everything" },
      { type: "p", text: "The best-performing pages are the result of many small tests. Start with the headline — a 10% improvement there compounds across everything else on the page." },
      { type: "blockquote", text: "Design isn't about beauty. It's about removing obstacles between your visitor and the action you want them to take." },
    ],
  },
  "webflow-vs-buildstack-comparison": {
    slug: "webflow-vs-buildstack-comparison",
    title: "Webperia vs Webflow: Which Is Right for You in 2026?",
    excerpt: "An honest comparison of two of the most popular website builders. We look at pricing, ease of use, features, and performance to help you make the right choice.",
    category: "Comparison",
    readTime: "10 min read",
    date: "Mar 5, 2026",
    gradient: "from-blue-500 to-cyan-600",
    author: { name: "Marcus Lee", initials: "ML", color: "bg-blue-500", role: "Product Manager" },
    content: [
      { type: "p", text: "Both Webperia and Webflow are excellent website builders, but they're designed for different users. Here's our honest take on who should use which." },
      { type: "h2", text: "Learning Curve" },
      { type: "p", text: "Webflow has a steeper learning curve — it exposes CSS concepts directly in the UI, which gives experts precise control but intimidates beginners. Webperia is designed for anyone to get a professional site live in under an hour, without needing to understand box models or flexbox." },
      { type: "h2", text: "AI-Powered Features" },
      { type: "p", text: "Webperia's AI Site Generator has no direct Webflow equivalent. If you want to go from idea to live site in 30 seconds, Webperia wins decisively." },
      { type: "h2", text: "Pricing" },
      { type: "ul", text: "", items: [
        "Webperia Free: Unlimited sites on *.buildstack.site subdomains",
        "Webperia Pro: $19/month — custom domains, advanced analytics",
        "Webflow Starter: $14/month — 2 projects only",
        "Webflow Basic: $23/month — 1 site with custom domain",
        "Webflow Business: $39/month — 3 sites",
      ]},
      { type: "h2", text: "CMS Capabilities" },
      { type: "p", text: "Webflow's CMS is more mature and feature-rich, with robust collection relationships and a polished editorial experience. Webperia's CMS is strong for most use cases and includes an API on the Business plan." },
      { type: "h2", text: "The Verdict" },
      { type: "p", text: "Choose Webflow if you're a developer or designer who wants pixel-perfect control and a mature CMS. Choose Webperia if you want to ship fast, leverage AI, and don't need to spend a week learning the tool." },
      { type: "blockquote", text: "The best website builder is the one you'll actually use. Webperia is built for shipping, Webflow is built for crafting." },
    ],
  },
  "custom-domains-ssl-guide": {
    slug: "custom-domains-ssl-guide",
    title: "Complete Guide to Custom Domains and SSL on Webperia",
    excerpt: "Everything you need to know about connecting your own domain, configuring DNS records, and ensuring your site is secured with HTTPS.",
    category: "Tutorial",
    readTime: "6 min read",
    date: "Feb 28, 2026",
    gradient: "from-emerald-500 to-teal-600",
    author: { name: "Priya Patel", initials: "PP", color: "bg-emerald-500", role: "Developer Relations" },
    content: [
      { type: "p", text: "Connecting a custom domain to your Webperia site takes about 5 minutes to set up, though DNS propagation can take up to 48 hours." },
      { type: "h2", text: "Step 1: Add Your Domain" },
      { type: "p", text: "Navigate to Dashboard → Domains and enter your domain name (e.g., www.yourdomain.com). Click 'Add Domain' to continue." },
      { type: "h2", text: "Step 2: Configure DNS Records" },
      { type: "p", text: "Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add these records:" },
      { type: "ul", text: "", items: [
        "A record: @ → 76.76.21.21 (TTL: 3600)",
        "CNAME record: www → cname.buildstack.site (TTL: 3600)",
      ]},
      { type: "h2", text: "Step 3: Wait for Propagation" },
      { type: "p", text: "DNS changes propagate globally within 24–48 hours, though most records update within 30 minutes. You can check propagation status at whatsmydns.net." },
      { type: "h2", text: "SSL Certificates" },
      { type: "p", text: "Webperia automatically provisions a free SSL certificate via Let's Encrypt as soon as DNS propagation completes. No configuration required — HTTPS is enabled automatically." },
      { type: "blockquote", text: "SSL is non-negotiable in 2026. Google penalizes non-HTTPS sites in search rankings, and modern browsers show security warnings to users." },
      { type: "h2", text: "Troubleshooting" },
      { type: "ul", text: "", items: [
        "If your domain shows 'Pending DNS' after 48 hours, double-check your DNS records",
        "Ensure you've removed any conflicting A records pointing to other hosts",
        "Some registrars require you to remove the default parking records first",
        "Contact support@buildstack.site if you're still having issues",
      ]},
    ],
  },
  "cms-api-release": {
    slug: "cms-api-release",
    title: "CMS API Now Available for All Business Plans",
    excerpt: "Our headless CMS API is now generally available, giving developers programmatic access to all content collections with full CRUD operations and webhooks.",
    category: "Product",
    readTime: "3 min read",
    date: "Feb 20, 2026",
    gradient: "from-amber-500 to-orange-600",
    author: { name: "Alex Chen", initials: "AC", color: "bg-amber-500", role: "Co-founder & CEO" },
    content: [
      { type: "p", text: "Starting today, all Business plan users have access to the Webperia CMS API — a fully RESTful API for reading and writing content collections." },
      { type: "h2", text: "What's Included" },
      { type: "ul", text: "", items: [
        "Full CRUD operations on all collections",
        "Webhooks for create, update, and delete events",
        "API key management in the dashboard",
        "Rate limits: 1,000 requests/minute",
        "Official SDKs for JavaScript and Python (coming soon)",
      ]},
      { type: "h2", text: "Example Request" },
      { type: "code", text: `curl -X GET https://api.buildstack.site/v1/sites/{siteId}/collections/{collectionId}/items \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"` },
      { type: "h2", text: "Getting Started" },
      { type: "p", text: "Head to Dashboard → Settings → API Keys to generate your first API key. Full documentation is available at docs.buildstack.site/api." },
    ],
  },
  "seo-optimization-guide": {
    slug: "seo-optimization-guide",
    title: "The Complete SEO Guide for Your Webperia Website",
    excerpt: "Maximize your search engine visibility with this comprehensive guide covering meta tags, structured data, Core Web Vitals, and link building strategies.",
    category: "Tutorial",
    readTime: "12 min read",
    date: "Feb 14, 2026",
    gradient: "from-violet-500 to-purple-600",
    author: { name: "Sarah Kim", initials: "SK", color: "bg-violet-500", role: "Head of Design" },
    content: [
      { type: "p", text: "SEO in 2026 is less about tricks and more about fundamentals. Here's how to make sure your Webperia site is set up for success in search." },
      { type: "h2", text: "Meta Tags" },
      { type: "p", text: "Every page needs a unique title tag (50–60 characters) and meta description (150–160 characters). These appear in search results and directly impact click-through rate." },
      { type: "h2", text: "Core Web Vitals" },
      { type: "p", text: "Google's ranking factors now include page experience signals. Aim for these benchmarks:" },
      { type: "ul", text: "", items: [
        "LCP (Largest Contentful Paint): < 2.5 seconds",
        "FID (First Input Delay): < 100ms",
        "CLS (Cumulative Layout Shift): < 0.1",
      ]},
      { type: "h2", text: "Structured Data" },
      { type: "p", text: "Schema.org markup helps Google understand your content and can unlock rich results (stars, prices, FAQs) in search results. Webperia's editor lets you add structured data to any page." },
      { type: "h2", text: "Content Strategy" },
      { type: "p", text: "The most sustainable SEO strategy is publishing high-quality content that genuinely answers questions your audience is searching for. Aim for depth over quantity." },
      { type: "h2", text: "Link Building" },
      { type: "p", text: "Backlinks remain one of Google's strongest ranking signals. The best links come from being mentioned in press, creating shareable resources, and building genuine relationships with other site owners." },
      { type: "blockquote", text: "SEO is a long game. The sites ranking at the top today started building their authority 2–3 years ago. Start now." },
      { type: "h2", text: "Technical SEO Checklist" },
      { type: "ul", text: "", items: [
        "XML sitemap submitted to Google Search Console",
        "robots.txt configured correctly",
        "All pages have canonical URLs",
        "No broken internal links",
        "Images have descriptive alt text",
        "Page speed score above 90 on PageSpeed Insights",
      ]},
    ],
  },
};

const CATEGORY_COLORS: Record<string, string> = {
  Product:    "bg-indigo-900/50 text-indigo-300 border-indigo-700",
  Design:     "bg-rose-900/50 text-rose-300 border-rose-700",
  Tutorial:   "bg-emerald-900/50 text-emerald-300 border-emerald-700",
  Comparison: "bg-blue-900/50 text-blue-300 border-blue-700",
};

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  return Object.keys(POSTS).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) return { title: "Post Not Found" };
  return {
    title: post.title,
    description: post.excerpt,
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = POSTS[slug];
  if (!post) notFound();

  const relatedPosts = Object.values(POSTS)
    .filter((p) => p.slug !== post.slug && p.category === post.category)
    .slice(0, 2);

  const otherPosts = relatedPosts.length < 2
    ? [
        ...relatedPosts,
        ...Object.values(POSTS)
          .filter((p) => p.slug !== post.slug && !relatedPosts.find((r) => r.slug === p.slug))
          .slice(0, 2 - relatedPosts.length),
      ]
    : relatedPosts;

  return (
    <div className="bg-white min-h-screen">
      <Navbar />

      {/* Hero banner */}
      <div className={`bg-gradient-to-br ${post.gradient} pt-32 pb-16`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/80 hover:text-white text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Blog
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${CATEGORY_COLORS[post.category] ?? "bg-white/20 text-white border-white/30"}`}>
              {post.category}
            </span>
            <div className="flex items-center gap-1.5 text-white/70 text-sm">
              <Clock className="h-3.5 w-3.5" />
              {post.readTime}
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
            {post.title}
          </h1>

          <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-3xl">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${post.author.color}`}>
                {post.author.initials}
              </div>
              <div>
                <p className="text-white font-semibold text-sm">{post.author.name}</p>
                <p className="text-white/60 text-xs">{post.author.role} · {post.date}</p>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs mr-1">Share</span>
              <button className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" title="Share on Twitter">
                <Twitter className="h-3.5 w-3.5 text-white" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" title="Share on LinkedIn">
                <Linkedin className="h-3.5 w-3.5 text-white" />
              </button>
              <button className="h-8 w-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors" title="Copy link">
                <Link2 className="h-3.5 w-3.5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-12">

          {/* Main content */}
          <article className="prose-custom">
            {post.content.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2 key={i} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "h3") {
                return (
                  <h3 key={i} className="text-xl font-bold text-gray-900 mt-8 mb-3">
                    {block.text}
                  </h3>
                );
              }
              if (block.type === "p") {
                return (
                  <p key={i} className="text-gray-600 leading-relaxed mb-5 text-[15px]">
                    {block.text}
                  </p>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="space-y-2 mb-6 pl-4">
                    {(block.items ?? []).map((item, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-gray-600 text-[15px]">
                        <span className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-2 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "blockquote") {
                return (
                  <blockquote key={i} className="border-l-2 border-primary-300 pl-5 my-7">
                    <p className="text-gray-500 italic leading-relaxed text-[15px]">{block.text}</p>
                  </blockquote>
                );
              }
              if (block.type === "code") {
                return (
                  <pre key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-4 overflow-x-auto mb-6">
                    <code className="text-green-400 text-sm font-mono whitespace-pre">{block.text}</code>
                  </pre>
                );
              }
              return null;
            })}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Author card */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Author</p>
              <div className="flex items-center gap-3 mb-3">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white text-sm font-bold ${post.author.color}`}>
                  {post.author.initials}
                </div>
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{post.author.name}</p>
                  <p className="text-gray-400 text-xs">{post.author.role}</p>
                </div>
              </div>
            </div>

            {/* Table of contents */}
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">In This Article</p>
              <ul className="space-y-2">
                {post.content
                  .filter((b) => b.type === "h2")
                  .map((b, i) => (
                    <li key={i}>
                      <span className="text-sm text-gray-500 hover:text-gray-900 transition-colors cursor-pointer leading-snug block">
                        {b.text}
                      </span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="rounded-2xl border border-primary-200 bg-gradient-to-br from-primary-50 to-white p-5">
              <p className="text-sm font-bold text-gray-900 mb-1">Try Webperia Free</p>
              <p className="text-xs text-gray-500 mb-4">Build your first site in minutes. No credit card required.</p>
              <Link
                href="/signup"
                className="block w-full text-center py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold transition-colors"
              >
                Get Started Free
              </Link>
            </div>
          </aside>
        </div>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-6">More Posts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {otherPosts.map((related) => (
                <Link key={related.slug} href={`/blog/${related.slug}`} className="group">
                  <div className="rounded-2xl border border-gray-200 bg-white hover:shadow-sm hover:border-gray-300 transition-all overflow-hidden flex gap-4 p-4">
                    <div className={`h-16 w-16 rounded-xl bg-gradient-to-br ${related.gradient} shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">{related.category} · {related.readTime}</p>
                      <h3 className="text-sm font-semibold text-gray-900 group-hover:text-primary-600 transition-colors leading-snug line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
