import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const appDir = path.join(rootDir, ".next", "server", "app");

// Helper to extract JSON-LD objects from raw HTML
function extractJsonLd(html) {
  const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const items = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1]);
      if (Array.isArray(parsed)) {
        items.push(...parsed);
      } else if (parsed && Array.isArray(parsed["@graph"])) {
        items.push(...parsed["@graph"]);
      } else if (parsed) {
        items.push(parsed);
      }
    } catch (err) {
      console.error("Failed to parse JSON-LD chunk:", err.message);
    }
  }
  return items;
}

function findSchemasByType(schemas, targetType) {
  const matches = [];
  function recurse(obj) {
    if (!obj || typeof obj !== "object") return;
    if (obj["@type"] === targetType) {
      matches.push(obj);
    }
    for (const key of Object.keys(obj)) {
      if (typeof obj[key] === "object") {
        recurse(obj[key]);
      }
    }
  }
  for (const s of schemas) {
    recurse(s);
  }
  return matches;
}

const results = {
  homepage: {},
  cheese: {},
  products: {},
  crm: {},
  invoices: {},
  passed: true,
  failures: []
};

function recordFailure(msg) {
  results.passed = false;
  results.failures.push(msg);
  console.error("❌ FAIL:", msg);
}

function recordSuccess(msg) {
  console.log("✔ PASS:", msg);
}

console.log("================================================================================");
console.log("Jozi Dairy Milestone 2 Adversarial Verification & Schema Leakage Audit");
console.log("================================================================================\n");

// ----------------------------------------------------
// 1. HOMEPAGE SCHEMA VERIFICATION
// ----------------------------------------------------
console.log("--- 1. Testing Homepage (index.html) ---");
const indexHtmlPath = path.join(appDir, "index.html");
let homeQuestions = [];

if (!fs.existsSync(indexHtmlPath)) {
  recordFailure(`index.html not found in ${appDir}`);
} else {
  const indexHtml = fs.readFileSync(indexHtmlPath, "utf8");
  const schemas = extractJsonLd(indexHtml);
  results.homepage.totalSchemasFound = schemas.length;

  const faqPages = findSchemasByType(schemas, "FAQPage");
  const websites = findSchemasByType(schemas, "WebSite");
  const stores = findSchemasByType(schemas, "WholesaleStore");

  // Check 1: WebSite & WholesaleStore exist in root graph
  if (websites.length > 0 && stores.length > 0) {
    recordSuccess(`Homepage contains WebSite and WholesaleStore schemas`);
  } else {
    recordFailure(`Homepage missing WebSite (${websites.length}) or WholesaleStore (${stores.length})`);
  }

  // Check 2: FAQPage exists on homepage
  if (faqPages.length === 1) {
    recordSuccess(`Homepage contains exactly 1 FAQPage schema`);
    const mainEntity = faqPages[0].mainEntity || [];
    homeQuestions = mainEntity.map((q) => q.name || q.question).filter(Boolean);
    results.homepage.faqCount = homeQuestions.length;
    results.homepage.questions = homeQuestions;

    if (homeQuestions.length === 5) {
      recordSuccess(`Homepage FAQPage contains exactly 5 general Gauteng distribution FAQs`);
    } else {
      recordFailure(`Homepage FAQPage expected 5 FAQs, found ${homeQuestions.length}`);
    }
  } else {
    recordFailure(`Homepage should contain exactly 1 FAQPage schema, found ${faqPages.length}`);
  }
}

// ----------------------------------------------------
// 2. CHEESE CATALOG SCHEMA & LEAKAGE VERIFICATION
// ----------------------------------------------------
console.log("\n--- 2. Testing Cheese Catalog (cheese.html) ---");
const cheeseHtmlPath = path.join(appDir, "cheese.html");

