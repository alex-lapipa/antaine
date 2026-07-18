import { useEffect, useMemo, useState } from "react";
import { useCart, eur } from "@/lib/store";
import { fetchProducts, hueFor, shopifyReady, type SFProduct } from "@/lib/shopify";
import { Visual } from "./primitives";
import { Plus, Check } from "lucide-react";

export function Shop() {
  const { add } = useCart();
  const [products, setProducts] = useState<SFProduct[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [error, setError] = useState<string>("");
  const [cat, setCat] = useState<string>("all");
  const [justAdded, setJustAdded] = useState<string | null>(null);

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
    return () => {
      alive = false;
    };
  }, []);

  const cats = useMemo(() => {
    const seen: string[] = [];
    for (const p of products) if (p.productType && !seen.includes(p.productType)) seen.push(p.productType);
    return seen;
  }, [products]);

  const list = cat === "all" ? products : products.filter((p) => p.productType === cat);

  return (
    <div className="mx-auto max-w-[1400px] animate-rise px-4 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">SHOP — SHIPS FROM IRELAND</div>
          <h1 className="mt-2 font-display text-5xl font-light tracking-tightest sm:text-6xl">Editions & objects</h1>
        </div>
        {status === "ready" && cats.length > 1 && (
          <div className="flex flex-wrap gap-2">
            <FilterBtn active={cat === "all"} onClick={() => setCat("all")}>All</FilterBtn>
            {cats.map((c) => (
              <FilterBtn key={c} active={cat === c} onClick={() => setCat(c)}>{c}</FilterBtn>
            ))}
          </div>
        )}
      </div>

      {status === "loading" && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[4/5] animate-pulse bg-[hsl(var(--card))] edge-hairline" />
              <div className="mt-3 h-4 w-2/3 animate-pulse bg-[hsl(var(--card))]" />
            </div>
          ))}
        </div>
      )}

      {status === "error" && (
        <div className="edge-hairline p-8 text-center">
          <p className="font-display text-2xl italic">The shop is briefly offline</p>
          <p className="mt-2 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
            {shopifyReady ? error : "Storefront not configured yet."}
          </p>
        </div>
      )}

      {status === "ready" && list.length === 0 && (
        <div className="edge-hairline p-8 text-center">
          <p className="font-display text-2xl italic">Nothing in this collection yet</p>
        </div>
      )}

      {status === "ready" && list.length > 0 && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p) => {
            const soldOut = !p.availableForSale;
            const added = justAdded === p.id;
            return (
              <div key={p.id} className="group flex flex-col">
                <div className="relative aspect-[4/5] edge-hairline">
                  <Visual
                    img={p.image ? p.handle : undefined}
                    media={p.image ? { [p.handle]: p.image } : undefined}
                    hue={hueFor(p.handle)}
                    seed={p.handle}
                    label={(p.productType || "Print").toUpperCase()}
                    fit="cover"
                    className="h-full w-full"
                  />
                  {soldOut && (
                    <span className="absolute right-2 top-2 z-10 rounded-sm bg-[hsl(var(--ink))] px-2 py-1 font-mono text-[9px] uppercase tracking-label text-[hsl(var(--bone))]">
                      Unavailable
                    </span>
                  )}
                </div>

                <div className="mt-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-display text-xl leading-tight">{p.title}</h3>
                    {p.productType && (
                      <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">{p.productType}</div>
                    )}
                  </div>
                  <div className="shrink-0 font-mono text-sm">{eur(p.priceEUR)}</div>
                </div>

                <button
                  disabled={soldOut}
                  onClick={() => {
                    add(p);
                    setJustAdded(p.id);
                    setTimeout(() => setJustAdded(null), 1200);
                  }}
                  className={`mt-4 inline-flex items-center justify-center gap-2 rounded-sm border py-2.5 font-mono text-[11px] uppercase tracking-label transition-colors ${
                    soldOut
                      ? "cursor-not-allowed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                      : "border-[hsl(var(--ink))] hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]"
                  }`}
                >
                  {soldOut ? "Unavailable" : added ? (<><Check className="h-4 w-4" /> Added</>) : (<>Add to cart <Plus className="h-4 w-4" /></>)}
                </button>
              </div>
            );
          })}
        </div>
      )}

      <p className="mt-14 border-t border-[hsl(var(--border))] pt-6 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
        Editions signed & numbered · Prints made to order in 5–10 days · Trade & gallery enquiries via About
      </p>
    </div>
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
