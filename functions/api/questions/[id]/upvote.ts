interface Env {
  EVENT_KV: KVNamespace;
}

export const onRequestPost: PagesFunction<Env> = async ({ params, env }) => {
  try {
    const id = params.id as string;
    const questions = ((await env.EVENT_KV.get("questions", "json")) as any[] | null) || [];
    const idx = questions.findIndex((q: any) => q.id === id);
    if (idx === -1) return Response.json({ error: "Question not found" }, { status: 404 });
    questions[idx].upvotes += 1;
    await env.EVENT_KV.put("questions", JSON.stringify(questions));
    return Response.json(questions[idx]);
  } catch {
    return Response.json({ error: "Failed to upvote" }, { status: 500 });
  }
};
