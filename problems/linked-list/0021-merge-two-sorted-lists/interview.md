# 21. Merge Two Sorted Lists — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I use two list pointers and a dummy result head. Because both inputs are sorted, the smaller current head is always the next node in the merged order. I splice that node after the result tail, advance only its source list, and repeat. When one list ends, I append the remaining sorted suffix of the other. This is `O(m+n)` time and `O(1)` extra space.

**VI:** Em dùng hai pointer và dummy head. Vì hai input sorted, head nhỏ hơn luôn là node kế tiếp của result. Em splice node đó vào sau tail, advance đúng list nguồn; khi một list hết thì nối thẳng suffix còn lại của list kia.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why is comparing only the two current heads sufficient?

**Q (VI):** Vì sao chỉ cần so hai head hiện tại?

### Standard answer (EN)

Each remaining list is sorted, so its head is the smallest node in that entire suffix. Therefore the global smallest unmerged node must be one of the two heads; choosing the smaller one is safe.

### Trả lời chuẩn (VI)

Mỗi suffix còn lại sorted nên head của nó là node nhỏ nhất trong suffix đó. Vì vậy node nhỏ nhất toàn cục chưa merge chỉ có thể là một trong hai head.

### Q2

**Q (EN):** Why use a dummy head?

**Q (VI):** Vì sao dùng dummy head?

### Short answer (EN)

It removes the special case for selecting the first merged node.

### Trả lời ngắn (VI)

Nó loại bỏ special case cho node đầu result.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant proves the merge remains sorted?

**Q (VI):** Invariant nào chứng minh result luôn sorted?

### Standard answer (EN)

Before each iteration, the merged prefix is sorted and contains exactly the nodes already consumed from both inputs. Since each remaining suffix is sorted, choosing the smaller current head appends the minimum remaining node, preserving sorted order and completeness.

### Trả lời chuẩn (VI)

Trước mỗi iteration, prefix result sorted và chứa đúng các node đã consume. Chọn head nhỏ hơn tức append node nhỏ nhất còn lại, nên sorted order và completeness được duy trì.

### Q4

**Q (EN):** Why can you append the rest of one list in one operation?

**Q (VI):** Vì sao có thể nối thẳng phần còn lại khi một list hết?

### Standard answer (EN)

Once one list is empty, every remaining unmerged node belongs to the other list, whose suffix is already sorted. No further cross-list comparison is possible or necessary.

### Trả lời chuẩn (VI)

Khi một list hết, toàn bộ node chưa merge chỉ còn ở list kia và suffix đó đã sorted, nên không còn gì để so chéo nữa.

---

## 4. Complexity questions / Câu hỏi complexity

### Q5

**Q (EN):** What are the complexities?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(m+n)` time and `O(1)` extra space.

### Standard answer (EN)

Each node is linked into the result at most once. We reuse existing nodes, so aside from the dummy node and a few pointers, no additional structure grows with input size.

### Trả lời chuẩn (VI)

Mỗi node được xử lý tối đa một lần và ta reuse node input; ngoài dummy và vài pointer không có cấu trúc phụ tăng theo input.

---

## 5. Alternative approach / Hướng khác

### Q6

**Q (EN):** How does the recursive solution compare?

**Q (VI):** Recursive solution khác gì iterative?

### Standard answer (EN)

Recursion expresses the same greedy choice elegantly: choose the smaller head and recursively merge the rest. It has the same `O(m+n)` time but may use `O(m+n)` call-stack space, so the iterative version is more space-efficient.

### Trả lời chuẩn (VI)

Recursion rất ngắn gọn nhưng call stack có thể lên `O(m+n)`, còn iterative giữ extra space `O(1)`.

---

## 6. Edge-case questions / Câu hỏi edge case

### Q7

**Q (EN):** What if one input is null initially?

**Q (VI):** Nếu một input null ngay từ đầu?

### Short answer (EN)

The merge loop is skipped and the other list is attached directly.

### Trả lời ngắn (VI)

Loop không chạy và list còn lại được nối/trả trực tiếp.

### Q8

**Q (EN):** What if the current values are equal?

**Q (VI):** Nếu hai current value bằng nhau?

### Standard answer (EN)

Either node may come first without violating value order. Using `<=` chooses from `list1` deterministically and then the other equal node will be considered next.

### Trả lời chuẩn (VI)

Chọn node nào trước cũng không phá sorted order; dùng `<=` để ưu tiên `list1` một cách deterministic.

---

## 7. Follow-up variations / Biến thể follow-up

- Merge `k` sorted lists: heap hoặc divide-and-conquer.
- Nếu không được mutate input, phải tạo node mới và output allocation trở thành bắt buộc.
- Nếu list là doubly linked, cần cập nhật cả `prev`.
- Nếu cần stable ordering theo nguồn, quy tắc tie-breaking phải được nêu rõ.

---

## 8. Common interviewer traps / Bẫy thường gặp

- Quên rằng đề muốn splice nodes thay vì chỉ copy values.
- Quên nối suffix còn lại.
- Làm mất reference tới `next` do update pointer sai thứ tự.
- Nói recursion là `O(1)` space.
- Tạo array trung gian rồi sort lại thành `O((m+n) log(m+n))` không cần thiết.

---

## 9. Useful vocabulary / Từ vựng hữu ích

- **merge two sorted sequences** — merge hai dãy đã sắp xếp.
- **splice nodes** — nối/chèn lại các node hiện có.
- **merged prefix** — prefix đã merge.
- **remaining suffix** — suffix còn lại.
- **dummy head / tail pointer** — node đầu giả / con trỏ cuối.
- **non-decreasing order** — thứ tự không giảm.
