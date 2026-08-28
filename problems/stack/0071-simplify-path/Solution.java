import java.util.ArrayDeque;
import java.util.Deque;

class Solution {
    public String simplifyPath(String path) {
        Deque<String> directories = new ArrayDeque<>();

        for (String part : path.split("/")) {
            // Empty token chỉ do repeated/edge slash, còn "." không đổi location;
            // bỏ chúng tương đương normalize mà không thêm component vào canonical path.
            if (part.isEmpty() || part.equals(".")) {
                continue;
            }

            if (part.equals("..")) {
                // Parent navigation chỉ hủy directory gần nhất; tại root thì không
                // có parent để đi lên nên ".." trở thành no-op.
                if (!directories.isEmpty()) {
                    directories.removeLast();
                }
            } else {
                // Chỉ exact "." và ".." là special; tên như "..." phải giữ nguyên.
                directories.addLast(part);
            }
        }

        // addLast/removeLast giữ deque theo thứ tự root -> leaf nên có thể join trực tiếp.
        return "/" + String.join("/", directories);
    }
}
