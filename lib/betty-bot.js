// lib/betty-bot.js — crée un bot Betty INDIVIDUEL par prospect (pas le bot démo
// partagé). Écrit dans la table `bots` de MyBetty (même base Postgres,
// DATABASE_URL partagée) : mémoire de conversation propre (public_id unique)
// et leads captés routés vers l'email DU PROSPECT (buyer_email).
import { createHash } from "node:crypto";
import pg from "pg";
import { isMalePack } from "./metiers";

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

function greetingFor(label, lang, male) {
  if (lang === "en")
    return `Hi and welcome! I'm Betty, the virtual assistant for your ${label}. How can I help you today?`;
  const role = male ? "l'assistant virtuel" : "l'assistante virtuelle";
  return `Bonjour et bienvenue ! Je suis Betty, ${role} de votre ${label}. Comment puis-je vous aider aujourd'hui ?`;
}

// Crée ou met à jour le bot d'un prospect. Retourne son public_id.
// On NE force PAS l'avatar : avatar_file="" → MyBetty applique l'avatar du pack
// métier (avatar_for_pack) ; le comportement/persona vient déjà du YAML du pack
// au runtime. On remplit profile_json avec les infos du prospect pour que Betty
// connaisse le nom / téléphone / ville de l'établissement.
export async function upsertProspectBot({ email, pack, botKey, name, metierLabel, lang, phone = "", address = "", website = "", trialDays = 14 }) {
  const publicId = genPublicId(email, botKey);
  const now = Math.floor(Date.now() / 1000);
  const trialEnd = now + trialDays * 86400;
  const greeting = greetingFor(metierLabel || name, lang, isMalePack(pack));
  // `raw` = l'URL du site : MyBetty (trigger_initial_crawl) l'y lit pour crawler
  // le site du prospect et pré-remplir la Betty « offre B » (scriptée sans LLM).
  const profileJson = JSON.stringify({
    name,
    ...(phone ? { phone } : {}),
    ...(address ? { address } : {}),
    email,
    ...(website ? { raw: website, website } : {}),
  });
  await pool().query(
    `INSERT INTO bots (
       public_id, bot_key, pack, name, color, avatar_file, greeting,
       buyer_email, owner_name, profile_json, paid, purchase_email_sent,
       stripe_customer_id, stripe_subscription_id, stripe_status,
       created_at, trial_end, blocked, assistant_lang, assistant_name
     ) VALUES ($1,$2,$3,$4,'#b76e79','',$5,$6,$4,$10,0,0,NULL,NULL,'trialing',$7,$8,0,$9,$4)
     ON CONFLICT (public_id) DO UPDATE SET
       pack=EXCLUDED.pack, name=EXCLUDED.name, greeting=EXCLUDED.greeting,
       buyer_email=EXCLUDED.buyer_email, assistant_lang=EXCLUDED.assistant_lang,
       profile_json=EXCLUDED.profile_json, avatar_file=EXCLUDED.avatar_file,
       trial_end=EXCLUDED.trial_end, blocked=0`,
    [publicId, botKey, pack, name, greeting, email, now, trialEnd, lang, profileJson]
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
