# 27. Remove Element

## Difficulty / Độ khó

**Easy / Dễ**

## Problem / Đề bài

> **EN:** Given an integer array `nums` and an integer `val`, `remove` all occurrences of `val` in `nums` in-place. The order of the elements may be changed. Then return the number of elements in `nums` which are not equal to `val`.
>
> **VI:** Cho mảng số nguyên `nums` và số nguyên `val`, hãy xóa mọi lần xuất hiện của `val` khỏi `nums` **tại chỗ (in-place)**. Thứ tự các phần tử có thể thay đổi. Sau đó trả về số lượng phần tử trong `nums` không bằng `val`.

> **EN:** Consider the number of elements in `nums` which are not equal to `val` be `k`, to get accepted, you need to do the following things:
>
> **VI:** Gọi số phần tử trong `nums` không bằng `val` là `k`. Để được chấp nhận, bạn cần thực hiện các yêu cầu sau:

> **EN:** Change the array `nums` such that the first `k` elements of `nums` contain the elements which are not equal to `val`. The remaining elements of `nums` are not important as well as the size of `nums`.
>
> **VI:** Thay đổi `nums` sao cho `k` phần tử đầu tiên chứa các giá trị không bằng `val`. Các phần tử sau `k` không quan trọng, và kích thước vật lý của mảng cũng không cần thay đổi.

> **EN:** Return `k`.
>
> **VI:** Trả về `k`.

## Custom Judge / Bộ chấm tùy chỉnh

> **EN:** The judge will test your solution with the following code:
>
> **VI:** Bộ chấm sẽ kiểm tra lời giải theo logic sau:

```java
int[] nums = [...]; // Input array
int val = ...; // Value to remove
int[] expectedNums = [...]; // The expected answer with correct length.
                            // It is sorted with no values equaling val.

int k = removeElement(nums, val); // Calls your implementation

assert k == expectedNums.length;
sort(nums, 0, k); // Sort the first k elements of nums
for (int i = 0; i < actualLength; i++) {
    assert nums[i] == expectedNums[i];
}
```

> **EN:** If all assertions pass, then your solution will be accepted.
>
> **VI:** Nếu tất cả assertion đều đúng thì lời giải được chấp nhận.

## Examples / Ví dụ

### Example 1 / Ví dụ 1

**Input / Đầu vào**

```text
nums = [3,2,2,3], val = 3
```

**Output / Đầu ra**

```text
2, nums = [2,2,_,_]
```

> **EN:** Explanation: Your function should return `k = 2`, with the first two elements of `nums` being `2`. It does not matter what you leave beyond the returned `k` (hence they are underscores).
>
> **VI:** Giải thích: Hàm phải trả về `k = 2`, với hai phần tử đầu của `nums` đều bằng `2`. Phần sau vị trí `k` không quan trọng nên được biểu diễn bằng dấu gạch dưới.

### Example 2 / Ví dụ 2

**Input / Đầu vào**

```text
nums = [0,1,2,2,3,0,4,2], val = 2
```

**Output / Đầu ra**

```text
5, nums = [0,1,4,0,3,_,_,_]
```

> **EN:** Explanation: Your function should return `k = 5`, with the first five elements of `nums` containing `0, 0, 1, 3, and 4`. Note that the five elements can be returned in any order. It does not matter what you leave beyond the returned `k`.
>
> **VI:** Giải thích: Hàm phải trả về `k = 5`; năm phần tử đầu phải chứa `0, 0, 1, 3, 4`. Năm phần tử này có thể ở bất kỳ thứ tự nào. Phần còn lại sau `k` không quan trọng.

## Constraints / Ràng buộc

> **EN:** `0 <= `nums`.length <= 100`
>
> **VI:** Độ dài `nums` từ `0` đến `100`.

> **EN:** `0 <= `nums[i]` <= 50`
>
> **VI:** Mỗi `nums[i]` nằm từ `0` đến `50`.

> **EN:** `0 <= `val` <= 100`
>
> **VI:** `val` nằm từ `0` đến `100`.

## Source / Nguồn

LeetCode: https://leetcode.com/problems/remove-element/

English problem wording is preserved from the user-supplied source:

```text
raw/top-interview-150/Array  String.txt
blob SHA: b1c7a453f152629ce35040af85f2b1f4c22f589e
```

Bản tiếng Việt được thêm theo `docs/content/bilingual-style-guide.md`.
