// Content model for antainereilly.com
// Shape mirrors production sources so this v0 maps cleanly onto real backends:
//  - products -> Shopify Storefront API (handle, variantId, priceEUR)
//  - portal resources -> Supabase (gated by RLS)
//  - works -> CMS collection

export type Discipline = "sound" | "image" | "objects" | "spaces";

export const DISCIPLINES: { key: Discipline; label: string; verb: string; note: string }[] = [
  { key: "sound", label: "Sound", verb: "sound-maker", note: "Synthesis, field recording, release work." },
  { key: "image", label: "Image", verb: "image-hunter", note: "Photographic plates. Found light, found form." },
  { key: "objects", label: "Objects", verb: "object collector", note: "Small-run pieces. Made, found, kept." },
  { key: "spaces", label: "Spaces", verb: "space designer", note: "Listening rooms, installations, interiors." },
];

export const BRAND = {
  name: "Antaine Reilly",
  tagline: "Sound-maker, image-hunter, object collector, space designer.",
  location: "Working between Ireland & Asturias",
  email: "alex@rmtv.io",
  instagram: "antainereilly",
  lapipa: "https://www.lapipa.io",
  established: "Views from the edges",
  statement:
    "Views from the Edges is a double life, kept for over two decades: cities worked by day, their undersides walked by night. Business travel on one side; sound systems, squats and alternative thinking on the other. The edges are where the two meet — and the subject was never just the underground. It is people: their nature, their gatherings, the mystery of a moment that won't repeat.",
};

export type Work = {
  id: string;
  discipline: Discipline;
  title: string;
  year: string;
  medium: string;
  plate: string; // "Plate 04"
  hue: number; // duotone base hue for generated visual
  blurb: string;
  img?: string; // MEDIA key for a real migrated image
  featured?: boolean;
};

export const WORKS: Work[] = [
  { id: "harbord", discipline: "image", title: "Harbord Street, Toronto", year: "2016", medium: "Archival pigment, edition of 12", plate: "I · 01", hue: 205, img: "img1781", featured: true,
    blurb: "A quiet corner of Toronto — Harbord Street under a moving sky. No one in the frame but the city itself." },
  { id: "listening-room", discipline: "spaces", title: "Caña North Drive", year: "2025", medium: "Interior + acoustic design", plate: "P · 02", hue: 200, img: "cana", featured: true,
    blurb: "A house built around a room you're meant to hear as much as see." },
];

export type Product = {
  handle: string; // maps to Shopify product handle
  title: string;
  category: Discipline;
  kind: string; // "Print" | "Record" | "Object"
  priceEUR: number;
  edition?: string;
  hue: number;
  img?: string; // MEDIA key
  status: "available" | "preorder" | "sold-out";
  blurb: string;
};

export const PRODUCTS: Product[] = [
  { handle: "estuary-cassette", title: "Estuary", category: "sound", kind: "Cassette + Digital", priceEUR: 14, hue: 190, status: "available",
    blurb: "Chrome cassette in letterpress sleeve. Includes lossless download." },
  { handle: "field-notes-lp", title: "Field Notes, Vol. I", category: "sound", kind: "Vinyl LP", priceEUR: 26, edition: "Ed. of 300", hue: 28, status: "preorder",
    blurb: "180g black vinyl. Ships autumn. Numbered." },
  { handle: "patch-cards-set", title: "Patch Cards", category: "objects", kind: "Boxed set", priceEUR: 38, edition: "Ed. of 100", hue: 74, status: "available",
    blurb: "Forty letterpress synth-patch cards in a cloth box." },
  { handle: "coast-print-04", title: "Coast / Non-Coast — Plate 04", category: "image", kind: "Archival print", priceEUR: 120, edition: "Ed. of 12", hue: 205, img: "img1781", status: "available",
    blurb: "40×50cm archival pigment on cotton rag. Signed, numbered." },
  { handle: "greylight-print", title: "Greylight — Plate 09", category: "image", kind: "Archival print", priceEUR: 95, edition: "Ed. of 20", hue: 12, status: "available",
    blurb: "30×40cm duotone. Signed on the verso." },
  { handle: "concrete-monitor", title: "Concrete Monitor 01", category: "objects", kind: "Object / speaker", priceEUR: 480, edition: "Made to order", hue: 22, status: "preorder",
    blurb: "Cast to order. Full-range driver, birch baffle, 8kg of concrete." },
  { handle: "keeper-vessel", title: "The Keeper", category: "objects", kind: "Stoneware", priceEUR: 65, hue: 48, status: "sold-out",
    blurb: "Hand-thrown vessel, ash glaze. Each one slightly wrong." },
  { handle: "found-objects-zine", title: "Found Objects — Zine", category: "image", kind: "Print / zine", priceEUR: 18, edition: "2nd printing", hue: 40, status: "available",
    blurb: "48pp risograph zine of the Found Objects series." },
];

