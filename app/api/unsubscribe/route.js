// app/api/unsubscribe/route.js — désabonnement one-click (RFC 8058).
// GET  : clic humain depuis le corps de l'email -> page de confirmation HTML.
// POST : appelé automatiquement par Gmail/Outlook pour le bouton natif
// "Se désabonner" (déclenché par le header List-Unsubscribe-Post côté
// lib/mail.js) — jamais vu par l'humain, doit répondre vite, sans page.
// Public par nature (aucune auth utilisateur) : c'est le principe même du
// lien one-click. Le token HMAC empêche de désabonner une adresse qu'on ne
// contrôle pas (voir lib/unsubscribe-token.js) sans compromettre l'usage.
import { NextResponse } from "next/server";
import { verifyUnsubscribeToken } from "../../../lib/unsubscribe-token";
import { addUnsubscribe } from "../../../lib/unsubscribes-db";

function confirmationHtml(email) {
  return `<!doctype html><html lang="fr"><head><meta charset="utf-8">
<title>Désabonnement confirmé</title>
<meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="font-family:system-ui,sans-serif;max-width:480px;margin:80px auto;text-align:center;color:#3a2f36">
<p style="font-size:40px;margin:0 0 12px">✅</p>
<h1 style="font-size:20px">Désabonnement confirmé</h1>
<p style="color:#8a7d84">${email ? `${email} ne recevra plus aucun message de notre part.` : "Cette adresse ne recevra plus aucun message de notre part."}</p>
</body></html>`;
}

export async function GET(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "";
  const token = url.searchParams.get("token") || "";
  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: "Lien invalide" }, { status: 400 });
  }
  await addUnsubscribe(email, "link_click");
  return new NextResponse(confirmationHtml(email), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

export async function POST(req) {
  const url = new URL(req.url);
  const email = url.searchParams.get("email") || "";
  const token = url.searchParams.get("token") || "";
  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: "invalid" }, { status: 400 });
  }
  await addUnsubscribe(email, "one_click");
  return NextResponse.json({ ok: true });
}
