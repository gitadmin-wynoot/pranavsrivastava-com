"use client";

import { useMemo, useState } from "react";
import { Scissors } from "lucide-react";

/*
  ChunkSizer — drag the slider to see how chunk size (and overlap) splits a
  document. Makes the "too small loses context / too big buries the signal"
  trade-off tangible. Client-side, deterministic.
*/

const SAMPLE =
  "Employees accrue 25 days of paid leave per year, accrued monthly. Remote work is allowed up to three days per week with manager approval. When travelling, the meal reimbursement limit is 40 euros per day, and receipts must be submitted within 30 days. Parental leave is 16 weeks, fully paid, for every parent, and can be taken flexibly in the first year.";

const COLORS = [
  "bg-blue-500/10 border-blue-500/30",
  "bg-emerald-500/10 border-emerald-500/30",
  "bg-violet-500/10 border-violet-500/30",
  "bg-amber-500/10 border-amber-500/30",
  "bg-rose-500/10 border-rose-500/30",
  "bg-sky-500/10 border-sky-500/30",
];

export function ChunkSizer() {
  const [size, setSize] = useState(14);
  const [overlap, setOverlap] = useState(true);

  const chunks = useMemo(() => {
    const words = SAMPLE.split(/\s+/);
    const step = overlap ? Math.max(1, Math.round(size * 0.8)) : size;
    const out: string[] = [];
    for (let i = 0; i < words.length; i += step) {
      out.push(words.slice(i, i + size).join(" "));
      if (i + size >= words.length) break;
    }
    return out;
  }, [size, overlap]);

  const verdict =
    size <= 8
      ? { tone: "text-amber-600 dark:text-amber-400", text: "Small chunks: precise matches, but a chunk may not hold enough to answer." }
      : size >= 26
        ? { tone: "text-amber-600 dark:text-amber-400", text: "Large chunks: rich context, but retrieval gets vague and you waste the window." }
        : { tone: "text-emerald-600 dark:text-emerald-400", text: "A reasonable size: about one idea with enough surrounding context." };

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 flex items-center gap-2">
        <Scissors className="h-3.5 w-3.5" /> Chunking visualizer — drag to resize
      </div>

      <div className="p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <label className="flex items-center gap-3 text-sm text-zinc-600 dark:text-zinc-300">
            <span className="w-24 shrink-0">Chunk size: <span className="font-mono font-semibold">{size}w</span></span>
            <input
              type="range"
              min={4}
              max={40}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-40 accent-blue-500"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-300 cursor-pointer">
            <input
              type="checkbox"
              checked={overlap}
              onChange={(e) => setOverlap(e.target.checked)}
              className="accent-blue-500"
            />
            20% overlap
          </label>
          <span className="text-sm text-zinc-400">
            → <span className="font-semibold text-zinc-600 dark:text-zinc-300">{chunks.length}</span> chunks
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {chunks.map((c, i) => (
            <span
              key={i}
              className={`rounded-lg border px-2.5 py-1.5 text-[13px] leading-snug text-zinc-700 dark:text-zinc-200 ${COLORS[i % COLORS.length]}`}
            >
              {c}
            </span>
          ))}
        </div>

        <p className={`mt-4 text-[13px] ${verdict.tone}`}>{verdict.text}</p>
        {overlap && (
          <p className="mt-1 text-[11px] text-zinc-400">
            With overlap on, chunks share words at their edges — so an idea split across a boundary still survives whole in one chunk.
          </p>
        )}
      </div>
    </figure>
  );
}
