import { useRef, useState } from "react";
import { useAuth } from "@/lib/store";
import { UNBOXED_TRACKS, UNBOXED_SOUND, DISPATCHES, type Track } from "@/lib/site";
import { Waveform, Mark } from "./primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, LogOut, ArrowRight, Play, Pause } from "lucide-react";

export function Portal() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Gate />;
}

function fmt(sec: number) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

function Gate() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    const r = signIn(email, code);
    if (!r.ok) setErr(r.error || "Could not sign in.");
  };

  return (
    <div className="mx-auto grid max-w-[1400px] animate-rise gap-10 px-4 py-14 sm:px-8 md:grid-cols-2 md:py-24">
      <div className="flex flex-col justify-center">
        <div className="inline-flex items-center gap-2 font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">
          <span className="h-2 w-2 rounded-full bg-[hsl(var(--signal))] animate-dot" /> PRIVATE CHANNEL
        </div>
        <h1 className="mt-4 font-display text-5xl font-light leading-[0.95] tracking-tightest sm:text-6xl">The Portal</h1>
        <p className="mt-5 max-w-md text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">
          The private channel for the archive. Members hear <span className="italic">Unboxed</span> — thirty years of
          tapes, opened out of order — before it goes anywhere else. Stream every track, or download the master.
        </p>
        <Waveform seed="gate" bars={72} accent className="mt-8 h-10 w-full max-w-sm opacity-60" />
      </div>

      <div className="flex items-center">
        <div className="w-full border border-[hsl(var(--ink))] bg-[hsl(var(--card))] p-6 sm:p-8">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-mono text-xs uppercase tracking-label">Sign in</span>
            <Mark className="text-[hsl(var(--border))]" />
          </div>
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-label text-[hsl(var(--muted-foreground))]">Email</label>
          <input
            value={email} onChange={(e) => { setEmail(e.target.value); setErr(""); }}
            placeholder="you@studio.com"
            className="mb-4 w-full border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 font-sans text-sm outline-none focus:border-[hsl(var(--accent))]"
          />
          <label className="mb-1 block font-mono text-[10px] uppercase tracking-label text-[hsl(var(--muted-foreground))]">Access code</label>
          <input
            value={code} onChange={(e) => { setCode(e.target.value); setErr(""); }}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="ESTUARY"
            className="w-full border border-[hsl(var(--input))] bg-[hsl(var(--background))] px-3 py-2.5 font-mono text-sm uppercase tracking-label outline-none focus:border-[hsl(var(--accent))]"
          />
          {err && <p className="mt-3 font-mono text-[11px] tracking-label text-[hsl(var(--destructive))]">{err}</p>}
          <button
            onClick={submit}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-sm bg-[hsl(var(--ink))] py-3 font-mono text-xs uppercase tracking-label text-[hsl(var(--bone))] transition-transform hover:-translate-y-0.5"
          >
            Enter <ArrowRight className="h-4 w-4" />
          </button>
          <p className="mt-4 font-mono text-[10px] leading-relaxed tracking-label text-[hsl(var(--muted-foreground))]">
            Demo access — any email, code <button onClick={() => setCode("ESTUARY")} className="text-[hsl(var(--accent))] underline">ESTUARY</button>.
            Production wires to Supabase auth + RLS.
          </p>
        </div>
      </div>
    </div>
  );
}

