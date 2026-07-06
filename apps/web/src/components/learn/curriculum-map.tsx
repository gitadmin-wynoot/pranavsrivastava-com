"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowDown } from "lucide-react";

/*
  CurriculumMap — turns the five tracks from a random pile into a visible path.
  Three stages (Foundations → Build deeper → Capstone), laid left-to-right.
  Hover or focus a track and its whole dependency chain lights up — the tracks
  it needs first, and the ones it unlocks — with a plain-language caption of the
  route. Everything else dims. Click a track to open it. No animation loop, so
  it's SSR-stable and reduced-motion safe: only opacity/colour transitions.
*/

export type MapTrack = {
  slug: string;
  title: string;
  icon: string;
  color: string; // token: blue | emerald | violet | sky | amber | zinc
  availableCount: number;
  comingSoon: boolean;
  prereqs: string[];
  leadsTo: string[];
};

export type MapStage = { label: string; desc: string; slugs: string[] };

// Full class strings (no interpolation) so Tailwind keeps them through purge.
const palette: Record<string, { ring: string; text: string; bg: string; border: string }> = {
  blue:    { ring: "ring-blue-500/60",    text: "text-blue-600 dark:text-blue-400",       bg: "bg-blue-50 dark:bg-blue-950/30",       border: "border-blue-200 dark:border-blue-800" },
  emerald: { ring: "ring-emerald-500/60", text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800" },
  violet:  { ring: "ring-violet-500/60",  text: "text-violet-600 dark:text-violet-400",   bg: "bg-violet-50 dark:bg-violet-950/30",   border: "border-violet-200 dark:border-violet-800" },
  sky:     { ring: "ring-sky-500/60",     text: "text-sky-600 dark:text-sky-400",         bg: "bg-sky-50 dark:bg-sky-950/30",         border: "border-sky-200 dark:border-sky-800" },
  amber:   { ring: "ring-amber-500/60",   text: "text-amber-600 dark:text-amber-400",     bg: "bg-amber-50 dark:bg-amber-950/30",     border: "border-amber-200 dark:border-amber-800" },
  zinc:    { ring: "ring-zinc-400/60",    text: "text-zinc-600 dark:text-zinc-300",       bg: "bg-zinc-50 dark:bg-zinc-900",          border: "border-zinc-200 dark:border-zinc-800" },
};

export function CurriculumMap({ tracks, stages }: { tracks: MapTrack[]; stages: MapStage[] }) {
  const [active, setActive] = useState<string | null>(null);

  const bySlug = useMemo(() => {
    const m: Record<string, MapTrack> = {};
    for (const t of tracks) m[t.slug] = t;
    return m;
  }, [tracks]);

  // Transitive closure up (prereqs) and down (leadsTo) from a track.
  const walk = (start: string, dir: "prereqs" | "leadsTo") => {
    const seen = new Set<string>();
    const stack = [...(bySlug[start]?.[dir] ?? [])];
    while (stack.length) {
      const s = stack.pop()!;
      if (seen.has(s) || !bySlug[s]) continue;
      seen.add(s);
      stack.push(...bySlug[s][dir]);
    }
    return seen;
  };

  const { pathSet, route } = useMemo(() => {
    if (!active) return { pathSet: null as Set<string> | null, route: [] as MapTrack[] };
    const up = walk(active, "prereqs");
    const down = walk(active, "leadsTo");
    const set = new Set<string>([active, ...up, ...down]);
    // Ordered route: prereqs (by stage order) → active → dependents (by stage order)
    const order = stages.flatMap((s) => s.slugs);
    const ups = order.filter((s) => up.has(s));
    const downs = order.filter((s) => down.has(s));
    const route = [...ups, active, ...downs].map((s) => bySlug[s]).filter(Boolean);
    return { pathSet: set, route };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, stages]);

  const dim = (slug: string) => pathSet !== null && !pathSet.has(slug);

  return (
    <div className="not-prose">
      {/* Stages */}
      <div className="flex flex-col md:flex-row md:items-stretch gap-3 md:gap-2">
        {stages.map((stage, si) => (
          <div key={stage.label} className="contents md:flex md:items-stretch">
            <div className="flex-1 min-w-0">
              {/* Stage header */}
              <div className="flex items-center gap-2 mb-3">
                <span className="w-5 h-5 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {si + 1}
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 leading-none">
                    {stage.label}
                  </p>
                </div>
              </div>
              <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mb-3 leading-snug">
                {stage.desc}
              </p>

              {/* Track nodes in this stage */}
              <div className="space-y-2.5">
                {stage.slugs.map((slug) => {
                  const t = bySlug[slug];
                  if (!t) return null;
                  const c = palette[t.color] ?? palette.zinc;
                  const isActive = active === t.slug;
                  return (
                    <Link
                      key={t.slug}
                      href={`/learn/${t.slug}`}
                      onMouseEnter={() => setActive(t.slug)}
                      onMouseLeave={() => setActive(null)}
                      onFocus={() => setActive(t.slug)}
                      onBlur={() => setActive(null)}
                      className={`group block rounded-xl border p-3.5 transition-all duration-200 ${c.bg} ${c.border} ${
                        isActive ? `ring-2 ${c.ring} shadow-sm` : "ring-0"
                      } ${dim(t.slug) ? "opacity-40" : "opacity-100"} hover:shadow-sm`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xl leading-none">{t.icon}</span>
                        <span
                          className={`text-[10px] font-medium ${
                            t.comingSoon ? "text-zinc-400 dark:text-zinc-500" : c.text
                          }`}
                        >
                          {t.comingSoon
                            ? "Coming soon"
                            : `${t.availableCount} ${t.availableCount === 1 ? "course" : "courses"}`}
                        </span>
                      </div>
                      <p className="mt-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                        {t.title}
                      </p>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Connector to next stage */}
            {si < stages.length - 1 && (
              <div className="flex md:flex-col items-center justify-center text-zinc-300 dark:text-zinc-600 md:px-1 py-1 md:py-0">
                <ArrowRight className="hidden md:block w-4 h-4" />
                <ArrowDown className="md:hidden w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Route caption — updates as you explore */}
      <div className="mt-5 min-h-[1.75rem] flex items-center">
        {route.length > 1 ? (
          <p className="text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap items-center gap-1.5">
            <span className="text-zinc-400">Path:</span>
            {route.map((t, i) => (
              <span key={t.slug} className="inline-flex items-center gap-1.5">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">
                  {t.icon} {t.title}
                </span>
                {i < route.length - 1 && <ArrowRight className="w-3 h-3 text-zinc-300 dark:text-zinc-600" />}
              </span>
            ))}
          </p>
        ) : (
          <p className="text-xs text-zinc-400 dark:text-zinc-500">
            Hover a track to trace the path it needs — and the ones it unlocks.
          </p>
        )}
      </div>
    </div>
  );
}
