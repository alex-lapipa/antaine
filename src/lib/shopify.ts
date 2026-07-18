// Shopify Storefront API client (dependency-free) + product & cart operations.
// Reads a PUBLIC storefront token from env (safe to expose in the browser bundle).
const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
const API_VERSION = "2025-10";

export const shopifyReady = Boolean(DOMAIN && TOKEN);

async function storefront<T = unknown>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  if (!shopifyReady) {
    throw new Error("Shopify Storefront not configured — set VITE_SHOPIFY_DOMAIN and VITE_SHOPIFY_STOREFRONT_TOKEN.");
  }
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": TOKEN as string,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data as T;
}

export type SFVariant = {
  id: string;
  title: string;
  priceEUR: number;
  availableForSale: boolean;
};

export type SFProduct = {
  id: string;
  handle: string;
  title: string;
  description: string;
  productType: string;
  tags: string[];
  image: string | null;
  imageAlt: string | null;
  priceEUR: number;
  currency: string;
  variantId: string | null;
  availableForSale: boolean;
  variants: SFVariant[];
};

const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) {
    products(first: $first, sortKey: CREATED_AT, reverse: true) {
      nodes {
        id
        handle
        title
        description
        productType
        tags
        availableForSale
        featuredImage { url altText }
        priceRange { minVariantPrice { amount currencyCode } }
        variants(first: 10) { nodes { id title availableForSale price { amount } } }
      }
    }
  }
`;

type RawProduct = {
  id: string;
  handle: string;
  title: string;
  description: string | null;
  productType: string | null;
  tags: string[] | null;
  availableForSale: boolean;
  featuredImage: { url: string; altText: string | null } | null;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: { id: string; title: string; availableForSale: boolean; price: { amount: string } }[] };
};

export async function fetchProducts(first = 100): Promise<SFProduct[]> {
  const data = await storefront<{ products: { nodes: RawProduct[] } }>(PRODUCTS_QUERY, { first });
  return data.products.nodes.map((n) => ({
    id: n.id,
    handle: n.handle,
    title: n.title,
    description: n.description ?? "",
    productType: n.productType ?? "",
    tags: n.tags ?? [],
    image: n.featuredImage?.url ?? null,
    imageAlt: n.featuredImage?.altText ?? null,
    priceEUR: Number(n.priceRange?.minVariantPrice?.amount ?? 0),
    currency: n.priceRange?.minVariantPrice?.currencyCode ?? "EUR",
    variantId: n.variants?.nodes?.[0]?.id ?? null,
    availableForSale: n.availableForSale,
    variants: (n.variants?.nodes ?? []).map((v) => ({
      id: v.id,
      title: v.title,
      priceEUR: Number(v.price?.amount ?? 0),
      availableForSale: v.availableForSale,
    })),
  }));
}

const CART_CREATE = /* GraphQL */ `
  mutation CartCreate($lines: [CartLineInput!]!) {
    cartCreate(input: { lines: $lines }) {
      cart { id checkoutUrl }
      userErrors { field message }
    }
  }
`;

export async function createCheckout(lines: { variantId: string; quantity: number }[]): Promise<string> {
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(CART_CREATE, {
    lines: lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
  });
  const errs = data.cartCreate.userErrors;
  if (errs?.length) throw new Error(errs.map((e) => e.message).join("; "));
  const url = data.cartCreate.cart?.checkoutUrl;
  if (!url) throw new Error("No checkout URL returned by Shopify.");
  return url;
}

// Stable pseudo-hue (0–359) from a handle, for the generated-plate fallback
// used when a product has no photo — keeps the studio look consistent.
export function hueFor(handle: string): number {
  let h = 0;
  for (let i = 0; i < handle.length; i++) h = (h * 31 + handle.charCodeAt(i)) % 360;
  return h;
}
