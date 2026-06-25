import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, ChevronRight, BookOpen } from "lucide-react";
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
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
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 flex-none sticky top-10">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3 h-3" />
            {manifest.modules.length} modules
          </p>
          <nav className="space-y-0.5">
            {manifest.modules.map((meta, index) => {
              const isActive = meta.id === moduleId;
              return (
                <Link
                  key={meta.id}
                  href={`/courses/${slug}/${meta.id}`}
                  className={`flex items-start gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 font-medium"
                      : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 hover:text-zinc-800 dark:hover:text-zinc-200"
                  }`}
                >
                  <span
                    className={`flex-none mt-0.5 text-[10px] font-mono w-5 h-5 rounded-full flex items-center justify-center ${
                      isActive
                        ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900"
                        : "bg-zinc-100 dark:bg-zinc-800 text-zinc-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="leading-snug">{meta.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Module time */}
          <div className="flex items-center gap-2 text-xs text-zinc-400 mb-6">
            <Clock className="w-3 h-3" />
            <span>{mod.time} min read</span>
            <span className="text-zinc-200 dark:text-zinc-700">·</span>
            <span>{mod.level}</span>
          </div>

          {/* MDX content */}
          <article className="prose max-w-none course-content">
            {content}
          </article>

          {/* Prev / Next navigation */}
          <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-4">
            {prevMeta ? (
              <Link
                href={`/courses/${slug}/${prevMeta.id}`}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="truncate max-w-[200px]">{prevMeta.title}</span>
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to course
              </Link>
            )}

            {nextMeta ? (
              <Link
                href={`/courses/${slug}/${nextMeta.id}`}
                className="flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group ml-auto"
              >
                <span className="truncate max-w-[200px]">{nextMeta.title}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ) : (
              <Link
                href={`/courses/${slug}`}
                className="flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors ml-auto"
              >
                Back to course overview
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
