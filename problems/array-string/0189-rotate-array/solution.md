# 189. Rotate Array — Solution

## 1. Core idea / Ý tưởng cốt lõi

Mục tiêu là đưa `k` phần tử cuối lên đầu mà vẫn giữ thứ tự tương đối của hai đoạn.

Sau khi chuẩn hóa `k %= n`, chia mảng thành:

```text
A = nums[0 .. n-k-1]
B = nums[n-k .. n-1]
```

Kết quả cần là:

```text
B A
```

Cách tối ưu dùng **ba lần reverse**:

```text
reverse(A B) -> reverse(B) reverse(A)
reverse phần đầu k phần tử -> B reverse(A)
reverse phần còn lại       -> B A
```

Do đó:

```text
Time:  O(n)
Space: O(1)
```

---

## 2. Requirement recap / Tóm tắt yêu cầu

- Xoay `nums` sang phải `k` bước.
- Sửa trực tiếp `nums`.
- `k` có thể lớn hơn `nums.length`.
- Follow-up yêu cầu in-place với `O(1)` extra space.

Đề song ngữ đầy đủ nằm ở [`problem.md`](problem.md).

---

## 3. Important observations / Nhận xét quan trọng

### Observation 1 — Chuẩn hóa `k`

Xoay đúng `n` bước đưa mảng về trạng thái ban đầu, nên:

```java
k %= n;
```

Ví dụ `n = 5`, `k = 7` tương đương `k = 2`.

### Observation 2 — Kết quả là đổi chỗ hai block

Với:

```text
[1,2,3,4,5,6,7], k = 3
```

ta có:

```text
A = [1,2,3,4]
B = [5,6,7]
```

Cần biến `A B` thành `B A`.

### Observation 3 — Reverse cho phép đổi block in-place

Reverse toàn bộ làm thứ tự trong từng block cũng bị đảo. Hai lần reverse cục bộ sau đó khôi phục thứ tự đúng của từng block.

---

## 4. Alternative approaches / Các hướng giải khác

### Approach A — Rotate từng bước

Mỗi bước lấy phần tử cuối đưa lên đầu.

```text
Time:  O(n * k)
Space: O(1)
```

Dễ hiểu nhưng chậm khi `n` và `k` lớn.

### Approach B — Auxiliary array

Đưa `nums[i]` đến:

```text
(i + k) % n
```

Sau đó copy mảng phụ trở lại `nums`.

```text
Time:  O(n)
Space: O(n)
```

Đơn giản và an toàn nhưng không đạt follow-up `O(1)` space.

### Approach C — Cyclic replacements

Di chuyển phần tử theo các cycle của mapping `(i + k) % n`.

```text
Time:  O(n)
Space: O(1)
```

Cũng tối ưu nhưng implementation dễ sai hơn vì phải quản lý số phần tử đã di chuyển và nhiều cycle khi `gcd(n, k) > 1`.

### Approach D — Three reversals

Canonical solution của repo:

```text
reverse whole array
reverse first k elements
reverse remaining n-k elements
```

```text
Time:  O(n)
Space: O(1)
```

Ngắn, dễ chứng minh và dễ trình bày trong interview.

---

## 5. Optimal Java solution

```java
class Solution {
    public void rotate(int[] nums, int k) {
        int n = nums.length;
        k %= n;

        reverse(nums, 0, n - 1);
        reverse(nums, 0, k - 1);
        reverse(nums, k, n - 1);
    }

    private void reverse(int[] nums, int left, int right) {
        while (left < right) {
            int temp = nums[left];
            nums[left] = nums[right];
            nums[right] = temp;
            left++;
            right--;
        }
    }
}
```

Canonical code nằm ở [`Solution.java`](Solution.java).

---

## 6. Dry run

Input:

```text
nums = [1,2,3,4,5,6,7]
k = 3
```

### Step 1 — Reverse toàn bộ

```text
[7,6,5,4,3,2,1]
```

### Step 2 — Reverse `0..k-1`

```text
[5,6,7,4,3,2,1]
```

### Step 3 — Reverse `k..n-1`

```text
[5,6,7,1,2,3,4]
```

Đúng kết quả cần tìm.

---

## 7. Why it is correct / Vì sao đúng

Gọi mảng ban đầu là `A B`, trong đó `B` có đúng `k` phần tử.

Sau khi reverse toàn bộ:

```text
reverse(B) reverse(A)
```

Reverse `k` phần tử đầu biến `reverse(B)` trở lại `B`:

```text
B reverse(A)
```

Reverse phần còn lại biến `reverse(A)` trở lại `A`:

```text
B A
```

`B A` chính là mảng được xoay sang phải `k` bước. Vì vậy thuật toán đúng.

---

## 8. Complexity

Ba lần reverse xử lý tổng cộng số phần tử tỷ lệ tuyến tính với `n`:

```text
Time:  O(n)
Space: O(1)
```

---

## 9. Edge cases

- `k = 0`: các reverse vẫn an toàn và mảng không đổi.
- `k == n`: sau `k %= n`, `k = 0`.
- `k > n`: modulo loại các vòng xoay dư thừa.
- `n = 1`: mọi `k` đều cho cùng mảng.
- Giá trị âm hoặc trùng nhau không ảnh hưởng vì thuật toán chỉ đổi vị trí.

---

## 10. Common mistakes

1. Quên `k %= n`.
2. Reverse sai biên `0..k-1` hoặc `k..n-1`.
3. Dùng `n-k` làm index kết thúc sai ngữ cảnh.
4. Tạo mảng phụ dù interview yêu cầu `O(1)` extra space.
5. Dùng repeated shifting và vô tình tạo `O(nk)`.

---

## 11. Pattern recognition

Khi thấy bài yêu cầu **rotate array in-place**, hãy nhớ hai pattern mạnh:

```text
index cycles
three reversals
```

Three-reversal đặc biệt hữu ích khi bài có thể mô tả thành đổi `A B` thành `B A`.
