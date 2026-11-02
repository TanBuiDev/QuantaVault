# QuantaVault — Cloudflare D1 interview progress

This feature stores **only** the `learned`, `review` and `bookmarks` interview question flags.
Interview content and draft publishing continue to use the existing architecture.

## Production

- Cloudflare D1 database: `quantavault-study-progress`.
- Pages project: `quantavault`.
- Pages Functions / advanced Worker binding: `INTERVIEW_DB`.
- Migration: `web/d1/migrations/0001_interview_progress.sql`.
- Endpoint: `GET/PUT /api/interview-progress` (never send the key in URLs).
- The project uses the bundled `web/scripts/pages-worker.ts` in Pages Advanced Mode; do **not**
  add a second `_worker.js` or replace the existing `/api/publish` route.

The D1 binding is configured in the Cloudflare Pages **production** deployment settings,
not in the static Next.js build environment. Preview environments require a separate
D1 binding if preview syncing is wanted.

## Security and user experience

- Users generate a 256-bit random synchronization code locally (64 lowercase hex characters).
- The code is a **bearer secret**, effectively a password: anyone with it can read and edit
  that progress. It is stored only in the browser and sent via the Authorization header over HTTPS.
- The server only uses SHA-256 of the code as the D1 row identifier. There are no accounts
  or password recovery; users must keep a secure copy of their code.
- Initial upload/download are explicitly user-initiated and warn before replacing a copy.
- Once a baseline is established, edits are written with an optimistic revision check.
  On conflict or network failure, local progress remains intact; a user must manually
  resolve by uploading or downloading. Do not auto-overwrite remote state on conflict.
- Revisit the page with an unchanged local baseline to refresh from the cloud safely.
- The existing `interview-prep-progress-v1` localStorage data remains in place.
- This feature does **not** sync editor drafts, scratchpad notes, or LeetCode progress.

## Testing

Run `npm run lint`, `npm test`, and `npm run build:pages` in `web/`.
The D1 endpoint is also covered by `web/functions/api/interview-progress.test.ts`.

To recover: remove the sync code from the website UI (this never deletes local progress).
The D1 table can be backed up or inspected through Cloudflare D1 tooling. Do not share
the sync code in logs, screenshots, GitHub issues, or commit messages.
