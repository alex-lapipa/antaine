import { useState } from "react";
import { POSTS, type Post } from "@/lib/journal";
import { MEDIA } from "@/assets/media";
import { Visual } from "./primitives";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

export function Journal({ initialSlug }: { initialSlug?: string | null }) {
  const [slug, setSlug] = useState<string | null>(initialSlug ?? null);
  const post = slug ? POSTS.find((p) => p.slug === slug) ?? null : null;
  return post ? <Reader post={post} onBack={() => setSlug(null)} /> : <Index onOpen={setSlug} />;
}

function Index({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <div className="mx-auto max-w-[1400px] animate-rise px-4 py-10 sm:px-8 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">JOURNAL — {POSTS.length} PIECES</div>
        <h1 className="mt-2 font-display text-5xl font-light leading-[0.95] tracking-tightest sm:text-6xl">Views From The Edges</h1>
        <p className="mt-4 text-base leading-relaxed text-[hsl(var(--muted-foreground))]">
          Writing from the borders of music and cinema — the underground, the overlooked, the deliberately difficult.
        </p>
      </div>

      <div className="divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
        {POSTS.map((p, i) => (
          <button
            key={p.slug}
            onClick={() => onOpen(p.slug)}
            className="group grid w-full grid-cols-1 gap-5 py-8 text-left transition-colors hover:bg-[hsl(var(--card))] sm:grid-cols-[180px_1fr_auto] sm:items-center sm:gap-8"
          >
            <div className="relative aspect-[4/3] w-full sm:aspect-[4/3] edge-hairline">
              <Visual img={p.img} media={MEDIA} hue={p.hue} seed={p.slug} className="h-full w-full" label={`№ 0${POSTS.length - i}`} fit={p.img === "aphex" ? "contain" : "cover"} />
            </div>
            <div>
              <div className="font-mono text-[10px] tracking-label text-[hsl(var(--accent))]">{p.kicker.toUpperCase()} · {p.published.toUpperCase()}</div>
              <h2 className="mt-2 font-display text-2xl leading-tight tracking-tightest transition-colors group-hover:text-[hsl(var(--accent))] sm:text-3xl">{p.title}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{p.dek}</p>
            </div>
            <ArrowUpRight className="hidden h-6 w-6 shrink-0 opacity-0 transition-opacity group-hover:opacity-100 sm:block" />
          </button>
        ))}
      </div>
    </div>
  );
}

function Reader({ post, onBack }: { post: Post; onBack: () => void }) {
  return (
    <article className="animate-rise">
      <div className="relative h-[38vh] min-h-[260px] w-full overflow-hidden edge-hairline">
        <Visual img={post.img} media={MEDIA} hue={post.hue} seed={post.slug + "-hero"} className="h-full w-full" fit={post.img === "aphex" ? "contain" : "cover"} />
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--ink))]/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-3xl px-4 pb-6 sm:px-8">
          <div className="font-mono text-[10px] tracking-label text-[hsl(var(--bone))]/80">{post.kicker.toUpperCase()} · {post.published.toUpperCase()}</div>
          <h1 className="mt-2 font-display text-3xl font-light leading-[1.02] tracking-tightest text-[hsl(var(--bone))] sm:text-5xl">{post.title}</h1>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-8">
        <button onClick={onBack} className="mb-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-label text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--accent))]">
          <ArrowLeft className="h-4 w-4" /> All pieces
        </button>

        <p className="mb-8 border-l-2 border-[hsl(var(--accent))] pl-4 font-display text-xl italic leading-snug text-[hsl(var(--foreground))]">{post.dek}</p>
        <div className="mb-8 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">By {post.byline}</div>

        <div className="space-y-5">
          {post.blocks.map((b, i) =>
            b.t === "h" ? (
              <h2 key={i} className="pt-4 font-display text-2xl font-medium tracking-tightest">{b.text}</h2>
            ) : b.t === "sig" ? (
              <p key={i} className="pt-4 font-mono text-sm tracking-label text-[hsl(var(--accent))]">{b.text}</p>
            ) : (
              <p key={i} className="text-[17px] leading-[1.75] text-[hsl(var(--foreground))]">{b.text}</p>
            )
          )}
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-[hsl(var(--border))] pt-6 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
          <span>ANTAINE REILLY</span>
          <a href="https://www.lapipa.io" target="_blank" rel="noreferrer" className="link-underline text-[hsl(var(--accent))]">lapipa.io</a>
        </div>
      </div>
    </article>
  );
}
