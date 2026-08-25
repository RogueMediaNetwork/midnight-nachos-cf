interface Env { STORIES_KV: KVNamespace; GOOGLE_PLACES_API_KEY?: string; }

type Coordinate = { latitude: number; longitude: number; area: string };
type PhotonFeature = { geometry?: { coordinates?: [number, number] }; properties?: Record<string, string | number | undefined> };
type DirectoryListing = { id: string; name: string; kind: string; address: string; distanceMiles: number; latitude: number; longitude: number; mapUrl?: string; phone?: string; rating?: number; ratingCount?: number; openNow?: boolean };
type GooglePlace = { id?: string; displayName?: { text?: string }; formattedAddress?: string; location?: { latitude?: number; longitude?: number }; googleMapsUri?: string; primaryTypeDisplayName?: { text?: string }; types?: string[]; nationalPhoneNumber?: string; rating?: number; userRatingCount?: number; currentOpeningHours?: { openNow?: boolean } };

const CACHE_SECONDS = 60 * 60;
const DIRECTORY_TERMS = ["dispensary", "smoke shop", "vape shop", "cbd", "hemp", "gummies"];

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
  const response = await fetchWithTimeout(`https://api.zippopotam.us/us/${encodeURIComponent(zip)}`, { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Location lookup is unavailable right now.");
  const location = await response.json() as { places?: Array<{ latitude?: string; longitude?: string; "place name"?: string; "state abbreviation"?: string }> };
  const place = location.places?.[0];
  const latitude = Number(place?.latitude);
  const longitude = Number(place?.longitude);
  const area = [place?.["place name"], place?.["state abbreviation"]].filter(Boolean).join(", ");
  return isLatitude(latitude) && isLongitude(longitude) ? { latitude, longitude, area: area || `ZIP ${zip}` } : null;
}

function distanceMiles(origin: Coordinate, latitude: number, longitude: number) {
  const radians = (value: number) => value * Math.PI / 180;
  const deltaLatitude = radians(latitude - origin.latitude);
  const deltaLongitude = radians(longitude - origin.longitude);
  const value = Math.sin(deltaLatitude / 2) ** 2 + Math.cos(radians(origin.latitude)) * Math.cos(radians(latitude)) * Math.sin(deltaLongitude / 2) ** 2;
  return 3_958.8 * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
}

function kindFor(properties: Record<string, string | number | undefined>) {
  const text = `${properties.name || ""} ${properties.osm_value || ""} ${properties.type || ""}`;
  if (/dispensary|cannabis/i.test(text)) return "Dispensary";
  if (/vape/i.test(text)) return "Smoke & vape";
  if (/smoke|tobacco|head[ _-]?shop/i.test(text)) return "Smoke shop";
  if (/cbd|hemp|gumm/i.test(text)) return "CBD & hemp";
  return "Accessories & goods";
}

function addressFor(properties: Record<string, string | number | undefined>) {
  const lineOne = [properties.housenumber, properties.street].filter(Boolean).join(" ");
  const lineTwo = [properties.city, properties.state, properties.postcode].filter(Boolean).join(", ");
  return [lineOne, lineTwo].filter(Boolean).join(" · ");
}

function listingsFrom(features: PhotonFeature[], origin: Coordinate) {
  const unique = new Map<string, DirectoryListing>();
  for (const feature of features) {
    const properties = feature.properties ?? {};
    const [longitude, latitude] = feature.geometry?.coordinates ?? [];
    const name = typeof properties.name === "string" ? properties.name : undefined;
    if (!name || !isLatitude(latitude ?? NaN) || !isLongitude(longitude ?? NaN)) continue;
    const listing: DirectoryListing = { id: `${properties.osm_type || "place"}-${properties.osm_id || `${latitude}-${longitude}`}`, name, kind: kindFor(properties), address: addressFor(properties), distanceMiles: distanceMiles(origin, latitude!, longitude!), latitude: latitude!, longitude: longitude! };
    unique.set(listing.id, listing);
  }
  return [...unique.values()].sort((left, right) => left.distanceMiles - right.distanceMiles).slice(0, 18);
}

async function googleListings(origin: Coordinate, key: string) {
  const fieldMask = "places.id,places.displayName,places.formattedAddress,places.location,places.googleMapsUri,places.primaryTypeDisplayName,places.types,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.currentOpeningHours";
  const responses = await Promise.all(DIRECTORY_TERMS.map(async term => {
    const response = await fetchWithTimeout("https://places.googleapis.com/v1/places:searchText", {
      method: "POST",
      headers: { "content-type": "application/json", "X-Goog-Api-Key": key, "X-Goog-FieldMask": fieldMask },
      body: JSON.stringify({ textQuery: `${term} near ${origin.area}`, maxResultCount: 20, languageCode: "en", regionCode: "US", locationBias: { circle: { center: { latitude: origin.latitude, longitude: origin.longitude }, radius: 30_000 } } }),
    }, 12_000);
    if (!response.ok) throw new Error("Google Places is temporarily unavailable.");
    return response.json() as Promise<{ places?: GooglePlace[] }>;
  }));
  const unique = new Map<string, DirectoryListing>();
  for (const place of responses.flatMap(response => response.places ?? [])) {
    const latitude = place.location?.latitude;
    const longitude = place.location?.longitude;
    const name = place.displayName?.text;
    if (!place.id || !name || !isLatitude(latitude ?? NaN) || !isLongitude(longitude ?? NaN)) continue;
    unique.set(place.id, { id: place.id, name, kind: place.primaryTypeDisplayName?.text || place.types?.[0]?.replace(/_/g, " ") || "Local shop", address: place.formattedAddress || "", distanceMiles: distanceMiles(origin, latitude!, longitude!), latitude: latitude!, longitude: longitude!, mapUrl: place.googleMapsUri, phone: place.nationalPhoneNumber, rating: place.rating, ratingCount: place.userRatingCount, openNow: place.currentOpeningHours?.openNow });
  }
  return [...unique.values()].sort((left, right) => left.distanceMiles - right.distanceMiles).slice(0, 30);
}

function photonUrl(origin: Coordinate, query: string) {
  const latitudeDelta = 0.12;
  const longitudeDelta = Math.min(0.22, latitudeDelta / Math.max(Math.cos(origin.latitude * Math.PI / 180), 0.25));
  const url = new URL("https://photon.komoot.io/api/");
  url.searchParams.set("q", query);
  url.searchParams.set("lat", String(origin.latitude));
  url.searchParams.set("lon", String(origin.longitude));
  url.searchParams.set("bbox", `${origin.longitude - longitudeDelta},${origin.latitude - latitudeDelta},${origin.longitude + longitudeDelta},${origin.latitude + latitudeDelta}`);
  url.searchParams.set("limit", "20");
  url.searchParams.set("osm_tag", "shop");
  return url.toString();
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
      cacheKey = `nearby-shops:${env.GOOGLE_PLACES_API_KEY ? "google" : "public"}:zip:${zip}`;
      const cached = await env.STORIES_KV.get<unknown>(cacheKey, "json");
      if (cached) return json(cached, { headers: { "x-directory-cache": "HIT" } });
      origin = await coordinateForZip(zip);
    } else {
      if (!isLatitude(latitude) || !isLongitude(longitude)) return json({ error: "Share a location or enter a U.S. ZIP code." }, { status: 400 });
      const roundedLatitude = latitude.toFixed(2);
      const roundedLongitude = longitude.toFixed(2);
      cacheKey = `nearby-shops:${env.GOOGLE_PLACES_API_KEY ? "google" : "public"}:point:${roundedLatitude}:${roundedLongitude}`;
      const cached = await env.STORIES_KV.get<unknown>(cacheKey, "json");
      if (cached) return json(cached, { headers: { "x-directory-cache": "HIT" } });
      origin = { latitude, longitude, area: "your current area" };
    }
    if (!origin) return json({ error: "We could not find that ZIP code. Try another nearby ZIP." }, { status: 404 });

    const listings = env.GOOGLE_PLACES_API_KEY
      ? await googleListings(origin, env.GOOGLE_PLACES_API_KEY)
      : listingsFrom((await Promise.all(DIRECTORY_TERMS.map(async term => {
          const response = await fetchWithTimeout(photonUrl(origin!, term), { headers: { Accept: "application/json" } }, 8_000);
          if (!response.ok) throw new Error("Directory search is temporarily unavailable.");
          return response.json() as Promise<{ features?: PhotonFeature[] }>;
        }))).flatMap(response => response.features ?? []), origin);
    const body = { listings, area: origin.area, source: env.GOOGLE_PLACES_API_KEY ? "Google Places" : "OpenStreetMap via Photon", fullSearchUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`CBD, smoke shop, dispensary, vape shop, glass shop near ${origin.area}`)}` };
    await env.STORIES_KV.put(cacheKey, JSON.stringify(body), { expirationTtl: CACHE_SECONDS });
    return json(body, { headers: { "x-directory-cache": "MISS" } });
  } catch (error) {
    console.error("nearby shops failed", error);
    return json({ error: "Directory search is temporarily unavailable. Try again in a moment." }, { status: 502 });
  }
};
