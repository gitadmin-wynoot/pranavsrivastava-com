"use client";

import { useState } from "react";
import { ArrowRight, RotateCcw } from "lucide-react";

/*
  SynonymSnap — the one-idea-that-makes-it-work, made visual. Six words toggle
  between two arrangements: sorted by SPELLING (cat sits next to car — useless)
  and sorted by MEANING (cat/kitten/feline snap together; car/vehicle/automobile
  snap together). Watching them move is the whole intuition for embeddings.
*/

type Tok = {
  label: string;
  emoji: string;
  group: "cat" | "car";
  sx: number; // spelling x %
  mx: number; // meaning x %
  my: number; // meaning y %
};

const TOKENS: Tok[] = [
  { label: "cat", emoji: "🐱", group: "cat", sx: 44, mx: 30, my: 38 },
  { label: "kitten", emoji: "🐈", group: "cat", sx: 76, mx: 21, my: 64 },
  { label: "feline", emoji: "🐾", group: "cat", sx: 60, mx: 39, my: 64 },
  { label: "car", emoji: "🚗", group: "car", sx: 28, mx: 71, my: 38 },
  { label: "vehicle", emoji: "🚙", group: "car", sx: 92, mx: 62, my: 64 },
  { label: "automobile", emoji: "🏎️", group: "car", sx: 12, mx: 80, my: 64 },
];

export function SynonymSnap() {
  const [mode, setMode] = useState<"spelling" | "meaning">("spelling");
  const meaning = mode === "meaning";

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
        <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Sorted by {meaning ? "meaning" : "spelling"}
        </span>
        <button
          onClick={() => setMode(meaning ? "spelling" : "meaning")}
          className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 dark:bg-zinc-100 px-3 py-1.5 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          {meaning ? (
            <>
              <RotateCcw className="h-3 w-3" /> Back to spelling
            </>
          ) : (
            <>
              Group by meaning <ArrowRight className="h-3 w-3" />
            </>
          )}
        </button>
      </div>

      <div className="relative h-52 sm:h-56">
        {/* backdrop bubbles when grouped by meaning */}
        <div
          className={`pointer-events-none absolute rounded-[40%] border-2 border-dashed border-amber-400/50 bg-amber-400/5 transition-all duration-700 ${meaning ? "opacity-100" : "opacity-0"}`}
          style={{ left: "12%", top: "24%", width: "36%", height: "62%" }}
        />
        <div
          className={`pointer-events-none absolute rounded-[40%] border-2 border-dashed border-blue-400/50 bg-blue-400/5 transition-all duration-700 ${meaning ? "opacity-100" : "opacity-0"}`}
          style={{ left: "53%", top: "24%", width: "36%", height: "62%" }}
        />
        <span
          className={`pointer-events-none absolute text-[10px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 transition-opacity duration-700 ${meaning ? "opacity-100" : "opacity-0"}`}
          style={{ left: "30%", top: "17%", transform: "translateX(-50%)" }}
        >
          one meaning
        </span>
        <span
          className={`pointer-events-none absolute text-[10px] font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 transition-opacity duration-700 ${meaning ? "opacity-100" : "opacity-0"}`}
          style={{ left: "71%", top: "17%", transform: "translateX(-50%)" }}
        >
          one meaning
        </span>

        {/* the words */}
        {TOKENS.map((t) => {
          const left = meaning ? t.mx : t.sx;
          const top = meaning ? t.my : 50;
          return (
            <div
              key={t.label}
              className="absolute flex items-center gap-1.5 rounded-full border border-zinc-300 bg-white px-2.5 py-1 text-sm font-medium text-zinc-700 shadow-sm transition-all duration-700 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-200"
              style={{ left: `${left}%`, top: `${top}%`, transform: "translate(-50%, -50%)" }}
            >
              <span aria-hidden="true">{t.emoji}</span>
              {t.label}
            </div>
          );
        })}
      </div>

      <figcaption className="border-t border-zinc-200 dark:border-zinc-800 px-4 py-3 text-[13px] leading-relaxed text-zinc-600 dark:text-zinc-300">
        {meaning ? (
          <>
            <span className="font-semibold text-amber-600 dark:text-amber-400">cat · kitten · feline</span> snap together, and{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">car · vehicle · automobile</span> snap together. The computer never learned any definitions — it just noticed which words get used the same way, and placed them in the same spot. That spot is the word&apos;s <span className="font-semibold">vector</span>.
          </>
        ) : (
          <>
            Sorted by letters, <span className="font-semibold">🐱 cat</span> ends up right next to <span className="font-semibold">🚗 car</span> — even though they have nothing in common. Spelling is blind to meaning. Now press <span className="font-semibold">Group by meaning</span> and watch what happens.
          </>
        )}
      </figcaption>
    </figure>
  );
}
