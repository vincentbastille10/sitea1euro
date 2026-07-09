// lib/sites-db.js — stockage des sites générés dans PostgreSQL (Neon).
// Remplace l'ancien Vercel KV (déprécié/supprimé). Réutilise la base existante
// via DATABASE_URL. Un site = une ligne (slug PK + data JSON).
import pg from "pg";

const { Pool } = pg;

let _pool;
function pool() {
  if (!_pool) {
    const cs = process.env.DATABASE_URL || "";
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

export async function getSiteBySlug(slug) {
  await ensureTable();
  const { rows } = await pool().query(
    `SELECT data FROM generated_sites WHERE slug = $1 LIMIT 1`,
    [slug]
  );
  if (!rows.length) return null;
  const data = rows[0].data; // JSONB → objet JS
  return data && data.slug ? data : null;
}
