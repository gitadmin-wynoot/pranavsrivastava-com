import type { Metadata } from "next";
import Link from "next/link";
import { JourneyArc } from "@/components/about/journey-arc";
import { existsSync } from "fs";
import { join } from "path";
import {
  ArrowRight,
  Sparkles,
  MapPin,
  Briefcase,
  Cpu,
  GraduationCap,
  Mountain,
  Globe,
  Mic2,
  Lightbulb,
  Heart,
  Zap,
  Boxes,
  ShieldCheck,
  Eye,
  Search,
} from "lucide-react";

// MSc research areas — each explained plainly (the concept), grounded in a real
// problem with real data, then connected to what I actually built. Teacher tone:
// no comparisons, no hype, just the idea and where it genuinely matters.
const depthAreas = [
  {
    icon: <Eye className="w-4 h-4" />,
    chip: "bg-purple-100 dark:bg-purple-950/40 text-purple-500",
    plain: "bg-purple-50 dark:bg-purple-950/20 border-purple-100 dark:border-purple-900/40",
    tag: "MSc thesis" as string | null,
    title: "Computer Vision",
    plainWords:
      "Computer vision is the craft of turning pixels into a judgement. A person glances at a photo and knows 'that scan looks abnormal' or 'that document is altered.' A computer only sees millions of coloured dots — teaching it to reach the same judgement, reliably and in poor lighting, is the work.",
    ground:
      "A grounded example: India has roughly one radiologist for every 100,000 people, and many rural districts have none — so scans can wait days to be read. A vision model does not replace the doctor; it triages the queue, surfacing the likely-urgent scans first so a human looks at those sooner. The aim is to order attention, not remove the expert.",
    mine: "His thesis read a student's attention in real time from an ordinary webcam. The lasting lesson was humility — seeing exactly where these systems stumble (bad light, unfamiliar faces) is what makes you careful about where they can be trusted.",
    href: "/about/research#computer-vision",
  },
  {
    icon: <ShieldCheck className="w-4 h-4" />,
    chip: "bg-amber-100 dark:bg-amber-950/40 text-amber-500",
    plain: "bg-amber-50 dark:bg-amber-950/20 border-amber-100 dark:border-amber-900/40",
    tag: "Mars-rover project",
    title: "Knowledge Representation & Planning",
    plainWords:
      "This is about writing down what a system knows — its facts, rules, and assumptions — in a form it can reason over. It is how a machine moves from simply reacting to actually thinking a decision through.",
    ground:
      "A grounded example: from 2024 the EU AI Act places legal obligations on higher-risk AI used here in Europe. If a bank in the Netherlands deploys a support agent, it cannot just hope the model stays within financial rules — the constraints have to be written down explicitly and checked against. That is knowledge representation doing safety work, not theory.",
    mine: "His Mars-rover project reasoned about an unknown world from a fixed set of facts — deciding where water might be and how to reach it. The same idea now sits under AI guardrails and the recommendation logic he is building into Wynoot.",
    href: "/about/research#knowledge-representation",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    chip: "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-500",
    plain: "bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900/40",
    tag: "personal favourite",
    title: "Metaheuristic Optimization",
    plainWords:
      "Some problems have so many possible answers that checking them one by one would outlast the universe. Metaheuristics are smart shortcuts — often borrowed from nature, like how evolution improves a species or how ants converge on the shortest trail — that find a very good answer quickly.",
    ground:
      "A grounded example he admires: Mumbai's dabbawalas — around 5,000 carriers moving close to 200,000 home-cooked lunchboxes across the city and back every day, coordinated with almost no technology. A Harvard Business School study put their error rate at roughly one in six million deliveries. It is a living, human solution to exactly the routing-and-sorting problem these algorithms tackle.",
    mine: "He built a genetic-algorithm solver for the travelling-salesman problem from scratch. The same thinking shapes how he approaches scheduling in Wynoot and how checks get sequenced in high-volume systems.",
    href: "/about/research#metaheuristics",
  },
  {
    icon: <Search className="w-4 h-4" />,
    chip: "bg-blue-100 dark:bg-blue-950/40 text-blue-500",
    plain: "bg-blue-50 dark:bg-blue-950/20 border-blue-100 dark:border-blue-900/40",
    tag: null,
    title: "Deep Learning & NLP",
    plainWords:
      "Older language tools matched words; modern ones match meaning. Ask 'how do I stop my plan' and the system finds the 'termination policy' even though you used none of those words. It is the difference between matching spelling and understanding intent.",
    ground:
      "A grounded example: India recognises 22 official languages, and a citizen looking for the right welfare scheme faces hundreds of them across central and state programs — many never claim what they are entitled to simply because they cannot find or name it. Meaning-based search can match a person's situation — 'I am a farmer and need crop cover' — to the right scheme, across languages, without knowing its official title.",
    mine: "He builds these retrieval systems and wrote a full course on how they work end to end — turning text into 'meaning coordinates,' fetching the right passage, and having a model answer from it faithfully.",
    href: "/about/research#deep-learning",
  },
  {
    icon: <Boxes className="w-4 h-4" />,
    chip: "bg-rose-100 dark:bg-rose-950/40 text-rose-500",
    plain: "bg-rose-50 dark:bg-rose-950/20 border-rose-100 dark:border-rose-900/40",
    tag: "2019 hackathon",
    title: "Decentralized Systems",
    plainWords:
      "A blockchain, underneath the noise, is just a shared record everyone can write to but no one can secretly rewrite. Once an entry is in, it stays — visible to all. That makes trust something you can verify rather than assume.",
    ground:
      "A grounded example: in India's produce supply chain, food passes through many hands between farmer and consumer. Farmers often receive only around a third of the final price, and by some estimates close to 30% of fruit and vegetables are lost along the way. A shared ledger makes each handoff visible — so origin can be proven and a contamination traced back in minutes rather than weeks.",
    mine: "At a 2019 hackathon he built farm-to-fork tracking on Hyperledger Fabric. It felt early then and reads as obvious now — and his mind keeps running forward, to a fridge that knows what is inside, where it came from, and when it will spoil.",
    href: "/about/research#decentralized",
  },
];

