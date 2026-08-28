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
