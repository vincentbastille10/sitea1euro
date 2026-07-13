import { NextResponse } from "next/server";
import Stripe from "stripe";
import { markBotPaid, markBotUnpaid } from "../../../lib/betty-bot";
import { markSiteActive, markSiteSuspended } from "../../../lib/sites-db";
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

// Le site (aperçu) existe déjà AVANT paiement. Le webhook réactive exactement
// le même site et son MyBetty : aucune reconstruction, aucune perte de données.
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

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const md = session.metadata || {};
      if (!md.slug) throw new Error("slug absent des metadata Checkout");

      const siteActivated = await markSiteActive(md.slug, {
        customerId: session.customer,
        subscriptionId: session.subscription,
      });
      if (!siteActivated) throw new Error(`site introuvable: ${md.slug}`);

      if (md.betty_public_id) {
        await markBotPaid(md.betty_public_id, {
          customerId: session.customer,
          subscriptionId: session.subscription,
          status: "trialing",
        });
      }

      console.log("[STRIPE WEBHOOK] Site et bot activés, slug:", md.slug);
      const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
      pingIndexNow(`https://${md.slug}.${rootDomain}/`);
    } else if (event.type === "customer.subscription.updated"
      || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object;
      const md = subscription.metadata || {};
      const inactive = event.type === "customer.subscription.deleted"
        || ["canceled", "unpaid", "incomplete_expired"].includes(subscription.status);

      if (!md.slug) {
        console.warn("[STRIPE WEBHOOK] Abonnement sans slug, ignoré:", subscription.id);
      } else if (inactive) {
        await markSiteSuspended(md.slug);
        if (md.betty_public_id) await markBotUnpaid(md.betty_public_id, subscription.status || "canceled");
        console.log("[STRIPE WEBHOOK] Site suspendu, slug:", md.slug);
      } else if (["active", "trialing", "past_due"].includes(subscription.status)) {
        await markSiteActive(md.slug, {
          customerId: subscription.customer,
          subscriptionId: subscription.id,
        });
        if (md.betty_public_id) {
          await markBotPaid(md.betty_public_id, {
            customerId: subscription.customer,
            subscriptionId: subscription.id,
            status: subscription.status,
          });
        }
      }
    } else {
      console.log("[STRIPE WEBHOOK] Event ignoré:", event.type);
    }
  } catch (e) {
    // Un 500 demande à Stripe de retenter l'évènement : on ne perd pas une
    // activation si la base a eu une panne passagère.
    console.error("[STRIPE WEBHOOK] Traitement échoué:", e);
    return new NextResponse("Traitement du webhook échoué", { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}
