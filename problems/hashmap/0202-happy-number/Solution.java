class Solution {
    public boolean isHappy(int n) {
        int slow = n;
        int fast = n;

        // next() tạo một functional graph: mỗi state có đúng một successor.
        // Nếu không tới fixed point 1 thì sequence hữu hạn phải rơi vào một cycle khác.
        do {
            slow = next(slow);
            fast = next(next(fast));
        } while (slow != fast);

        // Nếu cycle gặp được chứa 1 thì vì next(1)=1, điểm gặp cuối cùng chính là 1.
        return slow == 1;
    }

    private int next(int n) {
        int sum = 0;
        while (n > 0) {
            int digit = n % 10;
            sum += digit * digit;
            n /= 10;
        }
        return sum;
    }
}
