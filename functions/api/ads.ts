import { getAds, imageUrl, type AdminEnv } from "../_lib/admin";

export const onRequestGet: PagesFunction<AdminEnv> = async ({ env, request }) => {
  const origin = new URL(request.url).origin;
  const ads = await getAds(env);
  return Response.json(ads.filter(ad => ad.enabled && ad.image_key && ad.href).map(ad => ({ slot: ad.slot, imageUrl: imageUrl(origin, ad.image_key), alt: ad.image_alt, href: ad.href })), { headers: { "cache-control": "public, max-age=60" } });
};
