# 238. Product of Array Except Self — Solution

## 1. Core idea / Ý tưởng cốt lõi

Với mỗi index `i`:

```text
answer[i] = product of values left of i
          * product of values right of i
```

Ta xây tích bên trái trong lượt đầu và ghi trực tiếp vào `answer`. Lượt thứ hai đi từ phải sang trái, giữ một scalar `suffix` và nhân nó vào `answer[i]`.

```text
Time:  O(n)
Space: O(1) extra, excluding output
```

---

## 2. Why division is not needed

Cách `totalProduct / nums[i]` vừa bị cấm, vừa khó xử lý zero. Prefix/suffix không cần special-case zero: zero tự lan vào đúng các tích có chứa nó.

---

## 3. First pass — left product

Khởi tạo:

```text
prefix = 1
```

Tại index `i`, trước khi nhân `nums[i]`:

```text
prefix = product(nums[0 .. i-1])
```

nên:

```java
answer[i] = prefix;
prefix *= nums[i];
```

Sau lượt đầu, `answer[i]` chứa chính xác tích bên trái.

---

## 4. Second pass — right product

Khởi tạo:

```text
suffix = 1
```

Duyệt phải → trái. Trước khi nhân `nums[i]`:

```text
suffix = product(nums[i+1 .. n-1])
```

Do đó:

```java
answer[i] *= suffix;
suffix *= nums[i];
```

Sau phép nhân, `answer[i]` có cả left product và right product, tức là mọi phần tử trừ chính `nums[i]`.

---

## 5. Optimal Java solution

```java
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
```

---

## 6. Alternative approaches / Các hướng khác

### Prefix + suffix arrays

Tạo hai mảng riêng rồi nhân:

```text
Time: O(n)
Extra space: O(n)
```

Dễ hiểu nhưng không đạt follow-up mạnh nhất.

### Division

Có thể tính total product rồi chia, nhưng bị đề cấm và cần logic riêng cho zero.

### Output-as-prefix + scalar suffix

Đạt `O(n)` time và `O(1)` extra space ngoài output; đây là canonical solution.

---

## 7. Dry run

```text
nums = [1,2,3,4]
```

Sau lượt prefix:

```text
answer = [1,1,2,6]
```

Lượt suffix:

```text
i=3: suffix=1  -> answer[3]=6,  suffix=4
i=2: suffix=4  -> answer[2]=8,  suffix=12
i=1: suffix=12 -> answer[1]=12, suffix=24
i=0: suffix=24 -> answer[0]=24
```

Kết quả:

```text
[24,12,8,6]
```

---

## 8. Correctness / Vì sao đúng

Invariant lượt đầu: khi gán `answer[i]`, `prefix` bằng tích của toàn bộ phần tử có index nhỏ hơn `i`.

Invariant lượt hai: trước khi xử lý `i`, `suffix` bằng tích của toàn bộ phần tử có index lớn hơn `i`.

Vì vậy sau `answer[i] *= suffix`, giá trị tại `i` bằng tích của mọi phần tử bên trái nhân mọi phần tử bên phải — chính xác là tích của toàn bộ mảng ngoại trừ `nums[i]`.

---

## 9. Complexity

Hai lượt tuyến tính:

```text
Time: O(n)
```

Ngoài output chỉ dùng `prefix`, `suffix` và loop variables:

```text
Extra space: O(1)
```

---

## 10. Edge cases

- Một zero: chỉ vị trí zero có thể nhận tích khác zero.
- Hai zero trở lên: mọi output bằng zero.
- Số âm: dấu được xử lý tự nhiên bởi phép nhân.
- `n = 2`: output chỉ hoán đổi hai giá trị.

---

## 11. Common mistakes

1. Gán `answer[i]` sau khi nhân `nums[i]`, khiến tích chứa chính phần tử cần loại.
2. Update `suffix` trước khi nhân vào `answer[i]`.
3. Tạo suffix array dù follow-up yêu cầu `O(1)` extra space.
4. Dùng phép chia hoặc special-case zero không cần thiết.

---

## 12. Pattern recognition

Khi mỗi đáp án phụ thuộc vào **mọi phần tử trừ chính nó**, hãy thử tách contribution thành phần bên trái và bên phải, rồi nén một trong hai phía thành scalar running state.
