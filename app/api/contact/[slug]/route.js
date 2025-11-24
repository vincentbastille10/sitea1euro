import { NextResponse } from "next/server";
import { getSiteBySlug } from "../../../../lib/sites-db";

export async function POST(req, { params }) {
  try {
    const slug = params.slug;
    if (!slug) {
      return NextResponse.json(
        { ok: false, error: "Slug manquant." },
        { status: 400 }
      );
    }

    const site = await getSiteBySlug(slug);
    if (!site) {
      console.error("[CONTACT] site introuvable :", slug);
      return NextResponse.json(
        { ok: false, error: "Site introuvable." },
        { status: 404 }
      );
    }

    const formData = await req.formData();

    const name = formData.get("name");
    const email = formData.get("email");
    const message = formData.get("message");

    if (!name || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Champs manquants." },
        { status: 400 }
      );
    }

    // ====== Mailjet ======
    const mjKey = process.env.MJ_API_KEY;
    const mjSecret = process.env.MJ_API_SECRET;

    if (!mjKey || !mjSecret) {
      console.error("[MAILJET] Clés manquantes.");
      return NextResponse.json(
        { ok: false, error: "Service email indisponible." },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${mjKey}:${mjSecret}`).toString("base64");

    const dest = site.email; // <-- l'email de l’acheteur (déjà présent dans ta base)
    if (!dest) {
      console.error("[CONTACT] Pas d'email client dans le site :", slug);
      return NextResponse.json(
        { ok: false, error: "Email destinataire manquant." },
        { status: 500 }
      );
    }

    const html = `
      <h2>Nouveau message reçu depuis votre site</h2>
      <p><strong>Nom :</strong> ${name}</p>
      <p><strong>Email :</strong> ${email}</p>
      <p><strong>Message :</strong><br>${message.replace(/\n/g, "<br>")}</p>
    `;

    const resMail = await fetch("https://api.mailjet.com/v3.1/send", {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email:
                process.env.MJ_SENDER_EMAIL || "spectramediabots@gmail.com",
              Name: process.env.MJ_SENDER_NAME || "Spectra Media",
            },
            To: [{ Email: dest }],
            Subject: `Nouveau message reçu depuis votre site`,
            HTMLPart: html,
            TextPart: `Nom: ${name}\nEmail: ${email}\n\n${message}`,
          },
        ],
      }),
    });

    if (!resMail.ok) {
      const errTxt = await resMail.text();
      console.error("[MAILJET] Erreur HTTP:", resMail.status, errTxt);
      return NextResponse.json(
        { ok: false, error: "Erreur d'envoi email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTACT] Exception:", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur." },
      { status: 500 }
    );
  }
}
