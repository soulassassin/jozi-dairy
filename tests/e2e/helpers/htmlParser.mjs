/**
 * Fast, self-contained HTML and metadata parser for opaque-box E2E testing.
 * Does not depend on external DOM libraries.
 */

export function extractTitle(html) {
  if (!html) return null;
  const match = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return match ? decodeHtmlEntities(match[1].trim()) : null;
}

export function extractMetaTags(html) {
  if (!html) return [];
  const tags = [];
  const regex = /<meta\s+([^>]+?)\/?>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawAttrs = match[1];
    const attrRegex = /([a-zA-Z0-9_:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
    const tag = {};
    let attrMatch;
    while ((attrMatch = attrRegex.exec(rawAttrs)) !== null) {
      const key = attrMatch[1].toLowerCase();
      const val = attrMatch[2] ?? attrMatch[3] ?? attrMatch[4] ?? "";
      tag[key] = decodeHtmlEntities(val);
    }
    tags.push(tag);
  }
  return tags;
}

export function extractMeta(html, nameOrProperty) {
  const tags = extractMetaTags(html);
  const target = nameOrProperty.toLowerCase();
  for (const tag of tags) {
    if (tag.name?.toLowerCase() === target || tag.property?.toLowerCase() === target) {
      return tag.content ?? "";
    }
  }
  return null;
}

export function extractCanonical(html) {
  if (!html) return null;
  const match = html.match(/<link\s+[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["'][^>]*\/?>/i)
    || html.match(/<link\s+[^>]*href=["']([^"']+)["'][^>]*rel=["']canonical["'][^>]*\/?>/i);
  return match ? decodeHtmlEntities(match[1].trim()) : null;
}

export function extractLinks(html) {
  if (!html) return [];
  const links = [];
  const regex = /<a\s+([^>]+?)>([\s\S]*?)<\/a>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawAttrs = match[1];
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    const hrefMatch = rawAttrs.match(/href=["']([^"']+)["']/i);
    if (hrefMatch) {
      links.push({
        href: decodeHtmlEntities(hrefMatch[1].trim()),
        text: decodeHtmlEntities(text),
      });
    }
  }
  return links;
}

export function extractJsonLd(html) {
  if (!html) return [];
  const items = [];
  const regex = /<script\s+[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const rawJson = match[1].trim();
    try {
      const parsed = JSON.parse(rawJson);
      items.push(parsed);
    } catch (err) {
      items.push({ __parseError: err.message, raw: rawJson });
    }
  }
  return items;
}

export function decodeHtmlEntities(str) {
  if (!str) return "";
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, "/")
    .replace(/&nbsp;/g, " ");
}
