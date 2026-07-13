import { cache } from "react";
import { notFound } from "next/navigation";
import { getSiteBySlug } from "../../../lib/sites-db";
import { getMetierById, isMalePack } from "../../../lib/metiers";
import { getSiteState } from "../../../lib/site-access";

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
  const state = getSiteState(site);
  if (!state.accessible) {
    return {
      title: lang === "en" ? "Preview expired" : "Aperçu expiré",
      robots: { index: false, follow: false },
    };
  }
  const inWord = lang === "en" ? "in" : "à";
  const title = `${site.nom_enseigne} – ${site.metier_label || metier?.label || site.metier} ${inWord} ${site.ville}`;
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
    // Les aperçus commerciaux restent privés des moteurs. Le site devient
    // indexable automatiquement dès la confirmation Stripe.
    robots: { index: state.status === "active", follow: state.status === "active" },
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
  const nom = site.nom_enseigne;
  const ville = site.ville;
  const state = getSiteState(site);
  if (!state.accessible) {
    return <ExpiredSite site={site} lang={lang} suspended={state.status === "suspended"} />;
  }
  const act = site.metier_label || metier?.label || site.metier;
  const actLow = (act || "").toLowerCase();
  const en = lang === "en";
  // Genre de l'assistant selon l'avatar du pack → accord FR cohérent (site + widget).
  const male = isMalePack(metier?.pack);
  const asstFr = male ? "l’assistant" : "l’assistante"; // « Parler à … »
  const asstFrShort = male ? "assistant" : "assistante"; // « Votre …, à toute heure »

  const t = en
    ? {
        navContact: "Contact", navCta: "Talk to our assistant",
        heroEyebrow: `${act} · ${ville}`,
        heroSub: `Attentive, professional service in ${ville}, day and night.`,
        heroCta1: "Chat with our assistant", heroCta2: "Get in touch",
        aboutKicker: "About", aboutH: `Your ${actLow} in ${ville}`,
        aboutP: `${nom} puts genuine care and expertise at the service of its clients in ${ville}. From the first message to the finished result, every request is handled with attention, precision and reliability.`,
        featKicker: "Why us", featH: "Why clients trust us",
        f1H: "Available 24/7", f1P: "A question late at night or over the weekend? Our assistant answers right away.",
        f2H: `Rooted in ${ville}`, f2P: "A local, personal service that truly listens to your needs.",
        f3H: "No waiting", f3P: "Every request is picked up immediately — no opportunity slips through.",
        bettyH: "Your assistant, around the clock", bettyP: "Ask a question, request an appointment or a quote — Betty answers you instantly and passes your request along.",
        contactKicker: "Contact", contactH: "Get in touch",
        address: "Address", phone: "Phone", email: "Email",
        writeUs: "Prefer to write? Send a message", yourName: "Your name", yourEmail: "Your email",
        yourMessage: "Your message", send: "Send",
        bettyActivating: "Your assistant is being activated.", poweredBy: "Powered by Spectra Media",
      }
    : {
        navContact: "Contact", navCta: `Parler à ${asstFr}`,
        heroEyebrow: `${act} · ${ville}`,
        heroSub: `Un accompagnement attentif et professionnel à ${ville}.`,
        heroCta1: `Discuter avec ${asstFr}`, heroCta2: "Nous contacter",
        aboutKicker: "À propos", aboutH: `Votre ${actLow} à ${ville}`,
        aboutP: `${nom} met son savoir-faire et son sens du détail au service de ses client·es à ${ville}. Du premier échange à la réalisation, chaque demande est traitée avec soin, exigence et fiabilité.`,
        featKicker: "Nos atouts", featH: "Pourquoi nous faire confiance",
        f1H: "Disponible 24h/24", f1P: `Une question tard le soir ou le week-end ? Votre ${asstFrShort} vous répond immédiatement.`,
        f2H: `Ancré à ${ville}`, f2P: "Un service de proximité, personnel, à l’écoute de vos besoins.",
        f3H: "Sans délai", f3P: "Chaque demande est prise en compte tout de suite — aucune opportunité ne se perd.",
        bettyH: `Votre ${asstFrShort}, à toute heure`, bettyP: "Posez votre question, demandez un rendez-vous ou un devis — Betty vous répond aussitôt et transmet votre demande.",
        contactKicker: "Contact", contactH: "Prendre contact",
        address: "Adresse", phone: "Téléphone", email: "Email",
        writeUs: "Vous préférez écrire ? Laisser un message", yourName: "Votre nom", yourEmail: "Votre email",
        yourMessage: "Votre message", send: "Envoyer",
        bettyActivating: `${male ? "Assistant" : "Assistante"} en cours d’activation.`, poweredBy: "Propulsé par Spectra Media",
      };

  const bg = site.hero_image_url || "";

  // Site « sur mesure » : couleur de marque du prospect en accent (défaut rose Spectra).
  const accent = /^#[0-9a-fA-F]{6}$/.test(site.brand_color || "") ? site.brand_color : "#b76e79";
  const _l = [1, 3, 5].map((i) => parseInt(accent.slice(i, i + 2), 16));
  const accentText = 0.299 * _l[0] + 0.587 * _l[1] + 0.114 * _l[2] > 150 ? "#1a1420" : "#ffffff";

  const bettyId = site.betty_public_id || metier?.betty_public_id || "";
  const bettyBase = process.env.NEXT_PUBLIC_BETTY_URL || "https://mybetty.online";
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[site.metier] || "LocalBusiness",
    name: nom,
    description: t.aboutP,
    ...(site.hero_image_url ? { image: site.hero_image_url } : {}),
    url: `https://${site.slug}.${rootDomain}/`,
    ...(site.telephone ? { telephone: site.telephone } : {}),
    ...(site.email ? { email: site.email } : {}),
    address: { "@type": "PostalAddress", ...(site.adresse ? { streetAddress: site.adresse } : {}), addressLocality: ville },
    areaServed: ville,
  };

  const IC = {
    clock: <path d="M12 7v5l3 2M12 21a9 9 0 100-18 9 9 0 000 18z" />,
    pin: <path d="M12 21s7-6.3 7-11a7 7 0 10-14 0c0 4.7 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />,
    bolt: <path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" />,
    phone: <path d="M4 4h4l2 5-2.5 1.5a12 12 0 006 6L15 15l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
    mail: <path d="M4 5h16v14H4zM4 6l8 6 8-6" />,
  };
  const Icon = ({ d, size = 22 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
  );

  return (
    <div className="sm" style={{ ["--accent"]: accent, ["--accent-text"]: accentText }}>
      <script type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <style dangerouslySetInnerHTML={{ __html: SM_CSS }} />

      <header className="sm-header">
        <div className="in">
          <div className="sm-brand">{nom}</div>
          <nav className="sm-nav">
            <a className="link" href="#apropos">{t.aboutKicker}</a>
            <a className="link" href="#contact">{t.navContact}</a>
            <a className="sm-btn" href="#betty">{t.navCta}</a>
          </nav>
        </div>
      </header>

      {/* HERO */}
      <section className="sm-hero">
        <div className="bgimg" style={{ backgroundImage: bg ? `url(${bg})` : "linear-gradient(135deg,#1a1a1a,#333)" }} />
        <div className="ov" />
        <div className="in">
          <span className="sm-eyebrow">{t.heroEyebrow}</span>
          <h1>{nom}</h1>
          <p className="sub">{t.heroSub}</p>
          <div className="sm-cta">
            <a className="sm-btn" href="#betty">{t.heroCta1}</a>
            <a className="sm-btn ghost" href="#contact">{t.heroCta2}</a>
          </div>
        </div>
      </section>

      {/* À PROPOS */}
      <section className="sm-sec" id="apropos">
        <div className="sm-kicker">{t.aboutKicker}</div>
        <h2 className="sm-h2">{t.aboutH}</h2>
        <p className="sm-lead">{t.aboutP}</p>
      </section>

      {/* ATOUTS */}
      <section className="sm-sec" style={{ paddingTop: 0 }}>
        <div className="sm-kicker">{t.featKicker}</div>
        <h2 className="sm-h2">{t.featH}</h2>
        <div className="sm-grid3">
          {[[IC.clock, t.f1H, t.f1P], [IC.pin, t.f2H, t.f2P], [IC.bolt, t.f3H, t.f3P]].map(([d, h, p], i) => (
            <div className="sm-card" key={i}>
              <div className="sm-ic"><Icon d={d} /></div>
              <h3>{h}</h3><p>{p}</p>
            </div>
          ))}
        </div>
      </section>

      {/* BETTY */}
      <section className="sm-betty" id="betty">
        <div className="in">
          <div>
            <div className="sm-kicker">{nom}</div>
            <h2>{t.bettyH}</h2>
            <p>{t.bettyP}</p>
          </div>
          {site.betty_on && bettyId ? (
            <div className="frame">
              <iframe src={`${bettyBase}/chat?public_id=${encodeURIComponent(bettyId)}&embed=1`}
                title={`Assistant – ${nom}`} style={{ width: "100%", height: "100%", border: 0 }}
                loading="lazy" allow="clipboard-read; clipboard-write" />
            </div>
          ) : (
            <div className="frame" style={{ display: "flex", alignItems: "center", justifyContent: "center", color: "#ccc", fontSize: 14, padding: 20, textAlign: "center" }}>
              {t.bettyActivating}
            </div>
          )}
        </div>
      </section>

      {/* CONTACT */}
      <section className="sm-sec sm-contact" id="contact">
        <div className="sm-kicker">{t.contactKicker}</div>
        <h2 className="sm-h2">{t.contactH}</h2>
        <div className="rows">
          {(site.adresse || ville) && (
            <div className="sm-row"><span className="ic"><Icon d={IC.pin} size={20} /></span>
              <div><div className="lbl">{t.address}</div><div className="val">{[site.adresse, ville].filter(Boolean).join(", ")}</div></div></div>
          )}
          {site.telephone && (
            <div className="sm-row"><span className="ic"><Icon d={IC.phone} size={20} /></span>
              <div><div className="lbl">{t.phone}</div><div className="val"><a href={`tel:${site.telephone.replace(/\s/g, "")}`} style={{ textDecoration: "none" }}>{site.telephone}</a></div></div></div>
          )}
          {site.email && (
            <div className="sm-row"><span className="ic"><Icon d={IC.mail} size={20} /></span>
              <div><div className="lbl">{t.email}</div><div className="val"><a href={`mailto:${site.email}`} style={{ textDecoration: "none" }}>{site.email}</a></div></div></div>
          )}
        </div>

        {/* Formulaire volontairement discret (repliable) : Betty reste la voie principale. */}
        <details className="sm-msg">
          <summary>✉︎ {t.writeUs}</summary>
          <form className="sm-form" action={`/api/contact/${params.slug}`} method="POST">
            <input name="name" placeholder={t.yourName} required />
            <input name="email" type="email" placeholder={t.yourEmail} required />
            <textarea name="message" placeholder={t.yourMessage} required rows={4} />
            <button className="sm-btn" type="submit" style={{ justifySelf: "start" }}>{t.send}</button>
          </form>
        </details>
      </section>

      <footer className="sm-foot">
        <div className="in">
          <span>© {new Date().getFullYear()} {nom}{ville ? ` · ${ville}` : ""}</span>
          <span>{t.poweredBy}</span>
        </div>
      </footer>
    </div>
  );
}

