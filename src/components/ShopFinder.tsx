import { FormEvent, useState } from "react";
import { Clock3, LocateFixed, MapPinned, Navigation, Phone, Search, Star, Store, X } from "lucide-react";

type Listing = {
  id: string;
  name: string;
  kind: string;
  address: string;
  distanceMiles: number;
  latitude: number;
  longitude: number;
  mapUrl?: string;
  phone?: string;
  rating?: number;
  ratingCount?: number;
  openNow?: boolean;
};

type FinderResponse = { listings: Listing[]; area: string; source: string; fullSearchUrl?: string };

function mapLink(listing: Listing) {
  return listing.mapUrl || `https://www.openstreetmap.org/?mlat=${listing.latitude}&mlon=${listing.longitude}#map=18/${listing.latitude}/${listing.longitude}`;
}

export default function ShopFinder() {
  const [zip, setZip] = useState("");
  const [listings, setListings] = useState<Listing[]>([]);
  const [area, setArea] = useState("");
  const [status, setStatus] = useState("Enter a U.S. ZIP code, or use your current location.");
  const [loading, setLoading] = useState(false);
  const [source, setSource] = useState("");
  const [fullSearchUrl, setFullSearchUrl] = useState("");

  const loadListings = async (params: URLSearchParams) => {
    setLoading(true);
    setStatus("Looking around the neighborhood…");
    try {
      const response = await fetch(`/api/nearby-shops?${params.toString()}`);
      const data = await response.json() as FinderResponse & { error?: string };
      if (!response.ok) throw new Error(data.error || "The directory is taking a breather. Try again in a moment.");
      setListings(data.listings);
      setArea(data.area);
      setSource(data.source);
      setFullSearchUrl(data.fullSearchUrl || "");
      setStatus(data.listings.length ? `${data.listings.length} nearby places, sorted by distance.` : "No matches in this radius yet. Try a nearby ZIP code.");
    } catch (error) {
      setListings([]);
      setArea("");
      setSource("");
      setFullSearchUrl("");
      setStatus(error instanceof Error ? error.message : "The directory is taking a breather. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  const searchZip = (event: FormEvent) => {
    event.preventDefault();
    const value = zip.trim();
    if (!/^\d{5}(?:-\d{4})?$/.test(value)) {
      setStatus("Add a five-digit U.S. ZIP code to search the directory.");
      return;
    }
    void loadListings(new URLSearchParams({ zip: value }));
  };

  const useLocation = () => {
    if (!navigator.geolocation) {
      setStatus("This browser cannot share a location. A ZIP code works just as well.");
      return;
    }
    setStatus("Waiting for your browser’s location permission…");
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => void loadListings(new URLSearchParams({ lat: String(coords.latitude), lon: String(coords.longitude) })),
      () => setStatus("No problem—location was not shared. Enter a ZIP code instead."),
      { enableHighAccuracy: false, timeout: 12_000, maximumAge: 300_000 },
    );
  };

  return (
    <section className="mn-shop-finder" aria-labelledby="shop-finder-title">
      <div className="mn-shop-finder__intro">
        <div>
          <span className="mn-shop-finder__kicker"><MapPinned aria-hidden="true" /> Local directory</span>
          <h2 id="shop-finder-title">Find the late-night goods nearby.</h2>
          <p>Dispensaries, smoke and vape shops, CBD and hemp spots, gummies, and the accessory shelves around you.</p>
        </div>
        <aside>
          <Store aria-hidden="true" />
          <span>Choose a ZIP code or let your browser share an approximate location. We do not save it.</span>
        </aside>
      </div>

      <form className="mn-shop-finder__form" onSubmit={searchZip}>
        <label>
          <span>U.S. ZIP code</span>
          <input value={zip} onChange={(event) => setZip(event.target.value)} inputMode="numeric" autoComplete="postal-code" placeholder="e.g. 78701" maxLength={10} disabled={loading} />
        </label>
        <button type="submit" disabled={loading}><Search aria-hidden="true" /> Search nearby</button>
        <button type="button" className="mn-shop-finder__location" onClick={useLocation} disabled={loading}><LocateFixed aria-hidden="true" /> Use my location</button>
      </form>

      <p className="mn-shop-finder__status" role="status" aria-live="polite">{loading ? <span className="mn-shop-finder__spinner" aria-hidden="true" /> : null}{status}</p>

      {area ? <div className="mn-shop-finder__results-head"><span>Showing around {area}{source ? ` · ${source}` : ""}</span><button type="button" onClick={() => { setListings([]); setArea(""); setSource(""); setFullSearchUrl(""); setStatus("Enter another ZIP code, or use your current location."); }}><X aria-hidden="true" /> Clear</button></div> : null}
      {listings.length ? (
        <div className="mn-shop-finder__results">
          {listings.map((listing, index) => (
            <a key={listing.id} href={mapLink(listing)} target="_blank" rel="noreferrer" className={index === 0 ? "mn-shop-finder__place mn-shop-finder__place--lead" : "mn-shop-finder__place"}>
              <span className="mn-shop-finder__distance">{listing.distanceMiles < 0.1 ? "Nearby" : `${listing.distanceMiles.toFixed(1)} mi`}</span>
              <div><strong>{listing.name}</strong><span>{listing.kind}</span><p>{listing.address || "Address not listed in the directory"}</p>{listing.rating ? <p className="mn-shop-finder__place-meta"><Star aria-hidden="true" /> {listing.rating.toFixed(1)}{listing.ratingCount ? ` (${listing.ratingCount})` : ""}{listing.openNow !== undefined ? <><Clock3 aria-hidden="true" /> {listing.openNow ? "Open now" : "Closed now"}</> : null}{listing.phone ? <><Phone aria-hidden="true" /> {listing.phone}</> : null}</p> : null}</div>
              <Navigation aria-hidden="true" />
            </a>
          ))}
        </div>
      ) : null}

      {fullSearchUrl ? <a className="mn-shop-finder__maps-link" href={fullSearchUrl} target="_blank" rel="noreferrer">See the full Google Maps search <Navigation aria-hidden="true" /></a> : null}

      <p className="mn-shop-finder__fineprint">Directory data © OpenStreetMap contributors. Listings and local rules can change—confirm products, age requirements, and legal availability directly with the shop.</p>
    </section>
  );
}
