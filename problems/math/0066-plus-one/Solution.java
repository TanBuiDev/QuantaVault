class Solution {
    public int[] plusOne(int[] digits) {
        // Addition starts at the least-significant digit because only a 9 can
        // propagate a carry farther to the left.
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                // The first non-9 absorbs the +1 and ends all carry propagation.
                digits[i]++;
                return digits;
            }

            // 9 + 1 becomes 0 with carry 1 to the next digit.
            digits[i] = 0;
        }

        // Reaching here means every original digit was 9, so the result is
        // 1 followed by exactly digits.length zeros.
        int[] result = new int[digits.length + 1];
        result[0] = 1;
        return result;
    }
}
