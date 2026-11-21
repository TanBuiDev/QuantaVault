import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

type Segment = { id: string; start: number; time: string; en: string; vi: string };
type Course = { lessons: { id: string; transcript?: Segment[] }[] };
type Reference = { lessons: Record<string, { id: string; en: string; vi: string }[]> };
const sitePath = resolve(process.cwd(), "src/data/courses/spring-framework-for-java/course.json");
const sourcePath = resolve(process.cwd(), "../data/courses/spring-framework-for-java/course.json");
const fixturePath = resolve(process.cwd(), "src/lib/courses/__tests__/fixtures/spring-transcripts-authoritative.json");
const course = JSON.parse(readFileSync(sitePath, "utf8")) as Course;
const reference = JSON.parse(readFileSync(fixturePath, "utf8")) as Reference;
const norm = (s: string) => s.replace(/\s+/g, " ").trim();

describe("Spring course transcript integrity", () => {
  it("keeps both canonical course manifests identical", () => {
    expect(readFileSync(sitePath, "utf8")).toBe(readFileSync(sourcePath, "utf8"));
  });

  it("validates all available transcripts across the 46 lessons", () => {
    expect(course.lessons).toHaveLength(46);
    const problems: string[] = [];
    let transcriptLessons = 0;
    for (const lesson of course.lessons) {
      const entries = lesson.transcript ?? [];
      if (!entries.length) continue;
      transcriptLessons++;
      let previous = -1;
      const ids = new Set<string>();
      entries.forEach((s, i) => {
        const where = lesson.id + "#" + (i + 1);
        if (!s.en?.trim() || !s.vi?.trim()) problems.push(where + " missing EN or VI");
        if (!Number.isFinite(s.start) || s.start < 0 || s.start < previous) problems.push(where + " invalid timestamp");
        previous = s.start;
        if (ids.has(s.id)) problems.push(where + " duplicate id");
        ids.add(s.id);
        const m = s.time?.match(/^(\d+):([0-5]\d)$/);
        if (!m || Math.floor(s.start) !== Number(m[1]) * 60 + Number(m[2])) {
          problems.push(where + " time string inconsistent with start");
        }
      });
    }
    expect(transcriptLessons).toBe(23);
    expect(problems).toEqual([]);
  });

  it("matches all 221 independently sourced segments of lessons 32, 33 and 34", () => {
    const total = Object.values(reference.lessons).reduce((n, arr) => n + arr.length, 0);
    expect(total).toBe(221);
    for (const [id, expected] of Object.entries(reference.lessons)) {
      const actual = course.lessons.find((lesson) => lesson.id === id)?.transcript ?? [];
      expect(actual, id + " segment count").toHaveLength(expected.length);
      expected.forEach((s, i) => {
        const label = id + "#" + (i + 1);
        expect(actual[i]?.id, label + " id").toBe(s.id);
        expect(norm(actual[i]?.en ?? ""), label + " English").toBe(s.en);
        expect(norm(actual[i]?.vi ?? ""), label + " Vietnamese").toBe(s.vi);
      });
    }
  });

  it("rejects obvious clipped English fragments in any transcript", () => {
    // This conservative heuristic supplements (but cannot replace) source comparison.
    // Do not flag natural lesson introductions such as 'you will be able to'.
    const looksClipped = /\b(?:that|the|a|an|and|or|of|for|with|by|from|into|when|while|like|such|where|who|which)\s*$/i;
    const problems = course.lessons.flatMap((lesson) =>
      (lesson.transcript ?? [])
        .filter((s) => looksClipped.test(s.en.trim()))
        .map((s) => lesson.id + ":" + s.id + " " + s.en)
    );
    expect(problems).toEqual([]);
  });
});
