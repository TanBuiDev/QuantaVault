# LeetCode Repository Content Architecture Design

Date: 2026-08-15
Status: Approved design, implementation not started
Repository: `TanBuiDev/leetcode`

## 1. Purpose

Refactor the current LeetCode study repository into a structure that serves two goals at the same time:

1. Be convenient to study directly on GitHub: open a problem, attempt it, then inspect a detailed explanation and Java solution.
2. Become a clean content source for a future coding-practice website without having to redesign or re-enter all 150 problems later.

The current repository stores multiple raw LeetCode problems inside large topic-level `.txt` files. Those files remain valuable as source material but should not remain the canonical long-term format.

## 2. Design principles

- One canonical problem record per LeetCode problem.
- Separate problem statements from solutions so a learner can avoid spoilers.
- Keep human-readable Markdown and machine-readable metadata side by side.
- Keep executable/reference Java code in its own file.
- Do not duplicate a problem when it belongs to multiple study plans.
- Preserve the current raw `.txt` files during migration.
- Design for simple future website ingestion without prematurely building a database or web application.
- Keep learner-specific data such as attempts, streaks, confidence, and review history out of this content repository.

## 3. Recommended repository structure

```text
leetcode/
├── README.md
├── CONTRIBUTING.md
│
├── problems/
│   ├── array-string/
│   │   ├── 0088-merge-sorted-array/
│   │   │   ├── meta.yaml
│   │   │   ├── problem.md
│   │   │   ├── solution.md
│   │   │   └── Solution.java
│   │   ├── 0121-best-time-to-buy-and-sell-stock/
│   │   └── ...
│   ├── two-pointers/
│   ├── sliding-window/
│   ├── matrix/
│   ├── hashmap/
│   ├── intervals/
│   ├── stack/
│   ├── linked-list/
│   ├── binary-tree/
│   ├── graph/
│   ├── trie/
│   ├── backtracking/
│   └── dynamic-programming/
│
├── study-plans/
│   └── top-interview-150/
│       ├── README.md
│       └── index.yaml
│
├── raw/
│   └── top-interview-150/
│       └── <existing topic .txt files>
│
├── schemas/
│   └── problem.schema.json
│
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-08-15-leetcode-repository-content-architecture-design.md
```

## 4. Canonical problem folder

Every LeetCode problem gets exactly one folder.

Folder naming format:

```text
<zero-padded-id>-<leetcode-slug>
```

Examples:

```text
0088-merge-sorted-array
0121-best-time-to-buy-and-sell-stock
0383-ransom-note
```

The zero-padded numeric prefix keeps the repository easy to scan and sort while the slug remains human-readable.

A problem belongs physically to one primary topic directory. Cross-topic relationships belong in metadata rather than duplicated folders.

## 5. `meta.yaml`

`meta.yaml` is the machine-readable index for the problem. It should contain stable facts and learning taxonomy, not user progress.

Initial schema:

```yaml
id: 88
slug: merge-sorted-array
title: Merge Sorted Array
difficulty: Easy
primary_section: array-string

topics:
  - Array
  - Two Pointers
  - Sorting

patterns:
  - Three Pointers
  - In-place Array

study_plans:
  - top-interview-150

status: solved
solution_languages:
  - java

time_complexity: O(m+n)
space_complexity: O(1)

leetcode_url: https://leetcode.com/problems/merge-sorted-array/
```

### Required fields for the first version

- `id`
- `slug`
- `title`
- `difficulty`
- `primary_section`
- `topics`
- `patterns`
- `study_plans`
- `status`
- `solution_languages`
- `leetcode_url`

`time_complexity` and `space_complexity` are required once a canonical solution exists.

### Status values

Use only:

```text
unsolved
in-progress
solved
```

Learner-specific states such as confidence score or last reviewed date must not be added here.

## 6. `problem.md`

`problem.md` contains the problem-facing material only and must not reveal the solution.

Recommended structure:

```markdown
# 88. Merge Sorted Array

## Difficulty
Easy

## Problem
...

## Examples
...

## Constraints
...

## Source
LeetCode: ...
```

The repository is currently private, so existing raw problem text can be preserved during migration. If this content is later published on a public website, the public rendering should prefer original summaries plus links to LeetCode instead of blindly republishing full proprietary problem text.

## 7. `solution.md`

The detailed solution format should follow the study style already established in the previous ChatGPT LeetCode sessions.

Canonical section order:

```text
1. Core idea / intuition
2. Bilingual problem walkthrough
3. Requirement analysis
4. Naive or alternative approaches, when useful
5. Optimal approach
6. Java solution
7. Code explanation
8. Dry run
9. Time and space complexity
10. Why the algorithm is correct
11. Edge cases
12. Common mistakes
13. How to explain it in an English interview
14. Vocabulary
```

Not every problem needs artificially long alternative approaches. Sections should remain detailed but useful; irrelevant padding should be avoided.

The Java code shown inside `solution.md` must match `Solution.java` semantically.

## 8. `Solution.java`

`Solution.java` stores the canonical compilable/reference implementation separately from the prose explanation.

Reasons:

- Easier to review directly in GitHub.
- Easier for future tooling to extract and test.
- Easier for a future website code runner or editor to consume.
- Prevents Markdown parsing from becoming the only source of executable code.

For standard LeetCode problems, preserve the expected LeetCode class/method signature unless a problem requires a custom design class such as `RandomizedSet`.

## 9. Study plans

A study plan must reference canonical problems rather than duplicate them.

