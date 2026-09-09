import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getEssays,
  getLabs,
  isLabAvailable,
  getCourses,
  getCourseModules,
  isMultiModuleCourse,
  getTracks,
} from "@/lib/content";
import { atlasPlaces } from "@/lib/atlas";

const BASE = "https://pranavsrivastava.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/about/research`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/labs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/learn`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/courses`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/essays`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/ai-lab`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE}/circle`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/atlas`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ];

  const places = atlasPlaces.map((p) => ({
    url: `${BASE}/atlas/${p.slug}`,
    lastModified: now,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  const tracks = getTracks().map((t) => ({
    url: `${BASE}/learn/${t.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const courses = getCourses().map((c) => ({
    url: `${BASE}/courses/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Multi-module courses' individual lesson pages — previously missing from
  // the sitemap entirely, even though they're real, indexed, linked pages.
  const courseModules = getCourses()
    .filter((c) => isMultiModuleCourse(c.slug))
    .flatMap((c) =>
      getCourseModules(c.slug).map((m) => ({
        url: `${BASE}/courses/${c.slug}/${m.id}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }))
    );

  const labs = getLabs()
    .filter(isLabAvailable)
    .map((l) => ({
      url: `${BASE}/labs/${l.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  const posts = getBlogPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const essays = getEssays().map((e) => ({
    url: `${BASE}/essays/${e.slug}`,
    lastModified: new Date(e.publishedAt),
    changeFrequency: "yearly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...places,
    ...tracks,
    ...courses,
    ...courseModules,
    ...labs,
    ...posts,
    ...essays,
  ];
}
