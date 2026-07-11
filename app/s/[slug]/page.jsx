import { cache } from "react";
import { notFound } from "next/navigation";
import { getSiteBySlug } from "../../../lib/sites-db";
import { getMetierById } from "../../../lib/metiers";

// React cache() : une seule requête DB par rendu, partagée entre
// generateMetadata() et le composant de page.
const getSite = cache(getSiteBySlug);

function siteLang(site, metier) {
  return (site.lang === "en" || site.lang === "fr")
    ? site.lang
    : (metier?.lang === "en" ? "en" : "fr");
}

// Type schema.org le plus précis disponible par métier (rich snippets Google) ;
// LocalBusiness générique par défaut pour ne jamais surclamer un type spécialisé.
const SCHEMA_TYPE = {
  realtor: "RealEstateAgent", immobilier: "RealEstateAgent",
  estheticienne: "BeautySalon", coiffeuse: "HairSalon",
  plombier: "Plumber", artisan: "GeneralContractor",
};

export async function generateMetadata({ params }) {
  const site = await getSite(params.slug);
  if (!site) return { title: "Page introuvable", robots: { index: false, follow: false } };

  const metier = getMetierById(site.metier);
  const lang = siteLang(site, metier);
  const inWord = lang === "en" ? "in" : "à";
  const title = `${site.nom_enseigne} – ${metier?.label || site.metier} ${inWord} ${site.ville}`;
  const description = (
    metier?.pitch ||
    (lang === "en" ? "Professional service, by appointment." : "Accompagnement professionnel, sur rendez-vous.")
  ).slice(0, 160);
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const url = `https://${site.slug}.${rootDomain}/`;

  return {
    title,
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: {
      title,
      description,
      url,
      siteName: site.nom_enseigne,
      images: site.hero_image_url ? [{ url: site.hero_image_url, width: 1600, height: 896 }] : [],
      locale: lang === "en" ? "en_US" : "fr_FR",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: site.hero_image_url ? [site.hero_image_url] : [],
    },
  };
}

