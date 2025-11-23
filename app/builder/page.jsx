
"use client";
import { useState } from "react";

export default function Builder(){
  const [url,setUrl]=useState("");
  const [loading,setLoading]=useState(false);

  async function submit(e){
    e.preventDefault();
    setLoading(true);
    const data=Object.fromEntries(new FormData(e.target).entries());
    const r=await fetch("/api/generate-site",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
    const j=await r.json();
    setUrl(j.url||"");
    setLoading(false);
  }

  return <form onSubmit={submit} style={{display:"flex",flexDirection:"column",gap:10,padding:20}}>
    <input name="metier" placeholder="metier" required />
    <input name="nom_enseigne" placeholder="nom enseigne" required />
    <input name="ville" placeholder="ville" required />
    <input name="adresse" placeholder="adresse" required />
    <input name="telephone" placeholder="téléphone" required />
    <input name="email" type="email" placeholder="email contact" required />
    <label><input type="checkbox" name="betty_on" defaultChecked /> activer Betty</label>
    <button>{loading?"Création…":"Créer"}</button>
    {url && <p>Lien : <a href={url}>{url}</a></p>}
  </form>
}
