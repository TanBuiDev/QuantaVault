class Solution {
    public int trailingZeroes(int n) {
        int count = 0;

        // Each trailing zero needs a factor 10 = 2*5. Factorials contain many more
        // factors of 2 than 5, so the number of zeroes is exactly the number of 5s.
        while (n > 0) {
            // floor(n/5) counts one 5 from every multiple of 5; repeating division
            // also counts extra 5s from multiples of 25, 125, ...
            n /= 5;
            count += n;
        }
        return count;
    }
}
