import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { ExternalLink, Radio, Sparkles } from "lucide-react";
import "../fresh-batch.css";

export interface WireStory {
  id: string;
  title: string;
  description?: string;
  source: string;
  published: string;
  url: string;
  score?: number;
}

interface FreshBatchState {
  stories: WireStory[];
  updatedAt?: string;
  loading: boolean;
}

const FreshBatchContext = createContext<FreshBatchState>({ stories: [], loading: true });

const fetchFreshBatch = async (): Promise<Omit<FreshBatchState, "loading">> => {
  const response = await fetch("/api/fresh-batch", { headers: { Accept: "application/json" } });
  if (!response.ok) throw new Error("Fresh Batch is unavailable");
  const data = await response.json() as { stories?: WireStory[]; updatedAt?: string };
  return { stories: Array.isArray(data.stories) ? data.stories : [], updatedAt: data.updatedAt };
};

export function FreshBatchProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<FreshBatchState>({ stories: [], loading: true });

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const next = await fetchFreshBatch();
        if (active) setState({ ...next, loading: false });
      } catch {
        if (active) setState(current => ({ ...current, loading: false }));
      }
    };
    void load();
    const refresh = window.setInterval(() => void load(), 60 * 60 * 1000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, []);

  return <FreshBatchContext.Provider value={state}>{children}</FreshBatchContext.Provider>;
}

function useFreshBatch() {
  return useContext(FreshBatchContext);
}

function bestStory(stories: WireStory[]) {
  return [...stories].sort((a, b) => (b.score ?? 0) - (a.score ?? 0))[0] ?? stories[0];
}

function timeLabel(updatedAt?: string) {
  if (!updatedAt) return "Refreshes hourly";
  const time = new Date(updatedAt);
  if (Number.isNaN(time.getTime())) return "Refreshes hourly";
  return `Freshened ${time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}`;
}

export function FreshBatchTicker() {
  const { stories, loading } = useFreshBatch();
  const tickerStories = stories.slice(0, 6);

  return (
    <aside className="fresh-batch-ticker" aria-label="Fresh Batch cannabis news ticker">
      <div className="fresh-batch-ticker__inner">
        <span className="fresh-batch-ticker__badge"><Radio size={13} aria-hidden="true" />
        <span className="fresh-batch-label">Fresh Batch</span>
        </span>
        {tickerStories.length ? (
          <div className="fresh-batch-ticker__viewport">
            <div className="fresh-batch-ticker__track">
              {[...tickerStories, ...tickerStories].map((story, index) => (
                <a className="fresh-batch-ticker__story" href={story.url} target="_blank" rel="noreferrer" key={`${story.id}-${index}`}>
                  <span>{story.title}</span><em>{story.source}</em>
                </a>
              ))}
            </div>
          </div>
        ) : (
          <span className="fresh-batch-ticker__fallback">
            {loading ? "Loading the late-night wire…" : "The next fresh story is loading soon."}
          </span>
        )}
      </div>
    </aside>
  );
}

export function FreshBatchLead() {
  const { stories, loading } = useFreshBatch();
  const story = useMemo(() => bestStory(stories), [stories]);

  return (
    <article className="fresh-batch-lead">
      <div className="fresh-batch-lead__top">
        <span className="fresh-batch-kicker">From the Green Wire</span>
        <Sparkles size={14} aria-hidden="true" />
      </div>
      {story ? (
        <>
          <h3>{story.title}</h3>
          <p>{story.description || `${story.source} is on the story.`}</p>
          <a className="fresh-batch-link" href={story.url} target="_blank" rel="noreferrer">
            Read the fresh batch <ExternalLink size={13} aria-hidden="true" />
          </a>
        </>
      ) : (
        <>
          <h3>{loading ? "The wire is warming up." : "Fresh stories return on the next pull."}</h3>
          <p>The Green Wire checks the cannabis world hourly, then removes duplicate coverage before it lands here.</p>
          <a className="fresh-batch-link" href="https://green-wire-news.mike-663.workers.dev/" target="_blank" rel="noreferrer">
            Open The Green Wire <ExternalLink size={13} aria-hidden="true" />
          </a>
        </>
      )}
    </article>
  );
}

export function FreshBatchPocket() {
  const { stories, updatedAt } = useFreshBatch();
  const picks = useMemo(() => stories.slice(1, 3), [stories]);

  if (!picks.length) return null;

  return (
    <section className="fresh-batch-pocket" aria-labelledby="fresh-batch-pocket-title">
      <div className="fresh-batch-pocket__head">
        <div>
          <span className="fresh-batch-kicker">A little something fresh</span>
          <h2 id="fresh-batch-pocket-title">Two more from the wire</h2>
          <div className="fresh-batch-pocket__meta">
            <span className="fresh-batch-pocket__warning">Warning: good and bad vibes included.</span>
            <span className="fresh-batch-pocket__updated">{timeLabel(updatedAt)} · deduped</span>
          </div>
        </div>
      </div>
      <div className="fresh-batch-pocket__stories">
        {picks.map(story => (
          <article className="fresh-batch-pocket__story" key={story.id}>
            <span className="fresh-batch-source">{story.source}</span>
            <a href={story.url} target="_blank" rel="noreferrer">{story.title}</a>
          </article>
        ))}
      </div>
    </section>
  );
}

export function SponsorPocket() {
  return (
    <aside className="fresh-batch-ad" aria-label="Advertising placement">
      <div className="fresh-batch-ad__top">
        <span className="fresh-batch-ad-label">Ad space</span>
        <span className="fresh-batch-source">Snack break</span>
      </div>
      <h3>Your late-night brand goes here.</h3>
      <p>A compact placement for food, culture, glass, art, events, and the things people reach for after midnight.</p>
    </aside>
  );
}

export function SponsorStrip({
  placement = "After-hours shelf",
  headline = "Put your good stuff in front of the night owls.",
  copy = "A roomy home for a food, glass, art, event, or local business that fits the Midnight Nachos crowd.",
}: {
  placement?: string;
  headline?: string;
  copy?: string;
}) {
  return (
    <aside className="fresh-batch-ad fresh-batch-ad--wide" aria-label="Advertising placement">
      <div>
        <span className="fresh-batch-ad-label">Ad space</span>
        <h3>{headline}</h3>
        <p>{copy}</p>
      </div>
      <span className="fresh-batch-ad__placement">{placement}</span>
    </aside>
  );
}
