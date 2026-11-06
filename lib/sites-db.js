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

// ── Leads facturés à l'unité (5 €) : le contenu reste masqué tant que non payé.
let _leadsReady = false;
async function ensureLeads() {
  if (_leadsReady) return;
  await pool().query(`
    CREATE TABLE IF NOT EXISTS site_leads (
      id         TEXT PRIMARY KEY,
      slug       TEXT NOT NULL,
      data       JSONB NOT NULL,
      paid       BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`);
  _leadsReady = true;
}
export async function createLead(id, slug, data) {
  await ensureLeads();
  await pool().query(`INSERT INTO site_leads (id, slug, data) VALUES ($1,$2,$3)`, [id, slug, JSON.stringify(data)]);
}
export async function getLead(id) {
  await ensureLeads();
  const { rows } = await pool().query(`SELECT id, slug, data, paid FROM site_leads WHERE id=$1`, [id]);
  return rows[0] || null;
}
// Retourne la ligne seulement au 1er passage à payé (idempotent face aux retries Stripe).
export async function markLeadPaid(id) {
  await ensureLeads();
  const { rows } = await pool().query(
    `UPDATE site_leads SET paid=TRUE WHERE id=$1 AND paid=FALSE RETURNING id, slug, data`, [id]);
  return rows[0] || null;
}

// Fabrique/complète le site ET sa Betty AVANT l'envoi d'un mail : scrape du site d'origine (une fois),
// vrai nom, accueil, et contenu chargé dans la mémoire RAG de Betty (donc aucune lenteur au 1er message).
export async function enrichSite(slug) {
  const { scrapeSite } = await import("./scrape-site.js");
  const { betterName } = await import("./display-name.js");
  const site = await getSiteBySlug(slug);
  if (!site || (site.scrape_v >= 5) || !/^https?:\/\//i.test(site.site_url || "")) return site;
  let scrape = null;
  try { scrape = await scrapeSite(site.site_url); } catch (e) { console.warn("[ENRICH]", slug, e.message); }
  let nom = site.nom_enseigne;
  try { nom = await betterName(site, 9000); } catch {}
  // Photos des services : jamais de doublon ; les cartes sans image reçoivent une photo Pexels distincte (1 appel/site).
  if (scrape?.services?.length) {
    const key = (u) => (u || "").split("?")[0].replace(/-\d+x\d+(?=\.\w+$)/, "");
    const used = new Set([key(site.hero_image_url)].filter(Boolean));
    for (const sv of scrape.services) {
      if (sv.image && !used.has(key(sv.image))) used.add(key(sv.image)); else sv.image = "";
    }
    if (scrape.services.some((x) => !x.image)) {
      const { fetchPexelsPhotos } = await import("./hero-image.js");
      const pool = await fetchPexelsPhotos(site.metier_label || site.metier || "business", 30);
      const free = pool.filter((u) => !used.has(key(u)));
      for (const sv of scrape.services) if (!sv.image && free.length) sv.image = free.shift();
    }
  }
  const patch = { scraped_at: new Date().toISOString(), scrape_v: 5, nom_enseigne: nom, ...(scrape ? { scrape } : {}) };
  await ensureTable();
  await pool().query(`UPDATE generated_sites SET data = data || $2::jsonb, updated_at = NOW() WHERE slug = $1`,
    [slug, JSON.stringify(patch)]);

  const id = site.betty_public_id;
  if (id) {
    try {
      const en = site.lang === "en";
      const greeting = en
        ? `Hi and welcome to ${nom}! I'm Betty, the virtual assistant. How can I help you today?`
        : `Bonjour et bienvenue chez ${nom} ! Je suis Betty, l'assistante virtuelle. Comment puis-je vous aider ?`;
      await pool().query(`UPDATE bots SET name=$2, owner_name=$2, assistant_name=$2, greeting=$3 WHERE public_id=$1`, [id, nom, greeting]);
      await pool().query(`UPDATE bots SET profile_json = (profile_json::jsonb || jsonb_build_object('name', $2::text))::text WHERE public_id=$1`, [id, nom]).catch(() => {});
      if (scrape) {
        const docs = [];
        if (scrape.tagline) docs.push([site.site_url, nom, scrape.tagline]);
        if (scrape.about) docs.push([site.site_url + "#about", en ? "About" : "À propos", scrape.about]);
        // Mémoire complète : tout le texte des pages visitées, découpé en passages de ~700 car.
        for (const pg of scrape.pages || []) {
          const sents = pg.text.match(/[^.!?]+[.!?]+\s*/g) || [pg.text];
          let buf = "", n = 0;
          for (const x of sents) { buf += x; if (buf.length > 650) { docs.push([pg.url + "#c" + n++, pg.title || nom, buf.trim()]); buf = ""; } }
          if (buf.trim().length > 40) docs.push([pg.url + "#c" + n, pg.title || nom, buf.trim()]);
        }
        for (const sv of scrape.services || []) {
          const o = typeof sv === "string" ? { title: sv, text: "" } : sv;
          if (o.title) docs.push([site.site_url + "#" + encodeURIComponent(o.title), o.title, `${o.title}. ${o.text || ""}`]);
        }
        await pool().query(`CREATE TABLE IF NOT EXISTS robot_sites (robot_id TEXT PRIMARY KEY, site_url TEXT, status TEXT DEFAULT 'pending', last_crawled_at TIMESTAMPTZ, last_error TEXT)`);
        await pool().query(`CREATE TABLE IF NOT EXISTS robot_site_pages (id BIGSERIAL PRIMARY KEY, robot_id TEXT NOT NULL REFERENCES robot_sites(robot_id) ON DELETE CASCADE, url TEXT NOT NULL, title TEXT, text_content TEXT, links_json JSONB, updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(), tsv tsvector)`);
        await pool().query(`INSERT INTO robot_sites(robot_id, site_url, status, last_crawled_at) VALUES ($1,$2,'ok',NOW()) ON CONFLICT (robot_id) DO UPDATE SET status='ok', site_url=$2, last_crawled_at=NOW()`, [id, site.site_url]);
        await pool().query(`DELETE FROM robot_site_pages WHERE robot_id=$1`, [id]);
        for (const [url, title, text] of docs)
          await pool().query(`INSERT INTO robot_site_pages(robot_id,url,title,text_content,tsv) VALUES ($1,$2,$3,$4,to_tsvector('simple', $3 || ' ' || $4)) ON CONFLICT DO NOTHING`, [id, url, title, text]);
      }
    } catch (e) { console.warn("[ENRICH BETTY]", slug, e.message); }
  }
  return { ...site, ...patch };
}
