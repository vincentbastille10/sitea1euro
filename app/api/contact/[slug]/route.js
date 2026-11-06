import { mgSend } from "../../../../lib/mailgun.js";
import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { getSiteBySlug, createLead } from "../../../../lib/sites-db";
import { getSiteState } from "../../../../lib/site-access";

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

    // La page expirée ne montre plus le formulaire, mais cette vérification
    // serveur empêche aussi un envoi direct vers l'ancienne URL de l'API.
    if (getSiteState(site).status === "suspended") {
      return NextResponse.json(
        { ok: false, error: "Cet aperçu a expiré. Le formulaire est désactivé." },
        { status: 410 }
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
            const fromEmail =
      process.env.MJ_SENDER_EMAIL || "spectramediabots@gmail.com";
    const fromName = process.env.MJ_SENDER_NAME || "Spectra Media";

    const dest = site.email; // email de l’acheteur
    if (!dest) {
      console.error("[CONTACT] Pas d'email client dans le site :", slug, site);
      return NextResponse.json(
        { ok: false, error: "Email destinataire manquant." },
        { status: 500 }
      );
    }

    // Lead masqué : l'email ne contient AUCUNE coordonnée tant que 5 € ne sont pas payés.
    const id = randomUUID();
    await createLead(id, slug, { name, email, message });
    const root = process.env.ROOT_DOMAIN || "spectramedia.online";
    const url = `https://${slug}.${root}/lead/${id}`;
    const fr = site.lang !== "en";
    const price = fr ? "5 €" : "$5";
    const subject = fr ? "Betty a capté un nouveau lead pour vous" : "Betty captured a new lead for you";
    const html = fr
      ? `<h2>Un visiteur de votre site vous a écrit</h2><p>Débloquez ses coordonnées et son message pour ${price} :</p><p><a href="${url}">Débloquer ce lead (${price})</a></p>`
      : `<h2>A visitor of your site wrote to you</h2><p>Unlock their contact details and message for ${price}:</p><p><a href="${url}">Unlock this lead (${price})</a></p>`;
    const resMail = await mgSend({
      to: dest, subject, html,
      text: `${subject}\n${url}`, fromName,
    });

    if (!resMail.ok) {
      console.error("[MAILGUN] Erreur:", resMail.status, resMail.error);
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
