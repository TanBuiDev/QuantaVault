class Solution {
    public int mySqrt(int x) {
        if (x < 2) {
            return x;
        }

        int left = 1;
        int right = x / 2;
        int answer = 1;

        // Search for the largest integer mid whose square is <= x.
        while (left <= right) {
            int mid = left + (right - left) / 2;

            // Cast before multiplication because mid*mid can exceed signed int range.
            long square = (long) mid * mid;

            if (square <= x) {
                // mid is feasible; remember it and look right for a larger feasible root.
                answer = mid;
                left = mid + 1;
            } else {
                // mid and every larger number square above x, so discard them.
                right = mid - 1;
            }
        }

        return answer;
    }
}
