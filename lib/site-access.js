// Règles d'accès communes à tout le tunnel.
// Un aperçu est utilisable 7 jours à partir de sa première création. Le simple
// fait de régénérer le même slug ne doit jamais prolonger cette période.
export const PREVIEW_DAYS = 7;
export const PREVIEW_MS = PREVIEW_DAYS * 24 * 60 * 60 * 1000;

export function getPreviewExpiry(site) {
  if (!site) return null;

  const explicit = Date.parse(site.preview_expires_at || "");
  if (Number.isFinite(explicit)) return explicit;

  const created = Date.parse(site.created_at || "");
  return Number.isFinite(created) ? created + PREVIEW_MS : null;
}

export function getSiteState(site, now = Date.now()) {
  if (!site) return { status: "missing", accessible: false, expiresAt: null };

  // `paid` couvre aussi les anciens clients : sites-db le déduit de la table
  // bots si le paiement a précédé l'ajout du statut dans generated_sites.
  if (site.paid === true || site.paid === 1 || site.status === "active") {
    return { status: "active", accessible: true, expiresAt: null };
  }

  if (site.status === "suspended") {
    return { status: "suspended", accessible: false, expiresAt: null };
  }

  const expiresAt = getPreviewExpiry(site);
  if (!expiresAt || now >= expiresAt || site.status === "expired") {
    return { status: "expired", accessible: false, expiresAt };
  }

  return { status: "preview", accessible: true, expiresAt };
}
