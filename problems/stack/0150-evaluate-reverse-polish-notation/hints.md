# 150. Evaluate Reverse Polish Notation — Hints / Gợi ý

## Hint 1

**EN:** In postfix notation, an operator appears only after both of its operands have already been evaluated.

**VI:** Trong postfix/RPN, operator chỉ xuất hiện sau khi cả hai operand cần thiết đã có kết quả.

## Hint 2

**EN:** Store unresolved operand values. When an operator appears, consume the two most recent values.

**VI:** Hãy lưu các operand/intermediate result chưa được dùng. Khi gặp operator, lấy hai giá trị gần nhất.

## Hint 3

**EN:** A stack matches this evaluation order. For a number, push it; for an operator, pop two operands, compute, then push the result.

**VI:** Stack phù hợp tự nhiên: number thì push; operator thì pop hai operand, tính toán rồi push intermediate result trở lại.

## Hint 4

**EN:** Operand order matters for `-` and `/`: the first value popped is the **right** operand, and the second value popped is the **left** operand.

**VI:** Thứ tự cực kỳ quan trọng với `-` và `/`: giá trị pop đầu tiên là operand bên phải, pop thứ hai là operand bên trái.
