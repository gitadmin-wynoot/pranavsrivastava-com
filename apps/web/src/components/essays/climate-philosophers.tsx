"use client";

import { useState } from "react";

/*
  ClimatePhilosophers — how thinkers across the world and across 2,400 years have
  read the tie between climate, environment and the mind. Deliberately includes
  the dangerous determinist strand (Montesquieu) with its correction, and the
  inward Indian and Stoic answers. SSR-stable, no API.
*/

type Thinker = {
  emoji: string;
  name: string;
  place: string;
  era: string;
  accent: string;
  view: string;
};

const THINKERS: Thinker[] = [
  {
    emoji: "⚕️",
    name: "Hippocrates",
    place: "Greece",
    era: "~400 BCE",
    accent: "border-blue-500/40 bg-blue-500/5",
    view: "In Airs, Waters, Places he argued that a people's health and temperament are shaped by their climate and surroundings — the first Western attempt to link environment to the mind. A real insight, and the start of a very long, sometimes ugly, story.",
  },
  {
    emoji: "🕌",
    name: "Ibn Khaldun",
    place: "Tunis, North Africa",
    era: "1377",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    view: "In the Muqaddimah — arguably the first work of sociology — he tied the rise and fall of societies mostly to asabiyyah, social cohesion, not to weather. A subtler, earlier answer than Europe's: what makes a civilisation is its bonds, not its thermometer.",
  },
  {
    emoji: "⚠️",
    name: "Montesquieu",
    place: "France",
    era: "1748",
    accent: "border-rose-500/40 bg-rose-500/5",
    view: "In The Spirit of the Laws he claimed hot climates make people passive and servile, cold ones vigorous and free. Enormously influential — and wrong. This is the seed of 'climate determinism', later dressed up as race science to excuse empire. Worth knowing precisely so you can refuse it.",
  },
  {
    emoji: "🍃",
    name: "Kālidāsa",
    place: "India",
    era: "~5th century",
    accent: "border-amber-500/40 bg-amber-500/5",
    view: "In the Ṛtusaṃhāra, 'the medley of seasons', India's great poet reads the whole human heart through heat, monsoon and cool — longing, languor, renewal. Not climate as fate, but climate as feeling: the weather we carry inside us.",
  },
  {
    emoji: "🧘",
    name: "Patañjali",
    place: "India",
    era: "~2nd c. BCE",
    accent: "border-violet-500/40 bg-violet-500/5",
    view: "The Yoga Sūtras open by defining yoga as citta-vṛtti-nirodha — the stilling of the mind's fluctuations. And tapas (literally 'heat') is discipline itself: hardship, chosen on purpose, as fuel for clarity. The inward answer — master the mind, not the weather.",
  },
  {
    emoji: "🌳",
    name: "The Buddha",
    place: "India",
    era: "~5th c. BCE",
    accent: "border-yellow-500/40 bg-yellow-500/5",
    view: "The Middle Way: neither indulgence nor extreme austerity, but the balanced condition in which insight becomes possible. A 'temperate' path — for the inner life rather than the outer climate.",
  },
  {
    emoji: "🏛️",
    name: "Marcus Aurelius",
    place: "Rome",
    era: "~170 CE",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    view: "He wrote the Meditations on a freezing military frontier, and its whole thrust is the Stoic 'inner citadel': you don't govern the weather, only your response to it. \"You have power over your mind — not outside events.\"",
  },
  {
    emoji: "⛰️",
    name: "Nietzsche",
    place: "Switzerland (by way of everywhere)",
    era: "1880s",
    accent: "border-sky-500/40 bg-sky-500/5",
    view: "He literally shopped for a climate that suited his thinking, settling on the cool, clear Alpine air of Sils-Maria to write. \"Give no credence to any thought not born outdoors while moving about freely.\" Proof that even a philosopher tunes his environment to his mind.",
  },
  {
    emoji: "🌲",
    name: "Thoreau",
    place: "United States",
    era: "1854",
    accent: "border-blue-500/40 bg-blue-500/5",
    view: "At Walden Pond he stripped conditions to the bone to think clearly — \"to live deliberately\". A Western echo of the ascetic's bet: sometimes you sharpen the mind by simplifying, not softening, what surrounds it.",
  },
];

export function ClimatePhilosophers() {
  const [i, setI] = useState(3);
  const t = THINKERS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The weather and the mind — nine readings, across the world
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {THINKERS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${t.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{t.emoji}</span> {t.name}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400 text-right">{t.place} · {t.era}</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{t.view}</p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Two camps, really: those who ask how to <em>master the conditions</em> (Hippocrates, Montesquieu, Nietzsche), and those who ask how to <em>master the mind regardless of them</em> (Patañjali, the Buddha, the Stoics). Almost everything in this essay lives between those two.
        </p>
      </div>
    </figure>
  );
}
