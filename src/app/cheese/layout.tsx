import type { Metadata } from "next";
import {
  generateCheeseCatalogSchema,
  generateBreadcrumbSchema,
} from "@/lib/seo/schema";

export const metadata: Metadata = {
  title: "Wholesale & Bulk Cheese Selection • Midrand, Johannesburg",
  description:
    "Explore Jozi Dairy's premium South African cheese selection: Mature Yellow Cheddar, Creamy Sweetmilk Gouda wheels, high-heat stretch Mozzarella, and traditional Greek Feta in brine. Daily cold-chain delivery across Gauteng.",
  keywords: [
    "Wholesale cheese Johannesburg",
    "Bulk cheese Midrand",
    "Catering cheddar cheese South Africa",
    "Gouda cheese wheel supplier",
    "Pizza mozzarella bulk supplier Gauteng",
    "Traditional Greek feta in brine",
    "Restaurant cheese supplier Johannesburg",
    "Jozi Dairy cheese",
  ],
  alternates: {
    canonical: "/cheese",
  },
  openGraph: {
    title: "Wholesale & Artisanal Cheese Selection | Jozi Dairy",
    description:
      "Farm-fresh South African Cheddar, Sweetmilk Gouda, Culinary Mozzarella and Traditional Greek Feta. Cold-chain delivery guaranteed from Midrand.",
    url: "/cheese",
    siteName: "Jozi Dairy",
    images: [
      {
        url: "/assets/cheese-hero-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Jozi Dairy Farm-Fresh Wholesale Cheese Range",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Wholesale & Artisanal Cheese Selection | Jozi Dairy",
    description:
      "Farm-fresh South African Cheddar, Sweetmilk Gouda, Culinary Mozzarella and Traditional Greek Feta. Cold-chain delivery guaranteed from Midrand.",
    images: ["/assets/cheese-hero-banner.jpg"],
  },
};

export default function CheeseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cheeseCatalogSchema = generateCheeseCatalogSchema();
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Cheese Selection", url: "/cheese" },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(cheeseCatalogSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      {children}
    </>
  );
}
