#!/usr/bin/env python3
"""Normalized comprehensive repair tool for EN/VI semantic formatting parity.

Rules:
1. Replaces raw parameter names & identifiers from cases.yaml / contract with inline code (`...`) in EN sentences.
2. Formats array indexing (e.g. `citations[i]`, `nums[j]`) and property access (`nums.length`).
3. Formats special index/order references (e.g. `i`th -> `i`th, `j`th -> `j`th).
4. Replaces math tokens / boolean values (`true`, `false`, `null`) when appropriate.
5. Strictly avoids double backticks (e.g. `` `s`.length `` or ``` `nums` ```).
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Any, List, Set, Tuple

if sys.stdout.encoding.lower() != "utf-8":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass


def extract_contract_identifiers(problem_dir: Path) -> Set[str]:
    """Extract parameter names, method name, return type from cases.yaml."""
    tokens = set()
    cases_file = problem_dir / "cases.yaml"
    if cases_file.is_file():
        content = cases_file.read_text(encoding="utf-8")
        # Extract parameter names
        param_matches = re.findall(r"name:\s*([a-zA-Z_][a-zA-Z0-9_]*)", content)
        for p in param_matches:
            if p not in ("example-1", "example-2", "example-3", "Solution"):
                tokens.add(p)
    return tokens


def repair_problem_statement(filepath: Path) -> Tuple[str, List[str]]:
    content = filepath.read_text(encoding="utf-8")
    lines = content.splitlines()
    new_lines = []
    changes = []

    problem_dir = filepath.parent
    contract_tokens = extract_contract_identifiers(problem_dir)
    
    # Standard common algorithm / data structure identifiers
    extra_tokens = {
        "true", "false", "null", "TreeNode", "ListNode", "Node",
        "root", "head", "val", "left", "right", "next", "prev", "random",
        "grid", "matrix", "board", "points", "intervals"
    }
    all_tokens = contract_tokens | extra_tokens

    # Look for matching EN/VI pairs
    i = 0
    while i < len(lines):
        line = lines[i]
        orig = line

        if line.startswith("> **EN:**"):
            # 1. Format array indexing first: e.g. citations[i] -> `citations[i]`
            # Pattern: \b(word)\[([a-zA-Z0-9_]+)\]
            def repl_indexed(m):
                full = m.group(0)
                # If already enclosed in backticks, skip
                return f"`{full}`"

            # 2. Format `i`th, `j`th, `k`th
            line = re.sub(r"(?<!`)\b([ijk])th\b(?!`)", r"`\1`th", line)

            # 3. Format known array indexing tokens: name[i], name[i][j], etc.
            line = re.sub(r"(?<!`)\b([a-zA-Z_][a-zA-Z0-9_]*\[[a-zA-Z0-9_]+\](?:\[[a-zA-Z0-9_]+\])?)(?!`)", r"`\1`", line)

            # 4. Format known identifiers
            # Sort by length descending
            sorted_tokens = sorted(all_tokens, key=len, reverse=True)
            for tok in sorted_tokens:
                if len(tok) == 1 and tok in ("a", "A", "I"):  # Avoid English words 'a', 'I'
                    continue
                # Replace whole word not surrounded by backticks or dots
                pattern = r"(?<![`\.\w])" + re.escape(tok) + r"(?![`\w])"
                line = re.sub(pattern, f"`{tok}`", line)

            # Clean any double backtick bugs like `` `nums` `` or ` `nums` `
            line = re.sub(r"`+([^`]+)`+", r"`\1`", line)
            # Clean accidental nested backtick within brackets: e.g. `matrix[`i`][`j`]` -> `matrix[i][j]`
            line = re.sub(r"`([a-zA-Z0-9_]+)\[`?([a-zA-Z0-9_]+)`?\](?:\[`?([a-zA-Z0-9_]+)`?\])?`", r"`\1[\2]`", line)

        if line != orig:
            changes.append(f"'{orig.strip()}' -> '{line.strip()}'")
        new_lines.append(line)
        i += 1

    return "\n".join(new_lines) + "\n", changes


def main():
    parser = argparse.ArgumentParser(description="Repair all EN identifiers.")
    parser.add_argument("--apply", action="store_true", help="Apply changes directly")
    args = parser.parse_args()

    problem_files = sorted(Path("problems").glob("*/*/problem.md"))
    total_mod = 0
    total_changes = 0

    for file in problem_files:
        new_content, changes = repair_problem_statement(file)
        if changes:
            total_mod += 1
            total_changes += len(changes)
            print(f"Problem {file.parent.name}: {len(changes)} repairs")
            for c in changes[:3]:
                print(f"  {c}")
            if len(changes) > 3:
                print(f"  ... and {len(changes) - 3} more")
            if args.apply:
                file.write_text(new_content, encoding="utf-8")

    print(f"\nTotal: {total_mod} files modified, {total_changes} changes.")


if __name__ == "__main__":
    main()
