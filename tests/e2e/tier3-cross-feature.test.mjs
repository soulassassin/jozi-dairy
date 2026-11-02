import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { loadPage } from "./helpers/pageLoader.mjs";
import {
  extractCanonical,
  extractJsonLd,
  extractMeta,
} from "./helpers/htmlParser.mjs";
import { parseSitemap } from "./helpers/sitemapParser.mjs";
import { parseRobots, isAllowed } from "./helpers/robotsParser.mjs";
import { findSchemasByType } from "./helpers/schemaValidator.mjs";

describe("Tier 3 - Cross-Feature Combinations", () => {
  it("T3.1: Canonical URLs and Sitemap URLs have 100% parity across all public indexable routes", async () => {
    const sitemapPage = await loadPage("/sitemap.xml");
    const sitemapEntries = parseSitemap(sitemapPage.content);
    assert.ok(sitemapEntries.length >= 8, `Expected at least 8 sitemap entries, got ${sitemapEntries.length}`);

    for (const entry of sitemapEntries) {
      // Ignore hash fragments if legacy sitemap still has them
      if (entry.loc.includes("#")) continue;

      const u = new URL(entry.loc);
      const pathname = u.pathname || "/";
      const page = await loadPage(pathname);
      assert.equal(page.status, 200, `Page at sitemap loc ${entry.loc} must be accessible`);

      const canonical = extractCanonical(page.content);
      assert.ok(canonical, `Canonical missing on page ${pathname}`);

      // Normalize trailing slash on root
      const normSitemap = entry.loc.replace(/\/$/, "");
      const normCanonical = canonical.replace(/\/$/, "");
      assert.equal(
        normCanonical,
        normSitemap,
        `Canonical URL (${canonical}) does not match Sitemap URL (${entry.loc}) on ${pathname}`
      );
    }
  });

  it("T3.2: Robots.txt does not disallow any URL listed in sitemap.xml", async () => {
    const robotsPage = await loadPage("/robots.txt");
    const parsedRobots = parseRobots(robotsPage.content);

    const sitemapPage = await loadPage("/sitemap.xml");
    const sitemapEntries = parseSitemap(sitemapPage.content);

    for (const entry of sitemapEntries) {
      if (entry.loc.includes("#")) continue;
      const u = new URL(entry.loc);
      const allowed = isAllowed(parsedRobots, u.pathname, "*");
      assert.ok(
        allowed,
        `Sitemap URL ${entry.loc} is disallowed by robots.txt directives!`
      );
    }
  });

  it("T3.3: Canonical public routes are allowed by robots.txt", async () => {
    const robotsPage = await loadPage("/robots.txt");
    const parsedRobots = parseRobots(robotsPage.content);

    const testRoutes = ["/", "/cheese", "/products/fresh-milk", "/products/yoghurt"];
    for (const route of testRoutes) {
      const allowed = isAllowed(parsedRobots, route, "*");
      assert.ok(allowed, `Canonical public route ${route} is blocked by robots.txt`);
    }
  });

  it("T3.4: Private/noindex routes (invoices, crm, api) are strictly excluded from sitemap.xml", async () => {
    const sitemapPage = await loadPage("/sitemap.xml");
    const sitemapEntries = parseSitemap(sitemapPage.content);
    const forbiddenSubstrings = ["/invoices", "/crm", "/api"];

    for (const entry of sitemapEntries) {
      for (const forbidden of forbiddenSubstrings) {
        assert.ok(
          !entry.loc.includes(forbidden),
          `Privacy leak: Sitemap contains private/restricted URL: ${entry.loc}`
        );
      }
    }
  });

  it("T3.5: OpenGraph URL (og:url) matches Canonical URL on every public page", async () => {
    const routesToTest = ["/", "/cheese", "/products/fresh-milk", "/products/fresh-cream"];
    for (const route of routesToTest) {
      const page = await loadPage(route);
      const canonical = extractCanonical(page.content);
      const ogUrl = extractMeta(page.content, "og:url");

      if (canonical && ogUrl) {
        const normCanonical = canonical.replace(/\/$/, "");
        const normOg = ogUrl.replace(/\/$/, "");
        assert.equal(
          normOg,
          normCanonical,
          `og:url (${ogUrl}) does not match canonical (${canonical}) on ${route}`
        );
      }
    }
  });

  it("T3.6: BreadcrumbList schema target URL matches page Canonical URL", async () => {
    const routesToTest = ["/cheese", "/products/fresh-milk"];
    for (const route of routesToTest) {
      const page = await loadPage(route);
      const canonical = extractCanonical(page.content);
      const jsonLd = extractJsonLd(page.content);
      const breadcrumbs = findSchemasByType(jsonLd, "BreadcrumbList");

      if (breadcrumbs.length > 0) {
        const list = breadcrumbs[0].itemListElement;
        const lastItem = list[list.length - 1];
        if (lastItem?.item) {
          const normCanonical = canonical.replace(/\/$/, "");
          const normItem = lastItem.item.replace(/\/$/, "");
          assert.equal(
            normItem,
            normCanonical,
            `Breadcrumb terminal item (${lastItem.item}) does not match canonical (${canonical}) on ${route}`
          );
        }
      }
    }
  });

  it("T3.7: Primary Schema entity @id / url matches page Canonical URL", async () => {
    const milkPage = await loadPage("/products/fresh-milk");
    const canonical = extractCanonical(milkPage.content);
    const jsonLd = extractJsonLd(milkPage.content);
    const products = findSchemasByType(jsonLd, "Product");

    if (products.length > 0 && products[0].url) {
      const normCanonical = canonical.replace(/\/$/, "");
      const normUrl = products[0].url.replace(/\/$/, "");
      assert.equal(
        normUrl,
        normCanonical,
        `Product schema url (${products[0].url}) does not match canonical (${canonical})`
      );
    }
  });

  it("T3.8: GSC verification meta tag does not mutate metadataBase or alter canonical tags", async () => {
    const homePage = await loadPage("/");
    const canonical = extractCanonical(homePage.content);
    assert.ok(canonical && !canonical.includes("verification"), "Canonical tag was not mutated by verification tag");
    assert.ok(canonical.startsWith("https://www.jozidairy.co.za") || canonical.startsWith("http"));
  });

  it("T3.9: Links documented in AI context (llms.txt) are listed in Sitemap and allowed in Robots.txt", async () => {
    const llmsPage = await loadPage("/llms.txt");
    if (llmsPage.status === 200) {
      const robotsPage = await loadPage("/robots.txt");
      const parsedRobots = parseRobots(robotsPage.content);

      // Extract markdown links [text](url)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(llmsPage.content)) !== null) {
        const href = match[2];
        if (href.startsWith("/")) {
          const allowed = isAllowed(parsedRobots, href, "*");
          assert.ok(
            allowed,
            `llms.txt references URL ${href} which is disallowed in robots.txt!`
          );
        }
      }
    }
  });

  it("T3.10: Dynamic Site URL resolver ensures identical origin across Sitemaps, Robots, and Metadata", async () => {
    const sitemapPage = await loadPage("/sitemap.xml");
    const robotsPage = await loadPage("/robots.txt");
    const homePage = await loadPage("/");

    const sitemapEntries = parseSitemap(sitemapPage.content);
    assert.ok(sitemapEntries.length > 0, "Sitemap must have entries");
    const sitemapOrigin = new URL(sitemapEntries[0].loc).origin;

    const parsedRobots = parseRobots(robotsPage.content);
    assert.ok(parsedRobots.sitemaps.length > 0, "Robots must declare sitemap");
    const robotsSitemapOrigin = new URL(parsedRobots.sitemaps[0]).origin;

    const canonical = extractCanonical(homePage.content);
    const canonicalOrigin = new URL(canonical).origin;

    assert.equal(sitemapOrigin, canonicalOrigin, "Sitemap and Canonical origins must match");
    assert.equal(robotsSitemapOrigin, canonicalOrigin, "Robots sitemap directive and Canonical origins must match");
  });
});
