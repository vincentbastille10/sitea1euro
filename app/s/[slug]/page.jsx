import { getSiteBySlug } from "../../../lib/sites-db";
import { getMetierById } from "../../../lib/metiers";

export default async function Site({ params }) {
  const site = await getSiteBySlug(params.slug);
  if (!site) return <h1>Page introuvable</h1>;

  const metier = getMetierById(site.metier);

  const title = `${site.nom_enseigne} – ${metier?.label || site.metier} à ${
    site.ville
  }`;
  const bg = site.hero_image_url || "";

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: bg ? `url(${bg})` : "linear-gradient(135deg,#111,#333)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, rgba(0,0,0,.7), rgba(0,0,0,.4))",
          color: "white",
        }}
      >
        {/* Hero */}
        <header
          style={{
            padding: "20px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: 1100,
            margin: "0 auto",
          }}
        >
          <div style={{ fontWeight: 700 }}>{site.nom_enseigne}</div>
          <div style={{ fontSize: 12, opacity: 0.8 }}>Propulsé par Spectra Media</div>
        </header>

        <main style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px" }}>
          <section
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0,2fr) minmax(0,1.2fr)",
              gap: 32,
              alignItems: "flex-start",
            }}
          >
            {/* Bloc texte */}
            <div>
              <h1 style={{ fontSize: 32, marginBottom: 12 }}>{title}</h1>
              <p style={{ fontSize: 16, maxWidth: 520, lineHeight: 1.5 }}>
                {metier?.pitch ||
                  "Accompagnement professionnel, sur rendez-vous, avec une approche personnalisée."}
              </p>

              <div
                style={{
                  marginTop: 20,
                  padding: 16,
                  borderRadius: 12,
                  backdropFilter: "blur(10px)",
                  background: "rgba(0,0,0,.4)",
                }}
              >
                <h2 style={{ fontSize: 18, marginBottom: 8 }}>Coordonnées</h2>
                <p style={{ margin: 0 }}>
                  <strong>Adresse :</strong> {site.adresse}, {site.ville}
                  <br />
                  <strong>Téléphone :</strong> {site.telephone}
                  <br />
                  <strong>Email :</strong>{" "}
                  <a
                    href={`mailto:${site.email}`}
                    style={{ color: "#ffde8b", textDecoration: "none" }}
                  >
                    {site.email}
                  </a>
                </p>
              </div>
            </div>

            {/* Bloc Betty + contact */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              {site.betty_on && (
                <div
                  style={{
                    borderRadius: 16,
                    overflow: "hidden",
                    background: "rgba(0,0,0,.5)",
                    border: "1px solid rgba(255,255,255,.1)",
                    height: 380,
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      color: "#ddd",
                      padding: 16,
                      textAlign: "center",
                    }}
                  >
                    Ici, tu intègreras l’iframe de Betty métier
                    <br />
                    (public_id spécifique au métier).
                  </div>
                </div>
              )}

              <div
                style={{
                  borderRadius: 16,
                  background: "rgba(0,0,0,.65)",
                  border: "1px solid rgba(255,255,255,.1)",
                  padding: 16,
                }}
              >
                <h2 style={{ fontSize: 18, marginBottom: 8 }}>Écrire un message</h2>
                <form
                  action={`/api/contact/${params.slug}`}
                  method="POST"
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
                  }}
                >
                  <input
                    name="name"
                    placeholder="Votre nom"
                    required
                    style={{
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,.3)",
                      padding: "6px 8px",
                      background: "rgba(0,0,0,.4)",
                      color: "white",
                    }}
                  />
                  <input
                    name="email"
                    type="email"
                    placeholder="Votre email"
                    required
                    style={{
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,.3)",
                      padding: "6px 8px",
                      background: "rgba(0,0,0,.4)",
                      color: "white",
                    }}
                  />
                  <textarea
                    name="message"
                    placeholder="Votre message"
                    required
                    rows={4}
                    style={{
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,.3)",
                      padding: "6px 8px",
                      background: "rgba(0,0,0,.4)",
                      color: "white",
                      resize: "vertical",
                    }}
                  />
                  <button
                    type="submit"
                    style={{
                      marginTop: 4,
                      borderRadius: 999,
                      border: "none",
                      padding: "8px 14px",
                      background: "#ffde8b",
                      color: "#222",
                      fontWeight: 600,
                      cursor: "pointer",
                      alignSelf: "flex-start",
                    }}
                  >
                    Envoyer
                  </button>
                </form>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
