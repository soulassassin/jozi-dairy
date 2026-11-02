/**
 * Schema.org JSON-LD validator for Jozi Dairy structured data.
 */

export function findSchemasByType(jsonLdArray, typeName) {
  const matches = [];
  if (!Array.isArray(jsonLdArray)) return matches;

  for (const item of jsonLdArray) {
    if (!item) continue;
    // Check if graph format
    if (Array.isArray(item["@graph"])) {
      for (const node of item["@graph"]) {
        if (node["@type"] === typeName || (Array.isArray(node["@type"]) && node["@type"].includes(typeName))) {
          matches.push(node);
        }
      }
    } else if (item["@type"] === typeName || (Array.isArray(item["@type"]) && item["@type"].includes(typeName))) {
      matches.push(item);
    }
  }

  return matches;
}

export function validateSchemaBasics(schema) {
  const errors = [];
  if (!schema || typeof schema !== "object") {
    errors.push("Schema is not an object");
    return { valid: false, errors };
  }

  if (!schema["@type"]) {
    errors.push("Missing '@type' in schema");
  }

  // Check for undefined or null string leaks
  const str = JSON.stringify(schema);
  if (str.includes('"undefined"') || str.includes('null') && !str.includes('"null"')) {
    // Note: raw null might be ok in some formats, but "undefined" string is a code bug
    if (str.includes('"undefined"')) {
      errors.push("Schema contains literal string 'undefined'");
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

export function validateProductSchema(product) {
  const errors = [];
  if (!product) return { valid: false, errors: ["Product schema missing"] };

  if (product["@type"] !== "Product") {
    errors.push(`Expected @type Product, got ${product["@type"]}`);
  }
  if (!product.name || typeof product.name !== "string") {
    errors.push("Product missing valid string 'name'");
  }
  if (!product.description || typeof product.description !== "string") {
    errors.push("Product missing valid string 'description'");
  }
  if (!product.offers) {
    errors.push("Product missing 'offers'");
  } else {
    const offer = Array.isArray(product.offers) ? product.offers[0] : product.offers;
    if (offer["@type"] !== "Offer") {
      errors.push(`Offer expected @type Offer, got ${offer["@type"]}`);
    }
    if (offer.priceCurrency && offer.priceCurrency !== "ZAR") {
      errors.push(`Expected priceCurrency ZAR, got ${offer.priceCurrency}`);
    }
    if (offer.availability && !offer.availability.includes("schema.org/")) {
      errors.push(`Offer availability should be a schema.org URI, got ${offer.availability}`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateBreadcrumbSchema(breadcrumb) {
  const errors = [];
  if (!breadcrumb) return { valid: false, errors: ["BreadcrumbList schema missing"] };

  if (breadcrumb["@type"] !== "BreadcrumbList") {
    errors.push(`Expected @type BreadcrumbList, got ${breadcrumb["@type"]}`);
  }
  if (!Array.isArray(breadcrumb.itemListElement) || breadcrumb.itemListElement.length === 0) {
    errors.push("BreadcrumbList missing non-empty 'itemListElement' array");
  } else {
    for (const item of breadcrumb.itemListElement) {
      if (item["@type"] !== "ListItem") {
        errors.push(`Expected ListItem @type, got ${item["@type"]}`);
      }
      if (typeof item.position !== "number") {
        errors.push(`ListItem missing numerical 'position': got ${item.position}`);
      }
      if (!item.name) {
        errors.push("ListItem missing 'name'");
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateFAQSchema(faq) {
  const errors = [];
  if (!faq) return { valid: false, errors: ["FAQPage schema missing"] };

  if (faq["@type"] !== "FAQPage") {
    errors.push(`Expected @type FAQPage, got ${faq["@type"]}`);
  }
  if (!Array.isArray(faq.mainEntity) || faq.mainEntity.length === 0) {
    errors.push("FAQPage missing non-empty 'mainEntity' array");
  } else {
    for (const q of faq.mainEntity) {
      if (q["@type"] !== "Question") {
        errors.push(`Expected Question, got ${q["@type"]}`);
      }
      if (!q.name) {
        errors.push("Question missing 'name'");
      }
      if (!q.acceptedAnswer || q.acceptedAnswer["@type"] !== "Answer") {
        errors.push("Question missing acceptedAnswer with @type Answer");
      }
      if (!q.acceptedAnswer?.text) {
        errors.push("Answer missing 'text'");
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
