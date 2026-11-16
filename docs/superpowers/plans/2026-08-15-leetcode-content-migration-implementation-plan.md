# LeetCode Content Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restructure the existing private LeetCode repository into canonical per-problem content folders, preserving all user-supplied problem text verbatim, migrating previously completed solutions, and explicitly tracking missing source text without fabricating replacements.

**Architecture:** The repository becomes a content repository with one canonical folder per problem. Existing topic-level `.txt` files remain preserved under `raw/top-interview-150/`; each migrated problem gets `meta.yaml`, `problem.md`, optional `solution.md`, and optional `Solution.java`. A machine-readable migration inventory records coverage and missing-source states, while `study-plans/top-interview-150/index.yaml` references canonical problem IDs instead of duplicating content.

**Tech Stack:** Git/GitHub, Markdown, YAML, JSON Schema, Java reference solutions, lightweight validation scripts using Python 3 standard library + PyYAML only if already available; otherwise JSON-compatible YAML parsing is deferred to CI tooling and validation uses structural checks that do not add a runtime dependency.

## Global Constraints

- Repository: `TanBuiDev/leetcode`.
- Default branch: `main`.
- Implementation must use a dedicated branch and Pull Request; do not bulk-restructure `main` directly.
- Preserve all existing topic-level `.txt` source text exactly.
- User-supplied problem wording must not be replaced with paraphrased wording.
- Problems without supplied source text must remain explicitly `source-missing`; do not fabricate `problem.md` content.
- Previously completed solutions should be migrated rather than regenerated unnecessarily.
- Canonical problem folder format: `<zero-padded-id>-<leetcode-slug>`.
- Canonical problem content files: `meta.yaml`, `problem.md`, `solution.md`, `Solution.java` as applicable.
- Learner-specific data such as attempts, streaks, confidence, and review history stays out of canonical problem metadata.
- Java remains the only canonical solution language in this migration pass.
- Raw source files must not be discarded after migration.
- First implementation checkpoint is a single reference problem (`88. Merge Sorted Array`) plus minimal schema/index/inventory support.

---

## File Structure

Files created or modified during this implementation:

```text
README.md                                      # Human-facing study dashboard
CONTRIBUTING.md                                # Content-format and migration rules

raw/top-interview-150/                         # Verbatim copies of current topic .txt files

problems/
└── <primary-section>/
    └── <zero-padded-id>-<slug>/
        ├── meta.yaml                          # Structured canonical metadata
        ├── problem.md                         # Verbatim supplied problem statement, formatted only
        ├── solution.md                        # Detailed teaching solution when solved
        └── Solution.java                      # Canonical Java reference implementation

study-plans/top-interview-150/
├── README.md                                  # Study-plan navigation and coverage notes
└── index.yaml                                 # Ordered section/problem references

schemas/problem.schema.json                    # Metadata contract

tools/
├── inventory.py                               # Parse raw files and build migration inventory
└── validate_content.py                        # Validate canonical repository invariants

data/migration-inventory.json                  # Generated/reviewable coverage manifest

docs/superpowers/specs/...                     # Existing architecture + source-policy specs
docs/superpowers/plans/...                     # This implementation plan
```

The migration inventory uses this shape:

```json
{
  "problems": [
    {
      "id": 88,
      "title": "Merge Sorted Array",
      "section": "array-string",
      "raw_source_file": "Array  String.txt",
      "source_status": "available",
      "solution_status": "verified-existing",
      "canonical_path": "problems/array-string/0088-merge-sorted-array"
    }
  ]
}
```

Allowed `source_status` values:

```text
available
source-missing
```

Allowed `solution_status` values:

```text
none
candidate-existing
verified-existing
migrated
```

---

### Task 1: Create an isolated migration branch and capture repository baseline

**Files:**
- Create later on branch: `data/migration-inventory.json`
- No content files modified in this task.

**Interfaces:**
- Consumes: current `main` branch.
- Produces: branch `feat/leetcode-content-migration` and a baseline list of root `.txt` source files used by Task 2.

- [ ] **Step 1: Create the implementation branch from `main`**

