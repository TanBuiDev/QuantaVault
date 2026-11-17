# QuantaVault — Google account roles and automatic interview progress sync

## Compatibility and rollout scope
- Continue using the Cloudflare Pages advanced Worker, D1 binding `INTERVIEW_DB`, and GitHub Actions deployment.
- Migration `web/d1/migrations/0003_account_roles.sql` **only adds** a profile picture column and admin/security tables to existing Google OAuth tables. It never rewrites `interview_progress_accounts` or localStorage.
- Existing per-code D1 sync remains available for **manual recovery**; after a device links Google, legacy automatic writes must stop.
- First Google login creates role `user` (implicit). Nobody is automatically an administrator.
- The verified Google `sub` (SHA-256-derived user ID) is identity. Email must never be used for automatic admin promotion.

## First administrator: explicit owner action
1. Log into QuantaVault on production with the intended Google account.
2. Open the Account menu in the bottom sidebar and navigate to **Tài khoản & đồng bộ**.
3. Only while the app has no initial admin, the first-admin bootstrap form appears.
4. Enter the **existing QuantaVault administrator PIN/password** and the existing **6-digit TOTP**, then confirm.
5. Server atomically claims the one-time bootstrap record and grants this signed-in Google user the `admin` role. If another account has already claimed bootstrap, the request is rejected.
6. Refresh the account session. Admin editor controls then appear. The role is stored server-side in D1, not in a browser-controlled flag.

## Editor and publishing
- Only a signed-in `admin` sees the editor toggle. URL `?edit=true`, localStorage or Ctrl+Shift+E never authorize edits or publishing without that role.
- Before publishing: enter the existing QuantaVault admin password once; server issues an opaque 15-minute `__Host-qv_admin` cookie, bound to the active Google session.
- Each `POST /api/publish` checks Google login, current D1 role, session and active elevation before writing to GitHub. PIN/OTP fields in the publish body no longer authorize requests.
- TOTP is required for first-admin bootstrap and every admin role grant/revoke; the server retains attempts, locks failures and audits changes.
- Last-admin deletion is prevented by an atomic D1 condition. Admin sessions are invalid after logout or role revocation.
- Do not delete `ADMIN_PIN` or `TOTP_SECRET` in Cloudflare.

## Account-progress onboarding and device conflicts
- `/account/` compares local interview progress and the signed-in Google account's `oauth_interview_progress` state.
- User explicitly chooses to upload local progress (only to an empty/equivalent account), restore Google data or conservatively merge.
- Archive the original browser state BEFORE replacing progress or uploading. The storage operation fails closed on quota errors.
- Upon confirmed linking, debounce local changes; write via `revision` compare-and-swap and retry on focus/online.
- If another device has a newer revision and the local data also changed: report a conflict, **never overwrite either copy automatically**. Resolve with account-page unlink/relink after review. 'Review' takes precedence if knowledge-status flags disagree.
- Preserve local drafts, published cache and legacy sync code.
- This release covers interview progress (learned/review/bookmarks); course and algorithm progress still have separate storage and are potential follow-up work.

## Required preproduction validation
1. CI: lint, unit tests, Node build, Pages bundle, Java Docker and Playwright E2E.
2. Cloudflare D1 bookmark and complete export **before** migration.
3. Verify count and exact parity of original legacy `interview_progress_accounts` before/after additive migration, using a second copy if desired.
4. Apply `0003_account_roles.sql`, verify all new tables and required indexes.
5. Confirm no user was granted admin without the bootstrap action.
6. Merge PR only after passing automated tests and obtaining approval to deploy.
7. Verify GitHub `main`, workflow success and Cloudflare Pages actual production deployment ID.
8. Have project owner perform one real Google login, bootstrap admin using private credentials and test editor, publish, and cross-device sync.

## Rollback
- Roll back only the new Worker/frontend commit. Never drop the new role/session tables or reset the old D1 records.
- Do NOT revert D1 to a bookmark as a routine code rollback; that would discard legitimate study updates made since migration.
- The prior Google sync/manual code and local browser data remain available. Backups and Cloudflare Time Travel can be used only after explicitly validating the restoration's impact.
