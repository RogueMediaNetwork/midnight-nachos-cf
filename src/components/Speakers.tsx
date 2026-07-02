import { ExternalLink } from "lucide-react";
import { EVENT } from "../data/event";
import { SESSIONS } from "../data/schedule";
import { SPEAKERS } from "../data/speakers";
import { formatTime, TRACK_STYLES } from "../lib/agenda";

function initials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function Speakers() {
  return (
    <div>
      <h2 className="mb-2 text-xl font-black uppercase tracking-tight text-white">Speakers</h2>
      <p className="mb-6 text-[11px] text-slate-500">
        Every speaker is a practitioner — no panels of pundits. More announcements coming;
        the latest lineup is always at{" "}
        <a
          href={`${EVENT.website}/interviews/`}
          target="_blank"
          rel="noreferrer"
          className="text-cyan-400 underline-offset-2 hover:underline"
        >
          youxai.live
        </a>
        .
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        {SPEAKERS.map((speaker) => {
          const sessions = SESSIONS.filter((s) => s.speakerIds.includes(speaker.id));
          return (
            <div
              key={speaker.id}
              className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/30 to-cyan-400/30 text-sm font-black text-white ring-1 ring-white/15">
                  {initials(speaker.name)}
                </div>
                <div className="min-w-0">
                  <h3 className="truncate text-sm font-bold text-white">{speaker.name}</h3>
                  <p className="truncate text-[11px] text-slate-400">
                    {speaker.role} · {speaker.company}
                  </p>
                </div>
              </div>
              <p className="mb-3 flex-1 text-xs leading-relaxed text-slate-400">{speaker.bio}</p>
              <div className="mb-3 flex flex-wrap gap-1.5">
                {speaker.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              {sessions.length > 0 && (
                <div className="border-t border-white/5 pt-3">
                  {sessions.map((s) => (
                    <div key={s.id} className="flex items-center gap-2 text-[11px]">
                      <span className={`h-1.5 w-1.5 rounded-full ${TRACK_STYLES[s.track].dot}`} />
                      <span className="font-mono tabular-nums text-slate-500">
                        {formatTime(s.start)}
                      </span>
                      <span className="truncate text-slate-300">{s.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}

        {/* More coming card */}
        <a
          href={`${EVENT.website}/interviews/`}
          target="_blank"
          rel="noreferrer"
          className="group flex min-h-[160px] flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-transparent p-5 text-center transition-colors hover:border-cyan-400/40 hover:bg-white/5"
        >
          <p className="text-sm font-bold text-slate-300 group-hover:text-white">
            More speakers announced soon
          </p>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
            Speaker interviews on youxai.live <ExternalLink className="h-3 w-3" />
          </p>
        </a>
      </div>
    </div>
  );
}
