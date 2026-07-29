"use client";

import { useState } from "react";

/*
  FourTurnings — the Strauss–Howe saeculum as four seasons you can click
  through, mapped to the most recent American cycle. Deliberately honest: a
  header note flags that this is a pattern, not a law. No API; SSR-stable.
*/

type Season = {
  key: string;
  season: string;
  emoji: string;
  years: string;
  accent: string; // full class strings for purge safety
  bar: string;
  mood: string;
  then: string;
  now: string | null;
};

const SEASONS: Season[] = [
  {
    key: "The High",
    season: "Spring",
    emoji: "🌱",
    years: "1946 – 1964",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    bar: "bg-emerald-500",
    mood: "Confident and conformist. Institutions feel strong; the collective outranks the individual.",
    then: "The post-war boom — the GI Bill, new suburbs, the Bretton Woods order, a country pointing itself at the moon. Built on the back of the last winter.",
    now: null,
  },
  {
    key: "The Awakening",
    season: "Summer",
    emoji: "☀️",
    years: "1964 – 1984",
    accent: "border-amber-500/40 bg-amber-500/5",
    bar: "bg-amber-500",
    mood: "A revolt against the order — inward-looking, values-first, impatient with the grey-flannel consensus.",
    then: "Civil rights, the counterculture, a generation asking what the machine was for. Not a crisis of survival — a crisis of meaning.",
    now: null,
  },
  {
    key: "The Unraveling",
    season: "Autumn",
    emoji: "🍂",
    years: "1984 – 2008",
    accent: "border-orange-500/40 bg-orange-500/5",
    bar: "bg-orange-500",
    mood: "Individualism peaks, trust in shared institutions drains away. Strong people, weak glue.",
    then: "Deregulation, culture wars, finance eating the economy. Everyone doing their own thing — right up until the thing broke.",
    now: null,
  },
  {
    key: "The Crisis",
    season: "Winter",
    emoji: "❄️",
    years: "2008 – ~2030s",
    accent: "border-blue-500/40 bg-blue-500/5",
    bar: "bg-blue-500",
    mood: "The old order cracks and everything is up for grabs — which is exactly when new orders get built.",
    then: "The 2008 crash, a pandemic, jittery geopolitics, a climate bill coming due, and AI arriving all at once. Winters feel like endings. Historically, they're construction sites.",
    now: "You are here.",
  },
];

export function FourTurnings() {
  const [i, setI] = useState(3);
  const s = SEASONS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        The saeculum — one long human lifetime, in four seasons
      </div>

      <div className="p-4 sm:p-5">
        {/* Season bar */}
        <div className="flex gap-1.5">
          {SEASONS.map((sc, idx) => (
            <button
              key={sc.key}
              onClick={() => setI(idx)}
              className="group flex-1 text-left"
              aria-label={sc.key}
            >
              <div
                className={`h-1.5 rounded-full transition-opacity ${sc.bar} ${idx === i ? "opacity-100" : "opacity-25 group-hover:opacity-60"}`}
              />
              <div className="mt-2 flex items-center gap-1">
                <span aria-hidden="true" className="text-sm">{sc.emoji}</span>
                <span
                  className={`text-[11px] font-medium leading-tight ${idx === i ? "text-zinc-900 dark:text-zinc-100" : "text-zinc-400"}`}
                >
                  {sc.season}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {s.key}
            </h4>
            <span className="text-xs font-medium text-zinc-400">{s.years}</span>
          </div>
          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{s.mood}</p>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-500 dark:text-zinc-400">{s.then}</p>
          {s.now && (
            <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-500 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500" />
              </span>
              {s.now}
            </p>
          )}
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          A pattern, not a law. The seasons are a lens, not a horoscope — useful because crises really are generative, not because history keeps a calendar.
        </p>
      </div>
    </figure>
  );
}
