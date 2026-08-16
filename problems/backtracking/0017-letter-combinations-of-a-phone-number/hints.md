# Hints / Gợi ý — 17. Letter Combinations of a Phone Number

## Hint 1

**EN:** Each digit gives you a small set of possible letters. Think of the answer as choosing one letter from each digit's set.

**VI:** Mỗi chữ số cho một nhóm chữ cái nhỏ. Hãy xem mỗi đáp án như việc chọn đúng một chữ cái từ nhóm của từng chữ số.

## Hint 2

**EN:** Build one combination from left to right. After choosing a letter for the current digit, recurse to the next digit.

**VI:** Xây dựng một tổ hợp từ trái sang phải. Sau khi chọn một chữ cái cho chữ số hiện tại, đệ quy sang chữ số kế tiếp.

## Hint 3

**EN:** Use a `StringBuilder` as the current path. Append before recursion and remove the last character when backtracking.

**VI:** Dùng `StringBuilder` làm đường đi hiện tại. `append` trước khi đệ quy và xóa ký tự cuối khi backtrack.
