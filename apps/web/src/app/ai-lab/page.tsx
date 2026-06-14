import type { Metadata } from "next";
import Link from "next/link";
import { FlaskConical, Radar, Lightbulb, ArrowRight } from "lucide-react";
import { getProjects } from "@/lib/content";
import { Badge, statusVariant } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "AI Lab",
  description:
    "Experiments, live demos, and research notes. A place to explore AI, agents, MCP, cloud architecture, and automation.",
};

export default function AILabPage() {
  const projects = getProjects();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl mb-16">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          AI Lab
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          The workshop where ideas become experiments.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
          Some experiments are tiny. Some become tutorials. Some may become
          products. The goal is simple: keep learning, keep building, keep the
          work visible.
        </p>
      </div>

      {/* What I explore */}
      <div className="grid sm:grid-cols-3 gap-4 mb-16">
        {[
          {
            icon: <Radar className="w-5 h-5 text-blue-500" />,
            title: "AI Radar",
            desc: "Tracking AI model releases, MCP updates, agent frameworks, and open-source tooling. Turning updates into structured ideas.",
          },
          {
            icon: <FlaskConical className="w-5 h-5 text-emerald-500" />,
            title: "Live experiments",
            desc: "Small, working demos. Each one explores a specific idea — a new API, an agent pattern, a cloud architecture decision.",
          },
          {
            icon: <Lightbulb className="w-5 h-5 text-amber-500" />,
            title: "Idea backlog",
            desc: "A running list of what I want to build next. Sourced from research, curiosity, and the things that keep coming up in practice.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
          >
            <div className="mb-3">{item.icon}</div>
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm mb-2">
              {item.title}
            </h3>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Projects */}
      <div id="projects">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Projects
          </h2>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-16 text-zinc-400">
            <FlaskConical className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">First experiments coming soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {projects.map((project) => (
              <div
                key={project.slug}
                id={project.slug}
                className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                    {project.title}
                  </h3>
                  <Badge variant={statusVariant[project.status]}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4">
                  {project.summary}
                </p>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-zinc-400 dark:text-zinc-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3">
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Live demo ↗
                    </a>
                  )}
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
                    >
                      GitHub ↗
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Radar CTA */}
      <div className="mt-16 p-6 sm:p-8 bg-zinc-900 dark:bg-zinc-800 rounded-2xl text-white">
        <div className="flex items-center gap-2 mb-3">
          <Radar className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            Coming soon
          </span>
        </div>
        <h3 className="text-xl font-semibold mb-2">AI Radar</h3>
        <p className="text-zinc-400 text-sm leading-relaxed max-w-xl mb-5">
          A personal AI watcher that collects AI trends, converts them into
          structured insights, and proposes small buildable projects for this
          lab. Powered by research agents, MCP servers, and LangGraph workflows.
        </p>
        <Link
          href="/blog/why-personal-ai-os"
          className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors"
        >
          Read about the concept <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
