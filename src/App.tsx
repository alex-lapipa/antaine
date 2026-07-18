import { useEffect, useState, useCallback } from "react";
import { CartProvider, AuthProvider } from "@/lib/store";
import { WORKS, type Work } from "@/lib/site";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Home } from "@/components/site/Home";
import { WorkIndex, WorkDetail } from "@/components/site/Work";
import { Shop } from "@/components/site/Shop";
import { Journal } from "@/components/site/Journal";
import { Portal } from "@/components/site/Portal";
import { About } from "@/components/site/About";
import { Cart } from "@/components/site/Cart";
import { ConsentBanner } from "@/components/site/Consent";
import { initAnalytics } from "@/lib/analytics";

const PAGES = new Set(["home", "work", "journal", "shop", "portal", "about"]);

function Shell() {
  const [page, setPage] = useState<string>(() => {
    const h = window.location.hash.replace("#", "").split("/")[0];
    return PAGES.has(h) ? h : "home";
  });
  const [workId, setWorkId] = useState<string | null>(null);

  useEffect(() => { initAnalytics(); }, []);

  const go = useCallback((p: string) => {
    setPage(p);
    window.location.hash = p;
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace("#", "").split("/")[0];
      if (PAGES.has(h)) setPage(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const openWork = useCallback((id: string) => setWorkId(id), []);
  const work: Work | null = workId ? WORKS.find((w) => w.id === workId) ?? null : null;

  return (
    <div className="grain-fixed flex min-h-screen flex-col">
      <Nav page={page} go={go} />
      <main className="flex-1">
        {page === "home" && <Home go={go} />}
        {page === "work" && <WorkIndex openWork={openWork} />}
        {page === "shop" && <Shop />}
        {page === "journal" && <Journal />}
        {page === "portal" && <Portal />}
        {page === "about" && <About />}
      </main>
      <Footer go={go} />
      <WorkDetail work={work} onClose={() => setWorkId(null)} />
      <Cart />
      <ConsentBanner />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Shell />
      </CartProvider>
    </AuthProvider>
  );
}
