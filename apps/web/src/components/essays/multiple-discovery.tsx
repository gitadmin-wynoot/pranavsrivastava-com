"use client";

import { useState } from "react";

/*
  MultipleDiscovery — the evidence that ideas arrive "when they are ripe", not
  when a lone genius shows up. A gallery of independent simultaneous discoveries,
  catalogued by Ogburn & Thomas (1922) and Merton (1961). SSR-stable, no API.
*/

type Item = {
  emoji: string;
  topic: string;
  people: string;
  when: string;
  gap: string;
  accent: string;
  note: string;
};

const ITEMS: Item[] = [
  {
    emoji: "📞",
    topic: "The telephone",
    people: "Alexander Graham Bell & Elisha Gray",
    when: "14 February 1876",
    gap: "the same day",
    accent: "border-blue-500/40 bg-blue-500/5",
    note: "Both filed at the US patent office within hours of each other. You cannot get riper than that — and yes, a lifetime of lawsuits followed.",
  },
  {
    emoji: "🧬",
    topic: "Natural selection",
    people: "Charles Darwin & Alfred Russel Wallace",
    when: "1858",
    gap: "read out together",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    note: "Wallace, sick with fever in the Malay Archipelago, posted Darwin the theory Darwin had quietly sat on for twenty years. They presented jointly, one month apart in age of idea.",
  },
  {
    emoji: "∫",
    topic: "Calculus",
    people: "Isaac Newton & Gottfried Leibniz",
    when: "1670s–1680s",
    gap: "roughly a decade — then a feud",
    accent: "border-violet-500/40 bg-violet-500/5",
    note: "Two men, two notations, one mathematics, and a priority war that poisoned English and Continental maths for a century.",
  },
  {
    emoji: "🧪",
    topic: "Oxygen",
    people: "Carl Wilhelm Scheele & Joseph Priestley",
    when: "1771–1774",
    gap: "about three years apart",
    accent: "border-amber-500/40 bg-amber-500/5",
    note: "Isolated independently before Lavoisier worked out what the stuff actually was. Three people circling the same gas.",
  },
  {
    emoji: "✈️",
    topic: "The jet engine",
    people: "Frank Whittle & Hans von Ohain",
    when: "the 1930s",
    gap: "the same decade, on opposing sides",
    accent: "border-sky-500/40 bg-sky-500/5",
    note: "Britain and Germany built it separately, in secret, each unaware of the other — until the war put both in the sky.",
  },
  {
    emoji: "⚡",
    topic: "Conservation of energy",
    people: "Mayer, Joule, Helmholtz (and more)",
    when: "the 1840s",
    gap: "within a few years",
    accent: "border-rose-500/40 bg-rose-500/5",
    note: "At least four people reached the same law almost together — the historian Thomas Kuhn's favourite proof that discovery is a group activity in disguise.",
  },
];

export function MultipleDiscovery() {
  const [i, setI] = useState(0);
  const it = ITEMS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Not one genius — the same idea, at the same time, in different heads
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {ITEMS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${it.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{it.topic}</h4>
            <span className="text-xs font-medium text-zinc-400">{it.when}</span>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{it.people}</p>
          <p className="mt-2 inline-flex rounded-full bg-zinc-900/5 dark:bg-zinc-100/10 px-2.5 py-0.5 text-[11px] font-semibold text-zinc-600 dark:text-zinc-300">
            apart by: {it.gap}
          </p>
          <p className="mt-3 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{it.note}</p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          The sociologist Robert Merton argued the "eureka moment of a lone genius" is the exception; the norm is the <em>multiple</em> — several people reaching the same idea once its ingredients exist. Ideas have a season.
        </p>
      </div>
    </figure>
  );
}
