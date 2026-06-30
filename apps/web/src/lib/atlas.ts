/*
  Atlas — the "places" knowledge layer.

  Each place the site mentions (Jhansi, India, Netherlands, …) gets a small,
  curated knowledge graph: a hook line, a short "why it matters", and a set of
  related nodes + connections. The <PlaceWeb> component lays these out into a
  sci-fi relation diagram + significance cloud on the fly.

  Adding a new place = adding one object to `atlasPlaces`. The visualisation
  generates itself from the data — no per-place layout work.
*/

export type AtlasNodeKind = "person" | "place" | "fact" | "theme" | "work";

export type AtlasNode = {
  label: string;
  /** 1 (minor) – 5 (defining). Drives node size + cloud weight. */
  weight: number;
  kind?: AtlasNodeKind;
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
  sources?: { label: string; href: string }[];
};

export const atlasPlaces: AtlasPlace[] = [
  {
    slug: "jhansi",
    name: "Jhansi",
    region: "Bundelkhand · Uttar Pradesh · India",
    hook: "A dot most maps skip — and the launchpad of a queen who took on an empire.",
    significance:
      "Most people draw a blank at “Jhansi.” Here is the thing: in 1857, Rani Lakshmibai — the Queen of Jhansi — rode out of its fort against the British East India Company with her young son tied to her back. She became one of the faces of India’s First War of Independence, and a folk poem about her, “Khoob ladi mardani,” is still recited by schoolchildren a century and a half later. Not bad for a dot on the map.",
    nodes: [
      { label: "Rani Lakshmibai", weight: 5, kind: "person" },
      { label: "Jhansi Fort", weight: 4, kind: "place" },
      { label: "1857 Rebellion", weight: 5, kind: "fact" },
      { label: "First War of Independence", weight: 4, kind: "theme" },
      { label: "“Khoob ladi mardani”", weight: 3, kind: "work" },
      { label: "Subhadra Kumari Chauhan", weight: 2, kind: "person" },
      { label: "Bundelkhand", weight: 3, kind: "place" },
      { label: "Manikarnika", weight: 2, kind: "person" },
      { label: "Gwalior", weight: 2, kind: "place" },
      { label: "British East India Company", weight: 3, kind: "theme" },
      { label: "Orchha", weight: 2, kind: "place" },
      { label: "Betwa River", weight: 1, kind: "place" },
    ],
    links: [
      [0, 1],
      [0, 2],
      [0, 3],
      [0, 7],
      [0, 8],
      [2, 9],
      [4, 5],
      [4, 0],
      [6, 10],
    ],
    sources: [
      {
        label: "Rani Lakshmibai — Wikipedia",
        href: "https://en.wikipedia.org/wiki/Lakshmibai",
      },
      { label: "Jhansi — Wikipedia", href: "https://en.wikipedia.org/wiki/Jhansi" },
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

export function getPlace(slug: string): AtlasPlace | undefined {
  return atlasPlaces.find((p) => p.slug === slug);
}

export function allPlaceSlugs(): string[] {
  return atlasPlaces.map((p) => p.slug);
}
