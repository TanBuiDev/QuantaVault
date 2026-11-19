import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const courseJsonPath = path.resolve(__dirname, "../web/src/data/courses/spring-framework-for-java/course.json");
const course = JSON.parse(fs.readFileSync(courseJsonPath, "utf8"));

// 1. Parser for lesson-21
function parseLesson21(md) {
  const blocks = md.split(/## Question \d+/).slice(1);
  return blocks.map((b, i) => {
    const titleMatch = b.match(/^\s*—\s*([^\n]+)/);
    const enQMatch = b.match(/\*\*EN [—–-] Question:\*\*\s*(.*?)(?=\n\n|\*\*VI)/s);
    const viQMatch = b.match(/\*\*VI [—–-] Câu hỏi:\*\*\s*(.*?)(?=\n\n|\*\*Options)/s);
    const optBlock = b.match(/\*\*Options [—–-] Các lựa chọn:\*\*\s*(.*?)(?=\n\n\*\*EN [—–-] Coursera feedback|\n\n\*\*EN [—–-] Explanation)/s);
    const fbEn = b.match(/\*\*EN [—–-] Coursera feedback:\*\*\s*(.*?)(?=\n|\*\*VI)/s);
    const fbVi = b.match(/\*\*VI [—–-] Phản hồi:\*\*\s*(.*?)(?=\n|\*\*EN)/s);
    const expEn = b.match(/\*\*EN [—–-] Explanation:\*\*\s*(.*?)(?=\n|\*\*VI)/s);
    const expVi = b.match(/\*\*VI [—–-] Giải thích:\*\*\s*(.*?)(?=\n|\*\*EN|\*\*Score|Score)/s);
    
    const options = [];
    if (optBlock) {
      const optLines = optBlock[1].split(/\n(?=\d+\.\s*\*\*EN)/);
      optLines.forEach((ol, oi) => {
        const enMatch = ol.match(/\d+\.\s*\*\*EN:\*\*\s*(.*?)(?=\s*\n\s*\*\*VI:|$)/s);
        const viMatch = ol.match(/\*\*VI:\*\*\s*(.*?)$/s);
        const isCorrect = ol.includes('(Đúng)');
        options.push({
          id: String.fromCharCode(65 + oi),
          textEn: enMatch ? enMatch[1].trim() : "",
          textVi: viMatch ? viMatch[1].replace(/\s*\*{0,2}\(Đúng\)\*{0,2}\s*$/, "").trim() : "",
          isCorrect
        });
      });
    }

    return {
      id: `l21-q${i + 1}`,
      number: i + 1,
      title: titleMatch ? titleMatch[1].trim() : `Câu hỏi ${i + 1}`,
      questionEn: enQMatch ? enQMatch[1].trim() : "",
      questionVi: viQMatch ? viQMatch[1].trim() : "",
      options,
      feedbackEn: fbEn ? fbEn[1].trim() : "Nice work",
      feedbackVi: fbVi ? fbVi[1].trim() : "Làm tốt lắm!",
      explanationEn: expEn ? expEn[1].trim() : "",
      explanationVi: expVi ? expVi[1].trim() : ""
    };
  });
}

// 2. Parser for lesson-28
function parseLesson28(md) {
  const blocks = md.split(/## Question \d+/).slice(1);
  return blocks.map((b, i) => {
    const qEn = b.match(/\*\*EN \(Question[^\)]*\):\*\*\s*(.*?)(?=\n\*\*VI)/s)?.[1]?.trim() || "";
    const qVi = b.match(/\*\*VI \(Câu hỏi\):\*\*\s*(.*?)(?=\n\*\*EN|\n### Lựa chọn)/s)?.[1]?.trim() || "";
    const corrMatch = b.match(/\*\*Đáp án đúng[^\:]*:\*\*\s*([A-D])/)?.[1] || (i === 4 ? "A" : "A");
    
    const optBlock = b.match(/### Lựa chọn[^\n]*\n(.*?)(?=\n\n\*\*Đáp án)/s)?.[1] || "";
    const optLines = optBlock.split(/\n(?=[A-D]\.\s*\*\*EN)/);
    const options = optLines.map((ol, oi) => {
      const id = String.fromCharCode(65 + oi);
      const enMatch = ol.match(/[A-D]\.\s*\*\*EN:\*\*\s*(.*?)(?=\s*\n\s*\*\*VI:|$)/s);
      const viMatch = ol.match(/\*\*VI:\*\*\s*(.*?)$/s);
      return {
        id,
        textEn: enMatch ? enMatch[1].trim() : "",
        textVi: viMatch ? viMatch[1].trim() : "",
        isCorrect: id === corrMatch
      };
    });

    const expEn = b.match(/\*\*Explanation \(EN\):\*\*\s*(.*?)(?=\n\n\*\*Giải thích)/s)?.[1]?.trim() || 
                  b.match(/\*\*EN \(Giải thích gốc Coursera\):\*\*\s*(.*?)(?=\n)/s)?.[1]?.trim() || "";
    const expVi = b.match(/\*\*Giải thích \(VI\):\*\*\s*(.*?)(?=\n\n\*\*Vì sao)/s)?.[1]?.trim() ||
                  b.match(/\*\*VI \(Dịch giải thích gốc\):\*\*\s*(.*?)(?=\n)/s)?.[1]?.trim() || "";
    const whyNot = b.match(/\*\*Vì sao những lựa chọn khác không phù hợp:\*\*\s*(.*?)(?=\n---|$)/s)?.[1]?.trim() || "";

    return {
      id: `l28-q${i + 1}`,
      number: i + 1,
      title: `REST API - Câu ${i + 1}`,
      questionEn: qEn,
      questionVi: qVi,
      options,
      feedbackEn: "Nice work",
      feedbackVi: "Làm tốt lắm!",
      explanationEn: expEn,
      explanationVi: whyNot ? `${expVi}\n\n**Vì sao các lựa chọn khác không phù hợp:**\n${whyNot}` : expVi
    };
  });
}

// 3. Parser for lesson-14
function parseLesson14(md) {
  const blocks = md.split(/## Question \d+/).slice(1);
  return blocks.map((b, i) => {
    const titleMatch = b.match(/^\s*—\s*([^\n]+)/);
    const qEn = b.match(/\*\*EN \(Original Question\):\*\*\s*(.*?)(?=\n\n\*\*VI)/s)?.[1]?.trim() || "";
    const qVi = b.match(/\*\*VI \(Câu hỏi\):\*\*\s*(.*?)(?=\n\n\*\*EN|\n\n### Choices)/s)?.[1]?.trim() || "";
    const corrMatch = b.match(/\*\*Đáp án dự kiến:\s*([A-D])/)?.[1] || "A";

    const optBlock = b.match(/### Choices[^\n]*\n(.*?)(?=\n\n\*\*Đáp án)/s)?.[1] || "";
    const optLines = optBlock.split(/\n(?=-?\s*\*\*[A-D]\.\s*EN)/);
    const options = optLines.map((ol, oi) => {
      const id = String.fromCharCode(65 + oi);
      const enMatch = ol.match(/[A-D]\.\s*EN:\*\*\s*(.*?)(?=\s*\n\s*\*\*VI:|$)/s);
      const viMatch = ol.match(/\*\*VI:\*\*\s*(.*?)$/s);
      return {
        id,
        textEn: enMatch ? enMatch[1].trim() : "",
        textVi: viMatch ? viMatch[1].trim() : "",
        isCorrect: id === corrMatch
      };
    });

    const expEn = b.match(/\*\*Explanation \(EN\):\*\*\s*(.*?)(?=\n\n\*\*Giải thích)/s)?.[1]?.trim() || "";
    const expVi = b.match(/\*\*Giải thích \(VI\):\*\*\s*(.*?)(?=\n\n\*\*Why not|\n\n\*\*Ghi nhớ)/s)?.[1]?.trim() || "";
    const whyNot = b.match(/\*\*Why not the other choices\?[^\n]*\n(.*?)(?=\n\n\*\*Ghi nhớ|\n---|$)/s)?.[1]?.trim() || "";

    return {
      id: `l14-q${i + 1}`,
      number: i + 1,
      title: titleMatch ? titleMatch[1].trim() : `Spring Framework - Câu ${i + 1}`,
      questionEn: qEn,
      questionVi: qVi,
      options,
      feedbackEn: "Nice work",
      feedbackVi: "Làm tốt lắm!",
      explanationEn: expEn,
      explanationVi: whyNot ? `${expVi}\n\n${whyNot}` : expVi
    };
  });
}

// 4. Parser for lesson-30
function parseLesson30(md) {
  const blocks = md.split(/### Question \d+/).slice(1);
  return blocks.map((b, i) => {
    const qEn = b.match(/\*\*EN \(Question, Coursera\):\*\*\s*(.*?)(?=\n\n\*\*VI)/s)?.[1]?.trim() || "";
    const qVi = b.match(/\*\*VI \(Câu hỏi\):\*\*\s*(.*?)(?=\n\n\*\*EN|\n\n\*\*Các lựa chọn)/s)?.[1]?.trim() || "";
    const ansLine = b.match(/\*\*Đáp án đúng[^\:]*:\*\*\s*([^\n]+)/)?.[1]?.trim() || "";

    const optBlock = b.match(/\*\*Các lựa chọn[^\n]*\n(.*?)(?=\n\n\*\*Đáp án)/s)?.[1] || "";
    const optLines = optBlock.split(/\n(?=\d+\.\s*\*\*EN)/);
    const options = optLines.map((ol, oi) => {
      const id = String.fromCharCode(65 + oi);
      const enMatch = ol.match(/\d+\.\s*\*\*EN:\*\*\s*(.*?)(?=\s*\n\s*\*\*VI:|$)/s);
      const viMatch = ol.match(/\*\*VI:\*\*\s*(.*?)$/s);
      const enText = enMatch ? enMatch[1].trim() : "";
      const isCorrect = enText.toLowerCase().includes(ansLine.toLowerCase()) || ansLine.toLowerCase().includes(enText.toLowerCase());
      return {
        id,
        textEn: enText,
        textVi: viMatch ? viMatch[1].trim() : "",
        isCorrect
      };
    });

    const expEn = b.match(/\*\*Explanation \(EN, phân tích bổ sung\):\*\*\s*(.*?)(?=\n\n\*\*Giải thích)/s)?.[1]?.trim() || "";
    const expVi = b.match(/\*\*Giải thích \(VI, phân tích bổ sung\):\*\*\s*(.*?)(?=\n\n\*\*Phân tích|\n---|$)/s)?.[1]?.trim() || "";
    const whyNot = b.match(/\*\*Phân tích các lựa chọn còn lại:\*\*\s*(.*?)(?=\n---|$)/s)?.[1]?.trim() || "";

    return {
      id: `l30-q${i + 1}`,
      number: i + 1,
      title: `Spring Boot Deep Dive - Câu ${i + 1}`,
      questionEn: qEn,
      questionVi: qVi,
      options,
      feedbackEn: "Nice work",
      feedbackVi: "Làm tốt lắm!",
      explanationEn: expEn,
      explanationVi: whyNot ? `${expVi}\n\n**Phân tích các lựa chọn còn lại:**\n${whyNot}` : expVi
    };
  });
}

// 5. Parser for lesson-38
function parseLesson38(md) {
  const blocks = md.split(/\n## \d+\./).slice(1);
  return blocks.map((b, i) => {
    const qEn = b.match(/\*\*EN:\*\*\s*(.*?)(?=\n\n\*\*VI)/s)?.[1]?.trim() || "";
    const qVi = b.match(/\*\*VI:\*\*\s*(.*?)(?=\n\n### Các lựa chọn)/s)?.[1]?.trim() || "";
    const ansChoice = parseInt(b.match(/\*\*Đáp án phù hợp[^\:]*:\*\*\s*Lựa chọn\s*(\d+)/i)?.[1] || "1", 10);

    const optBlock = b.match(/### Các lựa chọn[^\n]*\n(.*?)(?=\n\n\*\*Đáp án)/s)?.[1] || "";
    const optLines = optBlock.split(/\n(?=\d+\.\s*\*\*EN)/);
    const options = optLines.map((ol, oi) => {
      const id = String.fromCharCode(65 + oi);
      const enMatch = ol.match(/\d+\.\s*\*\*EN:\*\*\s*(.*?)(?=\s*\n\s*\*\*VI:|$)/s);
      const viMatch = ol.match(/\*\*VI:\*\*\s*(.*?)$/s);
      return {
        id,
        textEn: enMatch ? enMatch[1].trim() : "",
        textVi: viMatch ? viMatch[1].trim() : "",
        isCorrect: oi + 1 === ansChoice
      };
    });

    const expVi = b.match(/\*\*Giải thích:\*\*\s*(.*?)(?=\n\n### Vì sao)/s)?.[1]?.trim() || "";
    const whyNot = b.match(/### Vì sao không chọn các đáp án khác\?\s*(.*?)(?=\n---|$)/s)?.[1]?.trim() || "";

    return {
      id: `l38-q${i + 1}`,
      number: i + 1,
      title: `Spring MVC - Câu ${i + 1}`,
      questionEn: qEn,
      questionVi: qVi,
      options,
      feedbackEn: "Nice work",
      feedbackVi: "Làm tốt lắm!",
      explanationEn: "",
      explanationVi: whyNot ? `${expVi}\n\n**Vì sao không chọn các đáp án khác:**\n${whyNot}` : expVi
    };
  });
}

// 6. Parser for lesson-43
function parseLesson43(md) {
  const blocks = md.split(/\n## \d+\./).slice(1);
  return blocks.map((b, i) => {
    const qEn = b.match(/Question \d+\s*\n\*\*VI:\*\*[^\n]*\n\n(.*?)(?=\n\n\*\*VI:\*\*)/s)?.[1]?.trim() ||
                b.match(/Question \d+[^\n]*\n(.*?)(?=\n\n\*\*VI:\*\*)/s)?.[1]?.trim() || "";
    const qVi = b.match(/Question \d+[^\n]*\n.*?\n\n\*\*VI:\*\*\s*(.*?)(?=\n\n### Các lựa chọn)/s)?.[1]?.trim() || "";
    const corrLetter = b.match(/\*\*Đáp án đúng:\*\*\s*([A-D])/i)?.[1]?.toUpperCase() || "A";

    const optBlock = b.match(/### Các lựa chọn[^\n]*\n(.*?)(?=\n\n\*\*Đáp án)/s)?.[1] || "";
    const optLines = optBlock.split(/\n(?=[A-D]\.\s*)/);
    const options = optLines.map((ol, oi) => {
      const id = String.fromCharCode(65 + oi);
      const enMatch = ol.match(/[A-D]\.\s*(.*?)(?=\s*\n\s*\*\*VI:|$)/s);
      const viMatch = ol.match(/\*\*VI:\*\*\s*(.*?)$/s);
      return {
        id,
        textEn: enMatch ? enMatch[1].trim() : "",
        textVi: viMatch ? viMatch[1].trim() : "",
        isCorrect: id === corrLetter
      };
    });

    const expEn = b.match(/\*\*Official explanation \(Coursera\):\*\*\s*(.*?)(?=\n\n\*\*Bản dịch)/s)?.[1]?.trim() || "";
    const expVi = b.match(/\*\*Bản dịch giải thích Coursera:\*\*\s*(.*?)(?=\n\n### Giải thích)/s)?.[1]?.trim() || "";
    const whyNot = b.match(/### Giải thích từng lựa chọn[^\n]*\n(.*?)(?=\n---|$)/s)?.[1]?.trim() || "";

    return {
      id: `l43-q${i + 1}`,
      number: i + 1,
      title: `Spring Security - Câu ${i + 1}`,
      questionEn: qEn,
      questionVi: qVi,
      options,
      feedbackEn: "Nice work",
      feedbackVi: "Làm tốt lắm!",
      explanationEn: expEn,
      explanationVi: whyNot ? `${expVi}\n\n**Giải thích từng lựa chọn:**\n${whyNot}` : expVi
    };
  });
}

// 7. Parser for lesson-45
function parseLesson45(md) {
  const blocks = md.split(/## \d+\. Question \d+/).slice(1);
  return blocks.map((b, i) => {
    const qEn = b.match(/\*\*EN:\*\*\s*(.*?)(?=\n\n\*\*VI)/s)?.[1]?.trim() || "";
    const qVi = b.match(/\*\*VI:\*\*\s*(.*?)(?=\n\n### Các lựa chọn)/s)?.[1]?.trim() || "";
    const ansMatch = b.match(/\*\*Đáp án đúng[^\:]*:\*\*\s*(\d+)\.\s*`?([^`\n]+)`?/);
    const ansIndex = ansMatch ? parseInt(ansMatch[1], 10) : 1;

    const optBlock = b.match(/### Các lựa chọn[^\n]*\n(.*?)(?=\n\n### Phản hồi|\n\n\*\*Đáp án)/s)?.[1] || "";
    const optLines = optBlock.split(/\n(?=\d+\.\s*`)/);
    const options = optLines.map((ol, oi) => {
      const id = String.fromCharCode(65 + oi);
      const enMatch = ol.match(/\d+\.\s*`([^`]+)`/);
      const viMatch = ol.match(/\*\*VI:\*\*\s*(.*?)$/s);
      return {
        id,
        textEn: enMatch ? enMatch[1].trim() : "",
        textVi: viMatch ? viMatch[1].trim() : (enMatch ? enMatch[1].trim() : ""),
        isCorrect: oi + 1 === ansIndex
      };
    });

    const expVi = b.match(/\*\*Giải thích chi tiết:\*\*\s*(.*?)(?=\n\n### Giải thích bổ sung)/s)?.[1]?.trim() || "";
    const whyNot = b.match(/### Giải thích bổ sung[^\n]*\n(.*?)(?=\n---|$)/s)?.[1]?.trim() || "";

    return {
      id: `l45-q${i + 1}`,
      number: i + 1,
      title: `Spring MVC & Security Exam - Câu ${i + 1}`,
      questionEn: qEn,
      questionVi: qVi,
      options,
      feedbackEn: "Nice work",
      feedbackVi: "Làm tốt lắm!",
      explanationEn: "",
      explanationVi: whyNot ? `${expVi}\n\n**Giải thích bổ sung:**\n${whyNot}` : expVi
    };
  });
}

// 8. Generate multiple choice for lesson-05 and lesson-10 from flashcards
function generateFromFlashcards(cards, lessonPrefix, titlePrefix, count = 10) {
  const selected = cards.slice(0, count);
  return selected.map((card, i) => {
    const correctOption = {
      id: "A",
      textEn: card.answerEn,
      textVi: card.answerVi,
      isCorrect: true
    };
    
    // Pick 3 distractors from remaining cards
    const otherCards = cards.filter((_, idx) => idx !== i);
    const distractors = otherCards.slice(0, 3).map((dc, di) => ({
      id: String.fromCharCode(66 + di),
      textEn: dc.answerEn,
      textVi: dc.answerVi,
      isCorrect: false
    }));

    // Shuffle options
    const allOptions = [correctOption, ...distractors].sort(() => Math.random() - 0.5);
    allOptions.forEach((opt, idx) => {
      opt.id = String.fromCharCode(65 + idx);
    });

    return {
      id: `${lessonPrefix}-q${i + 1}`,
      number: i + 1,
      title: `${titlePrefix} - Câu ${i + 1}`,
      questionEn: card.questionEn,
      questionVi: card.questionVi,
      options: allOptions,
      feedbackEn: "Nice work",
      feedbackVi: "Làm tốt lắm!",
      explanationEn: "",
      explanationVi: card.explanationVi || `Đáp án chính xác: ${card.answerVi}`
    };
  });
}

const quizRegistry = {};

// Process all quiz lessons
course.lessons.forEach(l => {
  if (l.lessonType !== "quiz") return;

  if (l.id === "lesson-21") {
    quizRegistry[l.id] = parseLesson21(l.contentMarkdown);
  } else if (l.id === "lesson-28") {
    quizRegistry[l.id] = parseLesson28(l.contentMarkdown);
  } else if (l.id === "lesson-14") {
    quizRegistry[l.id] = parseLesson14(l.contentMarkdown);
  } else if (l.id === "lesson-30") {
    quizRegistry[l.id] = parseLesson30(l.contentMarkdown);
  } else if (l.id === "lesson-38") {
    quizRegistry[l.id] = parseLesson38(l.contentMarkdown);
  } else if (l.id === "lesson-43") {
    quizRegistry[l.id] = parseLesson43(l.contentMarkdown);
  } else if (l.id === "lesson-45") {
    quizRegistry[l.id] = parseLesson45(l.contentMarkdown);
  } else if (l.id === "lesson-05" && l.flashcards) {
    quizRegistry[l.id] = generateFromFlashcards(l.flashcards, "l05", "Khám phá Spring", 10);
  } else if (l.id === "lesson-10" && l.flashcards) {
    quizRegistry[l.id] = generateFromFlashcards(l.flashcards, "l10", "Nền tảng Spring", 10);
  }
});

console.log("Quiz Registry Summary:");
Object.keys(quizRegistry).forEach(k => {
  console.log(`- ${k}: ${quizRegistry[k].length} questions`);
});

// Output quizData.ts
const outputPath = path.resolve(__dirname, "../web/src/features/courses/quizData.ts");
const tsContent = `// Generated quiz dataset for interactive Multiple Choice Quizzes
import type { CourseQuizQuestion } from "@/lib/courses";

export const springQuizRegistry: Record<string, CourseQuizQuestion[]> = ${JSON.stringify(quizRegistry, null, 2)};

export function getLessonQuiz(lessonId: string): CourseQuizQuestion[] | null {
  return springQuizRegistry[lessonId] || null;
}
`;

fs.writeFileSync(outputPath, tsContent, "utf8");
console.log(`Successfully generated ${outputPath}!`);
