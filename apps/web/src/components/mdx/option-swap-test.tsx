"use client";

import { useState } from "react";

/*
  OptionSwapTest — ILLUSTRATION of one reported finding: swapping which rubric
  sits behind "yes" and "no" changed 32.5% of answers in one independent
  review (xbill, Sept 2026), while re-asking the identical question changed 1.33%.
  The grid is a picture of those proportions, not real Jev output.
*/

const N = 40;
const FLIPPED = 13; // 32.5% of 40
const FLIP_SET = new Set([1, 4, 6, 9, 13, 15, 18, 21, 25, 28, 31, 34, 38]);

export function OptionSwapTest() {
  const [swapped, setSwapped] = useState(false);
  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Same 40 items, same meaning. Only the wording behind yes/no moves.
      </div>
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-10 gap-1" aria-hidden="true">
          {Array.from({ length: N }, (_, i) => {
            const flips = swapped && FLIP_SET.has(i);
            return <span key={i} className={`flex aspect-square items-center justify-center rounded text-[10px] font-bold text-white transition-colors ${flips ? "bg-rose-500" : "bg-emerald-500"}`}>{flips ? "↔" : ""}</span>;
          })}
        </div>
        <div className="mt-3 flex items-center gap-2">
          <button onClick={() => setSwapped(!swapped)} className="rounded-lg border border-zinc-300 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-200">
            {swapped ? "Undo the swap" : "Swap which rubric sits behind yes and no"}
          </button>
          <span className="text-[12px] text-zinc-600 dark:text-zinc-300">{swapped ? `${FLIPPED} of ${N} answers changed (32.5%)` : "All answers agree"}</span>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
          Asking the identical question twice changed only 1.33% of answers, so the model is steady. But it is steady about the <em>wording</em>, not just the meaning. Small, reasonable-looking edits to your instructions can move a third of your decisions. That is why every prompt change here is a release, and why the <a className="text-blue-600 dark:text-blue-400 underline" href="/courses/agentic-harness-patterns/08-the-shadow-evaluation-harness">Shadow Evaluation Harness</a> matters more, not less.
        </p>
      </div>
    </figure>
  );
}
