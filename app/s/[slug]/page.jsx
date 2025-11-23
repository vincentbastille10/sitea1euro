
import { getSiteBySlug } from "../../../lib/sites-db";

export default async function Site({params}){
  const site=await getSiteBySlug(params.slug);
  if(!site) return <h1>Introuvable</h1>;
  return <div style={{padding:20}}>
    <h1>{site.nom_enseigne} – {site.ville}</h1>
    <p>{site.metier}</p>
    <p>{site.adresse}</p>
    <p>{site.telephone}</p>

    {site.betty_on && <div style={{border:"1px solid #aaa",height:300}}>
      iframe Betty ici
    </div>}

    <h2>Contact</h2>
    <form action={`/api/contact/${params.slug}`} method="POST" style={{display:"flex",flexDirection:"column",gap:8}}>
      <input name="name" placeholder="Votre nom" required />
      <input name="email" type="email" placeholder="Votre email" required />
      <textarea name="message" placeholder="Message" required />
      <button>Envoyer</button>
    </form>
  </div>
}
