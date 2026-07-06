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

export interface CourseModuleMeta {
  id: string;
  title: string;
  time_minutes: number;
  level: string;
  status: "draft" | "published";
  last_updated: string;
}

export interface CourseManifest {
  course_id: string;
  title: string;
  summary: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Beginner to Intermediate";
  track: string;
  status: "draft" | "published";
  version: string;
  last_reviewed: string;
  tags: string[];
  order?: number;      // position within its track's curriculum
  modules: CourseModuleMeta[];
}

export interface CourseModule {
  id: string;
  title: string;
  summary: string;
  module: number;
  time: number;
  level: string;
  status: string;
  content: string;
}

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

// Essays — longer, reflective perspective pieces (a separate, quieter section
// from the technical posts). They carry a "dek": a one-line standfirst.
export interface Essay {
  slug: string;
  title: string;
  dek: string;
  summary: string;
  published: boolean;
  publishedAt: string;
  readingTimeMin: number;
  /** Topic classification, e.g. "AI & Society", "Economics", "Product". */
  category?: string;
  /** Optional: groups essays into a numbered series. */
  series?: string;
  seriesPart?: number;
  content: string;
}

export interface TrackRoadmapItem {
  title: string;
  blurb: string;
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
  /** Optional — set to "coming-soon" for a track whose courses aren't built yet. */
  status?: "coming-soon";
  /** Planned courses shown as a roadmap when the track has none available yet. */
  roadmap?: TrackRoadmapItem[];
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
  order?: number;      // position within its track's curriculum
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

export interface Lab {
  slug: string;
  title: string;
  summary: string;
  outcome: string; // the concrete thing you walk away having built
  level: string; // Beginner | Intermediate | Advanced
  durationMin: number; // hands-on time
  tools: string[]; // stack used
  tags: string[];
  status: "published" | "draft" | "coming-soon";
  updatedAt: string;
  content: string;
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

// ─── Labs ───────────────────────────────────────────────────────────────────
// Hands-on, build-this-one-thing tutorials. Lighter than courses, the trust
// engine of the site: short, runnable, outcome-first.

function parseLab(file: string, dir: string): Lab {
  const slug = file.replace(/\.mdx?$/, "");
  const raw = fs.readFileSync(path.join(dir, file), "utf-8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title ?? slug,
    summary: data.summary ?? "",
    outcome: data.outcome ?? "",
    level: data.level ?? "Intermediate",
    durationMin: data.durationMin ?? 30,
    tools: data.tools ?? [],
    tags: data.tags ?? [],
    status: data.status ?? "draft",
    updatedAt: data.updatedAt ?? data.date ?? new Date().toISOString(),
    content,
  } satisfies Lab;
}

export function getLabs(): Lab[] {
  const dir = getContentDir("labs");
  return readMdxFiles(dir)
    .map((file) => parseLab(file, dir))
    .sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
}

export function getLab(slug: string): Lab | null {
  const dir = getContentDir("labs");
  const file = [`${slug}.mdx`, `${slug}.md`].find((f) =>
    fs.existsSync(path.join(dir, f))
  );
  return file ? parseLab(file, dir) : null;
}

/** A lab is "available" (openable) when published. */
export function isLabAvailable(lab: Lab): boolean {
  return lab.status === "published";
}

// ─── Essays ───────────────────────────────────────────────────────────────────

function parseEssay(file: string, dir: string): Essay {
  const slug = file.replace(/\.mdx?$/, "");
  const { data, content } = matter(fs.readFileSync(path.join(dir, file), "utf-8"));
  return {
    slug,
    title: data.title ?? slug,
    dek: data.dek ?? "",
    summary: data.summary ?? "",
    published: data.published ?? true,
    publishedAt: data.publishedAt ?? data.date ?? new Date().toISOString(),
    readingTimeMin: estimateReadingTime(content),
    category: data.category ?? undefined,
    series: data.series ?? undefined,
    seriesPart: data.seriesPart ?? undefined,
    content,
  } satisfies Essay;
}

/** All published essays in a series, ordered by part. */
export function getEssaysInSeries(series: string): Essay[] {
  return getEssays()
    .filter((e) => e.series === series)
    .sort((a, b) => (a.seriesPart ?? 0) - (b.seriesPart ?? 0));
}

export function getEssays(): Essay[] {
  const dir = getContentDir("essays");
  return readMdxFiles(dir)
    .map((file) => parseEssay(file, dir))
    .filter((e) => e.published)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getEssay(slug: string): Essay | null {
  const dir = getContentDir("essays");
  const file = [`${slug}.mdx`, `${slug}.md`].find((f) =>
    fs.existsSync(path.join(dir, f))
  );
  return file ? parseEssay(file, dir) : null;
}

// ─── Courses ──────────────────────────────────────────────────────────────────

export function isMultiModuleCourse(slug: string): boolean {
  const manifestPath = getContentDir("courses", slug, "course.manifest.json");
  return fs.existsSync(manifestPath);
}

export function getCourseManifest(slug: string): CourseManifest | null {
  const manifestPath = getContentDir("courses", slug, "course.manifest.json");
  if (!fs.existsSync(manifestPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as CourseManifest;
  } catch {
    return null;
  }
}

export function getCourseModules(slug: string): CourseModule[] {
  const manifest = getCourseManifest(slug);
  if (!manifest) return [];

  const modulesDir = getContentDir("courses", slug, "modules");
  if (!fs.existsSync(modulesDir)) return [];

  return manifest.modules
    .map((meta, index) => {
      const mdxPath = path.join(modulesDir, `${meta.id}.mdx`);
      const mdPath = path.join(modulesDir, `${meta.id}.md`);
      const filePath = fs.existsSync(mdxPath)
        ? mdxPath
        : fs.existsSync(mdPath)
          ? mdPath
          : null;
      if (!filePath) return null;

      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);
      return {
        id: meta.id,
        title: data.title ?? meta.title,
        summary: data.summary ?? "",
        module: data.module ?? index + 1,
        time: data.time ?? meta.time_minutes,
        level: data.level ?? meta.level,
        status: data.status ?? meta.status,
        content,
      } satisfies CourseModule;
    })
    .filter((m): m is CourseModule => m !== null);
}

export function getCourseModule(
  courseSlug: string,
  moduleId: string
): CourseModule | null {
  const manifest = getCourseManifest(courseSlug);
  if (!manifest) return null;

  const modulesDir = getContentDir("courses", courseSlug, "modules");
  const mdxPath = path.join(modulesDir, `${moduleId}.mdx`);
  const mdPath = path.join(modulesDir, `${moduleId}.md`);
  const filePath = fs.existsSync(mdxPath)
    ? mdxPath
    : fs.existsSync(mdPath)
      ? mdPath
      : null;
  if (!filePath) return null;

  const metaIndex = manifest.modules.findIndex((m) => m.id === moduleId);
  const meta = manifest.modules[metaIndex];
  if (!meta) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  return {
    id: moduleId,
    title: data.title ?? meta.title,
    summary: data.summary ?? "",
    module: data.module ?? metaIndex + 1,
    time: data.time ?? meta.time_minutes,
    level: data.level ?? meta.level,
    status: data.status ?? meta.status,
    content,
  };
}

export function getCourses(): Course[] {
  const dir = getContentDir("courses");

  // Single-file courses (top-level .mdx files)
  const singleFileCourses = readMdxFiles(dir).map((file) => {
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
      order: data.order,
      content,
    } satisfies Course;
  });

  // Multi-module courses (subdirectories with course.manifest.json)
  const subDirs = fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter((d) => d.isDirectory())
        .map((d) => d.name)
    : [];

  const multiModuleCourses = subDirs
    .map((dirName): Course | null => {
      const manifest = getCourseManifest(dirName);
      if (!manifest) return null;
      const totalMinutes = manifest.modules.reduce(
        (sum, m) => sum + m.time_minutes,
        0
      );
      return {
        slug: manifest.course_id,
        title: manifest.title,
        summary: manifest.summary,
        level: manifest.level,
        status: manifest.status,
        track: manifest.track ?? "uncategorised",
        prereqs: [],
        tags: manifest.tags ?? [],
        lessonCount: manifest.modules.length,
        order: manifest.order,
        content: `<!-- multi-module:${manifest.course_id} totalMinutes:${totalMinutes} -->`,
      };
    })
    .filter((c): c is Course => c !== null);

  // Reorganise, do not remove: drop single-file courses that a multi-module
  // course already supersedes, so the catalogue never double-lists a topic.
  // The .mdx files stay on disk — they just are not surfaced twice.
  const multiSlugs = new Set(multiModuleCourses.map((c) => c.slug));
  const supersededSingleFiles = new Set([
    "mcp-for-builders", // superseded by multi-module "mcp"
    "ai-agents-observability", // superseded by multi-module "ai-agents"
  ]);
  const dedupedSingleFiles = singleFileCourses.filter(
    (c) => !multiSlugs.has(c.slug) && !supersededSingleFiles.has(c.slug)
  );

  // Available (real) courses first, roadmap/coming-soon after.
  return [...multiModuleCourses, ...dedupedSingleFiles];
}

/** A course is "available" (a real, openable course) when published. */
export function isCourseAvailable(course: Course): boolean {
  return course.status === "published";
}

export function getCoursesByTrack(trackSlug: string): Course[] {
  return getCourses()
    .filter((c) => c.track === trackSlug)
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));
}

export function getCourse(slug: string): Course | null {
  // Check multi-module first
  if (isMultiModuleCourse(slug)) {
    const manifest = getCourseManifest(slug);
    if (!manifest) return null;
    const totalMinutes = manifest.modules.reduce(
      (sum, m) => sum + m.time_minutes,
      0
    );
    return {
      slug: manifest.course_id,
      title: manifest.title,
      summary: manifest.summary,
      level: manifest.level,
      status: manifest.status,
      track: manifest.track ?? "uncategorised",
      prereqs: [],
      tags: manifest.tags ?? [],
      lessonCount: manifest.modules.length,
      content: `<!-- multi-module:${manifest.course_id} totalMinutes:${totalMinutes} -->`,
    };
  }

  // Fall back to single-file
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
        status: data.status ?? undefined,
        roadmap: data.roadmap ?? undefined,
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
