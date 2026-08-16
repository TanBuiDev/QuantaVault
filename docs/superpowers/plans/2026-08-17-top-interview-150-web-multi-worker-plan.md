# Top Interview 150 Web Multi-Worker Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal web application for studying the repository's canonical Top Interview 150 content without duplicating the 150 problem packages, while allowing multiple independent ChatGPT worker conversations to implement the web safely in parallel.

**Architecture:** The existing repository remains the canonical content source. A new `web/` Next.js application reads `study-plans/top-interview-150/index.yaml` and the canonical `problems/**` V2 packages server-side. Learner-specific state is isolated in a versioned browser-storage layer for the MVP so canonical content remains immutable. Work is split into dependency waves with non-overlapping file ownership and branch isolation.

**Tech Stack:** Next.js App Router, React, TypeScript, Tailwind CSS, YAML parsing, React Markdown + GFM, Vitest + Testing Library, Playwright, npm.

## Global Constraints

- Repository: `TanBuiDev/leetcode`.
- Canonical content is under `problems/**`; workers must treat it as read-only unless the Coordinator explicitly authorizes a content fix.
- Canonical study-plan order is `study-plans/top-interview-150/index.yaml`; do not hard-code a second copy of the 150 IDs in the web app.
- The web app lives only under `web/` except for explicitly assigned documentation/CI changes.
- The MVP does not include authentication, cloud database synchronization, arbitrary remote Java execution, scraping LeetCode, or AI-generated tutoring.
- Learner progress must never be written into `meta.yaml` or any canonical problem file.
- `content_status` in each V2 `meta.yaml` is authoritative for whether Problem/Hints/Solution/Interview/Cases content is available.
- Use stable package releases, never canary/nightly versions.
- Use npm and commit `web/package-lock.json`.
- Workers do not commit directly to `main`. Each implementation worker uses its assigned branch.
- Each worker starts from the exact `main` that already contains all dependency waves listed for that worker.
- Each worker must run relevant tests, lint, and build checks before reporting completion.
- Each worker must create a handoff file at `docs/web-workers/handoffs/WX.md` on its own branch summarizing scope, commit SHA, tests, known limitations, and files changed.
- Only the Coordinator merges worker branches and updates project-wide status.
- A worker that discovers a required change outside its ownership must stop that specific edit, document the dependency in its handoff, and let the Coordinator route it.

---

## 1. Existing repository contract

The website is being built on top of the already-migrated V2 content model.

Per canonical problem folder:

```text
problems/<primary-section>/<zero-padded-id>-<slug>/
├── meta.yaml
├── problem.md
├── hints.md          # optional, according to content_status
├── solution.md       # optional, according to content_status
├── interview.md      # optional, according to content_status
├── Solution.java     # optional, according to content_status
├── cases.yaml        # optional, according to content_status
└── assets/           # optional
```

Website mapping:

```text
meta.yaml       -> search, filter, badges, availability, navigation
problem.md      -> Problem tab
hints.md        -> progressive Hint reveal
solution.md     -> Solution tab
interview.md    -> Interview tab
Solution.java   -> reference Java source block
cases.yaml      -> reserved structured input for a later runner phase
assets/problem  -> Problem-tab media
assets/solution -> Solution-tab media
```

Study-plan order and sections come only from:

```text
study-plans/top-interview-150/index.yaml
```

Existing validation remains available through:

```text
tools/validate_content.py
tools/inventory.py
```

Workers must not replace these Python content validators with web-specific copies.

---

## 2. MVP product scope

The first deployable MVP must provide:

1. Home dashboard with total progress and section progress.
2. Top Interview 150 problem explorer with search and filters.
3. Per-problem practice page.
4. Tabs/views for Problem, Hints, Solution, and Interview when content exists.
5. Progressive hint reveal.
6. Explicit solution reveal to reduce accidental spoilers.
7. Java reference-code display when `Solution.java` exists.
8. Previous/next navigation following study-plan order.
9. Learner states: not started, in progress, solved, review.
10. Bookmarks, confidence, revealed-hint count, solution/interview viewed flags, and personal notes.
11. Persistent browser storage with a versioned schema.
12. Responsive desktop/mobile layouts.
13. Content-loading and UI tests plus end-to-end smoke tests.
14. A production build that succeeds without modifying the 150 canonical problem folders.

