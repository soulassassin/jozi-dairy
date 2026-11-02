# Project: Jozi Dairy SEO, GEO, AIO & Google Search Console Optimization

## Architecture
- **Framework**: Next.js 16.3.5 (Turbopack App Router), React 19.3.0, TypeScript 7.0.2, Tailwind CSS 3.4.19.
- **Data Flow & Sources**:
  - `src/data/dairyData.ts`: Authoritative source of truth for company info (`COMPANY_INFO`), products (`PRODUCT_DETAILS`, `PRODUCTS`), and cheeses (`CHEESE_VARIETIES`).
  - `src/app/layout.tsx`: Root HTML shell, global metadata configuration, root JSON-LD, and GSC ownership verification injection.
  - `src/app/sitemap.ts`: Dynamic XML sitemap generator conforming to Sitemaps XML protocol (sitemaps.org).
  - `src/app/robots.ts`: Crawl directives for search engines and AI crawlers (`robots.txt`).
  - `src/app/products/[slug]/page.tsx`: Dynamic product landing pages with localized metadata, OpenGraph, Twitter, Breadcrumb, and Product Schema.org JSON-LD.
  - `src/app/cheese/page.tsx` & `layout.tsx`: Dedicated cheese catalog with rich metadata and ItemList/Product Schema.org JSON-LD.
  - `src/app/invoices/`: Secure invoice rendering with `noindex, nofollow` metadata layout.
  - `public/llms.txt` & `public/llms-full.txt`: Static machine-readable context files for AI engines (Perplexity, ChatGPT, Claude, Gemini).
  - `src/app/google[token].html/route.ts` (or dynamic route): Configurable HTML verification fallback for Google Search Console.
- **Domain Strategy**:
  - Centralized site URL resolver with precedence: `process.env.NEXT_PUBLIC_SITE_URL` -> `process.env.SITE_URL` -> `"https://www.jozidairy.co.za"`.

## Feature Inventory
Every feature identified during the survey phase is assigned to a milestone below:
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Dynamic Site URL Resolver | Centralized helper resolving base URL from env vars with production fallback | M1 | survey |
| 2 | Root Layout Metadata & OpenGraph | Complete titles, descriptions, canonical URL, OG tags, and locale | M1 | survey |
| 3 | Subpage Social Card Fix | Add missing `twitter` card configurations to `/cheese` and `/products/[slug]` | M1 | survey |
| 4 | Invoice Route Privacy Guard | Add `src/app/invoices/layout.tsx` with `robots: { index: false, follow: false, nocache: true }` | M1 | survey |
| 5 | Protocol-Compliant Dynamic Sitemap | Fix `sitemap.ts` to remove `#` fragments and include `/`, `/cheese`, and all 6 `/products/[slug]` | M1 | survey |
| 6 | Search & AI Crawler Robots.txt | Update `robots.ts` to disallow `/invoices/`, allow public routes, declare sitemap, and permit AI crawlers | M1 | survey |
| 7 | WebSite & LocalBusiness JSON-LD | Root Schema.org markup for WebSite and WholesaleStore/LocalBusiness | M2 | survey |
| 8 | Product & Offer JSON-LD | Rich Schema.org `Product` and `Offer` structured data on all 6 product detail pages | M2 | survey |
| 9 | Cheese Catalog ItemList JSON-LD | Schema.org structured data for `/cheese` varieties | M2 | survey |
| 10 | BreadcrumbList JSON-LD | Structured navigation breadcrumbs on `/cheese` and `/products/[slug]` | M2 | survey |
| 11 | Decoupled FAQPage Schema | Context-specific FAQPage markup (general on home, product-specific on product pages) | M2 | survey |
| 12 | Machine-Readable `llms.txt` | Standard AI discovery index documenting brand, core offerings, logistics, and navigation | M3 | survey |
| 13 | Exhaustive `llms-full.txt` | Full factual catalog, specifications, pack sizes, Mooi River sourcing, and commercial terms | M3 | survey |
| 14 | Dynamic GSC Meta Verification | Support `GOOGLE_SITE_VERIFICATION` / `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` via `layout.tsx` | M3 | survey |
| 15 | GSC HTML File Verification Route | Dynamic handler serving Google verification HTML token if configured via env var | M3 | survey |
| 16 | Google Search Console Setup Guide | Comprehensive documentation in `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md` with step-by-step instructions | M3 | survey |
| 17 | E2E Testing Suite (Tiers 1-4) | Comprehensive opaque-box test runner covering all requirements and edge cases | M4 | dual-track |
| 18 | Adversarial Coverage Hardening (Tier 5) | White-box stress-testing, schema linting, and regression auditing | M4 | dual-track |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| E2E | E2E Testing Track | Requirement-driven test harness, test runner, Tiers 1-4 test cases -> TEST_READY.md | none | DONE |
| 1 | SEO Foundation & Route Hygiene | Features 1-6: Domain resolver, metadata, Twitter cards, invoice layout, sitemap, robots | none | DONE |
| 2 | Schema.org Structured Data | Features 7-11: WebSite, LocalBusiness, Product/Offer, Cheese ItemList, Breadcrumbs, FAQs | M1 | DONE |
| 3 | GEO/AIO Context & GSC Integration | Features 12-16: llms.txt, llms-full.txt, GSC verification meta/route, GSC documentation | M1, M2 | IN_PROGRESS |
| 4 | Final E2E Test Pass & Hardening | Features 17-18: Pass 100% of E2E test suite (Tiers 1-4) and Tier 5 adversarial hardening | E2E, M1, M2, M3 | PLANNED |

