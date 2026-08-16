# 1. Two Sum — Solution

## 1. Core idea / Ý tưởng cốt lõi

Brute force thử mọi pair tốn `O(n²)`. Ta đổi bài toán từ “tìm hai số” thành “với current number, complement cần thiết đã xuất hiện chưa?”.

```text
complement = target - nums[i]
```

Hash map lưu các value đã thấy cùng index của chúng.

---

## 2. Algorithm

```java
Map<Integer,Integer> seen = new HashMap<>();

for (int i = 0; i < nums.length; i++) {
    int complement = target - nums[i];
    if (seen.containsKey(complement)) {
        return new int[]{seen.get(complement), i};
    }
    seen.put(nums[i], i);
}
```

---

## 3. Why lookup before insert matters

Ví dụ current value là `3` và target là `6`. Nếu insert current `3` trước rồi lookup complement `3`, code có thể tìm chính current index và vi phạm “may not use the same element twice”.

Lookup trước chỉ nhìn thấy các index **strictly trước `i`**, nên hai index luôn khác nhau.

Case `[3,3]` vẫn hoạt động: `3` đầu tiên được insert; khi tới `3` thứ hai, complement `3` đã có ở index `0`.

---

## 4. Correctness / Vì sao đúng

Invariant: trước iteration `i`, map chứa một index cho mỗi value đã xuất hiện trong prefix `0..i-1`.

Nếu complement của `nums[i]` nằm trong map, pair đó có hai index khác nhau và tổng đúng target nên là lời giải. Nếu chưa có, current value được thêm để phục vụ các phần tử tương lai. Với lời giải duy nhất `(j,i)` và `j<i`, khi scan tới `i`, `nums[j]` đã nằm trong map nên pair chắc chắn được tìm thấy.

---

## 5. Complexity

```text
Time: O(n) average
Space: O(n)
```

Mỗi element có một lookup và một insert hash-map trung bình `O(1)`.

---

## 6. Common mistakes

- Brute force `O(n²)` khi follow-up muốn nhanh hơn.
- Insert current value trước lookup và vô tình dùng cùng index hai lần.
- Lưu complement sai chiều hoặc trả values thay vì indices.
- Quên duplicate values vẫn có thể là đáp án.
