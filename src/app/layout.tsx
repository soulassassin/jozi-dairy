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
  openGraph: {
    title: "Jozi Dairy | Farm-Fresh Dairy Delivered Straight to Your Business & Home",
    description:
      "Leading dairy distribution supplier located in Midrand, Johannesburg. Fresh milk, yoghurt, fresh cream, amasi & fruit juices.",
    url: "https://www.jozidairy.co.za",
    siteName: "Jozi Dairy",
    images: [
      {
        url: "/assets/logo-original.jpeg",
        width: 1200,
        height: 630,
        alt: "Jozi Dairy Logo",
      },
    ],
    locale: "en_ZA",
    type: "website",
  },
  icons: {
    icon: "/assets/logo-original.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${jakarta.variable} ${inter.variable}`}>
      <body className="font-sans antialiased selection:bg-jozi-cyan selection:text-white">
        {children}
      </body>
    </html>
  );
}
