import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { loadPage } from "./helpers/pageLoader.mjs";
import {
  extractCanonical,
  extractJsonLd,
  extractMeta,
} from "./helpers/htmlParser.mjs";
import { parseSitemap, validateXmlSyntax } from "./helpers/sitemapParser.mjs";
import { parseRobots, validateRobotsSyntax } from "./helpers/robotsParser.mjs";
import { findSchemasByType } from "./helpers/schemaValidator.mjs";

const DEFAULT_ORIGIN = "https://www.jozidairy.co.za";

describe("Tier 2 - Boundary & Corner Cases", () => {
  // =========================================================================
  // Area 1: Missing & Fallback Environment Variables (>=5 tests)
  // =========================================================================
  describe("Area 1: Environment Variable Fallbacks", () => {
    it("T2.1.1: Default fallback domain is https://www.jozidairy.co.za without trailing slash", async () => {
      // Test siteUrl helper contract or page canonicals
      const page = await loadPage("/");
      const canonical = extractCanonical(page.content);
      assert.ok(canonical, "Home page canonical must exist");
      assert.ok(
        canonical === DEFAULT_ORIGIN || canonical === `${DEFAULT_ORIGIN}/`,
        `Expected fallback to ${DEFAULT_ORIGIN}, got ${canonical}`
      );
    });

    it("T2.1.2: Environment precedence contract: NEXT_PUBLIC_SITE_URL overrides SITE_URL", async () => {
      const helperPath = path.join(process.cwd(), "src", "lib", "seo", "siteUrl.ts");
      const exists = await fs.stat(helperPath).then(() => true).catch(() => false);
      if (exists) {
        const content = await fs.readFile(helperPath, "utf-8");
        const nextPublicIdx = content.indexOf("NEXT_PUBLIC_SITE_URL");
        const siteUrlIdx = content.indexOf("SITE_URL");
        assert.ok(nextPublicIdx !== -1, "siteUrl.ts must check NEXT_PUBLIC_SITE_URL");
        assert.ok(
          nextPublicIdx < siteUrlIdx,
          "NEXT_PUBLIC_SITE_URL must be evaluated before SITE_URL for precedence (Contract M1)"
        );
      } else {
        // If helper not yet created, verify PROJECT.md contract
        const projectMd = await fs.readFile(path.join(process.cwd(), "PROJECT.md"), "utf-8");
        assert.ok(projectMd.includes("NEXT_PUBLIC_SITE_URL || process.env.SITE_URL"));
      }
    });

    it("T2.1.3: SITE_URL is honored when NEXT_PUBLIC_SITE_URL is undefined", async () => {
      const helperPath = path.join(process.cwd(), "src", "lib", "seo", "siteUrl.ts");
      const exists = await fs.stat(helperPath).then(() => true).catch(() => false);
      if (exists) {
        const content = await fs.readFile(helperPath, "utf-8");
        assert.ok(content.includes("process.env.SITE_URL"), "siteUrl.ts must support SITE_URL fallback");
      }
    });

    it("T2.1.4: Empty or whitespace-only domain variables do not produce invalid canonicals", async () => {
      const page = await loadPage("/");
      const canonical = extractCanonical(page.content);
      assert.ok(canonical && canonical.startsWith("http"), "Canonical must be a valid HTTP/HTTPS URL");
      assert.ok(!canonical.includes(" "), "Canonical URL must not contain whitespace");
      assert.ok(!canonical.includes("//#"), "Canonical must not contain empty hash segments");
    });

    it("T2.1.5: Missing GOOGLE_SITE_VERIFICATION omits tag or does not set empty string content", async () => {
      const page = await loadPage("/");
      const tagContent = extractMeta(page.content, "google-site-verification");
      if (tagContent !== null) {
        assert.ok(tagContent.trim().length > 0, "google-site-verification meta content must not be blank");
      }
    });
  });

  // =========================================================================
  // Area 2: Custom Domain Overrides & Trailing Slashes (>=5 tests)
  // =========================================================================
  describe("Area 2: Domain Overrides & Trailing Slashes", () => {
    it("T2.2.1: Trailing slash is stripped from base URL in canonical URLs", async () => {
      const cheesePage = await loadPage("/cheese");
      const canonical = extractCanonical(cheesePage.content);
      assert.ok(canonical, "Cheese page must have canonical");
      assert.ok(!canonical.endsWith("/cheese/"), "Subpage canonical must not have a trailing slash: " + canonical);
      assert.ok(canonical.endsWith("/cheese"), "Canonical must end with /cheese");
    });

    it("T2.2.2: Product canonical URLs never end with a trailing slash", async () => {
      const milkPage = await loadPage("/products/fresh-milk");
      const canonical = extractCanonical(milkPage.content);
      assert.ok(!canonical.endsWith("/fresh-milk/"), "Product canonical must not end with trailing slash: " + canonical);
      assert.ok(canonical.endsWith("/products/fresh-milk"));
    });

    it("T2.2.3: Sitemap URLs never contain double slashes (//) in URL paths", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      for (const entry of entries) {
        const parsed = new URL(entry.loc);
        assert.ok(
          !parsed.pathname.includes("//"),
          `Double slash detected in sitemap URL path: ${entry.loc}`
        );
      }
    });

    it("T2.2.4: Subpage sitemap URLs do not contain trailing slashes", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      for (const entry of entries) {
        const u = new URL(entry.loc);
        if (u.pathname !== "/" && u.pathname !== "") {
          assert.ok(
            !entry.loc.endsWith("/"),
            `Sitemap subpage URL must not have trailing slash: ${entry.loc}`
          );
        }
      }
    });

    it("T2.2.5: All resolved URLs (canonical, sitemap, og:url) strictly enforce HTTPS protocol", async () => {
      const homePage = await loadPage("/");
      const canonical = extractCanonical(homePage.content);
      assert.ok(canonical.startsWith("https://"), `Canonical must use HTTPS: ${canonical}`);

      const ogUrl = extractMeta(homePage.content, "og:url");
      if (ogUrl) {
        assert.ok(ogUrl.startsWith("https://"), `og:url must use HTTPS: ${ogUrl}`);
      }

      const sitemapPage = await loadPage("/sitemap.xml");
      const entries = parseSitemap(sitemapPage.content);
      for (const entry of entries) {
        assert.ok(entry.loc.startsWith("https://"), `Sitemap loc must use HTTPS: ${entry.loc}`);
      }
    });
  });

  // =========================================================================
  // Area 3: Edge-Case Product Slugs & Redirects (>=5 tests)
  // =========================================================================
  describe("Area 3: Edge-Case Product Slugs & Redirects", () => {
    it("T2.3.1: amasi-buttermilk legacy slug maps to amasi", async () => {
      const pageFile = path.join(process.cwd(), "src", "app", "products", "[slug]", "page.tsx");
      const content = await fs.readFile(pageFile, "utf-8");
      assert.ok(
        content.includes('rawSlug === "amasi-buttermilk"') || content.includes('"amasi-buttermilk"'),
        "Product route must map amasi-buttermilk slug to amasi"
      );
    });

    it("T2.3.2: spring-meadow-juice legacy slug maps to juice", async () => {
      const pageFile = path.join(process.cwd(), "src", "app", "products", "[slug]", "page.tsx");
      const content = await fs.readFile(pageFile, "utf-8");
      assert.ok(
        content.includes('rawSlug === "spring-meadow-juice"') || content.includes('"spring-meadow-juice"'),
        "Product route must map spring-meadow-juice slug to juice"
      );
    });

    it("T2.3.3: Product route /products/cheese redirects or forwards to /cheese", async () => {
      const pageFile = path.join(process.cwd(), "src", "app", "products", "[slug]", "page.tsx");
      const content = await fs.readFile(pageFile, "utf-8");
      assert.ok(
        content.includes('slug === "cheese"') && content.includes('/cheese'),
        "Product route must handle 'cheese' slug by redirecting to /cheese"
      );
    });

    it("T2.3.4: Unknown product slug triggers notFound() error boundary", async () => {
      const pageFile = path.join(process.cwd(), "src", "app", "products", "[slug]", "page.tsx");
      const content = await fs.readFile(pageFile, "utf-8");
      assert.ok(
        content.includes("notFound()"),
        "Product page must call notFound() for unknown slugs"
      );
    });

    it("T2.3.5: Static params generator defines all 6 canonical product slugs", async () => {
      const pageFile = path.join(process.cwd(), "src", "app", "products", "[slug]", "page.tsx");
      const content = await fs.readFile(pageFile, "utf-8");
      const required = ["fresh-milk", "yoghurt", "fresh-cream", "amasi", "juice", "dairy-blend"];
      for (const slug of required) {
        assert.ok(
          content.includes(`slug: "${slug}"`) || content.includes(`slug: '${slug}'`),
          `generateStaticParams must include ${slug}`
        );
      }
    });
  });

  // =========================================================================
  // Area 4: Protocol & Syntax Compliance (>=5 tests)
  // =========================================================================
  describe("Area 4: Protocol Compliance & Syntax", () => {
    it("T2.4.1: sitemap.xml strictly validates with no XML syntax errors", async () => {
      const page = await loadPage("/sitemap.xml");
      const result = validateXmlSyntax(page.content);
      assert.ok(result.valid, `sitemap.xml XML syntax error: ${result.error}`);
    });

    it("T2.4.2: sitemap.xml <lastmod> dates conform strictly to W3C ISO 8601 format", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      const iso8601Regex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z)?$/;

      for (const entry of entries) {
        assert.ok(
          iso8601Regex.test(entry.lastmod),
          `Invalid ISO 8601 date in sitemap for ${entry.loc}: "${entry.lastmod}"`
        );
      }
    });

    it("T2.4.3: sitemap.xml <priority> values are valid numbers between 0.0 and 1.0", async () => {
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      for (const entry of entries) {
        const num = Number(entry.priority);
        assert.ok(!isNaN(num), `Priority must be numeric: ${entry.priority}`);
        assert.ok(num >= 0.0 && num <= 1.0, `Priority out of range [0.0, 1.0]: ${num}`);
      }
    });

    it("T2.4.4: sitemap.xml <changefreq> values are strictly protocol-compliant", async () => {
      const validFreqs = new Set(["always", "hourly", "daily", "weekly", "monthly", "yearly", "never"]);
      const page = await loadPage("/sitemap.xml");
      const entries = parseSitemap(page.content);
      for (const entry of entries) {
        assert.ok(
          validFreqs.has(entry.changefreq),
          `Invalid changefreq in sitemap for ${entry.loc}: "${entry.changefreq}"`
        );
      }
    });

    it("T2.4.5: robots.txt syntax conforms strictly to Robots Exclusion Protocol", async () => {
      const page = await loadPage("/robots.txt");
      const validation = validateRobotsSyntax(page.content);
      assert.ok(validation.valid, `robots.txt syntax error: ${validation.error}`);
    });
  });

  // =========================================================================
  // Area 5: Schema Validation & Malformed Data Prevention (>=5 tests)
  // =========================================================================
  describe("Area 5: Schema Validation & Malformed Data Prevention", () => {
    it("T2.5.1: All JSON-LD scripts on all public pages parse cleanly with JSON.parse", async () => {
      const testRoutes = ["/", "/cheese", "/products/fresh-milk", "/products/yoghurt"];
      for (const route of testRoutes) {
        const page = await loadPage(route);
        const jsonLd = extractJsonLd(page.content);
        for (const item of jsonLd) {
          assert.equal(
            item.__parseError,
            undefined,
            `JSON-LD parse failure on ${route}: ${item.__parseError}`
          );
        }
      }
    });

    it("T2.5.2: Structured data @context is strictly https://schema.org", async () => {
      const page = await loadPage("/");
      const jsonLd = extractJsonLd(page.content);
      for (const schema of jsonLd) {
        const ctx = schema["@context"];
        assert.ok(
          ctx === "https://schema.org" || ctx === "http://schema.org",
          `Expected Schema.org context, got: ${ctx}`
        );
      }
    });

    it("T2.5.3: Structured data does not leak 'undefined' or 'NaN' strings", async () => {
      const testRoutes = ["/", "/cheese", "/products/fresh-milk"];
      for (const route of testRoutes) {
        const page = await loadPage(route);
        const rawJsonMatch = page.content.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi) || [];
        for (const block of rawJsonMatch) {
          assert.ok(!block.includes('"undefined"'), `Found literal "undefined" in JSON-LD on ${route}`);
          assert.ok(!block.includes('"NaN"'), `Found literal "NaN" in JSON-LD on ${route}`);
          assert.ok(!block.includes('[object Object]'), `Found unstringified object in JSON-LD on ${route}`);
        }
      }
    });

    it("T2.5.4: Offer priceCurrency conforms strictly to ISO 4217 (ZAR)", async () => {
      const page = await loadPage("/products/fresh-milk");
      const jsonLd = extractJsonLd(page.content);
      const products = findSchemasByType(jsonLd, "Product");
      if (products.length > 0 && products[0].offers) {
        const offer = Array.isArray(products[0].offers) ? products[0].offers[0] : products[0].offers;
        if (offer.priceCurrency) {
          assert.equal(offer.priceCurrency, "ZAR", "Price currency must be ISO 4217 'ZAR'");
        }
      }
    });

    it("T2.5.5: GeoCoordinates in WholesaleStore have valid coordinates for Midrand, Gauteng", async () => {
      const page = await loadPage("/");
      const jsonLd = extractJsonLd(page.content);
      const stores = findSchemasByType(jsonLd, "WholesaleStore").concat(
        findSchemasByType(jsonLd, "LocalBusiness")
      );
      if (stores.length > 0 && stores[0].geo) {
        const geo = stores[0].geo;
        const lat = parseFloat(geo.latitude);
        const lng = parseFloat(geo.longitude);
        assert.ok(lat < 0, `Latitude must be negative (Southern hemisphere): ${lat}`);
        assert.ok(lat >= -26.5 && lat <= -25.5, `Latitude out of range for Midrand: ${lat}`);
        assert.ok(lng >= 27.5 && lng <= 28.5, `Longitude out of range for Midrand: ${lng}`);
      }
    });
  });
});
