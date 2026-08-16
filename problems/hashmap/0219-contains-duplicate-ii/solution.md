# 219. Contains Duplicate II — Solution

## 1. Core idea / Ý tưởng cốt lõi

Với mỗi value, để tìm duplicate gần nhất về phía trước, chỉ cần biết occurrence **gần nhất** đã thấy. Mọi occurrence cũ hơn luôn có khoảng cách lớn hơn.

## 2. Algorithm

```java
Map<Integer,Integer> lastSeen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    Integer previous = lastSeen.get(nums[i]);
    if (previous != null && i - previous <= k) {
        return true;
    }
    lastSeen.put(nums[i], i);
}
return false;
```

## 3. Why keeping only the latest index is enough

Giả sử value `x` xuất hiện ở `p1 < p2 < i`. Nếu `i-p2 > k` thì `i-p1` còn lớn hơn, nên occurrence cũ không thể cứu được. Nếu có occurrence nào có thể thỏa khoảng cách, occurrence gần nhất là candidate tốt nhất.

Do đó ta có thể overwrite old index an toàn.

## 4. Correctness / Vì sao đúng

Khi xử lý index `i`, map chứa latest index của `nums[i]` trong prefix. Nếu distance tới latest occurrence `<=k`, ta tìm được pair hợp lệ. Nếu distance lớn hơn `k`, mọi occurrence cũ hơn còn xa hơn nên không pair nào kết thúc tại `i` hợp lệ. Update latest index bảo toàn invariant cho các index sau.

## 5. Complexity

```text
Time: O(n) average
Space: O(n)
```

## 6. Alternative sliding-window set

Có thể duy trì set chứa tối đa `k` phần tử gần nhất: trước khi thêm current value, nếu nó đã trong set thì trả true; loại phần tử rời window. Cũng `O(n)` average và `O(min(n,k))` space.

## 7. Common mistakes

- Chỉ detect duplicate mà quên distance constraint.
- Lưu first occurrence thay vì latest occurrence.
- Dùng `abs` không cần thiết khi scan trái→phải; previous luôn nhỏ hơn current.
- Quên `k=0` không thể có hai distinct indices với distance `0`.
