-- Additive account/permissions migration. Never modify existing bearer-code progress.
ALTER TABLE oauth_google_users ADD COLUMN picture_url TEXT;
CREATE TABLE IF NOT EXISTS oauth_user_roles (
  user_id TEXT PRIMARY KEY NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin')),
  granted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  granted_by TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES oauth_google_users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS oauth_admin_bootstrap (
  id INTEGER PRIMARY KEY NOT NULL CHECK (id=1),
  owner_user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_user_id) REFERENCES oauth_google_users(id)
);
CREATE TABLE IF NOT EXISTS oauth_admin_elevations (
  token_hash TEXT PRIMARY KEY NOT NULL,
  user_id TEXT NOT NULL,
  session_hash TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES oauth_google_users(id) ON DELETE CASCADE
);
CREATE INDEX IF NOT EXISTS idx_oauth_admin_elevations_session ON oauth_admin_elevations(session_hash);
CREATE TABLE IF NOT EXISTS oauth_admin_auth_attempts (
  user_id TEXT PRIMARY KEY NOT NULL,
  failures INTEGER NOT NULL DEFAULT 0,
  locked_until INTEGER NOT NULL DEFAULT 0,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (user_id) REFERENCES oauth_google_users(id) ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS oauth_admin_audit (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  subject_user_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
