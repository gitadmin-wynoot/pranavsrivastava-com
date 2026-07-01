/*
  Atlas — the "places" knowledge layer.

  Each place the site mentions (Jhansi, India, Netherlands, …) gets a small,
  curated knowledge graph: a hook line, a short "why it matters", and a set of
  related nodes + connections. The <PlaceWeb> component lays these out into a
  sci-fi relation diagram + significance cloud on the fly.

  Adding a new place = adding one object to `atlasPlaces`. The visualisation
  generates itself from the data — no per-place layout work.
*/

export type AtlasNodeKind =
  | "person"
  | "place"
  | "fact"
  | "theme"
  | "work"
  | "food"
  | "culture"
  | "nature"
  | "economy";

export type AtlasNode = {
  label: string;
  /** 1 (minor) – 5 (defining). Drives node size + cloud weight. */
  weight: number;
  kind?: AtlasNodeKind;
  /** 1–2 sentence detail, revealed when the term is clicked in the cloud. */
  note?: string;
};

/** A facet of a place — one angle of its "deep dive" (history, food, …). */
export type AtlasFacet = {
  title: string;
  /** single emoji or short glyph */
  glyph: string;
  body: string;
};

export type AtlasPlace = {
  slug: string;
  name: string;
  /** e.g. "Bundelkhand · Uttar Pradesh · India" */
  region: string;
  /** One clever line — shown as the tagline. */
  hook: string;
  /** 2–4 sentences on why the place is significant. */
  significance: string;
  /** Related terms — become both graph nodes and the significance cloud. */
  nodes: AtlasNode[];
  /** Extra connections between nodes, by index into `nodes`. */
  links?: [number, number][];
  /** Categorised deep-dive sections (history, geography, food, …). */
  facets?: AtlasFacet[];
  sources?: { label: string; href: string }[];
};

