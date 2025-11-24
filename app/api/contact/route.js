import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Si quelqu'un appelle /api/contact sans slug, on renvoie une erreur propre
export async function POST() {
  return NextResponse.json(
    { ok: false, error: "Slug requis. Utiliser /api/contact/[slug]." },
    { status: 400 }
  );
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Slug requis. Utiliser /api/contact/[slug]." },
    { status: 400 }
  );
}
