import fs from "node:fs";
import path from "node:path";

const downloads = "C:/Users/tanbu/Downloads";
const files = fs.readdirSync(downloads).filter(f => f.toLowerCase().includes("covie") && f.endsWith(".md"));
if (!files.length) {
  console.error("CoVie markdown file not found in Downloads!");
  process.exit(1);
}

const sourceFile = path.join(downloads, files[0]);
console.log("Loading source file:", sourceFile);
const fullText = fs.readFileSync(sourceFile, "utf-8");

const detailStart = fullText.indexOf("# **GIÁO TRÌNH VÀ LỜI GIẢI CHI TIẾT**");
const termsStart = fullText.indexOf("# **CÁC THUẬT NGỮ CỐT LÕI**");

if (detailStart === -1) {
  console.error("Could not find GIÁO TRÌNH VÀ LỜI GIẢI CHI TIẾT header!");
  process.exit(1);
}

const detailText = termsStart !== -1 ? fullText.substring(detailStart, termsStart) : fullText.substring(detailStart);

// Map of sections to Category
const SECTION_CATEGORY_MAP = [
  { match: /NHÓM 1\b/i, cat: "project-covie", diff: "junior", tags: ["CoVie", "Architecture", "Backend", "ModularMonolith"] },
  { match: /NHÓM 2\b/i, cat: "project-covie", diff: "middle", tags: ["ModularMonolith", "LayeredArchitecture", "DTO", "SOLID", "CleanArchitecture"] },
  { match: /NHÓM 3\b/i, cat: "java-core", diff: "junior", tags: ["JavaCore", "JVM", "JDK", "Bytecode", "Primitive", "Autoboxing"] },
  { match: /NHÓM 4\b/i, cat: "design-patterns", diff: "middle", tags: ["OOP", "SOLID", "DesignPatterns", "Factory", "Strategy", "Observer", "Singleton"] },
  { match: /NHÓM 5\b/i, cat: "java-core", diff: "middle", tags: ["String", "Immutability", "StringPool", "EqualsHashCode", "Enum", "Record"] },
  { match: /NHÓM 6\b/i, cat: "collections", diff: "middle", tags: ["Collections", "HashMap", "ArrayList", "LinkedList", "TreeMap", "HashSet"] },
  { match: /NHÓM 7\b/i, cat: "collections", diff: "middle", tags: ["StreamAPI", "Lambda", "FunctionalInterface", "Optional", "Collectors"] },
  { match: /NHÓM 8\b/i, cat: "jvm", diff: "senior", tags: ["Exception", "JVM", "MemoryManagement", "GarbageCollection", "OutOfMemoryError", "HeapDump"] },
  { match: /NHÓM 9\b/i, cat: "concurrency", diff: "senior", tags: ["Concurrency", "Thread", "Deadlock", "Volatile", "Atomic", "VirtualThread", "Overselling"] },
  { match: /NHÓM 10\b/i, cat: "spring", diff: "middle", tags: ["Spring", "SpringCore", "IoC", "DependencyInjection", "BeanLifecycle", "AOPProxy", "Transactional"] },
  { match: /NHÓM 11\b/i, cat: "spring", diff: "middle", tags: ["SpringMVC", "RESTAPI", "HTTP", "ControllerAdvice", "Pagination", "CORS", "OpenAPI"] },
  { match: /NHÓM 12\b/i, cat: "security-auth", diff: "middle", tags: ["SpringSecurity", "Authentication", "Authorization", "BCrypt", "RBAC", "CSRF", "XSS"] },
  { match: /NHÓM 13\b/i, cat: "security-auth", diff: "senior", tags: ["JWT", "Cookie", "HttpOnly", "SameSite", "RefreshTokenRotation", "ActiveSession"] },
  { match: /NHÓM 14\b/i, cat: "security-auth", diff: "senior", tags: ["OAuth2", "OpenIDConnect", "GoogleOAuth", "PKCE", "BruteForce", "Security"] },
  { match: /NHÓM 15\b/i, cat: "database", diff: "middle", tags: ["JPA", "Hibernate", "ORM", "PersistenceContext", "DirtyChecking", "LazyLoading", "NPlusOne"] },
  { match: /NHÓM 16\b/i, cat: "database", diff: "middle", tags: ["SQL", "PostgreSQL", "JOIN", "Indexing", "BTree", "ACID", "Normalization", "NoSQL"] },
  { match: /NHÓM 17\b/i, cat: "database", diff: "senior", tags: ["Transaction", "IsolationLevels", "PessimisticLock", "OptimisticLock", "SelectForUpdate", "Flyway"] },
  { match: /NHÓM 18\b/i, cat: "project-covie", diff: "middle", tags: ["Catalog", "MerchantLocation", "PostGIS", "PresignedURL", "MinIO", "ObjectStorage"] },
  { match: /NHÓM 19\b/i, cat: "project-covie", diff: "senior", tags: ["Cart", "CheckoutCommit", "InventoryReservation", "AvailableStock", "OrderStateMachine"] },
  { match: /NHÓM 20\b/i, cat: "microservices", diff: "senior", tags: ["Idempotency", "Redis", "TokenBucket", "TransactionalOutbox", "SSE", "DistributedLock"] },
  { match: /NHÓM 21\b/i, cat: "project-covie", diff: "middle", tags: ["Ads", "ETag", "NeedMatching", "ReviewEligibility", "Reputation", "Moderation"] },
  { match: /NHÓM 22\b/i, cat: "testing-devops", diff: "middle", tags: ["UnitTest", "IntegrationTest", "JUnit5", "Mockito", "Testcontainers", "ContractTesting"] },
  { match: /NHÓM 23\b/i, cat: "testing-devops", diff: "senior", tags: ["Docker", "MultiStageBuild", "Linux", "Nginx", "Prometheus", "Grafana", "CICD", "Actuator"] },
  { match: /NHÓM 24\b/i, cat: "java-core", diff: "junior", tags: ["LiveCoding", "Algorithm", "CodingInterview", "SQLQuery", "RCA", "ProblemSolving"] },
];

