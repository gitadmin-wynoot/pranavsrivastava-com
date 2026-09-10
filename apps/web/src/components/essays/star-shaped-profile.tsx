"use client";

import { useState } from "react";

/*
  StarShapedProfile — five points radiating from one core, each grounded in
  something real rather than aspirational. The point of a "star" over a "T"
  is that the depth shows up in more than one place at once. SSR-stable.
*/

type Point = {
  emoji: string;
  name: string;
  accent: string;
  grounded: string;
  stretch: string;
};

const POINTS: Point[] = [
  {
    emoji: "🏗️",
    name: "Systems & architecture",
    accent: "border-blue-500/40 bg-blue-500/5",
    grounded: "Fifteen years, most of it at real scale — telecom, banking, automotive, asset finance. This is the load-bearing point; the others lean on it.",
    stretch: "—",
  },
  {
    emoji: "🛡️",
    name: "Trust & fraud judgment",
    accent: "border-rose-500/40 bg-rose-500/5",
    grounded: "Banking and telecom, the two industries I've actually worked in, are also two of the most fraud-heavy on earth — KYC, AML, SIM-swap, roaming fraud were always somewhere in the room, even when I wasn't the one fighting them directly.",
    stretch: "The honest gap: I haven't run a fraud team. What I have is the systems instinct that fraud defence is built from — and I'm closing the rest deliberately, not pretending it's already closed.",
  },
  {
    emoji: "🎯",
    name: "Product strategy & GTM",
    accent: "border-emerald-500/40 bg-emerald-500/5",
    grounded: "The KPN developer portal — I helped take it from an internal incubator project to meaningful revenue. That's audience, positioning, and a real P&L outcome, not a slide.",
    stretch: "—",
  },
  {
    emoji: "🧭",
    name: "Leadership",
    accent: "border-amber-500/40 bg-amber-500/5",
    grounded: "Technical leadership, plainly stated: setting direction, unblocking people, mentoring, being the one who says 'here's the call and here's why' — not formal headcount management, and I won't pretend otherwise.",
    stretch: "—",
  },
  {
    emoji: "🤖",
    name: "Applied AI",
    accent: "border-violet-500/40 bg-violet-500/5",
    grounded: "An MSc earned at night beside a full-time job, and everything on this site since — labs, courses, systems I've actually shipped. The newest point, and the one I've pushed hardest on.",
    stretch: "—",
  },
];

export function StarShapedProfile() {
  const [i, setI] = useState(0);
  const p = POINTS[i];

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        Five points, one core — click a point
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap gap-1.5">
          {POINTS.map((x, idx) => (
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
          <p className="mt-2 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">{p.grounded}</p>
          {p.stretch !== "—" && (
            <p className="mt-2 text-[12px] leading-relaxed text-amber-700 dark:text-amber-400">{p.stretch}</p>
          )}
        </div>

        <p className="mt-3 text-[11px] text-zinc-400">
          A T-shape is one deep point and broad awareness everywhere else. A star needs the depth to show up in more than one place at once — which is really just a way of saying: don't fake the points you haven't earned yet.
        </p>
      </div>
    </figure>
  );
}
