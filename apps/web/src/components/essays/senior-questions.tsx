"use client";

import { useState } from "react";

/*
  SeniorQuestions — the actual questions, organised by domain. The point
  isn't the answer; a junior engineer can usually find the answer once
  someone points at the right question. Knowing which question to ask first
  is most of what "senior" means in practice. SSR-stable, no API.
*/

type Domain = {
  emoji: string;
  name: string;
  accent: string;
  questions: string[];
  why: string;
};

const DOMAINS: Domain[] = [
  {
    emoji: "🛡️",
    name: "Trust & fraud",
    accent: "border-rose-500/40 bg-rose-500/5",
    questions: [
      "If I were an attacker, what's the cheapest way to abuse this — and at what scale does it become worth their time?",
      "What's our false-positive cost? How many honest users do we block to catch one bad actor, and who's actually paying that cost?",
      "Is this control reversible, or does a mistake lock someone out permanently?",
    ],
    why: "Anyone can propose a control once fraud shows up. The senior version asks about the honest majority first — because a control that quietly costs you 2% of good users is a business decision wearing a security costume.",
  },
  {
    emoji: "🎯",
    name: "Product & audience",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    questions: [
      "Who are we explicitly not building this for — and have we said that out loud, to the team, not just to ourselves?",
      "What's the smallest market we could be unmistakably the best choice for?",
      "What would have to be true for this to fail — and can we check that before we build it, not after?",
    ],
    why: "A roadmap full of yeses is usually a roadmap with no positioning. Saying no in public, early, is the uncomfortable part — and it's the part that actually separates strategy from a features list.",
  },
  {
    emoji: "🏗️",
    name: "Systems & scale",
    accent: "border-blue-500/40 bg-blue-500/5",
    questions: [
      "What's the blast radius if this is wrong — one user, one region, or everyone at once?",
      "What happens at ten times today's volume — does this degrade gracefully or fall off a cliff?",
      "Who gets paged at 3am, and can they actually fix it without waking me up too?",
    ],
    why: "Junior engineers optimise for the happy path. Senior ones spend most of their design time on the other 5% — because that 5% is where the on-call rotation actually lives.",
  },
  {
    emoji: "🚁",
    name: "Safety-critical",
    accent: "border-amber-500/40 bg-amber-500/5",
    questions: [
      "What's the failure mode if this component goes silent mid-operation — does the system fail safe, or just fail?",
      "Is there a human in the loop for the decisions that actually matter, and can they override in time to matter?",
      "What does the regulator need to see, and have we built the audit trail in from day one instead of bolting it on later?",
    ],
    why: "This is where fraud-thinking and systems-thinking merge into something stricter: in a drone or an IoT fleet, 'we'll patch it in the next release' isn't always an option once the thing is in the air or in someone's home.",
  },
  {
    emoji: "🧭",
    name: "Leadership",
    accent: "border-violet-500/40 bg-violet-500/5",
    questions: [
      "How do I decide when the room doesn't agree, and how do I say so without pretending we do?",
      "What's my job in the room when I'm the one who was wrong?",
      "Am I building people who'll catch my blind spots, or people who'll just agree with me faster?",
    ],
    why: "The research here (Amy Edmondson's work on psychological safety, in particular) is unambiguous: teams that can say 'I think this is wrong' outperform teams that can't, by a wide margin. Building that room is the actual job.",
  },
];

export function SeniorQuestions() {
  const [i, setI] = useState(0);
  const d = DOMAINS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The questions, by domain — the answer usually follows
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {DOMAINS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${d.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{d.emoji}</span> {d.name}
          </h4>
          <ul className="mt-3 space-y-2">
            {d.questions.map((q, k) => (
              <li key={k} className="flex gap-2 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
                <span className="text-zinc-300 dark:text-zinc-600 mt-0.5 shrink-0">•</span>
                <span className="italic">{q}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] text-zinc-800 dark:text-zinc-100">
            {d.why}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Five domains, fifteen questions — and if you look closely, they're all the same three questions wearing different clothes: what could go wrong, who pays for it, and can we take it back.
        </p>
      </div>
    </figure>
  );
}
