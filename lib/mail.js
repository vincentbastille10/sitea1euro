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

  const baseUrl = getBaseUrl();
  const siteUrl = `${baseUrl}/s/${slug}`;
  const planLabel =
    plan === "site+betty"
      ? "Site + Betty métier (29,99€ + 1€ / mois)"
      : "Site simple 1€ / mois";

  const subject = `Votre site pro est prêt : ${nom_enseigne}`;
  const textPart = `
Bonjour,

Votre site professionnel a bien été généré.

Nom de l'enseigne : ${nom_enseigne}
Métier : ${metier}
Ville : ${ville}
Adresse : ${adresse}
Téléphone : ${telephone}

Plan choisi : ${planLabel}

Vous pouvez le consulter ici :
${siteUrl}

Merci de votre confiance,
Spectra Media
`.trim();

  const htmlPart = `
<h1>Votre site pro est prêt 🎉</h1>
<p>Bonjour,</p>

<p>Votre site a bien été généré :</p>

<ul>
  <li><strong>Nom de l'enseigne :</strong> ${nom_enseigne}</li>
  <li><strong>Métier :</strong> ${metier}</li>
  <li><strong>Ville :</strong> ${ville}</li>
  <li><strong>Adresse :</strong> ${adresse}</li>
  <li><strong>Téléphone :</strong> ${telephone}</li>
  <li><strong>Plan choisi :</strong> ${planLabel}</li>
</ul>

<p>👉 Accédez à votre site ici :<br>
<a href="${siteUrl}">${siteUrl}</a>
</p>

<p>À très bientôt,<br>
<strong>Spectra Media</strong></p>
`.trim();

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
