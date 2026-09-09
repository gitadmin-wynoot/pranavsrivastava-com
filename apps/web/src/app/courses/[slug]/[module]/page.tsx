import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, ChevronRight } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import {
  getCourse,
  getCourseManifest,
  getCourseModule,
  getCourses,
  isMultiModuleCourse,
} from "@/lib/content";
import { mdxCompileOptions } from "@/lib/mdx";
import { courseComponents } from "@/components/mdx/course-components";
import { ModuleNav } from "@/components/course/module-nav";
import { LessonComplete } from "@/components/course/lesson-complete";
import { ReadingProgress } from "@/components/course/reading-progress";

interface Props {
  params: Promise<{ slug: string; module: string }>;
}

export async function generateStaticParams() {
  const courses = getCourses();
  const params: { slug: string; module: string }[] = [];

  for (const course of courses) {
    if (isMultiModuleCourse(course.slug)) {
      const manifest = getCourseManifest(course.slug);
      if (manifest) {
        for (const mod of manifest.modules) {
          params.push({ slug: course.slug, module: mod.id });
        }
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, module: moduleId } = await params;
  const mod = getCourseModule(slug, moduleId);
  const course = getCourse(slug);
  if (!mod || !course) return {};
  return {
    title: `${mod.title} — ${course.title}`,
    description: mod.summary || course.summary,
    alternates: { canonical: `/courses/${slug}/${moduleId}` },
  };
}

export default async function CourseModulePage({ params }: Props) {
  const { slug, module: moduleId } = await params;

  if (!isMultiModuleCourse(slug)) notFound();

  const manifest = getCourseManifest(slug);
  const mod = getCourseModule(slug, moduleId);
  if (!manifest || !mod) notFound();

  const { content } = await compileMDX({
    source: mod.content,
    options: mdxCompileOptions,
    components: courseComponents,
  });

  // Navigation: find prev / next in the manifest order
  const moduleIds = manifest.modules.map((m) => m.id);
  const currentIndex = moduleIds.indexOf(moduleId);
  const prevMeta = currentIndex > 0 ? manifest.modules[currentIndex - 1] : null;
  const nextMeta =
    currentIndex < moduleIds.length - 1
      ? manifest.modules[currentIndex + 1]
      : null;

  const lessonNumber = currentIndex + 1;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
      <ReadingProgress />
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-zinc-400 mb-8">
        <Link href="/learn" className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors">
          Learning tracks
        </Link>
        <ChevronRight className="w-3 h-3" />
        <Link
          href={`/courses/${slug}`}
          className="hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors"
        >
          {manifest.title}
        </Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-zinc-600 dark:text-zinc-300 truncate max-w-[200px]">
          {mod.title}
        </span>
      </nav>

      <div className="flex gap-10 items-start">
        {/* Sidebar — progress + lessons (client, localStorage-backed) */}
        <ModuleNav
          slug={slug}
          currentId={moduleId}
          modules={manifest.modules.map((m) => ({ id: m.id, title: m.title }))}
        />

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Orientation: where you are */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <span className="font-medium text-zinc-500 dark:text-zinc-300">
              Lesson {lessonNumber} of {manifest.modules.length}
            </span>
            <span className="text-zinc-200 dark:text-zinc-700">·</span>
            <Clock className="w-3 h-3" />
            <span>{mod.time} min</span>
            <span className="text-zinc-200 dark:text-zinc-700">·</span>
            <span>{mod.level}</span>
          </div>

          {/* MDX content */}
          <article className="prose max-w-none course-content">
            {content}
          </article>

          {/* Mark complete & continue */}
          <LessonComplete
            slug={slug}
            currentId={moduleId}
            next={nextMeta ? { id: nextMeta.id, title: nextMeta.title } : null}
          />

          {/* Quiet prev link below the main CTA */}
          {prevMeta && (
            <div className="mt-6">
              <Link
                href={`/courses/${slug}/${prevMeta.id}`}
                className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="truncate max-w-[240px]">Previous: {prevMeta.title}</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
