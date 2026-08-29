# Solution / Lời giải — 114. Flatten Binary Tree to Linked List

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Flatten yêu cầu linked list theo preorder root-left-right dùng right pointers. Sau khi flatten left và right subtrees, left chain phải được chèn giữa node và old right chain.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Collect preorder nodes vào list rồi relink dùng O(n) extra. Có thể DFS reverse preorder right-left-root với prev pointer, hoặc in-place tìm rightmost predecessor. Cốt lõi là giữ successor trước khi overwrite pointers.

**State / invariant / data structure cần hiểu trước code.** Trong reverse-preorder approach, prev là head của chain đã flatten gồm nodes xuất hiện sau current trong preorder. Set current.right=prev, current.left=null rồi prev=current giữ invariant chain đúng.

**Dry run mental theo implementation.** Dry run tree 1(left2,right5), 2 children3,4: process reverse preorder 6,5,4,3,2,1; mỗi current nối right tới prev, cuối chain 1->2->3->4->5->6.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là overwrite right trước khi recurse/giữ nó hoặc quên left=null. Khi nào dùng: tree-to-list in traversal order thường dễ reasoning bằng predecessor/successor state trong DFS.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Preorder tại node là `node -> left subtree -> right subtree`. Nếu có left, nối original right vào rightmost node của left subtree rồi chuyển left sang right; lặp dọc right chain.

## 2. Optimal Java solution

```java
public class Solution {
    public void flatten(TreeNode root) {
        TreeNode current = root;

        while (current != null) {
            if (current.left != null) {
                // Rightmost node của left subtree là node cuối cùng của left subtree
                // trong preorder sau khi left subtree tự được flatten về right chain.
                TreeNode predecessor = current.left;
                while (predecessor.right != null) {
                    predecessor = predecessor.right;
                }

                // Bảo toàn original right subtree bằng cách nối nó sau predecessor
                // TRƯỚC khi ghi đè current.right bằng current.left.
                predecessor.right = current.right;
                current.right = current.left;
                current.left = null;
            }

            // Sau rewiring, current.right chính là node kế tiếp trong preorder.
            current = current.right;
        }
    }
}
```

## 3. Correctness

Rewiring biến local order thành `current -> left subtree -> original right subtree` mà không đổi internal order của hai subtrees. Lặp cho mọi node làm tất cả left pointers null và right chain đúng preorder.

## 4. Complexity

```text
Time: O(n) amortized
Space: O(1)
```

## 5. Common mistakes

- Ghi đè right trước khi bảo toàn original right subtree.
- Quên set left null.
- Tạo node mới thay vì in-place.
