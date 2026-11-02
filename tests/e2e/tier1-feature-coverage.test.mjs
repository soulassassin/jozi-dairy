import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { loadPage } from "./helpers/pageLoader.mjs";
import {
  extractTitle,
  extractMeta,
  extractCanonical,
  extractJsonLd,
} from "./helpers/htmlParser.mjs";
import { parseSitemap, validateXmlSyntax } from "./helpers/sitemapParser.mjs";
import { parseRobots } from "./helpers/robotsParser.mjs";
import {
  findSchemasByType,
  validateProductSchema,
  validateBreadcrumbSchema,
  validateFAQSchema,
} from "./helpers/schemaValidator.mjs";

const PRODUCT_SLUGS = [
  "fresh-milk",
  "yoghurt",
  "fresh-cream",
  "amasi",
  "juice",
  "dairy-blend",
];

const PUBLIC_ROUTES = [
  "/",
  "/cheese",
  ...PRODUCT_SLUGS.map((s) => `/products/${s}`),
];

describe("Tier 1 - Feature Coverage", () => {
  // =========================================================================
  // Area 1: Public Route SEO Metadata & Social Cards (>=5 tests)
  // =========================================================================
  describe("Area 1: SEO Metadata & Social Cards", () => {
    it("T1.1.1: Home page (/) contains optimized title, meta description, and canonical URL", async () => {
      const page = await loadPage("/");
      assert.equal(page.status, 200, "Home page should be accessible");

      const title = extractTitle(page.content);
      assert.ok(title && title.includes("Jozi Dairy"), `Title missing 'Jozi Dairy': ${title}`);

      const desc = extractMeta(page.content, "description");
      assert.ok(desc && desc.length >= 30, `Description too short: "${desc}"`);

      const canonical = extractCanonical(page.content);
      assert.ok(canonical && !canonical.endsWith("/#"), `Invalid canonical: ${canonical}`);
      assert.ok(
        canonical.startsWith("https://") || canonical.startsWith("http://"),
        `Canonical must be absolute: ${canonical}`
      );
    });

    it("T1.1.2: All 6 product pages have distinct titles, descriptions, and self-referencing canonicals", async () => {
      const seenTitles = new Set();
      const seenCanonicals = new Set();

      for (const slug of PRODUCT_SLUGS) {
        const route = `/products/${slug}`;
        const page = await loadPage(route);
        assert.equal(page.status, 200, `Page ${route} should exist with status 200`);

        const title = extractTitle(page.content);
        assert.ok(title && title.length > 10, `Title missing for ${route}`);
        assert.ok(!seenTitles.has(title), `Duplicate title detected for ${route}: ${title}`);
        seenTitles.add(title);

        const desc = extractMeta(page.content, "description");
        assert.ok(desc && desc.length >= 20, `Meta description missing for ${route}`);

        const canonical = extractCanonical(page.content);
        assert.ok(canonical && canonical.includes(slug), `Canonical must contain ${slug}: ${canonical}`);
        seenCanonicals.add(canonical);
      }
      assert.equal(seenCanonicals.size, 6, "Expected 6 distinct product canonical URLs");
    });

    it("T1.1.3: Cheese catalog page (/cheese) has dedicated metadata and canonical", async () => {
      const page = await loadPage("/cheese");
      assert.equal(page.status, 200, "/cheese must return status 200");

      const title = extractTitle(page.content);
      assert.ok(title && /cheese/i.test(title), `Title must mention Cheese: "${title}"`);

      const desc = extractMeta(page.content, "description");
      assert.ok(desc && /cheese|cheddar|gouda|mozzarella/i.test(desc), `Cheese description missing expected keywords: "${desc}"`);

      const canonical = extractCanonical(page.content);
      assert.ok(canonical && canonical.endsWith("/cheese"), `Canonical must point to /cheese: ${canonical}`);
    });

    it("T1.1.4: OpenGraph metadata is configured across public routes with required properties", async () => {
      for (const route of ["/", "/cheese", "/products/fresh-milk"]) {
        const page = await loadPage(route);
        const ogTitle = extractMeta(page.content, "og:title");
        const ogDesc = extractMeta(page.content, "og:description");
        const ogUrl = extractMeta(page.content, "og:url");
        const ogType = extractMeta(page.content, "og:type");
        const ogImage = extractMeta(page.content, "og:image");

        assert.ok(ogTitle, `Missing og:title on ${route}`);
        assert.ok(ogDesc, `Missing og:description on ${route}`);
        assert.ok(ogUrl, `Missing og:url on ${route}`);
        assert.equal(ogType, "website", `Expected og:type website on ${route}`);
        assert.ok(ogImage, `Missing og:image on ${route}`);
      }
    });

    it("T1.1.5: Subpages have page-specific Twitter cards configured (not defaulting to home)", async () => {
      // Feature 3: Twitter cards on /cheese and /products/[slug]
      const cheesePage = await loadPage("/cheese");
      const cheeseCard = extractMeta(cheesePage.content, "twitter:card");
      const cheeseTitle = extractMeta(cheesePage.content, "twitter:title");
      assert.equal(cheeseCard, "summary_large_image", "Expected summary_large_image twitter:card on /cheese");
      assert.ok(
        cheeseTitle && /cheese/i.test(cheeseTitle),
        `twitter:title on /cheese should be cheese-specific: "${cheeseTitle}"`
      );

      const milkPage = await loadPage("/products/fresh-milk");
      const milkCard = extractMeta(milkPage.content, "twitter:card");
      const milkTitle = extractMeta(milkPage.content, "twitter:title");
      assert.equal(milkCard, "summary_large_image", "Expected summary_large_image twitter:card on /products/fresh-milk");
      assert.ok(
        milkTitle && /milk/i.test(milkTitle),
        `twitter:title on /products/fresh-milk should be milk-specific: "${milkTitle}"`
      );
    });
  });

  // =========================================================================
  // Area 2: Dynamic Sitemaps (>=5 tests)
  // =========================================================================
  describe("Area 2: Protocol-Compliant Dynamic Sitemap", () => {
    it("T1.2.1: sitemap.xml exists and conforms to Sitemaps XML protocol", async () => {
      const page = await loadPage("/sitemap.xml");
      assert.equal(page.status, 200, "sitemap.xml must exist and return 200");

      const syntax = validateXmlSyntax(page.content);
      assert.ok(syntax.valid, `Invalid sitemap XML syntax: ${syntax.error}`);
    });

    it("T1.2.2: sitemap.xml includes the root home page URL", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      const homeEntry = entries.find((e) => {
        try {
          const u = new URL(e.loc);
          return u.pathname === "/" || u.pathname === "";
        } catch {
          return false;
        }
      });
      assert.ok(homeEntry, "sitemap.xml must contain the root homepage URL");
      assert.equal(homeEntry.priority, "1", "Homepage priority should be 1.0 or 1");
    });

    it("T1.2.3: sitemap.xml includes /cheese catalog route", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      const cheeseEntry = entries.find((e) => e.loc.endsWith("/cheese"));
      assert.ok(cheeseEntry, "sitemap.xml must contain /cheese catalog route");
    });

    it("T1.2.4: sitemap.xml includes all 6 product routes", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      const locs = entries.map((e) => e.loc);

      for (const slug of PRODUCT_SLUGS) {
        const expected = `/products/${slug}`;
        const found = locs.some((loc) => loc.endsWith(expected));
        assert.ok(found, `sitemap.xml missing product route: ${expected}`);
      }
    });

    it("T1.2.5: sitemap.xml contains ZERO fragment (#) hash URLs", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      const fragmentEntries = entries.filter((e) => e.loc.includes("#"));
      assert.equal(
        fragmentEntries.length,
        0,
        `Sitemap contains forbidden hash fragments (Feature 5): ${fragmentEntries.map((e) => e.loc).join(", ")}`
      );
    });

    it("T1.2.6: Every sitemap entry has valid lastmod, changefreq, and priority", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      assert.ok(entries.length >= 8, `Expected at least 8 sitemap entries, found ${entries.length}`);

      for (const entry of entries) {
        assert.ok(entry.loc, "Entry missing loc");
        assert.ok(entry.lastmod, `Entry ${entry.loc} missing lastmod`);
        assert.ok(!isNaN(Date.parse(entry.lastmod)), `Invalid lastmod date: ${entry.lastmod}`);
        assert.ok(
          ["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"].includes(entry.changefreq),
          `Invalid changefreq for ${entry.loc}: ${entry.changefreq}`
        );
        const prio = parseFloat(entry.priority);
        assert.ok(prio >= 0 && prio <= 1, `Invalid priority for ${entry.loc}: ${entry.priority}`);
      }
    });
  });

  // =========================================================================
  // Area 3: Robots Directives & Search/AI Crawlers (>=5 tests)
  // =========================================================================
  describe("Area 3: Search & AI Crawler Robots Directives", () => {
    it("T1.3.1: robots.txt is accessible and declares User-Agent: *", async () => {
      const page = await loadPage("/robots.txt");
      assert.equal(page.status, 200, "robots.txt must return status 200");
      const parsed = parseRobots(page.content);
      const starGroup = parsed.rules.find((r) => r.userAgent === "*");
      assert.ok(starGroup, "robots.txt must declare 'User-Agent: *'");
    });

    it("T1.3.2: robots.txt allows root public crawling (Allow: /)", async () => {
      const page = await loadPage("/robots.txt");
      const parsed = parseRobots(page.content);
      const starGroup = parsed.rules.find((r) => r.userAgent === "*");
      assert.ok(starGroup?.allow.includes("/"), "robots.txt User-Agent: * must contain 'Allow: /'");
    });

    it("T1.3.3: robots.txt disallows sensitive and private paths (/api/, /crm, /crm/, /invoices/)", async () => {
      const page = await loadPage("/robots.txt");
      const parsed = parseRobots(page.content);
      const starGroup = parsed.rules.find((r) => r.userAgent === "*");
      assert.ok(starGroup, "Expected User-Agent * rule group");

      const disallows = starGroup.disallow;
      assert.ok(disallows.includes("/api/"), "robots.txt must disallow /api/");
      assert.ok(disallows.includes("/crm") || disallows.includes("/crm/"), "robots.txt must disallow /crm");
      assert.ok(
        disallows.some((d) => d.startsWith("/invoices")),
        "robots.txt must disallow /invoices/ (Feature 6 & 4)"
      );
    });

    it("T1.3.4: robots.txt contains valid Sitemap directive referencing sitemap.xml", async () => {
      const page = await loadPage("/robots.txt");
      const parsed = parseRobots(page.content);
      assert.ok(parsed.sitemaps.length > 0, "robots.txt must declare a Sitemap directive");
      const sitemapUrl = parsed.sitemaps[0];
      assert.ok(sitemapUrl.endsWith("/sitemap.xml"), `Sitemap directive must point to sitemap.xml: ${sitemapUrl}`);
      assert.ok(
        sitemapUrl.startsWith("https://") || sitemapUrl.startsWith("http://"),
        `Sitemap URL must be absolute: ${sitemapUrl}`
      );
    });

    it("T1.3.5: robots.txt explicitly accommodates or permits AI search crawlers", async () => {
      const page = await loadPage("/robots.txt");
      // robots.txt should either have open allow for all crawlers or specific AI crawler declarations
      assert.ok(
        page.content.includes("Allow: /") || page.content.includes("GPTBot") || page.content.includes("ClaudeBot"),
        "robots.txt must allow search and AI crawlers to access public resources"
      );
    });
  });

  // =========================================================================
  // Area 4: Schema.org JSON-LD Structured Data (>=5 tests)
  // =========================================================================
  describe("Area 4: Schema.org Structured Data", () => {
    it("T1.4.1: Home page (/) contains WebSite or WholesaleStore structured data", async () => {
      const page = await loadPage("/");
      const jsonLd = extractJsonLd(page.content);
      assert.ok(jsonLd.length > 0, "Home page must contain at least one application/ld+json script");

      const orgs = findSchemasByType(jsonLd, "WholesaleStore").concat(
        findSchemasByType(jsonLd, "LocalBusiness")
      );
      assert.ok(orgs.length > 0, "Home page must contain WholesaleStore or LocalBusiness schema (Feature 7)");

      const store = orgs[0];
      assert.equal(store.name, "Jozi Dairy");
      assert.ok(store.address, "WholesaleStore schema missing address");
      assert.ok(store.telephone, "WholesaleStore schema missing telephone");
    });

    it("T1.4.2: Home page contains valid FAQPage structured data", async () => {
      const page = await loadPage("/");
      const jsonLd = extractJsonLd(page.content);
      const faqs = findSchemasByType(jsonLd, "FAQPage");
      assert.ok(faqs.length > 0, "Home page must contain FAQPage schema");

      const validation = validateFAQSchema(faqs[0]);
      assert.ok(validation.valid, `Invalid FAQ schema: ${validation.errors.join(", ")}`);
    });

    it("T1.4.3: Cheese catalog page (/cheese) contains ItemList or Product structured data", async () => {
      const page = await loadPage("/cheese");
      const jsonLd = extractJsonLd(page.content);
      assert.ok(jsonLd.length > 0, "/cheese must contain application/ld+json");

      const itemLists = findSchemasByType(jsonLd, "ItemList");
      const products = findSchemasByType(jsonLd, "Product");
      assert.ok(
        itemLists.length > 0 || products.length >= 4,
        "/cheese must expose ItemList or Product schemas for cheese varieties (Feature 9)"
      );
    });

    it("T1.4.4: All 6 product pages contain valid Product & Offer Schema.org markup", async () => {
      for (const slug of PRODUCT_SLUGS) {
        const route = `/products/${slug}`;
        const page = await loadPage(route);
        const jsonLd = extractJsonLd(page.content);

        const products = findSchemasByType(jsonLd, "Product");
        assert.ok(
          products.length > 0,
          `Product page ${route} missing Schema.org Product markup (Feature 8)`
        );

        const validation = validateProductSchema(products[0]);
        assert.ok(
          validation.valid,
          `Invalid Product schema on ${route}: ${validation.errors.join(", ")}`
        );
      }
    });

    it("T1.4.5: Subpages contain valid BreadcrumbList structured data", async () => {
      for (const route of ["/cheese", "/products/fresh-milk"]) {
        const page = await loadPage(route);
        const jsonLd = extractJsonLd(page.content);

        const breadcrumbs = findSchemasByType(jsonLd, "BreadcrumbList");
        assert.ok(
          breadcrumbs.length > 0,
          `Route ${route} missing BreadcrumbList structured data (Feature 10)`
        );

        const validation = validateBreadcrumbSchema(breadcrumbs[0]);
        assert.ok(
          validation.valid,
          `Invalid BreadcrumbList on ${route}: ${validation.errors.join(", ")}`
        );
      }
    });
  });

  // =========================================================================
  // Area 5: GEO & AIO Resources (llms.txt / llms-full.txt) (>=5 tests)
  // =========================================================================
  describe("Area 5: GEO & AIO Context (llms.txt / llms-full.txt)", () => {
    it("T1.5.1: llms.txt is accessible and formatted as standard markdown", async () => {
      const page = await loadPage("/llms.txt");
      assert.equal(page.status, 200, "/llms.txt must be accessible (Feature 12)");
      assert.ok(page.content.length >= 100, "llms.txt content is too brief");
      assert.ok(page.content.includes("# "), "llms.txt must have top-level markdown heading");
    });

    it("T1.5.2: llms.txt clearly identifies Jozi Dairy, Midrand hub, and Mooi River provenance", async () => {
      const page = await loadPage("/llms.txt");
      assert.ok(/Jozi Dairy/i.test(page.content), "llms.txt must identify Jozi Dairy");
      assert.ok(/Midrand/i.test(page.content), "llms.txt must state Midrand location");
      assert.ok(/Mooi River/i.test(page.content), "llms.txt must document Mooi River, KZN origin");
    });

    it("T1.5.3: llms.txt links to core product categories and references llms-full.txt", async () => {
      const page = await loadPage("/llms.txt");
      assert.ok(page.content.includes("llms-full.txt"), "llms.txt must link to llms-full.txt");
      assert.ok(page.content.includes("/cheese"), "llms.txt should link to /cheese catalog");
      assert.ok(page.content.includes("/products/"), "llms.txt should link to product pages");
    });

    it("T1.5.4: llms-full.txt is accessible and contains comprehensive factual catalog", async () => {
      const page = await loadPage("/llms-full.txt");
      assert.equal(page.status, 200, "/llms-full.txt must be accessible (Feature 13)");
      assert.ok(page.content.length >= 500, "llms-full.txt should contain detailed catalog specifications");
      assert.ok(/Cheddar/i.test(page.content), "llms-full.txt must mention Cheddar");
      assert.ok(/Gouda/i.test(page.content), "llms-full.txt must mention Gouda");
      assert.ok(/Mozzarella/i.test(page.content), "llms-full.txt must mention Mozzarella");
      assert.ok(/Feta/i.test(page.content), "llms-full.txt must mention Feta");
    });

    it("T1.5.5: llms-full.txt includes commercial logistics, pack sizes, and contact details", async () => {
      const page = await loadPage("/llms-full.txt");
      assert.ok(/4°C|cold-chain|refrigerat/i.test(page.content), "llms-full.txt must state cold chain requirements");
      assert.ok(/ashley@jozidairy\.co\.za|operations@jozidairy\.co\.za/i.test(page.content), "llms-full.txt must include contact email");
      assert.ok(/011 805 1355|065 234 2460/i.test(page.content), "llms-full.txt must include phone/WhatsApp contacts");
    });
  });

  // =========================================================================
  // Area 6: Google Search Console Verification Support (>=5 tests)
  // =========================================================================
  describe("Area 6: Google Search Console Verification", () => {
    it("T1.6.1: Layout supports dynamic google-site-verification meta tag via environment variable", async () => {
      // Check layout source contract or rendered tag
      const layoutFile = path.join(process.cwd(), "src", "app", "layout.tsx");
      const content = await fs.readFile(layoutFile, "utf-8");
      assert.ok(
        content.includes("GOOGLE_SITE_VERIFICATION") || content.includes("verification"),
        "layout.tsx must support GOOGLE_SITE_VERIFICATION (Feature 14)"
      );
    });

    it("T1.6.2: GSC verification token is omitted when env var is absent or empty", async () => {
      const page = await loadPage("/");
      const meta = extractMeta(page.content, "google-site-verification");
      // If no env var is configured, meta tag should either be null or not empty string
      if (meta !== null) {
        assert.ok(meta.length > 0, "google-site-verification content should not be empty");
      }
    });

    it("T1.6.3: GSC HTML file verification route or mechanism is prepared", async () => {
      // Feature 15: Google HTML verification route or static route handler
      const projectRoot = process.cwd();
      const files = await fs.readdir(path.join(projectRoot, "src", "app"));
      const hasRoute = files.some((f) => f.includes("google") || f.includes("[token]"));
      const layoutHasRoute = (await fs.readFile(path.join(projectRoot, "src", "app", "layout.tsx"), "utf-8")).includes("GOOGLE_SITE_VERIFICATION");
      assert.ok(hasRoute || layoutHasRoute, "GSC verification mechanism must be implemented (Feature 14/15)");
    });

    it("T1.6.4: Documentation docs/GOOGLE_SEARCH_CONSOLE_SETUP.md exists and is complete", async () => {
      const docPath = path.join(process.cwd(), "docs", "GOOGLE_SEARCH_CONSOLE_SETUP.md");
      const exists = await fs.stat(docPath).then(() => true).catch(() => false);
      assert.ok(exists, "docs/GOOGLE_SEARCH_CONSOLE_SETUP.md must exist (Feature 16)");

      const content = await fs.readFile(docPath, "utf-8");
      assert.ok(content.includes("DNS") || content.includes("TXT"), "Setup guide must document DNS verification");
      assert.ok(content.includes("HTML tag") || content.includes("meta"), "Setup guide must document meta tag verification");
      assert.ok(content.includes("sitemap"), "Setup guide must document sitemap submission");
    });

    it("T1.6.5: GSC verification meta tag and sitemap submission share consistent base domain", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      assert.ok(entries.length > 0, "Sitemap must have entries");
      const loc = entries[0].loc;
      const sitemapDomain = new URL(loc).origin;

      const homePage = await loadPage("/");
      const canonical = extractCanonical(homePage.content);
      const canonicalDomain = new URL(canonical).origin;

      assert.equal(sitemapDomain, canonicalDomain, "Sitemap and Canonical must use the same domain");
    });
  });

  // =========================================================================
  // Area 7: Privacy Guards (Invoices & Restricted Routes) (>=5 tests)
  // =========================================================================
  describe("Area 7: Privacy Guards", () => {
    it("T1.7.1: Invoice route layout exists with noindex and nofollow privacy directives", async () => {
      const layoutPath = path.join(process.cwd(), "src", "app", "invoices", "layout.tsx");
      const exists = await fs.stat(layoutPath).then(() => true).catch(() => false);
      assert.ok(exists, "src/app/invoices/layout.tsx must exist (Feature 4)");

      const content = await fs.readFile(layoutPath, "utf-8");
      assert.ok(content.includes("index: false"), "invoices/layout.tsx must set index: false");
      assert.ok(content.includes("follow: false"), "invoices/layout.tsx must set follow: false");
    });

    it("T1.7.2: Invoice routes are excluded from sitemap.xml", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      const invoiceEntries = entries.filter((e) => e.loc.includes("/invoices"));
      assert.equal(invoiceEntries.length, 0, "sitemap.xml must NEVER contain /invoices/ URLs");
    });

    it("T1.7.3: /crm routes are disallowed in robots.txt and excluded from sitemap.xml", async () => {
      const robotsPage = await loadPage("/robots.txt");
      const parsed = parseRobots(robotsPage.content);
      const star = parsed.rules.find((r) => r.userAgent === "*");
      assert.ok(star?.disallow.some((d) => d.startsWith("/crm")), "robots.txt must disallow /crm");

      const sitemapPage = await loadPage("/sitemap.xml");
      const entries = parseSitemap(sitemapPage.content);
      const crmEntries = entries.filter((e) => e.loc.includes("/crm"));
      assert.equal(crmEntries.length, 0, "sitemap.xml must NEVER contain /crm URLs");
    });

    it("T1.7.4: /api/ routes are disallowed in robots.txt and excluded from sitemap.xml", async () => {
      const robotsPage = await loadPage("/robots.txt");
      const parsed = parseRobots(robotsPage.content);
      const star = parsed.rules.find((r) => r.userAgent === "*");
      assert.ok(star?.disallow.includes("/api/"), "robots.txt must disallow /api/");

      const sitemapPage = await loadPage("/sitemap.xml");
      const entries = parseSitemap(sitemapPage.content);
      const apiEntries = entries.filter((e) => e.loc.includes("/api"));
      assert.equal(apiEntries.length, 0, "sitemap.xml must NEVER contain /api/ URLs");
    });

    it("T1.7.5: robots.txt disallows /invoices/ to prevent crawler traversal", async () => {
      const robotsPage = await loadPage("/robots.txt");
      const parsed = parseRobots(robotsPage.content);
      const star = parsed.rules.find((r) => r.userAgent === "*");
      assert.ok(
        star?.disallow.some((d) => d.startsWith("/invoices")),
        "robots.txt must contain 'Disallow: /invoices/'"
      );
    });
  });
});
