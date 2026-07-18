import { NAV } from "@/lib/site";
import { useCart, useAuth } from "@/lib/store";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Nav({ page, go }: { page: string; go: (p: string) => void }) {
  const { count, setOpen } = useCart();
  const { user } = useAuth();
  const [mobile, setMobile] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-8">
        <button onClick={() => go("home")} className="group flex items-baseline gap-2 text-left">
          <span className="font-display text-lg font-semibold leading-none tracking-tightest">Antaine Reilly</span>
          <span className="hidden font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))] sm:inline">
            EIRE ⁄ ESP
          </span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => go(n.key)}
              className={`link-underline font-mono text-xs uppercase tracking-label transition-colors ${
                page === n.key ? "text-[hsl(var(--accent))]" : "text-[hsl(var(--foreground))] hover:text-[hsl(var(--accent))]"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="relative -m-2.5 p-2.5 font-mono text-xs uppercase tracking-label hover:text-[hsl(var(--accent))]"
          >
            Cart
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[hsl(var(--ink))] px-1 text-[10px] text-[hsl(var(--bone))]">
              {count}
            </span>
          </button>
          <button className="-m-3 p-3 md:hidden" onClick={() => setMobile((v) => !v)} aria-label="Menu">
            {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobile && (
        <nav className="grid gap-1 border-t border-[hsl(var(--border))] px-4 py-3 md:hidden">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => { go(n.key); setMobile(false); }}
              className={`py-3 text-left font-mono text-sm uppercase tracking-label ${
                page === n.key ? "text-[hsl(var(--accent))]" : ""
              }`}
            >
              {n.label}{n.key === "portal" && user ? " · signed in" : ""}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
