class Solution {
    public int reverseBits(int n) {
        int result = 0;

        // int has exactly 32 bits; process all of them so leading zeros in n become
        // trailing zeros in the reversed representation rather than being skipped.
        for (int i = 0; i < 32; i++) {
            // Shift the already-built prefix left and append n's current low bit.
            result = (result << 1) | (n & 1);

            // Unsigned shift is required: for negative n, arithmetic >> would keep
            // injecting sign-bit ones instead of exposing the original 32-bit pattern.
            n >>>= 1;
        }
        return result;
    }
}
