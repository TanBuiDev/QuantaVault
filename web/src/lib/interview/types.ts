export type InterviewCategory =
  | "java-core"
  | "collections"
  | "concurrency"
  | "jvm"
  | "spring"
  | "security-auth"
  | "database"
  | "design-patterns"
  | "microservices"
  | "testing-devops"
  | "project-covie";

export type InterviewDifficulty = "junior" | "middle" | "senior";

export type InterviewStatus = "not_started" | "learned" | "review";

export interface InterviewQuestion {
  id: string;
  title: string;
  category: InterviewCategory;
  difficulty: InterviewDifficulty;
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
    label: "Java Core & OOP",
    description: "Nền tảng Java, 4 Trụ Cột OOP, String Pool, Equals/HashCode, Record, Live Coding",
  },
  collections: {
    id: "collections",
    label: "Collections & Stream API",
    description: "HashMap, ArrayList, Set, TreeMap, Stream API, Lambda, Optional",
  },
  concurrency: {
    id: "concurrency",
    label: "Đa luồng (Concurrency)",
    description: "Thread, volatile, synchronized, Deadlock, Virtual Thread, Race Condition, Chống Overselling",
  },
  jvm: {
    id: "jvm",
    label: "JVM & Quản lý bộ nhớ",
    description: "Heap, Stack, Metaspace, Garbage Collection (G1, ZGC), OutOfMemoryError, Thread/Heap Dump",
  },
  spring: {
    id: "spring",
    label: "Spring Framework & REST API",
    description: "IoC, DI, Bean Lifecycle, Spring MVC, REST API Design, AOP Proxy, @Transactional",
  },
  "security-auth": {
    id: "security-auth",
    label: "Bảo mật, JWT & OAuth 2.0",
    description: "Spring Security, BCrypt, Argon2, JWT (RS256/HS256), Cookie HttpOnly/SameSite, Google OAuth, CSRF/XSS",
  },
  database: {
    id: "database",
    label: "JPA, Hibernate & SQL",
    description: "Spring Data JPA, Dirty Checking, Lazy Loading, N+1 Query, PostgreSQL, Indexing B-Tree, ACID, Locks",
  },
  "design-patterns": {
    id: "design-patterns",
    label: "Design Patterns & Kiến trúc",
    description: "SOLID, Singleton, Factory, Builder, Strategy, Observer, Proxy, Clean & Hexagonal Architecture",
  },
  microservices: {
    id: "microservices",
    label: "System Design & Distributed Systems",
    description: "Redis, Caching, Token Bucket Rate Limiting, Message Queue, Kafka, Outbox Pattern, Saga",
  },
  "testing-devops": {
    id: "testing-devops",
    label: "Testing & DevOps / CI/CD",
    description: "JUnit 5, Mockito, Testcontainers, Docker Multi-stage, Linux, Nginx, Prometheus, Grafana, GitHub Actions",
  },
  "project-covie": {
    id: "project-covie",
    label: "Bảo vệ Dự án CoVie (Thực chiến)",
    description: "Kiến trúc Modular Monolith, Checkout Commit, Inventory Reservation, PostGIS, S3 Presigned URL, Ads & Moderation",
  },
};

export interface InterviewFilterState {
  search: string;
  category: InterviewCategory | "all";
  difficulty: InterviewDifficulty | "all";
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
export function formatQuestionNumber(num: number, totalQuestions = 538): string {
  const minDigits = totalQuestions >= 1000 ? 4 : 3;
  return `#${String(num).padStart(minDigits, "0")}`;
}

/**
 * Định dạng mã kỹ thuật (vd: "q-001" -> "#001") để hiển thị đẹp trên giao diện
 */
export function formatQuestionBadge(id: string, totalQuestions = 538): string {
  const match = id.match(/q-(\d+)/);
  if (match) {
    return formatQuestionNumber(Number(match[1]), totalQuestions);
  }
  return id;
}

