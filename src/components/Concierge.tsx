import { FormEvent, useEffect, useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { ConciergeMessage } from "../types";

const SUGGESTIONS = [
  "What should I attend if I'm a solo founder?",
  "Who's speaking on the Creator Track?",
  "When does the day start and end?",
  "What's the closing panel about?",
];

export default function Concierge() {
  const [messages, setMessages] = useState<ConciergeMessage[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, thinking]);

  const ask = async (text: string) => {
    const content = text.trim();
    if (!content || thinking) return;
    const next: ConciergeMessage[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setThinking(true);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { reply: string };
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([
        ...next,
        {
          role: "assistant",
          content:
            "Sorry — I hit a snag answering that. Try again in a moment, or check the Schedule and Info tabs.",
        },
      ]);
    } finally {
      setThinking(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  return (
    <div className="flex flex-col">
      <h2 className="mb-2 text-xl font-black uppercase tracking-tight text-white">
        AI Concierge
      </h2>
      <p className="mb-6 text-[11px] text-slate-500">
        Your personal guide to the day. Ask about sessions, speakers, logistics, or which
        track fits what you're building.
      </p>

      <div className="flex min-h-[50vh] flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md">
        {/* Messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center py-8 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-400/25 to-cyan-400/25 ring-1 ring-white/15">
                <Sparkles className="h-5 w-5 text-cyan-300" />
              </div>
              <p className="mb-5 max-w-xs text-xs text-slate-400">
                Hi! I know the whole day — schedule, speakers, venue. What can I help
                you figure out?
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => ask(s)}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] text-slate-300 transition-colors hover:border-cyan-400/40 hover:text-white"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950"
                    : "border border-white/10 bg-black/30 text-slate-200"
                }`}
              >
                {m.content}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/30 px-4 py-2.5 text-xs text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-cyan-300" />
                Thinking…
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2 border-t border-white/10 p-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about the summit…"
            maxLength={2000}
            className="flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-cyan-400/50"
          />
          <button
            type="submit"
            disabled={!input.trim() || thinking}
            aria-label="Send"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 transition-all disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
