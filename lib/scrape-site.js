// Lit le site d'origine du prospect pour que le sien lui ressemble : logo, couleur, accroche,
// texte « à propos », services, photos. Regex légères (pas de dépendance), tout est borné.
const dec = (s) => (s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/&#0?39;|&apos;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&#\d+;|&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const abs = (u, base) => { try { const x = new URL(u, base); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch { return ""; } };
const meta = (html, re) => html.match(re)?.[1] || "";

export async function scrapeSite(url) {
  const r = await fetch(url, { signal: AbortSignal.timeout(9000), headers: { "User-Agent": "Mozilla/5.0 (compatible; SpectraBot/1.0)" } });
  if (!r.ok) throw new Error("HTTP " + r.status);
  const base = r.url;
  const html = (await r.text()).slice(0, 400000).replace(/<(script|style|noscript|nav|footer|header)[\s\S]*?<\/\1>/gi, " ");
  const raw = html;

  const imgs = [...raw.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const attr = (tag, a) => tag.match(new RegExp(`\\b${a}=["']([^"']+)`, "i"))?.[1] || "";
  const src = (t) => abs(attr(t, "data-src") || attr(t, "src"), base);

  const logoTag = imgs.find((t) => /logo/i.test(t));
  const logo = (logoTag && src(logoTag)) || abs(meta(raw, /<link[^>]+rel=["'](?:apple-touch-icon|icon)["'][^>]+href=["']([^"']+)/i), base);

  const photos = [];
  const og = abs(meta(raw, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i), base);
  for (const t of imgs) {
    const u = src(t);
    if (!u || /logo|icon|sprite|avatar|pixel|badge|\.svg|\.gif|data:|facebook|twitter|spacer/i.test(u + attr(t, "class") + attr(t, "alt"))) continue;
    const w = parseInt(attr(t, "width") || "0", 10);
    if (w && w < 240) continue;
    if (!/\.(jpe?g|webp)(\?|$)/i.test(u)) continue;
    if (u !== og && !photos.includes(u)) photos.push(u);
    if (photos.length >= 4) break;
  }

  const color = meta(raw, /<meta[^>]+name=["']theme-color["'][^>]+content=["'](#[0-9a-fA-F]{6})["']/i);
  const tagline = dec(meta(raw, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)
    || meta(raw, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i)).slice(0, 220);

  const paras = [...raw.matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => dec(m[1]))
    .filter((p) => p.length >= 70 && p.length <= 600 && !/cookie|©|copyright|all rights|mentions légales|browser|upgrade|javascript/i.test(p));
  const about = paras.slice(0, 2).join(" ").slice(0, 700);

  const heads = [...raw.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => dec(m[1]))
    .filter((h) => h.length >= 4 && h.length <= 48 && !/cookie|newsletter|contact|menu|follow|suivez|©|\d{4}/i.test(h));
  const services = [...new Set(heads)].slice(0, 6);

  return { logo, color, tagline, about, services, photos };
}
