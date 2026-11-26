import type { InterviewCategory } from "./types";

export interface InterviewTopicMeta {
  id: string;
  category: InterviewCategory;
  label: string;
  goal: string;
  roadmapOrder: number;
  prerequisites: string[];
  wave: 1 | 2;
}

/**
 * Single source of truth for stable topic IDs and the Fresher -> Junior
 * Java Backend pedagogical roadmap.
 */
export const INTERVIEW_TOPICS: readonly InterviewTopicMeta[] = [
  // Wave 1 — Java Core & OOP (Priority Foundation)
  {
    id: "java-fundamentals",
    category: "java-core",
    label: "Java Fundamentals",
    goal: "Nắm vững JDK/JRE/JVM, kiểu dữ liệu, pass-by-value, static/final, toán tử và luồng điều khiển.",
    roadmapOrder: 1,
    prerequisites: [],
    wave: 1,
  },
  {
    id: "oop-core",
    category: "oop",
    label: "OOP Foundations & 4 Pillars",
    goal: "Giải thích và áp dụng class/object, constructor, encapsulation, abstraction, inheritance và polymorphism.",
    roadmapOrder: 2,
    prerequisites: ["java-fundamentals"],
    wave: 1,
  },
  {
    id: "oop-polymorphism-design",
    category: "oop",
    label: "Interface, Abstract Class & Composition",
    goal: "Phân biệt Abstract Class vs Interface, overloading vs overriding, casting và ưu tiên Composition.",
    roadmapOrder: 3,
    prerequisites: ["oop-core"],
    wave: 1,
  },
  {
    id: "java-string-object",
    category: "java-core",
    label: "String, Object & Immutability",
    goal: "Hiểu String Pool, StringBuilder, hợp đồng equals/hashCode, immutability và shallow/deep copy.",
    roadmapOrder: 4,
    prerequisites: ["java-fundamentals", "oop-core"],
    wave: 1,
  },

  // Wave 2 — Remaining Java, Backend, System Design & Project
  {
    id: "exceptions-handling",
    category: "exceptions",
    label: "Exception Handling",
    goal: "Phân biệt checked/unchecked, try-with-resources, custom exception và thiết kế xử lý lỗi.",
    roadmapOrder: 5,
    prerequisites: ["oop-core"],
    wave: 2,
  },
  {
    id: "collections-generics",
    category: "collections",
    label: "Collections & Generics",
    goal: "Sử dụng đúng List/Set/Map/Queue, cơ chế HashMap, Comparable/Comparator và Generics/PECS.",
    roadmapOrder: 6,
    prerequisites: ["java-string-object"],
    wave: 2,
  },
  {
    id: "streams-lambda",
    category: "streams",
    label: "Lambda, Stream API & Optional",
    goal: "Viết pipeline map/filter/collect/groupingBy, hiểu lazy evaluation và dùng Optional đúng cách.",
    roadmapOrder: 7,
    prerequisites: ["collections-generics"],
    wave: 2,
  },
  {
    id: "modern-java-essentials",
    category: "modern-java",
    label: "Modern Java & Standard Library",
    goal: "Áp dụng Enum, BigDecimal cho tiền tệ, java.time, Record, Sealed Class và var theo Java 17/21.",
    roadmapOrder: 8,
    prerequisites: ["java-string-object"],
    wave: 2,
  },
  {
    id: "jvm-memory",
    category: "jvm",
    label: "JVM & Memory Management",
    goal: "Hiểu Stack/Heap, ClassLoader, JIT, Garbage Collection, Memory Leak và đọc Heap/Thread Dump.",
    roadmapOrder: 9,
    prerequisites: ["java-fundamentals"],
    wave: 2,
  },
  {
    id: "concurrency-core",
    category: "concurrency",
    label: "Multithreading & Concurrency",
    goal: "Hiểu Thread, synchronized, race condition, deadlock, volatile/JMM, ExecutorService và Virtual Thread.",
    roadmapOrder: 10,
    prerequisites: ["jvm-memory"],
    wave: 2,
  },
  {
    id: "live-coding-java",
    category: "live-coding",
    label: "Live Coding — Java & Collections",
    goal: "Giải quyết các bài thao tác String, List, Map, Stream và sắp xếp ngay trong buổi phỏng vấn.",
    roadmapOrder: 11,
    prerequisites: ["collections-generics", "streams-lambda"],
    wave: 2,
  },
  {
    id: "design-patterns-solid",
    category: "design-patterns",
    label: "SOLID & Design Patterns",
    goal: "Áp dụng SOLID và các mẫu Singleton, Factory, Builder, Strategy, Observer, Proxy trong Java.",
    roadmapOrder: 12,
    prerequisites: ["oop-polymorphism-design"],
    wave: 2,
  },
  {
    id: "database-sql-orm",
    category: "database",
    label: "Database, SQL & JPA/Hibernate",
    goal: "Viết SQL JOIN/GROUP BY, hiểu Index, ACID, Transaction Isolation, Lock, JPA N+1 và Dirty Checking.",
    roadmapOrder: 13,
    prerequisites: ["oop-core"],
    wave: 2,
  },
  {
    id: "spring-rest-api",
    category: "spring",
    label: "Spring Framework & REST API",
    goal: "Nắm IoC/DI, Bean Lifecycle, Spring Boot, MVC, REST API, Validation, AOP và @Transactional.",
    roadmapOrder: 14,
    prerequisites: ["database-sql-orm", "exceptions-handling"],
    wave: 2,
  },
  {
    id: "security-web-auth",
    category: "security-auth",
    label: "Security, JWT & OAuth 2.0",
    goal: "Phân biệt AuthN/AuthZ, băm mật khẩu, JWT, OAuth2/OIDC, CSRF/XSS và bảo mật API.",
    roadmapOrder: 15,
    prerequisites: ["spring-rest-api"],
    wave: 2,
  },
  {
    id: "testing-quality",
    category: "testing",
    label: "Unit & Integration Testing",
    goal: "Viết Unit Test với JUnit 5, Mockito, Testcontainers và thiết kế test đáng tin cậy.",
    roadmapOrder: 16,
    prerequisites: ["spring-rest-api"],
    wave: 2,
  },
  {
    id: "devops-cicd",
    category: "testing-devops",
    label: "Git, Docker & CI/CD",
    goal: "Sử dụng Git, Linux, Docker multi-stage, biến môi trường và quy trình CI/CD cơ bản.",
    roadmapOrder: 17,
    prerequisites: ["spring-rest-api"],
    wave: 2,
  },
  {
    id: "troubleshooting-rca",
    category: "troubleshooting",
    label: "Debugging, Observability & RCA",
    goal: "Đọc log/metrics/traces và thực hiện Root Cause Analysis khi hệ thống backend gặp sự cố.",
    roadmapOrder: 18,
    prerequisites: ["spring-rest-api", "jvm-memory"],
    wave: 2,
  },
  {
    id: "live-coding-backend",
    category: "live-coding",
    label: "Live Coding — Spring, SQL & Test",
    goal: "Thực hành viết REST Controller, Service validation, truy vấn SQL và Unit Test nghiệp vụ.",
    roadmapOrder: 19,
    prerequisites: ["spring-rest-api", "database-sql-orm", "testing-quality"],
    wave: 2,
  },
  {
    id: "system-design-distributed",
    category: "microservices",
    label: "System Design & Distributed Systems",
    goal: "Hiểu Caching/Redis, Idempotency, Rate Limiting, Message Queue, Outbox và Saga.",
    roadmapOrder: 20,
    prerequisites: ["spring-rest-api", "database-sql-orm"],
    wave: 2,
  },
  {
    id: "project-covie-defense",
    category: "project-covie",
    label: "Bảo vệ Dự án CoVie",
    goal: "Trình bày kiến trúc, nghiệp vụ, đánh đổi kỹ thuật và bằng chứng thực tế trong CoVie.",
    roadmapOrder: 21,
    prerequisites: ["spring-rest-api", "database-sql-orm", "security-web-auth"],
    wave: 2,
  },
  {
    id: "career-interview-prep",
    category: "career-interview",
    label: "Phỏng vấn Nghề nghiệp & Hành vi",
    goal: "Trả lời câu hỏi giới thiệu bản thân, động lực Fresher, teamwork và xử lý tình huống.",
    roadmapOrder: 22,
    prerequisites: [],
    wave: 2,
  },
] as const;

