import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        // Sorting tạo monotonic order để mỗi lần dịch left/right có thể loại
        // cả một vùng pair candidate thay vì thử mọi bộ ba O(n^3).
        Arrays.sort(nums);
        List<List<Integer>> result = new ArrayList<>();

        for (int i = 0; i < nums.length - 2; i++) {
            // Cùng một anchor value sẽ sinh lại cùng các value-triplet đã xét.
            if (i > 0 && nums[i] == nums[i - 1]) {
                continue;
            }

            // Sau sort, nếu anchor đã dương thì cả hai số phía sau đều >= anchor,
            // nên tổng không thể quay về 0; có thể dừng toàn bộ search.
            if (nums[i] > 0) {
                break;
            }

            int left = i + 1;
            int right = nums.length - 1;

            while (left < right) {
                int sum = nums[i] + nums[left] + nums[right];

                // Tổng quá nhỏ: giảm right chỉ làm tổng nhỏ hơn nữa;
                // chỉ tăng left mới có thể tiến gần 0.
                if (sum < 0) {
                    left++;
                } else if (sum > 0) {
                    // Đối xứng, tổng quá lớn thì phải giảm right.
                    right--;
                } else {
                    result.add(Arrays.asList(nums[i], nums[left], nums[right]));
                    left++;
                    right--;

                    // Sau khi đã lưu một triplet, các giá trị trùng liên tiếp ở hai đầu
                    // chỉ tạo lại đúng value-triplet đó nên có thể bỏ qua an toàn.
                    while (left < right && nums[left] == nums[left - 1]) {
                        left++;
                    }
                    while (left < right && nums[right] == nums[right + 1]) {
                        right--;
                    }
                }
            }
        }

        return result;
    }
}
