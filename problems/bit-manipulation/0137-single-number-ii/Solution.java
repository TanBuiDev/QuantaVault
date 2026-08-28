class Solution {
    public int singleNumber(int[] nums) {
        // For each bit independently, ones/twos encode occurrence count modulo 3:
        // 00 = seen 0 mod 3, 01 = seen once, 10 = seen twice.
        int ones = 0;
        int twos = 0;

        for (int num : nums) {
            // XOR toggles the incoming bits into the next count state; masking by
            // the other register keeps ones and twos mutually exclusive. On the
            // third occurrence a bit is cleared from both registers (count -> 0 mod 3).
            ones = (ones ^ num) & ~twos;
            twos = (twos ^ num) & ~ones;
        }

        // Triplicated values contribute 0 modulo 3 at every bit; the unique value
        // contributes exactly one occurrence, so its complete bit pattern is in ones.
        return ones;
    }
}
