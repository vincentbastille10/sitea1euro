
import { kv } from "@vercel/kv";

export async function createSite(site){
  await kv.hset(`site:${site.slug}`,site);
  return site;
}

export async function getSiteBySlug(slug){
  const data=await kv.hgetall(`site:${slug}`);
  if(!data || !data.slug) return null;
  return data;
}
