// lib/metiers.js
// IMPORTANT : utilise ici les mêmes IDs que tes packs Betty (yaml).
// Exemple : "osteopathe", "therapeute", etc.

export const METIERS = [
  {
    id: "osteopathe",
    label: "Ostéopathe",
    imagePrompt:
      "photo professionnelle d'un cabinet d'ostéopathe moderne, ambiance douce, tons bleus et blancs, lumière naturelle",
  },
  {
    id: "therapeute",
    label: "Thérapeute / psychopraticien",
    imagePrompt:
      "photo professionnelle d'un cabinet de thérapie chaleureux, fauteuils confortables, plantes vertes, ambiance calme",
  },
  {
    id: "coiffeuse",
    label: "Coiffeuse / salon de coiffure",
    imagePrompt:
      "photo professionnelle d'un salon de coiffure moderne, miroirs, lumières soft, ambiance élégante",
  },
  // ➜ tu complètes avec tous tes métiers Betty, même id que dans tes YAML
];

export function getMetierById(id) {
  return METIERS.find((m) => m.id === id) || null;
}