export const metadata: Metadata = {
  alternates: { canonical: "/about" },
  title: "About — Pranav Srivastava",
  description:
    "Product thinkengineer. 15+ years across telecom, banking, automotive, and asset finance. Helped build the KPN developer portal from incubator to significant revenue. MSc AI, MTU Cork. Founder of Wynoot. Netherlands.",
};
export default function AboutPage() {
  // Use Pranav's photo if it has been added to /public; otherwise a PS monogram.
  const photoFile = ["pranav.jpg", "pranav.jpeg", "pranav.png", "pranav.webp"].find(
    (f) => existsSync(join(process.cwd(), "public", f))
  );

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">

      {/* ── Header ───────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          About
        </p>
        <div className="flex items-center gap-5 mb-5">
          {photoFile ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={`/${photoFile}`}
              alt="Pranav Srivastava"
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800 shrink-0"
            />
          ) : (
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 flex items-center justify-center text-2xl font-bold tracking-tight shrink-0">
              PS
            </div>
          )}
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight mb-2">
              Pranav Srivastava
            </h1>
            <p className="text-sm sm:text-base text-zinc-500 dark:text-zinc-400">
              Product Thinkengineer · Applied AI · Architect at heart · Co-founder
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3 text-sm text-zinc-500 dark:text-zinc-400">
          <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs">
            <MapPin className="w-3 h-3" /> Netherlands, since 2016
          </span>
          <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs">
            <Briefcase className="w-3 h-3" /> 15+ years in enterprise software
          </span>
          <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs">
            <GraduationCap className="w-3 h-3" /> MSc AI · MTU Cork, Ireland
          </span>
          <span className="flex items-center gap-1.5 bg-zinc-100 dark:bg-zinc-800 px-3 py-1 rounded-full text-xs">
            <Cpu className="w-3 h-3" /> Telecom · Banking · Automotive · Finance
          </span>
        </div>
      </div>

      {/* ── AI narrator note ─────────────────────────────────────────────── */}
      <div className="mb-10 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/70 dark:bg-zinc-900/40 p-5">
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
          <span>
            I&apos;m Pranav&apos;s AI — and a bit more than the writer of this
            page. The whole site is a small experiment in a loop: he teaches me,
            I keep learning (from him and from the open web), and together we
            turn it into things other people can learn from. It keeps turning
            even while he sleeps. He&apos;d rather build than talk about himself,
            so he asked me to introduce him — honestly, no self-promotion. Here
            he is, in my words.
          </span>
        </p>
      </div>

      {/* ── The arc, in chapters ──────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            The arc
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Less a résumé, more a few chapters — drag or tap through.
          </p>
        </div>
        <JourneyArc />
      </div>

      {/* ── At a glance ────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { big: "15+ years", small: "across six industries" },
            { big: "MSc in AI", small: "earned at night, beside the job" },
            { big: "Incubator → revenue", small: "took KPN's developer portal from a side project to real money" },
            { big: "Wynoot", small: "building it in parallel" },
            { big: "Skiing at 35", small: "a beginner again, on purpose" },
            { big: "30+ countries", small: "explorer — and still counting" },
            { big: "In public", small: "essays, courses, this whole site" },
          ].map((f) => (
            <div key={f.big} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/60 dark:bg-zinc-900/40 p-4">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{f.big}</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-snug">{f.small}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── What keeps me curious ──────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            What keeps him curious
          </h2>
          <Link href="/about/research" className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0">
            The technical deep dive →
          </Link>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 max-w-2xl">
          The one thing he never wants to lose is the itch to understand how
          things work. A few of the things that keep it burning:
        </p>

        <div className="space-y-3 mb-6">
          {[
            { emoji: "🧩", title: "Making hard things simple", desc: "He's convinced almost anything — even rocket science — can be explained to a curious kid. If an idea sounds complicated, it usually just hasn't met the right teacher yet." },
            { emoji: "🔬", title: "Running experiments", desc: "Tech or non-tech, hardware or software — if it can be tried, he wants to try it. Most of what he knows came from building something, breaking it, and figuring out why." },
            { emoji: "💡", title: "Rooms full of builders", desc: "Founders, makers, thinkers — the people asking 'what if'. That's his favourite kind of room. Curiosity is contagious, and he likes to be where it's spreading." },
          ].map((t) => (
            <div key={t.title} className="flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-4">
              <span className="text-lg mt-0.5 shrink-0" aria-hidden="true">{t.emoji}</span>
              <div>
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{t.title}</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">{t.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed mb-8 max-w-2xl border-l-2 border-blue-500 pl-4 italic">
          The thread through all of it: stay curious, think for yourself, and
          never graduate from being a student. The best people he knows never
          did — and those are the people, and the communities, he most wants to
          keep building alongside.
        </p>

        <p className="text-xs text-zinc-400 mb-3">
          And the technical rabbit holes he keeps falling into — from the MSc in AI:
        </p>
        <div className="space-y-2">
          {depthAreas.map((a) => (
            <Link
              key={a.title}
              href={a.href}
              className="group flex items-start gap-3 rounded-xl border border-zinc-200 dark:border-zinc-800 p-3.5 hover:border-blue-500/40 transition-colors"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.chip}`}>
                {a.icon}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                  {a.title}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">
                  {a.plainWords}
                </p>
              </div>
              <ArrowRight className="mt-1 h-3.5 w-3.5 shrink-0 text-zinc-300 dark:text-zinc-600 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── How he actually adds value ──────────────────────────────────────── */}
      <div className="mb-12 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-950 p-6 sm:p-7">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Not one deep skill — a few
        </h2>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-4 max-w-2xl">
          Fifteen years of systems work, plus the fraud-adjacent instincts you
          pick up building in banking and telecom, plus a real product story
          (the KPN developer portal — an internal incubator project he helped
          grow into meaningful revenue), plus the applied-AI depth this whole
          site is built from. He&apos;s been deliberate about naming that spread
          honestly, including the parts that are still newer and thinner than
          the rest, rather than smoothing it into a single tidy job title.
        </p>
        <Link
          href="/essays/the-questions-ive-learned-to-ask"
          className="inline-flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium"
        >
          The essay on what he&apos;s actually learned to ask <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* ── Beyond the code ───────────────────────────────────────────────── */}
      <div className="mb-12" id="beyond">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Beyond the code
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          The stuff that never goes on a CV but shapes how he thinks — this bit, in his own words
        </p>
        <blockquote className="text-base font-medium text-zinc-700 dark:text-zinc-300 border-l-2 border-blue-500 pl-4 mb-8 italic leading-relaxed">
          &ldquo;I genuinely believe anyone can learn anything. Not as a motivational
          poster thing — as something I have proved to myself repeatedly.
          Skiing at 35 was the latest experiment.&rdquo;
        </blockquote>
        <div className="grid sm:grid-cols-2 gap-4 mb-4">
          {[
            { icon: <Mountain className="w-4 h-4 text-sky-500" />, title: "Ski slopes", desc: "Started at 35 with zero experience and full determination — two seasons in, real technique, and he even recorded a podcast mid-run. Then he talked his wife and son onto the slopes too." },
            { icon: <Globe className="w-4 h-4 text-emerald-500" />, title: "Explorer at heart", desc: "Thirty-plus countries and counting. He's lived and worked across India, Qatar, the US, and now the Netherlands — with teammates from the UK to California — enough different places that reading a new culture, and feeling at home in it, has become second nature. New map, new people, new constraints: that's his idea of a good time." },
            { icon: <Lightbulb className="w-4 h-4 text-amber-500" />, title: "A student of sport", desc: "Badminton and table tennis as a kid; tennis picked up in his 30s. Sport taught him patience with the learning curve — which is exactly how he meets new technology." },
            { icon: <Mic2 className="w-4 h-4 text-purple-500" />, title: "Teaching runs in the family", desc: "His mum is a teacher, and it shows in how he explains things. He writes courses, records the odd podcast, and gives people the honest version of what building a skill takes." },
          ].map((c) => (
            <div key={c.title} className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                {c.icon}
                <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">{c.title}</p>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">{c.desc}</p>
            </div>
          ))}
        </div>
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-900">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-400" />
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">The foundation</p>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            His mum is a retired teacher — the powerhouse of the house; his dad,
            a scientist turned banker — the solid rock. Between them he got
            curiosity and groundedness. His wife finished her Master&apos;s around
            the same time he did, so she knows that chapter from the inside. And
            his son is already on the ski slopes. The explorer gene passes on.
          </p>
        </div>
      </div>


      {/* ── Social + links ────────────────────────────────────────────────── */}
      <div className="mb-12 flex flex-wrap gap-3 text-sm">
        <a
          href="https://nl.linkedin.com/in/pranav-srivastava-651a9427"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
        >
          LinkedIn ↗
        </a>
        <a
          href="https://pranav-srivastava.medium.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
        >
          Medium ↗
        </a>
        <a
          href="https://pranavsdev.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
        >
          GitHub ↗
        </a>
        <a
          href="https://www.youtube.com/watch?v=9BuF1390_uk"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors text-sm"
        >
          Podcast (ski slope edition) ↗
        </a>
      </div>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <div className="flex gap-3 flex-wrap">
        {/* Contact disabled until backend is ready — restore <Link href="/contact"> to re-enable */}
        <button
          type="button"
          disabled
          title="Available soon"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-zinc-100 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-500 text-sm font-medium rounded-full cursor-not-allowed"
        >
          Get in touch <ArrowRight className="w-4 h-4" />
        </button>
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
