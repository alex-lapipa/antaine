import { BRAND, DISCIPLINES, UNBOXED } from "@/lib/site";
import { POSTS } from "@/lib/journal";
import { Visual, Waveform, Marquee, Mark } from "./primitives";
import { MEDIA } from "@/assets/media";
import { ArrowUpRight } from "lucide-react";

export function Home({ go }: { go: (p: string) => void }) {
  return (
    <div className="animate-rise">
      {/* Hero */}
      <section className="mx-auto max-w-[1400px] px-4 pb-8 pt-10 sm:px-8 sm:pt-16">
        <div className="grid gap-8 lg:grid-cols-[1.35fr_1fr]">
          <div className="flex flex-col justify-between">
            <div className="mb-6 flex items-center gap-3 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[hsl(var(--signal))] animate-dot" />
                IN THE STUDIO
              </span>
              <span>·</span>
              <span>{BRAND.location.toUpperCase()}</span>
            </div>
            <h1 className="font-display text-[13vw] font-light leading-[0.86] tracking-tightest sm:text-[9vw] lg:text-[7.2rem]">
              Sound.<br />
              Image.<br />
              <span className="italic text-[hsl(var(--accent))]">Object.</span> Space.
            </h1>
            <p className="mt-8 max-w-md font-sans text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
              {BRAND.tagline} One person, four disciplines that keep bleeding into each other.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                onClick={() => go("shop")}
                className="group inline-flex items-center gap-2 rounded-sm bg-[hsl(var(--ink))] px-5 py-3 font-mono text-xs uppercase tracking-label text-[hsl(var(--bone))] transition-transform hover:-translate-y-0.5"
              >
                See the work <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
              <button
                onClick={() => go("shop")}
                className="inline-flex items-center gap-2 rounded-sm border border-[hsl(var(--ink))] px-5 py-3 font-mono text-xs uppercase tracking-label transition-colors hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]"
              >
                Shop
              </button>
            </div>
          </div>

          {/* Featured plate stack */}
          <div className="flex flex-col gap-3">
            <button onClick={() => go("about")} className="group block w-full text-left">
              {/* Framed like the collection: black aluminium frame + museum mount */}
              <div className="bg-[#101011] p-[10px] shadow-[0_14px_34px_-12px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out group-hover:-translate-y-1">
                <div className="bg-[#f2ecdf] p-[7%]">
                  <div className="outline outline-1 outline-[#d8d0bd]">
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={MEDIA.portrait} alt="Antaine Reilly — self portrait" className="h-full w-full object-cover" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Gallery label */}
              <div className="mt-3 flex items-baseline justify-between px-1">
                <span className="font-display text-base italic">{BRAND.name}</span>
                <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-label text-[hsl(var(--muted-foreground))]">
                  Self portrait <ArrowUpRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </div>
            </button>
            <div className="flex items-center justify-between gap-3 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
              <div className="min-w-0">
                <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">NOW PLAYING</div>
                <div className="truncate font-display text-sm">Estuary — side A</div>
              </div>
              <Waveform seed="hero" bars={40} accent className="h-8 w-40" />
            </div>
          </div>
        </div>
      </section>

      <Marquee items={["Synthesis", "Field Recording", "Archival Print", "Cast Objects", "Listening Rooms", "Editions", "Dogs", "Nature", "Food"]} />

      {/* Unboxed — the project statement */}
      <section className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]">
        <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-8 sm:py-20">
          <h2 className="font-display text-3xl font-light leading-tight tracking-tightest text-[hsl(var(--accent))] sm:text-5xl">
            {UNBOXED.title.toUpperCase()}
          </h2>
          <p className="mx-auto mt-7 max-w-2xl text-[15px] leading-relaxed text-[hsl(var(--foreground))]/85">{UNBOXED.body}</p>
          <button
            onClick={() => go("shop")}
            className="mt-8 inline-flex items-center gap-2 rounded-sm border border-[hsl(var(--ink))] px-5 py-2.5 font-mono text-[11px] uppercase tracking-label transition-colors hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]"
          >
            Enter the collection →
          </button>
        </div>
      </section>

      {/* Disciplines index */}
      <section className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8 sm:py-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-label text-[hsl(var(--muted-foreground))]">The Four</h2>
          <Mark className="text-[hsl(var(--border))]" />
        </div>
        <div className="divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
          {DISCIPLINES.map((d, i) => (
            <button
              key={d.key}
              onClick={() => go("shop")}
              className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-5 text-left transition-colors hover:bg-[hsl(var(--card))] sm:gap-8"
            >
              <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">0{i + 1}</span>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6">
                <span className="font-display text-3xl font-light tracking-tightest transition-transform group-hover:translate-x-2 sm:text-4xl">
                  {d.label}
                </span>
                <span className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">— {d.verb}</span>
              </div>
              <span className="hidden max-w-xs text-right font-sans text-sm text-[hsl(var(--muted-foreground))] md:block">{d.note}</span>
            </button>
          ))}
        </div>
      </section>

      {/* From the Journal */}
      <section className="mx-auto max-w-[1400px] px-4 pb-16 sm:px-8">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="font-display text-2xl italic">Views from the edges</h2>
          <button onClick={() => go("journal")} className="link-underline font-mono text-xs uppercase tracking-label">Journal →</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 md:gap-4">
          {POSTS.map((p) => (
            <button key={p.slug} onClick={() => go("journal")} className="group grid grid-cols-[96px_1fr] items-center gap-4 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3 text-left transition-colors hover:border-[hsl(var(--ink))]">
              <div className="relative aspect-square edge-hairline"><Visual img={p.img} media={MEDIA} hue={p.hue} seed={p.slug} className="h-full w-full" fit={p.img === "aphex" ? "contain" : "cover"} /></div>
              <div className="min-w-0">
                <div className="font-mono text-[10px] tracking-label text-[hsl(var(--accent))]">{p.kicker.toUpperCase()}</div>
                <div className="mt-1 font-display text-lg leading-tight tracking-tightest group-hover:text-[hsl(var(--accent))]">{p.title}</div>
                <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">{p.published}</div>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Shop + Portal teasers */}
      <section className="mx-auto grid max-w-[1400px] gap-3 px-4 pb-20 sm:px-8 md:grid-cols-2 md:gap-4">
        <button onClick={() => go("shop")} className="group relative overflow-hidden border border-[hsl(var(--ink))] bg-[hsl(var(--card))] p-8 text-left">
          <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">01 — SHOP</div>
          <div className="mt-3 font-display text-3xl leading-tight">Records, prints & objects</div>
          <p className="mt-3 max-w-sm text-sm text-[hsl(var(--muted-foreground))]">Cassettes and vinyl, signed archival prints, and small-run cast objects. Shipped from Ireland.</p>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-[hsl(var(--accent))]">Enter shop <ArrowUpRight className="h-4 w-4" /></span>
        </button>
        <button onClick={() => go("portal")} className="group relative overflow-hidden border border-[hsl(var(--ink))] bg-[hsl(var(--ink))] p-8 text-left text-[hsl(var(--bone))]">
          <div className="font-mono text-[10px] tracking-label opacity-70">02 — PORTAL</div>
          <div className="mt-3 font-display text-3xl leading-tight">The private channel</div>
          <p className="mt-3 max-w-sm text-sm opacity-70">Stems, patch archives and LUTs for members — and the client space for commissions in progress.</p>
          <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-label text-[hsl(var(--signal))]">Sign in <ArrowUpRight className="h-4 w-4" /></span>
          <Waveform seed="portal-teaser" bars={60} className="pointer-events-none absolute -bottom-2 right-4 h-16 w-64 opacity-20" />
        </button>
      </section>
    </div>
  );
}
