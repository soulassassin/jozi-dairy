import type { MetadataRoute } from "next";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { PRODUCT_DETAILS } from "@/data/dairyData";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getSiteUrl();
  const currentDate = new Date();

  const productEntries: MetadataRoute.Sitemap = Object.values(PRODUCT_DETAILS).map(
    (product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: currentDate,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })
  );

  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/cheese`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...productEntries,
  ];
}
