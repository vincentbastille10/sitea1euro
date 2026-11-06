// Lien « Débloquer ce lead (5 €) » cliqué depuis l'email : Checkout paiement unique.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getLead, getSiteBySlug } from "../../../lib/sites-db";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" }) : null;

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  const root = process.env.ROOT_DOMAIN || "spectramedia.online";
  const lead = await getLead(params.id);
  if (!lead) return new NextResponse("Lead introuvable.", { status: 404 });
  const siteUrl = `https://${lead.slug}.${root}`;
  if (lead.paid) return new NextResponse("Ce lead est déjà débloqué : consulte ton email.", { status: 200 });
  if (!stripe) return new NextResponse("Paiement indisponible.", { status: 500 });
  const site = await getSiteBySlug(lead.slug);
  const fr = site?.lang !== "en";
  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [{ quantity: 1, price_data: {
        currency: fr ? "eur" : "usd", unit_amount: 500,
        product_data: { name: fr ? "Débloquer 1 lead capté par ta Betty" : "Unlock 1 lead captured by your Betty" },
      } }],
      customer_email: site?.email,
      metadata: { lead_id: lead.id, slug: lead.slug },
      success_url: `${siteUrl}`,
      cancel_url: siteUrl,
    });
    return NextResponse.redirect(session.url, { status: 303 });
  } catch (e) {
    console.error("[LEAD PAY]", e);
    return new NextResponse("Erreur de paiement, réessaie dans un instant.", { status: 502 });
  }
}
