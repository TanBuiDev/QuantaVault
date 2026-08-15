# 55. Jump Game — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I scan from left to right and maintain the farthest index reachable from all positions processed so far. I only use a position if its index is at most `farthest`. Then I update `farthest` with `max(farthest, i + nums[i])`. If I ever reach an index greater than `farthest`, there is a gap I cannot cross, so I return false. If `farthest` reaches the last index, I return true. This is `O(n)` time and `O(1)` extra space.

**VI:** Em duyệt trái sang phải và giữ index xa nhất reachable từ các vị trí đã xử lý. Chỉ khi `i <= farthest` em mới được dùng `nums[i]` để cập nhật `farthest = max(farthest, i + nums[i])`. Nếu gặp `i > farthest` thì có một khoảng không thể vượt qua nên trả `false`. Nếu `farthest` chạm index cuối thì trả `true`. Độ phức tạp `O(n)` time, `O(1)` space.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why is tracking only the farthest reachable index sufficient?

**Q (VI):** Vì sao chỉ theo dõi index xa nhất reachable là đủ?

### Short answer (EN)

Because any index up to `farthest` is reachable, and future usefulness depends only on how far those reachable indices can extend the boundary.

### Trả lời ngắn (VI)

Vì mọi index tới `farthest` đều reachable, và điều quan trọng cho tương lai chỉ là chúng có thể mở rộng biên tới đâu.

### Standard answer (EN)

The exact path used to reach a position is irrelevant. Once an index is inside the reachable prefix, I may use its jump length to extend the reachable prefix. Taking the maximum extension over all such indices summarizes all possible paths with one number.

### Trả lời chuẩn (VI)

Đường đi cụ thể để tới một vị trí không quan trọng. Một khi index nằm trong prefix reachable, ta có thể dùng jump length của nó để mở rộng prefix. Lấy extension lớn nhất của mọi index reachable tóm tắt toàn bộ các đường đi bằng một số.

### Deep answer (EN)

The set of reachable positions among the processed prefix is contiguous from zero to `farthest`. A reachable index `i` adds the interval up to `i + nums[i]`; the union remains a prefix. Therefore the state of the union is fully represented by its right endpoint.

### Trả lời sâu (VI)

Tập vị trí reachable trong phần đã xét luôn là một prefix liên tục từ `0` đến `farthest`. Mỗi index reachable `i` thêm interval tới `i + nums[i]`; hợp của các interval vẫn là một prefix. Vì vậy chỉ cần lưu endpoint bên phải.

---

### Q2

**Q (EN):** Why do you return false when `i > farthest`?

**Q (VI):** Vì sao `i > farthest` thì có thể trả `false` ngay?

### Short answer (EN)

Index `i` is unreachable, and all jumps move forward, so no future index can be used to bridge that gap.

### Trả lời ngắn (VI)

Index `i` không reachable và mọi jump chỉ đi tới trước, nên không future index nào có thể được dùng để vượt khoảng trống đó.

### Standard answer (EN)

To use `nums[i]`, I must first stand at index `i`. If `i` lies beyond the farthest reachable boundary, I cannot stand there. Since later indices are even farther right, they are also inaccessible until the gap is crossed, which is impossible.

### Trả lời chuẩn (VI)

Muốn dùng `nums[i]`, trước hết phải tới được `i`. Nếu `i` nằm ngoài farthest boundary thì ta không thể đứng ở đó. Các index sau còn xa hơn nên cũng không thể dùng trước khi vượt gap, điều này không thể xảy ra.

---

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Each index is inspected at most once, and I keep only the integer `farthest` plus the loop index.

### Trả lời chuẩn (VI)

Mỗi index được xét tối đa một lần và chỉ cần biến `farthest` cùng loop index.

---

### Q4

**Q (EN):** Does a zero always make the array unreachable?

**Q (VI):** Một phần tử `0` có luôn làm bài toán thất bại không?

### Short answer (EN)

No. A previous jump may already reach beyond that zero.

### Trả lời ngắn (VI)

Không. Một jump trước đó có thể đã vượt qua vị trí `0`.

### Standard answer (EN)

A zero only matters if it appears at or before the current reachable frontier and no earlier reachable position extends past it. The algorithm captures this naturally through `farthest`.

### Trả lời chuẩn (VI)

`0` chỉ gây chặn nếu không có index reachable trước đó mở rộng `farthest` vượt qua nó. Thuật toán xử lý điều này tự nhiên qua `farthest`.

---

### Q5

**Q (EN):** Could you solve it backwards?

**Q (VI):** Có thể giải từ phải sang trái không?

### Short answer (EN)

Yes. Track the leftmost index that can reach the current goal and move the goal left whenever `i + nums[i] >= goal`.

### Trả lời ngắn (VI)

Có. Theo dõi goal hiện tại và dịch goal sang trái khi `i + nums[i] >= goal`.

### Standard answer (EN)

Starting with the last index as the goal, scan backwards. Whenever an index can jump to the goal, make that index the new goal. At the end, the first index is reachable iff the goal becomes zero. This is also `O(n)`/`O(1)`.

### Trả lời chuẩn (VI)

Đặt index cuối làm goal rồi duyệt ngược. Nếu một index có thể nhảy tới goal, biến index đó thành goal mới. Cuối cùng đáp án là `true` khi goal về `0`. Cách này cũng `O(n)`/`O(1)`.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** What if I ask for the minimum number of jumps instead of just reachability?

**Q (VI):** Nếu hỏi số jump tối thiểu thay vì chỉ reachability thì sao?

**EN:** Then a single `farthest` reachability boundary is not enough to count jumps. I would use the greedy level/range technique from Jump Game II, tracking the current range end and the farthest next range.

**VI:** Khi cần số jump tối thiểu, một `farthest` cho reachability chưa đủ để đếm jump. Em sẽ dùng greedy theo range như Jump Game II, giữ current range end và farthest của range kế tiếp.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the implementation?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I start with `farthest = 0` because index zero is reachable. For each index, I first verify `i <= farthest`. If not, I return false. Otherwise I update the farthest reachable position with `i + nums[i]`. As soon as that boundary reaches the last index I return true.

**VI:** Em bắt đầu `farthest = 0` vì index `0` reachable. Với mỗi index em kiểm tra `i <= farthest`; nếu sai thì trả `false`. Nếu reachable, em cập nhật biên bằng `i + nums[i]`. Ngay khi biên chạm index cuối, em trả `true`.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Cập nhật reach từ index không reachable.
- Xem mọi số `0` là blocker.
- Giải thích greedy bằng trực giác nhưng không nêu invariant reachable prefix.
- Nhầm Jump Game I với Jump Game II.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- reachable — có thể tới được
- farthest reachable index — index xa nhất có thể tới
- reachable prefix — prefix có thể tới
- extend the boundary — mở rộng biên
- bridge a gap — vượt qua khoảng trống
- greedy invariant — bất biến greedy
