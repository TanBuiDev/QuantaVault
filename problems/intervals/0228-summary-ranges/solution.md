# 228. Summary Ranges — Solution

## 1. Core idea / Ý tưởng cốt lõi

Vì `nums` sorted và unique, ta chỉ cần nén từng run consecutive thành một range. Giữ `start` và `end`; số mới nối được vào run iff nó bằng `end + 1`.

## 2. Algorithm

```java
List<String> answer = new ArrayList<>();
if (nums.length == 0) return answer;

int start = nums[0];
int end = nums[0];

for (int i = 1; i < nums.length; i++) {
    if ((long) nums[i] == (long) end + 1L) {
        end = nums[i];
    } else {
        answer.add(format(start, end));
        start = end = nums[i];
    }
}
answer.add(format(start, end));
```

`format(a,b)` trả `"a"` nếu bằng nhau, ngược lại `"a->b"`.

## 3. Why the long cast matters

Nếu `end == Integer.MAX_VALUE`, biểu thức `end + 1` bằng `int` sẽ overflow. Cast sang `long` trước phép cộng giữ so sánh đúng ở biên 32-bit.

## 4. Correctness / Vì sao đúng

Invariant: trước khi xử lý `nums[i]`, `[start,end]` là maximal consecutive run của prefix chưa được output. Nếu `nums[i] == end+1`, nó phải thuộc cùng range và việc mở rộng giữ range chính xác. Nếu có gap, không integer range nào có thể nối hai phần mà không chứa số thiếu, nên current run phải kết thúc và được output. Sau loop, output run cuối. Vì mọi element thuộc đúng một run maximal, answer là cover nhỏ nhất và chính xác.

## 5. Complexity

```text
Time: O(n)
Extra space: O(1) excluding output
```

## 6. Edge cases / Common mistakes

- Empty input.
- Single element range.
- Negative numbers.
- Integer boundaries.
- Quên flush range cuối sau loop.
