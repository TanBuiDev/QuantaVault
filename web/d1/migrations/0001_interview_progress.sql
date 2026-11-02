-- Private interview study progress. The 256-bit sync code is never persisted.
-- owner_hash = SHA-256(sync code) computed by the Pages Worker.
CREATE TABLE IF NOT EXISTS interview_progress_accounts (
  owner_hash TEXT PRIMARY KEY NOT NULL,
  state_json TEXT NOT NULL,
  revision INTEGER NOT NULL DEFAULT 1 CHECK (revision >= 1),
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);
