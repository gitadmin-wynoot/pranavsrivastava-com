import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, MapPin, Briefcase, Cpu, GraduationCap } from "lucide-react";

export const metadata: Metadata = {
  title: "About",
  description:
    "AI, Cloud & API Architect. MSc in AI from MTU Cork. 14+ years building software across telecoms, financial services, and enterprise integration. Netherlands-based. Founder of Qubitsy and Wynoot.",
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          About
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-4">
          Pranav Srivastava
        </h1>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5" /> Netherlands
          </span>
          <span className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" /> 14+ years in software
          </span>
          <span className="flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5" /> MSc AI · MTU Cork
          </span>
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5" /> AI · Cloud · APIs
          </span>
        </div>
      </div>

      {/* Main intro */}
      <div className="prose max-w-none mb-12 space-y-4 text-zinc-600 dark:text-zinc-300 text-[15px] leading-relaxed">
        <p>
          I am a software engineer and architect with 14+ years of experience
          across APIs, cloud platforms, enterprise integration, and AI systems.
          Originally from India, currently based in the Netherlands.
        </p>
        <p>
          My career began in enterprise Java and gradually shifted into
          integration architecture — building API platforms and data pipelines
          across telecoms and financial services using technologies like IBM
          WebSphere DataPower and MuleSoft Anypoint. That work gave me a deep
          appreciation for well-designed systems that communicate clearly and
          fail gracefully.
        </p>
        <p>
          In recent years I pivoted fully into AI. I completed a{" "}
          <strong className="text-zinc-900 dark:text-zinc-100">
            Master of Science in Artificial Intelligence at Munster Technological
            University (MTU), Cork, Ireland
          </strong>{" "}
          — where I studied machine learning, deep learning, natural language
          processing, computer vision, knowledge graphs, metaheuristic
          optimisation, and data engineering. My thesis focused on{" "}
          <em>student engagement detection using facial expression analysis</em>
          — a real-time computer vision system built on top of OpenFace 2.0
          that infers engagement levels from head pose, gaze direction, and
          facial action units.
        </p>
        <p>
          I care about AI systems that are practical, observable, and built to
          last. I am not interested in demos — I want systems that run
          reliably and improve over time. This site is my public workshop for
          that.
        </p>
      </div>

      {/* MSc research highlights */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          MSc project highlights
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              label: "Student engagement detection",
              desc: "MSc thesis. Real-time CV system using OpenFace 2.0 — head pose, gaze, and facial action units to infer engagement levels.",
              tag: "Computer Vision",
            },
            {
              label: "TSP with genetic algorithms",
              desc: "Solved the Travelling Salesman Problem using evolutionary computation with custom permutation crossover operators.",
              tag: "Metaheuristics",
            },
            {
              label: "Scene reconstruction with KLT",
              desc: "3D scene reconstruction from image sequences using optical flow tracking and camera calibration via checkerboard patterns.",
              tag: "Computer Vision",
            },
            {
              label: "Personality-based chatbot",
              desc: "NLP chatbot with intent classification and speech-to-text input, personality-driven response generation.",
              tag: "NLP",
            },
            {
              label: "Flower CNN classifier",
              desc: "Image classification with CNNs and transfer learning — comparing training from scratch vs. fine-tuning pre-trained models.",
              tag: "Deep Learning",
            },
            {
              label: "Feature point detection",
              desc: "SIFT-inspired feature descriptor pipeline: interest point detection, orientation assignment, and matching across image pairs.",
              tag: "Computer Vision",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                  {item.label}
                </p>
                <span className="shrink-0 text-[10px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded-full">
                  {item.tag}
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* What I work on */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          What I work on
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            {
              label: "AI systems & agents",
              desc: "Agentic workflows, MCP servers, LLM orchestration, observability with LangGraph and Langfuse",
            },
            {
              label: "API platforms",
              desc: "REST, GraphQL, event-driven design — enterprise integration with MuleSoft and IBM DataPower",
            },
            {
              label: "Cloud architecture",
              desc: "AWS serverless, ECS, Lambda, API Gateway, infrastructure as code",
            },
            {
              label: "Computer vision",
              desc: "Feature detection, tracking, facial analysis, CNN-based classification and detection",
            },
            {
              label: "NLP & LLMs",
              desc: "From embeddings to fine-tuning to prompt engineering and RAG systems",
            },
            {
              label: "Learning in public",
              desc: "Structured courses grounded in MSc fundamentals and real enterprise experience",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
            >
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                {item.label}
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Companies */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Companies &amp; products
        </h2>
        <div className="space-y-4">
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                Qubitsy
              </p>
              <a
                href="https://qubitsy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                qubitsy.com ↗
              </a>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              My consulting and R&amp;D studio. I help teams design AI
              workflows, cloud architectures, API platforms, and automation
              systems. Practical focus, measurable outcomes.
            </p>
          </div>
          <div className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                Wynoot
              </p>
              <a
                href="https://wynoot.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                wynoot.com ↗
              </a>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              A SaaS product for small businesses, solopreneurs, creators, and
              service providers. Website, booking, and automation in one place.
            </p>
          </div>
        </div>
      </div>

      {/* Social */}
      <div className="mb-12 flex flex-wrap gap-3 text-sm">
        <a
          href="https://nl.linkedin.com/in/pranav-srivastava-651a9427"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          LinkedIn ↗
        </a>
        <a
          href="https://pranavsdev.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          GitHub projects ↗
        </a>
      </div>

      {/* CTA */}
      <div className="flex gap-3 flex-wrap">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-sm font-medium rounded-full hover:bg-zinc-700 dark:hover:bg-zinc-300 transition-colors"
        >
          Get in touch <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/learn"
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-sm font-medium rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
        >
          Explore learning tracks
        </Link>
      </div>
    </div>
  );
}
