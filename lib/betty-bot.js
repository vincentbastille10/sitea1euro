// lib/betty-bot.js — crée un bot Betty INDIVIDUEL par prospect (pas le bot démo
// partagé). Écrit dans la table `bots` de MyBetty (même base Postgres,
// DATABASE_URL partagée) : mémoire de conversation propre (public_id unique)
// et leads captés routés vers l'email DU PROSPECT (buyer_email).
import { createHash } from "node:crypto";
import pg from "pg";

const { Pool } = pg;
let _pool;
function pool() {
  if (!_pool) {
    const cs = (process.env.DATABASE_URL || "").replace(/[?&]sslmode=[^&]*/i, "");
    _pool = new Pool({ connectionString: cs, ssl: { rejectUnauthorized: false }, max: 2 });
  }
  return _pool;
}

function genPublicId(email, botKey) {
  const h = createHash("sha1").update(`${email}|${botKey}`).digest("hex").slice(0, 8);
  return `${botKey}-${h}`;
}

const GREETING = {
  fr: (label) => `Bonjour et bienvenue ! Je suis Betty, l'assistante virtuelle de votre ${label}. Comment puis-je vous aider aujourd'hui ?`,
  en: (label) => `Hi and welcome! I'm Betty, the virtual assistant for your ${label}. How can I help you today?`,
};

// Crée ou met à jour le bot d'un prospect. Retourne son public_id.
export async function upsertProspectBot({ email, pack, botKey, name, metierLabel, lang, trialDays = 14 }) {
  const publicId = genPublicId(email, botKey);
  const now = Math.floor(Date.now() / 1000);
  const trialEnd = now + trialDays * 86400;
  const greeting = (GREETING[lang] || GREETING.fr)(metierLabel || name);
  await pool().query(
    `INSERT INTO bots (
       public_id, bot_key, pack, name, color, avatar_file, greeting,
       buyer_email, owner_name, profile_json, paid, purchase_email_sent,
       stripe_customer_id, stripe_subscription_id, stripe_status,
       created_at, trial_end, blocked, assistant_lang, assistant_name
     ) VALUES ($1,$2,$3,$4,'#b76e79','neutre_femme.webp',$5,$6,$4,'{}',0,0,NULL,NULL,'trialing',$7,$8,0,$9,$4)
     ON CONFLICT (public_id) DO UPDATE SET
       pack=EXCLUDED.pack, name=EXCLUDED.name, greeting=EXCLUDED.greeting,
       buyer_email=EXCLUDED.buyer_email, assistant_lang=EXCLUDED.assistant_lang,
       trial_end=EXCLUDED.trial_end, blocked=0`,
    [publicId, botKey, pack, name, greeting, email, now, trialEnd, lang]
  );
  return publicId;
}

// Appelé par le webhook Stripe une fois le paiement confirmé.
export async function markBotPaid(publicId, { customerId, subscriptionId, status }) {
  await pool().query(
    `UPDATE bots SET paid=1, stripe_customer_id=$2, stripe_subscription_id=$3, stripe_status=$4
     WHERE public_id=$1`,
    [publicId, customerId || null, subscriptionId || null, status || "active"]
  );
}
