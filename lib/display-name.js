// Les noms viennent souvent du domaine ("Robertmasseyco") : on lit le vrai nom sur le site d'origine
// (og:site_name ou segment du <title> qui correspond aux lettres du nom). Cache 7 jours, repli = nom actuel.
const letters = (s) => (s || "").toLowerCase().normalize("NFD").replace(/[^a-z0-9]/g, "");
const decode = (s) => s.replace(/&amp;/g, "&").replace(/&#0?39;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();

export async function betterName(site, ms = 3500) {
  const nom = site?.nom_enseigne || "";
  if (!nom || /\s/.test(nom.trim()) || !site.site_url) return nom; // déjà un nom à mots séparés
  try {
    const r = await fetch(site.site_url, { signal: AbortSignal.timeout(ms), next: { revalidate: 604800 } });
    if (!r.ok) return nom;
    const html = (await r.text()).slice(0, 60000);
    const og = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)/i)?.[1];
    const title = html.match(/<title[^>]*>([^<]+)/i)?.[1];
    const key = letters(nom);
    const cands = [og, ...(title ? decode(title).split(/\s[|\-–—·:]\s/) : [])].filter(Boolean).map(decode);
    const hit = cands.find((c) => c.includes(" ") && c.length < 60 && letters(c).includes(key.slice(0, Math.min(key.length, 8))) );
    return hit || nom;
  } catch { return nom; }
}