Run through GitHub branch creation:

```text
repository: TanBuiDev/leetcode
branch: feat/leetcode-content-migration
base_ref: main
```

Expected: branch exists and points to the current `main` head.

- [ ] **Step 2: Enumerate root repository content on the new branch**

Fetch:

```text
https://api.github.com/repos/TanBuiDev/leetcode/contents?ref=feat/leetcode-content-migration
```

Record every root `.txt` file name exactly, including spaces and punctuation.

Expected: current source files such as `Array  String.txt`, `1D DP.txt`, `Backtracking.txt`, `Hashmap.txt`, etc. are visible.

- [ ] **Step 3: Verify no content mutation happened yet**

Compare branch head with `main`.

Expected: zero changed files.

---

### Task 2: Preserve all existing raw source files under `raw/top-interview-150/`

**Files:**
- Create: `raw/top-interview-150/<each existing root .txt file>`
- Keep: original root `.txt` files unchanged during this checkpoint.

**Interfaces:**
- Consumes: exact root `.txt` file bytes/content from Task 1.
- Produces: archival verbatim copies under `raw/top-interview-150/`.

- [ ] **Step 1: Fetch every root `.txt` source file from the migration branch**

For each exact file name returned in Task 1, fetch UTF-8 content from:

```text
repository_full_name: TanBuiDev/leetcode
ref: feat/leetcode-content-migration
path: <exact root filename>
```

- [ ] **Step 2: Create verbatim raw copies**

Create:

```text
raw/top-interview-150/<exact root filename>
```

with the fetched content unchanged.

Do not normalize whitespace, spelling, punctuation, separators, or line endings intentionally.

- [ ] **Step 3: Verify source preservation file-by-file**

For each copied file, fetch both original and raw copy and compare decoded text exactly.

Expected for every file:

```text
original_content == raw_copy_content
```

- [ ] **Step 4: Commit the raw preservation checkpoint**

Commit message:

```text
chore: preserve Top Interview 150 raw source files
```

Do not delete or move root originals yet.

---

### Task 3: Add migration inventory tooling and generate baseline coverage

**Files:**
- Create: `tools/inventory.py`
- Create: `data/migration-inventory.json`

**Interfaces:**
- Consumes: `raw/top-interview-150/*.txt`.
- Produces: `data/migration-inventory.json` containing detected problem IDs/titles/source files and coverage states.

- [ ] **Step 1: Write a parser test fixture inside the script as deterministic self-test data**

`tools/inventory.py` must expose:

```python
def parse_problem_headers(text: str) -> list[dict]:
    """Return ordered records with integer id and title from raw topic text."""
```

Use a built-in self-test sample:

```python
SAMPLE = """Array / String
121. Best Time to Buy and Sell Stock
Easy
...
122. Best Time to Buy and Sell Stock II
Medium
"""
```

Expected:

```python
[
    {"id": 121, "title": "Best Time to Buy and Sell Stock"},
    {"id": 122, "title": "Best Time to Buy and Sell Stock II"},
]
```

- [ ] **Step 2: Run parser self-test before repository scan**

Run:

```bash
python tools/inventory.py --self-test
```

Expected:

```text
PASS parse_problem_headers
```

- [ ] **Step 3: Implement repository inventory generation**

The script must:

1. Iterate `raw/top-interview-150/*.txt` in deterministic filename order.
2. Detect headings matching a numeric LeetCode ID followed by a title.
3. Preserve discovery order within each raw file.
4. Emit duplicate IDs as an explicit `duplicates` array rather than silently collapsing them.
5. Set `source_status: "available"` for detected source records.
6. Initialize `solution_status: "none"` unless overridden by the verified existing-solution candidate list.
7. Include `raw_source_file` exactly.

CLI:

```bash
python tools/inventory.py --root . --output data/migration-inventory.json
```

- [ ] **Step 4: Seed only known existing-solution candidates, not solved claims**

Mark these IDs as `candidate-existing` until their prior chat solution is individually verified:

```text
88
27
26
80
169
189
121
```

