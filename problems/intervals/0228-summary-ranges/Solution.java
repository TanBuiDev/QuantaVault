import java.util.ArrayList;
import java.util.List;

class Solution {
    public List<String> summaryRanges(int[] nums) {
        List<String> answer = new ArrayList<>();
        if (nums.length == 0) {
            return answer;
        }

        int start = nums[0];
        int end = nums[0];

        for (int i = 1; i < nums.length; i++) {
            // Cast trước phép +1 để tránh int overflow khi end == Integer.MAX_VALUE;
            // comparison cần phản ánh tính consecutive thật chứ không phải wrap-around.
            if ((long) nums[i] == (long) end + 1L) {
                end = nums[i];
            } else {
                // Có gap nghĩa là run [start,end] đã maximal vì input sorted/unique;
                // không phần tử tương lai nào có thể nối lại qua số đang bị thiếu.
                answer.add(format(start, end));
                start = nums[i];
                end = nums[i];
            }
        }

        // Run cuối không gặp gap phía sau để tự được flush trong loop.
        answer.add(format(start, end));
        return answer;
    }

    private String format(int start, int end) {
        return start == end ? String.valueOf(start) : start + "->" + end;
    }
}
