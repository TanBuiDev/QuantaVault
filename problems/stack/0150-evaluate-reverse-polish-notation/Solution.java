import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public int evalRPN(String[] tokens) {
        Deque<Integer> stack = new ArrayDeque<>();

        for (String token : tokens) {
            switch (token) {
                case "+": {
                    int right = stack.pop();
                    int left = stack.pop();
                    stack.push(left + right);
                    break;
                }
                case "-": {
                    int right = stack.pop();
                    int left = stack.pop();
                    stack.push(left - right);
                    break;
                }
                case "*": {
                    int right = stack.pop();
                    int left = stack.pop();
                    stack.push(left * right);
                    break;
                }
                case "/": {
                    int right = stack.pop();
                    int left = stack.pop();
                    stack.push(left / right);
                    break;
                }
                default:
                    stack.push(Integer.parseInt(token));
            }
        }

        return stack.pop();
    }
}
