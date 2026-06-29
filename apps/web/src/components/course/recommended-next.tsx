"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Shuffle, Compass } from "lucide-react";

export interface RecCourse {
  slug: string;
  title: string;
  summary: string;
  track?: string;
  lessonCount?: number;
}

function pickN<T>(arr: T[], n: number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, n);
}

// "What next?" — a fresh, relevant recommendation each time, instead of a
// dead-end. Prefers a course from the same track (keep going), then mixes in
// one from elsewhere (discover), and re-rolls on demand.
export function RecommendedNext({
  currentSlug,
  currentTrack,
  candidates,
}: {
  currentSlug: string;
  currentTrack?: string;
  candidates: RecCourse[];
}) {
  const pool = candidates.filter((c) => c.slug !== currentSlug);

  function choose(): RecCourse[] {
    if (pool.length === 0) return [];
    const sameTrack = pool.filter((c) => c.track === currentTrack);
    const others = pool.filter((c) => c.track !== currentTrack);
    const first = sameTrack.length ? pickN(sameTrack, 1) : pickN(pool, 1);
    const remaining = pool.filter((c) => c.slug !== first[0]?.slug);
    const second = (others.length ? pickN(others, 1) : pickN(remaining, 1)).filter(
      (c) => c && c.slug !== first[0]?.slug
    );
    return [...first, ...second].slice(0, 2);
  }

  // Stable for SSR (first of each group), random after mount.
  const [picks, setPicks] = useState<RecCourse[]>(() => {
    const same = pool.find((c) => c.track === currentTrack);
    const other = pool.find((c) => c.track !== currentTrack && c.slug !== same?.slug);
    return [same, other].filter(Boolean).slice(0, 2) as RecCourse[];
  });

  useEffect(() => {
    setPicks(choose());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (picks.length === 0) return null;

  return (
    <div className="mt-14 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6 sm:p-7">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Compass className="w-4 h-4 text-blue-500" />
          Where to go next
        </h3>
        <button
          onClick={() => setPicks(choose())}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          <Shuffle className="w-3.5 h-3.5" /> Something else
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {picks.map((c) => (
          <Link
            key={c.slug}
            href={`/courses/${c.slug}`}
            className="group flex flex-col p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 hover:border-blue-500/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {c.title}
              </p>
              <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors shrink-0 mt-0.5" />
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-2">
              {c.summary}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
