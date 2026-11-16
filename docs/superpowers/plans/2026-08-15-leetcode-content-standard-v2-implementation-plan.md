# LeetCode Content Standard V2 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Upgrade the repository content contract and the reference problem `121. Best Time to Buy and Sell Stock` to the approved V2 standard before any bulk migration.

**Architecture:** Keep the current repository-level migration architecture and raw-source preservation intact, but upgrade the per-problem package. V2 separates bilingual problem text, progressive hints, algorithmic explanation, structured bilingual interview preparation, Java reference code, machine-readable cases, and optional media. Validation must enforce the contract before the format is reused across the remaining full-source problems.

**Tech Stack:** Git/GitHub, Markdown, YAML, JSON Schema, Python 3 standard library for repository validation, Java/JDK for reference-solution compilation.

## Global Constraints

- Repository: `TanBuiDev/leetcode`.
- Implementation branch: `feat/leetcode-content-migration`.
- Do not mutate `main` during implementation.
- Preserve all existing raw source files and their blob-backed copies under `raw/top-interview-150/`.
- User-supplied English problem wording is canonical and must not be silently rewritten.
- `problem.md` must be bilingual EN-VI for migrated `full-source` problems.
- `solution.md` must not duplicate the full problem statement.
- Interview preparation is stored in `interview.md`, not embedded as one large section in `solution.md`.
- Java remains the canonical solution language for this pass.
- `cases.yaml` uses deterministic serialization conventions defined by the V2 spec.
- Media is optional and must not be created merely to satisfy a template.
- Generated interview practice questions must not be labeled as statistically frequent without evidence.
- Problem 121 is the only problem upgraded in this checkpoint; bulk migration remains blocked until manual review.

---

## File Structure

Files created or modified by this plan:

```text
schemas/problem.schema.json
schemas/cases.schema.json

tools/validate_content.py

tests/test_validate_content.py

docs/content/bilingual-style-guide.md

problems/array-string/0121-best-time-to-buy-and-sell-stock/
├── meta.yaml
├── problem.md
├── hints.md
├── solution.md
├── interview.md
├── Solution.java
└── cases.yaml

data/migration-inventory.json
study-plans/top-interview-150/index.yaml
```

`assets/` is intentionally not created for problem 121 because the problem is understandable without a visual and the V2 media state should be `none`.

---

### Task 1: Upgrade metadata and cases schemas to V2

**Files:**
- Modify: `schemas/problem.schema.json`
- Create: `schemas/cases.schema.json`

**Interfaces:**
- Consumes: approved V2 spec.
- Produces: schema contracts consumed by `tools/validate_content.py` and future migration tooling.

- [ ] **Step 1: Expand `problem.schema.json` for V2 metadata**

Require at minimum:

```json
{
  "schema_version": 2,
  "id": 121,
  "slug": "best-time-to-buy-and-sell-stock",
  "title": "Best Time to Buy and Sell Stock",
  "difficulty": "Easy",
  "primary_section": "array-string",
  "content_status": {
    "source": "full-source",
    "translation": "complete",
    "hints": "complete",
    "solution": "complete",
    "interview": "complete",
    "cases": "complete",
    "problem_media": "none",
    "solution_media": "none"
  },
  "source": {
    "provider": "leetcode",
    "raw_file": "Array  String.txt",
    "raw_blob_sha": "193928590a8e65c3882a54482bcec77f2b17e470"
  }
}
```

Schema enums:

```text
content_status.source:
  full-source | list-only | source-missing

translation/hints/solution/interview/cases:
  none | partial | complete

problem_media/solution_media:
  none | available | media-missing
```

Require `raw_file` and `raw_blob_sha` whenever `content_status.source == full-source` and the source is raw-backed.

- [ ] **Step 2: Add media-item schema**

When `media` exists, validate:

```yaml
- id: example-1
  path: assets/problem/example-1.png
  scope: problem
  role: example
  origin: project-created
  alt_en: ...
  alt_vi: ...
```

Allowed `scope`: `problem | solution`.
Allowed `origin`: `user-supplied | external | project-created`.

- [ ] **Step 3: Create `cases.schema.json`**

Support:

```text
contract_type: method | operation-sequence
```

For a method contract require:

```yaml
schema_version: 1
problem_id: 121
contract_type: method
language_contract:
  class: Solution
  method: maxProfit
  parameters:
    - name: prices
      type: int[]
  return_type: int
cases: []
```

