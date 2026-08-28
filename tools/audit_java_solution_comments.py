#!/usr/bin/env python3
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

ROOT_DIR = Path(__file__).resolve().parent.parent
PROBLEMS_DIR = ROOT_DIR / "problems"
EXPECTED_TOTAL = 150
MIN_COMMENT_LINES = 2
MIN_COMMENT_CHARS = 80

OPTIMAL_HEADING_RE = re.compile(
    r"(?im)^##\s+(?:\d+\.\s*)?Optimal Java solution[^\n]*$"
)


def normalize_code(code: str) -> str:
    """Normalize only presentation whitespace; comments remain part of the contract."""
    code = code.replace("\r\n", "\n").replace("\r", "\n")
    lines = [line.rstrip() for line in code.split("\n")]
    while lines and not lines[0].strip():
        lines.pop(0)
    while lines and not lines[-1].strip():
        lines.pop()
    return "\n".join(lines)


def strip_java_comments_and_whitespace(code: str) -> str:
    code = re.sub(r"/\*[\s\S]*?\*/", "", code)
    code = re.sub(r"//.*", "", code)
    return re.sub(r"\s+", "", code)


def comment_metrics(code: str) -> tuple[int, int, int]:
    lines = code.splitlines()
    comment_lines = 0
    code_lines = 0
    comment_parts: list[str] = []
    in_block = False

    for line in lines:
        stripped = line.strip()
        if not stripped:
            continue

        if in_block:
            comment_lines += 1
            comment_parts.append(stripped)
            if "*/" in stripped:
                in_block = False
            continue

        if stripped.startswith("/*"):
            comment_lines += 1
            comment_parts.append(stripped)
            if "*/" not in stripped:
                in_block = True
            continue

        if stripped.startswith("//"):
            comment_lines += 1
            comment_parts.append(stripped[2:].strip())
            continue

        code_lines += 1

    comment_chars = len(re.sub(r"\s+", "", " ".join(comment_parts)))
    return comment_lines, code_lines, comment_chars


def extract_optimal_java_from_md(md_content: str) -> tuple[str | None, int]:
    headings = list(OPTIMAL_HEADING_RE.finditer(md_content))
    if len(headings) != 1:
        return None, len(headings)

    heading = headings[0]
    tail = md_content[heading.end():]
    next_heading = re.search(r"(?m)^##\s+", tail)
    section = tail[:next_heading.start()] if next_heading else tail

    code_match = re.search(r"```java\s*([\s\S]*?)\s*```", section)
    if not code_match:
        return None, 1
    return code_match.group(1), 1


def audit_all() -> int:
    sections = sorted(d for d in PROBLEMS_DIR.iterdir() if d.is_dir())

    total = 0
    annotated = 0
    exact_synced = 0
    semantic_synced = 0
    critical: list[str] = []
    section_stats: dict[str, tuple[int, int, int]] = {}

    for section in sections:
        sec_total = 0
        sec_annotated = 0
        sec_exact = 0

        for pdir in sorted(d for d in section.iterdir() if d.is_dir()):
            sol_java = pdir / "Solution.java"
            if not sol_java.exists():
                continue

            total += 1
            sec_total += 1
            rel = pdir.relative_to(ROOT_DIR).as_posix()
            sol_md = pdir / "solution.md"
            java_content = sol_java.read_text(encoding="utf-8")

            comment_lines, _, comment_chars = comment_metrics(java_content)
            is_annotated = (
                comment_lines >= MIN_COMMENT_LINES
                and comment_chars >= MIN_COMMENT_CHARS
            )
            if is_annotated:
                annotated += 1
                sec_annotated += 1
            else:
                critical.append(
                    f"LOW_COMMENT {rel}: {comment_lines} comment lines, "
                    f"{comment_chars} non-space comment chars"
                )

            if not sol_md.exists():
                critical.append(f"MISSING_MD {rel}/solution.md")
                continue

            md_content = sol_md.read_text(encoding="utf-8")
            extracted_java, heading_count = extract_optimal_java_from_md(md_content)

            if heading_count != 1:
                critical.append(
                    f"OPTIMAL_HEADING {rel}/solution.md: expected 1, found {heading_count}"
                )
                continue
            if extracted_java is None:
                critical.append(f"MISSING_OPTIMAL_CODE {rel}/solution.md")
                continue

            exact = normalize_code(java_content) == normalize_code(extracted_java)
            semantic = (
                strip_java_comments_and_whitespace(java_content)
                == strip_java_comments_and_whitespace(extracted_java)
            )

            if semantic:
                semantic_synced += 1
            else:
                critical.append(f"SEMANTIC_MISMATCH {rel}")

            if exact:
                exact_synced += 1
                sec_exact += 1
            else:
                kind = "COMMENT_OR_FORMAT_MISMATCH" if semantic else "EXACT_MISMATCH"
                critical.append(f"{kind} {rel}")

        section_stats[section.name] = (sec_annotated, sec_exact, sec_total)

    if total != EXPECTED_TOTAL:
        critical.insert(0, f"TOTAL_COUNT expected {EXPECTED_TOTAL}, found {total}")

    print("\n================ JAVA WHY COMMENT CONSISTENCY AUDIT ================")
    print(f"Canonical Solution.java files: {total}/{EXPECTED_TOTAL}")
    print(f"WHY-comment threshold:         {annotated}/{total}")
    print(f"Semantic Java sync:            {semantic_synced}/{total}")
    print(f"Exact Java+comments sync:      {exact_synced}/{total}")
    print("--------------------------------------------------------------------")
    print(f"{'SECTION':<28} | {'WHY':<9} | {'EXACT':<9}")
    print("--------------------------------------------------------------------")
    for name, (ann, exact, sec_total) in section_stats.items():
        print(f"{name:<28} | {ann}/{sec_total:<6} | {exact}/{sec_total:<6}")
    print("====================================================================")

    if critical:
        print(f"\nFAIL: {len(critical)} issue(s) found")
        for issue in critical:
            print(f"- {issue}")
        return 1

    print("\nPASS: all 150 Java solutions have WHY comments and exact solution.md sync")
    return 0


if __name__ == "__main__":
    raise SystemExit(audit_all())
