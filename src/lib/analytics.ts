// Consent-gated, cookieless analytics loader.
// Uses Plausible (no cookies, no cross-site tracking, no personal data) so it is
// GDPR-friendly by design. It loads ONLY when (a) a domain is configured via
// VITE_PLAUSIBLE_DOMAIN and (b) the visitor has granted analytics consent.
import { getConsent, onConsentChange } from "./consent";

let loaded = false;

function inject(): void {
  if (loaded || typeof document === "undefined") return;
  const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN as string | undefined;
  if (!domain) return; // not configured yet — nothing loads
  const src =
    (import.meta.env.VITE_PLAUSIBLE_SRC as string | undefined) ||
    "https://plausible.io/js/script.js";
  const s = document.createElement("script");
  s.defer = true;
  s.setAttribute("data-domain", domain);
  s.src = src;
  document.head.appendChild(s);
  loaded = true;
}

// Call once on app start. Loads now if already consented, and watches for changes.
export function initAnalytics(): void {
  if (getConsent().analytics) inject();
  onConsentChange((s) => {
    if (s.analytics) inject();
  });
}
