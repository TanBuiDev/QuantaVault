# 125. Valid Palindrome — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch / Cách trình bày trong 30 giây

**EN:** I use two pointers from both ends of the original string. Each pointer skips non-alphanumeric characters. When both pointers are on valid characters, I compare their lowercase forms. A mismatch means the normalized string cannot be a palindrome; otherwise I move both pointers inward. This performs normalization lazily, so I get `O(n)` time and `O(1)` extra space without constructing another string.

**VI:** Em dùng two pointers từ hai đầu original string. Mỗi pointer skip non-alphanumeric. Khi cả hai ở valid character, em so lowercase. Mismatch thì normalized string không thể palindrome; nếu match thì đưa hai pointer vào trong. Đây là lazy normalization nên đạt `O(n)` time, `O(1)` extra space mà không tạo string khác.

---

## 2. Core practice questions / Câu hỏi cốt lõi

### Q1

**Q (EN):** Why don't you need to build the cleaned string?

**Q (VI):** Vì sao không cần tạo cleaned string?

### Short answer (EN)

Skipping invalid characters with the pointers visits exactly the same valid-character sequence that a cleaned string would contain.

### Trả lời ngắn (VI)

Skip invalid characters bằng pointer đi qua đúng sequence valid characters mà cleaned string sẽ chứa.

### Standard answer (EN)

Normalization removes characters but does not reorder the remaining ones. Therefore I can locate the next valid character independently from each end and compare them directly. Materializing the intermediate string provides no information the pointers do not already have.

### Trả lời chuẩn (VI)

Normalization chỉ xóa chứ không reorder valid characters. Vì vậy em có thể tìm valid character kế tiếp ở hai đầu và so trực tiếp; intermediate string không cung cấp thêm thông tin cần thiết.

### Deep answer (EN)

The two pointers operate on a filtered view of the source string. The filter predicate is local, so the next element of the logical filtered sequence can be found online without storing previous elements.

### Trả lời sâu (VI)

Two pointers hoạt động trên filtered view của source string. Filter predicate là local nên phần tử tiếp theo của logical filtered sequence có thể tìm online mà không cần lưu các phần tử trước.

---

### Q2

**Q (EN):** What happens if the normalized string is empty?

**Q (VI):** Nếu normalized string rỗng thì sao?

### Short answer (EN)

It is a palindrome, because there are no mismatching symmetric pairs.

### Trả lời ngắn (VI)

Nó là palindrome vì không có cặp đối xứng nào mismatch.

### Standard answer (EN)

Both pointers simply skip toward each other until `left >= right`; the algorithm returns true naturally without a special case.

### Trả lời chuẩn (VI)

Hai pointer chỉ skip tới khi `left >= right`; algorithm tự trả true mà không cần special case.

---

### Q3

**Q (EN):** What are the complexities?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)

`O(n)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(n)` thời gian và `O(1)` bộ nhớ phụ.

### Standard answer (EN)

Although there are nested while-loops, neither pointer ever moves backward. Across the entire algorithm they advance through at most `n` characters total from each side.

### Trả lời chuẩn (VI)

Dù có nested while, pointer không bao giờ lùi. Trên toàn algorithm chúng chỉ đi qua mỗi character tối đa một lần theo hướng của mình.

---

### Q4

**Q (EN):** Why use `Character.isLetterOrDigit`?

**Q (VI):** Vì sao dùng `Character.isLetterOrDigit`?

### Short answer (EN)

It directly expresses the alphanumeric predicate from the problem.

### Trả lời ngắn (VI)

Nó biểu diễn trực tiếp predicate alphanumeric của đề.

### Standard answer (EN)

The input is printable ASCII, so a manual ASCII check would also work. The standard helper makes the intent clearer; because the contract is ASCII, there is no ambiguity about Unicode behavior affecting expected inputs.

### Trả lời chuẩn (VI)

Input là printable ASCII nên manual ASCII check cũng đúng. Standard helper làm intent rõ hơn; contract ASCII nên Unicode behavior không ảnh hưởng expected input.

---

## 3. Code walkthrough / Giải thích code

**Q (EN):** Can you walk me through one loop iteration?

**Q (VI):** Bạn có thể giải thích một vòng lặp không?

**EN:** I first advance the left pointer until it reaches an alphanumeric character and move the right pointer similarly. Then I lowercase and compare those two characters. If they differ I return false; otherwise I move both inward and repeat.

**VI:** Em đưa left tới alphanumeric, right cũng vậy, rồi lowercase và compare. Nếu khác trả false; nếu giống thì đưa cả hai vào trong rồi lặp.

---

## 4. Common interviewer traps / Bẫy thường gặp

- Chỉ skip spaces thay vì mọi non-alphanumeric.
- Quên case normalization.
- Nhìn nested loops rồi báo sai `O(n²)`.
- Build cleaned string nhưng vẫn claim `O(1)` space.

---

## 5. Useful vocabulary / Từ vựng hữu ích

- palindrome — chuỗi đối xứng
- alphanumeric — chữ hoặc số
- normalize lazily — chuẩn hóa lười
- skip invalid characters — bỏ qua ký tự không hợp lệ
- symmetric pair — cặp đối xứng
