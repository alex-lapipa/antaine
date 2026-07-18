import { useCart, eur } from "@/lib/store";
import { Visual } from "./primitives";
import { MEDIA } from "@/assets/media";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Minus, Plus, X } from "lucide-react";
import { useState } from "react";

export function Cart() {
  const { lines, open, setOpen, setQty, remove, subtotal, count, clear } = useCart();
  const [done, setDone] = useState(false);

  const checkout = () => {
    // v0: simulate Shopify Storefront checkout redirect
    setDone(true);
    setTimeout(() => { setDone(false); clear(); setOpen(false); }, 1800);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent className="flex w-full flex-col border-l-[hsl(var(--ink))] bg-[hsl(var(--background))] p-0 sm:max-w-md [&>button]:hidden">
        <SheetHeader className="flex-row items-center justify-between space-y-0 border-b border-[hsl(var(--border))] p-5">
          <SheetTitle className="font-mono text-xs uppercase tracking-label">Cart · {count}</SheetTitle>
          <button onClick={() => setOpen(false)}><X className="h-5 w-5" /></button>
        </SheetHeader>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 p-8 text-center">
            <p className="font-display text-2xl italic">Nothing here yet</p>
            <p className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">Records, prints & objects in the shop.</p>
          </div>
        ) : (
          <>
            <div className="flex-1 divide-y divide-[hsl(var(--border))] overflow-y-auto px-5">
              {lines.map((l) => (
                <div key={l.product.handle} className="flex gap-4 py-4">
                  <div className="relative h-20 w-20 shrink-0 edge-hairline">
                    <Visual img={l.product.img} media={MEDIA} hue={l.product.hue} seed={l.product.handle} className="h-full w-full" />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-display text-base leading-tight">{l.product.title}</div>
                      <button onClick={() => remove(l.product.handle)} className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]"><X className="h-4 w-4" /></button>
                    </div>
                    <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">{l.product.kind}</div>
                    <div className="mt-auto flex items-center justify-between pt-2">
                      <div className="flex items-center border border-[hsl(var(--border))]">
                        <button onClick={() => setQty(l.product.handle, l.qty - 1)} className="grid h-7 w-7 place-items-center hover:bg-[hsl(var(--card))]"><Minus className="h-3 w-3" /></button>
                        <span className="w-8 text-center font-mono text-xs">{l.qty}</span>
                        <button onClick={() => setQty(l.product.handle, l.qty + 1)} className="grid h-7 w-7 place-items-center hover:bg-[hsl(var(--card))]"><Plus className="h-3 w-3" /></button>
                      </div>
                      <div className="font-mono text-sm">{eur(l.product.priceEUR * l.qty)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-[hsl(var(--border))] p-5">
              <div className="mb-1 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-label text-[hsl(var(--muted-foreground))]">Subtotal</span>
                <span className="font-display text-xl">{eur(subtotal)}</span>
              </div>
              <p className="mb-4 font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">Shipping & tax at checkout · EU / UK / US</p>
              <button
                onClick={checkout}
                disabled={done}
                className="w-full rounded-sm bg-[hsl(var(--ink))] py-3.5 font-mono text-xs uppercase tracking-label text-[hsl(var(--bone))] transition-transform hover:-translate-y-0.5 disabled:opacity-60"
              >
                {done ? "Redirecting to checkout…" : "Checkout"}
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
