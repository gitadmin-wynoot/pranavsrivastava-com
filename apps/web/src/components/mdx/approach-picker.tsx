"use client";

import { useState } from "react";
import { Folder, Boxes, Layers } from "lucide-react";

/*
  ApproachPicker — pick a knowledge scenario and see which approach fits: the
  Folder (OKF), the Vector (RAG), or both combined. Makes the "vs" and the
  "combine them" decision concrete.
*/

type Verdict = "folder" | "vector" | "both";

const V: Record<Verdict, { label: string; icon: typeof Folder; cls: string; text: string }> = {
  folder: { label: "Folder (OKF)", icon: Folder, cls: "border-amber-500/40 bg-amber-500/5", text: "text-amber-600 dark:text-amber-400" },
  vector: { label: "Vector (RAG)", icon: Boxes, cls: "border-blue-500/40 bg-blue-500/5", text: "text-blue-600 dark:text-blue-400" },
  both: { label: "Both, combined", icon: Layers, cls: "border-emerald-500/40 bg-emerald-500/5", text: "text-emerald-600 dark:text-emerald-400" },
};

const CASES: { q: string; verdict: Verdict; why: string }[] = [
  { q: "Find the table literally named orders_2024", verdict: "folder", why: "Exact names, schemas, and structure. A vector search would drift to 'similar-looking' tables; a folder just has the file." },
  { q: "How do the orders and customers tables join?", verdict: "folder", why: "That's a precise, structured relationship — a cross-link in the folder, not something to guess from similarity." },
  { q: "Which of our 2 million support tickets are like this new one?", verdict: "vector", why: "Fuzzy, semantic, at huge scale. Embeddings shine at 'find me things that mean the same', even in different words." },
  { q: "Answer a vague question over a big pile of PDFs", verdict: "vector", why: "Unstructured text, matched by meaning. Classic RAG territory." },
  { q: "Give an agent your whole (small, curated) docs — in git, portable", verdict: "folder", why: "OKF is just files: human-readable, versionable, and an agent can navigate and even update it. No database needed." },
  { q: "A huge knowledge base, questions phrased differently every time, and answers must cite exact schema", verdict: "both", why: "Vector search finds the right concept by meaning; the folder gives the exact structure and cross-links to ground the answer. This is the ultimate architecture." },
  { q: "An agent must reason over typed concepts and follow relationships", verdict: "both", why: "Retrieve the entry point with vectors, then walk the folder's typed links to gather precise facts." },
];

export function ApproachPicker() {
  const [i, setI] = useState(0);
  const c = CASES[i];
  const v = V[c.verdict];
  const Icon = v.icon;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Folder, Vector, or both? — pick a job
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {CASES.map((sc, idx) => (
            <button
              key={sc.q}
              onClick={() => setI(idx)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {sc.q.length > 34 ? sc.q.slice(0, 32) + "…" : sc.q}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5 text-sm text-zinc-700 dark:text-zinc-200">
          {c.q}
        </div>

        <div className={`mt-3 rounded-lg border px-3.5 py-3 ${v.cls}`}>
          <div className={`mb-1 flex items-center gap-2 text-sm font-semibold ${v.text}`}>
            <Icon className="h-4 w-4" /> {v.label}
          </div>
          <p className="text-[14px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.why}</p>
        </div>
      </div>
    </figure>
  );
}
