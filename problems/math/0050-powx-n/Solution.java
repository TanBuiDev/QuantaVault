class Solution {
    public double myPow(double x, int n) {
        // Convert before negation because -Integer.MIN_VALUE overflows an int.
        long power = n;
        if (power < 0) {
            // x^(-p) = (1/x)^p lets the main loop handle only nonnegative exponents.
            x = 1.0 / x;
            power = -power;
        }

        double answer = 1.0;
        while (power > 0) {
            // Binary exponentiation: when the current exponent bit is 1, the
            // corresponding power-of-two contribution belongs in the result.
            if ((power & 1L) == 1L) {
                answer *= x;
            }

            // Moving to the next exponent bit doubles its weight, so square the base.
            x *= x;
            power >>= 1;
        }
        return answer;
    }
}
