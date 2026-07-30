"use client";

import { useState } from "react";

/*
  InventionLessons — the transferable principles beneath the gallery, each with
  its exemplars across history and its concrete application for someone building
  with AI today. The inspiring part is that these are learnable habits, not
  personality. SSR-stable, no API.
*/

type Lesson = {
  title: string;
  accent: string;
  idea: string;
  who: string;
  today: string;
};

const LESSONS: Lesson[] = [
  {
    title: "Stand on shoulders",
    accent: "border-blue-500/40 bg-blue-500/5",
    idea: "\"If I have seen further, it is by standing on the shoulders of giants,\" wrote Newton — borrowing the line itself from Bernard of Chartres, four centuries earlier. Nobody invents alone; every idea has ancestors.",
    who: "al-Khwārizmī building openly on Indian numerals · Newton quoting the 12th century",
    today: "Build on open models, tools, and papers without shame. Originality is what you add on top, and crediting your giants is a strength, not a weakness.",
  },
  {
    title: "Test, don't trust",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    idea: "Ibn al-Haytham's rule — evidence outranks authority — is the whole engine of progress. The Wrights believed no published table until their own wind tunnel confirmed it, and half the accepted numbers were wrong.",
    who: "Ibn al-Haytham · the Wright brothers",
    today: "Trust evals over opinions. Ship the smallest test, watch what real users and real data do, and let that overrule the loudest voice — including your own.",
  },
  {
    title: "See past the use case",
    accent: "border-violet-500/40 bg-violet-500/5",
    idea: "Ada Lovelace saw a number-cruncher and imagined it composing music. Engelbart saw a calculator and imagined augmenting human thought. The tool in front of you is almost never the thing it will become.",
    who: "Ada Lovelace · Douglas Engelbart",
    today: "Don't just automate yesterday's task with AI. Ask what becomes possible that wasn't before — the real value is usually a new thing, not a faster old one.",
  },
  {
    title: "Cross the boundary",
    accent: "border-amber-500/40 bg-amber-500/5",
    idea: "The richest ideas live in the gaps between fields. Leonardo carried anatomy into art; al-Khwārizmī carried India into Baghdad; Grace Hopper carried human language into machines.",
    who: "Leonardo · al-Khwārizmī · Grace Hopper",
    today: "Your edge is AI × the domain you already know deeply. The people who win rarely know the most AI — they know one real field and bring AI to it.",
  },
  {
    title: "Persist through the winter",
    accent: "border-rose-500/40 bg-rose-500/5",
    idea: "Geoffrey Hinton worked on neural nets for ~30 unfashionable years before 2012 proved him right. James Dyson built 5,127 prototypes. Being early is indistinguishable from being wrong — until suddenly it isn't.",
    who: "Geoffrey Hinton · James Dyson · the Wrights",
    today: "Pick a conviction you can defend from first principles, then out-iterate the people who quit. The dip is where most competition disappears.",
  },
  {
    title: "Give it away",
    accent: "border-sky-500/40 bg-sky-500/5",
    idea: "Berners-Lee put the web in the public domain and it became the web. Jonas Salk was asked who owned the polio vaccine patent and replied, \"Could you patent the sun?\" Openness compounds in ways ownership can't.",
    who: "Tim Berners-Lee · Jonas Salk · open source",
    today: "Opening a tool, a dataset, or what you've learned often returns more than hoarding it — in trust, in a community that improves it, and in the standard everyone ends up building on.",
  },
];

export function InventionLessons() {
  const [i, setI] = useState(0);
  const l = LESSONS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Six habits the great ones share — and how to use each today
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {LESSONS.map((x, idx) => (
            <button
              key={x.title}
              onClick={() => setI(idx)}
              className={`rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              {x.title}
            </button>
          ))}
        </div>

        <div className={`mt-4 rounded-xl border p-4 ${l.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">{l.title}</h4>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{l.idea}</p>
          <p className="mt-2 text-[11px] text-zinc-400">{l.who}</p>
          <p className="mt-3 border-t border-zinc-200/70 dark:border-zinc-800 pt-3 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Building today: </span>{l.today}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          None of these is a talent you're born with. They're stances you can choose this afternoon — which is the most hopeful thing about the whole history of invention.
        </p>
      </div>
    </figure>
  );
}
