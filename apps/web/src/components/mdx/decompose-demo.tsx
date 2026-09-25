"use client";

import { useState } from "react";

/*
  DecomposeDemo — the one worked example with real numbers: 2,000 phishing
  emails. Figures from an independent write-up (Beri, Sept 2026), based on a
  dataset with synthetic bodies and labels from URL reputation feeds.
*/

const ACC = [
  { name: "Jev, one question", v: 62.6, kind: "one" },
  { name: "Claude Haiku 4.5, one question", v: 81.3, kind: "one" },
  { name: "Jev, five signals + fitted weights", v: 95.0, kind: "five" },
  { name: "Haiku, five signals + fitted weights", v: 93.2, kind: "five" },
  { name: "Two-line regex", v: 91.8, kind: "base" },
];
const COST = [
  { name: "Jev, five signals", v: 0.038 },
  { name: "Haiku, one verdict", v: 0.462 },
  { name: "Haiku, five signals", v: 1.02 },
];

export function DecomposeDemo() {
  const [tab, setTab] = useState<"acc" | "cost">("acc");
  const rows = tab === "acc" ? ACC : COST.map((c) => ({ ...c, kind: "cost" }));
  const max = tab === "acc" ? 100 : 1.1;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        2,000 phishing emails: ask once, or ask five small questions?
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex gap-1.5">
          {(["acc", "cost"] as const).map((k) => (
            <button key={k} onClick={() => setTab(k)} className={`rounded-full border px-2.5 py-1 text-[11px] ${tab === k ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500"}`}>
              {k === "acc" ? "Accuracy" : "Cost per 1,000 emails"}
            </button>
          ))}
        </div>
        <ul className="mt-4 space-y-2.5">
          {rows.map((r) => (
            <li key={r.name}>
              <div className="flex justify-between text-[12px] text-zinc-700 dark:text-zinc-200"><span>{r.name}</span><b>{tab === "acc" ? `${r.v}%` : `$${r.v.toFixed(3)}`}</b></div>
              <div className="mt-1 h-3 rounded bg-zinc-200 dark:bg-zinc-800">
                <div className={`h-3 rounded ${r.kind === "base" ? "bg-zinc-500" : r.kind === "one" ? "bg-rose-500" : r.kind === "five" ? "bg-emerald-500" : "bg-blue-500"}`} style={{ width: `${(r.v / max) * 100}%` }} />
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
          {tab === "acc"
            ? "Asked once, Jev caught only 43.2% of the phishing emails and wrongly flagged 18.0% of the legitimate ones. Split into five narrow questions, with a logistic regression fitted on 1,000 labelled emails and scored on the other 1,000, it reached 95.0%. The gap to Haiku (93.2%) was not statistically significant (p = 0.063), and a two-line regex got 91.8%."
            : "At list price Jev cost $0.038 per 1,000 emails: about 12 times cheaper than Haiku for one verdict and 27 times cheaper for five signals. The whole pre-registered study, 5,721 calls, cost $0.176."}
        </div>
        <p className="mt-3 text-[12px] font-medium text-zinc-800 dark:text-zinc-100">&ldquo;The 95% is not Jev. It is Jev plus your labelled data plus a regression you maintain.&rdquo;</p>
        <p className="mt-1 text-[10px] text-zinc-400">One dataset with synthetic email bodies, one author&rsquo;s study, September 2026. Interesting and cheap to repeat, not a general result.</p>
      </div>
    </figure>
  );
}
