// lib/mail.js
import { getMetierById } from "./metiers";

function getBaseUrl() {
  // tu peux ajouter SITE_BASE_URL dans Vercel si tu veux,
  // sinon on garde l'URL actuelle
  return process.env.SITE_BASE_URL || "https://sitea1euro.vercel.app";
}

export async function sendSiteEmail(site) {
  const {
    email,
    nom_enseigne,
    slug,
    plan,
    ville,
    telephone,
    adresse,
    metier,
    lang: siteLang,
  } = site;

  const apiKey = process.env.MJ_API_KEY;
  const apiSecret = process.env.MJ_API_SECRET;
  const fromEmail = process.env.MJ_SENDER_EMAIL || "spectramediabots@gmail.com";
  const fromName = process.env.MJ_SENDER_NAME || "Spectra Media";

  if (!apiKey || !apiSecret) {
    console.warn("[MAILJET] Clés MJ_API_KEY ou MJ_API_SECRET manquantes. Mail non envoyé.");
    return { ok: false, error: "clés Mailjet manquantes" };
  }

  if (!email) {
    console.warn("[MAILJET] Email client manquant, impossible d'envoyer.");
    return { ok: false, error: "email destinataire manquant" };
  }

  // URL publique "impeccable" : sous-domaine par client (slug.spectramedia.online)
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const siteUrl = `https://${slug}.${rootDomain}`;
  const payUrl = `${siteUrl}/pay`;
  const withBetty = plan === "site+betty";
  // Offre B (Betty seule, pour ceux qui ont DÉJÀ un site que HyperBetty n'a pas
  // trouvé) — jamais mélangée à l'offre principale, simple porte de sortie.
  const bettyOnlyUrl = process.env.BETTY_ONLY_URL || "https://mybetty.online/config";
  // Langue de l'email : explicite (déduite de la ville/région ciblée) > défaut du métier > fr
  const lang = (siteLang === "en" || siteLang === "fr")
    ? siteLang
    : (getMetierById(metier)?.lang === "en" ? "en" : "fr");
  const enseigne = nom_enseigne || (lang === "en" ? "your business" : "votre établissement");
  const lieu = ville ? (lang === "en" ? ` in ${ville}` : ` à ${ville}`) : "";
  const footerMetier = metier ? metier.charAt(0).toUpperCase() + metier.slice(1) : "";

  const T = lang === "en" ? {
    subject: `${enseigne} — I built you a website (it's already live)`,
    preheader: `Your website${lieu} is live, and Betty is already capturing leads 24/7.`,
    eyebrow: "Your new website is ready",
    hi: "Hi,",
    intro: `I came across <strong>${enseigne}</strong>${lieu} and built you a clean, professional website. It's <strong>already online</strong> — see it right now, nothing to set up on your end.`,
    bettyLine: withBetty
      ? `And here's the real magic: <strong>Betty</strong>, an AI assistant, answers your visitors <strong>24/7</strong> and grabs their name, email and phone — even at 11pm, even when you're with a client. Every visitor who'd have left without a trace becomes a lead in your inbox.`
      : `A clean, fast website that builds trust at first glance.`,
    cta: "See my website →",
    payCta: "Start my 7-day free trial →",
    whatsIncludedTitle: "Here's exactly what you're getting:",
    whatsIncluded: withBetty ? [
      "A professional website, live right now — zero setup on your end",
      "Betty, your AI receptionist, answering visitors 24/7",
      "Every lead's name, email &amp; phone sent straight to your inbox",
      "$59/month, cancel anytime — no contract",
    ] : [
      "A professional website, live right now — zero setup on your end",
      "Fast, mobile-friendly, built to earn trust in seconds",
      "$1/month, cancel anytime — no contract",
    ],
    proof: `💡 Replying within a minute makes a prospect <strong>up to 7× more likely</strong> to become a client. Betty replies in 2 seconds — and never sleeps.`,
    proofText: "Replying within a minute makes a prospect up to 7x more likely to become a client. Betty replies in 2 seconds, and never sleeps.",
    price: withBetty
      ? "Website + your Betty assistant included — 7 days free, then $59/month. Cancel anytime, pay nothing if you cancel"
      : "Professional website — 7 days free, then $59/month, cancel anytime",
    close: "Try it free for 7 days. Love it? We put it under your name in 5 minutes — $59/month, cancel anytime. Not for you? You pay nothing. Zero risk.",
    seeYours: "See your website:",
    alreadySiteTitle: "Already have a website you're happy with?",
    alreadySiteText: "Then you just need Betty — add our AI receptionist to your existing site and capture leads 24/7, without changing a thing.",
    alreadySiteCta: "Add Betty to my site →",
    signoff: "Have a great day,\nBetty — Spectra Media",
  } : {
    subject: `${enseigne} — je vous ai créé un site (il est déjà en ligne)`,
    preheader: `Votre site${lieu} est en ligne, et Betty capte déjà vos clients 24h/24.`,
    eyebrow: "Votre nouveau site est prêt",
    hi: "Bonjour,",
    intro: `Je suis tombé sur <strong>${enseigne}</strong>${lieu} et je vous ai préparé un site professionnel, clair et rapide. Il est <strong>déjà en ligne</strong> — vous pouvez le voir tout de suite, rien à installer de votre côté.`,
    bettyLine: withBetty
      ? `Et le vrai plus : <strong>Betty</strong>, une assistante IA, répond à vos visiteurs <strong>24h/24</strong> et récupère leur nom, email et téléphone — même à 23h, même quand vous êtes avec un client. Chaque visiteur qui serait parti sans laisser de trace devient un contact dans votre boîte mail.`
      : `Un site clair, rapide, qui donne confiance dès le premier coup d'œil.`,
    cta: "Voir mon site →",
    payCta: "Activer mon essai gratuit 7 jours →",
    whatsIncludedTitle: "Voici exactement ce que vous obtenez :",
    whatsIncluded: withBetty ? [
      "Un site professionnel, déjà en ligne — aucune installation de votre côté",
      "Betty, votre réceptionniste IA, qui répond à vos client·es 24h/24",
      "Nom, email et téléphone de chaque prospect envoyés direct dans votre boîte mail",
      "59 €/mois, sans engagement, résiliable à tout moment",
    ] : [
      "Un site professionnel, déjà en ligne — aucune installation de votre côté",
      "Rapide, adapté mobile, pensé pour donner confiance en un coup d'œil",
      "1 €/mois, sans engagement, résiliable à tout moment",
    ],
    proof: `💡 Répondre en moins d'une minute rend un prospect <strong>jusqu'à 7× plus susceptible</strong> de devenir client. Betty répond en 2 secondes — et ne dort jamais.`,
    proofText: "Répondre en moins d'une minute rend un prospect jusqu'à 7× plus susceptible de devenir client. Betty répond en 2 secondes, et ne dort jamais.",
    price: withBetty
      ? "Site vitrine + votre assistante Betty incluse — 7 jours gratuits, puis 59 €/mois. Annulez avant, vous ne payez rien"
      : "Site vitrine professionnel — 7 jours gratuits, puis 59 €/mois, sans engagement",
    close: "Essayez 7 jours gratuitement. Ça vous plaît ? On le met à votre nom en 5 minutes — 59 €/mois, résiliable quand vous voulez. Sinon, vous ne payez rien. Zéro risque.",
    seeYours: "Voir votre site :",
    alreadySiteTitle: "Vous avez déjà un site qui vous convient ?",
    alreadySiteText: "Alors il vous manque juste Betty — ajoutez notre réceptionniste IA à votre site actuel et captez vos prospects 24h/24, sans rien changer à votre site.",
    alreadySiteCta: "Ajouter Betty à mon site →",
    signoff: "Belle journée,\nBetty — Spectra Media",
  };

  const strip = (s) => s.replace(/<\/?strong>/g, "");
  const subject = T.subject;

  const textPart = `
${T.hi}

${strip(T.intro)} ${strip(T.bettyLine)}

${T.whatsIncludedTitle}
${T.whatsIncluded.map((l) => `✅ ${strip(l)}`).join("\n")}

${T.seeYours} ${siteUrl}

${T.proofText}

${T.price}.
${T.payCta} ${payUrl}

${T.close}

— — —
${T.alreadySiteTitle}
${T.alreadySiteText}
${T.alreadySiteCta} ${bettyOnlyUrl}

${T.signoff}
`.trim();

  const htmlPart = `
<!-- preheader --><div style="display:none;max-height:0;overflow:hidden;opacity:0">${T.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1ea;margin:0;padding:24px 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(120,80,90,.10)">
      <tr><td style="background:linear-gradient(135deg,#b76e79,#8f5560);padding:28px 32px;color:#fff">
        <div style="font-size:13px;letter-spacing:.5px;opacity:.9;text-transform:uppercase">${T.eyebrow}</div>
        <div style="font-size:24px;font-weight:700;margin-top:6px">${enseigne}${lieu}</div>
      </td></tr>
      <tr><td style="padding:32px">
        <p style="font-size:16px;color:#3a2f36;line-height:1.6;margin:0 0 16px">${T.hi}</p>
        <p style="font-size:16px;color:#3a2f36;line-height:1.6;margin:0 0 16px">${T.intro} ${T.bettyLine}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf5f0;border-radius:12px;margin:4px 0 22px">
          <tr><td style="padding:18px 20px">
            <div style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:.4px;color:#b76e79;margin-bottom:10px">${T.whatsIncludedTitle}</div>
            ${T.whatsIncluded.map((l) => `<div style="font-size:14.5px;color:#3a2f36;line-height:1.5;margin:0 0 8px"><span style="color:#3a9958;font-weight:700">✓</span>&nbsp; ${l}</div>`).join("")}
          </td></tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 26px"><tr><td align="center" style="border-radius:999px;background:#b76e79">
          <a href="${siteUrl}" style="display:inline-block;padding:15px 34px;color:#fff;text-decoration:none;font-weight:700;font-size:16px;border-radius:999px">${T.cta}</a>
        </td></tr></table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px"><tr><td align="center" style="border-radius:999px;border:2px solid #b76e79">
          <a href="${payUrl}" style="display:inline-block;padding:13px 32px;color:#b76e79;text-decoration:none;font-weight:700;font-size:15px;border-radius:999px">${T.payCta}</a>
        </td></tr></table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf5f0;border-radius:12px;margin:8px 0 4px">
          <tr><td style="padding:16px 20px;font-size:15px;color:#5b4a52;line-height:1.55">${T.proof}</td></tr>
        </table>
        <p style="font-size:15px;color:#8a7d84;line-height:1.6;margin:20px 0 4px">
          <strong style="color:#3a2f36">${T.price}.</strong><br>${T.close}
        </p>
        <!-- Offre B, discrète : pour ceux qui ont déjà un site -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:26px 0 0;border-top:1px solid #f0e6e0">
          <tr><td style="padding:18px 0 0">
            <div style="font-size:14px;font-weight:700;color:#3a2f36;margin-bottom:4px">${T.alreadySiteTitle}</div>
            <div style="font-size:13.5px;color:#8a7d84;line-height:1.55;margin-bottom:10px">${T.alreadySiteText}</div>
            <a href="${bettyOnlyUrl}" style="display:inline-block;font-size:14px;font-weight:700;color:#b76e79;text-decoration:none">${T.alreadySiteCta}</a>
          </td></tr>
        </table>
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #f0e6e0;color:#a2939a;font-size:13px">
        Betty — <a href="https://spectramedia.online" style="color:#b76e79;text-decoration:none">Spectra Media</a><br>
        ${footerMetier}${ville ? " · " + ville : ""}
      </td></tr>
    </table>
  </td></tr>
</table>`.trim();

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");

  try {
    const res = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: fromEmail,
              Name: fromName,
            },
            ReplyTo: {
              Email: process.env.MJ_REPLY_TO || fromEmail,
              Name: fromName,
            },
            To: [
              {
                Email: email,
              },
            ],
            Subject: subject,
            TextPart: textPart,
            HTMLPart: htmlPart,
          },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      console.error("[MAILJET] Erreur HTTP:", res.status, txt);
      return { ok: false, status: res.status, error: txt.slice(0, 300) };
    }

    const data = await res.json();
    // Mailjet renvoie 200 même si un message individuel échoue → on vérifie le Status.
    const msgStatus = data?.Messages?.[0]?.Status;
    if (msgStatus !== "success") {
      console.error("[MAILJET] Message non 'success':", JSON.stringify(data));
      return { ok: false, status: res.status, error: `Mailjet status=${msgStatus}` };
    }
    console.log("[MAILJET] Mail envoyé:", JSON.stringify(data));
    return { ok: true, status: res.status };
  } catch (err) {
    console.error("[MAILJET] Exception:", err);
    return { ok: false, error: String(err) };
  }
}

