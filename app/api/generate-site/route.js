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
    brand_color,
    prospect_image,
  } = b || {};

  // Couleur de marque du prospect (site « sur mesure ») : on ne garde qu'un hex valide.
  const brandColorSafe = /^#[0-9a-fA-F]{6}$/.test(brand_color || "") ? brand_color : "";
  // Image du propre site du prospect (fond « sur mesure ») : URL http(s) seulement.
  const prospectImageSafe = /^https?:\/\/.+/i.test(prospect_image || "") ? prospect_image : "";

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

  // Fond « sur mesure » : l'image du propre site du prospect si on l'a captée,
  // sinon une image contextuelle générée selon le métier.
  const heroImageUrl = prospectImageSafe
    || await generateHeroImageUrl(metier, nom_enseigne, ville, langSafe);

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
    brand_color: brandColorSafe,
    lang: langSafe,
    plan: plan || "site",
    hero_image_url: heroImageUrl,
    created_at: new Date().toISOString(),
  };

  await createSite(site);

  // Envoi d'un mail récap à l'adresse du client. On remonte le VRAI statut
  // Mailjet dans la réponse : un site créé ne veut pas dire un email délivré.
  let emailSent = false, emailError = null;
  try {
    const mailRes = await sendSiteEmail(site);
    emailSent = mailRes?.ok === true;
    if (!emailSent) emailError = mailRes?.error || `status ${mailRes?.status ?? "?"}`;
  } catch (e) {
    emailError = String(e);
    console.error("Erreur envoi email site:", e);
  }

  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  return NextResponse.json({
    ok: true,
    slug,
    url: `https://${slug}.${rootDomain}`,   // URL publique (sous-domaine)
    path: `/s/${slug}`,                       // accès direct (fallback / preview)
    email_sent: emailSent,                    // false = l'email n'est PAS parti
    email_error: emailError,                  // détail si échec (ex. Mailjet 401)
  });
}
