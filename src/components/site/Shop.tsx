import { useEffect, useMemo, useRef, useState } from "react";
import { useCart, eur } from "@/lib/store";
import { fetchProducts, shopifyReady, type SFProduct, type SFVariant } from "@/lib/shopify";
import { Plus, Check, ArrowLeft, ArrowRight, ArrowUp, X } from "lucide-react";

/*
 * The Collection — a gallery, not a grid.
 * Mosaic rhythm with breathing space; every work opens into its own page
 * (hash route #shop/<handle>) with the story, the sizes and the details.
 */

// Desktop mosaic rhythm — cycles of six placements on a 12-col grid.
// Varied width, varied vertical offset: a hang, not a warehouse shelf.
const RHYTHM = [
  { col: "lg:col-start-1 lg:col-span-7", top: "lg:mt-0" },
  { col: "lg:col-start-9 lg:col-span-4", top: "lg:-mt-40" },
  { col: "lg:col-start-3 lg:col-span-5", top: "lg:mt-10" },
  { col: "lg:col-start-8 lg:col-span-5", top: "lg:-mt-24" },
  { col: "lg:col-start-1 lg:col-span-4", top: "lg:mt-6" },
  { col: "lg:col-start-6 lg:col-span-6", top: "lg:-mt-16" },
];

// ---- Mobile chapters ----------------------------------------------------
// The archive read as chapters, not inventory. Derived from Shopify tags at
// render time (Notion → Shopify stays the catalogue truth; this is a render
// detail). Mobile/tablet only — the desktop mosaic is untouched.
const CHAPTERS = [
  { key: "london", title: "London", sub: "The years of the street parties" },
  { key: "berlin", title: "Berlin", sub: "One world, one love" },
  { key: "night", title: "The Night", sub: "Clubs, bars, after hours" },
  { key: "travels", title: "The Travels", sub: "Cities in between" },
  { key: "stills", title: "Stills & Signs", sub: "Objects, details, quiet portraits" },
] as const;
type ChapterKey = (typeof CHAPTERS)[number]["key"];

function chapterFor(p: SFProduct): ChapterKey {
  const t = p.tags.map((x) => x.toLowerCase());
  const has = (...ks: string[]) => ks.some((k) => t.includes(k));
  if (has("london", "hackney", "willesden", "reclaim-the-streets")) return "london";
  if (has("berlin", "love-parade")) return "berlin";
  if (has("toronto", "canada", "cuba", "havana", "brooklyn", "new-york", "asturias", "travel", "road-trip", "cityscape", "urban")) return "travels";
  if (has("barcelona", "club", "nightlife", "night", "bar", "festival")) return "night";
  return "stills";
}

function handleFromHash(): string | null {
  const h = window.location.hash.replace("#", "");
  if (h.startsWith("shop/")) return decodeURIComponent(h.slice(5)) || null;
  return null;
}

