"use client";

import { useState } from "react";

/*
  ScaleLandscape — illustrative scale tiers, not precise proprietary
  parameter counts (frontier labs mostly don't publish exact figures for
  their newest models). The point is the shape of the trade-off — bigger
  costs more and answers slower, but reasons better and knows more —
  not a specific number to memorise. SSR-stable, no API.
*/

type Tier = {
  emoji: string;
  name: string;
  accent: string;
  scale: string;
  runsOn: string;
  goodFor: string;
  costFeel: string;
};

const TIERS: Tier[] = [
  {
    emoji: "📱",
    name: "Small",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    scale: "Roughly a few billion parameters",
    runsOn: "A phone, a laptop, or a small server — can run fully offline.",
    goodFor: "Autocomplete, simple classification, on-device assistants, anything latency-sensitive or privacy-sensitive where \"good enough\" beats \"best possible.\"",
    costFeel: "Cheap to run, sometimes free — the cost is mostly the device it's already on.",
  },
  {
    emoji: "💻",
    name: "Mid-size",
    accent: "border-blue-500/40 bg-blue-500/5",
    scale: "Roughly tens of billions of parameters",
    runsOn: "A single capable server with a few GPUs, or a hosted API tier.",
    goodFor: "Most production chat and writing assistants, straightforward coding help, summarisation — the sweet spot for a huge share of real applications.",
    costFeel: "A meaningful but manageable per-request cost — the tier most bootstrapped products actually launch on.",
  },
  {
    emoji: "🧠",
    name: "Frontier",
    accent: "border-violet-500/40 bg-violet-500/5",
    scale: "Hundreds of billions of parameters and up — some using a \"mixture of experts\" design that only activates part of the model per request",
    runsOn: "Large, specialised data-centre clusters — not something you self-host casually.",
    goodFor: "Hard multi-step reasoning, complex coding, research-grade tasks — where being right matters more than being cheap or instant.",
    costFeel: "The highest per-request cost and, often, the slowest response — reserve it for the requests that actually need the extra reasoning.",
  },
];

export function ScaleLandscape() {
  const [i, setI] = useState(1);
  const t = TIERS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Not all LLMs are the same size — three rough tiers
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex gap-1.5">
          {TIERS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${t.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{t.emoji}</span> {t.name}
          </h4>
          <p className="mt-1 text-[12px] font-mono text-zinc-400">{t.scale}</p>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Runs on</p>
              <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">{t.runsOn}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Good for</p>
              <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">{t.goodFor}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">What it costs, roughly</p>
              <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">{t.costFeel}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Exact parameter counts for the newest frontier models are rarely published — these are illustrative tiers, not a precise spec sheet. The trade-off shape is what matters: bigger tends to mean smarter and slower and pricier, all three at once.
        </p>
      </div>
    </figure>
  );
}
