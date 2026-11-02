import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const appDir = path.join(rootDir, ".next", "server", "app");

function extractScriptTags(html) {
  const regex = /<script\s+type=["']application\/ld\+json["']>([\s\S]*?)<\/script>/gi;
  const scripts = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    scripts.push(match[1]);
  }
  return scripts;
}

function extractCanonical(html) {
  const match = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
  return match ? match[1] : null;
}

function parseJsonLd(raw) {
  return JSON.parse(raw);
}

function flattenSchemas(parsed) {
  const list = [];
  function recurse(node) {
    if (!node || typeof node !== "object") return;
    if (node["@type"]) {
      list.push(node);
    }
    if (Array.isArray(node)) {
      node.forEach(recurse);
    } else if (Array.isArray(node["@graph"])) {
      node["@graph"].forEach(recurse);
    } else {
      for (const k of Object.keys(node)) {
        if (typeof node[k] === "object") recurse(node[k]);
      }
    }
  }
  recurse(parsed);
  return list;
}

const deepResults = {
  rawLtEscaping: { passed: true, issues: [] },
  breadcrumbTerminalCanonicalMatch: { passed: true, issues: [] },
  crossProductFaqIsolation: { passed: true, issues: [] },
  offersValidity: { passed: true, issues: [] },
  cheeseVarietyParity: { passed: true, issues: [] }
};

console.log("================================================================================");
console.log("Jozi Dairy Deep Adversarial Stress Testing — Milestone 2");
console.log("================================================================================\n");

// 1. Raw '<' character escaping audit
console.log("--- 1. Script Breakout & JSON-LD Serialization Hygiene ---");
const allHtmlFiles = [];
function findHtml(dir) {
  for (const item of fs.readdirSync(dir)) {
    const full = path.join(dir, item);
    if (fs.statSync(full).isDirectory()) findHtml(full);
    else if (item.endsWith(".html")) allHtmlFiles.push(full);
  }
}
findHtml(appDir);

for (const f of allHtmlFiles) {
  const rel = path.relative(appDir, f);
  const content = fs.readFileSync(f, "utf8");
  const scripts = extractScriptTags(content);
  for (let i = 0; i < scripts.length; i++) {
    const raw = scripts[i];
    // Check if raw string contains unescaped '<' (which could cause script injection/breakout)
    if (raw.includes("<")) {
      deepResults.rawLtEscaping.passed = false;
      deepResults.rawLtEscaping.issues.push({ file: rel, scriptIndex: i, issue: "Contains raw '<' character" });
      console.error(`❌ FAIL: Raw '<' in JSON-LD script ${i} of ${rel}`);
    }
    // Verify JSON.parse succeeds
    try {
      JSON.parse(raw);
    } catch (e) {
      deepResults.rawLtEscaping.passed = false;
      deepResults.rawLtEscaping.issues.push({ file: rel, scriptIndex: i, issue: `JSON.parse error: ${e.message}` });
      console.error(`❌ FAIL: Malformed JSON-LD in script ${i} of ${rel}: ${e.message}`);
    }
  }
}
if (deepResults.rawLtEscaping.passed) {
  console.log(`✔ PASS: All ${allHtmlFiles.length} HTML files passed raw '<' breakout audit and parse cleanly.`);
}

// 2. Breadcrumb terminal item canonical equivalence
console.log("\n--- 2. BreadcrumbList Terminal Item Canonical Equivalence ---");
const publicPages = ["cheese.html", "products/fresh-milk.html", "products/yoghurt.html", "products/fresh-cream.html", "products/amasi.html", "products/dairy-blend.html", "products/juice.html"];

for (const rel of publicPages) {
  const full = path.join(appDir, rel);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, "utf8");
  const canonical = extractCanonical(content);
  const scripts = extractScriptTags(content);
  
  let breadcrumbFound = false;
  for (const raw of scripts) {
    const parsed = parseJsonLd(raw);
    const schemas = flattenSchemas(parsed);
    const bc = schemas.find((s) => s["@type"] === "BreadcrumbList");
    if (bc && Array.isArray(bc.itemListElement) && bc.itemListElement.length > 0) {
      breadcrumbFound = true;
      const terminalItem = bc.itemListElement[bc.itemListElement.length - 1];
      const terminalUrl = terminalItem.item;
      const normalizedTerminal = terminalUrl.replace(/\/+$/, "");
      const normalizedCanonical = (canonical || "").replace(/\/+$/, "");

      if (normalizedTerminal === normalizedCanonical) {
        console.log(`✔ PASS: ${rel} breadcrumb terminal (${normalizedTerminal}) matches canonical (${normalizedCanonical})`);
      } else {
        deepResults.breadcrumbTerminalCanonicalMatch.passed = false;
        deepResults.breadcrumbTerminalCanonicalMatch.issues.push({
          file: rel,
          terminalUrl,
          canonicalUrl: canonical
        });
        console.error(`❌ FAIL: ${rel} breadcrumb terminal (${terminalUrl}) does NOT match canonical (${canonical})`);
      }
    }
  }
  if (!breadcrumbFound) {
    deepResults.breadcrumbTerminalCanonicalMatch.passed = false;
    deepResults.breadcrumbTerminalCanonicalMatch.issues.push({ file: rel, issue: "No BreadcrumbList found" });
    console.error(`❌ FAIL: ${rel} missing BreadcrumbList`);
  }
}

