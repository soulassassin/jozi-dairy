# Jozi Dairy E2E Test Infrastructure & Specification

## 1. Test Architecture Overview

The Jozi Dairy End-to-End (E2E) Test Suite is designed according to **opaque-box**, requirement-driven verification principles. It evaluates the site strictly through observable artifacts—rendered HTML, HTTP headers, metadata tags, XML protocols, REP (Robots Exclusion Protocol) rules, Schema.org JSON-LD graphs, and machine-readable AI context resources—completely decoupled from internal implementation details.

### Dual-Mode Execution Harness
The test harness (`tests/e2e/helpers/pageLoader.mjs`) supports two operational modes:
1. **Static Build Mode (Default / CI)**: Inspects production build artifacts generated in `.next/server/app/` (`index.html`, `cheese.html`, `products/*.html`, `robots.txt.body`, `sitemap.xml.body`) and `public/` (`llms.txt`, `llms-full.txt`). Runs with sub-second execution speed (approx. 1.2s for 90+ tests) without requiring a running HTTP daemon.
2. **Live HTTP Mode**: When `TEST_BASE_URL` is set (e.g. `TEST_BASE_URL=http://localhost:3000`), all requests are dispatched as real HTTP requests using native `fetch()`, verifying HTTP status codes (200, 404, redirects), Content-Type headers, and live routing.

### Zero External Test Dependency
The suite is implemented entirely using **native Node.js 22 built-ins** (`node:test`, `node:assert/strict`, `node:test/reporters`). It requires zero third-party testing dependencies, ensuring cross-platform stability (Windows, Linux, macOS) and instant execution.

---

## 2. Test Execution Commands

```bash
# Run the entire E2E test suite (Tiers 1-4)
node tests/e2e/runner.mjs

# Run a specific tier
node tests/e2e/runner.mjs --tier=1    # Tier 1: Feature Coverage
node tests/e2e/runner.mjs --tier=2    # Tier 2: Boundary & Corner Cases
node tests/e2e/runner.mjs --tier=3    # Tier 3: Cross-Feature Combinations
node tests/e2e/runner.mjs --tier=4    # Tier 4: Real-World Application Scenarios

# Filter tests relevant to a specific milestone
node tests/e2e/runner.mjs --milestone=1   # Milestone 1: SEO Foundation & Route Hygiene
node tests/e2e/runner.mjs --milestone=2   # Milestone 2: Schema.org Structured Data
node tests/e2e/runner.mjs --milestone=3   # Milestone 3: GEO/AIO & GSC Integration

# Output options
node tests/e2e/runner.mjs --json      # Output structured JSON results
node tests/e2e/runner.mjs --tap       # Output standard TAP stream
node tests/e2e/runner.mjs --bail      # Abort immediately on first failure
```

---

## 3. Systematic 4-Tier Test Breakdown

| Tier | Category | Test File | Scope | Tests |
|---|---|---|---|---|
| **Tier 1** | Feature Coverage | `tests/e2e/tier1-feature-coverage.test.mjs` | Baseline verification of all public routes, sitemaps, robots.txt, metadata, schemas, llms.txt, GSC verification | 36 |
| **Tier 2** | Boundary & Corner Cases | `tests/e2e/tier2-boundary-corner.test.mjs` | Missing env vars, custom domain overrides, edge case slugs, trailing slashes, protocol compliance | 25 |
| **Tier 3** | Cross-Feature Combinations | `tests/e2e/tier3-cross-feature.test.mjs` | Parity between canonicals, sitemap locs, robots rules; GSC meta + HTML handling; AI link consistency | 10 |
| **Tier 4** | Real-World Application Scenarios | `tests/e2e/tier4-real-world-scenarios.test.mjs` | Simulated Googlebot indexing, simulated AI discovery (GEO/AIO), simulated GSC verification, privacy audit | 5 |
| **Total** | | | **Complete E2E Coverage** | **76 Test Cases (91 Assertions)** |

---

## 4. Comprehensive Test Case Inventory

### Tier 1: Feature Coverage (`tier1-feature-coverage.test.mjs`)
- **Area 1: SEO Metadata & Social Cards (Features 2, 3)**
  - `T1.1.1`: Home page (`/`) contains optimized title, meta description, and canonical URL.
  - `T1.1.2`: All 6 product pages have distinct titles, descriptions, and self-referencing canonicals.
  - `T1.1.3`: Cheese catalog page (`/cheese`) has dedicated metadata and canonical.
  - `T1.1.4`: OpenGraph metadata configured across public routes (`og:title`, `og:description`, `og:url`, `og:type=website`, `og:image`).
  - `T1.1.5`: Subpages have page-specific Twitter cards configured with `summary_large_image` (not defaulting to home preview).
