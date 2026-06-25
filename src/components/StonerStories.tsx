import React, { useState, useEffect } from "react";
import { StonerStory } from "../types";
import { MessageSquare, ThumbsUp, Send, Loader2, RefreshCw, Tag, AlertTriangle } from "lucide-react";

export default function StonerStories() {
  const [stories, setStories] = useState<StonerStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [votedStories, setVotedStories] = useState<string[]>([]);
  
  // Tag filter states
  const [selectedTag, setSelectedTag] = useState<string>("All");

  const fetchStories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stories");
      if (!res.ok) {
        throw new Error("Failed to load stories from the astral matrix.");
      }
      const data = await res.json();
      setStories(data);
    } catch (err: any) {
      setError(err.message || "An unexpected disturbance occurred while retrieving stories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  const handleUpvote = async (id: string) => {
    if (votedStories.includes(id)) return; // Prevent double voting in session
    
    // Optimistic UI update
    setStories(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s));
    setVotedStories(prev => [...prev, id]);

    try {
      const res = await fetch(`/api/stories/${id}/upvote`, {
        method: "POST"
      });
      if (!res.ok) {
        // Rollback on error
        setStories(prev => prev.map(s => s.id === id ? { ...s, upvotes: s.upvotes - 1 } : s));
        setVotedStories(prev => prev.filter(item => item !== id));
      }
    } catch (err) {
      console.error("Failed to sync vote with server:", err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setSubmitting(true);
    setSubmitSuccess(false);
    setError(null);

    // Process tags
    const processedTags = tagInput
      .split(",")
      .map(t => t.trim())
      .filter(t => t.length > 0);

    try {
      const res = await fetch("/api/stories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          tags: processedTags.length > 0 ? processedTags : ["General"]
        })
      });

      if (!res.ok) {
        throw new Error("Unable to deliver story to the mainframe.");
      }

      const newStory = await res.json();
      setStories(prev => [newStory, ...prev]);
      setTitle("");
      setContent("");
      setTagInput("");
      setSubmitSuccess(true);
      
      // Auto dismiss success toast
      setTimeout(() => setSubmitSuccess(false), 5000);
    } catch (err: any) {
      setError(err.message || "Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Get unique tags for quick filtering
  const allTags = ["All", ...Array.from(new Set(stories.flatMap(s => s.tags || [])))];

  const filteredStories = selectedTag === "All"
    ? stories
    : stories.filter(s => s.tags && s.tags.includes(selectedTag));

  return (
    <div id="stories-page-container" className="mx-auto max-w-5xl px-4 py-8 font-sans text-slate-200">
      {/* Visual Title Header */}
      <div className="mb-10 text-center">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-500/10 text-pink-400 border border-pink-500/20 mb-3 shadow-lg shadow-pink-500/5">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
          Late-Night <span className="text-pink-400">Stoner Stories</span>
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-slate-400">
          A completely anonymous bulletin of silly situations, profound ceiling fan talks, and freezer mysteries. Share your gaze.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Left column: Feed (7 columns) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Tags quick filter shelf */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="flex items-center gap-1.5 shrink-0 text-xs font-mono text-slate-500 mr-1">
              <Tag className="h-3.5 w-3.5" />
              <span>Filter:</span>
            </span>
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`rounded-full px-3 py-1 text-xs font-mono transition-all shrink-0 ${
                  selectedTag === tag
                    ? "bg-pink-500/10 text-pink-400 border border-pink-500/30 font-bold"
                    : "bg-white/5 border border-transparent text-slate-400 hover:text-slate-200"
                }`}
              >
                #{tag}
              </button>
            ))}
            {stories.length > 0 && (
              <button
                onClick={fetchStories}
                className="ml-auto shrink-0 p-1 text-slate-500 hover:text-slate-300 transition-colors"
                title="Refresh feed"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Stories List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-pink-400 mb-3" />
              <p className="text-sm font-mono">Tuning frequency to late-night frequencies...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="rounded-3xl border border-white/5 bg-white/5 p-12 text-center backdrop-blur-md">
              <AlertTriangle className="mx-auto h-8 w-8 text-slate-600 mb-2" />
              <p className="text-sm text-slate-400">No anonymous entries found matching #{selectedTag}.</p>
              <button
                onClick={() => setSelectedTag("All")}
                className="mt-4 rounded-xl bg-pink-500 hover:bg-pink-400 text-white px-4 py-2 text-xs font-bold transition-all"
              >
                Show All Stories
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredStories.map((story) => {
                const alreadyVoted = votedStories.includes(story.id);
                const timeStr = story.createdAt 
                  ? new Date(story.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
                  : "Late Night";

                return (
                  <article
                    key={story.id}
                    className="group rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md hover:border-white/20 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <h3 className="text-lg font-bold text-white group-hover:text-pink-300 transition-colors">
                          {story.title}
                        </h3>
                        <span className="text-[10px] text-gray-500 font-mono">
                          Anonymous Reporter • {timeStr}
                        </span>
                      </div>
                      
                      {/* Voting Trigger */}
                      <button
                        onClick={() => handleUpvote(story.id)}
                        disabled={alreadyVoted}
                        className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-mono transition-all ${
                          alreadyVoted
                            ? "bg-pink-500/20 text-pink-400 font-semibold cursor-default"
                            : "bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <ThumbsUp className={`h-3.5 w-3.5 ${alreadyVoted ? "fill-pink-500/50" : ""}`} />
                        <span>{story.upvotes}</span>
                      </button>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans whitespace-pre-line mb-4">
                      &ldquo;{story.content}&rdquo;
                    </p>

                    <div className="h-[1px] bg-white/10 w-full mb-3" />

                    {/* Story Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {story.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-white/5 border border-white/5 px-2 py-0.5 text-[10px] font-mono text-slate-400 hover:text-slate-200 cursor-pointer"
                          onClick={() => setSelectedTag(tag)}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Submit Story Form (5 columns) */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md">
            <span className="text-[10px] uppercase tracking-widest text-pink-400 font-bold font-mono">
              Anonymous Submission Desk
            </span>
            <h3 className="text-xl font-bold text-white mt-1 mb-4">
              Submit Your Haze
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Title / Subject
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., The Apple TV Remote Freezer Mystery"
                  maxLength={80}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  What happened? (100% Anonymous)
                </label>
                <textarea
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="I was staring at the microwave for 5 minutes only to realize I never hit start..."
                  rows={6}
                  maxLength={1000}
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all resize-none"
                />
                <div className="mt-1 flex justify-end text-[10px] text-slate-600 font-mono">
                  {content.length}/1000 chars
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  placeholder="e.g., Microwave Fails, Cozy, Philosophy"
                  className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:border-pink-500/50 focus:outline-none focus:ring-1 focus:ring-pink-500/50 transition-all"
                />
              </div>

              {submitSuccess && (
                <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3.5 text-center text-xs text-emerald-400">
                  Your story has drifted successfully into the orbit. Scroll the feed to read it!
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-pink-500 hover:bg-pink-400 text-white py-3 font-bold text-xs tracking-wider transition-all cursor-pointer shadow-lg shadow-pink-500/10 active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Broadcasting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-3.5 w-3.5" />
                    <span>BROADCAST ANONYMOUSLY</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
