import { getSiteUrl, getAbsoluteUrl } from "@/lib/seo/siteUrl";
import {
  COMPANY_INFO,
  CHEESE_VARIETIES,
  DetailedCheese,
  DetailedProduct,
} from "@/data/dairyData";

export type ProductDetail = DetailedProduct;

export type WithContext<T> = T & {
  "@context": "https://schema.org";
};

export interface PostalAddress {
  "@type": "PostalAddress";
  streetAddress: string;
  addressLocality: string;
  addressRegion: string;
  postalCode: string;
  addressCountry: string;
}

export interface GeoCoordinates {
  "@type": "GeoCoordinates";
  latitude: number;
  longitude: number;
}

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string | string[];
  opens: string;
  closes: string;
}

export interface SearchAction {
  "@type": "SearchAction";
  target:
    | {
        "@type": "EntryPoint";
        urlTemplate: string;
      }
    | string;
  "query-input": string;
}

export interface WebSite {
  "@type": "WebSite";
  "@id"?: string;
  url: string;
  name: string;
  description: string;
  inLanguage?: string;
  publisher?: {
    "@id": string;
  };
  potentialAction?: SearchAction;
}

export interface WholesaleStore {
  "@type": "WholesaleStore";
  "@id"?: string;
  name: string;
  legalName?: string;
  url: string;
  logo?: string;
  image?: string;
  description?: string;
  telephone: string;
  email?: string;
  address: PostalAddress;
  geo: GeoCoordinates;
  openingHoursSpecification?: OpeningHoursSpecification[];
  areaServed?: string | string[];
  sameAs?: string[];
  priceRange?: string;
  currenciesAccepted?: string;
  paymentAccepted?: string;
}

export type LocalBusiness = WholesaleStore;

export interface Question {
  "@type": "Question";
  name: string;
  acceptedAnswer: {
    "@type": "Answer";
    text: string;
  };
}

export interface FAQPage {
  "@type": "FAQPage";
  "@id"?: string;
  url?: string;
  mainEntity: Question[];
}

export interface FAQInputItem {
  question?: string;
  answer?: string;
  q?: string;
  a?: string;
  name?: string;
  text?: string;
}

export type FAQInput = FAQInputItem;

export interface BreadcrumbListItem {
  "@type": "ListItem";
  position: number;
  name: string;
  item: string;
}

export interface BreadcrumbList {
  "@type": "BreadcrumbList";
  "@id"?: string;
  itemListElement: BreadcrumbListItem[];
}

export interface PropertyValue {
  "@type": "PropertyValue";
  name: string;
  value: string;
}

export interface Offer {
  "@type": "Offer";
  "@id"?: string;
  name?: string;
  sku?: string;
  price: string | number;
  priceCurrency: "ZAR";
  availability: string;
  url?: string;
  itemCondition?: string;
  priceValidUntil?: string;
  seller?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  category?: string;
}

export interface Product {
  "@type": "Product";
  "@id": string;
  url: string;
  name: string;
  description: string;
  image: string | string[];
  brand: {
    "@type": "Brand" | "Organization";
    name: string;
  };
  category?: string;
  sku?: string;
  mpn?: string;
  offers: Offer | Offer[];
  additionalProperty?: PropertyValue[];
  manufacturer?: {
    "@type": "Organization";
    name: string;
    url?: string;
  };
  audience?: {
    "@type": "BusinessAudience";
    name: string;
  };
}

export interface ItemList {
  "@type": "ItemList";
  "@id"?: string;
  name: string;
  description?: string;
  url?: string;
  numberOfItems?: number;
  itemListElement: any[];
}

/**
 * Safely serializes data to JSON-LD, escaping raw '<' to prevent script breakout.
 */
export function safeJsonLdString(data: any): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

/**
 * Normalizes any relative or absolute URL to an absolute HTTPS URL.
 */
export function toAbsoluteUrl(urlOrPath: string): string {
  const siteUrl = getSiteUrl();
  if (urlOrPath.startsWith("http://") || urlOrPath.startsWith("https://")) {
    return urlOrPath.replace(/\/+$/, "");
  }
  const clean = urlOrPath.startsWith("/") ? urlOrPath : `/${urlOrPath}`;
  if (clean === "/") {
    return siteUrl;
  }
  return `${siteUrl}${clean.replace(/\/+$/, "")}`;
}

