import type { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ArrowRight } from "lucide-react";
import { getCourses } from "@/lib/content";
import { Badge, statusVariant } from "@/components/ui/badge";

export const metadata: Metadata = {
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

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="max-w-2xl mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Courses
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Learn by building.
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
          Practical courses that show you how to build real things — with code,
          context, and the reasoning behind each decision. Written from actual
          experience, not just theory.
        </p>
      </div>

      {/* What to expect */}
      <div className="grid sm:grid-cols-3 gap-4 mb-12 p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
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

      {/* Course list */}
      {courses.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <GraduationCap className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">Courses in preparation. Check back soon.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-5">
          {courses.map((course) => (
            <Link
              key={course.slug}
              href={`/courses/${course.slug}`}
              className="group flex flex-col p-5 sm:p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 text-base group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {course.title}
                </h2>
                <Badge variant={statusVariant[course.status]}>
                  {course.status.replace("-", " ")}
                </Badge>
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
                    <Badge variant="outline">
                      {course.lessonCount} lessons
                    </Badge>
                  )}
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="mt-12 p-6 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-center">
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
          Interested in a specific topic?
        </p>
        <Link
          href="/contact"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Let me know what you want to learn →
        </Link>
      </div>
    </div>
  );
}
