# Worker B Status

Worker: B
Branch: `worker-b/reverse-migration`
Assignment: global positions 150 -> 100
Direction: reverse
State: STARTED

Base integration commit: `403bdbbda68f0851f0cbd0e6a5ef1d43c2ed80a2`

Last completed global position: 110
Last completed problem: 427. Construct Quad Tree
Last completed problem commit: `8e557589634a0b17f876939b01b5ebf42ca5a056`

Next assignment:
- global position: 109
- problem: 148. Sort List

Stop boundary: after global position 100

Startup requirement:
- Change `State` to `STARTED` only after verifying protocol, range, branch and next assignment.
- Commit and push that status-only change.
- Report the status commit SHA to the user and STOP before migrating problem 221.

Notes:
- Do not edit `data/migration-inventory.json` in Worker B problem commits.
- Do not push to `feat/leetcode-content-migration`.
- Do not edit `worker-a-status.md` or `integration-status.md`.
