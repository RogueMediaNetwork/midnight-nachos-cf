CREATE TABLE IF NOT EXISTS ads (
  slot TEXT PRIMARY KEY,
  image_key TEXT,
  image_alt TEXT NOT NULL DEFAULT '',
  href TEXT NOT NULL DEFAULT '',
  enabled INTEGER NOT NULL DEFAULT 0,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO ads (slot, image_alt) VALUES
  ('hero', 'Midnight Nachos partner placement'),
  ('stream', 'Midnight Nachos partner placement'),
  ('footer', 'Midnight Nachos partner placement');