- **Area 2: Protocol-Compliant Dynamic Sitemap (Feature 5)**
  - `T1.2.1`: `sitemap.xml` exists and conforms to Sitemaps XML protocol (sitemaps.org 0.9).
  - `T1.2.2`: `sitemap.xml` includes root homepage URL (`https://.../`) with priority 1.0.
  - `T1.2.3`: `sitemap.xml` includes `/cheese` catalog route.
  - `T1.2.4`: `sitemap.xml` includes all 6 product routes (`fresh-milk`, `yoghurt`, `fresh-cream`, `amasi`, `juice`, `dairy-blend`).
  - `T1.2.5`: `sitemap.xml` contains ZERO fragment (`#`) hash URLs.
  - `T1.2.6`: Every sitemap entry has valid `<lastmod>`, `<changefreq>`, and `<priority>`.
- **Area 3: Robots Directives & Search/AI Crawlers (Feature 6)**
  - `T1.3.1`: `robots.txt` is accessible and declares `User-Agent: *`.
  - `T1.3.2`: `robots.txt` allows root public crawling (`Allow: /`).
  - `T1.3.3`: `robots.txt` disallows sensitive paths (`/api/`, `/crm`, `/crm/`, `/invoices/`).
  - `T1.3.4`: `robots.txt` contains valid `Sitemap:` directive pointing to absolute `sitemap.xml`.
  - `T1.3.5`: `robots.txt` explicitly accommodates or permits AI search crawlers.
- **Area 4: Schema.org Structured Data (Features 7, 8, 9, 10, 11)**
  - `T1.4.1`: Home page contains `WebSite` and `WholesaleStore` (or `LocalBusiness`) structured data with full address, geo, phone.
  - `T1.4.2`: Home page contains valid `FAQPage` structured data.
  - `T1.4.3`: Cheese catalog page (`/cheese`) contains `ItemList` or `Product` structured data for cheese varieties.
  - `T1.4.4`: All 6 product pages contain valid `Product` & `Offer` Schema.org markup.
  - `T1.4.5`: Subpages contain valid `BreadcrumbList` structured data.
- **Area 5: GEO & AIO Context (Features 12, 13)**
  - `T1.5.1`: `llms.txt` is accessible and formatted as standard markdown.
  - `T1.5.2`: `llms.txt` clearly identifies Jozi Dairy, Midrand hub, and Mooi River provenance.
  - `T1.5.3`: `llms.txt` links to core product categories and references `llms-full.txt`.
  - `T1.5.4`: `llms-full.txt` is accessible and contains comprehensive factual catalog.
  - `T1.5.5`: `llms-full.txt` includes commercial logistics, pack sizes, and contact details.
- **Area 6: Google Search Console Verification (Features 14, 15, 16)**
  - `T1.6.1`: Layout supports dynamic `google-site-verification` meta tag via environment variable.
  - `T1.6.2`: GSC verification token is omitted when env var is absent or empty.
  - `T1.6.3`: GSC HTML file verification route or mechanism is prepared.
  - `T1.6.4`: Documentation `docs/GOOGLE_SEARCH_CONSOLE_SETUP.md` exists and covers DNS, Meta tag, HTML file, and sitemap submission.
  - `T1.6.5`: GSC verification meta tag and sitemap submission share consistent base domain.
- **Area 7: Privacy Guards (Feature 4)**
  - `T1.7.1`: Invoice route layout exists with `noindex` and `nofollow` privacy directives.
  - `T1.7.2`: Invoice routes are strictly excluded from `sitemap.xml`.
  - `T1.7.3`: `/crm` routes are disallowed in `robots.txt` and excluded from `sitemap.xml`.
  - `T1.7.4`: `/api/` routes are disallowed in `robots.txt` and excluded from `sitemap.xml`.
  - `T1.7.5`: `robots.txt` disallows `/invoices/` to prevent crawler traversal.

### Tier 2: Boundary & Corner Cases (`tier2-boundary-corner.test.mjs`)
- **Area 1: Missing & Fallback Environment Variables**
  - `T2.1.1`: Default fallback domain is `https://www.jozidairy.co.za` without trailing slash.
  - `T2.1.2`: Environment precedence contract: `NEXT_PUBLIC_SITE_URL` overrides `SITE_URL`.
  - `T2.1.3`: `SITE_URL` is honored when `NEXT_PUBLIC_SITE_URL` is undefined.
  - `T2.1.4`: Empty or whitespace-only domain variables do not produce invalid canonicals.
  - `T2.1.5`: Missing `GOOGLE_SITE_VERIFICATION` omits tag or does not set empty string content.
- **Area 2: Custom Domain Overrides & Trailing Slashes**
  - `T2.2.1`: Trailing slash is stripped from base URL in canonical URLs.
  - `T2.2.2`: Product canonical URLs never end with a trailing slash.
  - `T2.2.3`: Sitemap URLs never contain double slashes (`//`) in URL paths.
  - `T2.2.4`: Subpage sitemap URLs do not contain trailing slashes.
  - `T2.2.5`: All resolved URLs strictly enforce HTTPS protocol.
