# 134. Gas Station — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I work with the net balance `gas[i] - cost[i]`. I keep a global total to decide whether any full circuit is possible and a local tank for the current starting candidate. If the local tank becomes negative at station `i`, then the current start and every station between that start and `i` cannot be valid, so I reset the candidate to `i + 1`. At the end, if the total balance is negative I return `-1`; otherwise the final candidate is valid. This is `O(n)` time and `O(1)` space.

**VI:** Em dùng balance ròng `gas[i] - cost[i]`. Em giữ `total` để biết toàn vòng có khả thi không và `tank` cho candidate start hiện tại. Nếu `tank` âm tại `i`, candidate hiện tại và mọi station từ candidate đến `i` đều không thể hợp lệ, nên em chuyển start sang `i+1`. Cuối cùng nếu `total < 0` trả `-1`, ngược lại candidate cuối hợp lệ. `O(n)` time, `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why can you skip every start between the failed candidate and station `i`?

**Q (VI):** Vì sao có thể bỏ qua mọi start giữa candidate thất bại và `i`?

### Short answer (EN)

Because the old candidate reached each intermediate point with a non-negative surplus and still failed by `i`; starting later removes that surplus and cannot do better before `i`.

### Trả lời ngắn (VI)

Vì candidate cũ tới các điểm giữa với surplus không âm mà vẫn fail tại `i`; bắt đầu muộn hơn mất phần surplus đó nên không thể tốt hơn trước `i`.

### Standard answer (EN)

Let the current candidate be `s` and suppose its tank first becomes negative at `i`. For any `j` between `s` and `i`, the sum from `s` to `j-1` is non-negative; otherwise we would have reset earlier. Since the total from `s` to `i` is negative, subtracting that non-negative prefix leaves the sum from `j` to `i` negative as well. Therefore `j` also fails.

### Trả lời chuẩn (VI)

Gọi candidate hiện tại là `s` và tank lần đầu âm ở `i`. Với mọi `j` từ `s` đến `i`, tổng `s..j-1` không âm, nếu không ta đã reset sớm hơn. Tổng `s..i` lại âm; trừ prefix không âm đó ra thì tổng `j..i` vẫn âm. Vì vậy `j` cũng fail.

### Deep answer (EN)

This is an interval-elimination proof: one observed failure certifies not one candidate but an entire contiguous block of candidates. That is what collapses the naive `O(n²)` simulation into a single scan.

### Trả lời sâu (VI)

Đây là chứng minh loại candidate theo interval: một failure không chỉ loại một start mà chứng minh cả một block liên tiếp đều sai. Chính điều này biến simulation `O(n²)` thành một lượt quét.

---

### Q2

**Q (EN):** Why do you still need `total` if you already track `tank`?

**Q (VI):** Vì sao vẫn cần `total` nếu đã có `tank`?

### Short answer (EN)

`tank` finds a candidate; `total` tells whether any solution exists at all.

### Trả lời ngắn (VI)

`tank` tìm candidate; `total` xác định có lời giải toàn cục hay không.

### Standard answer (EN)

Whenever a candidate fails I reset the local tank, so it no longer represents the full-array balance. The global total is never reset. If it is negative, the circuit consumes more gas than all stations provide, making every start impossible.

### Trả lời chuẩn (VI)

Mỗi lần candidate fail em reset local tank nên nó không còn biểu diễn balance toàn mảng. `total` không reset. Nếu `total` âm thì cả vòng tiêu thụ nhiều xăng hơn tổng cung, nên mọi start đều impossible.

---

### Q3

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Each station contributes its net balance once, and I store only `total`, `tank`, `start`, and the current balance.

### Trả lời chuẩn (VI)

Mỗi station đóng góp balance đúng một lần và chỉ cần vài scalar variables.

---

### Q4

**Q (EN):** Is `total >= 0` alone sufficient to know the starting index?

**Q (VI):** Chỉ `total >= 0` có đủ để biết start không?

### Short answer (EN)

No. It proves existence, not which prefix deficits a chosen start can survive.

### Trả lời ngắn (VI)

Không. Nó chứng minh existence chứ không chỉ ra start chịu được các prefix deficit nào.

### Standard answer (EN)

The total condition is necessary and sufficient for existence on a circular route, but the local scan is what eliminates invalid starting indices and identifies the surviving candidate.

### Trả lời chuẩn (VI)

Điều kiện tổng là cần và đủ cho existence trên vòng tròn, nhưng local scan mới loại các start sai và tìm candidate còn lại.

---

### Q5

**Q (EN):** What if the problem did not guarantee a unique answer?

**Q (VI):** Nếu đề không đảm bảo unique answer thì sao?

### Short answer (EN)

This scan still returns a valid start when one exists, but not necessarily all valid starts.

### Trả lời ngắn (VI)

Scan này vẫn trả một start hợp lệ nếu tồn tại, nhưng không liệt kê mọi start hợp lệ.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích implementation không?

**EN:** For each station I compute `balance = gas[i] - cost[i]`, add it to both the global `total` and local `tank`, and if the local tank becomes negative I move the candidate to `i+1` and reset the tank. After the scan I return the candidate only when the global total is non-negative.

**VI:** Với mỗi station em tính `balance = gas[i]-cost[i]`, cộng vào cả `total` và `tank`. Nếu local tank âm, em chuyển candidate sang `i+1` và reset tank. Sau lượt quét chỉ trả candidate khi `total` không âm.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Không phân biệt global feasibility và local candidate.
- Nói “reset vì station tiếp theo tốt hơn” nhưng không chứng minh cả interval bị loại.
- Quên reset tank.
- Simulation từng start dẫn tới `O(n²)`.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- net balance — cân bằng ròng
- candidate start — điểm xuất phát ứng viên
- running tank — lượng xăng tích lũy
- global feasibility — tính khả thi toàn cục
- candidate elimination — loại ứng viên
- circular route — tuyến đường vòng
