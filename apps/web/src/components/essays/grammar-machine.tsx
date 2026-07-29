"use client";

import { useState } from "react";

/*
  GrammarMachine — the parts of Pāṇini's Aṣṭādhyāyī, each next to the modern
  computing idea it prefigures. Not a claim that Pāṇini "had computers"; a claim
  that the architecture of a formal, rule-driven system was already all here.
  SSR-stable, no API.
*/

type Part = {
  name: string;
  sanskrit: string;
  accent: string;
  ancient: string;
  modern: string;
};

const PARTS: Part[] = [
  {
    name: "The rules",
    sanskrit: "sūtra",
    accent: "border-blue-500/40 bg-blue-500/5",
    ancient: "Around 4,000 terse, ordered rules that derive every valid word from roots and affixes — not a description of the language, a procedure that generates it.",
    modern: "The production rules of a formal grammar — or the functions of a program that, run in order, build an output.",
  },
  {
    name: "The markers",
    sanskrit: "anubandha (it)",
    accent: "border-violet-500/40 bg-violet-500/5",
    ancient: "Silent tag-letters attached to roots and affixes carry grammatical properties, steer which rules fire, then are stripped before the final form.",
    modern: "Type annotations, flags, or metadata — invisible in the output, decisive in the processing.",
  },
  {
    name: "The rules about rules",
    sanskrit: "paribhāṣā",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    ancient: "Metarules that govern how the ordinary rules are read and applied — scope, interpretation, and what to do when two rules both want to fire.",
    modern: "The interpreter and evaluation semantics — the meta-layer that says how the code itself is executed.",
  },
  {
    name: "Special beats general",
    sanskrit: "apavāda / vipratiṣedha",
    accent: "border-amber-500/40 bg-amber-500/5",
    ancient: "A specific rule overrides the general one; when rules genuinely conflict, a stated principle decides which wins.",
    modern: "Specificity and precedence — method overriding, the CSS cascade, the \"most specific match\" that every rule engine needs.",
  },
  {
    name: "Feeding and economy",
    sanskrit: "laghava",
    accent: "border-sky-500/40 bg-sky-500/5",
    ancient: "Rules feed each other's output, and the whole grammar is compressed to the shortest possible statement — brevity prized almost as a sacred value.",
    modern: "Recursion and function composition, plus the minimum-description-length ideal: the shortest program that produces the language.",
  },
  {
    name: "The sound index",
    sanskrit: "pratyāhāra",
    accent: "border-rose-500/40 bg-rose-500/5",
    ancient: "The Śiva Sūtras order every phoneme so any natural class can be named by two symbols — a start and a marker.",
    modern: "A clever index or bitmask over an ordered set: a range query that turns a whole category into an O(1) lookup.",
  },
];

export function GrammarMachine() {
  const [i, setI] = useState(0);
  const p = PARTS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The machine's parts — and what each one became
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {PARTS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${p.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{p.name}</h4>
            <span className="text-[12px] italic text-zinc-400">{p.sanskrit}</span>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-white/60 dark:bg-zinc-900/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">In the grammar</p>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.ancient}</p>
            </div>
            <div className="rounded-lg bg-white/60 dark:bg-zinc-900/50 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">In computing</p>
              <p className="mt-1 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.modern}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          None of this means Pāṇini imagined a computer. It means the <em>architecture</em> of a formal, rule-driven, self-referential system was fully worked out — for a language — millennia before we built machines that needed the same ideas.
        </p>
      </div>
    </figure>
  );
}
