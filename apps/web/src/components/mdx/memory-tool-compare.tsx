"use client";

import { useState } from "react";

/*
  MemoryToolCompare — the actual landscape of memory approaches people reach
  for, compared on the same four questions: how it works, what it's good at,
  what it costs you, and when to pick it. Architect-voice, not a marketing
  comparison chart. SSR-stable, no API.
*/

type Tool = {
  emoji: string;
  name: string;
  accent: string;
  how: string;
  goodAt: string;
  cost: string;
  pickWhen: string;
};

const TOOLS: Tool[] = [
  {
    emoji: "🗂️",
    name: "claude-mem",
    accent: "border-blue-500/40 bg-blue-500/5",
    how: "Sits on Claude Code as hooks: at the end of a session it summarises what happened, embeds and stores the summary locally, and at the start of a new session it searches that store for anything relevant and quietly injects it back into context.",
    goodAt: "Personal, single-user continuity across coding sessions — 'we decided against that library last week' without you repeating yourself.",
    cost: "Local-only by default, so it's not a fit for a multi-user product. You're trusting an automatic summariser to decide what mattered.",
    pickWhen: "You're one person, working across many sessions, and the thing you want remembered is your own working context — not something you're serving to other users.",
  },
  {
    emoji: "🧩",
    name: "mem0",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    how: "A memory layer you call from your own app: you push facts and conversation turns in, it extracts and de-duplicates the durable bits, and you query it back by meaning per user or session.",
    goodAt: "Multi-user products that need per-user semantic memory — 'this customer prefers window seats' — without you hand-rolling the extraction and dedup logic.",
    cost: "Another moving part and, for the hosted version, another vendor and another place your users' data lives.",
    pickWhen: "You're building a product with many end users, each needing their own remembered preferences and facts, and you don't want to write the extraction pipeline yourself.",
  },
  {
    emoji: "🗄️",
    name: "Letta (formerly MemGPT)",
    accent: "border-violet-500/40 bg-violet-500/5",
    how: "Treats the agent like an OS process with its own virtual memory: a small 'in-context' working set the model can read directly, and a much larger external store it can explicitly page in and out of, on its own initiative.",
    goodAt: "Long-running, autonomous agents that need to actively manage what they know is relevant, not just passively receive it.",
    cost: "More moving parts and more agency handed to the model over its own memory — powerful, and harder to fully predict.",
    pickWhen: "The agent runs for a long time, accumulates a lot, and genuinely benefits from deciding for itself what to keep close and what to file away.",
  },
  {
    emoji: "🧮",
    name: "LangGraph checkpointer",
    accent: "border-amber-500/40 bg-amber-500/5",
    how: "Not memory in the RAG sense at all — a durable snapshot of an agent's exact execution state, so a paused or crashed workflow resumes exactly where it left off. (The whole subject of the Serverless Memory Table course.)",
    goodAt: "Correctness and durability for workflows that pause — human approval, long-running jobs, anything that must survive a restart.",
    cost: "Solves 'don't lose your place,' not 'remember the user.' You'll still want one of the above for that.",
    pickWhen: "Your agent has to pause and resume reliably — the state, not the semantic memory, is the thing you can't afford to lose.",
  },
  {
    emoji: "💬",
    name: "Built-in provider memory",
    accent: "border-rose-500/40 bg-rose-500/5",
    how: "The consumer memory features in ChatGPT and Claude.ai: the product itself watches the conversation, decides what to keep, and quietly carries it into future chats for that account.",
    goodAt: "Zero engineering. It's already there, for that one product, for that one user.",
    cost: "You don't control it — no visibility into the extraction logic, no way to plug it into your own app, and it lives inside someone else's product.",
    pickWhen: "You're a user of the product, not a builder of one. As an architecture choice for something you're shipping, it usually isn't one.",
  },
];

export function MemoryToolCompare() {
  const [i, setI] = useState(0);
  const t = TOOLS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The landscape — and when to actually reach for each
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {TOOLS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${t.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{t.emoji}</span> {t.name}
          </h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">How it works</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{t.how}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Good at</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{t.goodAt}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">What it costs you</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{t.cost}</p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">Pick this when: </span>{t.pickWhen}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Most production systems end up combining two of these, not picking one — a checkpointer for durability and a semantic store for what the user actually cares about. Details and version specifics move fast; check each project's own docs before you build on them.
        </p>
      </div>
    </figure>
  );
}
