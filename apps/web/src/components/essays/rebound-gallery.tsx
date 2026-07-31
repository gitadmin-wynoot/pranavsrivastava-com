"use client";

import { useState } from "react";

/*
  ReboundGallery — Jevons everywhere: each time we made something radically
  cheaper, total use went UP, and new kinds of work appeared. The bank-teller
  and accountant cases (James Bessen) are the ones that speak directly to AI.
  Figures are widely-cited estimates; SSR-stable, no API.
*/

type Case = {
  emoji: string;
  name: string;
  accent: string;
  cheaper: string;
  more: string;
  lesson: string;
};

const CASES: Case[] = [
  {
    emoji: "⛏️",
    name: "Coal & the steam engine",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    cheaper: "Watt's engine did the same work on far less coal.",
    more: "So steam power became worth it for a thousand new uses — mills, trains, ships — and Britain's total coal consumption soared. This is the original paradox Jevons wrote up in 1865.",
    lesson: "Efficiency doesn't shrink demand. It unlocks it.",
  },
  {
    emoji: "💻",
    name: "Computing",
    accent: "border-blue-500/40 bg-blue-500/5",
    cheaper: "The cost of a calculation fell roughly a trillion-fold.",
    more: "We did not compute less. We put a computer in every pocket, car, and doorbell, and invented the entire software and internet economy — and tens of millions of jobs that didn't exist before.",
    lesson: "Make a capability nearly free and it turns up everywhere.",
  },
  {
    emoji: "📷",
    name: "Photography",
    accent: "border-violet-500/40 bg-violet-500/5",
    cheaper: "Film cost money per shot; digital made a photo essentially free.",
    more: "In the film era the world took tens of billions of photos a year. It now takes something like 1.8 trillion — and built Instagram, phone cameras, and a creator economy on top.",
    lesson: "Near-zero cost doesn't end an activity; it explodes it.",
  },
  {
    emoji: "🏧",
    name: "ATMs & bank tellers",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    cheaper: "The ATM automated the core task of a bank teller: handling cash.",
    more: "So the obvious prediction was fewer tellers. Instead, the number of US tellers rose for decades — because cheaper branches meant banks opened far more of them, and tellers moved to relationship and sales work (the economist James Bessen's classic case).",
    lesson: "Automating a task is not the same as eliminating the job.",
  },
  {
    emoji: "📊",
    name: "Spreadsheets & accountants",
    accent: "border-amber-500/40 bg-amber-500/5",
    cheaper: "The spreadsheet automated hours of manual calculation.",
    more: "Routine bookkeeping clerks declined — but accountants, auditors and financial analysts grew, because cheap, instant calculation made far more financial analysis worth doing.",
    lesson: "Cheaper tools move people up the ladder, not off it.",
  },
  {
    emoji: "🌐",
    name: "Machine translation",
    accent: "border-rose-500/40 bg-rose-500/5",
    cheaper: "Translating a page went from costly and slow to instant and free.",
    more: "Demand for crossing languages didn't fall — it ballooned. A whole localisation industry grew, and businesses now reach markets that were never worth translating for before.",
    lesson: "Lower the cost of a bridge and far more people cross it.",
  },
];

export function ReboundGallery() {
  const [i, setI] = useState(3);
  const c = CASES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Every time — cheaper meant more, and new
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {CASES.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name.split(" & ")[0].split(" ")[0]}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${c.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{c.emoji}</span> {c.name}
          </h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">We made it cheaper</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.cheaper}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">…and got more, not less</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.more}</p>
            </div>
          </div>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">Lesson: </span>{c.lesson}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          The fear that AI eats a fixed pile of work is the "lump of labour" fallacy — and it has been wrong every single time, for two hundred years.
        </p>
      </div>
    </figure>
  );
}
