// app/page.jsx

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

// --- PAGE CONTENT ---
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-50">
      {/* HERO */}
      <section className="px-4 py-16 md:py-24 max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Logo Spectra Media au centre */}
          <div className="relative w-40 h-40 md:w-52 md:h-52">
            <Image
              src="/spectra_media_logo.png"
              alt="Spectra Media"
              fill
              sizes="(max-width: 768px) 160px, 208px"
              className="object-contain drop-shadow-xl"
              priority
            />
          </div>

          <div className="space-y-4 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-400/80">
              Offre transparente Spectra Media
            </p>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-tight">
              Votre site professionnel à{" "}
              <span className="text-sky-400">1&nbsp;€ par mois</span>
            </h1>

            <p className="text-slate-300 text-sm md:text-base">
              Vous répondez à quelques questions. On crée votre site, on génère
              l’image de fond, et vous recevez automatiquement par mail l’URL de
              votre nouvelle vitrine en ligne.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/30 transition"
            >
              Créer mon site à 1&nbsp;€
            </Link>
            <p className="text-xs text-slate-400">
              Sans engagement • Paiement mensuel via Stripe • Annulable à tout
              moment
            </p>
          </div>
        </div>
      </section>

      {/* SECTION : POUR QUI ? */}
      <section className="px-4 py-10 md:py-14 border-t border-slate-800/80 bg-slate-950/80">
        <div className="max-w-5xl mx-auto grid gap-10 md:grid-cols-[1.2fr,1fr] items-center">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-semibold">
              Pensé pour les pros qui n'ont pas le temps
            </h2>

            <p className="text-sm md:text-base text-slate-300">
              Coiffeurs, thérapeutes, ostéopathes, artisans, coachs,
              restaurateurs… Vous avez besoin d'une page claire, jolie et
              facile à partager, pas d'un chantier technique sans fin.
            </p>

            <p className="text-sm text-slate-400">
              Votre site à 1&nbsp;€ s'affiche parfaitement sur mobile et peut
              intégrer en option votre assistante IA Betty pour capter les
              demandes 24/7.
            </p>
          </div>

          <div className="rounded-2xl border border-sky-500/40 bg-slate-900/60 p-4 md:p-5 shadow-xl shadow-sky-900/40">
            <p className="text-xs font-semibold text-sky-400 mb-2">
              En 3 étapes :
            </p>

            <ol className="space-y-3 text-sm text-slate-200">
              <li>
                <span className="font-semibold text-sky-400">1.</span> Vous
                remplissez un court formulaire (métier, ville, coordonnées).
              </li>

              <li>
                <span className="font-semibold text-sky-400">2.</span> Vous
                validez l'abonnement sécurisé à 1&nbsp;€ / mois via Stripe.
              </li>

              <li>
                <span className="font-semibold text-sky-400">3.</span> Vous
                recevez par mail l'URL de votre site et vous pouvez la partager
                immédiatement.
              </li>
            </ol>
          </div>
        </div>
      </section>

      {/* SECTION AVANTAGES */}
      <section className="px-4 py-12 md:py-16">
        <div className="max-w-5xl mx-auto space-y-8">
          <h2 className="text-xl md:text-2xl font-semibold text-center">
            Ce que votre site à 1&nbsp;€ fait pour vous
          </h2>

          <div className="grid gap-6 md:grid-cols-3 text-sm">
            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
              <p className="text-sky-400 text-xs font-semibold mb-2">
                Vitrine claire
              </p>
              <p className="text-slate-200">
                Une page propre avec vos services, vos coordonnées, un plan et
                un bouton de contact immédiat.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
              <p className="text-sky-400 text-xs font-semibold mb-2">
                Image générée automatiquement
              </p>
              <p className="text-slate-200">
                Une image de fond générée par IA à partir de votre métier, de
                votre ville et de votre identité de pro.
              </p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-slate-800 p-5">
              <p className="text-sky-400 text-xs font-semibold mb-2">
                Option Betty
              </p>
              <p className="text-slate-200">
                En ajoutant 1&nbsp;€ de plus, vous pouvez activer Betty, votre
                assistante IA qui accueille vos visiteurs.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Link
              href="/builder"
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold bg-sky-500 hover:bg-sky-400 text-slate-950 shadow-lg shadow-sky-500/30 transition"
            >
              Lancer la création de mon site
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <p>
          Spectra Media • Sites pour professionnels à 1&nbsp;€ par mois •
          Annulable à tout moment.
        </p>
      </footer>
    </main>
  );
}
