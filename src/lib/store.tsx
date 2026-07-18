import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Product } from "./site";

// --- Cart (in-memory v0; swap for Shopify Storefront cart mutations) ---
export type CartLine = { product: Product; qty: number };
type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (p: Product) => void;
  remove: (handle: string) => void;
  setQty: (handle: string, qty: number) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};
const Cart = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  const add = useCallback((p: Product) => {
    setLines((prev) => {
      const found = prev.find((l) => l.product.handle === p.handle);
      if (found) return prev.map((l) => l.product.handle === p.handle ? { ...l, qty: l.qty + 1 } : l);
      return [...prev, { product: p, qty: 1 }];
    });
    setOpen(true);
  }, []);
  const remove = useCallback((handle: string) => setLines((p) => p.filter((l) => l.product.handle !== handle)), []);
  const setQty = useCallback((handle: string, qty: number) =>
    setLines((p) => p.flatMap((l) => l.product.handle === handle ? (qty <= 0 ? [] : [{ ...l, qty }]) : [l])), []);
  const clear = useCallback(() => setLines([]), []);

  const count = lines.reduce((n, l) => n + l.qty, 0);
  const subtotal = lines.reduce((n, l) => n + l.qty * l.product.priceEUR, 0);

  return <Cart.Provider value={{ lines, count, subtotal, add, remove, setQty, clear, open, setOpen }}>{children}</Cart.Provider>;
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
