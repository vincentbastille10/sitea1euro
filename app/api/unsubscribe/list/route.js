// app/api/unsubscribe/list/route.js — lecture des désabonnements pour le
// worker Python (scrap_betty_artisan), qui n'a pas d'accès Postgres direct
// (voir lib/unsubscribes-db.js). Protégé par clé partagée (PAS le token HMAC
// public du lien de désabonnement, qui n'autorise qu'UNE adresse) : cette
// route lit TOUTE la liste, donc réservée à un appelant serveur de confiance.
import { NextResponse } from "next/server";
import { listUnsubscribedSince } from "../../../../lib/unsubscribes-db";

function authorized(req) {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  return Boolean(process.env.UNSUB_SYNC_KEY) && key === process.env.UNSUB_SYNC_KEY;
}

export async function GET(req) {
  if (!authorized(req)) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const since = url.searchParams.get("since") || null;
  const rows = await listUnsubscribedSince(since);
  return NextResponse.json({ emails: rows.map((r) => ({ email: r.email, created_at: r.created_at })) });
}
