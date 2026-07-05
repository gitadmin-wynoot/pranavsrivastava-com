"use client";

import { useState } from "react";
import { Brain, Wrench, Eye, CheckCircle2, StepForward, RotateCcw } from "lucide-react";

/*
  ReActSimulator — step through a real ReAct trace one move at a time, watching
  the Thought → Action → Observation loop turn until the agent finishes. Two
  traces: a relatable one, and the canonical example from the 2022 paper.
*/

type Phase = "thought" | "action" | "observation" | "finish";
type Step = { phase: Phase; text: string };
type Trace = { label: string; question: string; steps: Step[] };

const PHASE: Record<Phase, { label: string; icon: typeof Brain; card: string; text: string; dot: string }> = {
  thought: { label: "Thought", icon: Brain, card: "border-violet-500/40 bg-violet-500/5", text: "text-violet-600 dark:text-violet-400", dot: "bg-violet-500" },
  action: { label: "Action", icon: Wrench, card: "border-emerald-500/40 bg-emerald-500/5", text: "text-emerald-600 dark:text-emerald-400", dot: "bg-emerald-500" },
  observation: { label: "Observation", icon: Eye, card: "border-amber-500/40 bg-amber-500/5", text: "text-amber-600 dark:text-amber-400", dot: "bg-amber-500" },
  finish: { label: "Answer", icon: CheckCircle2, card: "border-blue-500/40 bg-blue-500/5", text: "text-blue-600 dark:text-blue-400", dot: "bg-blue-500" },
};

const TRACES: Trace[] = [
  {
    label: "Who lived longer?",
    question: "Who lived longer — Isaac Newton or Albert Einstein?",
    steps: [
      { phase: "thought", text: "I need each man's lifespan. I'll look up Einstein first, then Newton, then compare." },
      { phase: "action", text: 'Search["Albert Einstein"]' },
      { phase: "observation", text: "Albert Einstein (14 Mar 1879 – 18 Apr 1955), theoretical physicist. Died aged 76." },
      { phase: "thought", text: "Einstein lived 76 years. Now Newton." },
      { phase: "action", text: 'Search["Isaac Newton"]' },
      { phase: "observation", text: "Isaac Newton (4 Jan 1643 – 31 Mar 1727), mathematician and physicist. Died aged 84." },
      { phase: "thought", text: "84 is greater than 76, so Newton lived longer." },
      { phase: "finish", text: "Isaac Newton lived longer — 84 years to Einstein's 76." },
    ],
  },
  {
    label: "The paper's example",
    question: "What is the elevation range for the area that the eastern sector of the Colorado orogeny extends into?",
    steps: [
      { phase: "thought", text: "I need to find the Colorado orogeny, then the area its eastern sector extends into, then that area's elevation range." },
      { phase: "action", text: 'Search["Colorado orogeny"]' },
      { phase: "observation", text: "The Colorado orogeny was an episode of mountain building in Colorado and surrounding areas." },
      { phase: "thought", text: "It doesn't mention the eastern sector. I'll look that up." },
      { phase: "action", text: 'Lookup["eastern sector"]' },
      { phase: "observation", text: "The eastern sector extends into the High Plains and is called the Central Plains orogeny." },
      { phase: "thought", text: "So I now need the elevation range of the High Plains." },
      { phase: "action", text: 'Search["High Plains (United States)"]' },
      { phase: "observation", text: "The High Plains rise in elevation from around 1,800 to 7,000 ft (550 to 2,130 m)." },
      { phase: "thought", text: "The High Plains rise from about 1,800 to 7,000 ft. That is the answer." },
      { phase: "finish", text: "1,800 to 7,000 ft." },
    ],
  },
];

export function ReActSimulator({ traces = TRACES }: { traces?: Trace[] }) {
  const [t, setT] = useState(0);
  const [n, setN] = useState(1); // steps revealed
  const trace = traces[t];
  const steps = trace.steps;
  const done = n >= steps.length;
  const current = steps[n - 1]?.phase ?? null;

  const pick = (i: number) => {
    setT(i);
    setN(1);
  };

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
        <div className="flex flex-wrap gap-1.5">
          {traces.map((tr, i) => (
            <button
              key={tr.label}
              onClick={() => pick(i)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${i === t ? "border-blue-500/50 bg-blue-500/10 text-blue-600 dark:text-blue-400" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-blue-500/40"}`}
            >
              {tr.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setN(1)}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-[11px] text-zinc-600 dark:text-zinc-300 hover:border-blue-500/50 transition-colors"
        >
          <RotateCcw className="h-3 w-3" /> restart
        </button>
      </div>

      <div className="p-4 sm:p-5">
        {/* question */}
        <div className="mb-4 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-3.5 py-2.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">Question</span>
          <p className="mt-0.5 text-sm text-zinc-700 dark:text-zinc-200">{trace.question}</p>
        </div>

        {/* loop badge */}
        <div className="mb-4 flex items-center justify-center gap-2 text-[11px]">
          {(["thought", "action", "observation"] as Phase[]).map((p, i) => {
            const on = current === p && !done;
            const m = PHASE[p];
            return (
              <span key={p} className="flex items-center gap-2">
                <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 transition-all ${on ? m.card + " " + m.text + " scale-110" : "border-zinc-200 dark:border-zinc-800 text-zinc-400"}`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${on ? m.dot : "bg-zinc-300 dark:bg-zinc-700"}`} /> {m.label}
                </span>
                {i < 2 && <span className="text-zinc-300 dark:text-zinc-700">→</span>}
              </span>
            );
          })}
          <span className="ml-1 text-zinc-300 dark:text-zinc-700">↻</span>
        </div>

        {/* revealed steps */}
        <div className="space-y-2">
          {steps.slice(0, n).map((s, i) => {
            const m = PHASE[s.phase];
            const Icon = m.icon;
            const isAction = s.phase === "action";
            return (
              <div key={i} className={`rounded-lg border px-3.5 py-2.5 ${m.card}`}>
                <div className={`mb-1 flex items-center gap-1.5 text-[11px] font-semibold ${m.text}`}>
                  <Icon className="h-3.5 w-3.5" /> {m.label}
                </div>
                <p className={`text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200 ${isAction ? "font-mono text-[12px]" : ""}`}>
                  {s.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* control */}
        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-[11px] text-zinc-400">
            step {n} / {steps.length}
          </span>
          {done ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 dark:text-blue-400">
              <CheckCircle2 className="h-4 w-4" /> loop complete
            </span>
          ) : (
            <button
              onClick={() => setN((x) => Math.min(steps.length, x + 1))}
              className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 px-3.5 py-1.5 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              Next move <StepForward className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </figure>
  );
}
