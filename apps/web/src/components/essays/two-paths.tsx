"use client";

import { useState } from "react";

/*
  TwoPaths — the two ancient answers to "how should the mind relate to its
  conditions?" Outward: control the environment so attention is free to build.
  Inward: train attention to be free of the environment. Most lives need both.
  SSR-stable, no API.
*/

type Path = {
  emoji: string;
  name: string;
  aim: string;
  accent: string;
  method: string;
  who: string;
  gift: string;
  trap: string;
  question: string;
};

const PATHS: Path[] = [
  {
    emoji: "🏙️",
    name: "Outward",
    aim: "Master the conditions, so the mind is free to build the world.",
    accent: "border-blue-500/40 bg-blue-500/5",
    method: "Neutralise discomfort — heating, cooling, light, shelter — and point all that freed attention outward, at problems to solve and things to make.",
    who: "The scientist, the founder, the modern city. The whole project of engineering ideal conditions and then getting to work in them.",
    gift: "Science, medicine, abundance, the lifting of billions out of mere survival. Almost everything we call progress.",
    trap: "You can spend your life perfecting the room and forget to ask what you came in to do — and cool your room while cooking the planet.",
    question: "Are my conditions serving my work, or have I mistaken comfort for the point?",
  },
  {
    emoji: "🏔️",
    name: "Inward",
    aim: "Master the mind, so it is free of the conditions entirely.",
    accent: "border-violet-500/40 bg-violet-500/5",
    method: "Use discomfort as a tool. The yogi in the Himalayan cold, the monk in the bare cell, the Stoic on the frozen frontier — stillness, not comfort, is the aim; hardship is the teacher (tapas literally means 'heat').",
    who: "Patañjali, the Buddha, the desert and mountain monastics, the Stoics — those who went to the quiet high corners to turn attention around, toward the self.",
    gift: "Equanimity that no heatwave can touch, and a kind of clarity the outward path can't buy — the freedom of not needing the room to be perfect.",
    trap: "Retreat can curdle into avoidance; 'going inward' can become a reason never to build anything or help anyone.",
    question: "Am I cultivating a mind that stays steady when the conditions aren't — or just waiting for them to improve?",
  },
];

export function InwardOutward() {
  const [i, setI] = useState(0);
  const p = PATHS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Two ways to relate to your conditions — which is yours?
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex gap-1.5">
          {PATHS.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[12px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${p.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{p.emoji}</span> The {p.name} path
          </h4>
          <p className="mt-1 text-sm font-medium italic text-zinc-700 dark:text-zinc-300">{p.aim}</p>

          <div className="mt-3 space-y-2 text-[13px] leading-relaxed">
            <p className="text-zinc-600 dark:text-zinc-300"><span className="font-semibold text-zinc-800 dark:text-zinc-100">How: </span>{p.method}</p>
            <p className="text-zinc-500 dark:text-zinc-400"><span className="font-semibold text-zinc-700 dark:text-zinc-200">Who: </span>{p.who}</p>
            <p className="text-emerald-700 dark:text-emerald-300"><span className="font-semibold">The gift: </span>{p.gift}</p>
            <p className="text-amber-700 dark:text-amber-300"><span className="font-semibold">The trap: </span>{p.trap}</p>
          </div>

          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] italic text-zinc-800 dark:text-zinc-100">
            {p.question}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          It isn't a contest — a whole life probably needs both, a warm room to build in and a still mind for when the room can't be warmed. The useful question is which one you've been neglecting.
        </p>
      </div>
    </figure>
  );
}
