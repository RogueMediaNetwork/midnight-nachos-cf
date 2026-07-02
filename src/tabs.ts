import { CalendarDays, Home, Info, MessageCircleQuestion, Sparkles, Users } from "lucide-react";

export type Tab = "home" | "schedule" | "speakers" | "qa" | "concierge" | "info";

export const TABS: { id: Tab; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "schedule", label: "Schedule", icon: CalendarDays },
  { id: "speakers", label: "Speakers", icon: Users },
  { id: "qa", label: "Q&A", icon: MessageCircleQuestion },
  { id: "concierge", label: "Concierge", icon: Sparkles },
  { id: "info", label: "Info", icon: Info },
];
