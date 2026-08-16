# 71. Simplify Path — Hints / Gợi ý

## Hint 1

**EN:** Think in terms of path components separated by `/`, not individual characters.

**VI:** Hãy xử lý theo từng path component được ngăn bởi `/`, không cần thao tác từng ký tự.

## Hint 2

**EN:** Empty components and `.` do not change the current directory.

**VI:** Token rỗng và `.` không làm thay đổi current directory nên có thể bỏ qua.

## Hint 3

**EN:** `..` means removing the most recent real directory, if one exists. Which data structure supports that naturally?

**VI:** `..` nghĩa là bỏ directory thật gần nhất nếu có. Stack/Deque hỗ trợ thao tác này tự nhiên.

## Hint 4

**EN:** Every other non-empty token—including `...`—is a valid directory name. Join the remaining stack with one slash and prefix the result with `/`.

**VI:** Mọi token non-empty khác, kể cả `...`, đều là directory name hợp lệ. Cuối cùng join stack bằng một slash và thêm `/` ở đầu.
