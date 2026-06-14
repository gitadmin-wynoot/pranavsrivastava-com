import fs from "fs";
import path from "path";
import matter from "gray-matter";

/*
  Content lives in apps/web/content/ — co-located with the app.
  process.cwd() on Vercel resolves to the app root (apps/web).
  Locally it also resolves to apps/web when running `pnpm dev` from that folder,
  or to the monorepo root when using turbo — hence the path.join logic below.
*/
function getContentDir(...segments: string[]) {
  const cwd = process.cwd();
  const direct = path.join(cwd, "content", ...segments);
  if (fs.existsSync(direct)) return direct;
  // Fallback for turbo running from monorepo root
  return path.join(cwd, "apps", "web", "content", ...segments);
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface BlogPost {
  slug: string;
  title: string;
  summary: string;
  category: string;
  tags: string[];
  published: boolean;
  publishedAt: string;
  readingTimeMin: number;
  content: string;
}

export interface Track {
  slug: string;
  title: string;
  tagline: string;
  summary: string;
  icon: string;        // emoji — no image dependency
  color: string;       // tailwind color token e.g. "blue"
  order: number;
  prereqs: string[];   // track slugs this depends on
  leadsTo: string[];   // track slugs this unlocks
  tags: string[];
  courseCount?: number;
  content: string;
}

export interface Course {
  slug: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate";
  status: "draft" | "published" | "coming-soon";
  track: string;       // track slug this belongs to
  prereqs: string[];   // course slugs recommended before this
  tags: string[];
  lessonCount?: number;
  content: string;
}

export interface Project {
  slug: string;
  title: string;
  summary: string;
  status: "idea" | "building" | "live" | "archived";
  category: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: string;
  content: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function estimateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function readMdxFiles(dir: string) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export function getBlogPosts(): BlogPost[] {
  const dir = getContentDir("blog");
  const files = readMdxFiles(dir);

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        summary: data.summary ?? "",
        category: data.category ?? "Notes",
        tags: data.tags ?? [],
        published: data.published ?? true,
        publishedAt: data.publishedAt ?? data.date ?? new Date().toISOString(),
        readingTimeMin: estimateReadingTime(content),
        content,
      } satisfies BlogPost;
    })
    .filter((p) => p.published)
    .sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
}

export function getBlogPost(slug: string): BlogPost | null {
  const dir = getContentDir("blog");
  const filePath =
    path.join(dir, `${slug}.mdx`).replace(/\.mdx$/, ".mdx") ||
    path.join(dir, `${slug}.md`);

  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  const resolvedPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;

  if (!resolvedPath) return null;

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    category: data.category ?? "Notes",
    tags: data.tags ?? [],
    published: data.published ?? true,
    publishedAt: data.publishedAt ?? data.date ?? new Date().toISOString(),
    readingTimeMin: estimateReadingTime(content),
    content,
  };
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export function getCourses(): Course[] {
  const dir = getContentDir("courses");
  const files = readMdxFiles(dir);

  return files.map((file) => {
    const slug = file.replace(/\.mdx?$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title ?? slug,
      summary: data.summary ?? "",
      level: data.level ?? "Intermediate",
      status: data.status ?? "draft",
      track: data.track ?? "uncategorised",
      prereqs: data.prereqs ?? [],
      tags: data.tags ?? [],
      lessonCount: data.lessonCount,
      content,
    } satisfies Course;
  });
}

export function getCoursesByTrack(trackSlug: string): Course[] {
  return getCourses().filter((c) => c.track === trackSlug);
}

export function getCourse(slug: string): Course | null {
  const dir = getContentDir("courses");
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  const resolvedPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!resolvedPath) return null;

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    level: data.level ?? "Intermediate",
    status: data.status ?? "draft",
    track: data.track ?? "uncategorised",
    prereqs: data.prereqs ?? [],
    tags: data.tags ?? [],
    lessonCount: data.lessonCount,
    content,
  };
}

// ─── Tracks ───────────────────────────────────────────────────────────────────

export function getTracks(): Track[] {
  const dir = getContentDir("tracks");
  const files = readMdxFiles(dir);

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        tagline: data.tagline ?? "",
        summary: data.summary ?? "",
        icon: data.icon ?? "📚",
        color: data.color ?? "zinc",
        order: data.order ?? 99,
        prereqs: data.prereqs ?? [],
        leadsTo: data.leadsTo ?? [],
        tags: data.tags ?? [],
        courseCount: data.courseCount,
        content,
      } satisfies Track;
    })
    .sort((a, b) => a.order - b.order);
}

export function getTrack(slug: string): Track | null {
  const dir = getContentDir("tracks");
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  const resolvedPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!resolvedPath) return null;

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    tagline: data.tagline ?? "",
    summary: data.summary ?? "",
    icon: data.icon ?? "📚",
    color: data.color ?? "zinc",
    order: data.order ?? 99,
    prereqs: data.prereqs ?? [],
    leadsTo: data.leadsTo ?? [],
    tags: data.tags ?? [],
    courseCount: data.courseCount,
    content,
  };
}

// ─── Projects ─────────────────────────────────────────────────────────────────

export function getProjects(): Project[] {
  const dir = getContentDir("projects");
  const files = readMdxFiles(dir);

  return files
    .map((file) => {
      const slug = file.replace(/\.mdx?$/, "");
      const raw = fs.readFileSync(path.join(dir, file), "utf-8");
      const { data, content } = matter(raw);
      return {
        slug,
        title: data.title ?? slug,
        summary: data.summary ?? "",
        status: data.status ?? "idea",
        category: data.category ?? "Project",
        tags: data.tags ?? [],
        liveUrl: data.liveUrl,
        githubUrl: data.githubUrl,
        featured: data.featured ?? false,
        createdAt: data.createdAt ?? new Date().toISOString(),
        content,
      } satisfies Project;
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
}

export function getProject(slug: string): Project | null {
  const dir = getContentDir("projects");
  const mdxPath = path.join(dir, `${slug}.mdx`);
  const mdPath = path.join(dir, `${slug}.md`);
  const resolvedPath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!resolvedPath) return null;

  const raw = fs.readFileSync(resolvedPath, "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    status: data.status ?? "idea",
    category: data.category ?? "Project",
    tags: data.tags ?? [],
    liveUrl: data.liveUrl,
    githubUrl: data.githubUrl,
    featured: data.featured ?? false,
    createdAt: data.createdAt ?? new Date().toISOString(),
    content,
  };
}