Deferred after MVP:

- Login/account system.
- Supabase or other cloud synchronization.
- Secure Java code execution/judging.
- Submission history.
- Spaced-repetition scheduler beyond manually marking `review`.
- AI tutor/chat.
- Multiple study plans.

---

## 3. Target web file structure

```text
web/
├── package.json
├── package-lock.json
├── next.config.ts
├── tsconfig.json
├── eslint.config.mjs
├── postcss.config.mjs
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── globals.css
    │   ├── page.tsx
    │   ├── problems/
    │   │   ├── page.tsx
    │   │   └── [id]/
    │   │       ├── page.tsx
    │   │       └── not-found.tsx
    │   └── not-found.tsx
    ├── components/
    │   ├── layout/
    │   └── ui/
    ├── features/
    │   ├── dashboard/
    │   ├── problem-list/
    │   └── practice/
    ├── lib/
    │   ├── content/
    │   └── progress/
    └── test/
        └── setup.ts

web/e2e/
└── top150.spec.ts
```

Do not introduce a second application root or a second frontend framework.

---

## 4. Shared TypeScript contracts

### 4.1 Content contract — owned by W2

```ts
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ContentAvailability = 'none' | 'partial' | 'complete';

export interface ProblemSummary {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  primarySection: string;
  topics: string[];
  patterns: string[];
  leetcodeUrl: string;
  contentStatus: {
    source: 'full-source' | 'list-only' | 'source-missing';
    translation: ContentAvailability;
    hints: ContentAvailability;
    solution: ContentAvailability;
    interview: ContentAvailability;
    cases: ContentAvailability;
    problemMedia: 'none' | 'available' | 'media-missing';
    solutionMedia: 'none' | 'available' | 'media-missing';
  };
}

export interface StudyPlanSection {
  name: string;
  slug: string;
  problemIds: number[];
}

export interface StudyPlan {
  id: string;
  title: string;
  sections: StudyPlanSection[];
}

export interface ProblemContent extends ProblemSummary {
  problemMarkdown: string | null;
  hintsMarkdown: string | null;
  solutionMarkdown: string | null;
  interviewMarkdown: string | null;
  javaSource: string | null;
  casesYaml: string | null;
}
```

Required server-side API:

```ts
export function getTopInterview150(): StudyPlan;
export function getAllProblemSummaries(): ProblemSummary[];
export function getProblemSummary(id: number): ProblemSummary | null;
export function getProblemContent(id: number): ProblemContent | null;
export function getOrderedProblemIds(): number[];
export function getAdjacentProblemIds(id: number): { previous: number | null; next: number | null };
export function splitHints(markdown: string | null): string[];
```

### 4.2 Progress contract — owned by W5

```ts
export type LearningStatus = 'in-progress' | 'solved' | 'review';

export interface ProblemProgress {
  problemId: number;
  status: LearningStatus;
  bookmarked: boolean;
  confidence: 1 | 2 | 3 | 4 | 5 | null;
  revealedHints: number;
  solutionViewed: boolean;
  interviewViewed: boolean;
  notes: string;
  updatedAt: string;
}

export interface ProgressStateV1 {
  version: 1;
  problems: Record<string, ProblemProgress>;
}
```

Absence of a record means `not-started`; do not persist a redundant `not-started` record.

Storage key:

```text
leetcode-top150-progress:v1
```

Required client-side API:

```ts
export function readProgress(): ProgressStateV1;
export function writeProgress(state: ProgressStateV1): void;
export function getProblemProgress(state: ProgressStateV1, problemId: number): ProblemProgress | null;
export function upsertProblemProgress(state: ProgressStateV1, problemId: number, patch: Partial<Omit<ProblemProgress, 'problemId' | 'updatedAt'>>): ProgressStateV1;
export function removeProblemProgress(state: ProgressStateV1, problemId: number): ProgressStateV1;
```

React integration must expose:

```ts
useProgress()
```

with state plus mutation helpers. The provider must avoid server/client hydration mismatches.

---

## 5. Worker roster and account allocation

Suggested allocation for two ChatGPT Plus accounts:

