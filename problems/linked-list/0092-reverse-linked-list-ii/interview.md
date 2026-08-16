# 92. Reverse Linked List II — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I place a dummy node before the list, move `before` to the node just before `left`, and keep `current = before.next` as the tail of the reversing segment. Then `right-left` times I remove `current.next` and insert it immediately after `before`. This reverses the sublist in place in one traversal, with `O(n)` time and `O(1)` extra space.

**VI:** Em dùng dummy, tìm node ngay trước `left`, giữ node ở `left` làm tail của đoạn reverse, rồi liên tục kéo `current.next` lên đầu đoạn. Time `O(n)`, space `O(1)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1 — Dummy node

**Q (EN):** Why do you use a dummy node before `head`?

**Q (VI):** Vì sao dùng dummy node trước `head`?

### Short answer (EN)

It gives a valid predecessor even when `left = 1`, so changing the real head requires no special case.

### Trả lời ngắn (VI)

Dummy tạo predecessor hợp lệ ngay cả khi đoạn reverse bắt đầu từ head.

### Standard answer (EN)

The algorithm needs a pointer to the node immediately before the reversed range. When `left = 1`, such a real node does not exist. A dummy node provides that predecessor uniformly, so the same pointer rewiring works for every valid `left`.

### Trả lời chuẩn (VI)

Thuật toán cần node ngay trước đoạn reverse. Khi `left = 1` thì node thật như vậy không tồn tại; dummy cung cấp predecessor thống nhất để toàn bộ thao tác pointer dùng cùng một logic.

### Q2 — Fixed current pointer

**Q (EN):** Why does `current` stay at the same node during head insertion?

**Q (VI):** Vì sao `current` không tiến lên trong quá trình head insertion?

### Short answer (EN)

After each insertion, `current` is the tail of the reversed segment, and `current.next` is the next node that must be moved.

### Trả lời ngắn (VI)

Sau mỗi lần chèn, `current` là tail của đoạn đã đảo và `current.next` là node kế tiếp cần kéo lên đầu.

### Standard answer (EN)

The node originally at position `left` moves progressively toward the end of the reversed range as later nodes are inserted before it. Keeping `current` fixed at that node makes `current.next` exactly the first target node not yet moved, which makes each iteration constant-time.

### Trả lời chuẩn (VI)

Node ban đầu ở vị trí `left` dần trở thành cuối đoạn đảo khi các node phía sau được kéo lên trước nó. Giữ `current` tại node đó khiến `current.next` luôn là target chưa xử lý đầu tiên.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3 — Invariant

**Q (EN):** What invariant shows the sublist is being reversed correctly?

**Q (VI):** Invariant nào cho thấy đoạn list đang được đảo đúng?

### Short answer (EN)

`before.next` is the head of the reversed prefix, `current` is its tail, and `current.next` is the next target node not yet moved.

### Trả lời ngắn (VI)

`before.next` là head đoạn đã đảo, `current` là tail và `current.next` là target tiếp theo chưa xử lý.

### Standard answer (EN)

Before each iteration, nodes already moved form the correct reverse order immediately after `before`, while `current` remains the last node of that reversed portion. Removing `current.next` and inserting it after `before` extends the reversed portion by exactly one node without changing nodes outside the target range.

### Trả lời chuẩn (VI)

Trước mỗi iteration, các node đã xử lý nằm đúng thứ tự đảo ngay sau `before`, còn `current` là node cuối đoạn. Lấy `current.next` và chèn sau `before` mở rộng đoạn đảo đúng một node mà không tác động thứ tự ngoài range.

### Q4 — Iteration count

**Q (EN):** Why do you perform exactly `right - left` insertions?

**Q (VI):** Vì sao chỉ cần đúng `right - left` lần chèn?

### Short answer (EN)

The first node already forms a reversed segment of length one, so only the remaining `right-left` nodes need to be moved in front of it.

### Trả lời ngắn (VI)

Node đầu đã tạo sẵn đoạn đảo dài một, nên chỉ còn `right-left` node cần kéo lên trước.

### Standard answer (EN)

The target interval contains `right-left+1` nodes. Initially the node at `left` is already in place as a one-node reversed segment. Each insertion adds exactly one of the remaining nodes, so `right-left` insertions complete the entire range.

### Trả lời chuẩn (VI)

Range có `right-left+1` node. Ban đầu node tại `left` đã là đoạn reversed dài một; mỗi lần chèn thêm đúng một node, nên `right-left` lần là đủ.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5 — Complexity

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` extra space.

### Standard answer (EN)

We traverse from the dummy node to the left boundary and then perform one constant-time rewiring operation for each remaining node in the reversed range. No auxiliary structure grows with input size, so the worst-case time is linear and the extra space is constant.

### Trả lời chuẩn (VI)

Ta đi tới biên trái rồi thực hiện một thao tác rewiring hằng số cho từng node còn lại trong range. Không có cấu trúc phụ tăng theo input nên time `O(n)`, space `O(1)`.

---

## 5. Edge-case questions / Câu hỏi edge case

### Q6 — No-op range

**Q (EN):** What happens when `left == right`?

**Q (VI):** Điều gì xảy ra khi `left == right`?

### Short answer (EN)

The insertion loop runs zero times, so the original list is returned unchanged.

### Trả lời ngắn (VI)

Loop chạy 0 lần nên list được giữ nguyên.

### Standard answer (EN)

A range containing one node is already equal to its own reverse. Since `right-left` is zero, the algorithm performs no rewiring and safely returns `dummy.next`.

### Trả lời chuẩn (VI)

Range một node tự nó đã là reversed form. Vì `right-left = 0`, thuật toán không đổi pointer nào và trả list nguyên vẹn.

---

## 6. Alternative approach and trade-offs / Hướng khác và trade-off

### Q7 — Standard reversal

**Q (EN):** Could you reverse the target range with the usual `prev/current/next` technique instead?

**Q (VI):** Có thể dùng kỹ thuật `prev/current/next` thông thường không?

### Short answer (EN)

Yes. It has the same asymptotic complexity but requires explicit reconnection of both range boundaries.

### Trả lời ngắn (VI)

Có. Complexity giống nhau nhưng phải reconnect hai biên rõ ràng hơn.

### Standard answer (EN)

A conventional local reversal works in `O(n)` time and `O(1)` space: find the left boundary, reverse the target nodes, then reconnect the prefix and suffix. Head insertion is attractive because the prefix remains attached throughout and the original left node naturally becomes the tail of the reversed range.

### Trả lời chuẩn (VI)

Reverse cục bộ chuẩn vẫn đạt `O(n)`/`O(1)`, nhưng cần lưu và reconnect prefix/suffix. Head insertion giữ prefix luôn kết nối và node `left` tự nhiên trở thành tail của đoạn đảo.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Di chuyển `current` sau mỗi lần head insertion.
- Off-by-one ở số lần lặp.
- Làm mất suffix vì rewiring sai thứ tự.
- Không dùng dummy và tạo bug khi `left = 1`.
- Tạo array/stack phụ dù có thể làm in-place.

---

## 8. Useful vocabulary / Từ vựng hữu ích

- **sublist reversal** — đảo một đoạn linked list.
- **head insertion** — chèn node vào đầu đoạn.
- **predecessor node** — node đứng trước.
- **rewire pointers in place** — nối lại pointer tại chỗ.
- **boundary pointer** — pointer tại biên đoạn xử lý.
