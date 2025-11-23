"use client";

import { useState } from "react";

// Liste visible dans le select
const METIERS_PREDEFINIS = [
  "Coiffeuse / salon de coiffure",
  "Ostéopathe",
  "Ostéopathe animalier",
  "Thérapeute / psychopraticien",
  "Esthéticienne",
  "Coach sportif",
  "Photographe",
  "Artisan",
  "Restaurant / café",
  "Agent immobilier",
];

// Si un jour tu veux pointer vers des packs métier précis,
// tu pourras remplir ce mapping.
// Pour l’instant, TOUT renvoie betty_neutre_001 => safe.
const METIER_TO_BETTY_ID = {
  // "Coiffeuse / salon de coiffure": "betty_coiffeuse_001",
  // "Ostéopathe": "betty_osteopathe_001",
  // ...
};

function getBettyPublicId(metier) {
  if (!metier) return "betty_neutre_001";
  const id = METIER_TO_BETTY_ID[metier];
  return id || "betty_neutre_001";
}

export default function Builder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [metierSelect, setMetierSelect] = useState("");
  const [useCustomMetier, setUseCustomMetier] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      // Gestion "Autre métier"
      let metierFinal = data.metier;
      if (data.metier === "autre" && data.metier_custom) {
        metierFinal = data.metier_custom.trim();
      }

      if (!metierFinal) {
        setError("Merci d’indiquer votre métier.");
        setLoading(false);
        return;
      }

      data.metier = metierFinal;

      // Calcul du betty_public_id côté front
      const betty_public_id = getBettyPublicId(metierFinal);

      const payload = {
        metier: data.metier,
        nom_enseigne: data.nom_enseigne,
        ville: data.ville,
        adresse: data.adresse,
        telephone: data.telephone,
        email: data.email,
        plan: data.plan || "site",
        betty_public_id, // envoyé à /api/checkout → Stripe metadata
      };

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Erreur API checkout:", res.status, txt);
        setError("Erreur lors de la création du paiement.");
        return;
      }

      const json = await res.json();
      if (!json.url) {
        setError("Réponse Stripe invalide (pas d’URL).");
        return;
      }

      if (typeof window !== "undefined") {
        window.location.href = json.url; // redirection vers Stripe
      }
    } catch (err) {
      console.error("Erreur JS dans le builder:", err);
      setError("Erreur inattendue côté navigateur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, #020617, #020617 40%, #020617)",
        color: "white",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 760,
          borderRadius: 24,
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.99))",
          boxShadow: "0 24px 70px rgba(0,0,0,0.7)",
          border: "1px solid rgba(148,163,184,0.35)",
          padding: 24,
        }}
      >
        {/* Bandeau logos */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 16,
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <img
              src="/spectra_media_logo.png"
              alt="Spectra Media"
              style={{ height: 40, objectFit: "contain" }}
            />
            <span
              style={{
                fontSize: 18,
                fontWeight: 600,
                letterSpacing: 0.5,
                color: "#e5e7eb",
              }}
            >
              Sites à 1€
            </span>
          </div>
          <img
            src="/logo-bettybots.png"
            alt="Betty Bots"
            style={{ height: 36, objectFit: "contain", opacity: 0.9 }}
          />
        </div>

        {/* Titre + sous-titre */}
        <div style={{ marginBottom: 20 }}>
          <h1
            style={{
              fontSize: 26,
              margin: 0,
              marginBottom: 6,
              fontWeight: 700,
            }}
          >
            Configurez votre mini-site professionnel
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 14,
              color: "#9ca3af",
              maxWidth: 520,
            }}
          >
            Un site vitrine simple, votre métier clairement mis en avant,
            et la possibilité d’ajouter Betty, votre assistante IA, qui
            répond à vos visiteurs 24/7.
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 16,
          }}
        >
          {/* Métier */}
          <div style={{ gridColumn: "1 / 3" }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
              Votre métier
            </label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <select
                name="metier"
                value={metierSelect}
                onChange={(e) => {
                  const val = e.target.value;
                  setMetierSelect(val);
                  setUseCustomMetier(val === "autre");
                }}
                required={!useCustomMetier}
                style={{
                  flex: "1 1 260px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.5)",
                  padding: "8px 12px",
                  background: "rgba(15,23,42,0.9)",
                  color: "white",
                  fontSize: 14,
                  outline: "none",
                }}
              >
                <option value="">Choisissez un métier</option>
                {METIERS_PREDEFINIS.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
                <option value="autre">Autre métier…</option>
              </select>

              {useCustomMetier && (
                <input
                  name="metier_custom"
                  placeholder="Précisez votre métier"
                  required
                  style={{
                    flex: "1 1 200px",
                    borderRadius: 999,
                    border: "1px solid rgba(148,163,184,0.5)",
                    padding: "8px 12px",
                    background: "rgba(15,23,42,0.9)",
                    color: "white",
                    fontSize: 14,
                    outline: "none",
                  }}
                />
              )}
            </div>
            <p style={{ fontSize: 12, color: "#9ca3af", marginTop: 6 }}>
              Si votre métier n’apparaît pas, choisissez “Autre métier” et
              décrivez-le : une Betty neutre{" "}
              <strong>(betty_neutre_001)</strong> lui sera associée.
            </p>
          </div>

          {/* Nom enseigne */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
              Nom de l’enseigne
            </label>
            <input
              name="nom_enseigne"
              placeholder="Ex : Cordonnerie Letort"
              required
              style={inputStyle}
            />
          </div>

          {/* Ville */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
              Ville
            </label>
            <input
              name="ville"
              placeholder="Ex : Le Mans"
              required
              style={inputStyle}
            />
          </div>

          {/* Adresse */}
          <div style={{ gridColumn: "1 / 3" }}>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
              Adresse complète
            </label>
            <input
              name="adresse"
              placeholder="Numéro, rue, code postal…"
              required
              style={inputStyle}
            />
          </div>

          {/* Téléphone */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
              Téléphone
            </label>
            <input
              name="telephone"
              placeholder="06…"
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div>
            <label
              style={{
                display: "block",
                fontSize: 13,
                marginBottom: 4,
                color: "#e5e7eb",
              }}
            >
              Email de contact
            </label>
            <input
              name="email"
              type="email"
              placeholder="Vous recevrez vos demandes ici"
              required
              style={inputStyle}
            />
          </div>

          {/* Formule */}
          <div style={{ gridColumn: "1 / 3" }}>
            <fieldset
              style={{
                border: "1px solid rgba(148,163,184,0.5)",
                borderRadius: 16,
                padding: 12,
              }}
            >
              <legend
                style={{
                  fontSize: 13,
                  padding: "0 6px",
                  color: "#e5e7eb",
                }}
              >
                Formule
              </legend>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="plan"
                  value="site"
                  defaultChecked
                  style={{ marginRight: 6 }}
                />
                Site simple – 1€ / mois
              </label>
              <label
                style={{
                  display: "block",
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="plan"
                  value="site+betty"
                  style={{ marginRight: 6 }}
                />
                Site + Betty métier – 29,99€ + 1€ / mois
              </label>
            </fieldset>
          </div>

          {/* Bouton + info */}
          <div
            style={{
              gridColumn: "1 / 3",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              marginTop: 4,
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                borderRadius: 999,
                border: "none",
                padding: "10px 20px",
                fontSize: 15,
                fontWeight: 600,
                background:
                  "linear-gradient(135deg, #3b82f6, #0ea5e9)",
                color: "white",
                cursor: loading ? "wait" : "pointer",
                boxShadow: "0 10px 30px rgba(37,99,235,0.5)",
                whiteSpace: "nowrap",
              }}
            >
              {loading
                ? "Redirection vers le paiement…"
                : "Payer et créer mon site"}
            </button>

            <p
              style={{
                margin: 0,
                fontSize: 12,
                color: "#9ca3af",
                textAlign: "right",
              }}
            >
              Paiement sécurisé par Stripe. <br />
              Votre site et votre Betty seront générés automatiquement après
              validation.
            </p>
          </div>
        </form>

        {error && (
          <p
            style={{
              marginTop: 12,
              color: "#f97373",
              fontSize: 13,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  borderRadius: 999,
  border: "1px solid rgba(148,163,184,0.5)",
  padding: "8px 12px",
  background: "rgba(15,23,42,0.9)",
  color: "white",
  fontSize: 14,
  outline: "none",
};
