# Parallel LeetCode Migration Coordination Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a conflict-safe two-worker coordination layer so Worker A can continue global positions 49-99 while Worker B independently migrates positions 150-100 and stops for verification before its first problem.

**Architecture:** Keep `feat/leetcode-content-migration` as the only authoritative integration path. Give Worker B a durable `worker-b/reverse-migration` branch plus a separate `worker-b/staging/migrate-*` validation gate that runs repository and Java regression checks but never amends the shared inventory or pushes to integration. Coordinate through one read-only protocol, one fixed Worker B range file, per-worker status files, and an integration status file.

**Tech Stack:** Git/GitHub, GitHub Actions YAML, Python 3 standard library validation, Java/JDK regression harnesses, Markdown coordination documents.

## Global Constraints

- Repository: `TanBuiDev/leetcode`.
- Baseline problem commit: `403bdbbda68f0851f0cbd0e6a5ef1d43c2ed80a2` (`228. Summary Ranges`).
- Worker A range: global positions 49-99, forward.
- Worker B range: global positions 150-100, reverse.
- Global positions come from the ordered `data/migration-inventory.json["problems"]` array and are not LeetCode IDs.
- Worker B never pushes, merges, cherry-picks, rebases, or promotes to `feat/leetcode-content-migration`.
- Worker B problem commits never modify `data/migration-inventory.json`.
- One migrated problem equals one `feat: migrate problem <ID> to V2` commit.
- Coordination/status changes are separate `chore(coordination): ...` commits.
- Media remains deferred.
- Worker B must perform a status-only startup handshake and stop before problem 221 until the user confirms verification.

---

### Task 1: Commit the coordination contract and Worker B gate

**Files:**
- Create: `docs/superpowers/specs/2026-08-16-parallel-leetcode-migration-coordination-design.md`
- Create: `docs/migration-coordination/WORKER_PROTOCOL.md`
- Create: `docs/migration-coordination/worker-a-status.md`
- Create: `docs/migration-coordination/worker-b-status.md`
- Create: `docs/migration-coordination/integration-status.md`
- Create: `docs/migration-coordination/worker-b-range.md`
- Create: `.github/workflows/worker-b-staged-problem-validation.yml`
- Create: `docs/superpowers/plans/2026-08-16-parallel-leetcode-migration-coordination-implementation-plan.md`

**Interfaces:**
- Consumes: current integration HEAD and existing V2/integration gate conventions.
- Produces: repository-visible coordination contract and isolated Worker B gate.

- [ ] **Step 1: Add protocol and fixed assignments**

Record the disjoint 49-99 and 150-100 ranges and the exact 51 Worker B position/problem mappings.

- [ ] **Step 2: Add independent status ownership**

Initialize Worker A as `ACTIVE`, Worker B as `READY_NOT_STARTED`, and integration as `PARALLEL_SPLIT_INITIALIZED`.

- [ ] **Step 3: Add the Worker B staging workflow**

Trigger only on:

```text
worker-b/staging/migrate-*
```

For every staged problem, require the complete V2 package and Java test; reject any changed path outside that package; run Python validation plus full Java regression; then promote only when staged parent equals the current `worker-b/reverse-migration` remote HEAD.

- [ ] **Step 4: Commit all setup atomically**

Commit message:

```text
chore(coordination): prepare parallel migration workers
```

Expected: the integration branch advances by exactly one non-problem setup commit.

### Task 2: Create the durable Worker B branch

**Files:**
- No additional file mutations.

**Interfaces:**
- Consumes: setup commit from Task 1.
- Produces: `worker-b/reverse-migration` pointing at the exact setup commit.

- [ ] **Step 1: Create Worker B branch from setup commit**

Create:

```text
worker-b/reverse-migration
```

Expected: Worker B starts with the same V2 baseline and coordination/gate files as integration.

- [ ] **Step 2: Verify branch equality at startup**

Compare setup commit to Worker B branch.

Expected: zero changed files before the startup handshake.

### Task 3: Enforce the Worker B startup handshake

**Files:**
- Worker B later modifies only: `docs/migration-coordination/worker-b-status.md`

**Interfaces:**
- Consumes: protocol, fixed range, durable Worker B branch.
- Produces: a verifiable status commit proving Worker B has read and accepted the contract.

- [ ] **Step 1: Worker B validates startup state**

Worker B must confirm next assignment:

```text
global position 150
problem 221. Maximal Square
```

- [ ] **Step 2: Worker B changes status only**

Change:

```text
State: READY_NOT_STARTED
```

to:

```text
State: STARTED
```

Do not create or modify any problem package.

- [ ] **Step 3: Commit and push handshake**

Commit message:

```text
chore(coordination): start worker B
```

Push only to `worker-b/reverse-migration`.

- [ ] **Step 4: Report and stop**

Worker B must report its branch, status commit SHA, confirmed next assignment, and explicitly state that no problem migration has started. It then waits for the user to have Worker A/integration verify the remote state.
