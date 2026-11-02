import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { PRODUCT_DETAILS } from "@/data/dairyData";
import { getAbsoluteUrl } from "@/lib/seo/siteUrl";
import {
  generateProductSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
} from "@/lib/seo/schema";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return [
    { slug: "fresh-milk" },
    { slug: "yoghurt" },
    { slug: "fresh-cream" },
    { slug: "amasi" },
    { slug: "juice" },
    { slug: "dairy-blend" },
  ];
}

function resolveProductSlug(rawSlug: string): string {
  if (rawSlug === "amasi-buttermilk") return "amasi";
  if (rawSlug === "spring-meadow-juice") return "juice";
  return rawSlug;
}

const PRODUCT_OG_PREVIEWS: Record<string, string> = {
  "fresh-milk": "/og/milk-preview.jpg",
  yoghurt: "/og/yoghurt-preview.jpg",
  amasi: "/og/amasi-preview.jpg",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "cheese") {
    return {
      title: "Wholesale & Artisanal Cheese",
    };
  }

  const resolved = resolveProductSlug(slug);
  const product = PRODUCT_DETAILS[resolved];

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  const ogImageUrl = PRODUCT_OG_PREVIEWS[resolved] || product.image;

  return {
    title: `${product.name} Wholesale & Retail Supply • Midrand`,
    description: `${product.subtitle}. Sourced fresh and cold-chain distributed across Johannesburg and Gauteng.`,
    keywords: [
      `${product.name} supplier`,
      `${product.name} Johannesburg`,
      `${product.name} bulk supply`,
      "Jozi Dairy products",
      "Dairy supplier Midrand",
    ],
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Jozi Dairy Distribution`,
      description: product.subtitle,
      url: `/products/${product.slug}`,
      siteName: "Jozi Dairy",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: product.name,
        },
      ],
      locale: "en_ZA",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.name} Wholesale & Retail Supply | Jozi Dairy`,
      description: product.subtitle,
      images: [ogImageUrl],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug === "cheese") {
    redirect("/cheese");
  }

  const resolved = resolveProductSlug(slug);
  const product = PRODUCT_DETAILS[resolved];

  if (!product) {
    notFound();
  }

  const productUrl = getAbsoluteUrl(`/products/${product.slug}`);

  const productSchema = generateProductSchema(product);
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Products", url: "/#products" },
    { name: product.name, url: `/products/${product.slug}` },
  ]);
  const faqSchema =
    product.faqs && product.faqs.length > 0
      ? generateFAQSchema(product.faqs, productUrl)
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productSchema).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <ProductDetailView product={product} />
    </>
  );
}
