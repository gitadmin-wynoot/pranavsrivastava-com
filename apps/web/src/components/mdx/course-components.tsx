import { cn } from "@/lib/utils";
import { CodeBlock } from "./code-block";
import { Figure } from "./course-figures";
import { RelationMap } from "./relation-map";
import { RetrievalPlayground } from "./retrieval-playground";
import { ChunkSizer } from "./chunk-sizer";
import { ReActSimulator } from "./react-simulator";
import { FolderExplorer } from "./folder-explorer";
import { ApproachPicker } from "./approach-picker";
import { MeaningMap } from "./meaning-map";
import { SynonymSnap } from "./synonym-snap";
import { AnalogyMachine } from "./analogy-machine";
import { Embedding3D } from "./embedding-3d";
import { ApprovalScenarios } from "./approval-scenarios";
import { AutonomyMatrix } from "./autonomy-matrix";
import { CheckpointTimeline } from "./checkpoint-timeline";
import { MemoryTaxonomy } from "./memory-taxonomy";
import { MemoryToolCompare } from "./memory-tool-compare";
import { MemoryIndustryMap } from "./memory-industry-map";
import { EvolutionLadder } from "./evolution-ladder";
import { AttentionHeatmap } from "./attention-heatmap";
import { QKVExplainer } from "./qkv-explainer";
import { PositionalEncoding } from "./positional-encoding";
import { MultiHeadDemo } from "./multi-head-demo";
import {
  Info,
  Lightbulb,
  AlertTriangle,
  Star,
  BookOpen,
  CheckCircle2,
  Target,
  Clock,
  FileCode,
} from "lucide-react";

// ── Callout ────────────────────────────────────────────────────────────────

const calloutConfig = {
  info: {
    Icon: Info,
    wrap: "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800/50",
    iconCls: "text-blue-500",
    labelCls: "text-blue-700 dark:text-blue-300",
    defaultLabel: "Info",
  },
  tip: {
    Icon: Lightbulb,
    wrap: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800/50",
    iconCls: "text-emerald-500",
    labelCls: "text-emerald-700 dark:text-emerald-300",
    defaultLabel: "Tip",
  },
  warning: {
    Icon: AlertTriangle,
    wrap: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800/50",
    iconCls: "text-amber-500",
    labelCls: "text-amber-700 dark:text-amber-300",
    defaultLabel: "Warning",
  },
  important: {
    Icon: Star,
    wrap: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800/50",
    iconCls: "text-violet-500",
    labelCls: "text-violet-700 dark:text-violet-300",
    defaultLabel: "Important",
  },
  note: {
    Icon: BookOpen,
    wrap: "bg-zinc-50 dark:bg-zinc-900/60 border-zinc-200 dark:border-zinc-700",
    iconCls: "text-zinc-400",
    labelCls: "text-zinc-600 dark:text-zinc-300",
    defaultLabel: "Note",
  },
} as const;

type CalloutType = keyof typeof calloutConfig;

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
}

export function Callout({ type = "info", title, children }: CalloutProps) {
  const cfg = calloutConfig[type];
  const Icon = cfg.Icon;
  return (
    <aside className={cn("my-6 rounded-xl border px-5 py-4 not-prose", cfg.wrap)}>
      <div className="flex items-center gap-2 mb-2.5">
        <Icon className={cn("w-4 h-4 flex-shrink-0", cfg.iconCls)} />
        <span className={cn("text-[11px] font-bold uppercase tracking-widest", cfg.labelCls)}>
          {title ?? cfg.defaultLabel}
        </span>
      </div>
      <div className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-300 space-y-2 [&>p]:m-0 [&_code]:bg-black/8 dark:[&_code]:bg-white/8 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-[0.82em] [&_code]:font-mono">
        {children}
      </div>
    </aside>
  );
}

// ── LearningObjectives ─────────────────────────────────────────────────────

