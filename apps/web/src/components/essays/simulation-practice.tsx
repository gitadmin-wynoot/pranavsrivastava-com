"use client";

import { useState } from "react";

/*
  SimulationPractice — the disciplines that already figured out judgment is
  a rehearsable skill, and rehearse it somewhere failure is cheap before
  anyone is allowed near the real, expensive version. SSR-stable.
*/

type Field = {
  emoji: string;
  name: string;
  accent: string;
  what: string;
  lesson: string;
};

const FIELDS: Field[] = [
  {
    emoji: "✈️",
    name: "Pilots",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "A commercial pilot spends dozens of hours in a full-motion simulator — engine failures, storms, instrument loss — long before ever touching a real aircraft with passengers on it.",
    lesson: "The simulator doesn't just teach the mechanics. It teaches what panic feels like at altitude, cheaply, so the first time it happens for real isn't also the first time they've felt it.",
  },
  {
    emoji: "🩺",
    name: "Surgeons",
    accent: "border-rose-500/40 bg-rose-500/5",
    what: "Modern surgical training leans heavily on simulators — laparoscopic rigs, synthetic tissue, virtual-reality procedures — before a scalpel meets a real patient.",
    lesson: "A mistake in a simulator is a data point. The same mistake made for the first time on a real person is a tragedy. The whole point of the discipline is moving as many first mistakes as possible into the cheap column.",
  },
  {
    emoji: "♟️",
    name: "Games",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "Chess, poker, even the dice games five thousand years old — a good game is a decision-making rehearsal with the stakes turned all the way down and the feedback turned all the way up.",
    lesson: "I've written before about how old this instinct is — see The Oldest Game. Poker specifically forces you to act under real uncertainty with a real cost to being wrong, which is exactly the muscle a boardroom later asks you to use.",
  },
  {
    emoji: "🎭",
    name: "War-gaming a decision",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    what: "Some of the best-run companies rehearse a big call before making it — assigning people to argue the other side, running a premortem, imagining the decision has already failed and working backward to find out why.",
    lesson: "Shell famously used exactly this kind of scenario planning to be ready for the 1970s oil shock before it happened. The rehearsal doesn't predict the future. It stress-tests your judgment while being wrong still only costs a whiteboard.",
  },
];

export function SimulationPractice() {
  const [i, setI] = useState(0);
  const f = FIELDS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Where to fail first — cheaply, on purpose
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {FIELDS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${f.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{f.emoji}</span> {f.name}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{f.what}</p>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] leading-relaxed text-zinc-800 dark:text-zinc-100">
            {f.lesson}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          The common thread: none of these fields believe judgment arrives fully formed. They all built a cheap, repeatable place to get it wrong first.
        </p>
      </div>
    </figure>
  );
}
