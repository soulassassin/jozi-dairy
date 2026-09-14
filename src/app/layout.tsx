import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
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
  metadataBase: new URL("https://www.jozidairy.co.za"),
  title: "Jozi Dairy | Fresh Dairy Distribution • Midrand, Johannesburg",
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
    canonical: "https://www.jozidairy.co.za",
  },
  openGraph: {
    title: "Jozi Dairy | Farm-Fresh Dairy Delivered Straight to Your Business & Home",
    description:
      "Leading dairy distribution supplier located in Midrand, Johannesburg. Fresh milk, yoghurt, fresh cream, amasi & fruit juices.",
    url: "https://www.jozidairy.co.za",
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

const jsonLdData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WholesaleStore",
      "@id": "https://www.jozidairy.co.za/#wholesaleStore",
      "name": "Jozi Dairy",
      "legalName": "Jozi Dairy Distribution",
      "url": "https://www.jozidairy.co.za",
      "logo": "https://www.jozidairy.co.za/assets/logo.svg",
      "image": "https://www.jozidairy.co.za/assets/logo-original.jpeg",
      "description": "Leading commercial dairy distributor in Midrand, Johannesburg. Sourcing farm-fresh milk, cultured amasi, gourmet yoghurt, and fresh cream from Mooi River, KZN.",
      "telephone": "+27-11-805-1355",
      "email": "operations@jozidairy.co.za",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "The Home Gallery, 124 Richards Drive, Halfway House",
        "addressLocality": "Midrand",
        "addressRegion": "Gauteng",
        "postalCode": "1685",
        "addressCountry": "ZA"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": -25.9984,
        "longitude": 28.1278
      },
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "08:00",
          "closes": "17:00"
        }
      ],
      "areaServed": ["Johannesburg", "Midrand", "Sandton", "Centurion", "Pretoria", "Gauteng"],
      "sameAs": [
        "https://fb.me/jozidairy",
        "https://www.instagram.com/jozi_dairy/",
        "https://wa.me/27652342460"
      ],
      "priceRange": "ZAR"
    },
    {
      "@type": "FAQPage",
      "@id": "https://www.jozidairy.co.za/#faq",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What regions in Gauteng does Jozi Dairy deliver to?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Jozi Dairy operates daily refrigerated delivery routes across Midrand, Sandton, Centurion, Pretoria, Randburg, Roodepoort, Rosebank, and Greater Johannesburg."
          }
        },
        {
          "@type": "Question",
          "name": "How do I open a wholesale dairy trade account with Jozi Dairy?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Businesses can apply for a commercial trade account by contacting our sales desk at ashley@jozidairy.co.za or calling 011 805 1355. We offer COD, NET 7, NET 15, and NET 30 payment terms."
          }
        },
        {
          "@type": "Question",
          "name": "Where does Jozi Dairy source its milk?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All fresh milk and cultured dairy is sourced directly from certified pasture farms in Mooi River, KwaZulu-Natal, cold-transported directly to our Midrand hub."
          }
        },
        {
          "@type": "Question",
          "name": "What is the shelf life and storage requirement for your fresh milk?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Our pasteurized fresh milk carries a guaranteed refrigerated shelf life of 12 to 14 days when continuously maintained at or below 4°C."
          }
        },
        {
          "@type": "Question",
          "name": "Can I place urgent milk top-up orders outside of scheduled days?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes. Active commercial clients have direct access to our WhatsApp Operations Hotline on 065 234 2460 for emergency dispatches."
          }
        }
      ]
    }
  ]
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-jozi-cyan selection:text-white">
        {children}
      </body>
    </html>
  );
}
