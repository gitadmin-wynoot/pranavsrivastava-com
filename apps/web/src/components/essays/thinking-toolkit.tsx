"use client";

import { useState } from "react";

/*
  ThinkingToolkit — the recipe box. Eleven repeatable moves, split into "seeing
  ahead" (foresight) and "thinking sideways" (lateral). Each carries a one-line
  how-to, a real historical example, and who it suits. SSR-stable, no API.
*/

type Move = {
  name: string;
  family: "ahead" | "sideways";
  how: string;
  example: string;
  forWho: string;
};

const MOVES: Move[] = [
  {
    name: "First principles",
    family: "ahead",
    how: "Strip the problem to what must be true, then rebuild from the studs up.",
    example: "Aryabhata reasoned from fundamentals — c. 500 CE — that the Earth spins and only appears still, while the stars stay put.",
    forWho: "the analyst who wants to reason, not copy",
  },
  {
    name: "Invert",
    family: "ahead",
    how: "Ask how to guarantee failure — then simply avoid that. \"Invert, always invert.\"",
    example: "Carl Jacobi's maxim, Charlie Munger's lifelong habit: many hard problems dissolve when solved backwards.",
    forWho: "the worrier — turn anxiety into a checklist",
  },
  {
    name: "Second-order",
    family: "ahead",
    how: "Don't stop at the first result. Ask \"and then what?\" two or three moves on.",
    example: "Shell's scenario planners imagined an oil shock before 1973 — so when it came, they were the ones already prepared.",
    forWho: "the strategist playing a long game",
  },
  {
    name: "Read the S-curve",
    family: "ahead",
    how: "Every technology diffuses on an S-curve. Find where you are on it, and skate to where the puck is going.",
    example: "Everett Rogers mapped how innovations spread; Carlota Perez showed the golden age comes after the crash, not before.",
    forWho: "the one deciding when, not just what",
  },
  {
    name: "Pre-mortem",
    family: "ahead",
    how: "Imagine it's a year later and the thing failed. Write the autopsy now, then prevent it.",
    example: "Gary Klein's \"prospective hindsight\" reliably surfaces risks a hopeful team would otherwise talk itself past.",
    forWho: "the builder with a team to protect",
  },
  {
    name: "Analogy & blend",
    family: "sideways",
    how: "Borrow the shape of a solution from a far-off field and map it onto yours.",
    example: "Velcro came from burrs stuck to a dog; Kepler cracked the planets by imagining them run like clockwork.",
    forWho: "the explorer who reads widely",
  },
  {
    name: "Recombine",
    family: "sideways",
    how: "Most new ideas are two old ideas colliding. Collect parts from everywhere, then smash them together.",
    example: "Gutenberg's press = a wine press + a coin punch + paper. He invented almost nothing; he combined brilliantly.",
    forWho: "the maker with a full workbench",
  },
  {
    name: "Constrain on purpose",
    family: "sideways",
    how: "Add a hard limit. Scarcity forces the mind off the obvious path.",
    example: "Dr. Seuss wrote Green Eggs and Ham on a 50-word bet; Altshuller's TRIZ turns an engineering contradiction into an invention.",
    forWho: "anyone staring at a blank page",
  },
  {
    name: "Beginner's mind",
    family: "sideways",
    how: "Ask the naïve question the experts have stopped asking. The Zen word is shoshin.",
    example: "Outsiders routinely crack problems insiders can no longer see past — knowing less about why it \"can't work\".",
    forWho: "the newcomer or career-switcher",
  },
  {
    name: "Incubate",
    family: "sideways",
    how: "Load the problem hard, then deliberately walk away. The mind keeps solving it off-line.",
    example: "Poincaré's answer arrived as he stepped onto a bus; the \"shower thought\" is real — insight lights up a specific brain circuit (Kounios & Beeman).",
    forWho: "the over-thinker who won't put it down",
  },
  {
    name: "Broker weak ties",
    family: "sideways",
    how: "Stand between two worlds that don't talk to each other. The bridge sees combinations neither side can.",
    example: "Granovetter's \"strength of weak ties\"; Ronald Burt's \"structural holes\" — good ideas cluster at the gaps between groups.",
    forWho: "the connector who knows everyone",
  },
];

const fam = {
  ahead: { label: "Seeing ahead", cls: "text-blue-600 dark:text-blue-400", accent: "border-blue-500/40 bg-blue-500/5" },
  sideways: { label: "Thinking sideways", cls: "text-violet-600 dark:text-violet-400", accent: "border-violet-500/40 bg-violet-500/5" },
};

export function ThinkingToolkit() {
  const [i, setI] = useState(0);
  const m = MOVES[i];
  const f = fam[m.family];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The recipe box — eleven moves for seeing ahead and thinking sideways
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {MOVES.map((x, idx) => (
            <button
              key={x.name}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${x.family === "ahead" ? "bg-blue-500" : "bg-violet-500"}`} />
              {x.name}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${f.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{m.name}</h4>
            <span className={`text-[11px] font-semibold ${f.cls}`}>{f.label}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{m.how}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{m.example}</p>
          <p className="mt-3 border-t border-zinc-200/70 dark:border-zinc-800 pt-2 text-[12px] text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-zinc-700 dark:text-zinc-300">Best for: </span>{m.forWho}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          <span className="text-blue-500">●</span> seeing ahead &nbsp;·&nbsp; <span className="text-violet-500">●</span> thinking sideways. You don't need all eleven — you need the two or three that fit how your head actually works.
        </p>
      </div>
    </figure>
  );
}
