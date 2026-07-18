import { useState } from "react";
import { DISCIPLINES, WORKS, BLANCO_Y_NEGRO, type Discipline, type Work } from "@/lib/site";
import { Visual, Waveform } from "./primitives";
import { MEDIA } from "@/assets/media";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

export function WorkIndex({ openWork }: { openWork: (id: string) => void }) {
  const [filter, setFilter] = useState<Discipline | "all">("all");
  const list = filter === "all" ? WORKS : WORKS.filter((w) => w.discipline === filter);

  return (
    <div className="mx-auto max-w-[1400px] animate-rise px-4 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">INDEX — {list.length} WORKS</div>
          <h1 className="mt-2 font-display text-5xl font-light tracking-tightest sm:text-6xl">Work</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["all", ...DISCIPLINES.map((d) => d.key)] as const).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k as Discipline | "all")}
              className={`rounded-sm border px-3 py-1.5 font-mono text-[11px] uppercase tracking-label transition-colors ${
                filter === k
                  ? "border-[hsl(var(--ink))] bg-[hsl(var(--ink))] text-[hsl(var(--bone))]"
                  : "border-[hsl(var(--border))] hover:border-[hsl(var(--ink))]"
              }`}
            >
              {k === "all" ? "All" : k}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((w) => (
          <button key={w.id} onClick={() => openWork(w.id)} className="group text-left">
            <div className="relative aspect-[5/4] edge-hairline">
              <Visual img={w.img} media={MEDIA} hue={w.hue} seed={w.id} className="h-full w-full" label={w.plate} />
              {w.discipline === "sound" && (
                <Waveform seed={w.id} bars={48} className="absolute bottom-3 left-3 right-3 h-8 opacity-70 mix-blend-difference" />
              )}
            </div>
            <div className="mt-3 flex items-baseline justify-between gap-3 border-b border-[hsl(var(--border))] pb-3">
              <h3 className="font-display text-xl leading-tight transition-colors group-hover:text-[hsl(var(--accent))]">{w.title}</h3>
              <span className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">{w.year}</span>
            </div>
            <p className="mt-2 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">{w.medium}</p>
          </button>
        ))}
      </div>

      {/* Blanco y Negro — documentary series (real photographs) */}
      <section className="mt-16">
        <div className="mb-6 flex items-end justify-between border-t border-[hsl(var(--border))] pt-8">
          <div>
            <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">SERIES — BLANCO Y NEGRO</div>
            <h2 className="mt-2 font-display text-4xl font-light tracking-tightest">Blanco y Negro</h2>
          </div>
          <span className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">{BLANCO_Y_NEGRO.length} PLATES</span>
        </div>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
          {BLANCO_Y_NEGRO.map((g) => (
            <figure key={g.key} className="break-inside-avoid edge-hairline">
              <img src={MEDIA[g.key]} alt={g.alt} loading="lazy" className="w-full" />
              <figcaption className="mt-2 font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">{g.title}</figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

export function WorkDetail({ work, onClose }: { work: Work | null; onClose: () => void }) {
  return (
    <Dialog open={!!work} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-3xl overflow-hidden border-[hsl(var(--ink))] bg-[hsl(var(--background))] p-0 [&>button]:hidden">
        {work && (
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-square md:aspect-auto">
              <Visual img={work.img} media={MEDIA} hue={work.hue} seed={work.id} className="h-full min-h-[280px] w-full" label={work.plate} />
            </div>
            <div className="relative flex flex-col p-6">
              <button onClick={onClose} className="absolute right-4 top-4 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]">
                <X className="h-5 w-5" />
              </button>
              <div className="font-mono text-[11px] tracking-label text-[hsl(var(--accent))]">{work.discipline.toUpperCase()} · {work.year}</div>
              <h2 className="mt-2 font-display text-4xl font-light leading-none tracking-tightest">{work.title}</h2>
              <p className="mt-4 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">{work.medium}</p>
              <p className="mt-4 text-sm leading-relaxed text-[hsl(var(--foreground))]">{work.blurb}</p>
              {work.discipline === "sound" && (
                <div className="mt-6 flex items-center gap-3 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-3">
                  <button className="grid h-9 w-9 place-items-center rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--bone))]">▶</button>
                  <Waveform seed={work.id + "-detail"} bars={56} accent className="h-8 flex-1" />
                </div>
              )}
              <div className="mt-auto pt-6 font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">
                {work.plate} · ANTAINE REILLY
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
