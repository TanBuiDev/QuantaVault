public class TestSolution {
    public static void main(String[] args) {
        Node a = new Solution().construct(new int[][]{{0,1},{1,0}});
        if (a.isLeaf || a.topLeft.val || !a.topRight.val || !a.bottomLeft.val || a.bottomRight.val) throw new AssertionError("2x2 structure");
        assertAllLeaves(a);
        Node b = new Solution().construct(new int[][]{{1,1},{1,1}});
        if (!b.isLeaf || !b.val) throw new AssertionError("uniform ones");
        Node c = new Solution().construct(new int[][]{{0}});
        if (!c.isLeaf || c.val) throw new AssertionError("single zero");
        System.out.println("PASS 427 Construct Quad Tree");
    }
    static void assertAllLeaves(Node n){if(!n.topLeft.isLeaf||!n.topRight.isLeaf||!n.bottomLeft.isLeaf||!n.bottomRight.isLeaf)throw new AssertionError();}
}
