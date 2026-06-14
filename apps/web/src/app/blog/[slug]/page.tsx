import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getBlogPost, getBlogPosts } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Props {
  params: Promise<{ slug: string }>;
}

/* Pre-generate all blog post routes at build time */
export async function generateStaticParams() {
  return getBlogPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const { content } = await compileMDX({
    source: post.content,
    options: { parseFrontmatter: false },
  });

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/blog"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Blog
      </Link>

      {/* Header */}
      <header className="mb-10">
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge variant="outline">{post.category}</Badge>
          {post.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default">
              #{tag}
            </Badge>
          ))}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-4">
          {post.title}
        </h1>
        {post.summary && (
          <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
            {post.summary}
          </p>
        )}
        <div className="flex items-center gap-3 mt-4 text-xs text-zinc-400">
          <span>{formatDate(post.publishedAt)}</span>
          <span>·</span>
          <span>{post.readingTimeMin} min read</span>
        </div>
      </header>

      {/* Divider */}
      <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

      {/* MDX content */}
      <article className="prose max-w-none">{content}</article>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t border-zinc-200 dark:border-zinc-800">
        <p className="text-sm text-zinc-400 mb-4">
          Written by{" "}
          <Link href="/about" className="text-blue-600 dark:text-blue-400 hover:underline">
            Pranav Srivastava
          </Link>
        </p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All posts
        </Link>
      </div>
    </div>
  );
}
