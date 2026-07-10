// app/api/run/route.js — moteur du panneau HyperBetty.
// Prend une liste d'URLs de courtiers → scrape (fetch simple, pas d'obscura) le
// nom/email/ville → appelle generate-site (crée le site + envoie l'email).
// Tout en serverless. Protégé par ADMIN_PASSWORD.
import { NextResponse } from "next/server";

export const maxDuration = 60;

const BAD = ["sentry", "wixpress", "example", "godaddy", "squarespace",
  "agentfire", "wix.com", "domain.com", ".png", ".jpg", ".gif", ".webp", "@2x"];
const US_STATES = new Set(("AL AK AZ AR CA CO CT DE FL GA HI ID IL IN IA KS KY LA ME MD MA MI MN MS MO MT NE NV NH NJ NM NY NC ND OH OK OR PA RI SC SD TN TX UT VT VA WA WV WI WY DC").split(" "));
const NOT_CITY = new Set(["Home", "Sell", "Buy", "Search", "Contact", "About", "Menu", "Real", "Estate", "Team", "Our", "The", "View"]);

function okEmail(e) {
  e = (e || "").toLowerCase().replace(/[.,;:)]+$/, "");
  return e.includes("@") && e.split("@")[1]?.includes(".") && !BAD.some(b => e.includes(b));
}
function extractEmail(html) {
  const mt = html.match(/mailto:([^"'?<>\s]+)/i);
  if (mt && okEmail(mt[1])) return mt[1].toLowerCase();
  const all = (html.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g) || []);
  for (const e of all) if (okEmail(e)) return e.toLowerCase().replace(/[.,;:)]+$/, "");
  return "";
}
function extractName(html) {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  if (!m) return "";
  return m[1].split(/[|–—:]| - /)[0].trim().slice(0, 80);
}
function extractCity(html) {
  const t = html.replace(/<[^>]+>/g, " ");
  let m = t.match(/\b([A-Z][A-Za-z.]+(?:\s[A-Z][A-Za-z.]+)?),\s*([A-Z]{2})\b/);
  if (m && US_STATES.has(m[2]) && !NOT_CITY.has(m[1].split(" ")[0])) return m[1].trim();
  m = t.match(/\b([A-Z][A-Za-z.]+(?:\s[A-Z][A-Za-z.]+)?)\s+([A-Z]{2})\b/);
  if (m && US_STATES.has(m[2]) && !NOT_CITY.has(m[1].split(" ")[0])) return m[1].trim();
  return "";
}
function findContactLink(html, base) {
  const re = /href=["']([^"']+)["']/gi; let m;
  const host = (() => { try { return new URL(base).host; } catch { return ""; } })();
  while ((m = re.exec(html))) {
    const href = m[1];
    if (/contact|about|meet|legal|mentions/i.test(href)) {
      try { const u = new URL(href, base); if (u.host === host) return u.toString(); } catch {}
    }
  }
  return "";
}
async function fetchText(url) {
  try {
    const r = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" },
      signal: AbortSignal.timeout(12000),
    });
    return await r.text();
  } catch { return ""; }
}

const PORTALS = ["bing.com", "microsoft.", "msn.com", "zillow", "realtor.com", "trulia",
  "redfin", "homes.com", "yelp.", "facebook.", "linkedin.", "instagram.", "youtube.",
  "twitter.", "x.com", "wikipedia.", "mapquest.", "indeed.", "glassdoor.", "apartments.com",
  "loopnet.", "google.", "duckduckgo.", "pinterest.", "tiktok.", "reddit.", "bbb.org",
  "yellowpages.", "angi.", "thumbtack.", "nextdoor."];

// Découverte automatique : scrape Bing pour une requête → URLs de courtiers.
async function discoverBrokers(query, n = 8) {
  const html = await fetchText(`https://www.bing.com/search?q=${encodeURIComponent(query)}&count=25&setlang=en-US&cc=US`);
  const hrefs = [...html.matchAll(/<a[^>]+href="(https?:\/\/[^"]+)"/gi)].map((m) => m[1]);
  const seen = new Set(), out = [];
  for (const h of hrefs) {
    let host;
    try { host = new URL(h).host.replace(/^www\./, "").toLowerCase(); } catch { continue; }
    if (!host.includes(".") || PORTALS.some((p) => host.includes(p))) continue;
    if (seen.has(host)) continue;
    seen.add(host);
    out.push("https://" + host + "/");
    if (out.length >= n) break;
  }
  return out;
}

export async function POST(req) {
  const b = await req.json().catch(() => ({}));
  if ((b.password || "") !== (process.env.ADMIN_PASSWORD || "betty2026")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const plan = b.plan === "site" ? "site" : "site+betty";
  const dry = !!b.dry;
  let urls = (b.urls || []).map((u) => (u || "").trim()).filter(Boolean);
  const discovered = [];
  // Mode auto-découverte : les lignes sont des VILLES → on trouve les courtiers.
  if (b.discover) {
    const cities = urls.slice(0, 10);
    urls = [];
    for (const city of cities) {
      const found = await discoverBrokers(`real estate brokerage ${city}`, 8);
      for (const f of found) if (!urls.includes(f)) urls.push(f);
      discovered.push({ city, found: found.length });
    }
  }
  urls = urls.slice(0, 25);
  const origin = new URL(req.url).origin;
  const results = [];

  for (let u of urls) {
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    const row = { url: u, email: "", name: "", city: "", site_url: "", status: "" };
    let html = await fetchText(u);
    if (!html) { row.status = "site injoignable"; results.push(row); continue; }
    row.email = extractEmail(html);
    row.name = extractName(html);
    row.city = extractCity(html);
    if (!row.email) {
      const c = findContactLink(html, u);
      if (c) { const h2 = await fetchText(c); row.email = extractEmail(h2); row.city = row.city || extractCity(h2); }
    }
    const missing = [!row.email && "email", !row.name && "nom", !row.city && "ville"].filter(Boolean);
    if (missing.length) { row.status = "ignoré (manque " + missing.join(", ") + ")"; results.push(row); continue; }
    if (dry) { row.status = "aperçu"; results.push(row); continue; }
    try {
      const r = await fetch(origin + "/api/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metier: "realtor", nom_enseigne: row.name, ville: row.city, email: row.email, plan, betty_on: plan === "site+betty" }),
      });
      const d = await r.json().catch(() => ({}));
      if (r.ok) { row.site_url = d.url || ""; row.status = "✅ site créé + email envoyé"; }
      else { row.status = "erreur generate-site: " + (d.error || r.status); }
    } catch (e) { row.status = "erreur: " + e.message; }
    results.push(row);
  }

  const created = results.filter((r) => r.site_url).length;
  return NextResponse.json({ results, count: results.length, created, discovered });
}
