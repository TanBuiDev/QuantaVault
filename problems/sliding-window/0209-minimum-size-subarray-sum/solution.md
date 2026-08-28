# 209. Minimum Size Subarray Sum — Solution

## 1. Core idea / Ý tưởng cốt lõi

Điều kiện quan trọng nhất là mọi phần tử đều dương. Vì vậy window sum có tính monotonic:

- mở rộng sang phải → sum tăng;
- thu hẹp từ trái → sum giảm.

Ta có thể mở rộng tới khi window hợp lệ, rồi shrink liên tục để tìm window ngắn nhất với cùng `right`.

---

## 2. Optimal Java solution

```java
class Solution {
    public int minSubArrayLen(int target, int[] nums) {
        int left = 0;
        int sum = 0;
        int best = Integer.MAX_VALUE;

        for (int right = 0; right < nums.length; right++) {
            sum += nums[right];

            // Vì mọi nums[i] > 0, bỏ phần tử trái luôn làm sum giảm. Do đó khi
            // window đã valid, shrink liên tục sẽ tìm shortest valid start cho right này.
            while (sum >= target) {
                best = Math.min(best, right - left + 1);
                sum -= nums[left];
                left++;
            }
        }

        // Sentinel phân biệt "chưa từng có valid window" với một độ dài thật.
        return best == Integer.MAX_VALUE ? 0 : best;
    }
}
```

Nếu `best` không được cập nhật, trả `0`.

---

## 3. Why shrinking while valid is correct

Với một `right` cố định, khi `sum >= target`, current window hợp lệ. Vì ta muốn **minimum length**, không có lý do giữ một prefix thừa ở bên trái. Ta bỏ dần `nums[left]` cho tới khi window vừa trở thành không hợp lệ.

Window hợp lệ ngắn nhất kết thúc tại `right` chính là window cuối cùng trước khi điều kiện bị phá vỡ. Vòng `while` kiểm tra chính xác tất cả các candidate đó.

---

## 4. Dry run

```text
target = 7
nums = [2,3,1,2,4,3]
```

Tới `right=3`, sum bằng `8`:

```text
[2,3,1,2] -> length 4
```

Shrink:

```text
[3,1,2] -> sum 6
```

Tiếp tục mở rộng. Khi `right=4`, sum `10`:

```text
[3,1,2,4] -> 4
[1,2,4]   -> 3
```

Khi `right=5`, eventually đạt:

```text
[4,3] -> 2
```

Đáp án `2`.

---

## 5. Why positivity matters

Nếu có số âm, bỏ một phần tử bên trái có thể làm sum **tăng**, và thêm phần tử bên phải có thể làm sum **giảm**. Khi đó quy tắc shrink/expand monotonic này không còn đúng.

Vì vậy sliding window `O(n)` ở đây phụ thuộc trực tiếp vào constraint `nums[i] > 0`.

---

## 6. O(n log n) follow-up

Tạo prefix sum:

```text
prefix[i] = nums[0] + ... + nums[i-1]
```

Vì nums positive nên prefix tăng strictly. Với mỗi start `i`, binary-search prefix nhỏ nhất thỏa:

```text
prefix[j] - prefix[i] >= target
```

hay:

```text
prefix[j] >= prefix[i] + target
```

Có `n` binary searches:

```text
Time: O(n log n)
Space: O(n)
```

---

## 7. Correctness / Vì sao đúng

Mỗi `right` được mở rộng theo thứ tự. Khi window đạt target, vòng `while` xét mọi window hợp lệ có cùng `right` bằng cách tăng `left` từng bước cho tới khi không còn hợp lệ. Vì sum giảm monotonic khi tăng `left`, sau điểm đó không có window ngắn hơn với cùng `right` mà vẫn hợp lệ.

Do mọi subarray đều có một right endpoint và candidate ngắn nhất cho từng right đều được xét, `best` cuối cùng là minimum global.

---

## 8. Complexity

Mỗi phần tử được `right` thêm vào đúng một lần và `left` loại ra tối đa một lần:

```text
Time: O(n)
Extra space: O(1)
```

---

## 9. Common mistakes

1. Dùng `if (sum >= target)` thay vì `while`, nên không shrink tối đa.
2. Quên trả `0` khi không có window hợp lệ.
3. Áp dụng cùng logic cho array có số âm mà không kiểm tra invariant.
4. Tính length sai thành `right-left` thay vì `right-left+1`.
