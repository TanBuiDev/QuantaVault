# Deployment and publish security

## Runtime configuration

The public website is a static export. Its only server-side application endpoint is `/api/publish`, implemented by a separate Cloudflare Worker. Local algorithm mutation APIs and the Docker runner are not part of the website artifact. The local Next.js workspace retains those capabilities.

Configure these values as runtime settings, never as `NEXT_PUBLIC_*` variables or checked-in files:

| Variable | Purpose |
| --- | --- |
| `ADMIN_PIN` | Private administrator PIN, required independently of OTP |
| `TOTP_SECRET` | Private Base32 Authenticator secret |
| `GITHUB_PAT` | Token restricted to the intended repository and required content-write permissions |
| `GITHUB_OWNER` | Repository owner |
| `GITHUB_REPO` | Repository name |
| `PUBLISH_ORIGINS` | Comma-separated exact allowed origins, without paths; production website origin and explicitly permitted loopback origins |

Use `http://127.0.0.1:3000` for the default local application when allowing local publish. An origin includes its scheme and port. Do not use a wildcard or a broad domain suffix.

The publish request contains separate `pin` and `otp` values. Neither value is saved to browser storage. Requests missing either factor or missing server authentication configuration must fail without GitHub writes. An old browser client using only the former PIN header must be refreshed.

## Rotate previously exposed defaults

Treat PIN and TOTP values that previously appeared in source or history as disclosed. Generate a fresh PIN and a fresh random Base32 TOTP secret using a trusted password manager or an offline secret-generation tool; enroll the Authenticator privately. Do not put the enrollment QR code, seed, PIN or token in screenshots, chat, shell history, logs, test fixtures or commits.

Store production values through Cloudflare's secret settings. Configure local development privately outside version control. Revoke and replace a GitHub token if there is evidence that it was disclosed. Rotation of live settings and production deployment are explicit approved rollout actions, not side effects of building or testing.

## Data integrity

Publishing reads canonical questions at a captured Git commit, validates them and checks the submitted base versions before applying changes. A read, parse or validation failure must stop the transaction; an empty replacement dataset is not a fallback. Both interview JSON copies belong to one Git tree and commit. Branch updates must not use force.

An HTTP `409` means the content or branch changed: keep the draft and review the server version beside the local edit. Only an explicit confirmation may adopt the new baseline while retaining the edited content; submit again after that review. If the draft changes during review, review the current draft again. Do not automatically retry or silently rebase a stale overwrite. Publishing does not implicitly write local repository files.

A successful GitHub commit only starts the deployment process. The browser retains a pending-publication copy until deployed content matches it. If deployment is delayed or fails, inspect CI and retain a backup; do not discard the pending copy merely because a timer elapsed.

## Rate limiting and credentials

The in-memory failure counter is a best-effort guard for a running instance. It is not shared durably between isolates and does not provide complete distributed brute-force protection. Keep both factors strong and private. This release does not add a paid rate-limit or database service.

Do not log request bodies, PINs, OTPs, TOTP seeds or authorization headers. Public build artifacts must contain no secret configuration. The staging build must copy an explicit whitelist of application source/configuration and public content, excluding environment files, prior builds and scratch data.

## Review and rollout

1. Run lint, unit tests, local build, static Pages build, content validation and Python tests. Report skipped Docker tests honestly; run the Docker suite when the local runtime is available.
2. Exercise the actual Pages artifact in the local Pages runtime: direct problem URLs, F5, Next Link navigation, Back/Forward, unknown-route 404s, images, themes and disabled Run/Submit.
3. Exercise local content mutations against a copied fixture, never the user's canonical content. Mock GitHub in publish tests; do not create real commits while testing.
4. Inspect the artifact for credentials, environment files, logs and server-only local runtime code. Confirm all intended problem pages and media were emitted.
5. Present changed files, test results and a proposed commit message, then request the explicit GitHub/Cloudflare approval required by `AGENTS.md`. Do not deploy or push before approval.
6. After an approved rollout, smoke-test read-only website routes and inspect deployment status. If faulty, restore the previous known-good artifact; do not overwrite canonical content as a rollback shortcut.

## Offline scope and Mermaid

Mermaid is an npm dependency emitted in the site's own JavaScript chunks. It is initialized with `securityLevel: "strict"`, SVG labels and protected security settings, then its SVG output is sanitized. Interactive diagram links/HTML labels are intentionally restricted; an invalid diagram shows escaped source instead of injecting HTML.

The website has no service worker/PWA or cloud Java runner. Monaco's default loader can still require CDN access. Fonts are downloaded during the Next.js build and included in its assets. External content links/images, package installation, initial Docker image setup and GitHub publish remain network-dependent.

Reference: [Mermaid security levels](https://mermaid.js.org/config/usage#securitylevel).
