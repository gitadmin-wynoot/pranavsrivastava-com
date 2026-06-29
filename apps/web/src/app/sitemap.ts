import type { MetadataRoute } from "next";
import {
  getBlogPosts,
  getEssays,
  getLabs,
  isLabAvailable,
  getCourses,
  getTracks,
} from "@/lib/content";

const BASE = "https://pranavsrivastava.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes = [
    "",
    "/about",
    "/about/research",
    "/labs",
    "/learn",
    "/courses",
    "/blog",
    "/essays",
    "/ai-lab",
    "/contact",
    "/circle",
  ].map((path) => ({ url: `${BASE}${path}`, lastModified: now }));

  const tracks = getTracks().map((t) => ({ url: `${BASE}/learn/${t.slug}`, lastModified: now }));
  const courses = getCourses().map((c) => ({ url: `${BASE}/courses/${c.slug}`, lastModified: now }));
  const labs = getLabs()
    .filter(isLabAvailable)
    .map((l) => ({ url: `${BASE}/labs/${l.slug}`, lastModified: now }));
  const posts = getBlogPosts().map((p) => ({
    url: `${BASE}/blog/${p.slug}`,
    lastModified: new Date(p.publishedAt),
  }));
  const essays = getEssays().map((e) => ({
    url: `${BASE}/essays/${e.slug}`,
    lastModified: new Date(e.publishedAt),
  }));

  return [...staticRoutes, ...tracks, ...courses, ...labs, ...posts, ...essays];
}
