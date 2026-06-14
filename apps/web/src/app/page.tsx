import Link from "next/link";
import { ArrowRight, FlaskConical, BookOpen, GraduationCap, FolderCode, Zap } from "lucide-react";
import { getBlogPosts, getProjects } from "@/lib/content";
import { Badge, statusVariant } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export default function HomePage() {
  const posts = getBlogPosts().slice(0, 3);
  const featuredProjects = getProjects().filter((p) => p.featured).slice(0, 2);

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid opacity-100 dark:opacity-60" />
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          {/* Label */}
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest">
              AI · Cloud · APIs · Second Brain
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight max-w-3xl">
            I build practical AI, cloud and API systems — and document the
            journey.
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed">
            This is my public workshop: a portfolio, AI lab, second brain and
            learning space where I explore agentic systems, automation, APIs,
            cloud architecture, and small live experiments.
          </p>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/ai-lab"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              Explore AI Lab <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Read the Blog
            </Link>
          </div>

          {/* Meta */}
          <p className="mt-8 text-sm text-zinc-400">
            Netherlands-based · 14+ years in software ·{" "}
            <a href="https://qubitsy.com" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Founder of Qubitsy
            </a>{" "}
            &amp;{" "}
            <a href="https://wynoot.com" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Wynoot
            </a>
          </p>
        </div>
      </section>

      {/* ── Quick nav cards ───────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <FlaskConical className="w-5 h-5" />,
              label: "AI Lab",
              desc: "Experiments & live demos",
              href: "/ai-lab",
              color: "text-blue-500",
            },
            {
              icon: <BookOpen className="w-5 h-5" />,
              label: "Blog",
              desc: "Notes on AI, cloud & APIs",
              href: "/blog",
              color: "text-emerald-500",
            },
            {
              icon: <GraduationCap className="w-5 h-5" />,
              label: "Learn",
              desc: "Tracks, fundamentals & applied AI",
              href: "/learn",
              color: "text-amber-500",
            },
            {
              icon: <FolderCode className="w-5 h-5" />,
              label: "Projects",
              desc: "Things I've built",
              href: "/ai-lab#projects",
              color: "text-purple-500",
            },
          ].map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="group flex flex-col gap-3 p-4 sm:p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 dark:hover:border-blue-500/30 hover:shadow-sm transition-all"
            >
              <span className={card.color}>{card.icon}</span>
              <div>
                <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {card.label}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Projects ─────────────────────────────────────────────── */}
      {featuredProjects.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-500" />
              Currently Building
            </h2>
            <Link
              href="/ai-lab"
              className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              All projects →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {featuredProjects.map((project) => (
              <Link
                key={project.slug}
                href={`/ai-lab#${project.slug}`}
                className="group p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {project.title}
                  </h3>
                  <Badge variant={statusVariant[project.status]}>
                    {project.status}
                  </Badge>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  {project.summary}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {project.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-zinc-400 dark:text-zinc-500"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Latest writing ────────────────────────────────────────────────── */}
      {posts.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
              Latest writing
            </h2>
            <Link
              href="/blog"
              className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              All posts →
            </Link>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-3 px-3 rounded-lg transition-colors"
              >
                <div>
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {post.title}
                  </span>
                  <span className="ml-2 text-xs text-zinc-400">
                    {post.category}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
                  <span>{post.readingTimeMin} min read</span>
                  <span>{formatDate(post.publishedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── About + Consulting CTA ────────────────────────────────────────── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              About
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              I am a Netherlands-based software engineer and architect with 14+
              years of experience across APIs, cloud platforms, integrations and
              AI systems. I use this space to build in public, test ideas, write
              notes, and turn emerging concepts into practical systems.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              More about me <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
              Consulting via Qubitsy
            </p>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base mb-3">
              Need help with AI, cloud or API architecture?
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
              Through Qubitsy, I help teams design AI workflows, cloud
              architectures, API platforms, and automation systems. Practical
              focus, measurable outcomes.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              Get in touch <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
