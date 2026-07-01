"use client";

import { useMemo, useState } from "react";
import { Search, ArrowRight, Sparkles } from "lucide-react";

/*
  RetrievalPlayground — an interactive demo of the heart of RAG.

  The learner types a question; we score each document chunk by *meaning*
  (a small concept map stands in for real embeddings), rank them, and show
  which ones get retrieved into the model's context. Ask something the corpus
  can't answer and it shows the honest "nothing retrieved → say I don't know"
  outcome. No API, fully client-side and deterministic.
*/

const DEFAULT_DOCS = [
  "Employees accrue 25 days of paid leave per year, accrued monthly.",
  "Remote work is allowed up to 3 days per week with manager approval.",
  "The meal reimbursement limit when travelling is 40 EUR per day.",
  "Parental leave is 16 weeks, fully paid, for every parent.",
  "The Eindhoven office is open 08:00-19:00 on weekdays.",
  "Laptops are replaced every 3 years; request a swap via the IT portal.",
  "Sick leave requires no doctor's note for the first 3 days.",
];

const SUGGESTIONS = [
  "How many vacation days do I get?",
  "Can I work from home?",
  "What's the food budget on a trip?",
  "Do I need a doctor's note when ill?",
  "What is the dental insurance plan?", // deliberately unanswerable
];

// A tiny concept map — many words collapse to one concept, so "vacation" and
// "leave" match. This is a toy stand-in for what embeddings do with meaning.
const CONCEPTS: Record<string, string> = {
  leave: "leave", vacation: "leave", holiday: "leave", pto: "leave", accrue: "leave", days: "leave", paid: "leave", time: "leave", off: "leave",
  remote: "remote", home: "remote", wfh: "remote", work: "remote", office: "office", hours: "office", open: "office", eindhoven: "office",
  meal: "expense", food: "expense", budget: "expense", reimburse: "expense", reimbursement: "expense", expense: "expense", travel: "expense", trip: "expense", limit: "expense",
  parental: "parental", parent: "parental", maternity: "parental", paternity: "parental", baby: "parental",
  laptop: "equipment", computer: "equipment", hardware: "equipment", device: "equipment", it: "equipment",
  sick: "sick", ill: "sick", illness: "sick", doctor: "sick", note: "sick", unwell: "sick",
};

const STOP = new Set(["the", "a", "an", "do", "i", "get", "my", "is", "are", "can", "of", "on", "to", "for", "what", "how", "many", "when", "if", "me", "you", "and", "in", "at", "s"]);

function concepts(text: string): Set<string> {
  const out = new Set<string>();
  for (const raw of text.toLowerCase().split(/[^a-z0-9]+/)) {
    if (!raw || STOP.has(raw)) continue;
    out.add(CONCEPTS[raw] ?? raw);
  }
  return out;
}

const TOP_K = 3;

export function RetrievalPlayground({ docs = DEFAULT_DOCS }: { docs?: string[] }) {
  const [query, setQuery] = useState(SUGGESTIONS[0]);

  const ranked = useMemo(() => {
    const q = concepts(query);
    const scored = docs.map((text, i) => {
      const c = concepts(text);
      let hits = 0;
      for (const t of q) if (c.has(t)) hits += 1;
      const score = q.size ? hits / q.size : 0;
      return { text, i, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored;
  }, [query, docs]);

  const retrieved = ranked.filter((r, idx) => idx < TOP_K && r.score > 0);
  const nothing = retrieved.length === 0;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
        <Search className="h-3.5 w-3.5" /> Retrieval playground — ask the company handbook
      </div>

      <div className="p-4 sm:p-5">
        {/* query box */}
        <div className="flex items-center gap-2 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 focus-within:border-blue-500/60">
          <Search className="h-4 w-4 text-zinc-400 shrink-0" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask a question…"
            className="w-full bg-transparent text-sm text-zinc-800 dark:text-zinc-100 outline-none placeholder:text-zinc-400"
          />
        </div>

        {/* suggestion chips */}
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setQuery(s)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${
                s === query
                  ? "border-blue-500/50 text-blue-600 dark:text-blue-400 bg-blue-500/10"
                  : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-blue-500/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* ranked chunks */}
        <div className="mt-4 space-y-1.5">
          {ranked.map((r, idx) => {
            const isTop = idx < TOP_K && r.score > 0;
            return (
              <div
                key={r.i}
                className={`rounded-lg border px-3 py-2 transition-all ${
                  isTop
                    ? "border-emerald-500/40 bg-emerald-500/5"
                    : "border-zinc-200 dark:border-zinc-800 opacity-70"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-1.5 flex-1 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
                    <div
                      className={isTop ? "h-full bg-emerald-500" : "h-full bg-zinc-400"}
                      style={{ width: `${Math.round(r.score * 100)}%` }}
                    />
                  </div>
                  <span className="w-10 shrink-0 text-right font-mono text-[11px] text-zinc-400">
                    {r.score.toFixed(2)}
                  </span>
                </div>
                <p className={`mt-1 text-[13px] ${isTop ? "text-zinc-800 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400"}`}>
                  {r.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* outcome */}
        <div className="mt-4 flex items-start gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3 py-2.5">
          <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />
          {nothing ? (
            <p className="text-[13px] text-zinc-600 dark:text-zinc-300">
              <span className="font-semibold">Nothing relevant retrieved.</span>{" "}
              A trustworthy RAG system answers{" "}
              <span className="font-mono text-amber-600 dark:text-amber-400">“I don’t know”</span>{" "}
              here — instead of guessing. That honest refusal is a feature, not a bug.
            </p>
          ) : (
            <p className="text-[13px] text-zinc-600 dark:text-zinc-300">
              The <span className="font-semibold text-emerald-600 dark:text-emerald-400">{retrieved.length} green</span>{" "}
              passage{retrieved.length > 1 ? "s are" : " is"} sent to the model as
              context. It answers <em>only</em> from these — and cites them. Notice
              it matches <span className="font-semibold">meaning</span>: “vacation”
              finds “leave” even though the words differ.
            </p>
          )}
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-400">
          <Sparkles className="h-3 w-3" /> Illustrative: a tiny concept map stands in for real embeddings.
        </p>
      </div>
    </figure>
  );
}
