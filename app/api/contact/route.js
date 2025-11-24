// app/api/contact/route.js
import { NextResponse } from "next/server";
import { getSiteBySlug } from "@/lib/sites-db";
import { sendMail } from "@/lib/mail";

export async function POST(req) {
  try {
    const { slug, nom, email, message } = await req.json();

    if (!slug || !nom || !email || !message) {
      return NextResponse.json(
        { ok: false, error: "Champs manquants" },
        { status: 400 }
      );
    }

    const site = await getSiteBySlug(slug);

    if (!site) {
      console.error("[CONTACT] Site introuvable pour le slug", slug);
      return NextResponse.json(
        { ok: false, error: "Site introuvable" },
        { status: 404 }
      );
    }

    // Le champ peut s'appeler comme tu veux : adapte (email, ownerEmail, contact_email…)
    const destinataire = site.email || site.ownerEmail || site.contact_email;

    if (!destinataire) {
      console.error("[CONTACT] Pas d'email pour le site", slug, site);
      return NextResponse.json(
        { ok: false, error: "Pas d'email de contact défini" },
        { status: 500 }
      );
    }

    await sendMail({
      to: destinataire,
      subject: `Nouveau message depuis votre site ${site.nom_enseigne || ""}`,
      text: `Nom : ${nom}
Email : ${email}

Message :
${message}`,
      html: `
        <p><strong>Nom :</strong> ${nom}</p>
        <p><strong>Email :</strong> ${email}</p>
        <p><strong>Message :</strong><br>${message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[CONTACT] ERREUR", err);
    return NextResponse.json(
      { ok: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
