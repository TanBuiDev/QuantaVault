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
            if ((long) nums[i] == (long) end + 1L) {
                end = nums[i];
            } else {
                answer.add(format(start, end));
                start = nums[i];
                end = nums[i];
            }
        }

        answer.add(format(start, end));
        return answer;
    }

    private String format(int start, int end) {
        return start == end ? String.valueOf(start) : start + "->" + end;
    }
}