function SoundLibrary() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeN, setActiveN] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(0);

  const active = UNBOXED_TRACKS.find((t) => t.n === activeN) || null;

  const playTrack = (t: Track) => {
    const audio = audioRef.current;
    if (!audio) return;
    if (activeN === t.n) {
      if (audio.paused) audio.play().catch(() => {});
      else audio.pause();
      return;
    }
    setActiveN(t.n);
    setTime(0);
    setDur(t.duration);
    audio.src = t.stream;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  };

  const onEnded = () => {
    const idx = UNBOXED_TRACKS.findIndex((t) => t.n === activeN);
    const next = UNBOXED_TRACKS[idx + 1];
    if (next) playTrack(next);
    else setPlaying(false);
  };

  const seek = (v: number) => {
    const audio = audioRef.current;
    if (audio) {
      audio.currentTime = v;
      setTime(v);
    }
  };

  const total = dur || active?.duration || 0;

  return (
    <div>
      {/* Transport bar */}
      <div className="sticky top-2 z-10 mb-4 flex items-center gap-4 border border-[hsl(var(--ink))] bg-[hsl(var(--card))] p-3 sm:p-4">
        <button
          onClick={() => active && playTrack(active)}
          disabled={!active}
          aria-label={playing ? "Pause" : "Play"}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[hsl(var(--ink))] text-[hsl(var(--bone))] transition-transform hover:-translate-y-0.5 disabled:opacity-40"
        >
          {playing ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 translate-x-[1px]" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-3">
            <span className="truncate font-display text-sm">{active ? active.title : "Select a track"}</span>
            <span className="shrink-0 font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">
              {fmt(time)} / {fmt(total)}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={total || 1}
            step={1}
            value={time}
            onChange={(e) => seek(Number(e.target.value))}
            disabled={!active}
            aria-label="Seek"
            className="mt-2 h-1 w-full cursor-pointer appearance-none rounded-full bg-[hsl(var(--secondary))] accent-[hsl(var(--accent))] disabled:opacity-40"
          />
        </div>
      </div>

      {/* Track list */}
      <div className="divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
        {UNBOXED_TRACKS.map((t) => {
          const isActive = t.n === activeN;
          return (
            <div key={t.n} className={`grid grid-cols-[auto_1fr_auto] items-center gap-3 py-3.5 sm:grid-cols-[auto_1fr_auto_auto] sm:gap-4 ${isActive ? "bg-[hsl(var(--card))]" : ""}`}>
              <button
                onClick={() => playTrack(t)}
                aria-label={`Play ${t.title}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[hsl(var(--ink))] transition-colors hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]"
              >
                {isActive && playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 translate-x-[1px]" />}
              </button>
              <button onClick={() => playTrack(t)} className="min-w-0 text-left">
                <div className={`truncate font-display text-lg leading-tight ${isActive ? "text-[hsl(var(--accent))]" : ""}`}>{t.title}</div>
                <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">Master · {t.masterFormat}</div>
              </button>
              <div className="hidden font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))] sm:block">{fmt(t.duration)}</div>
              <a
                href={t.master}
                download
                className="inline-flex items-center gap-2 justify-self-end rounded-sm border border-[hsl(var(--ink))] px-3 py-2 font-mono text-[10px] uppercase tracking-label hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]"
              >
                <Download className="h-3.5 w-3.5" /> Master
              </a>
            </div>
          );
        })}
      </div>

      <audio
        ref={audioRef}
        preload="none"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDur(e.currentTarget.duration)}
        onEnded={onEnded}
      />
    </div>
  );
}

function Dashboard() {
  const { user, signOut } = useAuth();
  return (
    <div className="mx-auto max-w-[1400px] animate-rise px-4 py-10 sm:px-8 sm:py-14">
      <div className="mb-8 flex flex-col gap-4 border-b border-[hsl(var(--border))] pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">SIGNED IN · {user?.email}</div>
          <h1 className="mt-2 font-display text-4xl font-light tracking-tightest sm:text-5xl">Welcome back, {user?.name}.</h1>
        </div>
        <button onClick={signOut} className="inline-flex items-center gap-2 self-start rounded-sm border border-[hsl(var(--border))] px-3 py-2 font-mono text-[11px] uppercase tracking-label hover:border-[hsl(var(--ink))] sm:self-auto">
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>

      <Tabs defaultValue="sound" className="w-full">
        <TabsList className="mb-8 grid h-auto grid-cols-2 gap-1 bg-transparent p-0">
          {[["sound", "Unboxed"], ["notes", "Notes"]].map(([v, l]) => (
            <TabsTrigger
              key={v} value={v}
              className="rounded-sm border border-[hsl(var(--border))] py-2.5 font-mono text-[11px] uppercase tracking-label data-[state=active]:border-[hsl(var(--ink))] data-[state=active]:bg-[hsl(var(--ink))] data-[state=active]:text-[hsl(var(--bone))]"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="sound" className="mt-0">
          <div className="mb-8 max-w-2xl">
            <div className="font-mono text-[10px] uppercase tracking-label text-[hsl(var(--accent))]">{UNBOXED_SOUND.kicker}</div>
            <h2 className="mt-2 font-display text-3xl font-light leading-tight tracking-tightest sm:text-4xl">{UNBOXED_SOUND.title}</h2>
            <p className="mt-4 text-[15px] leading-relaxed text-[hsl(var(--foreground))]/85">{UNBOXED_SOUND.body}</p>
          </div>
          <SoundLibrary />
        </TabsContent>

        <TabsContent value="notes" className="mt-0">
          <div className="grid gap-4 md:grid-cols-3">
            {DISPATCHES.map((d) => (
              <article key={d.id} className="flex flex-col border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5">
                <div className="font-mono text-[10px] tracking-label text-[hsl(var(--accent))]">{d.date}</div>
                <h3 className="mt-2 font-display text-2xl leading-tight">{d.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[hsl(var(--muted-foreground))]">{d.body}</p>
              </article>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
