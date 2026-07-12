// lib/hero-image.js
import { getMetierById } from "./metiers";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600";

// Recherche Pexels contextuelle (recyclé du moteur Bootstrap V3 : image_gen.rs
// search_query/fetch_pexels) : une vraie photo pertinente par métier/ville au
// lieu d'une unique image générique pour tout le monde. Sert de repli quand
// Together est indisponible (clé morte, budget…) — gratuit, fiable.
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

export async function generateHeroImageUrl(metierId, nom_enseigne, ville, lang = "fr", activity = "") {
  const apiKey = process.env.TOGETHER_API_KEY;
  const metier = getMetierById(metierId);

  // Pas de clé Together : repli direct sur une photo Pexels PERTINENTE
  // (recherche contextuelle), pas une image générique unique pour tout le monde.
  if (!apiKey) {
    console.warn("[TOGETHER] TOGETHER_API_KEY manquante, repli Pexels.");
    const pexels = await fetchPexelsPhoto(buildPexelsQuery(metier, metierId, ville, activity));
    return pexels || FALLBACK_IMAGE;
  }

  // Activité détectée du prospect en priorité (générique), sinon imagePrompt du
  // métier connu, sinon description neutre.
  const act = activity || metier?.imagePrompt || metierId;
  const basePrompt =
    metier?.imagePrompt ||
    (lang === "en"
      ? `professional background photo for a ${act} business in ${ville}`
      : `photo professionnelle en arrière-plan pour une activité de ${act} à ${ville}`);

  const wrapper = lang === "en"
    ? `Professional storefront-style website background for ${nom_enseigne} in ${ville}, elegant composition, soft lighting, modern style.`
    : `Site vitrine professionnel pour ${nom_enseigne} à ${ville}, composition élégante, lumière douce, style moderne.`;

  const prompt = `${basePrompt}. ${wrapper}`;

  try {
    const res = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // modèle rapide, tu pourras le changer si besoin
        model: "black-forest-labs/FLUX.1-schnell",
        prompt,
        width: 1600,   // ✅ multiple de 16
        height: 896,   // ✅ multiple de 16 (au lieu de 900)
        steps: 4,
        n: 1,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[TOGETHER] Erreur HTTP:", res.status, text);
      const pexels = await fetchPexelsPhoto(buildPexelsQuery(metier, metierId, ville, activity));
      return pexels || FALLBACK_IMAGE;
    }

    const data = await res.json();
    // format typique: { data: [{ url: "https://..." }, ...] }
    const url = data?.data?.[0]?.url;
    if (!url) {
      console.error("[TOGETHER] Pas d'URL dans la réponse:", data);
      const pexels = await fetchPexelsPhoto(buildPexelsQuery(metier, metierId, ville, activity));
      return pexels || FALLBACK_IMAGE;
    }

    return url;
  } catch (err) {
    console.error("[TOGETHER] Exception:", err);
    const pexels = await fetchPexelsPhoto(buildPexelsQuery(metier, metierId, ville, activity));
    return pexels || FALLBACK_IMAGE;
  }
}
