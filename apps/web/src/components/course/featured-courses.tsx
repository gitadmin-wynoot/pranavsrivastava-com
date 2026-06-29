"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Shuffle, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export interface FeaturedCourse {
  slug: string;
  title: string;
  summary: string;
  track?: string;
  lessonCount?: number;
}

function shuffle<T>(input: T[]): T[] {
  const a = [...input];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const trackLabel: Record<string, string> = {
  "ai-foundations": "AI Foundations",
  "applied-ai": "Applied AI",
  "cloud-apis": "Cloud & APIs",
  "data-engineering": "Data Engineering",
  "personal-ai-os": "Personal AI OS",
};

// Shows a few courses at a time from the full set — a fresh, shuffled handful
// on each visit, with a "Show me others" button — so a long catalogue feels
// like an invitation, not a wall.
export function FeaturedCourses({ courses, perPage = 3 }: { courses: FeaturedCourse[]; perPage?: number }) {
  // Stable order for SSR; shuffle once mounted (no hydration mismatch).
  const [order, setOrder] = useState<FeaturedCourse[]>(courses);
  const [page, setPage] = useState(0);

  useEffect(() => {
    setOrder(shuffle(courses));
    setPage(0);
  }, [courses]);

  const total = order.length;
  if (total === 0) return null;

  const visible = Array.from({ length: Math.min(perPage, total) }, (_, k) =>
    order[(page * perPage + k) % total]
  );

  const showControls = total > perPage;

  return (
    <div>
      <div className="grid sm:grid-cols-3 gap-4">
        {visible.map((course) => (
          <Link
            key={course.slug}
            href={`/courses/${course.slug}`}
            className="group flex flex-col p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <Badge variant="green">Available</Badge>
              {course.lessonCount && (
                <span className="text-xs text-zinc-400">{course.lessonCount} lessons</span>
              )}
            </div>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              {course.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3 flex-1">
              {course.summary}
            </p>
            {course.track && trackLabel[course.track] && (
              <span className="mt-3 text-[11px] text-zinc-400">{trackLabel[course.track]}</span>
            )}
          </Link>
        ))}
      </div>

      {showControls && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-xs text-zinc-400">
            A few of {total} — fresh pick each visit
          </span>
          <button
            onClick={() => setPage((p) => p + 1)}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            <Shuffle className="w-3.5 h-3.5" /> Show me others
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
