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
      <section style={{ maxWidth: 960, margin: "0 auto", textAlign: "center" }}>
        <div style={{ marginBottom: 16 }}>
          <img
            src="/spectra_media_logo.png"
            alt="Spectra Media"
            style={{ maxWidth: 200, height: "auto", display: "block", margin: "0 auto" }}
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
          <span style={{ color: "#2563eb", fontWeight: 700 }}>1&nbsp;€ par mois</span>
        </h1>

        <p
          style={{
            maxWidth: 640,
            margin: "0 auto",
            fontSize: 15,
            color: "#374151",
          }}
        >
          Vous répondez à quelques questions. On crée votre site, on génère l’image de fond,
          et vous recevez automatiquement par mail l’URL de votre nouvelle vitrine en ligne.
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
            Sans engagement • Paiement mensuel via Stripe • Annulable à tout moment
          </p>
        </div>
      </section>
    </main>
  );
}
