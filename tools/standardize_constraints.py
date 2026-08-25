import os
import re

PROBLEMS_DIR = os.path.join(os.path.dirname(__file__), "..", "problems")

def is_math_constraint(en_text):
    # Dấu hiệu của ràng buộc toán học
    symbols = ["<=", ">=", "==", "!=", "<", ">", "^", "10^", "2^", "length"]
    # Kiểm tra xem có chứa phép so sánh số học không
    has_comparison = any(op in en_text for op in ["<=", ">=", "==", "!=", "<", ">"])
    has_math = any(op in en_text for op in ["^", "*", "+", "-", "length"])
    return has_comparison or (has_math and not any(w in en_text.lower() for w in ["at most", "at least", "consists", "guaranteed", "contain", "there will"]))

def fix_problem_constraints(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Tìm phần Constraints / Ràng buộc
    constraints_match = re.search(r"## Constraints / Ràng buộc\s*\n\n(.*?)(?=\n## |\Z)", content, re.DOTALL)
    if not constraints_match:
        return False

    orig_block = constraints_match.group(1)
    
    # Phân tích từng cặp EN / VI trong block Constraints
    # Pattern: > **EN:** (.*?)\n>\n> **VI:** (.*?)(?=\n\n|\Z)
    pair_pattern = re.compile(r"> \*\*EN:\*\* (.*?)\n>\n> \*\*VI:\*\* (.*?)(?=\n\n|\Z)", re.DOTALL)
    
    replacements = []
    
    for match in pair_pattern.finditer(orig_block):
        full_match = match.group(0)
        en_text = match.group(1).strip()
        vi_text = match.group(2).strip()

        # Làm sạch EN text (bỏ backticks thừa bên trong nếu có)
        # Nếu dòng EN là một biểu thức toán học hoặc range toán học
        # Ví dụ: `-2^31 <= `val` <= 2^31 - 1` hoặc `1 <= `nums.length` <= 10^5`
        # Mà dòng VI lại bị diễn giải bằng chữ: "nằm trong miền số nguyên..." hoặc "Độ dài..."
        
        # Biến đổi clean cho toán học
        clean_en = en_text.replace("`", "").strip()
        
        # Nếu VI chứa các cụm dịch diễn giải làm mất số
        paraphrase_phrases = [
            "nằm trong miền số nguyên",
            "miền số nguyên 32-bit",
            "được nêu trong đề nguồn",
            "miền giá trị số nguyên",
            "khoảng từ",
            "nằm trong khoảng",
        ]
        
        should_replace_math = any(p in vi_text for p in paraphrase_phrases) or (
            ("32-bit" in vi_text or "nguyên" in vi_text) and any(op in en_text for op in ["<=", ">=", "^"])
        )
        
        if should_replace_math:
            # Tạo bản dịch VI chuẩn dạng biểu thức toán học có code tag
            # Ví dụ: `-2^31 <= val <= 2^31 - 1` -> `$-2^{31} \le val \le 2^{31} - 1$` hoặc format chuẩn dạng code: `-2^31 <= val <= 2^31 - 1`
            formatted_en = f"`{clean_en}`" if not (clean_en.startswith("`") and clean_en.endswith("`")) else clean_en
            new_vi = formatted_en
            
            new_pair = f"> **EN:** {en_text}\n>\n> **VI:** {new_vi}"
            replacements.append((full_match, new_pair))

    if not replacements:
        return False

    new_block = orig_block
    for old_pair, new_pair in replacements:
        new_block = new_block.replace(old_pair, new_pair)

    if new_block != orig_block:
        new_content = content.replace(orig_block, new_block)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(new_content)
        return True

    return False

def main():
    count = 0
    for root, _, files in os.walk(PROBLEMS_DIR):
        if "problem.md" in files:
            path = os.path.join(root, "problem.md")
            if fix_problem_constraints(path):
                count += 1
                print(f"Fixed constraints in: {os.path.relpath(path, PROBLEMS_DIR)}")
    print(f"Total problems with fixed math constraints: {count}")

if __name__ == "__main__":
    main()
