# LeetCode Parallel Migration Worker Protocol

This file is the shared coordination contract for parallel Top Interview 150 V2 migration.

## Authoritative branches

- Integration + Worker A: `feat/leetcode-content-migration`
- Worker B: `worker-b/reverse-migration`
- Worker A staging: `staging/migrate-NNNN`
- Worker B staging: `worker-b/staging/migrate-NNNN`

Never push Worker B work directly to `feat/leetcode-content-migration`.
Never use another worker's staging namespace.

## Global migration positions

`data/migration-inventory.json["problems"]` defines the authoritative 1-based global order.

- Positions 1-48: completed before parallel work starts.
- Worker A owns positions 49-99 and moves upward.
- Worker B owns positions 150-100 and moves downward.
- Position numbers are not LeetCode problem IDs.
- Do not work outside the assigned range without explicit user approval.

## Source of truth

Before creating a problem package, read the current repository conventions, especially:

1. `docs/superpowers/specs/2026-08-15-leetcode-content-standard-v2-design.md`
2. `docs/content/bilingual-style-guide.md`
3. `docs/superpowers/specs/2026-08-15-leetcode-source-content-policy-addendum.md`
4. `docs/superpowers/plans/2026-08-15-leetcode-content-migration-implementation-plan.md`
5. `data/migration-inventory.json`
6. the relevant `raw/top-interview-150/*.txt`
7. completed V2 examples, especially problem 121 and latest integrated problem 228.

Do not replace supplied English problem wording with paraphrases. Add Vietnamese beneath the preserved English source according to the V2 standard.

## Per-problem package

A solved V2 package normally contains:

```text
meta.yaml
problem.md
hints.md
solution.md
interview.md
Solution.java
cases.yaml
```

and a Java regression harness:

```text
tests/java/<zero-padded-id>-<slug>/TestSolution.java
```

Media is deferred. Do not create empty `assets/` directories.

## One problem = one problem commit

Problem commit message:

```text
feat: migrate problem <ID> to V2
```

A problem commit must not contain coordination/status files or unrelated refactors.

## Worker A gate

Worker A continues the existing serialized workflow using `staging/migrate-NNNN`. Its workflow may amend `data/migration-inventory.json` and promote to `feat/leetcode-content-migration`.

## Worker B gate

Worker B must:

1. start from the current `worker-b/reverse-migration` HEAD;
2. create `worker-b/staging/migrate-NNNN` for the current problem;
3. add exactly one problem package and its Java test in one problem commit;
4. push the staging branch;
5. wait for `Worker B staged problem validation` to become GREEN;
6. verify the GREEN workflow promoted the same validated commit to `worker-b/reverse-migration`;
7. only then update `worker-b-status.md` in a separate coordination commit;
8. continue to the next assigned global position.

Worker B's problem commit must not edit `data/migration-inventory.json`; the Worker B gate deliberately keeps shared inventory untouched.

## Status ownership

- Worker A may write only `worker-a-status.md`.
- Worker B may write only `worker-b-status.md`.
- Integration side may write `integration-status.md`.
- `WORKER_PROTOCOL.md` and `worker-b-range.md` are read-only during normal migration.

Status changes use a separate commit such as:

```text
chore(coordination): update worker B status
```

A status file may say a problem is completed only after its GREEN problem commit is present on the worker's durable branch.

## Startup handshake for Worker B

Before touching problem 221, Worker B must:

1. verify the repository and all coordination files;
2. verify branch `worker-b/reverse-migration`;
3. verify next assignment = global position 150, problem 221, `Maximal Square`;
4. change `worker-b-status.md` from `READY_NOT_STARTED` to `STARTED` without migrating a problem;
5. commit and push the status change to `worker-b/reverse-migration`;
6. report branch + status commit SHA + next assignment;
7. STOP and wait for user approval.

## Integration ownership

Worker B must never merge, cherry-pick, rebase, or promote its commits into the integration branch. Integration is serialized by Worker A/integration after verification.

If a gate fails or branch state does not match this protocol, stop and report the exact blocker instead of guessing.
