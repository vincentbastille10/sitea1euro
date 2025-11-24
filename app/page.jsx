// app/page.jsx

export const metadata = {
  title: "Site professionnel à 1 € | Spectra Media AI",
  description:
    "Créez votre site professionnel pour 1 € par mois. Page claire, formulaire de contact, visibilité Google, image générée par IA, option Betty Assistante IA.",
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
};

export default function Home() {
  return (
    <main style={{ fontFamily: "system-ui", padding: "40px 16px" }}>
      {/* HERO */}
      <section style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 16 }}>
          <img
            src="/spectra_media_logo.png"
            alt="Spectra Media"
            style={{
              maxWidth: 200,
              height: "auto",
              display: "block",
              margin: "0 auto",
            }}
          />
        </div>

        <p
          style={{
            fontSize: 12,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "#4b5563",
            marginBottom: 8,
          }}
        >
          Offre transparente Spectra Media
        </p>

        <h1
          style={{
            fontSize: 32,
            lineHeight: 1.2,
            margin: "0 0 12px 0",
          }}
        >
          Votre site professionnel à{" "}
          <span style={{ color: "#2563eb", fontWeight: 700 }}>
            1&nbsp;€ par mois
          </span>
        </h1>

        <p
          style={{
            maxWidth: 640,
            margin: "0 auto",
            fontSize: 15,
            color: "#374151",
          }}
        >
          Vous répondez à quelques questions. On crée votre site, on génère
          l’image de fond, et vous recevez automatiquement par mail l’URL de
          votre nouvelle vitrine en ligne.
        </p>

        <div style={{ marginTop: 24 }}>
          <a
            href="/builder"
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "12px 32px",
              borderRadius: 999,
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            Créer mon site à 1&nbsp;€
          </a>

          <p
            style={{
              fontSize: 12,
              color: "#6b7280",
              marginTop: 8,
            }}
          >
            Sans engagement • Paiement mensuel via Stripe • Annulable à tout
            moment
          </p>
        </div>
      </section>

      {/* EXEMPLES DE SITES */}
      <section
        style={{
          maxWidth: 960,
          margin: "40px auto 0",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: 20,
            marginBottom: 16,
          }}
        >
          Exemples de sites générés avec l&apos;offre à 1&nbsp;€
        </h2>

        <p
          style={{
            fontSize: 14,
            color: "#4b5563",
            marginBottom: 24,
          }}
        >
          Chaque site est adapté au métier et à la ville de votre activité.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "center",
          }}
        >
          {/* Esthéticienne */}
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 300,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              padding: 12,
              boxSizing: "border-box",
            }}
          >
            <img
              src="/site1euroeste.png"
              alt="Exemple site esthéticienne"
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                borderRadius: 12,
                display: "block",
              }}
            />
            <p
              style={{
                marginTop: 8,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Esthéticienne
            </p>
          </div>

          {/* Agent immobilier */}
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 300,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              padding: 12,
              boxSizing: "border-box",
            }}
          >
            <img
              src="/site1euroimmo.png"
              alt="Exemple site agent immobilier"
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                borderRadius: 12,
                display: "block",
              }}
            />
            <p
              style={{
                marginTop: 8,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Agent immobilier
            </p>
          </div>

          {/* Artisan */}
          <div
            style={{
              flex: "1 1 260px",
              maxWidth: 300,
              borderRadius: 16,
              border: "1px solid #e5e7eb",
              padding: 12,
              boxSizing: "border-box",
            }}
          >
            <img
              src="/site1euroarti.png"
              alt="Exemple site artisan"
              style={{
                width: "100%",
                height: 260,
                objectFit: "cover",
                borderRadius: 12,
                display: "block",
              }}
            />
            <p
              style={{
                marginTop: 8,
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              Artisan
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
