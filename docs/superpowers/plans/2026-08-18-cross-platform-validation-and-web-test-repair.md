# Cross-platform Validation and Web Test Repair Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make repository validation deterministic on Windows and Linux, restore the web test suite, and prevent generated development artifacts from appearing as untracked files.

**Architecture:** Preserve the existing provenance contract: `raw_blob_sha` denotes the Git blob for each immutable source file. Make the validator derive that canonical byte representation independently of a developer's checkout line endings. Harden the sidebar against the nullable pathname permitted by Next navigation, and make explorer tests target the intended link by its accessible name.

**Tech Stack:** Python 3 standard library, Git attributes/configuration, Next.js 16, React 19, TypeScript, Vitest, Testing Library.

---

## Chunk 1: Cross-platform content provenance validation

### Task 1: Reproduce and lock the Windows line-ending regression

**Files:**
- Modify: `tests/test_validate_content.py`
- Modify: `tools/validate_content.py`

- [ ] **Step 1: Write a failing unit test for CRLF raw source input**

Create a temporary `raw/top-interview-150/source.txt` with CRLF line endings; calculate the expected hash from the LF Git-blob representation; build minimal valid `meta.yaml`; assert that provenance validation succeeds.

- [ ] **Step 2: Run the focused regression test**

Run: `python -m unittest tests.test_validate_content.ValidateContentV2Tests.test_full_source_provenance_accepts_crlf_checkout -v`

Expected: FAIL because `_git_blob_sha()` hashes CRLF worktree bytes directly.

- [ ] **Step 3: Make `_git_blob_sha()` calculate the canonical Git blob**

In `tools/validate_content.py`, normalize only text-source line endings (`\r\n` and lone `\r` to `\n`) before applying the existing `blob <length>\0` SHA-1 framing. Keep binary handling explicit and do not alter the stored source files or metadata hashes.

- [ ] **Step 4: Run provenance and repository validation**

Run: `python -m unittest tests.test_inventory tests.test_validate_content -v; python tools/inventory.py --self-test; python tools/validate_content.py --root .`

Expected: all unit tests pass and validation reports `PASS` for the 150 canonical packages on both CRLF and LF worktrees.

- [ ] **Step 5: Commit the validator repair**

```bash
git add tools/validate_content.py tests/test_validate_content.py
git commit -m "fix(validation): normalize raw source line endings for provenance"
```

## Chunk 2: Web test and runtime robustness

### Task 2: Handle nullable route state in the application sidebar

**Files:**
- Modify: `web/src/components/layout/AppSidebar.tsx:15-38`
- Modify: `web/src/components/layout/__tests__/AppShell.test.tsx`

- [ ] **Step 1: Add a regression test with `usePathname()` returning `null`**

Mock the navigation hook as `null`, render `AppShell`, and assert that Dashboard, Problems, and child content still render without an active route exception.

- [ ] **Step 2: Run the focused test**

Run: `npm test -- src/components/layout/__tests__/AppShell.test.tsx`

Expected: FAIL with `Cannot read properties of null (reading 'startsWith')`.

- [ ] **Step 3: Safely derive the active sidebar link**

In `AppSidebar.tsx`, make the non-root route comparison conditional on a non-null pathname. A missing pathname must render navigation with no active item, rather than throwing.

- [ ] **Step 4: Verify the sidebar test**

