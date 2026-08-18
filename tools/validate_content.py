#!/usr/bin/env python3
"""Validate canonical LeetCode V2 content without third-party dependencies."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
from pathlib import Path

ALLOWED_DIFFICULTY = {"Easy", "Medium", "Hard"}
ALLOWED_SOURCE = {"full-source", "list-only", "source-missing"}
ALLOWED_COMPONENT_STATUS = {"none", "partial", "complete"}
ALLOWED_MEDIA_STATUS = {"none", "available", "media-missing"}
ALLOWED_MEDIA_SCOPE = {"problem", "solution"}
ALLOWED_MEDIA_ORIGIN = {"user-supplied", "external", "project-created"}
ALLOWED_CASE_SOURCE = {"problem-example", "derived-edge-case", "derived-regression"}
ALLOWED_CONTRACT_TYPE = {"method", "operation-sequence"}

REQUIRED_META_KEYS = {
    "schema_version",
    "id",
    "slug",
    "title",
    "difficulty",
    "primary_section",
    "content_status",
    "source",
    "study_plans",
    "topics",
    "patterns",
    "solution_languages",
    "leetcode_url",
}
REQUIRED_CONTENT_STATUS_KEYS = {
    "source",
    "translation",
    "hints",
    "solution",
    "interview",
    "cases",
    "problem_media",
    "solution_media",
}


def parse_scalar(value: str):
    value = value.strip()
    if value == "[]":
        return []
    if value in {"null", "Null", "NULL", "~"}:
        return None
    if value.lower() == "true":
        return True
    if value.lower() == "false":
        return False
    if re.fullmatch(r"-?\d+", value):
        return int(value)
    if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
        return value[1:-1]
    return value


def _yaml_lines(text: str) -> list[tuple[int, str, int]]:
    lines: list[tuple[int, str, int]] = []
    for line_number, raw in enumerate(text.splitlines(), start=1):
        if not raw.strip() or raw.lstrip().startswith("#"):
            continue
        leading = raw[: len(raw) - len(raw.lstrip())]
        if "\t" in leading:
            raise ValueError(f"tabs are not supported at line {line_number}")
        indent = len(raw) - len(raw.lstrip(" "))
        lines.append((indent, raw.strip(), line_number))
    return lines


def _split_mapping(text: str, line_number: int) -> tuple[str, str]:
    if ":" not in text:
        raise ValueError(f"expected key:value mapping at line {line_number}: {text!r}")
    key, value = text.split(":", 1)
    key = key.strip()
    if not re.fullmatch(r"[A-Za-z_][A-Za-z0-9_-]*", key):
        raise ValueError(f"unsupported YAML key at line {line_number}: {key!r}")
    return key, value.strip()


def _parse_yaml_block(
    lines: list[tuple[int, str, int]], index: int, indent: int
) -> tuple[object, int]:
    if index >= len(lines):
        return {}, index

    first_indent, first_text, _ = lines[index]
    if first_indent != indent:
        raise ValueError(f"unexpected indentation: expected {indent}, got {first_indent}")

    is_list = first_text.startswith("- ") or first_text == "-"
    if is_list:
        values: list[object] = []
        while index < len(lines):
            current_indent, text, line_number = lines[index]
            if current_indent < indent:
                break
            if current_indent > indent:
                raise ValueError(f"unexpected indentation at line {line_number}")
            if not (text.startswith("- ") or text == "-"):
                break

            item_text = text[1:].strip()
            index += 1
            if not item_text:
                if index < len(lines) and lines[index][0] > indent:
                    child, index = _parse_yaml_block(lines, index, lines[index][0])
                    values.append(child)
                else:
                    values.append(None)
                continue

            if ":" not in item_text:
                values.append(parse_scalar(item_text))
                continue

            key, raw_value = _split_mapping(item_text, line_number)
            item: dict[str, object] = {}
            if raw_value:
                item[key] = parse_scalar(raw_value)
            elif index < len(lines) and lines[index][0] > indent:
                child, index = _parse_yaml_block(lines, index, lines[index][0])
                item[key] = child
            else:
                item[key] = None

            if index < len(lines) and lines[index][0] > indent:
                continuation, index = _parse_yaml_block(lines, index, lines[index][0])
                if not isinstance(continuation, dict):
                    raise ValueError(
                        f"list mapping continuation must be a mapping near line {line_number}"
                    )
                item.update(continuation)
            values.append(item)
        return values, index

    mapping: dict[str, object] = {}
    while index < len(lines):
        current_indent, text, line_number = lines[index]
        if current_indent < indent:
            break
        if current_indent > indent:
            raise ValueError(f"unexpected indentation at line {line_number}")
        if text.startswith("- ") or text == "-":
            break

        key, raw_value = _split_mapping(text, line_number)
        index += 1
        if raw_value:
            mapping[key] = parse_scalar(raw_value)
        elif index < len(lines) and lines[index][0] > indent:
            child, index = _parse_yaml_block(lines, index, lines[index][0])
            mapping[key] = child
        else:
            mapping[key] = None
    return mapping, index


def parse_yaml_subset(text: str) -> dict:
    lines = _yaml_lines(text)
    if not lines:
        return {}
    if lines[0][0] != 0:
        raise ValueError("top-level YAML must start at indentation 0")
    value, index = _parse_yaml_block(lines, 0, 0)
    if index != len(lines):
        _, raw, line_number = lines[index]
        raise ValueError(f"unparsed YAML at line {line_number}: {raw!r}")
    if not isinstance(value, dict):
        raise ValueError("top-level YAML must be a mapping")
    return value


def parse_meta_yaml(text: str) -> dict:
    return parse_yaml_subset(text)


def find_problem_dirs(root: Path) -> list[Path]:
    base = root / "problems"
    if not base.exists():
        return []
    return sorted(path.parent for path in base.glob("*/*/meta.yaml") if path.is_file())


def load_records(problem_dirs: list[Path]) -> tuple[list[dict], list[str]]:
    records: list[dict] = []
    errors: list[str] = []
    for problem_dir in problem_dirs:
        path = problem_dir / "meta.yaml"
        try:
            meta = parse_meta_yaml(path.read_text(encoding="utf-8"))
        except Exception as exc:
            errors.append(f"{path}: cannot parse metadata: {exc}")
            continue
        meta["__dir__"] = problem_dir
        records.append(meta)
    return records, errors


def validate_required_meta(meta: dict) -> list[str]:
    path = meta["__dir__"] / "meta.yaml"
    errors: list[str] = []
    missing = sorted(REQUIRED_META_KEYS - set(meta))
    if missing:
        return [f"{path}: missing keys: {', '.join(missing)}"]

    if meta.get("schema_version") != 2:
        errors.append(f"{path}: schema_version must be 2")
    if not isinstance(meta.get("id"), int) or meta["id"] < 1:
        errors.append(f"{path}: id must be a positive integer")
    if meta.get("difficulty") not in ALLOWED_DIFFICULTY:
        errors.append(f"{path}: invalid difficulty {meta.get('difficulty')!r}")
    if not re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", str(meta.get("slug", ""))):
        errors.append(f"{path}: invalid slug {meta.get('slug')!r}")
    if not re.fullmatch(
        r"[a-z0-9]+(?:-[a-z0-9]+)*", str(meta.get("primary_section", ""))
    ):
        errors.append(f"{path}: invalid primary_section {meta.get('primary_section')!r}")
    if not str(meta.get("leetcode_url", "")).startswith("https://leetcode.com/problems/"):
        errors.append(f"{path}: invalid leetcode_url")

    for key in ("topics", "patterns", "study_plans", "solution_languages"):
        if not isinstance(meta.get(key), list):
            errors.append(f"{path}: {key} must be a list")

    status = meta.get("content_status")
    if not isinstance(status, dict):
        errors.append(f"{path}: content_status must be a mapping")
        return errors

    missing_status = sorted(REQUIRED_CONTENT_STATUS_KEYS - set(status))
    if missing_status:
        errors.append(
            f"{path}: content_status missing keys: {', '.join(missing_status)}"
        )
        return errors

    if status.get("source") not in ALLOWED_SOURCE:
        errors.append(f"{path}: invalid content_status.source {status.get('source')!r}")
    for key in ("translation", "hints", "solution", "interview", "cases"):
        if status.get(key) not in ALLOWED_COMPONENT_STATUS:
            errors.append(f"{path}: invalid content_status.{key} {status.get(key)!r}")
    for key in ("problem_media", "solution_media"):
        if status.get(key) not in ALLOWED_MEDIA_STATUS:
            errors.append(f"{path}: invalid content_status.{key} {status.get(key)!r}")

    if status.get("solution") == "complete":
        if not isinstance(meta.get("time_complexity"), str):
            errors.append(f"{path}: complete solution requires time_complexity")
        if not isinstance(meta.get("space_complexity"), str):
            errors.append(f"{path}: complete solution requires space_complexity")
    return errors


def validate_unique_ids(records: list[dict]) -> list[str]:
    seen: dict[int, Path] = {}
    errors: list[str] = []
    for meta in records:
        problem_id = meta.get("id")
        if not isinstance(problem_id, int):
            continue
        if problem_id in seen:
            errors.append(
                f"duplicate problem id {problem_id}: {seen[problem_id]} and {meta['__dir__']}"
            )
        else:
            seen[problem_id] = meta["__dir__"]
    return errors


def validate_unique_slugs(records: list[dict]) -> list[str]:
    seen: dict[str, Path] = {}
    errors: list[str] = []
    for meta in records:
        slug = meta.get("slug")
        if not isinstance(slug, str):
            continue
        if slug in seen:
            errors.append(
                f"duplicate problem slug {slug}: {seen[slug]} and {meta['__dir__']}"
            )
        else:
            seen[slug] = meta["__dir__"]
    return errors


def validate_v2_content_status(problem_dir: Path, meta: dict) -> list[str]:
    errors: list[str] = []
    status = meta.get("content_status")
    if not isinstance(status, dict):
        return errors

    for component, filename in {
        "hints": "hints.md",
        "solution": "solution.md",
        "interview": "interview.md",
        "cases": "cases.yaml",
    }.items():
        if status.get(component) == "complete" and not (problem_dir / filename).is_file():
            errors.append(
                f"{problem_dir}: {component} marked complete but {filename} is missing"
            )

    if status.get("solution") == "complete" and not (problem_dir / "Solution.java").is_file():
        errors.append(f"{problem_dir}: solution marked complete but Solution.java is missing")
    if status.get("source") == "full-source" and not (problem_dir / "problem.md").is_file():
        errors.append(f"{problem_dir}: full-source problem missing problem.md")
    return errors


def validate_bilingual_problem(problem_dir: Path, meta: dict) -> list[str]:
    status = meta.get("content_status")
    if not isinstance(status, dict) or status.get("translation") != "complete":
        return []
    path = problem_dir / "problem.md"
    if not path.is_file():
        return [f"{problem_dir}: translation marked complete but problem.md is missing"]
    text = path.read_text(encoding="utf-8")
    required = ("Problem / Đề bài", "Examples / Ví dụ", "Constraints / Ràng buộc")
    if any(marker not in text for marker in required):
        return [
            f"{problem_dir}: translation marked complete but problem.md is not bilingual"
        ]
    return []


def validate_interview(problem_dir: Path, meta: dict) -> list[str]:
    status = meta.get("content_status")
    if not isinstance(status, dict) or status.get("interview") != "complete":
        return []
    path = problem_dir / "interview.md"
    if not path.is_file():
        return [f"{problem_dir}: interview marked complete but interview.md is missing"]
    text = path.read_text(encoding="utf-8")
    required = (
        "Q (EN):",
        "Q (VI):",
        "Short answer (EN)",
        "Trả lời ngắn (VI)",
        "Standard answer (EN)",
        "Trả lời chuẩn (VI)",
    )
    if any(marker not in text for marker in required):
        return [
            f"{problem_dir}: interview marked complete but bilingual Q&A markers are missing"
        ]
    return []


def validate_cases(problem_dir: Path, meta: dict) -> list[str]:
    status = meta.get("content_status")
    if not isinstance(status, dict) or status.get("cases") != "complete":
        return []

    path = problem_dir / "cases.yaml"
    if not path.is_file():
        return [f"{problem_dir}: cases marked complete but cases.yaml is missing"]
    try:
        data = parse_yaml_subset(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return [f"{path}: cannot parse cases.yaml: {exc}"]

    errors: list[str] = []
    if data.get("schema_version") != 1:
        errors.append(f"{path}: schema_version must be 1")
    if data.get("problem_id") != meta.get("id"):
        errors.append(f"{path}: problem_id must match meta.yaml id")

    contract_type = data.get("contract_type")
    if contract_type not in ALLOWED_CONTRACT_TYPE:
        errors.append(f"{path}: invalid contract_type {contract_type!r}")

    contract = data.get("language_contract")
    if not isinstance(contract, dict):
        errors.append(f"{path}: language_contract must be a mapping")
    elif contract_type == "method":
        for key in ("class", "method", "parameters", "return_type"):
            if key not in contract:
                errors.append(f"{path}: method contract missing {key}")
        parameters = contract.get("parameters")
        if not isinstance(parameters, list):
            errors.append(f"{path}: method parameters must be a list")
        else:
            for parameter in parameters:
                if not isinstance(parameter, dict) or not {"name", "type"}.issubset(parameter):
                    errors.append(f"{path}: each method parameter requires name and type")
                    break
    elif contract_type == "operation-sequence" and "class" not in contract:
        errors.append(f"{path}: operation-sequence contract missing class")

    cases = data.get("cases")
    if not isinstance(cases, list) or not cases:
        errors.append(f"{path}: cases must be a non-empty list")
        return errors

    for index, case in enumerate(cases, start=1):
        label = f"{path}: case #{index}"
        if not isinstance(case, dict):
            errors.append(f"{label} must be a mapping")
            continue
        if not isinstance(case.get("name"), str):
            errors.append(f"{label} requires name")
        if case.get("source") not in ALLOWED_CASE_SOURCE:
            errors.append(f"{label} has invalid source {case.get('source')!r}")

        has_expected = "expected" in case
        has_mutation = "expected_mutation" in case
        if has_expected == has_mutation:
            errors.append(
                f"{label} must contain exactly one of expected or expected_mutation"
            )

        if contract_type == "method" and not isinstance(case.get("input"), dict):
            errors.append(f"{label} method case requires input mapping")
        if contract_type == "operation-sequence":
            for key in ("operations", "arguments", "expected"):
                if key not in case:
                    errors.append(f"{label} operation-sequence case missing {key}")
    return errors


def _git_blob_sha(path: Path) -> str:
    data = path.read_bytes().replace(b"\r\n", b"\n").replace(b"\r", b"\n")
    return hashlib.sha1(f"blob {len(data)}\0".encode("utf-8") + data).hexdigest()


def validate_source_provenance(root: Path, problem_dir: Path, meta: dict) -> list[str]:
    status = meta.get("content_status")
    if not isinstance(status, dict) or status.get("source") != "full-source":
        return []

    source = meta.get("source")
    if not isinstance(source, dict):
        return [f"{problem_dir}: full-source metadata requires source mapping"]
    raw_file = source.get("raw_file")
    raw_blob_sha = source.get("raw_blob_sha")
    if not isinstance(raw_file, str) or not isinstance(raw_blob_sha, str):
        return [
            f"{problem_dir}: full-source metadata requires source.raw_file and source.raw_blob_sha"
        ]
    if not re.fullmatch(r"[0-9a-f]{40}", raw_blob_sha):
        return [f"{problem_dir}: source.raw_blob_sha must be a 40-character hex SHA"]

    raw_root = root / "raw" / "top-interview-150"
    if raw_root.exists():
        raw_path = raw_root / raw_file
        if not raw_path.is_file():
            return [f"{problem_dir}: provenance raw file does not exist: {raw_file}"]
        actual = _git_blob_sha(raw_path)
        if actual != raw_blob_sha:
            return [
                f"{problem_dir}: provenance raw_blob_sha mismatch for {raw_file}: "
                f"expected {raw_blob_sha}, got {actual}"
            ]
    return []


def validate_media(problem_dir: Path, meta: dict) -> list[str]:
    errors: list[str] = []
    media = meta.get("media", [])
    if media is None:
        media = []
    if not isinstance(media, list):
        return [f"{problem_dir}/meta.yaml: media must be a list"]

    scopes_present: set[str] = set()
    for index, item in enumerate(media, start=1):
        label = f"{problem_dir}/meta.yaml: media #{index}"
        if not isinstance(item, dict):
            errors.append(f"{label} must be a mapping")
            continue
        required = {"id", "path", "scope", "role", "origin", "alt_en", "alt_vi"}
        missing = sorted(required - set(item))
        if missing:
            errors.append(f"{label} missing keys: {', '.join(missing)}")
            continue

        scope = item.get("scope")
        origin = item.get("origin")
        path_text = item.get("path")
        if scope not in ALLOWED_MEDIA_SCOPE:
            errors.append(f"{label} invalid scope {scope!r}")
            continue
        scopes_present.add(scope)
        if origin not in ALLOWED_MEDIA_ORIGIN:
            errors.append(f"{label} invalid origin {origin!r}")
        if origin == "external" and not item.get("source_url"):
            errors.append(f"{label} external media requires source_url")
        if not isinstance(path_text, str):
            errors.append(f"{label} path must be a string")
            continue

        if not path_text.startswith(f"assets/{scope}/"):
            errors.append(
                f"{problem_dir}: media scope/path mismatch: scope={scope}, path={path_text}"
            )
        if not (problem_dir / path_text).is_file():
            errors.append(f"{problem_dir}: media file does not exist: {path_text}")

    status = meta.get("content_status")
    if isinstance(status, dict):
        for scope, key in (("problem", "problem_media"), ("solution", "solution_media")):
            value = status.get(key)
            if value == "available" and scope not in scopes_present:
                errors.append(
                    f"{problem_dir}: {key}=available but no {scope} media is declared"
                )
            if value == "none" and scope in scopes_present:
                errors.append(f"{problem_dir}: {key}=none but {scope} media is declared")
    return errors


def validate_markdown_media_refs(problem_dir: Path) -> list[str]:
    errors: list[str] = []
    image_re = re.compile(r"!\[[^\]]*\]\(([^)]+)\)")
    for path in problem_dir.glob("*.md"):
        for target in image_re.findall(path.read_text(encoding="utf-8")):
            target = target.strip().split(" ", 1)[0]
            if target.startswith(("http://", "https://", "data:")):
                continue
            target = target.split("#", 1)[0]
            if target and not (path.parent / target).is_file():
                errors.append(f"{path}: referenced media does not exist: {target}")
    return errors


def extract_study_plan_ids(text: str) -> list[int]:
    ids: list[int] = []
    for line in text.splitlines():
        inline = re.match(r"^\s*problems:\s*\[([^\]]*)\]\s*$", line)
        if inline:
            for value in inline.group(1).split(","):
                value = value.strip()
                if value:
                    ids.append(int(value))
            continue

        structured = re.match(r"^\s*-\s+id:\s*(\d+)\s*$", line)
        if structured:
            ids.append(int(structured.group(1)))
            continue

        scalar = re.match(r"^\s*-\s+(\d+)\s*$", line)
        if scalar:
            ids.append(int(scalar.group(1)))
    return ids


def load_inventory_ids(root: Path) -> tuple[set[int] | None, list[str]]:
    path = root / "data" / "migration-inventory.json"
    if not path.is_file():
        return None, []
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        return None, [f"{path}: cannot parse inventory JSON: {exc}"]

    problems = data.get("problems")
    if not isinstance(problems, list):
        return None, [f"{path}: problems must be a list"]
    ids = [item.get("id") for item in problems if isinstance(item, dict)]
    integer_ids = [problem_id for problem_id in ids if isinstance(problem_id, int)]
    errors: list[str] = []
    if len(integer_ids) != 150 or len(set(integer_ids)) != 150:
        errors.append(
            f"{path}: Top Interview 150 inventory must contain exactly 150 unique problem IDs"
        )
    if data.get("unique_problem_count") != 150:
        errors.append(f"{path}: unique_problem_count must be 150")
    return set(integer_ids), errors


def validate_study_plan_refs(root: Path, inventory_ids: set[int] | None) -> list[str]:
    path = root / "study-plans" / "top-interview-150" / "index.yaml"
    if not path.is_file():
        return []
    ids = extract_study_plan_ids(path.read_text(encoding="utf-8"))
    errors: list[str] = []
    if len(ids) != 150 or len(set(ids)) != 150:
        errors.append(
            f"{path}: Top Interview 150 index must contain exactly 150 unique problem IDs"
        )
    if inventory_ids is not None:
        unknown = sorted(set(ids) - inventory_ids)
        if unknown:
            errors.append(f"{path}: unknown problem IDs: {', '.join(map(str, unknown))}")
    return errors


def validate_repository(root: Path) -> tuple[list[dict], list[str]]:
    records, errors = load_records(find_problem_dirs(root))
    for meta in records:
        problem_dir = meta["__dir__"]
        errors.extend(validate_required_meta(meta))
        errors.extend(validate_v2_content_status(problem_dir, meta))
        errors.extend(validate_bilingual_problem(problem_dir, meta))
        errors.extend(validate_interview(problem_dir, meta))
        errors.extend(validate_cases(problem_dir, meta))
        errors.extend(validate_source_provenance(root, problem_dir, meta))
        errors.extend(validate_media(problem_dir, meta))
        errors.extend(validate_markdown_media_refs(problem_dir))

    errors.extend(validate_unique_ids(records))
    errors.extend(validate_unique_slugs(records))
    inventory_ids, inventory_errors = load_inventory_ids(root)
    errors.extend(inventory_errors)
    errors.extend(validate_study_plan_refs(root, inventory_ids))
    return records, errors


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--root", default=".")
    args = parser.parse_args()

    root = Path(args.root).resolve()
    records, errors = validate_repository(root)
    if errors:
        for error in errors:
            print(f"FAIL: {error}")
        raise SystemExit(1)
    print(f"PASS: repository structure valid; {len(records)} canonical problems")


if __name__ == "__main__":
    main()
