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
  email: "antainereilly@gmail.com",
  instagram: "antainereilly",
  lapipa: "https://www.lapipa.io",
  established: "Views from the edges",
  statement:
    "Antaine Reilly makes and hunts things that hold attention — synth pieces and field recordings, photographic plates, small-run objects, and rooms built to be listened to. Alongside the practice he writes from the edges of music and cinema: the underground, the overlooked, the deliberately difficult.",
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
  { id: "estuary", discipline: "sound", title: "Estuary", year: "2025", medium: "Modular synthesis / tidal field recordings", plate: "S · 01", hue: 190, featured: true,
    blurb: "A 34-minute piece tuned to the ebb of the Lagan. Six patches, one take, no click." },
  { id: "field-notes", discipline: "sound", title: "Field Notes, Vol. I", year: "2024", medium: "Cassette + digital", plate: "S · 02", hue: 28,
    blurb: "Eleven short sound studies. Rooms, weather, machines left running." },
  { id: "low-signal", discipline: "sound", title: "Low Signal", year: "2024", medium: "Live modular set", plate: "S · 03", hue: 74,
    blurb: "Documented at LA PIPA. One hour of drift and interference." },

  { id: "coast", discipline: "image", title: "Coast / Non-Coast", year: "2025", medium: "Archival pigment, edition of 12", plate: "I · 01", hue: 205, img: "img1781", featured: true,
    blurb: "Plates of edges that refuse to be scenery — coast that won't behave like a postcard." },
  { id: "found-objects", discipline: "image", title: "Found Objects", year: "2024", medium: "Silver gelatin", plate: "I · 02", hue: 40,
    blurb: "The collection photographed as it was found, before it was arranged." },
  { id: "greylight", discipline: "image", title: "Greylight", year: "2023", medium: "Digital duotone", plate: "I · 03", hue: 12,
    blurb: "A study of the specific light of a wet Tuesday." },

  { id: "concrete-monitor", discipline: "objects", title: "Concrete Monitor 01", year: "2025", medium: "Cast concrete, birch, driver", plate: "O · 01", hue: 22,
    blurb: "A single full-range speaker in a mass that will outlast the sound." },
  { id: "keeper", discipline: "objects", title: "The Keeper", year: "2024", medium: "Stoneware, glaze", plate: "O · 02", hue: 48,
    blurb: "A vessel for the objects too small to keep any other way." },
  { id: "patch-cards", discipline: "objects", title: "Patch Cards", year: "2024", medium: "Letterpress, boxed set", plate: "O · 03", hue: 74,
    blurb: "Forty synth patches, printed. An instrument you read." },

  { id: "listening-room", discipline: "spaces", title: "Caña North Drive", year: "2025", medium: "Interior + acoustic design (render)", plate: "P · 01", hue: 200, img: "cana", featured: true,
    blurb: "A house built around a room you're meant to hear as much as see." },
  { id: "la-pipa", discipline: "spaces", title: "LA PIPA", year: "2024", medium: "Bar, sound system & object shelf", plate: "P · 02", hue: 24, img: "pipa", featured: true,
    blurb: "A room in Gijón tuned for late nights — the bar as an instrument. lapipa.io" },
  { id: "installation-drift", discipline: "spaces", title: "Drift (installation)", year: "2023", medium: "Sound + light, sited", plate: "P · 03", hue: 260,
    blurb: "A corridor you hear before you see. Shown once, then gone." },
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
  { key: "home", label: "Index" },
  { key: "work", label: "Work" },
  { key: "journal", label: "Journal" },
  { key: "shop", label: "Shop" },
  { key: "portal", label: "Portal" },
  { key: "about", label: "About" },
];
