"use client";

import { useState } from "react";

/*
  FraudPatternGallery — the actual taxonomy, plainly explained, each with the
  one question that catches it. Not a listicle for its own sake — the point
  is that "fraud" is six or seven distinct, learnable patterns, not one
  vague fear. SSR-stable, no API.
*/

type Pattern = {
  emoji: string;
  name: string;
  accent: string;
  what: string;
  catch_: string;
};

const PATTERNS: Pattern[] = [
  {
    emoji: "🔓",
    name: "Account takeover",
    accent: "border-rose-500/40 bg-rose-500/5",
    what: "Someone else logs in as your user — usually with a password leaked from an unrelated breach, tried across a thousand other sites until one sticks.",
    catch_: "Does a login from a new device or location trigger anything, or does the system treat every successful password as automatically trustworthy?",
  },
  {
    emoji: "🧬",
    name: "Synthetic identity fraud",
    accent: "border-violet-500/40 bg-violet-500/5",
    what: "A real social security or ID number, borrowed and blended with a made-up name and history — a person who passes every individual check because none of the pieces are, on their own, fake.",
    catch_: "Are we checking that the pieces belong together, or just that each piece individually looks valid?",
  },
  {
    emoji: "🎁",
    name: "Promo & referral abuse",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "One person, a hundred fake accounts, a hundred sign-up bonuses — 'pumping' the referral program rather than the product.",
    catch_: "What does the cost look like if 1% of our growth number is actually one person with a script?",
  },
  {
    emoji: "💳",
    name: "Card testing",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "Small, automated charges run against stolen card numbers to find which ones still work, before a much larger charge follows.",
    catch_: "Would we even notice a thousand $1 charges failing in the same minute, or does that just look like normal traffic?",
  },
  {
    emoji: "↩️",
    name: "Chargeback fraud",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    what: "A genuine purchase, disputed after the fact as 'unauthorised' — 'friendly fraud,' which is a strange name for something that costs real merchants real money.",
    catch_: "Do we have the evidence trail to contest a false dispute, or are we simply eating every chargeback as a cost of doing business?",
  },
  {
    emoji: "🤖",
    name: "Bot & click traffic",
    accent: "border-sky-500/40 bg-sky-500/5",
    what: "Automated traffic dressed up as human interest — inflating ad spend, skewing analytics, or quietly pumping engagement numbers that mean nothing.",
    catch_: "If we removed every session under half a second long, how different would our numbers actually look?",
  },
];

export function FraudPatternGallery() {
  const [i, setI] = useState(0);
  const p = PATTERNS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        "Fraud" isn't one thing — six patterns, each learnable
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {PATTERNS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${p.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{p.emoji}</span> {p.name}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.what}</p>
          <p className="mt-3 rounded-lg bg-zinc-900/5 dark:bg-zinc-100/10 px-3 py-2 text-[13px] italic text-zinc-800 dark:text-zinc-100">
            {p.catch_}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          None of these need a security team to reason about. They need someone in the design review willing to ask, plainly, "and how would someone abuse this?" — a habit, not a credential.
        </p>
      </div>
    </figure>
  );
}
