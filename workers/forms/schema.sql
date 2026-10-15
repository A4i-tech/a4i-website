CREATE TABLE IF NOT EXISTS submissions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  type         TEXT NOT NULL CHECK (type IN ('contact', 'newsletter')),
  fullname     TEXT,
  city         TEXT,
  organisation TEXT,
  email        TEXT NOT NULL,
  message      TEXT,
  user_agent   TEXT,
  page         TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- One newsletter signup per address; repeat signups are ignored by the Worker.
CREATE UNIQUE INDEX IF NOT EXISTS idx_newsletter_email
  ON submissions (email) WHERE type = 'newsletter';

CREATE INDEX IF NOT EXISTS idx_submissions_type_created
  ON submissions (type, created_at);
