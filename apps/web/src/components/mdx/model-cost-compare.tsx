"use client";

import { useState } from "react";

/*
  ModelCostCompare — the three real ways to get a model into your product,
  compared on the dimensions that actually drive the choice. Deliberately
  no specific dollar figures (they move constantly and vary by provider) —
  the relative shape of the trade-off is the stable, teachable part.
  SSR-stable, no API.
*/

type Option = {
  emoji: string;
  name: string;
  accent: string;
  upfront: string;
  ongoing: string;
  control: string;
  bestFor: string;
};

const OPTIONS: Option[] = [
  {
    emoji: "☁️",
    name: "Proprietary API",
    accent: "border-blue-500/40 bg-blue-500/5",
    upfront: "Near zero — an API key and a few lines of code.",
    ongoing: "Pay per token, metered — scales smoothly with usage, no idle cost.",
    control: "Lowest — you can't retrain it, and the provider can change or deprecate the model under you.",
    bestFor: "Almost every team starting out. Fastest to ship, no infrastructure to run, and frontier-level quality without a research team.",
  },
  {
    emoji: "🖥️",
    name: "Self-hosted open-weight",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    upfront: "Real — GPUs (owned or rented) and the engineering time to run them reliably.",
    ongoing: "Largely fixed — you pay for the hardware whether it's busy or idle, which can be cheaper at high, steady volume and worse at low or spiky volume.",
    control: "High — full control over the weights, data never leaves your infrastructure, and you decide the upgrade schedule.",
    bestFor: "High, predictable volume; strict data-residency or privacy requirements; or a genuine cost win once usage is consistently large.",
  },
  {
    emoji: "🎯",
    name: "Fine-tuned",
    accent: "border-amber-500/40 bg-amber-500/5",
    upfront: "Meaningful — you need a real training dataset and a training run, on top of either hosting option above.",
    ongoing: "Usually similar to whichever base you fine-tuned from — the extra cost is mostly the one-time training run, not every request after.",
    control: "Highest for *behaviour* — you can bake in a house style, a narrow domain vocabulary, or a specific output format reliably.",
    bestFor: "A narrow, repeated task where prompting alone genuinely can't get consistent enough results — worth confirming that's really true first (see the next chapter).",
  },
];

export function ModelCostCompare() {
  const [i, setI] = useState(0);
  const o = OPTIONS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Three ways to get a model into your product
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex gap-1.5">
          {OPTIONS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${o.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{o.emoji}</span> {o.name}
          </h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Upfront cost</p>
              <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">{o.upfront}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Ongoing cost shape</p>
              <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">{o.ongoing}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Control</p>
              <p className="mt-0.5 text-[13px] text-zinc-600 dark:text-zinc-300">{o.control}</p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">Best for: </span>{o.bestFor}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Deliberately no dollar figures here — real pricing moves constantly and varies by provider and negotiated volume. The shape of the trade-off is the stable, teachable part; check current pricing pages before committing budget.
        </p>
      </div>
    </figure>
  );
}
