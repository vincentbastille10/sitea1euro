"use client";
import { useState } from "react";

export default function Builder() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
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
        setError("Erreur serveur. (API generate-site)");
        return;
      }

      const json = await res.json();
      if (!json.url) {
        setError("Réponse serveur invalide (pas d’URL).");
        return;
      }

      setUrl(json.url);
      // redirection automatique
      window.location.href = json.url;
    } catch (err) {
      console.error("Erreur JS dans le builder:", err);
      setError("Erreur inattendue dans le navigateur.");
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
        <label>
          <input type="checkbox" name="betty_on" defaultChecked /> Activer Betty
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
          Votre page est disponible ici :{" "}
          <a href={url}>{url}</a>
        </p>
      )}
    </div>
  );
}
