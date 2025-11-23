"use client";
import { useState } from "react";

export default function Builder() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h1>Créer mon site pro 1€</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: 10 }}
      >
        <input name="metier" placeholder="Métier (ex : cordonnier)" required />
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

        <fieldset
          style={{ border: "1px solid #ddd", borderRadius: 8, padding: 10 }}
        >
          <legend>Formule</legend>
          <label style={{ display: "block", marginBottom: 6 }}>
            <input type="radio" name="plan" value="site" defaultChecked />{" "}
            Site simple – 1€ / mois
          </label>
          <label style={{ display: "block" }}>
            <input type="radio" name="plan" value="site+betty" /> Site + Betty
            métier – 29,99€ / mois
          </label>
        </fieldset>

        <button type="submit" disabled={loading}>
          {loading ? "Redirection vers Stripe…" : "Payer et créer mon site"}
        </button>
      </form>

      {error && (
        <p style={{ color: "red", marginTop: 10 }}>
          {error}
        </p>
      )}
    </div>
  );
}
