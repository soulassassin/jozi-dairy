import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import { getSiteUrl } from "@/lib/seo/siteUrl";
import { generateRootSchema } from "@/lib/seo/schema";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "Jozi Dairy | Fresh Dairy Distribution • Midrand, Johannesburg",
    template: "%s | Jozi Dairy",
  },
  description:
    "Jozi Dairy is a leading milk and dairy distribution company located in Midrand, Johannesburg. Farm-fresh milk sourced directly from Mooi River KZN, yoghurts, fresh cream, amasi, and 100% fruit juice blends.",
  keywords: [
    "Jozi Dairy",
    "Dairy distribution Midrand",
    "Milk supplier Johannesburg",
    "Fresh milk Gauteng",
    "Spring Meadow Dairy",
    "Mooi River milk supplier",
    "Bulk dairy supply",
    "Amasi",
    "Yoghurt supplier",
    "Catering milk distribution",
  ],
  authors: [{ name: "Jozi Dairy" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Jozi Dairy | Farm-Fresh Dairy Delivered Straight to Your Business & Home",
    description:
      "Leading dairy distribution supplier located in Midrand, Johannesburg. Fresh milk, yoghurt, fresh cream, amasi & fruit juices.",
    url: "/",
    siteName: "Jozi Dairy",
    images: [
      {
        url: "/og/home-preview.jpg",
        width: 1200,
        height: 630,
        alt: "Jozi Dairy - Farm-Fresh Milk & Commercial Dairy Distribution Midrand",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jozi Dairy | Fresh Dairy Distribution • Midrand, Johannesburg",
    description:
      "Daily refrigerated delivery of farm-fresh milk, cultured amasi, gourmet yoghurt, and fresh cream across Gauteng.",
    images: ["/og/home-preview.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.ico",
  },
  manifest: "/site.webmanifest",
  other: {
    "geo.region": "ZA-GT",
    "geo.placename": "Midrand, Johannesburg, Gauteng",
    "geo.position": "-25.9984;28.1278",
    "ICBM": "-25.9984, 28.1278",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateRootSchema()).replace(/</g, "\\u003c"),
          }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-jozi-cyan selection:text-white">
        {children}
      </body>
    </html>
  );
}