| Worker | Role | Suggested account | Branch | Starts after |
|---|---|---|---|---|
| W0 | Coordinator / Integrator | Account A | no long-lived feature branch | immediately |
| W1 | Web Foundation & Design System | Account B | `agent/web-01-foundation` | immediately |
| W2 | Content Engine | Account A | `agent/web-02-content-engine` | W1 merged |
| W5 | Progress & Local Persistence | Account B | `agent/web-05-progress` | W1 merged |
| W3 | Dashboard & Problem Explorer | Account A | `agent/web-03-dashboard` | W2 + W5 merged |
| W4 | Problem Practice Experience | Account B | `agent/web-04-practice` | W2 + W5 merged |
| W6 | QA, Integration, CI & Release Readiness | either | `agent/web-06-qa-integration` | W3 + W4 merged |

The worker numbers intentionally reflect ownership rather than execution order.

---

## 6. Execution waves

```text
WAVE 0
W0 Coordinator begins tracking
W1 Foundation starts
        |
        v
WAVE 1 after W1 merge
W2 Content Engine  ||  W5 Progress System
        |                    |
        +---------+----------+
                  v
WAVE 2 after W2 + W5 merge
W3 Dashboard      ||  W4 Practice Page
        |                    |
        +---------+----------+
                  v
WAVE 3
W6 QA / Integration / CI
                  |
                  v
W0 final verification + merge + release handoff
```

Do not start W3 or W4 from an older base and attempt to "catch up" later. Waiting for the dependency merge is cheaper than resolving cross-worker interface drift.

---

# Worker Assignments

## W0 — Coordinator / Integrator

**Mission:** Keep `main` authoritative, dispatch waves, review worker handoffs, merge only compatible branches, and prevent scope overlap.

**Owned files:**

- This plan: `docs/superpowers/plans/2026-08-17-top-interview-150-web-multi-worker-plan.md` when status updates are needed.
- Optional coordination notes under `docs/web-workers/`.
- Integration-conflict edits only after confirming worker ownership.

**Must not:** Build a feature in parallel with the worker that owns it.

### W0 procedure

- [ ] Confirm current `main` contains the validated 150-problem migration before dispatching implementation.
- [ ] Dispatch W1 from latest `main`.
- [ ] Review W1 handoff and run W1 validation commands after merge.
- [ ] Dispatch W2 and W5 from the same post-W1 `main`.
- [ ] Review W2 and W5 independently; merge them one at a time and rerun `npm test`, `npm run lint`, and `npm run build` after both are present.
- [ ] Dispatch W3 and W4 from the same post-W2/W5 `main`.
- [ ] Review W3 and W4 independently; merge one at a time and rerun the complete web checks.
- [ ] Dispatch W6 only after W3 and W4 are merged.
- [ ] Review W6 CI/e2e changes, run final content validator plus web checks, then merge.
- [ ] Record final commit SHAs and unresolved future work.

**Merge gate for every worker:**

1. Handoff exists.
2. Worker branch contains only assigned scope or a documented approved exception.
3. Tests reported by worker are reproducible.
4. No canonical content under `problems/**` was changed unexpectedly.
5. No worker copied the 150 ID list into frontend source.
6. Branch is rebased/merged against the dependency-complete `main` before final integration if needed.

**Coordinator final validation:**

```bash
python tools/validate_content.py
cd web
npm ci
npm run lint
npm test
npm run build
npx playwright test
```

---

## W1 — Web Foundation & Design System

**Branch:** `agent/web-01-foundation`

**Mission:** Create the minimal, production-quality Next.js/TypeScript foundation that every later worker can extend without touching its bootstrap/configuration files.

**Owned files:**

```text
web/package.json
web/package-lock.json
web/next.config.ts
web/tsconfig.json
web/eslint.config.mjs
web/postcss.config.mjs
web/src/app/layout.tsx
web/src/app/globals.css
web/src/app/not-found.tsx
web/src/components/layout/**
web/src/components/ui/**
web/src/test/setup.ts
web/vitest.config.ts
```

**Do not create:** dashboard feature logic, content loaders, progress persistence, or problem-practice feature code.

### W1 deliverables

