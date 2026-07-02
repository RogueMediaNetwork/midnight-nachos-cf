interface Env {
  EVENT_KV: KVNamespace;
  ADMIN_KEY?: string;
}

const SEED_ANNOUNCEMENTS = [
  {
    id: "ann-welcome",
    title: "Welcome to the YOU × AI Summit app",
    body: "Build your agenda, meet the speakers, submit questions for sessions, and ask the AI concierge anything about the day. See you September 12 in Waco.",
    priority: "info",
    createdAt: new Date("2026-07-01T09:00:00-05:00").toISOString(),
  },
  {
    id: "ann-lineup",
    title: "Full speaker lineup dropping soon",
    body: "More practitioner speakers are being announced over the coming months. Watch this feed and youxai.live for reveals.",
    priority: "info",
    createdAt: new Date("2026-07-01T09:05:00-05:00").toISOString(),
  },
];

async function getAnnouncements(kv: KVNamespace) {
  const data = (await kv.get("announcements", "json")) as any[] | null;
  if (!data) {
    await kv.put("announcements", JSON.stringify(SEED_ANNOUNCEMENTS));
    return SEED_ANNOUNCEMENTS;
  }
  return data;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const announcements = await getAnnouncements(env.EVENT_KV);
    announcements.sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return Response.json(announcements);
  } catch {
    return Response.json({ error: "Failed to load announcements" }, { status: 500 });
  }
};

// Organizer-only: POST with header `x-admin-key: <ADMIN_KEY>` to publish an
// announcement. Requires the ADMIN_KEY environment variable to be set.
export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    if (!env.ADMIN_KEY || request.headers.get("x-admin-key") !== env.ADMIN_KEY) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, body, priority } = (await request.json()) as any;
    if (!title || !body) {
      return Response.json({ error: "Title and body are required" }, { status: 400 });
    }

    const announcements = await getAnnouncements(env.EVENT_KV);
    const announcement = {
      id: `ann-${Date.now()}`,
      title: String(title).trim().substring(0, 120),
      body: String(body).trim().substring(0, 1000),
      priority: priority === "important" ? "important" : "info",
      createdAt: new Date().toISOString(),
    };

    announcements.push(announcement);
    await env.EVENT_KV.put("announcements", JSON.stringify(announcements));
    return Response.json(announcement, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to publish announcement" }, { status: 500 });
  }
};
