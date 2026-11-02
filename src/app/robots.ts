import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/siteUrl";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();

  const privateDisallows = [
    "/api/",
    "/crm",
    "/crm/",
    "/invoices",
    "/invoices/",
  ];

  const aiCrawlers = [
    "GPTBot",
    "ClaudeBot",
    "PerplexityBot",
    "Google-Extended",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privateDisallows,
      },
      {
        userAgent: aiCrawlers,
        allow: "/",
        disallow: privateDisallows,
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
