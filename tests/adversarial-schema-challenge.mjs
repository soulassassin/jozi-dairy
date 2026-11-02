import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, ".next", "server", "app");

// Results tracking
const results = {
  routesChecked: [],
  jsonLdBlocksParsed: 0,
  parseErrors: [],
  unescapedLtChars: [],
  nullUndefinedNanLeaks: [],
  breadcrumbChecks: [],
  cheeseCatalogChecks: [],
  productOffersChecks: [],
  faqIsolationChecks: [],
  rootSchemaChecks: [],
  passed: true,
  failures: [],
};

function recordFailure(msg) {
  results.passed = false;
  results.failures.push(msg);
  console.error("  [FAIL]", msg);
}

function recordSuccess(msg) {
  console.log("  [PASS]", msg);
}

console.log("================================================================================");
console.log(" EMPIRICAL ADVERSARIAL CHALLENGE: Schema.org Structured Data (Milestone 2)");
console.log("================================================================================\n");

// Helper to extract canonical link
function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  return match ? match[1] : null;
}

// Helper to extract all script[type="application/ld+json"] contents
function extractJsonLdBlocks(html) {
  const blocks = [];
  const regex = /<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    blocks.push({
      rawContent: match[1],
      fullTag: match[0],
      index: match.index,
    });
  }
  return blocks;
}

// Helper to check for null/undefined/NaN leakages in parsed JSON
function checkValueLeaks(obj, path = "") {
  const leaks = [];
  if (obj === null) {
    leaks.push(`${path}: literal null`);
  } else if (obj === undefined) {
    leaks.push(`${path}: literal undefined`);
  } else if (typeof obj === "number" && isNaN(obj)) {
    leaks.push(`${path}: NaN number`);
  } else if (typeof obj === "string") {
    if (obj === "undefined" || obj === "null" || obj === "NaN") {
      leaks.push(`${path}: string "${obj}"`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, idx) => {
      leaks.push(...checkValueLeaks(item, `${path}[${idx}]`));
    });
  } else if (typeof obj === "object") {
    for (const [k, v] of Object.entries(obj)) {
      leaks.push(...checkValueLeaks(v, `${path}.${k}`));
    }
  }
  return leaks;
}

// Routes to inspect
const routesToTest = [
  { name: "Root (/)", file: "index.html", expectedTypes: ["WebSite", "WholesaleStore", "FAQPage"] },
  { name: "Cheese Catalog (/cheese)", file: "cheese.html", expectedTypes: ["ItemList", "BreadcrumbList"] },
  { name: "Product: Fresh Milk (/products/fresh-milk)", file: "products/fresh-milk.html", expectedTypes: ["Product", "BreadcrumbList", "FAQPage"], slug: "fresh-milk" },
  { name: "Product: Gourmet Yoghurt (/products/yoghurt)", file: "products/yoghurt.html", expectedTypes: ["Product", "BreadcrumbList", "FAQPage"], slug: "yoghurt" },
  { name: "Product: Fresh Cream (/products/fresh-cream)", file: "products/fresh-cream.html", expectedTypes: ["Product", "BreadcrumbList", "FAQPage"], slug: "fresh-cream" },
  { name: "Product: Cultured Amasi (/products/amasi)", file: "products/amasi.html", expectedTypes: ["Product", "BreadcrumbList", "FAQPage"], slug: "amasi" },
  { name: "Product: 100% Fruit Juice (/products/juice)", file: "products/juice.html", expectedTypes: ["Product", "BreadcrumbList", "FAQPage"], slug: "juice" },
  { name: "Product: Dairy Blend (/products/dairy-blend)", file: "products/dairy-blend.html", expectedTypes: ["Product", "BreadcrumbList"], slug: "dairy-blend" },
];

