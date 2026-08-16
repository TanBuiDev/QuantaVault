# 108. Convert Sorted Array to Binary Search Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch
**EN:** I choose the midpoint of each sorted interval as the root and recursively build the left and right halves. Sorted order guarantees the BST property, while midpoint splits keep subtree sizes nearly equal, producing a height-balanced tree in O(n) time.

**VI:** Tôi chọn midpoint làm root ở mỗi interval để đồng thời giữ BST order và balance.

## 2. Core approach questions
**Q (EN):** Why choose the midpoint?

**Q (VI):** Vì sao chọn midpoint?

### Short answer (EN)
It makes the two remaining ranges as equal as possible.

### Trả lời ngắn (VI)
Nó chia hai nửa cân bằng nhất có thể.

### Standard answer (EN)
Nearly equal subtree sizes recursively keep their heights within one.

### Trả lời chuẩn (VI)
Kích thước gần bằng nhau qua mỗi level giữ height difference tối đa một.

## 3. Why / correctness questions
**Q (EN):** Why is the result a BST?

**Q (VI):** Vì sao kết quả là BST?

### Short answer (EN)
All left-half values are smaller than root and all right-half values are larger.

### Trả lời ngắn (VI)
Mọi giá trị nửa trái nhỏ hơn root, nửa phải lớn hơn root.

### Standard answer (EN)
The input is strictly increasing, so the recursive interval partition preserves the BST ordering invariant at every node.

### Trả lời chuẩn (VI)
Sorted strict giúp invariant BST đúng tại mọi recursive node.

## 4. Complexity questions
**Q (EN):** Complexity?

**Q (VI):** Độ phức tạp?

### Short answer (EN)
O(n) time and O(log n) recursion stack excluding output.

### Trả lời ngắn (VI)
O(n) time, O(log n) stack ngoài output.

### Standard answer (EN)
Each element creates one node; balanced recursion depth is logarithmic.

### Trả lời chuẩn (VI)
Mỗi phần tử được xử lý một lần và depth của cây cân bằng là log n.

## 5. Edge-case questions
**Q (EN):** Is the output unique?

**Q (VI):** Output có duy nhất không?

### Short answer (EN)
No; even-length ranges can choose either middle element.

### Trả lời ngắn (VI)
Không; interval chẵn có thể chọn một trong hai middle.

### Standard answer (EN)
Multiple height-balanced BST shapes can have the same inorder sequence.

### Trả lời chuẩn (VI)
Nhiều tree shape hợp lệ có cùng inorder.

## 6. Alternative-approach and trade-off questions
**Q (EN):** Why not insert values one by one?

**Q (VI):** Vì sao không insert tuần tự?

### Short answer (EN)
Ascending insertion makes a skewed BST.

### Trả lời ngắn (VI)
Insert tăng dần tạo cây lệch.

### Standard answer (EN)
Using the array's random access lets us build the desired balanced shape directly.

### Trả lời chuẩn (VI)
Midpoint access xây balance trực tiếp mà không cần rotations.

## 7. Code walkthrough questions
**Q (EN):** What is the base case?

**Q (VI):** Base case là gì?

### Short answer (EN)
When `left > right`, return null.

### Trả lời ngắn (VI)
Khi interval rỗng thì trả null.

### Standard answer (EN)
An empty array segment corresponds exactly to an empty subtree.

### Trả lời chuẩn (VI)
Interval rỗng tương ứng subtree rỗng.

## 8. Follow-up variations
**Q (EN):** What if the input were a sorted linked list?

**Q (VI):** Nếu input là sorted linked list?

### Short answer (EN)
Use inorder construction with a moving list pointer or find middles repeatedly.

### Trả lời ngắn (VI)
Dùng inorder construction với pointer hoặc tìm midpoint list.

### Standard answer (EN)
Without random access, midpoint selection requires a different technique to preserve linear time.

### Trả lời chuẩn (VI)
Linked list không có random access nên cần kỹ thuật khác để giữ O(n).

## 9. Common interviewer traps
Assuming unique output, using sequential insertion, interval off-by-one errors.

## 10. Useful phrases and vocabulary
`balanced midpoint split`, `inorder invariant`, `height-balanced BST`, `divide and conquer`.
