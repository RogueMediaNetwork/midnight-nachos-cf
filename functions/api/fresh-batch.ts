const GREEN_WIRE_URL = "https://green-wire-news.mike-663.workers.dev/api/stories";

export const onRequestGet: PagesFunction = async () => {
  try {
    const response = await fetch(GREEN_WIRE_URL, {
      headers: { Accept: "application/json" },
      cf: { cacheTtl: 900, cacheEverything: true },
    });
    if (!response.ok) throw new Error(`Green Wire returned ${response.status}`);
    const body = await response.text();
    return new Response(body, {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, max-age=900",
      },
    });
  } catch {
    return Response.json({ stories: [], updatedAt: null }, { status: 200 });
  }
};
