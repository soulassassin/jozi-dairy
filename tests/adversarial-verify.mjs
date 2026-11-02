import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import { spawn } from "node:child_process";

const rootDir = process.cwd();
const appDir = path.join(rootDir, ".next", "server", "app");

function extractMeta(html, nameOrProp, attr = "name") {
  const regex = new RegExp(`<meta\\s+${attr}=["']${nameOrProp}["']\\s+content=["']([^"']*)["']`, "i");
  const match = html.match(regex);
  if (match) return match[1];
  // Check alternative ordering: content before name/property
  const revRegex = new RegExp(`<meta\\s+content=["']([^"']*)["']\\s+${attr}=["']${nameOrProp}["']`, "i");
  const revMatch = html.match(revRegex);
  return revMatch ? revMatch[1] : null;
}

function extractTag(html, regex) {
  const match = html.match(regex);
  return match ? match[1] : null;
}

const results = {
  cheese: {},
  products: {},
  invoices: {},
  passed: true,
  failures: []
};

function recordFailure(msg) {
  results.passed = false;
  results.failures.push(msg);
  console.error("FAIL:", msg);
}

function recordSuccess(msg) {
  console.log("PASS:", msg);
}

console.log("=== EMPIRICAL ADVERSARIAL VERIFICATION START ===");

// ----------------------------------------------------
// 1. CHEESE.HTML INSPECTION
// ----------------------------------------------------
console.log("\n--- Testing cheese.html ---");
const cheeseHtmlPath = path.join(appDir, "cheese.html");
const indexHtmlPath = path.join(appDir, "index.html");

