import { useState } from "react";
import { BRAND, DISCIPLINES } from "@/lib/site";
import { Img, Mark } from "./primitives";
import { MEDIA } from "@/assets/media";
import { ArrowRight } from "lucide-react";

export function About() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", note: "" });

  return (
    <div className="mx-auto max-w-[1400px] animate-rise px-4 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">{BRAND.established.toUpperCase()}</div>
          <h1 className="mt-2 max-w-2xl font-display text-4xl font-light leading-[1.02] tracking-tightest sm:text-5xl">
            {BRAND.statement}
          </h1>

          <div className="mt-10 grid gap-px border border-[hsl(var(--border))] bg-[hsl(var(--border))] sm:grid-cols-2">
            {DISCIPLINES.map((d) => (
              <div key={d.key} className="bg-[hsl(var(--background))] p-5">
                <div className="font-mono text-[10px] tracking-label text-[hsl(var(--accent))]">{d.verb.toUpperCase()}</div>
                <div className="mt-1 font-display text-2xl">{d.label}</div>
                <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{d.note}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
            <span>SELECTED: XIXÓN SOUND · LA PIPA · PRIVATE COMMISSIONS</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative aspect-[4/5] edge-hairline">
            <Img src={MEDIA.img0984} className="h-full w-full" label="PORTRAIT" alt="Antaine Reilly" />
          </div>

          <div className="border border-[hsl(var(--ink))] bg-[hsl(var(--card))] p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-label">Enquiries & commissions</span>
              <Mark className="text-[hsl(var(--border))]" />
            </div>
            {sent ? (
              <div className="py-8 text-center">
                <p className="font-display text-2xl italic">Message away.</p>
                <p className="mt-1 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">I'll reply from {BRAND.email}.</p>
              </div>
            ) : (
              <div className="grid gap-3">
                <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Name"
                  className="w-full border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm outline-none focus:border-[hsl(var(--accent))]" />
                <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Email"
                  className="w-full border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm outline-none focus:border-[hsl(var(--accent))]" />
                <textarea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} placeholder="Sound, print, object or space — tell me what you're after." rows={4}
                  className="w-full resize-none border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 text-sm outline-none focus:border-[hsl(var(--accent))]" />
                <button onClick={() => setSent(true)}
                  className="mt-1 flex items-center justify-center gap-2 rounded-sm bg-[hsl(var(--ink))] py-3 font-mono text-xs uppercase tracking-label text-[hsl(var(--bone))] transition-transform hover:-translate-y-0.5">
                  Send <ArrowRight className="h-4 w-4" />
                </button>
                <p className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">v0 form · production posts via Resend edge function</p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 font-mono text-[11px] tracking-label">
            <a href={`mailto:${BRAND.email}`} className="link-underline">{BRAND.email}</a>
            <a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer" className="link-underline text-[hsl(var(--accent))]">@{BRAND.instagram}</a>
            <a href={BRAND.lapipa} target="_blank" rel="noreferrer" className="link-underline">lapipa.io</a>
          </div>
        </div>
      </div>
    </div>
  );
}
