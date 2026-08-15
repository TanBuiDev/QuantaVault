# 73. Set Matrix Zeroes — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second pitch

**EN:** I use the first row and first column as marker arrays, so I do not need extra `O(m+n)` storage. I first remember whether the original first row and first column contain zeros. Then every interior zero marks its row in column zero and its column in row zero. A second pass applies those markers, and I finally zero the first row and column according to the saved flags. The algorithm is `O(mn)` time and `O(1)` extra space.

**VI:** Em dùng first row/first column làm marker, lưu riêng hai flag trạng thái ban đầu, ghi marker từ interior, apply marker ở pass sau rồi xử lý first row/column cuối cùng. Complexity `O(mn)` và `O(1)`.

## 2. Core practice questions

### Q1

**Q (EN):** Why can't you set rows and columns to zero immediately when you see a zero?

**Q (VI):** Vì sao không zero ngay row/column khi gặp `0`?

### Short answer (EN)

New zeros would become indistinguishable from original zeros and would incorrectly trigger more rows and columns.

### Trả lời ngắn (VI)

Zero mới sẽ bị nhầm với zero ban đầu và lan truyền thêm row/column sai.

### Standard answer (EN)

The transformation must be based only on the original zero positions. If I mutate immediately, later scanning can treat a value that I just changed to zero as an original zero. Separating marker collection from marker application prevents that feedback loop.

### Trả lời chuẩn (VI)

Transformation phải dựa trên original zero. Mutate ngay khiến scan sau coi zero mới tạo là original zero; tách collect marker và apply marker tránh feedback loop này.

### Q2

**Q (EN):** Why do you need separate flags for the first row and first column?

**Q (VI):** Vì sao cần hai flag riêng cho first row và first column?

### Short answer (EN)

They share `matrix[0][0]`, which cannot store two independent states.

### Trả lời ngắn (VI)

Hai vùng dùng chung `matrix[0][0]`, không thể lưu hai trạng thái độc lập.

### Standard answer (EN)

Once the first row and column become marker storage, their cells are mutated. Saving their original zero-status beforehand preserves the information needed to decide whether each entire boundary should be zeroed at the end.

### Trả lời chuẩn (VI)

Khi first row/column trở thành marker storage, chúng bị mutate. Lưu trạng thái ban đầu trước giúp quyết định cuối cùng có zero toàn boundary hay không.

### Q3

**Q (EN):** What are the time and space complexities?

**Q (VI):** Complexity là gì?

### Short answer (EN)

`O(mn)` time and `O(1)` extra space.

### Trả lời ngắn (VI)

`O(mn)` time và `O(1)` extra space.

### Standard answer (EN)

The matrix is scanned a constant number of times, and all state beyond the matrix consists of two booleans and loop variables.

### Trả lời chuẩn (VI)

Matrix được scan số lần hằng số và state ngoài matrix chỉ gồm hai boolean cùng loop variables.

## 3. Common interviewer traps

- Immediate mutation propagation.
- Lose first-row/first-column original state.
- Use extra `O(m+n)` arrays despite the constant-space follow-up.

## 4. Useful vocabulary

- marker — dấu đánh dấu
- in-place — tại chỗ
- original state — trạng thái ban đầu
- propagation — lan truyền
- constant space — bộ nhớ hằng số
