import { getAds, imageUrl, isAdmin, isSlot, noStoreJson, type AdminEnv } from "../../_lib/admin";
function validUrl(value: string) { try { const url = new URL(value); return url.protocol === "https:" || url.protocol === "http:"; } catch { return false; } }
export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => { if (!await isAdmin(request, env)) return noStoreJson({ error: "Sign in required." }, { status: 401 }); const origin = new URL(request.url).origin; return noStoreJson((await getAds(env)).map(ad => ({ ...ad, imageUrl: imageUrl(origin, ad.image_key) }))); };
export const onRequestPut: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!await isAdmin(request, env)) return noStoreJson({ error: "Sign in required." }, { status: 401 });
  const body = await request.json() as { slot?: unknown; imageKey?: unknown; alt?: unknown; href?: unknown; enabled?: unknown };
  if (!isSlot(body.slot)) return noStoreJson({ error: "Unknown ad placement." }, { status: 400 });
  const imageKey = typeof body.imageKey === "string" && /^ad-[a-z0-9-]+\.(png|jpe?g|webp|gif)$/i.test(body.imageKey) ? body.imageKey : null;
  const href = typeof body.href === "string" ? body.href.trim().slice(0, 2000) : ""; const alt = typeof body.alt === "string" ? body.alt.trim().slice(0, 180) : "";
  const enabled = body.enabled === true && Boolean(imageKey) && validUrl(href) ? 1 : 0;
  await env.COMMUNITY_DB.prepare("INSERT INTO ads (slot, image_key, image_alt, href, enabled, updated_at) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP) ON CONFLICT(slot) DO UPDATE SET image_key=excluded.image_key, image_alt=excluded.image_alt, href=excluded.href, enabled=excluded.enabled, updated_at=CURRENT_TIMESTAMP").bind(body.slot, imageKey, alt, href, enabled).run();
  return noStoreJson({ ok: true, enabled: Boolean(enabled) });
};
