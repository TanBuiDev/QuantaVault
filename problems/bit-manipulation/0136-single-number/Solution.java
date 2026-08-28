class Solution {
    public int singleNumber(int[] nums) {
        int answer = 0;

        for (int num : nums) {
            // XOR is associative/commutative and x ^ x == 0, so every duplicated
            // value cancels with its pair regardless of input order.
            answer ^= num;
        }

        // 0 ^ unique == unique after all pairs have vanished.
        return answer;
    }
}
