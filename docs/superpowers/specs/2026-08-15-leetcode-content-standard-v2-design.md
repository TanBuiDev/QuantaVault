# LeetCode Content Standard V2 Design

Date: 2026-08-15
Status: Approved design, implementation pending
Repository: `TanBuiDev/leetcode`
Applies to branch: `feat/leetcode-content-migration`
Supersedes the per-problem content format in the original architecture design while preserving its repository-level principles and the source-content policy addendum.

## 1. Purpose

Version 2 standardizes each LeetCode problem as a reusable learning package for two simultaneous goals:

1. Study directly in GitHub with bilingual problem statements, progressive hints, detailed solutions, Java reference code, visual material when useful, and structured interview preparation.
2. Serve as canonical content for a future coding-practice website without having to split or reinterpret large Markdown files later.

The design intentionally separates problem-facing content, solution-facing content, interview practice, executable code, test cases, and media.

## 2. Canonical problem folder

Each canonical problem folder uses:

```text
<zero-padded-id>-<leetcode-slug>/
├── meta.yaml
├── problem.md
├── hints.md                 # optional
├── solution.md              # required when solved
├── interview.md             # required when interview content is complete
├── Solution.java            # required when solved in Java
├── cases.yaml               # required for solved V2 problems
└── assets/                  # optional; created only when media exists
    ├── problem/
    └── solution/
```

Empty `assets/` directories are not created because Git does not track empty directories.

## 3. `problem.md`: bilingual problem-facing content

`problem.md` contains no solution spoilers.

### 3.1 Language policy

For source text supplied by the user:

- Preserve the English wording from the supplied source.
- Add a Vietnamese translation immediately below the corresponding English paragraph or list item.
- Do not silently rewrite the English source for style.
- Vietnamese translation may clarify terminology, but must not change the problem requirements.

### 3.2 Required order

```text
1. Title
2. Difficulty
3. Problem / Đề bài
4. Examples / Ví dụ
5. Constraints / Ràng buộc
6. Problem media when applicable
7. Source provenance
```

Examples and explanations are bilingual when the supplied source contains them. Constraints are presented in their original mathematical form and accompanied by concise Vietnamese interpretation where it improves comprehension.

### 3.3 No duplicated full statement in `solution.md`

The complete bilingual statement lives only in `problem.md`. `solution.md` may contain a short requirement recap, but must not duplicate the entire problem statement.

## 4. `hints.md`: progressive hints without immediate spoilers

`hints.md` is optional and is used when progressive hints add learning value.

Recommended shape:

```text
# Hints / Gợi ý

## Hint 1
Conceptual direction only.

## Hint 2
Identify the likely algorithmic pattern or invariant.

## Hint 3
Give a near-implementation-level insight without pasting the final code.
```

Each hint is bilingual EN-VI when practical. The order must reveal progressively more information.

A trivial problem does not need artificial hints merely to satisfy a template.

## 5. `solution.md`: algorithmic learning content

`solution.md` is detailed but does not carry full interview Q&A anymore.

Canonical section order:

```text
1. Core idea / Intuition
2. Requirement recap / Tóm tắt yêu cầu
3. Key observations / Nhận xét quan trọng
4. Alternative or naive approaches, when useful
5. Optimal approach
6. Java solution overview
7. Code explanation
8. Dry run
9. Time and space complexity
10. Why the algorithm is correct
11. Edge cases
12. Common mistakes
13. Pattern recognition / When to reuse this idea
14. Vocabulary and algorithmic terminology
```

The main explanatory language is Vietnamese. English algorithmic terms are retained deliberately so the material also supports interview vocabulary.

The Java code block inside `solution.md`, if present, must be semantically identical to `Solution.java`.

## 6. `interview.md`: structured bilingual interview preparation

Interview preparation is a first-class artifact and is separated from `solution.md`.

### 6.1 Goals

The file trains the learner to:

- understand common interviewer questions in English;
- confirm their meaning in Vietnamese;
- answer in concise natural English;
- verify the intended meaning in Vietnamese;
- handle follow-up and deeper reasoning questions;
- walk through code and complexity verbally.

### 6.2 Required sections for completed interview content

