import { adminCookie, createSession, noStoreJson, type AdminEnv } from "../../_lib/admin";
export const onRequestPost: PagesFunction<AdminEnv> = async ({ request, env }) => {
  if (!env.ADMIN_PASSWORD) return noStoreJson({ error: "Backstage is not configured yet." }, { status: 503 });
  const { password } = await request.json() as { password?: string };
  if (typeof password !== "string" || password !== env.ADMIN_PASSWORD) return noStoreJson({ error: "That password did not work." }, { status: 401 });
  return noStoreJson({ ok: true }, { headers: { "set-cookie": adminCookie(await createSession(env.ADMIN_PASSWORD)) } });
};
