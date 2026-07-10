// middleware.js — routage par sous-domaine.
// Chaque site client vit sur `slug.spectramedia.online` (URL "impeccable")
// et pointe en interne vers la page /s/[slug]. Le domaine racine et le
// domaine de preview *.vercel.app gardent leur comportement normal
// (/, /builder, etc.).
import { NextResponse } from "next/server";

// N'exécute PAS le middleware sur les API, les assets Next et les fichiers.
export const config = {
  matcher: ["/((?!api|_next|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)"],
};

const RESERVED = new Set(["www", "app", "mail", "ftp", "admin", "api", "cdn"]);

export function middleware(req) {
  const rootDomain = process.env.ROOT_DOMAIN || "spectramedia.online";
  const host = (req.headers.get("host") || "").split(":")[0].toLowerCase();

  // Seulement les sous-domaines de notre domaine racine : slug.spectramedia.online
  if (host.endsWith("." + rootDomain)) {
    const sub = host.slice(0, -(rootDomain.length + 1));
    if (sub && !sub.includes(".") && !RESERVED.has(sub)) {
      const url = req.nextUrl.clone();
      // Home du sous-domaine → le site du client.
      if (url.pathname === "/") {
        url.pathname = `/s/${sub}`;
        return NextResponse.rewrite(url);
      }
      // /pay (lien du bouton de paiement dans l'email) → la route de paiement.
      if (url.pathname === "/pay") {
        url.pathname = `/pay/${sub}`;
        return NextResponse.rewrite(url);
      }
    }
  }

  return NextResponse.next();
}
