# Worker B Status

Worker: B
Branch: `worker-b/reverse-migration`
Assignment: global positions 150 -> 100
Direction: reverse
State: STARTED

Base integration commit: `403bdbbda68f0851f0cbd0e6a5ef1d43c2ed80a2`

Last completed global position: 128
Last completed problem: 136. Single Number
Last completed problem commit: `af3ad88690def8f591b8a9484926045d2dcb41b2`

Next assignment:
- global position: 127
- problem: 191. Number of 1 Bits

Stop boundary: after global position 100

Startup requirement:
- Change `State` to `STARTED` only after verifying protocol, range, branch and next assignment.
- Commit and push that status-only change.
- Report the status commit SHA to the user and STOP before migrating problem 221.

Notes:
- Do not edit `data/migration-inventory.json` in Worker B problem commits.
- Do not push to `feat/leetcode-content-migration`.
- Do not edit `worker-a-status.md` or `integration-status.md`.