- **Area 3: Edge-Case Product Slugs & Redirects**
  - `T2.3.1`: `amasi-buttermilk` legacy slug maps to `amasi`.
  - `T2.3.2`: `spring-meadow-juice` legacy slug maps to `juice`.
  - `T2.3.3`: Product route `/products/cheese` redirects or forwards to `/cheese`.
  - `T2.3.4`: Unknown product slug triggers `notFound()` error boundary.
  - `T2.3.5`: Static params generator defines all 6 canonical product slugs.
- **Area 4: Protocol Compliance & Syntax**
  - `T2.4.1`: `sitemap.xml` strictly validates with no XML syntax errors.
  - `T2.4.2`: `sitemap.xml` `<lastmod>` dates conform strictly to W3C ISO 8601 format.
  - `T2.4.3`: `sitemap.xml` `<priority>` values are valid numbers between 0.0 and 1.0.
  - `T2.4.4`: `sitemap.xml` `<changefreq>` values are strictly protocol-compliant.
  - `T2.4.5`: `robots.txt` syntax conforms strictly to Robots Exclusion Protocol.
- **Area 5: Schema Validation & Malformed Data Prevention**
  - `T2.5.1`: All JSON-LD scripts on all public pages parse cleanly with `JSON.parse()`.
  - `T2.5.2`: Structured data `@context` is strictly `https://schema.org`.
  - `T2.5.3`: Structured data does not leak 'undefined' or 'NaN' strings.
  - `T2.5.4`: Offer priceCurrency conforms strictly to ISO 4217 (`ZAR`).
  - `T2.5.5`: GeoCoordinates in WholesaleStore have valid coordinates for Midrand, Gauteng.

### Tier 3: Cross-Feature Combinations (`tier3-cross-feature.test.mjs`)
- `T3.1`: Canonical URLs and Sitemap URLs have 100% parity across all public indexable routes.
- `T3.2`: `robots.txt` does not disallow any URL listed in `sitemap.xml`.
- `T3.3`: Canonical public routes are allowed by `robots.txt`.
- `T3.4`: Private/noindex routes (invoices, crm, api) are strictly excluded from `sitemap.xml`.
- `T3.5`: OpenGraph URL (`og:url`) matches Canonical URL on every public page.
- `T3.6`: BreadcrumbList schema target URL matches page Canonical URL.
- `T3.7`: Primary Schema entity `@id` / `url` matches page Canonical URL.
- `T3.8`: GSC verification meta tag does not mutate metadataBase or alter canonical tags.
- `T3.9`: Links documented in AI context (`llms.txt`) are listed in Sitemap and allowed in Robots.txt.
- `T3.10`: Dynamic Site URL resolver ensures identical origin across Sitemaps, Robots, and Metadata.

### Tier 4: Real-World Application Scenarios (`tier4-real-world-scenarios.test.mjs`)
- `T4.1`: **Simulated Googlebot Indexing Pipeline**: Crawls `robots.txt` -> discovers sitemap -> parses routes -> visits all pages -> asserts HTTP 200, canonical self-reference, title/description presence, and absence of rogue `noindex`.
- `T4.2`: **Simulated AI Search Engine Discovery (GEO/AIO Pipeline)**: Crawls `/llms.txt` -> extracts entity identity -> traverses to `/llms-full.txt` -> extracts factual specifications (Mooi River origin, cold-chain standards, cheese varieties, order desk contacts).
- `T4.3`: **Simulated Google Search Console Ownership Verification & Submission Pipeline**: Verifies meta tag verification token handling, setup documentation completeness, and valid sitemap payload for Search Console property submission.
- `T4.4`: **Simulated Privacy & Data Leak Audit**: Verifies invoice print routes, CRM paths, and internal APIs are shielded from search engines via robots disallow, sitemap exclusion, and noindex directives.
- `T4.5`: **Social Media Card Preview Simulation**: Audits OpenGraph and Twitter card rendering for Twitter/X, WhatsApp, LinkedIn, and Facebook crawlers.

---

## 5. Test Suite Helpers

Located in `tests/e2e/helpers/`:
- `htmlParser.mjs`: Lightweight extraction of `<title>`, `<meta>`, `<link rel="canonical">`, `<a href>`, and `<script type="application/ld+json">`.
- `sitemapParser.mjs`: XML parser for `<urlset>`, `<loc>`, `<lastmod>`, `<changefreq>`, `<priority>` and XML syntax validator.
- `robotsParser.mjs`: REP parser for `User-Agent`, `Allow`, `Disallow`, `Sitemap` and path matching engine.
- `pageLoader.mjs`: Abstraction layer resolving routes from either `.next/server/app/` build artifacts or a running HTTP server.
- `schemaValidator.mjs`: Structural and schema property validator for `WebSite`, `WholesaleStore`, `Product`, `Offer`, `BreadcrumbList`, and `FAQPage`.
