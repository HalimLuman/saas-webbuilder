import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://buildstack.site";

  const staticPages = [
    { url: baseUrl, priority: 1.0, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/pricing`, priority: 0.9, changeFrequency: "monthly" as const },
    { url: `${baseUrl}/templates`, priority: 0.8, changeFrequency: "weekly" as const },
    { url: `${baseUrl}/blog`, priority: 0.8, changeFrequency: "daily" as const },
    { url: `${baseUrl}/changelog`, priority: 0.6, changeFrequency: "weekly" as const },
  ];

  const blogPosts = [
    "introducing-ai-site-generator",
    "10-design-tips-high-converting-pages",
    "webflow-vs-buildstack-comparison",
    "custom-domains-ssl-guide",
    "cms-api-release",
    "seo-optimization-guide",
  ].map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    priority: 0.7,
    changeFrequency: "monthly" as const,
  }));

  return [...staticPages, ...blogPosts].map((page) => ({
    url: page.url,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
  }));
}
