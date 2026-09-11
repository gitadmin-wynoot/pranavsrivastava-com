"use client";

import { useState } from "react";

/*
  AttentionHeatmap — the canonical attention visualization: pick a word, see
  how strongly it attends to every other word in the sentence. Uses the
  classic Winograd-schema pair (same sentence, one word swapped, the pronoun
  flips who it refers to) to prove attention reads context, not just
  position. Weights are hand-set to be illustrative and internally
  consistent (each row sums to 1), not pulled from a live model.
  SSR-stable, no API.
*/

type Example = {
  label: string;
  words: string[];
  // weights[wordIndex] = array of attention weight per word, summing to ~1
  weights: number[][];
  note: string;
};

const EXAMPLES: Example[] = [
  {
    label: "“It” = the trophy",
    words: ["The", "trophy", "did", "not", "fit", "in", "the", "suitcase", "because", "it", "was", "too", "big"],
    weights: [
      [0.7,0.05,0.05,0.02,0.03,0.02,0.03,0.02,0.02,0.02,0.02,0.01,0.01],
      [0.05,0.55,0.03,0.02,0.05,0.02,0.02,0.08,0.02,0.1,0.02,0.02,0.02],
      [0.05,0.05,0.51,0.1,0.1,0.03,0.03,0.03,0.03,0.03,0.02,0.01,0.01],
      [0.02,0.03,0.1,0.49,0.15,0.05,0.03,0.03,0.03,0.03,0.02,0.01,0.01],
      [0.03,0.08,0.1,0.15,0.4,0.08,0.03,0.05,0.03,0.02,0.01,0.01,0.01],
      [0.02,0.03,0.03,0.05,0.08,0.49,0.15,0.08,0.02,0.02,0.01,0.01,0.01],
      [0.03,0.03,0.03,0.03,0.03,0.15,0.48,0.15,0.02,0.02,0.01,0.01,0.01],
      [0.03,0.15,0.03,0.03,0.05,0.08,0.15,0.39,0.03,0.03,0.01,0.01,0.01],
      [0.02,0.03,0.03,0.03,0.03,0.02,0.02,0.03,0.6,0.1,0.05,0.02,0.02],
      [0.03,0.62,0.02,0.02,0.03,0.02,0.02,0.08,0.05,0.05,0.02,0.02,0.02],
      [0.02,0.05,0.02,0.02,0.02,0.02,0.02,0.05,0.05,0.3,0.33,0.05,0.05],
      [0.02,0.05,0.02,0.02,0.02,0.02,0.02,0.05,0.03,0.25,0.15,0.3,0.05],
      [0.02,0.1,0.02,0.02,0.02,0.02,0.02,0.05,0.03,0.2,0.1,0.1,0.3],
    ],
    note: "“It” attends most strongly to “trophy” — a trophy is the kind of thing that can be too big to fit.",
  },
  {
    label: "“It” = the suitcase",
    words: ["The", "trophy", "did", "not", "fit", "in", "the", "suitcase", "because", "it", "was", "too", "small"],
    weights: [
      [0.7,0.05,0.05,0.02,0.03,0.02,0.03,0.02,0.02,0.02,0.02,0.01,0.01],
      [0.05,0.55,0.03,0.02,0.05,0.02,0.02,0.08,0.02,0.1,0.02,0.02,0.02],
      [0.05,0.05,0.51,0.1,0.1,0.03,0.03,0.03,0.03,0.03,0.02,0.01,0.01],
      [0.02,0.03,0.1,0.49,0.15,0.05,0.03,0.03,0.03,0.03,0.02,0.01,0.01],
      [0.03,0.08,0.1,0.15,0.4,0.08,0.03,0.05,0.03,0.02,0.01,0.01,0.01],
      [0.02,0.03,0.03,0.05,0.08,0.49,0.15,0.08,0.02,0.02,0.01,0.01,0.01],
      [0.03,0.03,0.03,0.03,0.03,0.15,0.48,0.15,0.02,0.02,0.01,0.01,0.01],
      [0.02,0.1,0.03,0.03,0.05,0.08,0.15,0.45,0.03,0.03,0.01,0.01,0.01],
      [0.02,0.03,0.03,0.03,0.03,0.02,0.02,0.03,0.6,0.1,0.05,0.02,0.02],
      [0.02,0.08,0.02,0.02,0.03,0.02,0.02,0.65,0.05,0.05,0.02,0.01,0.01],
      [0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.05,0.05,0.3,0.36,0.05,0.05],
      [0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.05,0.03,0.25,0.15,0.33,0.05],
      [0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.05,0.03,0.15,0.1,0.15,0.38],
    ],
    note: "Swap one word — “big” to “small” — and “it” now attends most strongly to “suitcase” instead. Same position in the sentence, different meaning, different attention. That's the proof this is real understanding, not just “look two words back.”",
  },
];

export function AttentionHeatmap() {
  const [ex, setEx] = useState(0);
  const [w, setW] = useState(9); // default: the pronoun "it"
  const example = EXAMPLES[ex];
  const weights = example.weights[w];
  const max = Math.max(...weights);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Click a word — see what it's paying attention to
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {EXAMPLES.map((x, idx) => (
            <button
              key={x.label}
              onClick={() => { setEx(idx); setW(9); }}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === ex ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 leading-loose">
          {example.words.map((word, idx) => {
            const weight = weights[idx];
            const isSelected = idx === w;
            const intensity = weight / max;
            return (
              <button
                key={idx}
                onClick={() => setW(idx)}
                className={`rounded-md px-2 py-1 text-[13px] transition-all border ${
                  isSelected
                    ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 font-semibold"
                    : "border-transparent"
                }`}
                style={
                  !isSelected
                    ? { backgroundColor: `rgba(59, 130, 246, ${0.08 + intensity * 0.55})` }
                    : undefined
                }
              >
                {word}
              </button>
            );
          })}
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
          Attention weight from &ldquo;{example.words[w]}&rdquo; → every word (darker = stronger, all weights sum to 1)
        </p>
        <div className="mt-2 space-y-1">
          {example.words.map((word, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="w-16 shrink-0 text-[11px] text-zinc-500 dark:text-zinc-400 truncate">{word}</span>
              <div className="flex-1 h-3 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${weights[idx] * 100}%` }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-[10px] font-mono text-zinc-400">{weights[idx].toFixed(2)}</span>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-300">{example.note}</p>
        <p className="mt-2 text-[11px] text-zinc-400">
          These specific numbers are illustrative — set by hand to make the pattern easy to see — but the shape is exactly how a trained model's attention weights actually behave.
        </p>
      </div>
    </figure>
  );
}
