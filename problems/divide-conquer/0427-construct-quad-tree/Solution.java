class Node {
    public boolean val;
    public boolean isLeaf;
    public Node topLeft;
    public Node topRight;
    public Node bottomLeft;
    public Node bottomRight;

    public Node() {}
    public Node(boolean val, boolean isLeaf) { this.val = val; this.isLeaf = isLeaf; }
    public Node(boolean val, boolean isLeaf, Node topLeft, Node topRight, Node bottomLeft, Node bottomRight) {
        this.val = val; this.isLeaf = isLeaf; this.topLeft = topLeft; this.topRight = topRight; this.bottomLeft = bottomLeft; this.bottomRight = bottomRight;
    }
}

class Solution {
    private int[][] prefix;

    public Node construct(int[][] grid) {
        int n = grid.length;
        prefix = new int[n + 1][n + 1];

        // 2D prefix sums let every recursive square ask "how many ones are here?"
        // in O(1), avoiding a fresh scan of the region at every tree level.
        for (int r = 0; r < n; r++) {
            for (int c = 0; c < n; c++) {
                prefix[r + 1][c + 1] = grid[r][c] + prefix[r][c + 1] + prefix[r + 1][c] - prefix[r][c];
            }
        }
        return build(0, 0, n);
    }

    private Node build(int row, int col, int size) {
        int ones = sum(row, col, size);

        // A region is a leaf iff all size^2 cells agree: either zero ones or all ones.
        if (ones == 0 || ones == size * size) return new Node(ones != 0, true);

        // Mixed regions cannot be represented by one leaf, so split into the four
        // equal quadrants required by the quad-tree definition.
        int half = size / 2;
        return new Node(true, false,
            build(row, col, half),
            build(row, col + half, half),
            build(row + half, col, half),
            build(row + half, col + half, half));
    }

    private int sum(int row, int col, int size) {
        int r2 = row + size, c2 = col + size;

        // Inclusion-exclusion returns the number of ones in [row,r2) x [col,c2).
        return prefix[r2][c2] - prefix[row][c2] - prefix[r2][col] + prefix[row][col];
    }
}