export function Shop() {
  const [products, setProducts] = useState<SFProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");
  const [cat, setCat] = useState<string>("all");
  const [sel, setSel] = useState<string | null>(() => handleFromHash());

  useEffect(() => {
    let alive = true;
    fetchProducts(100)
      .then((p) => {
        if (!alive) return;
        setProducts(p);
        setStatus("ready");
      })
      .catch((e) => {
        if (!alive) return;
        setError(e instanceof Error ? e.message : "Could not load the shop.");
        setStatus("error");
      });
    return () => { alive = false; };
  }, []);

  useEffect(() => {
    const onHash = () => setSel(handleFromHash());
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const open = (handle: string) => {
    window.location.hash = `shop/${handle}`;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const close = () => {
    window.location.hash = "shop";
    setSel(null);
  };

  const cats = useMemo(() => {
    const seen: string[] = [];
    for (const p of products) if (p.productType && !seen.includes(p.productType)) seen.push(p.productType);
    return seen;
  }, [products]);

  const list = cat === "all" ? products : products.filter((p) => p.productType === cat);
  const current = sel ? products.find((p) => p.handle === sel) ?? null : null;
  const currentIdx = current ? list.findIndex((p) => p.handle === current.handle) : -1;

  // Mobile chapters — grouped view of the same list, in chapter order.
  const chapters = useMemo(
    () =>
      CHAPTERS.map((c) => ({ ...c, items: list.filter((p) => chapterFor(p) === c.key) })).filter(
        (c) => c.items.length > 0,
      ),
    [list],
  );

  if (current) {
    return (
      <ArtworkPage
        p={current}
        onClose={close}
        prev={currentIdx > 0 ? () => open(list[currentIdx - 1].handle) : undefined}
        next={currentIdx >= 0 && currentIdx < list.length - 1 ? () => open(list[currentIdx + 1].handle) : undefined}
      />
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] animate-rise px-4 py-10 sm:px-8 sm:py-16">
      {/* ---- Narrative header ---- */}
      <div className="mx-auto max-w-3xl text-center">
        <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
          UNBOXED — A COLLECTION BUILT OVER THIRTY YEARS
        </div>
        <h1 className="mt-3 font-display text-5xl font-light tracking-tightest sm:text-7xl">The Collection</h1>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-[hsl(var(--muted-foreground))]">
          Photographs that lived in boxes and hard drives for decades — London street parties, Berlin's
          Tiergarten, Barcelona nights, cities in between. Now leaving the archive one at a time, printed
          and framed to museum standard, made to order.
        </p>
        {status === "ready" && cats.length > 1 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            <FilterBtn active={cat === "all"} onClick={() => setCat("all")}>All works</FilterBtn>
            {cats.map((c) => (
              <FilterBtn key={c} active={cat === c} onClick={() => setCat(c)}>{c}</FilterBtn>
            ))}
          </div>
        )}
      </div>

      {status === "loading" && (
        <div className="mt-16 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse bg-[hsl(var(--card))] edge-hairline" />
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="mt-16 edge-hairline p-8 text-center">
          <p className="font-display text-2xl italic">The shop is briefly offline</p>
          <p className="mt-2 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
            {shopifyReady ? error : "Storefront not configured yet."}
          </p>
        </div>
      )}

      {status === "ready" && list.length > 0 && (
        <div className="mt-12 lg:mt-28">
          {/* Mobile / tablet: the same works, hung as chapters */}
          <div className="lg:hidden">
            <ChapterStrip chapters={chapters} />
            {chapters.map((c, ci) => (
              <section key={c.key} id={`chapter-${c.key}`} className="scroll-mt-32 pt-12 first:pt-8">
                <header>
                  <div className="font-mono text-[11px] tracking-label text-[hsl(var(--accent))]">
                    {String(ci + 1).padStart(2, "0")} — {c.items.length} {c.items.length === 1 ? "WORK" : "WORKS"}
                  </div>
                  <h2 className="mt-1 font-display text-3xl font-light tracking-tightest">{c.title}</h2>
                  <p className="mt-1 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
                    {c.sub.toUpperCase()}
                  </p>
                </header>
                <div className="mt-8 flex flex-col gap-16">
                  {c.items.map((p, i) => (
                    <div key={p.id} className={i % 3 === 1 ? "self-end w-[88%]" : i % 3 === 2 ? "self-start w-[88%]" : "w-full"}>
                      <Tile p={p} onOpen={() => open(p.handle)} />
                    </div>
                  ))}
                </div>
              </section>
            ))}
            <BackToTop count={list.length} />
          </div>
          {/* Desktop: mosaic rhythm on a 12-col grid */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-x-8">
            {list.map((p, i) => {
              const r = RHYTHM[i % RHYTHM.length];
              return (
                <div key={p.id} className={`${r.col} ${i < RHYTHM.length && i === 0 ? "" : r.top} mb-32`}>
                  <Tile p={p} onOpen={() => open(p.handle)} large={i % RHYTHM.length === 0} />
                </div>
              );
            })}
          </div>
        </div>
      )}

      <p className="mt-10 border-t border-[hsl(var(--border))] pt-6 text-center font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
        Museum-quality matte paper · Black aluminium frame · Made to order, ships in 5–10 days · Worldwide
      </p>
    </div>
  );
}

/* ---------- Mobile chapter navigation ---------- */

function ChapterStrip({ chapters }: { chapters: { key: string; title: string; items: SFProduct[] }[] }) {
  const [active, setActive] = useState<string>(chapters[0]?.key ?? "");

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        let cur = chapters[0]?.key ?? "";
        for (const c of chapters) {
          const el = document.getElementById(`chapter-${c.key}`);
          if (el && el.getBoundingClientRect().top <= 140) cur = c.key;
        }
        setActive(cur);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [chapters]);

  const jump = (key: string) => {
    document.getElementById(`chapter-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (chapters.length < 2) return null;
  return (
    <nav
      aria-label="Chapters"
      className="no-scrollbar sticky top-[45px] z-30 -mx-4 overflow-x-auto border-y border-[hsl(var(--border))] bg-[hsl(var(--background))]/90 px-4 backdrop-blur-md sm:-mx-8 sm:px-8"
    >
      <div className="flex w-max gap-2 py-2.5">
        {chapters.map((c) => (
          <button
            key={c.key}
            onClick={() => jump(c.key)}
            className={`whitespace-nowrap rounded-sm border px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-label transition-colors ${
              active === c.key
                ? "border-[hsl(var(--ink))] bg-[hsl(var(--ink))] text-[hsl(var(--bone))]"
                : "border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
            }`}
          >
            {c.title} · {c.items.length}
          </button>
        ))}
      </div>
    </nav>
  );
}

function BackToTop({ count }: { count: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 1600);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  if (!show) return null;
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label={`Back to top — ${count} works`}
      className="fixed bottom-5 right-4 z-30 inline-flex items-center gap-2 rounded-full bg-[hsl(var(--ink))]/90 px-4 py-3 font-mono text-[11px] uppercase tracking-label text-[hsl(var(--bone))] shadow-lg backdrop-blur-sm"
    >
      <ArrowUp className="h-3.5 w-3.5" /> Top
    </button>
  );
}

function Tile({ p, onOpen, large = false }: { p: SFProduct; onOpen: () => void; large?: boolean }) {
  const from = p.variants.length > 1 ? Math.min(...p.variants.map((v) => v.priceEUR)) : p.priceEUR;
  return (
    <button onClick={onOpen} className="group block w-full text-left" aria-label={`View ${p.title}`}>
      <div className="relative overflow-hidden edge-hairline bg-[hsl(var(--card))]">
        {p.image ? (
          <img
            src={p.image}
            alt={p.imageAlt ?? p.title}
            loading="lazy"
            className="aspect-square w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.025]"
          />
        ) : (
          <div className="aspect-square w-full" />
        )}
        <div className="pointer-events-none absolute inset-0 bg-[hsl(var(--ink))]/0 transition-colors duration-500 group-hover:bg-[hsl(var(--ink))]/5" />
        {!p.availableForSale && (
          <span className="absolute right-3 top-3 rounded-sm bg-[hsl(var(--ink))] px-2 py-1 font-mono text-[9px] uppercase tracking-label text-[hsl(var(--bone))]">
            Unavailable
          </span>
        )}
      </div>
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <h3 className={`font-display leading-tight ${large ? "text-3xl" : "text-xl"}`}>{p.title}</h3>
        <div className="shrink-0 font-mono text-[12px] text-[hsl(var(--muted-foreground))]">from {eur(from)}</div>
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-label text-[hsl(var(--muted-foreground))] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        View the work →
      </div>
    </button>
  );
}

/* ---------- Artwork page ---------- */

function ArtworkPage({ p, onClose, prev, next }: { p: SFProduct; onClose: () => void; prev?: () => void; next?: () => void }) {
  const { add } = useCart();
  const [variantId, setVariantId] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const [view, setView] = useState<"framed" | "print">("framed");

  // Mobile sticky buy bar — visible whenever the inline CTA is off-screen.
  const ctaRef = useRef<HTMLButtonElement | null>(null);
  const [ctaInView, setCtaInView] = useState(false);
  useEffect(() => {
    const el = ctaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setCtaInView(e.isIntersecting), { rootMargin: "0px 0px -56px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [p.id]);

  useEffect(() => { setVariantId(null); setAdded(false); setView("framed"); window.scrollTo({ top: 0 }); }, [p.id]);

  const multi = p.variants.length > 1;
  const sel: SFVariant | undefined =
    p.variants.find((v) => v.id === variantId) ?? p.variants.find((v) => v.availableForSale) ?? p.variants[0];

  // Featured image is the framed-in-interior scene; the original photograph
  // is the next image on the product.
  const framed = p.image;
  const print = p.images.find((im) => im.url !== p.image)?.url ?? null;
  const shown = view === "print" && print ? print : framed;

  const addSelected = () => {
    if (!sel) return;
    add({
      ...p,
      id: sel.id,
      variantId: sel.id,
      priceEUR: sel.priceEUR,
      title: multi ? `${p.title} — ${sel.title}` : p.title,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="animate-rise pb-24 lg:pb-0">
      <div className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8">
        <div className="flex items-center justify-between">
          <button onClick={onClose} className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--ink))]">
            <ArrowLeft className="h-3.5 w-3.5" /> The Collection
          </button>
          <div className="flex items-center gap-4">
            {prev && (
              <button onClick={prev} aria-label="Previous work" className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--ink))]"><ArrowLeft className="h-4 w-4" /></button>
            )}
            {next && (
              <button onClick={next} aria-label="Next work" className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--ink))]"><ArrowRight className="h-4 w-4" /></button>
            )}
            <button onClick={onClose} aria-label="Close" className="text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--ink))]"><X className="h-4 w-4" /></button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-12 lg:grid-cols-[7fr_5fr] lg:gap-16">
          {/* Image column */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <div className="overflow-hidden edge-hairline bg-[hsl(var(--card))]">
              {shown && <img src={shown} alt={p.imageAlt ?? p.title} className="w-full object-contain" />}
            </div>
            {print && (
              <div className="mt-3 flex gap-2">
                <ViewBtn active={view === "framed"} onClick={() => setView("framed")}>In the room</ViewBtn>
                <ViewBtn active={view === "print"} onClick={() => setView("print")}>The photograph</ViewBtn>
              </div>
            )}
          </div>

          {/* Detail column */}
          <div className="max-w-xl">
            {p.productType && (
              <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">{p.productType.toUpperCase()}</div>
            )}
            <h1 className="mt-2 font-display text-4xl font-light leading-[1.05] tracking-tightest sm:text-5xl">{p.title}</h1>

            {p.descriptionHtml ? (
              <div
                className="prose-story mt-6 space-y-4 text-[15px] leading-relaxed text-[hsl(var(--foreground))]/90 [&_p]:mb-3"
                dangerouslySetInnerHTML={{ __html: p.descriptionHtml }}
              />
            ) : p.description ? (
              <p className="mt-6 text-[15px] leading-relaxed">{p.description}</p>
            ) : null}

            {/* Sizes */}
            <div className="mt-10">
              <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
                {multi ? "CHOOSE A SIZE" : "EDITION"}
              </div>
              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {p.variants.map((v) => (
                  <button
                    key={v.id}
                    disabled={!v.availableForSale}
                    onClick={() => setVariantId(v.id)}
                    className={`flex items-baseline justify-between gap-3 rounded-sm border px-4 py-3 text-left transition-colors duration-300 ${
                      sel?.id === v.id
                        ? "border-[hsl(var(--ink))] bg-[hsl(var(--ink))] text-[hsl(var(--bone))]"
                        : v.availableForSale
                          ? "border-[hsl(var(--border))] hover:border-[hsl(var(--ink))]"
                          : "cursor-not-allowed border-[hsl(var(--border))] opacity-40"
                    }`}
                  >
                    <span className="font-mono text-[12px] tracking-label">{v.title}</span>
                    <span className="font-mono text-[13px]">{eur(v.priceEUR)}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              ref={ctaRef}
              disabled={!p.availableForSale || !sel}
              onClick={addSelected}
              className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-sm border py-3.5 font-mono text-[12px] uppercase tracking-label transition-colors ${
                !p.availableForSale
                  ? "cursor-not-allowed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                  : "border-[hsl(var(--ink))] bg-[hsl(var(--ink))] text-[hsl(var(--bone))] hover:bg-transparent hover:text-[hsl(var(--ink))]"
              }`}
            >
              {!p.availableForSale
                ? "Unavailable"
                : added
                  ? (<><Check className="h-4 w-4" /> Added to cart</>)
                  : (<>Add to cart — {sel ? eur(sel.priceEUR) : ""} <Plus className="h-4 w-4" /></>)}
            </button>

            {/* Spec */}
            <dl className="mt-10 space-y-0 border-t border-[hsl(var(--border))]">
              <Spec k="Print" v="Museum-quality matte paper, 200 gsm, archival pigment" />
              <Spec k="Frame" v="Black aluminium, 10 mm profile, plexiglass front" />
              <Spec k="Production" v="Each piece printed and framed to order — no stock, no seconds" />
              <Spec k="Delivery" v="5–10 days, tracked, ready to hang · ships worldwide" />
            </dl>

            <p className="mt-8 font-mono text-[10px] leading-relaxed tracking-label text-[hsl(var(--muted-foreground))]">
              SECURE CHECKOUT VIA SHOPIFY · VISA / MASTERCARD / SHOP PAY · QUESTIONS — ALEX@RMTV.IO
            </p>
          </div>
        </div>
      </div>

      {/* Mobile sticky buy bar — thumb-zone add-to-cart while the inline CTA is off-screen */}
      {p.availableForSale && sel && !ctaInView && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[hsl(var(--border))] bg-[hsl(var(--background))]/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="min-w-0">
              <div className="truncate font-display text-sm leading-tight">{p.title}</div>
              <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
                {multi ? `${sel.title} · ` : ""}{eur(sel.priceEUR)}
              </div>
            </div>
            <button
              onClick={addSelected}
              className="inline-flex shrink-0 items-center gap-2 rounded-sm bg-[hsl(var(--ink))] px-5 py-3 font-mono text-[11px] uppercase tracking-label text-[hsl(var(--bone))]"
            >
              {added ? (<><Check className="h-4 w-4" /> Added</>) : (<>Add to cart <Plus className="h-4 w-4" /></>)}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Spec({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-6 border-b border-[hsl(var(--border))] py-3">
      <dt className="w-28 shrink-0 font-mono text-[10px] uppercase tracking-label text-[hsl(var(--muted-foreground))]">{k}</dt>
      <dd className="text-[13px] leading-relaxed">{v}</dd>
    </div>
  );
}

function ViewBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border px-3 py-1.5 font-mono text-[10px] uppercase tracking-label transition-colors ${
        active ? "border-[hsl(var(--ink))] bg-[hsl(var(--ink))] text-[hsl(var(--bone))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--ink))]"
      }`}
    >
      {children}
    </button>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-label transition-colors ${
        active ? "border-[hsl(var(--ink))] bg-[hsl(var(--ink))] text-[hsl(var(--bone))]" : "border-[hsl(var(--border))] hover:border-[hsl(var(--ink))]"
      }`}
    >
      {children}
    </button>
  );
}
