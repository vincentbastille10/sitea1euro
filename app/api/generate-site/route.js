import { NextResponse } from "next/server";
import { createSite } from "../../../lib/sites-db";
import { generateHeroImageUrl } from "../../../lib/hero-image";
import { sendSiteEmail, sendBettyOnlyEmail } from "../../../lib/mail";
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
    metier_label,
    activity,
    site_url,
  } = b || {};

  // URL du site existant du prospect (offre B) : sert au crawl MyBetty + config.
  const siteUrlSafe = /^https?:\/\/.+/i.test(site_url || "") ? site_url : "";

  // Activité détectée (texte libre) → HyperBetty s'adapte à N'IMPORTE quelle
  // activité, sans liste de métiers figée. Sert au libellé affiché + à l'image.
  const activitySafe = (activity || metier_label || "").toString().slice(0, 60).trim();
  const metierLabelSafe = (metier_label || activity || "").toString().slice(0, 60).trim();

  // Couleur de marque du prospect (site « sur mesure ») : on ne garde qu'un hex valide.
  const brandColorSafe = /^#[0-9a-fA-F]{6}$/.test(brand_color || "") ? brand_color : "";
  // Image du propre site du prospect (fond « sur mesure ») : URL http(s) seulement.
  const prospectImageSafe = /^https?:\/\/.+/i.test(prospect_image || "") ? prospect_image : "";

  // Requis : enseigne, ville, email, ET au moins une activité (métier connu OU
  // libellé libre) — HyperBetty s'adapte à n'importe quelle activité.
  if (!nom_enseigne || !ville || !email || (!metier && !metierLabelSafe)) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  const metierId = metier || "pro"; // id générique si activité libre sans métier connu
  const bettyBase = process.env.NEXT_PUBLIC_BETTY_URL || "https://mybetty.online";
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
    : (getMetierById(metierId)?.lang === "en" ? "en" : "fr");

  // Fond « sur mesure » : l'image du propre site du prospect si on l'a captée,
  // sinon une image contextuelle générée d'après l'activité détectée (générique).
  const heroImageUrl = prospectImageSafe
    || await generateHeroImageUrl(metierId, nom_enseigne, ville, langSafe, activitySafe);

  // Bot Betty INDIVIDUEL à ce prospect (pas le bot démo partagé) : mémoire de
  // conversation propre + leads captés envoyés à SON email. C'est ce bot qui
  // est embarqué sur son site.
  let bettyPublicId = "";
  const info = getMetierById(metierId);
  try {
    bettyPublicId = await upsertProspectBot({
      email,
      pack: info?.pack || "betty_neutre_001",
      botKey: metierId,
      name: nom_enseigne,
      metierLabel: metierLabelSafe || info?.label || metierId,
      lang: langSafe,
      phone: telephoneSafe,
      address: [adresseSafe, ville].filter(Boolean).join(", "),
      website: siteUrlSafe,
    });
  } catch (e) {
    console.error("[BETTY BOT] création échouée, repli sur le bot démo:", e);
    bettyPublicId = b.betty_public_id || info?.betty_public_id || "";
  }

  const site = {
    slug,
    metier: metierId,
    nom_enseigne,
    ville,
    adresse: adresseSafe,
    telephone: telephoneSafe,
    email,
    betty_on: (plan === "site+betty" || plan === "betty") && !!betty_on,
    betty_public_id: bettyPublicId,
    brand_color: brandColorSafe,
    metier_label: metierLabelSafe, // libellé libre de l'activité détectée
    site_url: siteUrlSafe,         // site existant du prospect (offre B)
    lang: langSafe,
    plan: plan || "site",
    hero_image_url: heroImageUrl,
    created_at: new Date().toISOString(),
  };

  await createSite(site);

  // Offre B (le prospect a déjà un site) : on demande à MyBetty de crawler son
  // site pour pré-remplir la Betty (scriptée sans LLM), prête à l'essai.
  if (siteUrlSafe && bettyPublicId) {
    try {
      await fetch(`${bettyBase}/api/trigger_initial_crawl`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ public_id: bettyPublicId }),
      });
    } catch (e) {
      console.error("[CRAWL] déclenchement échoué (non bloquant):", e);
    }
  }

  // Email : offre B (Betty seule, site existant) → template dédié ; sinon offre A.
  let emailSent = false, emailError = null;
  try {
    const mailRes = plan === "betty"
      ? await sendBettyOnlyEmail(site)
      : await sendSiteEmail(site);
    emailSent = mailRes?.ok === true;
    if (!emailSent) emailError = mailRes?.error || `status ${mailRes?.status ?? "?"}`;
  } catch (e) {
    emailError = String(e);
    console.error("Erreur envoi email:", e);
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
