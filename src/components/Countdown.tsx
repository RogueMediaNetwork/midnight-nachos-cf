import { useEffect, useState } from "react";
import { EVENT } from "../data/event";

function getRemaining() {
  const diff = new Date(EVENT.startsAt).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor(diff / 3600000) % 24,
    minutes: Math.floor(diff / 60000) % 60,
  };
}

export default function Countdown() {
  const [remaining, setRemaining] = useState(getRemaining);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(getRemaining()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (!remaining) {
    return (
      <p className="text-sm font-bold uppercase tracking-widest text-cyan-300">
        It's summit day — welcome to Waco! 🎉
      </p>
    );
  }

  const units = [
    { value: remaining.days, label: "days" },
    { value: remaining.hours, label: "hrs" },
    { value: remaining.minutes, label: "min" },
  ];

  return (
    <div className="flex gap-3">
      {units.map(({ value, label }) => (
        <div
          key={label}
          className="flex min-w-[64px] flex-col items-center rounded-2xl border border-white/10 bg-white/5 px-3 py-2 backdrop-blur-md"
        >
          <span className="text-2xl font-black tabular-nums text-white">{value}</span>
          <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
