import { EVENT } from "../data/event";

export default function Footer() {
  return (
    <footer className="relative z-10 mt-12 border-t border-white/5 pb-24 md:pb-6">
      <div className="mx-auto max-w-6xl px-4 py-6 text-center md:px-8">
        <p className="text-[11px] text-slate-500">
          {EVENT.name} · {EVENT.dateLabel} · {EVENT.venue.name}, {EVENT.venue.city}
        </p>
        <p className="mt-1 text-[10px] text-slate-600">
          Produced by {EVENT.producedBy} ·{" "}
          <a
            href={EVENT.website}
            target="_blank"
            rel="noreferrer"
            className="text-slate-500 underline-offset-2 hover:text-slate-300 hover:underline"
          >
            youxai.live
          </a>{" "}
          · {EVENT.hashtag}
        </p>
      </div>
    </footer>
  );
}
