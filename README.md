# QuantaVault

> **Offline-First Software Architecture & Engineering Knowledge Engine**
> 
> *Quanta (số nhiều của quantum) đại diện cho những đơn vị năng lượng nhỏ nhất cấu thành nên vũ trụ; Vault là hầm chứa kiên cố. Dự án truyền tải thông điệp: hệ thống lớn được xây đắp vững chãi từ chính những thành tố cốt lõi nhỏ nhất (từ từng byte dữ liệu, chu kỳ CPU, transaction ACID cho đến luồng dữ liệu phân tán).*

🌐 **Live Deployment:** [https://quantavault.pages.dev](https://quantavault.pages.dev)  
📦 **GitHub Repository:** [https://github.com/TanBuiDev/QuantaVault](https://github.com/TanBuiDev/QuantaVault)

---

## Tổng quan dự án

QuantaVault là nền tảng tri thức kỹ thuật phần mềm và kiến trúc hệ thống chuyên sâu, kết hợp môi trường thực hành thuật toán offline-first:

1. **Software Architecture & Engineering Interview Engine (`/interview`)**:
   - Kho lưu trữ chuẩn hóa 538+ câu hỏi phỏng vấn kiến trúc chuyên sâu (Java Core, Concurrency, Spring Boot, Microservices, Distributed Systems, Database Internals, System Design).
   - Đánh số thứ tự tuần tự trực quan `#001` – `#538`, chuẩn hóa dữ liệu song song định dạng Markdown & JSON.
   - Tìm kiếm không dấu (accent-insensitive search), lọc đa tầng (tag, độ khó, trạng thái, công ty), lưu trạng thái thông minh qua URL và LocalStorage.
   - Trình biên tập Markdown chống lag, tối ưu bôi đen và gõ văn bản tiếng Việt, tự động lưu nháp `sessionStorage`.
   - Cơ chế xác thực biên 2FA (TOTP Authenticator & PIN) trên Cloudflare Pages Functions, đồng bộ xuất bản trực tiếp lên GitHub với bảo toàn chữ ký commit.

2. **LeetCode Top Interview 150 Coding Workspace (`/problems`)**:
   - Môi trường luyện tập thuật toán chuẩn LeetCode Top Interview 150 với bộ điều khiển Monaco Editor.
   - Trình chấm mã nguồn cục bộ (Local Docker Runner) bảo mật cao, cô lập hoàn toàn mạng, hỗ trợ Java 25.

---

## Repository layout

- `data/interview/` — canonical 538+ interview question packages and metadata.
- `problems/<section>/<id>-<slug>/` — canonical problem packages consumed by the coding workspace.
- `raw/top-interview-150/` — preserved topic-level source files used for provenance and migration auditing.
- `study-plans/top-interview-150/` — canonical study-plan ordering.
- `web/` — Next.js & Cloudflare Pages web application.
- `tools/` and `tests/` — inventory, content validation, and regression checks.


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

## Local Java workspace

### Khoi dong nhanh tren Windows

Nhan dup `KHOI-DONG.bat` tai thu muc goc. Launcher tu khoi dong Docker Desktop khi can, cai dependencies hoac tao Java runner image neu con thieu, chay website va mo `http://127.0.0.1:3000`.

Nhan dup `TAT-DU-AN.bat` de dung web, don container Java con sot va tat Docker Desktop.

Nhat ky cua launcher nam trong `%LOCALAPPDATA%\LeetcodeJavaWorkspace`.

The workspace is intended for one person on one machine. `npm run dev` and
`npm start` bind to `127.0.0.1`; open `http://127.0.0.1:3000` (or `localhost`
on the same port). No account, database, or cloud judge is required.

Install Docker Desktop with its Linux engine enabled. From `web/`, build the
Java image once before using Run/Submit:

```bash
npm run java:setup
npm run dev
```

The image uses a pinned JDK 25 Linux/amd64 base. Each submission resolves the
local image to its immutable image ID and runs with `--pull=never`. Requests
never download images, execute Java on the host, or send source to a cloud API.
Docker Desktop must remain running; when it is unavailable, reading problems,
editing drafts, and recording progress still work.

If Docker Desktop reports an unexpected startup error, choose **Quit**, reopen
Docker Desktop, then verify `docker info` before retrying. Do not use a factory
reset as a routine troubleshooting step: it can remove Docker data. Missing
runner image errors are resolved by `npm run java:setup` after Docker is ready.

### Execution and local API boundaries

- Run uses the first three canonical cases; Submit uses every canonical case.
  The API accepts only `{ problemId, sourceCode, mode: "run" | "submit" }`.
  It rejects client-provided cases/expected results and unsupported contracts.
- Containers have no network or host mounts, run as UID 10001, and have a
  read-only root, dropped capabilities, and `no-new-privileges`. Limits: one
  concurrent run, 1 CPU, 512 MiB RAM, 128 PIDs, 128 MiB work tmpfs, 256 KiB user
  source, 1 MiB combined output, 15-second compilation, 10-second execution,
  and a 35-second overall watchdog. Containers are removed on completion or
  cancellation; runner-labeled leftovers are cleaned on application startup.
- Run only one application server at a time against the runner/content store.
  Its lock and concurrency limit are process-local. Docker improves isolation
  but this is not a public multi-tenant judge or an anti-cheating system.
  Testcases remain visible learning material; the Java harness still compares
  results inside the submitted process.
- Write/run APIs require matching loopback Host and Origin, JSON, and
  `x-workspace-request: 1`. Missing/foreign origins are rejected. This protects
  the browser workflow, not against other programs running as your OS user.
  For another port, set `LOCAL_APP_ORIGIN` to that exact loopback HTTP origin
  and start Next with `-p <port>`; never expose the server through a proxy.
- Canonical `Solution.java` and canonical explanations remain unchanged.
  Editing canonical code creates a separate version; deleting canonical code
  is rejected. Metadata is committed atomically and writes are serialized per
  problem. New content appears after router refresh without losing drafts.
- `CONTENT_ROOT`, if explicitly set to an absolute existing content repository,
  selects a different content store and fails closed if invalid. Normally leave
  it unset. Progress and draft keys in browser storage are unchanged.

### Verification

```bash
cd web
npm run lint
npm test
npm run build
npx playwright test
npm run test:docker
```

Ordinary Vitest runs skip the real Docker integration suite. `test:docker`
requires the running Linux engine and prebuilt image, and exercises actual
Java compilation/execution, harness cases, cancellation, limits, and isolation.
The dedicated GitHub Actions Docker job runs the same suite.

Playwright starts its own production server on port 3100 with a temporary copy
of the content. It never reuses your local server or edits the real problem
packages. Build before running Playwright. Content-writing unit tests also use
temporary fixtures.
