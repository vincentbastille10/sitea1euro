// lib/hero-image.js
import { getMetierById } from "./metiers";

// Logique reprise de Bootstrap V3 (src-tauri/src/image_gen.rs) : une vraie
// photo Pexels contextuelle si une clé est là, sinon un dégradé premium
// fabriqué localement. AUCUNE génération d'image par IA — c'est le choix acté
// pour Bootstrap, et il ferme ici une vraie porte : la génération FLUX partait
// de /api/generate-site, route publique sans authentification ni limite, et en
// JS elle ne passait pas par together_gateway.py (dont la liste de blocage
// contient pourtant "flux"). Autrement dit : n'importe qui pouvait faire
// tourner la facture Together. Pexels est gratuit et suffit.

// Palettes de Bootstrap (image_gen.rs::theme_colors_for), pour que le repli
// ressemble au reste de la maison.
const PALETTES = {
  premium_corporate: ["#2563eb", "#0ea5e9"],
  premium_green: ["#10b981", "#14b8a6"],
  premium_orange: ["#f97316", "#f59e0b"],
  premium_light: ["#6366f1", "#38bdf8"],
  premium_dark: ["#7c3aed", "#3b82f6"],
};

// Bootstrap : image_gen.rs::initials()
function initiales(nom) {
  const n = (nom || "").trim();
  const caps = [...n].filter((c) => c >= "A" && c <= "Z").slice(0, 2).join("");
  if (caps.length >= 2) return caps;
  const mots = n.split(/\s+/).filter(Boolean);
  if (mots.length >= 2) return (mots[0][0] + mots[1][0]).toUpperCase();
  return (n.slice(0, 2) || "A").toUpperCase();
}

function clair(hex, f = 0.45) {
  const n = parseInt(hex.slice(1), 16);
  const m = (d) => Math.round(d + (255 - d) * f).toString(16).padStart(2, "0");
  return `#${m((n >> 16) & 255)}${m((n >> 8) & 255)}${m(n & 255)}`;
}

// Dégradé premium + initiales, en SVG inline (data URI) : pas de réseau, pas de
// fichier à écrire — indispensable en serverless. Equivalent du
// write_placeholder_png() de Bootstrap.
function degradePremium(nom_enseigne, brandColor) {
  const [a, b] = /^#[0-9a-fA-F]{6}$/.test(brandColor || "")
    ? [brandColor, clair(brandColor)]
    : PALETTES.premium_dark;
  const ini = initiales(nom_enseigne);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="896" viewBox="0 0 1600 896">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
<radialGradient id="h" cx=".7" cy=".3" r=".7">
<stop offset="0" stop-color="#fff" stop-opacity=".28"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
</radialGradient></defs>
<rect width="1600" height="896" fill="url(#g)"/><rect width="1600" height="896" fill="url(#h)"/>
<text x="800" y="448" fill="#fff" fill-opacity=".92" font-family="Helvetica,Arial,sans-serif"
 font-size="150" font-weight="700" text-anchor="middle" dominant-baseline="central"
 letter-spacing="8">${ini.replace(/[<>&]/g, "")}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

// Recherche Pexels contextuelle (recyclé du moteur Bootstrap V3 : image_gen.rs
// search_query/fetch_pexels) : une vraie photo pertinente par métier/ville au
// lieu d'une unique image générique pour tout le monde. C'est désormais le
// chemin PRINCIPAL — gratuit, fiable, sans facture.
async function fetchPexelsPhoto(query) {
  const key = process.env.PEXELS_API_KEY;
  if (!key) return "";
  try {
    const res = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape&size=large`,
      { headers: { Authorization: key }, signal: AbortSignal.timeout(10000) }
    );
    if (!res.ok) return "";
    const data = await res.json();
    const p = data?.photos?.[0]?.src;
    return p?.large2x || p?.large || p?.original || "";
  } catch {
    return "";
  }
}

// Requête Pexels courte et pertinente. Priorité à l'activité DÉTECTÉE du
// prospect (texte libre : "DJ", "fleuriste", "food truck"…) pour que n'importe
// quelle activité ait une image juste, sans liste de métiers figée. Repli sur
// l'imagePrompt du métier connu, puis l'id.
function buildPexelsQuery(metier, metierId, ville, activity) {
  const base = (activity || metier?.imagePrompt || metierId || "business")
    .split(",")[0]
    .trim();
  return ville ? `${base} ${ville}` : base;
}

export async function generateHeroImageUrl(
  metierId, nom_enseigne, ville, lang = "fr", activity = "", brandColor = ""
) {
  const metier = getMetierById(metierId);

  // 1) Vraie photo, contextuelle et gratuite. Chemin principal (Bootstrap).
  const pexels = await fetchPexelsPhoto(
    buildPexelsQuery(metier, metierId, ville, activity)
  );
  if (pexels) return pexels;

  // 2) Sinon, dégradé premium aux couleurs du prospect. Jamais une photo
  //    générique unique servie à tout le monde : c'est justement ce que ce
  //    générateur cherche à éviter.
  console.warn("[HERO] Pas de photo Pexels (clé absente ou aucun résultat) → dégradé premium.");
  return degradePremium(nom_enseigne, brandColor);
}
