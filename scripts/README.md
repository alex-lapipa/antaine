# scripts/gen-static-seo.py

Generates the **crawlable static SEO layer** into `public/`:
- `public/prints/<handle>/index.html` — one page per print (Product + BreadcrumbList + Organization JSON-LD)
- `public/prints/index.html` — print-shop index (CollectionPage + ItemList)
- `public/trade/index.html` — Trade / Hospitality landing page (Service + FAQ JSON-LD)
- `public/sitemap.xml` — full sitemap (home + prints index + all PDPs + trade)

Run from repo root: `python3 scripts/gen-static-seo.py`

Product data (title, image, story, prices) is currently **embedded** in the `DATA` list
in this script — sourced from the Shopify Admin API on 2026-07-18. When the catalogue
changes, update `DATA` (or, better, refactor to fetch live from the Shopify Storefront
API at build time) and re-run. **Do not hand-edit the generated `public/prints/*` files** —
they are build artifacts; regenerate instead.

These pages are pure static (no JS, no cookies, no external fonts) — the low-risk bridge
that makes the catalogue indexable ahead of the full React SSG migration.
