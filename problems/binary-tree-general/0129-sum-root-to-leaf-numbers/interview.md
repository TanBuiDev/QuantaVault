# 129. Sum Root to Leaf Numbers — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I run DFS with the numeric prefix formed by the path so far. At each node I update it as `prefix * 10 + node.val`. If the node is a leaf, that value is one complete root-to-leaf number; otherwise I sum the results from both children. This is `O(n)` time and `O(h)` recursion space.

**VI:** Em DFS với numeric prefix; mỗi node cập nhật `prefix * 10 + digit`, tại leaf trả số hoàn chỉnh, còn internal node cộng hai subtree.

---

## 2. Core approach questions / Câu hỏi hướng giải

### Q1

**Q (EN):** Why does multiplying by ten work?

**Q (VI):** Vì sao nhân `10` là đúng?

### Short answer (EN)

It shifts the existing decimal digits left before appending the new digit.

### Trả lời ngắn (VI)

Nó dịch các digit thập phân hiện có sang trái trước khi thêm digit mới.

### Standard answer (EN)

If a path currently represents `prefix`, appending one decimal digit `d` produces exactly `10 * prefix + d`. Applying that formula at every edge constructs the same value as writing the digits consecutively.

### Trả lời chuẩn (VI)

Nếu path đang là `prefix`, append digit `d` cho đúng giá trị `10 * prefix + d`; lặp công thức trên mỗi edge tương đương ghép các digit lại.

### Q2

**Q (EN):** Why add values only at leaves?

**Q (VI):** Vì sao chỉ cộng value tại leaf?

### Short answer (EN)

Only a root-to-leaf path represents one complete number in the problem.

### Trả lời ngắn (VI)

Chỉ root-to-leaf path mới biểu diễn một số hoàn chỉnh theo đề.

### Standard answer (EN)

An internal prefix may belong to several different final numbers. Counting it early would double-count or count incomplete paths. At a leaf there is exactly one completed root-to-leaf number.

### Trả lời chuẩn (VI)

Prefix ở internal node có thể dẫn tới nhiều số khác nhau; cộng sớm sẽ tính path chưa hoàn chỉnh hoặc double-count, còn leaf tương ứng đúng một số hoàn chỉnh.

---

## 3. Correctness questions / Câu hỏi vì sao đúng

### Q3

**Q (EN):** What invariant does the DFS maintain?

**Q (VI):** DFS duy trì invariant nào?

### Short answer (EN)

The prefix passed to a node equals the number represented by the path ending at its parent.

### Trả lời ngắn (VI)

Prefix truyền vào node bằng số của path kết thúc tại parent của node đó.

### Standard answer (EN)

The root starts with prefix zero. Updating by `prefix * 10 + digit` makes the new value equal the root-to-current path number. Therefore every leaf returns exactly its path number, and summing subtree results covers every leaf once.

### Trả lời chuẩn (VI)

Root bắt đầu với zero; công thức update tạo đúng số root-to-current. Vì vậy mỗi leaf trả đúng path number và tổng recursion bao phủ mỗi leaf đúng một lần.

---

## 4. Complexity questions / Câu hỏi complexity

### Q4

**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)

`O(n)` time and `O(h)` recursion space.

### Trả lời ngắn (VI)

`O(n)` time và `O(h)` recursion space.

### Standard answer (EN)

Every node is visited once and each visit performs constant work. The recursion stack follows one root-to-current path, so its maximum size is the tree height.

### Trả lời chuẩn (VI)

Mỗi node được thăm một lần với constant work; recursion stack giữ một root-to-current path nên tối đa bằng tree height.

---

## 5. Edge cases / Câu hỏi edge case

### Q5

**Q (EN):** How should digit zero be handled?

**Q (VI):** Digit `0` cần xử lý thế nào?

### Short answer (EN)

Exactly like every other digit: multiply the prefix by ten, then add zero.

### Trả lời ngắn (VI)

Giống mọi digit khác: nhân prefix với `10` rồi cộng `0`.

### Standard answer (EN)

A zero does not mean the prefix stays numerically unchanged before shifting. For example, path `4 -> 0` represents `40`, so the correct update is `4 * 10 + 0`.

### Trả lời chuẩn (VI)

Zero không có nghĩa bỏ qua bước shift; path `4 -> 0` phải là `40`, nên update là `4 * 10 + 0`.

---

## 6. Common interviewer traps / Bẫy thường gặp

- Cộng internal prefixes vào answer.
- Dùng string khi arithmetic đơn giản hơn.
- Xử lý digit `0` sai.
- Quên phân biệt leaf với node chỉ có một child.

## 7. Useful vocabulary / Từ vựng hữu ích

- **numeric prefix** — tiền tố số.
- **decimal shift** — dịch chữ số thập phân.
- **root-to-leaf number** — số tạo bởi path root-to-leaf.
- **leaf contribution** — đóng góp của một leaf.
