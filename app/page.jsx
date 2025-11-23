// app/page.jsx
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="home-root">
      <div className="hero">
        {/* Bandeau logos */}
        <div className="hero-top">
          <div className="hero-logo-left">
            <Image
              src="/spectra_media_logo.png"
              alt="Spectra Media AI"
              width={160}
              height={40}
            />
          </div>
          <div className="hero-logo-right">
            <span className="betty-pill">BETTY BOTS</span>
          </div>
        </div>

        {/* Cercle + titre central */}
        <div className="hero-center">
          <div className="hero-circle">
            <h1>
              <span>Site pour</span>
              <span>professionnels</span>
              <span>à 1&nbsp;€</span>
            </h1>
            <p className="hero-sub">= abonnement mensuel, résiliable à tout moment</p>
          </div>
        </div>

        {/* Aperçu écran + CTA */}
        <div className="hero-bottom">
          <div className="hero-mock">
            <div className="hero-mock-top">
              <div className="hero-mock-tab active">Votre activité</div>
              <div className="hero-mock-tab">Avis</div>
              <div className="hero-mock-tab">Contact</div>
            </div>
            <div className="hero-mock-body">
              <div className="hero-mock-col">
                <h3>Présentez votre activité</h3>
                <p>
                  Une page claire, avec votre texte, vos coordonnées et un
                  formulaire qui vous envoie les messages directement par email.
                </p>
              </div>
              <div className="hero-mock-col">
                <h3>Gagnez des clients</h3>
                <p>
                  Vos clients vous trouvent, vous écrivent, et vous gardez la
                  main sur la relation.
                </p>
              </div>
              <div className="hero-mock-col">
                <h3>Assistant Betty (option)</h3>
                <p>
                  Ajoutez une Betty métier qui répond 24/7 et qualifie les demandes
                  comme sur votre offre actuelle.
                </p>
              </div>
            </div>
          </div>

          <div className="hero-cta">
            <Link href="/builder" className="hero-button-primary">
              Créer mon site à 1&nbsp;€
            </Link>
            <p className="hero-cta-note">
              1. Vous remplissez le formulaire &nbsp;&nbsp;•&nbsp;&nbsp; 2. Paiement sécurisé
              Stripe &nbsp;&nbsp;•&nbsp;&nbsp; 3. Votre page + Betty (si choisie) sont générées.
            </p>
          </div>
        </div>
      </div>

      {/* Petit bloc rassurance sous le hero */}
      <section className="section-steps">
        <div className="step">
          <span className="step-index">01</span>
          <h3>Configuration ultra simple</h3>
          <p>Nom de votre enseigne, adresse, téléphone, email, métier.</p>
        </div>
        <div className="step">
          <span className="step-index">02</span>
          <h3>Paiement mensuel à 1&nbsp;€</h3>
          <p>Abonnement Stripe, sans engagement, facturation claire.</p>
        </div>
        <div className="step">
          <span className="step-index">03</span>
          <h3>Page en ligne + messages par email</h3>
          <p>
            Vous recevez directement les messages de votre mini-site, comme avec
            vos Betty métier.
          </p>
        </div>
      </section>

      <style jsx>{`
        .home-root {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0b1120 0%, #020617 55%, #000 100%);
          color: #f9fafb;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text",
            "Inter", sans-serif;
        }

        .hero {
          max-width: 1120px;
          margin: 0 auto;
          padding: 40px 16px 72px;
        }

        .hero-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        .hero-logo-right {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .betty-pill {
          padding: 8px 18px;
          border-radius: 999px;
          border: 1px solid rgba(96, 165, 250, 0.7);
          color: #e5f0ff;
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.6);
        }

        .hero-center {
          display: flex;
          justify-content: center;
          margin-bottom: 40px;
        }

        .hero-circle {
          border-radius: 999px;
          border: 1px solid rgba(148, 163, 184, 0.6);
          box-shadow: 0 0 90px rgba(59, 130, 246, 0.4);
          padding: 56px 40px 32px;
          text-align: center;
          max-width: 520px;
        }

        .hero-circle h1 {
          margin: 0;
          font-weight: 500;
          line-height: 1.15;
          font-size: 34px;
        }

        .hero-circle h1 span {
          display: block;
        }

        .hero-circle h1 span:nth-child(3) {
          font-size: 40px;
          font-weight: 600;
        }

        .hero-sub {
          margin-top: 16px;
          font-size: 14px;
          color: #9ca3af;
        }

        .hero-bottom {
          margin-top: 40px;
          display: grid;
          grid-template-columns: minmax(0, 2fr) minmax(0, 1.3fr);
          gap: 32px;
          align-items: center;
        }

        .hero-mock {
          border-radius: 24px;
          background: radial-gradient(circle at top left, #111827, #020617);
          border: 1px solid rgba(148, 163, 184, 0.4);
          box-shadow: 0 18px 60px rgba(15, 23, 42, 0.9);
          overflow: hidden;
        }

        .hero-mock-top {
          display: flex;
          gap: 12px;
          padding: 14px 18px;
          border-bottom: 1px solid rgba(31, 41, 55, 0.9);
          background: rgba(15, 23, 42, 0.95);
        }

        .hero-mock-tab {
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          color: #9ca3af;
          background: rgba(15, 23, 42, 0.8);
        }

        .hero-mock-tab.active {
          color: #e5f0ff;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 0.9),
            rgba(56, 189, 248, 0.9)
          );
        }

        .hero-mock-body {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          padding: 22px 22px 26px;
          gap: 18px;
        }

        .hero-mock-col h3 {
          font-size: 15px;
          margin: 0 0 8px;
        }

        .hero-mock-col p {
          margin: 0;
          font-size: 13px;
          color: #9ca3af;
        }

        .hero-cta {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hero-button-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 14px 26px;
          border-radius: 999px;
          background: linear-gradient(
            135deg,
            rgba(59, 130, 246, 1),
            rgba(56, 189, 248, 1)
          );
          color: #0b1120;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 18px 40px rgba(37, 99, 235, 0.6);
          transition: transform 0.15s ease, box-shadow 0.15s ease,
            filter 0.15s ease;
        }

        .hero-button-primary:hover {
          transform: translateY(-1px);
          filter: brightness(1.05);
          box-shadow: 0 22px 50px rgba(37, 99, 235, 0.8);
        }

        .hero-cta-note {
          font-size: 13px;
          color: #9ca3af;
          max-width: 360px;
        }

        .section-steps {
          max-width: 1120px;
          margin: 0 auto 40px;
          padding: 0 16px 40px;
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          border-top: 1px solid rgba(31, 41, 55, 0.9);
          padding-top: 32px;
        }

        .step {
          background: radial-gradient(circle at top, #020617, #020617);
          border-radius: 20px;
          border: 1px solid rgba(55, 65, 81, 0.8);
          padding: 18px 18px 16px;
        }

        .step-index {
          font-size: 11px;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #6b7280;
        }

        .step h3 {
          margin: 6px 0 6px;
          font-size: 15px;
        }

        .step p {
          margin: 0;
          font-size: 13px;
          color: #9ca3af;
        }

        @media (max-width: 900px) {
          .hero-circle {
            padding: 40px 24px 24px;
          }

          .hero-circle h1 {
            font-size: 28px;
          }
          .hero-circle h1 span:nth-child(3) {
            font-size: 32px;
          }

          .hero-bottom {
            grid-template-columns: minmax(0, 1fr);
          }

          .hero-mock-body {
            grid-template-columns: minmax(0, 1fr);
          }

          .section-steps {
            grid-template-columns: minmax(0, 1fr);
          }
        }
      `}</style>
    </main>
  );
}
