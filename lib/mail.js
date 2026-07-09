// lib/mail.js

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
  } = site;

  const apiKey = process.env.MJ_API_KEY;
  const apiSecret = process.env.MJ_API_SECRET;
  const fromEmail = process.env.MJ_SENDER_EMAIL || "spectramediabots@gmail.com";
  const fromName = process.env.MJ_SENDER_NAME || "Spectra Media";

  if (!apiKey || !apiSecret) {
    console.warn("[MAILJET] Clés MJ_API_KEY ou MJ_API_SECRET manquantes. Mail non envoyé.");
    return;
  }

  if (!email) {
    console.warn("[MAILJET] Email client manquant, impossible d'envoyer.");
    return;
  }

  // URL publique "impeccable" : sous-domaine par client (slug.spectramedia.online)
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const siteUrl = `https://${slug}.${rootDomain}`;
  const withBetty = plan === "site+betty";
  const priceLine = withBetty
    ? "Site vitrine + votre assistante Betty incluse — 59 €/mois, sans engagement"
    : "Site vitrine professionnel — 1 €/mois, sans engagement";

  // Éléments personnalisés (échappés light pour un email)
  const enseigne = nom_enseigne || "votre établissement";
  const lieu = ville ? ` à ${ville}` : "";
  const bettyLine = withBetty
    ? `Et surtout : <strong>Betty</strong>, votre assistante virtuelle, y répond déjà à vos client·es et récupère leurs coordonnées <strong>24h/24</strong> — même le soir et le week-end, quand vous ne pouvez pas décrocher.`
    : `Un site clair, rapide, qui donne confiance dès le premier coup d'œil.`;

  const subject = `${enseigne} : votre site est en ligne 🌿`;

  const textPart = `
Bonjour,

J'ai préparé le site de ${enseigne}${lieu}. Il est déjà en ligne, prêt à l'emploi.

${withBetty
  ? "Betty, votre assistante virtuelle, y répond déjà à vos clientes et récupère leurs coordonnées 24h/24, même quand vous êtes occupée."
  : "Un site clair et professionnel, qui donne confiance dès le premier regard."}

Voir votre site : ${siteUrl}

En moyenne, un site qui répond aux visiteurs au bon moment, c'est de l'ordre de +20% de demandes de rendez-vous captées — celles que l'on perd d'habitude faute de réponse.

${priceLine}.

Si ça vous plaît, on le met à votre nom en 5 minutes.

Belle journée,
Betty — Spectra Media
`.trim();

  const htmlPart = `
<!-- preheader --><div style="display:none;max-height:0;overflow:hidden;opacity:0">Votre site${lieu} est prêt, avec Betty qui capte vos rendez-vous 24h/24.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f1ea;margin:0;padding:24px 0;font-family:'Segoe UI',Helvetica,Arial,sans-serif">
  <tr><td align="center">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 6px 24px rgba(120,80,90,.10)">
      <!-- bandeau -->
      <tr><td style="background:linear-gradient(135deg,#b76e79,#8f5560);padding:28px 32px;color:#fff">
        <div style="font-size:13px;letter-spacing:.5px;opacity:.9;text-transform:uppercase">Votre nouveau site est prêt</div>
        <div style="font-size:24px;font-weight:700;margin-top:6px">${enseigne}${lieu}</div>
      </td></tr>
      <!-- corps -->
      <tr><td style="padding:32px">
        <p style="font-size:16px;color:#3a2f36;line-height:1.6;margin:0 0 16px">Bonjour,</p>
        <p style="font-size:16px;color:#3a2f36;line-height:1.6;margin:0 0 16px">
          J'ai préparé le site de <strong>${enseigne}</strong>${lieu} — il est <strong>déjà en ligne</strong>, prêt à l'emploi. ${bettyLine}
        </p>
        <!-- CTA -->
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto"><tr><td align="center" style="border-radius:999px;background:#b76e79">
          <a href="${siteUrl}" style="display:inline-block;padding:15px 34px;color:#fff;text-decoration:none;font-weight:700;font-size:16px;border-radius:999px">Voir mon site →</a>
        </td></tr></table>
        <!-- preuve -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf5f0;border-radius:12px;margin:8px 0 4px">
          <tr><td style="padding:16px 20px;font-size:15px;color:#5b4a52;line-height:1.55">
            💡 Un site qui répond aux visiteurs au bon moment, c'est en moyenne <strong>+20% de demandes de rendez-vous</strong> captées — précisément celles qu'on perd faute de réponse à temps.
          </td></tr>
        </table>
        <p style="font-size:15px;color:#8a7d84;line-height:1.6;margin:20px 0 4px">
          <strong style="color:#3a2f36">${priceLine}.</strong><br>
          Si ça vous plaît, on le met à votre nom en 5 minutes.
        </p>
      </td></tr>
      <!-- footer -->
      <tr><td style="padding:20px 32px;border-top:1px solid #f0e6e0;color:#a2939a;font-size:13px">
        Betty — <a href="https://spectramedia.online" style="color:#b76e79;text-decoration:none">Spectra Media</a><br>
        ${metier ? metier.charAt(0).toUpperCase() + metier.slice(1) : ""}${ville ? " · " + ville : ""}
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
      return;
    }

    const data = await res.json();
    console.log("[MAILJET] Mail envoyé:", JSON.stringify(data));
  } catch (err) {
    console.error("[MAILJET] Exception:", err);
  }
}
