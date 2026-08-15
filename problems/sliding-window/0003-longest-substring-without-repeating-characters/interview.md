# 3. Longest Substring Without Repeating Characters — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I maintain a sliding window with no duplicate characters and a map from each character to its most recent index. When I see a repeated character that is still inside the current window, I move the left boundary directly past its previous occurrence. I never move left backward, so I use `max(left, previous + 1)`. Each index is processed once, giving `O(n)` time.

**VI:** Em duy trì sliding window không có duplicate và map từ character tới index gần nhất. Khi gặp character lặp còn nằm trong current window, em nhảy left qua lần xuất hiện trước. Left không được lùi nên dùng `max(left, previous+1)`. Mỗi index xử lý một lần nên `O(n)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** What invariant does your window maintain?

**Q (VI):** Window của bạn duy trì invariant gì?

### Short answer (EN)

The current window contains no duplicate characters.

### Trả lời ngắn (VI)

Current window không chứa duplicate character.

### Standard answer (EN)

After processing each `right`, `s[left..right]` is a valid substring with unique characters, and it is the longest such substring ending at `right` that my current boundary can represent.

### Trả lời chuẩn (VI)

Sau mỗi `right`, `s[left..right]` là valid substring không lặp và là window dài nhất kết thúc tại `right` sau khi loại duplicate cần thiết.

### Q2

**Q (EN):** Why do you use `max(left, previous + 1)`?

**Q (VI):** Vì sao dùng `max(left, previous + 1)`?

### Short answer (EN)

A repeated character may have last appeared before the current window, so its old index must not move `left` backward.

### Trả lời ngắn (VI)

Character có thể lặp ở vị trí đã nằm ngoài window; index cũ không được làm `left` lùi lại.

### Standard answer (EN)

In `"abba"`, after processing the second `b`, `left` is already `2`. The final `a` was previously at `0`; setting `left=1` would reintroduce duplicate `b`. Taking the maximum preserves monotonic left movement.

### Trả lời chuẩn (VI)

Trong `"abba"`, sau `b` thứ hai thì `left=2`. `a` cuối có previous index `0`; gán `left=1` sẽ kéo window lùi và đưa duplicate `b` trở lại. `max` giữ left monotonic.

### Q3

**Q (EN):** Why is the algorithm linear despite using a sliding window?

**Q (VI):** Vì sao thuật toán là linear?

**EN:** The right pointer visits every index once, and the left boundary only moves forward. With average `O(1)` hash-map operations, total work is `O(n)`.

**VI:** Right đi qua mỗi index một lần và left chỉ tiến. Hash-map trung bình `O(1)`, nên tổng `O(n)`.

### Q4

**Q (EN):** Could you use a set instead of last-seen indices?

**Q (VI):** Có thể dùng set không?

**EN:** Yes. I can remove characters from the left until the duplicate disappears. That is also `O(n)`, but last-seen indices allow a direct jump and make the boundary logic explicit.

**VI:** Có. Có thể remove từ left cho tới khi duplicate biến mất; vẫn `O(n)`. Last-seen map cho phép jump trực tiếp.

---

## 3. Likely follow-up / Câu hỏi mở rộng

**Q (EN):** What if I need the substring itself rather than its length?

**Q (VI):** Nếu cần trả substring thay vì length thì sao?

**EN:** I store the best start index whenever the current window length beats the previous best, then return `s.substring(bestStart, bestStart + bestLength)`.

**VI:** Khi current window dài hơn best cũ, em lưu best start; cuối cùng trả substring theo start và length đó.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through your code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** For each right index I read the character, look up its latest position, and advance left if that position conflicts with the current window. Then I update the latest position and compute the current length.

**VI:** Với mỗi right, em đọc character, lookup latest position, tăng left nếu position đó conflict với current window, rồi update latest position và current length.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Quên `Math.max` cho left.
- Không nêu rõ invariant unique-window.
- Nhầm substring với subsequence.
- Cho rằng nested shrinking với set tự động là `O(n²)` mà không amortized analysis.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- duplicate character — ký tự lặp
- last seen index — index xuất hiện gần nhất
- window boundary — biên cửa sổ
- move monotonically — di chuyển đơn điệu
- substring — chuỗi con liên tiếp
- subsequence — dãy con không cần liên tiếp