export const atlasPlaces: AtlasPlace[] = [
  {
    slug: "jhansi",
    name: "Jhansi",
    region: "Bundelkhand · Uttar Pradesh · India",
    hook: "Everyone stops at the warrior queen. Jhansi’s story runs a lot deeper than one battle.",
    significance:
      "Yes — in 1857 Rani Lakshmibai rode out of its fort against the British East India Company, and rightly became a face of India’s First War of Independence. But Jhansi is older and stranger than one battle. It grew up around a hill fort raised in 1613 by the Bundelas of Orchha, on the hard granite of the Bundelkhand plateau; it was a Maratha holding before it was a rebel stronghold; and today it is one of central India’s great railway crossroads. Deep past, dry rivers, a dialect all its own, peanuts and pulses, folk ballads still sung at fairs. A dot most maps skip — with a great deal going on.",
    nodes: [
      {
        label: "Rani Lakshmibai",
        weight: 5,
        kind: "person",
        note: "Born Manikarnika in Varanasi and widowed young, she refused to hand Jhansi to the British “doctrine of lapse.” In 1858 she fought in armour with her adopted son tied to her back, and died on horseback near Gwalior at about 29 — even her British opponent called her the bravest of the rebels.",
      },
      {
        label: "Jhansi Fort (1613)",
        weight: 4,
        kind: "place",
        note: "Raised on the rocky Bangira hill by Bir Singh Deo of Orchha, its granite walls run up to ~20 feet thick. The 1857 siege and the queen’s legendary leap on horseback are staged from these ramparts.",
      },
      {
        label: "Orchha & the Bundelas",
        weight: 4,
        kind: "place",
        note: "Jhansi’s parent city — a Bundela Rajput capital on the Betwa, famous for towering temple-palaces and riverside royal cenotaphs. Jhansi began life as Orchha’s fortified outpost.",
      },
      {
        label: "“Jhain-si” — the name",
        weight: 3,
        kind: "fact",
        note: "Local legend: from Orchha, Raja Bir Singh saw his new fort as “jhain-si” — faint, shadowy — in the Bundeli tongue. That hazy silhouette on the horizon is said to have given the city its name.",
      },
      {
        label: "1857 Rebellion",
        weight: 4,
        kind: "fact",
        note: "Jhansi was one of the fiercest centres of the 1857 uprising — India’s First War of Independence. The queen’s defence of the fort turned the town into a lasting symbol of resistance.",
      },
      {
        label: "Chandela & Gupta past",
        weight: 3,
        kind: "theme",
        note: "The wider region carries very deep history — the Gupta-era Dashavatara temple at nearby Deogarh (~6th century), one of India’s earliest stone Hindu temples, and the Chandela dynasty who built Khajuraho.",
      },
      {
        label: "Maratha Newalkars",
        weight: 3,
        kind: "person",
        note: "Before the queen, Jhansi was a Maratha holding governed by the Newalkar subhedars from the 1700s — which is how a Maratha-descended royal house came to rule a Bundela fort in the heart of Rajput country.",
      },
      {
        label: "Bundelkhand plateau",
        weight: 4,
        kind: "nature",
        note: "A rugged granite upland straddling Uttar Pradesh and Madhya Pradesh — semi-arid, drought-prone, and studded with forts. Its hardness shaped both a defensive history and a frugal farming economy.",
      },
      {
        label: "Betwa & Pahuj rivers",
        weight: 3,
        kind: "nature",
        note: "The Betwa (a Yamuna tributary) and the smaller Pahuj water the region. Nearby Barua Sagar lake and centuries-old tanks are the legacy of constantly managing a thirsty land.",
      },
      {
        label: "Bundeli tongue & lore",
        weight: 4,
        kind: "culture",
        note: "Bundeli, the region’s proud dialect, carries a whole oral culture — folk epics, festival songs, and a blunt rural humour quite distinct from standard Hindi.",
      },
      {
        label: "Alha-Udal ballad",
        weight: 3,
        kind: "culture",
        note: "The Alha — a sprawling medieval war-ballad of two Banaphar warrior brothers from Mahoba — is still sung from memory at fairs across Bundelkhand, especially through the monsoon.",
      },
      {
        label: "Rai & Diwari dance",
        weight: 2,
        kind: "culture",
        note: "Rai is a fast, spinning folk dance performed by the Bedni community; Diwari is the men’s stick-and-drum dance of the Diwali season. Both are pure Bundelkhand.",
      },
      {
        label: "Bundeli cuisine",
        weight: 3,
        kind: "food",
        note: "Dry-land cooking: bafauri (steamed spiced gram-flour balls), a tangy kadhi, and mawa-rich sweets. Groundnuts turn up everywhere — snack, oil, and cash crop all at once.",
      },
      {
        label: "Groundnut & pulses hub",
        weight: 3,
        kind: "economy",
        note: "Jhansi is a major mandi (market) for peanuts and pulses — the crops a dry plateau actually rewards. Farming here is as much about resilience as yield.",
      },
      {
        label: "Virangana Lakshmibai Jn.",
        weight: 4,
        kind: "economy",
        note: "One of north-central India’s busiest railway junctions, linking Delhi, Mumbai and the south. It was renamed Virangana Lakshmibai in 2021, after the queen.",
      },
      {
        label: "Defence Corridor & BHEL",
        weight: 3,
        kind: "economy",
        note: "Modern Jhansi hosts a BHEL heavy-electricals plant and sits on the Uttar Pradesh Defence Industrial Corridor — a bid to turn its old strategic location into new industry.",
      },
    ],
    links: [
      [0, 1],
      [0, 4],
      [0, 6],
      [1, 2],
      [1, 3],
      [2, 7],
      [2, 5],
      [9, 10],
      [9, 11],
      [7, 8],
      [7, 9],
      [12, 13],
      [14, 15],
      [14, 13],
    ],
    facets: [
      {
        title: "The deep past",
        glyph: "🜂",
        body: "Long before the queen, this corner of Bundelkhand held some of India’s oldest worked stone — the Gupta-era Dashavatara temple at nearby Deogarh (around the 6th century) and the legacy of the Chandelas who built Khajuraho. Jhansi itself dates to 1613, when Bir Singh Deo of Orchha raised the hill fort. Legend ties the name to “jhain-si” — the faint, shadowy outline of that fort as first glimpsed from Orchha across the plain.",
      },
      {
        title: "Geography & topography",
        glyph: "⛰",
        body: "Jhansi sits on the Bundelkhand plateau right at the Uttar Pradesh–Madhya Pradesh border, on hard, ancient granite — rocky, semi-arid, and hot, with sharp dry seasons. The Betwa and Pahuj rivers thread the region. That granite is why the forts sit where they do (defensible outcrops), and the dryness is why it has always been pulse-and-oilseed country rather than lush farmland.",
      },
      {
        title: "Rulers, in layers",
        glyph: "♜",
        body: "Chandelas and Bundelas, then the Marathas: the Newalkar subhedars governed Jhansi as a Maratha holding through the 1700s. That is how a Maratha-descended queen came to defend a Bundela fort against the British in 1857. Each layer left walls, temples, water tanks, and stories stacked on top of one another.",
      },
      {
        title: "What’s on the plate",
        glyph: "🍲",
        body: "Bundeli cooking is plain-country food built for a dry land: bafauri (steamed gram-flour dumplings), a tangy local kadhi, mawa-rich sweets, and groundnuts in everything — Jhansi is one of the region’s big peanut and pulse markets, so the economy and the dinner table share a crop.",
      },
      {
        title: "Culture & tongue",
        glyph: "🪕",
        body: "People here speak Bundeli, a dialect with its own fierce pride. The region gave India the Alha-Udal — a sprawling oral war-ballad still sung at village fairs — plus the high-energy Rai and Diwari folk dances and the monsoon Kajli festival. Bundeli Holi is its own kind of loud.",
      },
      {
        title: "Today’s Jhansi",
        glyph: "🛤",
        body: "Modern Jhansi is a major railway junction — renamed Virangana Lakshmibai in 2021 — and a gateway between north and central India. It is home to a BHEL heavy-electricals plant, a node on the Uttar Pradesh Defence Industrial Corridor, and Bundelkhand University. Still strategic, still a crossroads.",
      },
    ],
    sources: [
      {
        label: "Jhansi — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Jhansi",
      },
      {
        label: "Rani Lakshmibai — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Lakshmibai",
      },
      {
        label: "Bundelkhand — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Bundelkhand",
      },
    ],
  },
  {
    slug: "india",
    name: "India",
    region: "South Asia",
    hook: "Not a country so much as a civilisation wearing a trenchcoat.",
    significance:
      "India gave the world the concept of zero, 22 official languages, and one of the oldest continuous civilisations on Earth — then turned around and became the planet’s largest democracy and a software powerhouse. It is less a single place than a few dozen of them politely sharing a passport. Pranav grew up here, in Jhansi.",
    nodes: [
      {
        label: "The number zero",
        weight: 5,
        kind: "fact",
        note: "India formalised zero as a number through the mathematician Brahmagupta (7th century), and the decimal place-value system spread from here to the world. Modern computing is unthinkable without it.",
      },
      {
        label: "22 official languages",
        weight: 4,
        kind: "fact",
        note: "The constitution recognises 22 scheduled languages, written in a dozen scripts, across two major language families. Many Indians are casually bi- or trilingual.",
      },
      {
        label: "Indus Valley",
        weight: 3,
        kind: "theme",
        note: "The Bronze-Age Indus (Harappan) civilisation, around 2600 BCE, had grid-planned cities, covered drainage, and standardised weights — one of humanity’s first great urban societies.",
      },
      {
        label: "World’s largest democracy",
        weight: 4,
        kind: "theme",
        note: "With nearly a billion eligible voters, an Indian general election is the largest peacetime logistical event on Earth, run in phases over several weeks.",
      },
      {
        label: "Himalayas",
        weight: 3,
        kind: "nature",
        note: "The world’s highest range walls off India’s north and feeds its great rivers. The continental collision that raised it is still lifting the mountains today.",
      },
      {
        label: "Monsoon",
        weight: 3,
        kind: "nature",
        note: "The seasonal monsoon delivers most of India’s rain in a few intense months — the rhythm that agriculture, festivals, and the whole economy still move to.",
      },
      {
        label: "Sanskrit",
        weight: 2,
        kind: "culture",
        note: "One of the oldest documented languages, with an astonishingly precise ancient grammar (Panini’s) that modern computational linguists still study.",
      },
      {
        label: "IT & software",
        weight: 4,
        kind: "economy",
        note: "From the 1990s India became a coding and services powerhouse; its IT-services industry earns tens of billions a year and trains millions of engineers.",
      },
      {
        label: "ISRO · Mangalyaan",
        weight: 3,
        kind: "work",
        note: "India reached Mars orbit on its very first attempt (2014) — and for a fraction of comparable missions’ cost. ISRO is famous for frugal, ingenious engineering.",
      },
      {
        label: "Yoga",
        weight: 2,
        kind: "culture",
        note: "A 2,000-year-old system of physical and mental discipline now practised worldwide; its philosophical roots run deep through classical Indian thought.",
      },
      {
        label: "Spice trade",
        weight: 2,
        kind: "economy",
        note: "For millennia India’s pepper, cardamom and more pulled traders and empires across oceans — the spice trade literally helped redraw world maps.",
      },
      {
        label: "Jhansi",
        weight: 3,
        kind: "place",
        note: "Pranav’s home town — a Bundelkhand fort-city best known for its 1857 warrior queen, and far deeper than that single story.",
      },
    ],
    links: [
      [0, 6],
      [2, 6],
      [3, 1],
      [7, 8],
      [4, 5],
      [11, 3],
      [10, 2],
    ],
    sources: [{ label: "India — Wikipedia", href: "https://en.wikipedia.org/wiki/India" }],
  },
  {
    slug: "netherlands",
    name: "Netherlands",
    region: "Northwestern Europe",
    hook: "A country that argued with the sea — and won.",
    significance:
      "A third of the Netherlands sits below sea level, so the Dutch simply built the land they wanted: polders, dikes, and the Delta Works, one of the modern engineering wonders. It is also the most bicycle-dense country on Earth and once ran a trading empire from a city built on wooden poles. Pranav has lived here since 2016.",
    nodes: [
      {
        label: "Below sea level",
        weight: 5,
        kind: "fact",
        note: "About a third of the country sits below sea level; without its dikes and pumps, much of the Randstad — Amsterdam, Rotterdam, The Hague — would simply flood.",
      },
      {
        label: "Polders & dikes",
        weight: 4,
        kind: "work",
        note: "Polders are land reclaimed from sea or lake, kept dry by dikes and pumps. The Dutch have quite literally manufactured much of their own country.",
      },
      {
        label: "Delta Works",
        weight: 4,
        kind: "work",
        note: "A vast system of dams, sluices and storm-surge barriers built after the deadly 1953 North Sea flood — often ranked among the modern engineering wonders of the world.",
      },
      {
        label: "More bikes than people",
        weight: 4,
        kind: "fact",
        note: "There are more bicycles than residents. Cycling is simply how the country moves, on a dense national network of dedicated, protected paths.",
      },
      {
        label: "Amsterdam",
        weight: 3,
        kind: "place",
        note: "A trading city built on millions of wooden piles driven into marsh, laced with canals — a UNESCO-listed feat of 17th-century urban planning.",
      },
      {
        label: "Tulips",
        weight: 2,
        kind: "economy",
        note: "Imported from the Ottoman world, tulips sparked history’s first speculative bubble (“tulip mania,” 1637) and are today a billion-euro export.",
      },
      {
        label: "Rembrandt & Vermeer",
        weight: 3,
        kind: "person",
        note: "The 17th-century Dutch Golden Age produced Rembrandt, Vermeer and a quiet revolution in painting light, interiors, and ordinary life.",
      },
      {
        label: "Dutch East India Co. (VOC)",
        weight: 3,
        kind: "theme",
        note: "The VOC (1602) was the world’s first publicly traded company and one of the most powerful corporations ever to exist — for good and very much for ill.",
      },
      {
        label: "Windmills",
        weight: 2,
        kind: "work",
        note: "Beyond the postcards, windmills were industrial machines — pumping water, sawing timber, grinding grain. They were the Netherlands’ early power grid.",
      },
      {
        label: "“Gezellig”",
        weight: 2,
        kind: "culture",
        note: "An almost untranslatable Dutch word for cosy, convivial warmth — a whole social ideal packed into one small adjective.",
      },
      {
        label: "Water management",
        weight: 3,
        kind: "work",
        note: "Dutch expertise in keeping the sea out and rivers in check is now exported worldwide as climate-adaptation know-how, from New Orleans to Jakarta.",
      },
      {
        label: "Cheese & trade",
        weight: 1,
        kind: "economy",
        note: "Gouda and Edam aren’t just food but centuries-old trade goods; the Dutch built much of their wealth by moving and selling what others made.",
      },
    ],
    links: [
      [0, 1],
      [0, 2],
      [1, 10],
      [2, 10],
      [4, 7],
      [3, 4],
      [8, 1],
      [6, 4],
    ],
    sources: [
      { label: "Netherlands — Wikipedia", href: "https://en.wikipedia.org/wiki/Netherlands" },
    ],
  },
];

export const KIND_COLOR: Record<AtlasNodeKind, string> = {
  person: "#f0abfc", // fuchsia
  place: "#7dd3fc", // sky
  fact: "#86efac", // green
  theme: "#fcd34d", // amber
  work: "#93c5fd", // blue
  food: "#fdba74", // orange
  culture: "#c4b5fd", // violet
  nature: "#6ee7b7", // emerald
  economy: "#fda4af", // rose
};

export const KIND_LABEL: Record<AtlasNodeKind, string> = {
  person: "people",
  place: "places",
  fact: "history",
  theme: "themes",
  work: "works",
  food: "food",
  culture: "culture",
  nature: "land",
  economy: "economy",
};

export function colorFor(kind?: AtlasNodeKind): string {
  return kind ? KIND_COLOR[kind] : "#7dd3fc";
}

export function getPlace(slug: string): AtlasPlace | undefined {
  return atlasPlaces.find((p) => p.slug === slug);
}

export function allPlaceSlugs(): string[] {
  return atlasPlaces.map((p) => p.slug);
}
