"use client";

import { useState } from "react";

/*
  MemoryIndustryMap — the same four memory types (working/episodic/semantic/
  procedural), grounded in a specific industry each, so "memory" stops being
  abstract. Architect voice: what breaks without it, in a system that
  actually ships. SSR-stable, no API.
*/

type Industry = {
  emoji: string;
  name: string;
  accent: string;
  system: string;
  memoryUsed: string;
  withoutIt: string;
};

const INDUSTRIES: Industry[] = [
  {
    emoji: "🏦",
    name: "Banking",
    accent: "border-blue-500/40 bg-blue-500/5",
    system: "A relationship-manager copilot that prepares a client briefing before every call.",
    memoryUsed: "Semantic (risk profile, product holdings) + episodic (the last three conversations and what was promised).",
    withoutIt: "The banker re-asks questions the client already answered twice — the single fastest way to make someone feel like a number.",
  },
  {
    emoji: "💰",
    name: "Finance",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    system: "An analyst assistant tracking a portfolio thesis across weeks of research.",
    memoryUsed: "Episodic (what was concluded last Tuesday, and why) + procedural (the firm's own valuation playbook).",
    withoutIt: "Every session restarts the analysis from zero — no compounding insight, just repeated first drafts.",
  },
  {
    emoji: "🏥",
    name: "Healthcare",
    accent: "border-rose-500/40 bg-rose-500/5",
    system: "A clinical scribe that carries context across a patient's visits.",
    memoryUsed: "Semantic (allergies, chronic conditions) + episodic (what changed since the last visit) — never working memory alone; too much is at stake to only hold it for one conversation.",
    withoutIt: "A patient repeats their history at every visit, and anything not written on the current chart is invisible to the system.",
  },
  {
    emoji: "📡",
    name: "Telecom",
    accent: "border-violet-500/40 bg-violet-500/5",
    system: "A support agent handling a network outage complaint.",
    memoryUsed: "Episodic (this is the customer's third call this week) escalating procedural behaviour (skip the troubleshooting script, go straight to a technician).",
    withoutIt: "The customer relives the same diagnostic script every call, and a pattern that should trigger escalation never gets noticed.",
  },
  {
    emoji: "📦",
    name: "Logistics",
    accent: "border-amber-500/40 bg-amber-500/5",
    system: "A dispatch agent rerouting shipments around a customs delay.",
    memoryUsed: "Procedural (always check customs status before rerouting) + working memory (the live state of this one shipment, right now).",
    withoutIt: "The agent reroutes confidently around a problem it doesn't know still exists, because nothing told it to check.",
  },
  {
    emoji: "📣",
    name: "Marketing",
    accent: "border-sky-500/40 bg-sky-500/5",
    system: "A campaign assistant that keeps brand voice and past campaign results consistent across a team.",
    memoryUsed: "Semantic (brand guidelines, what performed well) more than episodic — the facts matter more than any one conversation.",
    withoutIt: "Every new brief reinvents the voice from scratch, and nobody remembers that the last three 'clever' taglines already tested badly.",
  },
];

export function MemoryIndustryMap() {
  const [i, setI] = useState(0);
  const it = INDUSTRIES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Memory, in a system that actually ships — pick an industry
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {INDUSTRIES.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${it.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{it.emoji}</span> {it.name}
          </h4>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{it.system}</p>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Memory it actually needs</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{it.memoryUsed}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">What breaks without it</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{it.withoutIt}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Different industries, the same four memory types underneath — the design work is always figuring out which mix a given system actually needs, not building all four by default.
        </p>
      </div>
    </figure>
  );
}
