import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import { loadPage } from "./helpers/pageLoader.mjs";
import {
  extractCanonical,
  extractJsonLd,
  extractMeta,
  extractTitle,
} from "./helpers/htmlParser.mjs";
import { parseSitemap } from "./helpers/sitemapParser.mjs";
import { parseRobots, isAllowed } from "./helpers/robotsParser.mjs";
import { findSchemasByType } from "./helpers/schemaValidator.mjs";

describe("Tier 4 - Real-World Application Scenarios", () => {
  // =========================================================================
  // Scenario 1: Googlebot Indexing Workflow Simulation
  // =========================================================================
  it("T4.1: Simulated Googlebot Indexing Pipeline (crawl robots.txt -> sitemap -> public routes -> verify indexability)", async () => {
    // Step 1: Googlebot requests /robots.txt
    const robotsPage = await loadPage("/robots.txt");
    assert.equal(robotsPage.status, 200, "Googlebot: /robots.txt must return 200 OK");
    const parsedRobots = parseRobots(robotsPage.content);
    assert.ok(parsedRobots.sitemaps.length > 0, "Googlebot: Sitemap directive must be present in robots.txt");

    // Step 2: Googlebot fetches the declared sitemap URL
    const sitemapUrl = parsedRobots.sitemaps[0];
    const sitemapPath = new URL(sitemapUrl).pathname;
    const sitemapPage = await loadPage(sitemapPath);
    assert.equal(sitemapPage.status, 200, "Googlebot: Declared sitemap must return 200 OK");
    const entries = parseSitemap(sitemapPage.content);
    assert.ok(entries.length >= 8, `Googlebot: Sitemap must contain all public routes (found ${entries.length})`);

    // Step 3: Googlebot crawls each URL discovered in the sitemap
    for (const entry of entries) {
      if (entry.loc.includes("#")) continue; // Skip hash fragment if legacy
      const pageUrl = new URL(entry.loc);
      const isPermitted = isAllowed(parsedRobots, pageUrl.pathname, "Googlebot");
      assert.ok(isPermitted, `Googlebot: Crawl forbidden by robots.txt for: ${entry.loc}`);

      const page = await loadPage(pageUrl.pathname);
      assert.equal(page.status, 200, `Googlebot: Page returned non-200: ${entry.loc}`);

      // Step 4: Googlebot inspects page metadata and indexing flags
      const title = extractTitle(page.content);
      assert.ok(title && title.length > 5, `Googlebot: Missing title on ${entry.loc}`);

      const desc = extractMeta(page.content, "description");
      assert.ok(desc && desc.length > 10, `Googlebot: Missing description on ${entry.loc}`);

      const robotsMeta = extractMeta(page.content, "robots");
      if (robotsMeta) {
        assert.ok(
          !robotsMeta.includes("noindex"),
          `Googlebot: Public route contains unintended 'noindex': ${entry.loc}`
        );
      }

      const canonical = extractCanonical(page.content);
      assert.ok(canonical, `Googlebot: Missing canonical URL on ${entry.loc}`);
    }
  });

  // =========================================================================
  // Scenario 2: Simulated AI Search Engine (GEO/AIO) Discovery
  // =========================================================================
  it("T4.2: Simulated AI Search Engine Discovery (Perplexity / ChatGPT context extraction pipeline)", async () => {
    // Step 1: AI Assistant / Agent requests /llms.txt for discovery
    const llmsPage = await loadPage("/llms.txt");
    assert.equal(llmsPage.status, 200, "AI Agent: /llms.txt must be accessible");

    // Step 2: Extract key entity knowledge from llms.txt
    const llmsText = llmsPage.content;
    const hasBrand = /Jozi Dairy/i.test(llmsText);
    const hasLocation = /Midrand/i.test(llmsText);
    const hasSourcing = /Mooi River/i.test(llmsText);
    assert.ok(hasBrand, "AI Agent: Failed to identify brand name in llms.txt");
    assert.ok(hasLocation, "AI Agent: Failed to identify primary hub location (Midrand)");
    assert.ok(hasSourcing, "AI Agent: Failed to identify sourcing provenance (Mooi River, KZN)");

    // Step 3: Follow link to detailed catalog in /llms-full.txt
    const llmsFullPage = await loadPage("/llms-full.txt");
    assert.equal(llmsFullPage.status, 200, "AI Agent: /llms-full.txt must be accessible");
    const catalogText = llmsFullPage.content;

    // Step 4: Extract factual claims for answer synthesis
    const facts = [
      { name: "Fresh Milk", pattern: /Fresh Milk/i },
      { name: "Yoghurt", pattern: /Yoghurt|Yogurt/i },
      { name: "Fresh Cream", pattern: /Fresh Cream/i },
      { name: "Amasi", pattern: /Amasi/i },
      { name: "Fruit Juice", pattern: /Juice/i },
      { name: "Cheddar Cheese", pattern: /Cheddar/i },
      { name: "Gouda Cheese", pattern: /Gouda/i },
      { name: "Mozzarella Cheese", pattern: /Mozzarella/i },
      { name: "Feta Cheese", pattern: /Feta/i },
    ];

    for (const fact of facts) {
      assert.ok(
        fact.pattern.test(catalogText),
        `AI Agent: Could not find factual details for '${fact.name}' in llms-full.txt`
      );
    }

    // Step 5: Commercial inquiry channels extraction
    assert.ok(
      /ashley@jozidairy\.co\.za|operations@jozidairy\.co\.za/.test(catalogText),
      "AI Agent: Commercial sales email contact must be extractable"
    );
    assert.ok(
      /065 234 2460|011 805 1355/.test(catalogText),
      "AI Agent: WhatsApp / telephone ordering hotline must be extractable"
    );
  });

  // =========================================================================
  // Scenario 3: Google Search Console Ownership Verification Pipeline
  // =========================================================================
  it("T4.3: Simulated Google Search Console Property Verification & Submission Pipeline", async () => {
    // Check Option A: Verification Meta Tag capability
    const layoutPath = path.join(process.cwd(), "src", "app", "layout.tsx");
    const layoutContent = await fs.readFile(layoutPath, "utf-8");
    assert.ok(
      layoutContent.includes("GOOGLE_SITE_VERIFICATION") || layoutContent.includes("verification"),
      "GSC Pipeline: layout.tsx must support environment-driven google-site-verification token"
    );

    // Check Option B: Setup guide documentation for search console administrators
    const docPath = path.join(process.cwd(), "docs", "GOOGLE_SEARCH_CONSOLE_SETUP.md");
    const docExists = await fs.stat(docPath).then(() => true).catch(() => false);
    assert.ok(docExists, "GSC Pipeline: docs/GOOGLE_SEARCH_CONSOLE_SETUP.md must be provided");

    const guideContent = await fs.readFile(docPath, "utf-8");
    assert.ok(
      guideContent.includes("sitemap.xml"),
      "GSC Pipeline: Guide must instruct on submitting sitemap.xml"
    );

    // Check Option C: Sitemap payload submission validation
    const sitemapPage = await loadPage("/sitemap.xml");
    assert.equal(sitemapPage.status, 200, "GSC Pipeline: Submitted sitemap must be HTTP 200 OK");
    const entries = parseSitemap(sitemapPage.content);
    assert.ok(entries.length >= 8, "GSC Pipeline: Submitted sitemap must contain all public routes");

    for (const entry of entries) {
      assert.ok(
        entry.loc.startsWith("https://www.jozidairy.co.za") || entry.loc.startsWith("http"),
        `GSC Pipeline: Sitemap loc does not match property domain: ${entry.loc}`
      );
    }
  });

  // =========================================================================
  // Scenario 4: Security & Privacy Crawl Audit Simulation
  // =========================================================================
  it("T4.4: Simulated Privacy & Data Leak Audit (verify invoices, CRM, and APIs are shielded)", async () => {
    // 1. Audit robots.txt
    const robotsPage = await loadPage("/robots.txt");
    const parsedRobots = parseRobots(robotsPage.content);

    const testRestrictedRoutes = [
      "/invoices/inv-test-1234/print",
      "/crm",
      "/crm/login",
      "/api/crm/stats",
      "/api/crm/leads",
    ];

    for (const route of testRestrictedRoutes) {
      const allowed = isAllowed(parsedRobots, route, "*");
      assert.equal(
        allowed,
        false,
        `Security Audit: Route ${route} is NOT disallowed by robots.txt!`
      );
    }

    // 2. Audit sitemap.xml
    const sitemapPage = await loadPage("/sitemap.xml");
    const sitemapEntries = parseSitemap(sitemapPage.content);
    for (const entry of sitemapEntries) {
      assert.ok(!entry.loc.includes("/invoices/"), "Security Audit: Leaked invoice in sitemap");
      assert.ok(!entry.loc.includes("/crm"), "Security Audit: Leaked CRM path in sitemap");
      assert.ok(!entry.loc.includes("/api/"), "Security Audit: Leaked API path in sitemap");
    }

    // 3. Audit invoices layout for noindex
    const invoiceLayoutPath = path.join(process.cwd(), "src", "app", "invoices", "layout.tsx");
    const exists = await fs.stat(invoiceLayoutPath).then(() => true).catch(() => false);
    if (exists) {
      const content = await fs.readFile(invoiceLayoutPath, "utf-8");
      assert.ok(
        content.includes("index: false") && content.includes("follow: false"),
        "Security Audit: invoices/layout.tsx must configure noindex, nofollow"
      );
    }
  });

  // =========================================================================
  // Scenario 5: Social Media Sharing Card Preview Simulation
  // =========================================================================
  it("T4.5: Social Media Card Preview Simulation (Twitter / WhatsApp / LinkedIn crawler view)", async () => {
    const routesToAudit = ["/", "/cheese", "/products/fresh-milk"];

    for (const route of routesToAudit) {
      const page = await loadPage(route);

      // Facebook / LinkedIn / WhatsApp use OpenGraph
      const ogTitle = extractMeta(page.content, "og:title");
      const ogImage = extractMeta(page.content, "og:image");
      const ogDesc = extractMeta(page.content, "og:description");

      assert.ok(ogTitle && ogTitle.length > 5, `Social Audit: Missing og:title on ${route}`);
      assert.ok(ogImage && ogImage.length > 5, `Social Audit: Missing og:image on ${route}`);
      assert.ok(ogDesc && ogDesc.length > 10, `Social Audit: Missing og:description on ${route}`);

      // Twitter / X uses twitter:card
      const twitterCard = extractMeta(page.content, "twitter:card");
      const twitterTitle = extractMeta(page.content, "twitter:title");

      assert.equal(
        twitterCard,
        "summary_large_image",
        `Social Audit: Invalid twitter:card on ${route}: ${twitterCard}`
      );
      assert.ok(
        twitterTitle && twitterTitle.length > 5,
        `Social Audit: Missing twitter:title on ${route}`
      );
    }
  });
});
