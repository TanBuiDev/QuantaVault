-- Additive, idempotent, server-only Google owner bootstrap protection.
-- Populate the allowlist ONLY from verified Google identity in production D1;
-- never accept an email or owner ID submitted by a browser.
CREATE TABLE IF NOT EXISTS oauth_admin_owner_allowlist (
  user_id TEXT PRIMARY KEY NOT NULL,
  configured_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES oauth_google_users(id) ON DELETE CASCADE
);

-- Defense-in-depth: even an old Worker cannot bootstrap an unapproved user.
CREATE TRIGGER IF NOT EXISTS oauth_admin_bootstrap_owner_gate
BEFORE INSERT ON oauth_admin_bootstrap
BEGIN
  SELECT CASE WHEN NOT EXISTS (
    SELECT 1 FROM oauth_admin_owner_allowlist WHERE user_id=NEW.owner_user_id
  ) THEN RAISE(ABORT, 'OWNER_NOT_ALLOWED') END;
END;

-- Role creation and audit must succeed in the SAME atomic D1 statement.
CREATE TRIGGER IF NOT EXISTS oauth_admin_bootstrap_role
AFTER INSERT ON oauth_admin_bootstrap
BEGIN
  INSERT INTO oauth_user_roles(user_id,role,granted_by)
    VALUES (NEW.owner_user_id,'admin',NEW.owner_user_id);
  INSERT INTO oauth_admin_audit(actor_user_id,action,subject_user_id)
    VALUES (NEW.owner_user_id,'admin_bootstrap',NEW.owner_user_id);
END;