if (!fs.existsSync(cheeseHtmlPath)) {
  recordFailure(`cheese.html does not exist at ${cheeseHtmlPath}`);
} else {
  const cheeseHtml = fs.readFileSync(cheeseHtmlPath, "utf8");
  const indexHtml = fs.existsSync(indexHtmlPath) ? fs.readFileSync(indexHtmlPath, "utf8") : "";

  const cheeseTwitterCard = extractMeta(cheeseHtml, "twitter:card", "name");
  const cheeseTwitterTitle = extractMeta(cheeseHtml, "twitter:title", "name");
  const cheeseTwitterDesc = extractMeta(cheeseHtml, "twitter:description", "name");
  const cheeseTwitterImg = extractMeta(cheeseHtml, "twitter:image", "name");
  const cheeseOgTitle = extractMeta(cheeseHtml, "og:title", "property");
  const cheeseCanonical = extractTag(cheeseHtml, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  const homeTitle = extractTag(indexHtml, /<title>([^<]*)<\/title>/i);
  const homeTwitterTitle = extractMeta(indexHtml, "twitter:title", "name");
  const homeOgTitle = extractMeta(indexHtml, "og:title", "property");

  results.cheese = {
    twitterCard: cheeseTwitterCard,
    twitterTitle: cheeseTwitterTitle,
    twitterDesc: cheeseTwitterDesc,
    twitterImg: cheeseTwitterImg,
    ogTitle: cheeseOgTitle,
    canonical: cheeseCanonical,
    homeTitle,
    homeTwitterTitle,
    homeOgTitle
  };

  // Check 1: twitter:card === 'summary_large_image'
  if (cheeseTwitterCard === "summary_large_image") {
    recordSuccess(`cheese.html has twitter:card="summary_large_image"`);
  } else {
    recordFailure(`cheese.html twitter:card is "${cheeseTwitterCard}", expected "summary_large_image"`);
  }

  // Check 2: twitter:title != home title and != home twitter:title
  if (cheeseTwitterTitle && cheeseTwitterTitle !== homeTitle && cheeseTwitterTitle !== homeTwitterTitle) {
    recordSuccess(`cheese.html twitter:title ("${cheeseTwitterTitle}") is distinct from home title ("${homeTitle}")`);
  } else {
    recordFailure(`cheese.html twitter:title matches home title ("${cheeseTwitterTitle}" vs "${homeTitle}")`);
  }

  // Check 3: og:title does NOT contain duplicate "| Jozi Dairy | Jozi Dairy"
  if (cheeseOgTitle && !cheeseOgTitle.includes("Jozi Dairy | Jozi Dairy")) {
    recordSuccess(`cheese.html og:title ("${cheeseOgTitle}") does NOT contain duplicate branding`);
  } else {
    recordFailure(`cheese.html og:title has duplicate branding: "${cheeseOgTitle}"`);
  }

  // Check 4: canonical tag points to /cheese or https://.../cheese
  if (cheeseCanonical && (cheeseCanonical === "/cheese" || cheeseCanonical.endsWith("/cheese"))) {
    recordSuccess(`cheese.html canonical points to /cheese (${cheeseCanonical})`);
  } else {
    recordFailure(`cheese.html canonical is "${cheeseCanonical}", expected to end with /cheese`);
  }
}

// ----------------------------------------------------
// 2. ALL 6 PRODUCTS/*.HTML INSPECTION
// ----------------------------------------------------
console.log("\n--- Testing 6 products/*.html ---");
const expectedSlugs = ["fresh-milk", "yoghurt", "fresh-cream", "amasi", "juice", "dairy-blend"];
const productMeta = {};
const titles = new Set();
const descriptions = new Set();
const images = new Set();

for (const slug of expectedSlugs) {
  const prodHtmlPath = path.join(appDir, "products", `${slug}.html`);
  if (!fs.existsSync(prodHtmlPath)) {
    recordFailure(`Product HTML artifact missing for ${slug} at ${prodHtmlPath}`);
    continue;
  }

  const html = fs.readFileSync(prodHtmlPath, "utf8");
  const twTitle = extractMeta(html, "twitter:title", "name");
  const twDesc = extractMeta(html, "twitter:description", "name");
  const twImg = extractMeta(html, "twitter:image", "name");
  const twCard = extractMeta(html, "twitter:card", "name");
  const ogTitle = extractMeta(html, "og:title", "property");
  const ogDesc = extractMeta(html, "og:description", "property");
  const ogImg = extractMeta(html, "og:image", "property");
  const canonical = extractTag(html, /<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);

  productMeta[slug] = {
    twTitle,
    twDesc,
    twImg,
    twCard,
    ogTitle,
    ogDesc,
    ogImg,
    canonical
  };

  if (twTitle) titles.add(twTitle);
  if (twDesc) descriptions.add(twDesc);
  if (twImg) images.add(twImg);

  if (twCard !== "summary_large_image") {
    recordFailure(`Product ${slug} twitter:card is "${twCard}", expected "summary_large_image"`);
  }

  if (!canonical || !canonical.endsWith(`/products/${slug}`)) {
    recordFailure(`Product ${slug} canonical (${canonical}) does not end with /products/${slug}`);
  }
}

results.products = productMeta;

// Verify distinctness across all 6
if (titles.size === expectedSlugs.length) {
  recordSuccess(`All 6 products have distinct twitter:title (${titles.size}/6 distinct)`);
} else {
  recordFailure(`Product twitter:titles are NOT distinct (${titles.size}/6 distinct)`);
}

if (descriptions.size === expectedSlugs.length) {
  recordSuccess(`All 6 products have distinct twitter:description (${descriptions.size}/6 distinct)`);
} else {
  recordFailure(`Product twitter:descriptions are NOT distinct (${descriptions.size}/6 distinct)`);
}

if (images.size === expectedSlugs.length) {
  recordSuccess(`All 6 products have distinct twitter:image (${images.size}/6 distinct)`);
} else {
  recordFailure(`Product twitter:images are NOT distinct (${images.size}/6 distinct)`);
}

// Verify dedicated 1200x630 cards for milk, yoghurt, amasi
const dedicatedCardChecks = [
  { slug: "fresh-milk", expectedEnding: "/og/milk-preview.jpg" },
  { slug: "yoghurt", expectedEnding: "/og/yoghurt-preview.jpg" },
  { slug: "amasi", expectedEnding: "/og/amasi-preview.jpg" }
];

for (const check of dedicatedCardChecks) {
  const actualImg = productMeta[check.slug]?.twImg || "";
  if (actualImg.endsWith(check.expectedEnding) || actualImg.includes(check.expectedEnding)) {
    recordSuccess(`Product ${check.slug} uses dedicated card: ${actualImg}`);
  } else {
    recordFailure(`Product ${check.slug} twitter:image (${actualImg}) does not use ${check.expectedEnding}`);
  }
}

// ----------------------------------------------------
// 3. INVOICES PRIVACY & PRINT RENDERING INSPECTION
// ----------------------------------------------------
console.log("\n--- Testing Invoices Route & Print Layout ---");

// Step 3a: Inspect static source files
const invoiceLayoutPath = path.join(rootDir, "src", "app", "invoices", "layout.tsx");
const invoicePrintPagePath = path.join(rootDir, "src", "app", "invoices", "[id]", "print", "page.tsx");

if (!fs.existsSync(invoiceLayoutPath)) {
  recordFailure(`src/app/invoices/layout.tsx not found!`);
} else {
  const layoutContent = fs.readFileSync(invoiceLayoutPath, "utf8");
  if (layoutContent.includes("index: false") && layoutContent.includes("follow: false") && layoutContent.includes("nocache: true")) {
    recordSuccess(`src/app/invoices/layout.tsx exports index: false, follow: false, nocache: true`);
  } else {
    recordFailure(`src/app/invoices/layout.tsx missing required robots properties`);
  }
}

// Step 3b: Spin up next server to inspect live rendered HTML
async function verifyLiveInvoice() {
  const port = 3055;
  console.log(`Starting next server on port ${port}...`);
  const serverProc = spawn("npm", ["run", "start", "--", "-p", String(port)], {
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    cwd: rootDir
  });

  serverProc.stdout.on("data", (data) => {
    // console.log("server stdout:", data.toString());
  });
  serverProc.stderr.on("data", (data) => {
    // console.error("server stderr:", data.toString());
  });

  const targetUrl = `http://127.0.0.1:${port}/invoices/JD-2026-0148/print`;
  console.log(`Polling ${targetUrl} for server readiness...`);

  let res = null;
  let html = "";
  const start = Date.now();
  while (Date.now() - start < 20000) {
    try {
      res = await fetch(targetUrl);
      if (res.ok) {
        html = await res.text();
        break;
      }
    } catch {
      // wait 500ms before retrying
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  try {
    if (!res || !html) {
      throw new Error(`Server did not respond with 200 within 20s (last status: ${res ? res.status : "connection error"})`);
    }
    results.invoices.statusCode = res.status;

    // Check robots meta
    const robotsMeta = extractMeta(html, "robots", "name");
    results.invoices.robotsMeta = robotsMeta;

    if (robotsMeta && robotsMeta.includes("noindex") && robotsMeta.includes("nofollow")) {
      recordSuccess(`Live rendered /invoices/[id]/print contains <meta name="robots" content="${robotsMeta}">`);
    } else {
      recordFailure(`Live rendered invoice robots meta missing or incorrect: "${robotsMeta}"`);
    }

    if (robotsMeta && robotsMeta.includes("nocache")) {
      recordSuccess(`Live rendered /invoices/[id]/print contains nocache directive`);
    } else {
      recordFailure(`Live rendered invoice robots meta missing nocache: "${robotsMeta}"`);
    }

    // Check print styles preserved
    const hasPrintHidden = html.includes("print:hidden");
    const hasPrintP0 = html.includes("print:p-0");
    const hasPrintBgWhite = html.includes("print:bg-white");
    const hasPrintShadowNone = html.includes("print:shadow-none");
    const hasWindowPrint = html.includes("window.print") || html.includes("Print / Save as PDF");

    results.invoices.printStyles = {
      hasPrintHidden,
      hasPrintP0,
      hasPrintBgWhite,
      hasPrintShadowNone,
      hasWindowPrint
    };

    if (hasPrintHidden && hasPrintP0 && hasPrintBgWhite && hasPrintShadowNone && hasWindowPrint) {
      recordSuccess(`Live rendered /invoices/[id]/print preserves all @media print utility classes and print action`);
    } else {
      recordFailure(`Live rendered invoice missing expected print CSS utility classes`);
    }

    // Check invoice SARS data rendering
    const hasSarsHeading = html.includes("TAX INVOICE") || html.includes("Tax Invoice");
    const hasVat = html.includes("4210298374") || html.includes("VAT");
    const hasBank = html.includes("First National Bank") || html.includes("FNB");

    results.invoices.contentPreservation = {
      hasSarsHeading,
      hasVat,
      hasBank
    };

    if (hasSarsHeading && hasVat && hasBank) {
      recordSuccess(`Live rendered /invoices/[id]/print preserves complete SARS tax invoice layout and data`);
    } else {
      recordFailure(`Live rendered invoice failed to render complete invoice layout and data`);
    }
  } catch (err) {
    recordFailure(`Failed to fetch live invoice: ${err.message}`);
  } finally {
    console.log("Shutting down next test server...");
    serverProc.kill("SIGTERM");
    if (process.platform === "win32") {
      spawn("taskkill", ["/pid", String(serverProc.pid), "/f", "/t"]);
    }
  }
}

await verifyLiveInvoice();

console.log("\n=== VERIFICATION SUMMARY ===");
console.log(`Passed: ${results.passed}`);
console.log(`Failure count: ${results.failures.length}`);
if (results.failures.length > 0) {
  console.log("Failures:", results.failures);
}

// Write results json for empirical analysis reference
fs.writeFileSync(path.join(rootDir, "tests", "adversarial-results.json"), JSON.stringify(results, null, 2));

process.exit(results.passed ? 0 : 1);
