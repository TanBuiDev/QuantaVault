#!/usr/bin/env python3
"""Validate or regenerate derived lesson Markdown + QuantaVault course.json.

Canonical content lives in questions/part-*/q-*.md. The script never edits source question files.
Usage:
  python tools/rebuild_course.py --check   # read-only consistency check
  python tools/rebuild_course.py --write   # regenerate lesson files and course.json
"""
from __future__ import annotations
import argparse, json, pathlib, re, sys
ROOT = pathlib.Path(__file__).resolve().parent.parent

def build():
    manifest=json.loads((ROOT/'course.json').read_text(encoding='utf-8'))
    index=json.loads((ROOT/'question-index.json').read_text(encoding='utf-8'))
    assert len(manifest['chapters']) == 8 and len(manifest['lessons']) == 18
    assert len(index)==155 and len(set(q['id'] for q in index))==155
    ids=set()
    results={}
    for lesson in manifest['lessons']:
        members=[item for item in index if item['lessonId']==lesson['id']]
        assert members, 'lesson has no questions '+lesson['id']
        lines=['# '+lesson['title'], '',
               '> Nội dung gồm '+str(len(members))+' mục câu hỏi từ PDF gốc; thứ tự câu hỏi và các mẫu trả lời được bảo toàn.',
               '', '---', '']
        for item in members:
            assert item['id'] not in ids, 'duplicate question '+item['id']
            ids.add(item['id'])
            text=(ROOT/item['filepath']).read_text(encoding='utf-8')
            assert text.startswith('---\n'), 'missing YAML frontmatter '+item['filepath']
            body=text.split('---', 2)[2].strip()
            body=re.sub(r'(?m)^(#{1,3}) ', lambda m:'#'+m.group(1)+' ',body)
            lines.extend([body,'','---',''])
        contents='\n'.join(lines).rstrip()+'\n'
        results[ROOT/'lessons'/(lesson['id']+'.md')]=contents
        lesson['contentMarkdown']=contents
    assert len(ids)==155, 'missing source questions'
    results[ROOT/'course.json']=json.dumps(manifest,ensure_ascii=False,indent=2)+'\n'
    return results

def main():
    parser=argparse.ArgumentParser()
    group=parser.add_mutually_exclusive_group(required=True)
    group.add_argument('--check',action='store_true',help='Compare generated outputs without modifying files')
    group.add_argument('--write',action='store_true',help='Regenerate derived outputs only')
    args=parser.parse_args()
    outputs=build()
    mismatches=[]
    for path,content in outputs.items():
        if not path.is_file() or path.read_text(encoding='utf-8')!=content:
            mismatches.append(str(path.relative_to(ROOT)))
            if args.write:
                path.parent.mkdir(parents=True,exist_ok=True)
                path.write_text(content,encoding='utf-8')
    if args.check and mismatches:
        print('INCONSISTENT:',', '.join(mismatches),file=sys.stderr)
        return 1
    print(f'OK: 155 canonical Markdown questions -> 18 lessons + course.json. Changed: {len(mismatches) if args.write else 0}')
    return 0

if __name__=='__main__':sys.exit(main())
