// Crawl du site d'origine du prospect pour que le sien lui ressemble : logo, couleur, accroche,
// « à propos » (page dédiée si elle existe), et UNE fiche par service (page du service suivie depuis le menu).
// Regex légères, tout borné (7 pages max, timeouts courts).
const UA = { "User-Agent": "Mozilla/5.0 (compatible; SpectraBot/1.0)" };
const dec = (s) => (s || "").replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&")
  .replace(/&#0?39;|&apos;|&rsquo;/g, "'").replace(/&quot;/g, '"').replace(/&#\d+;|&[a-z]+;/g, " ").replace(/\s+/g, " ").trim();
const abs = (u, base) => { try { const x = new URL(u, base); return /^https?:$/.test(x.protocol) ? x.href : ""; } catch { return ""; } };
const meta = (html, re) => html.match(re)?.[1] || "";
const attr = (tag, a) => tag.match(new RegExp(`\\b${a}=["']([^"']+)`, "i"))?.[1] || "";
const nice = (t) => (t === t.toUpperCase() && t.length > 3 ? t.toLowerCase().replace(/(^|[\s/-])(\p{L})/gu, (m, a, b) => a + b.toUpperCase()) : t);
const BOILER = /cookie|©|copyright|all rights|mentions légales|browser|upgrade|javascript|privacy policy/i;

async function get(url, ms = 7000) {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(ms), headers: UA });
    if (!r.ok) return null;
    return { html: (await r.text()).slice(0, 400000), base: r.url };
  } catch { return null; }
}
const strip = (h) => h.replace(/<(script|style|noscript|nav|footer|header)[\s\S]*?<\/\1>/gi, " ");

function photosOf(html, base, skip = "") {
  const out = [];
  for (const t of [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0])) {
    const u = abs(attr(t, "data-src") || attr(t, "src"), base);
    if (!u || u === skip || !/\.(jpe?g|webp)(\?|$)/i.test(u)) continue;
    if (/logo|icon|sprite|avatar|pixel|badge|facebook|twitter/i.test(u + attr(t, "class") + attr(t, "alt"))) continue;
    const w = parseInt(attr(t, "width") || "0", 10);
    if (w && w < 240) continue;
    if (!out.includes(u)) out.push(u);
    if (out.length >= 4) break;
  }
  return out;
}
const parasOf = (html, min = 70) => [...strip(html).matchAll(/<p\b[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => dec(m[1]))
  .filter((p) => p.length >= min && p.length <= 700 && !BOILER.test(p));

export async function scrapeSite(url) {
  const home = await get(url, 9000);
  if (!home) throw new Error("site injoignable");
  const { html: full, base } = home;
  const host = new URL(base).hostname.replace(/^www\./, "");
  const raw = strip(full);

  // liens internes (menu inclus)
  const links = [...full.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>([\s\S]*?)<\/a>/gi)]
    .map((m) => ({ href: abs(m[1], base), text: dec(m[2]) }))
    .filter((l) => l.href && l.text.length >= 3 && l.text.length <= 40 && new URL(l.href).hostname.replace(/^www\./, "") === host
      && !/\.(pdf|jpe?g|png|zip)$/i.test(l.href));

  const imgs = [...raw.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
  const logoTag = imgs.find((t) => /logo/i.test(t));
  const logo = (logoTag && abs(attr(logoTag, "data-src") || attr(logoTag, "src"), base))
    || abs(meta(raw, /<link[^>]+rel=["'](?:apple-touch-icon|icon)["'][^>]+href=["']([^"']+)/i), base);
  const og = abs(meta(raw, /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/i), base);
  const photos = photosOf(raw, base, og);
  const color = meta(raw, /<meta[^>]+name=["']theme-color["'][^>]+content=["'](#[0-9a-fA-F]{6})["']/i);
  const tagline = dec(meta(raw, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)/i)
    || meta(raw, /<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)/i)).slice(0, 220);

  // candidats « services » : titres de la page qui sont aussi des liens, sinon entrées du menu
  const heads = [...new Set([...raw.matchAll(/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/gi)].map((m) => dec(m[1]))
    .filter((h) => h.length >= 4 && h.length <= 48 && !/cookie|newsletter|contact|menu|follow|suivez|©|\d{4}/i.test(h)))];
  const NOT_SERVICE = /^(home|accueil|contact|about|à propos|blog|news|login|connexion|search|faq|privacy|terms|careers|menu|cart|panier)/i;
  const seen = new Set();
  let cands = [];
  for (const h of heads) {
    const l = links.find((x) => x.text.toLowerCase() === h.toLowerCase());
    cands.push({ title: h, href: l?.href || "" });
  }
  if (cands.filter((c) => c.href).length < 3) {
    cands = links.filter((l) => !NOT_SERVICE.test(l.text) && !/about|contact|blog|login/i.test(l.href))
      .map((l) => ({ title: l.text, href: l.href }));
  }
  cands = cands.filter((c) => { const k = c.title.toLowerCase(); if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 6);

  const aboutLink = links.find((l) => /about|à propos|a propos|qui sommes|who we are|our (story|company)|notre histoire/i.test(l.text + " " + l.href));
  const toFetch = [...new Set([...cands.map((c) => c.href).filter(Boolean), aboutLink?.href].filter(Boolean))].slice(0, 7);
  const pages = Object.fromEntries((await Promise.allSettled(toFetch.map(async (u) => [u, await get(u, 7000)])))
    .filter((r) => r.status === "fulfilled" && r.value[1]).map((r) => r.value));

  const services = cands.map((c) => {
    const pg = c.href && pages[c.href];
    const paras = pg ? parasOf(pg.html, 60).slice(0, 3) : [];
    return {
      title: nice(c.title),
      text: paras.join(" ").slice(0, 420),
      image: pg ? photosOf(strip(pg.html), pg.base)[0] || "" : "",
    };
  });

  const aboutPg = aboutLink && pages[aboutLink.href];
  const homeParas = parasOf(raw);
  const about = ((aboutPg ? parasOf(aboutPg.html) : homeParas).slice(0, 3).join(" ") || homeParas.slice(0, 2).join(" ")).slice(0, 1100);

  return { logo, color, tagline, about, services, photos };
}
