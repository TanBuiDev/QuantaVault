# 300. Longest Increasing Subsequence — Solution

## 1. Core idea / Intuition

Ta duy trì `tails[len - 1]` là **giá trị kết thúc nhỏ nhất** của một increasing subsequence có độ dài `len` đã thấy trong prefix.

Với mỗi `x`, dùng binary search tìm vị trí đầu tiên có `tails[pos] >= x`:

- nếu `pos == size`, append `x` và tăng độ dài tốt nhất;
- ngược lại replace `tails[pos] = x` để tạo tail nhỏ hơn, linh hoạt hơn cho tương lai.

`tails` không nhất thiết là một subsequence thực sự; nó là cấu trúc tóm tắt để tính độ dài.

## 2. Requirement recap / Tóm tắt yêu cầu

Subsequence giữ nguyên thứ tự tương đối nhưng không cần liên tiếp. Yêu cầu **strictly increasing**, nên duplicate không được tăng length.

## 3. Key observations / Nhận xét quan trọng

- Với cùng một độ dài, tail nhỏ hơn luôn ít nhất tốt bằng tail lớn hơn cho việc mở rộng sau này.
- Vì `tails` tăng nghiêm ngặt theo vị trí, có thể binary search.
- Phải dùng lower bound `>= x`; dùng `> x` sẽ biến bài thành non-decreasing subsequence.

## 4. Alternative approaches / Các hướng khác

DP cổ điển `dp[i] = 1 + max(dp[j])` với `j < i` và `nums[j] < nums[i]` chạy `O(n^2)` và đúng với constraints. Tuy nhiên follow-up yêu cầu `O(n log n)`, nên canonical solution dùng tails + binary search.

## 5. Optimal approach / Hướng tối ưu

```text
size = 0
for x in nums:
    pos = lower_bound(tails[0..size), x)
    tails[pos] = x
    if pos == size: size++
return size
```

## 6. Java solution overview

```java
class Solution {
    public int lengthOfLIS(int[] nums) {
        int[] tails = new int[nums.length];
        int size = 0;
        for (int x : nums) {
            int left = 0;
            int right = size;
            while (left < right) {
                int mid = left + (right - left) / 2;
                if (tails[mid] < x) left = mid + 1;
                else right = mid;
            }
            tails[left] = x;
            if (left == size) size++;
        }
        return size;
    }
}
```

## 7. Code explanation / Giải thích code

Binary search duy trì interval `[left,right)` và tìm lower bound. Replace một tail không làm mất khả năng tạo subsequence cùng length; nó chỉ làm tail tốt hơn hoặc bằng cho tương lai.

## 8. Dry run / Chạy thử

Với `[10,9,2,5,3,7,101,18]`, `tails` lần lượt thu gọn từ `[10]` → `[9]` → `[2]` → `[2,5]` → `[2,3]` → `[2,3,7]` → `[2,3,7,101]` → `[2,3,7,18]`. `size=4`.

## 9. Time and space complexity

```text
Time:  O(n log n)
Space: O(n)
```

## 10. Why the algorithm is correct / Vì sao đúng

Invariant: sau mỗi prefix, với mỗi length `l` từ `1..size`, `tails[l-1]` là tail nhỏ nhất của một increasing subsequence length `l`. Lower bound xác định đúng length dài nhất mà `x` có thể thay thế/mở rộng. Replace giữ invariant tail tối thiểu; append chứng minh tồn tại subsequence dài hơn. Do đó `size` cuối cùng bằng LIS length.

## 11. Edge cases

- Một phần tử.
- Mọi phần tử bằng nhau.
- Tăng nghiêm ngặt hoàn toàn.
- Giảm nghiêm ngặt hoàn toàn.
- Giá trị âm và duplicate.

## 12. Common mistakes

- Dùng upper bound thay vì lower bound.
- Nghĩ rằng `tails` luôn là chính LIS được chọn.
- Dùng `<=` sai trong điều kiện tăng nghiêm ngặt.
- Trả về giá trị tail thay vì `size`.

## 13. Pattern recognition / Khi nào tái sử dụng

Tails + binary search xuất hiện trong LIS và các bài tối ưu chain/subsequence khi ta có thể giữ best ending value cho mỗi length.

## 14. Vocabulary

- **subsequence**: dãy con giữ nguyên thứ tự tương đối
- **strictly increasing**: tăng nghiêm ngặt
- **tail value**: giá trị kết thúc
- **lower bound**: vị trí đầu tiên không nhỏ hơn target
- **patience sorting**: kỹ thuật thường dùng để diễn giải LIS O(n log n)
