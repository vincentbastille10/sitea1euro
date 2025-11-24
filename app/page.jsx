// app/page.jsx
"use client";

// --- SEO / METADATA ---
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

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <main className="page">
        {/* HERO */}
        <section className="hero">
          <div className="hero-logo">
            <Image
              src="/spectra_media_logo.png"
              alt="Spectra Media"
              fill
              sizes="200px"
            />
          </div>

          <p className="hero-tagline">Offre transparente Spectra Media</p>

          <h1 className="hero-title">
            Votre site professionnel à <span>1&nbsp;€ par mois</span>
          </h1>

          <p className="hero-text">
            Vous répondez à quelques questions. On crée votre site, on génère
            l’image de fond, et vous recevez automatiquement par mail l’URL de
            votre nouvelle vitrine en ligne.
          </p>

          <div className="hero-actions">
            <Link href="/builder" className="primaryButton">
              Créer mon site à 1&nbsp;€
            </Link>
            <p className="hero-note">
              Sans engagement • Paiement mensuel via Stripe • Annulable à tout
              moment
            </p>
          </div>
        </section>

        {/* POUR QUI */}
        <section className="section section-split">
          <div className="section-text">
            <h2>Pensé pour les pros qui n&apos;ont pas le temps</h2>
            <p>
              Coiffeurs, thérapeutes, ostéopathes, artisans, coachs,
              restaurateurs… Vous avez besoin d&apos;une page claire, jolie et
              facile à partager, pas d&apos;un chantier technique sans fin.
            </p>
            <p>
              Votre site à 1&nbsp;€ s&apos;affiche parfaitement sur mobile et
              peut intégrer en option votre assistante IA Betty pour capter les
              demandes 24/7.
            </p>
          </div>

          <div className="card-steps">
            <p className="card-title">En 3 étapes :</p>
            <ol>
              <li>
                Vous remplissez un court formulaire (métier, ville,
                coordonnées).
              </li>
              <li>
                Vous validez l&apos;abonnement sécurisé à 1&nbsp;€ / mois via
                Stripe.
              </li>
              <li>
                Vous recevez par mail l&apos;URL de votre site et vous pouvez la
                partager immédiatement.
              </li>
            </ol>
          </div>
        </section>

        {/* AVANTAGES */}
        <section className="section">
          <h2 className="section-title">
            Ce que votre site à 1&nbsp;€ fait pour vous
          </h2>

          <div className="cards-grid">
            <div className="card">
              <p className="card-label">Vitrine claire</p>
              <p>
                Une page propre avec vos services, vos coordonnées, un plan et
                un bouton de contact immédiat.
              </p>
            </div>
            <div className="card">
              <p className="card-label">Image générée automatiquement</p>
              <p>
                Une image de fond générée par IA à partir de votre métier, de
                votre ville et de votre identité de pro.
              </p>
            </div>
            <div className="card">
              <p className="card-label">Option Betty</p>
              <p>
                En ajoutant 1&nbsp;€ de plus, vous pouvez activer Betty, votre
                assistante IA qui accueille vos visiteurs.
              </p>
            </div>
          </div>

          <div className="section-cta">
            <Link href="/builder" className="primaryButton">
              Lancer la création de mon site
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="footer">
          Spectra Media • Sites pour professionnels à 1&nbsp;€ par mois •
          Annulable à tout moment.
        </footer>
      </main>

      {/* STYLES SPÉCIFIQUES À LA PAGE */}
      <style jsx>{`
        .page {
          background: #ffffff;
          color: #111111;
        }

        .hero,
        .section {
          max-width: 960px;
          margin: 0 auto;
          padding: 40px 16px;
        }

        .hero {
          text-align: center;
        }

        .hero-logo {
          position: relative;
          width: 180px;
          height: 180px;
          margin: 0 auto 16px auto;
        }

        .hero-tagline {
          font-size: 12px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #4b5563;
          margin-bottom: 8px;
        }

        .hero-title {
          font-size: 32px;
          line-height: 1.2;
          margin: 0 0 12px 0;
        }

        .hero-title span {
          color: #2563eb; /* bleu accent propre */
          font-weight: 700;
        }

        .hero-text {
          max-width: 640px;
          margin: 0 auto;
          font-size: 15px;
          color: #374151;
        }

        .hero-actions {
          margin-top: 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
        }

        .primaryButton {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 32px;
          border-radius: 999px;
          background-color: #2563eb;
          color: #ffffff;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: background-color 0.15s ease, transform 0.1s ease;
        }

        .primaryButton:hover {
          background-color: #1d4ed8;
          transform: translateY(-1px);
        }

        .hero-note {
          font-size: 12px;
          color: #6b7280;
        }

        .section-split {
          display: flex;
          flex-direction: column;
          gap: 24px;
          border-top: 1px solid #e5e7eb;
        }

        .section-text h2 {
          font-size: 22px;
          margin-bottom: 12px;
        }

        .section-text p {
          font-size: 15px;
          color: #374151;
          margin-bottom: 8px;
        }

        .card-steps {
          border-radius: 16px;
          border: 1px solid #bfdbfe;
          background: #eff6ff;
          padding: 16px 20px;
          font-size: 14px;
          color: #1f2933;
        }

        .card-title {
          font-weight: 600;
          color: #1d4ed8;
          margin-bottom: 8px;
          font-size: 13px;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .card-steps ol {
          padding-left: 18px;
          margin: 0;
        }

        .card-steps li {
          margin-bottom: 6px;
        }

        .section-title {
          text-align: center;
          font-size: 22px;
          margin-bottom: 24px;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(1, minmax(0, 1fr));
          gap: 16px;
        }

        .card {
          border-radius: 16px;
          border: 1px solid #e5e7eb;
          background: #f9fafb;
          padding: 16px 20px;
          font-size: 14px;
          color: #111827;
        }

        .card-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: #2563eb;
          margin-bottom: 6px;
        }

        .section-cta {
          margin-top: 24px;
          text-align: center;
        }

        .footer {
          border-top: 1px solid #e5e7eb;
          padding: 16px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          margin-top: 16px;
        }

        @media (min-width: 768px) {
          .hero-title {
            font-size: 40px;
          }

          .section-split {
            flex-direction: row;
            align-items: flex-start;
          }

          .section-text,
          .card-steps {
            flex: 1;
          }

          .cards-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }
      `}</style>
    </>
  );
}
