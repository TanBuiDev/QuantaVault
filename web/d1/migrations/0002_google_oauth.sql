-- OAuth identity tables are ADDITIVE. Do not modify existing interview_progress_accounts.
-- Store only verified Google subject/email/name, token HASH (never cookie token),
-- and opt-in account progress. OAuth login does not move old sync-code progress.
CREATE TABLE IF NOT EXISTS oauth_google_users (
  id TEXT PRIMARY KEY NOT NULL,
  google_sub TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  display_name TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS oauth_sessions (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES oauth_google_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_user ON oauth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_oauth_sessions_expires ON oauth_sessions(expires_at);
CREATE TABLE IF NOT EXISTS oauth_interview_progress (
  user_id TEXT PRIMARY KEY NOT NULL,
  state_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES oauth_google_users(id) ON DELETE CASCADE
);
