interface Env {
  STORIES_KV: KVNamespace;
  COMMUNITY_DB: D1Database;
}

const clientAddress = (request: Request) => request.headers.get("CF-Connecting-IP")
  || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()
  || "local-development";

const commenterHash = async (request: Request) => {
  const value = `midnight-nachos/v1/comment/${clientAddress(request)}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

async function storyExists(kv: KVNamespace, id: string) {
  const stories = await kv.get("stories", "json") as Array<{ id: string }> | null;
  return Boolean(stories?.some(story => story.id === id));
}

export const onRequestGet: PagesFunction<Env> = async ({ params, env }) => {
  const storyId = params.id as string;
  const result = await env.COMMUNITY_DB.prepare(
    "SELECT id, content, created_at AS createdAt FROM story_comments WHERE story_id = ? ORDER BY created_at ASC LIMIT 40"
  ).bind(storyId).all<{ id: string; content: string; createdAt: string }>();
  return Response.json(result.results);
};

export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  const storyId = params.id as string;
  try {
    const body = await request.json() as { content?: string };
    const content = String(body.content || "").trim().slice(0, 600);
    if (content.length < 3) return Response.json({ error: "Comments need at least 3 characters." }, { status: 400 });
    if (!await storyExists(env.STORIES_KV, storyId)) return Response.json({ error: "Story not found" }, { status: 404 });

    const voterHash = await commenterHash(request);
    const now = Date.now();
    const limit = await env.COMMUNITY_DB.prepare(
      "SELECT last_comment_at FROM comment_rate_limits WHERE voter_hash = ?"
    ).bind(voterHash).first<{ last_comment_at: number }>();
    if (limit && now - Number(limit.last_comment_at) < 45_000) {
      return Response.json({ error: "Please give the conversation a moment before posting again." }, { status: 429 });
    }

    const comment = { id: crypto.randomUUID(), content, createdAt: new Date(now).toISOString() };
    await env.COMMUNITY_DB.batch([
      env.COMMUNITY_DB.prepare(
        "INSERT INTO story_comments (id, story_id, voter_hash, content, created_at) VALUES (?, ?, ?, ?, ?)"
      ).bind(comment.id, storyId, voterHash, content, comment.createdAt),
      env.COMMUNITY_DB.prepare(
        "INSERT INTO comment_rate_limits (voter_hash, last_comment_at) VALUES (?, ?) ON CONFLICT(voter_hash) DO UPDATE SET last_comment_at = excluded.last_comment_at"
      ).bind(voterHash, now),
    ]);
    return Response.json(comment, { status: 201 });
  } catch {
    return Response.json({ error: "Could not post that comment right now." }, { status: 500 });
  }
};
