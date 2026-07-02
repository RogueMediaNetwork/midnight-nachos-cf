interface Env {
  EVENT_KV: KVNamespace;
}

async function getQuestions(kv: KVNamespace) {
  const data = (await kv.get("questions", "json")) as any[] | null;
  return data || [];
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const questions = await getQuestions(env.EVENT_KV);
    questions.sort((a: any, b: any) => b.upvotes - a.upvotes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return Response.json(questions);
  } catch {
    return Response.json({ error: "Failed to load questions" }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { question, author, sessionId } = (await request.json()) as any;
    if (!question || !String(question).trim()) {
      return Response.json({ error: "Question is required" }, { status: 400 });
    }

    const questions = await getQuestions(env.EVENT_KV);
    const entry = {
      id: `q-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      question: String(question).trim().substring(0, 500),
      author: String(author || "Anonymous").trim().substring(0, 60) || "Anonymous",
      sessionId: sessionId ? String(sessionId).substring(0, 60) : null,
      upvotes: 0,
      createdAt: new Date().toISOString(),
    };

    questions.push(entry);
    await env.EVENT_KV.put("questions", JSON.stringify(questions));
    return Response.json(entry, { status: 201 });
  } catch {
    return Response.json({ error: "Failed to submit question" }, { status: 500 });
  }
};
