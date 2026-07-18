// Real assets migrated from the old antaine site (Squarespace) + Blanco y Negro series (Shopify CDN).
import sirat from "./old/sirat.jpg";
import aphex from "./old/aphex.gif";
import cana from "./old/cana.jpg";
import img1781 from "./old/img1781.jpg";
import img0984 from "./old/img0984.jpg";
import portraitWeb from "./portrait-web.webp";
import oneInstrument from "./one-instrument.webp";

// Blanco y Negro — documentary B&W series. Remote (Shopify CDN) = one source of truth, repo stays light.
export const BLANCO_Y_NEGRO_MEDIA: Record<string, string> = {
  "love-parade-berlin": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-love-parade-berlin.jpg?v=1784355882",
  "love-parade-i": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-love-parade-i.jpg?v=1784355882",
  "love-parade-ii": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-love-parade-ii.jpg?v=1784355883",
  "reclaim-the-streets-london": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-reclaim-the-streets-london.jpg?v=1784355883",
  "carnival-against-capital": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-carnival-against-capital.jpg?v=1784355882",
  "hackney-squat-party-1999": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-hackney-squat-party-1999.jpg?v=1784355882",
  "brooklyn-street": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-brooklyn-street.jpg?v=1784355882",
  "crossing-street": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-crossing-street.jpg?v=1784355883",
  "sonar-2015": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-sonar-2015.jpg?v=1784355881",
  "razzmatazz-2016": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-razzmatazz-2016.jpg?v=1784355883",
  "love-is-everywhere": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-love-is-everywhere.jpg?v=1784355882",
  "juanin-larriba-london": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-juanin-larriba-london.jpg?v=1784355883",
  "alonso-yayo-2025": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-alonso-yayo-2025.jpg?v=1784355883",
  "img-0181": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-img-0181.jpg?v=1784355883",
  "img-1953": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-img-1953.jpg?v=1784355882",
  "img-2019": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-img-2019.jpg?v=1784355881",
  "img-6246": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-img-6246.jpg?v=1784355881",
  "img-6901": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-img-6901.jpg?v=1784355882",
  "img-7670": "https://cdn.shopify.com/s/files/1/1065/9482/8619/files/antaine-blancoynegro-img-7670.jpg?v=1784355881",
};

export const MEDIA: Record<string, string> = { sirat, aphex, cana, img1781, img0984, portrait: portraitWeb, "one-instrument": oneInstrument, ...BLANCO_Y_NEGRO_MEDIA };
