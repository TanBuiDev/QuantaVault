# Ma trận Coverage P1 & Mở rộng — Fresher → Junior Java Backend

Tài liệu đối chiếu các mục tiêu bắt buộc (P1) theo từng mảng kiến thức với ID câu hỏi canonical trong `data/interview-questions.json` (tổng 508 câu, trong đó 193 câu P1).

| Mảng | Topic ID | Mục tiêu P1 bắt buộc | IDs tiêu biểu (Verified) | Trạng thái |
|---|---|---|---|---|
| Java Fundamentals | `java-fundamentals` | compile/run, JDK/JRE/JVM, bytecode, primitive/reference, wrapper/autoboxing, pass-by-value, static/final, access modifiers, array & overflow, `==` vs `equals`, `&&` vs `&`, control flow | `q-041`, `q-042`, `q-044`, `q-045`, `q-046`, `q-049`, `q-050`, `q-051`, `q-052`, `q-053`, `q-054`, `q-055`, `q-056`, `q-540`, `q-541` | ✅ Đạt (100% P1) |
| OOP | `oop-core`, `oop-polymorphism-design` | class/object/constructor, `this`/`super`, 4 trụ cột OOP, overloading/overriding, dynamic dispatch, abstract class vs interface, casting/`instanceof`, composition | `q-057`, `q-058`, `q-060`, `q-061`..`q-067`, `q-075`, `q-076`, `q-077`, `q-542` | ✅ Đạt (100% P1) |
| String / Object | `java-string-object` | String immutability, String Pool, StringBuilder/StringBuffer, `equals`/`hashCode`, `toString`, mutable vs immutable, defensive/shallow/deep copy | `q-087`, `q-088`, `q-089`, `q-091`, `q-093`, `q-094`, `q-095`, `q-096` | ✅ Đạt (100% P1) |
| Exception Handling | `exceptions-handling` | checked/unchecked, Error vs Exception, `throw`/`throws`, `finally`, try-with-resources, custom exception, tránh `catch(Exception)` | `q-149`..`q-155` | ✅ Đạt (100% P1) |
| Collections & Generics | `collections-generics` | List/Set/Map/Queue, Array vs ArrayList, HashMap/HashSet, Comparable/Comparator, Iterator, Generics, Big O | `q-107`..`q-112`, `q-116`, `q-118`, `q-119`, `q-123`, `q-126`, `q-127` | ✅ Đạt (100% P1) |
| Lambda & Stream | `streams-lambda` | functional interface, lambda, stream vs collection, lazy eval, filter/map/collect/toList, Optional an toàn | `q-129`, `q-130`, `q-132`, `q-134`, `q-135`, `q-137`, `q-139`, `q-143`, `q-144`, `q-145` | ✅ Đạt (100% P1) |
| Modern Java | `modern-java-essentials` | Enum, BigDecimal cho tiền, `java.time` (P1); Record, Sealed, `var`, Pattern Matching (P2) | `q-097`, `q-105`, `q-106` (P1); `q-099`, `q-101`..`q-104` (P2) | ✅ Đạt (100% P1) |
| JVM & Memory | `jvm-memory` | Stack/Heap, object allocation, GC cơ bản, StackOverflowError, OutOfMemoryError (P1); ClassLoader, JIT, Heap/Thread dump (P2/P3) | `q-156`..`q-158`, `q-160`, `q-161` | ✅ Đạt (100% P1) |
| Concurrency | `concurrency-core` | process/thread, tạo Thread, Runnable/Callable, start/run, synchronized, race condition, deadlock, thread-safety | `q-169`..`q-172`, `q-174`..`q-177`, `q-180` | ✅ Đạt (100% P1) |
| Spring & REST | `spring-rest-api` | IoC/DI, Constructor Injection, Bean/Component/Service/Repo, Spring Boot, HTTP methods/status, binding/validation, `@ControllerAdvice`, CORS | `q-191`..`q-193`, `q-195`, `q-196`, `q-199`, `q-201`, `q-202`, `q-205`, `q-209`..`q-211`, `q-214`..`q-216`, `q-218`..`q-222`, `q-227`, `q-231` | ✅ Đạt (100% P1) |
| Database & ORM | `database-sql-orm` | SQL JOIN/GROUP BY, keys/constraints, index, ACID, JPA entity/mapping, N+1 cơ bản | `q-269`..`q-277`, `q-283`..`q-285`, `q-295`..`q-302` | ✅ Đạt (100% P1) |
| Security | `security-web-auth` | AuthN/AuthZ, Spring Security chain, password hashing/BCrypt, RBAC/`@PreAuthorize`, JWT & OWASP | `q-232`, `q-233`, `q-235`, `q-240`..`q-242`, `q-244`, `q-245`, `q-247` | ✅ Đạt (100% P1) |
| Testing & DevOps | `testing-quality`, `devops-cicd`, `troubleshooting-rca` | Unit vs Integration, Testing Pyramid, JUnit 5, Mockito, Docker, Env/Secrets, Maven, Git, CI/CD, Actuator/Logs/RCA | `q-465`..`q-474`, `q-485`..`q-487`, `q-490`..`q-495`, `q-498`..`q-500`, `q-502`, `q-506`, `q-538` | ✅ Đạt (100% P1) |
| System Design | `system-design-distributed` | Idempotency, Caching/Redis, Rate limiting, Reliability/Outbox/Saga (P2/P3) | `q-531` (P1); `q-417`, `q-422`, `q-444`.. (P2/P3) | ✅ Đạt (100% P1) |
| Project & Career | `project-covie-defense`, `career-interview-prep` | Giới thiệu bản thân, CoVie overview/stack/architecture/API/DTO, teamwork & xử lý bug | `q-001`, `q-003`, `q-007`..`q-014`, `q-017`, `q-021`, `q-022`, `q-025`..`q-028`, `q-537`, `q-543`, `q-544` | ✅ Đạt (100% P1) |
| Live Coding | `live-coding-java`, `live-coding-backend` | String, List, Map, Stream, Spring REST/Service, SQL, Unit Test | `q-518`..`q-530` | ✅ Đạt (100% P1) |

> **Lưu ý:** Một số mục tiêu P2/P3 nâng cao (như Virtual Threads, Distributed Tracing/Jaeger, Saga) được gắn đúng nhãn `p2`/`p3` để người học Fresher không bị quá tải khi lọc `P1`.
