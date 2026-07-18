// Fathom Analytics — privacy-first & cookieless (GDPR/AEPD-friendly: no consent banner
// required, no personal data collected). The script loads ONLY when VITE_FATHOM_SITE_ID
// is set in the environment; every helper is a safe no-op otherwise, so this file is
// inert until the site ID is added in Vercel.

declare global {
  interface Window {
    fathom?: { trackEvent: (name: string) => void };
  }
}

const SITE_ID = import.meta.env.VITE_FATHOM_SITE_ID as string | undefined;

export function initAnalytics() {
  if (!SITE_ID || document.getElementById("fathom-script")) return;
  const s = document.createElement("script");
  s.id = "fathom-script";
  s.src = "https://cdn.usefathom.com/script.js";
  s.setAttribute("data-site", SITE_ID);
  s.setAttribute("data-spa", "hash"); // hash-router SPA — count route changes as pageviews
  s.defer = true;
  document.head.appendChild(s);
}

/** Custom event (e.g. "track-play — Unboxed 01"). Silent no-op when Fathom absent. */
export function trackEvent(name: string) {
  try {
    window.fathom?.trackEvent(name);
  } catch {
    /* noop */
  }
}