Allow each case to use exactly one of:

```text
expected
expected_mutation
```

For operation sequences allow `operations`, `arguments`, and `expected`.

- [ ] **Step 4: Commit schemas**

Commit message:

```text
feat: define V2 content schemas
```

---

### Task 2: Upgrade repository validation with focused tests

**Files:**
- Modify: `tools/validate_content.py`
- Create: `tests/test_validate_content.py`

**Interfaces:**
- Consumes: V2 `meta.yaml`, `problem.md`, `interview.md`, `cases.yaml`, local media references.
- Produces: deterministic validation errors and exit code 0/1.

- [ ] **Step 1: Write failing tests for V2 invariants**

Create tests using `tempfile.TemporaryDirectory` and Python standard library only.

Required test cases:

```python
def test_complete_translation_requires_bilingual_problem(): ...
def test_complete_interview_requires_bilingual_qa(): ...
def test_complete_cases_requires_cases_yaml(): ...
def test_full_source_requires_provenance(): ...
def test_media_scope_must_match_path(): ...
def test_solution_complete_requires_solution_and_java(): ...
```

Each test builds a minimal temporary problem folder and asserts the expected error text.

- [ ] **Step 2: Run tests and confirm they fail against the current validator**

Run:

```bash
python -m unittest tests.test_validate_content -v
```

Expected: failures because the current validator does not enforce V2 component states.

- [ ] **Step 3: Implement V2 validator helpers**

Add focused helpers:

```python
def validate_v2_content_status(problem_dir: Path, meta: dict) -> list[str]: ...
def validate_bilingual_problem(problem_dir: Path, meta: dict) -> list[str]: ...
def validate_interview(problem_dir: Path, meta: dict) -> list[str]: ...
def validate_cases(problem_dir: Path, meta: dict) -> list[str]: ...
def validate_media(problem_dir: Path, meta: dict) -> list[str]: ...
def validate_source_provenance(problem_dir: Path, meta: dict) -> list[str]: ...
```

Bilingual markers accepted for V2 content:

```text
Problem / Đề bài
Examples / Ví dụ
Q (EN):
Q (VI):
Short answer (EN):
Trả lời ngắn (VI):
```

- [ ] **Step 4: Preserve backward-safe behavior for inventory-only problems**

A repository may contain identity records that are `list-only` or `source-missing` without canonical problem folders. Validator must not treat that expected incompleteness as corruption.

- [ ] **Step 5: Run unit tests**

Run:

```bash
python -m unittest tests.test_validate_content -v
```

Expected: all tests pass.

- [ ] **Step 6: Commit validator and tests**

Commit message:

```text
feat: validate V2 LeetCode content
```

---

### Task 3: Add repository-wide bilingual terminology style guide

**Files:**
- Create: `docs/content/bilingual-style-guide.md`

**Interfaces:**
- Consumes: V2 terminology requirements.
- Produces: translation rules reused by all future `problem.md`, `solution.md`, and `interview.md` files.

- [ ] **Step 1: Define translation principles**

Document these rules explicitly:

```text
- English source remains unchanged when supplied by the user.
- Vietnamese appears immediately after the corresponding English statement in problem.md.
- Preserve identifiers, variable names, Java keywords, and O(...) notation.
- Keep common algorithm names in English with Vietnamese explanation.
- Prefer natural Vietnamese over literal word-for-word translation when meaning is unchanged.
```

- [ ] **Step 2: Add canonical glossary**

Include at least:

```text
non-decreasing       -> không giảm
in-place             -> tại chỗ (in-place)
subarray             -> mảng con liên tiếp
substring            -> chuỗi con liên tiếp
subsequence           -> dãy con giữ nguyên thứ tự tương đối
pointer               -> con trỏ / chỉ số con trỏ (theo ngữ cảnh)
two pointers          -> kỹ thuật two pointers / hai con trỏ
sliding window        -> cửa sổ trượt (sliding window)
constraint            -> ràng buộc
edge case             -> trường hợp biên
brute force           -> vét cạn (brute force)
greedy                -> tham lam (greedy)
dynamic programming   -> quy hoạch động (dynamic programming)
time complexity       -> độ phức tạp thời gian
space complexity      -> độ phức tạp bộ nhớ
extra space           -> bộ nhớ phụ
invariant             -> bất biến
```

- [ ] **Step 3: Define interview-English style**

Require:

