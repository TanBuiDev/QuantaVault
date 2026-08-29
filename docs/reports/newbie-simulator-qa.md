# Newbie Simulator QA — Top Interview 150

## Scope

This report records the Phase 6 quality gate for the newbie-first migration. The goal is not to claim that a regex can prove a lesson is easy to understand. The gate combines:

1. problem-specific curated teaching content;
2. manually rewritten golden references for the hardest failure modes;
3. deterministic structural regression checks;
4. the existing Java exact-sync and canonical-content validators.

The central simulator question is:

> Nếu xóa tên pattern khỏi phần đầu, người đọc còn hiểu được vì sao algorithm hình thành không?

## Coverage model

- Canonical problems: **150/150**.
- Golden references: **9**.
- Curated non-golden reasoning bridges: **141**.
- Each non-golden bridge carries five problem-specific pieces of evidence: framing/example, natural approach → bottleneck → observation, state/invariant meaning, implementation-state dry run, and mistakes/transfer knowledge.
- `tools/apply_newbie_bridges.py --check` is idempotent for the final **141** non-golden bridge set; promoted golden files are excluded from future generated rewrites.

## Golden references

The eight plan references are retained, with LRU Cache added as the extra pointer/data-structure reference allowed by the plan:

1. #121 Best Time to Buy and Sell Stock — running state.
2. #274 H-Index — definition + bounded threshold + bucket saturation.
3. #45 Jump Game II — reachable ranges before the BFS-level abstraction.
4. #238 Product of Array Except Self — prefix/suffix and update order.
5. #224 Basic Calculator — parser context and stack state.
6. #124 Binary Tree Maximum Path Sum — recursive return contract vs global answer.
7. #4 Median of Two Sorted Arrays — partition invariant and binary-search movement.
8. #188 Best Time to Buy and Sell Stock IV — DP state transition.
9. #146 LRU Cache — synchronized HashMap + doubly-linked-list state and pointer invariants.

## Simulator questions used

### 1. Understand the task

- Can the reader restate what output is required without knowing a pattern name?
- Is the difficult constraint or definition surfaced with a concrete example?

### 2. Form the algorithm

- Is there a natural first attempt?
- Is its exact bottleneck named?
- Does the observation remove that bottleneck rather than simply announcing an optimal pattern?

### 3. Understand implementation state

- Does each difficult variable/state/data structure have a plain-language meaning?
- Are update-order, pointer, recursion-return, boundary, or synchronization hazards explained where relevant?

### 4. Trace the implementation

- Does the worked example follow the same state used by the canonical implementation?
- Does the explanation identify when and why the important state changes?

### 5. Transfer the idea

- Are realistic mistakes captured?
- Is pattern recognition explained as a property of the problem, not merely a pattern name to memorize?

## Section-level review intent

| Section family | Main newbie blocker targeted |
|---|---|
| Array / string | What information from the past is actually needed now? |
| Two pointers | Why one pointer moves and the other does not; processed-region invariant. |
| Sliding window | What makes the window valid; why expand/shrink. |
| Matrix | Coordinate/layer/boundary mental model before loops. |
| Hash map | Why lookup state removes repeated scanning. |
| Intervals | What ordering makes local merge decisions safe. |
| Stack | Pending work/context/LIFO before API calls. |
| Linked list | Pointer topology and rewiring before assignments. |
| Trees | Recursive return contract, local state, and global answer. |
| Graph / BFS | Concrete node/edge meaning before graph terminology; shortest-step frontier. |
| Trie | Shared prefixes before node arrays/maps. |
| Backtracking | Choice → recurse → undo state model. |
| Divide & conquer | Subproblem contract and combine step. |
| Binary search | Search space, monotonic condition, and why half can be discarded. |
| Heap | Why repeated min/max access is the required operation. |
| Bit manipulation | Small binary example before operator-level reasoning. |
| Math | Derive the invariant/formula from examples rather than present it as magic. |
| DP / Kadane | State sentence, transition choices, base case, and update order before formula. |

## Automated guardrail

`tools/audit_solution_pedagogy.py` is intentionally a minimum-quality gate. It fails deterministic regressions such as:

- missing canonical `solution.md`;
- missing/duplicated `Optimal Java solution` section;
- too little explanatory material before canonical code;
- missing or malformed curated bridge for a non-golden problem;
- missing complexity/correctness evidence;
- missing worked-example evidence for Medium/Hard;
- missing mistakes/transfer evidence for Medium/Hard;
- unresolved placeholders.

Potential jargon-led openings are warnings only. They are not converted into failures merely to manufacture a numeric score.

## QA result

The Phase 5 structural pedagogy gate passes across the complete canonical inventory. Java algorithm blocks continue to be protected separately by the existing exact-sync audit. The H-Index reference was promoted from a generated bridge to a full golden rewrite so its derivation now leads directly to the canonical bounded-bucket implementation.

Final lint/test/build/E2E status is recorded in `newbie-solution-final-report.md` after the implementation branch reaches its final validation checkpoint.

There are no known unresolved content blockers in the migration set at this QA checkpoint. The remaining limitation is inherent: automated checks cannot measure whether every individual learner will find every explanation intuitive, so future learner feedback can still improve examples or wording without weakening the structural contract.