function ExpiredSite({ site, lang, suspended }) {
  const en = lang === "en";
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const payUrl = `https://${site.slug}.${rootDomain}/pay`;
  const copy = en ? {
    eyebrow: suspended ? "Subscription inactive" : "7-day preview ended",
    title: suspended ? "This website is temporarily unavailable" : "This preview has expired",
    text: `The personalized website created for ${site.nom_enseigne} has been safely kept. Start the subscription to immediately restore this exact website, its human-faced MyBetty receptionist and its contact form.`,
    cta: "Reactivate this website",
    note: "No rebuilding and no data loss.",
  } : {
    eyebrow: suspended ? "Abonnement inactif" : "Aperçu de 7 jours terminé",
    title: suspended ? "Ce site est temporairement indisponible" : "Cet aperçu a expiré",
    text: `Le site personnalisé créé pour ${site.nom_enseigne} a été conservé. Activez l’abonnement pour remettre immédiatement en ligne ce même site, sa réceptionniste MyBetty à visage humain et son formulaire de contact.`,
    cta: "Réactiver ce site",
    note: "Aucune reconstruction et aucune donnée perdue.",
  };

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 24, background: "#f6f1ea", fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color: "#2a2320" }}>
      <section style={{ width: "100%", maxWidth: 620, padding: "44px 34px", background: "#fff", borderRadius: 22, textAlign: "center", boxShadow: "0 18px 60px rgba(80,50,60,.12)" }}>
        <div style={{ color: "#b76e79", fontSize: 13, fontWeight: 800, letterSpacing: ".12em", textTransform: "uppercase" }}>{copy.eyebrow}</div>
        <h1 style={{ margin: "12px 0 16px", fontSize: "clamp(30px,6vw,46px)", lineHeight: 1.08 }}>{copy.title}</h1>
        <p style={{ margin: "0 auto 26px", maxWidth: 510, color: "#665a60", fontSize: 17, lineHeight: 1.65 }}>{copy.text}</p>
        <a href={payUrl} style={{ display: "inline-block", padding: "14px 28px", borderRadius: 999, background: "#b76e79", color: "#fff", fontWeight: 800, textDecoration: "none" }}>{copy.cta}</a>
        <p style={{ margin: "16px 0 0", color: "#9a8d94", fontSize: 13 }}>{copy.note}</p>
      </section>
    </main>
  );
}

