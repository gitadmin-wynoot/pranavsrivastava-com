// A small, safe way to emit schema.org structured data. Search engines use
// it for rich results; AI answer engines (ChatGPT, Perplexity, Google's AI
// Overviews, Claude) lean on it even harder — it's the cleanest, least
// ambiguous set of facts a page can hand an LLM to quote or cite correctly.
//
// Escaping "<" stops a value containing "</script>" from breaking out of the
// tag — the standard, minimal precaution for inlining JSON into HTML.
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
