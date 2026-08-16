class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
}

public class TestSolution {
    public static void main(String[] args) {
        testExample();
        testSingle();
        testRightSkewed();
        System.out.println("PASS 173 Binary Search Tree Iterator");
    }

    private static void testExample() {
        TreeNode n7 = new TreeNode(7), n3 = new TreeNode(3), n15 = new TreeNode(15);
        TreeNode n9 = new TreeNode(9), n20 = new TreeNode(20);
        n7.left = n3; n7.right = n15; n15.left = n9; n15.right = n20;
        BSTIterator it = new BSTIterator(n7);
        check(it.next() == 3, "first should be 3");
        check(it.next() == 7, "second should be 7");
        check(it.hasNext(), "should have 9");
        check(it.next() == 9, "third should be 9");
        check(it.hasNext(), "should have 15");
        check(it.next() == 15, "fourth should be 15");
        check(it.hasNext(), "should have 20");
        check(it.next() == 20, "fifth should be 20");
        check(!it.hasNext(), "iterator should be exhausted");
    }

    private static void testSingle() {
        BSTIterator it = new BSTIterator(new TreeNode(5));
        check(it.hasNext(), "single node should exist");
        check(it.next() == 5, "single value should be 5");
        check(!it.hasNext(), "single iterator should be exhausted");
    }

    private static void testRightSkewed() {
        TreeNode n1 = new TreeNode(1), n2 = new TreeNode(2), n3 = new TreeNode(3);
        n1.right = n2; n2.right = n3;
        BSTIterator it = new BSTIterator(n1);
        check(it.next() == 1 && it.next() == 2 && it.next() == 3, "right-skewed inorder mismatch");
        check(!it.hasNext(), "right-skewed iterator should be exhausted");
    }

    private static void check(boolean condition, String message) {
        if (!condition) throw new AssertionError(message);
    }
}