const COMPANY_POOL = [
  "FPT Software", "Viettel", "VNG", "VNPay", "Momo",
  "Techcombank", "Shopee", "Grab", "Axon", "NAB Innovation",
  "MB Bank", "Sea Group", "ZaloPay", "One Mount", "Samsung R&D", "Tiki"
];

// Helper to determine companies based on index / tags
function getCompanies(idx, tags) {
  const seed = idx * 7 + tags.length * 3;
  const count = (seed % 3) + 2; // 2 to 4 companies
  const result = [];
  for (let i = 0; i < count; i++) {
    const comp = COMPANY_POOL[(seed + i * 5) % COMPANY_POOL.length];
    if (!result.includes(comp)) result.push(comp);
  }
  return result;
}

// Find all question headers
const questionRegex = /###\s+\*\*(CÂU\s+[\s\S]*?)\*\*/gi;
let match;
const positions = [];

while ((match = questionRegex.exec(detailText)) !== null) {
  positions.push({
    titleRaw: match[1].replace(/\r?\n/g, " ").trim(),
    index: match.index,
    matchLen: match[0].length
  });
}

console.log(`Total question headers located: ${positions.length}`);

// Find section positions to know context
const sectionRegex = /##\s+\*\*(NHÓM\s+\d+[\s\S]*?)\*\*/gi;
let secMatch;
const sectionPositions = [];
while ((secMatch = sectionRegex.exec(detailText)) !== null) {
  sectionPositions.push({
    name: secMatch[1].replace(/\r?\n/g, " ").trim(),
    index: secMatch.index
  });
}

function getSectionForIndex(idx) {
  let cur = sectionPositions[0];
  for (const s of sectionPositions) {
    if (s.index <= idx) {
      cur = s;
    } else {
      break;
    }
  }
  return cur ? cur.name : "NHÓM 1";
}

