# Top Interview 150 Web — All-in-One Execution Record

## Authorization

The user explicitly replaced the original multi-worker execution model with a single implementer model during the 2026-08-17 session.

This file records that execution override so future repository readers do not interpret the original W1 → W2/W5 → W3/W4 → W6 worker handoff sequence as still operational for this implementation.

## Integration branch

`agent/web-all-in-one`

The branch was created from the existing W1 foundation work and then used to implement the remaining web scope sequentially.

## Scope implemented on this branch

- Web foundation and shared UI primitives.
- Typed server-only canonical content loader.
- Versioned local learner-progress persistence and provider.
- Dashboard and Top Interview 150 problem explorer.
- Problem practice experience with progressive hints and spoiler controls.
- Playwright end-to-end coverage.
- Permanent GitHub Actions web CI.

## Canonical-content protection

The web implementation must not modify canonical content under:

- `problems/**`
- `study-plans/**`
- `raw/**`
- `schemas/**`

Those paths remain authoritative inputs to the web application.

## Validation gate

Before integration into `main`, and again on `main` after integration, the project must pass:

```bash
python tools/validate_content.py
cd web
npm ci
npm audit --omit=dev --audit-level=high
npm run lint
npm test
npm run build
npx playwright test
```

The permanent GitHub Actions workflow `.github/workflows/web-ci.yml` reproduces this gate for the integration branch, pull requests to `main`, and pushes to `main`.

## Release candidate status

The implementation is in final integration verification. The branch may be integrated only when the current branch HEAD has a fresh successful `Web CI` run and the diff from `main` contains no canonical-content changes. After integration, `main` must receive its own fresh successful `Web CI` run before the work is considered complete.
