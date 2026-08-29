# Solution / Lời giải — 530. Minimum Absolute Difference in BST

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Trong BST, inorder values tăng dần. Minimum absolute difference toàn tree vì vậy phải nằm giữa hai values kề nhau trong sorted inorder order, không cần so mọi pair.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Collect sorted list rồi scan dùng O(n) extra. Quan sát khi inorder streaming, chỉ cần previous value và best difference; current chỉ cần so với predecessor gần nhất.

**State / invariant / data structure cần hiểu trước code.** prev là value vừa visit trong inorder; best là min adjacent difference đã thấy. Invariant mọi pair có current làm phần tử lớn hơn có difference nhỏ nhất với nearest predecessor prev, nên các predecessor xa hơn không cần xét.

**Dry run mental theo implementation.** Dry run BST values inorder [1,2,3,4,6]: differences 1,1,1,2; best=1. Recursion/stack update prev sau mỗi visit node.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là so parent-child only; nearest values có thể không là trực tiếp relatives. Khi nào dùng: BST numeric neighbor questions thường biến thành sorted inorder streaming với previous state.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Inorder BST là sorted sequence; minimum gap toàn cục nằm giữa hai phần tử kề nhau nên chỉ cần giữ previous value.

## 2. Optimal Java solution

```java
import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public int getMinimumDifference(TreeNode root) {
        Deque<TreeNode> stack = new ArrayDeque<>();
        TreeNode current = root;
        Integer previous = null;
        int best = Integer.MAX_VALUE;

        while (current != null || !stack.isEmpty()) {
            while (current != null) {
                stack.push(current);
                current = current.left;
            }

            current = stack.pop();

            // Inorder BST là sorted sequence. Minimum absolute difference của một
            // sorted sequence luôn nằm giữa hai phần tử kề nhau, nên chỉ cần previous.
            if (previous != null) {
                best = Math.min(best, current.val - previous);
            }

            previous = current.val;
            current = current.right;
        }
        return best;
    }
}
```

## 3. Correctness

Với sorted values `a < b < c`, gap `c-a` không thể nhỏ hơn cả hai adjacent gaps. Vì vậy xét mọi adjacent inorder pair là đủ để tìm minimum global.

## 4. Complexity

`O(n)` time, `O(h)` stack.
