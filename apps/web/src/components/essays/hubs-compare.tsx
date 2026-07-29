"use client";

import { useState } from "react";

/*
  HubsCompare — the same winter is being answered very differently around the
  world. Pick a place and see its real edge, a couple of grounded facts, and the
  one transferable lesson. Not a league table — a set of strategies. SSR-stable.
*/

type Hub = {
  emoji: string;
  city: string;
  edge: string;
  accent: string;
  facts: string[];
  lesson: string;
};

const HUBS: Hub[] = [
  {
    emoji: "🌉",
    city: "Silicon Valley",
    edge: "Capital, and permission to fail",
    accent: "border-blue-500/40 bg-blue-500/5",
    facts: [
      "The densest concentration of venture capital on Earth, still setting the global price of ambition.",
      "A failed startup reads as a résumé line, not a scar — so people take the swing.",
    ],
    lesson: "Money follows conviction, and a culture that forgives the failed attempt gets more attempts.",
  },
  {
    emoji: "🔬",
    city: "Eindhoven · Brainport",
    edge: "Collaboration as a strategy",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    facts: [
      "Home to ASML — the only company that makes the EUV machines that print the world's most advanced chips.",
      "A 'triple helix': industry, universities, and government share one roadmap instead of three.",
    ],
    lesson: "A modest region can out-cooperate bigger, richer rivals by refusing to compete with itself.",
  },
  {
    emoji: "🪷",
    city: "Bengaluru · India",
    edge: "Public rails + a young workforce",
    accent: "border-amber-500/40 bg-amber-500/5",
    facts: [
      "UPI moves more than 10 billion payments a month — identity and payments built as public infrastructure, free to build on.",
      "A median age around 28: the demographic dividend the ageing world no longer has.",
    ],
    lesson: "Build the commons once — open rails everyone can build on — and a million businesses appear on top.",
  },
  {
    emoji: "⚙️",
    city: "Shenzhen · China",
    edge: "The speed and scale of making",
    accent: "border-rose-500/40 bg-rose-500/5",
    facts: [
      "Prototype to production in days, not quarters — the world's hardware workshop.",
      "Leads on electric vehicles and makes the majority of the planet's solar panels.",
    ],
    lesson: "Manufacturing muscle compounds — though 'involution' (神经内卷, burnout by over-competition) is the tax on it.",
  },
  {
    emoji: "🏛️",
    city: "Europe · Netherlands",
    edge: "Deep science, high trust, real quality of life",
    accent: "border-violet-500/40 bg-violet-500/5",
    facts: [
      "World-class research and rule-of-law; the place invents beautifully.",
      "The Draghi report (2024) named the gap plainly: great science, too little scale-up capital to keep it.",
    ],
    lesson: "Brilliant at inventing; the work now is getting as good at scaling what it invents.",
  },
];

export function HubsCompare() {
  const [i, setI] = useState(1);
  const h = HUBS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Same winter, five strategies — pick a place
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {HUBS.map((it, idx) => (
            <button
              key={it.city}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{it.emoji}</span>
              {it.city.split(" · ")[0]}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${h.accent}`}>
          <div className="flex items-baseline gap-2">
            <span aria-hidden="true" className="text-lg">{h.emoji}</span>
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{h.city}</h4>
          </div>
          <p className="mt-1 text-sm font-medium text-zinc-700 dark:text-zinc-300">{h.edge}</p>
          <ul className="mt-3 space-y-1.5">
            {h.facts.map((f, k) => (
              <li key={k} className="flex gap-2 text-[13px] leading-snug text-zinc-500 dark:text-zinc-400">
                <span className="text-zinc-300 dark:text-zinc-600 mt-0.5">•</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 border-t border-zinc-200/70 dark:border-zinc-800 pt-3 text-[13px] text-zinc-600 dark:text-zinc-300">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">The transferable lesson: </span>
            {h.lesson}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          No single place has the whole answer — which is the point. Capital, cooperation, public rails, making, and deep science are five moves on the same board.
        </p>
      </div>
    </figure>
  );
}
