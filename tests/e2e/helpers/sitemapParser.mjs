/**
 * Sitemap XML parser and protocol validator.
 */

export function parseSitemap(xml) {
  if (!xml) return [];
  const urls = [];
  const urlBlockRegex = /<url\b[^>]*>([\s\S]*?)<\/url>/gi;
  let blockMatch;

  while ((blockMatch = urlBlockRegex.exec(xml)) !== null) {
    const block = blockMatch[1];
    const locMatch = block.match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/i);
    const lastmodMatch = block.match(/<lastmod\b[^>]*>([\s\S]*?)<\/lastmod>/i);
    const changefreqMatch = block.match(/<changefreq\b[^>]*>([\s\S]*?)<\/changefreq>/i);
    const priorityMatch = block.match(/<priority\b[^>]*>([\s\S]*?)<\/priority>/i);

    if (locMatch) {
      urls.push({
        loc: locMatch[1].trim(),
        lastmod: lastmodMatch ? lastmodMatch[1].trim() : undefined,
        changefreq: changefreqMatch ? changefreqMatch[1].trim() : undefined,
        priority: priorityMatch ? priorityMatch[1].trim() : undefined,
      });
    }
  }

  return urls;
}

export function validateXmlSyntax(xml) {
  if (!xml || typeof xml !== "string") {
    return { valid: false, error: "Empty or non-string XML input" };
  }

  const trimmed = xml.trim();

  // Must declare XML or root urlset
  if (!trimmed.startsWith("<?xml") && !trimmed.startsWith("<urlset")) {
    return { valid: false, error: "Missing XML declaration or <urlset> root element" };
  }

  // Must contain urlset with schema namespace
  if (!trimmed.includes("http://www.sitemaps.org/schemas/sitemap/0.9")) {
    return { valid: false, error: "Missing standard Sitemaps 0.9 schema namespace" };
  }

  // Check balanced tags for common elements
  const tagList = ["urlset", "url", "loc", "lastmod", "changefreq", "priority"];
  for (const tag of tagList) {
    const openCount = (trimmed.match(new RegExp(`<${tag}[\\s>]`, "gi")) || []).length;
    const closeCount = (trimmed.match(new RegExp(`</${tag}>`, "gi")) || []).length;
    if (openCount !== closeCount) {
      return {
        valid: false,
        error: `Unbalanced tag <${tag}>: opened ${openCount} times, closed ${closeCount} times`,
      };
    }
  }

  return { valid: true };
}
