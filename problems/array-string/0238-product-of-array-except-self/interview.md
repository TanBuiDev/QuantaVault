# 238. Product of Array Except Self — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** For each index, the answer is the product of everything to its left times the product of everything to its right. In the first pass I store the left product directly in the output array. In the second pass I maintain one running suffix product and multiply it into each output entry. This avoids division, handles zeros naturally, runs in `O(n)` time, and uses `O(1)` extra space excluding the required output array.

**VI:** Với mỗi index, đáp án là tích mọi phần tử bên trái nhân tích mọi phần tử bên phải. Lượt đầu em lưu left product trực tiếp vào output. Lượt hai em giữ một running suffix product và nhân vào từng output entry. Cách này không dùng division, xử lý zero tự nhiên, chạy `O(n)` và dùng `O(1)` extra space ngoài output.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why does the two-pass method work?

**Q (VI):** Vì sao phương pháp hai lượt đúng?

### Short answer (EN)

At index `i`, the first pass supplies the product strictly to the left and the second pass supplies the product strictly to the right.

### Trả lời ngắn (VI)

Tại `i`, lượt đầu cung cấp tích strictly bên trái và lượt hai cung cấp tích strictly bên phải.

### Standard answer (EN)

Before processing `i` in the first pass, `prefix` contains exactly `nums[0]...nums[i-1]`. Before processing `i` in the reverse pass, `suffix` contains exactly `nums[i+1]...nums[n-1]`. Multiplying those two quantities includes every array element except `nums[i]` exactly once.

### Trả lời chuẩn (VI)

Trước khi xử lý `i` ở lượt đầu, `prefix` là tích `nums[0..i-1]`. Trước khi xử lý `i` ở lượt ngược, `suffix` là tích `nums[i+1..n-1]`. Nhân hai giá trị đó sẽ chứa mọi phần tử trừ `nums[i]` đúng một lần.

### Deep answer (EN)

The algorithm maintains two directional invariants and composes them in the output array. Importantly, each running product is updated only after its current value is consumed, which excludes `nums[i]` from both sides by construction rather than by subtraction or division.

### Trả lời sâu (VI)

Thuật toán giữ hai invariant theo hai hướng và kết hợp chúng ngay trong output. Mỗi running product chỉ được update sau khi giá trị hiện tại đã được dùng, nên `nums[i]` bị loại khỏi cả hai phía ngay từ cấu trúc thuật toán, không cần division.

---

### Q2

**Q (EN):** How does the solution handle zeros?

**Q (VI):** Solution xử lý zero như thế nào?

### Short answer (EN)

No special case is needed; prefix and suffix products naturally become zero exactly where the excluded product contains a zero.

### Trả lời ngắn (VI)

Không cần special-case; prefix/suffix tự trở thành zero đúng ở những output có tích chứa zero.

### Standard answer (EN)

If there is one zero, every position except the zero's position multiplies a prefix or suffix containing that zero, while the zero's own position multiplies only the nonzero values around it. With two or more zeros, every excluded product still contains at least one zero.

### Trả lời chuẩn (VI)

Nếu có một zero, mọi vị trí khác đều có prefix hoặc suffix chứa zero, còn vị trí zero chỉ nhân các phần tử nonzero xung quanh. Nếu có từ hai zero, mọi tích ngoại trừ một phần tử vẫn còn ít nhất một zero.

---

### Q3

**Q (EN):** Why is the extra space `O(1)` even though you allocate `answer`?

**Q (VI):** Vì sao extra space là `O(1)` dù có tạo `answer`?

### Short answer (EN)

The problem explicitly excludes the required output array from extra-space analysis.

### Trả lời ngắn (VI)

Đề nói rõ output array không tính vào extra-space analysis.

### Standard answer (EN)

Beyond the output required by the function, the algorithm stores only two scalar products and loop variables, so auxiliary memory is constant.

### Trả lời chuẩn (VI)

Ngoài output bắt buộc, thuật toán chỉ giữ hai scalar product và loop variables nên auxiliary memory là hằng số.

---

### Q4

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space excluding output.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ ngoài output.

### Standard answer (EN)

There are two linear scans, and each array entry is processed a constant number of times.

### Trả lời chuẩn (VI)

Có hai lượt quét tuyến tính và mỗi phần tử chỉ được xử lý số lần hằng số.

---

### Q5

**Q (EN):** Why not use division?

**Q (VI):** Vì sao không dùng phép chia?

### Short answer (EN)

The problem forbids it, and zeros make a division-based formulation require extra branching anyway.

### Trả lời ngắn (VI)

Đề cấm division, và zero cũng khiến cách dựa trên division phải thêm nhiều branch.

---

## 3. Likely follow-ups / Câu hỏi mở rộng hợp lý

### Follow-up 1

**Q (EN):** Could you solve it using explicit prefix and suffix arrays?

**Q (VI):** Có thể dùng hai mảng prefix/suffix riêng không?

**EN:** Yes, that is often the clearest first solution and remains `O(n)` time, but it uses `O(n)` auxiliary space. The optimized version stores prefix values in the output and compresses suffix state to one scalar.

**VI:** Có, đó thường là bước đầu dễ hiểu và vẫn `O(n)` time, nhưng dùng `O(n)` auxiliary space. Bản tối ưu lưu prefix trong output và nén suffix thành một scalar.

---

## 4. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through the code?

**Q (VI):** Bạn có thể giải thích code không?

**EN:** I initialize `prefix = 1`. For each index I first write the current prefix into `answer[i]`, then multiply the current number into the prefix. Next I scan backwards with `suffix = 1`; I multiply `answer[i]` by the current suffix and only then include `nums[i]` in the suffix for the next position.

**VI:** Em khởi tạo `prefix = 1`. Với mỗi index em ghi prefix hiện tại vào `answer[i]` trước, rồi mới nhân `nums[i]` vào prefix. Sau đó em duyệt ngược với `suffix = 1`, nhân suffix hiện tại vào `answer[i]` rồi mới đưa `nums[i]` vào suffix cho vị trí tiếp theo.

---

## 5. Common interviewer traps / Bẫy thường gặp

- Update prefix/suffix sai thứ tự và vô tình đưa `nums[i]` vào chính output của nó.
- Nói `O(1)` total space thay vì `O(1)` **extra** space excluding output.
- Không giải thích zero behavior.
- Dùng division dù đề cấm.

---

## 6. Useful vocabulary / Từ vựng hữu ích

- prefix product — tích tiền tố
- suffix product — tích hậu tố
- running product — tích tích lũy
- auxiliary space — bộ nhớ phụ
- excluding the output array — không tính mảng output
- directional invariant — bất biến theo hướng
