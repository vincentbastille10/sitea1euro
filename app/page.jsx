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

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="sm-page">
      {/* HERO */}
      <section className="sm-hero">
        <div className="sm-hero-logo">
          <Image
            src="/spectra_media_logo.png"
            alt="Spectra Media"
            fill
            sizes="200px"
          />
        </div>

        <p className="sm-hero-tagline">Offre transparente Spectra Media</p>

        <h1 className="sm-hero-title">
          Votre site professionnel à <span>1&nbsp;€ par mois</span>
        </h1>

        <p className="sm-hero-text">
          Vous répondez à quelques questions. On crée votre site, on génère
          l’image de fond, et vous recevez automatiquement par mail l’URL de
          votre nouvelle vitrine en ligne.
        </p>

        <div className="sm-hero-actions">
          <Link href="/builder" className="sm-btn-primary">
            Créer mon site à 1&nbsp;€
          </Link>
          <p className="sm-hero-note">
            Sans engagement • Paiement mensuel via Stripe • Annulable à tout
            moment
          </p>
        </div>
      </section>

      {/* POUR QUI */}
      <section className="sm-section sm-section-split">
        <div className="sm-section-text">
          <h2>Pensé pour les pros qui n&apos;ont pas le temps</h2>
          <p>
            Coiffeurs, thérapeutes, ostéopathes, artisans, coachs, restaurateurs…
            Vous avez besoin d&apos;une page claire, jolie et facile à partager,
            pas d&apos;un chantier technique sans fin.
          </p>
          <p>
            Votre site à 1&nbsp;€ s&apos;affiche parfaitement sur mobile et peut
            intégrer en option votre assistante IA Betty pour capter les demandes
            24/7.
          </p>
        </div>

        <div className="sm-card-steps">
          <p className="sm-card-title">En 3 étapes :</p>
          <ol>
            <li>
              Vous remplissez un court formulaire (métier, ville, coordonnées).
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
      <section className="sm-section">
        <h2 className="sm-section-title">
          Ce que votre site à 1&nbsp;€ fait pour vous
        </h2>

        <div className="sm-cards-grid">
          <div className="sm-card">
            <p className="sm-card-label">Vitrine claire</p>
            <p>
              Une page propre avec vos services, vos coordonnées, un plan et un
              bouton de contact immédiat.
            </p>
          </div>
          <div className="sm-card">
            <p className="sm-card-label">Image générée automatiquement</p>
            <p>
              Une image de fond générée par IA à partir de votre métier, de
              votre ville et de votre identité de pro.
            </p>
          </div>
          <div className="sm-card">
            <p className="sm-card-label">Option Betty</p>
            <p>
              En ajoutant 1&nbsp;€ de plus, vous pouvez activer Betty, votre
              assistante IA qui accueille vos visiteurs.
            </p>
          </div>
        </div>

        <div className="sm-section-cta">
          <Link href="/builder" className="sm-btn-primary">
            Lancer la création de mon site
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="sm-footer">
        Spectra Media • Sites pour professionnels à 1&nbsp;€ par mois •
        Annulable à tout moment.
      </footer>
    </main>
  );
}
