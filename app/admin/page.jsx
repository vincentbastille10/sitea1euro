"use client";
import { useState, useEffect } from "react";

export default function HyperBetty() {
  const [password, setPassword] = useState("");
  const [urls, setUrls] = useState("");
  const [plan, setPlan] = useState("site+betty");
  const [dry, setDry] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rows, setRows] = useState([]);
  const [summary, setSummary] = useState("");

  useEffect(() => { setPassword(localStorage.getItem("hb_pw") || ""); }, []);

  async function run() {
    setError(""); setLoading(true); setRows([]); setSummary("");
    localStorage.setItem("hb_pw", password);
    const list = urls.split("\n").map((s) => s.trim()).filter(Boolean);
    if (!list.length) { setError("Colle au moins une URL de courtier."); setLoading(false); return; }
    try {
      const r = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, urls: list, plan, dry }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error === "unauthorized" ? "Mot de passe incorrect." : (d.error || "Erreur.")); setLoading(false); return; }
      setRows(d.results || []);
      setSummary(dry ? `Aperçu de ${d.count} courtiers.` : `${d.created}/${d.count} sites créés + emails envoyés.`);
    } catch (e) { setError("Erreur réseau: " + e.message); }
    setLoading(false);
  }

  const S = {
    wrap: { maxWidth: 900, margin: "0 auto", padding: 28, fontFamily: "'Segoe UI',system-ui,sans-serif", color: "#2c2430" },
    h1: { fontSize: 26, fontWeight: 800, margin: "0 0 4px" },
    sub: { color: "#8a7d84", margin: "0 0 24px" },
    label: { fontSize: 13, fontWeight: 600, color: "#5b4a52", margin: "16px 0 6px", display: "block" },
    input: { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1px solid #e4dad2", fontSize: 15, boxSizing: "border-box" },
    ta: { width: "100%", minHeight: 160, padding: "10px 12px", borderRadius: 10, border: "1px solid #e4dad2", fontSize: 14, fontFamily: "monospace", boxSizing: "border-box" },
    btn: { background: "#b76e79", color: "#fff", border: 0, padding: "13px 26px", borderRadius: 999, fontWeight: 700, fontSize: 15, cursor: "pointer" },
    row: { display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" },
    th: { textAlign: "left", padding: "8px 10px", fontSize: 12, color: "#8a7d84", borderBottom: "2px solid #eee" },
    td: { padding: "8px 10px", fontSize: 13, borderBottom: "1px solid #f0e6e0", verticalAlign: "top" },
  };

  return (
    <div style={S.wrap}>
      <h1 style={S.h1}>🚀 HyperBetty</h1>
      <p style={S.sub}>Colle des URLs de courtiers → scrape + génère les sites + envoie les emails. Aucun terminal.</p>

      <label style={S.label}>Mot de passe</label>
      <input style={{ ...S.input, maxWidth: 280 }} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="mot de passe HyperBetty" />

      <label style={S.label}>URLs de courtiers (une par ligne, max 25)</label>
      <textarea style={S.ta} value={urls} onChange={(e) => setUrls(e.target.value)} placeholder={"thegellmanteam.com\n54realty.com\nmoverealestate.org"} />

      <div style={{ ...S.row, marginTop: 16 }}>
        <div>
          <label style={S.label}>Offre</label>
          <select style={S.input} value={plan} onChange={(e) => setPlan(e.target.value)}>
            <option value="site+betty">Site + Betty ($59/mo)</option>
            <option value="site">Site simple ($1/mo)</option>
          </select>
        </div>
        <label style={{ ...S.row, marginTop: 26, gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={dry} onChange={(e) => setDry(e.target.checked)} />
          <span style={{ fontSize: 14 }}>Aperçu seul (ne crée rien, n'envoie pas)</span>
        </label>
      </div>

      <div style={{ marginTop: 22 }}>
        <button style={{ ...S.btn, opacity: loading ? 0.6 : 1 }} onClick={run} disabled={loading}>
          {loading ? "En cours…" : dry ? "Aperçu" : "Générer + Envoyer"}
        </button>
      </div>

      {error && <p style={{ color: "#c0392b", marginTop: 16 }}>{error}</p>}
      {summary && <p style={{ marginTop: 20, fontWeight: 700 }}>{summary}</p>}

      {rows.length > 0 && (
        <div style={{ overflowX: "auto", marginTop: 8 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr>
              <th style={S.th}>Courtier</th><th style={S.th}>Email</th><th style={S.th}>Ville</th>
              <th style={S.th}>Site</th><th style={S.th}>Statut</th>
            </tr></thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i}>
                  <td style={S.td}>{r.name || "—"}<br /><span style={{ color: "#a2939a", fontSize: 11 }}>{r.url}</span></td>
                  <td style={S.td}>{r.email || "—"}</td>
                  <td style={S.td}>{r.city || "—"}</td>
                  <td style={S.td}>{r.site_url ? <a href={r.site_url} target="_blank" rel="noreferrer" style={{ color: "#b76e79" }}>ouvrir ↗</a> : "—"}</td>
                  <td style={S.td}>{r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
