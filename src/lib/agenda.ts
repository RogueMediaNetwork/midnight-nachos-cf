import { useCallback, useState } from "react";
import { TrackId } from "../types";

const AGENDA_KEY = "youxai-my-agenda";

function readAgenda(): string[] {
  try {
    const raw = localStorage.getItem(AGENDA_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function useMyAgenda() {
  const [agenda, setAgenda] = useState<string[]>(readAgenda);

  const toggle = useCallback((sessionId: string) => {
    setAgenda((prev) => {
      const next = prev.includes(sessionId)
        ? prev.filter((id) => id !== sessionId)
        : [...prev, sessionId];
      try {
        localStorage.setItem(AGENDA_KEY, JSON.stringify(next));
      } catch {
        // storage unavailable (private mode) — agenda stays in-memory
      }
      return next;
    });
  }, []);

  return { agenda, toggle };
}

export const TRACK_STYLES: Record<TrackId, { badge: string; accent: string; dot: string }> = {
  main: {
    badge: "bg-violet-500/15 text-violet-300 border-violet-500/25",
    accent: "text-violet-300",
    dot: "bg-violet-400",
  },
  ai: {
    badge: "bg-cyan-500/15 text-cyan-300 border-cyan-500/25",
    accent: "text-cyan-300",
    dot: "bg-cyan-400",
  },
  creator: {
    badge: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    accent: "text-amber-300",
    dot: "bg-amber-400",
  },
  break: {
    badge: "bg-white/5 text-slate-400 border-white/10",
    accent: "text-slate-400",
    dot: "bg-slate-500",
  },
};

export function formatTime(hhmm: string): string {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
