// app/not-found.js — page 404 de marque (Spectra Media), affichée pour tout
// slug inexistant (site supprimé, lien erroné, sous-domaine sans site). Rendue
// avec un vrai statut HTTP 404 via notFound() côté page.
export default function NotFound() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "linear-gradient(135deg, #f6f1ea 0%, #efe4dd 100%)",
        fontFamily: "'Segoe UI', Helvetica, Arial, sans-serif",
        color: "#3a2f36",
      }}
    >
      <div
        style={{
          maxWidth: 460,
          width: "100%",
          textAlign: "center",
          background: "#ffffff",
          border: "1px solid #e4dad2",
          borderRadius: 20,
          padding: "44px 32px",
          boxShadow: "0 10px 40px rgba(120,80,90,.10)",
        }}
      >
        <div
          style={{
            width: 60,
            height: 60,
            margin: "0 auto 20px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#b76e79,#8f5560)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          ✦
        </div>
        <h1 style={{ fontSize: 22, margin: "0 0 10px", fontWeight: 700 }}>
          Cette page n’existe pas (ou plus)
        </h1>
        <p style={{ fontSize: 15, lineHeight: 1.6, color: "#8a7d84", margin: "0 0 26px" }}>
          Le site que vous cherchez a peut-être été déplacé ou supprimé.
          Vérifiez l’adresse, ou découvrez ce que nous créons pour les
          professionnels.
        </p>
        <a
          href="https://spectramedia.online"
          style={{
            display: "inline-block",
            padding: "13px 30px",
            borderRadius: 999,
            background: "#b76e79",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          Aller sur Spectra Media →
        </a>
        <div style={{ marginTop: 22, fontSize: 12.5, color: "#a2939a" }}>
          Propulsé par Spectra Media
        </div>
      </div>
    </div>
  );
}
