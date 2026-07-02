import { FormEvent, useEffect, useState } from "react";
import { ChevronUp, Loader2, Send } from "lucide-react";
import { AttendeeQuestion } from "../types";
import { SESSIONS, sessionById } from "../data/schedule";

const UPVOTED_KEY = "youxai-upvoted-questions";

function readUpvoted(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(UPVOTED_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export default function QABoard() {
  const [questions, setQuestions] = useState<AttendeeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upvoted, setUpvoted] = useState<string[]>(readUpvoted);

  const [question, setQuestion] = useState("");
  const [author, setAuthor] = useState("");
  const [sessionId, setSessionId] = useState("");

  const loadQuestions = () => {
    fetch("/api/questions")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((data) => setQuestions(data as AttendeeQuestion[]))
      .catch(() => setError("Couldn't load questions. Pull to refresh or try again later."))
      .finally(() => setLoading(false));
  };

  useEffect(loadQuestions, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!question.trim() || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.trim(),
          author: author.trim() || "Anonymous",
          sessionId: sessionId || null,
        }),
      });
      if (!res.ok) throw new Error();
      const created = (await res.json()) as AttendeeQuestion;
      setQuestions((prev) => [created, ...prev]);
      setQuestion("");
    } catch {
      setError("Couldn't submit your question. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpvote = async (id: string) => {
    if (upvoted.includes(id)) return;
    const nextUpvoted = [...upvoted, id];
    setUpvoted(nextUpvoted);
    try {
      localStorage.setItem(UPVOTED_KEY, JSON.stringify(nextUpvoted));
    } catch {
      // storage unavailable — dedupe is best-effort
    }
    setQuestions((prev) =>
      prev.map((q) => (q.id === id ? { ...q, upvotes: q.upvotes + 1 } : q))
    );
    try {
      await fetch(`/api/questions/${id}/upvote`, { method: "POST" });
    } catch {
      // optimistic update stands; server will catch up on next load
    }
  };

  const sorted = [...questions].sort(
    (a, b) =>
      b.upvotes - a.upvotes ||
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div>
      <h2 className="mb-2 text-xl font-black uppercase tracking-tight text-white">
        Session Q&A
      </h2>
      <p className="mb-6 text-[11px] text-slate-500">
        Submit questions for speakers before and during sessions. Upvote the ones you want
        answered — moderators take the top-voted questions to the stage.
      </p>

      {/* Submit form */}
      <form
        onSubmit={handleSubmit}
        className="mb-8 space-y-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
      >
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="What do you want to ask?"
          rows={3}
          maxLength={500}
          className="w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-cyan-400/50"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name (optional)"
            maxLength={60}
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition-colors focus:border-cyan-400/50"
          />
          <select
            value={sessionId}
            onChange={(e) => setSessionId(e.target.value)}
            className="flex-1 rounded-xl border border-white/10 bg-black/30 px-3.5 py-2.5 text-sm text-slate-300 outline-none transition-colors focus:border-cyan-400/50"
          >
            <option value="">General / any session</option>
            {SESSIONS.filter((s) => s.track !== "break").map((s) => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={!question.trim() || submitting}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-cyan-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-950 transition-all disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
          Submit question
        </button>
        {error && <p className="text-xs text-red-400">{error}</p>}
      </form>

      {/* Question list */}
      {loading ? (
        <p className="text-xs text-slate-500">Loading questions…</p>
      ) : sorted.length === 0 ? (
        <p className="text-xs text-slate-500">
          No questions yet — be the first to ask one.
        </p>
      ) : (
        <div className="space-y-3">
          {sorted.map((q) => {
            const session = q.sessionId ? sessionById(q.sessionId) : undefined;
            const hasUpvoted = upvoted.includes(q.id);
            return (
              <div
                key={q.id}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
              >
                <button
                  onClick={() => handleUpvote(q.id)}
                  disabled={hasUpvoted}
                  aria-label="Upvote question"
                  className={`flex shrink-0 flex-col items-center rounded-xl px-2.5 py-1.5 transition-all ${
                    hasUpvoted
                      ? "bg-cyan-500/20 text-cyan-300"
                      : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-cyan-300"
                  }`}
                >
                  <ChevronUp className="h-4 w-4" />
                  <span className="text-xs font-bold tabular-nums">{q.upvotes}</span>
                </button>
                <div className="min-w-0">
                  <p className="text-sm leading-relaxed text-white">{q.question}</p>
                  <p className="mt-1.5 text-[10px] text-slate-500">
                    {q.author}
                    {session && (
                      <>
                        {" · "}
                        <span className="text-slate-400">{session.title}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
