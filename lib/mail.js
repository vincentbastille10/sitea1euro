// lib/mail.js
// Ici tu peux brancher Mailjet ou un SMTP simple.
// Pour l'instant, on log juste dans la console.

export async function sendSiteEmail(site) {
  const { email, nom_enseigne, slug, plan } = site;

  const siteUrl = `https://sitea1euro.vercel.app/s/${slug}`;

  console.log("Envoi d'un email à", email, "pour le site", siteUrl, "plan:", plan);

  // PSEUDO-CODE MAILJET / SMTP :
  // await mailjet.post("send", { version: "v3.1" }).request({
  //   Messages: [
  //     {
  //       From: { Email: "spectramediabots@gmail.com", Name: "Spectra Media" },
  //       To: [{ Email: email }],
  //       Subject: "Votre site pro est prêt",
  //       HTMLPart: `
  //         <h1>Bienvenue sur votre site pro</h1>
  //         <p>Bonjour,</p>
  //         <p>Votre site est prêt :</p>
  //         <p><a href="${siteUrl}">${siteUrl}</a></p>
  //         <p>Plan choisi : <strong>${plan}</strong></p>
  //       `
  //     }
  //   ]
  // });
}
