"use client";
import { useState } from "react";
import { METIERS } from "../../lib/metiers";

export default function Builder() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const res = await fetch("/api/generate-site", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("Erreur API generate-site:", res.status, txt);
        setError("Erreur serveur (generate-site).");
        return;
      }

      const json = await res.json();
      if (!json.url) {
        setError("Réponse serveur invalide (pas d’URL).");
        return;
      }

      setUrl(json.url);
      if (typeof window !== "undefined") {
        window.location.href = json.url;
      }
    } catch (err) {
      console.error("Erreur JS dans le builder:", err);
      setError("Erreur inattendue côté navigateur.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Créer mon site pro 1€</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        {/* Sélecteur de métier */}
        <label>
          Métier
          <select name="metier" defaultValue="" required>
            <option value="" disabled>
              Choisissez votre métier
            </option>
            {METIERS.map((m) => (
              <option key={m.id} value={m.id}>
                {m.label}
              </option>
            ))}
          </select>
        </label>

        <input name="nom_enseigne" placeholder="Nom de l’enseigne" required />
        <input name="ville" placeholder="Ville" required />
        <input name="adresse" placeholder="Adresse complète" required />
        <input name="telephone" placeholder="Téléphone" required />
        <input
          name="email"
          type="email"
          placeholder="Email de contact (reçoit les messages)"
          required
        />

        {/* Choix du plan : 1€ seul ou 29,99€ + 1€ */}
        <fieldset style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10 }}>
          <legend>Formule</legend>
          <label style={{ display: "block", marginBottom: 6 }}>
            <input type="radio" name="plan" value="site" defaultChecked />{" "}
            Site simple – 1€ / mois
          </label>
          <label style={{ display: "block" }}>
            <input type="radio" name="plan" value="site+betty" />{" "}
            Site + Betty métier – 29,99€ + 1€ / mois
          </label>
        </fieldset>

        <label>
          <input type="checkbox" name="betty_on" defaultChecked /> Activer Betty
          sur la page (si formule site + Betty)
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Création…" : "Créer mon site"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}

      {url && !error && (
        <p style={{ marginTop: 10 }}>
          Votre page est disponible ici : <a href={url}>{url}</a>
        </p>
      )}
    </div>
  );
}
