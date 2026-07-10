import { NextResponse } from "next/server";
import Stripe from "stripe";
import { markBotPaid } from "../../../lib/betty-bot";
import { pingIndexNow } from "../../../lib/indexnow";

// Note indexation Google : contrairement à une idée répandue, Google n'a PAS
// d'API publique pour "pousser" une page business dans son index (son
// Indexing API officielle est réservée aux offres d'emploi / live streams).
// Le levier gratuit réel côté Google : vérifier spectramedia.online comme
// "Domain property" dans Search Console (1 enregistrement DNS TXT, one-shot,
// couvre TOUS les sous-domaines pour toujours) + le sitemap.xml (déjà généré,
// voir app/sitemap.js) que Google recrawle régulièrement une fois la propriété
// vérifiée. Ci-dessous : IndexNow (Bing + Yandex), qui lui a une vraie API de
// push gratuite et fonctionne dès maintenant, sans étape manuelle.

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: "2024-04-10" }) : null;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// Le site (démo) existe déjà AVANT paiement (créé par /api/generate-site).
// Ce webhook ne fait qu'ACTIVER le bot Betty du prospect (paid=1) une fois
// l'abonnement Stripe confirmé — il ne recrée rien.
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

    if (md.betty_public_id) {
      try {
        await markBotPaid(md.betty_public_id, {
          customerId: session.customer,
          subscriptionId: session.subscription,
          status: "active",
        });
        console.log("[STRIPE WEBHOOK] Bot activé:", md.betty_public_id, "slug:", md.slug);

        // Site désormais payé/officiel : on pousse son indexation (Bing/Yandex).
        if (md.slug) {
          const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
          pingIndexNow(`https://${md.slug}.${rootDomain}/`);
        }
      } catch (e) {
        console.error("[STRIPE WEBHOOK] Échec activation du bot:", e);
      }
    } else {
      console.warn("[STRIPE WEBHOOK] Pas de betty_public_id dans les metadata:", md);
    }
  } else {
    console.log("[STRIPE WEBHOOK] Event ignoré:", event.type);
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
