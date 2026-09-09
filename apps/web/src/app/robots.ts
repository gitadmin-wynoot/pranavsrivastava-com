import type { MetadataRoute } from "next";

// The wildcard rule below already allows every crawler, AI ones included —
// but for GEO (generative-engine optimisation) it's worth being explicit
// rather than relying on that implicitly. Naming the major answer-engine and
// AI-training crawlers here removes any ambiguity about intent (a stray
// "disallow" added later, or a host-level block, is easy to catch against an
// explicit list) and documents, in one place, which engines this site wants
// reading and citing it.
const AI_CRAWLERS = [
  "GPTBot", // OpenAI — training
  "ChatGPT-User", // OpenAI — live browsing on a user's behalf
  "OAI-SearchBot", // OpenAI — search
  "ClaudeBot", // Anthropic — training & search
  "Claude-Web", // Anthropic — live browsing
  "anthropic-ai", // Anthropic — legacy user-agent
  "PerplexityBot", // Perplexity — search & citation
  "Google-Extended", // Google — Gemini / AI Overviews training (separate from Googlebot)
  "Applebot-Extended", // Apple — Apple Intelligence training (separate from Applebot)
  "CCBot", // Common Crawl — feeds many LLMs' training sets
  "Bytespider", // ByteDance
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/" },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/" })),
    ],
    sitemap: "https://pranavsrivastava.com/sitemap.xml",
    host: "https://pranavsrivastava.com",
  };
}
