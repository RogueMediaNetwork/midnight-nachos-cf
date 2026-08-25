interface Env {
  STORIES_KV: KVNamespace;
  COMMUNITY_DB: D1Database;
}

const SEED_STORIES = [
  {
    id: "story-1",
    title: "The Great Microwaved Cereal Fiasco",
    content: "So I was at about an 8/10 on the snack scale, and I really wanted a cozy bowl of cereal. I poured the milk, got the spoon, and for some reason my brain went 'Hot food is cozy'. I put the entire bowl of Froot Loops with milk in the microwave for 2 minutes. The milk curdled into a rubbery pancake, and the loops turned into a glowing hot pastel mush. I still took a bite out of respect. 2/10, do not recommend unless you want to feel like you're eating edible play-doh.",
    upvotes: 42,
    tags: ["Microwave Fails", "Grave Munchies", "Edible Art"],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString()
  },
  {
    id: "story-2", 
    title: "The Freezer Mystery",
    content: "Lost my Apple TV remote for three straight days. Finally gave up and went to grab some ice cream. Found the remote frozen solid behind a tub of Ben & Jerry's Half Baked. I must have put it down to scoop with both hands, closed the freezer door, and walked away. Fun fact: after letting it thaw on a dry towel for an hour, it still worked perfectly!",
    upvotes: 88,
    tags: ["Lost & Found", "Ice Cream", "Classic Stoner"],
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString()
  },
  {
    id: "story-3",
    title: "Philosophical Ceiling Fan Conversation",
    content: "Me and my golden retriever sat on the rug for a solid hour last night staring at the ceiling fan in complete silence. Around minute 45, I looked at him and said, 'Man, the ceiling fan is actually the master of this house. It's always above us, it never sleeps, and it commands the wind.' He let out a low 'boof' and nodded his head. We have reached a mutual understanding.",
    upvotes: 61,
    tags: ["Philosophy", "Dog Conversations", "Deep Thoughts"],
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  },
  {
    id: "story-4",
    title: "Waiting for the Cold Hot Pocket",
    content: "I stood in front of the microwave for a full 5 minutes, staring intensely at my Hot Pocket rotating on the glass plate. When the timer beeped, I opened the door, grabbed the hot pocket, took a huge bite... and it was ice cold. I never actually pressed the START button. I just clicked 'add 30 sec' a bunch of times but never booted it up. I was just watching a cold pocket spin in a circle.",
    upvotes: 112,
    tags: ["Microwave Fails", "Patience", "Sadness"],
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString()
  }
];

async function getStories(kv: KVNamespace) {
  const data = await kv.get("stories", "json") as any[] | null;
  if (!data) {
    await kv.put("stories", JSON.stringify(SEED_STORIES));
    return SEED_STORIES;
  }
  return data;
}

export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try {
    const stories = await getStories(env.STORIES_KV);
    const voteRows = await env.COMMUNITY_DB.prepare(
      "SELECT story_id, COUNT(*) AS votes FROM story_votes GROUP BY story_id"
    ).all<{ story_id: string; votes: number }>();
    const voteTotals = new Map(voteRows.results.map(row => [row.story_id, Number(row.votes)]));
    stories.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return Response.json(stories.map((story: any) => ({
      ...story,
      upvotes: Number(story.upvotes || 0) + (voteTotals.get(story.id) || 0),
    })));
  } catch (err) {
    return Response.json({ error: "Failed to load stories" }, { status: 500 });
  }
};

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  try {
    const { title, content, tags } = await request.json() as any;
    if (!title || !content) {
      return Response.json({ error: "Title and content are required" }, { status: 400 });
    }

    const stories = await getStories(env.STORIES_KV);
    const newStory = {
      id: `story-${Date.now()}`,
      title: String(title).trim().substring(0, 80),
      content: String(content).trim().substring(0, 1000),
      upvotes: 0,
      tags: Array.isArray(tags) ? tags.map((t: any) => String(t).trim().substring(0, 20)).filter(Boolean) : ["General"],
      createdAt: new Date().toISOString()
    };

    stories.push(newStory);
    await env.STORIES_KV.put("stories", JSON.stringify(stories));
    return Response.json(newStory, { status: 201 });
  } catch (err) {
    return Response.json({ error: "Failed to submit story" }, { status: 500 });
  }
};
