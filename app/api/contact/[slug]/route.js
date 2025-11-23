
import { NextResponse } from "next/server";
import { getSiteBySlug } from "../../../../lib/sites-db";

export async function POST(req,{params}){
  const site=await getSiteBySlug(params.slug);
  if(!site) return NextResponse.json({error:"not found"},{status:404});
  const f=await req.formData();
  console.log("Message reçu pour",site.email,{
    name:f.get("name"),
    email:f.get("email"),
    message:f.get("message")
  });
  return NextResponse.redirect(new URL(`/s/${params.slug}`,req.url));
}
