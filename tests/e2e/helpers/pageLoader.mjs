import fs from "node:fs/promises";
import path from "node:path";

const PROJECT_ROOT = process.cwd();

/**
 * Universal document loader supporting both static build artifact inspection
 * and live HTTP server requests.
 */
export async function loadPage(route) {
  const baseUrl = process.env.TEST_BASE_URL;

  if (baseUrl) {
    return loadViaHttp(`${baseUrl.replace(/\/$/, "")}${route}`);
  }

  return loadFromBuildArtifacts(route);
}

async function loadViaHttp(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "JoziDairy-E2E-Auditor/1.0",
      },
    });
    const content = await res.text();
    return {
      status: res.status,
      headers: Object.fromEntries(res.headers.entries()),
      content,
      ok: res.ok,
      source: "http",
      url,
    };
  } catch (err) {
    return {
      status: 0,
      headers: {},
      content: "",
      ok: false,
      error: err.message,
      source: "http",
      url,
    };
  }
}

async function loadFromBuildArtifacts(route) {
  const cleanRoute = route.split("?")[0].split("#")[0];

  // Specific file route resolutions
  if (cleanRoute === "/robots.txt") {
    return readFirstExisting([
      path.join(PROJECT_ROOT, ".next", "server", "app", "robots.txt.body"),
      path.join(PROJECT_ROOT, "public", "robots.txt"),
    ]);
  }

  if (cleanRoute === "/sitemap.xml") {
    return readFirstExisting([
      path.join(PROJECT_ROOT, ".next", "server", "app", "sitemap.xml.body"),
      path.join(PROJECT_ROOT, "public", "sitemap.xml"),
    ]);
  }

  if (cleanRoute === "/llms.txt") {
    return readFirstExisting([
      path.join(PROJECT_ROOT, "public", "llms.txt"),
      path.join(PROJECT_ROOT, ".next", "server", "app", "llms.txt.body"),
    ]);
  }

  if (cleanRoute === "/llms-full.txt") {
    return readFirstExisting([
      path.join(PROJECT_ROOT, "public", "llms-full.txt"),
      path.join(PROJECT_ROOT, ".next", "server", "app", "llms-full.txt.body"),
    ]);
  }

  // Google HTML verification file check (e.g. /google12345.html)
  if (cleanRoute.startsWith("/google") && cleanRoute.endsWith(".html")) {
    const filename = cleanRoute.slice(1);
    return readFirstExisting([
      path.join(PROJECT_ROOT, "public", filename),
      path.join(PROJECT_ROOT, ".next", "server", "app", filename),
    ]);
  }

  // HTML page mappings
  let relativeHtmlPath;
  if (cleanRoute === "/" || cleanRoute === "") {
    relativeHtmlPath = "index.html";
  } else if (cleanRoute === "/cheese") {
    relativeHtmlPath = "cheese.html";
  } else if (cleanRoute.startsWith("/products/")) {
    const slug = cleanRoute.replace("/products/", "");
    relativeHtmlPath = path.join("products", `${slug}.html`);
  } else {
    // Generic subpath
    relativeHtmlPath = `${cleanRoute.replace(/^\//, "")}.html`;
  }

  const primaryPath = path.join(PROJECT_ROOT, ".next", "server", "app", relativeHtmlPath);
  return readFirstExisting([primaryPath]);
}

async function readFirstExisting(paths) {
  for (const p of paths) {
    try {
      const content = await fs.readFile(p, "utf-8");
      return {
        status: 200,
        ok: true,
        content,
        filePath: p,
        source: "file",
      };
    } catch {
      // Continue to next path
    }
  }

  return {
    status: 404,
    ok: false,
    content: "",
    source: "file",
    error: `File not found in paths: ${paths.join(", ")}`,
  };
}