```text
short sentences
simple grammar
correct technical terms
speakable answers for fresher interviews
avoid memorized-sounding filler
```

- [ ] **Step 4: Commit style guide**

Commit message:

```text
docs: add bilingual LeetCode style guide
```

---

### Task 4: Upgrade problem 121 metadata and bilingual problem statement

**Files:**
- Modify: `problems/array-string/0121-best-time-to-buy-and-sell-stock/meta.yaml`
- Modify: `problems/array-string/0121-best-time-to-buy-and-sell-stock/problem.md`

**Interfaces:**
- Consumes: raw source `raw/top-interview-150/Array  String.txt` at blob SHA `193928590a8e65c3882a54482bcec77f2b17e470` and bilingual style guide.
- Produces: V2 metadata and spoiler-free bilingual problem content.

- [ ] **Step 1: Replace metadata with V2 shape**

Use:

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

- [ ] **Step 2: Rewrite only the formatting/translation layer of `problem.md`**

Required headings:

```text
# 121. Best Time to Buy and Sell Stock
## Difficulty / Độ khó
## Problem / Đề bài
## Examples / Ví dụ
## Constraints / Ràng buộc
## Source / Nguồn
```

For every source paragraph, keep the supplied English wording and add Vietnamese immediately below it.

Do the same for Example explanations. Preserve mathematical constraint expressions exactly; add concise Vietnamese interpretation below each one.

- [ ] **Step 3: Confirm no algorithm hints leaked into `problem.md`**

The file must not mention `running minimum`, `one pass`, `O(n)` solution logic, or code.

- [ ] **Step 4: Commit bilingual problem package metadata**

Commit message:

```text
feat: upgrade problem 121 statement to V2
```

---

### Task 5: Add progressive hints and refactor algorithmic solution

**Files:**
- Create: `problems/array-string/0121-best-time-to-buy-and-sell-stock/hints.md`
- Modify: `problems/array-string/0121-best-time-to-buy-and-sell-stock/solution.md`
- Keep: `problems/array-string/0121-best-time-to-buy-and-sell-stock/Solution.java`

**Interfaces:**
- Consumes: existing verified one-pass Java solution.
- Produces: progressive hint content and algorithmic solution content without interview duplication.

- [ ] **Step 1: Create three progressive bilingual hints**

Required progression:

```text
Hint 1: Think about what buying information from previous days is useful for the current selling day.
Hint 2: Maintain the minimum price seen so far while scanning left to right.
Hint 3: For each price, compare currentPrice - minPrice against the best profit so far.
```

Each hint includes EN and VI. Do not include final Java code.

- [ ] **Step 2: Refactor `solution.md` to V2 section order**

Use exactly these main sections:

