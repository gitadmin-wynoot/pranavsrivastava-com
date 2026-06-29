import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Feather, ArrowRight } from "lucide-react";
import { getBlogPosts, getEssays } from "@/lib/content";
import { getMediumPosts } from "@/lib/medium";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays and notes on building AI that actually works — agents, MCP, RAG, and the thinking behind real systems. Some here, longer ones on Medium.",
};

export default async function WritingPage() {
  const essays = getEssays().slice(0, 3);
  // One archive: native posts + Medium essays, newest first.
  const mediumPosts = await getMediumPosts(20);
  const writing = [
    ...getBlogPosts().map((p) => ({
      key: p.slug,
      title: p.title,
      summary: p.summary,
      href: `/blog/${p.slug}`,
      external: false,
      date: p.publishedAt,
      readingTimeMin: p.readingTimeMin,
      source: p.category,
    })),
    ...mediumPosts.map((p) => ({
      key: p.url,
      title: p.title,
      summary: p.snippet,
      href: p.url,
      external: true,
      date: p.publishedAt,
      readingTimeMin: p.readingTimeMin,
      source: "Medium",
    })),
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Writing
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          What I am figuring out, written down.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Mostly about building AI that holds up in the real world — and the
          occasional thing I just found worth thinking through. The longer
          essays live on{" "}
          <a
            href="https://pranav-srivastava.medium.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Medium
          </a>
          .
        </p>
      </div>

      {/* Essays — the slower, reflective writing */}
      {essays.length > 0 && (
        <div className="mb-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 sm:p-7">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Feather className="w-4 h-4 text-violet-500" />
              Essays
            </h2>
            <Link
              href="/essays"
              className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              All essays →
            </Link>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
            Slower pieces on where AI is going and the questions worth sitting
            with — responsibility, who it&apos;s for, what kind of builders we
            want to be.
          </p>
          <div className="space-y-3">
            {essays.map((essay) => (
              <Link
                key={essay.slug}
                href={`/essays/${essay.slug}`}
                className="group flex items-start justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {essay.title}
                  </p>
                  {essay.dek && (
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5 italic line-clamp-1">
                      {essay.dek}
                    </p>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-violet-500 transition-colors shrink-0 mt-0.5" />
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Posts */}
      {writing.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">First pieces going up shortly.</p>
        </div>
      ) : (
        <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
          {writing.map((item) => {
            const inner = (
              <>
                <div className="flex items-start justify-between gap-4 mb-2">
                  <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {item.title}
                  </h2>
                  <span className="text-xs text-zinc-400 shrink-0 pt-0.5">
                    {item.source}
                    {item.external ? " ↗" : ""}
                  </span>
                </div>
                {item.summary && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">
                    {item.summary}
                  </p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>{formatDate(item.date)}</span>
                  <span>·</span>
                  <span>{item.readingTimeMin} min read</span>
                </div>
              </>
            );
            const cls =
              "group flex flex-col py-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-3 px-3 rounded-lg transition-colors";
            return item.external ? (
              <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                {inner}
              </a>
            ) : (
              <Link key={item.key} href={item.href} className={cls}>
                {inner}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
