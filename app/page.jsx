// app/page.jsx

export const metadata = {
  title: "Site professionnel à 1 € | Spectra Media AI",
  description:
    "Créez votre site professionnel pour 1 € par mois. Page claire, formulaire de contact, visibilité Google, assistant Betty en option. Sans engagement.",
  keywords: [
    "site professionnel pas cher",
    "site internet 1 euro",
    "création site rapide",
    "site autoentrepreneur",
    "site pour artisan",
    "site vitrine pas cher",
    "Spectra Media AI",
    "Betty Bots",
  ],
  openGraph: {
    title: "Créez votre site professionnel pour 1 €",
    description:
      "La solution la plus simple pour être visible : un site propre, vos coordonnées, un formulaire de contact, et Betty en option.",
    url: "https://sitea1euro.vercel.app/",
    siteName: "Site pro à 1 €",
    images: [
      {
        url: "/spectra_media_logo.png",
        width: 1200,
        height: 630,
        alt: "Site professionnel 1 euro",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function Home() {
  const year = new Date().getFullYear();

  return (
    <main
      style={{
        minHeight: "100vh",
        margin: 0,
        padding: 0,
        background:
          "radial-gradient(circle at top, rgba(37,99,235,0.35), #020617 55%, #000000 100%)",
        color: "#f9fafb",
        fontFamily:
          "-apple-system, BlinkMacSystemFont, system-ui, 'SF Pro Text', 'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo Spectra Media AI */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <img
            src="/spectra_media_logo.png"
            alt="Spectra Media AI"
            style={{
              height: "58px",
              objectFit: "contain",
              filter: "drop-shadow(0 0 18px rgba(59,130,246,0.7))",
            }}
          />
        </div>

        {/* Bouton Betty Bots */}
        <a
          href="https://www.spectramedia.online/"
          style={{
            padding: "10px 26px",
            borderRadius: "999px",
            border: "1px solid rgba(96,165,250,0.9)",
            color: "#e5f0ff",
            fontSize: "14px",
            letterSpacing: "0.08em",
            textDecoration: "none",
            textTransform: "uppercase",
            backdropFilter: "blur(8px)",
            background:
              "radial-gradient(circle at top, rgba(37,99,235,0.45), rgba(15,23,42,0.9))",
            boxShadow: "0 0 22px rgba(37,99,235,0.7)",
          }}
        >
          BETTY BOTS
        </a>
      </header>

      {/* HERO */}
      <section
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "40px 16px 30px",
        }}
      >
        {/* Cercle / halo */}
        <div
          style={{
            width: "min(720px, 100%)",
            padding: "72px 32px 80px",
            borderRadius: "999px",
            border: "1px solid rgba(148,163,184,0.35)",
            background:
              "radial-gradient(circle at top, rgba(37,99,235,0.3), rgba(15,23,42,0.92))",
            boxShadow:
              "0 0 80px rgba(37,99,235,0.58), 0 0 160px rgba(15,23,42,0.9)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "rgba(148,163,184,0.9)",
              marginBottom: "18px",
            }}
          >
            SPECTRA MEDIA AI
          </p>

          <h1
            style={{
              fontSize: "clamp(34px, 4vw, 40px)",
              lineHeight: 1.2,
              fontWeight: 600,
              margin: "0 0 18px",
            }}
          >
            Site pour professionnels
            <br />
            à&nbsp;1&nbsp;€
          </h1>

          <p
            style={{
              fontSize: "15px",
              color: "rgba(209,213,219,0.9)",
              marginBottom: "32px",
            }}
          >
            Abonnement mensuel, résiliable à tout moment.
            <br />
            Une page claire, vos coordonnées, un formulaire de contact
            <span style={{ opacity: 0.9 }}> – Betty en option.</span>
          </p>

          {/* CTA principal */}
          <a
            href="/builder"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 32px",
              borderRadius: "999px",
              border: "none",
              background:
                "linear-gradient(90deg, #4f46e5 0%, #6366f1 40%, #0ea5e9 100%)",
              color: "#f9fafb",
              fontSize: "16px",
              fontWeight: 600,
              textDecoration: "none",
              boxShadow:
                "0 0 28px rgba(79,70,229,0.7), 0 0 60px rgba(14,165,233,0.6)",
              cursor: "pointer",
            }}
          >
            Créer mon site professionnel pour 1&nbsp;€
          </a>

          <p
            style={{
              marginTop: "12px",
              fontSize: "12px",
              color: "rgba(148,163,184,0.9)",
            }}
          >
            Paiement sécurisé via Stripe • Mise en ligne automatique après
            validation.
          </p>
        </div>

        {/* Bandeau / Tabs */}
        <div
          style={{
            marginTop: "50px",
            width: "min(1040px, 100%)",
            borderRadius: "26px",
            background: "rgba(15,23,42,0.9)",
            border: "1px solid rgba(30,64,175,0.7)",
            boxShadow: "0 32px 80px rgba(15,23,42,0.8)",
            overflow: "hidden",
          }}
        >
          {/* Onglets (statique visuel) */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              padding: "12px 18px",
              borderBottom: "1px solid rgba(31,41,55,0.9)",
              background:
                "radial-gradient(circle at top, rgba(37,99,235,0.35), rgba(15,23,42,0.98))",
            }}
          >
            <button
              type="button"
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                border: "none",
                fontSize: "14px",
                cursor: "default",
                background:
                  "linear-gradient(90deg, rgba(37,99,235,0.9), rgba(56,189,248,0.7))",
                color: "#f9fafb",
                fontWeight: 500,
              }}
            >
              Votre activité
            </button>
            <button
              type="button"
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(55,65,81,0.9)",
                background: "transparent",
                color: "rgba(156,163,175,0.9)",
                fontSize: "14px",
                cursor: "default",
              }}
            >
              Avis
            </button>
            <button
              type="button"
              style={{
                padding: "8px 16px",
                borderRadius: "999px",
                border: "1px solid rgba(55,65,81,0.9)",
                background: "transparent",
                color: "rgba(156,163,175,0.9)",
                fontSize: "14px",
                cursor: "default",
              }}
            >
              Contact
            </button>
          </div>

          {/* Contenu des “onglets” */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
              gap: "28px",
              padding: "26px 28px 32px",
            }}
          >
            {/* Bloc 1 */}
            <div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Présentez votre activité
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(209,213,219,0.9)",
                  lineHeight: 1.6,
                }}
              >
                Une page claire, avec votre texte, vos coordonnées,
                <br />
                votre photo ou logo, et un design professionnel
                <br />
                adapté à votre métier.
              </p>
            </div>

            {/* Bloc 2 */}
            <div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Gagnez des clients
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(209,213,219,0.9)",
                  lineHeight: 1.6,
                }}
              >
                Vos clients vous trouvent, vous écrivent via le
                <br />
                formulaire, et vous gardez la main sur la relation.
                <br />
                Tous les messages arrivent dans votre boîte mail.
              </p>
            </div>

            {/* Bloc 3 */}
            <div>
              <h3
                style={{
                  fontSize: "17px",
                  fontWeight: 600,
                  marginBottom: "8px",
                }}
              >
                Assistant Betty (option)
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "rgba(209,213,219,0.9)",
                  lineHeight: 1.6,
                }}
              >
                Ajoutez une Betty métier qui répond 24/7,
                <br />
                qualifie les demandes et vous envoie un résumé
                <br />
                par email – comme sur l’abonnement Betty classique.
              </p>
            </div>
          </div>
        </div>

        {/* MINI RAPPEL CTA */}
        <div
          style={{
            marginTop: "26px",
            textAlign: "center",
            fontSize: "13px",
            color: "rgba(148,163,184,0.9)",
          }}
        >
          <span style={{ opacity: 0.9 }}>
            Prêt&nbsp;? Cliquez sur le bouton ci-dessus ou
          </span>{" "}
          <a
            href="/builder"
            style={{
              color: "#a855f7",
              textDecoration: "underline",
              textDecorationThickness: "1px",
            }}
          >
            allez directement au formulaire de création
          </a>
          .
        </div>

        {/* SECTION AVIS */}
        <section
          style={{
            width: "100%",
            maxWidth: "1020px",
            margin: "70px auto 40px",
            padding: "0 20px",
          }}
        >
          <h2
            style={{
              textAlign: "center",
              fontSize: "24px",
              fontWeight: 600,
              marginBottom: "26px",
              color: "#f3f4f6",
              textShadow: "0 0 20px rgba(59,130,246,0.45)",
            }}
          >
            Ils utilisent déjà leur site à 1&nbsp;€
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "22px",
            }}
          >
            {/* Avis 1 */}
            <div
              style={{
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(30,64,175,0.4)",
                padding: "22px",
                borderRadius: "20px",
                boxShadow: "0 0 18px rgba(59,130,246,0.2)",
              }}
            >
              <p style={{ fontSize: "15px", lineHeight: 1.6, opacity: 0.9 }}>
                “J’avais besoin d’une page simple pour mon activité de
                réflexologue. En dix minutes tout était prêt. J’ai reçu trois
                demandes la première semaine. Le prix est ridicule pour ce que
                ça apporte.”
              </p>
              <p style={{ marginTop: "14px", fontWeight: 600 }}>— Sandra L.</p>
            </div>

            {/* Avis 2 */}
            <div
              style={{
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(30,64,175,0.4)",
                padding: "22px",
                borderRadius: "20px",
                boxShadow: "0 0 18px rgba(56,189,248,0.2)",
              }}
            >
              <p style={{ fontSize: "15px", lineHeight: 1.6, opacity: 0.9 }}>
                “Je ne voulais pas de site compliqué. Là j’ai juste une page
                claire, mon numéro, et les messages arrivent dans ma boîte
                Gmail. C’est parfait pour un auto-entrepreneur.”
              </p>
              <p style={{ marginTop: "14px", fontWeight: 600 }}>— Karim B.</p>
            </div>

            {/* Avis 3 */}
            <div
              style={{
                background: "rgba(15,23,42,0.85)",
                border: "1px solid rgba(30,64,175,0.4)",
                padding: "22px",
                borderRadius: "20px",
                boxShadow: "0 0 18px rgba(37,99,235,0.25)",
              }}
            >
              <p style={{ fontSize: "15px", lineHeight: 1.6, opacity: 0.9 }}>
                “Je suis artisan menuisier. Le site me sert de carte de visite
                professionnelle. J’ai ajouté Betty et elle répond aux demandes
                pendant que je suis sur les chantiers.”
              </p>
              <p style={{ marginTop: "14px", fontWeight: 600 }}>— Julien P.</p>
            </div>
          </div>
        </section>
      </section>

      {/* JSON-LD pour Google */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: "Site professionnel à 1 €",
            provider: {
              "@type": "Organization",
              name: "Spectra Media AI",
              url: "https://spectramedia.online",
            },
            description:
              "Création d’un site professionnel simple, rapide, optimisé pour Google, à 1 € par mois.",
            offers: {
              "@type": "Offer",
              price: "1.00",
              priceCurrency: "EUR",
            },
          }),
        }}
      ></script>

      {/* FOOTER */}
      <footer
        style={{
          padding: "18px 32px 26px",
          fontSize: "11px",
          color: "rgba(148,163,184,0.9)",
          textAlign: "center",
        }}
      >
        <div>
          © {year} Spectra Media AI — Site pro à 1 € • propulsé par Betty Bots.
        </div>
        <div style={{ marginTop: "10px" }}>
          <a
            href="mailto:spectramediabots@gmail.com"
            style={{
              color: "#60a5fa",
              textDecoration: "none",
              fontSize: "12px",
            }}
          >
            Contact Spectra Media : spectramediabots@gmail.com
          </a>
        </div>
      </footer>
    </main>
  );
}
