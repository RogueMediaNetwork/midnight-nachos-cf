import { TrackId } from "../types";

export const EVENT = {
  name: "YOU × AI Summit",
  tagline: "Where Human Genius Meets Machine Intelligence",
  dateLabel: "Saturday · September 12, 2026",
  // 9:00 AM CDT kickoff in Waco, TX
  startsAt: "2026-09-12T09:00:00-05:00",
  venue: {
    name: "PACC",
    descriptor: "A purpose-built event space in the heart of Waco's creator economy corridor",
    city: "Waco, TX",
    mapsUrl: "https://maps.google.com/?q=PACC+Waco+TX",
  },
  capacity: 200,
  website: "https://youxai.live",
  producedBy: "Rogue Media Network",
  // Update these once on-site details are locked in
  wifi: { network: "TBA", password: "TBA" },
  hashtag: "#YOUxAI",
} as const;

export const TRACKS: Record<TrackId, { label: string; blurb: string }> = {
  main: {
    label: "Main Stage",
    blurb: "Both tracks together — keynotes that change how you think about your business.",
  },
  ai: {
    label: "AI Track",
    blurb: "The tools, workflows, agents, and systems generating actual results in 2026.",
  },
  creator: {
    label: "Creator Track",
    blurb: "Content strategy, category design, audience building, and real monetization.",
  },
  break: {
    label: "Breaks",
    blurb: "Coffee, food, and hallway-track conversations.",
  },
};
