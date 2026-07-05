import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

// Shared compileMDX options. remark-gfm enables GitHub-flavoured markdown — most
// importantly pipe tables (without it, `| a | b |` renders as raw text).
// rehype-highlight adds syntax highlighting to any fenced block that declares a
// language (```python etc.); blocks without a language — like our ASCII
// <Diagram>s — are left untouched (detect defaults off).
export const mdxCompileOptions = {
  parseFrontmatter: false,
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeHighlight, { ignoreMissing: true }]],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
