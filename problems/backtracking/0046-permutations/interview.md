# 46. Permutations — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I build the permutation one position at a time. At each step I try every unused index, mark it used, recurse, and undo the choice. When the current list has `n` values, I copy it into the result.

**VI:** Tôi xây hoán vị theo từng vị trí và dùng `used[]` để mỗi phần tử chỉ xuất hiện một lần trong một nhánh.

## 2. Core approach questions
**Q (EN):** What is the backtracking state?

**Q (VI):** Trạng thái backtracking gồm gì?

### Short answer (EN)
The current permutation and which indices are already used.

### Trả lời ngắn (VI)
Hoán vị hiện tại và các chỉ số đã được dùng.

### Standard answer (EN)
Those two pieces of state are enough to know which values can be placed next.

### Trả lời chuẩn (VI)
Hai phần trạng thái đó đủ để biết giá trị nào có thể đặt tiếp.

## 3. Why / correctness questions
**Q (EN):** Why does this generate every permutation exactly once?

**Q (VI):** Vì sao cách này sinh mỗi hoán vị đúng một lần?

### Short answer (EN)
Each recursion path corresponds to one unique sequence of chosen indices.

### Trả lời ngắn (VI)
Mỗi đường recursion tương ứng với một chuỗi chỉ số duy nhất.

### Standard answer (EN)
At every position I try every unused index, and no index can be selected twice on the same path.

### Trả lời chuẩn (VI)
Mỗi vị trí thử mọi chỉ số chưa dùng và không chỉ số nào được chọn hai lần trên cùng đường đi.

## 4. Complexity questions
**Q (EN):** What is the complexity?

**Q (VI):** Độ phức tạp là gì?

### Short answer (EN)
`O(n * n!)` time and `O(n)` auxiliary space excluding output.

### Trả lời ngắn (VI)
`O(n * n!)` thời gian và `O(n)` bộ nhớ phụ ngoài output.

### Standard answer (EN)
There are `n!` permutations and copying each completed permutation costs `O(n)`.

### Trả lời chuẩn (VI)
Có `n!` hoán vị và copy mỗi kết quả tốn `O(n)`.

## 5. Edge-case questions
**Q (EN):** What happens when the input has one element?

**Q (VI):** Khi input có một phần tử thì sao?

### Short answer (EN)
The result contains that single one-element permutation.

### Trả lời ngắn (VI)
Kết quả chứa đúng hoán vị một phần tử đó.

### Standard answer (EN)
The base case is reached after choosing the only value.

### Trả lời chuẩn (VI)
Base case đạt được ngay sau khi chọn giá trị duy nhất.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Could you avoid the `used` array?

**Q (VI):** Có thể bỏ mảng `used` không?

### Short answer (EN)
Yes. I can swap the chosen value into the current position.

### Trả lời ngắn (VI)
Có. Có thể swap giá trị được chọn vào vị trí hiện tại.

### Standard answer (EN)
In-place swapping uses the array prefix as the chosen state, while `used[]` is often easier to explain.

### Trả lời chuẩn (VI)
Swap in-place dùng prefix của mảng làm trạng thái; `used[]` thường dễ trình bày hơn.

## 7. Code walkthrough questions
**Q (EN):** Why copy `current` at the base case?

**Q (VI):** Vì sao phải copy `current` ở base case?

### Short answer (EN)
Because the same mutable list is reused after backtracking.

### Trả lời ngắn (VI)
Vì cùng một list mutable sẽ tiếp tục được tái sử dụng.

### Standard answer (EN)
Without a copy, later remove operations would change previously stored answers.

### Trả lời chuẩn (VI)
Nếu không copy, thao tác remove về sau sẽ làm thay đổi đáp án đã lưu.

## 8. Follow-up variations
**Q (EN):** What changes if `nums` can contain duplicates?

**Q (VI):** Nếu `nums` có phần tử trùng thì thay đổi gì?

### Short answer (EN)
I need duplicate skipping, usually after sorting.

### Trả lời ngắn (VI)
Cần skip duplicate, thường sau khi sort.

### Standard answer (EN)
I would sort and avoid choosing the same value at the same recursion depth unless the previous identical value is already used appropriately.

### Trả lời chuẩn (VI)
Tôi sẽ sort và tránh chọn cùng giá trị ở cùng depth theo quy tắc duplicate phù hợp.

## 9. Common interviewer traps
**Q (EN):** Is the time complexity just `O(n!)`?

**Q (VI):** Thời gian có chỉ là `O(n!)` không?

### Short answer (EN)
Generating the structures is `n!`, but materializing each length-`n` result gives `O(n * n!)`.

### Trả lời ngắn (VI)
Số cấu hình là `n!`, nhưng copy từng kết quả dài `n` đưa tổng thành `O(n * n!)`.

### Standard answer (EN)
For output-sensitive analysis, the cost of writing each permutation should be included.

### Trả lời chuẩn (VI)
Phân tích theo output cần tính cả chi phí ghi từng hoán vị.

## 10. Useful phrases and vocabulary
- **unused index** — chỉ số chưa dùng
- **current permutation** — hoán vị hiện tại
- **undo the choice** — hoàn tác lựa chọn
- **recursion depth** — độ sâu recursion
