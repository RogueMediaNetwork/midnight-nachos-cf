import { Tab, TABS } from "../tabs";
import { EVENT } from "../data/event";

interface HeaderProps {
  activeTab: Tab;
  setActiveTab: (tab: Tab) => void;
}

export default function Header({ activeTab, setActiveTab }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#060609]/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-8">
        <button
          onClick={() => setActiveTab("home")}
          className="flex items-center gap-2 text-left"
        >
          <span className="text-lg font-black tracking-tight text-white">
            YOU<span className="mx-0.5 bg-gradient-to-r from-amber-400 to-cyan-400 bg-clip-text text-transparent">×</span>AI
          </span>
          <span className="hidden text-[10px] font-mono uppercase tracking-widest text-slate-500 sm:block">
            {EVENT.dateLabel}
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === id
                  ? "bg-white/10 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
