import React from "react";
import { Flame, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer id="app-footer" className="mt-auto w-full border-t border-slate-900 bg-slate-950 py-10 px-4 text-slate-500 font-sans">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Brand Logo & Info */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center gap-2 md:justify-start">
              <Flame className="h-5 w-5 text-amber-500" />
              <span className="font-bold text-slate-300">Midnight Nachos</span>
            </div>
            <p className="mt-2 max-w-xs text-xs text-slate-500">
              Your late-night destination for stoner-friendly cozy recipes, community stories, and custom cozy apparel.
            </p>
          </div>

          {/* Guidelines and Disclaimers */}
          <div className="max-w-md text-center text-[10px] leading-relaxed text-slate-600 md:text-right">
            <p className="mb-2">
              Disclaimer: Midnight Nachos does not sell edible products directly. All items in the Midnight Shop are either custom POD apparel manufactured on-demand by Printify or curated external Amazon Affiliate items.
            </p>
            <p>
              As an Amazon Associate, we earn a tiny commission from qualifying purchases made via our links. This helps keep our server running and our cheese hot!
            </p>
          </div>
        </div>

        <hr className="my-8 border-slate-900" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-slate-600 sm:flex-row">
          <div>
            &copy; {new Date().getFullYear()} Midnight Nachos. All rights reserved.
          </div>
          <div className="flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-pink-500 fill-pink-500" /> for the late-night foodies.
          </div>
        </div>
      </div>
    </footer>
  );
}
