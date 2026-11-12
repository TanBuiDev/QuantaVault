# QuantaVault Google OAuth — rollout checklist

## Scope and invariants
- Google OpenID Connect authorization-code flow with state, nonce, PKCE (S256) and signed ID token verification against Google's JWKS.
- Session cookies use `__Host-qv_session`, `Secure`, `HttpOnly`, `SameSite=Lax`; only SHA-256 of the random session token is stored in D1. Expiration: 14 days.
- Google OAuth `sub` is the stable account identifier. Email is **not** used as primary identity, and Google sign-in does not grant publisher/admin rights.
- Existing `interview_progress_accounts`, 256-bit sync codes, browser localStorage progress, and drafts are not modified by this migration.
- Google account progress is strictly **opt in**: initial upload only if the account row does not exist; download requires explicit confirmation and a pre-import local archive. No automatic account overwrite or sync yet.
- Never store Google access/refresh/ID tokens; never expose client secret to static builds or GitHub.

## Google Cloud Console (owner action)
1. Create/select a Google Cloud project under Google Auth Platform.
2. Configure Branding and Audience, add test users while app is in Testing.
3. Create **Web application** OAuth client, set:
   - Authorized JavaScript origin: `https://quantavault.pages.dev`
   - Authorized redirect URI (exact): `https://quantavault.pages.dev/api/auth/google/callback`
4. Verify the OAuth audience/publishing status and domain ownership requirements as needed.
5. Place `GOOGLE_CLIENT_SECRET` in **Cloudflare Pages → quantavault → Settings → Variables and Secrets → Production → Add → Encrypt**. Do **not** send it in chat or commit it.
6. The OAuth Client ID can be set as plaintext `GOOGLE_CLIENT_ID` in the same Production settings:
   `567990028938-03d27ug65h8bcj5o1m20polgho680ed4.apps.googleusercontent.com`.
7. Add `https://quantavault.pages.dev/privacy/` as Privacy Policy URL if requested by the Google Branding setup.

## D1 migration (operator, BEFORE deploying enabled login)
- Confirm existing production DB `quantavault-study-progress`, binding `INTERVIEW_DB`.
- Create a D1 backup; run non-destructive `web/d1/migrations/0002_google_oauth.sql`.
- Verify `oauth_google_users`, `oauth_sessions`, and `oauth_interview_progress` tables exist. Old `interview_progress_accounts` must remain unchanged.
- D1 preview is intentionally not bound to production. Use a test database for non-production end-to-end login tests.
- Configure both OAuth environment variables in Cloudflare Pages production and redeploy after they are set.

## QA and release
- On main: run `npm run lint`, `npm test`, `npm run build`, `npm run build:pages`, and Playwright E2E.
- On Cloudflare: verify `/api/auth/session` returns unauthenticated without a valid cookie; `/api/auth/google/start` redirects only from production HTTPS; callback accepts only a signed, valid Google ID token with matching nonce/audience.
- Sign in with a Google test account; verify sign-out; verify legacy sync-code progress and question publishing still function independently.
- Test account progress first upload, second-device download, and 409 version conflict without overwrite.
- Do not auto-enable production from this PR alone; user must approve deployment after credentials and migration are ready.

## Rollback
- Revert the worker/UI feature to disable sign-in (existing D1 legacy progress stays untouched).
- **Do not drop** the newly added OAuth tables during routine rollback; their data may be needed for recovery.
- Revoke sessions through targeted session deletion only if there is a security incident; never wipe legacy study data.
