# 224. Basic Calculator — Hints / Gợi ý

## Hint 1

**EN:** Since the expression contains only `+`, `-`, parentheses, numbers, and spaces, you do not need operator precedence beyond handling parentheses.

**VI:** Vì expression chỉ có `+`, `-`, parentheses, number và space nên không cần xử lý precedence phức tạp ngoài parentheses.

## Hint 2

**EN:** Keep a running `result`, a current `number`, and a `sign` (`+1` or `-1`). Commit the current number whenever you encounter `+`, `-`, `)`, or the end.

**VI:** Giữ `result`, current `number` và `sign` (`+1`/`-1`). Khi gặp operator hoặc đóng parenthesis, cộng `sign * number` vào running result.

## Hint 3

**EN:** When you enter `(`, save the result and sign from the outer context, then start a fresh inner expression.

**VI:** Khi gặp `(`, lưu outer `result` và `sign` vào stack rồi reset để evaluate expression bên trong.

## Hint 4

**EN:** On `)`, finish the inner expression, multiply it by the saved sign, and add the saved outer result.

**VI:** Khi gặp `)`, hoàn tất inner result rồi ghép lại theo công thức `outerResult + outerSign * innerResult`.
