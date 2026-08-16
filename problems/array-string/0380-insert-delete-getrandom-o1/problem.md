# 380. Insert Delete GetRandom O(1)

## Difficulty / Độ khó

**Medium / Trung bình**

## Problem / Đề bài

> **EN:** Implement the RandomizedSet class:
>
> **VI:** Hãy cài đặt lớp `RandomizedSet`:

> **EN:** RandomizedSet() Initializes the RandomizedSet object.
>
> **VI:** `RandomizedSet()` khởi tạo đối tượng `RandomizedSet`.

> **EN:** bool insert(int val) Inserts an item val into the set if not present. Returns true if the item was not present, false otherwise.
>
> **VI:** `insert(int val)` chèn `val` nếu chưa tồn tại. Trả `true` nếu vừa chèn mới, ngược lại trả `false`.

> **EN:** bool remove(int val) Removes an item val from the set if present. Returns true if the item was present, false otherwise.
>
> **VI:** `remove(int val)` xóa `val` nếu đang tồn tại. Trả `true` nếu đã xóa, ngược lại trả `false`.

> **EN:** int getRandom() Returns a random element from the current set of elements (it's guaranteed that at least one element exists when this method is called). Each element must have the same probability of being returned.
>
> **VI:** `getRandom()` trả về một phần tử ngẫu nhiên trong set hiện tại. Đề đảm bảo set không rỗng khi gọi hàm này, và mọi phần tử phải có xác suất được chọn bằng nhau.

> **EN:** You must implement the functions of the class such that each function works in average O(1) time complexity.
>
> **VI:** Mỗi hàm phải hoạt động với độ phức tạp thời gian trung bình `O(1)`.

## Examples / Ví dụ

```text
Input
["RandomizedSet", "insert", "remove", "insert", "getRandom", "remove", "insert", "getRandom"]
[[], [1], [2], [2], [], [1], [2], []]

Output
[null, true, false, true, 2, true, false, 2]
```

> **EN:** `getRandom()` should return either 1 or 2 randomly while both values are present. After 1 is removed, 2 is the only value and `getRandom()` always returns 2.
>
> **VI:** Khi cả `1` và `2` cùng tồn tại, `getRandom()` có thể trả ngẫu nhiên `1` hoặc `2`. Sau khi xóa `1`, chỉ còn `2` nên `getRandom()` luôn trả `2`.

## Constraints / Ràng buộc

> **EN:** `-231 <= val <= 231 - 1`
>
> **VI:** `val` nằm trong miền số nguyên 32-bit có dấu.

> **EN:** At most 2 * 105 calls will be made to insert, remove, and getRandom.
>
> **VI:** Có tối đa `2 * 10^5` lời gọi tới `insert`, `remove` và `getRandom`.

> **EN:** There will be at least one element in the data structure when getRandom is called.
>
> **VI:** Luôn có ít nhất một phần tử khi `getRandom` được gọi.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/insert-delete-getrandom-o1/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```
