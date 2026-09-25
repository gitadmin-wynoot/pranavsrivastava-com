"use client";

import { useState } from "react";

/*
  CostGovernor — an agent loop with a token budget and a step cap. Run it
  with and without the governor to see what a stuck loop costs.
*/

const STEP_TOKENS = 2400; // each loop turn re-sends a growing context
const PRICE_PER_1K = 0.006;
const STUCK_AT = 30; // a stuck agent would keep going this long

export function CostGovernor() {
  const [budget, setBudget] = useState(0.05);
  const [maxSteps, setMaxSteps] = useState(8);
  const [on, setOn] = useState(true);

  const rows: { step: number; cost: number }[] = [];
  let total = 0;
  let stop = "";
  for (let s = 1; s <= STUCK_AT; s++) {
    const tokens = STEP_TOKENS + s * 400; // context grows every turn
    const c = (tokens / 1000) * PRICE_PER_1K;
    if (on && s > maxSteps) { stop = `Stopped at the step cap (${maxSteps}).`; break; }
    if (on && total + c > budget) { stop = `Stopped before step ${s}: it would exceed $${budget.toFixed(2)}.`; break; }
    total += c;
    rows.push({ step: s, cost: total });
  }
  if (!stop) stop = on ? "" : "No governor: the loop ran all 30 steps.";
  const peak = rows.length ? rows[rows.length - 1].cost : 0;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        A stuck agent loop, with and without a governor
      </div>
      <div className="p-4 sm:p-5">
        <label className="flex items-center gap-2 text-[12px] text-zinc-700 dark:text-zinc-200">
          <input type="checkbox" checked={on} onChange={(e) => setOn(e.target.checked)} /> Governor enabled
        </label>
        <div className={`mt-3 grid gap-3 sm:grid-cols-2 ${on ? "" : "opacity-40"}`}>
          <label className="text-[11px] text-zinc-500">
            Budget per run: <b className="text-zinc-800 dark:text-zinc-100">${budget.toFixed(2)}</b>
            <input type="range" min={0.01} max={0.5} step={0.01} value={budget} disabled={!on} onChange={(e) => setBudget(Number(e.target.value))} className="block w-full" />
          </label>
          <label className="text-[11px] text-zinc-500">
            Step cap: <b className="text-zinc-800 dark:text-zinc-100">{maxSteps}</b>
            <input type="range" min={2} max={30} value={maxSteps} disabled={!on} onChange={(e) => setMaxSteps(Number(e.target.value))} className="block w-full" />
          </label>
        </div>

        <div className="mt-4 flex h-24 items-end gap-[2px]" aria-hidden="true">
          {Array.from({ length: STUCK_AT }, (_, n) => {
            const r = rows[n];
            return (
              <span
                key={n}
                className={`flex-1 rounded-t ${r ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-800"}`}
                style={{ height: r ? `${Math.max((r.cost / 0.6) * 100, 4)}%` : "4%" }}
              />
            );
          })}
        </div>
        <p className="mt-2 text-[13px] text-zinc-700 dark:text-zinc-200">
          {rows.length} step{rows.length === 1 ? "" : "s"} · spent <b>${peak.toFixed(3)}</b>
        </p>
        {stop && <p className="mt-1 text-[12px] text-amber-600 dark:text-amber-400">{stop}</p>}
        <p className="mt-2 text-[11px] text-zinc-400">Context grows each turn, so the cost of each step rises. A stuck loop is quadratic, not linear.</p>
      </div>
    </figure>
  );
}
