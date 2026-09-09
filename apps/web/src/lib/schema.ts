// schema.org builders — kept in one place so every page emits the same
// author identity, the same site name, and the same shape. Consumed via the
// <JsonLd> component. Field names and required properties follow Google's
// documented structured-data guidance (developers.google.com/search/docs/appearance/structured-data).

export const SITE_URL = "https://pranavsrivastava.com";
export const SITE_NAME = "Pranav Srivastava";

export const PERSON_ID = `${SITE_URL}/#person`;

// Every profile actually linked from the site — keeps sameAs honest rather
// than padded with accounts that aren't referenced anywhere.
export const SAME_AS = [
  "https://nl.linkedin.com/in/pranav-srivastava-651a9427",
  "https://pranav-srivastava.medium.com",
];

export function personSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": PERSON_ID,
    name: SITE_NAME,
    url: SITE_URL,
    jobTitle: "Product Thinkengineer",
    description:
      "Product thinkengineer in the Netherlands — 15 years building software at scale, now deep in applied AI.",
    sameAs: SAME_AS,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description:
      "Hands-on labs, courses, and essays on building AI systems that hold up in production.",
    publisher: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}

interface ArticleInput {
  url: string;
  headline: string;
  description: string;
  datePublished: string;
  dateModified?: string;
  section?: string;
  keywords?: string[];
}

/** Article schema for essays and blog posts — Pranav is both author and publisher. */
export function articleSchema(a: ArticleInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": a.url },
    headline: a.headline,
    description: a.description,
    url: a.url,
    datePublished: a.datePublished,
    dateModified: a.dateModified ?? a.datePublished,
    inLanguage: "en",
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    ...(a.section ? { articleSection: a.section } : {}),
    ...(a.keywords?.length ? { keywords: a.keywords.join(", ") } : {}),
  };
}

interface CourseInput {
  url: string;
  name: string;
  description: string;
  level?: string;
  tags?: string[];
}

/** Course schema — Google's dedicated type for educational course content. */
export function courseSchema(c: CourseInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": c.url,
    name: c.name,
    description: c.description,
    url: c.url,
    inLanguage: "en",
    provider: {
      "@type": "Person",
      "@id": PERSON_ID,
      name: SITE_NAME,
      url: SITE_URL,
    },
    ...(c.level ? { educationalLevel: c.level } : {}),
    ...(c.tags?.length ? { about: c.tags.map((name) => ({ "@type": "Thing", name })) } : {}),
  };
}

/** Breadcrumb trail — helps both search snippets and LLMs place a page in the site. */
export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
