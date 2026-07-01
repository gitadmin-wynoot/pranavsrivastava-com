"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Shuffle, Move } from "lucide-react";

/*
  RelationMap — an interactive, draggable "cause → effect" knowledge map.

  It shows a small everyday piece of knowledge as connected nodes: follow an
  arrow and you're doing what a knowledge-based machine does — inferring a new
  fact from a known one (rain → traffic jams). Nodes can be dragged around; each
  page load picks a random example, and "another example" swaps in a new one.

  Reusable across courses: pass your own `cases`, or use the built-in set.
*/

type RelNode = { id: string; label: string; root?: boolean };
type RelEdge = { from: string; to: string; label: string };
export type RelCase = { title: string; nodes: RelNode[]; edges: RelEdge[] };

const W = 920;
const H = 440;

const DEFAULT_CASES: RelCase[] = [
  {
    title: "When it rains…",
    nodes: [
      { id: "rain", label: "Rain", root: true },
      { id: "wet", label: "Wet roads" },
      { id: "jam", label: "Traffic jams" },
      { id: "umb", label: "Umbrella sales ↑" },
      { id: "pic", label: "Fewer picnics" },
    ],
    edges: [
      { from: "rain", to: "wet", label: "makes" },
      { from: "wet", to: "jam", label: "causes" },
      { from: "rain", to: "umb", label: "raises" },
      { from: "rain", to: "pic", label: "means" },
    ],
  },
  {
    title: "A heatwave hits",
    nodes: [
      { id: "heat", label: "Heatwave", root: true },
      { id: "ac", label: "AC & fan sales ↑" },
      { id: "elec", label: "Electricity demand ↑" },
      { id: "ice", label: "Ice-cream sales ↑" },
      { id: "out", label: "Outdoor activity ↓" },
    ],
    edges: [
      { from: "heat", to: "ac", label: "raises" },
      { from: "ac", to: "elec", label: "drives" },
      { from: "heat", to: "ice", label: "raises" },
      { from: "heat", to: "out", label: "reduces" },
    ],
  },
  {
    title: "Interest rates rise",
    nodes: [
      { id: "rate", label: "Rates rise", root: true },
      { id: "borrow", label: "Borrowing falls" },
      { id: "house", label: "Housing demand cools" },
      { id: "price", label: "Home prices soften" },
    ],
    edges: [
      { from: "rate", to: "borrow", label: "leads to" },
      { from: "borrow", to: "house", label: "cools" },
      { from: "house", to: "price", label: "softens" },
    ],
  },
  {
    title: "A long drought",
    nodes: [
      { id: "dr", label: "Drought", root: true },
      { id: "harvest", label: "Poor harvest" },
      { id: "food", label: "Food prices ↑" },
      { id: "infl", label: "Inflation" },
    ],
    edges: [
      { from: "dr", to: "harvest", label: "causes" },
      { from: "harvest", to: "food", label: "raises" },
      { from: "food", to: "infl", label: "feeds" },
    ],
  },
  {
    title: "The holiday season",
    nodes: [
      { id: "hol", label: "Holiday season", root: true },
      { id: "orders", label: "Online orders ↑" },
      { id: "deliv", label: "Delivery demand ↑" },
      { id: "hire", label: "Courier hiring ↑" },
    ],
    edges: [
      { from: "hol", to: "orders", label: "raises" },
      { from: "orders", to: "deliv", label: "drives" },
      { from: "deliv", to: "hire", label: "forces" },
    ],
  },
  {
    title: "A cold snap",
    nodes: [
      { id: "cold", label: "Cold snap", root: true },
      { id: "flu", label: "Flu cases ↑" },
      { id: "pharm", label: "Pharmacy sales ↑" },
      { id: "doc", label: "Doctor visits ↑" },
    ],
    edges: [
      { from: "cold", to: "flu", label: "spreads" },
      { from: "flu", to: "pharm", label: "raises" },
      { from: "flu", to: "doc", label: "raises" },
    ],
  },
  {
    title: "Fuel prices climb",
    nodes: [
      { id: "fuel", label: "Fuel price ↑", root: true },
      { id: "ship", label: "Delivery costs ↑" },
      { id: "prod", label: "Product prices ↑" },
      { id: "infl", label: "Inflation" },
    ],
    edges: [
      { from: "fuel", to: "ship", label: "raises" },
      { from: "ship", to: "prod", label: "passes to" },
      { from: "prod", to: "infl", label: "feeds" },
    ],
  },
  {
    title: "A new phone launches",
    nodes: [
      { id: "launch", label: "New phone launch", root: true },
      { id: "resale", label: "Old-model resale ↓" },
      { id: "trade", label: "Trade-in demand ↑" },
      { id: "acc", label: "Case & accessory sales ↑" },
    ],
    edges: [
      { from: "launch", to: "resale", label: "drops" },
      { from: "launch", to: "trade", label: "raises" },
      { from: "launch", to: "acc", label: "raises" },
    ],
  },
  {
    title: "A power outage",
    nodes: [
      { id: "out", label: "Power outage", root: true },
      { id: "gen", label: "Generators sell out" },
      { id: "candle", label: "Candles in demand" },
      { id: "spoil", label: "Food spoils" },
    ],
    edges: [
      { from: "out", to: "gen", label: "triggers" },
      { from: "out", to: "candle", label: "raises" },
      { from: "out", to: "spoil", label: "causes" },
    ],
  },
  {
    title: "The monsoon arrives",
    nodes: [
      { id: "mon", label: "Monsoon", root: true },
      { id: "mos", label: "Mosquitoes breed" },
      { id: "den", label: "Dengue risk ↑" },
      { id: "rep", label: "Repellent sales ↑" },
    ],
    edges: [
      { from: "mon", to: "mos", label: "lets" },
      { from: "mos", to: "den", label: "raises" },
      { from: "den", to: "rep", label: "raises" },
    ],
  },
  {
    title: "A big match in town",
    nodes: [
      { id: "match", label: "Big match", root: true },
      { id: "traffic", label: "Stadium traffic ↑" },
      { id: "cafe", label: "Nearby cafés busy" },
      { id: "hotel", label: "Hotel bookings ↑" },
    ],
    edges: [
      { from: "match", to: "traffic", label: "draws" },
      { from: "match", to: "cafe", label: "fills" },
      { from: "match", to: "hotel", label: "raises" },
    ],
  },
  {
    title: "Heavy snowfall",
    nodes: [
      { id: "snow", label: "Heavy snowfall", root: true },
      { id: "flight", label: "Flights delayed" },
      { id: "hotel", label: "Airport hotels ↑" },
      { id: "salt", label: "Salt & shovel sales ↑" },
    ],
    edges: [
      { from: "snow", to: "flight", label: "delays" },
      { from: "flight", to: "hotel", label: "fills" },
      { from: "snow", to: "salt", label: "raises" },
    ],
  },
  {
    title: "The stock market crashes",
    nodes: [
      { id: "crash", label: "Stock crash", root: true },
      { id: "flee", label: "Investors flee" },
      { id: "gold", label: "Gold price ↑" },
    ],
    edges: [
      { from: "crash", to: "flee", label: "spooks" },
      { from: "flee", to: "gold", label: "into" },
    ],
  },
  {
    title: "Wedding season",
    nodes: [
      { id: "wed", label: "Wedding season", root: true },
      { id: "gold", label: "Gold demand ↑" },
      { id: "jewel", label: "Jewellers busy" },
      { id: "banq", label: "Banquet bookings ↑" },
    ],
    edges: [
      { from: "wed", to: "gold", label: "raises" },
      { from: "gold", to: "jewel", label: "fills" },
      { from: "wed", to: "banq", label: "raises" },
    ],
  },
  {
    title: "A city-wide lockdown",
    nodes: [
      { id: "lock", label: "Lockdown", root: true },
      { id: "wfh", label: "Work from home" },
      { id: "laptop", label: "Laptop demand ↑" },
      { id: "office", label: "Office rents ↓" },
    ],
    edges: [
      { from: "lock", to: "wfh", label: "forces" },
      { from: "wfh", to: "laptop", label: "raises" },
      { from: "wfh", to: "office", label: "lowers" },
    ],
  },
  {
    title: "A long weekend",
    nodes: [
      { id: "lw", label: "Long weekend", root: true },
      { id: "hwy", label: "Highway traffic ↑" },
      { id: "fuel", label: "Fuel stations busy" },
      { id: "toll", label: "Toll revenue ↑" },
    ],
    edges: [
      { from: "lw", to: "hwy", label: "swells" },
      { from: "hwy", to: "fuel", label: "fills" },
      { from: "hwy", to: "toll", label: "raises" },
    ],
  },
  {
    title: "A café goes viral",
    nodes: [
      { id: "viral", label: "Viral video", root: true },
      { id: "foot", label: "Footfall spikes" },
      { id: "queue", label: "Long queue" },
      { id: "rev", label: "More reviews" },
    ],
    edges: [
      { from: "viral", to: "foot", label: "drives" },
      { from: "foot", to: "queue", label: "forms" },
      { from: "foot", to: "rev", label: "brings" },
    ],
  },
  {
    title: "An outage on a live service",
    nodes: [
      { id: "down", label: "Server outage", root: true },
      { id: "tickets", label: "Support tickets ↑" },
      { id: "social", label: "Social complaints ↑" },
      { id: "stock", label: "Stock dips" },
    ],
    edges: [
      { from: "down", to: "tickets", label: "spikes" },
      { from: "down", to: "social", label: "sparks" },
      { from: "social", to: "stock", label: "dents" },
    ],
  },
];

