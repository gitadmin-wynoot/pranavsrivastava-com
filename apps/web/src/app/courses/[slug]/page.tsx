import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BarChart, BookOpen, Tag } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getCourse,
  getCourses,
  getCourseManifest,
  getCourseModules,
  isMultiModuleCourse,
  isCourseAvailable,
} from "@/lib/content";
import { mdxCompileOptions } from "@/lib/mdx";
import { Badge, statusVariant } from "@/components/ui/badge";
import { courseComponents } from "@/components/mdx/course-components";
import { CourseOutline } from "@/components/course/course-outline";
import { RecommendedNext } from "@/components/course/recommended-next";

// Available courses offered as "what next" recommendations across course pages.
function recommendationPool() {
  return getCourses()
    .filter(isCourseAvailable)
    .map((c) => ({
      slug: c.slug,
      title: c.title,
      summary: c.summary,
      track: c.track,
      lessonCount: c.lessonCount,
    }));
}

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

      {/* Progress-aware outline: start/continue + module list with checkmarks */}
      <CourseOutline
        slug={slug}
        modules={manifest.modules.map((meta) => ({
          id: meta.id,
          title: meta.title,
          summary: modules.find((m) => m.id === meta.id)?.summary,
          time_minutes: meta.time_minutes,
        }))}
      />

      {/* What next — a fresh, relevant recommendation each visit */}
      <RecommendedNext
        currentSlug={slug}
        currentTrack={manifest.track}
        candidates={recommendationPool()}
      />

      {/* Footer */}
      <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All tracks
        </Link>
        {/* Contact disabled until backend is ready — restore <Link href="/contact"> to re-enable */}
        <span className="text-sm text-zinc-400 cursor-not-allowed">
          Questions? Get in touch →
        </span>
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

      {/* What next — a fresh, relevant recommendation each visit */}
      <RecommendedNext
        currentSlug={slug}
        currentTrack={course.track}
        candidates={recommendationPool()}
      />

      <div className="mt-10 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
        <Link
          href="/learn"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All tracks
        </Link>
        {/* Contact disabled until backend is ready — restore <Link href="/contact"> to re-enable */}
        <span className="text-sm text-zinc-400 cursor-not-allowed">
          Questions? Get in touch →
        </span>
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
