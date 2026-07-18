import { useEffect, useState } from "react";
import { POLICIES } from "@/lib/site";
import { getConsent, setConsent, onOpenConsentSettings } from "@/lib/consent";

const PRIVACY =
  POLICIES.find((p) => /privacy/i.test(p.label))?.url ?? "#";

export function ConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show on first visit (no decision stored yet).
    if (!getConsent().decided) setShow(true);
    // Allow re-opening from a "Cookie settings" control.
    return onOpenConsentSettings(() => setShow(true));
  }, []);

  if (!show) return null;

  const decide = (analytics: boolean) => {
    setConsent(analytics);
    setShow(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie and privacy consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[hsl(var(--bone))]/15 bg-[hsl(var(--ink))] text-[hsl(var(--bone))]"
    >
      <div className="mx-auto flex max-w-[1400px] flex-col gap-3 px-4 py-3 sm:gap-4 sm:px-8 sm:py-5 md:flex-row md:items-center md:justify-between">
        {/* Mobile: one line, the essentials */}
        <p className="text-[13px] leading-snug opacity-80 sm:hidden">
          Essential cookies only — analytics are cookieless and opt-in.{" "}
          <a href={PRIVACY} target="_blank" rel="noreferrer" className="link-underline opacity-100 underline-offset-2">
            Privacy policy
          </a>
        </p>
        {/* Desktop: unchanged */}
        <p className="hidden max-w-2xl text-sm leading-relaxed opacity-80 sm:block">
          We use essential cookies to run the shop and, with your consent, privacy-friendly,
          cookieless analytics to understand what resonates. No advertising trackers, no
          personal-data profiling. See our{" "}
          <a
            href={PRIVACY}
            target="_blank"
            rel="noreferrer"
            className="link-underline opacity-100 underline-offset-2"
          >
            privacy policy
          </a>
          .
        </p>
        <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-wrap sm:justify-start">
          <button
            onClick={() => decide(false)}
            className="-my-2 py-2 font-mono text-[11px] uppercase tracking-label opacity-70 transition hover:opacity-100"
          >
            Essential only
          </button>
          <button
            onClick={() => decide(true)}
            className="rounded-[var(--radius)] bg-[hsl(var(--accent))] px-4 py-2.5 font-mono text-[11px] uppercase tracking-label text-[hsl(var(--accent-foreground))] transition hover:brightness-110 sm:px-5"
          >
            Accept analytics
          </button>
        </div>
      </div>
    </div>
  );
}
