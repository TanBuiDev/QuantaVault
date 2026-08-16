# 452. Minimum Number of Arrows to Burst Balloons — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I sort balloons by their right endpoint. I shoot the first arrow at the earliest end, which is the farthest-right position that still guarantees hitting that balloon. Then I reuse that arrow for every later interval whose start is at or before the arrow position. When a balloon starts after the current arrow, I need a new arrow at that balloon's end. This greedy solution is `O(n log n)` because of sorting.

**VI:** Em sort theo right endpoint, đặt arrow tại end sớm nhất, rồi reuse arrow đó cho mọi balloon có `start <= arrowX`. Khi gặp `start > arrowX` thì buộc phải có arrow mới và em đặt nó tại end của balloon đó. Runtime `O(n log n)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Core practice question

**Q (EN):** Why do you sort by the end coordinate instead of the start?

**Q (VI):** Vì sao sort theo end thay vì start?

### Short answer (EN)

The earliest end gives the most restrictive balloon and a natural greedy arrow position that leaves maximum room for future intervals.

### Trả lời ngắn (VI)

End sớm nhất là constraint chặt nhất và cho ta vị trí arrow greedy giúp giữ nhiều cơ hội nhất cho các interval sau.

### Standard answer (EN)

If a balloon ends earliest, any arrow that bursts it must be placed no farther right than that end. Choosing exactly that end delays the arrow as much as possible while still hitting the balloon, which maximizes the chance that the same arrow lies inside later balloons.

### Trả lời chuẩn (VI)

Balloon kết thúc sớm nhất buộc arrow phải nằm không quá end của nó. Đặt đúng tại end là vị trí xa bên phải nhất vẫn hợp lệ, nên tăng khả năng arrow đó cũng nằm trong các balloon phía sau.

### Q2 — Core practice question

**Q (EN):** When do you need a new arrow?

**Q (VI):** Khi nào cần một arrow mới?

### Short answer (EN)

Only when the next balloon's start is greater than the current arrow position.

### Trả lời ngắn (VI)

Chỉ khi `nextStart > arrowX`.

### Standard answer (EN)

If `start <= arrowX`, then because the interval includes both endpoints and its end is not before the selected earliest end in the sorted order, the current arrow lies inside the balloon. If `start > arrowX`, the current arrow is strictly left of the balloon and cannot burst it, so another arrow is necessary.

### Trả lời chuẩn (VI)

Nếu `start <= arrowX`, arrow hiện tại nằm trong interval. Nếu `start > arrowX`, arrow nằm hoàn toàn bên trái balloon nên không thể bắn nó; lúc đó buộc phải tạo arrow mới.

---

## 3. Why / correctness questions / Câu hỏi vì sao đúng

### Q3 — Common reasoning check

**Q (EN):** Why is shooting at the earliest end a safe greedy choice?

**Q (VI):** Vì sao bắn tại earliest end là greedy choice an toàn?

### Short answer (EN)

Any solution must hit that earliest-ending balloon, and moving such an arrow to its end cannot make the current balloon invalid while it gives the arrow the farthest possible right position.

### Trả lời ngắn (VI)

Mọi solution đều phải bắn balloon kết thúc sớm nhất; đặt arrow tại end của nó vẫn bắn được balloon đó và đưa arrow xa sang phải nhất có thể.

### Standard answer (EN)

Take an optimal solution and look at an arrow that hits the earliest-ending uncovered balloon. If that arrow is left of the balloon's end, we can move it right to the end. The current balloon is still hit, and this move does not reduce the opportunity to hit later intervals whose ends are at least as large. Therefore an optimal solution exists with the greedy arrow at the earliest end.

### Trả lời chuẩn (VI)

Xét một optimal solution. Arrow bắn earliest-ending balloon có thể được dịch sang end của balloon đó mà vẫn bắn được nó. Vì các interval sau có end không nhỏ hơn, việc dịch arrow sang phải theo cách này không làm greedy choice kém hơn. Do đó tồn tại optimal solution chứa lựa chọn greedy này.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4 — Core practice question

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n log n)` time for sorting plus an `O(n)` scan. The greedy state itself is `O(1)`; Java's object-array sort may use `O(n)` workspace.

### Trả lời ngắn (VI)

`O(n log n)` time do sort, scan `O(n)`. Greedy state là `O(1)`, còn Java object-array sort có thể dùng `O(n)` workspace.

### Standard answer (EN)

Sorting dominates the runtime. After sorting, each balloon is inspected once. I only store the arrow count and current arrow coordinate, although `Arrays.sort` on `int[][]` sorts an object array and may allocate auxiliary workspace internally.

### Trả lời chuẩn (VI)

Sort chi phối runtime; sau đó mỗi balloon được xét đúng một lần. Phần greedy chỉ giữ counter và `arrowX`, nhưng implementation sort của Java trên `int[][]` có thể dùng thêm bộ nhớ phụ.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q5 — Likely follow-up

**Q (EN):** What happens when two balloons only touch at one endpoint?

**Q (VI):** Nếu hai balloon chỉ chạm nhau tại một endpoint thì sao?

### Short answer (EN)

One arrow at that shared endpoint can burst both.

### Trả lời ngắn (VI)

Một arrow tại endpoint chung có thể bắn cả hai.

### Standard answer (EN)

