#!/usr/bin/env python3
import os
import re
import sys
from pathlib import Path

if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

ROOT_DIR = Path(__file__).resolve().parent.parent
PROBLEMS_DIR = ROOT_DIR / "problems"

def strip_java_comments_and_whitespace(code: str) -> str:
    code = re.sub(r'/\*[\s\S]*?\*/', '', code)
    code = re.sub(r'//.*', '', code)
    return re.sub(r'\s+', '', code)

def count_comments(code: str) -> tuple[int, int]:
    lines = code.splitlines()
    comment_lines = 0
    code_lines = 0
    in_block = False

    for line in lines:
        s = line.strip()
        if not s:
            continue
        if in_block:
            comment_lines += 1
            if "*/" in s:
                in_block = False
            continue
        if s.startswith("/*"):
            comment_lines += 1
            if "*/" not in s:
                in_block = True
            continue
        if s.startswith("//"):
            comment_lines += 1
            continue
        code_lines += 1

    return comment_lines, code_lines

def extract_optimal_java_from_md(md_content: str) -> str | None:
    # Ưu tiên đúng section Optimal Java solution thay vì lấy code block Java đầu tiên,
    # vì nhiều bài có snippet Java minh họa ở các section Observation/Algorithm phía trên.
    section_match = re.search(
        r'(?ims)^##\s+(?:\d+\.\s*)?Optimal Java solution[^\n]*\n(.*?)(?=^##\s+|\Z)',
        md_content,
    )
    if section_match:
        code_match = re.search(r'```java\s*([\s\S]*?)\s*```', section_match.group(1))
        if code_match:
            return code_match.group(1).strip()

    # Fallback cho tài liệu legacy chưa được migration sang heading Optimal Java solution.
    match = re.search(r'```java\s*([\s\S]*?)\s*```', md_content)
    if match:
        return match.group(1).strip()
    return None

def audit_all():
    results = []
    sections = sorted([d for d in PROBLEMS_DIR.iterdir() if d.is_dir()])
    
    total = 0
    annotated = 0
    synced = 0

    section_stats = {}

    for section in sections:
        problem_dirs = sorted([d for d in section.iterdir() if d.is_dir()])
        sec_total = 0
        sec_annotated = 0
        
        for pdir in problem_dirs:
            sol_java = pdir / "Solution.java"
            sol_md = pdir / "solution.md"
            
            if not sol_java.exists():
                continue
                
            total += 1
            sec_total += 1
            java_content = sol_java.read_text(encoding="utf-8")
            comm_cnt, code_cnt = count_comments(java_content)
            
            is_annotated = comm_cnt >= 2
            if is_annotated:
                annotated += 1
                sec_annotated += 1
                
            is_synced = False
            if sol_md.exists():
                md_content = sol_md.read_text(encoding="utf-8")
                extracted_java = extract_optimal_java_from_md(md_content)
                if extracted_java:
                    sem_java = strip_java_comments_and_whitespace(java_content)
                    sem_md = strip_java_comments_and_whitespace(extracted_java)
                    if sem_java == sem_md:
                        is_synced = True
                        synced += 1
            
            results.append({
                "section": section.name,
                "problem": pdir.name,
                "comments": comm_cnt,
                "code_lines": code_cnt,
                "annotated": is_annotated,
                "synced": is_synced
            })
            
        section_stats[section.name] = (sec_annotated, sec_total)

    print(f"\n================ BÁO CÁO TIẾN ĐỘ CHÚ THÍCH JAVA 150 BÀI ================")
    print(f"Tổng số bài tập:             {total}")
    print(f"Số bài đã có chú thích WHY:  {annotated}/{total} ({annotated*100//total if total else 0}%)")
    print(f"Số bài đồng bộ Solution/md:  {synced}/{total} ({synced*100//total if total else 0}%)")
    print("--------------------------------------------------------------------------")
    print(f"{'CHUYÊN ĐỀ (SECTION)':<28} | {'TIẾN ĐỘ':<12} | {'TỶ LỆ'}")
    print("--------------------------------------------------------------------------")
    for sec_name, (ann, tot) in section_stats.items():
        pct = f"{ann*100//tot}%" if tot else "0%"
        print(f"{sec_name:<28} | {ann}/{tot:<9} | {pct}")
    print("==========================================================================\n")

if __name__ == "__main__":
    audit_all()
