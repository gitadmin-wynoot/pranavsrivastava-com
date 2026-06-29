import type { ReactNode } from "react";

// Clean, conceptual SVG illustrations for courses and labs — the engaging
// replacement for ASCII diagrams. Dark-mode aware via Tailwind fill-/stroke-
// classes. Use in MDX as <Figure name="..." caption="optional override" />.

function Frame({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 px-4 py-6 sm:px-7 sm:py-7">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-3 text-center text-xs text-zinc-400 dark:text-zinc-500 italic leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Box({
  x, y, w, h, label, sub, accent = "zinc",
}: { x: number; y: number; w: number; h: number; label: string; sub?: string; accent?: string }) {
  const fill: Record<string, string> = {
    zinc: "fill-white dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700",
    blue: "fill-blue-50 dark:fill-blue-950/40 stroke-blue-300 dark:stroke-blue-800",
    emerald: "fill-emerald-50 dark:fill-emerald-950/40 stroke-emerald-300 dark:stroke-emerald-800",
    amber: "fill-amber-50 dark:fill-amber-950/40 stroke-amber-300 dark:stroke-amber-800",
  };
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="11" className={fill[accent]} strokeWidth="1.5" />
      <text x={x + w / 2} y={sub ? y + h / 2 - 4 : y + h / 2 + 4} textAnchor="middle" className="fill-zinc-800 dark:fill-zinc-100" fontSize="14" fontWeight="600">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 14} textAnchor="middle" className="fill-zinc-400" fontSize="11">{sub}</text>}
    </g>
  );
}

/* ── Client ↔ server over a protocol ────────────────────────────────────── */
function ClientServer() {
  return (
    <svg viewBox="0 0 640 170" className="w-full h-auto" fill="none" role="img">
      <Box x={50} y={55} w={190} h={62} label="AI app" sub="e.g. a chat assistant" accent="blue" />
      <Box x={400} y={55} w={190} h={62} label="MCP server" sub="your code + tools" accent="emerald" />
      <line x1="240" y1="86" x2="400" y2="86" className="stroke-zinc-400 dark:stroke-zinc-500" strokeWidth="2" />
      <polygon points="246,86 256,81 256,91" className="fill-zinc-400 dark:fill-zinc-500" />
      <polygon points="394,86 384,81 384,91" className="fill-zinc-400 dark:fill-zinc-500" />
      <text x="320" y="74" textAnchor="middle" className="fill-zinc-500 dark:fill-zinc-400" fontSize="12" fontWeight="600">one shared language</text>
      <text x="320" y="106" textAnchor="middle" className="fill-zinc-400" fontSize="11">(the protocol)</text>
    </svg>
  );
}

/* ── N×M problem: every app wires up every tool ─────────────────────────── */
function NxMProblem() {
  const apps = [60, 120, 180];
  const tools = [48, 102, 156, 210];
  return (
    <svg viewBox="0 0 640 264" className="w-full h-auto" fill="none" role="img">
      {apps.map((ay) =>
        tools.map((ty, j) => (
          <line key={`${ay}-${j}`} x1="150" y1={ay} x2="470" y2={ty} className="stroke-amber-400/50 dark:stroke-amber-500/30" strokeWidth="1.25" />
        ))
      )}
      {apps.map((ay, i) => (
        <g key={`a${i}`}>
          <rect x="60" y={ay - 18} width="92" height="36" rx="9" className="fill-blue-50 dark:fill-blue-950/40 stroke-blue-300 dark:stroke-blue-800" strokeWidth="1.5" />
          <text x="106" y={ay + 5} textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="12" fontWeight="600">App {i + 1}</text>
        </g>
      ))}
      {tools.map((ty, i) => (
        <g key={`t${i}`}>
          <rect x="470" y={ty - 16} width="96" height="32" rx="9" className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
          <text x="518" y={ty + 4} textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-300" fontSize="11">Tool {i + 1}</text>
        </g>
      ))}
      <text x="320" y="252" textAnchor="middle" className="fill-amber-600 dark:fill-amber-400" fontSize="12" fontWeight="600">3 apps × 4 tools = 12 custom connections to build and maintain</text>
    </svg>
  );
}

/* ── N×M solved: one protocol in the middle ─────────────────────────────── */
function NxMSolved() {
  const apps = [60, 120, 180];
  const tools = [48, 102, 156, 210];
  return (
    <svg viewBox="0 0 640 264" className="w-full h-auto" fill="none" role="img">
      <rect x="300" y="40" width="40" height="170" rx="12" className="fill-emerald-100 dark:fill-emerald-950/50 stroke-emerald-400 dark:stroke-emerald-700" strokeWidth="1.5" />
      <text x="320" y="130" textAnchor="middle" className="fill-emerald-700 dark:fill-emerald-300" fontSize="13" fontWeight="700" transform="rotate(-90 320 125)">MCP</text>
      {apps.map((ay) => (
        <line key={`la${ay}`} x1="152" y1={ay} x2="300" y2="125" className="stroke-emerald-400/60 dark:stroke-emerald-500/40" strokeWidth="1.5" />
      ))}
      {tools.map((ty) => (
        <line key={`lt${ty}`} x1="340" y1="125" x2="470" y2={ty} className="stroke-emerald-400/60 dark:stroke-emerald-500/40" strokeWidth="1.5" />
      ))}
      {apps.map((ay, i) => (
        <g key={`a${i}`}>
          <rect x="60" y={ay - 18} width="92" height="36" rx="9" className="fill-blue-50 dark:fill-blue-950/40 stroke-blue-300 dark:stroke-blue-800" strokeWidth="1.5" />
          <text x="106" y={ay + 5} textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="12" fontWeight="600">App {i + 1}</text>
        </g>
      ))}
      {tools.map((ty, i) => (
        <g key={`t${i}`}>
          <rect x="470" y={ty - 16} width="96" height="32" rx="9" className="fill-zinc-50 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700" strokeWidth="1.5" />
          <text x="518" y={ty + 4} textAnchor="middle" className="fill-zinc-600 dark:fill-zinc-300" fontSize="11">Tool {i + 1}</text>
        </g>
      ))}
      <text x="320" y="252" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="12" fontWeight="600">Wrap each tool once. Every app can use it. 3 + 4, not 3 × 4.</text>
    </svg>
  );
}