// Envoi Mailjet mutualisé (retourne {ok,status,error} comme sendSiteEmail).
async function mjSend({ to, subject, textPart, htmlPart }) {
  const apiKey = process.env.MJ_API_KEY, apiSecret = process.env.MJ_API_SECRET;
  const fromEmail = process.env.MJ_SENDER_EMAIL || "spectramediabots@gmail.com";
  const fromName = process.env.MJ_SENDER_NAME || "Spectra Media";
  if (!apiKey || !apiSecret) return { ok: false, error: "clés Mailjet manquantes" };
  if (!to) return { ok: false, error: "email destinataire manquant" };
  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  try {
    const res = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ Messages: [{
        From: { Email: fromEmail, Name: fromName },
        ReplyTo: { Email: process.env.MJ_REPLY_TO || fromEmail, Name: fromName },
        To: [{ Email: to }], Subject: subject, TextPart: textPart, HTMLPart: htmlPart,
      }] }),
    });
    if (!res.ok) return { ok: false, status: res.status, error: (await res.text()).slice(0, 300) };
    const data = await res.json();
    const st = data?.Messages?.[0]?.Status;
    if (st !== "success") return { ok: false, status: res.status, error: `Mailjet status=${st}` };
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

// OFFRE B — le prospect a DÉJÀ un site : on ne lui vend pas un site, mais une
// Betty déjà pré-remplie avec les infos de SON site, à essayer tout de suite,
// puis à installer/configurer via /config (FR) ou /config_en (US).
export async function sendBettyOnlyEmail(site) {
  const { email, nom_enseigne, ville, betty_public_id, lang: siteLang, metier } = site;
  const lang = (siteLang === "en" || siteLang === "fr")
    ? siteLang : (getMetierById(metier)?.lang === "en" ? "en" : "fr");
  const bettyBase = process.env.NEXT_PUBLIC_BETTY_URL || "https://mybetty.online";
  const enseigne = nom_enseigne || (lang === "en" ? "your business" : "votre établissement");
  const lieu = ville ? (lang === "en" ? ` in ${ville}` : ` à ${ville}`) : "";
  const tryUrl = `${bettyBase}/chat?public_id=${encodeURIComponent(betty_public_id || "")}`;
  const configUrl = `${bettyBase}${lang === "en" ? "/config_en" : "/config"}`;

  const T = lang === "en" ? {
    subject: `${enseigne} — your Betty assistant is ready to try ✨`,
    preheader: `An AI assistant already loaded with your website's info — try it now.`,
    eyebrow: "Your assistant is ready",
    intro: `I built a virtual assistant, <strong>Betty</strong>, for <strong>${enseigne}</strong>${lieu} — already loaded with the information from <strong>your own website</strong>. She answers your visitors 24/7 and captures their details, with nothing to change on your current site.`,
    included: [
      "Already trained on your website's content — nothing to set up",
      "Answers your clients 24/7, even nights and weekends",
      "Every lead's name, email &amp; phone sent straight to your inbox",
      "Adds to your existing site in 2 minutes, without changing it",
    ],
    tryCta: "Try my assistant →", cfgCta: "Set it up on my site →",
    close: "Go ahead — ask her your own questions. She already knows your business.",
    signoff: "Have a great day,\nBetty — Spectra Media",
  } : {
    subject: `${enseigne} : votre assistante Betty est prête à essayer ✨`,
    preheader: `Une assistante IA déjà remplie avec les infos de votre site — essayez-la.`,
    eyebrow: "Votre assistante est prête",
    intro: `J'ai préparé une assistante virtuelle, <strong>Betty</strong>, pour <strong>${enseigne}</strong>${lieu} — déjà remplie avec les informations de <strong>votre propre site</strong>. Elle répond à vos visiteurs 24h/24 et capte leurs coordonnées, sans rien changer à votre site actuel.`,
    included: [
      "Déjà nourrie du contenu de votre site — rien à saisir",
      "Répond à vos client·es 24h/24, même le soir et le week-end",
      "Nom, email et téléphone de chaque prospect envoyés dans votre boîte mail",
      "S'ajoute à votre site en 2 minutes, sans le modifier",
    ],
    tryCta: "Essayer mon assistante →", cfgCta: "L'installer sur mon site →",
    close: "Allez-y, posez-lui vos propres questions : elle connaît déjà votre activité.",
    signoff: "Belle journée,\nBetty — Spectra Media",
  };

  const strip = (s) => s.replace(/<\/?strong>/g, "");
  const textPart = `${strip(T.intro)}\n\n${T.included.map((l) => `✅ ${strip(l)}`).join("\n")}\n\n${T.tryCta} ${tryUrl}\n${T.cfgCta} ${configUrl}\n\n${T.close}\n\n${T.signoff}`.trim();

  const htmlPart = `
<div style="display:none;max-height:0;overflow:hidden;opacity:0">${T.preheader}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1ea;margin:0;padding:24px 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(120,80,90,.10)">
      <tr><td style="background:linear-gradient(135deg,#b76e79,#8f5560);padding:28px 32px;color:#fff">
        <div style="font-size:13px;letter-spacing:.5px;opacity:.9;text-transform:uppercase">${T.eyebrow}</div>
        <div style="font-size:24px;font-weight:700;margin-top:6px">${enseigne}${lieu}</div>
      </td></tr>
      <tr><td style="padding:32px">
        <p style="font-size:16px;color:#3a2f36;line-height:1.6;margin:0 0 16px">${T.intro}</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf5f0;border-radius:12px;margin:4px 0 22px">
          <tr><td style="padding:18px 20px">
            ${T.included.map((l) => `<div style="font-size:14.5px;color:#3a2f36;line-height:1.5;margin:0 0 8px"><span style="color:#3a9958;font-weight:700">✓</span>&nbsp; ${l}</div>`).join("")}
          </td></tr>
        </table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 12px"><tr><td align="center" style="border-radius:999px;background:#b76e79">
          <a href="${tryUrl}" style="display:inline-block;padding:15px 34px;color:#fff;text-decoration:none;font-weight:700;font-size:16px;border-radius:999px">${T.tryCta}</a>
        </td></tr></table>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 8px"><tr><td align="center" style="border-radius:999px;border:2px solid #b76e79">
          <a href="${configUrl}" style="display:inline-block;padding:13px 32px;color:#b76e79;text-decoration:none;font-weight:700;font-size:15px;border-radius:999px">${T.cfgCta}</a>
        </td></tr></table>
        <p style="font-size:15px;color:#8a7d84;line-height:1.6;margin:18px 0 0">${T.close}</p>
      </td></tr>
      <tr><td style="padding:20px 32px;border-top:1px solid #f0e6e0;color:#a2939a;font-size:13px">
        Betty — <a href="https://spectramedia.online" style="color:#b76e79;text-decoration:none">Spectra Media</a>${ville ? " · " + ville : ""}
      </td></tr>
    </table>
  </td></tr>
</table>`.trim();

  return mjSend({ to: email, subject: T.subject, textPart, htmlPart });
}

