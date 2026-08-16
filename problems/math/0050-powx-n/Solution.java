class Solution {
    public double myPow(double x, int n) {
        long power = n;
        if (power < 0) {
            x = 1.0 / x;
            power = -power;
        }

        double answer = 1.0;
        while (power > 0) {
            if ((power & 1L) == 1L) {
                answer *= x;
            }
            x *= x;
            power >>= 1;
        }
        return answer;
    }
}
