import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/content";
import { Badge, statusVariant } from "@/components/ui/badge";

export const metadata: Metadata = {
  alternates: { canonical: "/ai-lab" },
  title: "Projects",
  description:
    "Things I have built and am building — shipped work, side experiments, and a few that are still half-finished. Real work over descriptions of it.",
};

export default function ProjectsPage() {
  const projects = getProjects();

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
          {projects.map((project) => (
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
                {project.liveUrl && (
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
