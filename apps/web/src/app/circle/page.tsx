import type { Metadata } from "next";
import { CircleInvite } from "@/components/circle-invite";

export const metadata: Metadata = {
  title: "The Circle",
  description:
    "A small, invitation-only circle of people building with AI in and around Eindhoven — founders, builders, and senior engineers. By request.",
};

export default function CirclePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-20">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
        By invitation
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight leading-tight mb-6">
        A small circle of people building with AI, in Eindhoven.
      </h1>

      <div className="space-y-5 text-[15px] text-zinc-600 dark:text-zinc-300 leading-relaxed">
        <p>
          Brainport has remarkable density of engineering and deep-tech talent,
          and not many rooms where the people actually building with AI sit
          across a table from each other. This is an attempt at one of those
          rooms.
        </p>
        <p>
          It is small on purpose — a handful of founders, builders, and senior
          engineers who are doing the real work, meeting a few times a year over
          dinner. No stage, no pitching, no audience. Just good conversation
          about what is actually working, what is not, and what is worth our
          attention next.
        </p>
      </div>

      {/* Who's in the room */}
      <div className="mt-10 grid sm:grid-cols-2 gap-3">
        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            Who tends to fit
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Founders and builders shipping AI products, and senior engineers or
            tech leaders putting AI into production. A curated mix — the
            cross-pollination is the point.
          </p>
        </div>
        <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
            How it works
          </p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            Invite-only, kept deliberately small. A few seats open each season.
            Request below; if it is a fit, I will reach out personally.
          </p>
        </div>
      </div>

      {/* Request */}
      <div className="mt-12 pt-10 border-t border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Request an invite
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-5">
          No commitment, no spam. I read every one myself.
        </p>
        <CircleInvite />
      </div>
    </div>
  );
}
