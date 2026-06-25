import rehypeHighlight from "rehype-highlight";

// Shared compileMDX options. rehype-highlight adds syntax highlighting to any
// fenced block that declares a language (```python etc.); blocks without a
// language — like our ASCII <Diagram>s — are left untouched (detect defaults off).
export const mdxCompileOptions = {
  parseFrontmatter: false,
  mdxOptions: {
    rehypePlugins: [[rehypeHighlight, { ignoreMissing: true }]],
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any;
