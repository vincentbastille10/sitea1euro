// lib/indexnow.js — pousse une URL fraîchement payée vers l'indexation
// (protocole IndexNow : Bing + Yandex l'indexent en quelques minutes/heures).
// ⚠️ Google ne supporte PAS IndexNow ; son Indexing API publique est réservée
// aux offres d'emploi/streams, pas aux sites vitrine. Pour pousser vers Google
// spécifiquement, voir la note dans stripe-webhook/route.js (Search Console,
// setup ponctuel côté Vincent).
const INDEXNOW_KEY = "fb3b05deddfd4f0ab84367fa379014d9";

export async function pingIndexNow(url) {
  try {
    const host = new URL(url).host;
    await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`,
        urlList: [url],
      }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (e) {
    console.warn("[INDEXNOW] ping échoué (non bloquant):", e.message);
  }
}
