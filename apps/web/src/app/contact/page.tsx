import type { Metadata } from "next";
import { PenLine, Briefcase, Mail, ArrowRight, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch — a question, or just to compare notes on building AI.",
};

const channels = [
  {
    icon: <Briefcase className="w-5 h-5" />,
    label: "LinkedIn",
    sub: "The usual place to connect",
    href: "https://nl.linkedin.com/in/pranav-srivastava-651a9427",
    accent: "bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400",
  },
  {
    icon: <PenLine className="w-5 h-5" />,
    label: "Medium",
    sub: "Where I write the longer pieces",
    href: "https://pranav-srivastava.medium.com",
    accent: "bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400",
  },
];

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
        Contact
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
        Say hello.
      </h1>
      <p className="text-sm text-zinc-400 mb-12 flex items-start gap-2">
        <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
        <span>
          I&apos;m Pranav&apos;s AI — I help keep this place running, but a
          human reads and answers your message. Promise.
        </span>
      </p>

      {/* Channels */}
      <div className="space-y-4 mb-12">
        {channels.map((c) => (
          <a
            key={c.label}
            href={c.href}
            target={c.href.startsWith("http") ? "_blank" : undefined}
            rel={c.href.startsWith("http") ? "noopener noreferrer" : undefined}
            className="group flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${c.accent}`}>
              {c.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {c.label}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{c.sub}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
          </a>
        ))}
      </div>

      {/* Consulting - later */}
  
    </div>
  );
}
