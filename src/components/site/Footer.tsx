import { BRAND, NAV, POLICIES } from "@/lib/site";
import { openConsentSettings } from "@/lib/consent";
import { Waveform } from "./primitives";

export function Footer({ go }: { go: (p: string) => void }) {
  return (
    <footer className="relative mt-auto overflow-hidden border-t border-[hsl(var(--ink))] bg-[hsl(var(--ink))] text-[hsl(var(--bone))]">
      <div className="mx-auto max-w-[1400px] px-4 py-12 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="font-display text-4xl font-light tracking-tightest">Antaine Reilly</div>
            <p className="mt-3 max-w-sm text-sm opacity-60">{BRAND.tagline}</p>
            <Waveform seed="footer" bars={80} accent className="mt-6 h-8 w-full max-w-sm opacity-40" />
          </div>
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-label opacity-50">Index</div>
            <ul className="grid gap-2">
              {NAV.map((n) => (
                <li key={n.key}>
                  <button onClick={() => go(n.key)} className="link-underline -my-2 py-2 font-sans text-sm opacity-80 hover:opacity-100">{n.label}</button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-label opacity-50">Contact</div>
            <ul className="grid gap-2 text-sm opacity-80">
              <li><a href={`mailto:${BRAND.email}`} className="link-underline">{BRAND.email}</a></li>
              <li><a href={`https://instagram.com/${BRAND.instagram}`} target="_blank" rel="noreferrer" className="link-underline">@{BRAND.instagram}</a></li>
              <li><a href="https://www.lapipa.ai" target="_blank" rel="noreferrer" className="link-underline">lapipa.ai</a></li>
              <li><a href={BRAND.lapipa} target="_blank" rel="noreferrer" className="link-underline">lapipa.io</a></li>
              <li className="opacity-60">{BRAND.location}</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-[hsl(var(--bone))]/15 pt-5">
          <ul className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[10px] tracking-label opacity-50 max-md:gap-y-3 max-md:text-[11px]">
            {POLICIES.map((p) => (
              <li key={p.label}>
                <a href={p.url} target="_blank" rel="noreferrer" className="link-underline -my-2 inline-block py-2 hover:opacity-100">{p.label}</a>
              </li>
            ))}
            <li>
              <button onClick={openConsentSettings} className="link-underline -my-2 py-2 hover:opacity-100">Cookie settings</button>
            </li>
            <li><a href="/prints/" className="link-underline -my-2 inline-block py-2 hover:opacity-100">Print shop</a></li>
            <li><a href="/trade/" className="link-underline -my-2 inline-block py-2 hover:opacity-100">Trade &amp; hospitality</a></li>
          </ul>
        </div>
        <div className="mt-6 flex flex-col justify-between gap-2 border-t border-[hsl(var(--bone))]/15 pt-5 font-mono text-[10px] tracking-label opacity-50 sm:flex-row">
          <span>© {new Date().getFullYear()} ANTAINE REILLY · ALL RIGHTS RESERVED</span>
          <span>ÉIRE ⁄ ESPAÑA · MADE WITH INTENT</span>
        </div>
      </div>
    </footer>
  );
}
