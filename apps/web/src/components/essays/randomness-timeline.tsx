"use client";

import { useState } from "react";

/*
  RandomnessTimeline — the hunt for real chance, from a thrown bone to a
  qubit. Each stop names what it actually achieved and, honestly, what kind
  of "random" it really was — because most of this history is a story of
  randomness that turned out not to be. SSR-stable, no API.
*/

type Stop = {
  emoji: string;
  name: string;
  when: string;
  accent: string;
  what: string;
  honesty: string;
};

const STOPS: Stop[] = [
  {
    emoji: "🦴",
    name: "Knucklebones & dice",
    when: "5,000+ years ago",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "Humans threw bones and carved dice to let chance decide — games, divination, the fall of a kingdom (see the last Deep Roots).",
    honesty: "Not actually random. A thrown die obeys ordinary physics — spin, air, the table. Knowing the exact conditions would let you predict the face, in principle. It's unpredictable, not undetermined.",
  },
  {
    emoji: "📐",
    name: "Probability theory",
    when: "1654",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "Pascal and Fermat, corresponding about a gambler's betting dispute, worked out how to reason about chance mathematically for the first time.",
    honesty: "A theory of our ignorance, dressed up as a theory of chance — it describes what we can't predict about a die, not anything the die itself lacks.",
  },
  {
    emoji: "🖥️",
    name: "Pseudo-random numbers",
    when: "1946 onward",
    accent: "border-violet-500/40 bg-violet-500/5",
    what: "Von Neumann needed 'random' numbers for early computer simulations and built the first algorithm to fake them — a formula that looks random but is entirely deterministic.",
    honesty: "Not random at all, by design. Same seed in, same 'random' sequence out, every time — which is a feature, not a bug, for reproducible science and secretly a real weakness for cryptography.",
  },
  {
    emoji: "🌡️",
    name: "Entropy pools",
    when: "1990s onward",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    what: "Operating systems started harvesting genuinely messy physical noise — mouse movement, disk timing, thermal jitter in a chip — to seed their random number generators.",
    honesty: "Closer to real. This is classical chaos, not quantum indeterminacy — in principle still physics you could predict with enough precision, just spectacularly impractical to actually measure that precisely.",
  },
  {
    emoji: "⚛️",
    name: "Quantum RNGs",
    when: "2000s onward",
    accent: "border-rose-500/40 bg-rose-500/5",
    what: "Devices that measure a genuinely quantum event — a photon's path through a beam splitter, say — and read the outcome as a random bit.",
    honesty: "As far as physics can currently tell us, this is the real thing: not unpredictable because we haven't measured closely enough, but undetermined even in principle. See the next section for why we believe that.",
  },
  {
    emoji: "🧊",
    name: "Willow",
    when: "December 2024",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "Google's quantum chip ran a benchmark whose entire output is a giant, verifiable quantum-random fingerprint — and did it in minutes, not the practical lifetime of the universe.",
    honesty: "The most dramatic demonstration yet that quantum randomness isn't a lab curiosity — it's now a computation you can point at a specific chip, on a specific date, and measure.",
  },
];

export function RandomnessTimeline() {
  const [i, setI] = useState(0);
  const s = STOPS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The hunt for real chance — six attempts
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {STOPS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{s.emoji}</span> {s.name}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400">{s.when}</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.what}</p>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            <span className="font-semibold">How random, honestly: </span>{s.honesty}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Notice the shape of the whole story: for most of it, "random" meant "too complicated to predict," not "genuinely undetermined." That distinction is the entire subject of this essay.
        </p>
      </div>
    </figure>
  );
}