Run: `npm test -- src/components/layout/__tests__/AppShell.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit the sidebar repair**

```bash
git add web/src/components/layout/AppSidebar.tsx web/src/components/layout/__tests__/AppShell.test.tsx
git commit -m "fix(web): tolerate unavailable navigation pathname"
```

### Task 3: Repair explorer link assertions without weakening UI accessibility

**Files:**
- Modify: `web/src/features/problem-list/__tests__/ProblemExplorer.test.tsx:69-129`

- [ ] **Step 1: Specify the title link unambiguously in each failing assertion**

Query the visible title link by its exact accessible name, or use `getAllByRole` and select the link whose text equals the title. Retain the arrow control's `aria-label="Study <title>"` because it is necessary for accessible navigation.

- [ ] **Step 2: Run the focused explorer tests**

Run: `npm test -- src/features/problem-list/__tests__/ProblemExplorer.test.tsx`

Expected: PASS; search, filters, empty state, and both links remain covered.

- [ ] **Step 3: Run the complete web quality gate**

Run: `npm audit --omit=dev --audit-level=high; npm run lint; npm test; npm run build`

Expected: audit has no high vulnerabilities; lint, 41 tests, and production build pass.

- [ ] **Step 4: Commit the test repair**

```bash
git add web/src/features/problem-list/__tests__/ProblemExplorer.test.tsx
git commit -m "test(web): disambiguate problem explorer links"
```

## Chunk 3: Deployment scope and workspace hygiene

### Task 4: Eliminate the dynamic repository-tracing warning

**Files:**
- Modify: `web/src/lib/content/index.ts:112-135`
- Modify: `web/src/lib/content/__tests__/content.test.ts`

- [ ] **Step 1: Add a test for repository-root resolution from the web directory**

Keep the current behavior—content loading must resolve the parent repository when Next runs from `web/`—while asserting that the resolution uses a fixed, known path.

- [ ] **Step 2: Replace parent-directory scanning with a statically scoped root**

Use the module location or a fixed `web/..` relationship rather than walking from `process.cwd()` and probing arbitrary ancestors. Preserve server-only file access and the existing public APIs.

- [ ] **Step 3: Verify no trace warning remains**

Run: `npm run build`

Expected: build passes without the `Dynamic filesystem access causes tracing of the whole project` warning.

- [ ] **Step 4: Add targeted ignore rules for generated artifacts**

Create `.gitignore` entries for Python `__pycache__/`, Next `.next/`, generated `web/next-env.d.ts`, and `web/node_modules/`. Do not ignore source, test, lockfile, or canonical content paths.

- [ ] **Step 5: Confirm a clean working tree after verification**

Run: `git status --short; git check-ignore -v tests/__pycache__/ web/.next/ web/next-env.d.ts web/node_modules/`

Expected: generated artifacts are ignored and no unintended changes are listed.

- [ ] **Step 6: Commit scope and hygiene changes**

```bash
git add .gitignore web/src/lib/content/index.ts web/src/lib/content/__tests__/content.test.ts
git commit -m "fix(web): scope content loading and ignore generated artifacts"
```

## Chunk 4: Full acceptance and CI alignment

### Task 5: Prove the repository is releasable on both supported environments

**Files:**
- Verify: `.github/workflows/web-ci.yml`
- Verify: `tools/validate_content.py`
- Verify: `web/e2e/top150.spec.ts`

- [ ] **Step 1: Run all repository checks locally**

Run: `python -m unittest tests.test_inventory tests.test_validate_content -v; python tools/inventory.py --self-test; python tools/validate_content.py --root .; git diff --check`

Expected: all pass with a Windows CRLF checkout.

- [ ] **Step 2: Run Java reference regressions in a disposable build directory**

Use the 150-case loop already defined in `.github/workflows/final-migration-validation.yml`, without compiling `.class` files into tracked directories.

Expected: `PASS: 150/150 Java regression tests`.

- [ ] **Step 3: Run browser acceptance tests**

Run: `npx playwright install chromium; npx playwright test`

Expected: dashboard, filtering, practice navigation, theme, and progress behavior pass.

- [ ] **Step 4: Verify the exact CI sequence**

Run: `python tools/validate_content.py; npm ci; npm audit --omit=dev --audit-level=high; npm run lint; npm test; npm run build; npx playwright test`

Expected: every command used by `web-ci.yml` passes on a clean checkout.

- [ ] **Step 5: Review final diff and commit only intentional changes**

Run: `git diff --check; git status --short`

Expected: only the validator, tests, static root resolution, and `.gitignore` changes are staged.
