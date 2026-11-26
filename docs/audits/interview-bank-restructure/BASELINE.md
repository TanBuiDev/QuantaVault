# Baseline Snapshot — QuantaVault Interview Bank Restructure

- **Date:** 2026-11-26 (UTC+7)
- **GitHub Repository:** `https://github.com/TanBuiDev/QuantaVault`
- **Branch:** `main`
- **Baseline HEAD SHA:** `f0078898988f0fb2bb8c42ef99e75569a4b9757b`
- **Canonical Data:** `data/interview-questions.json`
- **Mirror Data:** `web/src/data/interview-questions.json` (byte-for-byte identical)
- **Data Blob SHA:** `4321649b7fd8a207c04a3182fc57e01c650ae488`
- **CoVie Reference Repo:** `E:\WebApp\CoVie` (HEAD `d741a292`)

## Question Counts (Total: 504)
- **Unique IDs:** 504 (max numeric ID: `q-539`)
- **Retired IDs (`web/src/lib/interview/retiredInterviewIds.json`):** 22
- **Legacy ID Map (`web/src/lib/interview/legacyIdMap.json`):** 538 entries
- **Merged Category Aliases (`web/src/lib/interview/mergedCategoryAliases.json`):** 2 entries (`q-007`, `q-487`)

### By Category
| Category ID | Count |
|---|---:|
| `java-core` | 47 |
| `design-patterns` | 32 |
| `collections` | 39 |
| `jvm` | 20 |
| `concurrency` | 21 |
| `spring` | 39 |
| `security-auth` | 64 |
| `database` | 71 |
| `microservices` | 31 |
| `testing-devops` | 51 |
| `project-covie` | 89 |
| **Total** | **504** |

### By Difficulty
- `fresher`: 0 (not yet in schema)
- `junior`: 42
- `middle`: 345
- `senior`: 117

## Baseline Validation Checks (2026-11-26)
- `python data/courses/english-job-interview/tools/rebuild_course.py --check`: PASS (155 questions, 348 answers, 18 bilingual lessons)
- `python tools/validate_content.py`: PASS (150 canonical problems)
- `python tools/validate_interview_merge_staging.py`: PASS (21 groups, 43 archived sources, 22 proposed retired IDs, 504 canonical)
- `python tools/audit_java_solution_comments.py`: PASS (150/150)
- `python tools/audit_solution_pedagogy.py`: PASS (150/150)
- `web`: `vitest run` — 84/86 passed, 1 skipped (docker integration), 1 timed out under parallel CPU load (`MermaidSecurity.test.tsx`, passed 1/1 in isolation)
