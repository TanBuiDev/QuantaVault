# QuantaVault Interview Deduplication — Phase 1 Review

**Date:** 2026-11-12
**Baseline main SHA:** `2c56c4bf02015961f0e9bd7979c8f8e1cce34f68`
**Status:** Content staging and structural QA completed; phase 2 deployment **NOT authorized**.
**Branch:** `feat/interview-dedup-phase1-20261112`

## Scope

- 526 canonical questions at baseline; 526 remain in both canonical JSON files.
- 21 authored merged answers staged in `phase1-group-A.json` (11) and `phase1-group-B.json` (10).
- 43 source questions are represented by 21 kept IDs and 22 proposed retired IDs; target after a future migration is 504 visible questions.
- Staging preserves original source content in the unmodified canonical JSON files; no question objects, draft records, D1 rows, or localStorage values were removed.
- Titles, summaries and detailed Markdown were reviewed with specific Java Backend examples and edge cases; cross-category merged tags were added for the B groups.

## Candidate groups

| Group | Keep | Merge from | Phase 1 |
|---|---|---|---|
| A01 | `q-193` | `q-194` | Prepared |
| A02 | `q-089` | `q-090` | Prepared |
| A03 | `q-091` | `q-092` | Prepared |
| A04 | `q-099` | `q-100` | Prepared |
| A05 | `q-120` | `q-121` | Prepared |
| A06 | `q-139` | `q-140` | Prepared |
| A07 | `q-260` | `q-261` | Prepared |
| A08 | `q-396` | `q-397` | Prepared |
| A09 | `q-431` | `q-432` | Prepared |
| A10 | `q-356` | `q-357` | Prepared |
| A11 | `q-465` | `q-466` | Prepared |
| B01 | `q-044` | `q-043` | Prepared |
| B02 | `q-069` | `q-070` | Prepared |
| B03 | `q-097` | `q-098` | Prepared |
| B04 | `q-132` | `q-133` | Prepared |
| B05 | `q-211` | `q-212` | Prepared |
| B06 | `q-258` | `q-268` | Prepared |
| B07 | `q-007` | `q-189` | Prepared |
| B08 | `q-022` | `q-023`, `q-024` | Prepared |
| B09 | `q-487` | `q-488` | Prepared |
| B10 | `q-410` | `q-411` | Prepared |

## Structural review evidence

- PASS: 526 unique canonical IDs, 21 distinct kept IDs, 22 distinct retired IDs.
- PASS: both canonical JSON files have the same Git blob SHA at baseline.
- PASS: each staged answer has nonempty title/summary/Markdown, balanced fenced code blocks and at least 900 characters of detail.
- PASS: main-question category/difficulty and companies metadata preserved; existing additional metadata retained.
- PASS: no staged answer contains an inline code reference to one of the IDs retired by its own merge.
- PASS: worked examples corrected: Stream filter output in A06 and Repository method in A01.
- NOT RUN: JUnit compilation of all Java snippets, browser Mermaid rendering, Playwright, Next.js build, Cloudflare Pages build or D1 migration.
- A CI validator will check staged structure; repository-wide workflows on the draft PR can further test the current production code unchanged.

## High-risk ID migration issue — BLOCKER for phase 2

- Existing `web/src/lib/interview/legacyIdMap.json` has **381 historical keys that are also canonical question IDs but point to a different ID**.
- **14 of the 22 proposed retirement keys** are among those collisions. Example: existing `q-194 -> q-202`, proposed canonical merge `q-194 -> q-193`.
- `progress.ts` currently applies the historical mapping to unversioned progress keys. Because a key can denote a historical or canonical identity, neither the old nor the new destination can be assumed correct without additional provenance.
- Do **not** append phase-2 mappings to `legacyIdMap.json`, and do **not** run an automatic D1 rewrite or localStorage cleanup.
- Before phase 2: design a versioned canonical progress schema or a safe user-reviewed reconciliation for ambiguous IDs; preserve original progress snapshots; test cross-device sync and `revision`/HTTP 409 behavior; test rollback.
- Also protect `interview_drafts_v1` and `interview_published_cache_v1` for retired IDs; never clear them automatically just to hide conflicts.

## Required phase 2 checks before authorizing merge

1. Reconfirm GitHub HEAD and Cloudflare production deployment.
2. Approve each prepared answer after editorial review; fix any contested merge rather than forcing 504.
3. Implement an isolated, reversible progress-ID migration with explicit disambiguation for historical/canonical overlaps.
4. Add unit and end-to-end tests for learned/review/bookmarks, mixed old/new devices, revision conflicts, drafts, published cache, search and filters.
5. Update both canonical JSON files identically and keep backup snapshots. Repoint links and search alias routing.
6. Run all existing CI, JS tests, build, Playwright and Java isolation; only after explicit production approval merge to `main` and verify deployment.

**Production status:** Unchanged; no D1 writes or deployment from this work.
