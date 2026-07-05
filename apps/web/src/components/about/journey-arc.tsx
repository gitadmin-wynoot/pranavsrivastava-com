"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/*
  JourneyArc — the "arc" reframed from a dated résumé timeline into a few
  chapters (scopes) you drag or tap through. Story over dates: it leads with the
  theme of each phase, keeps time soft, and — for the present — shows the day job
  and the building running as two *parallel tracks* rather than a "part-time"
  footnote.
*/

type Lane = { label: string; color: string; chips: string[]; live?: boolean };
type Scope = {
  label: string;
  title: string;
  span: string;
  color: string;
  body: string;
  tags?: string[];
  parallel?: Lane[];
};

const SCOPES: Scope[] = [
  {
    label: "The spark",
    title: "The first machine",
    span: "early 2000s",
    color: "#f59e0b",
    body: "It started with a borrowed DOS machine and \"Programming in Basic\" book by E. Balagurusamy with a black cover  — thirteen years old, in a small town, hooked and never quite un-hooked. School set the foundations and the computer-engineering degree gave him the depth; the curiosity did the rest.",
    tags: ["Curiosity", "Fundamentals"],
  },
  {
    label: "Consulting",
    title: "A decade solving other people's problems",
    span: "the 2010s",
    color: "#3b82f6",
    body: "Then years in consulting, across genuinely different worlds — telecom, healthcare, banking, automotive, financial services. APIs and integration architecture at scale, for clients who needed it to actually work. He learned that every industry has its own constraints, and that the constraints are the interesting part. A move to the Netherlands turned an assignment into a life.",
    tags: ["Banking", "Automotive", "Finance", "Integration", "Healthcare"],
  },
  {
    label: "Going deeper",
    title: "Back to school, for the algorithms",
    span: "alongside the day job",
    color: "#8b5cf6",
    body: "The algorithms were always the part he found most interesting — so he went back for a Master's in AI, done alongside a full-time job and a life abroad. Computer vision, knowledge representation, optimization; a thesis that read a student's engagement straight from a webcam.",
    tags: ["Computer Vision", "Knowledge Rep.", "Optimization"],
  },
  {
    label: "KPN",
    title: "Into telecom, at scale",
    span: "2017 → now",
    color: "#10b981",
    body: "Landed in telecom at KPN, where he helped grow the developer portal from a small incubator into a revenue-earning product — and where he still is, making significant contributions across CPaaS, AI, backend, and API management.",
    tags: ["CPaaS", "API Management", "AI", "Backend"],
  },
  {
    label: "Now",
    title: "Two tracks, running in parallel",
    span: "now",
    color: "#06b6d4",
    body: "And alongside all that, he builds his own. Not instead of the day job — beside it. Two tracks running at once, increasingly with a personal AI doing the heavy lifting. Same curiosity, twice the surface area.",
    parallel: [
      { label: "By day", color: "#0ea5e9", chips: ["KPN", "CPaaS", "AI", "API management"] },
      { label: "In parallel", color: "#10b981", chips: ["Wynoot", "Gravitii", "Writing", "Teaching", "+ personal AI"], live: true },
    ],
  },
  {
    label: "Where it started",
    title: "Numbers came first",
    span: "long before any of this",
    color: "#f472b6",
    body: "And if you trace it all the way back: long before any computer, there was a small kid oddly at home with numbers — the sort who somehow remembered everyone's phone number — and pulled toward physics years before he knew it was even a subject. He drew and painted, too. School itself was harder: a bit of a misfit in those early classrooms, he found his footing only later (a story for another day). The physics never really left — he still meets a tangled problem by picturing forces settling into balance, or a ball rolling to its lowest point, which, it turns out, is quietly how a lot of optimization actually works.",
    tags: ["Numbers", "Physics", "Drawing"],
  },
];

export function JourneyArc() {
  const [i, setI] = useState(0);
  const s = SCOPES[i];

  return (
    <div>
      {/* journey line with stops */}
      <div className="relative px-1">
        <div className="absolute left-2 right-2 top-[7px] h-px bg-zinc-200 dark:bg-zinc-800" />
        <div
          className="absolute left-2 top-[7px] h-px transition-all duration-300"
          style={{ width: `calc(${(i / (SCOPES.length - 1)) * 100}% - 4px)`, background: s.color }}
        />
        <div className="relative flex justify-between">
          {SCOPES.map((sc, idx) => (
            <button
              key={sc.label}
              onClick={() => setI(idx)}
              className="group flex flex-col items-center gap-2"
              aria-label={sc.label}
            >
              <span
                className="h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-950 transition-transform"
                style={{
                  background: idx <= i ? SCOPES[idx].color : "#d4d4d8",
                  transform: idx === i ? "scale(1.35)" : "scale(1)",
                }}
              />
              <span
                className={`max-w-[64px] text-center text-[10px] sm:text-[11px] leading-tight transition-colors ${idx === i ? "font-semibold" : "text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300"}`}
                style={idx === i ? { color: s.color } : undefined}
              >
                {sc.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* drag slider */}
      <input
        type="range"
        min={0}
        max={SCOPES.length - 1}
        value={i}
        onChange={(e) => setI(Number(e.target.value))}
        aria-label="Move through the chapters"
        className="mt-4 w-full cursor-pointer"
        style={{ accentColor: s.color }}
      />

      {/* active chapter */}
      <div
        className="mt-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-5"
        style={{ borderLeft: `3px solid ${s.color}` }}
      >
        <div className="flex items-baseline gap-2.5">
          <h3 className="text-base font-semibold" style={{ color: s.color }}>
            {s.title}
          </h3>
          <span className="text-[11px] uppercase tracking-wide text-zinc-400">{s.span}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">{s.body}</p>

        {s.parallel ? (
          <div className="mt-4 space-y-2.5">
            {s.parallel.map((lane) => (
              <div key={lane.label} className="flex items-center gap-3">
                <span className="flex w-20 shrink-0 items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide" style={{ color: lane.color }}>
                  {lane.live && (
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" style={{ background: lane.color }} />
                      <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background: lane.color }} />
                    </span>
                  )}
                  {lane.label}
                </span>
                <span className="h-px flex-shrink-0 flex-grow-0 basis-4" style={{ background: lane.color }} />
                <div className="flex flex-wrap gap-1.5">
                  {lane.chips.map((c) => (
                    <span key={c} className="rounded-full border px-2 py-0.5 text-[11px]" style={{ color: lane.color, borderColor: `${lane.color}44` }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {s.tags?.map((t) => (
              <span
                key={t}
                className="rounded-full border px-2 py-0.5 text-[11px]"
                style={{ color: s.color, borderColor: `${s.color}44` }}
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => setI(Math.max(0, i - 1))}
            disabled={i === 0}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" /> Before
          </button>
          <span className="font-mono text-[11px] text-zinc-400">
            {i + 1} / {SCOPES.length}
          </span>
          <button
            onClick={() => setI(Math.min(SCOPES.length - 1, i + 1))}
            disabled={i === SCOPES.length - 1}
            className="inline-flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
