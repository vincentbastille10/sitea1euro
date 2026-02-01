// app/page.jsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";

export const metadata = {
  title: "Site professionnel à 1 € | Spectra Media AI",
  description:
    "Créez votre site professionnel pour 1 € par mois. Mise en ligne automatique, page claire, contact, image IA. Option Betty Assistante IA.",
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

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(!!mq.matches);
    onChange();
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setY(window.scrollY || 0));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return y;
}

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [ok, setOk] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setOk(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOk(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`reveal ${ok ? "in" : ""} ${className}`}
      style={{ ["--d"]: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function ExampleCard({ img, title, tag, city, href = "/builder" }) {
  return (
    <a className="exCard" href={href} aria-label={`Créer un site comme ${title}`}>
      <div className="exMedia">
        <img src={img} alt={`Exemple site ${title}`} />
        <div className="exGlow" aria-hidden="true" />
        <div className="exOverlay" aria-hidden="true">
          <div className="exTop">
            <span className="chip">Exemple</span>
            <span className="chip ghost">1€ / mois</span>
          </div>
          <div className="exBottom">
            <div className="exTitle">{title}</div>
            <div className="exMeta">
              <span className="tag">{tag}</span>
              <span className="dot" />
              <span className="city">{city}</span>
            </div>
            <div className="exCtaRow">
              <span className="miniBtn">Voir le style</span>
              <span className="miniBtn ghost">Créer le mien</span>
            </div>
          </div>
        </div>
      </div>
    </a>
  );
}

export default function Home() {
  const reduced = useReducedMotion();
  const y = useScrollY();

  // Parallax léger (safe, sans jitter)
  const heroParallax = useMemo(() => {
    if (reduced) return "translate3d(0,0,0)";
    const t = Math.min(y, 320) * 0.12;
    return `translate3d(0, ${t}px, 0)`;
  }, [y, reduced]);

  return (
    <>
      <main className="page">
        {/* NAV */}
        <header className="nav">
          <div className="wrap navInner">
            <a className="brand" href="#top" aria-label="Spectra Media AI">
              <img
                className="logo"
                src="/spectra_media_logo.png"
                alt="Spectra Media AI"
              />
              <div className="brandTxt">
                <div className="brandName">Spectra Media AI</div>
                <div className="brandSub">Sites vitrines premium + option IA</div>
              </div>
            </a>

            <nav className="links" aria-label="Navigation">
              <a href="#exemples">Exemples</a>
              <a href="#process">Process</a>
              <a href="#preuves">Preuves</a>
              <a href="#faq">FAQ</a>
              <a className="ctaNav" href="/builder">
                Créer mon site
              </a>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section id="top" className="hero">
          <div className="bg" aria-hidden="true" />
          <div className="noise" aria-hidden="true" />

          <div className="wrap heroGrid">
            <div className="heroLeft">
              <Reveal delay={0}>
                <div className="kickers">
                  <span className="kicker">
                    <span className="spark" aria-hidden="true" />
                    Offre transparente • mise en ligne automatique
                  </span>
                  <span className="pill">Stripe</span>
                  <span className="pill">Sans engagement</span>
                </div>
              </Reveal>

              <Reveal delay={80}>
                <h1 className="h1">
                  Un site{" "}
                  <span className="grad">vraiment pro</span>
                  <br />
                  à{" "}
                  <span className="price">
                    1&nbsp;€<span className="per">/mois</span>
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={140}>
                <p className="lead">
                  Vous répondez à quelques questions. On génère une vitrine
                  claire, élégante et orientée contact (image IA incluse), puis
                  vous recevez l’URL par email.
                </p>
              </Reveal>

              <Reveal delay={200}>
                <div className="ctaRow">
                  <a className="ctaPrimary" href="/builder">
                    Créer mon site maintenant
                  </a>
                  <a className="ctaGhost" href="#exemples">
                    Voir des exemples
                  </a>
                </div>

                <div className="micro">
                  Sans engagement • Paiement mensuel via Stripe • Annulable à tout moment
                </div>
              </Reveal>

              <Reveal delay={260}>
                <div className="trustRow">
                  <div className="trust">✅ Page claire + contact</div>
                  <div className="trust">✅ Image de fond générée (IA)</div>
                  <div className="trust">✅ Adapté à votre métier + ville</div>
                </div>
              </Reveal>
            </div>

            <div className="heroRight" style={{ transform: heroParallax }}>
              <Reveal delay={120} className="stack">
                {/* “Device” preview premium */}
                <div className="device">
                  <div className="deviceTop">
                    <div className="dots" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="url">votre-site.en-ligne</div>
                    <div className="live">LIVE</div>
                  </div>

                  <div className="deviceBody">
                    <div className="heroMock">
                      <div className="heroMockShade" aria-hidden="true" />
                      <div className="heroMockTxt">
                        <div className="mockTitle">Nom de votre enseigne</div>
                        <div className="mockSub">Votre métier • Votre ville</div>
                        <div className="mockBtns">
                          <span className="mockBtn">Appeler</span>
                          <span className="mockBtn ghost">Demander un devis</span>
                        </div>
                      </div>
                    </div>

                    <div className="bullets">
                      <div className="bullet">
                        <b>✔</b> Infos essentielles visibles
                      </div>
                      <div className="bullet">
                        <b>✔</b> Formulaire prêt à convertir
                      </div>
                      <div className="bullet">
                        <b>✔</b> Image IA premium
                      </div>
                      <div className="bullet">
                        <b>＋</b> Option Betty (assistante IA)
                      </div>
                    </div>
                  </div>

                  <div className="shine" aria-hidden="true" />
                </div>

                {/* mini KPI cards */}
                <div className="kpis" aria-hidden="true">
                  <div className="kpi">
                    <div className="kpiN">1€</div>
                    <div className="kpiL">par mois</div>
                  </div>
                  <div className="kpi">
                    <div className="kpiN">3</div>
                    <div className="kpiL">minutes</div>
                  </div>
                  <div className="kpi">
                    <div className="kpiN">24/7</div>
                    <div className="kpiL">visible</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>

          {/* Sticky CTA (mobile + desktop discret) */}
          <div className="sticky">
            <a className="stickyBtn" href="/builder">
              <span className="stickyStar" aria-hidden="true" />
              Créer mon site à 1€
            </a>
          </div>
        </section>

        {/* EXEMPLES */}
        <section id="exemples" className="section alt">
          <div className="wrap">
            <Reveal>
              <div className="head">
                <h2 className="h2">Exemples (tes 3 visuels)</h2>
                <p className="sub">
                  Voilà le rendu réel : sobre, premium, orienté contact.
                  Survole — tu verras la finition.
                </p>
              </div>
            </Reveal>

            <div className="exGrid">
              <Reveal delay={0}>
                <ExampleCard
                  img="/site1euroeste.png"
                  title="Esthéticienne"
                  tag="Beauté • RDV"
                  city="Le Mans"
                />
              </Reveal>

              <Reveal delay={120}>
                <ExampleCard
                  img="/site1euroimmo.png"
                  title="Agent immobilier"
                  tag="Immo • Estimation"
                  city="Nantes"
                />
              </Reveal>

              <Reveal delay={240}>
                <ExampleCard
                  img="/site1euroarti.png"
                  title="Artisan"
                  tag="Devis • Intervention"
                  city="Angers"
                />
              </Reveal>
            </div>

            <Reveal delay={220}>
              <div className="center">
                <a className="ctaPrimary" href="/builder">
                  Je crée mon site (1€)
                </a>
                <div className="micro">Même rendu, adapté à ton métier + ville.</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROCESS */}
        <section id="process" className="section">
          <div className="wrap">
            <Reveal>
              <div className="head">
                <h2 className="h2">Process ultra simple</h2>
                <p className="sub">
                  Pas de prise de tête : tu remplis → on génère → tu reçois l’URL.
                </p>
              </div>
            </Reveal>

            <div className="steps">
              <Reveal delay={0}>
                <div className="step">
                  <div className="stepN">1</div>
                  <h3>Tu réponds à 6 questions</h3>
                  <p>Métier, ville, nom, téléphone/email, description courte.</p>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="step">
                  <div className="stepN">2</div>
                  <h3>On fabrique un design premium</h3>
                  <p>Image IA + structure “qui convertit” + contact clair.</p>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="step">
                  <div className="stepN">3</div>
                  <h3>Tu reçois l’URL par mail</h3>
                  <p>Ton site est en ligne. Tu peux le partager immédiatement.</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={240}>
              <div className="banner">
                <div>
                  <div className="bannerT">Tu veux capter plus de demandes ?</div>
                  <div className="bannerS">
                    Ajoute Betty ensuite : réponse 24/7 + leads qualifiés.
                  </div>
                </div>
                <div className="bannerBtns">
                  <a className="ctaPrimary" href="/builder">
                    Démarrer
                  </a>
                  <a className="ctaGhost" href="#faq">
                    Voir la FAQ
                  </a>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PREUVES / RÉASSURANCE */}
        <section id="preuves" className="section alt">
          <div className="wrap">
            <Reveal>
              <div className="head">
                <h2 className="h2">Preuves & réassurance</h2>
                <p className="sub">
                  Landing pro = confiance. Confiance = demandes. Et à 1€, tu peux tester sans stress.
                </p>
              </div>
            </Reveal>

            <div className="proofs">
              <Reveal delay={0}>
                <div className="proofCard">
                  <div className="proofIcon">🔒</div>
                  <div className="proofTitle">Stripe</div>
                  <div className="proofText">Paiement sécurisé, facturation mensuelle, annulation immédiate.</div>
                </div>
              </Reveal>

              <Reveal delay={120}>
                <div className="proofCard">
                  <div className="proofIcon">⚡</div>
                  <div className="proofTitle">Rapide & clair</div>
                  <div className="proofText">Une page qui va droit au but, optimisée “contact”.</div>
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="proofCard">
                  <div className="proofIcon">🎯</div>
                  <div className="proofTitle">Adapté au métier</div>
                  <div className="proofText">Titres, ton, structure : calibrés pour ton activité et ta ville.</div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="section">
          <div className="wrap">
            <Reveal>
              <div className="head">
                <h2 className="h2">FAQ</h2>
                <p className="sub">Réponses nettes, sans flou.</p>
              </div>
            </Reveal>

            <div className="faq">
              <Reveal delay={0}>
                <details className="qa">
                  <summary>Pourquoi 1€ ? C’est sérieux ?</summary>
                  <div className="qaBody">
                    Oui. C’est une offre d’entrée ultra simple : tu testes, tu gardes si ça t’apporte
                    une présence pro. Sans engagement, résiliable.
                  </div>
                </details>
              </Reveal>

              <Reveal delay={80}>
                <details className="qa">
                  <summary>Je reçois l’URL quand ?</summary>
                  <div className="qaBody">
                    Après création via le builder : tu reçois ton lien par email (et tu peux le partager immédiatement).
                  </div>
                </details>
              </Reveal>

              <Reveal delay={160}>
                <details className="qa">
                  <summary>Est-ce que je peux mettre Betty sur mon site ensuite ?</summary>
                  <div className="qaBody">
                    Oui. C’est l’upgrade naturel : Betty répond 24/7 et qualifie les demandes (nom/email/téléphone/besoin).
                  </div>
                </details>
              </Reveal>

              <Reveal delay={240}>
                <details className="qa">
                  <summary>Je peux arrêter quand je veux ?</summary>
                  <div className="qaBody">
                    Oui. C’est mensuel, annulable à tout moment.
                  </div>
                </details>
              </Reveal>
            </div>

            <Reveal delay={240}>
              <div className="center">
                <a className="ctaPrimary" href="/builder">
                  Ok, je le fais (1€)
                </a>
                <div className="micro">Tu peux avoir quelque chose de propre aujourd’hui.</div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOT */}
        <footer className="footer">
          <div className="wrap footInner">
            <div>
              <div className="footBrand">Spectra Media AI</div>
              <div className="footSub">
                Sites vitrines premium + option IA • Pensé pour TPE, indépendants, artisans.
              </div>
            </div>
            <div className="footLinks">
              <a href="#exemples">Exemples</a>
              <a href="#process">Process</a>
              <a href="#faq">FAQ</a>
              <a href="mailto:spectramediabots@gmail.com">Contact</a>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        :root{
          --bg0:#020617;
          --bg1:#070a18;
          --card: rgba(255,255,255,.06);
          --line: rgba(148,163,184,.18);
          --text: #e5e7eb;
          --muted: rgba(226,232,240,.78);
          --shadow: 0 26px 95px rgba(0,0,0,.55);
        }

        *{box-sizing:border-box}
        html,body{margin:0;padding:0;background:var(--bg0);color:var(--text)}
        a{color:inherit}
        .wrap{max-width:1160px;margin:0 auto;padding:0 22px}
        .page{
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
        }

        /* Smooth anchors */
        html{scroll-behavior:smooth}

        /* NAV */
        .nav{
          position:sticky; top:0; z-index:50;
          background: rgba(2,6,23,.72);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(12px);
        }
        .navInner{display:flex;align-items:center;justify-content:space-between;padding:14px 0;gap:14px}
        .brand{display:flex;align-items:center;gap:12px;text-decoration:none;min-width:240px}
        .logo{
          width:44px;height:44px;border-radius:14px;
          border:1px solid rgba(148,163,184,.18);
          background: rgba(255,255,255,.04);
          padding:6px; object-fit:contain;
          box-shadow: 0 12px 40px rgba(0,0,0,.35);
        }
        .brandName{font-weight:980;letter-spacing:-.02em}
        .brandSub{font-size:12px;opacity:.78;margin-top:2px}
        .links{display:flex;align-items:center;gap:14px;flex-wrap:wrap;justify-content:flex-end}
        .links a{
          text-decoration:none;
          font-size:13px;
          opacity:.86;
          padding:8px 10px;
          border-radius:999px;
          border:1px solid transparent;
          transition: filter .15s ease, background .15s ease, border-color .15s ease;
        }
        .links a:hover{opacity:1;border-color:rgba(148,163,184,.16);background:rgba(255,255,255,.04);filter:brightness(1.03)}
        .ctaNav{
          font-weight:950;
          border:1px solid rgba(250,204,21,.35) !important;
          background: linear-gradient(90deg, rgba(250,204,21,.18), rgba(251,113,133,.14), rgba(59,130,246,.14)) !important;
          box-shadow: 0 18px 55px rgba(0,0,0,.35);
        }

        @media (max-width: 980px){
          .navInner{flex-direction:column;align-items:flex-start}
          .links{justify-content:flex-start}
        }

        /* HERO */
        .hero{
          position:relative;
          padding: 58px 0 30px;
          border-bottom: 1px solid rgba(148,163,184,.10);
          overflow:hidden;
          background:
            radial-gradient(circle at 10% 12%, rgba(34,211,238,.24), transparent 52%),
            radial-gradient(circle at 85% 18%, rgba(236,72,153,.18), transparent 54%),
            radial-gradient(circle at 35% 120%, rgba(250,204,21,.14), transparent 55%),
            linear-gradient(180deg, rgba(7,10,24,1), rgba(2,6,23,.88));
        }
        .bg{
          position:absolute; inset:-140px;
          background:
            radial-gradient(circle at 30% 30%, rgba(255,255,255,.12), transparent 42%),
            radial-gradient(circle at 70% 35%, rgba(255,255,255,.08), transparent 46%);
          filter: blur(2px);
          pointer-events:none;
          animation: slowFloat 8s ease-in-out infinite;
          opacity:.85;
        }
        .noise{
          position:absolute; inset:0;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='210' height='210'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='210' height='210' filter='url(%23n)' opacity='.14'/%3E%3C/svg%3E");
          mix-blend-mode: overlay;
          opacity:.22;
          pointer-events:none;
        }
        @keyframes slowFloat{
          0%,100%{transform: translate3d(0,0,0) scale(1)}
          50%{transform: translate3d(0,10px,0) scale(1.02)}
        }

        .heroGrid{
          position:relative;
          display:grid;
          grid-template-columns: 1.08fr .92fr;
          gap: 22px;
          align-items:start;
        }
        @media (max-width: 980px){
          .heroGrid{grid-template-columns:1fr}
        }

        .kickers{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-bottom:12px}
        .kicker{
          display:inline-flex;align-items:center;gap:10px;
          font-size:12px;letter-spacing:.14em;text-transform:uppercase;
          border:1px solid rgba(148,163,184,.18);
          background: rgba(255,255,255,.04);
          padding: 9px 12px;
          border-radius: 999px;
        }
        .spark{
          width:16px;height:16px;border-radius:999px;
          background: radial-gradient(circle at 30% 30%, #fff, #facc15 55%, #fb7185 100%);
          box-shadow: 0 0 0 6px rgba(250,204,21,.12);
          animation: pop 2.6s ease-in-out infinite;
        }
        @keyframes pop{0%,100%{transform:scale(1)}50%{transform:scale(1.08)}}
        .pill{
          font-size:12px;opacity:.86;
          padding:9px 11px;border-radius:999px;
          border:1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.03);
        }

        .h1{
          margin: 6px 0 12px;
          font-size: clamp(2.4rem, 4.6vw, 3.65rem);
          line-height: 1.02;
          letter-spacing:-0.045em;
          font-weight: 990;
        }
        .grad{
          background: linear-gradient(90deg,#facc15,#fb7185,#3b82f6);
          -webkit-background-clip:text;background-clip:text;color:transparent;
        }
        .price{
          display:inline-flex;align-items:baseline;gap:8px;
          padding: 6px 12px;
          border-radius: 16px;
          background: rgba(250,204,21,.12);
          border: 1px solid rgba(250,204,21,.24);
          box-shadow: 0 20px 65px rgba(0,0,0,.40);
        }
        .per{font-size:14px;opacity:.85;font-weight:900}

        .lead{
          max-width: 680px;
          font-size: 16px;
          line-height: 1.6;
          opacity: .92;
          color: rgba(226,232,240,.88);
          margin: 0 0 16px;
        }

        .ctaRow{display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-top:10px}
        .ctaPrimary{
          text-decoration:none;
          font-weight: 980;
          font-size: 14px;
          padding: 14px 18px;
          border-radius: 999px;
          color: #06121d;
          background: linear-gradient(90deg,#22c55e,#3b82f6,#ec4899);
          box-shadow: var(--shadow);
          transition: transform .15s ease, filter .15s ease;
        }
        .ctaPrimary:hover{transform: translateY(-2px); filter: brightness(1.05)}
        .ctaGhost{
          text-decoration:none;
          font-weight: 930;
          font-size: 14px;
          padding: 14px 18px;
          border-radius: 999px;
          border: 1px solid rgba(148,163,184,.18);
          background: rgba(255,255,255,.04);
          color: rgba(226,232,240,.92);
          transition: transform .15s ease, filter .15s ease;
        }
        .ctaGhost:hover{transform: translateY(-2px); filter: brightness(1.05)}
        .micro{margin-top:10px;font-size:12px;opacity:.78}
        .trustRow{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
        .trust{
          font-size:13px;
          padding:10px 12px;
          border-radius:14px;
          border:1px solid rgba(148,163,184,.14);
          background: rgba(255,255,255,.03);
          box-shadow: 0 18px 55px rgba(0,0,0,.20);
        }

        /* Device mock */
        .stack{display:flex;flex-direction:column;gap:12px}
        .device{
          border-radius: 24px;
          border: 1px solid rgba(148,163,184,.20);
          background: rgba(255,255,255,.04);
          box-shadow: var(--shadow);
          overflow:hidden;
          position:relative;
          transform: translateZ(0);
        }
        .deviceTop{
          display:flex;align-items:center;gap:12px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(148,163,184,.14);
          background: rgba(2,6,23,.55);
        }
        .dots{display:flex;gap:7px}
        .dots span{width:10px;height:10px;border-radius:999px;opacity:.92}
        .dots span:nth-child(1){background:#fb7185}
        .dots span:nth-child(2){background:#facc15}
        .dots span:nth-child(3){background:#22c55e}
        .url{font-size:12px;opacity:.78;flex:1}
        .live{
          font-size:11px;
          font-weight:980;
          letter-spacing:.14em;
          padding:7px 10px;
          border-radius:999px;
          border:1px solid rgba(34,211,238,.26);
          background: rgba(34,211,238,.10);
        }
        .deviceBody{padding: 14px}
        .heroMock{
          height: 220px;
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,.14);
          background:
            radial-gradient(circle at 20% 20%, rgba(59,130,246,.22), transparent 55%),
            radial-gradient(circle at 88% 35%, rgba(236,72,153,.18), transparent 60%),
            radial-gradient(circle at 40% 110%, rgba(250,204,21,.12), transparent 60%),
            linear-gradient(135deg, rgba(0,0,0,.62), rgba(0,0,0,.20));
          position:relative;
          overflow:hidden;
        }
        .heroMockShade{
          position:absolute; inset:0;
          background: linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.78));
        }
        .heroMockTxt{
          position:absolute; left:0; right:0; bottom:0;
          padding: 14px;
        }
        .mockTitle{font-weight:980;letter-spacing:-.02em}
        .mockSub{font-size:12px;opacity:.82;margin-top:4px}
        .mockBtns{display:flex;gap:10px;margin-top:10px;flex-wrap:wrap}
        .mockBtn{
          display:inline-flex;align-items:center;justify-content:center;
          padding: 9px 11px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 930;
          background: rgba(250,204,21,.18);
          border: 1px solid rgba(250,204,21,.22);
        }
        .mockBtn.ghost{
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(148,163,184,.16);
        }
        .bullets{
          margin-top: 12px;
          display:grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;
        }
        .bullet{
          font-size:13px;
          padding: 10px 12px;
          border-radius: 14px;
          border: 1px solid rgba(148,163,184,.14);
          background: rgba(255,255,255,.03);
          display:flex;gap:8px;align-items:center;
        }
        .bullet b{opacity:.9}
        .shine{
          position:absolute; inset:-40px;
          background: radial-gradient(circle at 25% 20%, rgba(255,255,255,.18), transparent 45%);
          transform: translateX(-45%);
          animation: shine 3.2s ease-in-out infinite;
          pointer-events:none;
        }
        @keyframes shine{
          0%,100%{transform:translateX(-55%) rotate(8deg);opacity:.25}
          50%{transform:translateX(35%) rotate(8deg);opacity:.50}
        }

        .kpis{
          display:grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
        }
        .kpi{
          border-radius: 18px;
          border:1px solid rgba(148,163,184,.14);
          background: rgba(255,255,255,.03);
          padding: 12px;
          text-align:center;
          box-shadow: 0 18px 55px rgba(0,0,0,.20);
        }
        .kpiN{font-size:18px;font-weight:980;letter-spacing:-.02em}
        .kpiL{font-size:12px;opacity:.78;margin-top:4px}

        /* Sticky CTA */
        .sticky{
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 60;
          pointer-events:none;
        }
        .stickyBtn{
          pointer-events:auto;
          display:inline-flex;align-items:center;gap:10px;
          text-decoration:none;
          font-weight:980;
          font-size:13px;
          padding: 12px 14px;
          border-radius: 999px;
          border:1px solid rgba(250,204,21,.28);
          background: linear-gradient(90deg, rgba(250,204,21,.20), rgba(251,113,133,.14), rgba(59,130,246,.14));
          box-shadow: 0 18px 60px rgba(0,0,0,.45);
          transition: transform .15s ease, filter .15s ease;
        }
        .stickyBtn:hover{transform: translateY(-2px); filter:brightness(1.06)}
        .stickyStar{
          width:18px;height:18px;display:inline-block;
          background: radial-gradient(circle at 30% 30%, #fff, #facc15 55%, #fb7185 100%);
          clip-path: polygon(50% 0%, 61% 26%, 89% 28%, 68% 45%, 76% 72%, 50% 57%, 24% 72%, 32% 45%, 11% 28%, 39% 26%);
          filter: drop-shadow(0 6px 12px rgba(0,0,0,.25));
          animation: starPop 2.6s ease-in-out infinite;
        }
        @keyframes starPop{0%,100%{transform:rotate(0) scale(1)}50%{transform:rotate(-6deg) scale(1.06)}}
        @media (max-width: 720px){
          .sticky{left: 12px; right: 12px; bottom: 12px;}
          .stickyBtn{width:100%; justify-content:center;}
        }

        /* Sections */
        .section{padding: 54px 0; border-bottom: 1px solid rgba(148,163,184,.10);}
        .section.alt{
          background:
            radial-gradient(circle at 12% 20%, rgba(250,204,21,.10), transparent 55%),
            radial-gradient(circle at 88% 70%, rgba(59,130,246,.10), transparent 55%),
            rgba(2,6,23,.55);
        }
        .head{display:flex;flex-direction:column;gap:8px;margin-bottom:18px}
        .h2{margin:0;font-size:28px;letter-spacing:-.02em;font-weight:990}
        .sub{margin:0;opacity:.84;max-width:880px;line-height:1.55}

        /* EXAMPLES */
        .exGrid{
          display:grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 14px;
        }
        @media (max-width: 980px){ .exGrid{grid-template-columns:1fr;} }

        .exCard{
          text-decoration:none;
          border-radius: 26px;
          overflow:hidden;
          border: 1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.03);
          box-shadow: 0 22px 80px rgba(0,0,0,.35);
          transform: translateZ(0);
          transition: transform .18s ease, filter .18s ease;
        }
        .exCard:hover{transform: translateY(-4px); filter: brightness(1.04);}
        .exMedia{position:relative; height: 360px;}
        .exMedia img{
          width:100%; height:100%;
          object-fit: cover;
          display:block;
          transform: scale(1.02);
          transition: transform .35s ease;
        }
        .exCard:hover .exMedia img{transform: scale(1.06);}
        .exGlow{
          position:absolute; inset:-40px;
          background:
            radial-gradient(circle at 20% 20%, rgba(34,211,238,.18), transparent 45%),
            radial-gradient(circle at 85% 35%, rgba(236,72,153,.14), transparent 55%),
            radial-gradient(circle at 40% 110%, rgba(250,204,21,.10), transparent 55%);
          opacity:.75;
          pointer-events:none;
        }
        .exOverlay{
          position:absolute; inset:0;
          display:flex; flex-direction:column;
          justify-content:space-between;
          padding: 14px;
          background: linear-gradient(180deg, rgba(0,0,0,.06), rgba(0,0,0,.78));
        }
        .exTop{display:flex;gap:10px;flex-wrap:wrap}
        .chip{
          font-size:11px;
          font-weight:980;
          letter-spacing:.14em;
          text-transform:uppercase;
          padding:7px 10px;
          border-radius:999px;
          border:1px solid rgba(250,204,21,.28);
          background: rgba(250,204,21,.12);
        }
        .chip.ghost{
          border:1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.04);
          opacity:.9;
        }
        .exBottom{display:flex;flex-direction:column;gap:8px}
        .exTitle{font-weight:990;letter-spacing:-.02em;font-size:16px}
        .exMeta{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:12px;opacity:.88}
        .tag{
          padding:6px 10px;border-radius:999px;
          border:1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.04);
        }
        .dot{width:4px;height:4px;border-radius:999px;background:rgba(226,232,240,.75)}
        .city{opacity:.9}
        .exCtaRow{display:flex;gap:10px;flex-wrap:wrap;margin-top:2px}
        .miniBtn{
          font-size:12px;
          font-weight:930;
          padding:8px 10px;
          border-radius:999px;
          border:1px solid rgba(250,204,21,.22);
          background: rgba(250,204,21,.12);
        }
        .miniBtn.ghost{
          border:1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.04);
        }

        .center{margin-top:18px;text-align:center}
        .center .micro{margin-top:10px}

        /* Steps */
        .steps{
          display:grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 12px;
        }
        @media (max-width: 980px){ .steps{grid-template-columns:1fr;} }
        .step{
          border-radius: 22px;
          border: 1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.03);
          padding: 16px;
          box-shadow: 0 18px 55px rgba(0,0,0,.25);
          position:relative;
          overflow:hidden;
        }
        .step:before{
          content:"";
          position:absolute; inset:-40px;
          background:
            radial-gradient(circle at 30% 20%, rgba(250,204,21,.12), transparent 55%),
            radial-gradient(circle at 80% 70%, rgba(34,211,238,.10), transparent 55%);
          pointer-events:none;
        }
        .stepN{
          width:40px;height:40px;border-radius:14px;
          display:flex;align-items:center;justify-content:center;
          font-weight:990;
          background: rgba(34,211,238,.12);
          border: 1px solid rgba(34,211,238,.22);
          margin-bottom: 10px;
          position:relative;
        }
        .step h3{margin:0 0 6px;font-size:16px;font-weight:990;position:relative}
        .step p{margin:0;opacity:.86;line-height:1.5;font-size:13px;position:relative}

        /* Banner */
        .banner{
          margin-top: 18px;
          border-radius: 24px;
          border: 1px solid rgba(148,163,184,.18);
          background:
            radial-gradient(circle at 12% 25%, rgba(34,211,238,.14), transparent 55%),
            radial-gradient(circle at 88% 75%, rgba(236,72,153,.12), transparent 55%),
            rgba(255,255,255,.03);
          padding: 16px;
          display:flex; gap:14px; align-items:center; justify-content:space-between;
          flex-wrap:wrap;
          box-shadow: 0 24px 90px rgba(0,0,0,.35);
        }
        .bannerT{font-weight:990;letter-spacing:-.02em}
        .bannerS{font-size:13px;opacity:.84;margin-top:4px}
        .bannerBtns{display:flex;gap:10px;flex-wrap:wrap}

        /* Proof cards */
        .proofs{
          display:grid;
          grid-template-columns: repeat(3, minmax(0,1fr));
          gap: 12px;
        }
        @media (max-width: 980px){ .proofs{grid-template-columns:1fr;} }
        .proofCard{
          border-radius: 22px;
          border: 1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.03);
          padding: 16px;
          box-shadow: 0 18px 55px rgba(0,0,0,.25);
        }
        .proofIcon{font-size:18px}
        .proofTitle{margin-top:10px;font-weight:990}
        .proofText{margin-top:6px;font-size:13px;opacity:.86;line-height:1.5}

        /* FAQ */
        .faq{display:grid;gap:10px;max-width: 920px}
        .qa{
          border-radius: 18px;
          border: 1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.03);
          padding: 12px 14px;
          box-shadow: 0 18px 55px rgba(0,0,0,.18);
        }
        .qa summary{cursor:pointer;font-weight:990;letter-spacing:-.01em}
        .qaBody{margin-top:10px;opacity:.86;line-height:1.55;font-size:13px}

        /* Footer */
        .footer{
          padding: 26px 0;
          border-top: 1px solid rgba(148,163,184,.12);
          background: rgba(2,6,23,.78);
        }
        .footInner{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .footBrand{font-weight:990}
        .footSub{font-size:12px;opacity:.78;margin-top:6px;max-width:560px}
        .footLinks{display:flex;gap:12px;flex-wrap:wrap}
        .footLinks a{
          text-decoration:none;
          font-size:13px;
          opacity:.84;
          padding:8px 10px;
          border-radius:999px;
          border:1px solid rgba(148,163,184,.14);
          background: rgba(255,255,255,.03);
        }
        .footLinks a:hover{opacity:1;filter:brightness(1.05)}

        /* Reveal animation */
        .reveal{
          opacity: 0;
          transform: translateY(14px);
          transition:
            opacity 600ms ease var(--d),
            transform 700ms cubic-bezier(.2,.8,.2,1) var(--d);
          will-change: opacity, transform;
        }
        .reveal.in{
          opacity: 1;
          transform: translateY(0);
        }

        /* Reduce motion */
        @media (prefers-reduced-motion: reduce){
          .bg,.shine,.stickyStar,.spark{animation:none !important}
          html{scroll-behavior:auto}
          .reveal{opacity:1 !important; transform:none !important; transition:none !important}
          .exCard,.ctaPrimary,.ctaGhost,.stickyBtn{transition:none !important}
        }
      `}</style>
    </>
  );
}
