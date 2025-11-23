import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createSite } from "../../../lib/sites-db";
import { generateHeroImageUrl } from "../../../lib/hero-image";
import { sendSiteEmail } from "../../../lib/mail";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: "2024-04-10",
    })
  : null;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req) {
  if (!stripe || !webhookSecret) {
    console.error("[STRIPE WEBHOOK] Clés manquantes");
    return new NextResponse("Config Stripe invalide", { status: 500 });
  }

  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error("[STRIPE WEBHOOK] Signature invalide:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const md = session.metadata || {};
    const email = session.customer_email || md.email;

    const metier = md.metier;
    const nom_enseigne = md.nom_enseigne;
    const ville = md.ville;
    const adresse = md.adresse;
    const telephone = md.telephone;
    const plan = md.plan || "site";
    const betty_on = md.betty_on === "1";

    if (!metier || !nom_enseigne || !ville || !adresse || !telephone || !email) {
      console.error("[STRIPE WEBHOOK] Champs manquants dans metadata:", md);
      return NextResponse.json({ ok: false }, { status: 200 });
    }

    // slug = metier-nom-enseigne normalisé
    const slugBase = `${metier}-${nom_enseigne}`
      .toLowerCase()
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const slug = slugBase || "site";

    try {
      // 1) Génération image de fond via Together
      const heroImageUrl = await generateHeroImageUrl(
        metier,
        nom_enseigne,
        ville
      );

      // 2) Création du site dans KV
      const site = {
        slug,
        metier,
        nom_enseigne,
        ville,
        adresse,
        telephone,
        email,
        plan,
        betty_on,
        hero_image_url: heroImageUrl,
        created_at: new Date().toISOString(),
      };

      await createSite(site);

      // 3) Envoi d'un mail au propriétaire
      await sendSiteEmail(site);

      console.log("[STRIPE WEBHOOK] Site créé pour", email, "slug:", slug);
    } catch (err) {
      console.error("[STRIPE WEBHOOK] Erreur pendant la création du site:", err);
    }
  } else {
    // on ignore les autres events
    console.log("[STRIPE WEBHOOK] Event ignoré:", event.type);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
