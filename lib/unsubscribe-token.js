// lib/unsubscribe-token.js — token stateless (HMAC) pour le lien de
// désabonnement : pas de lookup DB pour valider un clic, pas falsifiable sans
// UNSUBSCRIBE_SECRET. Même calcul répliqué en Python (hmac/hashlib stdlib)
// dans scrap_betty_artisan/relance_engaged.py pour signer ses propres liens.
import crypto from "node:crypto";

function normalize(email) {
  return (email || "").trim().toLowerCase();
}

export function unsubscribeToken(email) {
  const secret = process.env.UNSUBSCRIBE_SECRET || "";
  return crypto
    .createHmac("sha256", secret)
    .update(normalize(email))
    .digest("hex")
    .slice(0, 32);
}

export function verifyUnsubscribeToken(email, token) {
  const secret = process.env.UNSUBSCRIBE_SECRET || "";
  if (!secret || !email || !token) return false;
  const expected = unsubscribeToken(email);
  const a = Buffer.from(expected);
  const b = Buffer.from(String(token));
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export function unsubscribeUrl(email) {
  const base = process.env.UNSUBSCRIBE_BASE_URL || process.env.SITE_BASE_URL || "https://sitea1euro.vercel.app";
  const token = unsubscribeToken(email);
  return `${base}/api/unsubscribe?email=${encodeURIComponent(normalize(email))}&token=${token}`;
}