if (!fs.existsSync(cheeseHtmlPath)) {
  recordFailure(`cheese.html not found in ${appDir}`);
} else {
  const cheeseHtml = fs.readFileSync(cheeseHtmlPath, "utf8");
  const schemas = extractJsonLd(cheeseHtml);
  results.cheese.totalSchemasFound = schemas.length;

  const faqPages = findSchemasByType(schemas, "FAQPage");
  const itemLists = findSchemasByType(schemas, "ItemList");
  const breadcrumbs = findSchemasByType(schemas, "BreadcrumbList");
  const products = findSchemasByType(schemas, "Product");

  // Check 1: Cheese has ZERO FAQPage schemas
  if (faqPages.length === 0) {
    recordSuccess(`Cheese catalog (/cheese) has ZERO FAQPage schemas (No FAQ leakage)`);
  } else {
    recordFailure(`Cheese catalog (/cheese) LEAKED ${faqPages.length} FAQPage schema(s)!`);
  }

  // Check 2: Cheese contains ItemList with 4 products
  if (itemLists.length >= 1) {
    const listItems = itemLists[0].itemListElement || [];
    recordSuccess(`Cheese catalog contains ItemList with ${listItems.length} items`);
    if (listItems.length >= 4) {
      recordSuccess(`Cheese catalog ItemList contains >= 4 cheese varieties`);
    } else {
      recordFailure(`Cheese catalog ItemList contains fewer than 4 items: ${listItems.length}`);
    }
  } else {
    recordFailure(`Cheese catalog missing ItemList schema`);
  }

  // Check 3: Cheese contains BreadcrumbList
  if (breadcrumbs.length >= 1) {
    recordSuccess(`Cheese catalog contains BreadcrumbList schema`);
  } else {
    recordFailure(`Cheese catalog missing BreadcrumbList schema`);
  }
}

// ----------------------------------------------------
// 3. PRODUCT PAGES SCHEMA & LEAKAGE VERIFICATION
// ----------------------------------------------------
console.log("\n--- 3. Testing Product Detail Pages (products/*.html) ---");
const productsDir = path.join(appDir, "products");
const expectedSlugs = ["fresh-milk", "yoghurt", "fresh-cream", "amasi", "dairy-blend", "juice"];

for (const slug of expectedSlugs) {
  const productHtmlPath = path.join(productsDir, `${slug}.html`);
  if (!fs.existsSync(productHtmlPath)) {
    recordFailure(`Product HTML file missing for ${slug}: ${productHtmlPath}`);
    continue;
  }

  const productHtml = fs.readFileSync(productHtmlPath, "utf8");
  const schemas = extractJsonLd(productHtml);
  const products = findSchemasByType(schemas, "Product");
  const offers = findSchemasByType(schemas, "Offer");
  const breadcrumbs = findSchemasByType(schemas, "BreadcrumbList");
  const faqPages = findSchemasByType(schemas, "FAQPage");

  results.products[slug] = {
    hasProduct: products.length > 0,
    offerCount: offers.length,
    hasBreadcrumbs: breadcrumbs.length > 0,
    faqPageCount: faqPages.length,
    faqQuestions: []
  };

  // Check 1: Product schema exists with Offer
  if (products.length > 0 && offers.length > 0) {
    recordSuccess(`Product /products/${slug} contains Product schema with ${offers.length} Offer(s)`);
  } else {
    recordFailure(`Product /products/${slug} missing Product (${products.length}) or Offer (${offers.length})`);
  }

  // Check 2: BreadcrumbList exists
  if (breadcrumbs.length > 0) {
    recordSuccess(`Product /products/${slug} contains BreadcrumbList`);
  } else {
    recordFailure(`Product /products/${slug} missing BreadcrumbList`);
  }

  // Check 3: FAQPage Leakage and Scoping
  if (faqPages.length > 0) {
    const questions = [];
    for (const faqPage of faqPages) {
      const items = faqPage.mainEntity || [];
      for (const item of items) {
        questions.push(item.name || item.question);
      }
    }
    results.products[slug].faqQuestions = questions;

    // Verify NONE of the questions match homepage questions
    let leakedCount = 0;
    for (const q of questions) {
      if (homeQuestions.includes(q)) {
        leakedCount++;
        recordFailure(`LEAKAGE in /products/${slug}: General homepage FAQ leaked: "${q}"`);
      }
    }
    if (leakedCount === 0) {
      recordSuccess(`Product /products/${slug} FAQs are strictly decoupled: 0/${questions.length} match homepage FAQs`);
    }
  } else {
    // If product has no FAQs defined, zero FAQPage is acceptable
    recordSuccess(`Product /products/${slug} has 0 FAQPage schemas`);
  }
}

// ----------------------------------------------------
// 4. INTERNAL & PRIVATE ROUTES LEAKAGE VERIFICATION
// ----------------------------------------------------
console.log("\n--- 4. Testing Internal Routes Boundary Isolation (CRM & Invoices) ---");

