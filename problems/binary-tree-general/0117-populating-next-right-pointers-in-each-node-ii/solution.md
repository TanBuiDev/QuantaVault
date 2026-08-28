# Solution / Lời giải — 117. Populating Next Right Pointers in Each Node II

## 1. Core idea

Dùng `next` chain đã xây của current level như một queue không tốn thêm memory. Trong lúc scan ngang, `nextLevelStart/nextLevelTail` xây chain của level kế tiếp.

## 2. Optimal Java solution

```java
public class Solution {
    public Node connect(Node root) {
        Node levelStart = root;

        while (levelStart != null) {
            Node nextLevelStart = null;
            Node nextLevelTail = null;

            // next pointers của level hiện tại đóng vai trò queue miễn phí,
            // cho phép scan ngang mà không dùng O(width) auxiliary memory.
            for (Node current = levelStart; current != null; current = current.next) {
                if (current.left != null) {
                    if (nextLevelStart == null) {
                        nextLevelStart = current.left;
                    } else {
                        // Tail nối children xuyên qua parent boundaries, nên xử lý được
                        // tree không perfect nơi neighbor cùng level có parent khác nhau.
                        nextLevelTail.next = current.left;
                    }
                    nextLevelTail = current.left;
                }

                if (current.right != null) {
                    if (nextLevelStart == null) {
                        nextLevelStart = current.right;
                    } else {
                        nextLevelTail.next = current.right;
                    }
                    nextLevelTail = current.right;
                }
            }

            // Chỉ chuyển level sau khi toàn bộ next chain của level mới đã hoàn tất.
            levelStart = nextLevelStart;
        }

        return root;
    }
}
```

## 3. Correctness

Induction theo level: current `next` chain đúng cho phép scan trái→phải; appending non-null children left rồi right tạo chính xác thứ tự nodes của next level, kể cả qua nhiều parents. Sau scan chain mới hoàn tất và trở thành current level tiếp theo.

## 4. Complexity

```text
Time: O(n)
Extra space: O(1)
```

## 5. Common mistakes

- Dùng queue rồi claim O(1) space.
- Chỉ nối siblings cùng parent.
- Chuyển level trước khi chain mới hoàn tất.
