"use client";

import { Fragment, useState } from "react";

/*
  PositionalEncoding — the piece every "attention explained" article skips:
  attention itself has NO sense of word order (it would treat "dog bites
  man" identically to "man bites dog" without this). Solved by giving each
  position a unique numeric fingerprint using sine waves at different
  frequencies — like a clock's hands: the fast hand distinguishes nearby
  seconds, the slow hand distinguishes far-apart hours, together every
  moment is unique. SSR-stable, no API (pure client-side generation).
*/

const POSITIONS = 12;
const DIMS = 8;

function encode(pos: number, dim: number, totalDims: number): number {
  const i = Math.floor(dim / 2);
  const freq = 1 / Math.pow(10000, (2 * i) / totalDims);
  return dim % 2 === 0 ? Math.sin(pos * freq) : Math.cos(pos * freq);
}

export function PositionalEncoding() {
  const [pos, setPos] = useState(3);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Why the model needs to be told where each word sits
      </div>

      <div className="p-4 sm:p-5">
        <p className="text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300 mb-4">
          Attention compares every word to every other word — but nothing about that comparison mentions <em>order</em>. On its own, attention would read &ldquo;the dog bit the man&rdquo; and &ldquo;the man bit the dog&rdquo; as the exact same bag of words. So before anything else happens, every position gets its own unique numeric fingerprint — generated from waves like a clock&apos;s hands, some ticking fast, some slow — and that fingerprint is added onto the word.
        </p>

        <div className="grid" style={{ gridTemplateColumns: `40px repeat(${DIMS}, 1fr)` }}>
          <div />
          {Array.from({ length: DIMS }, (_, d) => (
            <div key={d} className="text-center text-[9px] text-zinc-400 pb-1">dim {d}</div>
          ))}
          {Array.from({ length: POSITIONS }, (_, p) => (
            <Fragment key={p}>
              <button
                onClick={() => setPos(p)}
                className={`text-[11px] text-right pr-2 font-mono transition-colors ${p === pos ? "text-zinc-900 dark:text-zinc-100 font-bold" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"}`}
              >
                {p}
              </button>
              {Array.from({ length: DIMS }, (_, d) => {
                const v = encode(p, d, DIMS);
                const intensity = (v + 1) / 2; // normalize -1..1 to 0..1
                return (
                  <button
                    key={`${p}-${d}`}
                    onClick={() => setPos(p)}
                    className={`h-5 border transition-all ${p === pos ? "border-zinc-900 dark:border-zinc-100 border-2" : "border-transparent"}`}
                    style={{ backgroundColor: `rgba(139, 92, 246, ${0.1 + intensity * 0.75})` }}
                    aria-label={`position ${p}, dimension ${d}`}
                  />
                );
              })}
            </Fragment>
          ))}
        </div>

        <p className="mt-3 text-[12px] text-zinc-500 dark:text-zinc-400">
          Row <strong>{pos}</strong> selected — click any row to compare fingerprints. Notice: <span className="font-mono">dim 0</span> changes almost every row (the fast-ticking hand — great for telling neighbours apart), while the columns further right barely move over these 12 rows (the slow-ticking hands — great for telling distant positions apart). Together, every position — near or far — ends up with a fingerprint no other position shares.
        </p>
        <p className="mt-2 text-[11px] text-zinc-400">
          A bonus this buys almost for free: positions 3 and 4 end up with very similar fingerprints (both fast-hand columns are close), while position 3 and position 11 look quite different. The encoding doesn&apos;t just say <em>which</em> position a word is at — it says how far it is from every other position too.
        </p>
      </div>
    </figure>
  );
}
