
import { NextResponse } from "next/server";
import { createSite } from "../../../lib/sites-db";

export async function POST(req){
  const b=await req.json();
  const slug=(b.nom_enseigne||"site").toLowerCase().replace(/[^a-z0-9]+/g,"-");
  const site={
    slug,
    metier:b.metier,
    nom_enseigne:b.nom_enseigne,
    ville:b.ville,
    adresse:b.adresse,
    telephone:b.telephone,
    email:b.email,
    betty_on:!!b.betty_on
  };
  await createSite(site);
  return NextResponse.json({ok:true,url:`/s/${slug}`});
}
