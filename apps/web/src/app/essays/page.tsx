import type { Metadata } from "next";
import Link from "next/link";
import { getEssays } from "@/lib/content";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Essays",
  description:
    "Slower, reflective writing on AI — its state, where it might go, and the questions worth asking about how we build it. Less how-to, more why and what-if.",
};

export default function EssaysPage() {
  const essays = getEssays();

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
      </div>

      {/* Essay list */}
      {essays.length === 0 ? (
        <p className="text-sm text-zinc-400">First essays going up shortly.</p>
      ) : (
        <div className="space-y-2">
          {essays.map((essay) => (
            <Link
              key={essay.slug}
              href={`/essays/${essay.slug}`}
              className="group block py-6 border-b border-zinc-100 dark:border-zinc-900 first:border-t"
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
          ))}
        </div>
      )}
    </div>
  );
}
