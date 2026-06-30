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
      { label: "Rani Lakshmibai", weight: 5, kind: "person" },
      { label: "Jhansi Fort (1613)", weight: 4, kind: "place" },
      { label: "Orchha & the Bundelas", weight: 4, kind: "place" },
      { label: "“Jhain-si” — the name", weight: 3, kind: "fact" },
      { label: "1857 Rebellion", weight: 4, kind: "fact" },
      { label: "Chandela & Gupta past", weight: 3, kind: "theme" },
      { label: "Maratha Newalkars", weight: 3, kind: "person" },
      { label: "Bundelkhand plateau", weight: 4, kind: "nature" },
      { label: "Betwa & Pahuj rivers", weight: 3, kind: "nature" },
      { label: "Bundeli tongue & lore", weight: 4, kind: "culture" },
      { label: "Alha-Udal ballad", weight: 3, kind: "culture" },
      { label: "Rai & Diwari dance", weight: 2, kind: "culture" },
      { label: "Bundeli cuisine", weight: 3, kind: "food" },
      { label: "Groundnut & pulses hub", weight: 3, kind: "economy" },
      { label: "Virangana Lakshmibai Jn.", weight: 4, kind: "economy" },
      { label: "Defence Corridor & BHEL", weight: 3, kind: "economy" },
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
      { label: "The number zero", weight: 5, kind: "fact" },
      { label: "22 official languages", weight: 4, kind: "fact" },
      { label: "Indus Valley", weight: 3, kind: "theme" },
      { label: "World’s largest democracy", weight: 4, kind: "theme" },
      { label: "Himalayas", weight: 3, kind: "place" },
      { label: "Monsoon", weight: 3, kind: "fact" },
      { label: "Sanskrit", weight: 2, kind: "work" },
      { label: "IT & software", weight: 4, kind: "work" },
      { label: "ISRO · Mangalyaan", weight: 3, kind: "work" },
      { label: "Yoga", weight: 2, kind: "theme" },
      { label: "Spice trade", weight: 2, kind: "theme" },
      { label: "Jhansi", weight: 3, kind: "place" },
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
      { label: "Below sea level", weight: 5, kind: "fact" },
      { label: "Polders & dikes", weight: 4, kind: "work" },
      { label: "Delta Works", weight: 4, kind: "work" },
      { label: "More bikes than people", weight: 4, kind: "fact" },
      { label: "Amsterdam", weight: 3, kind: "place" },
      { label: "Tulips", weight: 2, kind: "theme" },
      { label: "Rembrandt & Vermeer", weight: 3, kind: "person" },
      { label: "Dutch East India Co. (VOC)", weight: 3, kind: "theme" },
      { label: "Windmills", weight: 2, kind: "work" },
      { label: "“Gezellig”", weight: 2, kind: "theme" },
      { label: "Water management", weight: 3, kind: "work" },
      { label: "Cheese & trade", weight: 1, kind: "theme" },
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
