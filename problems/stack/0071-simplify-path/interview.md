# 71. Simplify Path — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I split the Unix path by `/` and process each component with a deque. Empty tokens and `.` are ignored, `..` removes the most recent real directory if one exists, and every other token—including `...`—is a valid directory name. Finally I join the deque with single slashes and prefix `/`. The solution is linear in the path length.

**VI:** Em split path theo `/`, xử lý từng component bằng deque. Empty token và `.` bỏ qua, `..` pop directory gần nhất nếu có, còn mọi token khác kể cả `...` đều là tên hợp lệ. Cuối cùng join bằng một slash và thêm `/` ở đầu.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Core practice question

**Q (EN):** Why is a stack or deque useful for simplifying the path?

**Q (VI):** Vì sao stack/deque phù hợp với bài này?

### Short answer (EN)

Because `..` removes the most recently entered real directory.

### Trả lời ngắn (VI)

Vì `..` luôn hủy directory thật gần nhất vừa đi vào.

### Standard answer (EN)

Normal directory names extend the current path, while `..` reverses the most recent extension. That is a last-in-first-out operation, so a stack-like structure models the navigation naturally.

### Trả lời chuẩn (VI)

Directory name bình thường thêm một level, còn `..` hủy level gần nhất. Đây là LIFO nên stack/deque mô hình hóa trực tiếp.

### Q2 — Core practice question

**Q (EN):** How do you handle multiple consecutive slashes?

**Q (VI):** Bạn xử lý nhiều slash liên tiếp thế nào?

### Short answer (EN)

Splitting by `/` produces empty components, and I simply ignore them.

### Trả lời ngắn (VI)

Split theo `/` tạo empty token và em bỏ qua chúng.

### Standard answer (EN)

I do not need a separate slash-collapsing pass. Consecutive separators naturally create empty tokens, and skipping those tokens makes `//` or `///` equivalent to a single separator in the rebuilt path.

### Trả lời chuẩn (VI)

Không cần normalize slash riêng. Consecutive slash tạo empty token; bỏ empty token rồi rebuild bằng đúng một `/` sẽ tự chuẩn hóa path.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** Why do you ignore `..` when the deque is empty?

**Q (VI):** Vì sao bỏ qua `..` khi deque rỗng?

### Short answer (EN)

An absolute path cannot move above the root directory.

### Trả lời ngắn (VI)

Absolute path không thể đi cao hơn root.

### Standard answer (EN)

An empty deque means the canonical path is currently `/`. The Unix rule in this problem says moving to the parent from root has no effect, so there is no directory to remove and the correct action is a no-op.

### Trả lời chuẩn (VI)

Deque rỗng nghĩa là đang ở root `/`. Đi parent từ root không thay đổi location, nên không pop gì là đúng.

### Q4 — Common reasoning check

**Q (EN):** Why is `...` treated as a directory name rather than as parent navigation?

**Q (VI):** Vì sao `...` là directory name chứ không phải parent navigation?

### Short answer (EN)

Only the exact tokens `.` and `..` have special meaning in the problem.

### Trả lời ngắn (VI)

Chỉ token chính xác `.` và `..` mới có semantic đặc biệt.

### Standard answer (EN)

The statement explicitly says any other sequence of periods is a valid name. Therefore the parser must compare tokens by exact equality; using prefix checks or counting dots would incorrectly change valid directory names.

### Trả lời chuẩn (VI)