// 3. Cross-Product FAQ Isolation
console.log("\n--- 3. Cross-Product FAQ Isolation ---");
const productQuestionsMap = new Map();
const productFiles = ["fresh-milk.html", "yoghurt.html", "fresh-cream.html", "amasi.html", "dairy-blend.html", "juice.html"];

for (const pf of productFiles) {
  const full = path.join(appDir, "products", pf);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, "utf8");
  const scripts = extractScriptTags(content);
  const questions = [];
  for (const raw of scripts) {
    const parsed = parseJsonLd(raw);
    const schemas = flattenSchemas(parsed);
    const faqs = schemas.filter((s) => s["@type"] === "FAQPage");
    for (const faq of faqs) {
      for (const item of faq.mainEntity || []) {
        questions.push(item.name || item.question);
      }
    }
  }
  productQuestionsMap.set(pf, questions);
}

// Verify no two products share any identical questions
let crossProductOverlap = 0;
const entries = Array.from(productQuestionsMap.entries());
for (let i = 0; i < entries.length; i++) {
  for (let j = i + 1; j < entries.length; j++) {
    const [fileA, qA] = entries[i];
    const [fileB, qB] = entries[j];
    for (const q of qA) {
      if (qB.includes(q)) {
        crossProductOverlap++;
        deepResults.crossProductFaqIsolation.passed = false;
        deepResults.crossProductFaqIsolation.issues.push({ fileA, fileB, question: q });
        console.error(`❌ FAIL: Question "${q}" duplicated across ${fileA} and ${fileB}`);
      }
    }
  }
}
if (crossProductOverlap === 0) {
  console.log(`✔ PASS: All ${entries.length} products have 100% mutually exclusive, isolated FAQs (0 overlap)`);
}

// 4. Offer Currency (ISO 4217) & Availability Integrity
console.log("\n--- 4. Offer Currency (ISO 4217) & Availability Integrity ---");
let totalOffersChecked = 0;
for (const pf of productFiles) {
  const full = path.join(appDir, "products", pf);
  if (!fs.existsSync(full)) continue;
  const content = fs.readFileSync(full, "utf8");
  const scripts = extractScriptTags(content);
  for (const raw of scripts) {
    const parsed = parseJsonLd(raw);
    const schemas = flattenSchemas(parsed);
    const offers = schemas.filter((s) => s["@type"] === "Offer");
    for (const o of offers) {
      totalOffersChecked++;
      if (o.priceCurrency !== "ZAR") {
        deepResults.offersValidity.passed = false;
        deepResults.offersValidity.issues.push({ file: pf, offer: o, issue: "Invalid currency" });
      }
      if (o.availability !== "https://schema.org/InStock") {
        deepResults.offersValidity.passed = false;
        deepResults.offersValidity.issues.push({ file: pf, offer: o, issue: "Invalid availability URL" });
      }
    }
  }
}
if (deepResults.offersValidity.passed) {
  console.log(`✔ PASS: All ${totalOffersChecked} Offers across products have priceCurrency: "ZAR" and availability: "https://schema.org/InStock"`);
}

// 5. Cheese Catalog Variety ItemList Parity
console.log("\n--- 5. Cheese Catalog Variety ItemList Parity ---");
const cheeseHtml = fs.readFileSync(path.join(appDir, "cheese.html"), "utf8");
const cheeseScripts = extractScriptTags(cheeseHtml);
let varietyCount = 0;
for (const raw of cheeseScripts) {
  const parsed = parseJsonLd(raw);
  const schemas = flattenSchemas(parsed);
  const il = schemas.find((s) => s["@type"] === "ItemList");
  if (il && Array.isArray(il.itemListElement)) {
    varietyCount = il.itemListElement.length;
    const names = il.itemListElement.map((item) => (item.item ? item.item.name : item.name));
    console.log(`Cheese varieties listed in ItemList (${names.length}):`, names.join(", "));
    const expectedVarieties = [
      "Mature & Mild Cheddar",
      "Sweetmilk Gouda (Boerenkaas Style)",
      "Culinary Low-Moisture Mozzarella",
      "Traditional Greek-Style Feta in Brine"
    ];
    for (const ev of expectedVarieties) {
      if (names.includes(ev)) {
        console.log(`✔ PASS: Found cheese variety "${ev}"`);
      } else {
        deepResults.cheeseVarietyParity.passed = false;
        deepResults.cheeseVarietyParity.issues.push(`Missing expected variety: ${ev}`);
        console.error(`❌ FAIL: Missing expected cheese variety: ${ev}`);
      }
    }
  }
}

console.log("\n================================================================================");
const allDeepPassed = Object.values(deepResults).every((r) => r.passed);
console.log(`Deep Adversarial Stress Testing Result: ${allDeepPassed ? "ALL TESTS PASSED" : "FAILED"}`);
console.log("================================================================================");

fs.writeFileSync(
  path.join(rootDir, "tests", "adversarial-deep-results.json"),
  JSON.stringify(deepResults, null, 2)
);

process.exit(allDeepPassed ? 0 : 1);
