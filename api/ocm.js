export default async function handler(req, res) {
  try {
    const key = process.env.OCM_API_KEY;
    if (!key) {
      res.status(500).json({ error: "Missing OCM_API_KEY" });
      return;
    }

    const params = new URLSearchParams(req.query);
    params.set("key", key);

    if (!params.has("compact")) params.set("compact", "true");
    const mr = Number(params.get("maxresults") || "25");
    params.set("maxresults", String(Math.min(Math.max(mr, 1), 25)));

    const url = "https://api.openchargemap.io/v3/poi/?" + params.toString();

    const r = await fetch(url, {
      headers: { "Accept": "application/json" }
    });

    const text = await r.text();

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Content-Type", "application/json");
    res.status(r.status).send(text);
  } catch (e) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.status(502).json({ error: "Proxy failed", detail: String(e) });
  }
}
