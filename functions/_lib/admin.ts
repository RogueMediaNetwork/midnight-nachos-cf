export interface AdminEnv { COMMUNITY_DB: D1Database; STORIES_KV: KVNamespace; ADMIN_PASSWORD?: string; }
export const AD_SLOTS = ["hero", "stream", "footer"] as const;
export type AdSlot = typeof AD_SLOTS[number];
export interface StoredAd { slot: AdSlot; image_key: string | null; image_alt: string; href: string; enabled: number; updated_at: string; }
const encoder = new TextEncoder();
const SESSION_SECONDS = 60 * 60 * 8;
function getCookie(request: Request, name: string) { return request.headers.get("cookie")?.split(";").map(value => value.trim()).find(value => value.startsWith(`${name}=`))?.slice(name.length + 1) ?? ""; }
function toBase64Url(value: Uint8Array | string) { const text = typeof value === "string" ? value : String.fromCharCode(...value); return btoa(text).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, ""); }
function fromBase64Url(value: string) { const padded = value.replace(/-/g, "+").replace(/_/g, "/") + "=".repeat((4 - value.length % 4) % 4); return Uint8Array.from(atob(padded), char => char.charCodeAt(0)); }
async function sessionSignature(payload: string, password: string) { const key = await crypto.subtle.importKey("raw", encoder.encode(password), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]); return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(payload))); }
export async function createSession(password: string) { const payload = JSON.stringify({ exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS }); return `${toBase64Url(payload)}.${toBase64Url(await sessionSignature(payload, password))}`; }
export async function isAdmin(request: Request, env: AdminEnv) { if (!env.ADMIN_PASSWORD) return false; const [encodedPayload, encodedSignature] = getCookie(request, "mn_backstage").split("."); if (!encodedPayload || !encodedSignature) return false; try { const payload = new TextDecoder().decode(fromBase64Url(encodedPayload)); const session = JSON.parse(payload) as { exp?: number }; if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) return false; const expected = await sessionSignature(payload, env.ADMIN_PASSWORD); const received = fromBase64Url(encodedSignature); if (received.length !== expected.length) return false; let different = 0; for (let index = 0; index < expected.length; index += 1) different |= expected[index] ^ received[index]; return different === 0; } catch { return false; } }
export function adminCookie(token: string) { return `mn_backstage=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_SECONDS}`; }
export function clearAdminCookie() { return "mn_backstage=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0"; }
export function isSlot(value: unknown): value is AdSlot { return typeof value === "string" && AD_SLOTS.includes(value as AdSlot); }
export function imageUrl(origin: string, imageKey: string | null) { return imageKey ? `${origin}/api/ad-image/${encodeURIComponent(imageKey)}` : ""; }
export async function getAds(env: AdminEnv) { const result = await env.COMMUNITY_DB.prepare("SELECT slot, image_key, image_alt, href, enabled, updated_at FROM ads ORDER BY slot").all<StoredAd>(); const bySlot = new Map(result.results.map(ad => [ad.slot, ad])); return AD_SLOTS.map(slot => bySlot.get(slot) ?? { slot, image_key: null, image_alt: "", href: "", enabled: 0, updated_at: "" }); }
export function noStoreJson(body: unknown, init?: ResponseInit) { return Response.json(body, { ...init, headers: { "cache-control": "no-store", ...(init?.headers ?? {}) } }); }
export function arrayBufferToBase64(buffer: ArrayBuffer) { const bytes = new Uint8Array(buffer); let binary = ""; for (let start = 0; start < bytes.length; start += 0x8000) binary += String.fromCharCode(...bytes.subarray(start, start + 0x8000)); return btoa(binary); }
export function base64ToBytes(value: string) { return Uint8Array.from(atob(value), character => character.charCodeAt(0)); }
