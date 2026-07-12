// lib/metiers.js
// Chaque métier :
//   id            : identifiant stable (utilisé par getMetierById + le site généré)
//   label         : affiché sur le site perso
//   pitch         : accroche affichée en hero (page /s/[slug])
//   pack          : pack Betty (yaml) → persona/avatar du bot
//   betty_public_id : public_id du bot DÉMO à embarquer sur mybetty.online
//                     (créé par outreach/seed_demo_bots.py dans betty_abonnement_version2)
//   imagePrompt   : prompt de la hero image (lib/hero-image.js / Together FLUX)
//   lang          : "fr" (défaut) ou "en" → langue du site + de l'email
//
// Priorité stratégique 2026 : REALTOR US (cible la mieux couverte + vertical
// d'origine de Betty). Les métiers FR restent pour le marché français.

export const METIERS = [
  {
    id: "realtor",
    label: "Real Estate Agent",
    pack: "betty_immo",
    betty_public_id: "demo-realtor",
    lang: "en",
    pitch:
      "Your leads get answered the moment they land on your site — day, night, weekends. Betty qualifies buyers and sellers and captures their contact info, so no opportunity goes cold.",
    imagePrompt:
      "bright modern real estate office, elegant living room staging, large windows, warm natural light, upscale American home interior",
  },
  {
    id: "estheticienne",
    label: "Esthéticienne / institut de beauté",
    pack: "betty_estheticienne",
    betty_public_id: "demo-estheticienne",
    pitch:
      "Vos clientes réservent en ligne 24h/24, même quand vous êtes en cabine. Rappels automatiques, moins de rendez-vous manqués, un institut qui rayonne.",
    imagePrompt:
      "institut de beauté haut de gamme, ambiance cocon, tons rosés et dorés, lumière douce, serviettes blanches, orchidées, style spa luxueux",
  },
  {
    id: "coiffeuse",
    label: "Coiffeuse / salon de coiffure",
    pack: "betty_coiffeur",
    betty_public_id: "demo-coiffeuse",
    pitch:
      "Un salon toujours ouvert à la réservation. Betty prend les rendez-vous et répond aux questions pendant que vous coiffez.",
    imagePrompt:
      "salon de coiffure moderne et élégant, miroirs, fauteuils design, lumières soft, ambiance chaleureuse",
  },
  {
    id: "estheticienne_ongles",
    label: "Prothésiste ongulaire / nail bar",
    pack: "betty_estheticienne",
    betty_public_id: "demo-estheticienne",
    pitch:
      "Vos poses se réservent en ligne, vos clientes reçoivent leurs rappels, et vous ne ratez plus une demande.",
    imagePrompt:
      "nail bar chic, poste de manucure épuré, tons pastel, vernis alignés, lumière rose douce, ambiance instagrammable",
  },
  {
    id: "artisan",
    label: "Artisan du bâtiment",
    pack: "betty_artisan",
    betty_public_id: "demo-artisan",
    pitch:
      "Betty capte vos demandes de devis le soir et le week-end, quand vous êtes sur le chantier. Plus aucune opportunité perdue.",
    imagePrompt:
      "artisan du bâtiment au travail, chantier propre et lumineux, outils, ambiance professionnelle et rassurante",
  },
  {
    id: "plombier",
    label: "Plombier / chauffagiste",
    pack: "betty_plombier",
    betty_public_id: "demo-plombier",
    pitch:
      "Une urgence à 21h ? Betty prend la demande, qualifie le besoin et vous transmet le contact. Vos dépannages ne dorment jamais.",
    imagePrompt:
      "plombier professionnel intervenant dans une salle de bain moderne, ambiance propre et sérieuse, lumière naturelle",
  },
  {
    id: "coach",
    label: "Coach sportif / bien-être",
    pack: "betty_coach",
    betty_public_id: "demo-coach",
    pitch:
      "Vos prospects prennent contact et réservent leur séance découverte pendant que vous entraînez. Plus de clients, moins d’administratif.",
    imagePrompt:
      "coach sportif dans une salle lumineuse et moderne, ambiance énergique et motivante, tons dynamiques",
  },
  {
    id: "photographe",
    label: "Photographe",
    pack: "betty_photographe",
    betty_public_id: "demo-photographe",
    pitch:
      "Betty renseigne vos tarifs, vos disponibilités et récupère les demandes de shooting, 24h/24.",
    imagePrompt:
      "studio photo élégant, éclairage professionnel, appareils photo, ambiance créative et haut de gamme",
  },
  {
    id: "osteopathe",
    label: "Ostéopathe",
    pack: "betty_osteopate",
    betty_public_id: "demo-osteopathe",
    pitch:
      "Vos patients prennent rendez-vous en ligne à toute heure. Betty répond aux questions courantes et allège votre secrétariat.",
    imagePrompt:
      "cabinet d'ostéopathe moderne, ambiance douce, tons bleus et blancs, table de soin, lumière naturelle",
  },
  {
    id: "therapeute",
    label: "Thérapeute / psychopraticien",
    pack: "betty_neutre_001",
    betty_public_id: "demo-therapeute",
    pitch:
      "Un premier contact tout en douceur, à tout moment. Betty accueille, informe et propose un rendez-vous.",
    imagePrompt:
      "cabinet de thérapie chaleureux, fauteuils confortables, plantes vertes, ambiance calme et rassurante",
  },
  {
    id: "immobilier",
    label: "Agent immobilier",
    pack: "betty_immo",
    betty_public_id: "demo-immobilier",
    pitch:
      "Betty qualifie vos acheteurs et vendeurs 24h/24 et ne laisse aucun lead refroidir.",
    imagePrompt:
      "agence immobilière moderne et lumineuse, vitrine élégante, ambiance professionnelle et confiante",
  },
];

export function getMetierById(id) {
  return METIERS.find((m) => m.id === id) || null;
}

// Packs dont l'avatar est un HOMME → accord masculin partout (site + greeting).
// Source unique, réutilisée par page.jsx et betty-bot.js.
export const MALE_PACKS = new Set([
  "betty_architecte", "betty_assurance", "betty_coach", "betty_graphiste",
  "betty_kine", "betty_mecano", "betty_nutritioniste", "betty_osteopate",
  "betty_paysagiste", "betty_photographe", "betty_plombier", "betty_traiteur",
  "betty_yoga", "betty_serrurier", "betty_veterinaire", "betty_plaquiste",
  "betty_comptable", "betty_dentiste", "betty_artisan", "medecin", "betty_medecin",
]);

export function isMalePack(pack) {
  return MALE_PACKS.has((pack || "").toLowerCase());
}
