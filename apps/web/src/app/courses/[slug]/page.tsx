import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BarChart, BookOpen, Tag, ChevronRight, Play } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getCourse,
  getCourses,
  getCourseManifest,
  getCourseModules,
  isMultiModuleCourse,
} from "@/lib/content";
import { mdxCompileOptions } from "@/lib/mdx";
import { Badge, statusVariant } from "@/components/ui/badge";
import { courseComponents } from "@/components/mdx/course-components";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) return {};
  return { title: course.title, description: course.summary };
}

// ── Multi-module course: module listing page ────────────────────────────────

async function MultiModuleCourseIndex({ slug }: { slug: string }) {
  const manifest = getCourseManifest(slug);
  const modules = getCourseModules(slug);
  if (!manifest) return null;

  const totalMinutes = manifest.modules.reduce(
    (sum, m) => sum + m.time_minutes,
    0
  );
  const totalHours = Math.floor(totalMinutes / 60);
  const remainingMin = totalMinutes % 60;
  const durationLabel =
    totalHours > 0
      ? `${totalHours}h ${remainingMin > 0 ? `${remainingMin}m` : ""}`.trim()
      : `${totalMinutes}m`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Learning tracks
      </Link>

      {/* Course header card */}
      <header className="mb-10 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={statusVariant[manifest.status]}>
            {manifest.status.replace("-", " ")}
          </Badge>
          <Badge variant="outline">
            <BarChart className="w-3 h-3 mr-1" />
            {manifest.level}
          </Badge>
          <Badge variant="outline">
            <BookOpen className="w-3 h-3 mr-1" />
            {manifest.modules.length} modules
          </Badge>
          <Badge variant="outline">
            <Clock className="w-3 h-3 mr-1" />
            {durationLabel}
          </Badge>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-3">
          {manifest.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-base">
          {manifest.summary}
        </p>

        {manifest.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {manifest.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Start button */}
      {modules.length > 0 && (
        <Link
          href={`/courses/${slug}/${modules[0].id}`}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors mb-10"
        >
          <Play className="w-3.5 h-3.5" />
          Start course
        </Link>
      )}

      {/* Module list */}
      <div className="space-y-2">
        <h2 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-4">
          Course modules
        </h2>
        {manifest.modules.map((meta, index) => {
          const moduleData = modules.find((m) => m.id === meta.id);
          return (
            <Link
              key={meta.id}
              href={`/courses/${slug}/${meta.id}`}
              className="flex items-center gap-4 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 transition-all group"
            >
              {/* Module number */}
              <span className="flex-none w-7 h-7 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-xs font-mono font-medium flex items-center justify-center">
                {String(index + 1).padStart(2, "0")}
              </span>

              {/* Title + meta */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate group-hover:text-zinc-700 dark:group-hover:text-zinc-300">
                  {meta.title}
                </p>
                {moduleData?.summary && (
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {moduleData.summary}
                  </p>
                )}
              </div>

              {/* Time + chevron */}
              <div className="flex-none flex items-center gap-3 text-zinc-400">
                <span className="text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {meta.time_minutes}m
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All tracks
        </Link>
        <Link
          href="/contact"
          className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          Questions? Get in touch →
        </Link>
      </div>
    </div>
  );
}

// ── Single-file course: full content page ───────────────────────────────────

async function SingleFileCourse({ slug }: { slug: string }) {
  const course = getCourse(slug);
  if (!course) return null;

  const { content } = await compileMDX({
    source: course.content,
    options: mdxCompileOptions,
    components: courseComponents,
  });

  const isPublished = course.status === "published";

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      {/* Back */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Learning tracks
      </Link>

      {/* Course header card */}
      <header className="mb-10 p-6 sm:p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant={statusVariant[course.status]}>
            {course.status.replace("-", " ")}
          </Badge>
          <Badge variant="outline">
            <BarChart className="w-3 h-3 mr-1" />
            {course.level}
          </Badge>
          {course.lessonCount && (
            <Badge variant="outline">
              <BookOpen className="w-3 h-3 mr-1" />
              {course.lessonCount} chapters
            </Badge>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-3">
          {course.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed text-base">
          {course.summary}
        </p>

        {course.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full"
              >
                <Tag className="w-2.5 h-2.5" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {!isPublished && (
        <div className="mb-10 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <strong>In development.</strong> This course is{" "}
          {course.status.replace("-", " ")} — full content and lessons are
          being written. The outline below gives you a preview of what is coming.
        </div>
      )}

      <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

      <article className="prose max-w-none course-content">{content}</article>

      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All tracks
        </Link>
        <Link
          href="/contact"
          className="text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
        >
          Questions? Get in touch →
        </Link>
      </div>
    </div>
  );
}

// ── Entry point ─────────────────────────────────────────────────────────────

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  if (isMultiModuleCourse(slug)) {
    return <MultiModuleCourseIndex slug={slug} />;
  }

  return <SingleFileCourse slug={slug} />;
}
