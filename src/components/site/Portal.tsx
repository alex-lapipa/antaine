import { useState } from "react";
import { useAuth } from "@/lib/store";
import { LIBRARY, DISPATCHES, COMMISSIONS } from "@/lib/site";
import { Waveform, Mark } from "./primitives";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Download, LogOut, ArrowRight } from "lucide-react";

export function Portal() {
  const { user } = useAuth();
  return user ? <Dashboard /> : <Gate />;
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
          Two rooms behind one door. Members get stems, patch archives and LUTs. Commission clients get their
          project space — files, status and delivery in one place.
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

      <Tabs defaultValue="library" className="w-full">
        <TabsList className="mb-8 grid h-auto grid-cols-3 gap-1 bg-transparent p-0">
          {[["library", "Library"], ["dispatches", "Dispatches"], ["commissions", "Commissions"]].map(([v, l]) => (
            <TabsTrigger
              key={v} value={v}
              className="rounded-sm border border-[hsl(var(--border))] py-2.5 font-mono text-[11px] uppercase tracking-label data-[state=active]:border-[hsl(var(--ink))] data-[state=active]:bg-[hsl(var(--ink))] data-[state=active]:text-[hsl(var(--bone))]"
            >
              {l}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="library" className="mt-0">
          <div className="divide-y divide-[hsl(var(--border))] border-y border-[hsl(var(--border))]">
            {LIBRARY.map((it) => (
              <div key={it.id} className="grid grid-cols-[1fr_auto] items-center gap-4 py-4 sm:grid-cols-[1fr_auto_auto_auto]">
                <div>
                  <div className="font-display text-lg leading-tight">{it.title}</div>
                  <div className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">{it.format}</div>
                </div>
                <div className="hidden font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))] sm:block">{it.size}</div>
                <div className="hidden font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))] sm:block">{it.added}</div>
                <button className="inline-flex items-center gap-2 rounded-sm border border-[hsl(var(--ink))] px-3 py-2 font-mono text-[10px] uppercase tracking-label hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]">
                  <Download className="h-3.5 w-3.5" /> Get
                </button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dispatches" className="mt-0">
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

        <TabsContent value="commissions" className="mt-0">
          <div className="grid gap-3">
            {COMMISSIONS.map((c) => (
              <div key={c.id} className="grid gap-4 border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-5 sm:grid-cols-[1.4fr_1fr_auto] sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">{c.id.toUpperCase()}</span>
                    <StatusPill status={c.status} />
                  </div>
                  <div className="mt-1 font-display text-xl leading-tight">{c.title}</div>
                  <div className="font-mono text-[11px] tracking-label text-[hsl(var(--muted-foreground))]">{c.client} · {c.kind}</div>
                </div>
                <div>
                  <div className="mb-1 flex items-center justify-between font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">
                    <span>{c.progress}%</span><span>{c.files} files</span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(var(--secondary))]">
                    <div className="h-full rounded-full bg-[hsl(var(--accent))]" style={{ width: `${c.progress}%` }} />
                  </div>
                  <div className="mt-1 font-mono text-[10px] tracking-label text-[hsl(var(--muted-foreground))]">Updated {c.updated}</div>
                </div>
                <button className="inline-flex items-center justify-center gap-2 rounded-sm border border-[hsl(var(--ink))] px-4 py-2.5 font-mono text-[10px] uppercase tracking-label hover:bg-[hsl(var(--ink))] hover:text-[hsl(var(--bone))]">
                  Open <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    "brief": "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))]",
    "in-progress": "bg-[hsl(var(--signal))] text-[hsl(var(--ink))]",
    "review": "bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))]",
    "delivered": "bg-[hsl(var(--ink))] text-[hsl(var(--bone))]",
  };
  return <span className={`rounded-sm px-2 py-0.5 font-mono text-[9px] uppercase tracking-label ${map[status]}`}>{status.replace("-", " ")}</span>;
}
