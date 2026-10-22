import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wholesale & Bulk Cheese Selection | Jozi Dairy Midrand, Johannesburg",
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
    canonical: "https://www.jozidairy.co.za/cheese",
  },
  openGraph: {
    title: "Wholesale & Artisanal Cheese Selection | Jozi Dairy",
    description:
      "Farm-fresh South African Cheddar, Sweetmilk Gouda, Culinary Mozzarella and Traditional Greek Feta. Cold-chain delivery guaranteed from Midrand.",
    url: "https://www.jozidairy.co.za/cheese",
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
};

export default function CheeseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
