"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Folder, ArrowRight, Shuffle, Sparkles } from "lucide-react";
import { formatDate } from "@/lib/utils";

export type EssayMeta = {
  slug: string;
  title: string;
  dek: string;
  publishedAt: string;
  readingTimeMin: number;
  category?: string;
  series?: string;
  seriesPart?: number;
};

const CAT: Record<string, { dot: string; chip: string }> = {
  "AI & Society": { dot: "bg-violet-500", chip: "border-violet-500/40 text-violet-700 dark:text-violet-300" },
  "Building & Craft": { dot: "bg-emerald-500", chip: "border-emerald-500/40 text-emerald-700 dark:text-emerald-300" },
  "Systems & Tech": { dot: "bg-blue-500", chip: "border-blue-500/40 text-blue-700 dark:text-blue-300" },
  Economics: { dot: "bg-amber-500", chip: "border-amber-500/40 text-amber-700 dark:text-amber-300" },
  Product: { dot: "bg-rose-500", chip: "border-rose-500/40 text-rose-700 dark:text-rose-300" },
  "Life & Ideas": { dot: "bg-slate-400", chip: "border-slate-400/40 text-slate-600 dark:text-slate-300" },
};
const meta = (c?: string) => (c && CAT[c] ? CAT[c] : { dot: "bg-zinc-400", chip: "border-zinc-300 text-zinc-500" });

function sample(arr: EssayMeta[], n: number, avoid: EssayMeta[] = []): EssayMeta[] {
  const pool = [...arr];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  if (avoid.length) {
    const skip = new Set(avoid.map((a) => a.slug));
    const alt = pool.filter((p) => !skip.has(p.slug));
    if (alt.length >= n) return alt.slice(0, n);
  }
  return pool.slice(0, n);
}

type Entry =
  | { kind: "series"; name: string; parts: EssayMeta[]; date: string; category?: string }
  | { kind: "essay"; essay: EssayMeta; date: string };

function group(list: EssayMeta[]): Entry[] {
  const order: string[] = [];
  const map = new Map<string, EssayMeta[]>();
  const entries: Entry[] = [];
  for (const e of list) {
    if (e.series) {
      if (!map.has(e.series)) {
        map.set(e.series, []);
        order.push(e.series);
      }
      map.get(e.series)!.push(e);
    } else {
      entries.push({ kind: "essay", essay: e, date: e.publishedAt });
    }
  }
  for (const name of order) {
    const parts = map.get(name)!.slice().sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0));
    const date = parts.reduce((m, p) => (p.publishedAt > m ? p.publishedAt : m), parts[0].publishedAt);
    entries.push({ kind: "series", name, parts, date, category: parts[0].category });
  }
  entries.sort((a, b) => (a.date > b.date ? -1 : 1));
  return entries;
}

export function EssaysBrowser({ essays }: { essays: EssayMeta[] }) {
  const [cat, setCat] = useState<string | null>(null);
  const [picks, setPicks] = useState<EssayMeta[]>(() => essays.slice(0, 3));

  useEffect(() => {
    setPicks(sample(essays, 3));
  }, [essays]);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const e of essays) if (e.category) counts.set(e.category, (counts.get(e.category) ?? 0) + 1);
    return Array.from(counts.entries());
  }, [essays]);

  const filtered = cat ? essays.filter((e) => e.category === cat) : essays;
  const entries = useMemo(() => group(filtered), [filtered]);

  return (
    <div>
      {/* Random picks */}
      <div className="mb-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/50 dark:to-zinc-950 p-5">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-700 dark:text-zinc-200">
            <Sparkles className="h-4 w-4 text-amber-500" /> Not sure where to start?
          </p>
          <button
            onClick={() => setPicks(sample(essays, 3, picks))}
            className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <Shuffle className="h-3 w-3" /> shuffle
          </button>
        </div>
        <div className="grid gap-2.5 sm:grid-cols-3">
          {picks.map((p) => {
            const m = meta(p.category);
            return (
              <Link
                key={p.slug}
                href={`/essays/${p.slug}`}
                className="group rounded-xl border border-zinc-200 dark:border-zinc-800 p-3 hover:border-blue-500/40 transition-colors"
              >
                <span className={`inline-flex items-center gap-1 text-[10px] ${m.chip} rounded-full border px-1.5 py-0.5`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} /> {p.category ?? "Essay"}
                </span>
                <p className="mt-1.5 text-sm font-medium leading-snug text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {p.title}
                </p>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Category filter */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setCat(null)}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${cat === null ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
        >
          All · {essays.length}
        </button>
        {categories.map(([c, n]) => {
          const m = meta(c);
          const on = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(on ? null : c)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors ${on ? m.chip + " bg-current/5" : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} /> {c} · {n}
            </button>
          );
        })}
      </div>

      {/* List */}
      <div className="space-y-4">
        {entries.map((e) =>
          e.kind === "series" ? (
            <SeriesFolder key={`s-${e.name}`} name={e.name} parts={e.parts} category={e.category} />
          ) : (
            <EssayRow key={e.essay.slug} essay={e.essay} />
          ),
        )}
      </div>
    </div>
  );
}

function CatTag({ category }: { category?: string }) {
  if (!category) return null;
  const m = meta(category);
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[10px] ${m.chip}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} /> {category}
    </span>
  );
}

function EssayRow({ essay }: { essay: EssayMeta }) {
  return (
    <Link
      href={`/essays/${essay.slug}`}
      className="group block rounded-xl px-4 py-5 -mx-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-colors"
    >
      <div className="mb-1.5">
        <CatTag category={essay.category} />
      </div>
      <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {essay.title}
      </h2>
      {essay.dek && (
        <p className="text-base text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 italic">{essay.dek}</p>
      )}
      <div className="flex items-center gap-3 text-xs text-zinc-400 mt-3">
        <span>{formatDate(essay.publishedAt)}</span>
        <span>·</span>
        <span>{essay.readingTimeMin} min read</span>
      </div>
    </Link>
  );
}

function SeriesFolder({ name, parts, category }: { name: string; parts: EssayMeta[]; category?: string }) {
  const totalMin = parts.reduce((sum, p) => sum + p.readingTimeMin, 0);
  return (
    <div className="rounded-xl border border-amber-200/70 dark:border-amber-900/30 bg-amber-50/50 dark:bg-amber-950/10 overflow-hidden">
      <div className="flex items-center gap-3 px-5 pt-4 pb-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/30">
          <Folder className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">{name}</h2>
            <CatTag category={category} />
          </div>
          <p className="text-xs text-amber-700/80 dark:text-amber-500/80">
            {parts.length}-part series · {totalMin} min in total
          </p>
        </div>
      </div>
      <ol className="border-t border-amber-200/50 dark:border-amber-900/20 divide-y divide-amber-200/40 dark:divide-amber-900/20">
        {parts.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/essays/${p.slug}`}
              className="group flex items-start gap-3 px-5 py-3.5 hover:bg-amber-100/40 dark:hover:bg-amber-900/15 transition-colors"
            >
              <span className="mt-0.5 font-mono text-xs text-amber-600/70 dark:text-amber-500/70 shrink-0">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 min-w-0">
                <span className="block font-medium text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-amber-700 dark:group-hover:text-amber-400 transition-colors">
                  {p.title}
                </span>
                {p.dek && (
                  <span className="mt-0.5 block text-sm text-zinc-500 dark:text-zinc-400 leading-snug line-clamp-1">
                    {p.dek}
                  </span>
                )}
              </span>
              <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-500/60 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