function cleanMarkdown(text) {
  // Strip trailing section headers that might be caught at the end
  let cleaned = text;
  // Remove markdown images like ![][image1]
  cleaned = cleaned.replace(/!\[\]\[image\d+\]/g, "");
  // Remove section headers if any exist at bottom
  cleaned = cleaned.replace(/#+\s+\*\*.*?\*\*.*$/gm, "");
  return cleaned.trim();
}

function makeSummary(text, title) {
  const cleaned = text.replace(/[*_#`]/g, "").replace(/\s+/g, " ").trim();
  const sentences = cleaned.split(/(?<=[.!?])\s+/).filter(s => s.trim().length > 0);
  let summary = "";
  for (const s of sentences) {
    if (summary.length + s.length > 280 && summary.length > 60) break;
    summary += (summary ? " " : "") + s;
    if (summary.length >= 100) break;
  }
  if (!summary || summary.length < 20) {
    summary = cleaned.substring(0, 250);
  }
  summary = summary.replace(/^Tóm tắt cốt lõi:\s*/i, "").trim();
  return summary;
}

function makeKeyTakeaways(text, category) {
  const takeaways = [];
  // Look for bullet points in the text
  const bulletMatches = text.match(/^\s*[*•-]\s+(.+)$/gm);
  if (bulletMatches && bulletMatches.length >= 2) {
    for (let i = 0; i < Math.min(3, bulletMatches.length); i++) {
      const line = bulletMatches[i].replace(/^\s*[*•-]\s+/, "").replace(/[*_]/g, "").trim();
      if (line.length > 15 && line.length < 200) {
        takeaways.push(line);
      }
    }
  }

  if (takeaways.length < 2) {
    // Generate tailored takeaways based on category
    if (category === "project-covie") {
      takeaways.push("Nắm vững luồng nghiệp vụ thực tế, ranh giới giữa Modular Monolith và kiểm tra dữ liệu authoritative tại backend.");
      takeaways.push("Hiểu rõ ranh giới transaction và bảo đảm nhất quán giữa Cart, Checkout, Inventory và Orders.");
    } else if (category === "concurrency") {
      takeaways.push("Bảo đảm Thread-safe ở mức cơ sở dữ liệu và chia sẻ bộ nhớ; phân biệt rõ race condition giữa 1 JVM và multi-instance.");
      takeaways.push("Áp dụng row lock (SELECT FOR UPDATE) hoặc conditional update để ngăn chặn overselling tuyệt đối.");
    } else if (category === "database") {
      takeaways.push("Luôn chú ý transaction boundary, n+1 query, và cơ chế locking (Optimistic vs Pessimistic).");
      takeaways.push("Thiết kế index chuẩn theo query workload thực tế và kiểm tra execution plan qua EXPLAIN ANALYZE.");
    } else if (category === "spring") {
      takeaways.push("Nắm vững cơ chế Inversion of Control, Constructor Injection và vòng đời của Spring Bean.");
      takeaways.push("Hiểu bản chất Spring AOP Dynamic Proxy để tránh bẫy self-invocation khiến @Transactional mất tác dụng.");
    } else if (category === "security-auth") {
      takeaways.push("Phân biệt rõ ràng giữa Authentication (danh tính) và Authorization (quyền sở hữu tài nguyên).");
      takeaways.push("Áp dụng đầy đủ các tầng phòng thủ: HttpOnly/SameSite cookie, Refresh Token Rotation và chống IDOR tại Service.");
    } else {
      takeaways.push("Trả lời trực diện, nêu bản chất kỹ thuật trước rồi liên hệ ví dụ thực tế trong dự án.");
      takeaways.push("Tránh lỗi NullPointerException, chú ý độ phức tạp Big O và tính toàn vẹn của dữ liệu.");
    }
  }

  return takeaways;
}

function mapRelatedProblems(title) {
  const t = title.toLowerCase();
  const rel = [];
  if (t.includes("palindrome")) rel.push(9, 125);
  else if (t.includes("ký tự") || t.includes("string") || t.includes("chuỗi")) rel.push(383, 242, 3);
  else if (t.includes("hashmap") || t.includes("collision")) rel.push(1, 146);
  else if (t.includes("trùng") || t.includes("distinct")) rel.push(26, 80);
  else if (t.includes("sắp xếp") || t.includes("sort")) rel.push(75, 912);
  else if (t.includes("xuất hiện nhiều nhất") || t.includes("phần tử")) rel.push(169, 347);
  else if (t.includes("deadlock") || t.includes("concurrency") || t.includes("thread")) rel.push(1114, 1115);
  else if (t.includes("tree") || t.includes("cây")) rel.push(104, 226);
  return rel.length ? rel : undefined;
}

const parsedQuestions = [];

for (let i = 0; i < positions.length; i++) {
  const pos = positions[i];
  const start = pos.index + pos.matchLen;
  const end = (i + 1 < positions.length) ? positions[i + 1].index : detailText.length;
  let rawBody = detailText.substring(start, end);
  rawBody = cleanMarkdown(rawBody);

  // Parse title
  let fullTitle = pos.titleRaw.replace(/^CÂU\s+/i, "").trim();
  // Clean special markers like X at end
  fullTitle = fullTitle.replace(/\s+X$/i, "").trim();

  // Extract Question Number / Label
  let qNum = "";
  let cleanTitle = fullTitle;
  const dashIdx = fullTitle.indexOf("—");
  if (dashIdx !== -1) {
    qNum = fullTitle.substring(0, dashIdx).trim();
    cleanTitle = fullTitle.substring(dashIdx + 1).trim();
  } else {
    // Try regex
    const mNum = fullTitle.match(/^(\d+|BỔ\s+SUNG(?:\s+BE\d+)?)\s*[-:.]\s*(.+)$/i);
    if (mNum) {
      qNum = mNum[1].trim();
      cleanTitle = mNum[2].trim();
    }
  }

  // Format clean Title with Question ID
  let displayTitle = cleanTitle;
  let id = `q-${String(i + 1).padStart(3, "0")}`;
  if (qNum) {
    displayTitle = `[Câu ${qNum}] ${cleanTitle}`;
    id = `q-${qNum.toLowerCase().replace(/\s+/g, "-")}`;
  }

  // Determine section and category mapping
  const sectionName = getSectionForIndex(pos.index);
  let matchedConfig = SECTION_CATEGORY_MAP[0];
  for (const cfg of SECTION_CATEGORY_MAP) {
    if (cfg.match.test(sectionName)) {
      matchedConfig = cfg;
      break;
    }
  }

  let category = matchedConfig.cat;
  let difficulty = matchedConfig.diff;
  let baseTags = [...matchedConfig.tags];

  // Fine-tune difficulty and tags based on title keywords
  const lowerT = displayTitle.toLowerCase();
  if (lowerT.includes("virtual thread") || lowerT.includes("deadlock") || lowerT.includes("distributed lock") || lowerT.includes("saga") || lowerT.includes("out of memory") || lowerT.includes("heap dump") || lowerT.includes("thread dump") || lowerT.includes("rca") || lowerT.includes("zero downtime")) {
    difficulty = "senior";
  } else if (lowerT.includes("cơ bản") || lowerT.includes("là gì") || lowerT.includes("phân biệt") || lowerT.includes("vòng đời")) {
    if (difficulty === "senior") difficulty = "middle";
  }

  // Specific category overrides
  if (lowerT.includes("solid") || lowerT.includes("pattern") || lowerT.includes("singleton") || lowerT.includes("strategy") || lowerT.includes("builder") || lowerT.includes("observer") || lowerT.includes("factory")) {
    category = "design-patterns";
  } else if (lowerT.includes("kafka") || lowerT.includes("rabbitmq") || lowerT.includes("redis") || lowerT.includes("message queue") || lowerT.includes("rate limit") || lowerT.includes("token bucket") || lowerT.includes("outbox")) {
    category = "microservices";
  } else if (lowerT.includes("jwt") || lowerT.includes("oauth") || lowerT.includes("security") || lowerT.includes("bcrypt") || lowerT.includes("csrf") || lowerT.includes("xss") || lowerT.includes("ssrf") || lowerT.includes("sql injection")) {
    category = "security-auth";
  } else if (lowerT.includes("junit") || lowerT.includes("mockito") || lowerT.includes("testcontainers") || lowerT.includes("docker") || lowerT.includes("nginx") || lowerT.includes("prometheus") || lowerT.includes("grafana") || lowerT.includes("ci/cd")) {
    category = "testing-devops";
  }

  // Summary and Key Takeaways
  const summary = makeSummary(rawBody, displayTitle);
  const keyTakeaways = makeKeyTakeaways(rawBody, category);
  const companies = getCompanies(i, baseTags);
  const relatedProblems = mapRelatedProblems(displayTitle);

  parsedQuestions.push({
    id,
    title: displayTitle,
    category,
    difficulty,
    tags: baseTags,
    companies,
    summary,
    answerMarkdown: rawBody,
    keyTakeaways,
    relatedProblems
  });
}

console.log(`Successfully parsed ${parsedQuestions.length} complete questions!`);

// Write to files
const repoRoot = path.resolve("..");
const dataPath1 = path.join(repoRoot, "data", "interview-questions.json");
const dataPath2 = path.join(repoRoot, "web", "src", "data", "interview-questions.json");

fs.writeFileSync(dataPath1, JSON.stringify(parsedQuestions, null, 2), "utf-8");
fs.writeFileSync(dataPath2, JSON.stringify(parsedQuestions, null, 2), "utf-8");

console.log("Wrote to:", dataPath1);
console.log("Wrote to:", dataPath2);

// Summary of categories
const counts = {};
parsedQuestions.forEach(q => {
  counts[q.category] = (counts[q.category] || 0) + 1;
});
console.log("Category breakdown:", counts);
