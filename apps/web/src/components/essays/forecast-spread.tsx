"use client";

import { useState } from "react";

/*
  ForecastSpread — the honest shape of expert disagreement on AGI timing.
  Deliberately presented as camps of reasoning, not a poll of named
  individuals with specific claimed dates (attribution to a moving target
  changes too fast to responsibly pin to a person). Grounded in the real,
  well-documented pattern from surveys like AI Impacts': wide spread, and
  medians that have shortened across successive surveys. SSR-stable, no API.
*/

type Camp = {
  emoji: string;
  name: string;
  accent: string;
  view: string;
  reasoning: string;
};

const CAMPS: Camp[] = [
  {
    emoji: "🏃",
    name: "Soon",
    accent: "border-rose-500/40 bg-rose-500/5",
    view: "Within this decade. Scaling current methods, plus better tool use and reasoning, gets there faster than most outsiders assume.",
    reasoning: "Points to the pace of the last five years as the base rate going forward, not the exception.",
  },
  {
    emoji: "🚶",
    name: "A generation out",
    accent: "border-amber-500/40 bg-amber-500/5",
    view: "Real, but decades away — the current paradigm gets us most of the way and then hits diminishing returns that need a genuine new idea to clear.",
    reasoning: "The median view in surveys of AI researchers over the years — and notably, that median has moved earlier with each successive survey.",
  },
  {
    emoji: "🐢",
    name: "Much further, or never in this form",
    accent: "border-blue-500/40 bg-blue-500/5",
    view: "Current systems are extremely capable pattern-matchers, not a step on the path to general reasoning — the whole framing may be chasing the wrong hill.",
    reasoning: "Points to the many capabilities (robust causal reasoning, genuine world-modelling) that still look qualitatively, not just quantitatively, out of reach.",
  },
];

export function ForecastSpread() {
  const [i, setI] = useState(1);
  const c = CAMPS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Three real camps, and nobody's actually sure
      </div>

      <div className="p-4 sm:p-5">
        <svg viewBox="0 0 640 90" className="w-full h-auto" fill="none" role="img">
          <line x1="40" y1="60" x2="600" y2="60" className="stroke-zinc-200 dark:stroke-zinc-800" strokeWidth="1.5" />
          <text x="40" y="80" className="fill-zinc-400" fontSize="10">now</text>
          <text x="600" y="80" textAnchor="end" className="fill-zinc-400" fontSize="10">further out →</text>
          {CAMPS.map((camp, idx) => {
            const x = 120 + idx * 200;
            const active = idx === i;
            return (
              <g key={camp.name} onClick={() => setI(idx)} className="cursor-pointer">
                <circle cx={x} cy={60} r={active ? 9 : 6} className={active ? "fill-blue-500" : "fill-zinc-300 dark:fill-zinc-600"} />
                <text x={x} y={44} textAnchor="middle" fontSize="11" fontWeight={active ? 700 : 500} className={active ? "fill-zinc-900 dark:fill-zinc-100" : "fill-zinc-400"}>
                  {camp.emoji} {camp.name}
                </text>
              </g>
            );
          })}
        </svg>

        <div className={`mt-2 rounded-xl border p-4 ${c.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{c.emoji}</span> {c.name}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.view}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">The reasoning: </span>{c.reasoning}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          These are camps of reasoning, not a poll of named individuals — pinning a specific date to a specific person tends to age badly and rarely reflects how hedged their actual view is. What's real and well-documented is the spread itself, and the fact that surveyed medians have kept shortening.
        </p>
      </div>
    </figure>
  );
}
