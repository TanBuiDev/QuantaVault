# 167. Two Sum II - Input Array Is Sorted — Solution

<!-- NEWBIE-FIRST-BRIDGE:START -->
## Newbie-first reasoning bridge

**Tự nhìn bài toán bằng ví dụ.** Array sorted cho phép loại nhiều pair sau một comparison. Nếu numbers[left]+numbers[right] quá nhỏ, giữ left cũ và giảm right chỉ làm sum còn nhỏ hơn, nên phải tăng left.

**Cách nghĩ tự nhiên → bottleneck → quan sát tối ưu.** HashMap O(n) time nhưng O(n) space; nested loops O(n²). Quan sát monotonicity của sorted array cho two pointers O(n), O(1): sum nhỏ move left, sum lớn move right.

**State / invariant / data structure cần hiểu trước code.** left/right bao toàn bộ candidate interval. Invariant sau mỗi move, mọi pair bị bỏ qua đã được chứng minh không thể đạt target dựa trên upper/lower sum monotonicity.

**Dry run mental theo implementation.** Dry run [2,7,11,15], target9: left=2,right=15 sum17 quá lớn -> right tới11 sum13 -> right tới7 sum9, trả indices 1-based [1,2].

**Lỗi thường gặp và khi nào dùng lại ý tưởng này.** Lỗi thường gặp là trả 0-based indices hoặc move sai pointer khi sum nhỏ/lớn. Khi nào dùng: pair sum trên sorted data thường cho elimination two pointers với proof monotonic.
<!-- NEWBIE-FIRST-BRIDGE:END -->

---

## 1. Core idea / Ý tưởng cốt lõi

Tính sorted biến bài Two Sum thành một quá trình điều chỉnh tổng có hướng.

Đặt hai pointer ở hai đầu:

```text
left = 0
right = n - 1
```

Với:

```text
sum = numbers[left] + numbers[right]
```

- `sum < target` → cần tổng lớn hơn → `left++`.
- `sum > target` → cần tổng nhỏ hơn → `right--`.
- bằng target → trả cặp index 1-based.

```text
Time: O(n)
Space: O(1) extra
```

---

## 2. Why moving `left` is safe when the sum is too small

Giả sử:

```text
numbers[left] + numbers[right] < target
```

Với fixed `left`, mọi index `r <= right` có:

```text
numbers[left] + numbers[r]
<= numbers[left] + numbers[right]
< target
```

Vì vậy `numbers[left]` không thể tạo target với bất kỳ phần tử nào còn lại. Ta loại `left` an toàn bằng `left++`.

Lập luận đối xứng khi tổng quá lớn: với fixed `right`, mọi `l >= left` đều tạo tổng ít nhất lớn như current sum, nên `right` không thể thuộc lời giải và có thể giảm.

---

## 3. Optimal Java solution

```java
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
```

Đề đảm bảo một solution duy nhất nên vòng lặp sẽ tìm thấy trước khi pointers gặp nhau.

---

## 4. Dry run

```text
numbers = [2,7,11,15], target = 9
```

Ngay bước đầu:

```text
left=0 -> 2
right=3 -> 15
sum=17 > 9
```

Giảm `right`:

```text
2 + 11 = 13 > 9
```

Giảm `right`:

```text
2 + 7 = 9
```

Trả `[1,2]`.

---

## 5. Alternatives

### Hash map

Two Sum thông thường có thể dùng map `value -> index` với `O(n)` time, nhưng dùng `O(n)` extra space và bỏ phí property sorted.

### Binary search cho mỗi index

Với mỗi `i`, binary-search `target - numbers[i]` trong suffix:

```text
Time: O(n log n)
Space: O(1)
```

Two pointers tốt hơn.

---

## 6. Correctness / Vì sao đúng

Mỗi lần tổng nhỏ hơn target, chứng minh ở mục 2 loại `left` mà không loại solution. Mỗi lần tổng lớn hơn target, lập luận đối xứng loại `right` mà không loại solution. Do đó invariant là cặp solution duy nhất luôn nằm trong interval `[left,right]` cho tới khi current pair chính là solution. Khi sum bằng target, returned indices đúng và distinct vì `left < right`.

---

## 7. Complexity

Mỗi iteration di chuyển đúng một pointer vào trong; tổng số move tối đa `n-1`:

```text
Time: O(n)
Extra space: O(1)
```

Output array hai phần tử không tính vào auxiliary space.

---

## 8. Common mistakes

1. Quên output là 1-based.
2. Dùng cùng một element hai lần khi `left == right`.
3. Khi `sum < target` lại giảm `right`, làm tổng chỉ nhỏ hơn hoặc bằng.
4. Dùng hash map dù đề yêu cầu constant extra space.

---

## 9. Pattern recognition

Khi array sorted và một function của hai đầu có monotonic behavior, opposite-direction two pointers thường cho phép loại một candidate mỗi bước.
