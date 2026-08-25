import { clearAdminCookie, isAdmin, noStoreJson, type AdminEnv } from "../../_lib/admin";
export const onRequestGet: PagesFunction<AdminEnv> = async ({ request, env }) => noStoreJson({ authenticated: await isAdmin(request, env) });
export const onRequestDelete: PagesFunction<AdminEnv> = async () => noStoreJson({ ok: true }, { headers: { "set-cookie": clearAdminCookie() } });