Đề nói rõ mọi chuỗi dot khác là tên hợp lệ. Vì vậy phải check equality chính xác, không được suy diễn theo prefix hoặc số lượng dấu chấm.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5 — Core practice question

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(n)` space, where `n` is the path length.

### Trả lời ngắn (VI)

`O(n)` time và `O(n)` space với `n = path.length()`.

### Standard answer (EN)

The total size of all split tokens is linear in the input length, each component is processed once, and the final join also writes at most linear output. The deque can hold a linear amount of directory text in the worst case.

### Trả lời chuẩn (VI)

Tổng kích thước token là tuyến tính theo input; mỗi component xử lý một lần và output cũng tuyến tính. Deque có thể giữ gần toàn bộ path trong worst case.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — Likely follow-up

**Q (EN):** What does your code return for `/../`?

**Q (VI):** Code trả gì cho `/../`?

### Short answer (EN)

It returns `/`.

### Trả lời ngắn (VI)

Kết quả là `/`.

### Standard answer (EN)

The `..` token sees an empty deque, so it cannot remove a directory. The final join is empty and prefixing `/` yields the root path.

### Trả lời chuẩn (VI)

`..` gặp deque rỗng nên không pop. Join empty deque rồi prefix `/` cho đúng root.

### Q7 — Likely follow-up

**Q (EN):** How do you avoid a trailing slash in the result?

**Q (VI):** Làm sao tránh trailing slash?

### Short answer (EN)

I join directory names with `/` rather than appending a slash after each one.

### Trả lời ngắn (VI)

Em join các directory bằng `/` thay vì append slash sau từng directory.

### Standard answer (EN)

`String.join("/", directories)` inserts separators only between components. Adding one leading slash produces either `/a/b` or `/` for an empty deque, so no special trailing-slash cleanup is needed.

### Trả lời chuẩn (VI)

`String.join` chỉ đặt separator giữa components. Thêm một leading slash cho ra `/a/b` hoặc `/`, nên không cần cleanup trailing slash riêng.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q8 — Likely follow-up

**Q (EN):** Could you parse the path character by character instead of using `split`?

**Q (VI):** Có thể parse từng character thay vì dùng `split` không?

### Short answer (EN)

Yes. It can avoid regex splitting, but the code is longer and the asymptotic complexity stays linear.

### Trả lời ngắn (VI)

Có. Nó tránh regex split nhưng code dài hơn và complexity vẫn `O(n)`.

### Standard answer (EN)

A manual parser can build each token between slashes and apply the same stack rules. That may reduce temporary token allocations in a highly optimized implementation, but for interview code `split` keeps the logic clearer and less error-prone.

### Trả lời chuẩn (VI)

Manual parser vẫn áp dụng cùng stack rules, có thể giảm allocation trong implementation tối ưu sâu. Nhưng trong interview, `split` giúp code rõ và ít lỗi hơn.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q9 — Code walkthrough

**Q (EN):** Why do you use `addLast` and `removeLast` on the deque?

**Q (VI):** Vì sao dùng `addLast/removeLast`?

### Short answer (EN)

They treat the end of the deque as the current deepest directory while preserving root-to-leaf iteration order.

### Trả lời ngắn (VI)

Cuối deque là current deepest directory, đồng thời iteration order vẫn root-to-leaf.

### Standard answer (EN)

Appending real directories at the end mirrors moving deeper into the path, and removing the last item mirrors `..`. Because deque iteration is from first to last, I can join it directly without reversing the result.

### Trả lời chuẩn (VI)

Add cuối tương ứng đi sâu hơn, remove cuối tương ứng parent. Iteration từ đầu tới cuối đã đúng root-to-leaf nên không cần reverse trước khi join.

---

## 8. Follow-up variations / Biến thể follow-up

- Nếu input là relative path, cần giữ semantic khác khi `..` vượt phần prefix đã biết.
- Nếu cần hỗ trợ Windows paths, separator và drive/root semantics thay đổi.
- Nếu muốn giảm allocation, có thể manual-tokenize bằng indices.
- Nếu path components có symbolic links, lexical simplification này không đủ để resolve filesystem thật.
- Nếu cần preserve trailing slash metadata, output contract sẽ khác bài hiện tại.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Treat `...` như `..`.
- Pop khi đang ở root.
- Rebuild path với double slash hoặc trailing slash.
- Quên bỏ empty token từ repeated slash.
- Reverse stack sai order khi output.
- Nhầm lexical canonicalization với filesystem symlink resolution.

---

## 10. Useful phrases and vocabulary / Cụm từ hữu ích

- **"I tokenize the path by slash."** — Em tách path thành token theo slash.
- **"Empty components and the current-directory marker are no-ops."** — Empty component và `.` không làm thay đổi path.
- **"Parent navigation removes the most recent real directory."** — `..` loại directory thật gần nhất.
- **"We cannot move above the root directory."** — Ta không thể đi cao hơn root.
- **"Only exact `.` and `..` tokens are special."** — Chỉ token chính xác `.` và `..` là đặc biệt.
- **canonicalization** — chuẩn hóa về dạng canonical.
- **path component** — thành phần đường dẫn.
- **separator normalization** — chuẩn hóa dấu phân cách.
