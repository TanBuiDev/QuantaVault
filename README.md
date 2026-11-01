# QuantaVault

QuantaVault is a Java algorithm practice and interview study application. Canonical content lives in Git; personal progress and drafts live in the browser.

[Web CI](https://github.com/TanBuiDev/QuantaVault/actions/workflows/web-ci.yml) · [Website](https://quantavault.pages.dev) · [Repository](https://github.com/TanBuiDev/QuantaVault)

## Website and local workspace

| Capability | Static website on Cloudflare Pages | Local Next.js workspace |
| --- | --- | --- |
| Problems, hints, solutions, interview notes and illustrations | Available as prebuilt pages and assets | Available |
| Search, filters, bookmarks and learning progress | Stored in the browser | Stored in the browser |
| Monaco editor and personal code drafts | Available; Run/Submit disabled | Available |
| Java execution | Planned for a later funded phase | Java 25 Docker sandbox |
| Edit canonical algorithm approaches/code versions | Hidden | Local filesystem APIs |
| Edit interview questions | Browser drafts; explicit publish | Browser drafts; explicit publish |
| Publish interview questions | Worker API requiring PIN **and** OTP | Same shared publish service |

The Top Interview 150 study plan is in `study-plans/top-interview-150/index.yaml`. Interview content is in `data/interview-questions.json` and its web copy. Counts shown by the application come from content; test totals and framework versions should be read from current command output and the dependency lockfile rather than badges.

## Architecture

- **UI:** Next.js App Router, React, TypeScript, Tailwind CSS, shared Modal/ConfirmDialog/Toast components, Monaco and resizable panels.
- **Canonical content:** YAML metadata and test cases, Markdown lessons, Java solutions and checked-in illustrations.
- **Browser state:** URL parameters for navigation, session storage for unsaved form drafts, local storage for saved unpublished edits, personal code and progress.
- **Publishing:** PIN and TOTP verification, schema checks, conflict detection and atomic GitHub tree/commit updates for both interview JSON files. A successful commit is distinct from a successful deployment.
- **Local Java:** Docker without network access, non-root user, read-only root filesystem and CPU, memory, process, time and output limits.
- **Diagrams:** Mermaid is bundled from a locked npm dependency, uses strict security and sanitizes generated SVG before insertion into the page.

## Development

Use a supported Node.js version from `web/package.json` (Node 22 is the CI baseline), npm 11, and Python 3.10+ for content tooling. Docker Desktop with Linux containers is optional unless running Java.

```powershell
cd web
npm ci
npm run dev
```

Open [the local workspace](http://127.0.0.1:3000). To prepare the local Java runner:

```powershell
npm run java:setup
npm run test:docker
```

## Verification and builds

From `web/`:

```powershell
npm run lint
npm test
npm run build
npm run build:pages
npm run test:pages-build
npm run test:pages
npx playwright test
```

`build` produces the local Next.js application. `build:pages` prepares an isolated static export and the publish Worker; it does not deploy. `test:pages-build` checks packaging and `test:pages` exercises the artifact in the local Pages runtime. The final Playwright command tests the local Next.js workspace. Java integration tests are conditional; report skipped tests separately from passed tests.

From the repository root:

```powershell
python tools/validate_content.py
python -m unittest discover -s tests -p 'test_*.py'
```

## Storage, recovery and publishing

Saving an interview edit keeps it in this browser until explicitly published. Unsaved modal content is a separate session draft: recovery requires a user choice and never silently replaces the current saved version. Publishing must preserve changes made while the request is running. A pending publication cache remains until the deployed canonical content confirms it; elapsed time alone is not proof of a completed deployment.

See [deployment and security](docs/deployment-security.md) for required runtime configuration, credential rotation and rollout checks. Never commit `.env*`, credentials, logs or temporary artifacts. Push and deployment require the explicit review gate in `AGENTS.md`.

## Network and offline boundaries

There is no service worker or installable PWA in this release. Static hosting does not mean the website is guaranteed to work without a network connection. Mermaid and site illustration assets are bundled locally; Monaco's default loader may fetch editor files from its CDN. `next/font` downloads Google font files during builds and serves the resulting files with the application. Canonical Markdown can contain external links or images. Installing npm packages, initial Java image setup and GitHub publishing also require network access.

After dependencies and the Java image are installed, local Java execution does not use an external judge service. Full offline operation of every browser feature is not claimed.
