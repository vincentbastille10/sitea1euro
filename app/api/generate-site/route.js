import { NextResponse } from "next/server";
import { createSite } from "../../../lib/sites-db";
import { generateHeroImageUrl } from "../../../lib/hero-image";
import { sendSiteEmail } from "../../../lib/mail";
import { getMetierById } from "../../../lib/metiers";
import { upsertProspectBot } from "../../../lib/betty-bot";

export async function POST(req) {
  const b = await req.json();
  const {
    metier,
    nom_enseigne,
    ville,
    adresse,
    telephone,
    email,
    betty_on,
    plan,
    lang,
  } = b || {};

  // Requis : métier, enseigne, ville, email (email = destinataire des leads).
  // adresse / téléphone sont optionnels (souvent absents des annuaires).
  if (!metier || !nom_enseigne || !ville || !email) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  const adresseSafe = adresse || "";
  const telephoneSafe = telephone || "";

  const slug = (nom_enseigne || "site")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 63)              // limite d'un label DNS (sous-domaine)
    .replace(/-$/, "") || "site";

  // langue explicite (déduite de la ville/région ciblée) prioritaire sur celle du métier
  const langSafe = (lang === "en" || lang === "fr")
    ? lang
    : (getMetierById(metier)?.lang === "en" ? "en" : "fr");

  // Génère une image de fond, dans la langue du site
  const heroImageUrl = await generateHeroImageUrl(metier, nom_enseigne, ville, langSafe);

  // Bot Betty INDIVIDUEL à ce prospect (pas le bot démo partagé) : mémoire de
  // conversation propre + leads captés envoyés à SON email. C'est ce bot qui
  // est embarqué sur son site.
  let bettyPublicId = "";
  const info = getMetierById(metier);
  try {
    bettyPublicId = await upsertProspectBot({
      email,
      pack: info?.pack || "betty_neutre_001",
      botKey: metier,
      name: nom_enseigne,
      metierLabel: info?.label || metier,
      lang: langSafe,
    });
  } catch (e) {
    console.error("[BETTY BOT] création échouée, repli sur le bot démo:", e);
    bettyPublicId = b.betty_public_id || info?.betty_public_id || "";
  }

  const site = {
    slug,
    metier,
    nom_enseigne,
    ville,
    adresse: adresseSafe,
    telephone: telephoneSafe,
    email,
    betty_on: plan === "site+betty" && !!betty_on,
    betty_public_id: bettyPublicId,
    lang: langSafe,
    plan: plan || "site",
    hero_image_url: heroImageUrl,
    created_at: new Date().toISOString(),
  };

  await createSite(site);

  // Envoi d'un mail récap à l'adresse du client
  try {
    await sendSiteEmail(site);
  } catch (e) {
    console.error("Erreur envoi email site:", e);
  }

  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  return NextResponse.json({
    ok: true,
    slug,
    url: `https://${slug}.${rootDomain}`,   // URL publique (sous-domaine)
    path: `/s/${slug}`,                       // accès direct (fallback / preview)
  });
}
