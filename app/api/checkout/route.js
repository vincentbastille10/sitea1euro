import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const priceSite = process.env.STRIPE_PRICE_SITE;
const priceSiteBetty = process.env.STRIPE_PRICE_SITE_BETTY;
const baseUrl =
  process.env.SITE_BASE_URL || "https://sitea1euro.vercel.app";

const stripe = stripeSecret
  ? new Stripe(stripeSecret, {
      apiVersion: "2024-04-10",
    })
  : null;

export async function POST(req) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe non configuré" },
      { status: 500 }
    );
  }

  const b = await req.json();
  const {
    metier,
    nom_enseigne,
    ville,
    adresse,
    telephone,
    email,
    plan,
  } = b || {};

  if (!metier || !nom_enseigne || !ville || !adresse || !telephone || !email) {
    return NextResponse.json(
      { error: "Champs manquants" },
      { status: 400 }
    );
  }

  const chosenPlan = plan || "site";
  const priceId = chosenPlan === "site+betty" ? priceSiteBetty : priceSite;
  if (!priceId) {
    return NextResponse.json(
      { error: "Prix Stripe manquant pour ce plan" },
      { status: 500 }
    );
  }

  // Betty activée automatiquement si le plan est "site+betty"
  const betty_on = chosenPlan === "site+betty";

  const metadata = {
    metier,
    nom_enseigne,
    ville,
    adresse,
    telephone,
    email,
    plan: chosenPlan,
    betty_on: betty_on ? "1" : "0",
  };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      customer_email: email,
      metadata,
      success_url: `${baseUrl}/merci?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/builder?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("[STRIPE CHECKOUT] Erreur:", err);
    return NextResponse.json(
      { error: "Impossible de créer la session de paiement." },
      { status: 500 }
    );
  }
}
