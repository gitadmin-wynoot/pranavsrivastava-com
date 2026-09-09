"use client";

import { useState } from "react";

/*
  RandomnessSpectrum — three things people call "random," compared on the one
  question that actually distinguishes them: is the outcome undetermined, or
  merely unpredictable to us? SSR-stable, no API.
*/

type Kind = {
  emoji: string;
  name: string;
  accent: string;
  source: string;
  determined: string;
  test: string;
};

const KINDS: Kind[] = [
  {
    emoji: "🎲",
    name: "Classical",
    accent: "border-amber-500/40 bg-amber-500/5",
    source: "A rolled die, a shuffled deck, a coin flip, a lava lamp.",
    determined: "Yes, in principle. Ordinary physics is deterministic — the exact same starting conditions produce the exact same outcome, every time. We can't predict a die roll only because we can't measure the throw precisely enough.",
    test: "Improve your measurement enough (a robot arm throwing under controlled conditions has been done) and the 'randomness' visibly shrinks. That's the tell.",
  },
  {
    emoji: "🔢",
    name: "Pseudo-random",
    accent: "border-violet-500/40 bg-violet-500/5",
    source: "Almost every 'random' number a computer has ever given you — games, simulations, most everyday cryptography.",
    determined: "Completely. It's a deterministic formula run on a starting number (a seed). Same seed, same output, forever — which is precisely why it's useful, and precisely why it's not actually random.",
    test: "Feed it the same seed twice and check. If you get the same 'random' sequence both times — and you will — it was never random to begin with, only unpredictable if you don't know the seed.",
  },
  {
    emoji: "⚛️",
    name: "Quantum",
    accent: "border-rose-500/40 bg-rose-500/5",
    source: "Measuring a particle in superposition — which way a photon goes through a beam splitter, which spin state an electron collapses into.",
    determined: "No — as far as our best-tested physics says, genuinely not. Not 'we lack the information to predict it.' The standard reading of quantum mechanics is that no information exists anywhere, even in principle, that fixes the outcome in advance.",
    test: "Bell's theorem (1964), tested experimentally and closed of loopholes over decades — Nobel Prize, 2022 — ruled out the possibility that quantum outcomes are secretly determined by any 'hidden variable' we simply haven't found yet.",
  },
];

export function RandomnessSpectrum() {
  const [i, setI] = useState(2);
  const k = KINDS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Three things we call "random" — only one actually is
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex gap-1.5">
          {KINDS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`flex-1 inline-flex items-center justify-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${k.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{k.emoji}</span> {k.name} randomness
          </h4>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Where it shows up</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{k.source}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-rose-600 dark:text-rose-400">Is the outcome secretly determined?</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{k.determined}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">How we know</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{k.test}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          The word "random" has been doing double duty for centuries — hiding a real philosophical difference between "I can't predict this" and "nothing could predict this, ever." Quantum mechanics is the only place we've found the second kind.
        </p>
      </div>
    </figure>
  );
}
