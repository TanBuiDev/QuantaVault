# 20. Valid Parentheses — Hints / Gợi ý

## Hint 1

**EN:** When you see a closing bracket, it must match the most recently opened bracket that has not been closed yet.

**VI:** Khi gặp dấu ngoặc đóng, nó phải khớp với dấu ngoặc mở gần nhất nhưng chưa được đóng.

## Hint 2

**EN:** Which data structure naturally gives you access to the most recent unmatched opening bracket?

**VI:** Cấu trúc dữ liệu nào cho phép lấy phần tử mở gần nhất theo thứ tự LIFO?

## Hint 3

**EN:** Use a stack. A useful variation is to push the expected closing bracket instead of the opening bracket.

**VI:** Dùng stack. Một biến thể gọn là push trực tiếp dấu ngoặc đóng mà ta đang mong đợi, thay vì push dấu ngoặc mở.

## Hint 4

**EN:** A closing bracket is invalid if the stack is empty or its value does not equal the stack top. At the end, the stack must also be empty.

**VI:** Khi gặp closing bracket, chuỗi sai nếu stack rỗng hoặc top không khớp. Cuối chuỗi stack cũng phải rỗng để bảo đảm không còn opening bracket chưa đóng.