async function verifyInternalRoutes() {
  const port = 3058;
  console.log(`Starting next server on port ${port} to test live dynamic routes...`);
  const serverProc = spawn("npm", ["run", "start", "--", "-p", String(port)], {
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    cwd: rootDir
  });

  const testRoutes = [
    { name: "CRM Dashboard", path: "/crm" },
    { name: "CRM Login", path: "/crm/login" },
    { name: "Invoice Print", path: "/invoices/JD-2026-0148/print" }
  ];

  // Wait for server to come up
  const readinessUrl = `http://127.0.0.1:${port}/crm/login`;
  let ready = false;
  const start = Date.now();
  while (Date.now() - start < 25000) {
    try {
      const r = await fetch(readinessUrl);
      if (r.ok || r.status === 401 || r.status === 307 || r.status === 200) {
        ready = true;
        break;
      }
    } catch {
      await new Promise((r) => setTimeout(r, 600));
    }
  }

  if (!ready) {
    recordFailure(`Next server failed to become ready within 25 seconds on port ${port}`);
  } else {
    recordSuccess(`Next server ready on port ${port}`);

    for (const route of testRoutes) {
      console.log(`\nInspecting route: ${route.name} (${route.path})`);
      try {
        const url = `http://127.0.0.1:${port}${route.path}`;
        const res = await fetch(url);
        const html = await res.text();
        const schemas = extractJsonLd(html);

        const faqPages = findSchemasByType(schemas, "FAQPage");
        const products = findSchemasByType(schemas, "Product");
        const offers = findSchemasByType(schemas, "Offer");
        const itemLists = findSchemasByType(schemas, "ItemList");

        // Check A: Zero FAQPage
        if (faqPages.length === 0) {
          recordSuccess(`${route.name} (${route.path}): ZERO FAQPage schemas (No FAQ leakage)`);
        } else {
          recordFailure(`${route.name} (${route.path}): LEAKED ${faqPages.length} FAQPage schema(s)!`);
        }

        // Check B: Zero Product
        if (products.length === 0) {
          recordSuccess(`${route.name} (${route.path}): ZERO Product schemas (No catalog leakage)`);
        } else {
          recordFailure(`${route.name} (${route.path}): LEAKED ${products.length} Product schema(s)!`);
        }

        // Check C: Zero Offer
        if (offers.length === 0) {
          recordSuccess(`${route.name} (${route.path}): ZERO Offer schemas (No pricing leakage)`);
        } else {
          recordFailure(`${route.name} (${route.path}): LEAKED ${offers.length} Offer schema(s)!`);
        }

        // Check D: Zero ItemList
        if (itemLists.length === 0) {
          recordSuccess(`${route.name} (${route.path}): ZERO ItemList schemas`);
        } else {
          recordFailure(`${route.name} (${route.path}): LEAKED ${itemLists.length} ItemList schema(s)!`);
        }

        // Check E: robots meta is noindex
        const robotsMatch = html.match(/<meta\s+name=["']robots["']\s+content=["']([^"']*)["']/i);
        if (robotsMatch && robotsMatch[1].includes("noindex")) {
          recordSuccess(`${route.name} (${route.path}): contains robots noindex meta tag ("${robotsMatch[1]}")`);
        } else {
          recordFailure(`${route.name} (${route.path}): missing robots noindex meta tag!`);
        }
      } catch (err) {
        recordFailure(`Failed to fetch ${route.path}: ${err.message}`);
      }
    }
  }

  // Cleanup server
  console.log("\nStopping next server...");
  serverProc.kill("SIGTERM");
  if (process.platform === "win32") {
    spawn("taskkill", ["/pid", String(serverProc.pid), "/f", "/t"]);
  }
}

await verifyInternalRoutes();

// ----------------------------------------------------
// 5. SUMMARY AND REPORT
// ----------------------------------------------------
console.log("\n================================================================================");
console.log("Adversarial Verification Summary");
console.log("================================================================================");
console.log(`Overall Result: ${results.passed ? "PASSED" : "FAILED"}`);
console.log(`Total Failures: ${results.failures.length}`);

if (results.failures.length > 0) {
  console.log("\nFailure Details:");
  results.failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
}

fs.writeFileSync(
  path.join(rootDir, "tests", "adversarial-m2-results.json"),
  JSON.stringify(results, null, 2)
);

process.exit(results.passed ? 0 : 1);
