"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Hand, Sparkles } from "lucide-react";

/*
  Embedding3D — a draggable 3D map of meaning. Words live at real 3D positions,
  clustered by meaning; spin the whole space with your finger. Tap a word to see
  its nearest neighbours. It's a toy 3 dimensions standing in for the hundreds a
  real embedding uses — but you can *feel* what "a point in space" means.
*/

const CLUSTERS = [
  { group: "animals", color: "#fcd34d", center: [-0.62, 0.42, 0.28], words: ["cat", "dog", "tiger", "lion", "wolf"] },
  { group: "food", color: "#fda4af", center: [0.62, 0.42, -0.22], words: ["pizza", "burger", "apple", "cake", "coffee"] },
  { group: "feelings", color: "#c4b5fd", center: [0.02, -0.58, 0.5], words: ["happy", "sad", "angry", "calm", "love"] },
  { group: "places", color: "#7dd3fc", center: [0.12, 0.06, -0.62], words: ["city", "ocean", "forest", "desert"] },
];

const OFFSETS = [
  [0, 0, 0],
  [0.24, 0.1, -0.06],
  [-0.2, 0.16, 0.1],
  [0.1, -0.2, 0.16],
  [-0.16, -0.1, -0.14],
];

type Pt = { word: string; group: string; color: string; x: number; y: number; z: number };

const POINTS: Pt[] = CLUSTERS.flatMap((c) =>
  c.words.map((word, i) => ({
    word,
    group: c.group,
    color: c.color,
    x: c.center[0] + OFFSETS[i % OFFSETS.length][0],
    y: c.center[1] + OFFSETS[i % OFFSETS.length][1],
    z: c.center[2] + OFFSETS[i % OFFSETS.length][2],
  })),
);

const BASE_SPIN = 0.0018;

export function Embedding3D() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const [sel, setSel] = useState<number | null>(null);
  const [hint, setHint] = useState(true);

  const neighbours = useMemo(() => {
    if (sel === null) return [];
    const a = POINTS[sel];
    return POINTS.map((p, i) => ({ i, d: Math.hypot(p.x - a.x, p.y - a.y, p.z - a.z) }))
      .filter((n) => n.i !== sel)
      .sort((x, y) => x.d - y.d)
      .slice(0, 3)
      .map((n) => n.i);
  }, [sel]);

  const rot = useRef({ x: -0.3, y: 0 });
  const mom = useRef({ x: 0, y: BASE_SPIN });
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });
  const renderRef = useRef<() => void>(() => {});

  const render = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const R = (Math.min(w, h) / 2) * 0.78;
    const cx = w / 2;
    const cy = h / 2;

    if (!drag.current.active) {
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

    POINTS.forEach((p, i) => {
      const x1 = p.x * cyr - p.z * sy;
      const z1 = p.x * sy + p.z * cyr;
      const y2 = p.y * cxr - z1 * sx;
      const z2 = p.y * sx + z1 * cxr;
      const depth = (z2 + 1.4) / 2.8;
      const px = cx + x1 * R;
      const py = cy + y2 * R;
      proj[i] = { x: px, y: py, d: depth };
      const el = itemRefs.current[i];
      if (!el) return;
      const isSel = i === sel;
      const isNb = neighbours.includes(i);
      const dim = sel !== null && !isSel && !isNb;
      const scale = (0.6 + depth * 0.7) * (isSel ? 1.35 : 1);
      el.style.left = `${px}px`;
      el.style.top = `${py}px`;
      el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = `${isSel ? 1 : isNb ? Math.max(0.8, depth) : dim ? 0.22 : 0.4 + depth * 0.6}`;
      el.style.zIndex = `${Math.round(depth * 100) + (isSel ? 200 : 0)}`;
    });

    neighbours.forEach((nb, k) => {
      const ln = lineRefs.current[k];
      if (!ln || sel === null) return;
      ln.setAttribute("x1", `${proj[sel].x}`);
      ln.setAttribute("y1", `${proj[sel].y}`);
      ln.setAttribute("x2", `${proj[nb].x}`);
      ln.setAttribute("y2", `${proj[nb].y}`);
    });
  }, [sel, neighbours]);

  renderRef.current = render;

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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

  const onDown = (e: React.PointerEvent) => {
    drag.current = { active: true, moved: false, x: e.clientX, y: e.clientY };
    setHint(false);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.active) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.current.moved = true;
    drag.current.x = e.clientX;
    drag.current.y = e.clientY;
    rot.current.y += dx * 0.006;
    rot.current.x += -dy * 0.006;
    mom.current = { x: -dy * 0.0008, y: dx * 0.0008 };
  };
  const onUp = () => {
    drag.current.active = false;
  };

  const active = sel !== null ? POINTS[sel] : null;

  return (
    <figure className="not-prose my-8 rounded-2xl border border-cyan-500/20 bg-[#080d1a] overflow-hidden shadow-[0_0_60px_-20px_rgba(34,211,238,0.4)]">
      <div className="flex items-center justify-between gap-3 border-b border-cyan-500/15 px-4 py-2.5">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-slate-400">
          <Hand className="h-3 w-3" /> a 3D map of meaning — drag to spin, tap a word
        </span>
        <span className="font-mono text-[10px] text-slate-500">3 of ~hundreds of dimensions</span>
      </div>

      <div
        ref={wrapRef}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        className="relative h-80 w-full cursor-grab touch-none select-none active:cursor-grabbing sm:h-96"
        style={{ contain: "layout paint" }}
      >
        <div className="pointer-events-none absolute inset-[15%] rounded-full bg-cyan-500/10 blur-3xl" />
        <svg className="absolute inset-0 h-full w-full">
          {[0, 1, 2].map((k) => (
            <line key={k} ref={(el) => { lineRefs.current[k] = el; }} stroke={active?.color ?? "#22d3ee"} strokeWidth="1" strokeOpacity={sel === null ? 0 : 0.5} strokeDasharray="3 3" />
          ))}
        </svg>
        {POINTS.map((p, i) => (
          <button
            key={p.word}
            ref={(el) => { itemRefs.current[i] = el; }}
            onClick={() => { if (!drag.current.moved) setSel(sel === i ? null : i); }}
            className="absolute left-1/2 top-1/2 whitespace-nowrap font-medium leading-none will-change-transform"
            style={{ fontSize: "0.92rem", color: p.color, opacity: 0 }}
          >
            {p.word}
          </button>
        ))}
        {hint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] text-slate-500">
            ✦ spinning live — grab it
          </div>
        )}
      </div>

      <figcaption className="min-h-[3rem] border-t border-cyan-500/15 px-4 py-3 text-[13px] text-slate-300">
        {active ? (
          <>
            <span className="font-semibold" style={{ color: active.color }}>{active.word}</span> sits closest to{" "}
            {neighbours.map((i, k) => (
              <span key={i}>{k > 0 && ", "}<span style={{ color: POINTS[i].color }}>{POINTS[i].word}</span></span>
            ))}
            {" "}— its nearest neighbours in meaning-space.
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-slate-400">
            <Sparkles className="h-3.5 w-3.5" /> Every word is a point. Spin it around; similar words huddle together in 3D — just like they do in the model&apos;s hundreds of dimensions.
          </span>
        )}
      </figcaption>
    </figure>
  );
}
