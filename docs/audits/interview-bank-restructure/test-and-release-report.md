# Test & Release Report — Wave 1 & Wave 2

## 1. Local Verification Results (Wave 2 Final)
- `python data/courses/english-job-interview/tools/rebuild_course.py --check`: PASS (155 questions, 348 answers, 18 bilingual lessons)
- `python tools/validate_content.py`: PASS (150 canonical problems)
- `python tools/validate_interview_merge_staging.py`: PASS (21 reviewed groups, 43 archived sources, 22 proposed retired IDs, 508 canonical)
- `python tools/validate_interview_bank.py --strict-all`: PASS (508 canonical questions, 23 retired IDs, 538 legacy aliases, byte-for-byte mirror match)
- `python tools/audit_java_solution_comments.py`: PASS (150/150)
- `python tools/audit_solution_pedagogy.py`: PASS (150/150)
- `Wave1Verify.java` (`javac` + `java` OpenJDK 25.0.4.1): `WAVE1_JAVA_VERIFY_OK`
- `web`: `npm run lint`: PASS (0 errors)
- `web`: `npm test -- --maxWorkers=2`: PASS (85/85 test files, 589/589 tests; 16 docker integration tests skipped as expected)
- `web`: `npm run build`: PASS (266/266 pages; note Next.js emitted a non-blocking security advisory reminder for `next@16.4.3`)
- `web`: `npm run build:pages`: PASS (262/262 pages, 150 problems)
- `web`: `npm run test:pages-build`: PASS (2/2)
- `web`: `npm run test:pages`: PASS (32/32)
- `web`: `npx playwright test`: PASS (7/7)

## 2. Production & GitHub Verification
- Single branch policy: `main` only on both local and remote (`origin`).
- Cloudflare Pages project: `quantavault` (`https://quantavault.pages.dev/interview/`), deployed via GitHub Actions `Web CI` on push to `main`.
- **Wave 1 (`29b14d5`):** `Web CI` (`45857926833`) = `success` | `Java Docker isolation` (`45857927239`) = `success` (deployed to `https://quantavault.pages.dev/interview/`).
- **Wave 2 (`3d012dc`, `0f0510d`):** `Java Docker isolation` (`45859443787`, `45860673685`) = `success`; `Web CI` steps 1–21 (`--strict-all`, lint, 589 vitest, Next build, Pages build, isolation, regular Playwright E2E) = `success`. Step 22 (`Static Pages end-to-end tests`) hit an intermittent static-SSG hydration race in `e2e-pages/spring-course.spec.ts:54-55` (unrelated to Interview, passed 32/32 on re-run locally).
