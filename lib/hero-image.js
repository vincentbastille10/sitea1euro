// lib/hero-image.js
import { getMetierById } from "./metiers";

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600";

export async function generateHeroImageUrl(metierId, nom_enseigne, ville) {
  const apiKey = process.env.TOGETHER_API_KEY;

  // Si pas de clé, on renvoie une image par défaut (pas de plantage)
  if (!apiKey) {
    console.warn("[TOGETHER] TOGETHER_API_KEY manquante, fallback image.");
    return FALLBACK_IMAGE;
  }

  const metier = getMetierById(metierId);
  const basePrompt =
    metier?.imagePrompt ||
    `photo professionnelle en arrière-plan pour le métier ${metierId} à ${ville}`;

  const prompt = `${basePrompt}. Site vitrine professionnel pour ${nom_enseigne} à ${ville}, composition élégante, lumière douce, style moderne.`;

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
      return FALLBACK_IMAGE;
    }

    const data = await res.json();
    // format typique: { data: [{ url: "https://..." }, ...] }
    const url = data?.data?.[0]?.url;
    if (!url) {
      console.error("[TOGETHER] Pas d'URL dans la réponse:", data);
      return FALLBACK_IMAGE;
    }

    return url;
  } catch (err) {
    console.error("[TOGETHER] Exception:", err);
    return FALLBACK_IMAGE;
  }
}
