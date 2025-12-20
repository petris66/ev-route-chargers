function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function fetchWithTimeout(url, ms) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, {
      headers: { "Accept": "application/json" },
      signal: controller.signal
    });
  } finally {
    clearTimeout(t);
  }
}

export default async function handler(req, res) {
  try {
    const key = process.env.OCM_API_KEY;
    if (!key) {
      res.status(500).json({ error: "Missing OCM_API_KEY" });
      return;
    }

    // Copy all query params through
    const params = new URLSearchParams(req.query);

    // Server-side key
    params.set("key", key);

    // DO NOT force compact. If client wants it, they can send compact=true themselves.
    // (This helps OperatorInfo.Title etc. stay available.)
    // if (!params.has("compact")) params.set("compact", "true");  <-- removed

    // Cap maxresults but allow more than 25
    const mr = Number(params.get("maxresults") || "40");
    params.set("maxresults", String(Math.min(Math.max(mr, 1), 60)));

    const url = "https://api.openchargemap.io/v3/poi/?" + params.toString();

    // Retry once if OCM is slow (helps random hiccups)
    let r;
    try {
      r = await fetchWithTimeout(url, 25000);
    } catch (e) {
      await sleep(600);
      r = await fetchWithTimeout(url, 25000);
    }

    const text = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    // Small cache to reduce hammering OCM (optional but helpful)
    res.setHeader("Cache-Control", "public, s-maxage=120, stale-while-revalidate=300");
    res.status(r.status).send(text);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({ error: "Proxy failed", detail: String(e) });
  }
}
