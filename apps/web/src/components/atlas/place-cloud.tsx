"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shuffle, Hand } from "lucide-react";
import { colorFor, KIND_LABEL, type AtlasNode } from "@/lib/atlas";

/*
  PlaceCloud — an interactive 3D "significance sphere".

  Terms are scattered on a sphere (Fibonacci distribution) that auto-rotates,
  can be grabbed and flung (with momentum), and clicked. Clicking a term spins
  it to the front and zooms it; the "spotlight" button surfaces a random aspect.
  Depth drives size + opacity, so it reads as a rotating cloud of light.

  All animation runs by mutating refs/styles inside a rAF loop — React only
  re-renders when the highlighted term changes. Static fallback for reduced
  motion.
*/

const BASE_SPIN = 0.0016;

export function PlaceCloud({ nodes }: { nodes: AtlasNode[] }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [hint, setHint] = useState(true);

  // Fibonacci-sphere unit positions — deterministic, SSR-stable.
  const points = useMemo(() => {
    const n = nodes.length;
    const golden = Math.PI * (1 + Math.sqrt(5));
    return nodes.map((_, i) => {
      const y = 1 - (2 * (i + 0.5)) / n;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i;
      return { x: Math.cos(theta) * r, y, z: Math.sin(theta) * r };
    });
  }, [nodes]);

  const rot = useRef({ x: -0.35, y: 0 });
  const mom = useRef({ x: 0, y: BASE_SPIN });
  const drag = useRef({ active: false, moved: false, x: 0, y: 0 });
  const focus = useRef({ until: 0, tx: 0, ty: 0 });
  const renderRef = useRef<() => void>(() => {});

  const render = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const w = wrap.clientWidth;
    const h = wrap.clientHeight;
    const R = (Math.min(w, h) / 2) * 0.78;
    const cx = w / 2;
    const cy = h / 2;
    const now = performance.now();
    const focusing = now < focus.current.until;

    if (focusing) {
      // ease rotation so the chosen term faces the viewer
      let dy = focus.current.ty - rot.current.y;
      dy = Math.atan2(Math.sin(dy), Math.cos(dy)); // shortest path
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

    points.forEach((p, i) => {
      const el = itemRefs.current[i];
      if (!el) return;
      const x1 = p.x * cyr - p.z * sy;
      const z1 = p.x * sy + p.z * cyr;
      const y2 = p.y * cxr - z1 * sx;
      const z2 = p.y * sx + z1 * cxr;
      const depth = (z2 + 1) / 2; // 0 (back) .. 1 (front)
      const isHi = i === highlight;
      const scale = (0.62 + depth * 0.6) * (isHi ? 1.5 : 1);
      el.style.left = `${cx + x1 * R}px`;
      el.style.top = `${cy + y2 * R}px`;
      el.style.transform = `translate(-50%, -50%) scale(${scale})`;
      el.style.opacity = `${isHi ? 1 : 0.34 + depth * 0.66}`;
      el.style.zIndex = `${Math.round(depth * 100) + (isHi ? 200 : 0)}`;
      el.style.textShadow = isHi
        ? `0 0 14px ${colorFor(nodes[i].kind)}`
        : depth > 0.72
          ? `0 0 8px rgba(34,211,238,0.25)`
          : "none";
    });
  }, [points, nodes, highlight]);

  renderRef.current = render;

  // animation loop (skipped for reduced motion → single static layout)
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

  // re-apply on highlight change (covers the reduced-motion case)
  useEffect(() => {
    renderRef.current();
  }, [highlight]);

  const focusOn = useCallback(
    (i: number) => {
      const p = points[i];
      const rho = Math.sqrt(p.x * p.x + p.z * p.z);
      focus.current = {
        until: performance.now() + 1700,
        ty: Math.atan2(p.x, p.z),
        tx: Math.atan2(p.y, rho),
      };
      setHighlight(i);
      setHint(false);
    },
    [points],
  );

  const spotlight = useCallback(() => {
    let i = Math.floor(Math.random() * nodes.length);
    if (i === highlight) i = (i + 1) % nodes.length;
    focusOn(i);
  }, [nodes.length, highlight, focusOn]);

  // pointer drag → spin with momentum
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

  return (
    <div className="border-t border-cyan-500/15">
      <div className="flex items-center justify-between px-4 pt-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <Hand className="h-3 w-3" /> drag to spin · tap a term
        </span>
        <button
          onClick={spotlight}
          className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 px-2.5 py-1 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
        >
          <Shuffle className="h-3 w-3" /> spotlight
        </button>
      </div>

      <div
        ref={wrapRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        className="relative h-72 w-full cursor-grab touch-none select-none active:cursor-grabbing sm:h-80"
        style={{ contain: "layout paint" }}
      >
        {nodes.map((node, i) => (
          <button
            key={`${node.label}-${i}`}
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            onClick={() => {
              if (!drag.current.moved) focusOn(i);
            }}
            className="absolute left-1/2 top-1/2 whitespace-nowrap font-mono leading-none transition-[font-weight] will-change-transform"
            style={{
              fontSize: `${0.66 + node.weight * 0.13}rem`,
              color: colorFor(node.kind),
              fontWeight: i === highlight ? 700 : 400,
              opacity: 0,
            }}
          >
            {node.label}
          </button>
        ))}

        {hint && (
          <div className="pointer-events-none absolute inset-x-0 bottom-2 text-center font-mono text-[10px] text-slate-500">
            ✦ rotating live
          </div>
        )}
      </div>

      {/* highlighted aspect caption */}
      <div className="min-h-[3.25rem] border-t border-cyan-500/15 px-5 py-3">
        {highlight !== null ? (
          <p className="font-mono text-xs text-slate-300">
            <span style={{ color: colorFor(nodes[highlight].kind) }}>✦ </span>
            <span className="font-semibold text-slate-100">
              {nodes[highlight].label}
            </span>
            <span className="text-slate-500">
              {" "}
              — {KIND_LABEL[nodes[highlight].kind ?? "theme"]}
            </span>
          </p>
        ) : (
          <p className="font-mono text-xs text-slate-500">
            Spin it. Tap a term to zoom in, or hit{" "}
            <span className="text-cyan-300">spotlight</span> for a random one.
          </p>
        )}
        <p className="mt-1 font-mono text-[10px] text-slate-600">
          one day this map will assemble itself — new places, live, from the
          open web.
        </p>
      </div>
    </div>
  );
}