/**
 * Generates the Schema.org WebSite structured data markup for Jozi Dairy.
 */
export function generateWebSiteSchema(): WithContext<WebSite> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Jozi Dairy",
    description:
      "Jozi Dairy is a leading milk and dairy distribution company located in Midrand, Johannesburg. Farm-fresh milk sourced directly from Mooi River KZN, yoghurts, fresh cream, amasi, and 100% fruit juice blends.",
    inLanguage: "en-ZA",
    publisher: {
      "@id": `${siteUrl}/#wholesaleStore`,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/?s={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

/**
 * Generates the Schema.org WholesaleStore (LocalBusiness) structured data markup.
 */
export function generateOrganizationSchema(): WithContext<WholesaleStore> {
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "WholesaleStore",
    "@id": `${siteUrl}/#wholesaleStore`,
    name: COMPANY_INFO.name,
    legalName: COMPANY_INFO.legalName,
    url: siteUrl,
    logo: `${siteUrl}/assets/logo.svg`,
    image: `${siteUrl}/assets/logo-original.jpeg`,
    description:
      "Leading commercial dairy distributor in Midrand, Johannesburg. Sourcing farm-fresh milk, cultured amasi, gourmet yoghurt, and fresh cream from Mooi River, KZN.",
    telephone: "+27-11-805-1355",
    email: COMPANY_INFO.emails.operations,
    address: {
      "@type": "PostalAddress",
      streetAddress: "The Home Gallery, 124 Richards Drive, Halfway House",
      addressLocality: "Midrand",
      addressRegion: "Gauteng",
      postalCode: "1685",
      addressCountry: "ZA",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -25.9984,
      longitude: 28.1278,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    areaServed: [
      "Johannesburg",
      "Midrand",
      "Sandton",
      "Centurion",
      "Pretoria",
      "Gauteng",
    ],
    sameAs: [
      COMPANY_INFO.social.facebook,
      COMPANY_INFO.social.instagram,
      COMPANY_INFO.social.whatsapp,
    ],
    priceRange: "$$",
    currenciesAccepted: "ZAR",
    paymentAccepted:
      "Cash, Electronic Funds Transfer (EFT), Trade Credit (NET 7/15/30)",
  };
}

/**
 * Generates the unified root Schema.org graph combining WholesaleStore and WebSite.
 */
export function generateRootSchema() {
  const org = generateOrganizationSchema();
  const site = generateWebSiteSchema();
  const { "@context": _orgCtx, ...orgBody } = org;
  const { "@context": _siteCtx, ...siteBody } = site;

  return {
    "@context": "https://schema.org" as const,
    "@graph": [orgBody, siteBody],
  };
}

/**
 * Authoritative General FAQs for Jozi Dairy Wholesale Distribution.
 */
export const HOME_FAQS: FAQInputItem[] = [
  {
    question: "What regions in Gauteng does Jozi Dairy deliver to?",
    answer:
      "Jozi Dairy operates daily refrigerated delivery routes across Midrand, Sandton, Centurion, Pretoria, Randburg, Roodepoort, Rosebank, and Greater Johannesburg.",
  },
  {
    question: "How do I open a wholesale dairy trade account with Jozi Dairy?",
    answer:
      "Businesses can apply for a commercial trade account by contacting our sales desk at ashley@jozidairy.co.za or calling 011 805 1355. We offer COD, NET 7, NET 15, and NET 30 payment terms.",
  },
  {
    question: "Where does Jozi Dairy source its milk?",
    answer:
      "All fresh milk and cultured dairy is sourced directly from certified pasture farms in Mooi River, KwaZulu-Natal, cold-transported directly to our Midrand hub.",
  },
  {
    question: "What is the shelf life and storage requirement for your fresh milk?",
    answer:
      "Our pasteurized fresh milk carries a guaranteed refrigerated shelf life of 12 to 14 days when continuously maintained at or below 4°C.",
  },
  {
    question: "Can I place urgent milk top-up orders outside of scheduled days?",
    answer:
      "Yes. Active commercial clients have direct access to our WhatsApp Operations Hotline on 065 234 2460 for emergency dispatches.",
  },
];

/**
 * Generates FAQPage schema from any array of question/answer objects.
 * Supports { question, answer }, { q, a }, and { name, text }.
 */
export function generateFAQSchema(
  faqs: FAQInputItem[],
  pageUrlOrOptions?: string | { id?: string; url?: string }
): WithContext<FAQPage> {
  let id: string | undefined;
  let url: string | undefined;

  if (typeof pageUrlOrOptions === "string") {
    const cleanUrl = pageUrlOrOptions.replace(/\/$/, "");
    id = `${cleanUrl}#faq`;
    url = cleanUrl;
  } else if (pageUrlOrOptions && typeof pageUrlOrOptions === "object") {
    id = pageUrlOrOptions.id;
    url = pageUrlOrOptions.url;
  }

  const mainEntity: Question[] = (faqs || []).map((faq) => {
    const questionText = faq.question || faq.q || faq.name || "";
    const answerText = faq.answer || faq.a || faq.text || "";
    return {
      "@type": "Question" as const,
      name: questionText,
      acceptedAnswer: {
        "@type": "Answer" as const,
        text: answerText,
      },
    };
  });

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    ...(url ? { url } : {}),
    mainEntity,
  };
}

/**
 * Generates the specific FAQPage schema for the homepage.
 */
export function generateHomeFAQSchema(): WithContext<FAQPage> {
  const siteUrl = getSiteUrl();
  return generateFAQSchema(HOME_FAQS, { id: `${siteUrl}/#faq`, url: siteUrl });
}

/**
 * Generates Schema.org BreadcrumbList structured data (Feature 10).
 * Ensures all item URLs are absolute and terminal item URL matches canonical.
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem" as const,
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.url),
    })),
  };
}

/**
 * Generates Schema.org Product structured data for a detailed dairy product.
 * Fully compliant with Google Rich Results and E2E test suites (T1.4.4, T2.5.4, T3.7).
 */
export function generateProductSchema(
  product: DetailedProduct
): WithContext<Product> {
  const productUrl = getAbsoluteUrl(`/products/${product.slug}`);

  // Build Offer items for each packaging format
  const offers: Offer[] =
    product.packFormats && product.packFormats.length > 0
      ? product.packFormats.map((pack) => ({
          "@type": "Offer" as const,
          "@id": `${productUrl}#offer-${pack.code.toLowerCase()}`,
          name: `${product.name} - ${pack.name}`,
          sku: pack.code,
          price: "0.00",
          priceCurrency: "ZAR" as const,
          availability: "https://schema.org/InStock",
          url: productUrl,
          itemCondition: "https://schema.org/NewCondition",
          priceValidUntil: "2027-12-31",
          seller: {
            "@type": "Organization" as const,
            name: "Jozi Dairy",
            url: getAbsoluteUrl("/"),
          },
          category: pack.target,
        }))
      : [
          {
            "@type": "Offer" as const,
            "@id": `${productUrl}#offer`,
            name: product.name,
            sku: product.id,
            price: "0.00",
            priceCurrency: "ZAR" as const,
            availability: "https://schema.org/InStock",
            url: productUrl,
            itemCondition: "https://schema.org/NewCondition",
            priceValidUntil: "2027-12-31",
            seller: {
              "@type": "Organization" as const,
              name: "Jozi Dairy",
              url: getAbsoluteUrl("/"),
            },
          },
        ];

  // Map technical specifications into Schema.org PropertyValue objects
  const additionalProperty: PropertyValue[] = [
    ...(product.specs || []).map((spec) => ({
      "@type": "PropertyValue" as const,
      name: spec.label || "",
      value: spec.value || "",
    })),
  ];

  if (product.packFormats && product.packFormats.length > 0) {
    additionalProperty.push({
      "@type": "PropertyValue" as const,
      name: "Pack Sizes",
      value: product.packFormats.map((p) => p.size).join(", "),
    });
  }

  if (product.storageNotice) {
    additionalProperty.push({
      "@type": "PropertyValue" as const,
      name: "Storage Notice",
      value: product.storageNotice,
    });
  }

  if (product.provenanceStory) {
    additionalProperty.push({
      "@type": "PropertyValue" as const,
      name: "Sourcing & Provenance",
      value: product.provenanceStory,
    });
  }

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}#product`,
    url: productUrl,
    name: product.name,
    description: product.description || product.subtitle,
    image: getAbsoluteUrl(product.image),
    brand: {
      "@type": "Brand",
      name: "Jozi Dairy",
    },
    category: product.category === "juice" ? "Fruit Juices" : "Dairy Products",
    sku: product.packFormats?.[0]?.code || product.id,
    mpn: product.id,
    offers,
    additionalProperty,
    audience: {
      "@type": "BusinessAudience",
      name: "Wholesale Distributors, Cafes, Bakeries, Retailers & Caterers",
    },
  };
}

