import { useState } from "react";
import { PRODUCTS, DISCIPLINES, type Discipline } from "@/lib/site";
import { useCart, eur } from "@/lib/store";
import { Visual } from "./primitives";
import { MEDIA } from "@/assets/media";
import { Plus, Check } from "lucide-react";

export function Shop() {
  const { add } = useCart();
  const [cat, setCat] = useState<Discipline | "all">("all");
  const [justAdded, setJustAdded] = useState<string | null>(null);
  const list = cat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat);

  const cats = DISCIPLINES.filter((d) => PRODUCTS.some((p) => p.category === d.key));

  return (
    <div className="mx-auto max-w-[1400px] animate-rise px-4 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">SHOP — SHIPS FROM IRELAND</div>
          <h1 className="mt-2 font-display text-5xl font-light tracking-tightest sm:text-6xl">Editions & objects</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterBtn active={cat === "all"} onClick={() => setCat("all")}>All</FilterBtn>
          {cats.map((c) => (
            <FilterBtn key={c.key} active={cat === c.key} onClick={() => setCat(c.key)}>{c.label}</FilterBtn>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => {
          const soldOut = p.status === "sold-out";
          const added = justAdded === p.handle;
          return (
            <div key={p.handle} className="group flex flex-col">
              <div className="relative aspect-[4/5] edge-hairline">
                <Visual img={p.img} media={MEDIA} hue={p.hue} seed={p.handle} className="h-full w-full" label={p.kind.toUpperCase()} />
                {p.status !== "available" && (
                  <span className={`absolute right-2 top-2 z-10 rounded-sm px-2 py-1 font-mono text-[9px] uppercase tracking-label ${
                    soldOut ? "bg-[hsl(var(--ink))] text-[hsl(var(--bone))]" : "bg-[hsl(var(--signal))] text-[hsl(var(--ink))]"
                  }`}>
                    {soldOut ? "Sold out" : "Pre-order"}
                  </span>
                )}
              </div>

              <div className="mt-3 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-xl leading-tight">{p.title}</h3>
                  <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">
                    {p.kind}{p.edition ? ` · ${p.edition}` : ""}
                  </div>
                </div>
                <div className="shrink-0 font-mono text-sm">{eur(p.priceEUR)}</div>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{p.blurb}</p>

              <button
                disabled={soldOut}
                onClick={() => { add(p); setJustAdded(p.handle); setTimeout(() => setJustAdded(null), 1200); }}
                className={`mt-4 inline-flex items-center justify-center gap-2 rounded-sm border py-2.5 font-mono text-[11px] uppercase tracking-label transition-colors ${
                  soldOut
                    ? "cursor-not-allowed border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]"
                    : "border-[hsl(var(--ink))] hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]"
                }`}
              >
                {soldOut ? "Sold out" : added ? (<><Check className="h-4 w-4" /> Added</>) : (
                  <>{p.status === "preorder" ? "Pre-order" : "Add to cart"} <Plus className="h-4 w-4" /></>
                )}
              </button>
            </div>
          );
        })}
      </div>

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