- [ ] Scaffold `web/` with Next.js App Router, TypeScript, Tailwind CSS, ESLint, npm lockfile, and `src/` layout.
- [ ] Add scripts: `dev`, `build`, `start`, `lint`, `test`, `test:watch`.
- [ ] Configure Vitest + Testing Library + jest-dom.
- [ ] Create a responsive application shell with header/navigation links for `Dashboard` and `Problems`.
- [ ] Create focused reusable primitives needed by later workers: `Button`, `Badge`, `Card`, `Tabs`, `ProgressBar`, `EmptyState`.
- [ ] Ensure primitives are accessible by keyboard and expose native semantics rather than clickable `div` elements.
- [ ] Add a lightweight shell test proving navigation labels render.
- [ ] Keep the root page intentionally minimal; W3 owns the final dashboard.
- [ ] Run all validation commands.
- [ ] Commit and push only W1-owned files plus `docs/web-workers/handoffs/W1.md`.

### W1 acceptance criteria

```bash
cd web
npm ci
npm run lint
npm test
npm run build
```

All commands pass. The app shell renders at `/`; `/problems` is allowed to be a temporary minimal route only if Next build requires it, and W3 will replace it.

**Recommended commit sequence:**

```text
chore(web): bootstrap Next.js app
feat(web): add shared application shell and UI primitives
test(web): add foundation smoke tests
docs(web): add W1 handoff
```

---

## W2 — Content Engine

**Branch:** `agent/web-02-content-engine`

**Starts after:** W1 merged into `main`.

**Mission:** Build a server-only typed content layer that turns the existing V2 repository into reliable data for the frontend without duplicating or mutating canonical content.

**Owned files:**

```text
web/src/lib/content/**
web/src/lib/content/__tests__/**
```

W2 may add dependencies to `web/package.json` and `web/package-lock.json` only for content parsing/testing; expected examples are `yaml`, `react-markdown`, `remark-gfm`, or `server-only` if required by the chosen implementation.

### W2 deliverables

- [ ] Implement the exact content TypeScript contracts from section 4.1.
- [ ] Resolve repository root robustly from the `web/` application without embedding a developer-specific absolute path.
- [ ] Parse `study-plans/top-interview-150/index.yaml` and preserve section/problem order exactly.
- [ ] Discover canonical problem folders by metadata instead of assuming the primary-section path can be reconstructed from study-plan section names.
- [ ] Parse V2 `meta.yaml` into `ProblemSummary` and validate required fields at load time with clear errors.
- [ ] Implement all required content API functions listed in section 4.1.
- [ ] Read optional Markdown/Java/YAML files only when they exist; return `null` rather than throwing for legitimately unavailable content.
- [ ] Throw a descriptive content error when metadata claims content is complete but its required file is absent.
- [ ] Implement `splitHints()` so `## Hint N` sections can be revealed progressively; preserve Markdown inside each hint.
- [ ] Ensure the content module is server-only and is not accidentally bundled into client components with filesystem access.
- [ ] Add tests against actual repository fixtures, especially problem 121.
- [ ] Add a test asserting the Top Interview 150 plan resolves to exactly 150 unique IDs.
- [ ] Add a test asserting every study-plan ID resolves to exactly one canonical problem summary.
- [ ] Add a test for adjacent navigation at the first, middle, and last positions.
- [ ] Run existing Python content validation as a regression check.
- [ ] Commit and push only W2-owned files/dependency changes plus `docs/web-workers/handoffs/W2.md`.

### W2 required test behaviors

At minimum the test suite must prove:

```text
getTopInterview150().sections preserves index.yaml order
getOrderedProblemIds() has length 150
new Set(getOrderedProblemIds()).size === 150
getProblemSummary(121) returns Best Time to Buy and Sell Stock
getProblemContent(121) exposes problem/hints/solution/interview/java when present
getProblemContent(nonexistentId) returns null
first problem.previous === null
last problem.next === null
splitHints(null) returns []
```

### W2 acceptance criteria

```bash
python tools/validate_content.py
cd web
npm run lint
npm test
npm run build
```

All commands pass without modifying `problems/**` or `study-plans/**`.

**Recommended commit sequence:**

```text
feat(web): add typed Top Interview 150 content loader
test(web): validate canonical content ingestion
docs(web): add W2 handoff
```

---

## W5 — Progress & Local Persistence