for (const route of routesToTest) {
  console.log(`\n--- Inspecting Route: ${route.name} (${route.file}) ---`);
  const fullPath = path.join(appDir, route.file);

  if (!fs.existsSync(fullPath)) {
    recordFailure(`Route HTML artifact missing at ${fullPath}`);
    continue;
  }

  results.routesChecked.push(route.file);
  const html = fs.readFileSync(fullPath, "utf8");
  const canonical = extractCanonical(html);
  const jsonLdBlocks = extractJsonLdBlocks(html);

  console.log(`  Found ${jsonLdBlocks.length} JSON-LD script block(s). Canonical: "${canonical}"`);

  if (jsonLdBlocks.length === 0) {
    recordFailure(`Route ${route.name} contains ZERO <script type="application/ld+json"> blocks`);
    continue;
  }

  const parsedEntities = [];

  // 1. Parse each block & check raw script breakout
  jsonLdBlocks.forEach((block, idx) => {
    results.jsonLdBlocksParsed++;

    // Check for raw unescaped '<'
    if (block.rawContent.includes("<")) {
      const msg = `Route ${route.file} block #${idx} contains raw unescaped '<' character!`;
      results.unescapedLtChars.push({ file: route.file, blockIdx: idx });
      recordFailure(msg);
    } else {
      recordSuccess(`Block #${idx}: No raw unescaped '<' (safe from script breakout)`);
    }

    // Parse JSON
    try {
      const parsed = JSON.parse(block.rawContent);
      recordSuccess(`Block #${idx}: Cleanly parsed by JSON.parse()`);

      // Flatten graph if @graph is present
      if (parsed["@graph"] && Array.isArray(parsed["@graph"])) {
        parsed["@graph"].forEach((item) => parsedEntities.push(item));
      } else {
        parsedEntities.push(parsed);
      }

      // Check for leaks (null, undefined, NaN)
      const leaks = checkValueLeaks(parsed);
      if (leaks.length > 0) {
        const msg = `Route ${route.file} block #${idx} has value leaks: ${leaks.join(", ")}`;
        results.nullUndefinedNanLeaks.push({ file: route.file, blockIdx: idx, leaks });
        recordFailure(msg);
      } else {
        recordSuccess(`Block #${idx}: Zero 'undefined', 'null', or 'NaN' leakages`);
      }
    } catch (e) {
      const msg = `Route ${route.file} block #${idx} failed JSON.parse(): ${e.message}`;
      results.parseErrors.push({ file: route.file, blockIdx: idx, error: e.message });
      recordFailure(msg);
    }
  });

  // Extract all entity types present
  const entityTypes = parsedEntities.map((e) => e["@type"]);
  console.log(`  Parsed entity types: [${entityTypes.join(", ")}]`);

  // Verify @context on all entities
  parsedEntities.forEach((entity, idx) => {
    // If entity came from top-level or @graph
    const ctx = entity["@context"] || "https://schema.org"; // @graph items inherit top @context
    if (entity["@context"] && entity["@context"] !== "https://schema.org") {
      recordFailure(`Entity #${idx} (${entity["@type"]}) has invalid @context: "${entity["@context"]}"`);
    }
  });

  // 2. Specific Route Validations

  // ROOT ROUTE (/)
  if (route.file === "index.html") {
    const webSite = parsedEntities.find((e) => e["@type"] === "WebSite");
    const org = parsedEntities.find((e) => e["@type"] === "WholesaleStore" || e["@type"] === "LocalBusiness");
    const faq = parsedEntities.find((e) => e["@type"] === "FAQPage");

    if (webSite) {
      recordSuccess("Root contains valid Schema.org WebSite");
      if (webSite.url && webSite.name) {
        recordSuccess(`WebSite: name="${webSite.name}", url="${webSite.url}"`);
      } else {
        recordFailure("WebSite missing required name or url");
      }
    } else {
      recordFailure("Root missing WebSite structured data");
    }

    if (org) {
      recordSuccess(`Root contains valid WholesaleStore: "${org.name}"`);
      if (org.telephone && org.address && org.geo) {
        recordSuccess(`WholesaleStore contact & geo verified: lat=${org.geo.latitude}, lon=${org.geo.longitude}`);
        if (org.geo.latitude >= -26.5 && org.geo.latitude <= -25.5 && org.geo.longitude >= 27.5 && org.geo.longitude <= 28.5) {
          recordSuccess("Geo coordinates are verified within Midrand/Gauteng bounds");
        } else {
          recordFailure(`Geo coordinates out of bounds: lat=${org.geo.latitude}, lon=${org.geo.longitude}`);
        }
      } else {
        recordFailure("WholesaleStore missing telephone, address, or geo");
      }
    } else {
      recordFailure("Root missing WholesaleStore / LocalBusiness structured data");
    }

    if (faq) {
      recordSuccess(`Root contains FAQPage with ${faq.mainEntity?.length || 0} questions`);
      if (faq.mainEntity && faq.mainEntity.length >= 4) {
        recordSuccess("Root FAQPage has sufficient questions (>= 4)");
      } else {
        recordFailure("Root FAQPage has fewer than 4 questions");
      }
    } else {
      recordFailure("Root missing FAQPage structured data");
    }
  }

  // CHEESE ROUTE (/cheese)
  if (route.file === "cheese.html") {
    // Check ItemList or >= 4 Product items
    const itemList = parsedEntities.find((e) => e["@type"] === "ItemList");
    let productCount = 0;

    if (itemList) {
      recordSuccess(`Cheese page has ItemList: "${itemList.name}"`);
      if (Array.isArray(itemList.itemListElement)) {
        itemList.itemListElement.forEach((li) => {
          if (li.item && (li.item["@type"] === "Product" || li["@type"] === "Product")) {
            productCount++;
          }
        });
        recordSuccess(`ItemList contains ${productCount} embedded Product items`);
      }
    } else {
      productCount = parsedEntities.filter((e) => e["@type"] === "Product").length;
    }

    if (itemList || productCount >= 4) {
      recordSuccess(`Cheese page satisfies ItemList / Product count requirement (${productCount} products)`);
    } else {
      recordFailure(`Cheese page failed ItemList / Product requirement (found ${productCount} products)`);
    }

    // Verify Cheese has NO leaked FAQPage
    const cheeseFaq = parsedEntities.find((e) => e["@type"] === "FAQPage");
    if (cheeseFaq) {
      recordFailure("Cheese page illegally contains FAQPage structured data (FAQPage leak from root layout)");
    } else {
      recordSuccess("Cheese page correctly does NOT contain FAQPage (decoupled from root layout)");
    }
  }

  // BREADCRUMBLIST VALIDATION (/cheese and /products/*)
  const breadcrumbList = parsedEntities.find((e) => e["@type"] === "BreadcrumbList");
  if (route.file === "cheese.html" || route.file.startsWith("products/")) {
    if (!breadcrumbList) {
      recordFailure(`Route ${route.name} is missing BreadcrumbList structured data`);
    } else {
      recordSuccess(`Route ${route.name} has BreadcrumbList`);
      const items = breadcrumbList.itemListElement || [];

      if (items.length < 2) {
        recordFailure(`BreadcrumbList has fewer than 2 items (${items.length})`);
      } else {
        // Verify sequential numerical position starting at 1
        let positionsValid = true;
        for (let i = 0; i < items.length; i++) {
          const item = items[i];
          const expectedPos = i + 1;
          if (item.position !== expectedPos) {
            recordFailure(`BreadcrumbList item #${i} has position ${item.position}, expected ${expectedPos}`);
            positionsValid = false;
          }
          if (typeof item.position !== "number") {
            recordFailure(`BreadcrumbList item #${i} position is not a number: ${typeof item.position}`);
            positionsValid = false;
          }
        }
        if (positionsValid) {
          recordSuccess(`BreadcrumbList positions strictly sequential starting at 1: [${items.map((it) => it.position).join(", ")}]`);
        }

        // Verify terminal item equals canonical URL
        const terminalItem = items[items.length - 1];
        const terminalUrl = terminalItem?.item || terminalItem?.url;

        // Normalize URLs (remove trailing slashes for comparison)
        const normTerminal = (terminalUrl || "").replace(/\/$/, "");
        const normCanonical = (canonical || "").replace(/\/$/, "");

        if (normTerminal && normCanonical && normTerminal === normCanonical) {
          recordSuccess(`Terminal breadcrumb item (${normTerminal}) strictly equals canonical (${normCanonical})`);
        } else {
          recordFailure(`Terminal breadcrumb (${normTerminal}) does NOT match canonical (${normCanonical})`);
        }
      }
    }
  }

  // PRODUCT ROUTE VALIDATION (/products/*)
  if (route.file.startsWith("products/")) {
    const product = parsedEntities.find((e) => e["@type"] === "Product");
    if (!product) {
      recordFailure(`Product page ${route.file} missing Schema.org Product markup`);
    } else {
      recordSuccess(`Product page has Product schema: "${product.name}"`);

      // Verify Product fields
      if (!product.name || !product.description) {
        recordFailure(`Product missing required name or description: name="${product.name}"`);
      } else {
        recordSuccess("Product name and description present");
      }

      if (!product.brand || product.brand.name !== "Jozi Dairy") {
        recordFailure(`Product brand invalid: ${JSON.stringify(product.brand)}`);
      } else {
        recordSuccess(`Product brand is Jozi Dairy`);
      }

      // Verify Offers
      const offers = Array.isArray(product.offers) ? product.offers : [product.offers];
      if (offers.length === 0 || !offers[0]) {
        recordFailure(`Product ${product.name} has NO offers`);
      } else {
        recordSuccess(`Product has ${offers.length} offer(s)`);
        let offersValid = true;
        offers.forEach((offer, offIdx) => {
          if (offer["@type"] !== "Offer") {
            recordFailure(`Offer #${offIdx} @type is "${offer["@type"]}", expected "Offer"`);
            offersValid = false;
          }
          if (offer.priceCurrency !== "ZAR") {
            recordFailure(`Offer #${offIdx} priceCurrency is "${offer.priceCurrency}", expected "ZAR"`);
            offersValid = false;
          }
          if (offer.availability !== "https://schema.org/InStock") {
            recordFailure(`Offer #${offIdx} availability is "${offer.availability}", expected "https://schema.org/InStock"`);
            offersValid = false;
          }
          if (offer.price === undefined || offer.price === null) {
            recordFailure(`Offer #${offIdx} missing price`);
            offersValid = false;
          }
        });
        if (offersValid) {
          recordSuccess(`All ${offers.length} offer(s) verified: priceCurrency="ZAR", availability="https://schema.org/InStock"`);
        }
      }

      // Verify Additional Properties (specifications, pack sizes, storage notice)
      if (Array.isArray(product.additionalProperty) && product.additionalProperty.length > 0) {
        recordSuccess(`Product has ${product.additionalProperty.length} additionalProperty specifications`);
      } else {
        recordFailure(`Product missing additionalProperty specifications`);
      }
    }

    // Verify per-product FAQ isolation if present
    const productFaq = parsedEntities.find((e) => e["@type"] === "FAQPage");
    if (productFaq) {
      recordSuccess(`Product has scoped FAQPage with ${productFaq.mainEntity?.length || 0} questions`);
      // Verify product FAQs do NOT leak general Gauteng delivery questions
      const hasGeneralFaq = (productFaq.mainEntity || []).some((q) =>
        q.name?.includes("What regions in Gauteng") || q.name?.includes("wholesale dairy trade account")
      );
      if (hasGeneralFaq) {
        recordFailure(`Product page ${route.file} has leaked general home FAQs!`);
      } else {
        recordSuccess(`Product FAQPage is properly scoped to product specifics`);
      }
    }
  }
}

