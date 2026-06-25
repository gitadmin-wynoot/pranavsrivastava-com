"use client";

import Link from "next/link";
import { Play, Clock, ChevronRight, Check } from "lucide-react";
import { useCourseProgress } from "./use-course-progress";

interface Mod {
  id: string;
  title: string;
  summary?: string;
  time_minutes: number;
}

export function CourseOutline({ slug, modules }: { slug: string; modules: Mod[] }) {
  const { completed } = useCourseProgress(slug);
  const total = modules.length;
  const done = modules.filter((m) => completed.has(m.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;
  const firstIncomplete = modules.find((m) => !completed.has(m.id)) ?? modules[0];
  const started = done > 0;
  const allDone = total > 0 && done === total;

  return (
    <>
      {/* Progress + primary CTA */}
      <div className="mb-10">
        {started && (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5 text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                {done} of {total} lessons complete
              </span>
              <span className="text-zinc-400">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        )}
        {total > 0 && (
          <Link
            href={`/courses/${slug}/${firstIncomplete.id}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
          >
            <Play className="w-3.5 h-3.5" />
            {allDone
              ? "Review the course"
              : started
                ? "Continue where you left off"
                : "Start course"}
          </Link>
        )}
      </div>

      {/* Module list with completion */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
          Course modules
        </h2>
        {modules.map((m, index) => {
          const isDone = completed.has(m.id);
          return (
            <Link
              key={m.id}
              href={`/courses/${slug}/${m.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group"
            >
              <span
                className={`flex-none w-7 h-7 rounded-full text-xs font-mono font-medium flex items-center justify-center ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400"
                }`}
              >
                {isDone ? <Check className="w-3.5 h-3.5" /> : String(index + 1).padStart(2, "0")}
              </span>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  {m.title}
                </p>
                {m.summary && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5">{m.summary}</p>
                )}
              </div>

              <div className="flex-none flex items-center gap-3 text-zinc-400">
                <span className="text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {m.time_minutes}m
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
