import type { Metadata } from "next";
import { Code2, Briefcase, Mail, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch for consulting, collaboration, or just to say hello.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
      <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
        Contact
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
        Let&apos;s talk.
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 text-lg leading-relaxed mb-12">
        Whether you need help with AI architecture, cloud design, API platforms,
        or want to discuss a project idea — I am happy to have a conversation.
      </p>

      {/* Contact options */}
      <div className="space-y-4 mb-12">
        <a
          href="mailto:hello@pranavsrivastava.com"
          className="group flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              Email
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              hello@pranavsrivastava.com
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
        </a>

        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center shrink-0">
            <Briefcase className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              LinkedIn
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Connect professionally
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
        </a>

        <a
          href="https://github.com"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-4 p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl hover:border-blue-500/30 hover:shadow-sm transition-all"
        >
          <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 rounded-lg flex items-center justify-center shrink-0">
            <Code2 className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm text-zinc-900 dark:text-zinc-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              GitHub
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              See what I&apos;m building
            </p>
          </div>
          <ArrowRight className="w-4 h-4 text-zinc-300 dark:text-zinc-600 group-hover:text-blue-500 transition-colors" />
        </a>
      </div>

      {/* Consulting context */}
      <div className="p-6 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">
          Consulting via Qubitsy
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-1">
          Looking for architectural help, a technical discovery session, or
          hands-on engineering support?
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
          I work through{" "}
          <a
            href="https://qubitsy.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            Qubitsy
          </a>
          , my AI, cloud and API engineering studio. Let&apos;s talk about what
          you are trying to build.
        </p>
      </div>
    </div>
  );
}
