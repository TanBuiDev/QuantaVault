# LeetCode Top Interview 150

This repository stores the canonical Top Interview 150 study content in structured problem packages.

## Repository layout

- `problems/<section>/<id>-<slug>/` — canonical problem packages consumed by the web app.
- `raw/top-interview-150/` — preserved topic-level source files used for provenance and migration auditing.
- `study-plans/top-interview-150/` — canonical study-plan ordering.
- `web/` — Next.js study workspace.
- `tools/` and `tests/` — inventory, content validation, and regression checks.

The legacy topic-level `.txt` files previously located at the repository root were consolidated into `raw/top-interview-150/`; do not add new source files at the repository root.

## Validation

```bash
python tools/validate_content.py
python -m unittest tests.test_inventory tests.test_validate_content -v
```

For the web workspace:

```bash
cd web
npm ci
npm run lint
npm test
npm run build
npx playwright test
```
