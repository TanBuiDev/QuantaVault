# 167. Two Sum II - Input Array Is Sorted — Solution

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

## 3. Algorithm

```java
while (left < right) {
    int sum = numbers[left] + numbers[right];

    if (sum == target) return new int[]{left + 1, right + 1};
    if (sum < target) left++;
    else right--;
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
