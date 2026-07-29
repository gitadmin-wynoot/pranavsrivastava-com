"use client";

import { useMemo, useState } from "react";

/*
  FibonacciRhythms — mātrā-vṛtta, metres counted by duration, not syllable count.
  A light syllable lasts 1 beat, a heavy one lasts 2. Ask how many rhythms fill
  exactly n beats and the answer is a Fibonacci number — because a rhythm of n
  beats ends in either a 1 (leaving n−1) or a 2 (leaving n−2). This recurrence
  was written down by Indian prosodists (Virahāṅka, Gopāla, Hemachandra) before
  Fibonacci. SSR-stable, no API.
*/

// All compositions of n using parts {1, 2}, in a tidy order.
function rhythms(n: number): number[][] {
  if (n === 0) return [[]];
  if (n < 0) return [];
  const out: number[][] = [];
  for (const r of rhythms(n - 1)) out.push([1, ...r]);
  for (const r of rhythms(n - 2)) out.push([2, ...r]);
  return out;
}

const FIB = [1, 2, 3, 5, 8, 13]; // counts for n = 1..6

export function FibonacciRhythms() {
  const [n, setN] = useState(4);
  const list = useMemo(() => rhythms(n), [n]);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Rhythms of n beats (short = 1, long = 2) — count them
      </div>

      <div className="p-4 sm:p-5">
        {/* beat selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">beats</span>
          {[1, 2, 3, 4, 5, 6].map((opt) => (
            <button
              key={opt}
              onClick={() => setN(opt)}
              className={`h-7 w-7 rounded-lg border text-xs font-semibold transition-colors ${opt === n ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"}`}
            >
              {opt}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-zinc-400">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">{list.length}</span> rhythms
          </span>
        </div>

        {/* the rhythms */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
          {list.map((r, i) => (
            <div key={i} className="flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-900/40 px-2.5 py-1.5">
              {r.map((beat, k) => (
                <span
                  key={k}
                  className={`inline-block h-3 rounded-full ${beat === 2 ? "w-7 bg-violet-500" : "w-3 bg-emerald-500"}`}
                  aria-hidden="true"
                />
              ))}
              <span className="ml-auto font-mono text-[10px] text-zinc-400">{r.join("·")}</span>
            </div>
          ))}
        </div>

        {/* fibonacci strip */}
        <p className="mt-4 mb-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          the counts, as you add beats
        </p>
        <div className="flex flex-wrap gap-1.5">
          {FIB.map((f, i) => {
            const active = i + 1 === n;
            return (
              <div
                key={i}
                className={`flex flex-col items-center rounded-lg border px-3 py-1.5 ${active ? "border-emerald-500 bg-emerald-500/10" : "border-zinc-200 dark:border-zinc-800"}`}
              >
                <span className="text-[10px] text-zinc-400">{i + 1} beat{i > 0 ? "s" : ""}</span>
                <span className={`text-sm font-bold ${active ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-500 dark:text-zinc-400"}`}>{f}</span>
              </div>
            );
          })}
          <div className="flex items-center px-1 text-zinc-300 dark:text-zinc-600 text-sm">→ …</div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 align-middle" /> short = 1 beat &nbsp;·&nbsp; <span className="inline-block h-2.5 w-6 rounded-full bg-violet-500 align-middle" /> long = 2 beats. The counts are <strong>1, 2, 3, 5, 8, 13…</strong> — the Fibonacci sequence, because every rhythm ends in a short (leaving n−1) or a long (leaving n−2). Counting music <em>is</em> the recurrence.
        </p>
      </div>
    </figure>
  );
}
