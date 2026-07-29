"use client";

import { useState } from "react";

/*
  ProgressReceipts — the antidote to "everything is getting worse". Pick a
  measure of human progress and see then vs now, with the source. Figures are
  well-established estimates (World Bank, Our World in Data, IEA); rounded and
  hedged on purpose. No API; SSR-stable.
*/

type Receipt = {
  emoji: string;
  label: string;
  then: string;
  thenTag: string;
  now: string;
  nowTag: string;
  note: string;
};

const RECEIPTS: Receipt[] = [
  {
    emoji: "🩺",
    label: "Children who reach their 5th birthday",
    then: "~4 in 5",
    thenTag: "1950, worldwide",
    now: "~24 in 25",
    nowTag: "today",
    note: "Global under-five survival (Our World in Data). The single most humbling chart there is.",
  },
  {
    emoji: "📖",
    label: "Adults who can read",
    then: "~1 in 5",
    thenTag: "around 1900",
    now: "~6 in 7",
    nowTag: "today",
    note: "Global adult literacy — from a rare privilege to the near-universal default in four generations.",
  },
  {
    emoji: "💵",
    label: "People in extreme poverty",
    then: "~38%",
    thenTag: "of the world, 1990",
    now: "under 10%",
    nowTag: "today",
    note: "World Bank, below the international poverty line — the fastest fall in deprivation in recorded history.",
  },
  {
    emoji: "☀️",
    label: "The price of solar electricity",
    then: "the most expensive",
    thenTag: "a lab curiosity",
    now: "the cheapest ever",
    nowTag: "the IEA's words, 2020",
    note: "Solar module prices fell by roughly 90% in the 2010s. The cleanest option is now often the cheapest one.",
  },
  {
    emoji: "🌐",
    label: "People connected to the internet",
    then: "≈ nobody",
    thenTag: "1990",
    now: "~5.4 billion",
    nowTag: "about two-thirds of us",
    note: "Most of humanity now carries the sum of recorded knowledge, and a free university, in a pocket.",
  },
];

export function ProgressReceipts() {
  const [i, setI] = useState(0);
  const r = RECEIPTS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Receipts — pick a thing that quietly got better
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {RECEIPTS.map((it, idx) => (
            <button
              key={it.label}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{it.emoji}</span>
              {it.label.split(" ").slice(0, 3).join(" ")}…
            </button>
          ))}
        </div>

        <p className="mt-4 text-sm font-medium text-zinc-700 dark:text-zinc-300">{r.label}</p>

        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/60 dark:bg-zinc-900/40 p-4">
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-zinc-400 dark:text-zinc-500">{r.then}</p>
            <p className="mt-1 text-[11px] text-zinc-400">{r.thenTag}</p>
          </div>
          <div className="text-zinc-300 dark:text-zinc-600 text-xl">→</div>
          <div className="text-center">
            <p className="text-lg sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400">{r.now}</p>
            <p className="mt-1 text-[11px] text-zinc-400">{r.nowTag}</p>
          </div>
        </div>

        <p className="mt-3 text-[12px] leading-snug text-zinc-500 dark:text-zinc-400">{r.note}</p>
        <p className="mt-2 text-[11px] text-zinc-400">
          None of this says things are good — plenty is broken. It says things can get dramatically better, because they demonstrably have. That is a different, more useful feeling than dread.
        </p>
      </div>
    </figure>
  );
}
