# 45. Jump Game II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I treat the reachable indices as implicit BFS levels. `currentEnd` is the end of the range reachable with the current number of jumps, while `farthest` is the farthest index reachable with one more jump from any index in that range. I scan the range, update `farthest`, and when I reach `currentEnd`, I increment the jump count and move `currentEnd` to `farthest`. Because I exhaust every option at one jump count before moving to the next, the result is minimal. The algorithm is `O(n)` time and `O(1)` extra space.

**VI:** Em xem các index reachable như các level BFS ngầm. `currentEnd` là cuối range reachable với số jump hiện tại; `farthest` là index xa nhất có thể tới bằng thêm một jump từ bất kỳ index nào trong range. Em quét range, cập nhật `farthest`, và khi tới `currentEnd` thì tăng jump rồi chuyển `currentEnd = farthest`. Vì xét hết mọi lựa chọn với ít jump hơn trước khi sang level mới, kết quả là minimum. Độ phức tạp `O(n)`/`O(1)`.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why does this greedy algorithm return the minimum number of jumps?

**Q (VI):** Vì sao greedy này cho số jump tối thiểu?

### Short answer (EN)

It is a compressed BFS: each time `jumps` increases, we have exhausted all indices reachable with fewer jumps.

### Trả lời ngắn (VI)

Đây là BFS được nén: mỗi khi tăng `jumps`, ta đã xét hết mọi index reachable với ít jump hơn.

### Standard answer (EN)

All indices up to `currentEnd` belong to the current BFS level. While scanning them, I compute the union of positions reachable in one more jump and summarize that union by `farthest`. I only advance the level after the current range is exhausted, so I cannot skip a solution using fewer jumps.

### Trả lời chuẩn (VI)

Mọi index tới `currentEnd` thuộc current BFS level. Trong lúc quét, em tính union các vị trí reachable bằng thêm một jump và tóm tắt bằng `farthest`. Chỉ sau khi hết current range mới sang level mới, nên không thể bỏ qua lời giải dùng ít jump hơn.

### Deep answer (EN)

In an unweighted graph, BFS discovers vertices by shortest edge distance. Here vertices are array indices and a jump is an edge. Because outgoing edges from a reachable interval produce another interval whose only needed summary is its right endpoint, we can implement BFS level expansion without a queue. The level number is exactly the minimum jump count.

### Trả lời sâu (VI)

Trong graph không trọng số, BFS khám phá vertex theo shortest edge distance. Ở đây vertex là index và một jump là edge. Các edge đi ra từ một reachable interval tạo thành range kế tiếp mà chỉ cần lưu right endpoint, nên có thể triển khai BFS level expansion không cần queue. Số level chính là minimum jump count.

---

### Q2

**Q (EN):** What is the difference between `currentEnd` and `farthest`?

**Q (VI):** `currentEnd` và `farthest` khác nhau thế nào?

### Short answer (EN)

`currentEnd` closes the current BFS level; `farthest` builds the boundary of the next level.

### Trả lời ngắn (VI)

`currentEnd` kết thúc BFS level hiện tại; `farthest` xây biên cho level kế tiếp.

### Standard answer (EN)

I must not immediately turn every new farthest reach into a new jump boundary. I first inspect all positions in the current range because a later position in the same level may reach farther. Only at `currentEnd` do I commit to the next range.

### Trả lời chuẩn (VI)

Không được biến mỗi `farthest` mới thành jump boundary ngay. Phải xét hết mọi vị trí cùng current level vì vị trí sau có thể reach xa hơn. Chỉ tại `currentEnd` mới commit sang range kế tiếp.

---

### Q3

**Q (EN):** Why does the loop stop before the last index?

**Q (VI):** Vì sao vòng lặp dừng trước index cuối?

### Short answer (EN)

Once we reach the last index, no additional jump is needed from it.

### Trả lời ngắn (VI)

Khi đã tới index cuối thì không cần thực hiện jump nào từ đó nữa.

### Standard answer (EN)

The jump counter increases when we finish a range and choose the next one. Processing the destination as a source position can create an extra increment, so scanning only through `n-2` matches the semantics of counting jumps taken to arrive at the destination.

### Trả lời chuẩn (VI)

Counter tăng khi kết thúc một range và chọn range kế tiếp. Nếu xử lý destination như một source position có thể đếm dư, nên chỉ quét tới `n-2` đúng với ý nghĩa đếm jump để tới đích.

---

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Each index is scanned once, and the BFS frontier is compressed into two integer boundaries instead of a queue.

### Trả lời chuẩn (VI)

Mỗi index được quét một lần và frontier BFS được nén thành hai biên số nguyên thay vì queue.

---

### Q5

**Q (EN):** Why not always jump to the farthest index available from the current position?

**Q (VI):** Vì sao không luôn nhảy tới index xa nhất từ vị trí hiện tại?

### Short answer (EN)

The farthest immediate landing point is not necessarily the position that gives the best next reach.

### Trả lời ngắn (VI)

Điểm đáp xa nhất ngay lập tức chưa chắc là vị trí cho next reach tốt nhất.

### Standard answer (EN)

The correct greedy decision is made over the entire current reachable range: inspect every possible landing position reachable with the same jump count and choose the farthest next boundary they collectively provide. This avoids committing too early to one landing index.

### Trả lời chuẩn (VI)

Greedy đúng phải xét toàn current reachable range: kiểm tra mọi landing position có cùng jump count và lấy next boundary xa nhất mà cả range cung cấp. Như vậy không commit quá sớm vào một index cụ thể.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** What if the last index might be unreachable?

**Q (VI):** Nếu đích có thể không reachable thì sao?

**EN:** At a level boundary, if `farthest == currentEnd` and the destination is still beyond it, the frontier cannot expand, so I can report failure.

**VI:** Tại level boundary, nếu `farthest == currentEnd` nhưng đích vẫn ở phía sau, frontier không thể mở rộng nên có thể báo impossible.

### Follow-up 2

**Q (EN):** How is this related to Jump Game I?

**Q (VI):** Nó liên hệ với Jump Game I thế nào?

**EN:** Jump Game I tracks only the global farthest reachable index. Jump Game II additionally tracks where the current jump layer ends so it can count how many range expansions are required.

**VI:** Jump Game I chỉ giữ farthest reachable toàn cục. Jump Game II thêm biên kết thúc current jump layer để đếm số lần mở rộng range.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I scan indices before the destination. For each index I update `farthest` with `i + nums[i]`. When the scan reaches `currentEnd`, every index reachable with the current number of jumps has been examined, so I increment `jumps` and set `currentEnd` to the best next boundary, `farthest`.

**VI:** Em quét các index trước destination. Với mỗi index em cập nhật `farthest = max(farthest, i + nums[i])`. Khi `i == currentEnd`, mọi index reachable với số jump hiện tại đã được xét, nên em tăng `jumps` và chuyển `currentEnd` sang best next boundary là `farthest`.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Nhầm `farthest` với `currentEnd`.
- Tăng jump ở mỗi index.
- Loop qua destination và đếm dư.
- Giải thích là “chọn jump xa nhất” nhưng không nói **xa nhất trên toàn current range**.
- Không liên hệ được với BFS/shortest path.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- minimum number of jumps — số bước nhảy tối thiểu
- current range — khoảng hiện tại
- next range — khoảng kế tiếp
- BFS level — tầng BFS
- frontier — biên tìm kiếm
- range expansion — mở rộng khoảng
- commit to the next level — chuyển sang tầng kế tiếp
