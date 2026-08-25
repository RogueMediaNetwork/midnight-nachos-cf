interface Env { STORIES_KV: KVNamespace; }

type Coordinate = { latitude: number; longitude: number; area: string };
type OverpassElement = { type: string; id: number; lat?: number; lon?: number; center?: { lat: number; lon: number }; tags?: Record<string, string> };
type DirectoryListing = { id: string; name: string; kind: string; address: string; distanceMiles: number; latitude: number; longitude: number };

const MAX_RADIUS_METERS = 16_093;
const CACHE_SECONDS = 60 * 60;
const SEARCH_TERMS = "cannabis|dispensary|smoke|vape|head[ _-]?shop|cbd|hemp|gumm(y|ies)";

function json(body: unknown, init: ResponseInit = {}) {
  return Response.json(body, { ...init, headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=900", ...(init.headers ?? {}) } });
}

function isLatitude(value: number) { return Number.isFinite(value) && value >= -90 && value <= 90; }
function isLongitude(value: number) { return Number.isFinite(value) && value >= -180 && value <= 180; }

async function fetchWithTimeout(url: string, init: RequestInit = {}, timeout = 8_000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try { return await fetch(url, { ...init, signal: controller.signal }); }
  finally { clearTimeout(timer); }
}

async function coordinateForZip(zip: string): Promise<Coordinate | null> {
  const endpoint = new URL("https://nominatim.openstreetmap.org/search");
  endpoint.searchParams.set("postalcode", zip);
  endpoint.searchParams.set("countrycodes", "us");
  endpoint.searchParams.set("format", "jsonv2");
  endpoint.searchParams.set("limit", "1");
  const response = await fetchWithTimeout(endpoint.toString(), { headers: { Accept: "application/json", "Accept-Language": "en" } });
  if (!response.ok) throw new Error("Location lookup is unavailable right now.");
  const locations = await response.json() as Array<{ lat?: string; lon?: string; display_name?: string }>;
  const location = locations[0];
  const latitude = Number(location?.lat);
  const longitude = Number(location?.lon);
  return isLatitude(latitude) && isLongitude(longitude) ? { latitude, longitude, area: location.display_name?.split(",").slice(0, 2).join(",") || `ZIP ${zip}` } : null;
}

function distanceMiles(origin: Coordinate, latitude: number, longitude: number) {
  const radians = (value: number) => value * Math.PI / 180;
  const deltaLatitude = radians(latitude - origin.latitude);
  const deltaLongitude = radians(longitude - origin.longitude);
  const value = Math.sin(deltaLatitude / 2) ** 2 + Math.cos(radians(origin.latitude)) * Math.cos(radians(latitude)) * Math.sin(deltaLongitude / 2) ** 2;
  return 3_958.8 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function kindFor(tags: Record<string, string>) {
  if (tags.shop === "cannabis" || /dispensary|cannabis/i.test(tags.name || "")) return "Dispensary";
  if (tags.shop === "vape" || /vape/i.test(tags.name || "")) return "Smoke & vape";
  if (tags.shop === "tobacco" || /smoke|head[ _-]?shop/i.test(tags.name || "")) return "Smoke shop";
  if (tags.shop === "herbalist" || /cbd|hemp|gumm/i.test(tags.name || "")) return "CBD & hemp";
  return "Accessories & goods";
}

function addressFor(tags: Record<string, string>) {
  const lineOne = [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" ");
  const lineTwo = [tags["addr:city"], tags["addr:state"], tags["addr:postcode"]].filter(Boolean).join(", ");
  return [lineOne, lineTwo].filter(Boolean).join(" · ");
}

function listingsFrom(elements: OverpassElement[], origin: Coordinate) {
  const unique = new Map<string, DirectoryListing>();
  for (const element of elements) {
    const tags = element.tags ?? {};
    const latitude = element.lat ?? element.center?.lat;
    const longitude = element.lon ?? element.center?.lon;
    const name = tags.name || tags.brand;
    if (!name || !isLatitude(latitude ?? NaN) || !isLongitude(longitude ?? NaN)) continue;
    const listing: DirectoryListing = { id: `${element.type}-${element.id}`, name, kind: kindFor(tags), address: addressFor(tags), distanceMiles: distanceMiles(origin, latitude!, longitude!), latitude: latitude!, longitude: longitude! };
    unique.set(listing.id, listing);
  }
  return [...unique.values()].sort((left, right) => left.distanceMiles - right.distanceMiles).slice(0, 18);
}

export const onRequestGet: PagesFunction<Env> = async ({ request, env }) => {
  const url = new URL(request.url);
  const zip = url.searchParams.get("zip")?.trim() || "";
  const latitude = Number(url.searchParams.get("lat"));
  const longitude = Number(url.searchParams.get("lon"));
  let origin: Coordinate | null;
  let cacheKey: string;

  try {
    if (zip) {
      if (!/^\d{5}(?:-\d{4})?$/.test(zip)) return json({ error: "Use a five-digit U.S. ZIP code." }, { status: 400 });
      cacheKey = `nearby-shops:zip:${zip}`;
      const cached = await env.STORIES_KV.get<unknown>(cacheKey, "json");
      if (cached) return json(cached, { headers: { "x-directory-cache": "HIT" } });
      origin = await coordinateForZip(zip);
    } else {
      if (!isLatitude(latitude) || !isLongitude(longitude)) return json({ error: "Share a location or enter a U.S. ZIP code." }, { status: 400 });
      const roundedLatitude = latitude.toFixed(2);
      const roundedLongitude = longitude.toFixed(2);
      cacheKey = `nearby-shops:point:${roundedLatitude}:${roundedLongitude}`;
      const cached = await env.STORIES_KV.get<unknown>(cacheKey, "json");
      if (cached) return json(cached, { headers: { "x-directory-cache": "HIT" } });
      origin = { latitude, longitude, area: "your current area" };
    }
    if (!origin) return json({ error: "We could not find that ZIP code. Try another nearby ZIP." }, { status: 404 });

    const query = `[out:json][timeout:10];(nwr(around:${MAX_RADIUS_METERS},${origin.latitude},${origin.longitude})["shop"="cannabis"];nwr(around:${MAX_RADIUS_METERS},${origin.latitude},${origin.longitude})["shop"="tobacco"];nwr(around:${MAX_RADIUS_METERS},${origin.latitude},${origin.longitude})["shop"="vape"];nwr(around:${MAX_RADIUS_METERS},${origin.latitude},${origin.longitude})["shop"="herbalist"];nwr(around:${MAX_RADIUS_METERS},${origin.latitude},${origin.longitude})["name"~"${SEARCH_TERMS}",i];);out center tags 60;`;
    const response = await fetchWithTimeout("https://overpass-api.de/api/interpreter", { method: "POST", headers: { "content-type": "application/x-www-form-urlencoded", Accept: "application/json" }, body: new URLSearchParams({ data: query }).toString() });
    if (!response.ok) throw new Error("Directory search is temporarily unavailable.");
    const payload = await response.json() as { elements?: OverpassElement[] };
    const body = { listings: listingsFrom(payload.elements ?? [], origin), area: origin.area, source: "OpenStreetMap" };
    await env.STORIES_KV.put(cacheKey, JSON.stringify(body), { expirationTtl: CACHE_SECONDS });
    return json(body, { headers: { "x-directory-cache": "MISS" } });
  } catch (error) {
    console.error("nearby shops failed", error);
    return json({ error: "Directory search is temporarily unavailable. Try again in a moment." }, { status: 502 });
  }
};
