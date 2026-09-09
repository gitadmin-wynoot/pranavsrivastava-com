"use client";

import { useState } from "react";

/*
  SectorImpact — the forward-looking companion to CivilizationalShifts: not
  what happened before, but what a genuinely capable, general AI plausibly
  does to specific industries — one real opportunity, one real risk each,
  refusing both the utopia and the doom framing. SSR-stable, no API.
*/

type Sector = {
  emoji: string;
  name: string;
  accent: string;
  opportunity: string;
  risk: string;
};

const SECTORS: Sector[] = [
  {
    emoji: "🏦",
    name: "Banking",
    accent: "border-blue-500/40 bg-blue-500/5",
    opportunity: "Genuinely personal financial guidance at the cost of a phone plan, not a private banker — for the billions who've never had either.",
    risk: "Automated credit and fraud decisions made by a system nobody can fully explain, at a scale where a small systematic bias becomes a very large one.",
  },
  {
    emoji: "💰",
    name: "Finance",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    opportunity: "Markets that price risk faster and more accurately, catching fraud and systemic buildup earlier than any human desk could.",
    risk: "Correlated AI trading strategies acting in near-lockstep — a flash crash isn't hypothetical, it already happened in miniature in 2010, before models this capable existed.",
  },
  {
    emoji: "🏥",
    name: "Healthcare",
    accent: "border-rose-500/40 bg-rose-500/5",
    opportunity: "Diagnostic and drug-discovery cycles that used to take a decade compressed to years — AlphaFold's protein predictions are already a real, working preview of this.",
    risk: "A widening gap between health systems that can afford the frontier tools and those that can't — inequality measured in years of life, not income.",
  },
  {
    emoji: "📡",
    name: "Telecom",
    accent: "border-violet-500/40 bg-violet-500/5",
    opportunity: "Networks that self-diagnose and self-heal, and genuinely competent support available in every language, all the time, everywhere.",
    risk: "The infrastructure everything else here runs on becomes the single highest-value target for those who'd rather it failed.",
  },
  {
    emoji: "📦",
    name: "Logistics",
    accent: "border-amber-500/40 bg-amber-500/5",
    opportunity: "Global supply chains that route around a disruption in hours instead of weeks — a real, compounding dent in waste and emissions.",
    risk: "Millions of driving and warehouse jobs are the most exposed work on the planet to this technology, and the timeline for that is measured in years, not decades.",
  },
  {
    emoji: "📣",
    name: "Marketing",
    accent: "border-sky-500/40 bg-sky-500/5",
    opportunity: "A small business getting the same calibre of strategy and creative work that used to be exclusive to companies with agency budgets.",
    risk: "A feed that already knows exactly which words move you, deployed by whoever pays for the access — persuasion with no meaningful upper bound.",
  },
];

export function SectorImpact() {
  const [i, setI] = useState(0);
  const s = SECTORS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        One opportunity, one risk, per industry — no doom, no utopia
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {SECTORS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{s.emoji}</span> {s.name}
          </h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">The real opportunity</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.opportunity}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">The real risk</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.risk}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Both columns are true at once, in every industry here. Which one dominates is a policy and design choice, not something the technology decides on its own.
        </p>
      </div>
    </figure>
  );
}
