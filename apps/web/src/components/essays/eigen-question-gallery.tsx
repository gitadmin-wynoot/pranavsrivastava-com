"use client";

import { useState } from "react";

/*
  EigenQuestionGallery — seven real-life scenes, each with the noisy
  sub-questions everyone reaches for first and the one question underneath
  that actually decides it. Deliberately spans registers — a boardroom, a
  cancelled train, a kid's question — because judgment is the same muscle
  everywhere, not a special skill reserved for the big rooms. SSR-stable.
*/

type Scene = {
  emoji: string;
  place: string;
  accent: string;
  situation: string;
  noisy: string[];
  eigen: string;
  collapse: string;
};

const SCENES: Scene[] = [
  {
    emoji: "🕰️",
    place: "The boardroom",
    accent: "border-amber-500/40 bg-amber-500/5",
    situation: "Leadership says it plainly: \"we have to sell the time machine.\" Six months of engineering are already sunk into it, and a launch date has been announced to the board.",
    noisy: ["What do we price it at?", "Who's the target customer?", "Which channel do we launch through?", "What does the competitor response look like?"],
    eigen: "Is this actually good for humanity — or at least, not harmful to it?",
    collapse: "If the honest answer is no, the pricing model, the launch plan and the competitor analysis are all still true — and none of them matter. The whole decision collapses to zero the moment this one answer is no.",
  },
  {
    emoji: "👔",
    place: "Disagreeing with your boss",
    accent: "border-blue-500/40 bg-blue-500/5",
    situation: "Your manager wants to ship a feature you think is a mistake. The meeting is in ten minutes and you have to decide how hard to push back.",
    noisy: ["Will this make me look difficult?", "Is it worth the political capital?", "Am I more senior or are they?"],
    eigen: "Are we actually disagreeing about facts, or about values?",
    collapse: "If it's facts, more data settles it — go find the data. If it's values, no amount of data will ever settle it, and pushing harder with numbers just burns the relationship. Knowing which one you're in changes the entire next ten minutes.",
  },
  {
    emoji: "🌱",
    place: "A junior who wants the answer",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    situation: "Someone on your team is stuck, it's the third time this week, and they're just asking you to tell them the fix so everyone can move on.",
    noisy: ["Do I have time to teach right now?", "Will they think less of me if I don't just know it?", "Is this a fair use of a stand-up?"],
    eigen: "Will handing them the answer cost them the ability to find the next one alone?",
    collapse: "If yes, the fast fix is the expensive one — it just charges the bill later, to someone else, when they're stuck again with nobody around to ask.",
  },
  {
    emoji: "🧸",
    place: "A kid's hard question",
    accent: "border-rose-500/40 bg-rose-500/5",
    situation: "Your child wants to do something a little risky, or asks a question you weren't ready for, in front of other people.",
    noisy: ["What will the other parents think?", "Is it easier to just say no?", "Do I have the energy for this conversation right now?"],
    eigen: "Am I protecting them — or protecting myself from an awkward moment?",
    collapse: "Once you're honest about which one it is, the actual answer usually becomes obvious within a few seconds. Most parenting judgment calls aren't hard; they're just uncomfortable to look at directly.",
  },
  {
    emoji: "🚆",
    place: "The cancelled train",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    situation: "Your train is cancelled. You're going to be late. Everything about the next ten minutes feels urgent.",
    noisy: ["Should I call ahead right now?", "Should I sprint for another route?", "Whose fault is this and should I be angry about it?"],
    eigen: "Is this actually urgent — or does it just feel urgent because it's happening to me, right now?",
    collapse: "Nine times out of ten, being fifteen minutes late changes nothing that a two-line message doesn't fix. The panic is about losing control, not about the actual stakes — and most of a bad morning is spent solving the wrong problem.",
  },
  {
    emoji: "💰",
    place: "A big financial decision",
    accent: "border-violet-500/40 bg-violet-500/5",
    situation: "A large purchase or investment is in front of you — a house, a bet on a business, a decision that will take years to undo if it's wrong.",
    noisy: ["Can I afford the monthly payment?", "Is now a good time, market-wise?", "What will people think if I do this?"],
    eigen: "What has to be true for this to actually work out — and how likely is that, specifically?",
    collapse: "Most bad financial decisions aren't bad maths. They're a refusal to name the one assumption the whole thing is quietly resting on, and check it honestly before the money moves.",
  },
  {
    emoji: "🏢",
    place: "A hard-to-reverse business call",
    accent: "border-sky-500/40 bg-sky-500/5",
    situation: "A merger, a pivot, a decision to shut down a team — something that can't be quietly undone next quarter if it turns out wrong.",
    noisy: ["What will the board think?", "How does the market read this?", "What's the internal announcement plan?"],
    eigen: "If we're wrong, can we walk it back — and what does walking it back actually cost?",
    collapse: "This is Jeff Bezos's one-way-door test in disguise: a two-way door deserves speed and a light process; a one-way door deserves the opposite. Skipping this question is how reversible-feeling decisions turn out to have been one-way doors all along.",
  },
];

export function EigenQuestionGallery() {
  const [i, setI] = useState(0);
  const s = SCENES[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Seven rooms, one question each — pick one
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {SCENES.map((x, idx) => (
            <button
              key={x.place}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{x.emoji}</span>
              {x.place}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{s.emoji}</span> {s.place}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.situation}</p>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-zinc-400">Where attention goes first</p>
          <ul className="mt-1 space-y-1">
            {s.noisy.map((q, k) => (
              <li key={k} className="flex gap-2 text-[12.5px] text-zinc-500 dark:text-zinc-400">
                <span className="text-zinc-300 dark:text-zinc-600 shrink-0">•</span>
                <span className="italic">{q}</span>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">The eigen question</p>
          <p className="mt-0.5 text-[14px] font-semibold text-zinc-900 dark:text-zinc-100">{s.eigen}</p>

          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
            {s.collapse}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Notice the range — a boardroom and a cancelled train run on the exact same muscle. Judgment isn't a special skill reserved for the big rooms; it's a habit that's easier to build in the small ones.
        </p>
      </div>
    </figure>
  );
}
