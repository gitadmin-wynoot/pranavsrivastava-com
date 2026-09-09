"use client";

import { useState } from "react";

/*
  MemoryTaxonomy — the four jobs "memory" does for an AI system, borrowed
  from cognitive science (working / episodic / semantic / procedural) because
  it's the taxonomy the actual memory literature (MemGPT, Letta, mem0) uses
  too. Each with an everyday human parallel and the technical equivalent.
  SSR-stable, no API.
*/

type Kind = {
  emoji: string;
  name: string;
  accent: string;
  human: string;
  ai: string;
  lives: string;
  example: string;
};

const KINDS: Kind[] = [
  {
    emoji: "🧠",
    name: "Working memory",
    accent: "border-blue-500/40 bg-blue-500/5",
    human: "What you're holding in your head right now, mid-conversation — the last few things said, the task at hand.",
    ai: "The context window. Everything in the current prompt: system instructions, chat history, retrieved documents, tool results.",
    lives: "In the request itself — gone the instant the call ends.",
    example: "A support agent mid-ticket, tracking what the customer just said three messages ago.",
  },
  {
    emoji: "📅",
    name: "Episodic memory",
    accent: "border-violet-500/40 bg-violet-500/5",
    human: "What happened, and when — yesterday's meeting, last month's argument, the specific conversation you had.",
    ai: "A log of past sessions/events, usually summarised and stored so it can be searched and re-injected later.",
    lives: "A database or vector store, keyed by time and session — claude-mem's whole job (chapter 4).",
    example: "A bank's advisor bot recalling that a customer called about a fraud dispute two weeks ago, without re-reading the transcript.",
  },
  {
    emoji: "📚",
    name: "Semantic memory",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    human: "Facts you just know — your colleague's name, the company's return policy, what a P&L statement is.",
    ai: "Stable knowledge and preferences, detached from any one conversation — 'this user prefers metric units,' 'our refund window is 30 days.'",
    lives: "A vector store or structured profile, retrieved by meaning (RAG) rather than by time.",
    example: "A telco assistant that knows a customer is on a business plan and always skips the consumer-tier upsell.",
  },
  {
    emoji: "🛠️",
    name: "Procedural memory",
    accent: "border-amber-500/40 bg-amber-500/5",
    human: "How to do things — riding a bike, running a familiar process — skill that doesn't need conscious recall.",
    ai: "Learned behaviour baked into instructions, tools, or fine-tuning: the agent's playbook for a recurring task.",
    lives: "System prompts, tool definitions, and few-shot examples — rarely a database at all.",
    example: "A logistics agent that always checks customs status before rerouting a shipment, every time, without being told.",
  },
];

export function MemoryTaxonomy() {
  const [i, setI] = useState(0);
  const k = KINDS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Four jobs, all called "memory" — pick one
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {KINDS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${k.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{k.emoji}</span> {k.name}
          </h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">In a person</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{k.human}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">In an AI system</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{k.ai}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Where it actually lives</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{k.lives}</p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">Example: </span>{k.example}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Most systems people call "an AI with memory" are really only doing one or two of these four jobs. Knowing which one you actually need is most of the design decision.
        </p>
      </div>
    </figure>
  );
}
