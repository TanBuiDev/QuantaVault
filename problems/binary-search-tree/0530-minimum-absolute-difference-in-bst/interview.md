# 530. Minimum Absolute Difference in BST — Interview Preparation / Chuẩn bị phỏng vấn

## 1. 30-second solution pitch / Cách trình bày trong 30 giây

**EN:** I traverse the BST in inorder, which yields sorted values. In a sorted sequence the minimum absolute difference occurs between adjacent elements, so I keep only the previous value and update the minimum. This is `O(n)` time and `O(h)` stack space.

**VI:** Em inorder BST để có sorted values, rồi chỉ so sánh các value kề nhau bằng một previous variable.

### Q1
**Q (EN):** Why are adjacent inorder values sufficient?

**Q (VI):** Vì sao chỉ cần các inorder value kề nhau?

### Short answer (EN)
Because any non-adjacent gap contains a smaller or equal adjacent gap inside it.

### Trả lời ngắn (VI)
Vì mọi gap không kề nhau chứa ít nhất một adjacent gap nhỏ hơn hoặc bằng nó.

### Standard answer (EN)
For sorted values `a < b < c`, the gap `c-a` is the sum of positive smaller gaps, so it cannot be smaller than both adjacent gaps. Extending this argument covers any non-adjacent pair.

### Trả lời chuẩn (VI)
Trong sorted order, gap xa bằng tổng các gap dương bên trong nên không thể nhỏ hơn mọi adjacent gap.

### Q2
**Q (EN):** What are the complexity bounds?

**Q (VI):** Complexity là bao nhiêu?

### Short answer (EN)
`O(n)` time and `O(h)` auxiliary space.

### Trả lời ngắn (VI)
`O(n)` time và `O(h)` auxiliary space.

### Standard answer (EN)
Every node is pushed and popped once. The stack contains at most one root-to-current path.

### Trả lời chuẩn (VI)
Mỗi node push/pop một lần; stack giữ tối đa một root-to-current path.

### Q3
**Q (EN):** Why not compare only each node with its parent?

**Q (VI):** Vì sao không chỉ so sánh node với parent?

### Short answer (EN)
The closest values in sorted order do not have to be parent and child.

### Trả lời ngắn (VI)
Hai value gần nhau nhất trong sorted order không nhất thiết là parent-child.

### Standard answer (EN)
BST structure encodes ordering, not value-distance relationships. Inorder adjacency is the property tied directly to numeric closeness.

### Trả lời chuẩn (VI)
BST chỉ encode ordering; inorder adjacency mới trực tiếp liên quan tới numeric distance.
