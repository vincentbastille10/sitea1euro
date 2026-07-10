// app/sitemap.js — sitemap dynamique (convention Next.js App Router, servi sur
// /sitemap.xml). Le wildcard *.spectramedia.online pointe sur cette même app,
// donc ce sitemap répond de façon identique sur n'importe quel sous-domaine —
// suffisant pour une "Domain property" Google Search Console (couvre tous les
// sous-domaines dès qu'elle est vérifiée une fois sur spectramedia.online).
import { listSites } from "../lib/sites-db";

// Dynamique (pas figé au build) : chaque nouveau site généré doit apparaître
// sans attendre un redéploiement.
export const dynamic = "force-dynamic";

export default async function sitemap() {
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  let sites = [];
  try {
    sites = await listSites();
  } catch (e) {
    console.error("[SITEMAP] listSites a échoué:", e);
  }
  return sites
    .filter((s) => s.slug)
    .map((s) => ({
      url: `https://${s.slug}.${rootDomain}/`,
      lastModified: s.updated_at || s.created_at || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
}
