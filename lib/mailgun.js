// Envoi Mailgun (2026-11-04, remplace Mailjet). Retourne { ok, status, error }.
export async function mgSend({ to, subject, text, html, fromName, replyTo, headers }) {
  const key = process.env.MAILGUN_API_KEY;
  if (!key) return { ok: false, error: "MAILGUN_API_KEY manquant" };
  const form = new URLSearchParams({
    from: `${fromName || "Spectra Media"} <${process.env.MAILGUN_FROM_EMAIL || "contact@mybetty.online"}>`,
    to, subject, text: text || "",
  });
  if (html) form.set("html", html);
  if (replyTo) form.set("h:Reply-To", replyTo);
  for (const [k, v] of Object.entries(headers || {})) form.set(`h:${k}`, String(v));
  try {
    const res = await fetch(`https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN || "mg.mybetty.online"}/messages`, {
      method: "POST",
      headers: { Authorization: "Basic " + Buffer.from("api:" + key).toString("base64"), "Content-Type": "application/x-www-form-urlencoded" },
      body: form.toString(),
    });
    if (!res.ok) return { ok: false, status: res.status, error: (await res.text()).slice(0, 300) };
    return { ok: true, status: res.status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}
