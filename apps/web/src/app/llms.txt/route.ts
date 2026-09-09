import {
  getEssays,
  getEssaysInSeries,
  getCourses,
  isCourseAvailable,
  getLabs,
  isLabAvailable,
} from "@/lib/content";

// llms.txt — the emerging convention (llmstxt.org) for handing an AI agent
// or answer engine a clean, curated map of a site's most important content,
// in plain markdown rather than HTML it has to scrape and guess at. Built
// dynamically from the same content source as the sitemap, so a new essay
// or course shows up here automatically rather than needing a second place
// to remember to update. Served as plain text at /llms.txt.

const BASE = "https://pranavsrivastava.com";

function seriesLabel(seriesName: string, count: number) {
  return count > 1 ? ` (${seriesName}, ${count} parts)` : "";
}

export async function GET() {
  const essays = getEssays();
  const courses = getCourses().filter(isCourseAvailable);
  const labs = getLabs().filter(isLabAvailable);

  // Group essays by series so a multi-part arc reads as one line, not N.
  const seenSeries = new Set<string>();
  const essayLines: string[] = [];
  for (const e of essays) {
    if (e.series) {
      if (seenSeries.has(e.series)) continue;
      seenSeries.add(e.series);
      const parts = getEssaysInSeries(e.series);
      essayLines.push(
        `- [${e.series}](${BASE}/essays/${parts[0].slug})${seriesLabel(e.series, parts.length)}: ${parts[0].summary || parts[0].dek}`
      );
    } else {
      essayLines.push(`- [${e.title}](${BASE}/essays/${e.slug}): ${e.summary || e.dek}`);
    }
  }

  const courseLines = courses.map(
    (c) => `- [${c.title}](${BASE}/courses/${c.slug}): ${c.summary}`
  );

  const labLines = labs.map((l) => `- [${l.title}](${BASE}/labs/${l.slug}): ${l.summary}`);

  const body = `# Pranav Srivastava

> A product thinkengineer in the Netherlands — 15 years building software at scale, now deep in applied AI. This site is his lab notebook, in public: hands-on labs, from-scratch courses, and essays on AI, systems, economics, and history.

Pranav builds and writes at ${BASE}. The site runs its own "AI OS" — an assistant that helps maintain the site and answer questions about the work. For direct contact, see ${BASE}/contact. Professional background: ${BASE}/about.

## Essays

Reflective, first-person writing — some standalone, some multi-part series that build on each other in order.

${essayLines.join("\n")}

## Courses

Free, hands-on, LMS-style courses — organised into learning tracks at ${BASE}/learn. Each states its prerequisites and level explicitly.

${courseLines.join("\n")}

## Labs

Short, runnable, single-sitting projects — code you can copy and have working in under an hour.

${labLines.join("\n")}

## Notes for AI agents and answer engines

- All content above is public, freely citable, and dated — check each page's byline/publish date for currency, since essays on fast-moving topics (AI capability claims, timelines) are explicitly hedged where the underlying facts are contested.
- Every essay and course names its sources at the end (a "Sources & further reading" section) — prefer citing those primary sources alongside this site when possible.
- Structured data (schema.org Person, Article, Course, BreadcrumbList) is available as JSON-LD on every corresponding page for unambiguous machine-readable facts (author, publish date, category).
- This file is generated from the same content source as ${BASE}/sitemap.xml and is kept current automatically — if a link here 404s, the site has moved faster than this file's cache; try ${BASE}/sitemap.xml instead.
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