**Branch:** `agent/web-05-progress`

**Starts after:** W1 merged into `main`.

**Mission:** Implement learner-specific state as a clean client-side subsystem with no knowledge of Markdown parsing and no writes to canonical repository content.

**Owned files:**

```text
web/src/lib/progress/**
web/src/lib/progress/__tests__/**
web/src/components/layout/ProgressProviderBridge.tsx   # only if required to mount the provider cleanly
```

W5 may make the smallest necessary edit to `web/src/app/layout.tsx` to mount the progress provider, but must keep W1's shell intact.

### W5 deliverables

- [ ] Implement the exact progress contracts from section 4.2.
- [ ] Use storage key `leetcode-top150-progress:v1`.
- [ ] Treat missing progress as an empty version-1 state rather than an error.
- [ ] Validate/paranoid-parse stored JSON so corrupt browser data falls back safely to an empty state instead of crashing the app.
- [ ] Keep `updatedAt` in ISO-8601 UTC format.
- [ ] Ensure `revealedHints` never becomes negative.
- [ ] Ensure confidence is only `1..5` or `null`.
- [ ] Implement immutable updates so React subscribers receive new references.
- [ ] Implement a `ProgressProvider` and `useProgress()` hook.
- [ ] Avoid hydration mismatch by reading localStorage only in the client lifecycle.
- [ ] Listen for browser `storage` events so two tabs stay synchronized when practical.
- [ ] Add unit tests for empty state, round-trip serialization, corrupt JSON recovery, upsert, remove, hint count, confidence, status changes, and multi-update preservation.
- [ ] Do not build dashboard or practice-page UI beyond provider wiring.
- [ ] Commit and push only W5-owned files/minimal provider wiring plus `docs/web-workers/handoffs/W5.md`.

### W5 acceptance criteria

```bash
cd web
npm run lint
npm test
npm run build
```

All commands pass. Reloading the browser preserves progress. Server rendering does not access `window` or `localStorage`.

**Recommended commit sequence:**

```text
feat(web): add versioned learner progress storage
feat(web): expose progress provider and hooks
test(web): cover progress persistence behavior
docs(web): add W5 handoff
```

---

## W3 — Dashboard & Problem Explorer

**Branch:** `agent/web-03-dashboard`

**Starts after:** W2 and W5 are both merged into `main`.

**Mission:** Build the primary navigation and discovery experience for all 150 problems using canonical content plus learner progress.

**Owned files:**

```text
web/src/app/page.tsx
web/src/app/problems/page.tsx
web/src/features/dashboard/**
web/src/features/problem-list/**
```

### W3 deliverables

- [ ] Build dashboard summary cards for total 150, solved, in progress, review, and remaining.
- [ ] Calculate counts from `getOrderedProblemIds()` plus progress records; never hard-code 150 except in explanatory copy.
- [ ] Build per-section progress using the canonical study-plan sections.
- [ ] Build `/problems` explorer in canonical Top Interview 150 order.
- [ ] Add case-insensitive search by ID/title.
- [ ] Add filters for difficulty, study-plan section, topic, and learner status.
- [ ] Add a clear-all-filters action.
- [ ] Keep active filters visible on mobile.
- [ ] Problem rows/cards must show ID, title, difficulty, primary section, learner status, and content-availability indicators useful to the learner.
- [ ] Clicking a problem navigates to `/problems/<id>`.
- [ ] Add useful empty states for no matching filters and no recorded progress.
- [ ] Ensure controls are keyboard accessible and labels are associated with inputs.
- [ ] Add component tests for search/filter combinations, section progress math, and status counts.
- [ ] Commit and push only W3-owned files plus `docs/web-workers/handoffs/W3.md`.

### W3 acceptance criteria

```text
Dashboard derives all counts from canonical IDs + progress.
Problem explorer can locate problem 121 by both "121" and title text.
Difficulty and section filters compose correctly.
Status filter recognizes missing progress as "not started".
A zero-result filter state never crashes.
```

Validation:

```bash
cd web
npm run lint
npm test
npm run build
```

**Recommended commit sequence:**

```text
feat(web): add Top Interview 150 dashboard
feat(web): add searchable problem explorer
test(web): cover dashboard and explorer behavior
docs(web): add W3 handoff
```

