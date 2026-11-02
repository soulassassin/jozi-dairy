#!/usr/bin/env node

/**
 * Jozi Dairy SEO/GEO/AIO & Google Search Console E2E Test Suite Runner
 *
 * Usage:
 *   node tests/e2e/runner.mjs [options]
 *
 * Options:
 *   --tier=<1|2|3|4>      Run only the specified tier
 *   --milestone=<1|2|3>   Filter tests for a specific milestone
 *   --tap                 Output raw TAP stream
 *   --json                Output structured JSON results
 *   --bail                Stop on first failure
 *   --help                Show this help message
 */

import { run } from "node:test";
import { spec, tap } from "node:test/reporters";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const ALL_FILES = {
  tier1: path.join(__dirname, "tier1-feature-coverage.test.mjs"),
  tier2: path.join(__dirname, "tier2-boundary-corner.test.mjs"),
  tier3: path.join(__dirname, "tier3-cross-feature.test.mjs"),
  tier4: path.join(__dirname, "tier4-real-world-scenarios.test.mjs"),
};

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    tier: null,
    milestone: null,
    tap: false,
    json: false,
    bail: false,
    help: false,
  };

  for (const arg of args) {
    if (arg === "--help" || arg === "-h") options.help = true;
    else if (arg === "--tap") options.tap = true;
    else if (arg === "--json") options.json = true;
    else if (arg === "--bail") options.bail = true;
    else if (arg.startsWith("--tier=")) options.tier = arg.split("=")[1];
    else if (arg.startsWith("--milestone=")) options.milestone = arg.split("=")[1];
  }

  return options;
}

function showHelp() {
  console.log(`
Jozi Dairy E2E Test Runner

Usage:
  node tests/e2e/runner.mjs [options]

Options:
  --tier=<1|2|3|4>      Execute tests for a specific tier
  --milestone=<1|2|3>   Filter tests relevant to milestone 1, 2, or 3
  --tap                 Output standard TAP stream
  --json                Output summary results as JSON
  --bail                Exit immediately on first test failure
  --help                Show this help screen
`);
}