This list comes from retrievable prior user study work and must not be expanded by guesswork.

- [ ] **Step 5: Run inventory generation**

Run:

```bash
python tools/inventory.py --root . --output data/migration-inventory.json
```

Expected:

- valid JSON;
- every detected raw problem has an integer `id`;
- duplicate IDs are visible if present;
- no record is automatically marked fully migrated.

- [ ] **Step 6: Commit inventory tooling and baseline manifest**

Commit message:

```text
feat: add LeetCode migration inventory
```

---

### Task 4: Define canonical problem metadata schema and repository validation

**Files:**
- Create: `schemas/problem.schema.json`
- Create: `tools/validate_content.py`

**Interfaces:**
- Consumes: canonical `problems/**/meta.yaml`, study-plan index, migration inventory.
- Produces: deterministic validation exit code and human-readable failures.

- [ ] **Step 1: Create `problem.schema.json`**

Schema must require:

```text
id
slug
title
difficulty
primary_section
topics
patterns
study_plans
status
source_status
solution_languages
leetcode_url
```

Enums:

```text
difficulty: Easy | Medium | Hard
status: unsolved | in-progress | solved
source_status: available | source-missing
```

Conditional rule documented in schema description:

```text
If status == solved, canonical folder must contain solution.md and Solution.java.
```

Filesystem-dependent conditions are enforced by `validate_content.py`, not JSON Schema alone.

- [ ] **Step 2: Implement validation helpers**

`tools/validate_content.py` must expose focused functions:

```python
def find_problem_dirs(root: Path) -> list[Path]: ...
def validate_unique_ids(records: list[dict]) -> list[str]: ...
def validate_unique_slugs(records: list[dict]) -> list[str]: ...
def validate_solved_files(problem_dir: Path, meta: dict) -> list[str]: ...
def validate_source_files(problem_dir: Path, meta: dict) -> list[str]: ...
def validate_study_plan_refs(index: dict, ids: set[int]) -> list[str]: ...
```

- [ ] **Step 3: Add a no-content baseline validation mode**

CLI:

```bash
python tools/validate_content.py --root .
```

Before canonical problems exist, expected result:

```text
PASS: repository structure valid; 0 canonical problems
```

The validator must not mistake missing future content for corruption.

- [ ] **Step 4: Run validator and commit**

Run:

```bash
python tools/validate_content.py --root .
```

Expected exit code: `0`.

Commit message:

```text
feat: add canonical content validation
```

---

### Task 5: Create minimal Top Interview 150 study-plan structure

**Files:**
- Create: `study-plans/top-interview-150/index.yaml`
- Create: `study-plans/top-interview-150/README.md`

**Interfaces:**
- Consumes: verified problem IDs from migration inventory.
- Produces: ordered study-plan scaffold without inventing missing problem source content.

- [ ] **Step 1: Create `index.yaml` using only verified section/problem ordering available from user-supplied repository data**

Initial structure:

```yaml
id: top-interview-150
title: Top Interview 150
sections: []
```

Populate a section only when its ordering can be established from existing user-supplied raw data.

For Array / String, preserve the detected order from `Array  String.txt`; do not substitute a web-scraped copy of missing source text.

- [ ] **Step 2: Add coverage annotations**

Each problem reference may include only migration-state metadata, for example:

```yaml
- id: 121
  source_status: available
  migration_status: pending
```

Allowed `migration_status` values:

```text
pending
migrated
source-missing
```

- [ ] **Step 3: Create study-plan README**

Document:

- This repository is private study material.
- Canonical content is migrated only from supplied sources.
- Missing problem source text is expected and will be filled later by the user.
- Study-plan ordering is expanded as source coverage is verified.

- [ ] **Step 4: Validate and commit**

Run:

```bash
python tools/validate_content.py --root .
```

Expected exit code: `0`.

Commit message:

```text
feat: add Top Interview 150 study plan scaffold
```

---

### Task 6: Build the reference problem `88. Merge Sorted Array`

