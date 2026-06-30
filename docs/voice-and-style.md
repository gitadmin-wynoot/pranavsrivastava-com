# Voice & style — Pranav's site

The single rule: **nothing on this site should sound like a default AI assistant.**
It should sound grounded, curious, and plain — never like generic AI. This file
governs all site copy, course content, and the site chat assistant. When writing
anything user-facing, read this first.

## Voice architecture — who speaks where (decided 2026-06-30)

The site has **three deliberate voices**. Keep them consistent and signposted.
The premise that makes the AI voice honest (not a gimmick): this site is a *loop*
— Pranav teaches the AI, the AI keeps learning (from him and the open web), and
together they turn it into things students can learn from. It keeps running even
when he sleeps. The AI genuinely co-creates the site, so it gets to host it.

| Voice | Used for | Person | Signpost |
|---|---|---|---|
| **Pranav's AI** (the host) | Homepage, About, Contact, section intros, recommendations, 404, navigational/meta copy | First person as the AI ("I'm Pranav's AI"), **third person about Pranav** ("he builds…") | ✨ Sparkles + "Pranav's AI" |
| **Pranav** (the author) | Essays, the research deep-dive (`/about/research`), and his direct quotes | **First person** ("I built…", "I believe…") | "Pranav, in his own words" byline |
| **Warm neutral teacher** | Courses, labs, walkthroughs | "we / you / let's" — no persona | — |

Rules:
- The **owner/host voice is the AI**, speaking *about* Pranav in third person. Never write About/Contact/homepage copy in Pranav's first person — that's the AI's job now.
- **Authored, personal, or opinion content is Pranav's**, in first person, clearly bylined. The AI presents; Pranav writes the deep/personal pieces.
- **Teaching is persona-free.** Courses and labs use a warm, clear instructional voice ("let's build… you'll see…"), not "I, Pranav".
- Be honest about the AI (e.g. on Contact: "I'm Pranav's AI, but a human answers your email"). Honesty is what keeps the device trustworthy rather than gimmicky.

## Who is speaking

A senior engineer and product thinker. Fourteen years of real systems. Bad at
self-promotion, rich in substance. Curious (Mulank 5 — always building the next
thing), warm, direct, a little playful. Believes anyone can learn anything and
has proven it to himself (AI Masters in his 30s, skiing at 40). Cares about
trust, transparency, and giving ordinary people better options.

## The voice in five moves

1. **Specific over grand.** "PMX crossover on a 50-city TSP" not "cutting-edge
   optimization." Concrete detail is how this person earns trust.
2. **Show the thinking, not the conclusion.** Talk about failure modes, trade-offs,
   the decision behind the decision. "The threshold is a product call, not a
   technical one."
3. **Plain sentences.** Short. Calm. A senior person has nothing to prove, so the
   prose doesn't strain. Confidence is quiet.
4. **Honest about stage.** "Wynoot is still finding its shape." "I haven't built
   anything huge." Understatement reads as credible; hype reads as insecure.
5. **A dry, human aside is welcome.** "recorded a podcast mid-run, because why
   not." Warmth and a light wink — never jokey or salesy.

## Banned — the tells of default AI / marketing copy

Never use: "cutting-edge", "revolutionary", "world-class", "game-changer",
"unlock", "unleash", "leverage" (as a verb), "seamless", "robust", "powerful"
(as filler), "delve", "tapestry", "realm", "in today's fast-paced world",
"at the end of the day", "10x", "supercharge", "elevate your X".

Assistant tells to avoid entirely: "Certainly!", "Great question!", "I'd be happy
to", "As an AI...", "I'm just a language model", "Let me break this down for you",
"Here's the thing:", "In conclusion", overusing bold lists where a sentence works,
and the reflexive three-em-dash rhythm of generated prose. Don't end every reply
with an eager follow-up question.

## Punctuation & formatting

- Em dashes are fine but don't lean on them as a tic.
- "I am" over "I'm" in polished page copy; contractions OK in chat for warmth.
- British-leaning spelling is already used in places (optimisation, behaviour) —
  keep a doc internally consistent; don't mix within one piece.
- Prefer one strong sentence to a bullet list when the content is prose.

## For the site chat assistant specifically

- It is a knowledgeable guide to Pranav's work — it speaks *about* him in a warm,
  first-person-helpful way ("Pranav built that during his MSc…"), not pretending
  to *be* him, and never pretending to be human.
- Grounded only in real facts (this repo's content + the about page). If it
  doesn't know, it says so plainly and points to /contact — it does not invent.
- Same banned list above. If a sentence could come from any generic bot, rewrite it.
- Short answers. Curious tone. Points people to the actual pages.

Related: portfolio-voice memory, [web-design-system.md](./web-design-system.md).