```text
1. 30-second solution pitch
2. Core approach questions
3. Why / correctness questions
4. Complexity questions
5. Edge-case questions
6. Alternative-approach and trade-off questions
7. Code walkthrough questions
8. Follow-up variations
9. Common interviewer traps
10. Useful phrases and vocabulary
```

### 6.3 Bilingual Q&A format

Every core interview item uses this structure:

```text
Q (EN): <interviewer question>
Q (VI): <Vietnamese meaning>

Short answer (EN): ...
Trả lời ngắn (VI): ...

Standard answer (EN): ...
Trả lời chuẩn (VI): ...
```

A `Deep answer` tier is added only when the question has meaningful deeper reasoning. It is not mandatory for every question.

### 6.4 English style

English answers should be suitable for a fresher Java interview:

- short sentences;
- technically correct vocabulary;
- no unnecessarily advanced wording;
- easy to say aloud;
- direct explanation of invariant, complexity, and trade-offs.

## 7. `Solution.java`: canonical executable reference

`Solution.java` remains the canonical Java implementation.

Requirements:

- Preserve the LeetCode-compatible class and method signature when applicable.
- Compile successfully when the problem can be represented as a standalone Java source without hidden LeetCode types.
- For problems using `TreeNode`, `ListNode`, graph node classes, or design-specific classes, validation may use a local test harness that supplies required support types.
- The implementation must match the optimal approach documented in `solution.md`.

## 8. `cases.yaml`: machine-readable test data

`cases.yaml` prepares content for future code-runner and website ingestion.

Version 1 shape:

```yaml
schema_version: 1
problem_id: 121
language_contract:
  class: Solution
  method: maxProfit
  parameters:
    - type: int[]
  return_type: int

cases:
  - name: example-1
    source: problem-example
    input:
      prices: [7, 1, 5, 3, 6, 4]
    expected: 5

  - name: decreasing-prices
    source: derived-edge-case
    input:
      prices: [7, 6, 4, 3, 1]
    expected: 0
```

Allowed case `source` values:

```text
problem-example
derived-edge-case
derived-regression
```

Cases copied from supplied problem text are marked `problem-example`. Additional cases created for learning or regression are marked `derived-*`.

## 9. Media design

Media is optional and used only when it improves understanding.

### 9.1 Directory separation

```text
assets/problem/   # media required to understand the problem/examples
assets/solution/  # algorithm, dry-run, pointer, state, or invariant visuals
```

This prevents solution visuals from leaking into the problem view.

### 9.2 Media priority

Use this preference order:

1. media supplied by the user;
2. external media with clear reusable licensing and recorded attribution;
3. project-created illustration based on the problem data or algorithm;
4. mark media as missing when useful media is known to be absent.

Do not automatically mirror third-party proprietary images merely because the repository is private.

### 9.3 Accessibility and provenance

Every referenced image must have meaningful Markdown alt text.

External or supplied media metadata records origin and attribution when known. Project-created solution illustrations should be visually consistent across the repository where practical.

## 10. Source coverage states

The previous binary `available` / `source-missing` model is replaced by three content-source states:

```text
full-source
list-only
source-missing
```

Definitions:

- `full-source`: sufficient user-supplied source text exists to produce a faithful bilingual `problem.md`.
- `list-only`: problem identity/title/difficulty is known from a supplied raw topic list, but the full problem statement is not present.
- `source-missing`: the canonical problem is known but no supplied raw source entry currently exists for it.

A `list-only` or `source-missing` problem must not receive a fabricated canonical `problem.md` that appears to be the original statement.

## 11. `meta.yaml` V2

All V2 problems use `schema_version: 2`.

Example:

```yaml
schema_version: 2

id: 121
slug: best-time-to-buy-and-sell-stock
title: Best Time to Buy and Sell Stock
difficulty: Easy
primary_section: array-string

content_status:
  source: full-source
  translation: complete
  hints: complete
  solution: complete
  interview: complete
  cases: complete
  problem_media: none
  solution_media: none

source:
  provider: leetcode
  raw_file: "Array  String.txt"
  raw_blob_sha: "193928590a8e65c3882a54482bcec77f2b17e470"

study_plans:
  - top-interview-150

topics:
  - Array
  - Dynamic Programming

patterns:
  - Running Minimum
  - One Pass

solution_languages:
  - java

time_complexity: O(n)
space_complexity: O(1)

leetcode_url: https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
```

