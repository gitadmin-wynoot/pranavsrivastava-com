"use client";

import { useState } from "react";

/*
  ApplicationJourney — a raw LLM alone is rarely the whole product. This
  walks through real domains and shows which layers actually get added on
  top of the model, and why — the bridge from "LLM" to "application."
  SSR-stable, no API.
*/

type Domain = {
  emoji: string;
  name: string;
  accent: string;
  ask: string;
  whyNotAlone: string;
  layers: string[];
};

const DOMAINS: Domain[] = [
  {
    emoji: "🏥",
    name: "Healthcare",
    accent: "border-rose-500/40 bg-rose-500/5",
    ask: "\"Has this drug interacted badly with anything like it before?\"",
    whyNotAlone: "A raw LLM's training data goes stale the day training finishes, and it can't tell you which specific patient record or paper it's drawing from — unacceptable when the answer needs to be checked.",
    layers: ["LLM (language + reasoning)", "Embeddings + semantic search (find the right studies)", "RAG (answer grounded in real, citable sources)"],
  },
  {
    emoji: "⚖️",
    name: "Legal",
    accent: "border-violet-500/40 bg-violet-500/5",
    ask: "\"Does this clause conflict with the client's standard contract terms?\"",
    whyNotAlone: "The relevant contract is private, was never in any training data, and the answer has to point to an exact clause a lawyer can verify — not a plausible-sounding paraphrase.",
    layers: ["LLM (reads and reasons over legal language)", "Embeddings + semantic search (find the matching clause across thousands of documents)", "RAG (quote the exact source, not a guess)"],
  },
  {
    emoji: "💬",
    name: "Customer support",
    accent: "border-blue-500/40 bg-blue-500/5",
    ask: "\"My order didn't arrive — what actually happened, and can you fix it?\"",
    whyNotAlone: "Answering needs today's order status from a live system, and fixing it means actually doing something — a refund, a reship — not just describing what could be done.",
    layers: ["LLM (understand the complaint, write the reply)", "RAG (pull this customer's real order history)", "Tools / function calling (actually issue the refund)"],
  },
  {
    emoji: "💻",
    name: "Code assistance",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    ask: "\"Why is this specific function in our codebase failing?\"",
    whyNotAlone: "The bug lives in code the model has never seen — your private repository — and general programming knowledge alone can't diagnose a problem specific to your files.",
    layers: ["LLM (understands code and reasons about logic)", "Embeddings + semantic search (find the related files and past similar bugs)", "Tools (run the tests, read the actual error)"],
  },
  {
    emoji: "🛒",
    name: "E-commerce",
    accent: "border-amber-500/40 bg-amber-500/5",
    ask: "\"Find me a jacket like the one I returned, but warmer, under $80.\"",
    whyNotAlone: "This needs today's live inventory and prices, matched by *meaning* (\"like this one, but warmer\") rather than exact keywords — a plain product-name search would miss almost everything relevant.",
    layers: ["LLM (understand the vague, human request)", "Embeddings + semantic search (match by meaning across the live catalogue)", "Tools (check real-time stock and price)"],
  },
];

export function ApplicationJourney() {
  const [i, setI] = useState(0);
  const d = DOMAINS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        From a raw LLM to a real product — pick a domain
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {DOMAINS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${d.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{d.emoji}</span> {d.name}
          </h4>
          <p className="mt-2 text-[13px] italic text-zinc-600 dark:text-zinc-300">{d.ask}</p>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">Why the LLM can't do this alone</p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{d.whyNotAlone}</p>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">What actually gets stacked on top</p>
          <ol className="mt-1 space-y-1">
            {d.layers.map((l, k) => (
              <li key={k} className="flex gap-2 text-[13px] text-zinc-700 dark:text-zinc-200">
                <span className="font-mono text-[11px] text-zinc-400 shrink-0">{k + 1}.</span>
                <span>{l}</span>
              </li>
            ))}
          </ol>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Every domain here reaches for the same handful of layers, in roughly the same order — search for the right facts, ground the answer in them, and only add tools once the model actually needs to *do* something, not just say something.
        </p>
      </div>
    </figure>
  );
}
