import { useEffect, useState } from "react";
import { ArrowRight, Megaphone, Star } from "lucide-react";
import { Announcement } from "../types";
import { EVENT } from "../data/event";
import { SESSIONS } from "../data/schedule";
import { Tab } from "../tabs";
import Countdown from "./Countdown";

interface HomeProps {
  setActiveTab: (tab: Tab) => void;
  agendaCount: number;
}

export default function Home({ setActiveTab, agendaCount }: HomeProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/announcements")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setAnnouncements(data as Announcement[]))
      .catch(() => setAnnouncements([]))
      .finally(() => setLoading(false));
  }, []);

  const talkCount = SESSIONS.filter((s) => s.track !== "break").length;

  return (
    <div className="space-y-10">
      {/* Hero */}
      <section className="pt-4 md:pt-8">
        <span className="mb-3 block font-mono text-[10px] font-bold uppercase tracking-widest text-cyan-400">
          {EVENT.dateLabel} · {EVENT.venue.name}, {EVENT.venue.city}
        </span>
        <h1 className="mb-4 text-4xl font-black uppercase leading-[0.95] tracking-tighter text-white sm:text-6xl md:text-7xl">
          YOU{" "}
          <span className="bg-gradient-to-r from-amber-400 via-orange-300 to-cyan-400 bg-clip-text text-transparent">
            ×
          </span>{" "}
          AI
          <br />
          <span className="text-2xl font-bold normal-case tracking-tight text-slate-400 sm:text-3xl md:text-4xl">
            {EVENT.tagline}
          </span>
        </h1>
        <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-400 sm:text-base">
          One day. Two tracks. ~{EVENT.capacity} people who are serious about building
          something real. This app is your companion for the day — build your agenda,
          submit questions, and ask the concierge anything.
        </p>
        <Countdown />
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            onClick={() => setActiveTab("schedule")}
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg shadow-cyan-500/20 transition-transform hover:scale-[1.03]"
          >
            Build my agenda <ArrowRight className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => setActiveTab("concierge")}
            className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
          >
            Ask the AI concierge
          </button>
        </div>
      </section>

      {/* Quick stats */}
      <section className="grid grid-cols-3 gap-3">
        {[
          { value: String(talkCount), label: "Sessions" },
          { value: "3", label: "Stages" },
          { value: String(agendaCount), label: "In my agenda" },
        ].map(({ value, label }) => (
          <div
            key={label}
            className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-md"
          >
            <div className="text-2xl font-black text-white">{value}</div>
            <div className="mt-0.5 flex items-center justify-center gap-1 text-[9px] font-mono uppercase tracking-widest text-slate-400">
              {label === "In my agenda" && <Star className="h-2.5 w-2.5 text-amber-400" />}
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* Announcements */}
      <section>
        <div className="mb-4 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-amber-400" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-white">
            Announcements
          </h2>
        </div>
        {loading ? (
          <p className="text-xs text-slate-500">Loading announcements…</p>
        ) : announcements.length === 0 ? (
          <p className="text-xs text-slate-500">
            No announcements yet — check back closer to the event.
          </p>
        ) : (
          <div className="space-y-3">
            {announcements.map((a) => (
              <div
                key={a.id}
                className={`rounded-2xl border p-4 backdrop-blur-md ${
                  a.priority === "important"
                    ? "border-amber-500/30 bg-amber-500/10"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <div className="mb-1 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-white">{a.title}</h3>
                  <span className="shrink-0 font-mono text-[9px] text-slate-500">
                    {new Date(a.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs leading-relaxed text-slate-400">{a.body}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
