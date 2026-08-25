import { ChefHat, BookOpen, MessageSquare, ShoppingBag, Flame, Gamepad2, MapPinned, Palette, Volume2, VolumeX } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  moodLabel: string;
  cycleMood: () => void;
  musicPlaying: boolean;
  musicUnavailable: boolean;
  toggleMusic: () => void;
}

export default function Header({ activeTab, setActiveTab, moodLabel, cycleMood, musicPlaying, musicUnavailable, toggleMusic }: HeaderProps) {
  const navItems = [
    { id: "chef", label: "Munchie Chef AI", icon: ChefHat, color: "text-amber-400" },
    { id: "recipes", label: "Cozy Recipes", icon: BookOpen, color: "text-emerald-400" },
    { id: "stories", label: "Stoner Stories", icon: MessageSquare, color: "text-pink-400" },
    { id: "shop", label: "Midnight Shop", icon: ShoppingBag, color: "text-sky-400" },
    { id: "arcade", label: "Bodega Arcade", icon: Gamepad2, color: "text-purple-400" },
    { id: "finder", label: "Nearby Shops", icon: MapPinned, color: "text-lime-300" },
  ];

  return (
    <header id="app-header" className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-4 sm:flex-row sm:py-3">
        {/* Logo and Brand */}
        <div 
          onClick={() => setActiveTab("chef")}
          className="flex cursor-pointer items-center gap-2 group"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-amber-500 to-yellow-300 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform duration-300">
            <Flame className="h-6 w-6 text-slate-950 animate-pulse" />
            <div className="absolute inset-0 rounded-xl bg-amber-400/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white group-hover:text-amber-300 transition-colors">
              Midnight <span className="text-amber-400 group-hover:text-yellow-300">Nachos</span>
            </h1>
            <p className="text-[10px] font-mono text-slate-400">MIDNIGHTNACHOS.COM</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-slate-800 text-white shadow-lg shadow-black/40 ring-1 ring-slate-700"
                    : "text-slate-400 hover:bg-slate-900 hover:text-slate-200"
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? item.color : "text-slate-500"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
        <button type="button" onClick={toggleMusic} aria-pressed={musicPlaying} className="mn-mood-switch flex items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px]" title="Play or pause the original Midnight Radio mix">
          {musicPlaying ? <Volume2 className="h-3.5 w-3.5" aria-hidden="true" /> : <VolumeX className="h-3.5 w-3.5" aria-hidden="true" />}<span>Midnight Radio</span><strong>{musicUnavailable ? "Try again" : musicPlaying ? "On" : "Off"}</strong>
        </button>
        <button
          type="button"
          onClick={cycleMood}
          className="mn-mood-switch hidden items-center gap-2 rounded-full border px-3 py-1.5 font-mono text-[10px] md:flex"
          aria-label={`Change Couch Mode. Current mood: ${moodLabel}.`}
          title="Change the Couch Mode colors"
        >
          <Palette className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Couch Mode</span>
          <strong>{moodLabel}</strong>
        </button>
        </div>
      </div>
    </header>
  );
}
