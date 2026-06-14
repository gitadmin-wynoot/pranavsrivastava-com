import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { getBlogPosts } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Notes on AI systems, cloud architecture, APIs, automation, and building in public.",
};

export default function BlogPage() {
  const posts = getBlogPosts();

  const categories = Array.from(new Set(posts.map((p) => p.category)));

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          Blog
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Notes from the workshop
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 leading-relaxed">
          Writing about AI systems, cloud architecture, APIs, and building in
          public. Some posts are polished. Some are working notes.
        </p>
      </div>

      {/* Category pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Badge key={cat} variant="outline">
              {cat}
            </Badge>
          ))}
        </div>
      )}

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">
          <BookOpen className="w-8 h-8 mx-auto mb-3 opacity-50" />
          <p className="text-sm">First posts coming soon.</p>
        </div>
      ) : (
        <div className="space-y-0 divide-y divide-zinc-100 dark:divide-zinc-900">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex flex-col py-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/50 -mx-3 px-3 rounded-lg transition-colors"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <h2 className="text-base font-medium text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-snug">
                  {post.title}
                </h2>
                <Badge variant="outline" className="shrink-0">
                  {post.category}
                </Badge>
              </div>
              {post.summary && (
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                  {post.summary}
                </p>
              )}
              <div className="flex items-center gap-3 text-xs text-zinc-400">
                <span>{formatDate(post.publishedAt)}</span>
                <span>·</span>
                <span>{post.readingTimeMin} min read</span>
                {post.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-zinc-300 dark:text-zinc-600">
                    #{tag}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