// ---- Portal content (gated) --------------------------------------------

export type LibraryItem = { id: string; title: string; format: string; size: string; added: string };
export const LIBRARY: LibraryItem[] = [
  { id: "estuary-stems", title: "Estuary — full stems", format: "WAV / 24-bit", size: "1.2 GB", added: "Mar 2025" },
  { id: "tidal-recordings", title: "Tidal field recordings", format: "WAV pack", size: "640 MB", added: "Feb 2025" },
  { id: "low-signal-patches", title: "Low Signal — patch archive", format: "VCV / Eurorack", size: "48 MB", added: "Jan 2025" },
  { id: "greylight-luts", title: "Greylight — duotone LUTs", format: ".cube ×6", size: "12 MB", added: "Dec 2024" },
];

export type Dispatch = { id: string; date: string; title: string; body: string };
export const DISPATCHES: Dispatch[] = [
  { id: "d1", date: "2025 · 03", title: "On leaving things running", body: "Half of Field Notes is machines I forgot to turn off. The room does the composing; I just decide when to stop recording." },
  { id: "d2", date: "2025 · 02", title: "The estuary, tuned", body: "Six weeks matching oscillator drift to the tide table. The water was never once in tune with itself, which turned out to be the point." },
  { id: "d3", date: "2025 · 01", title: "A speaker made of concrete", body: "It weighs eight kilos and it will not resonate, which is the whole idea. Notes toward Concrete Monitor 02." },
];

export type Commission = {
  id: string; client: string; title: string; kind: string;
  status: "brief" | "in-progress" | "review" | "delivered";
  updated: string; progress: number; files: number;
};
export const COMMISSIONS: Commission[] = [
  { id: "cmn-014", client: "Xixón Sound", title: "Festival listening tent", kind: "Space + sound design", status: "in-progress", updated: "2 days ago", progress: 62, files: 9 },
  { id: "cmn-013", client: "Private", title: "Home listening room", kind: "Acoustic fit-out", status: "review", updated: "5 days ago", progress: 90, files: 21 },
  { id: "cmn-011", client: "LA PIPA", title: "Bar sound system + object shelf", kind: "Install", status: "delivered", updated: "Mar 2025", progress: 100, files: 34 },
];

export const NAV: { key: string; label: string }[] = [
  // work hidden for now — Blanco y Negro lives in the Shop as products
  { key: "home", label: "Index" },
  { key: "shop", label: "Shop" },
  { key: "about", label: "About" },
  { key: "journal", label: "Journal" },
  { key: "portal", label: "Portal" },
];


