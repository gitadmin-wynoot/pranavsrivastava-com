"use client";

/*
  AIOSWordmap — a gently floating cloud of plain-language phrases describing
  what a personal AI OS actually is. No jargon; sized and coloured for rhythm.
*/

type Word = { t: string; s: number; c: string };

const WORDS: Word[] = [
  { t: "your second brain", s: 1.5, c: "text-blue-600 dark:text-blue-400" },
  { t: "remembers you", s: 1.1, c: "text-violet-600 dark:text-violet-400" },
  { t: "works while you sleep", s: 1.35, c: "text-emerald-600 dark:text-emerald-400" },
  { t: "does the boring parts", s: 1.0, c: "text-zinc-500 dark:text-zinc-400" },
  { t: "answers with sources", s: 1.15, c: "text-amber-600 dark:text-amber-400" },
  { t: "private, and yours", s: 1.25, c: "text-rose-600 dark:text-rose-400" },
  { t: "connects your apps", s: 1.0, c: "text-sky-600 dark:text-sky-400" },
  { t: "learns from you", s: 1.2, c: "text-blue-600 dark:text-blue-400" },
  { t: "you stay in control", s: 1.3, c: "text-emerald-600 dark:text-emerald-400" },
  { t: "gets better daily", s: 1.05, c: "text-violet-600 dark:text-violet-400" },
  { t: "one place for everything", s: 1.1, c: "text-zinc-500 dark:text-zinc-400" },
  { t: "asks before it acts", s: 1.0, c: "text-amber-600 dark:text-amber-400" },
  { t: "builds in public", s: 1.15, c: "text-sky-600 dark:text-sky-400" },
  { t: "turns notes into work", s: 1.05, c: "text-rose-600 dark:text-rose-400" },
  { t: "not another chatbot", s: 1.2, c: "text-blue-600 dark:text-blue-400" },
];

export function AIOSWordmap() {
  return (
    <div className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 px-5 py-8">
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2.5">
        {WORDS.map((w, i) => (
          <span
            key={w.t}
            className={`aios-word font-medium leading-none ${w.c}`}
            style={{ fontSize: `${w.s}rem`, animationDelay: `${(i % 6) * 0.35}s` }}
          >
            {w.t}
          </span>
        ))}
      </div>
    </div>
  );
}
