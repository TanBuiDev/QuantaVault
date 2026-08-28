import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public boolean isValid(String s) {
        Deque<Character> stack = new ArrayDeque<>();

        for (char c : s.toCharArray()) {
            // Push expected closer thay vì opening bracket để stack top luôn là
            // ký tự duy nhất hợp lệ có thể xuất hiện tiếp theo ở nesting hiện tại.
            if (c == '(') {
                stack.push(')');
            } else if (c == '[') {
                stack.push(']');
            } else if (c == '{') {
                stack.push('}');
            } else if (stack.isEmpty() || stack.pop() != c) {
                // Closing bracket không thể được sửa bởi ký tự tương lai: opening
                // tương ứng phải nằm trước nó và đúng top theo quy tắc LIFO.
                return false;
            }
        }

        // Không mismatch vẫn chưa đủ: stack còn phần tử nghĩa là có opening chưa đóng.
        return stack.isEmpty();
    }
}
