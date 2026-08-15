# 392. Is Subsequence — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use two forward pointers. One points to the next character I need from `s`, and the other scans `t`. Whenever the characters match, I advance the `s` pointer; I always advance the `t` pointer. Choosing the earliest available match is safe because it leaves the largest possible suffix of `t` for the remaining characters. At the end, `s` is a subsequence exactly when every character of `s` was matched. This is `O(|t|)` time and `O(1)` extra space.

**VI:** Em dùng hai forward pointers. Một pointer trỏ character tiếp theo cần match trong `s`, pointer kia scan `t`. Khi hai character bằng nhau em tăng pointer của `s`; pointer `t` luôn tăng. Chọn occurrence sớm nhất là an toàn vì để lại suffix `t` lớn nhất cho phần còn lại. Cuối cùng `s` là subsequence khi mọi character đã match. `O(|t|)` time và `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is matching the earliest possible occurrence safe?

**Q (VI):** Vì sao chọn occurrence sớm nhất là an toàn?

### Short answer (EN)

An earlier match leaves at least as much of `t` available for the remaining characters as any later match.

### Trả lời ngắn (VI)

Match sớm hơn luôn để lại ít nhất nhiều suffix của `t` bằng match muộn hơn.

### Standard answer (EN)

Suppose a valid solution matches the current `s` character at a later position in `t`. If an equal character exists earlier, replacing the later match with the earlier one preserves the order of all previous matches and only increases the available suffix for future matches. Therefore the greedy choice cannot destroy a solution.

### Trả lời chuẩn (VI)

Giả sử một solution hợp lệ match current character ở vị trí muộn hơn. Nếu có occurrence giống sớm hơn, thay match muộn bằng match sớm vẫn giữ thứ tự các match trước và chỉ làm suffix còn lại lớn hơn. Vì vậy greedy không thể phá solution.

### Deep answer (EN)

This is an exchange argument: any feasible matching can be transformed so its current matched position is the earliest feasible one without harming feasibility of the rest. Repeating that exchange justifies the full greedy scan.

### Trả lời sâu (VI)

Đây là exchange argument: mọi matching hợp lệ đều có thể thay current match bằng earliest feasible position mà không làm hỏng phần còn lại. Lặp lập luận này chứng minh toàn bộ greedy scan.

---

### Q2

**Q (EN):** What is the difference between a substring and a subsequence?

**Q (VI):** Substring và subsequence khác nhau thế nào?

### Short answer (EN)

A substring must be contiguous; a subsequence only preserves relative order and may skip characters.

### Trả lời ngắn (VI)

Substring phải liên tiếp; subsequence chỉ cần giữ thứ tự tương đối và được phép bỏ qua characters.

---

### Q3

**Q (EN):** What are the complexities for one query?

**Q (VI):** Độ phức tạp cho một query là gì?

### Short answer (EN)

`O(|t|)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(|t|)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

The `t` pointer moves from left to right once. The `s` pointer only advances on matches and never moves backward.

### Trả lời chuẩn (VI)

Pointer `t` đi trái → phải đúng một lần; pointer `s` chỉ tăng khi match và không lùi.

---

### Q4

**Q (EN):** How would you optimize for billions of queries against the same `t`?

**Q (VI):** Nếu có hàng tỷ query cùng một `t`, bạn tối ưu thế nào?

### Short answer (EN)

Preprocess the positions of each character in `t`, then binary-search the next valid occurrence for each character of a query.

### Trả lời ngắn (VI)

Preprocess danh sách vị trí của từng character trong `t`, rồi binary-search occurrence kế tiếp cho từng character của query.

### Standard answer (EN)

I build 26 sorted position lists in `O(|t|)`. For a query, I keep the last selected position and, for each character, binary-search its list for the smallest index greater than that position. If none exists, the query fails. This changes repeated-query cost to roughly `O(|s| log |t|)`.

### Trả lời chuẩn (VI)

Em xây 26 sorted position lists trong `O(|t|)`. Với mỗi query giữ last selected position; từng character binary-search index nhỏ nhất lớn hơn position đó. Nếu không có thì fail. Query cost còn khoảng `O(|s| log |t|)`.

### Deep answer (EN)

If memory is less constrained, a next-occurrence automaton/table can preprocess for every position and every character where the next occurrence lies, yielding `O(|s|)` per query at `O(26|t|)` memory. The right design depends on the query volume and memory budget.

### Trả lời sâu (VI)

Nếu memory dư hơn, có thể build next-occurrence table cho mỗi position × character, giúp query `O(|s|)` với memory `O(26|t|)`. Chọn design tùy query volume và memory budget.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích implementation không?

**EN:** I initialize both indices to zero. While neither string is exhausted, I compare the current characters. A match advances the `s` index because one required character is satisfied. The `t` index always advances because each target character is considered once. At the end I check whether the `s` index reached `s.length()`.

**VI:** Em khởi tạo hai index bằng `0`. Khi chưa hết chuỗi, em compare current characters. Match thì tăng `sIndex` vì đã đáp ứng một required character. `tIndex` luôn tăng vì mỗi target character chỉ xét một lần. Cuối cùng kiểm tra `sIndex == s.length()`.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Nhầm subsequence với substring.
- Không giải thích earliest-match greedy.
- Follow-up nhiều query nhưng không preprocess `t`.
- Dùng DP `O(|s||t|)` cho boolean query đơn giản dù two pointers đủ.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- subsequence — dãy con giữ thứ tự
- relative order — thứ tự tương đối
- earliest occurrence — lần xuất hiện sớm nhất
- incoming queries — các truy vấn đến liên tục
- preprocess positions — tiền xử lý vị trí
- next occurrence — lần xuất hiện kế tiếp
- exchange argument — lập luận hoán đổi
