import type { Metadata } from "next";
import Link from "next/link";
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
  Building2,
  Code2,
  Telescope,
  Zap,
  Cloud,
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
  title: "About — Pranav Srivastava",
  description:
    "Product thinkengineer. 15+ years across telecom, banking, automotive, and asset finance. Helped build the KPN developer portal from incubator to significant revenue. MSc AI, MTU Cork. Founder of Qubitsy and Wynoot. Netherlands.",
};

// type drives the colour + chip so education, career and founder chapters are
// visually distinct on one timeline instead of blurring together.
type ArcType = "origin" | "education" | "career" | "founder";

const arcStyle: Record<ArcType, { label: string; dot: string; chip: string }> = {
  origin: {
    label: "Origin",
    dot: "bg-zinc-400 dark:bg-zinc-500",
    chip: "text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800",
  },
  education: {
    label: "Education",
    dot: "bg-amber-500",
    chip: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30",
  },
  career: {
    label: "Career",
    dot: "bg-blue-500",
    chip: "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30",
  },
  founder: {
    label: "Founder",
    dot: "bg-emerald-500",
    chip: "text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30",
  },
};

const milestones: { year: string; type: ArcType; title: string; desc: string }[] = [
  {
    year: "2002",
    type: "origin",
    title: "First program, Jhansi",
    desc: "A DOS machine and an E. Balaguruswamy BASIC book with a black cover. Thirteen years old, hooked. Still remember the pages.",
  },
  {
    year: "2006–10",
    type: "education",
    title: "BE, Computer Engineering — Bhopal",
    desc: "Four years on the fundamentals everything since has been built on. Where you start matters less than how far the curiosity carries you.",
  },
  {
    year: "2010",
    type: "career",
    title: "First production role — Noida",
    desc: "Out of college and straight into real software: APIs, integrations, things that had to actually work for paying customers.",
  },
  {
    year: "2011",
    type: "career",
    title: "TCS — Ahmedabad, then Pune",
    desc: "Consulting across banking, automotive, and finance. Where he learned that every industry has its own constraints — and that the constraints are the interesting part.",
  },
  {
    year: "2014",
    type: "career",
    title: "Cognizant — Pune",
    desc: "Grew into senior engineering and integration architecture. Larger systems, higher stakes, multi-domain clients.",
  },
  {
    year: "2016",
    type: "career",
    title: "DLL — Eindhoven, Netherlands",
    desc: "Moved to the Netherlands for a role at DLL (De Lage Landen), the asset-finance arm of the Rabobank group, headquartered in Eindhoven. The assignment that turned into a life decision.",
  },
  {
    year: "2017",
    type: "career",
    title: "KPN — developer portal incubator",
    desc: "Joined a small internal incubator and helped grow developer.kpn.com from early idea to a revenue-generating product used by enterprises and SMBs.",
  },
  {
    year: "2019–21",
    type: "education",
    title: "MSc in Artificial Intelligence — MTU, Cork",
    desc: "A full Master's done alongside the day job and life abroad. Computer vision, knowledge representation, optimization. Thesis: reading student engagement from a webcam.",
  },
  {
    year: "2022",
    type: "founder",
    title: "Qubitsy + Gravitii",
    desc: "Founded the consulting studio. Started Gravitii — the product chapter that taught me, in detail, what market fit is not.",
  },
  {
    year: "2024",
    type: "founder",
    title: "Wynoot",
    desc: "Launched Wynoot with AI at the core. Same year he picked up skiing at 40 — both needed the same thing: showing up without excuses.",
  },
  {
    year: "Now",
    type: "founder",
    title: "Building in public",
    desc: "Architecting AI systems at scale by day, building Wynoot in parallel, writing and teaching in between. The itch is the same one from Jhansi.",
  },
];

