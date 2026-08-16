# 138. Copy List with Random Pointer — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** A HashMap can map each original node to its copy, but I can remove that `O(n)` auxiliary space by interleaving copies with originals. I insert each copy immediately after its original, so the copy of node `X` is always `X.next`. Then `X'.random` is `X.random.next`. Finally I separate the two lists and restore the original. This is `O(n)` time and `O(1)` auxiliary space excluding output.

**VI:** Em interleave mỗi copy ngay sau original để mapping `original -> copy` trở thành `original.next`. Nhờ đó gán random bằng `original.random.next`, rồi tách hai list và restore original. Time `O(n)`, auxiliary space `O(1)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why is a simple one-pass copy of `next` pointers not enough?

**Q (VI):** Vì sao chỉ copy `next` trong một pass là chưa đủ?

### Standard answer (EN)

A random pointer may target any node, including a node whose copy has not been created yet. We need a reliable original-to-copy mapping before random links can be reconstructed.

### Trả lời chuẩn (VI)

`random` có thể trỏ tới bất kỳ node nào, kể cả node chưa được copy tại thời điểm hiện tại. Ta cần một mapping ổn định original → copy trước khi dựng random links.

### Q2

**Q (EN):** How does interleaving replace a HashMap?

**Q (VI):** Interleaving thay HashMap như thế nào?

### Standard answer (EN)

After inserting `X'` directly after every original `X`, the mapping is encoded structurally: `copy(X) = X.next`. Therefore the copied random target for `X` can be found in constant time as `X.random.next`.

### Trả lời chuẩn (VI)

Sau khi đặt `X'` ngay sau `X`, mapping nằm ngay trong cấu trúc: `copy(X) = X.next`. Vì thế target copy của `X.random` được lấy bằng `X.random.next` trong `O(1)`.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why does `current.random.next` refer to the copied random target?

**Q (VI):** Vì sao `current.random.next` chính là copied random target?

### Standard answer (EN)

Pass 1 guarantees every original node is immediately followed by its unique copy. If `current.random` is original node `R`, then the node immediately after `R` is exactly `R'`, its copy.

### Trả lời chuẩn (VI)

Pass 1 đảm bảo sau mỗi original `R` luôn là copy duy nhất `R'`. Do đó nếu `current.random = R`, thì `current.random.next = R'`.

### Q4

**Q (EN):** How do you ensure this is a deep copy?

**Q (VI):** Làm sao đảm bảo đây là deep copy?

### Standard answer (EN)

Every copied node is newly allocated. After separation, every copied `next` and `random` pointer is either null or points to another copied node. No edge from the copied list points back to an original object.

### Trả lời chuẩn (VI)

Mọi copied node đều được `new`; sau khi tách, mọi `next/random` của copy chỉ trỏ tới copied node khác hoặc `null`, không trỏ về original.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5

**Q (EN):** Is the space really `O(1)` if you allocate `n` new nodes?

**Q (VI):** Tạo `n` node mới mà vẫn nói `O(1)` space có đúng không?

### Standard answer (EN)

The `n` copied nodes are the required output. Auxiliary working memory beyond the output is constant: only a few node references are used. If output allocation is counted, total additional allocated memory is of course `O(n)`.

### Trả lời chuẩn (VI)

`n` node copy là output bắt buộc. Auxiliary working memory ngoài output chỉ gồm vài pointer nên `O(1)`; nếu tính cả output allocation thì tổng memory mới là `O(n)`.

---

## 5. Edge cases / Câu hỏi edge case

### Q6

**Q (EN):** What if a node's random pointer points to itself?

**Q (VI):** Nếu random tự trỏ chính node đó?

### Standard answer (EN)

If `X.random = X`, after interleaving `X.random.next` equals `X.next`, which is `X'`. So `X'.random` correctly points to itself.

### Trả lời chuẩn (VI)

Nếu `X.random = X` thì `X.random.next = X.next = X'`, nên copy cũng tự random về chính nó.

### Q7

**Q (EN):** What if many nodes have the same value?

**Q (VI):** Nếu nhiều node có cùng value?

### Short answer (EN)

It does not matter because mapping is based on node identity, not value.

### Trả lời ngắn (VI)

Không ảnh hưởng vì mapping dựa trên node identity chứ không dựa vào value.

---

## 6. Alternative approach / Hướng khác

### Q8

**Q (EN):** When might the HashMap solution be preferable?

**Q (VI):** Khi nào HashMap solution đáng dùng hơn?

### Standard answer (EN)

It is simpler and less pointer-sensitive, so it may be preferable when `O(n)` extra memory is acceptable or when maintaining readability is more important than the space optimization. It is also a strong first solution before presenting the interleaving optimization.

### Trả lời chuẩn (VI)

HashMap dễ đọc và ít rủi ro pointer hơn, phù hợp khi `O(n)` memory chấp nhận được; trong interview nó cũng là first approach tốt trước khi optimize space.

---

## 7. Code walkthrough / Walkthrough code

### Q9

**Q (EN):** Why must you restore the original list during separation?

**Q (VI):** Vì sao phải restore original list khi tách?

### Standard answer (EN)

Interleaving temporarily mutates every original `next` pointer. Leaving those changes would violate the expected behavior by corrupting the input structure. Separation restores original edges while building copied edges.

### Trả lời chuẩn (VI)

Interleaving tạm thời sửa toàn bộ `next` của original. Nếu không restore thì input bị corrupt; pass tách phải vừa phục hồi original vừa nối copied list.

---

## 8. Follow-up variations / Biến thể follow-up

- Nếu input structure không được phép mutate dù tạm thời, dùng HashMap.
- Nếu có nhiều arbitrary pointer fields, mapping table thường tổng quát hơn interleaving.
- Có thể dùng DFS/BFS + map nếu structure mở rộng thành graph thực sự.
- Nếu cần verify deep copy, kiểm tra node identity và topology chứ không chỉ values.

---

## 9. Common interviewer traps / Bẫy thường gặp

- Shallow copy: copied random trỏ vào original.
- Map theo value thay vì reference.
- Quên xử lý `random == null`.
- Không restore original list.
- Tách list sai thứ tự làm mất reference tới original kế tiếp.

---

## 10. Useful vocabulary / Từ vựng hữu ích

- **deep copy / shallow copy** — sao chép sâu / nông.
- **random pointer** — con trỏ tùy ý.
- **original-to-copy mapping** — ánh xạ node gốc sang node sao chép.
- **interleave nodes** — xen kẽ các node.
- **restore the original list** — phục hồi list gốc.
- **pointer topology** — cấu trúc liên kết con trỏ.
