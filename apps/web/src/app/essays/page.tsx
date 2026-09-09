import type { Metadata } from "next";
import Link from "next/link";
import { Folder } from "lucide-react";
import { getEssays } from "@/lib/content";
import { EssaysBrowser, type EssayMeta } from "@/components/essays/essays-browser";

export const metadata: Metadata = {
  alternates: { canonical: "/essays" },
  title: "Essays",
  description:
    "Slower, reflective writing — AI and society, building and craft, systems, economics, product, and more. Filter by topic, or hit shuffle for a few to start with.",
};

export default function EssaysPage() {
  const essays: EssayMeta[] = getEssays().map((e) => ({
    slug: e.slug,
    title: e.title,
    dek: e.dek,
    publishedAt: e.publishedAt,
    readingTimeMin: e.readingTimeMin,
    category: e.category,
    series: e.series,
    seriesPart: e.seriesPart,
  }));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Essays
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Thinking out loud.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg">
          Not tutorials. Slower pieces on the things I keep turning over — AI and
          the shape it&apos;s giving the world, how we build and learn, the odd
          bit of economics or product thinking. I write these to ask better
          questions, not to sound certain.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-3">
          Filter by topic below; multi-part reads are gathered into{" "}
          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-500">
            <Folder className="w-3.5 h-3.5" /> series
          </span>
          . Shorter, build-focused posts live in{" "}
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
            Writing
          </Link>
          .
        </p>
      </div>

      {essays.length === 0 ? (
        <p className="text-sm text-zinc-400">First essays going up shortly.</p>
      ) : (
        <EssaysBrowser essays={essays} />
      )}
    </div>
  );
}
