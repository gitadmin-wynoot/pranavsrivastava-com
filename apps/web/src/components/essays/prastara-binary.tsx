"use client";

import { useState } from "react";

/*
  PrastaraBinary — Piṅgala's prastāra ("spreading out"): list every metre of n
  syllables, each syllable light (laghu ○) or heavy (guru ●). With two choices
  per syllable there are 2^n metres, and enumerating them in order is exactly
  binary counting. Pick a number, get the metre (naṣṭa); read a metre, get its
  number (uddiṣṭa). Light = 0, heavy = 1. SSR-stable, no API.
*/

const N_OPTIONS = [2, 3, 4, 5];

function bitsOf(v: number, n: number): number[] {
  return Array.from({ length: n }, (_, p) => (v >> (n - 1 - p)) & 1);
}

export function PrastaraBinary() {
  const [n, setN] = useState(4);
  const [idx, setIdx] = useState(6);
  const total = 1 << n;
  const cur = Math.min(idx, total - 1);
  const pattern = bitsOf(cur, n);

  const Syll = ({ b, big }: { b: number; big?: boolean }) => (
    <span
      className={`inline-block rounded-full ${big ? "h-6 w-6" : "h-3 w-3"} ${
        b ? "bg-zinc-800 dark:bg-zinc-100" : "border-2 border-zinc-400 dark:border-zinc-500"
      }`}
      aria-hidden="true"
    />
  );

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The prastāra — every metre of n syllables is a binary number
      </div>

      <div className="p-4 sm:p-5">
        {/* n selector */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">syllables</span>
          {N_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setN(opt);
                setIdx((v) => Math.min(v, (1 << opt) - 1));
              }}
              className={`h-7 w-7 rounded-lg border text-xs font-semibold transition-colors ${opt === n ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 hover:border-zinc-400"}`}
            >
              {opt}
            </button>
          ))}
          <span className="ml-auto text-[11px] text-zinc-400">
            2<sup>{n}</sup> = <span className="font-semibold text-zinc-600 dark:text-zinc-300">{total}</span> metres
          </span>
        </div>

        {/* current metre */}
        <div className="mt-4 rounded-xl border border-blue-500/40 bg-blue-500/5 p-4">
          <div className="flex items-center gap-2.5">
            {pattern.map((b, i) => (
              <Syll key={i} b={b} big />
            ))}
          </div>
          <div className="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1 text-[13px]">
            <span className="text-zinc-500 dark:text-zinc-400">
              metre <span className="font-semibold text-zinc-800 dark:text-zinc-100">#{cur + 1}</span> of {total}
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              binary <span className="font-mono font-semibold text-blue-600 dark:text-blue-400">{pattern.join("")}</span>
            </span>
            <span className="text-zinc-500 dark:text-zinc-400">
              value <span className="font-semibold text-zinc-800 dark:text-zinc-100">{cur}</span>
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={total - 1}
            value={cur}
            onChange={(e) => setIdx(Number(e.target.value))}
            className="mt-3 w-full cursor-pointer accent-blue-500"
            aria-label="Metre number"
          />
        </div>

        {/* full prastāra */}
        <p className="mt-4 mb-2 text-[11px] font-medium uppercase tracking-wide text-zinc-400">
          the full spreading-out — tap any row
        </p>
        <div className="max-h-56 overflow-y-auto rounded-xl border border-zinc-200 dark:border-zinc-800 divide-y divide-zinc-100 dark:divide-zinc-900">
          {Array.from({ length: total }, (_, i) => {
            const p = bitsOf(i, n);
            const active = i === cur;
            return (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`flex w-full items-center gap-3 px-3 py-1.5 text-left transition-colors ${active ? "bg-blue-500/10" : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"}`}
              >
                <span className="w-6 shrink-0 text-[11px] tabular-nums text-zinc-400">{i + 1}</span>
                <span className="flex items-center gap-1.5">
                  {p.map((b, k) => (
                    <Syll key={k} b={b} />
                  ))}
                </span>
                <span className="ml-auto font-mono text-[11px] text-zinc-400">{p.join("")}</span>
              </button>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          <span className="inline-block h-2.5 w-2.5 rounded-full border-2 border-zinc-400 align-middle" /> laghu (light) = 0 &nbsp;·&nbsp; <span className="inline-block h-2.5 w-2.5 rounded-full bg-zinc-800 dark:bg-zinc-100 align-middle" /> guru (heavy) = 1. Turning a metre into a number and back is <em>naṣṭa</em> and <em>uddiṣṭa</em> — binary ↔ decimal, the operation inside every computer, written down over two thousand years ago.
        </p>
      </div>
    </figure>
  );
}
