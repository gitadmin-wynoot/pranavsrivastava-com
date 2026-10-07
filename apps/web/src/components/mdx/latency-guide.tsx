"use client";

import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/*
  Interactives for the "why is my RAG chatbot slow" guide.
  Numbers are illustrative, shaped like real systems, not benchmarks.
  Each one teaches a single idea: measure first, then pick the fix.
*/

function Frame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <figure className="not-prose my-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 overflow-hidden">
      <div className="border-b border-zinc-200 dark:border-zinc-800 px-4 py-2.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
        {title}
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </figure>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-2.5 py-1 text-[11px] transition-colors",
        active
          ? "border-zinc-900 dark:border-zinc-100 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
          : "border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200"
      )}
    >
      {children}
    </button>
  );
}

function Bar({ pct, className }: { pct: number; className: string }) {
  return (
    <div className="h-3 w-full rounded bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
      <div
        className={cn("h-full rounded transition-all duration-300", className)}
        style={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
      />
    </div>
  );
}

// ── 1. Stopwatch: where does one question spend its time? ─────────────────

const STAGES = [
  { key: "queue", label: "Waiting in line", color: "bg-zinc-400" },
  { key: "embed", label: "Embed the question", color: "bg-sky-400" },
  { key: "search", label: "Vector search", color: "bg-blue-500" },
  { key: "rerank", label: "Re-rank candidates", color: "bg-violet-500" },
  { key: "first", label: "LLM thinks (first token)", color: "bg-amber-500" },
  { key: "rest", label: "LLM writes the rest", color: "bg-amber-300" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

const SCENARIOS: { name: string; note: string; ms: Record<StageKey, number> }[] = [
  {
    name: "Laptop demo",
    note: "Ten documents, one user, nothing else running.",
    ms: { queue: 0, embed: 25, search: 12, rerank: 0, first: 350, rest: 900 },
  },
  {
    name: "1M documents",
    note: "Same code, but the index was never tuned for a corpus this size.",
    ms: { queue: 0, embed: 25, search: 1400, rerank: 180, first: 350, rest: 900 },
  },
  {
    name: "Rush hour",
    note: "Same index, but 200 people ask at once and each request waits for a free worker.",
    ms: { queue: 2600, embed: 25, search: 1400, rerank: 180, first: 350, rest: 900 },
  },
  {
    name: "Big shortlist",
    note: "Re-ranking 200 candidates on a small CPU instead of 20.",
    ms: { queue: 0, embed: 25, search: 60, rerank: 2400, first: 350, rest: 900 },
  },
];

export function LatencyStopwatch() {
  const [i, setI] = useState(1);
  const s = SCENARIOS[i];
  const total = STAGES.reduce((a, st) => a + s.ms[st.key], 0);
  const ttft = STAGES.slice(0, 5).reduce((a, st) => a + s.ms[st.key], 0);
  const biggest = STAGES.reduce((best, st) => (s.ms[st.key] > s.ms[best.key] ? st : best), STAGES[0]);

  return (
    <Frame title="One question, one stopwatch. Pick a situation.">
      <div className="flex flex-wrap gap-1.5">
        {SCENARIOS.map((sc, idx) => (
          <Chip key={sc.name} active={idx === i} onClick={() => setI(idx)}>
            {sc.name}
          </Chip>
        ))}
      </div>
      <p className="mt-3 text-[12px] text-zinc-500">{s.note}</p>

      <div className="mt-4 space-y-2">
        {STAGES.map((st) => {
          const ms = s.ms[st.key];
          const isBiggest = st.key === biggest.key && ms > 0;
          return (
            <div key={st.key} className="grid grid-cols-[9.5rem_1fr_4.5rem] items-center gap-2 text-[12px]">
              <span className={cn("truncate", isBiggest ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400")}>
                {st.label}
              </span>
              <Bar pct={total ? (ms / total) * 100 : 0} className={st.color} />
              <span className="text-right tabular-nums text-zinc-600 dark:text-zinc-300">{ms} ms</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">First word</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{ttft} ms</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Full answer</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{total} ms</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Biggest piece</div>
          <div className="text-[12px] font-semibold text-zinc-900 dark:text-zinc-100">{biggest.label}</div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-zinc-500">
        Notice that the model is not the biggest piece in the first three scenarios. That is the whole point of measuring.
      </p>
    </Frame>
  );
}

// ── 2. ANN tuning: how hard should the index look? ────────────────────────

const ANN_POINTS = [
  { explored: 10, ms: 4, recall: 71 },
  { explored: 20, ms: 6, recall: 82 },
  { explored: 40, ms: 9, recall: 90 },
  { explored: 80, ms: 15, recall: 95 },
  { explored: 160, ms: 28, recall: 98 },
  { explored: 320, ms: 52, recall: 99 },
  { explored: 640, ms: 98, recall: 99.5 },
  { explored: 1280, ms: 190, recall: 99.7 },
];

export function AnnTradeoff() {
  const [i, setI] = useState(3);
  const p = ANN_POINTS[i];
  const maxMs = ANN_POINTS[ANN_POINTS.length - 1].ms;

  return (
    <Frame title="How hard should the index look? Drag and watch the trade.">
      <label className="block text-[12px] text-zinc-500 dark:text-zinc-400">
        Search breadth: candidates explored per query <b className="text-zinc-900 dark:text-zinc-100 tabular-nums">{p.explored}</b>
        <input
          type="range"
          min={0}
          max={ANN_POINTS.length - 1}
          value={i}
          onChange={(e) => setI(Number(e.target.value))}
          className="mt-2 w-full accent-blue-500"
        />
      </label>

      <div className="mt-4 space-y-3 text-[12px]">
        <div className="grid grid-cols-[7rem_1fr_4.5rem] items-center gap-2">
          <span className="text-zinc-500">Search time</span>
          <Bar pct={(p.ms / maxMs) * 100} className="bg-blue-500" />
          <span className="text-right tabular-nums">{p.ms} ms</span>
        </div>
        <div className="grid grid-cols-[7rem_1fr_4.5rem] items-center gap-2">
          <span className="text-zinc-500">Recall</span>
          <Bar pct={p.recall} className="bg-emerald-500" />
          <span className="text-right tabular-nums">{p.recall}%</span>
        </div>
      </div>

      <p className="mt-4 text-[12px] text-zinc-500">
        {p.recall < 95 && "Fast, but it misses about one good passage in five. The answer may be in the library and still never reach the model."}
        {p.recall >= 95 && p.recall < 99 && "This is the sweet spot for many chatbots. Most of the right passages are found, and the wait stays short."}
        {p.recall >= 99 && "Almost perfect recall, but each extra step buys less and costs more. Past here you are paying for a fraction of a percent."}
      </p>
      <p className="mt-2 text-[11px] text-zinc-400">
        Scanning every vector instead (exact search) gives 100% recall, but on millions of vectors it can take seconds per question. Illustrative numbers, shaped like a typical HNSW curve. Measure your own index.
      </p>
    </Frame>
  );
}

// ── 3. Shard routing: search the right shelf, not the whole library ──────

const SHARDS = [
  { name: "Products", vectors: 4.0 },
  { name: "Customers", vectors: 2.5 },
  { name: "Support", vectors: 1.5 },
  { name: "Policies", vectors: 1.0 },
  { name: "Technical docs", vectors: 1.0 },
];

const SHARD_QUESTIONS = [
  { q: "What is the refund window for a hoodie?", shard: "Policies" },
  { q: "Why did my order ship twice?", shard: "Customers" },
  { q: "How do I rotate an API key?", shard: "Technical docs" },
];

const TOTAL_VECTORS = SHARDS.reduce((a, s) => a + s.vectors, 0);

export function ShardRouter() {
  const [qi, setQi] = useState(0);
  const [routing, setRouting] = useState(true);
  const [wrongRoute, setWrongRoute] = useState(false);

  const target = SHARD_QUESTIONS[qi].shard;
  const routedTo = wrongRoute ? (target === "Products" ? "Support" : "Products") : target;
  const searched = routing ? SHARDS.filter((s) => s.name === routedTo).map((s) => s.name) : SHARDS.map((s) => s.name);
  const scanned = SHARDS.filter((s) => searched.includes(s.name)).reduce((a, s) => a + s.vectors, 0);
  const found = searched.includes(target);

  return (
    <Frame title="10 million vectors. Which shelf does the answer live on?">
      <div className="flex flex-wrap gap-1.5">
        {SHARD_QUESTIONS.map((sq, idx) => (
          <Chip key={sq.q} active={idx === qi} onClick={() => setQi(idx)}>
            Question {idx + 1}
          </Chip>
        ))}
      </div>
      <p className="mt-3 text-[13px] text-zinc-700 dark:text-zinc-200">&ldquo;{SHARD_QUESTIONS[qi].q}&rdquo;</p>

      <div className="mt-4 flex flex-wrap gap-3 text-[12px]">
        <label className="flex items-center gap-1.5 text-zinc-600 dark:text-zinc-300">
          <input type="checkbox" checked={routing} onChange={(e) => setRouting(e.target.checked)} className="accent-blue-500" />
          Route to one shard first
        </label>
        <label className={cn("flex items-center gap-1.5", routing ? "text-zinc-600 dark:text-zinc-300" : "text-zinc-300 dark:text-zinc-600")}>
          <input
            type="checkbox"
            checked={wrongRoute}
            disabled={!routing}
            onChange={(e) => setWrongRoute(e.target.checked)}
            className="accent-rose-500"
          />
          The router guesses wrong
        </label>
      </div>

      <div className="mt-4 space-y-2">
        {SHARDS.map((s) => {
          const isSearched = searched.includes(s.name);
          const isTarget = s.name === target;
          return (
            <div key={s.name} className={cn("grid grid-cols-[8.5rem_1fr_3.5rem] items-center gap-2 text-[12px] transition-opacity", !isSearched && "opacity-40")}>
              <span className={cn("truncate", isTarget ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400")}>
                {isTarget ? "▸ " : ""}
                {s.name}
              </span>
              <Bar pct={(s.vectors / TOTAL_VECTORS) * 100} className={isSearched ? "bg-blue-500" : "bg-zinc-400"} />
              <span className="text-right tabular-nums text-zinc-500">{s.vectors}M</span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Vectors scanned</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {scanned.toFixed(1)}M of {TOTAL_VECTORS}M
          </div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Answer found?</div>
          <div className={cn("text-sm font-semibold", found ? "text-emerald-600 dark:text-emerald-400" : "text-rose-600 dark:text-rose-400")}>
            {found ? "Yes" : "No, it was never searched"}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-zinc-500">
        {!routing && "Searching everything is slow but never misses. Nothing is lost, and nothing is saved."}
        {routing && !wrongRoute && "Routing skips most of the library. The speed-up is large, but only as good as the router's guess."}
        {routing && wrongRoute && "The fastest search in the world does not help if it looks in the wrong place. Routing mistakes fail quietly, so test them on purpose."}
      </p>
    </Frame>
  );
}

// ── 4. Parallel vs sequential, and the cost of a new connection ───────────

const LOOKUPS = [
  { name: "User profile", ms: 120 },
  { name: "Order history", ms: 140 },
  { name: "Policy search", ms: 180 },
  { name: "Entitlement check", ms: 90 },
];

const CONNECT_MS = 80;

export function ParallelVsSequential() {
  const [parallel, setParallel] = useState(false);
  const [pooled, setPooled] = useState(true);

  const durations = LOOKUPS.map((l) => l.ms + (pooled ? 0 : CONNECT_MS));
  const starts = durations.map((_, idx) =>
    parallel ? 0 : durations.slice(0, idx).reduce((a, b) => a + b, 0)
  );
  const total = parallel ? Math.max(...durations) : durations.reduce((a, b) => a + b, 0);
  const scale = durations.reduce((a, b) => a + b, 0);

  return (
    <Frame title="Four lookups for one question. Who waits for whom?">
      <div className="flex flex-wrap gap-3 text-[12px]">
        <div className="flex gap-1.5">
          <Chip active={!parallel} onClick={() => setParallel(false)}>One after another</Chip>
          <Chip active={parallel} onClick={() => setParallel(true)}>All at once</Chip>
        </div>
        <div className="flex gap-1.5">
          <Chip active={pooled} onClick={() => setPooled(true)}>Reuse connections</Chip>
          <Chip active={!pooled} onClick={() => setPooled(false)}>Open a new one each time</Chip>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {LOOKUPS.map((l, idx) => (
          <div key={l.name} className="grid grid-cols-[7.5rem_1fr] items-center gap-2 text-[12px]">
            <span className="truncate text-zinc-500 dark:text-zinc-400">{l.name}</span>
            <div className="relative h-4 rounded bg-zinc-100 dark:bg-zinc-800">
              <div
                className="absolute top-0 h-full rounded bg-blue-500 transition-all duration-300"
                style={{
                  left: `${(starts[idx] / scale) * 100}%`,
                  width: `${(durations[idx] / scale) * 100}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[13px] text-zinc-700 dark:text-zinc-200">
        Wait for the answer: <b>{total} ms</b>
        {!pooled && <span className="text-zinc-500"> (includes {CONNECT_MS} ms of setup on every call)</span>}
      </p>
      <p className="mt-1 text-[12px] text-zinc-500">
        {parallel
          ? "Independent lookups run side by side, so the wait is the slowest one, not the sum of all of them."
          : "Each lookup waits for the one before it, even though none of them needs the others' answers."}
        {!pooled && " Opening a fresh connection every time pays the handshake again and again. A pool keeps a few open and hands them out."}
      </p>
    </Frame>
  );
}

// ── 5. Ingestion pipeline: which stage caps the whole line? ───────────────

type IngestKey = "parse" | "chunk" | "embed" | "insert";

const INGEST_STAGES: { key: IngestKey; label: string; color: string }[] = [
  { key: "parse", label: "Parse", color: "bg-sky-500" },
  { key: "chunk", label: "Chunk", color: "bg-violet-500" },
  { key: "embed", label: "Embed", color: "bg-amber-500" },
  { key: "insert", label: "Store vectors", color: "bg-emerald-500" },
];

// seconds of work per document (a 30-page document)
const SECONDS: Record<IngestKey, { fixed: number; semantic: number }> = {
  parse: { fixed: 4, semantic: 4 },
  chunk: { fixed: 0.05, semantic: 9 },
  embed: { fixed: 1.2, semantic: 1.2 },
  insert: { fixed: 0.2, semantic: 0.2 },
};

const CORPUS_OPTIONS = [1_000, 100_000, 1_000_000];

export function IngestionPipeline() {
  const [semantic, setSemantic] = useState(true);
  const [workers, setWorkers] = useState<Record<IngestKey, number>>({ parse: 4, chunk: 4, embed: 4, insert: 1 });
  const [corpus, setCorpus] = useState(0);

  const rates = INGEST_STAGES.map((st) => {
    const secs = SECONDS[st.key][semantic ? "semantic" : "fixed"];
    return { ...st, perMin: (workers[st.key] * 60) / secs };
  });
  const slowest = rates.reduce((best, r) => (r.perMin < best.perMin ? r : best), rates[0]);
  const maxRate = Math.max(...rates.map((r) => r.perMin));
  const docs = CORPUS_OPTIONS[corpus];
  const hours = docs / slowest.perMin / 60;

  return (
    <Frame title="Upload a corpus. Each stage has its own workers. Find the one that caps the line.">
      <div className="flex flex-wrap gap-3 text-[12px]">
        <div className="flex gap-1.5">
          <Chip active={!semantic} onClick={() => setSemantic(false)}>Fixed-size chunks</Chip>
          <Chip active={semantic} onClick={() => setSemantic(true)}>Semantic chunks</Chip>
        </div>
        <div className="flex gap-1.5">
          {CORPUS_OPTIONS.map((n, idx) => (
            <Chip key={n} active={idx === corpus} onClick={() => setCorpus(idx)}>
              {n.toLocaleString("en-US")} docs
            </Chip>
          ))}
        </div>
      </div>

      <div className="mt-4 space-y-3">
        {rates.map((r) => {
          const isSlowest = r.key === slowest.key;
          return (
            <div key={r.key} className="space-y-1">
              <div className="grid grid-cols-[7rem_1fr_6.5rem] items-center gap-2 text-[12px]">
                <span className={cn(isSlowest ? "font-semibold text-zinc-900 dark:text-zinc-100" : "text-zinc-500 dark:text-zinc-400")}>
                  {isSlowest ? "▸ " : ""}
                  {r.label}
                </span>
                <Bar pct={(r.perMin / maxRate) * 100} className={r.color} />
                <span className="text-right tabular-nums text-zinc-500">{r.perMin.toFixed(0)} docs/min</span>
              </div>
              <input
                type="range"
                min={1}
                max={16}
                value={workers[r.key]}
                onChange={(e) => setWorkers({ ...workers, [r.key]: Number(e.target.value) })}
                aria-label={`${r.label} workers`}
                className="w-full accent-zinc-700 dark:accent-zinc-300"
              />
              <div className="text-[10px] text-zinc-400">{workers[r.key]} worker{workers[r.key] > 1 ? "s" : ""}</div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Caps the line</div>
          <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{slowest.label}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Time to index {docs.toLocaleString("en-US")} docs</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {hours < 48 ? `${hours.toFixed(1)} hours` : `${(hours / 24).toFixed(1)} days`}
          </div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-zinc-500">
        Slide the workers on any stage that is not the bottleneck and the total barely moves. Give workers to {slowest.label.toLowerCase()} instead. Times are per 30-page document and illustrative.
      </p>
    </Frame>
  );
}

// ── 6. Symptom triage: where do I look first? ─────────────────────────────

const SYMPTOMS = [
  {
    symptom: "The first word takes 5 seconds, then the text streams fast.",
    look: "Before the model. Silence before the first token is usually embedding, search, re-ranking or a queue. Measure each span.",
  },
  {
    symptom: "It is fast with 3 users and slow with 300.",
    look: "Queues and limits: worker count, connection pool size, rate limits, autoscaling. A faster model would not change this shape.",
  },
  {
    symptom: "Uploading a 200-page PDF takes forever. Chat itself feels fine.",
    look: "Ingestion. Time parsing, chunking, embedding and insertion separately. Semantic chunking is a common culprit at scale.",
  },
  {
    symptom: "Answers are fast, but they miss exact product codes.",
    look: "This is a quality problem, not a speed problem. Check keyword (BM25) search, chunk boundaries and the embedding model.",
  },
  {
    symptom: "Only one kind of question is slow.",
    look: "Look at the route that question takes: which collection it searches, how many candidates reach the re-ranker, or whether it triggers a tool call.",
  },
];

export function SymptomTriage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <Frame title="Triage: the complaint is not the diagnosis. Pick a symptom.">
      <div className="space-y-2">
        {SYMPTOMS.map((s, idx) => {
          const isOpen = open === idx;
          return (
            <button
              key={s.symptom}
              type="button"
              onClick={() => setOpen(isOpen ? null : idx)}
              aria-expanded={isOpen}
              className={cn(
                "w-full rounded-xl border p-3 text-left transition-colors",
                isOpen
                  ? "border-blue-300 dark:border-blue-800 bg-blue-50/60 dark:bg-blue-950/20"
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900/60"
              )}
            >
              <span className="text-[13px] text-zinc-800 dark:text-zinc-100">&ldquo;{s.symptom}&rdquo;</span>
              {isOpen && (
                <span className="mt-2 block text-[12px] leading-relaxed text-zinc-600 dark:text-zinc-300">{s.look}</span>
              )}
            </button>
          );
        })}
      </div>
    </Frame>
  );
}

// ── 7. Ask a question, then see what it cost, by span ─────────────────────

const SPANS = [
  { name: "Knowledge retrieval", ms: 380, owner: "Your search index" },
  { name: "Capability lookup", ms: 45, owner: "Your structured data" },
  { name: "Tool / action call", ms: 1200, owner: "A system outside the bot" },
  { name: "Generation", ms: 900, owner: "The LLM" },
];

export function SpanBudget() {
  const [on, setOn] = useState<boolean[]>([true, true, true, true]);
  const active = SPANS.filter((_, idx) => on[idx]);
  const total = active.reduce((a, s) => a + s.ms, 0);
  const worst = active.reduce<(typeof SPANS)[number] | null>((best, s) => (!best || s.ms > best.ms ? s : best), null);

  return (
    <Frame title="One agentic answer, four separately timed spans. Switch them off to see the effect.">
      <div className="flex flex-wrap gap-1.5">
        {SPANS.map((s, idx) => (
          <Chip key={s.name} active={on[idx]} onClick={() => setOn(on.map((v, j) => (j === idx ? !v : v)))}>
            {s.name}
          </Chip>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {SPANS.map((s, idx) => (
          <div key={s.name} className={cn("grid grid-cols-[9rem_1fr_4.5rem] items-center gap-2 text-[12px] transition-opacity", !on[idx] && "opacity-30")}>
            <span className="truncate text-zinc-500 dark:text-zinc-400">{s.name}</span>
            <Bar pct={(s.ms / 1200) * 100} className="bg-blue-500" />
            <span className="text-right tabular-nums text-zinc-600 dark:text-zinc-300">{s.ms} ms</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-[13px] text-zinc-700 dark:text-zinc-200">
        Measured total: <b>{total} ms</b>
        {worst && (
          <>
            {" "}· slowest span: <b>{worst.name}</b> ({worst.owner.toLowerCase()})
          </>
        )}
      </p>
      <p className="mt-1 text-[12px] text-zinc-500">
        If these four were one blob called &ldquo;the chatbot&rdquo;, you would blame the model for the tool call&apos;s 1.2 seconds. Separate spans tell you who owns the wait.
      </p>
    </Frame>
  );
}

// ── 8. Nearest neighbours in 2D: what exact search and IVF each look at ──

type Toy = { x: number; y: number; label: string; room: number };

const TOY: Toy[] = [
  { x: 14, y: 20, label: "refund window", room: 0 },
  { x: 18, y: 30, label: "return a sofa", room: 0 },
  { x: 24, y: 18, label: "refund method", room: 0 },
  { x: 22, y: 34, label: "return shipping", room: 0 },
  { x: 12, y: 28, label: "damaged item", room: 0 },
  { x: 70, y: 14, label: "late delivery", room: 1 },
  { x: 78, y: 24, label: "delivery date", room: 1 },
  { x: 72, y: 30, label: "tracking", room: 1 },
  { x: 82, y: 15, label: "missed delivery", room: 1 },
  { x: 68, y: 26, label: "delivery fee", room: 1 },
  { x: 20, y: 70, label: "sofa dimensions", room: 2 },
  { x: 28, y: 80, label: "fits through door", room: 2 },
  { x: 22, y: 84, label: "size chart", room: 2 },
  { x: 34, y: 72, label: "fabric colours", room: 2 },
  { x: 16, y: 78, label: "assembly", room: 2 },
  { x: 70, y: 70, label: "reset password", room: 3 },
  { x: 80, y: 80, label: "change address", room: 3 },
  { x: 74, y: 84, label: "update email", room: 3 },
  { x: 66, y: 78, label: "delete account", room: 3 },
  { x: 84, y: 70, label: "payment method", room: 3 },
];

const ROOMS = [
  { name: "refunds", x: 20, y: 25 },
  { name: "delivery", x: 75, y: 20 },
  { name: "sizing", x: 25, y: 75 },
  { name: "account", x: 75, y: 75 },
];

const ROOM_COLOR = ["fill-amber-500", "fill-sky-500", "fill-violet-500", "fill-emerald-500"];

const dist = (a: { x: number; y: number }, b: { x: number; y: number }) => Math.hypot(a.x - b.x, a.y - b.y);

export function NearestNeighbours() {
  const [q, setQ] = useState({ x: 48, y: 46 });
  const [ivf, setIvf] = useState(false);
  const [probe, setProbe] = useState(1);

  const exact = [...TOY].sort((a, b) => dist(a, q) - dist(b, q)).slice(0, 3);

  const probed = ROOMS.map((r, i) => ({ i, d: dist(r, q) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, probe)
    .map((r) => r.i);
  const pool = ivf ? TOY.filter((p) => probed.includes(p.room)) : TOY;
  const approx = [...pool].sort((a, b) => dist(a, q) - dist(b, q)).slice(0, 3);
  const hits = approx.filter((p) => exact.includes(p)).length;

  const onPlace = (e: MouseEvent<SVGSVGElement>) => {
    const box = e.currentTarget.getBoundingClientRect();
    setQ({
      x: Math.round(((e.clientX - box.left) / box.width) * 100),
      y: Math.round(((e.clientY - box.top) / box.height) * 100),
    });
  };

  return (
    <Frame title="A tiny 2D library. Click anywhere to ask a question.">
      <div className="flex flex-wrap gap-3 text-[12px]">
        <div className="flex gap-1.5">
          <Chip active={!ivf} onClick={() => setIvf(false)}>Check every card</Chip>
          <Chip active={ivf} onClick={() => setIvf(true)}>Check only nearby rooms (IVF)</Chip>
        </div>
        {ivf && (
          <div className="flex gap-1.5">
            <Chip active={probe === 1} onClick={() => setProbe(1)}>1 room</Chip>
            <Chip active={probe === 2} onClick={() => setProbe(2)}>2 rooms</Chip>
          </div>
        )}
      </div>

      <svg
        viewBox="0 0 100 100"
        onClick={onPlace}
        className="mt-4 w-full max-w-sm mx-auto aspect-square cursor-crosshair rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950"
        role="img"
        aria-label="Points on a 2D plane grouped into four rooms. Click to place a question."
      >
        {ROOMS.map((r, i) => {
          const open = !ivf || probed.includes(i);
          return (
            <g key={r.name} opacity={open ? 1 : 0.35}>
              <circle cx={r.x} cy={r.y} r={22} className="fill-zinc-100 dark:fill-zinc-900 stroke-zinc-300 dark:stroke-zinc-700" strokeDasharray="1.5 1.5" strokeWidth={0.4} />
              <text x={r.x} y={r.y - 22} textAnchor="middle" className="fill-zinc-400" fontSize={3.2}>{r.name}</text>
            </g>
          );
        })}
        {TOY.map((p) => {
          const open = !ivf || probed.includes(p.room);
          const top = exact.includes(p);
          return (
            <circle
              key={p.label}
              cx={p.x}
              cy={p.y}
              r={top ? 2.4 : 1.6}
              className={ROOM_COLOR[p.room]}
              opacity={open ? 1 : 0.2}
              stroke={top ? "currentColor" : "none"}
              strokeWidth={0.5}
            />
          );
        })}
        <circle cx={q.x} cy={q.y} r={2.2} className="fill-rose-500" />
        <circle cx={q.x} cy={q.y} r={4} className="fill-none stroke-rose-500" strokeWidth={0.4} />
      </svg>

      <div className="mt-4 grid gap-2 text-[12px] sm:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">True nearest 3 (exact)</div>
          <div className="mt-1 text-zinc-800 dark:text-zinc-100">{exact.map((p) => p.label).join(", ")}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2.5">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">
            {ivf ? "Found by IVF (" + pool.length + " cards checked)" : "Found by full scan (" + TOY.length + " cards checked)"}
          </div>
          <div className="mt-1 text-zinc-800 dark:text-zinc-100">{approx.map((p) => p.label).join(", ")}</div>
          <div className="mt-1 tabular-nums text-zinc-500">recall {hits} of 3</div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-zinc-500">
        {ivf
          ? "The question sits near the edge of two rooms. Searching only one of them means the best match in the other room is never looked at. Click the edge between two rooms and try 2 rooms."
          : "A full scan finds the true neighbours every time. It just looks at everything to do it."}
      </p>
      <p className="mt-2 text-[11px] text-zinc-400">
        The rooms are fixed for this demo. Real IVF builds them with k-means clustering over millions of vectors, and each vector has hundreds of dimensions, not two.
      </p>
    </Frame>
  );
}

// ── 9. Context budget: what the model reads each turn, and what it costs ──

const SYSTEM_TOKENS = 900;
const PASSAGE_TOKENS = 300;
const TURN_TOKENS = 150;
const FACTS_TOKENS = 120;
const QUESTION_TOKENS = 30;
const SUMMARY_TOKENS = 400;
const WINDOW = 4;

type Strategy = "full" | "window" | "summary";

const STRATEGY_INFO: Record<Strategy, { label: string; forgets: string }> = {
  full: { label: "Full history", forgets: "Nothing. Every turn goes back in, so the bill and the wait grow with the conversation." },
  window: { label: "Last 4 turns", forgets: "Anything older than 4 turns. A purchase date mentioned at turn 1 is gone by turn 6." },
  summary: { label: "Summary + last 4", forgets: "The gist of older turns survives, but summaries tend to drop exact dates and order numbers." },
};

export function ContextBudget() {
  const [passages, setPassages] = useState(6);
  const [turns, setTurns] = useState(8);
  const [strategy, setStrategy] = useState<Strategy>("window");

  const history =
    strategy === "full"
      ? turns * TURN_TOKENS
      : strategy === "window"
        ? Math.min(turns, WINDOW) * TURN_TOKENS
        : Math.min(turns, WINDOW) * TURN_TOKENS + (turns > WINDOW ? SUMMARY_TOKENS : 0);

  const parts = [
    { label: "instructions", tokens: SYSTEM_TOKENS, color: "bg-zinc-400" },
    { label: "passages", tokens: passages * PASSAGE_TOKENS, color: "bg-blue-500" },
    { label: "customer facts", tokens: FACTS_TOKENS, color: "bg-emerald-500" },
    { label: "chat history", tokens: history, color: "bg-amber-500" },
    { label: "question", tokens: QUESTION_TOKENS, color: "bg-rose-500" },
  ];
  const total = parts.reduce((a, p) => a + p.tokens, 0);
  const prefillMs = Math.round(total * 0.15);

  return (
    <Frame title="The prompt is a budget. Every part is paid for on every turn.">
      <div className="grid gap-4 text-[12px] sm:grid-cols-2">
        <label className="block text-zinc-500 dark:text-zinc-400">
          Passages sent: <b className="text-zinc-900 dark:text-zinc-100 tabular-nums">{passages}</b>
          <input type="range" min={0} max={12} value={passages} onChange={(e) => setPassages(Number(e.target.value))} className="mt-2 w-full accent-blue-500" />
        </label>
        <label className="block text-zinc-500 dark:text-zinc-400">
          Turns so far in the chat: <b className="text-zinc-900 dark:text-zinc-100 tabular-nums">{turns}</b>
          <input type="range" min={0} max={20} value={turns} onChange={(e) => setTurns(Number(e.target.value))} className="mt-2 w-full accent-amber-500" />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {(Object.keys(STRATEGY_INFO) as Strategy[]).map((s) => (
          <Chip key={s} active={s === strategy} onClick={() => setStrategy(s)}>
            {STRATEGY_INFO[s].label}
          </Chip>
        ))}
      </div>
      <p className="mt-2 text-[12px] text-zinc-500">{STRATEGY_INFO[strategy].forgets}</p>

      <div className="mt-4 flex h-6 w-full overflow-hidden rounded-lg border border-zinc-200 dark:border-zinc-800">
        {parts.map((p) => (
          <div
            key={p.label}
            className={cn("h-full transition-all duration-300", p.color)}
            style={{ width: `${(p.tokens / total) * 100}%` }}
            title={`${p.label}: ${p.tokens} tokens`}
          />
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-zinc-500">
        {parts.map((p) => (
          <span key={p.label}>
            <span className={cn("mr-1 inline-block h-2 w-2 rounded-sm align-middle", p.color)} />
            {p.label} {p.tokens}
          </span>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Tokens read before the first word</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{total.toLocaleString("en-US")}</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Prefill time (illustrative)</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{prefillMs} ms</div>
        </div>
      </div>
      <p className="mt-3 text-[11px] text-zinc-400">
        The 0.15 ms per token is a stand-in. Real prefill speed depends on the model, the hardware and the provider.
      </p>
    </Frame>
  );
}

// ── 10. Stack the fixes: what each module buys, and what it adds up to ───

const FIXES = [
  { key: "queue", label: "Add workers and a connection pool", module: "Module 6", on: "queue" },
  { key: "index", label: "Tune the index to 97% recall", module: "Module 3", on: "index" },
  { key: "route", label: "Route to one shelf first", module: "Module 7", on: "route" },
  { key: "trim", label: "Trim the prompt to the best six passages", module: "Module 5", on: "trim" },
] as const;

type FixKey = (typeof FIXES)[number]["key"];

export function FixTheStack() {
  const [applied, setApplied] = useState<Record<FixKey, boolean>>({ queue: false, index: false, route: false, trim: false });

  const queue = applied.queue ? 200 : 2600;
  const embed = 25;
  const search = applied.route ? 120 : applied.index ? 450 : 1400;
  const rerank = 180;
  const first = applied.trim ? 180 : 350;
  const rest = 900;
  const ttft = queue + embed + search + rerank + first;
  const total = ttft + rest;
  const baseline = 2600 + 25 + 1400 + 180 + 350 + 900;

  const rows = [
    { label: "Waiting in line", ms: queue },
    { label: "Embed the query", ms: embed },
    { label: "Vector search", ms: search },
    { label: "Re-rank", ms: rerank },
    { label: "First word", ms: first },
    { label: "Rest of the answer", ms: rest },
  ];
  const colors = ["bg-zinc-400", "bg-sky-400", "bg-blue-500", "bg-violet-500", "bg-amber-500", "bg-amber-300"];

  return (
    <Frame title="Pip's stack of fixes. Switch them on one at a time, then all together.">
      <div className="flex flex-wrap gap-1.5">
        {FIXES.map((f) => (
          <Chip key={f.key} active={applied[f.key]} onClick={() => setApplied({ ...applied, [f.key]: !applied[f.key] })}>
            {f.label} · {f.module}
          </Chip>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <div key={r.label} className="grid grid-cols-[9.5rem_1fr_4.5rem] items-center gap-2 text-[12px]">
            <span className="truncate text-zinc-500 dark:text-zinc-400">{r.label}</span>
            <Bar pct={(r.ms / baseline) * 100} className={colors[i]} />
            <span className="text-right tabular-nums text-zinc-600 dark:text-zinc-300">{r.ms} ms</span>
          </div>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-center">
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">First word</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{(ttft / 1000).toFixed(2)} s</div>
        </div>
        <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-2">
          <div className="text-[10px] uppercase tracking-wide text-zinc-400">Full answer</div>
          <div className="text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">{(total / 1000).toFixed(2)} s</div>
        </div>
      </div>
      <p className="mt-3 text-[12px] text-zinc-500">
        Started at {((2600 + 25 + 1400 + 180 + 350) / 1000).toFixed(1)} s to the first word and {(baseline / 1000).toFixed(1)} s for the full answer. Each fix moves one bar, and none of them touches the model&apos;s writing speed.
      </p>
    </Frame>
  );
}
