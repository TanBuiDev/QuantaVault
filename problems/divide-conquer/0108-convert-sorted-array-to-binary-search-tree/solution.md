# Solution / Lời giải — 108. Convert Sorted Array to Binary Search Tree

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