Example `study-plans/top-interview-150/index.yaml`:

```yaml
id: top-interview-150
title: Top Interview 150

sections:
  - name: Array / String
    slug: array-string
    problems:
      - 88
      - 27
      - 26
      - 80
      - 169
      - 189
      - 121
      - 122
```

This allows the same canonical problem to later appear in other plans such as LeetCode 75, Blind 75, or NeetCode 150 without duplicating its explanation or code.

## 10. Raw source preservation

The current topic-level `.txt` files should be moved, not discarded, into:

```text
raw/top-interview-150/
```

They act as migration source/archive until every problem has been extracted and verified.

The migration must be non-destructive: no raw file should be deleted until all contained problem IDs have corresponding canonical folders and have been checked.

## 11. Root `README.md`

The root README should become the human-facing study dashboard.

It should include:

- Repository purpose.
- Main study plan.
- Progress by section.
- Links to individual canonical problem folders.
- Legend for `solved`, `in-progress`, and `unsolved`.
- Brief explanation of repository structure.

Example progress table:

```text
| Section          | Solved | Total |
|------------------|-------:|------:|
| Array / String   | 7      | 24    |
| Two Pointers     | 0      | 5     |
| Sliding Window   | 0      | 4     |
```

The exact counts must be generated from the repository contents during implementation rather than guessed.

## 12. Future website architecture

This repository should act as the canonical content repository.

Future website content flow:

```text
GitHub repository
      ↓
meta.yaml + problem.md + solution.md + Solution.java
      ↓
content ingestion/build step
      ↓
coding-practice website
```

The website may import content at build time or through a dedicated ingestion pipeline.

User-specific data belongs in an application database, for example:

```text
users
problem_progress
attempts
submissions
bookmarks
review_schedule
```

That database should reference canonical LeetCode problem IDs but must not become the source of truth for explanations and reference solutions.

## 13. Future features enabled by this design

Because problems have structured metadata, a later website can support:

- Filter by difficulty.
- Filter by topic.
- Filter by algorithmic pattern.
- Study-plan navigation.
- Solved/unsolved progress.
- Hide/show solution.
- Dedicated tabs for explanation, code, dry run, edge cases, and interview notes.
- Java code editor/runner integration.
- Personalized review scheduling using application data.
- Weak-pattern analysis such as identifying low practice volume in Sliding Window or Backtracking.

These are future capabilities, not part of the initial repository migration.

## 14. Migration strategy

Implementation should proceed in controlled phases.

### Phase 1 — Inventory

- Enumerate all current topic `.txt` files.
- Extract the complete problem ID list from Top Interview 150.
- Determine which problems already have detailed solutions from prior ChatGPT work.
- Detect duplicates and missing problems.
- Record the exact current counts before moving files.

### Phase 2 — Create one reference problem

Use `88. Merge Sorted Array` as the initial reference example because a detailed solution already exists in prior study work.

Create and review:

```text
problems/array-string/0088-merge-sorted-array/
├── meta.yaml
├── problem.md
├── solution.md
└── Solution.java
```

The reference problem establishes the canonical formatting rules before bulk migration.

### Phase 3 — Migrate existing solved problems

Identify all previously completed Array/String solutions and convert them first. This preserves prior work before generating new solutions.

### Phase 4 — Migrate remaining raw problems

Extract each raw problem into its canonical folder and create metadata. Problems without solutions start with `status: unsolved`.

### Phase 5 — Generate solutions incrementally

Generate detailed solutions using the agreed format, preferably topic by topic. Each solution should be reviewed for correctness before marking `solved`.

### Phase 6 — Build navigation and validation

- Create/update root README dashboard.
- Create Top Interview 150 index.
- Add metadata schema validation.
- Validate that every study-plan ID maps to exactly one canonical problem folder.
- Validate that solved problems contain both `solution.md` and `Solution.java`.

## 15. Validation rules

The repository should eventually enforce these invariants:

1. Every canonical problem ID is unique.
2. Every problem slug is unique.
3. Every study-plan reference resolves to an existing canonical problem.
4. Every solved problem has `solution.md` and at least one declared solution-language file.
5. Java reference code matches the explanation's intended optimal solution.
6. No learner-specific progress data is stored in canonical problem metadata.
7. Raw source files remain available until migration coverage is verified.

## 16. Out of scope for this design

The following are intentionally deferred:

- Building the coding-practice website.
- Authentication.
- Online code execution infrastructure.
- Submission judging.
- User accounts and progress database.
- Spaced repetition implementation.
- AI-generated personalized study recommendations.
- Multi-language solutions beyond Java.
- Automatically scraping LeetCode.

## 17. Success criteria

The repository redesign is successful when:

- A learner can open one problem on GitHub without being shown its solution immediately.
- The solution can be opened separately and follows the agreed detailed teaching format.
- Java reference code is available independently from Markdown.
- Top Interview 150 can be reconstructed entirely from `index.yaml` references.
- Existing raw data is preserved.
- Previously solved problems are retained and migrated rather than recreated unnecessarily.
- A future website can enumerate, filter, and render problems using structured files without parsing the old monolithic `.txt` format.
- Adding a new study plan does not require duplicating problem content.

## 18. Implementation safety

Repository restructuring is a broad change. Implementation should therefore use a dedicated branch and Pull Request rather than directly rewriting `main` in bulk.

The first implementation checkpoint should be the single reference problem plus the supporting minimal schema/index structure. Bulk migration should only begin after that sample is reviewed and approved.
