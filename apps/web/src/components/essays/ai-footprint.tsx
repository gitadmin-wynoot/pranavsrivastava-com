"use client";

import { useState } from "react";
import { Zap, Droplet, Cloud } from "lucide-react";

/*
  AIFootprint — makes the physical cost of AI tangible. Pick an activity, from
  one chat reply up to training a frontier model, and see its energy (plus water
  and carbon where it matters) translated into things you can picture. Figures
  are published estimates, cited in the essay; they're rough by nature.
*/

type Stat = { icon: "energy" | "water" | "carbon"; big: string; sub: string };
type Item = { emoji: string; label: string; accent: string; stats: Stat[] };

const ICON = { energy: Zap, water: Droplet, carbon: Cloud };
const ICON_CLS = { energy: "text-amber-500", water: "text-sky-500", carbon: "text-zinc-400" };

const ITEMS: Item[] = [
  {
    emoji: "💬",
    label: "One AI chat reply",
    accent: "border-blue-500/40 bg-blue-500/5",
    stats: [
      { icon: "energy", big: "~2.9 Wh", sub: "about 10× a Google search — a few seconds of a bright lightbulb" },
      { icon: "water", big: "a few drops", sub: "a small pour of cooling water, shared across a handful of replies" },
    ],
  },
  {
    emoji: "🔍",
    label: "One web search",
    accent: "border-zinc-400/40 bg-zinc-400/5",
    stats: [{ icon: "energy", big: "~0.3 Wh", sub: "the cheap baseline — roughly a tenth of an AI reply" }],
  },
  {
    emoji: "📱",
    label: "Charging your phone",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    stats: [{ icon: "energy", big: "~12 Wh", sub: "for scale: one phone charge ≈ four AI replies" }],
  },
  {
    emoji: "🎬",
    label: "Streaming an hour of video",
    accent: "border-violet-500/40 bg-violet-500/5",
    stats: [{ icon: "energy", big: "~80–120 Wh", sub: "the thing you already do daily — dozens of AI replies' worth" }],
  },
  {
    emoji: "🏗️",
    label: "Training GPT-3, once",
    accent: "border-amber-500/40 bg-amber-500/5",
    stats: [
      { icon: "energy", big: "~1,287 MWh", sub: "≈ 120 average homes for an entire year" },
      { icon: "carbon", big: "~552 tonnes CO₂", sub: "≈ 120 petrol cars driven for a year" },
      { icon: "water", big: "~700,000 litres", sub: "≈ an Olympic pool, a third full — just for cooling" },
    ],
  },
  {
    emoji: "🌍",
    label: "The world's data centres, a year",
    accent: "border-rose-500/40 bg-rose-500/5",
    stats: [
      { icon: "energy", big: "~460 TWh (2022)", sub: "more electricity than many entire countries — heading toward ~1,000 TWh by 2026" },
    ],
  },
];

export function AIFootprint() {
  const [i, setI] = useState(0);
  const item = ITEMS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        What does it actually cost? — pick an activity
      </div>
      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {ITEMS.map((it, idx) => (
            <button
              key={it.label}
              onClick={() => setI(idx)}
              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] transition-colors ${idx === i ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span aria-hidden="true">{it.emoji}</span> {it.label}
            </button>
          ))}
        </div>

        <div className={`mt-4 grid gap-2.5 rounded-xl border p-4 ${item.accent} ${item.stats.length === 1 ? "sm:grid-cols-1" : item.stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
          {item.stats.map((s, k) => {
            const Icon = ICON[s.icon];
            return (
              <div key={k}>
                <div className={`mb-1 flex items-center gap-1.5 ${ICON_CLS[s.icon]}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{s.big}</p>
                <p className="mt-0.5 text-[12px] leading-snug text-zinc-500 dark:text-zinc-400">{s.sub}</p>
              </div>
            );
          })}
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Rough published estimates (see sources below). The catch: one reply is tiny — but multiply it by billions of replies a day, forever, and the small number is the one that scales.
        </p>
      </div>
    </figure>
  );
}
