import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BarChart, BookOpen, Tag } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getCourse, getCourses } from "@/lib/content";
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

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params;
  const course = getCourse(slug);
  if (!course) notFound();

  const { content } = await compileMDX({
    source: course.content,
    options: { parseFrontmatter: false },
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
        {/* Badges row */}
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

        {/* Tags */}
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

      {/* Coming soon notice */}
      {!isPublished && (
        <div className="mb-10 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          <strong>In development.</strong> This course is{" "}
          {course.status.replace("-", " ")} — full content and lessons are
          being written. The outline below gives you a preview of what is coming.
        </div>
      )}

      {/* Divider */}
      <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

      {/* MDX content */}
      <article className="prose max-w-none course-content">
        {content}
      </article>

      {/* Footer nav */}
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
