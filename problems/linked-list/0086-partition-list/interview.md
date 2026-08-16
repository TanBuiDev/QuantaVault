# 86. Partition List — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I build two stable linked lists while scanning once: one contains nodes with values less than `x`, and the other contains nodes greater than or equal to `x`. I append nodes to each tail so relative order is preserved, terminate the second chain, and connect the two lists. This is `O(n)` time and `O(1)` extra space.

**VI:** Em duyệt một lần, append node vào hai chain `< x` và `>= x`, giữ nguyên thứ tự tương đối trong từng chain, rồi nối chúng lại. Complexity `O(n)` / `O(1)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why not sort the linked list around `x`?

**Q (VI):** Vì sao không sort list quanh `x`?

### Short answer (EN)

The problem requires preserving the original relative order within both partitions.

### Trả lời ngắn (VI)

Đề yêu cầu giữ nguyên thứ tự tương đối trong cả hai partition.

### Standard answer (EN)

Sorting would impose a stronger ordering than required and could rearrange nodes that belong to the same partition. A stable two-chain construction performs exactly the requested partition while preserving relative order.

### Trả lời chuẩn (VI)

Sort có thể đổi thứ tự các node cùng partition. Hai chain stable chỉ thực hiện đúng yêu cầu partition và giữ nguyên relative order.

### Q2

**Q (EN):** Why append to the tail of each partition?

**Q (VI):** Vì sao phải append vào tail của từng partition?

### Short answer (EN)

Tail insertion preserves the order in which nodes are encountered.

### Trả lời ngắn (VI)

Append vào tail giữ đúng thứ tự node xuất hiện khi duyệt.

### Standard answer (EN)

We scan the original list from left to right. Appending every qualifying node after the current tail means earlier nodes in a partition always remain before later nodes from that same partition, which is exactly the stability requirement.

### Trả lời chuẩn (VI)

Ta duyệt từ trái sang phải; append vào tail đảm bảo node xuất hiện sớm hơn trong cùng partition luôn đứng trước node xuất hiện sau.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant do you maintain while scanning?

**Q (VI):** Invariant khi duyệt là gì?

### Short answer (EN)

The two temporary chains contain exactly the processed nodes, partitioned correctly and in their original relative order.

### Trả lời ngắn (VI)

Hai chain chứa đúng các node đã xử lý, được phân nhóm đúng và giữ nguyên relative order.

### Standard answer (EN)

After processing any prefix of the input, the less chain contains all and only processed nodes with value `< x`, while the greater chain contains all and only processed nodes with value `>= x`. Tail insertion preserves order in each chain. Processing the next node adds it to exactly one correct chain, so the invariant continues to hold.

### Trả lời chuẩn (VI)

Sau mỗi prefix, chain `less` chứa đúng node `< x`, chain `greater` chứa đúng node `>= x`; append tail giữ thứ tự. Node tiếp theo được đưa vào đúng một chain nên invariant được duy trì.

### Q4

**Q (EN):** Why do you explicitly set `greaterTail.next = null`?

**Q (VI):** Vì sao phải gán `greaterTail.next = null`?

### Short answer (EN)

Because reused nodes may still carry an old `next` link from the original list.

### Trả lời ngắn (VI)

Vì node được reuse có thể vẫn giữ `next` cũ từ original list.

### Standard answer (EN)

We reuse original nodes without clearing links as we append them. The final node of the greater partition may therefore still point to a node that has been moved elsewhere. Clearing that edge guarantees the result terminates correctly and cannot inherit a stale cycle or extra suffix.

### Trả lời chuẩn (VI)

Do reuse node, tail cuối của partition thứ hai có thể còn giữ liên kết cũ. Gán `null` đảm bảo result kết thúc đúng, không có stale link hoặc cycle.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` extra space.

### Standard answer (EN)

Each node is visited once and linked into one of the two chains. We reuse all input nodes and store only two dummy nodes plus a fixed number of pointers, so auxiliary memory is constant.

### Trả lời chuẩn (VI)

Mỗi node được duyệt một lần và reuse trực tiếp; ngoài hai dummy và vài pointer không có cấu trúc phụ tăng theo input.

---

## 5. Edge cases / Câu hỏi edge case

### Q6

**Q (EN):** Where do nodes equal to `x` go?

**Q (VI):** Node có value bằng `x` thuộc partition nào?

### Short answer (EN)

They belong to the greater-or-equal partition.

### Trả lời ngắn (VI)

Chúng thuộc partition `>= x`.

### Standard answer (EN)

The first partition condition is strictly `value < x`. Equality fails that condition, so equal-valued nodes must be appended to the second partition while retaining their original order there.

### Trả lời chuẩn (VI)

Điều kiện partition đầu là strict `< x`, nên value bằng `x` phải đi vào partition thứ hai và vẫn giữ relative order.

---

## 6. Alternative approach / Hướng khác

### Q7

**Q (EN):** Could you partition in place without two dummy chains?

**Q (VI):** Có thể partition mà không dùng hai dummy chain không?

### Short answer (EN)

Yes, but pointer management becomes more complex while offering no asymptotic advantage.

### Trả lời ngắn (VI)

Có, nhưng quản lý pointer phức tạp hơn mà complexity không tốt hơn.

### Standard answer (EN)

It is possible to repeatedly move nodes before a boundary, but preserving stability makes that approach pointer-sensitive. Two dummy chains still reuse the same nodes, use only constant extra memory, and express the stability requirement directly.

### Trả lời chuẩn (VI)

Có thể di chuyển node quanh boundary, nhưng giữ stable order sẽ dễ lỗi. Hai dummy chain vẫn `O(1)` space và thể hiện yêu cầu rõ hơn.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Dùng `<= x` cho partition đầu.
- Làm mất stable order.
- Quên terminate partition thứ hai.
- Tạo array/list phụ dù không cần.
- Copy values sang node mới thay vì reuse node.

## 8. Useful vocabulary / Từ vựng hữu ích

- **stable partition** — phân hoạch ổn định.
- **relative order** — thứ tự tương đối.
- **less-than partition** — nhóm nhỏ hơn pivot.
- **greater-or-equal partition** — nhóm lớn hơn hoặc bằng pivot.
- **stale link** — liên kết cũ không còn hợp lệ.
