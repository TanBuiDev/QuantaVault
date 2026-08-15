# Worker B Status

Worker: B
Branch: `worker-b/reverse-migration`
Assignment: global positions 150 -> 100
Direction: reverse
State: STARTED

Base integration commit: `403bdbbda68f0851f0cbd0e6a5ef1d43c2ed80a2`

Last completed global position: 139
Last completed problem: 139. Word Break
Last completed problem commit: `e5800a20085c212564095e676c085ba4253d3b5c`

Next assignment:
- global position: 138
- problem: 198. House Robber

Stop boundary: after global position 100

Startup requirement:
- Change `State` to `STARTED` only after verifying protocol, range, branch and next assignment.
- Commit and push that status-only change.
- Report the status commit SHA to the user and STOP before migrating problem 221.

Notes:
- Do not edit `data/migration-inventory.json` in Worker B problem commits.
- Do not push to `feat/leetcode-content-migration`.
- Do not edit `worker-a-status.md` or `integration-status.md`.