```text
1. Core idea / Intuition
2. Requirement recap / Tóm tắt yêu cầu
3. Key observations / Nhận xét quan trọng
4. Alternative approaches
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

Remove the old full bilingual problem walkthrough and the old large interview section.

- [ ] **Step 3: Verify Java code remains semantically identical**

Canonical implementation remains:

```java
class Solution {
    public int maxProfit(int[] prices) {
        int minPrice = Integer.MAX_VALUE;
        int maxProfit = 0;

        for (int price : prices) {
            minPrice = Math.min(minPrice, price);
            maxProfit = Math.max(maxProfit, price - minPrice);
        }

        return maxProfit;
    }
}
```

- [ ] **Step 4: Commit hints and solution refactor**

Commit message:

```text
feat: add V2 hints and solution for problem 121
```

---

### Task 6: Add structured bilingual interview preparation

**Files:**
- Create: `problems/array-string/0121-best-time-to-buy-and-sell-stock/interview.md`

**Interfaces:**
- Consumes: V2 interview format and problem 121 algorithm.
- Produces: speakable EN-VI interview practice content.

- [ ] **Step 1: Add 30-second pitch**

Provide:

```text
Pitch (EN)
Pitch (VI)
```

English must explain left-to-right scan, minimum price seen so far, current selling price, maximum profit, O(n), O(1).

- [ ] **Step 2: Add core practice questions**

At minimum include bilingual Q&A for:

```text
1. Can you explain your approach?
2. Why not use max(prices) - min(prices)?
3. How do you guarantee that the buy happens before the sell?
4. Why is the brute-force solution slower?
5. What are the time and space complexities?
6. What happens when prices are strictly decreasing?
7. Can you walk me through the code?
```

Every item has:

```text
Q (EN)
Q (VI)
Short answer (EN)
Trả lời ngắn (VI)
Standard answer (EN)
Trả lời chuẩn (VI)
```

- [ ] **Step 3: Add meaningful deep-answer tiers**

Use deep answers for at least:

```text
- proof that buy precedes sell
- why one pass is sufficient
- invariant maintained by minPrice/maxProfit
```

- [ ] **Step 4: Add likely follow-ups**

Include:

```text
What if multiple transactions are allowed?
What if you must also return the buy and sell days?
What if transaction fees are introduced?
```

Do not claim these are statistically frequent. Label them `Likely follow-up` or `Variation practice`.

- [ ] **Step 5: Add interviewer traps and useful phrases**

Cover:

```text
- confusing problem 121 with problem 122
- using a future minimum as a buy price
- overcomplicating with DP arrays
```

Useful phrases include:

```text
minimum price seen so far
current price as the selling price
best profit so far
scan from left to right
constant extra space
```

- [ ] **Step 6: Commit interview content**

Commit message:

```text
feat: add bilingual interview practice for problem 121
```

---

### Task 7: Add machine-readable cases and verify the complete V2 reference problem

**Files:**
- Create: `problems/array-string/0121-best-time-to-buy-and-sell-stock/cases.yaml`
- Modify: `data/migration-inventory.json`
- Modify: `study-plans/top-interview-150/index.yaml` if migration-state annotations require synchronization.

**Interfaces:**
- Consumes: problem examples, derived edge cases, V2 validator, Java reference solution.
- Produces: complete V2 reference package and verified migration state.

- [ ] **Step 1: Create `cases.yaml`**

Use:

```yaml
schema_version: 1
problem_id: 121
contract_type: method
language_contract:
  class: Solution
  method: maxProfit
  parameters:
    - name: prices
      type: int[]
  return_type: int
cases:
  - name: example-1
    source: problem-example
    input:
      prices: [7, 1, 5, 3, 6, 4]
    expected: 5
  - name: example-2
    source: problem-example
    input:
      prices: [7, 6, 4, 3, 1]
    expected: 0
  - name: increasing-prices
    source: derived-edge-case
    input:
      prices: [1, 2, 3, 4, 5]
    expected: 4
  - name: single-day
    source: derived-edge-case
    input:
      prices: [5]
    expected: 0
  - name: minimum-near-end
    source: derived-edge-case
    input:
      prices: [5, 4, 3, 1, 2]
    expected: 1
```

- [ ] **Step 2: Compile Java reference solution in an isolated temporary directory**

Create a temporary `Solution.java` from the canonical file and a `Main.java` harness that prints actual results for all five cases.

Run:

```bash
javac Solution.java Main.java
java Main
```

Expected output:

```text
5
0
4
0
1
```

- [ ] **Step 3: Run validator unit tests**

Run:

```bash
python -m unittest tests.test_validate_content -v
```

Expected: PASS.

- [ ] **Step 4: Run repository validator**

Run:

```bash
python tools/validate_content.py --root .
```

Expected: exit code 0 and V2 problem 121 reported valid.

- [ ] **Step 5: Update migration inventory for 121**

Change problem 121 to:

```json
{
  "source_status": "full-source",
  "solution_status": "migrated-v2",
  "canonical_path": "problems/array-string/0121-best-time-to-buy-and-sell-stock"
}
```

Do not change source states for unrelated problems during this checkpoint.

- [ ] **Step 6: Inspect final folder**

Expected files:

```text
meta.yaml
problem.md
hints.md
solution.md
interview.md
Solution.java
cases.yaml
```

No `assets/` directory is expected for 121.

- [ ] **Step 7: Compare branch against `main`**

Confirm all V2 work remains on `feat/leetcode-content-migration` and `main` is unchanged by implementation.

- [ ] **Step 8: Commit final V2 reference checkpoint**

Commit message:

```text
chore: verify V2 reference problem 121
```

---

## Completion Gate

Do not bulk migrate other problems until the user manually reviews the final V2 problem 121 package.

The checkpoint is successful only when:

```text
V2 schemas valid
validator tests pass
repository validator passes
problem.md bilingual and spoiler-free
hints.md progressive
solution.md algorithm-focused
interview.md structured EN-VI
Solution.java compiled and tested
cases.yaml valid
meta.yaml provenance accurate
problem 121 marked migrated-v2
```
