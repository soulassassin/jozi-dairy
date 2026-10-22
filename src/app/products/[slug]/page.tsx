import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import ProductDetailView from "@/components/ProductDetailView";
import { PRODUCT_DETAILS } from "@/data/dairyData";

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

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug === "cheese") {
    return {
      title: "Wholesale & Artisanal Cheese | Jozi Dairy",
    };
  }

  const resolved = resolveProductSlug(slug);
  const product = PRODUCT_DETAILS[resolved];

  if (!product) {
    return {
      title: "Product Not Found | Jozi Dairy",
    };
  }

  return {
    title: `${product.name} Wholesale & Retail Supply | Jozi Dairy Midrand`,
    description: `${product.subtitle}. Sourced fresh and cold-chain distributed across Johannesburg and Gauteng.`,
    keywords: [
      `${product.name} supplier`,
      `${product.name} Johannesburg`,
      `${product.name} bulk supply`,
      "Jozi Dairy products",
      "Dairy supplier Midrand",
    ],
    alternates: {
      canonical: `https://www.jozidairy.co.za/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.name} | Jozi Dairy Distribution`,
      description: product.subtitle,
      url: `https://www.jozidairy.co.za/products/${product.slug}`,
      siteName: "Jozi Dairy",
      images: [
        {
          url: product.image,
          width: 800,
          height: 600,
          alt: product.name,
        },
      ],
      locale: "en_ZA",
      type: "website",
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

  return <ProductDetailView product={product} />;
}
