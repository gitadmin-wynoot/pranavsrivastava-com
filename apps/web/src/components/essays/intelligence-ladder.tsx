"use client";

import { useState } from "react";

/*
  IntelligenceLadder — narrow AI, AGI, ASI, defined plainly with what would
  actually have to be true for each, and how contested that bar is. Honest
  about disagreement, including whether "AGI" is even a coherent target.
  SSR-stable, no API.
*/

type Stage = {
  emoji: string;
  name: string;
  accent: string;
  def: string;
  bar: string;
  contested: string;
};

const STAGES: Stage[] = [
  {
    emoji: "🎯",
    name: "Narrow AI",
    accent: "border-blue-500/40 bg-blue-500/5",
    def: "Excellent at a bounded task, useless outside it. A chess engine can't hold a conversation; a language model, until recently, couldn't play chess well without being told the rules in the prompt.",
    bar: "Already achieved, and has been for decades — the entire industry runs on this today.",
    contested: "Barely contested. The interesting argument is whether today's large models are still 'narrow' underneath a very wide-looking surface.",
  },
  {
    emoji: "🌐",
    name: "AGI",
    accent: "border-violet-500/40 bg-violet-500/5",
    def: "Artificial General Intelligence — a system that can learn and reason across essentially any domain a human can, not just the ones it was explicitly trained on.",
    bar: "No agreed test exists. Candidates include: matching human performance across a very wide battery of tasks, or transferring skill to a genuinely novel domain with no task-specific training.",
    contested: "Heavily. Some researchers think today's frontier models are close; others think the whole framing smuggles in an assumption — that intelligence is one dial — which may simply be wrong.",
  },
  {
    emoji: "🚀",
    name: "ASI",
    accent: "border-amber-500/40 bg-amber-500/5",
    def: "Artificial Superintelligence — I. J. Good's 1965 idea of a machine that surpasses human intelligence at essentially everything, including the task of improving itself.",
    bar: "Undefined by construction — 'surpassing' a moving target (us) that itself keeps changing what it means to be capable.",
    contested: "The most contested of the three. Whether it follows quickly from AGI (a 'take-off'), slowly, or not in any coherent sense at all, is a live and genuinely unresolved argument among serious people.",
  },
];

export function IntelligenceLadder() {
  const [i, setI] = useState(1);
  const s = STAGES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Three words people use loosely — pick one
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-1.5">
          {STAGES.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className="group flex-1 text-left"
              aria-label={x.name}
            >
              <div className={`h-1.5 rounded-full transition-opacity ${idx === i ? "bg-violet-500 opacity-100" : "bg-zinc-200 dark:bg-zinc-700 opacity-100"}`} />
              <div className="mt-2 flex items-center gap-1">
                <span aria-hidden="true" className="text-sm">{x.emoji}</span>
                <span className={`text-[11px] font-medium leading-tight ${idx === i ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
                  {x.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{s.emoji}</span> {s.name}
          </h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Definition</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.def}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">Where the bar actually is</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.bar}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">How contested this is</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.contested}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Notice the pattern: the closer you get to the frontier, the less agreement there is on what would even count as arriving. That is itself a fact worth sitting with.
        </p>
      </div>
    </figure>
  );
}
