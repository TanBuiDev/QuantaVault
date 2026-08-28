import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int calculate(String s) {
        int result = 0;
        int number = 0;
        int sign = 1;
        Deque<Integer> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            if (Character.isDigit(c)) {
                // Build multi-digit number incrementally; chưa commit cho tới khi
                // gặp operator/closing parenthesis hoặc hết input.
                number = number * 10 + (c - '0');
            } else if (c == '+') {
                result += sign * number;
                number = 0;
                sign = 1;
            } else if (c == '-') {
                result += sign * number;
                number = 0;
                sign = -1;
            } else if (c == '(') {
                // Parenthesis mở một context độc lập. Phải lưu cả outer result lẫn
                // sign trước '(' để xử lý đúng dạng -(...) khi inner expression kết thúc.
                stack.push(result);
                stack.push(sign);
                result = 0;
                sign = 1;
            } else if (c == ')') {
                // Commit term cuối của inner context trước khi ghép inner result
                // thành một term duy nhất của outer context.
                result += sign * number;
                number = 0;

                // Push order là result rồi sign, nên pop sign trước; phép ghép chính là
                // outerResult + outerSign * innerResult.
                result *= stack.pop();
                result += stack.pop();
            }
        }

        // Input có thể kết thúc bằng digit nên term cuối chưa gặp operator để commit.
        return result + sign * number;
    }
}
