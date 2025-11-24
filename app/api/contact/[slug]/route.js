import { NextResponse } from "next/server";
import { getSiteBySlug } from "../../../../lib/sites-db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

    // ===== Mailjet direct =====
    const mjKey = process.env.MJ_API_KEY;
    const mjSecret = process.env.MJ_API_SECRET;
    const fromEmail =
      process.env.MJ_SENDER_EMAIL || "spectramediabots@gmail.com";
    const fromName = process.env.MJ_SENDER_NAME || "Spectra Media";

    if (!mjKey || !mjSecret) {
      console.error("[MAILJET] Clés MJ_API_KEY/MJ_API_SECRET manquantes.");
      return NextResponse.json(
        { ok: false, error: "Service email indisponible." },
        { status: 500 }
      );
    }

    const dest = site.email; // email de l’acheteur
    if (!dest) {
      console.error("[CONTACT] Pas d'email client dans le site :", slug, site);
      return NextResponse.json(
        { ok: false, error: "Email destinataire manquant." },
        { status: 500 }
      );
    }

    const auth = Buffer.from(`${mjKey}:${mjSecret}`).toString("base64");

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
            From: { Email: fromEmail, Name: fromName },
            To: [{ Email: dest }],
            Subject: "Nouveau message reçu depuis votre site",
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
        { ok: false, error: "Erreur lors de l'envoi de l'email." },
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
