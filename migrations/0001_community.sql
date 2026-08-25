CREATE TABLE IF NOT EXISTS story_votes (
  story_id TEXT NOT NULL,
  voter_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (story_id, voter_hash)
);

CREATE TABLE IF NOT EXISTS story_comments (
  id TEXT PRIMARY KEY,
  story_id TEXT NOT NULL,
  voter_hash TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_story_comments_story_created
  ON story_comments (story_id, created_at);

CREATE TABLE IF NOT EXISTS comment_rate_limits (
  voter_hash TEXT PRIMARY KEY,
  last_comment_at INTEGER NOT NULL
);
