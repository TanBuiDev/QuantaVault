-- Google-authenticated progress for course lessons and Top Interview 150.
-- Existing interview and 64-character legacy progress tables are untouched.
CREATE TABLE IF NOT EXISTS oauth_learning_progress (
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL CHECK (kind IN ('courses','top150')),
  state_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id,kind),
  FOREIGN KEY (user_id) REFERENCES oauth_google_users(id) ON DELETE CASCADE
);
