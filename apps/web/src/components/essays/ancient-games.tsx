"use client";

import { useState } from "react";

/*
  AncientGames — a cheerful global gallery of the oldest games humans still play
  (or nearly). Light on apparatus, heavy on delight. SSR-stable, no API.
*/

type Game = {
  emoji: string;
  name: string;
  place: string;
  age: string;
  accent: string;
  how: string;
  delight: string;
};

const GAMES: Game[] = [
  {
    emoji: "🎲",
    name: "The Royal Game of Ur",
    place: "Mesopotamia",
    age: "~2600 BCE",
    accent: "border-amber-500/40 bg-amber-500/5",
    how: "A race for two: run seven pieces down a 20-square track, rolls decided by little pyramid dice, landing on a flower square earns another go.",
    delight: "Its rules were lost for millennia, then read off a clay tablet by the British Museum's Irving Finkel — who cheerfully lost a televised game of it. The oldest board game you can sit down and actually play.",
  },
  {
    emoji: "🏺",
    name: "Senet",
    place: "Ancient Egypt",
    age: "~3100 BCE",
    accent: "border-yellow-500/40 bg-yellow-500/5",
    how: "A race across 30 squares, moves thrown with flat casting-sticks instead of dice.",
    delight: "Egyptians played it for fun and for keeps: the board doubled as the soul's journey through the afterlife, so pharaohs — Tutankhamun included — were buried with a set for the road.",
  },
  {
    emoji: "⚫",
    name: "Go (Weiqi)",
    place: "China",
    age: "2,500+ years",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    how: "Two players, black stones and white, take turns placing them to surround territory. That's almost the whole rulebook.",
    delight: "From near-nothing rules comes a game deeper than chess — more possible positions than atoms in the observable universe. And it's still played today exactly as it was in Confucius's time.",
  },
  {
    emoji: "♟️",
    name: "Chess (Chaturanga)",
    place: "India",
    age: "~6th century CE",
    accent: "border-blue-500/40 bg-blue-500/5",
    how: "The 'four limbs' of an army — infantry, cavalry, elephants, chariots — became pawn, knight, bishop, rook as the game travelled west through Persia.",
    delight: "'Checkmate' is just Persian shah mat — 'the king is helpless.' You say a bit of medieval Persian every time you win.",
  },
  {
    emoji: "🎯",
    name: "Backgammon",
    place: "Persia & Rome",
    age: "~5,000-year lineage",
    accent: "border-rose-500/40 bg-rose-500/5",
    how: "Race your checkers home and bear them off, the dice giveth and taketh away.",
    delight: "It descends in a nearly unbroken line from Ur and the Roman game tabula — which means your pub backgammon set is a living fossil.",
  },
  {
    emoji: "🫘",
    name: "Mancala",
    place: "Africa & Asia",
    age: "ancient, and everywhere",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    how: "Scoop the seeds from a pit and 'sow' them one by one around the board, capturing as you go.",
    delight: "No board or pieces required — people have played it in scooped-out dirt with pebbles for as long as anyone can tell. Boards are found worn into ancient temple steps.",
  },
  {
    emoji: "🦴",
    name: "Knucklebones & dice",
    place: "the whole world",
    age: "prehistoric",
    accent: "border-violet-500/40 bg-violet-500/5",
    how: "Toss the little ankle-bones of a sheep — astragali — and read how they fall. Cubic dice came later.",
    delight: "Here's the kicker: humans gambled with these for roughly five thousand years before anyone worked out the actual odds. The maths of chance is younger than Shakespeare.",
  },
];

export function AncientGames() {
  const [i, setI] = useState(0);
  const g = GAMES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The oldest games we still play — pick one
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {GAMES.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.name.split(" (")[0]}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${g.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{g.emoji}</span> {g.name}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400 text-right">{g.place} · {g.age}</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{g.how}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400 italic">{g.delight}</p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Different continents, different millennia — and a child from any of them could sit at any of these boards and be playing within minutes. Games are the most portable thing we've ever made.
        </p>
      </div>
    </figure>
  );
}
