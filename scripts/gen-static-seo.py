#!/usr/bin/env python3
# Generates the crawlable static SEO layer for ANTAINE into the repo's public/ dir:
#   public/prints/<handle>/index.html   — 35 product pages (Product + Breadcrumb JSON-LD)
#   public/prints/index.html            — print-shop index (ItemList JSON-LD)
#   public/trade/index.html             — Trade / Hospitality landing page (Service + FAQ JSON-LD)
#   public/sitemap.xml                  — full sitemap (home + prints index + 35 PDPs + trade)
# Pure static, no JS, no cookies, no external fonts — privacy-first and instantly indexable.
import os, re, html, json

import pathlib
REPO = str(pathlib.Path(__file__).resolve().parent.parent)
PUB = os.path.join(REPO, "public")
SITE = "https://antaine.xyz"
SHOP_URL = f"{SITE}/#shop"
EMAIL = "alex@rmtv.io"
IG = "antainereilly"
CDN = "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/"

def img(slug, v): return f"{CDN}{slug}?v={v}"

# handle, title, image, descriptionHtml, price (float=single | list[(label,price)])
S = lambda p: float(p)
FOUR = ["21×30 cm","30×40 cm","50×70 cm","70×100 cm"]
def ladder(a,b,c,d): return list(zip(FOUR,[a,b,c,d]))

