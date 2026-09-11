"use client";

import { useState } from "react";

/*
  StackByScale — the same brief, two very different honest answers. Toggling
  between scales for the SAME example is the clearest way to show that
  "best" isn't one stack — it's a function of budget, volume, and stakes.
  SSR-stable, no API.
*/

type Scale = {
  key: "bootstrapped" | "enterprise";
  label: string;
  accent: string;
  budget: string;
  model: string;
  data: string;
  agent: string;
  memory: string;
  ops: string;
  philosophy: string;
};

const SCALES: Scale[] = [
  {
    key: "bootstrapped",
    label: "Bootstrapped / solo project",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    budget: "A few hundred dollars a month, if that — every layer has to earn its cost.",
    model: "A proprietary API, mid-size tier. No self-hosting — the DevOps burden alone would sink a one-person team.",
    data: "RAG over a free-tier or open-source vector store. Skip fine-tuning entirely; prompting plus good retrieval covers almost everything at this stage.",
    agent: "A single call or a short, fixed 2–3 step chain. Avoid an open-ended agent loop — at this budget, one runaway loop can wipe out a week of margin.",
    memory: "Simple — store a few key facts per user in a normal database. Skip a dedicated memory system until real usage proves it's needed.",
    ops: "Minimal logging, manual cost checks. Formal observability tooling can wait until there's real traffic to observe.",
    philosophy: "Ship the smallest stack that solves the real problem. Every extra layer is something you now have to pay for and maintain, alone.",
  },
  {
    key: "enterprise",
    label: "Enterprise deployment",
    accent: "border-blue-500/40 bg-blue-500/5",
    budget: "Budget is rarely the binding constraint — compliance, reliability, and risk usually are.",
    model: "Often a mix: a frontier model for complex requests, a cheaper mid-size model for routine ones, chosen per-request. Self-hosting seriously considered if volume and data-residency rules justify it.",
    data: "A proper RAG pipeline with access control baked in — a support agent must never retrieve one customer's data while answering another's. Fine-tuning considered once a narrow, high-volume task is proven to need it.",
    agent: "A real agent loop, but with hard step limits, approval gates on anything irreversible (refunds, account changes), and full audit logging of every action taken.",
    memory: "A dedicated memory layer (see Giving AI a Memory) with proper tenant isolation between customers, not a shared table.",
    ops: "Full observability (tracing, cost dashboards, evals running continuously), on-call ownership, and a rollback plan for every change.",
    philosophy: "Correctness, auditability, and blast-radius control matter more than the cheapest possible stack. The cost of being wrong dwarfs the cost of the infrastructure.",
  },
];

export function StackByScale() {
  const [key, setKey] = useState<Scale["key"]>("bootstrapped");
  const s = SCALES.find((x) => x.key === key)!;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Same brief — &ldquo;build a customer-support assistant&rdquo; — two honest answers
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex gap-1.5">
          {SCALES.map((x) => (
            <button
              key={x.key}
              onClick={() => setKey(x.key)}
              className={`flex-1 rounded-full border px-3 py-1.5 text-[12px] transition-colors ${key === x.key ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Budget reality</p>
          <p className="text-[13px] text-zinc-700 dark:text-zinc-200 mb-3">{s.budget}</p>

          <div className="grid sm:grid-cols-2 gap-3">
            {[
              ["Model", s.model],
              ["Data / grounding", s.data],
              ["Agent behaviour", s.agent],
              ["Memory", s.memory],
              ["Operations", s.ops],
            ].map(([label, val]) => (
              <div key={label}>
                <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">{label}</p>
                <p className="mt-0.5 text-[12.5px] leading-relaxed text-zinc-600 dark:text-zinc-300">{val}</p>
              </div>
            ))}
          </div>

          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">The governing philosophy: </span>{s.philosophy}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Same product idea, same list of ingredients from the capability ladder — genuinely different, both correct, answers. Scale doesn&apos;t just change the budget; it changes which risks you&apos;re actually optimising against.
        </p>
      </div>
    </figure>
  );
}