function nodeSize(label: string) {
  const w = Math.min(232, Math.max(96, label.length * 8.2 + 26));
  return { w, h: 42 };
}

function computeLayout(c: RelCase): Record<string, { x: number; y: number }> {
  const incoming: Record<string, number> = {};
  c.nodes.forEach((n) => (incoming[n.id] = 0));
  c.edges.forEach((e) => (incoming[e.to] = (incoming[e.to] ?? 0) + 1));
  const level: Record<string, number> = {};
  c.nodes.forEach((n) => (level[n.id] = incoming[n.id] === 0 ? 0 : -1));
  let changed = true;
  let guard = 0;
  while (changed && guard++ < 60) {
    changed = false;
    c.edges.forEach((e) => {
      if (level[e.from] >= 0) {
        const nl = level[e.from] + 1;
        if (nl > level[e.to]) {
          level[e.to] = nl;
          changed = true;
        }
      }
    });
  }
  c.nodes.forEach((n) => {
    if (level[n.id] < 0) level[n.id] = 0;
  });
  const maxLevel = Math.max(0, ...c.nodes.map((n) => level[n.id]));
  const byLevel: Record<number, string[]> = {};
  c.nodes.forEach((n) => {
    (byLevel[level[n.id]] ||= []).push(n.id);
  });
  const colW = maxLevel > 0 ? (W - 200) / maxLevel : 0;
  const pos: Record<string, { x: number; y: number }> = {};
  Object.entries(byLevel).forEach(([lv, ids]) => {
    const k = ids.length;
    ids.forEach((id, i) => {
      pos[id] = { x: 100 + Number(lv) * colW, y: (H / (k + 1)) * (i + 1) };
    });
  });
  return pos;
}

