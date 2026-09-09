import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Wrench, Target } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getLab, getLabs, isLabAvailable } from "@/lib/content";
import { mdxCompileOptions } from "@/lib/mdx";
import { Badge } from "@/components/ui/badge";
import { courseComponents } from "@/components/mdx/course-components";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getLabs()
    .filter(isLabAvailable)
    .map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab) return {};
  return {
    title: lab.title,
    description: lab.summary,
    alternates: { canonical: `/labs/${slug}` },
  };
}

export default async function LabPage({ params }: Props) {
  const { slug } = await params;
  const lab = getLab(slug);
  if (!lab || !isLabAvailable(lab)) notFound();

  const { content } = await compileMDX({
    source: lab.content,
    options: mdxCompileOptions,
    components: courseComponents,
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/labs"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Labs
      </Link>

      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> {lab.durationMin} min
          </span>
          <Badge variant="blue">{lab.level}</Badge>
          {lab.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="default">#{t}</Badge>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-4">
          {lab.title}
        </h1>
        {lab.summary && (
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">{lab.summary}</p>
        )}

        {/* Outcome + tools */}
        <div className="mt-5 grid sm:grid-cols-2 gap-3">
          {lab.outcome && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-1 flex items-center gap-1.5">
                <Target className="w-3 h-3" /> What you build
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{lab.outcome}</p>
            </div>
          )}
          {lab.tools.length > 0 && (
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1 flex items-center gap-1.5">
                <Wrench className="w-3 h-3" /> Stack
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {lab.tools.join(" · ")}
              </p>
            </div>
          )}
        </div>
      </header>

      <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

      {/* MDX content */}
      <article className="prose course-content max-w-none">{content}</article>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-400 mb-4">
          Built by{" "}
          <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
            Pranav Srivastava
          </Link>
        </p>
        <Link
          href="/labs"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          More labs <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
