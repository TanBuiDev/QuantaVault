class Solution {
    public int hammingWeight(int n) {
        int count = 0;

        while (n != 0) {
            // n-1 flips the lowest set bit to 0 and all lower zeros to 1; AND with
            // original n therefore clears exactly that lowest set bit and nothing higher.
            n &= n - 1;
            count++;
        }

        // One iteration runs per original set bit, so count is the Hamming weight.
        return count;
    }
}
