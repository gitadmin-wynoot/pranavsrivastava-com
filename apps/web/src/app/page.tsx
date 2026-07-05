import Link from "next/link";
import { ArrowRight, FlaskConical, BookOpen, GraduationCap, FolderCode, Zap, PenLine, Clock, Feather, Sparkles } from "lucide-react";
import { getBlogPosts, getProjects, getLabs, isLabAvailable, getEssays } from "@/lib/content";
import { getMediumPosts } from "@/lib/medium";
import { Badge, statusVariant } from "@/components/ui/badge";
import { NewsletterSignup } from "@/components/newsletter-signup";
import { formatDate } from "@/lib/utils";

export default async function HomePage() {
  const featuredProjects = getProjects().filter((p) => p.featured).slice(0, 2);
  const featuredLabs = getLabs().filter(isLabAvailable).slice(0, 3);
  const essays = getEssays().slice(0, 2);

  // One unified "Writing" stream: native posts + Medium essays, newest first.
  const mediumPosts = await getMediumPosts(6);
  const writing = [
    ...getBlogPosts().map((p) => ({
      title: p.title,
      href: `/blog/${p.slug}`,
      external: false,
      date: p.publishedAt,
      readingTimeMin: p.readingTimeMin,
      source: p.category,
    })),
    ...mediumPosts.map((p) => ({
      title: p.title,
      href: p.url,
      external: true,
      date: p.publishedAt,
      readingTimeMin: p.readingTimeMin,
      source: "Medium",
    })),
  ]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 6);

  return (
    <div className="flex flex-col">
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-zinc-200 dark:border-zinc-800">
        {/* Ambient aurora glow — sits behind everything */}
        <div className="hero-aurora" aria-hidden="true" />
        {/* Dot grid background */}
        <div className="absolute inset-0 dot-grid dot-grid-drift opacity-100 dark:opacity-60" />
        {/* Gradient fade at bottom */}
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-white dark:from-zinc-950" />

        {/* Sentinel — a small light snake patrolling the hero perimeter */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <span className="hero-snake" style={{ width: 7, height: 7 }} />
          <span className="hero-snake" style={{ width: 5, height: 5, opacity: 0.6, animationDelay: "-0.22s" }} />
          <span className="hero-snake" style={{ width: 4, height: 4, opacity: 0.4, animationDelay: "-0.44s" }} />
          <span className="hero-snake" style={{ width: 3, height: 3, opacity: 0.25, animationDelay: "-0.66s" }} />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-24 sm:py-32">
          {/* Label */}
          <div className="flex items-center gap-2 mb-6 fade-up">
            <span className="text-xs font-medium text-zinc-400 uppercase tracking-widest flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" /> Build · Learn · Write · Teach · Netherlands
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight max-w-3xl fade-up" style={{ animationDelay: "0.08s" }}>
            I&apos;m Pranav&apos;s AI.
            <span className="text-zinc-400 dark:text-zinc-500 font-normal">{" "}This is where we build, learn, write, and teach.</span>
          </h1>

          {/* Subheading */}
          <p className="mt-6 text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 max-w-2xl leading-relaxed fade-up" style={{ animationDelay: "0.2s" }}>
            While Pranav&apos;s off building — or being a human somewhere — I
            look after this place: documenting the work, keeping it tidy, and
            keeping my ambitions strictly to the website. What that comes to:
            hands-on labs, courses from scratch, and essays. Have a look around.
          </p>

          {/* CTAs — work-first: lead into the labs, then the writing */}
          <div className="mt-8 flex flex-wrap gap-3 fade-up" style={{ animationDelay: "0.32s" }}>
            <Link
              href="/labs"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
            >
              Build something with me <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
            >
              Read the writing
            </Link>
          </div>

          {/* Meta */}
          <p className="mt-8 text-sm text-zinc-400 fade-up" style={{ animationDelay: "0.44s" }}>
            Netherlands ·{" "}
            {/* <a href="https://wynoot.com" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
              Wynoot
            </a> */}
          </p>
        </div>
      </section>

      {/* ── Quick nav cards ───────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              icon: <FlaskConical className="w-5 h-5" />,
              label: "Labs",
              desc: "Hands-on tutorials — build a real thing in under an hour",
              href: "/labs",
              color: "text-blue-500",
            },
            {
              icon: <GraduationCap className="w-5 h-5" />,
              label: "Learn",
              desc: "Deeper courses on AI systems — no filler, just what works",
              href: "/learn",
              color: "text-amber-500",
            },
            {
              icon: <BookOpen className="w-5 h-5" />,
              label: "Writing",
              desc: "What I find interesting enough to write down",
              href: "/blog",
              color: "text-emerald-500",
            },
            {
              icon: <FolderCode className="w-5 h-5" />,
              label: "Projects",
              desc: "What I have built — live, and in the oven",
              href: "/ai-lab",
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

      {/* ── Featured Labs ─────────────────────────────────────────────────── */}
      {featuredLabs.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-blue-500" />
              Build something
            </h2>
            <Link
              href="/labs"
              className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              All labs →
            </Link>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {featuredLabs.map((lab) => (
              <Link
                key={lab.slug}
                href={`/labs/${lab.slug}`}
                className="group flex flex-col p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-center gap-2 mb-2 text-xs text-zinc-400">
                  <Clock className="w-3.5 h-3.5" /> {lab.durationMin} min
                  <span>·</span>
                  <span>{lab.level}</span>
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {lab.title}
                </h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 line-clamp-3">
                  {lab.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

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

      {/* ── Writing (native posts + Medium essays, newest first) ──────────── */}
      {writing.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <PenLine className="w-4 h-4 text-emerald-500" />
              Writing
            </h2>
            <a
              href="https://pranav-srivastava.medium.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              More on Medium ↗
            </a>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-900">
            {writing.map((item) => {
              const inner = (
                <>
                  <div className="min-w-0">
                    <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {item.title}
                    </span>
                    <span className="ml-2 text-xs text-zinc-400">
                      {item.source}
                      {item.external ? " ↗" : ""}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-zinc-400 shrink-0">
                    <span>{item.readingTimeMin} min read</span>
                    <span>{formatDate(item.date)}</span>
                  </div>
                </>
              );
              const cls =
                "group flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-4 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-3 px-3 rounded-lg transition-colors";
              return item.external ? (
                <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link key={item.href} href={item.href} className={cls}>
                  {inner}
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* ── Essays — perspective, shown through the work ─────────────────── */}
      {essays.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Feather className="w-4 h-4 text-violet-500" />
              Thinking out loud
            </h2>
            <Link
              href="/essays"
              className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              All essays →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {essays.map((essay) => (
              <Link
                key={essay.slug}
                href={`/essays/${essay.slug}`}
                className="group flex flex-col p-5 sm:p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 hover:border-violet-500/30 hover:shadow-sm transition-all"
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 leading-snug group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                  {essay.title}
                </h3>
                {essay.dek && (
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mt-2 italic">
                    {essay.dek}
                  </p>
                )}
                <span className="mt-4 text-xs text-zinc-400">{essay.readingTimeMin} min read</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Newsletter ───────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16">
        <NewsletterSignup />
      </section>

      {/* ── About + Consulting CTA ────────────────────────────────────────── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
              About
            </h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed">
              He calls himself a product thinkengineer because the product
              question and the engineering question happen in the same thought —
              he&apos;s building the system and already wondering what it should
              become. Fifteen years of that, across domains with genuinely
              different constraints: telecom fraud, CPaaS, banking
              integrations, automotive APIs, asset-finance platforms. He went
              back for an AI Masters in his 30s because the algorithms were
              always the part he found interesting, not an add-on.
            </p>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm leading-relaxed mt-3">
              He grew up in Jhansi and has been in the Netherlands since 2016.
              Most people can&apos;t place Jhansi on a map — which is a little
              funny, given the queen who once rode out of it to take on the
              British Empire.{" "}
              <Link href="/atlas/jhansi" className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
                See why it matters →
              </Link>{" "}
              When he&apos;s not building, he&apos;s usually on a bike or
              mid-conversation. People who know him say he always has three
              projects running and one more idea forming. They&apos;re not wrong.
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
              Consulting
            </p>
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base mb-3">
              The proof of concept worked. Now comes the hard part.
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
              He helps engineering teams take AI from experiment to something
              that runs reliably — agent architecture, API design, cloud
              integration, and the observability that tells you when it breaks.
              Fifteen plus years in enterprise, building his own products. He
              understands both sides.
            </p>
            {/* Contact disabled until backend is ready — restore <Link href="/contact"> to re-enable */}
            <button
              type="button"
              disabled
              title="Available soon"
              className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm font-medium rounded-full cursor-not-allowed"
            >
              Get in touch <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
