import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Cpu } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI, Cloud & API Architect. 14+ years building software. Netherlands-based. Founder of Qubitsy and Wynoot.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          About
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Pranav Srivastava
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Netherlands
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> 14+ years in software
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> AI · Cloud · APIs
          </span>
        </div>
      </div>

      {/* Note */}
      <div className="mb-10 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm text-amber-700 dark:text-amber-400">
        This page is being written. The overview below is a working draft —
        full details coming soon.
      </div>

      {/* Main intro */}
      <div className="prose max-w-none mb-12">
        <p>
          I am a software engineer and architect who has spent 14+ years working
          across APIs, cloud platforms, telecommunications, SaaS products, and
          AI systems. I am originally from India and currently based in the
          Netherlands.
        </p>
        <p>
          I care about systems that are practical, observable, and built to
          last. I am curious about how AI is changing the way we design and
          operate software — and I spend a lot of time exploring that at the
          intersection of engineering and product thinking.
        </p>
        <p>
          This site is my public workshop. I build experiments here, write notes
          about what I am learning, and share the thinking behind systems I
          design. Nothing is finished — everything evolves.
        </p>
      </div>

      {/* What I work on */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          What I work on
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              label: "AI systems & agents",
              desc: "Agentic workflows, MCP servers, LLM orchestration, observability",
            },
            {
              label: "Cloud architecture",
              desc: "AWS serverless, ECS, Lambda, API Gateway, IaC",
            },
            {
              label: "API platforms",
              desc: "REST, GraphQL, event-driven, integration design",
            },
            {
              label: "Automation",
              desc: "Internal tooling, CI/CD, data pipelines, developer experience",
            },
            {
              label: "SaaS products",
              desc: "End-to-end product engineering: frontend, backend, infra",
            },
            {
              label: "Learning in public",
              desc: "Courses, tutorials, build logs, and second brain notes",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                {item.label}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Companies */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Companies & products
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                Qubitsy
              </p>
              <a
                href="https://qubitsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                qubitsy.com ↗
              </a>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              My consulting and R&D studio. I help teams design AI workflows,
              cloud architectures, API platforms, and automation systems.
              Practical focus, measurable outcomes.
            </p>
          </div>
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                Wynoot
              </p>
              <a
                href="https://wynoot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                wynoot.com ↗
              </a>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              A SaaS product for small businesses, solopreneurs, creators, and
              service providers. Website, booking, and automation in one place.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="flex gap-3">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          Get in touch <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/ai-lab"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          Explore AI Lab
        </Link>
      </div>
    </div>
  );
}
