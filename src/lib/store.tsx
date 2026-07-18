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

// --- Portal auth (mock; swap for Supabase auth) ---
type AuthCtx = {
  user: { email: string; name: string; tier: "member" | "studio" } | null;
  signIn: (email: string, code: string) => { ok: boolean; error?: string };
  signOut: () => void;
};
const Auth = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthCtx["user"]>(null);
  const signIn: AuthCtx["signIn"] = (email, code) => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, error: "Enter a valid email." };
    if (code.trim().toUpperCase() !== "ESTUARY") return { ok: false, error: "Access code not recognised." };
    setUser({ email, name: email.split("@")[0], tier: "studio" });
    return { ok: true };
  };
  const signOut = () => setUser(null);
  return <Auth.Provider value={{ user, signIn, signOut }}>{children}</Auth.Provider>;
}
export function useAuth() {
  const c = useContext(Auth);
  if (!c) throw new Error("useAuth outside provider");
  return c;
}

export const eur = (n: number) => `€${n.toLocaleString("en-IE")}`;
