"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Check, ArrowRight, RotateCcw } from "lucide-react";
import { useCourseProgress } from "./use-course-progress";

interface Props {
  slug: string;
  currentId: string;
  next: { id: string; title: string } | null;
}

export function LessonComplete({ slug, currentId, next }: Props) {
  const router = useRouter();
  const { completed, setComplete } = useCourseProgress(slug);
  const isDone = completed.has(currentId);

  function completeAndContinue() {
    setComplete(currentId, true);
    if (next) router.push(`/courses/${slug}/${next.id}`);
  }

  return (
    <div className="mt-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60 p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span
            className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
              isDone ? "bg-emerald-500 text-white" : "bg-zinc-200 dark:bg-zinc-800 text-zinc-400"
            }`}
          >
            <Check className="w-4 h-4" />
          </span>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              {isDone ? "Lesson complete" : "Finished this lesson?"}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              {isDone
                ? "Nice. Your progress is saved on this device."
                : "Mark it done — your progress is saved automatically."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isDone && (
            <button
              onClick={() => setComplete(currentId, false)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
              aria-label="Mark as not done"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Undo
            </button>
          )}
          {next ? (
            <button
              onClick={completeAndContinue}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              {isDone ? "Next lesson" : "Mark done & continue"}
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => setComplete(currentId, true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              {isDone ? "Course complete 🎉" : "Finish course"}
              <Check className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {!next && isDone && (
        <Link
          href={`/courses/${slug}`}
          className="inline-block mt-4 text-xs text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Back to course overview
        </Link>
      )}
    </div>
  );
}
