import type { Metadata } from "next";
import Link from "next/link";
import { Folder, ArrowRight } from "lucide-react";
import { getEssays, type Essay } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Slower, reflective writing on AI — its state, where it might go, and the questions worth asking about how we build it. Less how-to, more why and what-if.",
};

type Entry =
  | { kind: "series"; name: string; parts: Essay[]; date: string }
  | { kind: "essay"; essay: Essay; date: string };

export default function EssaysPage() {
  const essays = getEssays(); // newest first

  // Group into series "folders" + standalone essays, then order by recency.
  const seriesOrder: string[] = [];
  const seriesMap = new Map<string, Essay[]>();
  const entries: Entry[] = [];

  for (const e of essays) {
    if (e.series) {
      if (!seriesMap.has(e.series)) {
        seriesMap.set(e.series, []);
        seriesOrder.push(e.series);
      }
      seriesMap.get(e.series)!.push(e);
    } else {
      entries.push({ kind: "essay", essay: e, date: e.publishedAt });
    }
  }

  for (const name of seriesOrder) {
    const parts = seriesMap
      .get(name)!
      .slice()
      .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0));
    // dated by the most recent part so it sorts sensibly among standalones
    const date = parts.reduce(
      (max, p) => (p.publishedAt > max ? p.publishedAt : max),
      parts[0].publishedAt,
    );
    entries.push({ kind: "series", name, parts, date });
  }

  entries.sort((a, b) => (a.date > b.date ? -1 : 1));

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-14">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Essays
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Thinking out loud about AI.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-lg">
          Not tutorials. Slower pieces about where AI is, where it might go, and
          the questions I think are worth sitting with — about responsibility,
          who it&apos;s for, and what kind of builders we want to be. I write
          these to ask better questions, not to sound certain.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-3">
          Multi-part reads are gathered into{" "}
          <span className="inline-flex items-center gap-1 text-amber-700 dark:text-amber-500">
            <Folder className="w-3.5 h-3.5" /> series
          </span>
          . Shorter notes and build-focused posts live in{" "}
          <Link href="/blog" className="text-blue-600 dark:text-blue-400 hover:underline">
            Writing
          </Link>
          .
        </p>
      </div>

      {essays.length === 0 ? (
        <p className="text-sm text-zinc-400">First essays going up shortly.</p>
      ) : (
        <div className="space-y-4">
          {entries.map((entry) =>
            entry.kind === "series" ? (
              <SeriesFolder key={`series-${entry.name}`} name={entry.name} parts={entry.parts} />
            ) : (
              <EssayRow key={entry.essay.slug} essay={entry.essay} />
            ),
          )}
        </div>
      )}
    </div>
  );
}

/* A standalone essay — plain editorial row. */
function EssayRow({ essay }: { essay: Essay }) {
  return (
    <Link
      href={`/essays/${essay.slug}`}
      className="group block rounded-xl px-4 py-5 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
    >
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {essay.title}
      </h2>
      {essay.dek && (
        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 italic">
          {essay.dek}
        </p>
      )}
      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-3">
        <span>{formatDate(essay.publishedAt)}</span>
        <span>·</span>
        <span>{essay.readingTimeMin} min read</span>
      </div>
    </Link>
  );
}

/* A series — a "folder" holding its parts. Warm manila tint so it never reads
   like a course card. */
function SeriesFolder({ name, parts }: { name: string; parts: Essay[] }) {
  const totalMin = parts.reduce((sum, p) => sum + p.readingTimeMin, 0);
  return (
    <div className="rounded-xl border border-amber-200/70 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10 overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
          <Folder className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
            {name}
          </h2>
          <p className="text-xs text-amber-700/80 dark:text-amber-500/80">
            {parts.length}-part series · {totalMin} min in total
          </p>
        </div>
      </div>

      <ol className="border-t border-amber-200/50 dark:border-amber-900/20 divide-y divide-amber-200/40 dark:divide-amber-900/20">
        {parts.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/essays/${p.slug}`}
              className="group flex items-start gap-3 px-5 py-3.5 hover:bg-amber-100/40 dark:hover:bg-amber-900/15 transition-colors"
            >
              <span className="mt-0.5 font-mono text-xs text-amber-600/70 dark:text-amber-500/70 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {p.title}
                </span>
                {p.dek && (
                  <span className="mt-0.5 block text-sm text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-1">
                    {p.dek}
                  </span>
                )}
              </span>
              <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-500/60 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
