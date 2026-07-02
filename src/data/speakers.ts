import { Speaker } from "../types";

// Confirmed speakers from youxai.live. Bios are short placeholders —
// replace with the official bios as speaker pages are finalized.
export const SPEAKERS: Speaker[] = [
  {
    id: "mike-hamilton",
    name: "Mike Hamilton",
    role: "Founder",
    company: "Rogue Media Network",
    bio: "Founder of Rogue Media Network, the production partner behind the YOU × AI Summit. Every session is filmed, edited, and repurposed into content — Mike is the reason why.",
    tags: ["Host", "Media", "Production"],
  },
  {
    id: "tommy-landry",
    name: "Tommy Landry",
    role: "CEO",
    company: "Return On Now",
    bio: "CEO of Return On Now. A search and AI-visibility practitioner helping brands stay findable as answer engines replace the ten blue links.",
    tags: ["AI Track", "Search", "Marketing"],
  },
  {
    id: "fernando-labastida",
    name: "Fernando Labastida",
    role: "Founder",
    company: "Strike Marketing Institute",
    bio: "Founder of Strike Marketing Institute. Teaches category design and content strategy that positions founders as the obvious choice in their market.",
    tags: ["Creator Track", "Category Design", "Content"],
  },
  {
    id: "larry-roberts",
    name: "Larry Roberts",
    role: "Founder",
    company: "Red Hat Media",
    bio: "Founder of Red Hat Media. Podcaster, keynote speaker, and personal-brand builder helping creators turn a microphone into a business.",
    tags: ["Creator Track", "Podcasting", "Personal Brand"],
  },
  {
    id: "sara-lohse",
    name: "Sara Lohse",
    role: "CEO",
    company: "Favorite Daughter Media",
    bio: "CEO of Favorite Daughter Media and author. Storytelling strategist who turns founders' lived experience into audience-building narratives.",
    tags: ["Creator Track", "Storytelling", "Branding"],
  },
  {
    id: "kennisha-thornton",
    name: "Kennisha Thornton",
    role: "Speaker",
    company: "YOU × AI Summit",
    bio: "Practitioner speaker at the YOU × AI Summit. Full bio coming soon — see youxai.live/speakers for the latest.",
    tags: ["Speaker"],
  },
];

export const speakerById = (id: string): Speaker | undefined =>
  SPEAKERS.find((s) => s.id === id);