// RELANCE (follow-up) — un seul email ne vend presque jamais en cold outreach.
// touch 2 (≈J+3) : rappel court ; touch 3 (≈J+7) : dernier rappel + urgence.
// Le vrai levier de conversion. Réutilise mjSend.
export async function sendFollowupEmail(site, touch = 2) {
  const { email, nom_enseigne, slug, plan, ville, betty_public_id, lang: siteLang, metier } = site;
  const lang = (siteLang === "en" || siteLang === "fr")
    ? siteLang : (getMetierById(metier)?.lang === "en" ? "en" : "fr");
  const en = lang === "en";
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const bettyBase = process.env.NEXT_PUBLIC_BETTY_URL || "https://mybetty.online";
  const siteUrl = `https://${slug}.${rootDomain}`;
  const payUrl = `${siteUrl}/pay`;
  const enseigne = nom_enseigne || (en ? "your business" : "votre établissement");
  const withBetty = plan === "site+betty";
  const tryUrl = `${bettyBase}/chat?public_id=${encodeURIComponent(betty_public_id || "")}`;
  const configUrl = `${bettyBase}${en ? "/config_en" : "/config"}`;

  let subject, intro, cta, ctaUrl, ps;
  if (withBetty) {
    // Offre A : le site est déjà en ligne.
    if (touch >= 3) {
      subject = en ? `${enseigne} — last call for your website` : `${enseigne} — dernier rappel pour votre site`;
      intro = en
        ? `Quick heads up: I'll be taking down the website I built for <strong>${enseigne}</strong> soon. If you want to keep it — live, with Betty answering your visitors 24/7 — it's <strong>$59/month</strong>, cancel anytime.`
        : `Petit mot : je vais bientôt retirer le site que j'ai préparé pour <strong>${enseigne}</strong>. Si vous voulez le garder — en ligne, avec Betty qui répond 24h/24 — c'est <strong>59 €/mois</strong>, résiliable à tout moment.`;
    } else {
      subject = en ? `${enseigne} — your website is still live 🌿` : `${enseigne} — votre site est toujours en ligne 🌿`;
      intro = en
        ? `Just following up — the website I built for <strong>${enseigne}</strong> is still live, and Betty is already answering your visitors day and night. Did you get a chance to look?`
        : `Je reviens vers vous — le site que j'ai préparé pour <strong>${enseigne}</strong> est toujours en ligne, et Betty répond déjà à vos visiteurs jour et nuit. Vous avez pu y jeter un œil ?`;
    }
    cta = en ? "Keep my website →" : "Garder mon site →"; ctaUrl = payUrl;
    ps = en ? `See it here: ${siteUrl}` : `Le voir ici : ${siteUrl}`;
  } else {
    // Offre B : Betty seule, déjà prête avec les infos de leur site.
    if (touch >= 3) {
      subject = en ? `${enseigne} — your AI assistant is ready (last reminder)` : `${enseigne} — votre assistante est prête (dernier rappel)`;
    } else {
      subject = en ? `${enseigne} — did you try your Betty assistant?` : `${enseigne} — avez-vous essayé votre assistante Betty ?`;
    }
    intro = en
      ? `Following up: the Betty assistant I prepared for <strong>${enseigne}</strong> is ready — already loaded with your website's info. Try her with your own questions, it takes 30 seconds.`
      : `Je reviens vers vous : l'assistante Betty que j'ai préparée pour <strong>${enseigne}</strong> est prête — déjà remplie avec les infos de votre site. Essayez-la avec vos propres questions, ça prend 30 secondes.`;
    cta = en ? "Try my assistant →" : "Essayer mon assistante →"; ctaUrl = tryUrl;
    ps = en ? `Set it up: ${configUrl}` : `L'installer : ${configUrl}`;
  }

  const strip = (s) => s.replace(/<\/?strong>/g, "");
  const textPart = `${strip(intro)}\n\n${cta} ${ctaUrl}\n${ps}\n\n${en ? "Have a great day,\nBetty — Spectra Media" : "Belle journée,\nBetty — Spectra Media"}`.trim();
  const htmlPart = `
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1ea;margin:0;padding:24px 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(120,80,90,.10)">
    <tr><td style="padding:30px 32px">
      <p style="font-size:16px;color:#3a2f36;line-height:1.6;margin:0 0 20px">${intro}</p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px"><tr><td style="border-radius:999px;background:#b76e79">
        <a href="${ctaUrl}" style="display:inline-block;padding:14px 32px;color:#fff;text-decoration:none;font-weight:700;font-size:16px;border-radius:999px">${cta}</a>
      </td></tr></table>
      <p style="font-size:13px;color:#8a7d84;margin:0">${ps}</p>
    </td></tr>
    <tr><td style="padding:18px 32px;border-top:1px solid #f0e6e0;color:#a2939a;font-size:13px">
      Betty — <a href="https://spectramedia.online" style="color:#b76e79;text-decoration:none">Spectra Media</a>${ville ? " · " + ville : ""}
    </td></tr>
  </table></td></tr>
</table>`.trim();

  return mjSend({ to: email, subject, textPart, htmlPart });
}
