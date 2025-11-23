// lib/hero-image.js
import { METIERS, getMetierById } from "./metiers";

// TODO : brancher réellement Together ici.
// Pour l'instant on retourne une image de secours.
export async function generateHeroImageUrl(metierId, nom_enseigne, ville) {
  const metier = getMetierById(metierId);
  const prompt =
    metier?.imagePrompt ||
    `photo professionnelle en arrière-plan pour le métier ${metierId} à ${ville}`;

  console.log("Génération d'image pour:", prompt, "enseigne:", nom_enseigne);

  // Pseudo-code pour Together (à adapter avec ta clé et leur API réelle) :
  // const res = await fetch("https://api.together.ai/v1/images/generate", { ... })

  // Pour l'instant : image placeholder (tu peux la remplacer par une vraie URL d'image hébergée)
  return "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600";
}
