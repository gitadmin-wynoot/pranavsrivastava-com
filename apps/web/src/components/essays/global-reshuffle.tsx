"use client";

import { useState } from "react";

/*
  GlobalReshuffle — the Jevons abundance doesn't land evenly. It meets a world
  split between ageing economies short of workers and young ones short of
  opportunity. Each region gets the upside and an honest caution. Figures are
  widely-cited estimates. SSR-stable, no API.
*/

type Region = {
  emoji: string;
  name: string;
  accent: string;
  stat: string;
  upside: string;
  caution: string;
};

const REGIONS: Region[] = [
  {
    emoji: "🇮🇳",
    name: "India",
    accent: "border-amber-500/40 bg-amber-500/5",
    stat: "Median age ~28; well over a million engineering graduates a year — the largest young technical workforce on Earth.",
    upside: "Cheap AI plus that much young talent — and public rails like UPI to build on — means the leap from an IT-services back office to a product-building nation. A generation that can finally build for its own billion.",
    caution: "The first jobs AI automates are exactly the entry-level IT and BPO rungs many climb first. The ladder has to be rebuilt higher, fast.",
  },
  {
    emoji: "🇺🇸",
    name: "United States",
    accent: "border-blue-500/40 bg-blue-500/5",
    stat: "Home to the frontier labs and the deepest pool of venture capital.",
    upside: "The fastest place to turn a cheap new capability into a whole new industry — and, historically, the fastest to invent the jobs that didn't exist yesterday.",
    caution: "The gains can pool at the top. Whether abundance becomes broad prosperity is a distribution question, not a technology one.",
  },
  {
    emoji: "🇨🇳",
    name: "China",
    accent: "border-rose-500/40 bg-rose-500/5",
    stat: "A vast STEM output and manufacturing base — but a workforce that peaked around 2015 and is now ageing.",
    upside: "AI as a force multiplier on the world's biggest factory floor, and a way to soften a shrinking labour pool. Scale meets automation.",
    caution: "High youth unemployment and 'involution' burnout are real; abundance has to translate into good jobs, not just output.",
  },
  {
    emoji: "🇯🇵",
    name: "Ageing economies",
    accent: "border-violet-500/40 bg-violet-500/5",
    stat: "Japan's median age is near 49; Europe and Korea face shrinking, greying workforces and rising numbers of retirees per worker.",
    upside: "Here AI isn't a job-thief — it's a gap-filler. When there simply aren't enough workers for the care, the clinics, the factories, a tireless digital colleague is a lifeline, not a threat.",
    caution: "It still has to be steered toward complementing people, especially in care, where the human part is the point.",
  },
  {
    emoji: "🌍",
    name: "Africa & the Global South",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    stat: "The youngest populations anywhere — much of sub-Saharan Africa's median age is under 20 — and the largest unmet needs.",
    upside: "This is where Jevons roars loudest. A cheap AI tutor, a first-line diagnostician, a legal helper — reaching hundreds of millions who never had access to any of it. Enormous latent demand, suddenly affordable to meet.",
    caution: "It needs the plumbing — connectivity, energy, trust, and tools in local languages — or the abundance stops at the border.",
  },
];

export function GlobalReshuffle() {
  const [i, setI] = useState(0);
  const r = REGIONS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        One paradox, a divided world — pick a place
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {REGIONS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${r.accent}`}>
          <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            <span aria-hidden="true">{r.emoji}</span> {r.name}
          </h4>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{r.stat}</p>
          <p className="mt-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20 px-3 py-2 text-[13px] leading-relaxed text-zinc-700 dark:text-zinc-200">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">The upside: </span>{r.upside}
          </p>
          <p className="mt-2 text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400">
            <span className="font-semibold text-amber-600 dark:text-amber-400">Honest caution: </span>{r.caution}
          </p>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Ageing economies are short of workers; young ones are short of opportunity. Cheap cognition, plus remote work, is a way to route one to the other — the biggest reshuffle of who-does-what since the container ship.
        </p>
      </div>
    </figure>
  );
}
