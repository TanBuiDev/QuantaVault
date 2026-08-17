# Top Interview 150 — UI/UX Polish Design

Date: 2026-08-17
Status: Approved direction
Scope: UI/UX polish only; preserve existing canonical content and learning logic

## 1. Context

The existing web MVP is functionally complete: canonical Top Interview 150 content, dashboard, problem explorer, practice pages, local progress, responsive behavior, tests, build, and CI are already in place.

The next iteration is a visual and interaction polish pass. The current interface is clean but still feels like a developer-oriented MVP: mostly flat slate cards, limited hierarchy, no dark mode, no strong product identity, and a Practice page that stacks learning controls above content instead of behaving like a focused study workspace.

## 2. Chosen Direction

The user selected **Direction B: modern coding workspace**, and selected a **two-column Practice layout**.

Two alternatives considered but not selected:

- **A — LeetCode-like:** darker, highly coding-first, denser panels. Familiar but risks looking derivative and unnecessarily dense because this product does not run/submit code locally.
- **C — polished light minimal:** lowest implementation risk and closest to the current MVP, but does not solve the lack of product identity or improve long-session comfort as much.

Chosen direction B balances focus, modern product quality, long-session comfort, and a distinct identity without pretending to be a full online judge.

## 3. Product Principle

The site is a **study companion for LeetCode**, not a LeetCode replacement.

The product should make it easier to:

1. choose what to study next,
2. read the canonical study material,
3. reveal hints progressively,
4. deliberately reveal solutions,
5. record progress, confidence, bookmarks, and notes,
6. open the matching LeetCode problem to write and submit Java code.

No in-browser Java editor, runner, remote execution, or submission system is added in this polish pass.

## 4. Visual Language

### 4.1 Theme

Support both light and dark modes with a manual theme control and system-aware default.

- Light: soft neutral background, elevated white surfaces, strong dark text.
- Dark: deep charcoal/navy surfaces rather than pure black, restrained borders, readable code/content contrast.
- Primary accent: indigo/blue family for navigation, focus, active states, and primary actions.
- Status colors remain semantic:
  - solved: emerald/green,
  - review: amber,
  - in progress: blue,
  - difficult/hard: red only where useful and accessible.

The design must not depend on color alone to communicate status.

### 4.2 Typography

Keep a highly readable sans-serif UI font stack. Increase hierarchy between page titles, section headings, metadata, and body copy. Markdown content should prioritize reading comfort with a controlled line length, generous leading, and clearer code/table styling.

### 4.3 Shape and depth

Use restrained radius and elevation. Avoid turning every region into a floating card. Major surfaces should be grouped by layout, border, and spacing first; cards are reserved for meaningful modules.

## 5. Global App Shell

### Desktop

Introduce a compact left navigation rail/sidebar for primary destinations:

- Dashboard
- Problems

The product identity sits at the top. Theme control sits in a predictable global location. The main area uses a wider workspace than the current max-width layout where Practice needs it.

### Mobile

Do not preserve a permanent sidebar. Use a compact top navigation/header and keep touch targets at least 44px where practical.

The shell must preserve the existing skip-to-content accessibility behavior.

## 6. Dashboard

Goal: answer “How am I doing, and what should I study next?” within a few seconds.

### Layout

1. Compact page intro / study-plan identity.
2. Primary progress block with total solved percentage and counts.
3. Small metric cards for solved, in progress, review, and remaining.
4. Section progress presented as clear scan-friendly rows/cards with visual progress bars.
5. Primary CTA to continue/browse problems.

The dashboard should feel richer than the MVP without becoming an analytics dashboard. No unnecessary charting library is required.

## 7. Problems Explorer

Goal: scan and choose among 150 problems quickly.

Replace the visually repetitive card-per-problem treatment with a denser, clearer study list/table on desktop while retaining a mobile-friendly stacked representation.

### Desktop row content

- problem ID and title,
- section/topic context,
- difficulty,
- learning status,
- availability/content indicators,
- optional bookmark indicator.

### Filters

Keep all current filters and behavior:

- search,
- difficulty,
- section,
- topic,
- learning status,
- clear filters.

Use a compact filter toolbar. On desktop it may remain visible/sticky while scanning. On mobile it should wrap or collapse without horizontal overflow.

## 8. Practice Workspace — Primary Screen

