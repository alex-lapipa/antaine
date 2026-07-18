import { useMemo } from "react";

// Deterministic pseudo-random from a string seed -> stable per work/product.
function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) { h ^= seed.charCodeAt(i); h = Math.imul(h, 16777619); }
  return () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 10000) / 10000; };
}

/** Generated duotone "plate" — stands in for a photographic/print work. */
export function Plate({ hue, seed, className = "", label }: { hue: number; seed: string; className?: string; label?: string }) {
  const rows = useMemo(() => {
    const r = seeded(seed);
    const kind = Math.floor(r() * 3); // 0 bands, 1 orbit, 2 grid
    const bands = Array.from({ length: 7 }, () => 0.2 + r() * 0.8);
    const cx = 20 + r() * 60, cy = 20 + r() * 60, rad = 14 + r() * 26;
    const dots = Array.from({ length: 5 }, () => ({ x: r() * 100, y: r() * 100, s: 2 + r() * 10 }));
    return { kind, bands, cx, cy, rad, dots };
  }, [seed]);

  const base = `hsl(${hue} 44% 42%)`;
  const deep = `hsl(${hue} 40% 16%)`;
  const light = `hsl(${(hue + 12) % 360} 46% 74%)`;

  return (
    <div className={`relative overflow-hidden grain bg-[hsl(var(--card))] ${className}`}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={light} />
            <stop offset="1" stopColor={base} />
          </linearGradient>
        </defs>
        <rect width="100" height="100" fill={`url(#g-${seed})`} />
        {rows.kind === 0 && rows.bands.map((b, i) => (
          <rect key={i} x="0" y={i * 14} width="100" height={b * 12} fill={deep} opacity={0.14 + (i % 3) * 0.08} />
        ))}
        {rows.kind === 1 && (
          <>
            <circle cx={rows.cx} cy={rows.cy} r={rows.rad} fill="none" stroke={deep} strokeWidth="0.8" opacity="0.7" />
            <circle cx={rows.cx} cy={rows.cy} r={rows.rad * 0.55} fill={deep} opacity="0.9" />
            <circle cx={rows.cx} cy={rows.cy} r={rows.rad * 1.5} fill="none" stroke={deep} strokeWidth="0.4" opacity="0.4" />
          </>
        )}
        {rows.kind === 2 && rows.dots.map((d, i) => (
          <rect key={i} x={d.x} y={d.y} width={d.s} height={d.s} fill={deep} opacity="0.55" />
        ))}
        <line x1="0" y1="0" x2="100" y2="100" stroke={deep} strokeWidth="0.2" opacity="0.25" />
      </svg>
      {label && (
        <span className="absolute left-2 top-2 z-10 font-mono text-[9px] tracking-label text-[hsl(var(--card))] mix-blend-difference">
          {label}
        </span>
      )}
    </div>
  );
}

/** Real photograph with the same editorial framing as Plate. */
export function Img({ src, alt = "", className = "", label, fit = "cover", tint = false }: { src: string; alt?: string; className?: string; label?: string; fit?: "cover" | "contain"; tint?: boolean }) {
  return (
    <div className={`relative overflow-hidden grain bg-[hsl(var(--ink))] ${className}`}>
      <img src={src} alt={alt} loading="lazy" className={`absolute inset-0 h-full w-full ${fit === "cover" ? "object-cover" : "object-contain"}`} />
      {tint && <div className="absolute inset-0 bg-[hsl(var(--accent))]/10 mix-blend-multiply" />}
      {label && (
        <span className="absolute left-2 top-2 z-10 font-mono text-[9px] tracking-label text-[hsl(var(--bone))] mix-blend-difference">
          {label}
        </span>
      )}
    </div>
  );
}

/** Renders a real image if `img` (a MEDIA key) resolves, else a generated Plate. */
export function Visual({ img, media, hue, seed, className = "", label, fit }: { img?: string; media?: Record<string, string>; hue: number; seed: string; className?: string; label?: string; fit?: "cover" | "contain" }) {
  const src = img && media ? media[img] : undefined;
  return src
    ? <Img src={src} className={className} label={label} fit={fit} alt={seed} />
    : <Plate hue={hue} seed={seed} className={className} label={label} />;
}
export function Waveform({ seed = "wf", bars = 64, className = "", accent = false }: { seed?: string; bars?: number; className?: string; accent?: boolean }) {
  const heights = useMemo(() => {
    const r = seeded(seed);
    return Array.from({ length: bars }, (_, i) => {
      const env = Math.sin((i / bars) * Math.PI); // envelope
      return Math.max(0.08, env * (0.35 + r() * 0.65));
    });
  }, [seed, bars]);
  return (
    <div className={`flex items-center gap-[2px] ${className}`} aria-hidden>
      {heights.map((h, i) => (
        <span
          key={i}
          className="w-[3px] shrink-0 rounded-sm"
          style={{ height: `${h * 100}%`, background: accent && i % 9 === 0 ? "hsl(var(--signal))" : "hsl(var(--foreground))", opacity: accent && i % 9 === 0 ? 1 : 0.55 }}
        />
      ))}
    </div>
  );
}

export function Marquee({ items }: { items: string[] }) {
  const doubled = [...items, ...items];
  return (
    <div className="relative flex overflow-hidden border-y border-[hsl(var(--border))] bg-[hsl(var(--ink))] py-2 text-[hsl(var(--bone))]">
      <div className="flex animate-marquee whitespace-nowrap will-change-transform">
        {doubled.map((it, i) => (
          <span key={i} className="mx-6 font-mono text-xs tracking-label uppercase">
            {it} <span className="mx-4 text-[hsl(var(--signal))]">/</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/** Registration / crop mark for editorial framing. */
export function Mark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={`h-3 w-3 ${className}`} fill="none" stroke="currentColor" strokeWidth="1">
      <path d="M6 0v12M0 6h12" />
    </svg>
  );
}
