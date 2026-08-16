# 19. Remove Nth Node From End of List — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use a dummy node plus fast and slow pointers. I advance `fast` `n+1` steps from the dummy, then move both pointers together until `fast` reaches null. The fixed gap guarantees `slow` is immediately before the nth node from the end, so I remove it with one pointer update. This is `O(n)` time and `O(1)` space.

**VI:** Em dùng dummy + fast/slow. Cho `fast` đi trước `n+1` bước rồi cùng tiến; khi `fast` chạm `null`, `slow` đứng ngay trước node cần xóa.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why do you move `fast` `n + 1` steps instead of `n`?

**Q (VI):** Vì sao `fast` đi `n + 1` bước chứ không phải `n`?

### Short answer (EN)

Because we want `slow` to stop at the predecessor of the node to delete, not on the node itself.

### Trả lời ngắn (VI)

Vì cần `slow` đứng ở predecessor của target để xóa bằng `slow.next`.

### Standard answer (EN)

Keeping a gap of `n+1` edges from the dummy means that when the front pointer reaches null, there are exactly `n` nodes after `slow.next` through the tail. Thus `slow.next` is the nth node from the end and can be removed directly.

### Trả lời chuẩn (VI)

Gap `n+1` từ dummy đảm bảo lúc `fast=null`, `slow.next` chính là node thứ `n` từ cuối, nên ta có predecessor sẵn để rewiring.

### Q2

**Q (EN):** Why use a dummy node?

**Q (VI):** Vì sao cần dummy node?

### Short answer (EN)

It handles deleting the original head with the same code path as every other deletion.

### Trả lời ngắn (VI)

Nó giúp case xóa head dùng cùng logic với các case khác.

### Standard answer (EN)

If the target is the original head, there is no real predecessor. The dummy provides one, so `slow.next = slow.next.next` remains valid even when the head is removed, and `dummy.next` always gives the correct returned head.

### Trả lời chuẩn (VI)

Khi target là head thì không có predecessor thật. Dummy cung cấp predecessor đó và cho phép cùng một phép gán hoạt động mọi trường hợp.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant is maintained while both pointers move?

**Q (VI):** Invariant khi hai pointer cùng di chuyển là gì?

### Short answer (EN)

The distance from `slow` to `fast` stays exactly `n+1` edges.

### Trả lời ngắn (VI)

Khoảng cách từ `slow` tới `fast` luôn đúng `n+1` cạnh.

### Standard answer (EN)

After the initial offset, both pointers advance one edge per iteration, so their separation never changes. When `fast` reaches null, that fixed separation positions `slow` exactly one node before the target counted from the end.

### Trả lời chuẩn (VI)

Sau khi tạo gap, cả hai cùng tiến một bước nên gap không đổi. Khi `fast` ra khỏi list, vị trí của `slow` được xác định đúng ngay trước target.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** Is this really one pass if `fast` moves ahead first?

**Q (VI):** Đây có thật sự là one-pass khi `fast` phải đi trước không?

### Short answer (EN)

Yes. No pointer ever restarts from the head; every pointer only moves forward.

### Trả lời ngắn (VI)

Có. Không pointer nào quay lại đầu list; tất cả chỉ tiến về trước.

### Standard answer (EN)

“One pass” here means we do not first traverse the entire list to compute its length and then traverse again. The initial `n+1` moves are simply the beginning of the same forward traversal strategy.

### Trả lời chuẩn (VI)

One-pass nghĩa là không cần pass riêng để đếm length rồi pass thứ hai. Việc tạo gap chỉ là phần đầu của cùng chiến lược forward traversal.

### Q5

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` time, `O(1)` extra space.

### Standard answer (EN)

Fast traverses at most the list once and slow traverses a suffix once; the total work is linear. Only a dummy node and two pointers are used.

### Trả lời chuẩn (VI)

Tổng số bước của hai pointer là tuyến tính và chỉ dùng vài reference cố định.

---

## 5. Edge cases / Câu hỏi edge case

### Q6

**Q (EN):** What happens when `n` equals the list length?

**Q (VI):** Khi `n` bằng độ dài list thì sao?

### Short answer (EN)

The original head is removed; `slow` remains at the dummy node.

### Trả lời ngắn (VI)

Target là head và `slow` vẫn ở dummy.

### Standard answer (EN)

After advancing `fast` `n+1` steps from the dummy, `fast` is null immediately, so the synchronized loop does not run. `slow` is still dummy, and `slow.next = slow.next.next` removes the head correctly.

### Trả lời chuẩn (VI)

Sau gap `n+1`, `fast` đã null nên `slow` còn ở dummy; phép xóa chung sẽ bỏ head đúng cách.

---

## 6. Alternative approach / Hướng khác

### Q7

**Q (EN):** What is the simpler two-pass solution?

**Q (VI):** Two-pass solution đơn giản hơn là gì?

### Short answer (EN)

Count the length first, then move to the predecessor at position `length-n` and remove its next node.

### Trả lời ngắn (VI)

Đếm length trước, rồi đi tới predecessor ở vị trí `length-n` và xóa node kế tiếp.

### Standard answer (EN)

Two passes are perfectly valid asymptotically, but the fast/slow gap directly answers the follow-up by locating the target relative to the end without storing the length.

### Trả lời chuẩn (VI)

Two-pass vẫn `O(n)` nhưng fast/slow đáp ứng follow-up tốt hơn vì không cần lưu length.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Gap sai một bước.
- Không dùng dummy nên case xóa head bị lỗi.
- Cho `slow` đứng đúng target rồi khó rewiring.
- Nhầm nth-from-end với index từ đầu.
- Quên return `dummy.next` sau khi head có thể thay đổi.

## 8. Useful vocabulary / Từ vựng hữu ích

- **fixed pointer gap** — khoảng cách pointer cố định.
- **predecessor** — node đứng trước.
- **nth node from the end** — node thứ n tính từ cuối.
- **one-pass traversal** — duyệt một lượt.
- **rewire / bypass a node** — nối bỏ qua một node.
