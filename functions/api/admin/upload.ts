import { arrayBufferToBase64, imageUrl, isAdmin, noStoreJson, type AdminEnv } from "../../_lib/admin";
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024;
const mimeToExtension: Record<string, string> = { "image/png": "png", "image/jpeg": "jpg", "image/webp": "webp", "image/gif": "gif" };
export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  try {
    if (!await isAdmin(request, env)) return noStoreJson({ error: "Sign in required." }, { status: 401 });
    const file = (await request.formData()).get("image");
    if (!(file instanceof File) || !mimeToExtension[file.type] || file.size < 1 || file.size > MAX_UPLOAD_BYTES) return noStoreJson({ error: "Use a PNG, JPEG, WebP, or GIF under 3 MB." }, { status: 400 });
    const key = `ad-${crypto.randomUUID()}.${mimeToExtension[file.type]}`;
    await env.STORIES_KV.put(`ad-asset:${key}`, JSON.stringify({ contentType: file.type, data: arrayBufferToBase64(await file.arrayBuffer()) }));
    return noStoreJson({ imageKey: key, imageUrl: imageUrl(new URL(request.url).origin, key) }, { status: 201 });
  } catch (error) {
    return noStoreJson({ error: error instanceof Error ? error.message : "Banner upload failed." }, { status: 500 });
  }
};
