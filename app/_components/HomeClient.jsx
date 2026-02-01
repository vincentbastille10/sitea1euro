// app/_components/HomeClient.jsx
"use client";

import { useEffect, useRef, useState } from "react";

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

function Reveal({ children, delay = 0, className = "" }) {
  const ref = useRef(null);
  const [ok, setOk] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return setOk(true);
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setOk(true);
          io.disconnect();
        }
      },
      { threshold: 0.14 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <div
      ref={ref}
      className={`rv ${ok ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
    >
      {children}
    </div>
  );
}

function MiniExample({ img, label }) {
  return (
    <a className="miniCard" href="/builder" aria-label={`Créer mon site (${label})`}>
      <div className="miniMedia">
        <img src={img} alt={`Exemple ${label}`} loading="lazy" />
        <div className="miniShade" aria-hidden="true" />
        <div className="miniCap">{label}</div>
      </div>
    </a>
  );
}

export default function HomeClient() {
  return (
    <>
      <main className="page">
        {/* TOP BAR */}
        <header className="top">
          <div className="wrap topInner">
            <a className="brand" href="/" aria-label="Spectra Media AI">
              <img className="logo" src="/spectra_media_logo.png" alt="Spectra Media AI" />
              <div className="brandTxt">
                <div className="brandName">Spectra Media AI</div>
                <div className="brandSub">Site vitrine premium • option Betty IA</div>
              </div>
            </a>

            <nav className="nav">
              <a href="#exemples">Exemples</a>
              <a href="#comment">Comment ça marche</a>
              <a href="#faq">FAQ</a>
              <a className="btn btnSmall" href="/builder">
                Créer mon site
              </a>
            </nav>
          </div>
        </header>

        {/* HERO */}
        <section className="hero">
          <div className="wrap heroGrid">
            <div className="heroLeft">
              <Reveal delay={0}>
                <div className="badgeRow">
                  <span className="badge">Offre transparente</span>
                  <span className="badge ghost">Sans engagement</span>
                  <span className="badge ghost">Stripe</span>
                </div>
              </Reveal>

              <Reveal delay={60}>
                <h1 className="h1">
                  Un site <span className="grad">vraiment pro</span>
                  <br />
                  pour <span className="price">1€ / mois</span>
                </h1>
              </Reveal>

              <Reveal delay={120}>
                <p className="lead">
                  Tu réponds à quelques questions → on génère un design propre et une image de fond →
                  tu reçois ton URL. Clair, élégant, orienté “contact”.
                </p>
              </Reveal>

              <Reveal delay={180}>
                <div className="ctaRow">
                  <a className="btn" href="/builder">
                    Créer mon site (1€)
                  </a>
                  <a className="btn ghost" href="#exemples">
                    Voir des exemples
                  </a>
                </div>
                <div className="micro">
                  Paiement mensuel • Annulable à tout moment • Envoi automatique par email
                </div>
              </Reveal>

              <Reveal delay={240}>
                <div className="checks">
                  <div className="check">✅ Mise en page premium</div>
                  <div className="check">✅ Contact visible + action</div>
                  <div className="check">✅ Adapté métier + ville</div>
                </div>
              </Reveal>
            </div>

            <div className="heroRight">
              <Reveal delay={120}>
                <div className="heroCard">
                  <div className="heroCardTop">
                    <div className="dotRow" aria-hidden="true">
                      <span />
                      <span />
                      <span />
                    </div>
                    <span className="chip">APERÇU</span>
                  </div>

                  <div className="heroMock">
                    <div className="mockTitle">Nom de votre activité</div>
                    <div className="mockSub">Métier • Ville</div>
                    <div className="mockBtns">
                      <span className="mockBtn">Appeler</span>
                      <span className="mockBtn ghost">Devis</span>
                    </div>
                  </div>

                  <div className="heroList">
                    <div className="li">✔ Texte clair, alignements propres</div>
                    <div className="li">✔ CTA visibles (appel / devis)</div>
                    <div className="li">✔ Image IA cohérente</div>
                    <div className="li">＋ Option Betty (assistante IA)</div>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* EXAMPLES (mini slider) */}
        <section id="exemples" className="sec">
          <div className="wrap">
            <Reveal>
              <div className="secHead">
                <h2>Exemples</h2>
                <p>Mini slider discret (petit format) pour donner l’idée sans exposer les détails.</p>
              </div>
            </Reveal>

            <Reveal delay={80}>
              <div className="slider" aria-label="Exemples de sites">
                <MiniExample img="/site1euroeste.png" label="Esthéticienne" />
                <MiniExample img="/site1euroimmo.png" label="Immobilier" />
                <MiniExample img="/site1euroarti.png" label="Artisan" />
                <div className="miniHint">
                  <div className="miniHintBox">
                    <div className="miniHintT">→ Glisse</div>
                    <div className="miniHintS">ou scroll horizontal</div>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="secCta">
                <a className="btn" href="/builder">
                  Je crée le mien
                </a>
                <span className="micro">Même rendu, adapté à ton métier + ville.</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* HOW */}
        <section id="comment" className="sec alt">
          <div className="wrap">
            <Reveal>
              <div className="secHead">
                <h2>Comment ça marche</h2>
                <p>Simple, rapide, propre.</p>
              </div>
            </Reveal>

            <div className="steps">
              <Reveal delay={0}>
                <div className="step">
                  <div className="n">1</div>
                  <h3>Tu réponds</h3>
                  <p>Métier, ville, nom, téléphone/email, texte court.</p>
                </div>
              </Reveal>
              <Reveal delay={80}>
                <div className="step">
                  <div className="n">2</div>
                  <h3>On génère</h3>
                  <p>Design premium + image IA + structure orientée contact.</p>
                </div>
              </Reveal>
              <Reveal delay={160}>
                <div className="step">
                  <div className="n">3</div>
                  <h3>Tu reçois l’URL</h3>
                  <p>Ton site est en ligne, partage immédiat.</p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={200}>
              <div className="banner">
                <div>
                  <div className="bannerT">Option Betty (assistante IA)</div>
                  <div className="bannerS">Répond 24/7 + récupère des leads qualifiés.</div>
                </div>
                <a className="btn" href="/builder">
                  Démarrer
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="sec">
          <div className="wrap">
            <Reveal>
              <div className="secHead">
                <h2>FAQ</h2>
                <p>Réponses nettes, pas de blabla.</p>
              </div>
            </Reveal>

            <div className="faq">
              <Reveal delay={0}>
                <details className="qa">
                  <summary>Pourquoi 1€ ?</summary>
                  <div className="a">
                    Offre d’entrée pour tester sans stress. Tu gardes si ça te plaît. Tu arrêtes quand tu veux.
                  </div>
                </details>
              </Reveal>

              <Reveal delay={60}>
                <details className="qa">
                  <summary>Je reçois l’URL quand ?</summary>
                  <div className="a">Après le builder : email envoyé avec ton lien.</div>
                </details>
              </Reveal>

              <Reveal delay={120}>
                <details className="qa">
                  <summary>Je peux ajouter Betty ensuite ?</summary>
                  <div className="a">Oui : réponses 24/7 + collecte nom/email/téléphone/besoin.</div>
                </details>
              </Reveal>
            </div>

            <Reveal delay={160}>
              <div className="secCta">
                <a className="btn" href="/builder">
                  OK, je le fais
                </a>
                <span className="micro">Objectif : pro + simple + efficace.</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* FOOT */}
        <footer className="foot">
          <div className="wrap footInner">
            <div>
              <div className="footBrand">Spectra Media AI</div>
              <div className="footSub">Sites vitrines premium • option IA • pensé pour TPE</div>
            </div>
            <div className="footLinks">
              <a href="#exemples">Exemples</a>
              <a href="#comment">Process</a>
              <a href="#faq">FAQ</a>
            </div>
          </div>
        </footer>
      </main>

      <style jsx global>{`
        :root{
          --bg:#070a12;
          --panel: rgba(255,255,255,.06);
          --line: rgba(148,163,184,.18);
          --txt: rgba(255,255,255,.92);
          --muted: rgba(255,255,255,.68);
          --shadow: 0 22px 70px rgba(0,0,0,.45);
        }
        *{box-sizing:border-box}
        html,body{margin:0;padding:0;background:var(--bg);color:var(--txt);font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial}
        a{color:inherit}
        .wrap{max-width:1120px;margin:0 auto;padding:0 20px}
        .page{min-height:100vh}

        /* Top */
        .top{
          position:sticky; top:0; z-index:50;
          background: rgba(7,10,18,.72);
          border-bottom: 1px solid var(--line);
          backdrop-filter: blur(10px);
        }
        .topInner{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:14px 0}
        .brand{display:flex;align-items:center;gap:12px;text-decoration:none}
        .logo{width:40px;height:40px;border-radius:14px;background:rgba(255,255,255,.04);border:1px solid var(--line);padding:6px;object-fit:contain}
        .brandName{font-weight:900;letter-spacing:-.02em}
        .brandSub{font-size:12px;color:var(--muted)}
        .nav{display:flex;gap:12px;align-items:center;flex-wrap:wrap;justify-content:flex-end}
        .nav a{font-size:13px;text-decoration:none;color:var(--muted);padding:8px 10px;border-radius:999px}
        .nav a:hover{color:var(--txt);background:rgba(255,255,255,.04)}
        @media (max-width:860px){
          .topInner{flex-direction:column;align-items:flex-start}
          .nav{justify-content:flex-start}
        }

        /* Buttons */
        .btn{
          display:inline-flex;align-items:center;justify-content:center;
          text-decoration:none;font-weight:900;font-size:14px;
          padding:12px 16px;border-radius:999px;
          color:#071018;
          background: linear-gradient(90deg,#22c55e,#3b82f6,#ec4899);
          box-shadow: var(--shadow);
          transition: transform .15s ease, filter .15s ease;
          border: none;
        }
        .btn:hover{transform: translateY(-2px); filter: brightness(1.05)}
        .btn.ghost{
          color:var(--txt);
          background: rgba(255,255,255,.04);
          border: 1px solid var(--line);
          box-shadow:none;
        }
        .btnSmall{padding:10px 14px;font-size:13px}

        /* Hero */
        .hero{
          padding: 44px 0 10px;
          background:
            radial-gradient(circle at 12% 10%, rgba(59,130,246,.22), transparent 50%),
            radial-gradient(circle at 82% 20%, rgba(236,72,153,.18), transparent 50%),
            radial-gradient(circle at 40% 100%, rgba(34,197,94,.14), transparent 55%);
          border-bottom: 1px solid rgba(148,163,184,.10);
        }
        .heroGrid{
          display:grid;
          grid-template-columns: 1.15fr .85fr;
          gap: 22px;
          align-items:start;
        }
        @media (max-width:980px){ .heroGrid{grid-template-columns:1fr} }

        .badgeRow{display:flex;gap:10px;flex-wrap:wrap;margin-bottom:14px}
        .badge{
          font-size:12px;font-weight:900;letter-spacing:.12em;text-transform:uppercase;
          padding:8px 10px;border-radius:999px;
          border:1px solid rgba(250,204,21,.30);
          background: rgba(250,204,21,.12);
        }
        .badge.ghost{border:1px solid var(--line);background: rgba(255,255,255,.04);color:var(--muted);letter-spacing:.08em}
        .h1{
          margin:0 0 10px;
          font-size: clamp(2.1rem, 4.2vw, 3.2rem);
          line-height: 1.05;
          letter-spacing: -.045em;
          font-weight: 950;
        }
        .grad{
          background: linear-gradient(90deg,#facc15,#fb7185,#3b82f6);
          -webkit-background-clip:text;background-clip:text;color:transparent;
        }
        .price{
          display:inline-block;
          padding: 4px 10px;
          border-radius: 14px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(148,163,184,.22);
        }
        .lead{margin:0 0 14px;color:var(--muted);line-height:1.6;font-size:16px;max-width:56ch}
        .ctaRow{display:flex;gap:10px;flex-wrap:wrap;margin-top:4px}
        .micro{margin-top:10px;color:var(--muted);font-size:12px}
        .checks{display:flex;flex-wrap:wrap;gap:10px;margin-top:14px}
        .check{
          padding:10px 12px;border-radius:14px;
          border:1px solid rgba(148,163,184,.18);
          background: rgba(255,255,255,.03);
          color: rgba(255,255,255,.86);
          font-size:13px;
        }

        .heroCard{
          border-radius: 22px;
          border: 1px solid rgba(148,163,184,.20);
          background: rgba(255,255,255,.04);
          box-shadow: var(--shadow);
          overflow:hidden;
        }
        .heroCardTop{
          display:flex;align-items:center;justify-content:space-between;
          padding:12px 14px;
          border-bottom:1px solid rgba(148,163,184,.14);
          background: rgba(0,0,0,.18);
        }
        .dotRow{display:flex;gap:7px}
        .dotRow span{width:10px;height:10px;border-radius:999px}
        .dotRow span:nth-child(1){background:#fb7185}
        .dotRow span:nth-child(2){background:#facc15}
        .dotRow span:nth-child(3){background:#22c55e}
        .chip{
          font-size:11px;font-weight:900;letter-spacing:.14em;text-transform:uppercase;
          padding:7px 10px;border-radius:999px;border:1px solid rgba(148,163,184,.18);
          color: var(--muted);
          background: rgba(255,255,255,.03);
        }
        .heroMock{
          padding: 16px;
          background:
            linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,.18));
        }
        .mockTitle{font-weight:950;letter-spacing:-.02em}
        .mockSub{margin-top:4px;color:var(--muted);font-size:12px}
        .mockBtns{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}
        .mockBtn{
          font-size:12px;font-weight:900;
          padding:8px 10px;border-radius:999px;
          border:1px solid rgba(250,204,21,.28);
          background: rgba(250,204,21,.12);
        }
        .mockBtn.ghost{border:1px solid rgba(148,163,184,.18);background: rgba(255,255,255,.03);color:var(--muted)}
        .heroList{padding: 14px 16px;display:grid;gap:8px}
        .li{color: rgba(255,255,255,.82);font-size:13px}

        /* Sections */
        .sec{padding: 46px 0;border-bottom:1px solid rgba(148,163,184,.10)}
        .sec.alt{
          background: radial-gradient(circle at 10% 20%, rgba(250,204,21,.10), transparent 55%),
                      radial-gradient(circle at 90% 70%, rgba(59,130,246,.10), transparent 55%);
        }
        .secHead h2{margin:0;font-size:26px;letter-spacing:-.02em}
        .secHead p{margin:8px 0 0;color:var(--muted);max-width:70ch;line-height:1.6}
        .secCta{margin-top:16px;display:flex;gap:12px;align-items:center;flex-wrap:wrap}

        /* MINI SLIDER (200x200) */
        .slider{
          margin-top: 18px;
          display:flex;
          gap:12px;
          overflow-x:auto;
          padding: 6px 2px 12px;
          scroll-snap-type:x mandatory;
          -webkit-overflow-scrolling: touch;
        }
        .slider::-webkit-scrollbar{height:10px}
        .slider::-webkit-scrollbar-thumb{background: rgba(255,255,255,.10);border-radius:999px}
        .miniCard{scroll-snap-align:start;text-decoration:none}
        .miniMedia{
          width:200px;height:200px; /* ≈ 5cm */
          border-radius: 18px;
          overflow:hidden;
          border:1px solid rgba(148,163,184,.18);
          background: rgba(255,255,255,.03);
          box-shadow: 0 16px 50px rgba(0,0,0,.35);
          position:relative;
          transform: translateZ(0);
          transition: transform .15s ease, filter .15s ease;
        }
        .miniMedia:hover{transform: translateY(-2px); filter: brightness(1.03)}
        .miniMedia img{width:100%;height:100%;object-fit:cover;display:block; transform: scale(1.02)}
        .miniShade{
          position:absolute; inset:0;
          background: linear-gradient(180deg, rgba(0,0,0,.00), rgba(0,0,0,.62));
          pointer-events:none;
        }
        .miniCap{
          position:absolute; left:10px; right:10px; bottom:10px;
          font-size:12px;font-weight:900;
          color: rgba(255,255,255,.92);
          letter-spacing:.02em;
          display:flex;justify-content:space-between;align-items:center;
        }
        .miniHint{flex:0 0 auto;display:flex;align-items:center}
        .miniHintBox{
          width:200px;height:200px;border-radius:18px;
          border:1px dashed rgba(148,163,184,.22);
          display:flex;flex-direction:column;justify-content:center;align-items:center;
          color: var(--muted); background: rgba(255,255,255,.02);
        }
        .miniHintT{font-weight:900}
        .miniHintS{font-size:12px;margin-top:4px}

        /* Steps */
        .steps{margin-top:18px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}
        @media (max-width:980px){ .steps{grid-template-columns:1fr} }
        .step{
          border-radius:18px;border:1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.03);
          padding:16px;
        }
        .step .n{
          width:34px;height:34px;border-radius:12px;
          display:flex;align-items:center;justify-content:center;
          font-weight:950;
          background: rgba(59,130,246,.14);
          border:1px solid rgba(59,130,246,.22);
          margin-bottom:10px;
        }
        .step h3{margin:0 0 6px}
        .step p{margin:0;color:var(--muted);line-height:1.55}

        /* Banner */
        .banner{
          margin-top:18px;
          border-radius:18px;border:1px solid rgba(148,163,184,.18);
          background: rgba(255,255,255,.03);
          padding:16px;
          display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap;
        }
        .bannerT{font-weight:950}
        .bannerS{margin-top:4px;color:var(--muted);font-size:13px}

        /* FAQ */
        .faq{margin-top:18px;display:grid;gap:10px;max-width:860px}
        .qa{
          border-radius:16px;border:1px solid rgba(148,163,184,.16);
          background: rgba(255,255,255,.03);
          padding: 12px 14px;
        }
        .qa summary{cursor:pointer;font-weight:900}
        .qa .a{margin-top:10px;color:var(--muted);line-height:1.6}

        /* Footer */
        .foot{padding: 22px 0}
        .footInner{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .footBrand{font-weight:950}
        .footSub{margin-top:6px;color:var(--muted);font-size:12px}
        .footLinks{display:flex;gap:12px;flex-wrap:wrap}
        .footLinks a{font-size:13px;color:var(--muted);text-decoration:none;padding:8px 10px;border-radius:999px}
        .footLinks a:hover{color:var(--txt);background: rgba(255,255,255,.04)}

        /* Reveal */
        .rv{opacity:0;transform: translateY(10px);transition: opacity 520ms ease var(--d), transform 650ms cubic-bezier(.2,.8,.2,1) var(--d)}
        .rv.in{opacity:1;transform: translateY(0)}
        @media (prefers-reduced-motion: reduce){
          .rv{opacity:1 !important;transform:none !important;transition:none !important}
          html{scroll-behavior:auto}
          .btn,.miniMedia{transition:none !important}
        }
      `}</style>
    </>
  );
}