export const INTERVIEW_TOPIC_MAP: Readonly<Record<string, InterviewTopicMeta>> = Object.fromEntries(
  INTERVIEW_TOPICS.map((t) => [t.id, t]),
);

export function getTopicMeta(topicId?: string): InterviewTopicMeta | undefined {
  return topicId ? INTERVIEW_TOPIC_MAP[topicId] : undefined;
}

export function getTopicsByCategory(category: InterviewCategory | "all"): InterviewTopicMeta[] {
  if (category === "all") return [...INTERVIEW_TOPICS];
  return INTERVIEW_TOPICS.filter((t) => t.category === category);
}

/**
 * Related categories surfaced when viewing a legacy category that was split into finer-grained domains.
 */
export const SPLIT_CATEGORY_GUIDANCE: Partial<Record<InterviewCategory, { note: string; related: InterviewCategory[] }>> = {
  "java-core": {
    note: "OOP đã được tách sang danh mục riêng; Modern Java và Live Coding cũng có mục riêng.",
    related: ["oop", "modern-java", "live-coding"],
  },
  "design-patterns": {
    note: "Các câu OOP cơ bản đã được chuyển sang danh mục OOP.",
    related: ["oop"],
  },
  collections: {
    note: "Các câu Lambda, Stream API và Optional thuộc danh mục Lambda & Stream API.",
    related: ["streams"],
  },
  jvm: {
    note: "Các câu Exception Handling đã được tách sang danh mục riêng.",
    related: ["exceptions"],
  },
  "testing-devops": {
    note: "Testing và Troubleshooting/RCA đã được tách thành danh mục riêng.",
    related: ["testing", "troubleshooting"],
  },
};
