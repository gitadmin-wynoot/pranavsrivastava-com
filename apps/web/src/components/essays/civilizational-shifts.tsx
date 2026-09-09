"use client";

import { useState } from "react";

/*
  CivilizationalShifts — the real precedents for "a general-purpose technology
  changes almost everything at once." Each with the industries it hit hardest
  and, honestly, how long the adjustment actually took — because that's the
  part hype always drops. SSR-stable, no API.
*/

type Shift = {
  emoji: string;
  name: string;
  when: string;
  accent: string;
  what: string;
  industries: string;
  adjustment: string;
};

const SHIFTS: Shift[] = [
  {
    emoji: "🌾",
    name: "Agriculture",
    when: "~10,000 BCE",
    accent: "border-amber-500/40 bg-amber-500/5",
    what: "Farming replaced foraging as the base of the economy — the first time humans produced a durable surplus.",
    industries: "Created 'industry' as a concept: specialists who weren't farmers, because farmers could now feed them.",
    adjustment: "Millennia. Genuinely — this is the slowest of the shifts here, spread unevenly across the globe over thousands of years.",
  },
  {
    emoji: "🖨️",
    name: "The printing press",
    when: "1450s",
    accent: "border-blue-500/40 bg-blue-500/5",
    what: "Collapsed the cost of copying information by roughly two orders of magnitude within decades.",
    industries: "Publishing, law, science, and religion all restructured — the Reformation and the Scientific Revolution both leaned on cheap, identical copies.",
    adjustment: "About a century for literacy and institutions to catch up to the technology's raw capability.",
  },
  {
    emoji: "🏭",
    name: "Steam & the factory",
    when: "1780s–1830s",
    accent: "border-zinc-500/40 bg-zinc-500/5",
    what: "Mechanical power decoupled from human and animal muscle for the first time in history.",
    industries: "Textiles first, then mining, transport, and manufacturing broadly — and, brutally, the labour market underneath all of them.",
    adjustment: "Decades of real wage stagnation before the gains broadly showed up in ordinary life — economic historians call this Engels' pause.",
  },
  {
    emoji: "⚡",
    name: "Electrification",
    when: "1880s–1920s",
    accent: "border-yellow-500/40 bg-yellow-500/5",
    what: "Power became a utility you could pipe anywhere, not just wherever a steam engine already sat.",
    industries: "Manufacturing was the headline, but logistics, retail (the department store), and home life changed just as much.",
    adjustment: "Roughly 40 years — factories didn't see productivity gains until a generation of managers rebuilt the factory floor around the new thing, not just bolted it onto the old layout.",
  },
  {
    emoji: "💻",
    name: "Computing & the internet",
    when: "1990s–2000s",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    what: "Information and coordination costs collapsed toward zero, globally, almost simultaneously.",
    industries: "Media, finance, retail, logistics — anything whose product was information or coordination got rebuilt, often by a new entrant rather than the incumbent.",
    adjustment: "About 15–20 years from early web to the platforms (search, social, cloud) that actually captured the value at scale.",
  },
  {
    emoji: "🤖",
    name: "AI",
    when: "now",
    accent: "border-violet-500/40 bg-violet-500/5",
    what: "Cognitive labour — analysis, writing, coding, synthesis — is getting radically cheaper, the way physical labour did two centuries ago.",
    industries: "Every industry in this gallery, again, simultaneously — which is exactly why the comparison to the earlier rows is worth taking seriously.",
    adjustment: "Unknown. That honest uncertainty is most of what the rest of this essay is about.",
  },
];

export function CivilizationalShifts() {
  const [i, setI] = useState(5);
  const s = SHIFTS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Six shifts that touched everything at once — pick one
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {SHIFTS.map((x, idx) => (
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

        <div className={`mt-4 rounded-xl border p-4 ${s.accent}`}>
          <div className="flex items-baseline justify-between gap-3">
            <h4 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{s.emoji}</span> {s.name}
            </h4>
            <span className="text-[11px] font-medium text-zinc-400">{s.when}</span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.what}</p>
          <div className="mt-3 space-y-2.5">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Industries hit hardest</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.industries}</p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">How long the adjustment actually took</p>
              <p className="mt-0.5 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.adjustment}</p>
            </div>
          </div>
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          Every one of these felt, at the time, like it would change everything overnight. Every one of them did change everything — and every one of them took far longer than "overnight" to actually land.
        </p>
      </div>
    </figure>
  );
}
