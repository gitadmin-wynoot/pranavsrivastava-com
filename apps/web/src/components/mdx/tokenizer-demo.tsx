"use client";

import { useState } from "react";

/*
  TokenizerDemo — text isn't read letter-by-letter or word-by-word; it's
  chopped into "tokens," chunks somewhere in between, learned from data
  rather than dictionary rules. Includes the classic "strawberry" failure —
  the model doesn't see individual letters, so counting letters inside a
  word is a genuinely hard task for it, not a silly one. SSR-stable.
*/

type Example = {
  label: string;
  tokens: string[];
  note: string;
};

const EXAMPLES: Example[] = [
  {
    label: "An ordinary sentence",
    tokens: ["The", " cat", " sat", " on", " the", " mat", "."],
    note: "Common short words often get their own token — mostly one token per word here, seven tokens for seven \"units.\"",
  },
  {
    label: "A less common word",
    tokens: ["un", "believ", "able"],
    note: "“Unbelievable” isn’t common enough to earn its own token, so it splits into pieces the model has seen often — “un,” “believ,” “able” — each of which shows up constantly across other words too.",
  },
  {
    label: "Why “strawberry” trips models up",
    tokens: ["str", "aw", "berry"],
    note: "The model never actually sees the letters s-t-r-a-w-b-e-r-r-y one at a time — it sees three chunks. Asking it “how many r’s are in strawberry” is asking it to reconstruct spelling from chunks that don’t line up with letters. That’s a genuinely hard sub-task, not a silly mistake.",
  },
  {
    label: "The same sentence, in French",
    tokens: ["Le", " chat", " s’", "est", " ass", "is", " sur", " le", " tap", "is", "."],
    note: "Most tokenizers are trained mostly on English text, so other languages often split into more, smaller pieces for the same meaning — which is also why non-English use of these models can cost more per sentence and eats into the context window faster.",
  },
];

export function TokenizerDemo() {
  const [i, setI] = useState(0);
  const ex = EXAMPLES[i];
  const colors = [
    "bg-blue-500/15 text-blue-700 dark:text-blue-300",
    "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
    "bg-amber-500/15 text-amber-700 dark:text-amber-300",
    "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  ];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        How text actually gets chopped up
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {EXAMPLES.map((x, idx) => (
            <button
              key={x.label}
              onClick={() => setI(idx)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-0.5 text-[15px] leading-loose">
          {ex.tokens.map((t, idx) => (
            <span key={idx} className={`rounded px-1 py-0.5 font-mono ${colors[idx % colors.length]}`}>
              {t.replace(/’/g, "'")}
            </span>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-zinc-400">{ex.tokens.length} tokens</p>

        <p className="mt-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{ex.note}</p>
      </div>
    </figure>
  );
}
