class Solution {
    public int[] twoSum(int[] numbers, int target) {
        int left = 0;
        int right = numbers.length - 1;

        while (left < right) {
            int sum = numbers[left] + numbers[right];

            if (sum == target) {
                return new int[]{left + 1, right + 1};
            }

            // Vì array sorted, nếu sum quá nhỏ thì với current left,
            // mọi right nhỏ hơn cũng chỉ cho sum nhỏ hơn; current left bị loại hoàn toàn.
            if (sum < target) {
                left++;
            } else {
                // Đối xứng, nếu sum quá lớn thì current right không thể ghép với
                // bất kỳ left nào còn lại để ra target, nên giảm right là an toàn.
                right--;
            }
        }

        // Constraint đảm bảo có đúng một solution; tới đây chỉ khi input vi phạm đề.
        throw new IllegalStateException("No solution");
    }
}
