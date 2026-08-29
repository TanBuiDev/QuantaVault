# Solution / Lời giải — 117. Populating Next Right Pointers in Each Node II

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Mỗi level cần nối node.next tới node kế bên dù tree không perfect. Khi đã có next links của current level, ta có thể dùng chúng như một linked list để xây chain children cho level tiếp theo mà không cần queue.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** BFS queue O(width) rất rõ ràng. Optimization O(1) extra dùng dummy head cho next level: scan current level qua next, append mọi non-null child vào tail, rồi chuyển current=dummy.next.

**State / invariant / data structure cần hiểu trước code.** current chạy chain level hiện tại đã hoàn chỉnh; dummy.next/tail xây chain level kế tiếp. Invariant mọi child đã gặp trong scan được nối đúng left-to-right, không cần biết parent có đủ hai children.

**Dry run mental theo implementation.** Dry run level [2,3]: scan2 append child4 rồi5 nếu có; scan3 append child7; dummy chain trở thành 4->5->7, rồi nó là current level tiếp theo.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là giả định perfect tree và nối node.right với node.next.left không tồn tại. Khi nào dùng: đã có sibling links có thể tái sử dụng current layer để xây next layer với dummy-tail.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

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