const workAreas = [
  {
    icon: <Cpu className="w-4 h-4" />,
    label: "Applied AI systems",
    desc: "Agentic workflows, MCP servers, LLM orchestration, RAG, computer vision — AI that has to work in production.",
    color: "text-blue-500",
  },
  {
    icon: <Building2 className="w-4 h-4" />,
    label: "Enterprise integration",
    desc: "CPaaS, API management, fraud detection at volume, RCS, speech-to-text. MuleSoft, IBM DataPower, event-driven architecture at telecom scale.",
    color: "text-zinc-500",
  },
  {
    icon: <Cloud className="w-4 h-4" />,
    label: "Cloud & Serverless (AWS)",
    desc: "Lambda, DynamoDB, S3, Kinesis Firehose, EventBridge, Cognito — streaming data pipelines, event-driven systems, serverless APIs. SageMaker and Bedrock in the pipeline.",
    color: "text-orange-500",
  },
  {
    icon: <Code2 className="w-4 h-4" />,
    label: "API platforms",
    desc: "REST, GraphQL, event-driven design — from design through governance to developer experience. APIs as products, not plumbing.",
    color: "text-emerald-500",
  },
  {
    icon: <Telescope className="w-4 h-4" />,
    label: "Computer vision",
    desc: "Feature detection, optical flow, facial analysis, CNN classification. He built his MSc thesis on it — from pixels to meaning.",
    color: "text-purple-500",
  },
  {
    icon: <Zap className="w-4 h-4" />,
    label: "Metaheuristic optimization",
    desc: "Genetic algorithms, combinatorial search, scheduling under constraints. NP-hard problems that show up constantly in real product decisions.",
    color: "text-amber-500",
  },
  {
    icon: <GraduationCap className="w-4 h-4" />,
    label: "Teaching & writing",
    desc: "Courses on MCP, AI agents, and semantic search. Ebook in progress. He writes what he actually learns, not what sounds good.",
    color: "text-sky-500",
  },
];


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

      {/* ── The quick version ─────────────────────────────────────────────── */}
      <div className="mb-12 p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
        <p className="text-xs font-medium text-zinc-400 uppercase tracking-widest mb-4">
          The quick version
        </p>
        <div className="space-y-3 text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
          <p>
            He&apos;s a software engineer and product thinker with fifteen years
            building the systems businesses depend on — APIs, CPaaS, fraud
            detection, AI integration — across telecom, banking, automotive, and
            asset finance. He joined a small KPN incubator in 2017 and helped grow{" "}
            <a href="https://developer.kpn.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100">developer.kpn.com</a>
            {" "}into a revenue-generating enterprise product.
          </p>
          <p>
            He&apos;s also a founder, running{" "}
            <a href="https://wynoot.com" className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100">Wynoot</a>
            {" "}(an AI-powered platform for service businesses) and{" "}
            <a href="https://qubitsy.com" className="underline underline-offset-2 hover:text-zinc-900 dark:hover:text-zinc-100">Qubitsy</a>
            {" "}(a consulting studio). He did an MSc in AI in his 30s because
            algorithms were always the part he found genuinely interesting, not
            an add-on.
          </p>
          <p>
            He grew up in{" "}
            <Link href="/atlas/jhansi" className="text-cyan-600 dark:text-cyan-400 underline underline-offset-2 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
              Jhansi
            </Link>{" "}
            and wrote his first code at 13 on a DOS machine. An engineer since
            2010, in the Netherlands since 2016 — still building, still curious,
            and (recently) on ski slopes.
          </p>
        </div>
      </div>

      {/* ── The arc ───────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            The arc
          </h2>
          {/* Legend — so the colour coding reads at a glance */}
          <div className="flex flex-wrap gap-3 text-xs text-zinc-400">
            {(["education", "career", "founder"] as const).map((t) => (
              <span key={t} className="inline-flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${arcStyle[t].dot}`} />
                {arcStyle[t].label}
              </span>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-[52px] top-3 bottom-3 w-px bg-zinc-200 dark:bg-zinc-800" />
          <div className="space-y-6">
            {milestones.map((m) => (
              <div key={m.year + m.title} className="flex gap-4 items-start">
                <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500 w-12 shrink-0 pt-0.5 text-right">
                  {m.year}
                </span>
                <div
                  className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 z-10 ring-4 ring-white dark:ring-zinc-950 ${arcStyle[m.type].dot}`}
                />
                <div className="pb-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 leading-snug">
                      {m.title}
                    </p>
                    <span className={`text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-full ${arcStyle[m.type].chip}`}>
                      {arcStyle[m.type].label}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mt-0.5">
                    {m.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Selected impact ───────────────────────────────────────────────── */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          Selected impact
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Work that moved something — products, systems, or numbers
        </p>
        <div className="space-y-4">

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  KPN Developer Portal
                </p>
                <p className="text-xs text-zinc-400 mt-0.5">2017 → present · KPN · Product ownership</p>
              </div>
              <a
                href="https://developer.kpn.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 shrink-0"
              >
                developer.kpn.com ↗
              </a>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
              Joined a small internal incubator at KPN in 2017 with a mission
              to build a developer platform for enterprise communication APIs.
              Helped take it from early idea through MVP to a live product
              generating significant revenue — serving enterprises and SMBs
              with a full suite of production-grade CPaaS APIs.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["CPaaS", "SMS / RCS", "Speech-to-text", "Anti-fraud APIs", "API management", "Lambda", "DynamoDB", "Kinesis Firehose", "EventBridge", "Cognito", "SDK distribution", "Developer experience"].map((t) => (
                <span key={t} className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="mb-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Anti-fraud API systems
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">Telecom scale · Applied AI + systems engineering</p>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
              Designed and built API-driven fraud detection systems operating
              at telecom scale — where volume is real, latency matters, and
              false positives cost money. The intersection of domain knowledge,
              AI, and production engineering that he finds most interesting.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Fraud detection", "High-volume APIs", "AI systems", "Real-time signals", "Telecom scale"].map((t) => (
                <span key={t} className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="mb-2">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                Enterprise integration, six domains
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">TCS · Cognizant · KPN · 2010 → present</p>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
              Across fifteen years and several companies, he has built integration
              systems for automotive, banking, asset finance, financial
              services, and telecom. Different industries, different
              constraints, same underlying discipline: well-designed APIs and
              reliable systems that communicate clearly.
            </p>
            <div className="flex flex-wrap gap-1.5">
              {["Telecom", "Banking", "Automotive", "Asset finance", "Financial services", "MuleSoft", "IBM DataPower"].map((t) => (
                <span key={t} className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ── How I think about products ────────────────────────────────────── */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
          How he thinks about products
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          Three moments that show the product thinking more than any job title could
        </p>
        <div className="space-y-4">

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5 shrink-0">🔌</span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  The developer who is your user
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  At KPN, his team had a working SMS API with growing adoption —
                  and growing support tickets at the same rate. Developers kept
                  hitting the same errors and not understanding them. The
                  response codes were technically correct:
                  {" "}<code className="text-xs bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">ERR_429_RATE_LIMIT_EXCEEDED</code>.
                  But they said nothing about why it happened, what triggered
                  it, or how to fix it. They spent one sprint rewriting every
                  error response — plain English, probable cause, suggested
                  remedy. Support volume dropped. Adoption continued growing.
                  That is product thinking inside API design: the developer
                  calling your endpoint is your user, and their confusion is
                  your bug.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5 shrink-0">🎯</span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  The threshold is a product decision, not a technical one
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Building anti-fraud systems at telecom scale, the hardest
                  decision is never the algorithm. It is the detection
                  threshold. Too sensitive and legitimate businesses get blocked
                  mid-campaign, call in angry, and churn. Too permissive and
                  fraudulent traffic slips through, erodes platform trust, and
                  attracts regulatory attention. Both failure modes have real
                  business costs — different kinds, different stakeholders.
                  Setting the dial requires modelling the cost of each mistake,
                  not just optimising precision and recall on a test set. The
                  model serves the business outcome. That order matters.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-start gap-3">
              <span className="text-lg mt-0.5 shrink-0">📅</span>
              <div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                  Show availability first, ask for payment second
                </p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  Early Wynoot booking flow: collect contact details and
                  payment preference, then show available time slots. Logical
                  from a data-collection perspective. Wrong from a user
                  perspective. People want to know if Thursday 6pm is available
                  before they commit to anything. He flipped the order —
                  availability first, payment last. Not a single line of
                  business logic changed. The technology was identical. The
                  product decision changed the outcome. This is the one he
                  thinks about most when someone says a feature is not
                  working: is it engineering, or is it sequencing?
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ── What I work on ────────────────────────────────────────────────── */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          What he works on
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {workAreas.map((item) => (
            <div
              key={item.label}
              className="p-4 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
            >
              <span className={`${item.color} mb-2 block`}>{item.icon}</span>
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

      {/* ── MSc research interests ────────────────────────────────────────── */}
      <div className="mb-12">
        <div className="flex items-start justify-between mb-1">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            MSc in AI — research interests
          </h2>
          <Link
            href="/about/research"
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline shrink-0"
          >
            The technical deep dive →
          </Link>
        </div>
        <p className="text-xs text-zinc-400 mb-4">
          MTU Cork, Ireland · 2019–2021
        </p>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6 max-w-2xl">
          These are the areas he studied during his Master&apos;s — and the real
          problems he keeps mapping them onto. Each is written in plain
          language, with a concrete example, because the idea matters more than
          the jargon.
        </p>

        <div className="space-y-4">
          {depthAreas.map((a) => (
            <div
              key={a.title}
              className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${a.chip}`}>
                  {a.icon}
                </div>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-snug">
                  {a.title}
                </p>
                {a.tag && (
                  <span className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-full ml-auto shrink-0">
                    {a.tag}
                  </span>
                )}
              </div>

              <div className={`rounded-lg border px-3.5 py-3 mb-3 ${a.plain}`}>
                <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  In plain words
                </p>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                  {a.plainWords}
                </p>
              </div>

              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed mb-3">
                {a.ground}
              </p>

              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-2">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">What he did — </span>
                {a.mine}
              </p>

              <Link
                href={a.href}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                The technical version →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-5 text-center">
          <Link
            href="/about/research"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 rounded-full hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors"
          >
            See how each one actually works <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Companies ─────────────────────────────────────────────────────── */}
      <div className="mb-12">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-4">
          Companies &amp; products
        </h2>
        <div className="space-y-3">
          {[
            {
              name: "Qubitsy",
              url: "https://qubitsy.com",
              role: "Founder · Consulting & R&D studio",
              desc: "He helps engineering teams take AI from experiment to production — agent architecture, API design, cloud integration, and the observability layer that tells you when something breaks. Fifteen years of enterprise context, startup mindset.",
            },
            {
              name: "Wynoot",
              url: "https://wynoot.com",
              role: "Co-founder · AI-powered platform",
              desc: "Booking, calendar, no-code workflows, and LMS — built for service businesses, solopreneurs, and coaches. AI use cases in active development and pilot. Started from a problem that kept showing up.",
            },
          ].map((co) => (
            <div
              key={co.name}
              className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-xl"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm">
                    {co.name}
                  </p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {co.role}
                  </p>
                </div>
                <a
                  href={co.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 shrink-0"
                >
                  {co.url.replace("https://", "")} ↗
                </a>
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {co.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Beyond the code ───────────────────────────────────────────────── */}
      <div className="mb-12" id="beyond">
        <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Beyond the code
        </h2>
        <p className="text-xs text-zinc-400 mb-6">
          The stuff that does not go on a CV but shapes how he thinks — and, for
          this part, in his own words
        </p>

        <blockquote className="text-base font-medium text-zinc-700 dark:text-zinc-300 border-l-2 border-blue-500 pl-4 mb-8 italic leading-relaxed">
          &ldquo;I genuinely believe anyone can learn anything. Not as a motivational
          poster thing — as something I have proved to myself repeatedly.
          Skiing at 40 was the latest experiment.&rdquo;
        </blockquote>

        <div className="grid sm:grid-cols-2 gap-4 mb-6">
          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Mountain className="w-4 h-4 text-sky-500" />
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Ski slopes</p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Picked up skiing in 2024 with zero prior experience and full
              determination. Two complete seasons, four trips, genuine
              technique improvement. Even recorded a podcast episode mid-run
              from a slope — because why not. Then he convinced his wife and son
              to try it. They are catching up fast.
            </p>
          </div>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Globe className="w-4 h-4 text-emerald-500" />
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Explorer at heart</p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Travel, camping, history, local culture — the more unfamiliar,
              the better. Moving from Jhansi to Bhopal to Noida to Eindhoven
              to the Netherlands was not accidental. He likes new constraints.
              They make you figure things out differently.
            </p>
          </div>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Sport & fast learning</p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Grew up playing badminton and table tennis in Jhansi. Picked up
              tennis in the Netherlands in 2021 with coaching — took time to
              click, but clicked. Sport taught him patience with the
              learning curve, which translates directly to how he approaches new
              technology.
            </p>
          </div>

          <div className="p-5 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <Mic2 className="w-4 h-4 text-purple-500" />
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">Teaching & podcasting</p>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              He advises and motivates people more than he talks about it. The
              instinct comes from growing up with a teacher for a mum — she
              shaped how he explains things. He records occasional podcast
              episodes, writes courses, and gives people the honest version of
              what it takes to build real skills.
            </p>
          </div>
        </div>

        {/* Family section */}
        <div className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-gradient-to-br from-zinc-50 to-white dark:from-zinc-900 dark:to-zinc-900">
          <div className="flex items-center gap-2 mb-3">
            <Heart className="w-4 h-4 text-rose-400" />
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              The foundation
            </p>
          </div>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
            His mum is a retired teacher — the powerhouse of the house. She
            shaped how he thinks about learning, sharing, and patience. His dad
            is a scientist turned banker — the solid rock. Between the two of
            them he got curiosity and groundedness. His wife completed her
            Masters around the same time he did — she knows what that chapter
            looks like from the inside. His son is now on the ski slopes too.
            The explorer gene passes on.
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
