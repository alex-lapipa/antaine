# antainereilly.com

Official site, shop and portal for **Antaine Reilly** — sound-maker, image-hunter,
object collector, space designer.

Single-page React app (Vite + TypeScript + Tailwind). Five surfaces:

- **Index / Work** — portfolio across the four disciplines (real images + generated plates)
- **Journal** — "Views From The Edges" (essays migrated from the old Squarespace site)
- **Shop** — editions & objects, cart → maps to Shopify Storefront
- **Portal** — members library + client commissions (mock auth → maps to Supabase)
- **About** — statement + enquiries (form → maps to a Resend edge function)

## Develop

```bash
pnpm install
pnpm dev        # http://localhost:5173
pnpm build      # tsc + vite build → dist/
pnpm preview    # serve the production build
```

## Deploy (Vercel)

1. Import this repo at vercel.com/new (framework auto-detects as **Vite**).
2. Add the domain **antainereilly.com** in Project → Settings → Domains.
3. In the **Squarespace DNS** manager, change only these two records
   (leave the Google Workspace MX + Google/Proton TXT records untouched — that's email):

   | Type  | Name | Current (Squarespace)      | New (Vercel)                          |
   |-------|------|----------------------------|---------------------------------------|
   | A     | @    | 198.185.159.145            | 216.198.79.1                          |
   | CNAME | www  | ext-sq.squarespace.com     | <value Vercel shows on domain-add>    |

   Vercel provisions SSL automatically once DNS verifies.

## Next integrations

- `src/lib/store.tsx` — `CartProvider` → Shopify Storefront cart mutations; `AuthProvider` → Supabase auth + RLS.
- `src/components/site/About.tsx` — enquiry form → Supabase Edge Function + Resend.
- `src/components/site/Portal.tsx` — Library/Commissions → Supabase tables gated by RLS.

## Content

- Essays: `src/lib/journal.ts`
- Works / products / portal data: `src/lib/site.ts`
- Migrated images: `src/assets/old/` (mapped via `src/assets/media.ts`)
