# antaine.xyz

Official site, shop and portal for **Antaine Reilly** — sound-maker, image-hunter,
object collector, space designer.

Single-page React app (Vite + TypeScript + Tailwind). Five surfaces:

- **Index / Work** — portfolio + the *Blanco y Negro* documentary series (real photographs)
- **Journal** — "Views From The Edges"
- **Shop** — editions & prints, live via the **Shopify Storefront API** (headless), checkout on Shopify
- **Portal** — members library + client commissions (maps to Supabase)
- **About** — statement + enquiries

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc + vite build → dist/
```

## Deploy (Vercel)

Deploys from GitHub `main`. Canonical domain **antaine.xyz** (apex + www on Vercel).
Env vars: `VITE_SHOPIFY_DOMAIN`, `VITE_SHOPIFY_STOREFRONT_TOKEN`, `VITE_SUPABASE_URL`,
`VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (server-only).

## Content

- Works / products / portal data + Blanco y Negro gallery: `src/lib/site.ts`
- Media map (local + Shopify CDN): `src/assets/media.ts`
- Contact: **alex@rmtv.io**
