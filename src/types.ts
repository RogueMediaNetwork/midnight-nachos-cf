export type TrackId = "main" | "ai" | "creator" | "break";

export interface Session {
  id: string;
  title: string;
  description: string;
  track: TrackId;
  start: string; // "09:00" 24h, event-local time (CDT)
  end: string;
  location: string;
  speakerIds: string[];
}

export interface Speaker {
  id: string;
  name: string;
  role: string;
  company: string;
  bio: string;
  tags: string[];
}

export interface Announcement {
  id: string;
  title: string;
  body: string;
  priority: "info" | "important";
  createdAt: string;
}

export interface AttendeeQuestion {
  id: string;
  question: string;
  author: string;
  sessionId: string | null;
  upvotes: number;
  createdAt: string;
}

export interface ConciergeMessage {
  role: "user" | "assistant";
  content: string;
}