// ----------------------------------------------------
// 3. INVOICES ROUTE AUDIT (Check for leakage)
// ----------------------------------------------------
console.log("\n--- Checking Invoices / Non-Public Routes for Schema Leakage ---");
const invoiceHtml = path.join(appDir, "invoices", "[id]", "print.html");
if (fs.existsSync(invoiceHtml)) {
  const invContent = fs.readFileSync(invoiceHtml, "utf8");
  const invBlocks = extractJsonLdBlocks(invContent);
  console.log(`Invoices route contains ${invBlocks.length} JSON-LD blocks`);
  // Invoice has root schema from layout, but MUST NOT have FAQPage or Product schemas
  const invHasFaq = invContent.includes('"@type":"FAQPage"') || invContent.includes('"@type": "FAQPage"');
  if (invHasFaq) {
    recordFailure("Invoice route illegally contains FAQPage structured data!");
  } else {
    recordSuccess("Invoice route does NOT contain FAQPage structured data");
  }
}

// ----------------------------------------------------
// 4. SUMMARY & VERDICT
// ----------------------------------------------------
console.log("\n================================================================================");
console.log(" EMPIRICAL VERIFICATION SUMMARY");
console.log("================================================================================");
console.log(`Routes inspected:         ${results.routesChecked.length}`);
console.log(`Total JSON-LD blocks:     ${results.jsonLdBlocksParsed}`);
console.log(`JSON.parse errors:        ${results.parseErrors.length}`);
console.log(`Raw unescaped '<' errors: ${results.unescapedLtChars.length}`);
console.log(`Null/Undefined/NaN leaks: ${results.nullUndefinedNanLeaks.length}`);
console.log(`Total Failures:           ${results.failures.length}`);
console.log(`Verdict:                  ${results.passed ? "APPROVE" : "REQUEST_CHANGES"}`);
console.log("================================================================================");

// Exit with 0 if passed, 1 if failed
process.exit(results.passed ? 0 : 1);
