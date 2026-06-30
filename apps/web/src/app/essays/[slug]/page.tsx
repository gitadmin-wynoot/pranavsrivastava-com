import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getEssay, getEssays } from "@/lib/content";
import { mdxCompileOptions } from "@/lib/mdx";
import { CodeBlock } from "@/components/mdx/code-block";
import { essayComponents } from "@/components/essays/figures";
import { ArticleListen } from "@/components/blog/article-listen";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getEssays().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) return {};
  return { title: essay.title, description: essay.summary || essay.dek };
}

export default async function EssayPage({ params }: Props) {
  const { slug } = await params;
  const essay = getEssay(slug);
  if (!essay) notFound();

  const { content } = await compileMDX({
    source: essay.content,
    options: mdxCompileOptions,
    components: { pre: CodeBlock, ...essayComponents },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <Link
        href="/essays"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Essays
      </Link>

      {/* Editorial header */}
      <header className="mb-10">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Essay · Pranav, in his own words
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-4">
          {essay.title}
        </h1>
        {essay.dek && (
          <p className="text-lg sm:text-xl text-zinc-500 dark:text-zinc-400 leading-relaxed italic">
            {essay.dek}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-3 mt-5 text-xs text-zinc-400">
          <span>{formatDate(essay.publishedAt)}</span>
          <span>·</span>
          <span>{essay.readingTimeMin} min read</span>
          <span className="hidden sm:inline">·</span>
          <ArticleListen targetId="essay-body" />
        </div>
      </header>

      <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

      {/* Body — slightly larger, more readable for long-form */}
      <article id="essay-body" className="prose prose-lg max-w-none [&_p]:text-[1.0625rem] [&_p]:leading-[1.75]">
        {content}
      </article>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-400 mb-4">
          Written by{" "}
          <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
            Pranav Srivastava
          </Link>
          . These are working thoughts, not final answers — I change my mind.
        </p>
        <Link
          href="/essays"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          More essays <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