const SM_CSS = `
.sm *{box-sizing:border-box}
.sm{--maxw:1080px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#2a2320;background:#faf7f4;line-height:1.5}
.sm a{color:inherit}
.sm-header{position:sticky;top:0;z-index:20;backdrop-filter:blur(10px);background:rgba(250,247,244,.82);border-bottom:1px solid #eee5dd}
.sm-header .in{max-width:var(--maxw);margin:0 auto;padding:13px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px}
.sm-brand{font-weight:800;font-size:18px;letter-spacing:-.01em}
.sm-nav{display:flex;align-items:center;gap:20px}
.sm-nav a.link{text-decoration:none;font-size:14px;color:#6b5f57}
.sm-nav a.link:hover{color:var(--accent)}
.sm-btn{display:inline-block;background:var(--accent);color:var(--accent-text);text-decoration:none;font-weight:700;font-size:14px;padding:11px 20px;border-radius:999px;border:none;cursor:pointer}
.sm-btn.ghost{background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,.65)}
.sm-hero{position:relative;min-height:82vh;display:flex;align-items:center;color:#fff}
.sm-hero .bgimg{position:absolute;inset:0;background-size:cover;background-position:center}
.sm-hero .ov{position:absolute;inset:0;background:linear-gradient(115deg,rgba(0,0,0,.8) 0%,rgba(0,0,0,.55) 45%,rgba(0,0,0,.3) 100%)}
.sm-hero .in{position:relative;max-width:var(--maxw);margin:0 auto;padding:70px 22px;width:100%}
.sm-eyebrow{display:inline-block;text-transform:uppercase;letter-spacing:.14em;font-size:12px;font-weight:800;padding:6px 13px;border-radius:999px;background:var(--accent);color:var(--accent-text)}
.sm-hero h1{font-size:clamp(34px,6.2vw,60px);line-height:1.03;margin:18px 0 16px;font-weight:800;letter-spacing:-.02em;max-width:16ch}
.sm-hero p.sub{font-size:clamp(16px,2.2vw,21px);max-width:48ch;color:rgba(255,255,255,.92)}
.sm-cta{display:flex;gap:12px;flex-wrap:wrap;margin-top:30px}
.sm-sec{max-width:var(--maxw);margin:0 auto;padding:78px 22px}
.sm-kicker{color:var(--accent);font-weight:800;text-transform:uppercase;letter-spacing:.12em;font-size:13px}
.sm-h2{font-size:clamp(26px,4vw,38px);font-weight:800;letter-spacing:-.02em;margin:8px 0 18px}
.sm-lead{font-size:18px;line-height:1.75;color:#4a4038;max-width:62ch}
.sm-grid3{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:22px}
.sm-card{background:#fff;border:1px solid #eee5dd;border-radius:18px;padding:26px;box-shadow:0 6px 24px rgba(120,80,60,.05)}
.sm-ic{width:46px;height:46px;border-radius:13px;display:flex;align-items:center;justify-content:center;background:var(--accent);color:var(--accent-text);margin-bottom:14px}
.sm-card h3{font-size:18px;margin:0 0 8px;font-weight:700}
.sm-card p{margin:0;color:#6b5f57;line-height:1.6;font-size:15px}
.sm-betty{background:#221b18;color:#fff}
.sm-betty .in{max-width:var(--maxw);margin:0 auto;padding:74px 22px;display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:44px;align-items:center}
.sm-betty h2{font-size:clamp(26px,4vw,36px);font-weight:800;margin:10px 0 14px}
.sm-betty p{color:rgba(255,255,255,.82);font-size:17px;line-height:1.65}
.sm-betty .frame{border-radius:20px;overflow:hidden;border:3px solid var(--accent);height:470px;background:#000;box-shadow:0 24px 60px rgba(0,0,0,.45)}
.sm-contact .rows{display:flex;flex-direction:column;gap:16px;margin-top:6px}
.sm-row{display:flex;gap:13px;align-items:flex-start}
.sm-row .ic{color:var(--accent);margin-top:2px}
.sm-row .lbl{font-size:12px;text-transform:uppercase;letter-spacing:.08em;color:#9a8d84}
.sm-row .val{font-size:16px;font-weight:600}
.sm-row .val a:hover{color:var(--accent)}
details.sm-msg{margin-top:26px}
details.sm-msg summary{cursor:pointer;color:var(--accent);font-weight:700;list-style:none;font-size:15px}
details.sm-msg summary::-webkit-details-marker{display:none}
.sm-form{display:grid;gap:10px;margin-top:16px;max-width:440px}
.sm-form input,.sm-form textarea{border:1px solid #e2d7ce;border-radius:10px;padding:11px 13px;font-size:15px;font-family:inherit;background:#fff}
.sm-form input:focus,.sm-form textarea:focus{outline:none;border-color:var(--accent)}
.sm-foot{border-top:1px solid #eee5dd}
.sm-foot .in{max-width:var(--maxw);margin:0 auto;padding:28px 22px;display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;color:#9a8d84;font-size:14px}
@media (max-width:820px){.sm-grid3{grid-template-columns:1fr}.sm-betty .in{grid-template-columns:1fr}.sm-nav .link{display:none}.sm-betty .frame{height:440px}}
`;
