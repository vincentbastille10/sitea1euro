// Relance « site + Betty gratuits, 5 € par lead » : 90 emails/heure via Mailgun (cron horaire).
// File = table relance_free (remplie à la main avec les cliqueurs dont site et métier sont alignés).
import { NextResponse } from "next/server";
import pg from "pg";
import { mgSend } from "../../../lib/mailgun.js";
import { unsubscribeUrl } from "../../../lib/unsubscribe-token";
import { isUnsubscribed } from "../../../lib/unsubscribes-db";

export const dynamic = "force-dynamic";
export const maxDuration = 60;
const BATCH = 90;

let _p;
const pool = () => (_p ||= new pg.Pool({
  connectionString: (process.env.DATABASE_URL || "").replace(/[?&]sslmode=[^&]*/i, ""),
  ssl: { rejectUnauthorized: false }, max: 2,
}));

function build(r, root) {
  const en = r.lang === "en";
  const url = `https://${r.slug}.${root}`;
  const price = en ? "$5" : "5 €";
  const co = r.company || (en ? "your business" : "votre activité");
  const subject = en ? `${co}: a free website that collects leads for you`
                     : `${co} : un site gratuit qui collecte des leads pour vous`;
  const lines = en ? [
    `I built a website for <strong>${co}</strong>, with a virtual assistant (Betty) who talks to your visitors day and night, using your own website's information, and collects their name, email and phone number.`,
    `<strong>The website and the assistant are now completely free.</strong> No subscription, no card, nothing to lose.`,
    `You only pay when a lead is collected: <strong>${price} per lead</strong>, to unlock their details. No lead, no cost.`,
  ] : [
    `J'ai préparé un site pour <strong>${co}</strong>, avec un assistant virtuel (Betty) qui discute avec vos visiteurs jour et nuit à partir des infos de votre propre site, et collecte leur nom, leur email et leur téléphone.`,
    `<strong>Le site et l'assistant sont désormais totalement gratuits.</strong> Pas d'abonnement, pas de carte, rien à perdre.`,
    `Vous ne payez que lorsqu'un lead est collecté : <strong>${price} par lead</strong>, pour débloquer ses coordonnées. Pas de lead, pas de frais.`,
  ];
  const cta = en ? "See my free website →" : "Voir mon site gratuit →";
  const unsub = unsubscribeUrl(r.email);
  const unsubTxt = en ? "Unsubscribe" : "Se désabonner";
  const strip = (s) => s.replace(/<\/?strong>/g, "");
  const text = `${lines.map(strip).join("\n\n")}\n\n${cta} ${url}\n\n${unsubTxt}: ${unsub}`;
  const html = `<div style="font-family:Helvetica,Arial,sans-serif;max-width:560px;margin:auto;color:#3a2f36;font-size:16px;line-height:1.6">
${lines.map((l) => `<p>${l}</p>`).join("")}
<p><a href="${url}" style="display:inline-block;padding:14px 28px;background:#b76e79;color:#fff;text-decoration:none;font-weight:700;border-radius:999px">${cta}</a></p>
<p style="font-size:12px;color:#a2939a">Spectra Media · <a href="${unsub}" style="color:#a2939a">${unsubTxt}</a></p></div>`;
  return { subject, text, html, headers: { "List-Unsubscribe": `<${unsub}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } };
}

export async function GET(req) {
  const auth = req.headers.get("authorization") || "";
  const key = new URL(req.url).searchParams.get("key");
  if (!process.env.CRON_SECRET || (auth !== `Bearer ${process.env.CRON_SECRET}` && key !== process.env.CRON_SECRET))
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  if (!process.env.UNSUBSCRIBE_SECRET || !process.env.MAILGUN_API_KEY)
    return NextResponse.json({ ok: false, error: "UNSUBSCRIBE_SECRET ou MAILGUN_API_KEY manquant : aucun envoi" });
  const root = process.env.ROOT_DOMAIN || "spectramedia.online";

  const test = new URL(req.url).searchParams.get("test"); // ?test=adresse : 1 aperçu, sans toucher à la file
  if (test) {
    const { rows } = await pool().query(`SELECT * FROM relance_free LIMIT 1`);
    const m = build({ ...rows[0], email: test }, root);
    const r = await mgSend({ to: test, subject: m.subject, text: m.text, html: m.html, headers: m.headers, fromName: "Betty — Spectra Media" });
    return NextResponse.json({ test: true, ok: r.ok, error: r.error });
  }

  const { rows } = await pool().query(
    `SELECT * FROM relance_free WHERE sent_at IS NULL ORDER BY id LIMIT $1`, [BATCH]);
  let sent = 0, failed = 0, skipped = 0;
  for (const r of rows) {
    if (await isUnsubscribed(r.email)) { skipped++; await pool().query(`UPDATE relance_free SET sent_at=NOW(), note='unsub' WHERE email=$1`, [r.email]); continue; }
    const m = build(r, root);
    const res = await mgSend({ to: r.email, subject: m.subject, text: m.text, html: m.html, headers: m.headers, fromName: "Betty — Spectra Media" });
    if (res.ok) { sent++; await pool().query(`UPDATE relance_free SET sent_at=NOW() WHERE email=$1`, [r.email]); }
    else { failed++; await pool().query(`UPDATE relance_free SET note=$2 WHERE email=$1`, [r.email, String(res.error).slice(0, 200)]); }
  }
  return NextResponse.json({ ok: true, sent, failed, skipped, left: rows.length === BATCH ? "more" : 0 });
}
