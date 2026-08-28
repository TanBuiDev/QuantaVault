class Solution {
    public boolean isPalindrome(int x) {
        // Negative numbers have a leading '-' with no matching trailing symbol.
        // A nonzero number ending in 0 would need an impossible leading 0 when reversed.
        if (x < 0 || (x % 10 == 0 && x != 0)) {
            return false;
        }

        int reversedHalf = 0;

        // Reverse only half the digits: this avoids possible full-number overflow and
        // stops exactly when reversedHalf has caught up with the unprocessed prefix.
        while (x > reversedHalf) {
            reversedHalf = reversedHalf * 10 + x % 10;
            x /= 10;
        }

        // Even length: halves must match. Odd length: reversedHalf contains the
        // middle digit as its last digit, which is ignored by dividing it by 10.
        return x == reversedHalf || x == reversedHalf / 10;
    }
}