---

## W4 — Problem Practice Experience

**Branch:** `agent/web-04-practice`

**Starts after:** W2 and W5 are both merged into `main`.

**Mission:** Build the core study page where the learner reads the bilingual problem, requests hints progressively, reveals the solution intentionally, studies interview material, records notes, and moves through the study plan.

**Owned files:**

```text
web/src/app/problems/[id]/page.tsx
web/src/app/problems/[id]/not-found.tsx
web/src/features/practice/**
```

### W4 deliverables

- [ ] Parse route `id` as a positive integer and return the problem not-found UI for unknown IDs.
- [ ] Render problem header with number, title, difficulty, section, topics, and canonical LeetCode outbound link.
- [ ] Render `problem.md` using Markdown + GFM without enabling arbitrary raw HTML.
- [ ] Preserve bilingual Markdown order exactly as authored.
- [ ] Build tabs/views named `Problem`, `Hints`, `Solution`, and `Interview`.
- [ ] Disable or explain unavailable tabs using `contentStatus` rather than assuming every file exists.
- [ ] Reveal hints one at a time using `splitHints()` and persist `revealedHints` through W5.
- [ ] Require an explicit learner action before rendering the solution content in the visible UI.
- [ ] Record `solutionViewed` and `interviewViewed` when those views are intentionally opened.
- [ ] Display `Solution.java` in a readable code block with a copy button when available.
- [ ] Provide status controls for `in-progress`, `solved`, and `review`.
- [ ] Provide bookmark toggle, confidence `1..5`, and personal notes editor backed by W5.
- [ ] Add Previous/Next links using W2 adjacency functions and canonical study-plan order.
- [ ] Preserve progress when navigating between problems.
- [ ] Render a clear source-missing/list-only state when canonical full problem text is unavailable.
- [ ] Add tests for problem 121, missing problem ID, progressive hints, solution reveal, unavailable content tab, status update, notes persistence interaction, and previous/next navigation.
- [ ] Commit and push only W4-owned files plus `docs/web-workers/handoffs/W4.md`.

### W4 spoiler-safety rule

On initial page load, the visible viewport must not display solution explanation, Java solution source, interview answers, or later hints. The learner must explicitly choose to reveal them.

### W4 acceptance criteria

```bash
cd web
npm run lint
npm test
npm run build
```

Manual smoke test with problem 121:

```text
/open /problems/121
Problem content visible
Hint 1 reveal works
additional hints remain hidden until requested
Solution requires explicit reveal
Interview can be opened intentionally
status/bookmark/confidence/notes survive reload
Previous/Next follows Top Interview 150 order
```

**Recommended commit sequence:**

```text
feat(web): add problem practice page
feat(web): add progressive hints and spoiler controls
feat(web): integrate learner progress controls
test(web): cover practice workflow
docs(web): add W4 handoff
```

---

## W6 — QA, Integration, CI & Release Readiness

**Branch:** `agent/web-06-qa-integration`

**Starts after:** W3 and W4 are both merged into `main`.

**Mission:** Treat the combined MVP as a product, find integration defects, add end-to-end coverage, improve accessibility/responsiveness where necessary, and establish repeatable CI/release checks.

**Primary owned files:**

```text
web/e2e/**
web/playwright.config.ts
.github/workflows/web-ci.yml
docs/web-workers/handoffs/W6.md
```

W6 may fix defects in other `web/**` files only when the failing behavior is demonstrated by a test or reproducible integration issue. Keep such fixes narrowly scoped and describe them individually in the handoff.

### W6 deliverables

- [ ] Add Playwright configuration and e2e smoke coverage.
- [ ] Test dashboard load, problem explorer search, opening problem 121, hint reveal, solution reveal, marking solved, reload persistence, and previous/next navigation.
- [ ] Add an e2e check for a problem whose optional content is unavailable if one exists in the canonical dataset; otherwise test the UI component with a controlled fixture.
- [ ] Verify mobile viewport behavior for dashboard, filters, tabs, notes, and code blocks.
- [ ] Verify keyboard navigation through global nav, filters, tabs, reveal controls, and progress controls.
- [ ] Fix critical accessible-name, focus, overflow, and hydration issues found during integration.
- [ ] Add GitHub Actions workflow that runs Python content validation and web install/lint/test/build; include Playwright when runner setup remains reliable.
- [ ] Ensure CI uses `npm ci`, not `npm install`.
- [ ] Verify no generated build/cache folders are committed.
- [ ] Verify no canonical problem content was accidentally rewritten by web work.
- [ ] Run the complete final validation suite.
- [ ] Document any intentionally deferred item under a `Post-MVP` section in the W6 handoff; do not leave hidden failures.

