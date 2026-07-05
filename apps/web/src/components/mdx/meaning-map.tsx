"use client";

import { useMemo, useState } from "react";

/*
  MeaningMap — the friendliest possible picture of embeddings. Every word is a
  dot on a map; similar meanings sit close together. Tap a word and it lights up
  its nearest neighbours — showing that "search by meaning" is just "find the
  closest dots." Understandable by an eight-year-old.
*/

type Word = { emoji: string; word: string; x: number; y: number; group: string };

const W = 440;
const H = 300;

const WORDS: Word[] = [
  // animals (top-left)
  { emoji: "🐱", word: "cat", x: 75, y: 60, group: "animals" },
  { emoji: "🐶", word: "dog", x: 135, y: 48, group: "animals" },
  { emoji: "🐯", word: "tiger", x: 88, y: 108, group: "animals" },
  { emoji: "🐘", word: "elephant", x: 150, y: 100, group: "animals" },
  // food (top-right)
  { emoji: "🍕", word: "pizza", x: 300, y: 52, group: "food" },
  { emoji: "🍔", word: "burger", x: 360, y: 62, group: "food" },
  { emoji: "🍎", word: "apple", x: 306, y: 110, group: "food" },
  { emoji: "🍦", word: "ice cream", x: 366, y: 104, group: "food" },
  // vehicles (bottom-left)
  { emoji: "🚗", word: "car", x: 72, y: 205, group: "vehicles" },
  { emoji: "🚌", word: "bus", x: 138, y: 210, group: "vehicles" },
  { emoji: "🚲", word: "bike", x: 82, y: 255, group: "vehicles" },
  { emoji: "✈️", word: "plane", x: 148, y: 250, group: "vehicles" },
  // sky (bottom-right)
  { emoji: "☀️", word: "sun", x: 300, y: 205, group: "sky" },
  { emoji: "🌙", word: "moon", x: 362, y: 210, group: "sky" },
  { emoji: "⭐", word: "star", x: 305, y: 255, group: "sky" },
  { emoji: "🌳", word: "tree", x: 366, y: 250, group: "sky" },
];

const GROUP_LABEL: Record<string, string> = {
  animals: "animals",
  food: "food",
  vehicles: "things that go",
  sky: "things in the sky",
};

export function MeaningMap() {
  const [sel, setSel] = useState<number | null>(null);

  const neighbours = useMemo(() => {
    if (sel === null) return [];
    const a = WORDS[sel];
    return WORDS.map((w, i) => ({ i, d: Math.hypot(w.x - a.x, w.y - a.y) }))
      .filter((n) => n.i !== sel)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .map((n) => n.i);
  }, [sel]);

  const nbSet = new Set(neighbours);
  const active = sel !== null ? WORDS[sel] : null;
  const allSameGroup = active && neighbours.every((i) => WORDS[i].group === active.group);

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        A map of meaning — tap a word to find its closest friends
      </div>

      <svg viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full">
        {/* lines to neighbours */}
        {active &&
          neighbours.map((i) => (
            <line
              key={`l-${i}`}
              x1={active.x}
              y1={active.y}
              x2={WORDS[i].x}
              y2={WORDS[i].y}
              className="stroke-blue-400/70"
              strokeWidth="1.5"
              strokeDasharray="3 3"
            />
          ))}

        {WORDS.map((w, i) => {
          const isSel = sel === i;
          const isNb = nbSet.has(i);
          const dim = sel !== null && !isSel && !isNb;
          return (
            <g
              key={w.word}
              onClick={() => setSel(isSel ? null : i)}
              className="cursor-pointer"
              opacity={dim ? 0.3 : 1}
            >
              {isSel && <circle cx={w.x} cy={w.y} r="20" className="fill-blue-500/15" />}
              {isNb && <circle cx={w.x} cy={w.y} r="17" className="fill-blue-500/10" />}
              <text x={w.x} y={w.y + 7} textAnchor="middle" fontSize="22">
                {w.emoji}
              </text>
              <text
                x={w.x}
                y={w.y + 26}
                textAnchor="middle"
                fontSize="11"
                className={isSel ? "fill-blue-600 dark:fill-blue-400 font-semibold" : "fill-zinc-500 dark:fill-zinc-400"}
              >
                {w.word}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 text-[13px] text-zinc-600 dark:text-zinc-300">
        {active ? (
          <>
            Closest to <span className="font-semibold">{active.emoji} {active.word}</span>:{" "}
            {neighbours.map((i, k) => (
              <span key={i}>
                {k > 0 && ", "}
                {WORDS[i].emoji} {WORDS[i].word}
              </span>
            ))}
            {allSameGroup && (
              <> — all <span className="font-semibold text-blue-600 dark:text-blue-400">{GROUP_LABEL[active.group]}</span>. The computer never read a dictionary; it just put similar things close together.</>
            )}
          </>
        ) : (
          <>Every word is a dot. Similar things sit close together — so &ldquo;search by meaning&rdquo; just means &ldquo;find the nearest dots.&rdquo; Tap one to see.</>
        )}
      </figcaption>
    </figure>
  );
}
