"use client";

import { useState } from "react";

/*
  PanicPattern — the same three-beat story, told across 2,400 years, so the
  pattern is impossible to miss: a new tool arrives, people fear it will ruin
  us, and instead we adapt and end up with more. Every card has the identical
  shape on purpose. SSR-stable, no API.
*/

type Case = {
  emoji: string;
  thing: string;
  when: string;
  accent: string;
  fear: string;
  happened: string;
};

const CASES: Case[] = [
  {
    emoji: "✍️",
    thing: "Writing",
    when: "~370 BCE",
    accent: "border-amber-500/40 bg-amber-500/5",
    fear: "Socrates warned that writing would \"create forgetfulness\" — that people who could look things up would stop truly knowing them, and memory itself would rot.",
    happened: "Writing became the foundation of all knowledge, and we remember vastly more as a civilisation than any oral culture ever could. (We only know his worry because a student wrote it down.)",
  },
  {
    emoji: "📖",
    thing: "The printing press",
    when: "~1450s",
    accent: "border-blue-500/40 bg-blue-500/5",
    fear: "Scribes feared for their craft; authorities feared a flood of uncontrolled, dangerous books would unravel society.",
    happened: "Literacy spread, science took off, and whole new trades appeared — publishers, editors, journalists, and more writers than the scribes could ever have imagined.",
  },
  {
    emoji: "🧶",
    thing: "The power loom",
    when: "1811",
    accent: "border-rose-500/40 bg-rose-500/5",
    fear: "The Luddites smashed the machines, certain that mechanised weaving would destroy their livelihoods for good.",
    happened: "For their own generation the pain was real — that part isn't a myth. But cloth became cheap and abundant, textile work grew enormously, and 'Luddite' turned into a byword for fighting the future.",
  },
  {
    emoji: "🐎",
    thing: "The motor car",
    when: "~1900",
    accent: "border-yellow-500/40 bg-yellow-500/5",
    fear: "What becomes of the stable-hands, the farriers, the makers of buggy whips? A whole horse economy stared at extinction.",
    happened: "The horse economy did vanish — and the car economy that replaced it (factories, mechanics, roads, suburbs, motels) employed many times more people than the stables ever had.",
  },
  {
    emoji: "☎️",
    thing: "Automatic telephone switching",
    when: "~1920s",
    accent: "border-violet-500/40 bg-violet-500/5",
    fear: "Automatic exchanges would wipe out the vast army of switchboard operators — one of the era's biggest jobs.",
    happened: "That specific job faded, but telephony exploded into a global industry, and the calls it carried created more work than anyone could count.",
  },
  {
    emoji: "🎵",
    thing: "Recorded music",
    when: "1930s",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    fear: "The musicians' union fought 'canned music', sure that records and radio would kill live performance and put players out of work.",
    happened: "It reshaped the craft, yes — and grew music into a global industry many times larger, reaching billions who'd never have heard a live note.",
  },
  {
    emoji: "🔢",
    thing: "The pocket calculator",
    when: "1970s",
    accent: "border-sky-500/40 bg-sky-500/5",
    fear: "If machines do the sums, children will never learn arithmetic and a generation of clerks will be finished.",
    happened: "Maths teaching moved up a level to concepts and reasoning, and cheap calculation helped power the entire knowledge economy that followed.",
  },
  {
    emoji: "🤖",
    thing: "AI",
    when: "now",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    fear: "It will automate thinking itself, and there will be nothing left for people to do.",
    happened: "The story is still being written — but if you've read the seven cards above, you already know the shape it tends to take.",
  },
];

export function PanicPattern() {
  const [i, setI] = useState(0);
  const c = CASES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The same story, every time — 2,400 years of "this one will ruin us"
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {CASES.map((x, idx) => (
            <button
              key={x.thing}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.thing}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${c.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{c.emoji}</span> {c.thing}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400">{c.when}</span>
          </div>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">The fear</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.fear}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">What actually happened</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{c.happened}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Notice the shape never changes: a new tool, a sincere panic, real disruption for some — and then adaptation, and more. The fear is never entirely silly (the loom really did hurt the weavers). But the pattern is the most reliable thing in the history of technology.
        </p>
      </div>
    </figure>
  );
}
