import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Schedule from "./components/Schedule";
import Speakers from "./components/Speakers";
import QABoard from "./components/QABoard";
import Concierge from "./components/Concierge";
import EventInfo from "./components/EventInfo";
import { Tab, TABS } from "./tabs";
import { useMyAgenda } from "./lib/agenda";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");
  const { agenda, toggle } = useMyAgenda();

  return (
    <div className="relative flex min-h-screen flex-col bg-[#060609] font-sans text-slate-200 selection:bg-cyan-500/30 selection:text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute left-[-10%] top-[-5%] z-0 h-[400px] w-[400px] rounded-full bg-cyan-900/15 blur-[140px] sm:h-[600px] sm:w-[600px]" />
      <div className="pointer-events-none absolute bottom-[15%] right-[-10%] z-0 h-[350px] w-[350px] rounded-full bg-amber-900/10 blur-[120px] sm:h-[500px] sm:w-[500px]" />
      <div className="pointer-events-none absolute left-[35%] top-[45%] z-0 h-[300px] w-[300px] rounded-full bg-violet-900/10 blur-[130px]" />

      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 py-6 md:px-8 md:py-10">
        {activeTab === "home" && <Home setActiveTab={setActiveTab} agendaCount={agenda.length} />}
        {activeTab === "schedule" && <Schedule agenda={agenda} toggleAgenda={toggle} />}
        {activeTab === "speakers" && <Speakers />}
        {activeTab === "qa" && <QABoard />}
        {activeTab === "concierge" && <Concierge />}
        {activeTab === "info" && <EventInfo />}
      </main>

      <Footer />

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#060609]/90 backdrop-blur-xl md:hidden">
        <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[env(safe-area-inset-bottom)]">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 transition-colors ${
                activeTab === id ? "text-cyan-300" : "text-slate-500"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[9px] font-semibold">{label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
