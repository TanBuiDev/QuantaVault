# Top Interview 150 UI Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the existing functional Top Interview 150 MVP into a modern light/dark coding-study workspace while preserving canonical content, learner progress behavior, and LeetCode handoff.

**Architecture:** Keep `web/src/lib/content` and `web/src/lib/progress` unchanged as the data/state boundary. Add presentation-only theme state and refactor the shell plus feature views into focused reusable UI components. Practice becomes a responsive 70/30 two-column workspace on desktop and a single-column study flow on mobile.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest + Testing Library, Playwright.

## Global Constraints

- Preserve canonical `problems/**` and `study-plans/top-interview-150/index.yaml` unchanged.
- No Java editor, runner, remote execution, or submission integration in this pass.
- No authentication, cloud sync, scraping, or AI tutor.
- Theme preference is presentation-only browser state.
- Existing progressive hints, explicit solution reveal, interview tracking, local progress, and previous/next canonical navigation must remain behaviorally identical.
- Mobile must remain usable from 320px with no page-level horizontal overflow.
- Release gate remains: `python tools/validate_content.py`, `npm ci`, `npm run lint`, `npm test`, `npm run build`, `npx playwright test`.

---

## File Structure

Create or refine these focused presentation units:

- `web/src/components/theme/ThemeProvider.tsx` — system-aware theme state + local persistence.
- `web/src/components/theme/ThemeToggle.tsx` — accessible light/dark toggle.
- `web/src/components/layout/AppSidebar.tsx` — desktop primary navigation and identity.
- `web/src/components/layout/MobileHeader.tsx` — mobile navigation and theme action.
- `web/src/components/layout/AppShell.tsx` — responsive shell composition.
- `web/src/features/dashboard/DashboardView.tsx` — richer progress hierarchy.
- `web/src/features/problem-list/ProblemExplorer.tsx` — denser desktop study list and compact filters.
- `web/src/features/practice/PracticeView.tsx` — 70/30 workspace shell with preserved behaviors.
- `web/src/app/globals.css` — semantic light/dark tokens and global reading surfaces.
- Existing tests under each feature plus `web/e2e/top150.spec.ts` — behavior/regression coverage.

---

### Task 1: Theme state and responsive app shell

**Files:**
- Create: `web/src/components/theme/ThemeProvider.tsx`
- Create: `web/src/components/theme/ThemeToggle.tsx`
- Create: `web/src/components/layout/AppSidebar.tsx`
- Create: `web/src/components/layout/MobileHeader.tsx`
- Modify: `web/src/components/layout/AppShell.tsx`
- Modify: `web/src/app/layout.tsx`
- Modify: `web/src/app/globals.css`
- Test: `web/src/components/theme/__tests__/ThemeProvider.test.tsx`

**Interfaces:**
- Produces `ThemeProvider`, `useTheme()`, and `ThemeToggle`.
- `useTheme()` returns `{ theme: "light" | "dark", setTheme(theme), toggleTheme() }`.
- App shell consumes `ThemeToggle` but no canonical/progress data.

- [ ] **Step 1: Write failing theme tests**

```tsx
render(<ThemeProvider><ThemeProbe /></ThemeProvider>);
expect(screen.getByTestId("theme")).toHaveTextContent("light");
await user.click(screen.getByRole("button", { name: /switch to dark mode/i }));
expect(document.documentElement).toHaveClass("dark");
expect(localStorage.getItem("top150-theme")).toBe("dark");
```

Add a second test that seeds `localStorage` with `dark` and verifies the provider restores it.

- [ ] **Step 2: Run targeted test and confirm RED**

Run: `cd web && npm test -- ThemeProvider.test.tsx`

Expected: fail because provider/toggle do not exist.

- [ ] **Step 3: Implement minimal theme provider**

Use browser storage key `top150-theme`, apply/remove the `dark` class on `<html>`, prefer a stored value, otherwise initialize from `matchMedia('(prefers-color-scheme: dark)')`, and expose an accessible toggle.

- [ ] **Step 4: Refactor shell**

Desktop (`lg+`): fixed/contained left sidebar with Dashboard and Problems; main content fills remaining width. Mobile: top header only. Retain skip-to-content. Do not alter route structure.

