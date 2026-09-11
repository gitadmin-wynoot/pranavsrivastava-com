"use client";

import { useState } from "react";

/*
  MultiHeadDemo — why one attention pattern isn't enough. Several "heads"
  run the same Q/K/V mechanism in parallel, each free to specialise in a
  different kind of relationship. Illustrative patterns for one sentence,
  not pulled from a live model. SSR-stable, no API.
*/

const SENTENCE = ["The", "quick", "fox", "jumps", "over", "the", "lazy", "dog"];

type Head = {
  name: string;
  accent: string;
  stroke: string;
  specialises: string;
  // pairs of word indices this head connects strongly
  links: [number, number][];
};

const HEADS: Head[] = [
  {
    name: "Head 1",
    accent: "text-blue-600 dark:text-blue-400",
    stroke: "stroke-blue-500 dark:stroke-blue-400",
    specialises: "Adjective → noun (which word describes which)",
    links: [[1, 2], [6, 7]],
  },
  {
    name: "Head 2",
    accent: "text-emerald-600 dark:text-emerald-400",
    stroke: "stroke-emerald-500 dark:stroke-emerald-400",
    specialises: "Subject / object of the verb",
    links: [[3, 2], [3, 7]],
  },
  {
    name: "Head 3",
    accent: "text-amber-600 dark:text-amber-400",
    stroke: "stroke-amber-500 dark:stroke-amber-400",
    specialises: "Nearby-word position (a local, short-range pattern)",
    links: [[0, 1], [4, 5], [5, 6]],
  },
  {
    name: "Head 4",
    accent: "text-rose-600 dark:text-rose-400",
    stroke: "stroke-rose-500 dark:stroke-rose-400",
    specialises: "The two animals, linked to each other directly",
    links: [[2, 7]],
  },
];

export function MultiHeadDemo() {
  const [h, setH] = useState(0);
  const head = HEADS[h];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Multiple heads, watching the same sentence differently
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5 mb-4">
          {HEADS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setH(idx)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === h ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.name}
            </button>
          ))}
        </div>

        <svg viewBox="0 0 600 130" className="w-full h-auto" fill="none" role="img">
          {SENTENCE.map((word, i) => {
            const x = 30 + i * 76;
            return (
              <text key={i} x={x} y="100" textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="13" fontWeight="500">
                {word}
              </text>
            );
          })}
          {head.links.map(([a, b], i) => {
            const xa = 30 + a * 76;
            const xb = 30 + b * 76;
            const mid = (xa + xb) / 2;
            const dist = Math.abs(xb - xa);
            const curveHeight = Math.max(30, dist * 0.35);
            return (
              <path
                key={i}
                d={`M${xa},85 Q${mid},${85 - curveHeight} ${xb},85`}
                className={head.stroke}
                strokeWidth="2"
                fill="none"
              />
            );
          })}
        </svg>

        <div className="mt-2 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3">
          <p className={`text-[13px] font-semibold ${head.accent}`}>{head.name} specialises in:</p>
          <p className="text-[13px] text-zinc-600 dark:text-zinc-300 mt-0.5">{head.specialises}</p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          In practice a model runs many of these — GPT-3-scale models use 96 heads per layer — each with its own Query/Key/Value, all computed in parallel and then combined. Nobody hand-assigns what each head learns; it falls out of training, and researchers finding these interpretable patterns after the fact is one of the more genuinely delightful discoveries in the field.
        </p>
      </div>
    </figure>
  );
}
