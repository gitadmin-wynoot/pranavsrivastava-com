"use client";

import { useState } from "react";

/*
  EvolutionLadder — Traditional Software -> AI Copilot -> Agents + MCP ->
  AGI/ASI, read through one lens: how much memory each stage needs to work
  at all, and what breaks without it. Deliberately hedged on the last rung —
  nobody knows the date, only the direction. SSR-stable, no API.
*/

type Stage = {
  emoji: string;
  name: string;
  era: string;
  accent: string;
  what: string;
  memory: string;
  example: string;
};

const STAGES: Stage[] = [
  {
    emoji: "🧮",
    name: "Traditional software",
    era: "and still most of it",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    what: "Deterministic code: given the same input, it does the same thing. No model, no ambiguity.",
    memory: "Explicit and total — a database row, a session variable. Nothing is remembered unless a developer wrote code to store it.",
    example: "A banking core system that posts a transaction exactly the same way every time, forever.",
  },
  {
    emoji: "💬",
    name: "AI copilot",
    era: "roughly 2022 onward",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "A model suggests, a human decides. One request in, one response out — genuinely useful, but it forgets you the second the tab closes.",
    memory: "Just the context window. 'Memory' is really just not having closed the chat yet.",
    example: "Asking a coding assistant to draft a function, then explaining the whole codebase again tomorrow.",
  },
  {
    emoji: "🔧",
    name: "Agents + MCP",
    era: "roughly 2024 onward — where most production work sits today",
    accent: "border-violet-500/40 bg-violet-500/5",
    what: "The model can now call tools, take multiple steps, and reach real systems through a standard protocol (MCP) instead of one-off integrations.",
    memory: "Suddenly load-bearing. An agent that plans five steps and pauses for approval has to remember exactly where it stopped — this is the entire subject of the memory course you're reading now.",
    example: "A logistics agent that reroutes a shipment, waits for a human sign-off, and resumes correctly hours later.",
  },
  {
    emoji: "🌐",
    name: "AGI / ASI",
    era: "direction, not a date — see the essay",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "General intelligence across domains (AGI), and beyond that, intelligence that exceeds our own in most of them (ASI). Serious researchers disagree by decades on timing, and some doubt the framing itself.",
    memory: "The open research problem. Continuous learning, a persistent self-model, memory that compounds across a lifetime rather than a session — the un-solved rung above everything in this course.",
    example: "Not a product yet. A research direction, and the subject of Notes from the Winter, part five.",
  },
];

export function EvolutionLadder() {
  const [i, setI] = useState(2);
  const s = STAGES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Four rungs, read through what each needs to remember
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
              <div className={`h-1.5 rounded-full transition-opacity ${idx <= i ? "bg-blue-500" : "bg-zinc-200 dark:bg-zinc-700"} ${idx === i ? "opacity-100" : idx < i ? "opacity-50" : "opacity-100"}`} />
              <div className="mt-2 flex items-center gap-1">
                <span aria-hidden="true" className="text-sm">{x.emoji}</span>
                <span className={`text-[11px] font-medium leading-tight ${idx === i ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}>
                  {x.name.split(" ")[0]}
                </span>
              </div>
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{s.emoji}</span> {s.name}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400 text-right">{s.era}</span>
          </div>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">What it is</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.what}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">What it needs to remember</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.memory}</p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            {s.example}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Notice the pattern: every rung up this ladder needed strictly more memory than the one before it to actually work. That is not a coincidence — it is most of what this course is about.
        </p>
      </div>
    </figure>
  );
}
