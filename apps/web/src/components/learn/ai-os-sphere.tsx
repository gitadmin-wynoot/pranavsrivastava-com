"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shuffle, RefreshCw, Hand } from "lucide-react";

/*
  AIOSSphere — a draggable 3D sphere of what a personal AI OS is. Related ideas
  are joined by connection lines (a little neural web), it auto-rotates and can
  be flung, and tapping a word spins it forward and drops its meaning plus a
  RANDOM concrete example — with a re-roll for another. No API; deterministic
  layout so it's SSR-stable.
*/

type Concept = { label: string; color: string; context: string; examples: string[] };

const CONCEPTS: Concept[] = [
  {
    label: "Memory",
    color: "#c4b5fd",
    context: "It holds what matters to you, so nothing starts from a blank page.",
    examples: [
      "You mention once that you like short, direct emails — from then on it drafts them that way.",
      "You agree terms with a supplier in March; in September it still remembers them.",
      "It knows your kid's allergy and flags it the moment you plan a menu.",
    ],
  },
  {
    label: "Helpers",
    color: "#93c5fd",
    context: "Little AI workers that carry out multi-step jobs, not just chat.",
    examples: [
      "“Plan a weekend in Lisbon” → it researches, drafts an itinerary, and books nothing until you say go.",
      "Overnight it sorts 200 photos into albums and captions them.",
      "It quietly tracks a topic and hands you a weekly digest, unasked.",
    ],
  },
  {
    label: "Tools",
    color: "#6ee7b7",
    context: "Safe, permissioned connections to your real apps — so it can act.",
    examples: [
      "It adds the meeting to your calendar and invites the right people.",
      "It reads a PDF on your disk and files it in the right folder.",
      "It writes a blog draft — then waits for your sign-off to publish.",
    ],
  },
  {
    label: "Knowledge",
    color: "#fcd34d",
    context: "Your searchable second brain that answers with real sources.",
    examples: [
      "Ask “what did I decide about pricing?” and it quotes your own notes back.",
      "It notices two of your documents contradict each other, and says so.",
      "Every answer links the exact paragraph it came from.",
    ],
  },
  {
    label: "Oversight",
    color: "#fda4af",
    context: "It keeps an honest eye on itself, so you always stay in control.",
    examples: [
      "It shows you it spent $0.12 and four steps on that task.",
      "It says “I wasn't sure about this part” instead of bluffing.",
      "It logs every action so you can replay exactly what it did.",
    ],
  },
  {
    label: "Publishing",
    color: "#7dd3fc",
    context: "It turns the work into things other people can actually use.",
    examples: [
      "It drafts an essay from your scattered notes — you edit and ship.",
      "It packages a how-to into a small course, with your approval.",
      "It turns a problem you solved into a reusable tool for others.",
    ],
  },
  {
    label: "Yours",
    color: "#c4b5fd",
    context: "Your data works for you — not rented back to you a question at a time.",
    examples: [
      "It serves you, not an ad model watching over your shoulder.",
      "You can pick it up and move it — it's yours to keep.",
    ],
  },
  {
    label: "Runs overnight",
    color: "#6ee7b7",
    context: "The boring, multi-step chores happen while you sleep.",
    examples: [
      "You wake to a finished research brief you asked for at midnight.",
      "It retried a failed task on its own and left you a note that it fixed itself.",
    ],
  },
  {
    label: "Compounds",
    color: "#fcd34d",
    context: "It's the rare tool worth more in year three than on day one.",
    examples: [
      "Every correction you make, it remembers — so there are fewer next time.",
      "The more of your world it sees, the sharper its help becomes.",
    ],
  },
  {
    label: "Asks first",
    color: "#fda4af",
    context: "It shows its work and waits for your call on anything big.",
    examples: [
      "Before emailing your boss, it asks “send this?”",
      "It proposes three options and lets you pick, rather than guessing.",
    ],
  },
  {
    label: "The loop",
    color: "#7dd3fc",
    context: "Discover → understand → build → publish → improve — on repeat.",
    examples: [
      "It learns something, builds with it, ships it, and improves from what happened.",
      "This very website runs on that loop.",
    ],
  },
  {
    label: "Not a chatbot",
    color: "#93c5fd",
    context: "A system that remembers and acts — not a tab you close and it forgets you.",
    examples: [
      "It doesn't forget you between visits.",
      "It does work, not just words.",
    ],
  },
];

