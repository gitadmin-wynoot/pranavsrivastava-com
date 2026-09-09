import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, Feather, ArrowRight, ExternalLink } from "lucide-react";
import { getBlogPosts, getEssays } from "@/lib/content";
import { getMediumPosts } from "@/lib/medium";
import { formatDate } from "@/lib/utils";

const MEDIUM_URL = "https://pranav-srivastava.medium.com";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Essays and notes on AI that holds up in production — agents, MCP, RAG, and the thinking behind real systems. Some here, longer ones on Medium.",
};

export default async function WritingPage() {
  const essays = getEssays().slice(0, 3);
  const nativePosts = getBlogPosts();
  const mediumPosts = await getMediumPosts(20);
  const mediumShown = mediumPosts.slice(0, 5);

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
          occasional thing worth thinking through. For slower, more reflective
          pieces, see{" "}
          <Link href="/essays" className="text-blue-600 dark:text-blue-400 hover:underline">
            Essays
          </Link>
          .
        </p>
      </div>

      {/* Essays — the slower, reflective writing */}
      {essays.length > 0 && (
        <div className="mb-10 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 sm:p-7">
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

      {/* Native notes */}
      {nativePosts.length > 0 && (
        <div className="mb-10">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Notes</h2>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {nativePosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group flex flex-col py-5 -mx-3 px-3 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
              >
                <h3 className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {p.title}
                </h3>
                {p.summary && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-1 mb-2">{p.summary}</p>
                )}
                <div className="flex items-center gap-3 text-xs text-zinc-400">
                  <span>{formatDate(p.publishedAt)}</span>
                  <span>·</span>
                  <span>{p.readingTimeMin} min read</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* From Medium — collapsed into one tidy folder */}
      {mediumPosts.length > 0 && (
        <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
                <BookOpen className="h-4 w-4 text-zinc-500 dark:text-zinc-400" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">From Medium</h2>
                <p className="text-xs text-zinc-400">{mediumPosts.length}+ articles · the back catalogue</p>
              </div>
            </div>
            <a
              href={MEDIUM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              See all ↗
            </a>
          </div>
          <ol className="border-t border-zinc-100 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-900">
            {mediumShown.map((p) => (
              <li key={p.url}>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 px-5 py-3 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
                >
                  <span className="flex-1 min-w-0">
                    <span className="block truncate text-sm text-zinc-700 dark:text-zinc-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {p.title}
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      {formatDate(p.publishedAt)} · {p.readingTimeMin} min
                    </span>
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </a>
              </li>
            ))}
          </ol>
          <a
            href={MEDIUM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 border-t border-zinc-100 dark:border-zinc-800 px-5 py-3 text-sm text-zinc-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Read all {mediumPosts.length}+ on Medium <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      )}

      {essays.length === 0 && nativePosts.length === 0 && mediumPosts.length === 0 && (
        <div className="text-center py-16 text-zinc-400">
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">First pieces going up shortly.</p>
        </div>
      )}
    </div>
  );
}
