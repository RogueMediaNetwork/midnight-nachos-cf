import { useMemo, useState } from "react";
import { MapPin, Star } from "lucide-react";
import { TrackId } from "../types";
import { TRACKS } from "../data/event";
import { SCHEDULE_IS_DRAFT, SESSIONS } from "../data/schedule";
import { speakerById } from "../data/speakers";
import { formatTime, TRACK_STYLES } from "../lib/agenda";

type Filter = "all" | "mine" | Exclude<TrackId, "break">;

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "Full Day" },
  { id: "main", label: TRACKS.main.label },
  { id: "ai", label: TRACKS.ai.label },
  { id: "creator", label: TRACKS.creator.label },
  { id: "mine", label: "★ My Agenda" },
];

interface ScheduleProps {
  agenda: string[];
  toggleAgenda: (sessionId: string) => void;
}

export default function Schedule({ agenda, toggleAgenda }: ScheduleProps) {
  const [filter, setFilter] = useState<Filter>("all");

  const sessions = useMemo(() => {
    const sorted = [...SESSIONS].sort((a, b) => a.start.localeCompare(b.start));
    if (filter === "all") return sorted;
    if (filter === "mine") return sorted.filter((s) => agenda.includes(s.id));
    return sorted.filter((s) => s.track === filter || s.track === "break");
  }, [filter, agenda]);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-xl font-black uppercase tracking-tight text-white">Schedule</h2>
      </div>
      {SCHEDULE_IS_DRAFT && (
        <p className="mb-4 text-[11px] text-slate-500">
          Draft agenda — session times and speakers will be finalized as the lineup is
          announced. Star sessions to build your personal agenda.
        </p>
      )}

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        {FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setFilter(id)}
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all ${
              filter === id
                ? "bg-white text-slate-950"
                : "border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
          <p className="text-sm text-slate-400">
            Nothing starred yet. Tap the <Star className="inline h-3.5 w-3.5 text-amber-400" />{" "}
            on any session to add it to your agenda.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {sessions.map((session) => {
            const styles = TRACK_STYLES[session.track];
            const starred = agenda.includes(session.id);
            const speakers = session.speakerIds
              .map((id) => speakerById(id))
              .filter((sp): sp is NonNullable<typeof sp> => Boolean(sp));

            return (
              <div
                key={session.id}
                className={`rounded-2xl border p-4 backdrop-blur-md transition-colors ${
                  starred
                    ? "border-amber-500/30 bg-amber-500/[0.06]"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold tabular-nums text-slate-300">
                        {formatTime(session.start)} – {formatTime(session.end)}
                      </span>
                      <span
                        className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${styles.badge}`}
                      >
                        {TRACKS[session.track].label}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold leading-snug text-white sm:text-base">
                      {session.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-400">
                      {session.description}
                    </p>
                    <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {session.location}
                      </span>
                      {speakers.length > 0 && (
                        <span className={styles.accent}>
                          {speakers.map((sp) => sp.name).join(" · ")}
                        </span>
                      )}
                    </div>
                  </div>
                  {session.track !== "break" && (
                    <button
                      onClick={() => toggleAgenda(session.id)}
                      aria-label={starred ? "Remove from my agenda" : "Add to my agenda"}
                      className={`shrink-0 rounded-full p-2 transition-all ${
                        starred
                          ? "bg-amber-500/20 text-amber-400"
                          : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-amber-300"
                      }`}
                    >
                      <Star className={`h-4 w-4 ${starred ? "fill-amber-400" : ""}`} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
