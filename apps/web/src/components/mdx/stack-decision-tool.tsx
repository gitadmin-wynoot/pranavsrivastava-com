"use client";

import { useState } from "react";

/*
  StackDecisionTool — five honest yes/no questions about the actual problem,
  not the technology, that together determine a minimal recommended stack.
  The point is the discipline of asking these BEFORE reaching for a layer,
  not the tool itself. SSR-stable, no API.
*/

type Question = {
  id: string;
  text: string;
  ifYes: string; // layer name added
};

const QUESTIONS: Question[] = [
  { id: "facts", text: "Does the answer depend on private, current, or specific facts the model wouldn't already know?", ifYes: "RAG" },
  { id: "act", text: "Does completing the task require actually doing something — not just answering?", ifYes: "Tools" },
  { id: "steps", text: "Does it typically take more than one step or tool call to actually finish?", ifYes: "Agent loop" },
  { id: "remember", text: "Does it need to remember things across separate sessions, not just within one chat?", ifYes: "Memory" },
  { id: "repeat", text: "Will you ask for this same specialised capability again and again?", ifYes: "Skill" },
];

export function StackDecisionTool() {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => setAnswers((a) => ({ ...a, [id]: !a[id] }));

  const layers = ["Model call", ...QUESTIONS.filter((q) => answers[q.id]).map((q) => q.ifYes)];
  const hasTools = answers.act;
  const hasAgent = answers.steps;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Answer honestly — build your own recommended stack
      </div>

      <div className="p-4 sm:p-5">
        <div className="space-y-2">
          {QUESTIONS.map((q) => (
            <button
              key={q.id}
              onClick={() => toggle(q.id)}
              className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition-colors ${answers[q.id] ? "border-blue-500/50 bg-blue-500/5" : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"}`}
            >
              <span
                className={`mt-0.5 flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${answers[q.id] ? "bg-blue-500 justify-end" : "bg-zinc-300 dark:bg-zinc-700 justify-start"}`}
              >
                <span className="h-4 w-4 mx-0.5 rounded-full bg-white shadow" />
              </span>
              <span className="text-[13px] text-zinc-700 dark:text-zinc-200 leading-snug">{q.text}</span>
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Your minimal recommended stack</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {layers.map((l) => (
              <span key={l} className="rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-3 py-1 text-[12px] font-medium">
                {l}
              </span>
            ))}
          </div>
          {hasTools && !hasAgent && (
            <p className="mt-3 text-[12px] text-zinc-600 dark:text-zinc-300">
              Tools without an agent loop is a real, common pattern — one call, one tool, done. Don&apos;t add a full agent loop just because tools are involved.
            </p>
          )}
          {hasAgent && (
            <p className="mt-3 text-[12px] text-amber-700 dark:text-amber-400">
              An agent loop is your biggest cost lever here — see the capability ladder above. Set a hard step limit before shipping this.
            </p>
          )}
          {layers.length === 1 && (
            <p className="mt-3 text-[12px] text-zinc-600 dark:text-zinc-300">
              A single model call may genuinely be the whole answer — that&apos;s not a lesser stack, it&apos;s the correctly-sized one.
            </p>
          )}
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          These five questions are the actual discipline — asking them honestly, before reaching for a layer, is worth more than any framework for choosing between vendors.
        </p>
      </div>
    </figure>
  );
}
