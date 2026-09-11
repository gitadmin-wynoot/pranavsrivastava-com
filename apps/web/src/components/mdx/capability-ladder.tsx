"use client";

import { useState } from "react";

/*
  CapabilityLadder — the unifying visual for the course: each rung adds real
  capability, and each rung adds real cost and complexity. The discipline is
  climbing only as far as the problem actually requires. Cost multipliers
  are illustrative order-of-magnitude framing, not precise pricing — real
  numbers move too fast and vary too much by provider to hardcode.
  SSR-stable, no API.
*/

type Rung = {
  emoji: string;
  name: string;
  accent: string;
  adds: string;
  costNote: string;
  skipIf: string;
};

const RUNGS: Rung[] = [
  {
    emoji: "💬",
    name: "One model call",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    adds: "Send a prompt, get an answer. The baseline every other rung sits on top of.",
    costNote: "1× — your baseline unit of cost.",
    skipIf: "This is the floor, not something to skip.",
  },
  {
    emoji: "🔍",
    name: "+ RAG",
    accent: "border-blue-500/40 bg-blue-500/5",
    adds: "Ground the answer in your real, private, current documents instead of the model's memory.",
    costNote: "~1.2–2× — one retrieval step plus a longer prompt (the retrieved context).",
    skipIf: "Skip if the model's general knowledge is genuinely enough, and nothing private or current is needed.",
  },
  {
    emoji: "🛠️",
    name: "+ Tools",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    adds: "Let the model actually do something — check a database, send an email, issue a refund — not just describe it.",
    costNote: "~1.5–3× — each tool call is its own request, sometimes chained.",
    skipIf: "Skip if the answer is purely informational and nothing needs to actually happen.",
  },
  {
    emoji: "🔌",
    name: "+ MCP",
    accent: "border-violet-500/40 bg-violet-500/5",
    adds: "Standardise how tools are connected, instead of hand-wiring a custom integration per tool — a protocol, not a new cost centre by itself.",
    costNote: "~same as Tools — MCP is an integration-effort saving, not a token-cost change.",
    skipIf: "Skip a custom MCP server if a well-maintained public one already covers what you need.",
  },
  {
    emoji: "🔁",
    name: "+ Agent loop",
    accent: "border-amber-500/40 bg-amber-500/5",
    adds: "Let the model plan, act, observe, and repeat across multiple steps toward a goal, instead of one shot.",
    costNote: "~3–10×+ — every loop iteration is another full model call; this is where cost can run away fastest.",
    skipIf: "Skip if the task reliably finishes in one or two calls — most tasks do.",
  },
  {
    emoji: "🧠",
    name: "+ Memory",
    accent: "border-rose-500/40 bg-rose-500/5",
    adds: "Remember facts or context across sessions, not just within one conversation.",
    costNote: "~small ongoing storage cost + a retrieval step per turn — cheap compared to the alternative (re-explaining everything, every time).",
    skipIf: "Skip if every session is genuinely independent, with nothing worth carrying forward.",
  },
  {
    emoji: "🎒",
    name: "+ Skills",
    accent: "border-sky-500/40 bg-sky-500/5",
    adds: "Package a repeatable capability — instructions, resources, and scripts together — so the model doesn't relearn the same expert process from scratch every time.",
    costNote: "~near-zero marginal cost — mostly a one-time authoring effort, not a per-request cost.",
    skipIf: "Skip if the task is a one-off, not something you'll ask for repeatedly.",
  },
];

export function CapabilityLadder() {
  const [i, setI] = useState(0);
  const r = RUNGS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Climb only as far as the problem needs
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {RUNGS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${r.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{r.emoji}</span> {r.name}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{r.adds}</p>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] font-mono text-zinc-800 dark:text-zinc-100">
            Relative cost: {r.costNote}
          </p>
          <p className="mt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-200">When to skip this rung: </span>{r.skipIf}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Cost multipliers here are illustrative order-of-magnitude framing, not price quotes — actual pricing moves too fast to hardcode. The shape is what matters: agent loops are usually where cost surprises come from, not the layer people worry about most (RAG).
        </p>
      </div>
    </figure>
  );
}