export type GalleryImage = { key: string; title: string; alt: string };
export const BLANCO_Y_NEGRO: GalleryImage[] = [
  { key: "love-parade-berlin", title: "Love Parade, Berlin", alt: "Blanco y Negro — Love Parade, Berlin — black-and-white photograph by Antaine Reilly" },
  { key: "love-parade-i", title: "Love Parade I", alt: "Blanco y Negro — Love Parade I — black-and-white photograph by Antaine Reilly" },
  { key: "love-parade-ii", title: "Love Parade II", alt: "Blanco y Negro — Love Parade II — black-and-white photograph by Antaine Reilly" },
  { key: "reclaim-the-streets-london", title: "Reclaim the Streets, London", alt: "Blanco y Negro — Reclaim the Streets, London — black-and-white photograph by Antaine Reilly" },
  { key: "carnival-against-capital", title: "Carnival Against Capital", alt: "Blanco y Negro — Carnival Against Capital — black-and-white photograph by Antaine Reilly" },
  { key: "hackney-squat-party-1999", title: "Hackney Squat Party, 1999", alt: "Blanco y Negro — Hackney squat party, 1999 — black-and-white photograph by Antaine Reilly" },
  { key: "brooklyn-street", title: "Brooklyn Street", alt: "Blanco y Negro — Brooklyn street — black-and-white photograph by Antaine Reilly" },
  { key: "crossing-street", title: "Crossing", alt: "Blanco y Negro — Crossing, street portrait — black-and-white photograph by Antaine Reilly" },
  { key: "sonar-2015", title: "Sónar, 2015", alt: "Blanco y Negro — Sónar, 2015 — black-and-white photograph by Antaine Reilly" },
  { key: "razzmatazz-2016", title: "Razzmatazz, 2016", alt: "Blanco y Negro — Razzmatazz, 13 Feb 2016 — black-and-white photograph by Antaine Reilly" },
  { key: "love-is-everywhere", title: "Love Is Everywhere", alt: "Blanco y Negro — Love is Everywhere — black-and-white photograph by Antaine Reilly" },
  { key: "juanin-larriba-london", title: "Juanín Larriba, London", alt: "Blanco y Negro — Juanín Larriba, London — black-and-white photograph by Antaine Reilly" },
  { key: "alonso-yayo-2025", title: "Alonso & Yayo, 2025", alt: "Blanco y Negro — Alonso & Yayo, 2025 — black-and-white photograph by Antaine Reilly" },
  { key: "img-0181", title: "Plate 0181", alt: "Blanco y Negro — Plate (0181) — black-and-white photograph by Antaine Reilly" },
  { key: "img-1953", title: "Plate 1953", alt: "Blanco y Negro — Plate (1953) — black-and-white photograph by Antaine Reilly" },
  { key: "img-2019", title: "Plate 2019", alt: "Blanco y Negro — Plate (2019) — black-and-white photograph by Antaine Reilly" },
  { key: "img-6246", title: "Plate 6246", alt: "Blanco y Negro — Plate (6246) — black-and-white photograph by Antaine Reilly" },
  { key: "img-6901", title: "Plate 6901", alt: "Blanco y Negro — Plate (6901) — black-and-white photograph by Antaine Reilly" },
  { key: "img-7670", title: "Plate 7670", alt: "Blanco y Negro — Plate (7670) — black-and-white photograph by Antaine Reilly" },
];

export type Era = { period: string; title: string; body: string };
export const JOURNEY: Era[] = [
  { period: "1990s", title: "The London Years", body: "Arrived in London in my early twenties. Embedded in the underground music and protest movements — Reclaim the Streets, squatted venues like Tyssen Street Studios, and the explosion of acid techno culture reshaping the city. I was there when the sound systems rolled into the financial district on June 18th, 1999." },
  { period: "2000s", title: "The Wandering", body: "Berlin, Barcelona, Tokyo, Cuba, Canada. The Love Parade in 2000, when over a million people gathered under one banner. Each destination added new layers to how culture, music and community interweave across borders. The camera was always there." },
  { period: "2010s", title: "Barcelona & Beyond", body: "Deep involvement in Barcelona's electronic music scene — Sónar, Razzmatazz, Poble Espanyol. Documenting the evolution of underground culture as it adapted to new realities." },
  { period: "Now", title: "La Pipa, Asturias", body: "Based in Asturias, where I co-founded La Pipa — a creative space carrying forward the spirit of those earlier experiments: collaboration, authenticity, and the belief that culture should be lived, not just consumed." },
];

export const UNBOXED = {
  title: "Unboxed: Three Decades Unpublished",
  body: "In 2025 I began releasing photographs that had been sitting in boxes and hard drives for decades — from the London street parties to Berlin's Tiergarten, from Tokyo's neon-lit alleys to Havana on election night 2016. Taken between meetings and after them, in whatever city the work had sent me to. Blanco y Negro is the first series.",
};

export const POLICIES: { label: string; url: string }[] = [
  { label: "Refund policy", url: "https://checkout.shopify.com/106594828619/policies/63713411403.html" },
  { label: "Shipping policy", url: "https://checkout.shopify.com/106594828619/policies/63713575243.html" },
  { label: "Terms of service", url: "https://checkout.shopify.com/106594828619/policies/63713509707.html" },
  { label: "Privacy policy", url: "https://checkout.shopify.com/106594828619/policies/63707971915.html" },
  { label: "Contact information", url: "https://checkout.shopify.com/106594828619/policies/63713673547.html" },
  { label: "Aviso legal", url: "https://checkout.shopify.com/106594828619/policies/63713804619.html" },
];
