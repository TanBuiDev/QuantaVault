# QuantaVault — Markdown Preview → Editor Navigation

## Scope
Branch: `feature/markdown-preview-navigation`. Baseline: `1b2941844d877cb9f2db69643a53404da0a0f1e9`.

Stages 1–5: protect draft/content, map Markdown AST positions to the original source, and navigate from the preview to the existing textarea. No Markdown rewriting, new persistence, API, D1 migration, WYSIWYG, deployment or merge to `main`.

## Baseline and safety requirements
- `InterviewEditModal.tsx` owns `answerMarkdown` and drafts the content to `sessionStorage` after 400 ms.
- `MarkdownContent.tsx` uses `react-markdown`, GFM, KaTeX, syntax highlighting and Mermaid. Navigation is opt-in; other consumers remain read-only.
- The editor's save, close and restore flows must continue to work; a click in preview must never change `answerMarkdown` or trigger a new draft.
- Only navigate when the source rendered in preview equals current textarea value. Fail closed on missing or invalid parser positions.
- Never use text search to map duplicate paragraphs.
- Ignore actions on links, copy buttons, form controls, and active text selection.
- Continue supporting line endings CRLF/LF and UTF-16 source offsets, including emoji.
- Source positions for transformed bilingual text cannot be trusted: navigation is enabled only in unfiltered (`bilingual`) mode.

## Files in scope
- `web/src/features/interview/InterviewEditModal.tsx`
- `web/src/features/practice/MarkdownContent.tsx`
- `web/src/lib/markdownSourceNavigation.ts` (new)
- Related unit/integration tests.

## Acceptance (stages 1–3)
1. Click a heading, paragraph, list, table, Java fenced code or Mermaid diagram in split view; textarea takes focus and navigates to its matching Markdown block.
2. Repeated identical blocks still navigate to their original distinct positions.
3. No content mutation, new draft, publishing, API or D1 calls from navigation alone.
4. Code copy buttons and links keep their original behavior.
5. Stale preview and missing source positions do not navigate.
6. Existing editor save/draft/fullscreen regressions remain green.

## Commands for CI / local validation
From `web/`: `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npm run build:pages`, `npm run test:pages-build`, `npx playwright test`, `npm run test:pages`.

## Deployment policy
Development branch only. No merge or production deploy without explicit owner approval. GitHub Actions' `web-ci.yml` automatically deploys a successful push to `main`.

## Stage 4 — UX hardening (2026-11-10)
- Opt-in keyboard navigation: focus a source block with Tab and press Enter; links and Copy controls retain their own actions.
- Scoped hover/focus styles for Markdown source blocks; read-only learning pages keep original markup and behavior.
- Scroll the existing textarea to the rendered caret location using a temporary, offscreen layout mirror (no new editor dependency). For inputs over 200,000 UTF-16 units, fall back to native caret scrolling to limit layout cost.
- Update the screen-reader status message without React re-rendering the entire Markdown preview.
- Index Markdown source line starts only once per changed Markdown string (O(n) setup, O(log line count) position lookup), including CRLF and surrogate pairs.
- Preserve GFM table/blockquote source boundaries (cursor may land at original syntax character, rather than trimmed visible text).

## Stage 5 — Regression & CI acceptance
Verified implementation commit: `48a20365fac91d49e2ec6ae26bfbc70617e3bc3c`.
- GitHub Web CI: https://github.com/TanBuiDev/QuantaVault/actions/runs/42840516312 — SUCCESS.
- GitHub Java Docker isolation: https://github.com/TanBuiDev/QuantaVault/actions/runs/42840516268 — SUCCESS.
- ESLint, dependency audit, Next.js build, static Pages build and static build isolation: PASS.
- Vitest: **361 passed**, 16 skipped (56 test files passed, 1 skipped). The skipped suite is Docker Java integration, covered by a separate successful Docker workflow.
- Playwright regular E2E: **7/7 passed**.
- Playwright static Pages E2E: **8/8 passed**, including three new browser tests for precise location, keyboard, wrapped text/fullscreen and long-document behavior.
- Chromium performance sample with 220 Markdown sections: **350 ms** click-to-confirmed-caret, **422,302 bytes** of loaded encoded JS resource bodies. These are measurements from one CI browser run, **not** a browser-memory benchmark, bundle-diff, or statistically meaningful latency estimate.
- No new dependencies, changes to D1 schema, API endpoints, question storage format, or publish workflow.
- Automated tests validate behavior in Chromium; no separate human visual-design signoff has been performed.

## Remaining release controls
- Pull request: https://github.com/TanBuiDev/QuantaVault/pull/18 (DRAFT; do not merge without authorization).
- Production `main` reference at audit: `1b2941844d877cb9f2db69643a53404da0a0f1e9`; stage 4–5 commits exist only on the feature branch.
- The documentation-only audit commit following the verified implementation requires CI on the updated branch head before signoff.
- Stage 6 (merge, deploy, post-deploy Cloudflare verification) requires explicit user approval.