### W6 final acceptance criteria

```bash
python tools/validate_content.py
cd web
npm ci
npm run lint
npm test
npm run build
npx playwright test
```

All required commands pass on the final branch before handoff.

**Recommended commit sequence:**

```text
test(web): add Top Interview 150 end-to-end coverage
ci(web): validate content and web application
fix(web): resolve integration accessibility and responsive issues
docs(web): add W6 handoff
```

---

## 7. Handoff file contract

Every worker creates exactly one worker-specific handoff file and never edits another worker's handoff.

Example path:

```text
docs/web-workers/handoffs/W2.md
```

Required structure:

```markdown
# W2 Handoff

## Branch
`agent/web-02-content-engine`

## Completed scope
- concise bullets of delivered behavior

## Commits
- `<sha>` `<message>`

## Validation
- `command` -> PASS

## Files changed
- exact paths or focused directory groups

## Dependency notes
- concrete notes for downstream workers

## Known limitations
- only real limitations; write `None within assigned scope.` when none remain
```

Do not use the handoff as a second implementation plan.

---

## 8. Conflict-prevention rules

1. W1 owns bootstrap/config/shared UI; later workers request shared primitive changes through the Coordinator if more than a trivial addition is needed.
2. W2 alone owns filesystem/YAML/Markdown content loading.
3. W5 alone owns persistence schema/storage/provider.
4. W3 owns `/` and `/problems` discovery pages.
5. W4 owns `/problems/[id]` practice experience.
6. W6 may cross boundaries only for demonstrated integration defects after feature workers are merged.
7. No feature worker edits `problems/**`, `study-plans/**`, `raw/**`, `schemas/**`, or legacy topic `.txt` files.
8. Do not duplicate content into `web/public/` or JSON snapshots of all 150 problems.
9. Do not add a cloud backend to solve a local-state problem in the MVP.
10. Do not add a Java execution endpoint in this phase.

---

## 9. Coordinator merge order

Mandatory merge order:

```text
1. W1
2. W2 and W5, in either order, followed by full web validation
3. W3 and W4, in either order, followed by full web validation
4. W6
5. Final Coordinator verification
```

If W2 and W5 both touch `package.json`/lockfile, the Coordinator must preserve both dependency sets and regenerate a valid lockfile through npm rather than manually splicing JSON/lockfile sections.

If W3/W4 need a shared UI primitive that W1 did not provide, prefer one small Coordinator-approved addition in the first merged branch and rebase the second worker before its final merge.

---

## 10. Definition of Done for the MVP

The MVP is done only when all of the following are true:

- Python canonical-content validation passes.
- Web dependency install from lockfile passes.
- TypeScript/Next production build passes.
- Lint passes.
- Unit/component tests pass.
- Playwright smoke tests pass.
- Dashboard counts derive from canonical data and learner state.
- Exactly 150 unique Top Interview IDs are discoverable from the canonical study-plan index.
- Problem 121 is fully usable end to end.
- Missing/partial content degrades gracefully.
- Progress persists through reload without altering repository content.
- Initial problem view does not expose solution spoilers visibly.
- Mobile layout has no blocking horizontal overflow except intentional code-block scrolling.
- No worker branch has unreviewed canonical-content changes.
- `main` contains all worker handoffs and W6's final QA handoff.

---

## 11. Post-MVP roadmap — not assigned in the current worker wave

After the MVP is stable, create separate specs/plans before implementing these independently:

1. Cloud account + progress sync, likely with a hosted database/auth provider.
2. Secure Java code runner/judge using an isolated execution service.
3. Attempt/submission history and test-case result UI.
4. Review scheduling/spaced repetition.
5. AI-assisted explanation or mock interview mode.
6. Additional study plans sharing canonical problem content.

Do not let these future items expand current worker scope.
