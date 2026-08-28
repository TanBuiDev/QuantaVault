class Solution {
    public int rangeBitwiseAnd(int left, int right) {
        int shifts = 0;

        // Across a consecutive range, every bit below the first differing prefix bit
        // takes both 0 and 1 somewhere, so those suffix bits must AND to 0.
        while (left != right) {
            left >>= 1;
            right >>= 1;
            shifts++;
        }

        // What remains is the common binary prefix shared by every number in range;
        // restore its position and fill the proven-varying suffix with zeros.
        return left << shifts;
    }
}