This is the most important screen in the redesign.

### 8.1 Desktop layout

Use a responsive two-column workspace, approximately **70/30**:

#### Left — study content

- problem title and metadata,
- tabs: Problem / Hints / Solution / Interview,
- canonical markdown content,
- progressive hint reveal,
- spoiler-protected solution,
- Java reference solution after explicit reveal,
- interview notes.

#### Right — personal study panel

Sticky within the viewport when space allows:

- status: In progress / Solved / Review,
- bookmark,
- confidence,
- personal notes,
- compact study metadata,
- Previous / Next navigation.

The right panel must not compete visually with the problem statement. It is secondary and quieter.

### 8.2 LeetCode handoff

“Open on LeetCode” remains a prominent, explicit action near the problem header. Its purpose should be visually clear: LeetCode is where the learner writes and submits code.

No embedded LeetCode iframe or pseudo-submit interaction is introduced.

### 8.3 Tabs and spoilers

Preserve existing behavior exactly:

- hints reveal one by one,
- solution content is not rendered until the user explicitly reveals it,
- interview-view tracking remains,
- existing content-status rules remain authoritative.

### 8.4 Mobile

Collapse the two-column layout to one column.

Order:

1. problem header and Open on LeetCode action,
2. compact quick-progress controls,
3. content tabs and content,
4. notes/confidence/bookmark module,
5. previous/next navigation.

No horizontal scrolling of the page. Code blocks may scroll internally.

## 9. Components and Boundaries

Prefer focused reusable components instead of making existing feature files larger.

Likely UI units:

- AppSidebar / MobileHeader
- ThemeToggle / ThemeProvider
- PageHeader
- MetricCard / ProgressSummary
- SectionProgressItem
- ProblemFilterBar
- ProblemList / ProblemRow
- PracticeHeader
- PracticeContentPanel
- StudyProgressPanel
- ProblemNavigator
- MarkdownContent refinements

Existing content and progress libraries remain separate from presentation code.

## 10. State and Data Flow

No canonical data model changes are required.

- canonical problem/study-plan data continues through `web/src/lib/content`;
- learner progress continues through the existing local progress provider;
- theme preference is presentation-only local state and must not be written to canonical files;
- no authentication or cloud sync is introduced.

## 11. Accessibility

Maintain or improve current accessibility:

- keyboard-operable tabs and controls,
- visible focus indicators in both themes,
- semantic headings,
- accessible labels for filters/status controls,
- sufficient contrast,
- no status communicated by color alone,
- skip-to-content retained,
- reduced-motion friendly transitions.

## 12. Motion

Use restrained micro-interactions only:

- hover/focus transitions,
- theme transition without distracting full-page animation,
- small state feedback for progress/bookmark/copy actions.

No decorative motion that slows study flow.

## 13. Responsive Targets

- Mobile: 320px and above, single-column study flow.
- Tablet: flexible one/two-column transition where space supports it.
- Desktop: full sidebar + 70/30 Practice workspace.
- Wide desktop: prevent reading column from becoming excessively wide even if the overall workspace expands.

## 14. Testing and Regression Rules

Preserve functional tests and add/update tests around presentation state where behavior changes.

Required release checks remain:

```text
python tools/validate_content.py
cd web
npm ci
npm run lint
npm test
npm run build
npx playwright test
```

E2E must continue to prove:

- progress persistence,
- filters/search,
- hints progressive reveal,
- solution spoiler protection,
- previous/next canonical navigation,
- mobile no-horizontal-overflow.

Add coverage for theme switching/persistence and the redesigned Practice responsive flow where practical.

## 15. Non-Goals

This polish pass does not add:

- Java editor or code execution,
- LeetCode submission integration,
- authentication,
- cloud database/sync,
- AI tutor,
- scraping,
- changes to canonical `problems/**` content,
- changes to the Top Interview 150 canonical ordering.

## 16. Success Criteria

The redesign is successful when:

1. the product no longer feels like a generic slate-card MVP,
2. Practice clearly feels like the primary study workspace,
3. users can read/problem-solve for long sessions comfortably in light or dark mode,
4. 150 problems remain fast to scan/filter,
5. progress controls are accessible without dominating study content,
6. the LeetCode handoff is obvious,
7. existing learning behavior and canonical data integrity remain unchanged,
8. CI and E2E remain green.
