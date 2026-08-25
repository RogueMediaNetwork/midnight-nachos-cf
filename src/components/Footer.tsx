import { Facebook, Flame, Heart, Instagram, MessageCircle } from "lucide-react";

const SOCIAL_LINKS = [
  { label: "Facebook", icon: Facebook, href: "", note: "Facebook profile coming soon" },
  { label: "Instagram", icon: Instagram, href: "", note: "Instagram profile coming soon" },
  { label: "Reddit", icon: MessageCircle, href: "https://www.reddit.com/r/trees/", note: "Read the r/trees community" },
];

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

          <p className="max-w-md text-center text-xs leading-relaxed text-slate-500 md:text-right">
            Late-night recipes, community stories, and gear for cozy people with excellent snack instincts.
          </p>
        </div>

        <aside className="mn-legal-note" aria-label="Legal notice">
          <strong>Good to know</strong>
          <p>Midnight Nachos does not sell edible products directly. Shop items and outgoing links are provided for information and shopping convenience.</p>
          <p>We may earn a small commission from qualifying gear links. This helps keep the server running and the cheese hot.</p>
          <p>For adults in places where cannabis-related content is lawful. We do not endorse or encourage illegal products or activities; please know and follow your local laws.</p>
        </aside>

        <hr className="my-8 border-slate-900" />

        <nav className="mb-7 flex flex-wrap items-center justify-center gap-3 md:justify-start" aria-label="Midnight Nachos social links">
          {SOCIAL_LINKS.map(({ label, icon: Icon, href, note }) => href ? (
            <a key={label} href={href} target="_blank" rel="noreferrer" className="mn-social-link" title={note}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
            </a>
          ) : (
            <span key={label} className="mn-social-link mn-social-link--pending" title={note} aria-label={note}>
              <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {label}
            </span>
          ))}
        </nav>

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
