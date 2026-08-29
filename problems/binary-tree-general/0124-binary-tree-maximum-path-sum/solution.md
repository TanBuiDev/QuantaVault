# 124. Binary Tree Maximum Path Sum — Solution

## 1. Điều khó của bài: một node có hai “vai trò path” khác nhau

Một path có thể bắt đầu và kết thúc ở bất kỳ node nào, miễn là các node liên tiếp nối bằng edge và không đi qua cùng node hai lần.

Xét node `B`:

```text
      B
     / \
    L   R
```

Nếu ta đang tính một path **hoàn chỉnh có điểm cao nhất là B**, path có thể đi:

```text
best chain từ L -> B -> best chain từ R
```

Tức là dùng **cả hai nhánh**.

Nhưng nếu parent của `B` muốn nối tiếp path qua `B`, `B` không thể trả cả hai nhánh lên parent:

```text
        P
        |
        B
       / \
      L   R
```

Nếu path từ parent đi vào `B` rồi tách xuống cả `L` và `R`, `B` trở thành điểm phân nhánh degree 3; đó không còn là một path đơn nữa.

Vì vậy DFS cần phân biệt:

1. **candidate cho đáp án toàn cục** tại node: có thể dùng trái + node + phải.
2. **giá trị trả lên parent**: chỉ được là node + **một** nhánh tốt hơn.

Đây là mental model quan trọng nhất của bài.

---

## 2. Hàm `gain(node)` thực sự trả gì?

Định nghĩa bằng một câu đầy đủ:

> `gain(node)` = tổng lớn nhất của một chain bắt đầu tại `node` và đi xuống **tối đa một nhánh**, để parent có thể nối chain đó vào path của parent.

Nếu child contribution là âm, nối child đó chỉ làm tổng nhỏ hơn. Ta được phép dừng path ở node hiện tại, nên contribution hữu ích từ child là:

```text
left  = max(0, gain(node.left))
right = max(0, gain(node.right))
```

Sau đó:

```text
return node.val + max(left, right)
```

Chỉ một branch được trả lên.

---

## 3. Vậy đáp án toàn cục cập nhật ở đâu?

Tại mỗi node, ta thử coi node đó là **highest point** của một path hoàn chỉnh:

```text
candidate = node.val + left + right
```

Candidate này được phép dùng cả hai child branches vì nó không cần được nối tiếp lên parent nữa.

Ta lưu candidate tốt nhất trong field:

```text
best
```

### Vì sao `best` phải bắt đầu bằng `Integer.MIN_VALUE`?

Tree có thể toàn số âm:

```text
   -3
```

Đáp án vẫn phải chọn ít nhất một node, nên là `-3`, không phải `0`.

Nếu khởi tạo `best = 0`, ta sẽ vô tình cho phép “path rỗng” dù đề không cho.

---

## 4. Ví dụ hình thành công thức

Với:

```text
       -10
       /  \
      9    20
          /  \
         15   7
```

Ở node `20`:

```text
left  = 15
right = 7
```

Path hoàn chỉnh đi qua `20`:

```text
15 -> 20 -> 7
sum = 42
```

Do đó:

```text
best = 42
```

Nhưng `20` trả lên `-10` chỉ được một chain:

```text
20 + max(15, 7) = 35
```

Nó **không** trả `42` lên parent. `42` là candidate đã hoàn chỉnh; `35` mới là chain còn có thể nối.

---

## 5. Optimal Java solution

```java
public class Solution {
    private int best;

    public int maxPathSum(TreeNode root) {
        // Không dùng 0 vì tree toàn số âm vẫn phải chọn ít nhất một node.
        best = Integer.MIN_VALUE;
        gain(root);
        return best;
    }

    private int gain(TreeNode node) {
        if (node == null) {
            return 0;
        }

        // Negative child contribution chỉ làm path tệ hơn, nên optimal path có thể
        // bỏ hẳn nhánh đó bằng cách clamp contribution về 0.
        int left = Math.max(0, gain(node.left));
        int right = Math.max(0, gain(node.right));

        // Một path hoàn chỉnh có node này là highest point có thể dùng CẢ hai nhánh,
        // nên candidate global là node + left + right.
        best = Math.max(best, node.val + left + right);

        // Nhưng gain trả lên parent phải là một chain không phân nhánh, nên chỉ
        // chọn một child tốt hơn; trả cả hai sẽ tạo degree 3 khi parent nối vào.
        return node.val + Math.max(left, right);
    }
}
```

Block trên được giữ exact-sync với [`Solution.java`](Solution.java).

---

## 6. Dry run từ lá lên

Vẫn dùng tree:

```text
       -10
       /  \
      9    20
          /  \
         15   7
```

### Node `9`

```text
left = right = 0
candidate = 9
best = 9
return gain = 9
```

### Node `15`

```text
candidate = 15
best = 15
return 15
```

### Node `7`

```text
candidate = 7
best vẫn 15
return 7
```

### Node `20`

```text
left = 15
right = 7
candidate = 20 + 15 + 7 = 42
best = 42
return = 20 + max(15, 7) = 35
```

### Node `-10`

Child gains:

```text
left = max(0, 9)  = 9
right = max(0,35) = 35
```

Candidate qua root:

```text
-10 + 9 + 35 = 34
```

không vượt `42`, nên đáp án cuối là `42`.

---

## 7. Vì sao thuật toán đúng?

Mọi path trong tree có một node cao nhất — node nơi path có thể đi xuống hai phía nhưng không đi lên parent nữa.

DFS thử **mọi node** làm highest point thông qua:

```text
node.val + best non-negative left chain + best non-negative right chain
```

Vì `gain(child)` cung cấp chain tốt nhất có thể nối từ child lên node, candidate tại node là path tốt nhất có node đó làm highest point.

`best` lấy maximum của candidate ở mọi node, nên bao phủ mọi path hợp lệ trong tree.

Trong khi đó giá trị return chỉ giữ một branch, đảm bảo chain gửi lên parent luôn có hình dạng path đơn và có thể nối hợp lệ.

---

## 8. Complexity

```text
Time:  O(n) — mỗi node được xử lý một lần
Space: O(h) — recursion stack, h là chiều cao tree
```

Worst case tree lệch: `O(n)` stack. Balanced tree: `O(log n)`.

---

## 9. Lỗi thường gặp

- Trả `node.val + left + right` lên parent. Giá trị đó chỉ dùng để update global candidate; return phải chọn một branch.
- Không clamp negative child gain về `0`, khiến path bị ép nối một nhánh làm tổng xấu đi.
- Khởi tạo `best = 0`, làm sai tree toàn âm.
- Nghĩ maximum path bắt buộc đi qua root; đề cho path bắt đầu/kết thúc ở bất kỳ node nào.
- Nhầm `gain(node)` với “maximum path sum trong subtree”. Nó có contract hẹp hơn: chain nối được lên parent.

---

## 10. Cách nhận ra pattern ở bài tree khác

Khi recursion có vẻ cần hai loại thông tin, hãy hỏi riêng:

> “Parent cần child trả **thứ gì có thể nối tiếp**?”

và:

> “Đáp án toàn cục có thể sử dụng nhiều nhánh hơn giá trị return không?”

Nếu câu trả lời là có, thường ta cần một **return state cục bộ** và một **global/nonlocal answer** riêng. Đây là mô hình xuất hiện ở nhiều bài tree diameter/path problems.
