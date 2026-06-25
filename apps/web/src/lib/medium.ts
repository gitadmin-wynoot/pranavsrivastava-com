// Medium RSS — pulls Pranav's latest posts at build/ISR time, no API key needed.
// Parsed without an XML dependency to keep the web app lean. Fails soft: if the
// feed is unreachable, callers get an empty list and the UI hides the section.

const MEDIUM_FEED = "https://pranav-srivastava.medium.com/feed";

export interface MediumPost {
  title: string;
  url: string;
  publishedAt: string; // ISO
  categories: string[];
  snippet: string;
  readingTimeMin: number;
}

function decode(s: string): string {
  return s
    .replace(/<!\[CDATA\[/g, "")
    .replace(/\]\]>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function firstMatch(block: string, tag: string): string | null {
  const m = block.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  return m ? decode(m[1]) : null;
}

/** Strip a Medium article URL of its tracking query string. */
function cleanUrl(url: string): string {
  return url.split("?")[0];
}

export async function getMediumPosts(limit = 4): Promise<MediumPost[]> {
  try {
    const res = await fetch(MEDIUM_FEED, {
      // Revalidate hourly — new posts appear without a redeploy.
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const xml = await res.text();

    const items = xml.split("<item>").slice(1);
    const posts: MediumPost[] = [];

    for (const raw of items) {
      const block = raw.split("</item>")[0];

      const title = firstMatch(block, "title");
      const link = firstMatch(block, "link");
      const pubDate = firstMatch(block, "pubDate");
      if (!title || !link || !pubDate) continue;

      const categories = Array.from(
        block.matchAll(/<category>([\s\S]*?)<\/category>/g)
      )
        .map((m) => decode(m[1]))
        .filter(Boolean)
        .slice(0, 3);

      const contentHtml = firstMatch(block, "content:encoded") ?? "";
      const text = decode(contentHtml.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ");
      const words = text ? text.split(" ").length : 0;
      const readingTimeMin = Math.max(1, Math.round(words / 200));
      const snippet =
        text.length > 150 ? text.slice(0, 150).trimEnd() + "…" : text;

      posts.push({
        title,
        url: cleanUrl(link),
        publishedAt: new Date(pubDate).toISOString(),
        categories,
        snippet,
        readingTimeMin,
      });
    }

    return posts.slice(0, limit);
  } catch {
    return [];
  }
}
