import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { createCheckout, type SFProduct } from "./shopify";

// --- Cart (backed by the Shopify Storefront API; checkout redirects to Shopify) ---
export type CartLine = { product: SFProduct; qty: number };
type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (p: SFProduct) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
  checkout: () => Promise<void>;
  checkingOut: boolean;
  checkoutError: string | null;
};
const Cart = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const add = useCallback((p: SFProduct) => {
    setLines((prev) => {
      const found = prev.find((l) => l.product.id === p.id);
      if (found) return prev.map((l) => (l.product.id === p.id ? { ...l, qty: l.qty + 1 } : l));
      return [...prev, { product: p, qty: 1 }];
    });
    setOpen(true);
  }, []);
  const remove = useCallback((id: string) => setLines((p) => p.filter((l) => l.product.id !== id)), []);
  const setQty = useCallback(
    (id: string, qty: number) =>
      setLines((p) => p.flatMap((l) => (l.product.id === id ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l]))),
    [],
  );
  const clear = useCallback(() => setLines([]), []);

  const checkout = useCallback(async () => {
    setCheckoutError(null);
    const items = lines
      .filter((l) => l.product.variantId)
      .map((l) => ({ variantId: l.product.variantId as string, quantity: l.qty }));
    if (!items.length) return;
    setCheckingOut(true);
    try {
      const url = await createCheckout(items);
      window.location.href = url; // hand off to Shopify's secure checkout
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : "Checkout failed. Please try again.");
      setCheckingOut(false);
    }
  }, [lines]);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.priceEUR, 0);

  return (
    <Cart.Provider
      value={{ lines, count, subtotal, add, remove, setQty, clear, open, setOpen, checkout, checkingOut, checkoutError }}
    >
      {children}
    </Cart.Provider>
  );
}
export function useCart() {
  const c = useContext(Cart);
  if (!c) throw new Error("useCart outside provider");
  return c;
}

// --- Portal auth (access code gate; member registry in Supabase, session persisted locally) ---
type PortalUser = { email: string; name: string; tier: "member" | "studio" };
type AuthCtx = {
  user: PortalUser | null;
  signIn: (email: string, code: string, marketingConsent?: boolean) => { ok: boolean; error?: string };
  signOut: () => void;
};
const Auth = createContext<AuthCtx | null>(null);

const SESSION_KEY = "antaine_portal_session_v1";

// Supabase (public project URL + publishable anon key — safe for the browser; the
// portal_members table is RLS-locked with no anon policies, writes go only through
// the portal_register() SECURITY DEFINER RPC, which never returns stored data).
const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string) || "https://lxeuxyieicluzgikflzx.supabase.co";
const SUPABASE_ANON_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4ZXV4eWllaWNsdXpnaWtmbHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQzNDU4MzMsImV4cCI6MjA5OTkyMTgzM30.gyuApaciH0bhDvnSejrFSEEinIN88MhaITsPLsl5_3c";

// Exact consent wording recorded server-side alongside the opt-in (GDPR record of consent).
export const MARKETING_CONSENT_TEXT =
  "Send me occasional updates on new work, tapes and editions. I can unsubscribe or request erasure anytime via alex@rmtv.io.";

function loadSession(): PortalUser | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const u = JSON.parse(raw) as PortalUser;
    return u && typeof u.email === "string" ? u : null;
  } catch {
    return null;
  }
}

function registerMember(email: string, name: string, marketing: boolean) {
  // Fire-and-forget: registration must never block portal access.
  fetch(`${SUPABASE_URL}/rest/v1/rpc/portal_register`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_email: email,
      p_name: name,
      p_marketing: marketing,
      p_consent_text: marketing ? MARKETING_CONSENT_TEXT : null,
    }),
  }).catch(() => {
    /* offline / blocked — access still granted; registry syncs on next sign-in */
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthCtx["user"]>(() => loadSession());
  const signIn: AuthCtx["signIn"] = (email, code, marketingConsent = false) => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Enter a valid email." };
    if (code.trim().toUpperCase() !== "ESTUARY") return { ok: false, error: "Access code not recognised." };
    const u: PortalUser = { email: email.trim(), name: email.split("@")[0], tier: "studio" };
    setUser(u);
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(u)); // stay signed in until explicit sign-out
    } catch {
      /* private mode — session lives for the tab only */
    }
    registerMember(u.email, u.name, marketingConsent);
    return { ok: true };
  };
  const signOut = () => {
    setUser(null);
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      /* noop */
    }
  };
  return <Auth.Provider value={{ user, signIn, signOut }}>{children}</Auth.Provider>;
}
export function useAuth() {
  const c = useContext(Auth);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}

export const eur = (n: number) => `€${n.toLocaleString("en-IE")}`;
