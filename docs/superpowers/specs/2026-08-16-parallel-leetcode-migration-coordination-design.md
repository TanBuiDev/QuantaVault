# Parallel LeetCode Migration Coordination Design

Date: 2026-08-16
Status: Approved for implementation
Repository: `TanBuiDev/leetcode`
Migration branch: `feat/leetcode-content-migration`
Migration baseline: `403bdbbda68f0851f0cbd0e6a5ef1d43c2ed80a2` (`feat: migrate problem 228 to V2`)

## 1. Goal

Run two ChatGPT workers in parallel on the remaining Top Interview 150 V2 migration without letting them race on the integration branch, shared inventory, or staging gate.

## 2. Assignment model

The 150 records in `data/migration-inventory.json["problems"]` define one authoritative 1-based global migration position.

- Worker A owns global positions **49 through 99**, moving forward.
- Worker B owns global positions **150 through 100**, moving backward.
- The ranges are disjoint. Worker A must stop after position 99; Worker B must stop after position 100.
- A global position is not a LeetCode problem ID.

At the baseline, positions 1-48 are already migrated. Position 48 is problem 228, `Summary Ranges`.

## 3. Branch model

```text
main
  |
  `-- feat/leetcode-content-migration        integration + Worker A
       |
       `-- worker-b/reverse-migration        Worker B durable branch
            |
            `-- worker-b/staging/migrate-NNNN  Worker B per-problem gate branches
```

Worker B must never push to `feat/leetcode-content-migration` and must never use the existing `staging/migrate-*` namespace.

## 4. Gate separation

The existing `.github/workflows/staged-problem-validation.yml` remains unchanged and continues to own Worker A/integration promotion. It amends `data/migration-inventory.json` and promotes to `feat/leetcode-content-migration`.

A new `.github/workflows/worker-b-staged-problem-validation.yml` validates `worker-b/staging/migrate-*` and promotes only to `worker-b/reverse-migration`.

Worker B's gate:

1. resolves the problem ID from the staging branch name;
2. requires exactly one V2 problem package plus `tests/java/<package>/TestSolution.java` in the problem commit;
3. rejects edits to `data/migration-inventory.json` and coordination documents inside a problem commit;
4. runs Python unit tests, inventory self-test, repository content validation, diff checks, and the complete Java regression suite;
5. verifies the staged commit parent still equals the remote Worker B branch HEAD;
6. pushes the validated commit to `worker-b/reverse-migration`;
7. does **not** amend or persist shared inventory state.

This keeps Worker B problem commits independently portable for later integration.

## 5. Problem commit contract

Every Worker B problem migration uses exactly one problem commit named:

```text
feat: migrate problem <ID> to V2
```

The problem commit contains:

```text
problems/<section>/<package>/meta.yaml
problems/<section>/<package>/problem.md
problems/<section>/<package>/hints.md
problems/<section>/<package>/solution.md
problems/<section>/<package>/interview.md
problems/<section>/<package>/Solution.java
problems/<section>/<package>/cases.yaml
tests/java/<package>/TestSolution.java
```

No assets are created while media is intentionally deferred.

Coordination/status commits are allowed separately and use `chore(coordination): ...`; they are not problem commits and will not be integrated as problem content.

## 6. Communication files

`docs/migration-coordination/WORKER_PROTOCOL.md` is read-only policy for both workers.

`worker-a-status.md` is owned by Worker A.

`worker-b-status.md` is owned by Worker B on `worker-b/reverse-migration`.

`integration-status.md` is owned by the integration side.

`worker-b-range.md` is a fixed, reviewed list of the 51 Worker B assignments.

Workers never edit each other's status file.

## 7. Startup handshake

Before migrating position 150, Worker B must:

1. read the shared conversation context if available;
2. read the protocol, range, Worker A status, Worker B status, and integration status from GitHub;
3. verify `worker-b/reverse-migration` exists and contains the Worker B workflow;
4. verify its next assignment is position 150, problem 221 `Maximal Square`;
5. change only `worker-b-status.md` from `READY_NOT_STARTED` to `STARTED`;
6. commit and push that status update to `worker-b/reverse-migration`;
7. report the new status commit SHA and **STOP**.

The user will ask Worker A/integration to verify this handshake before Worker B is allowed to create the first problem commit.

## 8. Integration rule

Worker B never cherry-picks, merges, rebases, or promotes its own work into `feat/leetcode-content-migration`.

The integration side later replays each accepted Worker B problem commit on top of the then-current integration HEAD and routes it through the authoritative integration gate so `data/migration-inventory.json` is regenerated/amended only in the serialized integration path.

## 9. Source and content conventions

Both workers must follow the current repository sources of truth, especially:

- `docs/superpowers/specs/2026-08-15-leetcode-content-standard-v2-design.md`
- `docs/content/bilingual-style-guide.md`
- `docs/superpowers/specs/2026-08-15-leetcode-source-content-policy-addendum.md`
- `docs/superpowers/plans/2026-08-15-leetcode-content-migration-implementation-plan.md`
- the completed reference packages, especially problem 121 and the latest migrated problem 228.

English source wording must come from the repository raw source. Media remains deferred.
