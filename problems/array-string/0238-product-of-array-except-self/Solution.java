class Solution {
    public int[] productExceptSelf(int[] nums) {
        int n = nums.length;
        int[] answer = new int[n];

        int prefix = 1;
        for (int i = 0; i < n; i++) {
            // Gán trước khi nhân nums[i] để answer[i] chỉ chứa tích bên trái,
            // tuyệt đối không vô tình đưa chính phần tử i vào kết quả của nó.
            answer[i] = prefix;
            prefix *= nums[i];
        }

        int suffix = 1;
        for (int i = n - 1; i >= 0; i--) {
            // suffix lúc này chỉ chứa các phần tử bên phải i; nhân nó với prefix
            // đã lưu trong answer[i] tạo đúng tích của mọi phần tử trừ nums[i].
            answer[i] *= suffix;
            suffix *= nums[i];
        }

        return answer;
    }
}