export function LearningObjectives({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 rounded-xl border border-blue-200 dark:border-blue-800/50 bg-blue-50 dark:bg-blue-950/20 px-5 py-4 not-prose">
      <div className="flex items-center gap-2 mb-3">
        <Target className="w-4 h-4 text-blue-500 flex-shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-blue-700 dark:text-blue-300">
          What you will learn
        </span>
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-300 [&_ul]:list-none [&_ul]:pl-0 [&_ul]:space-y-2 [&_li]:flex [&_li]:items-start [&_li]:gap-2 [&_li]:leading-snug [&_li:before]:content-['✓'] [&_li:before]:text-blue-500 [&_li:before]:font-bold [&_li:before]:flex-shrink-0 [&_li:before]:mt-px">
        {children}
      </div>
    </div>
  );
}

// ── Diagram ────────────────────────────────────────────────────────────────

interface DiagramProps {
  title: string;
  caption?: string;
  children: React.ReactNode;
}

export function Diagram({ title, caption, children }: DiagramProps) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-xl border-2 border-dashed border-zinc-200 dark:border-zinc-700 overflow-hidden bg-white dark:bg-zinc-950">
        {/* Window chrome bar */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-300 dark:bg-rose-600" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-300 dark:bg-amber-600" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-300 dark:bg-emerald-600" />
          <span className="ml-2 text-[11px] text-zinc-400 font-medium tracking-wide">
            {title}
          </span>
        </div>
        {/*
          Children come from a fenced code block in MDX, which compiles to
          <pre><code>...</code></pre>. We override the .prose pre styles
          so the diagram renders with the right colours and no dark background.
        */}
        <div className="overflow-x-auto [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-5 [&_pre]:!rounded-none [&_pre]:!border-0 [&_pre]:!shadow-none [&_pre]:!text-xs [&_pre]:!leading-relaxed [&_code]:!bg-transparent [&_code]:!p-0 [&_code]:!text-zinc-600 dark:[&_code]:!text-zinc-400 [&_code]:!font-mono [&_code]:!text-xs [&_code]:!leading-relaxed">
          {children}
        </div>
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-zinc-400 dark:text-zinc-500 italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

// ── ChapterHeader ──────────────────────────────────────────────────────────

interface ChapterHeaderProps {
  // Accept number | string: next-mdx-remote's compileMDX silently evaluates
  // brace JSX-expression props (number={3}) to undefined in this pipeline —
  // only plain string attributes (number="3") survive compilation intact.
  // Coercing here means content can use either form and still render.
  number: number | string;
  title: string;
  time?: number | string;
}

// Stable, readable anchor for each chapter — "3. Designing the schema" → "ch-3-designing-the-schema".
// The chapter nav (chapter-nav.tsx) reads these ids straight off the DOM, so
// any course using ChapterHeader gets a working index for free.
function chapterSlug(number: number | undefined, title: string): string {
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
  // Falls back to "x" (not a digit) if the chapter number couldn't be
  // resolved — the nav's ch-(\d+)- pattern simply won't number that entry,
  // rather than baking a broken id like "ch-NaN-..." into the page.
  return `ch-${number ?? "x"}-${slug}`;
}

export function ChapterHeader({ number, title, time }: ChapterHeaderProps) {
  // Guard against NaN, not just undefined: a malformed/unconvertible prop
  // should render as if it weren't there, never as the literal text "NaN".
  const nRaw = Number(number);
  const n = Number.isFinite(nRaw) ? nRaw : undefined;
  const tRaw = time !== undefined ? Number(time) : undefined;
  const t = tRaw !== undefined && Number.isFinite(tRaw) ? tRaw : undefined;
  return (
    <div id={chapterSlug(n, title)} className="mt-14 mb-6 not-prose scroll-mt-24">
      <div className="flex items-center gap-3 mb-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-bold flex-shrink-0 shadow-sm">
          {n}
        </span>
        {!!t && (
          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            {t} min
          </span>
        )}
      </div>
      <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
        {title}
      </h2>
      <div className="mt-4 h-px bg-gradient-to-r from-zinc-200 via-zinc-100 to-transparent dark:from-zinc-700 dark:via-zinc-800 dark:to-transparent" />
    </div>
  );
}

// ── ChapterSummary ─────────────────────────────────────────────────────────

export function ChapterSummary({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/20 px-5 py-4 not-prose">
      <div className="flex items-center gap-2 mb-3">
        <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-300">
          Chapter summary
        </span>
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-300 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:space-y-1.5 [&_li]:leading-snug">
        {children}
      </div>
    </div>
  );
}

// ── Checkpoint ─────────────────────────────────────────────────────────────

export function Checkpoint({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-8 rounded-xl border border-violet-200 dark:border-violet-800/50 bg-violet-50 dark:bg-violet-950/20 px-5 py-4 not-prose">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 className="w-4 h-4 text-violet-500 flex-shrink-0" />
        <span className="text-[11px] font-bold uppercase tracking-widest text-violet-700 dark:text-violet-300">
          Check your understanding
        </span>
      </div>
      <div className="text-sm text-zinc-700 dark:text-zinc-300 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:space-y-2 [&_li]:leading-snug">
        {children}
      </div>
    </div>
  );
}

// ── KeyTerm ────────────────────────────────────────────────────────────────

export function KeyTerm({
  children,
  definition,
}: {
  children: React.ReactNode;
  definition?: string;
}) {
  return (
    <span
      className="font-semibold text-blue-700 dark:text-blue-400 cursor-help border-b border-dotted border-blue-400 dark:border-blue-600"
      title={definition}
    >
      {children}
    </span>
  );
}

// ── CodeFile ───────────────────────────────────────────────────────────────

export function CodeFile({
  filename,
  children,
}: {
  filename: string;
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 not-prose rounded-xl overflow-hidden border border-zinc-200 dark:border-zinc-700 shadow-sm">
      <div className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 dark:bg-zinc-900 border-b border-zinc-700">
        <FileCode className="w-3.5 h-3.5 text-zinc-400 flex-shrink-0" />
        <span className="text-xs font-mono text-zinc-300">{filename}</span>
      </div>
      {/* Strip the inner CodeBlock's own frame so it sits flush under the filename bar */}
      <div className="[&>.code-block]:!my-0 [&>.code-block]:!rounded-none [&>.code-block]:!border-0">
        {children}
      </div>
    </div>
  );
}

// ── Steps / Step ───────────────────────────────────────────────────────────

export function Steps({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-6 not-prose space-y-0">
      {children}
    </div>
  );
}

export function Step({
  number,
  title,
  children,
}: {
  // number | string — see the note on ChapterHeaderProps above.
  number: number | string;
  title: string;
  children: React.ReactNode;
}) {
  const nRaw = Number(number);
  const n = Number.isFinite(nRaw) ? nRaw : undefined;
  return (
    <div className="relative flex gap-4 pb-6 last:pb-0 group">
      <div className="flex flex-col items-center">
        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-bold flex-shrink-0 z-10">
          {n}
        </span>
        <div className="w-px flex-1 bg-zinc-200 dark:bg-zinc-700 mt-2 group-last:hidden" />
      </div>
      <div className="pt-0.5 flex-1">
        <h4 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm mb-2 leading-snug">
          {title}
        </h4>
        <div className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed space-y-2">
          {children}
        </div>
      </div>
    </div>
  );
}

// ── Export all ─────────────────────────────────────────────────────────────

export const courseComponents = {
  Callout,
  LearningObjectives,
  Diagram,
  ChapterHeader,
  ChapterSummary,
  Checkpoint,
  KeyTerm,
  CodeFile,
  Steps,
  Step,
  Figure,
  RelationMap,
  RetrievalPlayground,
  ChunkSizer,
  ReActSimulator,
  FolderExplorer,
  ApproachPicker,
  MeaningMap,
  SynonymSnap,
  AnalogyMachine,
  Embedding3D,
  ApprovalScenarios,
  AutonomyMatrix,
  CheckpointTimeline,
  MemoryTaxonomy,
  MemoryToolCompare,
  MemoryIndustryMap,
  EvolutionLadder,
  AttentionHeatmap,
  QKVExplainer,
  PositionalEncoding,
  MultiHeadDemo,
  pre: CodeBlock,
};
