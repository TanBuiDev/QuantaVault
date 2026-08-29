# Solution / Lời giải — 108. Convert Sorted Array to Binary Search Tree

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Sorted array muốn BST height-balanced thì root nên là phần tử giữa để số elements hai phía gần nhau; left half dựng left subtree và right half dựng right subtree với cùng quy tắc.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** Insert lần lượt sorted values vào BST sẽ tạo cây lệch O(n) height. Divide-and-conquer chọn midpoint biến sorted order trực tiếp thành balanced structure và mỗi element chỉ tạo một node.

**State / invariant / data structure cần hiểu trước code.** Recursive call build(left,right) chịu trách nhiệm đúng segment đó. mid là root; invariant inorder của subtree kết quả đúng nums[left..right] và hai subtree sizes chênh tối đa theo midpoint split.

**Dry run mental theo implementation.** Dry run [-10,-3,0,5,9]: chọn0 root; left segment [-10,-3] tạo -10/-3 tùy midpoint convention; right [5,9]; chiều cao hai phía cân bằng.

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là copy subarrays ở mỗi recursion làm O(n log n) extra work. Khi nào dùng: sorted sequence → balanced BST thường là midpoint divide-and-conquer với index bounds.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea

Use the middle element as each subtree root. Sorted order gives the BST partition automatically, while halving the range keeps subtree heights balanced.

## 2. Optimal Java solution

```java
class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}

class Solution {
    public TreeNode sortedArrayToBST(int[] nums) {
        return build(nums, 0, nums.length - 1);
    }

    private TreeNode build(int[] nums, int left, int right) {
        if (left > right) return null;

        // Choosing the middle keeps left/right segment sizes within one element,
        // which recursively gives the height-balanced requirement.
        int mid = left + (right - left) / 2;
        TreeNode root = new TreeNode(nums[mid]);

        // Because nums is sorted, every value left of mid is < root and every
        // value right of mid is > root, so the recursive pieces are valid BST subtrees.
        root.left = build(nums, left, mid - 1);
        root.right = build(nums, mid + 1, right);
        return root;
    }
}
```

## 3. Correctness

Each recursive range is split around its middle. Sorted order guarantees the BST inequality on both children, and recursively balanced range sizes guarantee height balance.

## 4. Complexity

`O(n)` time, `O(log n)` recursion stack for the balanced construction.
