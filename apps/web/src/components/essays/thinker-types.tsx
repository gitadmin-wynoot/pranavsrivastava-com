"use client";

import { useState } from "react";

/*
  ThinkerTypes — because there is no single recipe. Pick the head you actually
  have, and get the two or three moves that suit it, plus the failure mode to
  watch. Not a personality test; a way to start from your grain, not against it.
*/

type Type = {
  emoji: string;
  name: string;
  ethos: string;
  accent: string;
  moves: string[];
  watch: string;
};

const TYPES: Type[] = [
  {
    emoji: "🔬",
    name: "The Analyst",
    ethos: "Reason it down to the studs, then build back up.",
    accent: "border-blue-500/40 bg-blue-500/5",
    moves: ["First principles", "Second-order (\"and then what?\")", "Pre-mortem"],
    watch: "Analysis paralysis. Set a deadline to stop reasoning and start shipping — a decision you never test is just a nicer opinion.",
  },
  {
    emoji: "🧭",
    name: "The Explorer",
    ethos: "Collect dots from far away; the connection is the product.",
    accent: "border-violet-500/40 bg-violet-500/5",
    moves: ["Analogy & blend", "Recombine", "Broker weak ties"],
    watch: "Shiny-object drift. Widen inputs on purpose, but commit to finishing one recombination before chasing the next.",
  },
  {
    emoji: "🔨",
    name: "The Maker",
    ethos: "Build to think. The prototype is the argument.",
    accent: "border-amber-500/40 bg-amber-500/5",
    moves: ["Constrain on purpose", "Recombine", "Pre-mortem"],
    watch: "Motion mistaken for progress. Every few builds, stop and ask what you're actually learning, or you'll ship fast in the wrong direction.",
  },
  {
    emoji: "🌉",
    name: "The Connector",
    ethos: "Stand between two worlds and translate.",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    moves: ["Broker weak ties", "Analogy & blend", "Beginner's mind"],
    watch: "Idea-rich, execution-poor. Pair with a Maker, or force yourself to carry one bridge all the way across.",
  },
];

export function ThinkerTypes() {
  const [i, setI] = useState(0);
  const t = TYPES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        No single recipe — start from the head you actually have
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {TYPES.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name.replace("The ", "")}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${t.accent}`}>
          <div className="flex items-baseline gap-2">
            <span aria-hidden="true" className="text-lg">{t.emoji}</span>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{t.name}</h4>
          </div>
          <p className="mt-1 text-sm font-medium italic text-zinc-700 dark:text-zinc-300">&ldquo;{t.ethos}&rdquo;</p>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Your three moves</p>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {t.moves.map((mv) => (
              <span key={mv} className="rounded-full border border-zinc-300/70 dark:border-zinc-700 px-2 py-0.5 text-[11px] text-zinc-600 dark:text-zinc-300">
                {mv}
              </span>
            ))}
          </div>

          <p className="mt-3 border-t border-zinc-200/70 dark:border-zinc-800 pt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-rose-600 dark:text-rose-400">Watch out: </span>{t.watch}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Most people are a blend of two. The point isn't the label — it's to stop borrowing someone else's method and start with the grain of your own mind.
        </p>
      </div>
    </figure>
  );
}
