# 141. Linked List Cycle — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use Floyd's cycle detection with two pointers. The slow pointer moves one node at a time and the fast pointer moves two. If there is no cycle, fast eventually reaches null. If a cycle exists, once both pointers are inside it, fast gains one position on slow per iteration modulo the cycle length, so they must meet. This gives `O(n)` time and `O(1)` extra space.

**VI:** Em dùng Floyd với hai pointer: `slow` đi 1 bước, `fast` đi 2 bước. Không có cycle thì `fast` chạm `null`; có cycle thì khi cả hai ở trong vòng, `fast` sẽ bắt kịp `slow`. Complexity là `O(n)` time và `O(1)` space.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why do different pointer speeds help detect a cycle?

**Q (VI):** Vì sao hai pointer chạy khác tốc độ có thể phát hiện cycle?

### Short answer (EN)

Inside a cycle, the fast pointer gains one node on the slow pointer each iteration, so their relative distance must eventually become zero.

### Trả lời ngắn (VI)

Trong cycle, mỗi iteration `fast` tiến hơn `slow` đúng một vị trí, nên khoảng cách tương đối cuối cùng phải về `0`.

### Standard answer (EN)

Once both pointers are in a cycle of length `C`, their positions are considered modulo `C`. Slow advances by one and fast by two, so the relative distance changes by one modulo `C` each iteration. Therefore every possible relative distance is eventually visited, including zero, which means the pointers meet.

### Trả lời chuẩn (VI)

Khi cả hai đã ở trong cycle dài `C`, vị trí được xét modulo `C`. `slow` +1, `fast` +2 nên khoảng cách tương đối +1 modulo `C` mỗi vòng. Vì vậy sẽ có lúc khoảng cách bằng `0` và hai pointer gặp nhau.

### Q2

**Q (EN):** Why not simply use a HashSet?

**Q (VI):** Vì sao không dùng `HashSet` cho đơn giản?

### Short answer (EN)

A HashSet works, but it needs `O(n)` extra space; Floyd meets the follow-up with `O(1)` space.

### Trả lời ngắn (VI)

`HashSet` đúng nhưng tốn `O(n)` memory; Floyd đáp ứng follow-up bằng `O(1)` memory.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** How do you know the fast pointer reaches null when there is no cycle?

**Q (VI):** Vì sao không có cycle thì `fast` chắc chắn chạm `null`?

### Standard answer (EN)

Without a cycle, following `next` produces a finite simple path that ends at null. Fast moves only forward along that path, so it cannot revisit nodes and must eventually reach the end.

### Trả lời chuẩn (VI)

Không có cycle thì chuỗi `next` tạo thành một đường đi hữu hạn kết thúc ở `null`. `fast` chỉ tiến về phía trước, không thể quay lại node cũ nên cuối cùng phải tới cuối danh sách.

### Q4

**Q (EN):** Do the pointers necessarily meet at the cycle entry?

**Q (VI):** Hai pointer có nhất thiết gặp nhau đúng tại cycle entry không?

### Short answer (EN)

No. They can meet at any node inside the cycle.

### Trả lời ngắn (VI)

Không. Chúng có thể gặp ở bất kỳ node nào trong cycle.

### Standard answer (EN)

For cycle detection we only need a meeting anywhere inside the loop. Finding the entry point is a different Floyd follow-up: after a meeting, reset one pointer to head and move both one step at a time until they meet again.

### Trả lời chuẩn (VI)

Bài này chỉ cần phát hiện cycle nên meeting point ở đâu trong vòng cũng được. Nếu cần tìm cycle entry, sau lần gặp đầu ta reset một pointer về `head` rồi cho cả hai đi từng bước cho tới khi gặp lại.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Standard answer (EN)

Before entering the cycle, the pointers traverse at most the non-cyclic prefix. Inside the cycle, fast needs at most one cycle length to catch slow. Both quantities are bounded by the number of reachable nodes, so total time is linear, while only two node references are stored.

### Trả lời chuẩn (VI)

Phần prefix trước cycle được đi tuyến tính; sau khi vào cycle, `fast` cần tối đa một vòng để bắt `slow`. Tổng là `O(n)`, và chỉ lưu hai reference nên extra space `O(1)`.

---

## 5. Edge cases / Câu hỏi edge case

### Q6

**Q (EN):** What happens for an empty list or a single non-cyclic node?

**Q (VI):** Empty list hoặc một node không cycle thì sao?

### Short answer (EN)

The loop condition fails and the method returns false.

### Trả lời ngắn (VI)

Điều kiện loop fail ngay và hàm trả `false`.

### Q7

**Q (EN):** What about a node whose `next` points to itself?

**Q (VI):** Nếu một node tự trỏ `next` về chính nó thì sao?

### Short answer (EN)

After one iteration both slow and fast point to that same node, so the method returns true.

### Trả lời ngắn (VI)

Sau một iteration cả `slow` và `fast` đều ở node đó nên return `true`.

---

## 6. Code walkthrough / Walkthrough code

### Q8

**Q (EN):** Why is the loop condition `fast != null && fast.next != null`?

**Q (VI):** Vì sao loop phải check cả `fast != null` và `fast.next != null`?

### Standard answer (EN)

Fast advances with `fast.next.next`. Both checks guarantee that dereference is safe. If either condition fails, the list has a reachable end, which also proves there is no cycle.

### Trả lời chuẩn (VI)

Vì ta gọi `fast.next.next`, nên cần đảm bảo cả `fast` và `fast.next` khác `null`. Nếu một trong hai là `null`, danh sách có điểm kết thúc reachable nên không có cycle.

### Q9

**Q (EN):** Why compare `slow == fast` instead of their values?

**Q (VI):** Vì sao so `slow == fast` chứ không so `slow.val == fast.val`?

### Standard answer (EN)

A cycle is about revisiting the same node object, not seeing the same value. Different nodes may legally store identical values. Reference equality checks node identity.

### Trả lời chuẩn (VI)

Cycle là quay lại cùng **node object**, không phải gặp lại cùng value. Nhiều node khác nhau có thể chứa cùng giá trị, nên phải so reference identity.

---

## 7. Follow-up variations / Biến thể follow-up

- Tìm node bắt đầu cycle: Floyd phase 2 sau meeting point.
- Tính cycle length: giữ một pointer tại meeting point và đi một vòng để đếm.
- Trả về index của cycle entry: sau khi tìm entry, đếm distance từ `head`.
- Nếu structure bất biến và cho phép memory `O(n)`, `HashSet<ListNode>` là hướng đơn giản hơn.

---

## 8. Common interviewer traps / Bẫy thường gặp

- Nghĩ `pos` là parameter thực tế của method.
- So sánh node value thay vì node reference.
- Quên null guard trước `fast.next.next`.
- Nói space là `O(n)` dù solution chỉ dùng hai pointer.
- Khẳng định meeting point đầu tiên luôn là cycle entry.

---

## 9. Useful vocabulary / Từ vựng hữu ích

- **cycle detection** — phát hiện vòng lặp.
- **slow pointer / fast pointer** — con trỏ chậm / nhanh.
- **node identity** — định danh của node object.
- **relative distance modulo the cycle length** — khoảng cách tương đối theo modulo độ dài cycle.
- **non-cyclic prefix** — đoạn đầu trước khi đi vào cycle.
- **cycle entry** — node bắt đầu vòng.
- **constant extra space** — bộ nhớ phụ hằng số.
