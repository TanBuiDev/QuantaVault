# 61. Rotate List — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I first compute the list length and old tail, reduce `k` modulo the length, and temporarily connect the tail to the head to form a cycle. The new tail is `n-k-1` steps from the old head, and its next node is the new head. I cut the cycle after the new tail. This is `O(n)` time and `O(1)` extra space.

**VI:** Em tính length, rút gọn `k %= n`, nối tail với head thành cycle tạm, tìm new tail ở `n-k-1` bước từ old head rồi cắt cycle. Complexity `O(n)`/`O(1)`.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why can you replace `k` with `k % n`?

**Q (VI):** Vì sao có thể thay `k` bằng `k % n`?

### Short answer (EN)

A full rotation of `n` positions returns every node to its original position.

### Trả lời ngắn (VI)

Xoay đúng `n` vị trí đưa mọi node về vị trí ban đầu.

### Standard answer (EN)

Right rotation is periodic with period `n`: after every `n` rotations, the list is unchanged. Therefore only the remainder after division by `n` affects the final arrangement, which also prevents work from depending on a very large `k`.

### Trả lời chuẩn (VI)

Rotation có chu kỳ `n`, nên chỉ phần dư `k % n` ảnh hưởng kết quả. Điều này cũng loại bỏ phụ thuộc vào `k` có thể rất lớn.

### Q2

**Q (EN):** Why form a temporary cycle?

**Q (VI):** Vì sao tạo cycle tạm thời?

### Short answer (EN)

It lets the new ordering be created by choosing one new cut point instead of moving the suffix node by node.

### Trả lời ngắn (VI)

Nó biến bài toán thành chọn một điểm cắt mới thay vì di chuyển từng node của suffix.

### Standard answer (EN)

After connecting old tail to old head, every cyclic shift is represented by choosing a different head and tail on the same ring. Once we locate the correct new tail, breaking its outgoing edge produces exactly the rotated linear list.

### Trả lời chuẩn (VI)

Sau khi nối thành vòng, mọi rotation chỉ là chọn head/tail khác trên cùng một cycle. Cắt đúng sau new tail sẽ tạo list tuyến tính theo thứ tự rotated.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** Why is the new tail `n - k - 1` steps from the old head?

**Q (VI):** Vì sao new tail cách old head `n-k-1` bước?

### Short answer (EN)

The first `n-k` nodes remain the suffix of the rotated list, so their last node has zero-based index `n-k-1`.

### Trả lời ngắn (VI)

Phần prefix cũ còn `n-k` node, nên node cuối phần đó có index `n-k-1`.

### Standard answer (EN)

A right rotation by `k` moves the last `k` nodes to the front. The old prefix therefore contains positions `0` through `n-k-1`; its final node becomes the new tail, and the following node starts the moved suffix and becomes the new head.

### Trả lời chuẩn (VI)

Rotate phải `k` đưa `k` node cuối lên đầu; prefix cũ còn index `0..n-k-1`. Node cuối prefix đó là new tail, node sau nó là new head.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the time and space complexities?

**Q (VI):** Time và space complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` time và `O(1)` extra space.

### Standard answer (EN)

One traversal finds the length and tail, and at most another partial traversal finds the new tail. Only a handful of pointers and integers are stored, so the work is linear and the auxiliary space is constant.

### Trả lời chuẩn (VI)

Một lượt tìm length/tail và tối đa một lượt phần tìm new tail; chỉ dùng vài pointer và integer nên `O(n)`/`O(1)`.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** What if `k` is a multiple of the list length?

**Q (VI):** Nếu `k` là bội của length thì sao?

### Short answer (EN)

`k % n` becomes zero, so the original head can be returned immediately.

### Trả lời ngắn (VI)

`k % n = 0`, nên return list gốc ngay.

### Standard answer (EN)

A whole number of full rotations changes nothing. Returning before creating the temporary cycle is both simpler and avoids unnecessary pointer modifications.

### Trả lời chuẩn (VI)

Một số vòng quay đầy đủ không thay đổi list; return sớm giúp tránh rewiring không cần thiết.

### Q6

**Q (EN):** Why check for an empty or one-node list first?

**Q (VI):** Vì sao check empty/one-node list trước?

### Short answer (EN)

They are invariant under rotation and avoid length/cycle edge handling.

### Trả lời ngắn (VI)

Các list đó không thay đổi khi rotate và return sớm giúp logic an toàn hơn.

### Standard answer (EN)

An empty list has no tail and a one-node list has only one possible ordering. Handling both immediately keeps the main logic focused on lists where a meaningful cut point exists.

### Trả lời chuẩn (VI)

Empty list không có tail và one-node list chỉ có một thứ tự; return sớm loại bỏ các boundary case khỏi logic chính.

---

## 6. Alternative approach / Hướng khác

### Q7

**Q (EN):** Why not rotate one step at a time?

**Q (VI):** Vì sao không rotate từng bước một?

### Short answer (EN)

Doing a full traversal for each rotation can degrade to `O(k*n)`.

### Trả lời ngắn (VI)

Mỗi rotation lại duyệt list có thể thành `O(k*n)`.

### Standard answer (EN)

Since `k` can be very large, repeated single rotations are unnecessarily expensive. Reducing `k` modulo `n` and cutting a temporary cycle solves the entire rotation with only linear traversal.

### Trả lời chuẩn (VI)

`k` có thể rất lớn; modulo + cycle xử lý toàn bộ rotation trong thời gian tuyến tính thay vì lặp `k` lần.

---

## 7. Common interviewer traps / Bẫy thường gặp

- Không modulo `k`.
- Off-by-one khi tìm new tail.
- Quên cắt cycle.
- Sai case `k == 0` hoặc list rỗng.
- Rotate từng bước làm complexity xấu.

## 8. Useful vocabulary / Từ vựng hữu ích

- **effective rotation** — số bước xoay hiệu dụng.
- **temporary cycle** — vòng tạm thời.
- **new cut point** — điểm cắt mới.
- **old tail / new tail** — tail cũ / tail mới.
- **cyclic shift** — dịch vòng.
