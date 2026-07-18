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
    "Views from the Edges is a double life, kept for over two decades: cities worked by day, their undersides walked by night. Business travel on one side; underground clubs, free parties, festival fields and house parties that outlasted the weekend on the other. The edges are where the two meet — and the subject was never just the underground. It is people: their nature, their gatherings, the mystery of a moment that won't repeat.",
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

// The Unboxed tapes. Streaming = stream-optimised MP3 (V0 ~245 kbps) on the project CDN,
// range-served so it seeks without downloading the whole file. Master = the original file in
// Supabase Storage ("TRACKS BY ANTAINE", public), served with a forced-download filename.
export type Track = {
  n: string;            // "01"
  title: string;        // "Unboxed 01"
  duration: number;     // seconds
  stream: string;       // CDN mp3 — for the player
  master: string;       // original file — for download
  masterFormat: string; // human label, e.g. "WAV · 59 MB"
};

const MASTER_BASE = "https://lxeuxyieicluzgikflzx.supabase.co/storage/v1/object/public/TRACKS%20BY%20ANTAINE";
const CDN = "https://cdn.shopify.com/s/files/1/1065/9482/8619/files";

export const UNBOXED_TRACKS: Track[] = [
  { n: "01", title: "Unboxed 01", duration: 322, stream: `${CDN}/antaine-unboxed-01.mp3?v=1784389456`, master: `${MASTER_BASE}/UNBOXED_000.wav?download=antaine-unboxed-01.wav`, masterFormat: "WAV · 59 MB" },
  { n: "02", title: "Unboxed 02", duration: 382, stream: `${CDN}/antaine-unboxed-02.mp3?v=1784389456`, master: `${MASTER_BASE}/UNBOXED_001.wav?download=antaine-unboxed-02.wav`, masterFormat: "WAV · 70 MB" },
  { n: "03", title: "Unboxed 03", duration: 382, stream: `${CDN}/antaine-unboxed-03.mp3?v=1784389456`, master: `${MASTER_BASE}/UNBOXED_002.wav?download=antaine-unboxed-03.wav`, masterFormat: "WAV · 70 MB" },
  { n: "04", title: "Unboxed 04", duration: 265, stream: `${CDN}/antaine-unboxed-04.mp3?v=1784389456`, master: `${MASTER_BASE}/UNBOXED_003.wav?download=antaine-unboxed-04.wav`, masterFormat: "WAV · 49 MB" },
  { n: "05", title: "Unboxed 05", duration: 382, stream: `${CDN}/antaine-unboxed-05.mp3?v=1784389456`, master: `${MASTER_BASE}/UNBOXED_004.wav?download=antaine-unboxed-05.wav`, masterFormat: "WAV · 70 MB" },
  { n: "06", title: "Unboxed 06", duration: 400, stream: `${CDN}/antaine-unboxed-06.mp3?v=1784389455`, master: `${MASTER_BASE}/UNBOXED_005.wav?download=antaine-unboxed-06.wav`, masterFormat: "WAV · 74 MB" },
  { n: "07", title: "Unboxed 07", duration: 382, stream: `${CDN}/antaine-unboxed-07.mp3?v=1784389456`, master: `${MASTER_BASE}/UNBOXED_006.wav?download=antaine-unboxed-07.wav`, masterFormat: "WAV · 70 MB" },
  { n: "08", title: "Unboxed 08", duration: 520, stream: `${CDN}/antaine-unboxed-08.mp3?v=1784389455`, master: `${MASTER_BASE}/UNBOXED_007.mp3?download=antaine-unboxed-08.mp3`, masterFormat: "MP3 · 12 MB" },
  { n: "09", title: "Unboxed 09", duration: 360, stream: `${CDN}/antaine-unboxed-09.mp3?v=1784389037`, master: `${MASTER_BASE}/UNBOXED_008.mp3?download=antaine-unboxed-09.mp3`, masterFormat: "MP3 · 8 MB" },
];

export const UNBOXED_SOUND = {
  kicker: "The tapes",
  title: "Unboxed — the sound",
  body: "Unboxed was never only photographs. The same thirty years that filled the boxes filled hard drives with sound — sessions cut in the cities the work sent me to, most of it mixed for no one but me. These are the tapes, opened the way the pictures are: no chronology, no titles worth the name, just Unboxed 01 through 09 in the order they surfaced. Stream them here; pull the master if you want the full-resolution file to keep.",
};