const LINKS: [number, number][] = [
  [0, 3], [0, 8], [0, 11],
  [1, 2], [1, 7], [1, 9],
  [2, 4], [2, 5],
  [3, 5],
  [4, 9], [4, 6],
  [10, 5], [10, 1],
];

const BASE_SPIN = 0.0016;

export function AIOSSphere() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [exIdx, setExIdx] = useState(0);
  const [hint, setHint] = useState(true);

  const points = useMemo(() => {
    const n = CONCEPTS.length;
    const golden = Math.PI * (1 + Math.sqrt(5));
    return CONCEPTS.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const t = golden * i;
      return { x: Math.cos(t) * r, y, z: Math.sin(t) * r };
    });
  }, []);

  const rot = useRef({ x: -0.3, y: 0 });
  const mom = useRef({ x: 0, y: BASE_SPIN });
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });
  const focus = useRef({ until: 0, tx: 0, ty: 0 });
  const renderRef = useRef<() => void>(() => {});

  const render = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const R = (Math.min(w, h) / 2) * 0.74;
    const cx = w / 2;
    const cy = h / 2;
    const now = performance.now();
    const focusing = now < focus.current.until;

    if (focusing) {
      let dy = focus.current.ty - rot.current.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy));
      rot.current.y += dy * 0.12;
      rot.current.x += (focus.current.tx - rot.current.x) * 0.12;
    } else if (!drag.current.active) {
      rot.current.x += mom.current.x;
      rot.current.y += mom.current.y;
      mom.current.x *= 0.94;
      mom.current.y = mom.current.y * 0.94 + BASE_SPIN * 0.06;
    }

    const sx = Math.sin(rot.current.x);
    const cxr = Math.cos(rot.current.x);
    const sy = Math.sin(rot.current.y);
    const cyr = Math.cos(rot.current.y);

    const proj: Array<{ x: number; y: number; d: number }> = [];
    points.forEach((p, i) => {
      const x1 = p.x * cyr - p.z * sy;
      const z1 = p.x * sy + p.z * cyr;
      const y2 = p.y * cxr - z1 * sx;
      const z2 = p.y * sx + z1 * cxr;
      const d = (z2 + 1) / 2;
      const px = cx + x1 * R;
      const py = cy + y2 * R;
      proj[i] = { x: px, y: py, d };
      const el = itemRefs.current[i];
      if (!el) return;
      const isSel = i === sel;
      const scale = (0.68 + d * 0.55) * (isSel ? 1.35 : 1);
      el.style.left = `${px}px`;
      el.style.top = `${py}px`;
      el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = `${isSel ? 1 : 0.35 + d * 0.65}`;
      el.style.zIndex = `${Math.round(d * 100) + (isSel ? 200 : 0)}`;
      el.style.textShadow = isSel ? `0 0 14px ${CONCEPTS[i].color}` : d > 0.7 ? "0 0 8px rgba(56,189,248,0.25)" : "none";
    });

    LINKS.forEach(([a, b], i) => {
      const ln = lineRefs.current[i];
      if (!ln || !proj[a] || !proj[b]) return;
      ln.setAttribute("x1", `${proj[a].x}`);
      ln.setAttribute("y1", `${proj[a].y}`);
      ln.setAttribute("x2", `${proj[b].x}`);
      ln.setAttribute("y2", `${proj[b].y}`);
      const near = sel === null || sel === a || sel === b;
      ln.setAttribute("stroke-opacity", `${(0.08 + Math.min(proj[a].d, proj[b].d) * 0.32) * (near ? 1 : 0.4)}`);
    });
  }, [points, sel]);

  renderRef.current = render;

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      renderRef.current();
      return;
    }
    let raf = 0;
    const tick = () => {
      renderRef.current();
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    renderRef.current();
  }, [sel]);

  const focusOn = useCallback(
    (i: number) => {
      const p = points[i];
      const rho = Math.sqrt(p.x * p.x + p.z * p.z);
      focus.current = { until: performance.now() + 1600, ty: Math.atan2(p.x, p.z), tx: Math.atan2(p.y, rho) };
      setSel(i);
      setExIdx(Math.floor(Math.random() * CONCEPTS[i].examples.length));
      setHint(false);
    },
    [points],
  );

  const reroll = () => {
    if (sel === null) return;
    const n = CONCEPTS[sel].examples.length;
    if (n <= 1) return;
    let e = Math.floor(Math.random() * n);
    if (e === exIdx) e = (e + 1) % n;
    setExIdx(e);
  };

  const spotlight = () => {
    let i = Math.floor(Math.random() * CONCEPTS.length);
    if (i === sel) i = (i + 1) % CONCEPTS.length;
    focusOn(i);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    drag.current = { active: true, moved: false, x: e.clientX, y: e.clientY };
    focus.current.until = 0;
    setHint(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    rot.current.y += dx * 0.006;
    rot.current.x += -dy * 0.006;
    mom.current = { x: -dy * 0.0007, y: dx * 0.0007 };
  };
  const onPointerUp = () => {
    drag.current.active = false;
  };

  const active = sel !== null ? CONCEPTS[sel] : null;

  return (
    <div className="not-prose my-8 rounded-2xl border border-cyan-500/20 bg-[#080d1a] overflow-hidden shadow-[0_0_60px_-20px_rgba(34,211,238,0.4)]">
      <div className="flex items-center justify-between gap-3 border-b border-cyan-500/15 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
          <Hand className="h-3 w-3" /> drag to spin · tap an idea
        </span>
        <button
          onClick={spotlight}
          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 px-2.5 py-1 text-xs text-cyan-300 hover:bg-cyan-500/10 transition-colors"
        >
          <Shuffle className="h-3 w-3" /> surprise me
        </button>
      </div>

      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-80 w-full cursor-grab touch-none select-none active:cursor-grabbing sm:h-96"
        style={{ contain: "layout paint" }}
      >
        <div className="pointer-events-none absolute inset-[15%] rounded-full bg-cyan-500/10 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full">
          {LINKS.map((_, i) => (
            <line
              key={i}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              stroke="#22d3ee"
              strokeWidth="1"
            />
          ))}
        </svg>

        {CONCEPTS.map((c, i) => (
          <button
            key={c.label}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => {
              if (!drag.current.moved) focusOn(i);
            }}
            className="absolute left-1/2 top-1/2 whitespace-nowrap font-medium leading-none will-change-transform"
            style={{ fontSize: "0.9rem", color: c.color, opacity: 0 }}
          >
            {c.label}
          </button>
        ))}

        {hint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] text-slate-500">
            ✦ a living map — grab it
          </div>
        )}
      </div>

      {/* detail panel */}
      <div className="min-h-[6.5rem] border-t border-cyan-500/15 px-5 py-4">
        {active ? (
          <div>
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-sm font-semibold" style={{ color: active.color }}>
                {active.label}
              </h4>
              {active.examples.length > 1 && (
                <button
                  onClick={reroll}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-600/50 px-2 py-0.5 font-mono text-[10px] text-slate-400 hover:text-slate-200 transition-colors"
                >
                  <RefreshCw className="h-2.5 w-2.5" /> another
                </button>
              )}
            </div>
            <p className="mt-1 text-sm leading-relaxed text-slate-300">{active.context}</p>
            <p className="mt-2 rounded-lg border border-slate-700/50 bg-slate-900/60 px-3 py-2 text-[13px] leading-relaxed text-slate-200">
              <span className="mr-1 text-cyan-400">e.g.</span>
              {active.examples[exIdx] ?? active.examples[0]}
            </p>
          </div>
        ) : (
          <p className="text-center font-mono text-xs text-slate-500">
            Spin the sphere. Tap any idea to see what it means — and a real example of it in action.
          </p>
        )}
      </div>
    </div>
  );
}
