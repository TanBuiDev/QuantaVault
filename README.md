# QuantaVault

> **Offline-First Software Architecture & Algorithmic Engineering Platform**
> 
> *Quanta represents the fundamental, discrete constituents of structure; Vault represents an immutable, high-integrity repository. High-throughput distributed systems and mission-critical architectures are forged upon mastery of fundamental computing primitives—from memory layouts, byte compact representations, and thread synchronization to transactional boundaries and distributed consensus.*

[![Web CI](https://github.com/TanBuiDev/QuantaVault/actions/workflows/web-ci.yml/badge.svg)](https://github.com/TanBuiDev/QuantaVault/actions/workflows/web-ci.yml)
[![Deployment](https://img.shields.io/badge/Cloudflare_Pages-Live-F38020?logo=cloudflare&logoColor=white)](https://quantavault.pages.dev)
[![Next.js](https://img.shields.io/badge/Next.js-16.4-black?logo=next.js&logoColor=white)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Java](https://img.shields.io/badge/JDK-25-ED8B00?logo=openjdk&logoColor=white)](https://openjdk.org/)
[![Tests](https://img.shields.io/badge/Vitest-187%20Passed-6E9F18?logo=vitest&logoColor=white)](https://vitest.dev/)

🌐 **Live Production Deployment:** [https://quantavault.pages.dev](https://quantavault.pages.dev)  
📦 **GitHub Repository:** [https://github.com/TanBuiDev/QuantaVault](https://github.com/TanBuiDev/QuantaVault)

---

## 🏛️ System Architecture

```mermaid
graph TD
    subgraph Client_Layer ["Client Tier (Browser / PWA)"]
        UI["Modern Next.js 16 UI / Tailwind CSS"]
        Monaco["Monaco Editor (Java 25 Workspace)"]
        Mermaid["Dynamic Vector Mermaid Renderer"]
        LocalCache["IndexedDB / LocalStorage State Sync"]
    end

    subgraph Edge_Cloudflare ["Edge Infrastructure (Cloudflare Pages)"]
        EdgeWorker["Cloudflare Edge Worker (_worker.js)"]
        TOTP["SubtleCrypto 2FA (RFC 6238 TOTP & PIN)"]
        RateLimit["In-Memory Edge Rate Limiting"]
    end

    subgraph GitHub_Storage ["Persistent Git Engine (GitHub API)"]
        GitTree["Atomic Git Tree Mutations"]
        MainBranch["Branch: main (Clean History)"]
        Actions["GitHub Actions CI/CD Pipeline"]
    end

    subgraph Local_Runtime ["Offline Algorithmic Runtime (Docker Sandbox)"]
        Runner["Docker Java 25 Test Harness"]
        Security["UID 10001 · Read-Only Root · Zero Network"]
    end

    UI -->|Edge Navigation & Static Assets| EdgeWorker
    UI -->|RFC 6238 2FA Admin Action| TOTP
    TOTP --> RateLimit
    RateLimit -->|Atomic Blob & Tree Commit| GitTree
    GitTree --> MainBranch
    MainBranch --> Actions
    Monaco -->|Loopback Execution (Local Dev)| Runner
    Runner --> Security
```

---

## 🚀 Key Modules & Capabilities

### 1. Software Architecture & Engineering Knowledge Engine (`/interview`)
- **Canonical Architecture Curriculum:** 538+ rigorously structured interview and system design problems encompassing Java Core Internals, Memory Management, Concurrency & JMM, Spring Boot Architecture, Database Internals, and Distributed Systems.
- **Lightning-Fast Sequential & Token Search:** Instant resolution by numerical index (`#001` – `#538`, `#087`, `87`, `q-087`) with Vietnamese accent-insensitive fuzzy matching and multi-dimensional tagging.
- **Dynamic Vector Architectural Modeling:** High-speed, client-side vector diagram rendering powered by Mermaid ESM with automated light/dark theme synchronization.
- **Hardware-Accelerated Zero-Lag Markdown Editor:** Isolated CSS containment (`contain: content`, `font-variant-ligatures: none`) with non-blocking deferred preview rendering (`useDeferredValue`) eliminating input latency during high-speed typing and text selection.
- **Edge 2FA Administrative Publishing:** Cloudflare Pages Functions powered by Web Crypto API (`SubtleCrypto` HMAC-SHA1) with dual-layer authentication (TOTP Authenticator + PIN) syncing modifications directly to GitHub via atomic multi-blob Git trees.

### 2. Algorithmic Practice Workspace (`/problems`)
- **LeetCode Top Interview 150 Benchmark:** Canonical problem definitions, progressive hints, and multi-tier solutions.
- **Local Isolated Java 25 Sandbox:** Offline-first algorithmic judge executing Java 25 inside unprivileged Docker containers (UID 10001, dropped Linux capabilities, read-only root filesystem, strict memory/CPU limits, zero network egress).
- **Zero Cloud Dependency:** Run and submit code entirely offline without external API latency or remote subscription barriers.

---

## 📂 Repository Structure

```
QuantaVault/
├── .github/
│   └── workflows/
│       ├── web-ci.yml           # Complete automated test, lint, build & Cloudflare deployment
│       └── java-docker.yml      # Containerized Java 25 runner integration test suite
├── data/
│   ├── interview-questions.json # Canonical 538+ architecture question repository
│   └── migration-inventory.json # Problem canonical migration records
├── problems/                    # Canonical LeetCode Top Interview 150 problem definitions
├── raw/                         # Preserved original topic-level problem references
├── schemas/                     # JSON Schemas enforcing content integrity
├── study-plans/                 # Study plan curricula and sequencing rules
├── tests/                       # Python & Java automated validation suites
├── tools/                       # Repository linting, pedagogy auditing, and validation scripts
└── web/                         # Next.js 16 web application
    ├── functions/               # Cloudflare Pages Edge Functions (/api/publish)
    ├── scripts/                 # Static asset preparation and Cloudflare bundling scripts
    └── src/
        ├── app/                 # App Router pages and route handlers
        ├── components/          # Reusable UI primitives and theme providers
        ├── features/            # Modular views (dashboard, practice, interview)
        └── lib/                 # Core utilities, judge harness, and GitHub publish pipeline
```

---

## 🛠️ Local Development & Quick Start

### Prerequisites
- **Node.js:** `>= 20.9.0` (Node 22 recommended)
- **npm:** `^11.0.0`
- **Docker Desktop:** Linux container backend enabled (for local Java code execution)
- **Python:** `3.10+` (for content validation tools)

### 1. Installation
```bash
# Clone the repository
git clone https://github.com/TanBuiDev/QuantaVault.git
cd QuantaVault

# Navigate to web workspace and install dependencies
cd web
npm ci
```

### 2. Local Java Execution Sandbox Setup (Optional for Algorithmic Judge)
```bash
# Build the pinned JDK 25 runner image locally
npm run java:setup

# Run containerized integration tests
npm run test:docker
```

### 3. Launch Development Server
```bash
npm run dev
```
Open [http://127.0.0.1:3000](http://127.0.0.1:3000) to access the platform.

---

## 🧪 Quality Gate & Test Suite

The project enforces strict pre-flight quality standards. Every pull request and push to `main` executes comprehensive validation:

```bash
cd web

# 1. Static code analysis and strict TypeScript linting (Zero error/warning tolerance)
npm run lint

# 2. Complete unit and integration test suite (187 Vitest suites)
npm test

# 3. Production static and Cloudflare Pages bundle build
npm run build:pages

# 4. End-to-end browser automation tests
npx playwright test
```

---

## 🛡️ Security & Integrity Invariants

1. **Edge Identity Verification:** The `/api/publish` endpoint validates credentials via constant-time HMAC comparison and RFC 6238 TOTP algorithms without persisting plaintext credentials.
2. **Atomic Git Transactions:** Content updates generate synchronized Git blobs and tree commits simultaneously for both `data/interview-questions.json` and `web/src/data/interview-questions.json` to guarantee zero state drift.
3. **Execution Sandbox Immutability:** Code execution containers run with `--pull=never`, read-only root, 512 MiB RAM cap, 1 CPU cap, 128 PIDs cap, and 15-second compilation watchdogs.
4. **Git Hygiene:** No private environment variables, credentials, backup artifacts, or temporary logs are ever committed to version control.

---

## 📄 License

This project is licensed under the MIT License.