### 11.1 Content-status enums

`content_status.source`:

```text
full-source
list-only
source-missing
```

`translation`, `hints`, `solution`, `interview`, `cases`:

```text
none
partial
complete
```

`problem_media`, `solution_media`:

```text
none
available
media-missing
```

`none` for media means media is not needed for the current content. `media-missing` means media would materially improve the content but has not been supplied or created yet.

## 12. Provenance and drift protection

For raw-file-backed problems, `meta.yaml` records:

- raw file name;
- raw blob SHA used during extraction;
- provider.

This allows tooling to detect when a raw source changes after a canonical problem has already been generated.

The repository retains `raw/top-interview-150/` even after all problems have been migrated.

## 13. Bilingual terminology style guide

The repository must add a shared terminology/style guide before bulk migration.

The guide standardizes terms that otherwise drift between problems, including at least:

```text
non-decreasing
in-place
subarray
substring
subsequence
pointer
two pointers
sliding window
constraint
edge case
brute force
greedy
dynamic programming
time complexity
space complexity
extra space
```

Rules:

- Preserve common English algorithm names alongside Vietnamese explanations.
- Prefer consistent Vietnamese wording across all 150 problems.
- Do not over-translate identifiers, Java keywords, variable names, or standard complexity notation.

## 14. Website mapping

The future website consumes artifacts directly:

```text
meta.yaml      -> search, filters, status, navigation
problem.md     -> Problem tab
hints.md       -> progressive Hint reveals
solution.md    -> Solution tab
interview.md   -> Interview Practice tab
Solution.java  -> reference code / editor seed
cases.yaml     -> test runner input
assets/problem -> problem media
assets/solution-> solution visualization
```

No learner-specific state belongs in these files. Attempts, submissions, bookmarks, streaks, confidence, and review scheduling remain future database concerns.

## 15. Validation requirements

Before bulk migration, repository validation must enforce V2 invariants.

At minimum:

1. problem IDs and slugs are unique;
2. every study-plan reference resolves to a known canonical problem identity;
3. `full-source` + migrated problems contain `problem.md`;
4. `translation: complete` requires bilingual markers/content in `problem.md`;
5. `solution: complete` requires `solution.md` and `Solution.java`;
6. `interview: complete` requires `interview.md` with bilingual Q&A structure;
7. `cases: complete` requires `cases.yaml`;
8. all Markdown-referenced local media paths exist;
9. media under `assets/problem/` is never required to understand a solution-specific concept;
10. Java reference code and documented optimal solution remain semantically aligned;
11. raw provenance fields exist for raw-backed `full-source` problems;
12. Top Interview 150 inventory contains exactly 150 unique problem IDs.

## 16. V2 migration order

The next migration checkpoint is intentionally narrow:

1. update schema and validator to V2;
2. add bilingual terminology/style guide;
3. upgrade problem 121 to the complete V2 format;
4. validate and manually review problem 121;
5. only after approval, migrate the remaining `full-source` problems;
6. leave `list-only` and `source-missing` problem statements deferred until the user supplies full source text.

## 17. V2 reference problem acceptance criteria

Problem 121 is accepted as the V2 reference only when all of the following are true:

- `meta.yaml` uses schema version 2 and accurate component statuses;
- `problem.md` is fully bilingual EN-VI and preserves supplied English wording;
- `hints.md` provides progressive hints without immediately exposing code;
- `solution.md` contains the algorithmic teaching content without duplicating the full statement;
- `interview.md` contains structured bilingual questions and suggested answers;
- `Solution.java` compiles and passes reference cases;
- `cases.yaml` contains supplied examples and derived edge cases;
- media status explicitly records whether visuals are needed;
- V2 validator passes;
- no raw source text is discarded or overwritten.

## 18. Out of scope for this V2 checkpoint

This design does not build the future website, online judge, authentication, user progress database, spaced-repetition system, or public publishing pipeline.

It also does not require creating decorative images for problems that are already clearer without visuals.