DATA = [
("coast-non-coast-plate-04","Harbord Street, Toronto",img("antaine-room-harbord.jpg","1784382675"),
 "<p>A quiet corner of Toronto — Harbord Street under a moving sky. No one in the frame but the city itself. Summer 2016.</p><p><em>Signed archival pigment print on cotton rag. Edition of 12. Shipped from the studio. Documentary work by Antaine Reilly.</em></p>",159.0),
("black-blanco-plate-02","Under the Cranes, London",img("antaine-room-cranes.jpg","1784382675"),
 "<p>A crowd gathers while the cranes rewrite the skyline behind them. London at the turn of the century — the city changing faster than the people in it.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",369.0),
("black-blanco-plate-03","North London Sound System",img("antaine-room-sound-system.jpg","1784382678"),
 "<p>The sound system pulls a crowd off the pavement in North London. Dreads, speakers, and a truck that shouldn't be there — free-party culture at full volume.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",449.0),
("black-blanco-plate-04","Street Party, London",img("antaine-room-street-party.jpg","1784382676"),
 "<p>Backs to the camera, faces to the stage. A London street party in full flow — the road taken and held for a day.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",419.0),
("black-blanco-plate-05","The Long Way Home, London",img("antaine-room-long-way.jpg","1784382677"),
 "<p>One rider, bags loaded, taking the long way home past the terraces. London, late nineties.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",339.0),
("black-blanco-plate-06","Reclaim the Streets, London",img("antaine-room-rts-london.jpg","1784382677"),
 "<p>The crowd that turned a road into a room. Reclaim the Streets — the sound systems in the financial district, London, June 1999.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",429.0),
("black-blanco-plate-07","Doomsayers, Chinatown",img("antaine-room-doomsayers.jpg","1784382677"),
 "<p>Two backs, one message — ‘DOOM SAYERS’ through Chinatown. Toronto, summer 2016.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",319.0),
("black-blanco-plate-08","Private Pump",img("antaine-room-pump.jpg","1784382677"),
 "<p>‘Sorry, not for resale.’ A private pump at the edge of the road, keeping its own counsel. From the Canadian road trip.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",129.0),
("black-blanco-plate-09","Edge of the City",img("antaine-room-edge-city.jpg","1784382677"),
 "<p>Tower blocks, a wide road, one car passing. The city where it thins out into somewhere else.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",179.0),
("black-blanco-plate-10","Havana Libre",img("antaine-room-havana.jpg","1784382677"),
 "<p>The colonnades of Havana, empty in the heat. Cuba, November 2016 — the night of an election an ocean away.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",225.0),
("black-blanco-plate-11","The Boat Builder",img("antaine-room-boat-builder.jpg","1784382678"),
 "<p>A hull taking shape and the man building it — ribs of timber, hands that know the curve.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",299.0),
("black-blanco-plate-12","Under the Hull",img("antaine-room-under-hull.jpg","1784382678"),
 "<p>Down under the hull, in the boat’s shadow, the work goes on where no one watches.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",279.0),
("black-blanco-plate-13","Who Gives a Shit?",img("antaine-room-whogives.jpg","1784382679"),
 "<p>A painted clock on a wall asks the only question that matters. Street wisdom, no hands worth trusting.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",149.0),
("black-blanco-plate-14","Last Orders",img("antaine-room-last-orders.jpg","1784382681"),
 "<p>One glass, one block of ice, the end of the night held in it. Still life from the bar.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",99.0),
("black-blanco-plate-15","Razzmatazz, Barcelona",img("antaine-room-razz-bcn.jpg","1784382679"),
 "<p>Barcelona in the dark — Razzmatazz under the falling lights. The club as a landscape of its own. 2016.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",209.0),
("black-blanco-plate-16","Willesden, 1999",img("antaine-room-willesden-v2.jpg","1784401644"),
 "<p>The street party at Willesden — rigging up, cars parked in, the crowd already there. London, 1999.</p><p><em>Signed archival pigment print on cotton rag. Made to order, shipped from the studio. From Black &amp; Blanco by Antaine Reilly.</em></p>",409.0),
("love-parade-berlin","Love Parade, Berlin",img("antaine-room-love-parade-berlin.jpg","1784382628"),
 "<p>One World, One Love — the Love Parade at full tilt. Berlin, July 2000. Over a million people under one banner.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(269,319,399,489)),
("love-parade-i","Love Parade I",img("antaine-room-love-parade-i.jpg","1784382629"),
 "<p>Between the floats — the parade seen from inside it. Berlin, July 2000.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(249,289,359,449)),
("love-parade-ii","Love Parade II",img("antaine-room-love-parade-ii.jpg","1784382629"),
 "<p>The Tiergarten crowd — a million people finding the same rhythm. Berlin, July 2000.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(299,349,429,519)),
("reclaim-the-streets-ii-london","Reclaim the Streets II, London",img("antaine-room-rts-ii-v2.jpg","1784401643"),
 "<p>The streets taken back — the crowd and the line of uniforms, London, late nineties.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(419,449,499,579)),
("carnival-against-capital","Carnival Against Capital",img("antaine-room-carnival-v2.jpg","1784401644"),
 "<p>June 18th, 1999 — the Carnival Against Capital. The sound systems rolled into the financial district and the city danced.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(419,449,499,579)),
("hackney-squat-party-1999","Hackney Free Party, 1999",img("antaine-room-hackney.jpg","1784382629"),
 "<p>Hackney, 1999 — the free party finding its room for the night. Acid techno culture at its source.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(419,449,499,579)),
("brooklyn-street","Brooklyn Street",img("antaine-room-brooklyn.jpg","1784382629"),
 "<p>Brooklyn at street level — the city walking past, nobody posing.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(169,199,259,329)),
("crossing","Crossing",img("antaine-room-crossing-v2.jpg","1784401643"),
 "<p>A street crossing, one stride mid-frame — the city caught deciding where to go.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(169,199,259,329)),
("sonar-2015","Sónar, 2015",img("antaine-room-sonar-v2.jpg","1784401643"),
 "<p>Sónar by night — Barcelona, 2015. The festival in its element: dark, loud, lit from one side.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(219,259,319,399)),
("razzmatazz-13-february-2016","Razzmatazz, 13 February 2016",img("antaine-room-razz2016-v2.jpg","1784401643"),
 "<p>Razzmatazz, Barcelona — 13 February 2016. One night, one frame.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(219,259,319,399)),
("love-is-everywhere","Love Is Everywhere",img("antaine-room-love-everywhere.jpg","1784382630"),
 "<p>Love is rare and everywhere — London street art, found not staged.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(89,119,189,299)),
("juanin-larriba-london","Juanín, London",img("antaine-room-juanin-v2.jpg","1784401643"),
 "<p>Juanín, London — a portrait from the years the city belonged to us.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(169,199,259,329)),
("alonso-yayo-2025","Alonso & Yayo, 2025",img("antaine-room-alonso-yayo.jpg","1784382630"),
 "<p>Alonso &amp; Yayo, 2025 — two faces the camera already knew.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(169,199,259,329)),
("two-on-the-grass","Two on the Grass",img("antaine-room-two-grass.jpg","1784382631"),
 "<p>Two figures flat out on the grass, mid-summer — the day paused where it fell.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(169,199,259,329)),
("the-painted-truck","The Painted Truck",img("antaine-room-painted-truck.jpg","1784382630"),
 "<p>A working truck wearing the neighbourhood's handwriting — parked, tagged, unbothered.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(89,119,189,299)),
("back-lane","Back Lane",img("antaine-room-back-lane.jpg","1784382631"),
 "<p>A back lane, two walkers, the city's quiet seam between one street and the next.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(169,199,259,329)),
("the-travelator","The Travelator",img("antaine-room-travelator-v2.jpg","1784401642"),
 "<p>An empty travelator burning light down the middle — infrastructure as cathedral.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(89,119,189,299)),
("night-walk","Tokyo Night Riders",img("antaine-room-night-walk.jpg","1784382631"),
 "<p>A night lane, figures heading home under the lamp — the hour that belongs to walkers.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(169,199,259,329)),
("facturacion","Facturación",img("antaine-room-facturacion.jpg","1784382676"),
 "<p>'Facturación' — the wheel and the word, found exactly like this.</p><p><em>Museum-quality matte paper in a metal frame, printed and framed on demand. From Blanco y Negro by Antaine Reilly.</em></p>",ladder(89,119,189,299)),
]

def money(x):
    return f"€{int(x)}" if float(x).is_integer() else f"€{x:.2f}"

def paras(desc):
    ps = re.findall(r"<p>(.*?)</p>", desc, re.S)
    story = re.sub(r"<.*?>","", ps[0]).strip() if ps else ""
    spec = re.sub(r"<.*?>","", ps[1]).strip() if len(ps)>1 else ""
    return html.unescape(story), html.unescape(spec)

def seo_title(t):
    a=f"{t} — Black & White Photograph | ANTAINE"
    return a if len(a)<=65 else f"{t} — B&W Photograph | ANTAINE"

def seo_desc(story):
    tag=" · Signed B&W print, framed & made to order — ANTAINE."
    core=story.rstrip(".")
    if len(core)+len(tag)>160: core=core[:160-len(tag)-1].rsplit(" ",1)[0]+"…"
    return core+tag

CSS = """
:root{--ink:#191712;--bone:#e9e2d0;--bone2:#cfc7b2;--accent:#d6451e;--muted:#8c8676}
*{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{background:var(--ink);color:var(--bone);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;line-height:1.6;-webkit-font-smoothing:antialiased}
a{color:inherit}
.wrap{max-width:1180px;margin:0 auto;padding:0 24px}
.mono{font-family:ui-monospace,"SF Mono",Menlo,Consolas,monospace;font-size:11px;letter-spacing:.18em;text-transform:uppercase;color:var(--muted)}
.display{font-family:"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif;font-weight:400;letter-spacing:-.01em;line-height:1.05}
header.top{position:sticky;top:0;z-index:10;background:rgba(25,23,18,.85);backdrop-filter:blur(8px);border-bottom:1px solid rgba(233,226,208,.1)}
header.top .wrap{display:flex;align-items:center;justify-content:space-between;height:60px}
.brand{font-family:"Iowan Old Style",Georgia,serif;font-size:20px;letter-spacing:.02em}
nav a{margin-left:22px;font-size:13px;color:var(--bone2);text-decoration:none}
nav a:hover{color:var(--bone)}
.crumb{font-size:12px;color:var(--muted);padding:22px 0 0}
.crumb a{color:var(--muted);text-decoration:none}.crumb a:hover{color:var(--bone)}
.pdp{display:grid;grid-template-columns:1.15fr .85fr;gap:56px;padding:34px 0 72px;align-items:start}
@media(max-width:860px){.pdp{grid-template-columns:1fr;gap:32px}}
.frame{background:#0f0e0b;padding:26px;border:1px solid rgba(233,226,208,.08)}
.frame img{width:100%;height:auto;display:block}
h1.title{font-size:clamp(30px,4.4vw,50px);margin:6px 0 10px}
.meta{color:var(--bone2);font-size:14px;margin-bottom:22px}
.story{font-size:18px;color:#ddd5c2;margin:20px 0}
.spec{font-size:13px;color:var(--muted);border-top:1px solid rgba(233,226,208,.12);padding-top:16px;margin-top:22px}
.price{font-family:"Iowan Old Style",Georgia,serif;font-size:26px;margin:22px 0 6px}
.sizes{display:flex;flex-wrap:wrap;gap:8px;margin:14px 0}
.sizes span{border:1px solid rgba(233,226,208,.2);padding:7px 12px;font-size:12px;color:var(--bone2)}
.cta{display:inline-block;margin:20px 14px 0 0;background:var(--accent);color:#fff;text-decoration:none;padding:14px 26px;font-family:ui-monospace,monospace;font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.cta.ghost{background:transparent;border:1px solid rgba(233,226,208,.3);color:var(--bone)}
.trust{font-size:12px;color:var(--muted);margin-top:16px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:26px;padding:24px 0 72px}
.card{text-decoration:none;color:inherit;display:block}
.card .ph{background:#0f0e0b;padding:14px;border:1px solid rgba(233,226,208,.08)}
.card img{width:100%;height:auto;display:block}
.card h3{font-family:"Iowan Old Style",Georgia,serif;font-weight:400;font-size:17px;margin:12px 0 2px}
.card .p{font-size:13px;color:var(--muted)}
.hero{padding:70px 0 40px;border-bottom:1px solid rgba(233,226,208,.1)}
.hero h1{font-size:clamp(34px,6vw,68px);max-width:14ch}
.lead{font-size:19px;color:#ddd5c2;max-width:60ch;margin:22px 0}
section.blk{padding:52px 0;border-bottom:1px solid rgba(233,226,208,.08)}
section.blk h2{font-size:clamp(22px,3vw,32px);margin-bottom:20px}
.cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:30px}
.cols h3{font-family:"Iowan Old Style",Georgia,serif;font-weight:400;font-size:20px;margin-bottom:8px}
.cols p{color:var(--bone2);font-size:15px}
.faq dt{font-family:"Iowan Old Style",Georgia,serif;font-size:19px;margin:22px 0 6px}
.faq dd{color:var(--bone2);margin:0 0 4px}
footer.foot{background:#12110d;padding:44px 0;margin-top:20px;border-top:1px solid rgba(233,226,208,.1)}
footer.foot .wrap{display:flex;flex-wrap:wrap;gap:16px 28px;justify-content:space-between;font-size:12px;color:var(--muted)}
footer.foot a{color:var(--bone2);text-decoration:none;margin-right:18px}
footer.foot a:hover{color:var(--bone)}
"""

POLICIES = [
 ("Refund policy","https://checkout.shopify.com/106594828619/policies/63713411403.html"),
 ("Shipping policy","https://checkout.shopify.com/106594828619/policies/63713575243.html"),
 ("Terms of service","https://checkout.shopify.com/106594828619/policies/63713509707.html"),
 ("Privacy policy","https://checkout.shopify.com/106594828619/policies/63707971915.html"),
]

def head(title, desc, canonical, ogimg, jsonld):
    pol = " ".join(f'<a href="{u}" rel="noreferrer">{l}</a>' for l,u in POLICIES)
    return f"""<!doctype html><html lang="en-IE"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1">
<link rel="canonical" href="{canonical}">
<meta property="og:type" content="website"><meta property="og:site_name" content="ANTAINE">
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{canonical}"><meta property="og:image" content="{ogimg}">
<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="{html.escape(title)}">
<meta name="twitter:description" content="{html.escape(desc)}"><meta name="twitter:image" content="{ogimg}">
<script type="application/ld+json">{json.dumps(jsonld,ensure_ascii=False)}</script>
<style>{CSS}</style></head><body>
<header class="top"><div class="wrap"><a class="brand" href="{SITE}/">ANTAINE</a>
<nav><a href="{SITE}/#work">Work</a><a href="/prints/">Prints</a><a href="{SITE}/#journal">Journal</a><a href="/trade/">Trade</a><a href="{SITE}/#about">About</a></nav></div></header>"""

def foot():
    pol = "".join(f'<a href="{u}" rel="noreferrer">{l}</a>' for l,u in POLICIES)
    return f"""<footer class="foot"><div class="wrap">
<div>© 2026 ANTAINE REILLY · ÉIRE ⁄ ESPAÑA · <a href="mailto:{EMAIL}">{EMAIL}</a></div>
<div>{pol}<a href="/trade/">Trade</a></div></div></footer></body></html>"""

def org_node():
    return {"@type":"Organization","@id":f"{SITE}/#organization","name":"ANTAINE","url":f"{SITE}/","email":EMAIL,
            "sameAs":[f"https://www.instagram.com/{IG}","https://www.lapipa.io"]}

# ---- product pages ----
os.makedirs(os.path.join(PUB,"prints"),exist_ok=True)
index_cards=[]
sitemap_urls=[(f"{SITE}/","1.0"),(f"{SITE}/prints/","0.9"),(f"{SITE}/trade/","0.8")]

for handle,title,image,desc,price in DATA:
    story,spec = paras(desc)
    canonical=f"{SITE}/prints/{handle}/"
    st=seo_title(title); sd=seo_desc(story)
    multi = isinstance(price,list)
    if multi:
        lo=min(p for _,p in price); hi=max(p for _,p in price)
        offers={"@type":"AggregateOffer","priceCurrency":"EUR","lowPrice":f"{lo:.2f}","highPrice":f"{hi:.2f}",
                "offerCount":len(price),"availability":"https://schema.org/InStock","url":canonical}
        price_line=f"{money(lo)} – {money(hi)}"
        sizes_html='<div class="sizes">'+"".join(f"<span>{l} · {money(p)}</span>" for l,p in price)+"</div>"
    else:
        offers={"@type":"Offer","priceCurrency":"EUR","price":f"{price:.2f}",
                "availability":"https://schema.org/InStock","url":canonical}
        price_line=money(price)
        sizes_html=""
    jsonld={"@context":"https://schema.org","@graph":[
        {"@type":"Product","@id":canonical+"#product","name":title,"image":image,
         "description":sd,"sku":handle,"brand":{"@type":"Brand","name":"ANTAINE"},
         "category":"Fine-art photography print","url":canonical,
         "creator":{"@type":"Person","name":"Antaine Reilly"},"offers":offers},
        {"@type":"BreadcrumbList","itemListElement":[
            {"@type":"ListItem","position":1,"name":"Home","item":f"{SITE}/"},
            {"@type":"ListItem","position":2,"name":"Prints","item":f"{SITE}/prints/"},
            {"@type":"ListItem","position":3,"name":title,"item":canonical}]},
        org_node()]}
    body=f"""{head(st,sd,canonical,image,jsonld)}
<div class="wrap">
<div class="crumb"><a href="{SITE}/">Home</a> / <a href="/prints/">Prints</a> / {html.escape(title)}</div>
<div class="pdp">
  <div class="frame"><img src="{image}" alt="{html.escape(title)} — framed black &amp; white photograph by Antaine Reilly shown in an interior" width="1000" height="750" loading="eager"></div>
  <div>
    <div class="mono">Signed limited-edition photograph</div>
    <h1 class="title display">{html.escape(title)}</h1>
    <p class="story">{html.escape(story)}</p>
    <div class="price display">{price_line}</div>
    {sizes_html}
    <a class="cta" href="{SHOP_URL}">View in the shop</a>
    <a class="cta ghost" href="mailto:{EMAIL}?subject=ANTAINE%20enquiry%20—%20{handle}">Enquire / commission</a>
    <p class="trust">Printed &amp; framed to order · shipped from the studio · free EU shipping · 14-day returns</p>
    <p class="spec">{html.escape(spec)}</p>
  </div>
</div></div>
{foot()}"""
    d=os.path.join(PUB,"prints",handle); os.makedirs(d,exist_ok=True)
    open(os.path.join(d,"index.html"),"w").write(body)
    index_cards.append((handle,title,image,price_line))
    sitemap_urls.append((canonical,"0.7"))

# ---- prints index ----
idx_canonical=f"{SITE}/prints/"
cards_html="".join(
    f'<a class="card" href="/prints/{h}/"><div class="ph"><img src="{im}" alt="{html.escape(t)} — B&amp;W photograph print by Antaine Reilly" loading="lazy"></div><h3>{html.escape(t)}</h3><div class="p">{pl}</div></a>'
    for h,t,im,pl in index_cards)
idx_jsonld={"@context":"https://schema.org","@graph":[
    {"@type":"CollectionPage","@id":idx_canonical+"#page","name":"Black & White Photography Prints","url":idx_canonical,
     "description":"Signed, limited-edition black & white photography prints by Antaine Reilly — London street parties, Berlin, Havana, Barcelona and the archive."},
    {"@type":"ItemList","itemListElement":[
        {"@type":"ListItem","position":i+1,"url":f"{SITE}/prints/{h}/","name":t} for i,(h,t,_,_) in enumerate(index_cards)]},
    org_node()]}
idx_title="Black & White Photography Prints — Signed Editions | ANTAINE"
idx_desc="Signed, limited-edition black & white photography prints by Antaine Reilly — London street parties, Berlin, Havana, the archive. Framed, made to order. Collector & trade."
idx_body=f"""{head(idx_title,idx_desc,idx_canonical,index_cards[5][2],idx_jsonld)}
<div class="wrap">
<div class="hero"><div class="mono">The print archive</div>
<h1 class="display">Black &amp; White Photography Prints</h1>
<p class="lead">Signed, limited-edition photographs by Antaine Reilly — London’s street parties and free parties, Berlin’s Love Parade, Havana, Barcelona and the road. Museum-quality, framed and made to order, shipped worldwide. For collectors and for trade.</p>
<a class="cta" href="/trade/">Trade &amp; hospitality →</a></div>
<div class="grid">{cards_html}</div></div>
{foot()}"""
open(os.path.join(PUB,"prints","index.html"),"w").write(idx_body)

# ---- trade page ----
tr_canonical=f"{SITE}/trade/"
tr_title="Art for Hotels, Restaurants & Interiors — Trade | ANTAINE"
tr_desc="Original black & white photography for hotels, restaurants, bars, clubs and interior designers. Made-to-order at any scale, framed and delivered. Trade pricing & volume."
tr_faq=[
 ("Do you work with interior designers and trade buyers?","Yes. ANTAINE supplies original black & white photography to interior designers, art consultants, hotels, restaurants, bars and clubs — from single signature pieces to whole-property programmes, with trade pricing and volume terms."),
 ("Can prints be produced at scale and to specific sizes?","Every image is printed and framed to order, so editions scale to a project and sizes run from 21×30 cm up to 70×100 cm and bespoke dimensions on request. Museum-quality matte paper, black aluminium frames."),
 ("Which markets do you deliver to?","We produce and ship across the EU, UK, US and Canada via local production, so lead times and freight stay short for hospitality fit-outs and roll-outs."),
 ("How do we start a trade project?","Email alex@rmtv.io with the space, the mood and rough quantities. You’ll get a curated selection, sizing and a trade quote — no account setup required to begin."),
]
tr_jsonld={"@context":"https://schema.org","@graph":[
    {"@type":"Service","@id":tr_canonical+"#service","name":"Art for Hospitality & Interiors — Trade Programme",
     "serviceType":"Fine-art photography supply for hospitality and interior design",
     "provider":{"@id":f"{SITE}/#organization"},"url":tr_canonical,
     "areaServed":["GB","IE","ES","NL","FR","DE","US","CA"],
     "description":tr_desc,"audience":{"@type":"BusinessAudience","name":"Interior designers, art consultants, hotels, restaurants, bars and clubs"}},
    {"@type":"FAQPage","mainEntity":[
        {"@type":"Question","name":q,"acceptedAnswer":{"@type":"Answer","text":a}} for q,a in tr_faq]},
    org_node()]}
faq_html="".join(f"<dt>{html.escape(q)}</dt><dd>{html.escape(a)}</dd>" for q,a in tr_faq)
tr_body=f"""{head(tr_title,tr_desc,tr_canonical,index_cards[1][2],tr_jsonld)}
<div class="wrap">
<div class="hero"><div class="mono">Trade · Hospitality · Interiors</div>
<h1 class="display">Photography that gives a room a memory.</h1>
<p class="lead">ANTAINE supplies original black &amp; white photography to interior designers, art consultants and hospitality — hotels, restaurants, bars and clubs. Not stock, not wallpaper: signed work from a real archive, printed and framed to order at any scale.</p>
<a class="cta" href="mailto:{EMAIL}?subject=ANTAINE%20trade%20enquiry">Start a trade enquiry</a>
<a class="cta ghost" href="/prints/">Browse the archive</a></div>

<section class="blk"><h2 class="display">Who we work with</h2><div class="cols">
<div><h3>Interior designers &amp; art consultants</h3><p>Curated selections to a brief, sized and framed for the space — with trade pricing and a single point of contact.</p></div>
<div><h3>Hotels &amp; restaurants</h3><p>Signature pieces and full-property programmes. Consistent framing, made-to-order sizes, short lead times per market.</p></div>
<div><h3>Bars, clubs &amp; venues</h3><p>Nightlife and free-party photography with real provenance — Love Parade, Reclaim the Streets, Razzmatazz, Sónar.</p></div>
</div></section>

<section class="blk"><h2 class="display">How it works</h2><div class="cols">
<div><h3>1 · Brief</h3><p>Tell us the space, the mood and rough quantities. We come back with a curated set and sizing.</p></div>
<div><h3>2 · Proof &amp; quote</h3><p>Framed mock-ups in situ, a trade quote, and any bespoke sizes — approved before anything is produced.</p></div>
<div><h3>3 · Produce &amp; deliver</h3><p>Printed and framed to order near the destination (EU · UK · US · CA), delivered ready to hang.</p></div>
</div></section>

<section class="blk"><h2 class="display">Trade &amp; bulk</h2>
<p class="lead">Made-to-order production means volume without inventory risk: order one piece or fifty, in mixed sizes, to the same finish. Trade pricing scales with the project. Rights and licensing handled per engagement.</p></section>

<section class="blk"><h2 class="display">Questions</h2><dl class="faq">{faq_html}</dl>
<p style="margin-top:26px"><a class="cta" href="mailto:{EMAIL}?subject=ANTAINE%20trade%20enquiry">Email {EMAIL}</a></p></section>
</div>
{foot()}"""
os.makedirs(os.path.join(PUB,"trade"),exist_ok=True)
open(os.path.join(PUB,"trade","index.html"),"w").write(tr_body)

# ---- sitemap ----
sm=['<?xml version="1.0" encoding="UTF-8"?>','<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
for loc,pri in sitemap_urls:
    sm.append(f"  <url><loc>{loc}</loc><lastmod>2026-07-18</lastmod><changefreq>weekly</changefreq><priority>{pri}</priority></url>")
sm.append("</urlset>")
open(os.path.join(PUB,"sitemap.xml"),"w").write("\n".join(sm)+"\n")

print(f"generated {len(DATA)} PDPs + prints index + trade page")
print(f"sitemap urls: {len(sitemap_urls)}")
