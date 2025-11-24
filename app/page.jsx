/* app/globals.css */

body {
  margin: 0;
  padding: 0;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    sans-serif;
  background-color: #ffffff;
  color: #111111;
}

/* Container global */
.sm-page {
  background: #ffffff;
  color: #111827;
}

/* Sections */
.sm-hero,
.sm-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 16px;
}

/* HERO */

.sm-hero {
  text-align: center;
}

.sm-hero-logo {
  position: relative;
  width: 180px;
  height: 180px;
  margin: 0 auto 16px auto;
}

.sm-hero-tagline {
  font-size: 12px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: #4b5563;
  margin-bottom: 8px;
}

.sm-hero-title {
  font-size: 32px;
  line-height: 1.2;
  margin: 0 0 12px 0;
}

.sm-hero-title span {
  color: #2563eb; /* bleu accent */
  font-weight: 700;
}

.sm-hero-text {
  max-width: 640px;
  margin: 0 auto;
  font-size: 15px;
  color: #374151;
}

.sm-hero-actions {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.sm-btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border-radius: 999px;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.sm-btn-primary:hover {
  background-color: #1d4ed8;
  transform: translateY(-1px);
}

.sm-hero-note {
  font-size: 12px;
  color: #6b7280;
}

/* Split section */

.sm-section-split {
  display: flex;
  flex-direction: column;
  gap: 24px;
  border-top: 1px solid #e5e7eb;
}

.sm-section-text h2 {
  font-size: 22px;
  margin-bottom: 12px;
}

.sm-section-text p {
  font-size: 15px;
  color: #374151;
  margin-bottom: 8px;
}

/* Card étapes */

.sm-card-steps {
  border-radius: 16px;
  border: 1px solid #bfdbfe;
  background: #eff6ff;
  padding: 16px 20px;
  font-size: 14px;
  color: #1f2933;
}

.sm-card-title {
  font-weight: 600;
  color: #1d4ed8;
  margin-bottom: 8px;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.sm-card-steps ol {
  padding-left: 18px;
  margin: 0;
}

.sm-card-steps li {
  margin-bottom: 6px;
}

/* Avantages */

.sm-section-title {
  text-align: center;
  font-size: 22px;
  margin-bottom: 24px;
}

.sm-cards-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 16px;
}

.sm-card {
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
  padding: 16px 20px;
  font-size: 14px;
  color: #111827;
}

.sm-card-label {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: #2563eb;
  margin-bottom: 6px;
}

.sm-section-cta {
  margin-top: 24px;
  text-align: center;
}

/* Footer */

.sm-footer {
  border-top: 1px solid #e5e7eb;
  padding: 16px;
  text-align: center;
  font-size: 12px;
  color: #6b7280;
  margin-top: 16px;
}

/* Responsive */

@media (min-width: 768px) {
  .sm-hero-title {
    font-size: 40px;
  }

  .sm-section-split {
    flex-direction: row;
    align-items: flex-start;
  }

  .sm-section-text,
  .sm-card-steps {
    flex: 1;
  }

  .sm-cards-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