/* ── RAG flow: question → docs → model → grounded answer ─────────────────── */
function RagFlow() {
  const stages = [
    { x: 24, label: "Question", accent: "zinc" },
    { x: 158, label: "Search docs", accent: "blue" },
    { x: 292, label: "Top passages", accent: "blue" },
    { x: 426, label: "Model reads", accent: "emerald" },
    { x: 560, label: "Answer", accent: "emerald" },
  ];
  const fill: Record<string, string> = {
    zinc: "fill-zinc-50 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700",
    blue: "fill-blue-50 dark:fill-blue-950/40 stroke-blue-300 dark:stroke-blue-800",
    emerald: "fill-emerald-50 dark:fill-emerald-950/40 stroke-emerald-300 dark:stroke-emerald-800",
  };
  return (
    <svg viewBox="0 0 680 130" className="w-full h-auto" fill="none" role="img">
      {stages.slice(0, -1).map((s, i) => (
        <g key={`c${i}`}>
          <line x1={s.x + 96} y1="60" x2={stages[i + 1].x - 4} y2="60" className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.5" />
          <polygon points={`${stages[i + 1].x - 4},60 ${stages[i + 1].x - 13},55 ${stages[i + 1].x - 13},65`} className="fill-zinc-400 dark:fill-zinc-500" />
        </g>
      ))}
      {stages.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y="38" width="96" height="44" rx="10" className={fill[s.accent]} strokeWidth="1.5" />
          <text x={s.x + 48} y="64" textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="11.5" fontWeight="600">{s.label}</text>
        </g>
      ))}
      <text x="608" y="100" textAnchor="middle" className="fill-emerald-600 dark:fill-emerald-400" fontSize="10">+ sources</text>
    </svg>
  );
}

/* ── Agent loop: plan → act → observe → check → repeat ───────────────────── */
function AgentLoop() {
  const cx = 200, cy = 150;
  const nodes = [
    { x: cx, y: 44, label: "Plan", accent: "blue" },
    { x: 348, y: cy, label: "Act", accent: "emerald" },
    { x: cx, y: 256, label: "Observe", accent: "amber" },
    { x: 52, y: cy, label: "Check", accent: "zinc" },
  ];
  const fill: Record<string, string> = {
    zinc: "fill-zinc-50 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700",
    blue: "fill-blue-50 dark:fill-blue-950/40 stroke-blue-300 dark:stroke-blue-800",
    emerald: "fill-emerald-50 dark:fill-emerald-950/40 stroke-emerald-300 dark:stroke-emerald-800",
    amber: "fill-amber-50 dark:fill-amber-950/40 stroke-amber-300 dark:stroke-amber-800",
  };
  const arcs = [
    "M 246,70 A 120 120 0 0 1 326,108",
    "M 326,192 A 120 120 0 0 1 246,230",
    "M 154,230 A 120 120 0 0 1 74,192",
    "M 74,108 A 120 120 0 0 1 154,70",
  ];
  return (
    <svg viewBox="0 0 400 300" className="w-full h-auto" fill="none" role="img">
      {arcs.map((d, i) => (
        <path key={i} d={d} className="stroke-zinc-300 dark:stroke-zinc-600" strokeWidth="1.75" markerEnd="" />
      ))}
      <text x={cx} y={cy - 2} textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-500" fontSize="12" fontStyle="italic">repeat</text>
      <text x={cx} y={cy + 15} textAnchor="middle" className="fill-zinc-400 dark:fill-zinc-500" fontSize="12" fontStyle="italic">until done</text>
      {nodes.map((n, i) => (
        <g key={i}>
          <rect x={n.x - 52} y={n.y - 22} width="104" height="44" rx="11" className={fill[n.accent]} strokeWidth="1.5" />
          <text x={n.x} y={n.y + 5} textAnchor="middle" className="fill-zinc-700 dark:fill-zinc-200" fontSize="13" fontWeight="600">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

const figures: Record<string, { node: ReactNode; caption: string }> = {
  "client-server": { node: <ClientServer />, caption: "A client and a server talking over one agreed protocol — like two people who've agreed to speak the same language." },
  "nxm-problem": { node: <NxMProblem />, caption: "Without a standard, every app has to build a custom connection to every tool. It explodes fast." },
  "nxm-solved": { node: <NxMSolved />, caption: "With one shared protocol, each tool is wrapped once and every app can use it." },
  "rag-flow": { node: <RagFlow />, caption: "Retrieval-augmented generation: find the relevant passages first, then let the model answer from them — with sources." },
  "agent-loop": { node: <AgentLoop />, caption: "An agent isn't one answer — it's a loop that keeps going until the job is done." },
};

export function Figure({ name, caption }: { name: string; caption?: string }) {
  const fig = figures[name];
  if (!fig) return null;
  return <Frame caption={caption ?? fig.caption}>{fig.node}</Frame>;
}

export const courseFigures = { Figure };