/** Point where the segment toward (fromx,fromy) crosses the node's box border. */
function borderPoint(cx: number, cy: number, hw: number, hh: number, fromx: number, fromy: number) {
  const dx = cx - fromx;
  const dy = cy - fromy;
  if (dx === 0 && dy === 0) return { x: cx, y: cy };
  const sx = dx !== 0 ? hw / Math.abs(dx) : Infinity;
  const sy = dy !== 0 ? hh / Math.abs(dy) : Infinity;
  const s = Math.min(sx, sy);
  return { x: cx - dx * s, y: cy - dy * s };
}

export function RelationMap({ cases = DEFAULT_CASES }: { cases?: RelCase[] }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [idx, setIdx] = useState(0);
  const [pos, setPos] = useState<Record<string, { x: number; y: number }>>(() =>
    computeLayout(cases[0]),
  );
  const drag = useRef<{ id: string | null; ox: number; oy: number }>({ id: null, ox: 0, oy: 0 });

  // pick a random example on mount (SSR renders case 0, so no hydration mismatch)
  useEffect(() => {
    const r = Math.floor(Math.random() * cases.length);
    setIdx(r);
    setPos(computeLayout(cases[r]));
  }, [cases]);

  const current = cases[idx];
  const sizes = useMemo(() => {
    const m: Record<string, { w: number; h: number }> = {};
    current.nodes.forEach((n) => (m[n.id] = nodeSize(n.label)));
    return m;
  }, [current]);

  const toSvg = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const p = svg.createSVGPoint();
    p.x = clientX;
    p.y = clientY;
    const t = p.matrixTransform(ctm.inverse());
    return { x: t.x, y: t.y };
  }, []);

  const onNodeDown = (e: React.PointerEvent, id: string) => {
    e.stopPropagation();
    (e.currentTarget as Element).setPointerCapture(e.pointerId);
    const p = toSvg(e.clientX, e.clientY);
    drag.current = { id, ox: p.x - pos[id].x, oy: p.y - pos[id].y };
  };
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current.id) return;
    const p = toSvg(e.clientX, e.clientY);
    const id = drag.current.id;
    setPos((prev) => ({
      ...prev,
      [id]: {
        x: Math.max(60, Math.min(W - 60, p.x - drag.current.ox)),
        y: Math.max(30, Math.min(H - 30, p.y - drag.current.oy)),
      },
    }));
  };
  const onUp = () => {
    drag.current.id = null;
  };

  const another = () => {
    let r = Math.floor(Math.random() * cases.length);
    if (r === idx) r = (r + 1) % cases.length;
    setIdx(r);
    setPos(computeLayout(cases[r]));
  };

  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5">
        <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100">
          {current.title}
        </p>
        <button
          onClick={another}
          className="inline-flex items-center gap-1.5 rounded-full border border-zinc-300 dark:border-zinc-700 px-2.5 py-1 text-xs text-zinc-600 dark:text-zinc-300 hover:border-blue-500/50 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Shuffle className="h-3 w-3" /> another example
        </button>
      </div>

      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full touch-none select-none"
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
        role="img"
        aria-label={`Relation map: ${current.title}`}
      >
        <defs>
          <marker id="rm-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
            <path d="M0,0 L10,5 L0,10 z" fill="#38bdf8" />
          </marker>
        </defs>

        {/* edges */}
        {current.edges.map((e, i) => {
          const a = pos[e.from];
          const b = pos[e.to];
          if (!a || !b) return null;
          const sa = sizes[e.from];
          const sb = sizes[e.to];
          const start = borderPoint(a.x, a.y, sa.w / 2 + 4, sa.h / 2 + 4, b.x, b.y);
          const end = borderPoint(b.x, b.y, sb.w / 2 + 8, sb.h / 2 + 8, a.x, a.y);
          const mx = (start.x + end.x) / 2;
          const my = (start.y + end.y) / 2;
          const lw = e.label.length * 6.2 + 12;
          return (
            <g key={`e${i}`}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                className="stroke-sky-400/70"
                strokeWidth="1.75"
                markerEnd="url(#rm-arrow)"
              />
              <rect
                x={mx - lw / 2}
                y={my - 9}
                width={lw}
                height={18}
                rx={9}
                className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-200 dark:stroke-zinc-800"
                strokeWidth="1"
              />
              <text x={mx} y={my + 3.5} textAnchor="middle" fontSize="11" className="fill-zinc-500 dark:fill-zinc-400">
                {e.label}
              </text>
            </g>
          );
        })}

        {/* nodes */}
        {current.nodes.map((n) => {
          const p = pos[n.id];
          if (!p) return null;
          const s = sizes[n.id];
          return (
            <g
              key={n.id}
              transform={`translate(${p.x - s.w / 2}, ${p.y - s.h / 2})`}
              onPointerDown={(e) => onNodeDown(e, n.id)}
              className="cursor-grab active:cursor-grabbing"
            >
              <rect
                width={s.w}
                height={s.h}
                rx={10}
                className={
                  n.root
                    ? "fill-amber-400/20 stroke-amber-500"
                    : "fill-sky-400/10 stroke-sky-500/50"
                }
                strokeWidth="1.5"
              />
              <text
                x={s.w / 2}
                y={s.h / 2 + 4}
                textAnchor="middle"
                fontSize="13"
                fontWeight={n.root ? 600 : 500}
                className="fill-zinc-800 dark:fill-zinc-100"
              >
                {n.label}
              </text>
            </g>
          );
        })}
      </svg>

      <figcaption className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 border-t border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-[11px] text-zinc-400">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-amber-500" /> cause
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full bg-sky-500" /> effect
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Move className="h-3 w-3" /> drag the nodes · arrows are relationships
        </span>
      </figcaption>
    </figure>
  );
}
