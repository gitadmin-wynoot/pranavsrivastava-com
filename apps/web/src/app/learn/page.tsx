import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTracks, getCourses, isCourseAvailable } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { FeaturedCourses } from "@/components/course/featured-courses";
import { CurriculumMap } from "@/components/learn/curriculum-map";

export const metadata: Metadata = {
  title: "Learn",
  description:
    "A structured learning platform covering AI fundamentals, data engineering, applied AI, cloud architecture, and building your own AI OS. From academic foundations to production systems.",
};

const trackColors: Record<string, { bg: string; border: string; text: string; dot: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-950/30",   border: "border-blue-200 dark:border-blue-800",   text: "text-blue-700 dark:text-blue-300",   dot: "bg-blue-500" },
  emerald:{ bg: "bg-emerald-50 dark:bg-emerald-950/30", border: "border-emerald-200 dark:border-emerald-800", text: "text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  violet: { bg: "bg-violet-50 dark:bg-violet-950/30", border: "border-violet-200 dark:border-violet-800", text: "text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  sky:    { bg: "bg-sky-50 dark:bg-sky-950/30",      border: "border-sky-200 dark:border-sky-800",      text: "text-sky-700 dark:text-sky-300",      dot: "bg-sky-500" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-950/30",  border: "border-amber-200 dark:border-amber-800",  text: "text-amber-700 dark:text-amber-300",  dot: "bg-amber-500" },
  zinc:   { bg: "bg-zinc-50 dark:bg-zinc-900",       border: "border-zinc-200 dark:border-zinc-800",    text: "text-zinc-700 dark:text-zinc-300",    dot: "bg-zinc-500" },
};

export default function LearnPage() {
  const tracks = getTracks();
  const courses = getCourses();
  const availableCourses = courses.filter(isCourseAvailable);

  // Count only *available* (published) courses so a track's badge never
  // over-promises — a track with only drafts reads as "Coming soon".
  const availableByTrack = tracks.reduce<Record<string, number>>((acc, t) => {
    acc[t.slug] = availableCourses.filter((c) => c.track === t.slug).length;
    return acc;
  }, {});

  // Learning path: 3 stages showing how the tracks stack. Also feeds the map.
  const learningPath = [
    {
      label: "Start here",
      desc: "No prior AI knowledge required",
      tracks: ["ai-foundations", "cloud-apis"],
    },
    {
      label: "Build deeper",
      desc: "Apply foundations to real data and systems",
      tracks: ["data-engineering", "applied-ai"],
    },
    {
      label: "Capstone",
      desc: "Integrate everything into a running system",
      tracks: ["personal-ai-os"],
    },
  ];

  const mapTracks = tracks.map((t) => ({
    slug: t.slug,
    title: t.title,
    icon: t.icon,
    color: t.color,
    availableCount: availableByTrack[t.slug] ?? 0,
    comingSoon: (availableByTrack[t.slug] ?? 0) === 0,
    prereqs: t.prereqs,
    leadsTo: t.leadsTo,
  }));
  const mapStages = learningPath.map((l) => ({
    label: l.label,
    desc: l.desc,
    slugs: l.tracks,
  }));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="max-w-2xl mb-16">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Learning Platform
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          From AI foundations to production systems.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
          Five structured tracks — each a focused sub-topic with its own courses,
          prerequisites, and clear outcomes. Grounded in academic rigour, built
          for practical application.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-3">
          Want one runnable thing in under an hour instead? Try a hands-on{" "}
          <Link href="/labs" className="text-blue-600 dark:text-blue-400 hover:underline">
            lab
          </Link>
          .
        </p>
      </div>

      {/* ── Available now ───────────────────────────────────────────────── */}
      {availableCourses.length > 0 && (
        <div className="mb-20">
          <div className="flex items-baseline justify-between mb-5">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Available now
            </h2>
            <Link
              href="/courses"
              className="text-xs text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
            >
              All courses &amp; roadmap →
            </Link>
          </div>
          <FeaturedCourses
            courses={availableCourses.map((c) => ({
              slug: c.slug,
              title: c.title,
              summary: c.summary,
              track: c.track,
              lessonCount: c.lessonCount,
            }))}
          />
        </div>
      )}

      {/* ── Track cards ─────────────────────────────────────────────────── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
        {tracks.map((track) => {
          const c = trackColors[track.color] ?? trackColors.zinc;
          const count = availableByTrack[track.slug] ?? 0;
          return (
            <Link
              key={track.slug}
              href={`/learn/${track.slug}`}
              className={`group flex flex-col p-5 border rounded-xl transition-all hover:shadow-sm ${c.bg} ${c.border}`}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <span className="text-2xl leading-none">{track.icon}</span>
                <span className={`text-xs font-medium ${count > 0 ? c.text : "text-zinc-400 dark:text-zinc-500"}`}>
                  {count > 0 ? `${count} ${count === 1 ? "course" : "courses"}` : "Coming soon"}
                </span>
              </div>
              <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base mb-2 group-hover:text-zinc-700 dark:group-hover:text-zinc-200 transition-colors">
                {track.title}
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-4">
                {track.tagline}
              </p>
              {track.prereqs.length > 0 && (
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mb-3">
                  Needs: {track.prereqs.join(", ")}
                </p>
              )}
              <div className={`flex items-center gap-1 text-xs font-medium ${c.text}`}>
                Explore track <ArrowRight className="w-3 h-3" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* ── The map — how it all connects ────────────────────────────────── */}
      <div className="mb-20">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          How it all connects
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-8 max-w-2xl">
          Not a pile of topics — a path. Foundations feed the applied work, and
          it all comes together in the capstone. You can enter at any stage;
          hover a track to see what it needs and what it unlocks.
        </p>
        <CurriculumMap tracks={mapTracks} stages={mapStages} />
      </div>

      {/* ── Topics at a glance ───────────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
          Topics covered
        </h2>
        <div className="flex flex-wrap gap-2">
          {[
            "Mathematics for AI", "Machine Learning", "Deep Learning",
            "Natural Language Processing", "Computer Vision", "Knowledge Graphs",
            "Metaheuristic Optimisation", "Data Pipelines", "Apache Spark",
            "Databricks", "Feature Engineering", "Vector Databases",
            "LLMs in Practice", "Semantic Search", "AI Agents",
            "MCP", "AI Observability", "MLOps",
            "REST API Design", "GraphQL", "AWS Architecture",
            "DevOps / CI-CD", "Personal AI OS",
          ].map((topic) => (
            <Badge key={topic} variant="outline">
              {topic}
            </Badge>
          ))}
        </div>
      </div>

      {/* ── Context note ─────────────────────────────────────────────────── */}
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
          How this platform was built
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          These courses are written from real experience — not assembled from
          documentation. The AI Foundations track draws from academic research
          including an MSc in AI at Munster Technological University. The Applied
          AI and Personal AI OS tracks document systems built and running in
          practice. Nothing is invented; everything is tested.
        </p>
        <Link
          href="/about"
          className="inline-flex items-center gap-1 mt-4 text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          About the author <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
