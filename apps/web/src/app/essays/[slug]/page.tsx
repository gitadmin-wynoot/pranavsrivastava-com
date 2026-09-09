import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Layers } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getEssay, getEssays, getEssaysInSeries } from "@/lib/content";
import { mdxCompileOptions } from "@/lib/mdx";
import { CodeBlock } from "@/components/mdx/code-block";
import { essayComponents } from "@/components/essays/figures";
import { ArticleListen } from "@/components/blog/article-listen";
import { formatDate } from "@/lib/utils";
import { JsonLd } from "@/components/seo/json-ld";
import { articleSchema, breadcrumbSchema, SITE_URL } from "@/lib/schema";

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
  const description = essay.summary || essay.dek;
  return {
    title: essay.title,
    description,
    alternates: { canonical: `/essays/${slug}` },
    openGraph: {
      type: "article",
      title: essay.title,
      description,
      publishedTime: essay.publishedAt,
      authors: [SITE_URL],
      section: essay.category,
    },
    twitter: {
      card: "summary_large_image",
      title: essay.title,
      description,
    },
  };
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

  const seriesParts = essay.series ? getEssaysInSeries(essay.series) : [];
  const currentIdx = seriesParts.findIndex((p) => p.slug === essay.slug);
  const nextPart = currentIdx >= 0 ? seriesParts[currentIdx + 1] : undefined;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <JsonLd
        data={articleSchema({
          url: `${SITE_URL}/essays/${slug}`,
          headline: essay.title,
          description: essay.summary || essay.dek,
          datePublished: essay.publishedAt,
          section: essay.category,
        })}
      />
      <JsonLd
        data={breadcrumbSchema([
          { name: "Essays", url: `${SITE_URL}/essays` },
          { name: essay.title, url: `${SITE_URL}/essays/${slug}` },
        ])}
      />
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

      {seriesParts.length > 1 && (
        <div className="mb-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-5">
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-400 mb-3">
            <Layers className="w-3.5 h-3.5" /> {essay.series} · part {currentIdx + 1} of {seriesParts.length}
          </p>
          <ol className="space-y-1.5">
            {seriesParts.map((p, i) => {
              const isCurrent = p.slug === essay.slug;
              return (
                <li key={p.slug} className="flex gap-2.5 text-sm leading-snug">
                  <span className="shrink-0 font-mono text-xs text-zinc-400 pt-0.5">{i + 1}.</span>
                  {isCurrent ? (
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100">{p.title}</span>
                  ) : (
                    <Link href={`/essays/${p.slug}`} className="text-blue-600 dark:text-blue-400 hover:underline">
                      {p.title}
                    </Link>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}

      <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

      {/* Body — slightly larger, more readable for long-form */}
      <article id="essay-body" className="prose prose-lg max-w-none [&_p]:text-[1.0625rem] [&_p]:leading-[1.75]">
        {content}
      </article>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        {nextPart && (
          <Link
            href={`/essays/${nextPart.slug}`}
            className="group mb-6 flex items-center justify-between gap-4 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 hover:border-blue-500/40 transition-colors"
          >
            <span>
              <span className="block text-xs uppercase tracking-wider text-zinc-400">Next in {essay.series}</span>
              <span className="mt-0.5 block font-semibold text-zinc-900 dark:text-zinc-100">{nextPart.title}</span>
            </span>
            <ArrowRight className="w-4 h-4 shrink-0 text-blue-500 group-hover:translate-x-1 transition-transform" />
          </Link>
        )}
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