The burst condition is inclusive: `xstart <= x <= xend`. Therefore if one balloon ends at `2` and the next starts at `2`, an arrow at `2` lies in both intervals. That is why I create a new arrow only for `start > arrowX`, not `start >= arrowX`.

### Trả lời chuẩn (VI)

Điều kiện chứa endpoint là inclusive, nên `[1,2]` và `[2,3]` cùng bị bắn bởi arrow tại `2`. Vì vậy condition tạo arrow mới phải là `>`.

### Q6 — Likely follow-up

**Q (EN):** Why do you use `Integer.compare` in the sort comparator?

**Q (VI):** Vì sao dùng `Integer.compare` trong comparator?

### Short answer (EN)

Subtracting endpoints can overflow for extreme integer values.

### Trả lời ngắn (VI)

Trừ trực tiếp hai endpoint có thể overflow với giá trị integer cực biên.

### Standard answer (EN)

A comparator such as `a[1] - b[1]` is unsafe when one end is near `Integer.MIN_VALUE` and the other near `Integer.MAX_VALUE`. `Integer.compare(a[1], b[1])` preserves the intended ordering without arithmetic overflow.

### Trả lời chuẩn (VI)

Comparator `a[1] - b[1]` có thể overflow ở biên `int`; `Integer.compare` tránh phép trừ nên an toàn hơn.

---

## 6. Alternative-approach and trade-off questions / Hướng khác và trade-off

### Q7 — Likely follow-up

**Q (EN):** Could you merge overlapping intervals first and count the merged groups?

**Q (VI):** Có thể merge intervals trước rồi đếm số group không?

### Short answer (EN)

That idea is easy to get wrong because union groups do not directly encode the best shared arrow point; sorting by end solves the hitting-point problem directly.

### Trả lời ngắn (VI)

Cách đó dễ nhầm vì union group không trực tiếp biểu diễn điểm chung tốt nhất; greedy sort-by-end giải trực tiếp bài toán chọn điểm bắn.

### Standard answer (EN)

The key object is the intersection where one arrow can serve several balloons, not merely the union of overlapping intervals. The earliest-end greedy method maintains exactly the information needed: the current arrow coordinate that lies inside every balloon assigned to that arrow.

### Trả lời chuẩn (VI)

Điều ta cần là một điểm chung cho nhiều interval, không phải chỉ union của chúng. Greedy earliest-end trực tiếp duy trì `arrowX` nằm trong mọi balloon đang được cover bởi arrow đó.

---

## 7. Code walkthrough questions / Câu hỏi walkthrough code

### Q8 — Code walkthrough

**Q (EN):** Why don't you update `arrowX` when another balloon is already covered?

**Q (VI):** Vì sao không cập nhật `arrowX` khi balloon tiếp theo đã được cover?

### Short answer (EN)

The current arrow at the earliest end is already the safest greedy position; moving it is unnecessary and could lose coverage.

### Trả lời ngắn (VI)

Arrow hiện tại tại earliest end đã là greedy position tốt; di chuyển nó không cần thiết và có thể làm mất coverage.

### Standard answer (EN)

All balloons in the current group contain the existing `arrowX`. The earliest end was chosen to satisfy the most restrictive interval. Changing the arrow position after seeing a wider interval provides no benefit and may move it outside an earlier balloon.

### Trả lời chuẩn (VI)

Mọi balloon trong current group đều chứa `arrowX`. Earliest end là constraint chặt nhất; thay đổi vị trí sau đó không có lợi và có thể ra khỏi một balloon đã cover trước đó.

---

## 8. Follow-up variations / Biến thể follow-up

- Nếu cần trả về các vị trí arrow thay vì chỉ count, lưu mỗi `arrowX` khi tạo arrow mới.
- Nếu input đã sorted theo end, bỏ bước sort và đạt `O(n)`.
- Nếu interval endpoints là open intervals thay vì inclusive, condition touching sẽ thay đổi.
- Bài tương tự: chọn maximum number of non-overlapping intervals dùng cùng trực giác earliest finish.
- Nếu mỗi arrow có cost khác nhau theo vị trí, greedy đơn giản này có thể không còn áp dụng.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Sort sai endpoint.
- Dùng `>=` và xử lý touching endpoint sai.
- Update arrow position khi chưa cần arrow mới.
- Comparator bằng phép trừ gây overflow.
- Không giải thích được greedy choice / exchange argument.
- Nhầm union of intervals với intersection point cần cho một arrow.

---

## 10. Useful phrases and vocabulary / Cụm từ hữu ích

- **"I sort by the right endpoint."** — Em sort theo endpoint bên phải.
- **"I place the arrow at the earliest finishing point."** — Em đặt arrow tại điểm kết thúc sớm nhất.
- **"This keeps the arrow as far right as possible while still hitting the current balloon."** — Cách này giữ arrow xa bên phải nhất nhưng vẫn bắn được balloon hiện tại.
- **"I reuse the arrow while the next interval contains that x-coordinate."** — Em reuse arrow khi interval tiếp theo vẫn chứa tọa độ đó.
- **"A new arrow is unavoidable once the next start is to the right of the current arrow."** — Khi next start nằm bên phải current arrow thì arrow mới là bắt buộc.
- **earliest finish / earliest end** — điểm kết thúc sớm nhất.
- **greedy exchange argument** — lập luận hoán đổi cho greedy.
- **shared stabbing point** — điểm chung dùng để cover nhiều interval.
