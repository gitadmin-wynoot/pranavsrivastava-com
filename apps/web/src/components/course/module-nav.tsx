"use client";

import Link from "next/link";
import { Check, BookOpen, ChevronDown } from "lucide-react";
import { useCourseProgress } from "./use-course-progress";

interface ModuleMeta {
  id: string;
  title: string;
}

interface Props {
  slug: string;
  modules: ModuleMeta[];
  currentId: string;
}

export function ModuleNav({ slug, modules, currentId }: Props) {
  const { completed } = useCourseProgress(slug);
  const total = modules.length;
  const done = modules.filter((m) => completed.has(m.id)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  const list = (
    <nav className="space-y-0.5">
      {modules.map((meta, index) => {
        const isActive = meta.id === currentId;
        const isDone = completed.has(meta.id);
        return (
          <Link
            key={meta.id}
            href={`/courses/${slug}/${meta.id}`}
            className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
              isActive
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-800 dark:hover:text-zinc-200"
            }`}
          >
            <span
              className={`flex-none mt-0.5 text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center ${
                isDone
                  ? "bg-emerald-500 text-white"
                  : isActive
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
              }`}
            >
              {isDone ? <Check className="w-3 h-3" /> : index + 1}
            </span>
            <span className="leading-snug">{meta.title}</span>
          </Link>
        );
      })}
    </nav>
  );

  const progress = (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide flex items-center gap-1.5">
          <BookOpen className="w-3 h-3" /> {total} lessons
        </p>
        <span className="text-xs text-zinc-400">
          {done}/{total} done
        </span>
      </div>
      <div className="h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sticky sidebar */}
      <aside className="hidden lg:block w-64 flex-none sticky top-10">
        <div className="mb-4">{progress}</div>
        {list}
      </aside>

      {/* Mobile: collapsible */}
      <details className="lg:hidden mb-8 rounded-xl border border-zinc-200 dark:border-zinc-800 overflow-hidden group">
        <summary className="flex items-center justify-between gap-3 px-4 py-3 cursor-pointer list-none bg-zinc-50 dark:bg-zinc-900">
          <div className="flex-1">{progress}</div>
          <ChevronDown className="w-4 h-4 text-zinc-400 group-open:rotate-180 transition-transform shrink-0" />
        </summary>
        <div className="p-2 border-t border-zinc-100 dark:border-zinc-800">{list}</div>
      </details>
    </>
  );
}
