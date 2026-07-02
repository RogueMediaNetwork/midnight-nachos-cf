import { EVENT, TRACKS } from "../../src/data/event";
import { SESSIONS } from "../../src/data/schedule";
import { SPEAKERS, speakerById } from "../../src/data/speakers";
import { ConciergeMessage } from "../../src/types";

interface Env {
  ANTHROPIC_API_KEY: string;
}

function buildEventKnowledge(): string {
  const schedule = SESSIONS.map((s) => {
    const speakers = s.speakerIds
      .map((id) => speakerById(id)?.name)
      .filter(Boolean)
      .join(", ");
    return `- ${s.start}–${s.end} [${TRACKS[s.track].label}] "${s.title}" @ ${s.location}${speakers ? ` — ${speakers}` : ""}: ${s.description}`;
  }).join("\n");

  const speakers = SPEAKERS.map(
    (sp) => `- ${sp.name}, ${sp.role} at ${sp.company}: ${sp.bio}`
  ).join("\n");

  return `EVENT: ${EVENT.name} — "${EVENT.tagline}"
DATE: ${EVENT.dateLabel}
VENUE: ${EVENT.venue.name}, ${EVENT.venue.city} — ${EVENT.venue.descriptor}
CAPACITY: ~${EVENT.capacity} attendees
FORMAT: One day, two concurrent tracks plus a shared Main Stage.
- ${TRACKS.main.label}: ${TRACKS.main.blurb}
- ${TRACKS.ai.label}: ${TRACKS.ai.blurb}
- ${TRACKS.creator.label}: ${TRACKS.creator.blurb}
PRODUCED BY: ${EVENT.producedBy} — every session is filmed, edited, and repurposed into content.
WEBSITE: ${EVENT.website}
WIFI: network "${EVENT.wifi.network}", password "${EVENT.wifi.password}"
HASHTAG: ${EVENT.hashtag}

DRAFT SCHEDULE (subject to change; final agenda announced on ${EVENT.website}):
${schedule}

CONFIRMED SPEAKERS (more being announced):
${speakers}`;
}

function getFallbackAnswer(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("wifi") || q.includes("wi-fi") || q.includes("internet")) {
    return `WiFi details will be posted in the app on event day. For now: network "${EVENT.wifi.network}", password "${EVENT.wifi.password}".`;
  }
  if (q.includes("where") || q.includes("venue") || q.includes("address") || q.includes("location")) {
    return `The summit is at ${EVENT.venue.name} in ${EVENT.venue.city} — ${EVENT.venue.descriptor.toLowerCase()}. Tap the map link on the Info tab for directions.`;
  }
  if (q.includes("when") || q.includes("date") || q.includes("time") || q.includes("start")) {
    return `${EVENT.name} is ${EVENT.dateLabel}. Doors open at 8:00 AM for registration and coffee; the opening keynote kicks off at 9:00 AM.`;
  }
  if (q.includes("speaker") || q.includes("who")) {
    const names = SPEAKERS.map((s) => s.name).join(", ");
    return `Confirmed speakers so far: ${names}. More are being announced — check the Speakers tab or ${EVENT.website}.`;
  }
  if (q.includes("track")) {
    return `There are two concurrent tracks plus the Main Stage. ${TRACKS.ai.label}: ${TRACKS.ai.blurb} ${TRACKS.creator.label}: ${TRACKS.creator.blurb}`;
  }
  if (q.includes("ticket") || q.includes("register") || q.includes("price")) {
    return `Seats are limited to ~${EVENT.capacity}. Ticket info lives at ${EVENT.website} — waitlist members get Early Bird pricing when tickets go live.`;
  }
  return `Good question! I don't have a live answer right now, but the Schedule and Info tabs cover most of the day, and ${EVENT.website} has the latest. Ask a summit volunteer if you're on-site.`;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  let messages: ConciergeMessage[] = [];
  try {
    const body = (await request.json()) as { messages: ConciergeMessage[] };
    messages = (body.messages || [])
      .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
      .slice(-12)
      .map((m) => ({ role: m.role, content: m.content.substring(0, 2000) }));
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 });
  }

  const lastUser = [...messages].reverse().find((m) => m.role === "user");
  if (!lastUser) {
    return Response.json({ error: "A user message is required" }, { status: 400 });
  }

  if (!env.ANTHROPIC_API_KEY) {
    return Response.json({ reply: getFallbackAnswer(lastUser.content), isMock: true });
  }

  const system = `You are the attendee concierge for the ${EVENT.name}. You help attendees plan their day, pick sessions, find speakers, and get logistics answers. Be warm, concise, and practical — most people are reading you on a phone between sessions. If asked which sessions to attend, ask about (or infer) whether they lean AI-builder or creator, then recommend from the schedule. If you don't know something (parking specifics, after-party address, dietary details), say so and point them to summit staff or ${EVENT.website}. Never invent logistics that aren't in your event data. The schedule below is a draft and may change.

${buildEventKnowledge()}`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 800,
        system,
        messages,
      }),
    });

    if (!response.ok) throw new Error(`Claude API ${response.status}`);

    const data = (await response.json()) as { content: Array<{ type: string; text: string }> };
    const reply = data.content.find((b) => b.type === "text")?.text || "";
    return Response.json({ reply, isMock: false });
  } catch (err: any) {
    console.error("Concierge API error:", err);
    return Response.json({ reply: getFallbackAnswer(lastUser.content), isMock: true });
  }
};
