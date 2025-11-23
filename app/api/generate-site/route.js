import { NextResponse } from "next/server";
import { createSite } from "../../../lib/sites-db";
import { generateHeroImageUrl } from "../../../lib/hero-image";
import { sendSiteEmail } from "../../../lib/mail";

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

  if (!metier || !nom_enseigne || !ville || !adresse || !telephone || !email) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const slug = (nom_enseigne || "site")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  // Génère une image de fond (pour l'instant placeholder dans hero-image.js)
  const heroImageUrl = await generateHeroImageUrl(metier, nom_enseigne, ville);

  const site = {
    slug,
    metier,
    nom_enseigne,
    ville,
    adresse,
    telephone,
    email,
    betty_on: plan === "site+betty" && !!betty_on,
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

  return NextResponse.json({ ok: true, url: `/s/${slug}` });
}