export default async function Site({ params }) {
  const site = await getSite(params.slug);
  if (!site) notFound(); // vrai statut 404 + page not-found.js soignée

  const metier = getMetierById(site.metier);
  const lang = siteLang(site, metier);
  const t = lang === "en"
    ? { in: "in", contact: "Contact", address: "Address", phone: "Phone", email: "Email",
        writeUs: "Send us a message", yourName: "Your name", yourEmail: "Your email",
        yourMessage: "Your message", send: "Send", poweredBy: "Powered by Spectra Media",
        defaultPitch: "Professional service, by appointment, with a personal touch.",
        bettyActivating: "Your Betty assistant is being activated." }
    : { in: "à", contact: "Coordonnées", address: "Adresse", phone: "Téléphone", email: "Email",
        writeUs: "Écrire un message", yourName: "Votre nom", yourEmail: "Votre email",
        yourMessage: "Votre message", send: "Envoyer", poweredBy: "Propulsé par Spectra Media",
        defaultPitch: "Accompagnement professionnel, sur rendez-vous, avec une approche personnalisée.",
        bettyActivating: "Assistant Betty en cours d’activation pour ce métier." };

  const title = `${site.nom_enseigne} – ${metier?.label || site.metier} ${t.in} ${site.ville}`;
  const bg = site.hero_image_url || "";

  // Site « sur mesure » : on reprend la couleur de marque du prospect pour les
  // accents (barre haute, bouton, cadre Betty). Défaut = rose Spectra si inconnue.
  const accent = /^#[0-9a-fA-F]{6}$/.test(site.brand_color || "") ? site.brand_color : "#b76e79";
  const _l = [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16));
  const accentText = 0.299 * _l[0] + 0.587 * _l[1] + 0.114 * _l[2] > 150 ? "#1a1420" : "#ffffff";

  // public_id du bot Betty à embarquer : celui du site, sinon celui du métier.
  const bettyId = site.betty_public_id || metier?.betty_public_id || "";
  const bettyBase = process.env.NEXT_PUBLIC_BETTY_URL || "https://mybetty.online";

  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[site.metier] || "LocalBusiness",
    name: site.nom_enseigne,
    ...(site.hero_image_url ? { image: site.hero_image_url } : {}),
    url: `https://${site.slug}.${rootDomain}/`,
    ...(site.telephone ? { telephone: site.telephone } : {}),
    ...(site.email ? { email: site.email } : {}),
    address: { "@type": "PostalAddress", ...(site.adresse ? { streetAddress: site.adresse } : {}), addressLocality: site.ville },
    areaServed: site.ville,
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: bg ? `url(${bg})` : "linear-gradient(135deg,#111,#333)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        borderTop: `6px solid ${accent}`, // barre de marque du prospect
      }}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, rgba(0,0,0,.7), rgba(0,0,0,.4))",
          color: "white",
        }}
      >
        {/* Hero */}
        <header
          style={{
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ fontWeight: 700 }}>{site.nom_enseigne}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>{t.poweredBy}</div>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,2fr) minmax(0,1.2fr)",
              gap: 32,
              alignItems: "flex-start",
            }}
          >
            {/* Bloc texte */}
            <div>
              <h1 style={{ fontSize: 32, marginBottom: 12 }}>{title}</h1>
              <p style={{ fontSize: 16, maxWidth: 520, lineHeight: 1.5 }}>
                {metier?.pitch || t.defaultPitch}
              </p>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 12,
                  backdropFilter: "blur(10px)",
                  background: "rgba(0,0,0,.4)",
                }}
              >
                <h2 style={{ fontSize: 18, marginBottom: 8 }}>{t.contact}</h2>
                <p style={{ margin: 0 }}>
                  <strong>{t.address} :</strong> {site.adresse}, {site.ville}
                  <br />
                  <strong>{t.phone} :</strong> {site.telephone}
                  <br />
                  <strong>{t.email} :</strong>{" "}
                  <a
                    href={`mailto:${site.email}`}
                    style={{ color: "#ffde8b", textDecoration: "none" }}
                  >
                    {site.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Bloc Betty + contact */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {site.betty_on && bettyId && (
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "rgba(0,0,0,.5)",
                    border: `2px solid ${accent}`,
                    height: 380,
                  }}
                >
                  <iframe
                    src={`${bettyBase}/chat?public_id=${encodeURIComponent(
                      bettyId
                    )}&embed=1`}
                    title={`Assistant Betty – ${site.nom_enseigne}`}
                    style={{ width: "100%", height: "100%", border: 0 }}
                    loading="lazy"
                    allow="clipboard-read; clipboard-write"
                  />
                </div>
              )}
              {site.betty_on && !bettyId && (
                <div
                  style={{
                    borderRadius: 16,
                    background: "rgba(0,0,0,.5)",
                    border: "1px solid rgba(255,255,255,.1)",
                    padding: 16,
                    fontSize: 13,
                    color: "#ddd",
                    textAlign: "center",
                  }}
                >
                  {t.bettyActivating}
                </div>
              )}

              {/* Contact classique volontairement DISCRET (repliable) : Betty
                  reste la voie principale ; un formulaire trop visible
                  suggérerait qu'on peut se passer d'elle. */}
              <details style={{ marginTop: 2 }}>
                <summary
                  style={{
                    fontSize: 13,
                    color: "rgba(255,255,255,.6)",
                    cursor: "pointer",
                    listStyle: "none",
                    userSelect: "none",
                    padding: "2px 0",
                  }}
                >
                  ✉︎ {t.writeUs}
                </summary>
                <form
                  action={`/api/contact/${params.slug}`}
                  method="POST"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                    marginTop: 10,
                  }}
                >
                  <input
                    name="name"
                    placeholder={t.yourName}
                    required
                    style={{
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,.3)",
                      padding: "6px 8px",
                      background: "rgba(0,0,0,.4)",
                      color: "white",
                    }}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder={t.yourEmail}
                    required
                    style={{
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,.3)",
                      padding: "6px 8px",
                      background: "rgba(0,0,0,.4)",
                      color: "white",
                    }}
                  />
                  <textarea
                    name="message"
                    placeholder={t.yourMessage}
                    required
                    rows={4}
                    style={{
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,.3)",
                      padding: "6px 8px",
                      background: "rgba(0,0,0,.4)",
                      color: "white",
                      resize: "vertical",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      marginTop: 4,
                      borderRadius: 999,
                      border: "none",
                      padding: "8px 14px",
                      background: accent,
                      color: accentText,
                      fontWeight: 600,
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    {t.send}
                  </button>
                </form>
              </details>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
