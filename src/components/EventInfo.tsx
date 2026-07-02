import { Clapperboard, ExternalLink, MapPin, Ticket, Users, Wifi } from "lucide-react";
import { EVENT, TRACKS } from "../data/event";

const FAQ = [
  {
    q: "What is the YOU × AI Summit?",
    a: "One day, two tracks, ~200 people. Not a tech conference, not a marketing conference — a day about what becomes possible when the full force of who you are meets the full force of what AI can do.",
  },
  {
    q: "What are the tracks?",
    a: `${TRACKS.ai.label}: ${TRACKS.ai.blurb} ${TRACKS.creator.label}: ${TRACKS.creator.blurb} And the ${TRACKS.main.label} brings everyone together for keynotes.`,
  },
  {
    q: "Will sessions be recorded?",
    a: `Yes — ${EVENT.producedBy} films every session, and talks are edited and repurposed into content after the event.`,
  },
  {
    q: "How do I ask a speaker a question?",
    a: "Use the Q&A tab in this app. Submit your question (optionally tied to a session) and upvote others — moderators take the top-voted questions to the stage.",
  },
  {
    q: "Where do I get tickets?",
    a: `Seats are limited. Tickets and the waitlist live at ${EVENT.website} — waitlist members get Early Bird pricing when tickets go live.`,
  },
];

export default function EventInfo() {
  return (
    <div>
      <h2 className="mb-6 text-xl font-black uppercase tracking-tight text-white">
        Event Info
      </h2>

      {/* Info cards */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-cyan-300">
            <MapPin className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">Venue</h3>
          </div>
          <p className="text-sm font-bold text-white">{EVENT.venue.name}</p>
          <p className="mt-1 text-xs leading-relaxed text-slate-400">
            {EVENT.venue.descriptor}. {EVENT.venue.city}.
          </p>
          <a
            href={EVENT.venue.mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-cyan-400 hover:underline"
          >
            Open in Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-amber-300">
            <Wifi className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">WiFi</h3>
          </div>
          <p className="text-xs text-slate-400">Network</p>
          <p className="font-mono text-sm font-bold text-white">{EVENT.wifi.network}</p>
          <p className="mt-2 text-xs text-slate-400">Password</p>
          <p className="font-mono text-sm font-bold text-white">{EVENT.wifi.password}</p>
          <p className="mt-2 text-[10px] text-slate-500">
            Posted here on event day.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-violet-300">
            <Users className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">The Room</h3>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            ~{EVENT.capacity} founders, marketers, and creators who are serious about
            building something real. Wear your badge, say hi — the hallway track is half
            the value.
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-md">
          <div className="mb-2 flex items-center gap-2 text-pink-300">
            <Clapperboard className="h-4 w-4" />
            <h3 className="text-xs font-bold uppercase tracking-widest">On Camera</h3>
          </div>
          <p className="text-xs leading-relaxed text-slate-400">
            Every session is filmed and edited by {EVENT.producedBy}. Post your moments
            with <span className="font-bold text-white">{EVENT.hashtag}</span>.
          </p>
        </div>
      </div>

      {/* Tickets CTA */}
      <a
        href={EVENT.website}
        target="_blank"
        rel="noreferrer"
        className="mb-8 flex items-center justify-between rounded-2xl border border-cyan-400/25 bg-gradient-to-r from-amber-400/10 to-cyan-400/10 p-5 transition-colors hover:border-cyan-400/50"
      >
        <div className="flex items-center gap-3">
          <Ticket className="h-5 w-5 text-cyan-300" />
          <div>
            <p className="text-sm font-bold text-white">Tickets & waitlist</p>
            <p className="text-[11px] text-slate-400">
              Seats limited to ~{EVENT.capacity} · Early Bird pricing for waitlist members
            </p>
          </div>
        </div>
        <ExternalLink className="h-4 w-4 text-slate-400" />
      </a>

      {/* FAQ */}
      <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-white">FAQ</h3>
      <div className="space-y-3">
        {FAQ.map(({ q, a }) => (
          <details
            key={q}
            className="group rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md"
          >
            <summary className="cursor-pointer list-none px-4 py-3.5 text-sm font-semibold text-white marker:hidden">
              {q}
            </summary>
            <p className="px-4 pb-4 text-xs leading-relaxed text-slate-400">{a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
