import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, BarChart } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getCourse, getCourses } from "@/lib/content";
import { Badge, statusVariant } from "@/components/ui/badge";

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
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/courses"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Courses
      </Link>

      {/* Header */}
      <header className="mb-10">
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
              <Clock className="w-3 h-3 mr-1" />
              {course.lessonCount} lessons
            </Badge>
          )}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-4">
          {course.title}
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          {course.summary}
        </p>
      </header>

      {course.status !== "published" && (
        <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl text-sm text-amber-700 dark:text-amber-400">
          This course is currently in{" "}
          <strong>{course.status.replace("-", " ")}</strong> status. Content
          and lessons are being developed. Check back soon.
        </div>
      )}

      <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

      <article className="prose max-w-none">{content}</article>

      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <Link
          href="/courses"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All courses
        </Link>
      </div>
    </div>
  );
}
