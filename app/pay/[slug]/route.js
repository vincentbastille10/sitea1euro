// app/pay/[slug]/route.js — lien "Payez votre site, ici" cliqué depuis l'email.
// Crée une session Stripe FRAÎCHE à chaque clic (jamais expirée, contrairement
// à un lien de session pré-généré au moment de l'envoi de l'email) puis
// redirige vers Stripe Checkout.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteBySlug } from "../../../lib/sites-db";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceSite = process.env.STRIPE_PRICE_SITE;
const priceSiteBetty = process.env.STRIPE_PRICE_SITE_BETTY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-04-10" }) : null;

export async function GET(req, { params }) {
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const siteUrl = `https://${params.slug}.${rootDomain}`;

  const site = await getSiteBySlug(params.slug);
  if (!site) return NextResponse.redirect(siteUrl);
  if (!stripe) return new NextResponse("Paiement indisponible (Stripe non configuré).", { status: 500 });

  const priceId = site.plan === "site+betty" ? priceSiteBetty : priceSite;
  if (!priceId) return new NextResponse("Paiement indisponible (prix non configuré).", { status: 500 });

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: site.email,
      metadata: {
        slug: site.slug,
        betty_public_id: site.betty_public_id || "",
        plan: site.plan || "site",
      },
      success_url: `${siteUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: siteUrl,
    });
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (e) {
    console.error("[PAY] création session Stripe échouée:", e);
    return new NextResponse("Erreur de paiement, réessaie dans un instant.", { status: 502 });
  }
}
