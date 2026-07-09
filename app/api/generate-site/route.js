import { NextResponse } from "next/server";
import { createSite } from "../../../lib/sites-db";
import { generateHeroImageUrl } from "../../../lib/hero-image";
import { sendSiteEmail } from "../../../lib/mail";
import { getMetierById } from "../../../lib/metiers";

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

  // Génère une image de fond (pour l'instant placeholder dans hero-image.js)
  const heroImageUrl = await generateHeroImageUrl(metier, nom_enseigne, ville);

  // public_id du bot Betty : fourni explicitement, sinon déduit du métier.
  const bettyPublicId =
    b.betty_public_id || getMetierById(metier)?.betty_public_id || "";

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
