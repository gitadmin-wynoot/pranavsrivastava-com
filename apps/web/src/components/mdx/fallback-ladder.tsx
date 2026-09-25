"use client";

import { useState } from "react";

/*
  FallbackLadder — knock out rungs and see where a request lands. The
  ladder degrades from best to safest; the last rung never fails.
*/

const RUNGS = [
  { name: "Primary model", result: "Full answer from the best model.", quality: 100 },
  { name: "Retry with backoff", result: "Same model, one more try after a short wait.", quality: 95 },
  { name: "Secondary provider", result: "A different provider's model answers. Slightly different style.", quality: 85 },
  { name: "Smaller / cached answer", result: "A cheaper model, or a stored answer to a near-identical question.", quality: 60 },
  { name: "Graceful refusal + human", result: "\"I can't answer this right now. I've passed it to a person and you'll hear back by tomorrow.\"", quality: 30 },
];

export function FallbackLadder() {
  const [down, setDown] = useState<boolean[]>([false, false, false, false, false]);
  const landed = RUNGS.findIndex((_, i) => !down[i] || i === RUNGS.length - 1);
  const r = RUNGS[landed];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Knock rungs out — where does the request land?
      </div>
      <div className="p-4 sm:p-5">
        <ol className="space-y-2">
          {RUNGS.map((x, i) => {
            const skipped = i < landed;
            const isLanding = i === landed;
            const last = i === RUNGS.length - 1;
            return (
              <li
                key={x.name}
                className={`flex items-center justify-between gap-3 rounded-xl border px-3 py-2 ${isLanding ? "border-emerald-500/50 bg-emerald-500/10" : skipped ? "border-rose-500/30 opacity-60" : "border-zinc-200 dark:border-zinc-800 opacity-50"}`}
              >
                <span className="text-[13px] text-zinc-800 dark:text-zinc-100">
                  {i + 1}. {x.name} {isLanding && <b className="ml-1 text-[10px] uppercase text-emerald-600">answers</b>}
                </span>
                {last ? (
                  <span className="text-[10px] text-zinc-400">always available</span>
                ) : (
                  <button
                    onClick={() => setDown((d) => d.map((v, n) => (n === i ? !v : v)))}
                    className={`rounded-full border px-2 py-0.5 text-[10px] ${down[i] ? "border-rose-500 text-rose-600" : "border-zinc-300 dark:border-zinc-700 text-zinc-500"}`}
                  >
                    {down[i] ? "down ✕" : "healthy"}
                  </button>
                )}
              </li>
            );
          })}
        </ol>
        <div className="mt-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
          <p className="text-[13px] text-zinc-700 dark:text-zinc-200">{r.result}</p>
          <div className="mt-2 h-2 rounded-full bg-zinc-200 dark:bg-zinc-800">
            <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${r.quality}%` }} />
          </div>
          <p className="mt-1 text-[11px] text-zinc-400">Answer quality: {r.quality}%. It degrades in steps instead of falling off a cliff.</p>
        </div>
      </div>
    </figure>
  );
}
