"use client";

import { useState } from "react";

/*
  MachinesVsHumans — games as the benchmark of intelligence, from a hoax to
  self-taught superhuman play. Fun, current, and lightly data-backed.
  SSR-stable, no API.
*/

type Bout = {
  emoji: string;
  title: string;
  year: string;
  accent: string;
  what: string;
  why: string;
};

const BOUTS: Bout[] = [
  {
    emoji: "🎭",
    title: "The Mechanical Turk",
    year: "1770",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    what: "A chess-playing 'automaton' toured Europe beating nobles and, the story goes, Napoleon and Benjamin Franklin.",
    why: "It was a hoax — a human hidden in the cabinet. We faked artificial intelligence with a game some 250 years before we could build the real thing. (Amazon named a service after it.)",
  },
  {
    emoji: "🔴",
    title: "Checkers — Chinook",
    year: "1994 → 2007",
    accent: "border-rose-500/40 bg-rose-500/5",
    what: "Chinook took the human world title, and by 2007 checkers was 'solved' outright — perfect play, start to finish, is now known.",
    why: "The first game a machine didn't just win, but ran clean out of. Played perfectly by both sides, it's always a draw.",
  },
  {
    emoji: "♚",
    title: "Chess — Deep Blue",
    year: "1997",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "IBM's Deep Blue beat the reigning world champion, Garry Kasparov, 3½–2½.",
    why: "The first time a sitting world champion fell to a machine. Kasparov, rattled, accused it of playing too creatively to be a computer.",
  },
  {
    emoji: "⚫",
    title: "Go — AlphaGo",
    year: "2016",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "DeepMind's AlphaGo beat the legend Lee Sedol 4–1 at a game long thought a decade away for machines.",
    why: "In game two it played 'Move 37' — so alien that experts called it a mistake, until it won the game. A move roughly one human in ten thousand would make. Then Lee answered with his own divine 'Move 78'.",
  },
  {
    emoji: "🃏",
    title: "Poker — Libratus",
    year: "2017",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    what: "Libratus beat four top professionals at no-limit Texas Hold'em over 120,000 hands.",
    why: "Chess and Go show you everything; poker hides the cards and invites the lie. The machine learned to bluff — and to sniff one out.",
  },
  {
    emoji: "🎮",
    title: "StarCraft & Dota 2",
    year: "2019",
    accent: "border-violet-500/40 bg-violet-500/5",
    what: "AlphaStar reached Grandmaster at StarCraft II; OpenAI Five beat the Dota 2 world champions.",
    why: "Real-time, fog-of-war, split-second team games — messy and human — and still the machines climbed to the top. Many learned largely by playing themselves, millions of times over.",
  },
];

export function MachinesVsHumans() {
  const [i, setI] = useState(3);
  const b = BOUTS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Machines vs. humans — the games we used to prove ourselves
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {BOUTS.map((x, idx) => (
            <button
              key={x.title}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.title.split(" — ")[0].split(" & ")[0]}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${b.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{b.emoji}</span> {b.title}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400">{b.year}</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{b.what}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{b.why}</p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Every time we wanted to know how smart a mind — ours or a machine's — really was, we reached for a game. A game is a whole world with the edges drawn in: clean rules, a clear score, nowhere to hide.
        </p>
      </div>
    </figure>
  );
}
