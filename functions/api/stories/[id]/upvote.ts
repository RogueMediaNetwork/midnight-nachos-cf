interface Env {
  STORIES_KV: KVNamespace;
  COMMUNITY_DB: D1Database;
}

async function getStories(kv: KVNamespace) {
  const data = await kv.get("stories", "json") as any[] | null;
  return data || [];
}

const clientAddress = (request: Request) => request.headers.get("CF-Connecting-IP")
  || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim()
  || "local-development";

const voteHash = async (request: Request, storyId: string) => {
  const value = `midnight-nachos/v1/vote/${storyId}/${clientAddress(request)}`;
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map(byte => byte.toString(16).padStart(2, "0")).join("");
};

const responseCount = async (env: Env, storyId: string, baseVotes: number) => {
  const total = await env.COMMUNITY_DB.prepare(
    "SELECT COUNT(*) AS votes FROM story_votes WHERE story_id = ?"
  ).bind(storyId).first<{ votes: number }>();
  return baseVotes + Number(total?.votes || 0);
};

export const onRequestPost: PagesFunction<Env> = async ({ params, env, request }) => {
  try {
    const id = params.id as string;
    const stories = await getStories(env.STORIES_KV);
    const idx = stories.findIndex((s: any) => s.id === id);
    if (idx === -1) return Response.json({ error: "Story not found" }, { status: 404 });
    const hash = await voteHash(request, id);
    try {
      await env.COMMUNITY_DB.prepare(
        "INSERT INTO story_votes (story_id, voter_hash) VALUES (?, ?)"
      ).bind(id, hash).run();
    } catch {
      return Response.json({
        alreadyVoted: true,
        upvotes: await responseCount(env, id, Number(stories[idx].upvotes || 0)),
      }, { status: 409 });
    }

    return Response.json({
      alreadyVoted: false,
      upvotes: await responseCount(env, id, Number(stories[idx].upvotes || 0)),
    });
  } catch (err) {
    return Response.json({ error: "Failed to upvote" }, { status: 500 });
  }
};