## Interface Contracts
### Base URL Resolution
- Helper path: `src/lib/seo/siteUrl.ts`
- Signature: `export function getSiteUrl(): string`
- Behavior: Returns `(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "https://www.jozidairy.co.za").replace(/\/$/, "")`
- Consumed by: `src/app/layout.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/products/[slug]/page.tsx`, `src/app/cheese/layout.tsx`, and Schema.org generators.

### Schema.org Helpers
- Helper path: `src/lib/seo/schema.ts`
- Signatures:
  - `generateWebSiteSchema(): WithContext<WebSite>`
  - `generateOrganizationSchema(): WithContext<WholesaleStore | LocalBusiness>`
  - `generateProductSchema(product: ProductDetail): WithContext<Product>`
  - `generateCheeseCatalogSchema(cheeses: DetailedCheese[]): WithContext<ItemList>`
  - `generateBreadcrumbSchema(items: { name: string; url: string }[]): WithContext<BreadcrumbList>`
  - `generateFAQSchema(faqs: { question: string; answer: string }[]): WithContext<FAQPage>`

### Google Search Console Verification Contract
- Environment variables:
  - `GOOGLE_SITE_VERIFICATION` or `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`: Token string injected into `<meta name="google-site-verification" content="..." />`.
  - `GOOGLE_SITE_VERIFICATION_HTML`: Optional filename/token for HTML file verification route (e.g. `google1234567890abcdef.html`).

## Code Layout & Write Boundaries
- `src/lib/seo/*`: Site URL helper, Schema generators, SEO constants. (Owned by M1 & M2 workers)
- `src/app/layout.tsx`: Root metadata and global verification/schema. (Owned by M1 & M2, updated in M3)
- `src/app/sitemap.ts`: Dynamic sitemap generator. (Owned by M1 worker)
- `src/app/robots.ts`: Robots.txt generator. (Owned by M1 worker, updated in M3)
- `src/app/cheese/*`: Cheese page metadata and schema. (Owned by M1 & M2 workers)
- `src/app/products/*`: Product pages metadata and schema. (Owned by M1 & M2 workers)
- `src/app/invoices/layout.tsx`: Invoice layout with noindex. (Owned by M1 worker)
- `public/llms.txt`, `public/llms-full.txt`: AI context markdown. (Owned by M3 worker)
- `src/app/google[token].html/route.ts` or route handler: (Owned by M3 worker)
- `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md`: Documentation for GSC setup. (Owned by M3 worker)
- `tests/e2e/*`: Opaque-box test suite. (Owned by E2E Testing Track)
