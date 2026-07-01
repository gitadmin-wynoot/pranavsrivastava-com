"use client";

import { useState } from "react";

/*
  AIOSBrain — an animated, clickable map of a personal AI operating system.
  A pulsing core, a slow-rotating ring, flowing connection lines, and six
  capability nodes. Tap a node and it explains itself in plain language —
  "what it is" and "where it's going" — so anyone, technical or not, gets it.
*/

type Node = {
  emoji: string;
  label: string;
  angle: number; // degrees, 0 = right, -90 = top
  chip: string;
  dot: string;
  what: string;
  next: string;
};

const NODES: Node[] = [
  {
    emoji: "🧠",
    label: "Memory",
    angle: -90,
    chip: "border-violet-500/50 bg-violet-500/10 text-violet-700 dark:text-violet-300",
    dot: "#8b5cf6",
    what: "It remembers what matters to you — your notes, decisions, and the way you like things done — so you never start from a blank page.",
    next: "Today it recalls facts you tell it. Tomorrow it remembers context across years, quietly getting more useful the longer you use it.",
  },
  {
    emoji: "🤝",
    label: "Helpers",
    angle: -30,
    chip: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-300",
    dot: "#3b82f6",
    what: "Small AI workers that carry out multi-step jobs for you — research a topic, draft a plan, tidy your files — instead of just chatting.",
    next: "Today you ask and wait. Tomorrow they work in the background while you sleep and hand you the result in the morning.",
  },
  {
    emoji: "🔌",
    label: "Tools",
    angle: 30,
    chip: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
    dot: "#10b981",
    what: "Safe, permissioned connections to your real stuff — files, calendar, apps — so your AI can actually do things, not just talk about them.",
    next: "Today a few connectors. Tomorrow a standard socket into everything you use, with you always holding the keys.",
  },
  {
    emoji: "📚",
    label: "Knowledge",
    angle: 90,
    chip: "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-300",
    dot: "#f59e0b",
    what: "Your own searchable second brain — everything you've read, written, and learned — that answers with real sources, not guesses.",
    next: "Today a folder of notes. Tomorrow a living map of what you know that spots gaps and connects ideas for you.",
  },
  {
    emoji: "👀",
    label: "Watching",
    angle: 150,
    chip: "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-300",
    dot: "#f43f5e",
    what: "It keeps an honest eye on itself — what it did, what it cost, what went wrong — so you always stay in control.",
    next: "Today logs you check. Tomorrow it flags its own mistakes and asks before doing anything big.",
  },
  {
    emoji: "🌍",
    label: "Publishing",
    angle: 210,
    chip: "border-sky-500/50 bg-sky-500/10 text-sky-700 dark:text-sky-300",
    dot: "#0ea5e9",
    what: "It turns the work into things other people can use — writing, courses, small tools — and shares them, with your sign-off.",
    next: "Today you publish by hand. Tomorrow it drafts and ships continuously, while you stay editor-in-chief.",
  },
];

const R = 38; // orbit radius in % of the box

function pos(angle: number) {
  const a = (angle * Math.PI) / 180;
  return { x: 50 + R * Math.cos(a), y: 50 + R * Math.sin(a) };
}

export function AIOSBrain() {
  const [sel, setSel] = useState<number | null>(null);
  const active = sel !== null ? NODES[sel] : null;

  return (
    <div className="not-prose my-8">
      <div className="relative mx-auto aspect-square w-full max-w-[440px]">
        {/* glow */}
        <div className="pointer-events-none absolute inset-[18%] rounded-full bg-blue-500/10 blur-2xl dark:bg-blue-500/15" />

        {/* rings + lines */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
          <circle cx="50" cy="50" r={R} className="aios-ring stroke-zinc-300/70 dark:stroke-zinc-700/70" strokeWidth="0.4" strokeDasharray="1.5 3" />
          <circle cx="50" cy="50" r={R - 10} className="aios-ring-rev stroke-zinc-200/60 dark:stroke-zinc-800/70" strokeWidth="0.3" strokeDasharray="1 4" />
          {NODES.map((n, i) => {
            const p = pos(n.angle);
            const on = sel === null || sel === i;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={p.x}
                y2={p.y}
                className="aios-line"
                stroke={n.dot}
                strokeWidth={sel === i ? "0.8" : "0.5"}
                strokeOpacity={on ? 0.7 : 0.15}
              />
            );
          })}
        </svg>

        {/* core */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" fill="none">
          <g className="aios-core">
            <circle cx="50" cy="50" r="13" fill="url(#aios-core-grad)" />
            <circle cx="50" cy="50" r="13" className="stroke-blue-400/70" strokeWidth="0.5" />
          </g>
          <defs>
            <radialGradient id="aios-core-grad" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0.55" />
            </radialGradient>
          </defs>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl leading-none">🧠</div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/90 drop-shadow">
              Your AI
            </div>
          </div>
        </div>

        {/* nodes */}
        {NODES.map((n, i) => {
          const p = pos(n.angle);
          const isSel = sel === i;
          return (
            <button
              key={n.label}
              onClick={() => setSel(isSel ? null : i)}
              className={`absolute flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium shadow-sm backdrop-blur-sm transition-all ${n.chip} ${
                isSel ? "scale-110 ring-2 ring-offset-1 ring-offset-white dark:ring-offset-zinc-950" : "hover:scale-105"
              }`}
              style={{ left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%, -50%)" }}
            >
              <span aria-hidden="true">{n.emoji}</span>
              {n.label}
            </button>
          );
        })}
      </div>

      {/* detail panel */}
      <div className="mx-auto mt-2 max-w-xl rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-4">
        {active ? (
          <div>
            <p className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <span aria-hidden="true">{active.emoji}</span> {active.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{active.what}</p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-600 dark:text-zinc-300">Where it&apos;s going: </span>
              {active.next}
            </p>
          </div>
        ) : (
          <p className="text-center text-sm text-zinc-500 dark:text-zinc-400">
            Tap a piece of the system to see what it does — and where it&apos;s heading.
          </p>
        )}
      </div>

      {/* the loop */}
      <p className="mx-auto mt-3 max-w-xl text-center font-mono text-[11px] text-zinc-400">
        the loop it runs: discover → understand → build → publish → improve → ↺
      </p>
    </div>
  );
}
