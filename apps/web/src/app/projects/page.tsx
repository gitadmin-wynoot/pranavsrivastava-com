import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, ArrowRight, Gamepad2, Radio } from "lucide-react";
import { getProjects } from "@/lib/content";
import { Badge, statusVariant } from "@/components/ui/badge";
import { makeBoard } from "@/components/projects/signal/search-engine";

export const metadata: Metadata = {
  alternates: { canonical: "/projects" },
  title: "Projects",
  description:
    "Things I have built and am building — shipped work, side experiments, and a few that are still half-finished. Real work over descriptions of it.",
};

export default function ProjectsPage() {
  const projects = getProjects();
  const signalBoard = makeBoard(0);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl mb-14">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Projects
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Things I have built.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
          A mix of shipped products, side experiments, and a few things still
          half-finished. I would rather show the work than describe it — so this
          is honest about what is live and what is not.
        </p>
      </div>

      {/* Projects */}
      {projects.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <FlaskConical className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Putting the first few here shortly.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {projects.map((project) => project.slug === "signal" ? (
            <Link key={project.slug} id="signal" href="/projects/signal" className="group sm:col-span-2 grid md:grid-cols-[1.2fr_1fr] gap-8 items-center overflow-hidden p-7 sm:p-9 rounded-2xl bg-[#152b27] border border-[#3a5141] text-[#e7efdf] scroll-mt-20 hover:border-[#a7c773] transition-colors">
              <div>
                <p className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-[#d7f58f] mb-5"><Gamepad2 className="w-4 h-4" /> Playable experiment · Human + AI</p>
                <h2 className="text-4xl font-medium tracking-tight mb-3">Follow the Signal.</h2>
                <p className="text-sm leading-relaxed text-[#b0c4b6] max-w-md">Plan a rescue, interrogate a noisy signal, and challenge the AI’s confidence. A game about search, evidence, and knowing when to act.</p>
                <span className="inline-flex items-center gap-2 mt-6 px-4 py-2.5 rounded-md bg-[#d7f58f] text-[#203423] text-xs font-semibold group-hover:bg-[#e6ffa9]">Play Signal <ArrowRight className="w-4 h-4" /></span>
                <p className="text-[10px] text-[#b0c4b6] mt-4">2 chapters · 6 scenarios · Search + Bayesian reasoning</p>
              </div>
              <div className="hidden md:block relative max-w-[280px] w-full mx-auto rotate-[-4deg] group-hover:rotate-0 transition-transform" aria-hidden="true">
                <div className="grid grid-cols-11 gap-1 p-4 rounded-lg border border-[#52694c] bg-[#1d352c] shadow-2xl">
                  {signalBoard.cells.map((cell, id) => <span key={id} className={`aspect-square rounded-[2px] flex items-center justify-center text-[8px] ${id === signalBoard.start || id === signalBoard.goal ? "bg-[#d7f58f] text-[#203423]" : cell === "wall" ? "bg-[#667858]" : "bg-[#2b4638]"}`}>{id === signalBoard.start ? "S" : id === signalBoard.goal ? <Radio className="w-3 h-3" /> : ""}</span>)}
                </div>
              </div>
            </Link>
          ) : (
            <div
              key={project.slug}
              id={project.slug}
              className="flex flex-col p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl scroll-mt-20"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base leading-snug">
                  {project.title}
                </h2>
                <Badge variant={statusVariant[project.status]}>
                  {project.status}
                </Badge>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 flex-1">
                {project.summary}
              </p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {project.tags.map((tag) => (
                  <span key={tag} className="text-xs text-zinc-400 dark:text-zinc-500">
                    #{tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-3 mt-auto">
                {project.liveUrl?.startsWith("/") ? (
                  <Link href={project.liveUrl} className="text-xs text-blue-600 dark:text-blue-400 hover:underline">Open project →</Link>
                ) : project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Live ↗
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                  >
                    Code ↗
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Nudge to Labs — the build-alongside surface */}
      <div className="mt-14 p-6 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Want to build something like this yourself? The Labs walk you through it, step by step.
        </p>
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline shrink-0"
        >
          Go to the Labs <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
