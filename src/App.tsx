import React, { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import MunchieChef from "./components/MunchieChef";
import RecipeList from "./components/RecipeList";
import StonerStories from "./components/StonerStories";
import MidnightShop from "./components/MidnightShop";
import MidnightArcade from "./components/MidnightArcade";
import { FreshBatchLead, FreshBatchPocket, FreshBatchProvider, FreshBatchTicker, SponsorPocket } from "./components/FreshBatch";
import { ChevronRight } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("chef");

  return (
    <FreshBatchProvider>
    <div id="app-root-container" className="relative min-h-screen bg-[#050505] text-[#e5e7eb] font-sans overflow-x-clip flex flex-col justify-between selection:bg-amber-500/30 selection:text-white">
      
      {/* Background Orbs (Trippy/Atmospheric Effect from Elegant Dark theme) */}
      <div id="ambient-orb-top" className="absolute top-[-5%] left-[-5%] w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] bg-purple-900/15 rounded-full blur-[140px] pointer-events-none z-0" />
      <div id="ambient-orb-bottom" className="absolute bottom-[10%] right-[-5%] w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-orange-900/10 rounded-full blur-[120px] pointer-events-none z-0" />
      <div id="ambient-orb-center" className="absolute top-[40%] left-[30%] w-[300px] h-[300px] bg-emerald-900/5 rounded-full blur-[130px] pointer-events-none z-0" />

      {/* Navigation Header */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <FreshBatchTicker />

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex flex-col px-4 py-6 md:px-12 md:py-10 max-w-7xl mx-auto w-full">
        
        {/* Universal Majestic Hero Section (Styled from Elegant Dark Theme) */}
        <section id="hero-showcase" className="mb-12 border-b border-white/5 pb-10">
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            
            {/* Hero text */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <span className="text-[10px] uppercase tracking-widest text-amber-500 font-bold font-mono mb-3 block">
                MIDNIGHT NACHOS • EST. 4:20
              </span>
              <h1 className="text-4xl sm:text-6xl md:text-[84px] leading-[0.9] font-black tracking-tighter text-white mb-6 uppercase">
                Late-Night<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-purple-400 to-pink-500">
                  Haze & Fuel
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-400 max-w-lg leading-relaxed">
                Anonymous stoner tales, gourmet munchie hacks, and trippy merchandise curated for late-night wanderers of the cozy web.
              </p>

              {/* Action buttons mapping shortcuts directly to tabs */}
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("chef")}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === "chef"
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <span>Munchie AI Chef</span>
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setActiveTab("recipes")}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === "recipes"
                      ? "bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <span>Cozy Recipes</span>
                </button>
                <button
                  onClick={() => setActiveTab("stories")}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === "stories"
                      ? "bg-pink-500 text-white shadow-lg shadow-pink-500/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <span>Stoner Stories</span>
                </button>
                <button
                  onClick={() => setActiveTab("shop")}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === "shop"
                      ? "bg-sky-500 text-slate-950 shadow-lg shadow-sky-500/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <span>Midnight Shop</span>
                </button>
                <button
                  onClick={() => setActiveTab("arcade")}
                  className={`rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                    activeTab === "arcade"
                      ? "bg-purple-500 text-white shadow-lg shadow-purple-500/20"
                      : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  }`}
                >
                  <span>Bodega Arcade</span>
                </button>
              </div>
            </div>

            {/* Quick-Glance Sidebar / Featured Widgets (From design layout) */}
            <div className="lg:col-span-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              
              <FreshBatchLead />

              {/* Feature Recipe Quick card */}
              <div 
                onClick={() => setActiveTab("recipes")}
                className="bg-white/5 border border-white/10 p-5 rounded-3xl backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[9px] uppercase tracking-widest text-emerald-400 font-bold font-mono">
                      Craving Hack
                    </span>
                    <span className="text-[9px] text-emerald-500 font-mono">Easy (No Heat)</span>
                  </div>
                  <h3 className="text-sm font-bold text-white mb-1 group-hover:text-emerald-300 transition-colors">
                    Peanut Butter Pickle Tostadas
                  </h3>
                  <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                    Don't knock it until you try it. The sweet sticky peanut butter balanced by sour crunchy cold dill pickles...
                  </p>
                </div>
                <div className="flex items-center justify-between text-[10px] text-emerald-400 pt-2 border-t border-white/5">
                  <span>Get Recipe list</span>
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>

              <SponsorPocket />

            </div>
          </div>
        </section>

        {/* Dynamic Inner Tab Content */}
        <section id="dynamic-tab-section" className="animate-fade-in relative z-10">
          {activeTab === "chef" && <MunchieChef />}
          {activeTab === "recipes" && <RecipeList />}
          {activeTab === "stories" && <StonerStories />}
          {activeTab === "shop" && <MidnightShop />}
          {activeTab === "arcade" && <MidnightArcade />}
        </section>
        <FreshBatchPocket />

      </main>

      {/* Footer */}
      <Footer />
    </div>
    </FreshBatchProvider>
  );
}
