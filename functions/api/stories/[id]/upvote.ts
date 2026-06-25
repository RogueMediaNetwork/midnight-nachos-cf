interface Env {
  STORIES_KV: KVNamespace;
}

async function getStories(kv: KVNamespace) {
  const data = await kv.get("stories", "json") as any[] | null;
  return data || [];
}

export const onRequestPost: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const id = params.id as string;
    const stories = await getStories(env.STORIES_KV);
    const idx = stories.findIndex((s: any) => s.id === id);
    if (idx === -1) return Response.json({ error: "Story not found" }, { status: 404 });
    stories[idx].upvotes += 1;
    await env.STORIES_KV.put("stories", JSON.stringify(stories));
    return Response.json(stories[idx]);
  } catch (err) {
    return Response.json({ error: "Failed to upvote" }, { status: 500 });
  }
};
