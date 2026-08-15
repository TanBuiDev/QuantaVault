# 169. Majority Element — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use the Boyer–Moore majority vote algorithm. I keep a candidate and a counter. When the counter is zero, I choose the current value as the new candidate. Matching values increment the counter and different values decrement it. This is equivalent to canceling pairs of different values. Since the true majority appears more than all other values combined, it must survive the cancellations. The problem guarantees a majority exists, so the final candidate can be returned directly in `O(n)` time and `O(1)` extra space.

**VI:** Em dùng thuật toán Boyer–Moore Majority Vote. Em giữ một candidate và một counter. Khi counter bằng `0`, em chọn giá trị hiện tại làm candidate mới. Giá trị giống candidate tăng counter, giá trị khác giảm counter. Điều này tương đương triệt tiêu từng cặp giá trị khác nhau. Vì majority xuất hiện nhiều hơn tất cả phần tử còn lại cộng lại, nó bắt buộc phải sống sót. Đề đảm bảo majority tồn tại nên có thể trả candidate cuối trực tiếp với `O(n)` time và `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Can you explain why Boyer–Moore works?

**Q (VI):** Bạn có thể giải thích vì sao Boyer–Moore đúng không?

### Short answer (EN)

It cancels pairs of different values. A value occurring more than half the time cannot be completely canceled.

### Trả lời ngắn (VI)

Thuật toán triệt tiêu các cặp giá trị khác nhau. Một giá trị xuất hiện hơn một nửa không thể bị triệt tiêu hết.

### Standard answer (EN)

The majority count is greater than the number of all non-majority elements combined. Every decrement can be interpreted as pairing one candidate occurrence with a different value and removing both. Even if every non-majority value cancels one majority occurrence, at least one majority occurrence remains, so the final surviving candidate is the majority.

### Trả lời chuẩn (VI)

Số lần xuất hiện của majority lớn hơn tổng số non-majority. Mỗi lần giảm counter có thể hiểu là ghép một candidate với một giá trị khác rồi loại cả hai. Dù mọi non-majority đều triệt tiêu một occurrence của majority, vẫn còn majority sống sót; vì vậy candidate cuối là majority.

### Deep answer (EN)

A cancellation of two different values preserves the identity of a strict majority: if one removed value is the majority, one non-majority is removed with it; if neither is the majority, the majority advantage only becomes stronger. Repeating this reduction leaves the same strict-majority value as the only possible survivor. Boyer–Moore simulates these cancellations without storing the pairs.

### Trả lời sâu (VI)

Loại một cặp hai giá trị khác nhau không làm mất danh tính của strict majority: nếu cặp chứa majority thì đồng thời một non-majority cũng bị loại; nếu cặp không chứa majority thì lợi thế của majority còn tăng tương đối. Lặp quá trình này, strict majority vẫn là giá trị duy nhất có thể sống sót. Boyer–Moore mô phỏng việc đó mà không cần lưu các cặp.

---

### Q2

**Q (EN):** What does `count` actually represent?

**Q (VI):** `count` thực sự đại diện cho điều gì?

### Short answer (EN)

It is the candidate's net vote after cancellations, not its total frequency.

### Trả lời ngắn (VI)

Nó là số vote ròng của candidate sau cancellation, không phải tần suất thật.

### Standard answer (EN)

Within the current unresolved group, `count` is the excess number of candidate values over values that have canceled them. When it reaches zero, that group is balanced and can be discarded for purposes of finding the global majority.

### Trả lời chuẩn (VI)

Trong nhóm chưa được triệt tiêu hoàn toàn hiện tại, `count` là phần chênh lệch giữa số candidate và số giá trị khác đã cancel candidate. Khi nó về `0`, nhóm đó cân bằng và có thể bỏ qua khi tìm majority toàn cục.

---

### Q3

**Q (EN):** Why can you return the final candidate without counting it again?

**Q (VI):** Vì sao có thể trả candidate cuối mà không đếm lại?

### Short answer (EN)

Because the problem guarantees that a majority element exists.

### Trả lời ngắn (VI)

Vì đề đảm bảo majority element luôn tồn tại.

### Standard answer (EN)

Boyer–Moore finds the only possible majority candidate. In a general array that candidate might not actually exceed `n/2`, so a second pass would be required. Here the existence guarantee makes that verification redundant.

### Trả lời chuẩn (VI)

Boyer–Moore tìm ứng viên duy nhất có thể là majority. Trong bài tổng quát candidate đó chưa chắc vượt `n/2`, nên cần lượt thứ hai. Ở đây guarantee tồn tại majority khiến bước xác minh trở nên dư thừa.

---

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp thời gian và bộ nhớ là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

I scan every element once and maintain only two integer variables, `candidate` and `count`.

### Trả lời chuẩn (VI)

Em duyệt mỗi phần tử một lần và chỉ giữ hai biến số nguyên `candidate` và `count`.

---

### Q5

**Q (EN):** How does this compare with sorting or a hash map?

**Q (VI):** Cách này so với sorting hoặc hash map thế nào?

### Short answer (EN)

Hashing uses `O(n)` space; sorting usually costs `O(n log n)` time; Boyer–Moore achieves both `O(n)` time and `O(1)` space.

### Trả lời ngắn (VI)

Hash map dùng `O(n)` space; sorting thường mất `O(n log n)` time; Boyer–Moore đạt `O(n)` time và `O(1)` space.

---

### Q6

**Q (EN):** What if a majority element is not guaranteed to exist?

**Q (VI):** Nếu đề không đảm bảo majority tồn tại thì sao?

### Short answer (EN)

Run Boyer–Moore to get a candidate, then count that candidate in a second pass and verify it appears more than `n/2` times.

### Trả lời ngắn (VI)

Chạy Boyer–Moore để lấy candidate, sau đó duyệt lần hai để đếm và xác minh nó xuất hiện hơn `n/2` lần.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** What changes if we need all elements appearing more than `n/3` times?

**Q (VI):** Nếu cần tìm mọi phần tử xuất hiện hơn `n/3` lần thì sao?

**EN:** There can be at most two such elements, so a generalized Boyer–Moore algorithm keeps up to two candidates and two counters, then verifies both candidates in a second pass.

**VI:** Có tối đa hai phần tử như vậy, nên Boyer–Moore tổng quát giữ tối đa hai candidate và hai counter, sau đó xác minh cả hai bằng lượt duyệt thứ hai.

### Follow-up 2

**Q (EN):** Could sorting give a very short solution?

**Q (VI):** Sorting có cho lời giải ngắn không?

**EN:** Yes. After sorting, `nums[n / 2]` must be the majority. It is concise but costs `O(n log n)` time and may mutate the input, so it does not meet the strongest follow-up target.

**VI:** Có. Sau khi sort, `nums[n/2]` chắc chắn là majority. Code ngắn nhưng mất `O(n log n)` và có thể sửa input, nên không đạt follow-up mạnh nhất.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích implementation không?

**EN:** I initialize `count` to zero. For each number, if the counter is zero I reset the candidate to that number. Then I add one when the number matches the candidate and subtract one otherwise. After the scan, I return the candidate because the problem guarantees a strict majority exists.

**VI:** Em khởi tạo `count = 0`. Với mỗi số, nếu counter bằng `0` em đặt candidate thành số đó. Sau đó nếu số hiện tại bằng candidate thì tăng một, nếu khác thì giảm một. Sau khi duyệt xong em trả candidate vì đề đảm bảo strict majority tồn tại.

---

## 5. Common reasoning checks / Bẫy tư duy

- Majority không đồng nghĩa với phần tử xuất hiện nhiều nhất; nó phải xuất hiện **hơn một nửa**.
- `count` không phải frequency thật.
- Candidate có thể đổi nhiều lần; điều đó không mâu thuẫn với correctness.
- Nếu không có guarantee tồn tại majority, phải có verification pass.
- Đừng chỉ nói “Boyer–Moore works because it votes”; hãy giải thích **pair cancellation**.
- Khi nói `O(1)` space, nhấn mạnh không cần hash map hoặc mảng tần suất.

---

## 6. Useful interview phrases / Cụm từ hữu ích

| English phrase | Ý nghĩa |
|---|---|
| strict majority | đa số tuyệt đối |
| cancel pairs of different values | triệt tiêu các cặp giá trị khác nhau |
| net vote | số phiếu ròng |
| reset the candidate | đặt lại ứng viên |
| the majority must survive | majority bắt buộc phải sống sót |
| verify in a second pass | xác minh bằng lượt duyệt thứ hai |
