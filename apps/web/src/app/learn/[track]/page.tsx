import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, ChevronRight } from "lucide-react";
import { compileMDX } from "next-mdx-remote/rsc";
import { getTrack, getTracks, getCoursesByTrack, isCourseAvailable } from "@/lib/content";
import { Badge } from "@/components/ui/badge";
import { AIOSBrain } from "@/components/learn/ai-os-brain";
import { AIOSWordmap } from "@/components/learn/ai-os-wordmap";
import { AIOSSphere } from "@/components/learn/ai-os-sphere";

const trackComponents = { AIOSBrain, AIOSWordmap, AIOSSphere };

interface Props {
  params: Promise<{ track: string }>;
}

export async function generateStaticParams() {
  return getTracks().map((t) => ({ track: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) return {};
  return {
    title: track.title,
    description: track.summary,
    alternates: { canonical: `/learn/${slug}` },
  };
}

const levelColor: Record<string, "blue" | "yellow" | "red" | "default"> = {
  Beginner: "default",
  "Beginner to Intermediate": "blue",
  Intermediate: "blue",
  Advanced: "red",
};

export default async function TrackPage({ params }: Props) {
  const { track: slug } = await params;
  const track = getTrack(slug);
  if (!track) notFound();

  const allTracks = getTracks();
  const courses = getCoursesByTrack(slug);
  const availableCourses = courses.filter(isCourseAvailable);
  // A track with nothing available yet but a planned curriculum shows a roadmap.
  const roadmapMode = availableCourses.length === 0 && (track.roadmap?.length ?? 0) > 0;
  const prereqTracks = allTracks.filter((t) => track.prereqs.includes(t.slug));
  const leadsToTracks = allTracks.filter((t) => track.leadsTo.includes(t.slug));

  const { content } = await compileMDX({
    source: track.content,
    options: { parseFrontmatter: false },
    components: trackComponents,
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
      {/* Back */}
      <Link
        href="/learn"
        className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300 transition-colors mb-10"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> All tracks
      </Link>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* ── Main column ───────────────────────────────────────────────── */}
        <div className="lg:col-span-2">
          {/* Header */}
          <div className="mb-10">
            <div className="text-4xl mb-4">{track.icon}</div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-3">
              {track.title}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed">
              {track.tagline}
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {track.tags.map((tag) => (
                <Badge key={tag} variant="outline">{tag}</Badge>
              ))}
            </div>
          </div>

          <hr className="border-zinc-200 dark:border-zinc-800 mb-10" />

          {/* Track overview (MDX) */}
          <article className="prose max-w-none mb-16">{content}</article>

          {/* Courses in this track */}
          <div>
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-6">
              {roadmapMode ? "What's planned" : "Courses in this track"}
            </h2>
            {roadmapMode ? (
              <div className="space-y-3">
                <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-4">
                  This track&apos;s curriculum is being written. Here&apos;s the plan,
                  in order:
                </p>
                {track.roadmap!.map((item, i) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl"
                  >
                    <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                      {i + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-sm text-zinc-600 dark:text-zinc-300">
                          {item.title}
                        </p>
                        <Badge variant="outline">Coming soon</Badge>
                      </div>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                        {item.blurb}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : courses.length === 0 ? (
              <div className="text-center py-12 bg-zinc-50 dark:bg-zinc-900 border border-dashed border-zinc-200 dark:border-zinc-700 rounded-xl text-zinc-400">
                <BookOpen className="w-7 h-7 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Courses in development.</p>
                <p className="text-xs mt-1 text-zinc-300 dark:text-zinc-600">
                  Sign up to be notified when they launch.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {courses.map((course, i) => {
                  const available = isCourseAvailable(course);
                  const inner = (
                    <>
                      <div className="w-7 h-7 rounded-full bg-zinc-200 dark:bg-zinc-700 text-zinc-500 dark:text-zinc-400 flex items-center justify-center text-xs font-medium shrink-0 mt-0.5">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <p className={`font-medium text-sm ${available ? "text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" : "text-zinc-600 dark:text-zinc-300"}`}>
                            {course.title}
                          </p>
                          <Badge variant={available ? "green" : "outline"}>
                            {available ? "Available" : "Soon"}
                          </Badge>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                          {course.summary}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant={levelColor[course.level] ?? "default"}>
                            {course.level}
                          </Badge>
                          {course.lessonCount && (
                            <Badge variant="outline">{course.lessonCount} lessons</Badge>
                          )}
                        </div>
                      </div>
                      {available && (
                        <ChevronRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors shrink-0 mt-1" />
                      )}
                    </>
                  );

                  return available ? (
                    <Link
                      key={course.slug}
                      href={`/courses/${course.slug}`}
                      className="group flex items-start gap-4 p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
                    >
                      {inner}
                    </Link>
                  ) : (
                    <div
                      key={course.slug}
                      className="flex items-start gap-4 p-4 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl opacity-90"
                    >
                      {inner}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-6">
          {/* Prerequisites */}
          {prereqTracks.length > 0 && (
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                Complete first
              </p>
              <div className="space-y-2">
                {prereqTracks.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/learn/${t.slug}`}
                    className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <span>{t.icon}</span>
                    {t.title}
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Leads to */}
          {leadsToTracks.length > 0 && (
            <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
                This unlocks
              </p>
              <div className="space-y-2">
                {leadsToTracks.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/learn/${t.slug}`}
                    className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                  >
                    <span>{t.icon}</span>
                    {t.title}
                    <ArrowRight className="w-3 h-3 ml-auto" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="p-5 bg-zinc-900 dark:bg-zinc-800 rounded-xl text-white">
            <p className="text-xs font-medium text-zinc-400 mb-2">Stay updated</p>
            <p className="text-sm leading-relaxed mb-4">
              New courses are added regularly — more of this track is on the way.
            </p>
            {/* Contact disabled until backend is ready — restore <Link href="/contact"> to re-enable */}
            <span className="inline-flex items-center gap-1.5 text-sm text-zinc-500 cursor-not-allowed">
              Get in touch <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* All tracks */}
          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
              All tracks
            </p>
            <div className="space-y-1.5">
              {getTracks().map((t) => (
                <Link
                  key={t.slug}
                  href={`/learn/${t.slug}`}
                  className={`flex items-center gap-2 text-sm transition-colors rounded px-2 py-1 -mx-2 ${
                    t.slug === slug
                      ? "font-medium text-zinc-900 dark:text-zinc-100 bg-zinc-200/50 dark:bg-zinc-700/50"
                      : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  <span>{t.icon}</span>
                  {t.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
