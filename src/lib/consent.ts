// GDPR / ePrivacy consent (opt-in) for antaine.xyz.
// Universal opt-in: non-essential storage/analytics load ONLY after explicit consent.
// Essential functionality (cart state, checkout hand-off to Shopify) never depends on this.

export type ConsentState = { decided: boolean; analytics: boolean; ts: number };

const KEY = "antaine.consent.v1";
const EVT = "antaine:consent";
const OPEN_EVT = "antaine:consent:open";

const DEFAULT: ConsentState = { decided: false, analytics: false, ts: 0 };

export function getConsent(): ConsentState {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return DEFAULT;
    const p = JSON.parse(raw) as Partial<ConsentState>;
    return { decided: !!p.decided, analytics: !!p.analytics, ts: p.ts ?? 0 };
  } catch {
    return DEFAULT;
  }
}

export function setConsent(analytics: boolean): void {
  if (typeof window === "undefined") return;
  const state: ConsentState = { decided: true, analytics, ts: Date.now() };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage blocked — treat as session-only, still dispatch */
  }
  window.dispatchEvent(new CustomEvent(EVT, { detail: state }));
}

export function onConsentChange(cb: (s: ConsentState) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const h = (e: Event) => cb((e as CustomEvent<ConsentState>).detail ?? getConsent());
  window.addEventListener(EVT, h);
  return () => window.removeEventListener(EVT, h);
}

// Let any UI (e.g. a footer "Cookie settings" link) re-open the banner.
export function openConsentSettings(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(OPEN_EVT));
}
export function onOpenConsentSettings(cb: () => void): () => void {
  if (typeof window === "undefined") return () => {};
  const h = () => cb();
  window.addEventListener(OPEN_EVT, h);
  return () => window.removeEventListener(OPEN_EVT, h);
}
