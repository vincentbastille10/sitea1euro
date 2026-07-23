// app/api/relance/route.js — RELANCE automatique (le levier de conversion n°1).
// Chaque jour (cron Vercel) : relance les prospects non-acheteurs (touch 2 puis 3),
// en excluant ceux qui ont déjà payé (Stripe). Un cold email seul ne vend presque
// jamais ; 2-3 relances multiplient les ventes.
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { listSites, createSite } from "../../../lib/sites-db";
import { sendFollowupEmail } from "../../../lib/mail";
import { blockUnpaidBot } from "../../../lib/betty-bot";
import { getSiteState } from "../../../lib/site-access";
import { isUnsubscribed } from "../../../lib/unsubscribes-db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-04-10" }) : null;
const DAY = 86400000;

async function paidEmails() {
  const set = new Set();
  if (!stripe) return set;
  try {
    let starting_after;
    for (let i = 0; i < 5; i++) {
      const r = await stripe.subscriptions.list({
        status: "all", limit: 100, expand: ["data.customer"],
        ...(starting_after ? { starting_after } : {}),
      });
      for (const s of r.data) {
        if (["active", "trialing", "past_due"].includes(s.status) && s.customer?.email)
          set.add(s.customer.email.toLowerCase());
      }
      if (!r.has_more) break;
      starting_after = r.data[r.data.length - 1].id;
    }
  } catch (e) { console.error("[RELANCE] stripe:", e); }
  return set;
}

function authorized(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const auth = req.headers.get("authorization") || "";
  if (process.env.CRON_SECRET && auth === `Bearer ${process.env.CRON_SECRET}`) return true;
  if (process.env.RELANCE_KEY && key === process.env.RELANCE_KEY) return true;
  return !process.env.CRON_SECRET && !process.env.RELANCE_KEY; // ouvert si rien configuré
}

export async function GET(req) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const now = Date.now();
  const url = new URL(req.url);
  const limit = parseInt(url.searchParams.get("limit") || "80", 10);

  const [sites, paid] = await Promise.all([listSites(5000), paidEmails()]);
  let sent = 0, skippedPaid = 0, failed = 0;
  for (const s of sites) {
    const access = getSiteState(s, now);
    if (access.status === "expired") {
      // Double verrouillage : le site et le formulaire sont déjà coupés côté
      // Next.js ; le cron bloque aussi l'accès direct à l'ancien chat MyBetty.
      try { await blockUnpaidBot(s.betty_public_id); }
      catch (e) { console.error("[RELANCE] blocage Betty:", e); }
      continue;
    }
    if (access.status === "active" || access.status === "suspended") continue;
    if (sent >= limit) continue;
    if (!s.email || !s.betty_on || String(s.email).includes("example.com")) continue;
    const created = Date.parse(s.created_at || 0) || 0;
    const ageDays = (now - created) / DAY;
    if (ageDays < 3 || ageDays > 30) continue;            // fenêtre : J+3 à J+30
    const touches = s.touches || 1;
    if (touches >= 3) continue;                            // max 3 contacts
    const lastTouch = Date.parse(s.last_touch || s.created_at || 0) || created;
    if ((now - lastTouch) / DAY < 3) continue;             // ≥ 3 j depuis le dernier
    if (paid.has(String(s.email).toLowerCase())) { skippedPaid++; continue; }
    if (await isUnsubscribed(s.email)) continue;

    const res = await sendFollowupEmail(s, touches + 1);
    if (res?.ok) {
      sent++;
      await createSite({ ...s, touches: touches + 1, last_touch: new Date().toISOString() });
    } else { failed++; }
  }
  return NextResponse.json({ ok: true, sent, skipped_paid: skippedPaid, failed });
}
