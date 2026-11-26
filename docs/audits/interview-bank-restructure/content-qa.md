# Content QA & Verification Report

## Wave 1 — Java Core & OOP (2026-11-26)

### 1. Summary of Changes
- **Audited & Standardized:** 46 questions across `java-core` (24 questions: 16 `java-fundamentals` + 8 `java-string-object`) and `oop` (22 questions: 10 `oop-core` + 12 `oop-polymorphism-design`).
- **Merged / Retired:** `q-068` merged into `q-067` (editorial note removed from title; `IService` over-abstraction guidance preserved in `q-067`; `q-068` added to `retiredInterviewIds.json` and archived in `dedup-and-id-map.json`).
- **Added P1 Gap Coverage:**
  - `q-540`: 4 Access Modifiers (`public`, `protected`, package-private, `private`) & override visibility rules.
  - `q-541`: Java Arrays vs `ArrayList`, `.length` vs `.length()` vs `.size()`, and numeric promotion / `int` overflow.
  - `q-542`: `this` and `super` keywords & constructor chaining (`this(...)`, `super(...)`).
- **Reclassified Out of `java-core` (for Wave 2 Audit):**
  - `q-097`, `q-099`, `q-101`, `q-102`, `q-104`, `q-105`, `q-106` → `modern-java`
  - `q-518`..`q-530` → `live-coding`
  - `q-531` → `microservices`
  - `q-537` → `career-interview`
  - `q-538` → `troubleshooting`

### 2. Technical & Code Verification
- **Java Runtime Verification:** Compiled and executed `Wave1Verify.java` on OpenJDK `25.0.4.1` (`javac` + `java` → `WAVE1_JAVA_VERIFY_OK`) verifying:
  - `q-541` (`int` overflow vs `(long)` promotion)
  - `q-542` (`this(...)` / `super(...)` / `super.describe()`)
  - `q-096` (Immutable `MoneyOrder` with `List.copyOf` defensive copy)
  - `q-088` (`StringBuilder` loop concatenation)
  - `q-075` / `q-076` (Upcasting & Java 16+ pattern matching `instanceof`)
  - `q-073` (Static method hiding vs runtime overriding)
- **CoVie Source Verification (`E:\WebApp\CoVie`):**
  - Verified `CartCheckoutCandidateResolver` (`vn.covie.checkout.application`) and `CatalogPublishPolicy` (`vn.covie.catalog.policy`) exist in `E:\WebApp\CoVie\apps\api\src\main\java\vn\covie\`.
