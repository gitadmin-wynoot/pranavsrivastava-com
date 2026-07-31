"use client";

import { useState } from "react";

/*
  PriceOfLight — the single best illustration of Jevons: as light got radically
  cheaper, we didn't buy less light, we drowned the world in it. Labour-cost
  figures are illustrative orders of magnitude, after William Nordhaus's classic
  study of the history of lighting. SSR-stable, no API.
*/

type Era = {
  emoji: string;
  source: string;
  when: string;
  labour: string; // human-scale "work for an hour of good light"
  bar: number; // relative labour cost, log-ish, for the shrinking bar (0–100)
  did: string;
  accent: string;
};

const ERAS: Era[] = [
  {
    emoji: "🏺",
    source: "Sesame-oil lamp",
    when: "Babylon, ~1750 BCE",
    labour: "the better part of a day's work",
    bar: 100,
    did: "You lit a lamp for something that mattered, and otherwise you lived by the sun. Darkness owned half of every life.",
    accent: "border-amber-500/40 bg-amber-500/5",
  },
  {
    emoji: "🕯️",
    source: "Tallow candle",
    when: "~1800",
    labour: "roughly an hour of work for an hour of dim light",
    bar: 42,
    did: "Still dear enough to ration. Households owned a handful of candles and blew them out to save them.",
    accent: "border-yellow-500/40 bg-yellow-500/5",
  },
  {
    emoji: "🛢️",
    source: "Kerosene lamp",
    when: "~1880s",
    labour: "a few minutes' work",
    bar: 24,
    did: "Suddenly ordinary people could read at night. Evening — a whole second half of the day — opened up.",
    accent: "border-orange-500/40 bg-orange-500/5",
  },
  {
    emoji: "💡",
    source: "Incandescent bulb",
    when: "~1920s",
    labour: "a minute or two",
    bar: 15,
    did: "Cities switched on. We lit streets, shops, factories running through the night — and never once thought to use less.",
    accent: "border-blue-500/40 bg-blue-500/5",
  },
  {
    emoji: "🔦",
    source: "Fluorescent tube",
    when: "~1990s",
    labour: "a second or two",
    bar: 7,
    did: "Light became something you left on without thinking. The whole built world glowed by default.",
    accent: "border-emerald-500/40 bg-emerald-500/5",
  },
  {
    emoji: "✨",
    source: "LED",
    when: "today",
    labour: "the blink of an eye",
    bar: 1.5,
    did: "Now we light things for fun — fairy lights, phone screens, whole skylines that pulse in colour. A modern person uses on the order of a hundred thousand times more artificial light than someone in 1800.",
    accent: "border-violet-500/40 bg-violet-500/5",
  },
];

export function PriceOfLight() {
  const [i, setI] = useState(5);
  const e = ERAS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The price of light — collapsing for 3,000 years
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {ERAS.map((x, idx) => (
            <button
              key={x.source}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.source.split(" ")[0]}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${e.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{e.emoji}</span> {e.source}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400">{e.when}</span>
          </div>

          <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">Work for an hour of good light</p>
          <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">{e.labour}</p>
          <div className="mt-2 h-2 w-full rounded-full bg-zinc-200/70 dark:bg-zinc-800">
            <div className="h-2 rounded-full bg-amber-500 transition-all" style={{ width: `${e.bar}%` }} />
          </div>

          <p className="mt-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{e.did}</p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Cheaper light never meant we used less of it. It meant we banished the dark. (Labour costs illustrative, after William Nordhaus's history of lighting.) Now watch what happens when the thing getting cheap is <em>thinking</em>.
        </p>
      </div>
    </figure>
  );
}
