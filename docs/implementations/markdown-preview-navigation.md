# QuantaVault — Markdown Preview → Editor Navigation

## Scope
Branch: `feature/markdown-preview-navigation`. Baseline: `1b2941844d877cb9f2db69643a53404da0a0f1e9`.

Stages 1–3: protect draft/content, map Markdown AST positions to the original source, and navigate from the preview to the existing textarea. No Markdown rewriting, new persistence, API, D1 migration, WYSIWYG, deployment or merge to `main`.

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
- `web/src/features/interview/markdownSourceNavigation.ts` (new)
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
