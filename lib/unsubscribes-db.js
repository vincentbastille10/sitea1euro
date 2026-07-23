// lib/unsubscribes-db.js — liste de suppression email (Neon/Postgres), même
// base que lib/sites-db.js (DATABASE_URL). Alimentée par app/api/unsubscribe
// (clic du destinataire, un-click RFC 8058) — consultée avant TOUT envoi
// (lib/mail.js) et exposée en lecture au worker Python scrap_betty_artisan
// (app/api/unsubscribe/list) qui n'a pas d'accès Postgres direct.
import pg from "pg";

const { Pool } = pg;

let _pool;
function pool() {
  if (!_pool) {
    const cs = (process.env.DATABASE_URL || "").replace(/[?&]sslmode=[^&]*/i, "");
    _pool = new Pool({
      connectionString: cs,
      ssl: cs.includes("localhost") || cs.includes("127.0.0.1")
        ? false
        : { rejectUnauthorized: false },
      max: 2,
      idleTimeoutMillis: 10000,
    });
  }
  return _pool;
}

let _ready = false;
async function ensureTable() {
  if (_ready) return;
  await pool().query(`
    CREATE TABLE IF NOT EXISTS unsubscribed_emails (
      email       TEXT PRIMARY KEY,
      reason      TEXT NOT NULL DEFAULT 'link_click',
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  _ready = true;
}

function normalize(email) {
  return (email || "").trim().toLowerCase();
}

export async function addUnsubscribe(email, reason = "link_click") {
  const e = normalize(email);
  if (!e) return;
  await ensureTable();
  await pool().query(
    `INSERT INTO unsubscribed_emails (email, reason) VALUES ($1, $2)
     ON CONFLICT (email) DO NOTHING`,
    [e, reason],
  );
}

export async function isUnsubscribed(email) {
  const e = normalize(email);
  if (!e) return false;
  await ensureTable();
  const { rows } = await pool().query(
    "SELECT 1 FROM unsubscribed_emails WHERE email = $1 LIMIT 1",
    [e],
  );
  return rows.length > 0;
}

// Consommé par scrap_betty_artisan (worker local, pas d'accès Postgres direct)
// via app/api/unsubscribe/list — synchronise vers son propre banned_emails
// SQLite (campaign_db.ban_email) pour que is_banned() reflète aussi les
// désabonnements côté Vercel.
export async function listUnsubscribedSince(sinceIso) {
  await ensureTable();
  const { rows } = sinceIso
    ? await pool().query(
        "SELECT email, created_at FROM unsubscribed_emails WHERE created_at > $1 ORDER BY created_at ASC",
        [sinceIso],
      )
    : await pool().query(
        "SELECT email, created_at FROM unsubscribed_emails ORDER BY created_at ASC",
      );
  return rows;
}