async function main() {
  const opts = parseArgs();

  if (opts.help) {
    showHelp();
    process.exit(0);
  }

  // Determine which files to execute
  let filesToRun = [];

  if (opts.tier) {
    const key = `tier${opts.tier}`;
    if (!ALL_FILES[key]) {
      console.error(`Invalid tier: ${opts.tier}. Available tiers: 1, 2, 3, 4`);
      process.exit(1);
    }
    filesToRun = [ALL_FILES[key]];
  } else {
    filesToRun = Object.values(ALL_FILES);
  }

  // Test name pattern filter for milestones if requested
  let testNamePatterns = undefined;
  if (opts.milestone) {
    const m = String(opts.milestone);
    if (m === "1") {
      // Milestone 1: SEO Foundation (Areas 1, 2, 3, 7)
      testNamePatterns = [
        /SEO Metadata|Sitemap|Robots|Privacy|Domain|Slugs|Protocol/i,
      ];
    } else if (m === "2") {
      // Milestone 2: Schema.org Structured Data
      testNamePatterns = [/Schema/i];
    } else if (m === "3") {
      // Milestone 3: GEO/AIO & GSC Integration
      testNamePatterns = [/llms|Search Console|Verification/i];
    }
  }

  if (!opts.json && !opts.tap) {
    console.log("================================================================================");
    console.log(" Jozi Dairy SEO, GEO, AIO & Google Search Console E2E Test Suite");
    console.log("================================================================================");
    console.log(` Mode:        Opaque-box inspection (.next/server/app/ + public/)`);
    console.log(` Target Tiers: ${opts.tier ? `Tier ${opts.tier}` : "All (Tiers 1-4)"}`);
    if (opts.milestone) console.log(` Milestone:   Milestone ${opts.milestone}`);
    console.log(` Test Files:  ${filesToRun.length} files`);
    console.log("--------------------------------------------------------------------------------\n");
  }

  const startTime = Date.now();
  const testStream = run({
    files: filesToRun,
    testNamePatterns,
    concurrency: false,
    timeout: 30000,
  });

  if (opts.tap) {
    testStream.compose(tap).pipe(process.stdout);
    let hasFailure = false;
    testStream.on("test:fail", () => {
      hasFailure = true;
    });
    testStream.on("end", () => {
      process.exit(hasFailure ? 1 : 0);
    });
    return;
  }

  if (opts.json) {
    const results = {
      passed: 0,
      failed: 0,
      skipped: 0,
      tests: [],
    };
    testStream.on("test:pass", (t) => {
      if (t.nesting > 0) {
        results.passed++;
        results.tests.push({ name: t.name, status: "passed", duration: t.details?.duration_ms });
      }
    });
    testStream.on("test:fail", (t) => {
      results.failed++;
      results.tests.push({
        name: t.name,
        status: "failed",
        error: t.details?.error?.message,
        duration: t.details?.duration_ms,
      });
      if (opts.bail) {
        console.log(JSON.stringify(results, null, 2));
        process.exit(1);
      }
    });
    testStream.on("end", () => {
      results.durationMs = Date.now() - startTime;
      console.log(JSON.stringify(results, null, 2));
      process.exit(results.failed > 0 ? 1 : 0);
    });
    testStream.resume();
    return;
  }

  // Default pretty console runner with summary
  const failures = [];
  let totalPassed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  testStream.on("test:pass", (t) => {
    // Only count leaf tests (not describe suite containers)
    if (t.nesting > 0) {
      totalPassed++;
      console.log(`  \x1b[32m✔\x1b[0m [PASS] ${t.name}`);
    } else {
      console.log(`\n\x1b[36m▸ Suite: ${t.name}\x1b[0m`);
    }
  });

  testStream.on("test:fail", (t) => {
    totalFailed++;
    const errMsg = t.details?.error?.message || "Unknown error";
    failures.push({ name: t.name, error: errMsg });
    console.log(`  \x1b[31m✖\x1b[0m [FAIL] ${t.name}`);
    console.log(`    \x1b[31mError: ${errMsg}\x1b[0m`);

    if (opts.bail) {
      console.log("\n\x1b[31mExecution halted due to --bail flag.\x1b[0m");
      process.exit(1);
    }
  });

  testStream.on("test:skip", (t) => {
    totalSkipped++;
    console.log(`  \x1b[33m-\x1b[0m [SKIP] ${t.name}`);
  });

  testStream.resume();

  testStream.on("end", () => {
    const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log("\n================================================================================");
    console.log(" Test Suite Execution Summary");
    console.log("================================================================================");
    console.log(` Duration:    ${elapsedSec}s`);
    console.log(` Total Tests: ${totalPassed + totalFailed + totalSkipped}`);
    console.log(` \x1b[32mPassed:\x1b[0m      ${totalPassed}`);
    console.log(` \x1b[31mFailed:\x1b[0m      ${totalFailed}`);
    console.log(` \x1b[33mSkipped:\x1b[0m     ${totalSkipped}`);
    console.log("--------------------------------------------------------------------------------");

    if (failures.length > 0) {
      console.log("\n\x1b[31mFailed Test Inventory:\x1b[0m");
      failures.forEach((f, idx) => {
        console.log(`  ${idx + 1}. ${f.name}`);
        console.log(`     Reason: ${f.error}`);
      });
      console.log("\nStatus: FAILED (Exit Code 1)");
      process.exit(1);
    } else {
      console.log("\n\x1b[32mStatus: ALL TESTS PASSED (Exit Code 0)\x1b[0m");
      process.exit(0);
    }
  });
}

main().catch((err) => {
  console.error("Test runner encountered an unhandled exception:", err);
  process.exit(1);
});
