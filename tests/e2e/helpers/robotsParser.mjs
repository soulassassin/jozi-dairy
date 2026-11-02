/**
 * Robots.txt parser and REP (Robots Exclusion Protocol) validator.
 */

export function parseRobots(text) {
  if (!text) {
    return { rules: [], sitemaps: [], raw: "" };
  }

  const lines = text.split(/\r?\n/);
  const rules = [];
  const sitemaps = [];

  let currentAgents = [];
  let currentAllows = [];
  let currentDisallows = [];

  function flushGroup() {
    if (currentAgents.length > 0) {
      for (const agent of currentAgents) {
        rules.push({
          userAgent: agent,
          allow: [...currentAllows],
          disallow: [...currentDisallows],
        });
      }
      currentAgents = [];
      currentAllows = [];
      currentDisallows = [];
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) continue;

    const field = line.slice(0, colonIdx).trim().toLowerCase();
    const value = line.slice(colonIdx + 1).trim();

    if (field === "user-agent") {
      if (currentAllows.length > 0 || currentDisallows.length > 0) {
        flushGroup();
      }
      currentAgents.push(value);
    } else if (field === "allow") {
      currentAllows.push(value);
    } else if (field === "disallow") {
      currentDisallows.push(value);
    } else if (field === "sitemap") {
      sitemaps.push(value);
    }
  }
  flushGroup();

  return { rules, sitemaps, raw: text };
}

export function isAllowed(parsed, path, userAgent = "*") {
  if (!parsed || !parsed.rules) return true;

  // Match specific userAgent first, fallback to '*'
  let applicableRules = parsed.rules.filter(
    (r) => r.userAgent.toLowerCase() === userAgent.toLowerCase()
  );
  if (applicableRules.length === 0) {
    applicableRules = parsed.rules.filter((r) => r.userAgent === "*");
  }

  if (applicableRules.length === 0) return true;

  let maxDisallowLen = -1;
  let maxAllowLen = -1;

  for (const rule of applicableRules) {
    // Check disallows
    for (const dis of rule.disallow) {
      if (!dis) continue; // Empty disallow means allow all
      if (pathMatchesDirective(path, dis)) {
        if (dis.length > maxDisallowLen) {
          maxDisallowLen = dis.length;
        }
      }
    }
    // Check allows (allow overrides disallow if more specific or equal)
    for (const al of rule.allow) {
      if (!al) continue;
      if (pathMatchesDirective(path, al)) {
        if (al.length > maxAllowLen) {
          maxAllowLen = al.length;
        }
      }
    }
  }

  if (maxDisallowLen === -1 && maxAllowLen === -1) return true;
  if (maxDisallowLen > maxAllowLen) return false;
  return true;
}

function pathMatchesDirective(path, directive) {
  if (directive === "/") return true;
  const cleanDir = directive.replace(/\/$/, "");
  if (path === directive || path === cleanDir) return true;
  if (path.startsWith(directive) || path.startsWith(cleanDir + "/")) return true;
  return false;
}

export function validateRobotsSyntax(text) {
  if (!text || typeof text !== "string") {
    return { valid: false, error: "Empty or invalid robots.txt content" };
  }

  const lines = text.split(/\r?\n/);
  const knownFields = new Set(["user-agent", "allow", "disallow", "sitemap", "crawl-delay", "host"]);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line || line.startsWith("#")) continue;

    const colonIdx = line.indexOf(":");
    if (colonIdx === -1) {
      return {
        valid: false,
        error: `Syntax error at line ${i + 1}: Missing colon ':' delimiter in directive: "${line}"`,
      };
    }

    const field = line.slice(0, colonIdx).trim().toLowerCase();
    if (!knownFields.has(field)) {
      return {
        valid: false,
        error: `Unrecognized robots directive at line ${i + 1}: "${field}"`,
      };
    }
  }

  return { valid: true };
}
