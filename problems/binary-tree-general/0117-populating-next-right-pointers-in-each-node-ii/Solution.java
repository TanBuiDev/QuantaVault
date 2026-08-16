public class Solution {
    public Node connect(Node root) {
        Node levelStart = root;

        while (levelStart != null) {
            Node nextLevelStart = null;
            Node nextLevelTail = null;

            for (Node current = levelStart; current != null; current = current.next) {
                if (current.left != null) {
                    if (nextLevelStart == null) nextLevelStart = current.left;
                    else nextLevelTail.next = current.left;
                    nextLevelTail = current.left;
                }
                if (current.right != null) {
                    if (nextLevelStart == null) nextLevelStart = current.right;
                    else nextLevelTail.next = current.right;
                    nextLevelTail = current.right;
                }
            }

            levelStart = nextLevelStart;
        }

        return root;
    }
}
