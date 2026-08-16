# Hints / Gợi ý

1. **EN:** Try every cell as a possible starting position for the first character.
   **VI:** Thử mỗi ô như một vị trí bắt đầu tiềm năng cho ký tự đầu tiên.

2. **EN:** From a matching cell, explore only four directions and advance to the next character.
   **VI:** Từ một ô khớp, chỉ đi theo bốn hướng và chuyển sang ký tự kế tiếp.

3. **EN:** Mark the current cell as used before recursing, then restore it when backtracking.
   **VI:** Đánh dấu ô hiện tại đã dùng trước khi đệ quy và khôi phục lại khi quay lui.

4. **EN:** Stop a branch immediately when coordinates are out of bounds or the character does not match.
   **VI:** Dừng nhánh ngay khi vượt biên hoặc ký tự không khớp.

5. **EN:** The recursion depth is bounded by `word.length`.
   **VI:** Độ sâu đệ quy tối đa bằng `word.length`.