**Files:**
- Create: `problems/array-string/0088-merge-sorted-array/meta.yaml`
- Create: `problems/array-string/0088-merge-sorted-array/problem.md`
- Create: `problems/array-string/0088-merge-sorted-array/solution.md`
- Create: `problems/array-string/0088-merge-sorted-array/Solution.java`
- Modify: `data/migration-inventory.json`
- Modify: `study-plans/top-interview-150/index.yaml`

**Interfaces:**
- Consumes: supplied raw statement for problem 88 if available in repository/chat material; previously completed detailed solution from saved conversation.
- Produces: first fully canonical solved problem, establishing formatting for later migrations.

- [ ] **Step 1: Verify source statement availability before creating `problem.md`**

Search supplied repository raw files and retrievable prior user chat content for problem 88.

Decision:

```text
source found -> continue
source not found -> stop Task 6, set source_status=source-missing, do not fabricate problem.md
```

- [ ] **Step 2: Verify the prior solution rather than assuming it is complete**

Retrieve the saved `Merge Sorted Array` study conversation and confirm it contains the required teaching sections or enough existing material to construct them without changing the user's established learning style.

Update inventory for ID 88:

```text
solution_status: verified-existing
```

only after verification.

- [ ] **Step 3: Create `meta.yaml`**

Canonical values:

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
source_status: available
solution_languages:
  - java
time_complexity: O(m+n)
space_complexity: O(1)
leetcode_url: https://leetcode.com/problems/merge-sorted-array/
```

If verified source metadata conflicts with the example taxonomy, use the verified value and document the change in the commit message.

- [ ] **Step 4: Create `problem.md` from supplied source text**

Formatting may add Markdown headings and code fences, but English problem wording, examples, explanations, and constraints from supplied source material must remain verbatim.

Required headings:

```markdown
# 88. Merge Sorted Array

## Difficulty

## Problem

## Examples

## Constraints

