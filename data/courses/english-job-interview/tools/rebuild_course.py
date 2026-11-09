#!/usr/bin/env python3
"""Regenerate the bilingual English course and separate practice dataset.

Canonical learning text: questions/part-*/q-*.md, ordered by question-index.json.
PDF provenance is retained in canonical frontmatter, not public course text.
Usage: python data/courses/english-job-interview/tools/rebuild_course.py --check | --write
"""
from __future__ import annotations

import argparse
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
WEB_ROOT = ROOT.parents[2] / "web" / "src" / "data" / "courses" / "english-job-interview"


def extract_question(item, source):
    if not source.startswith("---\n"):
        raise ValueError("Missing YAML frontmatter: " + item["filepath"])
    body = source.split("---", 2)[2].strip()
    heading = re.search(r"(?m)^# (.+)$", body)
    vi_heading = re.search(r"(?m)^\*\*Tiếng Việt:\*\*\s*(.+)$", body)
    if not heading or not vi_heading or heading.group(1) != item["questionEnglish"]:
        raise ValueError("Invalid bilingual question: " + item["id"])

    matches = list(re.finditer(r"(?m)^### Mẫu (\d+)\s*$", body))
    if len(matches) != item["answerExamples"]:
        raise ValueError("Sample count mismatch: " + item["id"])

    answers = []
    for i, match in enumerate(matches):
        block = body[match.start():matches[i + 1].start() if i + 1 < len(matches) else len(body)]
        pair = re.search(r"\*\*English:\*\*\s*\n+([\s\S]*?)\n+\*\*Tiếng Việt:\*\*\s*\n+([\s\S]*)", block)
        if not pair:
            raise ValueError("Missing sample translation: " + item["id"])
        en = pair.group(1).strip()
        vi = re.sub(r"(?m)^\*Nguồn: PDF[^\n]*\*\s*$", "", pair.group(2)).strip()
        if not en or not vi:
            raise ValueError("Empty sample translation: " + item["id"])
        answers.append({"id": item["id"] + ":answer:" + str(i + 1), "en": en, "vi": vi})

    question = {
        "id": item["id"],
        "lessonId": item["lessonId"],
        "questionEn": heading.group(1),
        "questionVi": vi_heading.group(1),
        "answers": answers,
    }
    public_body = re.sub(r"(?m)^\*Nguồn: PDF[^\n]*\*\s*\n?", "", body)
    public_body = re.sub(r"(?m)^> \*\*Lưu ý nguồn:\*\*[^\n]*\n?", "", public_body)
    public_body = re.sub(r"(?m)^(#{1,3}) ", lambda m: "#" + m.group(1) + " ", public_body).strip()
    return question, public_body


def build():
    manifest = json.loads((ROOT / "course.json").read_text(encoding="utf-8"))
    index = json.loads((ROOT / "question-index.json").read_text(encoding="utf-8"))
    assert len(manifest["chapters"]) == 8 and len(manifest["lessons"]) == 18
    assert len(index) == 155 and len({item["id"] for item in index}) == 155

    results = {}
    questions = []
    for lesson in manifest["lessons"]:
        members = [item for item in index if item["lessonId"] == lesson["id"]]
        assert members and lesson.get("titleEn"), "Missing English title or questions: " + lesson["id"]
        lines = ["# Lesson " + str(lesson["number"]).zfill(2) + ": " + lesson["titleEn"],
                 "", "**Tiếng Việt:** " + lesson["title"], "", "---", ""]
        for item in members:
            source = (ROOT / item["filepath"]).read_text(encoding="utf-8")
            question, public_body = extract_question(item, source)
            questions.append(question)
            lines.extend([public_body, "", "---", ""])
        content = "\n".join(lines).rstrip() + "\n"
        lesson["contentMarkdown"] = content
        results[ROOT / "lessons" / (lesson["id"] + ".md")] = content

    assert len(questions) == 155
    assert sum(len(question["answers"]) for question in questions) == 348
    practice_data = {"version": 1, "courseId": "english-job-interview", "questions": questions}
    manifest_json = json.dumps(manifest, ensure_ascii=False, indent=2) + "\n"
    practice_json = json.dumps(practice_data, ensure_ascii=False, indent=2) + "\n"
    results[ROOT / "course.json"] = manifest_json
    results[WEB_ROOT / "course.json"] = manifest_json
    results[ROOT / "practice.json"] = practice_json
    results[WEB_ROOT / "practice.json"] = practice_json
    return results


def main():
    parser = argparse.ArgumentParser()
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--check", action="store_true")
    group.add_argument("--write", action="store_true")
    args = parser.parse_args()
    outputs = build()
    mismatches = []
    for path, content in outputs.items():
        if not path.is_file() or path.read_text(encoding="utf-8") != content:
            mismatches.append(str(path.relative_to(ROOT.parents[2])))
            if args.write:
                path.parent.mkdir(parents=True, exist_ok=True)
                path.write_text(content, encoding="utf-8")
    if args.check and mismatches:
        print("INCONSISTENT: " + ", ".join(mismatches), file=sys.stderr)
        return 1
    print("OK: 155 questions, 348 answers, 18 bilingual lessons. Changed: " + str(len(mismatches) if args.write else 0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
