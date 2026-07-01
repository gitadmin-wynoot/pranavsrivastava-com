"use client";

import { useMemo } from "react";
import {
  colorFor,
  KIND_COLOR,
  KIND_LABEL,
  type AtlasNode,
  type AtlasNodeKind,
} from "@/lib/atlas";
import { PlaceCloud } from "./place-cloud";

/*
  PlaceWeb — renders a place's curated knowledge graph as a sci-fi relation
  diagram + an interactive significance cloud. The diagram layout is computed
  deterministically from the data (SSR-stable), so it "generates itself" for
  any place; the cloud (<PlaceCloud>) handles drag/spin/spotlight interaction.
*/

const W = 900;
const H = 660;
const CX = W / 2;
const CY = H / 2 + 8;

const color = colorFor;

export function PlaceWeb({
  name,
  nodes,
  links = [],
}: {
  name: string;
  nodes: AtlasNode[];
  links?: [number, number][];
}) {
  // Distinct kinds present, in a stable order — for the legend.
  const legend = useMemo(() => {
    const seen: AtlasNodeKind[] = [];
    for (const n of nodes) {
      if (n.kind && !seen.includes(n.kind)) seen.push(n.kind);
    }
    return seen;
  }, [nodes]);

  // Deterministic radial layout: bigger weight → closer to the core.
  const placed = useMemo(() => {
    const n = nodes.length;
    return nodes.map((node, i) => {
      const angle = (i / n) * Math.PI * 2 - Math.PI / 2 + (n % 2 ? 0.18 : 0);
      const ring =
        node.weight >= 4 ? 188 : node.weight >= 3 ? 238 : 286;
      const jitter = ((i * 53) % 44) - 22; // stable per-index wobble
      const r = ring + jitter;
      return {
        ...node,
        x: CX + r * Math.cos(angle),
        y: CY + r * Math.sin(angle),
        radius: 4 + node.weight * 1.7,
      };
    });
  }, [nodes]);

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-cyan-500/20 bg-[#070b14] shadow-[0_0_60px_-15px_rgba(34,211,238,0.25)]">
      {/* console header */}
      <div className="flex items-center gap-2 border-b border-cyan-500/15 px-4 py-2.5 font-mono text-[11px] text-cyan-300/70">
        <span className="text-cyan-400/90">▸</span>
        <span className="tracking-wide">
          mapping {name.toUpperCase()} — {nodes.length} relations found
        </span>
        <span className="atlas-cursor ml-0.5 text-cyan-300">_</span>
      </div>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="block h-auto w-full"
        role="img"
        aria-label={`Relation map for ${name}`}
      >
        <defs>
          <pattern id="atlas-grid" width="34" height="34" patternUnits="userSpaceOnUse">
            <path
              d="M 34 0 L 0 0 0 34"
              fill="none"
              stroke="rgba(56,189,248,0.06)"
              strokeWidth="1"
            />
          </pattern>
          <radialGradient id="atlas-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(34,211,238,0.18)" />
            <stop offset="100%" stopColor="rgba(34,211,238,0)" />
          </radialGradient>
        </defs>

        <rect width={W} height={H} fill="url(#atlas-grid)" />
        <circle cx={CX} cy={CY} r={300} fill="url(#atlas-glow)" />

        {/* spokes: core → node */}
        {placed.map((p, i) => (
          <line
            key={`spoke-${i}`}
            x1={CX}
            y1={CY}
            x2={p.x}
            y2={p.y}
            stroke="rgba(125,211,252,0.16)"
            strokeWidth="1"
            pathLength={1}
            className="atlas-line"
            style={{ animationDelay: `${0.25 + i * 0.05}s` }}
          />
        ))}

        {/* cross-links between related nodes */}
        {links.map(([a, b], i) => {
          const pa = placed[a];
          const pb = placed[b];
          if (!pa || !pb) return null;
          return (
            <line
              key={`link-${i}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke="rgba(34,211,238,0.3)"
              strokeWidth="1.2"
              pathLength={1}
              className="atlas-line"
              style={{ animationDelay: `${0.7 + i * 0.07}s` }}
            />
          );
        })}

        {/* core node */}
        <g className="atlas-core">
          <circle cx={CX} cy={CY} r={30} fill="rgba(34,211,238,0.12)" />
          <circle
            cx={CX}
            cy={CY}
            r={15}
            fill="#0a1422"
            stroke="#22d3ee"
            strokeWidth="1.5"
          />
        </g>
        <text
          x={CX}
          y={CY + 50}
          textAnchor="middle"
          className="font-mono"
          fontSize="17"
          fontWeight="600"
          fill="#e0f2fe"
        >
          {name}
        </text>

        {/* nodes */}
        {placed.map((p, i) => {
          const left = p.x < CX;
          return (
            <g
              key={`node-${i}`}
              className="atlas-node"
              style={{ animationDelay: `${0.4 + i * 0.06}s` }}
            >
              <circle
                cx={p.x}
                cy={p.y}
                r={p.radius}
                fill={color(p.kind)}
                opacity={0.92}
              />
              <circle cx={p.x} cy={p.y} r={p.radius + 4} fill={color(p.kind)} opacity={0.14} />
              <text
                x={p.x + (left ? -(p.radius + 7) : p.radius + 7)}
                y={p.y + 4}
                textAnchor={left ? "end" : "start"}
                className="font-mono"
                fontSize="13"
                fill="#cbd5e1"
              >
                {p.label}
              </text>
            </g>
          );
        })}
      </svg>

      {/* legend */}
      {legend.length > 0 && (
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 border-t border-cyan-500/15 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-slate-400">
          {legend.map((k) => (
            <span key={k} className="inline-flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ backgroundColor: KIND_COLOR[k] }}
              />
              {KIND_LABEL[k]}
            </span>
          ))}
        </div>
      )}

      {/* interactive significance sphere */}
      <PlaceCloud nodes={nodes} links={links} />
    </figure>
  );
}
