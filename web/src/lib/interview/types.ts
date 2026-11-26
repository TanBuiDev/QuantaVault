export type InterviewCategory =
  | "java-core"
  | "oop"
  | "design-patterns"
  | "exceptions"
  | "collections"
  | "streams"
  | "jvm"
  | "concurrency"
  | "modern-java"
  | "live-coding"
  | "spring"
  | "security-auth"
  | "database"
  | "microservices"
  | "testing"
  | "testing-devops"
  | "troubleshooting"
  | "project-covie"
  | "career-interview";

export type InterviewDifficulty = "fresher" | "junior" | "middle" | "senior";

export type InterviewPriority = "p1" | "p2" | "p3";

export type InterviewStatus = "not_started" | "learned" | "review";

export interface InterviewQuestion {
  id: string;
  title: string;
  category: InterviewCategory;
  topicId?: string;
  difficulty: InterviewDifficulty;
  priority?: InterviewPriority;
  learningOrder?: number;
  tags: string[];
  companies?: string[];
  summary: string;
  answerMarkdown: string;
  keyTakeaways?: string[];
  relatedProblems?: number[];
}

export interface InterviewCategoryMeta {
  id: InterviewCategory;
  label: string;
  description: string;
}

export const INTERVIEW_CATEGORIES: Record<InterviewCategory, InterviewCategoryMeta> = {
  "java-core": {
    id: "java-core",
    label: "Java Core",
    description: "Nền tảng Java, kiểu dữ liệu, pass-by-value, static/final, String Pool, equals/hashCode, Immutability",
  },
  oop: {
    id: "oop",
    label: "OOP",
    description: "Class/Object, Constructor, 4 trụ cột OOP, Overloading/Overriding, Abstract Class vs Interface, Composition",
  },
  "design-patterns": {
    id: "design-patterns",
    label: "SOLID & Design Patterns",
    description: "SOLID, Coupling/Cohesion, Singleton, Factory, Builder, Strategy, Observer, Proxy, Clean Architecture",
  },
  exceptions: {
    id: "exceptions",
    label: "Exception Handling",
    description: "Exception hierarchy, checked/unchecked, try-with-resources, custom exceptions, error handling",
  },
  collections: {
    id: "collections",
    label: "Collections & Generics",
    description: "List, Set, Map, Queue, HashMap internals, Comparable/Comparator, Generics & PECS",
  },
  streams: {
    id: "streams",
    label: "Lambda & Stream API",
    description: "Functional interfaces, lambda, method reference, stream pipeline, collectors, Optional",
  },
  jvm: {
    id: "jvm",
    label: "JVM & Memory",
    description: "Stack, Heap, Metaspace, ClassLoader, JIT, Garbage Collection (G1, ZGC), Heap/Thread Dump",
  },
  concurrency: {
    id: "concurrency",
    label: "Multithreading & Concurrency",
    description: "Thread, volatile, JMM, synchronized, Deadlock, ExecutorService, CompletableFuture, Virtual Thread",
  },
  "modern-java": {
    id: "modern-java",
    label: "Modern Java",
    description: "Enum, Record, Sealed Class, var, Pattern Matching, java.time, BigDecimal",
  },
  "live-coding": {
    id: "live-coding",
    label: "Live Coding",
    description: "Bài viết code Java, Stream, Spring REST/Service, SQL và Unit Test thực chiến",
  },
  spring: {
    id: "spring",
    label: "Spring Framework & REST",
    description: "IoC, DI, Bean Lifecycle, Spring MVC, REST API Design, Validation, AOP Proxy, @Transactional",
  },
  "security-auth": {
    id: "security-auth",
    label: "Security & Auth",
    description: "Spring Security, BCrypt, Argon2, JWT, Cookie HttpOnly/SameSite, Google OAuth 2.0, CSRF/XSS",
  },
  database: {
    id: "database",
    label: "Database, SQL & ORM",
    description: "SQL, Indexing B-Tree, ACID, Isolation, Locks, Spring Data JPA, Dirty Checking, N+1 Query",
  },
  microservices: {
    id: "microservices",
    label: "System Design & Distributed",
    description: "Redis, Caching, Rate Limiting, Idempotency, Message Queue, Kafka, Outbox Pattern, Saga",
  },
  testing: {
    id: "testing",
    label: "Testing",
    description: "Unit Test, Integration Test, JUnit 5, Mockito, Testcontainers, Test Strategy",
  },
  "testing-devops": {
    id: "testing-devops",
    label: "DevOps & CI/CD",
    description: "Git, Docker Multi-stage, Linux, Nginx, Environment Config, GitHub Actions CI/CD",
  },
  troubleshooting: {
    id: "troubleshooting",
    label: "Debugging & Observability",
    description: "Logs, Metrics, Traces, Prometheus, Grafana, Root Cause Analysis (RCA), Production Debug",
  },
  "project-covie": {
    id: "project-covie",
    label: "Bảo vệ Dự án CoVie",
    description: "Kiến trúc Modular Monolith, Checkout Commit, Inventory Reservation, PostGIS, S3 Presigned URL",
  },
  "career-interview": {
    id: "career-interview",
    label: "Phỏng vấn Nghề nghiệp",
    description: "Giới thiệu bản thân, động lực Fresher, teamwork, đánh đổi và định hướng nghề nghiệp",
  },
};

export interface InterviewFilterState {
  search: string;
  category: InterviewCategory | "all";
  topic?: string | "all";
  difficulty: InterviewDifficulty | "all";
  priority?: InterviewPriority | "all";
  status: InterviewStatus | "bookmarked" | "all";
  company: string | "all";
}

export interface InterviewProgressState {
  learned: Record<string, boolean>;
  review: Record<string, boolean>;
  bookmarks: Record<string, boolean>;
}

/**
 * Định dạng số thứ tự câu hỏi trực quan (#001, #002 ... #1000)
 */
export function formatQuestionNumber(num: number, totalQuestions = 0): string {
  const minDigits = totalQuestions >= 1000 ? 4 : 3;
  return `#${String(num).padStart(minDigits, "0")}`;
}

/**
 * Định dạng mã kỹ thuật (vd: "q-001" -> "#001") để hiển thị đẹp trên giao diện
 */
export function formatQuestionBadge(id: string): string {
  // Only a complete canonical numeric ID is a badge. Draft IDs remain explicit.
  const match = /^q-(\d+)$/i.exec(id);
  if (match) return `#${match[1].padStart(3, "0")}`;
  return id || "Chưa có ID";
}
