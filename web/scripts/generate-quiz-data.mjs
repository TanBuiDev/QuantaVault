import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { buildQuizRegistry } from "./quiz-parser.mjs";

const scriptDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const coursePath = resolve(scriptDir, "../src/data/courses/spring-framework-for-java/course.json");
const outputPath = resolve(scriptDir, "../src/features/courses/quizData.ts");
const course = JSON.parse(readFileSync(coursePath, "utf8"));
const registry = buildQuizRegistry(course);
const output = `// Generated from the canonical Spring course Markdown via scripts/generate-quiz-data.mjs.
// Do not edit by hand. Regenerate and validate before committing.
import type { CourseQuizQuestion } from "@/lib/courses";

export const springQuizRegistry: Record<string, CourseQuizQuestion[]> = ${JSON.stringify(registry, null, 2)};

export function getLessonQuiz(lessonId: string): CourseQuizQuestion[] | null {
  return springQuizRegistry[lessonId] || null;
}
`;

if (process.argv.includes("--check")) {
  if (readFileSync(outputPath, "utf8") !== output) {
    throw new Error("Spring quizData.ts is out of sync. Run: node scripts/generate-quiz-data.mjs");
  }
  console.log("Spring quiz data verified: 9 lessons / 70 questions.");
} else {
  writeFileSync(outputPath, output, "utf8");
  console.log("Regenerated Spring quiz data: 9 lessons / 70 questions.");
}
