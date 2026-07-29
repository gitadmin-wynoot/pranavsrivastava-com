"use client";

import { useState } from "react";

/*
  PratyaharaIndex — Pāṇini's Śiva Sūtras: the 14 short lines that list the sounds
  of Sanskrit, each ending in a silent "marker" letter. A pratyāhāra names any
  natural class of sounds with just two symbols — a start sound and a marker —
  selecting the contiguous run between them. It is a compression / indexing
  scheme a modern engineer would recognise on sight. SSR-stable, no API.

  Highlight ranges are indices into the flat phoneme list (markers excluded),
  hard-coded and verified so the selection is exactly right.
*/

const SUTRAS: { ph: string[]; marker: string }[] = [
  { ph: ["a", "i", "u"], marker: "ṇ" },
  { ph: ["ṛ", "ḷ"], marker: "k" },
  { ph: ["e", "o"], marker: "ṅ" },
  { ph: ["ai", "au"], marker: "c" },
  { ph: ["h", "y", "v", "r"], marker: "ṭ" },
  { ph: ["l"], marker: "ṇ" },
  { ph: ["ñ", "m", "ṅ", "ṇ", "n"], marker: "m" },
  { ph: ["jh", "bh"], marker: "ñ" },
  { ph: ["gh", "ḍh", "dh"], marker: "ṣ" },
  { ph: ["j", "b", "g", "ḍ", "d"], marker: "ś" },
  { ph: ["kh", "ph", "ch", "ṭh", "th", "c", "ṭ", "t"], marker: "v" },
  { ph: ["k", "p"], marker: "y" },
  { ph: ["ś", "ṣ", "s"], marker: "r" },
  { ph: ["h"], marker: "l" },
];

const PRATYAHARAS: { code: string; range: [number, number]; gloss: string }[] = [
  { code: "aṆ", range: [0, 3], gloss: "the basic vowels — a, i, u" },
  { code: "iK", range: [1, 5], gloss: "the simple vowels — i, u, ṛ, ḷ" },
  { code: "aC", range: [0, 9], gloss: "all the vowels" },
  { code: "yaṆ", range: [10, 14], gloss: "the semivowels — y, v, r, l" },
  { code: "haL", range: [9, 43], gloss: "all the consonants" },
  { code: "aL", range: [0, 43], gloss: "every sound in the language" },
];

export function PratyaharaIndex() {
  const [sel, setSel] = useState(2); // aC
  const [lo, hi] = PRATYAHARAS[sel].range;

  let flat = -1; // running index into the phoneme list (markers excluded)

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Pāṇini's index — name any set of sounds with two letters
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {PRATYAHARAS.map((p, idx) => (
            <button
              key={p.code}
              onClick={() => setSel(idx)}
              className={`rounded-full border px-2.5 py-1 text-[12px] font-mono transition-colors ${idx === sel ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {p.code}
            </button>
          ))}
        </div>

        <p className="mt-3 text-[13px] text-zinc-500 dark:text-zinc-400">
          <span className="font-mono font-semibold text-zinc-800 dark:text-zinc-100">{PRATYAHARAS[sel].code}</span>{" "}
          selects {PRATYAHARAS[sel].gloss}.
        </p>

        <div className="mt-3 space-y-1">
          {SUTRAS.map((s, si) => (
            <div key={si} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-right text-[10px] tabular-nums text-zinc-300 dark:text-zinc-600">{si + 1}</span>
              <div className="flex flex-wrap items-center gap-1">
                {s.ph.map((p) => {
                  flat += 1;
                  const on = flat >= lo && flat < hi;
                  return (
                    <span
                      key={`${si}-${p}-${flat}`}
                      className={`inline-flex h-6 min-w-[24px] items-center justify-center rounded px-1 text-[13px] transition-colors ${on ? "bg-amber-500/90 text-white font-semibold" : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"}`}
                    >
                      {p}
                    </span>
                  );
                })}
                <span className="inline-flex h-6 items-center justify-center rounded px-1 text-[12px] italic text-zinc-400 border border-dashed border-zinc-300 dark:border-zinc-700">
                  {s.marker}
                </span>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          The dashed letters are silent <em>markers</em>, not sounds — they exist only to mark the ends of ranges. A pratyāhāra is a start-sound plus a marker, and it means &ldquo;everything from here to there.&rdquo; Two symbols, any class of sounds: a data structure, written ~2,500 years ago.
        </p>
      </div>
    </figure>
  );
}
