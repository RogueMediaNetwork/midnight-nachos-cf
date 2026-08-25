import { base64ToBytes, type AdminEnv } from "../../_lib/admin";

export const onRequestGet: PagesFunction<AdminEnv> = async ({ env, params }) => {
  const key = String(params.key || "");
  if (!/^ad-[a-z0-9-]+\.(png|jpe?g|webp|gif)$/i.test(key)) return new Response("Not found", { status: 404 });
  const asset = await env.STORIES_KV.get(`ad-asset:${key}`, "json") as { contentType?: string; data?: string } | null;
  if (!asset?.data || !asset.contentType) return new Response("Not found", { status: 404 });
  return new Response(base64ToBytes(asset.data), { headers: { "content-type": asset.contentType, "cache-control": "public, max-age=31536000, immutable" } });
};
