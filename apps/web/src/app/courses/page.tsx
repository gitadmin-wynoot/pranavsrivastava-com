import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { getCourses, isCourseAvailable, type Course } from "@/lib/content";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  alternates: { canonical: "/courses" },
  title: "Courses",
  description:
    "Practical, code-first courses on AI systems, MCP, cloud architecture, and building personal AI tools.",
};

const levelColor: Record<string, "blue" | "yellow" | "red" | "default"> = {
  Beginner: "default",
  "Beginner to Intermediate": "blue",
  Intermediate: "blue",
  Advanced: "red",
};

export default function CoursesPage() {
  const courses = getCourses();
  const available = courses.filter(isCourseAvailable);
  const roadmap = courses.filter((c) => !isCourseAvailable(c));

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          The full catalogue
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Every course, in one place.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
          The whole catalogue across all five tracks — code-first, written from
          real experience, with the reasoning behind each decision. Available
          courses first, then what&apos;s on the roadmap.
        </p>
        <p className="text-sm text-zinc-400 dark:text-zinc-500 mt-3">
          Prefer a guided path? Start at{" "}
          <Link href="/learn" className="text-blue-600 dark:text-blue-400 hover:underline">
            Learn
          </Link>{" "}
          — the tracks put these in order.
        </p>
      </div>

      {/* What to expect */}
      <div className="grid sm:grid-cols-3 gap-4 mb-14 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        {[
          { label: "Step-by-step", desc: "Structured lessons with clear goals" },
          { label: "Code-first", desc: "Real code, not pseudocode" },
          {
            label: "Practical context",
            desc: "Why decisions are made, not just what to do",
          },
        ].map((item) => (
          <div key={item.label}>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              {item.label}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* ── Available now ─────────────────────────────────────────────────── */}
      <div className="mb-14">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Available now
          </h2>
          <span className="text-xs text-zinc-400">{available.length} full courses</span>
        </div>

        {available.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">
            <GraduationCap className="w-8 h-8 mx-auto mb-3 opacity-50" />
            <p className="text-sm">First courses publishing soon.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 gap-5">
            {available.map((course) => (
              <Link
                key={course.slug}
                href={`/courses/${course.slug}`}
                className="group flex flex-col p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                    {course.title}
                  </h3>
                  <Badge variant="green">Available</Badge>
                </div>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed flex-1 mb-4">
                  {course.summary}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex flex-wrap gap-1.5">
                    <Badge variant={levelColor[course.level] ?? "default"}>
                      {course.level}
                    </Badge>
                    {course.lessonCount && (
                      <Badge variant="outline">{course.lessonCount} lessons</Badge>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── On the roadmap ───────────────────────────────────────────────── */}
      {roadmap.length > 0 && (
        <div className="mb-14">
          <div className="flex items-baseline justify-between mb-2">
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              On the roadmap
            </h2>
            <span className="text-xs text-zinc-400">{roadmap.length} planned</span>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-5 max-w-2xl">
            Topics I am actively building toward. Listed here so you know what is
            coming — and can tell me which you want first.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {roadmap.map((course: Course) => (
              <div
                key={course.slug}
                className="flex flex-col p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl opacity-90"
              >
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="text-sm font-medium text-zinc-700 dark:text-zinc-300 leading-snug">
                    {course.title}
                  </h3>
                  <Badge variant="outline">Soon</Badge>
                </div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed line-clamp-3">
                  {course.summary}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="p-6 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          Want one of the roadmap topics sooner, or something not listed?
        </p>
        {/* Contact disabled until backend is ready — restore <Link href="/contact"> to re-enable */}
        <span className="text-sm text-zinc-400 cursor-not-allowed">
          Tell me what you want to learn →
        </span>
      </div>
    </div>
  );
}
