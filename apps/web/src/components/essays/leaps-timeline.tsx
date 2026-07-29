"use client";

import { useState } from "react";

/*
  LeapsTimeline — out-of-the-box leaps across eras and geographies, each tagged
  with the thinking move it demonstrates. Deliberately accurate: real, documented
  work, carefully dated (Vedic vs classical distinguished), no pseudo-history.
  The point is the method, not a trophy cabinet. SSR-stable, no API.
*/

type Leap = {
  short: string;
  title: string;
  place: string;
  era: string;
  what: string;
  move: string;
  accent: string;
};

const LEAPS: Leap[] = [
  {
    short: "Śulba geometry",
    title: "The Śulba Sūtras",
    place: "India",
    era: "c. 800–500 BCE (Vedic)",
    what: "Manuals for building fire-altars that state the right-triangle relation later called Pythagoras', and give a strikingly accurate value for √2 — geometry born from a ritual constraint.",
    move: "First principles from a real-world constraint",
    accent: "border-emerald-500/40 bg-emerald-500/5",
  },
  {
    short: "Piṅgala's binary",
    title: "Piṅgala's metres",
    place: "India",
    era: "c. 300–200 BCE",
    what: "To enumerate poetic rhythms, Piṅgala used a binary system and an array (meru-prastāra) equivalent to Pascal's triangle and the Fibonacci sequence — combinatorics roughly two millennia before Europe named them.",
    move: "Abstract recombination — turning poetry into maths",
    accent: "border-violet-500/40 bg-violet-500/5",
  },
  {
    short: "Pāṇini",
    title: "Pāṇini's grammar",
    place: "India",
    era: "c. 500 BCE",
    what: "The Aṣṭādhyāyī describes Sanskrit as a formal system of ~4,000 ordered rules — a generative grammar so algorithmic that modern linguists and computer scientists study it as a precursor to formal language theory.",
    move: "Systems thinking — algorithms before computers",
    accent: "border-blue-500/40 bg-blue-500/5",
  },
  {
    short: "Zero",
    title: "Zero as a number",
    place: "India",
    era: "628 CE (classical, not Vedic)",
    what: "Brahmagupta gave the rules for arithmetic with śūnya — treating nothing as a quantity you can compute with. Place-value notation later travelled west through al-Khwārizmī and Fibonacci and rewired mathematics.",
    move: "The ultimate abstraction — nothing as something",
    accent: "border-amber-500/40 bg-amber-500/5",
  },
  {
    short: "Archimedes",
    title: "Archimedes' bath",
    place: "Syracuse",
    era: "c. 250 BCE",
    what: "The buoyancy principle is said to have arrived not at the desk but in the tub — the original \"Eureka\", the mind solving a loaded problem the moment it was allowed to wander.",
    move: "Incubation — step away and let it cook",
    accent: "border-sky-500/40 bg-sky-500/5",
  },
  {
    short: "Gutenberg",
    title: "Gutenberg's press",
    place: "Mainz",
    era: "c. 1440",
    what: "Movable type combined a wine press, a coin punch, and paper — three ordinary things from three trades, collided into the machine that rewired Europe.",
    move: "Recombination — old parts, new whole",
    accent: "border-rose-500/40 bg-rose-500/5",
  },
  {
    short: "Kepler",
    title: "Kepler's orbits",
    place: "Prague",
    era: "1609",
    what: "Kepler cracked planetary motion by reasoning through analogy — imagining the planets driven by something like clockwork and magnetism — long before the physics existed to justify it.",
    move: "Analogy across distant domains",
    accent: "border-violet-500/40 bg-violet-500/5",
  },
  {
    short: "Darwin & Wallace",
    title: "Natural selection",
    place: "England / the Malay Archipelago",
    era: "1858",
    what: "Two naturalists reached the same theory independently and presented it together — the clearest proof that the biggest ideas belong to their moment as much as to their author.",
    move: "The adjacent possible — the ripe idea, found twice",
    accent: "border-emerald-500/40 bg-emerald-500/5",
  },
  {
    short: "Microwave",
    title: "The microwave oven",
    place: "United States",
    era: "1945",
    what: "A chocolate bar melted in Percy Spencer's pocket as he stood near a radar magnetron. Thousands felt that warmth; one man asked why — and noticed.",
    move: "Serendipity — the prepared mind that notices",
    accent: "border-amber-500/40 bg-amber-500/5",
  },
  {
    short: "India Stack",
    title: "India Stack & UPI",
    place: "India",
    era: "2010s",
    what: "Identity and payments rebuilt as free public infrastructure anyone can build on — now moving 10+ billion payments a month. The same abstraction instinct, aimed at a billion people.",
    move: "Systems thinking — at national scale",
    accent: "border-blue-500/40 bg-blue-500/5",
  },
];

export function LeapsTimeline() {
  const [i, setI] = useState(0);
  const l = LEAPS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Leaps across time and place — and the move each one teaches
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {LEAPS.map((x, idx) => (
            <button
              key={x.short}
              onClick={() => setI(idx)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.short}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${l.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{l.title}</h4>
            <span className="text-[11px] font-medium text-zinc-400 text-right">{l.place}</span>
          </div>
          <p className="text-[11px] text-zinc-400">{l.era}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{l.what}</p>
          <p className="mt-3 inline-flex rounded-full bg-zinc-900/5 dark:bg-zinc-100/10 px-2.5 py-1 text-[12px] font-semibold text-zinc-700 dark:text-zinc-200">
            The move: {l.move}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Real, documented work, dated honestly — Vedic-era geometry and combinatorics are astonishing without any need to overclaim. Notice the moves repeat across three thousand years and every continent. That is the point: the method travels.
        </p>
      </div>
    </figure>
  );
}
