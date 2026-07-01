"use client";

import { useState } from "react";

/*
  TelcoEraSlider — drag through time and watch what the phone network can do.
  From a closed dial-tone machine, to a programmable API, to an intelligent one.
  Makes the "history → present → future" roadmap something you feel by dragging.
*/

type Era = {
  from: number;
  name: string;
  tag: string;
  build: string;
  color: string; // tailwind text/border color base
  dot: string;
};

const ERAS: Era[] = [
  {
    from: 1995,
    name: "The dial-tone era",
    tag: "Rock-solid, and completely closed. Calls and texts work everywhere — but you can't build a thing on top.",
    build: "What you can build: nothing. It's a walled garden.",
    color: "text-amber-600 dark:text-amber-400 border-amber-500/40",
    dot: "bg-amber-500",
  },
  {
    from: 2008,
    name: "The app era",
    tag: "Messaging and calling become an API. A line of code can text any phone on Earth.",
    build: "What you can build: send an SMS or place a call from your app — no telco deal required.",
    color: "text-orange-600 dark:text-orange-400 border-orange-500/40",
    dot: "bg-orange-500",
  },
  {
    from: 2019,
    name: "The network-as-code era",
    tag: "The network's deep powers open up — location, SIM-swap checks, guaranteed speed — as standard APIs.",
    build: "What you can build: ask the network where a device really is, or for a guaranteed-fast connection for the next 10 minutes.",
    color: "text-blue-600 dark:text-blue-400 border-blue-500/40",
    dot: "bg-blue-500",
  },
  {
    from: 2028,
    name: "The intelligent network",
    tag: "AI on both sides: agents compose network powers into new flows, and the network tunes and heals itself.",
    build: "What you can build: an AI that verifies you, checks for fraud, and reserves bandwidth — all by itself, in one errand.",
    color: "text-emerald-600 dark:text-emerald-400 border-emerald-500/40",
    dot: "bg-emerald-500",
  },
];

function eraFor(year: number): number {
  let idx = 0;
  for (let i = 0; i < ERAS.length; i++) if (year >= ERAS[i].from) idx = i;
  return idx;
}

const MIN = 1995;
const MAX = 2035;

export function TelcoEraSlider() {
  const [year, setYear] = useState(2019);
  const idx = eraFor(year);
  const era = ERAS[idx];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Drag through time — watch the network wake up
      </div>

      <div className="p-5 sm:p-6">
        <div className="flex items-baseline justify-between">
          <span className={`text-2xl font-bold tabular-nums ${era.color.split(" ").slice(0, 2).join(" ")}`}>{year}</span>
          <span className="text-xs text-zinc-400">{MIN} — {MAX}</span>
        </div>

        <input
          type="range"
          min={MIN}
          max={MAX}
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="mt-2 w-full accent-blue-500"
        />

        {/* era ticks */}
        <div className="mb-4 flex justify-between">
          {ERAS.map((e, i) => (
            <button
              key={e.from}
              onClick={() => setYear(e.from)}
              className={`flex items-center gap-1.5 text-[10px] transition-opacity ${i === idx ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
            >
              <span className={`h-2 w-2 rounded-full ${e.dot}`} />
              <span className="text-zinc-500 dark:text-zinc-400">{e.from}</span>
            </button>
          ))}
        </div>

        <div className={`rounded-xl border p-4 ${era.color}`}>
          <h4 className={`text-base font-semibold ${era.color.split(" ").slice(0, 2).join(" ")}`}>{era.name}</h4>
          <p className="mt-1 text-[15px] leading-relaxed text-zinc-600 dark:text-zinc-300">{era.tag}</p>
          <p className="mt-2 text-sm font-medium text-zinc-700 dark:text-zinc-200">{era.build}</p>
        </div>
      </div>
    </figure>
  );
}
