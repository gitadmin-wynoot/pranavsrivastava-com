"use client";

import { useState } from "react";

/*
  OriginLedger — setting the record straight, carefully. For several ideas that
  quietly run modern life, this shows where they actually originated, how they
  travelled, and the name they picked up on the way — often one that erased the
  source. Grounded in mainstream history of mathematics (Plofker; G.G. Joseph).
  SSR-stable, no API.
*/

type Entry = {
  emoji: string;
  topic: string;
  accent: string;
  origin: string;
  travelled: string;
  named: string;
};

const ENTRIES: Entry[] = [
  {
    emoji: "🔢",
    topic: "The digits 0–9",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    origin: "India — the decimal place-value system, in use by Āryabhaṭa's time (499 CE), the glyphs evolving from earlier Brahmi numerals.",
    travelled: "Carried to Baghdad, where al-Khwārizmī's arithmetic (c. 825) was titled On Indian Reckoning; its Latin translation was Algoritmi de numero Indorum — 'al-Khwārizmī on the numbers of the Indians'. Fibonacci (1202) called the method modus Indorum, 'the way of the Indians'.",
    named: "Europe settled on 'Arabic numerals' — yet Arabic itself called them al-arqām al-hindiyya, 'the Indian numerals'. Everyone in the chain credited India except the people who inherited them last.",
  },
  {
    emoji: "⭕",
    topic: "Zero, as a number",
    accent: "border-blue-500/40 bg-blue-500/5",
    origin: "India — Brahmagupta's Brāhmasphuṭasiddhānta (628 CE) gives the first known rules for calculating with zero itself, not merely as a placeholder.",
    travelled: "Into Arabic as ṣifr ('empty'), then Latin zephirum.",
    named: "That one Arabic word split, in Europe, into two English ones: zero and cipher. Placeholder-zeros arose separately in Babylon and among the Maya — but zero as a quantity you can compute with is Brahmagupta's.",
  },
  {
    emoji: "➖",
    topic: "Negative numbers",
    accent: "border-violet-500/40 bg-violet-500/5",
    origin: "India — Brahmagupta (628 CE) again, with full rules stated as 'fortunes and debts'.",
    travelled: "West through the same Arabic-to-Latin pipeline.",
    named: "Europe resisted for a thousand years — Descartes still called them 'false roots' in the 1600s. An idea can be complete in one civilisation while another refuses to believe it.",
  },
  {
    emoji: "📐",
    topic: "The sine (trigonometry)",
    accent: "border-amber-500/40 bg-amber-500/5",
    origin: "India — Āryabhaṭa's half-chord function, jyā, is the direct ancestor of the modern sine (the Greeks worked with full chords instead).",
    travelled: "Sanskrit jyā became Arabic jība — then a later reader misread it as jaib, 'fold' or 'bay'.",
    named: "Latin translated that as sinus — a bay — giving us 'sine'. The word we use every day is a mistranslation that wrote the Sanskrit out of its own idea.",
  },
  {
    emoji: "♾️",
    topic: "Infinite series (the seeds of calculus)",
    accent: "border-rose-500/40 bg-rose-500/5",
    origin: "India — Mādhava and the Kerala school (c. 1350–1425) derived power series for sine, cosine and arctangent, and the series for π now called 'Mādhava–Leibniz' — some 250–300 years before Newton and Leibniz.",
    travelled: "Whether it reached Europe (possibly via Jesuit missionaries in Kerala) is argued by some historians and remains unproven — Newton and Leibniz very likely re-found it independently.",
    named: "The priority is documented and Indian; the European names stuck because the European textbooks did. Both can be true: Mādhava was first, and Newton was original.",
  },
  {
    emoji: "🔤",
    topic: "The words 'algorithm' & 'algebra'",
    accent: "border-sky-500/40 bg-sky-500/5",
    origin: "Baghdad — genuinely al-Khwārizmī's: 'algebra' from the title al-jabr, 'algorithm' from his own name.",
    travelled: "Straight into European mathematics and never left.",
    named: "But keep the two things apart: the names are Arabic, while much of the mathematics they carry — the numerals, the zero — is Indian. Naming a thing and originating it are not the same act.",
  },
];

export function OriginLedger() {
  const [i, setI] = useState(0);
  const e = ENTRIES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Setting the ledger straight — origin, journey, and the name it got
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {ENTRIES.map((x, idx) => (
            <button
              key={x.topic}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.topic}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${e.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{e.topic}</h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">Originated</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{e.origin}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">How it travelled</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{e.travelled}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">The name it got</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{e.named}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Sourced to mainstream history of mathematics — Kim Plofker's <em>Mathematics in India</em> and George Gheverghese Joseph's <em>The Crest of the Peacock</em>. No embellishment needed; the documented record is remarkable on its own.
        </p>
      </div>
    </figure>
  );
}