export type Dispatch = { id: string; date: string; title: string; body: string };
export const DISPATCHES: Dispatch[] = [
  { id: "d1", date: "The archive", title: "Why open the boxes now", body: "Thirty years and more than twenty moves made a glorious chaos of it all — negatives, hard drives, tapes, in no order anyone could reconstruct. In 2023 I moved home; in 2025 I started unpacking. Somewhere in the unboxing it became clear the work was worth more shared than stored. Shuffled at random, it means more than any chronology ever could." },
  { id: "d2", date: "The sound", title: "On the tapes", body: "The music came from the same rooms as the pictures — club backrooms and home studios, house parties, festival fields, late trains, borrowed gear. None of it was made to be released, which is exactly why it still sounds like the moment it was caught. What you hear are the masters, cleaned up only enough to play. Download the full-resolution file and it's yours to keep." },
  { id: "d3", date: "The order", title: "Images first, then sound", body: "Blanco y Negro — the black-and-white documentary series in the shop — is the first thing out of the boxes. The tapes are the second. Both arrive the same way: unlabelled, out of sequence, as they turn up. This channel is where members hear and see each series before it goes anywhere else." },
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
  { key: "hackney-squat-party-1999", title: "Hackney Free Party, 1999", alt: "Blanco y Negro — Hackney free party, 1999 — black-and-white photograph by Antaine Reilly" },
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
  { period: "1990s", title: "The London Years", body: "Arrived in London in my early twenties and went straight under the surface — underground clubs like Tyssen Street Studios, free parties that ran until Monday, house parties in every postcode, and the explosion of acid techno reshaping the city. I was there when the sound systems rolled into the financial district on June 18th, 1999." },
  { period: "2000s", title: "The Wandering", body: "Berlin, Barcelona, Tokyo, Cuba, Canada. The Love Parade in 2000, when over a million people gathered under one banner; festivals, club rooms and after-parties across borders. Each destination added new layers to how culture, music and community interweave. The camera was always there." },
  { period: "2010s", title: "Barcelona & Beyond", body: "Deep involvement in Barcelona's electronic music scene — Sónar, Razzmatazz, Poble Espanyol. Documenting club culture and festival seasons as the underground adapted to new realities." },
  { period: "Now", title: "La Pipa, Asturias", body: "Based in Asturias, where I co-founded La Pipa — a creative space carrying forward the spirit of those earlier experiments: collaboration, authenticity, and the belief that culture should be lived, not just consumed." },
];

export const UNBOXED = {
  title: "Unboxed: Thirty Years in the Making",
  body: "When I left my hometown in 1995 I made myself one promise: wherever I went, the camera went too. For almost thirty years — London, Berlin, Barcelona, Tokyo, Havana, Madrid, Asturias, New York, Miami, Boston, Toronto, Paris, Milan, Rome, Hamburg, Manchester, Brussels, Amsterdam, Lisbon… every city the work sent me to — I photographed the people, the places, the moments passing in front of me, and put it all away in boxes and hard drives. In my twenties I thought of it as a message in a bottle, sent forward to whoever I would become. None of it was ever meant to be published. In 2023 I moved home. In 2025 I started opening the boxes — and somewhere in the unpacking it became clear that thirty years of photographs and memories were worth more shared than stored. This is the beginning. The photographs appear here as I unbox them, in no particular order: thirty years in boxes and more than twenty moves from city to city have made a glorious chaos of the archive, and shuffled at random, these images seem to mean more than any chronology ever could. Blanco y Negro is the first series.",
};

export const POLICIES: { label: string; url: string }[] = [
  { label: "Refund policy", url: "https://checkout.shopify.com/106594828619/policies/63713411403.html" },
  { label: "Shipping policy", url: "https://checkout.shopify.com/106594828619/policies/63713575243.html" },
  { label: "Terms of service", url: "https://checkout.shopify.com/106594828619/policies/63713509707.html" },
  { label: "Privacy policy", url: "https://checkout.shopify.com/106594828619/policies/63707971915.html" },
  { label: "Contact information", url: "https://checkout.shopify.com/106594828619/policies/63713673547.html" },
  { label: "Aviso legal", url: "https://checkout.shopify.com/106594828619/policies/63713804619.html" },
];
