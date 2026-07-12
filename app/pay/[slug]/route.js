// app/pay/[slug]/route.js — lien "Payez votre site, ici" cliqué depuis l'email.
// Crée une session Stripe FRAÎCHE à chaque clic (jamais expirée, contrairement
// à un lien de session pré-généré au moment de l'envoi de l'email) puis
// redirige vers Stripe Checkout.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getSiteBySlug } from "../../../lib/sites-db";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-04-10" }) : null;

export async function GET(req, { params }) {
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const siteUrl = `https://${params.slug}.${rootDomain}`;

  const site = await getSiteBySlug(params.slug);
  if (!site) return NextResponse.redirect(siteUrl);
  if (!stripe) return new NextResponse("Paiement indisponible (Stripe non configuré).", { status: 500 });

  // Prix construit À LA VOLÉE (price_data) plutôt qu'un Price Stripe figé :
  // libellé propre, aucun logo, et devise selon la langue de la cible.
  //   • email français   → 59 €/mois
  //   • email US/UK (en) → 59 $/mois
  const isBetty = site.plan === "site+betty";
  const fr = site.lang !== "en"; // défaut FR ; en = US/UK
  const currency = fr ? "eur" : "usd";
  const unit_amount = isBetty ? 5900 : 100; // 59.00 (site+Betty) ; 1.00 (site seul)
  const productName = isBetty
    ? (fr ? "1 site sur mesure + un MyBetty" : "1 custom website + one MyBetty")
    : (fr ? "1 site sur mesure" : "1 custom website");

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{
        quantity: 1,
        price_data: {
          currency,
          unit_amount,
          recurring: { interval: "month" },
          // product_data SANS `images` → aucun logo sur le checkout
          product_data: { name: productName },
        },
      }],
      customer_email: site.email,
      // Essai gratuit 7 jours : lève la barrière du 1er paiement (conversion
      // cold ×2-3). 0€ maintenant, 59€ après 7 jours.
      subscription_data: { trial_period_days: 7 },
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