## Source
```

- [ ] **Step 5: Create `solution.md` using the established study format**

Required section order:

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

Preserve useful content from the prior conversation rather than rewriting it for style alone.

- [ ] **Step 6: Create `Solution.java`**

Use the canonical O(m+n), O(1) reverse three-pointer implementation compatible with LeetCode's required method signature.

- [ ] **Step 7: Validate reference problem**

Run:

```bash
python tools/validate_content.py --root .
```

Expected:

```text
PASS: 1 canonical problem validated
```

Also manually verify:

```text
solution.md Java algorithm == Solution.java algorithm
```

- [ ] **Step 8: Update inventory and study-plan reference to migrated**

ID 88:

```text
source_status: available
solution_status: migrated
migration_status: migrated
```

- [ ] **Step 9: Commit the reference problem checkpoint**

Commit message:

```text
feat: migrate Merge Sorted Array reference problem
```

This is the first review gate before bulk migration.

---

### Task 7: Review the reference format before migrating additional solved problems

**Files:**
- Review only unless corrections are required.

**Interfaces:**
- Consumes: Task 6 output.
- Produces: approved canonical formatting rules for bulk migration.

- [ ] **Step 1: Review `problem.md` for source fidelity**

Check against supplied source text line-by-line for wording changes.

Expected: formatting differences only; no substantive wording changes.

- [ ] **Step 2: Review `solution.md` against the user's established learning style**

Confirm it includes bilingual walkthrough, deep explanation, Java solution, dry run, complexity, correctness, edge cases, common mistakes, interview English, and vocabulary.

- [ ] **Step 3: Review website-readiness boundaries**

Confirm:

```text
problem statement separated from solution
metadata machine-readable
Java code separate
study plan references by ID
```

- [ ] **Step 4: Run full validator again**

Run:

```bash
python tools/validate_content.py --root .
```

Expected exit code: `0`.

- [ ] **Step 5: Do not proceed to Task 8 until the reference problem is accepted as the template**

If changes are required, amend the reference problem and validator rules before bulk migration.

---

### Task 8: Migrate previously completed Array/String solutions that can be verified

**Files:**
- Create canonical folders for verified IDs among:
  - `27`
  - `26`
  - `80`
  - `169`
  - `189`
  - `121`
- Modify: `data/migration-inventory.json`
- Modify: `study-plans/top-interview-150/index.yaml`

**Interfaces:**
- Consumes: raw user-supplied statements + saved prior chat solutions.
- Produces: additional canonical solved problems only where both source and prior solution can be verified.

- [ ] **Step 1: Process one candidate problem at a time**

For each candidate ID, in this order:

```text
27
26
80
169
189
121
```

verify both:

```text
A. supplied source statement exists
B. prior detailed solution exists and is retrievable
```

- [ ] **Step 2: Apply explicit outcome rules**

If A and B are true:

```text
create meta.yaml
create problem.md
create solution.md
create Solution.java
mark migrated
```

If A true, B false:

```text
create meta.yaml
create problem.md
status: unsolved
solution_status: none
```

If A false:

```text
do not create fabricated problem.md
source_status: source-missing
leave migration pending
```

- [ ] **Step 3: Validate after each individual problem**

Run:

```bash
python tools/validate_content.py --root .
```

Expected: exit code `0` after every problem, not only after the batch.

- [ ] **Step 4: Commit in reviewable units**

Use one commit per problem or a maximum of two closely related problems per commit.

Commit pattern:

```text
feat: migrate problem 27 Remove Element
```

Do not mark an ID solved merely because it appears in the prior conversation index.

---

### Task 9: Migrate all remaining problem statements already present in raw files

**Files:**
- Create: `problems/<section>/<id-slug>/meta.yaml`
- Create: `problems/<section>/<id-slug>/problem.md`
- Modify: `data/migration-inventory.json`
- Modify: `study-plans/top-interview-150/index.yaml`

**Interfaces:**
- Consumes: `raw/top-interview-150/*.txt` inventory records.
- Produces: canonical unsolved problem records for all parseable user-supplied statements.

- [ ] **Step 1: Build a deterministic migration queue from the inventory**

Select records where:

```text
source_status == available
and canonical_path is not yet migrated
```

Order by raw source filename, then source discovery order.

- [ ] **Step 2: Extract exact problem boundaries from each raw file**

A problem block starts at its numeric heading and ends immediately before the next numeric problem heading in the same source file.

Do not merge neighboring blocks or remove content merely because it looks like LeetCode UI noise unless that removal rule has first been approved against the reference problem.

- [ ] **Step 3: Create metadata with `status: unsolved` unless a verified solution exists**

Minimum:

```yaml
status: unsolved
source_status: available
solution_languages: []
```

Difficulty/title/section must come from supplied source or verified metadata; do not guess.

- [ ] **Step 4: Create `problem.md` preserving supplied wording**

Only Markdown formatting transformations are allowed.

- [ ] **Step 5: Validate every migrated problem**

Run validator after each problem or small section-sized batch.

Expected: no duplicate IDs/slugs and no broken study-plan references.

- [ ] **Step 6: Commit by section-sized batches**

Commit pattern:

```text
feat: migrate supplied Hashmap problem statements
```

Do not generate new solutions in this task.

---

### Task 10: Record missing-source coverage explicitly

**Files:**
- Modify: `data/migration-inventory.json`
- Modify: `study-plans/top-interview-150/index.yaml`
- Modify: `study-plans/top-interview-150/README.md`

**Interfaces:**
- Consumes: known Top Interview 150 identities/order where already available from user-supplied data or previously verified study-plan records.
- Produces: transparent list of problems waiting for user-supplied source text.

- [ ] **Step 1: Identify known study-plan IDs not represented by supplied source blocks**

Mark:

```text
source_status: source-missing
migration_status: source-missing
```

Do not create fake source text.

- [ ] **Step 2: Add a Missing Source section to study-plan README**

Format:

```markdown
## Waiting for source text

- 383. Ransom Note
- ...
```

Include only identities already known with confidence; do not invent titles.

- [ ] **Step 3: Validate missing-source entries do not require canonical folders**

Run:

```bash
python tools/validate_content.py --root .
```

Expected exit code: `0`.

---

### Task 11: Build the root README study dashboard from verified repository state

**Files:**
- Create or modify: `README.md`
- Create: `CONTRIBUTING.md`

**Interfaces:**
- Consumes: canonical problem folders + migration inventory + study-plan index.
- Produces: human-readable navigation and contribution/migration rules.

- [ ] **Step 1: Calculate counts from actual repository data**

For each section compute:

```text
total known
source available
migrated
solved
source missing
```

Do not hard-code guessed counts.

- [ ] **Step 2: Write root README dashboard**

Include:

```text
repository purpose
Top Interview 150 progress table
section links
status legend
canonical folder explanation
raw source explanation
missing-source explanation
```

- [ ] **Step 3: Write CONTRIBUTING rules**

Document exact workflow for adding source text later:

```text
1. Add supplied raw text to the appropriate raw source file or a new supplied-source file.
2. Run inventory.
3. Create/update canonical problem folder.
4. Preserve statement wording.
5. Add solution only after review.
6. Run validator.
```

- [ ] **Step 4: Validate README counts against inventory**

Manually compare displayed counts to generated manifest totals.

- [ ] **Step 5: Commit dashboard/docs**

Commit message:

```text
docs: add LeetCode study dashboard and contribution workflow
```

---

### Task 12: Final repository validation and Pull Request

**Files:**
- No new content unless validation fixes are needed.

**Interfaces:**
- Consumes: all previous migration tasks.
- Produces: reviewed PR from `feat/leetcode-content-migration` to `main`.

- [ ] **Step 1: Run inventory regeneration from scratch**

Run:

```bash
python tools/inventory.py --root . --output data/migration-inventory.json
```

Expected: deterministic output with no unexplained disappeared source records.

- [ ] **Step 2: Run full canonical validator**

Run:

```bash
python tools/validate_content.py --root .
```

Expected exit code: `0`.

- [ ] **Step 3: Verify raw source preservation**

For every original root `.txt` source file retained during migration, compare it with:

```text
raw/top-interview-150/<same filename>
```

Expected: exact text equality.

- [ ] **Step 4: Verify every solved canonical problem has both solution artifacts**

For each `meta.yaml` with:

```yaml
status: solved
```

confirm:

```text
solution.md exists
Solution.java exists
```

- [ ] **Step 5: Verify missing-source problems are not presented as complete**

No `source-missing` entry may have a fabricated `problem.md` presented as canonical supplied text.

- [ ] **Step 6: Review branch diff against `main`**

Confirm the diff contains only:

```text
raw preservation
canonical content migration
inventory/schema/validation tools
study-plan navigation
documentation
```

No unrelated refactor.

- [ ] **Step 7: Open a Pull Request**

Title:

```text
Restructure LeetCode study content repository
```

PR body must summarize:

```text
- raw source files preserved verbatim
- reference problem format
- migrated previously solved problems
- migrated supplied unsolved statements
- explicit source-missing coverage
- validation commands and results
- remaining source text needed from the user
```

Do not merge automatically. The PR is the final review gate.

---

## Self-Review Checklist

### Spec coverage

- Canonical one-folder-per-problem architecture: Task 6 onward.
- Raw source preservation: Task 2 and Task 12.
- Verbatim user-supplied wording: Global Constraints, Tasks 6, 8, 9.
- Missing source text explicitly deferred: Tasks 3 and 10.
- Previously completed solutions preserved: Tasks 6 and 8.
- Structured metadata: Task 4.
- Study-plan references: Task 5.
- Future website-ready separation: Task 6 reference review.
- README dashboard: Task 11.
- Validation invariants: Tasks 4 and 12.
- Dedicated branch + PR: Tasks 1 and 12.

### Placeholder scan

The plan contains no `TBD`, `TODO`, “implement later”, or unspecified generic testing steps. Missing source content is represented as a deliberate domain state (`source-missing`), not as a plan placeholder.

### Scope

This plan intentionally does **not**:

- build the future website;
- scrape/copy missing LeetCode statements;
- generate all remaining solutions yet;
- add authentication, code execution, submissions, or progress database;
- delete raw source artifacts.

Those are separate future workstreams.
