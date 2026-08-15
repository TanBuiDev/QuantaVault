# LeetCode Source Content Policy Addendum

Date: 2026-08-15
Status: Approved requirement
Applies to: `docs/superpowers/specs/2026-08-15-leetcode-repository-content-architecture-design.md`

## Decision

For the current private study repository, problem statements that the user has already supplied in the repository, files, or prior chat content are treated as the canonical source text and may be preserved verbatim during migration.

The implementation must not replace available user-supplied LeetCode wording with a paraphrase.

## Missing source text

If a Top Interview 150 problem does not yet have user-supplied source text available to the migration process:

- Do not fabricate or paraphrase a replacement `problem.md` solely to make migration appear complete.
- Do not mark the problem as fully migrated.
- Keep the problem recorded in migration coverage as `source-missing` when its identity is known.
- Wait for the user to provide the missing source text later.
- Metadata and solution work may be prepared separately only when doing so does not imply that the verbatim problem source has been captured.

## Existing raw files

Current topic-level `.txt` files are first-class source artifacts. During migration they must be copied or moved into `raw/top-interview-150/` without changing their text content.

No raw source file may be deleted from repository history or discarded as part of restructuring.

## Previously supplied chat content

Problem statements and study material that the user supplied in prior saved ChatGPT conversations may be used as migration input when retrievable. The migration should prefer preserving existing completed work over regenerating it unnecessarily.

The previously completed Array/String set currently known from the saved study conversation includes these problem IDs as migration candidates that must be verified before being marked solved:

- 88 — Merge Sorted Array
- 27 — Remove Element
- 26 — Remove Duplicates from Sorted Array
- 80 — Remove Duplicates from Sorted Array II
- 169 — Majority Element
- 189 — Rotate Array
- 121 — Best Time to Buy and Sell Stock

## Source-of-truth separation

For every migrated problem:

- `raw/` preserves the supplied source material.
- `problem.md` presents the canonical problem statement from supplied source text.
- `solution.md` contains the teaching-oriented explanation.
- `Solution.java` contains the canonical Java implementation.
- `meta.yaml` contains structured metadata.

## Migration scope for the next implementation pass

The next implementation pass must process only content that is already available from the repository or retrievable prior user-supplied chat material.

Problems whose original source text is still missing are explicitly deferred until the user supplies that content. This is expected partial coverage, not an implementation failure.