- [ ] **Step 5: Add semantic theme tokens**

Define CSS variables for page, surface, elevated surface, border, foreground, muted, primary, code surface, and focus ring in `:root` and `.dark`. Existing feature classes may continue temporarily; later tasks migrate key surfaces.

- [ ] **Step 6: Run tests/lint**

Run: `cd web && npm test -- ThemeProvider.test.tsx && npm run lint`

Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add web/src/components/theme web/src/components/layout web/src/app/layout.tsx web/src/app/globals.css
git commit -m "feat(web): add themed responsive app shell"
```

---

### Task 2: Dashboard visual hierarchy

**Files:**
- Modify: `web/src/features/dashboard/DashboardView.tsx`
- Optionally create: `web/src/features/dashboard/ProgressSummary.tsx`
- Test: existing dashboard tests under `web/src/features/dashboard/__tests__/`

**Interfaces:**
- Consumes existing `StudyPlan`, `orderedProblemIds`, `useProgress`, `calculateDashboardMetrics`, and `calculateSectionProgress` unchanged.
- Produces no new data API.

- [ ] **Step 1: Add failing assertions for redesigned semantics**

Assert the dashboard exposes a primary overall progress region, a `Continue studying`/`Browse problems` CTA, and section progress labels without changing metric values.

- [ ] **Step 2: Run targeted dashboard tests and confirm RED**

Run: `cd web && npm test -- dashboard`

- [ ] **Step 3: Implement richer dashboard**

Use one dominant progress summary, smaller metric tiles, then section rows/cards with stronger solved/total hierarchy and quieter secondary statuses. Keep content derived entirely from existing metrics.

- [ ] **Step 4: Verify responsive layout**

Ensure 320px renders one/two-column metric flow without clipped text; desktop may use 4-card metrics and 2/3-column section grid.

- [ ] **Step 5: Run targeted tests/lint**

Run: `cd web && npm test -- dashboard && npm run lint`

- [ ] **Step 6: Commit**

```bash
git add web/src/features/dashboard
git commit -m "feat(web): polish study dashboard"
```

---

### Task 3: Problems explorer scanability

**Files:**
- Modify: `web/src/features/problem-list/ProblemExplorer.tsx`
- Optionally create: `web/src/features/problem-list/ProblemFilterBar.tsx`
- Optionally create: `web/src/features/problem-list/ProblemRow.tsx`
- Test: existing problem-list tests.

**Interfaces:**
- Preserve `ProblemExplorerProps`, `ProblemFilters`, `filterProblems`, and all filter semantics.
- No changes to canonical ordering.

- [ ] **Step 1: Add failing tests for retained filter behavior and new list semantics**

Keep assertions for query/difficulty/section/topic/status filters and add role-based assertions for the study list/table rows and bookmark/status labels.

- [ ] **Step 2: Run targeted tests and confirm RED where new semantics are absent**

Run: `cd web && npm test -- problem-list`

- [ ] **Step 3: Build compact filter toolbar**

Keep all five controls and clear action. Use a compact responsive grid/flex toolbar; desktop may use sticky positioning inside the content column.

- [ ] **Step 4: Replace repetitive cards with scan-friendly rows**

Desktop rows show ID/title, section/topic context, difficulty, learner status, content readiness, solution availability, and bookmark indicator if present. Mobile rows stack the same information without horizontal page scrolling.

- [ ] **Step 5: Run targeted tests/lint**

Run: `cd web && npm test -- problem-list && npm run lint`

- [ ] **Step 6: Commit**

```bash
git add web/src/features/problem-list
git commit -m "feat(web): redesign problem explorer"
```

---

### Task 4: Practice 70/30 study workspace

**Files:**
- Modify: `web/src/features/practice/PracticeView.tsx`
- Optionally create: `web/src/features/practice/PracticeHeader.tsx`
- Optionally create: `web/src/features/practice/StudyProgressPanel.tsx`
- Optionally create: `web/src/features/practice/PracticeContentPanel.tsx`
- Test: `web/src/features/practice/__tests__/PracticeView.test.tsx`

**Interfaces:**
- Preserve `PracticeViewProps` exactly.
- Preserve active tabs: `problem | hints | solution | interview`.
- Preserve `updateProblem` payloads and all spoiler behavior.

- [ ] **Step 1: Extend tests around invariants before layout changes**

Tests must prove:

```text
Problem content visible initially
Hints hidden until reveal
Only one additional hint reveals per click
Solution content/Java absent before explicit reveal
Solution content/Java visible after reveal
Solved/Review/In progress update existing progress state
Notes and confidence update progress
Previous/Next point to canonical neighbors
Open on LeetCode has target=_blank and rel=noreferrer
```

- [ ] **Step 2: Run targeted practice tests and confirm baseline**

Run: `cd web && npm test -- PracticeView.test.tsx`

Expected: existing behaviors PASS before refactor; any new structural assertion should initially fail.

- [ ] **Step 3: Split oversized presentation responsibilities where useful**

Extract the right study panel and header if it reduces `PracticeView.tsx` complexity. Do not move content/progress business logic into presentation helpers.

- [ ] **Step 4: Implement desktop 70/30 grid**

At `xl`/appropriate desktop breakpoint, render content column about `minmax(0, 7fr)` and study panel about `minmax(18rem, 3fr)`. Right panel uses sticky positioning with viewport-aware top offset. The left reading column constrains prose width internally even when the workspace is wide.

- [ ] **Step 5: Keep LeetCode handoff prominent**

Place `Open on LeetCode` near the title, visually distinct as the action for coding/submission, without implying local execution.

- [ ] **Step 6: Implement mobile order**

Problem header → quick progress controls → tabs/content → notes/confidence/bookmark → previous/next. Code blocks scroll internally only.

- [ ] **Step 7: Refine markdown/code surfaces for both themes**

Use semantic theme-aware classes/variables for body text, headings, inline code, block code, tables, and blockquotes.

- [ ] **Step 8: Run targeted tests/lint**

Run: `cd web && npm test -- PracticeView.test.tsx && npm run lint`

- [ ] **Step 9: Commit**

```bash
git add web/src/features/practice
git commit -m "feat(web): build two-column practice workspace"
```

---

### Task 5: E2E theme and responsive regression coverage

**Files:**
- Modify: `web/e2e/top150.spec.ts`
- Modify only if necessary: `web/playwright.config.ts`

**Interfaces:**
- Existing user journey stays intact.
- Add presentation assertions without coupling tests to brittle pixel values.

- [ ] **Step 1: Add theme persistence E2E**

Flow:

```text
open dashboard
switch to dark mode
assert html has dark class
reload
assert dark class persists
switch back to light
```

- [ ] **Step 2: Extend Practice responsive journey**

Desktop: assert content and study-progress regions are both visible. Mobile 390×844: assert no horizontal overflow and Open on LeetCode, tabs, progress, notes, and navigation remain reachable.

- [ ] **Step 3: Run Playwright**

Run: `cd web && npx playwright test`

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add web/e2e web/playwright.config.ts
git commit -m "test(web): cover polished theme and practice layout"
```

---

### Task 6: Full release gate and canonical protection

**Files:**
- No intended source changes unless verification reveals a regression.

**Interfaces:**
- Final output must be compatible with permanent `Web CI`.

- [ ] **Step 1: Validate canonical source**

Run: `python tools/validate_content.py`

Expected: PASS.

- [ ] **Step 2: Clean dependency install**

Run: `cd web && npm ci`

Expected: PASS without lockfile mutation.

- [ ] **Step 3: Run lint/unit/build**

Run:

```bash
npm run lint
npm test
npm run build
```

Expected: all PASS.

- [ ] **Step 4: Run Playwright**

Run: `npx playwright test`

Expected: PASS.

- [ ] **Step 5: Compare implementation scope**

Confirm no changes under `problems/**`, `study-plans/**`, `raw/**`, or `schemas/**`.

- [ ] **Step 6: Verify GitHub Web CI on final commit**

Use the permanent `Web CI` workflow status as the authoritative network-enabled release result.

- [ ] **Step 7: Finalize**

Report final commit SHA, UI changes, exact test status, any limitations, and whether Figma was needed. Do not claim completion until the final CI is green.
