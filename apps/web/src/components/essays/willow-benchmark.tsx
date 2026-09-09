"use client";

import { useState } from "react";

/*
  WillowBenchmark — Google's December 2024 chip, in its own two headline
  claims, each with the honest caveat attached. Framed as Google's claims,
  not settled universal fact — quantum "supremacy" claims have a real history
  of being contested (IBM's 2019 response to Sycamore), which is worth saying
  out loud rather than passing along uncritically. SSR-stable, no API.
*/

type Claim = {
  emoji: string;
  name: string;
  accent: string;
  headline: string;
  headline2?: string;
  meaning: string;
  caveat: string;
};

const CLAIMS: Claim[] = [
  {
    emoji: "📉",
    name: "Below threshold",
    accent: "border-blue-500/40 bg-blue-500/5",
    headline: "Add more physical qubits to encode one 'logical' qubit, and the error rate went down, not up — for the first time.",
    meaning: "This is the result quantum error correction theory predicted was possible since the 1990s, and nobody had shown experimentally: scaling actually helps, rather than just accumulating more chances to fail.",
    caveat: "It's a threshold crossed, not the finish line — a fully fault-tolerant, million-qubit quantum computer is still a hardware-engineering marathon away.",
  },
  {
    emoji: "⏱️",
    name: "Random circuit sampling",
    accent: "border-violet-500/40 bg-violet-500/5",
    headline: "Willow's 105 qubits ran a benchmark task in under five minutes that Google estimated would take one of today's fastest supercomputers about ten septillion years.",
    headline2: "(10,000,000,000,000,000,000,000,000 years — roughly a trillion times the current age of the universe.)",
    meaning: "The task itself is, fittingly, about randomness: run a specific quantum circuit and check that the statistical pattern of outputs matches what quantum mechanics predicts — a pattern that's exponentially hard to fake by simulating on ordinary hardware.",
    caveat: "This lineage of claim has real history of getting contested — IBM pushed back hard on Google's original 2019 'quantum supremacy' claim, arguing a classical supercomputer could do it faster than Google estimated. Treat the number as Google's own estimate, not an uncontested law of nature.",
  },
];

export function WillowBenchmark() {
  const [i, setI] = useState(1);
  const c = CLAIMS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Willow's two headline claims — and the honest caveat on each
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex gap-1.5">
          {CLAIMS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${c.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{c.emoji}</span> {c.name}
          </h4>
          <p className="mt-2 text-[14px] font-medium leading-relaxed text-zinc-800 dark:text-zinc-100">{c.headline}</p>
          {c.headline2 && <p className="mt-1 text-[11px] text-zinc-400">{c.headline2}</p>}
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">What it actually means</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.meaning}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">The honest caveat</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.caveat}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Both are Google's own published claims (Nature, December 2024) — genuinely significant, and still claims by the company that built the chip, which is exactly the situation that calls for the second column above.
        </p>
      </div>
    </figure>
  );
}
