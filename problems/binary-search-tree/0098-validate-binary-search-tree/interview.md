# 98. Validate Binary Search Tree — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I validate each node against the full numeric range allowed by its ancestors. The left subtree tightens the upper bound and the right subtree tightens the lower bound. I use `long` sentinels so int boundary values remain valid. This is `O(n)` time and `O(h)` stack space.

**VI:** Em truyền range hợp lệ từ ancestors xuống từng node; left thu hẹp upper bound, right thu hẹp lower bound, dùng `long` để xử lý biên int.

### Q1
**Q (EN):** Why is parent-child comparison insufficient?

**Q (VI):** Vì sao so sánh parent-child là chưa đủ?

### Short answer (EN)
A descendant can satisfy its parent while violating a higher ancestor.

### Trả lời ngắn (VI)
Một descendant có thể đúng với parent nhưng sai constraint của ancestor cao hơn.

### Standard answer (EN)
For example, a node inside the right subtree of root must be greater than the root even if it is a left child of some smaller local parent. Range propagation carries all ancestor constraints.

### Trả lời chuẩn (VI)
Node trong right subtree của root vẫn phải lớn hơn root dù nó là left child của một parent cục bộ; range propagation giữ toàn bộ constraint đó.

### Q2
**Q (EN):** Why use `long` bounds?

**Q (VI):** Vì sao dùng `long` bounds?

### Short answer (EN)
Valid values may equal either int extreme.

### Trả lời ngắn (VI)
Value hợp lệ có thể bằng một trong hai cực trị của int.

### Standard answer (EN)
Using `Integer.MIN_VALUE` as a strict lower sentinel would reject a valid node with that exact value. `long` provides sentinels outside the entire int domain.

### Trả lời chuẩn (VI)
Dùng `Integer.MIN_VALUE` làm lower sentinel strict sẽ loại sai node có đúng value đó; `long` có range nằm ngoài toàn miền int.

### Q3
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(n)` time and `O(h)` recursion space.

### Trả lời ngắn (VI)
`O(n)` time và `O(h)` recursion space.

### Standard answer (EN)
Each node is validated once. The recursive call stack contains at most one root-to-current path.

### Trả lời chuẩn (VI)
Mỗi node được validate một lần; call stack chứa tối đa một root-to-current path.
