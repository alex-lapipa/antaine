// Gelato API relay — Vercel serverless function.
// Why: some agent runtimes can't complete TLS to *.gelato.com; Vercel egress can.
// Security: only *.gelato.com targets, API key must be supplied per-request
// (never stored here), no logging of headers or bodies.
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    return res.status(405).json({ error: "POST only" });
  }
  const key = req.headers["x-gelato-key"];
  if (!key || typeof key !== "string" || key.length < 20) {
    return res.status(401).json({ error: "missing x-gelato-key" });
  }
  const { url, method = "GET", body } = req.body || {};
  let target;
  try {
    target = new URL(url);
  } catch {
    return res.status(400).json({ error: "invalid url" });
  }
  if (target.protocol !== "https:" || !/\.gelato\.com$/.test(target.hostname)) {
    return res.status(400).json({ error: "host not allowed" });
  }
  if (!["GET", "POST", "PUT", "PATCH", "DELETE"].includes(method)) {
    return res.status(400).json({ error: "method not allowed" });
  }
  try {
    const upstream = await fetch(target.toString(), {
      method,
      headers: { "X-API-KEY": key, "Content-Type": "application/json" },
      body: method === "GET" ? undefined : body ? JSON.stringify(body) : undefined,
    });
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", upstream.headers.get("content-type") || "application/json");
    return res.send(text);
  } catch (e) {
    return res.status(502).json({ error: "upstream fetch failed", detail: String(e) });
  }
}