/**
 * Generates Schema.org ItemList structured data for the Cheese Catalog (Feature 9).
 * Contains rich ListItem elements wrapping each cheese variety from CHEESE_VARIETIES.
 */
export function generateCheeseCatalogSchema(
  cheeses: DetailedCheese[] = CHEESE_VARIETIES
): WithContext<ItemList> {
  const baseUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${baseUrl}/cheese#catalog`,
    name: "Artisanal Cheese Selection",
    description:
      "Jozi Dairy wholesale and artisanal cheese selection featuring pasture-sourced South African Cheddar, Sweetmilk Gouda, low-moisture Culinary Mozzarella, and traditional Greek Feta in brine.",
    url: `${baseUrl}/cheese`,
    numberOfItems: cheeses.length,
    itemListElement: cheeses.map((cheese, index) => {
      const cheeseUrl = `${baseUrl}/cheese#${cheese.id}`;
      const imageUrl = cheese.image.startsWith("http")
        ? cheese.image
        : `${baseUrl}${cheese.image.startsWith("/") ? "" : "/"}${cheese.image}`;

      return {
        "@type": "ListItem" as const,
        position: index + 1,
        name: cheese.name,
        url: cheeseUrl,
        item: {
          "@type": "Product" as const,
          "@id": cheeseUrl,
          name: cheese.name,
          description: cheese.description,
          image: imageUrl,
          category: "Dairy Products",
          url: cheeseUrl,
          brand: {
            "@type": "Brand" as const,
            name: "Jozi Dairy",
          },
          manufacturer: {
            "@type": "Organization" as const,
            name: "Jozi Dairy",
            url: baseUrl,
          },
          offers: {
            "@type": "Offer" as const,
            "@id": `${cheeseUrl}-offer`,
            priceCurrency: "ZAR",
            price: "0.00",
            priceValidUntil: "2027-12-31",
            availability: "https://schema.org/InStock",
            itemCondition: "https://schema.org/NewCondition",
            url: cheeseUrl,
            seller: {
              "@type": "Organization" as const,
              name: "Jozi Dairy",
              url: baseUrl,
            },
          },
          additionalProperty: [
            {
              "@type": "PropertyValue" as const,
              name: "Fat Content",
              value: cheese.specs.fatContent,
            },
            {
              "@type": "PropertyValue" as const,
              name: "Aging",
              value: cheese.specs.aging,
            },
            {
              "@type": "PropertyValue" as const,
              name: "Texture",
              value: cheese.specs.texture,
            },
            {
              "@type": "PropertyValue" as const,
              name: "Melting Quality",
              value: cheese.specs.meltingQuality,
            },
            {
              "@type": "PropertyValue" as const,
              name: "Shelf Life",
              value: cheese.specs.shelfLife,
            },
            {
              "@type": "PropertyValue" as const,
              name: "Storage Temperature",
              value: cheese.specs.temperature,
            },
            {
              "@type": "PropertyValue" as const,
              name: "Available Pack Formats",
              value: cheese.packSizes
                .map((p) => `${p.size} (${p.target})`)
                .join("; "),
            },
          ],
        },
      };
    }),
  };
}
