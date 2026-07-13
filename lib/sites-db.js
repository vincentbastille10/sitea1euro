// lib/sites-db.js — stockage des sites générés dans PostgreSQL (Neon).
// Remplace l'ancien Vercel KV (déprécié/supprimé). Réutilise la base existante
// via DATABASE_URL. Un site = une ligne (slug PK + data JSON).
import pg from "pg";

const { Pool } = pg;

let _pool;
function pool() {
  if (!_pool) {
    // On retire sslmode de l'URL : sinon pg le traite en verify-full et rejette
    // le certificat auto-signé de Supabase, malgré rejectUnauthorized:false.
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
    CREATE TABLE IF NOT EXISTS generated_sites (
      slug        TEXT PRIMARY KEY,
      data        JSONB NOT NULL,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
  _ready = true;
}

export async function createSite(site) {
  await ensureTable();
  await pool().query(
    `INSERT INTO generated_sites (slug, data)
     VALUES ($1, $2)
     ON CONFLICT (slug) DO UPDATE
       SET data = EXCLUDED.data, updated_at = NOW()`,
    [site.slug, JSON.stringify(site)]
  );
  return site;
}

export async function listSites(limit = 5000) {
  await ensureTable();
  const { rows } = await pool().query(
    `SELECT gs.data, gs.updated_at, COALESCE(b.paid, 0) AS bot_paid,
            b.stripe_customer_id, b.stripe_subscription_id
       FROM generated_sites gs
       LEFT JOIN bots b ON b.public_id = gs.data->>'betty_public_id'
      ORDER BY gs.updated_at DESC LIMIT $1`,
    [limit]
  );
  return rows.map((r) => ({
    ...r.data,
    updated_at: r.updated_at,
    ...(Number(r.bot_paid) === 1 ? {
      paid: true,
      status: "active",
      stripe_customer_id: r.stripe_customer_id || r.data?.stripe_customer_id,
      stripe_subscription_id: r.stripe_subscription_id || r.data?.stripe_subscription_id,
    } : {}),
  }));
}

export async function getSiteBySlug(slug) {
  await ensureTable();
  const { rows } = await pool().query(
    `SELECT gs.data, COALESCE(b.paid, 0) AS bot_paid,
            b.stripe_customer_id, b.stripe_subscription_id
       FROM generated_sites gs
       LEFT JOIN bots b ON b.public_id = gs.data->>'betty_public_id'
      WHERE gs.slug = $1 LIMIT 1`,
    [slug]
  );
  if (!rows.length) return null;
  const data = rows[0].data; // JSONB → objet JS
  if (!data?.slug) return null;
  if (Number(rows[0].bot_paid) !== 1) return data;

  // Compatibilité avec les paiements antérieurs au présent garde-fou.
  return {
    ...data,
    paid: true,
    status: "active",
    stripe_customer_id: rows[0].stripe_customer_id || data.stripe_customer_id,
    stripe_subscription_id: rows[0].stripe_subscription_id || data.stripe_subscription_id,
  };
}

export async function markSiteActive(slug, { customerId, subscriptionId } = {}) {
  await ensureTable();
  const activatedAt = new Date().toISOString();
  const patch = {
    status: "active",
    paid: true,
    activated_at: activatedAt,
    ...(customerId ? { stripe_customer_id: customerId } : {}),
    ...(subscriptionId ? { stripe_subscription_id: subscriptionId } : {}),
  };
  const { rowCount } = await pool().query(
    `UPDATE generated_sites
        SET data = data || $2::jsonb, updated_at = NOW()
      WHERE slug = $1`,
    [slug, JSON.stringify(patch)]
  );
  return rowCount === 1;
}

export async function markSiteSuspended(slug) {
  await ensureTable();
  const patch = {
    status: "suspended",
    paid: false,
    suspended_at: new Date().toISOString(),
  };
  const { rowCount } = await pool().query(
    `UPDATE generated_sites
        SET data = data || $2::jsonb, updated_at = NOW()
      WHERE slug = $1`,
    [slug, JSON.stringify(patch)]
  );
  return rowCount === 1;
}
