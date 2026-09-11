"use client";

import { useState } from "react";

/*
  QKVExplainer — the actual mechanism, via a library-desk analogy, stepped
  through with numbers small enough to verify by hand. Query = what you're
  looking for; Key = the label on each shelf; Value = what's actually on the
  shelf; score = how well query matches key (dot product); softmax turns
  scores into weights that sum to 1; output = weighted blend of values.
  SSR-stable, no API.
*/

type Step = {
  label: string;
  title: string;
  body: React.ReactNode;
};

const KEYS = [
  { name: "trophy", vec: [1.6, 0.4], value: "🏆 the trophy" },
  { name: "suitcase", vec: [0.4, 1.6], value: "🧳 the suitcase" },
  { name: "was", vec: [0, 0], value: "· (function word, little meaning)" },
];
const QUERY_VEC = [1.4, 0.5]; // "it", in a sentence where "big" nudges toward trophy-like things

function dot(a: number[], b: number[]) {
  return a[0] * b[0] + a[1] * b[1];
}

function softmax(scores: number[]) {
  const max = Math.max(...scores);
  const exps = scores.map((s) => Math.exp(s - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function QKVExplainer() {
  const [step, setStep] = useState(0);

  const scores = KEYS.map((k) => dot(QUERY_VEC, k.vec));
  const weights = softmax(scores);

  const steps: Step[] = [
    {
      label: "1. The Query",
      title: "What is the word “it” looking for?",
      body: (
        <>
          <p>
            Think of a librarian&apos;s desk. Every word, as it&apos;s processed, writes down a <strong>Query</strong> — a short description, as a list of numbers, of what kind of information it needs to fully understand itself.
          </p>
          <p className="mt-2 font-mono text-[12px] bg-zinc-900/5 dark:bg-zinc-100/10 rounded-lg px-3 py-2">
            Query(&ldquo;it&rdquo;) = [{QUERY_VEC.join(", ")}]  <span className="text-zinc-400">— leaning toward “big, physical object” things</span>
          </p>
        </>
      ),
    },
    {
      label: "2. The Keys",
      title: "Every word also wears a name-tag",
      body: (
        <>
          <p>
            Every word <em>also</em> writes a <strong>Key</strong> — a short tag describing what kind of information <em>it</em> offers, in that same numeric language as the Query.
          </p>
          <div className="mt-2 space-y-1.5">
            {KEYS.map((k) => (
              <p key={k.name} className="font-mono text-[12px] bg-zinc-900/5 dark:bg-zinc-100/10 rounded-lg px-3 py-2">
                Key(&ldquo;{k.name}&rdquo;) = [{k.vec.join(", ")}]
              </p>
            ))}
          </div>
        </>
      ),
    },
    {
      label: "3. The Score",
      title: "Compare the Query to every Key",
      body: (
        <>
          <p>
            &ldquo;It&rdquo; compares its Query against every word&apos;s Key using a <strong>dot product</strong> — multiply matching positions, add them up. Two vectors pointing the same way score high; pointing differently, score low. It&apos;s just a fast way to measure &ldquo;how alike are these two lists of numbers.&rdquo;
          </p>
          <div className="mt-2 space-y-1.5">
            {KEYS.map((k, i) => (
              <p key={k.name} className="font-mono text-[12px] bg-zinc-900/5 dark:bg-zinc-100/10 rounded-lg px-3 py-2">
                {QUERY_VEC.join(",")} · {k.vec.join(",")} = ({QUERY_VEC[0]}×{k.vec[0]}) + ({QUERY_VEC[1]}×{k.vec[1]}) = <strong>{scores[i].toFixed(1)}</strong>
              </p>
            ))}
          </div>
        </>
      ),
    },
    {
      label: "4. Softmax",
      title: "Turn scores into honest percentages",
      body: (
        <>
          <p>
            Raw scores aren&apos;t easy to compare — they could be any size. <strong>Softmax</strong> squashes them into weights that are all positive and add up to exactly 1, like a poll where everyone&apos;s vote share adds to 100%. A bigger score keeps more of the &ldquo;vote.&rdquo;
          </p>
          <div className="mt-2 space-y-1.5">
            {KEYS.map((k, i) => (
              <div key={k.name} className="flex items-center gap-2">
                <span className="w-20 text-[12px] font-mono shrink-0">{k.name}</span>
                <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${weights[i] * 100}%` }} />
                </div>
                <span className="w-12 text-right text-[11px] font-mono text-zinc-400 shrink-0">{(weights[i] * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </>
      ),
    },
    {
      label: "5. The Output",
      title: "Blend the Values, weighted by those percentages",
      body: (
        <>
          <p>
            Finally, every word also carries a <strong>Value</strong> — its actual content, the thing worth passing along. &ldquo;It&rdquo; builds its new, context-aware meaning by blending every word&apos;s Value, weighted by the percentages just computed.
          </p>
          <p className="mt-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 text-[13px]">
            New meaning of &ldquo;it&rdquo; ≈ <strong>{(weights[0] * 100).toFixed(0)}%</strong> trophy + <strong>{(weights[1] * 100).toFixed(0)}%</strong> suitcase + <strong>{(weights[2] * 100).toFixed(0)}%</strong> (was) — overwhelmingly &ldquo;trophy,&rdquo; exactly like it should be.
          </p>
        </>
      ),
    },
  ];

  const s = steps[step];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Query, Key, Value — the whole mechanism, five small steps
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setStep((v) => Math.max(0, v - 1))}
            disabled={step === 0}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-[12px] text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:border-zinc-400 transition-colors"
          >
            ← Back
          </button>
          <div className="flex flex-1 items-center justify-center gap-1.5">
            {steps.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setStep(idx)}
                aria-label={`Step ${idx + 1}`}
                className={`h-1.5 rounded-full transition-all ${idx === step ? "w-6 bg-zinc-900 dark:bg-zinc-100" : "w-3 bg-zinc-300 dark:bg-zinc-700"}`}
              />
            ))}
          </div>
          <button
            onClick={() => setStep((v) => Math.min(steps.length - 1, v + 1))}
            disabled={step === steps.length - 1}
            className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-[12px] text-zinc-600 dark:text-zinc-300 disabled:opacity-30 hover:border-zinc-400 transition-colors"
          >
            Next →
          </button>
        </div>

        <p className="text-[11px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400 mb-1">{s.label}</p>
        <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-2">{s.title}</h4>
        <div className="text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">{s.body}</div>

        <p className="mt-4 text-[11px] text-zinc-400">
          These are toy 2-number vectors so the arithmetic stays checkable by hand. A real model uses hundreds of numbers per word — same five steps, just much wider.
        </p>
      </div>
    </figure>
  );
}
